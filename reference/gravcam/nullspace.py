"""Same outside, different inside: what a near-field picture taken from outside a body determines (paper, Section IV).

The theorem (classical; Isakov 1990). For a body V whose outside is connected, the potential outside V determines
the moments of the density against every function harmonic in V, and nothing more. Every density splits uniquely as

    rho = rho_h + nabla^2 chi / (4 pi G),

with rho_h harmonic in V and chi vanishing, with its gradient, on the surface; the camera outside sees rho_h exactly
and is blind to the rest. An estimate that is linear in the data and assumes nothing about the interior (a white
prior) is a combination of the data's kernels, which are harmonic in V, so it is itself harmonic: by the maximum
principle its largest and smallest values lie on the surface. The least assuming picture of an interior can never
show a core, and every round body looks like a uniform ball of its mean density.

A point mass m at s on the z axis inside a ball of radius R, centred at the origin. Its exterior field is shared by

* its harmonic projection, the density harmonic in the ball with the same moments m s^l:

      rho_h(r, mu) = (m / 4 pi R^3) sum_l (2l+1)(2l+3) t^l P_l(mu),     t = s r / R^2, mu = cos(theta),
                   = (m / 4 pi R^3) [(3 - 7 t^2) D^{-3/2} - 6 t (1 - t^2)(t - mu) D^{-5/2}],   D = 1 - 2 t mu + t^2,

  that is (2 t d/dt + 3) applied to the Poisson kernel (1 - t^2) D^{-3/2}; it is largest at the surface nearest the
  mass, (m / 4 pi R^3)(3 + 6q - q^2) / (1 - q)^3 with q = s/R (46 for s = R/2, fifteen times the mass spread
  evenly);
* its balayage onto the sphere (Poincare), a surface density sigma = m (R^2 - s^2) / (4 pi R |x - s|^3).

The three differ in the one second moment the electric part cannot see, the trace int rho r^2 dV: m s^2, (3/5) m R^2
and m R^2. The moment of inertia contains it, so the magnetic part of the field of a spinning body (Section VIII)
tells them apart: I_x = (2/3) int rho r^2 + int rho (r^2/3 - x^2), the second integral harmonic and shared.

Tested in tests/test_nullspace.py.
"""
from __future__ import annotations

import math

import numpy as np
from scipy.integrate import dblquad, quad
from scipy.special import ellipk, eval_legendre

from .constants import G


# --- a point mass in a ball: three bodies with the same outside ----------------------------------------------------

def harmonic_point(m: float, s: float, R: float, r, mu) -> np.ndarray:
    """rho_h at radius r and cos(theta) = mu, theta measured from the mass's direction: closed form."""
    t = s * np.asarray(r, dtype=float) / (R * R)
    mu = np.asarray(mu, dtype=float)
    D = 1.0 - 2.0 * t * mu + t * t
    return m / (4.0 * math.pi * R ** 3) * ((3.0 - 7.0 * t * t) * D ** -1.5 - 6.0 * t * (1.0 - t * t) * (t - mu) * D ** -2.5)


def harmonic_point_series(m: float, s: float, R: float, r: float, mu: float, terms: int = 400) -> float:
    """The same, summed term by term."""
    t = s * r / (R * R)
    return m / (4.0 * math.pi * R ** 3) * sum((2 * l + 1) * (2 * l + 3) * t ** l * eval_legendre(l, mu)
                                              for l in range(terms))


def harmonic_point_peak(m: float, s: float, R: float) -> float:
    """rho_h at the surface point nearest the mass, its largest value."""
    q = s / R
    return m / (4.0 * math.pi * R ** 3) * (3.0 + 6.0 * q - q * q) / (1.0 - q) ** 3


def balayage_point(m: float, s: float, R: float, mu) -> np.ndarray:
    """Surface density on the sphere at cos(theta) = mu with the point mass's exterior field (Poincare)."""
    mu = np.asarray(mu, dtype=float)
    dist = np.sqrt(R * R + s * s - 2.0 * R * s * mu)
    return m * (R * R - s * s) / (4.0 * math.pi * R * dist ** 3)


# --- checks: moments and the potential outside ---------------------------------------------------------------------

def volume_moment(f, R: float, l: int) -> float:
    """int f(r, mu) r^l P_l(mu) dV over the ball, for an axially symmetric density f."""
    inner = lambda r: quad(lambda mu: f(r, mu) * eval_legendre(l, mu), -1.0, 1.0, epsabs=1e-14, epsrel=1e-12,
                           limit=200)[0]
    return 2.0 * math.pi * quad(lambda r: inner(r) * r ** (l + 2), 0.0, R, epsabs=1e-14, epsrel=1e-11, limit=200)[0]


def surface_moment(sigma, R: float, l: int) -> float:
    """int sigma(mu) R^l P_l(mu) dA over the sphere."""
    return 2.0 * math.pi * R ** (l + 2) * quad(lambda mu: sigma(mu) * eval_legendre(l, mu), -1.0, 1.0,
                                                epsabs=1e-14, epsrel=1e-12, limit=400)[0]


def _ring(a: float, z0: float, rho_p: float, z_p: float) -> float:
    """-G/(2 pi) times the integral of 1/|x - y| around a ring of radius a at height z0, per unit mass of the ring."""
    d2 = (rho_p + a) ** 2 + (z_p - z0) ** 2
    k2 = 4.0 * rho_p * a / d2
    return -G * (2.0 / math.pi) * ellipk(k2) / math.sqrt(d2)


def potential_volume(f, R: float, point) -> float:
    """Potential at an outside point (cylindrical rho, z) of an axially symmetric density f(r, mu), by direct
    integration over rings."""
    rho_p, z_p = point

    def integrand(mu, r):
        sin = math.sqrt(max(1.0 - mu * mu, 0.0))
        return f(r, mu) * 2.0 * math.pi * r * r * _ring(r * sin, r * mu, rho_p, z_p)

    return dblquad(integrand, 0.0, R, -1.0, 1.0, epsabs=0, epsrel=1e-10)[0]


def potential_surface(sigma, R: float, point) -> float:
    """Potential at an outside point of an axially symmetric surface density on the sphere."""
    rho_p, z_p = point
    g = lambda mu: sigma(mu) * 2.0 * math.pi * R * R * _ring(R * math.sqrt(max(1.0 - mu * mu, 0.0)), R * mu, rho_p, z_p)
    return quad(g, -1.0, 1.0, epsabs=0, epsrel=1e-11, limit=400)[0]


def potential_point(m: float, s: float, point) -> float:
    rho_p, z_p = point
    return -G * m / math.hypot(rho_p, z_p - s)


# --- what tells them apart ----------------------------------------------------------------------------------------

def trace_moments(m: float, s: float, R: float) -> dict[str, float]:
    """int rho r^2 dV for the point, its harmonic projection and its balayage."""
    return {"point": m * s * s, "harmonic": 0.6 * m * R * R, "balayage": m * R * R}


def inertia(m: float, s: float, R: float, axis: str) -> dict[str, float]:
    """Moments of inertia of the three about the x axis (across the line to the mass) or the z axis (along it)."""
    if axis == "x":
        shared = m * s * s - (2.0 / 3.0) * m * s * s          # int rho (r^2/3 - x^2) for the point, the same for all
    elif axis == "z":
        shared = -(2.0 / 3.0) * m * s * s
    else:
        raise ValueError(axis)
    return {k: (2.0 / 3.0) * v + shared for k, v in trace_moments(m, s, R).items()}


def mean_density(radii, densities) -> float:
    """The uniform ball a camera outside sees for a spherically symmetric body: its mean density."""
    edges = np.concatenate([[0.0], np.asarray(radii, dtype=float)])
    mass = np.sum(np.asarray(densities, dtype=float) * (edges[1:] ** 3 - edges[:-1] ** 3))
    return float(mass / edges[-1] ** 3)


def two_layer(M: float, I: float, R: float, rc: float) -> tuple[float, float]:
    """Densities of a core of radius rc and a mantle to R with total mass M and moment of inertia I."""
    A = np.array([[4.0 * math.pi / 3.0 * rc ** 3, 4.0 * math.pi / 3.0 * (R ** 3 - rc ** 3)],
                  [8.0 * math.pi / 15.0 * rc ** 5, 8.0 * math.pi / 15.0 * (R ** 5 - rc ** 5)]])
    core, mantle = np.linalg.solve(A, [M, I])
    return float(core), float(mantle)


# --- the magnetic part's null space: flows that circulate in meridian planes ----------------------------------------
#
# Outside a body, B comes from the gravitomagnetic potential A = int J / |x - x'| (J = rho v, steady). If J =
# curl curl V with V vanishing, with its derivatives, on the surface, then A = grad(int div V / |x - x'|) outside, a
# gradient, and B = 0 there. Every confined flow that turns in meridian planes (convection rolls, poloidal flow) is of
# this form; only the swirl about the axis (toroidal flow) shows outside, and only through its harmonic part.
# (Carbon's suite, design/sources; checked independently in tests/test_silent_flows.py.)


def ball_flows(n: int = 64, power: int = 5):
    """On an n^3 grid over [-1, 1]^3: the swirl J = curl(z psi) and the meridional rolls J = curl curl(z psi) of
    psi = (1 - r^2)^power inside the unit ball (smooth at its surface, so the grid sums converge quickly). Returns
    (grid (X, Y, Z), dV, swirl, rolls)."""
    p = power
    g = (np.arange(n) + 0.5) / n * 2 - 1
    X, Y, Z = np.meshgrid(g, g, g, indexing="ij")
    dV = (2.0 / n) ** 3
    R2 = X * X + Y * Y + Z * Z
    s = np.where(R2 < 1, 1 - R2, 0.0)
    dpsi = -2 * p * s ** (p - 1)                           # grad psi = dpsi * x
    swirl = np.stack([dpsi * Y, -dpsi * X, np.zeros_like(X)])
    d2 = 4 * p * (p - 1) * s ** (p - 2)                    # grad(d psi / dz) = d2 * (x z, y z, z z) + dpsi * z-hat
    lap = -6 * p * s ** (p - 1) + 4 * p * (p - 1) * s ** (p - 2) * R2
    rolls = np.stack([d2 * X * Z, d2 * Y * Z, d2 * Z * Z + dpsi - lap])
    return (X, Y, Z), dV, swirl, rolls


def external_magnetic(J, grid, dV: float, x) -> np.ndarray:
    """B outside a steady flow J (up to the constant G/c factor): the symmetrized eps_ipq d_q d_j A_p, with
    A = int J / |x - x'|, from the kernel d_q d_j (1/R) = (3 R_q R_j - R^2 delta_qj) / R^5."""
    X, Y, Z = grid
    R = [x[0] - X, x[1] - Y, x[2] - Z]
    R2 = R[0] ** 2 + R[1] ** 2 + R[2] ** 2
    R5 = R2 ** 2.5
    K = [[(3 * R[q] * R[j] - R2 * (q == j)) / R5 for j in range(3)] for q in range(3)]
    eps = np.zeros((3, 3, 3))
    for a, b, cc in ((0, 1, 2), (1, 2, 0), (2, 0, 1)):
        eps[a, b, cc], eps[a, cc, b] = 1.0, -1.0
    B = np.zeros((3, 3))
    for i in range(3):
        for j in range(3):
            B[i, j] = sum(eps[i, p, q] * np.sum(J[p] * K[q][j]) * dV
                          for p in range(3) for q in range(3) if eps[i, p, q])
    return 0.5 * (B + B.T)
