"""A worked near-field inversion (paper, Section IV, "A worked inversion"): the locked safe, read by an array of pixels
with noise, reconstructed with its uncertainty.

The scene: the empty room and the two steel safes are known and subtracted, so what remains is the gold, a bar of
324 kg (0.3 x 0.14 x 0.4 m of gold) in the right-hand safe, 3.5 m in front of the camera. The array: n x n pixels on a
square of side D centred on the camera, each reading the five independent components of the trace-free tidal tensor
E with white noise sigma per component. Noise is quoted as the paper's signal-to-noise ratio for a point mass m at
depth z (Eq. array-data): SNR = 2 G m / (z^2 sqrt(N0)), with N0 = sigma^2 a^2 for pixels a apart.

Three questions: can the data decide where the gold is (a likelihood ratio between hypotheses); what image do they
give, and how uncertain is it (the Gaussian posterior on a grid of masses in the plane of the safes); and which
scenes can they not tell apart. A tilted array changes only where its pixels are: each reads the whole tensor.
"""
from __future__ import annotations

import math

import numpy as np

from .constants import G
from .tidal import point_mass_tidal_tensor, uniform_box_tidal_tensor, uniform_sphere_tidal_tensor

CAMERA = np.array([0.0, 1.5, 0.0])
GOLD_SIZE = np.array([0.3, 0.14, 0.4])
GOLD_DENSITY = 19300.0
GOLD_MASS = GOLD_DENSITY * float(np.prod(GOLD_SIZE))  # 324 kg
RIGHT = np.array([1.1, 0.13, -3.5])
LEFT = np.array([-1.1, 0.13, -3.5])
DEPTH = 3.5


def array_pixels(side: float = 1.0, n: int = 11, tilt_deg: float = 0.0, center=CAMERA) -> np.ndarray:
    """Pixel positions, (n*n, 3): a square of the given side facing -z, turned by tilt about the vertical."""
    u = (np.arange(n) - (n - 1) / 2) * (side / (n - 1))
    x, y = np.meshgrid(u, u, indexing="ij")
    t = math.radians(tilt_deg)
    across = np.array([math.cos(t), 0.0, math.sin(t)])  # the array's horizontal direction
    return np.asarray(center) + x.reshape(-1, 1) * across + y.reshape(-1, 1) * np.array([0.0, 1.0, 0.0])


def components(E: np.ndarray) -> np.ndarray:
    """The five independent components (xx, yy, xy, xz, yz) of trace-free tensors (..., 3, 3), flattened."""
    E = np.asarray(E)
    c = np.stack([E[..., 0, 0], E[..., 1, 1], E[..., 0, 1], E[..., 0, 2], E[..., 1, 2]], axis=-1)
    return c.reshape(-1)


def read_point(pixels, position, mass: float) -> np.ndarray:
    return components(point_mass_tidal_tensor(pixels, position, mass))


def read_box(pixels, position, size=GOLD_SIZE, density: float = GOLD_DENSITY) -> np.ndarray:
    return components(uniform_box_tidal_tensor(pixels, position, size, density))


def read_sphere(pixels, position, radius: float, mass: float) -> np.ndarray:
    return components(uniform_sphere_tidal_tensor(pixels, position, radius, mass))


def noise_for_snr(snr: float, spacing: float, mass: float = GOLD_MASS, depth: float = DEPTH) -> float:
    """sigma per component (s^-2) that gives this SNR, by SNR = 2 G m / (z^2 sigma a)."""
    return 2 * G * mass / (depth**2 * snr * spacing)


def distance(y1: np.ndarray, y2: np.ndarray, sigma: float) -> float:
    """How many noise standard deviations apart two predicted readings are (the Mahalanobis distance)."""
    return float(np.linalg.norm(y1 - y2) / sigma)


def decision_error(d: float) -> float:
    """Chance of choosing wrongly between two equally likely scenes whose readings are d apart: Phi(-d/2)."""
    return 0.5 * math.erfc(d / (2 * math.sqrt(2)))


def grid(step: float = 0.25, x=(-2.5, 2.5), y=(0.0, 2.5), z: float = -DEPTH) -> np.ndarray:
    """Cells of a grid of point masses in the plane of the safes, (k, 3)."""
    xs = np.arange(x[0], x[1] + 1e-9, step)
    ys = np.arange(y[0], y[1] + 1e-9, step)
    X, Y = np.meshgrid(xs, ys, indexing="ij")
    return np.stack([X.ravel(), Y.ravel(), np.full(X.size, z)], axis=1)


def design(pixels, cells) -> np.ndarray:
    """Readings per kilogram in each cell: (5 * pixels, cells)."""
    return np.stack([read_point(pixels, c, 1.0) for c in cells], axis=1)


def posterior(A: np.ndarray, y: np.ndarray, sigma: float, prior_std: float):
    """Gaussian posterior of the cell masses for zero-mean independent priors: mean and covariance.

    Through the singular values of A / sigma, A / sigma = U S V^T: each pattern V_k is measured with precision S_k^2
    and kept with weight S_k^2 / (S_k^2 + 1/s^2), the Wiener filter of Eq. wiener; patterns the data do not reach keep
    their prior. Stable however small the noise, unlike inverting A^T A / sigma^2 + 1/s^2 directly."""
    U, S, Vt = np.linalg.svd(A / sigma, full_matrices=True)
    s2 = prior_std**2
    k = len(S)
    shrink = np.full(Vt.shape[0], s2)
    shrink[:k] = 1.0 / (S**2 + 1.0 / s2)
    cov = (Vt.T * shrink) @ Vt
    gain = np.zeros(Vt.shape[0])
    gain[:k] = S / (S**2 + 1.0 / s2)
    mean = Vt.T @ (gain * (U[:, : Vt.shape[0]].T @ (y / sigma))[: Vt.shape[0]])
    return mean, cov


def region_mass(mean, cov, cells, center, half=(0.45, 0.6)):
    """Total mass in the cells within a safe's footprint, and its standard deviation."""
    w = ((np.abs(cells[:, 0] - center[0]) <= half[0]) & (cells[:, 1] <= center[1] + half[1])).astype(float)
    return float(w @ mean), float(math.sqrt(w @ cov @ w))


def worked_case(snr: float, side: float = 1.0, n: int = 11, tilt_deg: float = 0.0, seed: int = 0) -> dict:
    """Every number the paper quotes for one noise level and one array."""
    pixels = array_pixels(side, n, tilt_deg)
    spacing = side / (n - 1)
    sigma = noise_for_snr(snr, spacing)
    right, left = read_box(pixels, RIGHT), read_box(pixels, LEFT)
    none = np.zeros_like(right)
    point = read_point(pixels, RIGHT, GOLD_MASS)
    sphere = read_sphere(pixels, RIGHT, 0.2, GOLD_MASS)
    deeper = read_box(pixels, RIGHT + np.array([0.0, 0.0, -0.2]))
    aside = read_box(pixels, RIGHT + np.array([0.2, 0.0, 0.0]))
    cells = grid()
    A = design(pixels, cells)
    y = right + sigma * np.random.default_rng(seed).standard_normal(right.shape)
    mean, cov = posterior(A, y, sigma, prior_std=GOLD_MASS)
    m_right, s_right = region_mass(mean, cov, cells, RIGHT)
    m_left, s_left = region_mass(mean, cov, cells, LEFT)
    return {
        "sigma": sigma,
        "left_right": distance(right, left, sigma),
        "gold_none": distance(right, none, sigma),
        "error_left_right": decision_error(distance(right, left, sigma)),
        "bar_point": distance(right, point, sigma),
        "point_sphere": distance(point, sphere, sigma),
        "deeper": distance(right, deeper, sigma),
        "aside": distance(right, aside, sigma),
        "right": (m_right, s_right),
        "left": (m_left, s_left),
    }
