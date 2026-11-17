"""What one pixel can and cannot identify (paper, Section VIII): the exact state of a moving body from W and its
rate of change; the general count of waves a point sensor of spin s separates (a Prony problem on the sky);
what no finite set of derivatives at one event can tell; which spectral matrices can come from a sky of waves; the
images of a lensed chirp, one at a time; and what one counted graviton says about where it came from.
"""
from __future__ import annotations

import math

import numpy as np

from .constants import G
from .pixel import STF, direction, moving_masses_W, null_vector, stars, vec5

C_LIGHT = 299792458.0

# --- a moving body, exactly, from W and its rate of change ------------------------------------------------------


def double_stars(W) -> tuple[np.ndarray, np.ndarray]:
    """The two double stars (unit vectors, propagation convention) of a type-D reading, each the mean of its pair."""
    s = stars(W)
    d = np.array([[np.linalg.norm(s[i] - s[j]) for j in range(4)] for i in range(4)])
    j = int(np.argmin(d[0, 1:])) + 1
    rest = [k for k in range(1, 4) if k != j]
    a, b = s[[0, j]].mean(axis=0), s[rest].mean(axis=0)
    return a / np.linalg.norm(a), b / np.linalg.norm(b)


def repeated_eigenvalue(W) -> complex:
    """The doubly repeated eigenvalue of a type-D reading, GM / R*^3 with R* the distance in the body's rest frame."""
    w = np.linalg.eigvals(np.asarray(W, dtype=complex))
    pairs = [(abs(w[i] - w[j]), (w[i] + w[j]) / 2) for i in range(3) for j in range(i + 1, 3)]
    return min(pairs, key=lambda t: t[0])[1]


def present_line(W) -> tuple[np.ndarray, np.ndarray]:
    """v_perp / c and the line to the body's present position (up to sign), from the two double stars at one
    instant: their half-sum is v_perp / c, their half-difference sqrt(1 - v_perp^2/c^2) times the unit line."""
    a, b = double_stars(W)
    v_perp = 0.5 * (a + b)
    half = 0.5 * (a - b)
    return v_perp, half / np.linalg.norm(half)


def moving_body_state(W, Wdot) -> dict:
    """Position now (from the pixel), velocity and rest mass of one body, exactly at any speed, from W and dW/dt at
    one pixel (velocity across the line of sight nonzero). The line turns at |v_perp| / r; the repeated eigenvalue
    falls as R*^-3, with R*^2 = gamma^2 (r^2 - |v x r|^2 / c^2) and |v x r| constant."""
    eps = 1e-6 / max(1e-300, float(np.abs(Wdot).max() / np.abs(W).max()))
    beta_perp, n0 = present_line(W)
    _, n1 = present_line(W + eps * Wdot)
    n1 = n1 if n1 @ n0 > 0 else -n1
    ndot = (n1 - n0) / eps
    if ndot @ beta_perp < 0:            # the line to the body turns toward its sideways velocity
        n0, ndot = -n0, -ndot
    v_perp = C_LIGHT * beta_perp
    r = np.linalg.norm(v_perp) / np.linalg.norm(ndot)
    w0 = repeated_eigenvalue(W).real
    w1 = repeated_eigenvalue(W + eps * Wdot).real
    wdot = (w1 - w0) / eps
    b2 = float(beta_perp @ beta_perp)
    rdot = -r * (1 - b2) * wdot / (3 * w0)
    v = v_perp + rdot * n0
    gamma = 1 / math.sqrt(1 - float(v @ v) / C_LIGHT**2)
    M = w0 * (gamma * r) ** 3 * (1 - b2) ** 1.5 / G
    return {"position": r * n0, "velocity": v, "mass": M}


def moving_body_readings(M, position, velocity, dt: float = 1e-6):
    """W and dW/dt at the origin of a body moving uniformly, by a central difference in time."""
    p, v = np.asarray(position, dtype=float), np.asarray(velocity, dtype=float)
    W = moving_masses_W([M], [p], [v])
    Wp = moving_masses_W([M], [p + v * dt], [v])
    Wm = moving_masses_W([M], [p - v * dt], [v])
    return W, (Wp - Wm) / (2 * dt)


# --- how many waves: a Prony problem on the sky -----------------------------------------------------------------


def moments(W) -> np.ndarray:
    """The five moments y_j = sum_a c_a z_a^j of W = sum_a c_a m(z_a) m(z_a)^T, m(z) = (1 - z^2, i(1 + z^2), -2z)."""
    W = np.asarray(W, dtype=complex)
    return np.array([
        (W[0, 0] - W[1, 1]) / 4 - 0.5j * W[0, 1],
        (1j * W[1, 2] - W[0, 2]) / 4,
        W[2, 2] / 4,
        (1j * W[1, 2] + W[0, 2]) / 4,
        (W[0, 0] - W[1, 1]) / 4 + 0.5j * W[0, 1],
    ])


def block_hankel(Y: np.ndarray, N: int) -> np.ndarray:
    """Rows (snapshot l, j), columns k: Y[l, j + k], j < D - N, k <= N. Y is (L, D) moments."""
    L, D = Y.shape
    return np.array([[Y[l, j + k] for k in range(N + 1)] for l in range(L) for j in range(D - N)])


def n_max(s: int, L: int) -> int:
    """The most waves a point sensor of spin s separates, generically, from L independent snapshots."""
    return (L * (2 * s + 1)) // (L + 1)


def prony(Y: np.ndarray, N: int, tol: float = 1e-9):
    """Directions (stereographic z) and amplitudes (L, N) of N sources from moments Y (L, D), or None when the block
    Hankel matrix has rank below N (the sources are then not determined)."""
    Y = np.atleast_2d(np.asarray(Y, dtype=complex))
    if Y.shape[1] - N < 1:
        return None
    H = block_hankel(Y, N)
    sv = np.linalg.svd(H, compute_uv=False)
    if len(sv) < N or sv[N - 1] < tol * sv[0]:
        return None
    _, _, Vh = np.linalg.svd(H)
    p = Vh[-1].conj()
    z = np.roots(p[::-1])
    V = np.vander(z, Y.shape[1], increasing=True).T            # (D, N)
    c = np.linalg.lstsq(V, np.asarray(Y, dtype=complex).T, rcond=None)[0].T
    return z, c


def readings_from_sources(z, c) -> np.ndarray:
    """W for each snapshot: sum_a c[l, a] m(z_a) m(z_a)^T."""
    out = []
    for row in np.atleast_2d(c):
        W = np.zeros((3, 3), dtype=complex)
        for za, ca in zip(z, row):
            m = null_vector(za)
            W += ca * np.outer(m, m)
        out.append(W)
    return np.array(out)


# --- what no finite set of derivatives can tell -----------------------------------------------------------------


def flat_pulse(u, tau: float, m: int):
    """f(u) = [1 - 2m (u/tau)^2m] exp[-(u/tau)^2m]: f(0) = 1, f^(j)(0) = 0 for 0 < j < 2m, and its integral and first
    moment vanish (it is the derivative of u exp[-(u/tau)^2m], and even), so the strain it implies is bounded."""
    x = (np.asarray(u, dtype=float) / tau) ** (2 * m)
    return (1 - 2 * m * x) * np.exp(-x)


def shell_density(n, E0, R: float, sigma0: float):
    """Surface density on a sphere of radius R whose interior tide is exactly E0 (a constant), sigma0 - 5R n.E0.n /
    (8 pi G); sigma0 keeps it positive."""
    return sigma0 - 5 * R * np.einsum("...i,ij,...j->...", n, E0, n) / (8 * math.pi * G)


def counterpropagating_pulses(t, y, E0, tau: float, m: int):
    """E and B at (t, y) of two plane pulses along +y and -y whose sum matches the shell's field E0 at the origin to
    order 2m - 1 in every derivative (c = 1 units of y / t)."""
    fp, fm = flat_pulse(t - y, tau, m), flat_pulse(t + y, tau, m)
    K = np.array([[0.0, 0.0, 1.0], [0.0, 0.0, 0.0], [-1.0, 0.0, 0.0]])   # [y]x : a -> y x a
    return 0.5 * E0 * (fp + fm), 0.5 * (K @ E0) * (fp - fm)


# --- which spectral matrices a sky of waves can make ------------------------------------------------------------


WITNESS = vec5(np.diag([1.0, -1.0, 0.0]) / math.sqrt(2.0))


def witness(C) -> float:
    """u^dagger C u / tr C for u = vec(diag(1, -1, 0)/sqrt 2): at most 1/2 for any incoherent sky of waves of one
    helicity (C = int p(n) v(n) v(n)^dagger, p >= 0), whatever positive-definite matrices allow."""
    C = np.asarray(C, dtype=complex)
    return float((WITNESS.conj() @ C @ WITNESS).real / np.trace(C).real)


def sky_covariance(directions, powers) -> np.ndarray:
    """C = sum_a p_a v_a v_a^dagger for waves of positive helicity from the given directions."""
    from .pixel import steering
    C = np.zeros((5, 5), dtype=complex)
    for k, p in zip(directions, powers):
        v = steering(k)
        C += p * np.outer(v, v.conj())
    return C


# --- lensed images of a chirp, one at a time --------------------------------------------------------------------


def lensed_chirp(times, directions, delays, f0: float, fdot: float, amplitudes=None):
    """W(t) at a pixel for images of one circularly polarized chirp, f(t) = f0 + fdot t, arriving from the given
    directions with the given delays (positive helicity only, so W = h(t) m m^T with h complex)."""
    from .pixel import null_frame
    amplitudes = np.ones(len(delays)) if amplitudes is None else np.asarray(amplitudes, dtype=float)
    W = np.zeros((len(times), 3, 3), dtype=complex)
    for k, dt, a in zip(directions, delays, amplitudes):
        m = null_frame(k)
        t = times - dt
        h = a * np.exp(-2j * math.pi * (f0 * t + 0.5 * fdot * t**2))
        W += h[:, None, None] * np.outer(m, m)[None]
    return W


def image_directions(times, W, t_centre: float, width: float, f_expected):
    """Directions of the images at one moment: a Gaussian window about t_centre, then, at each expected frequency,
    the Fourier component of W, a rank-one matrix whose null vector is the image's direction."""
    win = np.exp(-0.5 * ((times - t_centre) / width) ** 2)
    out = []
    for f in f_expected:
        Wf = np.einsum("t,tij->ij", win * np.exp(2j * math.pi * f * times), W)
        u = np.linalg.svd(Wf)[0][:, 0]
        out.append(direction(u))
    return np.array(out)


# --- what one counted graviton tells ----------------------------------------------------------------------------


def click_distribution(gamma, s: int = 2):
    """Probability density (per steradian) that a point counter with the coherent-state measurement of spin s
    clicks at angle gamma from the quantum's true direction: (2s + 1)/(4 pi) cos^(4s)(gamma / 2)."""
    return (2 * s + 1) / (4 * math.pi) * np.cos(np.asarray(gamma) / 2) ** (4 * s)


def bits_per_quantum(s: int) -> float:
    """Mutual information (bits) between a quantum's direction, uniform on the sky, and the click."""
    return math.log2(2 * s + 1) - 2 * s / ((2 * s + 1) * math.log(2))


def fisher_per_quantum(s: int) -> tuple[float, float]:
    """Fisher information per quantum about one angle of its direction: the measurement on the whole sky gives s,
    the best measurement of that one angle alone (the quantum Fisher information) 2s."""
    return float(s), float(2 * s)


def stf_basis() -> np.ndarray:
    return STF
