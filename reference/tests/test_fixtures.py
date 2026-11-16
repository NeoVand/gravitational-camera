"""The exported fixture (the bridge to the engine): present, current, and its
numbers consistent with hand formulas that do not go through gravcam's
column code."""
import hashlib
import json
import math

import numpy as np
import pytest

import gravcam
import hand
from conftest import FIXTURE_PATH, SCENE_PATH
from gravcam import columns, constants, export_fixtures
from tolerances import crossing_slack, radial_roundoff

EARTH_CHAIN = ["earth", "upper-mantle", "lower-mantle", "outer-core", "inner-core"]
REGENERATE = "run `python -m gravcam.export_fixtures` from reference/ to regenerate the fixture"


@pytest.fixture(scope="module")
def fixture():
    assert FIXTURE_PATH.exists(), REGENERATE
    return json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))


@pytest.fixture(scope="module")
def rays(fixture):
    return {ray["label"]: ray for ray in fixture["rays"]}


def assert_same(found, expected, path="fixture"):
    """Recursive comparison: structure and strings exactly, floats to 1e-9."""
    if isinstance(expected, dict):
        assert isinstance(found, dict) and list(found) == list(expected), f"{path}: keys differ; {REGENERATE}"
        for key in expected:
            assert_same(found[key], expected[key], f"{path}.{key}")
    elif isinstance(expected, list):
        assert isinstance(found, list) and len(found) == len(expected), f"{path}: length differs; {REGENERATE}"
        for k, (a, b) in enumerate(zip(found, expected)):
            assert_same(a, b, f"{path}[{k}]")
    elif isinstance(expected, float):
        assert found == pytest.approx(expected, rel=1e-9, abs=0.0), f"{path}; {REGENERATE}"
    else:
        assert found == expected, f"{path}; {REGENERATE}"


def test_meta(fixture):
    meta = fixture["meta"]
    assert meta["scene"] == SCENE_PATH.name == "sun-at-midnight.scene.json"
    assert meta["seed"] == export_fixtures.SEED
    assert meta["version"] == gravcam.__version__
    assert meta["package"] == "gravcam"
    assert meta["scene_sha256"] == hashlib.sha256(SCENE_PATH.read_bytes()).hexdigest(), \
        f"the scene file changed since the fixture was written; {REGENERATE}"


def test_fixture_is_what_the_exporter_writes_now(fixture):
    rebuilt = json.loads(export_fixtures.dumps(export_fixtures.build_fixture()))
    assert_same(fixture, rebuilt)


def test_json_keeps_full_float64_precision():
    built = export_fixtures.build_fixture()
    reread = json.loads(export_fixtures.dumps(built))
    assert reread == built                      # every float survives the text exactly
    text = export_fixtures.dumps(built)
    assert "NaN" not in text and "Infinity" not in text
    assert text == export_fixtures.dumps(export_fixtures.build_fixture())     # deterministic


def test_constants(fixture):
    assert fixture["constants"] == constants.as_dict()
    assert fixture["constants"]["G"] == 6.67430e-11
    assert fixture["constants"]["c"] == 299792458
    assert fixture["constants"]["kB"] == 1.380649e-23
    assert fixture["constants"]["sigma"] == 5.670374419e-8
    assert fixture["constants"]["mean_energy_kT"] == 2.701
    assert fixture["constants"]["M_sun"] == 1.98847e30
    assert fixture["observer"]["position"] == [0.0, 6371002.0, 0.0]


def test_objects_against_hand_values(fixture, raw_scene):
    objects = fixture["objects"]
    assert list(objects) == [o["id"] for o in raw_scene["objects"]]
    radii = [hand.radius_of(raw_scene, i) for i in EARTH_CHAIN]
    for object_id, outer, inner in zip(EARTH_CHAIN, radii, radii[1:] + [0.0]):
        entry, material = objects[object_id], hand.material_of(raw_scene, object_id)
        assert set(entry) == {"own_volume", "alpha", "j_E", "j_N", "density", "temperature", "emission_source"}
        assert entry["own_volume"] == pytest.approx(hand.ball_volume(outer) - hand.ball_volume(inner), rel=1e-12)
        assert entry["alpha"] == pytest.approx(hand.alpha(material["friction"]), rel=1e-14)
        assert entry["j_E"] == pytest.approx(hand.j_E_thermal(material["temperature"], material["friction"]), rel=1e-14)
        assert entry["j_N"] == pytest.approx(hand.j_N_thermal(material["temperature"], material["friction"]), rel=1e-14)
        assert entry["density"] == material["density"] and entry["temperature"] == material["temperature"]
    sun, core = objects["sun"], objects["sun-core"]
    r_sun, r_core = hand.radius_of(raw_scene, "sun"), hand.radius_of(raw_scene, "sun-core")
    assert sun["own_volume"] == pytest.approx(hand.ball_volume(r_sun) - hand.ball_volume(r_core), rel=1e-13)
    assert (sun["alpha"], sun["j_E"], sun["j_N"]) == (0.0, 0.0, 0.0)
    assert core["own_volume"] == pytest.approx(hand.ball_volume(r_core), rel=1e-14)
    assert core["alpha"] is None and core["emission_source"] == "luminosity"
    assert core["j_E"] == pytest.approx(1.0e8 / (4 * math.pi * hand.ball_volume(r_core)), rel=1e-14)
    assert core["j_N"] == pytest.approx(core["j_E"] / (2.701 * hand.KB * 1.3e7), rel=1e-14)
    assert core["density"] == 1.0e5 and core["temperature"] == 1.3e7


def test_ray_set(fixture, rays):
    assert len(fixture["rays"]) == export_fixtures.N_RAYS == 200
    assert len(rays) == 200, "labels are unique"
    for ray in fixture["rays"]:
        assert set(ray) == {"label", "direction", "number_radiance", "mass_column", "chords"}
        assert list(ray["chords"]) == list(fixture["objects"])
        assert abs(math.sqrt(sum(v * v for v in ray["direction"])) - 1.0) <= 2.3e-16     # unit vectors
        assert ray["number_radiance"] >= 0.0 and ray["mass_column"] >= 0.0
    random_rays = [label for label in rays if label.startswith("random:")]
    assert len(random_rays) >= 100
    wanted = ["down", "up", "horizontal:yaw0", "center:sun-core"]
    wanted += [f"limb:sun-core:{f}:pa{a}" for f in ("0.5", "0.9", "0.99", "1.01") for a in (0, 90)]
    wanted += [f"limb:{body}:{f}:pa{a}" for body in ("outer-core", "inner-core")
               for f in ("0.5", "0.9", "0.99", "1.01") for a in (0, 90)]
    wanted += ["horizon:earth:+1m", "horizon:earth:-1m", "horizon:earth:-100m", "horizon:earth:-10000m"]
    for label in wanted:
        assert label in rays, label
    # distinct directions
    assert len({tuple(ray["direction"]) for ray in fixture["rays"]}) == 200


def test_random_directions_are_uniform_enough(fixture):
    d = np.array([ray["direction"] for ray in fixture["rays"] if ray["label"].startswith("random:")])
    n = len(d)
    # for uniform directions each component has mean 0 and variance 1/3: allow 4 sigma
    assert np.all(np.abs(d.mean(axis=0)) < 4 * math.sqrt(1 / 3 / n))
    assert np.all(np.abs((d**2).mean(axis=0) - 1 / 3) < 4 * math.sqrt(4 / 45 / n))
    assert 0.3 < np.mean(d[:, 1] < 0) < 0.7           # about half look below the horizon


def test_targeted_directions(fixture, rays, raw_scene):
    observer = np.array(fixture["observer"]["position"])
    assert rays["down"]["direction"] == [0.0, -1.0, 0.0]
    assert rays["up"]["direction"] == [0.0, 1.0, 0.0]
    assert rays["horizontal:yaw0"]["direction"] == [0.0, 0.0, -1.0]
    core = np.array(hand.center_of(raw_scene, "sun-core"))
    to_core = (core - observer) / np.linalg.norm(core - observer)
    assert rays["center:sun-core"]["direction"] == pytest.approx(to_core.tolist(), abs=2e-16)

    # limb and horizon rays pass the sphere's centre at the stated distance
    for label, ray in rays.items():
        parts = label.split(":")
        if parts[0] == "limb":
            radius = hand.radius_of(raw_scene, parts[1])
            wanted = float(parts[2]) * radius
        elif parts[0] == "horizon":
            radius = hand.radius_of(raw_scene, parts[1])
            wanted = radius + float(parts[2].rstrip("m"))
        else:
            continue
        center = np.array(hand.center_of(raw_scene, parts[1]))
        oc = center - observer
        direction = np.array(ray["direction"])
        impact = np.linalg.norm(np.cross(oc, direction))
        assert np.dot(oc, direction) > 0
        assert abs(impact - wanted) <= 8 * np.spacing(np.linalg.norm(oc)), label


def test_values_match_the_package(fixture, scene):
    directions = np.array([ray["direction"] for ray in fixture["rays"]])
    radiance = columns.number_radiance(scene, directions)
    column = columns.mass_column(scene, directions)
    chord = columns.chords(scene, directions)
    for k, ray in enumerate(fixture["rays"]):
        assert ray["number_radiance"] == pytest.approx(radiance[k], rel=1e-9, abs=0.0), ray["label"]
        assert ray["mass_column"] == pytest.approx(column[k], rel=1e-9, abs=0.0), ray["label"]
        for object_id, value in ray["chords"].items():
            assert value == pytest.approx(chord[object_id][k], rel=1e-9, abs=0.0), (ray["label"], object_id)


def hand_chord(observer, direction, center, radius):
    """2 sqrt(r^2 - p^2) with the impact parameter from a cross product; the
    observer is outside every object of this scene, so a sphere is either
    crossed twice ahead or not at all. Returns (chord, half chord)."""
    oc = np.asarray(center) - observer
    assert np.linalg.norm(oc) > radius
    p = np.linalg.norm(np.cross(oc, direction))
    if np.dot(oc, direction) <= 0 or p >= radius:
        return 0.0, 0.0
    half = math.sqrt((radius - p) * (radius + p))
    return 2.0 * half, half


def test_chords_by_pythagoras(fixture, raw_scene):
    observer = np.array(fixture["observer"]["position"])
    checked = 0
    for ray in fixture["rays"]:
        direction = np.array(ray["direction"])
        for object_id, value in ray["chords"].items():
            center, radius = hand.center_of(raw_scene, object_id), hand.radius_of(raw_scene, object_id)
            expected, half = hand_chord(observer, direction, center, radius)
            delta = radial_roundoff(math.dist(center, observer) + radius)
            tolerance = 2.0 * float(crossing_slack(radius, half, delta)) if (expected > 0 or value > 0) else 0.0
            assert abs(value - expected) <= tolerance, (ray["label"], object_id)
            checked += expected > 0
    assert checked > 300


def test_columns_are_signed_sums_of_the_chords(fixture, raw_scene):
    """What an engine built on signed sums of solid primitives would compute
    from the fixture's own chords and emissivities: own path = chord of the
    shape - chords of its children. (The package computed the columns
    differently, by sorted crossings and midpoint membership.)"""
    observer = np.array(fixture["observer"]["position"])
    children = {o["id"]: [c["id"] for c in raw_scene["objects"] if c.get("parent") == o["id"]]
                for o in raw_scene["objects"]}
    objects = fixture["objects"]
    for ray in fixture["rays"]:
        chords = ray["chords"]
        radiance = column = tolerance_n = tolerance_m = 0.0
        for object_id, entry in objects.items():
            own = chords[object_id] - sum(chords[child] for child in children[object_id])
            radiance += entry["j_N"] * own
            column += entry["density"] * own
            center, radius = hand.center_of(raw_scene, object_id), hand.radius_of(raw_scene, object_id)
            delta = radial_roundoff(math.dist(center, observer) + radius)
            slack = 4.0 * delta + sum(
                2.0 * float(crossing_slack(hand.radius_of(raw_scene, i), 0.5 * chords[i], delta))
                for i in (object_id, *children[object_id]) if chords[i] > 0.0)
            if own != 0.0 or chords[object_id] > 0.0:
                tolerance_n += entry["j_N"] * slack
                tolerance_m += entry["density"] * slack
        assert abs(ray["number_radiance"] - radiance) <= tolerance_n + 1e-14 * radiance, ray["label"]
        assert abs(ray["mass_column"] - column) <= tolerance_m + 1e-14 * column, ray["label"]
        if radiance > 0:
            assert tolerance_n < 1e-6 * radiance, ray["label"]       # the allowance is small for every fixture ray


def test_headline_rays(rays, raw_scene, fixture):
    objects = fixture["objects"]
    # straight down: every layer twice
    radii = [hand.radius_of(raw_scene, i) for i in EARTH_CHAIN]
    thickness = [2 * (outer - inner) for outer, inner in zip(radii, radii[1:] + [0.0])]
    down = rays["down"]
    assert down["number_radiance"] == pytest.approx(
        math.fsum(t * objects[i]["j_N"] for t, i in zip(thickness, EARTH_CHAIN)), rel=1e-13)
    assert down["mass_column"] == pytest.approx(
        math.fsum(t * objects[i]["density"] for t, i in zip(thickness, EARTH_CHAIN)), rel=1e-13)
    assert down["chords"]["earth"] == 2 * radii[0] and down["chords"]["sun"] == 0.0
    # towards the core's centre: the full diameters, and the core dominates
    centre = rays["center:sun-core"]
    r_core = hand.radius_of(raw_scene, "sun-core")
    assert centre["chords"]["sun-core"] == pytest.approx(2 * r_core, rel=1e-14)
    assert centre["chords"]["sun"] == pytest.approx(2 * hand.radius_of(raw_scene, "sun"), rel=1e-14)
    assert centre["number_radiance"] == pytest.approx(2 * r_core * objects["sun-core"]["j_N"], rel=1e-9)
    # limb of the core: chord 2 r sqrt(1 - f^2), nothing at 1.01 r
    for fraction in (0.5, 0.9, 0.99):
        for angle in (0, 90):
            ray = rays[f"limb:sun-core:{fraction:g}:pa{angle}"]
            exact = 2 * r_core * math.sqrt((1 - fraction) * (1 + fraction))
            assert ray["chords"]["sun-core"] == pytest.approx(exact, rel=1e-10)
    for angle in (0, 90):
        assert rays[f"limb:sun-core:1.01:pa{angle}"]["chords"]["sun-core"] == 0.0
        assert rays[f"limb:sun-core:1.01:pa{angle}"]["chords"]["sun"] > 0.0
    # horizon: 1 m above the limb misses, 1 m below grazes the crust
    assert rays["horizon:earth:+1m"]["chords"]["earth"] == 0.0
    assert rays["horizon:earth:-1m"]["chords"]["earth"] == pytest.approx(2 * math.sqrt(2 * radii[0] - 1), rel=1e-6)
    for label in ("up", "horizontal:yaw0", "horizontal:yaw90", "horizon:earth:+1m"):
        assert rays[label]["number_radiance"] == 0.0 and rays[label]["mass_column"] == 0.0
        assert not any(rays[label]["chords"].values())


def test_tidal_block(fixture, raw_scene):
    block = fixture["tidal"]
    assert block["point"] == fixture["observer"]["position"]
    earth, sun = block["earth_layers"], block["sun"]
    for entry in (earth, sun):
        tensor = np.array(entry["tensor"])
        assert tensor.shape == (3, 3)
        assert np.array_equal(tensor, tensor.T)                               # symmetric
        assert abs(np.trace(tensor)) <= 5e-15 * np.linalg.norm(tensor)        # the observer is in vacuum
    # Earth: total mass of the layers at the centre, observer on the y axis
    radii = [hand.radius_of(raw_scene, i) for i in EARTH_CHAIN]
    densities = [hand.material_of(raw_scene, i)["density"] for i in EARTH_CHAIN]
    mass = math.fsum(rho * (hand.ball_volume(outer) - hand.ball_volume(inner))
                     for rho, outer, inner in zip(densities, radii, radii[1:] + [0.0]))
    assert earth["objects"] == EARTH_CHAIN
    assert earth["mass"] == pytest.approx(mass, rel=1e-13)
    r = block["point"][1]
    assert np.array(earth["tensor"]) == pytest.approx(hand.G * mass / r**3 * np.diag([1.0, -2.0, 1.0]), rel=1e-12, abs=1e-25)
    # Sun: the standard solar mass as a point, stated as such
    assert sun["mass"] == hand.M_SUN == 1.98847e30
    assert "1.98847e30" in sun["note"] and "NOT" in sun["note"]
    assert sun["center"] == hand.center_of(raw_scene, "sun")
    x = np.array(block["point"]) - np.array(sun["center"])
    d = np.linalg.norm(x)
    n = x / d
    expected = hand.G * hand.M_SUN / d**3 * (np.eye(3) - 3 * np.outer(n, n))
    assert np.array(sun["tensor"]) == pytest.approx(expected, rel=1e-12, abs=1e-28)
    assert sun["scene_density_mass"] == pytest.approx(1.408e30, rel=1e-3)
