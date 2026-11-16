"""Scene loading: materials, the parent/child tree, own-region volumes,
point membership, and rejection of scenes the contract does not define."""
import copy
import math

import numpy as np
import pytest

import hand
from gravcam.scene import SceneError, load_scene, scene_from_dict

EARTH_CHAIN = ["earth", "upper-mantle", "lower-mantle", "outer-core", "inner-core"]


def test_loads_the_first_scene(scene, raw_scene):
    assert scene.name == "sun-at-midnight"
    assert scene.ids == tuple(o["id"] for o in raw_scene["objects"])
    assert scene.observer.dtype == np.float64
    assert scene.observer.tolist() == [float(v) for v in raw_scene["observer"]["position"]]
    assert scene.centers.dtype == np.float64 and scene.radii.dtype == np.float64


def test_materials_are_resolved(scene, raw_scene):
    for obj in scene.objects:
        spec = hand.material_of(raw_scene, obj.id)
        assert obj.material.density == spec["density"]
        assert obj.material.temperature == spec["temperature"]
        assert obj.material.friction == spec.get("friction")
        assert obj.material.luminosity == spec.get("luminosity")
    assert scene["sun-core"].material.friction is None
    assert scene["sun-core"].material.luminosity == 1.0e8
    assert scene["sun"].material.friction == 0.0


def test_tree(scene):
    assert scene.roots == ("earth", "sun", "moon")
    for depth, (object_id, parent) in enumerate(zip(EARTH_CHAIN, [None] + EARTH_CHAIN[:-1])):
        assert scene[object_id].parent == parent
        assert scene[object_id].depth == depth
    for parent, child in zip(EARTH_CHAIN[:-1], EARTH_CHAIN[1:]):
        assert scene[parent].children == (child,)
    assert scene["inner-core"].children == ()
    assert scene["sun"].children == ("sun-core",) and scene["sun"].depth == 0
    assert scene["sun-core"].parent == "sun" and scene["sun-core"].depth == 1
    assert scene.subtree("earth") == tuple(EARTH_CHAIN)
    assert scene.subtree("outer-core") == ("outer-core", "inner-core")
    assert scene.subtree("sun") == ("sun", "sun-core")
    assert scene["moon-core"].parent == "moon" and scene["moon"].children == ("moon-core",)


def test_own_volumes_are_shells(scene, raw_scene):
    radii = [hand.radius_of(raw_scene, object_id) for object_id in EARTH_CHAIN]
    for object_id, outer, inner in zip(EARTH_CHAIN, radii, radii[1:] + [0.0]):
        # (4 pi / 3)(R - r)(R^2 + R r + r^2): the shell volume without the
        # cancellation of two cubes, so the comparison is good to ~1e-13
        shell = 4.0 * math.pi / 3.0 * (outer - inner) * (outer * outer + outer * inner + inner * inner)
        assert scene[object_id].own_volume == pytest.approx(shell, rel=1e-12)
    r_sun, r_core = hand.radius_of(raw_scene, "sun"), hand.radius_of(raw_scene, "sun-core")
    assert scene["sun-core"].own_volume == pytest.approx(hand.ball_volume(r_core), rel=1e-15)
    assert scene["sun"].own_volume == pytest.approx(hand.ball_volume(r_sun) - hand.ball_volume(r_core), rel=1e-14)


def test_own_volumes_add_up_to_the_root_shape(scene):
    for root in scene.roots:
        total = math.fsum(scene[object_id].own_volume for object_id in scene.subtree(root))
        assert total == pytest.approx(scene[root].shape.volume, rel=1e-13)
    assert all(obj.own_volume > 0 for obj in scene.objects)


def test_locate_innermost_object(scene, raw_scene):
    def owner(point):
        found = scene.object_at(point)
        return None if found is None else found.id

    assert owner(scene.observer) is None                       # 2 m above the ground
    assert owner([0.0, 6370999.0, 0.0]) == "earth"             # 1 m into the crust
    assert owner([0.0, 6345999.0, 0.0]) == "upper-mantle"
    assert owner([5000000.0, 0.0, 0.0]) == "lower-mantle"
    assert owner([0.0, 0.0, -2000000.0]) == "outer-core"
    assert owner([0.0, 0.0, 0.0]) == "inner-core"
    assert owner([0.0, 7000000.0, 0.0]) is None
    sun = np.array(hand.center_of(raw_scene, "sun"))
    assert owner(sun) == "sun-core"
    assert owner(sun + [0.0, 0.0, 0.5 * hand.radius_of(raw_scene, "sun")]) == "sun"
    assert owner(sun + [0.0, 1.5 * hand.radius_of(raw_scene, "sun"), 0.0]) is None


def test_locate_is_vectorised(scene):
    points = np.array([[[0.0, 0.0, 0.0], [0.0, 6370999.0, 0.0]], [[0.0, 7e6, 0.0], [5e6, 0.0, 0.0]]])
    found = scene.locate(points)
    assert found.shape == (2, 2)
    assert found.tolist() == [[scene.index("inner-core"), scene.index("earth")], [-1, scene.index("lower-mantle")]]


def test_locate_agrees_with_smallest_containing_sphere(scene):
    # an independent rule: for nested spheres the innermost object is the smallest containing sphere
    rng = np.random.default_rng(5)
    for center, extent in ((np.zeros(3), 7.0e6), (scene.centers[scene.index("sun")], 8.0e8)):
        points = center + rng.uniform(-extent, extent, size=(20000, 3))
        distance = np.linalg.norm(points[:, None, :] - scene.centers[None, :, :], axis=2)
        size = np.where(distance <= scene.radii, scene.radii, np.inf)
        expected = np.where(np.isfinite(size.min(axis=1)), size.argmin(axis=1), -1)
        assert np.array_equal(scene.locate(points), expected)
        assert len(set(expected.tolist())) >= 3            # the sample really covers several regions


# --- scenes the contract does not define are refused --------------------------------

def minimal():
    return {
        "name": "test",
        "observer": {"position": [0, 0, 10]},
        "materials": {
            "rock": {"density": 3000, "temperature": 300, "friction": 1e-3},
            "iron": {"density": 8000, "temperature": 1000, "friction": 1e-3},
        },
        "objects": [
            {"id": "ball", "shape": {"type": "sphere", "center": [0, 0, 0], "radius": 2}, "material": "rock"},
            {"id": "pit", "parent": "ball", "shape": {"type": "sphere", "center": [0.5, 0, 0], "radius": 1},
             "material": "iron"},
        ],
    }


def test_minimal_scene_with_off_centre_child():
    scene = scene_from_dict(minimal())
    assert scene["ball"].own_volume == pytest.approx(hand.ball_volume(2) - hand.ball_volume(1), rel=1e-15)
    assert scene.object_at([0.5, 0.0, 0.0]).id == "pit"
    assert scene.object_at([-1.5, 0.0, 0.0]).id == "ball"


def broken(change):
    data = copy.deepcopy(minimal())
    change(data)
    return data


@pytest.mark.parametrize("change, message", [
    (lambda d: d["objects"][1].update(material="wood"), "unknown material"),
    (lambda d: d["objects"][1].update(parent="nowhere"), "unknown parent"),
    (lambda d: d["objects"][1]["shape"].update(center=[1.5, 0, 0]), "entirely inside"),
    (lambda d: d["objects"][1]["shape"].update(radius=3), "entirely inside"),
    (lambda d: d["objects"].append(dict(d["objects"][1])), "duplicate object id"),
    (lambda d: d["objects"][0].update(parent="pit"), "cycle"),
    (lambda d: d["objects"][1]["shape"].update(type="capsule"), "unsupported shape"),
    (lambda d: d["objects"][1]["shape"].update(radius=-1), "radius must be positive"),
    (lambda d: d["objects"].append({"id": "pit2", "parent": "ball", "material": "iron",
                                    "shape": {"type": "sphere", "center": [0, 0, 0], "radius": 0.9}}), "overlap"),
    (lambda d: d["objects"].append({"id": "moon", "material": "rock",
                                    "shape": {"type": "sphere", "center": [3, 0, 0], "radius": 1.5}}), "overlap"),
    (lambda d: d["materials"]["rock"].pop("density"), "density"),
    (lambda d: d["materials"]["rock"].pop("temperature"), "temperature"),
    (lambda d: d["materials"]["rock"].update(temperature=-5), "negative"),
    (lambda d: d.pop("observer"), "observer"),
])
def test_invalid_scenes_are_rejected(change, message):
    with pytest.raises(SceneError, match=message):
        scene_from_dict(broken(change))


def test_touching_siblings_are_allowed():
    data = minimal()
    data["objects"].append({"id": "moon", "material": "rock",
                            "shape": {"type": "sphere", "center": [3.5, 0, 0], "radius": 1.5}})
    assert scene_from_dict(data).roots == ("ball", "moon")


def test_load_scene_accepts_str_and_path(scene_path):
    assert load_scene(str(scene_path)).ids == load_scene(scene_path).ids
