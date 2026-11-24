// The tutorial, chapter 8.1 (tutorial/quantum/states.md), its first diagram: the Mach-Zehnder interferometer and its
// two exits. Left, the instrument seen from above: a thin ink arrow enters from the left along a horizontal line, "L in",
// and meets the first half-silvered mirror (a short thick grey plate at 45 degrees). Path L goes straight on, along the
// bottom, through a light-grey plate, "delay phi", and is turned up by a full mirror (an ink plate, hatched on its
// back); path R is reflected upward and turned right by a second full mirror. The two meet at the second half-silvered
// mirror at the far corner, from which exit L leaves upward and exit R to the right, each into a detector (a flat
// face toward the beam and a rounded back). Right, P_R = cos^2(phi/2) against phi from 0 to 2 pi (an ink line) and
// P_L = sin^2(phi/2) (dashed), pure numbers on the axes, ticks at 0, pi and 2 pi. No orange or blue.
// Departures from the diagram's comment: path L is turned up, not down, by its full mirror, and path R reflected up and
// turned right, which closes the rectangle (the comment's "down" with R "upward" would not meet); the second mirror is
// therefore at the top right. With the chapter's table U, a particle that arrives along L and passes through leaves
// along L (here upward) and one reflected leaves along R (here to the right), as at the first mirror, so the exits are
// named by the same rule as the paths. Small heads on the paths show the way the particle goes.
// Exact: the curves, P_R and P_L from the chapter's boxed result, asserted against |<R|U D U|L>|^2 and |<L|U D U|L>|^2
// by multiplying the tables at many phases (tut-quantum-lib.js, `chapter`), and their sum one at every drawn point.
// Schematic: the instrument's proportions, the mirrors' and the detectors' size, the delay plate's thickness.
import { Sheet, ORIGIN, finish, checker, placed, near, n2, AXIS, HAIR, TICK, LABEL_GAP } from './tut-pot-lib.js';
import { Plot } from './tut-prob-lib.js';
import { graph, longest, CURVE } from './tut-fourier-lib.js';
import { DASH } from './tut-bessel-lib.js';
import { INK, DIM, FAINT } from '../lib.js';
import { chapter, palette, PR, PL, exits, abs2 } from './tut-quantum-lib.js';

const name = 'tut-mach-zehnder';
const check = checker(name);
const TINT = '#eeebe5';                    // a neutral tint of the page (drawing.ts, THEME)

// ---- the instrument (points, y down) ----------------------------------------------------------------------------
const A = 104, B = 66;                     // the rectangle of the paths: across and up
const IN = 40;                             // the entering line's length
const OUT = 30;                            // each exit's length, to its detector's face
const BEAM = 0.55;                         // a path
const PLATE = { len: 15, half: 2.3, full: 1.5 };   // a mirror: its length, and its thickness half-silvered and full
const HATCH = { n: 5, len: 2.1, width: 0.35 };     // the hatching on a full mirror's back
const DELAY = { w: 4.2, h: 14 };           // the delay plate
const DET = { r: 5.2, flat: 0.6 };         // a detector: the radius of its rounded back, the thickness of its face
const HEAD = 3.2;                          // the small heads on the paths
// ---- the plot
const PW = 92, PH = 62;                    // the plot's size
const PLOT_GAP = 30;                       // from the exit R detector's back to the plot's axis

/** A plate centred at c, its long side along the unit vector u, `t` thick: its four corners. */
function plate(c, u, len, t) {
	const n = [-u[1], u[0]];
	return [[1, 1], [-1, 1], [-1, -1], [1, -1]].map(([a, b]) => [c[0] + (a * len * u[0]) / 2 + (b * t * n[0]) / 2, c[1] + (a * len * u[1]) / 2 + (b * t * n[1]) / 2]);
}
const pathOf = (pts) => 'M' + pts.map(([x, y]) => `${n2(x)},${n2(y)}`).join('L') + 'Z';
const boxOfPts = (pts) => ({ l: Math.min(...pts.map((p) => p[0])), r: Math.max(...pts.map((p) => p[0])), t: Math.min(...pts.map((p) => p[1])), b: Math.max(...pts.map((p) => p[1])) });

export default async function () {
	chapter(check);
	await palette(check);
	const S = new Sheet(name);
	const L = [];

	// the corners: the first half-silvered mirror at the bottom left, the second at the top right
	const x0 = ORIGIN - 120, x1 = x0 + A, y1 = ORIGIN + 30, y0 = y1 - B;
	const BS1 = [x0, y1], M1 = [x1, y1], M2 = [x0, y0], BS2 = [x1, y0];
	const diag = [Math.SQRT1_2, -Math.SQRT1_2];                  // "/" on the page: every mirror lies along it
	// every path reflects at a mirror along "/": rightward turns upward and upward turns rightward
	const reflect = (d) => { const k = 2 * (d[0] * diag[0] + d[1] * diag[1]); return [k * diag[0] - d[0], k * diag[1] - d[1]].map((v) => Math.round(v * 1e12) / 1e12); };
	check(reflect([1, 0]).join() === '0,-1' && reflect([0, -1]).join() === '1,0', 'the mirrors do not turn the paths into a rectangle');

	// ---- the paths, under the mirrors
	S.path([[x0 - IN, y1], BS1], { width: BEAM, cap: 'butt', layer: 1, what: 'the entering line' });
	S.path([BS1, M1, BS2], { width: BEAM, cap: 'butt', layer: 1, what: 'path L' });
	S.path([BS1, M2, BS2], { width: BEAM, cap: 'butt', layer: 1, what: 'path R' });
	const exitL = [x1, y0 - OUT], exitR = [x1 + OUT, y0];
	S.path([BS2, exitL], { width: BEAM, cap: 'butt', layer: 1, what: 'exit L' });
	S.path([BS2, exitR], { width: BEAM, cap: 'butt', layer: 1, what: 'exit R' });
	// the entering arrow: its head a little before the mirror; small heads at the middle of the other runs
	const head = (tip, u, what) => {
		const w = [-u[1], u[0]], base = [tip[0] - u[0] * HEAD, tip[1] - u[1] * HEAD], hw = 0.36 * HEAD;
		const tri = [tip, [base[0] + w[0] * hw, base[1] + w[1] * hw], [base[0] - w[0] * hw, base[1] - w[1] * hw]];
		S.fill(pathOf(tri), boxOfPts(tri), { color: INK, layer: 2, what });
		S.mark([...tri, tri[0]], 0, what);
	};
	head([x0 - IN + 0.62 * IN, y1], [1, 0], 'the entering head');
	head([x0 + 0.27 * A + HEAD / 2, y1], [1, 0], 'the head on L');
	head([x1, (y0 + y1) / 2 - HEAD / 2], [0, -1], 'the head on L, up');
	head([x0, (y0 + y1) / 2 - HEAD / 2], [0, -1], 'the head on R');
	head([(x0 + x1) / 2 + HEAD / 2, y0], [1, 0], 'the head on R, across');

	// ---- the mirrors
	const halfSilvered = (c, what) => {
		const pts = plate(c, diag, PLATE.len, PLATE.half);
		S.raw(`<path d="${pathOf(pts)}" fill="${FAINT}" stroke="${DIM}" stroke-width="${HAIR}" stroke-linejoin="round"/>`, 3);
		S.mark([...pts, pts[0]], HAIR / 2, what);
		S.boxes.push({ box: boxOfPts(pts), what });
	};
	// a full mirror: an ink plate, hatched on the side away from the paths (`back`, a unit normal)
	const full = (c, back, what) => {
		const pts = plate(c, diag, PLATE.len, PLATE.full);
		S.raw(`<path d="${pathOf(pts)}" fill="${INK}"/>`, 3);
		let d = '';
		for (let k = 0; k < HATCH.n; k++) {
			const s = (k / (HATCH.n - 1) - 0.5) * (PLATE.len - 2.4);
			const p = [c[0] + diag[0] * s + (back[0] * PLATE.full) / 2, c[1] + diag[1] * s + (back[1] * PLATE.full) / 2];
			// short strokes leaning back along the plate, as on a drawing of a wall
			const q = [p[0] + HATCH.len * (back[0] * 0.8 - diag[0] * 0.6), p[1] + HATCH.len * (back[1] * 0.8 - diag[1] * 0.6)];
			d += `M${n2(p[0])},${n2(p[1])}L${n2(q[0])},${n2(q[1])}`;
			S.mark([p, q], HATCH.width / 2, what + "'s hatching");
		}
		S.raw(`<path d="${d}" stroke="${INK}" stroke-width="${HATCH.width}" stroke-linecap="round" fill="none"/>`, 3);
		S.mark([...pts, pts[0]], 0, what);
		S.boxes.push({ box: boxOfPts(pts), what });
	};
	halfSilvered(BS1, 'the first mirror');
	halfSilvered(BS2, 'the second mirror');
	full(M1, [Math.SQRT1_2, Math.SQRT1_2], 'the mirror on L');        // back toward the bottom right
	full(M2, [-Math.SQRT1_2, -Math.SQRT1_2], 'the mirror on R');      // back toward the top left

	// ---- the delay plate on path L
	const dx = x0 + 0.62 * A;
	{
		const pts = [[dx - DELAY.w / 2, y1 - DELAY.h / 2], [dx + DELAY.w / 2, y1 - DELAY.h / 2], [dx + DELAY.w / 2, y1 + DELAY.h / 2], [dx - DELAY.w / 2, y1 + DELAY.h / 2]];
		S.raw(`<path d="${pathOf(pts)}" fill="${TINT}" fill-opacity="0.92" stroke="${DIM}" stroke-width="${HAIR}"/>`, 3);
		S.mark([...pts, pts[0]], HAIR / 2, 'the delay');
		S.boxes.push({ box: boxOfPts(pts), what: 'the delay' });
	}

	// ---- the detectors: a flat face toward the beam and a rounded back
	const detector = (face, u, what) => {
		const n = [-u[1], u[0]], r = DET.r;
		const a = [face[0] + n[0] * r, face[1] + n[1] * r], b = [face[0] - n[0] * r, face[1] - n[1] * r];
		const a2 = [a[0] + u[0] * DET.flat, a[1] + u[1] * DET.flat], b2 = [b[0] + u[0] * DET.flat, b[1] + u[1] * DET.flat];
		// the body: from the face, a half-disc of radius r behind it
		const sweep = 0;
		const d = `M${n2(a2[0])},${n2(a2[1])}A${r},${r} 0 0,${sweep} ${n2(b2[0])},${n2(b2[1])}Z`;
		S.raw(`<path d="${d}" fill="${TINT}" stroke="${INK}" stroke-width="${AXIS}" stroke-linejoin="round"/>`, 3);
		// the face, a dark bar across the beam
		const f = [a, b, b2, a2];
		S.raw(`<path d="${pathOf(f)}" fill="${INK}"/>`, 3);
		const arc = Array.from({ length: 37 }, (_, k) => { const t = Math.PI / 2 - (k * Math.PI) / 36; return [face[0] + u[0] * DET.flat + r * (u[0] * Math.cos(t) + n[0] * Math.sin(t)), face[1] + u[1] * DET.flat + r * (u[1] * Math.cos(t) + n[1] * Math.sin(t))]; });
		S.mark([a, b], 0, what);
		S.mark(arc, AXIS / 2, what);
		S.boxes.push({ box: boxOfPts([...arc, a, b]), what });
		return arc;
	};
	const arcL = detector(exitL, [0, -1], 'the detector L');
	detector(exitR, [1, 0], 'the detector R');
	// the arc must bulge away from the beam: its middle is r beyond the face
	check(near(Math.min(...arcL.map((p) => p[1])), exitL[1] - DET.flat - DET.r, 1e-9), 'a detector faces the wrong way');

	// ---- the labels of the instrument
	L.push(await S.clear('L\\ \\text{in}', x0 - IN + 3, y1 - BEAM / 2 - LABEL_GAP - 0.3, 0, 1, [0, -1]));
	L.push(await S.clear('L', x0 + 0.27 * A, y1 + BEAM / 2 + LABEL_GAP + 0.3, 0.5, 0, [0, 1]));
	L.push(await S.clear('R', x0 - BEAM / 2 - LABEL_GAP - 0.3, (y0 + y1) / 2 + 4, 1, 0.5, [-1, 0]));
	L.push(await S.clear('\\text{delay } \\phi', dx, y1 - DELAY.h / 2 - LABEL_GAP - 0.3, 0.5, 1, [0, -1]));
	L.push(await S.clear('\\text{exit } L', x1 + DET.r + LABEL_GAP + 0.6, exitL[1] - DET.flat - DET.r / 2, 0, 0.5, [1, 0]));
	L.push(await S.clear('\\text{exit } R', exitR[0] + DET.flat + DET.r / 2, y0 + DET.r + LABEL_GAP + 0.6, 0.5, 0, [0, 1]));

	// ---- the plot: P_R and P_L against phi
	const left = exitR[0] + DET.flat + DET.r + PLOT_GAP;
	const P = new Plot({ left, top: y1 - PH, w: PW, h: PH, x0: 0, x1: 2 * Math.PI, y0: 0, y1: 1 });
	S.path([[P.X(0), P.Y(0)], [P.X(2 * Math.PI), P.Y(0)]], { color: DIM, width: AXIS, cap: 'butt', layer: 1, what: 'the phi axis' });
	S.path([[P.X(0), P.Y(0)], [P.X(0), P.Y(1)]], { color: DIM, width: AXIS, cap: 'butt', layer: 1, what: 'the P axis' });
	for (const [t, src] of [[0, '0'], [Math.PI, '\\pi'], [2 * Math.PI, '2\\pi']]) {
		S.path([[P.X(t), P.Y(0)], [P.X(t), P.Y(0) + TICK]], { color: DIM, width: HAIR, cap: 'butt', layer: 1, what: `the tick ${src}` });
		L.push(await placed(src, P.X(t), P.Y(0) + TICK + 2.4, 0.5, 0, DIM));
	}
	for (const [v, src] of [[0, '0'], [0.5, '1/2'], [1, '1']]) {
		S.path([[P.X(0), P.Y(v)], [P.X(0) - TICK, P.Y(v)]], { color: DIM, width: HAIR, cap: 'butt', layer: 1, what: `the tick ${v}` });
		L.push(await placed(src, P.X(0) - TICK - 2.4, P.Y(v), 1, 0.5, DIM));
	}
	{
		const twoPi = L[L.length - 4].box;                       // the label 2 pi
		L.push(await placed('\\phi', twoPi.r + LABEL_GAP + 1.2, (twoPi.t + twoPi.b) / 2, 0, 0.5, DIM));
	}
	const rPts = graph(P, PR, 0, 2 * Math.PI), lPts = graph(P, PL, 0, 2 * Math.PI);
	check(longest(rPts) <= 0.2501 && longest(lPts) <= 0.2501, 'a curve is too coarse');
	// every drawn point: the boxed result, the tables' product, and P_R + P_L = 1
	for (const pts of [rPts, lPts]) for (const [px] of pts) {
		const phi = ((px - P.left) / P.w) * 2 * Math.PI, c = exits(phi);
		check(Math.abs(abs2(c[1]) - PR(phi)) < 1e-12 && Math.abs(abs2(c[0]) - PL(phi)) < 1e-12 && Math.abs(PR(phi) + PL(phi) - 1) < 1e-12, `the curves at ${phi}`);
	}
	S.path(rPts, { color: INK, width: CURVE, layer: 2, what: 'P_R' });
	// P_L dashed: a whole number of dashes along its length
	{
		let len = 0;
		for (let i = 1; i < lPts.length; i++) len += Math.hypot(lPts[i][0] - lPts[i - 1][0], lPts[i][1] - lPts[i - 1][1]);
		const k = Math.round((len + DASH[1]) / (DASH[0] + DASH[1])), f = (len + DASH[1]) / (k * (DASH[0] + DASH[1]));
		S.path(lPts, { color: INK, width: CURVE, layer: 2, dash: DASH.map((d) => n2(d * f)), cap: 'butt', what: 'P_L' });
	}
	L.push(await S.clear('P_R', P.X(2 * Math.PI) + LABEL_GAP + 0.5, P.Y(1), 0, 0.5, [1, 0]));
	L.push(await S.clear('P_L', P.X(Math.PI), P.Y(1) - CURVE / 2 - LABEL_GAP - 0.3, 0.5, 1, [0, -1]));
	check(near(P.Y(PR(Math.PI)), P.Y(0), 1e-9) && near(P.Y(PR(0)), P.Y(1), 1e-9), 'P_R is not one at 0 and zero at pi');

	S.checkAll(L);
	return finish(S, L, [240, 340]);
}
