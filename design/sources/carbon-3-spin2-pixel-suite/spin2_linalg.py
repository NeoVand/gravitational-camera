"""
spin2_linalg.py
Zero-dependency pure-Python linear algebra, STF tensor basis, polynomial automatic
differentiation, quadrature, and root-finding utilities for the Spin-2 Pixel suite.

Conventions (matching BRIEF_FOR_CARBON.md):
  - Signature (- + + +), x^0 = c t, eps_{123} = +1
  - E_{ij} = c^2 R_{0i0j}, B_{ij} = (c^2 / 2) eps_{ipq} R_{pqj0}
  - W = E + i B
  - Plane wave along unit propagation vector k_hat:
      W = c_0 m m^T,  m . m = 0,  k_hat = i (m x m*) / |m|^2
"""

import math
import cmath

# 3D Levi-Civita tensor eps_{ijk} with eps_{012} = +1
EPS3 = [
    [[1 if (i, j, k) in ((0, 1, 2), (1, 2, 0), (2, 0, 1))
      else (-1 if (i, j, k) in ((0, 2, 1), (2, 1, 0), (1, 0, 2)) else 0)
      for k in range(3)] for j in range(3)] for i in range(3)
]

# Orthonormal basis {T_A}_{A=0..4} of real 3x3 symmetric trace-free (STF) matrices:
# tr(T_A T_B) = delta_{AB}
STF_BASIS = [
    [[1.0 / math.sqrt(2.0), 0.0, 0.0],
     [0.0, -1.0 / math.sqrt(2.0), 0.0],
     [0.0, 0.0, 0.0]],
    [[0.0, 1.0 / math.sqrt(2.0), 0.0],
     [1.0 / math.sqrt(2.0), 0.0, 0.0],
     [0.0, 0.0, 0.0]],
    [[0.0, 0.0, 1.0 / math.sqrt(2.0)],
     [0.0, 0.0, 0.0],
     [1.0 / math.sqrt(2.0), 0.0, 0.0]],
    [[0.0, 0.0, 0.0],
     [0.0, 0.0, 1.0 / math.sqrt(2.0)],
     [0.0, 1.0 / math.sqrt(2.0), 0.0]],
    [[-1.0 / math.sqrt(6.0), 0.0, 0.0],
     [0.0, -1.0 / math.sqrt(6.0), 0.0],
     [0.0, 0.0, 2.0 / math.sqrt(6.0)]],
]


def mat_to_stf5(M):
    """Project a 3x3 real or complex matrix M onto the 5 orthonormal STF basis elements."""
    return [sum(M[i][j] * T[i][j] for i in range(3) for j in range(3)) for T in STF_BASIS]


def stf5_to_mat(v):
    """Reconstruct a 3x3 symmetric trace-free matrix from its 5 STF coordinates."""
    M = [[0j if isinstance(v[0], complex) else 0.0 for _ in range(3)] for __ in range(3)]
    for c, T in zip(v, STF_BASIS):
        for i in range(3):
            for j in range(3):
                M[i][j] += c * T[i][j]
    return M


def pack_eb_10(E, B):
    """Pack real 3x3 STF tensors (E, B) into an orthonormal 10-vector in R^10."""
    return mat_to_stf5(E) + mat_to_stf5(B)


def sky_triad(k_hat):
    """
    Given unit propagation vector k_hat = (kx, ky, kz), return right-handed
    orthonormal triad (e1, e2, k_hat) with e1 x e2 = k_hat, plus unit null
    vectors m = (e1 + i e2)/sqrt(2) and ms = m* so k_hat = i (m x m*).
    """
    kx, ky, kz = k_hat
    s_perp = math.hypot(kx, ky)
    if s_perp > 1e-12:
        e1 = [kx * kz / s_perp, ky * kz / s_perp, -s_perp]
        e2 = [-ky / s_perp, kx / s_perp, 0.0]
    else:
        e1 = [1.0, 0.0, 0.0]
        e2 = [0.0, 1.0 if kz >= 0.0 else -1.0, 0.0]
    inv_rt2 = 1.0 / math.sqrt(2.0)
    m = [(e1[i] + 1j * e2[i]) * inv_rt2 for i in range(3)]
    ms = [x.conjugate() for x in m]
    return e1, e2, m, ms


def sky_triad_angles(theta, phi):
    """Return (k_hat, e1, e2, m, ms) from spherical angles (theta, phi)."""
    ct, st = math.cos(theta), math.sin(theta)
    cp, sp = math.cos(phi), math.sin(phi)
    k_hat = [st * cp, st * sp, ct]
    e1 = [ct * cp, ct * sp, -st]
    e2 = [-sp, cp, 0.0]
    inv_rt2 = 1.0 / math.sqrt(2.0)
    m = [(e1[i] + 1j * e2[i]) * inv_rt2 for i in range(3)]
    ms = [x.conjugate() for x in m]
    return k_hat, e1, e2, m, ms


def q_spin2_vec(theta, phi):
    """Unit-norm 5-component complex chiral steering vector q(k_hat) = stf5(m m^T)."""
    _, _, _, m, _ = sky_triad_angles(theta, phi)
    M = [[m[i] * m[j] for j in range(3)] for i in range(3)]
    return mat_to_stf5(M)


def khat_from_rank1_weyl(W):
    """Extract unit propagation vector k_hat = i (m x m*) / |m|^2 from W = c_0 m m^T."""
    best_col = max(range(3), key=lambda j: sum(abs(W[i][j]) ** 2 for i in range(3)))
    m = [W[i][best_col] for i in range(3)]
    mn2 = sum(abs(x) ** 2 for x in m)
    cx = [
        m[1] * m[2].conjugate() - m[2] * m[1].conjugate(),
        m[2] * m[0].conjugate() - m[0] * m[2].conjugate(),
        m[0] * m[1].conjugate() - m[1] * m[0].conjugate(),
    ]
    kv = [(1j * x / mn2).real for x in cx]
    kn = math.sqrt(sum(x * x for x in kv))
    return [x / kn for x in kv]


def svd_3x3_exact(W):
    """
    Singular values s1 >= s2 >= s3 >= 0 of a 3x3 complex matrix W computed without
    forming W^dag W (avoiding squaring condition numbers when s2/s1 ~ 10^-6).
    Uses elementary symmetric invariants ||W||_F^2, ||adj(W)||_F^2, |det(W)|^2.
    """
    e1 = sum(abs(W[i][j]) ** 2 for i in range(3) for j in range(3))
    if e1 == 0.0:
        return [0.0, 0.0, 0.0]
    adj = [[0j] * 3 for _ in range(3)]
    for i in range(3):
        i1, i2 = (i + 1) % 3, (i + 2) % 3
        for j in range(3):
            j1, j2 = (j + 1) % 3, (j + 2) % 3
            adj[j][i] = W[i1][j1] * W[i2][j2] - W[i1][j2] * W[i2][j1]
    e2 = sum(abs(adj[i][j]) ** 2 for i in range(3) for j in range(3))
    det_w = W[0][0] * adj[0][0] + W[0][1] * adj[1][0] + W[0][2] * adj[2][0]
    e3 = abs(det_w) ** 2

    x1 = e1
    for _ in range(35):
        f = ((x1 - e1) * x1 + e2) * x1 - e3
        fp = (3.0 * x1 - 2.0 * e1) * x1 + e2
        if abs(fp) > 0.0:
            x1 -= f / fp
    p_rem = e3 / x1
    s_rem = max(0.0, (e2 - p_rem) / x1)
    disc = max(0.0, s_rem * s_rem - 4.0 * p_rem)
    x2 = 0.5 * (s_rem + math.sqrt(disc))
    x3 = p_rem / x2 if x2 > 0.0 else 0.0
    return [math.sqrt(max(0.0, x1)), math.sqrt(max(0.0, x2)), math.sqrt(max(0.0, x3))]


def hermitian_eigh(H, sweeps=35):
    """
    Exact Jacobi eigensolver for an n x n complex Hermitian matrix H.
    Returns (evals, U) with H = U diag(evals) U^dag.
    """
    n = len(H)
    A = [[complex(H[i][j]) for j in range(n)] for i in range(n)]
    U = [[1.0 + 0j if i == j else 0j for j in range(n)] for i in range(n)]
    for _ in range(sweeps):
        max_off = 0.0
        for p in range(n):
            for q in range(p + 1, n):
                r = abs(A[p][q])
                if r > max_off:
                    max_off = r
                if r < 1e-20 * max(1.0, abs(A[p][p].real), abs(A[q][q].real)):
                    continue
                ph = A[p][q] / r
                for k in range(n):
                    A[k][q] *= ph.conjugate()
                    A[q][k] *= ph
                    U[k][q] *= ph.conjugate()
                diff = A[q][q].real - A[p][p].real
                if abs(diff) < 1e-30:
                    t = 1.0
                else:
                    tau = diff / (2.0 * r)
                    t = math.copysign(1.0 / (abs(tau) + math.sqrt(1.0 + tau * tau)), tau)
                c = 1.0 / math.sqrt(1.0 + t * t)
                s = t * c
                app, aqq = A[p][p].real, A[q][q].real
                A[p][p] = app - t * r
                A[q][q] = aqq + t * r
                A[p][q] = A[q][p] = 0j
                for k in range(n):
                    if k != p and k != q:
                        akp, akq = A[k][p], A[k][q]
                        A[k][p] = c * akp - s * akq
                        A[p][k] = A[k][p].conjugate()
                        A[k][q] = s * akp + c * akq
                        A[q][k] = A[k][q].conjugate()
                    ukp, ukq = U[k][p], U[k][q]
                    U[k][p] = c * ukp - s * ukq
                    U[k][q] = s * ukp + c * ukq
        if max_off < 1e-19:
            break
    return [A[i][i].real for i in range(n)], U


def qr_rank_real(J, tol=1e-9):
    """Column-pivoted Householder QR rank and R-diagonal magnitudes of an R x C real matrix."""
    R = len(J)
    C = len(J[0])
    A = [row[:] for row in J]
    diag_r = []
    for k in range(min(R, C)):
        best_j = k
        best_n2 = -1.0
        for j in range(k, C):
            n2 = sum(A[i][j] ** 2 for i in range(k, R))
            if n2 > best_n2:
                best_n2 = n2
                best_j = j
        if best_j != k:
            for i in range(R):
                A[i][k], A[i][best_j] = A[i][best_j], A[i][k]
        norm_x = math.sqrt(best_n2)
        if norm_x == 0.0:
            diag_r.append(0.0)
            break
        diag_r.append(norm_x)
        alpha = -math.copysign(norm_x, A[k][k])
        v = [A[i][k] for i in range(k, R)]
        v[0] -= alpha
        vn2 = sum(x * x for x in v)
        if vn2 == 0.0:
            continue
        for j in range(k, C):
            dot = sum(v[i - k] * A[i][j] for i in range(k, R))
            fac = 2.0 * dot / vn2
            for i in range(k, R):
                A[i][j] -= fac * v[i - k]
    if not diag_r:
        return 0, [0.0]
    rk = sum(1 for d in diag_r if d > tol * diag_r[0])
    return rk, diag_r


def qr_rank_complex(M_complex, tol=1e-9):
    """Complex matrix rank via real 2R x 2C embedding + column-pivoted Householder QR."""
    R = len(M_complex)
    C = len(M_complex[0])
    J = []
    for r in range(R):
        row1, row2 = [], []
        for c in range(C):
            z = M_complex[r][c]
            row1.extend([z.real, -z.imag])
            row2.extend([z.imag, z.real])
        J.append(row1)
        J.append(row2)
    rk, dr = qr_rank_real(J, tol=tol)
    return rk // 2, dr


def invert_matrix(A):
    """Gauss-Jordan matrix inverse for real or complex square matrix A."""
    n = len(A)
    is_cplx = any(isinstance(A[i][j], complex) for i in range(n) for j in range(n))
    one = 1.0 + 0j if is_cplx else 1.0
    zero = 0j if is_cplx else 0.0
    M = [list(row) + [one if i == j else zero for j in range(n)] for i, row in enumerate(A)]
    for col in range(n):
        piv = max(range(col, n), key=lambda r: abs(M[r][col]))
        M[col], M[piv] = M[piv], M[col]
        div = M[col][col]
        for c in range(2 * n):
            M[col][c] /= div
        for r in range(n):
            if r != col:
                fac = M[r][col]
                for c in range(2 * n):
                    M[r][c] -= fac * M[col][c]
    return [row[n:] for row in M]


def exp_complex_so3(ax, ay, az):
    """
    Exact Rodrigues exponential exp(M) in SO(3, C) where M_{ij} = -eps_{ijk} a_k
    for a real or complex 3-vector a = (ax, ay, az). Satisfies G^T G = I_3.
    """
    th2 = ax * ax + ay * ay + az * az
    th = cmath.sqrt(th2)
    if abs(th) < 1e-8:
        c1 = 1.0 - th2 / 6.0 + th2 * th2 / 120.0
        c2 = 0.5 - th2 / 24.0 + th2 * th2 / 720.0
    else:
        c1 = cmath.sin(th) / th
        c2 = (1.0 - cmath.cos(th)) / th2
    a = [ax, ay, az]
    M = [[-sum(EPS3[i][j][k] * a[k] for k in range(3)) for j in range(3)] for i in range(3)]
    M2 = [[sum(M[i][k] * M[k][j] for k in range(3)) for j in range(3)] for i in range(3)]
    return [[(1.0 if i == j else 0.0) + c1 * M[i][j] + c2 * M2[i][j] for j in range(3)] for i in range(3)]


def solve_poly_roots(coeffs, iters=90):
    """
    Durand-Kerner solver for c_n z^n + c_{n-1} z^{n-1} + ... + c_0 = 0,
    where coeffs = [c_n, c_{n-1}, ..., c_0] with c_n != 0.
    """
    n = len(coeffs) - 1
    c_lead = coeffs[0]
    p = [c / c_lead for c in coeffs]
    roots = [0.43 * cmath.exp(2j * math.pi * (k + 0.37) / n) + 0.71 ** (k + 1) for k in range(n)]
    for _ in range(iters):
        for i in range(n):
            z = roots[i]
            val = p[0]
            for k in range(1, n + 1):
                val = val * z + p[k]
            den = 1.0 + 0j
            for j in range(n):
                if j != i:
                    den *= (z - roots[j])
            roots[i] -= val / den
    return roots


def gauss_legendre(n):
    """Nodes and weights of n-point Gauss-Legendre quadrature on [-1, 1]."""
    xs, ws = [], []
    for k in range(1, n + 1):
        x = math.cos(math.pi * (k - 0.25) / (n + 0.5))
        for _ in range(30):
            p0, p1 = 1.0, x
            for m in range(2, n + 1):
                p0, p1 = p1, ((2 * m - 1) * x * p1 - (m - 1) * p0) / m
            dp = n * (x * p1 - p0) / (x * x - 1.0)
            x -= p1 / dp
        ws.append(2.0 / ((1.0 - x * x) * dp * dp))
        xs.append(x)
    return xs, ws


# Truncated 3D degree-4 polynomial algebra for exact 4th-order spatial derivatives
_MONS = [(a, b, c) for a in range(5) for b in range(5 - a) for c in range(5 - a - b)]
_MON_IDX = {m: idx for idx, m in enumerate(_MONS)}
N_MON3D = len(_MONS)  # 35


def poly3_zero():
    return [0.0] * N_MON3D


def poly3_const(c):
    p = [0.0] * N_MON3D
    p[_MON_IDX[(0, 0, 0)]] = c
    return p


def poly3_add(p1, p2, scale=1.0):
    return [p1[i] + scale * p2[i] for i in range(N_MON3D)]


def poly3_mul(p1, p2):
    res = [0.0] * N_MON3D
    for i1, (a1, b1, c1) in enumerate(_MONS):
        v1 = p1[i1]
        if v1 == 0.0:
            continue
        for i2, (a2, b2, c2) in enumerate(_MONS):
            if a1 + a2 + b1 + b2 + c1 + c2 <= 4:
                v2 = p2[i2]
                if v2 != 0.0:
                    res[_MON_IDX[(a1 + a2, b1 + b2, c1 + c2)]] += v1 * v2
    return res


def poly3_deriv(p, axis):
    res = [0.0] * N_MON3D
    for idx, (a, b, c) in enumerate(_MONS):
        val = p[idx]
        if val == 0.0:
            continue
        if axis == 0 and a > 0:
            res[_MON_IDX[(a - 1, b, c)]] += a * val
        elif axis == 1 and b > 0:
            res[_MON_IDX[(a, b - 1, c)]] += b * val
        elif axis == 2 and c > 0:
            res[_MON_IDX[(a, b, c - 1)]] += c * val
    return res


POLY3_C0_IDX = _MON_IDX[(0, 0, 0)]
POLY3_MON_IDX = _MON_IDX
