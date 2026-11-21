"""Where the in-plane shear of a buried body vanishes (design/SYNTHESIS.md, Section 3.4).

Write w = x + iy for a place on the camera's plane, and let a planar body of surface density sigma lie at the depth
z below it. The in-plane shear of its tide on the camera is

    E_xx - E_yy + 2i E_xy = 4 d^2 Phi / d wbar^2 = -3 G int sigma(w_0) (w - w_0)^2 / (|w - w_0|^2 + z^2)^(5/2) d^2 w_0.

Far above the body the denominator is the same for every part of it, and the shear vanishes where M w^2 - 2 D w +
Q_2 does, with M, D and Q_2 the integrals of sigma, sigma w_0 and sigma w_0^2: at

    w = w_cm +- i sqrt(Q_c / M),        Q_c = int sigma (w_0 - w_cm)^2 d^2 w_0,

the body's centre and its complex quadrupole at true scale, whatever the depth. For a body of size R the two zeros
stand there with an error that falls as (R / z)^2. For two equal masses a distance d apart the statement is exact
at every depth: the zeros are at +-i d / 2 from the midpoint, d apart, on the line across the pair.

Tested in tests/test_shearzeros.py.
"""
from __future__ import annotations

import numpy as np
from scipy.optimize import fsolve

from .constants import G


def in_plane_shear(w: complex, w0, masses, z: float) -> complex:
    """E_xx - E_yy + 2i E_xy (s^-2) at the place w = x + iy of the camera's plane, from point masses (kg) at the
    places w0 (complex, metres) of a plane at the depth z below it: -3 G sum m (w - w0)^2 / (|w - w0|^2 + z^2)^(5/2)."""
    d = w - np.asarray(w0, dtype=complex)
    return complex(-3 * G * np.sum(np.asarray(masses) * d * d / (np.abs(d) ** 2 + z * z) ** 2.5))


def complex_quadrupole(w0, masses) -> tuple[float, complex, complex]:
    """(M, w_cm, Q_c) of a planar body: its mass, its centre of mass and its complex quadrupole about that centre,
    Q_c = sum m (w0 - w_cm)^2."""
    w0, m = np.asarray(w0, dtype=complex), np.asarray(masses, dtype=float)
    M = float(m.sum())
    centre = complex((m * w0).sum() / M)
    return M, centre, complex((m * (w0 - centre) ** 2).sum())


def far_zeros(w0, masses) -> tuple[complex, complex]:
    """Where the shear vanishes far above the body: w_cm + i sqrt(Q_c / M) and w_cm - i sqrt(Q_c / M)."""
    M, centre, Q = complex_quadrupole(w0, masses)
    offset = 1j * np.sqrt(Q / M)
    return centre + offset, centre - offset


def zero_near(guess: complex, w0, masses, z: float) -> complex:
    """The zero of the in-plane shear at the depth z nearest the guess, by Newton's method on its two parts."""
    scale = 3 * G * float(np.sum(masses)) / z**3

    def parts(v):
        s = in_plane_shear(v[0] + 1j * v[1], w0, masses, z) / scale
        return [s.real, s.imag]

    x, y = fsolve(parts, [guess.real, guess.imag], xtol=1e-13)
    return complex(x, y)
