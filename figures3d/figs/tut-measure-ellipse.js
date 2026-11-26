// The tutorial, section 3.3 (tutorial/noise/measuring-a-number.md), its third diagram: the Fisher ellipse of the depth
// and the mass of one mass. In the units R delta z / z and R delta m / m the chapter's block of the Fisher matrix is
// [[5, -2], [-2, 1]], and the ellipse is the set of steps (delta theta)^T F (delta theta) = 1: the steps that move the
// predicted data by one standard deviation of the noise. Its inverse is [[1, 2], [2, 5]], so the ellipse leans along
// the line where a deeper mass is also heavier, with correlation 2 / sqrt 5 = 0.894. Its shadow on the depth axis
// reaches +-1 (the error with the mass fitted, z / R), from the points (+-1, +-2) where it is tangent to the upright
// lines, and its cut by the depth axis (delta m = 0) reaches +-1/sqrt 5 (the error with the mass known); on the mass
// axis the shadow reaches +-sqrt 5, from (+-2/sqrt 5, +-sqrt 5), and the cut +-1.
// Exact: the ellipse (sampled every quarter of a point), its tangent points and crossings, asserted against the
// inverse matrix and the chapter's numbers (gamma^2 = 4/5, the factor sqrt 5 = 2.24). The two axes are drawn at
// different scales, chosen for the drawing; nothing else is schematic.
import { Sheet, ORIGIN, finish, checker, near, placed } from './tut-pot-lib.js';
import { AXIS, HAIR, TICK } from './tut-pot-lib.js';
import { pathOf, INK, DIM, NOISE, CURVE, LABEL_GAP } from './tut-prob-lib.js';
import { longest } from './tut-measure-lib.js';

const name = 'tut-measure-ellipse';
const check = checker(name);

const F = [[5, -2], [-2, 1]];
const SX = 96, SY = 40;                 // points per unit of R delta z / z, and of R delta m / m
const XR = 1.38, YR = 2.62;             // the axes' reach
const FILL = 0.12;                      // the ellipse's fill: the noise's colour at this opacity
const NUM = 2.4;                        // from a tick's end to its number

export default async function () {
	// ---- the matrix and its inverse
	const det = F[0][0] * F[1][1] - F[0][1] ** 2;
	const C = [[F[1][1] / det, -F[0][1] / det], [-F[1][0] / det, F[0][0] / det]];
	check(near(C[0][0], 1, 1e-15) && near(C[0][1], 2, 1e-15) && near(C[1][1], 5, 1e-15), 'the inverse is not [[1, 2], [2, 5]]');
	const gamma2 = F[0][1] ** 2 / (F[0][0] * F[1][1]);
	check(near(gamma2, 0.8, 1e-15) && Math.sqrt(1 / (1 - gamma2)).toFixed(2) === '2.24', 'gamma^2 is not 4/5');
	const corr = C[0][1] / Math.sqrt(C[0][0] * C[1][1]);
	check(corr.toFixed(2) === '0.89', `the correlation is ${corr}, not 0.89`);
	const q = (x, y) => F[0][0] * x * x + 2 * F[0][1] * x * y + F[1][1] * y * y;
	// the shadows and the cuts
	const shadowX = Math.sqrt(C[0][0]), shadowY = Math.sqrt(C[1][1]);
	const cutX = 1 / Math.sqrt(F[0][0]), cutY = 1 / Math.sqrt(F[1][1]);
	check(near(shadowX, 1, 1e-15) && near(cutX, 1 / Math.sqrt(5), 1e-15) && near(shadowY, Math.sqrt(5), 1e-15) && near(cutY, 1, 1e-15), 'the shadows and cuts are not 1, 1/sqrt 5, sqrt 5 and 1');
	const tanX = [C[0][0] / shadowX, C[1][0] / shadowX];     // where the ellipse reaches farthest along x: (1, 2)
	const tanY = [C[0][1] / shadowY, C[1][1] / shadowY];     // and along y: (2/sqrt 5, sqrt 5)
	check(near(q(...tanX), 1, 1e-12) && near(q(...tanY), 1, 1e-12) && near(q(cutX, 0), 1, 1e-12) && near(q(0, cutY), 1, 1e-12), 'a marked point is not on the ellipse');

	const S = new Sheet(name);
	const O = [ORIGIN, ORIGIN];
	const at = (x, y) => [O[0] + SX * x, O[1] - SY * y];
	const L = [];

	// ---- the ellipse: the unit circle through the Cholesky factor of the inverse, C = A A^T (u = A (cos t, sin t)
	// gives u^T F u = 1), on the page; then every step longer than a fifth of a point halved until none is
	const A = [[Math.sqrt(C[0][0]), 0], [C[1][0] / Math.sqrt(C[0][0]), 0]];
	A[1][1] = Math.sqrt(C[1][1] - A[1][0] ** 2);
	const onPage = (t) => at(A[0][0] * Math.cos(t), A[1][0] * Math.cos(t) + A[1][1] * Math.sin(t));
	let ts = Array.from({ length: 721 }, (_, k) => (2 * Math.PI * k) / 720);
	for (let pass = 0; pass < 12; pass++) {
		const next = [ts[0]];
		for (let k = 1; k < ts.length; k++) {
			const a = onPage(ts[k - 1]), b = onPage(ts[k]);
			if (Math.hypot(b[0] - a[0], b[1] - a[1]) > 0.2) next.push((ts[k - 1] + ts[k]) / 2);
			next.push(ts[k]);
		}
		if (next.length === ts.length) break;
		ts = next;
	}
	const pts = ts.map(onPage);
	check(ts.every((t) => near(q(A[0][0] * Math.cos(t), A[1][0] * Math.cos(t) + A[1][1] * Math.sin(t)), 1, 1e-12)), 'a point is off the ellipse');
	check(longest(pts) <= 0.25, `the ellipse is drawn in steps of ${longest(pts)} pt`);
	S.raw(`<path d="${pathOf(pts)}" fill="${NOISE}" fill-opacity="${FILL}"/>`, 0.5);
	S.path(pts, { color: NOISE, width: CURVE, layer: 2, closed: true, what: 'the ellipse' });

	// ---- the axes through the centre
	S.path([at(-XR, 0), at(XR, 0)], { color: DIM, width: AXIS, layer: 1, cap: 'butt', what: 'the depth axis' });
	S.path([at(0, -YR), at(0, YR)], { color: DIM, width: AXIS, layer: 1, cap: 'butt', what: 'the mass axis' });
	L.push(await placed('\\mathcal R\\,\\delta z/z', at(XR, 0)[0] + 4, O[1], 0, 0.5, DIM));
	L.push(await placed('\\mathcal R\\,\\delta m/m', O[0], at(0, YR)[1] - 4, 0.5, 1, DIM));

	// ---- the shadows: dotted lines from the tangent points to the axes
	for (const s of [1, -1]) {
		S.dots(at(s * tanX[0], s * tanX[1]), at(s * tanX[0], 0), { clear0: 0.9, clear1: 0.6, what: 'the depth shadow\'s guide' });
		S.dots(at(s * tanY[0], s * tanY[1]), at(0, s * tanY[1]), { clear0: 0.9, clear1: 0.6, what: 'the mass shadow\'s guide' });
	}

	// ---- the numbers, on the side away from the ellipse (below the depth axis on the right and above it on the left;
	// left of the mass axis above and right of it below). The shadows get a tick where their dotted guides meet the
	// axis; the cuts need none, since the ellipse itself crosses the axis there, and their numbers stand off along the
	// diagonal that leaves the crossing.
	for (const s of [1, -1]) {
		const neg = s < 0 ? '-' : '';
		// the shadows
		let [x, y] = at(s * shadowX, 0);
		S.path([[x, y], [x, y + s * TICK]], { color: DIM, width: HAIR, layer: 1, cap: 'butt', what: `the depth tick at ${s * shadowX}` });
		L.push(await S.clear(`${neg}1`, x, y + s * (TICK + NUM), 0.5, s > 0 ? 0 : 1, [0, s], { color: DIM, gap: LABEL_GAP }));
		[x, y] = at(0, s * shadowY);
		S.path([[x, y], [x - s * TICK, y]], { color: DIM, width: HAIR, layer: 1, cap: 'butt', what: `the mass tick at ${s * shadowY}` });
		L.push(await S.clear(`${neg}\\sqrt5`, x - s * (TICK + NUM), y, s > 0 ? 1 : 0, 0.5, [-s, 0], { color: DIM, gap: LABEL_GAP }));
		// the cuts
		[x, y] = at(s * cutX, 0);
		L.push(await S.clear(`${neg}1/\\sqrt5`, x + s * 1.2, y + s * NUM, s > 0 ? 0 : 1, s > 0 ? 0 : 1, [s * 0.6, s * 0.8], { color: DIM, gap: LABEL_GAP }));
		[x, y] = at(0, s * cutY);
		L.push(await S.clear(`${neg}1`, x - s * NUM, y - s * 1.2, s > 0 ? 1 : 0, s > 0 ? 1 : 0, [-s * 0.8, -s * 0.6], { color: DIM, gap: LABEL_GAP }));
	}

	S.checkAll(L);
	void INK;
	window.tutMeasureEllipse = { corr, gamma2, tanX, tanY };
	return finish(S, L, [240, 340]);
}
