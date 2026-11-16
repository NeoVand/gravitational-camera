"""Pinhole camera: unit ray directions for every pixel.

Convention (shared with the engine):

* right-handed axes, +y up;
* at yaw = 0, pitch = 0 the camera looks along -z;
* positive yaw turns the view to the left (counter-clockwise seen from above,
  towards -x); positive pitch looks up;
* forward = (-sin(yaw) cos(pitch), sin(pitch), -cos(yaw) cos(pitch)),
  right = (cos(yaw), 0, -sin(yaw)), up = right x forward;
* pixel (i, j), i across from the left (0 .. W-1), j down from the top
  (0 .. H-1), looks along
  normalize(forward + ((i + 0.5)/W*2 - 1) tan(fov/2) (W/H) right
                    + (1 - (j + 0.5)/H*2) tan(fov/2) up),
  with fov the vertical field of view.

Angles are in radians. Images are indexed [j, i] (row, column).
"""
from __future__ import annotations

import math

import numpy as np


def camera_basis(yaw: float, pitch: float):
    """Unit vectors (forward, right, up) of the camera."""
    cy, sy = math.cos(yaw), math.sin(yaw)
    cp, sp = math.cos(pitch), math.sin(pitch)
    forward = np.array([-sy * cp, sp, -cy * cp], dtype=np.float64)
    right = np.array([cy, 0.0, -sy], dtype=np.float64)
    up = np.cross(right, forward)
    return forward, right, up


def _image_plane(fov: float, width: int, height: int):
    """Offsets (x along right, y along up) of the pixel centres on the plane
    one unit in front of the pinhole."""
    if not (isinstance(width, (int, np.integer)) and isinstance(height, (int, np.integer))):
        raise ValueError("width and height must be integers")
    if width < 1 or height < 1:
        raise ValueError("width and height must be positive")
    if not 0.0 < fov < math.pi:
        raise ValueError("the vertical field of view must lie between 0 and pi radians")
    t = math.tan(0.5 * fov)
    i = np.arange(width, dtype=np.float64)
    j = np.arange(height, dtype=np.float64)
    x = ((i + 0.5) / width * 2.0 - 1.0) * t * (width / height)
    y = (1.0 - (j + 0.5) / height * 2.0) * t
    return x, y, t


def ray_directions(yaw: float, pitch: float, fov: float, width: int, height: int) -> np.ndarray:
    """Unit ray directions, shape (H, W, 3); element [j, i] is pixel (i, j)."""
    forward, right, up = camera_basis(yaw, pitch)
    x, y, _ = _image_plane(fov, width, height)
    v = forward[None, None, :] + x[None, :, None] * right[None, None, :] + y[:, None, None] * up[None, None, :]
    norm = np.sqrt(v[..., 0] * v[..., 0] + v[..., 1] * v[..., 1] + v[..., 2] * v[..., 2])
    return v / norm[..., None]


def pixel_solid_angles(fov: float, width: int, height: int) -> np.ndarray:
    """Solid angle of each pixel (sr), shape (H, W), evaluated at the pixel
    centre: dOmega = dx dy / (1 + x^2 + y^2)^(3/2) on the unit image plane.
    Multiply a radiance image by this and sum to get a flux."""
    x, y, t = _image_plane(fov, width, height)
    side = 2.0 * t / height            # pixels are square on the image plane
    s = 1.0 + (x * x)[None, :] + (y * y)[:, None]
    return side * side / (s * np.sqrt(s))


def yaw_pitch_toward(direction):
    """The (yaw, pitch) that point the camera's forward axis along ``direction``."""
    d = np.asarray(direction, dtype=np.float64)
    if d.shape != (3,):
        raise ValueError("direction must have shape (3,)")
    norm = math.sqrt(float(d[0] * d[0] + d[1] * d[1] + d[2] * d[2]))
    if norm == 0.0:
        raise ValueError("direction must be non-zero")
    x, y, z = (d / norm).tolist()
    pitch = math.atan2(y, math.hypot(x, z))
    yaw = math.atan2(-x, -z) if (x != 0.0 or z != 0.0) else 0.0
    return yaw, pitch
