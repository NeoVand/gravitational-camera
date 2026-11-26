// The tutorial, section 3.2 (tutorial/noise/random-signals.md), its first diagram: white noise in time and across a
// plane. Top row, three panels for white noise in time: a record n(t) over two seconds; its spectrum S(omega), the same
// at every frequency, negative and positive, with the band from -omega to omega shaded; and its autocorrelation C(t),
// a single spike at zero lag of area S(0), drawn as an arrow (a delta function has no height). Bottom row: the noise
// of the array of 11 x 11 pixels, each pixel's reading drawn from one Gaussian and shown on the paper's diverging
// scale (orange above zero, blue below), and beside it, on the grid of the 11 x 11 wavevectors of the same array,
// the mean of |n~(k)|^2 / A over many such maps, drawn as its expectation: N_0 on every wavevector, the zero one too,
// a slab of one height divided into the wavevectors' cells.
// Exact: the record's draws (seed 5, 50 samples a second, standard deviation 1, asserted within 15%); the map's draws
// (seed 11, standard deviation 1, asserted within 15% with a mean within three standard errors of zero); the slab's
// height N_0, checked against the mean power over 16000 maps (seed 12) of the discrete transform b^2 sum n_a e^{-i k.a}
// at k = (2 pi / 11 b)(p, q), p and q from -5 to 5: N_0 = sigma_n^2 b^2 on every wavevector within five standard
// errors (each an average of 16000 exponential draws, standard error N_0 / sqrt 16000 = 0.8%) and on average within
// three, the zero wavevector included. Schematic: the units of the top row (the spectrum's level, the trace's scale
// and the spike's length), the view of the plate and the slab's height per unit of N_0.
import { Sheet, ORIGIN, finish, checker, placed } from './tut-pot-lib.js';
import { normals, mean, sd, Plot, xAxis, yAxis, NOISE, DATA, MARK, INK, DIM, LABEL_GAP, pathOf } from './tut-prob-lib.js';
import { View, Regions, plate, slab, diverging, meanPower } from './tut-noise-lib.js';

const name = 'tut-noise-hero';
const check = checker(name);
const BAND_OPACITY = 0.2;                    // the band's fill: the noise's colour, as section 3.1's band of the noise

// ---- the simulations ------------------------------------------------------------------------------------------
export const RATE = 50, T = 2;               // the record: samples a second, seconds
export const PIX = 11;                       // the array's pixels on a side
export const MAPS = 16000;                   // maps averaged for the spectrum

export function record() {
	const z = normals(5);
	return Array.from({ length: RATE * T + 1 }, () => z());
}
export function map() {
	const z = normals(11);
	return Array.from({ length: PIX }, () => Array.from({ length: PIX }, () => z()));
}
/** The mean of |n~(k)|^2 / A over MAPS maps, in units of N_0 (b = 1, sigma_n = 1). */
export function spectrum() {
	const z = normals(12);
	const xs = [], ys = [];
	for (let i = 0; i < PIX; i++) for (let j = 0; j < PIX; j++) { xs.push(i); ys.push(j); }
	return meanPower(() => ({ x: xs, y: ys, w: xs.map(() => z()) }), { n: PIX, L: PIX, maps: MAPS });
}

// ---- the drawing (points) -------------------------------------------------------------------------------------
const CW = 84, CH = 44;                      // each chart of the top row
const GAP = [34, 20];                        // between the charts
const UNIT = 5.4;                            // the record: points per unit of noise
const SPIKE = 40;                            // the autocorrelation's arrow, points
const BAND = 0.42;                           // the band's half-width, as a fraction of the spectrum's half-range
const TURN = -22, TILT = 40, SIDE = 100;     // the plates' view and their side, points
const RISE = 0.2;                            // a column's height per unit of N_0, in plate sides
const ROW = 18;                              // from the top row's labels to the columns' tops

export default async function () {
	const rec = record(), m = map(), P = spectrum();
	const flat = m.flat();
	check(Math.abs(sd(rec) - 1) < 0.15, `the record's spread is ${sd(rec)}, not 1`);
	check(Math.abs(sd(flat) - 1) < 0.15, `the map's spread is ${sd(flat)}, not 1`);
	check(Math.abs(mean(flat)) < 3 / PIX, `the map's mean is ${mean(flat)}, not 0`);
	const all = P.flat(), se = 1 / Math.sqrt(MAPS);
	check(all.every((v) => Math.abs(v - 1) < 5 * se), `a wavevector's mean power is ${all.find((v) => Math.abs(v - 1) >= 5 * se)}, not N_0`);
	check(Math.abs(mean(all) - 1) < 3 * se / Math.sqrt(all.length), `the mean power is ${mean(all)}, not N_0`);
	check(Math.abs(P[5][5] - 1) < 5 * se, `the zero wavevector's power is ${P[5][5]}, not N_0`);
	check(all.every((v) => Math.abs(v - 1) < 0.03), 'the simulated maps do not agree with N_0 within the caption\'s 3%');

	const S = new Sheet(name);
	const R = new Regions(name);
	const L = [];
	const left = ORIGIN - (3 * CW + GAP[0] + GAP[1]) / 2, top = ORIGIN - 110;
	const title = top - 5;                   // the three panels' names, on one line

	// ---- (1) the record n(t), over a time axis
	const P1 = new Plot({ left, top, w: CW, h: CH, x0: 0, x1: T, y0: -CH / 2 / UNIT, y1: CH / 2 / UNIT });
	check(Math.max(...rec.map(Math.abs)) < CH / 2 / UNIT, `the record leaves its panel: ${Math.max(...rec.map(Math.abs))}`);
	S.path(rec.map((v, i) => P1.at(i / RATE, v)), { color: INK, width: DATA, layer: 2, what: 'the record' });
	const t1 = await xAxis(S, P1, { ticks: [0, 1, 2], y: P1.bottom + 3, what: 'the time axis' });
	L.push(...t1);
	const axisY = P1.bottom + 3;
	L.push(await placed('t\\ (\\mathrm{s})', t1[2].box.r + 5, (t1[2].box.t + t1[2].box.b) / 2, 0, 0.5, DIM));
	L.push(await placed('n(t)', P1.left, title, 0, 1, INK));

	// ---- (2) the spectrum S(omega): flat, the band from -omega to omega shaded beneath it
	const left2 = left + CW + GAP[0];
	const P2 = new Plot({ left: left2, top, w: CW, h: axisY - top, x0: -1, x1: 1, y0: 0, y1: 1.45 });
	const lvl = P2.Y(1);
	S.raw(`<path d="${pathOf([P2.at(-BAND, 0), P2.at(BAND, 0), P2.at(BAND, 1), P2.at(-BAND, 1)])}" fill="${NOISE}" fill-opacity="${BAND_OPACITY}"/>`, 0.3);
	S.path([[P2.X(-1), lvl], [P2.X(1), lvl]], { color: NOISE, width: MARK, layer: 2, cap: 'butt', what: 'the spectrum' });
	L.push(...(await xAxis(S, P2, { ticks: [-BAND, 0, BAND], fmt: (t) => (t < 0 ? '-\\omega' : t > 0 ? '\\omega' : '0'), what: 'the frequency axis' })));
	L.push(...(await yAxis(S, P2, { ticks: [1], fmt: () => 'S(0)', what: 'the spectrum axis' })));
	L.push(await placed('S(\\omega)', P2.left + 3, title, 0, 1, INK));

	// ---- (3) the autocorrelation C(t): one spike at zero lag
	const left3 = left2 + CW + GAP[1];
	const P3 = new Plot({ left: left3, top, w: CW, h: axisY - top, x0: -1, x1: 1, y0: 0, y1: 1 });
	const t3 = await xAxis(S, P3, { ticks: [-1, 0, 1], what: 'the lag axis' });
	L.push(...t3);
	L.push(await placed('t\\ (\\mathrm{s})', t3[2].box.r + 5, (t3[2].box.t + t3[2].box.b) / 2, 0, 0.5, DIM));
	const foot = [P3.X(0), P3.bottom - 0.225];
	const tip = [P3.X(0), P3.bottom - SPIKE];
	S.arrow(foot, tip, { color: NOISE, width: MARK, what: 'the spike' });
	L.push(await placed('S(0)\\,\\delta(t)', tip[0] + LABEL_GAP + 2.5, tip[1] + 3, 0, 0.5, NOISE));
	L.push(await placed('C(t)', P3.left, title, 0, 1, INK));

	// ---- (4) the map of the array's noise, and (5) its spectrum on the grid of wavevectors
	const base = Math.max(...L.map((l) => l.box.b));
	// the two plates side by side on one base line, the columns' top ROW under the top row
	const V4 = new View({ turn: TURN, tilt: TILT, scale: SIDE, o: [ORIGIN - 80, 0] });
	const V5 = new View({ turn: TURN, tilt: TILT, scale: SIDE, o: [ORIGIN + 80, 0] });
	const zTop = RISE;
	const topOf = (V, z) => Math.min(...[[-0.5, 0.5, z], [0.5, 0.5, z], [-0.5, -0.5, z], [0.5, -0.5, z]].map((p) => V.at(p)[1]));
	V4.o[1] = V5.o[1] = base + ROW - topOf(V5, zTop);
	plate(S, V4, R, { n: PIX, tile: (i, j) => diverging(m[i][j]), what: 'the map' });
	// the spectrum drawn as its expectation, N_0 on every wavevector (the simulation above checks it)
	slab(S, V5, R, { n: PIX, height: RISE, color: NOISE, tint: 0.3, what: 'the spectrum' });
	const under = (V) => Math.max(...[[-0.5, -0.5, -0.025], [0.5, -0.5, -0.025], [0.5, 0.5, -0.025]].map((p) => V.at(p)[1]));
	const yl = Math.max(under(V4), under(V5)) + LABEL_GAP + 2.5;
	L.push(await placed('n(\\mathbf a)', V4.at([0, 0])[0], yl, 0.5, 0, INK));
	L.push(await placed('\\langle|\\tilde n(\\mathbf k)|^2\\rangle = A N_0', V5.at([0, 0])[0], yl, 0.5, 0, NOISE));

	S.checkAll(L);
	R.check(L);
	window.tutNoiseHero = { sdRecord: sd(rec), sdMap: sd(flat), meanPower: mean(all), spread: [Math.min(...all), Math.max(...all)] };
	return finish(S, L, [240, 340]);
}
