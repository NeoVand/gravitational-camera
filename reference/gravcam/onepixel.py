"""What a single ideal pixel can tell, beyond the band limit of the sky it sees.

Conventions as in curvature.py: E_ij = c^2 R_0i0j, B_ij = (c^2/2) eps_ipq
R_pqj0, in s^-2; eps_123 = +1; n points from the pixel toward the source.

Four results, all tested in tests/test_one_pixel.py:

- One wave points back to its source. A plane wave travelling along k has
  B_ij = eps_ipq k_p E_qj, and then, whatever its polarization,

      eps_ijk E_jl B_kl = |E|^2 k = -|E|^2 n.

- Twelve sources can look exactly like a uniform sky. The pixel's second
  moments are polynomials of degree four in n (degree three for <E B>), and
  the twelve vertices of a regular icosahedron average every polynomial of
  degree five or less exactly as the whole sphere does (a spherical
  5-design). Twelve equal, unpolarized, independent sources there give the
  pixel the same covariance as a uniform sky; the six vertices of an
  octahedron (a 3-design) do not.

- One pixel ranges a moving mass. For a point mass M at distance r in
  direction n, moving with v, E = A (1 - 3 n n), A = G M / r^3, and
  B = (3 A / c) [n (n x v) + (n x v) n]. Then B n = (3 A / c) n x v and
  P dE/dt n = -3 A dn/dt = -3 A v_perp / r, with P = 1 - n n, so

      r = c |B n| / |P dE/dt n|.

  E alone cannot give it: the record E(t) is unchanged by x -> l x,
  v -> l v, M -> l^3 M, while B -> l B.

- A spin can hide. Outside a spherically symmetric body whose layers turn
  about one axis, B is that of a spin dipole proportional to the total
  angular momentum. A uniform ball of radius a = 2^(-1/5) R turning one way
  inside a shell out to R turning the other way at the same rate has none,
  and shows no magnetic field outside at all.
"""
from __future__ import annotations

import math

import numpy as np

from .constants import G, c
from .curvature import EPS


def _turn_z_to(k) -> np.ndarray:
    """A proper rotation taking +z to the unit vector k."""
    k = np.asarray(k, dtype=np.float64)
    k = k / np.linalg.norm(k)
    z = np.array([0.0, 0.0, 1.0])
    v = np.cross(z, k)
    s = np.linalg.norm(v)
    cos = float(z @ k)
    if s < 1e-12:
        return np.eye(3) if cos > 0 else np.diag([1.0, -1.0, -1.0])
    K = np.array([[0.0, -v[2], v[1]], [v[2], 0.0, -v[0]], [-v[1], v[0], 0.0]])
    return np.eye(3) + K + K @ K * (1.0 - cos) / s ** 2


def plane_wave_tensors(n, plus: float = 1.0, cross: float = 0.0, scale: float = 1.0):
    """(E, B) of a plane wave arriving from direction n (travelling along -n),
    with + and x parts in a transverse basis turned from (x, y) with z."""
    k = -np.asarray(n, dtype=np.float64)
    k = k / np.linalg.norm(k)
    R = _turn_z_to(k)
    e0 = scale * np.array([[plus, cross, 0.0], [cross, -plus, 0.0], [0.0, 0.0, 0.0]])
    E = R @ e0 @ R.T
    B = np.einsum("ipq,p,qj->ij", EPS, k, E)
    return E, B


def wave_direction(E, B) -> np.ndarray:
    """The direction toward the source of a single plane wave, from one
    pixel's E and B: n = -eps_ijk E_jl B_kl / |E|^2."""
    E = np.asarray(E, dtype=np.float64)
    B = np.asarray(B, dtype=np.float64)
    return -np.einsum("ijk,jl,kl->i", EPS, E, B) / np.sum(E * E)


def unpolarized_covariance(n) -> np.ndarray:
    """The 18 x 18 second moments of (E, B), flattened, of an unpolarized wave
    of unit strength arriving from n: the sum over the two polarizations."""
    out = np.zeros((18, 18))
    for plus, cross in ((1.0, 0.0), (0.0, 1.0)):
        E, B = plane_wave_tensors(n, plus, cross)
        v = np.concatenate([E.ravel(), B.ravel()])
        out += np.outer(v, v)
    return out


def icosahedron() -> np.ndarray:
    """The twelve unit vertices of a regular icosahedron."""
    phi = (1.0 + math.sqrt(5.0)) / 2.0
    pts = []
    for a in (1.0, -1.0):
        for b in (1.0, -1.0):
            pts += [(0.0, a, b * phi), (a, b * phi, 0.0), (b * phi, 0.0, a)]
    pts = np.array(pts)
    return pts / np.linalg.norm(pts, axis=1)[:, None]


def octahedron() -> np.ndarray:
    """The six unit vertices of a regular octahedron."""
    return np.vstack([np.eye(3), -np.eye(3)])


def sky_average(f, n_mu: int = 12, n_phi: int = 24):
    """The average of f(n) over the sphere, exact for polynomials of degree
    below min(2 n_mu, n_phi)."""
    mu, w = np.polynomial.legendre.leggauss(n_mu)
    phis = (np.arange(n_phi) + 0.5) * 2.0 * math.pi / n_phi
    total = 0.0
    for m, wm in zip(mu, w):
        s = math.sqrt(1.0 - m * m)
        for p in phis:
            total = total + wm * f(np.array([s * math.cos(p), s * math.sin(p), m]))
    return total / (2.0 * n_phi)


def range_moving_mass(E, B, Edot):
    """(r, M, v) of an isolated point mass from one pixel's E, B and dE/dt,
    to first order in v/c. The axis n is the eigenvector of E's negative
    eigenvalue; its sign is fixed by asking for r > 0. Pure radial motion
    (v parallel to n) gives no range."""
    E = np.asarray(E, dtype=np.float64)
    B = np.asarray(B, dtype=np.float64)
    Edot = np.asarray(Edot, dtype=np.float64)
    vals, vecs = np.linalg.eigh(E)
    n = vecs[:, 0]
    A = -vals[0] / 2.0
    w = np.cross(n, Edot @ n)
    r = -c * float((B @ n) @ w) / float(w @ w)
    if r < 0:
        n, r = -n, -r
    M = A * r ** 3 / G
    v_perp = -c / (3.0 * A) * np.cross(n, B @ n)
    A_dot = -0.5 * float(n @ Edot @ n)
    v_r = -r / 3.0 * A_dot / A
    return r, M, v_perp + v_r * n
