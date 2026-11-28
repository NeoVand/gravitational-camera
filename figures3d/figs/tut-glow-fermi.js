// The tutorial, section 10.3 (tutorial/glow/why-matter-barely-glows.md), its second diagram: a sheared Fermi sea and its
// relaxation. Three small panels in a row, each in the plane (k_x, k_y) with its two axes through the centre. Left,
// "at rest": the filled Fermi disc of radius k_F in a pale tint of matter's colour (tut-glow-lib.js FILL), the dashed circle of the lowest states on its
// edge. Middle, "just after a sudden shear": the same electrons, the image of the disc under 1 - u for the strain u_xy,
// an ellipse squeezed along k_x = k_y and stretched along k_x = -k_y, outlined in matter's colour, with the dashed
// circle still drawn; the bulge along k_x = -k_y marked "delta E > 0", the hollow along k_x = k_y "delta E < 0".
// Right, "collisions, time tau": the disc round again, with four curved arrows, each from a bulge (outside the dashed
// circle) into a hollow beside it (inside the circle). Matter's colour for the electrons; ink and the page's greys for
// the rest; no orange or blue.
// Departures from the diagram's comment: each panel is named under it, the third "collisions, time tau", which names its
// arrows too; the axes and k_F are named in the left panel only, and there too, once, the tint and the dashed circle,
// "occupied" by a grey leader ending in a dot inside the tint and "lowest states" by one ending on the circle, so that
// the middle panel's bulge and hollow read as occupied states above and below the lowest; each bulge sends an arrow
// into both hollows beside it, so that the picture keeps the shear's mirror symmetries; the ellipse keeps the disc's
// area, as a shear keeps the number of electrons; the panels stay in a row on a phone, the figure being one drawing.
// Exact: the signs (delta E = -4 E_F n_x n_y u_xy, lowered along k_x = k_y, asserted in tut-glow-lib.js), the ellipse's
// axes along the diagonals and its area, and each arrow's ends (outside the circle and inside the bulge, inside the
// circle and outside the hollow, from raised to lowered states). Exaggerated, as the caption says: the distortion.
import { Sheet, ORIGIN, finish, checker, placed, boxOf, LABEL_GAP, AXIS, AXIS_HEAD, HAIR, SIZE, n2 } from './tut-pot-lib.js';
import { pathOf } from './tut-prob-lib.js';
import { tex, INK, DIM } from '../lib.js';
import { chapter, palette, near, FILL, MATTER } from './tut-glow-lib.js';

const name = 'tut-glow-fermi';
const check = checker(name);

// ---- the drawing (points) ----------------------------------------------------------------------------------------
const KF = 27;                                  // the disc's radius
const PITCH = 104;                              // from one panel's centre to the next
const REACH = 41;                               // the axes' half-length
const U = 0.2;                                  // the strain, exaggerated: the map 1 - u, u = [[0, U], [U, 0]] ...
const DASHES = [2.4, 2], DASH_W = 0.5;
const EDGE = 0.55;                              // the ellipse's outline
const LEAD_DOT = 0.9;                           // the dot at the end of the leader into the tint
const LEADS = { x: 33, y: 33, tint: (150 * Math.PI) / 180, edge: (215 * Math.PI) / 180 };   // the two names' right ends (left of and above or below the centre) and their leaders' ends
const ARC = { out: 1.13, in: 0.86, from: 14, to: 74, width: 0.55, head: 3.2 };   // the arrows: their ends' radii (k_F) and angles off the bulge
const caption = 'Look first at the middle panel: a sudden shear raises the energy of electrons moving along one diagonal and lowers it along the other, so the occupied states are no longer the lowest. Collisions move electrons from the raised states to the lowered ones in a time $\\tau$, and the energy they release is the stiffness that relaxes. The distortion is exaggerated.';

export default async function () {
	const { state } = await chapter(check);
	await palette(check);
	state(name, 'glow-fermi', caption);

	// ---- the sheared sea: the image of the disc under 1 - u, rescaled to keep its area (... at constant volume)
	const s = 1 / Math.sqrt((1 - U) * (1 + U));
	const map = ([x, y]) => [s * (x - U * y), s * (y - U * x)];
	const diag = [Math.SQRT1_2, Math.SQRT1_2], anti = [Math.SQRT1_2, -Math.SQRT1_2];
	{
		const a = map(diag), b = map(anti);
		check(near(Math.hypot(...a), s * (1 - U), 1e-15) && near(a[0], a[1], 1e-15), 'the ellipse is not squeezed along k_x = k_y');
		check(near(Math.hypot(...b), s * (1 + U), 1e-15) && near(b[0], -b[1], 1e-15), 'the ellipse is not stretched along k_x = -k_y');
		check(near(s * (1 - U) * s * (1 + U), 1, 1e-15), 'the ellipse does not keep the disc\'s area');
	}

	const S = new Sheet(name);
	const L = [];
	const centres = [-1, 0, 1].map((k) => [ORIGIN + k * PITCH, ORIGIN]);
	const page = ([x, y], c) => [c[0] + KF * x, c[1] - KF * y];        // k (units of k_F) to the page, k_y up
	const circle = (c, r = 1) => Array.from({ length: 721 }, (_, i) => page([r * Math.cos((i * Math.PI) / 360), r * Math.sin((i * Math.PI) / 360)], c));

	/** The dashed circle of the lowest states, a whole number of dashes. */
	const dashed = (c, what) => {
		const len = 2 * Math.PI * KF, n = Math.round(len / (DASHES[0] + DASHES[1])), f = len / (n * (DASHES[0] + DASHES[1]));
		S.raw(`<circle cx="${n2(c[0])}" cy="${n2(c[1])}" r="${KF}" fill="none" stroke="${DIM}" stroke-width="${DASH_W}" stroke-dasharray="${n2(DASHES[0] * f)} ${n2(DASHES[1] * f)}" transform="rotate(-90 ${n2(c[0])} ${n2(c[1])})"/>`, 2);
		S.mark(circle(c), DASH_W / 2, what);
	};
	/** The axes through the centre: thin, with small heads. */
	const axes = (c, k) => {
		S.arrow([c[0] - REACH, c[1]], [c[0] + REACH, c[1]], { color: DIM, width: AXIS, head: AXIS_HEAD, layer: 1, what: `the k_x axis ${k}` });
		S.arrow([c[0], c[1] + REACH], [c[0], c[1] - REACH], { color: DIM, width: AXIS, head: AXIS_HEAD, layer: 1, what: `the k_y axis ${k}` });
	};

	// ---- left: at rest
	{
		const c = centres[0];
		S.raw(`<path d="${pathOf(circle(c))}" fill="${FILL}"/>`, 0.5);
		axes(c, 0);
		dashed(c, 'the lowest states, left');
		// the radius k_F, along the lower right, named beside it
		const t = (-35 * Math.PI) / 180, e = page([Math.cos(t), Math.sin(t)], c);
		S.path([c, e], { color: INK, width: HAIR, layer: 2, cap: 'butt', what: 'the radius' });
		L.push({ ...(await S.clear('k_F', (c[0] + e[0]) / 2 + 1.5, (c[1] + e[1]) / 2 + 1.5, 0, 0, [0.57, 0.82])), on: [] });
		L.push(await placed('k_x', c[0] + REACH + LABEL_GAP, c[1], 0, 0.5, DIM));
		L.push(await placed('k_y', c[0], c[1] - REACH - LABEL_GAP, 0.5, 1, DIM));
		// the tint and the dashed circle named once, at the left, each by a leader: "occupied" into the tint at the upper
		// left, "lowest states" to the circle at the lower left
		const leader = async (src, end, at) => {
			const g = await placed(src, at[0], at[1], 1, 0.5, INK);
			const from = [g.box.r + LABEL_GAP + HAIR / 2 + 0.1, at[1]];
			S.path([from, end], { color: DIM, width: HAIR, layer: 2.5, cap: 'butt', what: `the leader of ${src}` });
			return g;
		};
		// a small dot ends the leader that points into the tint, so that it is not read as a second radius
		const inTint = page([0.55 * Math.cos(LEADS.tint), 0.55 * Math.sin(LEADS.tint)], c);
		const onEdge = page([Math.cos(LEADS.edge) * (1 + DASH_W / 2 / KF), Math.sin(LEADS.edge) * (1 + DASH_W / 2 / KF)], c);
		L.push(await leader('\\text{occupied}', inTint, [c[0] - LEADS.x, c[1] - LEADS.y]));
		S.raw(`<circle cx="${n2(inTint[0])}" cy="${n2(inTint[1])}" r="${LEAD_DOT}" fill="${DIM}"/>`, 2.5);
		S.mark([inTint], LEAD_DOT, 'the dot of the leader of occupied');
		L.push(await leader('\\text{lowest states}', onEdge, [c[0] - LEADS.x, c[1] + LEADS.y]));
	}
	// ---- middle: just after the shear
	{
		const c = centres[1];
		const ell = Array.from({ length: 721 }, (_, i) => page(map([Math.cos((i * Math.PI) / 360), Math.sin((i * Math.PI) / 360)]), c));
		S.raw(`<path d="${pathOf(ell)}" fill="${FILL}"/>`, 0.5);
		S.path(ell, { color: MATTER, width: EDGE, layer: 1.6, what: 'the ellipse' });
		axes(c, 1);
		dashed(c, 'the lowest states, middle');
		// the names: the hollow on k_x = k_y (upper right), the bulge on k_x = -k_y (upper left), each just outside
		const hollow = page([Math.SQRT1_2 * 1.02, Math.SQRT1_2 * 1.02], c), bulge = page(map([-Math.SQRT1_2, Math.SQRT1_2]), c);
		L.push(await S.clear('\\delta E < 0', hollow[0] + 1, hollow[1] - 1, 0, 1, [0.707, -0.707]));
		L.push(await S.clear('\\delta E > 0', bulge[0] - 1, bulge[1] - 1, 1, 1, [-0.707, -0.707]));
	}
	// ---- right: relaxed, with the collisions' arrows outside the disc
	{
		const c = centres[2];
		S.raw(`<path d="${pathOf(circle(c))}" fill="${FILL}"/>`, 0.5);
		axes(c, 2);
		dashed(c, 'the lowest states, right');
		// from each bulge (135 and 315 deg) into each hollow beside it (45 and 225 deg): spirals that start outside the
		// circle of the lowest states, where the bulge stood, and end inside it, where the hollow was
		const rad = (d) => (d * Math.PI) / 180;
		for (const b of [135, 315]) for (const sgn of [-1, 1]) {
			const a0 = rad(b + sgn * ARC.from), a1 = rad(b + sgn * ARC.to);
			const r = (t) => ARC.out + (ARC.in - ARC.out) * ((t - a0) / (a1 - a0));
			const at = (t) => page([r(t) * Math.cos(t), r(t) * Math.sin(t)], c);
			const pts = Array.from({ length: 481 }, (_, i) => at(a0 + ((a1 - a0) * i) / 480));
			const tip = pts[pts.length - 1];
			let k = pts.length - 1;
			while (k > 0 && Math.hypot(pts[k][0] - tip[0], pts[k][1] - tip[1]) < ARC.head) k--;
			const base = pts[k], d = [tip[0] - base[0], tip[1] - base[1]], l = Math.hypot(...d), u = [d[0] / l, d[1] / l], w = [-u[1], u[0]], hw = 0.36 * l;
			S.path([...pts.slice(0, k + 1), [base[0] + 0.2 * l * u[0], base[1] + 0.2 * l * u[1]]], { color: INK, width: ARC.width, layer: 2, cap: 'butt', what: `the arrow from ${b}, ${sgn}` });
			const tri = [tip, [base[0] + w[0] * hw, base[1] + w[1] * hw], [base[0] - w[0] * hw, base[1] - w[1] * hw]];
			S.raw(`<path d="${pathOf(tri)}" fill="${INK}"/>`, 2);
			S.mark([...tri, tri[0]], 0, `the head of the arrow from ${b}, ${sgn}`);
			// it runs from raised states outside the circle, within the bulge, to lowered ones inside it, in the hollow
			const dE = (t) => -4 * Math.cos(t) * Math.sin(t);
			const bulge = Math.hypot(...map([Math.cos(a0), Math.sin(a0)])), hollow = Math.hypot(...map([Math.cos(a1), Math.sin(a1)]));
			check(dE(a0) > 0 && dE(a1) < 0 && ARC.out > 1 && ARC.out < bulge && ARC.in < 1 && ARC.in > hollow, `the arrow from ${b} does not run from the bulge into the hollow`);
		}
	}

	// ---- the panels' names, on one baseline under them
	const yb = ORIGIN + REACH + 12;
	const names = ['\\text{at rest}', '\\text{just after a sudden shear}', '\\text{collisions, time }\\tau'];
	for (const [k, c] of centres.entries()) { const svg = await tex(names[k], [c[0], yb], SIZE, 'cB', INK); L.push({ src: names[k], svg, box: boxOf(svg) }); }

	S.checkAll(L);
	window[name + '-numbers'] = { s, U };
	return finish(S, L, [285, 345]);
}
