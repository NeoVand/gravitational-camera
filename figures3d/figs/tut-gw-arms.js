// The tutorial, chapter 7.6 (tutorial/geometry/gravitational-waves.md), its second diagram: LIGO's two arms in a plus
// wave, seen from above. An L of two arms of length L from a corner mass, along e_1 (right) and e_2 (up): thin ink lines
// ending in small filled squares, the end mirrors, in the observer's colour. Each undisturbed end is a dashed square;
// each disturbed end is moved by delta xi = (1/2) h xi (exaggerated): the e_1 arm longer by (1/2) h+ L (an orange
// bracket, a stretch), the e_2 arm shorter by the same (a blue bracket, a squeeze). In the empty corner of the L the two
// brackets set end to end under an ink bracket, "difference h+ L, so the strain is h+". A pale copy of the two ends,
// "half a cycle later", with the signs reversed. The direction of travel, out of the page, at the top right, "wave
// along z".
// Departures from the diagram's comment: the bracket that sums the two stands in the empty corner of the L, inside the
// figure's right edge rather than beyond it, so that the drawing stays about 220 points wide and readable on a phone;
// it repeats the orange and the blue bracket end to end under the ink one, so that the sum can be read off. The arms'
// names L stand beside their middles, and the e_1 and e_2 at their far ends. The labels of the brackets are in ink,
// with h+ in the field's colour (the chapter's), and the brackets carry the orange and the blue.
// Exact: every end, the image of its place under delta xi_i = (1/2) h_ij xi_j (tut-gw-lib.js) for the drawn strain
// h+ = 2 delta and, half a cycle later, -h+; the brackets, (1/2) h+ L long, and their sum h+ L, measured on the page;
// the exaggeration, the drawn strain over LIGO's 10^-21, asserted to round to 10^20 (1.6 x 10^20). Schematic: the
// mirrors' size; the arms' length on the page.
import { Sheet, ORIGIN, finish, checker, placed, near, LABEL_GAP, HAIR } from './tut-pot-lib.js';
import { INK, DIM, PAGE } from '../lib.js';
import { chapter, palette, stack, OBS, FIELD, ACCENT, ACCENT2, move, odot, ODOT, LIGO_H } from './tut-gw-lib.js';

const name = 'tut-gw-arms';
const check = checker(name);

const ARM = 140;                           // an arm's length on the page, points (schematic)
const DELTA = 0.08;                        // each arm's drawn change over its length: (1/2) h+, exaggerated
const MIRROR = 5.5;                          // a mirror's side
const CORNER = 6;                          // the corner mass's side
const LINE = 0.6;                          // the arms
const DASH = [1.3, 0.9];                   // the undisturbed ends' outline
const PALE = 0.4;                          // the pale copy's opacity
const BR = { width: 0.75, hook: 2.6, off: 4.2 };   // the brackets: stroke, hooks, and their air from a mirror's edge
const SUM_AT = [0.5, 0.42];                // the summing bracket's left end, in units of the arm, from the corner (right, up)

export default async function () {
	chapter(check);
	await palette(check);
	const S = new Sheet(name);
	const L = [];
	const hp = 2 * DELTA;
	const factor = hp / LIGO_H;
	check(Math.round(Math.log10(factor)) === 20 && factor.toExponential(1) === '1.6e+20', `the exaggeration ${factor}`);

	const O = [ORIGIN - ARM / 2, ORIGIN + ARM / 2];          // the corner, figure points (y down)
	const at = ([x, y]) => [O[0] + x, O[1] - y];               // the plane (e_1 right, e_2 up) to figure points
	// the ends, now and half a cycle later: xi + (1/2) h xi
	const end = (xi, s) => { const d = move(s * hp, 0, xi); return [xi[0] + d[0], xi[1] + d[1]]; };
	const ends = {
		e1: { rest: [ARM, 0], now: end([ARM, 0], 1), later: end([ARM, 0], -1) },
		e2: { rest: [0, ARM], now: end([0, ARM], 1), later: end([0, ARM], -1) }
	};
	check(near(ends.e1.now[0] - ARM, DELTA * ARM, 1e-12) && near(ends.e2.now[1] - ARM, -DELTA * ARM, 1e-12), 'the arms do not change by +-(1/2) h+ L');
	check(near(ends.e1.later[0] - ARM, -DELTA * ARM, 1e-12) && near(ends.e2.later[1] - ARM, DELTA * ARM, 1e-12), 'half a cycle later the signs are not reversed');
	check(ends.e1.now[1] === 0 && ends.e2.now[0] === 0, 'an end moves across its arm');

	// ---- the arms, to the ends now
	S.path([at([0, 0]), at(ends.e1.now)], { color: INK, width: LINE, cap: 'butt', layer: 0, what: 'the e_1 arm' });
	S.path([at([0, 0]), at(ends.e2.now)], { color: INK, width: LINE, cap: 'butt', layer: 0, what: 'the e_2 arm' });
	const square = (q, side, { fill = 'none', opacity = 1, stroke = null, dash = null, layer = 2, what }) => {
		const h = side / 2, [x, y] = q;
		const d = `M${(x - h).toFixed(2)},${(y - h).toFixed(2)}h${side}v${side}h${-side}Z`;
		let svg = '';
		if (fill !== 'none') svg += `<path d="${d}" fill="${PAGE}"/><path d="${d}" fill="${fill}"${opacity < 1 ? ` fill-opacity="${opacity}"` : ''}/>`;
		else svg += `<path d="${d}" fill="${PAGE}"/>`;
		if (stroke) svg += `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="0.5"${dash ? ` stroke-dasharray="${dash.join(' ')}"` : ''}/>`;
		S.raw(svg, layer);
		S.boxes.push({ box: { l: x - h, r: x + h, t: y - h, b: y + h }, what });
	};
	square(at([0, 0]), CORNER, { fill: OBS, what: 'the corner mass' });
	for (const k of ['e1', 'e2']) {
		square(at(ends[k].rest), MIRROR, { stroke: DIM, dash: DASH, layer: 1, what: `the ${k} end undisturbed` });
		square(at(ends[k].later), MIRROR, { fill: OBS, opacity: PALE, layer: 1, what: `the ${k} end half a cycle later` });
		square(at(ends[k].now), MIRROR, { fill: OBS, layer: 2, what: `the ${k} end` });
	}
	// the three places of an end do not overlap
	for (const k of ['e1', 'e2']) {
		const xs = [ends[k].later, ends[k].rest, ends[k].now].map((q) => q[0] + q[1]);
		check(Math.abs(xs[1] - xs[0]) > MIRROR + 1.5 && Math.abs(xs[2] - xs[1]) > MIRROR + 1.5, `the ${k} ends overlap`);
	}

	// ---- a bracket between two figure points, its hooks toward the side n (a unit vector, figure coordinates)
	const bracket = (A, B, n, color, what) => {
		const k = BR.hook;
		S.path([[A[0] + n[0] * k, A[1] + n[1] * k], A, B, [B[0] + n[0] * k, B[1] + n[1] * k]], { color, width: BR.width, cap: 'butt', layer: 3, what });
		return Math.hypot(B[0] - A[0], B[1] - A[1]);
	};
	const h = `{\\color{${FIELD}}h_+}`;
	// the e_1 arm: below it, from the undisturbed end to the end now, hooks up
	{
		const y = O[1] + MIRROR / 2 + BR.off;
		const A = [at(ends.e1.rest)[0], y], B = [at(ends.e1.now)[0], y];
		const len = bracket(A, B, [0, -1], ACCENT, 'the e_1 bracket');
		check(near(len, (hp / 2) * ARM, 1e-9), 'the e_1 bracket is not (1/2) h+ L');
		L.push(await placed(`+\\tfrac12${h}L`, (A[0] + B[0]) / 2, y + LABEL_GAP + 0.6, 0.5, 0, INK));
	}
	// the e_2 arm: left of it, hooks right
	{
		const x = O[0] - MIRROR / 2 - BR.off;
		const A = [x, at(ends.e2.rest)[1]], B = [x, at(ends.e2.now)[1]];
		const len = bracket(A, B, [1, 0], ACCENT2, 'the e_2 bracket');
		check(near(len, (hp / 2) * ARM, 1e-9), 'the e_2 bracket is not (1/2) h+ L');
		L.push(await placed(`-\\tfrac12${h}L`, x - LABEL_GAP - 0.6, (A[1] + B[1]) / 2, 1, 0.5, INK));
	}
	// the arms' names
	L.push(await placed('L', at([ARM / 2, 0])[0], O[1] + LINE / 2 + LABEL_GAP + 0.4, 0.5, 0, INK));
	L.push(await placed('L', O[0] - LINE / 2 - LABEL_GAP - 0.4, at([0, ARM / 2])[1], 1, 0.5, INK));
	L.push(await placed('\\boldsymbol e_1', at(ends.e1.now)[0] + MIRROR / 2 + LABEL_GAP + 0.6, O[1], 0, 0.5, INK));
	{
		L.push(await placed('\\boldsymbol e_2', O[0] - MIRROR / 2 - LABEL_GAP - 0.6, at(ends.e2.later)[1], 1, 0.5, INK));
		L.push(await placed('\\text{half a cycle later}', O[0] + MIRROR / 2 + LABEL_GAP + 1, at(ends.e2.later)[1], 0, 0.5, DIM));
	}

	// ---- the sum: the two brackets end to end, an ink bracket over both
	{
		const half = (hp / 2) * ARM;
		const [x0, y0] = at([SUM_AT[0] * ARM, SUM_AT[1] * ARM]);
		const a = bracket([x0, y0], [x0 + half, y0], [0, -1], ACCENT, 'the summed e_1 bracket');
		const b = bracket([x0 + half, y0], [x0 + 2 * half, y0], [0, -1], ACCENT2, 'the summed e_2 bracket');
		const yi = y0 + BR.hook + 3.2;
		const sum = bracket([x0, yi], [x0 + 2 * half, yi], [0, -1], INK, 'the summing bracket');
		check(near(a + b, hp * ARM, 1e-9) && near(sum, hp * ARM, 1e-9), 'the sum is not h+ L');
		L.push(await stack([`\\text{difference }${h}L\\text{,}`, `\\text{so the strain is }${h}`], x0 + half, yi + LABEL_GAP + 0.6, 0.5, INK));
	}

	// ---- the direction of travel, out of the page, at the top right
	{
		const q = [at(ends.e1.now)[0], at(ends.e2.later)[1]];
		odot(S, q, 'the direction of travel');
		L.push(await placed('\\text{wave along }z', q[0], q[1] + ODOT.r + LABEL_GAP + 0.6, 0.5, 0, INK));
	}

	S.checkAll(L);
	window[name + '-numbers'] = { factor, half: (hp / 2) * ARM, sum: hp * ARM };
	return finish(S, L, [200, 260]);
}
