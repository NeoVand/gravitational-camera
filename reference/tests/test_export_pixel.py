"""The cases the site's pixel algebra is tested against (fixtures/pixel.json) match the reference that makes them."""
import json
import math

import numpy as np

from gravcam import export_pixel


# How far a star may move between numerical libraries, by how many stars coincide there. An m-fold root moves by
# about the m-th root of the rounding error; these allow for rounding ten times worse than double precision, with a
# factor of five to spare (measured: 3e-12, 3e-6 and 2e-3 under relative noise of 1e-14 on the reading).
STAR_TOLERANCE = {1: 1e-9, 2: 2e-5, 3: 1e-2, 4: 1e-2}


def _same_stars(a, b):
    """Stars as a set of unit vectors. Where m of them coincide (two for type D, four for type N, two for a light
    wave) they are an m-fold root, fixed only to about the m-th root of the rounding error, so their last digits
    depend on the numerical library."""
    if len(a) != len(b):
        return False
    for x in a:
        m = sum(math.dist(x, y) < 1e-2 for y in a)
        if min(math.dist(x, y) for y in b) > STAR_TOLERANCE[m]:
            return False
    return True


def _same_key(k, a, b):
    if k == "stars":
        return _same_stars(a, b)
    if k == "alarm":
        # zero for one body however it moves; below 1e-9 it is rounding in a repeated eigenvalue
        return math.isclose(a, b, rel_tol=1e-8, abs_tol=1e-9)
    return _same(a, b)


def _same(a, b):
    if isinstance(a, dict):
        return a.keys() == b.keys() and all(_same_key(k, a[k], b[k]) for k in a)
    if isinstance(a, list):
        return len(a) == len(b) and all(_same(x, y) for x, y in zip(a, b))
    if isinstance(a, str):
        return a == b
    return math.isclose(a, b, rel_tol=1e-8, abs_tol=1e-12)


def _flat(x):
    if isinstance(x, dict):
        return [v for k in sorted(x) for v in _flat(x[k])]
    if isinstance(x, list):
        return [v for y in x for v in _flat(y)]
    return [x]


def _same_scaled(a, b, rel=1e-7):
    """Numbers computed by finite differences (the curvature of the metric waves in "beyond") carry rounding
    magnified about a million times, some 5e-10 of their own size whatever the entry: compare each quantity to
    rel times its largest entry, not entry by entry."""
    fa, fb = _flat(a), _flat(b)
    scale = max(abs(v) for v in fa) or 1.0
    return len(fa) == len(fb) and all(abs(x - y) <= rel * scale for x, y in zip(fa, fb))


def _same_beyond(a, b):
    computed = ("E", "B", "found_k", "found_n", "pol")
    return len(a) == len(b) and all(
        x.keys() == y.keys()
        and all(_same_scaled(x[k], y[k]) if k in computed else _same(x[k], y[k]) for k in x)
        for x, y in zip(a, b)
    )


def test_committed_cases_match_a_fresh_build():
    committed = json.loads(export_pixel.OUT.read_text())
    fresh = json.loads(json.dumps(export_pixel.build()))
    for key in ("scenes", "waves", "charges", "four_waves", "light_two_waves"):
        assert _same(committed[key], fresh[key]), key
    assert _same_beyond(committed["beyond"], fresh["beyond"]), "beyond"


def test_the_comparison_survives_rounding(monkeypatch):
    """Rebuild with every reading (W and F) disturbed at ten times the rounding error of double precision, relative
    to its largest entry, and the metric waves' polarizations likewise (their curvature, by finite differences,
    magnifies it), as a different numerical library might; require the comparison to pass."""
    rng = np.random.default_rng(0)

    def noisy(f, arg=None):
        def g(*args, **kwargs):
            if arg is not None:  # disturb an input
                args = list(args)
                x = np.asarray(args[arg], dtype=float)
                args[arg] = x * (1 + 1e-14 * rng.standard_normal(x.shape))
                return f(*args, **kwargs)
            x = np.asarray(f(*args, **kwargs))
            return x + 1e-14 * np.abs(x).max() * rng.standard_normal(x.shape)
        return g

    from gravcam import beyond, pixel

    monkeypatch.setattr(pixel, "moving_masses_W", noisy(pixel.moving_masses_W))
    monkeypatch.setattr(pixel, "moving_charges_F", noisy(pixel.moving_charges_F))
    monkeypatch.setattr(beyond, "metric_wave", noisy(beyond.metric_wave, arg=0))
    committed = json.loads(export_pixel.OUT.read_text())
    for _ in range(3):
        fresh = json.loads(json.dumps(export_pixel.build()))
        # the disturbance must reach what is compared, or this test proves nothing
        assert committed["scenes"][2]["stars"] != fresh["scenes"][2]["stars"]
        assert committed["beyond"][0]["E"] != fresh["beyond"][0]["E"]
        for key in ("scenes", "charges"):
            assert _same(committed[key], fresh[key]), key
        assert _same_beyond(committed["beyond"], fresh["beyond"]), "beyond"
