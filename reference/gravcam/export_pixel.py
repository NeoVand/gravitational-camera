"""Cases for the website's pixel algebra (app/src/lib/pixel), from the reference implementation.

    python -m gravcam.export_pixel            # run from reference/

writes ``reference/fixtures/pixel.json``: readings W of scenes of masses at rest and moving (moving_masses_W), of
plane waves, and F of charges, each with what the reference finds in it: invariants, Petrov type, stars, the
velocity of a single body, the rest-frame velocity and the motion alarm; four waves separated over time, and light's
two. Numbers are written to 12 significant digits; tests/test_export_pixel.py checks the file against a fresh build.
"""
from __future__ import annotations

import json
from pathlib import Path

import numpy as np

from . import onepixel, pixel
from .constants import c

OUT = Path(__file__).resolve().parents[1] / "fixtures" / "pixel.json"
DIGITS = 12


def _r(x):
    if isinstance(x, (list, tuple, np.ndarray)):
        return [_r(v) for v in x]
    if isinstance(x, (complex, np.complexfloating)):
        return [_r(x.real), _r(x.imag)]
    return float(f"{float(x):.{DIGITS}g}")


def _cmat(W):
    W = np.asarray(W, dtype=complex)
    return {"re": _r(W.real), "im": _r(W.imag)}


def _unit(v):
    v = np.asarray(v, dtype=float)
    return v / np.linalg.norm(v)


def _scene(masses, positions, velocities):
    W = pixel.moving_masses_W(masses, positions, velocities)
    I, J = pixel.invariants(W)
    out = {"masses": _r(masses), "positions": _r(positions), "velocities": _r(velocities), "W": _cmat(W),
           "I": _r(I), "J": _r(J), "petrov": pixel.petrov(W), "stars": _r(pixel.stars(W)),
           "alarm": _r(pixel.motion_alarm(W)), "eigenvalues": _r(np.sort_complex(np.linalg.eigvals(W)))}
    if len(masses) == 1:
        out["body_velocity"] = _r(pixel.body_velocity(W))
    if pixel.petrov(W) == "I":
        out["rest_frame_velocity"] = _r(pixel.rest_frame_velocity(W))
    return out


def build() -> dict:
    rng = np.random.default_rng(20261117)
    scenes = []
    # one body at rest, and moving across and along the line of sight
    for v in ([0, 0, 0], [0.5 * c, 0, 0], [0, 0.9 * c, 0.1 * c], [0, 0, -0.3 * c]):
        scenes.append(_scene([1e3], [[-1.5, 0.2, 0.4]], [v]))
    # two bodies at rest; four bodies seen by a pixel moving at 0.6 c; one of them also moving
    scenes.append(_scene([1e3, 450.0], [[-1.5, 0.3, 0.0], [0.9, 1.1, 0.6]], [[0, 0, 0]] * 2))
    room = rng.normal(size=(4, 3)) * 2 + np.array([0, 0, 3.0])
    masses = rng.uniform(1e3, 9e3, 4)
    v = _unit(rng.normal(size=3)) * 0.6 * c
    scenes.append(_scene(masses, room, [-v] * 4))
    scenes.append(_scene(masses, room, [-v, -v, -v, -v + np.array([0.05 * c, 0, 0])]))
    waves = []
    for _ in range(3):
        k = _unit(rng.normal(size=3))
        plus, cross = rng.normal(size=2)
        E, B = onepixel.plane_wave_tensors(-k, plus, cross)
        W = pixel.weyl(E, B)
        waves.append({"k": _r(k), "plus": _r(plus), "cross": _r(cross), "W": _cmat(W), "petrov": pixel.petrov(W),
                      "m": _r(pixel.null_frame(k)), "stars": _r(pixel.stars(W))})
    charges = []
    for v in ([0, 0, 0], [0, 0.9, 0]):
        F = pixel.moving_charges_F([1.0], [[-1.5, 0.0, 0.0]], [np.array(v) * c])
        charges.append({"charges": [1.0], "positions": [[-1.5, 0.0, 0.0]], "velocities": [_r(np.array(v) * c)],
                        "F": _r(F), "stars": _r(pixel.light_stars(F))})
    F = pixel.moving_charges_F([1.0, 0.45], [[-1.5, 0.3, 0.0], [0.9, 1.1, 0.6]], [[0, 0, 0]] * 2)
    charges.append({"charges": [1.0, 0.45], "positions": [[-1.5, 0.3, 0.0], [0.9, 1.1, 0.6]],
                    "velocities": [[0, 0, 0]] * 2, "F": _r(F), "stars": _r(pixel.light_stars(F))})
    # four waves over time, and light's two
    ks = [_unit(rng.normal(size=3)) for _ in range(4)]
    ms = [pixel.null_frame(k) for k in ks]
    amps = rng.normal(size=(12, 4)) + 1j * rng.normal(size=(12, 4))
    readings = [sum(a * np.outer(m, m) for a, m in zip(row, ms)) for row in amps]
    light = [sum(a * m for a, m in zip(row[:2], ms[:2])) for row in amps]
    return {
        "c": c,
        "scenes": scenes,
        "waves": waves,
        "charges": charges,
        "four_waves": {"directions": _r(ks), "readings": [_cmat(W) for W in readings],
                       "found": _r(pixel.four_waves(readings))},
        "light_two_waves": {"directions": _r(ks[:2]), "readings": [_r(F) for F in light],
                            "found": _r(pixel.light_two_waves(light))},
    }


def main() -> None:
    OUT.write_text(json.dumps(build(), indent=1) + "\n")
    print("wrote", OUT)


if __name__ == "__main__":
    main()
