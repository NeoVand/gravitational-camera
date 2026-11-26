// The tutorial, section 5.5 (tutorial/waves/radiance.md), its second diagram: the radiance along a ray through a
// uniform slab, from the equation of transfer. Two charts side by side on the same axes: across, the depth s/L from
// -0.2 to 1.2, the slab (the neutral tint) from 0 to 1; up, the radiance in units of j/alpha from 0 to 1.1, with a
// dotted line at 1 named j_omega/alpha. Radiation of the radiance I_bg = 0.3 j/alpha arrives from the left, a head on
// the flat line before the slab named I_bg, and leaves at the right into a pixel (section 5.3's small square, a head on
// the line before it). The radiance is drawn as two stacked areas: the background's share I_bg e^{-tau s/L}, in the
// second accent's tint under a line in the second accent (the paper's blue, light's colour in Figure
// fig:line-integral), and the slab's own glow (j/alpha)(1 - e^{-tau s/L}) stacked on it, in the first accent's tint
// (the paper's orange, the glow's); their sum, a thin ink line. Left, "thick, tau = 5": the blue share falls to
// 0.3 e^{-5} = 0.002 and the sum climbs to 0.995. Right, "thin, tau = 0.1": the blue share falls only to 0.271 and the
// orange glow rises almost linearly to 0.095, so that the sum ends at 0.367.
// Departures from the diagram's comment: the comment set the charts side by side at 340 site pixels (179 points)
// each, together wider than the site's 340 points; they stay side by side, each 118 points wide, so that their
// curves can be compared at one height. The shares stay stacked beyond the slab's faces too, where nothing changes
// them (before it all of the radiance is the background's). The two areas are named where each is large enough to
// hold its name: the glow in the thick chart, the background in the thin one (the comment named both in the thick
// chart, where the background's share is a sliver). The thin slab's sum is 0.3666, 0.367 to three places; the
// comment's 0.366 adds the rounded shares.
// Exact: both charts, the closed form of the equation of transfer (asserted in tut-rad-lib.js against a numerical
// solution), sampled every quarter of a point at most; the shares at the front face (asserted). Nothing is schematic.
import { Sheet, ORIGIN, finish, checker, placed, near, HAIR, LABEL_GAP } from './tut-pot-lib.js';
import { Plot, xAxis, yAxis, pathOf, merge, NUM } from './tut-prob-lib.js';
import { graph, longest, CURVE } from './tut-fourier-lib.js';
import { INK, DIM, ACCENT, ACCENT2 } from '../lib.js';
import { chapter, pixel, background, radiance, TAUS, I_BG, SQ, TINT, TINT_ACCENT, TINT_ACCENT2 } from './tut-rad-lib.js';

const name = 'tut-rad-slab';
const check = checker(name);

const PW = 118, PH = 86;                  // each chart, points
const U0 = -0.2, U1 = 1.2, TOP = 1.1;
const APART = 34;                         // from the left chart's right edge to the right chart's
const HEAD = 3.4, HEAD_W = 1.25;          // a head on a line: length and half-width
const SUM = CURVE - 0.1;                  // the sum's thin line

export default async function () {
	const nums = chapter(check);
	const S = new Sheet(name);
	const L = [];
	const left = ORIGIN - PW - APART / 2;
	const charts = [
		{ tau: TAUS.thick, title: '\\text{thick, }\\tau = 5', key: 'thick', P: new Plot({ left, top: ORIGIN - PH / 2, w: PW, h: PH, x0: U0, x1: U1, y0: 0, y1: TOP }) },
		{ tau: TAUS.thin, title: '\\text{thin, }\\tau = 0.1', key: 'thin', P: new Plot({ left: left + PW + APART, top: ORIGIN - PH / 2, w: PW, h: PH, x0: U0, x1: U1, y0: 0, y1: TOP }) }
	];
	const head = (P, u, f, color, what) => {
		const [x, y] = P.at(u, f(u));
		const box = { l: x - HEAD / 2, r: x + HEAD / 2, t: y - HEAD_W, b: y + HEAD_W };
		S.fill(pathOf([[x + HEAD / 2, y], [x - HEAD / 2, y - HEAD_W], [x - HEAD / 2, y + HEAD_W]]), box, { color, layer: 4, what });
	};

	for (const { tau, title, key, P } of charts) {
		const b = (u) => background(tau, u), I = (u) => radiance(tau, u);
		// ---- the slab: the neutral tint over the whole height, under the areas
		S.raw(`<rect x="${P.X(0).toFixed(2)}" y="${P.Y(TOP).toFixed(2)}" width="${(P.X(1) - P.X(0)).toFixed(2)}" height="${PH.toFixed(2)}" fill="${TINT}"/>`, 0.1);
		// ---- the two stacked areas: the background's share from zero up, the glow on it up to the sum
		const lower = graph(P, b, U0, U1), upper = graph(P, I, U0, U1);
		check(longest(lower) <= 0.2501 && longest(upper) <= 0.2501, `the ${key} chart's curves are coarse`);
		S.raw(`<path d="${pathOf([P.at(U0, 0), ...lower, P.at(U1, 0)])}" fill="${TINT_ACCENT2}"/>`, 0.2);
		S.raw(`<path d="${pathOf([...upper, ...[...lower].reverse()])}" fill="${TINT_ACCENT}"/>`, 0.2);
		// ---- the sum, ink, over everything; the background's share, blue, from the back face to where it would run
		// along the axis (in the thick slab) or to the right edge
		S.path(upper, { color: INK, width: SUM, layer: 3, cap: 'butt', what: `the ${key} sum` });
		const floor = merge(P, CURVE);
		let end = U1;
		if (b(U1) < floor) { end = 0; while (b(end) >= floor) end += 1e-4; }
		const blue = graph(P, b, 0, end);
		S.path(blue, { color: ACCENT2, width: CURVE, layer: 2.5, cap: 'butt', what: `the ${key} background` });
		// the shares at the front face, as the chapter gives them
		if (key === 'thick') check(b(1).toFixed(3) === '0.002' && I(1).toFixed(3) === '0.995' && near(I(1), nums.thickSum, 1e-15), 'the thick shares');
		else check(b(1).toFixed(3) === '0.271' && (I(1) - b(1)).toFixed(3) === '0.095' && I(1).toFixed(3) === '0.367', 'the thin shares');
		// the sum is the radiance before, inside and after the slab; flat outside it
		check(near(I(U0), I_BG, 1e-15) && near(I(U1), I(1), 1e-15), `the ${key} sum outside the slab`);
		// ---- the dotted line at j/alpha
		S.dots(P.at(U0, 1), P.at(U1, 1), { color: DIM, what: `the ${key} line j/alpha` });
		// ---- the axes
		L.push(...await xAxis(S, P, { ticks: [0, 0.5, 1], fmt: (t) => (t === 0.5 ? '0.5' : String(t)), what: `the ${key} s axis` }));
		const yl = await yAxis(S, P, { ticks: [0, I_BG, 1], fmt: key === 'thick' ? (t) => (t === I_BG ? '0.3' : String(t)) : () => null, to: TOP, what: `the ${key} radiance axis` });
		L.push(...yl);
		// ---- the heads: the background arriving, the radiance leaving into the pixel
		head(P, -0.1, I, INK, `the ${key} arriving head`);
		head(P, 1.12, I, INK, `the ${key} leaving head`);
		// ---- the pixel, just beyond the right edge, on the line
		const q = [P.X(U1) + SQ / 2 + 1.2, P.Y(I(U1))];
		S.path([[P.X(U1), q[1]], [q[0] - SQ / 2, q[1]]], { color: INK, width: SUM, layer: 3, cap: 'butt', what: `the ${key} sum to the pixel` });
		pixel(S, q, `the ${key} pixel`);
		L.push(await S.clear('\\text{pixel}', q[0], q[1] - SQ / 2 - LABEL_GAP - 0.5, 0.5, 1, [0, -1], { color: INK }));
		// ---- the title
		L.push(await placed(title, P.X(0.5), P.top - 7, 0.5, 1, INK));
		// ---- I_bg over the line before the slab
		L.push(await S.clear('I_{\\mathrm{bg}}', P.X(-0.1), P.Y(I_BG) - LABEL_GAP - 1, 0.5, 1, [0, -1], { color: INK }));
		charts.find((c) => c.key === key).yl = yl;
	}

	// ---- the names: j/alpha over the right end of its line in the thin chart, clear of the curves and of I; the glow in the thick chart's orange
	// area; the background in the thin chart's blue area; s/L and I under and over the axes
	{
		const { P } = charts[0];
		L.push(await S.clear('j_\\omega/\\alpha', charts[1].P.X(U1), P.Y(1) - LABEL_GAP - 0.4, 1, 1, [0, -1], { color: DIM }));
		const g1 = await placed('\\text{glow,}', P.X(0.66), P.Y(0.62), 0.5, 1, ACCENT);
		const g2 = await placed('(j_\\omega/\\alpha)(1 - e^{-\\tau})', P.X(0.66), g1.box.b + 2.2, 0.5, 0, ACCENT);
		L.push(g1, g2);
	}
	{
		const { P, tau } = charts[1];
		const l = await placed('\\text{background, } I_{\\mathrm{bg}}\\,e^{-\\tau}', P.X(0.5), P.Y(0.135), 0.5, 0.5, ACCENT2);
		check(l.box.b < P.bottom - LABEL_GAP && l.box.t > P.Y(background(tau, 1)) + LABEL_GAP, 'the background\'s name leaves its area');
		L.push(l);
	}
	for (const { P, key, yl } of charts) {
		const xl = L.filter((l) => l.src === '1' && Math.abs((l.box.l + l.box.r) / 2 - P.X(1)) < 1)[0];
		L.push(await placed('s/L', P.X(U1) + 3, xl.box.t, 0, 0, DIM));
		if (key === 'thick') L.push(await placed('I_\\omega', P.left - 2.5 - NUM, P.top - 6, 1, 1, DIM));
		void yl;
	}

	S.checkAll(L);
	window[name + '-numbers'] = { ...nums };
	return finish(S, L, [240, 340]);
}
