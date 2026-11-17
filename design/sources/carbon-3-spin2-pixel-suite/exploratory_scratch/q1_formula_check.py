import math, cmath, random
from q1_ranging import eval_W_exact, rot_quad_derivs
from q1_solve import svdvals_3x3, extract_W_coeffs

def make_triad(k_hat):
    # Right-handed orthonormal basis (e1, e2, k_hat) with e1 x e2 = k_hat
    # If k_hat != (0,0,+-1), let rotor spin axis be z = (0,0,1):
    # Paper convention (p. 10, below Eq. 22): "measured on axes across the line of sight one of which lies along the projection of the spin"
    # Wait: let's check which axis gives h_+ = A(1 + cos^2 iota)/2!
    # If rotor is in xy-plane (spin along +z), and observer is at k_hat = (sin iota, 0, cos iota):
    # Transverse axes: e_theta = (cos iota, 0, -sin iota) (in spin-k plane, projection of -z), e_phi = (0, 1, 0) (perpendicular to spin-k plane).
    # Note e_theta x e_phi = (cos iota, 0, -sin iota) x (0, 1, 0) = (sin iota, 0, cos iota) = k_hat!
    # Let's check Q_{e_phi, e_phi} - Q_{e_theta, e_theta}:
    # Q_{xx} = cos theta, Q_{yy} = -cos theta:
    # Q_{e_theta, e_theta} = cos^2(iota) cos(theta), Q_{e_phi, e_phi} = -cos(theta)
    # => e_theta^T Q e_theta - e_phi^T Q e_phi = (cos^2 iota + 1) cos theta!!
    # YES! With e1 = e_theta = (cos iota, 0, -sin iota) and e2 = e_phi = (0, 1, 0), e1 x e2 = +k_hat!
    kx, ky, kz = k_hat
    s_perp = math.hypot(kx, ky)
    if s_perp > 1e-12:
        e1 = [kx*kz/s_perp, ky*kz/s_perp, -s_perp]
        e2 = [-ky/s_perp, kx/s_perp, 0.0]
    else:
        e1 = [1.0, 0.0, 0.0]
        e2 = [0.0, 1.0 if kz > 0 else -1.0, 0.0]
    m = [(e1[i] + 1j*e2[i])/math.sqrt(2.0) for i in range(3)]
    ms = [x.conjugate() for x in m]
    return e1, e2, m, ms

def quad_form(u, Q, v):
    return sum(u[i] * Q[i][j] * v[j] for i in range(3) for j in range(3))

# Test our analytic formula for general random Q^{(0)}..Q^{(4)} and random k_hat!
random.seed(42)
for trial in range(5):
    # random unit vector k_hat
    v = [random.gauss(0,1) for _ in range(3)]
    vn = math.sqrt(sum(x*x for x in v))
    k_hat = [x/vn for x in v]
    e1, e2, m, ms = make_triad(k_hat)

    # random STF derivatives Q^{(0)}..Q^{(8)}
    Q_d = []
    for n in range(9):
        A = [[random.gauss(0,1) for _ in range(3)] for __ in range(3)]
        S = [[0.5*(A[i][j]+A[j][i]) for j in range(3)] for i in range(3)]
        tr = (S[0][0]+S[1][1]+S[2][2])/3.0
        for i in range(3): S[i][i] -= tr
        Q_d.append(S)

    # Analytic prediction of alpha_1, beta_2, gamma_3:
    # From our peeling table (with G = c = 1):
    # Wait: let's check exact coefficients in the unitary basis U = [m, m*, k_hat]!
    # Recall: e_+ + i e_x = (e1 e1^T - e2 e2^T) + i (e1 e2^T + e2 e1^T) = (e1 + i e2)(e1 + i e2)^T = 2 m m^T!
    # In the table: Q^{(4)}_+ * (-1) + Q^{(4)}_x * (+i) multiplied (e_+ + i e_x) = 2 m m^T.
    # Wait: ms^T Q ms = 1/2 (e1 - i e2)^T Q (e1 - i e2) = 1/2 (Q_{11} - Q_{22} - 2i Q_{12}) = Q_+ - i Q_x!
    # So -(Q_+ - i Q_x) (2 m m^T) = -2 (ms^T Q^{(4)} ms) m m^T!
    # Wait: let's check e_{xz} + i e_{yz} = (e1 k^T + k e1^T) + i (e2 k^T + k e2^T) = sqrt(2) (m k^T + k m^T)!
    # And ms^T Q k = 1/sqrt(2) (Q_{13} - i Q_{23}) => Q_{13} - i Q_{23} = sqrt(2) (ms^T Q k)!
    # In the table for r^-2 (Q^{(3)}): +2 (Q^{(3)}_{13} - i Q^{(3)}_{23}) (e_{xz} + i e_{yz})
    # = +2 * sqrt(2) (ms^T Q^{(3)} k) * sqrt(2) (m k^T + k m^T) = +4 (ms^T Q^{(3)} k) (m k^T + k m^T)!!
    # WAIT A SECOND! Look at that factor of sqrt(2)*sqrt(2) = 2:
    # Since (m^*)^T (m k^T + k m^T) k = 1, the (1, 3) entry in U^dag W U^* is +4 (ms^T Q^{(3)} k)!!
    # Let's check the (3, 3) entry for r^-3 (Q^{(2)}):
    # In the table: -3 (k^T Q^{(2)} k) * (3 k k^T - I) = -3 (k^T Q^{(2)} k) * (2 k k^T - m ms^T - ms m^T)!
    # So the (3, 3) entry in U^dag W U^* is -6 (k^T Q^{(2)} k), and the (1, 2) entry is +3 (k^T Q^{(2)} k)!
    alpha_1 = -2.0 * quad_form(ms, Q_d[4], ms)
    beta_2  = +4.0 * quad_form(ms, Q_d[3], k_hat)
    gamma_3 = -3.0 * quad_form(k_hat, Q_d[2], k_hat) # so (3,3) entry is 2*gamma_3 = -6 (k^T Q^{(2)} k)!

    pred_r2_s2_s1 = abs(2.0 * alpha_1 * gamma_3 - beta_2**2) / (abs(alpha_1)**2)

    # Numerical check at r = 1e4!
    r_big = 1e4
    _, _, W_num = eval_W_exact([r_big*k_hat[0], r_big*k_hat[1], r_big*k_hat[2]], Q_d)
    s1, s2, s3 = svdvals_3x3(W_num)
    num_r2_s2_s1 = (r_big**2) * (s2 / s1)
    print(f"Trial {trial}: analytic = {pred_r2_s2_s1:.10f}, numeric (r=1e4) = {num_r2_s2_s1:.10f}, rel_err = {abs(pred_r2_s2_s1-num_r2_s2_s1)/pred_r2_s2_s1:.2e}, r^4 s3/s1 = {(r_big**4)*(s3/s1):.6f}")

# NOW! Evaluate C(iota, theta) for the ROTATING MASS QUADRUPOLE!
# Rotating quadrupole in xy-plane:
# Q(u) = [[cos theta, sin theta, 0], [sin theta, -cos theta, 0], [0, 0, 0]] with theta = omega u (wave phase, omega = 2 Omega = c k).
# Let k_hat = (sin iota, 0, cos iota), so e1 = (cos iota, 0, -sin iota), e2 = (0, 1, 0), m = (e1 + i e2)/sqrt(2), ms = (e1 - i e2)/sqrt(2).
# Let's compute quad_form(ms, Q^{(4)}, ms), quad_form(ms, Q^{(3)}, k_hat), quad_form(k_hat, Q^{(2)}, k_hat) BY HAND and check in Python!
# With omega = 1 (so k = 1, derivatives: Q^{(4)} = +Q, Q^{(3)} = -Q^{(1)}, Q^{(2)} = -Q):
# Wait: Q(theta) = [[cos theta, sin theta, 0], [sin theta, -cos theta, 0], [0, 0, 0]]:
# Q^{(1)}(theta) = [[-sin theta, cos theta, 0], [cos theta, sin theta, 0], [0, 0, 0]]
# Q^{(2)}(theta) = -Q(theta)
# Q^{(3)}(theta) = -Q^{(1)}(theta)
# Q^{(4)}(theta) = +Q(theta).
# Now project onto e1 = (c_i, 0, -s_i), e2 = (0, 1, 0), k_hat = (s_i, 0, c_i) where c_i = cos(iota), s_i = sin(iota):
# 1) ms^T Q^{(4)} ms = 1/2 (e1 - i e2)^T Q (e1 - i e2)
#    e1^T Q e1 = c_i^2 cos(theta)
#    e2^T Q e2 = -cos(theta)
#    e1^T Q e2 = c_i sin(theta)
#    => ms^T Q^{(4)} ms = 1/2 [ (c_i^2 + 1) cos(theta) - 2 i c_i sin(theta) ]!
#    => alpha_1 = -2 ms^T Q^{(4)} ms = -(1 + c_i^2) cos(theta) + 2 i c_i sin(theta)!!
# 2) ms^T Q^{(3)} k_hat = - 1/sqrt(2) (e1 - i e2)^T Q^{(1)} k_hat
#    e1^T Q^{(1)} k_hat = c_i s_i (-sin theta)
#    e2^T Q^{(1)} k_hat = s_i (cos theta)
#    => ms^T Q^{(3)} k_hat = - (s_i / sqrt(2)) ( -c_i sin(theta) - i cos(theta) ) = +(s_i / sqrt(2)) (c_i sin(theta) + i cos(theta))!
#    => beta_2 = +4 ms^T Q^{(3)} k_hat = 2 sqrt(2) s_i (c_i sin(theta) + i cos(theta))!!
# 3) k_hat^T Q^{(2)} k_hat = - k_hat^T Q k_hat = - s_i^2 cos(theta)!
#    => gamma_3 = -3 k_hat^T Q^{(2)} k_hat = +3 s_i^2 cos(theta)!!
# NOW COMPUTE 2 alpha_1 gamma_3 - beta_2^2 ALGEBRAICALLY!!
#   2 alpha_1 gamma_3 = 2 [ -(1 + c_i^2) cos(theta) + 2 i c_i sin(theta) ] * [ 3 s_i^2 cos(theta) ]
#                     = s_i^2 [ -6 (1 + c_i^2) cos^2(theta) + 12 i c_i sin(theta) cos(theta) ]
#   beta_2^2          = 8 s_i^2 (c_i sin(theta) + i cos(theta))^2
#                     = s_i^2 [ 8 c_i^2 sin^2(theta) - 8 cos^2(theta) + 16 i c_i sin(theta) cos(theta) ]
#   SUBTRACT: 2 alpha_1 gamma_3 - beta_2^2
#     Real part / s_i^2 = (-6 - 6 c_i^2 + 8) cos^2(theta) - 8 c_i^2 sin^2(theta)
#                       = (2 - 6 c_i^2) cos^2(theta) - 8 c_i^2 sin^2(theta)!
#     Imag part / s_i^2 = (12 - 16) c_i sin(theta) cos(theta) = -4 c_i sin(theta) cos(theta)!!
#   WAIT A SECOND!! FACTOR OUT 2 s_i^2:
#     2 alpha_1 gamma_3 - beta_2^2 = 2 sin^2(iota) * [ (1 - 3 cos^2 iota) cos^2 theta - 4 cos^2 iota sin^2 theta - 2 i cos iota sin theta cos theta ]!!
#   WAIT A SECOND!! CAN THAT BRACKET FACTOR EVEN MORE?!
#   Check | (1 - 3 c^2) cos^2 t - 4 c^2 sin^2 t - 2 i c sin t cos t |^2 !!
#   Let's check at theta = 0 (cos t = 1, sin t = 0):
#     |2 alpha_1 gamma_3 - beta_2^2| = 2 sin^2(iota) |1 - 3 cos^2(iota)|!
#     |alpha_1|^2 = (1 + cos^2 iota)^2 cos^2(0) + 0 = (1 + cos^2 iota)^2!
#     SO AT theta = 0:
#     C(iota, 0) = 2 sin^2(iota) |1 - 3 cos^2(iota)| / (1 + cos^2(iota))^2 !!
#     TEST THIS AGAINST OUR PREVIOUS NUMBERS RIGHT NOW!!
#     - iota = 30 deg (c^2 = 3/4, s^2 = 1/4):
#       2 * (1/4) * |1 - 9/4| / (7/4)^2 = (1/2)*(5/4) / (49/16) = (5/8)*(16/49) = 10 / 49 = 0.20408163!!
#     - iota = 45 deg (c^2 = 1/2, s^2 = 1/2):
#       2 * (1/2) * |1 - 3/2| / (3/2)^2 = 1 * (1/2) / (9/4) = 2 / 9 = 0.22222222!!
#     - iota = 60 deg (c^2 = 1/4, s^2 = 3/4):
#       2 * (3/4) * |1 - 3/4| / (5/4)^2 = (3/2)*(1/4) / (25/16) = (3/8)*(16/25) = 6 / 25 = 0.24000000!!
#     - iota = 90 deg (c^2 = 0, s^2 = 1):
#       2 * 1 * |1 - 0| / 1^2 = 2!!
#     - MAGIC ANGLE cos^2(iota) = 1/3 (iota = 54.7356 deg, the nodal cone of P_2(cos iota)!):
#       C(54.7356 deg, 0) = 0!! (At theta = 0, s_2/s_1 drops to O((kr)^-3)!)
#   AND CHECK theta = 90 deg (cos t = 0, sin t = 1):
#     |2 alpha_1 gamma_3 - beta_2^2| = 2 sin^2(iota) * (4 cos^2 iota) = 8 sin^2(iota) cos^2(iota)!
#     |alpha_1|^2 = 4 cos^2(iota)!
#     C(iota, 90 deg) = 8 sin^2(iota) cos^2(iota) / (4 cos^2(iota)) = 2 sin^2(iota)!!
#     - iota = 30 deg: 2*(1/4) = 1/2!
#     - iota = 45 deg: 2*(1/2) = 1!
#     - iota = 60 deg: 2*(3/4) = 3/2!

print("\n=== VERIFYING EXACT CLOSED-FORM C(iota, theta) FOR ROTATING MASS QUADRUPOLE ===")
def C_rot_exact(iota, theta):
    ci = math.cos(iota)
    si = math.sin(iota)
    ct = math.cos(theta)
    st = math.sin(theta)
    re = (1.0 - 3.0*ci*ci)*ct*ct - 4.0*ci*ci*st*st
    im = -2.0*ci*st*ct
    num = 2.0 * si*si * math.hypot(re, im)
    den = (1.0 + ci*ci)**2 * ct*ct + 4.0*ci*ci*st*st
    return num / den

for iota_deg in [0, 15, 30, 45, 54.735610317245346, 60, 75, 90]:
    for theta_deg in [0, 30, 45, 60, 90]:
        if iota_deg == 90 and theta_deg == 90:
            continue
        iota = math.radians(iota_deg)
        theta = math.radians(theta_deg)
        k_hat = [math.sin(iota), 0.0, math.cos(iota)]
        r_big = 2e4
        _, _, W_num = eval_W_exact([r_big*k_hat[0], r_big*k_hat[1], r_big*k_hat[2]], rot_quad_derivs(theta, 1.0))
        s1, s2, s3 = svdvals_3x3(W_num)
        c_num = (r_big**2) * (s2 / s1)
        c_ana = C_rot_exact(iota, theta)
        if abs(c_num - c_ana) > 1e-6:
            print(f"MISMATCH at iota={iota_deg}, theta={theta_deg}: num={c_num}, ana={c_ana}")
        elif theta_deg in [0, 45, 90]:
            print(f"iota={iota_deg:8.4f} deg, theta={theta_deg:2d} deg: C_ana = {c_ana:.10f}, C_num(kr=2e4) = {c_num:.10f}, s3/s1*(kr)^4 = {(r_big**4)*(s3/s1):.6f}")
