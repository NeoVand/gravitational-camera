"""Columns through the two room scenes: the thermal number radiance N, the
mass column Sigma and the tidal column S = integral of rho dr / r beyond the
observer's exclusion radius.

All geometry and all object ids are read from the scene files; nothing here
knows where the safes, tanks or walls are.

Three independent kinds of check, as for the first scene:

1. brute-force sampling along the ray (``bruteforce.py``, no gravcam geometry).
   Dense sum (2^17 cells per bounding interval, to keep the suite fast): the
   rigorous bound returned by the brute force, the sum over the shapes the
   ray can cross of (h / a_min) |jump| for the tidal column. h is about
   1.5e-4 m over the floor's 18 m bounding interval, so the bound is a few
   1e-4 of the result for most rays and up to 1 % where a thin or distant
   object carries the result (the test requires it to stay below 2 %).
   Boundary-refined sum: rel 1e-11 (boundaries are located to round-off, a
   few 1e-15 m at these distances; observed agreement 1e-14 or better).
2. hand sums where the geometry is simple: straight down, straight ahead,
   radially through each spherical tank;
3. the signed sum over solid primitives, sum of (rho - rho_parent) ln(far /
   near) over the full shapes with the crossings found by a few lines of plain
   Python: the method the package deliberately does not use, as a cross-check
   over thousands of rays. The package's own crossings are not used in it.
   Allowed difference: 1e-9 kg/m^3 + 1e-12 relative for box scenes; a ray
   that grazes a sphere may differ by the sqrt of round-off (tolerances.py),
   which the test allows for the few rays that do.
"""
import math

import numpy as np
import pytest

import hand
from bruteforce import BruteScene, InverseDistance
from conftest import room_scene_path
from gravcam import columns, emission
from gravcam.scene import scene_from_dict


DENSE = {"n_dense": 1 << 17, "n_coarse": 1 << 12}


def unit(v):
    v = np.asarray(v, float)
    return v / np.linalg.norm(v)


def hand_crossings(raw, object_id, origin, direction):
    """(near, far) line parameters for one full shape, or None. Plain Python."""
    center = hand.center_of(raw, object_id)
    if hand.is_box(raw, object_id):
        low, high = hand.faces_of(raw, object_id)
        near, far = -math.inf, math.inf
        for o, d, lo, hi in zip(origin, direction, low, high):
            if d == 0.0:
                if not lo <= o <= hi:
                    return None
                continue
            t1, t2 = (lo - o) / d, (hi - o) / d
            near, far = max(near, min(t1, t2)), min(far, max(t1, t2))
        return (near, far) if near < far else None
    radius = hand.radius_of(raw, object_id)
    oc = [c - o for c, o in zip(center, origin)]
    along = sum(a * b for a, b in zip(oc, direction))
    p2 = sum(a * a for a in oc) - along * along
    if p2 >= radius * radius:
        return None
    half = math.sqrt(radius * radius - p2)
    return along - half, along + half


def signed_sum_tidal_column(raw, origin, direction, exclusion):
    """S as a signed sum over solid primitives: each full shape filled with
    its density contrast against its parent."""
    total = 0.0
    for obj in raw["objects"]:
        hit = hand_crossings(raw, obj["id"], origin, direction)
        if hit is None or hit[1] <= exclusion:
            continue
        contrast = hand.density_of(raw, obj["id"])
        if obj.get("parent"):
            contrast -= hand.density_of(raw, obj["parent"])
        total += contrast * math.log(hit[1] / max(hit[0], exclusion))
    return total


def scene_rays(room, raw_room):
    """Rays chosen from the scene file: at the centre of every object, for
    every nested object also at a point a third of the way from its centre to
    one of its corners (or, for a sphere, across its radius), and a few fixed
    and random directions."""
    observer = room.observer
    rays = {
        "straight down": np.array([0.0, -1.0, 0.0]),
        "straight ahead": np.array([0.0, 0.0, -1.0]),
        "up (nothing)": np.array([0.0, 1.0, 0.0]),
    }
    for obj in raw_room["objects"]:
        center = np.array(hand.center_of(raw_room, obj["id"]))
        if hand.is_box(raw_room, obj["id"]):
            offset = np.array(hand.size_of(raw_room, obj["id"])) / 6.0
        else:
            offset = hand.radius_of(raw_room, obj["id"]) * np.array([0.5, 0.4, 0.3])
        rays[f"centre of {obj['id']}"] = unit(center - observer)
        if obj.get("parent"):
            rays[f"off-centre through {obj['id']}"] = unit(center + offset - observer)
    rng = np.random.default_rng(31)
    for k in range(2):
        d = rng.standard_normal(3)
        rays[f"random {k}"] = unit([d[0], -abs(d[1]), -abs(d[2])])
    return rays


@pytest.fixture(scope="module")
def brute_results(room, raw_room, room_name):
    brute_scene = BruteScene.from_file(room_scene_path(room_name))
    assert brute_scene.ids == list(room.ids)
    assert brute_scene.exclusion == room.exclusion
    values = np.column_stack([emission.number_emissivities(room), room.densities])
    results = {}
    for label, direction in scene_rays(room, raw_room).items():
        plain = brute_scene.integrate(values, direction, **DENSE)
        weighted = brute_scene.integrate(room.densities, direction, measure=InverseDistance(brute_scene.exclusion),
                                         **DENSE)
        results[label] = (direction, plain, weighted)
    return results


def test_columns_against_brute_force(room, brute_results):
    crossed = np.zeros(len(room), dtype=bool)
    for label, (direction, plain, weighted) in brute_results.items():
        found = [float(columns.number_radiance(room, direction)), float(columns.mass_column(room, direction))]
        for k in range(2):
            assert abs(found[k] - plain.dense[k]) <= plain.dense_bound[k] + 1e-12 * found[k], label
            assert found[k] == pytest.approx(plain.refined[k], rel=1e-11, abs=0.0), label
        tide = float(columns.tidal_column(room, direction))
        assert abs(tide - weighted.dense[0]) <= weighted.dense_bound[0] + 1e-12 * tide, label
        assert tide == pytest.approx(weighted.refined[0], rel=1e-11, abs=0.0), label
        if tide > 0.0:
            assert weighted.dense_bound[0] < 2e-2 * tide, "the rigorous bound must be a tight one"
            assert plain.dense_bound[1] < 2e-2 * found[1]
        crossed |= columns.own_region_paths(room, direction) > 0.0
    assert crossed.all(), "every object is crossed by some ray"
    assert brute_results["up (nothing)"][2].dense[0] == 0.0
    assert float(columns.tidal_column(room, brute_results["up (nothing)"][0])) == 0.0


# --- hand sums -------------------------------------------------------------------------

def test_straight_down_is_the_floor_alone(room, raw_room):
    """Below the observer there is only the floor: a slab from h to h + t."""
    low, high = hand.faces_of(raw_room, "floor")
    height = raw_room["observer"]["position"][1] - high[1]
    thickness = high[1] - low[1]
    rho = hand.density_of(raw_room, "floor")
    assert height > raw_room["observer"]["exclusion"] and thickness > 0
    down = [0.0, -1.0, 0.0]
    assert float(columns.mass_column(room, down)) == pytest.approx(rho * thickness, rel=1e-14)
    assert float(columns.tidal_column(room, down)) == pytest.approx(rho * math.log((height + thickness) / height), rel=1e-14)
    material = hand.material_of(raw_room, "floor")
    j_N = hand.j_N_thermal(material["temperature"], material["friction"])
    assert float(columns.number_radiance(room, down)) == pytest.approx(j_N * thickness, rel=1e-14)
    paths = dict(zip(room.ids, columns.own_region_paths(room, down)))
    assert paths.pop("floor") == pytest.approx(thickness, rel=1e-14) and not any(paths.values())


def test_straight_ahead_is_whatever_stands_on_the_axis(room, raw_room):
    """Along -z from the observer: every object whose x and y extent contains
    the observer's line, each a slab between its two z faces (or a sphere's
    chord), nested ones taken with their own densities by the signed sum."""
    origin = [float(v) for v in raw_room["observer"]["position"]]
    ahead = [0.0, 0.0, -1.0]
    expected = signed_sum_tidal_column(raw_room, origin, ahead, raw_room["observer"]["exclusion"])
    assert expected > 0.0
    assert float(columns.tidal_column(room, ahead)) == pytest.approx(expected, rel=1e-13)
    # the back wall is on the axis in both rooms: its own term by hand
    low, high = hand.faces_of(raw_room, "back-wall")
    assert low[0] < origin[0] < high[0] and low[1] < origin[1] < high[1]
    near, far = origin[2] - high[2], origin[2] - low[2]
    wall = hand.density_of(raw_room, "back-wall") * math.log(far / near)
    paths = dict(zip(room.ids, columns.own_region_paths(room, ahead)))
    assert paths["back-wall"] == pytest.approx(far - near, rel=1e-13)
    others = sum(v for k, v in paths.items() if k != "back-wall")
    if others == 0.0:
        assert float(columns.tidal_column(room, ahead)) == pytest.approx(wall, rel=1e-13)


def test_radially_through_each_tank(tank_scene, raw_tank_scene):
    """The ray at a tank's centre crosses its concentric spheres at d -+ R and
    d -+ r: steel twice, the contents once, then whatever lies behind."""
    raw = raw_tank_scene
    origin = [float(v) for v in raw["observer"]["position"]]
    exclusion = raw["observer"]["exclusion"]
    results = {}
    for tank in [o["id"] for o in raw["objects"] if o["shape"]["type"] == "sphere" and not o.get("parent")]:
        (contents,) = hand.children_of(raw, tank)
        center = hand.center_of(raw, tank)
        assert hand.center_of(raw, contents) == center
        d = math.dist(origin, center)
        R, r = hand.radius_of(raw, tank), hand.radius_of(raw, contents)
        direction = [(c - o) / d for c, o in zip(center, origin)]
        steel, inside = hand.density_of(raw, tank), hand.density_of(raw, contents)
        own = steel * (math.log((d - r) / (d - R)) + math.log((d + R) / (d + r))) + inside * math.log((d + r) / (d - r))
        behind = sum(
            hand.density_of(raw, o["id"]) * math.log(hit[1] / hit[0])
            for o in raw["objects"] if o["id"] not in (tank, contents) and not o.get("parent")
            for hit in [hand_crossings(raw, o["id"], origin, direction)] if hit and hit[0] > exclusion
        )
        found = float(columns.tidal_column(tank_scene, direction))
        assert found == pytest.approx(own + behind, rel=1e-12), tank
        paths = dict(zip(tank_scene.ids, columns.own_region_paths(tank_scene, direction)))
        assert paths[tank] == pytest.approx(2 * (R - r), rel=1e-11) and paths[contents] == pytest.approx(2 * r, rel=1e-13)
        results[inside] = (found - behind, d, r)
    # the three tanks differ only by what is inside: S grows by (rho_2 - rho_1) ln((d + r) / (d - r))
    densities = sorted(results)
    assert len(densities) == 3
    for lighter, heavier in zip(densities, densities[1:]):
        (s1, d1, r1), (s2, d2, r2) = results[lighter], results[heavier]
        steel_part = lambda s, rho, d, r: s - rho * math.log((d + r) / (d - r))
        assert s2 > s1
        # with the contents' own term removed, what is left is the steel shell, the same for tanks at the same distance
        if d1 == pytest.approx(d2, rel=1e-12):
            assert steel_part(s1, lighter, d1, r1) == pytest.approx(steel_part(s2, heavier, d2, r2), rel=1e-9)


def test_through_each_safe_the_contents_decide(safe_scene, raw_safe_scene):
    """Rays at the centre of each cavity and at the centre of everything inside
    it, against the signed sum; and the two safes compared along mirror-image
    rays: they differ exactly where the gold is."""
    raw = raw_safe_scene
    origin = [float(v) for v in raw["observer"]["position"]]
    exclusion = raw["observer"]["exclusion"]
    targets = [o["id"] for o in raw["objects"] if o.get("parent")]
    assert len(targets) >= 3
    for object_id in targets:
        direction = unit(np.array(hand.center_of(raw, object_id)) - origin)
        expected = signed_sum_tidal_column(raw, origin, direction.tolist(), exclusion)
        assert float(columns.tidal_column(safe_scene, direction)) == pytest.approx(expected, rel=1e-12), object_id
    # mirror images in x: the safes are, the gold is not
    safes = [o["id"] for o in raw["objects"] if o["material"] == "steel"]
    assert len(safes) == 2
    centers = [hand.center_of(raw, i) for i in safes]
    assert centers[0] == [-centers[1][0], centers[1][1], centers[1][2]] and origin[0] == 0.0
    (gold,) = [o for o in raw["objects"] if o["material"] == "gold"]
    gold_center = np.array(hand.center_of(raw, gold["id"]))
    towards_gold = unit(gold_center - origin)
    mirrored = towards_gold * [-1.0, 1.0, 1.0]
    with_gold = float(columns.tidal_column(safe_scene, towards_gold))
    without = float(columns.tidal_column(safe_scene, mirrored))
    hit = hand_crossings(raw, gold["id"], origin, towards_gold.tolist())
    contrast = hand.density_of(raw, gold["id"]) - hand.density_of(raw, gold["parent"])
    assert with_gold - without == pytest.approx(contrast * math.log(hit[1] / hit[0]), rel=1e-11)
    assert with_gold > 2.0 * without           # the gold is the brightest thing in the near-field image
    # through the centres of the two cavities (above the gold) the safes look the same
    through = [float(columns.tidal_column(safe_scene, unit(np.array(c) - origin))) for c in centers]
    assert through[0] == pytest.approx(through[1], rel=1e-13)


def test_tidal_column_equals_the_signed_sum_over_many_rays(room, raw_room):
    rng = np.random.default_rng(32)
    origin = [float(v) for v in raw_room["observer"]["position"]]
    exclusion = raw_room["observer"]["exclusion"]
    directions = [unit(d) for d in rng.standard_normal((1500, 3))]
    for obj in raw_room["objects"]:                      # and rays aimed at every object
        center = np.array(hand.center_of(raw_room, obj["id"]))
        directions += [unit(center + rng.uniform(-0.5, 0.5, 3) - origin) for _ in range(150)]
    found = columns.tidal_column(room, np.array(directions))
    has_spheres = any(o["shape"]["type"] == "sphere" for o in raw_room["objects"])
    loose = 0
    for direction, value in zip(directions, found):
        expected = signed_sum_tidal_column(raw_room, origin, direction.tolist(), exclusion)
        if abs(value - expected) <= 1e-9 + 1e-12 * abs(expected):
            continue
        # a ray grazing a sphere: sqrt(2 r delta) / distance x density, about 1e-4 kg/m^3 at worst
        assert has_spheres and abs(value - expected) <= 1e-3
        loose += 1
    assert loose <= 5
    assert np.count_nonzero(found) > 1000


# --- the exclusion radius --------------------------------------------------------------

SLAB = {
    "observer": {"position": [0.0, 0.1, 0.0], "exclusion": 0.25},
    "materials": {"rock": {"density": 2000, "temperature": 300, "friction": 1e-3}},
    "objects": [{"id": "slab", "material": "rock",
                 "shape": {"type": "box", "center": [0.0, -0.15, 0.0], "size": [10.0, 0.3, 10.0]}}],
}


def test_matter_inside_the_exclusion_radius_is_ignored():
    """A slab from 0.1 m to 0.4 m below the observer."""
    scene = scene_from_dict(SLAB)
    down = [0.0, -1.0, 0.0]
    rho = 2000.0
    assert float(columns.tidal_column(scene, down)) == pytest.approx(rho * math.log(0.4 / 0.25), rel=1e-14)
    assert float(columns.tidal_column(scene, down, exclusion=0.05)) == pytest.approx(rho * math.log(0.4 / 0.1), rel=1e-14)
    assert float(columns.tidal_column(scene, down, exclusion=0.4)) == 0.0          # all of it excluded
    assert float(columns.tidal_column(scene, down, exclusion=1.0)) == 0.0
    # obliquely: the ray is in the slab from 0.1 / c to 0.4 / c, c the cosine to the vertical
    direction = unit([0.3, -1.0, 0.2])
    c = -direction[1]
    assert float(columns.tidal_column(scene, direction, exclusion=0.2)) == pytest.approx(rho * math.log(0.4 / c / 0.2), rel=1e-14)
    # the mass column has no exclusion
    assert float(columns.mass_column(scene, down)) == pytest.approx(rho * 0.3, rel=1e-14)


def test_observer_inside_matter():
    """At the centre of a uniform ball S = rho ln(R / exclusion) in every
    direction; off centre it is rho ln(distance to the surface / exclusion)."""
    data = {
        "observer": {"position": [0.0, 0.0, 0.0], "exclusion": 0.5},
        "materials": {"rock": {"density": 3000, "temperature": 300, "friction": 1e-3}},
        "objects": [{"id": "ball", "material": "rock",
                     "shape": {"type": "sphere", "center": [0.0, 0.0, 0.0], "radius": 4.0}}],
    }
    scene = scene_from_dict(data)
    rng = np.random.default_rng(33)
    directions = rng.standard_normal((200, 3))
    assert columns.tidal_column(scene, directions) == pytest.approx(3000.0 * math.log(4.0 / 0.5), rel=1e-14)
    origin = np.array([1.0, 0.0, 0.0])
    for direction, distance in (([1.0, 0.0, 0.0], 3.0), ([-1.0, 0.0, 0.0], 5.0), ([0.0, 1.0, 0.0], math.sqrt(15.0))):
        found = float(columns.tidal_column(scene, direction, origin=origin))
        assert found == pytest.approx(3000.0 * math.log(distance / 0.5), rel=1e-14)


def test_exclusion_must_be_positive(room):
    for bad in (0.0, -1.0, math.nan):
        with pytest.raises(ValueError):
            columns.tidal_column(room, [0.0, -1.0, 0.0], exclusion=bad)


def test_exclusion_changes_nothing_in_the_room_scenes(room):
    """Nothing in either room is within the exclusion radius of the observer,
    so S does not depend on it there (any radius up to the nearest matter)."""
    rng = np.random.default_rng(34)
    directions = rng.standard_normal((500, 3))
    reference = columns.tidal_column(room, directions)
    assert np.array_equal(columns.tidal_column(room, directions, exclusion=1e-3), reference)
    assert np.array_equal(columns.tidal_column(room, directions, exclusion=1.0), reference)
    assert np.count_nonzero(reference) > 100
