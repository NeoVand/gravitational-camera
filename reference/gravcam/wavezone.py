"""The wave zone of a general source (paper, Section V, "A source larger than its wave").

Far from any source, with stress T_kl(t, x) and Fourier transform T~_kl(omega, k) = ∫ dt d^3x T_kl e^{i omega t - i k.x},

    h_ij^TT(omega, R n) = (4 G / c^4 R) e^{i omega R / c} Lambda_ij,kl(n) T~_kl(omega, omega n / c),

so the wave sent toward n at frequency omega carries one Fourier component of the stress, on the sphere |k| = omega/c.
A compact source is the special case k.x << 1 (Eq. quadrupole). A source larger than its wavelength is modelled here as
compact rotors placed apart and driven in step, each a quadrupole point: the sum over them with the phases
e^{-i omega n.x_s / c} is the formula above for that stress, and its "array factor" is the source's form.
"""
from __future__ import annotations

import numpy as np

from .constants import G, c as C


def tt_projector(n) -> np.ndarray:
    """Lambda_ij,kl(n) = P_ik P_jl - P_ij P_kl / 2, P = 1 - n n."""
    n = np.asarray(n, dtype=float)
    P = np.eye(3) - np.outer(n, n)
    return np.einsum("ik,jl->ijkl", P, P) - 0.5 * np.einsum("ij,kl->ijkl", P, P)


def rotor_quadrupole(delta_I: float) -> np.ndarray:
    """Complex amplitude q of Q_ij(t) = Re[q e^{-2 i Omega t}] for a body turning about z with moments differing by dI."""
    return 0.5 * delta_I * np.array([[1.0, 1j, 0.0], [1j, -1.0, 0.0], [0.0, 0.0, 0.0]])


def single_rotor_strain(n, delta_I: float, omega_rot: float, R: float) -> np.ndarray:
    """Complex TT strain amplitude at 2 Omega, distance R toward n, without the common phase e^{i omega R / c}."""
    qdd = -((2 * omega_rot) ** 2) * rotor_quadrupole(delta_I)
    return (2 * G / (C**4 * R)) * np.einsum("ijkl,kl->ij", tt_projector(n), qdd)


def array_factor(n, positions, phases, omega: float) -> complex:
    """sum_s e^{-i phi_s - i omega n.x_s / c}: the Fourier transform of where the rotors are, on the sphere."""
    k = omega / C * np.asarray(n, dtype=float)
    return complex(np.sum(np.exp(-1j * (np.asarray(phases) + np.asarray(positions) @ k))))


def far_strain(n, positions, phases, delta_I, omega_rot, R) -> np.ndarray:
    """The Fourier-formula strain of the array: one rotor's strain times the array factor."""
    return single_rotor_strain(n, delta_I, omega_rot, R) * array_factor(n, positions, phases, 2 * omega_rot)


def exact_strain(point, positions, phases, delta_I, omega_rot) -> np.ndarray:
    """Sum of each rotor's own wave at its true distance and direction, with its own retardation."""
    point = np.asarray(point, dtype=float)
    omega = 2 * omega_rot
    total = np.zeros((3, 3), dtype=complex)
    for x, phi in zip(np.asarray(positions, dtype=float), phases):
        d = point - x
        r = np.linalg.norm(d)
        # each rotor's strain, re-referenced to the common phase e^{i omega R / c} of the origin
        total += single_rotor_strain(d / r, delta_I, omega_rot, r) * np.exp(
            1j * (omega * (r - np.linalg.norm(point)) / C - phi)
        )
    return total


def power_ratio(positions, phases, omega: float, samples: int = 200) -> float:
    """Power of the array over the sum of its rotors' powers: 1 for rotors far apart, N close together and in step."""
    mu = np.linspace(-1, 1, samples + 1)[:-1] + 1.0 / samples  # midpoints in cos(theta)
    phi = np.linspace(0, 2 * np.pi, 2 * samples, endpoint=False)
    one = total = 0.0
    for m in mu:
        s = np.sqrt(1 - m * m)
        for p in phi:
            n = np.array([s * np.cos(p), s * np.sin(p), m])
            w = np.sum(np.abs(single_rotor_strain(n, 1.0, 1.0, 1.0)) ** 2)
            one += w
            total += w * abs(array_factor(n, positions, phases, omega)) ** 2
    return total / (len(positions) * one)


def image_of_pair(separation: float, distance: float, aperture: float, wavelength: float, pixels: int = 401,
                  across=None):
    """The computed image of two equal in-phase sources `separation` apart, seen face on from `distance` by a row of
    pixels `aperture` wide (Eq. beam without the tensor weighting): brightness against position across the source
    plane. The delays undone are those from each point of that plane, not of plane waves, since an array this wide is
    in the sources' Fresnel zone (aperture^2 / (wavelength distance) >> 1)."""
    k = 2 * np.pi / wavelength
    xs = np.linspace(-aperture / 2, aperture / 2, pixels)
    field = np.zeros(pixels, dtype=complex)
    for sx in (-separation / 2, separation / 2):
        r = np.sqrt((xs - sx) ** 2 + distance**2)
        field += np.exp(1j * k * r) / r
    if across is None:
        across = np.linspace(-2.5, 2.5, 501) * separation
    r = np.sqrt((xs[None, :] - across[:, None]) ** 2 + distance**2)
    return across, np.abs(np.exp(-1j * k * r) @ field) ** 2


def resolved(separation: float, distance: float, aperture: float, wavelength: float) -> bool:
    """Whether the image of the pair dips between them by at least a fifth (a Rayleigh-like criterion)."""
    u, I = image_of_pair(separation, distance, aperture, wavelength)
    return I[len(u) // 2] < 0.8 * I.max()
