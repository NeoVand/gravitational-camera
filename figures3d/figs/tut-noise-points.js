// The tutorial, chapter 3.2 (tutorial/noise/random-signals.md), its fourth diagram: masses dropped at random places
// are a white noise too. Top row, left: a square region with masses m dropped at independent, evenly spread places,
// their number a Poisson count of mean 400 (nu = 1 per unit area on a region of side 20), each a dot whose area is in
// proportion to its mass. Right: the mean of |sigma~(k)|^2 / A over many such drawings on the 11 x 11 wavevectors
// k = (2 pi / 20)(p, q), p and q from -5 to 5, drawn as its expectation: a slab of height nu m^2 divided into the
// wavevectors' cells, and at k = 0, where the uniform mean of the sheet gives nu m^2 (1 + nu A) = 401 nu m^2, far off
// the scale, an arrow rising from the centre of that cell (shaded deeper). Bottom row: the same region with 40 times as
// many masses (a Poisson count of mean 16,000) of a fortieth of the mass, each dot a fortieth of the area, so that the
// page carries the same ink; its slab nu m^2 / 40 tall, on the same scale, and its spike the same, 400.0 nu m^2.
// Exact: the drawn places (seeds 41 and 42, rounded to a tenth of a point) and their numbers (asserted within four
// standard deviations of 400 and 16,000; the first is 402, as the caption says); every dot's area in proportion to its
// mass (each a round-capped stroke a tenth of a point long, its width set to give that area); the heights drawn,
// checked against the mean powers over 8000 drawings (seed 43) and 400 (seed 44) of the transform
// m sum_j e^{-i k.a_j} divided by A = 400: on the 120 wavevectors other than zero, each within five standard errors of
// nu m^2 (resp. nu m^2 / 40) and their mean within three (the power at k is the power at -k, so 60 are independent);
// at k = 0, within five standard errors of 401 nu m^2 (resp. 400.0 nu m^2). Schematic: the view of the plates, the
// slab's height per unit of nu m^2, and the arrow's length (the column it stands for would be 400 times as tall).
import { Sheet, ORIGIN, finish, checker, placed } from './tut-pot-lib.js';
import { uniforms, mean, INK, DIM, LABEL_GAP, pathOf } from './tut-prob-lib.js';
import { TINT } from './tut-prob-lib.js';
import { View, Regions, plate, slab, meanPower, n2 } from './tut-noise-lib.js';

const name = 'tut-noise-points';
const check = checker(name);

// ---- the simulation (lengths in units of nu^(-1/2), masses in units of m) ---------------------------------------
export const SIDE_L = 20;                    // the region's side: A = 400, so the mean number is 400
export const A = SIDE_L * SIDE_L;
export const K = 11;                         // wavevectors on a side
export const MORE = 40;                      // the second row: 40 times as many masses, of a fortieth of the mass
export const ROWS = [
	{ nu: 1, m: 1, seed: 41, specSeed: 43, maps: 8000 },
	{ nu: MORE, m: 1 / MORE, seed: 42, specSeed: 44, maps: 400 }
];

/** One drawing: a Poisson number of places (arrivals of rate lambda on [0, 1], by exponential gaps), evenly spread. */
export function drawing(u, nu, m) {
	const lambda = nu * A;
	let t = -Math.log(1 - u()) / lambda, N = 0;
	while (t <= 1) { N++; t += -Math.log(1 - u()) / lambda; }
	const x = new Float64Array(N), y = new Float64Array(N), w = new Float64Array(N).fill(m);
	for (let k = 0; k < N; k++) { x[k] = SIDE_L * u(); y[k] = SIDE_L * u(); }
	return { x, y, w };
}

/** The dots of a drawing in the view V, each a stroke a tenth of a point long with round caps (a stroke of zero length
 * is dropped by the browser once it is narrower than a screen pixel, as the small dots of the second row are on a
 * phone), its width set so that the dot's area is `area`. Written inside a group scaled by a tenth, so that every
 * place, rounded to a tenth of a point, is a whole number: the places are visited in bands 0.6 points tall, back and
 * forth, and each is reached by a relative move from the end of the dot before, so that the many dots of the second
 * row cost few characters. Returns the group and the stroke's width (points). */
function dots(d, V, area, color) {
	const w = (-LEN + Math.sqrt(LEN * LEN + Math.PI * area)) / (Math.PI / 2);
	check(Math.abs(Math.PI * w * w / 4 + LEN * w - area) < 1e-12, 'a dot does not have its area');
	const pts = Array.from(d.x, (x, k) => V.at([x / SIDE_L - 0.5, d.y[k] / SIDE_L - 0.5, 0]).map((v) => Math.round(v * 10)));
	const band = 6;
	pts.sort((a, b) => Math.floor(a[1] / band) - Math.floor(b[1] / band) || (Math.floor(a[1] / band) % 2 ? b[0] - a[0] : a[0] - b[0]));
	let p = `M${pts[0][0]},${pts[0][1]}h1`, pen = [pts[0][0] + 1, pts[0][1]];
	for (let k = 1; k < pts.length; k++) {
		const dx = pts[k][0] - pen[0], dy = pts[k][1] - pen[1];
		p += `m${dx}${dy < 0 ? '' : ','}${dy}h1`;
		pen = [pts[k][0] + 1, pts[k][1]];
	}
	return { svg: `<g transform="scale(.1)"><path d="${p}" stroke="${color}" stroke-width="${n2(10 * w)}" stroke-linecap="round" fill="none"/></g>`, w };
}

// ---- the drawing (points) ---------------------------------------------------------------------------------------
const TURN = -22, TILT = 40, SIDE = 92;      // the view (as tut-noise-hero) and the plates' side
const RISE = 0.17;                           // the slab's height per unit of nu m^2, in plate sides
const TINT_SLAB = 0.16;                      // the spectrum's tint over the page (and once more on the k = 0 cell)
const DOT = 0.82;                            // a dot of mass m has the area of a disc of this radius, points
const LEN = 0.1;                             // each dot's stroke: a tenth of a point long, with round caps
const ARROW = 11;                            // how far the spike's arrow reaches above the slab's far corner, points
const APART = 136;                           // between the centres of the two plates of a row
const PITCH = 124;                           // between the rows

export default async function () {
	const out = [];
	for (const row of ROWS) {
		const P = meanPower(((u) => () => drawing(u, row.nu, row.m))(uniforms(row.specSeed)), { n: K, L: SIDE_L, maps: row.maps });
		const floor = row.nu * row.m ** 2, h = (K - 1) / 2;
		const rest = P.flat().filter((_, k) => k !== h * K + h);
		const se = floor / Math.sqrt(row.maps);
		check(rest.every((v) => Math.abs(v - floor) < 5 * se), `a wavevector's mean power is ${rest.find((v) => Math.abs(v - floor) >= 5 * se)}, not ${floor}`);
		check(Math.abs(mean(rest) - floor) < 3 * se / Math.sqrt(60), `the mean power off zero is ${mean(rest)}, not ${floor}`);
		const lambda = row.nu * A, zero = (row.m ** 2 * (lambda + lambda ** 2)) / A;
		const seZero = (row.m ** 2 * 2 * lambda ** 1.5) / A / Math.sqrt(row.maps);
		check(Math.abs(P[h][h] - zero) < 5 * seZero, `the power at k = 0 is ${P[h][h]}, not ${zero}`);
		const d = drawing(uniforms(row.seed), row.nu, row.m);
		check(Math.abs(d.x.length - lambda) < 4 * Math.sqrt(lambda), `the drawing holds ${d.x.length} masses, not about ${lambda}`);
		out.push({ ...row, P, floor, zero, d, h });
	}
	check(Math.abs(out[1].zero / out[0].zero - 1) < 0.01, 'the two rows\' spikes differ');
	check(out[0].d.x.length === 402, `the first drawing holds ${out[0].d.x.length} masses, not the caption's 402`);
	check(Math.abs(out[0].floor / out[1].floor - MORE) < 1e-9, `the second row's floor is not a fortieth of the first's`);

	const S = new Sheet(name);
	const R = new Regions(name);
	const L = [];
	for (const [r, row] of out.entries()) {
		const y0 = ORIGIN - PITCH / 2 + r * PITCH;
		const V1 = new View({ turn: TURN, tilt: TILT, scale: SIDE, o: [ORIGIN - APART / 2, y0] });
		const V2 = new View({ turn: TURN, tilt: TILT, scale: SIDE, o: [ORIGIN + APART / 2, y0] });
		const what = r ? 'the second' : 'the first';

		// ---- the region, and its masses: a dot's area in proportion to its mass, so the ink per area is the same
		plate(S, V1, R, { n: 1, top: TINT, what: `${what} region` });
		const area = Math.PI * DOT * DOT * row.m;
		S.raw(dots(row.d, V1, area, INK).svg, 2);

		// ---- its spectrum, drawn as its expectation: nu m^2 on every wavevector but k = 0 (the simulation above checks
		// it), a slab divided into the wavevectors' cells; at k = 0 the mean sheet, off the scale, an arrow rising from
		// the centre of that cell, which is shaded deeper
		const zc = RISE * row.floor / out[0].floor;
		slab(S, V2, R, { n: K, height: zc, color: INK, tint: TINT_SLAB, what: `${what} spectrum` });
		const c = 1 / K;
		const cell = [[-c / 2, -c / 2], [c / 2, -c / 2], [c / 2, c / 2], [-c / 2, c / 2]].map(([x, y]) => V2.at([x, y, zc]));
		S.raw(`<path d="${pathOf(cell)}" fill="${INK}" fill-opacity="${TINT_SLAB}"/>`, 1.1);
		const foot = V2.at([0, 0, zc]);
		const far = Math.min(...[[-0.5, 0.5], [0.5, 0.5], [-0.5, -0.5], [0.5, -0.5]].map(([x, y]) => V2.at([x, y, zc])[1]));
		const tip = [foot[0], far - ARROW];
		S.arrow(foot, tip, { color: INK, width: 0.6, layer: 3, what: `${what} spike` });
		L.push(await placed('\\mathbf k = 0', tip[0] + LABEL_GAP + 1.6, tip[1] + 2.6, 0, 0.5, INK));

		// ---- the names: the mass of a dot, left of the region; the floor, right of the slab at its top
		const lc = V1.at([-0.5, 0, 0]);
		L.push(await placed(r ? 'm/40' : 'm', Math.min(lc[0], V1.at([-0.5, -0.5, 0])[0]) - 6, lc[1], 1, 0.5, INK));
		const rc = V2.at([0.5, 0, zc]);
		const right = Math.max(...[[0.5, -0.5], [0.5, 0.5]].flatMap(([x, y]) => [V2.at([x, y, 0])[0], V2.at([x, y, zc])[0]]));
		L.push(await placed(r ? '\\nu m^2/40' : '\\nu m^2', right + 5, rc[1], 0, 0.5, INK));
	}

	S.checkAll(L);
	R.check(L);
	window.tutNoisePoints = out.map((o) => ({ N: o.d.x.length, floor: o.floor, zero: o.P[o.h][o.h], meanRest: mean(o.P.flat().filter((_, k) => k !== o.h * K + o.h)) }));
	return finish(S, L, [240, 340]);
}
