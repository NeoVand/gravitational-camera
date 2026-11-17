"""Numbers for the paper's drawn figures, computed here and read by figures3d/figs/*.js.

    python -m gravcam.figure_data          writes reference/results/figures/<name>.json

Every point a figure draws as a result (a star, a direction, a ratio) comes from this file, so that a drawing is
never ahead of the reference implementation.
"""
from __future__ import annotations

import json
import pathlib

import numpy as np

from . import curvature as cv, onepixel, pixel
from .constants import c

OUT = pathlib.Path(__file__).resolve().parents[1] / "results" / "figures"


def _unit(v):
    v = np.asarray(v, dtype=float)
    return v / np.linalg.norm(v)


def _field_W(h, step=1e-3):
    E, B = cv.tidal_tensors(cv.riemann(h, 0.0, np.zeros(3), step))
    return pixel.weyl(E, B)


def _coulomb_F(charges, positions, velocities):
    """F = E + iB (c = 1) at the origin of point charges moving uniformly, from their present positions."""
    F = np.zeros(3, dtype=complex)
    for q, p, v in zip(charges, positions, velocities):
        v = np.asarray(v, dtype=float)
        R = -np.asarray(p, dtype=float)
        b2 = v @ v
        s2 = 1 - (b2 - (v @ R) ** 2 / (R @ R)) if b2 else 1.0
        E = q * (1 - b2) * R / ((R @ R) ** 1.5 * s2 ** 1.5)
        F += E + 1j * np.cross(v, E)
    return F


def _groups(points, tol=1e-3):
    """Coincident stars merged: [(direction, multiplicity)]."""
    out = []
    for p in points:
        for g in out:
            if np.linalg.norm(g[0] / g[1] - p) < tol:
                g[0] += p
                g[1] += 1
                break
        else:
            out.append([p.copy(), 1])
    return [(_unit(s).tolist(), n) for s, n in out]


def stars():
    """The four stars of gravity against the two of light, in four scenes (Fig. stars). World axes of the drawing:
    x right, y up, z toward the reader."""
    k = _unit([0.62, -0.42, 0.66])                         # the wave's direction of travel
    body = np.array([-1.5, 0.0, 0.0])                      # one body, left of the pixel; it moves up (+y)
    pair = ([1e3, 0.45e3], [np.array([-1.5, 0.3, 0.0]), np.array([0.9, 1.1, 0.6])])
    data = {"k": k.tolist(), "body": body.tolist(), "pair": [p.tolist() for p in pair[1]],
            "pair_mass": pair[0], "beta": 0.9}

    # gravity
    E, B = onepixel.plane_wave_tensors(-k, 1.0, 0.4)
    W = pixel.weyl(E, B)
    data["gravity"] = {"wave": _groups(pixel.stars(W)), "wave_type": pixel.petrov(W)}
    track = []
    for beta in np.linspace(0.0, 0.9, 19):
        W = _field_W(cv.boosted_masses_metric([1e3], [body], [[0.0, beta * c, 0.0]]))
        track.append({"beta": float(beta), "stars": _groups(pixel.stars(W), tol=2e-3),
                      "midpoint": pixel.body_velocity(W).tolist(), "type": pixel.petrov(W)})
    data["gravity"]["track"] = track
    W = _field_W(cv.boosted_masses_metric(pair[0], pair[1], [[0.0, 0.0, 0.0]] * 2))
    data["gravity"]["pair"] = _groups(pixel.stars(W))
    data["gravity"]["pair_type"] = pixel.petrov(W)
    data["gravity"]["pair_speciality"] = abs(pixel.speciality(W))

    # light
    e = _unit(np.cross(k, [0.0, 0.0, 1.0]))
    data["light"] = {"wave": _groups(pixel.light_stars(e + 1j * np.cross(k, e)))}
    track = []
    for beta in np.linspace(0.0, 0.9, 19):
        s = pixel.light_stars(_coulomb_F([1.0], [body], [[0.0, beta, 0.0]]))
        track.append({"beta": float(beta), "stars": _groups(s), "midpoint": s.mean(axis=0).tolist()})
    data["light"]["track"] = track
    data["light"]["pair"] = _groups(pixel.light_stars(_coulomb_F(pair[0], pair[1], [[0.0, 0.0, 0.0]] * 2)))
    return data


def voices():
    """One ear, four voices (Fig. voices): four plane waves from fixed directions, each with its own waveform in
    both polarizations, read by one pixel over time; the annihilator of the readings and the four directions it
    gives. Light hears the first two the same way. Directions are toward the sources (n = -k), in the drawing's
    axes (x right, y up, z toward the reader)."""
    t = np.linspace(0.0, 1.0, 600)
    rng = np.random.default_rng(4)
    smooth = np.convolve(rng.normal(size=t.size + 80) + 1j * rng.normal(size=t.size + 80), np.hanning(41), "valid")
    smooth = smooth[: t.size] / np.max(np.abs(smooth[: t.size]))
    wave = [
        np.exp(-(((t - 0.5) / 0.38) ** 4)) * np.exp(2j * np.pi * (3 * t + 7 * t ** 2)),           # a chirp, circular
        np.exp(-(((t - 0.3) / 0.07) ** 2)) * (np.cos(2 * np.pi * 16 * t) + 0.5j * np.sin(2 * np.pi * 16 * t)),
        0.75 * np.sin(2 * np.pi * 2.5 * t + 0.4) + 0j,                                              # slow, linear
        0.8 * smooth,                                                                                 # noise
    ]
    n = [_unit(v) for v in ([-0.6, 0.45, 0.66], [0.45, 0.6, 0.66], [0.62, -0.38, 0.69], [-0.3, -0.62, 0.72])]
    m = [pixel.null_frame(-v) for v in n]
    W = sum(a[:, None, None] * np.einsum("i,j->ij", mm, mm)[None] for a, mm in zip(wave, m))
    A = pixel.annihilator(W)
    found = -pixel.four_waves(W)
    F = sum(a[:, None] * mm[None] for a, mm in zip(wave[:2], m[:2]))
    a = np.linalg.svd(F)[2][-1].conj()
    found_light = -pixel.light_two_waves(F)
    traces = np.concatenate([pixel.vec5(W.real), pixel.vec5(W.imag)], axis=1).T
    error = max(min(np.linalg.norm(f - v) for f in found) for v in n)
    error_light = max(min(np.linalg.norm(f - v) for f in found_light) for v in n[:2])
    return {
        # the waveforms and readings only to be drawn: six decimals
        "t": np.round(t, 6).tolist(),
        "waves": [{"re": np.round(w.real, 6).tolist(), "im": np.round(w.imag, 6).tolist()} for w in wave],
        "traces": np.round(traces / np.max(np.abs(traces)), 6).tolist(),
        "sources": [v.tolist() for v in n],
        "A": {"re": A.real.tolist(), "im": A.imag.tolist()},
        "found": found.tolist(), "error": error,
        "a": {"re": a.real.tolist(), "im": a.imag.tolist()},
        "found_light": found_light.tolist(), "error_light": error_light,
    }


def ranging():
    """How far away is a wave source (Fig. ranging): the exact field of two masses turning in a circle (binary.py),
    read by one pixel at reduced distance kr and inclination iota, against the three statements of the text."""
    import math

    from . import binary
    from .constants import c as C

    pair = binary.Pair(1.0, 1.0, 1.0e6)
    lamr = pair.wavelength / (2 * math.pi)
    omega = 2 * pair.omega

    def cycle(iota, kr, N=16, t0=0.0, step_fraction=2e-3):
        x = kr * lamr * np.array([math.sin(iota), 0.0, math.cos(iota)])
        ts = t0 + np.linspace(0, 2 * math.pi / omega, N, endpoint=False)
        Ws = []
        for t in ts:
            E, B = binary.tidal(pair, t, x[None, :], step_fraction=step_fraction)
            Ws.append(pixel.weyl(E[0], B[0]))
        return ts, np.array(Ws)

    out = {"instant": [], "frequency": [], "split": []}
    # (a) one instant, wave phase theta = 0: s2/s1 of the oscillating part against C(iota, 0)/(kr)^2
    for deg in (40, 70, 90):
        iota = math.radians(deg)
        rows = []
        for kr in (4, 6, 9, 13, 20, 30, 45, 68, 100):
            # the finite-difference step that holds the curvature's small parts best at each distance
            ts, Ws = cycle(iota, kr, t0=kr * lamr / C, step_fraction=5e-3 if kr < 50 else 1e-2)
            s = np.linalg.svd(Ws[0] - Ws.mean(axis=0), compute_uv=False)
            rows.append([kr, float(s[1] / s[0])])
        out["instant"].append({"iota": deg, "C": pixel.ranging_constant(iota, 0.0), "points": rows})
    # (b) over a cycle: the range from the two frequency parts, with no knowledge of the inclination
    for deg in (35, 70):
        iota = math.radians(deg)
        rows = []
        for kr in (6, 9, 13, 20, 30, 45, 68, 100):
            ts, Ws = cycle(iota, kr)
            Wp, Wm = pixel.frequency_parts(ts, Ws, omega)
            rows.append([kr, pixel.range_from_frequency_parts(Wp, Wm)])
        out["frequency"].append({"iota": deg, "points": rows})
    # (c) the two helicities point apart by 8 |cot iota| / kr
    kr = 200
    for deg in range(10, 90, 8):
        iota = math.radians(deg)
        ts, Ws = cycle(iota, kr, N=32)
        Wp, Wm = pixel.frequency_parts(ts, Ws, omega)
        kp = pixel.direction(np.linalg.svd(Wp)[0][:, 0])
        km = pixel.direction(np.linalg.svd(Wm)[0][:, 0])
        out["split"].append([deg, kr * math.acos(min(1.0, float(kp @ km)))])
    out["split_kr"] = kr
    return out


def present_past():
    """The camera sees the present (Fig. present): (a) a body passing the pixel at 0.6 c, its exact field (stretch
    axis) against its retarded position (light); (b) near an orbiting pair, the changing field against Newton's at
    the present and at the retarded positions, as the reduced distance kr grows."""
    import math

    from . import binary, present
    from .constants import c as C

    p0, beta = np.array([0.25, 1.0, 0.0]), 0.6
    v = np.array([beta * C, 0.0, 0.0])
    E, _ = cv.tidal_tensors(cv.riemann(cv.boosted_masses_metric([1e3], [p0], [v]), 0.0, np.zeros(3), 1e-3))
    vals, vecs = np.linalg.eigh(E)
    axis = vecs[:, 0]
    ret = present.retarded_position(p0, v, np.zeros(3))
    out = {"beta": beta, "present": p0.tolist(), "retarded": ret.tolist(), "axis": axis.tolist(),
           "eigenvalues": vals.tolist(), "eigenvectors": vecs.T.tolist(),
           "axis_error": present.angle_between_lines(axis, p0),
           "light_angle": present.angle_between_lines(ret, p0)}
    # far enough out (r = 1000 d) that the hexadecapole the pair model leaves out, (d/r)^2, is below every error shown
    m, d, r = 1.0, 1.0, 1000.0
    x = np.array([r * math.cos(0.4), r * math.sin(0.4), 0.0])
    rows = []
    for kr in (0.02, 0.03, 0.05, 0.07, 0.1, 0.14, 0.2, 0.3):
        pair = binary.Pair(m, d, kr * C / (2 * r))
        ts = np.linspace(0, math.pi / pair.omega, 16, endpoint=False)
        full = np.array([binary.tidal(pair, t, x[None, :])[0][0] for t in ts])
        now = np.array([present.newton_pair(pair, t, x) for t in ts])
        then = np.array([present.newton_pair(pair, t - r / C, x) for t in ts])
        dev = lambda A: A - A.mean(axis=0)
        rows.append([kr, float(np.linalg.norm(dev(full) - dev(now)) / np.linalg.norm(dev(now))),
                     float(np.linalg.norm(dev(full) - dev(then)) / np.linalg.norm(dev(then)))])
    out["pair"] = rows
    return out


FIGURES = {"stars": stars, "voices": voices, "ranging": ranging, "present": present_past}


def main(names=None) -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for name in names or FIGURES:
        path = OUT / f"{name}.json"
        path.write_text(json.dumps(FIGURES[name](), indent=1) + "\n")
        print("wrote", path)


if __name__ == "__main__":
    import sys

    main(sys.argv[1:])
