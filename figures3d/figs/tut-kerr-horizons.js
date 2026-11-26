// The tutorial, section 11.2 (tutorial/black-holes/spin.md), its first diagram: the horizon, the ergosphere and the
// horizon's rate against the spin. Two panels side by side, sharing their tops and bottoms, across chi = ac^2/GM from 0
// to 1. Left, in GM/c^2 from 0 to 2.2: the outer horizon r_+ = 1 + sqrt(1 - chi^2), a solid ink curve falling from 2 to
// 1, and the equatorial edge of the ergosphere, 2, a dashed line, with the band between them in the page's faint tint
// and the words "ergosphere, equator" over the line. Right, in c^3/GM: Omega_H = chi / (r_+^2 + chi^2), rising from 0
// to 0.5. On both curves the paper's five spins, 0.7, 0.9, 0.99, 0.998 and 1, each a dot with its value.
// Departures from the diagram's comment: the five spins are dots on the curves rather than ticks, since 0.99, 0.998 and
// 1 lie within 1.5 pt of one another across the page and only the curves keep them apart; their values stand beside
// the dots, the last three on alternate sides; the words "ergosphere, equator" stand over the dashed line, the band
// being too thin to hold them where the curve is high; the two panels stay side by side on a phone, the figure being
// one drawing, about 360 points wide.
// Exact: both curves and the dashed line, the dots (asserted against the chapter's table, which tut-kerr-lib.js also
// derives from Kerr's metric), the band. Schematic: nothing.
import { Sheet, ORIGIN, finish, checker, placed, LABEL_GAP, n2 } from './tut-pot-lib.js';
import { Plot, xAxis, yAxis } from './tut-prob-lib.js';
import { graph, longest } from './tut-fourier-lib.js';
import { INK, DIM } from '../lib.js';
import { chapter, palette, near, horizon, omegaH, SPINS } from './tut-kerr-lib.js';

const name = 'tut-kerr-horizons';
const check = checker(name);

// ---- the drawing (points) ----------------------------------------------------------------------------------------
const H = 128;                                   // both panels' height
const LEFT = { w: 150, y1: 2.2 };                // up r in GM/c^2
const RIGHT = { w: 136, y1: 0.55 };              // up Omega_H in c^3/GM
const BETWEEN = 46;                              // from the left panel's right edge to the right panel's axis
const CURVE = 0.7, DASH = [3, 2];
const DOT = 1.25;
const TINT = '#eeebe5';                          // the band (drawing.ts, THEME: a neutral tint of the page)
const NAME = 7;                                  // the axes' names over the panels
const caption = 'Look first at the gap between the two curves on the left: it is the ergosphere on the equator, empty for a hole that does not spin and widest at the greatest spin, where the horizon has shrunk to half its size. On the right, the rate at which the horizon turns. Every curve is exact for Kerr\'s metric.';

export default async function () {
	const { state } = await chapter(check);
	await palette(check);
	state(name, 'kerr-horizons', caption);

	const S = new Sheet(name);
	const L = [];
	const total = LEFT.w + BETWEEN + RIGHT.w;
	const top = ORIGIN - H / 2;
	const A = new Plot({ left: ORIGIN - total / 2, top, w: LEFT.w, h: H, x0: 0, x1: 1, y0: 0, y1: LEFT.y1 });
	const B = new Plot({ left: A.right + BETWEEN, top, w: RIGHT.w, h: H, x0: 0, x1: 1, y0: 0, y1: RIGHT.y1 });
	check(near(A.top, B.top, 0) && near(A.bottom, B.bottom, 0), 'the panels do not share their tops and bottoms');

	const curve = (Q, f, style, what) => {
		const pts = graph(Q, f, 0, 1, 0.2);
		check(longest(pts) <= 0.2001, `${what} has a step of ${longest(pts)} pt`);
		check(pts.every(([x, y]) => x >= Q.left - 1e-9 && x <= Q.right + 1e-9 && y >= Q.top && y <= Q.bottom + 1e-9), `${what} leaves its panel`);
		S.path(pts, { ...style, what });
		return pts;
	};
	const dot = (q, what) => { S.raw(`<circle cx="${n2(q[0])}" cy="${n2(q[1])}" r="${DOT}" fill="${INK}"/>`, 3); S.mark([q], DOT, what); };
	const value = (c) => String(c);
	/** The axes of a panel, with the name across under it. */
	const axes = async (Q, yTicks, yName, what) => {
		const xl = await xAxis(S, Q, { ticks: [0, 0.25, 0.5, 0.75, 1], fmt: (t) => (t === 0.25 || t === 0.75 ? null : String(t)), what: `${what}'s axis across` });
		L.push(...xl);
		L.push(await placed('\\chi = ac^2/GM', Q.X(0.5), Math.max(...xl.map((l) => l.box.b)) + 4, 0.5, 0, DIM));
		const yl = await yAxis(S, Q, { ticks: yTicks, fmt: (t) => (t === 0 ? null : String(t)), what: `${what}'s axis up` });
		L.push(...yl);
		L.push(await placed(yName, Math.min(...yl.map((l) => l.box.l)), top - NAME, 0, 1, DIM));
	};

	// ---- the left panel: the horizon and the ergosphere's edge on the equator
	{
		await axes(A, [0, 0.5, 1, 1.5, 2], 'r\\ \\ (GM/c^2)', 'the left panel');
		const rp = curve(A, horizon, { color: INK, width: CURVE, layer: 2.2 }, 'the horizon');
		check(near(horizon(0), 2, 0) && near(horizon(1), 1, 0), 'r_+ does not fall from 2 to 1');
		// the band: under the dashed line, over the curve
		const band = [...rp, A.at(1, 2), A.at(0, 2)];
		S.raw(`<path d="M${band.map((p) => p.map(n2).join(',')).join('L')}Z" fill="${TINT}"/>`, 1.2);
		// the dashes' gaps stretched a little, so that the line begins and ends on a dash
		const n = Math.round((A.w - DASH[0]) / (DASH[0] + DASH[1])), gap = (A.w - DASH[0] * (n + 1)) / n;
		check(Math.abs(gap - DASH[1]) < 0.2 && near(DASH[0] * (n + 1) + gap * n, A.w, 1e-9), 'the dashes do not fit the line');
		S.path([A.at(0, 2), A.at(1, 2)], { color: INK, width: CURVE, dash: [DASH[0], +gap.toFixed(4)], cap: 'butt', layer: 2, what: 'the ergosphere\'s edge' });
		check(near(A.Y(2), A.Y(horizon(0)), 1e-12), 'the band does not close at chi = 0');
		// the ergosphere's name, over the dashed line at the right
		L.push(await S.clear('\\text{ergosphere, equator}', A.X(1), A.Y(2) - LABEL_GAP - 0.4, 1, 1, [0, -1]));
		L.push(await S.clear('r_+', A.X(0.3), A.Y(horizon(0.3)) + LABEL_GAP + 1.5, 0.5, 0, [0, 1]));
		// the five spins
		for (const c of SPINS) {
			const q = A.at(c, horizon(c));
			dot(q, `the dot at ${c}`);
		}
		const lab = async (c, ax, ay, dir, dx = 0, dy = 0) => {
			const q = A.at(c, horizon(c));
			return S.clear(value(c), q[0] + dx, q[1] + dy, ax, ay, dir);
		};
		const g = DOT + LABEL_GAP;
		L.push(await lab(0.7, 1, 0, [-0.6, 0.8], -g * 0.6, g * 0.8));
		L.push(await lab(0.9, 1, 0, [-0.6, 0.8], -g * 0.6, g * 0.8));
		L.push(await lab(0.99, 1, 0.5, [-1, 0], -g));
		L.push(await lab(0.998, 0, 0.5, [1, 0], g));
		L.push(await lab(1, 0.5, 0, [0, 1], 0, g));
	}

	// ---- the right panel: the horizon's rate
	{
		await axes(B, [0, 0.1, 0.2, 0.3, 0.4, 0.5], '\\Omega_H\\ \\ (c^3/GM)', 'the right panel');
		curve(B, omegaH, { color: INK, width: CURVE, layer: 2.2 }, 'the rate');
		check(near(omegaH(0), 0, 0) && near(omegaH(1), 0.5, 0), 'Omega_H does not rise from 0 to 0.5');
		for (const c of SPINS) dot(B.at(c, omegaH(c)), `the rate's dot at ${c}`);
		const lab = async (c, ax, ay, dir, dx = 0, dy = 0) => {
			const q = B.at(c, omegaH(c));
			return S.clear(value(c), q[0] + dx, q[1] + dy, ax, ay, dir);
		};
		const g = DOT + LABEL_GAP;
		L.push(await lab(0.7, 1, 1, [-0.6, -0.8], -g * 0.6, -g * 0.8));
		L.push(await lab(0.9, 1, 1, [-0.6, -0.8], -g * 0.6, -g * 0.8));
		L.push(await lab(0.99, 1, 0.5, [-1, 0], -g));
		L.push(await lab(0.998, 0, 0.5, [1, 0], g));
		L.push(await lab(1, 0.5, 1, [0, -1], 0, -g));
	}

	S.checkAll(L);
	window[name + '-numbers'] = { horizon: SPINS.map(horizon), rate: SPINS.map(omegaH) };
	return finish(S, L, [330, 390]);
}
