// The tutorial, chapter 1.2 (tutorial/newton/field-and-potential.md), its second diagram: the contour map of
// f = x^2 + y^2 and its gradient. Exact: the contours f = 1, 4, 9, 16 and 25, circles of radii 1 to 5 about the
// origin, each one continuous path sampled every few hundredths of a point and broken only for its label; the
// gradient arrows, grad f = (2x, 2y) at points on the circles, drawn at a tenth of their length in the units of the
// axes, so that each runs from its circle at radius r out to 1.2 r (and so never reaches the next circle); among
// them the arrow at (3, 4), (6, 8), of length 10, which is drawn exactly one unit long, with the right angle it
// makes with its circle marked. Chosen: the three directions the arrows are drawn along, those of (3, 4), (-4, 3)
// and (-3, -4); the contours' labels lie along the fourth, that of (4, -3).
import { INK, DIM, ACCENT } from '../lib.js';
import { Sheet, ORIGIN, placed, beside, finish, checker, near, AXIS, AXIS_HEAD, LINE, HAIR, RIGHT, LABEL_GAP, n2 } from './tut-pot-lib.js';

// ---- the mathematics ----------------------------------------------------------------------------------------
export const f = (x, y) => x * x + y * y;
export const grad = (x, y) => [2 * x, 2 * y];
export const LEVELS = [1, 4, 9, 16, 25];
export const SHRINK = 0.1;                      // an arrow is drawn at a tenth of its length
export const POINT = [3, 4];
const RAYS = [[3, 4], [-4, 3], [-3, -4]];      // the directions along which arrows are drawn (through integer points of r = 5)
const LABEL_RAY = [4, -3];                      // and the one along which the contours are labelled

// ---- the drawing (points) -----------------------------------------------------------------------------------
const U = 22.5;                                 // points per unit of x and y
const REACH = 6.15;                             // the axes' ends, units
const ARROW = 0.65;                             // a gradient arrow's stroke
const ARROW_HEAD = 4;                           // its head, or two fifths of the arrow if that is less
const STEP = 0.25;                              // the circles' sampling, points along the curve (a chord this long departs
                                                // from its circle by less than a ten-thousandth of a point)
const name = 'tut-pot-contours';
const check = checker(name);

export default async function () {
	const S = new Sheet(name);
	const at = (x, y) => [ORIGIN + U * x, ORIGIN - U * y];

	// ---- the levels: f = r^2 on the circle of radius r
	for (const c of LEVELS) {
		const r = Math.sqrt(c);
		check(Number.isInteger(r), `the level ${c} is not a square`);
		for (let k = 0; k < 64; k++) {
			const t = (2 * Math.PI * k) / 64;
			check(near(f(r * Math.cos(t), r * Math.sin(t)), c, 1e-12), `the circle of radius ${r} is not the level ${c}`);
		}
	}

	// ---- the contours' labels, centred on their circles along LABEL_RAY; each circle is broken around its label
	const lr = Math.hypot(...LABEL_RAY), lu = [LABEL_RAY[0] / lr, LABEL_RAY[1] / lr];
	const labels = [];
	const circleLabels = [];
	for (const c of LEVELS) {
		const r = Math.sqrt(c);
		const L = await placed(c === 25 ? 'f = 25' : `${c}`, ...at(r * lu[0], r * lu[1]), 0.5, 0.5, INK);
		circleLabels.push(L);
		labels.push(L);
	}
	const toBox = (b, [x, y]) => Math.hypot(Math.max(b.l - x, 0, x - b.r), Math.max(b.t - y, 0, y - b.b));
	LEVELS.forEach((c, i) => {
		const r = Math.sqrt(c), R = r * U;
		const n = Math.ceil((2 * Math.PI * R) / STEP);
		const pts = Array.from({ length: n }, (_, k) => {
			const t = (2 * Math.PI * k) / n;
			return at(r * Math.cos(t), r * Math.sin(t));
		});
		// keep the points clear of every label; there is exactly one gap, around this circle's own label
		const keep = pts.map((p) => labels.every((l) => toBox(l.box, p) >= LABEL_GAP + LINE / 2));
		const runs = keep.reduce((s, k, j) => s + (k && !keep[(j + n - 1) % n] ? 1 : 0), 0);
		check(runs === 1, `the circle f = ${c} is broken ${runs} times`);
		const start = keep.findIndex((k, j) => k && !keep[(j + n - 1) % n]);
		const arc = [];
		for (let j = 0; j < n && keep[(start + j) % n]; j++) arc.push(pts[(start + j) % n]);
		// the gap is the label's own: its middle lies on the label's ray
		const gapMid = pts[(start + arc.length + Math.floor((n - arc.length) / 2)) % n];
		const want = at(r * lu[0], r * lu[1]);
		check(Math.hypot(gapMid[0] - want[0], gapMid[1] - want[1]) < 0.05 * R + 0.5, `the gap in f = ${c} is not at its label`);
		S.path(arc, { color: INK, width: LINE, layer: 1, what: `the contour f = ${c}` });
		void circleLabels[i];
	});

	// ---- the axes
	S.arrow(at(-REACH, 0), at(REACH, 0), { color: DIM, width: AXIS, head: AXIS_HEAD, layer: 0, what: 'the x axis' });
	S.arrow(at(0, -REACH), at(0, REACH), { color: DIM, width: AXIS, head: AXIS_HEAD, layer: 0, what: 'the y axis' });
	labels.push(await beside('x', at(REACH, 0), [1, 0], 2.2, DIM));
	labels.push(await beside('y', at(0, REACH), [0, -1], 2.2, DIM));

	// ---- the gradient arrows: at (x, y) on each circle, along each ray, grad f drawn at a tenth of its length
	const arrows = [];
	for (const [a, b] of RAYS) {
		const len = Math.hypot(a, b), u = [a / len, b / len];
		for (const c of LEVELS) {
			const r = Math.sqrt(c), p = [r * u[0], r * u[1]], g = grad(...p);
			const tip = [p[0] + SHRINK * g[0], p[1] + SHRINK * g[1]];
			// along the radius, outward, at right angles to the circle; 1.2 r from the origin, short of the next circle
			check(near(g[0] * -p[1] + g[1] * p[0], 0, 1e-12) && g[0] * p[0] + g[1] * p[1] > 0, `the arrow at (${p}) is not outward along the radius`);
			check(near(Math.hypot(...tip), 1.2 * r, 1e-12) && (c === 25 || 1.2 * r < r + 1), `the arrow at (${p}) reaches the next circle`);
			arrows.push({ p, g, tip, r, arrow: S.arrow(at(...p), at(...tip), { color: ACCENT, width: ARROW, head: ARROW_HEAD, layer: 2, what: `the arrow at r = ${r}` }) });
		}
	}
	// longer the farther out: in proportion to r
	for (const a of arrows) check(near(a.arrow.L, 2 * SHRINK * a.r * U, 1e-9), 'an arrow is not 2 r / 10 long');

	// ---- the point (3, 4): on f = 25, its arrow (6, 8), of length 10, drawn one unit long
	const P = arrows.find((a) => near(a.p[0], POINT[0], 1e-12) && near(a.p[1], POINT[1], 1e-12));
	check(P && f(...POINT) === 25, '(3, 4) is not on f = 25');
	check(P.g[0] === 6 && P.g[1] === 8 && Math.hypot(...P.g) === 10, 'the gradient at (3, 4) is not (6, 8), of length 10');
	check(near(P.arrow.L, U * 1, 1e-9), 'the arrow at (3, 4) is not one unit long');
	const dot = at(...POINT);
	S.raw(`<circle cx="${n2(dot[0])}" cy="${n2(dot[1])}" r="1.15" fill="${INK}"/>`, 3);
	S.mark([dot], 1.15, 'the point (3, 4)');
	// the right angle between the arrow and the circle, on the side away from the labels
	{
		const rad = [0.6, -0.8], tan = [-0.8, -0.6];          // page directions: outward along the radius, and along the circle (up and left)
		const q0 = [dot[0] + tan[0] * RIGHT, dot[1] + tan[1] * RIGHT];
		const q1 = [q0[0] + rad[0] * RIGHT, q0[1] + rad[1] * RIGHT];
		const q2 = [dot[0] + rad[0] * RIGHT, dot[1] + rad[1] * RIGHT];
		check(near(rad[0] * tan[0] + rad[1] * tan[1], 0, 1e-12), 'the right-angle mark is not square');
		S.path([q0, q1, q2], { color: INK, width: HAIR, layer: 3, cap: 'butt', what: 'the right-angle mark' });
	}
	// the point's label in the right angle between the arrow and the circle, to its right; the arrow's to the right of its tip
	labels.push(await placed('(3,\\ 4)', dot[0] + 8.5, dot[1] - 1.2, 0, 0.5, INK));
	const tip = at(...P.tip);
	labels.push(await placed('\\nabla f = (6,\\ 8)', tip[0] + 3, tip[1], 0, 0.5, ACCENT));

	S.checkAll(labels);
	return finish(S, labels, [240, 300]);
}
