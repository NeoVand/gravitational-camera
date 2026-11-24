// The tutorial, chapter 7.6 (tutorial/geometry/gravitational-waves.md), its first diagram: of the ten amplitudes a_mu nu
// of a plane wave travelling along z, harmonic gauge fixes the four with a time index, the leftover gauge removes the
// four along z and the trace across it, and two remain. A 4 x 4 grid of square cells, rows and columns 0, 1, 2, 3 (3
// along z, the direction of travel), each cell holding its amplitude a_mu nu in the field's colour. The seven cells of
// row 0 and column 0 in a pale grey; a_13, a_31, a_23, a_32 and a_33 in a pale tint of the field's colour; a_12 and a_21
// outlined heavier in the field's colour; a_11 and a_22 split along a diagonal, their upper left in the tint (their sum
// is removed) and their lower right outlined heavier (their difference is kept). Under the grid a legend of three
// swatches, each with the amplitudes it holds, and the line "10 - 4 - 4 = 2".
// Departures from the diagram's comment: the indices are the chapter's 0, 1, 2, 3, not 0, x, y, z, with a note over
// the grid that 3 is along z; the small "+" and "-" between a_11 and a_22 are not drawn in the grid, where the cells
// meet only at a corner shared with a_12 and a_21, but written in the legend as a_11 + a_22 and a_11 - a_22, with
// every other amplitude each swatch stands for; the label of a split cell stands in its tinted half, clear of the
// diagonal. The figure is about 215 points wide, so that its text stays readable on a phone.
// Exact: every cell's class, found by linear algebra in tut-gw-lib.js, not typed in: the four harmonic conditions
// a_0nu + a_3nu = 0 have rank 4 and fix the amplitudes with a time index; the leftover gauge's four changes keep them
// and span exactly a_13, a_23, a_33 and the trace a_11 + a_22 (an amplitude is tinted when the changes reach it
// alone, split when they reach it only with another, outlined when they never reach it); the counts 4, 4 and 2 read
// off the classes and asserted against the ranks; 10 - 4 - 4 = 2. Nothing is schematic.
import { Sheet, ORIGIN, finish, checker, placed, near, LABEL_GAP } from './tut-pot-lib.js';
import { INK, DIM, FAINT } from '../lib.js';
import { chapter, palette, FIELD, PAIRS, count, rank } from './tut-gw-lib.js';

const name = 'tut-gw-count';
const check = checker(name);

const CELL = 36;                           // a cell's side
const GRID = 0.45;                         // the grid's lines
const HEAVY = 1.5;                         // the outline of what is left
const GREY = 0.3;                          // the pale grey: faint ink at this opacity (as chapter 7.2's count)
const TINT = 0.24;                         // the field's colour at this opacity: removed
const HEAD_AIR = 3;                        // the indices to the grid
const NOTE_AIR = 4;                        // the note to the column indices
const KEY = { w: 13, h: 9, air: 5, skip: 5 };   // a legend swatch, the air to its text, and between rows
const LEGEND_AIR = 8;                      // the grid to the legend
const SUM_AIR = 6;                         // the legend to the count

export default async function () {
	const nums = chapter(check);
	await palette(check);
	const S = new Sheet(name);
	const L = [];
	const a = (m, n) => `{\\color{${FIELD}}a_{${m}${n}}}`;

	// ---- each amplitude's class, from the linear algebra
	const ct = count();
	const spatial = PAIRS.map(([m]) => m !== 0);
	const sp = PAIRS.filter(([m]) => m !== 0);
	const img = ct.basis.map((v) => v.filter((_, i) => spatial[i]));
	const reach = (m, n) => img.some((v) => Math.abs(v[sp.findIndex(([p, q]) => p === m && q === n)]) > 1e-12);
	const unit = (m, n) => sp.map(([p, q]) => (p === m && q === n ? 1 : 0));
	const classOf = (m, n) => {
		[m, n] = [Math.min(m, n), Math.max(m, n)];
		if (m === 0) return 'fixed';
		if (!reach(m, n)) return 'left';
		return rank([...img, unit(m, n)]) === rank(img) ? 'removed' : 'split';
	};
	const classes = PAIRS.map(([m, n]) => classOf(m, n));
	const tally = (c) => classes.filter((x) => x === c).length;
	// the split amplitudes come as one pair, a_11 and a_22, whose sum is removed and whose difference is left
	const split = PAIRS.filter((_, i) => classes[i] === 'split');
	check(split.length === 2 && split.every(([m, n]) => m === n && m < 3), `the split cells ${split}`);
	const fixed = tally('fixed'), removed = tally('removed') + 1, left = tally('left') + 1;
	check(fixed === ct.fixedByHarmonic && removed === ct.removed && left === ct.left, `the classes ${fixed}, ${removed}, ${left}`);
	check(fixed === 4 && removed === 4 && left === 2 && 10 - fixed - removed === left, '10 - 4 - 4 = 2');
	check(PAIRS.filter((_, i) => classes[i] === 'removed').map(([m, n]) => `${m}${n}`).join() === '13,23,33', 'the removed cells are not a_13, a_23, a_33');
	check(PAIRS.filter((_, i) => classes[i] === 'left').map(([m, n]) => `${m}${n}`).join() === '12', 'the left cell is not a_12');

	// ---- the grid
	const x0 = ORIGIN - 2 * CELL, y0 = ORIGIN - 2 * CELL;
	const cell = (m, n) => ({ l: x0 + n * CELL, t: y0 + m * CELL, r: x0 + (n + 1) * CELL, b: y0 + (m + 1) * CELL });
	const tri = (c) => [[c.l, c.t], [c.r, c.t], [c.l, c.b]];            // the upper-left half
	const lowTri = (c) => [[c.r, c.t], [c.r, c.b], [c.l, c.b]];         // the lower-right half
	const poly = (pts) => 'M' + pts.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join('L') + 'Z';
	const heavy = (pts, what) => {
		// each edge moved inward by half the stroke, so that the heavy stroke lies inside its cell (pts clockwise on the page)
		const d = HEAVY / 2, n = pts.length;
		const lines = pts.map((p, i) => {
			const q = pts[(i + 1) % n], len = Math.hypot(q[0] - p[0], q[1] - p[1]);
			const inward = [-(q[1] - p[1]) / len, (q[0] - p[0]) / len];      // clockwise on a y-down page: inward is to the right
			return { p: [p[0] + inward[0] * d, p[1] + inward[1] * d], u: [(q[0] - p[0]) / len, (q[1] - p[1]) / len] };
		});
		const ins = lines.map((A, i) => {
			const B = lines[(i + n - 1) % n];
			// A.p + s A.u = B.p + t B.u
			const det = A.u[0] * -B.u[1] - A.u[1] * -B.u[0];
			const s = ((B.p[0] - A.p[0]) * -B.u[1] - (B.p[1] - A.p[1]) * -B.u[0]) / det;
			return [A.p[0] + s * A.u[0], A.p[1] + s * A.u[1]];
		});
		// every corner lies inside the cell's own shape
		const area = (q) => q.reduce((s, v, i) => s + v[0] * q[(i + 1) % n][1] - q[(i + 1) % n][0] * v[1], 0) / 2;
		check(Math.abs(area(ins)) < Math.abs(area(pts)) && Math.sign(area(ins)) === Math.sign(area(pts)), `${what}: the inset turned over`);
		S.path(ins, { color: FIELD, width: HEAVY, closed: true, layer: 2, cap: 'butt', what });
	};
	let cells = 0;
	for (let m = 0; m < 4; m++) for (let n = 0; n < 4; n++) {
		const c = cell(m, n), k = classOf(m, n);
		cells++;
		if (k === 'fixed') S.raw(`<path d="${poly([[c.l, c.t], [c.r, c.t], [c.r, c.b], [c.l, c.b]])}" fill="${FAINT}" fill-opacity="${GREY}"/>`, 0);
		if (k === 'removed') S.raw(`<path d="${poly([[c.l, c.t], [c.r, c.t], [c.r, c.b], [c.l, c.b]])}" fill="${FIELD}" fill-opacity="${TINT}"/>`, 0);
		if (k === 'split') {
			S.raw(`<path d="${poly(tri(c))}" fill="${FIELD}" fill-opacity="${TINT}"/>`, 0);
			heavy(lowTri(c), `a_${m}${n}'s left half`);
		}
		if (k === 'left') heavy([[c.l, c.t], [c.r, c.t], [c.r, c.b], [c.l, c.b]], `a_${m}${n}'s outline`);
	}
	check(cells === 16 && [0, 1, 2, 3].flatMap((m) => [0, 1, 2, 3].map((n) => classOf(m, n))).filter((k) => k === 'fixed').length === 7, 'not seven grey cells');
	for (let i = 0; i <= 4; i++) {
		S.path([[x0 + i * CELL, y0], [x0 + i * CELL, y0 + 4 * CELL]], { color: INK, width: GRID, cap: 'square', layer: 1, what: `the grid's column line ${i}` });
		S.path([[x0, y0 + i * CELL], [x0 + 4 * CELL, y0 + i * CELL]], { color: INK, width: GRID, cap: 'square', layer: 1, what: `the grid's row line ${i}` });
	}
	// the diagonal of each split cell
	for (const [m] of split) { const c = cell(m, m); S.path([[c.r, c.t], [c.l, c.b]], { color: INK, width: GRID, cap: 'butt', layer: 1, what: `a_${m}${m}'s diagonal` }); }

	// ---- the labels: at each cell's centre, or at the centre of the circle inscribed in a split cell's tinted half
	for (let m = 0; m < 4; m++) for (let n = 0; n < 4; n++) {
		const c = cell(m, n);
		let x = (c.l + c.r) / 2, y = (c.t + c.b) / 2;
		if (classOf(m, n) === 'split') { const r = (CELL * (2 - Math.SQRT2)) / 2; x = c.l + r; y = c.t + r; }
		L.push(await placed(a(m, n), x, y, 0.5, 0.5, INK));
	}
	// the indices
	for (let i = 0; i < 4; i++) {
		L.push(await placed(`${i}`, x0 + (i + 0.5) * CELL, y0 - HEAD_AIR, 0.5, 1, DIM));
		L.push(await placed(`${i}`, x0 - HEAD_AIR - 0.5, y0 + (i + 0.5) * CELL, 1, 0.5, DIM));
	}
	{
		const top = Math.min(...L.map((l) => l.box.t));
		L.push(await placed('\\text{index 3: along }z\\text{, the direction of travel}', ORIGIN, top - NOTE_AIR, 0.5, 1, DIM));
	}

	// ---- the legend: a swatch and its amplitudes, one row each
	const rows = [
		{ key: 'fixed', text: `\\text{fixed by harmonic gauge (${fixed}): }${a(0, '\\nu')}` },
		{ key: 'removed', text: `\\text{removed by the leftover gauge (${removed}): }${a(1, 3)}, ${a(2, 3)}, ${a(3, 3)}, ${a(1, 1)} + ${a(2, 2)}` },
		{ key: 'left', text: `\\text{left, the two polarizations (${left}): }${a(1, 2)}, ${a(1, 1)} - ${a(2, 2)}` }
	];
	const texts = [];
	for (const r of rows) texts.push(await placed(r.text, 0, 0, 0, 0.5, INK));
	const width = KEY.w + KEY.air + Math.max(...texts.map((t) => t.box.r - t.box.l));
	const lx = ORIGIN - width / 2;
	let y = y0 + 4 * CELL + LEGEND_AIR;
	for (const [i, r] of rows.entries()) {
		const h = texts[i].box.b - texts[i].box.t, cy = y + Math.max(h, KEY.h) / 2;
		const box = [[lx, cy - KEY.h / 2], [lx + KEY.w, cy - KEY.h / 2], [lx + KEY.w, cy + KEY.h / 2], [lx, cy + KEY.h / 2]];
		if (r.key === 'fixed') S.raw(`<path d="${poly(box)}" fill="${FAINT}" fill-opacity="${GREY}"/>`, 0);
		if (r.key === 'removed') S.raw(`<path d="${poly(box)}" fill="${FIELD}" fill-opacity="${TINT}"/>`, 0);
		if (r.key === 'left') heavy(box, 'the left swatch');
		else S.path(box, { color: INK, width: GRID, closed: true, layer: 1, what: `the ${r.key} swatch` });
		S.boxes.push({ box: { l: lx, r: lx + KEY.w, t: cy - KEY.h / 2, b: cy + KEY.h / 2 }, what: `the ${r.key} swatch` });
		L.push(await placed(r.text, lx + KEY.w + KEY.air, cy, 0, 0.5, INK));
		y = cy + Math.max(h, KEY.h) / 2 + KEY.skip;
	}
	L.push(await placed(`10 - ${fixed} - ${removed} = ${10 - fixed - removed}`, ORIGIN, y - KEY.skip + SUM_AIR, 0.5, 0, INK));
	check(near(10 - fixed - removed, nums.count.left, 0), 'the count printed is not the count computed');

	S.checkAll(L);
	window[name + '-numbers'] = { fixed, removed, left };
	return finish(S, L, [190, 260]);
}
