// Shared mathematics for the four diagrams of the tutorial's section 4.1 (tutorial/response/oscillator.md):
// tut-osc-hero, tut-osc-ringdown, tut-osc-response and tut-osc-phasors. Not a figure itself. The cart of section 1.7
// with friction, in the chapter's letters: m q'' + m Gamma q' + k q = F, the response chi(omega) =
// 1 / m (omega0^2 - omega^2 - i Gamma omega) (eq:chi), its ring-down and its line; and the steel ball of Appendix A,
// its trial shape u = (q/R)(-x/2, -y/2, z), its stiffness 3 mu V / R^2, its thermal swing and the tide of its
// quadrupole. `cart(check)` and `ball(check)` assert every number of the chapter that a diagram draws.

// ---- the cart -------------------------------------------------------------------------------------------------
export const MASS = 2;                    // kg
export const STIFF = 50;                  // N/m
export const W0 = Math.sqrt(STIFF / MASS); // s^-1
export const Q_CART = 10;
export const GAMMA = W0 / Q_CART;         // s^-1
export const WD = Math.sqrt(W0 * W0 - (GAMMA * GAMMA) / 4);

/** chi(omega) for the cart with quality factor `Q` (default 10), [Re, Im], in m/N (eq:chi). */
export function chi(w, Q = Q_CART) {
	const g = W0 / Q, re = W0 * W0 - w * w, im = g * w, d = MASS * (re * re + im * im);
	return [re / d, im / d];
}
export const modulus = ([a, b]) => Math.hypot(a, b);
export const argument = ([a, b]) => Math.atan2(b, a);
export const deg = (r) => (r * 180) / Math.PI;

/** The same in the units of the chart, x = omega / omega0 and gamma = 1/Q: k chi = 1 / (1 - x^2 - i gamma x). */
export const kChi = (x, Q) => { const g = 1 / Q, re = 1 - x * x, im = g * x, d = re * re + im * im; return [re / d, im / d]; };
/** omega Im chi in units of 1 / (m Gamma): the line, gamma^2 x^2 / ((1 - x^2)^2 + gamma^2 x^2), one at x = 1. */
export const line = (x, Q) => { const g = 1 / Q; return (g * g * x * x) / ((1 - x * x) ** 2 + g * g * x * x); };
/** The half-power points of the line, x = sqrt(1 + gamma^2/4) -+ gamma/2. */
export const halfPower = (Q) => { const g = 1 / Q, c = Math.sqrt(1 + (g * g) / 4); return [c - g / 2, c + g / 2]; };

/** The ring-down released from rest at q0: q0 e^{-Gamma t/2} [cos wd t + (Gamma/2wd) sin wd t], m. */
export const ringdown = (t, q0 = 0.1) => q0 * Math.exp((-GAMMA * t) / 2) * (Math.cos(WD * t) + (GAMMA / (2 * WD)) * Math.sin(WD * t));
/** Its envelope A e^{-Gamma t/2}, with A = q0 / cos(alpha), tan(alpha) = Gamma / 2 wd: the boxed form's amplitude. */
export const ALPHA = Math.atan(GAMMA / (2 * WD));
export const envelope = (t, q0 = 0.1) => (q0 / Math.cos(ALPHA)) * Math.exp((-GAMMA * t) / 2);

/** The largest value of f on [a, b]: a grid, then golden sections. */
export function top(f, a, b, n = 40000) {
	let best = a;
	for (let i = 0; i <= n; i++) { const x = a + ((b - a) * i) / n; if (f(x) > f(best)) best = x; }
	let lo = Math.max(a, best - (b - a) / n), hi = Math.min(b, best + (b - a) / n);
	const g = (Math.sqrt(5) - 1) / 2;
	for (let i = 0; i < 200; i++) { const c = hi - g * (hi - lo), d = lo + g * (hi - lo); if (f(c) > f(d)) hi = d; else lo = c; }
	const x = (lo + hi) / 2;
	return { x, y: f(x) };
}

/** The point in (a, b) where f changes sign, by bisection. */
export function root(f, a, b) {
	let fa = f(a);
	for (let i = 0; i < 200 && b - a > 1e-15; i++) { const c = (a + b) / 2, fc = f(c); if (Math.sign(fc) === Math.sign(fa)) { a = c; fa = fc; } else b = c; }
	return (a + b) / 2;
}

/** The chapter's numbers for the cart, computed and asserted. */
export function cart(check) {
	const near = (a, b, tol) => Math.abs(a - b) <= tol;
	check(W0 === 5 && GAMMA === 0.5 && WD.toFixed(3) === '4.994', `omega0 ${W0}, Gamma ${GAMMA}, omega_d ${WD}`);
	check(((1 - WD / W0) * 100).toFixed(1) === '0.1', 'omega_d is not 0.1% below omega0');
	check((2 * Math.PI / W0).toFixed(2) === '1.26', 'the period');
	// the ring-down: from rest at 0.1 m, it solves the law of motion; energy / e at 2 s, amplitude / e at 4 s
	check(near(ringdown(0), 0.1, 1e-15), 'the ring-down does not start at 0.1 m');
	const h = 1e-4, dq = (t) => (ringdown(t + h) - ringdown(t - h)) / (2 * h), ddq = (t) => (ringdown(t + h) - 2 * ringdown(t) + ringdown(t - h)) / (h * h);
	check(Math.abs(dq(0)) < 1e-6, 'the ring-down does not start from rest');
	for (const t of [0.3, 1.7, 4.4, 7.9]) check(Math.abs(MASS * ddq(t) + MASS * GAMMA * dq(t) + STIFF * ringdown(t)) < 1e-5, `the ring-down breaks the law of motion at ${t}`);
	check(near(envelope(2) ** 2 / envelope(0) ** 2, Math.exp(-1), 1e-15) && near(envelope(4) / envelope(0), Math.exp(-1), 1e-15), 'energy / e at 2 s, amplitude / e at 4 s');
	check((Math.exp((-GAMMA / 2) * (2 * Math.PI / WD)) * 100).toFixed(0) === '73', 'a swing does not end at 73%');
	// the ring-down touches its envelope where cos(wd t - alpha) = +-1 and never passes it
	for (let n = 0; n < 8; n++) { const t = (n * Math.PI + ALPHA) / WD; check(near(Math.abs(ringdown(t)), envelope(t), 1e-14), `the ring-down does not touch its envelope at ${t}`); }
	for (let t = 0; t <= 8; t += 0.001) check(Math.abs(ringdown(t)) <= envelope(t) + 1e-15, `the ring-down leaves its envelope at ${t}`);
	// the response: the phasors at 3, 5 and 8 s^-1 for 1 N, the static compliance, the peak, the half-power points
	const ph = [3, 5, 8].map((w) => ({ w, r: modulus(chi(w)), a: deg(argument(chi(w))) }));
	check(ph[0].r.toFixed(4) === '0.0311' && ph[0].a.toFixed(1) === '5.4', `at 3: ${ph[0].r}, ${ph[0].a}`);
	check(ph[1].r.toFixed(3) === '0.200' && near(ph[1].a, 90, 1e-12), `at 5: ${ph[1].r}, ${ph[1].a}`);
	check(ph[2].r.toFixed(4) === '0.0128' && ph[2].a.toFixed(1) === '174.1', `at 8: ${ph[2].r}, ${ph[2].a}`);
	check(near(chi(0)[0], 0.02, 1e-15), 'the static compliance is not 0.02 m/N');
	for (const w of [0.5, 3, 5, 8, 40]) check(chi(w)[1] > 0, 'Im chi is not positive');
	const peaks = [3, 10, 30].map((Q) => ({ Q, ...top((x) => modulus(kChi(x, Q)), 0.5, 1.5) }));
	const printed = [['0.972', '3.04'], ['0.9975', '10.01'], ['0.9997', '30.00']];
	peaks.forEach((p, i) => {
		check(p.x.toFixed(printed[i][0].length - 2) === printed[i][0] && p.y.toFixed(2) === printed[i][1], `the peak of Q = ${p.Q}: ${p.x}, ${p.y}`);
		check(near(p.x, Math.sqrt(1 - 1 / (2 * p.Q * p.Q)), 1e-7), `the peak of Q = ${p.Q} is not at sqrt(1 - 1/2Q^2)`);
	});
	check((top((w) => modulus(chi(w)), 4, 6).x).toFixed(2) === '4.99', 'the cart\'s peak is not at 4.99');
	for (const Q of [3, 10, 30]) {
		const [a, b] = halfPower(Q);
		check(near(line(a, Q), 0.5, 1e-12) && near(line(b, Q), 0.5, 1e-12) && near(b - a, 1 / Q, 1e-15), `the half-power points of Q = ${Q}`);
		check(near(top((x) => line(x, Q), 0.5, 1.5).x, 1, 1e-7) && near(line(1, Q), 1, 1e-15), `the line of Q = ${Q} does not peak at 1 at x = 1`);
		check(near(deg(argument(kChi(1, Q))), 90, 1e-12), `the lag of Q = ${Q} is not 90 degrees at omega0`);
	}
	const [a10, b10] = halfPower(10);
	check(a10.toFixed(4) === '0.9512' && b10.toFixed(4) === '1.0512', 'the half-power points of Q = 10');
	check((W0 * a10).toFixed(3) === '4.756' && (W0 * b10).toFixed(3) === '5.256', 'the cart\'s half-power points in s^-1');
	return { ph, peaks };
}

// ---- the ball -------------------------------------------------------------------------------------------------
export const G = 6.674e-11;
export const KB = 1.380649e-23;
export const R_BALL = 0.1;                // m
export const RHO = 7850;                  // kg m^-3
export const MU = 7.0e10;                 // Pa, steel's shear modulus (section 4.3)
export const TEMP = 300;                  // K
export const V_BALL = (4 / 3) * Math.PI * R_BALL ** 3;
export const M_BALL = RHO * V_BALL;
export const K_BALL = (3 * MU * V_BALL) / R_BALL ** 2;
export const Q_RMS = Math.sqrt((KB * TEMP) / K_BALL);
export const BLOW_UP = 1e14;              // the drawing's exaggeration of the shape change

/** The trial shape: the displacement at (x, y, z) for the pole's displacement q, z the axis (Appendix A). */
export const trial = ([x, y, z], q, R = R_BALL) => [(-q / R) * x / 2, (-q / R) * y / 2, (q / R) * z];

/** The tidal table E_ij = d_i d_j Phi (s^-2) at the point p of the potential Phi = -(G/2) Q_ij n_i n_j / r^3 of
 * the trace-free quadrupole Qm (kg m^2, the convention int rho (3 x_i x_j - r^2 delta_ij) dV), by differences. */
export function quadrupoleTide(Qm, p) {
	const phi = (x) => { const r2 = x[0] ** 2 + x[1] ** 2 + x[2] ** 2; let s = 0; for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) s += Qm[i][j] * x[i] * x[j]; return (-G / 2) * s / r2 ** 2.5; };
	const h = 1e-4 * Math.hypot(...p), E = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
	for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
		const at = (si, sj) => { const x = [...p]; x[i] += si * h; x[j] += sj * h; return phi(x); };
		E[i][j] = (at(1, 1) - at(1, -1) - at(-1, 1) + at(-1, -1)) / (4 * h * h);
	}
	return E;
}

/** The ball's numbers, computed and asserted: the trial shape, its stiffness and thermal swing, the 15 kHz, its
 * quadrupole (integrated over the ball) and the tide on its axis. */
export function ball(check) {
	const near = (a, b, tol) => Math.abs(a - b) <= tol * Math.abs(b);
	const R = R_BALL, q = 1e-3 * R;
	// the trial shape: no divergence, the poles out by q, the equator in by q/2, its strain (q/R) diag(-1/2, -1/2, 1)
	const u = (p) => trial(p, q);
	const h = 1e-4;
	for (const p of [[0.01, 0.02, -0.03], [0.05, -0.04, 0.06]]) {
		let div = 0;
		for (let i = 0; i < 3; i++) { const a = [...p], b = [...p]; a[i] += h; b[i] -= h; div += (u(a)[i] - u(b)[i]) / (2 * h); }
		check(Math.abs(div) < 1e-12, 'the trial shape has a divergence');
	}
	check(near(u([0, 0, R])[2], q, 1e-15) && near(u([0, 0, -R])[2], -q, 1e-15) && near(u([R, 0, 0])[0], -q / 2, 1e-15), 'the poles do not move by q and the equator by -q/2');
	// the stiffness from the strain energy, mu u_ij u_ij over the volume (a shear changes no volume)
	const strain = (q / R) ** 2 * (0.25 + 0.25 + 1);
	check(near(MU * strain * V_BALL, 0.5 * K_BALL * q * q, 1e-12), 'the strain energy is not K q^2 / 2 with K = 3 mu V / R^2');
	check(K_BALL.toPrecision(2) === '8.8e+10', `K = ${K_BALL}`);
	check(Q_RMS.toPrecision(2) === '2.2e-16' && (Q_RMS * BLOW_UP * 100).toFixed(1) === '2.2', `q_rms = ${Q_RMS}`);
	// the effective mass 3M/10 and the note near 15 kHz
	let m2 = 0, mz = 0;
	const N = 60;
	for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) for (let k = 0; k < N; k++) {
		const p = [-R + (2 * R * (i + 0.5)) / N, -R + (2 * R * (j + 0.5)) / N, -R + (2 * R * (k + 0.5)) / N];
		if (p[0] ** 2 + p[1] ** 2 + p[2] ** 2 > R * R) continue;
		const d = u(p);
		m2 += d[0] ** 2 + d[1] ** 2 + d[2] ** 2;
		mz += 3 * (2 * p[2] * d[2]) - 2 * (p[0] * d[0] + p[1] * d[1] + p[2] * d[2]);   // the change of 3 z^2 - r^2
	}
	const dV = (2 * R / N) ** 3;
	const mEff = (RHO * m2 * dV) / (q * q), Qzz = RHO * mz * dV;
	check(near(mEff, 0.3 * M_BALL, 2e-2), `the effective mass ${mEff} is not 3M/10`);
	check((Math.sqrt(K_BALL / (0.3 * M_BALL)) / (2 * Math.PI) / 1000).toFixed(0) === '15', 'the note is not near 15 kHz');
	check(near(Qzz, (6 / 5) * M_BALL * R * q, 2e-2), `Q_zz ${Qzz} is not 6MRq/5`);
	// the tide of that quadrupole a metre away on the axis: -36 G M R q / 5 r^5 along it, half that, opposite, across
	const Qm = [[-0.6, 0, 0], [0, -0.6, 0], [0, 0, 1.2]].map((r) => r.map((v) => v * M_BALL * R * q));
	const E = quadrupoleTide(Qm, [0, 0, 1]);
	const axis = (-36 * G * M_BALL * R * q) / 5;
	check(near(E[2][2], axis, 1e-5) && near(E[0][0], -axis / 2, 1e-5) && near(E[1][1], -axis / 2, 1e-5), `the tide on the axis ${E[2][2]}, ${E[0][0]}`);
	check(E[2][2] < 0, 'a ball longer along its axis does not stretch a ring on the axis along it');
	// the table in the ring's plane (along the axis, across it), in units of |E_zz| / 2: diag(-2, 1) for q > 0
	const table = [[E[2][2], E[2][0]], [E[0][2], E[0][0]]].map((r) => r.map((v) => v / (-axis / 2)));
	check(near(table[0][0], -2, 1e-5) && near(table[1][1], 1, 1e-5) && Math.abs(table[0][1]) < 1e-6, 'the table on the axis is not diag(-2, 1)');
	// the paper's number: 3.4 x 10^-25 s^-2 a metre away for the thermal swing
	const tideRms = (36 * G * M_BALL * R * Q_RMS) / 5;
	check(tideRms.toPrecision(2) === '3.4e-25', `the tide ${tideRms}`);
	return { mEff, Qzz, tideRms };
}
