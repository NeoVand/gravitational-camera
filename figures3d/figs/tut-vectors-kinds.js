// The tutorial, section 6.2 (tutorial/relativity/spacetime-vectors.md), its first diagram: the three kinds of
// four-vector, sorted by the sign of a.a. One square panel, units of light-seconds at one scale on both axes, so that
// light runs at 45 degrees: the room's axes in thin ink, x across and ct upward, each from -1.6 to 1.6, named at their
// ends; the light cone of the origin, the two lines x = +-ct, thin and dashed in the light role's colour, the upper
// right one named "light"; the inside of the cone, |x| < |ct|, filled with the page's faint neutral tint. A small ink
// dot at the origin, the flash A. Three arrows from A: in the observer's colour to (x, ct) = (0.75, 1.25), along the
// worldline of a clock at 0.6c, named "time-like, a.a = -1"; in the light role's colour to (1.25, 1.25), on the cone,
// named "null, a.a = 0"; in ink to (1, 0), ending at a small ink dot, the flash B, named "space-like, a.a = +1". The
// values of a.a are in light-seconds squared.
// The panel is drawn at 68 points to the light-second, section 6.1's scale (218 points for its 3.2 light-seconds,
// about the comment's 520 site pixels at 1.9 pixels to the point, less the room the names take).
// Exact: every line (the light lines at 45 degrees on the page, asserted), the three arrows' ends (asserted in
// tut-vectors-lib.js with their a.a), the flashes. Nothing is schematic.
import { Sheet, ORIGIN, finish, checker, placed, near, LABEL_GAP, AXIS, AXIS_HEAD, VEC, VEC_HEAD } from './tut-pot-lib.js';
import { Plot, TINT } from './tut-prob-lib.js';
import { dashed } from './tut-orb-lib.js';
import { DASH, DOT } from './tut-bessel-lib.js';
import { THIN } from './tut-fourier-lib.js';
import { INK } from '../lib.js';
import { chapter, palette, OBS, LIGHT, KINDS, square } from './tut-vectors-lib.js';

const name = 'tut-vectors-kinds';
const check = checker(name);

const U = 68;                              // points per light-second
const R = 1.6;                             // the axes run from -R to R
const EVENT = DOT + 0.25;                  // a flash's dot, radius (section 6.1's)
const FILL = 0.65;                         // the inside of the cone: the opacity of the page's tint

/** The distance from the point q to the segment ab. */
function toSegment(q, a, b) {
	const d = [b[0] - a[0], b[1] - a[1]], t = Math.max(0, Math.min(1, ((q[0] - a[0]) * d[0] + (q[1] - a[1]) * d[1]) / (d[0] ** 2 + d[1] ** 2)));
	return Math.hypot(q[0] - a[0] - t * d[0], q[1] - a[1] - t * d[1]);
}

export default async function () {
	const nums = chapter(check);
	await palette(check);
	const S = new Sheet(name);
	const L = [];
	const W = 2 * R * U;
	const P = new Plot({ left: ORIGIN - W / 2, top: ORIGIN - W / 2, w: W, h: W, x0: -R, x1: R, y0: -R, y1: R });
	const at = ([x, ct]) => P.at(x, ct);
	const o = at([0, 0]);

	// ---- the inside of the cone, |x| < |ct|, faintly
	{
		const tri = (s) => [o, at([-R, s * R]), at([R, s * R])];
		const d = [tri(1), tri(-1)].map((t) => 'M' + t.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join('L') + 'Z').join('');
		// the page's neutral tint at two thirds of its strength: very faint in both themes
		S.raw(`<path d="${d}" fill="${TINT}" fill-opacity="${FILL}"/>`, 0.2);
	}

	// ---- the room's axes
	const xAxis = S.arrow(at([-R, 0]), at([R, 0]), { color: INK, width: AXIS, head: AXIS_HEAD, layer: 1, what: 'the x axis' });
	const tAxis = S.arrow(at([0, -R]), at([0, R]), { color: INK, width: AXIS, head: AXIS_HEAD, layer: 1, what: 'the ct axis' });

	// ---- the three arrows from A
	const tips = { time: at(KINDS.time), null: at(KINDS.null), space: at(KINDS.space) };
	const time = S.arrow(o, tips.time, { color: OBS, width: VEC, head: VEC_HEAD, layer: 3, what: 'the time-like arrow' });
	const nul = S.arrow(o, tips.null, { color: LIGHT, width: VEC, head: VEC_HEAD, layer: 3, what: 'the null arrow' });
	// the space-like arrow ends with its point on B's dot
	const space = S.arrow(o, [tips.space[0] - EVENT, tips.space[1]], { color: INK, width: VEC, head: VEC_HEAD, layer: 3, what: 'the space-like arrow' });
	check(near(tips.null[0] - o[0], o[1] - tips.null[1], 1e-9), 'the null arrow is not at 45 degrees');

	// ---- the light cone, x = +-ct, at 45 degrees on the page; no dash under the null arrow or A's dot
	const clash = (q, gap) => toSegment(q, o, tips.null) < VEC / 2 + gap || Math.hypot(q[0] - o[0], q[1] - o[1]) < EVENT + gap;
	for (const [a, b] of [[[-R, -R], [R, R]], [[-R, R], [R, -R]]]) {
		const p = at(a), q = at(b);
		check(near(Math.abs(q[0] - p[0]), Math.abs(q[1] - p[1]), 1e-9), 'a light line is not at 45 degrees');
		dashed(S, p, q, { clash, color: LIGHT, width: THIN, dash: DASH, layer: 0.5, what: 'a light line' });
	}

	// ---- the flashes
	for (const [p, key] of [[o, 'A'], [tips.space, 'B']]) {
		S.raw(`<circle cx="${p[0]}" cy="${p[1]}" r="${EVENT}" fill="${INK}"/>`, 4);
		S.mark([p], EVENT, `the flash ${key}`);
	}

	// ---- the names
	L.push(await placed('x', xAxis.B[0] + LABEL_GAP + 1.2, xAxis.B[1], 0, 0.5, INK));
	L.push(await placed('ct', tAxis.B[0], tAxis.B[1] - LABEL_GAP - 1.2, 0.5, 1, INK));
	{
		// "light" to the right of the upper right light line, beyond the null arrow's point
		const q = at([1.48, 1.48]);
		L.push(await S.clear('\\text{light}', q[0] + 3, q[1], 0, 0.5, [1, 0], { color: LIGHT }));
	}
	{
		// A in the open wedge between the upper left light line and the x axis; B above and to the right of its dot
		const w = [-Math.cos(Math.PI / 8), -Math.sin(Math.PI / 8)];
		L.push(await S.clear('A', o[0] + w[0] * 2, o[1] + w[1] * 2, 1, 1, w, { color: INK }));
		L.push(await S.clear('B', tips.space[0] + 2, tips.space[1] - 2, 0, 1, [0.7, -0.7], { color: INK }));
	}
	// time-like: above its point, between the ct axis and the light line, moved left until it clears the light line
	L.push(await S.clear('\\text{time-like, } a\\cdot a = -1', time.B[0], time.B[1] - 5, 0.5, 1, [-1, 0], { color: OBS, gap: 3.6 }));
	// null: to the right of its point, under the light line
	L.push(await S.clear('\\text{null, } a\\cdot a = 0', nul.B[0] + 4, nul.B[1] + 3, 0, 0, [1, 0], { color: LIGHT }));
	// space-like: under the x axis, centred under B, clear of the lower light line
	L.push(await S.clear('\\text{space-like, } a\\cdot a = +1', tips.space[0], tips.space[1] + LABEL_GAP + 1, 0.5, 0, [0, 1], { color: INK }));

	// the printed values of a.a are the vectors' own
	check(near(square(KINDS.time), -1, 1e-14), 'the time-like label');
	check(square(KINDS.null) === 0 && square(KINDS.space) === 1, 'the null and space-like labels');

	S.checkAll(L);
	window[name + '-numbers'] = { ...nums, scale: U, arrows: [time.L, nul.L, space.L] };
	return finish(S, L, [240, 340]);
}
