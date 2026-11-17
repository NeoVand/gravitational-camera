"""Two exact consequences checked independently: confined meridional flows leave no magnetic field outside
(nullspace.py), and two equal buried masses leave shear zeros exactly their separation apart (tidal.py)."""
import numpy as np
import pytest
from scipy.optimize import brentq

from gravcam import nullspace, tidal


def test_meridional_rolls_are_silent_outside():
    grid, dV, swirl, rolls = nullspace.ball_flows(64)
    for x in (np.array([1.8, -0.9, 1.3]), np.array([2.2, 0.4, -0.3])):
        bs = np.linalg.norm(nullspace.external_magnetic(swirl, grid, dV, x))
        br = np.linalg.norm(nullspace.external_magnetic(rolls, grid, dV, x))
        assert bs > 1e-3 and br < 1e-5 * bs                  # zero up to the grid's error
    x = np.array([0.0, 0.0, 2.5])                            # on the axis, zero by symmetry as well
    assert np.linalg.norm(nullspace.external_magnetic(rolls, grid, dV, x)) < 1e-12


def test_rolls_converge_to_zero_with_the_grid():
    x = np.array([1.8, -0.9, 1.3])
    vals = []
    for n in (32, 64):
        grid, dV, swirl, rolls = nullspace.ball_flows(n)
        vals.append(np.linalg.norm(nullspace.external_magnetic(rolls, grid, dV, x))
                    / np.linalg.norm(nullspace.external_magnetic(swirl, grid, dV, x)))
    assert vals[1] < vals[0] / 4                             # converging to zero


@pytest.mark.parametrize("z", [0.9, 1.5, 5.0, 20.0])
def test_buried_ruler_equal_masses(z):
    d = 1.0
    masses = [(1.0, (-d / 2, 0.0)), (1.0, (d / 2, 0.0))]
    assert abs(tidal.planar_shear(0.0, 0.37, z, masses).imag) < 1e-15        # E_xy = 0 on the bisector
    y0 = brentq(lambda y: tidal.planar_shear(0.0, y, z, masses).real, 0.2, 0.9)
    assert y0 == pytest.approx(d / 2, abs=1e-12)
    # the phase of the shear turns once around each zero (Fig. buried-ruler)
    t = np.linspace(0, 2 * np.pi, 2001)
    for s in (1, -1):
        S = tidal.planar_shear(0.1 * np.cos(t), s * d / 2 + 0.1 * np.sin(t), z, masses)
        assert np.sum(np.diff(np.unwrap(np.angle(S)))) / (2 * np.pi) == pytest.approx(1.0, abs=1e-9)


def test_unequal_masses_drift_with_depth():
    masses = [(1.0, (-0.5, 0.0)), (2.0, (0.5, 0.0))]

    def zero(z):
        # the zero's position, by minimizing |S| from a start near (0.2, 0.45)
        from scipy.optimize import minimize
        res = minimize(lambda p: abs(tidal.planar_shear(p[0], p[1], z, masses)), [0.2, 0.45], tol=1e-14,
                       method="Nelder-Mead", options={"xatol": 1e-12, "fatol": 1e-18, "maxiter": 4000})
        return res.x
    a, b = zero(1.5), zero(5.0)
    assert abs(a[1] - b[1]) > 0.03                           # the half-separation changes with depth
