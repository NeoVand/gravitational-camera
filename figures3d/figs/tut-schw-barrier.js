// The tutorial, section 11.1 (tutorial/black-holes/schwarzschild.md), its third diagram: light's barrier and three
// exact rays. Two panels side by side. Left, on linear axes: across, r/r_s from 1 to 8; up, the barrier (1 - r_s/r)/r^2
// in units of 1/r_s^2, named at the top of its axis, its one tick at the peak's height 4/27r_s^2. The barrier in ink,
// zero at the horizon and peaking at r = 1.5 r_s (a dashed line, "photon sphere"); three levels 1/b^2 in the page's
// grey: above the peak (b = 0.8 b_c, "b < b_c: falls in"), touching it (b = b_c, "b = b_c") and below it (b = 1.6 b_c,
// "b > b_c: turns back"). Right, the plane of the orbit, on one scale in r_s: the hole as a dark disc of radius r_s,
// the photon sphere dashed, and three exact rays from the left in the light role's colour, b = 0.8 b_c (ends on the
// horizon), 1.0001 b_c (winds round the photon sphere: it sweeps 685 degrees, 505 more than a straight line, about one
// and a half turns) and 1.6 b_c (bent by 46 degrees and leaving), each named at its left end by its b.
// Departures from the diagram's comment: the rays are named at their left ends with their fates in the left panel's
// words, "0.8 b_c: falls in", "1.0001 b_c: winds" and "1.6 b_c: turns back"; the ray that falls in is dashed, so that
// where the winding ray crosses it near the photon sphere a reader can follow each; the two that leave end in heads
// where they leave the panel's window (r_s units, -3.5 to 2.7 across and -2.2 to 4.5 up), the other at the horizon;
// the levels are drawn in the page's grey, the barrier in ink; the barrier's axis is named and its peak's height
// ticked; the axis across starts at 0.5 r_s, so that the barrier, which leaves the horizon almost straight up, does not
// run along the axis up; and the photon sphere's dashes are cut where a ray runs over them.
// Exact: the barrier and its peak (1.5 r_s, 4/27r_s^2, asserted), the levels 1/b^2 for the three b (0.8 b_c's above the
// peak, 1.6 b_c's below it and crossing the barrier at 1.071 and 3.52 r_s on either side), the rays (the chapter's
// orbit equation, integrated by the port in tut-schw-lib.js; the first integral checked along each; the first falls in,
// the second's nearest approach is within 1% of the photon sphere, the third's at 3.52 r_s), the hole's and the photon
// sphere's radii against the rays. Schematic: nothing.
import { Sheet, ORIGIN, finish, checker, placed, boxOf, LABEL_GAP, SIZE, n2 } from './tut-pot-lib.js';
import { Plot, xAxis, yAxis } from './tut-prob-lib.js';
import { graph, longest } from './tut-fourier-lib.js';
import { dashed } from './tut-orb-lib.js';
import { tex, INK, DIM, PAGE } from '../lib.js';
import { chapter, palette, near, LIGHT, HOLE, BC, RS, barrier, incoming, firstIntegral, thin } from './tut-schw-lib.js';

const name = 'tut-schw-barrier';
const check = checker(name);

// ---- the drawing (points) ----------------------------------------------------------------------------------------
const X0 = 0.5, X1 = 8, Y1 = 0.255;             // the barrier's axes: r/r_s (ticked from 1), and 1/r_s^2 from 0
const PW = 116, PH = 134;                       // the barrier's plot
const GAP = 14;                                 // between the plot and the window's left labels
const WIN = { x0: -3.5, x1: 2.7, y0: -2.2, y1: 4.5 };   // the plane's window, r_s
const Q = PH / (WIN.y1 - WIN.y0);               // points per r_s in the plane: the window as tall as the plot
const KS = [0.8, 1.0001, 1.6];                  // the rays' b over b_c
const CURVE = 0.7, LEVEL = 0.5, RAY = 0.65, HALO = 0.6, LINE = 0.45, EDGE = 0.45;
const HEAD = 3.4;                               // the heads where the rays leave the window
const FALL_DASH = [2.6, 1.5];                   // the ray that falls in
const caption = 'Look first at the peak: a ray whose level $1/b^2$ clears it falls into the hole, and one that meets it turns back. The rays are exact Schwarzschild rays.';

export default async function () {
	const { state } = await chapter(check);
	await palette(check);
	state(name, 'schw-barrier', caption);

	const S = new Sheet(name);
	const L = [];
	const left = ORIGIN - 175;
	const P = new Plot({ left, top: ORIGIN - PH / 2, w: PW, h: PH, x0: X0, x1: X1, y0: 0, y1: Y1 });

	// ---- left: the barrier, in units of 1/r_s^2 against r/r_s
	const peak = 4 / 27;
	check(near(barrier(1.5), peak, 1e-15), 'the peak is not 4/27');
	const level = (k) => peak / (k * k);           // 1/b^2 in units of 1/r_s^2, b = k b_c, b_c^2 = 27/4 r_s^2
	check(near(level(1), 1 / (BC / RS) ** 2, 1e-15), 'the level of b_c is not 1/b_c^2');
	check(level(0.8) > peak && level(0.8) < Y1 && level(1.6) < peak, 'the levels');
	const xl = await xAxis(S, P, { ticks: [1, 2, 3, 4, 5, 6, 7, 8], what: 'the axis across' });
	L.push(...xl);
	L.push(await placed('r/r_s', P.X(4.5), Math.max(...xl.map((l) => l.box.b)) + 4, 0.5, 0, DIM));
	const yl = await yAxis(S, P, { ticks: [0, peak], fmt: (t) => (t === 0 ? '0' : '4/27r_s^2'), what: 'the axis up' });
	L.push(...yl);
	const curve = graph(P, barrier, 1, X1, 0.2);
	check(longest(curve) <= 0.2001 && near(curve[0][1], P.bottom, 1e-9), 'the barrier does not start on the axis');
	S.path(curve, { color: INK, width: CURVE, layer: 3, cap: 'butt', what: 'the barrier' });
	// the three levels, across the plot
	const names = { 0.8: 'b < b_c\\text{: falls in}', 1: 'b = b_c', 1.6: 'b > b_c\\text{: turns back}' };
	for (const k of [0.8, 1, 1.6]) {
		S.path([[P.left, P.Y(level(k))], [P.right, P.Y(level(k))]], { color: DIM, width: LEVEL, layer: 2.5, cap: 'butt', what: `the level of ${k} b_c` });
		L.push(await placed(names[k], P.right, P.Y(level(k)) - LABEL_GAP - LEVEL / 2 - 0.1, 1, 1, INK));
	}
	{
		// 1.6 b_c meets the barrier on both sides of the peak; b_c touches it at the peak only
		const cross = (a, b, y) => { let lo = a, hi = b; const up = barrier(b) > barrier(a); for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2; if ((barrier(m) < y) === up) lo = m; else hi = m; } return (lo + hi) / 2; };
		const inner = cross(1, 1.5, level(1.6)), outer = cross(1.5, X1, level(1.6));
		check(inner.toFixed(3) === '1.071' && outer.toFixed(2) === '3.52', `1.6 b_c meets the barrier at ${inner} and ${outer}`);
		for (let i = 0; i <= 2000; i++) { const x = 1 + (i / 2000) * (X1 - 1); check(barrier(x) <= peak + 1e-15, `the barrier passes its peak at ${x}`); }
	}
	// one row of names over the plot, on one baseline: the axis's name, ending at the axis, and "photon sphere" beside
	// the top of its dashed line, which runs up from the axis to the middle of the names' small letters
	{
		const base = P.top - 6;
		const axisName = await tex('(1 - r_s/r)/r^2', [0, base], SIZE, 'lB', DIM);
		const w = boxOf(axisName);
		const a = await tex('(1 - r_s/r)/r^2', [P.left + 1 - (w.r - w.l), base], SIZE, 'lB', DIM);
		L.push({ src: 'the axis\'s name', svg: a, box: boxOf(a) });
		const xh = boxOf(await tex('\\text{x}', [0, base], SIZE, 'lB', INK));
		dashed(S, [P.X(1.5), P.bottom], [P.X(1.5), (xh.t + xh.b) / 2], { color: DIM, width: LINE, layer: 2, what: 'the photon sphere\'s line' });
		const p = await tex('\\text{photon sphere}', [P.X(1.5) + LABEL_GAP + LINE / 2 + 0.4, base], SIZE, 'lB', DIM);
		L.push({ src: 'photon sphere', svg: p, box: boxOf(p) });
	}

	// ---- right: the plane of the orbit, x to the right, y up, r_s units; the hole at (0, 0)
	// the rays' names, each with its fate in the left panel's words, stand left of the window: it starts as far right
	// of the plot as the longest needs
	const rayNames = { 0.8: '0.8\\,b_c\\text{: falls in}', 1.0001: '1.0001\\,b_c\\text{: winds}', 1.6: '1.6\\,b_c\\text{: turns back}' };
	const nameW = Math.max(...(await Promise.all(KS.map(async (k) => { const g = await placed(rayNames[k], 0, 0, 0, 0, INK); return g.box.r - g.box.l; }))));
	const winLeft = P.right + GAP + nameW + LABEL_GAP + 0.4;   // the window's left edge
	const O = [winLeft - WIN.x0 * Q, P.top + WIN.y1 * Q];
	const at = ([x, y]) => [O[0] + x * Q, O[1] - y * Q];
	const inWin = ([x, y]) => x >= WIN.x0 && x <= WIN.x1 && y >= WIN.y0 && y <= WIN.y1;
	check(near(at([0, WIN.y0])[1], P.bottom, 1e-9), 'the window is not as tall as the plot');
	const circle = (r, n = 720) => Array.from({ length: n + 1 }, (_, i) => at([r * Math.cos((2 * Math.PI * i) / n), r * Math.sin((2 * Math.PI * i) / n)]));
	// the hole over the rays, so that the one that ends on the horizon ends at its edge, which no halo cuts
	S.raw(`<circle cx="${n2(O[0])}" cy="${n2(O[1])}" r="${n2(Q)}" fill="${HOLE}" stroke="${INK}" stroke-width="${EDGE}"/>`, 3.8);
	S.mark(circle(1, 180), EDGE / 2, 'the hole');

	// the rays: from far to the left (the integrator's +x mirrored), points in r_s
	const rays = [];
	for (const k of KS) {
		const b = k * BC;
		const ray = incoming(b, { step: 1e-3, keep: true, maxPhi: 20 * Math.PI });
		check(firstIntegral(ray.points, b) < 1e-5, `the first integral along ${k} b_c`);
		const pts = ray.points.map(([x, y]) => [-x / RS, y / RS]);
		// from where it enters the window to where it first leaves it (or ends on the horizon)
		const i0 = pts.findIndex(inWin);
		let i1 = pts.length;
		for (let i = i0; i < pts.length; i++) if (!inWin(pts[i])) { i1 = i; break; }
		// the ends exactly on the window's edges
		const edge = (p, q) => {
			// p inside, q outside: where the segment leaves the window, by bisection
			let lo = 0, hi = 1;
			for (let n = 0; n < 60; n++) { const m = (lo + hi) / 2; if (inWin([p[0] + m * (q[0] - p[0]), p[1] + m * (q[1] - p[1])])) lo = m; else hi = m; }
			return [p[0] + lo * (q[0] - p[0]), p[1] + lo * (q[1] - p[1])];
		};
		const kept = pts.slice(i0, i1);
		if (i0 > 0) kept.unshift(edge(pts[i0], pts[i0 - 1]));
		if (i1 < pts.length) kept.push(edge(pts[i1 - 1], pts[i1]));
		rays.push({ k, b, fate: ray.fate, rMin: ray.rMin / RS, swept: ray.phi, pts: kept });
	}
	check(rays[0].fate === 'horizon' && rays[1].fate === 'infinity' && rays[2].fate === 'infinity', 'the rays\' fates');
	check(Math.abs(rays[1].rMin / 1.5 - 1) < 0.01 && (rays[1].swept * 180 / Math.PI).toFixed(0) === '685', `the winding ray: ${rays[1].rMin}, ${rays[1].swept}`);
	check(rays[2].rMin.toFixed(2) === '3.52' && ((rays[2].swept - Math.PI) * 180 / Math.PI).toFixed(0) === '46', `the leaving ray: ${rays[2].rMin}, ${rays[2].swept}`);
	check(rays.every((r) => near(r.pts[0][0], WIN.x0, 1e-9)), 'a ray does not start on the window\'s left edge');
	check(rays.every((r, i) => Math.abs(r.pts[0][1] - (KS[i] * BC) / RS) < 0.1 && r.pts[0][1] < (KS[i] * BC) / RS), 'the rays do not enter just under their b');

	// the photon sphere, dashed, its dashes cut where a ray runs within HALO + RAY of them
	{
		const page = rays.map((r) => r.pts.map(at));
		const len = 2 * Math.PI * 1.5 * Q, k = Math.round(len / 4.2), step = len / k;
		for (let i = 0; i < k; i++) {
			const a0 = (i * step) / (1.5 * Q), a1 = a0 + (0.57 * step) / (1.5 * Q);
			const seg = Array.from({ length: 9 }, (_, j) => at([1.5 * Math.cos(a0 + ((a1 - a0) * j) / 8), 1.5 * Math.sin(a0 + ((a1 - a0) * j) / 8)]));
			const hit = seg.some((q) => page.some((ray) => ray.some((p) => Math.hypot(p[0] - q[0], p[1] - q[1]) < RAY / 2 + HALO + LINE / 2)));
			if (hit) continue;
			S.path(seg, { color: DIM, width: LINE, layer: 2, cap: 'butt', what: `the photon sphere, dash ${i}` });
		}
	}
	for (const r of rays) {
		const page = thin(r.pts.map(at));
		// a ray that leaves the window ends in a head along its last direction; the one that falls in ends on the horizon
		let body = page;
		if (r.fate === 'infinity') {
			const tip = page[page.length - 1];
			let k = page.length - 1;
			while (k > 0 && Math.hypot(page[k][0] - tip[0], page[k][1] - tip[1]) < HEAD) k--;
			const base = page[k], d = [tip[0] - base[0], tip[1] - base[1]], l = Math.hypot(...d), u = [d[0] / l, d[1] / l], w = [-u[1], u[0]], hw = 0.36 * l;
			let j = page.length - 1;
			while (j > 0 && Math.hypot(page[j][0] - tip[0], page[j][1] - tip[1]) < 0.8 * l) j--;
			body = page.slice(0, j + 1);
			const tri = [tip, [base[0] + w[0] * hw, base[1] + w[1] * hw], [base[0] - w[0] * hw, base[1] - w[1] * hw]];
			S.raw(`<path d="M${tri.map(([x, y]) => `${n2(x)},${n2(y)}`).join('L')}Z" fill="${LIGHT}"/>`, 3.6);
			S.mark([...tri, tri[0]], 0, `the head of ${r.k} b_c`);
		}
		S.path(page, { color: PAGE, width: RAY + 2 * HALO, layer: 3.4, cap: 'butt', what: `the halo of ${r.k} b_c` });
		// the ray that falls in is dashed, so that where it meets the winding ray near the photon sphere the two are told apart
		S.path(body, { color: LIGHT, width: RAY, layer: 3.5, cap: 'butt', dash: r.fate === 'horizon' ? FALL_DASH : null, what: `the ray of ${r.k} b_c` });
	}
	// the rays' names, at their left ends
	for (const r of rays) {
		const [x, y] = at(r.pts[0]);
		L.push({ ...(await placed(rayNames[r.k], x - LABEL_GAP - 0.4, y, 1, 0.5, INK)), on: [] });
	}

	S.checkAll(L.map((l) => ({ ...l, on: [...(l.on ?? []), ...rays.map((r) => `the halo of ${r.k} b_c`)] })));
	window[name + '-numbers'] = { Q, rays: rays.map((r) => ({ k: r.k, fate: r.fate, rMin: r.rMin, swept: (r.swept * 180) / Math.PI })) };
	return finish(S, L, [300, 380]);
}
