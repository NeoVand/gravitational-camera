"""Telling waves from nearby pull with noise, and how well depth is measured (gravcam/separation_noise.py).

Each bound is checked against an independent route: the Cramer-Rao bounds against the spread of maximum-likelihood
fits to simulated noisy data; the closed forms against the full models in the limit where they apply; the forward
models against tidal.py (exact tides of point masses and boxes), gravitomagnetic.py and the finite-difference
curvature of a plane wave's metric (curvature.py)."""
import math

import numpy as np
import pytest
from scipy.optimize import least_squares, minimize

from gravcam import curvature, gravitomagnetic as gm, onepixel as op, pixel, separation_noise as sn, tidal
from gravcam.constants import G, c

rng = np.random.default_rng(20261117)


def unit(v):
    v = np.asarray(v, dtype=float)
    return v / np.linalg.norm(v)


# --- the data model ------------------------------------------------------------------------------------------------

def test_amplitude_noise_from_readings_in_time():
    """Noise sigma per reading over N readings spanning whole cycles puts sigma sqrt(2/N) on the real and imaginary
    parts of the complex amplitudes: the least-squares wave fitted to amplitudes taken from simulated time series
    scatters as the covariance with that noise says."""
    omega, k = 2 * math.pi * 100.0, unit([0.3, -0.2, 0.9])
    N, sigma = 48, 1.0
    t = np.arange(N) / N * 3 * (2 * math.pi / omega)            # three whole cycles
    J = np.hstack([sn._wave_columns(k, omega, np.zeros((1, 3)), "EB"), sn._free_near_columns(1, "EB")])
    cov = sn.covariance(J, sn.amplitude_noise(sigma, N))
    s = np.linalg.norm(J, axis=0)
    est = []
    for _ in range(3000):
        noise = rng.normal(size=(N, 10)) * sigma
        x = (2.0 / N) * np.einsum("t,ta->a", np.exp(1j * omega * t), noise)
        est.append((np.linalg.lstsq(J / s, sn.as_real(x[None]), rcond=None)[0] / s)[:4])
    ratio = np.sum(np.var(est, axis=0)) / np.trace(cov[:4, :4])
    assert ratio == pytest.approx(1.0, abs=0.06)


def test_wave_fields_match_the_curvature_of_the_metric():
    """E = -(1/2) d^2h/dt^2 and B = k x E, against the finite-difference curvature of the plane-wave metric."""
    f, amp, plus, cross = 50.0, 1e-3, 0.6, -0.8
    omega = 2 * math.pi * f
    h = curvature.plane_wave_metric(amp, omega, plus, cross)
    x, x0 = np.array([0.1, 0.2, 0.3]), 0.37 * c / f
    E, B = curvature.tidal_tensors(curvature.riemann(h, x0, x, step=c / f / 400))
    Ehat, Bhat = sn.wave_fields([0.0, 0.0, 1.0], amp * plus, amp * cross, omega, x[None])
    phase = np.exp(-1j * omega * x0 / c)
    scale = np.abs(E).max()
    assert np.allclose(np.real(Ehat[0] * phase), E, atol=1e-7 * scale)
    assert np.allclose(np.real(Bhat[0] * phase), B, atol=1e-7 * scale)


@pytest.mark.parametrize("distance", [3.0, 6.0])
def test_rotor_is_a_point_quadrupole_to_order_size_over_distance_squared(distance):
    """The 2 Omega part of the exact tide of two turning point masses (tidal.py) against the point quadrupole."""
    axis, sep = unit([0.2, -0.1, 1.0]), 0.12
    center = distance * unit([1.0, 0.4, -0.3])
    exact, _ = sn.rotor_fields(np.zeros((1, 3)), center, axis, 1.0, sep, 2 * math.pi * 50)
    model = sn.quadrupole_tidal(sn.rotor_quadrupole(1.0, sep, axis), -center)
    rel = np.linalg.norm(exact - model) / np.linalg.norm(model)
    assert rel < 1.2 * (sep / distance) ** 2              # the hexadecapole, (d/2r)^2 times a factor below 5
    assert rel > 0.2 * (sep / distance) ** 2
    assert abs(np.trace(model[0])) < 1e-12 * np.linalg.norm(model)
    assert np.allclose(model[0], model[0].T)


def test_the_rotor_magnetic_part_is_smaller_by_about_kr():
    """At twice the rotation rate the rotor's mass currents (gravitomagnetic.magnetic_point) fall as r^-4 and its
    quadrupole as r^-5, so |B|/|E| is of order k r, not the rim speed over c (here 30 times smaller)."""
    omega, k, xs, Q = sn.example_geometry()
    ratios = []
    for scale in (1.0, 2.0):
        E, B = sn.rotor_fields(np.zeros((1, 3)), scale * xs, sn.EXAMPLE["rotor_axis"], 1.0, 0.12, omega / 2)
        ratios.append(np.linalg.norm(B) / np.linalg.norm(E))
        kr = omega * scale * np.linalg.norm(xs) / c
        assert 0.1 * kr < ratios[-1] < kr
    assert ratios[1] / ratios[0] == pytest.approx(2.0, rel=0.02)
    assert ratios[0] > 10 * (omega / 2) * 0.06 / c


# --- 1. shape ------------------------------------------------------------------------------------------------------

def _brute_distance(E, family, starts=30):
    def wave(p):
        W, _ = op.plane_wave_tensors(sn.direction(p[0], p[1]), p[2], p[3])
        return W

    def mass(p):
        n = sn.direction(p[0], p[1])
        return p[2] * (np.eye(3) - 3 * np.outer(n, n))

    f, dim = (wave, 4) if family == "wave" else (mass, 3)
    best = min((minimize(lambda p: np.sum((f(p) - E) ** 2), rng.normal(size=dim), method="BFGS")
                for _ in range(starts)), key=lambda r: r.fun)
    return math.sqrt(best.fun)


def test_distances_to_waves_and_masses_closed_forms():
    for _ in range(4):
        E = pixel.mat5(rng.normal(size=5))
        assert sn.distance_to_waves(E) == pytest.approx(_brute_distance(E, "wave"), rel=1e-5)
        assert sn.distance_to_masses(E) == pytest.approx(_brute_distance(E, "mass"), rel=1e-5)


def test_a_wave_and_a_mass_lie_half_their_size_apart():
    for _ in range(5):
        n = unit(rng.normal(size=3))
        E = 0.7 * (np.eye(3) - 3 * np.outer(n, n))
        assert sn.distance_to_waves(E) == pytest.approx(0.5 * np.linalg.norm(E), rel=1e-12)
        W, _ = op.plane_wave_tensors(n, *rng.normal(size=2))
        assert sn.distance_to_masses(W) == pytest.approx(0.5 * np.linalg.norm(W), rel=1e-12)


def test_one_reading_classes_an_isolated_source_at_rho_12():
    wrong_mass, wrong_wave = sn.shape_error_rates(12.0, 10000, rng)
    assert wrong_mass < 0.01 and wrong_wave < 0.01         # the draft: under one in a hundred
    assert wrong_mass > wrong_wave                          # the four-parameter family takes more
    wrong_mass, wrong_wave = sn.shape_error_rates(4.0, 3000, rng)
    assert wrong_mass > 0.1                                 # at rho/2 = 2 standard deviations they do not separate


# --- 2. one pixel, E and B -----------------------------------------------------------------------------------------

@pytest.mark.parametrize("seed", [1, 2, 3])
def test_any_near_field_costs_the_wave_exactly_sqrt2(seed):
    k = unit(np.random.default_rng(seed).normal(size=3))
    wave_alone, wave_joint, near_alone, near_joint = sn.one_pixel_covariances(k, omega=3.7)
    np.testing.assert_allclose(np.diag(wave_joint) / np.diag(wave_alone), 2.0, rtol=1e-9)
    # the near field pays sigma^2 more in the two transverse-traceless directions and nothing in the others
    P = sn.transverse_projector(k)
    extra = near_joint - near_alone
    np.testing.assert_allclose(extra[:5, :5], P, atol=1e-9)
    np.testing.assert_allclose(extra[5:, 5:], P, atol=1e-9)
    np.testing.assert_allclose(extra[:5, 5:], 0.0, atol=1e-9)


def test_sqrt2_by_simulation_with_the_rotor_present():
    omega, k, xs, Q = sn.example_geometry()
    En, Bn = sn.rotor_fields(np.zeros((1, 3)), xs, sn.EXAMPLE["rotor_axis"], 1.0, 0.12, omega / 2)
    Ew, Bw = sn.wave_fields(k, 1e-21, 0.0, omega, np.zeros((1, 3)))
    wave = sn.as_real(sn.readings(Ew, Bw))
    truth = sn.as_real(sn.readings(Ew + En, Bw))           # the rotor's B, 1e-6 of the wave's, is left out here
    sigma_f = np.linalg.norm(wave) / 10.0                   # rho = 10
    Jw = sn._wave_columns(k, omega, np.zeros((1, 3)), "EB")
    J = np.hstack([Jw, sn._free_near_columns(1, "EB")])
    joint, alone = [], []
    for _ in range(3000):
        joint.append(np.linalg.lstsq(J, truth + rng.normal(size=truth.shape) * sigma_f, rcond=None)[0][:4])
        alone.append(np.linalg.lstsq(Jw, wave + rng.normal(size=wave.shape) * sigma_f, rcond=None)[0])
    joint, alone = np.array(joint), np.array(alone)
    assert np.sum(joint.var(axis=0)) / np.sum(alone.var(axis=0)) == pytest.approx(2.0, rel=0.07)
    assert np.mean(joint[:, 0]) == pytest.approx(1e-21, abs=4 * math.sqrt(2) * 1e-22 / math.sqrt(3000) * 1.5)
    # and with the wave alone the bound is 1/rho on its amplitude
    assert math.sqrt(alone[:, 0].var()) * 10 / 1e-21 == pytest.approx(1.0, rel=0.06)


def test_an_ignored_near_field_leaks_half_its_transverse_traceless_part():
    omega, k = 2 * math.pi * 100, unit([0.4, 0.1, -0.9])
    E_near = pixel.mat5(rng.normal(size=5) + 1j * rng.normal(size=5)) * 1e-14
    hp, hx = sn.wave_bias(k, omega, E_near)
    plus, cross = sn.wave_basis(k)
    assert hp == pytest.approx(np.sum(plus * E_near) / (2 * omega ** 2), rel=1e-9)
    assert hx == pytest.approx(np.sum(cross * E_near) / (2 * omega ** 2), rel=1e-9)
    # E alone takes all of it
    hp_e, _ = sn.wave_bias(k, omega, E_near, channels="E")
    assert hp_e == pytest.approx(2 * hp, rel=1e-9)


# --- 3. an array ---------------------------------------------------------------------------------------------------

def test_array_cost_with_known_position_along_the_line_to_the_source():
    """b << r, source position known, wave travelling along the line to it: D^2 = 1 + (7/150)(r/b)^2."""
    omega, r = 2 * math.pi * 100, 3.0
    xs = r * unit([0.3, 0.5, 0.8])
    for b in (0.003, 0.01):
        model = sn.ArrayModel(-xs / r, omega, sn.cross_stencil(b), "E")
        theta = np.concatenate([[1e-21, 0, 3e-22, 2e-22], sn.quadrupole_parameters(
            sn.rotor_quadrupole(1.0, 0.12, [0.1, 0.9, 0.2])), xs])
        D = sn.array_cost(model, theta, known_position=True)[0]
        assert D == pytest.approx(sn.known_position_axial_cost(b / r), rel=3 * (b / r) + 1e-4)


def test_array_cost_grows_as_r_over_b_and_euler_bounds_it_with_known_position():
    omega, k, xs, Q = sn.example_geometry()
    theta = sn.example_theta()
    r = np.linalg.norm(xs)
    kappa = [sn.array_cost(sn.ArrayModel(k, omega, sn.cross_stencil(b), "E"), theta)[0] * b / r
             for b in (0.03, 0.015)]
    assert kappa[0] == pytest.approx(kappa[1], rel=0.03)
    for b in (0.03, 0.3, 0.5):
        model = sn.ArrayModel(k, omega, sn.cross_stencil(b), "E")
        known = sn.array_cost(model, theta, known_position=True)[0]
        assert known <= sn.euler_cost(b / r) * (1 + 0.5 * (b / r) ** 2)
        assert known <= sn.array_cost(model, theta)[0]


def test_euler_estimate_by_simulation():
    """E_w = P_TT[mean of seven - (r/5) n.grad E] from the stencil: unbiased to O(b/r)^2 for the point quadrupole,
    with variance sigma^2 (1/7 + r^2 / 50 b^2) per component, i.e. the cost euler_cost."""
    omega, k, xs, Q = sn.example_geometry()
    r, b = np.linalg.norm(xs), 0.3
    n = xs / r
    P = sn.transverse_projector(k)

    def estimate(E):
        E0, grad = sn.field_and_gradient(E, b)
        return P @ pixel.vec5(E0 - (r / 5) * np.einsum("a,aij->ij", n, grad))

    residual = []
    for bb in (b, b / 2):
        near = sn.quadrupole_tidal(Q, sn.cross_stencil(bb) - xs).real
        E0, grad = sn.field_and_gradient(near, bb)
        residual.append(np.linalg.norm(P @ pixel.vec5(E0 - (r / 5) * np.einsum("a,aij->ij", n, grad)))
                        / np.linalg.norm(P @ pixel.vec5(near[0])))
    assert residual[0] < 10 * (b / r) ** 2
    assert residual[0] / residual[1] == pytest.approx(4.0, rel=0.1)       # the truncation of the differences
    sims = np.array([estimate(pixel.mat5(rng.normal(size=(7, 5)))) for _ in range(4000)])
    var = np.trace(np.cov(sims.T)) / 2                       # two transverse-traceless components
    assert var == pytest.approx(1 / 7 + r ** 2 / (50 * b ** 2), rel=0.06)
    assert math.sqrt(var * 7) == pytest.approx(sn.euler_cost(b / r), rel=0.03)


@pytest.mark.parametrize("channels", ["E", "EB"])
def test_array_bound_by_simulation(channels):
    """Maximum-likelihood fits of the wave and the quadrupole (moment and position) to noisy readings of the example
    scatter as the Cramer-Rao covariance says."""
    omega, k, xs, Q = sn.example_geometry()
    theta = sn.example_theta()
    model = sn.ArrayModel(k, omega, sn.cross_stencil(sn.EXAMPLE["b"]), channels)
    truth = model.signal(theta)
    _, joint, _ = sn.array_cost(model, theta)
    Ew, Bw = sn.wave_fields(k, 1e-21, 0.0, omega, np.zeros((1, 3)))
    sigma_f = np.linalg.norm(sn.as_real(sn.readings(Ew, Bw))) / 20.0
    fits = np.array([model.fit(truth + rng.normal(size=truth.shape) * sigma_f, xs) for _ in range(250)])
    assert np.sum(fits[:, :4].var(axis=0)) / (np.trace(joint[:4, :4]) * sigma_f ** 2) == pytest.approx(1.0, abs=0.2)
    assert np.sum(fits[:, 14:].var(axis=0)) / (np.trace(joint[14:, 14:]) * sigma_f ** 2) == pytest.approx(1.0, abs=0.2)


# --- 4. depth from a pixel and its neighbours ----------------------------------------------------------------------

def test_range_from_field_and_gradient_of_tidal_py():
    for _ in range(3):
        n, r, M = unit(rng.normal(size=3)), rng.uniform(1, 10), rng.uniform(10, 1000)
        b = 1e-4 * r
        E = tidal.point_mass_tidal_tensor(sn.cross_stencil(b), r * n, M)
        E0, grad = sn.field_and_gradient(E, b)
        assert sn.range_from_field_and_gradient(E0, grad) == pytest.approx(r, rel=1e-6)
        assert np.linalg.norm(E0) == pytest.approx(math.sqrt(6) * G * M / r ** 3, rel=1e-6)


@pytest.mark.parametrize("theta,phi", [(1.1, 0.7), (0.2, 2.5)])
def test_depth_bound_closed_form_is_the_small_stencil_limit(theta, phi):
    M, r = 70.0, 3.0
    sigma = math.sqrt(6) * G * M / r ** 3                    # rho = 1
    for b_over_r in (1e-3, 3e-3):
        cov = sn.depth_covariance(M, r, theta, phi, sn.cross_stencil(b_over_r * r), sigma)
        closed_r, closed_M = sn.depth_bound(1.0, b_over_r)
        assert math.sqrt(cov[1, 1]) == pytest.approx(closed_r, rel=1e-4)
        assert math.sqrt(cov[0, 0]) == pytest.approx(closed_M, rel=1e-4)
    # with a wider stencil the curvature helps, and the full model does better than the closed form
    cov = sn.depth_covariance(M, r, theta, phi, sn.cross_stencil(r / 6), sigma)
    assert math.sqrt(cov[1, 1]) < sn.depth_bound(1.0, 1 / 6)[0]


def test_depth_bound_by_simulation():
    M, r, theta, phi, b, rho = 70.0, 3.0, 1.1, 0.7, 0.5, 100.0
    pos = sn.cross_stencil(b)
    sigma = math.sqrt(6) * G * M / r ** 3 / rho
    cov = sn.depth_covariance(M, r, theta, phi, pos, sigma)
    p0 = np.array([math.log(M), math.log(r), theta, phi])
    truth = sn.point_mass_readings(p0, pos)
    est = np.array([least_squares(lambda p: (sn.point_mass_readings(p, pos) - y) / sigma, p0).x
                    for y in truth + rng.normal(size=(300, truth.size)) * sigma])
    assert np.std(est[:, 1]) / math.sqrt(cov[1, 1]) == pytest.approx(1.0, abs=0.12)
    assert np.std(est[:, 0]) / math.sqrt(cov[0, 0]) == pytest.approx(1.0, abs=0.12)


# --- 5. one pixel ranges a moving mass with its magnetic part ------------------------------------------------------

def test_flyby_fields_are_the_point_formulas():
    M, x0, v = 300.0, np.array([2.0, 1.0, 0.5]), np.array([-1.0, 2.0, 0.3]) * 1e5
    times = np.linspace(-1e-5, 1e-5, 5)
    E, B = sn.flyby_fields(M, x0, v, times)
    for t, Et, Bt in zip(times, E, B):
        assert np.allclose(Et, gm.electric_point(M, x0 + v * t), rtol=1e-12, atol=0)
        assert np.allclose(Bt, gm.magnetic_point(M, x0 + v * t, v), rtol=1e-12, atol=1e-30)


def test_range_from_the_magnetic_part_is_one_over_its_snr():
    M, x0, v = 1000.0, np.array([2.0, 1.0, 0.5]), np.array([-1.0, 2.0, 0.3]) * 1e5   # v/c = 8e-4
    times = np.linspace(-1e-5, 1e-5, 15)
    sigma = sn.magnetic_snr(M, x0, v, times, 1.0) / 20.0   # rho_B = 20
    cov = sn.flyby_covariance(M, x0, v, times, sigma)
    g = np.concatenate([[0.0], x0 / (x0 @ x0), np.zeros(3)])
    assert math.sqrt(g @ cov @ g) == pytest.approx(1 / 20.0, rel=1e-4)
    # the electric record alone cannot range: its Fisher matrix is singular along the scaling
    def electric(p):
        return sn.readings(sn.flyby_fields(math.exp(p[0]), p[1:4], p[4:7], times)[0]).ravel()
    p0 = np.concatenate([[math.log(M)], x0, v])
    J = sn.jacobian(electric, p0, np.concatenate([[1e-6], 1e-6 * np.ones(3), 1e-1 * np.ones(3)]))
    scaling = np.concatenate([[3.0], x0, v])
    assert np.linalg.norm(J @ scaling) < 1e-6 * np.linalg.norm(J) * np.linalg.norm(scaling)
    # simulation: maximum-likelihood fits of all seven parameters
    truth = sn.flyby_readings(p0, times)
    est = []
    for _ in range(80):
        y = truth + rng.normal(size=truth.shape) * sigma
        sol = least_squares(lambda p: (sn.flyby_readings(p, times) - y) / sigma, p0, x_scale=np.abs(p0) + 1)
        est.append(math.log(np.linalg.norm(sol.x[1:4])))
    assert np.std(est) * 20.0 == pytest.approx(1.0, abs=0.25)


# --- 6. bodies on one line -----------------------------------------------------------------------------------------

def test_bodies_on_one_line_look_like_one_body_to_field_and_gradient():
    n = unit([0.4, -0.3, 0.8])
    masses, depths = [30.0, 80.0, 5.0], [2.0, 3.5, 1.2]
    b = 1e-4
    E = sum(tidal.point_mass_tidal_tensor(sn.cross_stencil(b), d * n, m) for m, d in zip(masses, depths))
    E0, grad = sn.field_and_gradient(E, b)
    r_eff, M_eff = sn.effective_body(masses, depths)
    assert sn.range_from_field_and_gradient(E0, grad) == pytest.approx(r_eff, rel=1e-6)
    np.testing.assert_allclose(E0, tidal.point_mass_tidal_tensor(np.zeros(3), r_eff * n, M_eff), rtol=1e-6,
                               atol=1e-6 * np.abs(E0).max())
    # two equal masses at r -+ Delta/2: nearer by Delta^2/r, lighter by 3 Delta^2 / 2 r^2
    r, D = 3.0, 0.03
    r_eff, M_eff = sn.effective_body([0.5, 0.5], [r - D / 2, r + D / 2])
    assert r_eff == pytest.approx(r - D ** 2 / r, abs=2 * D ** 4 / r ** 3)
    assert M_eff == pytest.approx(1 - 1.5 * D ** 2 / r ** 2, abs=5 * (D / r) ** 4)


def test_a_rod_along_the_line_is_seen_nearer_by_L2_over_3r():
    """A thin uniform box along the line of sight (tidal.uniform_box_tidal_tensor)."""
    r, L, w, b = 3.0, 0.6, 0.01, 1e-3
    E = tidal.uniform_box_tidal_tensor(sn.cross_stencil(b), (r, 0.0, 0.0), (L, w, w), 1000.0)
    E0, grad = sn.field_and_gradient(E, b)
    assert sn.range_from_field_and_gradient(E0, grad) == pytest.approx(r - L ** 2 / (3 * r), abs=0.1 * L ** 4 / r ** 3)


def test_a_round_body_is_a_point_whatever_its_size():
    """Outside a uniform ball (tidal.uniform_sphere_tidal_tensor) the stencil reads a point mass's field, so its
    centre and mass are measured as a point's and its radius not at all."""
    r, M, b = 3.0, 70.0, 0.5
    n = unit([0.2, 0.9, -0.4])
    point = tidal.point_mass_tidal_tensor(sn.cross_stencil(b), r * n, M)
    for radius in (0.1, 1.0, 2.0):
        ball = tidal.uniform_sphere_tidal_tensor(sn.cross_stencil(b), r * n, radius, M)
        np.testing.assert_allclose(ball, point, rtol=1e-12, atol=1e-12 * np.abs(point).max())


def test_curvature_snr_of_the_stencil():
    """sum_k |d_k d_k E|^2 = (GM/r^5)^2 (522 + 810 sum n_a^4), by finite differences of tidal.py."""
    M, r, h = 70.0, 3.0, 1e-3
    for n in [np.array([0, 0, 1.0]), unit([1, 1, 1]), unit(rng.normal(size=3))]:
        E = lambda x: tidal.point_mass_tidal_tensor(x, r * n, M)
        total = sum(np.sum(((E(e) + E(-e) - 2 * E(np.zeros(3))) / h ** 2) ** 2) for e in h * np.eye(3))
        assert total / (G * M / r ** 5) ** 2 == pytest.approx(522 + 810 * np.sum(n ** 4), rel=1e-5)
        # rho_H^2 = (b^4 / 2 sigma^2) total with sigma = |E| / rho = sqrt(6) G M / r^3 at rho = 1, here b = r
        rho_H = sn.curvature_snr(1.0, 1.0, n)
        assert rho_H ** 2 == pytest.approx(r ** 4 * total / (2 * 6 * (G * M / r ** 3) ** 2), rel=1e-5)


@pytest.mark.parametrize("theta,phi", [(0.0, 0.0), (1.1, 0.7)])
def test_depth_spread_is_measured_to_one_over_rho_H(theta, phi):
    """(Delta/r)^2 of two equal masses on one line is measured to 4/rho_H as b and Delta go to zero."""
    M, r = 70.0, 3.0
    sigma = math.sqrt(6) * G * M / r ** 3
    n = sn.direction(theta, phi)
    for b_over_r in (0.003, 0.01):
        cov = sn.two_body_covariance(M, r, 1e-5, theta + 1e-9, phi, sn.cross_stencil(b_over_r * r), sigma)
        assert math.sqrt(cov[2, 2]) * sn.curvature_snr(1.0, b_over_r, n) == pytest.approx(4.0, rel=0.02)


def test_depth_spread_by_simulation():
    M, r, theta, phi, b, rho = 70.0, 3.0, 1.1, 0.7, 0.06, 3e6
    pos = sn.cross_stencil(b)
    sigma = math.sqrt(6) * G * M / r ** 3 / rho
    u0 = 32.0 / sn.curvature_snr(rho, b / r, sn.direction(theta, phi))       # eight standard deviations
    cov = sn.two_body_covariance(M, r, u0, theta, phi, pos, sigma)
    p0 = np.array([math.log(M), math.log(r), u0, theta, phi])
    truth = sn.two_body_readings(p0, pos)
    est = [least_squares(lambda p: (sn.two_body_readings(p, pos) - y) / sigma, p0, x_scale=[1, 1, u0, 1, 1]).x[2]
           for y in truth + rng.normal(size=(200, truth.size)) * sigma]
    assert np.std(est) / math.sqrt(cov[2, 2]) == pytest.approx(1.0, abs=0.15)


# --- the numbers in the draft --------------------------------------------------------------------------------------

def test_numbers_quoted_in_the_draft():
    """paper/drafts/separation_noise.tex quotes these, rounded as below."""
    n = sn.paper_numbers()
    assert round(n["rotor_over_wave"]) == 99
    assert round(n["E_rotor"], 16) == pytest.approx(2.8e-14, abs=0.05e-14)
    assert round(n["E_wave"], 17) == pytest.approx(2.8e-16, abs=0.05e-16)
    assert round(n["rim_speed"]) == 19
    assert round(n["leak_ignored_pixel"]) == 35
    assert round(n["leak_ignored_array_E"]) == 70
    assert n["leak_rotor_B"] < 1e-4
    assert round(n["D_E"], 1) == 2.2
    assert round(n["D_EB"], 2) == 1.26
    assert round(n["rotor_moment_cost_E"], 1) == 1.5
    assert round(n["rotor_position_cost_E"], 1) == 1.3
    assert round(n["rotor_moment_cost_EB"], 2) == 1.07
    assert round(n["rotor_position_cost_EB"], 2) == 1.04
    assert round(n["leak_model_error"], 3) == 0.005
    assert round(n["rho_model_error"], -1) == 270
    assert round(n["b_over_r_equal"], 2) == 0.29
    assert round(n["rotor_B_over_E"], 7) == pytest.approx(2.0e-6, abs=1e-12)
    assert 0.1 < n["rotor_B_over_E"] / n["kr"] < 1 and n["rotor_B_over_E"] > 10 * n["rim_speed"] / c
    lo, med, hi = n["kappa_fitted"]
    assert (round(lo, 2), round(med, 2), round(hi, 2)) == (0.22, 0.29, 0.55)
    assert (round(n["kappa_known"][0], 2), round(n["kappa_known"][1], 2)) == (0.22, 0.27)
    assert round(math.sqrt(7 / 50), 2) == 0.37 and round(math.sqrt(7 / 150), 2) == 0.22
    assert round(n["depth_exact"], 2) == 1.07 and round(n["depth_closed"], 2) == 1.16
    assert (round(n["depth_range"][0], 2), round(n["depth_range"][1], 2)) == (0.90, 1.08)
    assert round(n["mass_exact"], 1) == 3.3
    assert round(n["person_E"], 11) == pytest.approx(4.2e-10, abs=0.05e-10)
    assert round(n["person_rhoB_per_rho"], 10) == pytest.approx(8.1e-9, abs=0.05e-9)
    assert round(1 / n["person_rhoB_per_rho"] / 1e8, 1) == 1.2
    assert (round(n["rhoH_range"][0], 1), round(n["rhoH_range"][1], 1)) == (8.1, 10.5)
    assert (round(n["two_body_coefficient"][0], 2), round(n["two_body_coefficient"][1], 2)) == (0.62, 0.70)
    assert round(math.sqrt(15), 2) == 3.87
