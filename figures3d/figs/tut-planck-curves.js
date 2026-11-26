// The tutorial, section 10.1 (tutorial/glow/black-body.md), its second diagram: Planck's law at three temperatures.
// One panel on linear axes: across, the frequency f = omega / 2 pi from 0 to 250 THz; up, B_omega, with no numbers
// (shape only), in units of the 1500 K curve's top. B_omega at 700 K and 1500 K in two neutral inks, the paler for
// the cooler; on each a filled dot at the energy peak, f = 2.821 k_B T / h (41.2 and 88.2 THz), and an open dot on the
// curve at the count's peak, f = 1.594 k_B T / h (23.2 and 49.8 THz). The Rayleigh-Jeans law omega^2 k_B T / 4 pi^3
// c^2 at 1500 K, dashed, leaving the frame upward. Ink and the page's greys only: no orange or blue.
// Departures from the diagram's comment: the 293 K curve stands in an inset at the upper right, its heights forty
// times those of the panel and its frequencies on the panel's own scale, with its dots at 17.2 and 9.73 THz: drawn at
// its true height, (293/1500)^3 = 1/134 of the 1500 K curve's, it would be under a point tall and lie on the axis, as
// would its dots. The caption says so. The curves are named beside them, and the dashed line "Rayleigh-Jeans, 1500 K"
// where it leaves the frame. Each curve runs the whole of its axis (0 to 250 THz, the inset's 0 to 60 THz), its tail just
// above the axis.
// Exact: every curve (B_omega and the Rayleigh-Jeans law in SI, asserted to be x^3 / (e^x - 1) and x^2 times
// (hbar / 4 pi^3 c^2)(k_B T / hbar)^3, and to grow as T^3 at a fixed x, in tut-planck-lib.js), the dots (the roots of
// x = n (1 - e^{-x}), asserted maxima of B_omega and of B_omega / hbar omega in f) and the inset's factor 40.
// Schematic: nothing.
import { Sheet, ORIGIN, finish, checker, placed, LABEL_GAP, AXIS, HAIR, TICK, n2 } from './tut-pot-lib.js';
import { Plot, xAxis, NUM } from './tut-prob-lib.js';
import { graph, longest } from './tut-fourier-lib.js';
import { INK, DIM, FAINT, PAGE } from '../lib.js';
import { chapter, palette, near, planck, rayleighJeans, thz, ENERGY, COUNT } from './tut-planck-lib.js';

const name = 'tut-planck-curves';
const check = checker(name);

// ---- the drawing (points) ----------------------------------------------------------------------------------------
const F1 = 250, Y1 = 1.25;                      // the panel's frequencies (THz) and its height, in units of the top
const DX = 1.12, DY = 124;                      // points per THz and per unit up
const CURVE = 0.7, RJ = 0.6, RJ_DASH = [3, 2];
const DOT = 1.55, OPEN_W = 0.55;                // the dots: radius, and the open dot's ring
const SHADE = { 293: FAINT, 700: DIM, 1500: INK };
const MAG = 40;                                 // the inset's heights over the panel's
const INSET = { f0: 162, f1: 60, b0: 0.69 };    // the inset's left edge (THz of the panel), its range (THz), its axis (units)
const caption = 'Look first at the dashed line: the classical law follows the 1500 K curve only at the lowest frequencies, then climbs without limit, while the true glow turns over and dies away. Filled dots mark where the energy per unit frequency peaks, open dots where the count of quanta peaks; both move in proportion to the temperature. The 293 K curve, in the inset, is drawn forty times taller. All curves are exact.';

export default async function () {
	const { state, peaks } = await chapter(check);
	await palette(check);
	state(name, 'planck-curves', caption);

	const S = new Sheet(name);
	const L = [];
	const top = planck(thz(ENERGY, 1500), 1500);
	const b = (f, T) => (f === 0 ? 0 : planck(f, T) / top);   // B_omega in units of the 1500 K top (0 at f = 0)
	const W = F1 * DX, H = Y1 * DY;
	const P = new Plot({ left: ORIGIN - W / 2, top: ORIGIN - H / 2, w: W, h: H, x0: 0, x1: F1, y0: 0, y1: Y1 });

	// ---- the axes: across ticked and numbered every 50 THz; up, a bare line with its name
	const xl = await xAxis(S, P, { ticks: [0, 50, 100, 150, 200, 250], what: 'the axis across' });
	L.push(...xl);
	L.push(await placed('\\text{frequency (THz)}', P.X(F1 / 2), Math.max(...xl.map((l) => l.box.b)) + 4, 0.5, 0, DIM));
	S.path([[P.left, P.bottom], [P.left, P.top]], { color: DIM, width: AXIS, layer: 1, cap: 'butt', what: 'the axis up' });
	L.push(await placed('B_\\omega', P.left, P.top - 4.5, 0.5, 1, DIM));

	/** A curve on the plot Q from `from` to `to`, the whole of Q's axis (asserted), in one run. */
	const curve = (Q, f, from, to, style, what) => {
		const pts = graph(Q, f, from, to, 0.2);
		check(longest(pts) <= 0.2001, `${what} has a step of ${longest(pts)} pt`);
		check(near(pts[0][0], Q.X(Q.x0), 1e-9) && near(pts[pts.length - 1][0], Q.X(Q.x1), 1e-9), `${what} does not span its axis`);
		check(pts.every(([, y]) => y >= Q.top - 1e-9 && y <= Q.bottom + 1e-9), `${what} leaves its frame`);
		S.path(pts, { ...style, cap: 'butt', what });
		return pts;
	};
	/** The two dots on the curve of T on the plot Q, heights scaled by k: filled at the energy peak, open at the count's. */
	const dots = (Q, T, k, i) => {
		const color = SHADE[T];
		const [fe, fn] = peaks[i];
		const e = Q.at(fe, k * b(fe, T)), c = Q.at(fn, k * b(fn, T));
		S.raw(`<circle cx="${n2(e[0])}" cy="${n2(e[1])}" r="${DOT}" fill="${color}"/>`, 3);
		S.raw(`<circle cx="${n2(c[0])}" cy="${n2(c[1])}" r="${DOT - OPEN_W / 2}" fill="${PAGE}" stroke="${color}" stroke-width="${OPEN_W}"/>`, 3);
		S.mark([e], DOT, `the energy peak at ${T} K`);
		S.mark([c], DOT, `the count's peak at ${T} K`);
		return { e, c };
	};

	// ---- the Rayleigh-Jeans law at 1500 K, dashed, to where it leaves the frame
	const fOut = Math.sqrt(Y1 / (rayleighJeans(1, 1500) / top));     // the law grows as f^2
	check(near(rayleighJeans(fOut, 1500) / top, Y1, 1e-12), 'the dashed line does not leave the frame at its top');
	const rj = graph(P, (f) => rayleighJeans(f, 1500) / top, 0, fOut, 0.2);
	// the dashes fitted to the line's length, so that it ends at the frame on a whole dash
	const len = rj.slice(1).reduce((s, p, i) => s + Math.hypot(p[0] - rj[i][0], p[1] - rj[i][1]), 0);
	const k = Math.round((len + RJ_DASH[1]) / (RJ_DASH[0] + RJ_DASH[1])), fit = len / (k * RJ_DASH[0] + (k - 1) * RJ_DASH[1]);
	check(Math.abs(fit - 1) < 0.1, `the dashes are stretched by ${fit}`);
	S.path(rj, { color: INK, width: RJ, dash: RJ_DASH.map((d) => +(d * fit).toFixed(4)), cap: 'butt', layer: 2.5, what: 'the Rayleigh-Jeans line' });
	// it follows the 1500 K curve at the lowest frequencies (within 2% below 1 THz) and leaves it far behind at the top
	check(rayleighJeans(1, 1500) / planck(1, 1500) < 1.02 && rayleighJeans(fOut, 1500) / planck(fOut, 1500) > 1.7, 'the dashed line and the curve');

	// ---- the panel's curves and dots: 700 K and 1500 K
	const drawn = {};
	for (const [i, T] of [[1, 700], [2, 1500]]) {
		drawn[T] = curve(P, (f) => b(f, T), 0, F1, { color: SHADE[T], width: CURVE, layer: 2 + i / 10 }, `the ${T} K curve`);
		dots(P, T, 1, i);
	}
	check(near(b(peaks[2][0], 1500), 1, 1e-12) && near(b(peaks[1][0], 700), (700 / 1500) ** 3, 1e-12), 'the tops');
	// the 293 K curve at its true height would be under a point tall
	check(b(peaks[0][0], 293) * DY < 1, `the 293 K curve's top is ${b(peaks[0][0], 293) * DY} pt high`);

	// ---- the inset: 293 K, heights x MAG, frequencies on the panel's scale
	const I = new Plot({ left: P.X(INSET.f0), top: P.Y(INSET.b0) - Y1 * DY * 0.28, w: INSET.f1 * DX, h: Y1 * DY * 0.28, x0: 0, x1: INSET.f1, y0: 0, y1: 0.28 * Y1 });
	check(near(I.w / (I.x1 - I.x0), DX, 1e-12) && near(I.h / (I.y1 - I.y0), DY, 1e-12), 'the inset is not on the panel\'s scales');
	check(MAG * b(peaks[0][0], 293) < I.y1 * 0.92, 'the 293 K curve leaves the inset');
	const il = await xAxis(S, I, { ticks: [0, 20, 40, 60], what: 'the inset\'s axis' });
	L.push(...il);
	S.path([[I.left, I.bottom], [I.left, I.top]], { color: DIM, width: AXIS, layer: 1, cap: 'butt', what: 'the inset\'s axis up' });
	curve(I, (f) => MAG * b(f, 293), 0, INSET.f1, { color: SHADE[293], width: CURVE, layer: 2 }, 'the 293 K curve');
	dots(I, 293, MAG, 0);
	// its numbers clear the 1500 K curve beneath
	const low = Math.max(...il.map((l) => l.box.b));
	for (const [x, y] of drawn[1500]) if (x >= I.left - 2 && x <= I.right + 6) check(y - low >= 4, `the inset's numbers are ${n2(y - low)} pt from the 1500 K curve`);
	L.push(await placed(`\\text{293 K, heights}\\times${MAG}`, I.left, I.top - 4.5, 0, 1, INK));

	// ---- the names of the curves and of the dashed line
	{
		const at = (f, T) => P.at(f, b(f, T));
		const [x15, y15] = at(112, 1500);
		L.push(await S.clear('\\text{1500 K}', x15 + LABEL_GAP, y15, 0, 0.5, [1, 0]));
		const [x7, y7] = at(62, 700);
		L.push(await S.clear('\\text{700 K}', x7, y7 - LABEL_GAP, 0, 1, [0.3, -1].map((v) => v / Math.hypot(0.3, 1))));
		L.push(await S.clear('\\text{Rayleigh–Jeans, 1500 K}', P.X(fOut) + LABEL_GAP + 1.5, P.top, 0, 0.5, [1, 0]));
	}

	S.checkAll(L);
	window[name + '-numbers'] = { peaks, fOut, mag: MAG, top293: b(peaks[0][0], 293) };
	return finish(S, L, [285, 345]);
}
