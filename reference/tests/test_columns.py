"""Column integrals N = int j_N ds and Sigma = int rho ds for the real scene.

Three independent kinds of check:

1. brute-force sampling along the ray (``bruteforce.py``, no gravcam geometry);
2. hand sums for rays where the geometry is known in closed form;
3. the "signed sum of solid chords" identity, used here only as a cross-check
   of the sorted-crossings algorithm, over thousands of rays.

Tolerances for (1):

* dense midpoint sum (2^20 cells per bounding interval): the rigorous bound
  h * sum |jump| over the spheres the ray can cross, returned by the
  brute-force code itself. h is 12 m over the Earth's interval and 1.3 km
  over the Sun's 1.4e9 m interval, so the bound is about 2e-6 of the result
  for rays through the Earth, 5e-6 through the centre of the Sun's core, and
  at worst 5e-5 where the chord is short (the 0.99-radii limb, the shallow
  ray through the crust).
* boundary-refined sum: relative 1e-10. Each boundary is located to float64
  round-off: about 2e-9 m near the Earth and about 3e-5 m at the Sun (the
  spacing of float64 at 1.5e11 m), amplified by 1 / cos(incidence), which is
  at most 7 for the rays used here (the 0.99-radii limb). The worst ratio is
  a few times 1e-3 m against the 3.9e7 m chord at that limb, 1e-10; elsewhere
  the expected deviation is 1e-12 or less.
"""
import math

import numpy as np
import pytest

import hand
from bruteforce import BruteScene
from conftest import SCENE_PATH
from gravcam import camera, columns, emission
from tolerances import crossing_slack, radial_roundoff

EARTH_CHAIN = ["earth", "upper-mantle", "lower-mantle", "outer-core", "inner-core"]
REFINED_RTOL = 1e-10


def toward(origin, target, impact=0.0, hint=(1.0, 0.0, 0.0)):
    """Unit direction from origin whose line passes ``target`` at distance ``impact``."""
    oc = np.asarray(target, float) - np.asarray(origin, float)
    distance = np.linalg.norm(oc)
    u = oc / distance
    e = np.asarray(hint, float) - (np.asarray(hint, float) @ u) * u
    e /= np.linalg.norm(e)
    s = impact / distance
    v = math.sqrt((1.0 - s) * (1.0 + s)) * u + s * e
    return v / np.linalg.norm(v)


def brute_rays(scene, raw_scene):
    observer = scene.observer
    sun = hand.center_of(raw_scene, "sun-core")
    r_core = hand.radius_of(raw_scene, "sun-core")
    rng = np.random.default_rng(3)
    downward = rng.standard_normal((2, 3))
    downward[:, 1] = -np.abs(downward[:, 1])
    return {
        "straight down (yaw 0, pitch -pi/2)": camera.camera_basis(0.0, -math.pi / 2)[0],
        "toward the Sun's core centre": toward(observer, sun),
        "horizontal (yaw 0, pitch 0)": camera.camera_basis(0.0, 0.0)[0],
        "just below the horizon (crust only)": camera.camera_basis(0.3, -0.01)[0],
        "through the outer core, beside the inner core": camera.camera_basis(1.0, -(math.pi / 2 - 0.35))[0],
        "Sun's core at 0.9 core radii": toward(observer, sun, 0.9 * r_core),
        "Sun's core limb at 0.99 core radii": toward(observer, sun, 0.99 * r_core, hint=(0.0, 1.0, 0.0)),
        "Sun's envelope only (1.5 core radii)": toward(observer, sun, 1.5 * r_core),
        "random downward 1": downward[0],
        "random downward 2": downward[1],
        "straight up": np.array([0.0, 1.0, 0.0]),
    }


@pytest.fixture(scope="module")
def brute_results(scene, raw_scene):
    brute_scene = BruteScene.from_file(SCENE_PATH)
    assert brute_scene.ids == list(scene.ids)
    values = np.column_stack([emission.number_emissivities(scene), scene.densities])
    results = {}
    for label, direction in brute_rays(scene, raw_scene).items():
        results[label] = (direction, brute_scene.integrate(values, direction))
    return results


RAY_LABELS = [
    "straight down (yaw 0, pitch -pi/2)",
    "toward the Sun's core centre",
    "horizontal (yaw 0, pitch 0)",
    "just below the horizon (crust only)",
    "through the outer core, beside the inner core",
    "Sun's core at 0.9 core radii",
    "Sun's core limb at 0.99 core radii",
    "Sun's envelope only (1.5 core radii)",
    "random downward 1",
    "random downward 2",
    "straight up",
]


@pytest.mark.parametrize("label", RAY_LABELS)
def test_number_radiance_against_brute_force(scene, brute_results, label):
    direction, brute = brute_results[label]
    radiance = float(columns.number_radiance(scene, direction))
    assert abs(radiance - brute.dense[0]) <= brute.dense_bound[0] + 1e-12 * radiance
    assert radiance == pytest.approx(brute.refined[0], rel=REFINED_RTOL, abs=0.0)
    if radiance > 0.0:
        assert brute.dense_bound[0] < 1e-4 * radiance, "the rigorous bound must be a tight one"


@pytest.mark.parametrize("label", RAY_LABELS)
def test_mass_column_against_brute_force(scene, brute_results, label):
    direction, brute = brute_results[label]
    column = float(columns.mass_column(scene, direction))
    assert abs(column - brute.dense[1]) <= brute.dense_bound[1] + 1e-12 * column
    assert column == pytest.approx(brute.refined[1], rel=REFINED_RTOL, abs=0.0)
    if column > 0.0:
        assert brute.dense_bound[1] < 1e-4 * column


def test_brute_force_rays_cover_the_scene(scene, raw_scene):
    # the selection really exercises every object, the zero cases and the limb
    rays = brute_rays(scene, raw_scene)
    assert list(rays) == RAY_LABELS
    paths = columns.own_region_paths(scene, np.array(list(rays.values())))
    assert np.all((paths > 0).any(axis=0)), "every object is crossed by some ray"
    by_label = dict(zip(rays, paths))
    assert not by_label["horizontal (yaw 0, pitch 0)"].any() and not by_label["straight up"].any()
    crust_only = by_label["just below the horizon (crust only)"]
    assert crust_only[scene.index("earth")] > 0 and not np.delete(crust_only, scene.index("earth")).any()
    beside = by_label["through the outer core, beside the inner core"]
    assert beside[scene.index("outer-core")] > 0 and beside[scene.index("inner-core")] == 0
    envelope = by_label["Sun's envelope only (1.5 core radii)"]
    assert envelope[scene.index("sun")] > 0 and envelope[scene.index("sun-core")] == 0


# --- hand sums ---------------------------------------------------------------------

def hand_j_N(raw_scene, object_id):
    material = hand.material_of(raw_scene, object_id)
    return hand.j_N_thermal(material["temperature"], material["friction"])


def test_straight_down_is_the_hand_sum_of_layers(scene, raw_scene):
    """Through the Earth's centre every layer is crossed twice radially."""
    radii = [hand.radius_of(raw_scene, object_id) for object_id in EARTH_CHAIN]
    thickness = [2.0 * (outer - inner) for outer, inner in zip(radii, radii[1:] + [0.0])]
    assert thickness == [50000.0, 1290000.0, 4442000.0, 4517000.0, 2443000.0]
    expected_radiance = math.fsum(t * hand_j_N(raw_scene, i) for t, i in zip(thickness, EARTH_CHAIN))
    expected_column = math.fsum(t * hand.material_of(raw_scene, i)["density"] for t, i in zip(thickness, EARTH_CHAIN))

    down = camera.camera_basis(0.0, -math.pi / 2)[0]
    # round-off only: crossings are good to ~1e-9 m out of 1e7 m
    assert float(columns.number_radiance(scene, down)) == pytest.approx(expected_radiance, rel=1e-13)
    assert float(columns.mass_column(scene, down)) == pytest.approx(expected_column, rel=1e-13)
    assert float(columns.number_radiance(scene, [0.0, -1.0, 0.0])) == pytest.approx(expected_radiance, rel=1e-13)
    paths = columns.own_region_paths(scene, [0.0, -1.0, 0.0])
    assert paths[: len(EARTH_CHAIN)] == pytest.approx(thickness, rel=1e-14)
    assert paths[len(EARTH_CHAIN):].tolist() == [0.0, 0.0]          # the Sun is not straight down


def test_ray_through_the_suns_core_centre_alone(scene, raw_scene):
    """Seen from a point whose line of sight misses the Earth, the ray through
    the core's centre gives exactly 2 r_core j_N(core): the envelope does not emit."""
    core = np.array(hand.center_of(raw_scene, "sun-core"))
    r_core = hand.radius_of(raw_scene, "sun-core")
    material = hand.material_of(raw_scene, "sun-core")
    j_core = material["luminosity"] / (4 * math.pi * hand.ball_volume(r_core)) / (2.701 * hand.KB * material["temperature"])
    expected = 2.0 * r_core * j_core

    for origin in ([0.0, -6371002.0, 0.0], [3.0e10, 2.0e10, -1.0e10], core + [0.0, 0.0, 5.0e9]):
        direction = toward(origin, core)
        chord = columns.chords(scene, direction, origin=origin)
        assert float(chord["earth"]) == 0.0
        # crossing distances ~1e11 m are good to a few 3e-5 m; the chord is 2.8e8 m
        assert float(columns.number_radiance(scene, direction, origin=origin)) == pytest.approx(expected, rel=1e-12)
        assert float(chord["sun-core"]) == pytest.approx(2.0 * r_core, rel=1e-14)
        assert float(chord["sun"]) == pytest.approx(2.0 * hand.radius_of(raw_scene, "sun"), rel=1e-14)


def test_ray_from_the_observer_through_the_suns_core_centre(scene, raw_scene):
    """From the night side the same ray first crosses the Earth: check the
    Sun's part and the Earth's part object by object."""
    observer = scene.observer
    core = np.array(hand.center_of(raw_scene, "sun-core"))
    r_core, r_sun = hand.radius_of(raw_scene, "sun-core"), hand.radius_of(raw_scene, "sun")
    direction = toward(observer, core)
    paths = dict(zip(scene.ids, columns.own_region_paths(scene, direction)))
    assert paths["sun-core"] == pytest.approx(2.0 * r_core, rel=1e-12)
    assert paths["sun"] == pytest.approx(2.0 * (r_sun - r_core), rel=1e-12)

    # Earth: chords 2 sqrt(r^2 - p^2) at the impact parameter p of the ray from the Earth's centre
    p = float(np.linalg.norm(np.cross(observer, direction)))
    full = [2.0 * math.sqrt(max(hand.radius_of(raw_scene, i) ** 2 - p * p, 0.0)) for i in EARTH_CHAIN]
    for object_id, outer, inner in zip(EARTH_CHAIN, full, full[1:] + [0.0]):
        assert paths[object_id] == pytest.approx(outer - inner, rel=1e-11, abs=1e-6)

    material = hand.material_of(raw_scene, "sun-core")
    j_core = material["luminosity"] / (4 * math.pi * hand.ball_volume(r_core)) / (2.701 * hand.KB * material["temperature"])
    earth_part = math.fsum((outer - inner) * hand_j_N(raw_scene, i) for i, outer, inner in zip(EARTH_CHAIN, full, full[1:] + [0.0]))
    total = float(columns.number_radiance(scene, direction))
    assert total == pytest.approx(2.0 * r_core * j_core + earth_part, rel=1e-12)
    assert earth_part < 1e-9 * total          # the core outshines the Earth's glow by many orders of magnitude

    # the same ray built from the camera's yaw and pitch
    forward = camera.camera_basis(*camera.yaw_pitch_toward(direction))[0]
    assert float(columns.number_radiance(scene, forward)) == pytest.approx(total, rel=1e-11)


def test_horizontal_and_upward_rays_see_nothing(scene):
    for yaw in (0.0, 1.0, math.pi / 2, 3.0, -2.0):
        forward = camera.camera_basis(yaw, 0.0)[0]
        assert float(columns.number_radiance(scene, forward)) == 0.0
        assert float(columns.mass_column(scene, forward)) == 0.0
    assert float(columns.number_radiance(scene, [0.0, 1.0, 0.0])) == 0.0


def test_observer_inside_an_object(scene, raw_scene):
    """Start in the upper mantle and look up: the path is the way out."""
    r_earth, r_mantle = hand.radius_of(raw_scene, "earth"), hand.radius_of(raw_scene, "upper-mantle")
    origin = [0.0, r_mantle - 1000.0, 0.0]
    paths = dict(zip(scene.ids, columns.own_region_paths(scene, [0.0, 1.0, 0.0], origin=origin)))
    assert paths["upper-mantle"] == pytest.approx(1000.0, rel=1e-12)
    assert paths["earth"] == pytest.approx(r_earth - r_mantle, rel=1e-12)
    assert sum(paths.values()) == pytest.approx(r_earth - r_mantle + 1000.0, rel=1e-12)
    # from the Earth's very centre, any direction crosses each layer once
    radii = [hand.radius_of(raw_scene, object_id) for object_id in EARTH_CHAIN]
    out = columns.own_region_paths(scene, [0.6, 0.0, 0.8], origin=[0.0, 0.0, 0.0])
    assert out[:5] == pytest.approx([outer - inner for outer, inner in zip(radii, radii[1:] + [0.0])], rel=1e-12)


# --- the signed-sum identity as a cross-check ---------------------------------------

def test_own_region_paths_equal_signed_sums_of_chords(scene, raw_scene):
    """own path = chord of the full shape - chords of the children. The package
    does NOT compute columns this way; here it checks the sorted-crossings
    algorithm on thousands of rays at once."""
    rng = np.random.default_rng(7)
    observer = scene.observer
    everywhere = rng.standard_normal((6000, 3))
    core = np.array(hand.center_of(raw_scene, "sun-core"))
    r_sun = hand.radius_of(raw_scene, "sun")
    at_the_sun = np.array([toward(observer, core, impact, hint=rng.standard_normal(3))
                           for impact in 1.05 * r_sun * rng.uniform(0, 1, 3000)])
    near_the_horizon = np.array([camera.camera_basis(yaw, pitch)[0]
                                 for yaw, pitch in zip(rng.uniform(0, 6.28, 2000), rng.uniform(-0.05, 0.01, 2000))])
    into_the_core = np.array([camera.camera_basis(yaw, pitch)[0]
                              for yaw, pitch in zip(rng.uniform(0, 6.28, 2000), rng.uniform(-math.pi / 2, -0.9, 2000))])
    directions = np.concatenate([everywhere, at_the_sun, near_the_horizon, into_the_core])
    directions /= np.linalg.norm(directions, axis=1, keepdims=True)

    paths = columns.own_region_paths(scene, directions)
    chord = columns.chords(scene, directions)

    def slack(object_id, delta):
        # The two sides of the identity use a sphere's two crossings
        # differently, so they may differ by the round-off slack of both
        # (tolerances.py); a sphere the ray misses contributes nothing.
        per_crossing = crossing_slack(scene[object_id].shape.radius, 0.5 * chord[object_id], delta)
        return np.where(chord[object_id] > 0.0, 2.0 * per_crossing, 0.0)

    for k, obj in enumerate(scene.objects):
        signed = chord[obj.id] - sum(chord[child] for child in obj.children)
        delta = radial_roundoff(np.linalg.norm(scene.centers[k] - observer) + scene.radii[k])
        tolerance = 4.0 * delta + sum(slack(i, delta) for i in (obj.id, *obj.children))
        crossed = chord[obj.id] > 0.0
        assert np.all(np.abs(paths[:, k] - signed) <= tolerance)
        assert not paths[~crossed, k].any(), "no path inside an object the ray misses"
        assert np.count_nonzero(paths[:, k]) > 100, "the sample must actually cross this object"
        # the tolerance is tiny against the chord for all but a few grazing rays
        assert np.median(tolerance[crossed] / chord[obj.id][crossed]) < 1e-10

    j_N = emission.number_emissivities(scene)
    assert columns.number_radiance(scene, directions) == pytest.approx(paths @ j_N, rel=1e-14, abs=0.0)
    assert columns.mass_column(scene, directions) == pytest.approx(paths @ scene.densities, rel=1e-14, abs=0.0)
    assert np.all(paths >= 0.0)


def test_shapes_chunking_and_normalisation(scene):
    rng = np.random.default_rng(1)
    directions = rng.standard_normal((5, 4, 3))
    directions[..., 1] = -np.abs(directions[..., 1])
    image = columns.number_radiance(scene, directions)
    assert image.shape == (5, 4) and image.dtype == np.float64
    flat = columns.number_radiance(scene, directions.reshape(-1, 3))
    assert np.array_equal(image.ravel(), flat)
    single = columns.number_radiance(scene, directions[2, 3])
    assert single.shape == () and float(single) == image[2, 3]
    unit = directions / np.linalg.norm(directions, axis=-1, keepdims=True)
    assert columns.number_radiance(scene, unit) == pytest.approx(image, rel=1e-12)
    # a ray gives bit-identical results alone, in a small batch or in a large one
    for index in np.ndindex(5, 4):
        assert float(columns.number_radiance(scene, directions[index])) == image[index]
        assert float(columns.mass_column(scene, directions[index])) == float(columns.mass_column(scene, directions)[index])
    assert columns.own_region_paths(scene, directions).shape == (5, 4, len(scene))
    assert columns.chords(scene, directions)["earth"].shape == (5, 4)
    # more rays than one internal block
    many = np.tile(directions.reshape(-1, 3), (2000, 1))
    assert many.shape[0] > columns._CHUNK
    assert np.array_equal(columns.number_radiance(scene, many), np.tile(flat, 2000))


def test_line_integral_of_arbitrary_values(scene):
    down = [0.0, -1.0, 0.0]
    ones = np.ones(len(scene))
    assert float(columns.line_integral(scene, ones, down)) == pytest.approx(2 * 6371000.0, rel=1e-14)
    with pytest.raises(ValueError):
        columns.line_integral(scene, [1.0, 2.0], down)
