// The tutorial, section 2.6 (tutorial/outside/fourier.md), the slab of bars: f = +1 on the first half of each period L
// and -1 on the second, measured from the mean in units of the step, drawn over two periods (from the middle of one
// low bar to the middle of the next but one) in thin ink; over it the partial sums of its Fourier series,
// (4/pi)(sin k1 x + sin 3k1 x / 3 + ...), with 1, 3 and 10 odd terms, in three tints of the ripples' colour, the palest
// one term and the full colour ten. The one-term sum reaches 4/pi = 1.27 at the middle of each bar; the ten-term sum
// overshoots to 1.18 beside each jump. Beside them, a stem plot of the sizes 4/(pi n) of the sine terms for
// n = 1, 3, ..., 15, on the same vertical scale, so that its first stem stands as high as the one-term sum.
// Exact: the bars, the sums (sampled every quarter of a point along their length), the stems; the peaks asserted
// against the chapter's numbers: 4/pi = 1.27, 4/3pi = 0.42, 4/5pi = 0.25, the sum at the middle of a bar 1 (Leibniz),
// the peak beside a jump 1.188 with three terms, 1.180 with ten and 1.179 with a thousand, and the limit
// (2/pi) Si(pi) = 1.179. Nothing is schematic.
import { Sheet, ORIGIN, finish, checker, placed, near } from './tut-pot-lib.js';
import { Plot, xAxis, yAxis, LABEL_GAP } from './tut-prob-lib.js';
import { graph, longest, peak, PATTERN, RIPPLE, CURVE, THIN, DIM } from './tut-fourier-lib.js';

const name = 'tut-fourier-bars';
const check = checker(name);

// ---- the mathematics: x in units of the period L --------------------------------------------------------------
export const TERMS = [1, 3, 10];
export const TINTS = [0.4, 0.66, 1];
/** The bars: +1 on [0, 1/2) of each period, -1 on [1/2, 1). */
export const bars = (x) => (((x % 1) + 1) % 1 < 0.5 ? 1 : -1);
/** The partial sum with N odd terms. */
export const partial = (N) => (x) => {
	let s = 0;
	for (let j = 1; j <= N; j++) { const n = 2 * j - 1; s += Math.sin(2 * Math.PI * n * x) / n; }
	return (4 / Math.PI) * s;
};
/** The peak of the N-term sum beside the jump at x = 0: the first maximum to its right, at x = 1/(4N) (where the
 * derivative, 8 sum cos((2j - 1) 2 pi x) = 4 sin(4 pi N x) / sin(2 pi x), first vanishes). */
export const overshoot = (N) => partial(N)(1 / (4 * N));

function mathematics() {
	check((4 / Math.PI).toFixed(2) === '1.27', `4/pi = ${4 / Math.PI}`);
	check((4 / (3 * Math.PI)).toFixed(2) === '0.42' && (4 / (5 * Math.PI)).toFixed(2) === '0.25', 'the second and third sizes');
	check(near(partial(1)(0.25), 4 / Math.PI, 1e-12), 'the one-term sum at the middle of a bar');
	check(near(partial(5000)(0.25), 1, 1e-3), `the series at the middle of a bar: ${partial(5000)(0.25)}`);
	check(partial(10)(0) === 0, 'the sums at a jump');
	// the overshoot, at the first maximum beside the jump, checked against a search over the whole first bar
	for (const N of [3, 10]) {
		const p = peak(partial(N), 0, 0.5);
		check(near(p.y, overshoot(N), 1e-9), `the ${N}-term peak lies at ${p.x}, not at 1/4N`);
	}
	check(overshoot(3).toFixed(3) === '1.188', `three terms: ${overshoot(3)}`);
	check(overshoot(10).toFixed(3) === '1.180', `ten terms: ${overshoot(10)}`);
	check(overshoot(1000).toFixed(3) === '1.179', `a thousand terms: ${overshoot(1000)}`);
	// the limit (2/pi) Si(pi), by Simpson's rule
	let si = 0;
	const m = 20000, h = Math.PI / m, sinc = (t) => (t ? Math.sin(t) / t : 1);
	for (let i = 0; i <= m; i++) si += (i === 0 || i === m ? 1 : i % 2 ? 4 : 2) * sinc(i * h);
	si *= h / 3;
	check(((2 / Math.PI) * si).toFixed(3) === '1.179', `the limit: ${(2 / Math.PI) * si}`);
	// the sums decrease toward the limit from above
	check(overshoot(10) > (2 / Math.PI) * si && overshoot(1000) > (2 / Math.PI) * si, 'an overshoot below the limit');
	return { p1: 4 / Math.PI, p3: overshoot(3), p10: overshoot(10), limit: (2 / Math.PI) * si };
}

// ---- the drawing (points) -------------------------------------------------------------------------------------
const X0 = -0.25, X1 = 1.75;             // two periods, from the middle of a low bar
const W = 196, H = 92, Y = 1.42;         // the main chart: f from -Y to Y
const AX = 4;                            // the axes stand this far from the data
const GAP = 30, SW = 60;                 // the stem plot: its distance from the main chart and its width
const STEMS = [1, 3, 5, 7, 9, 11, 13, 15];
const DOT = 1.15;                        // a stem's head

export default async function () {
	const nums = mathematics();
	const S = new Sheet(name);
	const L = [];
	const left = ORIGIN - (W + GAP + SW) / 2, top = ORIGIN - H / 2;
	const P = new Plot({ left, top, w: W, h: H, x0: X0, x1: X1, y0: -Y, y1: Y });

	// ---- the sums, palest first, then the bars over them
	TERMS.forEach((N, i) => {
		const pts = graph(P, partial(N), X0, X1);
		check(longest(pts) <= 0.2501, `the ${N}-term sum has a step of ${longest(pts)} pt`);
		S.raw(`<path d="M${pts.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join('L')}" fill="none" stroke="${RIPPLE}" stroke-width="${CURVE}" stroke-opacity="${TINTS[i]}" stroke-linejoin="round"/>`, 1.5 + 0.1 * i);
		S.mark(pts, CURVE / 2, `the ${N}-term sum`);
	});
	const bar = [];
	for (let x = X0; x < X1 - 1e-9;) {
		const next = Math.min(X1, Math.floor(x * 2 + 1e-9) / 2 + 0.5);
		bar.push(P.at(x, bars(x + 1e-9)), P.at(next, bars(x + 1e-9)));
		x = next;
	}
	S.path(bar, { color: PATTERN, width: THIN - 0.05, layer: 2, cap: 'butt', what: 'the bars' });

	// ---- the axes, standing clear of the data
	const xl = await xAxis(S, P, {
		ticks: [0, 0.5, 1, 1.5], y: P.bottom + AX,
		fmt: (t) => ({ 0: '0', 0.5: 'L/2', 1: 'L', 1.5: '3L/2' })[t], what: 'the x axis'
	});
	L.push(...xl);
	const yl = await yAxis(S, P, { ticks: [-1, 0, 1], fmt: (t) => (t < 0 ? '-1' : String(t)), x: P.left - AX, what: 'the f axis' });
	L.push(...yl);
	const last = xl[xl.length - 1];
	L.push(await placed('x', P.right + 4, (last.box.t + last.box.b) / 2, 0, 0.5, DIM));
	L.push(await placed('f', P.left - AX + 3.5, P.top, 0, 0.5, DIM));

	// ---- the peaks: 1.27 over the middle of the second high bar, 1.18 beside the jump at x = L
	const one = P.at(1.25, nums.p1);
	L.push(await placed(nums.p1.toFixed(2), one[0], one[1] - LABEL_GAP - 0.6, 0.5, 1, DIM));
	// to the left of the jump, level with the spike, over the low bar where nothing else is drawn
	const ten = P.at(1 + 1 / 40, nums.p10);
	L.push(await S.clear(nums.p10.toFixed(2), P.X(1) - 1, ten[1], 1, 0.5, [-1, 0], { color: DIM }));

	// ---- the stems: the sizes 4/(pi n), on the main chart's vertical scale, standing on its zero
	const Q = new Plot({ left: P.right + GAP, top, w: SW, h: H, x0: 0, x1: 16, y0: -Y, y1: Y });
	for (const n of STEMS) {
		const v = 4 / (Math.PI * n), [x, y0] = Q.at(n, 0), y = Q.Y(v);
		S.path([[x, y0], [x, y + DOT]], { color: RIPPLE, width: CURVE, layer: 2, cap: 'butt', what: `the stem ${n}` });
		S.raw(`<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${DOT}" fill="${RIPPLE}"/>`, 2.1);
		S.mark([[x, y]], DOT, `the head of the stem ${n}`);
	}
	check(near(Q.Y(4 / Math.PI), P.Y(nums.p1), 1e-9), 'the first stem is not as high as the one-term sum');
	const nl = await xAxis(S, Q, { ticks: [1, 5, 9, 13], y: Q.Y(0), from: 0, to: 16, what: 'the n axis' });
	L.push(...nl);
	const lastN = nl[nl.length - 1];
	L.push(await placed('n', Q.right + 4, (lastN.box.t + lastN.box.b) / 2, 0, 0.5, DIM));
	const head = Q.at(1, 4 / Math.PI);
	L.push(await placed('\\dfrac{4}{\\pi n}', head[0] + DOT + LABEL_GAP + 3, head[1], 0, 0.3, RIPPLE));

	S.checkAll(L);
	window.tutFourierBars = nums;
	return finish(S, L, [240, 340]);
}
