"""The geometry of access (gravcam/hyperbolic.py): Laplace's equation as a field on hyperbolic space, and the Fisher
metric on the place of a source inside a sphere of sensors, for three kinds of sensor."""
import math

import numpy as np
import pytest

from gravcam import hyperbolic as hy
from gravcam import nullspace, readings
from gravcam.response import sphere_quadrature

RADII = (0.2, 0.5, 0.8, 0.9, 0.95)


# --- Laplace's equation on hyperbolic space -------------------------------------------------------------------------

def test_a_potential_is_a_conformally_coupled_field_on_hyperbolic_space():
    source = np.array([0.3, -0.2, -0.7])                               # outside the region z > 0
    phi = lambda p: 1.0 / np.linalg.norm(p - source)
    u = hy.lifted(phi)
    for p in ([0.4, 0.1, 0.9], [-1.0, 0.6, 0.2], [0.0, 0.0, 3.0], [0.2, 0.1, 0.01]):
        assert abs(hy.hyperbolic_laplacian(u, p) + 0.75 * u(np.array(p))) < 5e-6 * abs(u(np.array(p)))  # differences
    # a pattern that fades with depth, exp(i k . a - |k| z), is one too (its real part here)
    k = np.array([0.9, -0.4])
    wave = lambda p: readings.plane_harmonic(k, np.array([p]))[0].real
    p = np.array([0.4, 0.1, 0.9])
    assert abs(hy.hyperbolic_laplacian(hy.lifted(wave), p) + 0.75 * hy.lifted(wave)(p)) < 5e-6
    # and a function that is not harmonic leaves z^(5/2) times its Laplacian: r^2 has the Laplacian 6
    bowl = hy.lifted(lambda q: float(q @ q))
    assert hy.hyperbolic_laplacian(bowl, p) + 0.75 * bowl(p) == pytest.approx(6 * p[2] ** 2.5, rel=1e-6)


def test_the_two_behaviours_at_the_boundary():
    assert hy.indicial(0.5) == 0 and hy.indicial(1.5) == 0             # m^2 = -3/4: dimensions 1/2 and 3/2
    assert hy.indicial(1.0) == pytest.approx(-0.25)
    p = np.array([0.3, -0.5, 0.8])
    for s in (0.5, 1.5, 1.0, 2.0, -0.5):
        u = lambda q: q[2] ** s
        assert hy.hyperbolic_laplacian(u, p) + 0.75 * u(p) == pytest.approx(hy.indicial(s) * u(p), abs=5e-6)
    # they are the potential on the camera (Phi = 1) and the normal gravity there (Phi = z), both harmonic
    assert hy.lifted(lambda q: 1.0)(p) == pytest.approx(p[2] ** 0.5)
    assert hy.lifted(lambda q: q[2])(p) == pytest.approx(p[2] ** 1.5)
    # for the pattern exp(i k . a - |k| z) the second is -|k| times the first
    k, z = np.array([0.9, -0.4]), 1e-4
    near = [readings.plane_harmonic(k, np.array([[0.2, 0.7, depth]]))[0] for depth in (0.0, z)]
    assert (near[1] - near[0]) / (z * near[0]) == pytest.approx(-np.linalg.norm(k), rel=1e-4)


# --- the Fisher metric ----------------------------------------------------------------------------------------------

def test_the_weights_are_what_the_sensors_read():
    x1, x2 = np.array([0.1, 0.3, 0.2]), np.array([-0.25, 0.1, 0.35])
    # the potential of one mass paired with the skin of the other: c_l = 1, which sums to the closed form
    paired = hy.over_the_sphere(lambda n: hy.potential_on_sphere(x1, n), lambda n: hy.skin_on_sphere(x2, n))
    assert paired == pytest.approx(hy.kernel(x1, x2, hy.unit_weights), rel=1e-10)
    assert hy.kernel(x1, x2, hy.unit_weights) == pytest.approx(hy.poincare_kernel(x1, x2), rel=1e-12)
    # gravimeters and tidal sensors: the fields of the two masses multiplied over the sphere, 4 pi sum c_l (r r')^l P_l
    gravity = hy.over_the_sphere(lambda n: hy.gravity_on_sphere(x1, n), lambda n: hy.gravity_on_sphere(x2, n))
    assert gravity == pytest.approx(4 * math.pi * hy.kernel(x1, x2, hy.gravimeter_weights), rel=1e-10)
    tides = hy.over_the_sphere(lambda n: hy.tide_on_sphere(x1, n), lambda n: hy.tide_on_sphere(x2, n))
    assert tides == pytest.approx(4 * math.pi * hy.kernel(x1, x2, hy.tidal_weights), rel=1e-10)
    assert tides == pytest.approx(93.18407263, rel=1e-9)
    # the skin is the balayage of nullspace.py, and carries the mass
    n, _ = sphere_quadrature(6, 12)
    s = float(np.linalg.norm(x2))
    assert np.allclose(hy.skin_on_sphere(x2, n), nullspace.balayage_point(1.0, s, 1.0, n @ x2 / s), rtol=1e-12)
    whole = hy.over_the_sphere(lambda n: hy.skin_on_sphere(x2, n), lambda n: np.ones(len(n)))
    assert whole == pytest.approx(1.0, rel=1e-10)


@pytest.mark.parametrize("r", RADII)
def test_potential_sensors_give_the_poincare_ball(r):
    g_r, g_t = hy.metric_coefficients(r, hy.unit_weights)
    assert g_r == pytest.approx(1.0, abs=2e-6) and g_t == pytest.approx(1.0, abs=2e-6)       # exact, to the differences
    # at any place, in every direction, and for a sphere of sensors of any radius
    x, R = r * np.array([0.6, -0.48, 0.64]), 3.0
    slack = 2e-6 / (1 - r * r) ** 2
    assert np.allclose(hy.fisher_metric(x, hy.unit_weights), hy.poincare_metric(x), rtol=2e-6, atol=slack)
    assert np.allclose(hy.fisher_metric(R * x, hy.unit_weights, R), hy.poincare_metric(R * x, R),
                       rtol=2e-6, atol=slack / R**2)
    # curvature -4: the circle at geodesic distance s = artanh r has the circumference pi sinh(2s)
    assert 2 * math.pi * r * math.sqrt(hy.poincare_metric([0.0, 0.0, r])[0, 0]) == pytest.approx(
        math.pi * math.sinh(2 * math.atanh(r)), rel=1e-12)


@pytest.mark.parametrize("r", RADII)
def test_gravimeters_weigh_the_two_directions_two_and_two_plus_u(r):
    u = r * r
    g_r, g_t = hy.metric_coefficients(r, hy.gravimeter_weights)
    assert (g_r, g_t) == pytest.approx(hy.gravimeter_coefficients(u), rel=2e-6)
    assert hy.gravimeter_coefficients(u) == (2.0, 2.0 + u)
    assert hy.transverse_coefficient(u, hy.gravimeter_weights) == pytest.approx(2.0 + u, rel=1e-12)


@pytest.mark.parametrize("r, radial, across", [(0.2, 4.8521, 5.2738), (0.5, 4.3600, 6.5500), (0.8, 4.0482, 8.4810),
                                               (0.9, 4.0110, 9.2200), (0.95, 4.0026, 9.6050)])
def test_tidal_sensors_and_the_ratio_five_to_two(r, radial, across):
    u = r * r
    g_r, g_t = hy.metric_coefficients(r, hy.tidal_weights)
    assert g_r == pytest.approx(radial, abs=1e-4) and g_t == pytest.approx(across, abs=1e-4)   # the table, four places
    assert g_r == pytest.approx((5 + 6 * u + 5 * u * u) / (1 + u) ** 2, rel=2e-6)
    assert (g_r, g_t) == pytest.approx(hy.tidal_coefficients(u), rel=2e-6)
    assert hy.transverse_coefficient(u, hy.tidal_weights) == pytest.approx(hy.tidal_coefficients(u)[1], rel=1e-12)
    # the same two numbers along and across the line from the centre, wherever the source is
    n = np.array([0.6, -0.48, 0.64])
    along = np.outer(n, n)
    want = (hy.tidal_coefficients(u)[0] * along + hy.tidal_coefficients(u)[1] * (np.eye(3) - along)) / (1 - u) ** 2
    assert np.allclose(hy.fisher_metric(r * n, hy.tidal_weights), want, rtol=2e-6, atol=2e-6 / (1 - u) ** 2)


def test_near_the_sensors_the_variance_in_depth_is_five_halves_of_that_across():
    ratios = []
    for r in (0.5, 0.9, 0.97, 0.99):
        g_r, g_t = hy.metric_coefficients(r, hy.tidal_weights)
        assert (g_r, g_t) == pytest.approx(hy.tidal_coefficients(r * r), rel=2e-6)
        ratios.append(g_t / g_r)
    assert ratios == sorted(ratios) and ratios[-1] == pytest.approx(2.5, abs=0.03)           # 2.48 at r = 0.99
    assert hy.tidal_coefficients(1.0) == (4.0, 10.0)                                         # the limit: 10 / 4
    assert hy.tidal_coefficients(0.0) == (5.0, 5.0)                                          # none at the centre
    # every sensor gives hyperbolic space near the camera: the coefficients tend to constants there
    assert hy.metric_coefficients(0.99, hy.gravimeter_weights) == pytest.approx((2.0, 3.0), abs=0.03)
