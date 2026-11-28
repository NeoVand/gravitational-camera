// The tutorial, section 7.6 (tutorial/geometry/gravitational-waves.md), its second diagram: LIGO's two arms in a plus
// wave, seen from above. An L of two arms of length L from a corner mass, along e_1 (right) and e_2 (up): thin ink lines
// ending in small filled squares, the end mirrors, in the observer's colour. Each undisturbed end is a dashed square;
// each disturbed end is moved by delta xi = (1/2) h xi (exaggerated): the e_1 arm longer by (1/2) h+ L (an orange
// bracket, a stretch), the e_2 arm shorter by the same (a blue bracket, a squeeze). Under the e_1 end the two brackets
// set end to end over an ink bracket, "difference h+ L, so the strain is h+". A pale copy of the two ends, "half a cycle
// later", with the signs reversed. The direction of travel, out of the page, in the corner of the L, "wave along z".
// Departures from the diagram's comment: the arms are 130 points long on the page, so that the drawing is about 250 by
// 195 points and nothing at the ends is crowded. The sum of the two brackets is not built from coloured copies: under
// the e_1 arm two dimension lines from the corner compare the arms' lengths, "the e_1 arm, L + (1/2) h+ L" and "the e_2
// arm, L - (1/2) h+ L" (the e_2 arm's length laid along e_1), and on the second line an ink double-headed arrow runs
// from the end of the shorter to the end of the longer (a dotted leader brings the longer's end down to it), "difference
// h+ L, so the strain is h+". The three kinds of square are explained by a key inside the L, upper right ("a mirror
// now", "undisturbed", "half a cycle later"), not by words beside one of them. The arms' names e_1 and e_2 stand beyond
// their far ends; the arms' undisturbed length L is named by the dimension lines, not beside the arms. The labels of
// the brackets are in ink, with h+ in the field's colour (the chapter's), and the brackets carry the orange and the blue.
// Exact: every end, the image of its place under delta xi_i = (1/2) h_ij xi_j (tut-gw-lib.js) for the drawn strain
// h+ = 2 delta and, half a cycle later, -h+; the brackets, (1/2) h+ L long, the dimension lines L +- (1/2) h+ L and the
// difference between them h+ L, measured on the page;
// the exaggeration, the drawn strain over LIGO's 10^-21, asserted to round to 10^20 (2.2 x 10^20). Schematic: the
// mirrors' size; the arms' length on the page.
import { Sheet, ORIGIN, finish, checker, placed, near, LABEL_GAP, HAIR } from './tut-pot-lib.js';
import { INK, DIM, PAGE } from '../lib.js';
import { chapter, palette, stack, OBS, FIELD, ACCENT, ACCENT2, move, odot, ODOT, LIGO_H } from './tut-gw-lib.js';

const name = 'tut-gw-arms';
const check = checker(name);

const ARM = 130;                           // an arm's length on the page, points (schematic)
const DELTA = 0.11;                        // each arm's drawn change over its length: (1/2) h+, exaggerated
const MIRROR = 6.5;                        // a mirror's side
const CORNER = 7;                          // the corner mass's side
const LINE = 0.6;                          // the arms
const DASH = [1.3, 0.9];                   // the undisturbed ends' outline
const PALE = 0.4;                          // the pale copy's opacity
const BR = { width: 0.75, hook: 2.6, off: 4.2 };   // the brackets: stroke, hooks, and their air from a mirror's edge
const DIM_AIR = 9;                         // the e_1 arm's mirror to the first dimension line under it
const DIM_ROW = 13;                        // between the two dimension lines
const DIM_GAP = 2.8;                        // a dimension line's break round its words
const TICK = 2.2;                          // half a dimension line's end
const DIFF_W = 0.75, DIFF_HEAD = 3.4;      // the difference's double-headed arrow
const KEY_X = 0.5, KEY_TOP = 2;            // the key's left edge (in arms, from the corner) and its first row (below the e_2 arm's top)
const KEY_AIR = 4, KEY_ROW = 10.5;         // a key square to its words, and between the rows
const WAVE_AT = [0.2, 0.32];               // the direction of travel, in units of the arm, from the corner (right, up)

export default async function () {
	chapter(check);
	await palette(check);
	const S = new Sheet(name);
	const L = [];
	const hp = 2 * DELTA;
	const factor = hp / LIGO_H;
	check(Math.round(Math.log10(factor)) === 20 && factor.toExponential(1) === '2.2e+20', `the exaggeration ${factor}`);

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
	const STYLE = {
		now: { fill: OBS, layer: 2 },
		rest: { stroke: DIM, dash: DASH, layer: 1 },
		later: { fill: OBS, opacity: PALE, layer: 1 }
	};
	square(at([0, 0]), CORNER, { fill: OBS, what: 'the corner mass' });
	for (const k of ['e1', 'e2']) {
		square(at(ends[k].rest), MIRROR, { ...STYLE.rest, what: `the ${k} end undisturbed` });
		square(at(ends[k].later), MIRROR, { ...STYLE.later, what: `the ${k} end half a cycle later` });
		square(at(ends[k].now), MIRROR, { ...STYLE.now, what: `the ${k} end` });
	}
	// the three places of an end do not overlap
	for (const k of ['e1', 'e2']) {
		const xs = [ends[k].later, ends[k].rest, ends[k].now].map((q) => q[0] + q[1]);
		check(Math.abs(xs[1] - xs[0]) > MIRROR + 1.5 && Math.abs(xs[2] - xs[1]) > MIRROR + 1.5, `the ${k} ends overlap`);
	}

	// ---- a bracket between two figure points, its hooks toward the side n (a unit vector, figure coordinates)
	const bracket = (A, B, n, color, what, width = BR.width) => {
		const k = BR.hook;
		S.path([[A[0] + n[0] * k, A[1] + n[1] * k], A, B, [B[0] + n[0] * k, B[1] + n[1] * k]], { color, width, cap: 'butt', layer: 3, what });
		return Math.hypot(B[0] - A[0], B[1] - A[1]);
	};
	const h = `{\\color{${FIELD}}h_+}`;
	const half = (hp / 2) * ARM;
	// the e_1 arm's change: above it, inside the L, from the undisturbed end to the end now, hooks down
	{
		const y = O[1] - MIRROR / 2 - BR.off;
		const A = [at(ends.e1.rest)[0], y], B = [at(ends.e1.now)[0], y];
		const len = bracket(A, B, [0, 1], ACCENT, 'the e_1 bracket');
		check(near(len, half, 1e-9), 'the e_1 bracket is not (1/2) h+ L');
		L.push(await placed(`+\\tfrac12${h}L`, (A[0] + B[0]) / 2, y - LABEL_GAP - 0.6, 0.5, 1, INK));
	}
	// the e_2 arm's change: left of it, hooks right
	{
		const x = O[0] - MIRROR / 2 - BR.off;
		const A = [x, at(ends.e2.rest)[1]], B = [x, at(ends.e2.now)[1]];
		const len = bracket(A, B, [1, 0], ACCENT2, 'the e_2 bracket');
		check(near(len, half, 1e-9), 'the e_2 bracket is not (1/2) h+ L');
		L.push(await placed(`-\\tfrac12${h}L`, x - LABEL_GAP - 0.6, (A[1] + B[1]) / 2, 1, 0.5, INK));
	}
	// the arms' names, beyond their far ends
	L.push(await placed('\\boldsymbol e_1', at(ends.e1.now)[0] + MIRROR / 2 + LABEL_GAP + 0.6, O[1], 0, 0.5, INK));
	L.push(await placed('\\boldsymbol e_2', O[0], at(ends.e2.later)[1] - MIRROR / 2 - LABEL_GAP - 0.4, 0.5, 1, INK));

	// ---- the two arms' lengths compared, under the e_1 arm: two dimension lines from the corner, the e_1 arm's and the
	// e_2 arm's (laid along e_1), and an ink bracket from the end of the shorter to the end of the longer, the difference
	{
		const xs = O[0], x1 = at(ends.e1.now)[0], x2 = xs + Math.hypot(...ends.e2.now);
		const y1 = O[1] + MIRROR / 2 + DIM_AIR, y2 = y1 + DIM_ROW;
		const dimension = async (xa, xb, y, src, what) => {
			const lab = await placed(src, (xa + xb) / 2, y, 0.5, 0.5, INK);
			const g0 = lab.box.l - DIM_GAP, g1 = lab.box.r + DIM_GAP;
			S.path([[xa, y], [g0, y]], { color: INK, width: HAIR, cap: 'butt', layer: 1, what: `${what}, left` });
			S.path([[g1, y], [xb, y]], { color: INK, width: HAIR, cap: 'butt', layer: 1, what: `${what}, right` });
			for (const x of [xa, xb]) S.path([[x, y - TICK], [x, y + TICK]], { color: INK, width: HAIR, cap: 'butt', layer: 1, what: `${what}'s end at ${x.toFixed(1)}` });
			L.push(lab);
			return xb - xa;
		};
		const l1 = await dimension(xs, x1, y1, `\\text{the }\\boldsymbol e_1\\text{ arm, }L + \\tfrac12${h}L`, 'the e_1 arm\'s length');
		const l2 = await dimension(xs, x2, y2, `\\text{the }\\boldsymbol e_2\\text{ arm, }L - \\tfrac12${h}L`, 'the e_2 arm\'s length');
		check(near(l1, ARM + half, 1e-9) && near(l2, ARM - half, 1e-9), 'the arms\' lengths');
		// a dotted leader from the e_1 arm's end down to the second row, and the difference on that row, in ink
		S.dots([x1, y1 + TICK + 0.6], [x1, y2 + TICK + 0.6], { color: DIM, layer: 1, what: 'the leader from the e_1 arm\'s end' });
		const yd = y2;
		const dl = S.arrow([(x2 + x1) / 2, yd], [x2, yd], { color: INK, width: DIFF_W, head: DIFF_HEAD, layer: 3, what: 'the difference, left' });
		const dr = S.arrow([(x2 + x1) / 2, yd], [x1, yd], { color: INK, width: DIFF_W, head: DIFF_HEAD, layer: 3, what: 'the difference, right' });
		check(near(dl.L + dr.L, hp * ARM, 1e-9), 'the difference is not h+ L');
		const w = await stack([`\\text{difference }${h}L\\text{,}`, `\\text{so the strain is }${h}`], x1 + LABEL_GAP + 1.2, yd - 4.6, 0, INK);
		L.push(w);
	}

	// ---- the key to the three squares, in the upper right, inside the L
	{
		const rows = [['now', '\\text{a mirror now}'], ['rest', '\\text{undisturbed}'], ['later', '\\text{half a cycle later}']];
		let y = at([0, ARM])[1] + KEY_TOP;
		const kx = at([KEY_X * ARM, 0])[0];
		for (const [k, src] of rows) {
			square([kx + MIRROR / 2, y], MIRROR, { ...STYLE[k], what: `the key's ${k} square` });
			const lab = await placed(src, kx + MIRROR + KEY_AIR, y, 0, 0.5, k === 'now' ? INK : DIM);
			L.push(lab);
			y += KEY_ROW;
		}
	}

	// ---- the direction of travel, out of the page, in the corner of the L
	{
		const q = at([WAVE_AT[0] * ARM, WAVE_AT[1] * ARM]);
		odot(S, q, 'the direction of travel');
		L.push(await placed('\\text{wave along }z', q[0] + ODOT.r + LABEL_GAP + 0.6, q[1], 0, 0.5, INK));
	}

	S.checkAll(L);
	window[name + '-numbers'] = { factor, half: (hp / 2) * ARM, sum: hp * ARM };
	return finish(S, L, [180, 260]);
}
