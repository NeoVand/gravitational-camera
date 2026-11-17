"""Telling waves from nearby pull with noise, and how well depth is measured (paper, Section 8).

Conventions as in pixel.py and onepixel.py: E_ij and B_ij in s^-2, |B| = |E| in a plane wave, B_ij = eps_ipq k_p E_qj
for a wave travelling along k. A pixel's ten numbers are the coordinates of E and B in the orthonormal basis
pixel.STF of symmetric trace-free matrices, so that |E|^2 = E_ij E_ij.

Noise. Each of the ten numbers carries independent white noise of standard deviation sigma per reading. At one
frequency omega a record of N readings spanning whole cycles is summarized by complex amplitudes x, with
reading(t) = Re[x exp(-i omega t)]; their real and imaginary parts then carry noise sigma_f = sigma sqrt(2/N)
(`amplitude_noise`; the tests check it by sampling in time). The signal-to-noise ratio of a signal is
rho = |x| / sigma_f, the matched-filter value (sum over the numbers and the pixels), and for one reading of a static
field it is |E| / sigma, as in pixel.py. The Cramer-Rao bounds below are the inverse Fisher matrices of these
Gaussian models; the tests compare them with the spread of maximum-likelihood fits to simulated noisy data.

Results, each tested in tests/test_separation_noise.py:

1. Shape (one reading of E, one isolated source). The nearest single-mass field to any plane wave, and the nearest
   plane wave to any single-mass field, lie at half the reading's size, |E|/2 (`distance_to_waves`,
   `distance_to_masses`: sqrt(3/2) min|lambda| and sqrt(|E|^2 - 3/2 max lambda^2) over the eigenvalues). One
   reading puts an isolated wave and an isolated mass rho/2 standard deviations apart; how often the nearer kind
   is the wrong one is simulated by `shape_error_rates` (under one in a hundred at rho = 12).
2. The magnetic part (one pixel, E and B, a wave plus any near field). Let the near field's E at the wave's
   frequency be anything (five complex numbers) and its B below the noise. Fitting both costs every wave amplitude
   exactly sqrt 2 in standard deviation, whatever the near field's strength: the near field absorbs the wave's E,
   and the wave is read from its B, which carries half its signal. In return the near field loses sqrt 2 in its two
   components along the wave's transverse-traceless plane and nothing in the other three (`one_pixel_covariances`).
   Ignoring the near field biases the wave by half the near field's transverse-traceless part (`wave_bias`).
   The near field's own B is not suppressed by v/c alone: at the frequency of a changing source its mass currents
   fall as r^-4 and its quadrupole as r^-5, so |B|/|E| is of order k r (0.31 k r for the example rotor, 30 times
   its rim speed over c; `rotor_fields`), and leaks into the wave at 1e-4 of it in the example.
3. Variation across an array (E only). If the near field comes from one compact source, a point quadrupole such as
   a rotor (`quadrupole_tidal`) whose moment and position are unknown, its share of the centre's reading is inferred
   from its variation, and the cost D (the factor on the wave's standard deviation, `array_cost`) grows as r/b for a
   pixel and its six neighbours at distance b (`cross_stencil`), source at distance r. With the source's position
   known and the wave along the line to it, D^2 = 1 + (7/150)(r/b)^2 for b << r. Euler's relation for a field
   homogeneous of degree -(l + 3) about its source, (x - x_s).grad E = -(l + 3) E (l = 2 for a quadrupole), gives
   the same scaling: E_n(0) = (r/5) n.grad E_n read from the radial derivative alone gives D^2 = 1 + (7/50)(r/b)^2.
4. Depth from a pixel and its neighbours. For one point mass the field and its gradient give the range,
   r = sqrt(15) |E| / |grad E| (Frobenius norms, `range_from_field_and_gradient`), and with independent white noise
   on both the Cramer-Rao bounds are exactly
       (sigma_r / r)^2 = 1/rho_E^2 + 1/rho_G^2,      (sigma_M / M)^2 = 16/rho_E^2 + 9/rho_G^2,
   rho_E and rho_G the signal-to-noise ratios of the field and of the gradient (the direction decouples). For six
   neighbours at distance b, rho_E = sqrt(7) rho and rho_G = sqrt(30) rho b / r (`depth_bound`); the full model
   (`depth_covariance`) does better once b is not small, from the curvature of the field across the stencil.
5. One pixel ranges a moving mass with its magnetic part alone: E(t) is unchanged by x -> l x, v -> l v,
   M -> l^3 M while B -> l B, so sigma_r / r = 1 / rho_B, rho_B the signal-to-noise ratio of B, to relative order
   (v/c)^2 (`flyby_covariance`). Per reading rho_B = sqrt(3) (v_perp / c) rho.
6. Bodies on one line through the pixel. Every Taylor coefficient of E at the pixel then has the pattern of a single
   mass, with weight sum M_i / r_i^(l + 1). Field and gradient therefore see one body at
   r_eff = sum(M_i / r_i^3) / sum(M_i / r_i^4), of mass r_eff^3 sum(M_i / r_i^3) (`effective_body`), and the
   spread of depths appears first in the curvature: its share of the second derivatives is Var(s) / r^2 to leading
   order, which the six-neighbour stencil measures to 1/rho_H, rho_H = rho (b/r)^2 sqrt(43.5 + 67.5 sum_a n_a^4)
   (`curvature_snr`; between 8.1 and 10.5 rho (b/r)^2). Two equal masses at r -+ Delta/2 have Var(s) = Delta^2/4,
   so (Delta/r)^2 is measured to 4/rho_H; a uniform rod of length L along the line has L^2/12 and is seen by field
   and gradient at r - L^2/(3r).
"""
from __future__ import annotations

import math

import numpy as np
from scipy.optimize import least_squares

from . import gravitomagnetic, onepixel, pixel, tidal
from .constants import G, c as C_LIGHT
from .curvature import EPS

STF = pixel.STF

# --- data model ----------------------------------------------------------------------------------------------------


def amplitude_noise(sigma: float, n_readings: int) -> float:
    """Noise on the real and imaginary parts of one frequency's complex amplitude, from noise sigma per reading over
    n_readings spanning whole cycles: sigma sqrt(2 / N)."""
    return sigma * math.sqrt(2.0 / n_readings)


def as_real(x) -> np.ndarray:
    """Complex amplitudes as one real data vector: real parts, then imaginary parts."""
    x = np.asarray(x, dtype=complex).ravel()
    return np.concatenate([x.real, x.imag])


def readings(E, B=None) -> np.ndarray:
    """The pixels' numbers (vec5 of E, then of B if given), shape (pixels, 5 or 10)."""
    v = pixel.vec5(np.asarray(E))
    if B is not None:
        v = np.concatenate([v, pixel.vec5(np.asarray(B))], axis=-1)
    return np.atleast_2d(v)


def covariance(J, sigma: float = 1.0) -> np.ndarray:
    """Inverse Fisher matrix of a linear-Gaussian model with Jacobian J (data x parameters) and noise sigma, computed
    with the columns scaled to unit norm so that parameters of very different sizes do not spoil the inverse."""
    J = np.asarray(J, dtype=float)
    s = np.linalg.norm(J, axis=0)
    s[s == 0] = 1.0
    Jn = J / s
    return np.linalg.inv(Jn.T @ Jn) * sigma ** 2 / np.outer(s, s)


def jacobian(f, p, steps) -> np.ndarray:
    """Central differences of the real vector f(p)."""
    p = np.asarray(p, dtype=float)
    cols = []
    for i, h in enumerate(np.broadcast_to(steps, p.shape)):
        up, dn = p.copy(), p.copy()
        up[i] += h
        dn[i] -= h
        cols.append((f(up) - f(dn)) / (2.0 * h))
    return np.array(cols).T


def cross_stencil(b: float) -> np.ndarray:
    """A pixel at the origin and its six neighbours at distance b along +-x, +-y, +-z; shape (7, 3)."""
    out = [np.zeros(3)]
    for axis in range(3):
        for sign in (1.0, -1.0):
            e = np.zeros(3)
            e[axis] = sign * b
            out.append(e)
    return np.array(out)


# --- a plane wave at one frequency ---------------------------------------------------------------------------------


def wave_basis(k) -> tuple[np.ndarray, np.ndarray]:
    """The E of unit + and x polarization for a wave travelling along k (onepixel.plane_wave_tensors), each of norm
    sqrt 2."""
    n = -np.asarray(k, dtype=float)
    plus, _ = onepixel.plane_wave_tensors(n, 1.0, 0.0)
    cross, _ = onepixel.plane_wave_tensors(n, 0.0, 1.0)
    return plus, cross


def magnetic_of_wave(E, k) -> np.ndarray:
    """B_ij = eps_ipq k_p E_qj, for E of shape (..., 3, 3)."""
    return np.einsum("ipq,p,...qj->...ij", EPS, np.asarray(k, dtype=float), E)


def wave_fields(k, h_plus: complex, h_cross: complex, omega: float, positions):
    """Complex amplitudes (E, B) at the positions of a plane wave travelling along k with strain amplitudes h_plus,
    h_cross: h_ij = Re[(h_+ e+ + h_x ex) exp(i(omega k.x/c - omega t))], E = -(1/2) d^2h/dt^2."""
    plus, cross = wave_basis(k)
    E0 = 0.5 * omega ** 2 * (h_plus * plus + h_cross * cross)
    phase = np.exp(1j * omega / C_LIGHT * (np.atleast_2d(positions) @ np.asarray(k, dtype=float)))
    E = phase[:, None, None] * E0[None]
    return E, magnetic_of_wave(E, k)


# --- the near field of a rotor -------------------------------------------------------------------------------------


def quadrupole_tidal(Q, offset) -> np.ndarray:
    """E_ij at offset R = pixel - source from a point mass quadrupole Q (symmetric trace-free, I_ij minus its trace
    part; complex for an amplitude), Phi = -(G/2) Q_kl d_k d_l (1/R):

        E_ij = -(G / 2R^5) [105 q n_i n_j - 15 q delta_ij - 30 ((Qn)_i n_j + n_i (Qn)_j) + 6 Q_ij],  q = n.Q.n.
    """
    R = np.atleast_2d(np.asarray(offset, dtype=float))
    d = np.linalg.norm(R, axis=1)
    n = R / d[:, None]
    Q = np.asarray(Q)
    q = np.einsum("pi,ij,pj->p", n, Q, n)
    Qn = np.einsum("ij,pj->pi", Q, n)
    nn = n[:, :, None] * n[:, None, :]
    E = (105.0 * q[:, None, None] * nn - 15.0 * q[:, None, None] * np.eye(3)
         - 30.0 * (Qn[:, :, None] * n[:, None, :] + n[:, :, None] * Qn[:, None, :]) + 6.0 * Q[None])
    return -(G / 2.0) * E / d[:, None, None] ** 5


def rotor_basis(axis) -> tuple[np.ndarray, np.ndarray]:
    """Unit vectors (e1, e2) across the rotor's axis with e1 x e2 = axis."""
    axis = np.asarray(axis, dtype=float)
    axis = axis / np.linalg.norm(axis)
    seed = np.array([1.0, 0.0, 0.0]) if abs(axis[0]) < 0.9 else np.array([0.0, 1.0, 0.0])
    e1 = np.cross(seed, axis)
    e1 /= np.linalg.norm(e1)
    return e1, np.cross(axis, e1)


def rotor_quadrupole(mass: float, separation: float, axis) -> np.ndarray:
    """The complex amplitude at twice the rotation rate of the quadrupole of two masses `mass` at -+separation/2
    turning about `axis`, starting along e1 of rotor_basis: Q = Delta I (e1 + i e2)(e1 + i e2)^T / 2 with
    Delta I = mass separation^2 / 2 (waves.Rotor.delta_inertia)."""
    e1, e2 = rotor_basis(axis)
    m = e1 + 1j * e2
    return 0.5 * mass * separation ** 2 / 2.0 * np.outer(m, m)


def rotor_fields(positions, center, axis, mass: float, separation: float, spin: float, n_t: int = 64):
    """Complex amplitudes (E, B) at twice the rotation rate `spin` (rad/s), at the positions, of two point masses
    turning about `center`: the exact Newtonian tide of each (tidal.point_mass_tidal_tensor) and its first-order
    magnetic part (gravitomagnetic.magnetic_point), sampled over one turn and Fourier-analysed."""
    positions = np.atleast_2d(np.asarray(positions, dtype=float))
    center = np.asarray(center, dtype=float)
    e1, e2 = rotor_basis(axis)
    times = np.arange(n_t) * (2.0 * math.pi / spin) / n_t
    E = np.zeros((len(positions), 3, 3), dtype=complex)
    B = np.zeros_like(E)
    for t in times:
        u = math.cos(spin * t) * e1 + math.sin(spin * t) * e2
        du = spin * (-math.sin(spin * t) * e1 + math.cos(spin * t) * e2)
        phase = np.exp(2j * spin * t) * 2.0 / n_t
        for sign in (1.0, -1.0):
            x = center + sign * 0.5 * separation * u
            v = sign * 0.5 * separation * du
            E += phase * tidal.point_mass_tidal_tensor(positions, x, mass)
            for p, point in enumerate(positions):
                B[p] += phase * gravitomagnetic.magnetic_point(mass, x - point, v)
    return E, B


# --- 1. shape ------------------------------------------------------------------------------------------------------


def distance_to_waves(E) -> float:
    """Distance (Frobenius) from a real trace-free E to the nearest plane wave, diag(a, -a, 0) in some axes:
    sqrt(3/2) times the smallest |eigenvalue|."""
    return math.sqrt(1.5) * float(np.min(np.abs(np.linalg.eigvalsh(E))))


def distance_to_masses(E) -> float:
    """Distance from a real trace-free E to the nearest single-mass field, A diag(-2, 1, 1) in some axes:
    sqrt(|E|^2 - 3/2 max lambda^2)."""
    lam = np.linalg.eigvalsh(E)
    return math.sqrt(max(float(np.sum(lam * lam)) - 1.5 * float(np.max(lam * lam)), 0.0))


def shape_error_rates(rho: float, trials: int, rng) -> tuple[float, float]:
    """By simulation, how often one noisy reading (signal-to-noise ratio rho, random direction and polarization)
    lies nearer the other kind of source: (a mass taken for a wave, a wave taken for a mass). The rule is not
    symmetric, because the waves form a family of four parameters and the masses one of three."""
    wrong_mass = wrong_wave = 0
    for _ in range(trials):
        n = rng.normal(size=3)
        n /= np.linalg.norm(n)
        E = np.eye(3) - 3.0 * np.outer(n, n)
        y = E / np.linalg.norm(E) + pixel.mat5(rng.normal(size=5)) / rho
        wrong_mass += distance_to_waves(y) < distance_to_masses(y)
        W, _ = onepixel.plane_wave_tensors(n, *rng.normal(size=2))
        y = W / np.linalg.norm(W) + pixel.mat5(rng.normal(size=5)) / rho
        wrong_wave += distance_to_masses(y) < distance_to_waves(y)
    return wrong_mass / trials, wrong_wave / trials


# --- 2. one pixel, E and B -----------------------------------------------------------------------------------------


def _wave_columns(k, omega, positions, channels):
    """Real data columns of the wave's four real parameters (Re, Im of h_+, then of h_x), per unit strain."""
    cols = []
    for hp, hx in ((1.0, 0.0), (1j, 0.0), (0.0, 1.0), (0.0, 1j)):
        E, B = wave_fields(k, hp, hx, omega, positions)
        cols.append(as_real(readings(E, B if channels == "EB" else None)))
    return np.array(cols).T


def _free_near_columns(n_pixels, channels):
    """Columns of a near field whose E is free at every pixel (five complex numbers each) and whose B is zero: per
    pixel, the real parts of the five vec5 coordinates, then the imaginary parts."""
    width = 10 if channels == "EB" else 5
    cols = []
    for p in range(n_pixels):
        for ph in (1.0, 1j):
            for a in range(5):
                x = np.zeros((n_pixels, width), dtype=complex)
                x[p, a] = ph
                cols.append(as_real(x))
    return np.array(cols).T


def one_pixel_covariances(k, omega: float = 1.0):
    """Cramer-Rao covariances (sigma_f = 1) at one pixel reading E and B: of the wave's four real parameters alone,
    and jointly with a near field whose E is free; and of the near field's ten real parameters (Re, Im of the five
    vec5 coordinates) alone and jointly. Returns (wave_alone, wave_joint, near_alone, near_joint)."""
    Jw = _wave_columns(k, omega, np.zeros((1, 3)), "EB")
    Jn = _free_near_columns(1, "EB")
    C = covariance(np.hstack([Jw, Jn]))
    return covariance(Jw), C[:4, :4], covariance(Jn), C[4:, 4:]


def transverse_projector(k) -> np.ndarray:
    """The 5 x 5 projector onto the vec5 coordinates of the wave's transverse-traceless plane."""
    plus, cross = wave_basis(k)
    U = np.stack([pixel.vec5(plus), pixel.vec5(cross)], axis=1) / math.sqrt(2.0)
    return U @ U.T


def wave_bias(k, omega: float, E_near, B_near=None, channels: str = "EB", positions=None):
    """(h_+, h_x) that a least-squares fit of a plane wave alone finds in a near field's amplitudes (E_near, B_near at
    the positions; default one pixel): the leakage when the near field is ignored. With E and B and no B_near it is
    half the near field's transverse-traceless part, in strain units."""
    positions = np.zeros((1, 3)) if positions is None else np.atleast_2d(positions)
    E_near = np.asarray(E_near, dtype=complex).reshape(len(positions), 3, 3)
    B_near = np.zeros_like(E_near) if B_near is None else np.asarray(B_near, dtype=complex).reshape(E_near.shape)
    J = _wave_columns(k, omega, positions, channels)
    y = as_real(readings(E_near, B_near if channels == "EB" else None))
    p = np.linalg.lstsq(J, y, rcond=None)[0]
    return complex(p[0], p[1]), complex(p[2], p[3])


# --- 3. an array: a wave and a point quadrupole --------------------------------------------------------------------


class ArrayModel:
    """A plane wave (known direction k, unknown complex h_+, h_x) and a point quadrupole (unknown complex moment Q and
    position x_s) at angular frequency omega, read by pixels at `positions` in `channels` "E" or "EB". The
    quadrupole's B is left out of the model: in the near zone the oscillating part of a source's B is smaller than
    its E by about k r (its mass currents fall as r^-4, its quadrupole as r^-5), 2e-6 for the example. Parameters:
    Re, Im of h_+, h_x (4), Re and Im of vec5(Q) (10), x_s (3)."""

    def __init__(self, k, omega: float, positions, channels: str = "E"):
        self.k = np.asarray(k, dtype=float) / np.linalg.norm(k)
        self.omega = float(omega)
        self.positions = np.atleast_2d(np.asarray(positions, dtype=float))
        self.channels = channels
        self.wave_columns = _wave_columns(self.k, self.omega, self.positions, channels)

    def _pad(self, E):
        if self.channels == "EB":
            return readings(E, np.zeros_like(E))
        return readings(E)

    def quadrupole_columns(self, xs) -> np.ndarray:
        cols = []
        for ph in (1.0, 1j):
            for a in range(5):
                E = quadrupole_tidal(ph * STF[a], self.positions - np.asarray(xs, dtype=float))
                cols.append(as_real(self._pad(E)))
        return np.array(cols).T             # Re of the five coordinates, then Im, as quadrupole_parameters

    def linear_columns(self, xs) -> np.ndarray:
        return np.hstack([self.wave_columns, self.quadrupole_columns(xs)])

    def signal(self, theta) -> np.ndarray:
        theta = np.asarray(theta, dtype=float)
        return self.linear_columns(theta[14:17]) @ theta[:14]

    def jacobian(self, theta, step: float = 1e-6) -> np.ndarray:
        theta = np.asarray(theta, dtype=float)
        lin = self.linear_columns(theta[14:17])
        r = float(np.linalg.norm(theta[14:17] - self.positions[0]))
        pos = jacobian(lambda xs: self.linear_columns(xs) @ theta[:14], theta[14:17], step * r)
        return np.hstack([lin, pos])

    def fit(self, data, xs_start) -> np.ndarray:
        """Maximum likelihood (least squares) by variable projection: the linear parameters solved exactly for each
        trial position, the position by scipy.optimize.least_squares from xs_start."""
        data = np.asarray(data, dtype=float)
        unit = float(np.max(np.abs(data)))          # least_squares' tolerances are absolute

        def residual(xs):
            A = self.linear_columns(xs)
            s = np.linalg.norm(A, axis=0)
            p = np.linalg.lstsq(A / s, data, rcond=None)[0]
            return (A @ (p / s) - data) / unit

        xs_start = np.asarray(xs_start, dtype=float)
        scale = float(np.linalg.norm(xs_start - self.positions[0]))
        sol = least_squares(residual, xs_start, x_scale=scale * np.ones(3), xtol=1e-14, ftol=1e-14, gtol=1e-14)
        A = self.linear_columns(sol.x)
        s = np.linalg.norm(A, axis=0)
        p = np.linalg.lstsq(A / s, data, rcond=None)[0] / s
        return np.concatenate([p, sol.x])


def quadrupole_parameters(Q) -> np.ndarray:
    q = pixel.vec5(np.asarray(Q, dtype=complex))
    return np.concatenate([q.real, q.imag])


def array_cost(model: ArrayModel, theta, known_position: bool = False):
    """(D, joint covariance, wave-alone covariance): D^2 is the ratio of the summed variances of the wave's four real
    parameters fitted with the quadrupole to those fitted alone, from the same pixels and channels."""
    J = model.jacobian(theta)
    if known_position:
        J = J[:, :14]
    joint = covariance(J)
    alone = covariance(J[:, :4])
    return math.sqrt(np.trace(joint[:4, :4]) / np.trace(alone)), joint, alone


def euler_cost(b_over_r: float) -> float:
    """D for the six-neighbour stencil when the quadrupole's share of the centre's reading is taken from Euler's
    relation, E_n(0) = (r/5) n.grad E_n, with the source's position known: sqrt(1 + (7/50)(r/b)^2)."""
    return math.sqrt(1.0 + 7.0 / 50.0 / b_over_r ** 2)


def known_position_axial_cost(b_over_r: float) -> float:
    """The limit b << r of the optimal D with the source's position known and the wave travelling along the line to
    it: sqrt(1 + (7/150)(r/b)^2)."""
    return math.sqrt(1.0 + 7.0 / 150.0 / b_over_r ** 2)


# --- 4-6. depth ----------------------------------------------------------------------------------------------------


def direction(theta: float, phi: float) -> np.ndarray:
    return np.array([math.sin(theta) * math.cos(phi), math.sin(theta) * math.sin(phi), math.cos(theta)])


def point_mass_readings(params, positions) -> np.ndarray:
    """The real readings (vec5 of E) at the positions of a point mass with params (ln M, ln r, theta, phi), at
    r direction(theta, phi) from the origin."""
    lnM, lnr, theta, phi = params
    E = tidal.point_mass_tidal_tensor(np.atleast_2d(positions), math.exp(lnr) * direction(theta, phi), math.exp(lnM))
    return readings(E).ravel()


def depth_covariance(mass: float, r: float, theta: float, phi: float, positions, sigma: float) -> np.ndarray:
    """Cramer-Rao covariance of (ln M, ln r, theta, phi) of a point mass from E at the positions with noise sigma."""
    p = [math.log(mass), math.log(r), theta, phi]
    return covariance(jacobian(lambda q: point_mass_readings(q, positions), p, 1e-6), sigma)


def depth_bound(rho: float, b_over_r: float) -> tuple[float, float]:
    """(sigma_r / r, sigma_M / M) for a point mass from a pixel and its six neighbours at distance b << r, rho = |E|/sigma
    of one pixel's reading: rho_E = sqrt(7) rho, rho_G = sqrt(30) rho b/r."""
    inv_e = 1.0 / (7.0 * rho ** 2)
    inv_g = 1.0 / (30.0 * rho ** 2 * b_over_r ** 2)
    return math.sqrt(inv_e + inv_g), math.sqrt(16.0 * inv_e + 9.0 * inv_g)


def field_and_gradient(stencil_E, b: float):
    """E at the centre and the gradient d_k E_ij (k first) from the readings of `cross_stencil(b)`: the mean of the
    seven (exact to O(b^4) in vacuum, where the second derivatives sum to zero) and central differences."""
    E = np.asarray(stencil_E, dtype=float)
    grad = np.array([(E[1 + 2 * a] - E[2 + 2 * a]) / (2.0 * b) for a in range(3)])
    return E.mean(axis=0), grad


def range_from_field_and_gradient(E0, grad) -> float:
    """r = sqrt(15) |E| / |grad E| for a single point mass (|grad E| the norm of the rank-three tensor)."""
    return math.sqrt(15.0) * float(np.linalg.norm(E0)) / float(np.linalg.norm(grad))


def effective_body(masses, distances) -> tuple[float, float]:
    """(r_eff, M_eff) of the single mass whose field and gradient at the pixel equal those of masses on one line
    through it, all on the same side: r_eff = sum(M/r^3) / sum(M/r^4), M_eff = r_eff^3 sum(M/r^3)."""
    m = np.asarray(masses, dtype=float)
    r = np.asarray(distances, dtype=float)
    s3, s4 = float(np.sum(m / r ** 3)), float(np.sum(m / r ** 4))
    r_eff = s3 / s4
    return r_eff, r_eff ** 3 * s3


def curvature_snr(rho: float, b_over_r: float, n) -> float:
    """rho_H: the signal-to-noise ratio with which the six-neighbour stencil reads the second derivatives of a point
    mass's field in direction n (they enter through the diagonal slices d_k d_k E, with information b^4 / 2 sigma^2
    per unit norm): rho (b/r)^2 sqrt(43.5 + 67.5 sum_a n_a^4)."""
    n = np.asarray(n, dtype=float) / np.linalg.norm(n)
    return rho * b_over_r ** 2 * math.sqrt(43.5 + 67.5 * float(np.sum(n ** 4)))


def two_body_readings(params, positions) -> np.ndarray:
    """Readings of two equal masses M/2 at r(1 -+ sqrt(u)/2) along direction(theta, phi); params (ln M, ln r, u,
    theta, phi), u = (Delta/r)^2 >= 0."""
    lnM, lnr, u, theta, phi = params
    n = direction(theta, phi)
    r = math.exp(lnr)
    s = math.sqrt(max(u, 0.0))
    pos = np.atleast_2d(positions)
    E = (tidal.point_mass_tidal_tensor(pos, r * (1 - s / 2) * n, math.exp(lnM) / 2)
         + tidal.point_mass_tidal_tensor(pos, r * (1 + s / 2) * n, math.exp(lnM) / 2))
    return readings(E).ravel()


def two_body_covariance(mass, r, u, theta, phi, positions, sigma) -> np.ndarray:
    p = [math.log(mass), math.log(r), u, theta, phi]
    return covariance(jacobian(lambda q: two_body_readings(q, positions), p, [1e-6, 1e-6, 1e-7, 1e-6, 1e-6]), sigma)


def flyby_fields(mass: float, x0, v, times):
    """(E, B) at the pixel over time from a point mass at x0 + v t, to first order in v/c: the formulas of
    gravitomagnetic.electric_point and magnetic_point, evaluated for all times at once (the tests compare them)."""
    x = np.asarray(x0, dtype=float)[None] + np.outer(times, v)
    r = np.linalg.norm(x, axis=1)
    n = x / r[:, None]
    A = G * mass / r ** 3
    E = A[:, None, None] * (np.eye(3) - 3.0 * n[:, :, None] * n[:, None, :])
    a = np.cross(n, np.asarray(v, dtype=float))
    B = (3.0 * A / C_LIGHT)[:, None, None] * (n[:, :, None] * a[:, None, :] + a[:, :, None] * n[:, None, :])
    return E, B


def flyby_readings(params, times) -> np.ndarray:
    """One pixel's ten numbers over time (flyby_fields); params (ln M, x0 (3), v (3))."""
    E, B = flyby_fields(math.exp(params[0]), params[1:4], params[4:7], times)
    return readings(E, B).ravel()


def flyby_covariance(mass, x0, v, times, sigma) -> np.ndarray:
    p = np.concatenate([[math.log(mass)], x0, v])
    steps = np.concatenate([[1e-6], 1e-6 * np.linalg.norm(x0) * np.ones(3), 1e-6 * np.linalg.norm(v) * np.ones(3)])
    return covariance(jacobian(lambda q: flyby_readings(q, times), p, steps), sigma)


def magnetic_snr(mass, x0, v, times, sigma) -> float:
    """rho_B: the signal-to-noise ratio of the magnetic part of a flyby record."""
    _, B = flyby_fields(mass, x0, v, times)
    return float(np.linalg.norm(B)) / sigma


# --- the paper's example -------------------------------------------------------------------------------------------

EXAMPLE = {
    "f_wave": 100.0,                 # Hz
    "h": 1e-21,                      # strain, + polarization
    "wave_from": (-0.45, -0.35, 0.82),   # direction toward the source (unit after normalizing)
    "rotor_mass": 1.0,               # kg, each of two
    "rotor_separation": 0.12,        # m
    "rotor_distance": 3.0,           # m
    "rotor_direction": (math.cos(math.radians(30)), math.sin(math.radians(30)), 0.0),
    "rotor_axis": (0.0, 0.0, 1.0),
    "b": 0.5,                        # m: a pixel with six neighbours, an array one metre across
    "person_mass": 70.0,             # kg
    "person_speed": 1.4,             # m/s, across the line of sight
}


def example_geometry():
    e = EXAMPLE
    omega = 2.0 * math.pi * e["f_wave"]
    n_w = np.asarray(e["wave_from"]) / np.linalg.norm(e["wave_from"])
    k = -n_w
    xs = e["rotor_distance"] * np.asarray(e["rotor_direction"]) / np.linalg.norm(e["rotor_direction"])
    Q = rotor_quadrupole(e["rotor_mass"], e["rotor_separation"], e["rotor_axis"])
    return omega, k, xs, Q


def example_theta() -> np.ndarray:
    omega, k, xs, Q = example_geometry()
    return np.concatenate([[EXAMPLE["h"], 0.0, 0.0, 0.0], quadrupole_parameters(Q), xs])


def paper_numbers() -> dict:
    """Every number the draft quotes, computed here (tests/test_separation_noise.py checks each)."""
    e = EXAMPLE
    omega, k, xs, Q = example_geometry()
    spin = omega / 2.0
    out = {}
    # the two fields at the pixel
    Ew, Bw = wave_fields(k, e["h"], 0.0, omega, np.zeros((1, 3)))
    En, Bn = rotor_fields(np.zeros((1, 3)), xs, e["rotor_axis"], e["rotor_mass"], e["rotor_separation"], spin)
    out["E_wave"] = float(np.linalg.norm(Ew))
    out["E_rotor"] = float(np.linalg.norm(En))
    out["rotor_over_wave"] = out["E_rotor"] / out["E_wave"]
    out["rim_speed"] = spin * e["rotor_separation"] / 2.0
    out["rotor_B_over_E"] = float(np.linalg.norm(Bn)) / out["E_rotor"]
    out["kr"] = omega * e["rotor_distance"] / C_LIGHT
    # one pixel, E and B
    hp, hx = wave_bias(k, omega, En[0])
    out["leak_ignored_pixel"] = math.hypot(abs(hp), abs(hx)) / e["h"]
    # the rotor's own B leaks into the joint fit (its E is absorbed by the free near field)
    J = np.hstack([_wave_columns(k, omega, np.zeros((1, 3)), "EB"), _free_near_columns(1, "EB")])
    s = np.linalg.norm(J, axis=0)
    p = np.linalg.lstsq(J / s, as_real(readings(En, Bn)), rcond=None)[0] / s
    out["leak_rotor_B"] = math.hypot(math.hypot(p[0], p[1]), math.hypot(p[2], p[3])) / e["h"]
    # the array
    positions = cross_stencil(e["b"])
    theta = example_theta()
    for channels in ("E", "EB"):
        model = ArrayModel(k, omega, positions, channels)
        D, joint, _ = array_cost(model, theta)
        out[f"D_{channels}"] = D
        # what the wave costs the rotor: its moment (rms over the ten parameters) and its position
        Jn = np.delete(model.jacobian(theta), range(4), axis=1)
        near = covariance(Jn)
        out[f"rotor_moment_cost_{channels}"] = math.sqrt(np.trace(joint[4:14, 4:14]) / np.trace(near[:10, :10]))
        out[f"rotor_position_cost_{channels}"] = math.sqrt(np.trace(joint[14:, 14:]) / np.trace(near[10:, 10:]))
        if channels == "E":
            # leakage when the rotor is ignored: the array's wave fit to the rotor's field alone
            Ea, _ = rotor_fields(positions, xs, e["rotor_axis"], e["rotor_mass"], e["rotor_separation"], spin)
            hp, hx = wave_bias(k, omega, Ea, channels="E", positions=positions)
            out["leak_ignored_array_E"] = math.hypot(abs(hp), abs(hx)) / e["h"]
            # model error: the exact rotor fitted as a point quadrupole together with the wave (no noise)
            exact = as_real(readings(Ea)) + model.signal(np.concatenate([theta[:4], [0.0] * 10, xs]))
            fit = model.fit(exact, xs)
            out["leak_model_error"] = math.hypot(math.hypot(fit[0] - theta[0], fit[1]), math.hypot(fit[2], fit[3])) / e["h"]
            # the wave's signal-to-noise ratio rho (one pixel, E and B) at which that bias equals the array's
            # standard deviation in the same direction
            sigma_f = float(np.linalg.norm(as_real(readings(Ew, Bw))))          # rho = 1
            bias = (fit[:4] - theta[:4]) / e["h"]
            along = bias / np.linalg.norm(bias)
            error = math.sqrt(along @ joint[:4, :4] @ along) * sigma_f / e["h"]
            out["rho_model_error"] = error / float(np.linalg.norm(bias))
            # where the array, from E alone, overtakes the magnetic part (D_E = sqrt 2)
            lo, hi = 0.15, 0.45
            for _ in range(40):
                mid = 0.5 * (lo + hi)
                m = ArrayModel(k, omega, cross_stencil(mid * e["rotor_distance"]), "E")
                lo, hi = (mid, hi) if array_cost(m, theta)[0] > math.sqrt(2.0) else (lo, mid)
            out["b_over_r_equal"] = 0.5 * (lo + hi)
    # how the cost scales at b << r over orientations (position fitted, and known)
    rng = np.random.default_rng(20261117)
    small = 0.01
    pos = cross_stencil(small * e["rotor_distance"])
    fitted, known = [], []
    for _ in range(60):
        kk = rng.normal(size=3)
        kk /= np.linalg.norm(kk)
        ax = rng.normal(size=3)
        xx = e["rotor_distance"] * rng.normal(size=3)
        xx *= e["rotor_distance"] / np.linalg.norm(xx)
        th = np.concatenate([[1e-21, 0.0, 3e-22, 2e-22], quadrupole_parameters(rotor_quadrupole(1.0, 0.12, ax)), xx])
        m = ArrayModel(kk, omega, pos, "E")
        fitted.append(array_cost(m, th)[0] * small)
        known.append(array_cost(m, th, known_position=True)[0] * small)
    out["kappa_fitted"] = (float(np.min(fitted)), float(np.median(fitted)), float(np.max(fitted)))
    out["kappa_known"] = (float(np.min(known)), float(np.max(known)))
    # depth: the six-neighbour stencil at the example's b and r
    r = e["rotor_distance"]
    cov = depth_covariance(e["person_mass"], r, 1.1, 0.7, cross_stencil(e["b"]),
                           math.sqrt(6.0) * G * e["person_mass"] / r ** 3)
    out["depth_exact"] = math.sqrt(cov[1, 1])          # times rho
    out["mass_exact"] = math.sqrt(cov[0, 0])
    out["depth_closed"], out["mass_closed"] = depth_bound(1.0, e["b"] / r)
    spread = []
    for _ in range(200):                               # over directions (the curvature terms are anisotropic)
        v = rng.normal(size=3)
        v /= np.linalg.norm(v)
        cov = depth_covariance(e["person_mass"], r, math.acos(v[2]), math.atan2(v[1], v[0]), cross_stencil(e["b"]),
                               math.sqrt(6.0) * G * e["person_mass"] / r ** 3)
        spread.append(math.sqrt(cov[1, 1]))
    out["depth_range"] = (float(np.min(spread)), float(np.max(spread)))
    out["person_E"] = math.sqrt(6.0) * G * e["person_mass"] / r ** 3
    out["person_rhoB_per_rho"] = math.sqrt(3.0) * e["person_speed"] / C_LIGHT
    # two bodies on one line: rho_H / (rho (b/r)^2) over directions (sum n^4 from 1/3 to 1, 3/5 on average), and
    # the coefficient of the separation told from one body, Delta > 2 r / sqrt(rho_H) = coefficient (r^2/b) / sqrt(rho)
    out["rhoH_range"] = (math.sqrt(43.5 + 67.5 / 3.0), math.sqrt(43.5 + 67.5))
    out["rhoH_mean"] = math.sqrt(43.5 + 67.5 * 0.6)
    out["two_body_coefficient"] = (2.0 / math.sqrt(out["rhoH_range"][1]), 2.0 / math.sqrt(out["rhoH_range"][0]))
    return out
