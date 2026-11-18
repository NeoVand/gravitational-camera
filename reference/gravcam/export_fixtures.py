"""Export reference numbers for the engine's tests (the bridge to ``app/``).

    python -m gravcam.export_fixtures            # run from reference/

writes one file in ``reference/fixtures/`` per scene in ``scenes/`` that the
engine is tested against.

``sun-at-midnight.json`` holds the constants, the per-object emission values,
200 rays from the scene's observer (a fixed seed mixes uniformly random
directions with targeted ones) and the tidal tensor at the observer. Floats
are written with ``repr``, i.e. with full float64 precision.

Each room scene gets the same per-object values and rays, with the tidal
column added to every ray, and the tidal tensor at a small square array of
sensors around the observer, with and without the empty room (the objects
marked ``background``).

The thermal scenes (the Sun at midnight, the closed furnace, honey and water)
also get a ``counts`` block: what a camera that counts gravitons expects in
each picture element of a view near the one the demo starts with, per second
and per square metre of collecting area. The view's tangent plane is cut into
square elements, each sampled on a grid of rays (``columns.line_integral``)
weighted by their solid angles (as ``camera.pixel_solid_angles``); a ball too
small for the samples (the Sun's core, the Moon) is counted whole in the
element that holds its centre, from the integral of dV / r^2 over it.

``near-noise.json`` holds the noise of the near-field Wiener reconstruction
(``resolution.py``): for a few signal-to-noise ratios, the spectrum of the
reconstructed noise, H (1 - H), and its variance, (1 / 2 pi) int H (1 - H) q dq,
in units of (m / z^3)^2 for a prior of point masses m one per z^2 at depth z. Logarithms and arctangents are not correctly rounded
on every platform, so the values that need them (tidal columns and tensors)
are written to 10 significant digits; that is far finer than any test needs
and keeps the files identical wherever they are regenerated.

The output is meant to be bit-reproducible, so that regenerating it on
another machine leaves the file unchanged: there are no timestamps or paths in
it, and every number is built from operations that IEEE 754 defines exactly
(+, -, *, /, sqrt) in a fixed order -- no trigonometry, no pow, no BLAS. The
random directions come from Python's ``random`` module, whose sequence for a
given seed is guaranteed across versions and platforms.
"""
from __future__ import annotations

import argparse
import json
import math
import random
import sys
from pathlib import Path

import numpy as np

from . import __version__, columns, constants, currents, emission, resolution, tidal, waves
from .scene import Scene, Sphere, load_scene

REFERENCE_DIR = Path(__file__).resolve().parents[1]
SCENES_DIR = REFERENCE_DIR.parent / "scenes"
DEFAULT_SCENE = SCENES_DIR / "sun-at-midnight.scene.json"
DEFAULT_OUT_DIR = REFERENCE_DIR / "fixtures"
NOISE_FIXTURE = "near-noise.json"
ROOM_SCENES = ("locked-safe", "full-or-empty", "blank-mirror", "closed-furnace", "honey-and-water", "which-way",
               "sealed-flywheel", "beam-in-the-dark")
N_ROOM_RAYS = 160
SENSOR_SPACING_M = 0.5            # the sensors: a 3 x 3 square in the x-y plane, centred on the observer
SIGNIFICANT = 10                  # digits kept for values computed with log or atan

SEED = 1916
N_RAYS = 200
LIMB_FRACTIONS = (0.5, 0.9, 0.99, 1.01)      # impact parameter / radius
POSITION_ANGLES_DEG = (0, 90)                # around the direction to the centre
HORIZON_OFFSETS_M = (1.0, -1.0, -100.0, -10000.0)   # impact parameter - radius

Vector = tuple[float, float, float]


def _dot(a: Vector, b: Vector) -> float:
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]


def _unit(v: Vector) -> Vector:
    norm = math.sqrt(_dot(v, v))
    return (v[0] / norm, v[1] / norm, v[2] / norm)


def _cross(a: Vector, b: Vector) -> Vector:
    return (a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0])


def perpendicular_frame(u: Vector) -> tuple[Vector, Vector]:
    """Two unit vectors (e1, e2) with (e1, e2, u) right-handed and orthogonal.
    e1 is the coordinate axis least aligned with u (the first such axis on a
    tie), made orthogonal to u."""
    k = min(range(3), key=lambda i: abs(u[i]))
    axis = tuple(1.0 if i == k else 0.0 for i in range(3))
    along = _dot(axis, u)
    e1 = _unit(tuple(axis[i] - along * u[i] for i in range(3)))
    return e1, _unit(_cross(u, e1))


def aim(origin, center, impact: float = 0.0, position_angle_deg: int = 0):
    """Unit direction from ``origin`` whose line passes ``center`` at the
    perpendicular distance ``impact`` (m). ``position_angle_deg`` picks the
    side: 0 offsets the line towards e1 of the perpendicular frame, 90 towards
    e2. Returns None if ``impact`` is not smaller than the distance."""
    oc = tuple(float(c) - float(o) for c, o in zip(center, origin))
    distance = math.sqrt(_dot(oc, oc))
    if distance == 0.0 or not 0.0 <= impact < distance:
        return None
    u = (oc[0] / distance, oc[1] / distance, oc[2] / distance)
    sin_theta = impact / distance
    cos_theta = math.sqrt((1.0 - sin_theta) * (1.0 + sin_theta))
    e = perpendicular_frame(u)[{0: 0, 90: 1}[position_angle_deg]]
    return np.array(_unit(tuple(cos_theta * u[i] + sin_theta * e[i] for i in range(3))))


def targeted_rays(scene: Scene) -> list[tuple[str, np.ndarray]]:
    """Labelled directions aimed at the features of the scene."""
    origin = scene.observer.tolist()
    rays: list[tuple[str, np.ndarray]] = [
        ("down", np.array([0.0, -1.0, 0.0])),
        ("up", np.array([0.0, 1.0, 0.0])),
        ("horizontal:yaw0", np.array([0.0, 0.0, -1.0])),
        ("horizontal:yaw90", np.array([-1.0, 0.0, 0.0])),
    ]

    def add(label, direction):
        if direction is None:
            return
        if any(np.array_equal(direction, existing) for _, existing in rays):
            return                      # e.g. the centre of the Earth is "down"
        rays.append((label, direction))

    # Centres, innermost objects first so that shared centres get their label.
    for obj in sorted(scene.objects, key=lambda o: -o.depth):
        add(f"center:{obj.id}", aim(origin, obj.shape.center))
    # Limbs: lines passing each sphere's centre at a fraction of its radius.
    for obj in scene.objects:
        for fraction in LIMB_FRACTIONS:
            for angle in POSITION_ANGLES_DEG:
                add(f"limb:{obj.id}:{fraction:g}:pa{angle}",
                    aim(origin, obj.shape.center, fraction * obj.shape.radius, angle))
    # Horizon: just above and below the surface the observer stands over.
    outside = [(math.dist(origin, o.shape.center) - o.shape.radius, o) for o in scene.objects if o.parent is None]
    outside = [(altitude, o) for altitude, o in outside if altitude > 0.0]
    if outside:
        _, ground = min(outside, key=lambda item: item[0])
        for offset in HORIZON_OFFSETS_M:
            add(f"horizon:{ground.id}:{offset:+g}m",
                aim(origin, ground.shape.center, ground.shape.radius + offset))
    return rays


def random_rays(count: int, seed: int) -> list[tuple[str, np.ndarray]]:
    """Directions uniform on the sphere: points uniform in the cube [-1, 1)^3,
    kept if they fall in the unit ball (and not too close to its centre),
    then normalised."""
    rng = random.Random(seed)
    rays: list[tuple[str, np.ndarray]] = []
    while len(rays) < count:
        v = (2.0 * rng.random() - 1.0, 2.0 * rng.random() - 1.0, 2.0 * rng.random() - 1.0)
        if 0.01 < _dot(v, v) <= 1.0:
            rays.append((f"random:{len(rays):03d}", np.array(_unit(v))))
    return rays


COUNTS_NOTE = (
    "counts: gravitons per second per square metre of collecting area from each picture element of a view (rows "
    "from the top), cells[0] x cells[1] square elements of the tangent plane, each sampled on samples x samples "
    "rays weighted by their solid angles; balls narrower than a sample's spacing (points) counted whole in the "
    "element of their centre. Rounded to 10 significant digits; rate_without_room leaves the background out.")


def build_fixture(scene_path=DEFAULT_SCENE, seed: int = SEED, n_rays: int = N_RAYS,
                  earth_id: str = "earth", sun_id: str = "sun") -> dict:
    scene_path = Path(scene_path)
    scene = load_scene(scene_path)
    per_object = emission.object_emission(scene)

    objects = {
        obj.id: {
            "own_volume": obj.own_volume,
            "alpha": per_object[obj.id].alpha,
            "j_E": per_object[obj.id].j_E,
            "j_N": per_object[obj.id].j_N,
            "density": obj.material.density,
            "temperature": obj.material.temperature,
            "emission_source": per_object[obj.id].source,
        }
        for obj in scene.objects
    }

    labelled = targeted_rays(scene)
    labelled += random_rays(max(n_rays - len(labelled), 0), seed)
    directions = np.array([direction for _, direction in labelled])
    radiance = columns.number_radiance(scene, directions)
    column = columns.mass_column(scene, directions)
    chord = columns.chords(scene, directions)
    rays = [
        {
            "label": label,
            "direction": directions[k].tolist(),
            "number_radiance": float(radiance[k]),
            "mass_column": float(column[k]),
            "chords": {object_id: float(chord[object_id][k]) for object_id in scene.ids},
        }
        for k, (label, _) in enumerate(labelled)
    ]

    sun = scene[sun_id]
    point = scene.observer
    tidal_block = {
        "convention": "E_ij = d_i d_j Phi (Newtonian potential Phi), s^-2; rows and columns are the scene axes x, y, z",
        "point": point.tolist(),
        "earth_layers": {
            "objects": list(scene.subtree(earth_id)),
            "mass": tidal.scene_mass(scene, [earth_id]),
            "tensor": tidal.scene_tidal_tensor(scene, point, [earth_id]).tolist(),
            "note": "Superposition of uniform spheres with the scene's density contrasts; "
                    "the mass is the total those densities imply.",
        },
        "sun": {
            "center": list(sun.shape.center),
            "radius": sun.shape.radius,
            "mass": constants.M_sun,
            "tensor": tidal.uniform_sphere_tidal_tensor(point, sun.shape.center, sun.shape.radius, constants.M_sun).tolist(),
            "scene_density_mass": tidal.scene_mass(scene, [sun_id]),
            "note": "The Sun is taken as a point-like uniform sphere of the standard solar mass "
                    "1.98847e30 kg at the scene's Sun centre, NOT a sum over the scene's two uniform "
                    "layers; their densities are chosen to give the same mass (scene_density_mass).",
        },
    }

    return {
        "meta": {
            "scene": scene_path.name,
            "scene_name": scene.name,
            "seed": seed,
            "package": "gravcam",
            "version": __version__,
            "generator": "python -m gravcam.export_fixtures",
            "notes": [
                "All quantities are SI, float64, written with full precision.",
                "Rays start at observer.position; direction is a unit vector in scene axes.",
                "chords: path length of the ray inside each object's FULL shape (children included), not its own region.",
                "alpha is null where the material has no friction (emission set by luminosity).",
                "Rays labelled limb:* pass a sphere's centre at the stated fraction of its radius; horizon:* pass the "
                "ground sphere's centre at radius + the stated offset. Near a limb a chord is sensitive to the "
                "direction: an error db in the impact parameter changes it by 2 b db / (half chord).",
                *([COUNTS_NOTE] if scene.name in COUNT_VIEWS else []),
            ],
        },
        "units": {
            "own_volume": "m^3",
            "alpha": "m^-1",
            "j_E": "W m^-3 sr^-1",
            "j_N": "gravitons s^-1 m^-3 sr^-1",
            "density": "kg m^-3",
            "temperature": "K",
            "number_radiance": "gravitons s^-1 m^-2 sr^-1",
            "mass_column": "kg m^-2",
            "chords": "m",
            "tidal tensor": "s^-2",
            "mass": "kg",
            **({"rate": "gravitons s^-1 m^-2"} if scene.name in COUNT_VIEWS else {}),
        },
        "constants": constants.as_dict(),
        "observer": {"position": point.tolist()},
        "objects": objects,
        "tidal": tidal_block,
        "rays": rays,
        **({"counts": counts} if (counts := counts_fixture(scene)) is not None else {}),
    }


def _rounded(x: float) -> float:
    return float(f"{x:.{SIGNIFICANT}g}")


def _rounded_matrix(m) -> list[list[float]]:
    return [[_rounded(float(v)) for v in row] for row in np.asarray(m)]


def _object_block(scene: Scene) -> dict:
    per_object = emission.object_emission(scene)
    return {
        obj.id: {
            "own_volume": obj.own_volume,
            "alpha": per_object[obj.id].alpha,
            "j_E": per_object[obj.id].j_E,
            "j_N": per_object[obj.id].j_N,
            "density": obj.material.density,
            "temperature": obj.material.temperature,
            "emission_source": per_object[obj.id].source,
            "background": obj.background,
        }
        for obj in scene.objects
    }


def room_targeted_rays(scene: Scene) -> list[tuple[str, np.ndarray]]:
    """Straight down, up and ahead, and toward the centre of every object."""
    origin = scene.observer.tolist()
    rays: list[tuple[str, np.ndarray]] = [
        ("down", np.array([0.0, -1.0, 0.0])),
        ("up", np.array([0.0, 1.0, 0.0])),
        ("ahead", np.array([0.0, 0.0, -1.0])),
        ("behind", np.array([0.0, 0.0, 1.0])),
    ]
    for obj in sorted(scene.objects, key=lambda o: -o.depth):
        direction = aim(origin, obj.shape.center)
        if direction is not None and not any(np.array_equal(direction, d) for _, d in rays):
            rays.append((f"center:{obj.id}", direction))
    return rays


def build_room_fixture(scene_path, seed: int = SEED, n_rays: int = N_ROOM_RAYS) -> dict:
    scene_path = Path(scene_path)
    scene = load_scene(scene_path)
    background = [o.id for o in scene.objects if o.background]
    for object_id in background:
        if scene[object_id].parent is not None or scene[object_id].children:
            raise ValueError(f"{scene_path.name}: background object {object_id!r} must be a root without children")
    kept = [o.id for o in scene.objects if o.parent is None and not o.background]

    labelled = room_targeted_rays(scene)
    labelled += random_rays(max(n_rays - len(labelled), 0), seed)
    directions = np.array([direction for _, direction in labelled])
    radiance = columns.number_radiance(scene, directions)
    column = columns.mass_column(scene, directions)
    tidal_column = columns.tidal_column(scene, directions)
    chord = columns.chords(scene, directions)
    spinning = any(o.spin is not None and o.spin.rate != 0 for o in scene.objects)
    current = currents.current_column(scene, directions) if spinning else None
    rays = []
    for k, (label, _) in enumerate(labelled):
        ray = {
            "label": label,
            "direction": directions[k].tolist(),
            "number_radiance": float(radiance[k]),
            "mass_column": float(column[k]),
            "tidal_column": _rounded(float(tidal_column[k])),
            "chords": {object_id: float(chord[object_id][k]) for object_id in scene.ids},
        }
        if current is not None:
            ray["current_column"] = [_rounded(float(v)) for v in current[k]]
        rays.append(ray)

    sensors = []
    for dy in (SENSOR_SPACING_M, 0.0, -SENSOR_SPACING_M):
        for dx in (-SENSOR_SPACING_M, 0.0, SENSOR_SPACING_M):
            point = scene.observer + np.array([dx, dy, 0.0])
            sensors.append({
                "point": point.tolist(),
                "tensor": _rounded_matrix(tidal.scene_tidal_tensor(scene, point)),
                "tensor_without_room": _rounded_matrix(tidal.scene_tidal_tensor(scene, point, kept)),
            })

    rotor_block = []
    for rotor in waves.rotors(scene):
        seen = waves.seen_from(rotor, scene.observer)
        rotor_block.append({
            "members": list(rotor.members),
            "center": rotor.center.tolist(),
            "angular_direction": rotor.axis.tolist(),
            "omega": rotor.omega,
            "delta_inertia": _rounded(rotor.delta_inertia),
            "power": _rounded(rotor.power()),
            "wavelength": _rounded(rotor.wavelength()),
            "at_observer": {
                "distance": _rounded(seen["distance"]),
                "cos_iota": _rounded(seen["cos_iota"]),
                "amplitude": _rounded(seen["amplitude"]),
                "flux": _rounded(seen["flux"]),
                "circular": _rounded(seen["circular"]),
                "linear": _rounded(seen["Q"] / seen["I"]),
            },
        })

    fixture = {
        "meta": {
            "scene": scene_path.name,
            "scene_name": scene.name,
            "seed": seed,
            "package": "gravcam",
            "version": __version__,
            "generator": "python -m gravcam.export_fixtures",
            "notes": [
                "All quantities are SI, float64. tidal_column and the tensors are rounded to "
                f"{SIGNIFICANT} significant digits (they need log and atan, which are not correctly "
                "rounded everywhere); everything else is written with full precision.",
                "Rays start at observer.position; direction is a unit vector in scene axes.",
                "chords: path length of the ray inside each object's FULL shape (children included), not its own region.",
                "tidal_column: integral of rho dr / r beyond observer.exclusion (scenes/README.md).",
                "sensors: the tidal tensor E_ij = d_i d_j Phi at nine points around the observer, from the closed-form "
                "fields of uniform boxes and spheres; tensor_without_room leaves out the objects marked background.",
            ],
        },
        "units": {
            "own_volume": "m^3",
            "alpha": "m^-1",
            "j_E": "W m^-3 sr^-1",
            "j_N": "gravitons s^-1 m^-3 sr^-1",
            "density": "kg m^-3",
            "temperature": "K",
            "number_radiance": "gravitons s^-1 m^-2 sr^-1",
            "mass_column": "kg m^-2",
            "tidal_column": "kg m^-3",
            "chords": "m",
            "tensor": "s^-2",
        },
        "constants": constants.as_dict(),
        "observer": {"position": scene.observer.tolist(), "exclusion": scene.exclusion},
        "background": background,
        "objects": _object_block(scene),
        "sensors": sensors,
        "rays": rays,
    }
    if rotor_block:
        fixture["meta"]["notes"].append(
            "rotors: spinning parts grouped by their spin (gravcam/waves.py), at the true speed of light; "
            "circular is V / I, positive when the pattern turns anticlockwise as seen from the observer, and "
            "linear is Q / I in the basis of the projected axis. Rounded like the tidal values.")
        fixture["units"].update({"omega": "rad s^-1", "delta_inertia": "kg m^2", "power": "W", "wavelength": "m",
                                 "amplitude": "strain", "flux": "W m^-2"})
        fixture["rotors"] = rotor_block
    if current is not None:
        fixture["meta"]["notes"].append(
            "current_column: integral of rho v dr / r beyond observer.exclusion (gravcam/currents.py), at time "
            "zero, rounded like the tidal values.")
        fixture["units"]["current_column"] = "kg m^-2 s^-1"
    counts = counts_fixture(scene)
    if counts is not None:
        fixture["meta"]["notes"].append(COUNTS_NOTE)
        fixture["units"]["rate"] = "gravitons s^-1 m^-2"
        fixture["counts"] = counts
    return fixture


# --- what a camera that counts gravitons expects: the thermal scenes' views, cut into picture elements ----------------

# where each demo looks first, nearly: a direction from the observer, and the tangents of half the view across and up
COUNT_VIEWS = {
    "sun-at-midnight": ((0.0, -0.8, -0.6), 1.0, 0.625),
    "closed-furnace": ((0.0, -1.0, -3.5), 0.8, 0.5),
    "honey-and-water": ((0.0, -0.5, -2.2), 0.8, 0.5),
}
COUNT_CELLS = (16, 10)            # picture elements across and up
COUNT_SAMPLES = 3                 # rays along each side of an element


def ball_over_sky(radius: float, distance: float) -> float:
    """The integral of dV / r^2 over a ball of the given radius seen from a point at the given distance from its
    centre, outside it: 2 pi R - pi (D^2 - R^2) / D ln((D + R) / (D - R)). For a small ball that is a difference
    of nearly equal numbers, so its series in x = R / D is summed instead, V / D^2 (1 + x^2 / 5 + ...)."""
    x = radius / distance
    if x >= 0.1:
        return (2.0 * math.pi * radius
                - math.pi * (distance * distance - radius * radius) / distance
                * math.log((distance + radius) / (distance - radius)))
    total, power = 0.0, 1.0
    for k in range(12):
        total += power / ((2 * k + 1) * (2 * k + 3))
        power *= x * x
    return 4.0 * math.pi * radius * x * x * total


def count_block(scene: Scene, direction, tan_x: float, tan_y: float, without_room: bool = False,
                cells: tuple[int, int] = COUNT_CELLS, samples: int = COUNT_SAMPLES) -> dict:
    """Gravitons per second per square metre of collecting area from each picture element of a view, rows from the
    top; with ``without_room``, the objects marked background left out."""
    origin = tuple(float(v) for v in scene.observer)
    forward = _unit(tuple(float(v) for v in direction))
    right = _unit(_cross(forward, (0.0, 1.0, 0.0)))
    up = _cross(right, forward)
    nx, ny = cells
    s = samples
    dx, dy = 2.0 * tan_x / nx, 2.0 * tan_y / ny
    step = min(dx, dy) / s
    index = {obj.id: k for k, obj in enumerate(scene.objects)}
    values = emission.number_emissivities(scene).copy()
    for obj in scene.objects:
        if without_room and obj.background:
            values[index[obj.id]] = 0.0

    # balls narrower than a sample's spacing are counted whole, at their centres
    points = []
    for obj in scene.objects:
        if not isinstance(obj.shape, Sphere) or (without_room and obj.background):
            continue
        c = tuple(float(a) - b for a, b in zip(obj.shape.center, origin))
        dist = math.sqrt(_dot(c, c))
        if dist > obj.shape.radius and obj.shape.radius / dist < step:
            points.append((obj, c, dist))
    small = {obj.id for obj, _, _ in points}
    parent_value = lambda obj: 0.0 if obj.parent is None else values[index[obj.parent]]

    # along the sampled rays a small ball radiates as its nearest ancestor that is not small
    sampled = values.copy()
    for obj, _, _ in points:
        ancestor = obj.parent
        while ancestor is not None and ancestor in small:
            ancestor = scene[ancestor].parent
        sampled[index[obj.id]] = 0.0 if ancestor is None else values[index[ancestor]]

    xs = [-tan_x + (i + (a + 0.5) / s) * dx for i in range(nx) for a in range(s)]
    ys = [tan_y - (j + (b + 0.5) / s) * dy for j in range(ny) for b in range(s)]
    directions = np.array([[forward[k] + x * right[k] + y * up[k] for k in range(3)] for y in ys for x in xs])
    norms = np.sqrt(np.sum(directions * directions, axis=1))
    radiance = columns.line_integral(scene, sampled, directions / norms[:, None])
    width = nx * s
    rate = [[0.0] * nx for _ in range(ny)]
    for row, y in enumerate(ys):
        for col, x in enumerate(xs):
            q = 1.0 + x * x + y * y
            solid = (dx / s) * (dy / s) / (q * math.sqrt(q))
            rate[row // s][col // s] += float(radiance[row * width + col]) * solid
    for obj, c, dist in points:
        ahead = _dot(c, forward)
        if ahead <= 0.0:
            continue
        x, y = _dot(c, right) / ahead, _dot(c, up) / ahead
        i, j = math.floor((x + tan_x) / dx), math.floor((tan_y - y) / dy)
        if 0 <= i < nx and 0 <= j < ny:
            rate[j][i] += (values[index[obj.id]] - parent_value(obj)) * ball_over_sky(obj.shape.radius, dist)
    return {
        "view": {"forward": list(forward), "right": list(right), "up": list(up), "tan_x": tan_x, "tan_y": tan_y},
        "cells": [nx, ny],
        "samples": s,
        "points": [obj.id for obj, _, _ in points],
        "rate": [[_rounded(v) for v in row] for row in rate],
    }


def counts_fixture(scene: Scene) -> dict | None:
    """The counts block of a thermal scene, with and without the room where it has one; None for the others."""
    if scene.name not in COUNT_VIEWS:
        return None
    direction, tan_x, tan_y = COUNT_VIEWS[scene.name]
    block = count_block(scene, direction, tan_x, tan_y)
    if any(obj.background for obj in scene.objects):
        block["rate_without_room"] = count_block(scene, direction, tan_x, tan_y, without_room=True)["rate"]
    return block


# --- the noise of the near-field reconstruction --------------------------------------------------------------------

NOISE_DECADES = (3, 6, 20, 40)
NOISE_SAMPLES = (0.5, 0.8, 0.9, 1.0, 1.1, 1.2, 1.5)    # q / q_c


def build_noise_fixture() -> dict:
    """For each signal-to-noise ratio, the Wiener filter's cutoff, the spectrum of the noise it passes, H (1 - H),
    at a few q, and two integrals over the plane in units of (m / z^3)^2 and m / z^3: the noise's variance,
    (1 / 2 pi) int H (1 - H) q dq, and the peak of a point mass m's image, (1 / 2 pi) int H q dq."""
    rows = []
    for n in NOISE_DECADES:
        snr = 10.0**n
        q, w = resolution._grid(snr)
        h = resolution.transfer(q, snr)
        qc = resolution.cutoff(snr)
        at = np.array(NOISE_SAMPLES) * qc
        ha = resolution.transfer(at, snr)
        rows.append({
            "snr_decades": n,
            "q_c": _rounded(qc),
            "variance": _rounded(float(np.sum(w * h * (1.0 - h) * q)) / (2.0 * math.pi)),
            "peak": _rounded(float(np.sum(w * h * q)) / (2.0 * math.pi)),
            "q": [_rounded(float(v)) for v in at],
            "spectrum": [_rounded(float(v)) for v in ha * (1.0 - ha)],
        })
    return {
        "meta": {
            "package": "gravcam",
            "version": __version__,
            "generator": "python -m gravcam.export_fixtures",
            "notes": [
                "The Wiener reconstruction of resolution.py, H = s^2 / (1 + s^2), s = pi SNR q e^-q, q = k z, passes "
                "the readings' white noise with spectrum S_sigma H (1 - H), S_sigma = m^2 / z^2 the prior's; in the "
                "angles of the picture and the units of the tidal column, (m / z^3)^2 H (1 - H) per steradian.",
                "variance: (1 / 2 pi) int H (1 - H) q dq; peak: (1 / 2 pi) int H q dq, the centre of the image of a "
                "point of mass m; both on resolution.py's trapezoid grid. Rounded to "
                f"{SIGNIFICANT} significant digits (they need exp and log).",
            ],
        },
        "rows": rows,
    }


def dumps(fixture: dict) -> str:
    """JSON text: indented, but with one ray, and one row of picture elements, per line (easier to diff)."""
    markers = {"@@RAYS@@": None}
    skeleton = dict(fixture, rays="@@RAYS@@")
    if "counts" in fixture:
        counts = dict(fixture["counts"])
        for key in ("rate", "rate_without_room"):
            if key in counts:
                marker = f"@@{key.upper()}@@"
                markers[marker] = counts[key]
                counts[key] = marker
        skeleton["counts"] = counts
    text = json.dumps(skeleton, indent=2, allow_nan=False)
    rows = ",\n".join("    " + json.dumps(ray, allow_nan=False) for ray in fixture["rays"])
    text = text.replace(json.dumps("@@RAYS@@"), "[\n" + rows + "\n  ]")
    for marker, table in markers.items():
        if table is not None:
            lines = ",\n".join("      " + json.dumps(row, allow_nan=False) for row in table)
            text = text.replace(json.dumps(marker), "[\n" + lines + "\n    ]")
    return text + "\n"


def main(argv=None) -> int:
    parser = argparse.ArgumentParser(prog="python -m gravcam.export_fixtures", description=__doc__.split("\n")[0])
    parser.add_argument("--scene", type=Path, default=None,
                        help="one scene file (default: the Sun scene and every room scene)")
    parser.add_argument("--out", type=Path, default=None,
                        help="output file, with --scene (default: reference/fixtures/<scene name>.json)")
    parser.add_argument("--seed", type=int, default=SEED, help="seed of the random directions (default %(default)s)")
    parser.add_argument("--rays", type=int, default=None, help="total number of rays per scene")
    args = parser.parse_args(argv)

    if args.scene is None:
        if args.out is not None:
            parser.error("--out needs --scene")
        jobs = [(DEFAULT_SCENE, None)] + [(SCENES_DIR / f"{name}.scene.json", None) for name in ROOM_SCENES]
    else:
        jobs = [(args.scene, args.out)]

    for scene_path, out in jobs:
        is_room = load_scene(scene_path).environment == "room"
        if is_room:
            fixture = build_room_fixture(scene_path, seed=args.seed, n_rays=args.rays or N_ROOM_RAYS)
        else:
            fixture = build_fixture(scene_path, seed=args.seed, n_rays=args.rays or N_RAYS)
        out = out or DEFAULT_OUT_DIR / (scene_path.name.removesuffix(".scene.json") + ".json")
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(dumps(fixture), encoding="utf-8")
        print(f"wrote {out} ({len(fixture['rays'])} rays, {len(fixture['objects'])} objects)")
    if args.scene is None:
        out = DEFAULT_OUT_DIR / NOISE_FIXTURE
        out.write_text(json.dumps(build_noise_fixture(), indent=1) + "\n", encoding="utf-8")
        print(f"wrote {out}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
