// The tutorial, section 4.5 (tutorial/response/causality.md), its second diagram: the loop of the box that derives the
// Kramers-Kronig relation. The complex omega' plane on one scale in both directions, the real axis from -2.8 to 2.8
// ("Re omega'") and the imaginary axis from -0.5 to 2.8 ("Im omega'"), frequencies in units of omega_0: the plane of
// the integration variable omega', on whose real axis the fixed real omega is a point. The upper half
// plane lightly shaded and named "chi holomorphic". The cart's two poles for Q = 3 (Gamma = omega_0/3,
// omega_d = 0.986 omega_0), as crosses in the colour of 4.1's swing at +-omega_d - i Gamma/2 = +-0.986 - 0.167i, each
// named by its value under it (the names are an addition to the diagram's comment, so that the crosses are read as the
// text's poles). A dot at the real omega = 0.6, named below it. The loop, in neutral ink: along the real axis from
// -2.5 to 0.45, over the dot by the small half-circle 0.6 + 0.15 e^{i theta} with theta from pi to 0, on from 0.75 to
// 2.5, and back by the large half-circle 2.5 e^{i theta} with theta from 0 to pi; one arrowhead on each of the four
// pieces, anticlockwise; "R" beside the large half-circle and "delta" beside the small one.
// Exact: the poles (asserted in tut-caus-lib.js, `chapter`, to be the roots of omega_0^2 - omega^2 - i Gamma omega),
// the loop's pieces at their stated places and radii on the plane's one scale (asserted in points), its sense (its
// winding number about a point inside is +1) and that it encloses neither pole nor the dot (winding number 0).
// Chosen for the drawing: the radii R = 2.5 and delta = 0.15 and the place of omega.
import { Sheet, ORIGIN, finish, checker, placed, beside, near, AXIS, AXIS_HEAD, VEC, LABEL_GAP } from './tut-pot-lib.js';
import { Plot, pathOf } from './tut-prob-lib.js';
import { DOT as POINT } from './tut-bessel-lib.js';
import { TINT } from './tut-gauss-lib.js';
import { INK, DIM, ACCENT } from '../lib.js';
import { chapter, poles, cross, head, Q_POLES } from './tut-caus-lib.js';

const name = 'tut-caus-contour';
const check = checker(name);

const RE = [-2.8, 2.8], IM = [-0.5, 2.8];  // the axes, units of omega_0
const SCALE = 50;                          // points per omega_0, both directions
const R = 2.5, DELTA = 0.15, W = 0.6;      // the loop's radii and the real omega it steps over
const LOOP = VEC;                          // the loop's stroke
const HEAD = 3.6;                          // its arrowheads
const ON_AXIS = [-1.75, 1.75];             // the arrowheads on the two stretches of the real axis (clear of the poles)
const ON_ARC = (3 * Math.PI) / 4;          // and on the large half-circle (clear of the imaginary axis and of R)
const CROSS = 2.6;                         // half the size of a pole's cross
const CROSS_W = 0.75;

/** The winding number of a closed polyline of data points about the point p. */
function winding(pts, [px, py]) {
	let a = 0;
	for (let i = 0; i < pts.length; i++) {
		const [x0, y0] = pts[i], [x1, y1] = pts[(i + 1) % pts.length];
		a += Math.atan2((x0 - px) * (y1 - py) - (y0 - py) * (x1 - px), (x0 - px) * (x1 - px) + (y0 - py) * (y1 - py));
	}
	return Math.round(a / (2 * Math.PI) * 1e9) / 1e9;
}

export default async function () {
	const n = chapter(check);
	const S = new Sheet(name);
	const L = [];
	const PW = (RE[1] - RE[0]) * SCALE, PH = (IM[1] - IM[0]) * SCALE;
	const P = new Plot({ left: ORIGIN - PW / 2, top: ORIGIN - PH / 2, w: PW, h: PH, x0: RE[0], x1: RE[1], y0: IM[0], y1: IM[1] });
	check(near(P.w / (P.x1 - P.x0), P.h / (P.y1 - P.y0), 1e-12), 'the two axes are not on one scale');
	const at = ([x, y]) => P.at(x, y);

	// ---- the upper half plane, shaded
	const half = { l: P.left, r: P.right, t: P.top, b: P.Y(0) };
	S.fill(pathOf([[half.l, half.t], [half.r, half.t], [half.r, half.b], [half.l, half.b]]), half, { color: TINT, layer: 0.1, what: 'the upper half plane' });

	// ---- the axes
	const re = S.arrow(at([RE[0], 0]), at([RE[1], 0]), { color: DIM, width: AXIS, head: AXIS_HEAD, layer: 1, what: 'the real axis' });
	const im = S.arrow(at([0, IM[0]]), at([0, IM[1]]), { color: DIM, width: AXIS, head: AXIS_HEAD, layer: 1, what: 'the imaginary axis' });
	L.push(await placed("\\mathrm{Re}\\,\\omega'", re.B[0] + LABEL_GAP + 0.4, re.B[1], 0, 0.5, DIM));
	L.push(await placed("\\mathrm{Im}\\,\\omega'", im.B[0], im.B[1] - LABEL_GAP - 0.4, 0.5, 1, DIM));

	// ---- the loop: its four pieces in data points, each sampled finely enough on the page
	const STEP = 0.25 / SCALE;
	const line = (a, b) => { const k = Math.ceil((b - a) / STEP); return Array.from({ length: k + 1 }, (_, i) => [a + ((b - a) * i) / k, 0]); };
	const arc = (c, r, t0, t1) => {
		const k = 2 * Math.ceil((Math.abs(t1 - t0) * r) / STEP / 2);   // even, so that a point falls at the top
		return Array.from({ length: k + 1 }, (_, i) => { const t = t0 + ((t1 - t0) * i) / k; return [c + r * Math.cos(t), r * Math.sin(t)]; });
	};
	const pieces = [line(-R, W - DELTA), arc(W, DELTA, Math.PI, 0), line(W + DELTA, R), arc(0, R, 0, Math.PI)];
	const loop = pieces.flatMap((p, i) => (i ? p.slice(1) : p)).slice(0, -1);   // closed: the last point is the first
	// the pieces join, at the stated places
	check(near(pieces[0][0][0], -2.5, 1e-15) && near(pieces[0].at(-1)[0], 0.45, 1e-15), 'the first stretch');
	check(near(pieces[1][0][0], 0.45, 1e-15) && near(pieces[1].at(-1)[0], 0.75, 1e-15) && near(pieces[2][0][0], 0.75, 1e-15) && near(pieces[2].at(-1)[0], 2.5, 1e-15), 'the step over omega');
	check(near(pieces[3][0][0], 2.5, 1e-15) && near(pieces[3].at(-1)[0], -2.5, 1e-15) && near(pieces[3].at(-1)[1], 0, 1e-15), 'the large half-circle');
	{
		const top = pieces[1].reduce((m, p) => (p[1] > m[1] ? p : m));
		check(near(top[0], 0.6, 1e-15) && near(top[1], 0.15, 1e-15), `the small half-circle's top is ${top}, not 0.6 + 0.15i`);
	}
	// anticlockwise, round no pole and not round the dot
	check(winding(loop, [0, 1]) === 1 && winding(loop, [-1.2, 0.05]) === 1, 'the loop is not anticlockwise');
	const [p0, p1] = poles(Q_POLES);
	check(winding(loop, p0) === 0 && winding(loop, p1) === 0, 'the loop encloses a pole');
	check(winding(loop, [W, 0]) === 0 && winding(loop, [W, -1e-3]) === 0, 'the loop encloses omega');
	const page = loop.map(at);
	for (let i = 1; i < page.length; i++) check(Math.hypot(page[i][0] - page[i - 1][0], page[i][1] - page[i - 1][1]) <= 0.2501, 'the loop is coarse');
	check(near(Math.hypot(...[0, 1].map((k) => at([R, 0])[k] - at([0, 0])[k])), R * SCALE, 1e-9) && near(at([W, DELTA])[1] - at([W, 0])[1], -DELTA * SCALE, 1e-9), 'the radii on the page');
	S.path(page, { color: INK, width: LOOP, layer: 2, closed: true, what: 'the loop' });

	// ---- the arrowheads: the head's middle at the chosen point, along the loop's direction there
	const along = (p, u, what) => {
		const c = at(p), tip = [c[0] + (u[0] * HEAD) / 2, c[1] + (u[1] * HEAD) / 2];
		head(S, tip, u, HEAD, { color: INK, layer: 2.5, what });
	};
	along([ON_AXIS[0], 0], [1, 0], 'the first stretch\'s head');
	along([ON_AXIS[1], 0], [1, 0], 'the second stretch\'s head');
	{
		// on the small half-circle, at its top, the head's base and tip on the circle
		const c = at([W, 0]), r = DELTA * SCALE, a = HEAD / 2 / r;
		const tip = [c[0] + r * Math.cos(Math.PI / 2 - a), c[1] - r * Math.sin(Math.PI / 2 - a)];
		const base = [c[0] + r * Math.cos(Math.PI / 2 + a), c[1] - r * Math.sin(Math.PI / 2 + a)];
		const L0 = Math.hypot(tip[0] - base[0], tip[1] - base[1]);
		check(tip[0] > base[0], 'the small half-circle\'s head does not point along the loop');
		head(S, tip, [(tip[0] - base[0]) / L0, (tip[1] - base[1]) / L0], L0, { color: INK, layer: 2.5, what: 'the small half-circle\'s head' });
	}
	{
		// on the large half-circle at ON_ARC, pointing anticlockwise (on the page: y down)
		const c = at([0, 0]), r = R * SCALE, a = HEAD / 2 / r;
		const pt = (t) => [c[0] + r * Math.cos(t), c[1] - r * Math.sin(t)];
		const tip = pt(ON_ARC + a), base = pt(ON_ARC - a), L0 = Math.hypot(tip[0] - base[0], tip[1] - base[1]);
		head(S, tip, [(tip[0] - base[0]) / L0, (tip[1] - base[1]) / L0], L0, { color: INK, layer: 2.5, what: 'the large half-circle\'s head' });
	}

	// ---- the poles and the dot
	for (const p of [p0, p1]) cross(S, at(p), CROSS, { color: ACCENT, width: CROSS_W, layer: 3, what: `the pole at ${p[0].toFixed(3)}` });
	check(near(p1[0], n.wd3, 1e-15) && near(p0[0], -n.wd3, 1e-15), 'the poles are not at +-omega_d');
	const dot = at([W, 0]);
	S.raw(`<circle cx="${dot[0].toFixed(2)}" cy="${dot[1].toFixed(2)}" r="${POINT}" fill="${INK}"/>`, 3);
	S.mark([dot], POINT, 'omega');

	// ---- the labels
	const onHalf = (l) => Object.assign(l, { on: ['the upper half plane'] });
	L.push(await beside('\\omega', dot, [0, 1], POINT + LABEL_GAP + 0.4, INK));
	// each pole's value under its cross, not beside it, where the cross would read as a sign of the formula
	for (const [p, src] of [[p0, '-\\omega_d - i\\Gamma/2'], [p1, '\\omega_d - i\\Gamma/2']]) {
		L.push(await S.clear(src, at(p)[0], at(p)[1] + CROSS + LABEL_GAP + 0.6, 0.5, 0, [0, 1], { color: ACCENT }));
	}
	{
		const t = Math.PI / 4, q = at([R * Math.cos(t), R * Math.sin(t)]);
		L.push(onHalf(await beside('R', q, [Math.cos(t), -Math.sin(t)], LOOP / 2 + LABEL_GAP + 0.4, INK)));
		const s = Math.PI / 4, qs = at([W + DELTA * Math.cos(s), DELTA * Math.sin(s)]);
		L.push(onHalf(await beside('\\delta', qs, [Math.cos(s), -Math.sin(s)], LOOP / 2 + LABEL_GAP + 0.4, INK)));
	}
	L.push(onHalf(await placed('\\chi\\ \\text{holomorphic}', P.X(-1.15), P.Y(1.25), 0.5, 0.5, DIM)));

	S.checkAll(L);
	window[name + '-numbers'] = { poles: [p0, p1], wd: n.wd3 };
	return finish(S, L, [240, 340]);
}
