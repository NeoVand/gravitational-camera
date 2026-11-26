// The tutorial, section 3.8 (tutorial/noise/bits.md), its third diagram: how the bits grow with the number of digits
// of the sensitivity. Against log10 SNR from 1 to 70, on a logarithmic axis (so that a power of the number of digits
// is a straight line), the bits per area z^2 on a logarithmic axis from 1 to 10^5.5: the near field's C from the
// paper's eq:capacity-integral (first accent, orange), and a wave camera with a fixed number of patterns, whose bits
// grow as log2 SNR, scaled to meet the near field at SNR = 10^3 (neutral grey). Two guide triangles: one of slope 3
// above the near-field curve, one of slope 1 under the wave camera's line, each with its legs' lengths in decades.
// The near-field curve is not a straight line: its local slope rises from 1.7 at SNR = 10 through 2.3 at 10^3 to 2.9 at
// 10^70, the factor per doubling of the digits from 5.3 (10^3 to 10^6) to 7.4 (10^35 to 10^70), toward 8.
// Exact: the near-field curve (eq:capacity-integral by adaptive Simpson at every sample, checked against
// Gauss-Legendre to 10^-6, asserted against the chapter's 37.9, 200.9, 754, 1.55 x 10^4 and 1.78 x 10^5; sampled every
// quarter of a point along its length), the wave camera's line (37.85 x log10 SNR / 3, asserted to have slope 1), the
// local slopes (asserted rising and below 3), and the triangles' slopes. Schematic: where the triangles sit.
import { Sheet, ORIGIN, finish, checker, placed, near } from './tut-pot-lib.js';
import { Plot, xAxis, yAxis, LABEL_GAP } from './tut-prob-lib.js';
import { graph, longest, INK, DIM, ACCENT, CURVE } from './tut-fourier-lib.js';
import { capacity, chapterNumbers } from './tut-bits-lib.js';

const name = 'tut-bits-growth';
const check = checker(name);

// ---- the mathematics: x = log10 d, where d = log10 SNR; y = log10 of the bits -------------------------------------
export const D0 = 1, D1 = 70;
const lg = Math.log10;

function mathematics() {
	const { C3 } = chapterNumbers(check);
	const wave = (d) => (C3 * d) / 3;
	check(near(wave(3), C3, 1e-12), 'the wave camera does not meet the near field at 10^3');
	// the local slope d ln C / d ln d, by central differences
	const slope = (d) => { const h = 1e-4; return (Math.log(capacity(d * (1 + h))) - Math.log(capacity(d * (1 - h)))) / (Math.log1p(h) - Math.log1p(-h)); };
	const at = [1, 3, 10, 35, 70].map((d) => slope(d));
	check(at[0].toFixed(1) === '1.7' && at[1].toFixed(1) === '2.3' && at[4].toFixed(1) === '2.9', `the local slopes ${at}`);
	for (let d = 1; d < 70; d += 0.5) check(slope(d + 0.5) > slope(d) && slope(d + 0.5) < 3, `the local slope at ${d}`);
	// the wave camera's slope is 1 exactly
	check(near(lg(wave(70)) - lg(wave(7)), 1, 1e-12), 'the wave camera\'s slope is not 1');
	return { C3, wave, slopes: at };
}

// ---- the drawing (points) -----------------------------------------------------------------------------------------
const PW = 214, PH = 168;
const Y1 = 5.5;
const L0 = -0.035;                             // the axis starts a little left of 1, so the curves do not start on it
const TRI = 0.4;                               // the triangles' stroke

export default async function () {
	const n = mathematics();
	const S = new Sheet(name);
	const L = [];
	const P = new Plot({ left: ORIGIN - PW / 2, top: ORIGIN - PH / 2, w: PW, h: PH, x0: L0, x1: lg(D1), y0: 0, y1: Y1 });
	const nf = (x) => lg(capacity(10 ** x));
	const wave = (x) => lg(n.wave(10 ** x));

	// ---- the two curves
	for (const [f, color, what] of [[nf, ACCENT, 'the near field'], [wave, DIM, 'the wave camera']]) {
		const pts = graph(P, f, 0, lg(D1));
		check(longest(pts) <= 0.2501, `${what} has a step of ${longest(pts)} pt`);
		check(pts.every(([, y]) => y >= P.top && y <= P.bottom - 3), `${what} leaves the chart`);
		S.path(pts, { color, width: CURVE, layer: 2, what });
	}

	// ---- the guide triangles: slope 3 above and to the left of the near field, slope 1 below and to the right of the
	// wave camera; each spans a factor of two in the digits (0.301 decades)
	const triangle = (xa, ya, xb, yb, corner, what) => {
		const pts = [P.at(xa, ya), P.at(...corner), P.at(xb, yb)];
		S.path([...pts], { color: INK, width: TRI, closed: true, cap: 'butt', layer: 1.5, what });
		return pts;
	};
	const w = lg(2);
	// slope 3: the hypotenuse from (x3, y3) to (x3 + w, y3 + 3w), its corner at the top left
	const x3 = lg(14), y3 = nf(x3) + 0.4;
	const t3 = triangle(x3, y3, x3 + w, y3 + 3 * w, [x3, y3 + 3 * w], 'the triangle of slope 3');
	check(nf(x3 + w) < y3 + 3 * w - 0.3, 'the slope-3 triangle meets the curve');
	// slope 1: the corner at the bottom right
	const x1 = lg(20), y1 = wave(x1) - 0.55;
	const t1 = triangle(x1, y1, x1 + w, y1 + w, [x1 + w, y1], 'the triangle of slope 1');
	check(near(t1[2][1], t1[1][1] - (P.h / Y1) * w, 1e-9), 'the slope-1 triangle\'s rise');
	check(near((t3[0][1] - t3[1][1]) / (P.h / Y1), 3 * w, 1e-9), 'the slope-3 triangle\'s rise');
	// the legs' lengths, in decades of their axes: 1 along, 3 (or 1) up
	L.push(await S.clear('1', (t3[1][0] + t3[2][0]) / 2, t3[1][1] - LABEL_GAP, 0.5, 1, [0, -1], { color: INK }));
	L.push(await S.clear('3', t3[1][0] - LABEL_GAP, (t3[0][1] + t3[1][1]) / 2, 1, 0.5, [-1, 0], { color: INK }));
	L.push(await S.clear('1', (t1[0][0] + t1[1][0]) / 2, t1[1][1] + LABEL_GAP, 0.5, 0, [0, 1], { color: INK }));
	L.push(await S.clear('1', t1[1][0] + LABEL_GAP, (t1[1][1] + t1[2][1]) / 2, 0, 0.5, [1, 0], { color: INK }));

	// ---- the axes: a tick at every decade of the bits; the digits at 1, 3, 6, 10, 35 and 70
	L.push(...(await yAxis(S, P, { ticks: [0, 1, 2, 3, 4, 5], fmt: (t) => (t === 0 ? '1' : t === 1 ? '10' : `10^{${t}}`), what: 'the bits axis' })));
	const digits = [1, 3, 6, 10, 35, 70];
	const xl = await xAxis(S, P, { ticks: digits.map(lg), fmt: (t) => String(Math.round(10 ** t)), what: 'the digits axis' });
	L.push(...xl);
	const last = xl[xl.length - 1];
	L.push(await placed('\\log_{10}\\mathrm{SNR}', last.box.r + 4, (last.box.t + last.box.b) / 2, 0, 0.5, DIM));
	L.push(await S.clear('\\text{bits per }z^2', P.left + 5, P.top - LABEL_GAP, 0, 1, [0, -1], { color: DIM }));

	// ---- the curves' names
	const xn = lg(40);
	L.push(await S.clear('\\text{near field}', P.X(xn) + 3, P.Y(nf(xn)), 0, 0, [0, 1], { color: ACCENT }));
	const xw = lg(4);
	L.push(await S.clear('\\text{wave camera}', P.X(xw), P.Y(wave(xw)) + LABEL_GAP, 0, 0, [0, 1], { color: DIM }));

	S.checkAll(L);
	window.tutBitsGrowth = { slopes: n.slopes };
	return finish(S, L, [240, 340]);
}
