// The tutorial, section 2.8 (tutorial/outside/flows.md), its second diagram: the current column of a turning ball. A
// uniform ball cut through the plane that holds the pixel, its centre and one line of sight, seen along the axis about
// which it turns (at right angles to the page, out of it: anticlockwise). The pixel, a small steel bead at the left,
// sends the line of sight along n^; it enters the ball at the distance a and leaves at b, both marked by dimension
// lines from the pixel. At five points that divide the chord into six equal parts, the velocity Omega x (x - s) is drawn split in two:
// its part along the line (thin and faint, over the dotted chord), which adds nothing to the magnetic part, and its part across it (bold, in
// matter's colour), which counts. The part along the line is the same at every point, Omega times the distance from
// the centre to the line; the part across grows evenly along the chord, through zero at the point nearest the centre.
// Exact: the chord, a and b from the geometry (asserted against the formula), each velocity and its split (the two
// parts add up to Omega x (x - s), the first parallel to n^, the second at right angles to it: asserted), every arrow
// on the stone (asserted with room to spare). Chosen for the drawing: the ball's size and distance, the line's place,
// the five points and the arrows' common scale; the chapter's steel ball, with a = 0.912 m and b = 1.085 m, turns about
// the line from the pixel to its centre instead, so that on it every velocity lies across the line.
// Pictorial: the sawn face of the steel ball (sprites/hair/ball-face.png, as in section 2.5's figures), clipped to the
// exact circle. Marks on it keep fixed colours (figs/tut-flow-lib.js).
import { INK, DIM } from '../lib.js';
import { STEEL } from '../stone.js';
import { Sheet, ORIGIN, finish, checker, near, HAIR, DOT, DOT_STEP, n2 } from './tut-pot-lib.js';
import { SHADE, STONE_INK, STONE_FAINT, ballFace, stoneDefs, rim, entryExit, turning, checkChapter } from './tut-flow-lib.js';
import { stone } from './tut-null-lib.js';

const name = 'tut-flow-column';
const check = checker(name);

// ---- the drawing (lengths in units of the ball's radius, then points) -------------------------------------------
const R = 64;                     // the ball's radius, points
const D = 2.55;                   // from the pixel to the centre
const OFF = 0.3;                  // from the centre to the line of sight
const POINTS = 5;                 // the points of the chord
const SPEED = 0.6;                // an arrow's length per unit of Omega R (both parts on one scale)
const PAST = 0.32;                // the line of sight past the exit
const BEAD = 2.7;                 // the pixel's bead, points
const N_HAT = 0.5;                // the arrow n^
const DIM_OFF = [0.26, 0.86];      // the dimension lines a and b above the line of sight
const EXT = 0.08;                 // an extension line past its dimension line
const SWIRL = [0.2, 200, 340];    // the turning arrow about the centre: radius, from and to (degrees, anticlockwise)
const BOLD = 1.0, BOLD_HEAD = 3.8;          // the part across
const THIN = 0.5, THIN_HEAD = 3.0;          // the part along
const ROOM = 3;                   // the least room between an arrow on the stone and the stone's edge, points

export default async function () {
	checkChapter(name);
	const S = new Sheet(name);
	const C = [ORIGIN + 40, ORIGIN];
	/** Figure points of a point (x, y) in units of R, y up, from the ball's centre. */
	const f = ([x, y]) => [C[0] + R * x, C[1] - R * y];
	const add = (p, q, s = 1) => [p[0] + s * q[0], p[1] + s * q[1]];
	const dot = (p, q) => p[0] * q[0] + p[1] * q[1];

	// ---- the geometry: the pixel, the line of sight, where it enters and leaves
	const pixel = [-D, 0];
	const th = Math.asin(OFF / D);
	const n = [Math.cos(th), Math.sin(th)], m = [-Math.sin(th), Math.cos(th)];   // along the line; across it, toward the line from the centre
	const [a, b] = entryExit(1, D, OFF);
	const at = (r) => add(pixel, n, r);
	for (const r of [a, b]) check(near(Math.hypot(...at(r)), 1, 1e-12), 'the line does not meet the ball at a and b');
	const foot = at(D * Math.cos(th));
	check(near(Math.hypot(...foot), OFF, 1e-12) && near(dot(foot, n), 0, 1e-12), 'the line does not pass OFF from the centre');

	// ---- the stone
	const face = await ballFace();
	S.raw(stoneDefs(`${name}-face`, face, R), -1);
	S.raw(stone(`${name}-stone`, `${name}-face`, C[0], C[1], R), 0);
	S.raw(rim(C[0], C[1], R), 4);
	S.mark(Array.from({ length: 361 }, (_, k) => f([Math.cos((k * Math.PI) / 180), Math.sin((k * Math.PI) / 180)])), 0.2, 'the stone');
	const onStone = (q) => Math.hypot(q[0] - C[0], q[1] - C[1]) <= R - ROOM;

	// ---- the line of sight: off the stone in the page's ink, on it in the stone's
	const P0 = add(pixel, n, BEAD / R);
	S.path([f(P0), f(at(a))], { color: INK, width: HAIR, layer: 1, what: 'the line of sight' });
	S.path([f(at(b)), f(at(b + PAST))], { color: INK, width: HAIR, layer: 1, what: 'the line of sight beyond' });
	S.sphere(f(pixel), BEAD, STEEL, { spec: 0.6, layer: 5 }, 'the pixel');
	S.arrow(f(P0), f(add(P0, n, N_HAT)), { color: INK, width: 0.75, head: 4.2, layer: 3, what: 'n' });

	// ---- the velocity at five points of the chord, split along and across the line
	const across = [], spans = [];
	for (let k = 0; k < POINTS; k++) {
		const r = a + ((b - a) * (k + 1)) / (POINTS + 1), x = at(r);
		const v = [-x[1], x[0]];                                   // Omega z^ x x, Omega = 1, anticlockwise
		const along = [dot(v, n) * n[0], dot(v, n) * n[1]], cross = add(v, along, -1);
		check(near(dot(cross, n), 0, 1e-12) && near(Math.hypot(...add(along, cross)) , Math.hypot(...v), 1e-12), 'a velocity is not split along and across the line');
		check(near(dot(v, n), -OFF, 1e-12), 'the part along the line is not -Omega times the distance to the centre');
		check(near(dot(cross, m), r - D * Math.cos(th), 1e-12), 'the part across the line does not grow evenly from the point nearest the centre');
		const tipA = add(x, along, SPEED), tipC = add(x, cross, SPEED);
		check(onStone(f(tipA)) && onStone(f(tipC)) && onStone(f(x)), `the arrows at point ${k} leave the stone`);
		S.arrow(f(x), f(tipA), { color: STONE_FAINT, width: THIN, head: THIN_HEAD, layer: 2, what: `along ${k}` });
		spans.push([r - SPEED * OFF, r]);
		if (Math.hypot(...cross) * SPEED * R > 1) across.push({ k, x, tip: tipC, ...S.arrow(f(x), f(tipC), { color: SHADE, width: BOLD, head: BOLD_HEAD, layer: 3, what: `across ${k}` }) });
	}
	// the chord, dotted in the stone's ink, its dots left out where a part along the line lies on it
	const step = DOT_STEP / R, clear = (DOT / 2 + 0.9) / R;
	const nd = Math.round((b - a) / step), dots = [];
	for (let i = 0; i <= nd; i++) {
		const r = a + ((b - a) * i) / nd;
		if (spans.some(([s0, s1]) => r > s0 - clear && r < s1 + clear)) continue;
		dots.push(f(at(r)));
	}
	S.raw(`<path d="${dots.map(([x, y]) => `M${n2(x)},${n2(y)}h0`).join('')}" stroke="${STONE_INK}" stroke-width="${DOT}" stroke-linecap="round" fill="none"/>`, 1);
	for (const q of dots) S.mark([q], DOT / 2, 'the chord');
	check(across.length === POINTS - 1, 'the part across vanishes at a point other than the middle one');

	// ---- the axis, out of the page, and the sense of turning
	S.raw(`<circle cx="${n2(C[0])}" cy="${n2(C[1])}" r="2.2" fill="none" stroke="${STONE_INK}" stroke-width="${HAIR}"/><circle cx="${n2(C[0])}" cy="${n2(C[1])}" r="0.65" fill="${STONE_INK}"/>`, 3);
	S.mark([C], 2.4, 'the axis');
	const turn = turning(C[0], C[1], SWIRL[0] * R, (SWIRL[1] * Math.PI) / 180, (SWIRL[2] * Math.PI) / 180, STONE_INK, { width: HAIR + 0.05, head: 3.2 });
	check(turn.hd <= 0.4 * turn.len, 'the turning arrow\'s head is longer than two fifths of it');
	S.raw(turn.svg, 3);
	S.mark(turn.pts, (HAIR + 0.05) / 2, 'the turning');
	S.mark(turn.head, 0, 'the turning\'s head');

	// ---- a and b: dimension lines above the line of sight, from the pixel, with extension lines
	const lift = (p, s) => add(p, m, s);
	const ends = [[pixel, DIM_OFF[1]], [at(a), DIM_OFF[0]], [at(b), DIM_OFF[1]]];
	for (const [p, o] of ends) {
		const from = p === pixel ? add(p, m, (BEAD + 2) / R) : add(p, m, 0.06);
		S.path([f(from), f(lift(p, o + EXT))], { color: DIM, width: HAIR - 0.05, layer: 1, what: 'an extension line' });
		for (let q = 0; q <= 1; q += 0.05) check(Math.hypot(...lift(p, 0.06 + q * o)) > 1 || p === pixel, 'an extension line crosses the stone');
	}
	const dims = [];
	for (const [r, o, what] of [[a, DIM_OFF[0], 'a'], [b, DIM_OFF[1], 'b']]) {
		const A = f(lift(pixel, o)), B = f(lift(at(r), o));
		for (let q = 0; q <= 1; q += 0.02) check(Math.hypot(...lift(at(q * r), o)) > 1.02, `the dimension line ${what} crosses the stone`);
		S.arrow(A, B, { color: DIM, width: HAIR, head: 3.0, layer: 2, what: `the dimension ${what}` });
		S.arrow(B, A, { color: DIM, width: HAIR, head: 3.0, layer: 2, what: `the dimension ${what}, back` });
		dims.push({ what, mid: f(lift(at(r / 2), o)) });
	}

	// ---- labels
	const L = [];
	const mUp = [m[0], -m[1]];                                          // m^ in figure coordinates (y down)
	for (const { what, mid } of dims) L.push(await S.clear(what, mid[0], mid[1], 0.5, 1, mUp, { color: DIM }));
	L.push(await S.clear('\\text{pixel}', f(pixel)[0], f(pixel)[1] + BEAD + 2.4, 0.5, 0, [0, 1], { color: INK, size: 7.5 }));
	const nTip = f(add(P0, n, N_HAT * 0.55));
	L.push(await S.clear('\\hat n', nTip[0], nTip[1], 0.5, 0, [0, 1], { color: INK }));
	L.push(await S.clear('\\boldsymbol{\\Omega}', C[0] - 4, C[1], 1, 0.5, [-1, 0], { color: STONE_INK }));
	const first = across[0];
	L.push(await S.clear('\\text{counts}', first.B[0], first.B[1] + 2, 0.5, 0, [0, 1], { color: SHADE, size: 7.5 }));

	S.checkAll(L);
	return finish(S, L, [240, 340]);
}
