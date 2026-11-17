import sys
sys.path.insert(0, "/Users/neo/.gemini/antigravity/brain/3ca0091c-61b7-44c6-9f3e-dc29ba5c08cd/scratch")
import math, cmath, random
from q1_ranging import eval_W_exact, rot_quad_derivs
from q4_crlb import inv_real_sym, pack_EB_real10
from q4_ranging_crlb import eval_binary_cycle_vec
from q5_beyond_gr import plane_wave_EBJ, eps3
from q2_demo_algos import mat_to_khat

# 1. Pure plane wave (kr -> inf, 6 unknowns: [th1, th2, ln_A, iota, psi, phi0], NO ln_r) over a full cycle!
print("=== 1. PURE PLANE-WAVE DIRECTION CRLB OVER A FULL CYCLE (6 UNKNOWNS, NO RANGING) ===")
for iota_deg in [0.0, 30.0, 45.0, 60.0, 89.99]:
    iota = math.radians(iota_deg)
    # Fix ln_r = log(1e5) -> plane wave limit, differentiate only wrt params[1..6]!
    p0 = [math.log(1e4), 0.0, 0.0, 0.0, iota, 0.3, 0.5]
    y0 = eval_binary_cycle_vec(p0, N_t=16)
    rho = math.sqrt(sum(x*x for x in y0))
    eps = 1e-6
    J = []
    # Note: at iota = 0, psi and phi0 are degenerate (2 psi + phi0), so for iota=0 fix psi and take 5 unknowns!
    idxs = [1, 2, 3, 4, 6] if iota_deg == 0.0 else [1, 2, 3, 4, 5, 6]
    for k in idxs:
        pp, pm = p0[:], p0[:]
        pp[k] += eps; pm[k] -= eps
        yp, ym = eval_binary_cycle_vec(pp, 16), eval_binary_cycle_vec(pm, 16)
        J.append([(yp[i]-ym[i])/(2*eps) for i in range(len(y0))])
    F = [[sum(J[a][i]*J[b][i] for i in range(len(y0))) for b in range(len(idxs))] for a in range(len(idxs))]
    Cov = inv_real_sym(F)
    print(f"iota={iota_deg:5.2f} deg: rho*sig_th1 = {rho*math.sqrt(Cov[0][0]):.8f}, rho*sig_th2 = {rho*math.sqrt(Cov[1][1]):.8f}, off-diag={Cov[0][1]:.2e}")

# 2. Check the NEW O(1/(kr)) TWO-HELICITY APPARENT-DIRECTION ABERRATION BETWEEN W_+(omega) AND W_-^*(omega)!!
print("\n=== 2. EXACT O(1/(kr)) ANGLE BETWEEN APPARENT DIRECTIONS k_+ (from W_+) AND k_- (from W_-^*) ===")
# Wait: for W(t) = E(t) + i B(t) = W_+ e^{-i omega t} + W_- e^{+i omega t}:
# Notice W_+(omega) = 1/2 (E_tilde(omega) + i B_tilde(omega)) ~ alpha_+ m m^T + beta_+ (m k^T + k m^T)
# What about W_-(omega) = 1/2 (E_tilde(-omega) + i B_tilde(-omega)) = 1/2 (E_tilde*(omega) + i B_tilde*(omega))
# => W_-^*(omega) = 1/2 (E_tilde(omega) - i B_tilde(omega))!!
# Wait: in our peeling table, ALL terms at r^-1, r^-2, r^-3 had ONLY m m^T and (m k^T + k m^T), NEVER m* m*^T or (m* k^T + k m*^T)!!
# WAIT A SECOND!! READ THAT AGAIN!!
# IN W(t) = E(t) + i B(t), BOTH W_+(e^{-i omega t} mode of W(t)) AND W_-(e^{+i omega t} mode of W(t)) ARE BUILT FROM +m (NOT m*) UP TO ORDER r^-3!!
# Let's check what k_hat(W_+) and k_hat(W_-) are!!
for iota_deg in [30.0, 45.0, 60.0]:
    iota = math.radians(iota_deg)
    kh = [math.sin(iota), 0.0, math.cos(iota)]
    for r in [100.0, 400.0]:
        _, _, W0 = eval_W_exact([r*kh[0], r*kh[1], r*kh[2]], rot_quad_derivs(0.0, 1.0))
        _, _, W90 = eval_W_exact([r*kh[0], r*kh[1], r*kh[2]], rot_quad_derivs(math.pi/2, 1.0))
        Wp = [[0.5*(W0[a][b] + 1j*W90[a][b]) for b in range(3)] for a in range(3)]
        Wm = [[0.5*(W0[a][b] - 1j*W90[a][b]) for b in range(3)] for a in range(3)]
        # Leading singular vector or rank-1 direction of Wp and Wm:
        # Take m_p = Wp * e_2 (since e_2 = (0,1,0) has m . e_2 = i/sqrt(2) != 0):
        mp = [Wp[i][1] for i in range(3)]
        mm = [Wm[i][1] for i in range(3)]
        def m_to_k(m):
            n2 = sum(abs(x)**2 for x in m)
            c = [
                m[1]*m[2].conjugate() - m[2]*m[1].conjugate(),
                m[2]*m[0].conjugate() - m[0]*m[2].conjugate(),
                m[0]*m[1].conjugate() - m[1]*m[0].conjugate(),
            ]
            kv = [(1j*x/n2).real for x in c]
            kn = math.sqrt(sum(x*x for x in kv))
            return [x/kn for x in kv]
        kp = m_to_k(mp)
        km = m_to_k(mm)
        dot = max(-1.0, min(1.0, sum(kp[a]*km[a] for a in range(3))))
        ang = math.acos(dot)
        ci, si = math.cos(iota), math.sin(iota)
        # Predict exact angle!
        # Let's check Wp: Q_+(theta=0) + i Q_+(theta=pi/2):
        # For e^{-i theta} mode: d/du = -i, so Q^{(4)} = +Q, Q^{(3)} = +i Q, Q^{(2)} = -Q!
        # Wait: earlier alpha_1(theta) = -(1+ci^2)cos(t) + 2i ci sin(t) = -(1/2)(1+ci)^2 e^{-it} - (1/2)(1-ci)^2 e^{+it}!
        # And beta_2(theta) = 2 sqrt(2) si (ci sin(t) + i cos(t)) = i sqrt(2) si (1 - ci) e^{-it}? Wait:
        # Check e^{-it} coeff of (ci sin t + i cos t) = ci (1/(2i)) + i (1/2) = (i/2)(1 - ci)!!
        # Check e^{+it} coeff of (ci sin t + i cos t) = ci (-1/(2i)) + i (1/2) = (i/2)(1 + ci)!!
        # OMG!! LOOK AT beta_2 / alpha_1 FOR THE TWO MODES e^{-it} (Wp) AND e^{+it} (Wm):
        # For Wp (e^{-it}): beta_{2,+} / alpha_{1,+} = [ i sqrt(2) si (1 - ci) ] / [ -(1/2)(1 + ci)^2 ] = -2 sqrt(2) i * sin(iota)*(1 - cos iota)/(1 + cos iota)^2 !!
        # For Wm (e^{+it}): beta_{2,-} / alpha_{1,-} = [ i sqrt(2) si (1 + ci) ] / [ -(1/2)(1 - ci)^2 ] = -2 sqrt(2) i * sin(iota)*(1 + cos iota)/(1 - cos iota)^2 !!
        # Wait: how much does m' = m + eps * k tilt k_hat = i (m x m*) / |m|^2?!
        # Let m = (e1 + i e2)/sqrt(2), delta_m = (-i * delta) k_hat (purely imaginary coeff -i*delta!):
        # m' = (e1 + i (e2 - sqrt(2)*delta * k_hat)) / sqrt(2) -> tilts e2 -> e2 - sqrt(2)*delta*k_hat, which tilts k_hat = e1 x e2 -> k_hat + sqrt(2)*delta * e1?
        # Wait: let's check r * ang against si / (1 - ci^2) = 1/sin(iota) or 4/(sin iota)... let's print r * ang!
        print(f"iota={iota_deg:4.1f}, kr={r:5.1f}: kr * angle(k_+, k_-) = {r * ang:.8f} | try 16*ci/(si*(1-ci*ci))? -> ratio={(r*ang)*((1-ci*ci)**2)/(si*ci):.8f}")

# 3. Single-snapshot SVD ranging CRLB: 6 unknowns [ln_r, th1, th2, Ep, Ex, ?] -> wait: at ONE snapshot,
# a rotating binary at known phase theta=0 (or with unknown amplitude A and known inclination iota, phase theta)
# vs unknown (ln_r, th1, th2, A_re, A_im) when iota is known!
# Even simpler: directly compute Var(s2 / s1) under delta_W = delta_E + i delta_B (10 real N(0, sigma^2) STF coords)!
print("\n=== 3. MONTE CARLO VERIFICATION OF SINGLE-SNAPSHOT s2/s1 NOISE FLOOR & RANGE LIMIT ===")
random.seed(7)
iota = math.radians(60.0)
theta = 0.0 # C(60, 0) = 6/25 = 0.24
kh = [math.sin(iota), 0.0, math.cos(iota)]
r_test = 20.0
E_tr, B_tr, W_tr = eval_W_exact([r_test*kh[0], r_test*kh[1], r_test*kh[2]], rot_quad_derivs(theta, 1.0))
from q1_svd_verify import svd_exact_3x3
from q2_spectral_v2 import T_BASIS
s1_0, s2_0, _ = svd_exact_3x3(W_tr)
rho_snap = 1e4 # high SNR so asymptotic variance holds cleanly!
sigma_n = s1_0 / rho_snap # since ||W||_F ~ s1_0, rho = ||W||_F / sigma_n ~ s1_0 / sigma_n!
diffs = []
for _ in range(2000):
    dE = [[0.0]*3 for _ in range(3)]
    dB = [[0.0]*3 for _ in range(3)]
    for T in T_BASIS:
        ge = random.gauss(0.0, sigma_n)
        gb = random.gauss(0.0, sigma_n)
        for a in range(3):
            for b in range(3):
                dE[a][b] += ge * T[a][b]
                dB[a][b] += gb * T[a][b]
    Wn = [[W_tr[a][b] + dE[a][b] + 1j*dB[a][b] for b in range(3)] for a in range(3)]
    s1_n, s2_n, _ = svd_exact_3x3(Wn)
    diffs.append(s2_n/s1_n - s2_0/s1_0)
rms_ratio = math.sqrt(sum(d*d for d in diffs)/len(diffs))
print(f"Snapshot rho = {rho_snap}: empirical RMS(s2/s1) * rho = {rms_ratio * rho_snap:.6f} (compare sqrt(4/3) = {math.sqrt(4.0/3.0):.6f}!)")

# 4. Verify Brans-Dicke scalar wave E_l / E_b = +(1 - n^2) and J = n^2 [k]_x E [k]_x^T!
print("\n=== 4. BRANS-DICKE MASSIVE SCALAR WAVE vs FIERZ-PAULI MASSIVE GRAVITON ===")
n_sl = 0.8 # 1 - n^2 = 0.36
eta = [[-1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]]
E_bd, B_bd, J_bd = plane_wave_EBJ([0,0,1], n_sl, eta)
print(f"Brans-Dicke scalar wave (n=0.8, 1-n^2=0.36): E_b = {E_bd[0][0]:.6f}, E_l = {E_bd[2][2]:.6f}, E_l / E_b = {E_bd[2][2]/E_bd[0][0]:+.6f} (exact +(1-n^2) = +0.360000!)")
