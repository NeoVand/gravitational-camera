"""Tables for the website's vista demos, from the reference implementation.

    python -m gravcam.export_vistas            # run from reference/

writes ``reference/fixtures/vistas.json``:

``pair``: the changing part of the tidal field of an orbiting pair, E_zz in the
plane of the orbit, from the exact linearized solution (binary.py). By the
pair's symmetry it is E(r, phi, t) = A(r) cos(2 Omega t - 2 phi + delta(r)),
and at the order of the quadrupole A and delta depend on r only through
x = r / lambda. The table gives, against x, the strength x A(x) in units of its
value in the waves, and eta = delta + 2 pi x, which is smooth: delta itself
winds by 2 pi every wavelength.

``sweep``: the angle swept by rays near a black hole (schwarzschild.py), at a
few distances and viewing angles, against which the site's own calculation is
tested.

``primordial``: the temperature of the graviton background and the dipole of
our motion through it (primordial.py).

The values come from trigonometry and elliptic integrals, which are not
correctly rounded on every platform, so they are written to 9 significant
digits; tests/test_export_vistas.py checks the file against a fresh build.
"""
from __future__ import annotations

import json
import math
from pathlib import Path

import numpy as np

from . import binary, primordial, schwarzschild
from .constants import G, M_sun, c

OUT = Path(__file__).resolve().parents[1] / "fixtures" / "vistas.json"
DIGITS = 9
SWEEP_DISTANCES = (6.0, 15.0, 40.0, 150.0)


def _r(x: float) -> float:
    return float(f"{x:.{DIGITS}g}")


def pair_table(n: int = 240, x_min: float = 0.005, x_max: float = 20.0) -> dict:
    v = 0.1
    m = 30 * M_sun
    pair = binary.Pair.bound(m, G * 2 * m / (4 * v * v * c * c))
    lam = pair.wavelength
    x = np.geomspace(x_min, x_max, n)
    pts = np.stack([x * lam, np.zeros(n), np.zeros(n)], axis=-1)
    quarter = 0.25 * math.pi / pair.omega          # a quarter of a wave period
    zz = []
    for k in range(4):
        E, _ = binary.tidal(pair, k * quarter, pts)
        zz.append(E[:, 2, 2])
    wz = [pair.wave_tidal(k * quarter, pts)[:, 2, 2] for k in range(4)]
    a, b = 0.5 * (zz[0] - zz[2]), 0.5 * (zz[1] - zz[3])
    strength = np.hypot(a, b)
    wave = np.hypot(0.5 * (wz[0] - wz[2]), 0.5 * (wz[1] - wz[3]))
    # delta winds once a wavelength; delta + 2 pi x varies slowly, so unwrap that
    eta = np.unwrap(np.angle(np.exp(1j * (np.arctan2(-b, a) + 2 * math.pi * x))))
    # the waves' r A is the same at every radius: use it as the unit
    unit = float(np.median(x * wave))
    return {
        "x": [_r(v) for v in x],
        "strength": [_r(v) for v in x * strength / unit],
        "eta": [_r(v) for v in eta - eta[-1]],
    }


def sweep_samples() -> dict:
    psi = np.linspace(0.02, math.pi - 0.02, 37)
    rows = []
    for r in SWEEP_DISTANCES:
        dphi = schwarzschild.sweep(r, psi)
        rows.append({
            "r": r,
            "shadow": _r(schwarzschild.shadow_radius(r)),
            "psi": [_r(p) for p in psi],
            "dphi": [None if math.isnan(d) else _r(d) for d in dphi],
        })
    return {"rows": rows}


def primordial_block() -> dict:
    T = primordial.graviton_temperature()
    return {
        "temperature": _r(T),
        "beta": _r(primordial.DIPOLE_SPEED / c),
        "dipole": [_r(v) for v in primordial.dipole_direction()],
        "number_radiance": _r(primordial.number_radiance(T)),
    }


def build() -> dict:
    return {"pair": pair_table(), "sweep": sweep_samples(), "primordial": primordial_block()}


def main() -> int:
    OUT.write_text(json.dumps(build(), indent=1) + "\n", encoding="utf-8")
    print(f"wrote {OUT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
