"""The single-pixel band limit, as a test.

This is the check of ``calc/single_pixel_bandlimit.py`` (which stays in place
as a script) with its printed table turned into assertions:

A point pixel records the gravitoelectric and gravitomagnetic tidal tensors
E_ij, B_ij of an incoherent superposition of plane gravitational waves. Its
second-order statistics <EE>, <EB>, <BB> depend only on sky multipoles l <= 4
of the Stokes parameters.

Method, as in the script: put I(k) = P_l(k . a) for random axes a (zonal
harmonics about random axes span the whole degree-l space) and integrate the
kernels over the sphere with a Gauss-Legendre x uniform quadrature that is
exact for these polynomial integrands. The random axes use the script's seed
and order of draws, so the numbers are the ones the script prints.

Thresholds: the integrals that must vanish come out at 1e-13 or below
(round-off of sums of ~5e3 terms of order one), the ones that must not are
0.19 or larger. "Zero" is asserted as < 1e-10, "non-zero" as > 0.1.
"""
import numpy as np
import pytest
from numpy.polynomial import legendre as L

ZERO = 1e-10
NONZERO = 0.1

# Which degrees l of the sky pattern each kernel responds to (the script's table).
EXPECTED_NONZERO = {
    "I : <E E>": {0, 2, 4},
    "I : <E B>": {1, 3},
    "I : <B B>": {0, 2, 4},
    "V : <E E>": {1, 3},
    "V : <E B>": {0, 2, 4},
}
DEGREES = range(0, 9)
LINEAR_DEGREES = range(4, 10)


def outer(a, b):
    return a[..., :, None] * b[..., None, :]


def outer4(a, b):
    return a[..., :, :, None, None] * b[..., None, None, :, :]


@pytest.fixture(scope="module")
def sphere():
    """Quadrature on the sphere and the plane-wave polarisation tensors."""
    nmu, nphi = 48, 96
    mu, wmu = L.leggauss(nmu)
    phi = np.arange(nphi) * 2 * np.pi / nphi
    MU, PHI = np.meshgrid(mu, phi, indexing="ij")
    W = (wmu[:, None] * np.ones(nphi)[None, :]) * (2 * np.pi / nphi)
    st = np.sqrt(1 - MU**2)
    k = np.stack([st * np.cos(PHI), st * np.sin(PHI), MU], axis=-1)            # propagation direction
    th = np.stack([MU * np.cos(PHI), MU * np.sin(PHI), -st], axis=-1)          # e_theta
    ph = np.stack([-np.sin(PHI), np.cos(PHI), np.zeros_like(PHI)], axis=-1)    # e_phi

    ep = outer(th, th) - outer(ph, ph)      # plus
    ex = outer(th, ph) + outer(ph, th)      # cross

    eps = np.zeros((3, 3, 3))
    eps[0, 1, 2] = eps[1, 2, 0] = eps[2, 0, 1] = 1
    eps[0, 2, 1] = eps[2, 1, 0] = eps[1, 0, 2] = -1

    def mag(e):
        """Gravitomagnetic partner of a plane-wave tidal tensor: B_ij = eps_ipq k_p E_qj."""
        return np.einsum("ipq,...p,...qj->...ij", eps, k, e)

    return {"W": W, "k": k, "th": th, "ph": ph, "ep": ep, "ex": ex, "bp": mag(ep), "bx": mag(ex)}


@pytest.fixture(scope="module")
def table(sphere):
    """max |integral| over 6 random axes, by kernel and by degree l -- the
    script's two tables, computed in the script's order with its seed."""
    W, k, th, ph = sphere["W"], sphere["k"], sphere["th"], sphere["ph"]
    ep, ex, bp, bx = sphere["ep"], sphere["ex"], sphere["bp"], sphere["bx"]
    rng = np.random.default_rng(0)

    kernels = {
        "I : <E E>": outer4(ep, ep) + outer4(ex, ex),
        "I : <E B>": outer4(ep, bp) + outer4(ex, bx),
        "I : <B B>": outer4(bp, bp) + outer4(bx, bx),
        "V : <E E>": outer4(ep, ex) - outer4(ex, ep),
        "V : <E B>": outer4(ep, bx) - outer4(ex, bp),
    }
    assert list(kernels) == list(EXPECTED_NONZERO)

    result = {}
    for name, K in kernels.items():
        for l in DEGREES:
            c = np.zeros(l + 1)
            c[l] = 1
            best = 0.0
            for _ in range(6):
                a = rng.normal(size=3)
                a /= np.linalg.norm(a)
                sky = L.legval(k @ a, c)
                T = np.einsum("ab,ab,abijkl->ijkl", W, sky, K)
                best = max(best, np.abs(T).max())
            result[name, l] = best

    # Linear polarization: Q -/+ iU carry spin weight -/+4, so their sky patterns
    # start at l = 4. With m = e_theta + i e_phi, e_plus + i e_cross = m (x) m and
    # the Q,U part of <E E> is Re[(Q - iU) (m m)_ij (m m)_kl].
    # A pure degree-l, spin -4 pattern is conj[(a.k)^(l-4) (a.m)^4] for complex null a.
    m = th + 1j * ph
    mm = outer(m, m)
    K_lin = outer4(mm, mm)
    for l in LINEAR_DEGREES:
        best = 0.0
        for _ in range(6):
            u = rng.normal(size=3)
            u /= np.linalg.norm(u)
            w = np.cross(u, rng.normal(size=3))
            w /= np.linalg.norm(w)
            a = u + 1j * w                      # complex null vector, a.a = 0
            sky = np.conj((k @ a) ** (l - 4) * (m @ a) ** 4)
            T = np.einsum("ab,ab,abijkl->ijkl", W, sky, K_lin)
            best = max(best, np.abs(T).max())
        result["QU: <E E>", l] = best
    return result


def test_quadrature_weights_cover_the_sphere(sphere):
    assert sphere["W"].sum() == pytest.approx(4 * np.pi, rel=1e-13)
    k = sphere["k"]
    assert np.allclose(np.einsum("abi,abi->ab", k, k), 1.0, atol=1e-14)


def test_plane_wave_magnetic_part_is_the_electric_part_rotated_by_45_degrees(sphere):
    ep, ex, bp, bx = sphere["ep"], sphere["ex"], sphere["bp"], sphere["bx"]
    for b in (bp, bx):
        assert np.allclose(b, np.swapaxes(b, -1, -2))                       # symmetric
        assert np.allclose(np.trace(b, axis1=-2, axis2=-1), 0)              # traceless
    assert np.allclose(bp, ex) or np.allclose(bp, -ex)                      # B(+) = +-cross
    assert np.allclose(bx, -ep) or np.allclose(bx, ep)                      # B(x) = -+plus


@pytest.mark.parametrize("name", list(EXPECTED_NONZERO))
def test_kernel_integrals_vanish_for_degree_5_and_above(table, name):
    for l in DEGREES:
        if l >= 5:
            assert table[name, l] < ZERO, f"{name} responds to l = {l}"


@pytest.mark.parametrize("name", list(EXPECTED_NONZERO))
def test_kernel_integrals_are_nonzero_exactly_where_the_script_shows(table, name):
    for l in DEGREES:
        if l in EXPECTED_NONZERO[name]:
            assert table[name, l] > NONZERO, f"{name} does not respond to l = {l}"
        else:
            assert table[name, l] < ZERO, f"{name} responds to l = {l}"


def test_band_limit_is_exactly_l_4(table):
    # some kernel responds at l = 4, none above: the band limit is 4, not lower
    assert max(table[name, 4] for name in EXPECTED_NONZERO) > NONZERO
    assert max(table[name, l] for name in EXPECTED_NONZERO for l in DEGREES if l >= 5) < ZERO
    # intensity feeds the even degrees of <EE>, <BB> and the odd ones of <EB>; circular polarisation the reverse
    assert EXPECTED_NONZERO["I : <E E>"] == EXPECTED_NONZERO["I : <B B>"] == EXPECTED_NONZERO["V : <E B>"]
    assert EXPECTED_NONZERO["I : <E B>"] == EXPECTED_NONZERO["V : <E E>"]


def test_values_printed_by_the_script(table):
    # calc/single_pixel_bandlimit.py prints these (3 significant figures)
    printed = {
        ("I : <E E>", 0): 6.70, ("I : <E E>", 2): 1.39, ("I : <E E>", 4): 0.304,
        ("I : <E B>", 1): 3.24, ("I : <E B>", 3): 0.688,
        ("I : <B B>", 0): 6.70, ("I : <B B>", 2): 1.40, ("I : <B B>", 4): 0.200,
        ("V : <E E>", 1): 3.26, ("V : <E E>", 3): 0.673,
        ("V : <E B>", 0): 6.70, ("V : <E B>", 2): 1.63, ("V : <E B>", 4): 0.191,
        ("QU: <E E>", 4): 21.7,
    }
    for key, value in printed.items():
        assert table[key] == pytest.approx(value, rel=5e-3), key
    # l = 0 is the isotropic sky: the integral of e+ e+ + ex ex has largest element 32 pi / 15
    assert table["I : <E E>", 0] == pytest.approx(32 * np.pi / 15, rel=1e-12)


def test_linear_polarisation_starts_and_stops_at_degree_4(table):
    assert table["QU: <E E>", 4] > NONZERO
    for l in LINEAR_DEGREES:
        if l >= 5:
            assert table["QU: <E E>", l] < ZERO, f"Q - iU responds to l = {l}"


def test_isotropic_pressure_is_invisible(sphere):
    # the TT projector annihilates delta_kl
    k = sphere["k"]
    P = np.eye(3) - outer(k, k)
    Lam = np.einsum("...ik,...jl->...ijkl", P, P) - 0.5 * np.einsum("...ij,...kl->...ijkl", P, P)
    assert np.abs(np.einsum("...ijkl,kl->...ij", Lam, np.eye(3))).max() < 1e-14
