"""The field of an orbiting pair in every zone, from the masses out to the waves.

Linearized gravity has an exact solution outside any compact source, organised
by multipoles (Thorne 1980). Kept to the order of the mass quadrupole, with
x^0 = c t, the trace-reversed perturbation in harmonic gauge is, at the
retarded time u = t - r / c,

    hbar^00 = (4 G / c^2) [ M / r + (1/2) d_i d_j ( I_ij(u) / r ) ],
    hbar^0i = (2 G / c^3) [ ( dI_ij/du n_j / r^2 + d2I_ij/du2 n_j / (c r) )
                            + (J x x)_i / r^3 ],
    hbar^ij = (2 G / c^4) d2I_ij/du2 / r,

where I_ij = sum m x_i x_j is the second moment of the mass, M the mass and J
the angular momentum. It satisfies the harmonic condition d_mu hbar^mu nu = 0
exactly, and every derivative of F(u) / r is written in closed form
(`_second_gradient`). The curvature then comes from `curvature.riemann_many`.

Near the pair (r much less than the reduced wavelength c / 2 Omega) the tidal
field is that of Newton's potential with its rotating quadrupole; far away it
is the quadrupole wave, E_ij = -(1/2) d_t^2 h_ij^TT with h_ij^TT = (2 G / c^4 r)
(d2I_ij/du2)^TT. Between the two the pattern of stretching winds into a spiral.
The octupole vanishes for equal masses; the next term (the hexadecapole) is
smaller by (d / r)^2 near the pair and by (v / c)^2 in the waves.
"""
from __future__ import annotations

import numpy as np

from . import curvature
from .constants import G, c


class Pair:
    """Two equal masses m a distance d apart, turning at angular velocity
    omega about the z axis; at t = 0 they lie on the x axis."""

    def __init__(self, m: float, d: float, omega: float):
        self.m, self.d, self.omega = float(m), float(d), float(omega)
        self.mass = 2.0 * self.m
        self.spin = np.array([0.0, 0.0, 0.5 * self.m * self.d ** 2 * self.omega])

    @classmethod
    def bound(cls, m: float, d: float) -> "Pair":
        """The pair on its Newtonian circular orbit, Omega^2 = G (2 m) / d^3."""
        return cls(m, d, np.sqrt(G * 2.0 * m / d ** 3))

    @property
    def speed(self) -> float:
        """Orbital speed of each mass, m/s."""
        return 0.5 * self.omega * self.d

    @property
    def wavelength(self) -> float:
        """Wavelength of the waves, at twice the orbital frequency, m."""
        return np.pi * c / self.omega

    def positions(self, t):
        """(N, 2, 3): where the two masses are at the times t."""
        t = np.atleast_1d(np.asarray(t, dtype=np.float64))
        a = self.omega * t
        one = 0.5 * self.d * np.stack([np.cos(a), np.sin(a), np.zeros_like(a)], axis=-1)
        return np.stack([one, -one], axis=1)

    def moments(self, u):
        """I_ij and its first and second derivatives at the times u, each (N, 3, 3)."""
        u = np.atleast_1d(np.asarray(u, dtype=np.float64))
        k = 0.25 * self.m * self.d ** 2
        w = 2.0 * self.omega
        cs, sn = np.cos(w * u), np.sin(w * u)
        zero, one = np.zeros_like(u), np.ones_like(u)

        def build(xx, xy, yy):
            out = np.zeros((len(u), 3, 3))
            out[:, 0, 0], out[:, 0, 1], out[:, 1, 0], out[:, 1, 1] = xx, xy, xy, yy
            return k * out

        I = build(one + cs, sn, one - cs)
        I1 = w * build(-sn, cs, sn)
        I2 = w * w * build(-cs, -sn, cs)
        return I, I1, I2

    def newtonian_tidal(self, t, x):
        """E_ij of the two masses by Newton's law at their positions at time t
        (no retardation), (N, 3, 3): the near-zone limit."""
        x = np.atleast_2d(np.asarray(x, dtype=np.float64))
        out = np.zeros((len(x), 3, 3))
        for p in np.moveaxis(self.positions(t), 1, 0):
            rel = x - p
            r = np.linalg.norm(rel, axis=-1)
            n = rel / r[:, None]
            out += (G * self.m / r ** 3)[:, None, None] * (np.eye(3) - 3.0 * n[:, :, None] * n[:, None, :])
        return out

    def wave_tidal(self, t, x):
        """E_ij of the quadrupole wave alone, -(1/2) d_t^2 h^TT, (N, 3, 3): the
        far-zone limit."""
        x = np.atleast_2d(np.asarray(x, dtype=np.float64))
        t = np.broadcast_to(np.asarray(t, dtype=np.float64), (len(x),))
        r = np.linalg.norm(x, axis=-1)
        n = x / r[:, None]
        u = t - r / c
        w = 2.0 * self.omega
        # d^2/dt^2 of d2I/du2 is -w^2 times it
        _, _, I2 = self.moments(u)
        P = np.eye(3)[None] - n[:, :, None] * n[:, None, :]
        tt = (np.einsum("nik,nkl,nlj->nij", P, I2, P)
              - 0.5 * P * np.einsum("nkl,nkl->n", P, I2)[:, None, None])
        h_tt = (2.0 * G / (c ** 4 * r))[:, None, None] * tt
        return 0.5 * w * w * h_tt


def _second_gradient(F, F1, F2, r, n):
    """d_i d_j (F_ij(u) / r) contracted with F: the scalar sum_ij d_i d_j (F_ij / r),
    for symmetric F with derivatives F1, F2 in u = t - r / c."""
    nFn = np.einsum("ni,nij,nj->n", n, F, n)
    nF1n = np.einsum("ni,nij,nj->n", n, F1, n)
    nF2n = np.einsum("ni,nij,nj->n", n, F2, n)
    trF = np.einsum("nii->n", F)
    trF1 = np.einsum("nii->n", F1)
    return (3.0 * nFn - trF) / r ** 3 + (3.0 * nF1n - trF1) / (c * r ** 2) + nF2n / (c * c * r)


def metric(pair: Pair):
    """h(x0, x) -> (N, 4, 4), the perturbation g - eta, vectorized."""

    def h(x0, x):
        x0 = np.atleast_1d(np.asarray(x0, dtype=np.float64))
        x = np.atleast_2d(np.asarray(x, dtype=np.float64))
        r = np.linalg.norm(x, axis=-1)
        n = x / r[:, None]
        u = x0 / c - r / c
        I, I1, I2 = pair.moments(u)
        hb00 = 4.0 * G / c ** 2 * (pair.mass / r + 0.5 * _second_gradient(I, I1, I2, r, n))
        hb0i = (2.0 * G / c ** 3) * (np.einsum("nij,nj->ni", I1, n) / r[:, None] ** 2
                                    + np.einsum("nij,nj->ni", I2, n) / (c * r[:, None])
                                    + np.cross(pair.spin[None, :], x) / r[:, None] ** 3)
        hbij = (2.0 * G / c ** 4) * I2 / r[:, None, None]
        # lower the indices (eta = diag(-1, 1, 1, 1)) and reverse the trace
        hb = np.zeros((len(x), 4, 4))
        hb[:, 0, 0] = hb00
        hb[:, 0, 1:] = hb[:, 1:, 0] = -hb0i
        hb[:, 1:, 1:] = hbij
        trace = -hb00 + np.einsum("nii->n", hbij)
        eta = np.diag([-1.0, 1.0, 1.0, 1.0])
        return hb - 0.5 * eta[None] * trace[:, None, None]

    return h


def tidal(pair: Pair, t, x, step_fraction: float = 2e-3):
    """(E, B), each (N, 3, 3) in s^-2, at time t and positions x (N, 3).
    The finite-difference step is a fraction of the smaller of r and the
    reduced wavelength."""
    x = np.atleast_2d(np.asarray(x, dtype=np.float64))
    t = np.broadcast_to(np.asarray(t, dtype=np.float64), (len(x),))
    r = np.linalg.norm(x, axis=-1)
    scale = np.minimum(r, pair.wavelength / (2.0 * np.pi))
    points = np.concatenate([(c * t)[:, None], x], axis=1)
    R = curvature.riemann_many(metric(pair), points, step_fraction * scale)
    return curvature.tidal_tensors_many(R)
