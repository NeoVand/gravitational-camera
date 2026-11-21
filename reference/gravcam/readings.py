"""Two readings of one scene, and what a push of each kind can reach (design/SYNTHESIS.md, Sections 1.1, 1.2 b, 1.3,
1.7 and 10.2).

The first reading of a scene is its field outside at one time: the harmonic moments Q_h = sum_a m_a h(x_a)
(nullspace.py). The second is a bracket (hair.py), a push with one harmonic function read with another:

    B(h, g) = {Q_h, dQ_g/dt} = sum_a m_a grad h(x_a) . grad g(x_a).

On a flat camera. The camera is the plane z = 0, the scene lies in z > 0 and the pushes are made from the camera's
side, so the harmonic functions are h_k = exp(i k . a - |k| z), with k a vector in the plane, a the place across it
and z the depth. Write the scene's transform, Fourier across and Laplace in depth, as

    rho~(K, kap) = sum_a m_a exp(i K . a_a - kap z_a).

Then

    first reading:     Q(k)     = sum_a m_a h_k                   = rho~(k, |k|)                     (on the cone),
    second reading:    B(k, k') = sum_a m_a grad h_k . grad h_k'  = (1/2) (kap^2 - K^2) rho~(K, kap),
                       K = k + k',   kap = |k| + |k'| >= |K|                                         (inside it).

kap^2 - K^2 is the symbol of the Laplacian. The first reading sees the scene where the symbol vanishes, and its null
space, rho = Lap chi, is what the second reads. A point (K, kap) inside the cone is reached by every pair (k, K - k)
with k on the ellipse |k| + |K - k| = kap, whose foci are 0 and K: the data are redundant, and the redundancy is a
check. With every pair of pushes weighted alike, the Fisher metric of the second reading on the place of a point
mass at depth z, its mass unknown, is (28/3 (dx^2 + dy^2) + 8 dz^2) / (2z)^2 per unit signal-to-noise ratio squared:
hyperbolic (hyperbolic.py), with the ratio 7/6 of across to depth. In a ball a zonal quadrupole push read with
itself, h = z^2 - (x^2 + y^2) / 2, gives 2 int rho r^2 dV + 2 int rho r^2 P_2 dV: the first number that the
field outside does not hold, and a harmonic moment.

The ladder. How far a push reaches is set by its degree. Let the push h be a harmonic polynomial of degree at most
m and the readout g any harmonic polynomial, and keep the first reading. The density tests within reach, grad h .
grad g and the harmonic polynomials themselves, span at homogeneous degree d a space of dimension

    C(d + 2, 2) - C(d - 2m + 2, 2)        (the second term zero when d < 2m):

the polynomials P with Lap^m P = 0, no more. The reason is the identity

    Lap^m (grad h . grad g) = 2^m  d^(m+1) h : d^(m+1) g,

a full contraction of the two tensors of derivatives of order m + 1, which vanishes when either function has degree
m or less. So at every rung there are bodies that all pushes up to that degree read alike. The plainest pair: mass
M on a shell of radius R / sqrt 2, against M/2 at the centre and M/2 on a shell of radius R. They have the same
field outside and the same <r^2>; a quadrupole push reads them alike with any readout (M R^2 / 3 from both with
h_2 = Re[(x + iy)^2] / 2 read with itself); the octupole push h_3 = Re[(x + iy)^3] / 3 read with itself gives
2 M R^4 / 15 from the first and 4 M R^4 / 15 from the second.

On the null space. If two bodies have the same field outside and their potentials inside differ by chi = Phi_1 -
Phi_2, then

    B_1(h, g) - B_2(h, g) = (1 / 2 pi G) int chi (d_i d_j h) (d_i d_j g) dV:

the second reading reads the interior potential, weighted by the product of the two tides (the case m = 1 of the
identity). For a shell and a ball of mass M and radius R, chi = (G M / 2R) (1 - r^2 / R^2), and two quadrupoles
give 1/3 - 1/5 = 2/15 of M R^2 per unit of the product of their tides.

Flow. The bracket of two rates reads the flow, in Newton's theory:

    {dQ_h/dt, dQ_g/dt} = sum_a p_a . [(Hess h) grad g - (Hess g) grad h].

The paper's counter-rotating sphere (uniform, the inner ball of radius 2^(-1/5) R turning at +Omega and the rest at
-Omega) has no angular momentum and no magnetic tide outside. With h + i g = (x + iy)^3 / 3 the bracket is

    (32/35) (1 - 2^(-2/5)) M Omega R^4.

Once energy has weight the moments themselves do not commute. For the moments of the energy density of free
particles, Q_h = (1/c^2) sum_a E_a h(x_a) with E = sqrt(m^2 c^4 + p^2 c^2),

    {Q_h, Q_g} = (1/c^2) sum_a (E_a / c^2) v_a . (g grad h - h grad g) = (1/c^2) sum_a p_a . (g grad h - h grad g),

at any speed; in Newton's theory it is zero. For the quadrupoles h = x^2 - y^2, g = 2xy it is -(2/c^2) int (x^2 +
y^2) l_z dV, the angular momentum weighted by the square of the distance from the axis, and for the same sphere
(16/35) (1 - 2^(-2/5)) M Omega R^4 / c^2.

Shocks (units c = 1). The impulsive wave ds^2 = -du dv + H(x, y) delta(u) du^2 + dx^2 + dy^2, u = t - z, v = t + z,
solves the vacuum equations when H is harmonic across its front. A particle that crosses the wave of profile lam H
keeps q = E - p_z, and its transverse momentum jumps by (lam / 2) q grad H, taken where it meets the front. For
lam = 1 it gains the energy

    Delta E = (1/2) p_perp . grad H + (1/8) (E - p_z) |grad H|^2,

at any speed, light included (checked against geodesics through a narrow smooth wave). For a set of particles, with
Q = sum q, r = p_perp / q, G = grad H at each particle and the weights q / Q, the invariant mass afterwards is

    M^2(lam) = Q sum m^2 / q + Q^2 Var_q(r + lam G / 2),        M^2(+1) + M^2(-1) - 2 M^2(0) = Q^2 Var_q(G) / 2 >= 0:

the part that is even in the pulse is never negative, while one pulse alone can lower the mass. Two unit masses
flying apart with transverse momenta +-0.75 are stopped by H = -p (x^2 - y^2) / (E r), and their invariant mass
falls from 2.5 to 2.

The tidal lens. A tidal kick v -> v + A x (A symmetric and trace-free) and a drift for a time T take a free
particle to X_T = (1 + T A) x + T v, so the Fourier component of the density afterwards is

    sum_a m_a exp(i k . X_T) = f~((1 + T A) k, T k),        f~(K, P) = sum_a m_a exp(i (K . x_a + P . v_a)),

the transform of the distribution in the six dimensions of phase space. A saddle A of rank two, eigenvalues
(gamma, 0, -gamma), reaches any (K, P) with P not zero; the weakest has gamma = |K - P/T| / |P|. One fixed quadrupole
is enough: with Q = (x^2 - y^2) / 2 fired with either sign at chosen times, free drift H = |v|^2 / 2 between, and
the one readout h_n = Re[(1 + i) (3x + 4y + 5iz)^n] of each degree n, the readouts pulled back through all
sequences of kicks and drifts span every homogeneous polynomial of degree n in (x, v), C(n + 5, 5) of them. That
span is the smallest space that holds h_n and is closed under L_H f = {f, H} = v . d_x f and L_Q f = {f, Q} =
-(x d_vx - y d_vy) f. The axis on which the quadrupole exerts no force is reached because {{H, Q}, Q} = x^2 + y^2.

Tested in tests/test_readings.py.
"""
from __future__ import annotations

import math
from itertools import product

import numpy as np
from scipy.integrate import solve_ivp

from .constants import G, c
from .hair import bilinear
from .response import sphere_quadrature

# --- on a flat camera ----------------------------------------------------------------------------------------------


def plane_harmonic(k, points) -> np.ndarray:
    """h_k = exp(i k . a - |k| z) at the points (N, 3), each (a_x, a_y, z) with z the depth below the camera."""
    k = np.asarray(k, dtype=float)
    p = np.asarray(points, dtype=float)
    return np.exp(1j * (p[:, :2] @ k) - np.linalg.norm(k) * p[:, 2])


def plane_harmonic_gradient(k, points) -> np.ndarray:
    """grad h_k = (i k_x, i k_y, -|k|) h_k at the points."""
    k = np.asarray(k, dtype=float)
    return plane_harmonic(k, points)[:, None] * np.array([1j * k[0], 1j * k[1], -np.linalg.norm(k)])


def scene_transform(points, masses, K, kap: float) -> complex:
    """rho~(K, kap) = sum_a m_a exp(i K . a_a - kap z_a): Fourier across the camera, Laplace in depth."""
    p = np.asarray(points, dtype=float)
    return complex(np.sum(np.asarray(masses) * np.exp(1j * (p[:, :2] @ np.asarray(K, dtype=float)) - kap * p[:, 2])))


def first_reading(points, masses, k) -> complex:
    """Q(k) = sum_a m_a h_k(x_a), which is rho~(k, |k|): the scene on the cone."""
    return complex(np.sum(np.asarray(masses) * plane_harmonic(k, points)))


def second_reading(points, masses, k, kp) -> complex:
    """B(k, k') = sum_a m_a grad h_k . grad h_k', which is (1/2) (kap^2 - K^2) rho~(K, kap)."""
    return complex(bilinear(masses, plane_harmonic_gradient(k, points), plane_harmonic_gradient(kp, points)))


def cone_point(k, kp) -> tuple[np.ndarray, float]:
    """(K, kap) = (k + k', |k| + |k'|): where the pair of pushes k, k' reads the scene's transform."""
    k, kp = np.asarray(k, dtype=float), np.asarray(kp, dtype=float)
    return k + kp, float(np.linalg.norm(k) + np.linalg.norm(kp))


def laplacian_symbol(K, kap: float) -> float:
    """(1/2) (kap^2 - K^2): zero on the cone kap = |K|, positive inside it."""
    return 0.5 * (kap**2 - float(np.dot(K, K)))


def pair_on_the_ellipse(K, kap: float, t: float) -> tuple[np.ndarray, np.ndarray]:
    """The pair (k, K - k) with k at the angle t on the ellipse |k| + |K - k| = kap, whose foci are 0 and K. Every
    such pair reads the same point (K, kap) of the cone."""
    K = np.asarray(K, dtype=float)
    focus = np.linalg.norm(K) / 2
    e1 = K / (2 * focus) if focus > 0 else np.array([1.0, 0.0])
    e2 = np.array([-e1[1], e1[0]])
    major = kap / 2
    minor = math.sqrt(major**2 - focus**2)
    k = K / 2 + major * math.cos(t) * e1 + minor * math.sin(t) * e2
    return k, K - k


def transform_from_second_reading(points, masses, K, kap: float, t: float = 0.0) -> complex:
    """rho~(K, kap) at a point inside the cone, kap > |K|, from the second reading with one pair on its ellipse."""
    k, kp = pair_on_the_ellipse(K, kap, t)
    return second_reading(points, masses, k, kp) / laplacian_symbol(K, kap)


def second_reading_metric(z: float, n: int = 12) -> tuple[float, float]:
    """Fisher metric of the second reading on the place of a point mass at depth z, its mass unknown, per unit
    signal-to-noise ratio squared and with every pair of pushes weighted alike: the coefficients (across, depth) of
    dx^2 + dy^2 and of dz^2. The datum of the pair is m k k' (1 - cos t) exp(i K . a - kap z), t the angle between
    k and k', so the place enters through K across and through kap in depth, and the metric is the variance of
    each under the weight |datum|^2 d^2k d^2k': (28/3, 8) / (2z)^2."""
    x, w = np.polynomial.laguerre.laggauss(n)                       # weight exp(-x), x = 2 z k
    angles = 2 * math.pi * (np.arange(2 * n) + 0.5) / (2 * n)
    k, kq, t = np.meshgrid(x / (2 * z), x / (2 * z), angles, indexing="ij")
    weight = w[:, None, None] * w[None, :, None] * (k * kq) ** 3 * (1 - np.cos(t)) ** 2
    mean = lambda f: float(np.sum(weight * f) / np.sum(weight))
    across = 0.5 * mean(k**2 + kq**2 + 2 * k * kq * np.cos(t))      # <K_x^2>, half of <|K|^2>
    depth = mean((k + kq) ** 2) - mean(k + kq) ** 2                 # the variance of kap
    return across, depth


# --- harmonic polynomials: the powers of a null form ----------------------------------------------------------------


def random_null_vector(rng) -> np.ndarray:
    """A complex vector a = u + i v with u and v real, orthogonal and of unit length, so that a . a = 0 and every
    power of a . x is harmonic."""
    u = rng.normal(size=3)
    u /= np.linalg.norm(u)
    v = np.cross(u, rng.normal(size=3))
    v /= np.linalg.norm(v)
    return u + 1j * v


def power(a, n: int, points) -> np.ndarray:
    """(a . x)^n / n at the points (N, 3). For a null vector a its real and imaginary parts are two harmonic
    polynomials of degree n: with a = (1, i, 0) and n = 2 they are (x^2 - y^2) / 2 and xy."""
    return (np.asarray(points, dtype=float) @ np.asarray(a)) ** n / n


def power_gradient(a, n: int, points) -> np.ndarray:
    """The gradient of (a . x)^n / n at the points: (a . x)^(n-1) a, complex, (N, 3)."""
    a = np.asarray(a)
    return ((np.asarray(points, dtype=float) @ a) ** (n - 1))[:, None] * a


def power_hessian(a, n: int, points) -> np.ndarray:
    """The second derivatives of (a . x)^n / n at the points: (n - 1) (a . x)^(n-2) a a^T, complex, (N, 3, 3)."""
    a = np.asarray(a)
    if n < 2:
        return np.zeros((len(points), 3, 3), dtype=complex)
    return (n - 1) * ((np.asarray(points, dtype=float) @ a) ** (n - 2))[:, None, None] * np.outer(a, a)


# --- the ladder ----------------------------------------------------------------------------------------------------


def ladder_dimension(d: int, m: int) -> int:
    """Dimension, at homogeneous degree d, of the density tests within reach of pushes of degree at most m with any
    readout, the first reading kept: C(d + 2, 2) - C(d - 2m + 2, 2), the second term zero when d < 2m. These are the
    polynomials P of degree d with Lap^m P = 0."""
    return math.comb(d + 2, 2) - (math.comb(d - 2 * m + 2, 2) if d >= 2 * m else 0)


def ladder_span(d: int, m: int, points, rng, tries: int = 90) -> int:
    """The same dimension by rank. Polynomials are held as their values at the given points (more of them than
    C(d + 2, 2)); the first reading supplies Re and Im of (a . x)^d, and a push of degree l, 2 <= l <= m, with a
    readout of degree d + 2 - l supplies Re and Im of (a . b) (a . x)^(l-1) (b . x)^(d+1-l), for null vectors a
    and b drawn `tries` times, b with its conjugate (real pushes, real readouts). A push of degree one gives a
    harmonic polynomial again."""
    p = np.asarray(points, dtype=float)
    rows = []
    for _ in range(tries):
        f = (p @ random_null_vector(rng)) ** d
        rows += [f.real, f.imag]
    for l in range(2, m + 1):
        lp = d + 2 - l
        if lp < 1:
            continue
        for _ in range(tries):
            a, b = random_null_vector(rng), random_null_vector(rng)
            for bb in (b, b.conj()):
                f = (a @ bb) * (p @ a) ** (l - 1) * (p @ bb) ** (lp - 1)
                rows += [f.real, f.imag]
    A = np.array(rows)
    A /= np.linalg.norm(A, axis=1)[:, None]
    sv = np.linalg.svd(A, compute_uv=False)
    return int(np.sum(sv > 1e-9 * sv[0]))


# Polynomials with exact coefficients, held as {exponents: coefficient}, in any number of variables.


def poly_derivative(poly: dict, k: int) -> dict:
    """d/dx_k of a polynomial."""
    out: dict = {}
    for e, co in poly.items():
        if e[k]:
            f = e[:k] + (e[k] - 1,) + e[k + 1:]
            out[f] = out.get(f, 0) + co * e[k]
    return out


def poly_product(p: dict, q: dict) -> dict:
    out: dict = {}
    for e, a in p.items():
        for f, b in q.items():
            g = tuple(i + j for i, j in zip(e, f))
            out[g] = out.get(g, 0) + a * b
    return {e: co for e, co in out.items() if co}


def poly_sum(*polys: dict) -> dict:
    out: dict = {}
    for p in polys:
        for e, co in p.items():
            out[e] = out.get(e, 0) + co
    return {e: co for e, co in out.items() if co}


def poly_scaled(poly: dict, factor) -> dict:
    return {e: factor * co for e, co in poly.items() if factor * co}


def poly_laplacian(poly: dict, times: int = 1) -> dict:
    """Lap^times of a polynomial in (x, y, z)."""
    for _ in range(times):
        poly = poly_sum(*(poly_derivative(poly_derivative(poly, k), k) for k in range(3)))
    return poly


def poly_contraction(h: dict, g: dict, order: int) -> dict:
    """d^order h : d^order g, the full contraction of the two tensors of derivatives of that order; order 1 is
    grad h . grad g."""
    if order == 0:
        return poly_product(h, g)
    return poly_sum(*(poly_contraction(poly_derivative(h, k), poly_derivative(g, k), order - 1) for k in range(3)))


def harmonic_power(a, n: int) -> tuple[dict, dict]:
    """The real and imaginary parts of (a . x)^n as polynomials with whole coefficients, for a null vector a whose
    components are Gaussian integers, such as (1, i, 0) or (3, 4, 5i): two harmonic polynomials of degree n."""
    form = {e: complex(co) for e, co in zip(((1, 0, 0), (0, 1, 0), (0, 0, 1)), a) if co}
    out = {(0, 0, 0): 1 + 0j}
    for _ in range(n):
        out = poly_product(out, form)
    real = {e: round(co.real) for e, co in out.items() if round(co.real)}
    imag = {e: round(co.imag) for e, co in out.items() if round(co.imag)}
    return real, imag


# --- bodies made of shells -----------------------------------------------------------------------------------------


def shells_as_points(shells, n_mu: int = 24, n_phi: int = 48) -> tuple[np.ndarray, np.ndarray]:
    """Points and masses that stand for a body of thin uniform shells about the origin, given as (mass, radius)
    pairs: each shell is spread over the points of response.sphere_quadrature, so that sums over them are exact for
    polynomials of degree below 2 n_mu and below n_phi. A shell of radius zero is a mass at the centre."""
    dirs, w = sphere_quadrature(n_mu, n_phi)
    points = np.concatenate([radius * dirs for _, radius in shells])
    masses = np.concatenate([mass * w / (4 * math.pi) for mass, _ in shells])
    return points, masses


def uniform_layer(M: float, r_in: float, r_out: float, n: int = 12) -> list[tuple[float, float]]:
    """A layer of uniform density and mass M between the radii r_in and r_out (a ball when r_in = 0) as n thin
    shells, at the Gauss-Legendre points in the radius: exact for polynomials of degree below 2n - 2 in r."""
    x, w = np.polynomial.legendre.leggauss(n)
    r = 0.5 * (r_out + r_in) + 0.5 * (r_out - r_in) * x
    dm = 3 * M * 0.5 * (r_out - r_in) * w * r**2 / (r_out**3 - r_in**3)
    return list(zip(dm.tolist(), r.tolist()))


def ladder_pair(M: float = 1.0, R: float = 1.0) -> tuple[list, list]:
    """The plainest pair of bodies that no quadrupole push tells apart, each as (mass, radius) shells: mass M on a
    shell of radius R / sqrt 2, and M/2 at the centre with M/2 on a shell of radius R. An octupole push does."""
    return [(M, R / math.sqrt(2))], [(M / 2, 0.0), (M / 2, R)]


# --- on the null space ---------------------------------------------------------------------------------------------


def shell_ball_potential_difference(M: float, R: float, r):
    """chi = Phi_shell - Phi_ball for a thin shell and a uniform ball of mass M and radius R, which have the same
    field outside: (G M / 2R) (1 - r^2 / R^2) inside, zero outside."""
    r = np.asarray(r, dtype=float)
    return np.where(r < R, G * M / (2 * R) * (1 - r**2 / R**2), 0.0)


def null_space_form(chi, hess_h, hess_g, R: float, n_r: int = 12, n_mu: int = 24, n_phi: int = 48) -> complex:
    """(1 / 2 pi G) int chi (d_i d_j h) (d_i d_j g) dV over the ball of radius R, for chi a function of the radius
    alone and hess_h, hess_g the functions that give the second derivatives (N, 3, 3) at any points. It is the
    difference B_1(h, g) - B_2(h, g) of two bodies with the same field outside whose potentials differ by chi."""
    x, w = np.polynomial.legendre.leggauss(n_r)
    r = 0.5 * R * (x + 1)
    dirs, ws = sphere_quadrature(n_mu, n_phi)
    total = 0.0
    for ri, wi in zip(r, 0.5 * R * w):
        p = ri * dirs
        total += wi * ri**2 * chi(ri) * np.sum(ws * np.einsum("aij,aij->a", hess_h(p), hess_g(p)))
    return total / (2 * math.pi * G)


# --- flow ----------------------------------------------------------------------------------------------------------

INNER_RADIUS = 2.0 ** (-0.2)
"""Radius of the inner ball of the counter-rotating sphere, in units of the sphere's: it holds half the moment of
inertia."""


def rate_bracket(momenta, grad_h, hess_h, grad_g, hess_g) -> float:
    """{dQ_h/dt, dQ_g/dt} = sum_a p_a . [(Hess h) grad g - (Hess g) grad h], from the gradients (N, 3) and second
    derivatives (N, 3, 3) of the two harmonic functions at the particles. It is antisymmetric, and zero for matter
    at rest."""
    lie = np.einsum("aij,aj->ai", hess_h, grad_g) - np.einsum("aij,aj->ai", hess_g, grad_h)
    return float(np.sum(np.asarray(momenta) * lie))


def energy_moment(masses, momenta, h) -> float:
    """Q_h = (1/c^2) sum_a E_a h(x_a), E = sqrt(m^2 c^4 + p^2 c^2): a moment of the energy density of free
    particles, from the values h of the harmonic function at the particles. Q_1 is the energy over c^2."""
    energy = np.sqrt((np.asarray(masses) * c**2) ** 2 + np.sum(np.asarray(momenta) ** 2, axis=1) * c**2)
    return float(np.sum(energy * np.asarray(h)) / c**2)


def moment_bracket(momenta, h, grad_h, g, grad_g) -> float:
    """{Q_h, Q_g} = (1/c^2) sum_a p_a . (g grad h - h grad g) for the moments of the energy density of free
    particles, from the values and gradients of the two functions at the particles. Exact at any speed, since
    (E / c^2) v = p; for slow matter it is (1/c^2) int J . (g grad h - h grad g) dV with J the momentum density."""
    field = np.asarray(g)[:, None] * np.asarray(grad_h) - np.asarray(h)[:, None] * np.asarray(grad_g)
    return float(np.sum(np.asarray(momenta) * field)) / c**2


def weighted_spin(masses, points, velocities) -> float:
    """int (x^2 + y^2) l_z dV = sum_a m_a (x^2 + y^2) (x v_y - y v_x): the angular momentum about the z axis,
    weighted by the square of the distance from it."""
    p, v = np.asarray(points, dtype=float), np.asarray(velocities, dtype=float)
    return float(np.sum(np.asarray(masses) * (p[:, 0] ** 2 + p[:, 1] ** 2) * (p[:, 0] * v[:, 1] - p[:, 1] * v[:, 0])))


def counter_rotating_sphere(M: float, Omega: float, R: float, n_r: int = 8, n_mu: int = 12, n_phi: int = 24):
    """Points, masses and velocities that stand for the paper's counter-rotating sphere: uniform, of mass M and
    radius R, the inner ball of radius 2^(-1/5) R turning about the z axis at +Omega and the rest at -Omega. The
    points are those of uniform_layer and shells_as_points in each part, so sums over them are exact for
    polynomials (of degree below 2 n_r - 2 in the radius, below 2 n_mu and n_phi across it)."""
    a = INNER_RADIUS * R
    inner = shells_as_points(uniform_layer(M * (a / R) ** 3, 0.0, a, n_r), n_mu, n_phi)
    outer = shells_as_points(uniform_layer(M * (1 - (a / R) ** 3), a, R, n_r), n_mu, n_phi)
    points = np.concatenate([inner[0], outer[0]])
    masses = np.concatenate([inner[1], outer[1]])
    omega = np.concatenate([np.full(len(inner[1]), Omega), np.full(len(outer[1]), -Omega)])
    velocities = omega[:, None] * np.stack([-points[:, 1], points[:, 0], np.zeros(len(points))], axis=1)
    return points, masses, velocities


def hidden_spin_rate_bracket(M: float, Omega: float, R: float) -> float:
    """{dQ_h/dt, dQ_g/dt} of the counter-rotating sphere for h + i g = (x + iy)^3 / 3: (32/35) (1 - 2^(-2/5)) M
    Omega R^4."""
    return 32.0 / 35.0 * (1 - 2.0 ** (-0.4)) * M * Omega * R**4


def hidden_spin_moment_bracket(M: float, Omega: float, R: float) -> float:
    """{Q_h, Q_g} of the same sphere for the quadrupoles h = x^2 - y^2 and g = 2xy, to order 1/c^2: (16/35) (1 -
    2^(-2/5)) M Omega R^4 / c^2."""
    return 16.0 / 35.0 * (1 - 2.0 ** (-0.4)) * M * Omega * R**4 / c**2


# --- shocks (units c = 1) -------------------------------------------------------------------------------------------


def _null_energy(m, p_perp, p_z) -> np.ndarray:
    """q = E - p_z of each particle, which a wave travelling along +z leaves as it was."""
    m, p_perp, p_z = np.asarray(m, dtype=float), np.asarray(p_perp, dtype=float), np.asarray(p_z, dtype=float)
    return np.sqrt(m**2 + np.sum(p_perp**2, axis=1) + p_z**2) - p_z


def cross_shock(m, p_perp, p_z, grad_H, lam: float = 1.0) -> tuple[np.ndarray, np.ndarray]:
    """The momenta (p_perp, p_z) of particles of masses m after they cross an impulsive wave of profile lam H:
    q = E - p_z is kept, p_perp jumps by (lam / 2) q grad H (grad_H at each particle, (N, 2)), and E + p_z follows
    from the mass shell. Massless particles are allowed; a particle that travels with the wave (q = 0) is not."""
    m, p_perp, p_z = np.asarray(m, dtype=float), np.asarray(p_perp, dtype=float), np.asarray(p_z, dtype=float)
    q = _null_energy(m, p_perp, p_z)
    new = p_perp + 0.5 * lam * q[:, None] * np.asarray(grad_H)
    plus = (m**2 + np.sum(new**2, axis=1)) / q
    return new, 0.5 * (plus - q)


def shock_energy_gain(m, p_perp, p_z, grad_H) -> np.ndarray:
    """Energy gained by each particle on crossing the wave of profile H: (1/2) p_perp . grad H + (1/8) (E - p_z)
    |grad H|^2."""
    p_perp, grad_H = np.asarray(p_perp, dtype=float), np.asarray(grad_H, dtype=float)
    return 0.5 * np.sum(p_perp * grad_H, axis=1) + 0.125 * _null_energy(m, p_perp, p_z) * np.sum(grad_H**2, axis=1)


def invariant_mass_squared(m, p_perp, p_z) -> float:
    """(sum E)^2 - |sum p|^2 of a set of particles."""
    p_perp, p_z = np.asarray(p_perp, dtype=float), np.asarray(p_z, dtype=float)
    energy = np.sqrt(np.asarray(m) ** 2 + np.sum(p_perp**2, axis=1) + p_z**2)
    return float(np.sum(energy) ** 2 - np.sum(p_z) ** 2 - np.sum(np.sum(p_perp, axis=0) ** 2))


def _weighted_variance(weights, vectors) -> float:
    mean = np.sum(weights[:, None] * vectors, axis=0)
    return float(np.sum(weights * np.sum((vectors - mean) ** 2, axis=1)))


def mass_squared_after_shock(m, p_perp, p_z, grad_H, lam: float) -> float:
    """The invariant mass squared after the wave of profile lam H, in closed form: Q sum m^2 / q + Q^2 Var_q(r +
    lam G / 2), with q = E - p_z, Q = sum q, r = p_perp / q, G = grad H and the weights q / Q."""
    m, p_perp = np.asarray(m, dtype=float), np.asarray(p_perp, dtype=float)
    q = _null_energy(m, p_perp, p_z)
    Q = q.sum()
    r = p_perp / q[:, None] + 0.5 * lam * np.asarray(grad_H)
    return float(Q * np.sum(m**2 / q) + Q**2 * _weighted_variance(q / Q, r))


def shock_even_part(m, p_perp, p_z, grad_H) -> float:
    """M^2(+1) + M^2(-1) - 2 M^2(0) = Q^2 Var_q(grad H) / 2: what a pulse and its reverse add together, never
    negative."""
    q = _null_energy(m, p_perp, p_z)
    Q = q.sum()
    return 0.5 * Q**2 * _weighted_variance(q / Q, np.asarray(grad_H, dtype=float))


def stopping_profile_gradient(points, p: float, E: float, r: float) -> np.ndarray:
    """grad H at the points (N, 2) of the wave front for H = -p (x^2 - y^2) / (E r), which stops two particles of
    energy E at (+-r, 0) that fly apart along x with momenta +-p."""
    points = np.asarray(points, dtype=float)
    return np.stack([-2 * p * points[:, 0] / (E * r), 2 * p * points[:, 1] / (E * r)], axis=1)


def geodesic_energy_gain(momentum, mass: float, profile, profile_gradient, meet, width: float = 2e-3,
                         span: float = 12.0) -> float:
    """Energy gained by a particle of the given momentum (p_x, p_y, p_z) and mass in crossing the smooth wave

        ds^2 = -du dv + H(x, y) f(u) du^2 + dx^2 + dy^2,

    f a Gaussian of unit area and the given width, by integrating its geodesic,

        x_i'' = (1/2) d_i H f u'^2,     v'' = 2 (grad H . x') f u' + H f'(u) u'^2,     u' = E - p_z constant,

    from u = -span * width to u = +span * width. The path is aimed so that without the wave it would meet the front
    u = 0 at the place `meet`; E = (u' + v') / 2. As the width goes to zero it tends to shock_energy_gain there."""
    px, py, pz = momentum
    energy = math.sqrt(mass**2 + px**2 + py**2 + pz**2)
    q = energy - pz
    f = lambda u: math.exp(-u * u / (2 * width**2)) / (width * math.sqrt(2 * math.pi))
    u0 = -span * width

    def rhs(u, y):                                   # with u for the parameter: d/du = (1 / u') d/d lambda
        x, yy, xd, yd, _ = y
        hx, hy = profile_gradient(x, yy)
        pulse = f(u)
        return [xd / q, yd / q, 0.5 * hx * pulse * q, 0.5 * hy * pulse * q,
                2 * (hx * xd + hy * yd) * pulse - profile(x, yy) * u / width**2 * pulse * q]

    start = [meet[0] + px * u0 / q, meet[1] + py * u0 / q, px, py, energy + pz]
    sol = solve_ivp(rhs, (u0, -u0), start, method="DOP853", rtol=1e-10, atol=1e-13, max_step=width / 2)
    return 0.5 * (sol.y[4, -1] - (energy + pz))


# --- the tidal lens -------------------------------------------------------------------------------------------------


def kick_and_drift(points, velocities, A, T: float) -> np.ndarray:
    """Where free particles are a time T after the tidal kick v -> v + A x: X_T = (1 + T A) x + T v."""
    x, v = np.asarray(points, dtype=float), np.asarray(velocities, dtype=float)
    return x + T * (x @ np.asarray(A, dtype=float).T + v)


def density_transform(points, masses, k) -> complex:
    """sum_a m_a exp(i k . x_a): the Fourier component of the density at k."""
    return complex(np.sum(np.asarray(masses) * np.exp(1j * (np.asarray(points, dtype=float) @ np.asarray(k)))))


def phase_space_transform(points, velocities, masses, K, P) -> complex:
    """f~(K, P) = sum_a m_a exp(i (K . x_a + P . v_a)): the transform of the distribution in phase space."""
    phase = np.asarray(points, dtype=float) @ np.asarray(K) + np.asarray(velocities, dtype=float) @ np.asarray(P)
    return complex(np.sum(np.asarray(masses) * np.exp(1j * phase)))


def saddle_reaching(K, P, T: float) -> np.ndarray:
    """The weakest tidal kick A, symmetric, trace-free and of rank two, after which the density at k = P / T a time
    T later is f~(K, P): (1 + T A) k = K. Its eigenvalues are (gamma, 0, -gamma) with gamma = |K - P/T| / |P|; in
    the plane of k and K - k it is gamma times the reflection that carries the direction of k to that of K - k. P
    must not be zero; for K = P / T no kick is needed and A = 0."""
    K, P = np.asarray(K, dtype=float), np.asarray(P, dtype=float)
    k = P / T
    d = (K - k) / T                                   # what A must make of k
    size_k, size_d = np.linalg.norm(k), np.linalg.norm(d)
    if size_k == 0:
        raise ValueError("P must not be zero: the density a time T later holds no component at k = 0 but the mass")
    if size_d == 0:
        return np.zeros((3, 3))
    a, b = k / size_k, d / size_d
    cos = float(a @ b)
    if 1 - cos**2 < 1e-12:                            # d along k: any saddle with k for an axis
        trial = np.array([1.0, 0.0, 0.0]) if abs(a[0]) < 0.9 else np.array([0.0, 1.0, 0.0])
        e = np.cross(a, trial)
        e /= np.linalg.norm(e)
        return math.copysign(size_d / size_k, cos) * (np.outer(a, a) - np.outer(e, e))
    swap = (np.outer(a, b) + np.outer(b, a) - cos * (np.outer(a, a) + np.outer(b, b))) / (1 - cos**2)
    return size_d / size_k * swap


RANK_PRIME = 1009
"""The rank of the fixed quadrupole's orbit is taken modulo this prime, which can only undercount."""


def saddle_readout(n: int) -> dict:
    """The one readout of degree n, h_n = Re[(1 + i) (3x + 4y + 5iz)^n], as a polynomial with whole coefficients in
    (x, y, z, v_x, v_y, v_z). It is harmonic: (3, 4, 5i) is a null vector."""
    out = {}
    for a in range(n + 1):
        for b in range(n + 1 - a):
            k = n - a - b
            size = math.factorial(n) // (math.factorial(a) * math.factorial(b) * math.factorial(k)) * 3**a * 4**b * 5**k
            re, im = [(1, 0), (0, 1), (-1, 0), (0, -1)][k % 4]            # i^k
            if re - im:
                out[(a, b, k, 0, 0, 0)] = size * (re - im)                 # Re[(1 + i)(re + i im)]
    return out


def drift_derivation(poly: dict) -> dict:
    """L_H f = {f, H} = v . d_x f for H = |v|^2 / 2: what free drift does to a function on phase space."""
    out: dict = {}
    for k in range(3):
        for e, co in poly_derivative(poly, k).items():
            f = e[:3 + k] + (e[3 + k] + 1,) + e[4 + k:]
            out[f] = out.get(f, 0) + co
    return out


def kick_derivation(poly: dict) -> dict:
    """L_Q f = {f, Q} = -(x d_vx - y d_vy) f for the fixed quadrupole Q = (x^2 - y^2) / 2."""
    out: dict = {}
    for k, sign in ((0, -1), (1, +1)):
        for e, co in poly_derivative(poly, 3 + k).items():
            f = e[:k] + (e[k] + 1,) + e[k + 1:]
            out[f] = out.get(f, 0) + sign * co
    return out


def orbit_rank(n: int) -> tuple[int, int]:
    """Rank, modulo RANK_PRIME, of the smallest space of polynomials that holds saddle_readout(n) and is closed
    under drift_derivation and kick_derivation, and the dimension C(n + 5, 5) of all homogeneous polynomials of
    degree n in (x, v). Exact arithmetic in whole numbers; the two are equal when one fixed quadrupole and one
    readout determine every moment of degree n of freely streaming matter."""
    index = {e: i for i, e in enumerate(e for e in product(range(n + 1), repeat=6) if sum(e) == n)}
    dim = len(index)
    basis: list[tuple[int, list[int]]] = []           # reduced rows modulo the prime, each with its pivot column

    def reduced(poly: dict) -> list[int]:
        vec = [0] * dim
        for e, co in poly.items():
            vec[index[e]] = co % RANK_PRIME
        for pivot, row in basis:
            if vec[pivot]:
                factor = vec[pivot]
                vec = [(a - factor * b) % RANK_PRIME for a, b in zip(vec, row)]
        return vec

    queue = [saddle_readout(n)]
    while queue and len(basis) < dim:
        poly = queue.pop()
        vec = reduced(poly)
        pivot = next((i for i, a in enumerate(vec) if a), None)
        if pivot is None:
            continue
        inverse = pow(vec[pivot], RANK_PRIME - 2, RANK_PRIME)
        basis.append((pivot, [(a * inverse) % RANK_PRIME for a in vec]))
        queue += [drift_derivation(poly), kick_derivation(poly)]
    return len(basis), dim
