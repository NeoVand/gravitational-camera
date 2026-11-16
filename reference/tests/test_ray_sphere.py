"""Ray-sphere chords against brute-force quadrature of the sphere's indicator
function along the ray.

Tolerances (both asserted for every case):

* dense midpoint sum, 2^20 cells over the ball's bounding interval of width
  about 2r: the sampled length of an interval differs from its true length by
  less than one cell on each of its two boundaries' half cells, i.e. by at
  most h = 2r / 2^20 (about 1e-6 of a central chord). Rigorous.

* boundary-refined sum: limited by float64 round-off only. A position at
  distance D from the origin is resolved to about one spacing ulp(D); the
  brute-force membership test and the solver each misplace the sphere's
  surface radially by a few of those, together at most delta = 16 ulp(D + r).
  A radial error delta moves a crossing along the ray by delta * r / hc
  (hc = half the chord of the full line; r / hc = 1 / cos of the incidence
  angle), and never by more than sqrt(2 r delta), reached at tangency. With
  two crossings and the refinement's own resolution:

      tol = 2 * min(2 r delta / hc, sqrt(2 r delta)) + 2 * resolution

  At unit scale this is about 1e-14. For the sphere 1.5e11 m away with
  r = 1.4e8 m: delta = 5e-4 m, so 2.5e-3 m (1e-11 of the chord) through the
  centre, 1.4e-2 m at 0.99 r, and 16 m for a ray passing 1 m inside the limb
  (chord 33 km): grazing chords are ill-conditioned in any float64 method.
"""
import math

import numpy as np
import pytest

from bruteforce import BruteScene
from gravcam.columns import chord_length, ray_sphere_distances


def aim(origin, center, impact, hint=(0.3, -0.5, 0.8)):
    """Unit direction from origin whose line passes the centre at distance ``impact``."""
    origin, center = np.asarray(origin, float), np.asarray(center, float)
    oc = center - origin
    distance = np.linalg.norm(oc)
    u = oc / distance
    e = np.asarray(hint, float) - (np.asarray(hint, float) @ u) * u
    e /= np.linalg.norm(e)
    s = impact / distance
    v = math.sqrt((1.0 - s) * (1.0 + s)) * u + s * e
    return v / np.linalg.norm(v)


def unit(v):
    v = np.asarray(v, float)
    return v / np.linalg.norm(v)


C1, R1 = (1.0, 2.0, 3.0), 1.5                  # a sphere of ordinary size
O1 = (-5.0, 0.2, 0.1)

R_EARTH = 6371000.0                            # the observer's situation: 2 m above a big sphere
O_EARTH = (0.0, R_EARTH + 2.0, 0.0)

C_FAR, R_FAR = (0.0, -1.146e11, -9.6e10), 1.4e8    # about 1.5e11 m from the origin
O_FAR = (0.0, 6371002.0, 0.0)

CASES = {
    # label: (origin, direction, centre, radius)
    "through-centre": (O1, aim(O1, C1, 0.0), C1, R1),
    "off-centre": (O1, aim(O1, C1, 0.6 * R1), C1, R1),
    "miss": (O1, aim(O1, C1, 1.2 * R1), C1, R1),
    "graze-inside": (O1, aim(O1, C1, R1 * (1 - 1e-6)), C1, R1),
    "graze-outside": (O1, aim(O1, C1, R1 * (1 + 1e-6)), C1, R1),
    "sphere-behind": (O1, -aim(O1, C1, 0.3 * R1), C1, R1),
    "start-inside": ((1.2, 2.3, 2.6), unit((0.5, -1.0, 0.25)), C1, R1),
    "start-at-centre": (C1, unit((1.0, 1.0, -2.0)), C1, R1),
    "start-inside-near-surface": ((1.0, 2.0, 3.0 + R1 * (1 - 1e-6)), unit((0.1, 0.2, 1.0)), C1, R1),
    "start-inside-near-surface-inward": ((1.0, 2.0, 3.0 + R1 * (1 - 1e-6)), unit((0.1, 0.2, -1.0)), C1, R1),
    "2m-above-straight-down": (O_EARTH, (0.0, -1.0, 0.0), (0.0, 0.0, 0.0), R_EARTH),
    "2m-above-shallow": (O_EARTH, unit((0.3, -0.01, -1.0)), (0.0, 0.0, 0.0), R_EARTH),
    "2m-above-horizontal": (O_EARTH, (0.0, 0.0, -1.0), (0.0, 0.0, 0.0), R_EARTH),
    "far-centre": (O_FAR, aim(O_FAR, C_FAR, 0.0), C_FAR, R_FAR),
    "far-half-radius": (O_FAR, aim(O_FAR, C_FAR, 0.5 * R_FAR), C_FAR, R_FAR),
    "far-0.99-radius": (O_FAR, aim(O_FAR, C_FAR, 0.99 * R_FAR), C_FAR, R_FAR),
    "far-1.01-radius": (O_FAR, aim(O_FAR, C_FAR, 1.01 * R_FAR), C_FAR, R_FAR),
    "far-graze-1m-inside": (O_FAR, aim(O_FAR, C_FAR, R_FAR - 1.0), C_FAR, R_FAR),
    "far-graze-1m-outside": (O_FAR, aim(O_FAR, C_FAR, R_FAR + 1.0), C_FAR, R_FAR),
}
MISSES = {"miss", "graze-outside", "sphere-behind", "2m-above-horizontal", "far-1.01-radius", "far-graze-1m-outside"}
STARTS_INSIDE = {"start-inside", "start-at-centre", "start-inside-near-surface", "start-inside-near-surface-inward"}


def roundoff_tolerance(origin, direction, center, radius, resolution):
    """The round-off tolerance derived in the module docstring."""
    origin, direction, center = (np.asarray(v, float) for v in (origin, direction, center))
    oc = center - origin
    delta = 16.0 * np.spacing(np.linalg.norm(oc) + radius)
    p = np.linalg.norm(oc - (oc @ direction) * direction)
    half_chord = math.sqrt(max(radius * radius - p * p, 0.0))
    worst = math.sqrt(2.0 * radius * delta)
    per_crossing = worst if half_chord < 4.0 * worst else 2.0 * radius * delta / half_chord
    return 2.0 * per_crossing + 2.0 * resolution


@pytest.fixture(scope="module", params=sorted(CASES))
def case(request):
    origin, direction, center, radius = CASES[request.param]
    # prune=False: sample the indicator even where the line clearly passes the sphere by
    brute = BruteScene.single_sphere(center, radius).integrate([1.0], direction, origin=origin, prune=False)
    return request.param, origin, np.asarray(direction, float), center, radius, brute


def test_chord_matches_dense_quadrature(case):
    label, origin, direction, center, radius, brute = case
    chord = float(chord_length(origin, direction, center, radius))
    # h/2 per boundary of the interval, two boundaries -> one cell; plus round-off.
    tolerance = brute.h + roundoff_tolerance(origin, direction, center, radius, 0.0)
    assert abs(chord - brute.dense[0]) <= tolerance


def test_chord_matches_refined_quadrature(case):
    label, origin, direction, center, radius, brute = case
    chord = float(chord_length(origin, direction, center, radius))
    tolerance = roundoff_tolerance(origin, direction, center, radius, brute.resolution)
    assert abs(chord - brute.refined[0]) <= tolerance
    if chord > 0.0:
        assert tolerance < 1e-3 * chord, "the tolerance itself must be a small fraction of the chord"


def test_entry_and_exit_distances_match_located_boundaries(case):
    label, origin, direction, center, radius, brute = case
    near, far = (float(v) for v in ray_sphere_distances(origin, direction, center, radius))
    tolerance = roundoff_tolerance(origin, direction, center, radius, brute.resolution)
    if math.isnan(near) or far <= 0.0:
        assert brute.jumps == []
        return
    expected = [t for t in (near, far) if t > 0.0]
    # Close to a crossing the sampled indicator flickers within round-off (most
    # visibly for grazing rays), so the refinement reports a cluster of label
    # changes there rather than one. Every reported change must sit within the
    # tolerance of a solved crossing, and every solved crossing must be found.
    assert brute.jumps
    for found in brute.jumps:
        assert min(abs(found - solved) for solved in expected) <= tolerance
    for solved in expected:
        assert min(abs(found - solved) for found in brute.jumps) <= tolerance


def test_misses_are_exactly_zero(case):
    label, origin, direction, center, radius, brute = case
    chord = float(chord_length(origin, direction, center, radius))
    if label in MISSES:
        assert chord == 0.0
        assert brute.dense[0] == 0.0 and brute.refined[0] == 0.0
    else:
        assert chord > 0.0 and brute.refined[0] > 0.0


def test_start_inside_has_one_crossing_ahead(case):
    label, origin, direction, center, radius, brute = case
    near, far = (float(v) for v in ray_sphere_distances(origin, direction, center, radius))
    if label in STARTS_INSIDE:
        assert near < 0.0 < far
        assert float(chord_length(origin, direction, center, radius)) == far


def test_known_chords():
    # exact values that need no quadrature
    assert float(chord_length(O_EARTH, (0.0, -1.0, 0.0), (0.0, 0.0, 0.0), R_EARTH)) == 2 * R_EARTH
    near, far = ray_sphere_distances(O_EARTH, (0.0, -1.0, 0.0), (0.0, 0.0, 0.0), R_EARTH)
    assert float(near) == 2.0 and float(far) == 2 * R_EARTH + 2.0
    assert float(chord_length(C1, (0.0, 0.0, 1.0), C1, R1)) == R1
    near, far = ray_sphere_distances(O_FAR, aim(O_FAR, C_FAR, 0.0), C_FAR, R_FAR)
    assert float(chord_length(O_FAR, aim(O_FAR, C_FAR, 0.0), C_FAR, R_FAR)) == pytest.approx(2 * R_FAR, rel=1e-14)
    assert float(far - near) == pytest.approx(2 * R_FAR, rel=1e-12)


def test_far_limb_chords_follow_pythagoras():
    # 2 sqrt(r^2 - b^2) at an impact parameter b set to within float64 direction rounding
    distance = float(np.linalg.norm(np.subtract(C_FAR, O_FAR)))
    for fraction in (0.5, 0.9, 0.99):
        chord = float(chord_length(O_FAR, aim(O_FAR, C_FAR, fraction * R_FAR), C_FAR, R_FAR))
        exact = 2.0 * R_FAR * math.sqrt((1 - fraction) * (1 + fraction))
        # db ~ 4 ulp(distance) in the impact parameter, amplified by 2 b / hc
        slack = 2.0 * fraction / math.sqrt(1 - fraction**2) * 4.0 * np.spacing(distance)
        assert abs(chord - exact) <= slack + 1e-15 * exact


def test_vectorised_over_rays_and_shapes():
    directions = np.stack([np.asarray(CASES[k][1], float) for k in ("through-centre", "off-centre", "miss")])
    chord = chord_length(O1, directions, C1, R1)
    assert chord.shape == (3,)
    for k, label in enumerate(("through-centre", "off-centre", "miss")):
        assert chord[k] == float(chord_length(O1, CASES[label][1], C1, R1))
    grid = chord_length(O1, directions.reshape(1, 3, 3), C1, R1)
    assert grid.shape == (1, 3)
    # directions are normalised inside
    assert float(chord_length(O1, 7.0 * directions[1], C1, R1)) == pytest.approx(chord[1], rel=1e-15)


def test_bad_directions_are_rejected():
    with pytest.raises(ValueError):
        chord_length(O1, (0.0, 0.0, 0.0), C1, R1)
    with pytest.raises(ValueError):
        chord_length(O1, (1.0, 0.0), C1, R1)
