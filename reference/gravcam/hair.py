"""What the outside knows (paper, Section XII): the gravitational hair of ordinary matter and of black holes.

One look. Outside a body, at one time, the Newtonian field fixes the harmonic moments Q_h = sum_a m_a h(x_a), h
harmonic, and nothing else (nullspace.py): a shell and a ball of equal mass are the same from outside.

Two looks. For matter whose forces do not depend on velocity, Q_h and the rate of change of Q_g do not commute:

    [Q_h, dQ_g/dt] = i hbar sum_a m_a grad h(x_a) . grad g(x_a) = i hbar int rho grad h . grad g dV,

classically the Poisson bracket {Q_h, dQ_g/dt}. Three things the camera can measure are this one number: the thermal
tremor <dQ_h/dt dQ_g/dt> / kT (response.py), the weight of the response to a push, (2/pi) int omega Im chi d omega,
and the response to a push faster than any motion of the body, chi_hg(omega) -> -(1/omega^2) int rho grad h . grad g,
which is that of dust. With the harmonic functions h_+- = exp(zeta_+- . x), zeta_+- = (i xi +- eta) / 2, eta
perpendicular to xi and as long (zeta . zeta = 0), grad h_+ . grad h_- = -(|xi|^2 / 2) exp(i xi . x), so

    int rho grad h_+ . grad h_- dV = -(|xi|^2 / 2) rho~(xi),      rho~(xi) = int rho exp(i xi . x) dV:

the two-look data are the Fourier transform of the density (Calderon's argument for the linearized conductivity
problem, which this is, with the density in place of the conductivity). The null space of gravity belongs to one
look. The price is the usual one: each exponential grows to exp(|xi| a / 2) across a body of radius a.

How much. Read on a sphere of radius R_c about a body of radius a, the multipole of degree l is weaker than the
monopole by (a / R_c)^l, and there are 2l + 1 of each. With the monopole read at signal-to-noise ratio SNR, the data
hold sum_l (2l + 1) (1/2) log2(1 + SNR^2 (a/R_c)^(2l)) bits, which is

    H = [L^3 / (3 Lam^2) + L^2 / (2 Lam)] / ln 2,     L = ln SNR,  Lam = ln(R_c / a),

to the leading two orders: the cube of the logarithm again (capacity.py is its flat limit, R_c -> a). A black hole
has seven numbers in all (its mass, where it is, its spin): at most 7 log2 SNR bits.

A black hole (not spinning). Its Love numbers vanish; what answers a tide is the horizon's friction. In a slowly
changing tide it absorbs energy at the rate nu <Edot_ab Edot_ab> (and the same for the magnetic part), nu = (16/45)
G^5 M^6 / c^13 (Poisson 2004). In the description of the hole as a point with a quadrupole Q_ab whose energy in a
tide is Q_ab E_ab (Goldberger and Rothstein 2006; this Q is HALF the Newtonian int rho (x_a x_b - r^2 delta_ab / 3),
whose energy is (1/2) Q E), that is Im chi = nu omega, and it is the low-frequency absorption probability of a
quadrupole graviton, (256/225) (G M omega / c^3)^6 (Page 1976): |B|^2 = (16/5) G nu omega^6 / c^5. The quadrupole
also fluctuates: in the state of a hole formed by collapse, <Q_ab(t) Q_cd(0)> = <a,b|c,d> int (d omega / 2 pi) e^(-i
omega t) A(omega), with A = hbar r_s^5 / (360 pi G) at low frequency (Goldberger and Rothstein 2020), a number they
obtained by dividing Page's absorption by hbar omega / k T_H. So A = 2 k T nu at the Hawking temperature T = hbar
c^3 / (8 pi G M k) holds by construction once Poisson's friction and Page's absorption agree, which is the content;
the thermometer of Eq. (thermometer) reads that temperature from the near field. Valid for omega << c / r_s, at
leading order in r_s omega / c (the numerical absorption of bhmodes.py is 7 per cent above Page's limit at G M
omega / c^3 = 0.01).

Push and weigh. An impulsive tide of potential -eps g(x) delta(t), g harmonic (it is made by masses outside), kicks
every mass by eps m grad g where it stands. For H = sum p^2 / 2m + V(x) the energy gained is, exactly,

    Delta H = eps dQ_g/dt + (eps^2 / 2) int rho |grad g|^2 dV,        dQ_g/dt = sum_a p_a . grad g(x_a),

the series stopping at the second order (quantum mechanically the same, with U = exp(i eps Q_g / hbar): U^+ H U - H).
Energy weighs: the body's mass, read from the monopole of its field outside, rises by Delta H / c^2. So a push each
way and two weighings give int rho |grad g|^2 dV, the push's even part, and dQ_g/dt, its odd part; by polarization
the first gives the two-look form int rho grad g . grad g' dV, and so the density; and the second, the positions
once known, gives every momentum, because the gradients of harmonic functions at N distinct points span all of R^3N
(if sum_a w_a . grad g(x_a) = 0 for every g = 1 / |x - y|, y outside, the field of the dipoles w_a vanishes outside
and so everywhere, and each w_a = 0). The whole state is read from one number, the weight, by acting from outside.
Said as algebra: a function of the state whose Poisson bracket with every Q_h vanishes does not depend on the
momenta, and if its bracket with H vanishes too it is a constant. In electromagnetism the number read by Gauss's law
is the charge, which a push does not change. A black hole pushed slowly gains nu int Edot^2 dt, which is its mass
again. The pairs h_+- depend on two directions only, xi and eta, so each is the profile of a plane-fronted wave
travelling along xi x eta, and what it reads is the Fourier transform, at xi, of the density summed along the wave's
path: a projection, as in tomography.

What gravity cannot decohere. A superposition of two arrangements of mass with the same field outside gives the
field no record of which; Penrose's and Diosi's measure of it, the gravitational self-energy of the difference,
(G/2) int int d rho d rho' / |x - x'| = (1 / 8 pi G) int |g_1 - g_2|^2 dV, does not vanish: for a ball and a shell of
mass M and radius R it is G M^2 / (10 R) (the numerical factor in front is a matter of convention).

Tested in tests/test_hair.py.
"""
from __future__ import annotations

import math

import numpy as np

from .constants import G, c, hbar, kB

# --- two looks -----------------------------------------------------------------------------------------------------


def calderon_vectors(xi) -> tuple[np.ndarray, np.ndarray]:
    """The complex null vectors zeta_+- = (i xi +- eta) / 2, with eta perpendicular to xi and as long, so that
    zeta . zeta = 0 and exp(zeta . x) is harmonic; zeta_+ + zeta_- = i xi."""
    xi = np.asarray(xi, dtype=float)
    k = np.linalg.norm(xi)
    trial = np.array([1.0, 0.0, 0.0]) if abs(xi[0]) < 0.9 * k else np.array([0.0, 1.0, 0.0])
    eta = np.cross(xi, trial)
    eta *= k / np.linalg.norm(eta)
    return (1j * xi + eta) / 2, (1j * xi - eta) / 2


def calderon_gradients(points, xi) -> tuple[np.ndarray, np.ndarray]:
    """grad h_+ and grad h_- at the points (N, 3), for h_+- = exp(zeta_+- . x)."""
    p = np.asarray(points, dtype=float)
    zp, zm = calderon_vectors(xi)
    return np.exp(p @ zp)[:, None] * zp, np.exp(p @ zm)[:, None] * zm


def bilinear(masses, grad_h, grad_g) -> complex:
    """sum_a m_a grad h(x_a) . grad g(x_a): the commutator [Q_h, dQ_g/dt] / (i hbar), the tremor <dQ_h/dt dQ_g/dt> /
    kT, and minus omega^2 times the response of dust."""
    return np.sum(np.asarray(masses)[:, None] * np.asarray(grad_h) * np.asarray(grad_g))


def fourier_from_two_looks(points, masses, xi) -> complex:
    """rho~(xi) = sum_a m_a exp(i xi . x_a), recovered from the two-look datum for the pair h_+, h_-."""
    gp, gm = calderon_gradients(points, xi)
    k2 = float(np.dot(xi, xi))
    return -2.0 / k2 * bilinear(masses, gp, gm)


def growth(xi, a: float) -> float:
    """How large each exponential harmonic function becomes at the edge of a body of radius a: exp(|xi| a / 2)."""
    return math.exp(np.linalg.norm(xi) * a / 2)


def ball_form_factor(M: float, R: float, k: float) -> float:
    """rho~ of a uniform ball about its centre: 3 M (sin kR - kR cos kR) / (kR)^3."""
    x = k * R
    return 3 * M * (math.sin(x) - x * math.cos(x)) / x**3


def shell_form_factor(M: float, R: float, k: float) -> float:
    """rho~ of a thin shell about its centre: M sin(kR) / (kR)."""
    return M * math.sin(k * R) / (k * R)


def response(w2, c_h, c_g, omega: float) -> float:
    """chi_hg(omega) of a harmonic solid from its normal modes (response.normal_modes, multipole_couplings): the
    moment Q_h per unit of a push on Q_g, sum_n c_h c_g / (omega_n^2 - omega^2). The free motions of the body as a
    whole (omega_n = 0) are part of it."""
    return float(np.sum(np.asarray(c_h) * np.asarray(c_g) / (np.asarray(w2) - omega**2)))


def dust_response(masses, grad_h, grad_g, omega: float) -> float:
    """The same for free particles: -(1 / omega^2) sum_a m_a grad h . grad g."""
    return -float(np.real(bilinear(masses, grad_h, grad_g))) / omega**2


# --- how much ------------------------------------------------------------------------------------------------------


def hair_bits(snr: float, ratio: float, l_max: int | None = None) -> float:
    """Bits in the multipoles of a body of radius a read on a sphere of radius R_c = ratio * a, the monopole at
    signal-to-noise ratio snr: sum_l (2l + 1) (1/2) log2(1 + snr^2 ratio^(-2l))."""
    L, lam = math.log(snr), math.log(ratio)
    if l_max is None:
        l_max = int(L / lam) + 60
    ell = np.arange(0, l_max + 1)
    s = L - ell * lam
    return float(np.sum((2 * ell + 1) * np.logaddexp(0.0, 2 * s)) / (2 * math.log(2)))


def hair_bits_closed(snr: float, ratio: float) -> float:
    """The leading two orders: [L^3 / (3 Lam^2) + L^2 / (2 Lam)] / ln 2."""
    L, lam = math.log(snr), math.log(ratio)
    return (L**3 / (3 * lam**2) + L**2 / (2 * lam)) / math.log(2)


BLACK_HOLE_NUMBERS = 7      # mass, position, spin


def black_hole_bits(snr: float) -> float:
    """A black hole's whole exterior field is fixed by seven numbers: at most 7 log2 snr bits."""
    return BLACK_HOLE_NUMBERS * math.log2(snr)


# --- a black hole --------------------------------------------------------------------------------------------------


def schwarzschild_radius(M: float) -> float:
    return 2 * G * M / c**2


def hawking_temperature(M: float) -> float:
    return hbar * c**3 / (8 * math.pi * G * M * kB)


def horizon_friction(M: float) -> float:
    """nu in dE/dt = nu <Edot_ab Edot_ab> for a hole in a slowly changing tide (Poisson 2004): (16/45) G^5 M^6 /
    c^13, in kg m^2 s^3. The response of its quadrupole to the tide has Im chi = nu omega and no real part."""
    return 16 * G**5 * M**6 / (45 * c**13)


def quadrupole_absorption(M: float, omega: float) -> float:
    """Probability that a hole absorbs a quadrupole graviton of low frequency (Page 1976): (256/225) (G M omega /
    c^3)^6, which is (4/225) (r_s omega / c)^6."""
    return 256.0 / 225.0 * (G * M * omega / c**3) ** 6


def absorption_from_friction(M: float, omega: float) -> float:
    """The same from the friction, through the coupling -Q_ab E_ab of the hole to the tide and the amplitude of
    one graviton's tide (Goldberger and Rothstein 2020, Eq. A.9): (16/5) G nu omega^6 / c^5."""
    return 16 * G * horizon_friction(M) * omega**6 / (5 * c**5)


def quadrupole_noise(M: float) -> float:
    """A(omega -> 0) in <Q_ab(t) Q_cd(0)> = <a,b|c,d> int (d omega / 2 pi) e^(-i omega t) A(omega), for a hole
    formed by collapse (Goldberger and Rothstein 2020, Eq. 2.7): hbar r_s^5 / (360 pi G), in kg^2 m^4 s."""
    return hbar * schwarzschild_radius(M) ** 5 / (360 * math.pi * G)


def thermometer_of_a_hole(M: float) -> float:
    """The temperature read from the hole's near field by Eq. (thermometer), T = omega S / (2 k Im chi), with the
    noise and the friction above: A / (2 k nu)."""
    return quadrupole_noise(M) / (2 * kB * horizon_friction(M))


def axis_tide_of_quadrupole(Q_zz: float, r: float) -> float:
    """Size of the tide E_zz at distance r along the z axis from a quadrupole Q_zz in the convention of this section
    (energy Q_ab E_ab in a tide, half the Newtonian moment): 36 G Q_zz / r^5. For the Newtonian moment it is 18."""
    return 36 * G * Q_zz / r**5


def hole_tide_noise(M: float, r: float) -> float:
    """Root spectral density (s^-2 Hz^-1/2) of the tide along the line to a hole at distance r, from the tremor of
    its quadrupole: E_zz = 36 G Q_zz / r^5 on the axis, and <Q_zz Q_zz> carries <z,z|z,z> = 2/3."""
    return axis_tide_of_quadrupole(math.sqrt(2.0 / 3.0 * quadrupole_noise(M)), r)


# --- push and weigh ------------------------------------------------------------------------------------------------


def push(momenta, masses, grad_g, eps: float) -> np.ndarray:
    """The momenta after an impulsive tide of potential -eps g delta(t): p_a + eps m_a grad g(x_a)."""
    return np.asarray(momenta, dtype=float) + eps * np.asarray(masses)[:, None] * np.asarray(grad_g)


def energy_gained(masses, momenta, grad_g, eps: float) -> float:
    """What the push adds to the energy, exactly: eps sum p . grad g + (eps^2 / 2) sum m |grad g|^2. The potential
    energy does not come in, the masses not having moved."""
    grad_g = np.asarray(grad_g)
    return float(eps * np.sum(np.asarray(momenta) * grad_g)
                 + eps**2 / 2 * np.sum(np.asarray(masses)[:, None] * grad_g**2))


def weight_gained(masses, momenta, grad_g, eps: float) -> float:
    """The same as mass, as the monopole of the field outside reads it: Delta H / c^2."""
    return energy_gained(masses, momenta, grad_g, eps) / c**2


def body(points, masses, momenta):
    """A body as the outside meets it in this protocol: a function weigh(grad, eps) that takes a harmonic potential
    (as the function giving its gradient at any points) and a strength, and returns the energy gained from that push.
    The points, masses and momenta are not otherwise visible."""
    points, masses, momenta = (np.asarray(a, dtype=float) for a in (points, masses, momenta))

    def weigh(grad, eps: float) -> float:
        after = push(momenta, masses, grad(points), eps)
        return float(np.sum(after**2 / (2 * masses[:, None])) - np.sum(momenta**2 / (2 * masses[:, None])))

    return weigh


def form_from_weighings(weigh, grad_a, grad_b, eps: float = 1.0) -> float:
    """int rho grad a . grad b dV for two real harmonic functions, from four weighings: pushes with a + b and with
    a - b, each way. A push each way cancels the term in the body's own motion."""
    def square(grad) -> float:                       # int rho |grad g|^2
        return (weigh(grad, eps) + weigh(grad, -eps)) / eps**2
    return (square(lambda x: grad_a(x) + grad_b(x)) - square(lambda x: grad_a(x) - grad_b(x))) / 4


def rate_from_weighings(weigh, grad, eps: float = 1.0) -> float:
    """dQ_g/dt = sum p . grad g, from the odd part of a push each way."""
    return (weigh(grad, eps) - weigh(grad, -eps)) / (2 * eps)


def density_from_weighings(weigh, xi, eps: float = 1.0) -> complex:
    """rho~(xi) from sixteen weighings: the real and imaginary parts of h_+ and h_- are four real harmonic
    functions, and int rho grad h_+ . grad h_- is four of their forms."""
    xi = np.asarray(xi, dtype=float)
    u1 = lambda x: calderon_gradients(x, xi)[0].real
    u2 = lambda x: calderon_gradients(x, xi)[0].imag
    u3 = lambda x: calderon_gradients(x, xi)[1].real
    u4 = lambda x: calderon_gradients(x, xi)[1].imag
    form = lambda a, b: form_from_weighings(weigh, a, b, eps)
    b = form(u1, u3) - form(u2, u4) + 1j * (form(u1, u4) + form(u2, u3))
    return -2.0 / float(xi @ xi) * b


def source_gradients(sources):
    """The tides of unit masses at the given places outside the body, as functions giving grad (1 / |x - y|) at
    any points: one harmonic potential for each source."""
    sources = np.asarray(sources, dtype=float)

    def one(y):
        def grad(x):
            d = np.asarray(x, dtype=float) - y
            return -d / np.linalg.norm(d, axis=1)[:, None] ** 3
        return grad

    return [one(y) for y in sources]


def gradient_matrix(points, grads) -> np.ndarray:
    """Row k: grad g_k at every point, flattened to 3N numbers. Its rank is 3N for enough potentials: the gradients
    of harmonic functions at N distinct points span everything."""
    return np.stack([g(np.asarray(points, dtype=float)).ravel() for g in grads])


def momenta_from_weighings(weigh, points, grads, eps: float = 1.0) -> np.ndarray:
    """Every momentum, from the odd parts of pushes by the given potentials, the positions being known (they come
    first, from the even parts)."""
    rates = np.array([rate_from_weighings(weigh, g, eps) for g in grads])
    p, *_ = np.linalg.lstsq(gradient_matrix(points, grads), rates, rcond=None)
    return p.reshape(-1, 3)


def wave_direction(xi) -> np.ndarray:
    """The direction xi x eta along which the pair h_+- does not vary: that of the plane-fronted wave whose
    profiles they are."""
    zp, _ = calderon_vectors(xi)
    n = np.cross(np.asarray(xi, dtype=float), 2 * zp.real)
    return n / np.linalg.norm(n)


def pulse_energy(m, K, force, tau: float, steps_per_tau: int = 400, span: float = 8.0) -> float:
    """Energy given to a harmonic solid (masses m, one per coordinate, stiffness K, about equilibrium) by the force
    pattern `force` (one per coordinate) applied with the time profile of a unit-area Gaussian of width tau, by direct
    integration. As tau -> 0 it tends to sum force^2 / 2m, whatever the springs."""
    m = np.asarray(m, dtype=float)
    u, v = np.zeros_like(m), np.zeros_like(m)
    dt = tau / steps_per_tau
    f = lambda t: math.exp(-t**2 / (2 * tau**2)) / (tau * math.sqrt(2 * math.pi))
    t = -span * tau
    acc = (force * f(t) - K @ u) / m
    while t < span * tau:
        v += 0.5 * dt * acc
        u += dt * v
        t += dt
        acc = (force * f(t) - K @ u) / m
        v += 0.5 * dt * acc
    return float(0.5 * np.sum(m * v**2) + 0.5 * u @ K @ u)


# --- what gravity cannot decohere -----------------------------------------------------------------------------------


def difference_energy(g1, g2, r_max: float, n: int = 200001) -> float:
    """(1 / 8 pi G) int |g_1 - g_2|^2 dV for two spherical arrangements with radial fields g_1(r), g_2(r)."""
    r = np.linspace(0.0, r_max, n)
    f = (g1(r) - g2(r)) ** 2 * r**2 / (2 * G)          # 4 pi r^2 / (8 pi G)
    return float(np.sum((f[1:] + f[:-1]) * np.diff(r)) / 2)


def ball_shell_energy(M: float, R: float) -> float:
    """The same for a uniform ball and a thin shell of mass M and radius R: G M^2 / (10 R)."""
    return G * M**2 / (10 * R)


def breathing_energy(M: float, R: float, delta: float) -> float:
    """The same for a uniform ball at radius R and at radius R + delta, delta << R: (9/10) (delta/R)^2 G M^2 / R."""
    return 0.9 * (delta / R) ** 2 * G * M**2 / R
