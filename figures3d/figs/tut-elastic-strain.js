// The tutorial, section 4.3 (tutorial/response/elastic-bodies.md), its first diagram: three small squares of material
// side by side, each with its outline at rest dashed and its deformed outline solid over a pale tint, the deformation
// exaggerated. Left, a shear with the strain table (0, s; s, 0): stretched along the diagonal x = y (orange arrows,
// out at its two corners) and squeezed along the other (blue arrows, in at its corners), at the same area. Middle, a
// change of volume with the table (e, 0; 0, e): grown equally in every direction (orange arrows at the four corners).
// Right, a small rigid turn with the table of d_j u_i (0, -theta; theta, 0): turned anticlockwise and not deformed,
// "no strain". Under each square its table, and a word.
// Exact: each deformed square is the image of the square at rest under exp(A), A the table d_j u_i drawn under it,
// which is the small deformation of that table carried to a finite size without changing its kind: for the shear an
// area-preserving stretch e^s along x = y and squeeze e^-s across it (det = 1, asserted), for the change of volume a
// uniform growth e^e, for the turn a rotation by theta that keeps every distance (asserted); each corner moves along
// a diagonal for the shear and the growth (asserted), and its arrow is drawn along that motion, orange outward and
// blue inward, at one scale in both squares (REACH times the corner's motion). Chosen for the drawing: s = 0.2,
// e = 0.14, theta = 12 degrees, and the arrows' scale.
import { Panel, v3, INK, DIM, ACCENT, ACCENT2 } from '../lib.js';
import { Sheet, ORIGIN, finish, checker, near, placed, DASH } from './tut-vec-lib.js';
import { RING, UNDISTURBED, UNDISTURBED_W, PUSH, PUSH_HEAD, TAIL, arc } from './tut-five-lib.js';
import { TINT } from './tut-gauss-lib.js';

const name = 'tut-elastic-strain';
const check = checker(name);

const A_HALF = 26;                        // half the side of a square at rest, points
const D = 96;                             // from one square's centre to the next
const S = 0.2, E = 0.14, THETA = (12 * Math.PI) / 180;
const REACH = 1.5;                        // an arrow's length per point of its corner's motion
const ARC_OUT = 5.5;                      // the turn's arc, this far outside the corners' circle
const TABLE_GAP = 7.5;                     // from the lowest mark to the tables' tops
const ROW = 6;                            // from the tables' bottoms to the words' tops

const mat = (A, [x, y]) => [A[0][0] * x + A[0][1] * y, A[1][0] * x + A[1][1] * y];
const det = (A) => A[0][0] * A[1][1] - A[0][1] * A[1][0];

const PANELS = [
	{ key: 'shear', A: [[0, S], [S, 0]], F: [[Math.cosh(S), Math.sinh(S)], [Math.sinh(S), Math.cosh(S)]],
		table: 'u_{ij} = \\begin{pmatrix} 0 & s \\\\ s & 0 \\end{pmatrix}', word: 'shear' },
	{ key: 'volume', A: [[E, 0], [0, E]], F: [[Math.exp(E), 0], [0, Math.exp(E)]],
		table: 'u_{ij} = \\begin{pmatrix} e & 0 \\\\ 0 & e \\end{pmatrix}', word: 'change of volume' },
	{ key: 'turn', A: [[0, -THETA], [THETA, 0]], F: [[Math.cos(THETA), -Math.sin(THETA)], [Math.sin(THETA), Math.cos(THETA)]],
		table: '\\partial_ju_i = \\begin{pmatrix} 0 & -\\theta \\\\ \\theta & 0 \\end{pmatrix}', word: 'rigid turn: no strain' }
];

/** exp(A) by its series, to check the closed forms above. */
function expm(A) {
	let term = [[1, 0], [0, 1]], sum = [[1, 0], [0, 1]];
	for (let n = 1; n < 30; n++) {
		term = [[0, 1].map((j) => (term[0][0] * A[0][j] + term[0][1] * A[1][j]) / n), [0, 1].map((j) => (term[1][0] * A[0][j] + term[1][1] * A[1][j]) / n)];
		sum = sum.map((r, i) => r.map((v, j) => v + term[i][j]));
	}
	return sum;
}

export default async function () {
	const P = new Panel({ x: ORIGIN, y: ORIGIN, w: 0, h: 0, scale: 1 });
	const ink = new Sheet(P, name);
	const L = [];
	const corners = [[1, 1], [-1, 1], [-1, -1], [1, -1]];
	const info = [];

	for (const [k, pn] of PANELS.entries()) {
		const c = [(k - 1) * D, 0];
		const ex = expm(pn.A);
		for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) check(near(ex[i][j], pn.F[i][j], 1e-12), `${pn.key}: the map is not exp of its table`);
		// the table's symmetric part is the strain: the turn's is zero, the others' are the table itself
		const sym = [[pn.A[0][0], (pn.A[0][1] + pn.A[1][0]) / 2], [(pn.A[0][1] + pn.A[1][0]) / 2, pn.A[1][1]]];
		const zero = sym.flat().every((v) => near(v, 0, 1e-15));
		check(zero === (pn.key === 'turn'), `${pn.key}: the strain is ${zero ? '' : 'not '}zero`);
		if (pn.key === 'shear') check(near(det(pn.F), 1, 1e-12) && near(pn.A[0][0] + pn.A[1][1], 0, 0), 'the shear changes the area');
		if (pn.key === 'volume') check(det(pn.F) > 1.3 && near(pn.F[0][1], 0, 0), 'the change of volume does not grow the square evenly');

		const at = ([x, y]) => v3(c[0] + x, c[1] + y, 0);
		const rest = corners.map(([x, y]) => [x * A_HALF, y * A_HALF]);
		const moved = rest.map((p) => mat(pn.F, p));
		if (pn.key === 'turn') {
			for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
				const d0 = Math.hypot(rest[i][0] - rest[j][0], rest[i][1] - rest[j][1]), d1 = Math.hypot(moved[i][0] - moved[j][0], moved[i][1] - moved[j][1]);
				check(near(d0, d1, 1e-12), 'the turn changes a distance');
			}
		}
		// the material: the deformed square, tinted, under its solid outline; the square at rest dashed over it
		P.polygon(moved.map(at), { fill: TINT, layer: -2 });
		ink.curve([...moved, moved[0]].map(at), { color: INK, width: RING, layer: 1, what: `${pn.key}: the deformed outline` });
		for (let i = 0; i < 4; i++) ink.line(at(rest[i]), at(rest[(i + 1) % 4]), { color: DIM, width: UNDISTURBED_W, layer: 0.5, dash: UNDISTURBED, what: `${pn.key}: the outline at rest ${i}` });

		// the arrows at the corners of the shear and the growth, along each corner's motion
		if (pn.key !== 'turn') {
			for (let i = 0; i < 4; i++) {
				const d = [moved[i][0] - rest[i][0], moved[i][1] - rest[i][1]], len = Math.hypot(...d);
				const u = [d[0] / len, d[1] / len];
				check(near(Math.abs(u[0]), Math.SQRT1_2, 1e-12) && near(Math.abs(u[1]), Math.SQRT1_2, 1e-12), `${pn.key}: corner ${i} does not move along a diagonal`);
				const out = u[0] * rest[i][0] + u[1] * rest[i][1] > 0;
				const from = [moved[i][0] + u[0] * TAIL, moved[i][1] + u[1] * TAIL];
				const to = [from[0] + u[0] * REACH * len, from[1] + u[1] * REACH * len];
				const a = ink.arrow(at(from), at(to), { color: out ? ACCENT : ACCENT2, width: PUSH, head: PUSH_HEAD, layer: 3, what: `${pn.key}: the arrow at corner ${i}` });
				check(near(a.L, REACH * len, 1e-9), `${pn.key}: an arrow is not at the common scale`);
				info.push({ key: pn.key, i, out, L: a.L });
			}
		} else {
			// the turn: the arc of the upper right corner's path, outside the corners, anticlockwise through theta
			const r = A_HALF * Math.SQRT2 + ARC_OUT;
			const a = arc(ink, at([0, 0]), r, Math.PI / 4, Math.PI / 4 + THETA, { color: DIM, head: 2.6, what: 'the turn\'s arc' });
			L.push(await ink.label('\\theta', ink.at(a.mid), [Math.cos(Math.PI / 4 + THETA / 2), -Math.sin(Math.PI / 4 + THETA / 2)], 2.2, DIM));
			check(near(Math.atan2(moved[0][1], moved[0][0]) - Math.PI / 4, THETA, 1e-12), 'the arc does not span the corner\'s turn');
		}
	}
	// the shear stretches along x = y and squeezes across it; the growth only stretches
	const sh = info.filter((x) => x.key === 'shear');
	check(sh.filter((x) => x.out).map((x) => x.i).join() === '0,2' && sh.filter((x) => !x.out).map((x) => x.i).join() === '1,3', 'the shear is not stretched along x = y');
	check(info.filter((x) => x.key === 'volume').every((x) => x.out), 'the growth has an inward arrow');

	// ---- under each square: its table and a word, on common lines
	const low = Math.max(...ink.marks.flatMap((m) => m.pts.map((p) => p[1] + m.r)));
	const tables = [];
	for (const [k, pn] of PANELS.entries()) tables.push(await placed(pn.table, ink.at(v3((k - 1) * D, 0, 0))[0], low + TABLE_GAP, 0.5, 0, INK));
	const tBottom = Math.max(...tables.map((t) => t.box.b));
	L.push(...tables);
	for (const [k, pn] of PANELS.entries()) L.push(await placed(`\\vphantom{(}\\text{${pn.word}}`, ink.at(v3((k - 1) * D, 0, 0))[0], tBottom + ROW, 0.5, 0, DIM));

	ink.checkAll(L);
	window[name + '-numbers'] = info;
	void DASH;
	return finish(name, P, L, [240, 340]);
}
