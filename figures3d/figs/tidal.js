// Figure 2: what a pixel feels. A ring of twelve free test masses beside a mass, and in a passing wave
// of either polarization. Exact: the ring's shape (beside a mass the tidal tensor is
// (GM/r^3) diag(-2, 1, 1) along the line to it, so a ring of radius 1 becomes the ellipse with
// semi-axes 1 + 2e and 1 - e; in a wave, 1 + e and 1 - e), the beads' places on it, and each arrow,
// the tidal acceleration -E xi at the bead. Exaggerated: e. Schematic: the planet's size and distance.
import { Panel, v3, ellipsePoints, figure, INK, DIM, RULE } from '../lib.js';

const H = 158, BEAD = 0.075;
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
			P.arrow(from, from.clone().addScaledVector(a, 0.13), { width: 0.55, head: 3.6 });
		}
	}
}

export default async function () {
	const e = 0.16, s = 0.2;
	const a = new Panel({ x: 0, y: 0, w: 226, h: H, cx: -0.02, cy: 0, scale: 40 });
	a.sphere(v3(-1.6, 0, 0), 0.55, STONE, { spec: 0.1, shininess: 10, wrap: 0.45, ambient: 0.34 });
	a.curve([v3(-1.04, 0, -0.5), v3(0.95 - 1.42, 0, -0.5)], { color: RULE, width: 0.45, dash: [1, 2], layer: -2 });
	a.curve(ellipsePoints(0.95, 0, -0.2, 1, 1), { color: DIM, width: 0.5, dash: [2.4, 2], layer: -2 });
	ring(a, [0.95, 0], 1 + 2 * e, 1 - e, 0, (x, y) => [2 * x, -y]);
	a.label('\\text{(a)}', [4, 5], { anchor: 'lt' });
	a.label('M', v3(-1.6, -0.68, 0), { anchor: 'ct', size: 9.5 });

	const panels = [a];
	for (const [k, angle, name] of [[0, 0, '\\text{(b)}\\ \\ h_+'], [1, Math.PI / 4, '\\text{(c)}\\ \\ h_\\times']]) {
		const P = new Panel({ x: 226 + 139 * k, y: 0, w: 139, h: H, scale: 40 });
		P.curve(ellipsePoints(0, 0, -0.2, 1, 1), { color: DIM, width: 0.5, dash: [2.4, 2], layer: -2 });
		ring(P, [0, 0], 1 - s, 1 + s, angle, null, true);
		ring(P, [0, 0], 1 + s, 1 - s, angle, (x, y) => [x, -y]);
		P.label(name, [4, 5], { anchor: 'lt' });
		P.label('\\odot', [139 - 6, 6], { anchor: 'rt', size: 9 });
		panels.push(P);
	}
	return figure(504, H, panels);
}
