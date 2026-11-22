"""A spinning black hole against the graviton background, mode by mode (paper, Sections XI and XII).

The greybody factor Gamma_lm(omega) of a Kerr hole of mass M and spin a for gravitational waves: the fraction of
an incoming wave of degree l, azimuthal number m and frequency omega that the hole absorbs, 1 - (energy flux
scattered back) / (energy flux sent in). It is negative, the wave amplified, for 0 < omega < m Omega_H, Omega_H =
a / (2 M r_+), r_(+-) = M +- sqrt(M^2 - a^2). Units G = c = M = 1 throughout; time dependence e^(-i omega t + i m
phi) (Teukolsky 1973, Astrophys. J. 185, 635).

The angular problem. The spin-weighted spheroidal harmonics of s = -2 solve (Teukolsky 1973, Eq. 4.10)

    (1/sin th) d/dth (sin th dS/dth) + [c^2 cos^2 th - (m + s cos th)^2 / sin^2 th - 2 c s cos th + s + A] S = 0,

c = a omega. In the basis of the spin-weighted spherical harmonics sY_lm (the case c = 0, A = l(l+1) - s(s+1)) the
operator is the real symmetric matrix

    A = diag[(l - s)(l + s + 1)] - c^2 <cos^2 th> + 2 c s <cos th>,
    <l|cos th|l> = -m s / (l (l+1)),   <l+1|cos th|l> = sqrt[((l+1)^2 - m^2)((l+1)^2 - s^2)] / [(l+1) sqrt((2l+1)(2l+3))],

and <cos^2 th> is the square of <cos th> in a basis one larger, cut back. The eigenvalues of a real symmetric
Sturm-Liouville problem do not cross as c moves, so A_lm(c) is the (l - l_min)-th smallest, continued from
l(l+1) - s(s+1); to first order A = l(l+1) - 2 - 8 c m / (l(l+1)) (Press and Teukolsky 1973). Twenty-four harmonics
above l are kept; tests/test_kerrmodes.py checks the eigenvalue against shooting the equation itself.

The radial problem. Teukolsky's radial function of s = -2 is turned into X by the transformation of Sasaki and
Nakamura (1982, Prog. Theor. Phys. 67, 1788), in the form of Hughes (2000, Phys. Rev. D 61, 084004, Appendix A) and
of Sasaki and Tagoshi (2003, Living Rev. Rel. 6, 6, Section 4.1). With Delta = r^2 - 2r + a^2, K = (r^2 + a^2) omega -
a m and lambda = A + c^2 - 2 a m omega,

    X'' - F X' - U X = 0          (' = d/dr*,  dr*/dr = (r^2 + a^2) / Delta),
    F = (eta_r / eta) Delta / (r^2 + a^2),
    U = Delta U1 / (r^2 + a^2)^2 + G^2 + Delta G_r / (r^2 + a^2) - F G,
    G = -2 (r - 1) / (r^2 + a^2) + r Delta / (r^2 + a^2)^2,
    U1 = V + (Delta^2 / beta) [(2 alpha + beta_r / Delta)_r - (eta_r / eta)(alpha + beta_r / Delta)],
    V = -(K^2 + 4 i (r - 1) K) / Delta + 8 i omega r + lambda,
    alpha = -i K beta / Delta^2 + 3 i K_r + lambda + 6 Delta / r^2,   beta = 2 Delta (-i K + r - 1 - 2 Delta / r),
    eta = c0 + c1/r + c2/r^2 + c3/r^3 + c4/r^4,
    c0 = -12 i omega + lambda (lambda + 2) - 12 a omega (a omega - m),   c1 = 8 i a [3 a omega - lambda (a omega - m)],
    c2 = -24 i a (a omega - m) + 12 a^2 [1 - 2 (a omega - m)^2],   c3 = 24 i a^3 (a omega - m) - 24 a^2,   c4 = 12 a^4.

F and U fall off as 1/r^2, so X = A_inc e^(-i omega r*) + A_ref e^(i omega r*) far away and X = A_trans e^(-i k r*) at
the horizon, k = omega - m Omega_H. The Teukolsky amplitudes of R = B_trans Delta^2 e^(-ikr*) at the horizon and R =
B_inc e^(-i omega r*) / r + B_ref r^3 e^(i omega r*) far away are (Sasaki and Tagoshi, Eq. 4.17)

    B_inc = -A_inc / (4 omega^2),   B_ref = -4 omega^2 A_ref / c0,   B_trans = A_trans / d,
    d = sqrt(2 r_+) [(8 - 24 i omega - 16 omega^2) r_+^2 + (12 i a m - 16 + 16 a m omega + 24 i omega) r_+
                     - 4 a^2 m^2 - 12 i a m + 8].

The energy fluxes (Teukolsky and Press 1974, Astrophys. J. 193, 443, Eqs. 4.12-4.14 and 4.44, as written by Hughes
2000, Eqs. 4.15-4.18): out at infinity |B_ref|^2 / (4 pi omega^2), in at infinity 256 omega^8 |B_inc|^2 / (4 pi omega^2
|C|^2), into the hole (2 r_+)^5 k (k^2 + 4 eps^2)(k^2 + 16 eps^2) 256 omega^3 |B_trans|^2 / (4 pi omega^2 |C|^2), with
eps = kappa / 2 = sqrt(1 - a^2) / (4 r_+) and the Teukolsky-Starobinsky constant

    |C|^2 = lambda^2 (lambda + 2)^2 - 8 omega^2 lambda [alpha2 (5 lambda + 6) - 12 a^2] + 144 omega^4 alpha2^2 + 144 omega^2,
    alpha2 = a^2 - a m / omega.

So the greybody factor two ways, from infinity and from the horizon:

    Gamma_inf = 1 - (|C|^2 / |c0|^2) |A_ref / A_inc|^2,
    Gamma_hor = 16 (2 r_+)^5 k (k^2 + kappa^2)(k^2 + 4 kappa^2) |A_trans / A_inc|^2 / (omega |d|^2),

kappa = (r_+ - r_-) / (2 (r_+^2 + a^2)) the surface gravity. Their agreement is the check of flux conservation, of
the amplitudes' conversion and of the integration at once; Gamma_hor, free of cancellation and with the sign of k
built in, is the value returned. At a = 0 the equation is Regge and Wheeler's, |C| = |c0|, |d|^2 = 256 (1 + 4
omega^2)(1 + 16 omega^2), and both reduce to bhmodes.transmission.

How X is computed. X is started at r - r_+ = 1e-4 (r_+ - r_-) from the Frobenius series e^(-ikr*) sum g_n (r -
r_+)^n (six terms) and carried out in t = ln(r - r_+), where both the horizon's oscillation in ln(r - r_+) and the
far zone's are smooth, by the sixth-order Magnus method with three Gauss nodes (Blanes, Casas, Oteo and Ros 2009,
Phys. Rep. 470, 151, Eq. 253) on a grid whose spacing follows the local rate of the solution: the coefficients at
all nodes are evaluated at once and the step propagators multiplied pairwise (eight steps per radian of the
local rate). At r_max = max(120 / omega, 120) it is matched to the asymptotic series e^(+-i omega r*) sum f_n r^-n,
carried to its smallest term. About 0.03 s a frequency; doubling the steps or r_max moves Gamma by less than 1e-9. The coefficients of
the equation, their expansions at the horizon and at infinity and their values at the nodes all come from the one
set of formulas above, evaluated in truncated Laurent series (class _Ser), so the derivatives are exact.

The low-frequency limit (Starobinsky 1973, Sov. Phys. JETP 37, 28; Starobinsky and Churilov 1974; Page 1976, Phys.
Rev. D 13, 198, Eq. 13), for spin s and degree l,

    Gamma_lm -> [(l-s)! (l+s)! / ((2l)! (2l+1)!!)]^2 prod_(n=1..l) [1 + (omega - m Omega_H)^2 / (n^2 kappa^2)]
                * 2 (omega - m Omega_H) / kappa * [omega (r_+ - r_-)]^(2l+1),

which at a = 0 is Page's (256/225) (M omega)^6 for l = 2 (with the product, which he drops at that order). It is
approached as 1 + about 7 M omega: at a = 0.5, l = 2 and M omega = 0.01 the computed Gamma exceeds it by 7.4, 7.1,
6.8, 6.4 and 6.1 per cent for m = -2 to 2, and at M omega = 0.001 by 0.70 to 0.57 per cent. For m != 0 and a > 0 the
factor omega - m Omega_H tends to -m Omega_H, so Gamma_2m ~ x^5 rather than x^6 at long waves.

The numbers (l = m = 2; tests/test_kerrmodes.py pins them):

    a/M        0.5       0.7       0.9      0.99     0.998    0.99999   1 - 1e-8   1 - 1e-10
    -Gamma_max 0.000119  0.00273   0.0642   0.555    0.909    1.332     1.3754     1.3769
    M omega    0.2359    0.3683    0.5819   0.8341   0.9177   0.99295   0.99974    0.99997
    m Omega_H  0.2679    0.4084    0.6268   0.8676   0.9387   0.99554   0.99986    0.99999

rising to Teukolsky and Press's 138 per cent only as a -> 1, the peak crowding against m Omega_H. Flux into the
horizon and out at infinity agree to 1e-10 or better up to a = 0.99999; at a = 1 - 1e-10 to 3e-6.

Against the sky. In a bath at T_bg a mode leaves the hole with the occupation (paper, Section XI)

    n_out = n_bg + Gamma (n_H - n_bg),   n_bg = 1 / (e^(hbar omega / k T_bg) - 1),
    n_H = 1 / (e^(hbar (omega - m Omega_H) / k T_H) - 1),  k T_H = hbar kappa / 2 pi,

so hbar (omega - m Omega_H) / k T_H = 2 pi k / kappa does not depend on the mass, and hbar omega / k T_bg = 8 pi (M
omega) M_eq / M with M_eq = hbar c^3 / (8 pi G k T_bg) the mass whose Schwarzschild temperature is T_bg. In a
superradiant mode Gamma < 0 and n_H = -(1 + n(2 pi |k| / kappa)), so

    n_out = (1 + |Gamma|) n_bg + |Gamma| [1 + n(2 pi |k| / kappa)]:

the sky's quanta amplified (stimulated) and the hole's own, |Gamma| per mode as the hole goes cold (spontaneous,
Starobinsky's and Unruh's emission), plus its thermal part, which vanishes as kappa -> 0. Hence n_out / n_bg -> 1 -
Gamma + |Gamma| / n_bg.

Tested in tests/test_kerrmodes.py.
"""
from __future__ import annotations

import math
from functools import lru_cache

import numpy as np
from scipy.optimize import minimize_scalar

S = -2
"""Spin weight of the field: Teukolsky's psi_4."""


# --- truncated Laurent series ---------------------------------------------------------------------------------------


def _pad(A, B):
    while A.ndim < B.ndim:
        A = A[..., None]
    while B.ndim < A.ndim:
        B = B[..., None]
    return A, B


class _Ser:
    """sum_j c[j] z^(off + j), known to the absolute order off + len(c) - 1; c may carry trailing axes (one series per
    point). The variable z is the deviation r - r0 at a point (deriv = d/dz), r - r_+ at the horizon, or 1/r at
    infinity (deriv = -z^2 d/dz)."""

    __slots__ = ("off", "c", "dz")

    def __init__(self, off, c, dz):
        self.off, self.c, self.dz = off, c, dz  # dz: +1 for d/dz, -1 for -z^2 d/dz (z = 1/r)

    @property
    def top(self):
        return self.off + len(self.c) - 1

    def _on(self, lo, hi):
        """Coefficients from z^lo to z^hi (zeros outside what is held below its top)."""
        shape = (hi - lo + 1,) + self.c.shape[1:]
        out = np.zeros(shape, dtype=complex)
        i0, i1 = max(lo, self.off), min(hi, self.top)
        if i1 >= i0:
            out[i0 - lo : i1 - lo + 1] = self.c[i0 - self.off : i1 - self.off + 1]
        return out

    def __add__(self, o):
        if not isinstance(o, _Ser):  # an exact constant
            if self.top < 0:
                return self
            off = min(self.off, 0)
            c = self._on(off, self.top)
            c[-off] = c[-off] + o
            return _Ser(off, c, self.dz)
        lo, hi = min(self.off, o.off), min(self.top, o.top)
        A, B = _pad(self._on(lo, hi), o._on(lo, hi))
        return _Ser(lo, A + B, self.dz)

    __radd__ = __add__

    def __neg__(self):
        return _Ser(self.off, -self.c, self.dz)

    def __sub__(self, o):
        return self + (-o)

    def __rsub__(self, o):
        return (-self) + o

    def __mul__(self, o):
        if not isinstance(o, _Ser):
            return _Ser(self.off, self.c * o, self.dz)
        n = min(len(self.c), len(o.c))
        a, b = _pad(self.c[:n], o.c[:n])
        if a.ndim == 1 and b.ndim == 1:
            prod = np.convolve(a, b)[:n]
        else:
            prod = np.zeros((n,) + np.broadcast_shapes(a.shape[1:], b.shape[1:]), dtype=complex)
            for i in range(n):
                prod[i:] += a[i] * b[: n - i]
        return _Ser(self.off + o.off, prod, self.dz)

    __rmul__ = __mul__

    def inv(self):
        a = self.c
        n = len(a)
        b = np.zeros_like(a)
        b[0] = 1.0 / a[0]
        for k in range(1, n):
            acc = np.zeros_like(a[0])
            for j in range(1, k + 1):
                acc = acc + a[j] * b[k - j]
            b[k] = -acc * b[0]
        return _Ser(-self.off, b, self.dz)

    def __truediv__(self, o):
        if not isinstance(o, _Ser):
            return _Ser(self.off, self.c / o, self.dz)
        return self * o.inv()

    def __rtruediv__(self, o):
        return self.inv() * o

    def __pow__(self, n: int):
        out = self
        for _ in range(n - 1):
            out = out * self
        return out

    def d(self):
        """d/dr."""
        p = self.off + np.arange(len(self.c))
        fac = p.reshape((-1,) + (1,) * (self.c.ndim - 1))
        if self.dz > 0:  # d/dz, powers drop by one
            new, off = fac * self.c, self.off - 1
        else:  # -z^2 d/dz, powers rise by one
            new, off = -fac * self.c, self.off + 1
        if self.off == 0:  # the constant's derivative is an exact zero: drop it
            new, off = new[1:], off + 1
        return _Ser(off, new, self.dz)

    def coef(self, p):
        return self.c[p - self.off] if self.off <= p <= self.top else 0.0


# --- the hole and the angular eigenvalue ----------------------------------------------------------------------------


def horizons(a: float) -> tuple[float, float]:
    q = math.sqrt(1.0 - a * a)
    return 1.0 + q, 1.0 - q


def horizon_frequency(a: float) -> float:
    """Omega_H = a / (2 M r_+), in units of 1/M."""
    return a / (2.0 * horizons(a)[0])


def surface_gravity(a: float) -> float:
    """kappa = (r_+ - r_-) / (2 (r_+^2 + a^2)), in units of 1/M; k T_H = hbar kappa / 2 pi."""
    rp, rm = horizons(a)
    return (rp - rm) / (2.0 * (rp * rp + a * a))


def _cos_matrix(m: int, s: int, l0: int, n: int) -> np.ndarray:
    ls = np.arange(l0, l0 + n)
    x = np.zeros((n, n))
    x[np.arange(n), np.arange(n)] = -m * s / (ls * (ls + 1.0))
    lo = ls[:-1]
    off = np.sqrt(((lo + 1.0) ** 2 - m * m) * ((lo + 1.0) ** 2 - s * s)) / ((lo + 1.0) * np.sqrt((2 * lo + 1.0) * (2 * lo + 3.0)))
    x[np.arange(n - 1), np.arange(1, n)] = off
    x[np.arange(1, n), np.arange(n - 1)] = off
    return x


@lru_cache(maxsize=4096)
def spheroidal_eigenvalue(l: int, m: int, c: float, s: int = S, extra: int = 24) -> float:
    """A_lm(c), c = a omega, of the spin-weighted spheroidal harmonics (Teukolsky's A), by the spectral method in the
    spin-weighted spherical harmonics: l(l+1) - s(s+1) at c = 0."""
    l0 = max(abs(m), abs(s))
    n = l - l0 + 1 + extra
    x = _cos_matrix(m, s, l0, n + 1)
    x2 = (x @ x)[:n, :n]
    x = x[:n, :n]
    ls = np.arange(l0, l0 + n)
    amat = np.diag((ls - s) * (ls + s + 1.0)) - c * c * x2 + 2.0 * c * s * x
    return float(np.sort(np.linalg.eigvalsh(amat))[l - l0])


# --- the Sasaki-Nakamura equation, in series ------------------------------------------------------------------------


class _Mode:
    """Parameters of one (l, m, a, omega)."""

    def __init__(self, l, m, a, omega):
        self.l, self.m, self.a, self.w = l, m, float(a), float(omega)
        self.rp, self.rm = horizons(self.a)
        self.A = spheroidal_eigenvalue(l, m, round(self.a * self.w, 15))
        self.lam = self.A + (self.a * self.w) ** 2 - 2.0 * self.a * m * self.w
        self.k = self.w - m * horizon_frequency(self.a)
        self.kappa = surface_gravity(self.a)
        a, w, lam = self.a, self.w, self.lam
        q = a * w - m
        self.cs = (
            -12j * w + lam * (lam + 2.0) - 12.0 * a * w * q,
            8j * a * (3.0 * a * w - lam * q),
            -24j * a * q + 12.0 * a * a * (1.0 - 2.0 * q * q),
            24j * a**3 * q - 24.0 * a * a,
            12.0 * a**4,
        )

    def coefficients(self, r: _Ser, xp: _Ser, xm: _Ser):
        """p = h_r / h - eta_r / eta and q = U / h^2, h = Delta / (r^2 + a^2), so that X_rr + p X_r - q X = 0; and h.
        r, r - r_+ and r - r_- are passed separately so that Delta = (r - r_+)(r - r_-) has its zero exactly."""
        a, w, m, lam = self.a, self.w, self.m, self.lam
        c0, c1, c2, c3, c4 = self.cs
        D = xp * xm
        Dr = D.d()
        s2 = r * r + a * a
        K = s2 * w - a * m
        Kr = K.d()
        ir = 1.0 / r
        eta = c0 + ir * (c1 + ir * (c2 + ir * (c3 + ir * c4)))
        le = eta.d() / eta  # eta_r / eta
        beta = 2.0 * D * (-1j * K + r - 1.0 - 2.0 * D * ir)
        alpha = -1j * K * beta / (D * D) + 3j * Kr + lam + 6.0 * D * ir * ir
        br_D = beta.d() / D
        V = -(K * K + 4j * (r - 1.0) * K) / D + 8j * w * r + lam
        U1 = V + (D * D / beta) * ((2.0 * alpha + br_D).d() - le * (alpha + br_D))
        G = -2.0 * (r - 1.0) / s2 + r * D / (s2 * s2)
        h = D / s2
        F = le * h
        U = h * U1 / s2 + G * G + h * G.d() - F * G
        p = h.d() / h - le
        q = U / (h * h)
        return p, q, h, Dr


def _rstar(a: float, r):
    rp, rm = horizons(a)
    lp = np.log((r - rp) / 2.0)
    lm = np.log((r - rm) / 2.0) if rm > 0 else 0.0
    return r + (2.0 * rp * lp - 2.0 * rm * lm) / (rp - rm)


def _phase_equation(mode: _Mode, r, xp, xm, phi):
    """For X = e^(i phi r*) f: f_rr + P f_r + Q f = 0. Returns the series of P and Q."""
    p, q, h, _ = mode.coefficients(r, xp, xm)
    ih = 1.0 / h
    P = 2j * phi * ih + p
    Q = 1j * phi * ih.d() - phi * phi * ih * ih + 1j * phi * p * ih - q
    return P, Q


def _horizon_series(mode: _Mode, order: int = 6) -> np.ndarray:
    """g_n of X = e^(-ikr*) sum g_n (r - r_+)^n, g_0 = 1."""
    L = order + 8
    z = np.zeros(L, dtype=complex)
    z[0] = 1.0
    xp = _Ser(1, z, 1)
    r = xp + mode.rp
    xm = xp + (mode.rp - mode.rm)
    P, Q = _phase_equation(mode, r, xp, xm, -mode.k)
    mode.q_horizon = (Q.coef(-2), Q.coef(-1))
    g = np.zeros(order + 1, dtype=complex)
    g[0] = 1.0
    Pm1 = P.coef(-1)
    for n in range(1, order + 1):
        acc = 0.0
        for i in range(0, n):
            acc += P.coef(i) * (n - 1 - i) * g[n - 1 - i]
        for i in range(-1, n - 1):
            acc += Q.coef(i) * g[n - 2 - i]
        g[n] = -acc / (n * (n - 1 + Pm1))
    return g


@lru_cache(maxsize=4096)
def _infinity_coefficients(l, m, a, omega, sigma, order=40):
    """P_j, Q_j of the phase equation in u = 1/r for X = e^(i sigma omega r*) f."""
    mode = _Mode(l, m, a, omega)
    L = order + 12
    c = np.zeros(L, dtype=complex)
    c[0] = 1.0
    r = _Ser(-1, c, -1)
    P, Q = _phase_equation(mode, r, r - mode.rp, r - mode.rm, sigma * omega)
    Pj = np.array([P.coef(j) for j in range(0, order + 1)])
    Qj = np.array([Q.coef(j) for j in range(0, order + 2)])
    return Pj, Qj, [abs(P.coef(j)) for j in range(P.off, 0)], [abs(Q.coef(j)) for j in range(Q.off, 2)]


def _far_solution(mode: _Mode, sigma: int, r: float, nmax: int = 40):
    """X and X_r of e^(i sigma omega r*) sum f_n r^-n at r, the series cut at its smallest term."""
    Pj, Qj, _, _ = _infinity_coefficients(mode.l, mode.m, mode.a, mode.w, sigma)
    f = np.zeros(nmax + 1, dtype=complex)
    f[0] = 1.0
    u = 1.0 / r
    val, der = 1.0 + 0j, 0j
    terms = []
    for n in range(1, nmax + 1):
        rest = (n - 1) * n * f[n - 1]
        for j in range(1, n + 1):
            rest -= Pj[j] * (n - j) * f[n - j]
        for j in range(2, n + 2):
            rest += Qj[j] * f[n + 1 - j]
        f[n] = rest / (n * Pj[0])
        term = abs(f[n]) * u**n
        # an asymptotic series: stop where the terms, past a few accidental zeros, start to grow
        if n > 8 and term > max(terms[-3:]):
            break
        terms.append(term)
        val += f[n] * u**n
        der += -n * f[n] * u ** (n + 1)
        if n > 8 and max(terms[-3:]) < 1e-18:
            break
    h = (r - mode.rp) * (r - mode.rm) / (r * r + mode.a**2)
    e = np.exp(1j * sigma * mode.w * _rstar(mode.a, r))
    return e * val, e * (der + 1j * sigma * mode.w * val / h)


# --- integration: sixth-order Magnus in t = ln(r - r_+) --------------------------------------------------------------


_GAUSS = np.array([0.5 - math.sqrt(15.0) / 10.0, 0.5, 0.5 + math.sqrt(15.0) / 10.0])


def _system(mode: _Mode, x: np.ndarray):
    """The matrix of d/dt (X, x X_r) at r = r_+ + x: [[0, 1], [x^2 q, 1 - x p]]."""
    c = np.zeros((3, x.size), dtype=complex)
    c[0], c[1] = x, 1.0
    xp = _Ser(0, c, 1)
    r = xp + mode.rp
    xm = xp + (mode.rp - mode.rm)
    p, q, _, _ = mode.coefficients(r, xp, xm)
    pv, qv = p.coef(0), q.coef(0)
    M = np.zeros((x.size, 2, 2), dtype=complex)
    M[:, 0, 1] = 1.0
    M[:, 1, 0] = x * x * qv
    M[:, 1, 1] = 1.0 - x * pv
    return M


def _comm(A, B):
    return A @ B - B @ A


def _expm2(W):
    tr = 0.5 * (W[:, 0, 0] + W[:, 1, 1])
    B = W.copy()
    B[:, 0, 0] -= tr
    B[:, 1, 1] -= tr
    mu2 = B[:, 0, 0] ** 2 + B[:, 0, 1] * B[:, 1, 0]
    mu = np.sqrt(mu2)
    small = np.abs(mu) < 1e-4
    sh = np.where(small, 1.0 + mu2 / 6.0 + mu2 * mu2 / 120.0, np.sinh(mu) / np.where(small, 1.0, mu))
    ch = np.cosh(mu)
    E = sh[:, None, None] * B
    E[:, 0, 0] += ch
    E[:, 1, 1] += ch
    return np.exp(tr)[:, None, None] * E


def _propagator(mode: _Mode, t: np.ndarray) -> np.ndarray:
    """The product of the Magnus propagators of the steps of the grid t."""
    hs = np.diff(t)
    nodes = t[:-1, None] + hs[:, None] * _GAUSS[None, :]
    Ms = _system(mode, np.exp(nodes.ravel())).reshape(len(hs), 3, 2, 2)
    A1, A2, A3 = Ms[:, 0], Ms[:, 1], Ms[:, 2]
    h = hs[:, None, None]
    a1 = h * A2
    a2 = (math.sqrt(15.0) / 3.0) * h * (A3 - A1)
    a3 = (10.0 / 3.0) * h * (A3 - 2.0 * A2 + A1)
    C1 = _comm(a1, a2)
    C2 = -(1.0 / 60.0) * _comm(a1, 2.0 * a3 + C1)
    W = a1 + a3 / 12.0 + (1.0 / 240.0) * _comm(-20.0 * a1 - a3 + C1, a2 + C2)
    P = _expm2(W)
    while len(P) > 1:  # later steps on the left
        if len(P) % 2:
            P = np.concatenate([P, np.eye(2, dtype=complex)[None]])
        P = P[1::2] @ P[0::2]
    return P[0]


def _grid(mode: _Mode, t0: float, t1: float, per_radian: float) -> np.ndarray:
    """Nodes in t whose density follows the local rate of the solution."""
    tc = np.linspace(t0, t1, 4001)
    M = _system(mode, np.exp(tc))
    rate = np.sqrt(np.abs(M[:, 1, 0])) + np.abs(M[:, 1, 1]) + np.exp(tc) * mode.w + 0.5
    s = np.concatenate([[0.0], np.cumsum(0.5 * (rate[1:] + rate[:-1]) * np.diff(tc))])
    n = max(int(s[-1] * per_radian), 200)
    return np.interp(np.linspace(0.0, s[-1], n + 1), s, tc)


@lru_cache(maxsize=8192)
def amplitudes(l: int, m: int, a: float, omega: float, per_radian: float = 8.0, reach: float = 120.0):
    """(A_trans, A_inc, A_ref) of the Sasaki-Nakamura solution that is purely ingoing at the horizon, A_trans = 1."""
    mode = _Mode(l, m, a, omega)
    g = _horizon_series(mode)
    x0 = 1e-4 * (mode.rp - mode.rm) if a > 0 else 1e-4 * 2.0
    x0 = min(x0, 1e-4)
    rmax = max(reach / omega, 120.0)
    # the start, from the series: X = e^(-ikr*) g, x X_r
    r0 = mode.rp + x0
    gv = np.polyval(g[::-1], x0)
    gd = np.polyval((np.arange(1, len(g)) * g[1:])[::-1], x0)
    h0 = x0 * (r0 - mode.rm) / (r0 * r0 + a * a)
    e0 = np.exp(-1j * mode.k * _rstar(a, r0))
    X0 = e0 * gv
    Xr0 = e0 * (gd - 1j * mode.k * gv / h0)
    t = _grid(mode, math.log(x0), math.log(rmax - mode.rp), per_radian)
    y = _propagator(mode, t) @ np.array([X0, x0 * Xr0])
    X, Xr = y[0], y[1] / (rmax - mode.rp)
    Xo, Xor = _far_solution(mode, +1, rmax)
    Xi, Xir = _far_solution(mode, -1, rmax)
    det = Xo * Xir - Xi * Xor
    a_ref = (X * Xir - Xi * Xr) / det
    a_inc = (Xo * Xr - X * Xor) / det
    return 1.0 + 0j, complex(a_inc), complex(a_ref)


def starobinsky_constant(l: int, m: int, a: float, omega: float) -> float:
    """|C|^2 of the Teukolsky-Starobinsky identities for s = 2 (Teukolsky and Press 1974, Eq. 4.4)."""
    mode = _Mode(l, m, a, omega)
    lam, w = mode.lam, mode.w
    al2 = a * a - a * m / w
    return lam**2 * (lam + 2) ** 2 - 8 * w * w * lam * (al2 * (5 * lam + 6) - 12 * a * a) + 144 * w**4 * al2**2 + 144 * w * w


def _d(l, m, a, w):
    rp = horizons(a)[0]
    return math.sqrt(2 * rp) * ((8 - 24j * w - 16 * w * w) * rp * rp + (12j * a * m - 16 + 16 * a * m * w + 24j * w) * rp
                                - 4 * a * a * m * m - 12j * a * m + 8)


def greybody_both(l: int, m: int, a: float, omega: float, **kw) -> tuple[float, float]:
    """(Gamma_hor, Gamma_inf): the absorbed fraction from the flux into the horizon and from the flux back out."""
    at, ai, ar = amplitudes(l, m, float(a), float(omega), **kw)
    mode = _Mode(l, m, a, omega)
    rp, k, kap, w = mode.rp, mode.k, mode.kappa, mode.w
    hor = 16 * (2 * rp) ** 5 * k * (k * k + kap * kap) * (k * k + 4 * kap * kap) * abs(at / ai) ** 2 / (w * abs(_d(l, m, a, w)) ** 2)
    inf = 1.0 - starobinsky_constant(l, m, a, omega) / abs(mode.cs[0]) ** 2 * abs(ar / ai) ** 2
    return float(hor), float(inf)


def greybody(l: int, m: int, a: float, omega: float, **kw) -> float:
    """Gamma_lm(omega) of a Kerr hole of spin a = a/M at M omega = omega, for gravitational waves (from the horizon's
    flux). Negative for 0 < omega < m Omega_H."""
    return greybody_both(l, m, a, omega, **kw)[0]


def low_frequency(l: int, m: int, a: float, omega: float, s: int = 2) -> float:
    """Starobinsky's and Page's leading form of Gamma_lm for M omega -> 0 (module docstring)."""
    rp, rm = horizons(a)
    kap = surface_gravity(a)
    k = omega - m * horizon_frequency(a)
    pref = (math.factorial(l - s) * math.factorial(l + s) / (math.factorial(2 * l) * math.prod(range(1, 2 * l + 2, 2)))) ** 2
    prod = math.prod(1.0 + k * k / (n * n * kap * kap) for n in range(1, l + 1))
    return pref * prod * 2.0 * k / kap * (omega * (rp - rm)) ** (2 * l + 1)


# --- what the paper quotes -------------------------------------------------------------------------------------------


@lru_cache(maxsize=64)
def peak_amplification(a: float, l: int = 2, m: int = 2) -> tuple[float, float]:
    """(-Gamma_min, M omega there): the largest amplification of the mode (l, m) of a hole of spin a inside the
    superradiant band 0 < omega < m Omega_H. Near the extremal limit the peak crowds against m Omega_H, so it is sought
    in y = ln(1 - omega / m Omega_H): a scan on 31 points from 1 - 1e-9 to 0.2, then Brent's method about the best."""
    top = m * horizon_frequency(a)
    f = lambda y: greybody(l, m, a, float(top * (1.0 - math.exp(y))))
    ys = np.linspace(math.log(1e-9), math.log(0.8), 31)
    vals = [f(y) for y in ys]
    i = int(np.clip(np.argmin(vals), 1, len(ys) - 2))
    res = minimize_scalar(f, bounds=(ys[i - 1], ys[i + 1]), method="bounded", options={"xatol": 1e-7})
    return float(-res.fun), float(top * (1.0 - math.exp(res.x)))


def occupation(z):
    """1 / (e^z - 1), for either sign of z."""
    return 1.0 / math.expm1(z)


def equilibrium_mass(t_bg: float = 0.905) -> float:
    """M_eq = hbar c^3 / (8 pi G k T_bg): the mass (kg) whose Schwarzschild temperature is T_bg, 1.36e23 kg at
    0.905 K."""
    from .constants import G, c, hbar, kB

    return hbar * c**3 / (8 * math.pi * G * kB * t_bg)


def brightness(a: float, omega: float, mass_ratio: float, l: int = 2, m: int = 2, gamma: float | None = None) -> dict:
    """n_out / n_bg of the mode (l, m) at M omega = omega of a hole of spin a and mass mass_ratio M_eq, in the
    background at the temperature T_bg that defines M_eq: how many times brighter than the sky that mode leaves the
    hole. Also the cold limit 1 - Gamma + |Gamma| / n_bg (the hole's thermal part dropped) and the parts."""
    g = greybody(l, m, a, omega) if gamma is None else gamma
    nbg = occupation(8 * math.pi * omega / mass_ratio)
    z = 2 * math.pi * (omega - m * horizon_frequency(a)) / surface_gravity(a)
    nh = occupation(z)
    nout = nbg + g * (nh - nbg)
    return {"gamma": g, "n_bg": nbg, "n_H": nh, "ratio": nout / nbg, "cold": 1 - g + abs(g) / nbg,
            "stimulated": 1 - g, "spontaneous": abs(g) / nbg, "thermal": g * (nh + 1) / nbg if z < 0 else 0.0}


def tidal_moment(a: float, m: int, l: int = 2, x_low: float = 0.004, x_high: float = 4.0, n: int = 161) -> float:
    """int_0^inf Gamma_lm(x) x^-4 dx: Simpson's rule in ln x from x_low to x_high (plus the zero of Gamma at m Omega_H
    as a node when it falls inside), the low-frequency law below and Gamma = 1 above."""
    from scipy.integrate import simpson

    xs = np.geomspace(x_low, x_high, n)
    gam = np.array([greybody(l, m, a, float(x)) for x in xs])
    mid = simpson(gam * xs**-3, x=np.log(xs))
    # below: the low-frequency law scaled to meet the first computed value
    lf = lambda x: low_frequency(l, m, a, x)
    from scipy.integrate import quad

    scale = gam[0] / lf(xs[0])
    low = scale * quad(lambda x: lf(x) * x**-4, 0.0, xs[0], limit=200)[0]
    high = xs[-1] ** -3 / 3.0
    return float(low + mid + high)
