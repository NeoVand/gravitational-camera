import math, random

eps3 = [[[0]*3 for _ in range(3)] for __ in range(3)]
for i in range(3):
    for j in range(3):
        for k in range(3):
            if (i,j,k) in [(0,1,2),(1,2,0),(2,0,1)]:
                eps3[i][j][k] = 1
            elif (i,j,k) in [(0,2,1),(2,1,0),(1,0,2)]:
                eps3[i][j][k] = -1

def plane_wave_EBJ(k_hat, n_slowness, h_dd_4x4):
    """
    Exact linearized Riemann curvature for ANY plane metric perturbation h_{mu nu}(u)
    where u = t - (n_slowness / c) (k_hat . x), evaluated at u = 0 with c = 1 and d^2 h_{mu nu} / du^2 = h_dd_4x4!
    Here n_slowness = c / v_p = c k / omega.
    So d_0 = d/du, d_i = -n_slowness * k_hat_i * d/du!
    d_alpha d_beta h_{gamma delta} = k4_alpha * k4_beta * h_dd_4x4[gamma][delta],
    where k4 = [1.0, -n*kx, -n*ky, -n*kz] (since d_0 = +1, d_i = -n k_i)!
    Returns:
      E (3x3 symmetric), B (3x3 trace-free), J (3x3 spatial curvature 1/4 eps_{ipq} eps_{jrs} R_{pqrs})
    """
    k4 = [1.0, -n_slowness*k_hat[0], -n_slowness*k_hat[1], -n_slowness*k_hat[2]]
    def R4(a, b, c, d):
        return 0.5 * (
            k4[b]*k4[c]*h_dd_4x4[a][d]
            + k4[a]*k4[d]*h_dd_4x4[b][c]
            - k4[a]*k4[c]*h_dd_4x4[b][d]
            - k4[b]*k4[d]*h_dd_4x4[a][c]
        )
    E = [[R4(0, i+1, 0, j+1) for j in range(3)] for i in range(3)]
    B = [[0.0]*3 for _ in range(3)]
    J = [[0.0]*3 for _ in range(3)]
    for i in range(3):
        for j in range(3):
            sb = 0.0
            for p in range(3):
                for q in range(3):
                    if eps3[i][p][q] != 0:
                        sb += 0.5 * eps3[i][p][q] * R4(p+1, q+1, j+1, 0)
            B[i][j] = sb
            sj = 0.0
            for p in range(3):
                for q in range(3):
                    if eps3[i][p][q] == 0: continue
                    for r in range(3):
                        for s in range(3):
                            if eps3[j][r][s] != 0:
                                sj += 0.25 * eps3[i][p][q] * eps3[j][r][s] * R4(p+1, q+1, r+1, s+1)
            J[i][j] = sj
    return E, B, J

random.seed(99)

# 1. Verify universal Bianchi identity B = (c / v_p) [k_hat]_x E AND J = ? for COMPLETELY RANDOM 4x4 metric h_{mu nu}, random k_hat, random v_p!
print("=== 1. UNIVERSAL METRIC IDENTITY CHECK FOR RANDOM 4x4 h_{mu nu} AND ARBITRARY PHASE SPEED v_p ===")
max_B_err = 0.0
max_trB = 0.0
max_pure_gauge = 0.0
for _ in range(20):
    v = [random.gauss(0,1) for _ in range(3)]
    vn = math.sqrt(sum(x*x for x in v))
    kh = [x/vn for x in v]
    n_sl = random.uniform(0.3, 2.5) # c / v_p
    A = [[random.gauss(0,1) for _ in range(4)] for __ in range(4)]
    hdd = [[0.5*(A[a][b]+A[b][a]) for b in range(4)] for a in range(4)]
    E, B, J = plane_wave_EBJ(kh, n_sl, hdd)
    # Predicted B_{ij} = n_sl * eps_{ipq} kh_p E_{qj}
    B_pred = [[sum(n_sl * eps3[i][p][q] * kh[p] * E[q][j] for p in range(3) for q in range(3)) for j in range(3)] for i in range(3)]
    max_B_err = max(max_B_err, max(abs(B[i][j] - B_pred[i][j]) for i in range(3) for j in range(3)))
    max_trB = max(max_trB, abs(B[0][0]+B[1][1]+B[2][2]))

    # Pure gauge test: h_{ab} = k4_a xi_b + k4_b xi_a
    k4 = [1.0, -n_sl*kh[0], -n_sl*kh[1], -n_sl*kh[2]]
    xi = [random.gauss(0,1) for _ in range(4)]
    hg = [[k4[a]*xi[b] + k4[b]*xi[a] for b in range(4)] for a in range(4)]
    Eg, Bg, Jg = plane_wave_EBJ(kh, n_sl, hg)
    max_pure_gauge = max(max_pure_gauge, max(abs(Eg[i][j]) + abs(Bg[i][j]) + abs(Jg[i][j]) for i in range(3) for j in range(3)))

print(f"Max |B - (c/v_p)[k]_x E| across 20 random 10-comp metric waves: {max_B_err:.2e}")
print(f"Max |tr B|: {max_trB:.2e}, Max pure-gauge leakage: {max_pure_gauge:.2e}")

# Also check J_{ij} in terms of E_{ij} and n_sl = c/v_p!
# Along kh = (0,0,1): R_{pqrs} = 1/2 (k_q k_r h_{ps} + k_p k_s h_{qr} - k_p k_r h_{qs} - k_q k_s h_{pr})!
# Wait: since k_1 = k_2 = 0 and k_3 = -n_sl, R_{1212} = 0!!
# Let's print E, B, J along kh = (0,0,1) for each of the 6 Eardley-Lee-Lightman modes!
print("\n=== 2. ALL 6 EARDLEY-LEE-LIGHTMAN POLARIZATIONS ALONG k_hat = (0,0,1) AT n = c/v_p ===")
# In synchronous gauge h_{0mu} = 0, E_{ij} = -1/2 h_dd_{ij}, so set h_dd_{ij} = -2 E_{ij}!
ell_modes = {
    "plus (+)":        [[1,0,0],[0,-1,0],[0,0,0]],
    "cross (x)":       [[0,1,0],[1,0,0],[0,0,0]],
    "vector-x":        [[0,0,1],[0,0,0],[1,0,0]],
    "vector-y":        [[0,0,0],[0,0,1],[0,1,0]],
    "breathing (b)":   [[1,0,0],[0,1,0],[0,0,0]],
    "longitudinal (l)":[[0,0,0],[0,0,0],[0,0,1]],
}
n_test = 0.8 # e.g. v_p = 1.25 c (massive dispersion ck/omega = 0.8)
for name, E_in in ell_modes.items():
    hdd = [[0.0]*4 for _ in range(4)]
    for i in range(3):
        for j in range(3):
            hdd[i+1][j+1] = -2.0 * E_in[i][j]
    E, B, J = plane_wave_EBJ([0,0,1], n_test, hdd)
    print(f"Mode {name:17s}: tr(E)={sum(E[i][i] for i in range(3)):+.2f}, |B|_F={math.sqrt(sum(B[i][j]**2 for i in range(3) for j in range(3))):.4f}, |B_asym|_F={math.sqrt(sum((0.5*(B[i][j]-B[j][i]))**2 for i in range(3) for j in range(3))):.4f}, diag(J)={[round(J[i][i],3) for i in range(3)]}")

# 3. FIERZ-PAULI MASSIVE GRAVITON (5 POLARIZATIONS: helicity +-2, +-1, 0)!
# Dispersion: omega^2 = c^2 k^2 + omega_m^2 (set omega = 1, c = 1, so k = sqrt(1 - omega_m^2) = n_sl, and mu_g = omega_m)!
# Four-momentum k^mu = (1, 0, 0, k), k_mu = (-1, 0, 0, k), k^mu k_mu = -1 + k^2 = -mu_g^2!
# Orthonormal polarization 4-vectors orthogonal to k^mu (eta_{ab} eps^a eps^b = +1, k_a eps^a = 0):
#   eps_1^mu = (0, 1, 0, 0)
#   eps_2^mu = (0, 0, 1, 0)
#   eps_L^mu = (k / mu_g, 0, 0, 1 / mu_g)  --> check: k_mu eps_L^mu = -k/mu_g + k/mu_g = 0; norm = (-k^2 + 1)/mu_g^2 = +1!
# Lower indices with eta = diag(-1, 1, 1, 1):
#   eps_{1,mu} = (0, 1, 0, 0)
#   eps_{2,mu} = (0, 0, 1, 0)
#   eps_{L,mu} = (-k / mu_g, 0, 0, 1 / mu_g)
# Five orthonormal symmetric trace-free transverse (k^mu e_{mu nu} = 0, eta^{mu nu} e_{mu nu} = 0) Fierz-Pauli polarization tensors:
#   e^(+)  = 1/sqrt(2) (eps_1 (x) eps_1 - eps_2 (x) eps_2)          (helicity +-2)
#   e^(x)  = 1/sqrt(2) (eps_1 (x) eps_2 + eps_2 (x) eps_1)          (helicity +-2)
#   e^(vx) = 1/sqrt(2) (eps_1 (x) eps_L + eps_L (x) eps_1)          (helicity +-1)
#   e^(vy) = 1/sqrt(2) (eps_2 (x) eps_L + eps_L (x) eps_2)          (helicity +-1)
#   e^(S)  = sqrt(3/2) [ eps_L (x) eps_L - 1/3 (eta + k_cov (x) k_cov / mu_g^2) ] ?
#   Check trace of e^(S) with eta^{mu nu}: 1 - 1/3 (4 - 1) = 1 - 1 = 0!
#   Check k^mu e^(S)_{mu nu}: 0 - 1/3 (k_nu + (-mu_g^2) k_nu / mu_g^2) = 0!
#   Check norm e^(S)_{mu nu} e^(S)^{mu nu}: (3/2) * [1 - 2/3 + 1/9 * 3] = (3/2)*(2/3) = 1!!
print("\n=== 3. EXACT FIERZ-PAULI MASSIVE GRAVITON (5 POLARIZATIONS) FOR omega_m / omega = 0.6 (so ck/omega = 0.8) ===")
mu_g = 0.6 # omega_m / omega
k_val = math.sqrt(1.0 - mu_g**2) # 0.8
eps1 = [0.0, 1.0, 0.0, 0.0]
eps2 = [0.0, 0.0, 1.0, 0.0]
epsL = [-k_val/mu_g, 0.0, 0.0, 1.0/mu_g]
k_cov = [-1.0, 0.0, 0.0, k_val]
eta = [[-1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]]

fp_modes = {
    "FP tensor +": [[(eps1[a]*eps1[b] - eps2[a]*eps2[b])/math.sqrt(2) for b in range(4)] for a in range(4)],
    "FP tensor x": [[(eps1[a]*eps2[b] + eps2[a]*eps1[b])/math.sqrt(2) for b in range(4)] for a in range(4)],
    "FP vector x": [[(eps1[a]*epsL[b] + epsL[a]*eps1[b])/math.sqrt(2) for b in range(4)] for a in range(4)],
    "FP vector y": [[(eps2[a]*epsL[b] + epsL[a]*eps2[b])/math.sqrt(2) for b in range(4)] for a in range(4)],
    "FP scalar 0": [[math.sqrt(1.5)*(epsL[a]*epsL[b] - (eta[a][b] + k_cov[a]*k_cov[b]/(mu_g**2))/3.0) for b in range(4)] for a in range(4)],
}

for name, pol4 in fp_modes.items():
    # For h = cos(omega t - k z) * pol4, at u=0: d^2 h / du^2 = -omega^2 pol4 = -pol4!
    hdd = [[-pol4[a][b] for b in range(4)] for a in range(4)]
    E, B, J = plane_wave_EBJ([0,0,1], k_val, hdd)
    print(f"{name:13s}: E_diag={[round(E[i][i],6) for i in range(3)]}, E_13={E[0][2]:+.6f}, E_23={E[1][2]:+.6f}, tr(E)={sum(E[i][i] for i in range(3)):+.6f}")
