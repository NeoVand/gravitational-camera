// Shared numbers and marks for the three diagrams of the tutorial's chapter 8.2 (tutorial/quantum/operators.md):
// tut-uncertainty-widths, tut-shift-kick-orders and tut-one-integral-ledger. Not a figure itself. The colour roles are
// chapter 7.8's (figs/tut-memory-lib.js, read from app.css by `palette(check)`): matter's for the density and the
// moments, ink for everything else; orange and blue, which mean a stretch and a squeeze, are not used. The sheet,
// strokes, labels and cropping are those of chapters 6.1 to 7.8 (figs/tut-pot-lib.js), all imported, not copied.
//
// `chapter(check)` asserts the chapter's statements that a figure draws or its caption prints, against the chapter's
// own text (fetched), and computes the numbers behind them:
//  - the Gaussian packet psi = (2 pi s^2)^(-1/4) e^{-x^2/4 s^2}: |psi|^2 has area 1 and standard deviation s; its
//    transform (chapter 2.6's convention, psi~(k) = int psi e^{-ikx} dx, by quadrature) is (8 pi s^2)^(1/4) e^{-s^2 k^2};
//    the momentum density |psi~(p/hbar)|^2 / 2 pi hbar has area 1 and standard deviation hbar / 2 s, so that for
//    s = 2 l, l, l/2 the spreads are hbar/4l, hbar/2l, hbar/l and every product is hbar/2;
//  - the shift and the kick, on a wave function on a grid of 1024 points: e^{-isp/hbar} (applied through the discrete
//    Fourier transform) is psi(x - s), moving <x> by s; e^{ibx/hbar} moves <p> by b and leaves |psi|^2 alone; shift
//    then kick is e^{isb/hbar} times kick then shift, at every point; the classical moves commute;
//  - the ledger: one integral, sum_a m_a grad h . grad g, is the bracket {Q_h, Q-dot_g} (by finite differences on a
//    random body of twelve particles in three dimensions), i hbar times it the commutator [Q_h, Q-dot_g] (on a grid,
//    for one particle on a line), k_B T times it the thermal mean <Q-dot_h Q-dot_g> (from equipartition's covariance
//    of the momenta), and the energy-weighted sum (2/pi) int omega Im chi_h d omega of a body of bound particles, for
//    h = g; for h = g = (x^2 - y^2)/2 it is the moment of inertia about z, 0.13 kg m^2 for chapter 1.7's steel ball.
import { MATTER, palette } from './tut-memory-lib.js';
import { HBAR } from './tut-einstein-lib.js';
import { KB } from './tut-osc-lib.js';
import { uniforms } from './tut-prob-lib.js';
import { INK } from '../lib.js';
import { n2 } from './tut-pot-lib.js';

export { MATTER, palette, HBAR, KB };

export const near = (a, b, tol) => Math.abs(a - b) <= tol * Math.max(Math.abs(a), Math.abs(b), 1e-300);

/** Simpson's rule for f on [a, b] with m (even) intervals. */
export function simpson(f, a, b, m = 4000) {
	const h = (b - a) / m;
	let s = f(a) + f(b);
	for (let i = 1; i < m; i++) s += (i % 2 ? 4 : 2) * f(a + i * h);
	return (s * h) / 3;
}

// ---- the Gaussian packet (any units: a length l and hbar) -----------------------------------------------------------
/** |psi(x)|^2 for psi = (2 pi s^2)^(-1/4) e^{-x^2/4 s^2}. */
export const xDensity = (s) => (x) => Math.exp(-(x * x) / (2 * s * s)) / (Math.sqrt(2 * Math.PI) * s);
/** psi itself, real. */
export const packet = (s) => (x) => (2 * Math.PI * s * s) ** -0.25 * Math.exp(-(x * x) / (4 * s * s));
/** Its transform in closed form, (8 pi s^2)^(1/4) e^{-s^2 k^2}. */
export const transform = (s) => (k) => (8 * Math.PI * s * s) ** 0.25 * Math.exp(-s * s * k * k);
/** The momentum density |psi~(p/hbar)|^2 / 2 pi hbar. */
export const pDensity = (s, hbar = 1) => (p) => transform(s)(p / hbar) ** 2 / (2 * Math.PI * hbar);
/** sigma_p = hbar / 2 sigma_x. */
export const sigmaP = (s, hbar = 1) => hbar / (2 * s);
/** The three widths, in units of l: 2 l, l, l/2. */
export const WIDTHS = [2, 1, 0.5];

// ---- a wave function on a grid, for the shift and the kick (hbar = 1) ----------------------------------------------
/** The discrete Fourier transform (sign -1 forward, +1 back, unnormalized) of [re, im] arrays: O(N^2), N = 1024. */
function dft(re, im, sign) {
	const N = re.length, R = new Float64Array(N), I = new Float64Array(N);
	const c = Float64Array.from({ length: N }, (_, j) => Math.cos((2 * Math.PI * j) / N));
	const s = Float64Array.from({ length: N }, (_, j) => Math.sin((2 * Math.PI * j) / N));
	for (let k = 0; k < N; k++) {
		let a = 0, b = 0;
		for (let n = 0; n < N; n++) {
			const j = (k * n) % N, cs = c[j], sn = sign * s[j];
			a += re[n] * cs - im[n] * sn;
			b += re[n] * sn + im[n] * cs;
		}
		R[k] = a; I[k] = b;
	}
	return [R, I];
}

/** The chapter's moves on a grid: returns the checks' worst errors. */
export function moves(s, b, { N = 1024, L = 40, x0 = -1.3, p0 = 0.4, w = 1.1 } = {}) {
	const dx = L / N, X = Float64Array.from({ length: N }, (_, n) => -L / 2 + n * dx);
	const K = Float64Array.from({ length: N }, (_, k) => ((k < N / 2 ? k : k - N) * 2 * Math.PI) / L);
	const start = (x) => { const a = packet(w)(x - x0); return [a * Math.cos(p0 * x), a * Math.sin(p0 * x)]; };
	const psi = [Float64Array.from(X, (x) => start(x)[0]), Float64Array.from(X, (x) => start(x)[1])];
	const shift = ([re, im]) => {
		// e^{-isp/hbar}: multiply each ripple e^{ikx} by e^{-isk}
		const [R, I] = dft(re, im, -1);
		for (let k = 0; k < N; k++) { const c = Math.cos(-s * K[k]), q = Math.sin(-s * K[k]); [R[k], I[k]] = [R[k] * c - I[k] * q, R[k] * q + I[k] * c]; }
		const [r, i] = dft(R, I, +1);
		return [r.map((v) => v / N), i.map((v) => v / N)];
	};
	const kick = ([re, im]) => [re.map((v, n) => v * Math.cos(b * X[n]) - im[n] * Math.sin(b * X[n])), im.map((v, n) => re[n] * Math.sin(b * X[n]) + v * Math.cos(b * X[n]))];
	const meanX = ([re, im]) => X.reduce((t, x, n) => t + x * (re[n] ** 2 + im[n] ** 2), 0) * dx;
	const norm = ([re, im]) => re.reduce((t, v, n) => t + v * v + im[n] ** 2, 0) * dx;
	// <p> = sum k |psi~_k|^2 / sum |psi~_k|^2, from the discrete transform (exact for a packet the grid resolves)
	const meanP = ([re, im]) => {
		const [R, I] = dft(re, im, -1);
		let t = 0, n = 0;
		for (let k = 0; k < N; k++) { const w = R[k] ** 2 + I[k] ** 2; t += K[k] * w; n += w; }
		return t / n;
	};
	const shifted = shift(psi);
	let slide = 0;
	for (let n = 0; n < N; n++) { const [a, c] = start(X[n] - s); slide = Math.max(slide, Math.hypot(shifted[0][n] - a, shifted[1][n] - c)); }
	const SK = kick(shift(psi)), KS = shift(kick(psi));
	// SK = e^{isb} KS, at every point where the packet is not negligible
	let phase = 0;
	const e = [Math.cos(s * b), Math.sin(s * b)];
	for (let n = 0; n < N; n++) {
		const r = KS[0][n] * e[0] - KS[1][n] * e[1], i = KS[0][n] * e[1] + KS[1][n] * e[0];
		phase = Math.max(phase, Math.hypot(SK[0][n] - r, SK[1][n] - i));
	}
	const kicked = kick(psi);
	const keeps = Math.max(...X.map((_, n) => Math.abs(kicked[0][n] ** 2 + kicked[1][n] ** 2 - psi[0][n] ** 2 - psi[1][n] ** 2)));
	return {
		norm: norm(psi), slide, phase, keeps,
		dX: meanX(shifted) - meanX(psi), dP: meanP(kicked) - meanP(psi),
		endSK: [meanX(SK), meanP(SK)], endKS: [meanX(KS), meanP(KS)], startXP: [meanX(psi), meanP(psi)]
	};
}

// ---- the ledger --------------------------------------------------------------------------------------------------
/** h = g = (x^2 - y^2)/2 and its gradient. */
export const quad = (v) => 0.5 * (v[0] * v[0] - v[1] * v[1]);
export const gradQuad = (v) => [v[0], -v[1], 0];
/** Two other functions, for the general check: h and g with their gradients. */
const hFun = (v) => v[0] * v[1] + 0.3 * v[2] ** 3, hGrad = (v) => [v[1], v[0], 0.9 * v[2] ** 2];
const gFun = (v) => Math.sin(v[0]) * v[2] + v[1] ** 2, gGrad = (v) => [Math.cos(v[0]) * v[2], 2 * v[1], Math.sin(v[0])];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

/** The four entries of the ledger against the one integral; returns the worst relative errors. */
export function ledger(check) {
	const u = uniforms(82);
	const body = Array.from({ length: 12 }, () => ({ m: 0.5 + u(), x: [u() - 0.5, u() - 0.5, u() - 0.5], p: [u() - 0.5, u() - 0.5, u() - 0.5] }));
	const integral = body.reduce((t, a) => t + a.m * dot(hGrad(a.x), gGrad(a.x)), 0);

	// the bracket {Q_h, Q-dot_g} by finite differences: sum over a, j of dA/dx dB/dp - dA/dp dB/dx
	const Qh = (B) => B.reduce((t, a) => t + a.m * hFun(a.x), 0);
	const Qgdot = (B) => B.reduce((t, a) => t + dot(a.p, gGrad(a.x)), 0);
	const d = 1e-5;
	const vary = (i, kind, j, e) => body.map((a, n) => (n !== i ? a : { ...a, [kind]: a[kind].map((v, q) => (q === j ? v + e : v)) }));
	const partial = (F, i, kind, j) => (F(vary(i, kind, j, d)) - F(vary(i, kind, j, -d))) / (2 * d);
	let bracket = 0;
	for (let i = 0; i < body.length; i++) for (let j = 0; j < 3; j++)
		bracket += partial(Qh, i, 'x', j) * partial(Qgdot, i, 'p', j) - partial(Qh, i, 'p', j) * partial(Qgdot, i, 'x', j);
	check(near(bracket, integral, 1e-7), `the bracket ${bracket} is not the integral ${integral}`);

	// the thermal mean: <p_i p_j> = m k_B T delta_ij, so <Q-dot_h Q-dot_g> = sum_a m_a k_B T grad h . grad g
	const kT = 4.14e-21;
	// Q-dot_g = sum p . grad g (the mass cancels, m_a / m_a); different particles' momenta are uncorrelated
	const tremor = body.reduce((t, a) => {
		let s = 0;
		for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) s += hGrad(a.x)[i] * gGrad(a.x)[j] * (i === j ? a.m * kT : 0);
		return t + s;
	}, 0);
	check(near(tremor, kT * integral, 1e-12), `the tremor ${tremor} is not k_B T times the integral`);

	// the commutator, one particle of mass m on a line (hbar = 1), on a grid: [m h(x), (1/2)(p g' + g' p)] psi = i m h' g' psi
	let commutator = 0;
	{
		const m = 1.7, N = 4001, L = 12, dx = L / (N - 1), X = Array.from({ length: N }, (_, n) => -L / 2 + n * dx);
		const h = (x) => Math.sin(x) + 0.2 * x * x, h1 = (x) => Math.cos(x) + 0.4 * x;
		const g1 = (x) => 0.5 * x * x - 0.3 * x + 1;                 // g' itself; g'' = x - 0.3, so the two orders differ
		const psi = X.map((x) => [Math.exp(-x * x / 2) * Math.cos(0.8 * x), Math.exp(-x * x / 2) * Math.sin(0.8 * x)]);
		const D = (f) => f.map((_, n) => (n === 0 || n === N - 1 ? [0, 0] : [(f[n + 1][0] - f[n - 1][0]) / (2 * dx), (f[n + 1][1] - f[n - 1][1]) / (2 * dx)]));
		const P = (f) => D(f).map(([a, b]) => [b, -a]);              // -i d/dx
		const times = (fn, f) => f.map(([a, b], n) => [fn(X[n]) * a, fn(X[n]) * b]);
		const plus = (f, q) => f.map(([a, b], n) => [(a + q[n][0]) / 2, (b + q[n][1]) / 2]);
		const Qd = (f) => plus(P(times(g1, f)), times(g1, P(f)));
		const Q = (f) => times((x) => m * h(x), f);
		const lhs = Qd(Q(psi)).map(([a, b], n) => { const q = Q(Qd(psi))[n]; return [q[0] - a, q[1] - b]; });
		const rhs = psi.map(([a, b], n) => { const k = m * h1(X[n]) * g1(X[n]); return [-k * b, k * a]; });     // i m h' g' psi
		const big = Math.max(...rhs.map(([a, b]) => Math.hypot(a, b)));
		for (let n = 10; n < N - 10; n++) commutator = Math.max(commutator, Math.hypot(lhs[n][0] - rhs[n][0], lhs[n][1] - rhs[n][1]) / big);
		check(commutator < 1e-4, `the commutator differs from i hbar times the integral by ${commutator}`);
	}

	// the sum rule, h = g: particles bound with their own frequencies and damping, chi_h = sum m |grad h|^2 /
	// (omega_a^2 - omega^2 - i gamma_a omega); (2/pi) int_0^inf omega Im chi_h d omega against sum m |grad h|^2
	let sumRule;
	{
		const weight = body.reduce((t, a) => t + a.m * dot(hGrad(a.x), hGrad(a.x)), 0);
		const lines = body.map((a, n) => ({ A: a.m * dot(hGrad(a.x), hGrad(a.x)), w0: 1 + 0.15 * n, gam: 0.05 + 0.02 * n }));
		const im = (w) => lines.reduce((t, { A, w0, gam }) => t + (A * gam * w) / ((w0 * w0 - w * w) ** 2 + gam * gam * w * w), 0);
		// int_0^inf omega Im chi: on [0, 40] by Simpson, the tail beyond (Im chi ~ A gamma / omega^3) in closed form
		const tail = lines.reduce((t, { A, gam }) => t + (A * gam) / 40, 0);
		const total = (2 / Math.PI) * (simpson((w) => w * im(w), 0, 40, 400000) + tail);
		sumRule = total;
		check(near(total, weight, 2e-4), `the sum rule gives ${total}, not ${weight}`);
	}
	// h = g = (x^2 - y^2)/2: grad h . grad g = x^2 + y^2
	for (const a of body) check(near(dot(gradQuad(a.x), gradQuad(a.x)), a.x[0] ** 2 + a.x[1] ** 2, 1e-14), 'grad h . grad g is not x^2 + y^2');
	return { integral, bracket, tremor, commutator, sumRule };
}

// ---- the chapter's text -------------------------------------------------------------------------------------------
/** The chapter's statements behind the three figures, asserted against its text, and the numbers computed. */
export async function chapter(check) {
	const md = await (await fetch('/tutorial/quantum/operators.md')).text();
	const flat = md.replace(/\s+/g, ' ');
	const has = (s, what) => check(flat.includes(s), `the chapter does not say ${what}: ${s}`);

	// ---- the widths
	has('so $\\sigma_p = \\hbar/2\\sigma_x$', 'sigma_p = hbar / 2 sigma_x');
	has('its transform is chapter 2.6\'s bell $e^{-\\sigma_x^2k^2}$', 'the transform');
	has('the density $|\\tilde\\psi(k)|^2/2\\pi$', 'the density of k');
	has('$\\boxed{\\sigma_x\\sigma_p \\ge \\frac{\\hbar}{2}}', 'the bound');
	for (const s of WIDTHS) {
		const area = simpson(xDensity(s), -14 * s, 14 * s), sx = Math.sqrt(simpson((x) => x * x * xDensity(s)(x), -14 * s, 14 * s));
		check(near(area, 1, 1e-10) && near(sx, s, 1e-10), `|psi|^2 of width ${s}: area ${area}, sd ${sx}`);
		check(near(packet(s)(0.37 * s) ** 2, xDensity(s)(0.37 * s), 1e-14), 'psi^2 is not the density');
		for (const k of [0, 0.4 / s, 1 / s, 2.1 / s]) {
			const num = simpson((x) => packet(s)(x) * Math.cos(k * x), -14 * s, 14 * s);    // psi is even: the sine part is zero
			check(near(num, transform(s)(k), 1e-9), `the transform of width ${s} at k = ${k}: ${num}`);
		}
		for (const hbar of [1, 0.37]) {
			const sp = sigmaP(s, hbar), f = pDensity(s, hbar);
			const a = simpson(f, -14 * sp, 14 * sp), v = Math.sqrt(simpson((p) => p * p * f(p), -14 * sp, 14 * sp));
			check(near(a, 1, 1e-10) && near(v, hbar / (2 * s), 1e-10) && near(s * v, hbar / 2, 1e-10), `the momenta of width ${s}: area ${a}, sd ${v}`);
		}
		// each curve at e^{-1/2} of its top exactly at its standard deviation
		check(near(xDensity(s)(s) / xDensity(s)(0), Math.exp(-0.5), 1e-14) && near(pDensity(s)(sigmaP(s)) / pDensity(s)(0), Math.exp(-0.5), 1e-14), 'the brackets\' height');
	}
	check(WIDTHS.map((s) => sigmaP(s)).join() === '0.25,0.5,1', 'the spreads are not hbar/4l, hbar/2l, hbar/l');

	// ---- the shift and the kick
	has('the packet moved by $s$', 'the shift by s');
	has('the momentum rises by $b = \\epsilon\\matter m$, and the impulse is $e^{ibx/\\hbar}$', 'the kick');
	has('$e^{-isp/\\hbar}\\psi(x) = \\psi(x) - s\\psi\'(x)', 'the shift\'s operator');
	has('The two orders differ by the factor $e^{isb/\\hbar}$, with $sb$ the area of the rectangle', 'the phase');
	has('A shift by $s$ and then a kick by $b$ give $e^{ibx/\\hbar}\\psi(x - s)$; the kick first gives $e^{ib(x - s)/\\hbar}\\psi(x - s)$', 'the two orders');
	{
		const s = 2.3, b = 0.9, r = moves(s, b);
		check(near(r.norm, 1, 1e-9), `the grid's packet has norm ${r.norm}`);
		check(r.slide < 1e-9 && near(r.dX, s, 1e-9), `e^{-isp} is not the slide by s: ${r.slide}, ${r.dX}`);
		check(near(r.dP, b, 1e-9) && r.keeps < 1e-12, `the kick does not raise <p> by b: ${r.dP}`);
		check(r.phase < 1e-9, `shift then kick is not e^{isb} times kick then shift: ${r.phase}`);
		check(near(r.endSK[0], r.endKS[0], 1e-9) && near(r.endSK[1], r.endKS[1], 1e-9), 'the two orders do not end at the same means');
		check(near(r.endSK[0] - r.startXP[0], s, 1e-9) && near(r.endSK[1] - r.startXP[1], b, 1e-9), 'the end is not (x0 + s, p0 + b)');
		// the classical moves commute
		const sh = ([x, p]) => [x + s, p], ki = ([x, p]) => [x, p + b], q = [0.3, -1.1];
		check(ki(sh(q)).every((v, i) => v === sh(ki(q))[i]), 'the classical moves do not commute');
	}

	// ---- the ledger
	has('$\\boxed{\\begin{aligned}[\\matter Q_h, \\matter{\\dot Q}_g] &= i\\hbar\\sum_a\\matter m_a\\,\\nabla h\\cdot\\nabla g\\,(\\vect x_a)\\\\ &= i\\hbar\\int\\matter\\rho\\,\\nabla h\\cdot\\nabla g\\,\\dd V ,\\end{aligned}}$', 'the commutator');
	has('$i\\hbar$ times chapter 1.7\'s bracket', 'the bracket');
	has('The same integral, times $\\kB T$, is the mean of $\\matter{\\dot Q}_h\\matter{\\dot Q}_g$ in a warm body', 'the tremor');
	has('and the whole weight of the response to an applied tide (chapter [4.5]', 'the sum rule');
	has('$h = g = \\tfrac12(x^2 - y^2)$, the integral is the moment of inertia, $0.13\\unit{kg\\,m^2}$', 'the moment of inertia');
	const L = ledger(check);
	// chapter 1.7's steel ball: 32.9 kg, radius 10 cm, (2/5) M R^2
	const I = 0.4 * 32.9 * 0.1 ** 2;
	check(I.toFixed(2) === '0.13', `the ball's moment of inertia ${I}`);
	check(((HBAR / 2) * Number(I.toFixed(2))).toExponential(1) === '6.9e-36', 'the bound on the ball');
	has('$\\tfrac12\\hbar\\times0.13\\unit{kg\\,m^2} = 6.9\\times10^{-36}', 'the bound on the ball');
	return { md, ledger: L, inertia: I };
}

// ---- marks -------------------------------------------------------------------------------------------------------
/** A dashed arrow between two figure points, drawn and remembered as Sheet.arrow draws a solid one: a dashed shaft to
 * the head's back and a solid head `head` points long (or two fifths of the arrow). */
export function dashedArrow(S, A, B, { color = INK, width = 0.75, head = 4.4, dash = [2.4, 1.6], layer = 2, what = 'a dashed arrow' } = {}) {
	const L = Math.hypot(B[0] - A[0], B[1] - A[1]);
	const hd = Math.min(head, 0.4 * L);
	const u = [(B[0] - A[0]) / L, (B[1] - A[1]) / L], w = [-u[1], u[0]], hw = 0.36 * hd;
	const base = [B[0] - u[0] * hd, B[1] - u[1] * hd];
	// the dashes: whole periods from A, the last dash ending at the head's back
	const shaft = L - hd;
	const n = Math.max(1, Math.round((shaft + dash[1]) / (dash[0] + dash[1])));
	const period = (shaft + dash[1]) / n, on = period * (dash[0] / (dash[0] + dash[1]));
	const segs = Array.from({ length: n }, (_, i) => [i * period, i * period + on]);
	const d = segs.map(([a, b]) => `M${n2(A[0] + u[0] * a)},${n2(A[1] + u[1] * a)}L${n2(A[0] + u[0] * b)},${n2(A[1] + u[1] * b)}`).join('');
	S.raw(`<path d="${d}" stroke="${color}" stroke-width="${width}" stroke-linecap="butt" fill="none"/>` +
		`<path d="M${n2(B[0])},${n2(B[1])}L${n2(base[0] + w[0] * hw)},${n2(base[1] + w[1] * hw)}L${n2(base[0] - w[0] * hw)},${n2(base[1] - w[1] * hw)}Z" fill="${color}"/>`, layer);
	S.mark([A, base], width / 2, what);
	S.mark([B, [base[0] + w[0] * hw, base[1] + w[1] * hw], [base[0] - w[0] * hw, base[1] - w[1] * hw], B], 0, what + "'s head");
	S.arrows.push({ L, head: hd, what });
	return { A, B, L, head: hd, u, dashes: segs.length, period };
}
