// The tutorial, section 1.6 (tutorial/newton/motion.md), its fourth diagram: a turning frame, seen from outside and
// from inside. A table (a disc, drawn in true 3D, an orthographic view tilted and turned as lib.js's Panel does)
// turns about its vertical axis at the steady rate Omega; a mark painted on it (a radius, with a small head) shows
// how far it has turned. Four free balls are let go at rest in the table's frame: a pair on the table, at the
// distance d on either side of the axis (separated across the axis), and a pair on the axis itself, above the table
// (separated along it). From outside (left), each ball of the first pair moves on a straight line at the speed
// Omega d it had when let go, while the table turns under it by Omega t = TURN; the pair on the axis stays put. From
// inside (right), the same motion seen in the table's axes: the first pair drifts apart across the axis on curves
// that bend back against the turning, and the pair on the axis stays put. Orange arrows: the pair's first
// acceleration as the turning observer measures it, Omega^2 xi_perp, outward (the pseudo-tide's stretch); the pair
// along the axis has none. Omega's letter is in the observer's colour of the chapter's equations, since it is the
// turning of the frame. Exact: the outside paths are the straight lines x(t) = x0 + Omega t (e_up x x0), at the
// release velocity Omega x x0 (asserted straight, at that speed); the inside paths are those lines turned by
// -Omega t, point by point, sampled every hundredth of a radian; the orange arrows lie along the line of the pair,
// through the axis, and are equal and opposite; the mark at the end is turned by TURN from its place at the start,
// and neither its sweep nor its place inside crosses a path. Schematic: the table's size against d, TURN, and the
// scale of the orange arrows.
import { v3, Panel, INK, DIM, FAINT, ACCENT } from '../lib.js';
import { Sheet, ORIGIN, finish, checker, near, placed, HAIR, AXIS, AXIS_HEAD, VEC, VEC_HEAD, DASH, n2 } from './tut-vec-lib.js';
import { TINT, cameraAxes } from './tut-gauss-lib.js';

export const D = 0.48;                     // each ball of the first pair is this far from the axis, units
export const TURN = 1.5;                   // Omega t at the end, radians
const TABLE = 1;                           // the table's radius
const UP = [0.5, 0.86];                    // the pair on the axis: heights above the table
const AXIS_TOP = 1.16;                     // Omega's arrow ends here
const STRETCH = 0.5;                       // the orange arrows' length per unit of Omega^2 xi_perp / Omega^2 = d
const BEAD = 3.1;                          // a ball's radius, points
const MARK = 0.6;                          // the painted mark's length, units
const MARK_AT = (255 * Math.PI) / 180;     // its direction at the start, turned from the first pair's line: the
                                           // sector it sweeps, to MARK_AT + TURN, is clear of every path
const ARC = 0.36, ARC_HEAD = 3.2, ARC_GAP = 2.2;         // the arc of the turn: its radius, units, and its head, points
const TILT = 36, TURN_VIEW = -28;          // the view, degrees
const S = 66;                              // points per unit
const SEP = 2.42;                          // between the two tables' centres, units across the page
const STEEL = '#868b92';
const OBS = 'light-dark(#9b2d7f, #e26c8c)';   // the observer's colour of the chapter's equations (app.css, --q-obs)
const name = 'tut-motion-frame';
const check = checker(name);

/** A point turned about the vertical (y) axis by the angle a: +a turns x toward -z, as Omega along +y does. */
const turnY = (p, a) => v3(p.x * Math.cos(a) + p.z * Math.sin(a), p.y, -p.x * Math.sin(a) + p.z * Math.cos(a));

/** The first pair's motion, from outside: the ball let go at x0 (on the table, at rest in its frame) at Omega t = tau. */
export const outside = (x0, tau) => x0.clone().add(v3(0, 1, 0).cross(x0).multiplyScalar(tau));
/** The same, in the table's axes: the outside position turned back by -Omega t. */
export const inside = (x0, tau) => turnY(outside(x0, tau), -tau);

export default async function () {
	const P = new Panel({ x: ORIGIN, y: ORIGIN, w: 0, h: 0, scale: S, tilt: TILT, turn: TURN_VIEW });
	const ink = new Sheet(P, name);
	const [right, , toward] = cameraAxes(P);
	const up = v3(0, 1, 0);
	const L = [];

	// the first pair, let go on the table at +-d along the table's first axis; the second, on the axis
	const across = [v3(D, 0, 0), v3(-D, 0, 0)];
	const along = UP.map((h) => v3(0, h, 0));
	// the release velocity is Omega x x, and the outside path is straight
	for (const x0 of across) {
		const a = outside(x0, 0), b = outside(x0, TURN / 2), c = outside(x0, TURN);
		check(near(b.clone().sub(a).cross(c.clone().sub(a)).length(), 0, 1e-12), 'an outside path is not straight');
		check(near(b.clone().sub(a).length(), (D * TURN) / 2, 1e-12), 'an outside path is not at the speed Omega d');
		check(near(inside(x0, TURN).length(), outside(x0, TURN).length(), 1e-12), 'turning back changed a distance from the axis');
		check(outside(x0, TURN).length() < TABLE - 0.1, 'a ball leaves the table');
	}
	// the mark's sweep, outside, from MARK_AT to MARK_AT + TURN, misses the outside paths (angles 0 to atan TURN, and
	// pi to pi + atan TURN, in the sense of the turning), and its place inside misses the inside paths (atan t - t)
	check(MARK_AT > Math.PI + Math.atan(TURN) + 0.2 && MARK_AT + TURN < 2 * Math.PI - 0.2, 'the mark sweeps across a path');
	check(MARK_AT < 2 * Math.PI + Math.atan(TURN) - TURN - 0.2, 'the mark lies on a path inside');
	// the pair on the axis: no velocity, no centrifugal acceleration
	for (const x0 of along) check(up.clone().cross(x0).length() === 0, 'a ball on the axis moves');

	for (const [k, view] of [[0, 'outside'], [1, 'inside']]) {
		const C = right.clone().multiplyScalar((k - 0.5) * SEP);          // the table's centre: across the page only
		const W = (p) => p.clone().add(C);
		const turned = view === 'outside' ? TURN : 0;                      // the table's turn at the end, as drawn

		// ---- the table: a disc, filled with the tint, its edge in ink
		const rim = Array.from({ length: 721 }, (_, i) => W(v3(TABLE * Math.cos((i * Math.PI) / 360), 0, TABLE * Math.sin((i * Math.PI) / 360))));
		ink.P.polygon(rim, { fill: TINT, layer: -6 });
		ink.curve(rim, { color: INK, width: 0.55, layer: 0, what: `the table's edge ${k}` });

		// ---- the painted mark: a radius along the table's second axis (-z at the start), at the end; outside, also at
		// the start, dashed, with the arc of the turn between them
		const markDir = turnY(v3(1, 0, 0), MARK_AT);
		const markAt = (a) => turnY(markDir, a).multiplyScalar(MARK);
		ink.arrow(W(v3(0, 0, 0)), W(markAt(turned)), { color: DIM, width: AXIS, head: AXIS_HEAD, layer: 1, what: `the mark ${k}` });
		if (view === 'outside') {
			check(near(markAt(TURN).angleTo(markAt(0)), TURN, 1e-12), 'the mark has not turned by Omega t');
			ink.line(W(v3(0, 0, 0)), W(markAt(0)), { color: DIM, width: HAIR, dash: DASH, layer: 1, what: 'the mark at the start' });
			// the arc of the turn, at the radius ARC, ending in a head laid along the arc's tangent at its end, as drawn
			// it stops ARC_GAP points (as seen face on) short of each mark
			const g = ARC_GAP / (ARC * S);
			const n = 600, arc = Array.from({ length: n + 1 }, (_, i) => ink.at(W(turnY(markDir, g + ((TURN - 2 * g) * i) / n).multiplyScalar(ARC))));
			const tip = arc[n];
			let cut = n;
			while (Math.hypot(arc[cut][0] - tip[0], arc[cut][1] - tip[1]) < 0.8 * ARC_HEAD) cut--;
			const back = arc.slice(0, n).reverse().find((q) => Math.hypot(q[0] - tip[0], q[1] - tip[1]) >= ARC_HEAD);
			const u = [(tip[0] - back[0]) / ARC_HEAD, (tip[1] - back[1]) / ARC_HEAD], w = [-u[1], u[0]], hw = 0.36 * ARC_HEAD;
			const base = [tip[0] - u[0] * ARC_HEAD, tip[1] - u[1] * ARC_HEAD];
			const path = arc.slice(0, cut + 1);
			let len = 0;
			for (let i = 1; i < arc.length; i++) len += Math.hypot(arc[i][0] - arc[i - 1][0], arc[i][1] - arc[i - 1][1]);
			ink.P.items.push({ kind: 'raw', layer: 1, depth: 0, svg:
				`<path d="M${path.map(([x, y]) => `${n2(x)},${n2(y)}`).join('L')}" fill="none" stroke="${DIM}" stroke-width="${HAIR}" stroke-linejoin="round"/>` +
				`<path d="M${n2(tip[0])},${n2(tip[1])}L${n2(base[0] + w[0] * hw)},${n2(base[1] + w[1] * hw)}L${n2(base[0] - w[0] * hw)},${n2(base[1] - w[1] * hw)}Z" fill="${DIM}"/>` });
			ink.mark(path, HAIR / 2, 'the turn');
			ink.mark([tip, [base[0] + w[0] * hw, base[1] + w[1] * hw], [base[0] - w[0] * hw, base[1] - w[1] * hw], tip], 0, 'the turn\'s head');
			ink.arrows.push({ L: len, head: ARC_HEAD, what: 'the turn' });
		}

		// ---- the axis and Omega, from the table's centre up, the pair on the axis threaded on it
		const omega = ink.arrow(W(v3(0, 0, 0)), W(v3(0, AXIS_TOP, 0)), { color: INK, width: AXIS, head: AXIS_HEAD + 0.6, layer: 2, what: `Omega ${k}` });
		for (const x0 of along) {
			ink.P.sphere(W(x0), BEAD / S, STEEL, { spec: 0.6, shininess: 36, layer: 5 });
			ink.mark([ink.at(W(x0))], BEAD, 'a ball on the axis');
		}
		L.push(await ink.label('\\boldsymbol\\Omega', [omega.B[0], omega.B[1] + 3], [1, 0], 2.4, OBS));

		// ---- the first pair: the paths, the balls at the end, rings where they started
		const path = view === 'outside' ? outside : inside;
		for (const [j, x0] of across.entries()) {
			const n = Math.ceil(TURN / 0.01);
			// the path, from where it leaves the ring of the start (HAIRSPACE clear of it) to the ball at the end
			const s0 = ink.at(W(x0));
			const pts = Array.from({ length: n + 1 }, (_, i) => W(path(x0, (TURN * i) / n)))
				.filter((p) => { const q = ink.at(p); return Math.hypot(q[0] - s0[0], q[1] - s0[1]) >= BEAD + 0.8; });
			check(pts.length > n / 2, `path ${j} is lost in its ring`);
			ink.curve(pts, { color: DIM, width: HAIR, layer: 1, what: `path ${j} ${view}` });
			const s = ink.at(W(x0));
			ink.P.items.push({ kind: 'raw', layer: 3, depth: 0, svg: `<circle cx="${n2(s[0])}" cy="${n2(s[1])}" r="${BEAD - HAIR / 2}" fill="none" stroke="${DIM}" stroke-width="${HAIR}"/>` });
			ink.mark([s], BEAD, `the start of ball ${j}`);
			ink.P.sphere(W(path(x0, TURN)), BEAD / S, STEEL, { spec: 0.6, shininess: 36, layer: 5 });
			ink.mark([ink.at(W(path(x0, TURN)))], BEAD, `ball ${j} at the end`);
		}
		// inside, the first acceleration of the pair: Omega^2 xi_perp, outward, from each ring's edge
		if (view === 'inside') {
			const drawn = across.map((x0, j) => {
				const a = x0.clone().sub(up.clone().multiplyScalar(x0.dot(up)));   // Omega^2 x_perp / Omega^2
				const u = a.clone().normalize();
				const p0 = W(x0), A0 = ink.at(p0), A1 = ink.at(p0.clone().add(u));
				const pu = [(A1[0] - A0[0]), (A1[1] - A0[1])], pl = Math.hypot(...pu);
				const from = p0.clone().addScaledVector(u, (BEAD + 0.9) / (pl * 1));
				return ink.arrow(from, from.clone().addScaledVector(a, STRETCH), { color: ACCENT, width: VEC, head: VEC_HEAD, layer: 4, what: `the drift of ball ${j}` });
			});
			check(near(drawn[0].L, drawn[1].L, 1e-9) && near(drawn[0].u[0], -drawn[1].u[0], 1e-12) && near(drawn[0].u[1], -drawn[1].u[1], 1e-12), 'the orange arrows are not equal and opposite');
		}

		// ---- the view's name, above the table
		const top = Math.min(...rim.map((p) => ink.at(p)[1]), omega.B[1]);
		const mid = ink.at(C);
		L.push(await placed(`\\text{from ${view}}`, mid[0], top - 8, 0.5, 1, INK));
	}
	void toward; void FAINT;

	ink.checkAll(L);
	return finish(name, P, L, [240, 340]);
}
