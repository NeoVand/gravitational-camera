"""Mass currents: what the gravitomagnetic half of a pixel's reading images.

A pixel records the magnetic part of the tidal field, B_ij, as well as the
electric part E_ij. In the slow-motion limit B_ij is sourced by the momentum
density rho v the way E_ij is sourced by rho, and a current element at
distance r contributes in proportion to 1 / r^3 just as a mass element does.
So by the argument of the tidal column (scenes/README.md), the magnetic
channel of a camera images the *current column*

    J(n) = integral of rho(r n) v(r n) dr / r        (kg m^-2 s^-1)

along each line of sight beyond the exclusion radius, with the same blur law
and with a signal smaller than the mass image's by about v / c.

For a sphere turning rigidly at angular velocity w about a point s (both
measured from the observer), v(x) = w x (x - s), and along the ray x = r n
the integral is closed:

    J = rho [ (w x n) L - (w x s) ln(b / a) ],    L = b - a,

with a and b where the ray enters and leaves the sphere (raised to the
exclusion radius) and rho the sphere's density contrast with its parent.
Still objects carry no current.
"""
from __future__ import annotations

import math

import numpy as np

from . import columns
from .scene import Scene


def current_column(scene: Scene, directions, origin=None, exclusion=None) -> np.ndarray:
    """J along each unit direction; shape (n, 3)."""
    origin = scene.observer if origin is None else np.asarray(origin, dtype=np.float64)
    exclusion = scene.exclusion if exclusion is None else float(exclusion)
    d = np.atleast_2d(np.asarray(directions, dtype=np.float64))
    out = np.zeros(d.shape)
    for obj in scene.objects:
        if obj.spin is None or obj.spin.rate == 0:
            continue
        near, far = columns.ray_sphere_distances(origin, d, obj.shape.center, obj.shape.radius)
        hit = far > np.maximum(near, exclusion)
        a = np.maximum(np.maximum(near, 0.0), exclusion)
        b = np.maximum(far, exclusion)
        parent = scene[obj.parent].material.density if obj.parent else 0.0
        rho = obj.material.density - parent
        w = 2.0 * math.pi * obj.spin.rate * np.asarray(obj.spin.axis)
        s = np.asarray(obj.spin.center) - origin
        length = np.where(hit, b - a, 0.0)
        with np.errstate(divide="ignore", invalid="ignore"):
            log = np.where(hit, np.log(np.where(hit, b / a, 1.0)), 0.0)
        out += rho * (np.cross(w, d) * length[:, None] - np.cross(w, s)[None, :] * log[:, None])
    return out
