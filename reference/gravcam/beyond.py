"""Beyond general relativity, in one reading of one pixel (paper, Section III).

For any plane wave of the metric, h_mu nu(t - n k.x / c) with phase speed v_p = c / n and any of the six
polarizations a metric theory allows (Eardley, Lee and Lightman, Phys. Rev. D 8, 3308, 1973), the second Bianchi
identity gives, with no field equations assumed,

    B = n [k]x E,        ([k]x E)_ij = eps_ipq k_p E_qj.

So one reading of E (symmetric, six numbers including its trace) and B (eight: trace-free, with an antisymmetric
part) gives the wave's direction (k^T B = 0), its phase speed (n), all six polarizations (E in the wave's frame) and
five consistency checks (`invert_one_reading`). In general relativity n = 1 and only the two tensor modes appear.

Two massive alternatives differ in sign: for the helicity-0 mode of a Fierz-Pauli massive graviton
E_l / E_b = -2 (1 - n^2); for a massive scalar (h = phi eta) E_l / E_b = +(1 - n^2), with E_b the breathing and E_l
the longitudinal amplitude.

Tested in tests/test_beyond.py (from Carbon's answer, design/sources; confirmed independently).
"""
from __future__ import annotations

import math

import numpy as np

from .constants import c

ETA = np.diag([-1.0, 1.0, 1.0, 1.0])


def cross_matrix(k) -> np.ndarray:
    k = np.asarray(k, dtype=float)
    return np.array([[0.0, -k[2], k[1]], [k[2], 0.0, -k[0]], [-k[1], k[0], 0.0]])


def metric_wave(eps_lower, n: float, k, omega: float):
    """h(x0, x) = eps cos(omega x0/c - n omega k.x/c) for a symmetric 4x4 eps with lower indices."""
    eps_lower = np.asarray(eps_lower, dtype=float)
    k = np.asarray(k, dtype=float)

    def h(x0: float, x) -> np.ndarray:
        return eps_lower * math.cos(omega * x0 / c - n * omega * (k @ np.asarray(x)) / c)

    return h


def wave_frame(k, e1=None):
    """(e1, e2, k) right-handed, with e1 chosen across k (or as given)."""
    k = np.asarray(k, dtype=float) / np.linalg.norm(k)
    if e1 is None:
        a = np.array([1.0, 0, 0]) if abs(k[0]) < 0.9 else np.array([0, 1.0, 0])
        e1 = np.cross(a, k)
    e1 = np.asarray(e1, dtype=float)
    e1 = e1 - (e1 @ k) * k
    e1 /= np.linalg.norm(e1)
    return e1, np.cross(k, e1), k


def invert_one_reading(E, B, e1=None):
    """(k, n, polarizations, residual) from one reading. Polarizations, in the frame (e1, e2, k):
    plus = (E11 - E22)/2, cross = E12, x = E13, y = E23, b = (E11 + E22)/2, l = E33."""
    E, B = np.asarray(E, dtype=float), np.asarray(B, dtype=float)
    U, s, Vt = np.linalg.svd(B)
    k = U[:, -1]                                            # k^T B = 0
    KE = cross_matrix(k) @ E
    n = float(np.sum(B * KE) / np.sum(KE * KE))
    if n < 0:
        k, n = -k, -n
        KE = -KE
    residual = float(np.linalg.norm(B - n * KE) / np.linalg.norm(B))
    f1, f2, f3 = wave_frame(k, e1)
    R = np.stack([f1, f2, f3])
    Ew = R @ E @ R.T
    pol = {"plus": 0.5 * (Ew[0, 0] - Ew[1, 1]), "cross": Ew[0, 1], "x": Ew[0, 2], "y": Ew[1, 2],
           "b": 0.5 * (Ew[0, 0] + Ew[1, 1]), "l": Ew[2, 2]}
    return k, n, pol, residual


def fierz_pauli_helicity0(n: float, k) -> np.ndarray:
    """The helicity-0 polarization of a massive spin-2 wave with c k / omega = n < 1, lower indices: traceless and
    transverse to the four-momentum p = (1, n k), built from the longitudinal unit vector L orthogonal to p."""
    k = np.asarray(k, dtype=float) / np.linalg.norm(k)
    p = np.array([1.0, *(n * k)])
    gamma = 1.0 / math.sqrt(1.0 - n * n)
    L = gamma * np.array([n, *k])                           # L.p = 0, L.L = 1
    P = np.linalg.inv(ETA) + np.outer(p, p) / (1.0 - n * n)
    eps_upper = np.outer(L, L) - P / 3.0
    return ETA @ eps_upper @ ETA


def scalar_mode() -> np.ndarray:
    """h_mu nu = phi eta_mu nu (a massive scalar of scalar-tensor gravity), lower indices."""
    return ETA.copy()


def wave_vector(E, B) -> np.ndarray:
    """p = (c / v_p) k from one reading, by Eq. wave-vector: (|E|^2 - E^2) p = sum_j e_j x b_j over the columns of E
    and B, which follows from B = [p]x E. Solvable whenever E has rank two or more."""
    E = np.asarray(E, dtype=float)
    B = np.asarray(B, dtype=float)
    H = np.sum(E * E) * np.eye(3) - E @ E
    d = sum(np.cross(E[:, j], B[:, j]) for j in range(3))
    return np.linalg.solve(H, d)
