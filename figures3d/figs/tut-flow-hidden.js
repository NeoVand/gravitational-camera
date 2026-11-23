// The tutorial, chapter 2.8 (tutorial/outside/flows.md), its fourth diagram: the hidden swirl. A uniform sphere in
// section through its equator, seen along the axis about which it turns (out of the page): the inner ball, out to
// a = 2^(-1/5) R = 0.871 R, turns anticlockwise (orange) and the shell from a to R clockwise (blue), at the same rate.
// Each curved arrow is the path of a part in one interval of time, as in the paper's fig:hidden-flow (figs/hidden-flow.js,
// whose rings and angle are imported): all span the same angle, so their lengths are in proportion to the speeds. A
// scale of the radius beneath the section marks a and R. Beside it, two bars, the angular momenta of the inner ball
// and of the shell, (8 pi / 15) rho Omega a^5 and -(8 pi / 15) rho Omega (R^5 - a^5): equal and opposite. Under them,
// the shares of the mass, 66 and 34 per cent.
// Exact: a = 2^(-1/5) R, drawn to scale (asserted in points); the two angular momenta, equal and opposite (asserted),
// and the bars' heights in their ratio (asserted in points); the shares of the mass, (a/R)^3 = 2^(-3/5) and the rest
// (asserted against the printed 66 and 34); the arrows' sense and their angle. Schematic: the rings on which the arrows
// are drawn and their places. Pictorial: the sawn face of the steel ball (sprites/hair/ball-face.png, as in chapter
// 2.5's figures), clipped to the exact circle; marks on it keep fixed colours (figs/tut-flow-lib.js).
import { INK, DIM, ACCENT, ACCENT2 } from '../lib.js';
import { text } from '../stone.js';
import { SWEEP, RINGS } from './hidden-flow.js';
import { Sheet, ORIGIN, placed, finish, checker, near, HAIR, TICK, n2 } from './tut-pot-lib.js';
import { stone } from './tut-null-lib.js';
import { STONE_INK, STONE_ACCENT, STONE_ACCENT2, RIM, ballFace, stoneDefs, rim, turning, HIDDEN, momenta, checkChapter } from './tut-flow-lib.js';

const name = 'tut-flow-hidden';
const check = checker(name);

// ---- the drawing (points) -----------------------------------------------------------------------------------------
const R = 74;                          // the sphere's radius
const SCALE_GAP = 9;                   // from the section to the scale of the radius beneath it
const BARS_AT = 44;                    // from the section's rim to the first bar
const BAR_W = 15, BAR_GAP = 14;        // a bar's width, and the air between the two
const BAR_H = 40;                      // a bar's height for the inner ball's angular momentum
const ZERO_OUT = 5;                    // the zero line past the bars

/** The make of a path L points long: as the paths of figs/hidden-flow.js. */
function make(L) {
	const width = 0.9 * Math.min(1, L / 6.5) ** 0.4;
	const head = Math.min(3.8, 0.4 * L);
	return { width, head, spread: 0.78 * head + 0.5 * width };
}

export default async function () {
	checkChapter(name);
	const S = new Sheet(name);
	const C = [ORIGIN, ORIGIN];
	const u0 = HIDDEN;
	check(near(u0 ** 5, 0.5, 1e-12), 'the inner ball does not hold half the moment of inertia');
	const face = await ballFace();

	// ---- the section, its two circles
	S.raw(stoneDefs(`${name}-face`, face, R), -1);
	S.raw(stone(`${name}-stone`, `${name}-face`, C[0], C[1], R), 0);
	S.raw(rim(C[0], C[1], R) + rim(C[0], C[1], u0 * R), 4);
	const ring = (r) => Array.from({ length: 361 }, (_, k) => [C[0] + r * Math.cos((k * Math.PI) / 180), C[1] - r * Math.sin((k * Math.PI) / 180)]);
	S.mark(ring(R), RIM / 2, 'the rim');
	S.mark(ring(u0 * R), RIM / 2, 'the inner ball\'s edge');
	check(near(Math.hypot(...[ring(u0 * R)[0][0] - C[0], 0]), 0.871 * R, 0.0005 * R), 'the inner circle is not drawn at 0.871 R');

	// ---- the paths: the inner ball anticlockwise (Omega out of the page), the shell clockwise
	const sweep = (SWEEP * Math.PI) / 180;
	const paths = (r, first, sense, color) => {
		for (let m = 0; m < 4; m++) {
			const mid = ((first + 90 * m) * Math.PI) / 180;
			const t = turning(C[0], C[1], r * R, mid - (sense * sweep) / 2, mid + (sense * sweep) / 2, color, make(r * R * sweep));
			check(t.hd <= 0.4 * t.len + 1e-9, 'a path\'s head is longer than two fifths of it');
			S.raw(t.svg, 3);
			S.mark(t.pts, 0.45, `a path at ${r}`);
			S.mark(t.head, 0, `a path's head at ${r}`);
		}
	};
	for (const [r, first] of RINGS) {
		check(r < u0, 'a ring of the inner ball lies outside it');
		paths(r, first, 1, STONE_ACCENT);
	}
	const band = (1 + u0) / 2;
	paths(band, 0, -1, STONE_ACCENT2);
	// the shell's paths stay inside it, heads and all
	const spread = make(band * R * sweep).spread;
	check(band * R - spread / 2 > u0 * R + RIM && band * R + spread / 2 < R - RIM, 'the shell\'s paths do not fit in the shell');

	// ---- the scale of the radius, beneath the section: 0 at the centre, a and R
	const y0 = C[1] + R + SCALE_GAP;
	const X = (u) => C[0] + u * R;
	S.path([[X(0), y0], [X(1), y0]], { color: DIM, width: HAIR, layer: 1, what: 'the scale' });
	for (const u of [0, u0, 1]) S.path([[X(u), y0 - TICK], [X(u), y0 + TICK]], { color: DIM, width: HAIR, layer: 1, cap: 'butt', what: `the tick at ${u}` });
	check(near(X(u0) - X(0), 0.8706 * R, 0.0001 * R), 'the scale does not mark a at 0.871 R');

	// ---- the bars: the two angular momenta, in units of (8 pi / 15) rho Omega R^5, from one zero line
	const [Lb, Ls] = momenta();
	check(near(Lb, -Ls, 1e-15) && Lb > 0, 'the two angular momenta are not equal and opposite');
	const k = BAR_H / Lb;
	const x1 = C[0] + R + BARS_AT, x2 = x1 + BAR_W + BAR_GAP;
	const bar = (x, h, color, what) => {
		const top = Math.min(C[1], C[1] - h), bottom = Math.max(C[1], C[1] - h);
		S.fill(`M${n2(x)},${n2(top)}H${n2(x + BAR_W)}V${n2(bottom)}H${n2(x)}Z`, { l: x, r: x + BAR_W, t: top, b: bottom }, { color, layer: 1, what });
		return { top, bottom };
	};
	const b1 = bar(x1, k * Lb, ACCENT, 'the inner ball\'s bar'), b2 = bar(x2, k * Ls, ACCENT2, 'the shell\'s bar');
	check(near(b1.bottom - b1.top, b2.bottom - b2.top, 1e-9) && near(b1.bottom, b2.top, 1e-9), 'the bars are not equal and opposite');
	S.path([[x1 - ZERO_OUT, C[1]], [x2 + BAR_W + ZERO_OUT, C[1]]], { color: DIM, width: HAIR, layer: 2, what: 'the zero line' });

	// ---- the shares of the mass
	const inner = Math.round(100 * u0 ** 3), outer = 100 - inner;
	check(inner === 66 && outer === 34 && near(u0 ** 3, 2 ** (-3 / 5), 1e-12), 'the shares of the mass are not 66 and 34 per cent');

	// ---- labels
	const L = [];
	const lab = async (src, x, y, ax, ay, color = INK, size) => { const l = await placed(src, x, y, ax, ay, color, size); L.push(l); return l; };
	// the scale
	await lab('0', X(0), y0 + TICK + 2.7, 0.5, 0, DIM, 7.5);
	await lab(`${u0.toFixed(3)}\\,R`, X(u0) - 1.4, y0 + TICK + 2.7, 1, 0, DIM, 7.5);
	await lab('R', X(1) + 1.4, y0 + TICK + 2.7, 0, 0, DIM, 7.5);
	// the bars: names above, shares of the mass beneath, a name for each row at the left
	const yTop = b1.top - 3, yBottom = b2.bottom + 3.5;
	await lab(text('ball'), x1 + BAR_W / 2, yTop, 0.5, 1, INK, 7.5);
	await lab(text('shell'), x2 + BAR_W / 2, yTop, 0.5, 1, INK, 7.5);
	const m1 = await lab(`${inner}\\%`, x1 + BAR_W / 2, yBottom, 0.5, 0, INK, 7.5);
	await lab(`${outer}\\%`, x2 + BAR_W / 2, yBottom, 0.5, 0, INK, 7.5);
	await lab('\\boldsymbol{L}', x1 - ZERO_OUT - 3, (b1.top + C[1]) / 2, 1, 0.5, DIM, 8.5);
	await lab(text('mass'), x1 - ZERO_OUT - 3, (m1.box.t + m1.box.b) / 2, 1, 0.5, DIM, 7.5);

	S.checkAll(L);
	return finish(S, L, [240, 340]);
}
