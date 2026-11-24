// The tutorial, chapter 6.6 (tutorial/relativity/maxwell-complex.md), its fourth diagram: light's two special
// directions for a charge at rest and for the same charge moving at 0.9c, in the style of the bottom row of the paper's
// Figure 'stars' (figs/stars.js). Two skies, one above the other, each the sky round the sensor seen from outside, a
// little from above and turned (the paper's view, mirrored so that the charge, along +x, stands to the right and in
// front): a circle for the sky, a veil of the page's neutral tint over everything behind it; a faint equator and a
// faint meridian, solid in front and dashed behind; the sensor at the centre as a small ring. Above, "charge at rest":
// the charge as a small ink disc along +x, outside the sky, and a thin dashed line from it through the centre; on it,
// on the sky, the two directions +-x as dots in the light role's colour (the one at -x behind, seen through the
// veil). Below, "moving at 0.9c": the charge, its dashed line to the centre, and an arrow along +y from it in the
// observer's colour, named "0.9c"; open circles at the places at rest, +-x; the two directions (+-0.436, 0.9, 0) as dots
// in the light role's colour, each with a thin path from its open circle (the directions at every speed from 0 to
// 0.9c, along the great circle z = 0, dashed where it runs behind); a thin dashed line between the two dots, and an
// arrow from the centre to its middle, (0, 0.9, 0), in the observer's colour, named "half sum = v_perp/c".
// Departures from the diagram's comment: the skies are stacked at every width, not side by side at 1440 px (the site
// shows one drawing at every width, as 6.2's tut-vectors-gradient). As in the paper's figure, the line through the
// charge runs to the centre in the lower sky too, the two dots there are joined by a dashed line whose middle the
// arrow from the centre reaches, and the paths run dashed and veiled where they pass behind. The arrow 0.9c is drawn
// at the same scale as the half sum, 0.9 of the sky's radius, so that the two can be compared; the half sum's name is
// set on two lines, to fit between the arrow and the meridian. The meridian is the one through the poles +-y and the
// direction (-0.27, 0, 0.96), which keeps clear of the arrows and the dots.
// Exact: the directions (the roots z = 0.9i +- 0.436 of m(z).F = 0 for F = E (-1, 0, 0.9i), and +-1 at rest, mapped to
// the sky by the stereographic coordinate), their paths (the roots at every speed, asserted on z = 0), the half sum
// (0, 0.9, 0) and the arrow 0.9c (asserted in tut-maxwell-lib.js), all in one orthographic view. Schematic: the
// charge's distance (1.45 sky radii) and the sizes of the dots, the ring and the charge.
import { Sheet, ORIGIN, finish, checker, placed, near, LABEL_GAP, VEC, VEC_HEAD } from './tut-pot-lib.js';
import { dashed } from './tut-orb-lib.js';
import { INK, DIM, RULE, PAGE } from '../lib.js';
import { chapter, palette, OBS, LIGHT, viewer, directions, SPEED } from './tut-maxwell-lib.js';

const name = 'tut-maxwell-sky';
const check = checker(name);

const R = 84;                              // the sky's radius, points
const TURN = -25, TILT = 14;               // the view: the paper's (figs/stars.js), turned the other way
const SKY = '#eeebe5', VEIL = 0.72;        // the paper's veil (drawing.ts, THEME: a neutral tint of the page)
const CIRCLE = 0.4, OUTLINE = 0.5;         // the great circles, the sky's outline
const FAINT_CIRCLE = 0.6;                  // the great circles in front: their opacity
const BODY_AT = 1.45, BODY = 3.2;          // the charge: its distance in sky radii, its radius in points
const RING = 2.4;                          // the sensor's ring
const STAR = 2.6, STAR_EDGE = 0.5;         // a direction's dot and its rim in the page's colour
const PATH = 0.7;                          // the paths
const LINE_DASH = [1.4, 1.6];              // the paper's dashed lines to the charge and between the dots
const BEHIND_DASH = [1.2, 1.6];            // and behind the sky
const MERIDIAN = [-0.2672, 0, 0.9636];     // the meridian through +-y and this direction (normalized below)
const ROW = 8, APART = 18;

export default async function () {
	const nums = chapter(check);
	await palette(check);
	const S = new Sheet(name);
	const L = [];
	const view = viewer(TURN, TILT);
	const front = (p) => view(p)[2] > 0;

	/** One sky centred at c on the page. */
	async function sky(c, moving) {
		const at = (p) => { const q = view(p); return [c[0] + q[0] * R, c[1] - q[1] * R]; };
		// ---- what lies behind: drawn first, then veiled
		const greats = [];
		{
			// the equator (normal y) and the meridian through +-y and MERIDIAN
			const m = Math.hypot(...MERIDIAN), d = MERIDIAN.map((v) => v / m);
			greats.push([[1, 0, 0], [0, 0, 1], 'the equator'], [d, [0, 1, 0], 'the meridian']);
		}
		for (const [u, w, what] of greats) {
			const pts = Array.from({ length: 721 }, (_, k) => { const t = (k * Math.PI) / 360; return u.map((x, i) => x * Math.cos(t) + w[i] * Math.sin(t)); });
			runs(pts, at, what, { color: RULE, width: CIRCLE, opacity: FAINT_CIRCLE });
		}
		// ---- the veil and the outline
		S.raw(`<circle cx="${c[0].toFixed(2)}" cy="${c[1].toFixed(2)}" r="${R}" fill="${SKY}" fill-opacity="${VEIL}"/>`, 0.5);
		S.raw(`<circle cx="${c[0].toFixed(2)}" cy="${c[1].toFixed(2)}" r="${R}" fill="none" stroke="${RULE}" stroke-width="${OUTLINE}"/>`, 0.6);
		S.mark(Array.from({ length: 361 }, (_, k) => [c[0] + R * Math.cos(k * Math.PI / 180), c[1] + R * Math.sin(k * Math.PI / 180)]), OUTLINE / 2, 'the sky');
		// the outline of the sky is the rim of the view: a point of the unit sphere seen edge-on lies on it
		check(near(Math.hypot(...view([0.6, 0.48, 0.64]).slice(0, 2)) ** 2 + view([0.6, 0.48, 0.64])[2] ** 2, 1, 1e-12), 'the view is not a turn');

		// ---- the charge, and the dashed line from it to the centre (at rest, on through the centre to -x)
		const body = at([BODY_AT, 0, 0]);
		S.raw(`<circle cx="${body[0].toFixed(2)}" cy="${body[1].toFixed(2)}" r="${BODY}" fill="${INK}"/>`, 4);
		S.mark([body], BODY, 'the charge');
		const o = at([0, 0, 0]);
		const far = moving ? o : at([-1, 0, 0]);
		{
			const u = [far[0] - body[0], far[1] - body[1]], l = Math.hypot(...u);
			const a = [body[0] + (u[0] / l) * (BODY + 1), body[1] + (u[1] / l) * (BODY + 1)];
			const b = moving ? [o[0] - (u[0] / l) * (RING + 1), o[1] - (u[1] / l) * (RING + 1)] : [far[0] - (u[0] / l) * (STAR + 0.6), far[1] - (u[1] / l) * (STAR + 0.6)];
			const clash = (q, gap) => !moving && Math.hypot(q[0] - o[0], q[1] - o[1]) < RING + gap + 0.4;
			dashed(S, a, b, { clash, color: DIM, width: CIRCLE, dash: LINE_DASH, layer: 1.5, what: 'the line to the charge' });
		}
		// ---- the sensor
		S.raw(`<circle cx="${o[0].toFixed(2)}" cy="${o[1].toFixed(2)}" r="${RING}" fill="${PAGE}" stroke="${INK}" stroke-width="0.6"/>`, 4);
		S.mark([o], RING + 0.3, 'the sensor');

		const star = (p, what) => {
			const q = at(p);
			S.raw(`<circle cx="${q[0].toFixed(2)}" cy="${q[1].toFixed(2)}" r="${STAR}" fill="${LIGHT}" stroke="${PAGE}" stroke-width="${STAR_EDGE}"/>`, front(p) ? 5 : 0.4);
			S.mark([q], STAR + STAR_EDGE / 2, what);
			return q;
		};
		const open = (p, what) => {
			const q = at(p);
			S.raw(`<circle cx="${q[0].toFixed(2)}" cy="${q[1].toFixed(2)}" r="${STAR}" fill="${PAGE}" stroke="${LIGHT}" stroke-width="${STAR_EDGE + 0.1}"/>`, front(p) ? 5 : 0.4);
			S.mark([q], STAR + STAR_EDGE / 2, what);
			return q;
		};

		if (!moving) {
			const d = directions(0);
			check(near(d[0][0], 1) && near(d[1][0], -1) && front(d[0]) && !front(d[1]), 'the directions at rest');
			star(d[0], 'the direction +x');
			star(d[1], 'the direction -x');
			return [];
		}

		// ---- moving at 0.9c: the paths, the open circles at rest, the dots, the half sum
		const labels = [];
		const steps = Array.from({ length: 181 }, (_, k) => (SPEED * k) / 180);
		const track = steps.map(directions);
		for (const side of [0, 1]) {
			const pts = track.map((d) => d[side]);
			runs(pts, at, `the path ${side}`, { color: LIGHT, width: PATH, front: 3 });
			open(pts[0], `the place at rest ${side}`);
		}
		const end = track[track.length - 1];
		check(end[0][0].toFixed(3) === '0.436' && end[1][0].toFixed(3) === '-0.436' && near(end[0][1], SPEED, 1e-14), `the dots at ${end}`);
		const q0 = star(end[0], 'the direction +'), q1 = star(end[1], 'the direction -');
		{
			const u = [q1[0] - q0[0], q1[1] - q0[1]], l = Math.hypot(...u), g = STAR + 1;
			dashed(S, [q0[0] + (u[0] / l) * g, q0[1] + (u[1] / l) * g], [q1[0] - (u[0] / l) * g, q1[1] - (u[1] / l) * g], { color: DIM, width: CIRCLE, dash: LINE_DASH, layer: 2, what: 'the line between the dots' });
		}
		const half = [0, 1, 2].map((k) => (end[0][k] + end[1][k]) / 2);
		check(near(half[0], 0) && near(half[1], SPEED, 1e-14) && near(half[2], 0), 'the half sum');
		const tip = at(half);
		{
			// the middle of the line between the dots is the half sum's tip
			check(near((q0[0] + q1[0]) / 2, tip[0], 1e-9) && near((q0[1] + q1[1]) / 2, tip[1], 1e-9), 'the arrow does not reach the middle of the line');
		}
		const up = [o[0] - tip[0], o[1] - tip[1]], lu = Math.hypot(...up);
		const hs = S.arrow([o[0] - (up[0] / lu) * (RING + 0.8), o[1] - (up[1] / lu) * (RING + 0.8)], tip, { color: OBS, width: VEC - 0.1, head: VEC_HEAD, layer: 4, what: 'the half sum' });
		// the velocity: from the charge along +y, 0.9 of the sky's radius, as the half sum
		const vTip = at([BODY_AT, SPEED, 0]);
		const vu = [vTip[0] - body[0], vTip[1] - body[1]], lv = Math.hypot(...vu);
		check(near(lv, Math.hypot(tip[0] - o[0], tip[1] - o[1]), 1e-9), 'the velocity is not drawn at the half sum\'s scale');
		const va = S.arrow([body[0] + (vu[0] / lv) * (BODY + 1), body[1] + (vu[1] / lv) * (BODY + 1)], vTip, { color: OBS, width: VEC - 0.1, head: VEC_HEAD, layer: 4, what: 'the velocity' });
		const mid = [(va.A[0] + va.B[0]) / 2, (va.A[1] + va.B[1]) / 2];
		check(String(SPEED) === '0.9', 'the printed speed');
		labels.push(await S.clear(`${SPEED}c`, mid[0] + LABEL_GAP + 1, mid[1], 0, 0.5, [1, 0], { color: OBS }));
		{
			const m = [(hs.A[0] + hs.B[0]) / 2, (hs.A[1] + hs.B[1]) / 2 + 4];
			labels.push(await S.clear('\\begin{array}{l}\\text{half sum}\\\\ {=}\\ \\mathbf v_{\\!\\perp}/c\\end{array}', m[0] + LABEL_GAP + 1.2, m[1], 0, 0.5, [0, -1], { color: OBS }));
		}
		return labels;
	}

	/** A curve on the sky (unit vectors), split where it passes behind: solid in front at layer `front`, dashed behind,
	 * where the veil covers it. */
	function runs(pts, at, what, { color, width, front: layer = 1, opacity = 1 }) {
		let run = [], vis = null, n = 0;
		const flush = () => {
			if (run.length < 2) return;
			if (vis && opacity < 1) {
				const q = run.map(at);
				S.raw(`<path d="M${q.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join('L')}" fill="none" stroke="${color}" stroke-width="${width}" stroke-opacity="${opacity}"/>`, layer);
				S.mark(q, width / 2, `${what}, part ${n++}`);
			} else if (vis) S.path(run.map(at), { color, width, layer, cap: 'butt', what: `${what}, part ${n++}` });
			else S.path(run.map(at), { color, width: width * 0.85, layer: 0.3, dash: BEHIND_DASH, cap: 'butt', what: `${what}, part ${n++} behind` });
		};
		for (const p of pts) {
			check(near(Math.hypot(...p), 1, 1e-12), `${what}: a point off the sky`);
			const f = front(p);
			if (vis !== null && f !== vis) { run.push(p); flush(); run = [p]; } else run.push(p);
			vis = f;
		}
		flush();
	}

	const left = ORIGIN - R - 10;
	const t1 = await placed('\\text{charge at rest}', left, ORIGIN - 300, 0, 0, INK);
	L.push(t1);
	const c1 = [left + 10 + R, t1.box.b + ROW + R];
	L.push(...await sky(c1, false));
	const t2 = await placed(`\\text{moving at } ${SPEED}c`, left, c1[1] + R + APART, 0, 0, INK);
	L.push(t2);
	const c2 = [c1[0], t2.box.b + ROW + R];
	L.push(...await sky(c2, true));

	S.checkAll(L);
	window[name + '-numbers'] = { ...nums, radius: R };
	return finish(S, L, [200, 340]);
}
