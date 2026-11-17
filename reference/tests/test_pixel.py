"""What one pixel knows (gravcam/pixel.py), checked against our own fields: analytic plane waves (onepixel.py), the
exact boosted field of moving masses (curvature.boosted_masses_metric) and the exact field of an orbiting pair
(binary.py)."""
import math

import numpy as np
import pytest

from gravcam import binary, curvature as cv, onepixel, pixel
from gravcam.constants import c

rng = np.random.default_rng(20261117)


def unit(v):
    return v / np.linalg.norm(v)


def wave_W(k, plus, cross):
    """W of a plane wave travelling along k (onepixel takes the direction toward the source)."""
    E, B = onepixel.plane_wave_tensors(-np.asarray(k), plus, cross)
    return pixel.weyl(E, B)


def field_W(h, x=np.zeros(3), x0=0.0, step=1e-3):
    E, B = cv.tidal_tensors(cv.riemann(h, x0, x, step))
    return pixel.weyl(E, B)


# --- the frame ------------------------------------------------------------------------------------------------------

def test_a_plane_wave_is_a_perfect_square():
    for _ in range(20):
        k = unit(rng.normal(size=3))
        W = wave_W(k, *rng.normal(size=2))
        s = np.linalg.svd(W, compute_uv=False)
        assert s[1] < 1e-12 * s[0]
        assert np.linalg.svd(W.conj(), compute_uv=False)[1] < 1e-12 * s[0]
        assert pixel.petrov(W) == "N"
        np.testing.assert_allclose(pixel.direction(np.linalg.svd(W)[0][:, 0]), k, atol=1e-12)
        assert np.allclose(pixel.stars(W), k, atol=2e-3)                     # a quadruple star (root accuracy)


def test_types():
    one = field_W(cv.boosted_masses_metric([1e3], [[0, 0, 2.0]], [[1e7, 0, 0]]))
    two = field_W(cv.boosted_masses_metric([1e3, 4e2], [[0, 0, 2.0], [1.0, -1.0, 0.5]], [[1e7, 0, 0], [0, 0, 0]]))
    assert pixel.petrov(one) == "D" and abs(pixel.speciality(one)) < 1e-8
    assert pixel.petrov(two) == "I" and abs(pixel.speciality(two)) > 1e-3
    # a spinning ball: E of its mass, B of its spin dipole, still type D (the eigenvalues turn complex together)
    n = unit(np.array([0.3, -0.4, 0.8])); L = np.array([0.0, 0.0, 1.0e10]); M, r = 1e3, 2.0
    E = (6.674e-11 * M / r ** 3) * (np.eye(3) - 3 * np.outer(n, n))
    B = onepixel_spin(L, -n * r)
    W = pixel.weyl(E, B)
    assert pixel.petrov(W) == "D"
    assert pixel.motion_alarm(W) > 0                                         # spin: complex eigenvalues


def onepixel_spin(L, offset):
    from gravcam import gravitomagnetic
    return gravitomagnetic.spin_dipole(L, offset)


# --- result 1: four invariants + three angles + three velocities ----------------------------------------------------

@pytest.mark.parametrize("beta", [0.05, 0.27, 0.6])
def test_exact_speedometer_and_motion_alarm(beta):
    for _ in range(3):
        masses = rng.uniform(1, 10, 4)
        pos = rng.normal(size=(4, 3)) * 2 + np.array([0, 0, 3.0])
        v = unit(rng.normal(size=3)) * beta * c                              # the pixel's velocity
        W = field_W(cv.boosted_masses_metric(masses, pos, [-v] * 4))
        assert pixel.motion_alarm(W) < 1e-8                                  # a static scene: real eigenvalues
        np.testing.assert_allclose(pixel.rest_frame_velocity(W), -v / c, atol=3e-8)
    # something moves relative to the rest: the eigenvalues turn complex
    W = field_W(cv.boosted_masses_metric(masses, pos, [-v, -v, -v, -v + np.array([0.05 * c, 0, 0])]))
    assert pixel.motion_alarm(W) > 1e-4


def test_one_body_leaves_a_boost_free():
    """For light the field at a point is unchanged by a boost along, or a turn about, its own axis (E parallel to B).
    One body does the same to gravity's field (type D): coming straight at the pixel, even at 0.3c, it shows no B at
    all, so its radial speed cannot be read; two bodies remove the blind spot (the exact speedometer above)."""
    for beta in (1e-6, 0.3):
        W = field_W(cv.boosted_masses_metric([1e3], [[0, 0, 2.0]], [[0, 0, -beta * c]]))
        assert np.linalg.norm(W.imag) < 1e-9 * np.linalg.norm(W.real)
        assert pixel.petrov(W) == "D"
        assert np.allclose(pixel.body_velocity(W), 0, atol=1e-6)


# --- result 2: a moving body ----------------------------------------------------------------------------------------

@pytest.mark.parametrize("beta", [0.1, 0.5, 0.9])
def test_four_stars_give_the_sideways_velocity_exactly(beta):
    for _ in range(3):
        v = unit(rng.normal(size=3)) * beta * c
        p0 = rng.normal(size=3) * 2
        W = field_W(cv.boosted_masses_metric([1e3], [p0], [v]))
        n = -unit(p0)                                                        # from the body to the pixel
        v_perp = v - (v @ n) * n
        np.testing.assert_allclose(pixel.body_velocity(W), v_perp / c, atol=2e-7)


def test_time_to_contact():
    """A body coming straight on: E_par = -2 G M / r^3; -3 E / Edot = -r / rdot."""
    r, rdot = 7.0, -0.5
    E = -2 / r ** 3
    Edot = 6 / r ** 4 * rdot
    assert pixel.time_to_contact(E, Edot) == pytest.approx(-r / rdot)


# --- result 3: separating waves -------------------------------------------------------------------------------------

def test_two_waves_at_one_instant():
    for _ in range(100):
        ks = [unit(rng.normal(size=3)) for _ in range(2)]
        W = sum(wave_W(k, *rng.normal(size=2)) for k in ks)
        assert np.linalg.svd(W, compute_uv=False)[2] < 1e-12 * np.linalg.norm(W)     # rank two: det W = 0
        found, amps, ms = pixel.two_waves(W)
        for k in ks:
            assert min(np.linalg.norm(f - k) for f in found) < 1e-9
        rebuilt = sum(a * np.outer(m, m) for a, m in zip(amps, ms))       # the decomposition is the reading
        assert np.linalg.norm(rebuilt - W) < 1e-10 * np.linalg.norm(W)
    # a static mass is not of rank two
    n = unit(rng.normal(size=3))
    assert abs(np.linalg.det(np.eye(3) - 3 * np.outer(n, n))) == pytest.approx(2.0)


def binary_W(k, iota, psi, phi0, amp, phases):
    """W(t) of a circular binary's wave travelling along k, seen at inclination iota, at orbital phases."""
    ap, ax = amp * (1 + math.cos(iota) ** 2) / 2, amp * math.cos(iota)
    out = []
    for p in phases:
        hp, hx = ap * math.cos(p + phi0), ax * math.sin(p + phi0)
        hp, hx = math.cos(2 * psi) * hp - math.sin(2 * psi) * hx, math.sin(2 * psi) * hp + math.cos(2 * psi) * hx
        out.append(wave_W(k, hp, hx))
    return np.array(out)


def test_three_binaries_in_one_frequency_bin():
    N = 16
    ph = 2 * math.pi * np.arange(N) / N
    for _ in range(20):
        ks = [unit(rng.normal(size=3)) for _ in range(3)]
        incs = rng.uniform(0.2, 2.9, 3)
        Ws = sum(binary_W(k, i, *rng.uniform(0, 3, 2), rng.uniform(0.5, 2), ph) for k, i in zip(ks, incs))
        Wp, Wm = pixel.frequency_parts(ph, Ws, 1.0)
        found, lam = pixel.three_waves(Wp, Wm)
        for f, l in zip(found, lam):
            j = int(np.argmin([np.linalg.norm(f - k) for k in ks]))
            assert np.linalg.norm(f - ks[j]) < 1e-9
            t4 = math.tan(incs[j] / 2) ** 4
            assert min(abs(abs(l) - t4) / t4, abs(abs(l) * t4 - 1)) < 1e-8


def test_four_waves_with_any_waveforms():
    for noise in (0.0, 1e-4):
        for _ in range(15):
            ks = [unit(rng.normal(size=3)) for _ in range(4)]
            readings = []
            for t in range(300):
                W = sum(wave_W(k, *rng.normal(size=2)) for k in ks)
                if noise:
                    W = W + noise * (pixel.mat5(rng.normal(size=5)) + 1j * pixel.mat5(rng.normal(size=5)))
                readings.append(W)
            found = pixel.four_waves(readings)
            for k in ks:
                assert min(np.linalg.norm(f - k) for f in found) < (1e-9 if noise == 0 else 1e-3)


def test_light_separates_two_over_time_but_never_three():
    """The same construction for light: a wave is F = E + iB = c m; readings of two waves span a plane of C^3 whose
    annihilator a meets the null conic in two points; three waves fill C^3."""
    def em_wave(k, a, b):
        m = pixel.null_frame(k)
        return (a + 1j * b) * m
    ks = [unit(rng.normal(size=3)) for _ in range(2)]
    F = np.array([sum(em_wave(k, *rng.normal(size=2)) for k in ks) for _ in range(50)])
    a = np.linalg.svd(F)[2][-1].conj()
    X = np.linalg.svd(a[None, :])[2][1:].conj().T
    from scipy.linalg import null_space
    X = null_space(a[None, :])
    found = [pixel.direction(m) for m in pixel._null_in_plane(X[:, 0], X[:, 1])]
    for k in ks:
        assert min(np.linalg.norm(f - k) for f in found) < 1e-9
    ks3 = [unit(rng.normal(size=3)) for _ in range(3)]
    F3 = np.array([sum(em_wave(k, *rng.normal(size=2)) for k in ks3) for _ in range(50)])
    s = np.linalg.svd(F3, compute_uv=False)
    assert s[-1] > 1e-3 * s[0]                                               # full rank: no annihilator


# --- result 4: the sky at one pixel ---------------------------------------------------------------------------------

def _sky_rank(model, pol, N=500, trials=60):
    dirs = np.array([unit(rng.normal(size=3)) for _ in range(N)])
    X = [model(k) for k in dirs]
    d = len(X[0][0])

    def S_of(I, Q, U, V):
        S = np.zeros((d, d), complex)
        for n in range(N):
            M = np.stack(X[n], 1)
            C = (0.5 * np.array([[I[n] + Q[n], U[n] - 1j * V[n]], [U[n] + 1j * V[n], I[n] - Q[n]]])
                 if pol else np.array([[I[n]]]))
            S += M @ C @ M.T
        iu, il = np.triu_indices(d), np.triu_indices(d, 1)
        return np.concatenate([S.real[iu], S.imag[il]])

    def block(kind):
        rows = []
        for _ in range(trials):
            a = {q: np.zeros(N) for q in "IQUV"}
            if kind == "QU":
                a["Q"], a["U"] = rng.normal(size=N), rng.normal(size=N)
            else:
                a[kind] = rng.normal(size=N)
            rows.append(S_of(a["I"], a["Q"], a["U"], a["V"]))
        return np.array(rows)

    def rank(M):
        s = np.linalg.svd(M, compute_uv=False)
        return int(np.sum(s > 1e-9 * s[0]))

    blocks = {k: block(k) for k in (["I", "V", "QU"] if pol else ["I"])}
    return {k: rank(v) for k, v in blocks.items()}, rank(np.concatenate(list(blocks.values()))), d * d, blocks


def test_sky_numbers_per_frequency_for_sound_light_and_gravity():
    def sound(k):
        return [np.concatenate([[1.0], -k])]

    def light(k):
        e1 = unit(np.cross(k, [0.3, 0.5, 0.8])); e2 = np.cross(k, e1)
        return [np.concatenate([e, np.cross(-k, e)]) for e in (e1, e2)]

    def gravity(k):
        E1, B1 = onepixel.plane_wave_tensors(k, 1.0, 0.0)
        E2, B2 = onepixel.plane_wave_tensors(k, 0.0, 1.0)
        return [np.concatenate([pixel.vec5(E1), pixel.vec5(B1)]), np.concatenate([pixel.vec5(E2), pixel.vec5(B2)])]

    r, tot, full, _ = _sky_rank(sound, False)
    assert (r["I"], tot, full) == (9, 9, 16)
    r, tot, full, _ = _sky_rank(light, True)
    assert (r["I"], r["V"], r["QU"], tot, full) == (9, 9, 10, 28, 36)
    r, tot, full, blocks = _sky_rank(gravity, True)
    assert (r["I"], r["V"], r["QU"], tot, full) == (25, 25, 18, 68, 100)
    # brightness never enters the imaginary part, circular polarization never the real part
    assert np.abs(blocks["V"][:, :55]).max() == 0 and np.abs(blocks["I"][:, 55:]).max() == 0
    for s, n in ((1, 28), (2, 68)):
        assert 2 * (2 * s + 1) ** 2 + 2 * (4 * s + 1) == n


# --- result 5: ranging a wave source --------------------------------------------------------------------------------

PAIR = binary.Pair(1.0, 1.0, 1.0e6)
LAMR = PAIR.wavelength / (2 * math.pi)
OMEGA = 2 * PAIR.omega


def _cycle(iota, kr, N=16, t0=0.0, step_fraction=2e-3):
    x = kr * LAMR * np.array([math.sin(iota), 0.0, math.cos(iota)])
    ts = t0 + np.linspace(0, 2 * math.pi / OMEGA, N, endpoint=False)
    Ws = []
    for t in ts:
        E, B = binary.tidal(PAIR, t, x[None, :], step_fraction=step_fraction)
        Ws.append(pixel.weyl(E[0], B[0]))
    return x, ts, np.array(Ws)


@pytest.mark.parametrize("iota_deg", [30, 60, 90])
def test_ranging_constant_at_one_instant(iota_deg):
    iota = math.radians(iota_deg)
    x, ts, Ws = _cycle(iota, 80, t0=80 * LAMR / c, step_fraction=5e-3)       # theta = 0 at the first sample
    s = np.linalg.svd(Ws[0] - Ws.mean(axis=0), compute_uv=False)
    assert 80 ** 2 * s[1] / s[0] == pytest.approx(pixel.ranging_constant(iota, 0.0), rel=0.06)


@pytest.mark.parametrize("iota_deg", [35, 70])
def test_frequency_parts_and_the_range_without_the_inclination(iota_deg):
    iota = math.radians(iota_deg)
    rp, rm = pixel.frequency_ratios(iota)
    x, ts, Ws = _cycle(iota, 40)
    Wp, Wm = pixel.frequency_parts(ts, Ws, OMEGA)
    sp = np.linalg.svd(Wp, compute_uv=False)
    assert 40 ** 2 * sp[1] / sp[0] == pytest.approx(rp, rel=0.04)
    assert pixel.range_from_frequency_parts(Wp, Wm) == pytest.approx(40, rel=0.03)
    # the weaker helicity, whose leading amplitude is small, converges farther out
    x, ts, Ws = _cycle(iota, 120)
    Wp, Wm = pixel.frequency_parts(ts, Ws, OMEGA)
    sm = np.linalg.svd(Wm, compute_uv=False)
    assert 120 ** 2 * sm[1] / sm[0] == pytest.approx(rm, rel=0.04)


@pytest.mark.parametrize("iota_deg", [30, 45, 60, 75])
def test_two_helicity_split_ranges_to_first_order(iota_deg):
    iota = math.radians(iota_deg)
    x, ts, Ws = _cycle(iota, 200, N=32)
    Wp, Wm = pixel.frequency_parts(ts, Ws, OMEGA)
    assert pixel.range_from_helicity_split(Wp, Wm, iota) == pytest.approx(200, rel=5e-3)


def test_ranging_constant_special_values():
    assert pixel.ranging_constant(math.radians(30), 0) == pytest.approx(10 / 49)
    assert pixel.ranging_constant(math.radians(60), 0) == pytest.approx(6 / 25)
    assert pixel.ranging_constant(math.pi / 2, 0.3) == pytest.approx(2.0)
    assert pixel.ranging_constant(math.acos(1 / math.sqrt(3)), 0) == pytest.approx(0.0, abs=1e-12)
    assert pixel.helicity_split(math.radians(60)) == pytest.approx(8 / math.sqrt(3))


# --- result 6: Cramer-Rao bounds ------------------------------------------------------------------------------------

def _fisher_direction(field_of_angles, sigma):
    h = 1e-6
    d1 = (field_of_angles(h, 0) - field_of_angles(-h, 0)) / (2 * h)
    d2 = (field_of_angles(0, h) - field_of_angles(0, -h)) / (2 * h)
    D = np.stack([np.concatenate([d.real, d.imag]) for d in (d1, d2)], 1)
    return np.linalg.inv(D.T @ D / sigma ** 2)


def test_direction_bound_gravity_and_light():
    k0 = unit(np.array([0.3, 0.5, 0.8]))
    e1 = unit(np.cross(k0, [1.0, 0, 0])); e2 = np.cross(k0, e1)
    plus, cross, sigma = 0.8, 0.6, 1.0

    def grav(a, b):
        W = wave_W(unit(k0 + a * e1 + b * e2), plus, cross)
        return pixel.vec5(W)                     # ten real numbers as five complex

    rho = np.linalg.norm(pixel.vec5(wave_W(k0, plus, cross))) / sigma
    cov = _fisher_direction(grav, sigma)
    # the polarization angle is a nuisance; with the amplitude known the bound is at most 1/rho
    assert math.sqrt(cov[0, 0]) <= pixel.direction_bound(rho, 2) * 1.0000001
    assert pixel.direction_bound(rho, 1) == pytest.approx(math.sqrt(2) * pixel.direction_bound(rho, 2))


def test_speedometer_bound():
    lam, sigma = np.array([2.0, -0.5, -1.5]), 1.0
    np.testing.assert_allclose(pixel.speedometer_bound(lam, sigma),
                               [1 / (math.sqrt(2) * 1.0), 1 / (math.sqrt(2) * 3.5), 1 / (math.sqrt(2) * 2.5)])
    assert pixel.speedometer_bound([-2, 1, 1], 1.0)[0] == math.inf          # one body: no radial speed
