// The tutorial, chapter 7.5 (tutorial/geometry/gravitomagnetism.md), its third diagram: the two parts of the magnetic
// part on the equator. Above, the Earth as a stone disc seen from above the north pole, its spin L as a ring arrow, the
// pixel as a small ring on the equator at the right with its velocity u (465 m s^-1) in the observer's colour up the
// page. Below, three bars on one axis in units of 10^-12 s^-2, from zero, in the curvature's colour: "the pixel's
// motion" -7.15, pointing left; "the planet's spin" +2.36, pointing right; and a heavier bar, "the reading" -4.79. A
// dotted guide drops from the end of the motion's bar to the reading's row, where the spin's bar, laid in outline at the
// motion's end, fills the gap to the reading's end: the reading is their sum. Thin ticks on the axis under the reading for
// a uniform Earth (-4.29) and a hollow shell (-2.38).
// Departures from the diagram's comment: the Earth stands above the bars, not left of them, so that one drawing about
// 250 points wide keeps its text readable on a phone. The bars' names stand in a column left of the axis and carry the
// factors of eq:earth, "(1)", "(I/MR^2)" and "(1 - I/MR^2)"; the Earth's I/MR^2 = 0.3307 (the chapter's value; the
// comment's 0.331) is printed under the Earth. Each value stands right of its bar's zero end for the bars pointing left
// and right of the end for the bar pointing right, so that none touches a name. The comment's bracket is the spin's bar laid
// in outline at the motion's end, reaching exactly to the reading's end. The ticks for a uniform Earth and a shell rise from the axis,
// in the curvature's colour, named beside them above the axis, clear of the axis's numbers.
// Exact: every bar's length and every printed value (tut-gravitomag-lib.js: the motion -3GM Omega/cR^2 and the spin
// +3GI Omega/cR^4 on the equator, each from its vectors, their sum asserted against eq:earth, the factor 7.15 and the
// three readings -4.79, -4.29 and -2.38); the outline's span equal to the spin's bar (asserted); Omega R = 465 m s^-1;
// the sense of the ring arrow (anticlockwise seen from above the north pole) and u (up the page at the right, the
// ground's motion for that sense: Omega x R). Schematic: the Earth's size, the pixel's ring, the arrows' lengths.
// Pictorial: the stone, a picture from an image model (sprites/hair/ball-face.png, as tut-motion-earths), clipped to its
// exact circle.
import { Sheet, ORIGIN, finish, checker, placed, near, LABEL_GAP, VEC, VEC_HEAD, HAIR, AXIS, TICK } from './tut-pot-lib.js';
import { INK, DIM, PAGE, sprite } from '../lib.js';
import { picture, circle as circlePath } from '../stone.js';
import { STONE_INK } from './tut-orb-lib.js';
import { turning } from './tut-flow-lib.js';
import { chapter, palette, stack, OBS, CURV, cross, OMEGA, R_EARTH, FACTORS } from './tut-gravitomag-lib.js';

const name = 'tut-earth-two-bars';
const check = checker(name);

const LO = -8, HI = 3;                     // the axis, in units of 10^-12 s^-2
const PER = 12;                            // points per unit
const BAR_H = 6.6, READ_H = 9;             // the bars' heights: the reading heavier
const ROW_AIR = 11;                        // between a bar and the next
const NAME_AIR = 5;                        // a name's right end to the axis's left end
const AXIS_AIR = 15;                       // the reading's bar to the axis
const MARK_H = 7.5, MARK_W = 0.6;          // the ticks for a uniform Earth and a shell
const DOT_STEP = 1.6;
const GHOST = 0.55;                        // the outline of the spin's bar laid at the motion's end
const RE = 34;                             // the Earth's radius, points (schematic)
const SPIN_R = RE + 8;                     // the ring arrow's radius
const SPIN_FROM = 118, SPIN_TO = 222;      // degrees, anticlockwise on the page: the ring arrow, on the left
const PIX = 2.6;                           // the pixel's ring
const U_LEN = 26;
const EARTH_AIR = 14;                      // the Earth's labels to the first bar's top

export default async function () {
	const nums = chapter(check);
	await palette(check);
	const S = new Sheet(name);
	const L = [];
	const art = await sprite('/figures3d/sprites/hair/ball-face.png');
	const e = nums.equator;
	const u12 = (v) => v / 1e-12;

	// ---- the rows: names in a column, the bars from zero
	const rows = [
		{ key: 'motion', name: '\\text{the pixel’s motion }(1)', v: u12(e.earth.motion), printed: '-7.15', h: BAR_H, op: 0.75 },
		{ key: 'spin', name: '\\text{the planet’s spin }(I/MR^2)', v: u12(e.earth.spin), printed: '+2.36', h: BAR_H, op: 0.75 },
		{ key: 'reading', name: '\\text{the reading }(1 - I/MR^2)', v: u12(e.earth.sum), printed: '-4.79', h: READ_H, op: 1 }
	];
	for (const r of rows) check((r.v > 0 ? '+' : '') + r.v.toFixed(2) === r.printed, `the ${r.key} bar prints ${r.printed}, not ${r.v.toFixed(2)}`);
	check(near(rows[0].v + rows[1].v, rows[2].v, 1e-12), 'the reading is not the sum');
	const probes = await Promise.all(rows.map((r) => placed(`\\vphantom{(}${r.name}`, 0, 0, 0, 0, INK)));
	const nameW = Math.max(...probes.map((p) => p.box.r - p.box.l));
	const x0 = ORIGIN - 80;                    // the axis's left end
	const X = (v) => x0 + (v - LO) * PER;
	const nameX = x0 - NAME_AIR;
	check(nameX - nameW > ORIGIN - 300, 'the names run off the page');

	// the Earth first, so that the bars sit under it
	const ec = [X((LO + HI) / 2), ORIGIN - 160];
	S.raw(picture(`${name}-earth`, art, ec[0], ec[1], RE, circlePath(ec[0], ec[1], RE)) + `<path d="${circlePath(ec[0], ec[1], RE)}" fill="none" stroke="${STONE_INK}" stroke-width="0.4"/>`, 1);
	S.mark([ec], RE, 'the Earth');
	// the pole at the centre: a small dot
	S.raw(`<circle cx="${ec[0].toFixed(2)}" cy="${ec[1].toFixed(2)}" r="1.1" fill="${STONE_INK}"/>`, 2);
	// the spin: a ring arrow, anticlockwise on the page (seen from above the north pole, L toward the viewer)
	const ring = turning(ec[0], ec[1], SPIN_R, (SPIN_FROM * Math.PI) / 180, (SPIN_TO * Math.PI) / 180, INK, { width: VEC, head: VEC_HEAD });
	S.raw(ring.svg, 3);
	S.mark(ring.pts, VEC / 2, 'the spin');
	S.mark(ring.head, 0, 'the spin\'s head');
	S.arrows.push({ L: ring.len, head: ring.hd, what: 'the spin' });
	{
		const mid = ((SPIN_FROM + SPIN_TO) / 2) * (Math.PI / 180);
		const q = [ec[0] + SPIN_R * Math.cos(mid), ec[1] - SPIN_R * Math.sin(mid)];
		L.push(await placed('\\boldsymbol L', q[0] - VEC / 2 - LABEL_GAP - 1, q[1], 1, 0.5, INK));
	}
	// the pixel on the equator at the right, and its velocity: Omega x r with Omega toward the viewer (z) and r along x
	const ground = cross([0, 0, OMEGA], [R_EARTH, 0, 0]);
	check(near(ground[0], 0) && near(ground[1], OMEGA * R_EARTH, 1e-9) && Math.round(ground[1]) === 465, `the ground's velocity ${ground}`);
	check(SPIN_TO > SPIN_FROM, 'the ring arrow is not anticlockwise');
	const px = [ec[0] + RE, ec[1]];
	S.raw(`<circle cx="${px[0].toFixed(2)}" cy="${px[1].toFixed(2)}" r="${PIX}" fill="${PAGE}" stroke="${INK}" stroke-width="0.6"/>`, 4);
	S.mark([px], PIX + 0.3, 'the pixel');
	const ua = S.arrow([px[0], px[1] - PIX - 1], [px[0], px[1] - PIX - 1 - U_LEN], { color: OBS, width: VEC, head: VEC_HEAD, layer: 4, what: 'u' });
	L.push(await placed(`{\\color{${OBS}}\\boldsymbol u}\\ (${Math.round(OMEGA * R_EARTH)}\\,\\mathrm{m\\,s^{-1}})`, px[0] + VEC / 2 + LABEL_GAP + 1, (ua.A[1] + ua.B[1]) / 2, 0, 0.5, INK));
	L.push(await placed('\\text{the pixel}', px[0] + PIX + LABEL_GAP + 1.2, px[1] + 1, 0, 0, INK));
	check(String(FACTORS.earth) === '0.3307', 'the Earth\'s factor');
	const under = await stack(['\\text{the Earth from above the north pole,}', 'I/MR^2 = 0.3307'], ec[0], ec[1] + RE + LABEL_GAP + 3, 0.5, INK);
	L.push(under);

	// ---- the bars
	let top = under.box.b + EARTH_AIR;
	const drawn = [];
	for (const [k, r] of rows.entries()) {
		const ya = top, yb = top + r.h, a = X(Math.min(0, r.v)), b = X(Math.max(0, r.v));
		S.raw(`<path d="M${a.toFixed(2)},${ya.toFixed(2)}H${b.toFixed(2)}V${yb.toFixed(2)}H${a.toFixed(2)}Z" fill="${CURV}" fill-opacity="${r.op}"/>`, 2);
		S.boxes.push({ box: { l: a, r: b, t: ya, b: yb }, what: `the ${r.key} bar` });
		check(near(b - a, Math.abs(r.v) * PER, 1e-9), `the ${r.key} bar's length`);
		L.push(await placed(`\\vphantom{(}${r.name}`, nameX, (ya + yb) / 2, 1, 0.5, INK));
		// the value: right of the zero end for a bar pointing left, right of the end for one pointing right
		L.push(await placed(r.printed.replace('-', '{-}'), (r.v < 0 ? X(0) : b) + LABEL_GAP + 1, (ya + yb) / 2, 0, 0.5, INK));
		drawn.push({ ...r, ya, yb, a, b });
		top = yb + ROW_AIR;
	}
	// the sum: a dotted guide down from the motion's end to the spin's bar laid there in outline
	{
		const [m, , rd] = drawn;
		const xg = m.a, yc = (rd.ya + rd.yb) / 2;
		const n = Math.round((yc - drawn[1].h / 2 - 1.6 - (m.yb + 1.6)) / DOT_STEP);
		const dots = Array.from({ length: n + 1 }, (_, i) => [xg, m.yb + 1.6 + i * DOT_STEP]);
		S.raw(`<path d="${dots.map(([x, y]) => `M${x.toFixed(2)},${y.toFixed(2)}h0`).join('')}" stroke="${DIM}" stroke-width="0.6" stroke-linecap="round" fill="none"/>`, 1);
		S.mark([dots[0], dots[dots.length - 1]], 0.3, 'the guide');
		// the spin's bar laid at the motion's end, in outline: the reading and it make up the motion's bar
		const sp = drawn[1], o = GHOST / 2, gy0 = yc - sp.h / 2, gy1 = yc + sp.h / 2;
		S.path([[xg + o, gy0 + o], [rd.a - o, gy0 + o], [rd.a - o, gy1 - o], [xg + o, gy1 - o]], { color: CURV, width: GHOST, closed: true, cap: 'butt', layer: 3, what: 'the spin laid at the motion\'s end' });
		check(near(rd.a - xg, drawn[1].b - drawn[1].a, 1e-9), `the outline spans ${rd.a - xg}, not the spin's bar ${drawn[1].b - drawn[1].a}`);
	}

	// ---- the axis: -8 to +3, a tick each unit, numbers every two
	const yA = top - ROW_AIR + AXIS_AIR;
	S.path([[X(LO), yA], [X(HI), yA]], { color: INK, width: AXIS, cap: 'butt', what: 'the axis' });
	let bottom = yA;
	for (let v = LO; v <= HI; v++) {
		const major = v % 2 === 0;
		S.path([[X(v), yA], [X(v), yA + (major ? TICK : 1.6)]], { color: INK, width: HAIR, cap: 'butt', what: `the tick at ${v}` });
		if (major) {
			const lab = await placed(v < 0 ? `{-}${-v}` : `${v}`, X(v), yA + TICK + LABEL_GAP + 0.2, 0.5, 0, INK);
			L.push(lab);
			bottom = Math.max(bottom, lab.box.b);
		}
	}
	// the zero line through the bars
	S.path([[X(0), drawn[0].ya - 2], [X(0), drawn[2].yb + 2]], { color: DIM, width: HAIR, cap: 'butt', layer: 1, what: 'the zero line' });
	// the ticks for a uniform Earth and a shell, rising from the axis
	for (const [key, side, word] of [['uniform', -1, 'uniform'], ['shell', 1, 'shell']]) {
		const v = u12(e[key].sum), x = X(v);
		const printed = v.toFixed(2);
		check(printed === (key === 'uniform' ? '-4.29' : '-2.38'), `the ${key} tick at ${printed}`);
		S.path([[x, yA - AXIS / 2], [x, yA - MARK_H]], { color: CURV, width: MARK_W, cap: 'butt', layer: 2, what: `the ${key} tick` });
		L.push(await placed(`\\text{${word} }${printed.replace('-', '{-}')}`, x + side * (MARK_W / 2 + LABEL_GAP + 0.5), yA - AXIS / 2 - LABEL_GAP - 0.4, side < 0 ? 1 : 0, 1, INK));
	}
	L.push(await placed('\\mathcal B_{xz}\\text{ on the equator, in }10^{-12}\\,\\mathrm{s^{-2}}', (X(LO) + X(HI)) / 2, bottom + 3.6, 0.5, 0, INK));

	S.checkAll(L);
	window[name + '-numbers'] = { ...nums, rows: drawn.map(({ key, v }) => ({ key, v })) };
	return finish(S, L, [220, 300]);
}
