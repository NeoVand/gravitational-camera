// The tutorial, section 3.4 (tutorial/noise/symmetric-matrices.md), its second diagram: what a symmetric matrix and a
// shear do to the unit circle. Left, the circle (dashed) and its image under T = [[2, 1], [1, 2]], an ellipse with the
// semi-axes 3 along (1, 1) and 1 along (1, -1). The two unit eigenvectors are drawn as thin arrows on the circle and
// their images as heavier arrows on the ellipse: each image lies on the line of its arrow, the first three times as
// long, the second its own image (eigenvalue 1, where the ellipse touches the circle). Right, the same circle under the
// shear [[1, 1], [0, 1]], an ellipse with the semi-axes 1.62 and 0.62. The pair of perpendicular unit vectors at 58 and
// 148 degrees, which the shear maps onto the axes of its ellipse (its right singular vectors), drawn thin on the
// circle, and their images at 32 and 122 degrees, heavier, on the ellipse: the directions turn on the way. The shear's
// one eigen-direction, (1, 0), in neutral ink, is its own image and is not an axis of the ellipse. Orange marks the
// longer axis of each ellipse and the vector that goes to it, blue the shorter.
// Exact: both ellipses (sampled every fifth of a point), their axes and the angles, from the singular value
// decomposition of each matrix computed here (asserted: 3 and 1 along 45 and -45 degrees; 1.62 and 0.62, the pair at
// 58 and 148 degrees going to 32 and 122 degrees; (1, 0) a fixed direction at 32 degrees from the nearer axis).
// Nothing is schematic.
import { Sheet, ORIGIN, finish, checker, near, placed, AXIS, VEC, VEC_HEAD } from './tut-pot-lib.js';
import { pathOf, INK, DIM, ACCENT, ACCENT2, LABEL_GAP } from './tut-prob-lib.js';
import { longest } from './tut-fourier-lib.js';

const name = 'tut-sym-ellipse';
const check = checker(name);

export const SYM = [[2, 1], [1, 2]];
export const SHEAR = [[1, 1], [0, 1]];
const R = 37;                    // points per unit: the unit circle's radius
const GAP = 30;                  // between the two drawings' inks
const IN = { width: 0.5, head: 3.3 };          // the unit vectors on the circle
const OUT = { width: VEC, head: VEC_HEAD };    // their images on the ellipse
const DASH = [2.2, 1.6];
const NEAR = 0.9;               // points: the circle stops this near the ellipse
const MATRIX_TOP = 2.1;         // the matrices' tops, units of R above the centres

const deg = (r) => (r * 180) / Math.PI;
const mul = (A, [x, y]) => [A[0][0] * x + A[0][1] * y, A[1][0] * x + A[1][1] * y];

/** The singular value decomposition of a 2 x 2 matrix: the eigenvectors of A^T A (closed form), largest first. */
function svd2(A) {
	const a = A[0][0] ** 2 + A[1][0] ** 2, b = A[0][0] * A[0][1] + A[1][0] * A[1][1], d = A[0][1] ** 2 + A[1][1] ** 2;
	const m = (a + d) / 2, r = Math.hypot((a - d) / 2, b);
	const l = [m + r, m - r];
	// the angle of the first eigenvector of [[a, b], [b, d]]: tan 2 phi = 2 b / (a - d)
	const phi = 0.5 * Math.atan2(2 * b, a - d);
	const V = [[Math.cos(phi), Math.sin(phi)], [-Math.sin(phi), Math.cos(phi)]];
	const s = l.map(Math.sqrt);
	const U = V.map((v, i) => mul(A, v).map((x) => x / s[i]));
	return { s, V, U };
}

export default async function () {
	const S = new Sheet(name);
	const L = [];

	// ---- the mathematics
	const sym = svd2(SYM), sh = svd2(SHEAR);
	check(near(sym.s[0], 3, 1e-12) && near(sym.s[1], 1, 1e-12), 'the symmetric matrix\'s semi-axes are not 3 and 1');
	check(near(deg(Math.atan2(sym.V[0][1], sym.V[0][0])), 45, 1e-9) && sym.V.every((v, i) => near(v[0], sym.U[i][0], 1e-12) && near(v[1], sym.U[i][1], 1e-12)), 'the symmetric matrix turns its axes');
	check(near(sh.s[0], (1 + Math.sqrt(5)) / 2, 1e-12) && near(sh.s[1], (Math.sqrt(5) - 1) / 2, 1e-12), 'the shear\'s semi-axes');
	check(sh.s[0].toFixed(2) === '1.62' && sh.s[1].toFixed(2) === '0.62', 'the shear\'s 1.62 and 0.62');
	const ang = (v) => { const a = deg(Math.atan2(v[1], v[0])); return (a + 360) % 180; };
	// the pair on the circle and their images, each direction up to its sign
	const vIn = sh.V.map(ang), uOut = sh.U.map(ang);
	check(Math.round(vIn[0]) === 58 && Math.round(vIn[1]) === 148 && Math.round(uOut[0]) === 32 && Math.round(uOut[1]) === 122, `the shear's pair: ${vIn} to ${uOut}`);
	check(near(sh.V[0][0] * sh.V[1][0] + sh.V[0][1] * sh.V[1][1], 0, 1e-12) && near(sh.U[0][0] * sh.U[1][0] + sh.U[0][1] * sh.U[1][1], 0, 1e-12), 'a pair is not perpendicular');
	// the shear's eigen-direction (1, 0) maps to itself and is not an axis: it lies 32 degrees from the longer one
	check(near(mul(SHEAR, [1, 0])[0], 1, 0) && mul(SHEAR, [1, 0])[1] === 0, '(1, 0) is not fixed');
	check(Math.round(Math.min(uOut[0], 180 - uOut[0])) === 32 && Math.abs(uOut[1] - 90) > 30, '(1, 0) lies on an axis');
	// the shear has the eigenvalue 1 twice: its characteristic polynomial (1 - l)^2
	check(SHEAR[1][0] === 0 && SHEAR[0][0] === 1 && SHEAR[1][1] === 1, 'the shear\'s eigenvalues');

	// ---- the drawings: the circle and the ellipse about a centre, the ellipse as the circle's image, refined until
	// every step on the page is under a fifth of a point
	const drawing = (A, c) => {
		const at = ([x, y]) => [c[0] + R * x, c[1] - R * y];
		const onPage = (t) => at(mul(A, [Math.cos(t), Math.sin(t)]));
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
		const ellipse = ts.map(onPage);
		check(longest(ellipse) <= 0.2 + 1e-9, 'an ellipse is drawn in steps over a fifth of a point');
		// the circle, left out where it runs within NEAR points of the ellipse (where they touch or cross), so that the
		// two curves never ride on one another: the ellipse's radius in the direction phi is 1 / |A^-1 (cos phi, sin phi)|
		const det = A[0][0] * A[1][1] - A[0][1] * A[1][0];
		const inv = [[A[1][1] / det, -A[0][1] / det], [-A[1][0] / det, A[0][0] / det]];
		const runs = [];
		let run = [];
		for (let k = 0; k <= 1440; k++) {
			const p = [Math.cos((2 * Math.PI * k) / 1440), Math.sin((2 * Math.PI * k) / 1440)];
			const r = 1 / Math.hypot(...mul(inv, p));
			if (R * Math.abs(r - 1) >= NEAR) run.push(at(p));
			else if (run.length) { runs.push(run); run = []; }
		}
		if (run.length) runs.push(run);
		// a run that ends at the start joins the one that begins there
		if (runs.length > 1 && R * Math.abs(1 / Math.hypot(...mul(inv, [1, 0])) - 1) >= NEAR) runs[0] = [...runs.pop(), ...runs[0]];
		return { at, ellipse, circle: runs };
	};
	// the widths of the two inks: the ellipses reach sqrt(5) and sqrt(2) across, beyond the unit circle
	const half = [Math.hypot(SYM[0][0], SYM[0][1]), Math.hypot(SHEAR[0][0], SHEAR[0][1])].map((h) => R * Math.max(1, h));
	const xl = ORIGIN - (half[0] + GAP + half[1]) / 2 + half[0], xr = xl + half[0] + GAP + half[1];
	const left = drawing(SYM, [xl, ORIGIN]), right = drawing(SHEAR, [xr, ORIGIN]);
	for (const d of [left, right]) {
		for (const run of d.circle) S.path(run, { color: DIM, width: AXIS, layer: 1, dash: DASH, cap: 'butt', what: 'the circle' });
		S.path(d.ellipse, { color: INK, width: 0.6, layer: 1.5, closed: true, what: 'the ellipse' });
	}
	const O = (d) => d.at([0, 0]);
	const arrow = (d, v, color, style, what) => S.arrow(O(d), d.at(v), { color, width: style.width, head: style.head, layer: style === IN ? 3 : 2.5, what });
	// left: the images first, then the unit vectors over them
	const colors = [ACCENT, ACCENT2];
	sym.V.forEach((v, i) => arrow(left, mul(SYM, v), colors[i], OUT, `T v${i + 1}`));
	sym.V.forEach((v, i) => { if (i === 0) arrow(left, v, colors[i], IN, `v${i + 1}`); });
	// right: the pair on the circle, their images on the ellipse, and the fixed direction
	sh.V.forEach((v, i) => arrow(right, mul(SHEAR, v), colors[i], OUT, `S v${i + 1}`));
	sh.V.forEach((v, i) => arrow(right, v, colors[i], IN, `w${i + 1}`));
	arrow(right, [1, 0], INK, IN, 'the eigen-direction');
	for (const d of [left, right]) S.raw(`<circle cx="${O(d)[0]}" cy="${O(d)[1]}" r="0.9" fill="${INK}"/>`, 4);

	// ---- the matrices, at the upper left of each drawing, their tops level: the left one in the corner that the
	// ellipse leaves empty, the right one over the circle's upper left
	const y0 = ORIGIN - MATRIX_TOP * R;
	L.push(await S.clear('\\begin{pmatrix}2&1\\\\1&2\\end{pmatrix}', O(left)[0] - 1.95 * R, y0, 0.5, 0, [-0.7, -0.7], { color: INK }));
	L.push(await S.clear('\\begin{pmatrix}1&1\\\\0&1\\end{pmatrix}', O(right)[0] - 0.95 * R, y0, 0.5, 0, [-0.7, -0.7], { color: INK }));
	check(Math.abs(L[0].box.t - L[1].box.t) < 1e-6, 'the matrices are not level');

	S.checkAll(L);
	window.tutSymEllipse = { sym: sym.s, shear: sh.s, vIn, uOut };
	return finish(S, L, [240, 340]);
}
