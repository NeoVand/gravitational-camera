"""
test_03_arrays.py
Question 3 verification suite:
  1. Full Kruskal rank 5N of N-pixel chiral steering vectors v_+(k) = a(k) (x) q(k) / sqrt(N)
     in C^{5N} for collinear, planar, and 3D sparse arrays -> confirming 5N - 1 MUSIC source
     resolution (and elimination of the 360-deg collinear baseline-cone ambiguity).
  2. Exact sparse-array inner-product identity:
       |<v_+(k), v_+(k_0)>|^2 = cos^8(vartheta / 2) * |(1/N) sum_n exp(i k (k - k_0).x_n)|^2.
  3. Two-pixel interferometer at D = 100 lambda: Capon MVDR main-to-(m=1 grating lobe) ratio
       P_Capon(k_0) / P_Capon(k_{m=1}) = 1 + rho_2^2 * (1 - cos^8(vartheta_1 / 2)).
"""

import math
import cmath
import random
from spin2_linalg import q_spin2_vec, qr_rank_complex, invert_matrix


def verify_array_5n_rank():
    random.seed(2026)
    for geom in ("collinear", "planar", "3d"):
        for N in (1, 2, 3, 4):
            if geom == "collinear":
                pos = [[100.0 * n, 0.0, 0.0] for n in range(N)]
            elif geom == "planar":
                pos = [[17.3 * n, 29.1 * ((n * n) % 5), 0.0] for n in range(N)]
            else:
                pos = [[random.uniform(-50.0, 50.0) for _ in range(3)] for __ in range(N)]
            K = 5 * N
            cols = []
            for _ in range(K):
                th = math.acos(random.uniform(-0.95, 0.95))
                ph = random.uniform(0.0, 2.0 * math.pi)
                kh = [math.sin(th) * math.cos(ph), math.sin(th) * math.sin(ph), math.cos(th)]
                q = q_spin2_vec(th, ph)
                vec = []
                for p in pos:
                    phase = cmath.exp(2j * math.pi * sum(kh[a] * p[a] for a in range(3)))
                    vec.extend([phase * x for x in q])
                cols.append(vec)
            M = [[cols[c][r] for c in range(K)] for r in range(5 * N)]
            crk, _ = qr_rank_complex(M)
            assert crk == 5 * N, f"Rank defect for {geom} N={N}: {crk} != {5*N}"
    return True


def verify_sparse_two_pixel_grating_lobes():
    D_over_lam = 100.0
    pos2 = [[-0.5 * D_over_lam, 0.0, 0.0], [0.5 * D_over_lam, 0.0, 0.0]]

    def v_plus_2px(th, ph):
        kh = [math.sin(th) * math.cos(ph), math.sin(th) * math.sin(ph), math.cos(th)]
        q = q_spin2_vec(th, ph)
        out = []
        for p in pos2:
            phase = cmath.exp(2j * math.pi * sum(kh[a] * p[a] for a in range(3))) / math.sqrt(2.0)
            out.extend([phase * x for x in q])
        return out

    th0, ph0 = 1.1, 0.4
    k0 = [math.sin(th0) * math.cos(ph0), math.sin(th0) * math.sin(ph0), math.cos(th0)]
    v0 = v_plus_2px(th0, ph0)

    # Check exact overlap identity across 50 random sky directions
    random.seed(77)
    max_ov_err = 0.0
    for _ in range(50):
        th = math.acos(random.uniform(-1.0, 1.0))
        ph = random.uniform(0.0, 2.0 * math.pi)
        kh = [math.sin(th) * math.cos(ph), math.sin(th) * math.sin(ph), math.cos(th)]
        v = v_plus_2px(th, ph)
        ip2 = abs(sum(v[i].conjugate() * v0[i] for i in range(10))) ** 2
        cos_vt = max(-1.0, min(1.0, sum(kh[a] * k0[a] for a in range(3))))
        ana = ((0.5 * (1.0 + cos_vt)) ** 4) * (math.cos(math.pi * D_over_lam * (kh[0] - k0[0])) ** 2)
        max_ov_err = max(max_ov_err, abs(ip2 - ana))
    assert max_ov_err < 1e-13

    # Direct 10x10 matrix inversion test of Capon MVDR at m = +1 grating lobe (rho_2 = 500)
    alpha0 = math.acos(k0[0])
    alpha1 = math.acos(k0[0] + 1.0 / D_over_lam)
    pn = math.hypot(k0[1], k0[2])
    k_m1 = [math.cos(alpha1), math.sin(alpha1) * k0[1] / pn, math.sin(alpha1) * k0[2] / pn]
    v1 = v_plus_2px(math.acos(k_m1[2]), math.atan2(k_m1[1], k_m1[0]))

    rho2 = 500.0
    P_sig = rho2 * rho2
    S_arr = [[P_sig * v0[i] * v0[j].conjugate() + (1.0 if i == j else 0.0) for j in range(10)] for i in range(10)]
    S_inv = invert_matrix(S_arr)
    quad = lambda u: sum(u[i].conjugate() * S_inv[i][j] * u[j] for i in range(10) for j in range(10)).real
    capon_ratio_num = (1.0 / quad(v0)) / (1.0 / quad(v1))
    vt1 = abs(alpha1 - alpha0)
    capon_ratio_ana = 1.0 + (rho2 ** 2) * (1.0 - (math.cos(0.5 * vt1) ** 8))
    assert abs(capon_ratio_num - capon_ratio_ana) < 1e-9
    return max_ov_err, capon_ratio_num


def run_tests():
    verify_array_5n_rank()
    ov_err, cap_500 = verify_sparse_two_pixel_grating_lobes()
    print(f"[PASS] Question 3 (Arrays): Full 5N rank verified (collinear/planar/3D, N=1..4) | "
          f"cos^8(vartheta/2) err={ov_err:.2e} | D=100*lam Capon ratio (SNR=500)={cap_500:.2f} ({10*math.log10(cap_500):.2f} dB)")


if __name__ == "__main__":
    run_tests()
