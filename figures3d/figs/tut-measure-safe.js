// The tutorial, section 3.3 (tutorial/noise/measuring-a-number.md), its first diagram: the locked safe as a choice
// between two scenes. Top row: the array's expected readings of one component, E_xz in the chapter's frame (x to the
// right, y up, z toward the scene), with the gold in the left safe (hypothesis A) and in the right (B), and their
// difference, each an 11 x 11 plate of pixels on one diverging scale: orange for a positive reading and blue for a
// negative one, the tint deepening in proportion to the reading up to its deepest at a fifth of sigma_n (SNR = 10);
// each plate named in ink (bold f, as in the text) with, under its name, where the gold is ("gold left", "gold right",
// "difference"). Bottom: the one number that decides, t = e.(y - (f_A + f_B)/2) in units of sigma_n, a unit Gaussian
// about +D/2 when A is true and about -D/2 when B is, D = 1.81 apart, each bell in its hypothesis's colour (A, the left
// safe, orange; B, the right, blue; the capstone, tut-read-iv2-capstone, uses the same) and named with its letter and
// its safe ("A, gold left" on the right-hand bell, since the chapter's t puts A at +D/2); the decision line at t = 0,
// and beyond it on each side the tail in which the rule answers wrongly, P(Z > D/2) = 18.3%, named by an arrow from the
// line.
// Exact: the predictions, computed here by the port of the repository's model (tut-measure-lib.js: read_box of
// reference/gravcam/inversion.py), asserted against the reference's D = 1.8111554511736525, its largest difference
// of one reading (0.186 sigma_n, under a fifth) and one reading of E_xz; the share of D^2 carried by E_xz (82%); the
// bells (sampled every quarter of a point), their centres +-D/2 and the tails' areas, asserted against the 1.81 and
// 18.3% the chapter prints. Schematic: the view of the plates; the tint's scale is the drawing's.
import { Sheet, ORIGIN, finish, checker, near, placed } from './tut-pot-lib.js';
import { gauss, upper, Plot, xAxis, merge, pathOf, INK, DIM, ACCENT, ACCENT2, CURVE, LABEL_GAP, DIM_LINE, END } from './tut-prob-lib.js';
import { View, Regions, plate, DEEP } from './tut-noise-lib.js';
import { safe, graph, longest, PIX, REF_D, REF_MAX_DIFF, REF_XZ_00 } from './tut-measure-lib.js';

const name = 'tut-measure-safe';
const check = checker(name);

export const VMAX = 0.2;                     // sigma_n: the tint is deepest at a fifth of the noise
const TURN = -22, TILT = 40, SCALE = 74;     // the plates' view (section 3.2's) and their side, points
const PITCH = 112;                           // from one plate's centre to the next
const W = 300, H = 84, YMAX = 0.5;           // the bells' chart: t from -4 to 4, density from 0 to 0.5
const TMAX = 4;
const TAIL = 0.24;                           // a tail's fill: its hypothesis's colour at this opacity
const DROW = 0.465;                          // the dimension D, in units of the density
const LINE_TOP = 0.43;                       // the decision line's top
const ROW = 9;                               // the arrows' row, under the numbers
const REACH = 1.7;                           // the arrows' length, in units of sigma_n
const GAP_ROWS = 20;
const AIR = 0.7;                             // the least air between a bell's stroke and the axis's
const SUB_GAP = LABEL_GAP + 0.6;            // from a plate's name to the line under it that says where the gold is

const tint = (v) => (Math.abs(v) < 1e-12 ? null : { color: v > 0 ? ACCENT : ACCENT2, opacity: Math.min(1, Math.abs(v) / VMAX) * DEEP });

export default async function () {
	// ---- the predictions and the chapter's numbers
	const s = safe();
	check(s.N === 605, `${s.N} readings, not 605`);
	check(near(s.D, REF_D, 1e-9), `D is ${s.D}, not the reference's ${REF_D}`);
	check(s.D.toFixed(2) === '1.81', `D is ${s.D}, not 1.81`);
	check(near(s.most, REF_MAX_DIFF, 1e-9) && s.most < 0.2, `the largest difference is ${s.most}, not ${REF_MAX_DIFF}`);
	const half = s.D / 2;
	const perr = upper(half);
	check((100 * perr).toFixed(1) === '18.3' && half.toFixed(3) === '0.906', `P(Z > ${half}) is ${perr}, not 0.183`);
	const fA = s.component(s.A, 'xz'), fB = s.component(s.B, 'xz');
	check(near(-fA[0][0], REF_XZ_00, 1e-9), `E_xz at pixel (0, 0) is ${-fA[0][0]} in the reference's frame, not ${REF_XZ_00}`);
	const diff = fA.map((r, i) => r.map((v, j) => v - fB[i][j]));
	// the left safe reads positive E_xz in the chapter's frame, the right one negative, the mirror image
	check(fA.flat().every((v) => v > 0) && fB.flat().every((v) => v < 0), 'E_xz does not keep one sign on each plate');
	check(fA.every((r, i) => r.every((v, j) => near(v, -fB[PIX - 1 - i][j], 1e-12))), 'the two safes are not mirror images');
	const dxz = Math.sqrt(diff.flat().reduce((a, v) => a + v * v, 0));
	check(near(dxz ** 2 / s.D ** 2, 0.82, 0.005), `E_xz carries ${dxz ** 2 / s.D ** 2} of D^2, not 82%`);
	const top = Math.max(...diff.flat().map(Math.abs));
	check(top < VMAX && Math.max(...fA.flat()) < VMAX, 'a reading passes the deepest tint');

	const S = new Sheet(name);
	const R = new Regions(name);
	const L = [];

	// ---- the three plates
	// each named in ink (its tint is its readings' sign, not a hypothesis's colour), and under the name, where the gold is
	const maps = [
		{ m: fA, src: '\\mathbf f_A', sub: 'gold left', what: 'the left safe\'s plate' },
		{ m: fB, src: '\\mathbf f_B', sub: 'gold right', what: 'the right safe\'s plate' },
		{ m: diff, src: '\\mathbf f_A - \\mathbf f_B', sub: 'difference', what: 'the difference\'s plate' }
	];
	const y0 = ORIGIN - 90;
	const views = maps.map((_, k) => new View({ turn: TURN, tilt: TILT, scale: SCALE, o: [ORIGIN + (k - 1) * PITCH, y0] }));
	maps.forEach((p, k) => plate(S, views[k], R, { n: PIX, tile: (i, j) => tint(p.m[i][j]), what: p.what }));
	const under = (V) => Math.max(...[[-0.5, -0.5, -0.025], [0.5, -0.5, -0.025], [0.5, 0.5, -0.025]].map((q) => V.at(q)[1]));
	const yl = Math.max(...views.map(under)) + LABEL_GAP + 3;
	for (const [k, p] of maps.entries()) {
		const g = await placed(p.src, views[k].at([0, 0])[0], yl, 0.5, 0, INK);
		L.push(g, await placed(`\\text{${p.sub}}`, views[k].at([0, 0])[0], g.box.b + SUB_GAP, 0.5, 0, DIM));
	}

	// ---- the bells
	const base = Math.max(...L.map((l) => l.box.b));
	const P = new Plot({ left: ORIGIN - W / 2, top: base + GAP_ROWS, w: W, h: H, x0: -TMAX, x1: TMAX, y0: 0, y1: YMAX });
	// a bell stops where it comes within AIR points of the axis, so that it never runs along it
	const cut = Math.sqrt(-2 * Math.log((merge(P, CURVE) + (AIR / H) * YMAX) * Math.sqrt(2 * Math.PI)));
	// each hypothesis in its own colour, the same in the capstone (tut-read-iv2-capstone): the left safe's orange, the
	// right's blue. By the chapter's t, A (the gold in the left safe) lies at +D/2, on the right, so each bell is named
	// with its safe as well as its letter.
	const bells = [
		{ c: half, color: ACCENT, src: 'A', name: 'A\\text{, gold left}', tail: [-TMAX, 0], side: 1 },
		{ c: -half, color: ACCENT2, src: 'B', name: 'B\\text{, gold right}', tail: [0, TMAX], side: -1 }
	];
	for (const b of bells) {
		const f = (t) => gauss(t - b.c);
		const a0 = Math.max(-TMAX, b.c - cut), a1 = Math.min(TMAX, b.c + cut);
		const pts = graph(P, f, a0, a1);
		check(longest(pts) <= 0.25 + 1e-9, 'a bell is drawn in steps longer than a quarter of a point');
		check(P.Y(0) - pts[0][1] >= (CURVE + 0.45) / 2 - 1e-9 && P.Y(0) - pts[pts.length - 1][1] >= (CURVE + 0.45) / 2 - 1e-9, 'a bell runs along the axis');
		S.path(pts, { color: b.color, width: CURVE, layer: 2, what: `the bell ${b.src}` });
		// the tail beyond the decision line, under this bell
		const [t0, t1] = b.tail;
		S.raw(`<path d="${pathOf([P.at(t0, 0), ...graph(P, f, t0, t1), P.at(t1, 0)])}" fill="${b.color}" fill-opacity="${TAIL}"/>`, 0.4);
		// the fill runs under the true curve to the chart's end, beyond where the stroke stops short of the axis; what
		// lies beyond the chart is under 1e-4 of the error
		check(near(upper(half) - upper(TMAX + half), perr, 1e-4), 'the filled tail is not the error');
	}
	// the decision line, and the separation of the centres
	S.path([[P.X(0), P.Y(0)], [P.X(0), P.Y(LINE_TOP)]], { color: INK, width: 0.5, layer: 2.5, cap: 'butt', what: 'the decision line' });
	const yd = P.Y(DROW);
	S.path([[P.X(-half), yd], [P.X(half), yd]], { color: INK, width: DIM_LINE, layer: 3, cap: 'butt', what: 'the separation' });
	for (const x of [-half, half]) S.path([[P.X(x), yd - END], [P.X(x), yd + END]], { color: INK, width: DIM_LINE, layer: 3, cap: 'butt', what: 'the separation\'s end' });
	L.push(await placed(`D = ${s.D.toFixed(2)}`, P.X(0), yd - END - LABEL_GAP - 0.4, 0.5, 1, INK));
	// the hypotheses' names, beside their bells' outer flanks
	for (const b of bells) {
		const t = b.c + b.side * 1.25;
		L.push(await S.clear(b.name, P.X(t) + b.side * 2, P.Y(gauss(t - b.c)), b.side > 0 ? 0 : 1, 0.5, [b.side, 0], { color: b.color }));
	}
	// the axis
	const xl = await xAxis(S, P, { ticks: [-4, -2, 0, 2, 4], fmt: (t) => (t < 0 ? `-${-t}` : `${t}`), what: 'the t axis' });
	L.push(...xl);
	const last = xl[xl.length - 1];
	L.push(await placed('t/\\sigma_n', last.box.r + 5, (last.box.t + last.box.b) / 2, 0, 0.5, DIM));
	// the tails' areas: an arrow from the decision line into each tail
	const y1 = Math.max(...xl.map((l) => l.box.b)) + ROW;
	S.path([[P.X(0), y1 - END], [P.X(0), y1 + END]], { color: DIM, width: DIM_LINE, layer: 3, cap: 'butt', what: 'the arrows\' start' });
	for (const b of bells) {
		const dir = -b.side;     // A's error lies at t < 0, B's at t > 0
		const ar = S.arrow([P.X(0) + dir * 0.4, y1], [P.X(dir * REACH), y1], { color: b.color, width: DIM_LINE, head: 3.4, layer: 3, what: `the tail of ${b.src}` });
		L.push(await placed(`${(100 * perr).toFixed(1)}\\%`, ar.B[0] + dir * (LABEL_GAP + 0.6), y1, dir > 0 ? 0 : 1, 0.5, b.color));
	}

	S.checkAll(L);
	R.check(L);
	window.tutMeasureSafe = { D: s.D, perr, most: s.most, shareXZ: dxz ** 2 / s.D ** 2, maxA: Math.max(...fA.flat()), maxDiff: top };
	return finish(S, L, [240, 340]);
}
