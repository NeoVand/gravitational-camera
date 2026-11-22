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

Tides of any degree. A tide of degree l with profile h = r^l Y_lm (potential -eps h, energy -eps Q_h, Q_h = int rho
h dV) has, for an ordinary round body, the sum (2/pi) int omega Im chi_l d omega = int rho |grad h|^2 dV, which is

    (2/pi) int_0^inf omega Im chi_l d omega = [l (2l+1) / 4 pi] int rho r^(2l-2) dV

for each of the 2l+1 tides: the mean of |Y_lm|^2 over the sphere is 1 / 4 pi, the mean commutes with the
Laplacian, and |grad h|^2 = Lap(h^2) / 2 with Lap r^(2l) = 2l (2l+1) r^(2l-2). For the hole, the response follows
from Gamma_l as it does for l = 2, by the argument of a standing wave. A mass multipole I_L(t) = A_L cos(omega t)
(STF, degree l) radiates, by Thorne's formula (Thorne 1980, Rev. Mod. Phys. 52, 299, Eq. 4.16'),

    P = (G / c^(2l+1)) N_l <(d^(l+1) I_L / dt^(l+1))^2>,     N_l = (l+1)(l+2) / [(l-1) l l! (2l+1)!!].

Half the retarded field minus half the advanced one is regular at the source: a standing wave whose incoming half
carries P / 4. Near the source it is the potential of radiation reaction (Burke and Thorne at l = 2, Blanchet 1993
at any l), (G N_l / c^(2l+1)) x_L d^(2l+1) I_L / dt^(2l+1), whose work on the source is P: a tide of profile h = A_L
x_L and amplitude eps_0 = G N_l omega^(2l+1) / c^(2l+1). A body in it absorbs omega Im chi_h eps_0^2 / 2, and a hole
absorbs Gamma_l of what comes in, the same for every m and either parity. So

    Im chi_h = Gamma_l c^(2l+1) A_L A_L / (4 G N_l omega^(2l+1)),

which at l = 2, for the profile of the quadrupole above (A_ab = e_ab / 2, chi_h = chi e_ab e_ab), is the 5 c^5 Gamma_2
/ (16 G omega^5) of the start; and for h = r^l Y_lm, with A_L A_L = (2l+1)!! / (4 pi l!), Im chi_l = Gamma_l c^(2l+1)
[(2l+1)!!]^2 (l-1) l / [16 pi G (l+1)(l+2) omega^(2l+1)]. The shell of the hole's mass with the same sum has the radius

    (R_l c^2 / G M)^(2l-2) = { [(2l+1)!!]^2 (l-1) / [2 pi (2l+1) (l+1) (l+2)] } int_0^inf Gamma_l x^(-2l) dx,

15 / 8 pi at l = 2, where it is the shell above: R_l / r_s = 1.0175, 1.4555, 1.6100, 1.6868, 1.7324 for l = 2 to 6,
rising towards (3 sqrt 3 / e) r_s = 1.9116 r_s, the limit for a hole that swallows every wave of degree l below the
frequency (l + 1/2) / 3 sqrt 3 and none above (the factorials grow as (2l / e)^l). Read as the moments of a round body,
m_k = int rho r^(2k) dV / M = (R_(k+1) / r_s)^(2k), they are not those of any positive mass: every such body has
int rho r^2 (r^2 - a)^2 dV >= 0, that is m_3 - 2 a m_2 + a^2 m_1 >= 0, and the hole's numbers give -2.04 M r_s^6 at a =
4.34 r_s^2; the ratios m_k^2 / (m_(k-1) m_(k+1)), at most one for positive mass, are 0.2388, 1.1171, 1.0314, 1.0127 for
k = 1 to 4. The control: an absorber with Gamma_l a step at x = (l + 1/2) / b gives the ratios 1.1853, 1.0630, 1.0307
for k = 2, 3, 4, the same for every b.

How Gamma_l is computed for these. By the same bhmodes.transmission at every l (its low-frequency limit is Page's
4 [(l-2)! (l+2)! / ((2l)! (2l+1)!!)]^2 (2x)^(2l+2) for each l, approached as 1 + 7x), on 24 (2l-1) + 1 frequencies
equally spaced in ln x from a twentieth of x_l = (l + 1/2) / 3 sqrt 3 to twice it, fine enough for Simpson's rule to
follow x^(1-2l); Page's law below and Gamma_l = 1 above. That is 73 to 265 frequencies, about 15 seconds for l = 2 to
6, kept once computed. On 64 (2l-1) + 1 frequencies from x_l / 40 to 3 x_l the radii move by about one part in 10^6;
at l = 2 the coarser grid of greybody_grid gives 1.01752 for the 1.01746 here.

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


# --- tides of any degree --------------------------------------------------------------------------------------------


def double_factorial_odd(l: int) -> int:
    """(2l + 1)!! = 1 3 5 ... (2l + 1)."""
    return math.prod(range(1, 2 * l + 2, 2))


def thorne_coefficient(l: int) -> float:
    """N_l in the power P = (G / c^(2l+1)) N_l <(d^(l+1) I_L / dt^(l+1))^2> radiated by a mass multipole of degree l
    (Thorne 1980): (l+1)(l+2) / [(l-1) l l! (2l+1)!!], 1/5 at l = 2."""
    return (l + 1) * (l + 2) / ((l - 1) * l * math.factorial(l) * double_factorial_odd(l))


def page_coefficient(l: int) -> float:
    """Gamma_l -> page_coefficient(l) x^(2l+2) for long spin-2 waves on Schwarzschild (Page 1976): 4 [(l-2)! (l+2)! /
    ((2l)! (2l+1)!!)]^2 2^(2l+2); 256/225 at l = 2."""
    a = math.factorial(l - 2) * math.factorial(l + 2) / (math.factorial(2 * l) * double_factorial_odd(l))
    return 4.0 * a * a * 2.0 ** (2 * l + 2)


def barrier_frequency(l: int) -> float:
    """x_l = (l + 1/2) / 3 sqrt 3: where a wave of degree l starts to pass the peak of the barrier (in G M omega /
    c^3)."""
    return (l + 0.5) / (3.0 * math.sqrt(3.0))


@lru_cache(maxsize=8)
def degree_grid(l: int) -> tuple[np.ndarray, np.ndarray]:
    """(x, Gamma_l(x)) on 24 (2l-1) + 1 frequencies equally spaced in ln x from x_l / 20 to 2 x_l, computed once and
    kept (bhmodes.transmission with reach = 60, far = 120, as for greybody_grid)."""
    xl = barrier_frequency(l)
    xs = np.geomspace(xl / 20.0, 2.0 * xl, 24 * (2 * l - 1) + 1)
    gamma = np.array([transmission(l, float(x), reach=60.0, far=120.0)[0] for x in xs])
    xs.setflags(write=False)
    gamma.setflags(write=False)
    return xs, gamma


def degree_moment(l: int) -> float:
    """int_0^inf Gamma_l x^(-2l) dx: Simpson's rule in ln x over degree_grid(l), Page's law below it and Gamma_l = 1
    above. About 6.94 at l = 2."""
    xs, gamma = degree_grid(l)
    low = page_coefficient(l) * xs[0] ** 3 / 3.0
    high = xs[-1] ** (1 - 2 * l) / (2 * l - 1)
    return float(low + simpson(gamma * xs ** (1 - 2 * l), x=np.log(xs)) + high)


def shell_prefactor(l: int) -> float:
    """(R_l c^2 / G M)^(2l-2) per unit of int Gamma_l x^(-2l) dx: [(2l+1)!!]^2 (l-1) / [2 pi (2l+1)(l+1)(l+2)],
    which is 15 / 8 pi at l = 2. It is (2l+1)!! / [2 pi N_l l! l (2l+1)], N_l Thorne's coefficient."""
    return double_factorial_odd(l) ** 2 * (l - 1) / (2 * math.pi * (2 * l + 1) * (l + 1) * (l + 2))


def degree_sum_rule(l: int) -> float:
    """(2/pi) int omega Im chi_l d omega of the hole for one tide of profile r^l Y_lm, in units of M r_s^(2l-2):
    [l (2l+1) / 4 pi] (R_l / r_s)^(2l-2), that of the thin shell of radius R_l. At l = 2 it is (30 / 4 pi) times
    sum_rule(), the profiles differing."""
    return l * (2 * l + 1) / (4 * math.pi) * shell_prefactor(l) * degree_moment(l) / 2.0 ** (2 * l - 2)


def degree_shell_radius(l: int) -> float:
    """R_l / r_s: the radius of the thin shell of the hole's mass whose sum for the tides of degree l is the hole's.
    1.0175, 1.4555, 1.6100, 1.6868, 1.7324 for l = 2 to 6."""
    return (shell_prefactor(l) * degree_moment(l)) ** (1.0 / (2 * l - 2)) / 2.0


SHARP_LIMIT = 3.0 * math.sqrt(3.0) / math.e
"""R_l / r_s for l -> infinity, for the hole and for any absorber that takes every wave of degree l below the frequency
(l + 1/2) / 3 sqrt 3: 3 sqrt 3 / e = 1.9116."""


def sharp_shell_radius(l: int, b: float = 3.0 * math.sqrt(3.0)) -> float:
    """R_l / r_s for an absorber with Gamma_l = 1 above x = (l + 1/2) / b and 0 below (b in units of G M / c^2; the
    hole's capture radius 3 sqrt 3 by default): int Gamma_l x^(-2l) dx = x^(1-2l) / (2l-1), in logarithms so that
    large l does not overflow."""
    x = (l + 0.5) / b
    log_df = math.lgamma(2 * l + 2) - l * math.log(2.0) - math.lgamma(l + 1)            # ln (2l+1)!!
    log_pref = 2 * log_df + math.log((l - 1) / (2 * math.pi * (2 * l + 1) * (l + 1) * (l + 2)))
    log_moment = (1 - 2 * l) * math.log(x) - math.log(2 * l - 1)
    return math.exp((log_pref + log_moment) / (2 * l - 2)) / 2.0


def would_be_moments(radii) -> list[float]:
    """m_k = (R_(k+1) / r_s)^(2k), k = 0, 1, ..., from the shell radii R_2, R_3, ... (m_0 = 1, the tide of degree
    one reading the mass): for a round body of positive mass m_k = int rho r^(2k) dV / M."""
    return [1.0] + [float(r) ** (2 * k) for k, r in enumerate(radii, start=1)]


def hole_moments(l_max: int = 6) -> list[float]:
    """would_be_moments of the hole, m_0 to m_(l_max - 1)."""
    return would_be_moments([degree_shell_radius(l) for l in range(2, l_max + 1)])


def positivity_ratios(m) -> list[float]:
    """m_k^2 / (m_(k-1) m_(k+1)), k = 1, 2, ...: at most one for every distribution of positive mass (Cauchy and
    Schwarz on r^(k-1) and r^(k+1) against rho)."""
    return [m[k] ** 2 / (m[k - 1] * m[k + 1]) for k in range(1, len(m) - 1)]


def three_tide_minimum(m, k: int = 2) -> tuple[float, float]:
    """The least value over a of m_(k+1) - 2 a m_k + a^2 m_(k-1), which is int rho r^(2k-2) (r^2 - a)^2 dV / M >= 0
    for positive mass, and the a where it is: (m_(k+1) - m_k^2 / m_(k-1), m_k / m_(k-1)). For the hole, with k = 2
    (the tides of degree 2, 3 and 4), -2.04 (M r_s^6) at a = 4.34 (r_s^2)."""
    a = m[k] / m[k - 1]
    return m[k + 1] - m[k] ** 2 / m[k - 1], a


def sharp_ratios(b: float = 3.0 * math.sqrt(3.0), ks=(2, 3, 4)) -> list[float]:
    """positivity_ratios of the sharp absorber of sharp_shell_radius at k = 2, 3, 4: 1.1853, 1.0630, 1.0307, the
    same for every b."""
    m = would_be_moments([sharp_shell_radius(l, b) for l in range(2, max(ks) + 3)])
    ratios = positivity_ratios(m)
    return [ratios[k - 1] for k in ks]
