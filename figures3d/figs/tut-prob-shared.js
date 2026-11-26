// The tutorial, section 3.1 (tutorial/noise/probability.md), its third diagram: a gradiometer removes what its two
// halves share. Two accelerometers on one shaking table read a1 = g1 + u + n1 and a2 = g2 + u + n2: the same large
// shaking u in both, and each its own small noise. Left, over four seconds, the two traces one above the other and,
// under them on the same scale, their difference a1 - a2 = (g1 - g2) + n1 - n2: a quiet trace about the steady
// signal g1 - g2 (orange), with the band of one standard deviation of its noise about it (blue). Right, a1 against
// a2, every sample a dot: a thin cloud along a line of slope one, with the correlation r printed beside it.
// Exact, from the draws (seed 7): the shaking, a sum of eight sines of frequencies between 0.6 and 3 Hz with seeded
// amplitudes and phases, scaled so that its sample standard deviation is 1; the own noises, white, each scaled to the
// sample standard deviation 0.12; 50 samples a second. The correlation printed is the samples', asserted to agree to
// two decimals with sigma_u^2 / (sigma_u^2 + sigma_n^2) = 0.986, and the band's half-width is the sample standard
// deviation of the difference, asserted to agree with sqrt(2) 0.12 = 0.17 within 5%. Schematic, and to be called
// so: the units, arbitrary (the shaking's standard deviation is one), and the size of g1 - g2 against the noise.
import { Sheet, ORIGIN, finish, checker, near, placed } from './tut-pot-lib.js';
import {
	normals, uniforms, mean, sd, corr, Plot, xAxis, pathOf, SIGNAL, NOISE, DATA, MARK, INK, DIM, LABEL_GAP
} from './tut-prob-lib.js';

const name = 'tut-prob-shared';
const check = checker(name);

// ---- the simulation (arbitrary units: the shaking's standard deviation is 1) -----------------------------------
export const T = 4;                     // s
export const RATE = 50;                 // samples a second
export const SIGMA_U = 1;               // the shaking
export const SIGMA_N = 0.13;            // each accelerometer's own noise
export const G1 = 0.8, G2 = 0;          // the two gravitational fields; only their difference is drawn as such
export const SEED = 7;

export function simulate() {
	const z = normals(SEED), u01 = uniforms(SEED + 1);
	const n = T * RATE + 1;
	const t = Array.from({ length: n }, (_, i) => i / RATE);
	const waves = Array.from({ length: 8 }, () => ({ f: 0.6 + 2.4 * u01(), a: 0.4 + u01(), p: 2 * Math.PI * u01() }));
	let u = t.map((s) => waves.reduce((acc, w) => acc + w.a * Math.sin(2 * Math.PI * w.f * s + w.p), 0));
	const mu = mean(u), su = sd(u);
	u = u.map((x) => ((x - mu) / su) * SIGMA_U);
	const own = () => { const e = t.map(() => z()); const m = mean(e), s = sd(e); return e.map((x) => ((x - m) / s) * SIGMA_N); };
	const n1 = own(), n2 = own();
	const a1 = t.map((_, i) => G1 + u[i] + n1[i]);
	const a2 = t.map((_, i) => G2 + u[i] + n2[i]);
	const d = t.map((_, i) => a1[i] - a2[i]);
	return { t, u, n1, n2, a1, a2, d };
}

// ---- the drawing ---------------------------------------------------------------------------------------------
const TW = 132;                         // the traces' width: four seconds
const UNIT = 8;                         // points per unit of acceleration, the same in all three traces
const PITCH = [0, 42, 76];              // the three traces' zero lines, from the first
                                        // the scatter's side: from the first trace's zero line to the time axis
const GAP = 16;                         // from the traces to the scatter
const DOT = 0.75;                       // a sample in the scatter, its diameter

export default async function () {
	const { t, a1, a2, d, n1, n2 } = simulate();
	const r = corr(a1, a2), model = SIGMA_U ** 2 / (SIGMA_U ** 2 + SIGMA_N ** 2);
	check(r.toFixed(2) === model.toFixed(2), `the samples' correlation is ${r}, not ${model.toFixed(3)}`);
	const sdD = sd(d);
	check(near(sdD / (Math.SQRT2 * SIGMA_N), 1, 0.05), `the difference's spread is ${sdD}, not sqrt 2 x ${SIGMA_N}`);
	check(near(mean(d), G1 - G2, 1e-12), 'the difference does not average to g1 - g2');
	check(Math.abs(corr(n1, n2)) < 0.15, 'the own noises are correlated');

	const S = new Sheet(name);
	const L = [];
	const x0 = ORIGIN - (TW + GAP + 100) / 2, ytop = ORIGIN - 70;
	const X = (s) => x0 + (s / T) * TW;
	const rows = [
		{ v: a1, name: 'a_1', zero: ytop + PITCH[0] },
		{ v: a2, name: 'a_2', zero: ytop + PITCH[1] },
		{ v: d, name: 'a_1 - a_2', zero: ytop + PITCH[2] }
	];

	// ---- the difference's noise and signal, under its trace
	const D = rows[2];
	const sig = D.zero - UNIT * (G1 - G2);
	S.raw(`<path d="${pathOf([[X(0), sig - UNIT * sdD], [X(T), sig - UNIT * sdD], [X(T), sig + UNIT * sdD], [X(0), sig + UNIT * sdD]])}" fill="${NOISE}" fill-opacity="0.2"/>`, 0.2);
	S.path([[X(0), sig], [X(T), sig]], { color: SIGNAL, width: MARK, layer: 2.5, cap: 'butt', what: 'the signal' });

	// ---- the three traces, and a faint zero line under each
	S.path([[X(0), D.zero], [X(T), D.zero]], { color: DIM, width: 0.3, layer: 0.5, cap: 'butt', dash: [1.2, 1.6], what: 'the zero of a1 - a2' });
	for (const row of rows) {
		S.path(t.map((s, i) => [X(s), row.zero - UNIT * row.v[i]]), { color: INK, width: DATA, layer: 2, what: `the trace ${row.name}` });
	}
	for (const row of rows) L.push(await placed(row.name, X(0) - LABEL_GAP - 2.4, row.zero, 1, 0.5, INK));

	// ---- the time axis, under the difference
	const P = { X, bottom: D.zero + UNIT * 1.6 };
	const tp = new Plot({ left: X(0), top: P.bottom - 10, w: TW, h: 10, x0: 0, x1: T, y0: 0, y1: 1 });
	const tl = await xAxis(S, tp, { ticks: [0, 1, 2, 3, 4], what: 'the time axis' });
	L.push(...tl);
	const last = tl[tl.length - 1];
	L.push(await placed('t\\ (\\mathrm{s})', last.box.r + 6, (last.box.t + last.box.b) / 2, 0, 0.5, DIM));

	// ---- the signal's and the noise's names, at the right end of the difference
	L.push(await placed('g_1 - g_2', X(T) + LABEL_GAP + 0.6, sig, 0, 0.5, SIGNAL));

	// ---- the scatter: a1 up, a2 across, the same unit on both, centred on (0, g1)
	// its box runs from the top of the first trace down to the time axis, and holds every sample with air around it
	const atop = ytop - UNIT * Math.max(...a1);
	const SC = tp.bottom - atop;
	const lo = Math.min(...a2, ...a1.map((v) => v - G1)), hi = Math.max(...a2, ...a1.map((v) => v - G1));
	const pad = 0.06 * (hi - lo), sx0 = X(T) + GAP + 38;
	const SP = new Plot({ left: sx0, top: atop, w: SC, h: SC, x0: lo - pad, x1: hi + pad, y0: lo - pad + G1, y1: hi + pad + G1 });
	const dots = a2.map((v, i) => SP.at(v, a1[i]));
	S.raw(`<path d="${dots.map(([x, y]) => `M${x.toFixed(2)},${y.toFixed(2)}h0`).join('')}" stroke="${INK}" stroke-width="${DOT}" stroke-linecap="round" fill="none"/>`, 2);
	for (const p of dots) S.mark([p], DOT / 2, 'a sample');
	S.path([[SP.left, SP.top], [SP.left, SP.bottom], [SP.right, SP.bottom]], { color: DIM, width: 0.45, layer: 1, cap: 'butt', what: 'the scatter\'s axes' });
	L.push(await placed('a_2', SP.right, SP.bottom + LABEL_GAP + 1, 1, 0, DIM));
	L.push(await placed('a_1', SP.left - LABEL_GAP - 1, SP.top, 1, 0, DIM));
	L.push(await S.clear(`r = ${r.toFixed(2)}`, SP.right - 2, SP.Y(G1 + lo + 0.3 * (hi - lo)), 1, 0.5, [0, 1]));

	S.checkAll(L);
	window.tutProbShared = { r, model, sdD };
	return finish(S, L, [240, 340]);
}
