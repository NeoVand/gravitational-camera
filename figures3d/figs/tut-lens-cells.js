// The tutorial, section 9.5 (tutorial/one-point/separating-waves.md), its second diagram: two lensed images of one
// chirp fall in different cells of time and frequency. A time-frequency plane: across, "time (s)" from -2 to 0.5;
// up, "frequency (Hz)". A faint grid of cells 0.243 s wide and 4.11 Hz tall, drawn only in a band about the chirps:
// in each column of cells, the rows from the lowest that a chirp crosses to the highest. Two chirps of a neutron-star
// pair of chirp mass 1.2 solar masses, f rising as (tc - t)^(-3/8), the first at 100 Hz at t = 0, the second the same
// chirp half a second later, both thin lines in the curvature's colour, the second at lower opacity, each named at its
// right-hand end. At t = 0 a small ink dot on each, and between them a bracket, "7.3 Hz: 1.8 cells". No orange or
// blue.
// Departures from the diagram's comment: the frequency axis runs from 70 to 120 Hz, not 60 to 200, because between
// -2 and 0.5 s the two chirps span only 75 to 110 Hz, and on 60 to 200 Hz a cell would be 3 points tall; the bracket
// reads 7.3 Hz, not 7.4, because the two images are 7.345 Hz apart at t = 0 (7.4 came from rounding 7.35 again; the
// chapter's text now says 7.3); the chirps are named, "first image" and "second image", at their right-hand ends; the
// bracket is the vertical line between the two dots at t = 0, with short ends, since anywhere else between the two
// frequencies one chirp or the other crosses it, and its label stands above and to the left of the upper dot, clear of
// the grid; the grid's rows are set so that the two dots lie equally far inside their cells, its columns centred on
// t = 0.
// Exact: both chirps, integrated from the quadrupole formula's rate and checked against the closed form, sampled every
// quarter of a point along their length; the cells' size; the dots, the bracket and its numbers; all computed in
// figs/tut-separating-lib.js and asserted against the chapter's text. Schematic: where the grid starts, which the
// physics does not fix.
import { Sheet, ORIGIN, finish, checker, placed, near, LABEL_GAP, HAIR, TICK, n2 } from './tut-pot-lib.js';
import { Plot, xAxis, yAxis, NUM } from './tut-prob-lib.js';
import { graph, longest, CURVE } from './tut-fourier-lib.js';
import { INK, DIM, RULE } from '../lib.js';
import { chapter, first, second, CURV, F0, LAG } from './tut-separating-lib.js';

const name = 'tut-lens-cells';
const check = checker(name);

const PW = 220, PH = 124;                 // the plot, points
const T0 = -2, T1 = 0.5, FLO = 65, FHI = 120;
const GRID = 0.35;                        // the grid's lines
const FADE = 0.5;                         // the second chirp's opacity
const DOT_R = 1.35;                       // a dot's radius
const END = 1.6;                          // half the length of the bracket's ends
const BRACKET = 0.55;                     // the bracket's stroke
const DOT_AIR = 1.4;                       // between a dot and the bracket's end

export default async function () {
	const nums = await chapter(check);
	const { DT, DF, APART, CELLS } = nums;
	const S = new Sheet(name);
	const L = [];
	const P = new Plot({ left: ORIGIN - PW / 2, top: ORIGIN - PH / 2, w: PW, h: PH, x0: T0, x1: T1, y0: FLO, y1: FHI });

	// ---- the axes
	L.push(...(await xAxis(S, P, { ticks: [-2, -1.5, -1, -0.5, 0, 0.5], fmt: (t) => `${t}`, what: 'the time axis' })));
	L.push(...(await yAxis(S, P, { ticks: [70, 80, 90, 100, 110, 120], what: 'the frequency axis' })));
	const under = Math.max(...L.map((l) => l.box.b));
	L.push(await placed('\\text{time (s)}', P.X((T0 + T1) / 2), under + 4.5, 0.5, 0, INK));
	L.push(await placed('\\text{frequency (Hz)}', P.left - TICK - NUM, P.top - 7, 0, 1, INK));

	// ---- the grid: columns centred on t = 0, rows set so that both dots lie equally far inside their cells
	const a = (1 + CELLS - Math.ceil(CELLS)) / 2;            // the upper dot's height in its cell, in cells
	const base = F0 - a * DF;                                // a row edge
	const colOf = (t) => Math.round(t / DT), rowOf = (f) => Math.floor((f - base) / DF);
	{
		const upper = (F0 - base) / DF - rowOf(F0), lower = (second(0) - base) / DF - rowOf(second(0));
		check(near(upper, 1 - lower, 1e-9) && upper > 0.35 && upper < 0.65, `the dots lie ${upper}, ${lower} into their cells`);
		check(rowOf(F0) - rowOf(second(0)) === 2, 'the dots are not two rows apart');
	}
	const band = new Map();                                  // column -> [lowest row, highest row]
	for (const f of [first, second]) for (let i = 0; i <= 25000; i++) {
		const t = T0 + ((T1 - T0) * i) / 25000, c = colOf(t), r = rowOf(f(t));
		const b = band.get(c) ?? [Infinity, -Infinity];
		band.set(c, [Math.min(b[0], r), Math.max(b[1], r)]);
	}
	const fEdge = (r) => base + r * DF;
	const segs = [];
	for (const [c, [r0, r1]] of band) {
		const ta = Math.max(T0, (c - 0.5) * DT), tb = Math.min(T1, (c + 0.5) * DT);
		for (let r = r0; r <= r1 + 1; r++) segs.push([[P.X(ta), P.Y(fEdge(r))], [P.X(tb), P.Y(fEdge(r))]]);
	}
	// the vertical edges, each the union of the bands on its two sides, not where the plot cuts a column
	const cols = [...band.keys()].sort((x, y) => x - y);
	for (let c = cols[0]; c <= cols[cols.length - 1] + 1; c++) {
		const t = (c - 0.5) * DT;
		if (t <= T0 || t >= T1) continue;
		const ivs = [band.get(c - 1), band.get(c)].filter(Boolean).map(([r0, r1]) => [r0, r1 + 1]).sort((x, y) => x[0] - y[0]);
		const merged = [];
		for (const iv of ivs) if (merged.length && iv[0] <= merged[merged.length - 1][1]) merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], iv[1]); else merged.push([...iv]);
		for (const [lo, hi] of merged) segs.push([[P.X(t), P.Y(fEdge(lo))], [P.X(t), P.Y(fEdge(hi))]]);
	}
	for (const s of segs) check(s.every(([, y]) => y >= P.top - 1e-9 && y <= P.bottom + 1e-9), 'the grid leaves the plot');
	S.raw(`<path d="${segs.map(([p, q]) => `M${n2(p[0])},${n2(p[1])}L${n2(q[0])},${n2(q[1])}`).join('')}" fill="none" stroke="${RULE}" stroke-width="${GRID}" stroke-linecap="butt"/>`, 0.5);
	for (const s of segs) S.mark(s, GRID / 2, 'the grid');
	// the grid's cells are the text's: dt by 1/dt
	check(near(P.X(DT) - P.X(0), (DT / (T1 - T0)) * PW, 1e-9) && near(DT * DF, 1, 1e-12), 'the cells');

	// ---- the two chirps
	const lines = { first: graph(P, first, T0, T1), second: graph(P, second, T0, T1) };
	for (const [k, pts] of Object.entries(lines)) {
		check(longest(pts) <= 0.2501, `the ${k} chirp is not fine`);
		check(pts.every(([, y]) => y > P.top && y < P.bottom), `the ${k} chirp leaves the plot`);
		S.path(pts, { color: CURV, width: CURVE, layer: 2, cap: 'butt', what: `the ${k} chirp` });
	}
	// the second chirp at lower opacity: the path just drawn, given its opacity
	const items = S.P.items;
	items[items.length - 1].svg = items[items.length - 1].svg.replace('<path ', `<path stroke-opacity="${FADE}" `);
	check(near(second(LAG), first(0), 1e-12), 'the second chirp is not the first half a second later');

	// ---- the dots at t = 0, and the bracket between them
	const up = P.at(0, first(0)), down = P.at(0, second(0));
	for (const [k, q] of [['first', up], ['second', down]]) {
		S.raw(`<circle cx="${n2(q[0])}" cy="${n2(q[1])}" r="${DOT_R}" fill="${INK}"/>`, 3);
		S.mark([q], DOT_R, `the ${k} dot`);
	}
	const ya = up[1] + DOT_R + DOT_AIR, yb = down[1] - DOT_R - DOT_AIR, x = up[0];
	S.path([[x, ya], [x, yb]], { color: INK, width: BRACKET, layer: 3, cap: 'butt', what: 'the bracket' });
	for (const y of [ya, yb]) S.path([[x - END, y], [x + END, y]], { color: INK, width: BRACKET, layer: 3, cap: 'butt', what: 'the bracket\'s end' });
	// the bracket and its ends clear both chirps
	for (const k of ['first', 'second']) {
		const c = S.clearance({ l: x - END, r: x + END, t: ya, b: yb }, (w) => w !== `the ${k} chirp`);
		check(c.d >= BRACKET / 2 + 0.8, `the bracket is ${c.d.toFixed(2)} pt from the ${k} chirp`);
	}
	check(near((first(0) - second(0)) / DF, CELLS, 1e-12), 'the bracket is not CELLS cells');
	const text = `${APART.toFixed(1)}\\,\\text{Hz: }${CELLS.toFixed(1)}\\text{ cells}`;
	check(text === '7.3\\,\\text{Hz: }1.8\\text{ cells}', `the bracket reads ${text}`);
	const label = await S.clear(text, x - END - LABEL_GAP, up[1] - 1, 1, 1, [-0.45, -0.89]);
	check(Math.hypot(label.box.r - x, label.box.b - up[1]) < 22, 'the bracket\'s label stands far from it');
	L.push(label);

	// ---- the chirps' names, at their right-hand ends
	for (const [k, f] of [['first', first], ['second', second]]) {
		const [ex, ey] = P.at(T1, f(T1));
		L.push(await S.clear(`\\text{${k} image}`, ex + LABEL_GAP + 0.6, ey, 0, 0.5, [1, 0]));
	}

	S.checkAll(L);
	window[name + '-numbers'] = { apart: APART, cells: CELLS, dt: DT, df: DF };
	return finish(S, L, [240, 340]);
}
