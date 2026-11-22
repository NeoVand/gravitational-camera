"""What a passing mass leaves in a body: the impulse approximation, its moments, and a check against the full motion.

The kick. A point mass mu flies past a body on a straight line at speed V, fast enough that the body's parts do not
move meanwhile. A part whose projection on the plane across the path is s, the path crossing that plane at b, is
pulled towards the path by G mu |b - s| / (|b - s|^2 + z^2)^(3/2) at the moment the mass is a distance z along it
from there; integrated over the time z / V, that is the velocity

    Delta v(s) = C (b - s) / |b - s|^2,        C = 2 G mu / V,

and the body gains

    Delta E(b) = (C^2 / 2) F(b),        F(b) = int Sigma(s) / |b - s|^2 d^2s,

Sigma the mass per area projected along the path. Its momentum changes by Delta P = C int Sigma (b - s) / |b - s|^2
d^2s, and the recoil of the body as a whole takes |Delta P|^2 / 2M of the energy; the rest is internal. In complex
numbers, z for s, (b - s) / |b - s|^2 = 1 / conj(b - s) and 1 / |b - s|^2 = 1 / [(b - z) conj(b - z)], so for |b| beyond
the body

    F(b) = sum_(p,q >= 0) m_pq b^-(p+1) conj(b)^-(q+1),        m_pq = int Sigma z^p conj(z)^q d^2s,
    Delta P = C sum_(q >= 0) m_0q conj(b)^-(q+1):

the term (p, q) of F varies as |b|^-(p+q+2) e^(i (q-p) phi), phi the angle of b, so F on two circles of impact points
returns every m_pq of low order (a Fourier series in phi, then a fit in powers of 1 / |b|^2); the momentum knows only
the moments m_0q = conj of int Sigma z^q, which are harmonic, and two bodies that have the same harmonic moments
and different m_11 = int Sigma |s|^2 receive the same Delta P and different Delta E. A point mass replaced by a ring
of its mass about its place is such a pair: the ring's two-dimensional field outside it is the point's.

A round body. The mean of 1 / |b - s|^2 over the circle |s| = sigma < |b| is 1 / (b^2 - sigma^2), and a thin shell of
unit mass and radius r projects to Sigma = 1 / (2 pi r sqrt(r^2 - sigma^2)), so for b > r

    F_shell(b) = int_0^r sigma d sigma / [r sqrt(r^2 - sigma^2) (b^2 - sigma^2)] = arcsin(r / b) / (r sqrt(b^2 - r^2)),

and, expanding, F(b) = sum_(p >= 0) [(2p)!! / (2p+1)!!] b^-(2p+2) int rho r^(2p) dV = M / b^2 + (2/3) M <r^2> / b^4 +
(8/15) M <r^4> / b^6 + ... (the coefficients are those of arcsin(u) / sqrt(1 - u^2)). For the recoil, the mean of
(b - s) / |b - s|^2 over a circle inside |b| is b / |b|^2 (Gauss's law in the plane), so Delta P = C M b / b^2, the
recoil takes M C^2 / 2 b^2, which is the first term of the series, and the internal energy is

    E(b) = (C^2 / 2) [F(b) - M / b^2] = (M C^2 / 3) <r^2> / b^4 + (4 M C^2 / 15) <r^4> / b^6 + ...

The twins of Fig. ladder (readings.ladder_pair): A, mass M on a shell of radius R / sqrt 2; B, M/2 at the centre and
M/2 on a shell at R. Their <r^2> are the same, R^2 / 2, and their <r^4> are R^4 / 4 and R^4 / 2, so E_B - E_A -> M C^2
R^4 / 15 b^6 far away. In units of M C^2 / 2 R^2 their internal energies at b = 1.5 R are 0.0803 and 0.1041: B takes 30
per cent more (29.6), and 76, 13 and 4.9 per cent more at b = 1.2, 2 and 3 R.

The full motion. A mass mu = 1e-3 M sent past each twin, made of free particles at rest (512 on each shell,
on the points of response.sphere_quadrature), integrated with every pull between the mass and the particles (DOP853):
the internal energy the particles take approaches the formula as 1 / V^2, and the energy the mass loses, kinetic plus
the change of its potential energy among the particles, so carried to large distance, is the energy they gain. Units
G = M = R = 1 there.

How much. The energies left by a mass held at the points outside a sphere of radius R_c, or by paths that miss it,
hold every moment int rho r^(l+2j) Y_lm dV, (n+1)(n+2)/2 of total degree n; the bits they hold grow as the fourth
power of ln SNR, against the cube for the field at one time (hair.hair_bits), with a coefficient below the naive
1 / 24 Lam^3 because radial powers that fall from the same radius are told apart only at a binomial price (the
section "how many bits a second reading holds" below).

Tested in tests/test_passing.py.
"""
from __future__ import annotations

import math

import numpy as np
from scipy.integrate import solve_ivp

from .readings import ladder_pair
from .response import sphere_quadrature

# --- a round body ---------------------------------------------------------------------------------------------------


def shell_F(b: float, r: float, m: float = 1.0) -> float:
    """F(b) for a thin shell of mass m and radius r, b > r: m arcsin(r/b) / (r sqrt(b^2 - r^2)); m / b^2 for r = 0."""
    if r == 0.0:
        return m / b**2
    return m * math.asin(r / b) / (r * math.sqrt(b * b - r * r))


def body_F(shells, b: float) -> float:
    """F(b) for a round body given as (mass, radius) thin shells, a radius of zero being a mass at the centre."""
    return sum(shell_F(b, r, m) for m, r in shells)


def shell_F_by_quadrature(b: float, r: float, m: float = 1.0, n_theta: int = 64, n_phi: int = 256) -> float:
    """The same by direct integration over the shell, independent of the closed form: (m / 4 pi) int dOmega / |b -
    s|^2, s = r sin(theta) (cos phi, sin phi) the projection of the point at (theta, phi) on the plane across the
    path (the z axis), b on the x axis. Gauss-Legendre in theta over each hemisphere, the trapezoid in phi."""
    t, w = np.polynomial.legendre.leggauss(n_theta)
    theta = 0.25 * math.pi * (t + 1.0)                                  # 0 .. pi/2; the other half is the same
    wt = 0.25 * math.pi * w * np.sin(theta) * 2.0
    phi = np.arange(n_phi) * 2.0 * math.pi / n_phi
    sigma = r * np.sin(theta)[:, None]
    inv = 1.0 / (b * b - 2.0 * b * sigma * np.cos(phi)[None, :] + sigma**2)
    return float(m / (4.0 * math.pi) * np.sum(wt[:, None] * inv) * 2.0 * math.pi / n_phi)


def body_F_by_quadrature(shells, b: float, **kw) -> float:
    return sum(shell_F_by_quadrature(b, r, m, **kw) for m, r in shells)


def series_coefficient(p: int) -> float:
    """(2p)!! / (2p+1)!!: 1, 2/3, 8/15, 16/35, ..."""
    c = 1.0
    for k in range(1, p + 1):
        c *= 2 * k / (2 * k + 1)
    return c


def radial_moment(shells, p: int) -> float:
    """int rho r^(2p) dV of a body of thin shells."""
    return sum(m * r ** (2 * p) for m, r in shells)


def body_F_by_series(shells, b: float, tol: float = 1e-17, p_max: int = 5000) -> float:
    """F(b) = sum_p [(2p)!! / (2p+1)!!] b^-(2p+2) int rho r^(2p) dV, summed until a term falls below tol of the sum;
    independent of the other two ways."""
    total, c = 0.0, 1.0
    for p in range(p_max):
        if p:
            c *= 2 * p / (2 * p + 1)
        term = c * radial_moment(shells, p) / b ** (2 * p + 2)
        total += term
        if term < tol * total:
            return total
    raise RuntimeError("the series did not converge: b inside the body?")


def mass(shells) -> float:
    return sum(m for m, _ in shells)


def recoil_F(shells, b: float) -> float:
    """The part of F that goes into the recoil of a round body, |Delta P|^2 / (M C^2) = M / b^2: Delta P = C M b / b^2
    by Gauss's law in the plane."""
    return mass(shells) / b**2


def internal_F(shells, b: float) -> float:
    """F(b) - M / b^2: the internal energy per C^2 / 2."""
    return body_F(shells, b) - recoil_F(shells, b)


def internal_energy(shells, b: float, C: float) -> float:
    """The internal energy left in a round body: (C^2 / 2) [F(b) - M / b^2]."""
    return 0.5 * C * C * internal_F(shells, b)


# --- the twins ------------------------------------------------------------------------------------------------------


def twins(M: float = 1.0, R: float = 1.0) -> tuple[list, list]:
    """The pair of Fig. ladder (readings.ladder_pair): A, M on a shell at R / sqrt 2; B, M/2 at the centre and M/2 on
    a shell at R."""
    return ladder_pair(M, R)


def twin_energies(b: float) -> tuple[float, float]:
    """The internal energies of A and B for a pass at b (units of R), in units of M C^2 / 2 R^2: R^2 [F / M - 1 /
    b^2]. At b = 1.5 they are 0.0803 and 0.1041."""
    a, bb = twins()
    return internal_F(a, b), internal_F(bb, b)


def twin_excess(b: float) -> float:
    """E_B / E_A - 1: 0.76, 0.296, 0.13, 0.049 at b = 1.2, 1.5, 2, 3 R."""
    ea, eb = twin_energies(b)
    return eb / ea - 1.0


def twin_far_difference(b: float) -> float:
    """The far limit of E_B - E_A, M C^2 R^4 / 15 b^6, in units of M C^2 / 2 R^2: (2/15) (R / b)^6."""
    return 2.0 / 15.0 / b**6


# --- a body in the plane --------------------------------------------------------------------------------------------


def planar_F(masses, z, b):
    """F(b) = sum m / |b - z|^2 for point masses at the complex places z of the plane across the path; b complex,
    or an array of them."""
    m, z = np.asarray(masses, dtype=float), np.asarray(z, dtype=complex)
    b = np.asarray(b, dtype=complex)
    return np.sum(m / np.abs(b[..., None] - z) ** 2, axis=-1)


def planar_kick(masses, z, b):
    """Delta P / C = sum m (b - z) / |b - z|^2, as a complex number (x + i y)."""
    m, z = np.asarray(masses, dtype=float), np.asarray(z, dtype=complex)
    b = np.asarray(b, dtype=complex)
    d = b[..., None] - z
    return np.sum(m * d / np.abs(d) ** 2, axis=-1)


def complex_moments(masses, z, order: int = 3) -> dict:
    """m_pq = sum m z^p conj(z)^q for p + q <= order."""
    m, z = np.asarray(masses, dtype=float), np.asarray(z, dtype=complex)
    return {(p, q): complex(np.sum(m * z**p * np.conj(z) ** q))
            for p in range(order + 1) for q in range(order + 1 - p)}


def F_from_moments(moments: dict, b):
    """sum m_pq b^-(p+1) conj(b)^-(q+1) = sum m_pq |b|^-(p+q+2) e^(i (q-p) phi) over the moments given."""
    b = np.asarray(b, dtype=complex)
    return sum(v * b ** -(p + 1) * np.conj(b) ** -(q + 1) for (p, q), v in moments.items())


def kick_from_harmonic_moments(moments: dict, b):
    """Delta P / C = sum_q m_0q conj(b)^-(q+1): the moments with p = 0 alone."""
    b = np.asarray(b, dtype=complex)
    return sum(v * np.conj(b) ** -(q + 1) for (p, q), v in moments.items() if p == 0)


def moments_from_passes(F, radii, order: int = 3, n_angles: int = 64) -> dict:
    """The m_pq, p + q <= order, from F sampled on circles of impact points of the given radii (outside the body):
    for each n = q - p the Fourier coefficient f_n(|b|) = sum over q - p = n of m_pq |b|^-(p+q+2), and in it a fit of
    as many powers |b|^-(|n| + 2 + 2j), j = 0, 1, ..., as there are circles. The error is that of the next power left
    out: it falls as (size / |b|)^2 for each circle more distant."""
    radii = np.asarray(radii, dtype=float)
    phi = np.arange(n_angles) * 2.0 * math.pi / n_angles
    samples = np.array([F(rho * np.exp(1j * phi)) for rho in radii])          # (circles, angles)
    out = {}
    for n in range(-order, order + 1):
        f = samples @ np.exp(-1j * n * phi) / n_angles
        powers = abs(n) + 2 + 2 * np.arange(len(radii))
        c = np.linalg.solve(radii[:, None] ** -powers[None, :].astype(float), f)
        for j, s in enumerate(powers - 2):
            if s <= order:
                out[((s - n) // 2, (s + n) // 2)] = complex(c[j])
    return out


def ring(m: float, centre: complex, radius: float, n: int = 64) -> tuple[np.ndarray, np.ndarray]:
    """A ring of mass m about the complex place centre, as n equal points: its harmonic moments sum m z^q are the
    point's, m centre^q, for q < n."""
    t = np.arange(n) * 2.0 * math.pi / n
    return np.full(n, m / n), centre + radius * np.exp(1j * t)


# --- the full motion ------------------------------------------------------------------------------------------------


def particles(shells, n_mu: int = 16, n_phi: int = 32) -> tuple[np.ndarray, np.ndarray]:
    """A round body of thin shells as free particles at rest: each shell on the n_mu n_phi points of
    response.sphere_quadrature (z the axis of the path), with masses in proportion to the weights; a shell of radius
    zero, one particle at the centre."""
    dirs, w = sphere_quadrature(n_mu, n_phi)
    pts, ms = [], []
    for m, r in shells:
        if r == 0.0:
            pts.append(np.zeros((1, 3)))
            ms.append(np.array([m]))
        else:
            pts.append(r * dirs)
            ms.append(m * w / (4.0 * math.pi))
    return np.concatenate(pts), np.concatenate(ms)


def full_pass(points, masses, mu: float, V: float, b: float, Z: float = 200.0, rtol: float = 1e-12,
              atol: float = 1e-15) -> dict:
    """Send a mass mu past free particles at rest (G = 1), from z = -Z to z = +Z on the line x = b, y = 0, with the
    speed it would have at infinity V (it starts with sqrt(V^2 + 2 M / D), D its distance from the body's centre).
    Every pull between the mass and each particle is followed; the particles do not pull one another. The particles'
    displacements and velocities are carried in units of C = 2 mu / V, and the mass's in departures from its straight
    flight, so that the small numbers keep their digits. Returns the energy the particles gained, its internal part
    (the kinetic energy about their centre of mass), the energy the mass lost (kinetic plus potential, which is what
    it would have lost at infinity) and the impulse formulae for the same particles."""
    x0 = np.asarray(points, dtype=float)
    m = np.asarray(masses, dtype=float)
    M, N = float(m.sum()), len(m)
    C = 2.0 * mu / V
    X0 = np.array([b, 0.0, -Z])
    V0 = math.sqrt(V * V + 2.0 * M / math.hypot(Z, b))
    T = 2.0 * Z / V0

    def unpack(t, y):
        X = X0 + np.array([0.0, 0.0, V0 * t]) + y[0:3]
        x = x0 + C * y[6:6 + 3 * N].reshape(N, 3)
        return X, x

    def rhs(t, y):
        X, x = unpack(t, y)
        d = X - x
        inv3 = np.sum(d * d, axis=1) ** -1.5
        pull = d * inv3[:, None]
        a_mu = -np.sum(m[:, None] * pull, axis=0)
        a_p = mu * pull / C
        return np.concatenate([y[3:6], a_mu, y[6 + 3 * N:], a_p.ravel()])

    y0 = np.zeros(6 + 6 * N)
    sol = solve_ivp(rhs, (0.0, T), y0, method="DOP853", rtol=rtol, atol=atol)
    y1 = sol.y[:, -1]

    def potential(t, y):
        X, x = unpack(t, y)
        return -mu * float(np.sum(m / np.linalg.norm(X - x, axis=1)))

    u = y1[3:6]
    lost = -(mu * (V0 * u[2] + 0.5 * u @ u)) + potential(0.0, y0) - potential(T, y1)
    v = C * y1[6 + 3 * N:].reshape(N, 3)
    gained = 0.5 * float(np.sum(m[:, None] * v * v))
    P = np.sum(m[:, None] * v, axis=0)
    internal = gained - 0.5 * float(P @ P) / M
    s = x0[:, 0] + 1j * x0[:, 1]
    F = float(planar_F(m, s, b))
    kick = complex(planar_kick(m, s, b))
    return {"gained": gained, "internal": internal, "lost": float(lost), "C": C, "steps": sol.t.size,
            "impulse_gained": 0.5 * C * C * F,
            "impulse_internal": 0.5 * C * C * (F - abs(kick) ** 2 / M)}


# --- how many bits a second reading holds ---------------------------------------------------------------------------
#
# A mass held for an instant at y outside a body of radius a leaves it the energy  Delta E(y) ~ int rho |x - y|^-4 dV.
# With |x - y|^-4 = sum_n C^(2)_n(cos gamma) |x|^n / |y|^(n+4) and C^(2)_n = sum_l a_nl P_l (l = n, n-2, ..., a_nl > 0),
#
#     Delta E(y) ~ sum_(l, j, m) alpha_lj  q_ljm  Y_lm(y^) / |y|^(l + 2j + 4),     q_ljm = int rho r^(l+2j) Y_lm dV,
#
# alpha_lj = 4 pi a_(l+2j, l) / (2l + 1): every moment of total degree n = l + 2j, (n+1)(n+2)/2 of them against the
# 2n + 1 of a reading at one time, each weakened by (a / |y|)^n. Angles separate the l and m exactly; the j of one
# sector are separated only by how the data fall off with |y|, and powers that all fall from the same radius are told
# apart at a price. In the sector l the moment with radial power 2j is read as if weakened by
#
#     (a / R_c)^n / binom(n, j)          moments taken free (Muntz: the k-th power less its fit by the lower ones)
#     (a / R_c)^n / binom(n, j)^2        moments of a body (the same price again inside: the moments of a density
#                                        in the ball are not free, the Hausdorff moment problem)
#
# to within factors that grow as powers of n, so that with L = ln SNR, Lam = ln(R_c / a), h(p) = -p ln p - (1-p)
# ln(1-p) and c = 1 or 2,
#
#     H = kappa L^4 / ln 2,     kappa = int_0^(1/2) (1 - 2p) dp / [6 (Lam + c h(p))^3]  ->  1 / (24 Lam^3)  (R_c >> a),
#
# p = j / n the share of the degree spent on the radial power. On a single sphere the data are a function of two
# angles and hold, for each (l, m), the one sum sum_j alpha_lj R_c^-2j q_ljm: the count of the first reading.
# Conventions: probes white over the volume outside R_c (or the shell R_c..2R_c, or the sphere), noise of relative
# size 1/SNR on the leading singular value; bits sum (1/2) log2(1 + SNR^2 s^2) over the singular values s, as
# hair.hair_bits. The density of a body is white in the ball.

from scipy.special import gammaln as _gammaln, sph_harm_y as _sph_harm_y, xlogy as _xlogy
import mpmath as _mp


def degree_count(n: int) -> int:
    """The moments int rho r^(l+2j) Y_lm dV of total degree n = l + 2j: sum over l = n, n-2, ... of 2l + 1."""
    return sum(2 * l + 1 for l in range(n % 2, n + 1, 2))


def gegenbauer_legendre(n: int, l: int) -> float:
    """a_nl in C^(2)_n = sum_l a_nl P_l: (2)_(n-k) (3/2)_k (2l+1) / ((3/2)_(n-k) k!), k = (n - l) / 2; zero unless
    l = n, n-2, ..."""
    if l > n or (n - l) % 2:
        return 0.0
    k = (n - l) // 2
    return float(_mp.rf(2, n - k) * _mp.rf(1.5, k) * (2 * l + 1) / (_mp.rf(1.5, n - k) * _mp.factorial(k)))


def _alpha(l: int, j: int):
    """alpha_lj / 4 pi = a_(l+2j, l) / (2l + 1), as an mpf."""
    return _mp.rf(2, l + j) * _mp.rf(_mp.mpf(3) / 2, j) / (_mp.rf(_mp.mpf(3) / 2, l + j) * _mp.factorial(j))


def second_reading_naive(snr: float, ratio: float) -> float:
    """The count if every moment of degree n stood at (a / R_c)^n and were read alone, sum_n (n+1)(n+2)/2 (1/2)
    log2(1 + snr^2 ratio^-2n); an upper bound on second_reading_bits(..., body=False) (Hadamard's inequality)."""
    L, lam = math.log(snr), math.log(ratio)
    n = np.arange(0, int(L / lam) + 60)
    return float(np.sum((n + 1) * (n + 2) / 2 * np.logaddexp(0.0, 2 * (L - n * lam))) / (2 * math.log(2)))


def second_reading_naive_leading(snr: float, ratio: float) -> float:
    """Its leading term, L^4 / (24 Lam^3 ln 2)."""
    return math.log(snr) ** 4 / (24 * math.log(ratio) ** 3 * math.log(2))


def _log_pivot(l, k, off):
    """log of k! Gamma(l+k+off) / Gamma(l+2k+off) sqrt(2 off / (2l+4k+2 off)): the part of the k-th power
    u^(l+2k+off-1/2) not fitted by the lower ones in L^2(0, 1), relative to that of u^(off-1/2)."""
    return (_gammaln(k + 1) + _gammaln(l + k + off) - _gammaln(l + 2 * k + off)
            + 0.5 * np.log(2 * off / (2 * l + 4 * k + 2 * off)))


def _log_alpha(l, k):
    return (_gammaln(2 + l + k) + _gammaln(1.5 + k) - _gammaln(1.5 + l + k) - _gammaln(k + 1)
            - _gammaln(2) - _gammaln(1.5) + _gammaln(1.5))


def second_reading_closed(snr: float, ratio: float, body: bool = True) -> float:
    """The bits with each moment (l, j) at its pivot, sum (2l+1) (1/2) log2(1 + snr^2 s_lj^2) with
    s_lj = (a/R_c)^(l+2j) x (the pivots of the powers outside) [x alpha_lj x (those inside), for a body]."""
    L, lam = math.log(snr), math.log(ratio)
    N = int((L + 40) / lam) + 10
    l, k = np.meshgrid(np.arange(N), np.arange(N // 2 + 2), indexing="ij")
    ls = -(l + 2 * k) * lam + _log_pivot(l, k, 2.5)
    if body:
        ls = ls + _log_pivot(l, k, 1.5) + _log_alpha(l, k)
    return float(np.sum((2 * l + 1) * np.logaddexp(0.0, 2 * (L + ls))) / (2 * math.log(2)))


def entropy_nats(p):
    return -_xlogy(p, p) - _xlogy(1 - p, 1 - p)


def second_reading_kappa(ratio: float, body: bool = True) -> float:
    """kappa = int_0^(1/2) (1 - 2p) dp / [6 (Lam + c h(p))^3], c = 2 for a body (body=True), 1 for free moments
    (body=False), 0 for the naive count, 1 / 24 Lam^3 (body=None)."""
    from scipy.integrate import quad
    lam, c = math.log(ratio), (2 if body else 1) if body is not None else 0
    return quad(lambda p: (1 - 2 * p) / (6 * (lam + c * entropy_nats(p)) ** 3), 0, 0.5, epsabs=0, epsrel=1e-12)[0]


def second_reading_leading(snr: float, ratio: float, body: bool = True) -> float:
    """The leading term, kappa L^4 / ln 2."""
    return second_reading_kappa(ratio, body) * math.log(snr) ** 4 / math.log(2)


def _block_gram(l: int, t: float, snr: float, body: bool, region: str):
    """The Gram matrix of the sector l (one of its 2l + 1 members), exact in multiple precision, before
    normalization; None when the whole sector lies far below the noise."""
    L, lam = math.log(snr), -math.log(t)
    rest = L - l * lam
    if rest < -12:
        return None
    # the powers of a sector fall by at least e^-(2 Lam + 1.2) each, or e^-(2 Lam + 2.5) for a body
    J = max(1, int((rest + 24) / (2 * lam + (2.0 if body else 1.0))) + 8)
    # det(1 + snr^2 G) needs G to about e^(-2 rest) of its largest entry, and the inside Gram (a Hilbert matrix)
    # loses about 1.2 digits for each power
    _mp.mp.dps = int((2 * rest + 30) / math.log(10) + (1.3 * J if body else 0)) + 30
    tt = _mp.mpf(t)
    v = [tt ** (l + 2 * j) * (_alpha(l, j) if body else 1) for j in range(J)]
    Gi = _mp.matrix([[_mp.mpf(3) / (2 * l + 2 * j + 2 * k + 3) for k in range(J)] for j in range(J)])
    if region == "sphere":                                   # one number per (l, m): rank one
        if body:
            return _mp.matrix([[(_mp.matrix(v).T * Gi * _mp.matrix(v))[0]]])
        return _mp.matrix([[_mp.fsum(x * x for x in v)]])
    lo = {"outside": _mp.mpf(0), "shell": _mp.mpf(1) / 2}[region]

    def gout(e):                                             # int_lo^1 u^e du
        return (1 - lo ** (e + 1)) / (e + 1)

    norm = gout(4)
    G = _mp.matrix(J, J)
    for j in range(J):
        for k in range(J):
            G[j, k] = v[j] * v[k] * gout(2 * l + 2 * j + 2 * k + 4) / norm
    if body:
        C = _mp.cholesky(Gi)
        G = C.T * (G * C)
    return G


def _half_log2_det(G, scale) -> float:
    """(1/2) log2 det(1 + scale G) = sum (1/2) log2(1 + scale s^2) over the eigenvalues s^2 of G, by Cholesky."""
    n = G.rows
    M = _mp.eye(n) + G * scale
    C = _mp.cholesky(M)
    return float(_mp.fsum(_mp.log(C[i, i], 2) for i in range(n)))


def second_reading_bits(snr: float, ratio: float, body: bool = True, region: str = "outside") -> float:
    """The exact sum: the singular values of the map from the moments (body=False: free, each of degree n normalized
    to stand at (a/|y|)^n) or from a density white in the ball (body=True: the true kernel |x - y|^-4) to the energies
    left by a mass held at the points y outside R_c = ratio * a (region "outside"), between R_c and 2 R_c ("shell"),
    or on the sphere R_c ("sphere"); white noise over the points, of size 1/snr against the largest singular value;
    bits sum (2l + 1) (1/2) log2(1 + snr^2 s^2) = sum (2l + 1) (1/2) log2 det(1 + snr^2 G_l), sector by sector in
    multiple precision."""
    t, L, lam = 1.0 / ratio, math.log(snr), math.log(ratio)
    grams = [_block_gram(l, t, snr, body, region) for l in range(int((L + 12) / lam) + 2)]
    G0 = np.array(grams[0].tolist(), dtype=float)
    top = float(np.linalg.eigvalsh(G0).max())                # the leading singular value, squared
    total = 0.0
    for l, G in enumerate(grams):
        if G is not None:
            _mp.mp.dps = int((2 * max(L - l * lam, 0) + 30) / math.log(10)) + 30
            total += (2 * l + 1) * _half_log2_det(G, _mp.mpf(snr) ** 2 / top)
    return total


# the same by brute force: a white density f(r) Y_l0 on a quadrature of the ball, the true kernels, white noise on a
# quadrature of the probes; the 2l + 1 members of a sector have the same singular values


def _gl(n, a=0.0, b=1.0):
    x, w = np.polynomial.legendre.leggauss(n)
    return a + (b - a) * (x + 1) / 2, w * (b - a) / 2


def _ball_sectors(nr: int, nt: int, lmax: int):
    """Points of the unit ball (Gauss in r and cos theta, uniform in phi) and the matrix that takes values of a
    kernel on them to its sectors: column (l, a) is Y_l0 times the quadrature weight on the shell r_a, times
    sqrt(r_a^2 w_a)."""
    nph = 2 * nt
    r, wr = _gl(nr)
    wr = wr * r**2
    c, wc = np.polynomial.legendre.leggauss(nt)
    ph = (np.arange(nph) + 0.5) * 2 * np.pi / nph
    C, P = np.meshgrid(c, ph, indexing="ij")
    th, P = np.arccos(C).ravel(), P.ravel()
    wang = np.repeat(wc, nph) * 2 * np.pi / nph
    d = np.stack([np.sin(th) * np.cos(P), np.sin(th) * np.sin(P), np.cos(th)], -1)
    pts = (r[:, None, None] * d[None]).reshape(-1, 3)
    Y = np.stack([_sph_harm_y(l, 0, th, P).real for l in range(lmax + 1)], -1) * wang[:, None]
    S = np.zeros((nr, len(th), lmax + 1, nr))
    for a in range(nr):
        S[a, :, :, a] = Y * math.sqrt(wr[a])
    return pts, S.reshape(nr * len(th), (lmax + 1) * nr)


def held_mass_singular_values(ratio: float, nr: int = 20, nt: int = 32, lmax: int = 30,
                              region: str = "outside") -> list:
    """Singular values, sector by sector, of the map from a white density in the unit ball to int rho |x - y|^-4 dV
    at probes y (unit-weighted over r^2 dr dOmega) outside R_c = ratio, in the shell R_c..2R_c, or on the sphere R_c."""
    pts, S = _ball_sectors(nr, nt, lmax)
    if region == "sphere":
        r, wr = np.array([ratio]), np.array([1.0])
    else:
        u, wu = _gl(nr, {"outside": 0.0, "shell": 0.5}[region], 1.0)
        r, wr = ratio / u, wu * ratio**3 / u**4                                 # r^2 dr, r = R_c / u
    c, wc = np.polynomial.legendre.leggauss(nt + 8)
    s = np.sqrt(1 - c**2)
    Y = (r[:, None, None] * np.stack([s, 0 * s, c], -1)[None]).reshape(-1, 3)     # the sector m = 0 is axial
    W = (wr[:, None] * wc[None] * 2 * np.pi).ravel()
    K = np.sqrt(W)[:, None] * (((Y[:, None, :] - pts[None]) ** 2).sum(-1)) ** -2
    A = (K @ S).reshape(len(Y), lmax + 1, nr)
    return [np.linalg.svd(A[:, l, :], compute_uv=False) for l in range(lmax + 1)]


def passing_mass_singular_values(ratio: float, nr: int = 20, nt: int = 24, lmax: int = 24, nb: int | None = None,
                                 npsi: int | None = None) -> list:
    """The same for the passing mass, Eq. pass: F = int Sigma |b - s|^-2 d^2s = int rho |b - x_perp|^-2 dV, for paths
    in every direction (Gauss in the cosine of its angle to the axis; the sector m = 0 is axial) and impact points b
    with |b| > R_c in the plane across each (unit-weighted over d^2b)."""
    nb, npsi = nb or nr, npsi or 2 * nt
    pts, S = _ball_sectors(nr, nt, lmax)
    u, wu = _gl(nb)
    rb, wrb = ratio / u, wu * ratio**2 / u**3                                     # |b| d|b|
    psi = (np.arange(npsi) + 0.5) * 2 * np.pi / npsi
    B = (rb[:, None, None] * np.stack([np.cos(psi), np.sin(psi)], -1)[None]).reshape(-1, 2)
    wB = np.repeat(wrb, npsi) * 2 * np.pi / npsi
    cn, wn = np.polynomial.legendre.leggauss(nt)
    rows = []
    for c, w in zip(cn, wn):
        s = math.sqrt(1 - c * c)
        e1, e2 = np.array([c, 0.0, -s]), np.array([0.0, 1.0, 0.0])               # across the path (s, 0, c)
        xs = np.stack([pts @ e1, pts @ e2], -1)
        K = np.sqrt(wB * w * 2 * np.pi)[:, None] / ((B[:, None, :] - xs[None]) ** 2).sum(-1)
        rows.append((K @ S).reshape(len(B), lmax + 1, nr))
    A = np.concatenate(rows, 0)
    return [np.linalg.svd(A[:, l, :], compute_uv=False) for l in range(lmax + 1)]


def sampled_bits(svals: list, snr: float) -> float:
    """sum over sectors l of (2l + 1) sum (1/2) log2(1 + snr^2 s^2), s relative to the largest."""
    top = max(float(s.max()) for s in svals)
    return sum((2 * l + 1) * float(np.sum(np.log2(1 + (snr * s / top) ** 2)) / 2) for l, s in enumerate(svals))


def grotzsch_modulus(r: float) -> float:
    """mu(r) = (pi/2) K'(r) / K(r), the modulus of the unit disc slit along [0, r]; ln(4/r) for small r. The powers
    of one sector fall at the exact rate e^-mu(t^2) each for free moments and e^-2mu(t) for a body, t = a / R_c
    (2 Lam + ln 4 and 2 Lam + ln 16 for small t: the binomials)."""
    return float(_mp.pi / 2 * _mp.ellipk(1 - _mp.mpf(r) ** 2) / _mp.ellipk(_mp.mpf(r) ** 2))


def second_order_ratio_pass(mu: float, V: float, b: float, G: float = 6.674e-11) -> float:
    """The energy a passing mass leaves, C^2 M / 2 b^2 at least, against the first-order interaction energy G M mu
    / b: 2 G mu / (b V^2) = (mu / M) (2 G M / b V^2), the ratio of the two signal-to-noise ratios when both are read
    against the same noise in energy."""
    return 2 * G * mu / (b * V * V)


def second_order_ratio_held(mu: float, tau: float, R_c: float, G: float = 6.674e-11) -> float:
    """The same for a mass held for a time tau at R_c: (1/2) (G mu tau)^2 M / R_c^4 against G M mu / R_c, that is
    G mu tau^2 / 2 R_c^3 = (mu / M) (G M tau^2 / 2 R_c^3)."""
    return G * mu * tau * tau / (2 * R_c**3)
