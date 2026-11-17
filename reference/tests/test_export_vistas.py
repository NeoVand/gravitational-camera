"""The tables the site's vista demos read (fixtures/vistas.json) match the
reference implementation that makes them."""
import json
import math

from gravcam import export_vistas


def _close(a, b, rel=1e-7, abs_=1e-9):
    if a is None or b is None:
        return a is b
    return math.isclose(a, b, rel_tol=rel, abs_tol=abs_)


def test_committed_tables_match_a_fresh_build():
    committed = json.loads(export_vistas.OUT.read_text())
    fresh = json.loads(json.dumps(export_vistas.build()))
    # The pair's field is curvature by finite differences, which carry rounding magnified to about 1e-10 of the
    # field; that moves the strength by 1e-8 of itself and the phase eta by 1e-8 rad, so both are compared to 1e-6.
    assert all(_close(a, b) for a, b in zip(committed["pair"]["x"], fresh["pair"]["x"])), "x"
    assert all(_close(a, b, rel=1e-6) for a, b in zip(committed["pair"]["strength"], fresh["pair"]["strength"]))
    assert all(_close(a, b, rel=0.0, abs_=1e-6) for a, b in zip(committed["pair"]["eta"], fresh["pair"]["eta"]))
    for old, new in zip(committed["sweep"]["rows"], fresh["sweep"]["rows"]):
        assert all(_close(a, b) for a, b in zip(old["dphi"], new["dphi"]))
    for key, value in fresh["primordial"].items():
        if isinstance(value, list):
            assert all(_close(a, b) for a, b in zip(committed["primordial"][key], value))
        else:
            assert _close(committed["primordial"][key], value)


def test_pair_table_has_both_zones():
    pair = export_vistas.build()["pair"]
    x, s = pair["x"], pair["strength"]
    # far out, r A is constant: the waves
    assert abs(s[-1] - 1) < 1e-3
    # near the pair, r A grows as r^-4: Newton's quadrupole, (x1/x0)^4 between two near samples
    assert math.isclose(s[0] / s[10], (x[10] / x[0]) ** 4, rel_tol=0.02)


def test_the_comparison_survives_finite_difference_rounding(monkeypatch):
    """Rebuild the pair's table with its field disturbed at 1e-9 of itself, ten times the rounding its finite
    differences carry, as another machine's arithmetic might, and require the comparison above to pass."""
    import numpy as np

    from gravcam import binary

    rng = np.random.default_rng(0)
    exact = binary.tidal

    def noisy(*args, **kwargs):
        E, B = exact(*args, **kwargs)
        E = np.asarray(E)
        return E + 1e-9 * np.abs(E).max(axis=(1, 2), keepdims=True) * rng.standard_normal(E.shape), B

    monkeypatch.setattr(binary, "tidal", noisy)
    committed = json.loads(export_vistas.OUT.read_text())["pair"]
    fresh = export_vistas.pair_table()
    assert fresh["eta"] != committed["eta"]  # the disturbance reaches what is compared
    assert all(_close(a, b, rel=1e-6) for a, b in zip(committed["strength"], fresh["strength"]))
    assert all(_close(a, b, rel=0.0, abs_=1e-6) for a, b in zip(committed["eta"], fresh["eta"]))

