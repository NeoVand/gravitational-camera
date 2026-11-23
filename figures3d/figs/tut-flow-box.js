// The tutorial, chapter 2.8 (tutorial/outside/flows.md), its first diagram: mass flowing through chapter 1.3's small
// box (figs/tut-gauss-box.js, whose box, view and strokes this is). A box with one corner at (x, y, z) and edges
// Delta x, Delta y, Delta z along the axes, drawn in true 3D (the hidden edges dashed), filled with a pale veil of
// matter's colour, the density inside. Its two faces at right angles to the x axis are tinted: the face at x (blue),
// where the mass flux J_x(x) enters, and the face at x + Delta x (orange), where the longer J_x(x + Delta x) leaves.
// Beneath, the same box at two instants, t and t + Delta t, its veil paler at the second: the density inside falls.
// Exact: the box's edges lie along the axes, the flux arrows run along x through the faces' centres and the arrow
// leaving is the longer (asserted), the hidden edges are those that meet at the corner farthest from the viewer; the
// two small boxes are the large one scaled about its centre, seen in the same view (asserted), and the second's veil
// is the paler. Schematic: the box's proportions, the arrows' lengths and the two shades (only their order matters).
import { Panel, v3, INK, DIM, ACCENT, ACCENT2 } from '../lib.js';
import { Sheet, ORIGIN, finish, checker, AXIS, VEC, VEC_HEAD } from './tut-vec-lib.js';
import { TINT_ACCENT, TINT_ACCENT2, EDGE, face, cameraAxes } from './tut-gauss-lib.js';
import { MATTER, checkChapter } from './tut-flow-lib.js';

const DX = 1.35, DY = 1.0, DZ = 0.9;      // the box's edges, units (as tut-gauss-box)
export const J_IN = 0.62, J_OUT = 0.95;    // the flux arrows' lengths, units: J_x(x) and J_x(x + Delta x)
const TILT = 20, TURN = 30;               // the view, degrees (as tut-gauss-box)
const S = 100;                            // points per unit
const VEIL = [0.22, 0.07];                 // the veil's opacity: the large box and the first small one; the second
const SMALL = 0.27;                       // the small boxes, in units of the large one
const BELOW = 1.12;                       // the small boxes' centres beneath the large one's, units on the page
const APART = 0.98;                       // the small boxes' centres apart, units on the page
const name = 'tut-flow-box';
const check = checker(name);

const unit = (x, y) => { const l = Math.hypot(x, y); return [x / l, y / l]; };

export default async function () {
	checkChapter(name);
	const P = new Panel({ x: ORIGIN, y: ORIGIN, w: 0, h: 0, scale: S, tilt: TILT, turn: TURN });
	const ink = new Sheet(P, name);
	// the chapter's axes in the world of three.js (y up): x to the right, y away from the viewer, z up
	const X = v3(1, 0, 0), Y = v3(0, 0, -1), Z = v3(0, 1, 0);
	check(X.clone().cross(Y).distanceTo(Z) < 1e-12, 'the axes are not right-handed');
	const pt = (x, y, z) => X.clone().multiplyScalar(x).addScaledVector(Y, y).addScaledVector(Z, z);
	const centre = pt(DX / 2, DY / 2, DZ / 2);
	P.centre = centre.clone().add(pt((J_OUT - J_IN) / 2, 0, 0));
	const [right, up, toward] = cameraAxes(P);

	/** A box of the large one's shape, scaled by k about its centre and moved by `shift`: its corners, its edges (those
	 * at the corner farthest from the viewer dashed) and its silhouette, veiled in matter's colour. */
	const box = (k, shift, veil, { width = EDGE, hiddenWidth = AXIS * 0.9, dash = [2.2, 1.8], what }) => {
		const corner = (i, j, l) => pt((i - 0.5) * DX * k, (j - 0.5) * DY * k, (l - 0.5) * DZ * k).add(centre).add(shift);
		const V = [];
		for (const i of [0, 1]) for (const j of [0, 1]) for (const l of [0, 1]) V.push({ ijk: [i, j, l], p: corner(i, j, l) });
		const back = V.reduce((a, b) => (b.p.dot(toward) < a.p.dot(toward) ? b : a));
		check(back.ijk.join() === '1,1,0', `${what}: the hidden corner is not the far, low corner at x + Delta x`);
		for (const a of V) for (const b of V) {
			const diff = a.ijk.map((x, m) => b.ijk[m] - x);
			if (diff.filter((x) => x !== 0).length !== 1 || diff.some((x) => x < 0)) continue;
			const hidden = a === back || b === back;
			ink.line(a.p, b.p, { color: INK, width: hidden ? hiddenWidth : width, layer: hidden ? 0 : 1, dash: hidden ? dash : null, what: `${what}: the edge ${a.ijk.join('')}-${b.ijk.join('')}` });
		}
		// the silhouette: the six corners other than the nearest and the farthest, in order round the figure
		const front = V.reduce((a, b) => (b.p.dot(toward) > a.p.dot(toward) ? b : a));
		const rim = V.filter((v) => v !== back && v !== front).map((v) => ({ v, at: ink.at(v.p) }));
		const c = ink.at(centre.clone().add(shift));
		rim.sort((p, q) => Math.atan2(p.at[1] - c[1], p.at[0] - c[0]) - Math.atan2(q.at[1] - c[1], q.at[0] - c[0]));
		P.items.push({ kind: 'raw', layer: -3, depth: 0, svg: `<path d="M${rim.map((r) => r.at.map((v) => v.toFixed(2)).join(',')).join('L')}Z" fill="${MATTER}" fill-opacity="${veil}"/>` });
		return { corner };
	};

	// ---- the box, veiled, with its two faces at right angles to x tinted over the veil
	const { corner } = box(1, v3(0, 0, 0), VEIL[0], { what: 'the box' });
	check(corner(0, 0, 0).distanceTo(pt(0, 0, 0)) < 1e-12 && corner(1, 1, 1).distanceTo(pt(DX, DY, DZ)) < 1e-12, 'the box is not at (x, y, z)');
	const faceAt = (i) => [corner(i, 0, 0), corner(i, 1, 0), corner(i, 1, 1), corner(i, 0, 1)];
	face(ink, faceAt(0), TINT_ACCENT2, -2);
	face(ink, faceAt(1), TINT_ACCENT, -2);

	// ---- the flux: along x through the faces' centres, entering at x and leaving, longer, at x + Delta x
	const c0 = pt(0, DY / 2, DZ / 2), c1 = pt(DX, DY / 2, DZ / 2);
	check(J_OUT > J_IN, 'the flux does not grow from x to x + Delta x');
	const jin = ink.arrow(c0.clone().addScaledVector(X, -J_IN), c0, { color: ACCENT2, width: VEC, head: VEC_HEAD, layer: 3, what: 'J_x(x)' });
	const jout = ink.arrow(c1, c1.clone().addScaledVector(X, J_OUT), { color: ACCENT, width: VEC, head: VEC_HEAD, layer: 3, what: 'J_x(x + Delta x)' });
	check(jout.L > jin.L, 'the arrow leaving is not drawn longer than the arrow entering');

	// ---- the corner (x, y, z)
	const O = corner(0, 0, 0);
	ink.dot(O, { what: 'the corner' });

	// ---- the same box at two instants, beneath: the density inside falls
	check(VEIL[1] < VEIL[0], 'the box\'s veil does not grow paler');
	// side by side on the page, beneath the box
	const instants = [-1, 1].map((s, k) => {
		const shift = up.clone().multiplyScalar(-BELOW).addScaledVector(right, (s * APART) / 2);
		box(SMALL, shift, VEIL[k], { width: 0.45, hiddenWidth: 0.35, dash: [1.4, 1.2], what: `the box at ${k ? 't + Delta t' : 't'}` });
		return centre.clone().add(shift);
	});
	// an arrow from the first instant to the second
	const gap = 0.26;
	ink.arrow(instants[0].clone().addScaledVector(right, gap), instants[1].clone().addScaledVector(right, -gap), { color: DIM, width: AXIS, head: 3.2, layer: 3, what: 'later' });

	// ---- labels
	const sc = (p) => ink.at(p);
	const L = [];
	L.push(await ink.label('(x, y, z)', sc(O), unit(0, 1), 2.2, INK));
	L.push(await ink.label('\\Delta x', sc(pt(DX * 0.5, 0, 0)), unit(0.15, 1), 2.2, INK));
	L.push(await ink.label('\\Delta y', sc(pt(0, DY * 0.5, 0)), unit(-0.6, 1), 2.2, INK));
	L.push(await ink.label('\\Delta z', sc(pt(DX, 0, DZ * 0.3)), unit(1, 0), 2.2, INK));
	L.push(await ink.label('J_x(x)', sc(c0.clone().addScaledVector(X, -J_IN * 0.78)), unit(0, -1), 2.4, MATTER));
	L.push(await ink.label('J_x(x+\\Delta x)', sc(c1.clone().addScaledVector(X, J_OUT * 0.7)), unit(0, 1), 2.4, MATTER));
	// beneath a small box: under its lowest corner, the nearest one
	const sub = (p) => sc(p.clone().add(pt(-DX * SMALL / 2, -DY * SMALL / 2, -DZ * SMALL / 2)));
	L.push(await ink.label('t', sub(instants[0]), unit(0, 1), 2.4, INK));
	L.push(await ink.label('t + \\Delta t', sub(instants[1]), unit(0, 1), 2.4, INK));
	L.push(await ink.label('\\partial\\rho/\\partial t < 0', sc(instants[1].clone().addScaledVector(right, 0.2)), unit(1, 0), 4, MATTER));

	ink.checkAll(L);
	return finish(name, P, L, [240, 340]);
}
