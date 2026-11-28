// The tutorial, section 2.7 (tutorial/outside/evanescent.md), the corner at the sheet. The transformed potential of
// one ripple of a thin sheet, Phi~ = C e^{-k|h|} with C = -2 pi G sigma~ / k (negative for a sheet of positive mass),
// against the height h, drawn upward, for h from -1.5/k to 1.5/k: a curve with a sharp corner at the sheet, h = 0,
// where it reaches C. From the corner, the two tangents, one to each branch, each drawn to the h axis (Phi~ = 0), which
// it meets at h = 1/k above and -1/k below. Their slopes, labelled as derivatives along the height so that they are not
// read as steepness on the page (h is drawn upward): above the sheet dPhi~/dh = -kC, below it kC. The jump of the
// slope across the sheet, -2kC = 4 pi G sigma~, is the angle between the two tangents at the corner: an arc marks it,
// and its value sits inside the angle on the sheet's line, which gives way to it. A thin orange band at h = 0 marks
// the sheet. The axes: h on the right, at Phi~ = 0, ticked at -1/k, 0 and 1/k; Phi~ at the bottom, ticked at C and
// 0, named under its numbers at its right end.
// Exact: the curve (sampled every quarter of a point, the corner itself a sample), the tangents' slopes (asserted
// against numerical one-sided derivatives of the curve), their difference, and the points where they meet the h axis
// (asserted). The horizontal axis is in units of |C|, the vertical in units of 1/k; the scales, and so the arc's angle
// on the page, are chosen for the drawing. The plot runs from 1.25 |C| on the left.
import { Sheet, ORIGIN, finish, checker, placed, near, n2, AXIS, AXIS_HEAD, HAIR, TICK } from './tut-pot-lib.js';
import { PAGE } from '../lib.js';
import { Plot, xAxis, LABEL_GAP, NUM } from './tut-prob-lib.js';
import { longest, INK, DIM, ACCENT, ACCENT2, CURVE } from './tut-fourier-lib.js';

const name = 'tut-evan-jump';
const check = checker(name);

// ---- the mathematics: the potential in units of |C|, so C = -1; the height in units of 1/k, so k = 1 ------------------
export const C = -1, K = 1, HMAX = 1.5;
export const phi = (h) => C * Math.exp(-K * Math.abs(h));

function mathematics() {
	const d = 1e-7;
	const above = (phi(d) - phi(0)) / d, below = (phi(0) - phi(-d)) / d;
	check(near(above, -K * C, 1e-6) && near(below, K * C, 1e-6), `the slopes are ${above} and ${below}`);
	// the jump, -2kC, is 4 pi G sigma~ because C = -2 pi G sigma~ / k: in units of 2 pi G sigma~ / k it is 2
	check(near(above - below, -2 * K * C, 1e-6) && near(-2 * K * C, 2, 1e-12), 'the jump');
	return { above, below };
}

// ---- the drawing (points) ------------------------------------------------------------------------------------------
const PW = 175, PH = 150;               // 140 points per |C|, 50 per 1/k
const ARC = 20;                          // the radius of the arc that marks the angle between the tangents, points
const X0 = -1.25;                        // the plot's left edge, in |C|
const BAND = 1.3;                        // the sheet's band, points thick

export default async function () {
	const nums = mathematics();
	const S = new Sheet(name);
	const L = [];
	const P = new Plot({ left: ORIGIN - PW / 2, top: ORIGIN - PH / 2, w: PW, h: PH, x0: X0, x1: 0, y0: -HMAX, y1: HMAX });
	// a point of the curve on the page, its height h the parameter
	const at = (h) => P.at(phi(h), h);

	// ---- the sheet: a thin band across the plot at h = 0
	const y0 = P.Y(0);
	S.fill(`M${n2(P.left)},${n2(y0 - BAND / 2)}H${n2(P.right)}V${n2(y0 + BAND / 2)}H${n2(P.left)}Z`,
		{ l: P.left, r: P.right, t: y0 - BAND / 2, b: y0 + BAND / 2 }, { color: ACCENT, layer: 1.5, what: 'the sheet' });

	// ---- the curve, each branch sampled so that no step is longer than a quarter of a point, the corner a sample
	const branch = (a, b) => {
		const pts = [at(a)];
		let h = a;
		while (h !== b) {
			let dh = (b - a) / 4;
			for (let i = 0; i < 40; i++) {
				const h2 = a < b ? Math.min(b, h + dh) : Math.max(b, h + dh);
				const [p, q] = at(h2), [r, s] = at(h);
				if (Math.hypot(p - r, q - s) <= 0.25) break;
				dh /= 2;
			}
			h = a < b ? Math.min(b, h + dh) : Math.max(b, h + dh);
			pts.push(at(h));
		}
		return pts;
	};
	const pts = [...branch(-HMAX, 0), ...branch(0, HMAX).slice(1)];
	check(longest(pts) <= 0.2501, `the curve has a step of ${longest(pts)} pt`);
	check(pts.some(([x, y]) => near(x, P.X(C), 1e-9) && near(y, y0, 1e-9)), 'the corner is not a sample');
	S.path(pts, { color: INK, width: CURVE, layer: 2, what: 'the curve' });

	// ---- the two tangents, each from the corner along its own branch to the h axis: the tangent above,
	// Phi~ = C - kC h, meets Phi~ = 0 at h = 1/k, and the one below at h = -1/k
	const tangents = [
		{ slope: nums.above, to: 1 / K, src: '\\partial_h\\tilde\\Phi = -kC', what: 'the tangent above' },
		{ slope: nums.below, to: -1 / K, src: '\\partial_h\\tilde\\Phi = kC', what: 'the tangent below' }
	];
	for (const t of tangents) {
		check(near(C + t.slope * t.to, 0, 1e-6), `${t.what} does not meet the h axis at ${t.to}`);
		const line = (h) => P.at(C + t.slope * h, h);
		S.path([line(0), line(t.to)], { color: ACCENT2, width: 0.5, layer: 1.8, cap: 'butt', what: t.what });
	}

	// ---- the vertical axis at Phi~ = 0, on the right, its ticks and numbers on its right; the tangents end on it
	S.arrow([P.right, P.bottom], [P.right, P.top - 9], { color: DIM, width: AXIS, head: AXIS_HEAD, layer: 1, what: 'the h axis' });
	const tickName = { '-1': '-1/k', 0: '0', 1: '1/k' };
	for (const h of [-1, 0, 1]) {
		const y = P.Y(h);
		S.path([[P.right, y], [P.right + TICK, y]], { color: DIM, width: HAIR, layer: 1, cap: 'butt', what: `the h axis's tick at ${h}` });
		L.push(await placed(tickName[h], P.right + TICK + NUM, y, 0, 0.5, DIM));
	}
	L.push(await placed('h', P.right + LABEL_GAP + 2.2, P.top - 9 + 1.5, 0, 0.5, DIM));
	// ---- the horizontal axis at the bottom, with C and 0, its name under its numbers, ending with the axis (as the
	// other plots of the chapter name theirs)
	const xl = await xAxis(S, P, { ticks: [C, 0], fmt: (t) => (t ? 'C' : '0'), what: 'the potential axis' });
	L.push(...xl);
	L.push(await placed('\\tilde\\Phi', P.right, Math.max(...xl.map((l) => l.box.b)) + 3.2, 1, 0, DIM));

	// ---- the slopes, each inside the angle, right-aligned near the h axis and tucked under (over) its own tangent
	const hAt = (x) => ((x - P.X(C)) / (P.right - P.X(C))) * (P.Y(0) - P.Y(1 / K));   // a tangent's height over the sheet
	for (const [k, t] of tangents.entries()) {
		const sgn = k === 0 ? -1 : 1;                               // up the page for the tangent above
		const probe = await placed(t.src, 0, 0, 1, 0.5, ACCENT2);
		const w = probe.box.r - probe.box.l, hh = probe.box.b - probe.box.t;
		const right = P.right - 4, edge = hAt(right - w) - LABEL_GAP - 0.6;     // the label's far side, from the sheet
		const lab = await placed(t.src, right, y0 + sgn * (edge - hh / 2), 1, 0.5, ACCENT2);
		check((k === 0 ? y0 - lab.box.t : lab.box.b - y0) + LABEL_GAP <= hAt(lab.box.l) + 1e-9, `the slope ${t.src} does not fit under its tangent`);
		L.push(lab);
	}

	// ---- the jump: the angle between the two tangents at the corner, marked by an arc across the sheet, its value
	// beside it on the sheet's line, the sheet broken for it
	const corner = P.at(C, 0);
	const ang = Math.atan2(P.Y(0) - P.Y(1 / K), P.X(0) - P.X(C));   // each tangent's angle from the sheet on the page
	const arcPts = Array.from({ length: 61 }, (_, i) => { const a = -ang + (2 * ang * i) / 60; return [corner[0] + ARC * Math.cos(a), corner[1] - ARC * Math.sin(a)]; });
	S.path(arcPts, { color: ACCENT2, width: HAIR + 0.05, layer: 2.5, what: 'the arc of the jump' });
	const jump = await placed('-2kC = 4\\pi G\\tilde\\sigma', corner[0] + ARC + LABEL_GAP + 1.2, y0, 0, 0.5, ACCENT2);
	// the sheet's band gives way to the value: a gap of the page's colour under it
	S.raw(`<rect x="${n2(jump.box.l - 1.6)}" y="${n2(y0 - BAND)}" width="${n2(jump.box.r - jump.box.l + 3.2)}" height="${n2(2 * BAND)}" fill="${PAGE}"/>`, 1.6);
	jump.on = ['the sheet'];
	L.push(jump);
	{
		// the value lies inside the angle, clear of both tangents
		const half = hAt(jump.box.l);
		check(jump.box.t > y0 - half + LABEL_GAP && jump.box.b < y0 + half - LABEL_GAP && jump.box.r < P.right - 2, 'the jump does not fit inside the angle');
	}

	S.checkAll(L);
	window.tutEvanJump = { ...nums, jump: nums.above - nums.below };
	return finish(S, L, [200, 340]);
}
