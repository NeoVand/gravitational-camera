import sys
sys.path.insert(0, "/Users/neo/.gemini/antigravity/brain/3ca0091c-61b7-44c6-9f3e-dc29ba5c08cd/scratch")
import math, cmath, random
from q2_spectral_v2 import q_vec, qr_col_pivoting_rank, pack_hermitian_5x5, pack_full_10x10

random.seed(12345)

print("=== (c) FIXED 100% POLARIZED SOURCES (e.g. binaries): 5K params (theta, phi, I, iota, psi) -> 68 sky numbers ===")
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
            fp_amp = 0.5*(1 + ci)**2
            fm_amp = 0.5*(1 - ci)**2
            norm = fp_amp**2 + fm_amp**2
            ap = math.sqrt(Ia / norm) * fp_amp * cmath.exp(-2j*ps)
            am = math.sqrt(Ia / norm) * fm_amp * cmath.exp(+2j*ps)
            q = q_vec(th, ph)
            for i in range(5):
                for j in range(5):
                    # w_+ = ap * q, w_- = am * q^* => w_+ w_-^dag = (ap * am^*) q q^T !!
                    Spp[i][j] += (ap * q[i]) * (ap * q[j]).conjugate()
                    Smm[i][j] += (am * q[i].conjugate()) * (am * q[j].conjugate()).conjugate()
                    Spm[i][j] += (ap * am.conjugate()) * q[i] * q[j]
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

print("\n=== (d) CIRCULARLY POLARIZED / ZERO-LINEAR-POL SOURCES: 4K params (theta, phi, I, V) -> 50 sky numbers (S_++, S_--) ===")
for K in range(1, 15):
    params = []
    for _ in range(K):
        params.extend([math.acos(random.uniform(-0.9, 0.9)), random.uniform(0.1, 6.0),
                       random.uniform(1.0, 2.0), random.uniform(-0.8, 0.8)])
    def eval_d(p):
        Spp = [[0j]*5 for _ in range(5)]
        Smm = [[0j]*5 for _ in range(5)]
        for a in range(K):
            th, ph, Ia, Va = p[4*a:4*a+4]
            q = q_vec(th, ph)
            for i in range(5):
                for j in range(5):
                    Spp[i][j] += 0.5*(Ia + Va) * q[i] * q[j].conjugate()
                    Smm[i][j] += 0.5*(Ia - Va) * q[i].conjugate() * q[j]
        return pack_hermitian_5x5(Spp) + pack_hermitian_5x5(Smm)
    eps = 1e-7
    cols = []
    for idx in range(len(params)):
        pp, pm = params[:], params[:]
        pp[idx] += eps; pm[idx] -= eps
        fp, fm = eval_d(pp), eval_d(pm)
        cols.append([(fp[r]-fm[r])/(2*eps) for r in range(len(fp))])
    J = [[cols[c][r] for c in range(len(cols))] for r in range(len(cols[0]))]
    rk, dr = qr_col_pivoting_rank(J)
    print(f"K={K:2d}: 4K={4*K:2d}, rank={rk:2d}, last_R={dr[-1]:.3e}")

# ALSO CHECK SPIN-1 LIGHT FOR EXACT COMPARISON!
# For spin-1 light: F = E + i B in C^3 (not C^5!), so q_light(theta, phi) = m(theta, phi) in C^3!
# Sky content: 2*(3)^2 + 2*(5) = 18 + 10 = 28 out of 36!
# Specifically: S_++ is 3x3 Hermitian (9 real), S_-- is 3x3 Hermitian (9 real), S_+- = sum (Q - i U) m m^T is 3x3 complex symmetric traceless (5 complex = 10 real)!
print("\n=== SPIN-1 LIGHT COMPARISON ===")
def q_light(theta, phi):
    ct, st = math.cos(theta), math.sin(theta)
    cp, sp = math.cos(phi), math.sin(phi)
    e1 = [ct*cp, ct*sp, -st]
    e2 = [-sp, cp, 0.0]
    return [(e1[i] + 1j*e2[i])/math.sqrt(2.0) for i in range(3)]

def pack_herm_3x3(H):
    out = []
    for i in range(3):
        out.append(H[i][i].real)
        for j in range(i+1, 3):
            out.append(math.sqrt(2)*H[i][j].real)
            out.append(math.sqrt(2)*H[i][j].imag)
    return out

for K in range(1, 5):
    params = [math.acos(random.uniform(-0.9, 0.9)) if i%3==0 else (random.uniform(0.1,6.0) if i%3==1 else random.uniform(0.5,2.0)) for i in range(3*K)]
    def eval_la(p):
        H = [[0j]*3 for _ in range(3)]
        for a in range(K):
            th, ph, Ia = p[3*a:3*a+3]
            q = q_light(th, ph)
            for i in range(3):
                for j in range(3): H[i][j] += Ia * q[i]*q[j].conjugate()
        return pack_herm_3x3(H)
    cols = []
    for idx in range(len(params)):
        pp, pm = params[:], params[:]
        pp[idx] += 1e-7; pm[idx] -= 1e-7
        fp, fm = eval_la(pp), eval_la(pm)
        cols.append([(fp[r]-fm[r])/2e-7 for r in range(len(fp))])
    J = [[cols[c][r] for c in range(len(cols))] for r in range(len(cols[0]))]
    rk, _ = qr_col_pivoting_rank(J)
    print(f"Light unpolarized K={K}: 3K={3*K:2d}, rank={rk:2d} (out of 9)")
