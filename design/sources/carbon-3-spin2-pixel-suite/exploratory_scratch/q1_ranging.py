import math, cmath, random

eps3 = [[[0]*3 for _ in range(3)] for __ in range(3)]
for i in range(3):
    for j in range(3):
        for k in range(3):
            if (i,j,k) in [(0,1,2),(1,2,0),(2,0,1)]:
                eps3[i][j][k] = 1
            elif (i,j,k) in [(0,2,1),(2,1,0),(1,0,2)]:
                eps3[i][j][k] = -1

def check_wave_conventions():
    e_plus = [[1,0,0],[0,-1,0],[0,0,0]]
    d00_h = [[-e_plus[i][j] for j in range(3)] for i in range(3)]
    def dp_d0_h(p, q, j):
        return e_plus[q][j] if p == 2 else 0.0

    E = [[0.0]*3 for _ in range(3)]
    B = [[0.0]*3 for _ in range(3)]
    for i in range(3):
        for j in range(3):
            R_0i0j = -0.5 * d00_h[i][j]
            E[i][j] = R_0i0j
            s = 0.0
            for p in range(3):
                for q in range(3):
                    if eps3[i][p][q] != 0:
                        R_pqj0 = 0.5 * (dp_d0_h(p, q, j) - dp_d0_h(q, p, j))
                        s += 0.5 * eps3[i][p][q] * R_pqj0
            B[i][j] = s
    normE2 = sum(E[a][b]**2 for a in range(3) for b in range(3))
    n_eq31 = [0.0]*3
    for i in range(3):
        for j in range(3):
            for k in range(3):
                if eps3[i][j][k] != 0:
                    for l in range(3):
                        n_eq31[i] += -eps3[i][j][k] * E[j][l] * B[k][l] / normE2
    print("Eq. (31) n_hat (points to source = (0,0,-1)):", n_eq31)

    m = [1/math.sqrt(2), 1j/math.sqrt(2), 0]
    W_brief = [[0.5*m[i]*m[j] for j in range(3)] for i in range(3)]
    W_actual = [[E[i][j] + 1j*B[i][j] for j in range(3)] for i in range(3)]
    print("Max diff W_actual vs 0.5 m m^T:", max(abs(W_actual[i][j] - W_brief[i][j]) for i in range(3) for j in range(3)))

    n = [0.6, 0.8, 0.0]
    v = [0.1, -0.2, 0.3]
    def d2_invr(q, j):
        return (3*n[q]*n[j] - (1.0 if q==j else 0.0))
    B_mov = [[0.0]*3 for _ in range(3)]
    for i in range(3):
        for j in range(3):
            s = 0.0
            for p in range(3):
                for q in range(3):
                    if eps3[i][p][q] != 0:
                        R_pqj0 = 0.5 * ((-4*v[p])*d2_invr(q,j) - (-4*v[q])*d2_invr(p,j))
                        s += 0.5 * eps3[i][p][q] * R_pqj0
            B_mov[i][j] = s
    nxv = [n[1]*v[2]-n[2]*v[1], n[2]*v[0]-n[0]*v[2], n[0]*v[1]-n[1]*v[0]]
    B_eq34 = [[3*(n[i]*nxv[j] + n[j]*nxv[i]) for j in range(3)] for i in range(3)]
    print("Max diff with Eq. (34):", max(abs(B_mov[i][j] - B_eq34[i][j]) for i in range(3) for j in range(3)))

check_wave_conventions()

# 2. Exact analytic/automatic-differentiation evaluation of Eq. (41) oscillating quadrupole field!
# Set G = c = 1, wave angular frequency omega = k = 1 (or keep general derivatives Q^{(n)} of Q_{ij}(u)!).
# Look at Eq. (41), oscillating part only (M = 0, J = 0):
# Let source be at origin, observer at x = r k_hat (so k_hat = x / r is unit propagation vector from source to pixel).
# u = t - r.
# Eq. (41):
# h_bar^{00} = 2 d_i d_j (I_{ij}(u) / r)
# h_bar^{0i} = 2 [ I^{(1)}_{ij}(u) k_j / r^2 + I^{(2)}_{ij}(u) k_j / r ] = -2 d_j (I^{(1)}_{ij}(u) / r) !!
# WAIT A SECOND! Check that!
# d_j (f(u) / r) = -k_j f'(u) / r - k_j f(u) / r^2 = -k_j (f'(u)/r + f(u)/r^2)!
# YES!! Look how simple Eq. (41) is in Cartesian derivatives of (I_{ab}(u) / r)!!
# Let's check harmonic gauge d_0 h_bar^{00} + d_i h_bar^{0i} = 0 and d_0 h_bar^{0i} + d_j h_bar^{ij} = 0:
# h_bar^{ij} = 2 I^{(2)}_{ij}(u) / r
# => d_0 h_bar^{ij} = 2 I^{(3)}_{ij}(u) / r
# Wait: d_j h_bar^{ij}: since h_bar^{ij} = 2 I^{(2)}_{ij}(u)/r, d_j h_bar^{ij} = -2 k_j (I^{(3)}_{ij}/r + I^{(2)}_{ij}/r^2) != -d_0 h_bar^{0i}?
# WAIT: d_0 h_bar^{0i} = 2 (I^{(2)}_{ij} k_j / r^2 + I^{(3)}_{ij} k_j / r) = -d_j h_bar^{ij}!!
# IT CANCELS IDENTICALLY!! Because h_bar^{0i} = -2 d_j (I^{(1)}_{ij}(u)/r), and h_bar^{00} = +2 d_i d_j (I_{ij}(u)/r)!
# Let's check d_0 h_bar^{00} + d_i h_bar^{0i}:
# d_0 h_bar^{00} = +2 d_i d_j (I^{(1)}_{ij}(u)/r), d_i h_bar^{0i} = -2 d_i d_j (I^{(1)}_{ij}(u)/r) -> SUM IS ZERO IDENTICALLY!!
# OMG!! Look at that gauge-superpotential structure of Eq. (41):
# Define F_{ab}(x, t) = 2 I_{ab}(t - r) / r  (setting G = c = 1):
#   h_bar^{00} = d_a d_b F_{ab}
#   h_bar^{0i} = - d_b d_0 F_{ib}
#   h_bar^{ij} = d_0^2 F_{ij} !!
# WAIT A SECOND!! Let's check if substituting h_{mu nu} = h_bar_{mu nu} - 1/2 eta_{mu nu} h_bar into R_{mu nu rho sigma}
# simplifies MASSIVELY because d_a d_b F_{ab} and -d_b d_0 F_{ib} look almost pure gauge!!
# Let's check! Lowering indices with eta = diag(-1, 1, 1, 1):
#   h_bar_{00} = h_bar^{00} = d_a d_b F_{ab}
#   h_bar_{0i} = -h_bar^{0i} = + d_b d_0 F_{ib}
#   h_bar_{ij} = h_bar^{ij} = d_0^2 F_{ij}
# Trace: h_bar = -h_bar_{00} + h_bar_{kk} = -d_a d_b F_{ab} + d_0^2 F_{kk}.
# Metric perturbation h_{mu nu} = h_bar_{mu nu} - 1/2 eta_{mu nu} h_bar:
#   h_{00} = 1/2 (d_a d_b F_{ab} + d_0^2 F_{kk})
#   h_{0i} = d_b d_0 F_{ib}
#   h_{ij} = d_0^2 F_{ij} + 1/2 delta_{ij} (d_a d_b F_{ab} - d_0^2 F_{kk}).
# NOW COMPUTE R_{0i0j} = 1/2 (d_i d_0 h_{0j} + d_j d_0 h_{0i} - d_0^2 h_{ij} - d_i d_j h_{00})!!
# Let's write out EVERY term of 2 R_{0i0j}:
#   + d_i d_b d_0^2 F_{jb}
#   + d_j d_b d_0^2 F_{ib}
#   - d_0^4 F_{ij} - 1/2 delta_{ij} (d_a d_b d_0^2 F_{ab} - d_0^4 F_{kk})
#   - 1/2 (d_i d_j d_a d_b F_{ab} + d_i d_j d_0^2 F_{kk}) !!
# AND since outside the source (r > 0), F_{ab}(t - r)/r satisfies the EXACT WAVE EQUATION (d_0^2 - Lap) F_{ab} = 0, i.e. d_0^2 F_{ab} = Lap F_{ab}!!
# AND WHAT ABOUT R_{pqj0} = 1/2 (d_q d_j h_{p0} + d_p d_0 h_{qj} - d_p d_j h_{q0} - d_q d_0 h_{pj})?!
# Look! Look how clean 2 R_{pqj0} is:
#   + d_q d_j d_b d_0 F_{pb}
#   + d_p d_0^3 F_{qj} + 1/2 delta_{qj} d_p d_0 (d_a d_b F_{ab} - d_0^2 F_{kk})
#   - d_p d_j d_b d_0 F_{qb}
#   - d_q d_0^3 F_{pj} - 1/2 delta_{pj} d_q d_0 (d_a d_b F_{ab} - d_0^2 F_{kk}) !!

# Let's write an exact radial-derivative evaluator for ANY derivative d_{i1} d_{i2} ... d_{im} (f(t - r) / r)!!
# Notice: if g(r) = f(t - r) / r, any spatial derivative is built from r and x_i = r k_i!
# Even simpler: use exact truncated Taylor polynomials in (dx, dy, dz) of order 4 around x0 = (0, 0, r)!!
# Wait: order 4 in (dx, dy, dz) has only C(3+4, 4) = 35 monomials! Exact polynomial multiplication in 35 monomials has ZERO truncation error, ZERO finite-difference error, machine precision 1e-16!

mons = []
for a in range(5):
    for b in range(5 - a):
        for c in range(5 - a - b):
            mons.append((a, b, c))
mon_idx = {m: idx for idx, m in enumerate(mons)}
N_MON = len(mons) # 35

def poly_zero():
    return [0.0]*N_MON

def poly_const(c):
    p = [0.0]*N_MON
    p[mon_idx[(0,0,0)]] = c
    return p

def poly_mul(p1, p2):
    res = [0.0]*N_MON
    for i1, (a1,b1,c1) in enumerate(mons):
        v1 = p1[i1]
        if v1 == 0.0: continue
        for i2, (a2,b2,c2) in enumerate(mons):
            if a1+a2 <= 4 and b1+b2 <= 4 and c1+c2 <= 4 and a1+a2+b1+b2+c1+c2 <= 4:
                v2 = p2[i2]
                if v2 != 0.0:
                    res[mon_idx[(a1+a2, b1+b2, c1+c2)]] += v1 * v2
    return res

def poly_add(p1, p2, s=1.0):
    return [p1[i] + s*p2[i] for i in range(N_MON)]

def poly_deriv(p, axis):
    # derivative wrt x (0), y (1), z (2):
    # note: if p[a,b,c] is coeff of dx^a dy^b dz^c, then d/dx multiplies by a and shifts a -> a-1!
    res = [0.0]*N_MON
    for idx, (a,b,c) in enumerate(mons):
        val = p[idx]
        if val == 0.0: continue
        if axis == 0 and a > 0:
            res[mon_idx[(a-1, b, c)]] += a * val
        elif axis == 1 and b > 0:
            res[mon_idx[(a, b-1, c)]] += b * val
        elif axis == 2 and c > 0:
            res[mon_idx[(a, b, c-1)]] += c * val
    return res

def eval_W_exact(x0, Q_derivs):
    """
    x0: [x, y, z] observer position, r = |x0|.
    Q_derivs: list [Q^{(0)}, Q^{(1)}, ..., Q^{(6)}] at retarded time u = t - r, each a 3x3 matrix.
    Returns exact E (3x3), B (3x3), W = E + i B (3x3) at x0 (with G = c = 1).
    """
    r0 = math.sqrt(x0[0]**2 + x0[1]**2 + x0[2]**2)
    # Build polynomial for s = r^2 - r0^2 = 2 (x0.dx) + dx^2 + dy^2 + dz^2
    s_poly = poly_zero()
    s_poly[mon_idx[(1,0,0)]] = 2*x0[0]
    s_poly[mon_idx[(0,1,0)]] = 2*x0[1]
    s_poly[mon_idx[(0,0,1)]] = 2*x0[2]
    s_poly[mon_idx[(2,0,0)]] = 1.0
    s_poly[mon_idx[(0,2,0)]] = 1.0
    s_poly[mon_idx[(0,0,2)]] = 1.0

    # r = r0 * (1 + s / r0^2)^{1/2} -> dr = r - r0 as degree-4 polynomial
    u_poly = [v / (r0**2) for v in s_poly]
    u2 = poly_mul(u_poly, u_poly)
    u3 = poly_mul(u2, u_poly)
    u4 = poly_mul(u3, u_poly)
    # (1 + u)^{1/2} - 1 = 1/2 u - 1/8 u^2 + 1/16 u^3 - 5/128 u^4
    dr_poly = [r0 * (0.5*u_poly[i] - 0.125*u2[i] + 0.0625*u3[i] - (5.0/128.0)*u4[i]) for i in range(N_MON)]
    # 1/r = (1/r0) (1 + u)^{-1/2} = (1/r0) (1 - 1/2 u + 3/8 u^2 - 5/16 u^3 + 35/128 u^4)
    invr_poly = [(1.0/r0)*( (1.0 if i==mon_idx[(0,0,0)] else 0.0) - 0.5*u_poly[i] + 0.375*u2[i] - 0.3125*u3[i] + (35.0/128.0)*u4[i]) for i in range(N_MON)]

    dr2 = poly_mul(dr_poly, dr_poly)
    dr3 = poly_mul(dr2, dr_poly)
    dr4 = poly_mul(dr3, dr_poly)

    # For time-derivative order n = 0, 1, 2, 3, 4, build F^{(n)}_{ab}(x) = 2 * Q^{(n)}_{ab}(u0 - dr) / r
    # Q^{(n)}(u0 - dr) = Q^{(n)} - Q^{(n+1)} dr + 1/2 Q^{(n+2)} dr^2 - 1/6 Q^{(n+3)} dr^3 + 1/24 Q^{(n+4)} dr^4
    F = {}
    for n in range(5): # need n = 0, 1, 2, 3, 4
        F[n] = [[None]*3 for _ in range(3)]
        for a in range(3):
            for b in range(3):
                q_poly = poly_const(Q_derivs[n][a][b])
                if n+1 < len(Q_derivs):
                    q_poly = poly_add(q_poly, dr_poly, -Q_derivs[n+1][a][b])
                if n+2 < len(Q_derivs):
                    q_poly = poly_add(q_poly, dr2, 0.5*Q_derivs[n+2][a][b])
                if n+3 < len(Q_derivs):
                    q_poly = poly_add(q_poly, dr3, -(1.0/6.0)*Q_derivs[n+3][a][b])
                if n+4 < len(Q_derivs):
                    q_poly = poly_add(q_poly, dr4, (1.0/24.0)*Q_derivs[n+4][a][b])
                F[n][a][b] = [2.0 * v for v in poly_mul(q_poly, invr_poly)]

    # Build h_{00}^{(n)} for n=0, h_{0i}^{(n)} for n=0,1, h_{ij}^{(n)} for n=0,1,2
    # Recall:
    # S^{(n)} = d_a d_b F^{(n)}_{ab}
    # T^{(n)} = tr F^{(n)}
    S = {}
    T = {}
    for n in [0, 1, 2]:
        sp = poly_zero()
        tp = poly_zero()
        for a in range(3):
            tp = poly_add(tp, F[n][a][a], 1.0)
            for b in range(3):
                sp = poly_add(sp, poly_deriv(poly_deriv(F[n][a][b], b), a), 1.0)
        S[n] = sp
        T[n] = tp

    # h_{00} at t0: 1/2 (S[0] + T[2])
    h00 = [0.5*(S[0][m] + T[2][m]) for m in range(N_MON)]
    # h_{0i} at t0 (m_t=0) and d_0 h_{0i} (m_t=1):
    # h_{0i}^{(n)} = d_b F^{(n+1)}_{ib}
    h0i_0 = [poly_zero() for _ in range(3)]
    h0i_1 = [poly_zero() for _ in range(3)]
    for i in range(3):
        for b in range(3):
            h0i_0[i] = poly_add(h0i_0[i], poly_deriv(F[1][i][b], b), 1.0)
            h0i_1[i] = poly_add(h0i_1[i], poly_deriv(F[2][i][b], b), 1.0)

    # h_{ij}: need d_0 h_{ij} (n=1) and d_0^2 h_{ij} (n=2):
    # h_{ij}^{(n)} = F^{(n+2)}_{ij} + 1/2 delta_{ij} (S[n] - T[n+2])
    hij_1 = [[None]*3 for _ in range(3)]
    hij_2 = [[None]*3 for _ in range(3)]
    T3 = poly_zero()
    T4 = poly_zero()
    for a in range(3):
        T3 = poly_add(T3, F[3][a][a], 1.0)
        T4 = poly_add(T4, F[4][a][a], 1.0)
    for i in range(3):
        for j in range(3):
            p1 = F[3][i][j][:]
            p2 = F[4][i][j][:]
            if i == j:
                p1 = [p1[m] + 0.5*(S[1][m] - T3[m]) for m in range(N_MON)]
                p2 = [p2[m] + 0.5*(S[2][m] - T4[m]) for m in range(N_MON)]
            hij_1[i][j] = p1
            hij_2[i][j] = p2

    c0 = mon_idx[(0,0,0)]
    E = [[0.0]*3 for _ in range(3)]
    B = [[0.0]*3 for _ in range(3)]
    for i in range(3):
        for j in range(3):
            # R_{0i0j} = 1/2 (d_i h_{0j}^{(1)} + d_j h_{0i}^{(1)} - h_{ij}^{(2)} - d_i d_j h_{00})
            val = 0.5 * (
                poly_deriv(h0i_1[j], i)[c0]
                + poly_deriv(h0i_1[i], j)[c0]
                - hij_2[i][j][c0]
                - poly_deriv(poly_deriv(h00, j), i)[c0]
            )
            E[i][j] = val

    for i in range(3):
        for j in range(3):
            s_val = 0.0
            for p in range(3):
                for q in range(3):
                    if eps3[i][p][q] != 0:
                        # R_{pqj0} = 1/2 (d_q d_j h_{p0} + d_p h_{qj}^{(1)} - d_p d_j h_{q0} - d_q h_{pj}^{(1)})
                        rpqj0 = 0.5 * (
                            poly_deriv(poly_deriv(h0i_0[p], j), q)[c0]
                            + poly_deriv(hij_1[q][j], p)[c0]
                            - poly_deriv(poly_deriv(h0i_0[q], j), p)[c0]
                            - poly_deriv(hij_1[p][j], q)[c0]
                        )
                        s_val += 0.5 * eps3[i][p][q] * rpqj0
            B[i][j] = s_val

    W = [[E[i][j] + 1j*B[i][j] for j in range(3)] for i in range(3)]
    return E, B, W

# Quick sanity check on E, B, W:
# 1) Trace-free and symmetric in vacuum!
# 2) Near field r -> 0 matches Newtonian quadrupole tide!
# 3) Far field r -> inf matches TT radiation wave!
def rot_quad_derivs(theta, omega=1.0):
    # Two equal masses m at distance d/2 from origin in xy-plane turning anticlockwise at Omega = omega/2:
    # r_1(u) = (d/2)(cos(Omega u), sin(Omega u), 0), r_2 = -r_1.
    # Let's normalize ΔI = m d^2 / 2 = 1:
    # I_{xx} = (m d^2 / 2) cos^2(Omega u) = 1/2 + 1/2 cos(omega u), I_{yy} = 1/2 - 1/2 cos(omega u), I_{xy} = 1/2 sin(omega u).
    # Oscillating STF part (with omega = 1, theta = omega u):
    # Q_{xx} = cos(theta), Q_{yy} = -cos(theta), Q_{xy} = sin(theta) (setting amplitude = 1).
    derivs = []
    for n in range(9):
        c = math.cos(theta + n*math.pi/2) * (omega**n)
        s = math.sin(theta + n*math.pi/2) * (omega**n)
        derivs.append([[c, s, 0.0], [s, -c, 0.0], [0.0, 0.0, 0.0]])
    return derivs

E_test, B_test, W_test = eval_W_exact([3.0, 4.0, 5.0], rot_quad_derivs(0.7))
print("tr(E) =", sum(E_test[i][i] for i in range(3)), "tr(B) =", sum(B_test[i][i] for i in range(3)))
print("asym(E) =", max(abs(E_test[i][j]-E_test[j][i]) for i in range(3) for j in range(3)))
print("asym(B) =", max(abs(B_test[i][j]-B_test[j][i]) for i in range(3) for j in range(3)))
