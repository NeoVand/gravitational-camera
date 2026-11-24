// The tutorial, chapter 10.3 (tutorial/glow/why-matter-barely-glows.md), its third diagram: internal strain. Two
// halves side by side, each a square patch of a flat picture of silicon's two interleaved lattices: open circles for
// one copy at the corners of a square grid, filled circles for the other, each at the centre of four open ones, joined
// to them by thin bonds. Left, "at rest". Right, "sheared": the open lattice carried by a pure shear into a rhombus,
// orange stretch arrows outward along one diagonal and blue squeeze arrows inward along the other (the paper's sign
// colours, with chapter 1.5's strokes and heads, figs/tut-five-lib.js); the filled circles shown twice, faint where a
// shift with the lattice would put them and solid where they sit, shifted by one vector against the open copy, with a
// small arrow from each faint circle to its solid one, the bonds drawn to the solid ones; "internal strain,
// proportional to zeta_K" under the patch. Atoms and bonds neutral.
// Departures from the diagram's comment: the halves are named over them, and stay side by side on a phone, the figure
// being one drawing; the shift's direction in the flat picture is schematic (in the crystal a shear in one plane shifts
// the copies along the third axis, as tut-glow-shears draws).
// Exact: the open lattice's map (a symmetric, trace-free strain, its axes the diagonals) and the faint circles, its
// image of the filled ones; every solid circle shifted by the same vector. Exaggerated, as the caption says: the strain
// and the shift.
import { Sheet, ORIGIN, finish, checker, placed, boxOf, LABEL_GAP, SIZE, HAIR, n2 } from './tut-pot-lib.js';
import { tex, INK, DIM, PAGE, ACCENT, ACCENT2 } from '../lib.js';
import { PUSH, PUSH_HEAD } from './tut-five-lib.js';
import { chapter, palette, near } from './tut-glow-lib.js';

const name = 'tut-glow-two-atoms';
const check = checker(name);

// ---- the drawing (points) ----------------------------------------------------------------------------------------
const CELL = 32;                                // the open lattice's side
const N = 3;                                    // cells across the patch
const GAP = 72;                                 // between the two patches' centres, beyond the patch's width
const EPS = 0.11;                               // the strain u_xy in the patch's own axes (exaggerated)
const SHIFT = [0.3, 0];                         // the filled copy's shift, in cells (exaggerated; schematic direction)
const R = 2.25, OPEN_W = 0.55;                   // an atom's radius; an open atom's ring
const FAINT_A = 0.3;                            // the faint circles' opacity
const BOND = HAIR;
const SIGN = { len: 12, clear: 2.4 };           // the sign arrows: length, and air between an arrow and its corner atom
const SHIFT_HEAD = 2.6, SHIFT_W = 0.5;
const caption = 'Look first at the small arrows: when the lattice is sheared, one copy of atoms does not follow it exactly but shifts against the other, so a uniform shear drives the vibration in which the two copies swing against each other. The picture is a flat sketch of a three-dimensional crystal, and the shift is exaggerated.';

/** A label whose baseline is at y, centred on x. */
async function onBase(src, x, y, color = INK) {
	const svg = await tex(src, [x, y], SIZE, 'cB', color);
	return { src, svg, box: boxOf(svg) };
}

export default async function () {
	const { state, flat } = await chapter(check);
	await palette(check);
	state(name, 'glow-two-atoms', caption);
	check(flat.includes('Their crystal is two interleaved copies of one lattice'), 'the two copies');
	check(flat.includes('so one shifts against the other in proportion to the shear') && flat.includes('This is **internal strain**'), 'internal strain');

	// ---- the strain: u = EPS [[0, 1], [1, 0]] in the patch's axes (y up), symmetric and trace-free, its axes the
	// diagonals: stretched along (1, 1), squeezed along (1, -1)
	const u = [[0, EPS], [EPS, 0]];
	const strain = ([x, y]) => [x + u[0][0] * x + u[0][1] * y, y + u[1][0] * x + u[1][1] * y];
	check(near(u[0][1], u[1][0], 0) && near(u[0][0] + u[1][1], 0, 0), 'the strain is not symmetric and trace-free');
	{
		const a = strain([1, 1]), b = strain([1, -1]);
		check(near(a[0], (1 + EPS), 1e-15) && near(a[1], 1 + EPS, 1e-15) && near(b[0], 1 - EPS, 1e-15) && near(b[1], -(1 - EPS), 1e-15), 'the diagonals are not the strain\'s axes');
	}

	const S = new Sheet(name);
	const L = [];
	const span = N * CELL;
	const centres = [[ORIGIN - (span + GAP) / 2, ORIGIN], [ORIGIN + (span + GAP) / 2, ORIGIN]];
	// lattice coordinates (cells, centred on the patch, y up) to the page
	const page = (c, [x, y]) => [c[0] + CELL * x, c[1] - CELL * y];
	const opens = [], filled = [];
	for (let i = 0; i <= N; i++) for (let j = 0; j <= N; j++) opens.push([i - N / 2, j - N / 2]);
	for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) filled.push([i + 0.5 - N / 2, j + 0.5 - N / 2]);
	const corners = ([x, y]) => [[x - 0.5, y - 0.5], [x + 0.5, y - 0.5], [x + 0.5, y + 0.5], [x - 0.5, y + 0.5]];

	const open = (q, what) => { S.raw(`<circle cx="${n2(q[0])}" cy="${n2(q[1])}" r="${R}" fill="${PAGE}" stroke="${INK}" stroke-width="${OPEN_W}"/>`, 3); S.mark([q], R + OPEN_W / 2, what); };
	const solid = (q, what, faint = false) => { S.raw(`<circle cx="${n2(q[0])}" cy="${n2(q[1])}" r="${R}" fill="${INK}"${faint ? ` fill-opacity="${FAINT_A}"` : ''}/>`, faint ? 2.5 : 3.5); S.mark([q], R, what); };
	const bond = (a, b, what) => S.path([a, b], { color: DIM, width: BOND, layer: 1, cap: 'butt', what });

	// ---- left: at rest
	{
		const c = centres[0];
		for (const f of filled) for (const o of corners(f)) bond(page(c, f), page(c, o), 'a bond at rest');
		for (const o of opens) open(page(c, o), 'an open atom at rest');
		for (const f of filled) solid(page(c, f), 'a filled atom at rest');
		// each filled atom at the centre of its four open ones
		for (const f of filled) for (const o of corners(f)) check(opens.some((p) => near(p[0], o[0], 1e-12) && near(p[1], o[1], 1e-12)), 'a filled atom is not among four open ones');
	}
	// ---- right: sheared
	const arrows = [];
	{
		const c = centres[1];
		const shifted = filled.map((f) => { const a = strain(f); return [a[0] + SHIFT[0], a[1] + SHIFT[1]]; });
		for (const [k, f] of filled.entries()) for (const o of corners(f)) bond(page(c, shifted[k]), page(c, strain(o)), 'a bond, sheared');
		for (const o of opens) open(page(c, strain(o)), 'an open atom, sheared');
		for (const [k, f] of filled.entries()) {
			const at = page(c, strain(f)), to = page(c, shifted[k]);
			solid(at, 'a faint atom', true);
			solid(to, 'a shifted atom');
			// the arrow: from the faint circle's centre to the solid circle's edge
			const d = [to[0] - at[0], to[1] - at[1]], l = Math.hypot(...d);
			const end = [to[0] - (d[0] / l) * (R + 0.4), to[1] - (d[1] / l) * (R + 0.4)];
			arrows.push(S.arrow(at, end, { color: INK, width: SHIFT_W, head: SHIFT_HEAD, layer: 3, what: 'a shift' }));
			// every solid circle is the faint one moved by the same vector: the shift is uniform
			check(near(d[0], SHIFT[0] * CELL, 1e-9) && near(d[1], -SHIFT[1] * CELL, 1e-9), 'the shift is not uniform');
		}
		// the sign arrows at the patch's four corners: orange outward along the stretched diagonal (1, 1), blue inward
		// along the squeezed one (1, -1)
		const h = N / 2;
		for (const [corner, out] of [[[h, h], true], [[-h, -h], true], [[h, -h], false], [[-h, h], false]]) {
			const q = page(c, strain(corner));
			const dir = [Math.sign(corner[0]) * Math.SQRT1_2, -Math.sign(corner[1]) * Math.SQRT1_2];   // outward, page
			const near0 = [q[0] + dir[0] * (R + SIGN.clear), q[1] + dir[1] * (R + SIGN.clear)];
			const far = [near0[0] + dir[0] * SIGN.len, near0[1] + dir[1] * SIGN.len];
			S.arrow(out ? near0 : far, out ? far : near0, { color: out ? ACCENT : ACCENT2, width: PUSH, head: PUSH_HEAD, layer: 3, what: out ? 'a stretch arrow' : 'a squeeze arrow' });
			// a stretch where the corner moved out along its diagonal, a squeeze where it moved in
			const moved = Math.hypot(...strain(corner)) - Math.hypot(...corner);
			check(out ? moved > 0 : moved < 0, `the corner ${corner} is not ${out ? 'stretched' : 'squeezed'}`);
		}
	}

	// ---- the names: over each half, on one baseline; under the sheared patch, the internal strain
	const top = ORIGIN - span / 2 * (1 + EPS) - R - SIGN.clear - SIGN.len - 7;
	L.push(await onBase('\\text{at rest}', centres[0][0], top));
	L.push(await onBase('\\text{sheared}', centres[1][0], top));
	const low = ORIGIN + span / 2 * (1 + EPS) + R + SIGN.clear + SIGN.len + 11;
	L.push(await onBase('\\text{internal strain,}\\propto\\zeta_K', centres[1][0], low));

	S.checkAll(L);
	window[name + '-numbers'] = { EPS, SHIFT, arrows: arrows.map((a) => a.L) };
	return finish(S, L, [285, 345]);
}
