// The tutorial, section 9.4 (tutorial/one-point/petrov.md), its first diagram: a direction on the sky is a complex
// number. The sky around a small grey pixel, drawn as section 8.4 draws it (figs/tut-spin-lib.js, after section 6.6
// and the paper's fig:stars): a thin outline, a veil over what lies behind, the equator solid in front and dashed
// behind; seen a little from above, with the axes x, y, z as faint ink arrows from the pixel. Through the equator, the
// horizontal complex plane: a faint grid, its axes named "Re z" and "Im z" (the axes x and y of the sky). One
// direction k(z), 55 degrees from +z at the azimuth 30, an ink arrow from the pixel to a dot on the sky; a thin
// dashed line from the south pole -z to that dot, which crosses the plane at the point z, a dot named "z", 0.52 from
// the origin. The opposite direction -k, a dashed arrow to the far side, and its own dashed line from the south pole
// through it to the point -1/conj z in the plane, 1.92 from the origin at the azimuth 210. Small names: "z = 0" at
// the north pole, "|z| = 1" on the equator, "z -> infinity" at the south pole. No orange or blue.
// Departures from the diagram's comment: the line from the south pole to a direction in the northern hemisphere
// meets the plane before it reaches the sky (the point z, inside the equator, lies between the pole and the dot), so
// the dashed line runs from the south pole through the point z to the dot k(z), not through the dot to the plane; the
// line to the southern direction -k does run through its dot and on to the plane, as the comment says. The complex
// plane is the plane of the equator itself (it must be, for the line from the pole to meet it at z), drawn through
// the sky, not below it. The two directions are named k(z) and -k; the poles are marked by small dots; the sky's
// outline is the page's rule colour, as in every sky of the tutorial; the equator, which is named, is in the page's dim
// ink. What lies behind the sky's far side within its outline (the far part of the grid, the line beyond -k, a little
// of the axis y) is drawn under the veil. The grid's step is 0.75, not 1, so that no line of it passes through a drawn
// point (-1/conj z has Im z = -0.96, and from this view a line Re z = 2.08 would pass through both poles). The axes x
// and y lie along Re z and Im z, so each carries both names, the arrow's at its head and the plane's at the axis's end.
// Exact: the direction k(z) = (2 Re z, 2 Im z, 1 - |z|^2)/(1 + |z|^2) at z = tan(27.5) e^{i 30}, asserted at 55
// degrees and the azimuth 30 and found again as the direction of travel of m(z) and as the fourfold root of the
// quartic of a wave along it; -k = k(-1/conj z); the lines from the south pole, each meeting the plane exactly at its
// point (asserted in figs/tut-petrov-lib.js against the chapter's text and here on the page); one orthographic view.
// Schematic: the sizes of the dots and the pixel, the grid's extent and spacing, the axes' length.
import { Sheet, ORIGIN, finish, checker, placed, near, n2, LABEL_GAP } from './tut-pot-lib.js';
import { dashed } from './tut-orb-lib.js';
import { INK, DIM, RULE, PAGE } from '../lib.js';
import { view, sky, palette } from './tut-spin-lib.js';
import { STEEL } from './tut-five-lib.js';
import { chapter, Z, OPPOSITE, dot, len } from './tut-petrov-lib.js';

const name = 'tut-stereographic';
const check = checker(name);

const R = 78;                              // the sky's radius, points
const AZ = -10, EL = 26;                   // the view: the camera's azimuth from x toward y, and its height, degrees
const GRID = { re: [-2.25, 1.5], im: [-1.5, 1.5], step: 0.75 };   // the complex plane drawn, in units of the sky's radius:
                                          // its edges, and its lines (a step of 0.75 keeps every line clear of the drawn points:
                                          // -1/conj z has Im = -0.96, and a line at Re = 2.08 would pass through the poles)
const GRID_W = 0.35, GRID_A = 0.9;         // the grid's lines: stroke, opacity
const PLANE_AXIS = 0.45;                   // the plane's axes Re z and Im z
const AXIS_LEN = 1.4, AXIS_W = 0.5, AXIS_HEAD = 3.2;   // the sky's axes x, y, z: faint ink arrows
const PIXEL = 2.3;
const EQUATOR = 0.45;                      // the equator, |z| = 1: in the page's dim ink, since it is named
const DIR_W = 0.65, DIR_HEAD = 3.8;        // the arrows k(z) and -k
const DOT = 2.1, POLE = 1.4;               // a direction's dot and a point's in the plane; the poles' dots
const LINE_W = 0.45, LINE_DASH = [1.4, 1.6];   // the dashed lines from the south pole (the paper's dashed lines)
const CLEAR = 1.1;                         // the air between a line's end and a dot
const SAMPLE = 0.004;                      // a curve in space is sampled every this many radii

export default async function () {
	const nums = await chapter(check);
	await palette(check);
	const S = new Sheet(name);
	const L = [];
	const v = view(AZ, EL);
	const c = [ORIGIN, ORIGIN];
	const K = sky(S, check, c, R, v);
	const { at, front } = K;
	const C = at([0, 0, 0]);
	const toward = (a, b, d) => { const u = [b[0] - a[0], b[1] - a[1]], l = Math.hypot(...u); return [a[0] + (u[0] / l) * d, a[1] + (u[1] / l) * d]; };

	/** Whether a point of space is hidden behind the sky's far side: inside the outline on the page and farther from
	 * the reader than the far side there. Points inside the sky, on its near side or outside its outline are not. */
	const hidden = (p) => {
		if (len(p) <= 1 + 1e-12) return false;
		const q = v(p), r2 = q[0] * q[0] + q[1] * q[1];
		return r2 < 1 && q[2] < -Math.sqrt(1 - r2);
	};
	/** A straight piece of space from a to b, split where it passes behind the sky: [{ from, to, hidden }], as
	 * fractions along it. */
	const pieces = (a, b) => {
		const n = Math.max(2, Math.ceil(len(a.map((x, i) => b[i] - x)) / SAMPLE)), out = [];
		for (let k = 0; k < n; k++) {
			const t0 = k / n, t1 = (k + 1) / n, h = hidden(a.map((x, i) => x + (b[i] - x) * (t0 + t1) / 2));
			if (out.length && out[out.length - 1].hidden === h) out[out.length - 1].to = t1; else out.push({ from: t0, to: t1, hidden: h });
		}
		return out;
	};
	const lerp = (a, b, t) => a.map((x, i) => x + (b[i] - x) * t);
	/** A straight line in space, solid, under the veil where it is hidden. */
	const line = (a, b, { color, width, layer, opacity = 1, what }) => {
		for (const p of pieces(a, b)) {
			const A = at(lerp(a, b, p.from)), B = at(lerp(a, b, p.to));
			S.raw(`<path d="M${n2(A[0])},${n2(A[1])}L${n2(B[0])},${n2(B[1])}" stroke="${color}" stroke-width="${width}" stroke-opacity="${opacity}" fill="none"/>`, p.hidden ? 0.35 : layer);
			S.mark([A, B], width / 2, what);
		}
	};
	/** A dashed line in space from a to b, shortened by `s0` and `s1` points at its ends on the page. */
	const dashedLine = (a, b, s0, s1, { color, width, layer, what, clash }) => {
		const A = at(a), B = at(b), l = Math.hypot(B[0] - A[0], B[1] - A[1]);
		for (const p of pieces(a, b)) {
			const f0 = Math.max(p.from, s0 / l), f1 = Math.min(p.to, 1 - s1 / l);
			if (f1 <= f0) continue;
			dashed(S, at(lerp(a, b, f0)), at(lerp(a, b, f1)), { color, width, dash: LINE_DASH, layer: p.hidden ? 0.35 : layer, clash, what: `${what}${p.hidden ? ', behind' : ''}` });
		}
	};

	// ---- the complex plane: the grid, then its two axes
	const [re0, re1] = GRID.re, [im0, im1] = GRID.im;
	const lines = (lo, hi) => Array.from({ length: Math.round((hi - lo) / GRID.step) + 1 }, (_, i) => lo + i * GRID.step).filter((x) => Math.abs(x) > 1e-9);
	const gridRe = lines(re0, re1), gridIm = lines(im0, im1);
	check([re0, re1, im0, im1].every((x) => near(x / GRID.step, Math.round(x / GRID.step), 1e-12)), 'the plane\'s edges are not on its grid');
	for (const x of gridRe) line([x, im0, 0], [x, im1, 0], { color: RULE, width: GRID_W, layer: 0.8, opacity: GRID_A, what: `the grid Re ${x}` });
	for (const y of gridIm) line([re0, y, 0], [re1, y, 0], { color: RULE, width: GRID_W, layer: 0.8, opacity: GRID_A, what: `the grid Im ${y}` });
	line([re0, 0, 0], [re1, 0, 0], { color: DIM, width: PLANE_AXIS, layer: 0.9, what: 'the axis Re z' });
	line([0, im0, 0], [0, im1, 0], { color: DIM, width: PLANE_AXIS, layer: 0.9, what: 'the axis Im z' });
	check(re0 < OPPOSITE[0] - 0.2 && im0 < OPPOSITE[1] - 0.2, 'the plane does not reach -1/conj z');

	// ---- the sky: the equator, the veil, the outline
	K.runs(Array.from({ length: 721 }, (_, k) => [Math.cos((k * Math.PI) / 360), Math.sin((k * Math.PI) / 360), 0]), 'the equator', { color: DIM, width: EQUATOR, layer: 1, opacity: 0.9 });
	K.veil();
	S.sphere(C, PIXEL, STEEL, { spec: 0.5, layer: 4 }, 'the pixel');

	// ---- the sky's axes, faint ink arrows from the pixel
	const near2 = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
	const axisTips = {};
	for (const [k, e] of [['x', [1, 0, 0]], ['y', [0, 1, 0]], ['z', [0, 0, 1]]]) {
		// the shaft solid, under the veil where it passes behind the sky; the head clear of the sky's outline
		const tip = e.map((x) => x * AXIS_LEN), A = toward(C, at(tip), PIXEL + CLEAR), B = at(tip);
		const l = near2(A, B), u = [(B[0] - A[0]) / l, (B[1] - A[1]) / l], w = [-u[1], u[0]], hd = AXIS_HEAD, hw = 0.36 * hd;
		const t0 = (PIXEL + CLEAR) / near2(C, B), t1 = 1 - (hd * 0.8) / near2(C, B);
		check(!hidden(e.map((x) => x * AXIS_LEN * (1 - hd / near2(C, B)))), `the head of the axis ${k} lies behind the sky`);
		line(e.map((x) => x * AXIS_LEN * t0), e.map((x) => x * AXIS_LEN * t1), { color: DIM, width: AXIS_W, layer: 3, what: `the axis ${k}` });
		const base = [B[0] - u[0] * hd, B[1] - u[1] * hd], p = [base[0] + w[0] * hw, base[1] + w[1] * hw], q = [base[0] - w[0] * hw, base[1] - w[1] * hw];
		S.raw(`<path d="M${n2(B[0])},${n2(B[1])}L${n2(p[0])},${n2(p[1])}L${n2(q[0])},${n2(q[1])}Z" fill="${DIM}"/>`, 3);
		S.mark([B, p, q, B], 0, `the axis ${k}'s head`);
		S.arrows.push({ L: l, head: hd, what: `the axis ${k}` });
		axisTips[k] = { A, B, u };
	}

	// ---- the poles, the direction k(z) and its opposite, and their points in the plane
	const k = nums.kz, ko = nums.ko, south = [0, 0, -1], north = [0, 0, 1];
	const pz = [Z[0], Z[1], 0], po = [OPPOSITE[0], OPPOSITE[1], 0];
	check(len(pz) < 1 && len(po) > 1, 'z is not inside the equator, or -1/conj z not outside it');
	check(front(k) && !front(ko), 'k(z) is not in front, or -k not behind');
	// the line from the south pole through k(z) passes through z on the page, and through -k on to -1/conj z
	const onLine = (a, b, q) => { const A = at(a), B = at(b), Q = at(q); return Math.abs((B[0] - A[0]) * (Q[1] - A[1]) - (B[1] - A[1]) * (Q[0] - A[0])) / Math.hypot(B[0] - A[0], B[1] - A[1]); };
	check(onLine(south, k, pz) < 1e-9 && onLine(south, po, ko) < 1e-9, 'a point is off its line on the page');
	{
		// in space: z lies between the south pole and k(z); -k between the south pole and -1/conj z
		const t1 = dot(pz.map((x, i) => x - south[i]), k.map((x, i) => x - south[i])) / dot(k.map((x, i) => x - south[i]), k.map((x, i) => x - south[i]));
		const t2 = dot(ko.map((x, i) => x - south[i]), po.map((x, i) => x - south[i])) / dot(po.map((x, i) => x - south[i]), po.map((x, i) => x - south[i]));
		check(t1 > 0 && t1 < 1 && t2 > 0 && t2 < 1, `the order along the lines: ${t1}, ${t2}`);
	}
	const dots = [];
	const pointAt = (p, r, fill, what, layer) => {
		const q = at(p), back = hidden(p) || (near(len(p), 1, 1e-9) && !front(p));
		S.raw(`<circle cx="${n2(q[0])}" cy="${n2(q[1])}" r="${r}" fill="${fill}" stroke="${PAGE}" stroke-width="0.4"/>`, back ? 0.4 : layer);
		S.mark([q], r + 0.2, what);
		dots.push({ q, r: r + 0.2, what });
		return q;
	};
	const qs = pointAt(south, POLE, INK, 'the south pole', 5);
	const qn = pointAt(north, POLE, INK, 'the north pole', 5);
	const qk = pointAt(k, DOT, INK, 'k(z)', 5);
	const qo = pointAt(ko, DOT, INK, '-k', 5);
	const qz = pointAt(pz, DOT, INK, 'the point z', 5);
	const qp = pointAt(po, DOT, INK, 'the point -1/conj z', 5);
	// no dot lies on the grid, the plane's axes or the equator
	for (const d of dots) for (const m of S.marks) {
		if (!/^the (grid|axis Re|axis Im|equator)/.test(m.what)) continue;
		for (let i = 1; i < m.pts.length; i++) {
			const a = m.pts[i - 1], b = m.pts[i], e = [b[0] - a[0], b[1] - a[1]], l2 = e[0] ** 2 + e[1] ** 2;
			const t = l2 ? Math.max(0, Math.min(1, ((d.q[0] - a[0]) * e[0] + (d.q[1] - a[1]) * e[1]) / l2)) : 0;
			const gap = Math.hypot(d.q[0] - a[0] - t * e[0], d.q[1] - a[1] - t * e[1]) - d.r - m.r;
			check(gap >= 1.5, `${d.what} is ${gap.toFixed(2)} pt from ${m.what}`);
		}
	}
	// the dashed lines from the south pole, kept clear of the dots they pass
	const clashWith = (list) => (q, gap) => list.some(([p, r]) => near2(q, p) < r + gap);
	dashedLine(south, k, POLE + CLEAR, DOT + CLEAR, { color: INK, width: LINE_W, layer: 2, what: 'the line to k(z)', clash: clashWith([[qz, DOT + 0.2]]) });
	dashedLine(south, po, POLE + CLEAR, DOT + CLEAR, { color: INK, width: LINE_W, layer: 2, what: 'the line to -1/conj z', clash: clashWith([[qo, DOT + 0.2]]) });
	// every axis's head clears the dashed lines from the south pole
	for (const h of S.marks.filter((m) => /^the axis [xyz]'s head$/.test(m.what))) for (const m of S.marks.filter((q) => q.what.startsWith('the line to '))) {
		const a = m.pts[0], b = m.pts[m.pts.length - 1], e = [b[0] - a[0], b[1] - a[1]], l2 = e[0] ** 2 + e[1] ** 2;
		for (const q of h.pts) {
			const t = Math.max(0, Math.min(1, ((q[0] - a[0]) * e[0] + (q[1] - a[1]) * e[1]) / l2));
			const gap = Math.hypot(q[0] - a[0] - t * e[0], q[1] - a[1] - t * e[1]) - m.r;
			check(gap >= 2, `${h.what} is ${gap.toFixed(2)} pt from ${m.what}`);
		}
	}
	// the arrows k(z), solid, and -k, dashed
	S.arrow(toward(C, qk, PIXEL + CLEAR), toward(qk, C, DOT + CLEAR), { color: INK, width: DIR_W, head: DIR_HEAD, layer: 4, what: 'the arrow k(z)' });
	dashedArrow(toward(C, qo, PIXEL + CLEAR), toward(qo, C, DOT + CLEAR), 'the arrow -k');
	function dashedArrow(a, b, what) {
		const l = near2(a, b), u = [(b[0] - a[0]) / l, (b[1] - a[1]) / l], w = [-u[1], u[0]], hd = Math.min(DIR_HEAD, 0.4 * l), hw = 0.36 * hd;
		const base = [b[0] - u[0] * hd, b[1] - u[1] * hd];
		dashed(S, a, [b[0] - u[0] * hd * 0.8, b[1] - u[1] * hd * 0.8], { color: INK, width: DIR_W - 0.1, dash: LINE_DASH, layer: 4, what });
		const p = [base[0] + w[0] * hw, base[1] + w[1] * hw], q = [base[0] - w[0] * hw, base[1] - w[1] * hw];
		S.raw(`<path d="M${n2(b[0])},${n2(b[1])}L${n2(p[0])},${n2(p[1])}L${n2(q[0])},${n2(q[1])}Z" fill="${INK}"/>`, 4);
		S.mark([b, p, q, b], 0, `${what}'s head`);
		S.arrows.push({ L: l, head: hd, what });
	}

	// ---- the names
	// each name beside its mark: the nearest place, preferring the direction `u`, at which it clears every mark and
	// every name already set by LABEL_GAP; searched outward from the mark in steps of a quarter point
	const away = (q, from) => { const u = [q[0] - from[0], q[1] - from[1]], l = Math.hypot(...u); return [u[0] / l, u[1] / l]; };
	const apart = (p, q, g) => p.r + g <= q.l || q.r + g <= p.l || p.b + g <= q.t || q.b + g <= p.t;
	const seek = async (src, q, u, { color = INK, spread = 60, start = LABEL_GAP + 0.4, skip = () => false } = {}) => {
		const probe = await placed(src, 0, 0, 0.5, 0.5, color);
		const hw = (probe.box.r - probe.box.l) / 2, hh = (probe.box.b - probe.box.t) / 2;
		const a0 = Math.atan2(u[1], u[0]);
		for (let d = start; d < start + 40; d += 0.25) {
			let best = null;
			for (let da = 0; da <= spread; da += 5) for (const sg of da ? [1, -1] : [1]) {
				const a = a0 + (sg * da * Math.PI) / 180, e = [Math.cos(a), Math.sin(a)];
				const reach = Math.abs(e[0]) * hw + Math.abs(e[1]) * hh, x = q[0] + e[0] * (d + reach), y = q[1] + e[1] * (d + reach);
				const box = { l: x - hw, r: x + hw, t: y - hh, b: y + hh };
				if (S.clearance(box, skip).d < LABEL_GAP + 0.2 || L.some((l) => !apart(box, l.box, LABEL_GAP + 0.2))) continue;
				best = [x, y];
				break;
			}
			if (best) return placed(src, best[0], best[1], 0.5, 0.5, color);
		}
		throw new Error(`${name}: no room for the label ${src}`);
	};
	L.push(await seek('\\hat z', axisTips.z.B, [1, 0.2], { color: DIM }));
	L.push(await seek('\\hat k(z)', qk, away(qk, C), { spread: 150 }));
	L.push(await seek('z', qz, [1, 0.3]));
	L.push(await seek('-1/\\bar z', qp, away(qp, C)));
	L.push(await seek('z = 0', qn, [-1, 0], { spread: 30 }));
	L.push(await seek('z \\to \\infty', qs, [0, 1], { spread: 40 }));
	L.push(await seek('-\\hat k', qo, [-1, 0.3]));
	L.push(await seek('\\hat x', axisTips.x.B, [axisTips.x.u[1], -axisTips.x.u[0]], { color: DIM, spread: 90 }));
	L.push(await seek('\\hat y', axisTips.y.B, [0, -1], { color: DIM, spread: 90 }));
	{
		// the plane's axes, at their positive ends
		const re = at([re1, 0, 0]), im = at([0, im1, 0]);
		L.push(await seek('\\mathrm{Re}\\,z', re, away(re, C), { color: DIM }));
		L.push(await seek('\\mathrm{Im}\\,z', im, away(im, C), { color: DIM }));
	}
	{
		// |z| = 1 beside the equator's front half, at its lowest point on the page
		let best = null;
		for (let a = 0; a < 360; a += 1) { const p = [Math.cos((a * Math.PI) / 180), Math.sin((a * Math.PI) / 180), 0]; if (front(p) && (!best || at(p)[1] > at(best)[1])) best = p; }
		L.push(await seek('|z| = 1', at(best), [0, 1], { spread: 180 }));
	}

	S.checkAll(L);
	window[name + '-numbers'] = { z: Z, opposite: OPPOSITE, k, ko, view: { AZ, EL } };
	return finish(S, L, [260, 340]);
}

