"""What heat and a push reveal: each result against an independent route."""
import math

import numpy as np
import pytest

from gravcam import resolution
from gravcam import response as r
from gravcam.constants import G, kB

UZ = np.diag([-0.5, -0.5, 1.0]) / math.sqrt(1.5)  # trace-free, tr U^2 = 1


@pytest.fixture(scope="module")
def ball():
    p, m, K = r.lattice_body(6.0)
    w2, V = r.normal_modes(m, K)
    return p, m, w2, V


@pytest.fixture(scope="module")
def shell():
    p, m, K = r.lattice_body(6.0, inner=4.0)
    w2, V = r.normal_modes(m, K)
    return p, m, w2, V


def test_the_illustrative_steel_ball_matches_an_independent_table():
    # the numbers of the review that proposed this model (its own Table, Sec. 3.4)
    b = r.rayleigh_ball()
    assert math.isclose(b["M"], 32.6726, rel_tol=1e-5)
    assert math.isclose(b["f0"], 15098.8, rel_tol=1e-5)
    assert math.isclose(b["q_rms"], 2.16685e-16, rel_tol=1e-5)
    assert math.isclose(b["E_axis"], 3.40212e-25, rel_tol=1e-5)
    assert math.isclose(r.rayleigh_ball(r=0.2)["E_axis"], 1.06316e-21, rel_tol=1e-5)
    assert math.isclose(b["power"], 4.83387e-55, rel_tol=1e-5)
    assert math.isclose(b["years_per_graviton"], 6.55841e17, rel_tol=1e-4)


def test_the_steel_ball_from_its_displacement_field():
    # integrate the kinetic energy and the quadrupole of u = (q/R)(-x/2, -y/2, z) over the ball on a grid, then
    # differentiate the quadrupole's potential numerically on the axis
    R, rho, q = 0.1, 7800.0, 1.0
    n = 120
    u = (np.arange(n) + 0.5) / n * 2 * R - R
    X, Y, Z = np.meshgrid(u, u, u, indexing="ij")
    inside = X**2 + Y**2 + Z**2 <= R**2
    dV = (2 * R / n) ** 3
    x, y, z = X[inside], Y[inside], Z[inside]
    M = rho * dV * inside.sum()
    disp = np.stack([-x / 2, -y / 2, z], axis=1) * q / R
    m_eff = rho * dV * (disp**2).sum()
    assert math.isclose(m_eff / M, 0.3, rel_tol=2e-3)
    pos = np.stack([x, y, z], axis=1)
    dI = rho * dV * (pos.T @ disp + disp.T @ pos)
    dI -= np.eye(3) * np.trace(dI) / 3
    assert math.isclose(dI[2, 2], 2 * M * R * q / 5, rel_tol=2e-3)

    def phi(zz):
        return -1.5 * G * dI[2, 2] / zz**3

    h, z0 = 1e-3, 1.0
    # on the axis the potential is a function of z alone, so E_zz is its second derivative along the axis
    E_fd = (phi(z0 + h) - 2 * phi(z0) + phi(z0 - h)) / h**2
    assert math.isclose(E_fd, -36 * G * M * R * q / (5 * z0**5), rel_tol=2e-3)  # the grid's error in dI


def test_heat_reads_the_second_moment_whatever_the_springs(ball, shell):
    for p, m, w2, V in (ball, shell):
        c = r.multipole_couplings(p, m, V, r.quadrupole_gradient(p, UZ))
        th = r.thermal_moments(w2, c)
        I2 = r.second_moment(p, m)
        assert math.isclose(th["rate"], 4 * I2 / 3, rel_tol=1e-10)  # 4 tr(U^2 M2), M2 = I2/3 by cubic symmetry
        assert th["rate_moving"] / th["rate"] > 1 - 1e-12             # none of it in translation or rotation
    # stiffer or softer springs move the tremor in frequency but not its total
    p, m, K = r.lattice_body(6.0, k1=3.0, k2=0.2)
    w2, V = r.normal_modes(m, K)
    c = r.multipole_couplings(p, m, V, r.quadrupole_gradient(p, UZ))
    assert math.isclose(r.thermal_moments(w2, c)["rate"], 4 * r.second_moment(p, m) / 3, rel_tol=1e-10)


def test_the_dipole_tremor_is_brownian_motion(ball):
    p, m, w2, V = ball
    grad = np.zeros_like(p)
    grad[:, 0] = 1.0
    th = r.thermal_moments(w2, r.multipole_couplings(p, m, V, grad))
    assert math.isclose(th["rate"], m.sum(), rel_tol=1e-10)   # <P_x^2> = M kT
    assert th["rate_moving"] < 1e-10 * th["rate"]                # all of it in the free translation


def test_the_tremor_sits_in_the_lowest_modes(ball, shell):
    for p, m, w2, V in (ball, shell):
        c2 = r.thermal_moments(w2, r.multipole_couplings(p, m, V, r.quadrupole_gradient(p, UZ)))["weights"]
        w = np.sqrt(w2)
        assert c2[w < w.max() / 3].sum() / c2.sum() > 0.97
        assert c2.max() / c2.sum() > 0.55                            # one mode carries most of it


def test_a_shell_trembles_more_than_a_ball_of_the_same_mass_and_radius(ball, shell):
    rates, variances = [], []
    for p, m, w2, V in (ball, shell):
        th = r.thermal_moments(w2, r.multipole_couplings(p, m, V, r.quadrupole_gradient(p, UZ)))
        rates.append(th["rate"])
        variances.append(th["variance"])
    x = 4.0 / 6.0
    thick = (1 - x**5) / (1 - x**3)                                   # I2 of a thick shell over that of a ball
    assert math.isclose(rates[1] / rates[0], thick, rel_tol=0.03)
    assert variances[1] > 3 * variances[0]                           # and it is far more compliant
    # thin-shell limit of the multipole law: 5/3
    assert math.isclose(r.shell_moment(1, 1, 2) / r.ball_moment(1, 1, 2), 5 / 3)


def test_the_multipole_sum_identity():
    from scipy.special import sph_harm_y

    rng = np.random.default_rng(3)
    for l in (1, 2, 3, 4):
        for x in rng.normal(size=(4, 3)):
            def f(pt, mm):
                rr = np.linalg.norm(pt)
                return rr**l * sph_harm_y(l, mm, math.acos(pt[2] / rr), math.atan2(pt[1], pt[0]))

            h = 1e-5
            total = 0.0
            for mm in range(-l, l + 1):
                g = np.array([(f(x + h * e, mm) - f(x - h * e, mm)) / (2 * h) for e in np.eye(3)])
                total += float(np.sum(np.abs(g) ** 2))
            rr = np.linalg.norm(x)
            assert math.isclose(total, l * (2 * l + 1) ** 2 / (4 * math.pi) * rr ** (2 * l - 2), rel_tol=1e-6)


def test_love_number_limits():
    R, rho = 0.1, 7800.0
    assert math.isclose(r.love_k2(rho, 1e-30, R), 1.5, rel_tol=1e-12)          # a fluid ball
    mu = rho * 3000.0**2
    assert math.isclose(r.love_k2(rho, mu, R), 4 * math.pi * G * rho**2 * R**2 / (19 * mu), rel_tol=1e-9)
    # the fluid ball's quadrupole, from the height of its tide: the surface rises by (1 + k2) U / g = (5/2) e R^2 P2 / g
    # under the tide E = e diag(1, 1, -2), and a uniform ball with the bulge eps R P2 has Q_zz = (8 pi / 15) rho R^5 eps
    e = 1e-6
    g = G * rho * 4 * math.pi * R / 3
    Q_zz = 8 * math.pi / 15 * rho * R**5 * (2.5 * e * R / g)
    assert math.isclose(-Q_zz / (-2 * e), r.tidal_deformability(1.5, R), rel_tol=1e-12)
    assert math.isclose(r.tidal_deformability(1.5, R), R**5 / (2 * G), rel_tol=1e-12)


def test_the_conjugate_shell_pushes_on_exactly_what_the_pixel_reads():
    rng = np.random.default_rng(7)
    a, f = 0.3, 2.0
    D = rng.normal(size=(3, 3))
    D = D + D.T
    D -= np.eye(3) * np.trace(D) / 3
    pts, w = r.sphere_quadrature(40, 80)
    sigma = r.shell_drive_density(pts, D, f, a)
    dA = w * a**2
    assert abs((sigma * dA).sum()) < 1e-12 * np.abs(sigma * dA).sum()                    # no monopole
    assert np.abs((sigma * dA) @ pts).max() < 1e-12 * np.abs(sigma * dA).sum()           # no dipole
    # interaction with masses outside the shell, near and far, against -f D:E at the pixel
    sources = rng.normal(size=(6, 3))
    sources *= (0.45 + rng.random(6))[:, None] / np.linalg.norm(sources, axis=1)[:, None]
    masses = 1 + rng.random(6)
    energy = (sigma * dA) @ r.potential_of_points(pts * a, sources, masses)
    E = r.tidal_of_points(np.zeros(3), sources, masses)
    assert math.isclose(energy, -f * np.sum(D * E), rel_tol=1e-8)
    # its own field at the pixel
    E_shell = r.tidal_of_points(np.zeros(3), pts * a, sigma * dA)
    assert np.abs(E_shell - 6 * G * f * D / a**5).max() < 1e-9 * np.abs(E_shell).max()


def test_the_thermometer_needs_the_conjugate_drive():
    omega = np.linspace(100.0, 4000.0, 400)
    w0 = np.array([800.0, 1500.0, 2600.0])
    gamma = np.array([30.0, 80.0, 50.0])
    m_eff = np.array([1.0, 2.0, 0.7])
    k = np.array([1.0, -0.4, 0.8])          # how each mode shows in the reading
    T = 290.0
    S = r.mode_noise(omega, w0, gamma, m_eff, k, T)
    matched = r.mode_response(omega, w0, gamma, m_eff, k, k)
    assert np.allclose(r.thermometer(omega, S, matched.imag), T, rtol=1e-12)
    other = r.mode_response(omega, w0, gamma, m_eff, np.array([1.0, 0.3, 0.2]), k)
    wrong = r.thermometer(omega, S, other.imag)
    assert np.abs(wrong / T - 1).max() > 0.5


def test_the_quantum_bounds_on_the_jitter():
    rng = np.random.default_rng(11)
    for T in (0.01, 1.0, 300.0):
        for _ in range(20):
            omegas = 10 ** rng.uniform(9, 14, size=5)
            chi = rng.random(5)
            chi0 = chi.sum()
            A = float((chi * omegas**2).sum())
            lo, hi = r.jitter_bounds(chi0, A, T)
            q = r.quantum_jitter(chi, omegas, T)
            assert lo * (1 - 1e-12) <= q <= hi * (1 + 1e-12)
    # one mode attains the upper bound
    lo, hi = r.jitter_bounds(2.0, 2.0 * 1e12**2, 5.0)
    assert math.isclose(r.quantum_jitter(np.array([2.0]), np.array([1e12]), 5.0), hi, rel_tol=1e-12)


def test_every_gravitational_camera_has_the_logarithmic_blur():
    # the cut-offs of clock (p = -1), accelerometer (0) and tidal (1) cameras, against an independent calculation
    assert [round(r.cutoff(1e3, p), 2) for p in (-1, 0, 1)] == [6.22, 8.05, 10.39]
    assert [round(r.cutoff(1e20, p), 1) for p in (-1, 0, 1)] == [43.4, 47.2, 51.1]
    for snr in (1e3, 1e10, 1e40):
        assert math.isclose(r.cutoff(snr, 1), resolution.cutoff(snr), rel_tol=1e-12)
        q = r.cutoff(snr, -1)
        assert math.isclose(math.exp(-q) / q, 1 / (math.pi * snr), rel_tol=1e-10)


def test_the_ceiling_and_the_price_of_distance():
    assert math.isclose(r.blur_deg(1e70), 1.5, abs_tol=0.05)
    gentle = r.gentle_ceiling(1e70)
    assert 5e54 < gentle < 8e54
    assert 1.85 < r.blur_deg(gentle) < 2.0
    assert math.isclose(r.distance_cost(0.2, 1.0), 5.0**20)
    assert kB > 0  # constants imported, units SI
