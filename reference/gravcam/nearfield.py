"""The near-field image model of ``scenes/README.md``: the tidal field at the
observer as an integral of the tidal column over the sky,

    E_ij = G integral dOmega (delta_ij - 3 n_i n_j) S(n),

with S(n) = integral of rho dr / r beyond the exclusion radius
(``columns.tidal_column``).

Where the formula comes from: the mass element rho r^2 dr dOmega at r n has
the tidal tensor G dm (delta_ij - 3 n_i n_j) / r^3 at the origin, and
r^2 dr / r^3 = dr / r. So the integral is the field of all matter beyond the
exclusion radius, exactly; and it is traceless whatever S is, as the field of
matter that does not contain the field point must be. (If the observer sits
inside matter, d_i d_j Phi there has the trace 4 pi G rho; the formula leaves
out the ball of matter within the exclusion radius, whose own contribution at
its centre is the isotropic (4 pi G rho / 3) delta_ij.)

The quadrature here is for checking that statement against ``tidal.py``, not
for speed: Gauss-Legendre nodes in mu = cos(polar angle) times equally spaced
azimuths. It is exact for polynomials in the direction up to a high degree,
but S(n) has kinks along the silhouette of every object (the chord through a
box goes to zero linearly at an edge, through a sphere like a square root),
so the error falls only like a power of the node spacing h: about h^2 for
boxes and h^(3/2) for spheres, times the fraction of the tidal field that
comes from near the silhouettes.
"""
from __future__ import annotations

import numpy as np
from numpy.polynomial import legendre

from . import columns
from .constants import G
from .scene import Scene


def sky_quadrature(n_mu: int, n_phi: int | None = None, axis: int = 1):
    """Unit directions and weights (sr) covering the sphere.

    ``n_mu`` Gauss-Legendre nodes in the cosine of the polar angle about the
    coordinate ``axis`` (default y, "up"), ``n_phi`` (default 2 n_mu) equally
    spaced azimuths, offset by half a step. The weights add up to 4 pi.
    Returns ``directions`` of shape (n_mu * n_phi, 3) and ``weights``.
    """
    n_phi = 2 * n_mu if n_phi is None else n_phi
    mu, w_mu = legendre.leggauss(n_mu)
    phi = (np.arange(n_phi) + 0.5) * (2.0 * np.pi / n_phi)
    sin_theta = np.sqrt((1.0 - mu) * (1.0 + mu))
    directions = np.empty((n_mu, n_phi, 3), dtype=np.float64)
    directions[..., axis] = mu[:, None]
    directions[..., (axis + 1) % 3] = sin_theta[:, None] * np.cos(phi)[None, :]
    directions[..., (axis + 2) % 3] = sin_theta[:, None] * np.sin(phi)[None, :]
    weights = np.repeat(w_mu * (2.0 * np.pi / n_phi), n_phi)
    return directions.reshape(-1, 3), weights


def tidal_tensor_from_columns(scene: Scene, n_mu: int = 256, n_phi: int | None = None, origin=None,
                              exclusion=None, axis: int = 1) -> np.ndarray:
    """G integral dOmega (delta_ij - 3 n_i n_j) S(n) by quadrature; shape (3, 3), s^-2."""
    directions, weights = sky_quadrature(n_mu, n_phi, axis)
    column = columns.tidal_column(scene, directions, origin=origin, exclusion=exclusion)
    weighted = weights * column
    tensor = np.empty((3, 3), dtype=np.float64)
    for i in range(3):
        for j in range(i, 3):
            kernel = (1.0 if i == j else 0.0) - 3.0 * directions[:, i] * directions[:, j]
            tensor[i, j] = tensor[j, i] = G * float(np.sum(weighted * kernel))
    return tensor
