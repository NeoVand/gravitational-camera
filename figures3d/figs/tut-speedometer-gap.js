// The tutorial, section 9.3 (tutorial/one-point/the-matrix-w.md), its third diagram: how well a pixel reads its speed,
// and where it is blind. Left: the error sigma_v of one component of the velocity read, against the gap between the two
// eigenvalues that component faces, both axes logarithmic (Part 3's log axes, figs/tut-prob-lib.js, with section 3.8's
// decade numbers): the gap from 10^-10 to 10^-6 s^-2, sigma_v from 10^-2 to 10^3 m/s, one thin ink line
// sigma_v = c sigma_n / (sqrt 2 gap) for sigma_n = 10^-16 s^-2, and two ink dots, a gap of 10^-8 (2.1 m/s) and the
// person's 3GM/r^3 = 1.40 x 10^-8 (1.5 m/s). Right: the person's three eigenvalues on an axis of tide in 10^-9 s^-2, an
// orange tick at -9.34 (the stretch, along the line) and two touching blue ticks at +4.67 (two squeezes); a thin bracket
// over the gap 14.0 between the stretch and the squeezes, "across: read", and a dashed bracket over the zero gap between
// the two squeezes, "along the line: blind". Orange and blue only for the stretch and the squeezes.
// Departures from the diagram's comment: the panels stay side by side at every width, one drawing about 320 points
// wide, so that a phone shows the same figure; the axes' names stand under them, on one baseline; the two equal
// squeezes are two ticks end to end on the line of their value, a hair apart so that they read as two; the dashed
// bracket is a low dashed arch over the two ticks, its words above it; the person's label is set on two lines.
// Exact: the line (eq:precision), sampled every half point; the dots at their computed places; the eigenvalues
// -2GM/r^3 and GM/r^3 for 70 kg at 1 m, and the gap 3GM/r^3, at their values on the axis (figs/tut-matrix-w-lib.js,
// asserted against the chapter's text and the comment's numbers). Schematic: nothing.
import { Sheet, ORIGIN, finish, checker, placed, near, n2, AXIS, HAIR, TICK, LABEL_GAP } from './tut-pot-lib.js';
import { Plot, xAxis, yAxis } from './tut-prob-lib.js';
import { INK, DIM, ACCENT, ACCENT2 } from '../lib.js';
import { chapter, sigmaV, GAP_RANGE, SIGMA_RANGE, SIGMA_N } from './tut-matrix-w-lib.js';

const name = 'tut-speedometer-gap';
const check = checker(name);
const lg = Math.log10;

const PW = 140, PH = 120;                     // the left plot
const GAP = 46;                               // from the left plot's right edge to the right panel's axis
const LINE_W = 0.6;                           // the line
const DOT = 1.6;                              // a dot's radius
const T0 = -11.5, T1 = 9;                     // the right axis, 10^-9 s^-2
const BAR = 1.3, BAR_LEN = 10, BAR_IN = 2.5;  // an eigenvalue's tick: stroke, length, air from the axis
const PAIR_GAP = 0.7;                         // the hair between the two equal squeezes' ticks
const BRACKET = 7;                            // from the ticks' right end to the bracket
const ARCH = 6;                               // the dashed arch's height over the ticks
const DASH = [1.6, 1.1], ARCH_W = 0.6;   // the dashed arch: its dashes and stroke, heavier than a hairline because the caption starts there
const OFF = 4;                                // the left plot's axes, off its edges
const NAME_DROP = 7;                          // from the lowest axis number to the axes' names

export default async function () {
	const nums = await chapter(check);
	const person = nums.person;
	const S = new Sheet(name);
	const L = [];

	// ---- the left plot: sigma_v against the gap, log-log
	const P = new Plot({ left: ORIGIN - 165, top: ORIGIN - PH / 2, w: PW, h: PH, x0: lg(GAP_RANGE[0]), x1: lg(GAP_RANGE[1]), y0: lg(SIGMA_RANGE[0]), y1: lg(SIGMA_RANGE[1]) });
	check(P.x0 === -10 && P.x1 === -6 && P.y0 === -2 && P.y1 === 3, 'the axes\' ranges');
	const pow = (t) => (t === 0 ? '1' : t === 1 ? '10' : `10^{${t}}`);
	// the axes stand a little off the plot, so that the numbers at their meeting corner keep apart
	const xl = await xAxis(S, P, { ticks: [-10, -9, -8, -7, -6], fmt: pow, y: P.bottom + OFF, what: 'the gap axis' });
	const yl = await yAxis(S, P, { ticks: [-2, -1, 0, 1, 2, 3], fmt: pow, x: P.left - OFF, what: 'the speed axis' });
	L.push(...xl, ...yl);
	// the line, every half point along the page
	const n = Math.ceil(Math.hypot(PW, PH) / 0.5);
	const pts = Array.from({ length: n + 1 }, (_, i) => { const x = P.x0 + ((P.x1 - P.x0) * i) / n; return P.at(x, lg(sigmaV(10 ** x))); });
	check(pts.every(([, y]) => y >= P.top - 1e-9 && y <= P.bottom + 1e-9), 'the line leaves the plot');
	check(near(lg(sigmaV(1e-9)) - lg(sigmaV(1e-8)), 1, 1e-12), 'the line\'s slope is not -1');
	S.path(pts, { color: INK, width: LINE_W, layer: 2, what: 'the line' });
	// the dots
	const dotA = P.at(-8, lg(nums.sigmaAt[0])), dotB = P.at(lg(person.gap), lg(nums.sigmaAt[1]));
	check(nums.sigmaAt[0].toFixed(1) === '2.1' && nums.sigmaAt[1].toFixed(1) === '1.5' && near(nums.sigmaAt[1], sigmaV(person.gap), 1e-12), 'the dots\' speeds');
	for (const [q, what] of [[dotA, 'the dot at 10^-8'], [dotB, 'the person\'s dot']]) {
		S.raw(`<circle cx="${n2(q[0])}" cy="${n2(q[1])}" r="${DOT}" fill="${INK}"/>`, 3);
		S.mark([q], DOT, what);
	}
	check(Math.hypot(dotA[0] - dotB[0], dotA[1] - dotB[1]) > 2 * DOT + 1.5, 'the two dots touch');
	// their labels, off the line: the first below it to the left, the second above it to the right
	L.push(await S.clear('\\text{gap }10^{-8}\\text{: }2.1\\ \\mathrm{m/s}', dotA[0] - 3, dotA[1] + 3, 1, 0, [-0.6, 0.8]));
	{
		// three lines, the block's lower left corner up and to the right of the dot, moved off the line if need be
		const lines = ['\\text{the person’s }3GM/r^3', '= 1.40\\times10^{-8}\\text{:}', '1.5\\ \\mathrm{m/s}'];
		check(lines[1].includes((person.gap / 1e-8).toFixed(2)) && lines[2].startsWith(nums.sigmaAt[1].toFixed(1)), 'the person\'s label');
		let got = null;
		for (let s = 0; s < 40 && !got; s += 0.25) {
			const x = dotB[0] + 3.5 + 0.6 * s;
			let yb = dotB[1] - 3.5 - 0.8 * s;
			const parts = [];
			for (const src of [...lines].reverse()) { const q = await placed(src, x, yb, 0, 1); parts.push(q); yb = q.box.t - 2.2; }
			const box = { l: Math.min(...parts.map((q) => q.box.l)), r: Math.max(...parts.map((q) => q.box.r)), t: Math.min(...parts.map((q) => q.box.t)), b: Math.max(...parts.map((q) => q.box.b)) };
			if (S.clearance(box).d >= LABEL_GAP + 0.2) got = { src: lines.join(' '), svg: parts.map((q) => q.svg).join(''), box };
		}
		check(got, 'no room for the person\'s label');
		L.push(got);
		check(got.box.r <= P.right + 20 && got.box.t >= P.top, 'the person\'s label leaves the plot');
	}
	// the line's own label, at the lower left, under the line
	{
		const g = await placed(`\\sigma_n = 10^{${lg(SIGMA_N)}}\\ \\mathrm{s^{-2}}`, P.left + 7, P.bottom - 4, 0, 1, DIM);
		const f = await placed('\\sigma_v = c\\,\\sigma_n/(\\sqrt2\\,\\text{gap})', P.left + 7, g.box.t - 2.4, 0, 1);
		L.push(f, g);
		check(near(lg(SIGMA_N), -16, 1e-12), 'sigma_n');
	}

	// ---- the right panel: the person's three eigenvalues
	const Xa = P.right + GAP;
	const Q = new Plot({ left: Xa, top: P.top, w: 1, h: PH, x0: 0, x1: 1, y0: T0, y1: T1 });
	const ql = await yAxis(S, Q, { ticks: [-10, -5, 0, 5], fmt: String, what: 'the tide axis' });
	L.push(...ql);
	const u = 1e-9;
	const stretch = person.stretch / u, squeeze = person.squeeze / u;
	check(stretch.toFixed(2) === '-9.34' && squeeze.toFixed(2) === '4.67' && (person.gap / u).toFixed(1) === '14.0', 'the person\'s eigenvalues');
	check(near(squeeze - stretch, person.gap / u, 1e-9), 'the gap is not the squeeze less the stretch');
	const ys = Q.Y(stretch), yq = Q.Y(squeeze);
	const x0 = Xa + BAR_IN;
	S.path([[x0, ys], [x0 + BAR_LEN, ys]], { color: ACCENT, width: BAR, cap: 'butt', layer: 2, what: 'the stretch' });
	const half = (BAR_LEN - PAIR_GAP) / 2;
	S.path([[x0, yq], [x0 + half, yq]], { color: ACCENT2, width: BAR, cap: 'butt', layer: 2, what: 'a squeeze' });
	S.path([[x0 + half + PAIR_GAP, yq], [x0 + BAR_LEN, yq]], { color: ACCENT2, width: BAR, cap: 'butt', layer: 2, what: 'a squeeze' });
	// the bracket over the gap between the stretch and the squeezes, with ticks toward the ticks
	const xb = x0 + BAR_LEN + BRACKET;
	S.path([[xb - TICK, ys], [xb, ys], [xb, yq], [xb - TICK, yq]], { color: INK, width: HAIR, cap: 'butt', layer: 1, what: 'the bracket' });
	const lx = xb + LABEL_GAP + 1.2;
	{
		const a = await placed('\\text{gap }14.0', lx, (ys + yq) / 2 - 1.2, 0, 1);
		const b = await placed('\\text{across: read}', lx, (ys + yq) / 2 + 1.2, 0, 0);
		check(a.src.includes((person.gap / u).toFixed(1)), 'the gap\'s label');
		L.push(a, b);
	}
	L.push(await placed('\\text{two squeezes}', lx, yq, 0, 0.5));
	{
		const a = await placed('\\text{stretch, along}', lx, ys - 1.2, 0, 1);
		const b = await placed('\\text{the line}', lx, ys + 1.2, 0, 0);
		L.push(a, b);
	}
	// the dashed arch over the two squeezes' ticks: the zero gap
	{
		const xa = x0 + 0.8, xc = x0 + BAR_LEN - 0.8, top = yq - BAR / 2 - ARCH;
		S.path([[xa, yq - BAR / 2 - 0.9], [xa, top], [xc, top], [xc, yq - BAR / 2 - 0.9]], { color: INK, width: ARCH_W, dash: DASH, cap: 'butt', layer: 1, what: 'the dashed bracket' });
		const b = await placed('\\text{blind}', xa, top - LABEL_GAP - 0.4, 0, 1);
		const a = await placed('\\text{along the line:}', xa, b.box.t - 2.2, 0, 1);
		L.push(a, b);
		check(person.along === 0 && near(person.stretch + 2 * person.squeeze, 0, 1e-24), 'the two squeezes are not equal');
	}

	// ---- the axes' names, under them, on one baseline
	const foot = Math.max(...xl.map((q) => q.box.b), ...ql.map((q) => q.box.b)) + NAME_DROP;
	L.push(await placed('\\text{gap }|\\lambda_b - \\lambda_c|\\ (\\mathrm{s^{-2}})', P.left + PW / 2, foot, 0.5, 0, DIM));
	L.push(await placed('\\text{tide }(10^{-9}\\ \\mathrm{s^{-2}})', Xa, foot, 0.5, 0, DIM));
	L.push(await placed('\\sigma_v\\ (\\mathrm{m/s})', P.left + 4, P.top - LABEL_GAP, 0, 1, DIM));

	S.checkAll(L);
	window[name + '-numbers'] = { sigmaAt: nums.sigmaAt, person };
	return finish(S, L, [280, 340]);
}
