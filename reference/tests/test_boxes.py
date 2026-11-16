"""Axis-aligned boxes (scene format v1): loading and validation, own-region
volumes, point membership, ray crossings, and columns through scenes that mix
boxes and spheres.

Tolerances for the ray-box crossings. The slab method computes a crossing as
(face - origin) / direction component: one subtraction and one division, each
exactly rounded, so a crossing distance t carries a relative error of about
2e-16 from the arithmetic plus the rounding of the unit direction itself
(another 1e-16 of t per component). The hand cases below are asserted to
rel 1e-15. Against brute force the comparison is limited by the brute force:

* dense midpoint sum, 2^20 cells over the box's bounding interval: off by at
  most one cell h per ray (half a cell at each of two crossings). Rigorous.
* boundary-refined sum: each boundary is bracketed to 8 float64 spacings of
  the distance, and the membership test (|p - c| <= half) is itself rounded at
  the spacing of the coordinates divided by the cosine of incidence; the
  tests allow 1e-12 of the distance scale, about 1000 spacings (observed:
  below 1e-14).
"""
import copy
import math

import numpy as np
import pytest

import hand
from bruteforce import BruteScene
from gravcam import columns, emission
from gravcam.scene import Box, SceneError, Sphere, scene_from_dict, shape_inside, shapes_overlap
from mixed import mixed
from tolerances import crossing_slack, radial_roundoff


def unit(v):
    v = np.asarray(v, float)
    return v / np.linalg.norm(v)


# --- loading the room scenes ------------------------------------------------------------

def test_room_scenes_load(room, raw_room):
    assert room.name == raw_room["name"]
    assert room.ids == tuple(o["id"] for o in raw_room["objects"])
    assert room.environment == raw_room["environment"] == "room"
    assert room.exclusion == raw_room["observer"]["exclusion"]
    assert room.observer.tolist() == [float(v) for v in raw_room["observer"]["position"]]
    for obj, spec in zip(room.objects, raw_room["objects"]):
        assert isinstance(obj.shape, Box if spec["shape"]["type"] == "box" else Sphere)
        assert list(obj.shape.center) == [float(v) for v in spec["shape"]["center"]]
        assert obj.parent == spec.get("parent")
        assert obj.material.density == raw_room["materials"][spec["material"]]["density"]
        assert list(obj.children) == hand.children_of(raw_room, obj.id)
        if spec["shape"]["type"] == "box":
            assert list(obj.shape.size) == [float(v) for v in spec["shape"]["size"]]
    assert any(room.is_box)


def test_room_scene_arrays(room, raw_room):
    for k, object_id in enumerate(room.ids):
        if hand.is_box(raw_room, object_id):
            low, high = hand.faces_of(raw_room, object_id)
            assert room.lows[k].tolist() == low and room.highs[k].tolist() == high
            assert math.isnan(room.radii[k])
        else:
            assert room.radii[k] == hand.radius_of(raw_room, object_id)
            assert np.isnan(room.lows[k]).all() and np.isnan(room.highs[k]).all()


def test_defaults_of_the_v1_fields(scene):
    # the first scene has neither key: exclusion 0.25 m, night sky
    assert scene.exclusion == 0.25 and scene.environment == "night-sky"
    assert not scene.is_box.any()


def test_depths_follow_the_parent_chain(room, raw_room):
    parents = {o["id"]: o.get("parent") for o in raw_room["objects"]}
    for obj in room.objects:
        depth, node = 0, obj.id
        while parents[node] is not None:
            node, depth = parents[node], depth + 1
        assert obj.depth == depth
    if any(parents.values()):
        assert max(obj.depth for obj in room.objects) >= 1


def test_own_volumes(room, raw_room):
    for obj in room.objects:
        assert obj.own_volume == pytest.approx(hand.own_volume(raw_room, obj.id), rel=1e-14)
        assert obj.own_volume > 0
    for root in room.roots:
        total = math.fsum(room[i].own_volume for i in room.subtree(root))
        assert total == pytest.approx(hand.shape_volume(raw_room, root), rel=1e-14)


def test_wall_thickness_and_shell_volumes_by_hand(raw_safe_scene, safe_scene, raw_tank_scene, tank_scene):
    """The steel of a safe is outer box minus cavity; of a tank, a spherical
    shell (4 pi / 3)(R - r)(R^2 + R r + r^2). Sizes are read from the files."""
    for safe in ("safe-left", "safe-right"):
        (cavity,) = hand.children_of(raw_safe_scene, safe)
        outer, inner = hand.size_of(raw_safe_scene, safe), hand.size_of(raw_safe_scene, cavity)
        steel = outer[0] * outer[1] * outer[2] - inner[0] * inner[1] * inner[2]
        assert safe_scene[safe].own_volume == pytest.approx(steel, rel=1e-14)
        assert hand.center_of(raw_safe_scene, safe) == hand.center_of(raw_safe_scene, cavity)
        assert [0.5 * (a - b) for a, b in zip(outer, inner)] == pytest.approx([0.05] * 3, rel=1e-12)   # 5 cm walls
    for tank in ("tank-left", "tank-middle", "tank-right"):
        (contents,) = hand.children_of(raw_tank_scene, tank)
        R, r = hand.radius_of(raw_tank_scene, tank), hand.radius_of(raw_tank_scene, contents)
        shell = 4.0 * math.pi / 3.0 * (R - r) * (R * R + R * r + r * r)
        assert tank_scene[tank].own_volume == pytest.approx(shell, rel=1e-12)
        assert R - r == pytest.approx(0.01, rel=1e-12)                                                 # 1 cm walls


# --- point membership -----------------------------------------------------------------

def test_locate_named_points(room, raw_room):
    """The centre of a childless object is its own; just inside the wall of an
    object with a concentric child is the object itself; far away is vacuum."""
    for obj in raw_room["objects"]:
        object_id, center = obj["id"], np.array(hand.center_of(raw_room, obj["id"]))
        if not hand.children_of(raw_room, object_id):
            assert room.object_at(center).id == object_id
        if hand.is_box(raw_room, object_id):
            reach = 0.5 * hand.size_of(raw_room, object_id)[0]
        else:
            reach = hand.radius_of(raw_room, object_id)
        assert room.object_at(center + [reach * (1 - 1e-9), 0.0, 0.0]).id == object_id
        # the surface counts as inside; centre + reach can round to just beyond it,
        # so step back to the last float that is on or inside the surface
        surface = center + [reach, 0.0, 0.0]
        while abs(surface[0] - center[0]) > reach:
            surface[0] = np.nextafter(surface[0], center[0])
        assert room.object_at(surface) is not None
    assert room.object_at(room.observer) is None
    assert room.object_at([0.0, 100.0, 0.0]) is None


def brute_owner(raw, points):
    """Innermost object by an independent rule: the smallest containing shape."""
    best = np.full(len(points), -1)
    best_volume = np.full(len(points), np.inf)
    for k, obj in enumerate(raw["objects"]):
        offset = points - np.array(obj["shape"]["center"], float)
        if obj["shape"]["type"] == "box":
            inside = np.all(np.abs(offset) <= 0.5 * np.array(obj["shape"]["size"], float), axis=1)
        else:
            inside = np.linalg.norm(offset, axis=1) <= obj["shape"]["radius"]
        volume = hand.shape_volume(raw, obj["id"])
        better = inside & (volume < best_volume)
        best[better], best_volume[better] = k, volume
    return best


def test_locate_agrees_with_smallest_containing_shape(room, raw_room):
    rng = np.random.default_rng(21)
    everywhere = rng.uniform([-7, -1, -12], [7, 6, 4], size=(40000, 3))
    # and dense clouds around every object: where the nesting is, and where a
    # thin object (a poster, a mirror) would be missed by uniform sampling
    clouds = [np.array(hand.center_of(raw_room, o["id"])) + rng.uniform(-0.6, 0.6, size=(4000, 3))
              for o in raw_room["objects"]]
    points = np.concatenate([everywhere, *clouds])
    expected = brute_owner(raw_room, points)
    assert np.array_equal(room.locate(points), expected)
    assert set(expected.tolist()) == set(range(-1, len(room))), "every region and vacuum are sampled"


def test_locate_in_the_mixed_scene():
    raw = mixed()
    scene = scene_from_dict(raw)
    rng = np.random.default_rng(22)
    points = rng.uniform([-2.5, -2, -2], [5, 2.5, 1.5], size=(60000, 3))
    expected = brute_owner(raw, points)
    assert np.array_equal(scene.locate(points), expected)
    assert set(expected.tolist()) == set(range(-1, len(scene)))
    assert scene.object_at([-0.9, 0.1, 0.2]).id == "ingot"
    assert scene.object_at([-0.8, 0.2, 0.85]).id == "bubble"         # in the sphere, beside the ingot
    assert scene.object_at([1.9, 1.4, 0.9]).id == "crate"            # a corner of the crate
    assert scene.object_at([3.4, 1.1, -0.4]).id == "core"
    assert scene.object_at([3.5, 1.0, 0.6]).id == "ball"


def test_mixed_scene_volumes():
    scene = scene_from_dict(mixed())
    ball = lambda r: 4.0 * math.pi * r**3 / 3.0
    assert scene["crate"].own_volume == pytest.approx(4 * 3 * 2 - ball(0.8) - 0.8 * 1.2 * 0.9, rel=1e-14)
    assert scene["bubble"].own_volume == pytest.approx(ball(0.8) - 0.6 * 0.4 * 0.5, rel=1e-14)
    assert scene["ingot"].own_volume == pytest.approx(0.6 * 0.4 * 0.5, rel=1e-15)
    assert scene["ball"].own_volume == pytest.approx(ball(1.2) - 0.9 * 0.8 * 0.7, rel=1e-14)
    assert [scene[i].depth for i in scene.ids] == [0, 1, 2, 1, 0, 1]


# --- containment and overlap of mixed shapes ----------------------------------------------

BOX = Box(center=(0.0, 0.0, 0.0), size=(4.0, 2.0, 2.0))
BALL = Sphere(center=(0.0, 0.0, 0.0), radius=3.0)


@pytest.mark.parametrize("child, outer, expected", [
    (Box((1.0, 0.0, 0.0), (2.0, 2.0, 2.0)), BOX, True),                    # shares three pairs of faces
    (Box((1.0, 0.0, 0.0), (2.0 + 1e-9, 2.0, 2.0)), BOX, False),            # sticks out by half a nanometre
    (Box((1.5, 0.0, 0.0), (2.0, 1.0, 1.0)), BOX, False),
    (Sphere((1.0, 0.0, 0.0), 1.0), BOX, True),                             # touches four faces
    (Sphere((1.0, 0.0, 0.0), 1.0 + 1e-9), BOX, False),
    (Sphere((1.5, 0.0, 0.0), 0.8), BOX, False),
    (Box((0.0, 0.0, 0.0), (4.0, 2.0, 4.0)), BALL, True),                   # corners at sqrt(4 + 1 + 4) = 3: on the sphere
    (Box((0.0, 0.0, 0.0), (4.0, 2.0, 4.0 + 1e-9)), BALL, False),
    (Box((2.0, 0.0, 0.0), (1.0, 1.0, 1.0)), BALL, True),                   # farthest corner at sqrt(6.25 + 0.5) = 2.6
    (Box((2.5, 0.0, 0.0), (1.0, 1.0, 1.0)), BALL, False),                  # centre inside, corner at 3.08
    (Sphere((1.0, 0.0, 0.0), 2.0), BALL, True),
    (Sphere((1.0, 0.0, 0.0), 2.0 + 1e-9), BALL, False),
])
def test_shape_inside(child, outer, expected):
    assert shape_inside(child, outer) is expected


@pytest.mark.parametrize("a, b, expected", [
    (BOX, Box((4.0, 0.0, 0.0), (4.0, 2.0, 2.0)), False),                   # share a face
    (BOX, Box((4.0 - 1e-9, 0.0, 0.0), (4.0, 2.0, 2.0)), True),
    (BOX, Box((3.0, 2.0, 2.0), (2.0, 2.0, 2.0)), False),                   # share an edge
    (BOX, Box((1.0, 0.5, 0.5), (0.2, 0.2, 0.2)), True),                    # one inside the other
    (BOX, Sphere((3.0, 0.0, 0.0), 1.0), False),                            # sphere touches a face
    (BOX, Sphere((3.0 - 1e-9, 0.0, 0.0), 1.0), True),
    (BOX, Sphere((3.0, 2.0, 0.0), math.sqrt(2.0)), False),                 # sphere touches an edge
    (BOX, Sphere((3.0, 2.0, 0.0), math.sqrt(2.0) + 1e-9), True),
    (BOX, Sphere((3.0, 2.0, 2.0), 1.7), False),                            # corner at distance sqrt(3) = 1.732
    (BOX, Sphere((3.0, 2.0, 2.0), 1.74), True),
    (BOX, Sphere((0.5, 0.2, 0.1), 0.1), True),                             # sphere inside the box
    (BALL, Sphere((5.0, 0.0, 0.0), 2.0), False),
    (BALL, Sphere((5.0, 0.0, 0.0), 2.0 + 1e-9), True),
])
def test_shapes_overlap(a, b, expected):
    assert shapes_overlap(a, b) is expected
    assert shapes_overlap(b, a) is expected


def broken(change):
    data = mixed()
    change(data)
    return data


def by_id(data, object_id):
    return next(o for o in data["objects"] if o["id"] == object_id)


@pytest.mark.parametrize("change, message", [
    (lambda d: by_id(d, "slot")["shape"].update(center=[1.7, -0.5, 0.3]), "entirely inside"),       # box out of a box
    (lambda d: by_id(d, "bubble")["shape"].update(radius=1.0), "entirely inside"),                  # sphere out of a box
    (lambda d: by_id(d, "ingot")["shape"].update(size=[0.6, 0.4, 1.4]), "entirely inside"),         # box out of a sphere
    (lambda d: by_id(d, "slot")["shape"].update(center=[0.3, -0.5, 0.3]), "overlap"),               # box into a sphere
    (lambda d: by_id(d, "ball")["shape"].update(center=[3.0, 1.0, -0.5]), "overlap"),               # sphere into a box
    (lambda d: d["objects"].append({"id": "lid", "material": "rock",
                                    "shape": {"type": "box", "center": [0, 1.9, 0], "size": [1, 1, 1]}}), "overlap"),
    (lambda d: by_id(d, "slot")["shape"].update(size=[0.8, -1.2, 0.9]), "size must be positive"),
    (lambda d: by_id(d, "slot")["shape"].update(size=[0.8, 0.0, 0.9]), "size must be positive"),
    (lambda d: by_id(d, "slot")["shape"].pop("size"), "needs 'center' and 'size'"),
    (lambda d: by_id(d, "slot")["shape"].update(size=[1, 2]), "three numbers"),
    (lambda d: by_id(d, "slot")["shape"].update(type="capsule"), "unsupported shape"),
    (lambda d: d["observer"].update(exclusion=0), "exclusion must be positive"),
    (lambda d: d["observer"].update(exclusion=-0.25), "exclusion must be positive"),
    (lambda d: d["observer"].update(exclusion="near"), "exclusion must be a number"),
    (lambda d: d.update(environment="street"), "environment"),
])
def test_invalid_mixed_scenes_are_rejected(change, message):
    with pytest.raises(SceneError, match=message):
        scene_from_dict(broken(change))


def test_touching_is_allowed():
    data = mixed()
    data["objects"].append({"id": "lid", "material": "rock",                    # stands on the crate's top face
                            "shape": {"type": "box", "center": [0, 2.0, 0], "size": [1, 1, 1]}})
    data["objects"].append({"id": "marble", "material": "iron",                 # rests on the lid
                            "shape": {"type": "sphere", "center": [0, 2.75, 0], "radius": 0.25}})
    by_id(data, "slot")["shape"].update(center=[1.6, -0.9, 0.3])                # flush with two of the crate's faces
    scene = scene_from_dict(data)
    assert scene.roots == ("crate", "ball", "lid", "marble")


def test_objects_in_the_room_scenes_touch_the_floor(room, raw_room):
    """What the validation must accept: safes and walls share a face or an
    edge with the floor, the tanks touch it in a point."""
    floor_top = hand.faces_of(raw_room, "floor")[1][1]
    resting = 0
    for obj in raw_room["objects"]:
        if obj.get("parent") or obj["id"] == "floor":
            continue
        if hand.is_box(raw_room, obj["id"]):
            bottom = hand.faces_of(raw_room, obj["id"])[0][1]
        else:
            bottom = hand.center_of(raw_room, obj["id"])[1] - hand.radius_of(raw_room, obj["id"])
        assert bottom >= floor_top - 1e-12
        resting += abs(bottom - floor_top) <= 1e-12
    assert resting >= 3


# --- one ray, one box ------------------------------------------------------------------

B_CENTER, B_SIZE = (5.0, 0.0, 0.0), (2.0, 2.0, 2.0)         # the cube 4 <= x <= 6, |y|, |z| <= 1
ORIGIN = (0.0, 0.0, 0.0)


def crossing(direction, origin=ORIGIN, center=B_CENTER, size=B_SIZE):
    near, far = columns.ray_box_distances(origin, direction, center, size)
    return float(near), float(far), float(columns.box_chord_length(origin, direction, center, size))


def test_ray_box_by_hand():
    # along the axis: in at 4, out at 6, exactly
    assert crossing((1.0, 0.0, 0.0)) == (4.0, 6.0, 2.0)
    # tilted, through both x faces: y = 0.1 x stays below 1
    s = math.sqrt(1.01)
    assert crossing((1.0, 0.1, 0.0)) == pytest.approx((4.0 * s, 6.0 * s, 2.0 * s), rel=1e-15)
    # cutting a corner: in through x = 4 at y = 0.8, out through y = 1 at x = 5
    s = math.sqrt(1.04)
    assert crossing((1.0, 0.2, 0.0)) == pytest.approx((4.0 * s, 5.0 * s, s), rel=1e-15)
    # all three components: in through x = 4, out through z = 1 at x = 5
    s = math.sqrt(1.0 + 0.01 + 0.04)
    assert crossing((1.0, 0.1, 0.2)) == pytest.approx((4.0 * s, 5.0 * s, s), rel=1e-15)
    # the direction need not be normalised
    assert crossing((10.0, 1.0, 2.0)) == pytest.approx((4.0 * s, 5.0 * s, s), rel=1e-15)


def test_ray_box_misses_and_special_positions():
    nan = (math.nan, math.nan)
    near, far, chord = crossing((1.0, 0.3, 0.0))                 # y = 0.3 x passes above the edge (4, 1): y = 1.2
    assert math.isnan(near) and math.isnan(far) and chord == 0.0
    near, far, chord = crossing((-1.0, 0.0, 0.0))                # the box is behind: negative distances, no path
    assert (near, far, chord) == (-6.0, -4.0, 0.0)
    assert crossing((0.0, 1.0, 0.0))[2] == 0.0                   # parallel to the x faces, outside that slab
    assert crossing((1.0, 0.0, 0.0), origin=(0.0, 0.0, 1.5))[2] == 0.0      # parallel to the z faces, outside
    # from inside: only the way out counts
    assert crossing((1.0, 0.0, 0.0), origin=(4.5, 0.2, -0.3)) == (-0.5, 1.5, 1.5)
    assert crossing((0.0, 0.0, -1.0), origin=(4.5, 0.2, -0.3)) == (-1.3, 0.7, 0.7)
    # from a point on a face, looking in and looking out
    assert crossing((1.0, 0.0, 0.0), origin=(4.0, 0.0, 0.0)) == (0.0, 2.0, 2.0)
    assert crossing((-1.0, 0.0, 0.0), origin=(4.0, 0.0, 0.0))[2] == 0.0
    # a line lying in the plane of a face runs along it (the surface counts as inside) ...
    assert crossing((1.0, 0.0, 0.0), origin=(0.0, 1.0, 0.0)) == (4.0, 6.0, 2.0)
    # ... and one that only touches an edge or a corner does not count as a crossing
    assert math.isnan(crossing(unit((1.0, 1.0, 0.0)), center=(2.0, -0.5, 0.0), size=(2.0, 3.0, 2.0))[0])
    assert crossing(unit((1.0, 1.0, 0.0)), center=(2.0, -0.5, 0.0), size=(2.0, 3.0, 2.0))[2] == 0.0
    assert all(math.isnan(v) for v in nan)


def test_ray_box_is_vectorised():
    directions = np.array([[[1.0, 0.0, 0.0], [1.0, 0.2, 0.0]], [[1.0, 0.3, 0.0], [-1.0, 0.0, 0.0]]])
    near, far = columns.ray_box_distances(ORIGIN, directions, B_CENTER, B_SIZE)
    chord = columns.box_chord_length(ORIGIN, directions, B_CENTER, B_SIZE)
    assert near.shape == far.shape == chord.shape == (2, 2)
    assert chord == pytest.approx(np.array([[2.0, math.sqrt(1.04)], [0.0, 0.0]]), rel=1e-15)
    assert np.isnan(near[1, 0]) and near[1, 1] == -6.0


BOX_CASES = {
    # label: (origin, direction, centre, size)
    "through-centre": ((-5.0, 0.2, 0.1), unit((6.0, 1.8, 2.9)), (1.0, 2.0, 3.0), (1.5, 2.5, 0.8)),
    "oblique": ((-5.0, 0.2, 0.1), unit((6.2, 1.1, 3.1)), (1.0, 2.0, 3.0), (1.5, 2.5, 0.8)),
    "corner-cut": ((-5.0, 0.2, 0.1), unit((5.3, 0.6, 2.55)), (1.0, 2.0, 3.0), (1.5, 2.5, 0.8)),
    "miss": ((-5.0, 0.2, 0.1), unit((6.0, 4.0, 2.9)), (1.0, 2.0, 3.0), (1.5, 2.5, 0.8)),
    "behind": ((-5.0, 0.2, 0.1), -unit((6.0, 1.8, 2.9)), (1.0, 2.0, 3.0), (1.5, 2.5, 0.8)),
    "start-inside": ((1.2, 2.3, 2.9), unit((0.5, -1.0, 0.25)), (1.0, 2.0, 3.0), (1.5, 2.5, 0.8)),
    "axis-parallel": ((-5.0, 2.5, 3.2), (1.0, 0.0, 0.0), (1.0, 2.0, 3.0), (1.5, 2.5, 0.8)),
    "thin-slab-shallow": ((0.0, 1.5, 0.0), unit((0.3, -0.2, -1.0)), (0.0, -0.15, -4.0), (12.0, 0.3, 14.0)),
    "thin-slab-steep": ((0.0, 1.5, 0.0), unit((0.1, -1.0, -0.2)), (0.0, -0.15, -4.0), (12.0, 0.3, 14.0)),
    "far-box": ((0.0, 6371002.0, 0.0), unit((0.0, -1.146e11 - 6371002.0, -9.6e10)), (0.0, -1.146e11, -9.6e10),
                (2.0e8, 3.0e8, 1.0e8)),
}


@pytest.mark.parametrize("label", list(BOX_CASES))
def test_box_chord_against_brute_force(label):
    origin, direction, center, size = BOX_CASES[label]
    chord = float(columns.box_chord_length(origin, direction, center, size))
    brute = BruteScene.single_box(center, size).integrate([1.0], direction, origin=np.array(origin, float))
    scale = np.linalg.norm(np.array(center, float) - origin) + np.linalg.norm(size)
    assert abs(chord - brute.dense[0]) <= brute.dense_bound[0] + 1e-12 * scale
    assert abs(chord - brute.refined[0]) <= 1e-12 * scale + 2.0 * brute.resolution
    near, far = columns.ray_box_distances(origin, direction, center, size)
    if chord > 0.0:
        assert brute.dense_bound[0] < 1e-4 * chord
        assert chord == pytest.approx(float(far) - max(float(near), 0.0), rel=1e-15)
        # the crossings are where the brute force saw the indicator jump
        ahead = [t for t in (float(near), float(far)) if t > 0.0]
        assert len(brute.jumps) == len(ahead)
        assert sorted(brute.jumps) == pytest.approx(ahead, abs=1e-12 * scale + brute.resolution)
    else:
        assert brute.dense[0] == 0.0 and brute.refined[0] == 0.0 and not brute.jumps
    assert label in ("miss", "behind") or chord > 0.0


# --- columns through the mixed scene ---------------------------------------------------

def aimed(scene, target):
    return unit(np.asarray(target, float) - scene.observer)


MIXED_RAYS = {
    "through the ingot": [-0.9, 0.1, 0.2],
    "through the bubble beside the ingot": [-0.8, 0.75, 0.1],
    "through the slot": [1.2, -0.5, 0.3],
    "crate only": [1.8, 1.3, 0.0],
    "through the ball's core": [3.4, 1.1, -0.4],
    "ball beside its core": [3.5, 1.0 + 1.05, -0.5],
    "between crate and ball": [2.5, -1.2, 1.0],
    "past everything": [0.0, 5.0, 0.0],
}


@pytest.fixture(scope="module")
def mixed_scene():
    return scene_from_dict(mixed())


@pytest.mark.parametrize("label", list(MIXED_RAYS))
def test_mixed_columns_against_brute_force(mixed_scene, label):
    """N, Sigma and the path in every own region, through boxes in spheres in
    boxes. Dense sum: within its rigorous bound. Refined sum: 1e-11 relative
    (boundaries are located to round-off at unit scale; observed 1e-14)."""
    direction = aimed(mixed_scene, MIXED_RAYS[label])
    brute_scene = BruteScene.from_dict(mixed())
    values = np.column_stack([emission.number_emissivities(mixed_scene), mixed_scene.densities,
                              np.eye(len(mixed_scene))])
    brute = brute_scene.integrate(values, direction)
    found = np.concatenate([[float(columns.number_radiance(mixed_scene, direction)),
                             float(columns.mass_column(mixed_scene, direction))],
                            columns.own_region_paths(mixed_scene, direction)])
    assert np.all(np.abs(found - brute.dense) <= brute.dense_bound + 1e-12 * np.abs(found))
    assert found == pytest.approx(brute.refined, rel=1e-11, abs=1e-12)


def test_mixed_rays_cover_the_scene(mixed_scene):
    paths = {label: columns.own_region_paths(mixed_scene, aimed(mixed_scene, target))
             for label, target in MIXED_RAYS.items()}
    crossed = lambda label: {mixed_scene.ids[k] for k in np.nonzero(paths[label])[0]}
    assert crossed("through the ingot") == {"crate", "bubble", "ingot"}
    assert crossed("through the bubble beside the ingot") == {"crate", "bubble"}
    assert crossed("through the slot") == {"crate", "slot"}
    assert crossed("crate only") == {"crate"}
    assert crossed("through the ball's core") == {"ball", "core"}
    assert crossed("ball beside its core") == {"ball"}
    assert crossed("between crate and ball") == set() and crossed("past everything") == set()


def rays_at_everything(scene, rng, n_random=6000, n_per_object=1500):
    """Random directions, plus rays aimed at random points around every object."""
    random = rng.standard_normal((n_random, 3))
    aimed_rays = []
    for obj in scene.objects:
        shape = obj.shape
        reach = 0.6 * np.array(shape.size) if isinstance(shape, Box) else 1.2 * shape.radius * np.ones(3)
        targets = np.array(shape.center) + rng.uniform(-1.0, 1.0, (n_per_object, 3)) * reach
        aimed_rays.append(targets - scene.observer)
    return np.concatenate([random, *aimed_rays])


def check_signed_sums(scene, rng):
    directions = rays_at_everything(scene, rng)
    paths = columns.own_region_paths(scene, directions)
    chord = columns.chords(scene, directions)
    reach = float(np.max(np.linalg.norm(scene.centers - scene.observer, axis=1))) + 20.0
    delta = radial_roundoff(reach)

    def slack(object_id):
        shape = scene[object_id].shape
        if isinstance(shape, Box):
            return np.where(chord[object_id] > 0.0, 64.0 * np.spacing(reach), 0.0)
        return np.where(chord[object_id] > 0.0, 2.0 * crossing_slack(shape.radius, 0.5 * chord[object_id], delta), 0.0)

    for k, obj in enumerate(scene.objects):
        signed = chord[obj.id] - sum(chord[child] for child in obj.children)
        tolerance = 4.0 * delta + sum(slack(i) for i in (obj.id, *obj.children))
        assert np.all(np.abs(paths[:, k] - signed) <= tolerance), obj.id
        assert not paths[chord[obj.id] == 0.0, k].any()
        assert np.count_nonzero(paths[:, k]) > 500, f"the sample must cross {obj.id}"
        crossed = chord[obj.id] > 0.0
        assert np.median(tolerance[crossed] / chord[obj.id][crossed]) < 1e-10
    assert np.all(paths >= 0.0)
    assert columns.mass_column(scene, directions) == pytest.approx(paths @ scene.densities, rel=1e-13, abs=0.0)


def test_own_region_paths_equal_signed_sums_of_chords_in_the_mixed_scene(mixed_scene):
    """own path = chord of the full shape - chords of the children, over
    thousands of rays. (Not how the package computes them.) Allowance per
    object: the sphere model of tolerances.py for spherical surfaces, and 64
    spacings of the distance for box faces."""
    check_signed_sums(mixed_scene, np.random.default_rng(23))


def test_own_region_paths_equal_signed_sums_of_chords_in_the_rooms(room):
    check_signed_sums(room, np.random.default_rng(25))


def test_bit_identical_alone_and_in_a_batch(room):
    rng = np.random.default_rng(24)
    directions = rng.standard_normal((40, 3))
    directions[:, 2] = -np.abs(directions[:, 2])
    for quantity in (columns.number_radiance, columns.mass_column, columns.tidal_column):
        batch = quantity(room, directions)
        assert all(float(quantity(room, d)) == batch[k] for k, d in enumerate(directions))
    assert columns.tidal_column(room, directions.reshape(5, 8, 3)).shape == (5, 8)
