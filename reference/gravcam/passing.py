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
