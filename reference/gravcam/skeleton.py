"""The skeleton of a scene: the lines where two eigenvalues of a reading meet, and what a walk around one of them
does (design/SYNTHESIS.md, Sections 3.4 and 10.3).

In three dimensions the places where two eigenvalues of W = E + iB meet are lines: of Petrov type D in a static
scene, where W is real, and of type II in a moving one.

Two masses. With n_a the unit vector from the mass a to the place and mu_a = G m_a / r_a^3 its tidal strength there,

    E = (mu_1 + mu_2) 1 - 3 (mu_1 n_1 n_1^T + mu_2 n_2 n_2^T).

Across the plane of n_1 and n_2 the eigenvalue is mu_1 + mu_2, and in that plane the two eigenvalues are

    -(1/2) (mu_1 + mu_2) -+ (3/2) sqrt((mu_1 - mu_2)^2 + 4 mu_1 mu_2 (n_1 . n_2)^2).

So off the axis two eigenvalues meet exactly where the two masses are seen at right angles, which is the sphere
that has them at the ends of a diameter, and their tides are equally strong:

    n_1 . n_2 = 0,        m_1 / r_1^3 = m_2 / r_2^3.

By symmetry that is one circle about the axis. For equal masses a distance d apart it is the circle of diameter d
on the plane midway between them. Seen from the centre of mass its polar angle does not depend on the separation.
A ring of this kind was found numerically in initial data for two black holes (Rosato, Nakano and Lousto, Phys.
Rev. D 104, 044047 (2021); lengths in units of the total mass m): for equal masses 10 m apart at 5.05 m, where the
law gives 5.00; for masses 1:3 at the polar angle 19 pi / 15 = 228.0 degrees whatever the separation, where it
gives 227.75, and at a radius they quote as 4.6 m and as 4.9 m for a separation of 7 m, where it gives 4.43.

The four directions. The principal null directions of W are the roots of the quartic m(zeta)^T W m(zeta), with
m(zeta) = (1 - zeta^2, i (1 + zeta^2), -2 zeta) (pixel.py). Its coefficients, from zeta^4 down, are

    W_xx - W_yy - 2i W_xy,    4 (W_xz - i W_yz),    6 W_zz,    -4 (W_xz + i W_yz),    W_xx - W_yy + 2i W_xy

(W trace-free): the last is the in-plane shear of shearzeros.py, so that shear vanishes where a direction is normal
to the plane.

What a loop does depends on the kind of line. Around a line of type D in a static scene the eigenvalues return in
place, the two eigenvectors of the pair that meets there come back reversed, and the four directions are exchanged
in two pairs. Around a line of type II two eigenvalues are exchanged, and two of the directions. So the
eigenvalues see only the lines of type II, and the four directions see both kinds.

Two explicit fields. W = Hess F with F a complex harmonic function is a stationary field in vacuum, in the weak
field; write w = x + iy.

  (i)  F = x z + w^3 / 6. Then det(lam - W) = lam^3 - lam - w and m^T W m = 4 zeta (w zeta^3 + zeta^2 - 1): one
       direction stays at zeta = 0 and the other three are zeta = 1 / lam. Two eigenvalues meet on the lines w =
       +-2 / (3 sqrt 3). Loops around the two lines exchange different pairs, so the two loops do not commute.
  (ii) W = A - w v v^T / 4 with v = (1, i, 0), the Hessian of x^T A x / 2 - w^3 / 24. Then m^T W m = 1 - zeta^3 -
       w zeta^4, so the four directions solve r^4 - r = w with r = 1 / zeta, and two of them meet on the three
       lines w = -(3/4) r with 4 r^3 = 1. Loops around the three lines generate every permutation of the four,
       all 24. The eigenvalues, y = 4 lam, solve y^3 + 4 w y - 1 = 0, the resolvent cubic whose roots are the
       three ways r_i r_j + r_k r_l of pairing the four, and so see only six: S_4 over the four-group.

Roots are followed along a path by nearest matching in small steps.

Tested in tests/test_skeleton.py.
"""
from __future__ import annotations

import math

import numpy as np

from .constants import G
from .response import tidal_of_points

# --- two masses ------------------------------------------------------------------------------------------------------


def pair_on_axis(m1: float, m2: float, d: float) -> np.ndarray:
    """The places of two masses a distance d apart on the z axis, the first above, with the centre of mass at the
    origin: (2, 3)."""
    M = m1 + m2
    return np.array([[0.0, 0.0, d * m2 / M], [0.0, 0.0, -d * m1 / M]])


def eigenvalue_gap(x, points, masses) -> float:
    """The smaller of the two gaps between neighbouring eigenvalues of the tide at x of the given point masses."""
    w = np.linalg.eigvalsh(tidal_of_points(np.asarray(x, dtype=float), np.asarray(points, dtype=float), masses))
    return float(min(w[1] - w[0], w[2] - w[1]))


def pair_eigenvalues(x, points, masses) -> np.ndarray:
    """The three eigenvalues, ascending, of the tide of two masses at x, in closed form: -(1/2) (mu_1 + mu_2) -+
    (3/2) sqrt((mu_1 - mu_2)^2 + 4 mu_1 mu_2 (n_1 . n_2)^2) in the plane of the two lines of sight, and mu_1 + mu_2
    across it."""
    x = np.asarray(x, dtype=float)
    (mu1, n1), (mu2, n2) = (_strength(x, p, m) for p, m in zip(np.asarray(points, dtype=float), masses))
    root = math.sqrt((mu1 - mu2) ** 2 + 4 * mu1 * mu2 * float(n1 @ n2) ** 2)
    return np.array([-0.5 * (mu1 + mu2) - 1.5 * root, -0.5 * (mu1 + mu2) + 1.5 * root, mu1 + mu2])


def _strength(x, p, m) -> tuple[float, np.ndarray]:
    """mu = G m / r^3 and the unit vector n from the mass at p to the place x."""
    r = float(np.linalg.norm(x - p))
    return G * m / r**3, (x - p) / r


def degenerate_circle(m1: float, m2: float, d: float) -> tuple[float, float]:
    """(rho, z) of the circle on which the tide of two masses has two equal eigenvalues: its radius about the axis
    and its height, for the masses placed as in pair_on_axis. There r_1^2 + r_2^2 = d^2 (the right angle) and
    r_1 / r_2 = (m_1 / m_2)^(1/3) (equal tides)."""
    (_, _, z1), (_, _, z2) = pair_on_axis(m1, m2, d)
    ratio = (m1 / m2) ** (1.0 / 3.0)
    r2 = d / math.sqrt(1 + ratio**2)
    r1 = ratio * r2
    z = (r2**2 - r1**2 + z1**2 - z2**2) / (2 * (z1 - z2))
    return math.sqrt(r1**2 - (z - z1) ** 2), z


def circle_polar_angle(m1: float, m2: float) -> float:
    """The angle (radians) from the axis, on the side of the first mass, at which the circle is seen from the
    centre of mass. It does not depend on the separation."""
    rho, z = degenerate_circle(m1, m2, 1.0)
    return math.atan2(rho, z)


def tides_at(places, points, masses) -> np.ndarray:
    """The tide E_ij (s^-2) of point masses at each of the given places (N, 3): sum_a mu_a (delta_ij - 3 n_i n_j),
    as (N, 3, 3). The same as response.tidal_of_points, for many places at once."""
    d = np.asarray(places, dtype=float)[:, None, :] - np.asarray(points, dtype=float)[None, :, :]
    r = np.linalg.norm(d, axis=2)
    mu = G * np.asarray(masses, dtype=float)[None, :] / r**3
    n = d / r[:, :, None]
    return np.einsum("ab,ij->aij", mu, np.eye(3)) - 3 * np.einsum("ab,abi,abj->aij", mu, n, n)


def meridional_split(E) -> tuple[np.ndarray, np.ndarray]:
    """For tides E (N, 3, 3) at places of the plane y = 0 about an axis of symmetry along z: there E_yy is one
    eigenvalue and the other two belong to the block in x and z. Returns the gap between the block's two
    eigenvalues, and E_yy less the greater of them, each divided by the size |E| of the tide."""
    E = np.asarray(E, dtype=float)
    size = np.linalg.norm(E, axis=(1, 2))
    half = np.sqrt(((E[:, 0, 0] - E[:, 2, 2]) / 2) ** 2 + E[:, 0, 2] ** 2)
    upper = (E[:, 0, 0] + E[:, 2, 2]) / 2 + half
    return 2 * half / size, (E[:, 1, 1] - upper) / size


def meridional_block(q, points, masses) -> tuple[float, float]:
    """((E_xx - E_zz) / |E|, 2 E_xz / |E|) at the place (rho, 0, z) = (q[0], 0, q[1]): the block in x and z is a
    multiple of the identity, and its two eigenvalues meet, where both of these vanish."""
    E = tidal_of_points(np.array([q[0], 0.0, q[1]]), np.asarray(points, dtype=float), masses)
    size = float(np.linalg.norm(E))
    return float(E[0, 0] - E[2, 2]) / size, 2 * float(E[0, 2]) / size


# --- the four directions ---------------------------------------------------------------------------------------------


def direction_quartic(W) -> np.ndarray:
    """The coefficients, from zeta^4 down, of m(zeta)^T W m(zeta) for a symmetric matrix W: its roots are the four
    principal null directions, in the stereographic coordinate of pixel.null_vector."""
    W = np.asarray(W, dtype=complex)
    return np.array([W[0, 0] - W[1, 1] - 2j * W[0, 1], 4 * (W[0, 2] - 1j * W[1, 2]),
                     -2 * (W[0, 0] + W[1, 1]) + 4 * W[2, 2], -4 * (W[0, 2] + 1j * W[1, 2]),
                     W[0, 0] - W[1, 1] + 2j * W[0, 1]])


# --- walking loops ---------------------------------------------------------------------------------------------------


def matched(previous, new) -> np.ndarray:
    """The values `new` put in the order of `previous`, each taken by the nearest that is still free."""
    new = np.asarray(new)
    order, free = [], list(range(len(new)))
    for value in previous:
        k = min(free, key=lambda i: abs(new[i] - value))
        order.append(k)
        free.remove(k)
    return new[order]


def follow(values_at, path, start) -> np.ndarray:
    """Follow a set of values, such as the roots of a polynomial that depends on a parameter, along a path of the
    parameter: values_at(w) gives them in any order, and `start` is their order at the path's beginning."""
    values = np.asarray(start, dtype=complex)
    for w in path:
        values = matched(values, values_at(w))
    return values


def loop_around(centre: complex, base: complex = 0.0, radius: float = 0.05, n: int = 800) -> np.ndarray:
    """A path in the complex plane from the base straight towards the centre, once around it anticlockwise at the
    given radius, and back: 3n points."""
    d = centre - base
    stop = centre - radius * d / abs(d)
    out = np.linspace(base, stop, n)
    around = centre + (stop - centre) * np.exp(2j * np.pi * np.linspace(0.0, 1.0, n))
    return np.concatenate([out, around, out[::-1]])


def permutation(start, end) -> tuple[int, ...]:
    """What a walk has done to a set of values, from their order at the start and as carried to the end (follow):
    p[k] is the place, numbered by the starting values, at which the k-th value arrives."""
    start = np.asarray(start)
    return tuple(int(np.argmin(np.abs(start - e))) for e in end)


def compose(p, q) -> tuple[int, ...]:
    """The permutation of walking first the loop of p and then the loop of q, both in the sense of `permutation`:
    the k-th value arrives at p[k] and is carried on from there to q[p[k]]."""
    return tuple(q[p[k]] for k in range(len(p)))


def generated(generators) -> set:
    """Every permutation that products of the given ones make."""
    identity = tuple(range(len(generators[0])))
    group, frontier = {identity}, [identity]
    while frontier:
        fresh = []
        for g in frontier:
            for s in generators:
                h = compose(g, s)
                if h not in group:
                    group.add(h)
                    fresh.append(h)
        frontier = fresh
    return group


def moved(p) -> int:
    """How many places a permutation moves: 0 for the identity, 2 for one exchange, 4 for two exchanges or a
    cycle of four."""
    return sum(1 for k, v in enumerate(p) if k != v)


def carried_frame(matrices) -> tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
    """Carry the eigenvalues and unit eigenvectors of a sequence of real symmetric matrices from the first to the
    last, each eigenvector followed by its overlap with the one before and keeping its sign. Returns the
    eigenvalues and eigenvectors (as columns) at the start and as carried to the end."""
    values0, vectors0 = np.linalg.eigh(matrices[0])
    values, vectors = values0.copy(), vectors0.copy()
    for E in matrices[1:]:
        l, v = np.linalg.eigh(E)
        new = np.zeros_like(v)
        for k in range(3):
            j = int(np.argmax(np.abs(v.T @ vectors[:, k])))
            new[:, k] = v[:, j] * np.sign(v[:, j] @ vectors[:, k])
            values[k] = l[j]
        vectors = new
    return values0, vectors0, values, vectors


# --- two explicit fields ---------------------------------------------------------------------------------------------

CUBIC_LINES = (2 / (3 * math.sqrt(3)), -2 / (3 * math.sqrt(3)))
"""The values of w = x + iy at which two eigenvalues of the first field meet."""

QUARTIC_A = np.array([[2, -2j, -1], [-2j, -2, -1j], [-1, -1j, 0]]) / 8
"""The constant part of the second field: m^T A m = 1 - zeta^3."""

QUARTIC_LINES = tuple(-0.75 * r for r in np.roots([4, 0, 0, -1]))
"""The three values of w at which two directions of the second field meet: -(3/4) r with 4 r^3 = 1."""


def cubic_potential(p) -> complex:
    """F = x z + w^3 / 6 at the place p, with w = x + iy: harmonic."""
    return p[0] * p[2] + (p[0] + 1j * p[1]) ** 3 / 6


def cubic_field(w: complex) -> np.ndarray:
    """W = Hess F for F = x z + w^3 / 6: it depends on the place through w = x + iy alone."""
    return np.array([[w, 1j * w, 1], [1j * w, -w, 0], [1, 0, 0]], dtype=complex)


def cubic_eigenvalue_polynomial(w: complex) -> list:
    """lam^3 - lam - w, whose roots are the eigenvalues of cubic_field(w)."""
    return [1, 0, -1, -w]


def cubic_direction_polynomial(w: complex) -> list:
    """w zeta^3 + zeta^2 - 1, whose roots are the three directions of cubic_field(w) that move; the fourth is
    zeta = 0. They are the inverses of the eigenvalues."""
    return [w, 1, 0, -1]


def quartic_potential(p) -> complex:
    """F = x^T A x / 2 - w^3 / 24 at the place p: harmonic."""
    p = np.asarray(p, dtype=complex)
    return p @ QUARTIC_A @ p / 2 - (p[0] + 1j * p[1]) ** 3 / 24


def quartic_field(w: complex) -> np.ndarray:
    """W = A - w v v^T / 4 with v = (1, i, 0): the Hessian of quartic_potential."""
    v = np.array([1, 1j, 0])
    return QUARTIC_A - w * np.outer(v, v) / 4


def quartic_direction_polynomial(w: complex) -> list:
    """r^4 - r - w, whose roots are the inverses r = 1 / zeta of the four directions of quartic_field(w)."""
    return [1, 0, 0, -1, -w]


def quartic_eigenvalue_polynomial(w: complex) -> list:
    """y^3 + 4 w y - 1, whose roots are four times the eigenvalues of quartic_field(w): the resolvent cubic of
    r^4 - r - w."""
    return [1, 0, 4 * w, -1]


PAIRINGS = (((0, 1), (2, 3)), ((0, 2), (1, 3)), ((0, 3), (1, 2)))
"""The three ways of pairing four things: r_i r_j + r_k r_l over them are the roots of the resolvent cubic."""


def on_pairings(p) -> tuple[int, ...]:
    """The permutation of the three pairings that a permutation of the four makes: what the eigenvalues see of it."""
    def image(pairing):
        return tuple(sorted(tuple(sorted(p[i] for i in pair)) for pair in pairing))
    return tuple(PAIRINGS.index(image(pairing)) for pairing in PAIRINGS)
