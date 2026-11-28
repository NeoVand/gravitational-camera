// The tutorial, section 6.6 (tutorial/relativity/maxwell-complex.md), its third diagram: the frame where the electric
// and magnetic fields are parallel, and the two moves that leave it as it is. One panel. A thin ink axis across the
// middle, named "n-hat" at its right end. On it, from one point, two arrows in the light role's colour: E, length 1,
// solid, and cB, length 0.6, dashed, drawn a little above the axis (cB above E) so that both show, named "E" and
// "cB". Round the axis at its right, a circular arrow in the observer's colour (a circle about the axis seen a little
// from the side, an ellipse broken where the axis passes in front of it), named "turn about n-hat: no change". Below the
// axis, a straight double arrow parallel to it in the observer's colour, named "boost along n-hat: no change". At the
// left, faint, a straight arrow across the axis in the observer's colour, named "boost across n-hat: E and B change".
// Under the panel the readout "F = w n-hat, F.F = w^2 (the same for every observer)".
// Departures from the diagram's comment: the panel is drawn at about 245 points across, the width of the chapter's
// other diagrams, rather than the comment's 520 site pixels (260 points at the tutorial's half a point to the pixel):
// the three names need the width. The arrow across the axis is not faint and not at the far left: it is drawn in the
// observer's colour at full strength, dashed (the one move that changes the fields), up from the axis just left of the
// common point of E and cB, so that it stands by the fields it changes, its name above it; a faint tint of the colour
// would vanish in print.
// Exact: the lengths of E and cB, 1 and 0.6, at one scale; the moves' effect (a boost along n and a turn about n
// leave F = w n as it is, a boost across n does not, and F.F = w^2 is kept: asserted in tut-maxwell-lib.js); the
// arrow across at right angles to the axis (asserted). Schematic: the circular arrow's size and slant, the moves'
// arrows' lengths and places, the arrows' offsets above the axis.
import { Sheet, ORIGIN, finish, checker, placed, near, LABEL_GAP, AXIS, AXIS_HEAD, VEC, VEC_HEAD } from './tut-pot-lib.js';
import { DASH } from './tut-bessel-lib.js';
import { INK } from '../lib.js';
import { chapter, palette, OBS, LIGHT, dashedArrow, doubleArrow } from './tut-maxwell-lib.js';

const name = 'tut-maxwell-parallel';
const check = checker(name);

const U = 100;                             // points per unit of field
const E_LEN = 1, CB_LEN = 0.6;
const LEFT = -120, RIGHT = 112;            // the axis, points from the panel's centre
const START = -48;                         // the arrows' common point, points from the panel's centre
const UP_E = 3.4, UP_CB = 8.6;             // the arrows' heights above the axis, points
const RING = { x: 86, ry: 21, rx: 7.5 };  // the circular arrow: its centre on the axis and its semi-axes, points
const MOVE = 1.0;                          // the moves' strokes
const ALONG = { y: 15, x0: -84, x1: -6 };  // the double arrow below the axis
const ACROSS = { x: -62, h: 30 };          // the arrow across the axis, beside the fields' common point

export default async function () {
	const nums = chapter(check);
	await palette(check);
	const S = new Sheet(name);
	const L = [];
	const O = [ORIGIN, ORIGIN];
	const x = (dx) => O[0] + dx;

	// ---- the axis
	const ax = S.arrow([x(LEFT), O[1]], [x(RIGHT), O[1]], { color: INK, width: AXIS, head: AXIS_HEAD, layer: 1, what: 'the axis n' });
	L.push(await placed('\\hat n', ax.B[0] + LABEL_GAP + 1.2, ax.B[1], 0, 0.5, INK));

	// ---- E and cB, from one point, a little above the axis
	const p0 = x(START);
	const E = S.arrow([p0, O[1] - UP_E], [p0 + E_LEN * U, O[1] - UP_E], { color: LIGHT, width: VEC, head: VEC_HEAD, layer: 3, what: 'the arrow E' });
	const B = dashedArrow(S, [p0, O[1] - UP_CB], [p0 + CB_LEN * U, O[1] - UP_CB], { color: LIGHT, width: VEC, head: VEC_HEAD, dash: DASH, layer: 3, what: 'the arrow cB' });
	check(near(B.L / E.L, CB_LEN / E_LEN, 1e-12), 'cB is not 0.6 of E');
	// the two heads clear each other and the axis
	check(UP_CB - UP_E > 2 * 0.36 * VEC_HEAD + 0.5 && UP_E > 0.36 * VEC_HEAD + AXIS / 2 + 0.3, 'the heads touch');
	// E above its point, beyond cB's end; cB above its middle
	L.push(await S.clear('\\mathbf E', E.B[0] - 2, E.B[1] - 2.5, 1, 1, [0, -1], { color: LIGHT }));
	L.push(await S.clear('c\\mathbf B', (B.A[0] + B.B[0]) / 2, B.B[1] - LABEL_GAP - 0.6, 0.5, 1, [0, -1], { color: LIGHT }));

	// ---- the turn about the axis: an ellipse round it, broken where the axis passes in front, with a head
	{
		const c = [x(RING.x), O[1]];
		// the front half (x < centre) passes in front of the axis; leave a gap in the back half where the axis crosses
		const pts = (a0, a1) => Array.from({ length: 121 }, (_, k) => { const t = a0 + ((a1 - a0) * k) / 120; return [c[0] + RING.rx * Math.cos(t), c[1] - RING.ry * Math.sin(t)]; });
		const gap = 0.32;                         // radians either side of the crossing behind the axis
		S.path(pts(gap, Math.PI - 0.0), { color: OBS, width: MOVE, layer: 2, what: 'the turn, upper' });
		S.path(pts(Math.PI, 2 * Math.PI - gap - 0.55), { color: OBS, width: MOVE, layer: 2, what: 'the turn, lower' });
		// the head at the end of the lower part, pointing the way it runs (anticlockwise on the page: up at the right)
		const t = 2 * Math.PI - gap - 0.55, on = (v) => [c[0] + RING.rx * Math.cos(v), c[1] - RING.ry * Math.sin(v)];
		// the head's tip one head's length (5 points of chord) along the ellipse from the end of the lower part
		let dt = 0;
		while (Math.hypot(on(t + dt)[0] - on(t)[0], on(t + dt)[1] - on(t)[1]) < 5) dt += 0.001;
		const tip = on(t + dt);
		const base = [c[0] + RING.rx * Math.cos(t), c[1] - RING.ry * Math.sin(t)];
		const hd = Math.hypot(tip[0] - base[0], tip[1] - base[1]), u = [(tip[0] - base[0]) / hd, (tip[1] - base[1]) / hd], w = [-u[1], u[0]], hw = 0.4 * hd;
		const p = [base[0] + w[0] * hw, base[1] + w[1] * hw], q = [base[0] - w[0] * hw, base[1] - w[1] * hw];
		S.raw(`<path d="M${tip[0].toFixed(2)},${tip[1].toFixed(2)}L${p[0].toFixed(2)},${p[1].toFixed(2)}L${q[0].toFixed(2)},${q[1].toFixed(2)}Z" fill="${OBS}"/>`, 2);
		S.mark([tip, p, q, tip], 0, 'the turn\'s head');
		check(hd > 4 && hd < 7 && tip[1] > O[1] + 1.5, `the turn's head ${hd}`);
		L.push(await S.clear('\\text{turn about } \\hat n\\text{: no change}', c[0] + RING.rx, c[1] + RING.ry + LABEL_GAP + 0.4, 1, 0, [0, 1], { color: OBS }));
	}

	// ---- the boost along the axis: a double arrow below it
	{
		const y = O[1] + ALONG.y, m = [x((ALONG.x0 + ALONG.x1) / 2), y];
		doubleArrow(S, [x(ALONG.x0), y], [x(ALONG.x1), y], { color: OBS, width: MOVE, head: VEC_HEAD, layer: 2, what: 'the boost along' });
		L.push(await S.clear('\\text{boost along } \\hat n\\text{: no change}', m[0], y + LABEL_GAP + 1, 0.5, 0, [0, 1], { color: OBS }));
	}

	// ---- the boost across the axis: a dashed arrow in the observer's colour, up from the axis just left of the
	// fields' common point, its name above it
	{
		const a = [x(ACROSS.x), O[1] - AXIS / 2 - 1.2], b = [x(ACROSS.x), O[1] - ACROSS.h];
		const ar = dashedArrow(S, a, b, { color: OBS, width: MOVE, head: VEC_HEAD, dash: DASH, layer: 2, what: 'the boost across' });
		check(near(ar.u[0], 0, 1e-12) && ar.u[1] === -1, 'the arrow across is not at right angles to the axis');
		check(x(START) - x(ACROSS.x) >= 10 && x(START) - x(ACROSS.x) <= 18, 'the arrow across is not beside the fields');
		L.push(await S.clear('\\text{boost across } \\hat n\\text{: } \\mathbf E \\text{ and } \\mathbf B \\text{ change}', b[0] - 4, b[1] - LABEL_GAP - 0.6, 0, 1, [0, -1], { color: OBS }));
	}

	// ---- the readout
	{
		const bottom = Math.max(...S.marks.flatMap((m) => m.pts.map((p) => p[1] + m.r)), ...L.map((l) => l.box.b));
		L.push(await placed('\\mathbf F = w\\,\\hat n,\\quad \\mathbf F\\cdot\\mathbf F = w^2\\ \\text{(the same for every observer)}', x(LEFT), bottom + 9, 0, 0, INK));
	}

	S.checkAll(L);
	window[name + '-numbers'] = { ...nums, scale: U };
	return finish(S, L, [240, 340]);
}
