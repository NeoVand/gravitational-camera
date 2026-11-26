// The tutorial, section 13.4 (tutorial/what-a-field-keeps/flows-inside.md), its second diagram: what the bracket reads
// of the flow's transform. Drawn in true 3D (an orthographic view, turned and tilted as lib.js's Panel does, as chapter
// 1.1's projector, figs/tut-vec-projector.js, and turned in the picture's plane): one wavevector xi, a long arrow from
// a point, upward and to the right; the plane at right angles to it through the same point, a faint parallelogram. In
// the plane, eta in two positions at a right angle to each other, eta and xi-hat x eta, each as long as xi, solid and
// pale. From the same point the flow's transform J~, an arrow in ink in no plane of the drawing, and its two parts:
// the transverse part, its projection onto the plane, a dashed arrow "read by the bracket of h_+ and h_-"; and the
// longitudinal part, a dashed segment parallel to xi from the transverse part's tip to J~'s, "read by d rho~/dt"; a
// thin dotted line drops from J~'s tip, parallel to the plane, to the foot of the longitudinal part on xi. A
// right-angle mark at the point, between xi and eta. Labels never on the arrows.
// Departures from the diagram's comment: the longitudinal part is drawn from the transverse part's tip, as section 1.1's
// projector draws n (n . xi), not from the point along xi, where it would lie under the arrow xi; the dotted line to
// its foot on xi shows it as the projection onto xi. It carries no head of its own, since its tip is J~'s.
// Exact, for the drawn vectors: xi-hat x eta is the cross product (asserted at right angles to both and as long as
// xi); the two parts are J~'s projections, computed with the projector delta - xi-hat xi-hat (asserted to add up to J~,
// the first in the plane, the second along xi); the dotted line joins J~'s tip to the foot (xi-hat . J~) xi-hat,
// parallel to the transverse part. Schematic: every length and direction, chosen for the drawing (the caption says so).
import { Panel, v3, INK, THREE } from '../lib.js';
import { Sheet, ORIGIN, finish, checker, near, VEC, VEC_HEAD, n2 } from './tut-vec-lib.js';
import { DIM, FAINT } from '../lib.js';
import { chapter, MATTER } from './tut-brackets-lib.js';

const name = 'tut-flow-transverse';
const check = checker(name);

// ---- the drawing -------------------------------------------------------------------------------------------------
// built in a frame where xi is straight up and its plane is level (x right, y up, z toward the viewer), then turned
// in the picture's own plane by ROLL, so that xi leans to the right
export const TILT = 34, TURN = -30, ROLL = -22;    // the view, degrees
const S = 96;                              // points per unit (|xi| = 1)
const ETA_AT = 180;                        // eta's direction in the plane, degrees anticlockwise from x seen from above
const J_IN = [12, 0.9];                    // J~'s transverse part: its direction (degrees, as ETA_AT) and length
const J_ALONG = 0.52;                      // J~'s longitudinal part, along xi-hat
const SPAN = [[-1.02, 1.2], [-1.38, 0.98]];                 // the plane's extent along x and z (floor frame), units
const PLANE_TINT = '#eeebe5';              // the site's neutral tint of the page (drawing.ts THEME)
const PALE = 0.6;                          // eta's stroke
const PART = 0.6, PART_DASH = [2.4, 1.6];  // the two parts
const caption = 'Look first at the two dashed arrows: the bracket of Calderón\'s pair reads the part of the flow\'s transform at right angles to $\\vect\\xi$, one component for each position of $\\vect\\eta$, and the rate of change of the density reads the part along $\\vect\\xi$. The lengths are chosen for the drawing.';

export default async function () {
	const { state } = await chapter(check);
	state(name, 'flow-transverse', caption);
	const P = new Panel({ x: ORIGIN, y: ORIGIN, w: 0, h: 0, scale: S, tilt: TILT, turn: TURN });
	const ink = new Sheet(P, name);
	// the roll: a turn about the line of sight, rot^-1 Rz(ROLL) rot, which turns the picture rigidly
	const roll = P.rot.clone().invert().multiply(new THREE.Matrix4().makeRotationZ((ROLL * Math.PI) / 180)).multiply(P.rot);
	const W = (x, y, z) => v3(x, y, z).applyMatrix4(roll);
	const O = v3(0, 0, 0);
	const xi = W(0, 1, 0);                                  // |xi| = 1, the drawing's unit
	const inPlane = (deg, len = 1) => W(Math.cos((deg * Math.PI) / 180) * len, 0, -Math.sin((deg * Math.PI) / 180) * len);
	const eta = inPlane(ETA_AT), eta2 = xi.clone().cross(eta);
	check(near(xi.length(), 1, 1e-12) && near(eta.dot(xi), 0, 1e-12) && near(eta.length(), 1, 1e-12), 'eta is not at right angles to xi and as long');
	check(near(eta2.dot(xi), 0, 1e-12) && near(eta2.dot(eta), 0, 1e-12) && near(eta2.length(), 1, 1e-12), 'xi-hat x eta');
	const J = inPlane(...J_IN).addScaledVector(xi, J_ALONG);
	// the two parts, by the projector delta - xi-hat xi-hat
	const n = [xi.x, xi.y, xi.z], j = [J.x, J.y, J.z];
	const Pij = [0, 1, 2].map((a) => [0, 1, 2].map((b) => (a === b ? 1 : 0) - n[a] * n[b]));
	const T = v3(...[0, 1, 2].map((a) => Pij[a][0] * j[0] + Pij[a][1] * j[1] + Pij[a][2] * j[2]));
	const Lg = xi.clone().multiplyScalar(xi.dot(J));
	check(T.clone().add(Lg).distanceTo(J) < 1e-12 && near(T.dot(xi), 0, 1e-12) && Lg.clone().cross(xi).length() < 1e-12, 'the two parts');
	check(T.distanceTo(inPlane(...J_IN)) < 1e-12 && near(xi.dot(J), J_ALONG, 1e-12) && J_ALONG < 1, 'the parts are not those chosen');
	// on the page xi leans up and to the right
	{ const [a, b] = [ink.at(O), ink.at(xi)]; check(b[0] > a[0] + 15 && b[1] < a[1] - 50, 'xi does not lean up and to the right'); }

	// ---- the plane: a pale tint, no edge, beneath everything
	const corners = [[0, 0], [1, 0], [1, 1], [0, 1]].map(([a, b]) => W(SPAN[0][a], 0, SPAN[1][b]));
	P.polygon(corners, { fill: PLANE_TINT, layer: -2 });
	ink.mark([...corners, corners[0]].map((p) => ink.at(p)), 0, 'the plane\'s edge');

	/** A dashed line from a to b (world), with a filled head at b if `head`. */
	const dashedArrow = (a, b, what, layer, head = true) => {
		const A = ink.at(a), B = ink.at(b), Ls = Math.hypot(B[0] - A[0], B[1] - A[1]), hd = head ? Math.min(VEC_HEAD, 0.4 * Ls) : 0;
		const u = [(B[0] - A[0]) / Ls, (B[1] - A[1]) / Ls], w = [-u[1], u[0]], hw = 0.36 * hd, base = [B[0] - u[0] * hd, B[1] - u[1] * hd];
		const shaft = Ls - hd * 0.8, k = Math.max(1, Math.round((shaft + PART_DASH[1]) / (PART_DASH[0] + PART_DASH[1]))), f = (shaft + PART_DASH[1]) / (k * (PART_DASH[0] + PART_DASH[1]));
		P.items.push({ kind: 'raw', layer, depth: 0, svg:
			`<path d="M${n2(A[0])},${n2(A[1])}L${n2(A[0] + u[0] * shaft)},${n2(A[1] + u[1] * shaft)}" stroke="${DIM}" stroke-width="${PART}" stroke-dasharray="${n2(PART_DASH[0] * f)} ${n2(PART_DASH[1] * f)}" fill="none"/>` +
			(head ? `<path d="M${n2(B[0])},${n2(B[1])}L${n2(base[0] + w[0] * hw)},${n2(base[1] + w[1] * hw)}L${n2(base[0] - w[0] * hw)},${n2(base[1] - w[1] * hw)}Z" fill="${DIM}"/>` : '') });
		ink.mark([A, B], PART / 2, what);
		if (head) {
			ink.mark([B, [base[0] + w[0] * hw, base[1] + w[1] * hw], [base[0] - w[0] * hw, base[1] - w[1] * hw], B], 0, what + "'s head");
			ink.arrows.push({ L: Ls, head: hd, what });
		}
	};

	// in the plane: eta twice, pale, and the transverse part, dashed
	ink.arrow(O, eta, { color: FAINT, width: PALE, head: VEC_HEAD, layer: 1, what: 'eta' });
	ink.arrow(O, eta2, { color: FAINT, width: PALE, head: VEC_HEAD, layer: 1, what: 'xi x eta' });
	dashedArrow(O, T, 'the transverse part', 1.5);
	// the longitudinal part: from the transverse part's tip to J~'s, along xi; its length marked on xi by a dotted
	// line from J~'s tip, parallel to the plane, to its foot on xi
	dashedArrow(T, J, 'the longitudinal part', 1.5, false);
	ink.dots(J, Lg, { color: DIM, clear0: 2.6, clear1: 1.4, layer: 1, avoid: ['xi'], what: 'the drop to xi' });
	// xi and J~, over everything
	ink.arrow(O, xi, { color: INK, width: VEC, head: VEC_HEAD, layer: 3, what: 'xi' });
	ink.right(O, xi, eta.clone().normalize(), { what: 'the right angle at xi' });
	ink.arrow(O, J, { color: INK, width: VEC, head: VEC_HEAD, layer: 3, what: 'J' });
	ink.dot(O);
	check(Lg.length() < 0.9, 'the foot is not on the drawn xi');

	// ---- labels
	const L = [];
	const at = (p, s) => ink.at(p.clone().multiplyScalar(s));
	const M = (s) => `{\\color{${MATTER}}${s}}`;
	const mid = (p, q) => ink.at(p.clone().add(q).multiplyScalar(0.5));
	L.push(await ink.label('\\boldsymbol\\xi', at(xi, 0.8), [-1, 0], 2.6, INK));
	L.push(await ink.label('\\boldsymbol\\eta', at(eta, 0.7), [0, 1], 2.4, DIM));
	L.push(await ink.label('\\hat{\\boldsymbol\\xi}\\times\\boldsymbol\\eta', at(eta2, 0.75), [-0.3, -1], 2.4, DIM));
	L.push(await ink.label(M('\\tilde{\\mathbf J}'), at(J, 0.6), [-0.6, -0.8], 2.6, INK));
	L.push(await ink.label(`\\begin{array}{l}\\text{read by the bracket}\\\\\\text{of }h_+\\text{ and }h_-\\end{array}`, at(T, 0.4), [-0.25, 1], 2.6, INK));
	L.push(await ink.label(`\\begin{array}{l}\\text{read by}\\\\\\mathrm d${M('\\tilde\\rho')}/\\mathrm dt\\end{array}`, mid(T, J), [1, 0], 2.6, INK));

	ink.checkAll(L);
	window[name + '-numbers'] = { J: [J.x, J.y, J.z], T: [T.x, T.y, T.z], along: xi.dot(J) };
	return finish(name, P, L, [230, 330]);
}
