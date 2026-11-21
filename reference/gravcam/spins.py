"""A reading as four spins, and what one of the four knows (design/SYNTHESIS.md, Section 3.2).

A reading W = E + iB, complex, symmetric and trace-free (pixel.py), is a state of spin two, and so a symmetric state
of four spins one half whose Majorana points are the four principal null directions of the field (Penrose;
Bengtsson and Zyczkowski 2017; Kam 2026). A turn of the pixel turns every spin alike, and a boost acts on every
spin as the same filter.

The state of one spin. Trace out three of the four. The one that is left is in the state

    rho_1 = (1/2) (1 + (P / w) . sigma),        w = (|E|^2 + |B|^2) / 2,        P_k = eps_kij (E B)_ij,

with w the super-energy and P the super-Poynting vector: its Bloch vector is what the pixel's speedometer reads.
The reason is short. The Bloch vector of one spin of a symmetric state of four is half the mean angular momentum,
and for the spin-two state W the mean of J_k is <W, J_k W> / <W, W> = 4 P_k / 2 w.

What follows.

  - The spin is pure exactly for one plane wave, W = m m^T with m . m = 0, where |P| = w: the product state
    (Petrov type N), with its Bloch vector along the wave's direction of travel. A reading of type III gives a
    Bloch vector of length 1/2, and the tide of masses at rest, where W is real, gives none.
  - An observer who moves past the pixel with the small rapidity -d theta reads the super-energy w + 4 P . d theta:
    more, moving against P. So the only frame in which the reading is stationary is the field's rest frame, P = 0
    (pixel.polar: E and B share their axes there). In that frame every spin is maximally mixed, rho_1 = 1/2, and
    the reading is least: |W|^2 = sum_a |w_a|^2, with w_a the eigenvalues of W, which no observer changes. This is
    the normal form of a state under local filters (Verstraete, Dehaene and De Moor 2003).

The four spins are built here by matching ladders: the tensor of highest weight, e_+ e_+^T with e_+ = -(1, i, 0) /
sqrt 2, stands for all four spins up, and J_- is applied with the standard factors on both sides.

Tested in tests/test_spins.py.
"""
from __future__ import annotations

import math
from functools import lru_cache

import numpy as np
from scipy.linalg import expm

from .pixel import polar

EPSILON = np.zeros((3, 3, 3))
for _i, _j, _k in ((0, 1, 2), (1, 2, 0), (2, 0, 1)):
    EPSILON[_i, _j, _k], EPSILON[_i, _k, _j] = 1.0, -1.0

SIGMA = (np.array([[0, 1], [1, 0]], dtype=complex), np.array([[0, -1j], [1j, 0]]),
         np.array([[1, 0], [0, -1]], dtype=complex))
"""Pauli's matrices."""


# --- the reading as a state of four spins ---------------------------------------------------------------------------


def spin_two(k: int, W) -> np.ndarray:
    """J_k W = J W + W J^T for a tensor W, with (J_k)_ij = -i eps_kij the spin of a Cartesian vector."""
    J = -1j * EPSILON[k]
    return J @ W + W @ J.T


def on_spin(a: int, op) -> np.ndarray:
    """The operator `op` on the a-th of four spins and the identity on the rest: 16 x 16."""
    out = np.eye(1, dtype=complex)
    for b in range(4):
        out = np.kron(out, op if b == a else np.eye(2, dtype=complex))
    return out


def total_spin(k: int) -> np.ndarray:
    """J_k of the four spins: sum_a sigma_k / 2."""
    return sum(on_spin(a, SIGMA[k]) / 2 for a in range(4))


@lru_cache(maxsize=1)
def ladders() -> tuple[dict, dict]:
    """The five states of spin two on both sides, m = 2, ..., -2: as symmetric trace-free tensors t_m, orthonormal
    under tr(t^+ t'), and as symmetric states q_m of four spins; t_2 = e_+ e_+^T and q_2 = all four up, the rest by
    J_- with the factor sqrt(6 - m (m - 1))."""
    e_plus = -np.array([1, 1j, 0]) / math.sqrt(2)
    t = {2: np.outer(e_plus, e_plus)}
    q = {2: np.zeros(16, dtype=complex)}
    q[2][0] = 1.0
    lower = total_spin(0) - 1j * total_spin(1)
    for m in (2, 1, 0, -1):
        factor = math.sqrt(6 - m * (m - 1))
        t[m - 1] = (spin_two(0, t[m]) - 1j * spin_two(1, t[m])) / factor
        q[m - 1] = lower @ q[m] / factor
    return t, q


def four_spins(W) -> np.ndarray:
    """The reading W as a state of four spins: sum_m <t_m, W> q_m, sixteen complex amplitudes, symmetric under
    every exchange of the spins. Its norm is that of W."""
    t, q = ladders()
    W = np.asarray(W, dtype=complex)
    return sum(np.vdot(t[m], W) * q[m] for m in t)                  # vdot conjugates its first argument


def one_spin(state) -> np.ndarray:
    """The state of the first spin, the other three traced out: a 2 x 2 density matrix of unit trace. For a
    symmetric state it is the state of any of the four."""
    state = np.asarray(state, dtype=complex)
    rho = np.outer(state, state.conj()) / np.vdot(state, state).real
    return rho.reshape(2, 8, 2, 8).trace(axis1=1, axis2=3)


def bloch_vector(rho) -> np.ndarray:
    """(tr rho sigma_x, tr rho sigma_y, tr rho sigma_z) of the state of one spin."""
    return np.array([np.trace(rho @ s).real for s in SIGMA])


def purity(rho) -> float:
    """tr rho^2: one for a pure state, one half for the maximally mixed state of one spin."""
    return float(np.trace(rho @ rho).real)


# --- the super-energy and its flow ----------------------------------------------------------------------------------


def super_energy(W) -> float:
    """w = (|E|^2 + |B|^2) / 2 = |W|^2 / 2."""
    return 0.5 * float(np.sum(np.abs(np.asarray(W)) ** 2))


def super_poynting(W) -> np.ndarray:
    """P_k = eps_kij (E B)_ij, for W = E + iB."""
    W = np.asarray(W, dtype=complex)
    return np.einsum("kij,ij->k", EPSILON, W.real @ W.imag)


def speedometer(W) -> np.ndarray:
    """P / w: the Bloch vector of each of the four spins. Its length is at most one, and one for a single plane
    wave."""
    return super_poynting(W) / super_energy(W)


# --- observers ------------------------------------------------------------------------------------------------------


def boosted(theta, W) -> np.ndarray:
    """The reading in a frame in which the frame of W moves with the rapidity vector theta, which is that of an
    observer who moves past the pixel with the rapidity -theta: L W L^T with L = exp(i [theta]x), a rotation
    through an imaginary angle (pixel.py)."""
    t = np.asarray(theta, dtype=float)
    K = np.array([[0.0, -t[2], t[1]], [t[2], 0.0, -t[0]], [-t[1], t[0], 0.0]])
    L = expm(1j * K)
    return L @ np.asarray(W, dtype=complex) @ L.T


def rest_frame(W) -> tuple[np.ndarray, np.ndarray]:
    """The reading in the field's rest frame, and the rapidity theta with which that frame moves past the pixel
    (pixel.polar): the reading is boosted(-theta, W). Needs three distinct eigenvalues."""
    _, _, theta = polar(W)
    return boosted(-theta, W), theta


def least_reading(W) -> float:
    """sum_a |w_a|^2 over the eigenvalues of W: the least |W|^2 that any observer reads, reached in the field's rest
    frame."""
    return float(np.sum(np.abs(np.linalg.eigvals(np.asarray(W, dtype=complex))) ** 2))
