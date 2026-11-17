"""More vistas (paper, Section XI): how the four stars of a pair of masses move from Newton's pull to the wave; the
spin memory; falling into a black hole with the camera; flying through a still room near the speed of light; what
intensity correlations say about a sky; and a cosmic string, which the camera cannot see where it is.
"""
from __future__ import annotations

import math

import numpy as np

from .pixel import _boost, invariants, motion_alarm, null_vector, stars

C_LIGHT = 299792458.0

# --- the stars of a pair, from Newton to the wave ---------------------------------------------------------------


def pair_reading(static: float, wave: complex) -> np.ndarray:
    """W at a pixel on the axis of a source that lies along -z: its monopole tide (static = GM/r^3) and a wave
    travelling along +z of complex amplitude wave, W = static diag(1, 1, -2) + wave m0 m0^T with m0 = (1, i, 0)/2...
    normalized so that m(z)^T W m(z) = 4 z^2 (wave z^2 - 3 static)."""
    m0 = np.array([1.0, 1j, 0.0])
    return static * np.diag([1.0, 1.0, -2.0]) + wave * np.outer(m0, m0)


def migrating_stars(static: float, wave: complex) -> np.ndarray:
    """Stereographic coordinates of the four stars: z = 0 twice (the wave's direction) and z = +-sqrt(3 static / wave),
    which turn with the wave's phase and reach the wave's direction as the wave outgrows the pull."""
    z = np.sqrt(3 * static / complex(wave))
    return np.array([0.0, 0.0, z, -z])


def crossover_radii(omega: float, v: float) -> dict:
    """Where a pair of total mass M turning at omega with orbital speed v changes over (orders of magnitude): in the
    changing part of the field, from pull (r^-5) to wave (r^-1) at c / omega; in the magnetic part, from the spin
    dipole (G J / c r^4) to the wave, also at c / omega whatever v; and in the whole electric part, from the static
    tide (G M / r^3) to the wave (G M v^2 omega^2 / c^4 r), at (c / omega)(c / v)."""
    return {"changing": C_LIGHT / omega, "magnetic": C_LIGHT / omega, "whole": C_LIGHT / omega * C_LIGHT / v}


# --- the spin memory ------------------------------------------------------------------------------------------------


def spin_memory_pattern(iota):
    """Leading sky pattern of the spin memory of a non-precessing circular binary, -2Y30, up to a constant:
    sin^2(iota) cos(iota). Odd under iota -> pi - iota: it records which way the pair turned."""
    iota = np.asarray(iota, dtype=float)
    return np.sin(iota) ** 2 * np.cos(iota)


def displacement_memory_pattern(iota):
    """The displacement memory's sin^2(iota)(17 + cos^2(iota)), even under iota -> pi - iota."""
    iota = np.asarray(iota, dtype=float)
    return np.sin(iota) ** 2 * (17 + np.cos(iota) ** 2)


# --- falling into a black hole -------------------------------------------------------------------------------------


def shadow_static(r: float) -> float:
    """Angular radius of a Schwarzschild hole's shadow, from the hole's direction, for an observer at rest at r
    (units of GM/c^2, r > 2): sin(alpha) = sqrt(27) / r * sqrt(1 - 2/r), alpha > 90 deg inside r = 3."""
    s = math.sqrt(27.0) / r * math.sqrt(1 - 2 / r)
    a = math.asin(min(1.0, s))
    return a if r >= 3 else math.pi - a


def shadow_falling(r: float) -> float:
    """The same for an observer falling freely from rest far away, who passes the static one inward at
    v = sqrt(2 / r): aberration toward the direction of motion, cos a' = (cos a + v) / (1 + v cos a)."""
    a = shadow_static(r)
    v = math.sqrt(2 / r)
    return math.acos((math.cos(a) + v) / (1 + v * math.cos(a)))


def shadow_at_horizon() -> float:
    """The falling observer's shadow at r = 2, as a limit: cos a' = 23/31."""
    return math.acos(23 / 31)


def falling_tide(r: float, mass_term: float = 1.0) -> np.ndarray:
    """W read by a camera falling radially: the static tide diag(1, 1, -2) GM/r^3, unchanged by a boost along the
    radial axis, which commutes with it; no magnetic part, and nothing special at the horizon."""
    W0 = mass_term / r**3 * np.diag([1.0, 1.0, -2.0]).astype(complex)
    L = _boost(np.array([0.0, 0.0, -math.sqrt(2 / r) * C_LIGHT]))
    return L @ W0 @ L.T


# --- flying through a still room ------------------------------------------------------------------------------------


def flown(W0, beta: float, axis=(1.0, 0.0, 0.0)) -> np.ndarray:
    """A static scene's W read by a pixel moving at speed beta c along axis: the scene moves at -beta."""
    u = np.asarray(axis, dtype=float) / np.linalg.norm(axis)
    L = _boost(-beta * C_LIGHT * u)
    return L @ np.asarray(W0, dtype=complex) @ L.T


def star_angles_from_forward(W, axis=(1.0, 0.0, 0.0)) -> np.ndarray:
    """Angles (rad) of the four stars from the direction the pixel moves, in the convention of stars(): a star is a
    propagation direction, so stars toward which the pixel flies point back along -axis."""
    u = np.asarray(axis, dtype=float) / np.linalg.norm(axis)
    s = stars(W)
    return np.arccos(np.clip(-s @ u, -1, 1))


# --- intensity correlations ---------------------------------------------------------------------------------------


def g2_single(kind: str, n: float = 1.0) -> float:
    """Zero-delay intensity correlation of one mode: coherent 1, thermal 2, single-mode squeezed vacuum 3 + 1/n."""
    return {"coherent": 1.0, "thermal": 2.0, "squeezed": 3.0 + 1.0 / n}[kind]


def g2_pair(n: float) -> float:
    """Cross-correlation of the two modes (k, -k) of a two-mode squeezed vacuum of mean occupation n per mode:
    <a+ b+ b a> / n^2 = 2 + 1/n. Each mode alone is thermal (g2 = 2); classical fields obey g2_ab <= 2."""
    return (2 * n**2 + n) / n**2


def g2_pair_from_state(n: float, cutoff: int = 200) -> tuple[float, float]:
    """The same from the state itself, sum_k sqrt(1 - x) x^(k/2) |k, k>, x = tanh^2 r = n / (1 + n):
    (cross-correlation, one mode's own g2)."""
    x = n / (1 + n)
    k = np.arange(cutoff)
    p = (1 - x) * x**k
    nn = (p * k).sum()
    return float((p * k * k).sum() / nn**2), float((p * k * (k - 1)).sum() / nn**2)


# --- a cosmic string -------------------------------------------------------------------------------------------------


def string_deficit(mu: float) -> float:
    """The angle missing around a straight string of mass mu per length: 8 pi G mu / c^2 (rad). Outside its core
    space is flat: every pixel reads zero."""
    from .constants import G
    return 8 * math.pi * G * mu / C_LIGHT**2


def string_step(mu: float, v: float) -> float:
    """The fractional step in a background's temperature across a string moving at v across the line of sight
    (Kaiser and Stebbins): 8 pi G mu gamma v / c^3, at most."""
    gamma = 1 / math.sqrt(1 - (v / C_LIGHT) ** 2)
    return string_deficit(mu) * gamma * v / C_LIGHT


def null_check():
    return null_vector(0.0), invariants, motion_alarm
