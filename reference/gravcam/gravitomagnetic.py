"""The magnetic tidal tensor B_ij of slowly moving matter, as a sky integral.

With the conventions of curvature.py (E_ij = c^2 R_0i0j, B_ij = (c^2/2)
eps_ipq R_pqj0, both in s^-2, |B| = |E| for a plane wave), a point mass M at
distance r in direction n, moving with velocity v, gives to first order in v/c

    E_ij = (G M / r^3) (delta_ij - 3 n_i n_j),
    B_ij = (3 G M / (c r^3)) [n_i (n x v)_j + n_j (n x v)_i].

Grouping the matter by direction, as for the tidal column, a pixel's B is a
sky integral of the current column J(n) = integral of rho v dr / r:

    B_ij = (3 G / c) integral dOmega [n_i (n x J)_j + n_j (n x J)_i].

Three consequences, all tested in tests/test_gravitomagnetic.py:

- Only motion across the line of sight counts: n x J removes the radial part.
- For a single moving mass |B| / |E| = sqrt(3) v_perp / c.
- Outside a body that spins rigidly and is spherically symmetric, B is
  exactly that of a spin dipole, proportional to the angular momentum
  L = I w. A hollow shell and a solid ball of equal mass, size and spin have
  identical E everywhere outside, but B differs by I_shell / I_ball = 5/3.

The finite-difference curvature of curvature.py checks the point formula
independently.
"""
from __future__ import annotations

import math

import numpy as np

from .constants import G, c


def electric_point(mass: float, offset) -> np.ndarray:
    """E_ij at the origin from a point mass at `offset` (metres)."""
    x = np.asarray(offset, dtype=np.float64)
    r = np.linalg.norm(x)
    n = x / r
    return G * mass / r ** 3 * (np.eye(3) - 3.0 * np.outer(n, n))


def magnetic_point(mass: float, offset, velocity) -> np.ndarray:
    """B_ij at the origin from a point mass at `offset` moving with `velocity`."""
    x = np.asarray(offset, dtype=np.float64)
    r = np.linalg.norm(x)
    n = x / r
    a = np.cross(n, np.asarray(velocity, dtype=np.float64))
    return 3.0 * G * mass / (c * r ** 3) * (np.outer(n, a) + np.outer(a, n))


def magnetic_from_current_columns(directions, weights, J) -> np.ndarray:
    """B_ij at the pixel from current columns J (kg m^-2 s^-1) sampled on the
    unit vectors `directions` with solid-angle `weights` (sr)."""
    n = np.atleast_2d(np.asarray(directions, dtype=np.float64))
    w = np.asarray(weights, dtype=np.float64)
    a = np.cross(n, np.atleast_2d(np.asarray(J, dtype=np.float64)))
    B = np.einsum("k,ki,kj->ij", w, n, a)
    return 3.0 * G / c * (B + B.T)


def spin_dipole(angular_momentum, offset) -> np.ndarray:
    """B_ij at the origin outside a spherically symmetric body spinning with
    angular momentum L whose centre is at `offset` (direction n, distance r):
    the exterior field is exactly this dipole,

        B_ij = -(3 G / (c r^4)) [L_i n_j + n_i L_j + (L.n)(delta_ij - 5 n_i n_j)],

    which is symmetric and trace-free."""
    x = np.asarray(offset, dtype=np.float64)
    r = np.linalg.norm(x)
    n = x / r
    L = np.asarray(angular_momentum, dtype=np.float64)
    Ln = float(L @ n)
    return -(3.0 * G / (c * r ** 4)) * (np.outer(L, n) + np.outer(n, L)
                                         + Ln * (np.eye(3) - 5.0 * np.outer(n, n)))


def spinning_shell(center, radius: float, inner_radius: float, density: float, omega,
                   orders=(24, 48, 96)) -> tuple[np.ndarray, np.ndarray]:
    """(E, B) at the origin from a uniform spherical shell (inner_radius 0 for a
    ball) spinning rigidly about its centre with angular velocity omega (rad/s),
    by Gauss quadrature over its volume using the point formulas."""
    center = np.asarray(center, dtype=np.float64)
    omega = np.asarray(omega, dtype=np.float64)
    nr, nmu, nphi = orders
    xr, wr = np.polynomial.legendre.leggauss(nr)
    r = inner_radius + (radius - inner_radius) * (xr + 1.0) / 2.0
    wr = wr * (radius - inner_radius) / 2.0
    mu, wmu = np.polynomial.legendre.leggauss(nmu)
    phi = (np.arange(nphi) + 0.5) * 2.0 * math.pi / nphi
    wphi = 2.0 * math.pi / nphi
    R, MU, PHI = np.meshgrid(r, mu, phi, indexing="ij")
    W = (wr[:, None, None] * wmu[None, :, None] * wphi) * R ** 2 * density
    s = np.sqrt(1.0 - MU ** 2)
    local = np.stack([R * s * np.cos(PHI), R * s * np.sin(PHI), R * MU], axis=-1).reshape(-1, 3)
    masses = W.reshape(-1)
    pos = center[None, :] + local
    vel = np.cross(omega[None, :], local)
    dist = np.linalg.norm(pos, axis=1)
    n = pos / dist[:, None]
    E = np.einsum("k,kij->ij", G * masses / dist ** 3,
                  np.eye(3)[None, :, :] - 3.0 * n[:, :, None] * n[:, None, :])
    a = np.cross(n, vel)
    B = np.einsum("k,ki,kj->ij", 3.0 * G * masses / (c * dist ** 3), n, a)
    return E, B + B.T
