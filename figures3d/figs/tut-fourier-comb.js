// The tutorial, section 2.6 (tutorial/outside/fourier.md), a row of points and a single point, with their transforms.
// Left, a row of equal point masses m a distance b apart, f(x) = sum_j m delta(x - jb), drawn as upward arrows of
// equal height; under it its transform, f~(k) = (2 pi m / b) sum_n delta(k - 2 pi n / b), a row of equal arrows
// 2 pi / b apart in k (the chapter's stretch problem). Right, a single point mass m, f = m delta(x), and its transform,
// m at every k: a level line at the height m over the whole axis. A delta function has no height, so each arrow
// stands for one and is labelled by its weight.
// Exact: the places of the arrows on each axis (x in units of b, k in units of 2 pi / b) and their weights, asserted
// from the coefficients c_n = m / b of the row (computed by the rule of the delta function) and the transform of a
// ripple, 2 pi delta(k - k_n). Schematic: the arrows' lengths and the level line's height (chosen for the drawing),
// and the scales of the two axes, which have different units.
import { Sheet, ORIGIN, finish, checker, placed, near } from './tut-pot-lib.js';
import { Plot, xAxis, LABEL_GAP } from './tut-prob-lib.js';
import { PATTERN, RIPPLE, CURVE, DIM } from './tut-fourier-lib.js';

const name = 'tut-fourier-comb';
const check = checker(name);

// ---- the mathematics: m = 1, b = 1 --------------------------------------------------------------------------
export const POINTS = [-3, -2, -1, 0, 1, 2, 3];      // the row, in units of b
export const SPIKES = [-2, -1, 0, 1, 2];             // its transform, in units of 2 pi / b

function mathematics() {
	// c_n = (1/b) int over one period of m delta(x) e^{-2 pi i n x / b} dx: the delta function picks the value at 0
	const b = 1, m = 1;
	const c = (n) => (m / b) * Math.cos((2 * Math.PI * n * 0) / b);
	for (const n of SPIKES) check(near(c(n), m / b, 1e-15), `the coefficient c_${n}`);
	// each term c_n e^{2 pi i n x / b} transforms to 2 pi c_n delta(k - 2 pi n / b): the weight 2 pi m / b
	const weight = 2 * Math.PI * c(1);
	check(near(weight, (2 * Math.PI * m) / b, 1e-15), 'the weight of the transform\'s spikes');
	// the row and the comb repeat: shifting by b multiplies each ripple by e^{-ikb} = 1 exactly on the comb
	for (const n of SPIKES) check(near(Math.cos(2 * Math.PI * n), 1, 1e-12), 'a spike off the comb');
	return { weight };
}

// ---- the drawing (points) -------------------------------------------------------------------------------------
const DX = 24, DK = 36;                  // the spacing of the arrows on the page: b on the x axis, 2 pi / b on the k axis
const AW = 180, BW = 84;                 // the axes' lengths: the rows, the single point
const TALL = 30;                         // the arrows' length, and the level line's height
const COL = 30, ROW = 22;                // between the columns, and between the rows (axis to the arrows' tips)

export default async function () {
	mathematics();
	const S = new Sheet(name);
	const L = [];
	const left = ORIGIN - (AW + COL + BW) / 2, right = left + AW + COL;
	const y1 = ORIGIN - ROW / 2 - 6, y2 = y1 + ROW + TALL + 12;                  // the two axes
	const plot = (l, w, y, u) => new Plot({ left: l, top: y - TALL, w, h: TALL, x0: -w / 2 / u, x1: w / 2 / u, y0: 0, y1: 1 });
	const A = plot(left, AW, y1, DX), B = plot(left, AW, y2, DK), C = plot(right, BW, y1, DX), D = plot(right, BW, y2, DK);
	const arrow = (P, x, color, what) => S.arrow([P.X(x), P.bottom - 0.2], [P.X(x), P.top], { color, width: CURVE, what });

	// ---- the row and its transform
	for (const j of POINTS) arrow(A, j, PATTERN, `the point ${j}`);
	for (const n of SPIKES) arrow(B, n, RIPPLE, `the spike ${n}`);
	L.push(...(await xAxis(S, A, { ticks: [0, 1, 2], fmt: (t) => ['0', 'b', '2b'][t], what: 'the row\'s x axis' })));
	L.push(...(await xAxis(S, B, { ticks: [0, 1, 2], fmt: (t) => ['0', '2\\pi/b', '4\\pi/b'][t], what: 'the row\'s k axis' })));
	// the weights, beside the rightmost arrows' tips
	L.push(await placed('m', A.X(3) + LABEL_GAP + 2, A.top + 2, 0, 0.5, PATTERN));
	L.push(await placed('2\\pi m/b', B.X(2) + LABEL_GAP + 2, B.top + 2, 0, 0.5, RIPPLE));

	// ---- the single point and its flat transform
	arrow(C, 0, PATTERN, 'the single point');
	S.path([[D.left, D.top], [D.right, D.top]], { color: RIPPLE, width: CURVE, layer: 2, cap: 'butt', what: 'the flat transform' });
	L.push(...(await xAxis(S, C, { ticks: [0], what: 'the point\'s x axis' })));
	L.push(...(await xAxis(S, D, { ticks: [0], what: 'the point\'s k axis' })));
	L.push(await placed('m', C.X(0) + LABEL_GAP + 2, C.top + 2, 0, 0.5, PATTERN));
	L.push(await placed('m', D.right - 1, D.top - LABEL_GAP - 0.6, 1, 1, RIPPLE));

	// ---- the axes' names, and the rows' names at the left
	for (const [P, s] of [[A, 'x'], [B, 'k'], [C, 'x'], [D, 'k']]) L.push(await placed(s, P.right + 4, P.bottom + 2.5 + 2.4 + 3.4, 0, 0.5, DIM));
	L.push(await placed('f', A.left - 6, (A.top + A.bottom) / 2, 1, 0.5, PATTERN));
	L.push(await placed('\\tilde f', B.left - 6, (B.top + B.bottom) / 2, 1, 0.5, RIPPLE));

	S.checkAll(L);
	window.tutFourierComb = {};
	return finish(S, L, [240, 340]);
}
