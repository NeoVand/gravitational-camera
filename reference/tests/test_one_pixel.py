"""What one pixel can tell (gravcam/onepixel.py): the direction of a single
wave, twelve sources that look like a uniform sky, the distance of a moving
mass, and a spin that hides. The finite-difference curvature of
gravcam/curvature.py checks the formulas independently where it can."""
import math

import numpy as np
import pytest

from gravcam import curvature, gravitomagnetic as gm, onepixel as op
from gravcam.constants import G, c


@pytest.mark.parametrize("plus,cross", [(1.0, 0.0), (0.0, 1.0), (0.6, 0.8), (-0.3, 0.2)])
def test_one_wave_points_back_to_its_source(plus, cross):
    # the curvature of a wave travelling along +z, from its metric
    f = 50.0
    h = curvature.plane_wave_metric(1e-3, 2 * math.pi * f, plus, cross)
    E, B = curvature.tidal_tensors(curvature.riemann(h, 0.3 * c / f, [0.1, 0.2, 0.3], step=c / f / 400))
    assert np.allclose(op.wave_direction(E, B), [0.0, 0.0, -1.0], atol=1e-9)
    # and B = eps_ipq k_p E_qj, the relation the module's plane waves use
    k = np.array([0.0, 0.0, 1.0])
    assert np.allclose(B, np.einsum("ipq,p,qj->ij", curvature.EPS, k, E), atol=1e-9 * np.abs(E).max())


def test_the_direction_holds_for_any_arrival_and_polarization():
    rng = np.random.default_rng(3)
    for _ in range(20):
        n = rng.normal(size=3)
        n /= np.linalg.norm(n)
        E, B = op.plane_wave_tensors(n, *rng.normal(size=2))
        assert np.linalg.norm(B) == pytest.approx(np.linalg.norm(E), rel=1e-12)
        assert np.allclose(op.wave_direction(E, B), n, atol=1e-12)


def test_twelve_sources_look_exactly_like_a_uniform_sky():
    sphere = op.sky_average(op.unpolarized_covariance)
    scale = np.abs(sphere).max()
    ico = sum(op.unpolarized_covariance(n) for n in op.icosahedron()) / 12
    assert np.abs(ico - sphere).max() < 1e-13 * scale
    # the same holds turned any way: a 5-design stays one
    R = op._turn_z_to([0.3, -0.5, 0.8])
    turned = sum(op.unpolarized_covariance(R @ n) for n in op.icosahedron()) / 12
    assert np.abs(turned - sphere).max() < 1e-13 * scale
    # six sources at the corners of an octahedron are told apart
    octa = sum(op.unpolarized_covariance(n) for n in op.octahedron()) / 6
    assert np.abs(octa - sphere).max() > 0.1 * scale


def _flyby(M, x0, v, t):
    x = x0 + v * t
    return gm.electric_point(M, x), gm.magnetic_point(M, x, v)


@pytest.mark.parametrize("seed", [1, 2, 3])
def test_one_pixel_ranges_a_moving_mass(seed):
    rng = np.random.default_rng(seed)
    M = rng.uniform(10, 1000)
    x0 = rng.normal(size=3) * 2
    v = rng.normal(size=3)
    dt = 1e-4
    E, B = _flyby(M, x0, v, 0.0)
    Edot = (_flyby(M, x0, v, dt)[0] - _flyby(M, x0, v, -dt)[0]) / (2 * dt)
    r, m, u = op.range_moving_mass(E, B, Edot)
    assert r == pytest.approx(np.linalg.norm(x0), rel=1e-7)
    assert m == pytest.approx(M, rel=1e-6)
    assert np.allclose(u, v, atol=1e-6 * np.linalg.norm(v))


def test_ranging_from_finite_difference_curvature():
    # a star-sized mass, so that B stands well above the round-off of the differences
    M, x0, v = 2e30, np.array([1.7, -0.9, 0.6]) * 1e9, np.array([0.3, 0.8, -0.1]) * 1e6
    h = curvature.moving_masses_metric([M], [x0], [v])

    def at(t):
        return curvature.tidal_tensors(curvature.riemann(h, c * t, [0.0, 0.0, 0.0], step=2e6))

    E, B = at(0.0)
    Edot = (at(10.0)[0] - at(-10.0)[0]) / 20.0
    r, m, _ = op.range_moving_mass(E, B, Edot)
    assert r == pytest.approx(np.linalg.norm(x0), rel=1e-3)
    assert m == pytest.approx(M, rel=1e-3)


def test_E_alone_cannot_tell_a_near_light_mass_from_a_far_heavy_one():
    M, x0, v = 70.0, np.array([1.7, -0.9, 0.6]), np.array([0.3, 0.8, -0.1])
    lam = 10.0
    for t in (-1.0, 0.0, 0.5, 2.0):
        E1, B1 = _flyby(M, x0, v, t)
        E2, B2 = _flyby(lam ** 3 * M, lam * x0, lam * v, t)
        assert np.allclose(E1, E2, rtol=1e-12, atol=0)
        assert np.allclose(B2, lam * B1, rtol=1e-12, atol=0)


def test_a_counter_rotating_flywheel_shows_no_magnetic_field_outside():
    R = 1.0
    a = 2 ** -0.2 * R          # the inner ball holds half the moment of inertia
    w = np.array([0.0, 0.0, 2 * math.pi * 10])
    rho = 7800.0
    centre = np.array([0.7, 1.9, 1.3])
    E_in, B_in = gm.spinning_shell(centre, a, 0.0, rho, w)
    E_out, B_out = gm.spinning_shell(centre, R, a, rho, -w)
    assert np.linalg.norm(B_in) > 0
    assert np.linalg.norm(B_in + B_out) < 1e-12 * np.linalg.norm(B_in)
    # while its mass shows as usual
    M = rho * 4 / 3 * math.pi * R ** 3
    assert np.allclose(E_in + E_out, gm.electric_point(M, centre), rtol=1e-10, atol=0)


def test_black_hole_as_warm_as_the_graviton_sky():
    hbar, kB = 1.054571817e-34, 1.380649e-23
    M = hbar * c ** 3 / (8 * math.pi * G * kB * 0.905)
    assert M == pytest.approx(1.3557e23, rel=1e-4)


def test_inside_moving_matter_B_has_an_antisymmetric_part_set_by_the_flow():
    """Inside a uniform ball moving at v (first order in v/c, harmonic gauge),
    tr E = 4 pi G rho and B_[ij] = -(4 pi G / c) eps_ijk rho v_k: the Ricci
    part of the curvature, which a pixel in vacuum never sees."""
    rho, a = 5000.0, 1e7
    v = np.array([3e5, -1e5, 2e5])

    def h(x0, x):
        y = np.asarray(x) - v * x0 / c
        P = 2 * math.pi * rho * (a * a - (y @ y) / 3)     # integral of rho / |x - x'| inside
        out = np.zeros((4, 4))
        out[0, 0] = 2 * G * P / c ** 2
        out[1:, 1:] = 2 * G * P / c ** 2 * np.eye(3)
        out[0, 1:] = out[1:, 0] = -4 * G * P * v / c ** 3
        return out

    E, B = curvature.tidal_tensors(curvature.riemann(h, 0.0, [1e6, -2e6, 5e5], step=2e5))
    assert np.trace(E) == pytest.approx(4 * math.pi * G * rho, rel=1e-5)
    anti = (B - B.T) / 2
    expected = -(4 * math.pi * G / c) * np.einsum("ijk,k->ij", curvature.EPS, rho * v)
    assert np.allclose(anti, expected, rtol=0, atol=1e-5 * np.abs(expected).max())
    assert np.abs(B + B.T).max() < 1e-9 * np.abs(expected).max()


def test_one_pixel_tells_front_from_back():
    """eps_ipq n_p B_qj equals E_ij for a wave from n and -E_ij for one from -n,
    so (E + eps n B) / 2 passes the first and cancels the second."""
    rng = np.random.default_rng(5)
    for _ in range(10):
        n = rng.normal(size=3)
        n /= np.linalg.norm(n)
        for sign in (1.0, -1.0):
            E, B = op.plane_wave_tensors(sign * n, *rng.normal(size=2))
            turned = np.einsum("ipq,p,qj->ij", curvature.EPS, n, B)
            assert np.allclose(turned, sign * E, atol=1e-12 * np.abs(E).max())
            kept = (E + turned) / 2
            assert np.allclose(kept, E if sign > 0 else 0 * E, atol=1e-12 * np.abs(E).max())


def test_two_pixels_a_wavelength_apart_tell_twelve_sources_from_a_uniform_sky():
    """The cross-correlation of two pixels at separation d carries the phase
    exp(i k n.d), which the icosahedron does not average like the sphere."""
    k = 2 * math.pi
    d = np.array([0.0, 0.0, 1.0])

    def phase(n):
        return math.cos(k * (n @ d))

    sphere = math.sin(k) / k
    ico = np.mean([phase(n) for n in op.icosahedron()])
    assert abs(ico - sphere) > 0.1
