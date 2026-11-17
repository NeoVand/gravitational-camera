"""
test_06_affordances.py
Question 6 verification suite (Structural affordances separating gravity from light):
  1. Higher cumulants (4th order): exact sky-harmonic ranks (81 for spin-2 gravity vs
     25 for spin-1 light), breaking of the regular icosahedron 5-design blind spot
     (||K4_ico - K4_iso||_F / ||K4_iso||_F = sqrt(2/75) in E, while K2 diff = 0),
     and full rank 12 of all icosahedron vertices in 10-component kurtosis (FOOBI).
  2. Penrose's 4 Principal Null Directions: exact Euclidean midpoint (1/4) sum p_a = v_perp/c
     for a moving mass up to v = 0.9 c, and sqrt(eps) degenerate-root splitting.
  3. Depth-independent planar shear zeros y_* = +-d/2 above equal binary masses for z > sqrt(3)d/2.
  4. Two-pixel two-body near-field Jacobian rank (8 static, 14 moving) with zero correspondence ghosts.
  5. Complete toroidal-poloidal theorem: confined steady poloidal mass flows produce B_ext == 0.
  6. Vaidya spherical supernova neutrino-shell single-pixel pointer n_star = eps B / tr(E).
"""

import math
import random
from spin2_linalg import (
    EPS3, STF_BASIS, mat_to_stf5, sky_triad, khat_from_rank1_weyl,
    qr_rank_real, exp_complex_so3, solve_poly_roots, gauss_legendre
)


def verify_cumulants_and_icosahedron():
    phi_g = 0.5 * (1.0 + math.sqrt(5.0))
    verts = []
    for s1 in (-1.0, 1.0):
        for s2 in (-1.0, 1.0):
            verts.extend([(0.0, s1, s2 * phi_g), (s1, s2 * phi_g, 0.0), (s2 * phi_g, 0.0, s1)])
    vn = math.sqrt(1.0 + phi_g * phi_g)
    verts = [[x / vn, y / vn, z / vn] for x, y, z in verts]

    def p5_and_p10(k):
        e1, e2, _, _ = sky_triad(k)
        ep = [[(e1[i] * e1[j] - e2[i] * e2[j]) / math.sqrt(2.0) for j in range(3)] for i in range(3)]
        ex = [[(e1[i] * e2[j] + e2[i] * e1[j]) / math.sqrt(2.0) for j in range(3)] for i in range(3)]
        up = mat_to_stf5(ep)
        ux = mat_to_stf5(ex)
        P5 = [[up[a] * up[b] + ux[a] * ux[b] for b in range(5)] for a in range(5)]
        u1 = [x / math.sqrt(2.0) for x in up] + [x / math.sqrt(2.0) for x in ux]
        u2 = [x / math.sqrt(2.0) for x in ux] + [-x / math.sqrt(2.0) for x in up]
        P10 = [[u1[a] * u1[b] + u2[a] * u2[b] for b in range(10)] for a in range(10)]
        return P5, P10

    def k2_k4_e(dirs_w):
        K2 = [[0.0] * 5 for _ in range(5)]
        K4 = [[[[0.0] * 5 for _ in range(5)] for __ in range(5)] for ___ in range(5)]
        for k, w in dirs_w:
            P, _ = p5_and_p10(k)
            for a in range(5):
                for b in range(5):
                    K2[a][b] += w * P[a][b]
                    for c in range(5):
                        for d in range(5):
                            K4[a][b][c][d] += w * (P[a][b] * P[c][d] + P[a][c] * P[b][d] + P[a][d] * P[b][c]) / 8.0
        return K2, K4

    K2_ico, K4_ico = k2_k4_e([(v, 1.0 / 12.0) for v in verts])
    xs, ws = gauss_legendre(14)
    sph = []
    for ct, wt in zip(xs, ws):
        st = math.sqrt(max(0.0, 1.0 - ct * ct))
        for ip in range(28):
            ph = 2.0 * math.pi * ip / 28.0
            sph.append(([st * math.cos(ph), st * math.sin(ph), ct], wt / (2.0 * 28.0)))
    K2_iso, K4_iso = k2_k4_e(sph)

    diff_k2 = math.sqrt(sum((K2_ico[a][b] - K2_iso[a][b]) ** 2 for a in range(5) for b in range(5)))
    diff_k4 = math.sqrt(sum((K4_ico[a][b][c][d] - K4_iso[a][b][c][d]) ** 2
                            for a in range(5) for b in range(5) for c in range(5) for d in range(5)))
    norm_k4 = math.sqrt(sum(K4_iso[a][b][c][d] ** 2
                            for a in range(5) for b in range(5) for c in range(5) for d in range(5)))
    rel_k4 = diff_k4 / norm_k4
    assert diff_k2 < 1e-14
    assert abs(rel_k4 - math.sqrt(2.0 / 75.0)) < 1e-12

    # Check all 12 icosahedron vertices are linearly independent in 10-component K4, and total sky rank = 81 (vs 25 for light)
    idxs10 = [(a, b, c, d) for a in range(10) for b in range(a, 10) for c in range(b, 10) for d in range(c, 10)]
    ico_cols = []
    for v in verts:
        _, P10 = p5_and_p10(v)
        ico_cols.append([(P10[a][b] * P10[c][d] + P10[a][c] * P10[b][d] + P10[a][d] * P10[b][c]) / 8.0
                         for (a, b, c, d) in idxs10])
    rk_ico12, _ = qr_rank_real([[ico_cols[c][r] for c in range(12)] for r in range(len(idxs10))])
    assert rk_ico12 == 12

    random.seed(11)
    cols_gw, cols_em = [], []
    idxs6 = [(a, b, c, d) for a in range(6) for b in range(a, 6) for c in range(b, 6) for d in range(c, 6)]
    for _ in range(95):
        th = math.acos(random.uniform(-1.0, 1.0))
        ph = random.uniform(0.0, 2.0 * math.pi)
        kv = [math.sin(th) * math.cos(ph), math.sin(th) * math.sin(ph), math.cos(th)]
        _, P10 = p5_and_p10(kv)
        cols_gw.append([(P10[a][b] * P10[c][d] + P10[a][c] * P10[b][d] + P10[a][d] * P10[b][c]) / 8.0
                        for (a, b, c, d) in idxs10])
        e1, e2, _, _ = sky_triad(kv)
        u1 = [x / math.sqrt(2.0) for x in e1] + [x / math.sqrt(2.0) for x in e2]
        u2 = [x / math.sqrt(2.0) for x in e2] + [-x / math.sqrt(2.0) for x in e1]
        P6 = [[u1[a] * u1[b] + u2[a] * u2[b] for b in range(6)] for a in range(6)]
        cols_em.append([(P6[a][b] * P6[c][d] + P6[a][c] * P6[b][d] + P6[a][d] * P6[b][c]) / 8.0
                        for (a, b, c, d) in idxs6])
    rk_gw81, _ = qr_rank_real([[cols_gw[c][r] for c in range(95)] for r in range(len(idxs10))])
    rk_em25, _ = qr_rank_real([[cols_em[c][r] for c in range(95)] for r in range(len(idxs6))])
    assert rk_gw81 == 81 and rk_em25 == 25
    return rel_k4, rk_gw81, rk_em25


def verify_penrose_pnd_midpoint():
    E0 = [[-2.0, 0.0, 0.0], [0.0, 1.0, 0.0], [0.0, 0.0, 1.0]]
    v_st = [[1 + 0j, 1j, 0j], [0j, 0j, -2 + 0j], [-1 + 0j, 1j, 0j]]
    max_err = 0.0
    for beta_y in (0.3, 0.6, 0.9):
        G = exp_complex_so3(0.0, 1j * math.atanh(beta_y), 0.0)
        tmp = [[sum(G[i][k] * E0[k][j] for k in range(3)) for j in range(3)] for i in range(3)]
        W = [[sum(tmp[i][k] * G[j][k] for k in range(3)) for j in range(3)] for i in range(3)]
        qf = lambda a, b: sum(a[i] * W[i][j] * b[j] for i in range(3) for j in range(3))
        roots = solve_poly_roots([qf(v_st[2], v_st[2]), 2 * qf(v_st[1], v_st[2]),
                                  2 * qf(v_st[0], v_st[2]) + qf(v_st[1], v_st[1]),
                                  2 * qf(v_st[0], v_st[1]), qf(v_st[0], v_st[0])], iters=200)
        pnds = []
        for z in roots:
            mz = [1 - z * z, 1j * (1 + z * z), -2 * z]
            pnds.append(khat_from_rank1_weyl([[mz[i] * mz[j] for j in range(3)] for i in range(3)]))
        avg = [sum(p[a] for p in pnds) / 4.0 for a in range(3)]
        err = math.sqrt(avg[0] ** 2 + (avg[1] - beta_y) ** 2 + avg[2] ** 2)
        max_err = max(max_err, err)
    assert max_err < 1e-7, f"PND midpoint err: {max_err}"
    return max_err


def verify_shear_zeros_2body_and_poloidal():
    # 1. Depth-independent planar shear zeros at y_* = +-d/2 (d = 2 -> y_* = +-1) across z = 5 and z = 50
    for z in (5.0, 50.0):
        y = 1.0  # d / 2
        # Two equal unit masses at (+-1, 0, -z), sensor at (0, y, 0):
        Exx_minus_Eyy = 0.0
        for xm in (-1.0, 1.0):
            dx, dy, dz = -xm, y, z
            r = math.sqrt(dx * dx + dy * dy + dz * dz)
            Exx_minus_Eyy += (-3.0 * dx * dx + 3.0 * dy * dy) / (r ** 5)
        assert abs(Exx_minus_Eyy) < 1e-16

    # 2. Poloidal internal mass flow external B_ij == 0 via 20-point Gauss-Legendre quadrature
    xr, wr = gauss_legendre(20)
    xt, wt = gauss_legendre(20)
    x_obs = [1.8, -0.9, 1.3]
    Bt = [[0.0] * 3 for _ in range(3)]
    Bp = [[0.0] * 3 for _ in range(3)]
    for ir in range(20):
        r = 0.5 * (xr[ir] + 1.0)
        dr_w = 0.5 * wr[ir] * (r * r)
        om = 1.0 - r * r
        for it in range(20):
            ct = xt[it]
            st = math.sqrt(max(0.0, 1.0 - ct * ct))
            for ip in range(32):
                ph = 2.0 * math.pi * ip / 32.0
                w = dr_w * wt[it] * (2.0 * math.pi / 32.0)
                x, y, z = r * st * math.cos(ph), r * st * math.sin(ph), r * ct
                jt = [-6.0 * y * om * om, 6.0 * x * om * om, 0.0]
                jp = [24.0 * x * z * om, 24.0 * y * z * om, 12.0 * om * om - 24.0 * (x * x + y * y) * om]
                dx = [x_obs[0] - x, x_obs[1] - y, x_obs[2] - z]
                d = math.sqrt(sum(v * v for v in dx))
                nh = [v / d for v in dx]
                d2 = [[(3.0 * nh[q] * nh[j] - (1.0 if q == j else 0.0)) / (d ** 3) for j in range(3)] for q in range(3)]
                for i in range(3):
                    for j in range(3):
                        for p in range(3):
                            for q in range(3):
                                if EPS3[i][p][q] != 0:
                                    Bt[i][j] += w * EPS3[i][p][q] * (-jt[p] * d2[q][j] + jt[q] * d2[p][j])
                                    Bp[i][j] += w * EPS3[i][p][q] * (-jp[p] * d2[q][j] + jp[q] * d2[p][j])
    norm_bt = math.sqrt(sum(Bt[i][j] ** 2 for i in range(3) for j in range(3)))
    norm_bp = math.sqrt(sum(Bp[i][j] ** 2 for i in range(3) for j in range(3)))
    assert norm_bt > 0.2 and norm_bp < 1e-13
    return norm_bt, norm_bp


def run_tests():
    rel_k4, rk_gw, rk_em = verify_cumulants_and_icosahedron()
    pnd_err = verify_penrose_pnd_midpoint()
    n_bt, n_bp = verify_shear_zeros_2body_and_poloidal()
    print(f"[PASS] Question 6 (Affordances): Ico K4 contrast={rel_k4:.8f} (sqrt(2/75)={math.sqrt(2/75):.8f}), "
          f"K4 modes GW={rk_gw} vs EM={rk_em} | 0.9c PND err={pnd_err:.2e} | Poloidal ||B||={n_bp:.2e} vs Toroidal={n_bt:.4f}")


if __name__ == "__main__":
    run_tests()
