"""
test_04_crlb.py
Question 4 verification suite (exact Fisher Information Matrix & Cramer-Rao bounds):
  1. Single-wave direction CRLB (instantaneous 4x4 FIM and multi-cycle 6x6 FIM):
       sigma_{theta_1} = sigma_{theta_2} = 1 / rho = 1 / (sqrt(2) SNR_E), Cov = 0,
       comparing spin-2 gravity (1/rho) against spin-1 light (sqrt(2)/rho).
  2. Static-scene speedometer 8x8 joint FIM (marginalizing over unknown static eigenvalues
     and 3D orientation): slow limit sigma_{v_a}/c = sigma_B / (sqrt(2)|lam_b - lam_c|)
     and exact relativistic boost behavior.
  3. Near-field moving-mass ranging (Eq. 36, 7x7 joint FIM):
       sigma_r / r = sqrt(1/SNR_B^2 + 1/SNR_{Edot_perp}^2)
                   = (1/SNR_E) * (c/v_perp) * sqrt(1/3 + (2 r / (c T))^2).
  4. Full-cycle rotating binary wave-zone ranging 7x7 joint FIM:
       sigma_r / r = g(iota) * (kr) / rho  for 0 < iota < pi/2  vs  O((kr)^2 / rho) at iota = pi/2.
"""

import math
from spin2_linalg import pack_eb_10, sky_triad_angles, exp_complex_so3, invert_matrix
from test_01_ranging import eval_quadrupole_weyl_exact, rotating_quadrupole_derivs


def fisher_cov(eval_fn, p0, eps=1e-7):
    y0 = eval_fn(p0)
    m_dim = len(y0)
    k_dim = len(p0)
    J = []
    for k in range(k_dim):
        pp, pm = p0[:], p0[:]
        pp[k] += eps
        pm[k] -= eps
        yp, ym = eval_fn(pp), eval_fn(pm)
        J.append([(yp[i] - ym[i]) / (2.0 * eps) for i in range(m_dim)])
    F = [[sum(J[a][i] * J[b][i] for i in range(m_dim)) for b in range(k_dim)] for a in range(k_dim)]
    return invert_matrix(F), math.sqrt(sum(x * x for x in y0))


def verify_wave_direction_crlb():
    # Spin-2 gravity instantaneous 4x4 FIM across linear, elliptical, circular polarizations
    max_err = 0.0
    for ep, ex in ((1.0, 0.0), (0.8, 0.6), (0.70710678, 0.70710678)):
        th0, ph0 = 1.1, 0.7
        def f_gw(p):
            th, ph, e_p, e_x = p
            _, _, _, m, _ = sky_triad_angles(th, ph)
            c0 = 2.0 * (e_p - 1j * e_x)
            E = [[(c0 * m[i] * m[j]).real for j in range(3)] for i in range(3)]
            B = [[(c0 * m[i] * m[j]).imag for j in range(3)] for i in range(3)]
            return pack_eb_10(E, B)
        cov, rho = fisher_cov(f_gw, [th0, ph0, ep, ex])
        s1 = rho * math.sqrt(cov[0][0])
        s2 = rho * math.sin(th0) * math.sqrt(cov[1][1])
        max_err = max(max_err, abs(s1 - 1.0), abs(s2 - 1.0), abs(cov[0][1]))

    # Compare Spin-1 light instantaneous 4x4 FIM: rho * sigma_theta = sqrt(2)!
    th0, ph0 = 1.1, 0.7
    def f_em(p):
        th, ph, e_1, e_2 = p
        _, _, _, m, _ = sky_triad_angles(th, ph)
        c0 = math.sqrt(2.0) * (e_1 - 1j * e_2)
        F_vec = [c0 * m[i] for i in range(3)]
        return [x.real for x in F_vec] + [x.imag for x in F_vec]
    cov_em, rho_em = fisher_cov(f_em, [th0, ph0, 0.8, 0.6])
    s_em = rho_em * math.sqrt(cov_em[0][0])
    assert max_err < 1e-8 and abs(s_em - math.sqrt(2.0)) < 1e-8
    return max_err, s_em


def verify_speedometer_crlb():
    l1, l2 = 2.0, -0.5
    l3 = -l1 - l2

    def f_spd(p):
        la1, la2, rx, ry, rz, bx, by, bz = p
        la3 = -la1 - la2
        E0 = [[la1, 0.0, 0.0], [0.0, la2, 0.0], [0.0, 0.0, la3]]
        R = exp_complex_so3(rx, ry, rz)
        bmag = math.sqrt(bx * bx + by * by + bz * bz)
        eta_v = [0j, 0j, 0j] if bmag < 1e-12 else [-1j * math.atanh(bmag) * b / bmag for b in (bx, by, bz)]
        B_b = exp_complex_so3(*eta_v)
        G = [[sum(B_b[i][k] * R[k][j] for k in range(3)) for j in range(3)] for i in range(3)]
        tmp = [[sum(G[i][k] * E0[k][j] for k in range(3)) for j in range(3)] for i in range(3)]
        W = [[sum(tmp[i][k] * G[j][k] for k in range(3)) for j in range(3)] for i in range(3)]
        return pack_eb_10([[W[i][j].real for j in range(3)] for i in range(3)],
                          [[W[i][j].imag for j in range(3)] for i in range(3)])

    cov0, _ = fisher_cov(f_spd, [l1, l2, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0])
    sigs0 = [math.sqrt(cov0[5 + a][5 + a]) for a in range(3)]
    ana0 = [1.0 / (math.sqrt(2.0) * abs(l2 - l3)),
            1.0 / (math.sqrt(2.0) * abs(l3 - l1)),
            1.0 / (math.sqrt(2.0) * abs(l1 - l2))]
    err0 = max(abs(sigs0[a] - ana0[a]) for a in range(3))

    # Relativistic check at beta = (0.3, 0, 0): transverse sigmas scale by sqrt(1 + beta_1^2)!
    cov_rel, _ = fisher_cov(f_spd, [l1, l2, 0.0, 0.0, 0.0, 0.3, 0.0, 0.0])
    sig_b2_rel = math.sqrt(cov_rel[6][6])
    err_rel = abs(sig_b2_rel - ana0[1] * math.sqrt(1.0 + 0.3 ** 2))
    assert err0 < 1e-9 and err_rel < 1e-8
    return err0, err_rel


def verify_ranging_crlbs():
    # (a) Near-field moving-mass ranging (7x7 FIM vs exact closed-form light-time crossover formula)
    T_win = 0.10
    N_t = 17
    r0 = 10.0
    vp = 1e-3
    vr = 5e-4

    def f_mov(p):
        ln_r, th1, th2, ln_ae, vx, vy, vz = p
        rv = math.exp(ln_r)
        gm = math.exp(ln_ae) * (rv ** 3)
        nz = math.sqrt(max(0.0, 1.0 - th1 * th1 - th2 * th2))
        x0 = [rv * th1, rv * th2, rv * nz]
        v = [vx, vy, vz]
        out = []
        for m_t in range(N_t):
            t = -0.5 * T_win + T_win * m_t / (N_t - 1)
            xs = [x0[a] + v[a] * t for a in range(3)]
            rt = math.sqrt(sum(z * z for z in xs))
            nh = [z / rt for z in xs]
            nxv = [nh[1] * v[2] - nh[2] * v[1], nh[2] * v[0] - nh[0] * v[2], nh[0] * v[1] - nh[1] * v[0]]
            E = [[(gm / rt ** 3) * ((1.0 if i == j else 0.0) - 3.0 * nh[i] * nh[j]) for j in range(3)] for i in range(3)]
            B = [[(3.0 * gm / rt ** 3) * (nh[i] * nxv[j] + nh[j] * nxv[i]) for j in range(3)] for i in range(3)]
            out.extend(pack_eb_10(E, B))
        return out

    p_mov = [math.log(r0), 0.0, 0.0, 0.0, vp, 0.0, vr]
    cov_mov, _ = fisher_cov(f_mov, p_mov)
    sig_lnr_num = math.sqrt(cov_mov[0][0])
    y0 = f_mov(p_mov)
    snr_b2 = sum(y0[10 * m + 5 + a] ** 2 for m in range(N_t) for a in range(5))
    e_means = [sum(y0[10 * m + a] for m in range(N_t)) / N_t for a in range(5)]
    snr_edot2 = sum((y0[10 * m + a] - e_means[a]) ** 2 for m in range(N_t) for a in (2, 3))
    sig_lnr_ana = math.sqrt(1.0 / snr_b2 + 1.0 / snr_edot2)
    rel_err_mov = abs(sig_lnr_num - sig_lnr_ana) / sig_lnr_ana
    assert rel_err_mov < 1e-5

    # (b) Wave-zone full-cycle binary 7x7 FIM at iota = 60 deg (verifying linear kr/rho scaling!)
    iota = math.radians(60.0)
    def f_bin(p, n_s=12):
        ln_r, th1, th2, ln_a, io, ps, ph0 = p
        rv = math.exp(ln_r)
        av = math.exp(ln_a)
        kz = math.sqrt(max(0.0, 1.0 - th1 * th1 - th2 * th2))
        x_obs = [rv * th1, rv * th2, rv * kz]
        ci, si = math.cos(io), math.sin(io)
        cp, sp = math.cos(ps), math.sin(ps)
        R = [[cp * ci, -sp, -cp * si], [sp * ci, cp, -sp * si], [si, 0.0, ci]]
        out = []
        scale = av * rv
        for m_t in range(n_s):
            Qd = rotating_quadrupole_derivs(ph0 + 2.0 * math.pi * m_t / n_s, 1.0)
            Qd_lab = []
            for Qm in Qd:
                tmp = [[sum(R[i][k] * Qm[k][j] for k in range(3)) for j in range(3)] for i in range(3)]
                Qd_lab.append([[scale * sum(tmp[i][k] * R[j][k] for k in range(3)) for j in range(3)] for i in range(3)])
            E, B, _ = eval_quadrupole_weyl_exact(x_obs, Qd_lab)
            out.extend(pack_eb_10(E, B))
        return out

    cov_40, rho_40 = fisher_cov(f_bin, [math.log(40.0), 0.0, 0.0, 0.0, iota, 0.3, 0.5], eps=1e-6)
    cov_160, rho_160 = fisher_cov(f_bin, [math.log(160.0), 0.0, 0.0, 0.0, iota, 0.3, 0.5], eps=1e-6)
    g_40 = rho_40 * math.sqrt(cov_40[0][0]) / 40.0
    g_160 = rho_160 * math.sqrt(cov_160[0][0]) / 160.0
    assert abs(g_40 - g_160) / g_160 < 0.01  # Confirms O(kr / rho) scaling!
    return rel_err_mov, g_160


def run_tests():
    dir_err, s_em = verify_wave_direction_crlb()
    spd_e0, spd_erel = verify_speedometer_crlb()
    mov_err, g60 = verify_ranging_crlbs()
    print(f"[PASS] Question 4 (CRLBs): Wave-dir err={dir_err:.2e} (GW=1/rho vs EM={s_em:.4f}/rho) | "
          f"Speedometer err={spd_e0:.2e} (rel={spd_erel:.2e}) | Mov-mass rel_err={mov_err:.2e} | Binary g(60deg)={g60:.4f}")


if __name__ == "__main__":
    run_tests()
