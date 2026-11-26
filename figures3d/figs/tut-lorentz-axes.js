// The tutorial, section 6.1 (tutorial/relativity/lorentz.md), its first diagram: the room's axes and the pixel's, and
// two flashes that are simultaneous for the room and not for the pixel. One square panel, units of light-seconds at
// one scale on both axes, so that light runs at 45 degrees: the room's axes in thin ink, x across from -1.2 to 1.8 and
// ct upward from -1.2 to 1.8, named at their ends; the two light lines x = +-ct, thin and dashed in the light role's
// colour, the upper right one named "light"; the pixel's axes at 0.6c in the observer's colour, through the origin,
// its time axis ct' (x' = 0) along x = 0.6 ct and its space axis x' (t' = 0) along ct = 0.6 x, each tilted by
// arctan 0.6 = 31.0 degrees from the room's axis toward the light line, named at their ends; on each a small tick at
// one unit of the pixel's, (x, ct) = (0.75, 1.25) on ct' and (1.25, 0.75) on x', named "1". Two flashes as small ink
// dots on the room's x axis, A at the origin and B at x = 1; through B, a thin dashed line in the observer's colour
// parallel to x', ct = 0.6 x - 0.6, the pixel's "now" at t' = -0.75 s, named under its right end.
// Departure from the diagram's comment: the line through B stops at x = 1.5, short of the panel's edge, and its name
// starts under its right end and runs on to the right: a name under the end that reached back to the left would lie
// across the line itself, which falls to the left at the slope 0.6. The panel is drawn at 68 points to the
// light-second (204 points for its 3 light-seconds, about the comment's 520 site pixels at half a point each, less the
// room the names take).
// Exact: every line (the light lines at 45 degrees on the page, the pixel's axes at 31.0 degrees from the room's,
// asserted on the page), the ticks (at ct' = 1 and x' = 1, one unit of interval from the origin, asserted in
// tut-lorentz-lib.js with t' = -0.75 s at every point of B's line), the flashes. Nothing is schematic.
import { Sheet, ORIGIN, finish, checker, placed, near, LABEL_GAP, AXIS, AXIS_HEAD, LINE, HAIR, TICK } from './tut-pot-lib.js';
import { Plot } from './tut-prob-lib.js';
import { dashed } from './tut-orb-lib.js';
import { DASH, DOT } from './tut-bessel-lib.js';
import { THIN } from './tut-fourier-lib.js';
import { INK } from '../lib.js';
import { chapter, palette, OBS, LIGHT, BETA, TILT, A, B, slice, UNIT_T, UNIT_X, boost } from './tut-lorentz-lib.js';

const name = 'tut-lorentz-axes';
const check = checker(name);

const U = 68;                              // points per light-second
const LO = -1.2, HI = 1.8;                 // the room's axes, light-seconds
const B_END = 1.5;                         // B's line runs from the panel's foot to x = B_END
const EVENT = DOT + 0.25;                  // a flash's dot, radius

export default async function () {
	const nums = chapter(check);
	await palette(check);
	const S = new Sheet(name);
	const L = [];
	const W = (HI - LO) * U;
	const P = new Plot({ left: ORIGIN - W / 2, top: ORIGIN - W / 2, w: W, h: W, x0: LO, x1: HI, y0: LO, y1: HI });
	const at = ([x, ct]) => P.at(x, ct);
	const dir = (a, b) => { const p = at(a), q = at(b), l = Math.hypot(q[0] - p[0], q[1] - p[1]); return [(q[0] - p[0]) / l, (q[1] - p[1]) / l]; };
	const deg = (u) => (Math.atan2(-u[1], u[0]) * 180) / Math.PI;

	// ---- the room's axes
	const xAxis = S.arrow(at([LO, 0]), at([HI, 0]), { color: INK, width: AXIS, head: AXIS_HEAD, layer: 1, what: 'the x axis' });
	const tAxis = S.arrow(at([0, LO]), at([0, HI]), { color: INK, width: AXIS, head: AXIS_HEAD, layer: 1, what: 'the ct axis' });

	// ---- the light lines, x = +-ct, at 45 degrees on the page
	const light = [[[LO, LO], [HI, HI]], [[LO, -LO], [-LO, LO]]];
	for (const [a, b] of light) {
		check(near(Math.abs(deg(dir(a, b))), 45, 1e-9) || near(Math.abs(deg(dir(a, b))), 135, 1e-9), 'a light line is not at 45 degrees');
		dashed(S, at(a), at(b), { color: LIGHT, width: THIN, dash: DASH, layer: 0.5, what: 'a light line' });
	}

	// ---- the pixel's axes: x = 0.6 ct and ct = 0.6 x, each 31.0 degrees from the room's
	const ctP = [[BETA * LO, LO], [BETA * HI, HI]], xP = [[LO, BETA * LO], [HI, BETA * HI]];
	check(near(90 - deg(dir(...ctP)), TILT, 1e-9) && near(deg(dir(...xP)), TILT, 1e-9), 'the pixel\'s axes are not tilted by 31.0 degrees');
	check(ctP.every(([x, ct]) => near(boost([ct, x])[1], 0, 1e-15)) && xP.every(([x, ct]) => near(boost([ct, x])[0], 0, 1e-15)), 'the pixel\'s axes are not x\' = 0 and t\' = 0');
	const ctArrow = S.arrow(at(ctP[0]), at(ctP[1]), { color: OBS, width: LINE, head: AXIS_HEAD, layer: 2, what: 'the ct\' axis' });
	const xArrow = S.arrow(at(xP[0]), at(xP[1]), { color: OBS, width: LINE, head: AXIS_HEAD, layer: 2, what: 'the x\' axis' });

	// ---- the unit ticks, across each axis on the page, named "1" on the side away from the light line
	for (const [p, axis, side] of [[UNIT_T, ctP, -1], [UNIT_X, xP, 1]]) {
		const u = dir(...axis), w = [-u[1] * side, u[0] * side];     // across the axis, away from the light line
		const q = at(p);
		S.path([[q[0] - w[0] * TICK, q[1] - w[1] * TICK], [q[0] + w[0] * TICK, q[1] + w[1] * TICK]], { color: OBS, width: HAIR, layer: 2, cap: 'butt', what: `the tick at ${p}` });
		const end = [q[0] + w[0] * TICK, q[1] + w[1] * TICK];
		L.push(await S.clear('1', end[0] + w[0] * 2.6, end[1] + w[1] * 2.6, 0.5, 0.5, w, { color: OBS }));
	}

	// ---- B's line, the pixel's now through B: ct = 0.6 x - 0.6, from the panel's foot to x = B_END
	const x0 = (LO + BETA) / BETA;              // where it meets ct = LO
	check(near(slice(x0), LO, 1e-12) && near(slice(B[0]), B[1], 1e-15), 'B\'s line misses B or the foot');
	check(near(deg(dir([x0, slice(x0)], [B_END, slice(B_END)])), TILT, 1e-9), 'B\'s line is not parallel to x\'');
	const end = at([B_END, slice(B_END)]);
	dashed(S, at([x0, slice(x0)]), end, { color: OBS, width: THIN, dash: DASH, layer: 1.5, what: 'B\'s line' });

	// ---- the flashes
	for (const [p, key] of [[A, 'A'], [B, 'B']]) {
		const [x, y] = at(p);
		S.raw(`<circle cx="${x}" cy="${y}" r="${EVENT}" fill="${INK}"/>`, 4);
		S.mark([[x, y]], EVENT, `the flash ${key}`);
	}

	// ---- the names
	const tip = (a) => a.B;
	L.push(await placed('x', tip(xAxis)[0] + LABEL_GAP + 1.2, tip(xAxis)[1], 0, 0.5, INK));
	L.push(await placed('ct', tip(tAxis)[0], tip(tAxis)[1] - LABEL_GAP - 1.2, 0.5, 1, INK));
	L.push(await placed("ct'", tip(ctArrow)[0], tip(ctArrow)[1] - LABEL_GAP - 1.2, 0.5, 1, OBS));
	L.push(await placed("x'", tip(xArrow)[0] + LABEL_GAP + 1.2, tip(xArrow)[1], 0, 0.5, OBS));
	{
		// "light", to the right of the upper right light line, two thirds of the way up
		const q = at([1.42, 1.42]);
		L.push(await S.clear('\\text{light}', q[0] + 3, q[1], 0, 0.5, [1, 0], { color: LIGHT }));
	}
	{
		// A in the open wedge above the x axis, left of the ct axis; B under the x axis, right of B
		const [ax, ay] = at(A), [bx, by] = at(B);
		const w = [-Math.cos(Math.PI / 8), -Math.sin(Math.PI / 8)];        // 157.5 degrees: the middle of the wedge
		L.push(await S.clear('A', ax + w[0] * 2, ay + w[1] * 2, 1, 1, w, { color: INK }));
		L.push(await S.clear('B', bx + 3, by + 3, 0, 0, [0.7, 0.7], { color: INK }));
	}
	L.push(await S.clear("\\text{pixel's now at } t' = -0.75\\ \\text{s}", end[0] + 1, end[1] + LABEL_GAP, 0, 0, [0, 1], { color: OBS }));

	S.checkAll(L);
	window[name + '-numbers'] = { ...nums, scale: U };
	return finish(S, L, [240, 340]);
}
