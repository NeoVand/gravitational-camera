"""
test_02_spectral_matrix.py
Question 2 verification suite:
  1. Unitary helicity decomposition S_hel(omega) -> (S_++, S_--, S_+-).
  2. Closed-form K = 5 inclined-binary recovery via (S_I, S_V) Hermitian pencil
     (zero grid search, zero matrix inversion).
  3. Exact Householder QR local-identifiability ranks across source count K:
       - Unpolarized GW: K_max = 8 (full rank 24/25) vs Unpolarized Light: K_max = 2 (rank 8 < 9 defect at K = 3!)
       - Circular / zero-linear-pol GW: K_max = 12 (full rank 48/50)
       - Arbitrarily (partially) polarized GW: K_max = 9 (full rank 54/68; spin-4 bottleneck rank = 58 < 60 at K = 10!)
       - 100% elliptically polarized GW binaries: K_max = 13 (full rank 65/68)
"""

import math
import cmath
import random
from spin2_linalg import (
    q_spin2_vec, stf5_to_mat, sky_triad_angles, khat_from_rank1_weyl,
    hermitian_eigh, qr_rank_real
)


def pack_hermitian_5x5(H):
    out = []
    for i in range(5):
        out.append(H[i][i].real)
        for j in range(i + 1, 5):
            out.append(math.sqrt(2.0) * H[i][j].real)
            out.append(math.sqrt(2.0) * H[i][j].imag)
    return out


def pack_full_helicity_10x10(Spp, Smm, Spm):
    out = pack_hermitian_5x5(Spp) + pack_hermitian_5x5(Smm)
    for i in range(5):
        for j in range(5):
            out.append(Spm[i][j].real)
            out.append(Spm[i][j].imag)
    return out


def verify_k5_hermitian_pencil():
    # Exact test case from Section 2 of spin2_pixel_complete_theory.md
    sources = [
        (0.45, 0.30, 1.5, 0.25),
        (1.10, 1.50, 1.2, 0.70),
        (1.80, 2.80, 0.9, 1.20),
        (2.30, 4.10, 1.7, 2.00),
        (0.95, 5.20, 1.1, 2.65),
    ]
    Spp = [[0j] * 5 for _ in range(5)]
    Smm = [[0j] * 5 for _ in range(5)]
    truth = []
    for th, ph, Ia, io in sources:
        ci = math.cos(io)
        vi = 4.0 * ci * (1.0 + ci * ci) / (1.0 + 6.0 * ci * ci + ci ** 4)
        Va = Ia * vi
        q = q_spin2_vec(th, ph)
        for i in range(5):
            for j in range(5):
                Spp[i][j] += 0.5 * (Ia + Va) * q[i] * q[j].conjugate()
                Smm[i][j] += 0.5 * (Ia - Va) * q[i].conjugate() * q[j]
        truth.append(([math.sin(th) * math.cos(ph), math.sin(th) * math.sin(ph), math.cos(th)], vi, Ia))

    SI = [[Spp[i][j] + Smm[i][j].conjugate() for j in range(5)] for i in range(5)]
    SV = [[Spp[i][j] - Smm[i][j].conjugate() for j in range(5)] for i in range(5)]

    dI, VI = hermitian_eigh(SI)
    Wh = [[VI[i][j] / math.sqrt(dI[j]) for j in range(5)] for i in range(5)]
    tmp = [[sum(SV[i][k] * Wh[k][j] for k in range(5)) for j in range(5)] for i in range(5)]
    A_pen = [[sum(Wh[k][i].conjugate() * tmp[k][j] for k in range(5)) for j in range(5)] for i in range(5)]
    evals_v, VA = hermitian_eigh(A_pen)

    U_gen = [[sum(Wh[i][k] * VA[k][j] for k in range(5)) for j in range(5)] for i in range(5)]
    Cols = [[sum(SI[i][k] * U_gen[k][j] for k in range(5)) for j in range(5)] for i in range(5)]

    max_ang = 0.0
    max_v = 0.0
    max_i = 0.0
    for j in range(5):
        col = [Cols[i][j] for i in range(5)]
        I_rec = sum(abs(x) ** 2 for x in col)
        k_rec = khat_from_rank1_weyl(stf5_to_mat(col))
        v_rec = evals_v[j]
        best = min(truth, key=lambda item: abs(item[1] - v_rec))
        dot = sum(k_rec[a] * best[0][a] for a in range(3))
        cx = [
            k_rec[1] * best[0][2] - k_rec[2] * best[0][1],
            k_rec[2] * best[0][0] - k_rec[0] * best[0][2],
            k_rec[0] * best[0][1] - k_rec[1] * best[0][0],
        ]
        ang = math.atan2(math.sqrt(sum(x * x for x in cx)), dot)
        max_ang = max(max_ang, ang)
        max_v = max(max_v, abs(v_rec - best[1]))
        max_i = max(max_i, abs(I_rec - best[2]))

    assert max_ang < 1e-11 and max_v < 1e-13 and max_i < 1e-11, f"{max_ang}, {max_v}, {max_i}"
    return max_ang, max_v, max_i


def jacobian_rank(eval_fn, params, eps=1e-7):
    cols = []
    for idx in range(len(params)):
        pp, pm = params[:], params[:]
        pp[idx] += eps
        pm[idx] -= eps
        fp, fm = eval_fn(pp), eval_fn(pm)
        cols.append([(fp[r] - fm[r]) / (2.0 * eps) for r in range(len(fp))])
    J = [[cols[c][r] for c in range(len(cols))] for r in range(len(cols[0]))]
    rk, _ = qr_rank_real(J)
    return rk


def verify_jacobian_identifiability_table():
    random.seed(12345)

    # 1. Unpolarized GW at K = 8 (rank 24 = 3K) vs K = 9 (rank 25 < 27)
    def unpol_gw(K):
        p0 = []
        for _ in range(K):
            p0.extend([math.acos(random.uniform(-0.9, 0.9)), random.uniform(0.1, 6.0), random.uniform(0.5, 2.0)])
        def f(p):
            H = [[0j] * 5 for _ in range(5)]
            for a in range(K):
                th, ph, Ia = p[3 * a:3 * a + 3]
                q = q_spin2_vec(th, ph)
                for i in range(5):
                    for j in range(5):
                        H[i][j] += Ia * q[i] * q[j].conjugate()
            return pack_hermitian_5x5(H)
        return jacobian_rank(f, p0)

    rk_unpol_8 = unpol_gw(8)
    rk_unpol_9 = unpol_gw(9)
    assert rk_unpol_8 == 24 and rk_unpol_9 == 25

    # 2. Unpolarized Light circle-defect check at K = 2 (rank 6 = 3K) vs K = 3 (rank 8 < 9!)
    def unpol_light(K):
        p0 = []
        for _ in range(K):
            p0.extend([math.acos(random.uniform(-0.9, 0.9)), random.uniform(0.1, 6.0), random.uniform(0.5, 2.0)])
        def f(p):
            H = [[0j] * 3 for _ in range(3)]
            for a in range(K):
                th, ph, Ia = p[3 * a:3 * a + 3]
                _, _, _, m, _ = sky_triad_angles(th, ph)
                for i in range(3):
                    for j in range(3):
                        H[i][j] += Ia * m[i] * m[j].conjugate()
            out = []
            for i in range(3):
                out.append(H[i][i].real)
                for j in range(i + 1, 3):
                    out.extend([math.sqrt(2.0) * H[i][j].real, math.sqrt(2.0) * H[i][j].imag])
            return out
        return jacobian_rank(f, p0)

    rk_light_2 = unpol_light(2)
    rk_light_3 = unpol_light(3)
    assert rk_light_2 == 6 and rk_light_3 == 8  # Defective at K=3!

    # 3. Arbitrarily (partially) polarized GW: K = 9 (rank 54 = 6K) vs K = 10 (spin-4 bottleneck: rank 58 < 60!)
    def part_pol_gw(K):
        p0 = []
        for _ in range(K):
            p0.extend([math.acos(random.uniform(-0.9, 0.9)), random.uniform(0.1, 6.0),
                       random.uniform(1.0, 2.0), random.uniform(-0.3, 0.3),
                       random.uniform(-0.3, 0.3), random.uniform(-0.3, 0.3)])
        def f(p):
            Spp = [[0j] * 5 for _ in range(5)]
            Smm = [[0j] * 5 for _ in range(5)]
            Spm = [[0j] * 5 for _ in range(5)]
            for a in range(K):
                th, ph, Ia, Qa, Ua, Va = p[6 * a:6 * a + 6]
                q = q_spin2_vec(th, ph)
                for i in range(5):
                    for j in range(5):
                        Spp[i][j] += 0.5 * (Ia + Va) * q[i] * q[j].conjugate()
                        Smm[i][j] += 0.5 * (Ia - Va) * q[i].conjugate() * q[j]
                        Spm[i][j] += 0.5 * (Qa - 1j * Ua) * q[i] * q[j]
            return pack_full_helicity_10x10(Spp, Smm, Spm)
        return jacobian_rank(f, p0)

    rk_part_9 = part_pol_gw(9)
    rk_part_10 = part_pol_gw(10)
    assert rk_part_9 == 54 and rk_part_10 == 58

    # 4. 100% elliptically polarized GW binaries: K = 13 (full rank 65 = 5K!)
    def pure_pol_gw(K):
        p0 = []
        for _ in range(K):
            p0.extend([math.acos(random.uniform(-0.9, 0.9)), random.uniform(0.1, 6.0),
                       random.uniform(1.0, 2.0), random.uniform(0.2, 2.9), random.uniform(0.1, 3.0)])
        def f(p):
            Spp = [[0j] * 5 for _ in range(5)]
            Smm = [[0j] * 5 for _ in range(5)]
            Spm = [[0j] * 5 for _ in range(5)]
            for a in range(K):
                th, ph, Ia, io, ps = p[5 * a:5 * a + 5]
                ci = math.cos(io)
                fp_amp, fm_amp = 0.5 * (1.0 + ci) ** 2, 0.5 * (1.0 - ci) ** 2
                norm = fp_amp ** 2 + fm_amp ** 2
                ap = math.sqrt(Ia / norm) * fp_amp * cmath.exp(-2j * ps)
                am = math.sqrt(Ia / norm) * fm_amp * cmath.exp(+2j * ps)
                q = q_spin2_vec(th, ph)
                for i in range(5):
                    for j in range(5):
                        Spp[i][j] += (ap * q[i]) * (ap * q[j]).conjugate()
                        Smm[i][j] += (am * q[i].conjugate()) * (am * q[j].conjugate()).conjugate()
                        Spm[i][j] += (ap * am.conjugate()) * q[i] * q[j]
            return pack_full_helicity_10x10(Spp, Smm, Spm)
        return jacobian_rank(f, p0)

    rk_pure_13 = pure_pol_gw(13)
    assert rk_pure_13 == 65
    return rk_unpol_8, rk_light_3, rk_part_9, rk_part_10, rk_pure_13


def run_tests():
    ang_e, v_e, i_e = verify_k5_hermitian_pencil()
    r_u8, r_l3, r_p9, r_p10, r_b13 = verify_jacobian_identifiability_table()
    print(f"[PASS] Question 2 (Spectral 10x10): K=5 pencil errs=(ang={ang_e:.2e}, V/I={v_e:.2e}, I={i_e:.2e}) | "
          f"QR ranks: Unpol K=8->{r_u8}/24 (EM K=3->{r_l3}<9), PartPol K=9->{r_p9}/54, K=10->{r_p10}<60, PureBin K=13->{r_b13}/65")


if __name__ == "__main__":
    run_tests()
