// The tutorial's Part 10, its hero (tutorial/glow/black-body.md, chapter 10.1, and the heads of 10.2 and 10.3): the
// paper's closed furnace, cut open. The hot furnace of the paper's fig:closed-furnace and of the scene-closed-furnace
// interactive (scenes/closed-furnace.scene.json, its sizes read and asserted here): a steel box 0.9 m wide, 1.0 m tall
// and 0.9 m deep with walls 5 cm thick, holding a block of iron 0.5 by 0.4 by 0.5 m at 1500 K. One flat cut, a plane
// across the width that runs from the front at 0.45 m up to the top 0.15 m behind the centre, takes away the top of the
// front wall and the front of the top, so that the open cavity faces the viewer and the cut faces of the steel frame
// it; the lower front wall stands, and the lower part of the block glows through it, its hidden outline dashed. One
// picture holds three things: the enclosure (10.1), with one of its lowest standing waves drawn on its inner walls; the
// glow of the iron in gravity (10.2); and, in the glow's strength, the friction that sets it (10.3): per metre of
// matter the hot iron sends 26.2 times as many gravitons as the cold steel, so the steel all but vanishes in the glow.
// No text. No orange or blue: the glow is matter's light gold, #f1dc86 (--q-matter in the site's dark theme, and the
// gold of 10.3's frictions, figs/tut-glow-lib.js FILL); the rest is the stone, neutral, and its fixed dark ink.
// Exact: the furnace's, the cavity's and the block's sizes and places, from the scene; the glow, at each point of the
// picture the expected number radiance of the paper's eq:column along the line of sight (orthographic; the matter is
// optically thin), the chord through the hot iron times its number emissivity plus the chords through the steel times
// theirs, in the ratio (0.000213 / 0.00109) (1500 / 293)^3 = 26.2 per metre (the scene's frictions, constant in
// frequency, so that the count grows as friction times T^3; asserted against 10.3's 26.2), on a linear scale, through
// the furnace as drawn (what the cut takes away would add at most 1.3% of the brightest glow, at grazing lines of sight;
// asserted under 1.5%); the standing wave, sin(pi X / a) sin(pi Y / b) sin(2 pi Z / c) of the cavity (0.8 by 0.9 by
// 0.8 m) for a wave held to zero at its walls, 451 MHz: with (2, 1, 1) it is the pair of equal frequency that comes third
// and fourth, after (1, 1, 1) and (1, 2, 1) (asserted). On each inner wall it is drawn as its derivative along the wall's
// inward normal, on one scale for every wall (largest on the back wall, half that on the side walls, 0.44 on the floor
// and the ceiling): a wash that lifts the stone toward white in proportion to its size (WASH at the largest, none at the
// nodes), its nodal lines dotted (the plane Z = c/2, on the side wall), and its contours at 0.25, 0.55 and 0.85 of the
// largest, solid where it is positive and dashed where negative, the curves themselves (asserted on their levels to
// 1e-9). Seen are the back wall (one lobe, three contours) and the right wall (two lobes of opposite sign, one contour
// each, the node between); the floor lies behind the front wall and the block. Checked: no line of the wave runs within
// 3 pt of an edge or of the block's hidden outline away from its ends, and none is a stub; the cut leaves the block and
// the rails whole; the picture fills the furnace's outline and nothing outside it.
// Schematic: the view, the cut, the two steel rails the block rests on (the scene leaves 5 cm of air under it; their
// glow is computed with the rest), the glow's share at its brightest (GLOW_A), the wash's strength and the contours'
// levels. Pictorial: the stone (figures3d/sprites/slab.jpg, the sandstone of tut-evan-hero and tut-fourier-hero), its
// grain GRAIN times its own, coloured stone.js's STEEL lifted toward white for the steel and IRON for the block, each
// face lit by the studio of lib.js (key, wrap and fill, so that the top, the two outer faces, the cut and the inner walls
// take distinct tones); the glow added to the picture as light is (each channel 1 - (1 - c)(1 - a g), a its share).
// Style references, not marks: design/candidates/tut-glow-hero/ (two runs).
import { Sheet, ORIGIN, finish, checker, n2, near } from './tut-pot-lib.js';
import { sprite } from '../lib.js';
import { STEEL, IRON } from '../stone.js';
import { STONE_INK } from './tut-orb-lib.js';

const name = 'tut-glow-hero';
const check = checker(name);

// ---- the view -------------------------------------------------------------------------------------------------------
const TURN = -25;                         // degrees: the viewer stands this far round to the furnace's left
const TILT = 33;                          // degrees: and looks down from this far above the horizon
const SCALE = 225;                        // points per metre
// ---- the cut, the rails ---------------------------------------------------------------------------------------------
const CUT = { front: 0.45, back: -0.15 };   // one plane: through the front's outer face at
                                          // the height `front`, and through the top's upper face at the depth `back`
const RAIL = { x: 0.16, w: 0.06, inset: 0.03 };   // the two rails: centres at x = +-0.16, 6 cm wide, 3 cm in from the block's faces
// ---- the mode -------------------------------------------------------------------------------------------------------
const MODE = [1, 1, 2];                   // the mode: half-waves across the width, the height and the depth (see `modes`)
const LEVELS = [0.25, 0.55, 0.85];        // its contours, as fractions of its largest value on any wall, of either sign
const WASH = 0.5;                         // the walls lifted toward white by this share where the mode is largest
// ---- the marks, points ----------------------------------------------------------------------------------------------
const EDGE = 0.45;                        // the stone's edges
const HIDDEN = { w: 0.45, a: 0.85, dash: [1.6, 1.2] };   // the block's outline behind the steel
const NODE = { w: 1, a: 0.8, step: 2.2, trim: 1.1 };      // the nodal lines, dotted
const CONTOUR = { w: 0.55, a: 0.75, dash: [2.4, 1.5] };   // the contours: solid where the mode is positive, dashed where negative
const CLEAR = 3, ENDS = 6, MIN_RUN = 4;   // a line of the mode stays this clear of every edge, but within ENDS of its ends,
                                          // and no piece of one is shorter than MIN_RUN
const GLOW = '#f1dc86', GLOW_A = 0.8;     // the glow's colour, and its share at the brightest point
// ---- the picture ----------------------------------------------------------------------------------------------------
const K = 5, SS = 3;                      // pixels per point, samples per pixel along each side
const LIFT = 0.3;                         // the steel is lifted this far toward white
const TEX = 3600;                         // the stone's pixels per metre
const GRAIN = 2.5;                        // the stone's own variation of brightness, this many times over

const KEY = unit([-0.55, 0.72, 0.62]), FILL = unit([0.85, -0.15, 0.5]);
function unit(v) { const l = Math.hypot(...v); return v.map((x) => x / l); }
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const rad = (d) => (d * Math.PI) / 180;
const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);

/** The chapters' numbers, asserted against their text and the scene. */
async function chapter() {
	const text = async (url) => (await (await fetch(url)).text()).replace(/<!--[\s\S]*?-->/g, ' ').replace(/\s+/g, ' ');
	const [bb, kh, wm] = await Promise.all(['black-body', 'kirchhoff', 'why-matter-barely-glows'].map((s) => text(`/tutorial/glow/${s}.md`)));
	const has = (md, s, what) => check(md.includes(s), `the chapter does not say ${what}: ${s}`);
	has(bb, 'each holding an identical block of iron, one at 293 K, room temperature, and the other at 1500 K', 'the two blocks');
	has(bb, 'A closed box whose walls are at one temperature fills with a glow that depends only on that temperature', 'the enclosure');
	has(kh, 'Two closed steel furnaces stand in a room at 293 K', 'the furnaces');
	has(wm, 'sends $(1500/293)^2 = 26.2$ times as many gravitons as the cold', 'the 26.2');
	const scene = await (await fetch('/scenes/closed-furnace.scene.json')).json();
	const obj = (id) => scene.objects.find((o) => o.id === id);
	const box = obj('furnace-right'), lining = obj('furnace-right-lining'), charge = obj('furnace-right-charge');
	const m = scene.materials;
	check(box.material === 'steel' && lining.material === 'air' && charge.material === 'hot-iron', 'the hot furnace\'s materials');
	check(m['hot-iron'].temperature === 1500 && m.steel.temperature === 293, 'the temperatures');
	// relative to the furnace's centre on the floor
	const span = (o) => [0, 1, 2].map((i) => {
		const c = o.shape.center[i] - box.shape.center[i] + (i === 1 ? box.shape.size[1] / 2 : 0);
		return [c - o.shape.size[i] / 2, c + o.shape.size[i] / 2];
	});
	const outer = span(box), cavity = span(lining), block = span(charge);
	const same = (a, b) => a.every((r, i) => near(r[0], b[i][0], 1e-12) && near(r[1], b[i][1], 1e-12));
	check(same(outer, [[-0.45, 0.45], [0, 1], [-0.45, 0.45]]), `the furnace ${JSON.stringify(outer)}`);
	check(same(cavity, [[-0.4, 0.4], [0.05, 0.95], [-0.4, 0.4]]), `the cavity ${JSON.stringify(cavity)}`);
	check(same(block, [[-0.25, 0.25], [0.1, 0.5], [-0.25, 0.25]]), `the block ${JSON.stringify(block)}`);
	// the number emissivity of a constant friction grows as friction times T^3 (10.1, "The furnace")
	const e = (k) => m[k].friction * m[k].temperature ** 3;
	const ratio = e('hot-iron') / e('steel');
	check(ratio.toFixed(1) === '26.2' && Math.abs(ratio - (1500 / 293) ** 2) < 0.02, `the hot iron outshines the steel ${ratio} times per metre`);
	return { outer, cavity, block, ratio };
}

/** The standing modes of the cavity (sides Lc) for a wave held to zero at its walls, sin(l pi X / a) sin(m pi Y / b)
 * sin(n pi Z / c) with l, m, n >= 1, in the order of their frequencies, omega = c pi sqrt((l/a)^2 + (m/b)^2 + (n/c)^2). */
function modes(Lc, top = 4) {
	const out = [];
	for (let l = 1; l <= top; l++) for (let m = 1; m <= top; m++) for (let n = 1; n <= top; n++) {
		const k2 = (l / Lc[0]) ** 2 + (m / Lc[1]) ** 2 + (n / Lc[2]) ** 2;
		out.push({ lmn: [l, m, n], k2, hz: (299792458 / 2) * Math.sqrt(k2) });
	}
	return out.sort((a, b) => a.k2 - b.k2);
}

// ---- solids: a box, cut by a half-space n . p <= c or not -------------------------------------------------------------
const within = (s, p) => s.b.every(([lo, hi], i) => p[i] > lo && p[i] < hi) && (!s.h || dot(s.h.n, p) < s.h.c);
/** The interval of the line p + t d inside the solid s, with the outward normal where it enters, or null. */
function through(s, p, d) {
	let t0 = -Infinity, t1 = Infinity, n0 = null;
	for (let i = 0; i < 3; i++) {
		if (d[i] === 0) { if (p[i] <= s.b[i][0] || p[i] >= s.b[i][1]) return null; continue; }
		const u = (s.b[i][0] - p[i]) / d[i], v = (s.b[i][1] - p[i]) / d[i];
		const lo = Math.min(u, v), hi = Math.max(u, v);
		if (lo > t0) { t0 = lo; n0 = [0, 0, 0]; n0[i] = -Math.sign(d[i]); }
		if (hi < t1) t1 = hi;
	}
	if (s.h) {
		const nd = dot(s.h.n, d), room = s.h.c - dot(s.h.n, p);
		if (Math.abs(nd) < 1e-15) { if (room <= 0) return null; }
		else if (nd > 0) t1 = Math.min(t1, room / nd);
		else if (room / nd > t0) { t0 = room / nd; n0 = s.h.n; }
	}
	return t0 < t1 ? { t0, t1, n: n0 } : null;
}

export default async function () {
	const nums = await chapter();
	const S = new Sheet(name);
	let defs = '';

	// ---- the closed furnace: six steel slabs that do not overlap, two rails, the block; then one cut, a plane
	const [[X0, X1], [Y0, Y1], [Z0, Z1]] = nums.outer;
	const [[x0, x1], [y0, y1], [z0, z1]] = nums.cavity;
	const blk = nums.block;
	// the plane through (y, z) = (CUT.front, Z1) and (Y1, CUT.back): the steel keeps n . p <= c, below and behind it
	const along = unit([0, Y1 - CUT.front, CUT.back - Z1]);
	const plane = { n: [0, -along[2], along[1]], c: 0 };
	plane.c = dot(plane.n, [0, CUT.front, Z1]);
	check(plane.n[1] > 0 && plane.n[2] > 0 && near(dot(plane.n, [0, Y1, CUT.back]), plane.c, 1e-12), 'the cut is not the plane meant');
	const slabs = [
		[[X0, X1], [Y0, y0], [Z0, Z1]], [[X0, X1], [y1, Y1], [Z0, Z1]],
		[[X0, X1], [y0, y1], [Z0, z0]], [[X0, X1], [y0, y1], [z1, Z1]],
		[[X0, x0], [y0, y1], [z0, z1]], [[x1, X1], [y0, y1], [z0, z1]]
	];
	const rails = [-1, 1].map((s) => [[s * RAIL.x - RAIL.w / 2, s * RAIL.x + RAIL.w / 2], [y0, blk[1][0]], [blk[2][0] + RAIL.inset, blk[2][1] - RAIL.inset]]);
	const corners = (b) => b[0].flatMap((x) => b[1].flatMap((y) => b[2].map((z) => [x, y, z])));
	// the cut leaves the block and the rails whole, with room
	for (const b of [blk, ...rails]) check(corners(b).every((p) => dot(plane.n, p) < plane.c - 0.03), 'the cut reaches the block or a rail');
	const steel = [...slabs.map((b) => ({ b, h: plane })), ...rails.map((b) => ({ b, h: null }))].map((s) => ({ ...s, color: STEEL, e: 1 }));
	const iron = { b: blk, h: null, color: IRON, e: nums.ratio };
	const solids = [...steel, iron];
	// what the cut takes away, to show that the glow of the drawn furnace is that of the closed one to within 1.5% of its brightest
	const cutAway = slabs.map((b) => ({ b, h: { n: plane.n.map((v) => -v), c: -plane.c } }));
	// the cut takes away the top of the front wall: what is left of it stands in front of the block's lower part
	check(CUT.front > blk[1][0] + 0.15 && CUT.front < blk[1][1], 'the front wall left does not hide the block\'s lower part');

	// ---- the camera: right-handed axes (right, up, toward the viewer)
	const Dv = [Math.sin(rad(TURN)) * Math.cos(rad(TILT)), Math.sin(rad(TILT)), Math.cos(rad(TURN)) * Math.cos(rad(TILT))];
	const Rv = unit(cross([0, 1, 0], Dv)), Uv = cross(Dv, Rv);
	check(near(dot(cross(Rv, Uv), Dv), 1, 1e-12), 'the camera\'s axes are not right-handed');
	const C0 = [0, (Y0 + Y1) / 2, 0];
	const P = (p) => { const q = p.map((v, i) => v - C0[i]); return [ORIGIN + SCALE * dot(q, Rv), ORIGIN - SCALE * dot(q, Uv)]; };
	const back = (X, Y) => {
		const a = (X - ORIGIN) / SCALE, b = (ORIGIN - Y) / SCALE;
		return [0, 1, 2].map((i) => C0[i] + a * Rv[i] + b * Uv[i]);
	};
	/** Whether a point of a surface is seen past the solids `among`: none of them lies between it and the viewer. */
	const clear = (among) => (p) => among.every((s) => { const h = through(s, p, Dv); return !h || h.t1 <= 1e-9 || h.t1 - Math.max(h.t0, 0) <= 1e-9; });
	const seen = clear(solids);

	// ---- the mode on the inner walls: its derivative along each wall's inward normal, on one scale for every wall
	const Lc = nums.cavity.map(([a, b]) => b - a);
	const list = modes(Lc);
	const at = list.findIndex((q) => q.lmn.join() === MODE.join());
	const twin = [MODE[2], MODE[1], MODE[0]];
	// the mode drawn and its twin (the cavity is as deep as it is wide) are the third and fourth of the box's modes, a
	// pair of equal frequency, after (1, 1, 1), which has no node inside, and (1, 2, 1)
	check(list.slice(0, 2).map((q) => q.lmn.join(' ')).join(', ') === '1 1 1, 1 2 1', 'the two lowest modes are not (1, 1, 1) and (1, 2, 1)');
	check([2, 3].includes(at) && [list[2], list[3]].some((q) => q.lmn.join() === twin.join()) && near(list[2].k2, list[3].k2, 1e-12), `the mode drawn is number ${at + 1}, not one of a pair third and fourth`);
	check(list[4].k2 > list[3].k2 * 1.2, 'the fifth mode is not well above the pair');
	const kmax = Math.max(...[0, 1, 2].map((i) => MODE[i] / Lc[i]));
	/** The six inner walls: the axis of the normal, which side, the pattern's sign and size there. */
	const walls = [];
	for (let i = 0; i < 3; i++) for (const hi of [false, true]) walls.push({ i, hi, amp: (MODE[i] / Lc[i] / kmax) * (hi ? (-1) ** (MODE[i] + 1) : 1) });
	const pattern = (w, X) => { let s = w.amp; for (let j = 0; j < 3; j++) if (j !== w.i) s *= Math.sin((MODE[j] * Math.PI * X[j]) / Lc[j]); return s; };
	/** The pattern at a point of the stone, if the point lies on an inner wall and the normal there points into the cavity. */
	const waveAt = (p, n) => {
		const X = p.map((v, q) => v - nums.cavity[q][0]);
		if (X.some((v, q) => v < -1e-9 || v > Lc[q] + 1e-9)) return 0;
		const i = n.findIndex((v) => Math.abs(v) === 1);
		if (i < 0) return 0;
		const wl = walls.find((w) => w.i === i && (w.hi ? n[i] < 0 && Math.abs(X[i] - Lc[i]) < 1e-9 : n[i] > 0 && Math.abs(X[i]) < 1e-9));
		return wl ? pattern(wl, X) : 0;
	};

	// ---- the outline: the cut furnace's outer box less the cut is convex, and everything lies inside it
	const hullPts = [];
	for (const p of corners(nums.outer)) if (dot(plane.n, p) <= plane.c + 1e-12) hullPts.push(p);
	for (const [A, B] of boxEdges(nums.outer)) {
		const fa = dot(plane.n, A) - plane.c, fb = dot(plane.n, B) - plane.c;
		if (fa * fb < 0) hullPts.push(A.map((v, i) => v + ((B[i] - v) * fa) / (fa - fb)));
	}
	const hull = convexHull(hullPts.map(P));
	const verts = hull;
	const L = Math.min(...verts.map((q) => q[0])) - 1, T = Math.min(...verts.map((q) => q[1])) - 1;
	const W = Math.max(...verts.map((q) => q[0])) + 1 - L, H = Math.max(...verts.map((q) => q[1])) + 1 - T;

	// ---- the stone, the mode's wash and the glow, ray by ray
	const stone = await texture('/figures3d/sprites/slab.jpg');
	const key = (n) => { const m = [dot(n, Rv), dot(n, Uv), dot(n, Dv)]; return 0.3 + 0.8 * Math.max(0, (dot(m, KEY) + 0.3) / 1.3) + 0.14 * Math.max(0, dot(m, FILL)); };
	const faceUV = (n, p) => (Math.abs(n[2]) === 1 ? [p[0], p[1]] : Math.abs(n[1]) === 1 ? [p[0] + 3.1, p[2] + 1.7] : Math.abs(n[0]) === 1 ? [p[2] + 5.3, p[1] + 0.4] : [p[0] + 1.9, dot(p, along) + 2.6]);
	const tint = { [STEEL]: rgb(STEEL).map((v) => v + (1 - v) * LIFT), [IRON]: rgb(IRON) };
	const w = Math.ceil(W * K), h = Math.ceil(H * K);
	const art = new ImageData(w, h), light = new Float64Array(3 * w * h), cover = new Float64Array(w * h);
	const glowRGB = rgb(GLOW);
	const column = new Float64Array(w * h);
	let peak = 0, extra = 0;
	for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
		let A = 0, N = 0; const C = [0, 0, 0];
		for (let u = 0; u < SS; u++) for (let v = 0; v < SS; v++) {
			const X = L + (i + (u + 0.5) / SS) / K, Y = T + (j + (v + 0.5) / SS) / K;
			const o = back(X, Y).map((x, q) => x + 5 * Dv[q]), d = Dv.map((x) => -x);
			let best = null;
			for (const s of solids) {
				const hit = through(s, o, d);
				if (!hit) continue;
				N += s.e * (hit.t1 - hit.t0);
				if (!best || hit.t0 < best.hit.t0) best = { hit, s };
			}
			let more = 0;
			for (const s of cutAway) { const hit = through(s, o, d); if (hit) more += hit.t1 - hit.t0; }
			extra = Math.max(extra, more);
			if (!best) continue;
			const p = o.map((x, q) => x + best.hit.t0 * d[q]), n = best.hit.n;
			const [tu, tv] = faceUV(n, p);
			const g = 1 + GRAIN * (stone.at(tu * TEX, tv * TEX) - 1);
			const lit = key(n), c = tint[best.s.color];
			const lift = best.s.color === STEEL ? WASH * Math.abs(waveAt(p, n)) : 0;
			for (let q = 0; q < 3; q++) { const base = Math.min(1, c[q] * g * lit); C[q] += base + (1 - base) * lift; }
			A += 1;
		}
		const k = (j * w + i) * 4, n = SS * SS;
		// where no ray meets the stone, the steel's own colour, so that the JPEG has no dark fringe under the outline's clip
		for (let q = 0; q < 3; q++) light[3 * (j * w + i) + q] = A ? C[q] / A : tint[STEEL][q];
		cover[j * w + i] = A / n;
		art.data[k + 3] = 255;
		column[j * w + i] = N / n;
		peak = Math.max(peak, N / n);
	}
	check(extra < 0.015 * peak, `the cut-away steel would add ${(100 * extra / peak).toFixed(2)}% of the brightest glow`);
	// the glow, added to the picture as light is: each channel 1 - (1 - c)(1 - a g), a = GLOW_A N / N_max
	for (let k = 0; k < w * h; k++) {
		const a = (GLOW_A * column[k]) / peak;
		for (let q = 0; q < 3; q++) art.data[4 * k + q] = Math.round(255 * (1 - (1 - light[3 * k + q]) * (1 - a * glowRGB[q])));
	}
	// the picture as a JPEG, clipped to the outline; the rays fill it (asserted, half a point in from its edge) and nothing outside
	const hullSign = Math.sign((hull[1][0] - hull[0][0]) * (hull[2][1] - hull[0][1]) - (hull[1][1] - hull[0][1]) * (hull[2][0] - hull[0][0])) < 0 ? 1 : -1;
	const inHull = (q, m) => hull.every((a, i) => {
		const b = hull[(i + 1) % hull.length], e = [b[0] - a[0], b[1] - a[1]];
		return (((q[0] - a[0]) * e[1] - (q[1] - a[1]) * e[0]) / Math.hypot(...e)) * hullSign >= m;
	});
	for (const s of solids) check(corners(s.b).filter((p) => !s.h || dot(s.h.n, p) <= s.h.c).every((p) => inHull(P(p), -1e-6)), 'a corner lies outside the outline');
	for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
		const q = [L + (i + 0.5) / K, T + (j + 0.5) / K], c = cover[j * w + i];
		if (inHull(q, 0.5)) check(c === 1, `the picture does not fill the outline at ${q.map((v) => v.toFixed(1))}`);
		if (!inHull(q, -0.5)) check(c === 0, `the picture reaches past the outline at ${q.map((v) => v.toFixed(1))}`);
	}
	const hullD = `M${hull.map(([x, y]) => `${n2(x)},${n2(y)}`).join('L')}Z`;
	defs += `<clipPath id="${name}-outline"><path d="${hullD}"/></clipPath>`;
	const jpeg = (() => { const c = document.createElement('canvas'); c.width = w; c.height = h; c.getContext('2d').putImageData(art, 0, 0); return c.toDataURL('image/jpeg', 0.9); })();
	S.raw(`<image class="art" href="${jpeg}" x="${n2(L)}" y="${n2(T)}" width="${n2(w / K)}" height="${n2(h / K)}" preserveAspectRatio="none" clip-path="url(#${name}-outline)"/>`, 1);

	// ---- the edges: every crease of the steel and of the block, where it is seen
	// candidates: each solid's box edges, kept where the cut leaves them, and the lines where the cut meets its faces
	const candidates = (s) => {
		const out = [];
		for (const [A, B] of boxEdges(s.b)) {
			if (!s.h) { out.push([A, B]); continue; }
			const fa = dot(s.h.n, A) - s.h.c, fb = dot(s.h.n, B) - s.h.c;
			if (fa <= 0 && fb <= 0) out.push([A, B]);
			else if (fa < 0 || fb < 0) { const M = A.map((v, i) => v + ((B[i] - v) * fa) / (fa - fb)); out.push(fa < 0 ? [A, M] : [M, B]); }
		}
		if (s.h) for (let i = 0; i < 3; i++) for (const v of s.b[i]) {
			const pts = [];
			for (const [A, B] of boxEdges(s.b)) {
				if (A[i] !== v || B[i] !== v) continue;
				const fa = dot(s.h.n, A) - s.h.c, fb = dot(s.h.n, B) - s.h.c;
				if (fa * fb < 0) pts.push(A.map((x, q) => x + ((B[q] - x) * fa) / (fa - fb)));
			}
			if (pts.length === 2) out.push(pts);
		}
		return out;
	};
	/** Whether the point lies on a crease of the group: sixteen probes round the line are not half filled. */
	const crease = (group, A, B) => {
		const t = unit(B.map((v, i) => v - A[i]));
		const u = unit(cross(t, Math.abs(t[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0])), v = cross(t, u);
		const probes = Array.from({ length: 16 }, (_, k) => { const a = (2 * Math.PI * (k + 0.5)) / 16 + 0.1; return u.map((x, i) => 1e-5 * (Math.cos(a) * x + Math.sin(a) * v[i])); });
		return (p) => { const f = probes.filter((o) => group.some((s) => within(s, p.map((x, i) => x + o[i])))).length; return f !== 8 && f !== 0 && f !== 16; };
	};
	let d = '';
	const done = new Set();
	for (const group of [steel, [iron]]) for (const s of group) for (const [A, B] of candidates(s)) {
		const id = [A, B].map((p) => p.map((x) => x.toFixed(6)).join(',')).sort().join(';');
		if (done.has(id)) continue;
		done.add(id);
		const isCrease = crease(group, A, B);
		for (const run of seenRuns(A, B, (p) => isCrease(p) && seen(p), P)) {
			const [a, b] = run.map(P);
			d += `M${n2(a[0])},${n2(a[1])}L${n2(b[0])},${n2(b[1])}`;
			S.mark([a, b], EDGE / 2, 'an edge');
		}
	}
	// the block's outline where the steel hides it and its glow shows through: dashed
	let dd = '';
	{
		const own = clear([iron]), steelOnly = clear(steel);
		for (const [A, B] of boxEdges(iron.b)) for (const run of seenRuns(A, B, (p) => own(p) && !steelOnly(p), P)) {
			const [a, b] = run.map(P);
			dd += `M${n2(a[0])},${n2(a[1])}L${n2(b[0])},${n2(b[1])}`;
			S.mark([a, b], HIDDEN.w / 2, 'the block behind the steel');
		}
		check(dd !== '', 'no part of the block is hidden by the steel');
	}

	// ---- the mode's lines on the inner walls, where the steel is left and the wall is seen
	const steelAt = (p) => steel.some((s) => within(s, p));
	const onWall = (wl, X) => {
		const p = X.map((v, q) => v + nums.cavity[q][0]);
		const out = [0, 0, 0]; out[wl.i] = wl.hi ? 1 : -1;       // toward the steel
		return { p, solid: steelAt(p.map((v, q) => v + 1e-6 * out[q])), lift: p.map((v, q) => v - 1e-7 * out[q]) };
	};
	const runs = [];
	const drawCurve = (wl, Xs, kind) => {
		let run = [];
		const flush = () => {
			if (run.length > 1) {
				let pts = run.map(P);
				if (kind === 'node') pts = trim(pts, NODE.trim);
				if (pts.length > 1) runs.push({ kind, pts: thin(pts) });
			}
			run = [];
		};
		for (const X of Xs) {
			const q = onWall(wl, X);
			if (q.solid && seen(q.lift)) run.push(q.p); else flush();
		}
		flush();
	};
	for (const wl of walls) {
		const [a, b] = [0, 1, 2].filter((j) => j !== wl.i);
		const X = (u, v) => { const r = [0, 0, 0]; r[wl.i] = wl.hi ? Lc[wl.i] : 0; r[a] = u; r[b] = v; return r; };
		const da = Lc[a] / MODE[a], db = Lc[b] / MODE[b];
		const N = 1600;
		for (let j = 1; j < MODE[a]; j++) check(near(pattern(wl, X(j * da, Lc[b] / 3)), 0, 1e-12), 'a nodal line is not a node');
		for (let j = 1; j < MODE[b]; j++) check(near(pattern(wl, X(Lc[a] / 3, j * db)), 0, 1e-12), 'a nodal line is not a node');
		for (let j = 1; j < MODE[a]; j++) drawCurve(wl, Array.from({ length: N + 1 }, (_, k) => X(j * da, (Lc[b] * k) / N)), 'node');
		for (let j = 1; j < MODE[b]; j++) drawCurve(wl, Array.from({ length: N + 1 }, (_, k) => X((Lc[a] * k) / N, j * db)), 'node');
		// the contours in each lobe, |pattern| = level: sin U sin V = level / |amp|, solid in the lobes of positive sign
		for (const level of LEVELS) {
			const s = level / Math.abs(wl.amp);
			if (s >= 1) continue;
			for (let ja = 0; ja < MODE[a]; ja++) for (let jb = 0; jb < MODE[b]; jb++) {
				const sign = Math.sign(wl.amp) * (-1) ** (ja + jb);
				const loop = [];
				const M = 800;
				// four arcs: sin U = s^((1 + t)/2), sin V = s^((1 - t)/2), U and V each on either side of pi/2
				const arc = (fu, fv, rev) => {
					for (let k = 0; k <= M; k++) {
						const t = -1 + (2 * (rev ? M - k : k)) / M;
						const U0 = Math.asin(s ** ((1 + t) / 2)), V0 = Math.asin(s ** ((1 - t) / 2));
						const U = fu ? Math.PI - U0 : U0, V = fv ? Math.PI - V0 : V0;
						loop.push(X(ja * da + (U / Math.PI) * da, jb * db + (V / Math.PI) * db));
					}
				};
				arc(false, false, false); arc(false, true, true); arc(true, true, false); arc(true, false, true);
				loop.push(loop[0]);
				check(loop.every((Xp) => near(pattern(wl, Xp), sign * level, 1e-9)), `a contour at ${sign * level} is off its level`);
				drawCurve(wl, loop, sign > 0 ? 'positive' : 'negative');
			}
		}
	}
	// none runs along an edge: away from its ends, each stays CLEAR from every edge; none is a stub
	const edgeMarks = S.marks.filter((m) => m.what === 'an edge' || m.what === 'the block behind the steel');
	for (const r of runs) {
		const len = [0];
		for (let i = 1; i < r.pts.length; i++) len.push(len[i - 1] + Math.hypot(r.pts[i][0] - r.pts[i - 1][0], r.pts[i][1] - r.pts[i - 1][1]));
		const total = len[len.length - 1];
		check(total >= MIN_RUN, `a ${r.kind} line of the mode is a stub ${total.toFixed(2)} pt long, at ${r.pts[0].map((v) => v.toFixed(1))}`);
		let least = Infinity;
		r.pts.forEach((q, i) => {
			if (len[i] < ENDS || total - len[i] < ENDS) return;
			for (const m of edgeMarks) least = Math.min(least, toSegment(q, m.pts[0], m.pts[1]) - m.r);
		});
		check(least >= CLEAR, `a ${r.kind} line of the mode runs ${least.toFixed(2)} pt from an edge, at ${r.pts[0].map((v) => v.toFixed(1))}`);
		S.mark(r.pts, (r.kind === 'node' ? NODE.w : CONTOUR.w) / 2, `the mode's ${r.kind} line`);
	}
	const pathOf = (kind) => runs.filter((r) => r.kind === kind).map((r) => 'M' + r.pts.map(([x, y]) => `${n2(x)},${n2(y)}`).join('L')).join('');
	S.raw(`<path d="${pathOf('positive')}" fill="none" stroke="${STONE_INK}" stroke-width="${CONTOUR.w}" stroke-opacity="${CONTOUR.a}" stroke-linecap="round" stroke-linejoin="round"/>`, 2);
	S.raw(`<path d="${pathOf('negative')}" fill="none" stroke="${STONE_INK}" stroke-width="${CONTOUR.w}" stroke-opacity="${CONTOUR.a}" stroke-dasharray="${CONTOUR.dash.join(' ')}" stroke-linecap="butt" stroke-linejoin="round"/>`, 2);
	S.raw(`<path d="${pathOf('node')}" fill="none" stroke="${STONE_INK}" stroke-width="${NODE.w}" stroke-opacity="${NODE.a}" stroke-dasharray="0 ${NODE.step}" stroke-linecap="round" stroke-linejoin="round"/>`, 2.1);
	S.raw(`<path d="${d}" fill="none" stroke="${STONE_INK}" stroke-width="${EDGE}" stroke-linecap="round" stroke-linejoin="round"/>`, 5);
	S.raw(`<path d="${dd}" fill="none" stroke="${STONE_INK}" stroke-width="${HIDDEN.w}" stroke-opacity="${HIDDEN.a}" stroke-dasharray="${HIDDEN.dash.join(' ')}" stroke-linecap="butt"/>`, 5.1);

	S.checkAll([]);
	window[name + '-numbers'] = {
		ratio: nums.ratio, peak, cutAway: extra / peak, mode: at + 1, twin: list.findIndex((q) => q.lmn.join() === twin.join()) + 1,
		amps: walls.map((wl) => wl.amp.toFixed(3)), modes: list.slice(0, 8).map((q) => `${q.lmn.join('')} ${(q.hz / 1e6).toFixed(0)} MHz`)
	};
	return finish(S, [], [240, 340], defs);
}

/** The twelve edges of a box, as pairs of points. */
function boxEdges(b) {
	const out = [];
	for (let a = 0; a < 3; a++) {
		const [p, q] = [0, 1, 2].filter((i) => i !== a);
		for (const s of b[p]) for (const t of b[q]) {
			const A = [0, 0, 0], B = [0, 0, 0];
			A[a] = b[a][0]; B[a] = b[a][1]; A[p] = B[p] = s; A[q] = B[q] = t;
			out.push([A, B]);
		}
	}
	return out;
}

/** The runs of the segment A B (world points) on which `ok` holds, each refined at its ends. */
function seenRuns(A, B, ok, P) {
	const at = (t) => A.map((v, i) => v + (B[i] - v) * t);
	const [a, b] = [P(A), P(B)];
	const n = Math.max(8, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 0.25));
	const runs = [];
	let start = null, prev = false;
	const edge = (lo, hi, from) => {
		for (let k = 0; k < 40; k++) { const m = (lo + hi) / 2; if (ok(at(m)) === from) lo = m; else hi = m; }
		return (lo + hi) / 2;
	};
	for (let k = 0; k <= n; k++) {
		const t = k / n, s = ok(at(t));
		if (k === 0) { if (s) start = 0; prev = s; continue; }
		if (s && !prev) start = edge((k - 1) / n, t, false);
		if (!s && prev) runs.push([start, edge((k - 1) / n, t, true)]);
		prev = s;
	}
	if (prev) runs.push([start, 1]);
	return runs.filter(([u, v]) => v - u > 1e-6).map(([u, v]) => [at(u), at(v)]);
}

/** The distance from the point q to the segment a b. */
function toSegment(q, a, b) {
	const d = [b[0] - a[0], b[1] - a[1]], l2 = d[0] ** 2 + d[1] ** 2;
	const t = l2 ? Math.max(0, Math.min(1, ((q[0] - a[0]) * d[0] + (q[1] - a[1]) * d[1]) / l2)) : 0;
	return Math.hypot(q[0] - a[0] - t * d[0], q[1] - a[1] - t * d[1]);
}

/** The polyline with `cut` points of its length taken off each end. */
function trim(pts, cut) {
	const go = (p) => {
		let left = cut;
		while (p.length > 1) {
			const l = Math.hypot(p[1][0] - p[0][0], p[1][1] - p[0][1]);
			if (l > left) { const f = left / l; p[0] = [p[0][0] + (p[1][0] - p[0][0]) * f, p[0][1] + (p[1][1] - p[0][1]) * f]; return p; }
			left -= l; p.shift();
		}
		return [];
	};
	const a = go([...pts]);
	return a.length > 1 ? go(a.reverse()).reverse() : [];
}

/** The convex hull of page points, in order round it. */
function convexHull(pts) {
	const p = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
	const turn = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
	const lo = [], hi = [];
	for (const q of p) { while (lo.length > 1 && turn(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
	for (const q of [...p].reverse()) { while (hi.length > 1 && turn(hi[hi.length - 2], hi[hi.length - 1], q) <= 0) hi.pop(); hi.push(q); }
	return [...lo.slice(0, -1), ...hi.slice(0, -1)];
}

/** A polyline of page points thinned (Douglas-Peucker) so that it strays from the given one by at most tol points. */
function thin(pts, tol = 0.01) {
	const keep = new Uint8Array(pts.length);
	keep[0] = keep[pts.length - 1] = 1;
	const stack = [[0, pts.length - 1]];
	while (stack.length) {
		const [a, b] = stack.pop();
		const [ax, ay] = pts[a], [bx, by] = pts[b], L = Math.hypot(bx - ax, by - ay) || 1e-12;
		let far = -1, d = 0;
		for (let i = a + 1; i < b; i++) {
			const e = Math.abs((bx - ax) * (ay - pts[i][1]) - (ax - pts[i][0]) * (by - ay)) / L;
			if (e > d) { d = e; far = i; }
		}
		if (d > tol) { keep[far] = 1; stack.push([a, far], [far, b]); }
	}
	return pts.filter((_, i) => keep[i]);
}

/** The stone's brightness, relative to its mean, sampled bilinearly with mirrored repeats. */
async function texture(url) {
	const s = await sprite(url);
	const img = new Image(); img.src = s.href; await img.decode();
	const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
	const ctx = c.getContext('2d'); ctx.drawImage(img, 0, 0);
	const px = ctx.getImageData(0, 0, img.width, img.height).data;
	const lum = new Float32Array(img.width * img.height);
	let mean = 0;
	for (let k = 0; k < lum.length; k++) { lum[k] = 0.299 * px[4 * k] + 0.587 * px[4 * k + 1] + 0.114 * px[4 * k + 2]; mean += lum[k]; }
	mean /= lum.length;
	const mirror = (x, n) => { const m = ((x % (2 * n)) + 2 * n) % (2 * n); return m < n ? m : 2 * n - 1 - m; };
	return {
		at(x, y) {
			const i = Math.floor(x), j = Math.floor(y), fx = x - i, fy = y - j;
			const g = (a, b) => lum[mirror(b, img.height) * img.width + mirror(a, img.width)];
			return ((g(i, j) * (1 - fx) + g(i + 1, j) * fx) * (1 - fy) + (g(i, j + 1) * (1 - fx) + g(i + 1, j + 1) * fx) * fy) / mean;
		}
	};
}
