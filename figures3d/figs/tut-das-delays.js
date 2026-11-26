// The tutorial, section 5.3 (tutorial/waves/diffraction.md), its first diagram: delaying and adding the records of
// many pixels points the array. Two panels. Left: a row of six pixels (small squares, ink) b = lambda/3 apart along a
// horizontal line, the origin at the left-hand pixel, p = 0 to 5; the straight crests of a plane wave (five of them,
// faint), arriving at 30 degrees from the normal; the unit vector n from the middle of the row toward the source, along
// the normal to the crests, named "n (toward the source)", with the normal (dotted) and the angle of 30 degrees; from
// each pixel a dashed segment (first accent) at right angles to the crests back to the crest that passes the origin,
// its length n.x_p = p b sin 30 degrees, named at the first and the last pixel. Right: the six records, stacked from
// p = 0 at the top, each a train of four cycles against the time t: first as recorded, each starting earlier by
// n.x_p/c, so that their first crests make a slanted line (dashed, first accent); then, beyond an arrow named "shift
// by n.x_p/c", the same six records lined up, their first crests on an upright line (dashed, first accent), and under
// them their sum, six times as tall.
// Departures from the diagram's comment: the comment brought the wave from the upper left; with the origin at the
// left-hand pixel that makes n.x_p = -p b sin 30 degrees, so that every pixel would be farther from the source than
// the origin. The wave comes from the upper right, as the chapter's own n.x_p = p b sin theta for x_p = p b x-hat
// requires for theta = 30 degrees, and each pixel is nearer to the source by n.x_p, as the text says. The segments
// are named n.x_1 and n.x_5, their own indices, since the first pixel's segment has no length. The normal, the
// angle, the records' first and last indices, a time arrow, the name "recorded" and the upright line through the
// lined-up crests are added, so that the angle and the direction of time can be read.
// Exact: the pixels' places, the crests (lines n.x = m lambda, asserted), n's direction, the segments (asserted at
// right angles to the crests, from each pixel to the crest through the origin, p b sin 30 degrees long, a sixth of a
// wavelength per pixel), and on the right the delays of the records, n.x_p/c = p T/6 for the period T (asserted
// against the left panel's segments), the slanted line through the recorded crests (asserted to pass through each),
// the lined-up records and their sum (asserted to be six times one record). Schematic: the records' shape, a train of
// four cycles of a sine, their height, and the scale of time on the right (one period T to 11 points).
import { Sheet, ORIGIN, finish, checker, placed, near, toBox, HAIR, LABEL_GAP, AXIS, AXIS_HEAD, VEC, VEC_HEAD } from './tut-pot-lib.js';
import { Plot, pathOf } from './tut-prob-lib.js';
import { graph, longest, CURVE } from './tut-fourier-lib.js';
import { INK, DIM, ACCENT, ZERO_LINE, ZERO_DASH } from './tut-bessel-lib.js';
import { RULE } from '../lib.js';
import { chapter, PIXELS, SPACING, THETA, delay } from './tut-das-lib.js';

const name = 'tut-das-delays';
const check = checker(name);

// ---- the left panel: points, y up in the mathematics ------------------------------------------------------------
const LAMBDA = 33;                        // a wavelength, points
const B = LAMBDA * SPACING;               // the pixels' spacing, 11 points
const SQ = 2.8;                           // a pixel's side
const CRESTS = [-1, 0, 1, 2, 3];         // the crests n.x = m lambda drawn
const HALF_CREST = 30;                    // each crest runs this far either side of the line along n through the row's middle
const CREST_W = 0.5;
const N_LEN = 30;                         // n's arrow
const NORMAL = 30;                        // the normal, dotted, this long
const ARC = 20;                           // the angle's radius
const SEG_W = HAIR + 0.2;                 // the segments and the lines through the crests
const SEG_DASH = [1.6, 1.1];              // their dashes
const BREAK = LABEL_GAP + 0.3;            // a crest stops this far from a label set over the wave
const PIECE = 4;                          // and no piece of a crest shorter than this is drawn
// ---- the right panel ----------------------------------------------------------------------------------------------
const T = 11;                             // a period, points
const CYCLES = 4;
const AMP = 2.8;                          // a record's height
const PITCH = 8.6;                        // from one record to the next
const SUM_GAP = 7;                        // the air between the last lined-up record and the sum
const SHIFT = 38;                         // the arrow between the two blocks
const APART = 18;                         // from the left panel's rightmost ink to the right panel's

export default async function () {
	const nums = chapter(check);
	const S = new Sheet(name);
	const L = [];
	const nh = [Math.sin(THETA), Math.cos(THETA)];          // n, toward the upper right
	const along = [Math.cos(THETA), -Math.sin(THETA)];      // along the crests
	const dot = (a, b) => a[0] * b[0] + a[1] * b[1];
	const isCrest = (w) => w.startsWith('the crest ');
	/** A label placed as by S.clear but allowed over the crests, which are broken round it when they are drawn. */
	const cuts = [];
	const over = async (src, x, y, ax, ay, dir, color) => {
		for (let s = 0; s < 60; s += 0.05) {
			const l = await placed(src, x + dir[0] * s, y + dir[1] * s, ax, ay, color);
			if (S.clearance(l.box, isCrest).d >= LABEL_GAP + 0.2) { cuts.push(l.box); return l; }
		}
		throw new Error(`${name}: no room for the label ${src}`);
	};

	// ---- the left panel: the origin at the left-hand pixel
	const O = [ORIGIN - 150, ORIGIN + 10];
	const P = ([x, y]) => [O[0] + x, O[1] - y];
	const mid = [((PIXELS - 1) * B) / 2, 0];
	// the crests: each a segment of the line n.x = m lambda, centred where the line along n through the middle meets it;
	// remembered now, so that every label keeps clear of them, and drawn last, broken round the labels set over them
	const crests = [];
	for (const m of CRESTS) {
		const c = [mid[0] + (m * LAMBDA - dot(mid, nh)) * nh[0], mid[1] + (m * LAMBDA - dot(mid, nh)) * nh[1]];
		check(near(dot(c, nh), m * LAMBDA, 1e-9), `the crest ${m} is not at n.x = m lambda`);
		const a = [c[0] - HALF_CREST * along[0], c[1] - HALF_CREST * along[1]], b = [c[0] + HALF_CREST * along[0], c[1] + HALF_CREST * along[1]];
		crests.push({ m, a: P(a), b: P(b) });
		S.mark([P(a), P(b)], CREST_W / 2, `the crest ${m}`);
	}
	const drawCrests = () => {
		S.marks = S.marks.filter((k) => !isCrest(k.what));
		for (const { m, a, b } of crests) {
			const len = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.ceil(len / 0.05);
			const at = (i) => [a[0] + ((b[0] - a[0]) * i) / n, a[1] + ((b[1] - a[1]) * i) / n];
			const ok = (q) => cuts.every((box) => toBox(box, q) - CREST_W / 2 >= BREAK);
			let start = null, pieces = 0;
			for (let i = 0; i <= n + 1; i++) {
				const good = i <= n && ok(at(i));
				if (good && start === null) start = i;
				if (!good && start !== null) {
					const p0 = at(start), p1 = at(i - 1);
					if (Math.hypot(p1[0] - p0[0], p1[1] - p0[1]) >= PIECE) { S.path([p0, p1], { color: RULE, width: CREST_W, layer: 0.5, cap: 'butt', what: `the crest ${m}` }); pieces++; }
					start = null;
				}
			}
			check(m !== 0 || pieces === 1, 'the crest through the origin is broken');
		}
	};
	// the segments n.x_p: from each pixel along -n to the crest through the origin
	const feet = [];
	for (let p = 1; p < PIXELS; p++) {
		const x = [p * B, 0];
		const len = dot(x, nh);
		check(near(len, delay(p) * LAMBDA, 1e-9) && near(len, (p * LAMBDA) / 6, 1e-9), `the segment of pixel ${p} is not p b sin 30`);
		const foot = [x[0] - len * nh[0], x[1] - len * nh[1]];
		check(near(dot(foot, nh), 0, 1e-9), `the segment of pixel ${p} does not end on the crest through the origin`);
		check(near(dot([x[0] - foot[0], x[1] - foot[1]], along), 0, 1e-9), `the segment of pixel ${p} is not at right angles to the crests`);
		// the crest through the origin reaches every foot
		check(Math.abs(dot([foot[0] - mid[0] + dot(mid, nh) * nh[0], foot[1] - mid[1] + dot(mid, nh) * nh[1]], along)) < HALF_CREST - 3, `the crest through the origin does not reach the foot of ${p}`);
		S.path([P(x), P(foot)], { color: ACCENT, width: SEG_W, layer: 2, dash: SEG_DASH, cap: 'butt', what: `the segment of pixel ${p}` });
		feet.push(foot);
	}
	// the pixels, over everything
	for (let p = 0; p < PIXELS; p++) {
		const [x, y] = P([p * B, 0]);
		const box = { l: x - SQ / 2, r: x + SQ / 2, t: y - SQ / 2, b: y + SQ / 2 };
		S.fill(pathOf([[box.l, box.t], [box.r, box.t], [box.r, box.b], [box.l, box.b]]), box, { color: INK, layer: 3, what: `pixel ${p}` });
	}
	// n from the middle of the row, the normal, the angle
	const n0 = P(mid), n1 = P([mid[0] + N_LEN * nh[0], mid[1] + N_LEN * nh[1]]);
	const nArrow = S.arrow(n0, n1, { color: INK, width: VEC, head: VEC_HEAD, layer: 4, what: 'n' });
	check(nArrow.head <= 0.4 * nArrow.L, 'n\'s head');
	S.path([[n0[0], n0[1] - SQ / 2 - 0.8], [n0[0], n0[1] - NORMAL]], { color: DIM, width: ZERO_LINE + 0.1, dash: ZERO_DASH, layer: 1, cap: 'butt', what: 'the normal' });
	{
		const arc = Array.from({ length: 121 }, (_, j) => { const g = (THETA * j) / 120; return P([mid[0] + ARC * Math.sin(g), ARC * Math.cos(g)]); });
		S.path(arc, { color: DIM, width: HAIR, layer: 1, what: 'the angle' });
		// the angle's name, left of the normal at the arc's top
		const q = P([mid[0], ARC]);
		L.push(await S.clear('30^\\circ', q[0] - LABEL_GAP - 1, q[1], 1, 0.5, [-1, 0], { color: DIM }));
	}
	// n's name, over its tip, the crests broken beneath it
	L.push(await over('\\hat n\\ (\\text{toward the source})', n1[0], n1[1] - LABEL_GAP - 0.6, 0.5, 1, [0, -1], INK));
	// the segments' names: n.x_5 beside the last segment, on its open side; n.x_1 beyond the first segment's foot,
	// across the crest through the origin
	{
		const f = feet[PIXELS - 2], x = [(PIXELS - 1) * B, 0];
		const m = P([(f[0] + x[0]) / 2, (f[1] + x[1]) / 2]);
		const side = [along[0], -along[1]];
		L.push(await S.clear(`\\hat n\\cdot\\boldsymbol x_${PIXELS - 1}`, m[0] + 1.5, m[1], 0, 0.5, side, { color: ACCENT }));
		// n.x_1 beyond the first segment's foot, across the crest through the origin, below and to the left
		const g = P([feet[0][0] - 2.6 * nh[0], feet[0][1] - 2.6 * nh[1]]);
		L.push(await S.clear('\\hat n\\cdot\\boldsymbol x_1', g[0], g[1], 1, 0, [-nh[0], nh[1]], { color: ACCENT }));
	}
	// the first pixel's index, over it, clear of the crest through the origin
	{
		const o = P([0, 0]);
		L.push(await S.clear('p = 0', o[0], o[1] - SQ / 2 - LABEL_GAP - 0.4, 0.5, 1, [0, -1], { color: DIM }));
	}

	drawCrests();

	// ---- the right panel: the records
	const leftInk = Math.max(...S.marks.flatMap((m) => m.pts.map((q) => q[0] + m.r)), ...S.boxes.map((b) => b.box.r), ...L.map((l) => l.box.r));
	const tau = (p) => (delay(p) / 1) * T;                      // n.x_p / c in points of time: delay in wavelengths times T
	for (let p = 0; p < PIXELS; p++) check(near(tau(p), (p * T) / 6, 1e-12), `the delay of record ${p} is not p T/6`);
	const lead = tau(PIXELS - 1);                               // the earliest start, before the first record's
	const W1 = CYCLES * T + lead;                               // the recorded block's width
	const X1 = leftInk + APART + 16;                            // the recorded block's left edge (time -lead)
	const X2 = X1 + W1 + SHIFT;                                 // the lined-up block's left edge (time 0)
	const Y0 = O[1] - 0.5 * (PITCH * (PIXELS - 1) + SUM_GAP + 13 * AMP) + AMP;   // the first record's line, the stack centred on the row
	const F = (s) => (s < 0 || s > CYCLES ? 0 : Math.sin(2 * Math.PI * s));   // the record at the origin, s = t/T
	const row = (p) => Y0 + p * PITCH;
	const trace = (x0, y, a, b, amp, f, what, width = CURVE) => {
		// f of the time in periods on [a, b], the time a at the page x0
		const Pl = new Plot({ left: x0, top: y - amp, w: (b - a) * T, h: 2 * amp, x0: a, x1: b, y0: -1, y1: 1 });
		const pts = graph(Pl, f, a, b);
		check(longest(pts) <= 0.2501, `${what} is coarse`);
		S.path(pts, { color: INK, width, layer: 2, cap: 'butt', what });
		return Pl;
	};
	const crests1 = [];
	for (let p = 0; p < PIXELS; p++) {
		const d = tau(p) / T;                                   // the delay in periods
		// recorded: u_p(t) = F(t + d), a train from t = -d to CYCLES - d
		const Pl = trace(X1 + (lead - tau(p)), row(p), -d, CYCLES - d, AMP, (s) => F(s + d), `record ${p} as recorded`);
		crests1.push(Pl.at(0.25 - d, 1));
		check(near(F(0.25 - d + d), 1, 1e-12), `record ${p}'s first crest`);
		// lined up: u_p(t - d) = F(t)
		trace(X2, row(p), 0, CYCLES, AMP, (s) => F(s), `record ${p} lined up`);
	}
	// the sum: six times one record
	const ySum = row(PIXELS - 1) + AMP + SUM_GAP + 6 * AMP;
	for (let s = 0; s <= CYCLES; s += 0.01) {
		let sum = 0;
		for (let p = 0; p < PIXELS; p++) sum += F(s - tau(p) / T + tau(p) / T);
		check(near(sum, 6 * F(s), 1e-12), `the sum at ${s}`);
	}
	const SumP = trace(X2, ySum, 0, CYCLES, 6 * AMP, F, 'the sum', CURVE + 0.15);
	// the slanted line through the recorded first crests, a little beyond the first and the last
	{
		const a = crests1[0], b = crests1[PIXELS - 1];
		const u = [(b[0] - a[0]) / Math.hypot(b[0] - a[0], b[1] - a[1]), (b[1] - a[1]) / Math.hypot(b[0] - a[0], b[1] - a[1])];
		for (const c of crests1) check(Math.abs((c[0] - a[0]) * u[1] - (c[1] - a[1]) * u[0]) < 1e-9, 'the recorded crests are not on one line');
		const ext = 3.5;
		S.path([[a[0] - ext * u[0], a[1] - ext * u[1] - 0], [b[0] + ext * u[0], b[1] + ext * u[1]]], { color: ACCENT, width: SEG_W, dash: SEG_DASH, layer: 2.5, cap: 'butt', what: 'the slanted line' });
	}
	// the upright line through the lined-up first crests, down to the sum's
	{
		const x = X2 + 0.25 * T;
		check(near(SumP.X(0.25), x, 1e-9), 'the sum\'s first crest is not under the records\'');
		S.path([[x, row(0) - AMP - 3.5], [x, SumP.Y(1)]], { color: ACCENT, width: SEG_W, dash: SEG_DASH, layer: 2.5, cap: 'butt', what: 'the upright line' });
	}
	// the shift's arrow, between the blocks at the records' middle, named in two lines over it
	{
		const y = (row(0) + row(PIXELS - 1)) / 2;
		const a = S.arrow([X1 + W1 + 4, y], [X2 - 4, y], { color: INK, width: AXIS + 0.1, head: AXIS_HEAD, layer: 3, what: 'the shift' });
		check(a.head <= 0.4 * a.L, 'the shift\'s head');
		const l2 = await placed('\\hat n\\cdot\\boldsymbol x_p/c', (X1 + W1 + X2) / 2, y - LABEL_GAP - 1.2, 0.5, 1, INK);
		const l1 = await placed('\\text{shift by}', (X1 + W1 + X2) / 2, l2.box.t - 2.2, 0.5, 1, INK);
		L.push(l1, l2);
	}
	// the records' names and the sum's
	L.push(await S.clear('p = 0', X1 - LABEL_GAP - 1, row(0), 1, 0.5, [-1, 0], { color: DIM }));
	L.push(await S.clear(`p = ${PIXELS - 1}`, X1 - LABEL_GAP - 1, row(PIXELS - 1), 1, 0.5, [-1, 0], { color: DIM }));
	L.push(await S.clear('\\text{sum}', X2 - LABEL_GAP - 1, ySum, 1, 0.5, [-1, 0], { color: INK }));
	L.push(await S.clear('\\text{recorded}', X1 + W1 / 2, row(0) - AMP - LABEL_GAP - 1, 0.5, 1, [0, -1], { color: DIM }));
	// time, under the recorded block
	{
		const y = row(PIXELS - 1) + AMP + 7;
		S.arrow([X1, y], [X1 + W1, y], { color: DIM, width: AXIS, head: AXIS_HEAD, layer: 1, what: 'the time axis' });
		L.push(await placed('t', X1 + W1 + LABEL_GAP + 0.5, y, 0, 0.5, DIM));
	}

	S.checkAll(L);
	window[name + '-numbers'] = { ...nums, b: B, lambda: LAMBDA, T, delays: [0, 1, 2, 3, 4, 5].map(tau) };
	return finish(S, L, [240, 340]);
}
