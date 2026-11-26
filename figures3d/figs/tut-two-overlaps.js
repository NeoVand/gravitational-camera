// The tutorial, section 9.1 (tutorial/one-point/spin-two.md), its fourth diagram: two squares overlap less than two
// vectors. Across, the angle theta between two waves' directions of travel, 0 to 180 degrees, ticks every 30; up, the
// overlap, 0 to 1, ticks at 0, 0.25, 0.5, 0.75 and 1. Light's cos^4(theta/2), dashed ink, "light, spin one"; gravity's
// cos^8(theta/2), solid ink, "gravity, spin two", the narrower curve. Small ink dots at 30, 60 and 90 degrees on both,
// with their values beside them: 0.87 and 0.76, 0.56 and 0.32, 0.25 and 0.063. The half heights: a dotted grey line
// at 0.5 and dotted drops from where each curve crosses it to thin grey ticks on the axis, 47.0 and 65.5 degrees. No
// orange or blue.
// Departures from the diagram's comment: the widths at half height are marked by a dotted line at half height and
// dotted drops to the axis as well as by the ticks, so that the reader sees which crossing each tick marks; their
// numbers stand just above the axis, inside the plot, since 65.5 lies too near the tick 60 for both to stand below it.
// Exact: both curves (sampled every quarter of a point along their length), the dots, the crossings at one half and
// every printed number, computed in figs/tut-spin-two-lib.js (the overlaps from the null vectors themselves, at every
// 7.5 degrees, and the half widths by bisection and in closed form) and asserted against the chapter's text. Nothing
// is schematic.
import { Sheet, ORIGIN, finish, checker, placed, near, LABEL_GAP, HAIR, TICK, n2 } from './tut-pot-lib.js';
import { Plot, xAxis, yAxis, NUM } from './tut-prob-lib.js';
import { graph, longest, CURVE } from './tut-fourier-lib.js';
import { DASH, DOT, ZERO_DASH } from './tut-bessel-lib.js';
import { INK, DIM } from '../lib.js';
import { stack } from './tut-curvature-lib.js';
import { chapter, light, gravity, rad, OVERLAPS, WIDTHS } from './tut-spin-two-lib.js';

const name = 'tut-two-overlaps';
const check = checker(name);

const PW = 252, PH = 132;                 // the plot, points
const GUIDE = 0.35;                       // the dotted half-height guides

export default async function () {
	const nums = await chapter(check);
	const S = new Sheet(name);
	const L = [];
	const P = new Plot({ left: ORIGIN - PW / 2, top: ORIGIN - PH / 2, w: PW, h: PH, x0: 0, x1: 180, y0: 0, y1: 1 });
	const f = { light: (d) => light(rad(d)), gravity: (d) => gravity(rad(d)) };

	// ---- the axes
	L.push(...(await xAxis(S, P, { ticks: [0, 30, 60, 90, 120, 150, 180], fmt: (t) => `${t}^\\circ`, what: 'the angle axis' })));
	L.push(...(await yAxis(S, P, { ticks: [0, 0.25, 0.5, 0.75, 1], fmt: (t) => (t === 0 ? null : `${t}`), what: 'the overlap axis' })));
	const under = Math.max(...L.map((l) => l.box.b));
	L.push(await placed('\\text{angle between the two waves, }\\vartheta', P.X(90), under + 4.5, 0.5, 0, INK));
	L.push(await placed('\\text{overlap}', P.left - TICK - NUM, P.top - 7, 0, 1, INK));

	// ---- the half heights: a dotted line at one half, to light's crossing; thin ticks on the axis under the crossings
	const half = { gravity: nums.widths.gravity, light: nums.widths.light };
	for (const k of ['gravity', 'light']) check(near(f[k](half[k]), 0.5, 1e-9) && half[k].toFixed(1) === WIDTHS[k], `the half width of ${k}`);
	S.path([P.at(0, 0.5), P.at(half.light, 0.5)], { color: DIM, width: GUIDE, layer: 0.5, cap: 'butt', dash: ZERO_DASH, what: 'the half height' });
	for (const k of ['gravity', 'light']) {
		const x = P.X(half[k]);
		S.path([[x, P.bottom], [x, P.bottom - 2 * TICK]], { color: DIM, width: HAIR, layer: 1, cap: 'butt', what: `the tick at ${k}'s half width` });
	}

	// ---- the curves: light dashed, gravity solid
	const pts = { light: graph(P, f.light, 0, 180), gravity: graph(P, f.gravity, 0, 180) };
	for (const k of ['light', 'gravity']) check(longest(pts[k]) <= 0.2501, `the ${k} curve is not fine`);
	// each curve stops where it would merge with the axis (it reaches zero only at 180 degrees)
	const merge = ((CURVE + 0.45) / 2 / PH);
	const end = (k) => { let x = 180; while (f[k](x) < merge) x -= 0.05; return x; };
	for (const k of ['light', 'gravity']) {
		const e = end(k);
		const line = graph(P, f[k], 0, e);
		S.path(line, { color: INK, width: CURVE, layer: 2, cap: 'butt', dash: k === 'light' ? DASH : null, what: `the ${k} curve` });
	}

	// ---- the dots and their values: light's above and right of its curve, gravity's below and left of its own
	for (const [d, g, l] of OVERLAPS) {
		for (const [k, txt] of [['light', l], ['gravity', g]]) {
			const v = f[k](d);
			check(v.toPrecision(2) === txt, `the ${k} overlap at ${d} is ${v}`);
			const [x, y] = P.at(d, v);
			S.raw(`<circle cx="${n2(x)}" cy="${n2(y)}" r="${DOT}" fill="${INK}"/>`, 3);
			S.mark([[x, y]], DOT, `the ${k} dot at ${d}`);
		}
	}
	for (const [d, g, l] of OVERLAPS) {
		const [xl, yl] = P.at(d, f.light(d)), [xg, yg] = P.at(d, f.gravity(d));
		L.push(await S.clear(l, xl + DOT + LABEL_GAP + 0.4, yl - DOT - LABEL_GAP - 0.4, 0, 1, [0.6, -0.8]));
		// at 90 degrees gravity's value stands left of its dot, just above the axis
		L.push(d === 60 ? await S.clear(g, xg, yg + DOT + LABEL_GAP + 0.4, 0.5, 0, [0, 1])
			: d === 90 ? await S.clear(g, xg - DOT - LABEL_GAP - 0.4, P.bottom - 2.8, 1, 1, [-1, 0])
				: await S.clear(g, xg - DOT - LABEL_GAP - 0.4, yg + DOT + LABEL_GAP + 0.4, 1, 0, [-0.6, 0.8]));
	}

	// ---- the half widths' numbers, just above the axis, each left of its tick
	L.push(await S.clear(`${WIDTHS.gravity}^\\circ`, P.X(half.gravity) - LABEL_GAP - 0.6, P.bottom - 2.8, 1, 1, [-1, 0], { color: DIM }));
	L.push(await S.clear(`${WIDTHS.light}^\\circ`, P.X(half.light) - LABEL_GAP - 0.6, P.bottom - 2.8, 1, 1, [-1, 0], { color: DIM }));

	// ---- the curves' names, beside their right halves: light above its curve, gravity under its own
	L.push(await S.clear('\\text{light, spin one}', P.X(122), P.Y(f.light(122)) - LABEL_GAP, 0, 1, [0.6, -0.8]));
	// gravity's under both curves, left of the drop at its half width, in two lines (its right half lies on the axis)
	{
		const lines = ['\\text{gravity,}', '\\text{spin two}'];
		const right = P.X(half.gravity) - GUIDE / 2 - LABEL_GAP - 0.5;
		const g = await stack(lines, right, P.Y(0.42), 1, INK);
		const c = S.clearance(g.box);
		check(c.d >= LABEL_GAP, `gravity's name is ${c.d.toFixed(2)} pt from ${c.what}`);
		L.push(g);
	}

	S.checkAll(L);
	window[name + '-numbers'] = { widths: nums.widths, overlaps: OVERLAPS };
	return finish(S, L, [240, 340]);
}
