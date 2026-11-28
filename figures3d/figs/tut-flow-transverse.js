// The tutorial, section 13.4 (tutorial/what-a-field-keeps/flows-inside.md), its second diagram: what the bracket reads
// of the flow's transform. Drawn in true 3D, in an orthographic view from above (lib.js's Panel, tilted down, not
// turned), so that the plane at right angles to the wavevector is a level floor and the wavevector stands upright on
// the page: the floor is a square of the page's neutral tint with a thin edge, its sides parallel to eta and to
// xi-hat x eta, seen as a diamond. One wavevector xi, an arrow in ink straight up from a point O of the floor; its line
// runs on through the floor, dashed (hidden) beneath it, so that xi is seen to pierce the floor; right-angle marks at O
// between xi and each of eta and xi-hat x eta. In the floor, eta and xi-hat x eta, as long as xi, pale solid arrows
// from O, eta toward the front left and xi-hat x eta toward the front right (right-handed: xi x eta). From O the
// flow's transform J~, an arrow in ink that rises out of the floor toward the front right, and its two parts: the
// transverse part, its shadow on the floor, a dashed arrow from O to J~'s foot, "read by the bracket of h_+ and h_-";
// and the longitudinal part, a dashed line from that foot straight up to J~'s tip, parallel to xi, "read by
// d rho~/dt", with a right-angle mark at the foot between it and the floor (on the side of the dotted line to xi-hat x
// eta). Two dotted lines in the floor, parallel to its sides, run from the foot to eta and to xi-hat x eta: the
// transverse part's two components, one for each position of eta. Labels never on the arrows.
// Departures from the diagram's comment: the longitudinal part is drawn from the transverse part's tip, as section 1.1's
// projector draws n (n . xi), not from O along xi, where it would lie under the arrow xi; being parallel to xi and
// upright on the page, it is seen as the part along xi. It carries no head of its own, since its tip is J~'s, and the
// caption calls it the dashed line. The floor is bounded and xi passes through it, so that the eye takes the floor as
// level and xi as at right angles to it (the earlier drawing, turned in the page's plane, left J~ looking as if it lay
// in the plane).
// Exact, for the drawn vectors: xi-hat x eta is the cross product (asserted at right angles to both and as long as
// xi); the two parts are J~'s projections, computed with the projector delta - xi-hat xi-hat (asserted to add up to J~,
// the first in the floor, the second along xi); the dotted lines are parallel to eta and xi-hat x eta and end at the
// transverse part's components on them (asserted); the floor's sides are parallel to eta and xi-hat x eta (asserted);
// J~ lies above the floor (asserted). Schematic: every length and direction, chosen for the drawing (the caption says
// so).
import { Panel, v3 } from '../lib.js';
import { Sheet, ORIGIN, finish, checker, near, VEC, VEC_HEAD, HAIR, RIGHT, n2 } from './tut-vec-lib.js';
import { INK, DIM, FAINT, RULE } from '../lib.js';
import { chapter, MATTER } from './tut-brackets-lib.js';

const name = 'tut-flow-transverse';
const check = checker(name);

// ---- the drawing -------------------------------------------------------------------------------------------------
// world: x right, y up, z toward the viewer; the floor is y = 0, xi is +y
export const TILT = 30, TURN = 0;          // the view, degrees: looking down on the floor
const S = 100;                             // points per unit (|xi| = 1)
const ETA = [-0.6, 0, 0.8];                // eta's direction in the floor: toward the front left
const J_IN = [0.42, 0.8];                  // J~'s transverse part: its components along eta and xi-hat x eta
const J_ALONG = 0.7;                       // J~'s longitudinal part, along xi-hat
const FLOOR = [[-0.6, 1.12], [-0.55, 1.15]]; // the floor's extent along eta and along xi-hat x eta, units
const BELOW = 0.36;                        // how far xi's line runs on under the floor, units
const GROUND = '#eeebe5';                  // the floor's tint: the site's neutral tint of the page (drawing.ts THEME)
const EDGE = 0.4;                          // the floor's edge
const PALE = 0.6;                          // eta's stroke
const PART = 0.65, PART_DASH = [2.4, 1.6]; // the two parts
const HIDDEN = [1.5, 1.5];                 // the dashes of xi's line under the floor
const caption = 'Look first at the two dashed lines: the bracket of Calderón\'s pair reads the part of the flow\'s transform at right angles to $\\vect\\xi$, the dashed arrow in the plane, one component for each position of $\\vect\\eta$, and the rate of change of the density reads the part along $\\vect\\xi$, the dashed line that rises from that arrow\'s tip to the tip of $\\matter{\\tilde{\\vect J}}$. The lengths are chosen for the drawing.';

export default async function () {
	const { state } = await chapter(check);
	state(name, 'flow-transverse', caption);
	const P = new Panel({ x: ORIGIN, y: ORIGIN, w: 0, h: 0, scale: S, tilt: TILT, turn: TURN });
	const ink = new Sheet(P, name);
	const O = v3(0, 0, 0);
	const xi = v3(0, 1, 0);                                  // |xi| = 1, the drawing's unit
	const eta = v3(...ETA).normalize(), eta2 = xi.clone().cross(eta);
	check(near(xi.length(), 1, 1e-12) && near(eta.dot(xi), 0, 1e-12) && near(eta.length(), 1, 1e-12), 'eta is not at right angles to xi and as long');
	check(near(eta2.dot(xi), 0, 1e-12) && near(eta2.dot(eta), 0, 1e-12) && near(eta2.length(), 1, 1e-12), 'xi-hat x eta');
	const inFloor = (a, b) => eta.clone().multiplyScalar(a).addScaledVector(eta2, b);
	const J = inFloor(...J_IN).addScaledVector(xi, J_ALONG);
	// the two parts, by the projector delta - xi-hat xi-hat
	const n = [xi.x, xi.y, xi.z], j = [J.x, J.y, J.z];
	const Pij = [0, 1, 2].map((a) => [0, 1, 2].map((b) => (a === b ? 1 : 0) - n[a] * n[b]));
	const T = v3(...[0, 1, 2].map((a) => Pij[a][0] * j[0] + Pij[a][1] * j[1] + Pij[a][2] * j[2]));
	const Lg = xi.clone().multiplyScalar(xi.dot(J));
	check(T.clone().add(Lg).distanceTo(J) < 1e-12 && near(T.y, 0, 1e-12) && Lg.clone().cross(xi).length() < 1e-12, 'the two parts');
	check(T.distanceTo(inFloor(...J_IN)) < 1e-12 && near(xi.dot(J), J_ALONG, 1e-12) && J.y > 0, 'the parts are not those chosen, or J~ is not above the floor');
	// the transverse part's components, on eta and on xi-hat x eta, inside the drawn arrows
	const c1 = eta.clone().multiplyScalar(T.dot(eta)), c2 = eta2.clone().multiplyScalar(T.dot(eta2));
	check(near(T.dot(eta), J_IN[0], 1e-12) && near(T.dot(eta2), J_IN[1], 1e-12) && J_IN.every((c) => c > 0.15 && c < 0.9), 'the components');
	// on the page xi stands straight up, and J~'s tip is well clear of it
	{
		const [a, b, t] = [ink.at(O), ink.at(xi), ink.at(J)];
		check(near(a[0], b[0], 1e-9) && b[1] < a[1] - 60, 'xi does not stand upright on the page');
		check(t[0] > a[0] + 30, 'J~\'s tip is too near xi');
	}

	// ---- the floor: a square of the page's tint, sides parallel to eta and xi-hat x eta, a thin edge
	const corners = [[0, 0], [1, 0], [1, 1], [0, 1]].map(([a, b]) => inFloor(FLOOR[0][a], FLOOR[1][b]));
	check(corners.every((c, i) => { const d = corners[(i + 1) % 4].clone().sub(c).normalize(); return near(Math.abs(d.dot(i % 2 ? eta2 : eta)), 1, 1e-12); }), 'the floor\'s sides');
	P.polygon(corners, { fill: GROUND, layer: -2 });
	// its edge is not a mark that labels keep clear of: labels may stand on the floor
	P.curve([...corners, corners[0]], { color: RULE, width: EDGE, layer: -1, cap: 'butt' });

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

	// xi's line under the floor, hidden: dashed, pale
	ink.line(O, xi.clone().multiplyScalar(-BELOW), { color: FAINT, width: HAIR + 0.05, layer: -0.5, dash: HIDDEN, what: 'xi under the floor' });
	// in the floor: eta twice, pale, the transverse part's two components, dotted, and the transverse part, dashed
	ink.arrow(O, eta, { color: FAINT, width: PALE, head: VEC_HEAD, layer: 1, what: 'eta' });
	ink.arrow(O, eta2, { color: FAINT, width: PALE, head: VEC_HEAD, layer: 1, what: 'xi x eta' });
	dashedArrow(O, T, 'the transverse part', 1.5);
	ink.dots(T, c1, { color: DIM, clear0: 1.6, clear1: 0.9, layer: 1, avoid: ['eta'], what: 'the component on eta' });
	ink.dots(T, c2, { color: DIM, clear0: 1.6, clear1: 0.9, layer: 1, avoid: ['xi x eta'], what: 'the component on xi x eta' });
	// the longitudinal part: from the transverse part's tip straight up to J~'s, along xi; at right angles to the floor
	dashedArrow(T, J, 'the longitudinal part', 1.5, false);
	ink.right(T, xi, eta.clone().negate(), { side: RIGHT + 1.2, what: 'the right angle at the foot' });
	// xi and J~, over everything
	ink.arrow(O, xi, { color: INK, width: VEC, head: VEC_HEAD, layer: 3, what: 'xi' });
	ink.right(O, xi, eta, { side: RIGHT + 1.2, what: 'the right angle between xi and eta' });
	ink.right(O, xi, eta2, { side: RIGHT + 1.2, what: 'the right angle between xi and xi x eta' });
	ink.arrow(O, J, { color: INK, width: VEC, head: VEC_HEAD, layer: 3, what: 'J' });
	ink.dot(O);

	// ---- labels
	const L = [];
	const at = (p, s) => ink.at(p.clone().multiplyScalar(s));
	const M = (s) => `{\\color{${MATTER}}${s}}`;
	const mid = (p, q) => ink.at(p.clone().add(q).multiplyScalar(0.5));
	L.push(await ink.label('\\boldsymbol\\xi', at(xi, 0.82), [-1, 0], 2.6, INK));
	L.push(await ink.label('\\boldsymbol\\eta', at(eta, 0.72), [-0.3, -1], 2.4, DIM));
	L.push(await ink.label('\\hat{\\boldsymbol\\xi}\\times\\boldsymbol\\eta', at(eta2, 0.97), [0.3, 1], 2.4, DIM));
	L.push(await ink.label(M('\\tilde{\\mathbf J}'), at(J, 0.55), [-0.5, -0.87], 2.6, INK));
	L.push(await ink.label(`\\begin{array}{l}\\text{read by the bracket}\\\\\\text{of }h_+\\text{ and }h_-\\end{array}`, at(T, 0.3), [-0.35, 1], 2.6, INK));
	L.push(await ink.label(`\\begin{array}{l}\\text{read by}\\\\\\mathrm d${M('\\tilde\\rho')}/\\mathrm dt\\end{array}`, mid(T, J), [1, 0], 2.6, INK));

	ink.checkAll(L);
	window[name + '-numbers'] = { J: [J.x, J.y, J.z], T: [T.x, T.y, T.z], along: xi.dot(J) };
	return finish(name, P, L, [230, 330]);
}
