// The tutorial, section 2.6 (tutorial/outside/fourier.md), the Gaussian and its transform. Two rows: a wide Gaussian,
// eps = 2, above a narrow one, eps = 0.5. Left, the bumps delta_eps(x) = exp(-x^2 / 2 eps^2) / (sqrt(2 pi) eps), each of
// area 1, on one x axis and one vertical scale, so that the narrow one stands four times as tall. Right, their
// transforms exp(-eps^2 k^2 / 2) on one k axis, both rising to 1: the first narrow, of width 1/eps = 0.5, and the second
// wide, of width 2. Each width is marked where its curve has fallen to exp(-1/2) of its top (on the right, the dashed
// line at exp(-1/2) = 0.61), from the centre to x = eps or to k = 1/eps, where the curve crosses that level exactly.
// Exact: the curves (sampled every quarter of a point along their length, and drawn only where they stand clear of the
// axis), the widths, the areas (asserted 1 by Simpson's rule), the transforms (asserted against a numerical
// integral of delta_eps(x) cos kx) and the product of the widths, 1. The values of eps are chosen for the drawing.
import { Sheet, ORIGIN, finish, checker, placed, near } from './tut-pot-lib.js';
import { Plot, xAxis, yAxis, merge, LABEL_GAP, END } from './tut-prob-lib.js';
import { graph, longest, PATTERN, RIPPLE, CURVE, DIM } from './tut-fourier-lib.js';

const name = 'tut-fourier-gauss';
const check = checker(name);

// ---- the mathematics ------------------------------------------------------------------------------------------
export const WIDTHS = [2, 0.5];
export const bump = (e) => (x) => Math.exp(-(x * x) / (2 * e * e)) / (Math.sqrt(2 * Math.PI) * e);
export const transform = (e) => (k) => Math.exp(-(e * e * k * k) / 2);
const simpson = (f, a, b, m = 20000) => {
	const h = (b - a) / m;
	let s = 0;
	for (let i = 0; i <= m; i++) s += (i === 0 || i === m ? 1 : i % 2 ? 4 : 2) * f(a + i * h);
	return (s * h) / 3;
};

function mathematics() {
	for (const e of WIDTHS) {
		check(near(simpson(bump(e), -12 * e, 12 * e), 1, 1e-10), `the bump of width ${e} has area ${simpson(bump(e), -12 * e, 12 * e)}`);
		// the transform, int delta_eps(x) e^{-ikx} dx = int delta_eps(x) cos kx dx (the bump is even)
		for (const k of [0, 0.3, 1, 1 / e, 2.5]) {
			const num = simpson((x) => bump(e)(x) * Math.cos(k * x), -12 * e, 12 * e);
			check(near(num, transform(e)(k), 1e-9), `the transform of width ${e} at k = ${k}: ${num}`);
		}
		// each curve crosses exp(-1/2) of its top exactly at its width
		check(near(bump(e)(e) / bump(e)(0), Math.exp(-0.5), 1e-12) && near(transform(e)(1 / e), Math.exp(-0.5), 1e-12), 'the widths');
	}
	check(Math.exp(-0.5).toFixed(2) === '0.61', 'e^{-1/2}');
	check(near(bump(0.5)(0) / bump(2)(0), 4, 1e-12), 'the narrow bump is not four times as tall');
}

// ---- the drawing (points) -------------------------------------------------------------------------------------
const PW = 116, PH = 46;                 // each panel's data rectangle
const XR = 6.5;                          // x and k from -XR to XR
const YL = 0.86, YR = 1.08;              // the vertical ranges, left and right
const COL = 34, ROW = 18;                // the gap between the columns, and between the rows

export default async function () {
	mathematics();
	const S = new Sheet(name);
	const L = [];
	const left = ORIGIN - (2 * PW + COL) / 2, top = ORIGIN - (2 * PH + ROW) / 2;
	const level = Math.exp(-0.5);
	for (const [r, e] of WIDTHS.entries()) {
		const y = top + r * (PH + ROW);
		const A = new Plot({ left, top: y, w: PW, h: PH, x0: -XR, x1: XR, y0: 0, y1: YL });
		const B = new Plot({ left: left + PW + COL, top: y, w: PW, h: PH, x0: -XR, x1: XR, y0: 0, y1: YR });
		const bottom = r === WIDTHS.length - 1;
		// ---- the curves, where they stand clear of the axis
		for (const [P, f, color, what] of [[A, bump(e), PATTERN, `the bump of width ${e}`], [B, transform(e), RIPPLE, `the transform of width ${e}`]]) {
			const clear = merge(P, CURVE);
			// the curve meets the axis where it falls to `clear`: solve f(x) = clear for x > 0 by bisection
			let lo = 0, hi = XR;
			if (f(hi) < clear) { for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2; if (f(m) > clear) lo = m; else hi = m; } }
			const pts = graph(P, f, -hi, hi);
			check(longest(pts) <= 0.2501, `${what} has a step of ${longest(pts)} pt`);
			S.path(pts, { color, width: CURVE, layer: 2, what });
		}
		// ---- the axes: numbers under the bottom row only
		const ticks = [-4, 0, 4], fmt = bottom ? (t) => (t < 0 ? `-${-t}` : `${t}`) : () => null;
		const xl = await xAxis(S, A, { ticks, fmt, what: `the x axis ${r}` });
		const kl = await xAxis(S, B, { ticks, fmt, what: `the k axis ${r}` });
		L.push(...xl, ...kl);
		L.push(...(await yAxis(S, A, { ticks: [0, 0.4, 0.8], fmt: (t) => (t ? t.toFixed(1) : '0'), what: `the left vertical axis ${r}` })));
		L.push(...(await yAxis(S, B, { ticks: [0, 1], fmt: (t) => String(t), what: `the right vertical axis ${r}` })));
		if (bottom) {
			const [lx, lk] = [xl[xl.length - 1], kl[kl.length - 1]];
			L.push(await placed('x', A.right + 4, (lx.box.t + lx.box.b) / 2, 0, 0.5, DIM));
			L.push(await placed('k', B.right + 4, (lk.box.t + lk.box.b) / 2, 0, 0.5, DIM));
		} else {
			L.push(await placed('\\delta_\\varepsilon(x)', A.left + 4, A.top - 2, 0, 1, PATTERN));
			L.push(await placed('\\tilde\\delta_\\varepsilon(k)', B.left + 4, B.top - 2, 0, 1, RIPPLE));
		}
		// ---- the dashed level exp(-1/2) on the right, broken where the width is marked on it
		const yv = B.Y(level);
		const dash = { color: DIM, width: 0.35, layer: 1.5, cap: 'butt', dash: [1.6, 1.4] };
		S.path([[B.left, yv], [B.X(0), yv]], { ...dash, what: 'the level, left' });
		S.path([[B.X(1 / e), yv], [B.right, yv]], { ...dash, what: 'the level, right' });
		L.push(await placed('e^{-1/2}', B.left - 2.5 - 2.4, yv, 1, 0.5, DIM));
		S.path([[B.left, yv], [B.left - 2.5, yv]], { color: DIM, width: 0.4, layer: 1, cap: 'butt', what: 'the level\'s tick' });
		// ---- the widths: from the centre to where the curve crosses the level
		for (const [P, w, f, color, src] of [
			[A, e, bump(e), PATTERN, `\\varepsilon = ${e}`],
			[B, 1 / e, transform(e), RIPPLE, `1/\\varepsilon = ${1 / e}`]
		]) {
			const yw = P.Y(f(w));
			check(near(f(w), f(0) * level, 1e-12), 'a width is not where its curve crosses the level');
			S.path([[P.X(0), yw], [P.X(w), yw]], { color, width: 0.55, layer: 3, cap: 'butt', what: `the width ${src}` });
			S.path([[P.X(0), yw - END], [P.X(0), yw + END]], { color, width: 0.55, layer: 3, cap: 'butt', what: `the width ${src}, its end` });
			// the label above the level, to the right of where the curve crosses it
			L.push(await S.clear(src, P.X(w) + LABEL_GAP + 1.5, yw - LABEL_GAP - 0.6, 0, 1, [1, 0], { color }));
		}
	}
	S.checkAll(L);
	window.tutFourierGauss = { level };
	return finish(S, L, [240, 340]);
}
