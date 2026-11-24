// The tutorial, chapter 8.3 (tutorial/quantum/quanta.md), its first diagram: the oscillator's levels in its well.
// One panel: the parabola V = (1/2) m omega^2 x^2 as a thin ink curve, x across in units of x_zp (ticks at -4, -2, 0,
// 2, 4) and the energy up in units of hbar omega (ticks at 0 to 5). The levels E_n = (n + 1/2) hbar omega, n = 0 to 4,
// as horizontal ink segments, each between the two points where it meets the parabola, labelled "n = 0", "n = 1", ...
// at the right, outside the curve. On the n = 0 level, the ground-state density |psi_0|^2, proportional to
// e^{-x^2/2 x_zp^2}, as a light grey filled bell sitting on the line, its width exact and its height schematic, with a
// short bracket at e^{-1/2} of its height from -x_zp to x_zp, labelled "+-x_zp". A double arrow from the bottom of the
// parabola to the n = 0 line, "(1/2) hbar omega", and a second between n = 2 and n = 3, "hbar omega". Ink and grey
// only; no orange or blue.
// Departures from the diagram's comment: the energy's ticks are the whole numbers 0 to 5 (the levels sit between
// them, at the half-integers); each level's label hangs just below its line's right end, outside the curve, because
// the bell's tails, which run on past the turning points (exactly, as |psi_0|^2 does), lie just above the n = 0 line
// there; "(1/2) hbar omega" sits outside the well on the left, level with its arrow, since the well's floor is too
// narrow for it; the bracket is labelled below itself, inside the bell; the two axes are named, "x / x_zp" and
// "E / hbar omega"; the first step is labelled "hbar omega / 2" rather than with a built-up half, whose small figures
// would be the smallest type in the drawing on a phone.
// Exact: the parabola (u^2 / 4 in these units), the levels and their ends (u = +-sqrt(4n + 2)), the bell's shape
// (e^{-u^2/2}, standard deviation one, asserted against |psi_0|^2 by quadrature), the bracket's height and length, the
// two arrows' lengths (1/2 and 1 on the energy scale). Schematic, as the caption says: the bell's height.
import { Sheet, ORIGIN, finish, checker, placed, AXIS, HAIR, TICK, LABEL_GAP, n2 } from './tut-pot-lib.js';
import { Plot, xAxis, yAxis, pathOf, END, DIM_LINE } from './tut-prob-lib.js';
import { graph, longest, CURVE } from './tut-fourier-lib.js';
import { INK, DIM, RULE } from '../lib.js';
import { chapter, palette, near, doubleArrow, LEVELS, level, well, turning, bell } from './tut-quanta-lib.js';

const name = 'tut-oscillator-levels';
const check = checker(name);

// ---- the drawing (points) ----------------------------------------------------------------------------------------
const UX = 24;                           // points per x_zp
const UE = 36;                           // points per hbar omega
const XR = 5;                            // x from -5 to 5 x_zp
const ETOP = 5;                          // the parabola and the energy axis up to 5 hbar omega
const LEVEL_W = 0.6;                     // a level's stroke
const BELL_TOP = 0.85;                   // the bell's height, hbar omega (schematic)
const BELL_SHADE = 0.42;                 // the bell's opacity of the rule's grey (tut-phase-rings' light bands)
const ARROW_W = 0.55, ARROW_HEAD = 3.6;  // the double arrows
const TIP = 0.5;                         // air between an arrow's tip and the line it reaches
const FADE = 0.05;                       // the bell's tails end where they are this thin, points
const AXIS_AIR = 6;                      // the parabola's widest point to the energy axis

export default async function () {
	await chapter(check);
	await palette(check);
	const S = new Sheet(name);
	const L = [];
	const W = 2 * XR * UX, H = ETOP * UE;
	const P = new Plot({ left: ORIGIN - W / 2, top: ORIGIN - H / 2, w: W, h: H, x0: -XR, x1: XR, y0: 0, y1: ETOP });
	const uTop = Math.sqrt(4 * ETOP);
	check(uTop < XR, 'the parabola leaves the panel');

	// ---- the axes: x along the energy's zero, through the well's floor; the energy at the left
	const eAxisX = P.X(-uTop) - AXIS_AIR;
	L.push(...(await xAxis(S, P, { ticks: [-4, -2, 0, 2, 4], fmt: (t) => (t < 0 ? `-${-t}` : `${t}`), from: -uTop - AXIS_AIR / UX, what: 'the x axis' })));
	L.push(...(await yAxis(S, P, { ticks: [0, 1, 2, 3, 4, 5], x: eAxisX, to: ETOP + 0.4, what: 'the energy axis' })));
	L.push(await placed('x/x_{\\rm zp}', P.right + LABEL_GAP + 0.6, P.bottom, 0, 0.5, DIM));
	L.push(await placed('E/\\hbar\\omega', eAxisX, P.Y(ETOP + 0.4) - LABEL_GAP - 0.6, 0.5, 1, DIM));

	// ---- the bell on the n = 0 line: its tails run until they are thinner than FADE
	const base = P.Y(level(0)), top = BELL_TOP * UE;
	const reach = Math.sqrt(-2 * Math.log(FADE / top));
	{
		const B = new Plot({ left: P.left, top: base - top, w: W, h: top, x0: -XR, x1: XR, y0: 0, y1: 1 });
		const pts = graph(B, bell, -reach, reach);
		check(longest(pts) <= 0.2501, `the bell has a step of ${longest(pts)} pt`);
		S.raw(`<path d="${pathOf([[pts[0][0], base], ...pts, [pts[pts.length - 1][0], base]])}" fill="${RULE}" fill-opacity="${BELL_SHADE}"/>`, 0.5);
		check(base - top > P.Y(level(1)) + 4, 'the bell reaches the n = 1 level');
		// the bracket at e^{-1/2} of the top: exactly -x_zp to x_zp
		const y = base - top * bell(1);
		check(near(bell(1), Math.exp(-0.5), 1e-15), 'the bracket is not at e^{-1/2}');
		S.path([[P.X(-1), y], [P.X(1), y]], { color: INK, width: DIM_LINE, layer: 3, cap: 'butt', what: 'the bracket' });
		for (const u of [-1, 1]) S.path([[P.X(u), y - END], [P.X(u), y + END]], { color: INK, width: DIM_LINE, layer: 3, cap: 'butt', what: 'the bracket\'s end' });
		const lab = await placed('\\pm x_{\\rm zp}', P.X(0), (y + END + base) / 2, 0.5, 0.5, INK);
		L.push(lab);
	}

	// ---- the parabola, then the levels
	const curve = graph(P, well, -uTop, uTop);
	check(longest(curve) <= 0.2501, `the parabola has a step of ${longest(curve)} pt`);
	S.path(curve, { color: INK, width: CURVE, layer: 2, what: 'the parabola' });
	for (const n of LEVELS) {
		const u = turning(n), y = P.Y(level(n));
		check(near(well(u), level(n), 1e-14), `the level ${n} does not end on the parabola`);
		S.path([[P.X(-u), y], [P.X(u), y]], { color: INK, width: LEVEL_W, layer: 2, cap: 'butt', what: `the level ${n}` });
	}
	// the labels, hanging just below each line's right end, outside the curve: moved right until clear
	for (const n of LEVELS) {
		const u = turning(n), y = P.Y(level(n));
		L.push(await S.clear(`n = ${n}`, P.X(u) + LABEL_GAP, y + LEVEL_W / 2 + LABEL_GAP + 0.4, 0, 0, [1, 0]));
	}

	// ---- the two steps
	{
		const floor = P.Y(0), y0 = P.Y(level(0));
		const a = doubleArrow(S, [P.X(0), floor - AXIS / 2 - TIP], [P.X(0), y0 + LEVEL_W / 2 + TIP], { width: ARROW_W, head: ARROW_HEAD, what: 'the zero point\'s arrow' });
		check(near(a.L + AXIS / 2 + LEVEL_W / 2 + 2 * TIP, 0.5 * UE, 1e-9), 'the zero point\'s arrow is not half a step');
		// its label, outside the well on the left, level with the arrow's middle, moved left until clear of the wall
		L.push(await S.clear('\\hbar\\omega/2', P.X(-turning(0)) + 2, (floor + y0) / 2, 1, 0.5, [-1, 0]));
	}
	{
		const y2 = P.Y(level(2)), y3 = P.Y(level(3));
		const a = doubleArrow(S, [P.X(0), y2 - LEVEL_W / 2 - TIP], [P.X(0), y3 + LEVEL_W / 2 + TIP], { width: ARROW_W, head: ARROW_HEAD, what: 'the step\'s arrow' });
		check(near(a.L + LEVEL_W + 2 * TIP, UE, 1e-9), 'the step\'s arrow is not one step');
		L.push(await placed('\\hbar\\omega', P.X(0) + ARROW_W / 2 + LABEL_GAP + 1.2, (y2 + y3) / 2, 0, 0.5, INK));
	}

	S.checkAll(L);
	window[name + '-numbers'] = { levels: LEVELS.map(level), ends: LEVELS.map(turning), reach };
	return finish(S, L, [250, 320]);
}
