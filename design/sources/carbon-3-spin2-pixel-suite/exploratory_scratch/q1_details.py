import sys
sys.path.insert(0, "/Users/neo/.gemini/antigravity/brain/3ca0091c-61b7-44c6-9f3e-dc29ba5c08cd/scratch")
import math
from q1_ranging import eval_W_exact, rot_quad_derivs
from q1_complete import lin_quad_derivs
from q1_svd_verify import svd_exact_3x3

# 1. Check face-on (iota = 0) exact scaling with kr at moderate kr = 5, 10, 20, 40!
print("=== FACE-ON (iota = 0) EXACT SCALING ===")
for theta_deg in [0, 23, 45, 90]:
    theta = math.radians(theta_deg)
    for r in [5.0, 10.0, 20.0, 40.0]:
        _, _, W = eval_W_exact([0.0, 0.0, r], rot_quad_derivs(theta, 1.0))
        s1, s2, s3 = svd_exact_3x3(W)
        print(f"theta={theta_deg:2d}, kr={r:4.0f}: (kr)^4 s2/s1 = {(r**4)*s2/s1:.10f}, s3 = {s3:.2e}")

# Wait: why was (kr)^4 s2/s1 = 3/2 = 1.5?! Let's see what Python prints!

# 2. Check 1D linear oscillating quadrupole Q(u) = cos(theta) * diag(-1, -1, 2) exact formula!
# Here Q^{(4)} = +Q, Q^{(3)} = +sin(theta) diag(-1,-1,2), Q^{(2)} = -Q!
# Let k_hat = (sin iota, 0, cos iota), e1 = (cos iota, 0, -sin iota), e2 = (0, 1, 0):
# e1^T diag(-1,-1,2) e1 = -cos^2 iota + 2 sin^2 iota = 3 sin^2 iota - 1? Wait: -c^2 + 2 s^2 = 3 s^2 - 1? At s=0: -1. Yes!
# e2^T diag(-1,-1,2) e2 = -1!
# So ms^T Q ms = 1/2 (e1^T Q e1 - e2^T Q e2) = 1/2 (3 sin^2 iota - 1 - (-1)) cos theta = (3/2) sin^2(iota) cos(theta)!
# e1^T diag(-1,-1,2) k_hat = cos(iota) sin(iota) (-1) + (-sin iota)(cos iota)(2) = -3 sin(iota) cos(iota)!
# So Q^{(3)}_{ms, k} = (1/sqrt(2)) (-3 sin iota cos iota) (-sin theta) = +(3/sqrt(2)) sin(iota) cos(iota) sin(theta)!
# Note d/du cos(theta) = -sin(theta), d^3/du^3 cos(theta) = +sin(theta)! Wait: cos^{(3)} = +sin!
# So Q^{(3)}_{ms, k} = -(3/sqrt(2)) sin(iota) cos(iota) sin(theta). (Square doesn't care about sign!)
# And Q^{(2)}_{k, k} = -cos(theta) (-sin^2 iota + 2 cos^2 iota) = -cos(theta) (3 cos^2 iota - 1)!
# Plug into |3 Q^{(4)}_{ms,ms} Q^{(2)}_{k,k} - 4 (Q^{(3)}_{ms,k})^2| / |Q^{(4)}_{ms,ms}|^2:
# Numerator = | 3 * (3/2 s^2 cos t) * (-(3 c^2 - 1) cos t) - 4 * (9/2 s^2 c^2 sin^2 t) |
#           = (9/2) s^2 | (3 c^2 - 1) cos^2 t + 4 c^2 sin^2 t | !!
# Denominator = (9/4) s^4 cos^2 t !!
# RATIO C_lin(iota, theta) = 2 * | (3 cos^2 iota - 1) + 4 cos^2 iota tan^2 theta | / sin^2(iota) !!
# CHECK AGAINST q1_complete.py OUTPUT:
# - theta = 0: 2 |3 cos^2 iota - 1| / sin^2 iota:
#   iota = 30 (c^2=3/4, s^2=1/4): 2*(5/4)/(1/4) = 10!! MATCHED 9.999984!
#   iota = 45 (c^2=1/2, s^2=1/2): 2*(1/2)/(1/2) = 2!! MATCHED 2.000001!
#   iota = 60 (c^2=1/4, s^2=3/4): 2*(1/4)/(3/4) = 2/3!! MATCHED 0.666666!
#   iota = 90 (c^2=0, s^2=1):     2*(1)/1 = 2!! MATCHED 2.000000!
# - iota = 30, theta = 30 (tan^2 = 1/3): 2*(5/4 + 4*(3/4)*(1/3))/(1/4) = 8*(9/4) = 18!! MATCHED 18.0008!
# - iota = 45, theta = 30 (tan^2 = 1/3): 2*(1/2 + 2/3)/(1/2) = 4*(7/6) = 14/3 = 4.666667!! MATCHED 4.66669!

print("\n=== VERIFY C_lin(iota, theta) AND FOURIER C_±(iota) ===")
for iota_deg in [15, 30, 45, 60, 75, 90]:
    iota = math.radians(iota_deg)
    k_hat = [math.sin(iota), 0.0, math.cos(iota)]
    vals_p, vals_m = [], []
    for r in [40.0, 80.0, 160.0]:
        _, _, W0 = eval_W_exact([r*k_hat[0], r*k_hat[1], r*k_hat[2]], rot_quad_derivs(0.0, 1.0))
        _, _, W90 = eval_W_exact([r*k_hat[0], r*k_hat[1], r*k_hat[2]], rot_quad_derivs(math.pi/2, 1.0))
        Wp = [[0.5*(W0[a][b] + 1j*W90[a][b]) for b in range(3)] for a in range(3)]
        Wm = [[0.5*(W0[a][b] - 1j*W90[a][b]) for b in range(3)] for a in range(3)]
        sp = svd_exact_3x3(Wp)
        sm = svd_exact_3x3(Wm)
        vals_p.append(r*r*sp[1]/sp[0])
        vals_m.append(r*r*sm[1]/sm[0])
    ext_p = (4*(2*vals_p[2]-vals_p[1]) - (2*vals_p[1]-vals_p[0]))/3.0
    ext_m = (4*(2*vals_m[2]-vals_m[1]) - (2*vals_m[1]-vals_m[0]))/3.0
    ana_p = 2.0 * (math.tan(iota/2.0)**2)
    ana_m = 2.0 / (math.tan(iota/2.0)**2)
    print(f"iota={iota_deg:2d}: C_+(ext)={ext_p:.10f} vs 2 tan^2(i/2)={ana_p:.10f} | C_-(ext)={ext_m:.10f} vs 2 cot^2(i/2)={ana_m:.10f}")
