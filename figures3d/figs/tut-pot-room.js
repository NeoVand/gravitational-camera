// The tutorial, section 1.2 (tutorial/newton/field-and-potential.md), its first diagram: the room of the locked safe
// (the paper's fig:locked-safe), drawn from the scene file itself, scenes/locked-safe.scene.json. Two views side by
// side. On the left, the plan: the room seen from above and cut level with the gold, with the chapter's axes x1
// (right) and x2 (ahead) from the origin on the floor below the camera; the three walls (plaster), the two hollow
// steel safes and, in the right-hand one, the gold. On the right, the safes and the camera seen from behind the
// camera and cut through the safes' middles, at three times the plan's scale, with the heights. Exact, and to scale:
// every position and size (the scene's frame has y up and the camera looking along -z, so x1 = x, x2 = -z, x3 = y);
// the safes' steel, 5 cm; the line from the camera to each safe's middle, whose length in space,
// sqrt(1.1^2 + 3.5^2 + 1.0^2) = 3.80 m, is printed (from above it is seen shortened to 3.67 m, since it also falls
// 1.0 m); the straight-ahead 3.5 m. The camera is marked by a small ring at its place, named in both views. In the
// view from behind, a small + marks each safe's middle and the gold's (on the gold, in the page's colour), and the
// heights 0.5 m and 0.13 m are measured to them (the caption says so). In the plan, the side walls' places,
// x1 = -6.0 m and 6.0 m, run along the walls' inner faces halfway along, and the back wall's, x2 = 8.0 m, sits under
// it.
// The plan is a cutaway of the room alone: the floor is drawn where the room is, between the walls' inner faces
// (x1 = -6.0 m to 6.0 m) and from the room's open side, x2 = 0, where the side walls end, to the back wall's inner
// face, x2 = 8.0 m; the three walls are one U of plaster around it, their outer faces 0.3 m out. (The scene's floor
// slab runs on 3 m past the back wall and 3 m behind the camera, out of sight; the plan stops it at the room.) In the
// view from behind, the floor slab is cut 2.05 m either side of the middle.
import { INK, DIM, FAINT, RULE, ACCENT, PAGE } from '../lib.js';
import { Sheet, ORIGIN, placed, beside, finish, checker, near, AXIS, AXIS_HEAD, HAIR, TICK, LABEL_GAP, n2 } from './tut-pot-lib.js';

const SP = 16;                                  // the plan: points per metre
const SE = 3 * SP;                              // the view from behind: three times as large
const FLOOR = '#eeebe5';                        // the floor, a neutral tint of the page
const WALL = RULE;                              // the walls, in section
const STEEL = DIM;                              // the safes' steel, in section
const GOLD = ACCENT;
const LINE_W = 0.5;                             // the lines from the camera to the safes' middles
const RING = 2.1;                               // the camera's ring, radius
const AXIS_LEN = 1.45;                          // m, the plan's axes
const DIM_X = -4.0;                             // m, the 3.5 m dimension's place across
const GAP_VIEWS = 16;                           // between the plan's right-hand wall and the view from behind's ink
const name = 'tut-pot-room';
const check = checker(name);

/** The scene's boxes in the chapter's coordinates: centre and size as [x1, x2, x3]. */
function boxes(scene) {
	const out = {};
	for (const o of scene.objects) {
		const [x, y, z] = o.shape.center, [sx, sy, sz] = o.shape.size;
		check(o.shape.type === 'box', `${o.id} is not a box`);
		out[o.id] = { c: [x, -z, y], s: [sx, sz, sy], material: o.material };
	}
	return out;
}
const lo = (b, i) => b.c[i] - b.s[i] / 2, hi = (b, i) => b.c[i] + b.s[i] / 2;

export default async function () {
	const scene = await (await fetch('/scenes/locked-safe.scene.json')).json();
	const B = boxes(scene);
	const cam = [scene.observer.position[0], -scene.observer.position[2], scene.observer.position[1]];

	// ---- the chapter's numbers, from the scene
	const eq = (a, b, what, tol = 1e-9) => check(near(a, b, tol), `${what}: ${a}, not ${b}`);
	eq(cam[0], 0, 'the camera across'); eq(cam[1], 0, 'the camera ahead'); eq(cam[2], 1.5, 'the camera\'s height');
	for (const [id, sx] of [['safe-left', -1.1], ['safe-right', 1.1]]) {
		const b = B[id];
		eq(b.c[0], sx, id + ' across'); eq(b.c[1], 3.5, id + ' ahead'); eq(b.c[2], 0.5, id + '\'s middle\'s height');
		eq(b.s[0], 0.8, id + ' wide'); eq(b.s[1], 0.8, id + ' deep'); eq(b.s[2], 1.0, id + ' tall');
		const cav = B[id + '-cavity'];
		for (let i = 0; i < 3; i++) eq((b.s[i] - cav.s[i]) / 2, 0.05, id + '\'s steel'), eq(cav.c[i], b.c[i], id + '\'s cavity');
		eq(Math.hypot(b.c[0] - cam[0], b.c[1] - cam[1], b.c[2] - cam[2]), 3.8, id + '\'s middle from the camera', 0.005);
	}
	const gold = B['safe-right-gold'];
	eq(gold.c[0], 1.1, 'the gold across'); eq(gold.c[1], 3.5, 'the gold ahead'); eq(gold.c[2], 0.13, 'the gold\'s height');
	eq(gold.s[0], 0.3, 'the gold wide'); eq(gold.s[1], 0.4, 'the gold deep'); eq(gold.s[2], 0.14, 'the gold tall');
	eq(gold.s[0] * gold.s[1] * gold.s[2] * scene.materials.gold.density, 324.24, 'the gold\'s mass', 1e-6);
	const floor = B.floor, back = B['back-wall'], left = B['left-wall'], rightW = B['right-wall'];
	eq(hi(floor, 2), 0, 'the floor\'s top'); eq(floor.s[0], 12, 'the floor wide'); eq(floor.s[1], 14, 'the floor deep'); eq(floor.s[2], 0.3, 'the floor thick');
	eq(lo(back, 1), 8.0, 'the back wall\'s inner face'); eq(hi(left, 0), -6.0, 'the left wall\'s inner face'); eq(lo(rightW, 0), 6.0, 'the right wall\'s inner face');
	for (const w of [back, left, rightW]) eq(Math.min(...w.s), 0.3, 'a wall\'s thickness'), eq(w.s[2], 5, 'a wall\'s height'), eq(lo(w, 2), 0, 'a wall\'s foot');

	const S = new Sheet(name);
	const labels = [];
	// the plan: the origin (below the camera) at (X0, Y0), x1 to the right, x2 up the page
	const X0 = ORIGIN - 130, Y0 = ORIGIN + 70;
	const pl = (x1, x2) => [X0 + SP * x1, Y0 - SP * x2];
	const rect = (f, x1a, x1b, x2a, x2b) => { const [a, b] = [f(x1a, x2a), f(x1b, x2b)]; return { l: Math.min(a[0], b[0]), r: Math.max(a[0], b[0]), t: Math.min(a[1], b[1]), b: Math.max(a[1], b[1]) }; };
	const rd = (r) => `M${n2(r.l)},${n2(r.t)}H${n2(r.r)}V${n2(r.b)}H${n2(r.l)}Z`;
	/** A box's footprint in the plan (axes 0 and 1) or its face from behind (axes 0 and 2). */
	const foot = (b, f, j) => rect(f, lo(b, 0), hi(b, 0), lo(b, j), hi(b, j));

	// ---- the plan: the room alone, its floor between the walls' inner faces and from the open side (x2 = 0, where
	// the side walls end) to the back wall; the walls one U around it
	const OPEN = 0;                                       // m, the room's open side
	eq(lo(left, 1), OPEN, 'the left wall\'s near end'); eq(lo(rightW, 1), OPEN, 'the right wall\'s near end');
	eq(hi(left, 1), lo(back, 1), 'the left wall\'s far end'); eq(hi(rightW, 1), lo(back, 1), 'the right wall\'s far end');
	eq(lo(back, 0), lo(left, 0), 'the back wall\'s left end'); eq(hi(back, 0), hi(rightW, 0), 'the back wall\'s right end');
	check(lo(floor, 1) <= OPEN && hi(floor, 1) >= lo(back, 1) && near(lo(floor, 0), hi(left, 0)) && near(hi(floor, 0), lo(rightW, 0)),
		'the floor does not fill the room');
	const room = rect(pl, hi(left, 0), lo(rightW, 0), OPEN, lo(back, 1));        // the floor inside the room
	const outer = rect(pl, lo(left, 0), hi(rightW, 0), OPEN, hi(back, 1));       // the walls' outer faces
	S.fill(rd(room), room, { color: FLOOR, layer: 0, what: 'the floor', solid: false });
	const wallsD = `M${n2(outer.l)},${n2(outer.b)}V${n2(outer.t)}H${n2(outer.r)}V${n2(outer.b)}H${n2(room.r)}V${n2(room.t)}H${n2(room.l)}V${n2(room.b)}Z`;
	S.fill(wallsD, outer, { color: WALL, layer: 0.6, what: 'the walls', solid: false });
	for (const [r, what] of [[{ ...outer, r: room.l }, 'the left wall'], [{ ...outer, l: room.r }, 'the right wall'], [{ ...outer, b: room.t }, 'the back wall']])
		S.boxes.push({ box: r, what });
	for (const id of ['safe-left', 'safe-right']) {
		const o = foot(B[id], pl, 1), i = foot(B[id + '-cavity'], pl, 1);
		S.fill(rd(o) + rd(i), o, { color: STEEL, layer: 1, rule: 'evenodd', what: 'the ' + id });
	}
	const g = foot(gold, pl, 1);
	S.fill(rd(g), g, { color: GOLD, layer: 1.1, what: 'the gold' });

	// the camera, the axes from the origin below it
	const C = pl(0, 0);
	const ring = (c, layer) => {
		S.raw(`<circle cx="${n2(c[0])}" cy="${n2(c[1])}" r="${RING}" fill="${PAGE}" stroke="${INK}" stroke-width="0.6"/>`, layer);
		S.mark([c], RING + 0.3, 'the camera');
	};
	ring(C, 3);
	const ax1 = S.arrow([C[0] + RING + 1.2, C[1]], pl(AXIS_LEN, 0), { color: DIM, width: AXIS, head: AXIS_HEAD, layer: 2, what: 'the axis x1' });
	const ax2 = S.arrow([C[0], C[1] - RING - 1.2], pl(0, AXIS_LEN), { color: DIM, width: AXIS, head: AXIS_HEAD, layer: 2, what: 'the axis x2' });
	labels.push(await beside('x_1', ax1.B, [1, 0], 2.5, DIM));
	labels.push(await beside('x_2', ax2.B, [0, -1], 2.4, DIM));
	labels.push(await beside('\\text{camera}', C, [0, 1], RING + 0.3 + 2.5, INK));

	// the lines to the safes' middles, each labelled with its length in space
	for (const [id, side] of [['safe-left', -1], ['safe-right', 1]]) {
		const m = B[id].c, M = pl(m[0], m[1]);
		const L = Math.hypot(M[0] - C[0], M[1] - C[1]), u = [(M[0] - C[0]) / L, (M[1] - C[1]) / L];
		const from = [C[0] + u[0] * (RING + 1.2), C[1] + u[1] * (RING + 1.2)];
		S.raw(`<path d="M${n2(from[0])},${n2(from[1])}L${n2(M[0])},${n2(M[1])}" stroke="${INK}" stroke-width="${LINE_W}" stroke-linecap="round" fill="none"/>`, 2);
		S.mark([from, M], LINE_W / 2, 'the line to the ' + id);
		S.raw(`<circle cx="${n2(M[0])}" cy="${n2(M[1])}" r="0.95" fill="${INK}"/>`, 2.1);
		eq(Math.hypot(m[0], m[1]), Math.hypot(1.1, 3.5), 'the line\'s length from above');
		// the label beside the line, outward, two thirds of the way to the safe (clear of the 3.5 m's label, level with the line's third)
		const q = [from[0] + (M[0] - from[0]) * 0.62, from[1] + (M[1] - from[1]) * 0.62];
		labels.push(await S.clear('3.8\\,\\mathrm{m}', q[0], q[1], side > 0 ? 0 : 1, 0.5, [side, 0]));
	}

	// the straight-ahead distance: a dimension left of the left-hand safe, from the camera's line to the safes' middles
	{
		const x = pl(DIM_X, 0)[0], y0 = C[1], y1 = pl(0, 3.5)[1];
		S.path([[x, y0], [x, y1]], { color: INK, width: HAIR, layer: 2, cap: 'butt', what: 'the 3.5 m dimension' });
		for (const y of [y0, y1]) S.path([[x - TICK, y], [x + TICK, y]], { color: INK, width: HAIR, layer: 2, cap: 'butt', what: 'a tick of the 3.5 m dimension' });
		S.dots([C[0] - RING - 1.6, y0], [x + TICK + 0.8, y0], { color: FAINT, what: 'the camera\'s extension line' });
		S.dots([foot(B['safe-left'], pl, 1).l - 1.6, y1], [x + TICK + 0.8, y1], { color: FAINT, what: 'the safes\' extension line' });
		labels.push(await placed('3.5\\,\\mathrm{m}', x - 3, (y0 + y1) / 2, 1, 0.5, INK));
	}

	// the walls' places, inside the room beside each; the view's name and the floor's, in the room's near corners
	labels.push(await placed('x_2 = 8.0\\,\\mathrm{m}', X0, room.t + 3, 0.5, 0, DIM));
	// the side walls' places run along their walls' inner faces, halfway along, both turned a quarter turn the same way
	// (read from below), x the face's place and side the way into the room
	const along = async (src, x, y, side) => {
		const rot = -90, p = await placed(src, 0, 0, 0.5, 0.5, DIM), w = p.box.r - p.box.l, h = p.box.b - p.box.t;
		const cx = x + (side * h) / 2;
		return { src, svg: `<g transform="translate(${n2(cx)},${n2(y)}) rotate(${rot})">${p.svg}</g>`, box: { l: cx - h / 2, r: cx + h / 2, t: y - w / 2, b: y + w / 2 } };
	};
	labels.push(await along('x_1 = -6.0\\,\\mathrm{m}', room.l + 3.2, pl(0, lo(back, 1) / 2)[1], 1));
	labels.push(await along('x_1 = 6.0\\,\\mathrm{m}', room.r - 3.2, pl(0, lo(back, 1) / 2)[1], -1));
	labels.push(await placed('\\text{from above}', room.l + 3.2, room.t + 3, 0, 0, DIM));
	labels.push(await placed('\\text{floor}', room.r - 3.2, room.b - 3, 1, 1, DIM));
	for (const l of labels) l.on = ['the floor'];

	// ---- on the right: the camera and the safes seen from behind the camera, cut through the safes' middles, three
	// times as large; its ink begins GAP_VIEWS right of the plan's walls (its leftmost ink is the 0.5 m label); its name
	// is level with the plan's, along the top, and the drawing (from the camera's ring's top to the slab's foot) is
	// centred in height between that name and the plan's open side
	const sx = lo(B['safe-left'], 0) - 0.3, gx = hi(B['safe-right'], 0) + 0.3;   // m, the side dimensions' places
	const halfLabel = await placed('0.5\\,\\mathrm{m}', 0, 0, 0, 0, INK);
	const leftReach = -sx * SE + 3.2 + (halfLabel.box.r - halfLabel.box.l);      // from the view's middle to its leftmost ink
	const viewTop = SE * cam[2] + RING, viewFoot = -SE * lo(floor, 2);           // above and below the floor's top
	const viewName = await placed('\\text{from behind the camera}', 0, room.t + 3, 0, 0, DIM);
	const E0 = [outer.r + GAP_VIEWS + leftReach, (viewName.box.b + outer.b + viewTop - viewFoot) / 2];   // the origin, on the floor's top
	const el = (x1, x3) => [E0[0] + SE * x1, E0[1] - SE * x3];
	const CUT = 2.05;                                     // m, the floor's slab is shown this far either way
	const slab = rect(el, -CUT, CUT, lo(floor, 2), hi(floor, 2));
	S.fill(rd(slab), slab, { color: FLOOR, layer: 0, what: 'the floor slab', solid: false });
	for (const id of ['safe-left', 'safe-right']) {
		const o = foot(B[id], el, 2), i = foot(B[id + '-cavity'], el, 2);
		S.fill(rd(o) + rd(i), o, { color: STEEL, layer: 1, rule: 'evenodd', what: 'the ' + id + ' from behind' });
	}
	const g2 = foot(gold, el, 2);
	S.fill(rd(g2), g2, { color: GOLD, layer: 1.1, what: 'the gold from behind' });
	const C2 = el(0, cam[2]);
	ring(C2, 3);
	labels.push(await beside('\\text{camera}', C2, [-1, 0], RING + 0.3 + 2.5, INK));

	// the heights: the camera's, from the floor up the middle; the safes' middles', left of the left-hand safe; the gold's, right of the right-hand one
	const dimV = (x, x3, what) => {
		const [px, y0] = el(x, 0), y1 = el(x, x3)[1];
		S.path([[px, y0], [px, y1]], { color: INK, width: HAIR, layer: 2, cap: 'butt', what });
		for (const y of [y0, y1]) S.path([[px - TICK, y], [px + TICK, y]], { color: INK, width: HAIR, layer: 2, cap: 'butt', what: 'a tick of ' + what });
		return { x: px, y0, y1 };
	};
	// the camera's height: a dimension just right of it, its top tick level with the camera's middle
	const cDim = dimV(0.3, cam[2], 'the camera\'s height');
	S.dots([C2[0] + RING + 1.2, cDim.y1], [cDim.x - TICK - 0.8, cDim.y1], { color: FAINT, what: 'the camera\'s extension line' });
	labels.push(await placed('1.5\\,\\mathrm{m}', cDim.x + 3.2, el(0, 1.25)[1], 0, 0.5, INK));
	const sDim = dimV(sx, B['safe-left'].c[2], 'the safes\' middles\' height');
	S.dots([foot(B['safe-left'], el, 2).l - 1.2, sDim.y1], [sDim.x + TICK + 0.8, sDim.y1], { color: FAINT, what: 'the safe\'s extension line' });
	labels.push(await placed('0.5\\,\\mathrm{m}', sDim.x - 3.2, (sDim.y0 + sDim.y1) / 2, 1, 0.5, INK));
	const gDim = dimV(gx, gold.c[2], 'the gold\'s middle\'s height');
	S.dots([foot(B['safe-right'], el, 2).r + 1.2, gDim.y1], [gDim.x - TICK - 0.8, gDim.y1], { color: FAINT, what: 'the gold\'s extension line' });
	labels.push(await placed('0.13\\,\\mathrm{m}', gDim.x + TICK + HAIR / 2 + LABEL_GAP + 0.2, (gDim.y0 + gDim.y1) / 2, 0, 0.5, INK));
	// the view's name, from the slab's left end, level with the plan's (the two names on one line along the top)
	labels.push(await placed('\\text{from behind the camera}', slab.l, room.t + 3, 0, 0, DIM));
	// the middles: a small + at each safe's middle (ink) and at the gold's (the page's colour, on the gold); the heights
	// are measured to them
	const gm = el(gold.c[0], gold.c[2]);
	check(gm[1] - 1.6 > g2.t + 0.8 && gm[1] + 1.6 < g2.b - 0.8, 'the gold\'s + does not fit in the gold');
	for (const [p, what, color, arm] of [[el(-1.1, 0.5), 'the left middle', INK, 2], [el(1.1, 0.5), 'the right middle', INK, 2], [gm, 'the gold\'s middle', PAGE, 1.6]]) {
		S.path([[p[0] - arm, p[1]], [p[0] + arm, p[1]]], { color, width: HAIR * 1.4, layer: 2, cap: 'butt', what });
		S.path([[p[0], p[1] - arm], [p[0], p[1] + arm]], { color, width: HAIR * 1.4, layer: 2, cap: 'butt', what });
	}

	// ---- the plan agrees with the paper's figure: the gold in the right-hand safe, both safes ahead of the camera
	check(g.l > foot(B['safe-right'], pl, 1).l && g.r < foot(B['safe-right'], pl, 1).r && g.l > X0, 'the gold is not in the right-hand safe');

	S.checkAll(labels);
	return finish(S, labels, [400, 470]);
}
