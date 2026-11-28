// The tutorial, section 4.2 (tutorial/response/temperature.md), its second diagram: the weight on phase space of
// section 1.7's cart (m = 2 kg, k = 50 N/m) at 300 K, exp(-p^2/2mk_BT - kq^2/2k_BT), drawn as a hill over the plane
// (q, p), with q in units of sigma_q = sqrt(k_BT/k) = 9.1 x 10^-12 m and p in units of sigma_p = sqrt(m k_BT) =
// 9.1 x 10^-11 kg m/s (the chapter's diagram comment printed 9.1 x 10^-11 too, and it is right: sigma_p/sigma_q =
// sqrt(mk) = 10 kg/s), each from -3 to 3. The hill is a net of the lines of constant q and of constant p on the
// surface, every half unit, with its hidden parts removed, and its outline against what lies behind it, drawn in an
// oblique projection as a waterfall chart is: p straight across the page, the weight straight up, q receding up and
// a little to the right. So each line along p is drawn undistorted over a level baseline, its peak over p = 0, and
// the slices on the hill differ only in height, as they do. Three of the lines along p, at q = 0, sigma_q and
// 2 sigma_q, are the slices, drawn in ink, orange and blue, named at their left ends; p is numbered along the front
// edge and q along the right one, each at -3, 0 and 3. Beside the hill, standing on its front baseline, the same
// three slices each divided by its own height, overlaid: three dashed curves in
// the three colours whose dashes interleave, so that where they coincide they make one unbroken line, the Gaussian
// exp(-p^2/2 sigma_p^2), with its half-width at e^{-1/2} of its height marked as sigma_p.
// Exact: the surface and its net (every point drawn on it; the weight in SI units asserted equal to
// exp(-(q/sigma_q)^2/2 - (p/sigma_p)^2/2) at sample points), the hidden parts (each point of every line tested by a
// ray toward the viewer, the ends of every visible run found by bisection), the outline (the curve where the line
// of sight grazes the surface, solved by bisection, asserted visible), the slices, the rescaled slices (asserted to
// be one curve to 1e-15) and the half-width sigma_p (asserted where the Gaussian is e^{-1/2}). Every curve is sampled
// so that no two neighbouring points are more than a quarter of a point apart; each slice asserted seen whole, over
// a level baseline, with its peak over p = 0. Chosen for the drawing: the view (the oblique projection's receding
// direction, steep enough that the line of sight rises faster than any slice's flank, so that the slice at q = 0 is
// seen whole), the hill's height on the page, and the chart's scales.
import { INK, DIM, FAINT, ACCENT, ACCENT2 } from '../lib.js';
import { Sheet, ORIGIN, finish, checker, near, placed, n2, HAIR, TICK } from './tut-pot-lib.js';
import { Plot, xAxis, yAxis, LABEL_GAP, dimension, merge } from './tut-prob-lib.js';
import { graph, longest } from './tut-fourier-lib.js';
import { chapter, KT, MASS, STIFF } from './tut-temp-lib.js';

const name = 'tut-temp-phase';
const check = checker(name);

// ---- the mathematics, in units of sigma_q and sigma_p ---------------------------------------------------------------
const w = (q, p) => Math.exp(-(q * q + p * p) / 2);
const SPAN = 3;
export const SLICES = [{ q: 0, color: INK, src: 'q = 0' }, { q: 1, color: ACCENT, src: 'q = \\sigma_q' }, { q: 2, color: ACCENT2, src: 'q = 2\\sigma_q' }];

function mathematics() {
	const { SIGMA_Q, SIGMA_P } = chapter(check);
	// the weight in SI units is the round Gaussian in these units
	const weight = (q, p) => Math.exp(-(p * p) / (2 * MASS * KT) - (STIFF * q * q) / (2 * KT));
	for (const [a, b] of [[0, 0], [0.7, -1.3], [-2.2, 0.4], [3, 3]]) check(near(weight(a * SIGMA_Q, b * SIGMA_P), w(a, b), 1e-14), `the weight at ${a}, ${b}`);
	// a slice along p at q, divided by its own height w(q, 0), is exp(-p^2/2) whatever q is
	for (const { q } of SLICES) for (let p = -SPAN; p <= SPAN; p += 0.01) check(near(w(q, p) / w(q, 0), Math.exp(-(p * p) / 2), 1e-15), `the slice at ${q} rescaled, at ${p}`);
	// its half-width at e^{-1/2} of its height is one sigma_p (the Gaussian's inflection)
	check(near(Math.exp(-0.5), w(0, 1), 1e-15), 'the half-width is not sigma_p');
	return { SIGMA_Q, SIGMA_P };
}

// ---- the drawing (points) ---------------------------------------------------------------------------------------
// The view: an oblique (parallel) projection, as a waterfall chart is drawn: p runs straight across the page, the
// weight straight up, and q recedes up and to the right, RX and RY points per unit toward the back. So every line of
// constant q, a slice among them, is drawn as its own curve, undistorted, over a level baseline, with its peak over
// p = 0.
const S_P = 28;                               // points per unit of p, across the page
const RX = 6, RY = 13;                        // points per unit of q toward the back: right, and up
const ZH = 76;                                // points per unit of the weight, up the page
const NET = 0.5;                              // the net's spacing
const NET_W = 0.4, NET_OPACITY = 0.55, EDGE_W = 0.45, SLICE_W = 0.8, OUTLINE_W = 0.45;
const CHORD = 0.25;                           // the longest step of a curve on the page
const CW = 112, CH = 92;                      // the chart beside the hill
const CHART_GAP = 26;                         // from the hill's rightmost ink to the chart's axis
const OVER_W = 0.8, DASH = 2.1;               // the overlaid slices: stroke, and each colour's dash
const NAME_GAP = 7;                           // from a slice's left end to its name

/** What `draw` adds to the sheet S, laid as one group of the given opacity at `layer`: strokes that cross or overlap
 * (a net's crossings, an arrow's head over its shaft) are then pale once, with no darker spots where they meet. */
function veiled(S, opacity, layer, draw) {
	const n = S.P.items.length;
	draw();
	const added = S.P.items.splice(n);
	S.raw(`<g opacity="${opacity}">${added.map((it) => it.svg).join('')}</g>`, layer);
}

export default async function () {
	mathematics();
	const S = new Sheet(name);
	const L = [];
	const OX = ORIGIN - 40, OY = ORIGIN + 30;     // the page point of q = 0, p = 0 on the ground
	// the page point of the point at height z (units of the weight) over (q, p); q toward the viewer
	const at = (q, p, z) => [OX + S_P * p - RX * q, OY + RY * q - ZH * z];
	const page = (q, p) => at(q, p, w(q, p));
	// toward the viewer: the direction that keeps a point on one point of the page, per unit of q
	const C = RX / S_P, K = RY / ZH;
	for (const [q, p, z] of [[0.3, -1.1, 0.4], [-2, 2.5, 0.05]]) {
		const A = at(q, p, z), B = at(q + 0.7, p + 0.7 * C, z + 0.7 * K);
		check(near(A[0], B[0], 1e-12) && near(A[1], B[1], 1e-12), 'the ray toward the viewer does not stay on one point of the page');
	}

	/** Whether the point of the surface over (q, p) is seen: nothing of the surface rises above the ray from it to the viewer. */
	const seen = (q, p) => {
		const z = w(q, p);
		for (let a = 0.002; ; a += 0.002) {
			const Q = q + a, P = p + C * a;
			if (Math.abs(Q) > SPAN || Math.abs(P) > SPAN) return true;
			if (w(Q, P) > z + a * K + 1e-12) return false;
		}
	};

	/** The visible runs of the curve t -> (q(t), p(t)) on the surface for t in [a, b], each as page points no more than
	 * CHORD apart, its ends found by bisection where it passes behind the hill. */
	const runs = (f, a, b) => {
		const ts = [a];
		let t = a;
		while (t < b) {
			let dt = 0.05;
			for (let i = 0; i < 30; i++) {
				const t2 = Math.min(b, t + dt);
				const [x0, y0] = page(...f(t)), [x1, y1] = page(...f(t2));
				if (Math.hypot(x1 - x0, y1 - y0) <= CHORD) break;
				dt /= 2;
			}
			t = Math.min(b, t + dt);
			ts.push(t);
		}
		const vis = ts.map((t) => seen(...f(t)));
		const out = [];
		let cur = null;
		const edge = (lo, hi, from) => {           // the place between lo and hi where `seen` changes from `from`
			for (let i = 0; i < 50; i++) { const m = (lo + hi) / 2; if (seen(...f(m)) === from) lo = m; else hi = m; }
			return from ? lo : hi;
		};
		for (let i = 0; i < ts.length; i++) {
			if (vis[i]) {
				if (!cur) { cur = []; if (i > 0) cur.push(page(...f(edge(ts[i - 1], ts[i], false)))); }
				cur.push(page(...f(ts[i])));
			} else if (cur) {
				cur.push(page(...f(edge(ts[i - 1], ts[i], true))));
				out.push(cur); cur = null;
			}
		}
		if (cur) out.push(cur);
		return out.filter((r) => r.length > 1);
	};
	const draw = (pieces, opts) => { for (const r of pieces) { check(longest(r) <= CHORD + 1e-3, `${opts.what} has a step of ${longest(r)} pt`); S.path(r, { cap: 'butt', ...opts }); } };

	// ---- the net, every half unit, but for the slices, which are drawn over it in their colours
	const along = (q) => (t) => [q, t], across = (p) => (t) => [t, p];
	veiled(S, NET_OPACITY, 1, () => {
		for (let k = -SPAN / NET + 1; k < SPAN / NET; k++) {
			const c = k * NET;
			if (!SLICES.some((s) => near(s.q, c))) draw(runs(along(c), -SPAN, SPAN), { color: FAINT, width: NET_W, layer: 1, what: `the line q = ${c}` });
			draw(runs(across(c), -SPAN, SPAN), { color: FAINT, width: NET_W, layer: 1, what: `the line p = ${c}` });
		}
	});
	// ---- the surface's edge
	for (const c of [-SPAN, SPAN]) {
		draw(runs(along(c), -SPAN, SPAN), { color: DIM, width: EDGE_W, layer: 1.5, what: `the edge q = ${c}` });
		draw(runs(across(c), -SPAN, SPAN), { color: DIM, width: EDGE_W, layer: 1.5, what: `the edge p = ${c}` });
	}
	// ---- the outline: where the line of sight grazes the surface. Along the ray the weight changes at the rate
	// -(q + C p) w per unit of q; the sight grazes where that is K. In the turned coordinates a = (q + C p)/n and
	// b = (p - C q)/n, n = sqrt(1 + C^2), this is -a e^{-a^2/2} = (K/n) e^{b^2/2}, a closed curve whose inner branch
	// (|a| < 1, on the far side of the top) is the hill's edge against what lies behind it.
	const nn = Math.hypot(1, C), kappa = K / nn;
	check(kappa < Math.exp(-0.5), 'the hill hides nothing: no outline');
	const bMax = Math.sqrt(2 * Math.log(Math.exp(-0.5) / kappa));
	const aOf = (b) => {                       // the inner root of -a e^{-a^2/2} = kappa e^{b^2/2}, a in (-1, 0)
		const target = kappa * Math.exp((b * b) / 2);
		let lo = -1, hi = 0;
		for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2; if (-m * Math.exp((-m * m) / 2) < target) hi = m; else lo = m; }
		return (lo + hi) / 2;
	};
	const outlineAt = (b) => { const a = aOf(b); return [(a - C * b) / nn, (C * a + b) / nn]; };
	for (const b of [-0.9 * bMax, 0, 0.5 * bMax]) {
		const [q, p] = outlineAt(b), a = aOf(b);
		const rate = (w(q + 1e-6, p + C * 1e-6) - w(q - 1e-6, p - C * 1e-6)) / 2e-6;
		check(near(rate, K, 1e-6) && a > -1 && a < 0, `the outline at ${b} is not where the sight grazes`);
		check(seen(q, p), `the outline at ${b} is hidden`);
	}
	const outline = runs((t) => outlineAt(t), -bMax, bMax);
	check(outline.length === 1, 'the outline is not one piece');
	draw(outline, { color: DIM, width: OUTLINE_W, layer: 1.5, what: 'the outline' });

	// ---- the slices, whole: none of them passes behind the hill; each over a level baseline, its peak over p = 0
	for (const s of SLICES) {
		const r = runs(along(s.q), -SPAN, SPAN);
		check(r.length === 1 && near(r[0][0][0], page(s.q, -SPAN)[0], 1e-9) && near(r[0][r[0].length - 1][0], page(s.q, SPAN)[0], 1e-9), `the slice at q = ${s.q} is not seen whole`);
		check(near(at(s.q, -SPAN, 0)[1], at(s.q, SPAN, 0)[1], 1e-12), `the slice at q = ${s.q} has a tilted baseline`);
		const top = r[0].reduce((m, pt) => (pt[1] < m[1] ? pt : m));
		check(Math.abs(top[0] - at(s.q, 0, 0)[0]) <= CHORD, `the slice at q = ${s.q} does not peak over p = 0`);
		draw(r, { color: s.color, width: SLICE_W, layer: 3, what: `the slice at q = ${s.q}` });
	}

	// ---- the axes on the near edges: p along the front edge q = 3, q along the right edge p = 3; ticks lie in the
	// ground, outward
	const outward = (q, p, out) => {             // a tick's place: from the edge's point A, TICK along `out` in the ground
		const A = at(q, p, w(q, p)), B0 = at(q + out[0], p + out[1], w(q, p));
		const d = Math.hypot(B0[0] - A[0], B0[1] - A[1]);
		const B = [A[0] + ((B0[0] - A[0]) * TICK) / d, A[1] + ((B0[1] - A[1]) * TICK) / d];
		return { A, B, u: [(B[0] - A[0]) / TICK, (B[1] - A[1]) / TICK] };
	};
	const tick = (q, p, out) => {
		const t = outward(q, p, out);
		S.path([t.A, t.B], { color: DIM, width: HAIR, layer: 1.5, cap: 'butt', what: `the tick at ${q}, ${p}` });
		return t;
	};
	const number = async (src, t) => {
		const probe = await placed(src, 0, 0, 0.5, 0.5, DIM);
		const hw = (probe.box.r - probe.box.l) / 2, hh = (probe.box.b - probe.box.t) / 2;
		const reach = Math.abs(t.u[0]) * hw + Math.abs(t.u[1]) * hh + 2.4;
		return placed(src, t.B[0] + t.u[0] * reach, t.B[1] + t.u[1] * reach, 0.5, 0.5, DIM);
	};
	const fmt = (v) => (v < 0 ? `-${-v}` : `${v}`);
	const pTicks = [], qTicks = [];
	for (const v of [-3, -2, -1, 0, 1, 2, 3]) {
		pTicks.push({ v, t: tick(SPAN, v, [1, 0]) });
		qTicks.push({ v, t: tick(v, SPAN, [0, 1]) });
	}
	// numbers at -3, 0 and 3 on each axis; each axis's name between its numbers 0 and 3 (p) or 0 and -3 (q)
	for (const { v, t } of [...pTicks, ...qTicks]) if (v % 3 === 0) L.push(await number(fmt(v), t));
	const pMid = outward(SPAN, 1.5, [1, 0]), qMid = outward(-1.5, SPAN, [0, 1]);
	const pn = await number('p/\\sigma_p', pMid);
	L.push(pn);
	// (left-aligned clear of the tick above it, at q = -2, which ends further right on the receding edge)
	L.push(await placed('q/\\sigma_q', outward(-2, SPAN, [0, 1]).B[0] + 2.4, qMid.B[1], 0, 0.5, DIM));

	// ---- the slices' names, beyond their left ends
	for (const s of SLICES) {
		const [x, y] = page(s.q, -SPAN);
		L.push(await S.clear(s.src, x - NAME_GAP, y, 1, 0.5, [-1, 0], { color: s.color }));
	}

	// ---- the chart: the three slices, each divided by its own height, standing on the hill's front baseline
	const inkRight = Math.max(...L.map((l) => l.box.r));
	const base = at(SPAN, SPAN, 0)[1];
	const P = new Plot({ left: inkRight + CHART_GAP, top: base - CH, w: CW, h: CH, x0: -SPAN - 0.4, x1: SPAN + 0.4, y0: 0, y1: 1.06 });
	const cut = merge(P, OVER_W);
	const pa = -Math.sqrt(-2 * Math.log(cut)), pb = -pa;
	const curves = SLICES.map((s) => graph(P, (p) => w(s.q, p) / w(s.q, 0), pa, pb));
	// the three agree on the page to a billionth of a point; each is drawn through the first's points
	for (const c of curves) check(c.length === curves[0].length && c.every(([x, y], i) => near(x, curves[0][i][0], 1e-9) && near(y, curves[0][i][1], 1e-9)), 'the rescaled slices are not one curve on the page');
	check(longest(curves[0]) <= CHORD + 1e-9, `the rescaled slices have a step of ${longest(curves[0])} pt`);
	SLICES.forEach((s, i) => {
		const d = 'M' + curves[0].map(([x, y]) => `${n2(x)},${n2(y)}`).join('L');
		S.raw(`<path d="${d}" fill="none" stroke="${s.color}" stroke-width="${OVER_W}" stroke-linecap="butt" stroke-linejoin="round" stroke-dasharray="${DASH} ${2 * DASH}" stroke-dashoffset="${n2(-i * DASH)}"/>`, 2);
	});
	S.mark(curves[0], OVER_W / 2, 'the rescaled slices');
	L.push(...(await xAxis(S, P, { ticks: [-3, 0, 3], fmt, what: 'the chart\'s p axis' })));
	const lastX = L[L.length - 1];
	L.push(await placed('p/\\sigma_p', lastX.box.r + 4.5, (lastX.box.t + lastX.box.b) / 2, 0, 0.5, DIM));
	L.push(...(await yAxis(S, P, { ticks: [0, 1], fmt: (t) => (t ? '1' : null), what: 'the chart\'s axis' })));
	// the half-width: from p = 0 to sigma_p at e^{-1/2}, where the curve has fallen to e^{-1/2} of its height
	const yh = P.Y(Math.exp(-0.5));
	dimension(S, P.X(0), P.X(1), yh, { color: DIM, width: 0.45, what: 'the half-width' });
	L.push(await S.clear('\\sigma_p', P.X(0.5), yh + LABEL_GAP + 2.2, 0.5, 0, [0, 1], { color: DIM }));

	S.checkAll(L);
	window[name + '-numbers'] = { bMax, cut };
	return finish(S, L, [300, 450]);
}
