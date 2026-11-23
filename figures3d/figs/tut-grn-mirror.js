// The tutorial, chapter 2.4 (tutorial/outside/greens-functions.md), its third diagram: the half-space above a plane
// and its Poisson kernel. Left: the plane, edge-on, as a horizontal line; a point x at the height z above it and its
// mirror image x* at the depth z below, joined by a dashed vertical line; a point y on the plane, joined to both by
// two lines of one length, each crossed by one tick, the mark of equal lengths. Right: the kernel
// P_z(a) = z / 2 pi (a^2 + z^2)^(3/2), for z = 0.5 m and z = 1 m, on one pair of axes, a from -3 to 3 m; each peak,
// 1 / 2 pi z^2 = 0.64 and 0.16 m^-2, ticked on the kernel's axis and joined to it by a dotted line; each full width at
// half height, 2 z sqrt(2^(2/3) - 1) = 0.77 and 1.53 m, drawn as a line from flank to flank at that height and named under it.
// The axes are set a little off the plot's zero and its left end, so that the bells' tails never run along them.
// Exact: the left drawing is to the scale of the plot's a axis, with z = 1 m and y 1 m from the foot of x (the two
// lines' lengths asserted equal); the bells (sampled every quarter of a point along their length); the peaks, the
// half heights and the widths (asserted against the chapter's 0.64, 0.16, 0.77 and 1.53, and the width against
// 1.53 z); each bell's area, 1 (asserted by quadrature over the plane). Nothing is schematic.
import { INK, DIM, FAINT } from '../lib.js';
import { Sheet, ORIGIN, placed, finish, checker, near, LINE, HAIR, LABEL_GAP, n2 } from './tut-pot-lib.js';
import { Plot, xAxis, yAxis, dimension, CURVE } from './tut-prob-lib.js';
import { dashed } from './tut-orb-lib.js';
import { ORIGIN_DOT } from './tut-vec-lib.js';

const name = 'tut-grn-mirror';
const check = checker(name);

// ---- the mathematics (metres) ----------------------------------------------------------------------------------
export const kernel = (z) => (a) => z / (2 * Math.PI * (a * a + z * z) ** 1.5);
export const HEIGHTS = [0.5, 1];
export const PEAKS = ['0.64', '0.16'];
export const WIDTHS = ['0.77', '1.53'];
export const width = (z) => 2 * z * Math.sqrt(2 ** (2 / 3) - 1);

// ---- the drawing (points) ---------------------------------------------------------------------------------------
const AMAX = 3;                      // the plot's a, either side, m
const W = 192, H = 136;              // the data rectangle: a from -3 to 3 m, P_z from 0 to PMAX
const PMAX = 0.68;
const OFF = 5;                       // the axes' distance from the plot's zero and from its left end
const LEFT_GAP = 24;                 // from the left drawing's right end to the kernel's axis labels
const Z_LEFT = 1;                    // the left drawing's height, m
const Y_AT = 1;                      // y's distance from the foot of x, m
const PLANE = [-0.75, 1.55];           // the plane's ends in the left drawing, m from the foot of x
const DOT_R = 1.25;                  // a point's dot
const TICK_EQ = 2.6;                 // half a tick of equal length

/** Points along the graph of f on [a, b] in the plot P, no two more than a quarter of a point apart on the page. */
function graph(P, f, a, b) {
	const pts = [P.at(a, f(a))];
	let x = a;
	while (x < b) {
		let dx = (0.25 / P.w) * (P.x1 - P.x0);
		for (let i = 0; i < 12; i++) {
			const [x0, y0] = P.at(x, f(x)), [x1, y1] = P.at(Math.min(b, x + dx), f(Math.min(b, x + dx)));
			if (Math.hypot(x1 - x0, y1 - y0) <= 0.25) break;
			dx /= 2;
		}
		x = Math.min(b, x + dx);
		pts.push(P.at(x, f(x)));
	}
	return pts;
}

export default async function () {
	// ---- the numbers the chapter prints
	HEIGHTS.forEach((z, i) => {
		const P = kernel(z), peak = P(0), w = width(z);
		check(near(peak, 1 / (2 * Math.PI * z * z), 1e-15) && peak.toFixed(2) === PEAKS[i], `the peak at z = ${z} is ${peak}`);
		check(near(P(w / 2), peak / 2, 1e-12), `the width at z = ${z} is not at half height`);
		check(w.toFixed(2) === WIDTHS[i] && (w / z).toFixed(2) === '1.53', `the width at z = ${z} is ${w}`);
		// the area under the bell over the whole plane, 2 pi a P(a) da, by Simpson's rule on a = z tan(t)
		const n = 20000;
		let s = 0;
		for (let k = 0; k <= n; k++) {
			const t = (k / n) * (Math.PI / 2) * (1 - 1e-9), a = z * Math.tan(t), da = z / Math.cos(t) ** 2;
			s += (k === 0 || k === n ? 1 : k % 2 ? 4 : 2) * 2 * Math.PI * a * P(a) * da;
		}
		s *= ((Math.PI / 2) * (1 - 1e-9)) / n / 3;
		check(near(s, 1, 1e-6), `the bell at z = ${z} has the area ${s}`);
	});

	const S = new Sheet(name);
	const P = new Plot({ left: ORIGIN - 20, top: ORIGIN - H / 2, w: W, h: H, x0: -AMAX, x1: AMAX, y0: 0, y1: PMAX });
	const K = W / (2 * AMAX);            // points per metre along a
	const L = [];

	// ---- the bells
	const bells = HEIGHTS.map((z) => graph(P, kernel(z), -AMAX, AMAX));
	// the higher bell in the dimmer ink, so that the two read apart where their tails run close together
	const SHADES = [INK, DIM];
	bells.forEach((pts, i) => S.path(pts, { color: SHADES[i], width: CURVE, layer: 2 - i * 0.1, what: `the bell at z = ${HEIGHTS[i]} m` }));
	// the tails stay clear of the a axis
	for (const z of HEIGHTS) check(P.Y(0) + OFF - P.Y(kernel(z)(AMAX)) > OFF - 1, 'a tail runs along the a axis');

	// ---- the axes, set OFF points off the plot
	const xl = await xAxis(S, P, { ticks: [-3, -2, -1, 0, 1, 2, 3], fmt: (t) => (t < 0 ? `-${-t}` : `${t}`), y: P.bottom + OFF, what: 'the a axis' });
	L.push(...xl);
	// the a axis's name under its numbers, ending with the axis
	const numbersBottom = Math.max(...xl.map((l) => l.box.b));
	L.push(await placed('a\\ (\\mathrm{m})', P.right, numbersBottom + 3.2, 1, 0, DIM));
	const peaks = HEIGHTS.map((z) => kernel(z)(0));
	const yl = await yAxis(S, P, { ticks: [0, ...peaks], fmt: (t) => (t ? t.toFixed(2) : '0'), x: P.left - OFF, to: PMAX, what: 'the kernel axis' });
	L.push(...yl);
	L.push(await placed('P_z\\ (\\mathrm{m^{-2}})', P.left - OFF + 4.5, P.Y(PMAX), 0, 0.5, DIM));

	// ---- the peaks, joined to their ticks by dotted lines
	for (const [i, z] of HEIGHTS.entries()) {
		const y = P.Y(peaks[i]);
		S.dots([P.left - OFF, y], [P.X(0), y], { color: FAINT, clear0: 0.8, clear1: CURVE / 2 + 1.2, layer: 1, what: `the peak at z = ${z} m` });
	}

	// ---- the widths at half height: dimension lines, each named just under it
	for (const [i, z] of HEIGHTS.entries()) {
		const half = peaks[i] / 2, w = width(z), y = P.Y(half);
		// a line from flank to flank: the bell itself closes it, so it needs no end strokes
		dimension(S, P.X(-w / 2), P.X(w / 2), y, { color: DIM, ends: [false, false], what: `the width at z = ${z} m` });
		L.push(await S.clear(`${WIDTHS[i]}\\ \\mathrm{m}`, P.X(0), y + LABEL_GAP + 2.6, 0.5, 0, [0, 1], { color: DIM }));
	}

	// ---- the bells' names, beside their right flanks
	L.push(await S.clear('z = 0.5\\ \\mathrm{m}', P.X(0.55), P.Y(kernel(0.5)(0.55)), 0, 1, [0.55, -0.83]));
	L.push(await S.clear('z = 1\\ \\mathrm{m}', P.X(1.15), P.Y(kernel(1)(1.15)), 0, 1, [0.55, -0.83], { color: DIM }));

	// ---- the left drawing: the plane, x, its image, and y, to the a axis's scale, the plane level with the middle of
	// the plot
	const ylab = Math.min(...yl.map((l) => l.box.l));
	const foot = [ylab - LEFT_GAP - PLANE[1] * K, P.top + H / 2];
	const pt = (a, h) => [foot[0] + a * K, foot[1] - h * K];
	const X = pt(0, Z_LEFT), Xs = pt(0, -Z_LEFT), Y = pt(Y_AT, 0);
	S.path([pt(PLANE[0], 0), pt(PLANE[1], 0)], { color: INK, width: LINE, layer: 1, cap: 'butt', what: 'the plane' });
	dashed(S, [X[0], X[1] + DOT_R + 1.2], [Xs[0], Xs[1] - DOT_R - 1.2], { color: DIM, width: HAIR + 0.05, what: 'the line from x to its image' });
	for (const [B, tag] of [[X, 'x'], [Xs, 'x*']]) {
		const len = Math.hypot(B[0] - Y[0], B[1] - Y[1]);
		check(near(len, Math.hypot(X[0] - Y[0], X[1] - Y[1]), 1e-9), 'y is not as far from x as from its image');
		const u = [(B[0] - Y[0]) / len, (B[1] - Y[1]) / len], n = [-u[1], u[0]];
		S.path([[Y[0] + u[0] * (DOT_R + 0.9), Y[1] + u[1] * (DOT_R + 0.9)], [B[0] - u[0] * (DOT_R + 0.9), B[1] - u[1] * (DOT_R + 0.9)]], { color: INK, width: HAIR, layer: 1, what: `the line from y to ${tag}` });
		const m = [(B[0] + Y[0]) / 2, (B[1] + Y[1]) / 2];
		S.path([[m[0] - n[0] * TICK_EQ, m[1] - n[1] * TICK_EQ], [m[0] + n[0] * TICK_EQ, m[1] + n[1] * TICK_EQ]], { color: INK, width: HAIR, layer: 1, cap: 'butt', what: `the tick on the line to ${tag}` });
	}
	S.raw(`<circle cx="${n2(X[0])}" cy="${n2(X[1])}" r="${DOT_R}" fill="${INK}"/>`, 4);
	S.raw(`<circle cx="${n2(Xs[0])}" cy="${n2(Xs[1])}" r="${DOT_R - HAIR / 2}" fill="none" stroke="${INK}" stroke-width="${HAIR}"/>`, 4);
	S.raw(`<circle cx="${n2(Y[0])}" cy="${n2(Y[1])}" r="${DOT_R}" fill="${INK}"/>`, 4);
	for (const [p, w] of [[X, 'x'], [Xs, 'x*'], [Y, 'y']]) S.mark([p], DOT_R, `the point ${w}`);
	void ORIGIN_DOT;
	// the names: x and its image left of the dashed line, y below the plane, the two heights z left of the line
	L.push(await placed('\\boldsymbol{x}', X[0] - DOT_R - LABEL_GAP - 0.4, X[1], 1, 0.5));
	L.push(await placed('\\boldsymbol{x}^*', Xs[0] - DOT_R - LABEL_GAP - 0.4, Xs[1], 1, 0.5));
	L.push(await placed('\\boldsymbol{y}', Y[0] + 1.5, Y[1] + LINE / 2 + LABEL_GAP + 0.6, 0, 0));
	L.push(await S.clear('z', X[0] - 1, (X[1] + foot[1]) / 2, 1, 0.5, [-1, 0], { color: DIM }));
	L.push(await S.clear('z', X[0] - 1, (Xs[1] + foot[1]) / 2, 1, 0.5, [-1, 0], { color: DIM }));

	S.checkAll(L);
	return finish(S, L, [240, 340]);
}
