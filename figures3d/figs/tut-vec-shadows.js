// The tutorial, section 1.1 (tutorial/newton/vectors-and-indices.md), its first diagram: a vector's components are
// its shadows on three axes. Two panels in one orthographic view (lib.js's Panel, turned, then tilted): the axes
// east, north and up, right-handed (east x north = up), seen from above the south-east, so that east comes toward
// the reader, north runs to the right and away, and up stands upright. (Seen from the other side, from above the
// north-east, the arrow's tip would be the box's nearest corner and the origin its farthest; a box drawn in thin
// lines then reads as easily turned inside out as right. From the south-east the origin and the tip are corners of
// the box's outline, and the arrow runs across the box.)
// (a) One arrow a with three positive components, the diagonal of a box whose thin, light edges run along the axes
//     from the origin to the tip; the three edges hidden behind the box are dashed. On each axis the shadow a_i e_i
//     is an orange arrow from the origin to a corner of the box. From the tip a dotted line, the light that casts
//     that shadow, runs across the face of the box at right angles to the axis and meets the axis at the shadow's
//     end; a right-angle mark there lies in the plane of the origin, the foot and the tip.
// (b) The same construction for a level arrow b that points north and west: its box is a rectangle on the ground
//     (tinted), its shadow on the east axis points west and its up component is zero.
// Exact: the box (its corners are the sums of the shadows and its edges are parallel to the axes, asserted; the
// edges dashed are those that meet the corner farthest from the reader); each dotted line is a diagonal of the box's
// face through the tip at right angles to its axis (an edge of the rectangle in (b)), and at right angles to that
// axis (asserted); each shadow is the dot product with e_i (asserted); the shadows add up to the arrow (asserted);
// the right-angle marks are squares in the drawing's 3D, seen in the same projection; the signs of the components
// (asserted). Schematic: the particular arrows, a = (0.9, 1.2, 1.1) and b = (-0.75, 0.9, 0) in units of the drawing.
import { Panel, v3, letter, ACCENT, INK, DIM, RULE } from '../lib.js';
import { Sheet, finish, checker, near, boxOf, AXIS, AXIS_HEAD, VEC_HEAD, LABEL_GAP } from './tut-vec-lib.js';

export const A = [0.9, 1.2, 1.1];           // panel (a): the arrow's components, east, north, up
export const B = [-0.75, 0.9, 0];          // panel (b): a level arrow, its east component negative
export const TILT = 23, TURN = -70;        // the view, degrees (lib.js: turn about the vertical, then tilt)
const S = 96;                               // points per unit, both panels
const CANVAS = 720;                        // the provisional page, points
const OA = [200, 380], OB = [462, 380];    // where each panel's origin stands on the provisional page
const BEYOND = 0.42;                       // how far each axis runs on past the box, units
const VEC = 0.95;                          // the arrow's stroke
const SHADOW = 1.05;                       // a shadow's stroke
const EDGE = 0.5;                          // the box's edges
const HIDDEN = [1.5, 1.5];                 // the dashes of a hidden edge
const RIGHT = 6;                            // the side of a right-angle mark, points (face on)
const GROUND = '#eeebe5';                  // the ground's tint: the site's neutral tint of the page (drawing.ts THEME)
const name = 'tut-vec-shadows';
const check = checker(name);

// world coordinates are three.js's (y up): east is +x, north is -z, up is +y
const E = [v3(1, 0, 0), v3(0, 0, -1), v3(0, 1, 0)];
const WORDS = ['east', 'north', 'up'], OPPOSITE = ['west', 'south', 'down'];

// how far each axis runs the positive way: past the box, or, for an axis without a shadow, as far as the shortest one
const reach = (C, i) => C[i] === 0 ? Math.min(...C.filter((c) => c !== 0).map(Math.abs)) + BEYOND : Math.max(C[i], 0) + BEYOND;
const unit = (x, y) => { const l = Math.hypot(x, y); return [x / l, y / l]; };

/** One panel: the axes, the box, the shadows, the light and the arrow of components C, named `v`. */
async function draw(P, C, v, look) {
	const ink = new Sheet(P, name);
	const O = v3(0, 0, 0);
	const feet = C.map((c, i) => E[i].clone().multiplyScalar(c));
	const tip = feet.reduce((s, f) => s.clone().add(f), v3(0, 0, 0));
	const live = [0, 1, 2].filter((i) => C[i] !== 0);      // the axes with a shadow

	// the shadows are the dot products with the unit vectors, and add up to the arrow
	for (let i = 0; i < 3; i++) check(near(tip.dot(E[i]), C[i], 1e-12), `${v}: the shadow on axis ${i + 1} is not ${v} . e${i + 1}`);
	check(feet.reduce((s, f) => s.add(f), v3(0, 0, 0)).distanceTo(tip) < 1e-12, `${v}: the shadows do not add up to the arrow`);

	// ---- the axes: thin, with heads, each running on past the box; an axis along which a component is negative
	// runs on the other way too, without a head, and is named there
	for (let i = 0; i < 3; i++) {
		ink.arrow(O, E[i].clone().multiplyScalar(reach(C, i)), { color: DIM, width: AXIS, head: AXIS_HEAD, layer: 0, what: `the ${WORDS[i]} axis` });
		if (C[i] < 0) ink.line(O, E[i].clone().multiplyScalar(C[i] - BEYOND), { color: DIM, width: AXIS, layer: 0, what: `the ${OPPOSITE[i]} half of the ${WORDS[i]} axis` });
	}

	// ---- the box: its corners are the sums of the shadows, its edges run along the axes. The three edges from the
	// origin are the shadows, drawn below; those that meet the corner farthest from the reader are hidden, dashed.
	// A level arrow's box is a rectangle on the ground, tinted, whose two far edges are the light, drawn below.
	const corner = (m) => live.reduce((s, i) => (m >> i) & 1 ? s.add(feet[i]) : s, v3(0, 0, 0));
	const masks = [...Array(8).keys()].filter((m) => [0, 1, 2].every((i) => C[i] !== 0 || !((m >> i) & 1)));
	check(corner(masks.reduce((s, m) => s | m, 0)).distanceTo(tip) < 1e-12, `${v}: the far corner of the box is not the tip`);
	if (live.length === 3) {
		// the origin and the tip are corners of the box's outline: neither the nearest corner nor the farthest
		const far = masks.reduce((f, m) => P.cam(corner(m)).z < P.cam(corner(f)).z ? m : f, 0);
		const nearest = masks.reduce((f, m) => P.cam(corner(m)).z > P.cam(corner(f)).z ? m : f, 0);
		check(![0, 7].includes(far) && ![0, 7].includes(nearest), `${v}: the origin or the tip is the box's nearest or farthest corner`);
		for (const m of masks) for (const i of live) {
			if ((m >> i) & 1 || m === 0) continue;   // each edge once, from its corner without the step i; not from the origin
			const p = corner(m), q = corner(m | (1 << i));
			const d = q.clone().sub(p);
			check(d.clone().cross(E[i]).length() < 1e-12 && near(d.dot(E[i]), C[i], 1e-12), `${v}: a box edge is not along axis ${i + 1}`);
			const hidden = m === far || (m | (1 << i)) === far;
			ink.line(p, q, { color: RULE, width: EDGE, layer: 0, dash: hidden ? HIDDEN : null, what: `the box ${v}` });
		}
	} else check(live.length === 2 && C[2] === 0, `${v}: a flat box that is not level`);
	// the box's floor, on the ground, tinted
	P.polygon([O, feet[0], feet[0].clone().add(feet[1]), feet[1]], { fill: GROUND, layer: -1 });

	// ---- the shadows: orange arrows from the origin to the corners of the box on the axes
	for (const i of live) ink.arrow(O, feet[i], { color: ACCENT, width: SHADOW, head: VEC_HEAD, layer: 2, what: `the shadow ${v}${i + 1}` });

	// ---- the arrow, on top
	ink.arrow(O, tip, { color: INK, width: VEC, head: VEC_HEAD + 0.4, layer: 4, what: `the arrow ${v}` });
	ink.dot(O, { layer: 5 });

	// ---- the light: from the tip, across the face of the box at right angles to axis i, to the shadow's end
	for (const i of live) {
		const drop = tip.clone().sub(feet[i]);
		check(near(drop.dot(E[i]), 0, 1e-12), `${v}: the light onto axis ${i + 1} is not at right angles to it`);
		// the face through the tip at right angles to axis i has the corners feet[i] + s feet[j] + t feet[k]; the
		// light joins its opposite corners s = t = 0 (the foot) and s = t = 1 (the tip)
		const [j, k] = [0, 1, 2].filter((x) => x !== i);
		check(drop.distanceTo(feet[j].clone().add(feet[k])) < 1e-12, `${v}: the light onto axis ${i + 1} is not a diagonal of the face`);
		// (the light passes under the arrow, the other shadows and the other axes, with air on either side)
		const others = [0, 1, 2].filter((x) => x !== i);
		const avoid = [`the arrow ${v}`, ...others.map((x) => `the shadow ${v}${x + 1}`), ...others.map((x) => `the ${WORDS[x]} axis`)];
		ink.dots(tip, feet[i], { color: DIM, clear0: 1.4, clear1: 0.6, layer: 3, avoid, what: `the light onto axis ${i + 1}` });
		// the right-angle mark at the foot: between the light (toward the tip) and the axis on past the foot
		const out = E[i].clone().multiplyScalar(Math.sign(C[i]));
		ink.right(feet[i], drop.clone().normalize(), out, { color: DIM, side: RIGHT, layer: 3, what: `the right angle on axis ${i + 1}` });
	}

	// ---- labels: each shadow's beside its middle, the arrow's beside its own, the axes' words at their ends
	const sc = (p) => ink.at(p);
	const L = [];
	for (const i of live) L.push(await ink.label(`${v}_${i + 1}`, sc(feet[i].clone().multiplyScalar(look.at[i])), look.shadow[i], 2.2, ACCENT));
	L.push(await ink.label(`\\boldsymbol ${v}`, sc(tip.clone().multiplyScalar(look.arrowAt)), look.arrow, 2.4, INK));
	for (let i = 0; i < 3; i++) L.push(await ink.label(`\\text{${WORDS[i]}}`, sc(E[i].clone().multiplyScalar(reach(C, i))), look.end[i], 2.2, DIM));
	for (let i = 0; i < 3; i++) if (C[i] < 0) L.push(await ink.label(`\\text{${OPPOSITE[i]}}`, sc(E[i].clone().multiplyScalar(C[i] - BEYOND)), look.neg, 2.2, DIM));
	ink.checkAll(L);
	return { ink, L };
}

export default async function () {
	check(E[0].clone().cross(E[1]).distanceTo(E[2]) < 1e-12, 'the axes are not right-handed');
	check(A.every((x) => x > 0), 'panel (a): not every component positive');
	check(B[0] < 0 && B[1] > 0 && B[2] === 0, 'panel (b): not a level arrow with only its east component negative');

	const PA = new Panel({ x: OA[0], y: OA[1], w: 0, h: 0, scale: S, tilt: TILT, turn: TURN });
	const PB = new Panel({ x: OB[0], y: OB[1], w: 0, h: 0, scale: S, tilt: TILT, turn: TURN });
	const { ink: ia, L: La } = await draw(PA, A, 'a', {
		at: [0.5, 0.36, 0.5], shadow: [unit(-1, -0.3), unit(0.1, 1), unit(-1, 0)],
		arrowAt: 0.55, arrow: unit(-0.2, -1),
		end: [unit(-0.3, 1), unit(1, 0.2), unit(0, -1)]
	});
	const { ink: ib, L: Lb } = await draw(PB, B, 'b', {
		at: [0.5, 0.5, 0.5], shadow: [unit(-1, 0.3), unit(0.1, 1), unit(-1, 0)],
		arrowAt: 0.5, arrow: unit(0.55, 0.83),
		end: [unit(-0.3, 1), unit(1, 0.2), unit(0, -1)], neg: unit(-1, -0.4)
	});

	// the panel letters, level with each other, above and left of each panel's labels
	const top = Math.min(...[...La, ...Lb].map((l) => l.box.t));
	const lx = (L) => Math.min(...L.map((l) => l.box.l));
	const letters = [];
	for (const [l, L] of [['a', La], ['b', Lb]]) {
		const svg = await letter(l, lx(L) - 12, top - 4);
		letters.push({ src: `(${l})`, svg, box: boxOf(svg) });
	}
	// every letter and label clear of every mark of both panels and of each other
	const all = [...La, ...Lb, ...letters];
	for (const l of all) for (const ink of [ia, ib]) {
		const c = ink.clearance(l.box);
		check(c.d >= LABEL_GAP - 0.05, `the label ${l.src} is ${c.d.toFixed(2)} pt from ${c.what}`);
	}
	const apart = (p, q) => p.r + LABEL_GAP <= q.l || q.r + LABEL_GAP <= p.l || p.b + LABEL_GAP <= q.t || q.b + LABEL_GAP <= p.t;
	for (let i = 0; i < all.length; i++) for (let j = i + 1; j < all.length; j++)
		check(apart(all[i].box, all[j].box), `the labels ${all[i].src} and ${all[j].src} touch`);
	return finish(name, [PA, PB], all, [400, 450], CANVAS);
}
