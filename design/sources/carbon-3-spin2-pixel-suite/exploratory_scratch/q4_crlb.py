import sys
sys.path.insert(0, "/Users/neo/.gemini/antigravity/brain/3ca0091c-61b7-44c6-9f3e-dc29ba5c08cd/scratch")
import math, cmath
from q1_ranging import eval_W_exact, eps3
from q2_spectral_v2 import T_BASIS, mat_to_stf5

def inv_real_sym(F):
    n = len(F)
    M = [row[:] + [1.0 if i==j else 0.0 for j in range(n)] for i, row in enumerate(F)]
    for col in range(n):
        piv = max(range(col, n), key=lambda r: abs(M[r][col]))
        M[col], M[piv] = M[piv], M[col]
        div = M[col][col]
        for c in range(2*n): M[col][c] /= div
        for r in range(n):
            if r != col:
                fac = M[r][col]
                for c in range(2*n): M[r][c] -= fac * M[col][c]
    return [row[n:] for row in M]

def pack_EB_real10(E, B):
    return mat_to_stf5(E) + mat_to_stf5(B)

# ==============================================================================
# 4(a). DIRECTION OF ONE PLANE WAVE (Instantaneous & Multi-cycle)
# ==============================================================================
print("=== 4(a) CRLB FOR ONE PLANE WAVE DIRECTION ===")
def wave_10vec(params):
    # params = [th, ph, E_plus, E_cross]
    th, ph, Ep, Ex = params
    ct, st = math.cos(th), math.sin(th)
    cp, sp = math.cos(ph), math.sin(ph)
    e1 = [ct*cp, ct*sp, -st]
    e2 = [-sp, cp, 0.0]
    m = [(e1[i] + 1j*e2[i])/math.sqrt(2.0) for i in range(3)]
    # W = E + i B = 2 (Ep - i Ex) m m^T
    c0 = 2.0 * (Ep - 1j*Ex)
    E = [[(c0*m[i]*m[j]).real for j in range(3)] for i in range(3)]
    B = [[(c0*m[i]*m[j]).imag for j in range(3)] for i in range(3)]
    return pack_EB_real10(E, B)

for pol_name, (Ep, Ex) in [("Linear (+)", (1.0, 0.0)), ("Elliptical", (0.8, 0.6)), ("Circular", (0.70710678, 0.70710678))]:
    th0, ph0 = 1.1, 0.7
    p0 = [th0, ph0, Ep, Ex]
    y0 = wave_10vec(p0)
    rho2 = sum(x*x for x in y0) # ||W||_F^2 (with sigma = 1)
    eps = 1e-7
    J = []
    for k in range(4):
        pp, pm = p0[:], p0[:]
        pp[k] += eps; pm[k] -= eps
        yp, ym = wave_10vec(pp), wave_10vec(pm)
        J.append([(yp[i]-ym[i])/(2*eps) for i in range(10)])
    F = [[sum(J[a][i]*J[b][i] for i in range(10)) for b in range(4)] for a in range(4)]
    Cov = inv_real_sym(F)
    sig_th = math.sqrt(Cov[0][0])
    sig_ph_sin = math.sqrt(Cov[1][1]) * math.sin(th0)
    print(f"Pol={pol_name:12s}: rho={math.sqrt(rho2):.6f} | rho*sig_theta={ math.sqrt(rho2)*sig_th:.10f}, rho*sin(th)*sig_phi={math.sqrt(rho2)*sig_ph_sin:.10f}, off-diag={Cov[0][1]:.2e}")

# ==============================================================================
# 4(b). VELOCITY FROM THE STATIC-SCENE SPEEDOMETER (Slow & Exact Relativistic!)
# ==============================================================================
print("\n=== 4(b) CRLB FOR STATIC-SCENE SPEEDOMETER (8 UNKNOWNS JOINTLY ESTIMATED FROM 10 NUMBERS) ===")
# Exact SO(3, C) boost of a static Weyl matrix E_rest = diag(l1, l2, -l1-l2)!
# Convention check: W = E + i B. Under pixel boost by velocity v (rapidity eta, unit u_hat):
# Let's check sign of boost generator on W = E + i B!
# Earlier Eq. (34) for mass moving at +v (so pixel moves at -v relative to static mass! Wait: if scene is static and pixel moves at +v, every static mass moves at -v in pixel's frame!):
# Wait: in Serendipity 3 (line 99 of ten_components_serendipities.md):
# For mass moving at v_mass = -v_pixel: B_{ij} = -(1/c)(eps_{ipq} v_p E_{qj} + eps_{jpq} v_p E_{qi}) -> in E eigenframe, B_{23} = ((l3 - l2)/c) v_1?
# Let's check directly with Eq. (34)!
# Put static mass M on +x axis (n_hat = (1,0,0)), so E = (GM/r^3) diag(-2, 1, 1): l1 = -2, l2 = 1, l3 = 1.
# Suppose pixel moves at v_pix = (0, v_y, 0), so mass moves at v_mass = (0, -v_y, 0) in pixel's frame.
# Eq. (34): n x v_mass = (1,0,0) x (0,-v_y,0) = (0, 0, -v_y) => B_{13} = B_{31} = (3GM/cr^3)(-v_y).
# With l1 = -2GM/r^3, l3 = +1GM/r^3: (l1 - l3)/c * v_y = (-3GM/cr^3) v_y == B_{31}!! EXACT!
# And what complex orthogonal matrix G in SO(3, C) gives W = G E_rest G^T = E_rest + i B to first order in v/c?!
# Let K_a be (K_a)_{ij} = -eps_{aij} (so (u . K)_{ij} = -eps_{ijk} u_k, real antisymmetric!).
# Check G = exp(+i eta (u . K)) with W = G E G^T:
# At small eta = v/c: W ~ E + i eta [ (u.K) E + E (u.K)^T ] = E + i eta [ (u.K) E - E (u.K) ].
# For (i,j) = (3,1), u = (0,1,0), E = diag(l1, l2, l3):
# [(K_2) E - E (K_2)]_{31} = (K_2)_{31} l1 - l3 (K_2)_{31} = (-eps_{231})(l1 - l3) = -(l1 - l3)!
# To get +(l1 - l3), we need G = exp(-i eta (u . K)) * R^T!!
# Let's verify at v = 0.5 c against exact boosted Schwarzschild / Liénard-Wiechert curvature or check G^T G = I!

def exp_complex_antisym(ax, ay, az):
    # Computes exp(M) where M_{ij} = -eps_{ijk} a_k for complex vector a = (ax, ay, az), using Rodrigues formula!
    # Note: theta^2 = ax^2 + ay^2 + az^2 (complex!).
    # M^2_{ij} = a_i a_j - theta^2 delta_{ij}, M^3 = -theta^2 M!
    # So exp(M) = I + (sin theta / theta) M + ((1 - cos theta) / theta^2) M^2!
    th2 = ax*ax + ay*ay + az*az
    th = cmath.sqrt(th2)
    if abs(th) < 1e-8:
        c1 = 1.0 - th2/6.0 + th2*th2/120.0
        c2 = 0.5 - th2/24.0 + th2*th2/720.0
    else:
        c1 = cmath.sin(th) / th
        c2 = (1.0 - cmath.cos(th)) / th2
    a = [ax, ay, az]
    M = [[0j]*3 for _ in range(3)]
    for i in range(3):
        for j in range(3):
            for k in range(3):
                if eps3[i][j][k] != 0:
                    M[i][j] -= eps3[i][j][k] * a[k]
    M2 = [[sum(M[i][k]*M[k][j] for k in range(3)) for j in range(3)] for i in range(3)]
    G = [[(1.0 if i==j else 0.0) + c1*M[i][j] + c2*M2[i][j] for j in range(3)] for i in range(3)]
    return G

def speedometer_10vec(params):
    # params = [l1, l2, rx, ry, rz, bx, by, bz] where beta = v/c = (bx, by, bz)
    l1, l2, rx, ry, rz, bx, by, bz = params
    l3 = -l1 - l2
    E0 = [[l1, 0, 0], [0, l2, 0], [0, 0, l3]]
    R = exp_complex_antisym(rx, ry, rz)
    bmag = math.sqrt(bx*bx + by*by + bz*bz)
    if bmag < 1e-12:
        eta_vec = [0j, 0j, 0j]
    else:
        eta = math.atanh(bmag)
        eta_vec = [-1j * eta * bx / bmag, -1j * eta * by / bmag, -1j * eta * bz / bmag]
    B_boost = exp_complex_antisym(*eta_vec)
    # W_obs = B_boost * R * E0 * R^T * B_boost^T
    G = [[sum(B_boost[i][k]*R[k][j] for k in range(3)) for j in range(3)] for i in range(3)]
    tmp = [[sum(G[i][k]*E0[k][j] for k in range(3)) for j in range(3)] for i in range(3)]
    W = [[sum(tmp[i][k]*G[j][k] for k in range(3)) for j in range(3)] for i in range(3)]
    E = [[W[i][j].real for j in range(3)] for i in range(3)]
    B = [[W[i][j].imag for j in range(3)] for i in range(3)]
    return pack_EB_real10(E, B)

l1, l2 = 2.0, -0.5 # so l3 = -1.5; |l2-l3|=1.0, |l3-l1|=3.5, |l1-l2|=2.5
for beta_vec in [(0.0, 0.0, 0.0), (1e-4, -2e-4, 1.5e-4), (0.3, 0.0, 0.0), (0.3, 0.4, 0.0)]:
    p0 = [l1, l2, 0.2, -0.3, 0.4, beta_vec[0], beta_vec[1], beta_vec[2]]
    # Rotate beta into E's rest-frame axes if R != I? Let's test at R = I first so axes align cleanly!
    p0 = [l1, l2, 0.0, 0.0, 0.0, beta_vec[0], beta_vec[1], beta_vec[2]]
    eps = 1e-7
    J = []
    for k in range(8):
        pp, pm = p0[:], p0[:]
        pp[k] += eps; pm[k] -= eps
        yp, ym = speedometer_10vec(pp), speedometer_10vec(pm)
        J.append([(yp[i]-ym[i])/(2*eps) for i in range(10)])
    F = [[sum(J[a][i]*J[b][i] for i in range(10)) for b in range(8)] for a in range(8)]
    Cov = inv_real_sym(F)
    sigs = [math.sqrt(Cov[5+a][5+a]) for a in range(3)]
    l3 = -l1 - l2
    ana0 = [1.0/(math.sqrt(2)*abs(l2-l3)), 1.0/(math.sqrt(2)*abs(l3-l1)), 1.0/(math.sqrt(2)*abs(l1-l2))]
    print(f"beta={beta_vec}: sig_beta = {[round(x, 8) for x in sigs]} | slow-limit 1/(sqrt(2)|dl|) = {[round(x, 8) for x in ana0]}")
