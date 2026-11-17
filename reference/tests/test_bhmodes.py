"""A black hole against the graviton background, mode by mode: the greybody factors and the shadow's depth."""
import math

from gravcam.bhmodes import _table, cross_section, shadow_depth, transmission


def test_flux_is_conserved():
    for l, w in ((2, 0.05), (2, 0.4), (5, 1.0)):
        assert abs(transmission(l, w)[1] - 1.0) < 1e-6


def test_long_waves_approach_pages_law():
    # Gamma_2 -> (256/225) (M omega)^6, i.e. sigma -> (256 pi / 45) M^6 omega^4 (Page 1976)
    lead = lambda x: 256 / 225 * x**6
    r1, r2 = transmission(2, 0.01)[0] / lead(0.01), transmission(2, 0.02)[0] / lead(0.02)
    assert abs(r1 - 1) < 0.1 and abs(r1 - 1) < abs(r2 - 1)


def test_the_stored_table_and_its_geometric_limit():
    x, sigma = _table()
    assert math.isclose(sigma[-1], 27 * math.pi, rel_tol=0.01)  # the capture cross-section of short waves
    assert math.isclose(cross_section(float(x[4])), sigma[4], rel_tol=1e-6)


def test_detailed_balance_and_the_cold_limit():
    assert abs(shadow_depth(1.0)) < 1e-12  # a hole as warm as the sky cannot be seen
    depths = [shadow_depth(t) for t in (0.01, 0.1, 0.3, 0.5, 1.0, 2.0)]
    assert abs(depths[0] - 1) < 2e-3 and all(a > b for a, b in zip(depths, depths[1:]))
    assert 0.9 < depths[1] < 0.95 and 0.25 < depths[3] < 0.33 and depths[-1] < 0
