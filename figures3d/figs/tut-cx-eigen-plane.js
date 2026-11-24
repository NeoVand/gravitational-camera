// The tutorial, chapter 9.2 (tutorial/one-point/complex-symmetric.md), its first diagram: where the eigenvalues of a
// reading lie in the complex plane, Re w across and Im w up, for four readings, each on a strip of its own that shares
// one scale across: one mass, two touching dots at 1 and a dot at -2 (in units of GM/r^3); the two masses of the
// paper's fig:stars, dots at -0.537, 0.135 and 0.402 in that figure's units, drawn twice as far out so that they
// spread; the same room read by a pixel moving through it, the same three points, hollow, "unchanged by the motion";
// a spinning body, (1, 1, -2)(1 - 0.1i)^{-3}, two touching dots at 0.941 + 0.290i and a dot at -1.88 - 0.58i on one
// dashed line through 0 at 0.299 rad, with the imaginary axis drawn. "Sum w = 0" at the right of each strip. Ink and
// greys only.
// Departures from the diagram's comment: each strip's label stands above its strip at the left, not beside it, so that
// one drawing about 290 points wide gives the strips the whole width and keeps its text readable on a phone; the
// comment's "(Fig. stars)" prints the paper's figure number, read from paper/main.aux, as the site does, and the
// label says "in its units, x2"; the third strip reads "a pixel moving through that room", since its points are the
// second strip's; the sum is written "Sum w = 0" in the page's dim ink at the size of every label, not smaller, so
// that it stays readable on a phone; the angle 0.299 rad is drawn as an arc from the real axis to the dashed line and
// named; "in units of GM/r^3" stands under the last axis. Two equal eigenvalues are drawn as two dots touching along
// the line they lie on. A tick is left out where a dot covers it or nearly touches it.
// Exact: every point (tut-cxsym-lib.js: the pair's eigenvalues, the roots of eq:cubic, asserted against the chapter's
// -0.537, 0.135, 0.402; the moving pixel's, the roots for Lambda W Lambda^T at 0.6c, asserted equal to the room's;
// the spinning body's from w = -J/I, eq:repeated, asserted against 0.941 + 0.290i and -1.88 - 0.58i, its phase
// 3 arctan 0.1 = 0.299 rad), each at its true place on one scale, the same up as across, so that the dashed line's
// angle on the page is the phase (asserted); each strip's sum zero (asserted). Exaggerated: the spin, a cos theta /
// r = 0.1; the second and third strips' scale, x2 (as their label says).
import { Sheet, ORIGIN, finish, checker, placed, near, LABEL_GAP, AXIS, AXIS_HEAD, HAIR, TICK } from './tut-pot-lib.js';
import { INK, DIM, FAINT, PAGE } from '../lib.js';
import { chapter, cx, scale, argC, absC } from './tut-cxsym-lib.js';

const name = 'tut-cx-eigen-plane';
const check = checker(name);

const U = 56;                              // points per unit, across and up
const X0 = -2.3, X1 = 2.36;                // the real axes, units
const Y0 = -0.76, Y1 = 0.64;               // the imaginary axis, units
const R = 2.1;                             // a point's radius
const HOLLOW = 0.6;                        // a hollow point's outline
const SPREAD = 2;                          // the pair's scale on the page
const LABEL_DROP = 5;                      // a strip's label: its ink's bottom this far above the strip's line
const PITCH = 25;                          // strip line to strip line
const DASH = [2.4, 1.8];                   // the dashed line (tut-vec-lib.js's DASH)
const ARC = 0.42;                          // the arc of the phase, units
const NUM = 2.4;                           // from a tick's end to its number (tut-prob-lib.js)

export default async function () {
	const nums = await chapter(check);
	const S = new Sheet(name);
	const L = [];
	const xs = ORIGIN;                     // the page's x of Re w = 0
	const X = (re) => xs + re * U;
	const aux = await (await fetch('/paper/main.aux')).text();
	const figNo = aux.match(/\\newlabel\{fig:stars\}\{\{(\d+)\}/)?.[1];
	check(figNo === '23', `fig:stars is Figure ${figNo}`);

	const one = [cx(1), cx(1), cx(-2)];
	const strips = [
		{ key: 'one mass', label: '\\text{one mass}', pts: one, double: [0, 1] },
		{ key: 'two masses', label: `\\text{two masses (the paper's Figure ${figNo}), in its units, }{\\times}2`, pts: nums.pairW.map((z) => scale(z, SPREAD)), sum: nums.pairW },
		{ key: 'moving', label: `\\text{a pixel moving through that room: }{\\color{${DIM}}\\text{unchanged by the motion}}`, pts: nums.movedW.map((z) => scale(z, SPREAD)), sum: nums.movedW, hollow: true },
		{ key: 'spinning', label: '\\text{a spinning body (exaggerated)}', pts: nums.spinW, double: [0, 1], plane: true }
	];
	// the drawn points: the computed ones
	check(strips[1].pts.every((z, i) => near(z[0], SPREAD * [-0.537, 0.135, 0.402][i], 5e-4) && z[1] === 0), 'the pair\'s points');
	check(strips[2].pts.every((z, i) => near(z[0], strips[1].pts[i][0], 1e-9) && near(z[1], 0, 1e-9)), 'the moving pixel\'s points are not the pair\'s');
	const phase = argC(nums.spinW[0]);
	check(phase.toFixed(3) === '0.299', `the phase ${phase}`);

	const sumLab = '\\textstyle\\sum w = 0';
	let y = ORIGIN - 90;
	const out = {};
	for (const [k, st] of strips.entries()) {
		const what = `strip ${k + 1}`;
		// each strip's sum is zero: the trace
		const sum = (st.sum ?? st.pts).reduce((s, z) => [s[0] + z[0], s[1] + z[1]], [0, 0]);
		check(absC(sum) < 1e-12, `${what}: the eigenvalues add up to ${sum}`);
		// the label line
		const top = st.plane ? y - Y1 * U - 4 : y;
		const lab = await placed(st.label, X(X0), top - LABEL_DROP, 0, 1, INK);
		const sl = await placed(sumLab, X(X1), top - LABEL_DROP, 1, 1, DIM);
		check(lab.box.r < sl.box.l - 8, `${what}: the label runs into the sum`);
		L.push(lab, sl);

		// the real axis, its ticks (down, left out where a point covers them)
		const pts = st.pts.map((z) => [X(z[0]), y - z[1] * U]);
		// two equal eigenvalues: two dots touching along the line they lie on
		if (st.double) {
			const [i, j] = st.double;
			check(near(st.pts[i][0], st.pts[j][0], 1e-12) && near(st.pts[i][1], st.pts[j][1], 1e-12), `${what}: the double point is not double`);
			const a = argC(st.pts[i]), u = [Math.cos(a), -Math.sin(a)];
			const c = pts[i];
			pts[i] = [c[0] - R * u[0], c[1] - R * u[1]];
			pts[j] = [c[0] + R * u[0], c[1] + R * u[1]];
			check(near(Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1]), 2 * R, 1e-9), `${what}: the two dots do not touch`);
		}
		if (st.plane) {
			S.arrow([X(X0), y], [X(X1), y], { color: DIM, width: AXIS, head: AXIS_HEAD, layer: 1, what: `${what}'s real axis` });
			S.arrow([xs, y - Y0 * U], [xs, y - Y1 * U], { color: DIM, width: AXIS, head: AXIS_HEAD, layer: 1, what: `${what}'s imaginary axis` });
		} else {
			S.path([[X(X0), y], [X(X1) - AXIS_HEAD, y]], { color: DIM, width: AXIS, cap: 'butt', layer: 1, what: `${what}'s line` });
		}
		const ticks = [];
		for (const t of [-2, -1, 0, 1, 2]) {
			if (st.plane && t === 0) continue;
			const x = X(t);
			if (pts.some(([px, py]) => Math.abs(px - x) < R + 2.6 && Math.abs(py - y) < R + TICK)) continue;
			S.path([[x, y], [x, y + TICK]], { color: DIM, width: HAIR, cap: 'butt', layer: 1, what: `${what}'s tick at ${t}` });
			ticks.push(t);
		}
		out[st.key] = { ticks, y };

		if (st.plane) {
			// the imaginary axis's ticks, left, and their numbers
			for (const t of [-0.5, 0.5]) {
				const q = y - t * U;
				S.path([[xs, q], [xs - TICK, q]], { color: DIM, width: HAIR, cap: 'butt', layer: 1, what: `${what}'s tick at ${t}i` });
				L.push(await placed(t < 0 ? '{-}0.5' : '0.5', xs - TICK - NUM, q, 1, 0.5, DIM));
			}
			// the dashed line through 0 at the phase, past both points
			const u = [Math.cos(phase), -Math.sin(phase)];
			const ends = [-1.12 * absC(nums.spinW[2]), 1.24 * absC(nums.spinW[0])];
			const A = [xs + ends[0] * U * u[0], y + ends[0] * U * u[1]], B = [xs + ends[1] * U * u[0], y + ends[1] * U * u[1]];
			check(A[1] < y - Y0 * U - 2 && B[1] > y - Y1 * U + 2, 'the dashed line leaves the imaginary axis\'s range');
			S.path([A, B], { color: FAINT, width: HAIR + 0.1, dash: DASH, cap: 'butt', layer: 1.5, what: 'the dashed line' });
			// every point on it, and its angle on the page the phase
			for (const [px, py] of pts) {
				const d = Math.abs((px - xs) * u[1] - (py - y) * u[0]);
				check(d < 1e-9, `a spinning point is ${d} pt off the dashed line`);
			}
			check(near(Math.atan2(-(B[1] - y), B[0] - xs), phase, 1e-12), 'the dashed line\'s angle on the page is not the phase');
			// the arc of the phase
			const arc = Array.from({ length: 61 }, (_, i) => { const a = (phase * i) / 60; return [xs + ARC * U * Math.cos(a), y - ARC * U * Math.sin(a)]; });
			S.path(arc, { color: DIM, width: HAIR, layer: 1.5, what: 'the arc of the phase' });
			const mid = phase / 2;
			L.push(await S.clear('0.299\\,\\mathrm{rad}', xs + (ARC * U + LABEL_GAP + 1) * Math.cos(mid), y - AXIS / 2 - LABEL_GAP - 0.5, 0, 1, [1, 0], { color: DIM }));
			// the axes' names and the real axis's numbers
			L.push(await placed('\\mathrm{Re}\\,w', X(X1) + LABEL_GAP + 0.4, y, 0, 0.5, DIM));
			L.push(await placed('\\mathrm{Im}\\,w', xs + LABEL_GAP + 1.4, y - Y1 * U + 1, 0, 0.5, DIM));
			let below = y;
			for (const t of ticks) {
				const n = await placed(t < 0 ? `{-}${-t}` : String(t), X(t), y + TICK + NUM, 0.5, 0, DIM);
				L.push(n);
				below = Math.max(below, n.box.b);
			}
			L.push(await placed('0', xs + 2.6, y + 2.6, 0, 0, DIM));
			const lowest = Math.max(below, y - Y0 * U);
			L.push(await placed('\\text{in units of }GM/r^3', xs, lowest + 5, 0.5, 0, DIM));
		}

		// the points, above the lines
		for (const [i, [px, py]] of pts.entries()) {
			if (st.hollow) S.raw(`<circle cx="${px.toFixed(2)}" cy="${py.toFixed(2)}" r="${(R - HOLLOW / 2).toFixed(2)}" fill="${PAGE}" stroke="${INK}" stroke-width="${HOLLOW}"/>`, 3);
			else S.raw(`<circle cx="${px.toFixed(2)}" cy="${py.toFixed(2)}" r="${R}" fill="${INK}"/>`, 3);
			S.mark([[px, py]], R, `${what}'s point ${i + 1}`);
		}
		// the label clears the points (the left end of the strip holds the dot at -2)
		check(lab.box.b < Math.min(...pts.map((p) => p[1])) - R - LABEL_GAP, `${what}: the label reaches its points`);
		y += k === 2 ? PITCH + Y1 * U + 4 : PITCH;
	}
	check(out['one mass'].ticks.join() === '-1,0,2', `the first strip's ticks ${out['one mass'].ticks}`);

	S.checkAll(L);
	window[name + '-numbers'] = { pair: nums.pairW, moved: nums.movedW, spin: nums.spinW, phase };
	return finish(S, L, [260, 340]);
}
