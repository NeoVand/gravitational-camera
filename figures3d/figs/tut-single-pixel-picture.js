// The tutorial, section 9.6 (tutorial/one-point/the-sky-at-one-point.md), its second diagram: a single pixel's picture
// of one point source, K(theta) of eq:picture, against the angle theta from the source, 0 to 180 degrees. One solid
// curve in the sky's colour (the curvature's, as in all of Part 9) and a thin pale line at zero. Marked: the half
// height at 25.8 degrees, by a short dimension line at K = 1/2 from the source to the curve, "51.6 degrees full width"
// under it; the four zeros, 43.9, 80.4, 116.5 and 152.3 degrees, by dots on the zero line; the dip, -0.152 at 59.5
// degrees, by a dot and its value; the value 0.2 at 180 degrees, by a dot and its value. Each marked angle has a tick
// on the theta axis with its number, joined to its mark by a dotted line. A dashed curve in the light role's colour for
// a point sensor of light, (1/9) sum_{l <= 2} (2l + 1) P_l(cos theta), and a key of two lines at the upper right,
// "gravity: degrees up to 4" and "light: degrees up to 2, 88.5 degrees full width". No orange or blue.
// Departures from the diagram's comment: the dip is labelled "-0.152" at 59.5 degrees, its exact value and place, where
// the comment had "-0.15 at 60" (59.48 is 59.5, not 60, to the places the chapter prints); the theta axis carries ticks
// only at the marked angles, 0, 25.8, 43.9, 59.5, 80.4, 116.5, 152.3 and 180 degrees, so that each mark's angle is read
// on the axis rather than in a label crowded between the curves near zero, where both curves stay within 0.16 of the
// line; the dimension line runs from the source to the half height, half the full width, since the plot starts at the
// source; the curves are named in a key, and light's full width stands there.
// Exact: both curves, from Bonnet's recurrence (figs/tut-sph-legendre.js), sampled every quarter of a point along their
// length; every mark, found by bisection and golden sections in figs/tut-sky-lib.js and asserted against the chapter's
// text. Nothing is schematic.
import { Sheet, ORIGIN, finish, checker, placed, near, LABEL_GAP, HAIR, TICK, n2 } from './tut-pot-lib.js';
import { Plot, xAxis, yAxis, dimension, NUM } from './tut-prob-lib.js';
import { graph, longest, CURVE } from './tut-fourier-lib.js';
import { DASH, DOT } from './tut-bessel-lib.js';
import { INK, DIM, FAINT, RULE } from '../lib.js';
import { chapter, K, lightK, CURV, LIGHT } from './tut-sky-lib.js';

const name = 'tut-single-pixel-picture';
const check = checker(name);

const PW = 285, PH = 150;                  // the plot, points
const Y0 = -0.3, Y1 = 1.04;                // its range up
const OFF = 5;                             // the K axis stands this far left of theta = 0
const ZERO = HAIR;                         // the line at zero
const SWATCH = 14;                         // a key's line
const KEY_SKIP = 4.5;                      // between the key's two lines

export default async function () {
	const nums = await chapter(check);
	const m = nums.marks;
	const S = new Sheet(name);
	const L = [];
	const P = new Plot({ left: ORIGIN - PW / 2, top: ORIGIN - PH / 2, w: PW, h: PH, x0: 0, x1: 180, y0: Y0, y1: Y1 });

	// ---- the line at zero, and the two curves
	S.path([P.at(0, 0), P.at(180, 0)], { color: RULE, width: ZERO, layer: 0, cap: 'butt', what: 'the line at zero' });
	const solid = graph(P, K, 0, 180), dashedPts = graph(P, lightK, 0, 180);
	for (const [k, pts] of [['the picture', solid], ['light\'s picture', dashedPts]]) {
		check(longest(pts) <= 0.2501, `${k} is coarse`);
		check(pts.every(([, y]) => y > P.top && y < P.bottom), `${k} leaves the plot`);
	}
	S.path(dashedPts, { color: LIGHT, width: CURVE, layer: 2, dash: DASH, cap: 'butt', what: 'light\'s picture' });
	S.path(solid, { color: CURV, width: CURVE, layer: 2.1, cap: 'butt', what: 'the picture' });

	// ---- the axes: K at the left, ticks at 0, 0.5 and 1; theta along the bottom, ticks at the marked angles only
	L.push(...(await yAxis(S, P, { ticks: [0, 0.5, 1], fmt: (t) => (t === 0.5 ? '0.5' : String(t)), x: P.left - OFF, what: 'the K axis' })));
	const marked = [0, m.half, ...m.zeros.slice(0, 1), m.dip.x, ...m.zeros.slice(1), 180];
	const printed = marked.map((t) => (t === 0 || t === 180 ? String(t) : t.toFixed(1)));
	check(printed.join() === '0,25.8,43.9,59.5,80.4,116.5,152.3,180', `the marked angles ${printed}`);
	const xs = await xAxis(S, P, { ticks: marked, fmt: (t) => `${printed[marked.indexOf(t)]}^\\circ`, from: 0, what: 'the theta axis' });
	S.path([[P.left - OFF, P.bottom], [P.X(0), P.bottom]], { color: DIM, width: 0.45, layer: 1, cap: 'butt', what: 'the theta axis\'s start' });
	L.push(...xs);
	const last = xs[xs.length - 1];
	L.push(await placed('\\vartheta', last.box.r + 5, (last.box.t + last.box.b) / 2, 0, 0.5, DIM));
	L.push(await placed('K(\\vartheta)', P.left - OFF, P.top - 6, 0.5, 1, DIM));

	// ---- the marks: a dot at each, and a dotted line down to its tick
	const dot = (q, what) => { S.raw(`<circle cx="${n2(q[0])}" cy="${n2(q[1])}" r="${DOT}" fill="${INK}"/>`, 3); S.mark([q], DOT, what); };
	const points = [...m.zeros.map((z) => [z, 0, `the zero at ${z.toFixed(1)}`]), [m.dip.x, m.dip.y, 'the dip'], [180, m.back, 'the value behind']];
	for (const [t, v, what] of points) {
		check(near(K(t), v, 1e-9), `${what} is not on the curve`);
		dot(P.at(t, v), what);
	}
	for (const [t, v] of [[m.half, 0.5], ...points.map(([t, v]) => [t, v])]) {
		const [x, y] = P.at(t, v);
		S.dots([x, y], [x, P.bottom], { color: FAINT, clear0: t === m.half ? 2.2 + 0.9 : DOT + 0.9, clear1: 0.9, layer: 0.5, what: `the dotted line at ${t.toFixed(1)}` });
	}

	// ---- the half height: a dimension line at K = 1/2 from the source to the curve, the full width under it
	{
		const y = P.Y(0.5);
		check(near(K(m.half), 0.5, 1e-12), 'the half height is not on the curve');
		dimension(S, P.X(0), P.X(m.half), y, { color: INK, width: HAIR + 0.15, what: 'the half width' });
		const w = `${m.full.toFixed(1)}^\\circ`;
		check(w === '51.6^\\circ', `the full width ${w}`);
		const top = y + 2.2 + LABEL_GAP + 0.4;
		// centred between the K axis and the dotted line under the curve's half height
		const mid = (P.left - OFF + P.X(m.half)) / 2;
		const a = await placed(w, mid, top, 0.5, 0, INK);
		const b = await placed('\\text{full width}', mid, a.box.b + 2, 0.5, 0, INK);
		L.push({ src: `${w} full width`, svg: a.svg + b.svg, box: { l: Math.min(a.box.l, b.box.l), r: Math.max(a.box.r, b.box.r), t: a.box.t, b: b.box.b } });
	}

	// ---- the dip's value, right of its dotted line and under the curve; the value behind, right of the plot
	{
		const [x, y] = P.at(m.dip.x, m.dip.y);
		const v = m.dip.y.toFixed(3);
		check(v === '-0.152', `the dip ${v}`);
		L.push(await S.clear(v, x + 1.2, y + DOT + LABEL_GAP, 0, 0, [1, 0]));
	}
	{
		const [x, y] = P.at(180, m.back);
		check(m.back.toFixed(1) === '0.2', `the value behind ${m.back}`);
		L.push(await placed('0.2', x + DOT + LABEL_GAP + 0.6, y, 0, 0.5, INK));
	}

	// ---- the key, at the upper right
	{
		const rows = [
			{ text: '\\text{gravity: degrees up to 4}', dash: null, color: CURV },
			{ text: `\\text{light: degrees up to 2, }${m.lightFull.toFixed(1)}^\\circ\\text{ full width}`, dash: DASH, color: LIGHT }
		];
		check(m.lightFull.toFixed(1) === '88.5', 'light\'s width');
		const x0 = P.X(62);
		let y = P.Y(0.93);
		for (const r of rows) {
			const t = await placed(r.text, x0 + SWATCH + LABEL_GAP + 1, y, 0, 0.5, INK);
			S.path([[x0, y], [x0 + SWATCH, y]], { color: r.color, width: CURVE, layer: 2, dash: r.dash, cap: 'butt', what: `the key's line ${r.color === CURV ? 'gravity' : 'light'}` });
			L.push(t);
			y = t.box.b + KEY_SKIP + (t.box.b - t.box.t) / 2;
		}
	}

	S.checkAll(L);
	window[name + '-numbers'] = { ...m };
	return finish(S, L, [260, 340]);
}
