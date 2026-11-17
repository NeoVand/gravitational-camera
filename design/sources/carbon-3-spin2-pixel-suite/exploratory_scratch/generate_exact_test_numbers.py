import sys
sys.path.insert(0, "/Users/neo/.gemini/antigravity/brain/3ca0091c-61b7-44c6-9f3e-dc29ba5c08cd/scratch")
import math, cmath

# Import only pure functions without re-running heavy top-level scripts? Even cleaner: self-contained 100-line generator!
eps3 = [[[1 if (i,j,k) in [(0,1,2),(1,2,0),(2,0,1)] else (-1 if (i,j,k) in [(0,2,1),(2,1,0),(1,0,2)] else 0) for k in range(3)] for j in range(3)] for i in range(3)]

# Test Q5: Single-reading modified gravity + Fierz-Pauli + Brans-Dicke test!
# Take k_hat = (0.6, 0.0, 0.8), n = c/v_p = 0.8 (so v_p = 1.25 c, 1 - n^2 = 0.36).
# Orthonormal triad: e1 = (0.8, 0.0, -0.6), e2 = (0.0, 1.0, 0.0), k_hat = (0.6, 0.0, 0.8).
# Let the 6 ELL polarizations at t=0 be:
# E_+ = 1.2, E_x = -0.5, E_vx = 0.3, E_vy = -0.4, E_b = 0.7, E_l = -0.25!
e1 = [0.8, 0.0, -0.6]
e2 = [0.0, 1.0, 0.0]
kh = [0.6, 0.0, 0.8]
U_tri = [e1, e2, kh] # rows are e1, e2, kh; lab = U_tri^T * E_local * U_tri
Ep, Ex, Evx, Evy, Eb, El = 1.2, -0.5, 0.3, -0.4, 0.7, -0.25
E_loc = [
    [Eb + Ep, Ex,      Evx],
    [Ex,      Eb - Ep, Evy],
    [Evx,     Evy,     El ],
]
E_lab = [[sum(U_tri[a][i]*E_loc[a][b]*U_tri[b][j] for a in range(3) for b in range(3)) for j in range(3)] for i in range(3)]
n_sl = 0.8
B_lab = [[sum(n_sl * eps3[i][p][q] * kh[p] * E_lab[q][j] for p in range(3) for q in range(3)) for j in range(3)] for i in range(3)]

print("=== Q5 TEST VECTOR ===")
print("E_lab =", [[round(x, 10) for x in row] for row in E_lab])
print("B_lab =", [[round(x, 10) for x in row] for row in B_lab])
# Recover k_hat from left null vector of B_lab: cross product of two columns of B_lab!
c0 = [B_lab[i][0] for i in range(3)]
c1 = [B_lab[i][1] for i in range(3)]
k_cand = [c0[1]*c1[2]-c0[2]*c1[1], c0[2]*c1[0]-c0[0]*c1[2], c0[0]*c1[1]-c0[1]*c1[0]]
kn = math.sqrt(sum(x*x for x in k_cand))
k_cand = [x/kn for x in k_cand]
# Fix sign and recover n_sl = c/v_p from B = n [k]_x E:
kxE = [[sum(eps3[i][p][q]*k_cand[p]*E_lab[q][j] for p in range(3) for q in range(3)) for j in range(3)] for i in range(3)]
num = sum(B_lab[i][j]*kxE[i][j] for i in range(3) for j in range(3))
den = sum(kxE[i][j]**2 for i in range(3) for j in range(3))
if num < 0:
    k_cand = [-x for x in k_cand]
    num = -num
n_rec = num / den
print("Recovered k_hat =", [round(x, 12) for x in k_cand], "Recovered v_p/c =", round(1.0/n_rec, 12))

# Test Q6a: 12-vertex regular icosahedron 4th-order cumulant Frobenius contrast!
phi_g = (1.0 + math.sqrt(5.0)) / 2.0
verts = []
for s1 in [-1.0, 1.0]:
    for s2 in [-1.0, 1.0]:
        verts.append((0.0, s1, s2*phi_g))
        verts.append((s1, s2*phi_g, 0.0))
        verts.append((s2*phi_g, 0.0, s1))
vn = math.sqrt(1.0 + phi_g*phi_g)
verts = [[x/vn, y/vn, z/vn] for x,y,z in verts]
T_BASIS = [
    [[1/math.sqrt(2), 0, 0], [0, -1/math.sqrt(2), 0], [0, 0, 0]],
    [[0, 1/math.sqrt(2), 0], [1/math.sqrt(2), 0, 0], [0, 0, 0]],
    [[0, 0, 1/math.sqrt(2)], [0, 0, 0], [1/math.sqrt(2), 0, 0]],
    [[0, 0, 0], [0, 0, 1/math.sqrt(2)], [0, 1/math.sqrt(2), 0]],
    [[-1/math.sqrt(6), 0, 0], [0, -1/math.sqrt(6), 0], [0, 0, 2/math.sqrt(6)]],
]
# For unpolarized non-Gaussian source with unit 4th cumulant kappa_4 = 1 at direction k_hat:
# At t=0, E = A_+ e_+ + A_x e_x, B = A_+ e_x - A_x e_+, where (A_+, A_x) has rotational-invariant 4th cumulant
# or independent identically distributed A_+, A_x? Wait: if a source is unpolarized with random polarization angle psi uniform in [0, 2pi]
# and amplitude R with excess kurtosis, let's compute the rotationally-invariant single-source 4th-order E-only tensor K4_E(k_hat)!
# Wait: even simpler! Look at the electric 5-vector e(k, psi) = cos(2psi) u_+ + sin(2psi) u_x (where ||u_+||=||u_x||=1, u_+ . u_x = 0):
# Averaging (e (x) e (x) e (x) e) over psi in [0, 2pi]:
# <cos^4>=3/8, <sin^4>=3/8, <cos^2 sin^2>=1/8!
# Notice P_{AB}(k) = u_{+,A} u_{+,B} + u_{x,A} u_{x,B} is the 5x5 projection matrix onto the 2D TT plane at k_hat (independent of psi!!)!
# And averaging e_A e_B e_C e_D over psi gives EXACTLY (1/8) (P_{AB} P_{CD} + P_{AC} P_{BD} + P_{AD} P_{BC})!!
# Compute K4_ico = (1/12) sum_{v in ico} Sym(P(v) (x) P(v)) vs K4_iso = int_{S^2} Sym(P(k) (x) P(k)) dOmega/(4pi)!!
def P_mat(k):
    kx, ky, kz = k
    sp = math.hypot(kx, ky)
    if sp > 1e-12:
        e1 = [kx*kz/sp, ky*kz/sp, -sp]
        e2 = [-ky/sp, kx/sp, 0.0]
    else:
        e1 = [1.0, 0.0, 0.0]
        e2 = [0.0, 1.0 if kz>0 else -1.0, 0.0]
    ep = [[(e1[i]*e1[j] - e2[i]*e2[j])/math.sqrt(2) for j in range(3)] for i in range(3)]
    ex = [[(e1[i]*e2[j] + e2[i]*e1[j])/math.sqrt(2) for j in range(3)] for i in range(3)]
    up = [sum(ep[i][j]*T[i][j] for i in range(3) for j in range(3)) for T in T_BASIS]
    ux = [sum(ex[i][j]*T[i][j] for i in range(3) for j in range(3)) for T in T_BASIS]
    return [[up[a]*up[b] + ux[a]*ux[b] for b in range(5)] for a in range(5)]

def k4_from_dirs(dirs_weights):
    K2 = [[0.0]*5 for _ in range(5)]
    K4 = [[[[0.0]*5 for _ in range(5)] for __ in range(5)] for ___ in range(5)]
    for k, w in dirs_weights:
        P = P_mat(k)
        for a in range(5):
            for b in range(5):
                K2[a][b] += w * P[a][b]
                for c in range(5):
                    for d in range(5):
                        K4[a][b][c][d] += w * (P[a][b]*P[c][d] + P[a][c]*P[b][d] + P[a][d]*P[b][c]) / 8.0
    return K2, K4

K2_ico, K4_ico = k4_from_dirs([(v, 1.0/12.0) for v in verts])
# Exact Gauss-Legendre spherical quadrature of order 20 (exact up to l = 39!):
def leg_gauss(n):
    xs, ws = [], []
    for k in range(1, n+1):
        x = math.cos(math.pi*(k - 0.25)/(n + 0.5))
        for _ in range(30):
            p0, p1 = 1.0, x
            for m in range(2, n+1):
                p0, p1 = p1, ((2*m-1)*x*p1 - (m-1)*p0)/m
            dp = n*(x*p1 - p0)/(x*x - 1.0)
            x -= p1 / dp
        xs.append(x); ws.append(2.0/((1.0-x*x)*dp*dp))
    return xs, ws
xs, ws = leg_gauss(16)
sph_pts = []
for ct, wt in zip(xs, ws):
    st = math.sqrt(max(0.0, 1.0 - ct*ct))
    for ip in range(32):
        ph = 2*math.pi*ip/32.0
        sph_pts.append(([st*math.cos(ph), st*math.sin(ph), ct], wt / (2.0 * 32.0)))
K2_iso, K4_iso = k4_from_dirs(sph_pts)
diff_K2 = math.sqrt(sum((K2_ico[a][b] - K2_iso[a][b])**2 for a in range(5) for b in range(5)))
diff_K4 = math.sqrt(sum((K4_ico[a][b][c][d] - K4_iso[a][b][c][d])**2 for a in range(5) for b in range(5) for c in range(5) for d in range(5)))
norm_K4 = math.sqrt(sum((K4_iso[a][b][c][d])**2 for a in range(5) for b in range(5) for c in range(5) for d in range(5)))
print(f"\n=== Q6a ICOSAHEDRON CUMULANT TEST ===")
print(f"2nd moment ||K2_ico - K2_iso||_F = {diff_K2:.3e} (exact 0!)")
print(f"4th cumulant ||K4_ico - K4_iso||_F / ||K4_iso||_F = {diff_K4 / norm_K4:.10f} (||K4_iso||_F = {norm_K4:.10f})")
