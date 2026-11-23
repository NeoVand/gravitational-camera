// The tutorial, chapter 5.5 (tutorial/waves/radiance.md), its first diagram: radiance does not fade along a ray. Two
// small square patches, dA_1 at the left and dA_2 at the right, a distance r apart, facing each other across a
// horizontal axis (dim, finely dashed) through their centres; each is drawn in light perspective as a thin parallelogram,
// its upright edges the square's side and its slanted edges the side seen obliquely. Between them the cone in which
// dA_1 sees dA_2, two straight lines from the centre of dA_1 to the middles of the top and bottom edges of dA_2, filled
// with the neutral tint and named above its middle dOmega_1 = dA_2/r^2; and the cone in which dA_2 sees dA_1, dashed,
// unfilled, named below its middle dOmega_2 = dA_1/r^2. Three small heads on the axis show the rays' direction, named
// "rays" once; a dimension line under everything spans r; each patch is named with its radiance under it.
// Departures from the diagram's comment: the first and last heads stand on the axis just before dA_1 and just beyond
// dA_2, the middle one between the patches, and "rays" is set beyond dA_2: between the patches the two cones leave no
// room for a label on the axis, and the beam that the patches cut crosses both of them. The axis runs a little
// beyond each patch to carry those heads.
// Exact: the cones' lines (each asserted to run from one patch's centre to the middle of an edge of the other), the
// patches' places, r. Schematic: the patches' size against r, so that the cones' angles are greatly exaggerated, as
// the caption says, and the perspective of the patches.
import { Sheet, ORIGIN, finish, checker, placed, near, HAIR, LINE, LABEL_GAP, AXIS } from './tut-pot-lib.js';
import { pathOf } from './tut-prob-lib.js';
import { ZERO_DASH } from './tut-bessel-lib.js';
import { INK, DIM } from '../lib.js';
import { chapter, measure, DASH, TINT } from './tut-rad-lib.js';

const name = 'tut-rad-patches';
const check = checker(name);

// the comment's site pixels at 1440, half a point each (the site shows a point as 1.9 of its pixels)
const K = 0.5;
const X1 = 80, X2 = 560;                  // the patches' centres
const SIDE = 40;                          // a patch's upright side
const SLANT = [7, 5];                     // half its other side, seen obliquely (site pixels, x right and y up)
const BEYOND = 46;                        // the axis runs this far beyond each patch's centre
const HEADS = [X1 - 30, (X1 + X2) / 2, X2 + 30];
const HEAD = 3.4, HEAD_W = 1.25;          // a head's length and half-width, points
const BELOW = 46;                         // the dimension line, under the axis (site pixels)

export default async function () {
	const nums = chapter(check);
	const S = new Sheet(name);
	const L = [];
	const P = ([x, y]) => [ORIGIN - 160 + K * x, ORIGIN - K * y];

	// ---- the patches: parallelograms of upright side SIDE and slanted side 2 SLANT, centred on the axis
	const corners = (c) => [[c - SLANT[0], -SIDE / 2 - SLANT[1]], [c + SLANT[0], -SIDE / 2 + SLANT[1]], [c + SLANT[0], SIDE / 2 + SLANT[1]], [c - SLANT[0], SIDE / 2 - SLANT[1]]];
	for (const [i, c] of [[1, X1], [2, X2]]) {
		S.raw(`<path d="${pathOf(corners(c).map(P))}" fill="${TINT}"/>`, 0.3);
		S.path(corners(c).map(P), { color: INK, width: LINE, layer: 3, closed: true, what: `the patch dA_${i}` });
	}
	// the middles of a patch's top and bottom edges
	const top = (c) => [c, SIDE / 2], bottom = (c) => [c, -SIDE / 2];
	for (const c of [X1, X2]) {
		const k = corners(c);
		check(near((k[2][0] + k[3][0]) / 2, top(c)[0], 1e-12) && near((k[2][1] + k[3][1]) / 2, top(c)[1], 1e-12), 'the top edge\'s middle');
		check(near((k[0][0] + k[1][0]) / 2, bottom(c)[0], 1e-12) && near((k[0][1] + k[1][1]) / 2, bottom(c)[1], 1e-12), 'the bottom edge\'s middle');
	}

	// ---- the axis, dim and dashed, under everything
	S.path([P([X1 - BEYOND, 0]), P([X2 + BEYOND, 0])], { color: DIM, width: AXIS, dash: ZERO_DASH, layer: 0.5, cap: 'butt', what: 'the axis' });

	// ---- the cone in which dA_1 sees dA_2: filled, solid lines; the cone in which dA_2 sees dA_1: dashed, unfilled
	const c1 = [X1, 0], c2 = [X2, 0];
	const cone1 = [P(c1), P(top(X2)), P(bottom(X2))];
	S.raw(`<path d="${pathOf(cone1)}" fill="${TINT}"/>`, 0.2);
	for (const e of [top(X2), bottom(X2)]) S.path([P(c1), P(e)], { color: INK, width: HAIR + 0.05, layer: 2, cap: 'butt', what: 'the cone of dA_1' });
	for (const e of [top(X1), bottom(X1)]) S.path([P(c2), P(e)], { color: INK, width: HAIR + 0.05, dash: DASH, layer: 2, cap: 'butt', what: 'the cone of dA_2' });
	// the two cones' half-heights at the middle are equal: each patch subtends the same angle at the other's centre
	const mid = (X1 + X2) / 2, h1 = (SIDE / 2) * (mid - X1) / (X2 - X1), h2 = (SIDE / 2) * (X2 - mid) / (X2 - X1);
	check(near(h1, h2, 1e-12), 'the cones are not equal at the middle');

	// ---- the rays' heads on the axis, pointing right
	for (const x of HEADS) {
		const [px, py] = P([x, 0]);
		const box = { l: px - HEAD / 2, r: px + HEAD / 2, t: py - HEAD_W, b: py + HEAD_W };
		S.fill(pathOf([[px + HEAD / 2, py], [px - HEAD / 2, py - HEAD_W], [px - HEAD / 2, py + HEAD_W]]), box, { color: INK, layer: 3, what: `the head at ${x}` });
	}

	// ---- the dimension line r, under everything
	const yd = -SIDE / 2 - SLANT[1] - BELOW;
	measure(S, P([X1, yd]), P([X2, yd]), { color: DIM, what: 'r' });

	// ---- the labels
	const [mx, my] = P([mid, 0]);
	L.push(await S.clear('\\mathrm{d}\\Omega_1 = \\mathrm{d}A_2/r^2', mx, my - K * h1 - LABEL_GAP - 0.6, 0.5, 1, [0, -1], { color: INK }));
	L.push(await S.clear('\\mathrm{d}\\Omega_2 = \\mathrm{d}A_1/r^2', mx, my + K * h2 + LABEL_GAP + 0.6, 0.5, 0, [0, 1], { color: INK }));
	{
		const [x, y] = P([HEADS[2], 0]);
		L.push(await S.clear('\\text{rays}', x, y - LABEL_GAP - 1.5, 0.5, 1, [0, -1], { color: DIM }));
	}
	for (const [src, c] of [['\\mathrm{d}A_1,\\ I_1', X1], ['\\mathrm{d}A_2,\\ I_2', X2]]) {
		const [x, y] = P([c, -SIDE / 2 - SLANT[1]]);
		L.push(await S.clear(src, x, y + LABEL_GAP + 0.6, 0.5, 0, [0, 1], { color: INK }));
	}
	{
		const [x, y] = P([mid, yd]);
		L.push(await S.clear('r', x, y + LABEL_GAP + 0.8, 0.5, 0, [0, 1], { color: DIM }));
	}
	// the labels under the patches stand above the dimension line
	check(L.slice(-3, -1).every((l) => l.box.b < P([0, yd])[1] - 2.5 - LABEL_GAP), 'a patch\'s name reaches the dimension line');

	S.checkAll(L);
	window[name + '-numbers'] = { ...nums, halfAngle: Math.atan(SIDE / 2 / (X2 - X1)) };
	return finish(S, L, [240, 340]);
}
