// The tutorial, chapter 3.3 (tutorial/noise/measuring-a-number.md), its fourth diagram: two masses are hard to tell
// from one. Left: the datum d = -E_zz of the chapter's model camera along the line across the plane through the
// masses, for one mass m at depth z under x = 0 (orange) and for two masses m/2 at x = +-delta/2, delta = 0.3 z
// (blue, dashed), in units of G m / z^3: d(a) = G m (2 z^2 - a^2) / (z^2 + a^2)^(5/2), the pair's the average of the
// single mass's shifted by +-delta/2. They lie nearly on top of each other. Right: their difference, the pair's less
// the single mass's, drawn ten times taller (in points per unit) than the profiles, for delta = 0.3 z and, beneath it
// on its own axis and the same scale, for delta = 0.15 z: a trough over the masses between two low ridges, the shape
// of d''(x) delta^2 / 8, about four times smaller when delta is halved (3.88 times at x = 0).
// Exact: every curve (sampled every quarter of a point), asserted against the second-order Taylor form at x = 0
// (within 5%: 4.1% off at 0.3 z, 1.0% at 0.15 z) and the ratio of the two differences there (within 4% of 4). Nothing
// is schematic; the magnification is exactly 10.
import { Sheet, ORIGIN, finish, checker, near, placed } from './tut-pot-lib.js';
import { Plot, xAxis, yAxis, INK, DIM, ACCENT, ACCENT2, CURVE } from './tut-prob-lib.js';
import { graph, longest, datum } from './tut-measure-lib.js';

const name = 'tut-measure-pair';
const check = checker(name);

export const SPLITS = [0.3, 0.15];
export const MAG = 10;
const K = 36;                            // the profiles' scale, points per unit of G m / z^3 (the differences' is K MAG)
const CW = 128;                          // each chart's width
const GAP = 46;                          // between the columns
const GAPV = 7;                          // between the two differences' charts
const XMAX = 3;
const RANGES = [[-1.4, 0.6], [-0.42, 0.2]];                 // the differences, times MAG
const DASH = [2.2, 1.4];
const INSET = 0.12;                      // the curves stop this far (x/z) inside the charts, clear of the y axes and their ticks at 0

const pair = (x, dl) => 0.5 * (datum(x - dl / 2) + datum(x + dl / 2));
const diff = (x, dl) => pair(x, dl) - datum(x);

export default async function () {
	// ---- the numbers
	check(near(datum(0), 2, 1e-15) && near(datum(Math.SQRT2), 0, 1e-15), 'd is not 2 G m / z^3 above the mass and zero at sqrt 2 z');
	// d''(0) = -12 (d = 2 - 6 a^2 + ... near a = 0), so the difference at x = 0 is about -12 delta^2 / 8
	for (const dl of SPLITS) check(near(diff(0, dl) / (-12 * dl * dl / 8), 1, 0.05), `the difference at 0 for delta = ${dl} is not the Taylor form`);
	const ratio = diff(0, 0.3) / diff(0, 0.15);
	check(near(ratio, 4, 0.16), `the two differences differ by ${ratio}, not about 4`);

	const S = new Sheet(name);
	const L = [];
	const hs = RANGES.map(([a, b]) => (b - a) * K);
	const H = hs[0] + GAPV + hs[1];
	const left = ORIGIN - CW - GAP / 2, top = ORIGIN - H / 2;
	// the profiles fill the column's height, the headroom above the peak holding the axis's name
	const P1 = new Plot({ left, top, w: CW, h: H, x0: -XMAX, x1: XMAX, y0: -0.3, y1: -0.3 + H / K });
	const P2 = new Plot({ left: left + CW + GAP, top, w: CW, h: hs[0], x0: -XMAX, x1: XMAX, y0: RANGES[0][0], y1: RANGES[0][1] });
	const P3 = new Plot({ left: left + CW + GAP, top: top + hs[0] + GAPV, w: CW, h: hs[1], x0: -XMAX, x1: XMAX, y0: RANGES[1][0], y1: RANGES[1][1] });
	for (const P of [P2, P3]) check(near(P.h / (P.y1 - P.y0), K, 1e-9), 'a difference is not on the profiles\' scale');
	check(near(P1.h / (P1.y1 - P1.y0), K, 1e-9) && P1.y1 > 2.4, 'the profiles are off their scale or have no headroom');
	const curve = (P, f, opts, what) => {
		const pts = graph(P, f, -XMAX + INSET, XMAX - INSET);
		check(longest(pts) <= 0.25 + 1e-9, `${what} is drawn in steps longer than a quarter of a point`);
		check(pts.every(([, y]) => P.bottom - y >= (CURVE + 0.45) / 2 + 2 && y >= P.top - 1e-9), `${what} leaves its chart or meets its axis`);
		S.path(pts, { width: CURVE, layer: 2, what, ...opts });
	};

	// ---- left: the profiles
	curve(P1, datum, { color: ACCENT }, 'one mass');
	curve(P1, (x) => pair(x, 0.3), { color: ACCENT2, dash: DASH, cap: 'butt' }, 'two masses');
	// ---- right: the differences, ten times taller
	curve(P2, (x) => MAG * diff(x, 0.3), { color: INK }, 'the difference at 0.3 z');
	curve(P3, (x) => MAG * diff(x, 0.15), { color: INK }, 'the difference at 0.15 z');

	// ---- the axes: numbers under the profiles and under the lower difference only
	const fmt = (t) => (t < 0 ? `-${-t}` : `${t}`);
	for (const [P, xnum, ticks, what] of [[P1, true, [0, 1, 2], 'the profile'], [P2, false, [-1, 0], 'the difference at 0.3 z'], [P3, true, [0], 'the difference at 0.15 z']]) {
		const xl = await xAxis(S, P, { ticks: [-2, 0, 2], fmt: xnum ? fmt : () => null, what: `${what}'s x axis` });
		if (xnum) {
			L.push(...xl);
			const last = xl[xl.length - 1];
			L.push(await placed('x/z', last.box.r + 4, (last.box.t + last.box.b) / 2, 0, 0.5, DIM));
		}
		L.push(...(await yAxis(S, P, { ticks, fmt, what: `${what}'s y axis` })));
	}
	L.push(await placed('d\\,z^3/Gm', P1.left + 4.5, P1.top, 0, 0.5, DIM));
	L.push(await placed(`\\times ${MAG}`, P2.left + 4.5, P2.top, 0, 0.5, DIM));

	// ---- the curves' names
	const flank = (P, f, y, side) => {
		// where f comes down to y on the side `side` of x = 0
		let a = 0, b = side * XMAX;
		for (let k = 0; k < 60; k++) { const m = (a + b) / 2; if (f(m) > y) a = m; else b = m; }
		return P.at((a + b) / 2, y);
	};
	let q = flank(P1, datum, 1.2, -1);
	L.push(await S.clear('\\text{one mass}', q[0] - 2, q[1], 1, 0.5, [-1, 0], { color: ACCENT }));
	q = flank(P1, (x) => pair(x, 0.3), 1.2, 1);
	L.push(await S.clear('\\text{two masses}', q[0] + 2, q[1], 0, 0.5, [1, 0], { color: ACCENT2 }));
	// the differences: each named under its flat left reach, between the curve and its axis
	for (const [P, dl] of [[P2, 0.3], [P3, 0.15]]) {
		const y = (P.Y(0) + P.bottom) / 2;
		L.push(await S.clear(`\\delta = ${dl}z`, P.X(-1.05), y, 1, 0.5, [-1, 0], { color: INK }));
	}

	S.checkAll(L);
	window.tutMeasurePair = { centre: SPLITS.map((dl) => diff(0, dl)), ratio };
	return finish(S, L, [240, 340]);
}
