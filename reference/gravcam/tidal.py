"""Newtonian tidal tensor E_ij = d_i d_j Phi (s^-2) of uniform spheres.

For a uniform sphere of mass M, radius R and density rho, at offset x = r n
from its centre:

    outside (r >= R):  E_ij = (G M / r^3) (delta_ij - 3 n_i n_j)     trace 0
    inside  (r <  R):  E_ij = (G M / R^3) delta_ij
                            = (4 pi G rho / 3) delta_ij              trace 4 pi G rho

with Phi = -G M / r outside and -G M (3 R^2 - r^2) / (2 R^3) inside.

A scene of nested spheres is a superposition of uniform spheres: each object
contributes a full sphere of its shape with the density contrast
rho(object) - rho(parent). (Signed superposition is exact here and is what the
project asks for; only the thermal columns must avoid it.)

The tensor is discontinuous across a surface; a point exactly on a surface is
treated as outside it.
"""
from __future__ import annotations

import math

import numpy as np

from .constants import G
from .scene import Scene

_IDENTITY = np.eye(3)


def _offset(point, center):
    x = np.asarray(point, dtype=np.float64) - np.asarray(center, dtype=np.float64)
    if x.shape[-1] != 3:
        raise ValueError("points must have shape (..., 3)")
    return x, np.sqrt(np.einsum("...c,...c->...", x, x))


def point_mass_tidal_tensor(point, center, mass: float) -> np.ndarray:
    """(G M / r^3) (delta_ij - 3 n_i n_j) at ``point``; shape (..., 3, 3)."""
    x, r = _offset(point, center)
    n = x / r[..., None]
    return (G * mass / r**3)[..., None, None] * (_IDENTITY - 3.0 * n[..., :, None] * n[..., None, :])


def uniform_sphere_tidal_tensor(point, center, radius: float, mass: float) -> np.ndarray:
    """Tidal tensor of a uniform sphere at ``point``; shape (..., 3, 3)."""
    x, r = _offset(point, center)
    outside = r >= radius
    safe_r = np.where(outside, r, 1.0)      # avoids 0/0 at the centre; unused inside
    n = x / safe_r[..., None]
    exterior = (G * mass / safe_r**3)[..., None, None] * (_IDENTITY - 3.0 * n[..., :, None] * n[..., None, :])
    interior = (G * mass / radius**3) * _IDENTITY
    return np.where(outside[..., None, None], exterior, interior)


def uniform_sphere_potential(point, center, radius: float, mass: float) -> np.ndarray:
    """Newtonian potential Phi (m^2 s^-2) of a uniform sphere; shape (...)."""
    _, r = _offset(point, center)
    outside = r >= radius
    safe_r = np.where(outside, r, 1.0)
    exterior = -G * mass / safe_r
    interior = -G * mass * (3.0 * radius**2 - r**2) / (2.0 * radius**3)
    return np.where(outside, exterior, interior)


def uniform_spheres(scene: Scene, roots=None) -> list[tuple[str, tuple[float, float, float], float, float]]:
    """The scene as a superposition of uniform spheres.

    Returns ``(object id, centre, radius, mass)`` for each selected object,
    where mass = (density - parent's density) x the volume of the full shape.

    ``roots`` selects subtrees by object id (default: the whole scene). A
    selected root is taken on its own, embedded in vacuum, so
    ``roots=["earth"]`` is the Earth and all its layers without the Sun.
    """
    root_ids = scene.roots if roots is None else tuple(roots)
    selected: dict[str, bool] = {}
    for root in root_ids:
        for object_id in scene.subtree(root):
            if object_id in selected:
                raise ValueError(f"object {object_id!r} is selected twice; roots must not be nested")
            selected[object_id] = object_id == root
    spheres = []
    for obj in scene.objects:
        if obj.id not in selected:
            continue
        is_root = selected[obj.id]
        background = 0.0 if is_root else scene[obj.parent].material.density
        mass = (obj.material.density - background) * obj.shape.volume
        spheres.append((obj.id, obj.shape.center, obj.shape.radius, mass))
    return spheres


def scene_mass(scene: Scene, roots=None) -> float:
    """Total mass (kg) of the selected subtrees."""
    return math.fsum(mass for _, _, _, mass in uniform_spheres(scene, roots))


def scene_tidal_tensor(scene: Scene, point, roots=None) -> np.ndarray:
    """Tidal tensor of the scene's matter at ``point``; shape (..., 3, 3)."""
    total = np.zeros(np.asarray(point, dtype=np.float64).shape[:-1] + (3, 3))
    for _, center, radius, mass in uniform_spheres(scene, roots):
        total = total + uniform_sphere_tidal_tensor(point, center, radius, mass)
    return total


def scene_potential(scene: Scene, point, roots=None) -> np.ndarray:
    """Newtonian potential of the scene's matter at ``point``; shape (...)."""
    total = np.zeros(np.asarray(point, dtype=np.float64).shape[:-1])
    for _, center, radius, mass in uniform_spheres(scene, roots):
        total = total + uniform_sphere_potential(point, center, radius, mass)
    return total
