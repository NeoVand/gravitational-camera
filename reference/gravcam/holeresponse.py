"""A black hole as a body that answers a tide (design/SYNTHESIS.md, Section 2.2): its sum rule, its dispersive Love
number and its response at imaginary frequencies, from the quadrupole greybody factor of bhmodes.py.

The response. A hole that does not spin absorbs a quadrupole wave of frequency omega with the probability
Gamma_2(omega). Read as the friction of its quadrupole against a tide, that is

    Im chi(omega) = 5 c^5 Gamma_2(omega) / (16 G omega^5),

for the quadrupole that couples to a tide without a half (hair.py), whose Love number is k_2 = 3 G chi / R^5: a
uniform fluid ball has 0.75. With x = G M omega / c^3, Gamma_2 -> (256/225) x^6 for long waves (Page 1976), and
Im chi -> nu omega with nu = (16/45) G^5 M^6 / c^13, the friction of the horizon (Poisson 2004). Beyond omega of
the order of c / r_s the definition is a convention, there being no near zone.

The sum rule. For an ordinary round body (2/pi) int omega Im chi d omega = (1/3) int rho r^2 dV, half its moment of
inertia. For the hole

    (2/pi) int_0^inf omega Im chi d omega = (5 / 32 pi) I_2 M r_s^2,        I_2 = int_0^inf Gamma_2 x^-4 dx = 6.938,

which is 0.345 M r_s^2 = (1/3) M <r^2> with sqrt <r^2> = 1.017 r_s: the inertia of a thin shell at the horizon, to
a few per cent.

Dispersion. Were the hole's static response given by the unsubtracted relation of Kramers and Kronig, chi(0) =
(2/pi) int Im chi d omega / omega, its Love number would be

    k_2 = (15 / 256 pi) J_2 = 0.674,        J_2 = int_0^inf Gamma_2 x^-6 dx = 36.13.

The true value is zero: the hole carries a contact term that cancels its own dispersive response at zero frequency.
The root mean square frequency of the response, sqrt(I_2 / J_2) = 0.438 c^3 / G M, lies above the fundamental
quasi-normal mode at 0.374: one mode does not exhaust the sum rule (the square of the ratio is 0.73).

Imaginary frequencies. A passive body with a finite sum rule has chi(i xi) = (2/pi) int omega Im chi / (omega^2 +
xi^2) d omega > 0 for every xi. For the hole, with y = G M xi / c^3 and the true static value,

    k_2(i y) = disp(y) - disp(0) = -(15 / 256 pi) y^2 int_0^inf Gamma_2 x^-6 / (x^2 + y^2) dx,
    disp(y)  = (15 / 256 pi) int_0^inf Gamma_2 x^-4 / (x^2 + y^2) dx,

which is negative for every y. It leaves zero with the slope -1/30, which is the friction alone (at y = 0.005 the
curve is already nearly twice as steep), passes -0.147 at y = 0.2 and tends to -0.674.

How it is computed. Gamma_2 is taken once on 41 frequencies equally spaced in ln x from x = 0.03 to x = 1 and kept
(under a second); below them Page's law stands in, and above them Gamma_2 = 1, from which the true value differs by
less than 1e-7 at x = 1. The integrals are by Simpson's rule in ln x. Against the finer grids of the checks in
design/checks (321 and 241 frequencies from 0.02 to 4, half a minute each) the numbers above move by about one part
in 10^4: the two integrals are 6.9389 and 36.136 here, 6.9381 and 36.130 there.

Tested in tests/test_holeresponse.py.
"""
from __future__ import annotations

import math
from functools import lru_cache

import numpy as np
from scipy.integrate import quad, simpson

from .bhmodes import transmission
from .constants import G, c

PAGE = 256.0 / 225.0
"""Gamma_2 -> PAGE x^6 for long waves, x = G M omega / c^3 (Page 1976)."""

LOVE_SCALE = 15.0 / (256.0 * math.pi)
"""k_2 = 3 G chi / r_s^5 per unit of int Gamma_2 x^-6 dx."""


@lru_cache(maxsize=4)
def greybody_grid(x_low: float = 0.03, x_high: float = 1.0, n: int = 41) -> tuple[np.ndarray, np.ndarray]:
    """(x, Gamma_2(x)) on n frequencies x = G M omega / c^3 equally spaced in ln x, computed once and kept. The wave
    is followed out to r = 60 / omega (bhmodes.transmission with reach = 60, far = 120), a fifth of the default,
    which changes Gamma_2 by about one part in 10^5: near x = 1 the grid's values exceed one by a few parts in
    10^6."""
    xs = np.geomspace(x_low, x_high, n)
    gamma = np.array([transmission(2, float(x), reach=60.0, far=120.0)[0] for x in xs])
    xs.setflags(write=False)
    gamma.setflags(write=False)
    return xs, gamma


def greybody_moment(p: float) -> float:
    """int_0^inf Gamma_2 x^-p dx for 1 < p < 7: Simpson's rule in ln x over the grid, Page's law below it and
    Gamma_2 = 1 above."""
    xs, gamma = greybody_grid()
    low = PAGE * xs[0] ** (7 - p) / (7 - p)
    high = xs[-1] ** (1 - p) / (p - 1)
    return float(low + simpson(gamma * xs ** (1 - p), x=np.log(xs)) + high)


def sum_rule() -> float:
    """(2/pi) int omega Im chi d omega in units of M r_s^2: (5 / 32 pi) int Gamma_2 x^-4 dx, which is 0.345."""
    return 5.0 / (32.0 * math.pi) * greybody_moment(4)


def shell_radius() -> float:
    """Radius, in units of r_s, of the thin shell of the hole's mass that has the same sum rule, (1/3) M a^2:
    1.017."""
    return math.sqrt(3.0 * sum_rule())


def mean_frequency() -> float:
    """Root mean square frequency of the response in units of c^3 / G M: sqrt(I_2 / J_2), the sum rule over the
    dispersive static response. It is 0.438; the fundamental quasi-normal mode is at 0.374."""
    return math.sqrt(greybody_moment(4) / greybody_moment(6))


def dispersive_love_number(y: float = 0.0) -> float:
    """disp(y) = (15 / 256 pi) int_0^inf Gamma_2 x^-4 / (x^2 + y^2) dx: the Love number that the unsubtracted
    dispersion relation would give at the imaginary frequency xi = y c^3 / G M. At y = 0 it is 0.674, on the scale
    where a uniform fluid ball has 0.75, and the hole's true value is zero."""
    xs, gamma = greybody_grid()
    low = PAGE * (xs[0] - y * math.atan(xs[0] / y)) if y > 0 else PAGE * xs[0]
    middle = simpson(gamma * xs**-3 / (xs**2 + y * y), x=np.log(xs))
    high = quad(lambda x: x**-4 / (x * x + y * y), xs[-1], math.inf)[0]
    return float(LOVE_SCALE * (low + middle + high))


def love_number_at_imaginary_frequency(y: float) -> float:
    """k_2(i y) = disp(y) - disp(0) of the hole, as the one integral -(15 / 256 pi) y^2 int_0^inf Gamma_2 x^-6 /
    (x^2 + y^2) dx: negative for every y > 0, -y / 30 for small y, and -0.674 for large."""
    if y == 0:
        return 0.0
    xs, gamma = greybody_grid()
    low = PAGE * y * math.atan(xs[0] / y)                                 # y^2 int_0 dx / (x^2 + y^2)
    middle = y * y * simpson(gamma * xs**-5 / (xs**2 + y * y), x=np.log(xs))
    high = quad(lambda x: x**-6 / ((x / y) ** 2 + 1), xs[-1], math.inf)[0]
    return float(-LOVE_SCALE * (low + middle + high))


FRICTION_SLOPE = -1.0 / 30.0
"""d k_2(i y) / dy at y = 0: the horizon's friction alone, Im chi = nu omega."""


# --- in SI units ----------------------------------------------------------------------------------------------------


def im_chi(M: float, omega: float) -> float:
    """Im chi(omega) = 5 c^5 Gamma_2 / (16 G omega^5) of a hole of mass M (kg), in kg m^2 s^2: the friction of its
    quadrupole against a tide of frequency omega (rad/s). For long waves it is nu omega, nu = (16/45) G^5 M^6 /
    c^13 (hair.horizon_friction)."""
    return 5 * c**5 * transmission(2, G * M * omega / c**3)[0] / (16 * G * omega**5)


def sum_rule_si(M: float) -> float:
    """(2/pi) int omega Im chi d omega for a hole of mass M, in kg m^2: 0.345 M r_s^2."""
    return sum_rule() * M * (2 * G * M / c**2) ** 2
