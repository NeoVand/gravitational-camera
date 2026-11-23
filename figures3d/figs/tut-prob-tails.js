// The tutorial, chapter 3.1 (tutorial/noise/probability.md), its second diagram: the tails of the Gaussian. The
// standard Gaussian density p(Z) = exp(-Z^2/2) / sqrt(2 pi), with the bands within one, two and three standard
// deviations of the mean shaded in the noise's colour (blue), one over another, and named under the axis by their
// probabilities, 68.3%, 95.4% and 99.73%; and the one-sided tail beyond Z = 3 filled in full blue under the true
// curve (a sliver, p(3) = 0.0044), named by its area, P(Z > 3) = 1.35 x 10^-3, with the density over Z >= 3 drawn
// again twenty times taller as a dashed curve, from 20 p(3) = 0.089 falling to the right, so that its shape shows.
// Exact: the curve (sampled every quarter of a point along its length), the bands' edges, the tail, and the four
// probabilities, computed here (the series of erf and the continued fraction of the Mills ratio, tut-prob-lib.js)
// and asserted against the numbers the chapter prints. Nothing is schematic; the magnification is exactly 20.
import { Sheet, ORIGIN, finish, checker, near, placed, n2 } from './tut-pot-lib.js';
import {
	gauss, upper, Plot, xAxis, yAxis, dimension, pathOf, NOISE, CURVE, INK, DIM, LABEL_GAP, END, DIM_LINE
} from './tut-prob-lib.js';

const name = 'tut-prob-tails';
const check = checker(name);

export const BANDS = [1, 2, 3];
export const PRINTED = ['68.3\\%', '95.4\\%', '99.73\\%'];
export const MAG = 20;                  // the tail's magnification

// ---- the drawing ---------------------------------------------------------------------------------------------
const ZMAX = 4;
const W = 248, H = 104;                 // the data rectangle: Z from -4 to 4, p from 0 to 0.42
const PMAX = 0.42;
const SHADE = 0.13;                     // each band's opacity of the blue; they lie one over another
const ROW = 11.5;                       // the bands' names: from one row to the next
const FIRST = 8.5;                      // the first row, this far under the numbers' line

/** Points along the graph of f on [a, b], no two more than a quarter of a point apart on the page. */
function graph(P, f, a, b) {
	const pts = [P.at(a, f(a))];
	let z = a;
	while (z < b) {
		let dz = 0.25 / P.w * (P.x1 - P.x0);
		// shorten the step where the curve is steep
		for (let i = 0; i < 8; i++) {
			const [x0, y0] = P.at(z, f(z)), [x1, y1] = P.at(Math.min(b, z + dz), f(Math.min(b, z + dz)));
			if (Math.hypot(x1 - x0, y1 - y0) <= 0.25) break;
			dz /= 2;
		}
		z = Math.min(b, z + dz);
		pts.push(P.at(z, f(z)));
	}
	return pts;
}

export default async function () {
	// ---- the probabilities the chapter prints
	const within = BANDS.map((k) => 1 - 2 * upper(k));
	const shown = within.map((p, i) => (100 * p).toFixed(i === 2 ? 2 : 1) + '\\%');
	shown.forEach((s, i) => check(s === PRINTED[i], `within ${BANDS[i]}: ${s}, not ${PRINTED[i]}`));
	const tail = upper(3);
	check(tail.toExponential(2) === '1.35e-3', `P(Z > 3) is ${tail}, not 1.35 x 10^-3`);
	check(Math.round(1 / tail) === 741, `one reading in ${1 / tail}, not about 740`);
	check(near(upper(0.905), 0.18, 0.005), `P(Z > 0.905) is ${upper(0.905)}, not 0.18`);
	// the two evaluations of the tail agree where they meet
	check(near(1 - 2 * upper(1.4999999), 1 - 2 * upper(1.5000001), 1e-7), 'the series and the continued fraction disagree');

	const S = new Sheet(name);
	const P = new Plot({ left: ORIGIN - W / 2, top: ORIGIN - H / 2, w: W, h: H, x0: -ZMAX, x1: ZMAX, y0: 0, y1: PMAX });
	const L = [];

	// ---- the bands, under the curve, one over another
	for (const k of BANDS) {
		const pts = [P.at(-k, 0), ...graph(P, gauss, -k, k), P.at(k, 0)];
		S.raw(`<path d="${pathOf(pts)}" fill="${NOISE}" fill-opacity="${SHADE}"/>`, 0.2);
	}
	// ---- the tail beyond 3, at true scale and magnified
	// the true tail: the fill under the curve itself, beyond 3
	check(gauss(3).toFixed(4) === '0.0044', `p(3) is ${gauss(3)}, not 0.0044`);
	S.raw(`<path d="${pathOf([P.at(3, 0), ...graph(P, gauss, 3, ZMAX), P.at(ZMAX, 0)])}" fill="${NOISE}"/>`, 0.3);
	// the magnified density, over Z >= 3 only: from 20 p(3) = 0.089, falling to the right
	const big = (z) => MAG * gauss(z);
	check(big(3).toFixed(3) === '0.089' && big(ZMAX) < big(3) / 20, `20 p(3) is ${big(3)}`);
	check(P.Y(0) - P.Y(gauss(3)) < 1.2, 'the true tail is not a sliver');
	S.path(graph(P, big, 3, ZMAX), { color: DIM, width: 0.45, layer: 1.5, dash: [1.6, 1.2], what: 'the magnified curve' });

	// ---- the curve itself
	S.path(graph(P, gauss, -ZMAX, ZMAX), { color: INK, width: CURVE, layer: 2, what: 'the Gaussian' });

	// ---- the axes
	const xl = await xAxis(S, P, { ticks: [-3, -2, -1, 0, 1, 2, 3], fmt: (t) => (t < 0 ? `-${-t}` : `${t}`), what: 'the Z axis' });
	L.push(...xl);
	const last = xl[xl.length - 1];
	L.push(await placed('Z', P.right + 4, (last.box.t + last.box.b) / 2, 0, 0.5, DIM));
	L.push(...(await yAxis(S, P, { ticks: [0, 0.2, 0.4], fmt: (t) => (t ? t.toFixed(1) : '0'), what: 'the density axis' })));
	L.push(await placed('p(Z)', P.left + 4.5, P.Y(PMAX), 0, 0.5, DIM));

	// ---- the bands' names: nested lines under the axis, each broken around its probability
	const base = Math.max(...xl.map((l) => l.box.b));
	for (const [i, k] of BANDS.entries()) {
		const y = base + FIRST + i * ROW;
		const lab = await placed(PRINTED[i], P.X(0), y, 0.5, 0.5, NOISE);
		L.push(lab);
		const a = P.X(-k), b = P.X(k), gl = lab.box.l - LABEL_GAP - 0.4, gr = lab.box.r + LABEL_GAP + 0.4;
		dimension(S, a, gl, y, { ends: [true, false], what: `the band ${k}, left` });
		dimension(S, gr, b, y, { ends: [false, true], what: `the band ${k}, right` });
	}

	// ---- the tail's names
	// beside the magnified curve, above and to its right
	L.push(await S.clear(`\\times ${MAG}`, P.X(3.3), P.Y(big(3.3)), 0, 1, [0.6, -0.8], { color: DIM }));
	// the tail's area, named as the bands are: a line from Z = 3 toward larger Z, on the first row
	const y1 = base + FIRST;
	S.path([[P.X(3), y1 - END], [P.X(3), y1 + END]], { color: NOISE, width: DIM_LINE, layer: 3, cap: 'butt', what: 'the tail\'s start' });
	const arrow = S.arrow([P.X(3), y1], [P.X(ZMAX), y1], { color: NOISE, width: DIM_LINE, head: 3.4, layer: 3, what: 'the tail\'s line' });
	L.push(await placed('1.35 \\times 10^{-3}', arrow.B[0] + LABEL_GAP + 0.6, y1, 0, 0.5, NOISE));

	S.checkAll(L);
	window.tutProbTails = { within, tail };
	void n2;
	return finish(S, L, [240, 340]);
}
