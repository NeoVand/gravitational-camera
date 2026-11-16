"""Memory left by bursts of radiation (gravcam/memory.py) and the transparent
Sun as a lens (gravcam/sunlens.py)."""
import math

import numpy as np
import pytest

from gravcam import memory, sunlens
from gravcam.constants import M_sun


def _toward(angle):
    return np.array([math.sin(angle), 0.0, math.cos(angle)])


def test_a_spherical_burst_leaves_no_memory():
    plus, cross = memory.epstein(lambda n: np.ones(len(n)) / (4 * math.pi), _toward(0.7))
    assert abs(plus) < 1e-12 and abs(cross) < 1e-12


@pytest.mark.parametrize("theta", [0.8, 1.4, 2.2])
def test_a_jet_leaves_one_plus_cos_theta(theta):
    """A narrow jet along z, seen at angle theta: (c^4 r / 4 G) Delta h_+ =
    E (1 + cos theta) / 2. The jets here have a width sigma, which changes the
    answer by order sigma^2; two widths extrapolate to a line."""
    def seen(pattern):
        return memory.epstein(pattern, _toward(theta))

    def extrapolated(make):
        wide, narrow = 0.08, 0.05
        v1, v2 = seen(make(wide))[0], seen(make(narrow))[0]
        return v2 + (v2 - v1) * narrow ** 2 / (wide ** 2 - narrow ** 2)

    one = extrapolated(lambda s: memory.jet([0, 0, 1], width=s))
    assert abs(one) == pytest.approx(0.5 * (1 + math.cos(theta)), rel=1e-3)
    assert abs(seen(memory.jet([0, 0, 1], width=0.05))[1]) < 1e-6
    # a symmetric pair of jets, half the energy each way, leaves the same from every direction
    two = extrapolated(lambda s: (lambda n: 0.5 * (memory.jet([0, 0, 1], width=s)(n)
                                                   + memory.jet([0, 0, -1], width=s)(n))))
    assert abs(two) == pytest.approx(0.5, rel=1e-3)


def test_merger_memory_has_the_wiseman_will_pattern():
    n, w = memory._sphere()
    assert np.sum(memory.binary_flux(n) * w) == pytest.approx(1.0, rel=1e-10)
    angles = np.radians([20.0, 45.0, 70.0, 90.0, 130.0])
    values = np.array([memory.epstein(memory.binary_flux, _toward(a)) for a in angles])
    assert np.all(np.abs(values[:, 1]) < 1e-10)
    shape = np.sin(angles) ** 2 * (17 + np.cos(angles) ** 2)
    ratio = values[:, 0] / shape
    assert np.allclose(ratio, ratio[0], rtol=1e-6)
    # with this normalisation the coefficient is 1/96: Delta h = (G E / 24 c^4 r) sin^2 (17 + cos^2)
    assert abs(ratio[0]) == pytest.approx(1 / 96, rel=1e-6)


def test_polytrope_and_the_bending_at_the_limb():
    # the Lane-Emden constants of the n = 3 polytrope
    assert sunlens.XI1 == pytest.approx(6.89685, abs=1e-4)
    assert -sunlens.XI1 ** 2 * sunlens.DTHETA1 == pytest.approx(2.01824, abs=1e-4)
    assert sunlens.cylinder_mass(sunlens.R_sun) == pytest.approx(M_sun, rel=1e-6)
    # 1.75 arcseconds at the limb
    assert math.degrees(sunlens.deflection(sunlens.R_sun)) * 3600 == pytest.approx(1.7512, abs=2e-3)


def test_focus_behind_the_sun():
    AU = 1.495978707e11
    central = sunlens.focal_distance(0.0)
    near_axis = sunlens.focal_distance(1e-3 * sunlens.R_sun)
    assert near_axis == pytest.approx(central, rel=1e-4)
    assert 30 * AU < central < 40 * AU
    # the focus recedes monotonically outward, to 548 AU at the limb
    fs = [sunlens.focal_distance(f * sunlens.R_sun) for f in (0.05, 0.2, 0.5, 1.0)]
    assert all(a < b for a, b in zip(fs, fs[1:]))
    assert fs[-1] / AU == pytest.approx(547.7, abs=0.5)
    # inside, the bending peaks above twice its value at the limb
    peak = max(sunlens.deflection(f * sunlens.R_sun) for f in np.linspace(0.2, 0.4, 9))
    assert peak / sunlens.deflection(sunlens.R_sun) > 2.3


def test_only_the_quadrupole_and_higher_parts_of_a_burst_leave_memory():
    """A burst merely brighter on one side (a dipole) leaves nothing; one
    stronger along an axis, 1 + q P2(cos), leaves (c^4 r / 4 G) Delta h_+ =
    q E sin^2(theta) / 8, that is Delta h = (q G E / 2 c^4 r) sin^2(theta)."""
    for theta in (0.5, 1.2, math.pi / 2, 2.4):
        N = _toward(theta)
        dipole, _ = memory.epstein(lambda n: (1 + 0.3 * n[:, 2]) / (4 * math.pi), N)
        assert abs(dipole) < 1e-12
        quad, _ = memory.epstein(lambda n: (1 + 0.5 * (3 * n[:, 2] ** 2 - 1)) / (4 * math.pi), N)
        assert quad == pytest.approx(math.sin(theta) ** 2 / 8, rel=1e-9)
