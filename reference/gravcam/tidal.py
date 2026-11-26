"""Newtonian tidal tensor E_ij = d_i d_j Phi (s^-2) of uniform spheres and
of uniform axis-aligned boxes (rectangular prisms).

For a uniform sphere of mass M, radius R and density rho, at offset x = r n
from its centre:

    outside (r >= R):  E_ij = (G M / r^3) (delta_ij - 3 n_i n_j)     trace 0
    inside  (r <  R):  E_ij = (G M / R^3) delta_ij
                            = (4 pi G rho / 3) delta_ij              trace 4 pi G rho

with Phi = -G M / r outside and -G M (3 R^2 - r^2) / (2 R^3) inside.

For a uniform box of density rho, with X, Y, Z the offsets from the field
point to a corner, r = sqrt(X^2 + Y^2 + Z^2), and [f] the signed sum of f over
the eight corners (+ for the corner with all three offsets taken at the box's
upper faces, alternating with each change of face; this is the triple definite
integral evaluated at its limits):

    E_xx =  G rho [ arctan(Y Z / (X r)) ]         and cyclically
    E_xy = -G rho [ ln(Z + r) ]                   and cyclically
    Phi  = -G rho [ X Y ln(Z + r) + Y Z ln(X + r) + Z X ln(Y + r)
                    - (X^2 / 2) arctan(Y Z / (X r))
                    - (Y^2 / 2) arctan(Z X / (Y r))
                    - (Z^2 / 2) arctan(X Y / (Z r)) ]

(the classical prism formulas of gravimetry; the three arctangents at a corner
with positive offsets add up to pi/2, which gives the trace 4 pi G rho inside
and 0 outside). They hold at every point that is not on the box's surface.

Numerics of the box formulas:

* ln(Z + r) cancels when Z < 0 and X, Y are small. The two corners of an
  edge along z are therefore taken together, as the logarithm of one ratio,
  with Z + r replaced by (X^2 + Y^2) / (r - Z) where Z is negative.
* arctan(Y Z / (X r)) is the principal value, +-pi/2 when X = 0 (a field
  point in the plane of a face). Outside the face itself the four such terms
  of that face cancel exactly, so the tensor is continuous there, as it must
  be in vacuum.
* The corner sum cancels for a small distant box, leaving a relative error of
  about 1e-16 (distance / size)^3. For boxes that are not small compared with
  their distance (every box in the room scenes) nothing is lost.
* ``detmath.log`` and ``detmath.atan_ratio`` are used, so that the tensors in
  the exported fixtures are bit-reproducible.

A scene of nested spheres and boxes is a superposition of uniform bodies: each
object contributes its full shape with the density contrast
rho(object) - rho(parent). (Signed superposition is exact here and is what the
project asks for; only the columns must avoid it.)

The tensor is discontinuous across a surface; a point exactly on a sphere's
surface is treated as outside it, and on a box's surface the value is not
defined (on an edge it is infinite).
"""
from __future__ import annotations

import math

import numpy as np

from . import detmath
from .constants import G
from .scene import Box, Scene, Shape, Sphere

_IDENTITY = np.eye(3)


def _offset(point, center):
    x = np.asarray(point, dtype=np.float64) - np.asarray(center, dtype=np.float64)
    if x.shape[-1] != 3:
        raise ValueError("points must have shape (..., 3)")
    return x, np.sqrt(x[..., 0] * x[..., 0] + x[..., 1] * x[..., 1] + x[..., 2] * x[..., 2])


def _outer(n):
    # n_i n_j with the product taken first, so the result is exactly symmetric
    return n[..., :, None] * n[..., None, :]


def point_mass_tidal_tensor(point, center, mass: float) -> np.ndarray:
    """(G M / r^3) (delta_ij - 3 n_i n_j) at ``point``; shape (..., 3, 3)."""
    x, r = _offset(point, center)
    n = x / r[..., None]
    return (G * mass / (r * r * r))[..., None, None] * (_IDENTITY - 3.0 * _outer(n))


def uniform_sphere_tidal_tensor(point, center, radius: float, mass: float) -> np.ndarray:
    """Tidal tensor of a uniform sphere at ``point``; shape (..., 3, 3)."""
    x, r = _offset(point, center)
    outside = r >= radius
    safe_r = np.where(outside, r, 1.0)      # avoids 0/0 at the centre; unused inside
    n = x / safe_r[..., None]
    exterior = (G * mass / (safe_r * safe_r * safe_r))[..., None, None] * (_IDENTITY - 3.0 * _outer(n))
    interior = (G * mass / (radius * radius * radius)) * _IDENTITY
    return np.where(outside[..., None, None], exterior, interior)


def uniform_sphere_potential(point, center, radius: float, mass: float) -> np.ndarray:
    """Newtonian potential Phi (m^2 s^-2) of a uniform sphere; shape (...)."""
    _, r = _offset(point, center)
    outside = r >= radius
    safe_r = np.where(outside, r, 1.0)
    exterior = -G * mass / safe_r
    interior = -G * mass * (3.0 * radius * radius - r * r) / (2.0 * radius * radius * radius)
    return np.where(outside, exterior, interior)


def _corner_offsets(point, center, size):
    """Offsets from the field point(s) to the box's faces: three pairs
    (to the lower face, to the upper face), each of shape (...)."""
    p = np.asarray(point, dtype=np.float64)
    if p.shape[-1] != 3:
        raise ValueError("points must have shape (..., 3)")
    pairs = []
    for axis in range(3):
        half = 0.5 * float(size[axis])
        low, high = float(center[axis]) - half, float(center[axis]) + half     # as Box.low, Box.high
        pairs.append((low - p[..., axis], high - p[..., axis]))
    return pairs


def _log_ratio_along(u2, z_low, z_high):
    """ln((z_high + r_high) / (z_low + r_low)) with r = sqrt(u2 + z^2), for
    z_low < z_high, without the cancellation of z + r at negative z."""
    r_low = np.sqrt(u2 + z_low * z_low)
    r_high = np.sqrt(u2 + z_high * z_high)
    with np.errstate(divide="ignore", invalid="ignore"):
        both_ahead = (z_high + r_high) / (z_low + r_low)             # 0 <= z_low
        both_behind = (r_low - z_low) / (r_high - z_high)            # z_high < 0
        astride = (z_high + r_high) * (r_low - z_low) / u2           # z_low < 0 <= z_high
        ratio = np.where(z_low >= 0.0, both_ahead, np.where(z_high < 0.0, both_behind, astride))
        return detmath.log(ratio)


def uniform_box_tidal_tensor(point, center, size, density: float) -> np.ndarray:
    """Tidal tensor of a uniform axis-aligned box at ``point``; shape (..., 3, 3)."""
    x, y, z = _corner_offsets(point, center, size)
    shape = x[0].shape
    xx, yy, zz = np.zeros(shape), np.zeros(shape), np.zeros(shape)
    for i in (0, 1):                     # corners in a fixed order
        for j in (0, 1):
            for k in (0, 1):
                sign = 1.0 if (i + j + k) % 2 == 1 else -1.0
                r = np.sqrt(x[i] * x[i] + y[j] * y[j] + z[k] * z[k])
                xx = xx + sign * detmath.atan_ratio(y[j] * z[k], x[i] * r)
                yy = yy + sign * detmath.atan_ratio(z[k] * x[i], y[j] * r)
                zz = zz + sign * detmath.atan_ratio(x[i] * y[j], z[k] * r)
    xy, yz, zx = np.zeros(shape), np.zeros(shape), np.zeros(shape)
    for i in (0, 1):                     # edges in a fixed order
        for j in (0, 1):
            sign = 1.0 if i == j else -1.0
            xy = xy - sign * _log_ratio_along(x[i] * x[i] + y[j] * y[j], z[0], z[1])
            yz = yz - sign * _log_ratio_along(y[i] * y[i] + z[j] * z[j], x[0], x[1])
            zx = zx - sign * _log_ratio_along(z[i] * z[i] + x[j] * x[j], y[0], y[1])
    scale = G * density
    out = np.empty(shape + (3, 3), dtype=np.float64)
    out[..., 0, 0], out[..., 1, 1], out[..., 2, 2] = scale * xx, scale * yy, scale * zz
    out[..., 0, 1] = out[..., 1, 0] = scale * xy
    out[..., 1, 2] = out[..., 2, 1] = scale * yz
    out[..., 2, 0] = out[..., 0, 2] = scale * zx
    return out


def _product_log(a, b, c, r):
    """a b ln(c + r), with ln(c + r) = ln((a^2 + b^2) / (r - c)) for c < 0
    and the limit 0 where a b = 0."""
    with np.errstate(divide="ignore", invalid="ignore"):
        argument = np.where(c >= 0.0, c + r, (a * a + b * b) / (r - c))
        product = a * b
        return np.where(product == 0.0, 0.0, product * detmath.log(np.where(product == 0.0, 1.0, argument)))


def uniform_box_potential(point, center, size, density: float) -> np.ndarray:
    """Newtonian potential Phi (m^2 s^-2) of a uniform axis-aligned box; shape (...)."""
    x, y, z = _corner_offsets(point, center, size)
    total = np.zeros(x[0].shape)
    for i in (0, 1):
        for j in (0, 1):
            for k in (0, 1):
                sign = 1.0 if (i + j + k) % 2 == 1 else -1.0
                X, Y, Z = x[i], y[j], z[k]
                r = np.sqrt(X * X + Y * Y + Z * Z)
                term = (_product_log(X, Y, Z, r) + _product_log(Y, Z, X, r) + _product_log(Z, X, Y, r)
                        - 0.5 * (X * X) * detmath.atan_ratio(Y * Z, X * r)
                        - 0.5 * (Y * Y) * detmath.atan_ratio(Z * X, Y * r)
                        - 0.5 * (Z * Z) * detmath.atan_ratio(X * Y, Z * r))
                total = total + sign * term
    return -G * density * total


def uniform_bodies(scene: Scene, roots=None) -> list[tuple[str, Shape, float, float]]:
    """The scene as a superposition of uniform bodies.

    Returns ``(object id, shape, density contrast, mass)`` for each selected
    object: the full shape (children included) filled with the density
    contrast rho(object) - rho(parent), and mass = contrast x its volume.

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
    bodies = []
    for obj in scene.objects:
        if obj.id not in selected:
            continue
        is_root = selected[obj.id]
        background = 0.0 if is_root else scene[obj.parent].material.density
        contrast = obj.material.density - background
        bodies.append((obj.id, obj.shape, contrast, contrast * obj.shape.volume))
    return bodies


def uniform_spheres(scene: Scene, roots=None) -> list[tuple[str, tuple[float, float, float], float, float]]:
    """The selection as ``(object id, centre, radius, mass)`` of uniform
    spheres; a ValueError if it contains a box (see :func:`uniform_bodies`)."""
    spheres = []
    for object_id, shape, _, mass in uniform_bodies(scene, roots):
        if not isinstance(shape, Sphere):
            raise ValueError(f"object {object_id!r} is not a sphere; use uniform_bodies")
        spheres.append((object_id, shape.center, shape.radius, mass))
    return spheres


def scene_mass(scene: Scene, roots=None) -> float:
    """Total mass (kg) of the selected subtrees."""
    return math.fsum(mass for _, _, _, mass in uniform_bodies(scene, roots))


def scene_tidal_tensor(scene: Scene, point, roots=None) -> np.ndarray:
    """Tidal tensor of the scene's matter at ``point``; shape (..., 3, 3)."""
    total = np.zeros(np.asarray(point, dtype=np.float64).shape[:-1] + (3, 3))
    for _, shape, contrast, mass in uniform_bodies(scene, roots):
        if isinstance(shape, Box):
            total = total + uniform_box_tidal_tensor(point, shape.center, shape.size, contrast)
        else:
            total = total + uniform_sphere_tidal_tensor(point, shape.center, shape.radius, mass)
    return total


def scene_potential(scene: Scene, point, roots=None) -> np.ndarray:
    """Newtonian potential of the scene's matter at ``point``; shape (...)."""
    total = np.zeros(np.asarray(point, dtype=np.float64).shape[:-1])
    for _, shape, contrast, mass in uniform_bodies(scene, roots):
        if isinstance(shape, Box):
            total = total + uniform_box_potential(point, shape.center, shape.size, contrast)
        else:
            total = total + uniform_sphere_potential(point, shape.center, shape.radius, mass)
    return total


# --- a ruler under the ground ---------------------------------------------------------------------------------------
#
# Above two equal masses at (+-d/2, 0) buried at depth z, the in-plane shear (E_xx - E_yy) + 2i E_xy vanishes on the
# perpendicular bisector exactly at y = +-d/2, whatever the depth (for z > sqrt(3) d / 2): on x = 0, E_xy = 0 by
# symmetry and E_xx - E_yy = 6 G M (y^2 - d^2/4) / [(d/2)^2 + y^2 + z^2]^(5/2). The two zeros are d apart. For unequal
# masses they drift with depth. (tests/test_silent_flows.py.)


def planar_shear(x, y, z: float, masses):
    """(E_xx - E_yy) + 2i E_xy on the plane at height z above point masses [(G M, (a, b))] at depth 0."""
    S = 0j
    for gm, (a, b) in masses:
        X, Y = x - a, y - b
        r2 = X * X + Y * Y + z * z
        S = S + 3 * gm / r2 ** 2.5 * ((Y * Y - X * X) - 2j * X * Y)
    return S
