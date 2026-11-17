"""The transparent Sun as a lens in wave optics: the method against closed forms, and its two limits."""
import math

from gravcam.sunlens import focal_distance, point_mass_axis_gain
from gravcam.sunwave import AU, axis_amplitude, axis_gain, geometric_axis_gain


def test_the_split_integrals_give_the_point_mass_closed_form():
    for f in (10.0, 1e3, 1e5):
        assert math.isclose(abs(axis_amplitude(f, AU, mass_profile=False)) ** 2, point_mass_axis_gain(f), rel_tol=1e-9)


def test_long_waves_see_only_the_suns_whole_mass():
    assert math.isclose(axis_gain(10.0, 20 * AU), point_mass_axis_gain(10.0), rel_tol=1e-4)


def test_short_waves_nearer_than_the_focus_see_the_central_ray():
    assert focal_distance(0.0) > 33 * AU
    assert math.isclose(axis_gain(1e6, 20 * AU), geometric_axis_gain(20 * AU), rel_tol=0.01)
    assert math.isclose(axis_gain(1e5, AU), geometric_axis_gain(AU), rel_tol=1e-3)


def test_beyond_the_focus_the_gain_grows_with_frequency():
    g5, g6 = axis_gain(1e5, 50 * AU), axis_gain(1e6, 50 * AU)
    assert 8.5 < g6 / g5 < 12
    assert 1.0 < g6 / point_mass_axis_gain(1e6) < 1.4
