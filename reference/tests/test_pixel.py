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


def coulomb_F(charges, positions, velocities, x=np.zeros(3)):
    """F = E + iB (c = 1) at x of point charges moving uniformly, from their present positions (exact)."""
    F = np.zeros(3, dtype=complex)
    for q, p, v in zip(charges, positions, velocities):
        v = np.asarray(v, dtype=float)
        R = x - np.asarray(p, dtype=float)
        b2 = v @ v
        s2 = 1 - (b2 - (v @ R) ** 2 / (R @ R)) if b2 else 1.0           # 1 - beta^2 sin^2 psi
        E = q * (1 - b2) * R / ((R @ R) ** 1.5 * s2 ** 1.5)
        F += E + 1j * np.cross(v, E)
    return F


def test_closed_form_fields_of_moving_sources():
    """moving_masses_W (each body's static tide at its rest-frame separation, carried by the boost exp(i eta [u]x))
    equals the curvature of the exact boosted metric; moving_charges_F equals Heaviside's field."""
    for beta in (0.0, 0.3, 0.9):
        masses = rng.uniform(1e3, 5e3, 3)
        pos = rng.normal(size=(3, 3)) * 2
        vel = [unit(rng.normal(size=3)) * beta * c for _ in range(3)]
        W = field_W(cv.boosted_masses_metric(masses, pos, vel))
        assert np.linalg.norm(pixel.moving_masses_W(masses, pos, vel) - W) < 1e-7 * np.linalg.norm(W)
        charges = rng.uniform(0.5, 2, 3)
        F = pixel.moving_charges_F(charges, pos, [v / c * pixel.C_LIGHT for v in vel])
        np.testing.assert_allclose(F, coulomb_F(charges, pos, [v / c for v in vel]), rtol=1e-12, atol=1e-14)


def test_light_has_two_stars_and_cannot_count_charges():
    # a plane wave: a double star on its direction of travel
    for _ in range(5):
        k = unit(rng.normal(size=3))
        e = unit(np.cross(k, rng.normal(size=3)))
        s = pixel.light_stars(e + 1j * np.cross(k, e))
        np.testing.assert_allclose(s, [k, k], atol=1e-6)
    # one charge at rest: the two ends of its line of force; moving: the midpoint is v_perp / c, as for gravity
    for beta in (0.0, 0.5, 0.9):
        v = unit(rng.normal(size=3)) * beta
        p0 = rng.normal(size=3) * 2
        s = pixel.light_stars(coulomb_F([1.0], [p0], [v]))
        n = -unit(p0)
        np.testing.assert_allclose(s.mean(axis=0), v - (v @ n) * n, atol=1e-9)
    # two charges at rest: still two stars, the ends of the line of force, as for one charge somewhere else
    F = coulomb_F([1.0, 0.4], [[-1.45, 0.2, 0.0], [0.3, -1.2, 0.6]], [[0, 0, 0]] * 2)
    s = pixel.light_stars(F)
    E = unit(F.real)
    assert min(np.linalg.norm(s - [E, -E]), np.linalg.norm(s - [-E, E])) < 1e-9


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
    for found in (pixel.light_two_waves(F), pixel.light_stars(np.linalg.svd(F)[2][-1].conj())):
        for k in ks:
            assert min(np.linalg.norm(f - k) for f in found) < 1e-9
    # gravity's annihilator vanishes on the sky at the four directions and nowhere else on a grid of the sky
    ks4 = [unit(rng.normal(size=3)) for _ in range(4)]
    A = pixel.annihilator([sum(wave_W(k, *rng.normal(size=2)) for k in ks4) for _ in range(40)])
    q = lambda k: abs(pixel.null_frame(k) @ A @ pixel.null_frame(k))
    assert max(q(k) for k in ks4) < 1e-12
    grid = [unit(v) for v in rng.normal(size=(2000, 3))]
    far = [g for g in grid if min(np.linalg.norm(g - k) for k in ks4) > 0.3]
    assert min(q(g) for g in far) > 1e-4
    ks3 = [unit(rng.normal(size=3)) for _ in range(3)]
    F3 = np.array([sum(em_wave(k, *rng.normal(size=2)) for k in ks3) for _ in range(50)])
    s = np.linalg.svd(F3, compute_uv=False)
    assert s[-1] > 1e-3 * s[0]                                               # full rank: no annihilator


def test_five_uncorrelated_sources_in_closed_form():
    for _ in range(10):
        ks = [unit(rng.normal(size=3)) for _ in range(5)]
        I = rng.uniform(0.5, 2, 5)
        frac = rng.uniform(-1, 1, 5)
        S_I = sum(i * np.outer(pixel.steering(k), pixel.steering(k).conj()) for i, k in zip(I, ks))
        S_V = sum(i * f * np.outer(pixel.steering(k), pixel.steering(k).conj()) for i, f, k in zip(I, frac, ks))
        dirs, I_found, frac_found = pixel.five_sources(S_I, S_V)
        for d, i, f in zip(dirs, I_found, frac_found):
            a = int(np.argmin([np.linalg.norm(d - k) for k in ks]))
            assert np.linalg.norm(d - ks[a]) < 1e-8
            assert i == pytest.approx(I[a], rel=1e-8) and f == pytest.approx(frac[a], abs=1e-9)


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


# --- further statements of Section III -----------------------------------------------------------------------------

def test_the_phase_of_the_eigenvalues_is_spin():
    """Outside a spinning ball: E of the mass, B of the spin dipole. The eigenvalues are Psi (-2, 1, 1) with complex
    Psi of phase 3 a cos(theta) / r, a = J / M c (first order in a / r)."""
    from gravcam import gravitomagnetic
    from gravcam.constants import G
    M, r = 5.97e24, 6.371e6
    Js = 5.86e33                                             # the Earth's angular momentum
    a = Js / (M * c)
    for theta in (0.0, 0.7):
        n = np.array([math.sin(theta), 0.0, math.cos(theta)])   # from the centre to the pixel
        E = G * M / r ** 3 * (np.eye(3) - 3 * np.outer(n, n))
        B = gravitomagnetic.spin_dipole(np.array([0, 0, Js]), n * r)
        w = np.linalg.eigvals(pixel.weyl(E, B))
        top = w[np.argmax(np.abs(w))]                            # the -2 eigenvalue
        phase = abs(math.atan2(top.imag, -top.real))
        assert phase == pytest.approx(3 * a * math.cos(theta) / r, rel=1e-3, abs=1e-12)


def _fisher_full(model, params, sigma=1.0, h=1e-6):
    cols = []
    for i in range(len(params)):
        up, dn = np.array(params, float), np.array(params, float)
        up[i] += h
        dn[i] -= h
        d = (model(up) - model(dn)) / (2 * h)
        cols.append(np.concatenate([d.real, d.imag]))
    D = np.stack(cols, 1)
    return np.linalg.inv(D.T @ D / sigma ** 2)


def test_direction_bounds_are_one_over_rho_and_sqrt2_over_rho():
    """Fisher information for one wave with its amplitude and polarization unknown: gravity sqrt(2/2)/rho = 1/rho,
    light sqrt(2/1)/rho."""
    k0 = unit(np.array([0.3, 0.5, 0.8]))
    e1 = unit(np.cross(k0, [1.0, 0, 0])); e2 = np.cross(k0, e1)

    def k_of(a, b):
        return unit(k0 + a * e1 + b * e2)

    def m_of(k):                                             # a smooth choice of null vector near k0
        f1 = unit(e1 - (e1 @ k) * k); f2 = np.cross(k, f1)
        return (f1 + 1j * f2) / math.sqrt(2)

    c0 = 0.8 - 0.6j
    grav = lambda p: pixel.vec5((p[2] + 1j * p[3]) * np.outer(m_of(k_of(p[0], p[1])), m_of(k_of(p[0], p[1]))))
    light = lambda p: (p[2] + 1j * p[3]) * m_of(k_of(p[0], p[1]))
    for model, spin in ((grav, 2), (light, 1)):
        cov = _fisher_full(model, [0.0, 0.0, c0.real, c0.imag])
        rho = abs(c0)                                        # |field| / sigma with |m m^T| = |m| = 1
        assert math.sqrt(cov[0, 0]) == pytest.approx(pixel.direction_bound(rho, spin), rel=1e-6)
        assert math.sqrt(cov[1, 1]) == pytest.approx(pixel.direction_bound(rho, spin), rel=1e-6)


def test_sound_separates_two_waves_over_time():
    """A sound wave along k gives (p, v) = s (1, k) (rho c = 1). Two waves' readings span a plane of R^4; the vectors
    (x0, x) in it with |x| = x0 are the two directions (a line meets the quadric |x|^2 = x0^2 in two points)."""
    ks = [unit(rng.normal(size=3)) for _ in range(2)]
    X = np.array([sum(rng.normal() * np.concatenate([[1.0], k]) for k in ks) for _ in range(40)])
    U = np.linalg.svd(X)[2][:2]                              # the plane
    u, w = U[0], U[1]
    # (alpha u + w) on the quadric: (alpha u0 + w0)^2 = |alpha u + w|^2
    q = [u[0] ** 2 - u[1:] @ u[1:], 2 * (u[0] * w[0] - u[1:] @ w[1:]), w[0] ** 2 - w[1:] @ w[1:]]
    found = []
    for al in np.roots(q):
        x = al.real * u + w
        found.append(x[1:] / x[0])
    for k in ks:
        assert min(np.linalg.norm(f - k) for f in found) < 1e-9


# --- arrays of pixels (Section VII) ----------------------------------------------------------------------------------

def test_overlap_of_two_directions_is_cos8():
    for _ in range(20):
        a, b = unit(rng.normal(size=3)), unit(rng.normal(size=3))
        ov = abs(np.vdot(pixel.steering(a), pixel.steering(b))) ** 2
        assert ov == pytest.approx(math.cos(math.acos(np.clip(a @ b, -1, 1)) / 2) ** 8, rel=1e-10, abs=1e-14)


def test_n_pixels_have_5n_independent_steering_vectors():
    """Steering vectors a(k) (x) q(k) of an N-pixel array at wavenumber 1 (positions in wavelengths): 5N directions
    give rank 5N, so subspace methods resolve 5N - 1 sources, even for pixels on one line."""
    for N, line in ((1, False), (2, True), (3, False), (4, True)):
        pos = rng.normal(size=(N, 3)) * 3
        if line:
            pos[:, 1:] = 0
        ks = [unit(rng.normal(size=3)) for _ in range(5 * N)]
        V = np.stack([np.kron(np.exp(2j * math.pi * pos @ k), pixel.steering(k)) for k in ks], 1)
        s = np.linalg.svd(V, compute_uv=False)
        assert s[-1] > 1e-8 * s[0]


def test_two_far_pixels_suppress_grating_lobes():
    """Two pixels D = 100 wavelengths apart, one source with signal-to-noise ratio rho: the Capon response at the
    nearest grating lobe is lower than at the source by 1 + rho^2 (1 - cos^8(theta_1/2)); a scalar pair's is equal."""
    D = 100.0
    pos = np.array([[-D / 2, 0, 0], [D / 2, 0, 0]])
    k0 = np.array([math.sin(1.1) * math.cos(0.4), math.sin(1.1) * math.sin(0.4), math.cos(1.1)])
    # the nearest grating lobe in the plane of the baseline and k0: k_x larger by 1/D
    kx = k0[0] + 1 / D
    k1 = np.array([kx, *(k0[1:] / np.linalg.norm(k0[1:]) * math.sqrt(1 - kx * kx))])
    def v(k):
        return np.kron(np.exp(2j * math.pi * pos @ k), pixel.steering(k)) / math.sqrt(2)
    for rho in (10.0, 100.0, 1000.0):
        S = rho ** 2 * np.outer(v(k0), v(k0).conj()) + np.eye(10)
        Si = np.linalg.inv(S)
        capon = lambda k: 1 / np.real(v(k).conj() @ Si @ v(k))
        th1 = math.acos(np.clip(k0 @ k1, -1, 1))
        assert capon(k0) / capon(k1) == pytest.approx(1 + rho ** 2 * (1 - math.cos(th1 / 2) ** 8), rel=1e-6)
    # a pair of scalar sensors cannot tell the lobe from the source
    a = lambda k: np.exp(2j * math.pi * pos @ k) / math.sqrt(2)
    assert abs(np.vdot(a(k0), a(k1))) == pytest.approx(1.0, abs=1e-9)
