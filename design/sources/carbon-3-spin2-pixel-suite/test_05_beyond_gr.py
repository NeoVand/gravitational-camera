"""
test_05_beyond_gr.py
Question 5 verification suite (Beyond GR at one full-Riemann pixel in one reading):
  1. Universal metric plane-wave curvature identity:
       tr(B) = 0,  B = (c / v_p) [k_hat]_x E,  J = (c / v_p)^2 [k_hat]_x E [k_hat]_x^T,
     plus pure-gauge invariance across random 4x4 metric perturbations h_{mu nu}.
  2. One-reading algebraic inversion of (E, B) (14 numbers -> k_hat, v_p/c, all 6 ELL
     polarizations E_+, E_x, E_vx, E_vy, E_b, E_l, and 5 metric consistency checks).
  3. Single-reading discriminator between a Fierz-Pauli massive graviton (5 modes,
     E_l / E_b = -2 (1 - n^2) < 0) and a massive Brans-Dicke / f(R) scalar wave
     (E_l / E_b = +(1 - n^2) > 0).
"""

import math
import random
from spin2_linalg import EPS3


def plane_wave_ebj(k_hat, n_slowness, h_dd_4x4):
    """Exact linearized (E, B, J) for h_{mu nu}(t - (n_slowness/c) k_hat.x) with c = 1."""
    k4 = [1.0, -n_slowness * k_hat[0], -n_slowness * k_hat[1], -n_slowness * k_hat[2]]

    def R4(a, b, c, d):
        return 0.5 * (
            k4[b] * k4[c] * h_dd_4x4[a][d]
            + k4[a] * k4[d] * h_dd_4x4[b][c]
            - k4[a] * k4[c] * h_dd_4x4[b][d]
            - k4[b] * k4[d] * h_dd_4x4[a][c]
        )

    E = [[R4(0, i + 1, 0, j + 1) for j in range(3)] for i in range(3)]
    B = [[0.0] * 3 for _ in range(3)]
    J = [[0.0] * 3 for _ in range(3)]
    for i in range(3):
        for j in range(3):
            B[i][j] = sum(0.5 * EPS3[i][p][q] * R4(p + 1, q + 1, j + 1, 0) for p in range(3) for q in range(3) if EPS3[i][p][q] != 0)
            J[i][j] = sum(
                0.25 * EPS3[i][p][q] * EPS3[j][r][s] * R4(p + 1, q + 1, r + 1, s + 1)
                for p in range(3) for q in range(3) if EPS3[i][p][q] != 0
                for r in range(3) for s in range(3) if EPS3[j][r][s] != 0
            )
    return E, B, J


def invert_single_reading_beyond_gr(E, B):
    """
    Closed-form single-reading inversion of 6 symmetric E + 8 trace-free B = 14 numbers:
    Returns (k_hat, v_p_over_c, ell_6_modes, consistency_residual_norm).
    """
    c0 = [B[i][0] for i in range(3)]
    c1 = [B[i][1] for i in range(3)]
    kc = [c0[1] * c1[2] - c0[2] * c1[1], c0[2] * c1[0] - c0[0] * c1[2], c0[0] * c1[1] - c0[1] * c1[0]]
    kn = math.sqrt(sum(x * x for x in kc))
    kc = [x / kn for x in kc]

    kxE = [[sum(EPS3[i][p][q] * kc[p] * E[q][j] for p in range(3) for q in range(3)) for j in range(3)] for i in range(3)]
    num = sum(B[i][j] * kxE[i][j] for i in range(3) for j in range(3))
    den = sum(kxE[i][j] ** 2 for i in range(3) for j in range(3))
    if num < 0.0:
        kc = [-x for x in kc]
        kxE = [[-kxE[i][j] for j in range(3)] for i in range(3)]
        num = -num
    n_sl = num / den
    resid = math.sqrt(sum((B[i][j] - n_sl * kxE[i][j]) ** 2 for i in range(3) for j in range(3)))

    # Orthonormal triad (e1, e2, kc)
    sp = math.hypot(kc[0], kc[1])
    e1 = [kc[0] * kc[2] / sp, kc[1] * kc[2] / sp, -sp] if sp > 1e-12 else [1.0, 0.0, 0.0]
    e2 = [-kc[1] / sp, kc[0] / sp, 0.0] if sp > 1e-12 else [0.0, 1.0 if kc[2] >= 0 else -1.0, 0.0]
    U = [e1, e2, kc]
    Eloc = [[sum(U[a][i] * E[i][j] * U[b][j] for i in range(3) for j in range(3)) for b in range(3)] for a in range(3)]
    modes = (
        0.5 * (Eloc[0][0] - Eloc[1][1]),  # E_+
        Eloc[0][1],                       # E_x
        Eloc[0][2],                       # E_vx
        Eloc[1][2],                       # E_vy
        0.5 * (Eloc[0][0] + Eloc[1][1]),  # E_b
        Eloc[2][2],                       # E_l
    )
    return kc, 1.0 / n_sl, modes, resid


def run_tests():
    random.seed(99)
    max_b_err = 0.0
    max_gauge = 0.0
    for _ in range(15):
        v = [random.gauss(0, 1) for _ in range(3)]
        vn = math.sqrt(sum(x * x for x in v))
        kh = [x / vn for x in v]
        n_sl = random.uniform(0.3, 2.5)
        A = [[random.gauss(0, 1) for _ in range(4)] for __ in range(4)]
        hdd = [[0.5 * (A[a][b] + A[b][a]) for b in range(4)] for a in range(4)]
        E, B, _ = plane_wave_ebj(kh, n_sl, hdd)
        Bp = [[sum(n_sl * EPS3[i][p][q] * kh[p] * E[q][j] for p in range(3) for q in range(3)) for j in range(3)] for i in range(3)]
        max_b_err = max(max_b_err, max(abs(B[i][j] - Bp[i][j]) for i in range(3) for j in range(3)))
        assert abs(B[0][0] + B[1][1] + B[2][2]) < 1e-14

        k4 = [1.0, -n_sl * kh[0], -n_sl * kh[1], -n_sl * kh[2]]
        xi = [random.gauss(0, 1) for _ in range(4)]
        hg = [[k4[a] * xi[b] + k4[b] * xi[a] for b in range(4)] for a in range(4)]
        Eg, Bg, Jg = plane_wave_ebj(kh, n_sl, hg)
        max_gauge = max(max_gauge, max(abs(Eg[i][j]) + abs(Bg[i][j]) + abs(Jg[i][j]) for i in range(3) for j in range(3)))

    assert max_b_err < 1e-14 and max_gauge < 1e-14

    # Concrete Section 5 test vector
    E_in = [[1.414, -0.64, -0.948], [-0.64, -0.5, -0.02], [-0.948, -0.02, 0.236]]
    B_in = [[0.4096, 0.32, 0.0128], [1.36, -0.4, -0.72], [-0.3072, -0.24, -0.0096]]
    k_rec, vp_c, modes, resid = invert_single_reading_beyond_gr(E_in, B_in)
    true_modes = (1.2, -0.5, 0.3, -0.4, 0.7, -0.25)
    assert max(abs(k_rec[i] - [0.6, 0.0, 0.8][i]) for i in range(3)) < 1e-14
    assert abs(vp_c - 1.25) < 1e-14 and resid < 1e-14
    assert max(abs(modes[i] - true_modes[i]) for i in range(6)) < 1e-14

    # Fierz-Pauli helicity-0 vs Brans-Dicke scalar mode at mu_g = omega_m/omega = 0.6 (n = 0.8, 1 - n^2 = 0.36)
    mu_g = 0.6
    n_sl = math.sqrt(1.0 - mu_g ** 2)
    epsL = [-n_sl / mu_g, 0.0, 0.0, 1.0 / mu_g]
    k_cov = [-1.0, 0.0, 0.0, n_sl]
    eta = [[-1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]]
    pol_fp0 = [[-math.sqrt(1.5) * (epsL[a] * epsL[b] - (eta[a][b] + k_cov[a] * k_cov[b] / (mu_g ** 2)) / 3.0)
                for b in range(4)] for a in range(4)]
    E_fp, _, _ = plane_wave_ebj([0.0, 0.0, 1.0], n_sl, pol_fp0)
    E_bd, _, _ = plane_wave_ebj([0.0, 0.0, 1.0], n_sl, eta)
    ratio_fp = E_fp[2][2] / E_fp[0][0]
    ratio_bd = E_bd[2][2] / E_bd[0][0]
    assert abs(ratio_fp - (-2.0 * (1.0 - n_sl ** 2))) < 1e-14
    assert abs(ratio_bd - (+1.0 * (1.0 - n_sl ** 2))) < 1e-14

    print(f"[PASS] Question 5 (Beyond GR): Bianchi err={max_b_err:.2e} | Single-reading v_p/c={vp_c:.2f}, resid={resid:.2e} | "
          f"E_l/E_b: FP={ratio_fp:+.4f} (-2(1-n^2)) vs BD={ratio_bd:+.4f} (+(1-n^2))")


if __name__ == "__main__":
    run_tests()
