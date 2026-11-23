// The tutorial, chapter 2.7 (tutorial/outside/evanescent.md), the corner at the sheet. The transformed potential of
// one ripple of a thin sheet, Phi~ = C e^{-k|h|} with C = -2 pi G sigma~ / k (negative for a sheet of positive mass),
// against the height h, drawn upward, for h from -2/k to 2/k: a curve with a sharp corner at the sheet, h = 0, where it
// reaches C. Through the corner, the two tangents, one to each branch: above the sheet the slope dPhi~/dh is -kC, below
// it kC, so the slope jumps by -2kC = 4 pi G sigma~ across the sheet. A thin orange band at h = 0 marks the sheet.
// Exact: the curve (sampled every quarter of a point, the corner itself a sample), the tangents' slopes (asserted
// against numerical one-sided derivatives of the curve) and their difference. The horizontal axis is in units of |C|,
// the vertical in units of 1/k; the horizontal scale is chosen for the drawing.
import { Sheet, ORIGIN, finish, checker, placed, near, n2, AXIS, HAIR, TICK } from './tut-pot-lib.js';
import { Plot, xAxis, LABEL_GAP, NUM } from './tut-prob-lib.js';
import { longest, INK, DIM, ACCENT, ACCENT2, CURVE } from './tut-fourier-lib.js';

const name = 'tut-evan-jump';
const check = checker(name);

// ---- the mathematics: the potential in units of |C|, so C = -1; the height in units of 1/k, so k = 1 ------------------
export const C = -1, K = 1, HMAX = 2;
export const phi = (h) => C * Math.exp(-K * Math.abs(h));
const TAN = 0.62;                       // how far each tangent runs from the corner along its branch, in 1/k
const BACK = 0.26;                      // and on past the corner

function mathematics() {
	const d = 1e-7;
	const above = (phi(d) - phi(0)) / d, below = (phi(0) - phi(-d)) / d;
	check(near(above, -K * C, 1e-6) && near(below, K * C, 1e-6), `the slopes are ${above} and ${below}`);
	// the jump, -2kC, is 4 pi G sigma~ because C = -2 pi G sigma~ / k: in units of 2 pi G sigma~ / k it is 2
	check(near(above - below, -2 * K * C, 1e-6) && near(-2 * K * C, 2, 1e-12), 'the jump');
	return { above, below };
}

// ---- the drawing (points) ------------------------------------------------------------------------------------------
const PW = 206, PH = 140;
const BAND = 1.3;                        // the sheet's band, points thick

export default async function () {
	const nums = mathematics();
	const S = new Sheet(name);
	const L = [];
	const P = new Plot({ left: ORIGIN - PW / 2, top: ORIGIN - PH / 2, w: PW, h: PH, x0: -1.75, x1: 0, y0: -HMAX, y1: HMAX });
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

	// ---- the two tangents through the corner, each along its own branch and a little past the corner
	const tangents = [
		{ slope: nums.above, from: -BACK, to: TAN, src: '-kC', what: 'the tangent above' },
		{ slope: nums.below, from: BACK, to: -TAN, src: 'kC', what: 'the tangent below' }
	];
	for (const t of tangents) {
		const line = (h) => P.at(C + t.slope * h, h);
		S.path([line(t.from), line(t.to)], { color: ACCENT2, width: 0.5, layer: 1.8, cap: 'butt', what: t.what });
		const [x, y] = line(t.to);
		t.label = await S.clear(t.src, x + LABEL_GAP, y, 0, 0.5, [1, 0], { color: ACCENT2 });
		L.push(t.label);
	}

	// ---- the vertical axis at Phi~ = 0, on the right, its ticks and numbers on its right
	S.path([[P.right, P.bottom], [P.right, P.top]], { color: DIM, width: AXIS, layer: 1, cap: 'butt', what: 'the h axis' });
	const tickName = { '-2': '-2/k', '-1': '-1/k', 0: '0', 1: '1/k', 2: '2/k' };
	for (const h of [-2, -1, 0, 1, 2]) {
		const y = P.Y(h);
		S.path([[P.right, y], [P.right + TICK, y]], { color: DIM, width: HAIR, layer: 1, cap: 'butt', what: `the h axis's tick at ${h}` });
		L.push(await placed(tickName[h], P.right + TICK + NUM, y, 0, 0.5, DIM));
	}
	L.push(await placed('h', P.right, P.top - LABEL_GAP - 1.5, 0.5, 1, DIM));
	// ---- the horizontal axis at the bottom, with C and 0
	const xl = await xAxis(S, P, { ticks: [C, 0], fmt: (t) => (t ? 'C' : '0'), what: 'the potential axis' });
	L.push(...xl);
	L.push(await placed('\\tilde\\Phi', P.left - 4, (xl[0].box.t + xl[0].box.b) / 2, 1, 0.5, DIM));

	// ---- the jump, left of the corner, above the sheet
	L.push(await S.clear('-2kC = 4\\pi G\\tilde\\sigma', P.X(C) - 6, y0 - BAND / 2 - LABEL_GAP - 1, 1, 1, [0, -1], { color: ACCENT2 }));

	S.checkAll(L);
	window.tutEvanJump = { ...nums, jump: nums.above - nums.below };
	return finish(S, L, [240, 340]);
}
