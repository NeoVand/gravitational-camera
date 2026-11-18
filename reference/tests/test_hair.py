"""What the outside knows (paper, Section XII): one look sees the harmonic moments, two looks see the density, the
count of bits, a black hole's friction and noise, and what gravity cannot decohere."""
import math

import numpy as np
import pytest

from gravcam import capacity, hair, nullspace
from gravcam import response as r
from gravcam.constants import G, c, hbar, kB


def fibonacci_sphere(n: int) -> np.ndarray:
    k = np.arange(n) + 0.5
    mu = 1 - 2 * k / n
    phi = math.pi * (1 + 5**0.5) * k
    s = np.sqrt(1 - mu**2)
    return np.stack([s * np.cos(phi), s * np.sin(phi), mu], axis=1)


def ball_points(R: float, n: int) -> np.ndarray:
    u = (np.arange(-n, n + 1) + 0.5) * R / n
    X, Y, Z = np.meshgrid(u, u, u, indexing="ij")
    p = np.stack([X.ravel(), Y.ravel(), Z.ravel()], axis=1)
    return p[np.linalg.norm(p, axis=1) <= R]


# --- two looks -----------------------------------------------------------------------------------------------------

@pytest.mark.parametrize("xi", [(0.0, 0.0, 2.0), (1.3, -0.4, 0.7), (5.0, 0.1, 0.0)])
def test_the_exponentials_are_harmonic_and_their_gradients_make_a_wave(xi):
    zp, zm = hair.calderon_vectors(xi)
    assert abs(zp @ zp) < 1e-12 and abs(zm @ zm) < 1e-12              # null: exp(zeta . x) is harmonic
    assert np.allclose(zp + zm, 1j * np.asarray(xi))
    rng = np.random.default_rng(0)
    p = rng.normal(size=(50, 3))
    gp, gm = hair.calderon_gradients(p, xi)
    k2 = float(np.dot(xi, xi))
    assert np.allclose(np.sum(gp * gm, axis=1), -k2 / 2 * np.exp(1j * p @ np.asarray(xi)), rtol=1e-12)


def test_two_looks_give_the_fourier_transform_of_the_density():
    rng = np.random.default_rng(1)
    p, m = rng.normal(size=(40, 3)), rng.uniform(0.5, 2.0, size=40)
    xi = np.array([0.8, -1.1, 0.5])
    assert hair.fourier_from_two_looks(p, m, xi) == pytest.approx(np.sum(m * np.exp(1j * p @ xi)), rel=1e-12)
    # a uniform ball, as fine points, against its form factor
    R, M = 1.0, 3.0
    pts = ball_points(R, 24)
    masses = np.full(len(pts), M / len(pts))
    for k in (0.5, 2.0, 5.0):
        got = hair.fourier_from_two_looks(pts, masses, np.array([0.0, 0.0, k]))
        assert got.real == pytest.approx(hair.ball_form_factor(M, R, k), abs=0.01 * M)
        assert abs(got.imag) < 1e-9 * M


def test_a_ball_and_a_shell_agree_at_one_look_and_differ_at_two():
    R, M = 1.0, 1.0
    ball = ball_points(R, 20)
    shell = R * fibonacci_sphere(20000)
    mb, ms = np.full(len(ball), M / len(ball)), np.full(len(shell), M / len(shell))
    # one look: the harmonic moments (here the monopole and a quadrupole) agree
    h2 = lambda p: 2 * p[:, 2] ** 2 - p[:, 0] ** 2 - p[:, 1] ** 2
    assert np.sum(mb) == pytest.approx(np.sum(ms))
    assert abs(np.sum(mb * h2(ball))) < 2e-3 and abs(np.sum(ms * h2(shell))) < 2e-3
    # two looks: the bilinear form of two quadrupoles is 4 int rho r^2 / 3 times a number, 3/5 against 1
    grad = lambda p: np.stack([-2 * p[:, 0], -2 * p[:, 1], 4 * p[:, 2]], axis=1)
    ratio = hair.bilinear(ms, grad(shell), grad(shell)) / hair.bilinear(mb, grad(ball), grad(ball))
    assert ratio.real == pytest.approx(5 / 3, rel=5e-3)
    # and the Fourier transforms differ
    k = 3.0
    fb = hair.fourier_from_two_looks(ball, mb, np.array([0.0, 0.0, k])).real
    fs = hair.fourier_from_two_looks(shell, ms, np.array([0.0, 0.0, k])).real
    assert fb == pytest.approx(hair.ball_form_factor(M, R, k), abs=0.01)
    assert fs == pytest.approx(hair.shell_form_factor(M, R, k), abs=1e-3)
    assert abs(fb - fs) > 0.25


def test_the_nugget_and_its_skin_differ_at_two_looks():
    m, s, R = 1.0, 0.5, 1.0
    n = fibonacci_sphere(40000)
    sigma = nullspace.balayage_point(m, s, R, n[:, 2])               # surface density over the sphere
    w = sigma * 4 * math.pi * R**2 / len(n)
    skin = R * n
    nugget = np.array([[0.0, 0.0, s]])
    # one look: the same mass and the same dipole and quadrupole about the centre
    assert np.sum(w) == pytest.approx(m, rel=1e-3)
    assert np.sum(w * skin[:, 2]) == pytest.approx(m * s, rel=1e-3)
    assert np.sum(w * (3 * skin[:, 2] ** 2 - R**2) / 2) == pytest.approx(m * s**2, rel=2e-3)
    # two looks: int rho r^2 is m s^2 against m R^2, and the Fourier transforms differ
    assert np.sum(w * np.sum(skin**2, axis=1)) == pytest.approx(m * R**2, rel=1e-3)
    xi = np.array([0.0, 0.0, 3.0])
    f_nugget = hair.fourier_from_two_looks(nugget, np.array([m]), xi)
    f_skin = hair.fourier_from_two_looks(skin, w, xi)
    assert f_nugget == pytest.approx(m * np.exp(1j * 3.0 * s), rel=1e-12)
    assert abs(f_nugget - f_skin) > 0.3


def test_a_fast_push_finds_the_body_as_dust():
    p, m, K = r.lattice_body(3.0)
    w2, V = r.normal_modes(m, K)
    w2 = np.clip(w2, 0.0, None)
    U1 = np.diag([-1.0, -1.0, 2.0])
    U2 = np.array([[0.0, 1.0, 0.0], [1.0, 0.0, 0.0], [0.0, 0.0, 0.0]])
    U3 = np.diag([1.0, -1.0, 0.0])
    grads = [r.quadrupole_gradient(p, U) for U in (U1, U2, U3)]
    cs = [r.multipole_couplings(p, m, V, g) for g in grads]
    for a in range(3):
        for b in range(3):
            want = hair.bilinear(m, grads[a], grads[b]).real
            assert float(cs[a] @ cs[b]) == pytest.approx(want, abs=1e-9 * abs(hair.bilinear(m, grads[0], grads[0]).real))
    # far above every mode the response is that of free particles, whatever the springs
    top = math.sqrt(w2.max())
    for omega in (30 * top, 300 * top):
        got = hair.response(w2, cs[0], cs[0], omega)
        assert got == pytest.approx(hair.dust_response(m, grads[0], grads[0], omega), rel=2 * (top / omega) ** 2)
    # and far below them it is not: the springs hold it
    assert abs(hair.response(w2, cs[0], cs[0], 0.3 * math.sqrt(w2[w2 > 1e-9].min()))) \
        < 0.2 * abs(hair.dust_response(m, grads[0], grads[0], 0.3 * math.sqrt(w2[w2 > 1e-9].min())))


def test_the_price_is_the_logarithm_again():
    # each exponential grows to exp(|xi| a / 2) across the body: detail 2 pi / |xi| needs that dynamic range twice
    a, xi = 1.3, np.array([3.0, -4.0, 12.0])
    zp, zm = hair.calderon_vectors(xi)
    surface = a * fibonacci_sphere(200000)
    for z in (zp, zm):
        assert np.abs(np.exp(surface @ z)).max() == pytest.approx(hair.growth(xi, a), rel=1e-3)
    # while their product, the wave exp(i xi . x), stays of size one
    assert np.allclose(np.abs(np.exp(surface @ zp) * np.exp(surface @ zm)), 1.0)


# --- how much ------------------------------------------------------------------------------------------------------

def test_the_count_of_hair():
    for snr10, tol in ((6, 0.06), (30, 0.01), (70, 0.004)):
        snr = 10.0**snr10
        assert hair.hair_bits_closed(snr, math.e) == pytest.approx(hair.hair_bits(snr, math.e), rel=tol)
    # the cube of the logarithm, and the square of the distance in radii
    big = hair.hair_bits(1e200, math.e) / hair.hair_bits(1e100, math.e)
    assert big == pytest.approx(8.0, rel=0.02)
    assert hair.hair_bits(1e100, math.e) / hair.hair_bits(1e100, math.e**2) == pytest.approx(4.0, rel=0.03)
    # close to the body it is the flat count of capacity.py over the body's whole surface, to leading order
    eps = 0.01
    flat = 4 * math.pi / eps**2 * capacity.near_field(1e150)
    assert hair.hair_bits(1e150, 1 + eps) == pytest.approx(flat, rel=0.1)
    # the numbers quoted: a camera three radii away, against a black hole
    assert hair.hair_bits(1e6, 3.0) == pytest.approx(1200, rel=0.01)
    assert hair.hair_bits(1e70, 3.0) == pytest.approx(1.7e6, rel=0.01)
    assert hair.hair_bits(1e70, 3.0) / 8e3 == pytest.approx(210, rel=0.01)              # kilobytes
    assert hair.black_hole_bits(1e6) == pytest.approx(140, abs=1)
    assert hair.black_hole_bits(1e70) == pytest.approx(1628, abs=1)
    assert hair.hair_bits(1e6, 3.0) / hair.black_hole_bits(1e6) == pytest.approx(9, abs=0.5)
    assert hair.hair_bits(1e70, 3.0) / hair.black_hole_bits(1e70) == pytest.approx(1000, rel=0.05)
    assert hair.hair_bits(1e70, math.e) == pytest.approx(2.0e6, rel=0.03)
    assert hair.hair_bits(1e3, math.e) > 10 * hair.black_hole_bits(1e3) / 7      # even at 10^3, more than its mass


# --- a black hole --------------------------------------------------------------------------------------------------

@pytest.mark.parametrize("M", [1.356e23, 1.989e30, 8.2e36])
def test_a_holes_noise_is_its_friction_at_the_hawking_temperature(M):
    # three published numbers (Poisson's 16/45, Page's 256/225, Goldberger and Rothstein's 1/360 pi) fit together
    omega = 1e-3 * c / hair.schwarzschild_radius(M)
    assert hair.absorption_from_friction(M, omega) == pytest.approx(hair.quadrupole_absorption(M, omega), rel=1e-12)
    assert hair.quadrupole_absorption(M, omega) == pytest.approx(
        4.0 / 225.0 * (hair.schwarzschild_radius(M) * omega / c) ** 6, rel=1e-12)
    assert hair.thermometer_of_a_hole(M) == pytest.approx(hair.hawking_temperature(M), rel=1e-12)
    # the same through the general formula of response.py, T = omega S / (2 k Im chi)
    T = r.thermometer(np.array([omega]), np.array([hair.quadrupole_noise(M)]),
                      np.array([hair.horizon_friction(M) * omega]))[0]
    assert T == pytest.approx(hair.hawking_temperature(M), rel=1e-12)


def test_the_friction_is_the_absorption_of_long_waves():
    # independent of the closed forms: the Regge-Wheeler equation, integrated (bhmodes.py), against Poisson's friction
    # read as an absorption probability. They agree as omega -> 0; the first correction is a few per cent at 0.01.
    from gravcam import bhmodes
    M = 1.989e30
    ratios = []
    for x in (0.02, 0.01, 0.005):
        gamma, _ = bhmodes.transmission(2, x)
        ratios.append(gamma / hair.absorption_from_friction(M, x * c**3 / (G * M)))
    assert ratios[1] == pytest.approx(1.07, abs=0.02)
    assert abs(ratios[2] - 1) < abs(ratios[1] - 1) < abs(ratios[0] - 1) < 0.2
    # the correction is linear in the frequency: halving it halves the excess
    assert (ratios[1] - 1) / (ratios[2] - 1) == pytest.approx(2.0, rel=0.1)


def test_the_tide_of_a_quadrupole_that_couples_without_a_half():
    # six masses: their Newtonian quadrupole Q^N = sum m (x x - r^2/3), their energy in a tide (1/2) Q^N E, and the
    # tide they make on the axis, 18 G Q^N_zz / r^5. The section's Q is half of Q^N, so its factor is 36.
    rng = np.random.default_rng(3)
    p = 0.01 * rng.normal(size=(6, 3))
    m = rng.uniform(1.0, 2.0, size=6)
    p -= (m[:, None] * p).sum(0) / m.sum()
    QN = np.einsum("a,ai,aj->ij", m, p, p) - np.eye(3) * np.sum(m * np.sum(p**2, axis=1)) / 3
    E = np.diag([1.0, 2.0, -3.0]) * 1e-6                                # a tide: Phi = (1/2) E_ij x_i x_j
    energy = 0.5 * np.einsum("a,ai,ij,aj->", m, p, E, p)
    assert energy == pytest.approx(np.sum((QN / 2) * E), rel=1e-12)     # Q = Q^N / 2 has energy Q_ij E_ij
    r, h = 3.0, 1e-3
    phi = lambda z: -G * np.sum(m / np.linalg.norm(np.array([0.0, 0.0, z]) - p, axis=1))
    tide = (phi(r + h) - 2 * phi(r) + phi(r - h)) / h**2 + 2 * G * m.sum() / r**3
    assert abs(tide) == pytest.approx(abs(hair.axis_tide_of_quadrupole(QN[2, 2] / 2, r)), rel=2e-3)


def test_the_hole_as_warm_as_the_sky():
    M = hbar * c**3 / (8 * math.pi * G * kB * 0.905)
    assert hair.hawking_temperature(M) == pytest.approx(0.905, rel=1e-12)
    assert hair.horizon_friction(M) == pytest.approx(M * hair.schwarzschild_radius(M) ** 5 / (90 * c**3), rel=1e-12)
    # its tremor a metre away, against its tide there
    assert hair.hole_tide_noise(M, 1.0) == pytest.approx(4.2e-32, rel=0.05)
    assert 2 * G * M / 1.0**3 == pytest.approx(1.8e13, rel=0.02)


# --- push and weigh ------------------------------------------------------------------------------------------------

def _a_moving_body(n: int = 7, seed: int = 5):
    rng = np.random.default_rng(seed)
    x = rng.uniform(-1.0, 1.0, size=(n, 3))
    x *= (rng.uniform(0.2, 1.0, size=n) / np.linalg.norm(x, axis=1))[:, None]        # inside the unit ball
    return x, rng.uniform(0.5, 2.0, size=n), rng.normal(size=(n, 3))


def test_a_push_adds_two_terms_and_no_more():
    x, m, p = _a_moving_body()
    V = lambda q: sum(1.0 / np.linalg.norm(q[i] - q[j]) ** 6 - 3.0 * np.linalg.norm(q[i] - q[j]) ** 2
                      for i in range(len(q)) for j in range(i))                      # any forces between the parts
    H = lambda q, k: float(np.sum(k**2 / (2 * m[:, None])) + V(q))
    grad = hair.source_gradients([[0.0, 2.0, 3.0]])[0](x)                            # the tide of a mass outside
    for eps in (0.3, -0.3, 2.0, 40.0):
        after = hair.push(p, m, grad, eps)
        assert H(x, after) - H(x, p) == pytest.approx(hair.energy_gained(m, p, grad, eps), rel=1e-11)
    # the two terms: the body's own motion, odd in the push, and int rho |grad g|^2, even
    even = (hair.energy_gained(m, p, grad, 1.0) + hair.energy_gained(m, p, grad, -1.0)) / 2
    odd = (hair.energy_gained(m, p, grad, 1.0) - hair.energy_gained(m, p, grad, -1.0)) / 2
    assert even == pytest.approx(hair.bilinear(m, grad, grad).real / 2, rel=1e-12)
    assert odd == pytest.approx(np.sum(p * grad), rel=1e-12)
    # as weight: a ball of a kilogram kicked at 3e-12 m/s gains a few parts in 10^41 of its mass
    assert hair.weight_gained(np.array([1.0]), np.zeros((1, 3)), np.array([[3e-12, 0.0, 0.0]]), 1.0) \
        == pytest.approx(0.5 * (3e-12 / c) ** 2, rel=1e-12)
    assert 1e-42 < 0.5 * (3e-12 / c) ** 2 < 1e-40


def test_the_weight_alone_reads_the_density():
    x, m, p = _a_moving_body()
    weigh = hair.body(x, m, p)                                   # all that the outside is given
    for xi in ([0.0, 0.0, 2.0], [1.3, -0.4, 0.7], [4.0, 1.0, -2.0]):
        got = hair.density_from_weighings(weigh, xi)
        assert got == pytest.approx(np.sum(m * np.exp(1j * x @ np.asarray(xi))), rel=1e-9)
        assert got == pytest.approx(hair.fourier_from_two_looks(x, m, np.asarray(xi)), rel=1e-9)
    # a ball and a shell: the same weight, the same field outside, and different weights after the same push
    R, M = 1.0, 1.0
    ball, shell = ball_points(R, 12), R * fibonacci_sphere(4000)
    wb = hair.body(ball, np.full(len(ball), M / len(ball)), np.zeros_like(ball))
    ws = hair.body(shell, np.full(len(shell), M / len(shell)), np.zeros_like(shell))
    tide = lambda q: q * np.array([-1.0, -1.0, 2.0])             # grad of z^2 - (x^2 + y^2) / 2
    assert ws(tide, 1.0) / wb(tide, 1.0) == pytest.approx(5 / 3, rel=0.01)
    k = 3.0
    fb, fs = (hair.density_from_weighings(w, [0.0, 0.0, k]) for w in (wb, ws))
    assert fb.real == pytest.approx(hair.ball_form_factor(M, R, k), abs=0.02)
    assert fs.real == pytest.approx(hair.shell_form_factor(M, R, k), abs=2e-3)


def test_and_then_every_momentum():
    x, m, p = _a_moving_body(n=6)
    weigh = hair.body(x, m, p)
    grads = hair.source_gradients(2.5 * fibonacci_sphere(60))    # sixty masses outside, one at a time
    A = hair.gradient_matrix(x, grads)
    assert np.linalg.matrix_rank(A, tol=1e-9 * np.linalg.norm(A, 2)) == 3 * len(x)    # gradients span R^3N
    assert hair.momenta_from_weighings(weigh, x, grads) == pytest.approx(p, rel=1e-5, abs=1e-6)
    # so nothing but a constant has a vanishing bracket with every Q_h and with H: the brackets with Q_h are
    # -m grad h . dF/dp, and A has full rank
    few = hair.gradient_matrix(x, grads[:10])
    assert np.linalg.matrix_rank(few) == 10 < 3 * len(x)         # and ten pushes are not enough for six bodies


def test_a_push_is_impulsive_when_faster_than_the_body_can_answer():
    pts, m, K = r.lattice_body(2.0)
    w2, _ = r.normal_modes(m, K)
    top, low = math.sqrt(w2.max()), math.sqrt(w2[w2 > 1e-9 * w2.max()].min())
    grad = r.quadrupole_gradient(pts, np.diag([-1.0, -1.0, 2.0]))
    eps = 1e-3
    force = (eps * m[:, None] * grad).ravel()
    dust = hair.energy_gained(m, np.zeros_like(pts), grad, eps)
    fast = [hair.pulse_energy(np.repeat(m, 3), K, force, tau) / dust for tau in (0.02 / top, 0.04 / top)]
    assert fast[0] == pytest.approx(1.0, abs=1e-3)
    assert (1 - fast[1]) / (1 - fast[0]) == pytest.approx(4.0, rel=0.1)         # the shortfall is (omega tau)^2
    slow = hair.pulse_energy(np.repeat(m, 3), K, force, 6.0 / low, steps_per_tau=4000) / dust
    assert slow < 1e-6                                                          # a slow push is given back


def test_each_pair_is_a_wave_and_reads_a_projection():
    x, m, p = _a_moving_body()
    xi = np.array([1.3, -0.4, 0.7])
    n = hair.wave_direction(xi)
    zp, zm = hair.calderon_vectors(xi)
    assert abs(zp @ n) < 1e-12 and abs(zm @ n) < 1e-12 and abs(xi @ n) < 1e-12   # no change along the wave's path
    slid = x + np.outer(np.random.default_rng(2).normal(size=len(x)), n)        # each mass moved along that path
    weigh, weigh_slid = hair.body(x, m, p), hair.body(slid, m, p)
    assert hair.density_from_weighings(weigh_slid, xi) == pytest.approx(hair.density_from_weighings(weigh, xi), rel=1e-9)


# --- what gravity cannot decohere -----------------------------------------------------------------------------------

def test_what_gravity_cannot_decohere():
    M, R = 2.0, 0.7
    g_ball = lambda x: np.where(x < R, G * M * x / R**3, G * M / np.maximum(x, 1e-30) ** 2)
    g_shell = lambda x: np.where(x < R, 0.0, G * M / np.maximum(x, 1e-30) ** 2)
    assert hair.difference_energy(g_ball, g_shell, 5 * R) == pytest.approx(hair.ball_shell_energy(M, R), rel=1e-6)
    assert hair.ball_shell_energy(M, R) == pytest.approx(G * M**2 / (10 * R))
    # outside, the two fields are the same at every radius
    x = np.linspace(R * 1.0001, 5 * R, 50)
    assert np.allclose(g_ball(x), g_shell(x))
    # a glass bead a micron in radius: Penrose's time hbar / E_G
    Rb = 1e-6
    Mb = 2200.0 * 4 * math.pi * Rb**3 / 3
    assert hbar / hair.ball_shell_energy(Mb, Rb) == pytest.approx(0.19, rel=0.05)
    # a ball that only breathes: the same integral for two radii a little apart
    d = 1e-3 * R
    g_big = lambda x: np.where(x < R + d, G * M * x / (R + d) ** 3, G * M / np.maximum(x, 1e-30) ** 2)
    assert hair.difference_energy(g_ball, g_big, 5 * R, n=2000001) == pytest.approx(hair.breathing_energy(M, R, d), rel=5e-3)
    assert hair.ball_shell_energy(M, R) / hair.breathing_energy(M, R, d) == pytest.approx(R**2 / (9 * d**2))
