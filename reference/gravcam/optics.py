"""What ordinary matter can do to a gravitational wave, and how a body glows: its surface against its volume.

The optics bound (paper, Section VII, Eq. optics-bound). For a body of mass M and radius R, compactness
C = G M / (R c^2), and a wave of reduced wavelength lambda-bar = c / omega crossing it (a path 2R):

    phase delay          dphi = 3 C (lambda-bar / R)                     (index of Peters 1974, Eq. index)
    reflected amplitude  |r|  = 3 C (c_T / c)^2 (lambda-bar / R)^2       (dispersion of an elastic medium, Press 1979)
    optical depth        tau  = 24 C (c_T / c)^2 (lambda-bar / R) / Q    (alpha = 16 pi G eta / c^3, Re eta = rho c_T^2 / (omega Q))
    focal ratio          N    = 1 / (8 C)                                (the body as a gravitational lens, Eq. lens-compactness)

Surface against volume (paper, Section VI). An elastic sphere without internal damping glows from its surface. A wave
h_ij acts on a free surface of normal n as the traction mu h_ij n_j (Dyson 1969), and a traction of amplitude t sends
the power t^2 / (2 rho c_s) through each unit of area as sound of speed c_s: shear sound for the part along the
surface, compressional sound for the part along the normal. Averaged over the wave's directions and polarizations,
each unit of area has the cross-section

    (32 pi / 5) (1 + 2 c_T / 3 c_L) G rho c_T^3 / (c^3 omega^2),

whichever way it faces; a(omega), four times this, is the fraction absorbed of radiation falling on one side of the
surface. By Kirchhoff's law, below the Debye temperature,

    L_S = 4 pi R^2 (16 pi / 15) (1 + 2 c_T / 3 c_L) G rho c_T^3 (k T)^2 / (hbar c^5).

Dehnen, Romero & Schaefer (1984, Eq. 6.7, in SI) give the same law with the coefficient (pi^2 / 24)(1 + 3 c_T / 2 c_L),
6.1 times smaller for steel. tests/test_optics.py checks the coefficient here against the sum over the quadrupole
modes of a free elastic sphere and against the cross-section of a resonant bar. Friction inside,
Re eta = rho c_T^2 / (omega Q), makes the volume glow, Eq. kirchhoff:

    L_V = V 32 zeta(3) G rho c_T^2 (k T)^3 / (pi c^5 Q hbar^2),

so that L_V / L_S = [10 zeta(3) / pi^2 (1 + 2 c_T / 3 c_L)] R / l_s, with l_s = Q hbar c_T / (k T) the distance a
thermal phonon travels before it is damped.
"""
from __future__ import annotations

import math

from .constants import G, c, hbar, kB

ZETA3 = 1.2020569031595942


def compactness(mass: float, radius: float) -> float:
    return G * mass / (radius * c**2)


def optics_bound(mass: float, radius: float, omega: float, c_shear: float, quality: float) -> dict[str, float]:
    """The four effects of a uniform body on a wave of angular frequency omega."""
    C = compactness(mass, radius)
    lam = c / omega
    return {
        "phase": 3 * C * lam / radius,
        "reflection": 3 * C * (c_shear / c) ** 2 * (lam / radius) ** 2,
        "depth": 24 * C * (c_shear / c) ** 2 * (lam / radius) / quality,
        "focal_ratio": 1 / (8 * C),
    }


def surface_absorptivity(omega: float, density: float, c_shear: float, c_long: float) -> float:
    """Fraction absorbed of radiation falling on one side of the surface of a lossless elastic body: four times the
    cross-section per area, averaged over directions and polarizations (gives L_S by Kirchhoff's law)."""
    return (128 * math.pi / 5) * (1 + 2 * c_shear / (3 * c_long)) * G * density * c_shear**3 / (c**3 * omega**2)


def surface_luminosity_sphere(radius: float, density: float, c_shear: float, c_long: float, temperature: float) -> float:
    """Thermal glow of the surface of a lossless elastic sphere, for T below the Debye temperature (W)."""
    kT = kB * temperature
    return (
        4 * math.pi * radius**2 * (16 * math.pi / 15) * (1 + 2 * c_shear / (3 * c_long))
        * G * density * c_shear**3 * kT**2 / (hbar * c**5)
    )


def volume_luminosity_sphere(radius: float, density: float, c_shear: float, quality: float, temperature: float) -> float:
    """Kirchhoff emission of the volume for a friction Re eta = rho c_T^2 / (omega Q) at every frequency (W)."""
    kT = kB * temperature
    volume = 4 / 3 * math.pi * radius**3
    return volume * 32 * ZETA3 * G * density * c_shear**2 * kT**3 / (math.pi * c**5 * quality * hbar**2)


def damping_length(c_shear: float, quality: float, temperature: float) -> float:
    """l_s = c_T Q / omega at omega = k T / hbar (m)."""
    return quality * hbar * c_shear / (kB * temperature)


def volume_to_surface(radius: float, c_shear: float, c_long: float, quality: float, temperature: float) -> float:
    """L_V / L_S = 10 zeta(3) / [pi^2 (1 + 2 c_T / 3 c_L)] * R / l_s."""
    l_s = damping_length(c_shear, quality, temperature)
    return 10 * ZETA3 / (math.pi**2 * (1 + 2 * c_shear / (3 * c_long))) * radius / l_s
