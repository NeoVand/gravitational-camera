// The tutorial, section 7.7 (tutorial/geometry/quadrupole-formula.md), its second diagram: near a slow source the
// tide points at where the masses are now. A pair of stone masses on their orbit round a small cross, drawn solid at
// their present places; the same pair drawn hollow and pale at their retarded places, turned back by the angle
// Omega r / c (exaggerated to 25 degrees), "retarded positions". To the right, at the distance r, the pixel: the paper's
// ring of twelve free steel beads (tut-gw-lib.js, freeRing) pushed by Newton's tide of the two masses at their present
// places, its stretch axis (orange) along the present line and its squeeze axis (blue) across it. A dashed ink line
// from the pixel along the present line, a dotted line along the retarded line, and between them, about the pair's
// centre, an arc with its head toward the present line (the sense of turning), "Omega r / c = k r / 2". Below, three
// lines of type: "zeroth order: the present positions; first order: uniform, zero by conservation of mass; error of
// order (k r)^2".
// Departures from the diagram's comment: the pixel stands on the present line itself, so that the dashed line from it
// runs along that line to the pair, not beside it: a pair's tide has its stretch axis along the pair's line only where
// the pair points at the pixel or lies across the line to it (in the plane its quadrupole part has
// tan 2 theta = -(16/19) tan 2 phi, so elsewhere its axis turns the other way from the pair's). The pair's orbit is
// drawn as a thin circle, and the solid pair is named too, "present positions"; a curved ink arrow just outside the
// orbit, at its top, anticlockwise, "Omega", gives the sense of the orbit, so that the hollow pair reads as where the
// masses were. The pixel's ring is drawn without freeRing's pale ring of half a cycle later (it is taken out again
// after freeRing draws it): a wave's tide reverses, Newton's tide of the pair never does. Of the ring's axes only the
// stretch axis is drawn, in orange, and the pixel's name says so in two lines, "pixel; the orange line / is its
// stretch axis" (the blue squeeze axis, unexplained, is left out; the blue arrows show the squeeze). The dotted
// retarded line stops 84 points from the pair's centre, so that the frame has no empty lower right. The arc marking the angle carries a
// head, the sense of the turning, so that "turned back" reads without a separate curved arrow. The line of type is
// set on three lines, so that the drawing stays narrow.
// Exact: the ring's table, Newton's tide of two equal point masses at the drawn present places at the pixel's drawn
// place (each (G m / rho^3)(delta - 3 n n)), computed and asserted diagonal with its stretch along the line to the
// pair; each bead and arrow its image under that table (tut-gw-lib.js); the arc's span exactly the angle between the
// two lines; the orbit's sense, anticlockwise, the sense in which the retarded places lag (asserted); Omega r / c = k r / 2 with k = 2 Omega / c (tut-quadrupole-lib.js). Exaggerated: the angle (at k r = 0.1 it
// is 0.05 rad, 2.9 degrees), the ring's strain, the sizes and the distance.
// Pictorial: the stones, a picture from an image model (sprites/hair/ball-face.png, as tut-rotor-stress), clipped to
// their exact circles.
import { Sheet, ORIGIN, finish, checker, placed, beside, near, LABEL_GAP, HAIR } from './tut-pot-lib.js';
import { INK, DIM, RULE, PAGE, sprite } from '../lib.js';
import { picture, circle as circlePath } from '../stone.js';
import { STONE_INK, dashed } from './tut-orb-lib.js';
import { turning } from './tut-flow-lib.js';
import { freeRing } from './tut-gw-lib.js';
import { chapter, palette, stack, ACCENT, C } from './tut-quadrupole-lib.js';

const name = 'tut-present-delay';
const check = checker(name);

const ALPHA = 25;                          // degrees: the retarded turn, exaggerated
const HS = 34;                             // the orbit's radius, points
const RS = 6;                              // a stone's radius
const HOLLOW = 0.55;                       // a retarded mass's outline
const ORBIT = HAIR;                        // the orbit's circle
const CROSS_C = 3;                         // half an arm of the centre's cross
const DIST = 150;                          // the pair's centre to the pixel's: r, points (schematic)
const R = 24;                              // the pixel's ring, undisturbed radius
const EPS = 0.2, REACH = 11;               // the ring's strain (exaggerated) and its arrows' length per unit of push
const AXIS_ARM = 8;                        // half an arm of the ring's stretch and squeeze axes
const AXIS_W = 0.6;
const ARC_R = 60;                          // the angle's arc, about the pair's centre
const ARC_W = 0.5, ARC_HEAD = 3.4;
const RET_TO = 84;                         // the dotted line's far end, from the pair's centre
const SPIN = { off: 4.5, from: 62, to: 118 };  // the orbit's sense: its arc's distance outside the orbit, and its span (degrees)
const LINE_W = 0.55;                       // the dashed line
const AIR = 2.4;                           // a line's end to the mark it stops at
const TEXT_AIR = 9;                        // the lowest mark to the line of type

export default async function () {
	chapter(check);
	await palette(check);
	const S = new Sheet(name);
	const L = [];
	const art = await sprite('/figures3d/sprites/hair/ball-face.png');
	const a = (ALPHA * Math.PI) / 180;
	const O = [ORIGIN - DIST / 2, ORIGIN - 30];
	const P = [O[0] + DIST, O[1]];
	const dir = (t) => [Math.cos(t), -Math.sin(t)];             // the page's direction at the angle t (anticlockwise)
	const at = (s, t) => [O[0] + s * dir(t)[0], O[1] + s * dir(t)[1]];

	// ---- the retarded turn: Omega r / c = k r / 2 (asserted in the library); the drawn angle is exaggerated
	check(near((2.2 * 1e6 * 3.7) / C, ((2 * 3.7) / C) * 2.2e6 / 2, 1e-18), 'Omega r / c is not k r / 2');

	// ---- the orbit, the centre's cross, the present pair (solid) and the retarded pair (hollow, turned back by alpha)
	S.raw(`<path d="${circlePath(O[0], O[1], HS)}" fill="none" stroke="${DIM}" stroke-width="${ORBIT}"/>`, 0);
	S.mark(Array.from({ length: 241 }, (_, i) => at(HS, (2 * Math.PI * i) / 240)), ORBIT / 2, 'the orbit');
	S.path([[O[0] - CROSS_C, O[1]], [O[0] + CROSS_C, O[1]]], { color: INK, width: HAIR, cap: 'butt', what: 'the cross' });
	S.path([[O[0], O[1] - CROSS_C], [O[0], O[1] + CROSS_C]], { color: INK, width: HAIR, cap: 'butt', what: 'the cross' });
	const present = [0, Math.PI].map((t) => at(HS, t));
	const retarded = [-a, Math.PI - a].map((t) => at(HS, t));
	for (const [k, c] of present.entries()) {
		S.raw(picture(`${name}-stone${k}`, art, c[0], c[1], RS, circlePath(c[0], c[1], RS)) + `<path d="${circlePath(c[0], c[1], RS)}" fill="none" stroke="${STONE_INK}" stroke-width="0.35"/>`, 3);
		S.mark([c], RS, `stone ${k}`);
	}
	for (const [k, c] of retarded.entries()) {
		S.raw(`<path d="${circlePath(c[0], c[1], RS - HOLLOW / 2)}" fill="${PAGE}" stroke="${DIM}" stroke-width="${HOLLOW}"/>`, 2);
		S.mark(Array.from({ length: 61 }, (_, i) => [c[0] + (RS - HOLLOW / 2) * Math.cos((2 * Math.PI * i) / 60), c[1] + (RS - HOLLOW / 2) * Math.sin((2 * Math.PI * i) / 60)]), HOLLOW / 2, `retarded mass ${k}`);
		const gap = Math.hypot(c[0] - present[k][0], c[1] - present[k][1]) - 2 * RS;
		check(gap > 1.5, `the retarded mass ${k} touches the present one (${gap.toFixed(2)} pt)`);
	}

	// ---- the sense of the orbit: a curved arrow just outside it, at its top, anticlockwise, "Omega"
	{
		const t = turning(O[0], O[1], HS + SPIN.off, (SPIN.from * Math.PI) / 180, (SPIN.to * Math.PI) / 180, INK, { width: ARC_W, head: ARC_HEAD });
		S.raw(t.svg, 3);
		S.mark(t.pts, ARC_W / 2, 'the orbit\'s sense');
		S.mark(t.head, 0, 'the orbit\'s sense\'s head');
		S.arrows.push({ L: t.len, head: t.hd, what: 'the orbit\'s sense' });
		// anticlockwise, as the retarded places, turned back by alpha, lag the present ones
		check(SPIN.to > SPIN.from && retarded[0][1] > present[0][1], 'the orbit\'s sense disagrees with the retarded places');
		const mid = (((SPIN.from + SPIN.to) / 2) * Math.PI) / 180;
		L.push(await beside('\\Omega', at(HS + SPIN.off, mid), dir(mid), LABEL_GAP + 0.6, INK));
	}

	// ---- the pixel: Newton's tide of the two masses at their present places, in the plane's axes (e_1 right, e_2 up)
	const E = [[0, 0], [0, 0]];
	for (const c of present) {
		const d = [P[0] - c[0], -(P[1] - c[1])], rho = Math.hypot(...d), n = [d[0] / rho, d[1] / rho];
		for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) E[i][j] += ((i === j ? 1 : 0) - 3 * n[i] * n[j]) / rho ** 3;
	}
	check(Math.abs(E[0][1]) < 1e-15 * Math.abs(E[0][0]) && E[0][0] < 0 && E[1][1] > 0 && near(E[0][0] / E[1][1], -2, 1e-12), `the pixel's tide ${E}`);
	const T = E.map((row) => row.map((v) => v / Math.abs(E[0][0])));
	// the beads stand 15 degrees off the axes, so that none sits where the push is along the ring (tan^2 = 2, 54.7 degrees)
	const before = { items: S.P.items.length, marks: S.marks.length };
	const ring = freeRing(S, check, { c: P, R, T, eps: EPS, phase: Math.PI / 12, reach: REACH, what: 'the pixel' });
	// freeRing also draws the ring of half a cycle later (the table's opposite, pale beads and pale dashes): a wave's
	// tide reverses, Newton's tide of the pair never does, so here it is taken out again
	{
		const pale = (it) => (it.kind === 'sphere' && it.o?.opacity === 0.3) || (it.kind === 'raw' && it.svg.includes(`stroke="${RULE}"`));
		const fresh = S.P.items.slice(before.items);
		const gone = fresh.filter(pale).length;
		S.P.items.splice(before.items, fresh.length, ...fresh.filter((it) => !pale(it)));
		const marks = S.marks.slice(before.marks);
		S.marks.splice(before.marks, marks.length, ...marks.filter((k) => !k.what.includes('pale')));
		check(gone >= 12 + 20 && marks.filter((k) => k.what.includes('pale bead')).length === 12, `the pale ring: ${gone} items taken out`);
	}
	check(ring.arrows.filter((r) => r.out > 0).every((r) => Math.abs(Math.cos(Math.atan2(ring.beads[r.k].xi[1], ring.beads[r.k].xi[0]))) > 0.7), 'an outward arrow stands off the stretch axis');
	// the stretch axis (orange) along the line to the pair, the squeeze axis (blue) across it
	S.path([[P[0] - AXIS_ARM, P[1]], [P[0] + AXIS_ARM, P[1]]], { color: ACCENT, width: AXIS_W, cap: 'butt', layer: 2, what: 'the stretch axis' });
	const ringLow = Math.max(...ring.beads.map((b) => b.p[1] + 2.7), ...ring.arrows.map((r) => Math.max(r.from[1], r.to[1])));
	L.push(await stack(['\\text{pixel; the orange line}', '\\text{is its stretch axis}'], P[0], ringLow + LABEL_GAP + 0.8, 0.5, INK));

	// ---- the dashed line from the pixel along the present line, to the near stone; the dotted retarded line
	// it runs into the stretch axis, a dash left out wherever it would come near a bead, an arrow or a ring
	const near0 = [present[0][0] + RS + AIR, O[1]];
	const ringMark = (w) => !w.startsWith('the pixel');
	const clash = (q, g) => S.clearance({ l: q[0], r: q[0], t: q[1], b: q[1] }, ringMark).d < g;
	const drawnDashes = dashed(S, [P[0] - AXIS_ARM - AIR, O[1]], near0, { color: INK, width: LINE_W, clash, what: 'the present line' });
	const leftTip = P[0] - AXIS_ARM - AIR - Math.max(...drawnDashes.map(([, s1]) => s1));
	const r0 = HS + RS + AIR, ret = S.dots(at(r0, -a), at(RET_TO, -a), { color: INK, what: 'the retarded line' });
	check(ret.n > 20, 'the dotted line is too short');

	// ---- the angle between them, about the pair's centre: from the retarded line to the present one
	{
		const t = turning(O[0], O[1], ARC_R, -a, 0, INK, { width: ARC_W, head: ARC_HEAD });
		S.raw(t.svg, 3);
		S.mark(t.pts, ARC_W / 2, 'the angle');
		S.mark(t.head, 0, 'the angle\'s head');
		S.arrows.push({ L: t.len, head: t.hd, what: 'the angle' });
		check(near(t.len, ARC_R * a, 1e-9), 'the arc does not span the angle between the lines');
		// in the wedge, right of the arc, on two lines
		L.push(await stack(['\\Omega r/c', '= kr/2'], O[0] + ARC_R + 5, O[1] + LINE_W / 2 + LABEL_GAP + 1.4, 0, INK));
	}
	// the distance r, above the dashed line
	L.push(await S.clear('r', (near0[0] + P[0] - R * 1.2) / 2, O[1] - LINE_W / 2 - LABEL_GAP - 0.3, 0.5, 1, [0, -1]));

	// ---- the names of the two pairs
	{
		const probe = await stack(['\\text{retarded}', '\\text{positions}'], 0, 0, 1, DIM);
		const h = probe.box.b - probe.box.t;
		const ret = await stack(['\\text{retarded}', '\\text{positions}'], retarded[1][0] - RS - LABEL_GAP - 3, retarded[1][1] - h / 2 - 3, 1, DIM);
		const pre = await stack(['\\text{present}', '\\text{positions}'], present[1][0] - RS - LABEL_GAP - 3, present[1][1] - h / 2 + 9, 1, INK);
		check(pre.box.t - ret.box.b >= LABEL_GAP, 'the names of the two pairs touch');
		L.push(ret, pre);
	}

	// ---- the line of type
	{
		const lowest = Math.max(...S.marks.flatMap((k) => k.pts.map((p) => p[1] + k.r)), ...L.map((l) => l.box.b));
		const left = Math.min(...S.marks.flatMap((k) => k.pts.map((p) => p[0] - k.r)), ...L.map((l) => l.box.l));
		L.push(await stack(['\\text{zeroth order: the present positions;}', '\\text{first order: uniform, zero by conservation of mass;}', '\\text{error of order }(kr)^2'], left, lowest + TEXT_AIR, 0, INK));
	}

	S.checkAll(L);
	window[name + '-numbers'] = { E, alpha: ALPHA };
	return finish(S, L, [200, 300]);
}
