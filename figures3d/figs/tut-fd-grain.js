// The tutorial, chapter 4.6 (tutorial/response/fluctuation-dissipation.md), its first diagram: a bead in water wanders
// about its own diameter in a second, kicked by the water and slowed by it. Two panels side by side (one drawing serves
// the desktop and the phone, so the two are laid out to be read at 390 px, as R3's figures are). Left: one simulated
// Langevin path of the bead of the chapter's number (radius 0.5 um, water at 293 K, D = 4.29 x 10^-13 m^2/s) projected
// on the x-y plane over 1 s, 400 steps of 2.5 ms, each step a Gaussian displacement of standard deviation sqrt(2 D dt)
// = 46 nm along each axis (seed 15); the path a thin dark polyline, an open dot at its start and a filled dot at its
// end, where the bead is drawn to scale as a disc 1 um across; a scale bar of 1 um. Right: the bead enlarged to a disc
// 4 cm across on the printed page, in a crowd of 60 water molecules; five thin arrows into the bead from molecules
// striking it, named once "kicks, F_th"; a velocity arrow v and, opposite it, a thicker arrow, "drag, -m Gamma v".
// Exact: the path (its steps asserted to have the model's standard deviation within 8% and mean zero within three
// standard errors, figs/tut-fd-lib.js, `chapter`), the bead's size against it and the scale bar. Schematic: the right
// panel, its molecules (seeded places), the kicks and the lengths of v and of the drag.
import { Sheet, ORIGIN, finish, checker, placed, near, n2, HAIR, TICK, VEC, VEC_HEAD, LABEL_GAP } from './tut-pot-lib.js';
import { uniforms, TINT } from './tut-prob-lib.js';
import { INK, DIM, FAINT, RULE, PAGE } from '../lib.js';
import { chapter, beadPath, R_BEAD, STEP_SD } from './tut-fd-lib.js';

const name = 'tut-fd-grain';
const check = checker(name);

// ---- the drawing (points) -----------------------------------------------------------------------------------------
const PER_UM = 66;                        // the left panel: points per micrometre
const PATH = 0.45;                        // the path's stroke
const START = 1.5, END = 1.25;            // the open dot at the start (radius), the filled one at the end
const EDGE = 0.5;                         // the bead's outline
const BAR_GAP = 9;                        // from the lowest mark of the path down to the scale bar
const CM = 72 / 2.54;                     // points per centimetre
const BIG = 2 * CM;                       // the enlarged bead's radius: 4 cm across
const PANEL_GAP = 24;                     // between the two panels
const MOL = 3.1;                          // a molecule's radius
const MOL_GAP = 4.2;                      // the least air between two molecules, or a molecule and any mark
const CROWD = 60;
const KICK = 0.5, KICK_HEAD = 3.2;        // a kick's arrow
const KICK_AT = [205, 140, 72, 318, 262]; // degrees, anticlockwise from the right: where the five kicks land
const KICK_LEN = 11;                      // a kick arrow's length
const DRAG = 1.3, DRAG_HEAD = 5.4;        // the drag, thicker than v
const V_LEN = 36, DRAG_LEN = 28;
const V_DIR = -24;                        // degrees: v points up and to the right

export default async function () {
	const n = chapter(check);
	const S = new Sheet(name);
	const L = [];

	// ---- the left panel: the path, metres to points about the middle of its box
	const { pts } = beadPath();
	const um = pts.map(([x, y]) => [x * 1e6, y * 1e6]);
	const end = um[um.length - 1], rb = R_BEAD * 1e6;
	// the extent of the path and of the bead at its end
	const xs = [...um.map((p) => p[0]), end[0] - rb, end[0] + rb], ys = [...um.map((p) => p[1]), end[1] - rb, end[1] + rb];
	const box = { l: Math.min(...xs), r: Math.max(...xs), b: Math.min(...ys), t: Math.max(...ys) };
	const H = 2 * (BIG + 2 * MOL + 3 * MOL_GAP);          // the panels' common height, set by the right one
	const leftW = (box.r - box.l) * PER_UM;
	const totalW = leftW + PANEL_GAP + 2 * (BIG + 2 * MOL + 3 * MOL_GAP) * 1.04;
	const x0 = ORIGIN - totalW / 2, top = ORIGIN - H / 2;
	const pathH = (box.t - box.b) * PER_UM;
	const yTop = top + (H - pathH - BAR_GAP - 14) / 2;   // the path and the bar, centred in the panel's height
	const page = ([x, y]) => [x0 + (x - box.l) * PER_UM, yTop + (box.t - y) * PER_UM];
	const P = um.map(page);
	// the bead to scale at the end: a disc 1 um across, under the path
	const E = page(end), rPage = rb * PER_UM;
	check(near(2 * rPage, PER_UM, 1e-9), 'the bead is not 1 um across on the scale of the path');
	S.raw(`<circle cx="${n2(E[0])}" cy="${n2(E[1])}" r="${n2(rPage)}" fill="${TINT}" stroke="${DIM}" stroke-width="${EDGE}"/>`, 0.5);
	S.mark([E], rPage + EDGE / 2, 'the bead at the end');
	S.path(P, { color: INK, width: PATH, layer: 1, what: 'the path' });
	// every step of the path on the page is its 46 nm scale: the steps' root mean square, in points
	const rms = Math.sqrt(P.slice(1).reduce((s, p, i) => s + (p[0] - P[i][0]) ** 2 + (p[1] - P[i][1]) ** 2, 0) / (P.length - 1));
	check(Math.abs(rms / (Math.SQRT2 * STEP_SD * 1e6 * PER_UM) - 1) < 0.08, `the path's steps on the page: ${rms}`);
	const S0 = P[0];
	S.raw(`<circle cx="${n2(S0[0])}" cy="${n2(S0[1])}" r="${START}" fill="${PAGE}" stroke="${INK}" stroke-width="${PATH}"/>`, 2);
	S.mark([S0], START + PATH / 2, 'the start');
	S.raw(`<circle cx="${n2(E[0])}" cy="${n2(E[1])}" r="${END}" fill="${INK}"/>`, 2);
	S.mark([E], END, 'the end');
	// the start and the end are a typical distance apart: within a factor two of the root mean square 1.31 um in 2D
	const dist = Math.hypot(end[0], end[1]);
	check(dist > 0.65 && dist < 2.6, `the path ends ${dist} um from its start`);
	// ---- the scale bar, 1 um, under the path, at its left
	const low = Math.max(...P.map((p) => p[1]), E[1] + rPage);
	const by = low + BAR_GAP, bx = x0;
	S.path([[bx, by], [bx + PER_UM, by]], { color: INK, width: HAIR + 0.15, cap: 'butt', what: 'the scale bar' });
	for (const x of [bx, bx + PER_UM]) S.path([[x, by - TICK], [x, by + TICK]], { color: INK, width: HAIR, cap: 'butt', what: 'the scale bar\'s end' });
	L.push(await placed('1\\,\\mu\\mathrm{m}', bx + PER_UM / 2, by + TICK + LABEL_GAP + 0.3, 0.5, 0, INK));

	// ---- the right panel: the bead enlarged, centred in its half
	const rightL = x0 + leftW + PANEL_GAP, rightW = x0 + totalW - rightL;
	const C = [rightL + rightW / 2, top + H / 2];
	check(near(2 * BIG, 4 * CM, 1e-9), 'the enlarged bead is not 4 cm across');
	S.raw(`<circle cx="${n2(C[0])}" cy="${n2(C[1])}" r="${n2(BIG)}" fill="${TINT}" stroke="${INK}" stroke-width="${EDGE}"/>`, 0.5);
	const rim = Array.from({ length: 361 }, (_, k) => [C[0] + BIG * Math.cos((k * Math.PI) / 180), C[1] + BIG * Math.sin((k * Math.PI) / 180)]);
	S.mark(rim, EDGE / 2, 'the enlarged bead');
	const mols = [];
	const molecule = (c, what) => {
		S.raw(`<circle cx="${n2(c[0])}" cy="${n2(c[1])}" r="${MOL}" fill="${RULE}" stroke="${FAINT}" stroke-width="${HAIR}"/>`, 1);
		S.mark([c], MOL + HAIR / 2, what);
		mols.push(c);
	};
	// the five kicks: a molecule just outside the bead, its arrow from it to the bead's surface, aimed a little off
	// the centre, as a blow at an angle
	const kicks = [];
	for (const [i, deg] of KICK_AT.entries()) {
		const t = (-deg * Math.PI) / 180;              // page y is down
		const off = ((i % 2 ? 1 : -1) * 9 * Math.PI) / 180;
		const hit = [C[0] + (BIG + EDGE / 2 + 0.7) * Math.cos(t), C[1] + (BIG + EDGE / 2 + 0.7) * Math.sin(t)];
		const u = [-Math.cos(t + off), -Math.sin(t + off)];   // the direction of the blow
		const from = [hit[0] - u[0] * KICK_LEN, hit[1] - u[1] * KICK_LEN];
		const c = [from[0] - u[0] * (MOL + HAIR + 0.9), from[1] - u[1] * (MOL + HAIR + 0.9)];
		molecule(c, `the striking molecule ${i}`);
		const a = S.arrow(from, hit, { color: INK, width: KICK, head: KICK_HEAD, layer: 2, what: `the kick ${i}` });
		// into the bead: the blow has a part along the inward normal
		check(u[0] * -Math.cos(t) + u[1] * -Math.sin(t) > 0.95, `the kick ${i} does not point into the bead`);
		kicks.push({ a, c, t });
	}
	// v and the drag, from the centre, opposite each other
	const tv = (V_DIR * Math.PI) / 180, uv = [Math.cos(tv), Math.sin(tv)];
	const av = S.arrow(C, [C[0] + uv[0] * V_LEN, C[1] + uv[1] * V_LEN], { color: INK, width: VEC, head: VEC_HEAD, layer: 2, what: 'v' });
	const ad = S.arrow(C, [C[0] - uv[0] * DRAG_LEN, C[1] - uv[1] * DRAG_LEN], { color: INK, width: DRAG, head: DRAG_HEAD, layer: 2, what: 'the drag' });
	check(near(av.u[0] + ad.u[0], 0, 1e-12) && near(av.u[1] + ad.u[1], 0, 1e-12), 'the drag is not opposite to v');
	S.raw(`<circle cx="${n2(C[0])}" cy="${n2(C[1])}" r="${END}" fill="${INK}"/>`, 2.5);
	S.mark([C], END, 'the centre');
	// the labels: v beyond its tip, the drag under its arrow, inside the bead; the kicks once, beside the lowest
	const lv = await S.clear('v', av.B[0] + 2.5, av.B[1] - 1, 0, 1, [0.6, -0.8]);
	const ld = await S.clear('\\text{drag, }{-}m\\Gamma v', ad.B[0] + 6, ad.B[1] + DRAG / 2 + LABEL_GAP + 3, 0.5, 0, [0, 1]);
	for (const l of [lv, ld]) {
		const corners = [[l.box.l, l.box.t], [l.box.r, l.box.t], [l.box.l, l.box.b], [l.box.r, l.box.b]];
		check(corners.every(([x, y]) => Math.hypot(x - C[0], y - C[1]) < BIG - LABEL_GAP), `the label ${l.src} leaves the bead`);
	}
	L.push(lv, ld);
	const k = kicks[4];                               // the one from below
	const lk = await placed('\\text{kicks, }F_{\\rm th}', k.c[0] + MOL + LABEL_GAP + 2, k.c[1] + MOL + 1, 0, 0.5, INK);
	L.push(lk);
	// the panel's frame (not drawn): the crowd fills it
	const frame = { l: rightL, r: rightL + rightW, t: top, b: top + H };
	for (const l of L.slice(-1)) check(l.box.r <= frame.r && l.box.b <= frame.b + 8, `the label ${l.src} leaves the right panel`);

	// ---- the crowd: seeded places in the frame, clear of the bead, of every mark and label, and of each other
	const u = uniforms(7);
	const clearOf = (c) => {
		if (c[0] < frame.l + MOL || c[0] > frame.r - MOL || c[1] < frame.t + MOL || c[1] > frame.b - MOL) return false;
		if (Math.hypot(c[0] - C[0], c[1] - C[1]) < BIG + MOL + MOL_GAP) return false;
		const b = { l: c[0] - MOL, r: c[0] + MOL, t: c[1] - MOL, b: c[1] + MOL };
		if (S.clearance(b).d < MOL_GAP - 0.5) return false;
		for (const l of L) { const d = Math.hypot(Math.max(l.box.l - c[0], 0, c[0] - l.box.r), Math.max(l.box.t - c[1], 0, c[1] - l.box.b)); if (d < MOL + LABEL_GAP + 0.5) return false; }
		return true;
	};
	let tries = 0;
	while (mols.length < CROWD + KICK_AT.length && tries < 200000) {
		tries++;
		const c = [frame.l + u() * (frame.r - frame.l), frame.t + u() * (frame.b - frame.t)];
		if (clearOf(c)) molecule(c, `a molecule ${mols.length}`);
	}
	check(mols.length === CROWD + KICK_AT.length, `only ${mols.length} molecules found room`);

	S.checkAll(L);
	window[name + '-numbers'] = { ...n, rms, dist, molecules: mols.length };
	return finish(S, L, [240, 340]);
}
