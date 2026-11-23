// The tutorial, chapter 3.1 (tutorial/noise/probability.md), its fourth diagram: a large count is nearly Gaussian.
// The Poisson probabilities P(N) = lambda^N e^-lambda / N! as bars, for the mean counts lambda = 2 (left) and
// lambda = 50 (right), each with the Gaussian of mean lambda and standard deviation sqrt(lambda) drawn over it as a
// thin curve: far off for lambda = 2, whose bars are lopsided because a count cannot be negative, and nearly on the
// bars for lambda = 50. Under each axis, the mean lambda (the signal, orange) and a line from lambda - sqrt(lambda) to
// lambda + sqrt(lambda), one standard deviation of the counting noise on either side (blue).
// Exact: the bars and the curves; the numbers the chapter prints, asserted here: P(0) = 0.135, P(1) = P(2) = 0.271
// for lambda = 2, and P(50) = 0.0563 against the Gaussian's peak 1 / sqrt(2 pi 50) = 0.0564 for lambda = 50; and the
// mean and the variance of each distribution, summed from the bars, equal to lambda. Nothing is schematic.
import { Sheet, ORIGIN, finish, checker, near, placed } from './tut-pot-lib.js';
import { RULE } from '../lib.js';
import {
	Plot, merge, xAxis, yAxis, dimension, SIGNAL, NOISE, CURVE, INK, DIM, LABEL_GAP, MARK
} from './tut-prob-lib.js';

const name = 'tut-prob-poisson';
const check = checker(name);

/** P(N) for the mean lambda, by the logarithm of the factorial, exact to rounding for the counts drawn here. */
export function poisson(lambda, N) {
	let lf = 0;
	for (let k = 2; k <= N; k++) lf += Math.log(k);
	return Math.exp(N * Math.log(lambda) - lambda - lf);
}
export const normal = (mu, s) => (x) => Math.exp(-((x - mu) ** 2) / (2 * s * s)) / (Math.sqrt(2 * Math.PI) * s);

// ---- the drawing ---------------------------------------------------------------------------------------------
const H = 92;                           // both panels' height
const PANELS = [
	{ lambda: 2, n0: -2.5, n1: 8.5, w: 112, ticks: [0, 2, 4, 6, 8], yTicks: [0, 0.1, 0.2, 0.3], yMax: 0.3, bar: 0.62 },
	{ lambda: 50, n0: 24.5, n1: 75.5, w: 150, ticks: [30, 40, 50, 60, 70], yTicks: [0, 0.02, 0.04, 0.06], yMax: 0.06, bar: 0.62 }
];
const BETWEEN = 44;                     // from the first panel's right edge to the second's axis
const DROP = 9;                         // the noise's line, this far under the numbers

export default async function () {
	// ---- the numbers the chapter prints
	const p2 = [0, 1, 2].map((N) => poisson(2, N));
	check(p2[0].toFixed(3) === '0.135' && p2[1].toFixed(3) === '0.271' && p2[2].toFixed(3) === '0.271', `P(0..2) for 2: ${p2}`);
	check(near(p2[1], p2[2], 1e-15), 'P(1) and P(2) differ for lambda = 2');
	check(poisson(50, 50).toFixed(4) === '0.0563', `P(50) for 50 is ${poisson(50, 50)}`);
	check((1 / Math.sqrt(2 * Math.PI * 50)).toFixed(4) === '0.0564', 'the Gaussian peak for 50 is not 0.0564');
	for (const { lambda } of PANELS) {
		let s0 = 0, s1 = 0, s2 = 0;
		for (let N = 0; N < 400; N++) { const p = poisson(lambda, N); s0 += p; s1 += N * p; s2 += N * N * p; }
		check(near(s0, 1, 1e-12) && near(s1, lambda, 1e-10) && near(s2 - s1 * s1, lambda, 1e-9), `the moments for ${lambda}: ${s0}, ${s1}, ${s2 - s1 * s1}`);
	}

	const S = new Sheet(name);
	const L = [];
	const top = ORIGIN - H / 2;
	let left = ORIGIN - (PANELS[0].w + BETWEEN + PANELS[1].w) / 2;
	for (const [i, c] of PANELS.entries()) {
		const P = new Plot({ left, top, w: c.w, h: H, x0: c.n0, x1: c.n1, y0: 0, y1: c.yMax });
		const unit = c.w / (c.n1 - c.n0);
		const half = (c.bar * unit) / 2;
		// ---- the bars, every count with a probability above a thousandth of the tallest
		const tallest = poisson(c.lambda, Math.floor(c.lambda));
		check(tallest < c.yMax * 0.97, `the tallest bar of ${c.lambda} reaches the top`);
		let lostLeft = 0, lostRight = 0;
		const bars = [];
		for (let N = 0; N < 200; N++) {
			const p = poisson(c.lambda, N);
			if (N < c.n0 + 0.5) { lostLeft += p; continue; }
			if (N > c.n1 - 0.5) { lostRight += p; continue; }
			if (P.Y(0) - P.Y(p) < 0.05) continue;
			bars.push(`M${(P.X(N) - half).toFixed(2)},${P.Y(0).toFixed(2)}V${P.Y(p).toFixed(2)}H${(P.X(N) + half).toFixed(2)}V${P.Y(0).toFixed(2)}Z`);
		}
		check(lostLeft + lostRight < 1e-3, `bars off the axis for ${c.lambda}: ${lostLeft + lostRight}`);
		S.raw(`<path d="${bars.join('')}" fill="${RULE}"/>`, 0.5);

		// ---- the Gaussian over the bars, every quarter point along the axis (it is gentle here)
		const g = normal(c.lambda, Math.sqrt(c.lambda));
		const pts = [];
		// drawn where it stands clear of the axis, so that it never lies on the axis as a second line
		const floor = merge(P, CURVE);
		for (let x = c.n0; x <= c.n1 + 1e-9; x += (c.n1 - c.n0) / (4 * c.w)) if (g(x) >= floor) pts.push(P.at(x, g(x)));
		S.path(pts, { color: INK, width: CURVE, layer: 2, what: `the Gaussian for ${c.lambda}` });

		// ---- the axes
		const xl = await xAxis(S, P, { ticks: c.ticks, what: `the axis of counts for ${c.lambda}` });
		L.push(...xl);
		L.push(...(await yAxis(S, P, { ticks: c.yTicks, fmt: (t) => (t ? String(t) : '0'), what: `the probability axis for ${c.lambda}` })));
		if (i === 1) {
			const last = xl[xl.length - 1];
			L.push(await placed('N', P.right + 4, (last.box.t + last.box.b) / 2, 0, 0.5, DIM));
		}
		L.push(await placed(i === 0 ? 'P(N)' : '', P.left + 4.5, P.Y(c.yMax), 0, 0.5, DIM));
		L.push(await placed(`\\lambda = ${c.lambda}`, P.right, P.top + 1, 1, 0, SIGNAL));

		// ---- the signal, a line at the mean up to the curve's peak; the noise, under the axis
		S.path([[P.X(c.lambda), P.bottom], [P.X(c.lambda), P.Y(g(c.lambda)) + CURVE / 2]], { color: SIGNAL, width: MARK, layer: 1.5, cap: 'butt', what: `the mean ${c.lambda}` });
		const base = Math.max(...xl.map((l) => l.box.b)), y = base + DROP;
		const s = Math.sqrt(c.lambda);
		dimension(S, P.X(c.lambda - s), P.X(c.lambda + s), y, { what: `the spread for ${c.lambda}` });
		L.push(await placed(`\\sigma_N = ${s.toFixed(2)}`, P.X(c.lambda + s) + LABEL_GAP + 1.4, y, 0, 0.5, NOISE));
		left += c.w + BETWEEN;
	}

	S.checkAll(L.filter((l) => l.src !== ''));
	return finish(S, L.filter((l) => l.src !== ''), [240, 340]);
}
