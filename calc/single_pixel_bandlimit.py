"""Numerical test of a candidate 'single-pixel theorem'.

A point pixel records the gravitoelectric and gravitomagnetic tidal tensors
E_ij, B_ij of an incoherent superposition of plane gravitational waves.
Claim: its second-order statistics <EE>, <EB>, <BB> depend only on sky
multipoles l <= 4 of the Stokes parameters (I and V tested here).

Test: put I(k) = P_l(k . a) for random axes a (zonal harmonics about random
axes span the whole degree-l space) and integrate the kernels over the sphere.
"""
import numpy as np
from numpy.polynomial import legendre as L

rng = np.random.default_rng(0)

# quadrature on the sphere: Gauss-Legendre in cos(theta), uniform in phi
nmu, nphi = 48, 96
mu, wmu = L.leggauss(nmu)
phi = np.arange(nphi) * 2 * np.pi / nphi
MU, PHI = np.meshgrid(mu, phi, indexing="ij")
W = (wmu[:, None] * np.ones(nphi)[None, :]) * (2 * np.pi / nphi)
st = np.sqrt(1 - MU**2)
k = np.stack([st * np.cos(PHI), st * np.sin(PHI), MU], axis=-1)            # propagation dir
th = np.stack([MU * np.cos(PHI), MU * np.sin(PHI), -st], axis=-1)          # e_theta
ph = np.stack([-np.sin(PHI), np.cos(PHI), np.zeros_like(PHI)], axis=-1)    # e_phi

def outer(a, b):
    return a[..., :, None] * b[..., None, :]

ep = outer(th, th) - outer(ph, ph)      # plus
ex = outer(th, ph) + outer(ph, th)      # cross

eps = np.zeros((3, 3, 3))
eps[0, 1, 2] = eps[1, 2, 0] = eps[2, 0, 1] = 1
eps[0, 2, 1] = eps[2, 1, 0] = eps[1, 0, 2] = -1

def mag(e):
    """Gravitomagnetic partner of a plane-wave tidal tensor: B_ij = eps_ipq k_p E_qj."""
    return np.einsum("ipq,...p,...qj->...ij", eps, k, e)

bp, bx = mag(ep), mag(ex)
# sanity: B is symmetric, traceless, and a 45-degree rotation of E
assert np.allclose(bp, np.swapaxes(bp, -1, -2)) and np.allclose(np.trace(bp, axis1=-2, axis2=-1), 0)
print("plane wave: B(+) = +-cross ?", np.allclose(bp, ex) or np.allclose(bp, -ex),
      "| B(x) = -+plus ?", np.allclose(bx, -ep) or np.allclose(bx, ep))

def outer4(a, b):
    return a[..., :, :, None, None] * b[..., None, None, :, :]

kernels = {
    "I : <E E>": outer4(ep, ep) + outer4(ex, ex),
    "I : <E B>": outer4(ep, bp) + outer4(ex, bx),
    "I : <B B>": outer4(bp, bp) + outer4(bx, bx),
    "V : <E E>": outer4(ep, ex) - outer4(ex, ep),
    "V : <E B>": outer4(ep, bx) - outer4(ex, bp),
}

print("\nmax |integral| over 6 random axes, by multipole degree l of the sky pattern")
print(f"{'kernel':>10} " + " ".join(f"l={l:<7d}" for l in range(0, 9)))
for name, K in kernels.items():
    row = []
    for l in range(0, 9):
        c = np.zeros(l + 1); c[l] = 1
        best = 0.0
        for _ in range(6):
            a = rng.normal(size=3); a /= np.linalg.norm(a)
            sky = L.legval(k @ a, c)
            T = np.einsum("ab,ab,abijkl->ijkl", W, sky, K)
            best = max(best, np.abs(T).max())
        row.append(best)
    print(f"{name:>10} " + " ".join(f"{v:<9.2e}" for v in row))

# isotropic pressure is invisible: TT projector annihilates delta_kl
P = np.eye(3) - outer(k, k)
Lam = (np.einsum("...ik,...jl->...ijkl", P, P) - 0.5 * np.einsum("...ij,...kl->...ijkl", P, P))
print("\nmax |Lambda_ijkl delta_kl| over the sphere:", np.abs(np.einsum("...ijkl,kl->...ij", Lam, np.eye(3))).max())

# Linear polarization: Q -/+ iU carry spin weight -/+4, so their sky patterns
# start at l = 4. With m = e_theta + i e_phi, e_plus + i e_cross = m (x) m and
# the Q,U part of <E E> is Re[(Q - iU) (m m)_ij (m m)_kl].
# A pure degree-l, spin -4 pattern is conj[(a.k)^(l-4) (a.m)^4] for complex null a.
m = th + 1j * ph
mm = outer(m, m)
K_lin = outer4(mm, mm)
print("\nlinear polarization (Q - iU) pattern of degree l -> max |integral|")
print(f"{'kernel':>10} " + " ".join(f"l={l:<7d}" for l in range(4, 10)))
row = []
for l in range(4, 10):
    best = 0.0
    for _ in range(6):
        u = rng.normal(size=3); u /= np.linalg.norm(u)
        w = np.cross(u, rng.normal(size=3)); w /= np.linalg.norm(w)
        a = u + 1j * w                      # complex null vector, a.a = 0
        sky = np.conj((k @ a) ** (l - 4) * (m @ a) ** 4)
        T = np.einsum("ab,ab,abijkl->ijkl", W, sky, K_lin)
        best = max(best, np.abs(T).max())
    row.append(best)
print(f"{'QU: <E E>':>10} " + " ".join(f"{v:<9.2e}" for v in row))
print("(for a plane wave B is E rotated by 45 degrees, i.e. m m -> -/+ i m m, so <E B>, <B B> share this band limit)")
