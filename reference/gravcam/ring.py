"""The ring that remembers (design/SYNTHESIS.md, Section 10.1): a marked ring of free particles in an exact plane
wave.

The setting. A ring of free particles around a gyroscope meets an exact vacuum plane wave. With u the wave's phase,
the map X(u) from where each bead started to where it is, across the wave, obeys

    X'' = H(u) X,        X(0) = 1,   X'(0) = 0,

with H real, symmetric and trace-free, two by two: the wave's two polarizations. Write

    X = rho R(theta) C^(1/2),        C = R(psi / 2) diag(e^r, e^-r) R(-psi / 2),

with rho the mean radius, R(theta) a turn of the beads against the gyroscope, and C the shape, X^T X = rho^2 C. The
shape is a point of the hyperbolic plane, ds^2 = dr^2 + sinh^2 r dpsi^2 (Cropp and Visser 2010): r = 0 is the round
ring. Then

    theta' = (1/2) (cosh r - 1) psi',        rho'' = -(1/4) v_H^2 rho,        v_H^2 = r'^2 + sinh^2 r psi'^2,

with v_H the speed of the shape.

The labels turn. (cosh r - 1) dpsi is the area swept from r = 0, so when the ring is round again its beads have
turned, against the gyroscope, by half the signed hyperbolic area that the shape enclosed, though the flow never
had any vorticity. The area is taken here from triangles with one corner at r = 0: two sides r_1, r_2 and the angle
C between them enclose the area A with tan(A / 2) = t_1 t_2 sin C / (1 - t_1 t_2 cos C), t = tanh(r / 2). A
curvature pixel switched on afterwards reads zero; the marked ring tells two mirror waves apart.

The deadline. If the shape made a simple circuit in the time T and turned the labels by Theta, the ring is
converging at the rate Y = -rho'(T) / rho(T), with

    T Y >= sinh^2 sqrt(Theta^2 + 2 pi |Theta|),

by the isoperimetric inequality of the hyperbolic plane; and if the wave leaves the shape at rest, the ring comes
to a point after exactly 1 / Y more. A rotation is paid for in focusing: above 6.95 degrees the time left is shorter
than the wave itself. The statement supposes no caustic inside the wave (rho > 0 throughout).

The example. r = 0.60 sin^4(pi u / T), psi = +-2 pi u / T turns the labels by +-9.0521 degrees, leaves the ring
with 0.2691 of its first radius, and brings it to a point 0.1903 T after the wave: T Y = 5.2542, against the bound
1.4132.

Weak waves. For H = eps Q'' with Q = a D + b S, D = diag(1, -1) and S the symmetric off-diagonal matrix, a and b
vanishing with their slopes at both ends,

    Theta = eps^2 int (a b' - b a') du,        rho'(T) = -eps^2 int (a'^2 + b'^2) du,

to the order eps^2: no first-order memory is needed.

How the first claim is tested. From a path of the shape, theta and rho are integrated by the two equations; the
strain S = X' X^-1 then follows in closed form and is symmetric only because of the equation for theta; the wave
is H = S' + S^2, trace-free only because of the equation for rho; and X'' = H X is integrated forwards on its own
and compared with rho R(theta) C^(1/2).

Tested in tests/test_ring.py.
"""
from __future__ import annotations

import math

import numpy as np
from scipy.integrate import solve_ivp

PLUS = np.diag([1.0, -1.0])
"""D: the wave's first polarization, stretching x and squeezing y."""

CROSS = np.array([[0.0, 1.0], [1.0, 0.0]])
"""S: its second, the same at 45 degrees."""

EXAMPLE = (0.60, 2 * math.pi, 4)
"""The worked example as a petal: height r0 = 0.60, width 2 pi, power 4."""


def rotation(angle: float) -> np.ndarray:
    return np.array([[math.cos(angle), -math.sin(angle)], [math.sin(angle), math.cos(angle)]])


# --- the ring as radius, turn and shape ------------------------------------------------------------------------------


def root_shape(r: float, psi: float) -> np.ndarray:
    """C^(1/2) = R(psi / 2) diag(e^(r/2), e^(-r/2)) R(-psi / 2): symmetric, of unit determinant, stretched by
    e^(r/2) along the direction at the angle psi / 2."""
    turn = rotation(psi / 2)
    return turn @ np.diag([math.exp(r / 2), math.exp(-r / 2)]) @ turn.T


def ring_map(rho: float, theta: float, r: float, psi: float) -> np.ndarray:
    """X = rho R(theta) C^(1/2)."""
    return rho * rotation(theta) @ root_shape(r, psi)


def polar_angle(X) -> float:
    """theta in X = rho R(theta) C^(1/2): the turn of the beads, from the antisymmetric part of X."""
    return math.atan2(X[1, 0] - X[0, 1], X[0, 0] + X[1, 1])


def radius(X) -> float:
    """rho = sqrt(det X): the ring's area is pi rho^2 times its first."""
    return math.sqrt(np.linalg.det(X))


def convergence(X, dX) -> float:
    """Y = -rho' / rho = -(1/2) tr(X' X^-1): the rate at which the ring's mean radius is falling."""
    return -0.5 * float(np.trace(dX @ np.linalg.inv(X)))


def shape(X) -> tuple[float, float]:
    """(r, psi) of the shape C = X^T X / det X = cosh r + sinh r (cos psi D + sin psi S)."""
    C = X.T @ X / np.linalg.det(X)
    return math.acosh(max(1.0, 0.5 * np.trace(C))), math.atan2(2 * C[0, 1], C[0, 0] - C[1, 1])


# --- from a path of the shape to the turn, the radius and the wave ---------------------------------------------------


def petal(r0: float, dpsi: float, power: int = 4, T: float = 1.0):
    """A circuit of the shape through the round ring: r = r0 sin^power(pi u / T) while psi sweeps dpsi at a steady
    rate. Returns the path, a function u -> (r, r', psi, psi'). The worked example is petal(0.60, +-2 pi, 4)."""
    def path(u: float):
        s, co = math.sin(math.pi * u / T), math.cos(math.pi * u / T)
        return r0 * s**power, r0 * power * math.pi / T * s ** (power - 1) * co, dpsi * u / T, dpsi / T
    return path


def shape_run(path, T: float = 1.0):
    """theta, rho and rho' along a path of the shape, from theta' = (1/2) (cosh r - 1) psi' and rho'' = -(1/4)
    v_H^2 rho with theta = 0, rho = 1, rho' = 0 at the start. Returns scipy's solution: sol.y[:, -1] holds the
    three at u = T and sol.sol(u) gives them inside the wave."""
    def rhs(u, y):
        r, dr, _, dpsi = path(u)
        return [0.5 * (math.cosh(r) - 1.0) * dpsi, y[2], -0.25 * (dr**2 + math.sinh(r) ** 2 * dpsi**2) * y[1]]
    return solve_ivp(rhs, [0.0, T], [0.0, 1.0, 0.0], rtol=1e-12, atol=1e-14, dense_output=True)


def has_caustic(sol, n: int = 2001) -> bool:
    """Whether the ring's radius reaches zero inside the wave."""
    return bool(np.min(sol.sol(np.linspace(sol.t[0], sol.t[-1], n))[1]) <= 0)


def strain(path, sol, u: float) -> np.ndarray:
    """S = X' X^-1 from the shape and the run: (rho' / rho) 1 + R [(r' / 2) D + (psi' sinh r / 2) S] R^T with R =
    R(theta + psi / 2). Symmetric by the equation for theta."""
    r, dr, psi, dpsi = path(u)
    theta, rho, drho = sol.sol(u)
    turn = rotation(theta + 0.5 * psi)
    return (drho / rho) * np.eye(2) + turn @ (0.5 * dr * PLUS + 0.5 * dpsi * math.sinh(r) * CROSS) @ turn.T


def wave(path, sol, u: float, h: float = 2e-5) -> np.ndarray:
    """H = S' + S^2, the wave that carries the ring along the path, with S' by a fourth-order difference of step
    h. The difference needs room, so within 5 h of either end the wave is taken 5 h inside; for a smooth path that
    changes it by an amount of the order of h."""
    u = min(max(u, sol.t[0] + 5 * h), sol.t[-1] - 5 * h)
    S = lambda s: strain(path, sol, s)
    dS = (-S(u + 2 * h) + 8 * S(u + h) - 8 * S(u - h) + S(u - 2 * h)) / (12 * h)
    return dS + S(u) @ S(u)


def forward(H, T: float = 1.0) -> tuple[np.ndarray, np.ndarray]:
    """X(T) and X'(T) from X'' = H(u) X, X(0) = 1, X'(0) = 0, for H a function of u that returns a 2 x 2 matrix."""
    def rhs(u, y):
        return np.concatenate([y[4:], (H(u) @ y[:4].reshape(2, 2)).ravel()])
    start = np.concatenate([np.eye(2).ravel(), np.zeros(4)])
    sol = solve_ivp(rhs, [0.0, T], start, rtol=1e-11, atol=1e-13)
    return sol.y[:4, -1].reshape(2, 2), sol.y[4:, -1].reshape(2, 2)


# --- the turn as an area, and the deadline ---------------------------------------------------------------------------


def hyperbolic_area(path, T: float = 1.0, n: int = 20001) -> float:
    """Signed area enclosed by a closed path of the shape that passes through r = 0, in the hyperbolic plane of
    curvature -1, as a sum of n - 1 triangles with one corner at r = 0: each has tan(A / 2) = t_1 t_2 sin C /
    (1 - t_1 t_2 cos C), with t = tanh(r / 2) for its two sides and C the step in psi."""
    samples = [path(u) for u in np.linspace(0.0, T, n)]
    t = np.tanh(np.array([s[0] for s in samples]) / 2.0)
    step = np.diff(np.array([s[2] for s in samples]))
    tt = t[:-1] * t[1:]
    return float(np.sum(2.0 * np.arctan2(tt * np.sin(step), 1.0 - tt * np.cos(step))))


def deadline_bound(theta: float) -> float:
    """The least T Y of a ring whose shape made a simple circuit in the time T and turned the labels by theta
    (radians): sinh^2 sqrt(theta^2 + 2 pi |theta|). The ring comes to a point within T / bound of the wave's end."""
    return math.sinh(math.sqrt(theta**2 + 2 * math.pi * abs(theta))) ** 2


# --- weak waves ------------------------------------------------------------------------------------------------------


def weak_wave(a, b, eps: float):
    """H(u) = eps Q''(u) for Q = a D + b S, with a and b polynomials in u (numpy's Polynomial)."""
    a2, b2 = a.deriv(2), b.deriv(2)
    return lambda u: eps * (a2(u) * PLUS + b2(u) * CROSS)


def weak_rotation(a, b, T: float = 1.0) -> float:
    """Theta / eps^2 for the weak wave of a and b: int_0^T (a b' - b a') du, twice the area that (a, b) encloses."""
    swept = (a * b.deriv() - b * a.deriv()).integ()
    return float(swept(T) - swept(0.0))


def weak_focusing(a, b, T: float = 1.0) -> float:
    """rho'(T) / eps^2 for the weak wave of a and b: -int_0^T (a'^2 + b'^2) du."""
    speed = (a.deriv() ** 2 + b.deriv() ** 2).integ()
    return -float(speed(T) - speed(0.0))
