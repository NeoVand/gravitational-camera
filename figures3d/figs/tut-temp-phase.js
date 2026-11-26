// The tutorial, section 4.2 (tutorial/response/temperature.md), its second diagram: the weight on phase space of
// section 1.7's cart (m = 2 kg, k = 50 N/m) at 300 K, exp(-p^2/2mk_BT - kq^2/2k_BT), drawn as a hill over the plane
// (q, p), with q in units of sigma_q = sqrt(k_BT/k) = 9.1 x 10^-12 m and p in units of sigma_p = sqrt(m k_BT) =
// 9.1 x 10^-11 kg m/s (the chapter's diagram comment printed 9.1 x 10^-11 too, and it is right: sigma_p/sigma_q =
// sqrt(mk) = 10 kg/s), each from -3 to 3. The hill is a net of the lines of constant q and of constant p on the
// surface, every half unit, seen from above at a slant with its hidden parts removed, and its outline against what
// lies behind it. Three of the lines along p, at q = 0, sigma_q and 2 sigma_q, are the slices, drawn in ink, orange
// and blue. Beside the hill, the same three slices each divided by its own height, overlaid: three dashed curves in
// the three colours whose dashes interleave, so that where they coincide they make one unbroken line, the Gaussian
// exp(-p^2/2 sigma_p^2), with its half-width at e^{-1/2} of its height marked as sigma_p.
// Exact: the surface and its net (every point drawn on it; the weight in SI units asserted equal to
// exp(-(q/sigma_q)^2/2 - (p/sigma_p)^2/2) at sample points), the hidden parts (each point of every line tested by a
// ray toward the viewer, the ends of every visible run found by bisection), the outline (the curve where the line
// of sight grazes the surface, solved by bisection, asserted visible), the slices, the rescaled slices (asserted to
// be one curve to 1e-15) and the half-width sigma_p (asserted where the Gaussian is e^{-1/2}). Every curve is sampled
// so that no two neighbouring points are more than a quarter of a point apart. Chosen for the drawing: the view
// (an orthographic one, turned and tilted, as the paper's figures are drawn), the hill's height on the page, and the
// chart's scales.
import { INK, DIM, FAINT, ACCENT, ACCENT2 } from '../lib.js';
import { Sheet, ORIGIN, finish, checker, near, placed, n2, HAIR, TICK } from './tut-pot-lib.js';
import { Plot, xAxis, yAxis, LABEL_GAP, dimension, merge } from './tut-prob-lib.js';
import { graph, longest } from './tut-fourier-lib.js';
import { View } from './tut-noise-lib.js';
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
const TURN = 14, TILT = 31;                   // the view, degrees
const SCALE = 21;                             // points per unit of the plane
const HILL = 2.25;                            // the hill's height, in units of the plane
const NET = 0.5;                              // the net's spacing
const NET_W = 0.35, NET_OPACITY = 0.5, EDGE_W = 0.4, SLICE_W = 0.6, OUTLINE_W = 0.4;
const CHORD = 0.25;                           // the longest step of a curve on the page
const CW = 86, CH = 60;                       // the chart beside the hill
const CHART_GAP = 24;                         // from the hill's rightmost ink to the chart's axis
const OVER_W = 0.7, DASH = 2.1;               // the overlaid slices: stroke, and each colour's dash

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
	const V = new View({ turn: TURN, tilt: TILT, scale: SCALE, o: [ORIGIN - 60, ORIGIN + 30] });
	const tan = Math.tan((TILT * Math.PI) / 180);
	// the world: p to the right, q toward the viewer, the weight up
	const world = (q, p) => [p, -q, HILL * w(q, p)];
	const page = (q, p) => V.at(world(q, p));
	const height = (x, y) => HILL * w(-y, x);
	// toward the viewer, along the ground: the direction in which the view's depth grows fastest
	const toward = [-V.s, -V.c];
	check(near(V.depth([toward[0], toward[1], tan]), V.depth([0, 0, 0]) + 1 / V.cf, 1e-12) && near(V.at([toward[0], toward[1], tan])[0], V.at([0, 0, 0])[0], 1e-12)
		&& near(V.at([toward[0], toward[1], tan])[1], V.at([0, 0, 0])[1], 1e-12), 'the ray toward the viewer does not stay on one point of the page');

	/** Whether the point of the surface over (q, p) is seen: nothing of the surface rises above the ray from it to the viewer. */
	const seen = (q, p) => {
		const [x, y, z] = world(q, p);
		for (let a = 0.002; ; a += 0.002) {
			const X = x + toward[0] * a, Y = y + toward[1] * a;
			if (Math.abs(X) > SPAN || Math.abs(Y) > SPAN) return true;
			if (height(X, Y) > z + a * tan + 1e-12) return false;
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
	// ---- the outline: where the line of sight grazes the surface. In the ground's coordinates a toward the viewer
	// and b across, the slope toward the viewer is -HILL a e^{-(a^2 + b^2)/2}; it equals tan(TILT) on a closed curve,
	// whose inner branch (|a| < 1, on the far side of the top) is the hill's edge against what lies behind it.
	const across2 = [toward[1], -toward[0]];
	const kappa = tan / HILL;
	check(kappa < Math.exp(-0.5), 'the hill hides nothing: no outline');
	const bMax = Math.sqrt(2 * Math.log(Math.exp(-0.5) / kappa));
	const aOf = (b) => {                       // the inner root of -a e^{-a^2/2} = kappa e^{b^2/2}, a in (-1, 0)
		const target = kappa * Math.exp((b * b) / 2);
		let lo = -1, hi = 0;
		for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2; if (-m * Math.exp((-m * m) / 2) < target) hi = m; else lo = m; }
		return (lo + hi) / 2;
	};
	const outlineAt = (b) => { const a = aOf(b); const x = toward[0] * a + across2[0] * b, y = toward[1] * a + across2[1] * b; return [-y, x]; };
	for (const b of [-0.9 * bMax, 0, 0.5 * bMax]) {
		const [q, p] = outlineAt(b), a = aOf(b);
		const slope = (height(p + toward[0] * 1e-6, -q + toward[1] * 1e-6) - height(p - toward[0] * 1e-6, -q - toward[1] * 1e-6)) / 2e-6;
		check(near(slope, tan, 1e-6) && a > -1 && a < 0, `the outline at ${b} is not where the sight grazes`);
		check(seen(q, p), `the outline at ${b} is hidden`);
	}
	const outline = runs((t) => outlineAt(t), -bMax, bMax);
	check(outline.length === 1, 'the outline is not one piece');
	draw(outline, { color: DIM, width: OUTLINE_W, layer: 1.5, what: 'the outline' });

	// ---- the slices, whole: none of them passes behind the hill
	for (const s of SLICES) {
		const r = runs(along(s.q), -SPAN, SPAN);
		check(r.length === 1 && near(r[0][0][0], page(s.q, -SPAN)[0], 1e-9) && near(r[0][r[0].length - 1][0], page(s.q, SPAN)[0], 1e-9), `the slice at q = ${s.q} is not seen whole`);
		draw(r, { color: s.color, width: SLICE_W, layer: 3, what: `the slice at q = ${s.q}` });
	}

	// ---- the axes on the near edges: p along q = 3, q along p = -3; ticks lie in the ground, outward
	const tick = (q, p, out) => {
		const [x, y, z] = world(q, p);
		const A = V.at([x, y, z]), B0 = V.at([x + out[0], y + out[1], z]);
		const d = Math.hypot(B0[0] - A[0], B0[1] - A[1]);
		const B = [A[0] + ((B0[0] - A[0]) * TICK) / d, A[1] + ((B0[1] - A[1]) * TICK) / d];
		S.path([A, B], { color: DIM, width: HAIR, layer: 1.5, cap: 'butt', what: `the tick at ${q}, ${p}` });
		return { B, u: [(B[0] - A[0]) / TICK, (B[1] - A[1]) / TICK] };
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
		pTicks.push({ v, t: tick(SPAN, v, [0, -1]) });
		qTicks.push({ v, t: tick(v, -SPAN, [-1, 0]) });
	}
	// numbers at -3, 0 and 3 (p's -3 would share the near corner with q's 3), each axis's name beyond its last number
	const pNums = [], qNums = [];
	for (const { v, t } of pTicks) if (v === 0 || v === 3) pNums.push(await number(fmt(v), t));
	for (const { v, t } of qTicks) if (v % 3 === 0) qNums.push(await number(fmt(v), t));
	L.push(...pNums, ...qNums);
	const p3 = pNums[pNums.length - 1], q3 = qNums[qNums.length - 1];
	L.push(await placed('p/\\sigma_p', p3.box.r + 4.5, (p3.box.t + p3.box.b) / 2, 0, 0.5, DIM));
	L.push(await placed('q/\\sigma_q', q3.box.l - 4.5, (q3.box.t + q3.box.b) / 2, 1, 0.5, DIM));

	// ---- the slices' names, beyond their right ends
	for (const s of SLICES) {
		const [x, y] = page(s.q, SPAN);
		L.push(await S.clear(s.src, x + 4, y, 0, 0.5, [1, 0], { color: s.color }));
	}

	// ---- the chart: the three slices, each divided by its own height
	const inkRight = Math.max(...L.map((l) => l.box.r));
	const yAxisPage = page(SPAN, SPAN)[1] + 2;
	const P = new Plot({ left: inkRight + CHART_GAP, top: yAxisPage - CH, w: CW, h: CH, x0: -SPAN - 0.4, x1: SPAN + 0.4, y0: 0, y1: 1.06 });
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
	return finish(S, L, [240, 340]);
}
