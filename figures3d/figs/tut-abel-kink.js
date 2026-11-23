// The tutorial, chapter 5.6 (tutorial/waves/abel-transform.md), its third diagram: a boundary shows as a kink at the
// line that grazes it. One chart: across, b/R from 0 to 1; up, N in units of jR (j the outer glow) from 0 to 4.5. The
// brightness of the two-shell planet of the inversion section, glow 3 inside 0.6 R and 1 outside, exactly:
// N = 2 sqrt(1 - b^2) + 4 sqrt(0.36 - b^2) for b < 0.6 and 2 sqrt(1 - b^2) beyond (a thin ink line), with
// N(0) = 4.4, N(0.6) = 1.6 and N(1) = 0 as the axes' numbers; the outer shell's part alone, 2 sqrt(1 - b^2), dashed
// grey where it differs from N, named "without the inner layer"; a dotted vertical at b = 0.6, named b = r_0. An inset
// at the upper right magnifies b from 0.55 to 0.62 and N from 1.4 to 2.8, the region a thin rectangle marks on the
// chart: there the curve meets the boundary with a vertical tangent, and the dotted line and the dashed curve continue.
// Departures from the diagram's comment: the inset is 100 by 66 points (the comment's 200 by 150 site pixels at half a
// point each, a little shorter, so that it clears the curve below it by more than its labels' gap), and its name,
// slope proportional to (r_0 - b)^(-1/2), stands under it, since inside it the curve and the dotted line leave no
// room for it. The dashed curve is drawn only for b < r_0, where it differs from N; beyond, the two are one curve.
// The chart is drawn at half a point per site pixel, 282 by 118 points for the data.
// Exact: N and the outer part (each asserted in tut-abel-lib.js against the sum of the glow along the chord), the
// values 4.4, 1.6 and 0 (asserted, and drawn as the axes' numbers), the corner at b = r_0 (a point of the curve), the
// vertical tangent there (the slope of the inner part asserted to grow as (r_0 - b)^(-1/2)), the inset's curve (the
// same function on the inset's scales, asserted to be the magnification of the rectangle). Every curve is sampled so
// that no two neighbouring points are more than a quarter of a point apart. Nothing is schematic.
import { Sheet, ORIGIN, finish, checker, placed, near, n2, LABEL_GAP } from './tut-pot-lib.js';
import { Plot, xAxis, yAxis, pathOf } from './tut-prob-lib.js';
import { graph, longest, CURVE, THIN } from './tut-fourier-lib.js';
import { INK, DIM, FAINT, PAGE } from '../lib.js';
import { chapter, twoShell, outerOnly, R0, DASH } from './tut-abel-lib.js';

const name = 'tut-abel-kink';
const check = checker(name);

const PW = 282, PH = 118;                  // the chart, points
const TOP = 4.5;
const BOX = { w: 100, h: 66 };             // the inset
const ZOOM = { x0: 0.55, x1: 0.62, y0: 1.4, y1: 2.8 };
const FRAME = 0.4;                         // the inset's frame and the rectangle

export default async function () {
	const nums = chapter(check);
	const S = new Sheet(name);
	const L = [];
	const P = new Plot({ left: ORIGIN - PW / 2, top: ORIGIN - PH / 2, w: PW, h: PH, x0: 0, x1: 1, y0: 0, y1: TOP });
	check(near(twoShell(0), 4.4, 1e-14) && near(twoShell(R0), 1.6, 1e-14) && twoShell(1) === 0 && near(nums.N0, 4.4, 1e-14), 'the values 4.4, 1.6 and 0');

	// ---- the curves: N in two pieces meeting at the corner; the outer part alone, dashed, where it differs
	const curve = (Q, f, a, b) => graph(Q, f, a, b);
	const N = [...curve(P, twoShell, 0, R0), ...curve(P, twoShell, R0, 1).slice(1)];
	const outer = curve(P, outerOnly, 0, R0);
	check(longest(N) <= 0.2501 && longest(outer) <= 0.2501, 'a curve is coarse');
	S.path(N, { color: INK, width: CURVE, layer: 2, cap: 'butt', what: 'N' });
	S.path(outer, { color: FAINT, width: THIN, dash: DASH, layer: 1.5, cap: 'butt', what: 'the outer part' });
	// b = r0, dotted, from the axis to the top
	S.dots(P.at(R0, 0), P.at(R0, TOP), { color: DIM, clear0: 0.6, what: 'b = r0' });

	// ---- the axes
	L.push(...await xAxis(S, P, { ticks: [0, R0, 1], fmt: (t) => String(t), what: 'the b axis' }));
	L.push(...await yAxis(S, P, { ticks: [0, 1.6, 4.4], fmt: (t) => String(t), what: 'the N axis' }));
	{
		const one = L.find((l) => l.src === '1');
		L.push(await placed('b/R', one.box.r + LABEL_GAP + 2.5, (one.box.t + one.box.b) / 2, 0, 0.5, DIM));
		L.push(await placed('N/jR', P.left, P.top - 5, 0.5, 1, DIM));
	}

	// ---- the rectangle on the chart, and the inset at the upper right
	const rect = [P.at(ZOOM.x0, ZOOM.y0), P.at(ZOOM.x1, ZOOM.y0), P.at(ZOOM.x1, ZOOM.y1), P.at(ZOOM.x0, ZOOM.y1)];
	S.path(rect, { color: DIM, width: FRAME, layer: 2.5, closed: true, what: 'the magnified region' });
	const Q = new Plot({ left: P.right - BOX.w, top: P.top, w: BOX.w, h: BOX.h, ...ZOOM });
	// the inset clears the curve beneath it: N is falling there, so its value at the inset's left edge is the highest
	const under = twoShell((Q.left - P.left) / PW);
	check(Q.left > P.X(ZOOM.x1) + 4 && P.Y(under) - Q.bottom > 2 * LABEL_GAP, `the inset is ${(P.Y(under) - Q.bottom).toFixed(2)} pt over the curve`);
	const frame = [[Q.left, Q.top], [Q.right, Q.top], [Q.right, Q.bottom], [Q.left, Q.bottom]];
	S.raw(`<path d="${pathOf(frame)}" fill="${PAGE}"/>`, 3);
	S.path(frame, { color: DIM, width: FRAME, layer: 3.5, closed: true, what: 'the inset\'s frame' });
	{
		// the inset's curves, on its own scales, clipped to its frame
		const id = `${name}-inset`;
		const Nz = [...curve(Q, twoShell, ZOOM.x0, R0), ...curve(Q, twoShell, R0, ZOOM.x1).slice(1)];
		const oz = curve(Q, outerOnly, ZOOM.x0, R0);
		check(longest(Nz) <= 0.2501 && longest(oz) <= 0.2501, 'an inset curve is coarse');
		check(Nz.every(([, y]) => y >= Q.top - 1e-9 && y <= Q.bottom + 1e-9), 'the inset\'s curve leaves its frame');
		// the magnification: each point of the inset is the chart's point of the rectangle, scaled
		const sx = BOX.w / (P.X(ZOOM.x1) - P.X(ZOOM.x0)), sy = BOX.h / (P.Y(ZOOM.y0) - P.Y(ZOOM.y1));
		for (const b of [0.55, 0.58, 0.6, 0.61, 0.62]) {
			const [x, y] = Q.at(b, twoShell(b)), [u, v] = P.at(b, twoShell(b));
			check(near(x, Q.left + (u - P.X(ZOOM.x0)) * sx, 1e-9) && near(y, Q.top + (v - P.Y(ZOOM.y1)) * sy, 1e-9), `the inset at b = ${b}`);
		}
		const body = `<path d="M${Nz.map(([x, y]) => `${n2(x)},${n2(y)}`).join('L')}" fill="none" stroke="${INK}" stroke-width="${CURVE}"/>` +
			`<path d="M${oz.map(([x, y]) => `${n2(x)},${n2(y)}`).join('L')}" fill="none" stroke="${FAINT}" stroke-width="${THIN}" stroke-dasharray="${DASH.join(' ')}"/>`;
		S.raw(`<clipPath id="${id}"><path d="${pathOf(frame)}"/></clipPath><g clip-path="url(#${id})">${body}</g>`, 3.2);
		S.mark(Nz, CURVE / 2, 'the inset\'s N');
		S.mark(oz, THIN / 2, 'the inset\'s outer part');
		S.dots(Q.at(R0, ZOOM.y0), Q.at(R0, ZOOM.y1), { color: DIM, clear0: FRAME, clear1: FRAME, layer: 3.2, what: 'the inset\'s b = r0' });
		// the vertical tangent: the inset's curve, from 0.1 per cent of the inset's width before r0 to r0, climbs
		// more than ten times as far as it runs
		const b1 = R0 - 1e-3 * (ZOOM.x1 - ZOOM.x0);
		check((Q.Y(twoShell(R0)) - Q.Y(twoShell(b1))) / (Q.X(R0) - Q.X(b1)) > 10, 'the inset\'s tangent at r0 is not steep');
	}

	// ---- the names
	L.push(await S.clear('\\text{without the inner layer}', P.X(0.3), P.Y(outerOnly(0.3)) + LABEL_GAP + 1, 0.5, 0, [0, 1], { color: DIM }));
	L.push(await S.clear('b = r_0', P.X(R0) - LABEL_GAP - 1, P.Y(TOP - 0.08), 1, 0, [0, 1], { color: DIM }));
	L.push(await S.clear('\\text{slope} \\propto (r_0 - b)^{-1/2}', Q.right, Q.bottom + LABEL_GAP + 0.6, 1, 0, [0, 1], { color: INK }));

	S.checkAll(L);
	window[name + '-numbers'] = { ...nums };
	return finish(S, L, [240, 340]);
}
