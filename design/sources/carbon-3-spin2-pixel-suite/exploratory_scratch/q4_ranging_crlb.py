import sys
sys.path.insert(0, "/Users/neo/.gemini/antigravity/brain/3ca0091c-61b7-44c6-9f3e-dc29ba5c08cd/scratch")
import math, cmath
from q1_ranging import eval_W_exact, rot_quad_derivs, eps3
from q2_spectral_v2 import mat_to_stf5
from q4_crlb import inv_real_sym, pack_EB_real10

def rot_matrix_zyz(ph, th, ps):
    # Rotate rotor frame (where spin is z_s and phase-0 axis is x_s) into lab frame:
    # Let propagation vector in lab be k_hat(th_sky, ph_sky)!
    # Even simpler: work in lab coordinates where true k_hat = (0, 0, 1) (varied by dth_1 along x, dth_2 along y!),
    # and the rotor spin axis is tilted by iota in the xz-plane (then rotated around z by polarization angle psi)!
    pass

def eval_binary_cycle_vec(params, N_t=16):
    """
    params = [ln_r, th1, th2, ln_A, iota, psi, phi0] (7 real parameters, omega = k = c = 1!)
    Here A is the RECEIVED wave scale (i.e. Q_osc is scaled by A * r, so at r -> inf the 1/r wave amplitude is A, independent of r!).
    That marginalizes over unknown intrinsic quadrupole moment Delta_I!
    Observer position x = r * k_hat(th1, th2), where k_hat(0,0) = (0,0,1):
      k_hat = (sin th1 cos th2? -> local tangent: k_hat = (th1, th2, sqrt(1 - th1^2 - th2^2)))
    Rotor frame: spin axis in rotor frame is z_r = (0,0,1).
    Tilt rotor spin axis relative to (0,0,1) by angle iota in xz-plane, then rotate around z by psi!
    Wait: if rotor is rotated by R_rot in SO(3), then Q_lab^{(n)}(u) = R_rot Q_rotor^{(n)}(u) R_rot^T!
    Check: when th1=th2=0 (k_hat = +z) and psi=0:
    Earlier we had rotor in xy-plane and k_hat = (sin iota, 0, cos iota).
    Rotating BOTH by R_y(-iota) puts k_hat along +z and rotor spin along (-sin iota, 0, cos iota)!
    """
    ln_r, th1, th2, ln_A, iota, psi, phi0 = params
    r = math.exp(ln_r)
    A = math.exp(ln_A)
    kz = math.sqrt(max(0.0, 1.0 - th1*th1 - th2*th2))
    x_obs = [r*th1, r*th2, r*kz]

    # R_rot = R_z(psi) * R_y(-iota)
    ci, si = math.cos(iota), math.sin(iota)
    cp, sp = math.cos(psi), math.sin(psi)
    # R_y(-iota) = [[ci, 0, -si], [0, 1, 0], [si, 0, ci]]
    # R_z(psi)   = [[cp, -sp, 0], [sp, cp, 0], [0, 0, 1]]
    R = [
        [cp*ci, -sp, -cp*si],
        [sp*ci,  cp, -sp*si],
        [si,    0.0,  ci   ],
    ]
    out = []
    for m_t in range(N_t):
        u_phase = phi0 + 2.0 * math.pi * m_t / N_t
        Qd_rot = rot_quad_derivs(u_phase, 1.0)
        # Scale by A * r so 1/r radiation amplitude is independent of r!
        scale = A * r
        Qd_lab = []
        for Qm in Qd_rot:
            tmp = [[sum(R[i][k]*Qm[k][j] for k in range(3)) for j in range(3)] for i in range(3)]
            Q_l = [[scale * sum(tmp[i][k]*R[j][k] for k in range(3)) for j in range(3)] for i in range(3)]
            Qd_lab.append(Q_l)
        E, B, _ = eval_W_exact(x_obs, Qd_lab)
        out.extend(pack_EB_real10(E, B))
    return out

print("=== 4(a2) & 4(c1): FULL-CYCLE ROTATING BINARY JOINT 7x7 FISHER MATRIX (DIRECTION + WAVE RANGING!) ===")
for iota_deg in [0.1, 30.0, 45.0, 60.0, 89.9]:
    iota = math.radians(iota_deg)
    for r in [20.0, 40.0, 80.0, 160.0]:
        p0 = [math.log(r), 0.0, 0.0, 0.0, iota, 0.3, 0.5]
        y0 = eval_binary_cycle_vec(p0, N_t=16)
        rho = math.sqrt(sum(x*x for x in y0))
        eps = 1e-6
        J = []
        for k in range(7):
            pp, pm = p0[:], p0[:]
            pp[k] += eps; pm[k] -= eps
            yp, ym = eval_binary_cycle_vec(pp, 16), eval_binary_cycle_vec(pm, 16)
            J.append([(yp[i]-ym[i])/(2*eps) for i in range(len(y0))])
        F = [[sum(J[a][i]*J[b][i] for i in range(len(y0))) for b in range(7)] for a in range(7)]
        Cov = inv_real_sym(F)
        sig_lnr = math.sqrt(max(0.0, Cov[0][0]))
        sig_th1 = math.sqrt(max(0.0, Cov[1][1]))
        sig_th2 = math.sqrt(max(0.0, Cov[2][2]))
        if r in [40.0, 160.0]:
            print(f"iota={iota_deg:5.1f} deg, kr={r:5.1f}: rho*sig_th1={rho*sig_th1:.6f}, rho*sig_th2={rho*sig_th2:.6f} | rho*(sig_r/r)/(kr) = {rho*sig_lnr/r:.6f} | rho*(sig_r/r)/(kr)^2 = {rho*sig_lnr/(r*r):.6f}")

# ALSO check single-snapshot s_2 / s_1 estimator variance directly!
# If W = W_true + delta_W where delta_W = delta_E + i delta_B has 10 real i.i.d. N(0, sigma^2) STF coords:
# Let's check Var(u_2^dag delta_W v_2^*) where W_true = s_1 u_1 v_1^dag + s_2 u_2 v_2^dag + s_3 u_3 v_3^dag!
print("\n=== SINGLE-SNAPSHOT SVD RANGING PERTURBATION VARIANCE CHECK ===")
# In our unitary tetrad basis [m, m*, k_hat], W_1 = alpha_1 m m^T (top-left (1,1) entry in U^dag W U^*),
# and the s_2 mode is in the (3, 3) entry of U^dag W U^* (i.e. k_hat k_hat^T)!
# Wait: what is the variance of Re[k_hat^T (delta_E + i delta_B) k_hat] when delta_E, delta_B have orthonormal STF variance sigma^2?!
# Look at T_BASIS[4] = diag(-1, -1, 2) / sqrt(6)!
# k_hat^T T_BASIS[4] k_hat = 2 / sqrt(6) = sqrt(2/3)!!
# So k_hat^T delta_E k_hat ~ N(0, (2/3) sigma^2) and k_hat^T delta_B k_hat ~ N(0, (2/3) sigma^2)!!

# ==============================================================================
# 4(c2). NEAR-FIELD MOVING-MASS RANGING CRLB (Eq. 36: E, E_dot, B over [-T/2, T/2])
# ==============================================================================
print("\n=== 4(c2) NEAR-FIELD UNIFORMLY MOVING MASS JOINT 7x7 CRLB (r, M, n_hat, v) ===")
# Consider a mass M at x_s(t) = r n_hat + v t observed continuously over short window [-T/2, T/2] (with v T << r)
# with white noise of spectral density S_0 (or N_t discrete samples with variance sigma^2 per sample, so total electric SNR^2 = sum_t ||E(t)||_F^2 / sigma^2).
# Wait: over short window [-T/2, T/2], a linear signal X(t) = X(0) + t X_dot(0) in white noise decomposes into TWO orthogonal Legendre modes:
#   Mode 0 (mean X_bar = (1/T) int X dt): noise variance sigma_0^2 = S_0 / (2 T) (let's set sigma_0 = 1/sqrt(N_t))
#   Mode 1 (slope X_dot_hat): int_{-T/2}^{T/2} t^2 dt = T^3 / 12 => noise variance on X_dot is sigma_dot^2 = (12 / T^2) sigma_0^2!!
# Let's check this both by discrete time series of N_t points over [-T/2, T/2] AND analytically via (X_0, T * X_dot / sqrt(12))!

def moving_mass_series(params, T_win=0.01, N_t=9):
    # params = [ln_r, th1, th2, ln_AE, vx, vy, vz] (c = 1; AE = G M / r^3 is tidal scale at t=0!)
    # True direction at t=0: n_hat = (th1, th2, sqrt(1 - th1^2 - th2^2)), say along +z so vx, vy are transverse v_perp and vz is radial v_r!
    ln_r, th1, th2, ln_AE, vx, vy, vz = params
    r0 = math.exp(ln_r)
    AE = math.exp(ln_AE)
    GM = AE * (r0**3)
    nz = math.sqrt(max(0.0, 1.0 - th1*th1 - th2*th2))
    x0 = [r0*th1, r0*th2, r0*nz]
    v = [vx, vy, vz]
    out = []
    # Exact Liénard-Wiechert / boosted static mass tide (Fact 5: points at present position!), or to O(v/c) Eq. (3) & Eq. (34):
    # Let's use EXACT relativistic SO(3, C) boosted Coulomb field at present position x_s(t) = x0 + v t!!
    # Wait: let's check both O(v/c) (Eqs. 3 & 34) and exact relativistic! At v << c (e.g. v = 1e-4 c) they agree to 1e-8!
    for m_t in range(N_t):
        t = -0.5*T_win + T_win * m_t / (N_t - 1)
        xs = [x0[a] + v[a]*t for a in range(3)]
        rt = math.sqrt(sum(z*z for z in xs))
        nh = [z/rt for z in xs]
        # E_{ij}(t) = (GM / rt^3) (delta_{ij} - 3 nh_i nh_j)
        E = [[(GM/(rt**3))*((1.0 if i==j else 0.0) - 3.0*nh[i]*nh[j]) for j in range(3)] for i in range(3)]
        nxv = [nh[1]*v[2]-nh[2]*v[1], nh[2]*v[0]-nh[0]*v[2], nh[0]*v[1]-nh[1]*v[0]]
        B = [[(3.0*GM/(rt**3))*(nh[i]*nxv[j] + nh[j]*nxv[i]) for j in range(3)] for i in range(3)]
        out.extend(pack_EB_real10(E, B))
    return out

for T_win in [0.1, 0.02]:
    for v_perp in [1e-3, 3e-3]:
        r0 = 10.0
        vr = 0.5e-3
        p0 = [math.log(r0), 0.0, 0.0, 0.0, v_perp, 0.0, vr]
        N_t = 17
        y0 = moving_mass_series(p0, T_win, N_t)
        # Define electric SNR_E^2 = sum_t ||E(t)||_F^2, magnetic SNR_B^2 = sum_t ||B(t)||_F^2, Edot SNR^2 = sum_t ||E(t) - E_bar||_F^2!
        E_part = []
        B_part = []
        for m_t in range(N_t):
            E_part.append(y0[10*m_t : 10*m_t+5])
            B_part.append(y0[10*m_t+5 : 10*m_t+10])
        snrE = math.sqrt(sum(x*x for row in E_part for x in row))
        snrB = math.sqrt(sum(x*x for row in B_part for x in row))
        E_mean = [sum(E_part[m_t][a] for m_t in range(N_t))/N_t for a in range(5)]
        snrEdot_perp = math.sqrt(sum((E_part[m_t][a] - E_mean[a])**2 for m_t in range(N_t) for a in [2, 3])) # xz, yz shear components!

        eps = 1e-7
        J = []
        for k in range(7):
            pp, pm = p0[:], p0[:]
            pp[k] += eps; pm[k] -= eps
            yp, ym = moving_mass_series(pp, T_win, N_t), moving_mass_series(pm, T_win, N_t)
            J.append([(yp[i]-ym[i])/(2*eps) for i in range(len(y0))])
        F = [[sum(J[a][i]*J[b][i] for i in range(len(y0))) for b in range(7)] for a in range(7)]
        Cov = inv_real_sym(F)
        sig_lnr = math.sqrt(Cov[0][0])
        pred_var = 1.0/(snrB**2) + 1.0/(snrEdot_perp**2)
        print(f"T={T_win:4.2f}, v_p={v_perp:.0e}: sig_r/r = {sig_lnr:.6f} vs sqrt(1/SNR_B^2 + 1/SNR_Edot_perp^2) = {math.sqrt(pred_var):.6f} (ratio={sig_lnr/math.sqrt(pred_var):.8f})")
