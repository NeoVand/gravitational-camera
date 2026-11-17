"""Friction of real materials at thermal frequencies (gravcam.materials), each piece against an independent route."""
import json
import math
from pathlib import Path

import numpy as np
import pytest
from scipy.integrate import quad

from gravcam import materials as M
from gravcam.constants import c, hbar, kB
from gravcam.emission import absorption_coefficient, number_emissivity, thermal_energy_emissivity
from gravcam.optics import surface_luminosity_sphere, volume_luminosity_sphere

T = M.ROOM
SCENES = Path(__file__).resolve().parents[2] / "scenes"


def integral(f, points, top=None):
    """int_0^inf f, split at `points` (rad/s), with the tail beyond the last point done to infinity."""
    pts = sorted({0.0, *points})
    total = sum(quad(f, a, b, limit=400, epsabs=0.0, epsrel=1e-11)[0] for a, b in zip(pts[:-1], pts[1:]))
    return total + quad(f, pts[-1], np.inf, limit=400)[0]


# --- the sum rule, (2/pi) int Re eta = G_inf - G_0, for every term that has a fixed weight --------------------------

def test_sum_rules():
    tab = M.table()
    for key, material in tab.items():
        for term in material.terms:
            if term.weight is None:
                continue
            f = lambda w: float(term.re_eta(w, T))
            pts = [x for centre, width in term.lines for x in (centre - 30 * width, centre, centre + 30 * width)]
            pts += list(term.edges) + list(np.geomspace(1e11, 1e22, 23))
            assert 2 / math.pi * integral(f, [p for p in pts if p > 0]) == pytest.approx(term.weight, rel=2e-6), key
    # the electrons' share in copper is 2 n E_F / 5, tens of GPa, comparable to its shear modulus
    assert tab["copper"].term("electrons").weight == pytest.approx(38.4e9, rel=0.01)


def test_drude_weight_is_the_fermi_surface_average():
    # Kubo: weight = k T-free part of <Pi^2>/(kT V) = N(E_F) <(p_x v_y)^2>_FS for a degenerate gas; independent of the
    # closed form n m v_F^2 / 5: integrate (n_x n_y)^2 over the sphere numerically and use N(E_F) = m k_F / (pi hbar)^2.
    n_e = M.CU_N
    k_f = (3 * math.pi**2 * n_e) ** (1 / 3)
    p_f, v_f = hbar * k_f, hbar * k_f / M.M_E
    dos = M.M_E * k_f / (math.pi**2 * hbar**2)                     # both spins, per volume per joule
    avg, _ = quad(lambda ct: quad(lambda ph: ((1 - ct**2) * math.cos(ph) * math.sin(ph)) ** 2, 0, 2 * math.pi)[0],
                  -1, 1)
    avg /= 4 * math.pi
    assert avg == pytest.approx(1 / 15, rel=1e-10)
    assert dos * avg * (p_f * v_f) ** 2 == pytest.approx(M.electron_weight(n_e), rel=1e-10)
    # and the free-electron numbers behind it: E_F = 7.05 eV, v_F = 1.57e6 m/s for one electron per copper atom
    assert p_f * v_f / 2 / M.EV == pytest.approx(7.05, abs=0.01)


def test_drude_limits_and_bound():
    n_e, w = M.CU_N, 2 * math.pi * 10e12
    weight = M.electron_weight(n_e)
    assert float(M.drude(w, n_e, 1e-17)) == pytest.approx(weight * 1e-17, rel=1e-3)        # w tau << 1
    assert float(M.drude(w, n_e, 1e-10)) == pytest.approx(weight / (w**2 * 1e-10), rel=1e-3)   # w tau >> 1
    taus = np.geomspace(1e-17, 1e-10, 2001)
    values = M.drude(w, n_e, taus)
    assert values.max() == pytest.approx(float(M.drude_bound(w, n_e)), rel=1e-5)
    assert taus[values.argmax()] * w == pytest.approx(1.0, rel=0.01)
    assert np.all(values <= M.drude_bound(w, n_e) * (1 + 1e-12))


# --- optical phonons driven by internal strain ------------------------------------------------------------------------

def test_internal_strain_softening_and_line():
    si = M.SI
    mass = M.MASS["Si"] * M.AMU
    a0, zeta, w0 = si["a0"], si["zeta"], si["omega0"]
    # Tanner et al., Eqs. (3)-(8): U = C0 e4^2/2 + D14 u e4 + E11 u^2/2, zeta = 4 D14 / (a0 E11); E11 is the optical
    # mode's stiffness per volume, mu w0^2 / Omega_cell with mu = M/2 and Omega_cell = a0^3 / 4. Minimise numerically.
    e11 = (mass / 2) * w0**2 / (a0**3 / 4)
    d14 = zeta * a0 * e11 / 4
    c0 = 110e9
    e4 = 1e-6
    u = np.linspace(-2, 2, 400001) * a0 * zeta / 4 * e4
    energy = 0.5 * c0 * e4**2 + d14 * u * e4 + 0.5 * e11 * u**2
    u_min = u[energy.argmin()]
    assert u_min == pytest.approx(-a0 * zeta / 4 * e4, rel=1e-4)
    relaxed = 2 * energy.min() / e4**2
    assert c0 - relaxed == pytest.approx(M.internal_strain_softening(mass, w0, zeta, a0), rel=1e-6)
    # silicon: about 30 GPa, so the clamped-ion C44 is ~110 GPa against the relaxed 80.2
    assert 25e9 < M.internal_strain_softening(mass, w0, zeta, a0) < 35e9
    # the line is -Im C44(w) / w of the complex modulus C0 - dC w0^2 / (w0^2 - w^2 - i Gamma w), a causal response
    dc, gamma = 30e9, si["width"]
    for w in np.linspace(0.5, 1.5, 11) * w0:
        modulus = c0 - dc * w0**2 / (w0**2 - w**2 - 1j * gamma * w)
        assert -modulus.imag / w == pytest.approx(float(M.lorentz_line(w, dc, w0, gamma)), rel=1e-12)
    poles = np.roots([-1, -1j * gamma, w0**2])
    assert np.all(poles.imag < 0)
    # its peak: weight / width, 0.03 Pa s for silicon's line averaged over directions
    assert float(M.lorentz_line(w0, dc, w0, gamma)) == pytest.approx(dc / gamma, rel=1e-12)


def test_three_of_five_shears_drive_the_line():
    # a TT polarization of a wave in a random direction, in random crystal axes: the off-diagonal (T2g) components
    # carry 3/5 of its square on average (Schur), the diagonal (Eg) ones 2/5
    rng = np.random.default_rng(1)
    fractions = []
    for _ in range(20000):
        n = rng.normal(size=3)
        n /= np.linalg.norm(n)
        u = np.cross(n, rng.normal(size=3))
        u /= np.linalg.norm(u)
        v = np.cross(n, u)
        psi = rng.uniform(0, math.pi)
        e = math.cos(psi) * (np.outer(u, u) - np.outer(v, v)) + math.sin(psi) * (np.outer(u, v) + np.outer(v, u))
        off = e - np.diag(np.diag(e))
        fractions.append(np.sum(off**2) / np.sum(e**2))
    assert np.mean(fractions) == pytest.approx(0.6, abs=0.005)


# --- pairs of thermal phonons --------------------------------------------------------------------------------------

def test_harmonic_chain_stress_fluctuates_at_twice_its_frequencies():
    # A periodic harmonic chain, simulated: its uniform (virial) stress Pi = sum m v^2 - K sum (a + d) d fluctuates
    # although nothing is anharmonic, all of it between 0 and twice the top phonon frequency, with total
    # (2/pi) int Re eta = <Pi^2> / (kT L) = 4 n kT: coupling 2 e_x e_x = 2 per mode, Gamma2 = 4, as the module assumes.
    rng = np.random.default_rng(7)
    N, m, K, a, kT = 64, 1.0, 1.0, 1.0, 1.0
    laplacian = 2 * np.eye(N) - np.roll(np.eye(N), 1, axis=1) - np.roll(np.eye(N), -1, axis=1)
    w2, vecs = np.linalg.eigh(K / m * laplacian)
    wq, vecs = np.sqrt(w2[1:]), vecs[:, 1:]                # the zero mode is uniform motion, left out
    nt, dt = 4096, 0.05
    t = np.arange(nt) * dt
    psd = np.zeros(nt // 2 + 1)
    trials = 24
    var = []
    for _ in range(trials):
        # Boltzmann equilibrium of each normal mode, then exact evolution; positions and velocities in real space
        Q0 = rng.normal(size=N - 1) * np.sqrt(kT / m) / wq
        P0 = rng.normal(size=N - 1) * np.sqrt(kT / m)
        Q = Q0 * np.cos(np.outer(t, wq)) + P0 / wq * np.sin(np.outer(t, wq))
        P = -Q0 * wq * np.sin(np.outer(t, wq)) + P0 * np.cos(np.outer(t, wq))
        u, v = Q @ vecs.T, P @ vecs.T
        d = np.roll(u, -1, axis=1) - u
        pi_t = m * np.sum(v**2, axis=1) - K * np.sum((a + d) * d, axis=1)
        pi_t = pi_t - pi_t.mean()
        var.append(np.mean(pi_t**2))
        spec = np.fft.rfft(pi_t * np.hanning(nt))
        psd += np.abs(spec) ** 2 / (np.sum(np.hanning(nt) ** 2) / dt)          # two-sided S(w) at w >= 0
    psd /= trials
    omega = 2 * math.pi * np.fft.rfftfreq(nt, dt)
    L = N * a
    re_eta = psd / (2 * kT * L)
    weight = 2 / math.pi * np.trapezoid(re_eta, omega)
    n = N / L
    assert np.mean(var) / (kT * L) == pytest.approx(4 * n * kT * (N - 1) / N, rel=0.08)
    assert weight == pytest.approx(4 * n * kT * (N - 1) / N, rel=0.08)
    top = 2 * 2 * math.sqrt(K / m)
    assert np.trapezoid(re_eta[omega > 1.02 * top], omega[omega > 1.02 * top]) < 0.01 * np.trapezoid(re_eta, omega)


def test_pair_band_against_classical_oscillators():
    # Monte Carlo: 3D isotropic oscillators (three polarizations at each q, one sound speed), frequencies drawn from
    # Debye's density, Gaussian amplitudes at temperature kT; Pi_xy = (1/2) d^2/dt^2 (u_x u_y) taken by FFT over a period.
    # Its spectrum, Re eta = S / (2 kT V), against the classical limit of the module's pair band with Gamma2 = 2/3.
    rng = np.random.default_rng(3)
    kT, wD, k = 1.0, 1.0, 8
    phase = 2 * math.pi * np.arange(k) / k                                    # one period of Omega
    harmonic = np.fft.fftfreq(k, 1 / k)                                       # multiples of Omega
    bins = np.linspace(0, 2 * wD, 21)
    hist = np.zeros(len(bins) - 1)
    n_osc = 0
    for _ in range(4):
        n = 250_000
        Omega = wD * rng.uniform(size=n) ** (1 / 3)
        s = np.sqrt(kT) / Omega
        ax, bx, ay, by = (rng.normal(size=n) * s for _ in range(4))
        ux = ax[:, None] * np.cos(phase) + bx[:, None] * np.sin(phase)
        uy = ay[:, None] * np.cos(phase) + by[:, None] * np.sin(phase)
        spec = np.fft.fft(ux * uy, axis=1)
        pi_t = np.real(np.fft.ifft(spec * (-0.5 * (harmonic * Omega[:, None]) ** 2), axis=1))
        power = np.mean(pi_t**2, axis=1)                                      # all of it at 2 Omega
        assert np.allclose(pi_t.mean(axis=1), 0, atol=1e-9 * power.max())
        hist += np.histogram(2 * Omega, bins=bins, weights=power)[0]
        n_osc += n
    V = n_osc / 1.0                                                           # n = 1 atom (one 3D oscillator) per volume
    re_eta = math.pi * hist / np.diff(bins) / (2 * kT * V)
    # the module's form takes SI temperature; far above hbar w / k it is (9 pi / 16) Gamma2 n k T w^2 / wD^3,
    # linear in T, so evaluate it hot and scale back to kT = 1
    t_hot = 1e6 / kB
    expected = np.array([quad(lambda w: float(M.phonon_pairs(w, t_hot, 1.0, wD)), a, b)[0]
                         for a, b in zip(bins[:-1], bins[1:])]) / np.diff(bins) * kT / (kB * t_hot)
    assert np.allclose(re_eta[5:], expected[5:], rtol=0.05)
    assert np.allclose(re_eta[2:5], expected[2:5], rtol=0.25)
    assert np.sum(re_eta * np.diff(bins)) == pytest.approx(np.sum(expected * np.diff(bins)), rel=0.02)


def test_pair_band_quantum_and_classical():
    n, wD = M.CU_N, M.debye_omega(M.CU_THETA)
    w = 0.3 * wD
    hot = 1e5
    classical = 9 * math.pi / 16 * (2 / 3) * n * kB * hot * w**2 / wD**3
    assert float(M.phonon_pairs(w, hot, n, wD)) == pytest.approx(classical, rel=1e-6)
    # at zero temperature pairs are still made (zero-point), but Kirchhoff's glow vanishes with B_omega
    cold = float(M.phonon_pairs(w, 1e-3, n, wD))
    assert cold == pytest.approx(9 * math.pi / 64 * (2 / 3) * n * hbar * w**3 / wD**3, rel=1e-9)
    assert float(M.phonon_pairs(2.01 * wD, 300, n, wD)) == 0.0
    # classical weight 3 n kT Gamma2 = 2 n kT
    weight = 2 / math.pi * quad(lambda x: float(M.phonon_pairs(x, hot, n, wD)), 0, 2 * wD, limit=200)[0]
    assert weight == pytest.approx(2 * n * kB * hot, rel=1e-6)


def test_akhiezer_limits_and_its_tail_against_the_pair_band():
    n, wD = 5e28, 8.5e13
    cv = M.debye_heat_capacity(1e5, n, hbar * wD / kB)
    assert cv == pytest.approx(3 * n * kB, rel=1e-5)                         # Dulong-Petit at high temperature
    tau, g2 = 1e-11, 1.0
    assert float(M.akhiezer(1e6, 300, cv, g2, tau)) == pytest.approx(cv * 300 * tau, rel=1e-6)
    assert float(M.akhiezer(1e15, 300, cv, g2, tau)) == pytest.approx(cv * 300 / (1e30 * tau), rel=1e-6)
    weight = 2 / math.pi * integral(lambda w: float(M.akhiezer(w, 300, cv, g2, tau)), list(np.geomspace(1e9, 1e20, 23)))
    assert weight == pytest.approx(cv * 300 * g2, rel=1e-6)
    # classically (C_v = 3 n k), at the Debye frequency the relaxation tail over the pair band is
    # (16 / 3 pi) (gamma2 / Gamma2) / (w_D tau): smaller by about a thermal phonon's quality factor
    hot = 1e5
    ratio = float(M.akhiezer(wD, hot, 3 * n * kB, g2, tau)) / float(M.phonon_pairs(wD, hot, n, wD, coupling2=g2))
    expected = 16 / (3 * math.pi) / (wD * tau) * (1 + 1 / (wD * tau) ** 2) ** -1
    assert ratio == pytest.approx(expected, rel=1e-4)
    assert ratio < 0.01


# --- water -----------------------------------------------------------------------------------------------------------

def test_water_model_is_schulz_et_al():
    # their Eqs. (13), (16), (18) in complex form, Table III, against the module's real parts
    def complex_eta(w):
        total = 0j
        for eta0, f in M.WATER_MAXWELL:
            tau = 1 / (2 * math.pi * f * 1e12)
            total += eta0 / (1 - 1j * w * tau)
        for eta0, fm, f0 in M.WATER_INERTIA:
            tm, t0 = 1 / (2 * math.pi * fm * 1e12), 1 / (2 * math.pi * f0 * 1e12)
            total += eta0 * (1 - 1j * w * tm) / (1 - 1j * w * t0**2 / tm - w**2 * t0**2)
        return total
    for f in [1e9, 1e11, 1e12, 5e12, 7.83e12, 1.5e13, 3e13, 1e14]:
        w = 2 * math.pi * f
        assert float(M.water(w)) == pytest.approx(complex_eta(w).real, rel=1e-12)
    assert float(M.water(1.0)) == pytest.approx(0.692e-3, rel=1e-6)       # the model's steady viscosity
    # at thermal frequencies the hydrogen-bond stretch and the librations carry it: a quarter of the steady value
    assert 1.5e-4 < float(M.water(2 * math.pi * 8e12)) < 2.5e-4
    assert M.water_weight() == pytest.approx(15.3e9, rel=0.01)


# --- Kirchhoff's integral, against closed forms and the existing modules ---------------------------------------------

def test_flat_friction_reproduces_emission_module():
    flat = M.placeholder()
    p = M.power_per_volume(flat, T)
    assert p == pytest.approx(4 * math.pi * thermal_energy_emissivity(absorption_coefficient(1e-3), T), rel=1e-9)
    assert p == pytest.approx(M.placeholder_power(T), rel=1e-9)
    jn = M.number_emissivity(flat, T)
    exact_mean = math.pi**4 / (30 * 1.2020569031595942)                      # 2.70118 kT
    assert jn == pytest.approx(p / (4 * math.pi * exact_mean * kB * T), rel=1e-9)
    assert jn == pytest.approx(number_emissivity(p / (4 * math.pi), T), rel=1e-4)   # the package rounds to 2.701


def test_bound_line_and_drude_integrals():
    # the 1/omega bound: closed form with zeta(3)
    bound = M.Material("bound", (M.Term("e", lambda w, t: M.drude_bound(w, 2 * M.FE_N)),))
    assert M.power_per_volume(bound, T) == pytest.approx(M.bound_power(2 * M.FE_N, T), rel=1e-8)
    iron_electrons = M.Material("iron electrons", (M.table()["iron"].term("electrons"),))
    assert M.power_per_volume(iron_electrons, T) == pytest.approx(M.bound_power(2 * M.FE_N, T), rel=1e-8)
    # a narrow line: 4 pi alpha_1 (pi/2) weight B(w0), to its width
    si = M.table()["silicon"]
    line = si.term("Raman line")
    p = M.power_per_volume(M.Material("line", (line,)), T)
    closed = 4 * math.pi * M.COUPLING_ALPHA * math.pi / 2 * line.weight * float(M.planck(M.SI["omega0"], T))
    assert p == pytest.approx(closed, rel=0.01)
    # Drude: adaptive quadrature against a dense trapezoid on a log grid
    cu = M.Material("cu", (M.table()["copper"].term("electrons"),))
    w = np.geomspace(1e9, 60 * kB * T / hbar, 400001)
    trap = 4 * math.pi * np.trapezoid(M.spectral_emissivity(cu, w, T), w)
    assert M.power_per_volume(cu, T) == pytest.approx(trap, rel=1e-6)


def test_volume_glow_of_optics_module():
    # Re eta = rho c_T^2 / (omega Q) through this module's integral reproduces optics.volume_luminosity_sphere
    rho, ct, Q, R = 7800.0, 3200.0, 10.0, 0.1
    mat = M.Material("q", (M.Term("q", lambda w, t: rho * ct**2 / (np.asarray(w) * Q)),))
    V = 4 / 3 * math.pi * R**3
    assert M.power_per_volume(mat, T) * V == pytest.approx(volume_luminosity_sphere(R, rho, ct, Q, T), rel=1e-8)
    # and the surface glow per area is Eq. surface-glow's
    steel = M.table()["iron"]
    assert M.surface_power_per_area(steel, T) * 4 * math.pi * R**2 == pytest.approx(
        surface_luminosity_sphere(R, rho, ct, 5900.0, T), rel=1e-12)


# --- the data, against other statements in the same or other sources ------------------------------------------------

def test_material_data_consistency():
    # copper: one electron per atom and tau = 2.5e-14 s give 1.7 microohm cm; Kumar et al. (2022) compute 1.8
    sigma_cu = M.CU_N * M.EV**2 * M.CU_TAU / M.M_E
    assert 1 / sigma_cu * 1e8 == pytest.approx(1.8, rel=0.1)
    assert M.table()["copper"].density == pytest.approx(8970, rel=0.002)
    # the optical Drude fit gives a friction within a factor of two of the conductivity's
    ratio = M.effective_friction(M.copper_optical(), T) / M.effective_friction(M.table()["copper"], T)
    assert 0.5 < ratio < 2
    # iron: 79.6 bohr^3 per atom is the density of the paper's iron
    scene = json.loads((SCENES / "closed-furnace.scene.json").read_text())
    assert M.FE_N * M.MASS["Fe"] * M.AMU == pytest.approx(scene["materials"]["cold-iron"]["density"], rel=0.002)
    # silicon and diamond: Debye temperatures from their elastic constants
    for key, low, high in (("silicon", 640, 660), ("diamond", 2230, 2260)):
        m = M.table()[key]
        n = 8 / M.SI["a0"] ** 3 if key == "silicon" else 8 / M.DIAMOND["a0"] ** 3
        theta = hbar * M.debye_frequency(n, m.c_shear, m.c_long) / kB
        assert low < theta < high
    # BKS silica of Leonforte et al.: their sound speeds follow from their Lame constants and density
    lam, mu, rho = 34.4e9, M.SILICA["mu"], M.SILICA["density"]
    assert math.sqrt(mu / rho) == pytest.approx(M.SILICA["c_shear"], rel=2e-4)
    assert math.sqrt((lam + 2 * mu) / rho) == pytest.approx(M.SILICA["c_long"], rel=2e-4)
    # diamond's line: dephasing 6.8 ps is a full width of 1.56 cm^-1
    assert M.DIAMOND["width"] / M.PER_CM == pytest.approx(1.56, abs=0.01)


# --- the numbers quoted in paper/drafts/materials.tex -----------------------------------------------------------------

PAPER = {   # name: (effective friction, 1e-4 Pa s; power per volume, 1e-35 W/m^3; mean graviton energy, kT), as printed
    "copper": ("1.3", "2.8", "1.4"),
    "iron": ("6", "12", "1.5"),
    "silicon": ("1.6", "3.4", "2.6"),
    "diamond": ("0.12", "0.25", "6.4"),
    "silica glass": ("2.3", "4.8", "2.1"),
    "water": ("0.54", "1.1", "1.7"),
    "placeholder": ("10", "21", "2.70"),
}


def rounds_to(x, printed):
    """x rounded to the significant figures of the printed string equals it."""
    digits = len(printed.replace(".", "").lstrip("0"))
    return float(f"{x:.{digits}g}") == float(printed)


def test_numbers_in_the_table():
    rows = {r.name: r for r in M.summary(T)}
    for name, (eta, power, energy) in PAPER.items():
        r = rows[name]
        assert rounds_to(r.eta_eff / 1e-4, eta), name
        assert rounds_to(r.power / 1e-35, power), name
        assert rounds_to(r.mean_energy_kT, energy), name
    assert M.table()["iron"].bound                                      # printed with "<="


def test_numbers_in_the_text():
    rows = {r.name: r for r in M.summary(T)}
    placeholder = rows["placeholder"].power
    # "one to sixty per cent of the placeholder's power"; "10^-4 Pa s is typical"
    for name in PAPER:
        if name != "placeholder":
            assert 0.01 < rows[name].power / placeholder < 0.6
    typical = [rows[k].eta_eff for k in ("copper", "silicon", "silica glass", "water")]
    assert 0.5e-4 < np.median(typical) < 2e-4
    # what dominates: electrons in metals, the line in silicon; pairs make "an eighth" of diamond's glow
    assert rows["copper"].shares["electrons"] > 0.95 and rows["iron"].shares["electrons"] > 0.95
    assert rows["silicon"].shares["Raman line"] > 0.95
    assert rows["diamond"].shares["phonon pairs"] == pytest.approx(1 / 8, abs=0.02)
    # "in every solid larger than 30 nm the volume outshines the surface"
    for name in ("copper", "iron", "silicon", "diamond", "silica glass"):
        assert rows[name].crossover < 30e-9
    # "a wave's wavenumber is about 1e-5 of that of a sound wave of the same frequency"
    for m in M.table().values():
        if m.c_shear:
            assert 0.5e-5 < m.c_shear / c < 5e-5
    # electrons: weight 2 n E_F / 5 = 38 GPa in copper; omega tau ~ 1 at k T / hbar with tau = 2.5e-14 s
    assert round(M.electron_weight(M.CU_N) / 1e9) == 38
    assert kB * T / hbar * M.CU_TAU == pytest.approx(1.0, abs=0.1)
    # silicon: line at 520 cm^-1 = 15.6 THz, friction 0.03 Pa s there (thirty times the placeholder), weight 30 GPa
    assert M.SI["omega0"] / (2 * math.pi * 1e12) == pytest.approx(15.6, abs=0.05)
    peak = float(M.table()["silicon"].re_eta(M.SI["omega0"]))
    assert f"{peak:.0e}" == "3e-02" and round(peak / M.PLACEHOLDER, -1) == 30
    assert round(M.internal_strain_softening(M.MASS["Si"] * M.AMU, M.SI["omega0"], M.SI["zeta"], M.SI["a0"]) / 1e9) == 30
    # silica: weight about the shear modulus, band below 27 THz
    assert M.SILICA["omega_max"] / M.THZ == 27.0
    # water: near 8 THz the friction is 2e-4 Pa s, a third of the steady viscosity
    w8 = float(M.water(2 * math.pi * 8e12))
    assert f"{w8:.0e}" == "2e-04" and w8 / float(M.water(1.0)) == pytest.approx(1 / 3, abs=0.03)
    # pairs: classical weight 2 n k T, of order a gigapascal at room temperature for the four crystals
    for n in (M.CU_N, M.FE_N, 8 / M.SI["a0"] ** 3, 8 / M.DIAMOND["a0"] ** 3):
        assert 0.3e9 < 2 * n * kB * T < 1.5e9
    # a person, 70 litres of water at 310 K: 9e-37 W, one graviton in 2e8 years
    water = M.table()["water"]
    year = 365.25 * 86400
    p = 0.07 * M.power_per_volume(water, 310.0)
    rate = 0.07 * 4 * math.pi * M.number_emissivity(water, 310.0)
    assert f"{p:.0e}" == "9e-37" and f"{1 / rate / year:.0e}" == "2e+08"
    # metals whose collision rate grows as T: power as T^3, count as T^2; 1500 K against 293 K, about 25 times
    def metal(t):
        tau = M.CU_TAU * 293.0 / t
        return M.Material("m", (M.Term("e", lambda w, _: M.drude(w, M.CU_N, tau)),))
    hot, cold = 1500.0, 293.0
    assert M.power_per_volume(metal(hot), hot) / M.power_per_volume(metal(cold), cold) == pytest.approx(
        (hot / cold) ** 3, rel=1e-7)
    count = M.number_emissivity(metal(hot), hot) / M.number_emissivity(metal(cold), cold)
    assert count == pytest.approx((hot / cold) ** 2, rel=1e-7)
    assert 25 < count < 27 and (hot / cold) ** 3 > 100
