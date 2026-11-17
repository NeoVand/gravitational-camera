"""A black hole against the primordial graviton background, mode by mode (paper, Section XI).

Each mode of angular degree l and frequency omega that reaches the hole is absorbed with probability Gamma_l(omega)
(its greybody factor) and otherwise scattered back out; the hole adds Hawking's emission in the same proportion.
So the occupation a camera receives from the hole in that mode, against the background's n_bg, differs by

    dN = Gamma_l(omega) [n_H(omega) - n_bg(omega)],

zero at equal temperatures (detailed balance), negative (a shadow) for a hole colder than the sky. For a spinning
hole n_H is evaluated at omega - m Omega_H and Gamma_lm < 0 in the superradiant modes, omega < m Omega_H, where dN
becomes positive whatever the temperatures: there the hole is brighter than the sky.

Gamma_l for spin-2 waves on Schwarzschild, from the Regge-Wheeler equation (G = c = M = 1):
    d^2 psi / dr*^2 + [omega^2 - V] psi = 0,  V = (1 - 2/r) [l(l+1) / r^2 - 6 / r^3],
integrated from just outside the horizon, psi = e^{-i omega r*}, to far away, and split there into waves going in
and out; Gamma = 1 / |A_in|^2, with |A_in|^2 - |A_out|^2 = 1 by conservation of flux.
"""
from __future__ import annotations

import math
from functools import lru_cache

import numpy as np
from scipy.integrate import solve_ivp
from scipy.special import spherical_jn, spherical_yn


def _rstar(r):
    return r + 2.0 * np.log(r / 2.0 - 1.0)


def _riccati(l: int, z: float):
    """z h_l^(1)(z) and its derivative: an outgoing wave in the centrifugal barrier alone."""
    j, y = spherical_jn(l, z), spherical_yn(l, z)
    jd, yd = spherical_jn(l, z, derivative=True), spherical_yn(l, z, derivative=True)
    h, hd = j + 1j * y, jd + 1j * yd
    return z * h, h + z * hd


def transmission(l: int, omega: float, start: float = 1e-5, reach: float = 300.0, far: float = 600.0) -> tuple[float, float]:
    """Gamma_l(omega) for M omega = omega, and the flux check |A_in|^2 - |A_out|^2 (should be 1)."""
    r0 = 2.0 + start
    r1 = max(reach / omega, far)
    f0 = 1.0 - 2.0 / r0
    psi0 = np.exp(-1j * omega * _rstar(r0))
    y0 = np.array([psi0.real, psi0.imag, (-1j * omega * psi0 / f0).real, (-1j * omega * psi0 / f0).imag])

    def rhs(r, y):
        f = 1.0 - 2.0 / r
        V = f * (l * (l + 1) / r**2 - 6.0 / r**3)
        psi = y[0] + 1j * y[1]
        dpsi = y[2] + 1j * y[3]
        # f (f psi')' + (omega^2 - V) psi = 0  ->  psi'' = -(2 / r^2) psi' / f - (omega^2 - V) psi / f^2
        d2 = -(2.0 / r**2) * dpsi / f - (omega**2 - V) * psi / f**2
        return [dpsi.real, dpsi.imag, d2.real, d2.imag]

    sol = solve_ivp(rhs, (r0, r1), y0, method="DOP853", rtol=1e-10, atol=1e-12)
    psi = sol.y[0, -1] + 1j * sol.y[1, -1]
    dpsi = sol.y[2, -1] + 1j * sol.y[3, -1]
    # far away: psi = A_out u + A_in conj(u), u = (omega r) h_l^(1)(omega r) e^{2 i omega ln(r/2 - 1)} (the log of r*)
    z = omega * r1
    u, ud = _riccati(l, z)
    phase = np.exp(2j * omega * math.log(r1 / 2.0 - 1.0))
    U = u * phase
    dU = (omega * ud + u * 2j * omega / (r1 - 2.0)) * phase
    Ub, dUb = np.conj(U), np.conj(dU)
    wr = U * dUb - dU * Ub  # Wronskian of the two
    a_in = (U * dpsi - dU * psi) / wr
    a_out = (psi * dUb - dpsi * Ub) / wr
    return 1.0 / abs(a_in) ** 2, abs(a_in) ** 2 - abs(a_out) ** 2


def cross_section(omega: float) -> float:
    """Absorption cross-section sigma(omega) = (pi / omega^2) sum_l (2l + 1) Gamma_l, in units of M^2; the sum stops
    once past the barrier (l > 3 sqrt3 omega) the terms fall below 1e-7 of it."""
    total, l = 0.0, 2
    while True:
        term = (2 * l + 1) * transmission(l, omega)[0]
        total += term
        if (l > 3 * math.sqrt(3) * omega and term < 1e-7 * total) or (l >= 4 and term < 1e-9 * total):
            break
        l += 1
    return math.pi / omega**2 * total


TABLE = __import__("pathlib").Path(__file__).resolve().parents[1] / "fixtures" / "bh_cross_section.json"


def build_table(n: int = 48) -> dict:
    """sigma(x) / M^2 for spin-2 waves on Schwarzschild, x = M omega from 0.02 to 5 (several minutes)."""
    x = np.geomspace(0.02, 5.0, n)
    return {"x": x.tolist(), "sigma": [cross_section(v) for v in x]}


@lru_cache(maxsize=1)
def _table():
    import json

    data = json.loads(TABLE.read_text())
    return np.array(data["x"]), np.array(data["sigma"])


def main() -> None:
    import json

    TABLE.write_text(json.dumps(build_table(), indent=1) + "\n")


if __name__ == "__main__":
    main()


def _occupation(z):
    z = np.asarray(z, dtype=float)
    return 1.0 / np.expm1(np.clip(z, 1e-12, 700.0))


def shadow_depth(temperature_ratio: float, points: int = 4000) -> float:
    """How dark the hole is against the background, over a black disc of the geometric cross-section 27 pi M^2:

        D = ∫ sigma(x) [n_bg - n_H] x^3 dx / (27 pi ∫ n_bg x^3 dx),  x = G M omega / c^3,

    with n_bg = n(8 pi x T_H / T_bg) and n_H = n(8 pi x). One for a cold heavy hole, zero at T_H = T_bg, negative
    (a glow) for a hotter one. Above the table's top, sigma is its geometric value."""
    tau = temperature_ratio
    xt, st = _table()
    x = np.geomspace(1e-3, 60.0 / (8 * math.pi * min(tau, 1.0)) + 6.0, points)
    sigma = np.where(x <= xt[-1], np.interp(np.log(x), np.log(xt), st, left=0.0), 27 * math.pi)
    sigma = np.where(x < xt[0], st[0] * (x / xt[0]) ** 4, sigma)  # sigma ~ omega^4 for long waves (Gamma_2 ~ omega^6)
    nbg = _occupation(8 * math.pi * x * tau)
    nh = _occupation(8 * math.pi * x)
    top = np.trapezoid(sigma * (nbg - nh) * x**3, x)
    bottom = 27 * math.pi * np.trapezoid(nbg * x**3, x)
    return float(top / bottom)
