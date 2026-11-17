"""
test_01_ranging.py
Question 1 verification suite:
  1. Exact linearized quadrupole Weyl evaluator (Eq. 41 of draft) via 3D polynomial auto-diff.
  2. Exact 5-zone Sachs peeling matrix W_hat = U^dag W U^* through O(r^-5).
  3. Universal general-quadrupole ranging law:
       s2 / s1 = (c^2 / r^2) |3 Q^(4)_{m*m*} Q^(2)_{kk} - 4 (Q^(3)_{m*k})^2| / |Q^(4)_{m*m*}|^2.
  4. Closed-form C(iota, theta) for a rotating mass quadrupole, face-on 3/(2 (kr)^4) law,
     and 1D linear oscillator C_lin(iota, theta).
  5. Frequency-domain C_+(iota) = 2 tan^2(iota/2), C_-(iota) = 2 cot^2(iota/2),
     inclination-eliminated range estimator, and O(1/(kr)) two-helicity aberration split
     Delta_theta_+- = 8 |cot(iota)| / (kr).
"""

import math
import random
from spin2_linalg import (
    EPS3, STF_BASIS, sky_triad, svd_3x3_exact, khat_from_rank1_weyl,
    N_MON3D, POLY3_C0_IDX, POLY3_MON_IDX, poly3_zero, poly3_const,
    poly3_add, poly3_mul, poly3_deriv
)


def eval_quadrupole_weyl_exact(x_obs, Q_derivs):
    """
    Exact linearized electric tide E, magnetic tide B, and Weyl matrix W = E + i B
    at x_obs = [x, y, z] (with G = c = 1) for a source with retarded time derivatives
    Q_derivs = [Q^(0), Q^(1), ..., Q^(8)] evaluated at u = t - r.
    """
    r0 = math.sqrt(sum(v * v for v in x_obs))
    s_poly = poly3_zero()
    s_poly[POLY3_MON_IDX[(1, 0, 0)]] = 2.0 * x_obs[0]
    s_poly[POLY3_MON_IDX[(0, 1, 0)]] = 2.0 * x_obs[1]
    s_poly[POLY3_MON_IDX[(0, 0, 1)]] = 2.0 * x_obs[2]
    s_poly[POLY3_MON_IDX[(2, 0, 0)]] = 1.0
    s_poly[POLY3_MON_IDX[(0, 2, 0)]] = 1.0
    s_poly[POLY3_MON_IDX[(0, 0, 2)]] = 1.0

    u_poly = [v / (r0 * r0) for v in s_poly]
    u2 = poly3_mul(u_poly, u_poly)
    u3 = poly3_mul(u2, u_poly)
    u4 = poly3_mul(u3, u_poly)

    dr = [r0 * (0.5 * u_poly[i] - 0.125 * u2[i] + 0.0625 * u3[i] - (5.0 / 128.0) * u4[i]) for i in range(N_MON3D)]
    invr = [
        (1.0 / r0) * ((1.0 if i == POLY3_C0_IDX else 0.0) - 0.5 * u_poly[i] + 0.375 * u2[i]
                      - 0.3125 * u3[i] + (35.0 / 128.0) * u4[i])
        for i in range(N_MON3D)
    ]
    dr2 = poly3_mul(dr, dr)
    dr3 = poly3_mul(dr2, dr)
    dr4 = poly3_mul(dr3, dr)

    F = {}
    for n in range(5):
        F[n] = [[None] * 3 for _ in range(3)]
        for a in range(3):
            for b in range(3):
                qp = poly3_const(Q_derivs[n][a][b])
                qp = poly3_add(qp, dr, -Q_derivs[n + 1][a][b])
                qp = poly3_add(qp, dr2, 0.5 * Q_derivs[n + 2][a][b])
                qp = poly3_add(qp, dr3, -(1.0 / 6.0) * Q_derivs[n + 3][a][b])
                qp = poly3_add(qp, dr4, (1.0 / 24.0) * Q_derivs[n + 4][a][b])
                F[n][a][b] = [2.0 * v for v in poly3_mul(qp, invr)]

    S, T = {}, {}
    for n in (0, 1, 2):
        sp, tp = poly3_zero(), poly3_zero()
        for a in range(3):
            tp = poly3_add(tp, F[n][a][a], 1.0)
            for b in range(3):
                sp = poly3_add(sp, poly3_deriv(poly3_deriv(F[n][a][b], b), a), 1.0)
        S[n], T[n] = sp, tp

    h00 = [0.5 * (S[0][m] + T[2][m]) for m in range(N_MON3D)]
    h0i_0 = [poly3_zero() for _ in range(3)]
    h0i_1 = [poly3_zero() for _ in range(3)]
    for i in range(3):
        for b in range(3):
            h0i_0[i] = poly3_add(h0i_0[i], poly3_deriv(F[1][i][b], b), 1.0)
            h0i_1[i] = poly3_add(h0i_1[i], poly3_deriv(F[2][i][b], b), 1.0)

    T3, T4 = poly3_zero(), poly3_zero()
    for a in range(3):
        T3 = poly3_add(T3, F[3][a][a], 1.0)
        T4 = poly3_add(T4, F[4][a][a], 1.0)

    hij_1 = [[None] * 3 for _ in range(3)]
    hij_2 = [[None] * 3 for _ in range(3)]
    for i in range(3):
        for j in range(3):
            p1, p2 = F[3][i][j][:], F[4][i][j][:]
            if i == j:
                p1 = [p1[m] + 0.5 * (S[1][m] - T3[m]) for m in range(N_MON3D)]
                p2 = [p2[m] + 0.5 * (S[2][m] - T4[m]) for m in range(N_MON3D)]
            hij_1[i][j], hij_2[i][j] = p1, p2

    c0 = POLY3_C0_IDX
    E = [[0.0] * 3 for _ in range(3)]
    B = [[0.0] * 3 for _ in range(3)]
    for i in range(3):
        for j in range(3):
            E[i][j] = 0.5 * (
                poly3_deriv(h0i_1[j], i)[c0]
                + poly3_deriv(h0i_1[i], j)[c0]
                - hij_2[i][j][c0]
                - poly3_deriv(poly3_deriv(h00, j), i)[c0]
            )
            sb = 0.0
            for p in range(3):
                for q in range(3):
                    if EPS3[i][p][q] != 0:
                        rpqj0 = 0.5 * (
                            poly3_deriv(poly3_deriv(h0i_0[p], j), q)[c0]
                            + poly3_deriv(hij_1[q][j], p)[c0]
                            - poly3_deriv(poly3_deriv(h0i_0[q], j), p)[c0]
                            - poly3_deriv(hij_1[p][j], q)[c0]
                        )
                        sb += 0.5 * EPS3[i][p][q] * rpqj0
            B[i][j] = sb
    W = [[E[i][j] + 1j * B[i][j] for j in range(3)] for i in range(3)]
    return E, B, W


def rotating_quadrupole_derivs(theta, omega=1.0):
    """Q_{xx} = -Q_{yy} = cos(theta), Q_{xy} = sin(theta) at wave phase theta = omega u."""
    out = []
    for n in range(9):
        c = math.cos(theta + 0.5 * n * math.pi) * (omega ** n)
        s = math.sin(theta + 0.5 * n * math.pi) * (omega ** n)
        out.append([[c, s, 0.0], [s, -c, 0.0], [0.0, 0.0, 0.0]])
    return out


def C_rotating_quadrupole(iota, theta):
    """Exact closed-form ranging constant C(iota, theta) in s2/s1 = C/(kr)^2."""
    ci, si = math.cos(iota), math.sin(iota)
    ct, st = math.cos(theta), math.sin(theta)
    re = (1.0 - 3.0 * ci * ci) * ct * ct - 4.0 * ci * ci * st * st
    im = -2.0 * ci * st * ct
    num = 2.0 * si * si * math.hypot(re, im)
    den = ((1.0 + ci * ci) ** 2) * ct * ct + 4.0 * ci * ci * st * st
    return num / den


def verify_peeling_and_general_formula():
    random.seed(42)
    max_peel_err = 0.0
    max_gen_err = 0.0
    for _ in range(5):
        v = [random.gauss(0, 1) for _ in range(3)]
        vn = math.sqrt(sum(x * x for x in v))
        kh = [x / vn for x in v]
        _, _, m, ms = sky_triad(kh)
        U = [[m[i], ms[i], kh[i]] for i in range(3)]

        Q_d = []
        for _n in range(9):
            A = [[random.gauss(0, 1) for _ in range(3)] for __ in range(3)]
            S = [[0.5 * (A[i][j] + A[j][i]) for j in range(3)] for i in range(3)]
            tr = (S[0][0] + S[1][1] + S[2][2]) / 3.0
            for i in range(3):
                S[i][i] -= tr
            Q_d.append(S)

        qf = lambda u, Q, w: sum(u[i] * Q[i][j] * w[j] for i in range(3) for j in range(3))

        # Check exact 5-zone peeling matrix W_hat at finite r = 3.7!
        r = 3.7
        _, _, W = eval_quadrupole_weyl_exact([r * kh[0], r * kh[1], r * kh[2]], Q_d)
        # W_hat = U^dag W U^*
        tmp = [[sum(W[i][k] * U[k][j].conjugate() for k in range(3)) for j in range(3)] for i in range(3)]
        W_hat_num = [[sum(U[k][i].conjugate() * tmp[k][j] for k in range(3)) for j in range(3)] for i in range(3)]

        al = -(1.0 / r) * (2 * qf(ms, Q_d[4], ms) + 4 / r * qf(ms, Q_d[3], ms) + 6 / r ** 2 * qf(ms, Q_d[2], ms)
                           + 6 / r ** 3 * qf(ms, Q_d[1], ms) + 3 / r ** 4 * qf(ms, Q_d[0], ms))
        be = +(1.0 / r ** 2) * (4 * qf(ms, Q_d[3], kh) + 12 / r * qf(ms, Q_d[2], kh)
                                + 18 / r ** 2 * qf(ms, Q_d[1], kh) + 12 / r ** 3 * qf(ms, Q_d[0], kh))
        ga = -(1.0 / r ** 3) * (3 * qf(kh, Q_d[2], kh) + 9 / r * qf(kh, Q_d[1], kh) + 9 / r ** 2 * qf(kh, Q_d[0], kh))
        ep4 = +(1.0 / r ** 4) * (6 * qf(m, Q_d[1], kh) + 12 / r * qf(m, Q_d[0], kh))
        de5 = -(3.0 / r ** 5) * qf(m, Q_d[0], m)
        W_hat_ana = [[al, -ga, be], [-ga, de5, ep4], [be, ep4, 2 * ga]]

        err = max(abs(W_hat_num[i][j] - W_hat_ana[i][j]) for i in range(3) for j in range(3))
        max_peel_err = max(max_peel_err, err)

        # Check general quadrupole leading O(r^-2) formula by 4-point Richardson extrapolation at r = 50, 100, 200, 400
        pred = abs(3.0 * qf(ms, Q_d[4], ms) * qf(kh, Q_d[2], kh) - 4.0 * (qf(ms, Q_d[3], kh) ** 2)) / (abs(qf(ms, Q_d[4], ms)) ** 2)
        vals = []
        for rv in (50.0, 100.0, 200.0, 400.0):
            _, _, Wv = eval_quadrupole_weyl_exact([rv * kh[0], rv * kh[1], rv * kh[2]], Q_d)
            s1, s2, _ = svd_3x3_exact(Wv)
            vals.append(rv * rv * s2 / s1)
        g = [2.0 * vals[i + 1] - vals[i] for i in range(3)]          # eliminates 1/r
        h = [(4.0 * g[i + 1] - g[i]) / 3.0 for i in range(2)]        # eliminates 1/r^2
        ext = (8.0 * h[1] - h[0]) / 7.0                              # eliminates 1/r^3
        max_gen_err = max(max_gen_err, abs(ext - pred) / pred)

    assert max_peel_err < 1e-14, f"Peeling matrix mismatch: {max_peel_err}"
    assert max_gen_err < 1e-5, f"General formula mismatch: {max_gen_err}"
    return max_peel_err, max_gen_err


def verify_rotating_and_fourier_laws():
    # 1. Instantaneous C(iota, theta)
    max_c_err = 0.0
    for iota_deg in (15.0, 30.0, 45.0, 60.0, 75.0, 90.0):
        for theta_deg in (0.0, 30.0, 45.0, 60.0, 90.0):
            if iota_deg == 90.0 and theta_deg == 90.0:
                continue
            iota, theta = math.radians(iota_deg), math.radians(theta_deg)
            kh = [math.sin(iota), 0.0, math.cos(iota)]
            vals = []
            for rv in (80.0, 160.0, 320.0):
                _, _, W = eval_quadrupole_weyl_exact([rv * kh[0], 0.0, rv * kh[2]], rotating_quadrupole_derivs(theta))
                s1, s2, _ = svd_3x3_exact(W)
                vals.append(rv * rv * s2 / s1)
            ext = (4.0 * (2.0 * vals[2] - vals[1]) - (2.0 * vals[1] - vals[0])) / 3.0
            c_ana = C_rotating_quadrupole(iota, theta)
            max_c_err = max(max_c_err, abs(ext - c_ana))
    assert max_c_err < 1e-4, f"C(iota, theta) mismatch: {max_c_err}"

    # 2. Face-on iota = 0 exact 3/(2 (kr)^4) law
    _, _, W_face = eval_quadrupole_weyl_exact([0.0, 0.0, 40.0], rotating_quadrupole_derivs(0.7))
    s1f, s2f, _ = svd_3x3_exact(W_face)
    face_val = (40.0 ** 4) * (s2f / s1f)
    assert abs(face_val - 1.5 * (1.0 + 1.0 / 1600.0)) < 1e-5

    # 3. Concrete benchmark from Section 1: iota = 60 deg, kr = 200 (and Richardson check of C_+, C_-)
    iota = math.radians(60.0)
    kh = [math.sin(iota), 0.0, math.cos(iota)]
    cp_vals, cm_vals = [], []
    for r in (80.0, 160.0):
        _, _, W0 = eval_quadrupole_weyl_exact([r * kh[0], 0.0, r * kh[2]], rotating_quadrupole_derivs(0.0))
        _, _, W90 = eval_quadrupole_weyl_exact([r * kh[0], 0.0, r * kh[2]], rotating_quadrupole_derivs(0.5 * math.pi))
        Wp = [[0.5 * (W0[a][b] + 1j * W90[a][b]) for b in range(3)] for a in range(3)]
        Wm = [[0.5 * (W0[a][b] - 1j * W90[a][b]) for b in range(3)] for a in range(3)]
        sp = svd_3x3_exact(Wp)
        sm = svd_3x3_exact(Wm)
        cp_vals.append(r * r * sp[1] / sp[0])
        cm_vals.append(r * r * sm[1] / sm[0])
    cp_ext = (4.0 * cp_vals[1] - cp_vals[0]) / 3.0
    cm_ext = (4.0 * cm_vals[1] - cm_vals[0]) / 3.0

    r = 200.0
    _, _, W0 = eval_quadrupole_weyl_exact([r * kh[0], 0.0, r * kh[2]], rotating_quadrupole_derivs(0.0))
    _, _, W90 = eval_quadrupole_weyl_exact([r * kh[0], 0.0, r * kh[2]], rotating_quadrupole_derivs(0.5 * math.pi))
    Wp = [[0.5 * (W0[a][b] + 1j * W90[a][b]) for b in range(3)] for a in range(3)]
    Wm = [[0.5 * (W0[a][b] - 1j * W90[a][b]) for b in range(3)] for a in range(3)]
    sp = svd_3x3_exact(Wp)
    sm = svd_3x3_exact(Wm)
    kr_est = math.sqrt(2.0 * math.sqrt(sp[0] * sm[0]) / sp[1])
    kp = khat_from_rank1_weyl(Wp)
    km = khat_from_rank1_weyl(Wm)
    ang_pm = math.acos(max(-1.0, min(1.0, sum(kp[a] * km[a] for a in range(3)))))
    aberr_num = r * ang_pm
    aberr_ana = 8.0 / math.tan(iota)

    assert abs(cp_ext - 2.0 / 3.0) < 1e-5
    assert abs(cm_ext - 6.0) < 1e-4
    assert abs(kr_est - 200.0) < 0.02
    assert abs(aberr_num - aberr_ana) < 5e-4
    return max_c_err, kr_est, aberr_num


def run_tests():
    peel_err, gen_err = verify_peeling_and_general_formula()
    c_err, kr_est, aberr_num = verify_rotating_and_fourier_laws()
    print(f"[PASS] Question 1 (Ranging): Peeling err={peel_err:.2e} | Gen-quad err={gen_err:.2e} | "
          f"C(iota,theta) err={c_err:.2e} | Fourier kr_est={kr_est:.3f}/200 | kr*dtheta_+-={aberr_num:.5f} (8 cot 60={8/math.sqrt(3):.5f})")


if __name__ == "__main__":
    run_tests()
