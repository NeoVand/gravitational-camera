import math, cmath, random

eps3 = [[[0]*3 for _ in range(3)] for __ in range(3)]
for i in range(3):
    for j in range(3):
        for k in range(3):
            if (i,j,k) in [(0,1,2),(1,2,0),(2,0,1)]:
                eps3[i][j][k] = 1
            elif (i,j,k) in [(0,2,1),(2,1,0),(1,0,2)]:
                eps3[i][j][k] = -1

# 1. Check Penrose 4-PND aberration midpoint sign under W = E + i B!
# Static mass M at n_hat = (1, 0, 0) (r=1, GM=1), moving with velocity v = (0, vy, 0) (so vy is transverse!).
# Or boost static E0 = diag(-2, 1, 1) by mass velocity v_mass = (0, vy, 0):
# Remember earlier: when PIXEL moves at +v_pix, mass moves at v_mass = -v_pix, and B_{31} = (l1 - l3) v_pix_y = -3 v_pix_y = +3 v_mass_y!
# Check Eq. (34): n = (1,0,0), v_mass = (0, vy, 0) => n x v_mass = (0, 0, vy) => B_{13} = B_{31} = +3 vy!
# So for mass moving at v_mass = (0, beta, 0) (rapidity eta = atanh(beta)), G_mass = exp(+i eta K_2) where (K_2)_{ij} = -eps_{2ij}!
# Check small eta: W = G E0 G^T ~ E0 + i eta (K_2 E0 - E0 K_2). (K_2)_{31} = -eps_{231} = -1 => (K_2 E0 - E0 K_2)_{31} = (-1)(-2) - (1)(-1) = +3!
# YES! W_mass = exp(+i eta (u_mass . K)) * E0 * exp(+i eta (u_mass . K))^T!
def exp_antisym(ax, ay, az):
    th2 = ax*ax + ay*ay + az*az
    th = cmath.sqrt(th2)
    c1 = 1.0 - th2/6.0 if abs(th) < 1e-8 else cmath.sin(th)/th
    c2 = 0.5 - th2/24.0 if abs(th) < 1e-8 else (1.0 - cmath.cos(th))/th2
    a = [ax, ay, az]
    M = [[-sum(eps3[i][j][k]*a[k] for k in range(3)) for j in range(3)] for i in range(3)]
    M2 = [[sum(M[i][k]*M[k][j] for k in range(3)) for j in range(3)] for i in range(3)]
    return [[(1.0 if i==j else 0.0) + c1*M[i][j] + c2*M2[i][j] for j in range(3)] for i in range(3)]

# Stereographic null vector m(zeta): for direction p_hat(zeta) = ((zeta + zeta*)/(1+|z|^2), -i(zeta - zeta*)/(1+|z|^2), (|z|^2 - 1)/(1+|z|^2))?
# Wait: check k_hat(zeta) = i (m(zeta) x m*(zeta)) / |m(zeta)|^2 for m(zeta) = (1 - zeta^2, i(1 + zeta^2), -2 zeta)!
def zeta_to_khat(z):
    m = [1 - z*z, 1j*(1 + z*z), -2*z]
    n2 = sum(abs(x)**2 for x in m)
    c = [
        m[1]*m[2].conjugate() - m[2]*m[1].conjugate(),
        m[2]*m[0].conjugate() - m[0]*m[2].conjugate(),
        m[0]*m[1].conjugate() - m[1]*m[0].conjugate(),
    ]
    return [(1j*x/n2).real for x in c]

def durand_kerner_quartic(coeffs):
    # coeffs = [c4, c3, c2, c1, c0] for c4 z^4 + c3 z^3 + c2 z^2 + c1 z + c0 = 0
    c4, c3, c2, c1, c0 = coeffs
    roots = [0.4+0.9j, -0.7+0.3j, -0.5-0.8j, 0.8-0.5j]
    for _ in range(80):
        for i in range(4):
            z = roots[i]
            val = (((c4*z + c3)*z + c2)*z + c1)*z + c0
            den = c4
            for j in range(4):
                if j != i:
                    den *= (z - roots[j])
            roots[i] -= val / den
    return roots

def pnds_of_W(W):
    # Expand m(z)^T W m(z) for m(z) = (1 - z^2, i + i z^2, -2 z) in powers of z^0..z^4!
    # Sample at 5 roots of unity / points or expand directly:
    # Let v0 = [1, 1j, 0], v1 = [0, 0, -2], v2 = [-1, 1j, 0] -> m(z) = v0 + v1 z + v2 z^2!
    v = [[1+0j, 1j, 0j], [0j, 0j, -2+0j], [-1+0j, 1j, 0j]]
    def qf(a, b):
        return sum(a[i]*W[i][j]*b[j] for i in range(3) for j in range(3))
    c0 = qf(v[0], v[0])
    c1 = 2*qf(v[0], v[1])
    c2 = 2*qf(v[0], v[2]) + qf(v[1], v[1])
    c3 = 2*qf(v[1], v[2])
    c4 = qf(v[2], v[2])
    roots = durand_kerner_quartic([c4, c3, c2, c1, c0])
    return [zeta_to_khat(z) for z in roots]

print("=== 1. PENROSE 4-PND EXACT RELATIVISTIC ABERRATION MIDPOINT TEST (UNDER W = E + i B) ===")
E0 = [[-2.0, 0, 0], [0, 1.0, 0], [0, 0, 1.0]] # mass along +x
for beta_y in [0.0, 0.3, 0.6, 0.9]:
    eta = math.atanh(beta_y)
    G = exp_antisym(0.0, 1j*eta, 0.0)
    tmp = [[sum(G[i][k]*E0[k][j] for k in range(3)) for j in range(3)] for i in range(3)]
    W = [[sum(tmp[i][k]*G[j][k] for k in range(3)) for j in range(3)] for i in range(3)]
    pnds = pnds_of_W(W)
    avg = [sum(p[a] for p in pnds)/4.0 for a in range(3)]
    print(f"Mass velocity v = (0, {beta_y:.1f} c, 0): mean of 4 PNDs = {[round(x, 7) for x in avg]}")
# Also check a pure plane wave along +z (W = m m^T): all 4 PNDs should fuse at -z or +z? Let's check!
m_z = [1/math.sqrt(2), 1j/math.sqrt(2), 0]
W_wave = [[m_z[i]*m_z[j] + 1e-12*(1 if i==j==2 else (-0.5 if i==j else 0)) for j in range(3)] for i in range(3)]
print("Pure wave travelling along +z (k_hat = (0,0,+1)): PNDs =", [[round(x,4) for x in p] for p in pnds_of_W(W_wave)])

# 2. Check Vaidya / Supernova spherical null shell E_{ij} and B_{[ij]} signs!
# Energy-momentum tensor of null radiation of energy flux F travelling along unit propagation vector k_hat (from star to pixel!):
# Four-vector l^mu = (1, k_hat), l_mu = (-1, k_hat):
# T_{mu nu} = (F / c) l_mu l_nu!
# Check T_{00} = F/c = u (energy density), T_{0i} = -(F/c) k_hat_i (compare dust T_{0i} = -rho c v_i -> rho v_i = (F/c^2) k_hat_i!).
# Check trace T = eta^{mu nu} T_{mu nu} = 0 (null radiation!).
# Einstein equation: R_{mu nu} = (8 pi G / c^4) T_{mu nu}!
# At pixel inside shell:
# 1) tr(E) = c^2 R_{0i0i} = c^2 R_{00} = c^2 * (8 pi G / c^4) * (F / c) = +(8 pi G F) / c^3 !!
#    And by spherical symmetry around star (with radial unit k_hat), Weyl tensor = 0 outside/inside? Wait:
#    Inside Vaidya metric ds^2 = -(1 - 2 G M(u) / (c^2 r)) c^2 du^2 - 2 c du dr + r^2 dOmega^2 (with u = t - r/c, dM/du = -L/c^2 < 0 since star loses mass L = 4 pi r^2 F!):
#    Weyl part is Coulomb Type D of M(u)/r^3 (falling as 1/r^3), while Ricci part falls as 1/r^2!
#    Wait: decompose R_{0i0j} into Weyl C_{0i0j} + Ricci part:
#    In 4D, R_{0i0j} = C_{0i0j} + 1/2 (eta_{00} R_{ij} + eta_{ij} R_{00} - eta_{0j} R_{i0} - eta_{i0} R_{0j}) - (R/6)(eta_{00} eta_{ij} - ...)
#                    = C_{0i0j} + 1/2 (-R_{ij} + delta_{ij} R_{00})  (since R = 0 for null dust!).
#    With R_{00} = (8 pi G F / c^5) and R_{ij} = (8 pi G F / c^5) k_i k_j:
#    E_{ij}^{Ricci} = c^2 * 1/2 * (8 pi G F / c^5) (delta_{ij} - k_i k_j) = (4 pi G F / c^3) (delta_{ij} - k_i k_j) = (G L / (c^3 r^2)) (delta_{ij} - k_i k_j)!!
#    EXACT MATCH WITH PAPER p. 20 ("E_{ij} = (G L / c^3 r^2)(delta_{ij} - n_i n_j)")!!
# 2) What about B_{ij}^{Ricci} = 1/2 c^2 eps_{ipq} R_{pqj0}^{Ricci}?!
#    In 4D with R = 0: R_{pqj0}^{Ricci} = 1/2 (eta_{pj} R_{q0} - eta_{qj} R_{p0})!
#    Contract with 1/2 c^2 eps_{ipq}:
#    B_{ij}^{Ricci} = 1/4 c^2 eps_{ipq} (delta_{pj} R_{q0} - delta_{qj} R_{p0}) = 1/2 c^2 eps_{ijq} R_{q0}!
#    With R_{q0} = (8 pi G / c^4) T_{q0} = -(8 pi G F / c^5) k_q:
#    B_{ij}^{Ricci} = -(4 pi G F / c^3) eps_{ijk} k_k = -(G L / (c^3 r^2)) eps_{ijk} k_k!!
#    DOUBLE-CHECK AGAINST BRIEF LINE 12 ("the antisymmetric part of B is -(4 pi G / c) eps rho v"):
#    Substitute rho v_k = (F / c^2) k_k -> -(4 pi G / c) eps_{ijk} (F / c^2) k_k = -(4 pi G F / c^3) eps_{ijk} k_k!!
print("\n=== 2. VAIDYA / SUPERNOVA NULL SHELL SIGN CHECK: EXACT! ===")
print("E_{ij}^{Ricci} = +(4 pi G F / c^3)(delta_{ij} - k_i k_j), B_{ij}^{Ricci} = -(4 pi G F / c^3) eps_{ijk} k_k")
print("=> Propagation vector k_k = - eps_{ijk} B_{ij} / tr(E), Source direction n_star = -k = + eps_{ijk} B_{ij} / tr(E)!")

# 3. Check 2-pixel 2-body near-field Jacobian rank (14 moving params: M1, x1(3), v1(3), M2, x2(3), v2(3) -> 20 numbers)!
print("\n=== 3. TWO-PIXEL TWO-BODY NEAR-FIELD INVERSION JACOBIAN RANK (14 PARAMS -> 20 NUMBERS) ===")
from q2_spectral_v2 import mat_to_stf5, qr_col_pivoting_rank
def two_px_two_body(p):
    # p = [M1, x1,y1,z1, vx1,vy1,vz1, M2, x2,y2,z2, vx2,vy2,vz2]
    px_pos = [[-0.5, 0.0, 0.0], [+0.5, 0.0, 0.0]]
    out = []
    for xp in px_pos:
        E = [[0.0]*3 for _ in range(3)]
        B = [[0.0]*3 for _ in range(3)]
        for body in range(2):
            M = p[7*body]
            xs = p[7*body+1 : 7*body+4]
            vs = p[7*body+4 : 7*body+7]
            dx = [xs[a] - xp[a] for a in range(3)] # from pixel to mass!
            r = math.sqrt(sum(z*z for z in dx))
            nh = [z/r for z in dx]
            nxv = [nh[1]*vs[2]-nh[2]*vs[1], nh[2]*vs[0]-nh[0]*vs[2], nh[0]*vs[1]-nh[1]*vs[0]]
            for i in range(3):
                for j in range(3):
                    E[i][j] += (M / (r**3)) * ((1.0 if i==j else 0.0) - 3.0*nh[i]*nh[j])
                    B[i][j] += (3.0*M / (r**3)) * (nh[i]*nxv[j] + nh[j]*nxv[i])
        out.extend(mat_to_stf5(E) + mat_to_stf5(B))
    return out

p_2b = [1.2, 0.8, 1.5, 2.3, 0.1, -0.2, 0.05,  0.7, -1.1, 0.6, 1.9, -0.15, 0.25, -0.1]
cols = []
for idx in range(14):
    pp, pm = p_2b[:], p_2b[:]
    pp[idx] += 1e-7; pm[idx] -= 1e-7
    fp, fm = two_px_two_body(pp), two_px_two_body(pm)
    cols.append([(fp[r]-fm[r])/2e-7 for r in range(20)])
J2b = [[cols[c][r] for c in range(14)] for r in range(20)]
rk_2b, dr_2b = qr_col_pivoting_rank(J2b)
# Also static part only: 8 params -> 10 electric numbers:
J_stat = [[cols[c][r] for c in [0,1,2,3, 7,8,9,10]] for r in [0,1,2,3,4, 10,11,12,13,14]]
rk_st, dr_st = qr_col_pivoting_rank(J_stat)
print(f"Static 2-body (8 params -> 10 E numbers): rank = {rk_st}, min_R/max_R = {dr_st[-1]/dr_st[0]:.3e}")
print(f"Moving 2-body (14 params -> 20 E,B numbers): rank = {rk_2b}, min_R/max_R = {dr_2b[-1]/dr_2b[0]:.3e}")

# 4. Check Poloidal vs Toroidal internal mass flow outside a ball of radius R = 1 by numerical 3D quadrature!
print("\n=== 4. TOROIDAL vs POLOIDAL INTERNAL MASS FLOW CANCELLATION CHECK ===")
# Take Psi_pol(r) = (1 - r^2)^2 * x (vanishes with radial derivative at r = 1)!
# J_pol = curl(curl(x_vec * Psi)) = grad(div(x_vec Psi)) - Lap(x_vec Psi).
#Wait: div J_pol == 0 identically! Inside r < 1, integrate J_pol(x') / |x_obs - x'| d^3x' at external point x_obs = (1.5, 0.7, -1.2)!
# Let's compute curl of A(x_obs) or h_{0i}(x_obs) = int J_pol(x') / |x_obs - x'| d^3x' by midpoint/Gauss grid or finite diff curl!
N_g = 24
step = 2.0 / N_g
def eval_Psi(x, y, z):
    r2 = x*x + y*y + z*z
    if r2 >= 1.0: return 0.0
    return ((1.0 - r2)**3) * (0.7*x - 0.4*y + 0.5*z*x) # smooth C^2 compactly supported inside r < 1!

def curl_vec(f, x, y, z, h=1e-4):
    # curl of vector field f(x,y,z)
    dfy_dz = (f(x,y,z+h)[1] - f(x,y,z-h)[1])/(2*h)
    dfz_dy = (f(x,y+h,z)[2] - f(x,y-h,z)[2])/(2*h)
    dfz_dx = (f(x+h,y,z)[2] - f(x-h,y,z)[2])/(2*h)
    dfx_dz = (f(x,y,z+h)[0] - f(x,y,z-h)[0])/(2*h)
    dfx_dy = (f(x,y+h,z)[0] - f(x,y-h,z)[0])/(2*h)
    dfy_dx = (f(x+h,y,z)[1] - f(x-h,y,z)[1])/(2*h)
    return [dfz_dy - dfy_dz, dfx_dz - dfz_dx, dfy_dx - dfx_dy]

def rPsi(x, y, z):
    p = eval_Psi(x, y, z)
    return [x*p, y*p, z*p]

def J_tor(x, y, z):
    return curl_vec(rPsi, x, y, z, 1e-4)

def J_pol(x, y, z):
    return curl_vec(lambda a,b,c: J_tor(a,b,c), x, y, z, 2e-4)

x_obs = [1.8, -0.9, 1.3]
A_tor = [0.0, 0.0, 0.0]
A_pol = [0.0, 0.0, 0.0]
for ix in range(N_g):
    x = -1.0 + (ix + 0.5)*step
    for iy in range(N_g):
        y = -1.0 + (iy + 0.5)*step
        for iz in range(N_g):
            z = -1.0 + (iz + 0.5)*step
            if x*x + y*y + z*z < 1.0:
                jt = J_tor(x, y, z)
                jp = J_pol(x, y, z)
                dist = math.sqrt((x_obs[0]-x)**2 + (x_obs[1]-y)**2 + (x_obs[2]-z)**2)
                for a in range(3):
                    A_tor[a] += jt[a] / dist * (step**3)
                    A_pol[a] += jp[a] / dist * (step**3)
print(f"External gravitomagnetic potential |h_0i| from Toroidal flow: {math.sqrt(sum(v*v for v in A_tor)):.6e}")
print(f"External gravitomagnetic potential |h_0i| from Poloidal flow: {math.sqrt(sum(v*v for v in A_pol)):.6e} (grid zero!)")
