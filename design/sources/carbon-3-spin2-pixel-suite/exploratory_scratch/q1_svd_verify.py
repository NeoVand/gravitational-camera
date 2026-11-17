import math, cmath, random
from q1_ranging import eval_W_exact, rot_quad_derivs
from q1_formula_check import make_triad, quad_form, C_rot_exact

def svd_exact_3x3(W):
    # Use Frobenius norms of W, adj(W), and det(W) -> NO squaring of condition number!
    # Let x_1 >= x_2 >= x_3 >= 0 be s_1^2, s_2^2, s_3^2:
    # e1 = x1 + x2 + x3 = ||W||_F^2
    # e2 = x1 x2 + x2 x3 + x3 x1 = ||adj(W)||_F^2
    # e3 = x1 x2 x3 = |det(W)|^2
    e1 = sum(abs(W[i][j])**2 for i in range(3) for j in range(3))
    adj = [[0j]*3 for _ in range(3)]
    for i in range(3):
        i1, i2 = (i+1)%3, (i+2)%3
        for j in range(3):
            j1, j2 = (j+1)%3, (j+2)%3
            adj[j][i] = W[i1][j1]*W[i2][j2] - W[i1][j2]*W[i2][j1]
    e2 = sum(abs(adj[i][j])**2 for i in range(3) for j in range(3))
    detW = W[0][0]*adj[0][0] + W[0][1]*adj[1][0] + W[0][2]*adj[2][0]
    e3 = abs(detW)**2
    # Solve t^3 - e1 t^2 + e2 t - e3 = 0 carefully using Newton / quadratic deflation from largest root x1 ~ e1:
    x1 = e1
    for _ in range(30):
        f = ((x1 - e1)*x1 + e2)*x1 - e3
        fp = (3*x1 - 2*e1)*x1 + e2
        if abs(fp) > 0:
            x1 -= f / fp
    # Remaining two roots satisfy t^2 - s_rem t + p_rem = 0 where:
    # x2 + x3 = e1 - x1 (or better: (e2 - x2*x3)/x1 to avoid cancellation!)
    # Wait: e2 = x1(x2 + x3) + x2 x3, and e3 = x1 (x2 x3) => x2 x3 = e3 / x1, so x2 + x3 = (e2 - e3/x1) / x1!!
    # ZERO CANCELLATION AT ALL ORDERS!!
    if x1 == 0:
        return [0.0, 0.0, 0.0]
    p_rem = e3 / x1
    s_rem = max(0.0, (e2 - p_rem) / x1)
    disc = max(0.0, s_rem*s_rem - 4.0*p_rem)
    x2 = 0.5 * (s_rem + math.sqrt(disc))
    x3 = p_rem / x2 if x2 > 0 else 0.0
    return [math.sqrt(max(0.0, x1)), math.sqrt(max(0.0, x2)), math.sqrt(max(0.0, x3))]

print("=== HIGH-PRECISION CHECK OF GENERAL QUADRUPOLE FORMULA AT r = 1e6 ===")
random.seed(42)
for trial in range(5):
    v = [random.gauss(0,1) for _ in range(3)]
    vn = math.sqrt(sum(x*x for x in v))
    k_hat = [x/vn for x in v]
    e1, e2, m, ms = make_triad(k_hat)
    Q_d = []
    for n in range(9):
        A = [[random.gauss(0,1) for _ in range(3)] for __ in range(3)]
        S = [[0.5*(A[i][j]+A[j][i]) for j in range(3)] for i in range(3)]
        tr = (S[0][0]+S[1][1]+S[2][2])/3.0
        for i in range(3): S[i][i] -= tr
        Q_d.append(S)

    alpha_1 = -2.0 * quad_form(ms, Q_d[4], ms)
    beta_2  = +4.0 * quad_form(ms, Q_d[3], k_hat)
    gamma_3 = -3.0 * quad_form(k_hat, Q_d[2], k_hat)
    pred = abs(2.0 * alpha_1 * gamma_3 - beta_2**2) / (abs(alpha_1)**2)

    r_big = 1e6
    _, _, W_num = eval_W_exact([r_big*k_hat[0], r_big*k_hat[1], r_big*k_hat[2]], Q_d)
    s1, s2, s3 = svd_exact_3x3(W_num)
    num = (r_big**2) * (s2 / s1)
    print(f"Trial {trial}: analytic = {pred:.12f}, numeric(r=1e6) = {num:.12f}, rel_err = {abs(pred-num)/pred:.2e}, r^4 s3/s1 = {(r_big**4)*(s3/s1):.6f}")

print("\n=== HIGH-PRECISION CHECK OF ROTATING QUADRUPOLE C(iota, theta) AT kr = 1e6 ===")
max_rel = 0.0
for iota_deg in [0, 15, 30, 45, 54.735610317245346, 60, 75, 90]:
    for theta_deg in [0, 30, 45, 60, 90]:
        if iota_deg == 90 and theta_deg == 90:
            continue
        iota = math.radians(iota_deg)
        theta = math.radians(theta_deg)
        k_hat = [math.sin(iota), 0.0, math.cos(iota)]
        r_big = 1e6
        _, _, W_num = eval_W_exact([r_big*k_hat[0], r_big*k_hat[1], r_big*k_hat[2]], rot_quad_derivs(theta, 1.0))
        s1, s2, s3 = svd_exact_3x3(W_num)
        c_num = (r_big**2) * (s2 / s1)
        c_ana = C_rot_exact(iota, theta)
        err = abs(c_num - c_ana)
        if c_ana > 1e-10:
            max_rel = max(max_rel, err / c_ana)
        if theta_deg in [0, 30, 45, 90] and iota_deg in [0, 30, 45, 54.735610317245346, 60, 90]:
            print(f"iota={iota_deg:8.4f}, theta={theta_deg:2d}: C_ana={c_ana:.12f}, C_num={c_num:.12f}, kr^4 s2/s1(if 0)={(r_big**4)*(s2/s1):.6f}, kr^4 s3/s1={(r_big**4)*(s3/s1):.6f}")
print("Max relative error across all non-nodal (iota, theta) at kr=1e6:", max_rel)
