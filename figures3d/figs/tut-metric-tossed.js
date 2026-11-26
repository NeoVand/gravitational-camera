// The tutorial, section 7.1 (tutorial/geometry/metric.md), its first diagram: the tossed clock. One panel, a spacetime
// diagram of height against coordinate time: t across from 0 to 2 s and height upward from 0 to 8 m, thin ink axes
// named "t (s)" and "height (m)", ticks at 1 s and at 2, 4, 6 and 8 m. Two filled ink dots on the time axis, the
// throw at t = 0 and the catch at t = 2 s. Four worldlines between them: the ground clock along the axis z = 0, named
// "stays: 0"; the free fall z = (1/2) g t (2 - t), g = 9.81 m s^-2, peak 4.91 m at 1 s, solid and heavier in the
// observer's colour, named "free fall: 3.57"; the paths of half and 1.5 times its height, peaks 2.45 and 7.36 m, thin
// and dashed in the observer's colour, named "half as high: 2.68" and "1.5 times as high: 2.68". The numbers are each
// path's gain of proper time over the ground clock, in units of 10^-16 s.
// Departures from the diagram's comment: the drawing is narrower than the comment's 640 site pixels, about 500 at
// 1440, so that its text stays readable on a phone (a drawing is shown at most 1.9 site pixels to the point and
// shrinks with a narrower column). The throw and the catch carry no tick: their dots mark t = 0 and t = 2 s, and the
// numbers 0 and 2 stand under them; nor does height 0, since the throw's name stands there, left of its dot, as the
// catch's stands right of its own. The time axis's name stands under its numbers. Each path's name stands just above
// its peak, in the lane between it and the next path up, the ground clock's just above the axis.
// Exact: the four paths (sampled so that no two neighbouring points are more than a quarter of a point apart, every
// point asserted on its parabola), their peaks at 1 s (asserted at 2.45, 4.91 and 7.36 m), the dots, and the printed
// gains (computed by Simpson's rule in tut-metric-lib.js and asserted against g^2 T^3 / 24 c^2 and (2a - a^2) times
// it). Nothing is schematic.
import { Sheet, ORIGIN, finish, checker, placed, near, LABEL_GAP, AXIS, VEC, HAIR, TICK } from './tut-pot-lib.js';
import { Plot, NUM } from './tut-prob-lib.js';
import { graph, longest, THIN } from './tut-fourier-lib.js';
import { DASH, DOT } from './tut-bessel-lib.js';
import { INK, DIM } from '../lib.js';
import { chapter, palette, OBS, T, SCALES, height, printed, peakPrinted } from './tut-metric-lib.js';

const name = 'tut-metric-tossed';
const check = checker(name);

const UT = 104;                            // points per second
const UZ = 16;                             // points per metre
const TOP = 8;                             // the height axis, metres
const EVENT = DOT + 0.25;                  // the throw's and the catch's dots, radius (section 6.1's)
const FREE = VEC;                          // the free fall's stroke, heavier than the dashed paths' THIN
const RAISE = 2.6;                         // a name's air above its path's peak

/** A dash pattern stretched so that a whole, odd number of dashes fits the length L, a dash at each end. */
function fit(L, dash) {
	let k = Math.max(1, Math.round((L + dash[1]) / (dash[0] + dash[1])));
	if (k % 2 === 0) k += 1;
	const f = L / (k * dash[0] + (k - 1) * dash[1]);
	return [dash[0] * f, dash[1] * f];
}
const length = (pts) => pts.slice(1).reduce((s, p, i) => s + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0);

export default async function () {
	const nums = chapter(check);
	await palette(check);
	const S = new Sheet(name);
	const L = [];
	const P = new Plot({ left: ORIGIN - (T * UT) / 2, top: ORIGIN - (TOP * UZ) / 2, w: T * UT, h: TOP * UZ, x0: 0, x1: T, y0: 0, y1: TOP });
	const o = P.at(0, 0), end = P.at(T, 0);

	// ---- the axes: plain lines, the time axis from the throw to the catch, the height axis from 0 to 8 m
	S.path([o, end], { color: INK, width: AXIS, cap: 'butt', what: 'the time axis' });
	S.path([o, P.at(0, TOP)], { color: INK, width: AXIS, cap: 'butt', what: 'the height axis' });
	{
		const [x, y] = P.at(1, 0);
		S.path([[x, y], [x, y + TICK]], { color: DIM, width: HAIR, cap: 'butt', what: 'the tick at 1 s' });
	}
	for (const z of [2, 4, 6, 8]) {
		const [x, y] = P.at(0, z);
		S.path([[x, y], [x - TICK, y]], { color: DIM, width: HAIR, cap: 'butt', what: `the tick at ${z} m` });
		L.push(await placed(String(z), x - TICK - NUM, y, 1, 0.5, DIM));
	}
	// the time's numbers, under the dots and the tick, on one line
	const nums_t = [];
	for (const t of [0, 1, 2]) nums_t.push(await placed(String(t), P.X(t), o[1] + TICK + NUM, 0.5, 0, DIM));
	L.push(...nums_t);
	const below = Math.max(...nums_t.map((l) => l.box.b));
	L.push(await placed('t\\ (\\text{s})', P.X(1), below + 2.4, 0.5, 0, INK));
	L.push(await placed('\\text{height (m)}', o[0], P.Y(TOP) - TICK - NUM - 0.6, 0.5, 1, INK));

	// ---- the paths: the dashed ones under the free fall
	const peaks = {};
	for (const a of [0.5, 1.5, 1]) {
		const pts = graph(P, (t) => height(a, t), 0, T);
		check(longest(pts) <= 0.2501, `the path ${a} is coarse`);
		for (const [px, py] of pts) {
			const t = (px - P.left) / UT, z = (P.bottom - py) / UZ;
			check(near(z, height(a, t), 1e-9), `a point of the path ${a} is off it`);
		}
		const top = pts.reduce((m, p) => (p[1] < m[1] ? p : m));
		check(near(top[0], P.X(1), 0.5) && top[1] >= P.Y(height(a, 1)) - 1e-9 && near(top[1], P.Y(height(a, 1)), 1e-3), `the path ${a} does not peak at 1 s`);
		peaks[a] = P.at(1, height(a, 1));
		if (a === 1) S.path(pts, { color: OBS, width: FREE, layer: 2.2, cap: 'butt', what: 'the free fall' });
		else S.path(pts, { color: OBS, width: THIN, layer: 2, cap: 'butt', dash: fit(length(pts), DASH).map(n => +n.toFixed(4)), what: `the path ${a}` });
	}
	check(peakPrinted(0.5) === '2.45' && peakPrinted(1) === '4.91' && peakPrinted(1.5) === '7.36', 'the peaks');
	check(peaks[1.5][1] > P.Y(TOP), 'the highest path leaves the axis');

	// ---- the throw and the catch
	for (const [t, what] of [[0, 'the throw'], [T, 'the catch']]) {
		const [x, y] = P.at(t, 0);
		S.raw(`<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${EVENT}" fill="${INK}"/>`, 4);
		S.mark([[x, y]], EVENT, what);
	}
	L.push(await placed('\\text{throw}', o[0] - EVENT - LABEL_GAP - 0.6, o[1], 1, 0.5, INK));
	L.push(await placed('\\text{catch}', end[0] + EVENT + LABEL_GAP + 0.6, end[1], 0, 0.5, INK));

	// ---- the names, each just above its own peak, centred on 1 s
	const names = [
		[0, '\\text{stays: }', INK],
		[0.5, '\\text{half as high: }', OBS],
		[1, '\\text{free fall: }', OBS],
		[1.5, '\\text{1.5 times as high: }', OBS]
	];
	for (const [a, words, color] of names) {
		const p = a === 0 ? o.map((v, i) => (i ? v : P.X(1))) : peaks[a];
		const r = a === 0 ? AXIS / 2 : a === 1 ? FREE / 2 : THIN / 2;
		const label = await placed(`${words}${printed(a)}`, p[0], p[1] - r - RAISE, 0.5, 1, color);
		L.push(label);
		// the name belongs to the path under it: far nearer to it than to the path above
		const next = { 0: 0.5, 0.5: 1, 1: 1.5 }[a];
		if (next !== undefined) check(P.Y(height(next, 1)) < label.box.t - 3 * RAISE, `the name of ${a} crowds the path above`);
	}

	S.checkAll(L);
	window[name + '-numbers'] = { ...nums, peaks: SCALES.map(peakPrinted) };
	return finish(S, L, [240, 300]);
}
