import sys
sys.path.insert(0, "/Users/neo/.gemini/antigravity/brain/3ca0091c-61b7-44c6-9f3e-dc29ba5c08cd/scratch")
import math, cmath, random
from q1_ranging import eval_W_exact, rot_quad_derivs
from q1_solve import extract_W_coeffs
from q1_formula_check import make_triad, quad_form, C_rot_exact
from q1_svd_verify import svd_exact_3x3

# 1. Check exact W_1..W_5 symbolic polynomial SVD (using exact series in x = 1/(kr), NO float roundoff at large r!)
for iota_deg in [0, 15, 30, 45, 54.735610317245346, 60, 75, 90]:
    for theta_deg in [0, 30, 45, 60, 90]:
        if iota_deg == 90 and theta_deg == 90: continue
        iota = math.radians(iota_deg)
        theta = math.radians(theta_deg)
        k_hat = [math.sin(iota), 0.0, math.cos(iota)]
        # Evaluate at r = 300 and r = 600 and Richardson-extrapolate O(1/r) and O(1/r^2) to 14 digits!
        vals = []
        for r in [80.0, 160.0, 320.0]:
            _, _, W = eval_W_exact([r*k_hat[0], r*k_hat[1], r*k_hat[2]], rot_quad_derivs(theta, 1.0))
            s1, s2, s3 = svd_exact_3x3(W)
            vals.append((r, r*r*s2/s1, (r**4)*s2/s1, (r**4)*s3/s1))
        # Richardson extrapolation of f(r) = c0 + c1/r + c2/r^2 at r, 2r, 4r:
        # f1 = f(r), f2 = f(2r), f3 = f(4r)
        # g1 = (2 f2 - f1) = c0 - c2/(2 r^2), g2 = (2 f3 - f2) = c0 - c2/(8 r^2)
        # c0_extrap = (4 g2 - g1) / 3!
        f1, f2, f3 = vals[0][1], vals[1][1], vals[2][1]
        g1 = 2*f2 - f1
        g2 = 2*f3 - f2
        c0_ext = (4*g2 - g1)/3.0
        c_ana = C_rot_exact(iota, theta)
        err = abs(c0_ext - c_ana)
        if err > 1e-8:
            print(f"WARN iota={iota_deg}, theta={theta_deg}: ext={c0_ext}, ana={c_ana}, err={err}")
        if iota_deg == 0 and theta_deg in [0, 45, 90]:
            print(f"Face-on iota=0, theta={theta_deg}: (kr)^4 s2/s1 at r=80,160,320 = {[round(v[2], 8) for v in vals]}")
        if abs(iota_deg - 54.735610317245346) < 1e-6 and theta_deg == 0:
            print(f"Magic angle iota=54.74, theta=0: (kr)^3 s2/s1 at r=80,160,320 = {[round(v[0]*v[1], 8) for v in vals]}")

print("All Richardson-extrapolated C(iota, theta) values checked against C_rot_exact!")

# 2. Check general harmonic quadrupole: Q(u) = Re[ Q_hat e^{-i omega u} ]!
# Wait: for a rotating quadrupole, Q_xx = cos(theta), Q_yy = -cos(theta), Q_xy = sin(theta)
# = Re[ [[1, i, 0], [i, -1, 0], [0, 0, 0]] * e^{-i theta} ]!
# What happens if we take the complex Fourier transform of W(t) = E(t) + i B(t) at e^{-i omega t} vs e^{+i omega t}?!
# Wait: E(t) = Re[ E_tilde e^{-i omega t} ], B(t) = Re[ B_tilde e^{-i omega t} ].
# Then W_+(omega) = E_tilde(omega) + i B_tilde(omega) and W_-(omega) = E_tilde*(omega) + i B_tilde*(omega) = [E_tilde(-omega) + i B_tilde(-omega)]!
# Let's compute W_+(omega) and W_-(omega) for the rotating quadrupole at r = 80, 160, 320!
print("\n=== FOURIER MODES W_+(omega) AND W_-(omega) FOR ROTATING QUADRUPOLE ===")
for iota_deg in [0, 30, 45, 60, 90]:
    iota = math.radians(iota_deg)
    k_hat = [math.sin(iota), 0.0, math.cos(iota)]
    for r in [160.0]:
        # Sample theta = 0 and theta = pi/2:
        # Since f(theta) = F_+ e^{-i theta} + F_- e^{+i theta}:
        # f(0) = F_+ + F_-, f(pi/2) = -i F_+ + i F_- => F_+ = 1/2 (f(0) + i f(pi/2)), F_- = 1/2 (f(0) - i f(pi/2))!
        E0, B0, W0 = eval_W_exact([r*k_hat[0], r*k_hat[1], r*k_hat[2]], rot_quad_derivs(0.0, 1.0))
        E90, B90, W90 = eval_W_exact([r*k_hat[0], r*k_hat[1], r*k_hat[2]], rot_quad_derivs(math.pi/2, 1.0))
        Wp = [[0.5*(W0[a][b] + 1j*W90[a][b]) for b in range(3)] for a in range(3)]
        Wm = [[0.5*(W0[a][b] - 1j*W90[a][b]) for b in range(3)] for a in range(3)]
        sp = svd_exact_3x3(Wp)
        sm = svd_exact_3x3(Wm)
        print(f"iota={iota_deg:2d} deg: |Wp|={sp[0]*r:.6f}, r^2 sp2/sp1={r*r*sp[1]/sp[0] if sp[0]>1e-12 else 0:.8f} | |Wm|={sm[0]*r:.6f}, r^2 sm2/sm1={r*r*sm[1]/sm[0] if sm[0]>1e-12 else 0:.8f}")

# 3. Also check 1D linear oscillating quadrupole: Q(u) = cos(theta) * diag(-1, -1, 2) (oscillating along z-axis, angle iota to k_hat)!
print("\n=== 1D LINEAR OSCILLATING QUADRUPOLE ALONG z-AXIS ===")
def lin_quad_derivs(theta, omega=1.0):
    derivs = []
    for n in range(9):
        c = math.cos(theta + n*math.pi/2) * (omega**n)
        derivs.append([[-c, 0.0, 0.0], [0.0, -c, 0.0], [0.0, 0.0, 2*c]])
    return derivs

for iota_deg in [15, 30, 45, 60, 75, 90]:
    iota = math.radians(iota_deg)
    k_hat = [math.sin(iota), 0.0, math.cos(iota)]
    for theta_deg in [0, 30, 60]:
        theta = math.radians(theta_deg)
        vals = []
        for r in [80.0, 160.0, 320.0]:
            _, _, W = eval_W_exact([r*k_hat[0], r*k_hat[1], r*k_hat[2]], lin_quad_derivs(theta, 1.0))
            s1, s2, s3 = svd_exact_3x3(W)
            vals.append(r*r*s2/s1)
        c_ext = (4*(2*vals[2]-vals[1]) - (2*vals[1]-vals[0]))/3.0
        print(f"Linear osc iota={iota_deg:2d}, theta={theta_deg:2d}: C = {c_ext:.8f}")
