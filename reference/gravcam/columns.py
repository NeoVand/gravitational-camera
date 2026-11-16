"""Line integrals along rays through a scene of nested spheres.

The thermal image is N = integral of j_N ds along the ray, without occlusion
(matter is transparent). The same machinery gives the mass column
Sigma = integral of rho ds (kg/m^2).

Algorithm (on purpose not "signed sums of solid primitives"):

1. for each ray, find the distance of every crossing of every sphere surface;
2. sort the positive ones; together with 0 they cut the ray into segments on
   which the material cannot change;
3. for each segment, ask the scene which object's own region contains the
   segment's midpoint (the innermost object containing that point) and add
   segment length x that object's value. Beyond the last crossing the ray is
   in vacuum.

Numerics. Distances span 1 m to 1.5e11 m, so the ray-sphere intersection is
written to avoid the two classic cancellations:

* the discriminant uses the perpendicular offset p of the centre from the
  line, as (r - p)(r + p), instead of b^2 - (|oc|^2 - r^2);
* the root nearer the origin is the product of the roots over the far root,
  c / q, instead of the difference of two nearly equal numbers.

What remains is the float64 resolution of a position, about 3e-5 m at 1 AU.
It moves a crossing by that much times r / (half chord), so chords are exact
to roughly 1e-12 relative except for rays that graze a surface, where no
float64 method can do better (the direction vector itself is rounded).

Sums over components, segments and objects are written out in a fixed order
(no BLAS, no einsum), so a ray gives bit-identical results whether it is
computed alone or inside a large image.
"""
from __future__ import annotations

import numpy as np

from . import emission
from .scene import Scene

# Rays are processed in blocks of this size to bound temporary memory.
_CHUNK = 1 << 15


def _dot(a, b):
    """Dot product over the last axis, summed in a fixed order."""
    return a[..., 0] * b[..., 0] + a[..., 1] * b[..., 1] + a[..., 2] * b[..., 2]


def _unit_rays(directions):
    d = np.asarray(directions, dtype=np.float64)
    if d.ndim == 0 or d.shape[-1] != 3:
        raise ValueError("directions must have shape (..., 3)")
    flat = d.reshape(-1, 3)
    norm = np.sqrt(_dot(flat, flat))
    if not np.all(np.isfinite(norm)) or np.any(norm == 0.0):
        raise ValueError("directions must be finite and non-zero")
    return flat / norm[:, None], d.shape[:-1]


def _origin(scene: Scene | None, origin):
    if origin is None:
        if scene is None:
            raise ValueError("an origin is required")
        origin = scene.observer
    o = np.asarray(origin, dtype=np.float64)
    if o.shape != (3,):
        raise ValueError("origin must be a single point of shape (3,)")
    return o


def _line_sphere(o, d, centers, radii):
    """Crossings of the lines o + t d (d unit, shape (R, 3)) with K spheres.

    Returns ``near, far, half, hit`` of shape (R, K): the two signed line
    parameters (near <= far), half the chord of the full line, and whether
    the line crosses the sphere at all. Values are meaningless where
    ``hit`` is False.
    """
    oc = centers - o                                           # (K, 3) origin -> centre
    tca = _dot(d[:, None, :], oc[None, :, :])                  # (R, K) closest approach
    perp = oc[None, :, :] - tca[:, :, None] * d[:, None, :]    # (R, K, 3), orthogonal to d
    p = np.sqrt(_dot(perp, perp))                              # impact parameter
    disc = (radii - p) * (radii + p)                           # r^2 - p^2
    hit = disc > 0.0
    half = np.sqrt(np.where(hit, disc, 0.0))
    dist = np.sqrt(_dot(oc, oc))
    product = (dist - radii) * (dist + radii)                  # near * far = |oc|^2 - r^2
    q = tca + np.copysign(half, tca)                           # the root of larger magnitude
    with np.errstate(divide="ignore", invalid="ignore"):
        other = product / q
    return np.minimum(q, other), np.maximum(q, other), half, hit


def _chord(near, far, half, hit):
    """Length of the part t >= 0 of the ray inside the sphere."""
    ahead = np.where(near >= 0.0, 2.0 * half, np.maximum(far, 0.0))
    return np.where(hit, ahead, 0.0)


def ray_sphere_distances(origin, directions, center, radius):
    """Signed distances (t_near, t_far) at which the line crosses one sphere.

    ``directions`` has shape (..., 3) and is normalised here; the results have
    shape (...). Negative values lie behind the origin. Both are NaN where
    the line misses the sphere (or only touches it).
    """
    o = _origin(None, origin)
    d, shape = _unit_rays(directions)
    centers = np.asarray(center, dtype=np.float64).reshape(1, 3)
    radii = np.array([radius], dtype=np.float64)
    near, far, _, hit = _line_sphere(o, d, centers, radii)
    near = np.where(hit, near, np.nan).reshape(shape)
    far = np.where(hit, far, np.nan).reshape(shape)
    return near, far


def chord_length(origin, directions, center, radius):
    """Path length of the ray (t >= 0) inside one sphere; 0 for a miss."""
    o = _origin(None, origin)
    d, shape = _unit_rays(directions)
    centers = np.asarray(center, dtype=np.float64).reshape(1, 3)
    radii = np.array([radius], dtype=np.float64)
    return _chord(*_line_sphere(o, d, centers, radii)).reshape(shape)


def chords(scene: Scene, directions, origin=None) -> dict[str, np.ndarray]:
    """Path length inside each object's FULL shape (children included).

    Returns ``{object id: array of shape directions.shape[:-1]}``.
    """
    o = _origin(scene, origin)
    d, shape = _unit_rays(directions)
    out = np.empty((d.shape[0], len(scene)), dtype=np.float64)
    for start in range(0, d.shape[0], _CHUNK):
        block = slice(start, start + _CHUNK)
        out[block] = _chord(*_line_sphere(o, d[block], scene.centers, scene.radii))
    return {object_id: out[:, k].reshape(shape) for k, object_id in enumerate(scene.ids)}


def _own_region_paths_block(scene: Scene, o, d):
    n_rays, n_objects = d.shape[0], len(scene)
    near, far, _, hit = _line_sphere(o, d, scene.centers, scene.radii)
    # Every surface crossing ahead of the observer; +inf marks "no crossing".
    crossings = np.concatenate([
        np.where(hit & (near > 0.0), near, np.inf),
        np.where(hit & (far > 0.0), far, np.inf),
    ], axis=1)
    crossings.sort(axis=1)
    bounds = np.concatenate([np.zeros((n_rays, 1)), crossings], axis=1)
    finite = np.isfinite(bounds)
    bounds = np.where(finite, bounds, 0.0)
    lower, upper = bounds[:, :-1], bounds[:, 1:]
    length = np.where(finite[:, 1:], upper - lower, 0.0)       # 0 for the unused slots
    midpoint = 0.5 * (lower + upper)
    points = o + midpoint[:, :, None] * d[:, None, :]          # (R, 2K, 3)
    owner = scene.locate(points)                               # innermost object, -1 = vacuum
    paths = np.zeros((n_rays, n_objects), dtype=np.float64)
    rows = np.arange(n_rays)
    for s in range(length.shape[1]):                           # segments in order of distance
        inside = owner[:, s] >= 0
        paths[rows[inside], owner[inside, s]] += length[inside, s]
    return paths


def own_region_paths(scene: Scene, directions, origin=None) -> np.ndarray:
    """Path length of each ray inside each object's own region.

    ``directions`` has shape (..., 3); the result has shape (..., K) with K
    objects in scene order. ``origin`` defaults to the scene's observer.
    """
    o = _origin(scene, origin)
    d, shape = _unit_rays(directions)
    out = np.empty((d.shape[0], len(scene)), dtype=np.float64)
    for start in range(0, d.shape[0], _CHUNK):
        block = slice(start, start + _CHUNK)
        out[block] = _own_region_paths_block(scene, o, d[block])
    return out.reshape(shape + (len(scene),))


def line_integral(scene: Scene, values, directions, origin=None) -> np.ndarray:
    """Integral along each ray of a quantity that is constant in every
    object's own region (``values``, one per object in scene order) and zero
    in vacuum."""
    values = np.asarray(values, dtype=np.float64)
    if values.shape != (len(scene),):
        raise ValueError("values must hold one number per scene object")
    paths = own_region_paths(scene, directions, origin)
    total = np.zeros(paths.shape[:-1], dtype=np.float64)
    for k in range(len(scene)):                                # objects in scene order
        total = total + paths[..., k] * values[k]
    return total


def number_radiance(scene: Scene, directions, origin=None) -> np.ndarray:
    """Thermal number radiance N = integral of j_N ds (gravitons s^-1 m^-2 sr^-1)."""
    return line_integral(scene, emission.number_emissivities(scene), directions, origin)


def mass_column(scene: Scene, directions, origin=None) -> np.ndarray:
    """Mass column Sigma = integral of rho ds (kg/m^2)."""
    return line_integral(scene, scene.densities, directions, origin)
