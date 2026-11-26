// The tutorial, section 2.5 (tutorial/outside/null-space.md), its third diagram: the flush along the diameter through
// the nugget. The harmonic part rho_h of a nugget at s = 0.25 R, 0.5 R and 0.75 R, in units of m / 4 pi R^3, along the
// diameter from the far wall (-R) through the centre to the near wall (+R), on an axis that is logarithmic from 1 to
// 1000 and nearly linear about zero, down to -0.5: the height is asinh(v / 2a) / ln 10 decades with a = 0.1 (within
// half a per cent of log10(v / a) above 1), so that the values below zero can be drawn and no curve has a kink; the
// dips below zero are shaded. The three curves in matter's colour, of three strengths; all three pass through
// 3 at the centre, where a dashed line at 3 marks the gold spread evenly. At the near wall the peaks 10.5, 46 and 444;
// at the far wall 0.736, -0.074 and -0.385.
// Exact: every curve from the chapter's closed form (3 - 10 t^2 + 8 t^3 cos - t^4) / (1 - 2 t cos + t^2)^(5/2),
// t = s r / R^2, cos = +1 on the near side and -1 on the far side (asserted against the series
// sum (2l + 1)(2l + 3) t^l P_l at 40 points); the printed peaks (asserted, and against (3 + 6t - t^2)/(1 - t)^3), the
// far-wall values (asserted, -2/27 for s = R/2), the value 3 at the centre (asserted) and the mean 3 of the gold
// spread evenly. Nothing is schematic.
import { INK, DIM, FAINT } from '../lib.js';
import { Sheet, ORIGIN, placed, finish, checker, near, AXIS, HAIR, TICK, LABEL_GAP, n2 } from './tut-pot-lib.js';
import { DASH, dashed } from './tut-orb-lib.js';
import { flush, flushSeries, MATTER } from './tut-null-lib.js';

const name = 'tut-null-flush';
const check = checker(name);

export const S_VALUES = [0.25, 0.5, 0.75];
const PEAKS = ['10.5', '46', '444'];
const FAR = ['0.736', '-0.074', '-0.385'];
const STRENGTH = [0.42, 0.68, 1];             // the curves' opacity, s = 0.25 R to 0.75 R
const CURVE = 0.75;                           // a curve's stroke
const DIP = 0.22;                             // the dips' shade

// ---- the drawing (points) ---------------------------------------------------------------------------------------
const W = 196;                                // from the far wall to the near wall
const DEC = 34;                               // a decade of the logarithmic part
const A = 0.1, LOW = -0.6, HIGH = 1000;       // the scale's linear reach; the axis's foot and top
const OFFSET = 34;                            // the left axis stands this far left of the far wall
const DOT = 1.1;

export default async function () {
	// ---- the numbers
	const value = (s, z) => flush(s, Math.abs(z), z >= 0 ? 1 : -1);
	for (const s of S_VALUES) for (let k = 0; k <= 40; k++) {
		const z = -1 + k / 20, mu = z >= 0 ? 1 : -1;
		check(Math.abs(flush(s, Math.abs(z), mu) - flushSeries(s, Math.abs(z), mu)) < 1e-9 * Math.max(1, Math.abs(flush(s, Math.abs(z), mu))), `the closed form departs from the series at s = ${s}, z = ${z}`);
	}
	S_VALUES.forEach((s, k) => {
		const peak = value(s, 1), far = value(s, -1);
		check((s === 0.5 ? peak.toFixed(0) : peak.toFixed(s === 0.75 ? 0 : 1)) === PEAKS[k], `the peak for s = ${s} is ${peak}`);
		check(near(peak, (3 + 6 * s - s * s) / (1 - s) ** 3, 1e-9), 'the peak is not (3 + 6t - t^2)/(1 - t)^3');
		check(far.toFixed(3) === FAR[k], `the far wall for s = ${s} is ${far}`);
		check(near(value(s, 0), 3, 1e-12), 'the centre is not 3');
	});
	check(near(value(0.5, -1), -2 / 27, 1e-12) && near(value(0.5, 1), 46, 1e-12), 'the flush for s = R/2 is not 46 and -2/27');
	check(value(0.75, 1) < HIGH && Math.min(...S_VALUES.map((s) => value(s, -1))) > LOW, 'a curve runs off the axis');

	const S = new Sheet(name);
	const X0 = ORIGIN - W / 2, X1 = ORIGIN + W / 2;               // the far and the near wall
	const Y0 = ORIGIN + 40;                                        // zero
	const xOf = (z) => X0 + ((z + 1) / 2) * W;
	const yOf = (v) => Y0 - (DEC * Math.asinh(v / (2 * A))) / Math.LN10;
	for (const v of [1, 10, 100, 1000]) check(Math.abs((Y0 - yOf(v)) / DEC - Math.log10(v / A)) < 0.005, 'the axis is not logarithmic above 1');
	const yBottom = yOf(LOW), yTop = yOf(HIGH), xAxis = X0 - OFFSET;

	// ---- the axes: the left one, and the bottom one from it to the near wall
	S.path([[xAxis, yTop], [xAxis, yBottom]], { color: DIM, width: AXIS, layer: 2, cap: 'butt', what: 'the left axis' });
	S.path([[xAxis, yBottom], [X1, yBottom]], { color: DIM, width: AXIS, layer: 2, cap: 'butt', what: 'the bottom axis' });
	const L = [];
	// the decades, and zero
	for (const [v, src] of [[1000, '1000'], [100, '100'], [10, '10'], [1, '1'], [0, '0']]) {
		S.path([[xAxis, yOf(v)], [xAxis - TICK, yOf(v)]], { color: DIM, width: HAIR, layer: 2, cap: 'butt', what: `the tick ${src}` });
		L.push(await placed(src, xAxis - TICK - 2.4, yOf(v), 1, 0.5, DIM));
	}
	for (const [z, src, word] of [[-1, '-R', 'far wall'], [0, '0', 'centre'], [1, 'R', 'near wall']]) {
		S.path([[xOf(z), yBottom], [xOf(z), yBottom + TICK]], { color: DIM, width: HAIR, layer: 2, cap: 'butt', what: `the tick ${src}` });
		const l = await placed(src, xOf(z), yBottom + TICK + 2.4, 0.5, 0, DIM);
		L.push(l);
		if (word !== 'centre') L.push(await placed(`\\text{${word}}`, xOf(z), l.box.b + 2.2, 0.5, 0, DIM));
	}
	L.push(await placed('\\rho_h\\ (m/4\\pi R^3)', xAxis, yTop - 6, 0.5, 1, MATTER));

	// ---- zero, and the gold spread evenly (dashed, at 3)
	S.path([[X0, yOf(0)], [X1, yOf(0)]], { color: FAINT, width: HAIR, layer: 0, cap: 'butt', what: 'zero' });
	dashed(S, [X0, yOf(3)], [X1, yOf(3)], { color: DIM, width: 0.5, layer: 0, what: 'the gold spread evenly' });
	L.push(await placed('\\text{gold spread evenly}', X1 - 2, yOf(3) + 3, 1, 0, DIM));

	// ---- the curves, the dips below zero shaded
	const N = 700;
	for (const [k, s] of S_VALUES.entries()) {
		const pts = Array.from({ length: N + 1 }, (_, i) => { const z = -1 + (2 * i) / N; return [xOf(z), yOf(value(s, z))]; });
		const neg = Array.from({ length: N + 1 }, (_, i) => -1 + (2 * i) / N).filter((z) => value(s, z) < 0);
		if (neg.length) {
			// the dip: from the far wall to where the curve crosses zero (found by bisection), back along zero
			let a = neg[neg.length - 1], b = a + 2 / N;
			for (let j = 0; j < 60; j++) { const m = (a + b) / 2; if (value(s, m) < 0) a = m; else b = m; }
			const zs = Array.from({ length: 200 }, (_, j) => -1 + ((a + 1) * j) / 199);
			const d = 'M' + zs.map((z) => `${n2(xOf(z))},${n2(yOf(value(s, z)))}`).join('L') + `L${n2(xOf(-1))},${n2(yOf(0))}Z`;
			S.raw(`<path d="${d}" fill="${MATTER}" fill-opacity="${n2(DIP * STRENGTH[k])}"/>`, 0.5);
			check(near(value(s, a), 0, 1e-9), 'the dip does not end at zero');
		}
		S.raw(`<path d="M${pts.map(([x, y]) => `${n2(x)},${n2(y)}`).join('L')}" fill="none" stroke="${MATTER}" stroke-opacity="${STRENGTH[k]}" stroke-width="${CURVE}" stroke-linejoin="round"/>`, 1 + k / 10);
		S.mark(pts, CURVE / 2, `the curve s = ${s}`);
		// the ends: the peak at the near wall, the far wall's value
		for (const z of [-1, 1]) {
			const p = [xOf(z), yOf(value(s, z))];
			S.raw(`<circle cx="${n2(p[0])}" cy="${n2(p[1])}" r="${DOT}" fill="${MATTER}" fill-opacity="${STRENGTH[k]}"/>`, 2);
			S.mark([p], DOT, `an end of s = ${s}`);
		}
		// the peak, and which curve it ends: s, after it
		L.push(await placed(`${PEAKS[k]}\\ \\ (s = ${s}R)`, X1 + DOT + LABEL_GAP + 0.3, yOf(value(s, 1)), 0, 0.5, MATTER));
		L.push(await placed(FAR[k].replace('-', '-'), X0 - DOT - LABEL_GAP - 0.3, yOf(value(s, -1)), 1, 0.5, MATTER));
	}
	// the centre, where all three meet
	S.raw(`<circle cx="${n2(xOf(0))}" cy="${n2(yOf(3))}" r="${DOT}" fill="${MATTER}"/>`, 2);

	S.checkAll(L);
	return finish(S, L, [240, 340]);
}
