// Shared numbers for the three diagrams of the tutorial's section 8.5 (tutorial/quantum/counting-quanta.md):
// tut-count-bars, tut-click-trains and tut-phase-blobs. Not a figure itself. The palette is section 8.1's (read from
// app.css by `palette(check)`), the relative `near` section 8.2's, the seeded random numbers section 3.1's
// (figs/tut-prob-lib.js), and the sheet, strokes, labels and cropping those of sections 6.1 to 8.3 (figs/tut-pot-lib.js),
// all imported, not copied. Ink and the page's neutral greys only; orange and blue, which mean a stretch and a
// squeeze, are not used.
//
// `chapter(check)` asserts the chapter's statements that a figure draws or its caption prints, against the chapter's
// own text (fetched, outside its comments), and computes the numbers behind them:
//  - the counts at nbar = 4: the Poisson law e^{-4} 4^n / n! (0.018, 0.073, 0.147, 0.195, 0.195, 0.156, 0.104, 0.060,
//    0.030, 0.013, 0.005) and the geometric law 4^n / 5^{n+1} (0.200, 0.160, ..., 0.009 at n = 14), each summing to
//    one with the mean 4; their variances 4 and 4 + 16 = 20 (standard deviations 2 and 4.5); the likeliest counts 3
//    and 4 (0.195) and 0 (0.20); P(0) = 1.8% for the coherent mode; the geometric law as the Poisson law averaged over
//    an exponential lambda of mean nbar; at nbar = 0.1, two or more clicks in 0.47% and 0.83% of windows;
//  - the clicks: a coherent source's are a Poisson process of steady rate; a thermal source's a Poisson process whose
//    rate is the intensity I = |E|^2 of a complex Gaussian field E (exponentially distributed, <I^2>/<I>^2 = 2) with
//    the coherence time tau_c = integral of |g1(tau)|^2 d tau; the pair source's the thermal source's, given to both
//    detectors at once. A long run of each, counted in windows short against tau_c, gives g2 = 1, g2 = 2 and
//    g2_12 = 2 + 1/nbar (the chapter's boxed results) within their statistical errors;
//  - the phase plane, in section 8.3's units u = x / x_zp and w = p / m omega x_zp: the ground state's spread 1 in
//    both; the squeezed vacuum S|0> at r = 0.6, built in the levels from the series of S = e^{rK}, K = (a^2 -
//    a^dagger^2)/2, with spreads e^{-0.6} = 0.55 along u and e^{0.6} = 1.82 along w, product 1, nbar = sinh^2 0.6 =
//    0.405 and only even counts; the thermal state of nbar = 1.5, whose spread along u and along w is
//    sqrt(2 nbar + 1) = 2 (from the geometric law, the levels' <n|(a + a^dagger)^2|n> = 2n + 1).
import { palette } from './tut-quantum-lib.js';
import { near } from './tut-operators-lib.js';
import { uniforms, normals } from './tut-prob-lib.js';

export { palette, near, uniforms, normals };

// ---- the count laws ----------------------------------------------------------------------------------------------
export const NBAR = 4;                 // the bars' common mean
export const NMAX = 14;                // the bars run from n = 0 to 14
/** The coherent state's count law, e^{-nbar} nbar^n / n!, by logarithms. */
export function poisson(nbar, n) {
	let lf = 0;
	for (let k = 2; k <= n; k++) lf += Math.log(k);
	return Math.exp(n * Math.log(nbar) - nbar - lf);
}
/** The thermal state's, nbar^n / (1 + nbar)^{n+1}. */
export const geometric = (nbar, n) => Math.exp(n * Math.log(nbar) - (n + 1) * Math.log(1 + nbar));
/** The values the diagram's comment lists. */
export const POISSON_4 = ['0.018', '0.073', '0.147', '0.195', '0.195', '0.156', '0.104', '0.060', '0.030', '0.013', '0.005'];
export const GEOMETRIC_4 = ['0.200', '0.160', '0.128', '0.102', '0.082', '0.066', '0.052', '0.042', '0.034', '0.027', '0.021', '0.017', '0.014', '0.011', '0.009'];

// ---- the clicks --------------------------------------------------------------------------------------------------
export const CLICKS = 40;              // clicks on each axis
export const TAU = 1 / 40;             // the coherence time, as a fraction of the axis
const DT = 1 / 4000;                   // the field's grid, as a fraction of the axis
const REACH = 5;                       // the kernel is cut at five of its standard deviations

/**
 * A thermal intensity on [0, T] (T in axis lengths): I = |E|^2 / <|E|^2> on a grid of step dt (default DT), with E complex
 * Gaussian white noise smoothed by a Gaussian kernel of standard deviation s = tau / sqrt(2 pi). The field's
 * correlation is then g1(t) = exp(-t^2 / 4 s^2), so |g1|^2 = exp(-t^2 / 2 s^2), whose integral, the coherence time, is
 * s sqrt(2 pi) = tau. The normalization is the kernel's exact sum of squares, not the sample's.
 */
export function intensity(seed, T = 1, tau = TAU, dt = DT) {
	const g = normals(seed), s = tau / Math.sqrt(2 * Math.PI), h = Math.ceil((REACH * s) / dt);
	const k = Array.from({ length: 2 * h + 1 }, (_, i) => Math.exp(-(((i - h) * dt) ** 2) / (2 * s * s)));
	const k2 = k.reduce((a, v) => a + v * v, 0);
	const n = Math.round(T / dt) + 1, re = new Float64Array(n + 2 * h), im = new Float64Array(n + 2 * h);
	for (let i = 0; i < re.length; i++) { re[i] = g(); im[i] = g(); }
	const I = new Float64Array(n);
	for (let i = 0; i < n; i++) {
		let a = 0, b = 0;
		for (let j = 0; j <= 2 * h; j++) { a += k[j] * re[i + j]; b += k[j] * im[i + j]; }
		I[i] = (a * a + b * b) / (2 * k2);
	}
	return { I, dt: dt, T };
}

/** `count` click times on [0, T] drawn independently from the density in proportion to the intensity: a Poisson
 * process of rate I(t), given its number of clicks. A steady intensity gives independent uniform times. */
export function clicksGiven(seed, count, path = null, T = 1) {
	const u = uniforms(seed);
	if (!path) return Array.from({ length: count }, () => u() * T).sort((a, b) => a - b);
	const { I, dt } = path, c = new Float64Array(I.length);
	for (let i = 1; i < I.length; i++) c[i] = c[i - 1] + 0.5 * (I[i - 1] + I[i]) * dt;
	const total = c[c.length - 1];
	const out = [];
	for (let m = 0; m < count; m++) {
		const v = u() * total;
		let lo = 0, hi = c.length - 1;
		while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (c[mid] <= v) lo = mid; else hi = mid; }
		out.push((lo + (v - c[lo]) / (c[hi] - c[lo] || 1)) * dt);
	}
	return out.sort((a, b) => a - b);
}

/** A Poisson process of rate `rate` (clicks per axis length) times the intensity, counted in windows of `win`: the
 * count in each window (exactly, by drawing the Poisson count of each window's integrated rate). */
export function windowCounts(seed, rate, win, path = null, T = 1) {
	const u = uniforms(seed);
	const poissonDraw = (m) => { let n = 0, p = Math.exp(-m), s = p, v = u(); while (v > s && n < 1000) { n++; p *= m / n; s += p; } return n; };
	const W = Math.floor(T / win), out = new Int32Array(W);
	for (let w = 0; w < W; w++) {
		let m = rate * win;
		if (path) {
			const a = Math.round((w * win) / path.dt), b = Math.round(((w + 1) * win) / path.dt);
			let s = 0;
			for (let i = a; i < b; i++) s += 0.5 * (path.I[i] + path.I[i + 1]) * path.dt;
			m = rate * s;
		}
		out[w] = poissonDraw(m);
	}
	return out;
}
const mean = (xs) => xs.reduce((s, x) => s + x, 0) / xs.length;
/** g2 = <n(n - 1)> / nbar^2 of counts, and the cross <n1 n2> / nbar1 nbar2 of two detectors' counts. */
export const g2 = (n) => mean(Array.from(n, (x) => x * (x - 1))) / mean(Array.from(n)) ** 2;
export const g12 = (n1, n2) => mean(Array.from(n1, (x, i) => x * n2[i])) / (mean(Array.from(n1)) * mean(Array.from(n2)));

// ---- the phase plane: u = x / x_zp = a + a^dagger, w = p / m omega x_zp = -i (a - a^dagger) ------------------------
export const R_SQ = 0.6;               // the squeezing parameter
export const N_THERMAL = 1.5;          // the thermal state's mean count
export const COHERENT = [3, 2];        // the coherent state's centre (chosen for clarity): alpha = 1.5 + i
export const thermalSpread = (nbar) => Math.sqrt(2 * nbar + 1);

/** S|0> = e^{rK}|0>, K = (a^2 - a^dagger^2)/2, in the levels 0..N - 1, by the exponential's series on the vector. */
export function squeezedVacuum(r, N = 80) {
	const K = (v) => {
		const out = new Float64Array(N);
		for (let n = 0; n < N; n++) {
			if (n + 2 < N) out[n] += 0.5 * Math.sqrt((n + 1) * (n + 2)) * v[n + 2];    // a^2 |n+2> = sqrt((n+2)(n+1)) |n>
			if (n >= 2) out[n] -= 0.5 * Math.sqrt(n * (n - 1)) * v[n - 2];             // a^dagger^2 |n-2> = sqrt(n(n-1)) |n>
		}
		return out;
	};
	let term = new Float64Array(N); term[0] = 1;
	const sum = Float64Array.from(term);
	for (let k = 1; k < 200; k++) {
		term = K(term).map((x) => (x * r) / k);
		for (let n = 0; n < N; n++) sum[n] += term[n];
	}
	return sum;
}
/** <v|(a + a^dagger)^2|v> and <v|(a - a^dagger)^2|v> (real amplitudes; the second with its sign, so -<w^2>), and
 * <v|a^dagger a|v>, for a real vector of amplitudes in the levels. */
export function moments(v) {
	const N = v.length;
	let uu = 0, ww = 0, n = 0, len = 0;
	for (let m = 0; m < N; m++) {
		len += v[m] * v[m];
		n += m * v[m] * v[m];
		// (a +- a^dagger)^2 = a^2 + a^dagger^2 +- (2 a^dagger a + 1)
		const diag = (2 * m + 1) * v[m] * v[m];
		const off = m + 2 < N ? 2 * Math.sqrt((m + 1) * (m + 2)) * v[m] * v[m + 2] : 0;
		uu += off + diag;
		ww += off - diag;
	}
	return { uu, ww: -ww, n, len };
}

/** The chapter's statements behind the three figures, asserted against its text, and the numbers computed. */
export async function chapter(check) {
	const md = await (await fetch('/tutorial/quantum/counting-quanta.md')).text();
	const flat = md.replace(/<!--[\s\S]*?-->/g, ' ').replace(/\s+/g, ' ');
	const has = (s, what) => check(flat.includes(s), `the chapter does not say ${what}: ${s}`);

	// ---- the two count laws
	has('$$\\boxed{\\sym{count-distribution}{P}(n) = |\\psi_n|^2 = \\frac{e^{-\\bar n}\\,\\bar n^n}{n!}} ,$$', 'the Poisson law');
	has('$$\\boxed{P(n) = \\frac{\\bar n^n}{(1 + \\bar n)^{n+1}}} .$$', 'the geometric law');
	has('$$\\boxed{\\langle n^2\\rangle - \\bar n^2 = \\bar n + \\bar n^2} .$$', 'the thermal variance');
	has('A coherent mode with $\\bar n = 4$ gives counts of variance 4, a spread of 2 about the mean; the counts 3 and 4 are the likeliest, each with the probability 0.195.', 'the coherent numbers');
	has('With $\\bar n = 4$ the likeliest count is zero, with the probability 0.20, where a coherent mode gives zero only 1.8% of the time', 'the thermal numbers');
	has('average the Poisson law over $\\lambda = |\\alpha|^2$, which is exponential with the mean $\\bar n$: the integral gives the geometric law', 'the mixture');
	const P = Array.from({ length: 200 }, (_, n) => poisson(NBAR, n)), G = Array.from({ length: 400 }, (_, n) => geometric(NBAR, n));
	POISSON_4.forEach((s, n) => check(P[n].toFixed(3) === s, `P(${n}) = ${P[n]} for the coherent mode, not ${s}`));
	GEOMETRIC_4.forEach((s, n) => check(G[n].toFixed(3) === s, `P(${n}) = ${G[n]} for the thermal mode, not ${s}`));
	const mom = (Q) => { const s0 = Q.reduce((a, p) => a + p, 0), s1 = Q.reduce((a, p, n) => a + n * p, 0), s2 = Q.reduce((a, p, n) => a + n * n * p, 0); return [s0, s1, s2 - s1 * s1]; };
	const [p0, p1, pv] = mom(P), [q0, q1, qv] = mom(G);
	check(near(p0, 1, 1e-12) && near(p1, NBAR, 1e-12) && near(pv, NBAR, 1e-10), `the Poisson moments ${p0}, ${p1}, ${pv}`);
	check(near(q0, 1, 1e-12) && near(q1, NBAR, 1e-10) && near(qv, NBAR + NBAR * NBAR, 1e-9), `the geometric moments ${q0}, ${q1}, ${qv}`);
	check(Math.sqrt(pv).toFixed(1) === '2.0' && Math.sqrt(qv).toFixed(1) === '4.5', 'the standard deviations are not 2 and 4.5');
	check(near(P[3], P[4], 1e-14) && P.every((p, n) => p <= P[3] * (1 + 1e-14)) && P[3].toFixed(3) === '0.195', 'the likeliest coherent counts are not 3 and 4');
	check(G.every((p) => p <= G[0]) && G[0].toFixed(2) === '0.20' && (100 * P[0]).toFixed(1) === '1.8', 'the thermal mode is not most often empty');
	// the geometric law is the Poisson law averaged over an exponential lambda of mean nbar
	for (const n of [0, 1, 4, 9, 14]) {
		let s = 0;
		const top = 80, m = 40000, h = top / m;
		for (let i = 0; i <= m; i++) { const l = i * h, w = i === 0 || i === m ? 1 : i % 2 ? 4 : 2; s += w * (l === 0 ? (n === 0 ? 1 : 0) : poisson(l, n)) * Math.exp(-l / NBAR) / NBAR; }
		check(near((s * h) / 3, G[n], 1e-8), `the mixture of Poisson laws gives ${(s * h) / 3} at n = ${n}, not ${G[n]}`);
	}
	// at nbar = 0.1, two or more clicks
	has('with $\\bar n = 0.1$ in a window, two or more clicks come in 0.47% of windows for a coherent mode and 0.83% for a thermal one', 'the small-nbar numbers');
	check((100 * (1 - poisson(0.1, 0) - poisson(0.1, 1))).toFixed(2) === '0.47' && (100 * (1 - geometric(0.1, 0) - geometric(0.1, 1))).toFixed(2) === '0.83', 'two or more clicks at nbar = 0.1');

	// ---- g2 and the clicks
	has('$$\\boxed{g^{(2)} = 1 \\ \\text{(coherent)} , \\qquad g^{(2)} = 2 \\ \\text{(thermal)}} .$$', 'g2 of the two');
	has('$$\\boxed{g^{(2)}_{12} = 2 + \\frac{1}{\\bar n}} .$$', 'the pair\'s g2_12');
	has('**Each mode alone is thermal.**', 'that each mode of the pair is thermal');
	has('In every term of $|\\Psi\\rangle$ both counts equal $n$', 'that the pair\'s counts are equal');
	has('the time over which a wave keeps its phase', 'the coherence time');
	{
		// the field's statistics over a long run: the intensity exponential, <I^2>/<I>^2 = 2, the coherence time tau
		// (the tolerances: four standard errors of a sample of T / tau independent cells, from the exponential law's
		// moments <I^k> = k!)
		const T = 200, path = intensity(17, T), I = path.I, n = I.length, cells = T / TAU;
		const err = (k, f) => 4 * Math.sqrt((f(2 * k) - f(k) ** 2) / cells), fact = (k) => (k <= 1 ? 1 : k * fact(k - 1));
		const m1 = mean(Array.from(I)), m2 = mean(Array.from(I, (x) => x * x)), m3 = mean(Array.from(I, (x) => x * x * x));
		check(Math.abs(m1 - 1) < err(1, fact) && Math.abs(m2 - 2) < err(2, fact) && Math.abs(m3 - 6) < err(3, fact), `the intensity's moments ${m1}, ${m2}, ${m3}: not exponential`);
		let area = 0;
		const lag = Math.round((4 * TAU) / path.dt);
		for (let k = -lag; k <= lag; k++) {
			let s = 0, c = 0;
			for (let i = Math.max(0, -k); i < n - Math.max(0, k); i += 7) { s += I[i] * I[i + k]; c++; }
			area += (s / c / (m1 * m1) - 1) * path.dt;
		}
		check(Math.abs(area / TAU - 1) < 0.08, `the intensity's correlation gives a coherence time of ${area / TAU} tau`);
		// clicks counted in windows of tau / 10: g2 = 1 (steady), 2 (thermal) and g2_12 = 2 + 1/nbar (pairs)
		const win = TAU / 10, rate = 1 / win;                     // one click per window on average
		const c = windowCounts(5, rate, win, null, T), t = windowCounts(6, rate, win, path, T);
		const nb = mean(Array.from(t));
		const a = g2(c), b = g2(t), x = g12(t, t);
		check(Math.abs(a - 1) < 0.03 && Math.abs(b - 2) < err(2, fact) && near(x, b + 1 / nb, 1e-12) && Math.abs(x - 3) < 2 * err(2, fact), `the long runs give g2 = ${a}, ${b} and g2_12 = ${x} (2 + 1/nbar = ${2 + 1 / nb})`);
		check(Math.abs(nb - 1) < err(1, fact), `the thermal run's mean ${nb} per window`);
	}

	// ---- the phase plane
	has('$$\\sigma_x = e^{-r}x_{\\rm zp} , \\qquad \\sigma_{p/\\matter m\\omega} = e^{r}x_{\\rm zp} .$$', 'the squeezed spreads');
	has('$$\\boxed{\\bar n = \\sinh^2r}$$', 'the squeezed count');
	has('At $r = 0.6$ the spread in $x$ is $0.55\\,x_{\\rm zp}$, and the mode holds $\\bar n = 0.405$ quanta.', 'the squeezed numbers');
	has('Its blob is an ellipse of the same area, narrower than the zero point in $x$ and wider in $p$', 'the same area');
	has('the ground state is a round blob with the spread $x_{\\rm zp}$ in both, a coherent state is the same blob moved, and a thermal state is a wider round blur centred at the origin', 'the three blobs');
	has('$$x = x_{\\rm zp}\\,(a + a^\\dagger) , \\qquad \\frac{p}{\\matter m\\omega} = -i\\,x_{\\rm zp}\\,(a - a^\\dagger) .$$', 'the quadratures');
	const v = squeezedVacuum(R_SQ), q = moments(v), g = moments(Float64Array.from({ length: 80 }, (_, n) => (n === 0 ? 1 : 0)));
	check(near(g.uu, 1, 1e-15) && near(g.ww, 1, 1e-15), 'the ground state\'s spreads are not 1');
	check(near(q.len, 1, 1e-12), `S|0> has length ${q.len}`);
	check(near(Math.sqrt(q.uu), Math.exp(-R_SQ), 1e-10) && near(Math.sqrt(q.ww), Math.exp(R_SQ), 1e-10), `the squeezed spreads ${Math.sqrt(q.uu)}, ${Math.sqrt(q.ww)}`);
	check(near(Math.sqrt(q.uu * q.ww), 1, 1e-10), 'the squeezed ellipse has not the zero point\'s area');
	check(near(q.n, Math.sinh(R_SQ) ** 2, 1e-10) && q.n.toFixed(3) === '0.405', `the squeezed count ${q.n}`);
	check(v.every((x, n) => n % 2 === 0 || x === 0), 'the squeezed vacuum holds an odd count');
	check(Math.exp(-R_SQ).toFixed(2) === '0.55' && Math.exp(R_SQ).toFixed(2) === '1.82', 'e^{-+0.6} are not 0.55 and 1.82');
	// the thermal state: <n|(a + a^dagger)^2|n> = 2n + 1 over the geometric law
	{
		let s = 0;
		for (let n = 0; n < 2000; n++) s += geometric(N_THERMAL, n) * (2 * n + 1);
		check(near(Math.sqrt(s), thermalSpread(N_THERMAL), 1e-12) && thermalSpread(N_THERMAL) === 2, `the thermal spread ${Math.sqrt(s)}`);
	}
	// the coherent state at (3, 2): alpha = 1.5 + i, <u> = 2 Re alpha, <w> = 2 Im alpha, spreads 1
	check(COHERENT[0] === 2 * 1.5 && COHERENT[1] === 2 * 1, 'the coherent centre');
	return { md, P, G, squeezed: q };
}
