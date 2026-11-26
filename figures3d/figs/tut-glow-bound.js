// The tutorial, section 10.3 (tutorial/glow/why-matter-barely-glows.md), its fifth diagram: where a weight of friction
// glows most. One panel on linear axes: across, x = hbar omega / k_B T from 0 to 10; the curve x^3 / (e^x - 1), thin
// and neutral, its top at x = 2.821 marked by a dot and "1.421". Under it, four frictions of equal area (equal weights,
// by section 4.5's sum), shaded in a pale tint of matter's colour (tut-glow-lib.js FILL) with a thin outline in matter's colour: a narrow line at
// x = 2.821, "equality / 100%"; silicon's line at x = 2.553 (520 cm^-1), "silicon / 98.5%"; diamond's line at
// x = 6.546 (1333 cm^-1), "diamond's line / 28%"; and copper's electrons, Drude's 1 / (1 + omega^2 tau^2) with
// omega tau = 0.959 x (tau = 2.5 x 10^-14 s at 293 K), "copper's electrons / 37.5%".
// Departures from the diagram's comment: the percentages are the chapter's own (98.5% for silicon and 37.5% for
// copper's electrons, the text's numbers for these models, where the comment wrote the paper's rounded 98% and 38%);
// each name and its percentage stand on two lines, so that the labels fit beside their shapes without touching the
// curve; copper's label stands left of x = 0, at the shoulder's start, since the shoulder lies below the curve's rise;
// there is no axis up, the frictions' heights being schematic and the curve's scale given by its top, 1.421. The three
// lines have one schematic width (half-width 0.07 in x), so their equal areas make them equally tall, and diamond's
// line rises above the curve's tail. Each outline is left out where it is within a point of the axis.
// Exact: the curve and its top (tut-planck-lib.js), the lines' places (x = 2 pi c nu hbar / k_B T at 293 K),
// copper's shape and its omega tau, the equal areas (each friction's whole area, its tails included, asserted equal),
// and the four percentages (tut-glow-lib.js: silicon's and diamond's lines as damped oscillators of their measured Q,
// copper's as Drude's). Schematic, as the caption says: the lines' widths, and so the heights of all four.
import { Sheet, ORIGIN, finish, checker, placed, boxOf, LABEL_GAP, SIZE, n2 } from './tut-pot-lib.js';
import { Plot, xAxis, pathOf } from './tut-prob-lib.js';
import { graph, longest } from './tut-fourier-lib.js';
import { tex, INK, DIM } from '../lib.js';
import { chapter, palette, near, simpson, F, TOP, ENERGY, DRUDE, FILL, MATTER } from './tut-glow-lib.js';

const name = 'tut-glow-bound';
const check = checker(name);

// ---- the drawing (points) ----------------------------------------------------------------------------------------
const X1 = 10, Y1 = 1.56;
const DX = 25.5, DY = 92;                       // points per unit across and up
const CURVE = 0.6;                              // the curve x^3 / (e^x - 1)
const OUTLINE = 0.5;                            // a friction's outline
const H = 1.12, GAMMA = 0.07;                   // the lines: their height and half-width (schematic)
const CLEAR = 1.0;                              // an outline is left out where it is nearer the axis than this (pt)
const DOT = 1.55;
const LEAD = 10.2;                              // a two-line label: baseline to baseline
const caption = 'Look first at the spike at the top of the curve: a weight glows the most when it all sits where $x^3/(e^x - 1)$ is largest, which is the bound. Silicon\'s line sits close to it, diamond\'s far down the Wien tail, and copper\'s spread-out friction wastes most of its weight at low frequency. The shapes have equal areas; their heights are schematic.';

export default async function () {
	const { state, x, share } = await chapter(check);
	await palette(check);
	state(name, 'glow-bound', caption);

	const S = new Sheet(name);
	const L = [];
	const W = X1 * DX, Hp = Y1 * DY;
	const P = new Plot({ left: ORIGIN - W / 2, top: ORIGIN - Hp / 2, w: W, h: Hp, x0: 0, x1: X1, y0: 0, y1: Y1 });

	// ---- the frictions, equal in area: three lines of height H and half-width GAMMA, and copper's shoulder
	const line = (x0) => (y) => H / (1 + ((y - x0) / GAMMA) ** 2);
	const A = 2 * DRUDE * GAMMA * H;                // pi H GAMMA = A pi / (2 DRUDE)
	const copper = (y) => A / (1 + (DRUDE * y) ** 2);
	const shapes = [
		{ key: 'copper', f: copper, from: 0, to: X1 },
		{ key: 'silicon', f: line(x.silicon), from: 0, to: X1 },
		{ key: 'equality', f: line(ENERGY), from: 0, to: X1 },
		{ key: 'diamond', f: line(x.diamond), from: 0, to: X1 }
	];
	{
		// the whole areas, the tails included: the lines' pi H GAMMA (less what lies below x = 0), copper's
		const whole = (f, a) => simpson(f, a, 4000, 4000000) + (a > 0 ? simpson(f, 0, a, 40000) : 0);
		const ref = Math.PI * H * GAMMA;
		for (const s of shapes) {
			const area = whole(s.f, 0) + (s.key === 'copper' ? 0 : simpson(s.f, -4000, 0, 4000000));
			check(near(area, ref, 2e-3 * ref), `the area of ${s.key} is ${area}, not ${ref}`);
		}
		// what the drawing leaves out, below x = 0 and beyond x = 10, is under a tenth of a point tall
		for (const s of shapes) if (s.key !== 'copper') check(s.f(0) * DY < 0.1 && s.f(X1) * DY < 0.1, `${s.key}'s ends`);
		check(near(H, line(ENERGY)(ENERGY), 0) && H < F(x.silicon) && H < TOP, 'the lines\' tops');
	}
	// the fills first, then the outlines over them, so that where two shapes meet both outlines show
	const drawn = {};
	for (const [i, s] of shapes.entries()) {
		const pts = graph(P, s.f, s.from, s.to, 0.2);
		check(longest(pts) <= 0.2001, `${s.key} is coarse`);
		S.raw(`<path d="${pathOf([[pts[0][0], P.bottom], ...pts, [pts[pts.length - 1][0], P.bottom]])}" fill="${FILL}"/>`, 0.5 + i / 100);
		drawn[s.key] = pts;
	}
	for (const s of shapes) {
		const pts = drawn[s.key].filter(([, y]) => P.bottom - y > CLEAR);
		check(longest(pts) <= 0.2001, `${s.key}'s outline breaks`);
		S.path(pts, { color: MATTER, width: OUTLINE, layer: 1.5, cap: 'butt', what: `the outline of ${s.key}` });
	}

	// ---- the axis across
	const xl = await xAxis(S, P, { ticks: [0, 2, 4, 6, 8, 10], what: 'the axis across' });
	L.push(...xl);
	L.push(await placed('x = \\hbar\\omega/k_BT', P.X(X1 / 2), Math.max(...xl.map((l) => l.box.b)) + 4, 0.5, 0, DIM));

	// ---- the curve, its top and its name
	const curve = graph(P, F, 0, X1, 0.2);
	check(longest(curve) <= 0.2001 && curve.every(([, y]) => y >= P.top), 'the curve');
	S.path(curve, { color: INK, width: CURVE, layer: 2, cap: 'butt', what: 'the curve' });
	const top = P.at(ENERGY, TOP);
	S.raw(`<circle cx="${n2(top[0])}" cy="${n2(top[1])}" r="${DOT}" fill="${INK}"/>`, 3);
	S.mark([top], DOT, 'the top');
	L.push(await placed('1.421', top[0], top[1] - DOT - LABEL_GAP - 0.6, 0.5, 1, INK));
	L.push(await S.clear('x^3/(e^x - 1)', P.X(4.35), P.Y(F(4.35)), 0, 1, [0.3, -0.954]));

	// ---- the frictions' names, each beside its shape, two lines
	/** A name of two lines, their baselines LEAD apart, set with its left (ax 0) or right (ax 1) edge at xx and its
	 * first baseline at yy. */
	const twoLines = async (a, b, xx, yy, ax) => {
		const anchor = ax === 0 ? 'lB' : 'rB';
		const one = await tex(a, [xx, yy], SIZE, anchor, INK), two = await tex(b, [xx, yy + LEAD], SIZE, anchor, INK);
		const p = boxOf(one), q = boxOf(two);
		return { src: `${a} / ${b}`, svg: one + two, box: { l: Math.min(p.l, q.l), r: Math.max(p.r, q.r), t: p.t, b: q.b } };
	};
	const mid = P.Y(0.62 * H);
	L.push(await twoLines('\\text{equality}', '100\\%', P.X(ENERGY + GAMMA) + LABEL_GAP + 3.2, mid, 0));
	L.push(await twoLines('\\text{silicon}', `${(100 * share.silicon).toFixed(1)}\\%`, P.X(x.silicon - GAMMA) - LABEL_GAP - 3.2, mid, 1));
	L.push(await twoLines('\\text{diamond\'s line}', `${(100 * share.diamond).toFixed(0)}\\%`, P.X(x.diamond + GAMMA) + LABEL_GAP + 3.2, mid, 0));
	L.push(await twoLines('\\text{copper\'s electrons}', `${(100 * share.copper).toFixed(1)}\\%`, P.X(0) - LABEL_GAP - 3, P.Y(A) - 0.5, 1));
	check((100 * share.silicon).toFixed(1) === '98.5' && (100 * share.diamond).toFixed(0) === '28' && (100 * share.copper).toFixed(1) === '37.5', 'the percentages');

	S.checkAll(L);
	window[name + '-numbers'] = { x, share, A, H, GAMMA };
	return finish(S, L, [285, 345]);
}
