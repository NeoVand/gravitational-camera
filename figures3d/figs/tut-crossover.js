// The tutorial, chapter 7.7 (tutorial/geometry/quadrupole-formula.md), its third diagram: in the plane of the orbit,
// Newton's tide and the wave's cross at 0.313 of a wavelength. Log-log axes: r / lambda from 0.02 to 10 across, and
// r |E_zz| in units of G Delta I Omega^4 / c^4 up, from 10^-0.5 to 10^6. Two thin straight asymptotes in ink at half
// weight: the near law (15/4) G Delta I / r^5, slope -4 on these axes, "Newton's tide, r^-5", and the far law
// 4 G Delta I Omega^4 / c^4 r, horizontal, "wave, 1/r"; the exact curve (G Delta I / 4 r^5) sqrt(225 + 135 (kr)^2 +
// 39 (kr)^4 + 10 (kr)^6 + (kr)^8) times r, with kr = 2 pi r / lambda, in the curvature's colour, "all-zone solution",
// joining them. A small open circle where the asymptotes cross, at r = 0.313 lambda, "0.313 lambda"; a vertical dotted
// line at r = lambda / 2 pi = 0.159 lambda, "lambda / 2 pi".
// Departures from the diagram's comment: the crossing is labelled "0.313 lambda", the chapter's figure, where the
// comment had "0.31 lambda"; the vertical axis starts half a decade below 1, so that the wave's name fits under its
// line; the exact curve is named, "all-zone solution", in its colour, as the chapter names it.
// Exact: every line, the circle and the dotted line (tut-quadrupole-lib.js, `chapter`: eq:plane-tide rebuilt from the
// all-zone solution by finite differences, the bracket's squared size, the two limits, the crossing at (kr)^4 = 15,
// 0.313 lambda and 1.97 lambda / 2 pi, lambda / 2 pi = 0.159 lambda, the units of the curve), and against the marks here.
// Every curve is sampled so that no two neighbouring points are more than a quarter of a point apart. Nothing is
// schematic.
import { Sheet, ORIGIN, finish, checker, placed, near, n2, HAIR, TICK, AXIS as AXIS_STROKE } from './tut-pot-lib.js';
import { Plot, xAxis, yAxis, LABEL_GAP } from './tut-prob-lib.js';
import { graph, longest, CURVE } from './tut-fourier-lib.js';
import { INK, DIM, PAGE } from '../lib.js';
import { chapter, palette, CURV, MATTER, exact, nearLaw, farLaw, X_CROSS } from './tut-quadrupole-lib.js';

const name = 'tut-crossover';
const check = checker(name);

const X = [Math.log10(0.02), 1], Y = [-0.5, 6];   // log10 (r / lambda), log10 of r |E_zz| in its units
const DX = 82, DY = 24;                    // points per decade
const ASYMPTOTE = CURVE / 2;               // the two laws: ink at half the curve's weight
const AIR = 1.4;                           // a line stops where it would come nearer than this to an axis
const RING = 1.9, RING_W = 0.55;           // the open circle at the crossing
const DOTTED_TO = 4.4;                     // the dotted line's top, log10 of the size
const MINOR = 1.4;                         // a minor tick, half a major one's length
const lg = Math.log10;
const TWO_PI = 2 * Math.PI;

export default async function () {
	const n = chapter(check);
	await palette(check);
	const S = new Sheet(name);
	const L = [];
	const PW = (X[1] - X[0]) * DX, PH = (Y[1] - Y[0]) * DY;
	const P = new Plot({ left: ORIGIN - PW / 2, top: ORIGIN - PH / 2, w: PW, h: PH, x0: X[0], x1: X[1], y0: Y[0], y1: Y[1] });
	// on the page: log10 of r / lambda across; k r = 2 pi r / lambda
	const curve = (f) => (t) => lg(f(TWO_PI * 10 ** t));

	// ---- where a line stands clear of the axes
	const lowest = Y[0] + (AIR + (CURVE + AXIS_STROKE) / 2) / DY, highest = Y[1] - AIR / DY;
	const span = (f) => {
		let a = X[0], b = X[1];
		while (f(a) > highest) a += 1e-5;
		while (f(b) < lowest) b -= 1e-5;
		return [a, b];
	};

	// ---- the two laws in ink at half weight, under the exact curve in the curvature's colour
	const lines = [
		{ key: 'near law', f: curve(nearLaw), color: INK, width: ASYMPTOTE, layer: 1 },
		{ key: 'far law', f: curve(farLaw), color: INK, width: ASYMPTOTE, layer: 1 },
		{ key: 'exact curve', f: curve(exact), color: CURV, width: CURVE, layer: 2 }
	];
	const drawn = {};
	for (const { key, f, color, width, layer } of lines) {
		const [a, b] = span(f);
		const pts = graph(P, f, a, b);
		check(longest(pts) <= 0.2501, `the ${key} is coarse`);
		check(pts.every(([px, py]) => py >= P.top + AIR - 1e-9 && py <= P.bottom - AIR && px >= P.left - 1e-9 && px <= P.right + 1e-9), `the ${key} leaves the chart`);
		S.path(pts, { color, width, layer, cap: 'butt', what: `the ${key}` });
		drawn[key] = { a, b, pts };
	}
	// the near law is a straight line of slope -4 on these axes, the far law horizontal at 4, the curve above both
	{
		const f = curve(nearLaw);
		check(near((f(0) - f(-1)), -4, 1e-12) && near(curve(farLaw)(-1), lg(4), 1e-15), 'the laws\' slopes');
		for (let t = X[0]; t <= X[1]; t += 0.01) check(curve(exact)(t) >= Math.max(curve(nearLaw)(t), curve(farLaw)(t)) - 1e-12, `the curve dips below a law at ${t}`);
		// it joins them: within 1 per cent of the near law at the left edge and of the far law at the right
		check(Math.abs(curve(exact)(X[0]) - curve(nearLaw)(X[0])) < lg(1.01) && Math.abs(curve(exact)(X[1]) - curve(farLaw)(X[1])) < lg(1.01), 'the curve does not join the laws at the edges');
		check(drawn['exact curve'].a === X[0] && drawn['exact curve'].b === X[1] && drawn['far law'].a === X[0] && drawn['near law'].a === X[0], 'a line does not span the chart');
	}

	// ---- the crossing, an open circle at 0.313 lambda
	const tc = lg(n.rCross);
	check(near(n.rCross, X_CROSS / TWO_PI, 1e-15) && n.rCross.toFixed(3) === '0.313', `the crossing ${n.rCross}`);
	check(near(curve(nearLaw)(tc), curve(farLaw)(tc), 1e-12), 'the laws do not cross at the circle');
	const [cx, cy] = P.at(tc, lg(4));
	S.raw(`<circle cx="${n2(cx)}" cy="${n2(cy)}" r="${RING}" fill="${PAGE}" stroke="${INK}" stroke-width="${RING_W}"/>`, 3);
	S.mark([[cx, cy]], RING + RING_W / 2, 'the crossing');
	L.push(await S.clear('0.313\\lambda', cx, cy + ASYMPTOTE / 2 + LABEL_GAP + 0.4, 0, 0, [1, 0]));

	// ---- lambda / 2 pi, a vertical dotted line
	const tr = lg(n.reduced);
	check(n.reduced.toFixed(3) === '0.159' && near(TWO_PI * 10 ** tr, 1, 1e-14), `lambda / 2 pi = ${n.reduced}`);
	const px = P.X(tr);
	S.dots([px, P.bottom - AXIS_STROKE / 2], [px, P.Y(DOTTED_TO)], { color: DIM, clear0: 1.2, clear1: 0, what: 'lambda / 2 pi' });
	L.push(await placed('\\lambda/2\\pi', px, P.Y(DOTTED_TO) - LABEL_GAP - 0.6, 0.5, 1, DIM));
	check(near(n.rCross / n.reduced, X_CROSS, 1e-12) && X_CROSS.toFixed(2) === '1.97', 'the crossing is not 1.97 lambda / 2 pi');

	// ---- the axes: r / lambda below, the size at the left; minor ticks every unit of each decade
	const xl = await xAxis(S, P, { ticks: [-1, 0, 1], fmt: (t) => (t === -1 ? '0.1' : t === 0 ? '1' : '10'), what: 'the r axis' });
	L.push(...xl);
	for (let dec = -2; dec <= 0; dec++) for (let j = 2; j <= 9; j++) {
		const t = dec + lg(j);
		if (t < X[0] - 1e-12 || t > X[1]) continue;
		S.path([[P.X(t), P.bottom], [P.X(t), P.bottom + MINOR]], { color: DIM, width: HAIR, layer: 1, cap: 'butt', what: `the r axis's minor tick at ${t}` });
	}
	const last = xl[xl.length - 1];
	L.push(await S.clear('r/\\lambda', last.box.r + 6, (last.box.t + last.box.b) / 2, 0, 0.5, [1, 0], { color: DIM }));
	const pow = (t) => (t === 0 ? '1' : `10^{${t}}`);
	L.push(...(await yAxis(S, P, { ticks: [0, 1, 2, 3, 4, 5, 6], fmt: (t) => (t % 2 === 0 ? pow(t) : null), from: Y[0], to: Y[1], what: 'the size axis' })));
	{
		const highest = Math.min(...L.map((l) => l.box.t), P.top);
		L.push(await placed(`r\\,|{\\color{${CURV}}\\mathcal E_{zz}}|\\ \\ (\\text{units of }G\\,{\\color{${MATTER}}\\Delta I}\\,\\Omega^4/c^4)`, P.left - 16, highest - 4, 0, 1, DIM));
	}

	// ---- the names, beside their lines
	{
		// Newton's tide: at the top left, beside the curve where it is the near law
		L.push(await S.clear('\\text{Newton’s tide, }r^{-5}', P.left + AXIS_STROKE / 2 + LABEL_GAP + 3, P.top + 1, 0, 0, [1, 0]));
	}
	L.push(await S.clear('\\text{wave, }1/r', P.X(0.95), P.Y(lg(4)) + ASYMPTOTE / 2 + LABEL_GAP + 0.4, 1, 0, [0, 1]));
	{
		// the all-zone solution, above-right of its curve where it leaves the near law
		const t0 = -0.3;
		L.push(await S.clear('\\text{all-zone solution}', P.X(t0) + 3, P.Y(curve(exact)(t0)) - 3, 0, 1, [0.5, -0.87], { color: CURV }));
	}

	S.checkAll(L);
	window[name + '-numbers'] = { ...n, spans: Object.fromEntries(Object.entries(drawn).map(([k, v]) => [k, [v.a, v.b]])) };
	return finish(S, L, [230, 300]);
}
