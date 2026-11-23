// The tutorial, chapter 5.2 (tutorial/waves/retarded-waves.md), its second diagram: where the near part and the wave
// part of the slope cross. Log-log axes: kr from 0.01 to 100 across, with a second scale above in units of the
// wavelength, r/lambda = kr/2pi; and the size of each part relative to k^2 up, from 10^-2 to 10^4. The near part
// 1/(kr)^2, in the second accent as the paper's fig:regimes colours the near field, and the wave part 1/kr, in the
// first accent as it colours the wave zone, both solid, crossing at kr = 1, marked by a dot and by a thin upright line
// above it to the top scale, named "r = lambda/2pi". The tide's two terms that fall faster than 1/r, taken together,
// |2/(kr)^3 - 2i/(kr)^2| relative to k^3, dotted in the second accent; its wave term, 1/kr relative to k^3, is the
// same line as the slope's wave part. The dotted curve crosses it at kr = sqrt(2 + 2 sqrt 2) = 2.2, marked by a short
// tick across the crossing. The near zone, kr < 1, lightly shaded in the pale second accent, the shading fading out
// across the crossing (from kr = 10^-0.5 to 10^0.5, by a raised cosine), and named; the wave zone named.
// Departure from the diagram's comment: the comment drew the tide's near term 2/(kr)^3 alone, crossing the wave term
// at sqrt 2. The chapter's footnote now says that the middle term 2/(kr)^2 is the largest of the three for
// 1 < kr < 2, so that sqrt 2 is only where the outer two terms cross, and that taken as groups the terms cross at 2.2;
// the diagram draws the groups.
// Exact: every line, the crossings and the top scale (asserted in tut-ret-lib.js, `chapter`, and against the marks
// here). Every curve is sampled so that no two neighbouring points are more than a quarter of a point apart. Chosen
// for the drawing: the width of the fade. Nothing is schematic.
import { Sheet, ORIGIN, finish, checker, placed, near, n2, HAIR, TICK, AXIS as AXIS_STROKE } from './tut-pot-lib.js';
import { Plot, xAxis, yAxis, pathOf, LABEL_GAP } from './tut-prob-lib.js';
import { graph, longest, CURVE } from './tut-fourier-lib.js';
import { DIM, ACCENT, ACCENT2, DOT as POINT, stops } from './tut-bessel-lib.js';
import { TINT_ACCENT2 } from './tut-gauss-lib.js';
import { chapter, nearPart, wavePart, tideNear, TIDE_CROSS } from './tut-ret-lib.js';

const name = 'tut-ret-crossing';
const check = checker(name);

const X = [-2, 2], Y = [-2, 4.3];          // log10 kr, log10 of the size (units of k^2, the tide's of k^3)
const DX = 54, DY = 26;                    // points per decade
const FADE = 0.5;                          // the shading fades out from log10 kr = -FADE to +FADE
const SHADE = 0.7;                         // the shading's opacity inside the near zone
const AIR = 1.4;                           // a curve stops where it would come nearer than this to an axis
const MARK = 3.0;                          // half the length of the tick across the tide's crossing
const TIDE_DOT = [0.01, 1.5];              // the dotted curve: round dots of the curve's width every 1.5 pt
const lg = Math.log10;

export default async function () {
	const n = chapter(check);
	const S = new Sheet(name);
	const L = [];
	let defs = '';
	const PW = (X[1] - X[0]) * DX, PH = (Y[1] - Y[0]) * DY;
	const P = new Plot({ left: ORIGIN - PW / 2, top: ORIGIN - PH / 2, w: PW, h: PH, x0: X[0], x1: X[1], y0: Y[0], y1: Y[1] });
	const curve = (f) => (x) => lg(f(10 ** x));

	// ---- the near zone, shaded, fading out across the crossing
	{
		const op = (t) => { const x = X[0] + t * (FADE - X[0]); return SHADE * (x <= -FADE ? 1 : 0.5 * (1 + Math.cos((Math.PI * (x + FADE)) / (2 * FADE)))); };
		const g = stops(op, () => TINT_ACCENT2);
		check(g.worst <= 0.0015, `the fade's stops err by ${g.worst}`);
		defs += `<linearGradient id="${name}-fade" gradientUnits="userSpaceOnUse" x1="${n2(P.left)}" y1="0" x2="${n2(P.X(FADE))}" y2="0">${g.svg}</linearGradient>`;
		S.raw(`<path d="${pathOf([[P.left, P.top], [P.X(FADE), P.top], [P.X(FADE), P.bottom], [P.left, P.bottom]])}" fill="url(#${name}-fade)"/>`, 0);
		check(near(op((0 - X[0]) / (FADE - X[0])), SHADE / 2, 1e-12), 'the fade is not half-way at kr = 1');
	}

	// ---- where a curve stands clear of the axes: AIR from the bottom axis and from the top scale
	const lowest = Y[0] + (AIR + (CURVE + AXIS_STROKE) / 2) / DY, highest = Y[1] - (AIR + (CURVE + AXIS_STROKE) / 2) / DY;
	const span = (f) => {
		let a = X[0], b = X[1];
		while (f(a) > highest) a += 1e-5;
		while (f(b) < lowest) b -= 1e-5;
		return [a, b];
	};

	// ---- the two parts of the slope, solid; the tide's near terms, dotted
	const lines = [
		{ key: 'near', f: curve(nearPart), color: ACCENT2, dash: null },
		{ key: 'wave', f: curve(wavePart), color: ACCENT, dash: null },
		{ key: 'tide', f: curve(tideNear), color: ACCENT2, dash: TIDE_DOT }
	];
	const drawn = {};
	for (const { key, f, color, dash } of lines) {
		const [a, b] = span(f);
		const pts = graph(P, f, a, b);
		check(longest(pts) <= 0.2501, `the ${key} line is coarse`);
		check(pts.every(([px, py]) => py >= P.top + AIR && py <= P.bottom - AIR && px >= P.left - 1e-9 && px <= P.right + 1e-9), `the ${key} line leaves the chart`);
		S.path(pts, { color, width: CURVE, layer: 2, dash, cap: dash ? 'round' : 'butt', what: `the ${key} line` });
		drawn[key] = { a, b };
	}
	// the near part enters at the left edge, the wave part spans the chart; the near part is 10^4 at kr = 0.01
	check(near(curve(nearPart)(X[0]), 4, 1e-12) && near(curve(wavePart)(X[0]), 2, 1e-12) && drawn.near.a === X[0], 'the lines at kr = 0.01');

	// ---- the crossing at kr = 1: a dot, and a thin line from it up to the top scale
	const [cx, cy] = P.at(0, 0);
	check(near(curve(nearPart)(0), 0, 1e-15) && near(curve(wavePart)(0), 0, 1e-15), 'the parts do not cross at kr = 1');
	S.raw(`<circle cx="${n2(cx)}" cy="${n2(cy)}" r="${POINT}" fill="${DIM}"/>`, 3);
	S.mark([[cx, cy]], POINT, 'the crossing');
	S.path([[cx, P.top], [cx, cy - POINT - 0.8]], { color: DIM, width: HAIR, layer: 1, cap: 'butt', what: 'the edge' });
	L.push(await S.clear('r = \\lambda/2\\pi', cx + LABEL_GAP + 0.4, P.Y(3.55), 0, 0.5, [1, 0], { color: DIM }));

	// ---- the tide's crossing at kr = 2.2: a short tick across it, its value above
	const xt = lg(TIDE_CROSS);
	check(near(curve(tideNear)(xt), curve(wavePart)(xt), 1e-12), 'the tide\'s crossing is off its lines');
	const [tx, ty] = P.at(xt, curve(wavePart)(xt));
	S.path([[tx, ty - MARK], [tx, ty + MARK]], { color: DIM, width: HAIR, layer: 3, cap: 'butt', what: 'the tick at 2.2' });
	L.push(await S.clear('kr = 2.2', tx - 1.5, ty - MARK - LABEL_GAP - 0.3, 0, 1, [0.6, -0.8], { color: DIM }));

	// ---- the axes: kr below, r/lambda above (at kr = 2 pi r/lambda), the size at the left
	const pow = (t) => (t === 0 ? '1' : t === 1 ? '10' : `10^{${t}}`);
	const xl = await xAxis(S, P, { ticks: [-2, -1, 0, 1, 2], fmt: pow, what: 'the kr axis' });
	L.push(...xl);
	const last = xl[xl.length - 1];
	L.push(await S.clear('kr', last.box.r + 5, (last.box.t + last.box.b) / 2, 0, 0.5, [1, 0], { color: DIM }));
	{
		// the top scale: an axis along the chart's top, ticks upward at r/lambda = 10^m
		S.path([[P.left, P.top], [P.right, P.top]], { color: DIM, width: AXIS_STROKE, layer: 1, cap: 'butt', what: 'the r/lambda axis' });
		const top = [];
		for (const m of [-2, -1, 0, 1]) {
			const x = lg(2 * Math.PI) + m;
			check(x > X[0] && x < X[1], `r/lambda = 10^${m} is off the chart`);
			check(near(10 ** x / (2 * Math.PI), 10 ** m, 1e-12 * 10 ** m), 'the top scale is not kr/2pi');
			const px = P.X(x);
			S.path([[px, P.top], [px, P.top - TICK]], { color: DIM, width: HAIR, layer: 1, cap: 'butt', what: `the r/lambda tick at ${m}` });
			top.push(await placed(pow(m), px, P.top - TICK - 2.4, 0.5, 1, DIM));
		}
		L.push(...top);
		const end = top[top.length - 1];
		L.push(await S.clear('r/\\lambda', end.box.r + 5, (end.box.t + end.box.b) / 2, 0, 0.5, [1, 0], { color: DIM }));
	}
	L.push(...(await yAxis(S, P, { ticks: [-2, -1, 0, 1, 2, 3, 4], fmt: (t) => (t % 2 === 0 && t > -2 ? pow(t) : null), to: Y[1], what: 'the size axis' })));

	// ---- the names: the zones, the lines
	L.push(await S.clear('\\text{near zone}', P.X(-1.85), P.Y(-1.45), 0, 0.5, [1, 0], { color: ACCENT2 }));
	L.push(await S.clear('\\text{wave zone}', P.X(1.95), P.Y(3.55), 1, 0.5, [-1, 0], { color: ACCENT }));
	L.push(await S.clear('\\text{near part, } 1/r^2', P.X(0.48), P.Y(-1.2), 1, 0, [-0.45, 0.89], { color: ACCENT2 }));
	L.push(await S.clear('\\text{wave part, } 1/r', P.X(1.95), P.Y(-1.4), 1, 1, [0, -1], { color: ACCENT }));
	{
		// the tide's name, to the right of its dotted curve
		const yName = 2.3, f = curve(tideNear);
		let x = X[0];
		while (f(x) > yName) x += 1e-5;
		L.push(await S.clear('\\text{tide}', P.X(x) + LABEL_GAP + 0.4, P.Y(yName), 0, 0.5, [1, 0], { color: ACCENT2 }));
	}
	{
		// the axis's name, over the top scale's numbers, with the tide's unit
		const highest = Math.min(...L.map((l) => l.box.t));
		L.push(await placed('\\text{size}/k^2\\ \\ (\\text{tide}/k^3)', P.left - 18, highest - 3, 0, 1, DIM));
	}

	S.checkAll(L);
	window[name + '-numbers'] = { ...n, spans: drawn };
	return finish(S, L, [240, 340], defs);
}
