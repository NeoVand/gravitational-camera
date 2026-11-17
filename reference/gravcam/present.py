"""The camera sees the present; light sees the past (paper, Section III).

- A body moving uniformly. Its exact linearized field is its static field boosted (curvature.boosted_masses_metric),
  which depends on where the body is now, not where it was when the field at the pixel "left" it. So the stretch axis
  of E points at the body's present position, at any speed; light from it shows the retarded position, displaced by
  the aberration angle, about v_perp / c.
- An orbiting pair. Near it (kr << 1) the changing part of the field is Newton's field of the masses' present
  positions to order (kr)^2, while their retarded positions would be off by kr. Retardation cancels to first order
  because mass and momentum are conserved (Laplace, 1805, took the absence of aberration to mean gravity is much faster
  than light; Carlip, Phys. Lett. A 267, 81, 2000, showed that it is what general relativity predicts).
- The news arrives at c. When a body changes its motion, the field outside the light sphere centred on the change goes
  on pointing at where the body would have been; the change reaches the pixel as a wave.

Tested in tests/test_present.py.
"""
from __future__ import annotations

import math

import numpy as np
from scipy.optimize import brentq

from .constants import G, c


def stretch_axis(E) -> np.ndarray:
    """The eigenvector of E's most negative eigenvalue: the line along which the pixel is stretched (sign free)."""
    vals, vecs = np.linalg.eigh(np.asarray(E, dtype=float))
    return vecs[:, 0]


def angle_between_lines(a, b) -> float:
    a, b = np.asarray(a, dtype=float), np.asarray(b, dtype=float)
    cos = abs(a @ b) / (np.linalg.norm(a) * np.linalg.norm(b))
    return math.acos(min(1.0, cos))


def retarded_position(p0, v, x, t: float = 0.0) -> np.ndarray:
    """Where a body moving as p0 + v t' was when the signal reaching x at time t left it."""
    p0, v, x = (np.asarray(a, dtype=float) for a in (p0, v, x))
    tr = brentq(lambda s: np.linalg.norm(x - (p0 + v * s)) - c * (t - s), t - 1e3 * np.linalg.norm(x - p0) / c - 1, t)
    return p0 + v * tr


def newton_pair(pair, t: float, x) -> np.ndarray:
    """Newton's tidal tensor at x of the pair's two masses at their positions at time t."""
    x = np.asarray(x, dtype=float)
    out = np.zeros((3, 3))
    for s in (1.0, -1.0):
        p = s * 0.5 * pair.d * np.array([math.cos(pair.omega * t), math.sin(pair.omega * t), 0.0])
        R = x - p
        r = np.linalg.norm(R)
        n = R / r
        out += G * pair.m / r ** 3 * (np.eye(3) - 3.0 * np.outer(n, n))
    return out
