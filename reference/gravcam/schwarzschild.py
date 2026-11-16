"""Rays near a black hole: exact null geodesics of the Schwarzschild metric.

Light and gravitational waves shorter than the hole follow the same rays, so
one calculation serves both pictures. Lengths are in units of G M / c^2. A ray
with impact parameter b obeys, with u = 1 / r,

    (du/dphi)^2 = P(u) = 1 / b^2 - u^2 + 2 u^3 ,

and a static observer at radius r_o who sees it arrive at angle psi from the
direction of the hole measures b = r_o sin(psi) / sqrt(1 - 2 / r_o). Rays with
b < sqrt(27) traced back from the observer toward the hole fall in: that is
the shadow, of angular radius sin(psi_s) = sqrt(27) sqrt(1 - 2 / r_o) / r_o.
Every other ray came from infinity, after sweeping an angle

    dphi = int du / sqrt(P(u)),

taken from the observer in to the closest approach u_2 and back out to u = 0,
which is a sum of incomplete elliptic integrals of the first kind (Darwin
1959). A frequency measured at infinity arrives multiplied by
1 / sqrt(1 - 2 / r_o), the same for every ray.
"""
from __future__ import annotations

import math

import numpy as np
from scipy.special import ellipkinc

B_CRITICAL = math.sqrt(27.0)


def shadow_radius(r_obs: float) -> float:
    """Angular radius of the shadow for a static observer at r_obs > 3, radians."""
    return math.asin(B_CRITICAL * math.sqrt(1.0 - 2.0 / r_obs) / r_obs)


def blueshift(r_obs: float) -> float:
    """Factor by which a static observer at r_obs sees frequencies from infinity raised."""
    return 1.0 / math.sqrt(1.0 - 2.0 / r_obs)


def impact_parameter(r_obs: float, psi):
    return r_obs * np.sin(psi) / math.sqrt(1.0 - 2.0 / r_obs)


def _roots(b):
    """The three real roots u1 < u2 < u3 of 2u^3 - u^2 + 1/b^2 for b > sqrt(27)."""
    b = np.asarray(b, dtype=np.float64)
    # trigonometric solution of the depressed cubic: u = 1/6 + y, y^3 - y/12 + q = 0
    q = 1.0 / (2.0 * b * b) - 1.0 / 108.0
    amp = 1.0 / 3.0
    arg = np.clip(-q / (2.0 * (1.0 / 36.0) ** 1.5), -1.0, 1.0)
    phi = np.arccos(arg)
    ks = np.arange(3)[:, None] if b.ndim else np.arange(3)
    y = amp * np.cos((phi - 2.0 * math.pi * ks) / 3.0)
    u = np.sort(1.0 / 6.0 + y, axis=0)
    # far from the hole arccos loses precision near 1: polish each root with
    # Newton's method, keeping a step only where it brings the cubic nearer zero
    c0 = 1.0 / (b * b)
    for _ in range(3):
        f = 2.0 * u ** 3 - u * u + c0
        df = 6.0 * u * u - 2.0 * u
        safe = np.where(np.abs(df) > 1e-300, df, 1.0)
        trial = u - f / safe
        better = np.abs(2.0 * trial ** 3 - trial * trial + c0) < np.abs(f)
        u = np.where(better, trial, u)
    return u[0], u[1], u[2]


def _up_to_turning(b, u_from):
    """int_{u_from}^{u_2} du / sqrt(P(u)) for b > sqrt(27) and 0 <= u_from <= u_2."""
    u1, u2, u3 = _roots(b)
    m = (u2 - u1) / (u3 - u1)
    scale = math.sqrt(2.0) / np.sqrt(u3 - u1)
    phi_from = np.arcsin(np.sqrt(np.clip((u_from - u1) / (u2 - u1), 0.0, 1.0)))
    return scale * (ellipkinc(0.5 * math.pi, m) - ellipkinc(phi_from, m))


_NODES, _WEIGHTS = np.polynomial.legendre.leggauss(96)


def _outward(b, u_obs):
    """int_0^{u_obs} du / sqrt(P(u)) for b < sqrt(27), where P has no root
    between 0 and u_obs and the integrand is smooth."""
    u = 0.5 * u_obs * (_NODES[:, None] + 1.0)
    P = 1.0 / (b * b) - u * u + 2.0 * u ** 3
    return 0.5 * u_obs * np.sum(_WEIGHTS[:, None] / np.sqrt(P), axis=0)


def sweep(r_obs: float, psi):
    """Angle swept by each ray between the observer and infinity, for viewing
    angles psi from the direction of the hole; NaN where the ray falls in."""
    psi = np.atleast_1d(np.asarray(psi, dtype=np.float64))
    b = impact_parameter(r_obs, psi)
    u_obs = 1.0 / r_obs
    out = np.full(psi.shape, np.nan)
    inward = psi < 0.5 * math.pi
    escapes = inward & (b > B_CRITICAL)
    if np.any(escapes):
        bb = b[escapes]
        out[escapes] = _up_to_turning(bb, u_obs) + _up_to_turning(bb, 0.0)
    # a ray traced outward never turns; with b > sqrt(27) it starts below the
    # turning point u_2, and the elliptic form stays exact even where it starts
    # almost at it (looking sideways)
    above = ~inward & (b > B_CRITICAL)
    if np.any(above):
        bb = b[above]
        out[above] = _up_to_turning(bb, 0.0) - _up_to_turning(bb, u_obs)
    below = ~inward & ~above
    if np.any(below):
        out[below] = _outward(np.maximum(b[below], 1e-12), u_obs)
    return out


def deflection(b):
    """Total bending of a ray passing from infinity to infinity with impact
    parameter b > sqrt(27): 2 int_0^{u_2} du / sqrt(P) - pi."""
    b = np.atleast_1d(np.asarray(b, dtype=np.float64))
    return 2.0 * _up_to_turning(b, 0.0) - math.pi


def sky_directions(observer, view_dirs):
    """Where on the sky at infinity each viewing direction looks, after the
    hole has bent the ray. observer: position (3,), in units of G M / c^2, with
    the hole at the origin; view_dirs: (..., 3) unit vectors in the static
    observer's frame. Returns (..., 3) unit vectors and a mask of the shadow."""
    observer = np.asarray(observer, dtype=np.float64)
    r_obs = float(np.linalg.norm(observer))
    e = observer / r_obs
    d = np.asarray(view_dirs, dtype=np.float64)
    shape = d.shape[:-1]
    d = d.reshape(-1, 3)
    cos_psi = np.clip(-(d @ e), -1.0, 1.0)
    psi = np.arccos(cos_psi)
    transverse = d - (d @ e)[:, None] * e[None, :]
    norm = np.linalg.norm(transverse, axis=1)
    t = transverse / np.where(norm > 0, norm, 1.0)[:, None]
    dphi = sweep(r_obs, psi)
    shadow = np.isnan(dphi)
    dphi = np.nan_to_num(dphi)
    out = np.cos(dphi)[:, None] * e[None, :] + np.sin(dphi)[:, None] * t
    return out.reshape(shape + (3,)), shadow.reshape(shape)


def trace(b: float, r_start: float, inward: bool, r_stop: float = 1e5, steps: int = 200000):
    """Integrate the orbit equation u'' = 3u^2 - u with fourth-order
    Runge-Kutta in phi, from r_start out to r_stop or into the hole, and
    return the angle swept (NaN if captured). An independent check of `sweep`."""
    u = 1.0 / r_start
    du = math.sqrt(max(1.0 / (b * b) - u * u + 2.0 * u ** 3, 0.0)) * (1.0 if inward else -1.0)
    phi = 0.0
    h = 1e-4

    def f(state):
        uu, vv = state
        return np.array([vv, 3.0 * uu * uu - uu])

    state = np.array([u, du])
    for _ in range(steps):
        if state[0] > 0.5:
            return float("nan")
        if state[0] < 1.0 / r_stop and state[1] < 0:
            # the rest of the way out is nearly straight: add it analytically
            return phi + state[0] / abs(state[1])
        # smaller steps where the ray turns quickly
        step = h if state[0] < 0.2 else h / 4
        k1 = f(state)
        k2 = f(state + 0.5 * step * k1)
        k3 = f(state + 0.5 * step * k2)
        k4 = f(state + step * k3)
        state = state + step / 6.0 * (k1 + 2 * k2 + 2 * k3 + k4)
        phi += step
    return float("nan")
