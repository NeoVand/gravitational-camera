"""The skeleton of a scene (gravcam/skeleton.py): the circle on which the tide of two masses is degenerate, what a
loop does around a line of type D and around a line of type II, and two explicit fields with their permutations."""
import math
from itertools import permutations

import numpy as np
import pytest
from scipy.optimize import root

from gravcam import pixel
from gravcam import skeleton as sk
from gravcam.constants import G
from gravcam.response import tidal_of_points

RATIOS = [(0.5, 0.5), (0.25, 0.75), (0.1, 0.9), (0.02, 0.98)]


def hessian(F, p, e: float = 1e-3) -> np.ndarray:
    """The second derivatives of a function of the place, by central differences (exact for a cubic)."""
    H, I = np.zeros((3, 3), dtype=complex), np.eye(3)
    for i in range(3):
        for j in range(3):
            H[i, j] = (F(p + e * I[i] + e * I[j]) - F(p + e * I[i] - e * I[j])
                       - F(p - e * I[i] + e * I[j]) + F(p - e * I[i] - e * I[j])) / (4 * e * e)
    return H


# --- two masses ------------------------------------------------------------------------------------------------------

def test_two_equal_masses_have_a_degenerate_circle_midway_between_them():
    d, masses = 1.0, [1.0, 1.0]
    pts = sk.pair_on_axis(1.0, 1.0, d)
    assert np.allclose(pts, [[0, 0, d / 2], [0, 0, -d / 2]])
    scale = G / d**3
    gaps = {s: sk.eigenvalue_gap([s * d, 0.0, 0.0], pts, masses) / scale for s in (0.3, 0.45, 0.5, 0.55, 0.8)}
    assert gaps[0.5] < 1e-12 and min(gaps[s] for s in (0.3, 0.45, 0.55, 0.8)) > 1.0
    assert gaps[0.45] == pytest.approx(2.0692, abs=1e-4) and gaps[0.55] == pytest.approx(1.3883, abs=1e-4)
    # on the circle of diameter d the two masses are sqrt(1/2) d away: eigenvalues (-1, -1, 2) G m / r^3
    on_circle = np.linalg.eigvalsh(tidal_of_points(np.array([d / 2, 0.0, 0.0]), pts, masses)) / scale
    assert on_circle == pytest.approx([-2.8284, -2.8284, 5.6569], abs=1e-4)
    assert pixel.petrov(tidal_of_points(np.array([d / 2, 0.0, 0.0]), pts, masses)) == "D"
    assert pixel.petrov(tidal_of_points(np.array([0.3, 0.0, 0.2]), pts, masses)) == "I"
    assert sk.degenerate_circle(1.0, 1.0, d) == pytest.approx((d / 2, 0.0), abs=1e-12)
    # anywhere around the axis
    for phi in (0.7, 2.9, 5.1):
        assert sk.eigenvalue_gap([d / 2 * math.cos(phi), d / 2 * math.sin(phi), 0.0], pts, masses) < 1e-12 * scale


@pytest.mark.parametrize("m1, m2", RATIOS)
def test_the_tide_of_two_masses_in_closed_form(m1, m2):
    d = 1.3
    pts, masses = sk.pair_on_axis(m1, m2, d), [m1, m2]
    assert (m1 * pts[0] + m2 * pts[1]) == pytest.approx(np.zeros(3), abs=1e-15)              # the centre of mass
    rng = np.random.default_rng(3)
    for _ in range(40):
        x = rng.uniform(-2.0, 2.0, size=3)
        E = tidal_of_points(x, pts, masses)
        want = sk.pair_eigenvalues(x, pts, masses)
        assert np.linalg.eigvalsh(E) == pytest.approx(want, rel=1e-10, abs=1e-12 * abs(want).max())
        # the eigenvalue across the plane of the two lines of sight is mu_1 + mu_2, and it is the largest
        mu = [G * m / np.linalg.norm(x - p) ** 3 for p, m in zip(pts, masses)]
        normal = np.cross(x - pts[0], x - pts[1])
        assert np.allclose(E @ normal, sum(mu) * normal, rtol=1e-10, atol=1e-12 * sum(mu) * np.linalg.norm(normal))
        assert want[2] == pytest.approx(sum(mu), rel=1e-12) and want[2] > want[1]
        # the other two differ by 3 sqrt((mu_1 - mu_2)^2 + 4 mu_1 mu_2 cos^2): nothing only at a right angle, with
        # equal tides
        cos = (x - pts[0]) @ (x - pts[1]) / (np.linalg.norm(x - pts[0]) * np.linalg.norm(x - pts[1]))
        split = 3 * math.sqrt((mu[0] - mu[1]) ** 2 + 4 * mu[0] * mu[1] * cos**2)
        assert want[1] - want[0] == pytest.approx(split, rel=1e-10)


@pytest.mark.parametrize("m1, m2, rho, z", [(0.5, 0.5, 0.50000, 0.00000), (0.25, 0.75, 0.46825, 0.42533),
                                            (0.1, 0.9, 0.39050, 0.71227), (0.02, 0.98, 0.25429, 0.91051)])
def test_two_unequal_masses_a_right_angle_and_equal_tides(m1, m2, rho, z):
    d = 1.0
    pts, masses = sk.pair_on_axis(m1, m2, d), [m1, m2]
    circle = sk.degenerate_circle(m1, m2, d)
    assert circle == pytest.approx((rho, z), abs=1e-5)
    x = np.array([circle[0], 0.0, circle[1]])
    scale = G * (m1 + m2) / d**3
    assert sk.eigenvalue_gap(x, pts, masses) < 1e-12 * scale
    assert pixel.petrov(tidal_of_points(x, pts, masses)) == "D"
    r1, r2 = np.linalg.norm(x - pts[0]), np.linalg.norm(x - pts[1])
    assert (x - pts[0]) @ (x - pts[1]) == pytest.approx(0.0, abs=1e-14)                      # seen at right angles
    assert m1 / r1**3 == pytest.approx(m2 / r2**3, rel=1e-12)                               # equally strong tides
    assert np.linalg.norm(x - (pts[0] + pts[1]) / 2) == pytest.approx(d / 2, rel=1e-12)     # the sphere of diameter d
    # a blind search of the half-plane, 0.02 d <= rho <= 3 d and |z| <= 3 d, on a grid of steps 0.01 d
    grid_rho, grid_z = np.meshgrid(np.linspace(0.02, 3.0, 300) * d, np.linspace(-3.0, 3.0, 601) * d, indexing="ij")
    places = np.stack([grid_rho.ravel(), np.zeros(grid_rho.size), grid_z.ravel()], axis=1)
    tides = sk.tides_at(places, pts, masses)
    assert np.allclose(tides[12345], tidal_of_points(places[12345], pts, masses), rtol=1e-12, atol=1e-15 * scale)
    gap, above = sk.meridional_split(tides)
    away = np.linalg.norm(places[:, [0, 2]] - np.array(circle), axis=1)
    nearest = int(np.argmin(gap))
    assert away[nearest] < 0.01 * d                        # the two eigenvalues of the block come together in one place
    assert gap[away > 0.05 * d].min() > 0.25               # and nowhere else: beyond 0.05 d the gap is a quarter of |E|
    found = root(lambda q: sk.meridional_block(q, pts, masses), places[nearest, [0, 2]], method="hybr")
    assert found.success and found.x == pytest.approx(circle, abs=1e-8)
    # the eigenvalue across the plane stays above both: it comes nearest at the grid's corner by the axis
    assert above.min() > 0 and places[int(np.argmin(above)), 0] == pytest.approx(0.02 * d)


def test_the_ring_found_in_initial_data_for_two_black_holes():
    # Rosato, Nakano and Lousto (2021), lengths in units of the total mass: equal masses 10 apart, a ring at 5.05
    rho, z = sk.degenerate_circle(0.5, 0.5, 10.0)
    assert (rho, z) == pytest.approx((5.0, 0.0), abs=1e-12)
    # masses 1:3, 7 apart: polar angle 19 pi / 15 = 228.0 degrees whatever the separation, radius quoted as 4.6 and 4.9
    rho, z = sk.degenerate_circle(0.25, 0.75, 7.0)
    assert math.hypot(rho, z) == pytest.approx(4.428, abs=1e-3)
    angle = math.degrees(sk.circle_polar_angle(0.25, 0.75))            # from the axis, on the lighter mass's side
    assert angle == pytest.approx(47.75, abs=5e-3)
    assert 180 + angle == pytest.approx(math.degrees(19 * math.pi / 15), abs=0.3)             # 227.75 against 228.0
    for d in (5.0, 7.0, 15.0):                                         # the angle does not depend on the separation
        rho, z = sk.degenerate_circle(0.25, 0.75, d)
        assert math.degrees(math.atan2(rho, z)) == pytest.approx(angle, abs=1e-10)
        assert math.hypot(rho, z) / d == pytest.approx(4.428 / 7.0, abs=2e-4)


# --- the four directions, and loops ----------------------------------------------------------------------------------

def test_the_quartic_of_the_four_directions():
    rng = np.random.default_rng(2)
    A = rng.normal(size=(3, 3)) + 1j * rng.normal(size=(3, 3))
    W = A + A.T - 2 * np.trace(A) / 3 * np.eye(3)
    coefficients = sk.direction_quartic(W)
    for zeta in (0.3 - 0.7j, -1.4 + 0.2j, 0.0):
        m = pixel.null_vector(zeta)
        assert np.polyval(coefficients, zeta) == pytest.approx(m @ W @ m, rel=1e-12)
    assert coefficients[2] == pytest.approx(6 * W[2, 2], rel=1e-12)
    assert coefficients[4] == pytest.approx(W[0, 0] - W[1, 1] + 2j * W[0, 1], rel=1e-12)      # the in-plane shear
    # its roots are the stars of pixel.py
    stars = np.array([pixel.direction(pixel.null_vector(r)) for r in np.roots(coefficients)])
    for s in pixel.stars(W):
        assert np.min(np.linalg.norm(stars - s, axis=1)) < 1e-8


@pytest.mark.parametrize("radius", [0.05, 0.15])
def test_a_loop_around_a_line_of_type_D_turns_two_axes_over_and_swaps_the_directions_in_pairs(radius):
    d, masses = 1.0, [1.0, 1.0]
    pts = sk.pair_on_axis(1.0, 1.0, d)
    angles = np.linspace(0.0, 2 * math.pi, 801)                        # around the circle rho = d / 2, z = 0
    tides = [tidal_of_points(np.array([d / 2 + radius * math.cos(t), 0.0, radius * math.sin(t)]), pts, masses) / G
             for t in angles]
    values0, vectors0, values, vectors = sk.carried_frame(tides)
    assert np.allclose(values, values0, rtol=1e-12)                    # the eigenvalues return in place
    signs = [round(float(vectors[:, k] @ vectors0[:, k])) for k in range(3)]
    assert signs == [-1, -1, 1]                                        # the pair that meets comes back reversed
    assert abs(vectors0[1, 2]) == pytest.approx(1.0)                   # the axis that does not lies across the plane
    start = np.roots(sk.direction_quartic(tides[0]))
    end = sk.follow(lambda E: np.roots(sk.direction_quartic(E)), tides[1:], start)
    p = sk.permutation(start, end)
    assert sk.moved(p) == 4 and all(p[p[k]] == k for k in range(4))   # the four directions: exchanged in two pairs
    # a loop that does not go around the circle does nothing
    aside = [tidal_of_points(np.array([d / 2 + radius * (2 + math.cos(t)), 0.0, radius * math.sin(t)]), pts, masses) / G
             for t in angles]
    values0, vectors0, values, vectors = sk.carried_frame(aside)
    assert [round(float(vectors[:, k] @ vectors0[:, k])) for k in range(3)] == [1, 1, 1]
    start = np.roots(sk.direction_quartic(aside[0]))
    end = sk.follow(lambda E: np.roots(sk.direction_quartic(E)), aside[1:], start)
    assert sk.permutation(start, end) == (0, 1, 2, 3)


@pytest.mark.parametrize("radius", [0.05, 0.15])
def test_a_loop_around_a_line_of_type_II_exchanges_two_eigenvalues_and_two_directions(radius):
    line = sk.CUBIC_LINES[0]
    assert pixel.petrov(sk.cubic_field(line)) == "II" and pixel.petrov(sk.cubic_field(line + radius)) == "I"
    path = line + radius * np.exp(1j * np.linspace(0.0, 2 * math.pi, 801))
    eigenvalues = np.linalg.eigvals(sk.cubic_field(path[0]))
    carried = sk.follow(lambda w: np.linalg.eigvals(sk.cubic_field(w)), path[1:], eigenvalues)
    assert sk.moved(sk.permutation(eigenvalues, carried)) == 2         # one exchange
    directions = np.roots(sk.direction_quartic(sk.cubic_field(path[0])))
    carried = sk.follow(lambda w: np.roots(sk.direction_quartic(sk.cubic_field(w))), path[1:], directions)
    p = sk.permutation(directions, carried)
    assert sk.moved(p) == 2                                            # one exchange again
    fixed = [k for k in range(4) if p[k] == k]
    assert min(abs(directions[k]) for k in fixed) < 1e-12              # the direction at zeta = 0 is one that stays


# --- two explicit fields ---------------------------------------------------------------------------------------------

def test_the_first_field_and_its_two_loops_that_do_not_commute():
    rng = np.random.default_rng(2)
    for _ in range(20):
        p = rng.normal(size=3)
        w = p[0] + 1j * p[1]
        W = sk.cubic_field(w)
        assert np.allclose(hessian(sk.cubic_potential, p), W, atol=1e-8)                      # W = Hess F
        assert abs(np.trace(W)) < 1e-12 and np.allclose(W, W.T)                               # F is harmonic: vacuum
        for lam in np.linalg.eigvals(W):
            assert abs(np.polyval(sk.cubic_eigenvalue_polynomial(w), lam)) < 1e-9
        zeta = rng.normal() + 1j * rng.normal()
        assert np.polyval(sk.direction_quartic(W), zeta) == pytest.approx(
            4 * zeta * np.polyval(sk.cubic_direction_polynomial(w), zeta), rel=1e-10)
        for lam in np.linalg.eigvals(W):                                                      # three are 1 / lam
            assert abs(np.polyval(sk.cubic_direction_polynomial(w), 1 / lam)) < 1e-8 * max(1.0, abs(1 / lam) ** 3)
    # two eigenvalues meet on the lines w = +-2 / (3 sqrt 3)
    for line, double in zip(sk.CUBIC_LINES, (-1 / math.sqrt(3), 1 / math.sqrt(3))):
        assert np.polyval(sk.cubic_eigenvalue_polynomial(line), double) == pytest.approx(0.0, abs=1e-12)
        assert np.polyval(np.polyder(sk.cubic_eigenvalue_polynomial(line)), double) == pytest.approx(0.0, abs=1e-12)
    start = [-1.0, 0.0, 1.0]                                           # the eigenvalues at w = 0
    eigenvalues = lambda w: np.roots(sk.cubic_eigenvalue_polynomial(w))
    plus, minus = (sk.loop_around(line) for line in sk.CUBIC_LINES)
    a = sk.permutation(start, sk.follow(eigenvalues, plus, start))
    b = sk.permutation(start, sk.follow(eigenvalues, minus, start))
    assert a == (1, 0, 2) and b == (0, 2, 1)                           # -1 with 0 around one line, 0 with +1 the other
    ab = sk.permutation(start, sk.follow(eigenvalues, np.concatenate([plus, minus]), start))
    ba = sk.permutation(start, sk.follow(eigenvalues, np.concatenate([minus, plus]), start))
    assert ab == sk.compose(a, b) == (2, 0, 1) and ba == sk.compose(b, a) == (1, 2, 0)
    assert ab != ba                                                    # the two loops do not commute


def test_the_second_field_whose_loops_make_every_permutation_of_the_four_directions():
    rng = np.random.default_rng(2)
    v = np.array([1, 1j, 0])
    for _ in range(20):
        p = rng.normal(size=3)
        w = p[0] + 1j * p[1]
        W = sk.quartic_field(w)
        assert np.allclose(hessian(sk.quartic_potential, p), W, atol=1e-8)                    # W = Hess F
        assert np.allclose(W, sk.QUARTIC_A - w * np.outer(v, v) / 4)
        assert abs(np.trace(W)) < 1e-12 and np.allclose(W, W.T)
        assert sk.direction_quartic(W) == pytest.approx([-w, -1, 0, 0, 1], abs=1e-12)         # 1 - zeta^3 - w zeta^4
        for lam in np.linalg.eigvals(W):
            assert abs(np.polyval(sk.quartic_eigenvalue_polynomial(w), 4 * lam)) < 1e-9
    # two directions meet where r^4 - r - w has a double root
    for line in sk.QUARTIC_LINES:
        r = -line / 0.75
        assert abs(np.polyval(sk.quartic_direction_polynomial(line), r)) < 1e-12 and abs(4 * r**3 - 1) < 1e-12
    directions = lambda w: np.roots(sk.quartic_direction_polynomial(w))
    start = list(directions(0.0))                                      # r = 0 and the three cube roots of one
    loops = [sk.permutation(start, sk.follow(directions, sk.loop_around(line), start)) for line in sk.QUARTIC_LINES]
    assert all(sk.moved(g) == 2 for g in loops) and len(set(loops)) == 3                      # three exchanges
    group = sk.generated(loops)
    assert group == set(permutations(range(4)))                        # all 24
    # the eigenvalues are the three ways of pairing the four, and see six of the 24: S_4 over the four-group
    r = np.array(start)
    for (i, j), (k, l) in sk.PAIRINGS:
        assert abs(np.polyval(sk.quartic_eigenvalue_polynomial(0.0), r[i] * r[j] + r[k] * r[l])) < 1e-12
    w = 0.3 - 0.2j
    r = directions(w)
    pairs = sorted((r[i] * r[j] + r[k] * r[l] for (i, j), (k, l) in sk.PAIRINGS), key=lambda y: (y.real, y.imag))
    eigen = sorted(4 * np.linalg.eigvals(sk.quartic_field(w)), key=lambda y: (y.real, y.imag))
    assert np.allclose(pairs, eigen, atol=1e-10)
    seen = {sk.on_pairings(g) for g in group}
    assert len(seen) == 6 and seen == set(permutations(range(3)))
    blind = [g for g in group if sk.on_pairings(g) == (0, 1, 2)]       # what the eigenvalues cannot see
    assert sorted(blind) == [(0, 1, 2, 3), (1, 0, 3, 2), (2, 3, 0, 1), (3, 2, 1, 0)]          # exchanges in two pairs
