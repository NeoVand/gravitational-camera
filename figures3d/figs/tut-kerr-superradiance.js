// The tutorial, chapter 11.2 (tutorial/black-holes/spin.md), its third diagram: the sign of the energy a spinning hole
// takes from a wave, against the wave's frequency. One panel: across, omega / m Omega_H from 0 to 2; up, the energy the
// hole takes for one fixed growth of its area, delta E = (kappa c^2 / 8 pi G) delta A / (1 - m Omega_H / omega), drawn
// as eight thin bars at omega / m Omega_H = 0.25, 0.5, 0.75, 0.9, 1.1, 1.25, 1.5 and 2 from a hairline at zero: down
// left of 1 ("hole gives energy: superradiance"), up right of it ("hole absorbs"), their lengths 1 / |1 - m Omega_H /
// omega| cut off at a fixed height of 6. A thin ink line at 1, "omega = m Omega_H", and the range 0 < omega < m Omega_H
// of the chapter's boxed condition in the page's faint tint.
// Departures from the diagram's comment: the bars are not blue and orange, which in every figure mean a squeeze and a
// stretch, but ink (the hole gives energy) and the page's faint grey (the hole absorbs); the range 0 < omega <
// m Omega_H is tinted; the two bars cut off (9 at 0.9 and 11 at 1.1) are broken near their ends, the usual mark of a
// cut; the axis up carries only its zero and its name, its scale being arbitrary; the caption says which bars are cut.
// Exact: each bar's sign and, in units of the fixed (kappa c^2 / 8 pi G) delta A, its length up to the cut (asserted in
// tut-kerr-lib.js against the chapter's first law). Schematic: the size of the fixed growth of the area, and so the
// scale up; the cut at 6.
import { Sheet, ORIGIN, finish, checker, placed, LABEL_GAP, HAIR, n2 } from './tut-pot-lib.js';
import { Plot, xAxis } from './tut-prob-lib.js';
import { stack } from './tut-curvature-lib.js';
import { INK, DIM, FAINT } from '../lib.js';
import { chapter, palette, near, takes, BARS } from './tut-kerr-lib.js';

const name = 'tut-kerr-superradiance';
const check = checker(name);

// ---- the drawing (points) ----------------------------------------------------------------------------------------
const W = 292, H = 136;                          // the panel
const CUT = 6;                                   // the bars' fixed greatest length, in units of the fixed delta A's
const BAR = 4.2;                                 // a bar's width
const GIVES = INK, ABSORBS = FAINT;              // the bars' colours: the hole gives energy, the hole absorbs
const TINT = '#eeebe5';                          // the superradiant range (drawing.ts, THEME: a neutral tint of the page)
const LINE = 0.55;                               // the line omega = m Omega_H
const BREAK = { at: 0.8, gap: 1.3, slant: 1.2 }; // a cut bar's break: where (fraction of CUT), its width and slant, points
const NAME = 7;                                  // the axis up's name over the panel
const caption = 'Look first at the line $\\omega = m\\Omega_H$: to its left the hole loses energy to the wave, to its right it absorbs. Only the sign comes from the first law and the area theorem; the bar lengths are schematic (the two nearest the line are cut short), and the true gains need Teukolsky\'s equation.';

export default async function () {
	const { state } = await chapter(check);
	await palette(check);
	state(name, 'kerr-superradiance', caption);

	const S = new Sheet(name);
	const L = [];
	const P = new Plot({ left: ORIGIN - W / 2, top: ORIGIN - H / 2, w: W, h: H, x0: 0, x1: 2.1, y0: -CUT - 0.6, y1: CUT + 0.6 });

	// ---- the superradiant range, the zero, the line at 1 and the axes
	S.raw(`<rect x="${n2(P.X(0))}" y="${n2(P.top)}" width="${n2(P.X(1) - P.X(0))}" height="${n2(P.h)}" fill="${TINT}"/>`, 0.5);
	const xl = await xAxis(S, P, { ticks: [0, 0.5, 1, 1.5, 2], what: 'the axis across' });
	L.push(...xl);
	check(P.X(2) + BAR / 2 < P.right - 2, 'the last bar reaches the axis\'s end');
	L.push(await placed('\\omega/m\\Omega_H', P.X(1), Math.max(...xl.map((l) => l.box.b)) + 4, 0.5, 0, DIM));
	S.path([P.at(0, 0), P.at(P.x1, 0)], { color: DIM, width: HAIR, cap: 'butt', layer: 1, what: 'the zero' });
	S.path([[P.left, P.bottom], [P.left, P.top]], { color: DIM, width: 0.45, cap: 'butt', layer: 1, what: 'the axis up' });
	S.path([[P.left, P.Y(0)], [P.left - 2.5, P.Y(0)]], { color: DIM, width: HAIR, cap: 'butt', layer: 1, what: 'the zero\'s tick' });
	L.push(await placed('0', P.left - 2.5 - 2.4, P.Y(0), 1, 0.5, DIM));
	L.push(await placed('\\delta E\\ \\text{at a fixed}\\ \\delta A', P.left - 6, P.top - NAME, 0, 1, DIM));
	S.path([[P.X(1), P.bottom], [P.X(1), P.top]], { color: INK, width: LINE, cap: 'butt', layer: 1.5, what: 'the line omega = m Omega_H' });
	L.push(await placed('\\omega = m\\Omega_H', P.X(1), P.top - NAME, 0.5, 1, INK));

	// ---- the bars
	const lengths = [];
	for (const x of BARS) {
		const v = takes(x), len = Math.min(Math.abs(v), CUT), cut = Math.abs(v) > CUT, s = Math.sign(v);
		lengths.push(+(s * Math.abs(v)).toFixed(3));
		check(s === (x < 1 ? -1 : 1), `the bar at ${x} points the wrong way`);
		const xl0 = P.X(x) - BAR / 2, xr = P.X(x) + BAR / 2, y0 = P.Y(0), y1 = P.Y(s * len);
		const color = s < 0 ? GIVES : ABSORBS;
		const what = `the bar at ${x}`;
		const poly = (pts) => 'M' + pts.map((p) => p.map(n2).join(',')).join('L') + 'Z';
		if (!cut) {
			S.fill(poly([[xl0, y0], [xr, y0], [xr, y1], [xl0, y1]]), { l: xl0, r: xr, t: Math.min(y0, y1), b: Math.max(y0, y1) }, { color, layer: 2, what });
		} else {
			// a break of `gap` points, its edges slanting up to the right, BREAK.at of the way out
			const yb = P.Y(s * BREAK.at * CUT), d = s * BREAK.gap / 2, sl = BREAK.slant / 2;
			const lower = [[xl0, y0], [xr, y0], [xr, yb + d - sl], [xl0, yb + d + sl]];
			const upper = [[xl0, yb - d + sl], [xr, yb - d - sl], [xr, y1], [xl0, y1]];
			S.fill(poly(lower) + poly(upper), { l: xl0, r: xr, t: Math.min(y0, y1), b: Math.max(y0, y1) }, { color, layer: 2, what });
			check(near(len, CUT, 0) && Math.abs(v) > CUT, `the cut bar at ${x}`);
		}
		check(near(Math.abs(P.Y(s * len) - P.Y(0)), (len / (P.y1 - P.y0)) * P.h, 1e-9), `${what}'s length`);
	}
	check(lengths.join() === '-0.333,-1,-3,-9,11,5,3,2', `the bars ${lengths}`);
	check(BARS.filter((x) => Math.abs(takes(x)) > CUT).join() === '0.9,1.1', 'the cut bars are not the two nearest the line');

	// ---- the two names
	const g = await stack(['\\text{hole gives energy:}', '\\text{superradiance}'], P.X(0.36), P.Y(-2.6), 0.5, INK);
	g.on = [];
	L.push(g);
	L.push(await S.clear('\\text{hole absorbs}', P.X(1.75), P.Y(4.4), 0.5, 0.5, [0, -1]));

	S.checkAll(L);
	window[name + '-numbers'] = { lengths };
	return finish(S, L, [280, 340]);
}
