// The tutorial, section 5.2 (tutorial/waves/retarded-waves.md), its third diagram: far away, each direction reads one
// ripple of the source. Two panels. Left: a small source, an irregular blob in the neutral tint, round an origin O,
// and far to the upper right, beyond a break in the lines, the field point x = r n. From O and from a point y of the
// source, two parallel lines toward it, along the unit vector n, drawn from O; from y a perpendicular dropped onto the
// line from O, with its right angle, meets it at the distance n.y from O, which a dimension line beside it marks: the
// piece at y is nearer to the field point by n.y. Beyond the break the two lines close on the field point. Right: the
// plane of wavevectors (k_x, k_y), a circle of radius omega/c, named |k| = omega/c, with the point omega n/c on it, a
// dot, and an arrow from the origin to it, parallel on the page to the left panel's n (asserted); round the dot, an
// arc of the circle in the first accent, the cap that a camera of width D at the distance r reads, its angle D/r and
// its length k D/r, named so.
// Departure from the diagram's comment: the comment named the cap "D/r"; the chapter's text says that the camera
// spans the directions within about D/r of n and so reads a cap of width kD/r, and the name follows the text.
// Exact: the foot of the perpendicular and the dimension (asserted: the foot is at n.y along n and the perpendicular
// at right angles to it), the lines' directions, the dot on the circle and the arrow's direction, and the cap's angle
// and length for the chosen D/r. Schematic: the blob, the places of O and y, the distance to the field point (the
// break), where the lines close on it, and the cap's D/r = 0.5.
import { Sheet, ORIGIN, finish, checker, placed, near, n2, HAIR, LABEL_GAP, LINE, AXIS, AXIS_HEAD, VEC, VEC_HEAD, RIGHT, TICK } from './tut-pot-lib.js';
import { pathOf } from './tut-prob-lib.js';
import { longest } from './tut-fourier-lib.js';
import { DOT as POINT } from './tut-bessel-lib.js';
import { TINT } from './tut-gauss-lib.js';
import { INK, DIM, FAINT, ACCENT } from '../lib.js';
import { chapter } from './tut-ret-lib.js';

const name = 'tut-ret-far';
const check = checker(name);

// ---- the left panel, in points on the page, y up in the mathematics (the page's y is down) ----------------------
const ALPHA = (30 * Math.PI) / 180;       // n, from the horizontal
const BLOB = 42;                          // the blob's mean radius
const Y_AT = [0.7, (21 * Math.PI) / 180];   // y: its distance from O in units of BLOB, its angle from n (toward the upper left)
const REACH = 66;                         // the parallel lines run this far along n from O before the break
const GAP = 7;                            // the break
const CLOSE = 30;                         // beyond the break, O's line runs on this far to the field point
const N_LEN = 15;                         // n's arrow
const DIM_OFF = 6;                        // the dimension line, this far beside O's line, on the side away from y
const BREAK = 3.2;                        // half the length of a break's slanted stroke
// ---- the right panel -------------------------------------------------------------------------------------------
const K_R = 36;                           // the circle's radius omega/c, points
const K_AX = 50;                          // the axes' half-length
const CAP = 0.5;                          // D/r, the cap's angle, radians (schematic)
const CAP_W = 1.6;                        // the cap's stroke
const APART = 22;                         // from the left panel's rightmost mark or label to the right panel's k_x axis

const dot = (a, b) => a[0] * b[0] + a[1] * b[1];
const unit2 = (a) => { const l = Math.hypot(a[0], a[1]); return [a[0] / l, a[1] / l]; };

/** The blob's radius at the angle th: a sum of a few smooth ripples, all chosen for the drawing. */
const blobR = (th) => BLOB * (1 + 0.1 * Math.sin(2 * th + 0.4) + 0.06 * Math.cos(3 * th - 0.4) + 0.035 * Math.sin(5 * th + 1.9));

export default async function () {
	chapter(check);
	const S = new Sheet(name);
	const L = [];
	const n = [Math.cos(ALPHA), Math.sin(ALPHA)], perp = [-Math.sin(ALPHA), Math.cos(ALPHA)];
	// the page from mathematical coordinates (y up) about an origin
	const pg = (o) => ([x, y]) => [o[0] + x, o[1] - y];

	// ---- the left panel
	const O = [ORIGIN - 120, ORIGIN + 30];
	const P = pg(O);
	const yv = [Y_AT[0] * BLOB * Math.cos(ALPHA + Y_AT[1]), Y_AT[0] * BLOB * Math.sin(ALPHA + Y_AT[1])];
	const ny = dot(n, yv), py = dot(perp, yv);
	check(ny > 0 && py > 0, 'y is not ahead of O and to the upper left of its line');
	check(Math.hypot(...yv) < blobR(ALPHA + Y_AT[1]) - 4, `y is not well inside the blob: ${Math.hypot(...yv)}, ${blobR(ALPHA + Y_AT[1])}`);
	const foot = [ny * n[0], ny * n[1]];
	check(near(dot([yv[0] - foot[0], yv[1] - foot[1]], n), 0, 1e-12), 'the perpendicular is not at right angles to n');
	check(near(Math.hypot(...foot), ny, 1e-12), 'the foot is not at n.y from O');
	check(N_LEN < ny - RIGHT - 2, 'n\'s arrow reaches the foot');

	// the blob
	{
		const m = 1440;
		const pts = Array.from({ length: m + 1 }, (_, i) => { const th = (2 * Math.PI * i) / m; return P([blobR(th) * Math.cos(th), blobR(th) * Math.sin(th)]); });
		check(longest(pts) <= 0.25, 'the blob is coarse');
		const xs = pts.map((q) => q[0]), ys = pts.map((q) => q[1]);
		S.fill(pathOf(pts), { l: Math.min(...xs), r: Math.max(...xs), t: Math.min(...ys), b: Math.max(...ys) }, { color: TINT, layer: 0, what: 'the blob', solid: false });
		S.path(pts, { color: FAINT, width: HAIR, layer: 0.5, what: 'the blob\'s edge' });
	}
	// the two parallel lines, to the break; beyond it, the two close on the field point
	const along = (p, s) => [p[0] + s * n[0], p[1] + s * n[1]];
	// the break: two parallel slanted strokes across both lines, the lines stopping and resuming on them
	const slant = unit2([perp[0] + 0.45 * n[0], perp[1] + 0.45 * n[1]]);
	const onY = (e) => { const s = (py - dot(e, perp)) / dot(slant, perp); return [e[0] + s * slant[0], e[1] + s * slant[1]]; };
	const endO = along([0, 0], REACH), endY = onY(endO);
	const resumeO = along(endO, GAP), resumeY = onY(resumeO);
	for (const q of [endY, resumeY]) check(near(dot(q, perp), py, 1e-12), 'a break is off the line from y');
	check(dot(endY, n) > ny + 10, 'the line from y is too short');
	S.path([P([0, 0]), P(endO)], { color: INK, width: HAIR + 0.1, layer: 1, cap: 'butt', what: 'the line from O' });
	S.path([P(yv), P(endY)], { color: INK, width: HAIR + 0.1, layer: 1, cap: 'butt', what: 'the line from y' });
	const X = along(resumeO, CLOSE);
	S.path([P(resumeO), P(X)], { color: INK, width: HAIR + 0.1, layer: 1, cap: 'butt', what: 'the line from O, beyond' });
	S.path([P(resumeY), P(X)], { color: INK, width: HAIR + 0.1, layer: 1, cap: 'butt', what: 'the line from y, beyond' });
	{
		const over = BREAK / Math.abs(dot(slant, perp));
		for (const [e, f] of [[endO, endY], [resumeO, resumeY]]) {
			const a = [e[0] - over * slant[0], e[1] - over * slant[1]], b = [f[0] + over * slant[0], f[1] + over * slant[1]];
			S.path([P(a), P(b)], { color: INK, width: HAIR, layer: 1, cap: 'butt', what: 'a break' });
		}
	}
	// n's arrow, from O, over its line
	const nArrow = S.arrow(P([0, 0]), P(along([0, 0], N_LEN)), { color: INK, width: VEC, head: VEC_HEAD, layer: 3, what: 'n' });
	// the perpendicular from y to the foot, with its right angle
	S.path([P(yv), P(foot)], { color: DIM, width: HAIR, layer: 1, cap: 'butt', what: 'the perpendicular' });
	{
		const a = along(foot, -RIGHT), b = [a[0] + RIGHT * perp[0], a[1] + RIGHT * perp[1]], c = [foot[0] + RIGHT * perp[0], foot[1] + RIGHT * perp[1]];
		S.path([P(a), P(b), P(c)], { color: DIM, width: HAIR, layer: 1, cap: 'butt', what: 'the right angle' });
	}
	// the dimension n.y, beside O's line on the side away from y
	{
		const off = (p) => [p[0] - DIM_OFF * perp[0], p[1] - DIM_OFF * perp[1]];
		const a = off([0, 0]), b = off(foot);
		S.path([P(a), P(b)], { color: ACCENT, width: HAIR + 0.15, layer: 2, cap: 'butt', what: 'the path difference' });
		for (const e of [a, b]) {
			const u = [e[0] - (TICK * perp[0]), e[1] - (TICK * perp[1])], v = [e[0] + (TICK * perp[0]), e[1] + (TICK * perp[1])];
			S.path([P(u), P(v)], { color: ACCENT, width: HAIR + 0.15, layer: 2, cap: 'butt', what: 'the path difference\'s end' });
		}
		check(near(Math.hypot(b[0] - a[0], b[1] - a[1]), ny, 1e-12), 'the dimension is not n.y long');
		const mid = P(off([foot[0] / 2, foot[1] / 2]));
		L.push(await S.clear('\\hat n\\cdot\\boldsymbol y', mid[0] + 1, mid[1] + 2, 0, 0, unit2([-perp[0], perp[1]]), { color: ACCENT }));
	}
	// the dots
	for (const [p, what] of [[[0, 0], 'O'], [yv, 'y'], [X, 'the field point']]) {
		const q = P(p);
		S.raw(`<circle cx="${n2(q[0])}" cy="${n2(q[1])}" r="${POINT}" fill="${INK}"/>`, 4);
		S.mark([q], POINT, `the dot ${what}`);
	}
	{
		const q = P([0, 0]);
		const o = await S.clear('O', q[0] - POINT - LABEL_GAP - 0.4, q[1] + 1, 1, 0, [-0.6, 0.8], { color: INK });
		const yq = P(yv);
		const yl = await S.clear('\\boldsymbol y', yq[0] - POINT - LABEL_GAP - 0.4, yq[1] - 1, 1, 1, [-0.8, -0.6], { color: INK });
		const nl = await S.clear('\\hat n', P(along([0, 0], N_LEN * 0.55))[0] - 1, P(along([0, 0], N_LEN * 0.55))[1] - 2.5, 1, 1, unit2([perp[0], -perp[1]]), { color: INK });
		L.push(o, yl, nl);
		const xq = P(X);
		L.push(await S.clear('\\boldsymbol x = r\\hat n', xq[0], xq[1] - POINT - LABEL_GAP, 0.5, 1, [0, -1], { color: INK }));
	}
	check(nArrow.head <= 0.4 * nArrow.L, 'n\'s head');

	// ---- the right panel: the plane of wavevectors, to the right of everything on the left
	const leftmost = Math.max(...S.marks.flatMap((m) => m.pts.map((q) => q[0] + m.r)), ...L.map((l) => l.box.r));
	const C = [leftmost + APART + K_AX, O[1] - 16];
	const Q = pg(C);
	S.arrow(Q([-K_AX, 0]), Q([K_AX, 0]), { color: DIM, width: AXIS, head: AXIS_HEAD, layer: 1, what: 'the k_x axis' });
	S.arrow(Q([0, -K_AX]), Q([0, K_AX]), { color: DIM, width: AXIS, head: AXIS_HEAD, layer: 1, what: 'the k_y axis' });
	L.push(await placed('k_x', Q([K_AX, 0])[0] + LABEL_GAP, Q([K_AX, 0])[1], 0, 0.5, DIM));
	L.push(await placed('k_y', Q([0, K_AX])[0], Q([0, K_AX])[1] - LABEL_GAP, 0.5, 1, DIM));
	// the circle |k| = omega/c
	const ring = Array.from({ length: 1201 }, (_, i) => { const th = (2 * Math.PI * i) / 1200; return Q([K_R * Math.cos(th), K_R * Math.sin(th)]); });
	check(longest(ring) <= 0.25, 'the circle is coarse');
	S.path(ring, { color: INK, width: LINE, layer: 2, what: 'the circle' });
	// the cap round omega n / c: the arc of the circle from ALPHA - CAP/2 to ALPHA + CAP/2
	{
		const m = Math.ceil((CAP * K_R) / 0.2);
		const arc = Array.from({ length: m + 1 }, (_, i) => { const th = ALPHA - CAP / 2 + (CAP * i) / m; return Q([K_R * Math.cos(th), K_R * Math.sin(th)]); });
		check(longest(arc) <= 0.25, 'the cap is coarse');
		let len = 0;
		for (let i = 1; i < arc.length; i++) len += Math.hypot(arc[i][0] - arc[i - 1][0], arc[i][1] - arc[i - 1][1]);
		check(near(len, K_R * CAP, 1e-3 * K_R * CAP), `the cap is ${len} long, not k D/r`);
		S.path(arc, { color: ACCENT, width: CAP_W, layer: 2.5, cap: 'butt', what: 'the cap' });
	}
	// the dot omega n / c and the arrow to it, parallel on the page to n on the left
	const kd = [K_R * n[0], K_R * n[1]];
	check(near(Math.hypot(...kd), K_R, 1e-12), 'the dot is not on the circle');
	const kq = Q(kd), oq = Q([0, 0]);
	const ka = S.arrow(oq, [kq[0] - POINT * n[0], kq[1] + POINT * n[1]], { color: INK, width: VEC, head: VEC_HEAD, layer: 3, what: 'omega n / c' });
	const left = [nArrow.B[0] - nArrow.A[0], nArrow.B[1] - nArrow.A[1]];
	check(near(Math.abs(left[0] * ka.u[1] - left[1] * ka.u[0]) / Math.hypot(...left), 0, 1e-12) && left[0] * ka.u[0] > 0, 'the arrow is not parallel to n');
	S.raw(`<circle cx="${n2(kq[0])}" cy="${n2(kq[1])}" r="${POINT}" fill="${INK}"/>`, 4);
	S.mark([kq], POINT, 'the dot omega n / c');
	const dl = await S.clear('\\omega\\hat n/c', kq[0] + 3.5, kq[1] - 1, 0, 1, unit2([n[0], -n[1]]), { color: INK });
	L.push(dl);
	{
		const q = Q([K_R * Math.cos(-2.3), K_R * Math.sin(-2.3)]);
		L.push(await S.clear('|\\boldsymbol k| = \\omega/c', q[0] - 2, q[1] + 2, 1, 0, unit2([-1, 1]), { color: INK }));
	}
	{
		// the cap's name, in two lines, over the dot's
		const l2 = await placed('\\text{reads a cap } kD/r', dl.box.l, dl.box.t - 3, 0, 1, ACCENT);
		const l1 = await placed('\\text{a camera of width } D', dl.box.l, l2.box.t - 2.4, 0, 1, ACCENT);
		L.push(l1, l2);
	}

	S.checkAll(L);
	window[name + '-numbers'] = { ny, py, cap: CAP, capLength: K_R * CAP };
	return finish(S, L, [240, 340]);
}
