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
    for key in ("x", "strength", "eta"):
        assert all(_close(a, b) for a, b in zip(committed["pair"][key], fresh["pair"][key])), key
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
