import math, cmath, random
from q1_ranging import eval_W_exact, rot_quad_derivs, eps3

# First verify moving mass with d_0 h_{ij} included gives 0.0 diff with Eq. (34)!
def check_eq34_full():
    n = [0.6, 0.8, 0.0]
    v = [0.1, -0.2, 0.3]
    # At x=0, x_s(t) = r n + v t (r=1, GM=c=1):
    # |x - x_s|^2 = (x - r n - v t)^2 -> d/dt (1/|x - x_s|) at t=0:
    # |x - r n - v t|^{-1} = |x - r n|^{-1} + t * ((x - r n) . (-v)) * (-1) / |x - r n|^3 ... wait:
    # d/dt (|x - x_s(t)|^{-1}) = + (x - x_s) . v / |x - x_s|^3.
    # At x=0, x - x_s = -n, so d_0 (|x - x_s|^{-1}) = -(n . v), and d_p d_0 (|x - x_s|^{-1}):
    # d_p [ (x_k - x_{s,k}) v_k / |x - x_s|^3 ] at x=0 = v_p - 3 (-n_p) (-n . v) = v_p - 3 n_p (n . v)!
    nv = sum(n[k]*v[k] for k in range(3))
    def d2_invr(q, j):
        return 3*n[q]*n[j] - (1.0 if q==j else 0.0)
    def dp_d0_invr(p):
        return v[p] - 3*n[p]*nv
    B_mov = [[0.0]*3 for _ in range(3)]
    for i in range(3):
        for j in range(3):
            s = 0.0
            for p in range(3):
                for q in range(3):
                    if eps3[i][p][q] != 0:
                        # h_{p0} = -4 v_p / r, h_{qj} = +2 delta_{qj} / r
                        rpqj0 = 0.5 * (
                            (-4*v[p])*d2_invr(q,j) - (-4*v[q])*d2_invr(p,j)
                            + (2.0 if q==j else 0.0)*dp_d0_invr(p)
                            - (2.0 if p==j else 0.0)*dp_d0_invr(q)
                        )
                        s += 0.5 * eps3[i][p][q] * rpqj0
            B_mov[i][j] = s
    nxv = [n[1]*v[2]-n[2]*v[1], n[2]*v[0]-n[0]*v[2], n[0]*v[1]-n[1]*v[0]]
    B_eq34 = [[3*(n[i]*nxv[j] + n[j]*nxv[i]) for j in range(3)] for i in range(3)]
    print("Full Eq. (34) check max diff:", max(abs(B_mov[i][j] - B_eq34[i][j]) for i in range(3) for j in range(3)))

check_eq34_full()

# Exact singular values of a 3x3 complex matrix W via eigenvalues of H = W^dag W (3x3 Hermitian)
def svdvals_3x3(W):
    H = [[0j]*3 for _ in range(3)]
    for i in range(3):
        for j in range(3):
            H[i][j] = sum(W[k][i].conjugate() * W[k][j] for k in range(3))
    # Characteristic polynomial of 3x3 Hermitian matrix H: lam^3 - c1 lam^2 + c2 lam - c3 = 0
    # Better: use exact Jacobi diagonalization on 6x6 real or 3x3 complex Hermitian to avoid catastrophic cancellation when s_2 << s_1!
    A = [row[:] for row in H]
    for _ in range(60):
        # find largest off-diagonal
        p, q = 0, 1
        mx = abs(A[0][1])
        for ii in range(3):
            for jj in range(ii+1, 3):
                if abs(A[ii][jj]) > mx:
                    mx = abs(A[ii][jj])
                    p, q = ii, jj
        if mx < 1e-32 * max(1.0, abs(A[0][0].real), abs(A[1][1].real), abs(A[2][2].real)):
            break
        # Phase rotation to make A[p][q] real positive:
        z = A[p][q]
        r = abs(z)
        phase = z / r # e^{i phi}
        # First apply D = diag(..., e^{-i phi} at q) so new A[p][q] = r
        for k in range(3):
            A[k][q] *= phase.conjugate()
            A[q][k] *= phase
        # Now real 2x2 Jacobi rotation on (p, q) with real off-diagonal r:
        diff = A[q][q].real - A[p][p].real
        if abs(diff) < 1e-30:
            t = 1.0
        else:
            tau = diff / (2.0 * r)
            t = math.copysign(1.0 / (abs(tau) + math.sqrt(1.0 + tau*tau)), tau)
        c = 1.0 / math.sqrt(1.0 + t*t)
        s = t * c
        # G^T [[app, r],[r, aqq]] G with G = [[c, s],[-s, c]]
        app = A[p][p].real
        aqq = A[q][q].real
        A[p][p] = app - t * r
        A[q][q] = aqq + t * r
        A[p][q] = 0.0
        A[q][p] = 0.0
        for k in range(3):
            if k != p and k != q:
                akp = A[k][p]
                akq = A[k][q]
                A[k][p] = c * akp - s * akq
                A[p][k] = A[k][p].conjugate()
                A[k][q] = s * akp + c * akq
                A[q][k] = A[k][q].conjugate()
    evals = sorted([max(0.0, A[i][i].real) for i in range(3)], reverse=True)
    return [math.sqrt(v) for v in evals]

# Extract exact W_1, W_2, W_3, W_4, W_5 in W(r) = sum_{m=1}^5 W_m / r^m!
# Since W(r) * r^5 is an EXACT degree-4 polynomial in r (for fixed retarded time u0, i.e., fixed Q_derivs!),
# evaluating at 5 values r = 1, 2, 3, 4, 5 (or Vandermonde) recovers W_1..W_5 to 15 digits!
def extract_W_coeffs(k_hat, Q_derivs):
    rs = [0.5, 1.0, 2.0, 4.0, 8.0] # powers of 2 -> well-conditioned Vandermonde in x = 1/r!
    xs = [1.0/r for r in rs] # [2, 1, 0.5, 0.25, 0.125]
    # Wait: W(x) = W_1 x + W_2 x^2 + W_3 x^3 + W_4 x^4 + W_5 x^5 -> W(x)/x = W_1 + W_2 x + W_3 x^2 + W_4 x^3 + W_5 x^4!
    Ws = []
    for r in rs:
        _, _, W = eval_W_exact([r*k_hat[0], r*k_hat[1], r*k_hat[2]], Q_derivs)
        Ws.append(W)
    # Invert 5x5 Vandermonde V_{ab} = xs[a]^b for b=0..4
    # Solve by Gaussian elimination
    coeffs = [[[0j]*3 for _ in range(3)] for _ in range(5)]
    for i in range(3):
        for j in range(3):
            M = [[xs[a]**b for b in range(5)] + [Ws[a][i][j] / xs[a]] for a in range(5)]
            for col in range(5):
                piv = max(range(col, 5), key=lambda r_idx: abs(M[r_idx][col]))
                M[col], M[piv] = M[piv], M[col]
                div = M[col][col]
                for c_idx in range(col, 6):
                    M[col][c_idx] /= div
                for r_idx in range(5):
                    if r_idx != col:
                        fac = M[r_idx][col]
                        for c_idx in range(col, 6):
                            M[r_idx][c_idx] -= fac * M[col][c_idx]
            for m in range(5):
                coeffs[m][i][j] = M[m][5]
    return coeffs # [W_1, W_2, W_3, W_4, W_5]

# Let's inspect W_1, W_2, W_3, W_4, W_5 along k_hat = (0, 0, 1) for a completely general STF tensor Q^{(n)}!
# Choose unit basis of 5 real STF matrices!
# In basis (x, y, z) where k_hat = z:
#   e_+   = [[1, 0, 0], [0, -1, 0], [0, 0, 0]]         (m = +2/-2 real, TT +)
#   e_x   = [[0, 1, 0], [1,  0, 0], [0, 0, 0]]         (m = +2/-2 imag, TT x)
#   e_xz  = [[0, 0, 1], [0,  0, 0], [1, 0, 0]]         (m = +-1 vector-x)
#   e_yz  = [[0, 0, 0], [0,  0, 1], [0, 1, 0]]         (m = +-1 vector-y)
#   e_0   = [[-1,0, 0], [0, -1, 0], [0, 0, 2]]         (m = 0 longitudinal)
stf_basis = {
    "plus": [[1,0,0],[0,-1,0],[0,0,0]],
    "cross": [[0,1,0],[1,0,0],[0,0,0]],
    "xz": [[0,0,1],[0,0,0],[1,0,0]],
    "yz": [[0,0,0],[0,0,1],[0,1,0]],
    "long": [[-1,0,0],[0,-1,0],[0,0,2]],
}

print("\n=== EXACT COEFFICIENTS OF W_1..W_5 ALONG k_hat = (0,0,1) FOR EACH DERIVATIVE Q^{(n)} AND STF MODE ===")
k_z = [0.0, 0.0, 1.0]
for bname, Bmat in stf_basis.items():
    for deriv_n in range(5):
        Q_d = [[[0.0]*3 for _ in range(3)] for _ in range(9)]
        Q_d[deriv_n] = Bmat
        W_list = extract_W_coeffs(k_z, Q_d)
        for m_idx, Wm in enumerate(W_list):
            norm = max(abs(Wm[a][b]) for a in range(3) for b in range(3))
            if norm > 1e-12:
                # Decompose Wm into stf_basis!
                parts = []
                for name2, B2 in stf_basis.items():
                    # inner product tr(Wm B2) / tr(B2^2)
                    ip = sum(Wm[a][b]*B2[a][b] for a in range(3) for b in range(3))
                    n2 = sum(B2[a][b]*B2[a][b] for a in range(3) for b in range(3))
                    c_val = ip / n2
                    if abs(c_val) > 1e-12:
                        parts.append(f"({c_val.real:+.4g}{c_val.imag:+.4g}j)*{name2}")
                print(f"Q^({deriv_n}) [{bname:5s}] -> r^-{m_idx+1}: " + " + ".join(parts))
