// The tutorial, section 6.2 (tutorial/relativity/spacetime-vectors.md), its third diagram: a step and the level
// lines of a function, for the room and for the pixel at 0.6c. Two panels at one scale, units of light-seconds at one
// scale on both axes. Above, "room": axes x across and ct upward, thin ink; the level lines of f = 2x - ct for
// f = -1, 0, 1, 2, 3 and 4, thin parallel straight lines, those of f = 0 to 3 a little darker than the other two, each
// named with its value at its upper end; the step a from the origin to (x, ct) = (1.5, 0), an arrow in the observer's
// colour, named "a", which runs from the line f = 0 to the line f = 3, across three gaps. Below, "pixel at 0.6c": axes
// x' and ct', the same function in the pixel's coordinates, f = 1.75 x' + 0.25 ct', its level lines for the same
// values, and the same step, now from the origin to (x', ct') = (1.875, -1.125), named "a'", again from f = 0 to
// f = 3. Under each panel a one-line readout, "df = (-1, 2), a = (0, 1.5), d_mu f a^mu = 3" and "d'f = (0.25, 1.75),
// a' = (-1.125, 1.875), d'_mu f a'^mu = 3", components as (time, x), every number computed here.
// Departures from the diagram's comment: the panels are stacked, the room above the pixel, at every width, not side by
// side at 1440 px. The site shows one drawing at every width; side by side, each panel would have about 160 points,
// too narrow for its one-line readout, and the pair would be shrunk to half size on a phone (R5's capstone,
// figs/tut-read-iii-capstone.js, takes the narrow layout for the same reason). Stacked, the two origins stand one
// above the other at the same scale, so that the two steps and the two sets of lines can be compared directly. The
// scale is 62 points to the light-second (118 site pixels, the comment's 100 a little enlarged for the phone). The
// step in the pixel's panel is named "a'", as in its readout, so that the two arrows are told apart.
// Exact: the level lines (each line's points asserted at its value of f), the steps' ends (asserted on f = 3, and
// against the boost in tut-vectors-lib.js), the readouts (formatted from the computed components and asserted against
// the chapter's). Nothing is schematic.
import { Sheet, ORIGIN, finish, checker, placed, near, LABEL_GAP, AXIS, AXIS_HEAD, VEC, VEC_HEAD, LINE, HAIR } from './tut-pot-lib.js';
import { INK, DIM, FAINT } from '../lib.js';
import { chapter, palette, OBS, f, fPixel, GRAD, STEP, GRAD_PIXEL, STEP_PIXEL, LEVELS } from './tut-vectors-lib.js';

const name = 'tut-vectors-gradient';
const check = checker(name);

const U = 62;                              // points per light-second, both panels
const XL = -1.0, XR = 2.75;                // the x axes, light-seconds
const ABOVE = 0.25;                        // the ct axes run this far above the level lines' tops
const ROW = 5;                             // the air between a panel's title, its plot and its readout, points
const APART = 16;                          // the air between the room's readout and the pixel's title, points
const HEAD_ROOM = 12;                      // from a panel's title to its level lines' tops: their names, points

/** A number as the readout prints it: at most four decimals, a true minus sign by TeX. */
const num = (v) => String(+v.toFixed(4));
const pair = ([a, b]) => `(${num(a)},\\ ${num(b)})`;

/** One panel, its origin at (ox, oy) on the page: the axes, the level lines of the function with the gradient g
 * (time, x), the step (time, x), the names. Returns the labels and the bottom of the plot's ink. */
async function panel(S, { ox, oy, c0, c1, g, step, value, axes, arrowName, side }) {
	const L = [];
	const at = (x, ct) => [ox + x * U, oy - ct * U];
	// ---- the axes
	const xA = S.arrow(at(XL, 0), at(XR, 0), { color: INK, width: AXIS, head: AXIS_HEAD, layer: 1, what: `the ${axes[0]} axis` });
	const tA = S.arrow(at(0, c0), at(0, c1 + ABOVE), { color: INK, width: AXIS, head: AXIS_HEAD, layer: 1, what: `the ${axes[1]} axis` });
	L.push(await placed(axes[0], xA.B[0] + LABEL_GAP + 1.2, xA.B[1], 0, 0.5, INK));
	L.push(await placed(axes[1], tA.B[0], tA.B[1] - LABEL_GAP - 1.2, 0.5, 1, INK));
	// ---- the level lines g0 ct + g1 x = v, from ct = c0 to c1, named at their upper ends
	for (const v of LEVELS) {
		const x = (ct) => (v - g[0] * ct) / g[1];
		for (const ct of [c0, c1, (c0 + c1) / 2]) check(near(value([ct, x(ct)]), v, 1e-12), `the line ${v} is off its level`);
		check(x(c0) > XL + 0.05 && x(c1) > XL + 0.05 && x(c0) < XR - 0.2 && x(c1) < XR - 0.2, `the line ${v} leaves the axis`);
		const strong = v >= 0 && v <= 3;
		const color = strong ? DIM : FAINT;
		const top = at(x(c1), c1);
		S.path([at(x(c0), c0), top], { color, width: strong ? LINE : HAIR, layer: 0.5, cap: 'butt', what: `the line f = ${v}` });
		// above the top, moved away from the ct axis if it would touch it
		L.push(await S.clear(String(v), top[0], top[1] - LABEL_GAP - 0.6, 0.5, 1, [Math.sign(top[0] - ox) || 1, 0], { color }));
	}
	// ---- the step, from the line f = 0 to the line f = 3
	check(value([0, 0]) === 0 && near(value(step), 3, 1e-14), 'the step does not run from f = 0 to f = 3');
	const a = S.arrow(at(0, 0), at(step[1], step[0]), { color: OBS, width: VEC, head: VEC_HEAD, layer: 3, what: 'the step' });
	{
		// the name beside the arrow's middle, between the lines f = 1 and f = 2, on the side `side`
		const m = [(a.A[0] + a.B[0]) / 2, (a.A[1] + a.B[1]) / 2], n = [-a.u[1] * side, a.u[0] * side];
		L.push(await S.clear(arrowName, m[0] + n[0] * 3, m[1] + n[1] * 3, n[0] < 0 ? 1 : n[0] > 0 ? 0 : 0.5, n[1] < 0 ? 1 : 0, n, { color: OBS }));
	}
	return { L, bottom: oy - c0 * U, left: ox + XL * U };
}

export default async function () {
	const nums = chapter(check);
	await palette(check);
	const S = new Sheet(name);
	const L = [];

	// ---- the readouts, from the computed components, against the chapter's
	const room = `\\partial f = ${pair(GRAD)},\\quad a = ${pair(STEP)},\\quad \\partial_\\mu f\\, a^\\mu = ${num(GRAD[0] * STEP[0] + GRAD[1] * STEP[1])}`;
	const pix = `\\partial' f = ${pair(GRAD_PIXEL)},\\quad a' = ${pair(STEP_PIXEL)},\\quad \\partial'_\\mu f\\, a'^\\mu = ${num(GRAD_PIXEL[0] * STEP_PIXEL[0] + GRAD_PIXEL[1] * STEP_PIXEL[1])}`;
	check(room === '\\partial f = (-1,\\ 2),\\quad a = (0,\\ 1.5),\\quad \\partial_\\mu f\\, a^\\mu = 3', `the room's readout ${room}`);
	check(pix === "\\partial' f = (0.25,\\ 1.75),\\quad a' = (-1.125,\\ 1.875),\\quad \\partial'_\\mu f\\, a'^\\mu = 3", `the pixel's readout ${pix}`);

	// ---- the room, above
	const x0 = ORIGIN - 60;
	let y = ORIGIN - 200;
	const title1 = await placed('\\text{room}', x0 + XL * U, y, 0, 0, INK);
	L.push(title1);
	const c1room = 0.8, c0room = -0.8;
	// the origin: under the title, then the level lines' names, then their tops
	const oy1 = title1.box.b + ROW + HEAD_ROOM + c1room * U;
	const p1 = await panel(S, { ox: x0, oy: oy1, c0: c0room, c1: c1room, g: GRAD, step: STEP, value: f, axes: ['x', 'ct'], arrowName: 'a', side: 1 });
	L.push(...p1.L);
	const read1 = await placed(room, x0 + XL * U, p1.bottom + ROW + 2, 0, 0, INK);
	L.push(read1);

	// ---- the pixel at 0.6c, below
	const title2 = await placed('\\text{pixel at } 0.6c', x0 + XL * U, read1.box.b + APART, 0, 0, INK);
	L.push(title2);
	const c1pix = 0.8, c0pix = -1.4;
	const oy2 = title2.box.b + ROW + HEAD_ROOM + c1pix * U;
	const p2 = await panel(S, { ox: x0, oy: oy2, c0: c0pix, c1: c1pix, g: GRAD_PIXEL, step: STEP_PIXEL, value: fPixel, axes: ["x'", "ct'"], arrowName: "a'", side: -1 });
	L.push(...p2.L);
	L.push(await placed(pix, x0 + XL * U, p2.bottom + ROW + 2, 0, 0, INK));

	S.checkAll(L);
	window[name + '-numbers'] = { ...nums, scale: U };
	return finish(S, L, [240, 340]);
}
