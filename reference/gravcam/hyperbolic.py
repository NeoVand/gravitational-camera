"""The geometry of access is hyperbolic (design/SYNTHESIS.md, Section 1.6).

Laplace's equation as a field on hyperbolic space. Let z be the depth of a possible source below a flat camera and
put u = z^(1/2) Phi. Then, for any function Phi,

    (Lap_H + 3/4) u = z^(5/2) Lap Phi,        Lap_H = z^2 Lap - z d_z,

with Lap_H the Laplacian of hyperbolic three-space, ds^2 = (dx^2 + dy^2 + dz^2) / z^2. So Laplace's equation for
Phi is (Lap_H + 3/4) u = 0: a scalar field with m^2 = -3/4, the conformally coupled value. Its two behaviours at
the boundary, z^(1/2) and z^(3/2), are the potential on the camera and the normal gravity there, and for the
pattern exp(i k . a - |k| z) the second is -|k| times the first. Scale on the camera is depth in the scene.

The information metric. Sensors cover a sphere of radius R about the scene. Two unit masses at x and x' inside it
give data whose inner product over the sphere is, up to a constant,

    K(x, x') = sum_l c_l (r r' / R^2)^l P_l(cos gamma),

gamma the angle between them, with weights c_l set by what the sensors read. With the mass of the source unknown,
the Fisher metric on its place is, per unit signal-to-noise ratio squared,

    g_ij = d_i d'_j ln K(x, x')   at x' = x.

Write u = r^2 / R^2 and g = (R^2 / (R^2 - r^2)^2) [g_r n_i n_j + g_t (delta_ij - n_i n_j)], n the direction of the
source from the centre. Then

  - c_l = 1 (the potential paired with the balayage skin of nullspace.py): K = R^2 / sqrt(R^4 - 2 R^2 x.x' +
    r^2 r'^2) and g_r = g_t = 1 exactly. This is the Poincare ball, hyperbolic space of curvature -4: the circle
    at geodesic distance s from the centre has the circumference pi sinh(2s).
  - c_l = l + 1 (gravimeters that read the whole vector): g_r = 2 and g_t = 2 + u.
  - c_l = (l + 1)(l + 2)(2l + 3) (tidal sensors, every component with the same white noise): g_r = (5 + 6u + 5u^2) /
    (1 + u)^2 and g_t = (5 + 12u + 3u^2) / (1 + u), so that at the sensors g_r -> 4, g_t -> 10 and their ratio
    tends to 5/2, the paper's ratio of the variance in depth to the variance across (Section IV.n).

Across the line to the source only the angle between the two sources changes, which gives the transverse part for
any weights as a ratio of two series: g_t = (1 - u)^2 sum_l c_l (l (l + 1) / 2) u^(l-1) / sum_l c_l u^l, since
P_l'(1) = l (l + 1) / 2. The closed forms of g_t above are that ratio summed. The metric itself is taken here by
differences of ln K, the series summed far enough for the place asked.

Tested in tests/test_hyperbolic.py.
"""
from __future__ import annotations

import math

import numpy as np
from scipy.special import eval_legendre

from .response import sphere_quadrature

# --- Laplace's equation on hyperbolic space -------------------------------------------------------------------------


def lifted(phi):
    """u = z^(1/2) Phi as a function of the place p = (x, y, z), z > 0: the field on hyperbolic space that stands
    for the potential Phi."""
    return lambda p: math.sqrt(p[2]) * phi(p)


def flat_laplacian(f, p, h: float = 1e-3) -> float:
    """Lap f at p, by central differences of step h."""
    p = np.asarray(p, dtype=float)
    return sum((f(p + h * e) - 2 * f(p) + f(p - h * e)) / h**2 for e in np.eye(3))


def hyperbolic_laplacian(u, p, step: float = 1e-3) -> float:
    """Lap_H u = z^2 Lap u - z d_z u at p = (x, y, z), z > 0: the Laplacian of the upper half-space with the metric
    (dx^2 + dy^2 + dz^2) / z^2, by central differences whose step is the given fraction of the depth (the same
    hyperbolic length everywhere)."""
    p = np.asarray(p, dtype=float)
    h = step * p[2]
    ez = np.array([0.0, 0.0, 1.0])
    return p[2] ** 2 * flat_laplacian(u, p, h) - p[2] * (u(p + h * ez) - u(p - h * ez)) / (2 * h)


def indicial(s: float) -> float:
    """The factor in (Lap_H + 3/4) z^s = [s (s - 2) + 3/4] z^s. It vanishes for s = 1/2, the potential on the
    camera, and for s = 3/2, the normal gravity there."""
    return s * (s - 2) + 0.75


# --- the sensors' weights -------------------------------------------------------------------------------------------


def unit_weights(l):
    """c_l = 1: the potential on the sphere paired with the balayage skin."""
    return np.ones_like(np.asarray(l), dtype=float)


def gravimeter_weights(l):
    """c_l = l + 1: sensors that read the three components of gravity, with the same white noise on each."""
    return np.asarray(l) + 1.0


def tidal_weights(l):
    """c_l = (l + 1)(l + 2)(2l + 3): sensors that read the tidal tensor, with the same white noise on every
    component."""
    l = np.asarray(l)
    return (l + 1.0) * (l + 2) * (2 * l + 3)


def kernel(x, xp, weights, l_max: int | None = None) -> float:
    """K(x, x') = sum_l c_l (r r')^l P_l(cos gamma) for two sources inside a sphere of sensors of unit radius,
    summed to l_max (by default far enough that what is left is below round-off)."""
    x, xp = np.asarray(x, dtype=float), np.asarray(xp, dtype=float)
    rho = float(np.linalg.norm(x) * np.linalg.norm(xp))
    if rho == 0.0:
        return float(weights(np.array([0]))[0])
    if l_max is None:
        l_max = int(60.0 / -math.log(rho)) + 60
    l = np.arange(l_max + 1)
    cos_gamma = min(1.0, max(-1.0, float(x @ xp) / rho))
    return float(np.sum(weights(l) * rho**l * eval_legendre(l, cos_gamma)))


def poincare_kernel(x, xp) -> float:
    """The same for c_l = 1, in closed form: 1 / sqrt(1 - 2 x.x' + r^2 r'^2)."""
    x, xp = np.asarray(x, dtype=float), np.asarray(xp, dtype=float)
    return 1.0 / math.sqrt(1.0 - 2.0 * float(x @ xp) + float(x @ x) * float(xp @ xp))


# --- the Fisher metric on the place of a source ---------------------------------------------------------------------


def fisher_metric(x, weights, R: float = 1.0, step: float = 5e-4) -> np.ndarray:
    """g_ij = d_i d'_j ln K(x, x') at x' = x, the Fisher metric per unit signal-to-noise ratio squared on the place
    x of a source inside a sphere of sensors of radius R, its mass unknown; by central differences whose step is
    the given fraction of the distance to the sensors."""
    y = np.asarray(x, dtype=float) / R
    h = step * (1.0 - np.linalg.norm(y))
    g = np.zeros((3, 3))
    for i in range(3):
        for j in range(i, 3):
            ei, ej = h * np.eye(3)[i], h * np.eye(3)[j]
            f = lambda a, b: math.log(kernel(y + a * ei, y + b * ej, weights))
            g[i, j] = g[j, i] = (f(1, 1) - f(1, -1) - f(-1, 1) + f(-1, -1)) / (4 * h * h)
    return g / R**2


def poincare_metric(x, R: float = 1.0) -> np.ndarray:
    """The metric of the Poincare ball of radius R and curvature -4: R^2 delta_ij / (R^2 - r^2)^2."""
    x = np.asarray(x, dtype=float)
    return R**2 / (R**2 - float(x @ x)) ** 2 * np.eye(3)


def metric_coefficients(r: float, weights, R: float = 1.0) -> tuple[float, float]:
    """(g_r, g_t): the radial and transverse parts of the Fisher metric at the distance r from the centre, in units
    of the Poincare ball's, R^2 / (R^2 - r^2)^2."""
    g = fisher_metric([0.0, 0.0, r], weights, R) / poincare_metric([0.0, 0.0, r], R)[0, 0]
    return float(g[2, 2]), float(g[0, 0])


def transverse_coefficient(u: float, weights, l_max: int | None = None) -> float:
    """g_t for any weights, from the two series at x' = x: (1 - u)^2 sum_l c_l (l (l + 1) / 2) u^(l-1) / sum_l c_l
    u^l, with u = r^2 / R^2 > 0."""
    if l_max is None:
        l_max = int(120.0 / -math.log(u)) + 60
    l = np.arange(l_max + 1)
    c = weights(l)
    return float((1 - u) ** 2 * np.sum(c[1:] * l[1:] * (l[1:] + 1) / 2 * u ** (l[1:] - 1)) / np.sum(c * u**l))


def gravimeter_coefficients(u: float) -> tuple[float, float]:
    """(g_r, g_t) for gravimeters, with u = r^2 / R^2: 2 and 2 + u."""
    return 2.0, 2.0 + u


def tidal_coefficients(u: float) -> tuple[float, float]:
    """(g_r, g_t) for tidal sensors, with u = r^2 / R^2: (5 + 6u + 5u^2) / (1 + u)^2 and (5 + 12u + 3u^2) / (1 + u).
    Both are 5 at the centre; at the sensors they are 4 and 10."""
    return (5 + 6 * u + 5 * u**2) / (1 + u) ** 2, (5 + 12 * u + 3 * u**2) / (1 + u)


# --- what the sensors read, to check the weights ---------------------------------------------------------------------


def potential_on_sphere(x, n) -> np.ndarray:
    """The potential (G = 1, its sign dropped) of a unit mass at x, at the points n (N, 3): 1 / |n - x|."""
    return 1.0 / np.linalg.norm(np.asarray(n, dtype=float) - np.asarray(x, dtype=float), axis=1)


def skin_on_sphere(x, n) -> np.ndarray:
    """The balayage of a unit mass at x onto the unit sphere, at the points n of it (Poincare): the surface density
    (1 - r^2) / (4 pi |n - x|^3), which has the same field outside as the mass."""
    x = np.asarray(x, dtype=float)
    return (1.0 - float(x @ x)) / (4 * math.pi * np.linalg.norm(np.asarray(n, dtype=float) - x, axis=1) ** 3)


def gravity_on_sphere(x, n) -> np.ndarray:
    """The gravity (G = 1) of a unit mass at x, at the points n: -(n - x) / |n - x|^3, (N, 3)."""
    d = np.asarray(n, dtype=float) - np.asarray(x, dtype=float)
    return -d / np.linalg.norm(d, axis=1)[:, None] ** 3


def tide_on_sphere(x, n) -> np.ndarray:
    """The tidal tensor (G = 1) of a unit mass at x, at the points n: (1 - 3 m m^T) / d^3 with d m = n - x, as
    (N, 3, 3)."""
    d = np.asarray(n, dtype=float) - np.asarray(x, dtype=float)
    dist = np.linalg.norm(d, axis=1)
    m = d / dist[:, None]
    return (np.eye(3) - 3 * np.einsum("ai,aj->aij", m, m)) / dist[:, None, None] ** 3


def over_the_sphere(a, b, n_mu: int = 60, n_phi: int = 120) -> float:
    """The integral over the unit sphere of the product of two fields, summed over their components: a and b are
    functions of the points n (N, 3) of the sphere."""
    n, w = sphere_quadrature(n_mu, n_phi)
    fa, fb = np.asarray(a(n)), np.asarray(b(n))
    return float(np.sum(w * np.sum((fa * fb).reshape(len(n), -1), axis=1)))
