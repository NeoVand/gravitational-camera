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
    assert _close(committed["pair"]["eta_end"], fresh["pair"]["eta_end"], rel=0.0, abs_=1e-6)
    for key in ("rr", "rphi"):
        assert all(_close(a, b, rel=0.0, abs_=1e-6)
                   for old, new in zip(committed["pair"][key], fresh["pair"][key]) for a, b in zip(old, new)), key
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


def test_pair_tensor_in_the_plane_has_both_zones():
    """The rest of the changing tensor, against E_zz: near the pair the rotating quadrupole of Newton's potential,
    -(3 G / 2) I_kl x_k x_l / r^5 with I the changing part of the second moment, whose curvature at phi = 0 is
    (E_rr, E_rphi, E_phiphi, E_zz) = (G k / r^5) (-18, -12 i, 21/2, 15/2); far away the wave, whose only
    components in the plane are E_phiphi = -E_zz, with E_zz = -A cos(2 Omega (t - r / c)) at phi = 0."""
    pair = export_vistas.build()["pair"]
    rr = [complex(*v) for v in pair["rr"]]
    rphi = [complex(*v) for v in pair["rphi"]]
    # near, within lambda / 2 pi, the departure from Newton's quadrupole falls as (k r)^2
    for x, a, b in zip(pair["x"], rr, rphi):
        if x < 0.2:
            kr2 = (2 * math.pi * x) ** 2
            assert abs(a - (-18 / 7.5)) < kr2 and abs(b - (-12j / 7.5)) < kr2, x
    # far: only E_phiphi = -E_zz remains, to order 1 / k r
    assert abs(rr[-1]) < 2e-3 and abs(rphi[-1]) < 0.05
    # and the absolute phase of E_zz at phi = 0 is that of the wave, pi, to order 1 / k r
    assert abs(math.remainder(pair["eta_end"] - math.pi, 2 * math.pi)) < 0.05


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
    for key in ("rr", "rphi"):
        assert all(_close(a, b, rel=0.0, abs_=1e-6)
                   for old, new in zip(committed[key], fresh[key]) for a, b in zip(old, new)), key

