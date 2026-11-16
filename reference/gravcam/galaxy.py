"""The Milky Way as seen from the Sun, in light and in gravitational waves.

One smooth model of the Galaxy's stars, seen two ways. In light the stars'
glow is dimmed by dust; gravitational waves pass through. The waves here are
those of the Galaxy's tens of millions of close white-dwarf binaries at
millihertz frequencies, which trace the stars, so each picture is the same
column integral of Eq. (column) in the paper,

    I(n) = int j(s n) exp(-tau(s)) ds,     tau(s) = int_0^s kappa(s' n) ds',

with tau = 0 for the waves. Brightness is relative: what the model fixes is
where the sky is bright, not how bright.

The model (lengths in kpc; masses in solar masses), rounded from the review by
Bland-Hawthorn and Gerhard (2016):

    thin disc    exp(-R / 2.6 - |z| / 0.3),          3.5e10
    thick disc   exp(-R / 2.0 - |z| / 0.9),          0.6e10
    bulge        exp(-m / 0.5), m^2 = R^2 + (z / 0.6)^2,   1.5e10
    dust         exp(-R / 3.2 - |z| / 0.1), with 1 magnitude of visual
                 extinction per kpc in the plane at the Sun

The Sun is 8.2 kpc from the centre, 0.02 kpc above the plane. The light of the
stars is taken in proportion to their mass, and so are the binaries; dust
extinction is 1.32 and 0.75 times the visual in blue and red light.
"""
from __future__ import annotations

import math

import numpy as np

R_SUN = 8.2
Z_SUN = 0.02

THIN = dict(mass=3.5e10, length=2.6, height=0.3)
THICK = dict(mass=0.6e10, length=2.0, height=0.9)
BULGE = dict(mass=1.5e10, scale=0.5, flattening=0.6)
DUST = dict(length=3.2, height=0.1, visual_per_kpc=1.0)
REDDENING = np.array([0.75, 1.0, 1.32])     # extinction in red, green (visual) and blue, over visual

MAG = 2.5 / math.log(10.0)                  # magnitudes per unit optical depth


def _disc(R, z, mass, length, height):
    sigma0 = mass / (2.0 * math.pi * length ** 2)
    return sigma0 / (2.0 * height) * np.exp(-R / length - np.abs(z) / height)


def _bulge(R, z, mass, scale, flattening):
    m = np.sqrt(R * R + (z / flattening) ** 2)
    rho0 = mass / (8.0 * math.pi * flattening * scale ** 3)
    return rho0 * np.exp(-m / scale)


def stellar_density(x, y, z):
    """Solar masses per cubic kpc at galactocentric (x, y, z), kpc."""
    R = np.hypot(x, y)
    return _disc(R, z, **THIN) + _disc(R, z, **THICK) + _bulge(R, z, **BULGE)


def dust_opacity(x, y, z):
    """Visual optical depth per kpc."""
    R = np.hypot(x, y)
    kappa_sun = DUST["visual_per_kpc"] / MAG
    return kappa_sun * np.exp(-(R - R_SUN) / DUST["length"] - np.abs(z) / DUST["height"])


def direction(l, b):
    """Unit vectors toward galactic longitude l and latitude b (radians), with
    the centre at l = 0 along +x and the Galaxy turning toward l = 90 deg (+y)."""
    l, b = np.broadcast_arrays(np.asarray(l, dtype=np.float64), np.asarray(b, dtype=np.float64))
    return np.stack([np.cos(b) * np.cos(l), np.cos(b) * np.sin(l), np.sin(b)], axis=-1)


def _path(reach: float, steps: int):
    """Sample distances and weights along a line of sight, finer near the Sun."""
    k = (np.arange(steps) + 0.5) / steps
    s = reach * k * k
    ds = reach * 2.0 * k / steps
    return s, ds


def sky(dirs, reach: float = 40.0, steps: int = 1200):
    """(light, waves) toward each unit vector in dirs (..., 3). light is
    (..., 3): red, green and blue, in solar masses per kpc^2 seen through the
    dust; waves is (...): the same column without dust."""
    dirs = np.asarray(dirs, dtype=np.float64)
    flat = dirs.reshape(-1, 3)
    s, ds = _path(reach, steps)
    light = np.zeros((len(flat), 3))
    waves = np.zeros(len(flat))
    for start in range(0, len(flat), 2048):
        d = flat[start:start + 2048]
        x = -R_SUN + s[None, :] * d[:, 0:1]
        y = s[None, :] * d[:, 1:2]
        z = Z_SUN + s[None, :] * d[:, 2:3]
        rho = stellar_density(x, y, z)
        kappa = dust_opacity(x, y, z)
        tau = np.cumsum(kappa * ds, axis=1) - 0.5 * kappa * ds
        waves[start:start + 2048] = np.sum(rho * ds, axis=1)
        for k in range(3):
            light[start:start + 2048, k] = np.sum(rho * np.exp(-REDDENING[k] * tau) * ds, axis=1)
    return light.reshape(dirs.shape[:-1] + (3,)), waves.reshape(dirs.shape[:-1])


def visual_extinction(dirs, reach: float = 40.0, steps: int = 4000):
    """Total visual extinction, in magnitudes, out of the Galaxy along dirs."""
    dirs = np.atleast_2d(np.asarray(dirs, dtype=np.float64))
    s, ds = _path(reach, steps)
    x = -R_SUN + s[None, :] * dirs[:, 0:1]
    y = s[None, :] * dirs[:, 1:2]
    z = Z_SUN + s[None, :] * dirs[:, 2:3]
    return MAG * np.sum(dust_opacity(x, y, z) * ds, axis=1)


def mollweide_grid(width: int, height: int):
    """Galactic (l, b) at the pixels of a Mollweide map centred on the Galactic
    centre, with longitude increasing to the left; NaN outside the ellipse."""
    x = (np.arange(width) + 0.5) / width * 4.0 * math.sqrt(2.0) - 2.0 * math.sqrt(2.0)
    y = math.sqrt(2.0) - (np.arange(height) + 0.5) / height * 2.0 * math.sqrt(2.0)
    X, Y = np.meshgrid(x, y)
    inside = (X / (2.0 * math.sqrt(2.0))) ** 2 + (Y / math.sqrt(2.0)) ** 2 <= 1.0
    theta = np.arcsin(np.clip(Y / math.sqrt(2.0), -1, 1))
    b = np.arcsin(np.clip((2 * theta + np.sin(2 * theta)) / math.pi, -1, 1))
    l = -math.pi * X / (2.0 * math.sqrt(2.0) * np.cos(theta))
    l = np.where(inside, l, np.nan)
    b = np.where(inside, b, np.nan)
    return l, b
