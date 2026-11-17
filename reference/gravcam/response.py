"""What heat and a push reveal (paper, Section IV, "What heat reveals"): the near field of a body's thermal motion,
its response to an applied tide, a thermometer that needs no model of the body, and the other gravitational cameras.

The identity at the centre. For any smooth functions h, g of position, let q_h = sum_a m_a h(x_a). In classical
thermal equilibrium the velocities are independent of the positions and of each other, with <v_a v_b> = kT/m_a, so

    <qdot_h qdot_g> = kT sum_a m_a grad h(x_a) . grad g(x_a) = kT  int rho grad h . grad g dV,

exactly, whatever the forces between the particles (as long as they do not depend on velocity). For h harmonic, q_h
is a multipole moment that the camera reads from the field outside the body; for h = r^l Y_lm, summed over m,

    sum_m <|qdot_lm|^2> = kT l (2l+1)^2 / (4 pi)  int rho r^(2l-2) dV,

so the dipole gives the mass (Brownian motion), the quadrupole the second moment int rho r^2 dV that the static field
cannot see, and so on. By the fluctuation-dissipation theorem the same sum is the inertial sum rule of the response,
(2/pi) int omega Im chi(omega) d omega, which a calibrated push measures at any temperature.

Here: a lattice solid (a ball or a shell of point masses joined by springs) whose normal modes give the spectrum
directly; the paper's illustrative steel ball; Love numbers; the conjugate drive that makes the pixel a thermometer;
the cut-off of clock, accelerometer and tidal cameras; and the cost of distance.
"""
from __future__ import annotations

import math

import numpy as np

from .constants import G, c, hbar, kB

# --- the lattice solid --------------------------------------------------------------------------------------------


def lattice_body(radius: float, inner: float = 0.0, k1: float = 1.0, k2: float = 0.5, total_mass: float = 1.0):
    """A simple-cubic lattice of unit spacing, the sites with inner < |r| <= radius, joined by springs to nearest
    (stiffness k1) and next-nearest (k2) neighbours, which makes it a stable elastic solid. The masses are equal and
    add to total_mass; the centre of mass is at the origin. Returns (positions (N,3), masses (N,), stiffness (3N,3N))."""
    n = int(math.ceil(radius))
    u = np.arange(-n, n + 1, dtype=float)
    X, Y, Z = np.meshgrid(u, u, u, indexing="ij")
    p = np.stack([X.ravel(), Y.ravel(), Z.ravel()], axis=1)
    r = np.linalg.norm(p, axis=1)
    p = p[(r <= radius + 1e-9) & (r > inner + 1e-9)]
    N = len(p)
    m = np.full(N, total_mass / N)
    K = np.zeros((3 * N, 3 * N))
    index = {tuple(map(int, q)): i for i, q in enumerate(p)}
    bonds = [((1, 0, 0), k1), ((0, 1, 0), k1), ((0, 0, 1), k1)]
    bonds += [((1, s, 0), k2) for s in (1, -1)] + [((1, 0, s), k2) for s in (1, -1)] + [((0, 1, s), k2) for s in (1, -1)]
    for i, q in enumerate(p):
        for d, k in bonds:
            j = index.get((int(q[0]) + d[0], int(q[1]) + d[1], int(q[2]) + d[2]))
            if j is None:
                continue
            e = np.array(d, dtype=float) / np.linalg.norm(d)
            B = k * np.outer(e, e)
            K[3 * i:3 * i + 3, 3 * i:3 * i + 3] += B
            K[3 * j:3 * j + 3, 3 * j:3 * j + 3] += B
            K[3 * i:3 * i + 3, 3 * j:3 * j + 3] -= B
            K[3 * j:3 * j + 3, 3 * i:3 * i + 3] -= B
    return p, m, K


def normal_modes(m: np.ndarray, K: np.ndarray):
    """Angular frequencies squared and mass-weighted mode shapes (columns), from M^-1/2 K M^-1/2."""
    s = 1.0 / np.sqrt(np.repeat(m, 3))
    w2, vecs = np.linalg.eigh(K * s[:, None] * s[None, :])
    return np.clip(w2, 0.0, None), vecs


def multipole_couplings(p: np.ndarray, m: np.ndarray, vecs: np.ndarray, grad_h: np.ndarray) -> np.ndarray:
    """How strongly each normal mode moves q_h = sum m h(x): with u_a = sum_n Q_n e_na / sqrt(m_a), the linear change
    is dq_h = sum_n c_n Q_n, c_n = sum_a sqrt(m_a) grad h(x_a) . e_na. grad_h is (N, 3) at the sites."""
    weighted = (np.sqrt(m)[:, None] * grad_h).reshape(-1)
    return weighted @ vecs


def quadrupole_gradient(p: np.ndarray, U: np.ndarray) -> np.ndarray:
    """grad of h = r^T U r, for a symmetric trace-free U: 2 U r."""
    return 2.0 * p @ U


def thermal_moments(w2: np.ndarray, couplings: np.ndarray, T: float = 1.0, k_B: float = 1.0) -> dict:
    """Classical thermal moments of q_h from its normal-mode couplings: <qdot^2> = kT sum c^2 (the inertial sum rule),
    <q^2> = kT sum c^2 / omega^2 (the static compliance, which is the Love number), excluding modes of zero frequency."""
    c2 = couplings**2
    live = w2 > 1e-10 * w2.max()
    return {
        "rate": k_B * T * float(c2.sum()),
        "rate_moving": k_B * T * float(c2[live].sum()),
        "variance": k_B * T * float((c2[live] / w2[live]).sum()),
        "weights": c2,
    }


def second_moment(p: np.ndarray, m: np.ndarray) -> float:
    """int rho r^2 dV of the lattice about its centre of mass."""
    p = p - (m @ p) / m.sum()
    return float(m @ (p**2).sum(axis=1))


# --- the paper's numbers -----------------------------------------------------------------------------------------


def radial_moment_sum(l: int, T: float, moment: float) -> float:
    """sum_m <|qdot_lm|^2> for h = r^l Y_lm (orthonormal harmonics), given moment = int rho r^(2l-2) dV."""
    return kB * T * l * (2 * l + 1) ** 2 / (4 * math.pi) * moment


def ball_moment(M: float, R: float, n: int) -> float:
    """int rho r^n dV for a uniform ball."""
    return 3 * M * R**n / (n + 3)


def shell_moment(M: float, R: float, n: int) -> float:
    """int rho r^n dV for a thin shell."""
    return M * R**n


def rayleigh_ball(R: float = 0.10, rho: float = 7800.0, cT: float = 3000.0, T: float = 300.0, r: float = 1.0) -> dict:
    """The illustrative steel ball: one quadrupole coordinate q, the displacement u = (q / R)(-x/2, -y/2, z), which
    has no divergence and moves only the surface. Kinetic and elastic energies give the effective mass and stiffness;
    equipartition the jitter; the quadrupole formula the field on the axis and the gravitons the mode radiates."""
    V = 4 * math.pi * R**3 / 3
    M = rho * V
    mu = rho * cT**2
    m_eff = 3 * M / 10
    K = 3 * mu * V / R**2
    w0 = math.sqrt(K / m_eff)
    q_rms = math.sqrt(kB * T / K)
    E_axis = 36 * G * M * R * q_rms / (5 * r**5)
    P = 6 * G * M**2 * R**2 * w0**6 * q_rms**2 / (125 * c**5)
    rate = P / (hbar * w0)
    return {
        "M": M, "m_eff": m_eff, "K": K, "f0": w0 / (2 * math.pi), "q_rms": q_rms, "E_axis": E_axis,
        "power": P, "gravitons_per_s": rate, "years_per_graviton": 1 / rate / 3.15576e7,
        "occupation": kB * T / (hbar * w0),
    }


def love_k2(rho: float, mu: float, R: float) -> float:
    """Love number k2 of a uniform incompressible elastic ball under its own gravity (Kelvin, Love):
    k2 = (3/2) / (1 + 19 mu / (2 rho g R)), g = G M / R^2."""
    g = G * rho * 4 * math.pi * R / 3
    return 1.5 / (1 + 19 * mu / (2 * rho * g * R))


def tidal_deformability(k2: float, R: float) -> float:
    """lambda in Q_ij = -lambda E_ij (Q the trace-free second moment): lambda = 2 k2 R^5 / (3 G)."""
    return 2 * k2 * R**5 / (3 * G)


# --- the conjugate drive: a pixel that is a thermometer ----------------------------------------------------------


def shell_drive_density(n: np.ndarray, D: np.ndarray, f: float, a: float) -> np.ndarray:
    """Surface density added to a thin shell of radius a about the pixel, -15 f n.D.n / (4 pi a^4), whose
    interaction with any mass outside the shell is exactly -f D:E(pixel)."""
    return -15 * f * np.einsum("...i,ij,...j->...", n, D, n) / (4 * math.pi * a**4)


def sphere_quadrature(n_mu: int = 24, n_phi: int = 48):
    """Gauss-Legendre in cos(theta) times the trapezoid in phi: points (k, 3) and weights summing to 4 pi."""
    mu, wm = np.polynomial.legendre.leggauss(n_mu)
    phi = np.arange(n_phi) * 2 * math.pi / n_phi
    MU, PHI = np.meshgrid(mu, phi, indexing="ij")
    s = np.sqrt(1 - MU**2)
    pts = np.stack([s * np.cos(PHI), s * np.sin(PHI), MU], axis=-1).reshape(-1, 3)
    w = (wm[:, None] * np.full(n_phi, 2 * math.pi / n_phi)[None, :]).reshape(-1)
    return pts, w


def potential_of_points(x: np.ndarray, sources: np.ndarray, masses: np.ndarray) -> np.ndarray:
    d = np.linalg.norm(x[:, None, :] - sources[None, :, :], axis=-1)
    return -G * (masses[None, :] / d).sum(axis=1)


def tidal_of_points(x0: np.ndarray, sources: np.ndarray, masses: np.ndarray) -> np.ndarray:
    """E_ij = d_i d_j Phi at x0 from point masses."""
    E = np.zeros((3, 3))
    for s, mm in zip(sources, masses):
        d = x0 - s
        r = np.linalg.norm(d)
        E += G * mm * (np.eye(3) / r**3 - 3 * np.outer(d, d) / r**5)
    return E


def thermometer(omega: np.ndarray, S_yy: np.ndarray, im_chi_yy: np.ndarray) -> np.ndarray:
    """T from the reading's noise and its conjugate response: T = omega S_yy / (2 kB Im chi_yy)."""
    return omega * S_yy / (2 * kB * im_chi_yy)


def mode_response(omega, w0, gamma, m_eff, coupling_in, coupling_out):
    """chi of the readout k.q to the force b f for independent damped modes: sum k_n b_n / m (w0^2 - w^2 - i g w)."""
    omega = np.asarray(omega, dtype=float)[:, None]
    return (coupling_out * coupling_in / (m_eff * (w0**2 - omega**2 - 1j * gamma * omega))).sum(axis=1)


def mode_noise(omega, w0, gamma, m_eff, coupling_out, T):
    """The classical noise spectrum of the readout, S = (2 kB T / omega) Im chi (the fluctuation-dissipation
    theorem), for the same modes."""
    chi = mode_response(omega, w0, gamma, m_eff, coupling_out, coupling_out)
    return 2 * kB * T / np.asarray(omega) * chi.imag


# --- the quantum ceiling on the jitter --------------------------------------------------------------------------


def jitter_bounds(chi0: float, A: float, T: float) -> tuple[float, float]:
    """kT chi0 <= <dq^2> <= (hbar/2) sqrt(A chi0) coth(hbar sqrt(A/chi0) / 2 kT), for a passive response with static
    compliance chi0 and inertial sum A (Jensen's inequality on the concave sqrt(x) coth(b sqrt(x)))."""
    W = math.sqrt(A / chi0)
    b = hbar / (2 * kB * T)
    return kB * T * chi0, 0.5 * hbar * math.sqrt(A * chi0) / math.tanh(b * W)


def quantum_jitter(chi0_weights: np.ndarray, omegas: np.ndarray, T: float) -> float:
    """<dq^2> = sum_n (hbar w_n / 2) coth(hbar w_n / 2 kT) chi_n, for modes of static compliance chi_n."""
    x = hbar * omegas / (2 * kB * T)
    return float((chi0_weights * hbar * omegas / 2 / np.tanh(x)).sum())


# --- the other gravitational cameras -----------------------------------------------------------------------------


def cutoff(snr: float, p: int) -> float:
    """The cut-off q_c of a camera whose Fourier kernel over a sheet goes as q^p e^-q: q^p e^-q = 1 / (pi SNR).
    p = -1 for clocks (the potential), 0 for accelerometers (its gradient), 1 for the tidal camera."""
    target = math.log(math.pi * snr)
    q = max(target, 1.0)
    for _ in range(100):
        q_new = target + p * math.log(q)
        if abs(q_new - q) < 1e-13 * q:
            break
        q = q_new
    return q


def blur_deg(snr: float) -> float:
    """The tidal camera's blur 4.43 / q_c (Eq. resolution), in degrees."""
    return math.degrees(4.43 / cutoff(snr, 1))


def gentle_ceiling(snr_ceiling: float, z: float = 3.0, g_max: float = 9.81) -> float:
    """The heuristic ceiling on SNR, M_s c^2 tau / hbar, lowered by asking the camera to pull on the scene no harder
    than g_max instead of only not being a black hole: its interaction energy falls from M_s c^2 / 2 to M_s g z."""
    return snr_ceiling * g_max * z / (c**2 / 2)


def distance_cost(r1: float, r2: float) -> float:
    """Observing time to keep the same precision on a quadrupole's fluctuations, weak signal, fixed noise:
    Fisher information goes as r^-20, so time as r^20."""
    return (r2 / r1) ** 20
