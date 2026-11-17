"""What one pixel can and cannot identify: each result against an independent route."""
import math

import numpy as np
import pytest

from gravcam import identify as I
from gravcam.pixel import steering
from gravcam.response import sphere_quadrature, tidal_of_points

c = I.C_LIGHT


@pytest.mark.parametrize("velocity", [(0.2, 0.85, 0.1), (0.5, 0.3, -0.7), (0.01, 0.02, 0.0)])
def test_one_pixel_reads_a_moving_body_exactly(velocity):
    M, pos, vel = 3e30, np.array([2e9, -1e9, 5e8]), c * np.array(velocity)
    W, Wdot = I.moving_body_readings(M, pos, vel, dt=1e-3)
    # the two star identities, at one instant
    beta_perp, line = I.present_line(W)
    n = pos / np.linalg.norm(pos)
    assert np.abs(beta_perp - (vel - (vel @ n) * n) / c).max() < 1e-12
    assert min(np.abs(line - n).max(), np.abs(line + n).max()) < 1e-12
    # and with the rate of change, everything: where it is, how it moves, its rest mass
    state = I.moving_body_state(W, Wdot)
    assert np.abs(state["position"] - pos).max() < 3e-6 * np.linalg.norm(pos)
    assert np.abs(state["velocity"] - vel).max() < 3e-6 * np.linalg.norm(vel)
    assert abs(state["mass"] / M - 1) < 1e-5


def test_the_moments_of_a_reading_are_powers_of_the_directions():
    rng = np.random.default_rng(2)
    z = rng.normal(size=3) + 1j * rng.normal(size=3)
    cs = rng.normal(size=3) + 1j * rng.normal(size=3)
    y = I.moments(I.readings_from_sources(z, cs)[0])
    assert np.allclose(y, [np.sum(cs * z**j) for j in range(5)], atol=1e-12)


@pytest.mark.parametrize("snapshots,waves", [(1, 2), (2, 3), (3, 3), (4, 4)])
def test_one_pixel_separates_as_many_waves_as_the_count_allows(snapshots, waves):
    rng = np.random.default_rng(10 * snapshots + waves)
    assert waves <= I.n_max(2, snapshots)
    z = rng.normal(size=waves) + 1j * rng.normal(size=waves)
    cs = rng.normal(size=(snapshots, waves)) + 1j * rng.normal(size=(snapshots, waves))
    Y = np.array([I.moments(W) for W in I.readings_from_sources(z, cs)])
    found, amps = I.prony(Y, waves)
    order_found, order_true = np.argsort(found.real), np.argsort(z.real)
    assert np.abs(found[order_found] - z[order_true]).max() < 1e-9
    assert np.abs(amps[:, order_found] - cs[:, order_true]).max() < 1e-8 * np.abs(cs).max()
    # one more wave than the count is not determined
    if waves + 1 > I.n_max(2, snapshots):
        z2 = rng.normal(size=waves + 1) + 1j * rng.normal(size=waves + 1)
        c2 = rng.normal(size=(snapshots, waves + 1)) + 1j * rng.normal(size=(snapshots, waves + 1))
        Y2 = np.array([I.moments(W) for W in I.readings_from_sources(z2, c2)])
        assert I.prony(Y2, waves + 1) is None


def test_the_general_count():
    # s at one instant, floor(2(2s + 1)/3) at one frequency, 2s from a long enough history
    assert [I.n_max(s, 1) for s in (1, 2, 3, 4)] == [1, 2, 3, 4]
    assert [I.n_max(s, 2) for s in (1, 2, 3, 4)] == [2, 3, 4, 6]
    assert [I.n_max(s, 2 * s) for s in (1, 2, 3, 4)] == [2, 4, 6, 8]
    assert all(I.n_max(s, 100) == 2 * s for s in (1, 2, 3, 4))
    # spin four at one frequency: six, not s + 1 = 5; and the exception where the two snapshots are related by z
    rng = np.random.default_rng(4)
    D, N = 9, 6
    z = rng.normal(size=N) + 1j * rng.normal(size=N)
    cs = rng.normal(size=(2, N)) + 1j * rng.normal(size=(2, N))
    Y = np.array([[np.sum(cs[l] * z**j) for j in range(D)] for l in range(2)])
    found, _ = I.prony(Y, N)
    assert np.abs(np.sort_complex(found) - np.sort_complex(z)).max() < 1e-8
    c1 = rng.normal(size=N) + 0j
    Y = np.array([[np.sum(cc * z**j) for j in range(D)] for cc in (c1, z * c1)])
    assert I.prony(Y, N) is None


def test_no_finite_number_of_derivatives_tells_a_shell_from_two_pulses():
    rng = np.random.default_rng(5)
    a = 1e-9
    E0 = a * np.diag([3.0, 0.0, -3.0])     # transverse to y, trace-free
    R = 2.0
    # the shell: its field is E0 throughout the inside (so every derivative vanishes)
    pts, w = sphere_quadrature(60, 120)
    sigma = I.shell_density(pts, E0, R, sigma0=40.0)   # kg m^-2: enough to keep it positive
    assert sigma.min() > 0
    for x in rng.uniform(-0.5, 0.5, size=(4, 3)):
        E = tidal_of_points(x, pts * R, sigma * w * R**2)
        assert np.abs(E - E0).max() < 1e-9 * np.abs(E0).max()
    # the pulses: at the event, E0 and B = 0, and every derivative through order 2m - 1 vanishes
    m, tau = 3, 1.0
    E, B = I.counterpropagating_pulses(0.0, 0.0, E0, tau, m)
    assert np.allclose(E, E0) and np.allclose(B, 0)
    h = 1e-2
    for dt, dy in ((h, 0.0), (0.0, h), (h, h), (h, -h)):
        E, B = I.counterpropagating_pulses(dt, dy, E0, tau, m)
        assert np.abs(E - E0).max() < 5 * (2 * h) ** (2 * m) * np.abs(E0).max()
        assert np.abs(B).max() < 5 * (2 * h) ** (2 * m) * np.abs(E0).max()
    # bounded strain: the pulse integrates twice to nothing
    u = np.linspace(-8, 8, 400001)
    f = I.flat_pulse(u, tau, m)
    assert abs(np.trapezoid(f, u)) < 1e-9 and abs(np.trapezoid(u * f, u)) < 1e-9


def test_a_spectral_matrix_that_no_incoherent_sky_can_make():
    rng = np.random.default_rng(6)
    worst = max(abs(np.vdot(I.WITNESS, steering(k))) ** 2 for k in rng.normal(size=(3000, 3)))
    assert 0.49 < worst <= 0.5 + 1e-12
    for _ in range(20):
        dirs = rng.normal(size=(7, 3))
        C = I.sky_covariance(dirs, rng.random(7))
        assert I.witness(C) <= 0.5 + 1e-12
    # two coherent waves along +z and -z make the witness's own state: positive, but no incoherent sky
    v = steering([0, 0, 1]) + steering([0, 0, -1])
    C = np.outer(v, v.conj())
    assert np.linalg.eigvalsh(C).min() > -1e-12
    assert math.isclose(I.witness(C), 1.0, rel_tol=1e-12)


def test_lensed_images_of_a_chirp_are_located_one_at_a_time():
    sep = 4.85e-6                                                    # one arcsecond
    k1 = np.array([0.3, 0.4, math.sqrt(0.75)])
    k1 /= np.linalg.norm(k1)
    perp = np.cross(k1, [1.0, 0, 0])
    perp /= np.linalg.norm(perp)
    k2 = k1 * math.cos(sep) + perp * math.sin(sep)
    t = np.arange(0, 4, 1 / 4096.0)
    f0, fdot, delay = 100.0, 40.0, 0.5
    W = I.lensed_chirp(t, [k1, k2], [0.0, delay], f0, fdot, [1.0, 0.7])
    found = I.image_directions(t, W, 2.0, 0.15, [f0 + fdot * 2.0, f0 + fdot * 1.5])
    assert math.acos(min(1.0, found[0] @ k1)) < 0.02 * sep
    assert math.acos(min(1.0, found[1] @ k2)) < 0.02 * sep


def test_what_one_counted_graviton_tells():
    g = np.linspace(0, math.pi, 200001)
    dO = 2 * math.pi * np.sin(g)
    for s in (0, 1, 2):
        p = I.click_distribution(g, s)
        assert math.isclose(np.trapezoid(p * dO, g), 1.0, rel_tol=1e-8)
        entropy = -np.trapezoid(p * np.log2(p) * dO, g)
        assert math.isclose(math.log2(4 * math.pi) - entropy, I.bits_per_quantum(s), abs_tol=1e-8)
        if s:
            # Fisher information about one angle: 4 s^2 <Omega_y^2 / (1 + Omega_z)^2>, with the azimuth averaged
            F = np.trapezoid(p * dO * 2 * s * s * np.tan(g / 2) ** 2, g)
            assert math.isclose(F, I.fisher_per_quantum(s)[0], rel_tol=1e-6)
    assert math.isclose(I.bits_per_quantum(2), 1.168, abs_tol=1e-3)
    assert math.isclose(I.bits_per_quantum(1), 0.623, abs_tol=1e-3)
    # the Sun through the Earth at midnight: one graviton per square metre per second, 1640 of them give 1 degree
    assert math.isclose(math.degrees(1 / math.sqrt(I.fisher_per_quantum(2)[0] * 1640)), 1.0, abs_tol=0.01)
