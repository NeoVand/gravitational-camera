// Figure 2: what a pixel feels. A ring of twelve free test masses beside a mass, and in a passing wave
// of either polarization. Exact: the ring's shape (beside a mass the tidal tensor is
// (GM/r^3) diag(-2, 1, 1) along the line to it, so a ring of radius 1 becomes the ellipse with
// semi-axes 1 + 2e and 1 - e; in a wave, 1 + e and 1 - e), the beads' places on it, and each arrow,
// the tidal acceleration -E xi at the bead. Exaggerated: e. Schematic: the planet's size and distance.
import { Panel, v3, ellipsePoints, figure, INK, DIM, RULE } from '../lib.js';

// one column: (a) across the top, (b) and (c) side by side beneath it, all at one scale (SCALE points to the
// undisturbed ring's radius), so that the dashed rings are the same size in the three panels. Each row is as tall
// as what it holds: (a) the dashed circle, (b) and (c) the ghost ring, radius 1 + s plus a bead; GAP of air between.
// REACH: the arrows' length per unit of tidal acceleration.
const W = 246, HALF = W / 2, SCALE = 34, BEAD = 0.075, REACH = 0.15;
const TOP = 2 * SCALE + 4, GAP = 18, LOW = Math.ceil(2 * (1.2 + BEAD) * SCALE) + 4;
const ROW = TOP + GAP, H = ROW + LOW;
const STEEL = '#868b92', STONE = '#cdbca3', GHOST = '#e2ded6';

function ring(P, centre, sx, sy, angle, accel, ghost = false) {
	const ca = Math.cos(angle), sa = Math.sin(angle);
	const layer = ghost ? -1 : 0;
	P.curve(ellipsePoints(centre[0], centre[1], -0.01, sx, sy, angle), {
		color: ghost ? RULE : INK, width: ghost ? 0.5 : 0.65, dash: ghost ? [1.4, 1.4] : null, layer
	});
	for (let k = 0; k < 12; k++) {
		const t = (2 * Math.PI * k) / 12;
		const x = sx * Math.cos(t), y = sy * Math.sin(t);
		const p = v3(centre[0] + ca * x - sa * y, centre[1] + sa * x + ca * y, 0);
		P.sphere(p, BEAD, STEEL, ghost ? { layer, opacity: 0.3, spec: 0.3 } : { layer, spec: 0.6, shininess: 36 });
		if (accel) {
			const [ax, ay] = accel(Math.cos(t), Math.sin(t));
			const a = v3(ca * ax - sa * ay, sa * ax + ca * ay, 0);
			const u = a.clone().normalize();
			const from = p.clone().addScaledVector(u, BEAD + 0.04);
			P.arrow(from, from.clone().addScaledVector(a, REACH), { width: 0.55, head: 3.6 });
		}
	}
}

export default async function () {
	const e = 0.16, s = 0.2;
	// the planet and the ring, centred across the column; the dashed circle's top level with the panel letter
	const a = new Panel({ x: 0, y: 0, w: W, h: TOP, cx: 0.25, cy: 0, scale: SCALE });
	a.sphere(v3(-1.6, 0, 0), 0.55, STONE, { spec: 0.1, shininess: 10, wrap: 0.45, ambient: 0.34 });
	a.curve([v3(-1.04, 0, -0.5), v3(0.95 - 1.42, 0, -0.5)], { color: RULE, width: 0.45, dash: [1, 2], layer: -2 });
	a.curve(ellipsePoints(0.95, 0, -0.2, 1, 1), { color: DIM, width: 0.5, dash: [2.4, 2], layer: -2 });
	ring(a, [0.95, 0], 1 + 2 * e, 1 - e, 0, (x, y) => [2 * x, -y]);
	a.label('\\text{(a)}', [4, 2], { anchor: 'lt' });
	a.label('M', v3(-1.6, -0.68, 0), { anchor: 'ct', size: 9.5 });

	const panels = [a];
	// each ring centred in its half of the column
	for (const [k, angle, name] of [[0, 0, '\\text{(b)}\\ \\ h_+'], [1, Math.PI / 4, '\\text{(c)}\\ \\ h_\\times']]) {
		const P = new Panel({ x: HALF * k, y: ROW, w: HALF, h: LOW, scale: SCALE });
		P.curve(ellipsePoints(0, 0, -0.2, 1, 1), { color: DIM, width: 0.5, dash: [2.4, 2], layer: -2 });
		ring(P, [0, 0], 1 - s, 1 + s, angle, null, true);
		ring(P, [0, 0], 1 + s, 1 - s, angle, (x, y) => [x, -y]);
		P.label(name, [4, 0], { anchor: 'lt' });
		P.label('\\odot', [HALF - 6, 1], { anchor: 'rt', size: 9 });
		panels.push(P);
	}
	return figure(W, H, panels);
}
