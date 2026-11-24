// The tutorial, chapter 7.4 (tutorial/geometry/linearized-gravity.md), its first diagram: two panels side by side, each a
// square grid of 7 x 7 free balls (small dots in the observer's colour) over thin grey coordinate lines, drawn in what
// rulers read (proper distance). Left, "pure gauge": the vertical coordinate lines are the lines x' = x + eps cos(kx + phase)
// = const of the relabelling, bunched and spread along x, while every ball keeps its place on an even square lattice
// and so sits off them; under it "labels move, balls do not: curvature 0". Right, "a real wave" (plus polarized,
// travelling out of the page), at its phase of largest stretch: the coordinate lines straight and even, the balls
// moved from them, the lattice stretched along x (an orange tint behind the balls at the two ends of each row) and
// squeezed along y (a blue tint at the ends of each column); under it "separations change: curvature != 0". In each
// panel one small double-headed ink arrow between two neighbouring balls of the bottom row, named "proper
// separation": one spacing on the left, longer on the right.
// Departures from the diagram's comment: the two panels stand side by side at every width, each about 120 points
// wide, so that one drawing about 255 points wide keeps its text readable on a phone; the notes stand under the
// panels, in two lines each, not beside them. The double-headed arrow is a dimension line just under the grid, with
// dotted leaders down from its two balls, since between the balls themselves it would lie along a coordinate line (on
// the left every row of balls sits on its horizontal line). Each title has a second line in the faint ink, "a change
// of coordinates" and "plus polarization, out of the page", the comment's own words for the two cases. The corner
// balls, at the end of a row and of a column at once, carry no tint.
// Exact: the left panel's lines, each the solution x of x + eps cos(kx + phase) = n a (asserted), with eps k = 0.55 < 1 so that
// the labels stay in order (asserted), and the balls at x = n a, their separations one spacing a (asserted); the
// right panel's balls at ((1 + h/2) x, (1 - h/2) y) of a plus wave of amplitude h at its largest stretch, the
// separation along x (1 + h/2) a (asserted). The curvature of the two tables, zero and not zero, asserted in
// tut-linear-lib.js from 7.2's formula by finite differences, with the chapter's 2 eps k = 2 x 10^-3 for eps = 1 mm and
// k = 1 m^-1. Schematic: the amplitudes, eps k = 0.55 and h = 0.36 (both exaggerated, as the caption says), the
// wavelength of the relabelling (eight spacings), its phase (80 degrees, the one that keeps the balls farthest from the
// lines) and the spacing.
import { Sheet, ORIGIN, finish, checker, placed, near, LABEL_GAP, HAIR } from './tut-pot-lib.js';
import { PUSH, PUSH_HEAD } from './tut-five-lib.js';
import { INK, DIM, RULE } from '../lib.js';
import { chapter, palette, stack, OBS, ACCENT, ACCENT2 } from './tut-linear-lib.js';

const name = 'tut-gauge-or-wave';
const check = checker(name);

const A = 15;                              // the lattice spacing, points (schematic)
const N = 3;                               // balls and lines from -N to N each way: 7 x 7
const EXTENT = 4.1 * A;                    // the coordinate lines run from -EXTENT to EXTENT about the centre
const GAP = 24;                            // between the panels' grids
const EPS_K = 0.55;                        // the relabelling's eps k (exaggerated)
const WAVE_K = (2 * Math.PI) / (8 * A);    // its wavenumber: a wavelength of eight spacings
const PHASE = (80 * Math.PI) / 180;        // -omega t of the instant drawn: the phase that keeps every ball farthest from a line
const H_PLUS = 0.36;                       // the real wave's amplitude (exaggerated)
const BALL = 1.5;                          // a ball's dot
const LINE_IN = 0.3 * A;                   // a vertical line stands at least this far inside the grid's edge
const HALO = 3.4;                          // the tint behind a ball
const TINT_OPACITY = 0.32;                 // the tint behind a ball: the first accent (orange) for the stretch, the second (blue) for the squeeze
const PAIR = [2, 3];                       // the columns of the two neighbouring balls measured
const LEADER_CLEAR = 2.6;                  // a leader starts this far below its ball's centre
const DIM_DROP = 7;                        // the dimension line stands this far under the lines' ends
const OVERSHOOT = 1.8;                     // a leader runs this far past the dimension line
const TITLE_AIR = 5;                       // the titles to the grid
const NOTE_AIR = 5.5;                      // the dimension line to the notes

export default async function () {
	const nums = chapter(check);
	await palette(check);
	const S = new Sheet(name);
	const L = [];
	const eps = EPS_K / WAVE_K;
	check(EPS_K < 1, 'the relabelling does not keep the labels in order');

	/** The relabelling's line x' = n a: the x with x + eps cos(kx + phase) = n a, by Newton's method. */
	const lineAt = (n) => {
		let x = n * A;
		for (let i = 0; i < 60; i++) x -= (x + eps * Math.cos(WAVE_K * x + PHASE) - n * A) / (1 - EPS_K * Math.sin(WAVE_K * x + PHASE));
		check(near(x + eps * Math.cos(WAVE_K * x + PHASE), n * A, 1e-9), `the line x' = ${n} a`);
		return x;
	};

	const cy = ORIGIN;
	const panels = [
		{ key: 'gauge', cx: ORIGIN - EXTENT - GAP / 2, title: '\\text{pure gauge}', sub: '\\text{a change of coordinates}',
			notes: ['\\text{labels move, balls do not:}', '\\text{curvature }0'] },
		{ key: 'wave', cx: ORIGIN + EXTENT + GAP / 2, title: '\\text{a real wave}', sub: '\\text{plus polarization, out of the page}',
			notes: ['\\text{separations change:}', '\\text{curvature}\\neq0'] }
	];
	const out = {};
	for (const p of panels) {
		const { cx } = p;
		const what = `the ${p.key} panel`;
		const ns = Array.from({ length: 2 * N + 1 }, (_, i) => i - N);
		// ---- the coordinate lines
		// every line x' = n a that falls inside the grid, at least LINE_IN from its edge
		const lineNs = Array.from({ length: 2 * N + 5 }, (_, i) => i - N - 2);
		const all = lineNs.map((n) => [n, p.key === 'gauge' ? lineAt(n) : n * A]).filter(([, x]) => Math.abs(x) <= EXTENT - LINE_IN);
		const verticals = all.map(([, x]) => x);
		for (const [n, x] of all) S.path([[cx + x, cy - EXTENT], [cx + x, cy + EXTENT]], { color: RULE, width: HAIR, cap: 'butt', layer: 0, what: `${what}'s vertical line ${n}` });
		check(ns.every((n) => all.some(([m]) => m === n)), `${what}: a line of the balls' columns is missing`);
		for (const m of ns) S.path([[cx - EXTENT, cy + m * A], [cx + EXTENT, cy + m * A]], { color: RULE, width: HAIR, cap: 'butt', layer: 0, what: `${what}'s horizontal line ${m}` });
		check(verticals.every((x, i) => i === 0 || x > verticals[i - 1]), `${what}: the lines are out of order`);
		
		// ---- the balls: the page is proper distance
		const at = (i, j) => (p.key === 'gauge' ? [i * A, j * A] : [(1 + H_PLUS / 2) * i * A, (1 - H_PLUS / 2) * j * A]);
		const balls = {};
		for (const i of ns) for (const j of ns) {
			const [x, y] = at(i, j);
			check(Math.abs(x) < EXTENT - 2 * HALO && Math.abs(y) < EXTENT - 2 * HALO, `${what}: the ball ${i}, ${j} leaves the grid`);
			const q = [cx + x, cy + y];
			balls[`${i},${j}`] = q;
			const rowEnd = Math.abs(i) === N && Math.abs(j) < N, colEnd = Math.abs(j) === N && Math.abs(i) < N;
			if (p.key === 'wave' && (rowEnd || colEnd)) S.raw(`<circle cx="${q[0].toFixed(2)}" cy="${q[1].toFixed(2)}" r="${HALO}" fill="${rowEnd ? ACCENT : ACCENT2}" fill-opacity="${TINT_OPACITY}"/>`, 1);
			S.raw(`<circle cx="${q[0].toFixed(2)}" cy="${q[1].toFixed(2)}" r="${BALL}" fill="${OBS}"/>`, 3);
			S.mark([q], BALL, `${what}'s ball ${i}, ${j}`);
		}
		if (p.key === 'gauge') {
			// each ball sits off every line x' = n a in the page
			for (const i of ns) {
				const gap = Math.min(...verticals.map((x) => Math.abs(x - i * A)));
				check(gap > 0.25 * A, `${what}: the column ${i} sits ${gap} from a line`);
				// its new label x + eps cos(kx + phase) lies between two whole spacings
				const label = (i * A + eps * Math.cos(WAVE_K * i * A + PHASE)) / A;
				check(Math.abs(label - Math.round(label)) > 0.1, `${what}: the ball ${i}'s label ${label} is a whole spacing`);
			}
			// the spacings of the lines: bunched and spread, from (1 - eps k)... to (1 + eps k)... of a
			const sp = verticals.slice(1).map((x, i) => x - verticals[i]);
			check(Math.min(...sp) < 0.8 * A && Math.max(...sp) > 1.3 * A, `${what}: the lines' spacings ${sp.map((s) => (s / A).toFixed(2))}`);
		} else {
			// the separations: along x stretched by 1 + h/2, along y squeezed by 1 - h/2
			const [a, b] = [balls['0,0'], balls['1,0']], [c, d] = [balls['0,0'], balls['0,1']];
			check(near(b[0] - a[0], (1 + H_PLUS / 2) * A, 1e-9) && near(d[1] - c[1], (1 - H_PLUS / 2) * A, 1e-9), `${what}: the separations`);
			// the balls off the lines most at the ends of the rows and columns, where the tints are
			check(near(balls[`${N},0`][0] - cx - N * A, (H_PLUS / 2) * N * A, 1e-9), `${what}: the row's end`);
		}

		// ---- the title
		const title = await placed(p.title, cx, cy - EXTENT - TITLE_AIR - 11.5, 0.5, 1, INK);
		const sub = await placed(p.sub, cx, title.box.b + 2.2, 0.5, 0, DIM);
		L.push(title, sub);
		check(sub.box.b < cy - EXTENT - LABEL_GAP, `${what}: the title reaches the grid`);

		// ---- the proper separation: a dimension line under the grid between the balls of the bottom row in PAIR
		const [qa, qb] = PAIR.map((i) => balls[`${i},${N}`]);
		const yd = cy + EXTENT + DIM_DROP;
		for (const q of [qa, qb]) S.dots([q[0], q[1] + LEADER_CLEAR], [q[0], yd + OVERSHOOT], { color: DIM, layer: 1, what: `${what}'s leader at ${q[0].toFixed(1)}` });
		const mid = [(qa[0] + qb[0]) / 2, yd];
		const left = S.arrow(mid, [qa[0], yd], { color: INK, width: PUSH, head: PUSH_HEAD, layer: 2, what: `${what}'s separation, left` });
		const right = S.arrow(mid, [qb[0], yd], { color: INK, width: PUSH, head: PUSH_HEAD, layer: 2, what: `${what}'s separation, right` });
		const sep = left.L + right.L;
		check(near(sep, qb[0] - qa[0], 1e-9), `${what}: the arrow's length`);
		if (p.key === 'gauge') check(near(sep, A, 1e-9), `${what}: the separation changed`);
		else check(near(sep, (1 + H_PLUS / 2) * A, 1e-9) && sep > A + 2, `${what}: the separation is not longer`);
		out[p.key] = sep;
		const name1 = await placed('\\text{proper separation}', qa[0] - LABEL_GAP - 1.2, yd, 1, 0.5, INK);
		L.push(name1);

		// ---- the notes, two lines as one label
		L.push(await stack(p.notes, cx, Math.max(name1.box.b, yd + OVERSHOOT) + NOTE_AIR, 0.5, INK));
	}
	check(out.wave > out.gauge && near(out.gauge, A, 1e-9), 'the two separations');
	// the two panels do not meet
	check(panels[1].cx - panels[0].cx - 2 * EXTENT >= GAP - 1e-9, 'the panels touch');

	S.checkAll(L);
	window[name + '-numbers'] = { ...nums, separations: out, epsK: EPS_K, hPlus: H_PLUS };
	return finish(S, L, [240, 300]);
}
