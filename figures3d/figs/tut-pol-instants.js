// The tutorial, chapter 5.4 (tutorial/waves/polarization.md), its second diagram: eight instants of one cycle of a
// wave travelling toward the reader, omega t = 0, 45, ..., 315 degrees from left to right. Each instant is a ring of
// twelve free steel beads displaced by delta xi = (1/2) h xi (tut-pol-patterns), the strain exaggerated to the
// amplitude 0.36: the deformed ring a thin ink ellipse over the dashed undisturbed circle, an orange bar through the
// centre along the stretch axis, at (1/2) arg(h_+ + i h_x) from e_1, and a blue bar across it along the squeeze axis,
// both |h_+ + i h_x| times one scale long. Top row, circular (a = b): h_+ = 0.36 cos omega t, h_x = 0.36 sin omega t,
// the bar turning anticlockwise by 22.5 degrees a step at a steady length. Bottom row, linear (b = 0): h_+ = 0.36 cos
// omega t, h_x = 0, the bar along e_1 at 0, 45 and 315 degrees, absent (the ring round) at 90 and 270, along e_2 at 135,
// 180 and 225. The axes e_1 and e_2 once, at the far left between the rows' names.
// Departures from the diagram's comment: the beads are Part 1's steel beads and the undisturbed circle is dashed, as in
// Part 1's rings and tut-pol-patterns; the angles over the columns are the numbers alone, with omega t named once at
// the left, where the comment would have printed it over each.
// Exact: every ring (the image of the circle under 1 + h/2), its beads, the bars' directions (asserted against the
// direction in which the ring is moved out most) and lengths. Exaggerated: the strain.
import { Panel, v3, tex, INK, DIM } from '../lib.js';
import { Sheet, ORIGIN, finish, checker, near, placed, boxOf, SIZE } from './tut-vec-lib.js';
import { gnomon } from './tut-five-lib.js';
import { chapter, waveRing, H, INSTANTS, rad, deg } from './tut-pol-lib.js';

const name = 'tut-pol-instants';
const check = checker(name);

const R = 13.5;                           // points: an undisturbed ring's radius
const BEAD = 1.05;
const PITCH = 36.5;                       // points between neighbouring rings' centres
const ROWS = 46;                          // between the rows' centres
const BARS = R / H;                       // the bars' length per unit of |h|: R at the amplitude 0.36
const COLUMN = 34;                        // from the first ring's centre to the right edge of the rows' names
const GN_LEN = 10;                        // the small axes' length
const TITLE_GAP = 4;                      // from the highest bead to the numbers over the columns

export default async function () {
	const nums = chapter(check);
	const P = new Panel({ x: ORIGIN, y: ORIGIN, w: 0, h: 0, scale: 1 });
	const ink = new Sheet(P, name);
	const L = [];
	const x0 = -3.5 * PITCH + 14;            // the first column's centre
	const rows = [{ key: 'circular', y: ROWS / 2, tex: 'a = b' }, { key: 'linear', y: -ROWS / 2, tex: 'b = 0' }];
	for (const row of rows) {
		for (const [k, w] of INSTANTS.entries()) {
			const s = nums.instants[k];
			const { hp, hx } = row.key === 'circular' ? s.c : s.l;
			const c = v3(x0 + k * PITCH, row.y, 0);
			const r = waveRing(ink, check, { c, R, hp, hx: row.key === 'linear' ? 0 : hx, bead: BEAD, bars: BARS, ringWidth: 0.5, what: `the ${row.key} ring at ${w}` });
			const size = Math.hypot(hp, row.key === 'linear' ? 0 : hx);
			if (size < 1e-12) { check(r.bars.length === 0, `the ${row.key} ring at ${w} has bars`); continue; }
			const stretch = r.bars.find((b) => b.key === 'stretch');
			check(near(2 * stretch.half, BARS * size, 1e-9), `the ${row.key} ring at ${w}: the bar's length`);
			if (row.key === 'circular') {
				check(near(2 * stretch.half, R, 1e-9), `the circular ring at ${w}: the bar is not R long`);
				const off = (((deg(stretch.a) - w / 2) % 180) + 180) % 180;
				check(off < 1e-9 || 180 - off < 1e-9, `the circular ring at ${w}: the bar is not at ${w / 2} degrees`);
			} else {
				const want = Math.cos(rad(w)) > 0 ? 0 : 90;
				check(near(Math.abs(Math.cos(stretch.a - rad(want))), 1, 1e-12), `the linear ring at ${w}: the bar is not at ${want} degrees`);
			}
		}
	}
	// the numbers over the columns, on one line over the highest mark
	const top = Math.min(...ink.marks.map((m) => Math.min(...m.pts.map((q) => q[1] - m.r))));
	// on one baseline, the lowest ink TITLE_GAP over the highest mark
	const base0 = await tex('0^\\circ', [0, 0], SIZE, 'cB', INK);
	for (const [k, w] of INSTANTS.entries()) {
		const [X] = ink.at(v3(x0 + k * PITCH, 0, 0));
		const svg = await tex(`${w}^\\circ`, [X, top - TITLE_GAP - boxOf(base0).b], SIZE, 'cB', INK);
		const box = boxOf(svg);
		check(box.b <= top - TITLE_GAP + 0.3, `the number ${w} is too low`);
		L.push({ src: `${w}`, svg, box });
	}

	// the names at the left: omega t over the column of the rows' names, each row's name level with its centre
	const right = ink.at(v3(x0 - COLUMN, 0, 0))[0];
	const wt = await placed('\\omega t', right, L[0].box.b, 1, 1, INK);
	L.push(wt);
	for (const row of rows) {
		const [, Y] = ink.at(v3(0, row.y, 0));
		L.push(await placed(row.tex, right, Y, 1, 0.5, INK));
	}
	// the small axes, once, between the rows' names
	const names = L.slice(-2);
	const corner = v3(x0 - COLUMN - 22, 0 - 6, 0);
	const tips = gnomon(ink, corner, [{ d: v3(1, 0, 0), tex: 'e_1' }, { d: v3(0, 1, 0), tex: 'e_2' }], GN_LEN, { what: 'the axes' });
	L.push(await ink.label('\\boldsymbol e_1', ink.at(tips[0]), [1, 0], 2.2));
	L.push(await ink.label('\\boldsymbol e_2', ink.at(tips[1]), [0, -1], 2.2));
	check(names[0].box.b < ink.at(tips[1])[1] - 8 && names[1].box.t > ink.at(corner)[1] + 2, 'the axes are not between the rows\' names');
	void DIM;
	ink.checkAll(L);
	window[name + '-numbers'] = { bars: nums.instants.map((s) => [deg(s.ac), s.al === null ? null : deg(s.al)]) };
	return finish(name, P, L, [240, 340]);
}
