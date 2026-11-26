"""What one pixel knows: the algebra of the ten numbers (paper, Section III).

A pixel in vacuum records E and B, real, symmetric and trace-free. Put together as

    W = E + iB,

they are one complex symmetric trace-free 3x3 matrix: five complex numbers. Everything here follows from three facts.

- Observers act on W by complex rotations. A rotation of the pixel is W -> R W R^T with R real; a boost by rapidity
  eta along u is the same with R = exp(i eta u.L), an imaginary rotation (the Lorentz group is SO(3, C)). So the
  eigenvalues of W, and tr W^2, tr W^3, are the same for every observer.
- A plane wave is a perfect square. A wave travelling along k has W = c m m^T with m a complex null vector, m.m = 0,
  whose real and imaginary parts span the wave's plane; k = Re(i m x m*) / |m|^2 (`direction`).
- The four principal directions of the field (Petrov, Penrose; here "stars") are the roots of the quartic
  m(z)^T W m(z), m(z) = (1 - z^2, i(1 + z^2), -2z): one wave puts all four on its direction of travel; a body at rest
  puts two double stars at the line to it.

Results, each tested in tests/test_pixel.py:

1. Ten = four invariants + three angles + three velocities. A generic reading is W = P D P^T with P complex
   orthogonal; P = R0 exp(iK0) splits into a real rotation (the field's axes) and an imaginary one whose generator is
   the rapidity of the one frame in which the field is at rest (E and B commute). For a static scene that frame is the
   scene's, so the pixel reads its own velocity exactly (`polar`, `rest_frame_velocity`), and the eigenvalues stay
   real however it moves: complex ones mean that something in the scene moves or turns relative to the rest
   (`motion_alarm`). Light cannot do this: its field fixes its frame only up to a boost along, and a turn about, its
   own axis.
2. A moving body's sideways velocity, exactly at any speed: the midpoint of its two double stars is v_perp / c
   (`body_velocity`). Coming straight on it cannot be ranged, but its time to contact is 3 E_par / (dE_par/dt),
   since E grows as r^-3 whatever its sign (the form -3 E / Edot has the sign wrong).
3. Separating plane waves at one pixel: two at one instant (W has rank two; `two_waves`), three at one frequency (a
   pencil of the positive- and negative-frequency parts; `three_waves`), four over time with any waveforms (the
   readings span a hyperplane whose annihilating conic meets the null conic at the four directions; `four_waves`).
   For light: one, two, two.
4. The sky at one pixel, per frequency: 2(2s + 1)^2 + 2(4s + 1) numbers for a spin-s sensor (68 for gravity, 28 for
   light), with no mixing of brightness and circular polarization (`steering`, used in the tests).
5. Ranging a wave source. In the wave zone the oscillating part of W departs from rank one by s2/s1 = C/(kr)^2 at one
   instant (`ranging_constant`); over a cycle the positive- and negative-frequency parts depart by 2 tan^(+-2)(i/2)
   /(kr)^2, which gives kr without the inclination (`range_from_frequency_parts`); and their apparent directions
   differ by 8 |cot i| / kr, which gives kr out to about the signal-to-noise ratio (`range_from_helicity_split`).
6. Cramer-Rao bounds with white noise sigma on each of the ten components: one wave's direction to 1/rho per axis,
   rho = |W| / sigma (light: sqrt 2 / rho); the speedometer to sigma / (sqrt 2 |lambda_b - lambda_c|) per component.

Every result used here is confirmed independently in the tests.
"""
from __future__ import annotations

import math

import numpy as np
from scipy.linalg import expm, logm, null_space

from .constants import G, c as C_LIGHT

# --- the five complex coordinates ----------------------------------------------------------------------------------

STF = np.array([
    np.diag([1.0, -1.0, 0.0]) / math.sqrt(2.0),
    np.diag([1.0, 1.0, -2.0]) / math.sqrt(6.0),
    np.array([[0, 1, 0], [1, 0, 0], [0, 0, 0]]) / math.sqrt(2.0),
    np.array([[0, 0, 1], [0, 0, 0], [1, 0, 0]]) / math.sqrt(2.0),
    np.array([[0, 0, 0], [0, 0, 1], [0, 1, 0]]) / math.sqrt(2.0),
], dtype=float)
"""An orthonormal basis of real symmetric trace-free matrices: tr(T_a T_b) = delta_ab."""


def weyl(E, B) -> np.ndarray:
    return np.asarray(E, dtype=float) + 1j * np.asarray(B, dtype=float)


def vec5(W) -> np.ndarray:
    """The five coordinates of a symmetric trace-free matrix (complex if W is)."""
    return np.einsum("aij,...ij->...a", STF, W)


def mat5(v) -> np.ndarray:
    return np.einsum("...a,aij->...ij", v, STF)


# --- invariants and type -------------------------------------------------------------------------------------------

def invariants(W):
    """(I, J) = (tr W^2, tr W^3): the same for every observer."""
    W = np.asarray(W)
    W2 = W @ W
    return complex(np.trace(W2)), complex(np.trace(W2 @ W))


def speciality(W) -> complex:
    """1 - 6 J^2 / I^3: zero when W has a repeated eigenvalue (types D and II); nan for types N and III (I = J = 0)."""
    I, J = invariants(W)
    if abs(I) == 0:
        return complex("nan")
    return 1.0 - 6.0 * J * J / I ** 3


def petrov(W, tol: float = 1e-7) -> str:
    """Petrov type of a reading: O, N, III, D, II or I (tolerance relative to |W|)."""
    W = np.asarray(W, dtype=complex)
    scale = np.linalg.norm(W)
    if scale == 0:
        return "O"
    Wn = W / scale
    W2 = Wn @ Wn
    if np.linalg.norm(W2) < tol:
        return "N"
    if np.linalg.norm(W2 @ Wn) < tol:
        return "III"
    if abs(speciality(Wn)) > math.sqrt(tol):
        return "I"
    # a repeated eigenvalue: D if W is diagonalizable (its minimal polynomial is quadratic), II otherwise
    lam = np.linalg.eigvals(Wn)
    i, j = min(((a, b) for a in range(3) for b in range(a + 1, 3)), key=lambda p: abs(lam[p[0]] - lam[p[1]]))
    mu, other = 0.5 * (lam[i] + lam[j]), lam[3 - i - j]
    residual = (Wn - mu * np.eye(3)) @ (Wn - other * np.eye(3))
    return "D" if np.linalg.norm(residual) < math.sqrt(tol) else "II"


# --- null vectors and directions -----------------------------------------------------------------------------------

def null_vector(z: complex) -> np.ndarray:
    """m(z) = (1 - z^2, i(1 + z^2), -2z), the null vector with stereographic coordinate z (m.m = 0)."""
    return np.array([1 - z * z, 1j * (1 + z * z), -2 * z])


def direction(m) -> np.ndarray:
    """The unit propagation direction carried by a complex null vector: Re(i m x m*) / |m|^2."""
    m = np.asarray(m, dtype=complex)
    q = np.real(1j * np.cross(m, m.conj())) / np.vdot(m, m).real
    return q / np.linalg.norm(q)


def null_frame(k):
    """A unit null vector m = (e1 + i e2)/sqrt 2 with e1 x e2 = k (so direction(m) = k)."""
    k = np.asarray(k, dtype=float) / np.linalg.norm(k)
    a = np.array([1.0, 0, 0]) if abs(k[0]) < 0.9 else np.array([0, 1.0, 0])
    e1 = np.cross(a, k)
    e1 /= np.linalg.norm(e1)
    e2 = np.cross(k, e1)
    return (e1 + 1j * e2) / math.sqrt(2.0)


def steering(k) -> np.ndarray:
    """The unit five-vector of the field of a wave travelling along k, in the positive-helicity sector: vec5(m m^T)."""
    m = null_frame(k)
    return vec5(np.outer(m, m))


_TURN = expm(np.array([[0.0, -0.37, 0.21], [0.37, 0.0, -0.53], [-0.21, 0.53, 0.0]]))
"""A fixed, unremarkable rotation, used so that no root of the star quartic falls at z = infinity."""


def _quartic_roots_directions(A) -> np.ndarray:
    """Directions of the roots of m(z)^T A m(z) (degree 4 in z), solved in a turned frame."""
    At = _TURN.T @ np.asarray(A, dtype=complex) @ _TURN
    z = np.polynomial.Polynomial([0, 1])
    m = [1 - z ** 2, 1j * (1 + z ** 2), -2 * z]
    poly = sum(m[i] * At[i, j] * m[j] for i in range(3) for j in range(3))
    roots = list(poly.roots())
    out = [direction(null_vector(r)) for r in roots]
    while len(out) < 4:                      # a root at infinity: m ~ (-1, i, 0)
        out.append(direction(np.array([-1.0, 1j, 0.0])))
    return np.array([_TURN @ d for d in out])


def _boost(v) -> np.ndarray:
    """The complex rotation L = exp(i eta [u]x) that carries a field from the rest frame of a body moving with
    velocity v (m/s) into the frame in which it moves: W = L W0 L^T, F = L F0."""
    v = np.asarray(v, dtype=float)
    speed = np.linalg.norm(v)
    if speed == 0:
        return np.eye(3, dtype=complex)
    u = v / speed
    eta = math.atanh(speed / C_LIGHT)
    K = np.array([[0.0, -u[2], u[1]], [u[2], 0.0, -u[0]], [-u[1], u[0], 0.0]])
    # exp(theta K) = 1 + sin(theta) K + (1 - cos(theta)) K^2 (K^3 = -K), at theta = i eta
    return np.eye(3) + 1j * math.sinh(eta) * K + (1 - math.cosh(eta)) * (K @ K)


def _rest_separation(R, v) -> np.ndarray:
    """The separation from a body to the pixel in the body's rest frame, from R between their present positions."""
    v = np.asarray(v, dtype=float)
    speed = np.linalg.norm(v)
    if speed == 0:
        return np.asarray(R, dtype=float)
    u = v / speed
    gamma = 1 / math.sqrt(1 - (speed / C_LIGHT) ** 2)
    return R + (gamma - 1) * (R @ u) * u


def moving_masses_W(masses, positions, velocities, x=(0.0, 0.0, 0.0)) -> np.ndarray:
    """W at x of point masses (kg) moving uniformly, from their present positions (m) and velocities (m/s): each
    one's static tide at the rest-frame separation, carried by the boost. Exact in linearized gravity, and equal to
    the curvature of curvature.boosted_masses_metric (tests)."""
    x = np.asarray(x, dtype=float)
    W = np.zeros((3, 3), dtype=complex)
    for M, p, v in zip(masses, positions, velocities):
        Rp = _rest_separation(x - np.asarray(p, dtype=float), v)
        r = np.linalg.norm(Rp)
        n = Rp / r
        L = _boost(v)
        W += L @ (G * M / r ** 3 * (np.eye(3) - 3 * np.outer(n, n))) @ L.T
    return W


def moving_charges_F(charges, positions, velocities, x=(0.0, 0.0, 0.0)) -> np.ndarray:
    """F = E + icB at x of point charges (in units with E = q R / r^3) moving uniformly: each one's Coulomb field at
    the rest-frame separation, carried by the same boost; equal to Heaviside's field of a uniformly moving charge."""
    x = np.asarray(x, dtype=float)
    F = np.zeros(3, dtype=complex)
    for q, p, v in zip(charges, positions, velocities):
        Rp = _rest_separation(x - np.asarray(p, dtype=float), v)
        F += _boost(v) @ (q * Rp / np.linalg.norm(Rp) ** 3)
    return F


def stars(W) -> np.ndarray:
    """The four principal directions of the field (unit vectors, propagation convention): roots of m^T W m."""
    return _quartic_roots_directions(W)


def light_stars(F) -> np.ndarray:
    """Light's two principal directions, in the same convention: roots of m(z) . F = 0 (degree 2 in z), with
    F = E + i c B. A charge at rest gives the two ends of its line of force; a plane wave a double star on its
    direction of travel."""
    Ft = _TURN.T @ np.asarray(F, dtype=complex)
    z = np.polynomial.Polynomial([0, 1])
    m = [1 - z ** 2, 1j * (1 + z ** 2), -2 * z]
    roots = list(sum(m[i] * Ft[i] for i in range(3)).roots())
    out = [direction(null_vector(r)) for r in roots]
    while len(out) < 2:
        out.append(direction(np.array([-1.0, 1j, 0.0])))
    return np.array([_TURN @ d for d in out])


# --- result 1: ten = four + three + three --------------------------------------------------------------------------

def _axial(A) -> np.ndarray:
    return np.array([A[2, 1], A[0, 2], A[1, 0]])


def polar(W):
    """W = P diag(w) P^T with P = R0 exp(i K0) complex orthogonal: returns (w, R0, theta), the complex eigenvalues,
    the real rotation to the field's axes and the rapidity vector theta = R0 axial(K0) of its rest frame, in the
    pixel's axes. Needs three distinct eigenvalues (Petrov type I, or a static scene seen in motion with a triaxial
    tide); for a degenerate pair the boost along the pair's axis is not determined."""
    W = np.asarray(W, dtype=complex)
    w, P = np.linalg.eig(W)
    norms = np.sqrt(np.einsum("ij,ij->j", P, P))
    if np.min(np.abs(norms)) < 1e-9:
        raise ValueError("W is not diagonalizable by a complex rotation (a null eigenvector): type N, III or II")
    P = P / norms
    if np.linalg.det(P).real < 0:
        P[:, 0] *= -1
    H = P.conj().T @ P                         # = exp(2 i K0), Hermitian and positive
    K0 = np.real(logm(H) / 2j)
    K0 = 0.5 * (K0 - K0.T)
    R0 = np.real(P @ expm(-1j * K0))
    return w, R0, R0 @ _axial(K0)


def rest_frame_velocity(W) -> np.ndarray:
    """Velocity (in units of c) of the frame in which the field is at rest, relative to the pixel. For a static
    scene it is the scene's velocity relative to the pixel, minus the pixel's own."""
    _, _, theta = polar(W)
    eta = np.linalg.norm(theta)
    if eta == 0:
        return np.zeros(3)
    return math.tanh(eta) * theta / eta


def motion_alarm(W) -> float:
    """max |Im w| / max |w| over the eigenvalues: zero for any static scene however the pixel moves."""
    w = np.linalg.eigvals(np.asarray(W, dtype=complex))
    return float(np.max(np.abs(w.imag)) / np.max(np.abs(w)))


# --- result 2: a moving body ---------------------------------------------------------------------------------------

def body_velocity(W) -> np.ndarray:
    """v_perp / c of a single body, exactly at any speed: the midpoint of its two double stars (W of type D).
    v_perp is the body's velocity across the line from it to the pixel (present position)."""
    s = stars(W)
    d = np.array([[np.linalg.norm(s[i] - s[j]) for j in range(4)] for i in range(4)])
    j = int(np.argmin(d[0, 1:])) + 1
    rest = [k for k in range(1, 4) if k != j]
    a, b = s[[0, j]].mean(axis=0), s[rest].mean(axis=0)
    return 0.5 * (a / np.linalg.norm(a) + b / np.linalg.norm(b))


def time_to_contact(E_par: float, Edot_par: float) -> float:
    """-r / (dr/dt) for a body coming straight on, from its tide along the line and the rate it changes: since
    E_par is proportional to r^-3, d ln E / dt = -3 rdot / r and the time to contact is 3 E / Edot."""
    return 3.0 * E_par / Edot_par


# --- result 3: separating waves ------------------------------------------------------------------------------------

def _null_in_plane(x, y):
    """The two null vectors x + t y."""
    return [x + t * y for t in np.roots([y @ y, 2 * (x @ y), x @ x])]


def two_waves(W):
    """Two plane waves crossing at one instant: their propagation directions, complex amplitudes c_a and unit null
    vectors m_a, with W = sum c_a m_a m_a^T."""
    W = np.asarray(W, dtype=complex)
    v = np.linalg.svd(W)[2].conj()[-1]                      # W v = 0, v = m1 x m2
    X = null_space(v[None, :])                              # v . x = 0 (bilinear)
    ms = [m / np.linalg.norm(m) for m in _null_in_plane(X[:, 0], X[:, 1])]
    basis = np.stack([np.outer(m, m).ravel() for m in ms], axis=1)
    amps = np.linalg.lstsq(basis, W.ravel(), rcond=None)[0]
    return np.array([direction(m) for m in ms]), amps, ms


def three_waves(W_plus, W_minus):
    """Three monochromatic waves at one frequency from the parts of W varying as exp(-i w t) and exp(+i w t):
    their directions and the pencil's roots lambda_a = alpha_a / beta_a (|lambda_a| = tan^(+-4)(i_a / 2) for a
    circular binary at inclination i_a)."""
    lam = np.linalg.eigvals(np.linalg.solve(W_minus, W_plus))
    nulls = [np.linalg.svd(W_plus - l * W_minus)[2].conj()[-1] for l in lam]
    ms = [np.cross(nulls[1], nulls[2]), np.cross(nulls[2], nulls[0]), np.cross(nulls[0], nulls[1])]
    return np.array([direction(m) for m in ms]), lam


def four_waves(readings):
    """Four plane waves from fixed directions with any waveforms, from a time series of readings W(t) (T x 3 x 3):
    the readings span a hyperplane of C^5; its annihilator A gives the conic m^T A m = 0, which meets the null conic
    at the four directions."""
    V = vec5(np.asarray(readings, dtype=complex))
    a = np.linalg.svd(V)[2][-1].conj()                      # V a = 0
    return _quartic_roots_directions(mat5(a))


def annihilator(readings) -> np.ndarray:
    """The matrix A with tr(A W) = 0 for every reading (complex symmetric, trace-free, unit norm): the conic of
    four_waves. Its m^T A m vanishes on the sky exactly at the waves' directions of travel."""
    V = vec5(np.asarray(readings, dtype=complex))
    return mat5(np.linalg.svd(V)[2][-1].conj())


def light_two_waves(readings) -> np.ndarray:
    """Light's limit over time: two plane waves with any waveforms, from readings F(t) = E + icB (T x 3). The
    readings span a plane of C^3; its annihilator a has m . a = 0 at the two directions of travel, which are
    light's stars of a (light_stars)."""
    a = np.linalg.svd(np.asarray(readings, dtype=complex))[2][-1].conj()
    return light_stars(a)


def five_sources(S_I, S_V):
    """Five uncorrelated sources from the brightness and circular-polarization blocks of one pixel's spectral matrix,
    S_I = sum I_a q_a q_a^H and S_V = sum V_a q_a q_a^H (q_a = steering of source a), when their circular fractions
    V_a / I_a differ: whiten S_I, diagonalize S_V in the whitened space; the eigenvalues are V_a / I_a and the
    columns of S_I W V_A are sqrt(I_a) q_a up to phase. Returns (directions, I, V/I)."""
    d, U = np.linalg.eigh(S_I)
    Wh = U / np.sqrt(d)
    frac, VA = np.linalg.eigh(Wh.conj().T @ S_V @ Wh)
    C = S_I @ Wh @ VA
    I = np.sum(np.abs(C) ** 2, axis=0)
    dirs = [direction(np.linalg.svd(mat5(C[:, a]))[0][:, 0]) for a in range(C.shape[1])]
    return np.array(dirs), I, frac


# --- result 5: ranging a wave source -------------------------------------------------------------------------------

def ranging_constant(iota: float, theta: float) -> float:
    """C(i, theta) in s2/s1 = C/(kr)^2 for the oscillating part of W of a rotating mass quadrupole seen at inclination
    i, at wave phase theta = omega (t - r/c) (a closed form; checked in the tests against the binary model)."""
    ci2, ct, st = math.cos(iota) ** 2, math.cos(theta), math.sin(theta)
    num = 2 * math.sin(iota) ** 2 * math.sqrt(((1 - 3 * ci2) * ct * ct - 4 * ci2 * st * st) ** 2
                                              + 4 * ci2 * st * st * ct * ct)
    den = (1 + ci2) ** 2 * ct * ct + 4 * ci2 * st * st
    return num / den


def frequency_ratios(iota: float):
    """(kr)^2 s2/s1 of the positive- and negative-frequency parts: 2 tan^2(i/2) and 2 cot^2(i/2)."""
    t = math.tan(iota / 2)
    return 2 * t * t, 2 / (t * t)


def helicity_split(iota: float) -> float:
    """kr times the angle between the directions read from the two frequency parts: 8 |cot i| (to first order)."""
    return 8 / abs(math.tan(iota))


def frequency_parts(times, readings, omega: float):
    """(W_plus, W_minus) with W(t) = W_plus exp(-i omega t) + W_minus exp(+i omega t) + ..., over whole cycles."""
    times = np.asarray(times, dtype=float)
    R = np.asarray(readings, dtype=complex)
    Wp = np.einsum("t,tij->ij", np.exp(1j * omega * times), R) / len(times)
    Wm = np.einsum("t,tij->ij", np.exp(-1j * omega * times), R) / len(times)
    return Wp, Wm


def range_from_frequency_parts(W_plus, W_minus) -> float:
    """kr = sqrt(2 sqrt(s1(W+) s1(W-)) / s2(W+)), with no knowledge of the inclination."""
    sp = np.linalg.svd(W_plus, compute_uv=False)
    sm = np.linalg.svd(W_minus, compute_uv=False)
    return math.sqrt(2 * math.sqrt(sp[0] * sm[0]) / sp[1])


def range_from_helicity_split(W_plus, W_minus, iota: float) -> float:
    """kr = 8 |cot i| / angle(k+, k-), the directions read from the rank-one parts of the two frequency parts."""
    kp = direction(np.linalg.svd(W_plus)[0][:, 0])
    km = direction(np.linalg.svd(W_minus)[0][:, 0])
    return helicity_split(iota) / math.acos(min(1.0, float(kp @ km)))


# --- result 6: Cramer-Rao bounds -----------------------------------------------------------------------------------

def direction_bound(rho: float, spin: int = 2) -> float:
    """One standard deviation of each angle of one plane wave's direction, rho = |field| / sigma: sqrt(2/s) / rho."""
    return math.sqrt(2.0 / spin) / rho


def speedometer_bound(eigenvalues, sigma: float):
    """One standard deviation of each velocity component (units of c), in the principal axes of a static tide with
    eigenvalues lambda_a: sigma / (sqrt 2 |lambda_b - lambda_c|), (a, b, c) cyclic; inf when lambda_b = lambda_c."""
    l = np.asarray(eigenvalues, dtype=float)
    out = []
    for a, b, c_ in ((0, 1, 2), (1, 2, 0), (2, 0, 1)):
        gap = abs(l[b] - l[c_])
        out.append(math.inf if gap == 0 else sigma / (math.sqrt(2.0) * gap))
    return np.array(out)
