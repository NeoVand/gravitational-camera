"""Gravitational-wave memory: what a burst of radiation leaves behind.

Anything that flies apart at nearly the speed of light, neutrinos from a
collapsing star or the gravitational waves of a merger themselves, changes the
strain at a distant camera for good. For energy radiated with angular
distribution dE/dOmega' (Epstein 1978; Christodoulou 1991; Thorne 1992),

    Delta h_ij^TT(N) = (4 G / (c^4 r)) int dOmega' (dE/dOmega')
                       [ n'_i n'_j / (1 - n'.N) ]^TT ,

seen from direction N at distance r. A spherical burst leaves nothing, as
Birkhoff's theorem requires. A narrow jet of energy E leaves
Delta h = (2 G E / c^4 r)(1 + cos theta) at angle theta from it, and a
symmetric pair of jets the same in every direction off their axis. Fed with
the radiation pattern of a circular binary, the formula gives the shape of the
nonlinear memory of a merger, sin^2(iota) (17 + cos^2 iota) (Wiseman and Will
1991; Favata 2009).

Functions return (c^4 r / 4 G) Delta h, so that a pattern dE/dOmega in joules
per steradian gives the memory up to that factor.
"""
from __future__ import annotations

import math

import numpy as np

_X, _W = np.polynomial.legendre.leggauss(400)
_PHI = (np.arange(800) + 0.5) / 800 * 2.0 * math.pi


def _sphere(pole=(0.0, 0.0, 1.0)):
    """Quadrature over the sphere with its pole along `pole`: Gauss-Legendre in
    the cosine of the angle from the pole, uniform in azimuth. With the pole on
    the line of sight the Epstein integrand is a polynomial in that cosine."""
    pole = np.asarray(pole, dtype=np.float64) / np.linalg.norm(pole)
    e1, e2 = transverse_basis(pole)
    ct = _X[:, None] * np.ones_like(_PHI)[None, :]
    st = np.sqrt(1.0 - ct * ct)
    n = (st[..., None] * (np.cos(_PHI)[None, :, None] * e1 + np.sin(_PHI)[None, :, None] * e2)
         + ct[..., None] * pole)
    w = _W[:, None] * np.full_like(_PHI, 2.0 * math.pi / len(_PHI))[None, :]
    return n.reshape(-1, 3), w.ravel()


def transverse_basis(N):
    """Two unit vectors across N: e1 along the projection of z (or of x if N
    is along z), e2 = N x e1, so that h_+ = (h e1 e1 - h e2 e2) / 2 and
    h_x = h e1 e2."""
    N = np.asarray(N, dtype=np.float64)
    ref = np.array([0.0, 0.0, 1.0]) if abs(N[2]) < 0.999999 else np.array([1.0, 0.0, 0.0])
    e1 = ref - (ref @ N) * N
    e1 /= np.linalg.norm(e1)
    return e1, np.cross(N, e1)


def epstein(pattern, N):
    """(h_+, h_x) of (c^4 r / 4 G) Delta h_ij^TT seen from unit vector N, for
    radiation with angular distribution pattern(n) (n: (M, 3) -> (M,))."""
    N = np.asarray(N, dtype=np.float64) / np.linalg.norm(N)
    n, w = _sphere(N)
    dE = pattern(n) * w
    e1, e2 = transverse_basis(N)
    a, b = n @ e1, n @ e2
    k = 1.0 - n @ N
    # the TT projection of n n is ((a^2 - b^2)/2)(e1e1 - e2e2) + a b (e1e2 + e2e1)
    plus = np.sum(dE * 0.5 * (a * a - b * b) / k)
    cross = np.sum(dE * a * b / k)
    return plus, cross


def jet(axis, energy: float = 1.0, width: float = 0.02):
    """A narrow jet of total energy `energy` along the unit vector `axis`, as
    a pattern for `epstein` (a Gaussian of angular width `width`, radians)."""
    axis = np.asarray(axis, dtype=np.float64) / np.linalg.norm(axis)
    norm = energy / (2.0 * math.pi * width * width)

    def pattern(n):
        angle = np.arccos(np.clip(n @ axis, -1.0, 1.0))
        return norm * np.exp(-0.5 * (angle / width) ** 2)

    return pattern


def binary_flux(n):
    """Angular pattern of the power radiated by a circular binary whose orbit
    turns about z: h_+^2 + h_x^2, normalised to integrate to one over the sphere."""
    ci = n[..., 2]
    return ((1 + ci * ci) ** 2 / 4.0 + ci * ci) / (16.0 * math.pi / 5.0)
