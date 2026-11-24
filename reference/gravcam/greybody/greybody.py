"""Spin-two greybody factors of a Schwarzschild hole from the Regge-Wheeler equation (chapter 11.3).

Units G = M = c = 1, so x = GM omega / c^3 is omega. psi'' + (omega^2 - V) psi = 0 in the tortoise coordinate,
V = (1 - 2/r) (l(l+1)/r^2 - 6/r^3). Purely ingoing at the horizon, psi = exp(-i omega r*); integrate outward in r*
(carrying r along with dr/dr* = 1 - 2/r) to r_max, split into WKB in- and out-going waves there, and
Gamma = omega / |A_in|^2 (horizon flux omega over the incoming flux). Flux conservation |A_in|^2 - |A_out|^2 = omega
is printed as a check.
"""
import numpy as np
from scipy.integrate import solve_ivp


def V(r, l):
    return (1 - 2 / r) * (l * (l + 1) / r**2 - 6 / r**3)


def gamma(l, w, rmax_fac=3000.0, rtol=1e-11, check=False):
    # start where V << w^2: V ~ (r-2)/2 * (l(l+1)/4 - 6/8) near r = 2
    d = 1e-3 * w**2 / max(1.0, l * l)
    r0 = 2 + 2 * d / (1.0)  # r - 2 = 2d
    rs0 = r0 + 2 * np.log(r0 / 2 - 1)
    psi0 = np.exp(-1j * w * rs0)
    dpsi0 = -1j * w * psi0
    rmax = max(rmax_fac / w, 0.1 * rmax_fac * (l + 1) / w, 50.0)

    def rhs(t, y):
        r = y[0].real
        f = 1 - 2 / r
        return [f + 0j, y[2], (V(r, l) - w * w) * y[1]]

    def stop(t, y):
        return y[0].real - rmax
    stop.terminal = True
    sol = solve_ivp(rhs, [rs0, rs0 + 10 * rmax + 1e3], [r0 + 0j, psi0, dpsi0], method='DOP853', rtol=rtol,
                    atol=1e-14 * abs(psi0), events=stop, max_step=0.5 / w if w > 0 else np.inf)
    r, psi, dpsi = sol.y[0, -1].real, sol.y[1, -1], sol.y[2, -1]
    k = np.sqrt(w * w - V(r, l))
    # psi = (Ain e^{-i phi} + Aout e^{i phi}) / sqrt(k), dpsi ~ i k (-Ain e^{-i phi} + Aout e^{i phi}) / sqrt(k), phi = 0
    Ain = np.sqrt(k) * (psi - dpsi / (1j * k)) / 2
    Aout = np.sqrt(k) * (psi + dpsi / (1j * k)) / 2
    G = w / abs(Ain)**2
    if check:
        return G, (abs(Ain)**2 - abs(Aout)**2) / w - 1
    return G


if __name__ == '__main__':
    for w in (0.002, 0.005, 0.01, 0.05, 0.1, 0.3):
        g, err = gamma(2, w, check=True)
        page = 256 / 225 * w**6
        print(f'l=2 x={w}: Gamma={g:.5g}  Page={page:.5g}  ratio={g / page:.4f}  flux err={err:.1e}'
              f'  4pi x/(1-e^-4pi x)={4*np.pi*w/(1-np.exp(-4*np.pi*w)):.4f}')
    for l in (2, 3, 4):
        for w in (0.3, 0.5, 0.8, 1.0):
            g, err = gamma(l, w, check=True)
            print(f'l={l} x={w}: Gamma={g:.4f} flux err={err:.1e}')
