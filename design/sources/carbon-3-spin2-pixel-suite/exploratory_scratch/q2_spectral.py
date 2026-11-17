import math, cmath, random

# Orthonormal basis of 5 real symmetric trace-free 3x3 matrices:
T_BASIS = [
    [[1/math.sqrt(2), 0, 0], [0, -1/math.sqrt(2), 0], [0, 0, 0]],
    [[0, 1/math.sqrt(2), 0], [1/math.sqrt(2), 0, 0], [0, 0, 0]],
    [[0, 0, 1/math.sqrt(2)], [0, 0, 0], [1/math.sqrt(2), 0, 0]],
    [[0, 0, 0], [0, 0, 1/math.sqrt(2)], [0, 1/math.sqrt(2), 0]],
    [[-1/math.sqrt(6), 0, 0], [0, -1/math.sqrt(6), 0], [0, 0, 2/math.sqrt(6)]],
]

def mat_to_stf5(M):
    return [sum(M[i][j]*T[i][j] for i in range(3) for j in range(3)) for T in T_BASIS]

def q_vec(theta, phi):
    # Propagation unit vector k_hat = (sin theta cos phi, sin theta sin phi, cos theta)
    ct, st = math.cos(theta), math.sin(theta)
    cp, sp = math.cos(phi), math.sin(phi)
    e1 = [ct*cp, ct*sp, -st]
    e2 = [-sp, cp, 0.0]
    # m = (e1 + i e2)/sqrt(2); note ||m m^T||_F = 1!
    m = [(e1[i] + 1j*e2[i])/math.sqrt(2.0) for i in range(3)]
    M = [[m[i]*m[j] for j in range(3)] for i in range(3)]
    return mat_to_stf5(M) # unit norm in C^5!

# 1. Verify ||q(theta, phi)||_2 == 1 and check 68 + 32 = 100 in the helicity basis!
q0 = q_vec(0.7, 1.2)
print("||q||^2 =", sum(abs(x)**2 for x in q0))

# Build numeric SVD / rank function for real Rectangular matrix (M x N) via Gram matrix + Jacobi
def real_rank_and_svals(J, tol=1e-9):
    # J is rows x cols; assume cols <= rows or form smaller symmetric matrix
    R = len(J)
    C = len(J[0])
    if C <= R:
        G = [[sum(J[r][i]*J[r][j] for r in range(R)) for j in range(C)] for i in range(C)]
        n = C
    else:
        G = [[sum(J[i][c]*J[j][c] for c in range(C)) for j in range(R)] for i in range(R)]
        n = R
    # Real symmetric Jacobi
    A = [row[:] for row in G]
    for _ in range(80):
        p, q = 0, 1
        mx = 0.0
        for i in range(n):
            for j in range(i+1, n):
                if abs(A[i][j]) > mx:
                    mx = abs(A[i][j])
                    p, q = i, j
        if mx < 1e-28:
            break
        diff = A[q][q] - A[p][p]
        if abs(diff) < 1e-30:
            t = 1.0
        else:
            tau = diff / (2.0 * A[p][q])
            t = math.copysign(1.0 / (abs(tau) + math.sqrt(1.0 + tau*tau)), tau)
        c = 1.0 / math.sqrt(1.0 + t*t)
        s = t * c
        r = A[p][q]
        A[p][p] -= t * r
        A[q][q] += t * r
        A[p][q] = A[q][p] = 0.0
        for k in range(n):
            if k != p and k != q:
                akp, akq = A[k][p], A[k][q]
                A[k][p] = A[p][k] = c*akp - s*akq
                A[k][q] = A[q][k] = s*akp + c*akq
    svals = sorted([math.sqrt(max(0.0, A[i][i])) for i in range(n)], reverse=True)
    rk = sum(1 for s in svals if s > tol * max(1.0, svals[0]))
    return rk, svals

def pack_hermitian_5x5(H):
    out = []
    for i in range(5):
        out.append(H[i][i].real)
        for j in range(i+1, 5):
            out.append(math.sqrt(2)*H[i][j].real)
            out.append(math.sqrt(2)*H[i][j].imag)
    return out # 25 real numbers

def pack_full_10x10(S_pp, S_mm, S_pm):
    # S_pp (25), S_mm (25), S_pm (50 real numbers) -> 100 real numbers
    out = pack_hermitian_5x5(S_pp) + pack_hermitian_5x5(S_mm)
    for i in range(5):
        for j in range(5):
            out.append(S_pm[i][j].real)
            out.append(S_pm[i][j].imag)
    return out

# 2. Check Jacobian rank (local identifiability) vs K for:
# (a) Unpolarized sources: params (theta_a, phi_a, I_a) -> 3K params into 25 real numbers of S_I!
print("\n=== JACOBIAN RANK TEST (a): UNPOLARIZED SOURCES (3K params -> 25 sky numbers) ===")
random.seed(12345)
for K in range(1, 10):
    params = []
    for _ in range(K):
        th = math.acos(random.uniform(-0.9, 0.9))
        ph = random.uniform(0.1, 6.0)
        Ia = random.uniform(0.5, 2.0)
        params.extend([th, ph, Ia])
    def eval_unpol(p):
        H = [[0j]*5 for _ in range(5)]
        for a in range(K):
            th, ph, Ia = p[3*a], p[3*a+1], p[3*a+2]
            q = q_vec(th, ph)
            for i in range(5):
                for j in range(5):
                    H[i][j] += Ia * q[i] * q[j].conjugate()
        return pack_hermitian_5x5(H)
    eps = 1e-7
    cols = []
    for idx in range(len(params)):
        p_plus = params[:]
        p_minus = params[:]
        p_plus[idx] += eps
        p_minus[idx] -= eps
        fp = eval_unpol(p_plus)
        fm = eval_unpol(p_minus)
        cols.append([(fp[r]-fm[r])/(2*eps) for r in range(len(fp))])
    J = [[cols[c][r] for c in range(len(cols))] for r in range(len(cols[0]))]
    rk, sv = real_rank_and_svals(J)
    print(f"K = {K}: 3K = {3*K:2d}, Jacobian rank = {rk:2d}, smallest sval = {sv[min(len(sv)-1, 3*K-1)]:.3e}")

# (b) Partially polarized general sources: params (theta_a, phi_a, I_a, Q_a, U_a, V_a) -> 6K params into 68 sky numbers!
print("\n=== JACOBIAN RANK TEST (b): GENERAL POLARIZED SOURCES (6K params -> 68 sky numbers) ===")
for K in range(1, 14):
    params = []
    for _ in range(K):
        th = math.acos(random.uniform(-0.9, 0.9))
        ph = random.uniform(0.1, 6.0)
        Ia = random.uniform(1.0, 2.0)
        Qa = random.uniform(-0.4, 0.4)
        Ua = random.uniform(-0.4, 0.4)
        Va = random.uniform(-0.4, 0.4)
        params.extend([th, ph, Ia, Qa, Ua, Va])
    def eval_pol(p):
        Spp = [[0j]*5 for _ in range(5)]
        Smm = [[0j]*5 for _ in range(5)]
        Spm = [[0j]*5 for _ in range(5)]
        for a in range(K):
            th, ph, Ia, Qa, Ua, Va = p[6*a:6*a+6]
            q = q_vec(th, ph)
            for i in range(5):
                for j in range(5):
                    Spp[i][j] += 0.5*(Ia + Va) * q[i] * q[j].conjugate()
                    Smm[i][j] += 0.5*(Ia - Va) * q[i].conjugate() * q[j]
                    Spm[i][j] += 0.5*(Qa - 1j*Ua) * q[i] * q[j]
        return pack_full_10x10(Spp, Smm, Spm)
    eps = 1e-7
    cols = []
    for idx in range(len(params)):
        p_plus = params[:]
        p_minus = params[:]
        p_plus[idx] += eps
        p_minus[idx] -= eps
        fp = eval_pol(p_plus)
        fm = eval_pol(p_minus)
        cols.append([(fp[r]-fm[r])/(2*eps) for r in range(len(fp))])
    J = [[cols[c][r] for c in range(len(cols))] for r in range(len(cols[0]))]
    rk, sv = real_rank_and_svals(J)
    print(f"K = {K:2d}: 6K = {6*K:2d}, Jacobian rank = {rk:2d}, smallest sval = {sv[min(len(sv)-1, 6*K-1)]:.3e}")

# (c) Pure-state (100% elliptically polarized, e.g. uncorrelated binaries): 5K params (theta, phi, I, iota, psi) into rank-K 10x10 matrix!
print("\n=== JACOBIAN RANK TEST (c): 100% POLARIZED SOURCES (5K params -> 68 sky numbers) ===")
for K in range(1, 15):
    params = []
    for _ in range(K):
        th = math.acos(random.uniform(-0.9, 0.9))
        ph = random.uniform(0.1, 6.0)
        Ia = random.uniform(1.0, 2.0)
        io = random.uniform(0.2, 2.9)
        ps = random.uniform(0.1, 3.0)
        params.extend([th, ph, Ia, io, ps])
    def eval_pure(p):
        Spp = [[0j]*5 for _ in range(5)]
        Smm = [[0j]*5 for _ in range(5)]
        Spm = [[0j]*5 for _ in range(5)]
        for a in range(K):
            th, ph, Ia, io, ps = p[5*a:5*a+5]
            ci = math.cos(io)
            # Normalized Stokes: I = Ia, V/I = 2 ci / (1 + ci^2), P_lin/I = sin^2(io)/(1 + ci^2)
            # Wait: for rotating binary, h_+ = (1+ci^2)/2, h_x = ci -> (h_+^2 + h_x^2) = ((1+ci^2)^2/4 + ci^2)
            hp = 0.5*(1 + ci*ci)
            hx = ci
            norm = hp*hp + hx*hx
            # Rotate polarization by psi: a_+ = (hp - i hx) e^{-2i ps}, a_- = (hp + i hx) e^{+2i ps}
            ap = math.sqrt(Ia / (2*norm)) * (hp - 1j*hx) * cmath.exp(-2j*ps)
            am = math.sqrt(Ia / (2*norm)) * (hp + 1j*hx) * cmath.exp(+2j*ps)
            q = q_vec(th, ph)
            for i in range(5):
                for j in range(5):
                    Spp[i][j] += (ap * q[i]) * (ap * q[j]).conjugate()
                    Smm[i][j] += (am * q[i].conjugate()) * (am * q[j].conjugate()).conjugate()
                    Spm[i][j] += (ap * q[i]) * (am * q[j])
        return pack_full_10x10(Spp, Smm, Spm)
    eps = 1e-7
    cols = []
    for idx in range(len(params)):
        p_plus = params[:]
        p_minus = params[:]
        p_plus[idx] += eps
        p_minus[idx] -= eps
        fp = eval_pure(p_plus)
        fm = eval_pure(p_minus)
        cols.append([(fp[r]-fm[r])/(2*eps) for r in range(len(fp))])
    J = [[cols[c][r] for c in range(len(cols))] for r in range(len(cols[0]))]
    rk, sv = real_rank_and_svals(J)
    print(f"K = {K:2d}: 5K = {5*K:2d}, Jacobian rank = {rk:2d}, smallest sval = {sv[min(len(sv)-1, 5*K-1)]:.3e}")
