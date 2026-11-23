// The tutorial, chapter 3.2 (tutorial/noise/random-signals.md), its third diagram: the variance of the noise averaged
// over a patch of the array falls as one over the patch's area. The array of 11 x 11 pixels a distance b = 10 cm
// apart, seen from above at a slant as the paper's figures draw it (figs/tut-blur.js), each pixel a tile shaded by its
// own noise on the diverging scale (orange above zero, blue below). Three squares outlined on it: one pixel at the
// near left corner, whose reading has the variance sigma_n(tau)^2; a patch of side z = 3b at the near right corner,
// nine pixels, whose average has the variance N_0 / z^2 = sigma_n(tau)^2 b^2 / z^2; and, dashed, a patch of side
// 2z at the far left, 36 pixels, whose average has the variance N_0 / 4 z^2.
// Exact: the drawn map's draws (seed 21; standard deviation 1, asserted within 15%); the three squares' sizes, and
// the variances the labels state, checked on 40,000 further maps (seed 22): the variance of a pixel's reading, of the
// average over the nine pixels and of that over the 36, asserted to be 1, 1/9 and 1/36 of the pixel's within 3%
// (each a sample variance of 40,000 draws, standard error 0.7%). Schematic: the view of the plate and its thickness.
import { Sheet, ORIGIN, finish, checker, placed } from './tut-pot-lib.js';
import { normals, mean, sd, INK, DIM, LABEL_GAP } from './tut-prob-lib.js';
import { View, Regions, plate, diverging, dimension3 } from './tut-noise-lib.js';

const name = 'tut-noise-patch';
const check = checker(name);

// ---- the simulation ---------------------------------------------------------------------------------------------
export const PIX = 11;                   // pixels on a side
export const Z = 3;                      // the patch's side, in pixels: z = 3b
export const PIXEL = [0, 0];             // the one pixel: its column and row (rows counted away from the viewer)
export const PATCH = [8, 0];             // the patch of side z: its first column and row
export const BIG = [0, 5];               // the patch of side 2z, dashed
export const MAPS = 40000;

export function map(seed = 21) {
	const z = normals(seed);
	return Array.from({ length: PIX }, () => Array.from({ length: PIX }, () => z()));
}
const average = (m, [i0, j0], s) => { let t = 0; for (let i = i0; i < i0 + s; i++) for (let j = j0; j < j0 + s; j++) t += m[i][j]; return t / (s * s); };

export function variances() {
	const z = normals(22);
	const one = [], nine = [], many = [];
	for (let k = 0; k < MAPS; k++) {
		const m = Array.from({ length: PIX }, () => Array.from({ length: PIX }, () => z()));
		one.push(m[PIXEL[0]][PIXEL[1]]);
		nine.push(average(m, PATCH, Z));
		many.push(average(m, BIG, 2 * Z));
	}
	const v = (xs) => sd(xs) ** 2;
	return { one: v(one), nine: v(nine), many: v(many) };
}

// ---- the drawing (points) ---------------------------------------------------------------------------------------
const TURN = -18, TILT = 48, SIDE = 150;     // the view, and the plate's side
const LINE = 0.6;                            // the squares' outlines
const DASH = [1.6, 1.3];

export default async function () {
	const m = map(), flat = m.flat();
	check(Math.abs(sd(flat) - 1) < 0.15, `the map's spread is ${sd(flat)}, not 1`);
	check(Math.abs(mean(flat)) < 3 / PIX, `the map's mean is ${mean(flat)}, not 0`);
	const v = variances();
	check(Math.abs(v.one - 1) < 0.03, `a pixel's variance is ${v.one}, not 1`);
	check(Math.abs(v.nine * Z * Z - 1) < 0.03, `the patch average's variance is ${v.nine}, not 1/${Z * Z}`);
	check(Math.abs(v.many * 4 * Z * Z - 1) < 0.03, `the larger patch average's variance is ${v.many}, not 1/${4 * Z * Z}`);
	check(PATCH[0] + Z === PIX && PATCH[1] === 0 && BIG[0] === 0 && BIG[1] + 2 * Z === PIX + 0, 'the patches are not at the plate\'s corners');

	const S = new Sheet(name);
	const R = new Regions(name);
	const L = [];
	const V = new View({ turn: TURN, tilt: TILT, scale: SIDE, o: [ORIGIN, ORIGIN] });
	plate(S, V, R, { n: PIX, tile: (i, j) => diverging(m[i][j]), what: 'the array' });

	// ---- the three squares on the plate's top
	const w = (i, j) => [i / PIX - 0.5, j / PIX - 0.5, 0];
	const square = ([i, j], s) => [w(i, j), w(i + s, j), w(i + s, j + s), w(i, j + s), w(i, j)].map((p) => V.at(p));
	S.path(square(PIXEL, 1), { color: INK, width: LINE, layer: 2, cap: 'butt', what: 'the pixel' });
	S.path(square(PATCH, Z), { color: INK, width: LINE, layer: 2, cap: 'butt', what: 'the patch' });
	S.path(square(BIG, 2 * Z), { color: INK, width: LINE, layer: 2, cap: 'butt', dash: DASH, what: 'the larger patch' });

	// ---- the sides: b under the pixel and z under the patch, along the near edge; 2z beside the larger patch, along
	// the left edge
	const near = [0, -1], leftward = [-1, 0];
	const db = dimension3(S, V, w(0, 0), w(1, 0), near, { what: 'the pixel\'s side' });
	const dz = dimension3(S, V, w(PATCH[0], 0), w(PIX, 0), near, { what: 'the patch\'s side' });
	const d2 = dimension3(S, V, w(0, BIG[1]), w(0, PIX), leftward, { what: 'the larger patch\'s side' });
	const at = (d, gap = LABEL_GAP + 1) => [d.mid[0] + d.out[0] * gap, d.mid[1] + d.out[1] * gap];
	// each beside its line, moved out along the line's outward direction until it clears every mark
	const lab = async (src, d, ax, ay, gap) => { const p = at(d, gap); return S.clear(src, p[0], p[1], ax, ay, d.out, { color: DIM }); };
	L.push(await lab('b = 10\\,\\mathrm{cm}', db, 0.5, 0, LABEL_GAP + 0.6));
	L.push(await lab('z', dz, 0.5, 0, LABEL_GAP + 0.6));
	L.push(await lab('2z', d2, 1, 0.5, LABEL_GAP + 1));

	// ---- the variances, each beside its square, outside the plate
	const pxLeft = V.at(w(0, 0)), pxMid = V.at([0.5 / PIX - 0.5, 0.5 / PIX - 0.5, 0]);
	L.push(await S.clear('\\mathrm{Var}\\,n = \\sigma_n(\\tau)^2', pxLeft[0] - 5, pxMid[1], 1, 0.5, [-1, 0], { color: INK }));
	const pr = V.at(w(PIX, 0)), pr2 = V.at(w(PIX, Z));
	const xr = Math.max(pr[0], pr2[0]) + 7, yr = (pr[1] + pr2[1]) / 2;
	const l1 = await placed('\\mathrm{Var}\\,\\bar n = N_0/z^2', xr, yr - 1.8, 0, 1, INK);
	L.push(l1);
	L.push(await placed('= \\sigma_n(\\tau)^2\\,b^2/z^2', l1.box.l + 6.2, l1.box.b + 3.2, 0, 0, INK));
	const bl = V.at(w(0, PIX));
	L.push(await placed('\\mathrm{Var}\\,\\bar n = N_0/4z^2', bl[0] - 4, bl[1] - 6, 1, 1, INK));

	S.checkAll(L);
	R.check(L);
	window.tutNoisePatch = { ...v, sd: sd(flat) };
	return finish(S, L, [240, 340]);
}
