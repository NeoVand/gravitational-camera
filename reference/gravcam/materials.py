"""The friction of real materials at the frequencies of heat, and the thermal glow it sets.

Paper, Section VI ("Gravitational colour"); drafted in paper/drafts/materials.tex.

What is needed. A gravitational wave of angular frequency w has wavenumber w / c, about 1e-5 of that of a sound wave
of the same frequency, so it probes a material's response to a uniform shear. By the fluctuation-dissipation theorem

    Re eta(w) = (1 - exp(-hbar w / kT)) / (2 hbar w V) * S(w),

with S the spectrum of the volume-integrated traceless stress Pi_xy at zero wavenumber (Wightman order). By
Kramers-Kronig its integral is fixed by how much of the stiffness against shear relaxes (Srivastava, Widom & Pizzella
2003, Eq. 59):

    (2 / pi) int_0^inf Re eta dw = G_inf - G_0,                                                       (sum rule)

where G_inf is the stiffness against a shear too fast for the atoms and the conduction electrons to follow, though slow
for the bound electrons, and G_0 the static one. A single sound quantum cannot be made in the bulk (the wave's momentum
is far too small), so each mechanism below places its share of the sum somewhere else:

1. Conduction electrons, free-electron Drude. A shear deforms the Fermi sphere; collisions relax it in a time tau:
       Re eta = (n m v_F^2 / 5) tau / (1 + w^2 tau^2),   weight n m v_F^2 / 5 = 2 n E_F / 5,
   at most n m v_F^2 / (10 w), reached at w tau = 1.
2. Optical phonons that a uniform shear drives, through internal strain. In a crystal of diamond structure a shear
   eps_4 = 2 eps_yz displaces one sublattice against the other by u_x = -(a zeta / 4) eps_4 (Kleinman's zeta), and the
   Raman line at w0 is that motion (Tanner et al. 2021, Eqs. 3-8). With E11 = M w0^2 / (2 Omega_cell) per unit volume:
       Re eta = dC44 w0^2 Gamma / ((w0^2 - w^2)^2 + Gamma^2 w^2),   dC44 = C44(clamped) - C44 = M w0^2 zeta^2 / (8 a),
   for the three T2g shears and nothing for the two Eg ones: 3/5 of it averaged over the wave's direction. Gamma is
   the measured width of the Raman line; the oscillator's far wings, which hold little, are not modelled.
3. A glass: non-affine relaxation (Lemaitre & Maloney 2006; Damart, Tanguy & Rodney 2017). A uniform strain pushes
   every vibration of the disordered network; weight G_affine - G, spread here evenly over the band 0 < w < w_max:
       Re eta = (pi / 2) dG / w_max.
4. Liquid water: the viscoelastic network that Schulz et al. (2020) fitted to the zero-wavenumber viscosity spectrum
   of TIP4P/2005 water (their Eq. 18 and Table III): two Maxwell elements and two "shear inertia" elements, the latter
   being Lorentz lines of weight K = eta0 tau_m / tau_0^2.
5. Pairs of thermal phonons, in every crystal. The stress at zero wavenumber is quadratic in the displacements; for a
   harmonic lattice Pi_ij = (1/2) d^2/dt^2 sum_atoms m u_i u_j (kinetic plus potential stress, the bulk part of the
   virial identity), which oscillates at sums of two phonon frequencies. A wave makes or unmakes a pair (q, -q):
       Re eta = (9 pi / 64) Gamma2 n hbar w^3 / w_D^3 coth(hbar w / 4 kT),   w < 2 w_D,
   for a Debye solid of n atoms per volume and one sound speed. The harmonic coupling gives Gamma2 = 2/3 (a mode of
   polarization e couples as 2 e_x e_y; with three polarizations at each q, sum over pairs = 2 per three modes).
   Anharmonicity adds the mode Grueneisen tensor to that coupling, which changes Gamma2 by a factor of order one.
6. Akhiezer relaxation of the thermal phonon gas, for comparison:
       Re eta = C_v T gamma2 tau / (1 + w^2 tau^2),
   with weight C_v T gamma2, of the same order as the pair band's (the number-conserving part of the same coupling,
   gamma2 its mean-square Grueneisen parameter), but centred on zero frequency. Where the phonons are well defined its
   tail at thermal frequencies is smaller than the pair band by about w_D tau, a thermal phonon's quality factor.

Emission (Kirchhoff, Eq. kirchhoff): j_w = alpha(w) B_w(T), alpha = 16 pi G Re eta / c^3; the power per volume is
4 pi int j_w dw and the number emissivity int j_w / (hbar w) dw per steradian.

Validity. Every form assumes hbar w well below the bound electrons' excitations (eV). The Drude collision rate depends
on frequency once hbar w exceeds the phonon energies, by a factor of order one. The pair band ends at twice the highest
phonon frequency; beyond it only processes with three or more phonons remain. The Debye spectrum smooths the real
two-phonon density of states, which has peaks. The water model is classical and rigid (no intramolecular modes, which
lie in the Wien tail at room temperature). Iron's electrons are not free, and its value is the free-electron bound.
"""
from __future__ import annotations

import math
from dataclasses import dataclass, field
from typing import Callable

import numpy as np
from scipy.integrate import quad

from .constants import c, hbar, kB, sigma
from .emission import absorption_coefficient
from .optics import surface_luminosity_sphere

AMU = 1.66053906660e-27          # kg, CODATA 2018
M_E = 9.1093837015e-31           # kg, electron mass, CODATA 2018
EV = 1.602176634e-19             # J (exact)
BOHR = 5.29177210903e-11         # m, CODATA 2018
ANGSTROM = 1e-10
GPA = 1e9
PER_CM = 2.0 * math.pi * c * 100.0   # rad/s per cm^-1
THZ = 2.0 * math.pi * 1e12           # rad/s per THz
ZETA3 = 1.2020569031595942
PLACEHOLDER = 1e-3               # Pa s, the paper's placeholder friction
ROOM = 293.0                     # K
COUPLING_ALPHA = absorption_coefficient(1.0)   # alpha per unit Re eta: 16 pi G / c^3, 1/(m Pa s)

# Standard atomic weights (IUPAC), in u.
MASS = {"C": 12.011, "Si": 28.085, "Fe": 55.845, "Cu": 63.546}


# --- the mechanisms ------------------------------------------------------------------------------------------------

def fermi_velocity(n_e: float) -> float:
    """Free-electron Fermi velocity hbar (3 pi^2 n)^(1/3) / m (m/s)."""
    return hbar * (3.0 * math.pi**2 * n_e) ** (1.0 / 3.0) / M_E


def electron_weight(n_e: float) -> float:
    """n m v_F^2 / 5 = 2 n E_F / 5: the electrons' share of G_inf - G_0 (Pa)."""
    return n_e * M_E * fermi_velocity(n_e) ** 2 / 5.0


def drude(omega, n_e: float, tau: float):
    """Re eta of free electrons with collision time tau (Pa s)."""
    omega = np.asarray(omega, dtype=float)
    return electron_weight(n_e) * tau / (1.0 + (omega * tau) ** 2)


def drude_bound(omega, n_e: float):
    """The largest Re eta free electrons can give at omega, whatever their collision time: weight / (2 omega)."""
    omega = np.asarray(omega, dtype=float)
    return electron_weight(n_e) / (2.0 * omega)


def lorentz_line(omega, weight: float, omega0: float, width: float):
    """A driven, damped mode of relaxing stiffness `weight` (Pa), centre omega0 and full width `width` (rad/s).

    -Im of weight w0^2 / (w0^2 - w^2 - i width w), over w: the damped oscillator, causal, with the sum rule exact.
    Its far wings (a constant weight width / w0^2 below the line) are not a model of anything; they hold little.
    """
    omega = np.asarray(omega, dtype=float)
    return weight * omega0**2 * width / ((omega0**2 - omega**2) ** 2 + (width * omega) ** 2)


def maxwell(omega, eta0: float, tau: float):
    """Maxwell's model, Eq. maxwell: eta0 / (1 + omega^2 tau^2); relaxing stiffness eta0 / tau."""
    omega = np.asarray(omega, dtype=float)
    return eta0 / (1.0 + (omega * tau) ** 2)


def internal_strain_softening(mass: float, omega_to: float, zeta: float, a0: float) -> float:
    """C44(clamped ions) - C44 = M w0^2 zeta^2 / (8 a0) for a diamond-structure crystal of atoms of mass M (Pa)."""
    return mass * omega_to**2 * zeta**2 / (8.0 * a0)


def flat_band(omega, weight: float, omega_max: float):
    """Relaxing stiffness `weight` spread evenly over 0 < omega < omega_max (Pa s)."""
    omega = np.asarray(omega, dtype=float)
    return np.where(omega < omega_max, 0.5 * math.pi * weight / omega_max, 0.0)


def phonon_pairs(omega, temperature: float, n: float, omega_D: float, coupling2: float = 2.0 / 3.0):
    """Pairs of thermal phonons in a Debye solid with one sound speed (Pa s); zero above 2 omega_D."""
    omega = np.asarray(omega, dtype=float)
    x = hbar * omega / (4.0 * kB * temperature)
    out = 9.0 * math.pi / 64.0 * coupling2 * n * hbar * omega**3 / omega_D**3 / np.tanh(np.maximum(x, 1e-300))
    return np.where(omega < 2.0 * omega_D, out, 0.0)


def akhiezer(omega, temperature: float, heat_capacity: float, gamma2: float, tau: float):
    """Relaxation of the thermal phonon gas: C_v T gamma^2 tau / (1 + omega^2 tau^2) (Pa s); C_v per volume."""
    omega = np.asarray(omega, dtype=float)
    return heat_capacity * temperature * gamma2 * tau / (1.0 + (omega * tau) ** 2)


def debye_heat_capacity(temperature: float, n: float, theta: float) -> float:
    """Debye heat capacity per volume, 9 n k (T/theta)^3 int_0^{theta/T} x^4 e^x / (e^x - 1)^2 dx (J m^-3 K^-1)."""
    top = theta / temperature
    integral, _ = quad(lambda x: x**4 * math.exp(-x) / (-math.expm1(-x)) ** 2, 0.0, top)
    return 9.0 * n * kB * (temperature / theta) ** 3 * integral


# --- water (Schulz, Schlaich, Heyden, Netz & Kappler 2020, Table III; frequencies f = 1 / (2 pi tau)) --------------

WATER_MAXWELL = (                 # (eta0 Pa s, f THz): hydrogen-bond network topology changes; librations
    (0.568e-3, 0.19),
    (0.052e-3, 28.92),
)
WATER_INERTIA = (                 # (eta0 Pa s, f_m THz, f_0 THz): O-O-O vibrations; O-O (hydrogen-bond stretch)
    (0.019e-3, 2.68, 1.27),
    (0.053e-3, 4.03, 7.83),
)


def shear_inertia(omega, eta0: float, tau_m: float, tau_0: float):
    """Re of Schulz et al.'s Eq. (16): eta0 / ((1 - w^2 tau0^2)^2 + (w tau0^2 / tau_m)^2), a Lorentz line."""
    omega = np.asarray(omega, dtype=float)
    return eta0 / ((1.0 - (omega * tau_0) ** 2) ** 2 + (omega * tau_0**2 / tau_m) ** 2)


def water(omega):
    """Re eta of TIP4P/2005 water at zero wavenumber, Schulz et al. (2020), Eq. (18) (Pa s)."""
    omega = np.asarray(omega, dtype=float)
    total = np.zeros_like(omega)
    for eta0, f in WATER_MAXWELL:
        total = total + maxwell(omega, eta0, 1.0 / (f * THZ))
    for eta0, f_m, f_0 in WATER_INERTIA:
        total = total + shear_inertia(omega, eta0, 1.0 / (f_m * THZ), 1.0 / (f_0 * THZ))
    return total


def water_weight() -> float:
    """Sum rule total of the water model: sum of eta0 / tau (Maxwell) and eta0 tau_m / tau_0^2 (inertia) (Pa)."""
    total = sum(eta0 * f * THZ for eta0, f in WATER_MAXWELL)
    total += sum(eta0 * (f_0 * THZ) ** 2 / (f_m * THZ) for eta0, f_m, f_0 in WATER_INERTIA)
    return total


# --- elastic data -> densities, sound speeds, Debye temperatures ---------------------------------------------------

def cubic_hill(c11: float, c12: float, c44: float) -> tuple[float, float]:
    """Voigt-Reuss-Hill bulk and shear moduli of a cubic crystal (Pa)."""
    bulk = (c11 + 2.0 * c12) / 3.0
    shear_v = (c11 - c12 + 3.0 * c44) / 5.0
    shear_r = 5.0 * (c11 - c12) * c44 / (4.0 * c44 + 3.0 * (c11 - c12))
    return bulk, 0.5 * (shear_v + shear_r)


def debye_frequency(n: float, c_shear: float, c_long: float) -> float:
    """omega_D = v_D (6 pi^2 n)^(1/3), with 3 / v_D^3 = 1 / c_L^3 + 2 / c_T^3."""
    v_debye = (3.0 / (1.0 / c_long**3 + 2.0 / c_shear**3)) ** (1.0 / 3.0)
    return v_debye * (6.0 * math.pi**2 * n) ** (1.0 / 3.0)


def debye_omega(theta: float) -> float:
    return kB * theta / hbar


# --- the materials -------------------------------------------------------------------------------------------------

@dataclass(frozen=True)
class Term:
    label: str
    re_eta: Callable[[np.ndarray, float], np.ndarray]   # (omega, T) -> Pa s
    weight: float | None = None                          # its share of G_inf - G_0 (Pa), where temperature-free
    lines: tuple[tuple[float, float], ...] = ()          # (centre, width) of narrow features, for the quadrature
    edges: tuple[float, ...] = ()                        # where it jumps


@dataclass(frozen=True)
class Material:
    name: str
    terms: tuple[Term, ...]
    density: float | None = None       # for the surface glow, Eq. surface-glow; None for a liquid (no shear waves)
    c_shear: float | None = None
    c_long: float | None = None
    bound: bool = False                # True if the dominant term is an upper bound
    sources: str = ""

    def re_eta(self, omega, temperature: float = ROOM):
        omega = np.asarray(omega, dtype=float)
        return sum((t.re_eta(omega, temperature) for t in self.terms), np.zeros_like(omega))

    def term(self, label: str) -> Term:
        return next(t for t in self.terms if t.label == label)


def _electrons(n_e: float, tau: float | None) -> Term:
    if tau is None:
        return Term("electrons", lambda w, T: drude_bound(w, n_e))     # a bound at each frequency, not a spectrum
    return Term("electrons", lambda w, T: drude(w, n_e, tau), electron_weight(n_e))


def _pairs(n: float, omega_D: float) -> Term:
    return Term("phonon pairs", lambda w, T: phonon_pairs(w, T, n, omega_D), None, edges=(2.0 * omega_D,))


def _raman(mass: float, omega0: float, width: float, zeta: float, a0: float) -> Term:
    weight = 0.6 * internal_strain_softening(mass, omega0, zeta, a0)    # 3 of the 5 shears, averaged over directions
    return Term("Raman line", lambda w, T: lorentz_line(w, weight, omega0, width), weight, lines=((omega0, width),))


def _diamond_structure(name, element, a0, c11, c12, c44, zeta, omega0, width, sources) -> Material:
    n = 8.0 / a0**3
    mass = MASS[element] * AMU
    rho = n * mass
    bulk, shear = cubic_hill(c11, c12, c44)
    c_t = math.sqrt(shear / rho)
    c_l = math.sqrt((bulk + 4.0 * shear / 3.0) / rho)
    omega_D = debye_frequency(n, c_t, c_l)
    return Material(name, (_raman(mass, omega0, width, zeta, a0), _pairs(n, omega_D)), rho, c_t, c_l, sources=sources)


# Copper. fcc, a = 3.61 A (measured, as listed by Lim et al. 2026, Table S1); one conduction electron per atom; collision
# time 2.5e-14 s at 295 K from the measured conductivity (Hirayama 2011); Debye temperature 343 K (Duthil 2014,
# Table A.1). The sound speeds for the surface glow are Debye's, with c_L = 2 c_T assumed.
CU_A = 3.61 * ANGSTROM
CU_N = 4.0 / CU_A**3
CU_TAU = 2.5e-14
CU_THETA = 343.0
# The optical Drude fit of copper (West et al. 2010, Table 1): hbar omega_p = 8.7 eV, hbar Gamma = 0.07 eV.
CU_OPTICAL = dict(hbar_omega_p=8.7, hbar_gamma=0.07)

# Iron. bcc, 79.6 bohr^3 per atom at ambient pressure (Sha & Cohen 2010); two conduction electrons per atom, a free-
# electron convention, with the bound in place of an unknown collision time; Debye temperature 470 K of AISI 304 steel
# (Duthil 2014, Table A.1); density and sound speeds for the surface glow are the paper's steel (Section VI).
FE_N = 1.0 / (79.6 * BOHR**3)
FE_THETA = 470.0
STEEL = dict(density=7800.0, c_shear=3200.0, c_long=5900.0)

# Silicon and diamond: measured lattice constants, elastic constants and Kleinman parameters as compiled by Tanner
# et al. (2021), Table I; the Raman line of silicon at 520 cm^-1 with width about 3 cm^-1 (Camassel, Falkovsky &
# Planes 2000); diamond's at 1332.7 cm^-1 (Tanner et al.) with a dephasing time of 6.8 ps (Stoikos & Granados 2022),
# a full width 2 / T2.
SI = dict(a0=5.426 * ANGSTROM, c11=167.5 * GPA, c12=64.9 * GPA, c44=80.2 * GPA, zeta=0.54,
          omega0=520.0 * PER_CM, width=3.0 * PER_CM)
DIAMOND = dict(a0=3.567 * ANGSTROM, c11=1081.0 * GPA, c12=125.0 * GPA, c44=579.0 * GPA, zeta=0.125,
               omega0=1332.7 * PER_CM, width=2.0 / 6.8e-12)

# Silica glass: the BKS model of Leonforte et al. (2006): density 2370 kg/m^3, lambda = 34.4 GPa, mu = 37.2 GPa,
# c_T = 3961.4 m/s, c_L = 6774.5 m/s; relaxing to the nearest minimum after an affine strain "releases about half of
# the elastic energy", taken here to hold for shear too (dG = mu); harmonic THz dissipation from the main vibrational
# band, which ends at 27 THz (Damart, Tanguy & Rodney 2017).
SILICA = dict(density=2370.0, mu=37.2 * GPA, c_shear=3961.4, c_long=6774.5, omega_max=27.0 * THZ)


def table() -> dict[str, Material]:
    """The materials of the paper's table, keyed by a short id."""
    cu = Material(
        "copper",
        (_electrons(CU_N, CU_TAU), _pairs(CU_N, debye_omega(CU_THETA))),
        CU_N * MASS["Cu"] * AMU, *_debye_speeds(CU_N, CU_THETA),
        sources="Lim et al. 2026; Hirayama 2011; Duthil 2014",
    )
    fe = Material(
        "iron",
        (_electrons(2.0 * FE_N, None), _pairs(FE_N, debye_omega(FE_THETA))),
        STEEL["density"], STEEL["c_shear"], STEEL["c_long"], bound=True,
        sources="Sha & Cohen 2010; Duthil 2014",
    )
    si = _diamond_structure("silicon", "Si", **SI, sources="Tanner et al. 2021; Camassel et al. 2000")
    di = _diamond_structure("diamond", "C", **DIAMOND, sources="Tanner et al. 2021; Stoikos & Granados 2022")
    glass = Material(
        "silica glass",
        (Term("non-affine band", lambda w, T: flat_band(w, SILICA["mu"], SILICA["omega_max"]), SILICA["mu"],
              edges=(SILICA["omega_max"],)),),
        SILICA["density"], SILICA["c_shear"], SILICA["c_long"],
        sources="Leonforte et al. 2006; Damart et al. 2017",
    )
    wat = Material(
        "water",
        (Term("network and vibrations", lambda w, T: water(w), water_weight(),
              lines=tuple((f0 * THZ, fm * THZ) for _, fm, f0 in WATER_INERTIA)),),
        sources="Schulz et al. 2020",
    )
    return {"copper": cu, "iron": fe, "silicon": si, "diamond": di, "silica": glass, "water": wat}


def copper_optical() -> Material:
    """Copper from its optical Drude fit instead: n from omega_p (with m* = m), tau = 1 / Gamma."""
    omega_p = CU_OPTICAL["hbar_omega_p"] * EV / hbar
    n_opt = omega_p**2 * M_E * 8.8541878128e-12 / (1.602176634e-19) ** 2
    tau = hbar / (CU_OPTICAL["hbar_gamma"] * EV)
    return Material("copper (optical Drude)", (_electrons(n_opt, tau), _pairs(CU_N, debye_omega(CU_THETA))))


def _debye_speeds(n: float, theta: float) -> tuple[float, float]:
    """c_T and c_L = 2 c_T that give the Debye temperature theta (m/s)."""
    v_debye = kB * theta / (hbar * (6.0 * math.pi**2 * n) ** (1.0 / 3.0))
    c_t = v_debye * ((1.0 / 8.0 + 2.0) / 3.0) ** (1.0 / 3.0)
    return c_t, 2.0 * c_t


def placeholder() -> Material:
    return Material("placeholder", (Term("flat", lambda w, T: np.full_like(np.asarray(w, dtype=float), PLACEHOLDER),
                                          None),))


# --- the glow ------------------------------------------------------------------------------------------------------

def planck(omega, temperature: float):
    """B_omega summed over both polarizations, as in the paper (W m^-2 sr^-1 per rad/s)."""
    omega = np.asarray(omega, dtype=float)
    x = hbar * omega / (kB * temperature)
    return hbar * omega**3 / (4.0 * math.pi**3 * c**2 * np.expm1(x))


def _segments(material: Material, temperature: float, top_x: float = 60.0) -> list[float]:
    top = top_x * kB * temperature / hbar
    cuts = {0.0, top}
    for t in material.terms:
        for centre, width in t.lines:
            for k in (-30.0, -3.0, 0.0, 3.0, 30.0):
                cuts.add(centre + k * width)
        cuts.update(t.edges)
    return sorted(x for x in cuts if 0.0 <= x <= top)


def _integrate(f, material: Material, temperature: float) -> float:
    pts = _segments(material, temperature)
    total = 0.0
    for a, b in zip(pts[:-1], pts[1:]):
        value, _ = quad(f, a, b, limit=400, epsabs=0.0, epsrel=1e-10)
        total += value
    return total


def spectral_emissivity(material: Material, omega, temperature: float = ROOM):
    """j_omega = alpha(omega) B_omega(T) (W m^-3 sr^-1 per rad/s)."""
    return COUPLING_ALPHA * material.re_eta(omega, temperature) * planck(omega, temperature)


def power_per_volume(material: Material, temperature: float = ROOM) -> float:
    """4 pi int j_omega d omega (W/m^3)."""
    f = lambda w: float(spectral_emissivity(material, w, temperature)) if w > 0 else 0.0
    return 4.0 * math.pi * _integrate(f, material, temperature)


def number_emissivity(material: Material, temperature: float = ROOM) -> float:
    """int j_omega / (hbar omega) d omega (gravitons s^-1 m^-3 sr^-1)."""
    f = lambda w: float(spectral_emissivity(material, w, temperature)) / (hbar * w) if w > 0 else 0.0
    return _integrate(f, material, temperature)


def placeholder_power(temperature: float = ROOM) -> float:
    """4 pi alpha sigma T^4 / pi for the flat placeholder friction (W/m^3)."""
    return 4.0 * absorption_coefficient(PLACEHOLDER) * sigma * temperature**4


def effective_friction(material: Material, temperature: float = ROOM) -> float:
    """The flat friction that would give the same power (Pa s)."""
    return PLACEHOLDER * power_per_volume(material, temperature) / placeholder_power(temperature)


def surface_power_per_area(material: Material, temperature: float = ROOM) -> float:
    """The glow of Eq. surface-glow per unit area of a lossless elastic body (W/m^2)."""
    return surface_luminosity_sphere(1.0, material.density, material.c_shear, material.c_long, temperature) / (4 * math.pi)


def crossover_radius(material: Material, temperature: float = ROOM) -> float:
    """Radius of the sphere whose volume glow equals its surface glow, 3 (L_S / area) / (L_V / volume) (m)."""
    return 3.0 * surface_power_per_area(material, temperature) / power_per_volume(material, temperature)


def bound_power(n_e: float, temperature: float) -> float:
    """Closed form of 4 pi int alpha B dw for Re eta = weight / (2 w): 4 pi a (w/2) 2 zeta(3) (kT)^3 / (4 pi^3 c^2 hbar^2)."""
    return (4.0 * math.pi * COUPLING_ALPHA * electron_weight(n_e) / 2.0 * 2.0 * ZETA3 * (kB * temperature) ** 3
            / (4.0 * math.pi**3 * c**2 * hbar**2))


@dataclass
class Row:
    name: str
    eta_eff: float          # Pa s
    power: float            # W/m^3
    number: float           # gravitons s^-1 m^-3 sr^-1
    mean_energy_kT: float   # mean graviton energy in units of kT
    shares: dict = field(default_factory=dict)   # power share of each term
    crossover: float | None = None               # m


def summary(temperature: float = ROOM) -> list[Row]:
    rows = []
    for key, m in {**table(), "placeholder": placeholder()}.items():
        p = power_per_volume(m, temperature)
        jn = number_emissivity(m, temperature)
        shares = {t.label: power_per_volume(Material("", (t,)), temperature) / p for t in m.terms} if p > 0 else {}
        rows.append(Row(
            m.name, effective_friction(m, temperature), p, jn, p / (4 * math.pi * jn * kB * temperature), shares,
            crossover_radius(m, temperature) if m.c_shear else None,
        ))
    return rows


if __name__ == "__main__":
    for r in summary():
        cross = f"{r.crossover:.2e} m" if r.crossover else "-"
        shares = ", ".join(f"{k} {v:.2f}" for k, v in r.shares.items())
        print(f"{r.name:24s} eta_eff {r.eta_eff:.2e} Pa s  P/V {r.power:.2e} W/m^3  j_N {r.number:.2e}  "
              f"<E>/kT {r.mean_energy_kT:.2f}  R* {cross}  [{shares}]")
