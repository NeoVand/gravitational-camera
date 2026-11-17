import math, cmath, random

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
    ct, st = math.cos(theta), math.sin(theta)
    cp, sp = math.cos(phi), math.sin(phi)
    e1 = [ct*cp, ct*sp, -st]
    e2 = [-sp, cp, 0.0]
    m = [(e1[i] + 1j*e2[i])/math.sqrt(2.0) for i in range(3)]
    M = [[m[i]*m[j] for j in range(3)] for i in range(3)]
    return mat_to_stf5(M)

def qr_col_pivoting_rank(J, tol=1e-9):
    # Exact column-pivoted Householder QR on R x C real matrix J -> no squaring of condition number, O(R C^2), exact!
    R = len(J)
    C = len(J[0])
    A = [row[:] for row in J]
    diag_R = []
    for k in range(min(R, C)):
        # Find column j >= k with max 2-norm in rows k..R-1
        best_j = k
        best_n2 = -1.0
        for j in range(k, C):
            n2 = sum(A[i][j]**2 for i in range(k, R))
            if n2 > best_n2:
                best_n2 = n2
                best_j = j
        # Swap columns k and best_j
        if best_j != k:
            for i in range(R):
                A[i][k], A[i][best_j] = A[i][best_j], A[i][k]
        norm_x = math.sqrt(best_n2)
        if norm_x == 0.0:
            diag_R.append(0.0)
            break
        diag_R.append(norm_x)
        # Householder vector v on rows k..R-1
        alpha = -math.copysign(norm_x, A[k][k])
        v = [A[i][k] for i in range(k, R)]
        v[0] -= alpha
        vn2 = sum(x*x for x in v)
        if vn2 == 0.0:
            continue
        for j in range(k, C):
            dot = sum(v[i-k]*A[i][j] for i in range(k, R))
            fac = 2.0 * dot / vn2
            for i in range(k, R):
                A[i][j] -= fac * v[i-k]
    if not diag_R:
        return 0, [0.0]
    rk = sum(1 for d in diag_R if d > tol * diag_R[0])
    return rk, diag_R

def pack_hermitian_5x5(H):
    out = []
    for i in range(5):
        out.append(H[i][i].real)
        for j in range(i+1, 5):
            out.append(math.sqrt(2)*H[i][j].real)
            out.append(math.sqrt(2)*H[i][j].imag)
    return out

def pack_full_10x10(S_pp, S_mm, S_pm):
    out = pack_hermitian_5x5(S_pp) + pack_hermitian_5x5(S_mm)
    for i in range(5):
        for j in range(5):
            out.append(S_pm[i][j].real)
            out.append(S_pm[i][j].imag)
    return out

random.seed(12345)

print("=== (a) UNPOLARIZED SOURCES: 3K params (theta, phi, I) -> 25 sky numbers ===")
for K in range(1, 11):
    params = []
    for _ in range(K):
        params.extend([math.acos(random.uniform(-0.9, 0.9)), random.uniform(0.1, 6.0), random.uniform(0.5, 2.0)])
    def eval_a(p):
        H = [[0j]*5 for _ in range(5)]
        for a in range(K):
            th, ph, Ia = p[3*a:3*a+3]
            q = q_vec(th, ph)
            for i in range(5):
                for j in range(5):
                    H[i][j] += Ia * q[i] * q[j].conjugate()
        return pack_hermitian_5x5(H)
    eps = 1e-7
    cols = []
    for idx in range(len(params)):
        pp, pm = params[:], params[:]
        pp[idx] += eps; pm[idx] -= eps
        fp, fm = eval_a(pp), eval_a(pm)
        cols.append([(fp[r]-fm[r])/(2*eps) for r in range(len(fp))])
    J = [[cols[c][r] for c in range(len(cols))] for r in range(len(cols[0]))]
    rk, dr = qr_col_pivoting_rank(J)
    print(f"K={K:2d}: 3K={3*K:2d}, rank={rk:2d}, last_R={dr[-1]:.3e}")

print("\n=== (b) ARBITRARILY (PARTIALLY) POLARIZED SOURCES: 6K params (theta, phi, I, Q, U, V) -> 68 sky numbers ===")
for K in range(1, 14):
    params = []
    for _ in range(K):
        params.extend([math.acos(random.uniform(-0.9, 0.9)), random.uniform(0.1, 6.0),
                       random.uniform(1.0, 2.0), random.uniform(-0.3, 0.3), random.uniform(-0.3, 0.3), random.uniform(-0.3, 0.3)])
    def eval_b(p):
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
        pp, pm = params[:], params[:]
        pp[idx] += eps; pm[idx] -= eps
        fp, fm = eval_b(pp), eval_b(pm)
        cols.append([(fp[r]-fm[r])/(2*eps) for r in range(len(fp))])
    J = [[cols[c][r] for c in range(len(cols))] for r in range(len(cols[0]))]
    rk, dr = qr_col_pivoting_rank(J)
    print(f"K={K:2d}: 6K={6*K:2d}, rank={rk:2d}, last_R={dr[-1]:.3e}")

print("\n=== (c) 100% ELLIPTICALLY POLARIZED SOURCES (e.g. binaries): 5K params (theta, phi, I, iota, psi) -> 68 sky numbers ===")
for K in range(1, 16):
    params = []
    for _ in range(K):
        params.extend([math.acos(random.uniform(-0.9, 0.9)), random.uniform(0.1, 6.0),
                       random.uniform(1.0, 2.0), random.uniform(0.2, 2.9), random.uniform(0.1, 3.0)])
    def eval_c(p):
        Spp = [[0j]*5 for _ in range(5)]
        Smm = [[0j]*5 for _ in range(5)]
        Spm = [[0j]*5 for _ in range(5)]
        for a in range(K):
            th, ph, Ia, io, ps = p[5*a:5*a+5]
            ci = math.cos(io)
            # h_tilde_+ = 1/2(1 + ci^2), h_tilde_x = -i ci -> a_+ = h_+ - i h_x = 1/2(1 - ci)^2, a_- = h_+ + i h_x = 1/2(1 + ci)^2!
            # Wait: check sign! Earlier for k_hat = +z and anticlockwise rotor in xy (iota = 0, ci = +1):
            # Q_xx = cos(wt), Q_xy = sin(wt) => Q_tilde = [[1, i, 0], [i, -1, 0], [0,0,0]] = 2 m m^T!
            # Wait: W = -2 (ms^T Q^{(4)} ms) m m^T? No: if Q_tilde = 2 m m^T, ms^T (2 m m^T) ms = 2!
            # So W_tilde(omega) = E_tilde + i B_tilde IS PURELY IN THE m m^T (+ helicity) SECTOR AT iota = 0!!
            # That means at iota = 0 (ci = +1), a_+ = 1/2(1 + ci)^2 and a_- = 1/2(1 - ci)^2!!
            fp_amp = 0.5*(1 + ci)**2
            fm_amp = 0.5*(1 - ci)**2
            norm = fp_amp**2 + fm_amp**2
            ap = math.sqrt(Ia / norm) * fp_amp * cmath.exp(-2j*ps)
            am = math.sqrt(Ia / norm) * fm_amp * cmath.exp(+2j*ps)
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
        pp, pm = params[:], params[:]
        pp[idx] += eps; pm[idx] -= eps
        fp, fm = eval_c(pp), eval_c(pm)
        cols.append([(fp[r]-fm[r])/(2*eps) for r in range(len(fp))])
    J = [[cols[c][r] for c in range(len(cols))] for r in range(len(cols[0]))]
    rk, dr = qr_col_pivoting_rank(J)
    print(f"K={K:2d}: 5K={5*K:2d}, rank={rk:2d}, last_R={dr[-1]:.3e}")
