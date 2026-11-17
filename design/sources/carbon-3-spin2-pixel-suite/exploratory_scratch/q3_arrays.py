import sys
sys.path.insert(0, "/Users/neo/.gemini/antigravity/brain/3ca0091c-61b7-44c6-9f3e-dc29ba5c08cd/scratch")
import math, cmath, random
from q2_spectral_v2 import q_vec, qr_col_pivoting_rank

def complex_matrix_rank(M_complex, tol=1e-9):
    # M_complex is R x C complex; convert to 2R x 2C real matrix and run column-pivoted Householder QR -> real rank / 2 = complex rank!
    R = len(M_complex)
    C = len(M_complex[0])
    J = []
    for r in range(R):
        row1 = []
        row2 = []
        for c in range(C):
            z = M_complex[r][c]
            row1.extend([z.real, -z.imag])
            row2.extend([z.imag,  z.real])
        J.append(row1)
        J.append(row2)
    rk, dr = qr_col_pivoting_rank(J, tol=tol)
    return rk // 2, dr

random.seed(2026)

print("=== TEST 1: KRUSKAL RANK OF N-PIXEL SPIN-2 STEERING VECTORS a(k) (x) q(k) IN C^{5N} ===")
for geom in ["collinear (along x-axis, D=100 lambda)", "planar", "3D random"]:
    for N in [1, 2, 3, 4]:
        if geom.startswith("collinear"):
            pos = [[100.0 * n, 0.0, 0.0] for n in range(N)] # in units of wavelength lambda (so k = 2 pi)
        elif geom == "planar":
            pos = [[17.3*n, 29.1*(n*n%5), 0.0] for n in range(N)]
        else:
            pos = [[random.uniform(-50,50) for _ in range(3)] for __ in range(N)]
        K = 5 * N # test full 5N linear independence -> implies 5N - 1 MUSIC resolution!
        cols = []
        for _ in range(K):
            th = math.acos(random.uniform(-0.95, 0.95))
            ph = random.uniform(0.0, 2*math.pi)
            kh = [math.sin(th)*math.cos(ph), math.sin(th)*math.sin(ph), math.cos(th)]
            q = q_vec(th, ph)
            vec = []
            for p in pos:
                phase = cmath.exp(2j * math.pi * (kh[0]*p[0] + kh[1]*p[1] + kh[2]*p[2]))
                for x in q:
                    vec.append(phase * x)
            cols.append(vec)
        M = [[cols[c][r] for c in range(K)] for r in range(5*N)]
        crk, dr = complex_matrix_rank(M)
        print(f"Geom={geom:38s} | N={N} (5N={5*N:2d}) -> complex rank of 5N random sources = {crk:2d}, min_R/max_R = {dr[-1]/dr[0]:.2e}")

# TEST 2: TWO PIXELS AT D = 100 lambda ALONG z-AXIS (COLLINEAR SPARSE INTERFEROMETER)!
# Check:
# (a) Inner product |<v_+(k), v_+(k_0)>|^2 == cos^8(vartheta/2) * cos^2(pi (D/lambda) (k - k_0).d_hat)
# (b) Grating lobes at m = +-1, +-2, ... AND azimuthal cone around baseline d_hat!
# WAIT A SECOND!! CHECK THE AZIMUTHAL CONE AROUND A 2-PIXEL BASELINE!!
# Suppose 2 pixels lie along the x-axis: d = (D, 0, 0)!
# For a SCALAR 2-pixel interferometer, ALL directions k with the SAME k_x = k_{0,x} (an ENTIRE 360-degree CONE around the x-axis!)
# have (k - k_0).d = 0, so the spatial phase factor cos^2(pi D (k_x - k_{0,x})/lambda) == 1 EVERYWHERE ON THAT CONE, EVEN FOR m = 0!!
# What does our 2-pixel SPIN-2 interferometer see around that m = 0 cone?!
# On that cone, vartheta != 0 everywhere except k = k_0, so cos^8(vartheta/2) < 1 EVERYWHERE ELSE ON THE CONE!!
print("\n=== TEST 2: TWO PIXELS SEPARATED BY D = 100 lambda ALONG x-AXIS ===")
D_over_lam = 100.0
pos2 = [[-0.5*D_over_lam, 0.0, 0.0], [0.5*D_over_lam, 0.0, 0.0]]
def v_plus_2px(th, ph):
    kh = [math.sin(th)*math.cos(ph), math.sin(th)*math.sin(ph), math.cos(th)]
    q = q_vec(th, ph)
    out = []
    for p in pos2:
        phase = cmath.exp(2j * math.pi * (kh[0]*p[0] + kh[1]*p[1] + kh[2]*p[2])) / math.sqrt(2.0)
        for x in q:
            out.append(phase * x)
    return out # unit norm in C^10!

th0, ph0 = 1.1, 0.4
k0 = [math.sin(th0)*math.cos(ph0), math.sin(th0)*math.sin(ph0), math.cos(th0)]
v0 = v_plus_2px(th0, ph0)

# Verify exact analytical formula |<v(k), v(k0)>|^2 = cos^8(vartheta/2) * cos^2(pi D (k_x - k_{0x}) / lam)
max_formula_err = 0.0
for _ in range(100):
    th = math.acos(random.uniform(-1, 1))
    ph = random.uniform(0, 2*math.pi)
    kh = [math.sin(th)*math.cos(ph), math.sin(th)*math.sin(ph), math.cos(th)]
    v = v_plus_2px(th, ph)
    ip2 = abs(sum(v[i].conjugate()*v0[i] for i in range(10)))**2
    cos_vt = max(-1.0, min(1.0, sum(kh[a]*k0[a] for a in range(3))))
    ana = ((0.5*(1.0 + cos_vt))**4) * (math.cos(math.pi * D_over_lam * (kh[0] - k0[0]))**2)
    max_formula_err = max(max_formula_err, abs(ip2 - ana))
print(f"Max error in |<v_+(k), v_+(k0)>|^2 == cos^8(vartheta/2) cos^2(pi D dk_x / lam): {max_formula_err:.2e}")

# Check Capon MVDR peak-to-sidelobe ratio at the m = 1 grating lobe (dk_x = 1 / D_over_lam = 0.01, same phi or in x-k0 plane)!
# Choose k_m1 with k_x = k0_x + 1/D_over_lam, keeping azimuth in the (e_x, k0) plane to MINIMIZE vartheta (worst-case grating lobe!):
# Specifically, if k0 makes angle alpha with x-axis (k0_x = cos alpha), then cos(alpha_1) = cos(alpha) + lambda/D => minimal vartheta_1 = |alpha_1 - alpha| ~ (lambda/D)/sin(alpha)!
alpha0 = math.acos(k0[0])
alpha1 = math.acos(k0[0] + 1.0/D_over_lam)
# Rotate k0 in the plane of x-axis and k0:
perp = [0.0, k0[1], k0[2]]
pn = math.hypot(k0[1], k0[2])
perp = [0.0, k0[1]/pn, k0[2]/pn]
k_m1 = [math.cos(alpha1), math.sin(alpha1)*perp[1], math.sin(alpha1)*perp[2]]
th1 = math.acos(k_m1[2])
ph1 = math.atan2(k_m1[1], k_m1[0])
v1 = v_plus_2px(th1, ph1)
ip2_m1 = abs(sum(v1[i].conjugate()*v0[i] for i in range(10)))**2
vt1 = abs(alpha1 - alpha0)
print(f"Worst-case m=1 grating lobe angle vartheta_1 = {vt1:.6f} rad: 1 - |<v1, v0>|^2 = {1 - ip2_m1:.6e} vs vartheta_1^2 = {vt1**2:.6e}")

# Compute exact Capon MVDR ratio P_Capon(k0) / P_Capon(k_m1) for S = P v0 v0^dag + sigma^2 I_10 (let SNR_amp = sqrt(P)/sigma):
# Note: S^{-1} = (1/sigma^2) [ I - (SNR^2 / (1 + SNR^2)) v0 v0^dag ]!
# So v^dag S^{-1} v = (1/sigma^2) [ 1 - (SNR^2 / (1 + SNR^2)) |<v, v0>|^2 ]!
# At k = k0: v0^dag S^{-1} v0 = (1/sigma^2) / (1 + SNR^2) => P_Capon(k0) = sigma^2 (1 + SNR^2).
# At k = k_m1: v1^dag S^{-1} v1 = (1/sigma^2) [ 1 + SNR^2 (1 - |<v1,v0>|^2) ] / (1 + SNR^2)!
# EXACT RATIO FOR ANY SNR AND ANY BASELINE:
# P_Capon(k0) / P_Capon(k_m1) = 1 + SNR_amp^2 * (1 - cos^8(vartheta_1 / 2)) !!
for snr_amp in [10.0, 100.0, 500.0, 1000.0]:
    ratio_exact = 1.0 + (snr_amp**2) * (1.0 - ip2_m1)
    print(f"D = 100 lambda, SNR_amp = {snr_amp:6.1f}: Capon main-to-(m=1 grating lobe) ratio = {ratio_exact:.4f} ({10*math.log10(ratio_exact):.2f} dB)")
