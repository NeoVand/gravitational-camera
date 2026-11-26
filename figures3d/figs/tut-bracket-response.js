// The tutorial, section 13.6 (tutorial/what-a-field-keeps/algebra-of-moments.md), its first diagram: looking gives
// values, pushing gives brackets. Two panels side by side, in one oblique projection (x to the right, y into the page
// at 30 degrees and drawn at half its length, z up), one unit of angular momentum SCALE points long. Left, "watched":
// a camera in the observer's colour before a wall (a vertical grey band), its two sight lines dotted to the wall, a
// readout box under it, "both tops: L_x = 1, L_y = 2" and "L_z = ?" in grey, and a small triad of the axes; behind the
// wall the two tops, one above the other, each a steel top on its point, lit by the studio of lib.js, its axis along
// its arrow L, which runs from the point, out through the top's stem, to (1, 2, 0.5) and (1, 2, -3) J s, each named
// beside its tip; dotted, the arrow's shadow on the level plane through the point, (L_x, L_y, 0), the same for both,
// and the drop from the tip to it, L_z. Right, "turned by eps about x": the same two tops after the turn by eps =
// 0.1 rad about the x axis through the point (a short axis and a curved arrow round it at each point), each arrow in
// its old place pale and its new place solid, the top drawn in its new place; on the level plane, from the old
// shadow's end, the change of L_y per radian, a short arrow along y: -L_z, that is -0.5 for the first top and +3 for
// the second, named beside, off the geometry.
// Departures from the diagram's comment: the two short arrows are ink, not orange and blue, which the tutorial keeps
// for a stretch and a squeeze; they are told apart by their directions and their direct labels. They show delta L_y /
// eps, the first-order change per radian, -L_z, to the scale of L, because the change at the drawn 0.1 rad, -0.060
// J s for the first top, would be a point long; the caption says so. The two tops share one camera and one readout,
// "both tops", rather than a readout each. The shadows and drops (dotted) are added, so that the reader sees that
// L_x and L_y are the same for both tops and only L_z differs.
// Exact: every arrow L and its shadow and drop, the turn (the exact rotation by 0.1 rad about x, asserted rigid and
// against its first order in tut-algebra-lib.js), the arrows on the level plane (-L_z in J s per radian, the bracket
// {L_y, L_x}), the axis of each top along its L; what each top's body hides of the lines behind it (each sample of a
// line tested against the body's faces). Schematic: the tops' bodies (shape and size), the camera, the wall, the
// readout, the triad and the places of the four tops on the page.
import { Panel, v3, THREE, INK, DIM, FAINT, RULE, PAGE } from '../lib.js';
import { Sheet, ORIGIN, finish, checker, near, placed, VEC, VEC_HEAD, AXIS, HAIR, DOT, DOT_STEP, LABEL_GAP, n2 } from './tut-vec-lib.js';
import { STEEL } from '../stone.js';
import { chapter, OBS, TOPS, EPS_DRAWN, turn } from './tut-algebra-lib.js';

const name = 'tut-bracket-response';
const check = checker(name);

// ---- the drawing -------------------------------------------------------------------------------------------------
const K = 0.5, ANG = (30 * Math.PI) / 180; // the oblique projection: y drawn at half its length, 30 degrees up
const SCALE = 30;                          // points per J s
const ROW = 2.35;                          // from the first top's point down to the second's, J s on the page
const DX = 3.6;                            // from the left panel's points to the right panel's
const SHIFT = 70;                          // the left panel's points, left of the provisional page's centre (points)
const BODY = [[0, 0], [0.34, 0.2], [0.44, 0.255], [0.5, 0.262], [0.55, 0.24], [0.6, 0.17], [0.625, 0.1], [0.635, 0.05], [0.635, 0.042], [0.84, 0.042], [0.85, 0.03], [0.855, 0]];   // the top: [along the axis, radius], J s on the page
const SHINE = { ambient: 0.34, key: 0.78, fill: 0.16, wrap: 0.3, spec: 0.42, shininess: 26, steps: 140 };
const PALE = 0.45;                         // the old arrows' opacity
const SHADOW = 0.5;                        // the dotted shadows and drops: their stroke's opacity (FAINT)
const GLYPH = { at: -0.5, r: 0.26, from: -110, to: 195, head: 34, reach: [-0.8, -0.12] };   // the turn's axis and curved arrow
const CAM = { w: 15, h: 10, round: 2, bump: [5, 2.3, 0.8], barrel: [2.6, 6.2], hood: [2.2, 8], gap: 26, lift: 16, below: 8, triad: 30 };   // the
// camera: its body (width, height, corner), the viewfinder (width, height, corner), the lens barrel and its hood (width,
// height), from the hood to the wall, how far above the middle of the two points, and the readout and triad below it
const WALL = { w: 7, gap: 22 };
const TRIAD_HEAD = 3;                      // the triad's heads            // the wall's width, and from it to the nearest point of a top
const caption = 'Look first at the two short arrows on the right: the same turn moves the two tops\' $L_y$ in opposite directions, by $-L_z$ times the angle, although the camera on the left reads the same two numbers for both. The turn is drawn as 0.1 rad, ten times larger than the text\'s 0.01 rad, and the turned arrows are exact; the short arrows are the change of $L_y$ per radian, to the scale of $\\vect L$.';

/** An arrow between two figure points as SVG: lib.js's Panel's shaft and head (a head hd long, 0.72 hd wide). */
function arrowSvg(A, B, color, width, hd) {
	const Lp = Math.hypot(B[0] - A[0], B[1] - A[1]), u = [(B[0] - A[0]) / Lp, (B[1] - A[1]) / Lp], w = [-u[1], u[0]];
	const base = [B[0] - u[0] * hd, B[1] - u[1] * hd], s1 = [B[0] - u[0] * hd * 0.8, B[1] - u[1] * hd * 0.8], hw = 0.36 * hd;
	return `<path d="M${n2(A[0])},${n2(A[1])}L${n2(s1[0])},${n2(s1[1])}" stroke="${color}" stroke-width="${width}" fill="none"/>` +
		`<path d="M${n2(B[0])},${n2(B[1])}L${n2(base[0] + w[0] * hw)},${n2(base[1] + w[1] * hw)}L${n2(base[0] - w[0] * hw)},${n2(base[1] - w[1] * hw)}Z" fill="${color}"/>`;
}

/** The oblique view: world point to [screen x, screen y up, depth toward the viewer]. */
const D = new THREE.Vector3(-K * Math.cos(ANG), 1, -K * Math.sin(ANG));   // the direction of projection, into the page
const V = D.clone().normalize().negate();                                   // toward the viewer

export default async function () {
	const { state } = await chapter(check);
	state(name, 'bracket-response', caption);
	const P = new Panel({ x: ORIGIN - SHIFT, y: ORIGIN, w: 0, h: 0, scale: SCALE });
	P.cam = (p) => new THREE.Vector3(p.x + K * p.y * Math.cos(ANG), p.z + K * p.y * Math.sin(ANG), p.dot(V));
	// the frame in which the bodies are lit: right, up and toward the viewer, as near the oblique view as a turn can be
	{
		const right = v3(1, 0, 0).addScaledVector(V, -V.x).normalize(), up = V.clone().cross(right);
		P.rot = new THREE.Matrix4().set(right.x, right.y, right.z, 0, up.x, up.y, up.z, 0, V.x, V.y, V.z, 0, 0, 0, 0, 1);
		check(near(up.z, Math.max(up.x, up.y, up.z), 1e-12) && up.z > 0.9, 'the frame of the light is not upright');
	}
	// the projection: x and z keep their lengths on the page, y is drawn at half its length at 30 degrees
	check(near(P.cam(v3(0, 1, 0)).x, K * Math.cos(ANG)) && near(P.cam(v3(0, 1, 0)).y, K * Math.sin(ANG)) && near(P.cam(D).x, 0) && near(P.cam(D).y, 0), 'the projection');
	const S = new Sheet(P, name);
	const L = [];
	const lathe = new THREE.LatheGeometry(BODY.map(([s, r]) => new THREE.Vector2(r, s)), 72);

	/** A top: its point, its arrow L (exact) and its body along L; `turned` takes it by eps about the x axis through the point. */
	const top = (O, Lv, turned) => {
		const Lw = turned ? turn(Lv, EPS_DRAWN) : Lv;
		const u = v3(...Lw).normalize();
		const m = new THREE.Matrix4().compose(O, new THREE.Quaternion().setFromUnitVectors(v3(0, 1, 0), u), v3(1, 1, 1));
		const g = lathe.clone().applyMatrix4(m);
		const pos = g.attributes.position, idx = g.index;
		const tris = [];
		for (let i = 0; i < idx.count; i += 3) {
			const T = [0, 1, 2].map((k) => new THREE.Vector3().fromBufferAttribute(pos, idx.getX(i + k)));
			const C = T.map((p) => P.cam(p));
			if ((C[1].x - C[0].x) * (C[2].y - C[0].y) - (C[1].y - C[0].y) * (C[2].x - C[0].x) > 1e-12) tris.push(C);
		}
		return { O, L: Lw, u, m, tris };
	};
	/** Whether the world point p is hidden behind a front face of the body b. */
	const hidden = (b, p) => {
		const q = P.cam(p);
		for (const [a, c, e] of b.tris) {
			const det = (c.x - a.x) * (e.y - a.y) - (c.y - a.y) * (e.x - a.x);
			const l1 = ((q.x - a.x) * (e.y - a.y) - (q.y - a.y) * (e.x - a.x)) / det;
			const l2 = ((c.x - a.x) * (q.y - a.y) - (c.y - a.y) * (q.x - a.x)) / det;
			if (l1 < -1e-9 || l2 < -1e-9 || l1 + l2 > 1 + 1e-9) continue;
			if (a.z + l1 * (c.z - a.z) + l2 * (e.z - a.z) > q.z + 1e-9) return true;
		}
		return false;
	};
	/** The parameter along a -> b (world) from which the segment is no longer hidden by the body b, sampled finely. */
	const emerges = (body, a, b) => {
		let t = 0;
		for (let k = 0; k <= 2000; k++) if (hidden(body, a.clone().lerp(b, k / 2000))) t = k / 2000;
		return Math.min(1, t + 1 / 2000);
	};
	/** A dotted line between world points, leaving out the dots that a body hides. */
	const dotted = (a, b, bodies, what, opacity = SHADOW) => {
		const A = S.at(a), B = S.at(b), len = Math.hypot(B[0] - A[0], B[1] - A[1]);
		const n = Math.max(1, Math.round((len - DOT) / DOT_STEP));
		const pts = [];
		for (let i = 0; i <= n; i++) {
			const t = (DOT / 2 + (i * (len - DOT)) / n) / len, p = a.clone().lerp(b, t);
			if (!bodies.some((bd) => hidden(bd, p))) pts.push(S.at(p));
		}
		P.items.push({ kind: 'raw', layer: 0.5, depth: 0, svg: `<path d="${pts.map(([x, y]) => `M${n2(x)},${n2(y)}h0`).join('')}" stroke="${FAINT}" stroke-opacity="${opacity}" stroke-width="${DOT * 1.15}" stroke-linecap="round" fill="none"/>` });
		for (const q of pts) S.mark([q], DOT / 2, what);
	};
	/** The body of a top, drawn as lit steel, and its outline remembered as a mark. */
	const draw = (b, what) => {
		P.mesh(lathe, STEEL, { matrix: b.m, o: SHINE, layer: 1 });
		const pts = b.tris.flat().map((c) => [P.x + c.x * SCALE, P.y - c.y * SCALE]);
		// the outline: the convex hull of the body's points on the page
		const hull = (() => {
			const s = [...pts].sort((p, q) => p[0] - q[0] || p[1] - q[1]);
			const cr = (o, a, c) => (a[0] - o[0]) * (c[1] - o[1]) - (a[1] - o[1]) * (c[0] - o[0]);
			const lo = [], hi = [];
			for (const p of s) { while (lo.length > 1 && cr(lo.at(-2), lo.at(-1), p) <= 0) lo.pop(); lo.push(p); }
			for (const p of s.reverse()) { while (hi.length > 1 && cr(hi.at(-2), hi.at(-1), p) <= 0) hi.pop(); hi.push(p); }
			return [...lo.slice(0, -1), ...hi.slice(0, -1)];
		})();
		S.mark([...hull, hull[0]], 0, what);
		// the point it stands on
		const [x, y] = S.at(b.O);
		P.items.push({ kind: 'raw', layer: 3, depth: 0, svg: `<circle cx="${n2(x)}" cy="${n2(y)}" r="0.95" fill="${INK}"/>` });
	};
	/** The arrow L of the body b from where it leaves the body to its tip; pale for the old place. */
	const arrowL = (b, Lv, what, pale = false) => {
		const tip = b.O.clone().add(v3(...Lv));
		const t = emerges(b, b.O, tip);
		check(t > 0.15 && t < 0.6, `${what} leaves its top at ${t}`);
		const start = b.O.clone().lerp(tip, t);
		if (pale) {
			// lib.js's Panel draws an arrow in one colour; the old place is drawn here as a group at the pale opacity
			const A = S.at(start), B = S.at(tip), Lp = Math.hypot(B[0] - A[0], B[1] - A[1]), hd = Math.min(VEC_HEAD, 0.4 * Lp);
			P.items.push({ kind: 'raw', layer: 2, depth: 0, svg: `<g opacity="${PALE}">${arrowSvg(A, B, INK, VEC, hd)}</g>` });
			S.mark([A, B], VEC / 2, what);
		} else {
			S.arrow(start, tip, { color: INK, width: VEC, layer: 2.5, what });
		}
		return tip;
	};

	// ---- the four tops
	const pivots = [[v3(0, 0, 0), v3(0, 0, -ROW)], [v3(DX, 0, 0), v3(DX, 0, -ROW)]];
	const bodies = [[0, 1].map((k) => top(pivots[0][k], TOPS[k], false)), [0, 1].map((k) => top(pivots[1][k], TOPS[k], true))];
	for (const k of [0, 1]) {
		const b = bodies[1][k];
		check(near(b.L[0], TOPS[k][0], 1e-15) && near(Math.hypot(...b.L), Math.hypot(...TOPS[k]), 1e-12), 'the turned arrow');
		check(near(b.u.dot(v3(...b.L).normalize()), 1, 1e-12), 'a turned top\'s axis is not along its turned arrow');
	}
	bodies.flat().forEach((b, i) => draw(b, `the top ${i}`));

	// left: the arrows, their shadows on the level plane through the point, and the drops to them
	const tipsA = [];
	for (const k of [0, 1]) {
		const b = bodies[0][k], O = b.O, Lv = TOPS[k];
		const foot = O.clone().add(v3(Lv[0], Lv[1], 0)), tip = O.clone().add(v3(...Lv));
		dotted(O, foot, [b], `the shadow ${k}`);
		dotted(foot, tip, [b], `the drop ${k}`);
		tipsA.push(arrowL(b, Lv, `L ${k}`));
	}
	// right: the turn's axis and curved arrow at each point, the old arrows pale, the new solid, the change of L_y
	const changes = [];
	for (const k of [0, 1]) {
		const b = bodies[1][k], O = b.O, Lv = TOPS[k];
		arrowL(b, Lv, `the old L ${k}`, true);
		arrowL(b, b.L, `the new L ${k}`);
		const foot = O.clone().add(v3(Lv[0], Lv[1], 0));
		dotted(O, foot, [b], `the old shadow ${k}`, SHADOW * 0.8);
		// the change of L_y per radian, -L_z, from the old shadow's end, along y
		const rate = -Lv[2];
		const e = 1e-7, exact = (turn(Lv, e)[1] - turn(Lv, -e)[1]) / (2 * e);
		check(near(exact, rate, 1e-6), `the rate of L_y for top ${k}`);
		const end = foot.clone().add(v3(0, rate, 0));
		changes.push(S.arrow(foot, end, { color: INK, width: VEC, layer: 2.6, what: `the change ${k}` }));
		// the turn: a short stretch of the x axis left of the point, and a curved arrow about it in the sense of a
		// positive turn (y toward z)
		const ax0 = O.clone().add(v3(GLYPH.reach[0], 0, 0)), ax1 = O.clone().add(v3(GLYPH.reach[1], 0, 0));
		S.line(ax0, ax1, { color: DIM, width: HAIR, layer: 2, what: `the axis of the turn ${k}` });
		const C = O.clone().add(v3(GLYPH.at, 0, 0)), arc = [];
		for (let a = GLYPH.from; a <= GLYPH.to + 1e-9; a += 1) arc.push(C.clone().add(v3(0, GLYPH.r * Math.cos((a * Math.PI) / 180), GLYPH.r * Math.sin((a * Math.PI) / 180))));
		// the arc stops where the head begins; the head is drawn along the chord of its last GLYPH.head degrees
		const neck = arc.length - 1 - GLYPH.head;
		S.curve(arc.slice(0, neck + 1), { color: DIM, width: HAIR + 0.05, layer: 2, what: `the turn's arc ${k}` });
		S.arrow(arc[neck], arc.at(-1), { color: DIM, width: HAIR + 0.05, head: 3, layer: 2, what: `the turn's head ${k}` });
	}
	// the arrows on the level plane: -0.5 and +3 J s per radian, opposite in sign, the second six times the first
	check(changes[0].u[0] < 0 && changes[1].u[0] > 0 && near(changes[1].L / changes[0].L, 6, 1e-9), 'the changes of L_y');

	// ---- the wall, the camera, its readout and the triad
	const xs = bodies[0].flatMap((b) => b.tris.flat().map((c) => P.x + c.x * SCALE)).concat(S.marks.filter((m) => m.what.startsWith('the shadow') || m.what.startsWith('L ')).flatMap((m) => m.pts.map((p) => p[0])));
	const leftmost = Math.min(...xs);
	const top0 = Math.min(...S.marks.flatMap((m) => m.pts.map((p) => p[1]))) - 4, bottom0 = Math.max(...S.marks.flatMap((m) => m.pts.map((p) => p[1]))) + 4;
	const wallR = leftmost - WALL.gap, wallL = wallR - WALL.w;
	P.items.push({ kind: 'raw', layer: 0.2, depth: 0, svg: `<rect x="${n2(wallL)}" y="${n2(top0)}" width="${WALL.w}" height="${n2(bottom0 - top0)}" fill="${RULE}"/>` });
	S.mark([[wallL, top0], [wallR, top0], [wallR, bottom0], [wallL, bottom0], [wallL, top0]], 0, 'the wall');
	const pA = S.at(pivots[0][0]), pB = S.at(pivots[0][1]);
	{
		// the camera, seen from the side and looking right: a rounded body, a viewfinder on top and a lens barrel in
		// two steps toward the wall, in the observer's colour
		const front = wallL - CAM.gap, y = (pA[1] + pB[1]) / 2 - CAM.lift;
		const [bw, bh] = CAM.barrel, [hw, hh] = CAM.hood;
		const box = { l: front - hw - bw - CAM.w, r: front - hw - bw, t: y - CAM.h / 2, b: y + CAM.h / 2 };
		const vf = { l: box.l + 2, t: box.t - CAM.bump[1] };
		P.items.push({ kind: 'raw', layer: 3, depth: 0, svg:
			`<rect x="${n2(box.l)}" y="${n2(box.t)}" width="${CAM.w}" height="${CAM.h}" rx="${CAM.round}" fill="${OBS}"/>` +
			`<rect x="${n2(vf.l)}" y="${n2(vf.t)}" width="${CAM.bump[0]}" height="${n2(CAM.bump[1] + CAM.round + 0.5)}" rx="${CAM.bump[2]}" fill="${OBS}"/>` +
			`<rect x="${n2(box.r - 0.5)}" y="${n2(y - bh / 2)}" width="${n2(bw + 0.5)}" height="${bh}" fill="${OBS}"/>` +
			`<rect x="${n2(front - hw)}" y="${n2(y - hh / 2)}" width="${hw}" height="${hh}" rx="0.6" fill="${OBS}"/>` });
		S.mark([[box.l, vf.t], [front, vf.t], [front, box.b], [box.l, box.b], [box.l, vf.t]], 0, 'the camera');
		// the sight lines, dotted, from the lens to the wall at the height of each top's point
		const sight = [pA, pB].map((q) => [[front + 2, y], [wallL - 1.6, q[1]]]);
		for (const [k, [a0, c]] of sight.entries()) {
			const len = Math.hypot(c[0] - a0[0], c[1] - a0[1]), n = Math.round(len / DOT_STEP);
			const pts = Array.from({ length: n + 1 }, (_, i) => [a0[0] + ((c[0] - a0[0]) * i) / n, a0[1] + ((c[1] - a0[1]) * i) / n]);
			P.items.push({ kind: 'raw', layer: 0.6, depth: 0, svg: `<path d="${pts.map(([x, yy]) => `M${n2(x)},${n2(yy)}h0`).join('')}" stroke="${FAINT}" stroke-width="${DOT}" stroke-linecap="round" fill="none"/>` });
			S.mark([a0, c], DOT / 2, `the sight line ${k}`);
		}
		// the readout, under the camera, its right edge clear of the lower sight line
		const spec = [['\\text{both tops:}', DIM, 7], ['L_x = 1,\\ L_y = 2', INK, 8.5], ['L_z = {?}', FAINT, 8.5]];
		const probe = await Promise.all(spec.map(([src, color, size]) => placed(src, 0, 0, 0, 0, color, size)));
		const pad = 3.4, lead = 2.6, wBox = Math.max(...probe.map((l) => l.box.r - l.box.l)) + 2 * pad;
		const hBox = probe.reduce((t, l) => t + l.box.b - l.box.t, 0) + 2 * lead + 2 * pad;
		const by = box.b + CAM.below, bx = front - 3 - wBox;
		P.items.push({ kind: 'raw', layer: 3, depth: 0, svg: `<rect x="${n2(bx)}" y="${n2(by)}" width="${n2(wBox)}" height="${n2(hBox)}" rx="1.6" fill="none" stroke="${DIM}" stroke-width="${HAIR}"/>` });
		const boxPts = [[bx, by], [bx + wBox, by], [bx + wBox, by + hBox], [bx, by + hBox], [bx, by]];
		S.mark(boxPts, HAIR / 2, 'the readout');
		{
			// the lower sight line passes the box's right edge with air
			const [[x0, y0], [x1, y1]] = sight[1], xAt = (yy) => x0 + ((x1 - x0) * (yy - y0)) / (y1 - y0);
			check(Math.min(xAt(by), xAt(by + hBox)) - (bx + wBox) > LABEL_GAP, 'the readout meets the lower sight line');
		}
		let yy = by + pad;
		const inside = [];
		for (const [i, [src, color, size]] of spec.entries()) {
			inside.push(await placed(src, bx + pad, yy, 0, 0, color, size));
			yy += probe[i].box.b - probe[i].box.t + lead;
		}
		check(inside.every((q) => q.box.l >= bx + pad - 1e-6 && q.box.r <= bx + wBox - pad + 1e-6 && q.box.b <= by + hBox - pad + 1e-6), 'the readout overflows its box');
		// the readout's lines sit inside its box, so they are kept out of the label checks against it
		P.items.push({ kind: 'raw', layer: 4, depth: 0, svg: inside.map((q) => q.svg).join('') });
		// the triad: x, y and z from one point, under the readout
		const T0 = [bx + 4, by + hBox + CAM.triad];
		const tri = [['x', [1, 0, 0], 0.55], ['y', [0, 1, 0], 0.9], ['z', [0, 0, 1], 0.55]];
		for (const [lab, d, len] of tri) {
			const q = P.cam(v3(...d).multiplyScalar(len));
			const end = [T0[0] + q.x * SCALE, T0[1] - q.y * SCALE];
			const l = Math.hypot(end[0] - T0[0], end[1] - T0[1]), uu = [(end[0] - T0[0]) / l, (end[1] - T0[1]) / l];
			P.items.push({ kind: 'raw', layer: 3, depth: 0, svg: arrowSvg(T0, end, DIM, AXIS, TRIAD_HEAD) });
			S.mark([T0, end], AXIS / 2, `the triad's ${lab}`);
			L.push(await S.label(lab, end, uu, LABEL_GAP, DIM, 7.5));
		}
	}

	// ---- labels
	const tex3 = (Lv) => `\\mathbf L = (${Lv.map((v) => (v < 0 ? `-${-v}` : String(v))).join(',\\,')})\\ \\mathrm{J\\,s}`;
	L.push(await S.label(tex3(TOPS[0]), S.at(tipsA[0]), [0.2, -1], LABEL_GAP, INK, 8));
	L.push(await S.label(tex3(TOPS[1]), S.at(tipsA[1]), [0.15, 1], LABEL_GAP, INK, 8));
	L.push(await S.label('\\delta L_y = -0.5\\,\\epsilon', changes[0].B, [0.35, 1], LABEL_GAP + 0.6, INK, 8));
	L.push(await S.label('\\delta L_y = +3\\,\\epsilon', [(changes[1].A[0] + changes[1].B[0]) / 2 + 4, (changes[1].A[1] + changes[1].B[1]) / 2], [0.5, 0.866], LABEL_GAP + 0.6, INK, 8));
	// the headings, over each panel
	const head = Math.min(...S.marks.flatMap((m) => m.pts.map((p) => p[1]))) - 8;
	// over the left panel, from the readout's left edge to its tops' labels; over the right, its points to its labels
	const left0 = Math.min(...S.marks.filter((m) => m.what === 'the readout').flatMap((m) => m.pts.map((p) => p[0])));
	const right0 = Math.max(L[L.length - 4].box.r, L[L.length - 3].box.r);
	const right1 = Math.max(...L.slice(-2).map((l) => l.box.r));
	L.push(await placed('\\text{watched}', (left0 + right0) / 2, head, 0.5, 1, DIM, 8));
	L.push(await placed('\\text{turned by }\\epsilon\\text{ about }x', (S.at(pivots[1][0])[0] - 24 + right1) / 2, head, 0.5, 1, DIM, 8));

	S.checkAll(L);
	window[name + '-numbers'] = { turned: bodies[1].map((b) => b.L), changes: TOPS.map((Lv) => turn(Lv, EPS_DRAWN)[1] - Lv[1]) };
	return finish(name, P, L, [290, 380]);
}
