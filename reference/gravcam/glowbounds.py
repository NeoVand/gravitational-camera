"""How bright any material can glow, the polarization of a crystal's glow, and the colour of the Earth's
(paper, Section VI, "How bright can matter glow?", and Section IX).

The friction against a uniform shear is positive and its integral is fixed (Eq. friction-sum):
    (2 / pi) int_0^inf Re eta(w) dw = G_inf - G_0 = dmu.
Emission per volume is 4 pi int alpha B_w dw with alpha = 16 pi G Re eta / c^3, a positive weight times the Planck
radiance. Placing all the weight where B_w (or B_w / hbar w) peaks gives the most that weight can emit:
    P / V <= 8 G dmu (kT)^3 / (hbar^2 c^5) max x^3/(e^x - 1) = 11.37 G dmu (kT)^3 / (hbar^2 c^5),
    N / V <= 8 G dmu (kT)^2 / (hbar^2 c^5) max x^2/(e^x - 1) =  5.18 G dmu (kT)^2 / (hbar^2 c^5),
and the optical depth of a length L, integrated over frequency, is 8 pi^2 G L dmu / c^3.
"""
from __future__ import annotations

import math

import numpy as np
from scipy.optimize import brentq

from .constants import G, c, hbar, kB, sigma
from . import materials as M

THZ = M.THZ


def _peak(power: int) -> tuple[float, float]:
    """x where x^p / (e^x - 1) is largest (x = p (1 - e^-x)), and that largest value."""
    x = brentq(lambda x: x - power * (1 - math.exp(-x)), 0.5, 10.0, xtol=1e-15)
    return x, x**power / math.expm1(x)


X3, PEAK3 = _peak(3)
X2, PEAK2 = _peak(2)


def power_bound(delta_mu: float, temperature: float) -> float:
    """The most power per volume (W/m^3) a relaxing shear stiffness delta_mu (Pa) can radiate at temperature T."""
    return 8 * G * delta_mu * (kB * temperature) ** 3 / (hbar**2 * c**5) * PEAK3


def count_bound(delta_mu: float, temperature: float) -> float:
    """The most gravitons per second per volume (all directions) it can radiate."""
    return 8 * G * delta_mu * (kB * temperature) ** 2 / (hbar**2 * c**5) * PEAK2


def optical_depth_integral(length: float, delta_mu: float) -> float:
    """int tau(w) dw over all w for a path of the given length (s^-1): no material is opaque over a broad band."""
    return 8 * math.pi**2 * G * length * delta_mu / c**3


def weight(material: M.Material, temperature: float = M.ROOM) -> float:
    """(2 / pi) int Re eta dw: the material's relaxing stiffness as modelled (Pa)."""
    f = lambda w: float(material.re_eta(w, temperature))
    return 2 / math.pi * M._integrate(f, material, temperature)


def how_close(material: M.Material, temperature: float = M.ROOM) -> dict:
    """The material's glow against the most its own weight could give."""
    dmu = weight(material, temperature)
    P = M.power_per_volume(material, temperature)
    N = 4 * math.pi * M.number_emissivity(material, temperature)
    return {"weight": dmu, "power": P, "power_fraction": P / power_bound(dmu, temperature),
            "count_fraction": N / count_bound(dmu, temperature)}


def placeholder_counts(temperature: float, eta: float = M.PLACEHOLDER) -> float:
    """Gravitons per second per volume (all directions) for a flat friction eta: 4 pi * 16 G eta sigma T^3 /
    (2.70 kB c^3)... computed exactly as 4 pi int alpha B_w / hbar w dw."""
    return 4 * math.pi * M.number_emissivity(M.Material("flat", (M.Term("flat", lambda w, T: np.full_like(
        np.asarray(w, dtype=float), eta)),)), temperature)


def least_weight_for_placeholder(temperature: float, eta: float = M.PLACEHOLDER) -> tuple[float, float]:
    """The relaxing stiffness any material would need to match the flat friction's power, and its count (Pa)."""
    P = 4.0 * M.absorption_coefficient(eta) * sigma * temperature**4
    return P / power_bound(1.0, temperature), placeholder_counts(temperature, eta) / count_bound(1.0, temperature)


# --- the polarization of a crystal's glow --------------------------------------------------------------------------

def transverse_basis(n):
    """Orthonormal transverse trace-free tensors e+, ex for a wave along n."""
    n = np.asarray(n, dtype=float) / np.linalg.norm(n)
    a = np.array([1.0, 0, 0]) if abs(n[0]) < 0.9 else np.array([0, 1.0, 0])
    p = np.cross(n, a)
    p /= np.linalg.norm(p)
    q = np.cross(n, p)
    ep = (np.outer(p, p) - np.outer(q, q)) / math.sqrt(2)
    ex = (np.outer(p, q) + np.outer(q, p)) / math.sqrt(2)
    return ep, ex


OFF_DIAGONAL = [
    (np.outer(e1, e2) + np.outer(e2, e1)) / math.sqrt(2)
    for e1, e2 in ((np.eye(3)[0], np.eye(3)[1]), (np.eye(3)[1], np.eye(3)[2]), (np.eye(3)[2], np.eye(3)[0]))
]


def line_polarization(n) -> tuple[float, float]:
    """For a cubic crystal whose friction lies only in the three off-diagonal shears (the Raman line of silicon or
    diamond), the glow seen along n (crystal axes): its brightness relative to a view along a cube edge, and its
    degree of linear polarization."""
    basis = transverse_basis(n)
    Mab = np.array([[sum(np.sum(a * S) * np.sum(b * S) for S in OFF_DIAGONAL) for b in basis] for a in basis])
    lam = np.linalg.eigvalsh(Mab)
    return float(lam.sum()), float(abs(lam[1] - lam[0]) / lam.sum())


# --- the Earth: what the placeholder claims, what any material allows, and the colour step ------------------------

EARTH_SHELLS = {
    # name: (outer radius m, temperature K, a generous relaxing stiffness Pa: the shear modulus at the shell's base
    # (PREM), plus for the core the weight of two free electrons per atom)
    "crust": (6.371e6, 700.0, 44e9),
    "upper mantle": (6.346e6, 1700.0, 130e9),
    "lower mantle": (5.701e6, 2800.0, 293e9),
    "outer core": (3.480e6, 4500.0, 220e9),
    "inner core": (1.2215e6, 5500.0, 400e9),
}


def earth_bounded() -> dict:
    """For each shell, the gravitons per volume the placeholder gives and the most the generous stiffness allows."""
    out = {}
    for name, (_, T, dmu) in EARTH_SHELLS.items():
        ph = placeholder_counts(T)
        out[name] = {"placeholder": ph, "bound": count_bound(dmu, T), "ratio": min(1.0, count_bound(dmu, T) / ph)}
    return out


def mean_energy(material: M.Material, temperature: float) -> float:
    """Mean energy of the gravitons a material sends (J)."""
    f_E = lambda w: float(M.spectral_emissivity(material, w, temperature)) if w > 0 else 0.0
    f_N = lambda w: float(M.spectral_emissivity(material, w, temperature)) / (hbar * w) if w > 0 else 0.0
    return M._integrate(f_E, material, temperature) / M._integrate(f_N, material, temperature)


def mantle(top_thz: float, temperature: float = 2800.0, delta_mu: float = 293e9) -> M.Material:
    """An insulator whose friction is spread evenly over its vibrations, below top_thz (pairs reach twice the
    highest single phonon)."""
    w_max = top_thz * THZ
    return M.Material("mantle", (M.Term("band", lambda w, T: M.flat_band(w, delta_mu, w_max), delta_mu,
                                        edges=(w_max,)),))


def liquid_iron(resistivity: float = 1.0e-6, density: float = 11000.0, electrons_per_atom: float = 2.0) -> M.Material:
    """Free electrons of liquid iron at core conditions, Drude, with the collision time of the given resistivity."""
    n_e = electrons_per_atom * density / (M.MASS["Fe"] * M.AMU)
    tau = M.M_E / (n_e * 1.602176634e-19**2 * resistivity)
    return M.Material("core", (M.Term("electrons", lambda w, T: M.drude(w, n_e, tau), M.electron_weight(n_e)),))


def earth_lifetime(scale=None, years: float = 80.0) -> dict:
    """Gravitons from the Earth below on one square metre in a lifetime, and the forecast one-sigma errors of the
    five-shell fit (radii in m, emissivities as fractions), with each shell's emissivity multiplied by scale (a dict
    by shell name; None keeps the scene's own frictions, which are the bounds of earth_bounded: scenefriction.py)."""
    import pathlib
    from . import abel, emission
    from .scene import load_scene
    root = pathlib.Path(__file__).resolve().parents[2]
    scene = load_scene(root / "scenes" / "sun-at-midnight.scene.json")
    layers = ["inner-core", "outer-core", "lower-mantle", "upper-mantle", "earth"]
    names = ["inner core", "outer core", "lower mantle", "upper mantle", "crust"]
    radii = np.array([scene[k].shape.radius for k in layers])
    jN = emission.number_emissivities(scene)
    j = np.array([jN[scene.index(k)] for k in layers])
    if scale is not None:
        j = j * np.array([scale[n] for n in names])
    rho = float(np.linalg.norm(scene.observer))
    edges = np.radians(np.linspace(0.0, 90.0, 91))
    exposure = years * 3.15576e7
    mu = abel.expected_counts(radii, j, edges, exposure, rho)
    err = abel.forecast(radii, j, edges, exposure, rho)
    err = np.asarray(err[1] if isinstance(err, tuple) else err)
    return {"counts": float(mu.sum()), "errors": err, "radii": radii, "j": j}
