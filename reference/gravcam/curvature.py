"""Curvature from a metric perturbation, by finite differences.

An independent route to the tidal tensors a pixel records, used to check the
closed forms elsewhere (tidal.py, gravitomagnetic.py). With x^0 = c t and
g = eta + h, eta = diag(-1, 1, 1, 1), the linearized Riemann tensor is

    R_abcd = (h_ad,bc + h_bc,ad - h_ac,bd - h_bd,ac) / 2,

and the two tidal tensors, both in s^-2, are

    E_ij = c^2 R_0i0j,        B_ij = (c^2 / 2) eps_ipq R_pqj0.

In vacuum both are symmetric and trace-free, and for a plane wave
|B| = |E| (Frobenius norms). E_ij reduces to d_i d_j Phi for slow matter.

The perturbation of slowly moving point masses, to first order in v / c and
in harmonic gauge, is (instantaneous positions suffice at this order)

    h_00 = 2 G M / (c^2 R),  h_ij = 2 G M / (c^2 R) delta_ij,
    h_0i = -4 G M v_i / (c^3 R).
"""
from __future__ import annotations

import itertools

import numpy as np

from .constants import G, c

EPS = np.zeros((3, 3, 3))
for _i, _j, _k in itertools.permutations(range(3)):
    EPS[_i, _j, _k] = np.linalg.det(np.eye(3)[[_i, _j, _k]])


def moving_masses_metric(masses, positions, velocities):
    """h(x0, x): the metric perturbation of point masses moving uniformly,
    at time t = x0 / c, as a 4x4 array. Positions are at t = 0."""
    masses = np.atleast_1d(np.asarray(masses, dtype=np.float64))
    positions = np.atleast_2d(np.asarray(positions, dtype=np.float64))
    velocities = np.atleast_2d(np.asarray(velocities, dtype=np.float64))

    def h(x0: float, x) -> np.ndarray:
        out = np.zeros((4, 4))
        t = x0 / c
        for m, p, v in zip(masses, positions, velocities):
            R = np.linalg.norm(np.asarray(x) - (p + v * t))
            phi = 2.0 * G * m / (c * c * R)
            out[0, 0] += phi
            out[1:, 1:] += phi * np.eye(3)
            out[0, 1:] += -4.0 * G * m * v / (c ** 3 * R)
            out[1:, 0] = out[0, 1:]
        return out

    return h


def plane_wave_metric(amplitude: float, omega: float, plus: float = 1.0, cross: float = 0.0):
    """h for a transverse-traceless plane wave travelling along +z."""
    k = omega / c

    def h(x0: float, x) -> np.ndarray:
        phase = k * x[2] - k * x0
        out = np.zeros((4, 4))
        out[1, 1] = plus * amplitude * np.cos(phase)
        out[2, 2] = -plus * amplitude * np.cos(phase)
        out[1, 2] = out[2, 1] = cross * amplitude * np.cos(phase)
        return out

    return h


def riemann(h, x0: float, x, step: float) -> np.ndarray:
    """R_abcd at (x0, x) from fourth-order central differences of h, with the
    same step in every coordinate (x0 = c t included)."""
    point = np.concatenate([[x0], np.asarray(x, dtype=np.float64)])

    def at(p):
        return h(p[0], p[1:])

    offsets = [(-2, 1.0 / 12), (-1, -8.0 / 12), (1, 8.0 / 12), (2, -1.0 / 12)]

    def first(p, a):
        out = 0.0
        for k, w in offsets:
            q = p.copy()
            q[a] += k * step
            out = out + w * at(q)
        return out / step

    second = np.zeros((4, 4, 4, 4))   # second[a, b] = d_a d_b h, a 4x4 array
    for a in range(4):
        for b in range(a, 4):
            acc = 0.0
            for k, w in offsets:
                q = point.copy()
                q[a] += k * step
                acc = acc + w * first(q, b)
            second[a, b] = second[b, a] = acc / step
    # R_abcd = (h_ad,bc + h_bc,ad - h_ac,bd - h_bd,ac) / 2, with second[p, q][r, s] = d_p d_q h_rs
    R = np.zeros((4, 4, 4, 4))
    for a, b, cc, d in itertools.product(range(4), repeat=4):
        R[a, b, cc, d] = 0.5 * (second[b, cc][a, d] + second[a, d][b, cc]
                                - second[b, d][a, cc] - second[a, cc][b, d])
    return R


def tidal_tensors(R: np.ndarray):
    """(E, B) in s^-2 from R_abcd, by the definitions in the module docstring."""
    E = c * c * R[0, 1:, 0, 1:]
    B = 0.5 * c * c * np.einsum("ipq,pqj->ij", EPS, R[1:, 1:, 1:, 0])
    return E, B


def riemann_many(h, points, step) -> np.ndarray:
    """R_abcd at many events at once: as `riemann`, for a perturbation
    h(x0, x) that takes arrays x0 of shape (N,) and x of shape (N, 3) and
    returns (N, 4, 4). `points` is (N, 4) with x0 = c t first; `step` is a
    scalar or one step per event. Returns (N, 4, 4, 4, 4)."""
    points = np.atleast_2d(np.asarray(points, dtype=np.float64))
    n = len(points)
    step = np.broadcast_to(np.asarray(step, dtype=np.float64), (n,))
    offsets = [(-2, 1.0 / 12), (-1, -8.0 / 12), (1, 8.0 / 12), (2, -1.0 / 12)]

    def at(shift):
        p = points + shift
        return h(p[:, 0], p[:, 1:])

    unit = np.eye(4)
    second = np.zeros((n, 4, 4, 4, 4))   # second[:, a, b] = d_a d_b h
    for a in range(4):
        for b in range(a, 4):
            acc = np.zeros((n, 4, 4))
            for k, w in offsets:
                for l, v in offsets:
                    shift = (k * unit[a] + l * unit[b])[None, :] * step[:, None]
                    acc += w * v * at(shift)
            second[:, a, b] = second[:, b, a] = acc / (step * step)[:, None, None]
    R = np.zeros((n, 4, 4, 4, 4))
    for a, b, cc, d in itertools.product(range(4), repeat=4):
        R[:, a, b, cc, d] = 0.5 * (second[:, b, cc, a, d] + second[:, a, d, b, cc]
                                   - second[:, b, d, a, cc] - second[:, a, cc, b, d])
    return R


def tidal_tensors_many(R: np.ndarray):
    """(E, B), each (N, 3, 3), from R of shape (N, 4, 4, 4, 4)."""
    E = c * c * R[:, 0, 1:, 0, 1:]
    B = 0.5 * c * c * np.einsum("ipq,npqj->nij", EPS, R[:, 1:, 1:, 1:, 0])
    return E, B
