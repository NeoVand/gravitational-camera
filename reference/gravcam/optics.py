"""What ordinary matter can do to a gravitational wave, and how a body glows: its surface against its volume.

The optics bound (paper, Section VII, Eq. optics-bound). For a body of mass M and radius R, compactness
C = G M / (R c^2), and a wave of reduced wavelength lambda-bar = c / omega crossing it (a path 2R):

    phase delay          dphi = 3 C (lambda-bar / R)                     (index of Peters 1974, Eq. index)
    reflected amplitude  |r|  = 3 C (c_T / c)^2 (lambda-bar / R)^2       (dispersion of an elastic medium, Press 1979)
    optical depth        tau  = 24 C (c_T / c)^2 (lambda-bar / R) / Q    (alpha = 16 pi G eta / c^3, Re eta = rho c_T^2 / (omega Q))
    focal ratio          N    = 1 / (8 C)                                (the body as a gravitational lens, Eq. lens-compactness)

Surface against volume (paper, Section VI). An elastic sphere without internal damping glows from its surface; below
its Debye temperature its luminosity is (Dehnen, Romero & Schaefer 1984, Eq. 6.7, in SI)

    L_S = 4 pi R^2 (pi^2 / 24) (1 + 3 c_T / 2 c_L) G rho c_T^3 (k T)^2 / (hbar c^5).

By Kirchhoff's law this is the surface absorbing the fraction a(omega) = pi^2 (1 + 3 c_T / 2 c_L) G rho c_T^3 / (c^3 omega^2)
of an incident wave: Dyson's absorption by an elastic body (1969), as Smolin (1985) writes it, with its constant. Friction
inside, Re eta = rho c_T^2 / (omega Q), makes the volume glow, Eq. kirchhoff:

    L_V = V 32 zeta(3) G rho c_T^2 (k T)^3 / (pi c^5 Q hbar^2),

so that L_V / L_S = [256 zeta(3) / pi^3 (1 + 3 c_T / 2 c_L)] R / l_s, with l_s = Q hbar c_T / (k T) the distance a
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
    """Fraction of a wave absorbed at the surface of a lossless elastic body (reproduces L_S by Kirchhoff's law)."""
    return math.pi**2 * (1 + 1.5 * c_shear / c_long) * G * density * c_shear**3 / (c**3 * omega**2)


def surface_luminosity_sphere(radius: float, density: float, c_shear: float, c_long: float, temperature: float) -> float:
    """Dehnen, Romero & Schaefer (1984), Eq. (6.7), for T below the Debye temperature (W)."""
    kT = kB * temperature
    return (
        4 * math.pi * radius**2 * (math.pi**2 / 24) * (1 + 1.5 * c_shear / c_long)
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
    """L_V / L_S = 256 zeta(3) / [pi^3 (1 + 3 c_T / 2 c_L)] * R / l_s."""
    l_s = damping_length(c_shear, quality, temperature)
    return 256 * ZETA3 / (math.pi**3 * (1 + 1.5 * c_shear / c_long)) * radius / l_s
