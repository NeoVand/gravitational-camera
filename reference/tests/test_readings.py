"""Two readings of one scene (gravcam/readings.py): the cone on a flat camera, the ladder of pushes and its pair of
bodies, the flow of a sphere without spin, shocks that heat and cool, and the tidal lens."""
import math

import numpy as np
import pytest

from gravcam import hair, readings
from gravcam.constants import G, c

W = np.array([1.0, 1.0j, 0.0])                    # the null vector of x + iy


def _a_scene(n: int = 7, seed: int = 4):
    """Masses below a flat camera: points (a_x, a_y, z) with z > 0, and their masses."""
    rng = np.random.default_rng(seed)
    across, depth = rng.normal(size=(n, 2)), rng.uniform(0.3, 1.5, n)
    return np.column_stack([across, depth]), rng.uniform(0.5, 2.0, n)


def _a_cloud(n: int = 9, seed: int = 6):
    """Free particles: places, velocities and masses."""
    rng = np.random.default_rng(seed)
    return rng.normal(size=(n, 3)), rng.normal(size=(n, 3)), rng.uniform(0.5, 2.0, n)


def poisson_bracket(F, H, x, p, dx: float, dp: float) -> float:
    """{F, H} = sum_a (dF/dx_a . dH/dp_a - dF/dp_a . dH/dx_a) for functions of (x, p), by central differences."""
    def slopes(f):
        fx, fp = np.zeros_like(x), np.zeros_like(p)
        for a in range(len(x)):
            for i in range(3):
                e = np.zeros_like(x)
                e[a, i] = 1.0
                fx[a, i] = (f(x + dx * e, p) - f(x - dx * e, p)) / (2 * dx)
                fp[a, i] = (f(x, p + dp * e) - f(x, p - dp * e)) / (2 * dp)
        return fx, fp
    (Fx, Fp), (Hx, Hp) = slopes(F), slopes(H)
    return float(np.sum(Fx * Hp - Fp * Hx))


# --- on a flat camera ----------------------------------------------------------------------------------------------

@pytest.mark.parametrize("k", [(0.9, -0.4), (0.2, 1.1), (2.0, 0.3)])
def test_the_first_reading_is_the_transform_on_the_cone(k):
    points, m = _a_scene()
    # h_k is harmonic: its gradient is a null vector times h_k, and its Laplacian by differences vanishes
    step = np.array([1j * k[0], 1j * k[1], -np.linalg.norm(k)])
    assert abs(step @ step) < 1e-12
    assert np.allclose(readings.plane_harmonic_gradient(k, points), readings.plane_harmonic(k, points)[:, None] * step)
    e = 1e-3
    lap = sum(readings.plane_harmonic(k, points + e * d) - 2 * readings.plane_harmonic(k, points)
              + readings.plane_harmonic(k, points - e * d) for d in np.eye(3)) / e**2
    assert np.max(np.abs(lap)) < 1e-5
    assert readings.first_reading(points, m, k) == pytest.approx(
        readings.scene_transform(points, m, k, float(np.linalg.norm(k))), rel=1e-12)


def test_the_second_reading_is_the_transform_inside_the_cone():
    points, m = _a_scene()
    k, kp = np.array([0.9, -0.4]), np.array([0.2, 1.1])
    K, kap = readings.cone_point(k, kp)
    assert np.allclose(K, k + kp) and kap == pytest.approx(np.linalg.norm(k) + np.linalg.norm(kp))
    assert kap > np.linalg.norm(K)                                               # inside
    symbol = readings.laplacian_symbol(K, kap)
    assert symbol == pytest.approx(np.linalg.norm(k) * np.linalg.norm(kp) - k @ kp, rel=1e-12)
    assert readings.second_reading(points, m, k, kp) == pytest.approx(
        symbol * readings.scene_transform(points, m, K, kap), rel=1e-12)
    # two pushes along one direction lie on the cone, where the symbol vanishes: they read nothing
    assert readings.laplacian_symbol(*readings.cone_point(k, 2.5 * k)) == pytest.approx(0.0, abs=1e-12)
    assert abs(readings.second_reading(points, m, k, 2.5 * k)) < 1e-12 * abs(readings.second_reading(points, m, k, kp))


def test_every_pair_on_the_ellipse_reads_the_same_point():
    points, m = _a_scene()
    K, kap = readings.cone_point([0.9, -0.4], [0.2, 1.1])
    want = readings.scene_transform(points, m, K, kap)
    for t in (0.3, 1.7, 2.9, 4.4, 5.9):
        k, kp = readings.pair_on_the_ellipse(K, kap, t)
        assert np.allclose(k + kp, K) and np.linalg.norm(k) + np.linalg.norm(kp) == pytest.approx(kap, rel=1e-12)
        assert readings.transform_from_second_reading(points, m, K, kap, t) == pytest.approx(want, rel=1e-12)
    # straight below the camera (K = 0) the ellipse is a circle of pushes that meet head on
    k, kp = readings.pair_on_the_ellipse([0.0, 0.0], 1.4, 0.8)
    assert np.allclose(k, -kp) and np.linalg.norm(k) == pytest.approx(0.7)
    assert readings.transform_from_second_reading(points, m, [0.0, 0.0], 1.4, 0.8) == pytest.approx(
        np.sum(m * np.exp(-1.4 * points[:, 2])), rel=1e-12)


def test_a_shell_and_a_ball_agree_on_the_cone_and_differ_inside_it():
    M, R, centre = 2.0, 0.4, np.array([0.3, -0.2, 0.9])
    shell = readings.shells_as_points([(M, R)])
    ball = readings.shells_as_points(readings.uniform_layer(M, 0.0, R))
    point = (np.zeros((1, 3)), np.array([M]))
    k, kp = np.array([0.9, -0.4]), np.array([0.2, 1.1])
    K, kap = readings.cone_point(k, kp)
    first = [readings.first_reading(p + centre, m, k) for p, m in (point, shell, ball)]
    assert first[1] == pytest.approx(first[0], rel=1e-12) and first[2] == pytest.approx(first[0], rel=1e-12)
    second = [readings.second_reading(p + centre, m, k, kp) for p, m in (point, shell, ball)]
    s = math.sqrt(kap**2 - K @ K) * R                                # the distance from the cone, times the radius
    assert second[1] / second[0] == pytest.approx(math.sinh(s) / s, rel=1e-12)
    assert second[2] / second[0] == pytest.approx(3 * (s * math.cosh(s) - math.sinh(s)) / s**3, rel=1e-12)
    assert abs(second[1] - second[2]) > 0.01 * abs(second[0])


def test_the_second_reading_is_hyperbolic_too_with_the_ratio_seven_to_six():
    across, depth = readings.second_reading_metric(0.5)                # 2z = 1
    assert across == pytest.approx(28 / 3, rel=1e-12) and depth == pytest.approx(8.0, rel=1e-12)
    assert across / depth == pytest.approx(7 / 6, rel=1e-12)
    for z in (0.1, 2.0):                                               # the cell grows with the depth
        assert readings.second_reading_metric(z) == pytest.approx((28 / 3 / (2 * z) ** 2, 8 / (2 * z) ** 2), rel=1e-12)


def test_a_zonal_quadrupole_push_reads_the_first_hidden_number():
    rng = np.random.default_rng(4)
    p, m = 0.4 * rng.normal(size=(9, 3)), rng.uniform(0.5, 2.0, 9)
    grad = np.stack([-p[:, 0], -p[:, 1], 2 * p[:, 2]], axis=1)       # of z^2 - (x^2 + y^2) / 2
    r2 = np.sum(p**2, axis=1)
    P2 = (3 * p[:, 2] ** 2 / r2 - 1) / 2
    assert hair.bilinear(m, grad, grad) == pytest.approx(2 * np.sum(m * r2) + 2 * np.sum(m * r2 * P2), rel=1e-12)


# --- the ladder ----------------------------------------------------------------------------------------------------

@pytest.mark.parametrize("d", [4, 5, 6, 7, 8])
@pytest.mark.parametrize("m", [1, 2, 3, 4])
def test_a_push_of_degree_m_reaches_what_m_laplacians_kill(d, m):
    rng = np.random.default_rng(4)
    points = rng.normal(size=(140, 3))                                 # more than C(10, 2) = 45 of them
    assert readings.ladder_span(d, m, points, rng) == readings.ladder_dimension(d, m)


def test_the_dimensions_of_the_ladder():
    table = {4: [9, 14, 15, 15], 6: [13, 22, 27, 28], 8: [17, 30, 39, 44]}
    for d, row in table.items():
        assert [readings.ladder_dimension(d, m) for m in (1, 2, 3, 4)] == row
    for d in range(1, 12):
        assert readings.ladder_dimension(d, 1) == 2 * d + 1               # the first reading: the harmonic ones
        assert readings.ladder_dimension(d, d) == math.comb(d + 2, 2)     # every polynomial, once 2m > d
    # in each angular sector L the weights r^L, ..., r^(L + 2(m - 1)): sectors L = d, d - 2, ..., d - 2(m - 1)
    assert readings.ladder_dimension(8, 3) == sum(2 * L + 1 for L in (8, 6, 4))


def test_each_laplacian_takes_one_derivative_from_each_function():
    # exactly, on harmonic polynomials with whole coefficients
    u, v, w = (1, 1j, 0), (3, 4, 5j), (2 + 1j, 1 + 2j, 2 - 2j)
    assert all(sum(x * x for x in a) == 0 for a in (u, v, w))                          # three null vectors
    reached = 0
    for a, p, b, q in ((u, 3, v, 5), (v, 5, w, 4), (w, 4, u, 6), (u, 2, w, 7), (v, 3, u, 3)):
        for h in readings.harmonic_power(a, p):
            for g in readings.harmonic_power(b, q):
                assert readings.poly_laplacian(h) == {} and readings.poly_laplacian(g) == {}
                form = readings.poly_contraction(h, g, 1)                              # grad h . grad g
                for m in (1, 2, 3, 4):
                    want = readings.poly_scaled(readings.poly_contraction(h, g, m + 1), 2**m)
                    assert readings.poly_laplacian(form, m) == want
                    if min(p, q) <= m:
                        assert want == {}                                              # no reach beyond its degree
                    reached += want != {}
    assert reached >= 40          # of the 44 cases within reach; two vanish by an accident of these vectors
    # and on sums of them, which are harmonic polynomials at large
    h = readings.poly_sum(readings.harmonic_power(u, 4)[0], readings.harmonic_power(v, 4)[1])
    g = readings.poly_sum(readings.harmonic_power(w, 5)[0], readings.poly_scaled(readings.harmonic_power(v, 5)[0], -3))
    for m in (1, 2, 3):
        assert readings.poly_laplacian(readings.poly_contraction(h, g, 1), m) \
            == readings.poly_scaled(readings.poly_contraction(h, g, m + 1), 2**m) != {}


def test_two_bodies_that_no_quadrupole_push_tells_apart():
    M, R = 3.0, 2.0
    (pa, ma), (pb, mb) = (readings.shells_as_points(body) for body in readings.ladder_pair(M, R))
    # the same mass, the same <r^2>, and no other harmonic moment: the same field outside
    assert np.sum(ma) == pytest.approx(M, rel=1e-12) and np.sum(mb) == pytest.approx(M, rel=1e-12)
    assert np.sum(ma * np.sum(pa**2, axis=1)) == pytest.approx(M * R**2 / 2, rel=1e-12)
    assert np.sum(mb * np.sum(pb**2, axis=1)) == pytest.approx(M * R**2 / 2, rel=1e-12)
    rng = np.random.default_rng(4)
    for n in range(1, 9):
        a = readings.random_null_vector(rng)
        for p, m in ((pa, ma), (pb, mb)):
            assert abs(np.sum(m * readings.power(a, n, p))) < 1e-12 * M * R**n
    h2 = lambda p: readings.power_gradient(W, 2, p).real              # of (x^2 - y^2) / 2
    h3 = lambda p: readings.power_gradient(W, 3, p).real              # of (x^3 - 3 x y^2) / 3
    assert hair.bilinear(ma, h2(pa), h2(pa)) == pytest.approx(M * R**2 / 3, rel=1e-12)
    assert hair.bilinear(mb, h2(pb), h2(pb)) == pytest.approx(M * R**2 / 3, rel=1e-12)
    assert hair.bilinear(ma, h3(pa), h3(pa)) == pytest.approx(2 * M * R**4 / 15, rel=1e-12)
    assert hair.bilinear(mb, h3(pb), h3(pb)) == pytest.approx(4 * M * R**4 / 15, rel=1e-12)
    # any quadrupole push, with any readout up to degree 8
    for _ in range(200):
        a, b, q = readings.random_null_vector(rng), readings.random_null_vector(rng), int(rng.integers(1, 9))
        push = lambda p: readings.power_gradient(a, 2, p).real
        read = lambda p: readings.power_gradient(b, q, p).real
        seen_a, seen_b = hair.bilinear(ma, push(pa), read(pa)), hair.bilinear(mb, push(pb), read(pb))
        assert abs(seen_a - seen_b) < 1e-12 * M * R**q


def test_the_second_reading_reads_the_interior_potential():
    M, R = 2.0, 0.7
    chi = lambda r: readings.shell_ball_potential_difference(M, R, r)
    assert chi(0.0) == pytest.approx(-G * M / R + 3 * G * M / (2 * R), rel=1e-12)     # Phi_shell - Phi_ball
    assert chi(0.5 * R) == pytest.approx(G * M / (2 * R) * 0.75, rel=1e-12) and chi(R) == 0 and chi(2 * R) == 0
    ps, ms = readings.shells_as_points([(M, R)])
    pb, mb = readings.shells_as_points(readings.uniform_layer(M, 0.0, R))
    rng = np.random.default_rng(8)
    for p, q in ((2, 2), (2, 3), (3, 3), (4, 3), (5, 5)):
        a, b = readings.random_null_vector(rng), readings.random_null_vector(rng)
        gh, gg = (lambda x: readings.power_gradient(a, p, x).real), (lambda x: readings.power_gradient(b, q, x).imag)
        hh, hg = (lambda x: readings.power_hessian(a, p, x).real), (lambda x: readings.power_hessian(b, q, x).imag)
        direct = hair.bilinear(ms, gh(ps), gg(ps)) - hair.bilinear(mb, gh(pb), gg(pb))
        through_chi = readings.null_space_form(chi, hh, hg, R)
        assert through_chi == pytest.approx(direct, rel=1e-10, abs=1e-12 * M * R ** (p + q - 2))
    # two quadrupoles: 1/3 - 1/5 of M R^2 for each unit of the product of their tides, the paper's three to five
    tide_h, tide_g = np.diag([-1.0, -1.0, 2.0]), np.array([[0.3, 1.0, 0.0], [1.0, -0.5, 0.2], [0.0, 0.2, 0.2]])
    got = readings.null_space_form(chi, lambda x: np.broadcast_to(tide_h, (len(x), 3, 3)),
                                   lambda x: np.broadcast_to(tide_g, (len(x), 3, 3)), R)
    assert got == pytest.approx((1 / 3 - 1 / 5) * M * R**2 * np.sum(tide_h * tide_g), rel=1e-12)
    assert hair.bilinear(ms, ps @ tide_h, ps @ tide_h) / hair.bilinear(mb, pb @ tide_h, pb @ tide_h) \
        == pytest.approx(5 / 3, rel=1e-12)


# --- flow ----------------------------------------------------------------------------------------------------------

def test_the_bracket_of_two_rates_is_the_flow():
    x, v, m = _a_cloud(n=4)
    p = m[:, None] * v
    rng = np.random.default_rng(2)
    for nh, ng in ((2, 3), (3, 3), (4, 2)):
        a, b = readings.random_null_vector(rng), readings.random_null_vector(rng)
        rate_h = lambda x, p: float(np.sum(p * readings.power_gradient(a, nh, x).real))      # dQ_h/dt = sum p . grad h
        rate_g = lambda x, p: float(np.sum(p * readings.power_gradient(b, ng, x).imag))
        got = readings.rate_bracket(p, readings.power_gradient(a, nh, x).real, readings.power_hessian(a, nh, x).real,
                                    readings.power_gradient(b, ng, x).imag, readings.power_hessian(b, ng, x).imag)
        assert got == pytest.approx(poisson_bracket(rate_h, rate_g, x, p, 1e-4, 1e-4), rel=1e-6)
        back = readings.rate_bracket(p, readings.power_gradient(b, ng, x).imag, readings.power_hessian(b, ng, x).imag,
                                     readings.power_gradient(a, nh, x).real, readings.power_hessian(a, nh, x).real)
        assert back == pytest.approx(-got, rel=1e-12)


def test_a_sphere_without_spin_still_shows_its_flow():
    M, Omega, R = 3.0, 0.7, 1.3
    x, m, v = readings.counter_rotating_sphere(M, Omega, R)
    p = m[:, None] * v
    scale = M * Omega * R**2
    assert np.sum(m) == pytest.approx(M, rel=1e-12)
    assert np.sum(m * np.sum(x**2, axis=1)) == pytest.approx(0.6 * M * R**2, rel=1e-12)       # a uniform ball
    inner = np.linalg.norm(x, axis=1) < readings.INNER_RADIUS * R
    assert np.sum(m[inner]) == pytest.approx(M * readings.INNER_RADIUS**3, rel=1e-12)
    assert np.allclose(np.cross(x, p).sum(axis=0), 0.0, atol=1e-13 * scale)                   # no angular momentum
    # what the field outside holds of the flow is zero at every degree: the rates of the mass moments, sum p . grad h,
    # and the moments of the spin, sum (x cross p) . grad h, which make the magnetic tide
    rng = np.random.default_rng(7)
    for n in range(1, 8):
        grad = readings.power_gradient(readings.random_null_vector(rng), n, x)
        assert abs(np.sum(p * grad)) < 1e-12 * scale * R ** (n - 2)
        assert abs(np.sum(np.cross(x, p) * grad)) < 1e-12 * scale * R ** (n - 1)
    # the bracket of two rates is not: h + i g = (x + iy)^3 / 3
    grad, hess = readings.power_gradient(W, 3, x), readings.power_hessian(W, 3, x)
    got = readings.rate_bracket(p, grad.real, hess.real, grad.imag, hess.imag)
    assert got == pytest.approx(readings.hidden_spin_rate_bracket(M, Omega, R), rel=1e-12)
    assert got / (M * Omega * R**4) == pytest.approx(0.22139, abs=1e-5)                       # (32/35)(1 - 2^(-2/5))
    assert got == pytest.approx(-4 * np.sum(m * (x[:, 0] ** 2 + x[:, 1] ** 2) * np.cross(x, v)[:, 2]), rel=1e-12)
    # with both layers reversed it changes sign; at rest it is zero; a sphere turning as one gives -(32/35) M Omega R^4
    assert readings.rate_bracket(-p, grad.real, hess.real, grad.imag, hess.imag) == pytest.approx(-got, rel=1e-12)
    assert readings.rate_bracket(0 * p, grad.real, hess.real, grad.imag, hess.imag) == 0.0
    rigid = m[:, None] * Omega * np.stack([-x[:, 1], x[:, 0], 0 * x[:, 0]], axis=1)
    assert readings.rate_bracket(rigid, grad.real, hess.real, grad.imag, hess.imag) \
        == pytest.approx(-32 / 35 * M * Omega * R**4, rel=1e-12)


def test_once_energy_has_weight_the_moments_do_not_commute():
    # the general formula against a Poisson bracket by differences, for a few fast particles (SI units)
    rng = np.random.default_rng(3)
    x, m = rng.normal(size=(4, 3)), rng.uniform(0.5, 2.0, 4)
    p = m[:, None] * c * rng.normal(size=(4, 3))                                  # speeds of the order of light's
    for nh, ng in ((2, 2), (2, 3), (3, 1)):
        a, b = readings.random_null_vector(rng), readings.random_null_vector(rng)
        h, g = (lambda x: readings.power(a, nh, x).real), (lambda x: readings.power(b, ng, x).imag)
        Q_h = lambda x, p: readings.energy_moment(m, p, h(x))
        Q_g = lambda x, p: readings.energy_moment(m, p, g(x))
        got = readings.moment_bracket(p, h(x), readings.power_gradient(a, nh, x).real,
                                      g(x), readings.power_gradient(b, ng, x).imag)
        assert got == pytest.approx(poisson_bracket(Q_h, Q_g, x, p, 1e-4, 1e-4 * c), rel=1e-6)
        # the same written with the velocities, (E / c^2) v = p, none of them slow
        E = np.sqrt((m * c**2) ** 2 + np.sum(p**2, axis=1) * c**2)
        v = p * c**2 / E[:, None]
        assert np.all(np.linalg.norm(v, axis=1) < c) and np.linalg.norm(v, axis=1).max() > 0.5 * c
        assert readings.moment_bracket((E / c**2)[:, None] * v, h(x), readings.power_gradient(a, nh, x).real,
                                       g(x), readings.power_gradient(b, ng, x).imag) == pytest.approx(got, rel=1e-12)
    # the mass and a dipole: {Q_1, Q_x} = -P_x / c^2, the centre of energy moves with the momentum
    one, zero = np.ones(len(x)), np.zeros((len(x), 3))
    ex = np.tile([1.0, 0.0, 0.0], (len(x), 1))
    assert readings.moment_bracket(p, one, zero, x[:, 0], ex) == pytest.approx(-np.sum(p[:, 0]) / c**2, rel=1e-12)
    # two dipoles: {Q_x, Q_y} = -L_z / c^2 (Pryce)
    ey = np.tile([0.0, 1.0, 0.0], (len(x), 1))
    assert readings.moment_bracket(p, x[:, 0], ex, x[:, 1], ey) \
        == pytest.approx(-np.sum(np.cross(x, p)[:, 2]) / c**2, rel=1e-12)
    # two quadrupoles, h = x^2 - y^2 and g = 2xy: -(2 / c^2) int (x^2 + y^2) l_z dV
    quad, grad = 2 * readings.power(W, 2, x), 2 * readings.power_gradient(W, 2, x)
    assert readings.moment_bracket(p, quad.real, grad.real, quad.imag, grad.imag) \
        == pytest.approx(-2 / c**2 * np.sum((x[:, 0] ** 2 + x[:, 1] ** 2) * np.cross(x, p)[:, 2]), rel=1e-12)


def test_the_quadrupoles_of_the_sphere_without_spin_do_not_commute():
    M, Omega, R = 3.0, 0.7, 1.3
    x, m, v = readings.counter_rotating_sphere(M, Omega, R)
    assert readings.weighted_spin(m, x, v) == pytest.approx(-8 / 35 * (1 - 2**-0.4) * M * Omega * R**4, rel=1e-12)
    assert readings.weighted_spin(m, x, v) / (M * Omega * R**4) == pytest.approx(-0.05535, abs=1e-5)
    quad, grad = 2 * readings.power(W, 2, x), 2 * readings.power_gradient(W, 2, x)
    got = readings.moment_bracket(m[:, None] * v, quad.real, grad.real, quad.imag, grad.imag)
    assert got == pytest.approx(-2 / c**2 * readings.weighted_spin(m, x, v), rel=1e-12)
    assert got == pytest.approx(readings.hidden_spin_moment_bracket(M, Omega, R), rel=1e-12)
    assert got * c**2 / (M * Omega * R**4) == pytest.approx(0.11069, abs=1e-5)                # (16/35)(1 - 2^(-2/5))
    assert readings.hidden_spin_moment_bracket(M, Omega, R) * c**2 \
        == pytest.approx(readings.hidden_spin_rate_bracket(M, Omega, R) / 2, rel=1e-12)


# --- shocks (units c = 1) -------------------------------------------------------------------------------------------

def _a_cloud_at_a_front(rng):
    """A few particles, some of them massless, where they meet a wave front, and the gradient there of a random
    harmonic profile (a quadratic and a cubic)."""
    n = int(rng.integers(2, 9))
    m = rng.uniform(0.0, 2.0, n) * (rng.uniform(size=n) > 0.2)
    p_perp, p_z, x = rng.normal(size=(n, 2)), rng.normal(size=n), rng.normal(size=(n, 2))
    k = rng.normal(size=3)
    grad = np.stack([k[0] * x[:, 0] + k[1] * x[:, 1] + k[2] * (x[:, 0] ** 2 - x[:, 1] ** 2),
                     k[1] * x[:, 0] - k[0] * x[:, 1] - 2 * k[2] * x[:, 0] * x[:, 1]], axis=1)
    return m, p_perp, p_z, grad


def test_the_energy_gained_in_a_shock():
    rng = np.random.default_rng(9)
    for _ in range(50):
        m, p_perp, p_z, grad = _a_cloud_at_a_front(rng)
        energy = lambda pp, pz: np.sqrt(m**2 + np.sum(pp**2, axis=1) + pz**2)
        new_perp, new_z = readings.cross_shock(m, p_perp, p_z, grad)
        assert np.allclose(energy(new_perp, new_z) - new_z, energy(p_perp, p_z) - p_z, rtol=1e-12)     # E - p_z is kept
        assert np.allclose(new_perp - p_perp, 0.5 * (energy(p_perp, p_z) - p_z)[:, None] * grad, rtol=1e-12)
        assert np.allclose(energy(new_perp, new_z) - energy(p_perp, p_z),
                           readings.shock_energy_gain(m, p_perp, p_z, grad), rtol=1e-10, atol=1e-12)
    # light that meets the wave head on counts twice, light across it once, light along it not at all
    grad = np.array([[0.3, -0.1]])
    against = readings.shock_energy_gain([0.0], [[0.0, 0.0]], [-1.0], grad)[0]
    across = readings.shock_energy_gain([0.0], [[0.0, 1.0]], [0.0], grad)[0] - 0.5 * grad[0, 1]
    assert against == pytest.approx(2 * across, rel=1e-12) and across == pytest.approx(np.sum(grad**2) / 8, rel=1e-12)
    assert readings.shock_energy_gain([0.0], [[0.0, 0.0]], [1.0], grad)[0] == 0.0


def test_two_masses_flying_apart_are_stopped_by_one_pulse():
    p, r = 0.75, 1.0
    m, x = np.array([1.0, 1.0]), np.array([[r, 0.0], [-r, 0.0]])
    p_perp, p_z = np.array([[p, 0.0], [-p, 0.0]]), np.zeros(2)
    E = math.sqrt(1 + p * p)
    grad = readings.stopping_profile_gradient(x, p, E, r)
    assert math.sqrt(readings.invariant_mass_squared(m, p_perp, p_z)) == pytest.approx(2.5, rel=1e-12)      # 2E
    new_perp, new_z = readings.cross_shock(m, p_perp, p_z, grad)
    assert np.allclose(new_perp, 0.0, atol=1e-15)
    assert math.sqrt(readings.invariant_mass_squared(m, new_perp, new_z)) == pytest.approx(2.0, rel=1e-12)   # 2m
    assert np.sum(readings.shock_energy_gain(m, p_perp, p_z, grad)) < 0                                      # it cooled
    # the reverse pulse heats by more than the first cooled: the even part is positive
    back_perp, back_z = readings.cross_shock(m, p_perp, p_z, grad, lam=-1.0)
    even = readings.invariant_mass_squared(m, back_perp, back_z) + 4.0 - 2 * 6.25
    assert even == pytest.approx(readings.shock_even_part(m, p_perp, p_z, grad), rel=1e-12) and even > 0


def test_the_mass_after_a_shock_and_the_part_that_is_even_in_the_pulse():
    rng = np.random.default_rng(9)
    cooled, least = 0, math.inf
    for _ in range(2000):
        m, p_perp, p_z, grad = _a_cloud_at_a_front(rng)
        M2 = {}
        for lam in (-1.0, 0.0, 1.0):
            M2[lam] = readings.invariant_mass_squared(m, *readings.cross_shock(m, p_perp, p_z, grad, lam))
            assert readings.mass_squared_after_shock(m, p_perp, p_z, grad, lam) == pytest.approx(M2[lam], rel=1e-11)
        even = M2[1.0] + M2[-1.0] - 2 * M2[0.0]
        assert even == pytest.approx(readings.shock_even_part(m, p_perp, p_z, grad), rel=1e-9, abs=1e-12 * M2[0.0])
        least = min(least, even / M2[0.0])
        cooled += M2[1.0] < M2[0.0]
    assert least > 0                                    # a pulse and its reverse together never cool
    assert 100 < cooled < 400                           # while one pulse alone cools about a tenth (224 with this seed)


CROSSINGS = [("a mass at rest", (0.0, 0.0, 0.0), 1.0), ("a mass moving sideways at 0.6 c", (0.75, 0.0, 0.0), 1.0),
             ("a mass moving against the wave at 0.9 c", (0.0, 0.0, -2.0647), 1.0),
             ("a mass moving with the wave at 0.9 c", (0.3, -0.2, 2.0647), 1.0),
             ("light against the wave", (0.0, 0.0, -1.0), 0.0), ("light across the wave", (0.6, 0.8, 0.0), 0.0),
             ("light nearly with the wave", (0.1, 0.0, 0.995), 0.0)]


@pytest.mark.parametrize("name, momentum, mass", CROSSINGS, ids=[case[0].replace(" ", "-") for case in CROSSINGS])
def test_geodesics_through_a_narrow_wave_gain_the_same_energy(name, momentum, mass):
    eps, kap, meet = 0.3, 0.7, (0.2, 0.1)
    H = lambda x, y: eps * math.exp(kap * x) * math.cos(kap * y)                        # harmonic across the front
    dH = lambda x, y: (kap * H(x, y), -eps * kap * math.exp(kap * x) * math.sin(kap * y))
    want = readings.shock_energy_gain([mass], [momentum[:2]], [momentum[2]], [dH(*meet)])[0]
    off = [abs(readings.geodesic_energy_gain(momentum, mass, H, dH, meet, width=w) - want) for w in (2e-3, 1e-3)]
    assert off[0] < 2e-5                                # of the order of the pulse's width, 2e-3, times the gain
    assert off[1] < 0.6 * off[0]                        # and falling with it


# --- the tidal lens -------------------------------------------------------------------------------------------------

def test_a_kick_and_a_drift_read_phase_space():
    x, v, m = _a_cloud()
    rng = np.random.default_rng(5)
    for _ in range(5):
        A = rng.normal(size=(3, 3))
        A = A + A.T - 2 * np.trace(A) / 3 * np.eye(3)                 # a tide: symmetric and trace-free
        T, k = float(rng.uniform(0.3, 3.0)), rng.normal(size=3)
        after = readings.kick_and_drift(x, v, A, T)
        assert np.allclose(after, x + T * (v + x @ A), rtol=1e-12)
        assert readings.density_transform(after, m, k) == pytest.approx(
            readings.phase_space_transform(x, v, m, (np.eye(3) + T * A) @ k, T * k), rel=1e-12)
    # with no kick a drift reads only the line K = P / T
    assert readings.density_transform(x + 2.0 * v, m, [0.3, -0.2, 0.5]) == pytest.approx(
        readings.phase_space_transform(x, v, m, [0.3, -0.2, 0.5], [0.6, -0.4, 1.0]), rel=1e-12)


def test_one_saddle_reaches_any_point_of_phase_space():
    x, v, m = _a_cloud()
    rng = np.random.default_rng(11)
    for trial in range(8):
        K, P, T = rng.normal(size=3), rng.normal(size=3), float(rng.uniform(0.3, 3.0))
        if trial == 6:
            K = (1 + 0.8 * T) * P / T                                 # K - P/T along P
        if trial == 7:
            K = (1 - 0.8 * T) * P / T                                 # and against it
        A = readings.saddle_reaching(K, P, T)
        gamma = np.linalg.norm(K - P / T) / np.linalg.norm(P)
        assert np.allclose(A, A.T) and abs(np.trace(A)) < 1e-12 * gamma
        assert np.linalg.eigvalsh(A) == pytest.approx([-gamma, 0.0, gamma], abs=1e-12 * gamma)   # rank two, a saddle
        assert np.allclose((np.eye(3) + T * A) @ (P / T), K, rtol=1e-12, atol=1e-12)
        after = readings.kick_and_drift(x, v, A, T)
        assert readings.density_transform(after, m, P / T) == pytest.approx(
            readings.phase_space_transform(x, v, m, K, P), rel=1e-10)
    assert np.all(readings.saddle_reaching([0.2, 0.4, -0.6], [0.1, 0.2, -0.3], 0.5) == 0)     # K = P / T: no kick
    with pytest.raises(ValueError):
        readings.saddle_reaching([1.0, 0.0, 0.0], [0.0, 0.0, 0.0], 1.0)


@pytest.mark.parametrize("n, dimension", [(1, 6), (2, 21), (3, 56), (4, 126), (5, 252)])
def test_one_fixed_quadrupole_and_one_readout_reach_every_moment(n, dimension):
    assert readings.orbit_rank(n) == (dimension, dimension)
    assert dimension == math.comb(n + 5, 5)
    readout = readings.saddle_readout(n)
    assert readings.poly_laplacian(readout) == {}                     # harmonic, and a function of the place alone
    assert all(e[3:] == (0, 0, 0) for e in readout)


def test_the_readout_is_the_real_part_of_a_null_form():
    for n in range(1, 7):
        real, imag = readings.harmonic_power((3, 4, 5j), n)           # (1 + i)(u + iv) has the real part u - v
        want = readings.poly_sum(real, readings.poly_scaled(imag, -1))
        assert {e[:3]: co for e, co in readings.saddle_readout(n).items()} == want


def test_the_axis_without_force_is_reached_through_a_double_bracket():
    twice_H = {(0, 0, 0, 2, 0, 0): 1, (0, 0, 0, 0, 2, 0): 1, (0, 0, 0, 0, 0, 2): 1}           # |v|^2
    once = readings.kick_derivation(twice_H)                                                  # {2H, Q}
    assert once == {(1, 0, 0, 1, 0, 0): -2, (0, 1, 0, 0, 1, 0): 2}                            # -2 (x v_x - y v_y)
    assert readings.kick_derivation(once) == {(2, 0, 0, 0, 0, 0): 2, (0, 2, 0, 0, 0, 0): 2}   # {{H, Q}, Q} = x^2 + y^2
    # the drift turns places into velocities, z included; the kick alone never touches z
    z2 = {(0, 0, 2, 0, 0, 0): 1}
    assert readings.drift_derivation(z2) == {(0, 0, 1, 0, 0, 1): 2} and readings.kick_derivation(z2) == {}
    assert readings.kick_derivation(readings.drift_derivation(z2)) == {}
