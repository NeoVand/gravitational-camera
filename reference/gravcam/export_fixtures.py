"""Export reference numbers for the engine's tests (the bridge to ``app/``).

    python -m gravcam.export_fixtures            # run from reference/

writes ``reference/fixtures/sun-at-midnight.json`` from
``scenes/sun-at-midnight.scene.json``. The file holds the constants, the
per-object emission values, 200 rays from the scene's observer (a fixed seed
mixes uniformly random directions with targeted ones) and the tidal tensor at
the observer. Floats are written with ``repr``, i.e. with full float64
precision.

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

from . import __version__, columns, constants, emission, tidal
from .scene import Scene, load_scene

REFERENCE_DIR = Path(__file__).resolve().parents[1]
DEFAULT_SCENE = REFERENCE_DIR.parent / "scenes" / "sun-at-midnight.scene.json"
DEFAULT_OUT_DIR = REFERENCE_DIR / "fixtures"

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
                    "1.98847e30 kg at the scene's Sun centre, NOT from the scene's densities: those "
                    "are only rough and imply the smaller mass given as scene_density_mass.",
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
        },
        "constants": constants.as_dict(),
        "observer": {"position": point.tolist()},
        "objects": objects,
        "tidal": tidal_block,
        "rays": rays,
    }


def dumps(fixture: dict) -> str:
    """JSON text: indented, but with one ray per line (easier to diff)."""
    marker = "@@RAYS@@"
    skeleton = dict(fixture, rays=marker)
    text = json.dumps(skeleton, indent=2, allow_nan=False)
    rows = ",\n".join("    " + json.dumps(ray, allow_nan=False) for ray in fixture["rays"])
    return text.replace(json.dumps(marker), "[\n" + rows + "\n  ]") + "\n"


def main(argv=None) -> int:
    parser = argparse.ArgumentParser(prog="python -m gravcam.export_fixtures", description=__doc__.split("\n")[0])
    parser.add_argument("--scene", type=Path, default=DEFAULT_SCENE, help="scene file (default: %(default)s)")
    parser.add_argument("--out", type=Path, default=None,
                        help="output file (default: reference/fixtures/<scene name>.json)")
    parser.add_argument("--seed", type=int, default=SEED, help="seed of the random directions (default %(default)s)")
    parser.add_argument("--rays", type=int, default=N_RAYS, help="total number of rays (default %(default)s)")
    args = parser.parse_args(argv)

    fixture = build_fixture(args.scene, seed=args.seed, n_rays=args.rays)
    out = args.out or DEFAULT_OUT_DIR / (args.scene.name.removesuffix(".scene.json") + ".json")
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(dumps(fixture), encoding="utf-8")
    print(f"wrote {out} ({len(fixture['rays'])} rays, {len(fixture['objects'])} objects)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
