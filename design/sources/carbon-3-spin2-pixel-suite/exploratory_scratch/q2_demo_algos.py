import sys
sys.path.insert(0, "/Users/neo/.gemini/antigravity/brain/3ca0091c-61b7-44c6-9f3e-dc29ba5c08cd/scratch")
import math, cmath, random
from q2_spectral_v2 import q_vec, T_BASIS, pack_hermitian_5x5

def stf5_to_mat(v):
    M = [[0j]*3 for _ in range(3)]
    for c, T in zip(v, T_BASIS):
        for i in range(3):
            for j in range(3):
                M[i][j] += c * T[i][j]
    return M

def mat_to_khat(W):
    # W = c m m^T -> extract largest singular vector or column with max norm!
    # Wait: W = c m m^T is symmetric rank-1, so any nonzero column is proportional to m!
    best_col = max(range(3), key=lambda j: sum(abs(W[i][j])**2 for i in range(3)))
    m = [W[i][best_col] for i in range(3)]
    mn2 = sum(abs(x)**2 for x in m)
    # k_hat = i (m x m*) / |m|^2
    mxms = [
        m[1]*m[2].conjugate() - m[2]*m[1].conjugate(),
        m[2]*m[0].conjugate() - m[0]*m[2].conjugate(),
        m[0]*m[1].conjugate() - m[1]*m[0].conjugate(),
    ]
    return [(1j * x / mn2).real for x in mxms]

def inv_5x5_complex(A):
    n = 5
    M = [row[:] + [1.0+0j if i==j else 0j for j in range(n)] for i, row in enumerate(A)]
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

def herm_eig_5x5(H):
    # Complex Hermitian Jacobi on 5x5 -> returns (evals, U) with H = U diag(evals) U^dag
    n = 5
    A = [row[:] for row in H]
    U = [[1.0+0j if i==j else 0j for j in range(n)] for i in range(n)]
    for _ in range(60):
        mx = 0.0
        p, q = 0, 1
        for i in range(n):
            for j in range(i+1, n):
                if abs(A[i][j]) > mx:
                    mx = abs(A[i][j]); p, q = i, j
        if mx < 1e-15:
            break
        z = A[p][q]
        r = abs(z)
        ph = z / r
        for k in range(n):
            A[k][q] *= ph.conjugate()
            A[q][k] *= ph
            U[k][q] *= ph.conjugate()
        diff = A[q][q].real - A[p][p].real
        if abs(diff) < 1e-30:
            t = 1.0
        else:
            tau = diff / (2.0 * r)
            t = math.copysign(1.0 / (abs(tau) + math.sqrt(1.0 + tau*tau)), tau)
        c = 1.0 / math.sqrt(1.0 + t*t)
        s = t * c
        app, aqq = A[p][p].real, A[q][q].real
        A[p][p] = app - t*r
        A[q][q] = aqq + t*r
        A[p][q] = A[q][p] = 0j
        for k in range(n):
            if k != p and k != q:
                akp, akq = A[k][p], A[k][q]
                A[k][p] = c*akp - s*akq
                A[p][k] = A[k][p].conjugate()
                A[k][q] = s*akp + c*akq
                A[q][k] = A[k][q].conjugate()
            ukp, ukq = U[k][p], U[k][q]
            U[k][p] = c*ukp - s*ukq
            U[k][q] = s*ukp + c*ukq
    return [A[i][i].real for i in range(n)], U

# TEST 1: K = 5 inclined binaries resolved ALGEBRAICALLY via S_I, S_V Hermitian pencil!
sources_5 = [
    (0.45, 0.30, 1.5, 0.25), # (theta, phi, I, iota)
    (1.10, 1.50, 1.2, 0.70),
    (1.80, 2.80, 0.9, 1.20),
    (2.30, 4.10, 1.7, 2.00),
    (0.95, 5.20, 1.1, 2.65),
]
Spp = [[0j]*5 for _ in range(5)]
Smm = [[0j]*5 for _ in range(5)]
true_k_v = []
for th, ph, Ia, io in sources_5:
    ci = math.cos(io)
    # V / I for rotating binary: ((1+ci)^4 - (1-ci)^4) / ((1+ci)^4 + (1-ci)^4) = 4 ci (1+ci^2) / (1 + 6 ci^2 + ci^4)?
    # Wait: check Eq. (23) of paper! h_+ = (1+ci^2)/2, h_x = ci -> 2 h_+ h_x / (h_+^2 + h_x^2) = 4 ci (1+ci^2) / ((1+ci^2)^2 + 4 ci^2) = 4 ci (1+ci^2)/(1 + 6 ci^2 + ci^4)!!
    # Let's check: (1+ci)^4 + (1-ci)^4 = 2(1 + 6 ci^2 + ci^4), and (1+ci)^4 - (1-ci)^4 = 8 ci (1 + ci^2)! Ratio = 4 ci (1+ci^2)/(1 + 6 ci^2 + ci^4)! EXACT MATCH WITH EQ. (23)!!
    vi = 4*ci*(1 + ci*ci) / (1 + 6*ci*ci + ci**4)
    Va = Ia * vi
    q = q_vec(th, ph)
    for i in range(5):
        for j in range(5):
            Spp[i][j] += 0.5*(Ia + Va) * q[i] * q[j].conjugate()
            Smm[i][j] += 0.5*(Ia - Va) * q[i].conjugate() * q[j]
    true_k_v.append(([math.sin(th)*math.cos(ph), math.sin(th)*math.sin(ph), math.cos(th)], vi, Ia))

SI = [[Spp[i][j] + Smm[i][j].conjugate() for j in range(5)] for i in range(5)]
SV = [[Spp[i][j] - Smm[i][j].conjugate() for j in range(5)] for i in range(5)]

# Whiten SI = V_I diag(d_I) V_I^dag -> A = d_I^{-1/2} V_I^dag SV V_I d_I^{-1/2} is Hermitian!
dI, VI = herm_eig_5x5(SI)
# W_whiten = VI * diag(dI^{-1/2})
Wh = [[VI[i][j] / math.sqrt(dI[j]) for j in range(5)] for i in range(5)]
# A = Wh^dag SV Wh
tmp = [[sum(SV[i][k]*Wh[k][j] for k in range(5)) for j in range(5)] for i in range(5)]
A_pen = [[sum(Wh[k][i].conjugate()*tmp[k][j] for k in range(5)) for j in range(5)] for i in range(5)]
evals_v, VA = herm_eig_5x5(A_pen)
# Generalized eigenvectors U_gen = Wh * VA satisfies U_gen^dag SI U_gen = I and U_gen^dag SV U_gen = diag(evals_v)!
# Since SI = Q D_I Q^dag, U_gen^dag Q D_I^{1/2} is unitary => (U_gen^dag)^{-1} has columns Q D_I^{1/2} (up to phase)!!
# Wait: since U_gen^dag SI U_gen = I, SI * U_gen = (U_gen^dag)^{-1}!! We don't even need matrix inversion!!
U_gen = [[sum(Wh[i][k]*VA[k][j] for k in range(5)) for j in range(5)] for i in range(5)]
Cols = [[sum(SI[i][k]*U_gen[k][j] for k in range(5)) for j in range(5)] for i in range(5)]
# Each column j of Cols is e^{i alpha_j} sqrt(I_j) q(k_j)!! Since ||q|| = 1, ||col_j||^2 = I_j!!
print("=== RUNNABLE TEST 1: K = 5 INCLINED BINARIES RESOLVED ALGEBRAICALLY FROM 10x10 SPECTRAL MATRIX ===")
max_ang_err = 0.0
max_v_err = 0.0
max_I_err = 0.0
for j in range(5):
    col = [Cols[i][j] for i in range(5)]
    I_rec = sum(abs(x)**2 for x in col)
    W_rec = stf5_to_mat(col)
    k_rec = mat_to_khat(W_rec)
    v_rec = evals_v[j]
    # match to closest true source
    best = min(true_k_v, key=lambda item: abs(item[1] - v_rec))
    dot = max(-1.0, min(1.0, sum(k_rec[a]*best[0][a] for a in range(3))))
    ang_err = math.acos(dot)
    max_ang_err = max(max_ang_err, ang_err)
    max_v_err = max(max_v_err, abs(v_rec - best[1]))
    max_I_err = max(max_I_err, abs(I_rec - best[2]))
    print(f"Source match: v_true={best[1]:+.6f}, v_rec={v_rec:+.6f} | I_true={best[2]:.4f}, I_rec={I_rec:.4f} | ang_err={ang_err:.2e} rad")
print(f"Max errors (K=5 closed-form): angle = {max_ang_err:.2e} rad, V/I = {max_v_err:.2e}, I = {max_I_err:.2e}")
