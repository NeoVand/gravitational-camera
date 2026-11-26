// The tutorial, section 4.4 (tutorial/response/viscosity.md), its first diagram: a liquid sheared between two plates,
// seen from the side. The lower plate held still, hatched beneath as section 1.7's wall (figs/tut-ham-phase.js); the
// upper plate sliding to the right at the speed v, its arrow above it. Between them, in the pale tint of the second
// accent, the liquid, and in it five arrows at the heights d/6, 2d/6, ..., 5d/6 whose lengths are v y/d on the scale of
// the plate's arrow, so that they rise evenly from zero at the still plate to v at the moving one; a thin straight line
// joins their tips and runs from the still plate to the tip of v. On the upper plate, a short arrow to the left in the
// first accent, the stress eta v/d with which the liquid holds it back. The gap d by a dimension line at the side.
// Exact: the arrows' lengths in proportion to their heights (asserted, and their tips asserted on the one straight
// line). Schematic: the lengths of the arrows against the gap, the stress's arrow, and the plates' size.
import { Sheet, ORIGIN, finish, checker, placed, near, HAIR, VEC, VEC_HEAD } from './tut-pot-lib.js';
import { pathOf, LABEL_GAP, END, DIM_LINE } from './tut-prob-lib.js';
import { INK, DIM, ACCENT } from './tut-bessel-lib.js';
import { chapter } from './tut-visc-lib.js';

const name = 'tut-visc-plates';
const check = checker(name);

const LIQUID = '#dce7f3';                 // the second accent's pale tint (drawing.ts, THEME)
const SLAB = '#eeebe5';                   // the plates' neutral tint (drawing.ts, THEME)
const W = 220;                            // the plates' length
const PLATE = 5;                          // the plates' thickness
const D = 62;                             // the gap
const N = 6;                              // the gap in sixths: arrows at 1 ... 5 sixths
const V = 104;                            // the speed v, as a length
const X0 = 34;                            // the arrows' tails, from the plates' left end
const ABOVE = 6.5;                        // the arrows on the upper plate, this far above it
const STRESS = 30, STRESS_FROM = 22;      // the stress's arrow: length, and its tail's distance from the right end
const VEL = 0.6;                          // the velocity arrows inside the liquid
const PROFILE = 0.4;                      // the line through their tips
const DIM_OUT = 9;                        // the dimension line, this far left of the plates

export default async function () {
	chapter(check);
	const S = new Sheet(name);
	const L = [];
	const left = ORIGIN - W / 2, right = left + W;
	const yLow = ORIGIN + D / 2, yUp = ORIGIN - D / 2;     // the liquid's lower and upper faces
	const x0 = left + X0;

	// ---- the liquid, and the plates
	S.fill(pathOf([[left, yUp], [right, yUp], [right, yLow], [left, yLow]]), { l: left, r: right, t: yUp, b: yLow }, { color: LIQUID, layer: 0, what: 'the liquid', solid: false });
	for (const [t, what] of [[yUp - PLATE, 'the upper plate'], [yLow, 'the lower plate']]) {
		const d = pathOf([[left, t], [right, t], [right, t + PLATE], [left, t + PLATE]]);
		S.fill(d, { l: left, r: right, t, b: t + PLATE }, { color: SLAB, layer: 1, what });
		S.path([[left, t], [right, t], [right, t + PLATE], [left, t + PLATE]], { color: DIM, width: HAIR, layer: 1.2, closed: true, what: `${what}'s edge` });
	}
	// the lower plate held still: hatched beneath, as section 1.7's wall
	{
		const yb = yLow + PLATE, step = 6.4, k = Math.floor((W - 3) / step) + 1;
		for (let i = 0; i < k; i++) {
			const x = left + 3 + i * step;
			if (x > right) break;
			S.path([[x, yb + 0.3], [x - 3, yb + 3.3]], { color: DIM, width: HAIR, layer: 1, cap: 'butt', what: 'the hatching' });
		}
	}

	// ---- the velocity in the liquid: arrows of length v y/d at y = k d/6
	const tips = [];
	for (let k = 1; k < N; k++) {
		const y = yLow - (k * D) / N, len = (V * k) / N;
		const a = S.arrow([x0, y], [x0 + len, y], { color: INK, width: VEL, head: VEC_HEAD, layer: 3, what: `the velocity at ${k}/6` });
		check(near(a.L, (V * (yLow - y)) / D, 1e-9) && a.head <= 0.4 * a.L + 1e-9, `the arrow at ${k}/6`);
		tips.push([x0 + len, y]);
	}
	// the line through their tips, from the still plate (zero) to the moving one (v)
	const A = [x0, yLow], B = [x0 + V, yUp];
	for (const [x, y] of tips) check(near((x - A[0]) * (B[1] - A[1]) - (y - A[1]) * (B[0] - A[0]), 0, 1e-9), 'a tip is off the line');
	S.path([A, B], { color: DIM, width: PROFILE, layer: 2, cap: 'butt', what: 'the profile' });

	// ---- on the upper plate: v to the right, on the same scale; the stress to the left
	const yA = yUp - PLATE - ABOVE;
	S.arrow([x0, yA], [x0 + V, yA], { color: INK, width: VEC, head: VEC_HEAD, layer: 3, what: 'v' });
	L.push(await placed('v', x0 + V + LABEL_GAP + 0.8, yA, 0, 0.5, INK));
	const sx = right - STRESS_FROM;
	S.arrow([sx, yA], [sx - STRESS, yA], { color: ACCENT, width: VEC, head: VEC_HEAD, layer: 3, what: 'the stress' });
	L.push(await S.clear('\\text{stress } \\eta v/d', sx - STRESS / 2, yA - LABEL_GAP - 1.4, 0.5, 1, [0, -1], { color: ACCENT }));

	// ---- the gap d, at the side
	const xd = left - DIM_OUT;
	S.path([[xd, yUp], [xd, yLow]], { color: DIM, width: DIM_LINE, layer: 1, cap: 'butt', what: 'the gap' });
	for (const y of [yUp, yLow]) S.path([[xd - END, y], [xd + END, y]], { color: DIM, width: DIM_LINE, layer: 1, cap: 'butt', what: 'the gap\'s end' });
	L.push(await placed('d', xd - END - LABEL_GAP, ORIGIN, 1, 0.5, DIM));

	S.checkAll(L);
	return finish(S, L, [240, 340]);
}
