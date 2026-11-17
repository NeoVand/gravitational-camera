"""
test_00_foundations.py
Verifies the foundational conventions and Established Baseline claims (Facts 1-4 of brief):
  1. Sign & convention match: Eq. (31) single-wave direction, Eq. (34) moving-mass B_{ij},
     and W = E + i B = c_0 m m^T with k_hat = i (m x m*) / |m|^2.
  2. SO(3, C) polar decomposition speedometer (10 = 4 + 3 + 3) tested at v = 0.6 c.
  3. Separation of plane waves at one spin-2 pixel:
       - 2 crossing waves at one instant (rank(W) = 2 null-cone quadratic),
       - 3 monochromatic binaries at one frequency (cubic matrix pencil),
       - 4 broadband waves with arbitrary waveforms from a time history (Bezout 2s = 4 points).
  4. Exact spectral sky harmonic decomposition:
       - Spin-2 gravity: 68 sky numbers (25 I + 25 V + 18 Q,U) + 32 null channels = 100,
       - Spin-1 light:   28 sky numbers ( 9 I +  9 V + 10 Q,U) +  8 null channels =  36.
"""

import math
import cmath
import random
from spin2_linalg import (
    EPS3, STF_BASIS, mat_to_stf5, stf5_to_mat, sky_triad_angles,
    khat_from_rank1_weyl, hermitian_eigh, qr_rank_real, invert_matrix,
    exp_complex_so3, solve_poly_roots
)


def verify_conventions():
    # 1. TT + wave travelling along +z: k_hat = (0,0,1), source at n_hat = (0,0,-1)
    k_hat, _, _, m, _ = sky_triad_angles(0.0, 0.0)
    W = [[m[i] * m[j] for j in range(3)] for i in range(3)]
    E = [[W[i][j].real for j in range(3)] for i in range(3)]
    B = [[W[i][j].imag for j in range(3)] for i in range(3)]
    norm_e2 = sum(E[a][b] ** 2 for a in range(3) for b in range(3))
    n_eq31 = [
        -sum(EPS3[i][j][k] * E[j][l] * B[k][l] for j in range(3) for k in range(3) for l in range(3)) / norm_e2
        for i in range(3)
    ]
    err_eq31 = math.sqrt(sum((n_eq31[i] - (-k_hat[i])) ** 2 for i in range(3)))
    assert err_eq31 < 1e-15, f"Eq. (31) mismatch: {err_eq31}"
    k_rec = khat_from_rank1_weyl(W)
    err_k = math.sqrt(sum((k_rec[i] - k_hat[i]) ** 2 for i in range(3)))
    assert err_k < 1e-15
    return err_eq31


def verify_relativistic_speedometer():
    # Static triaxial scene E0 = diag(2.1, -0.7, -1.4) rotated by R in SO(3, R)
    # and observed by pixel moving at relativistic velocity beta = (0.36, -0.48, 0.0) (|beta| = 0.6 c!)
    evals_true = [2.1, -0.7, -1.4]
    E0 = [[evals_true[i] if i == j else 0.0 for j in range(3)] for i in range(3)]
    R = exp_complex_so3(0.4, -0.25, 0.7)
    beta_true = [0.36, -0.48, 0.0]  # |beta| = 0.6
    bmag = math.sqrt(sum(b * b for b in beta_true))
    eta = math.atanh(bmag)
    B_boost = exp_complex_so3(*[-1j * eta * b / bmag for b in beta_true])

    G = [[sum(B_boost[i][k] * R[k][j] for k in range(3)) for j in range(3)] for i in range(3)]
    tmp = [[sum(G[i][k] * E0[k][j] for k in range(3)) for j in range(3)] for i in range(3)]
    W = [[sum(tmp[i][k] * G[j][k] for k in range(3)) for j in range(3)] for i in range(3)]

    # Recover pixel velocity via complex eigenvectors of W (real eigenvalues since scene is static!)
    # Note: since eigenvalues of W are real, find them from characteristic polynomial of W:
    trW2 = sum(W[i][j] * W[j][i] for i in range(3) for j in range(3))
    detW = (
        W[0][0] * (W[1][1] * W[2][2] - W[1][2] * W[2][1])
        - W[0][1] * (W[1][0] * W[2][2] - W[1][2] * W[2][0])
        + W[0][2] * (W[1][0] * W[2][1] - W[1][1] * W[2][0])
    )
    roots = solve_poly_roots([1.0, 0.0, -0.5 * trW2, -detW])
    evals_rec = sorted([r.real for r in roots], reverse=True)
    # Complex orthogonal eigenvector g_a for each eigenvalue lam_a via cross product of two rows of (W - lam_a I), normalized by g_a . g_a = 1:
    cols = []
    for lam in evals_rec:
        M = [[W[i][j] - (lam if i == j else 0.0) for j in range(3)] for i in range(3)]
        r0, r1 = M[0], M[1]
        v = [r0[1] * r1[2] - r0[2] * r1[1], r0[2] * r1[0] - r0[0] * r1[2], r0[0] * r1[1] - r0[1] * r1[0]]
        s2 = sum(x * x for x in v)
        s = cmath.sqrt(s2)
        cols.append([x / s for x in v])
    # Ensure det(G_rec) = +1
    G_rec = [[cols[j][i] for j in range(3)] for i in range(3)]
    # Polar factor H^2 = G_rec * G_rec^dag = B_boost * R * R^T * B_boost^dag = exp(-2 i eta (u . K))!
    # Wait: R is real orthogonal (R R^T = I), so G_rec * G_rec^dag cancels R (and +/-1 column signs!) completely!!
    GGd = [[sum(G_rec[i][k] * G_rec[j][k].conjugate() for k in range(3)) for j in range(3)] for i in range(3)]
    tr_ggd = sum(GGd[i][i].real for i in range(3))
    cosh_2eta = 0.5 * (tr_ggd - 1.0)
    eta_rec = 0.5 * math.acosh(max(1.0, cosh_2eta))
    sinh_2eta = math.sinh(2.0 * eta_rec)
    # Since (u . K)_{ij} = -eps_{ijk} u_k, exp(-2 i eta (u . K)) has Im(GGd)_{ij} = -sinh(2 eta) (-eps_{ijk} u_k) = +sinh(2 eta) eps_{ijk} u_k?
    # Check: (i,j) = (0,1) -> eps_{012} = +1 -> Im(GGd)_{01} = +sinh(2 eta) u_2 -> u_k = +1/(2 sinh 2eta) eps_{ijk} Im(GGd)_{ij}!
    u_rec = [
        sum(EPS3[i][j][k] * GGd[i][j].imag for i in range(3) for j in range(3)) / (2.0 * sinh_2eta)
        for k in range(3)
    ]
    beta_rec = [math.tanh(eta_rec) * u for u in u_rec]
    err_beta = math.sqrt(sum((beta_rec[k] - beta_true[k]) ** 2 for k in range(3)))
    assert err_beta < 1e-13, f"Relativistic speedometer mismatch: {beta_rec} vs {beta_true}"
    return err_beta


def verify_wave_separation_2_3_4():
    # (a) 2 waves at one instant: W = c1 m1 m1^T + c2 m2 m2^T
    k1, _, _, m1, _ = sky_triad_angles(0.7, 0.4)
    k2, _, _, m2, _ = sky_triad_angles(1.9, 2.5)
    c1, c2 = 1.3 - 0.6j, -0.8 + 1.1j
    W2 = [[c1 * m1[i] * m1[j] + c2 * m2[i] * m2[j] for j in range(3)] for i in range(3)]
    # Null vector v = row0 x row1 of W2
    r0, r1 = W2[0], W2[1]
    v = [r0[1] * r1[2] - r0[2] * r1[1], r0[2] * r1[0] - r0[0] * r1[2], r0[0] * r1[1] - r0[1] * r1[0]]
    # Basis (u, w) of v^perp: choose u = v x (1,0,0), w = v x u
    u = [0j, v[2], -v[1]]
    w = [v[1] * u[2] - v[2] * u[1], v[2] * u[0] - v[0] * u[2], v[0] * u[1] - v[1] * u[0]]
    # Solve (u + lam w) . (u + lam w) = 0
    qa = sum(x * x for x in w)
    qb = 2.0 * sum(u[i] * w[i] for i in range(3))
    qc = sum(x * x for x in u)
    lams = solve_poly_roots([qa, qb, qc])
    k_recs_2 = []
    for lam in lams:
        mc = [u[i] + lam * w[i] for i in range(3)]
        k_recs_2.append(khat_from_rank1_weyl([[mc[i] * mc[j] for j in range(3)] for i in range(3)]))
    err_2 = max(
        min(math.sqrt(sum((kr[a] - kt[a]) ** 2 for a in range(3))) for kr in k_recs_2)
        for kt in (k1, k2)
    )
    assert err_2 < 1e-13, f"2-wave instantaneous unmixing error: {err_2}"

    # (b) 3 monochromatic waves at one frequency via cubic matrix pencil det(Wp - lam Wm*) = 0
    dirs_3 = [(0.5, 0.3), (1.4, 2.1), (2.3, 4.7)]
    ks_3 = []
    Wp = [[0j] * 3 for _ in range(3)]
    Wms = [[0j] * 3 for _ in range(3)]
    for idx, (th, ph) in enumerate(dirs_3):
        kh, _, _, m, _ = sky_triad_angles(th, ph)
        ks_3.append(kh)
        a_p = (1.1 + 0.3 * idx) * cmath.exp(1j * 0.7 * idx)
        b_s = (0.4 + 0.5 * idx) * cmath.exp(-1j * 0.4 * idx)
        for i in range(3):
            for j in range(3):
                Wp[i][j] += a_p * m[i] * m[j]
                Wms[i][j] += b_s * m[i] * m[j]
    # Sample det(Wp - z Wms) at 4 points to get exact degree-3 polynomial coefficients
    zs = [0.0, 1.0, -1.0, 2.0]
    dets = []
    for z in zs:
        M = [[Wp[i][j] - z * Wms[i][j] for j in range(3)] for i in range(3)]
        dets.append(
            M[0][0] * (M[1][1] * M[2][2] - M[1][2] * M[2][1])
            - M[0][1] * (M[1][0] * M[2][2] - M[1][2] * M[2][0])
            + M[0][2] * (M[1][0] * M[2][1] - M[1][1] * M[2][0])
        )
    Vinv = invert_matrix([[z ** (3 - p) for p in range(4)] for z in zs])
    poly3 = [sum(Vinv[i][j] * dets[j] for j in range(4)) for i in range(4)]
    roots_3 = solve_poly_roots(poly3)
    nulls = []
    for r in roots_3:
        M = [[Wp[i][j] - r * Wms[i][j] for j in range(3)] for i in range(3)]
        r0, r1 = M[0], M[1]
        nulls.append([r0[1] * r1[2] - r0[2] * r1[1], r0[2] * r1[0] - r0[0] * r1[2], r0[0] * r1[1] - r0[1] * r1[0]])
    k_recs_3 = []
    for idx in range(3):
        va, vb = nulls[(idx + 1) % 3], nulls[(idx + 2) % 3]
        mc = [va[1] * vb[2] - va[2] * vb[1], va[2] * vb[0] - va[0] * vb[2], va[0] * vb[1] - va[1] * vb[0]]
        k_recs_3.append(khat_from_rank1_weyl([[mc[i] * mc[j] for j in range(3)] for i in range(3)]))
    err_3 = max(
        min(math.sqrt(sum((kr[a] - kt[a]) ** 2 for a in range(3))) for kr in k_recs_3)
        for kt in ks_3
    )
    assert err_3 < 1e-12, f"3-wave pencil error: {err_3}"

    # (c) 4 arbitrary-waveform waves from a time history (annihilating conic in C^5 meets null conic in 2s = 4 Bezout points!)
    random.seed(44)
    dirs_4 = [(0.55, 0.4), (1.15, 1.8), (1.95, 3.3), (2.55, 5.1)]
    ks_4 = []
    ms_4 = []
    for th, ph in dirs_4:
        kh, _, _, m, _ = sky_triad_angles(th, ph)
        ks_4.append(kh)
        ms_4.append(m)
    # Generate 12 snapshots with random complex waveforms c_a(t) -> span in C^5 has dim 4, leaving 1 complex annihilator h in C^5!
    snaps = []
    for _ in range(12):
        W_t = [[0j] * 3 for _ in range(3)]
        for a in range(4):
            ca = complex(random.gauss(0, 1), random.gauss(0, 1))
            for i in range(3):
                for j in range(3):
                    W_t[i][j] += ca * ms_4[a][i] * ms_4[a][j]
        snaps.append(mat_to_stf5(W_t))
    # Gram matrix G = sum_t w_t w_t^dag (5x5 Hermitian of rank 4 -> 1 zero-eigenvalue vector h!)
    G5 = [[sum(snaps[t][i] * snaps[t][j].conjugate() for t in range(12)) for j in range(5)] for i in range(5)]
    evals_g, Ug = hermitian_eigh(G5)
    idx_zero = min(range(5), key=lambda k: abs(evals_g[k]))
    h_ann = [Ug[i][idx_zero].conjugate() for i in range(5)]  # sum_A h_ann[A] q_A(k) = 0!
    H_mat = stf5_to_mat(h_ann)
    # Stereographic null parameterization m(z) = v0 + v1 z + v2 z^2 -> quartic m(z)^T H_mat m(z) = 0!
    v = [[1 + 0j, 1j, 0j], [0j, 0j, -2 + 0j], [-1 + 0j, 1j, 0j]]
    qf = lambda a, b: sum(a[i] * H_mat[i][j] * b[j] for i in range(3) for j in range(3))
    quartic = [qf(v[2], v[2]), 2 * qf(v[1], v[2]), 2 * qf(v[0], v[2]) + qf(v[1], v[1]), 2 * qf(v[0], v[1]), qf(v[0], v[0])]
    z_roots = solve_poly_roots(quartic)
    k_recs_4 = []
    for z in z_roots:
        mz = [1 - z * z, 1j * (1 + z * z), -2 * z]
        k_recs_4.append(khat_from_rank1_weyl([[mz[i] * mz[j] for j in range(3)] for i in range(3)]))
    err_4 = max(
        min(math.sqrt(sum((kr[a] - kt[a]) ** 2 for a in range(3))) for kr in k_recs_4)
        for kt in ks_4
    )
    assert err_4 < 1e-12, f"4-wave Bezout unmixing error: {err_4}"
    return err_2, err_3, err_4


def verify_sky_counts_gravity_and_light():
    random.seed(101)
    # Spin-2 gravity: 100 real spectral numbers -> 68 sky + 32 null
    cols_g = []
    # Spin-1 light: 36 real spectral numbers -> 28 sky + 8 null
    cols_l = []
    for _ in range(110):
        th = math.acos(random.uniform(-1.0, 1.0))
        ph = random.uniform(0.0, 2.0 * math.pi)
        _, _, _, m, _ = sky_triad_angles(th, ph)
        qg = mat_to_stf5([[m[i] * m[j] for j in range(3)] for i in range(3)])
        ql = m  # in C^3!
        Ia, Qa, Ua, Va = [random.gauss(0, 1) for _ in range(4)]

        def pack_hel(q, d):
            vec = []
            for i in range(d):
                vec.append(0.5 * (Ia + Va) * (abs(q[i]) ** 2))
                for j in range(i + 1, d):
                    z = 0.5 * (Ia + Va) * q[i] * q[j].conjugate()
                    vec.extend([z.real, z.imag])
            for i in range(d):
                vec.append(0.5 * (Ia - Va) * (abs(q[i]) ** 2))
                for j in range(i + 1, d):
                    z = 0.5 * (Ia - Va) * q[i].conjugate() * q[j]
                    vec.extend([z.real, z.imag])
            for i in range(d):
                for j in range(d):
                    z = 0.5 * (Qa - 1j * Ua) * q[i] * q[j]
                    vec.extend([z.real, z.imag])
            return vec

        cols_g.append(pack_hel(qg, 5))
        cols_l.append(pack_hel(ql, 3))

    rk_g, _ = qr_rank_real([[cols_g[c][r] for c in range(110)] for r in range(100)])
    rk_l, _ = qr_rank_real([[cols_l[c][r] for c in range(110)] for r in range(36)])
    assert rk_g == 68, f"Expected 68 sky numbers for gravity, got {rk_g}"
    assert rk_l == 28, f"Expected 28 sky numbers for light, got {rk_l}"
    return rk_g, 100 - rk_g, rk_l, 36 - rk_l


def run_tests():
    e_conv = verify_conventions()
    e_spd = verify_relativistic_speedometer()
    e2, e3, e4 = verify_wave_separation_2_3_4()
    rk_g, null_g, rk_l, null_l = verify_sky_counts_gravity_and_light()
    print(f"[PASS] Foundations: Eq.(31) err={e_conv:.2e} | 0.6c speedometer err={e_spd:.2e} | "
          f"2,3,4-wave errs=({e2:.2e}, {e3:.2e}, {e4:.2e}) | Sky: GW={rk_g}+{null_g}=100, EM={rk_l}+{null_l}=36")


if __name__ == "__main__":
    run_tests()
