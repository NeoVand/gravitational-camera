// Figure 9: radiation from a spinning pair. (a) The power sent in each direction,
// dP/dOmega proportional to (1 + 6 cos^2 i + cos^4 i)/8, as the surface of revolution about the spin:
// exact. A quarter is cut away to show the turning pair, which is schematic (not to scale).
// (b) The wavelength over the size of the source against the speed of its parts (paper/figures/charts.py).
import { THREE, Panel, v3, figure, inset, INK, DIM, FAINT } from '../lib.js';

const SHELL = '#e3b07c', STEEL = '#868b92';

export default async function () {
	const H = 190;
	const A = new Panel({ x: 0, y: 0, w: 218, h: H, cx: 0.02, cy: 0.05, scale: 72, tilt: 16, turn: -45 });
	const f = (t) => (1 + 6 * Math.cos(t) ** 2 + Math.cos(t) ** 4) / 8;
	const pts = [];
	for (let k = 0; k <= 90; k++) {
		const t = (Math.PI * k) / 90;
		const r = f(t);
		pts.push(new THREE.Vector2(Math.max(1e-4, r * Math.sin(t)), r * Math.cos(t)));
	}
	// three quarters of the surface: the quarter facing the reader is cut away
	const surface = new THREE.LatheGeometry(pts, 72, Math.PI / 2, (3 * Math.PI) / 2);
	A.mesh(surface, SHELL, { cull: false, o: { spec: 0.25, shininess: 24, wrap: 0.4 } });
	// the spin axis and the turning pair
	A.curve([v3(0, -1.22, 0), v3(0, 1.28, 0)], { color: FAINT, width: 0.45, dash: [2, 2], layer: 2 });
	A.curve([v3(-0.09, 0, 0), v3(0.09, 0, 0)], { width: 0.7, layer: 3 });
	A.sphere(v3(-0.09, 0, 0), 0.032, STEEL, { layer: 3, spec: 0.6 });
	A.sphere(v3(0.09, 0, 0), 0.032, STEEL, { layer: 3, spec: 0.6 });
	// circular polarization along the axis: a turning arrow around it
	const ring = [];
	for (let k = 0; k <= 56; k++) {
		const t = (-0.15 + (1.55 * k) / 56) * Math.PI;
		ring.push(v3(0.13 * Math.cos(t), 1.18, 0.13 * Math.sin(t)));
	}
	A.curve(ring, { width: 0.6, layer: 3 });
	A.arrow(ring[ring.length - 3], ring[ring.length - 1], { width: 0.6, head: 3.4, layer: 3 });
	A.label('\\text{circular}', v3(0.2, 1.2, 0), { anchor: 'lc', size: 7.5 });
	// linear polarization in the plane of the orbit, an eighth as strong
	A.arrow(v3(0.72, -0.12, 0), v3(0.72, 0.12, 0), { width: 0.6, head: 3.2, both: true, layer: 3 });
	A.label('\\text{linear, } \\tfrac{1}{8}', v3(0.78, 0, 0), { anchor: 'lc', size: 7.5 });
	A.label('\\frac{\\mathrm{d}P}{\\mathrm{d}\\Omega} \\propto \\frac{1 + 6\\cos^{2}\\iota + \\cos^{4}\\iota}{8}', [109, H - 4], { anchor: 'cb' });
	A.label('\\text{(a)}', [4, 5], { anchor: 'lt' });
	const chart = await inset('/paper/figures/staging/quadrupole-chart.svg', 222, 2, 282);
	const B = new Panel({ x: 222, y: 0, w: 10, h: 10 });
	B.label('\\text{(b)}', [272, 5], { anchor: 'rt' });
	return figure(504, Math.max(H, chart.h + 2), [A, B], [Promise.resolve(chart.svg)]);
}
