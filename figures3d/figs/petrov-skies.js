// The six Petrov types of a reading, each as a sky around one pixel carrying the reading's four principal null
// directions, the roots of Eq. (stars), m(z)^T W m(z) = 0, mapped to the sky by k(z) (a root lost from the top a
// direction at -z). A sibling of fig:stars (figs/stars.js): the same sky (veil, outline, equator, pixel), the same
// orange dots of 2 pt with a rim in the page's colour, coincident directions as touching dots, those on the far side
// in the colours the veil gives them; the example above each sky, the type under it, as there.
// The readings are the examples of figs/tut-cxsym-lib.js (each sorted into its type by that library's algebraic test,
// and by the pattern of its roots here): I, the two masses of fig:stars (1 : 0.45 at (-1.5, 0.3, 0) and
// (0.9, 1.1, 0.6)), whose directions are asserted equal to the paper's figure data; II, w (1 - 3 z z^T) + c2 m m^T,
// w = 0.125, c2 = 0.05, a mass on the z axis and a wave along +z; D, one mass on the z axis; III, the paper's reading
// with rows (0, 0, 1), (0, 0, i), (1, i, 0), asserted against the paper's text; N, one wave along +z; O, zero.
// Each reading is turned as a whole (R W R^T, which keeps its type) so that every direction lies clear of the sky's
// outline and of its equator, which is asserted: D, II and III with +z to one direction in front, at the lower left,
// the same for the three; N with +z to another, at the lower right; I by fixed angles. The turned readings' roots are
// solved again and asserted equal to the turned directions. (In fig:stars the skies of N, D and I put dots across the
// outline; here they are not that figure's orientations.)
// Schematic: the sizes of the dots, the pixel and the skies; the orientation of each reading; the view (fig:stars's).
import { THREE, Panel, v3, figure, tex, INK, DIM, ACCENT } from '../lib.js';
import { disc, veil, greatCircle } from './stars.js';
import { examples, sort, cx, invariants, speciality } from './tut-cxsym-lib.js';
import { quartic, stars, clusters } from './tut-spin-lib.js';
import { read } from './tut-matrix-w-lib.js';

const name = 'petrov-skies';
const check = (ok, what) => { if (!ok) throw new Error(`${name}: ${what}`); };

const PAGE = '#fffffe', PIXEL = '#868b92';
// fig:stars's view and sky: 31 pt to the unit, turned 25 degrees and tilted 14
const SCALE = 31, TILT = 14, TURN = 25;
// the axis of D, II and III as the reader sees it: (right, up, toward the reader)
const AXIS = [-0.42, -0.42, 0.8];
// the direction of type N's wave as the reader sees it; its arrow's tip short of the dots, and its label off the shaft,
// this far along it
const KN = [0.6, -0.5, 0.62];
const ARROW_CLEAR = 1.2, K_OFF = 1.4, K_AT = 0.72;
// the turn of type I: Euler angles about x, y, z (three.js's order XYZ), degrees
const TURN_I = [240, 0, 40];
const PSI = (150 * Math.PI) / 180;   // E turned this far about A, so that type II's single directions clear the equator
// three columns across the column's width; the rows' baselines (pt from the top)
const W = 246, COL = W / 3;
const HEAD_UP = 8.2;        // from a head's baseline to the top of its sky
const TYPE_DOWN = 10.2;     // from the bottom of a sky to the baseline of its type
const LINE = 9.4;           // between the two lines of a head
const ROW_GAP = 16.5;       // from a row's type baseline to the next row's last head line, less that line
const TOP = 7.4;            // the first head's baseline

// the paper's order of discussion: one wave, one body, two bodies; then type II, type III, and no field
const ORDER = ['N', 'D', 'I', 'II', 'III', 'O'];
const HEADS = {
	N: ['one wave'], D: ['one mass'], I: ['two masses'],
	II: ['a mass and a wave', 'along the line to it'], III: ['rank two, $\\mathcal W^3 = 0$'], O: ['no field']
};

const mat = (rows) => rows.map((r) => r.map((v) => cx(v)));
const apply = (Q, n) => Q.map((r) => r[0] * n[0] + r[1] * n[1] + r[2] * n[2]);
const len = (u) => Math.hypot(...u);
const dist = (a, b) => len(a.map((v, i) => v - b[i]));

/** The rotation taking +z to the unit vector k by the least turn (Rodrigues). */
function zTo(k) {
	const z = [0, 0, 1], c = k[2], a = [z[1] * k[2] - z[2] * k[1], z[2] * k[0] - z[0] * k[2], z[0] * k[1] - z[1] * k[0]];
	const K = [[0, -a[2], a[1]], [a[2], 0, -a[0]], [-a[1], a[0], 0]];
	const K2 = K.map((r) => [0, 1, 2].map((j) => r.reduce((s, v, m) => s + v * K[m][j], 0)));
	return [0, 1, 2].map((i) => [0, 1, 2].map((j) => (i === j ? 1 : 0) + K[i][j] + K2[i][j] / (1 + c)));
}

/** A direction of multiplicity n: n touching dots, as fig:stars draws them (its sizes), with three as a triangle. */
function star(P, p, n) {
	const r = 2.0, s = 1.8;
	const at = { 1: [[0, 0]], 2: [[-s, 0], [s, 0]], 3: [[0, (2 * s) / Math.sqrt(3)], [-s, -s / Math.sqrt(3)], [s, -s / Math.sqrt(3)]], 4: [[-s, s], [s, s], [-s, -s], [s, -s]] }[n];
	for (const o of at) disc(P, p, r, { fill: ACCENT, stroke: PAGE, width: 0.45, offset: o });
	return at.map((o) => o.map((v) => v)).map(([x, y]) => { const q = P.at(p); return [q[0] + x, q[1] - y]; });
}

export default async function () {
	const data = await (await fetch('/reference/results/figures/stars.json')).json();
	const tex = (await (await fetch('/paper/sections/08-one-pixel.tex')).text()).replace(/\s+/g, ' ');
	const ex = examples();

	// ---- the readings, their types and their directions
	check(tex.includes('the reading with rows $(0,0,1)$, $(0,0,i)$, $(1,i,0)$ has both invariants zero, like a single wave, but rank two and $\\mathcal W^3 = 0$: type III'), 'the paper\'s type III reading');
	const ROWS_III = [[cx(0), cx(0), cx(1)], [cx(0), cx(0), cx(0, 1)], [cx(1), cx(0, 1), cx(0)]];
	check(ex.III.every((r, i) => r.every((v, j) => v[0] === ROWS_III[i][j][0] && v[1] === ROWS_III[i][j][1])), 'type III is not the paper\'s rows');
	// D, II and III: +z to the direction A, which the view shows in front, at the lower left, well inside the sky;
	// +x to E, at right angles to it, so that type II's two single directions part across the sky
	const rot = new THREE.Matrix4().makeRotationX(THREE.MathUtils.degToRad(TILT)).multiply(new THREE.Matrix4().makeRotationY(THREE.MathUtils.degToRad(TURN)));
	const inv = rot.clone().invert();
	const world = (c) => { const p = v3(...c).normalize().applyMatrix4(inv); return [p.x, p.y, p.z]; };
	const A = world(AXIS), a0 = v3(...AXIS).normalize();
	const e0 = v3(-a0.y, a0.x, 0).normalize();               // across A on the page, and so at right angles to it
	const E0 = world([e0.x, e0.y, e0.z]);
	const F0 = [A[1] * E0[2] - A[2] * E0[1], A[2] * E0[0] - A[0] * E0[2], A[0] * E0[1] - A[1] * E0[0]];
	const E = E0.map((v, i) => Math.cos(PSI) * v + Math.sin(PSI) * F0[i]), F = F0.map((v, i) => Math.cos(PSI) * v - Math.sin(PSI) * E0[i]);
	const QA = [0, 1, 2].map((i) => [E[i], F[i], A[i]]);
	// N: +z to the direction KN; I: turned by the angles TURN_I (x, y, z, degrees); both so that every direction lies
	// clear of the sky's outline and of its equator
	const QN = zTo(world(KN));
	const m4 = new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(...TURN_I.map((d) => THREE.MathUtils.degToRad(d)))).elements;
	const QI = [0, 1, 2].map((i) => [0, 1, 2].map((j) => m4[j * 4 + i]));
	const turn = { I: QI, II: QA, D: QA, III: QA, N: QN, O: QA };
	const PATTERN = { I: '1111', II: '211', D: '22', III: '31', N: '4', O: '' };
	const skies = {}, raw = {};
	for (const t of ORDER) {
		const Wt = ex[t], Q = turn[t];
		check(sort(Wt).leaf === t, `the example of ${t} sorts as ${sort(Wt).leaf}`);
		check(Math.abs(Q.reduce((s, r, i) => s + r[0] * (Q[(i + 1) % 3][1] * Q[(i + 2) % 3][2] - Q[(i + 1) % 3][2] * Q[(i + 2) % 3][1]), 0) - 1) < 1e-12, `${t}: the turn is not a rotation`);
		if (t === 'O') {
			check(quartic(Wt).every((a) => a[0] === 0 && a[1] === 0), 'the quartic of O is not zero');
			skies[t] = [];
			continue;
		}
		const groups = clusters(stars(Wt), 1e-5);
		check(groups.map((g) => g.count).sort((a, b) => b - a).join('') === PATTERN[t], `${t}: the roots fall as ${groups.map((g) => g.count)}`);
		raw[t] = groups;
		const turned = groups.map((g) => ({ n: apply(Q, g.n), count: g.count }));
		// the turned reading, solved again (a root of multiplicity m found to about 1e-16^(1/m), so 1e-3 for four)
		const Wq = read(mat(Q), Wt), again = clusters(stars(Wq), 1e-3);
		check(sort(Wq).leaf === t, `${t}: the turned reading changes type`);
		check(again.length === turned.length && turned.every((g) => again.some((h) => h.count === g.count && dist(h.n, g.n) < (g.count === 1 ? 1e-9 : 1e-3))), `${t}: the turned reading's directions are not the turned directions`);
		skies[t] = turned;
	}
	// type I: the directions of fig:stars, and its 1 - 6 J^2/I^3 = 0.55
	check(data.gravity.pair.every(([n, c]) => c === 1 && raw.I.some((g) => dist(g.n, n) < 1e-6)), 'type I is not fig:stars\'s pair');
	check(speciality(invariants(ex.I))[0].toFixed(2) === '0.55', 'type I: 1 - 6 J^2/I^3');
	const K = world(KN);
	check(dist(skies.N[0].n, K) < 1e-3 && skies.N[0].count === 4 && dist(raw.N[0].n, [0, 0, 1]) < 1e-3, 'type N is not along its k');
	check(skies.D.every((g) => g.count === 2 && Math.abs(Math.abs(g.n[0] * A[0] + g.n[1] * A[1] + g.n[2] * A[2]) - 1) < 1e-9), 'type D is not on its axis');

	// ---- the drawing
	const panels = [], heads = [];
	const rows = [ORDER.slice(0, 3), ORDER.slice(3)];
	let base = TOP;                                           // the baseline of the row's last head line
	const placed = [];
	rows.forEach((row, ri) => {
		const lines = Math.max(...row.map((t) => HEADS[t].length));
		if (ri > 0) base += (lines - 1) * LINE;
		const top = base + HEAD_UP, cyPt = top + SCALE;      // the sky's top and centre
		row.forEach((t, j) => {
			const h = 2 * SCALE + 2;
			const P = new Panel({ x: j * COL, y: cyPt - h / 2, w: COL, h, cx: 0, cy: 0, scale: SCALE, tilt: TILT, turn: TURN });
			panels.push(P);
			const c = P.at(v3(0, 0, 0));
			check(Math.abs(c[1] - cyPt) < 1e-9 && Math.abs(c[0] - (j + 0.5) * COL) < 1e-9, `${t}: the sky is off its place`);
			veil(P);
			greatCircle(P, v3(0, 1, 0));
			P.sphere(v3(0, 0, 0), 0.055, PIXEL, { spec: 0.5, layer: 3 });
			if (t === 'N') {
				const k = v3(...K);
				// fig:stars's arrow k from the pixel, its tip ARROW_CLEAR short of the cluster of four
				const q = P.at(k), L = dist([...q, 0], [...c, 0]);
				const f = (L - (1.8 * Math.SQRT2 + 2.0 + 0.225) - ARROW_CLEAR) / L;
				P.arrow(v3(0, 0, 0), k.clone().multiplyScalar(f), { color: DIM, width: 0.55, head: 3.4, layer: 2 });
				check(f * L >= 3.4 * 5 / 2, 'N: the arrow\'s head is more than two fifths of it');
				// its label beside the shaft, below the equator
				const u = [(q[0] - c[0]) / L, (q[1] - c[1]) / L], m = [c[0] + u[0] * f * L * K_AT, c[1] + u[1] * f * L * K_AT];
				P.label('\\hat k', [m[0] - u[1] * K_OFF - P.x, m[1] + u[0] * K_OFF - P.y], { size: 7.5, color: DIM, anchor: 'rt' });
			}
			for (const g of skies[t]) {
				const dots = star(P, v3(...g.n), g.count);
				const front = P.cam(v3(...g.n)).z > 0;
				// how far the cluster's outermost dot stays inside the outline (negative: it reaches past it, as the
				// directions near the sky's edge do in fig:stars, whose skies of type N and D are these)
				const rim = SCALE - Math.max(...dots.map((d) => dist([...d, 0], [...c, 0]))) - 2.0 - 0.225;
				// and how far it stays from the equator, in front or behind
				const eq = Array.from({ length: 720 }, (_, m) => P.at(v3(Math.cos((m * Math.PI) / 360), 0, Math.sin((m * Math.PI) / 360))));
				const clear = Math.min(...dots.flatMap((d) => eq.map((q) => dist([...d, 0], [...q, 0])))) - 2.0 - 0.225;
				check(clear >= 1.5 && rim >= 1.5, `${t}: a direction is ${clear.toFixed(2)} pt from the equator and ${rim.toFixed(2)} pt from the outline`);
				placed.push({ t, n: g.n, count: g.count, front, dots, rim, clear });
			}
			const x = (j + 0.5) * COL;
			HEADS[t].forEach((s, m) => heads.push(tex2(s, [x, base - (HEADS[t].length - 1 - m) * LINE], 8, 'cB')));
			heads.push(tex2(`type ${t}`, [x, cyPt + SCALE + TYPE_DOWN], 7.5, 'cB', DIM));
		});
		base = cyPt + SCALE + TYPE_DOWN + ROW_GAP;
	});
	// no two directions of one sky touch on the page
	for (const a of placed) for (const b of placed) if (a !== b && a.t === b.t) {
		const least = Math.min(...a.dots.flatMap((p) => b.dots.map((q) => dist([...p, 0], [...q, 0]))));
		check(least >= 2 * 2.0 + 0.45 + 1.5, `${a.t}: two directions crowd each other (${least.toFixed(2)} pt)`);
	}
	window[name + '-numbers'] = placed.map(({ t, n, count, front, rim, clear }) => ({ t, n, count, front, rim, clear }));
	const H = base - ROW_GAP + 2.2 + 1.9;                      // the last type's descender, then the top's margin again
	return figure(W, +H.toFixed(2), panels, heads);
}

/** A label: text, with math between dollars. */
function tex2(s, at, size, anchor, color = INK) {
	const src = s.split('$').map((p, i) => (i % 2 ? p : p ? `\\text{${p}}` : '')).join('');
	return tex(src, at, size, anchor, color);
}
