"""Numbers for the paper's drawn figures, computed here and read by figures3d/figs/*.js.

    python -m gravcam.figure_data          writes reference/results/figures/<name>.json

Every point a figure draws as a result (a star, a direction, a ratio) comes from this file, so that a drawing is
never ahead of the reference implementation.
"""
from __future__ import annotations

import json
import math
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


def _changing_part(pair):
    """The same pair with every part of its field that does not change left out: no mass, no spin, and only the
    turning part of its second moment. The field is linear in these, so what remains is exactly the changing part
    of the full field, and it is what W(t) - <W>, W_+ and W_- read.

    It must be left out before the curvature is taken. The curvature comes from second differences of the metric,
    and far out the static potential of the pair's mass, G M / c^2 r, is (c/v)^2 times the changing part
    ((c/v)^2 = 3.6e5 for the pair of Fig. ranging): the rounding error of each metric value, 1e-16 of the static part
    and amplified by 1/step^2, then reaches about 1e-5 of the wave's curvature, as large as the departure from rank
    one that ranging reads at kr = 100 (2 tan^2(iota/2)/(kr)^2 = 2e-5 at iota = 35 degrees)."""
    from . import binary

    class Changing(binary.Pair):
        def __init__(self):
            super().__init__(pair.m, pair.d, pair.omega)
            self.mass = 0.0
            self.spin = np.zeros(3)

        def moments(self, u):
            I, I1, I2 = super().moments(u)
            I = I.copy()
            k = 0.25 * self.m * self.d ** 2                 # the static part of I: k diag(1, 1, 0)
            I[:, 0, 0] -= k
            I[:, 1, 1] -= k
            return I, I1, I2

    return Changing()


def ranging():
    """How far away is a wave source (Fig. ranging): the exact field of two masses turning in a circle (binary.py),
    read by one pixel at reduced distance kr and inclination iota, against the three statements of the text. Only
    the changing part of the field is computed (_changing_part): it is all that the three statements read."""
    import math

    from . import binary
    from .constants import c as C

    pair = _changing_part(binary.Pair(1.0, 1.0, 1.0e6))
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
            ts, Ws = cycle(iota, kr, t0=kr * lamr / C)
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
        # the changing part of the exact field, computed alone: near the pair it is (d/r)^2 of the static tide, and
        # the differences it is compared by are (kr)^2 smaller again (see _changing_part)
        full = np.array([binary.tidal(_changing_part(pair), t, x[None, :])[0][0] for t in ts])
        now = np.array([present.newton_pair(pair, t, x) for t in ts])
        then = np.array([present.newton_pair(pair, t - r / C, x) for t in ts])
        dev = lambda A: A - A.mean(axis=0)
        rows.append([kr, float(np.linalg.norm(dev(full) - dev(now)) / np.linalg.norm(dev(now))),
                     float(np.linalg.norm(dev(full) - dev(then)) / np.linalg.norm(dev(then)))])
    out["pair"] = rows
    return out


def speedometer():
    """The speedometer and the alarm (Fig. speedometer): a pixel crossing a room of four masses at 0.6 c, at points
    along its path. For the room at rest the eigenvalues of W are real and the pixel reads its own velocity from W;
    with one mass moving across the room at 0.05 c they turn complex. Room axes: x along the path, y across it,
    z up; positions in the room's frame, contracted along x in the pixel's."""
    import math

    beta, u = 0.6, 0.05
    gamma = 1 / math.sqrt(1 - beta ** 2)
    masses = [6.0, 3.0, 8.0, 4.0]
    room = np.array([[-2.2, 1.6, 0.6], [0.4, -1.9, -0.4], [1.3, 2.2, 0.3], [3.0, -1.0, 0.5]])
    v = np.array([beta * c, 0.0, 0.0])
    moving = 1                                                  # this mass walks across the room, along +y
    rows = []
    for X in np.linspace(-4.0, 4.0, 161):
        rel = room - np.array([X, 0.0, 0.0])
        rel[:, 0] /= gamma
        out = {"x": float(X)}
        for case, extra in (("still", 0.0), ("moving", u * c / gamma)):
            vel = [-v + (np.array([0.0, extra, 0.0]) if i == moving else 0.0) for i in range(4)]
            W = _field_W(cv.boosted_masses_metric(masses, rel, vel))
            w = np.linalg.eigvals(W)
            w = w[np.argsort(w.real)] / np.max(np.abs(w))
            out[case] = {"alarm": pixel.motion_alarm(W), "eig": [[float(z.real), float(z.imag)] for z in w]}
            if case == "still":
                read = -pixel.rest_frame_velocity(W)
                out[case]["read"] = read.tolist()
                out[case]["error"] = float(np.linalg.norm(read - v / c))
        rows.append(out)
    return {"beta": beta, "u": u, "masses": masses, "room": room.tolist(), "moving": moving, "path": rows}


def beyond_gr():
    """Beyond general relativity in one reading (Fig. beyond): for waves of a massive graviton (helicity 0) and of a
    massive scalar at several phase speeds, the curvature computed from the metric by finite differences, inverted
    from one reading (beyond.invert_one_reading) for n = c/v_p and the ratio of longitudinal to breathing
    amplitude."""
    import math

    from . import beyond

    omega = 2 * math.pi * 100.0
    k = np.array([0.6, 0.0, 0.8])
    e1 = np.array([0.8, 0.0, -0.6])

    def reading(eps, n):
        h = beyond.metric_wave(eps, n, k, omega)
        return cv.tidal_tensors(cv.riemann(h, 0.0, np.zeros(3), c / omega * 1e-3))

    rows = []
    for n in (0.15, 0.3, 0.45, 0.6, 0.75, 0.85, 0.92):
        row = {"n": n}
        for name, eps in (("graviton", beyond.fierz_pauli_helicity0(n, k)), ("scalar", beyond.scalar_mode())):
            E, B = reading(eps * 1e-3, n)
            _, n_found, pol, residual = beyond.invert_one_reading(E, B, e1=e1)
            row[name] = {"n": n_found, "ratio": pol["l"] / pol["b"], "residual": residual}
        rows.append(row)
    return {"rows": rows}


def two_pixels():
    """Two pixels far apart (Fig. two-pixels): (a) the response across the sky of two sensors D apart to a source
    at broadside, scalar against tensor (the steering vectors of pixel.steering); (b) with a minimum-variance (Capon)
    estimator, how far the true fringe stands above the nearest false one for D = 100 wavelengths."""
    import math

    def v(k, pos):
        return np.kron(np.exp(2j * math.pi * pos @ k), pixel.steering(k)) / math.sqrt(2)

    D = 6.0
    pos = np.array([[-D / 2, 0, 0], [D / 2, 0, 0]])
    k0 = np.array([0.0, 0.0, 1.0])
    th = np.linspace(-math.pi, math.pi, 2401)
    pattern = []
    for t in th:
        k = np.array([math.sin(t), 0.0, math.cos(t)])
        tensor = abs(np.vdot(v(k0, pos), v(k, pos))) ** 2
        scalar = abs(np.vdot(np.exp(2j * math.pi * pos @ k0), np.exp(2j * math.pi * pos @ k))) ** 2 / 4
        pattern.append([round(float(t), 6), round(float(scalar), 6), round(float(tensor), 6)])
    D2 = 100.0
    pos2 = np.array([[-D2 / 2, 0, 0], [D2 / 2, 0, 0]])
    k0 = np.array([math.sin(1.1) * math.cos(0.4), math.sin(1.1) * math.sin(0.4), math.cos(1.1)])
    kx = k0[0] + 1 / D2
    k1 = np.array([kx, *(k0[1:] / np.linalg.norm(k0[1:]) * math.sqrt(1 - kx * kx))])
    th1 = math.acos(np.clip(k0 @ k1, -1, 1))
    capon = []
    for rho in np.logspace(0, 4, 13):
        S = rho ** 2 * np.outer(v(k0, pos2), v(k0, pos2).conj()) + np.eye(10)
        Si = np.linalg.inv(S)
        c_ = lambda k: 1 / np.real(v(k, pos2).conj() @ Si @ v(k, pos2))
        capon.append([float(rho), float(c_(k0) / c_(k1))])
    return {"D": D, "pattern": pattern, "D_capon": D2, "theta1": th1, "capon": capon}


def silent_flows():
    """Silent flows (Fig. silent-flows): inside a ball, a swirl about the z axis and meridional rolls of the same
    smooth profile (nullspace.ball_flows); outside, in the meridian plane y = 0, the size of the magnetic part of
    the field of each, by the same integration over the ball."""
    from . import nullspace

    grid, dV, swirl, rolls = nullspace.ball_flows(n=64, power=5)
    g = np.linspace(-2.0, 2.0, 41)
    out = {"g": g.tolist(), "swirl": [], "rolls": []}
    for z in g:
        rows = {"swirl": [], "rolls": []}
        for x in g:
            if x * x + z * z < 1.1 ** 2:
                rows["swirl"].append(None)
                rows["rolls"].append(None)
                continue
            p = np.array([x, 0.0, z])
            rows["swirl"].append(float(np.linalg.norm(nullspace.external_magnetic(swirl, grid, dV, p))))
            rows["rolls"].append(float(np.linalg.norm(nullspace.external_magnetic(rolls, grid, dV, p))))
        out["swirl"].append(rows["swirl"])
        out["rolls"].append(rows["rolls"])
    return out


def ladder():
    """The reach of a tide of given degree (Fig. ladder). The pair of bodies of readings.ladder_pair, each as
    (mass, radius) shells in units of M and R; the energy that an impulsive tide of profile g = Re (x + iy)^n / n
    gives each, int rho |grad g|^2 dV in units of M R^(2n-2) (to be multiplied by half the square of the tide's
    strength), for n = 2 and 3; the gradient of each profile at a few places, for the arrows of the drawing; and,
    for its panel (b), the number of polynomials of each degree d with Lap^m P = 0 (readings.ladder_dimension),
    which a figure that draws 2L + 1 beads on each of the floors j < m must reproduce."""
    from . import hair, readings

    bodies = readings.ladder_pair(1.0, 1.0)
    tides = []
    for n in (2, 3):
        gain = []
        for body in bodies:
            p, m = readings.shells_as_points(body)
            grad = readings.power_gradient((1, 1j, 0), n, p).real
            gain.append(float(np.real(hair.bilinear(m, grad, grad))))
        # the kick of a part at the angle t on the unit circle of the plane z = 0, for checking the arrows
        t = np.radians(np.arange(0.0, 360.0, 7.5))
        ring = np.stack([np.cos(t), np.sin(t), np.zeros_like(t)], axis=1)
        kick = readings.power_gradient((1, 1j, 0), n, ring).real
        tides.append({"degree": n, "gain": gain, "angle_deg": np.degrees(t).tolist(), "kick": kick[:, :2].tolist()})
    dimension = {str(m): [readings.ladder_dimension(d, m) for d in range(5)] for m in (1, 2, 3, 4)}
    return {"bodies": [[list(shell) for shell in body] for body in bodies], "tides": tides, "dimension": dimension}


TWO_READINGS_VIEW = (18.0, 25.0)
"""The view of the cone in Fig. two-readings: degrees above the plane of K, and degrees turned about the axis of kap."""


def two_readings():
    """The two readings as one transform (Fig. two-readings). The cone kap = |K| is drawn from TWO_READINGS_VIEW, and
    the pair (k, k') drawn in full lies on the two generators that are its outline from there, with |k| = 0.38 and
    |k'| = 0.19 of the greatest kap drawn. Their sum is the point (K, kap) = (k + k', |k| + |k'|) inside the cone
    (readings.cone_point). Returned with it: the ellipse of all the pairs that read that point, |k| + |k'| = kap
    with k + k' = K (readings.pair_on_the_ellipse), the pair drawn and one more pair further
    round it; and, for a scene of three masses, how far the transform found from the second reading of each
    pair is from the scene's own at that point (readings.transform_from_second_reading against
    readings.scene_transform): the pairs agree."""
    from . import readings

    tilt, turn = (math.radians(a) for a in TWO_READINGS_VIEW)
    # the azimuth, in the plane of K, of the direction to the reader, and the half-width of the part of the cone
    # whose outside faces the reader: the generators at its ends are the outline
    toward = math.pi / 2 + turn
    half = math.acos(math.tan(tilt))
    k = 0.38 * np.array([math.cos(toward + half), math.sin(toward + half)])
    kp = 0.19 * np.array([math.cos(toward - half), math.sin(toward - half)])
    K, kap = readings.cone_point(k, kp)
    # where the pair sits on its ellipse
    focus = np.linalg.norm(K) / 2
    e1 = K / (2 * focus)
    e2 = np.array([-e1[1], e1[0]])
    major, minor = kap / 2, math.sqrt((kap / 2) ** 2 - focus**2)
    shown = math.atan2((k - K / 2) @ e2 / minor, (k - K / 2) @ e1 / major)
    again = readings.pair_on_the_ellipse(K, kap, shown)
    assert np.allclose(again[0], k) and np.allclose(again[1], kp)
    angles = np.radians(np.arange(0.0, 360.0, 3.0))
    ellipse = [readings.pair_on_the_ellipse(K, kap, t)[0].tolist() for t in angles]
    others = [readings.pair_on_the_ellipse(K, kap, shown + math.radians(a))[0].tolist() for a in (225.0,)]
    # a scene: three masses beneath the camera, at depths of the order of 1 / kap
    points = np.array([[0.4, -0.3, 1.2], [-0.9, 0.5, 2.0], [0.2, 0.8, 0.7]])
    masses = np.array([1.0, 2.0, 0.5])
    exact = readings.scene_transform(points, masses, K, kap)
    worst = max(abs(readings.transform_from_second_reading(points, masses, K, kap, t) - exact) for t in angles)
    return {"tilt_deg": TWO_READINGS_VIEW[0], "turn_deg": TWO_READINGS_VIEW[1], "K": K.tolist(), "kap": kap,
            "k": k.tolist(), "kp": kp.tolist(), "ellipse": ellipse, "others": others,
            "axes": [major, minor], "symbol": readings.laplacian_symbol(K, kap),
            "disagreement": float(worst / abs(exact))}


def hidden_flow():
    """The flow that two tides find (Fig. hidden-flow): the counter-rotating sphere of readings.py, uniform, its
    inner ball of radius 2^(-1/5) R turning at +Omega and the rest at -Omega. Returned: that radius; the angular
    momentum of each part, in units of M Omega R^2, to which the bracket of every quadrupolar pair is proportional;
    and the share of each part in the bracket {dQ_h/dt, dQ_g/dt} of the octupolar pair h + ig = (x + iy)^3 / 3
    (readings.rate_bracket), in units of M Omega R^4, with their sum. The first two cancel; the last two do not."""
    from . import readings

    M = Omega = R = 1.0
    points, masses, velocities = readings.counter_rotating_sphere(M, Omega, R)
    inner = np.linalg.norm(points, axis=1) < readings.INNER_RADIUS * R
    momenta = masses[:, None] * velocities
    spin = lambda part: float(np.sum(masses[part] * (points[part, 0] * velocities[part, 1]
                                                       - points[part, 1] * velocities[part, 0])))

    def bracket(part, n):
        a = (1, 1j, 0)
        g, H = readings.power_gradient(a, n, points[part]), readings.power_hessian(a, n, points[part])
        return readings.rate_bracket(momenta[part], g.real, H.real, g.imag, H.imag)

    out = {"inner_radius": readings.INNER_RADIUS,
           "spin": [spin(inner), spin(~inner)],
           "quadrupolar": [bracket(inner, 2), bracket(~inner, 2)],
           "octupolar": [bracket(inner, 3), bracket(~inner, 3)],
           "bracket": readings.hidden_spin_rate_bracket(M, Omega, R)}
    assert abs(sum(out["octupolar"]) - out["bracket"]) < 1e-12 and abs(sum(out["spin"])) < 1e-12
    return out


def near_field_geometry():
    """The geometry of the near field (Fig. near-field-geometry). Beneath a flat camera whose pixels are p apart,
    cells of one size in the metric (dx^2 + dy^2 + dz^2) / z^2: the level n lies between the depths p 2^n and
    p 2^(n+1) and its cells are p 2^n across, as wide as their tops are deep. Lengths here are in units of the
    deepest level's top, 8 p. Two equal masses, each at the middle of a cell; what a row of pixels above them
    records of each, -E_zz from tidal.point_mass_tidal_tensor, divided by its greatest value; the width of that
    pattern at half its height, in units of the depth of the mass, which is the same for any depth; and the area
    of a cell of each level in that metric, across and in depth, which is the same for every level."""
    from scipy.optimize import brentq

    from . import tidal

    pitch, levels, width = 0.125, 4, 4.0                       # in units of 8 p: the block is 32 p wide and 16 p deep
    tops = [pitch * 2**n for n in range(levels)]
    masses = [[-1.375, 0.375], [0.5, 1.5]]                     # (place across, depth): in levels 1 and 3
    for place, depth in masses:
        n = int(math.floor(math.log2(depth / pitch)))
        side = pitch * 2**n
        assert abs((place + width / 2) / side % 1 - 0.5) < 1e-12 and abs(depth - 1.5 * side) < 1e-12
    row = np.linspace(-width / 2, width / 2, 641)

    def recorded(x, place, depth):
        return -tidal.point_mass_tidal_tensor(np.array([x, 0.0, 0.0]), np.array([place, 0.0, -depth]), 1.0)[2, 2]

    profiles = []
    for place, depth in masses:
        peak = recorded(place, place, depth)
        profiles.append([recorded(x, place, depth) / peak for x in row])
    half = brentq(lambda t: recorded(t, 0.0, 1.0) / recorded(0.0, 0.0, 1.0) - 0.5, 0.0, 1.0)
    areas = [side * (1 / side - 1 / (2 * side)) for side in tops]            # int dx dz / z^2 over a cell
    return {"pitch": pitch, "width": width, "tops": tops, "masses": masses, "row": row.tolist(),
            "recorded": profiles, "width_at_half_height": 2 * half, "cell_areas": areas}


PASSING_IMPACT = 1.5
"""Where the path of the mass in Fig. passing crosses the plane across it, in units of R."""
PASSING_SKIN = 0.96
"""Where the drawing puts a part of a shell, in units of its radius: the middle of the skin of figures3d/stone.js,
whose inner radius is 0.92 of the outer."""


def passing_mass():
    """A mass that passes (Fig. passing). The pair of bodies of readings.ladder_pair (as in Fig. ladder), seen along
    the straight path of a point mass that crosses the plane through their centres at b = PASSING_IMPACT R. Units: M,
    R and C = 2 G mu / V, so that a part at the projected place s receives the velocity (b - s) / |b - s|^2 and the
    energies are in units of M C^2 / 2 R^2. Returned: for each body, on the circle of radius PASSING_SKIN times each
    shell's radius, the four places at which the impulse less the recoil of the whole body lies along the radius
    (the recoil, for a round body, is b / b^2: passing.recoil_F, so that a mass at the centre receives none), with
    those impulses; the internal energies at b
    (passing.twin_energies), the excess of the second over the first, and both against b/R from 1.1 to 4 for panel
    (b); the far limits, (1/3) (R/b)^4 for both and (2/15) (R/b)^6 for the difference; and, as a check, the total
    momentum of the impulses less the recoil over each body made of particles (passing.particles), which is zero,
    and the energy of those relative motions, which is the internal energy."""
    from scipy.optimize import brentq

    from . import passing as ps

    b = PASSING_IMPACT
    bodies = ps.twins()
    relative = lambda s: (b - s) / np.abs(b - s) ** 2 - 1.0 / b            # complex: x + i y, b on the x axis
    across = lambda t, r: (relative(r * np.exp(1j * t)) * np.exp(-1j * t)).imag    # the part across the radius
    kicks = []
    for body in bodies:
        rings = []
        for m, r in body:
            if r == 0.0:
                rings.append({"radius": 0.0, "angle_deg": [], "kick": [[float(relative(0j).real), float(relative(0j).imag)]]})
                continue
            # the four places on the circle at which the impulse less the recoil lies along the radius: towards b and
            # away from it, and the pair between, where it points in
            turn = brentq(across, math.radians(30.0), math.radians(120.0), args=(PASSING_SKIN * r,), xtol=1e-15)
            t = np.array([0.0, turn, math.pi, 2.0 * math.pi - turn])
            k = relative(PASSING_SKIN * r * np.exp(1j * t))
            rings.append({"radius": r, "angle_deg": np.degrees(t).tolist(), "kick": np.stack([k.real, k.imag], axis=1).tolist()})
        kicks.append(rings)
    net, energy = [], []
    for body in bodies:
        points, masses = ps.particles(body, n_mu=24, n_phi=96)
        k = relative(points[:, 0] + 1j * points[:, 1])
        net.append(abs(complex(np.sum(masses * k))))
        energy.append(float(np.sum(masses * np.abs(k) ** 2)))
    energies = list(ps.twin_energies(b))
    grid = np.geomspace(1.1, 4.0, 241)
    curves = [[ps.twin_energies(x)[i] for x in grid] for i in (0, 1)]
    return {"bodies": [[list(shell) for shell in body] for body in bodies], "b": b, "skin": PASSING_SKIN,
            "kicks": kicks, "recoil": [1.0 / b, 0.0],
            "energies": energies, "excess": energies[1] / energies[0] - 1.0,
            "curve_b": grid.tolist(), "curves": curves,
            "far": {"common": 1.0 / 3.0, "difference": 2.0 / 15.0},
            "net_momentum": net, "relative_energy": energy}


FIGURES = {"stars": stars, "voices": voices, "ranging": ranging, "present": present_past,
           "speedometer": speedometer, "beyond": beyond_gr,
           "two-pixels": two_pixels, "silent-flows": silent_flows, "ladder": ladder,
           "two-readings": two_readings, "hidden-flow": hidden_flow,
           "near-field-geometry": near_field_geometry, "passing": passing_mass}


def main(names=None) -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for name in names or FIGURES:
        path = OUT / f"{name}.json"
        path.write_text(json.dumps(FIGURES[name](), indent=1) + "\n")
        print("wrote", path)


if __name__ == "__main__":
    import sys

    main(sys.argv[1:])
