// Figure 9: radiation from a spinning pair. (a) The power sent in each direction, proportional to
// (1 + 6 cos^2 i + cos^4 i)/8, as a polar curve in a plane containing the spin: exact. Around it, at
// i = 0, 30, ..., 180 degrees, the polarization ellipse an observer there sees, face on: semi-axes
// (1 + cos^2 i)/2 and |cos i| in proportion, exact, turning one way above the plane of the orbit and the
// other way below it. The pair at the centre is schematic (not to scale). (b) The wavelength over the size
// of the source against the speed of its parts (paper/figures/charts.py).
import { Panel, v3, figure, inset, INK, DIM, FAINT, ACCENT } from '../lib.js';

const FILL = '#f3d6b6', STEEL = '#868b92';

export default async function () {
	const H = 214;
	const A = new Panel({ x: 0, y: 0, w: 222, h: H, cx: 0.26, cy: -0.1, scale: 62 });
	const p = (t) => (1 + 6 * Math.cos(t) ** 2 + Math.cos(t) ** 4) / 8;
	const curve = [];
	for (let k = 0; k <= 360; k++) {
		const t = (2 * Math.PI * k) / 360;
		curve.push(v3(p(t) * Math.sin(t), p(t) * Math.cos(t), 0));
	}
	A.polygon(curve, { fill: FILL, layer: 0 });
	A.curve(curve, { color: ACCENT, width: 0.8, layer: 1 });
	// the spin axis, and the angular velocity
	A.curve([v3(0, -1.5, 0), v3(0, 1.5, 0)], { color: FAINT, width: 0.45, dash: [2, 2], layer: 2 });
	A.label('\\boldsymbol{\\omega}', v3(-0.08, 1.5, 0), { anchor: 'rt' });
	// the turning pair, its orbit seen from a little above, and its sense
	const orbit = [];
	for (let k = 0; k <= 80; k++) {
		const t = (2 * Math.PI * k) / 80;
		orbit.push(v3(0.17 * Math.cos(t), 0.045 * Math.sin(t), 0));
	}
	A.curve(orbit, { color: DIM, width: 0.4, layer: 3 });
	A.arrow(v3(-0.03, -0.045, 0), v3(0.04, -0.044, 0), { color: DIM, width: 0.4, head: 2.4, layer: 3 });
	A.curve([v3(-0.12, 0.03, 0), v3(0.12, -0.03, 0)], { width: 0.7, layer: 4 });
	A.sphere(v3(-0.12, 0.03, 0), 0.035, STEEL, { layer: 5, spec: 0.6 });
	A.sphere(v3(0.12, -0.03, 0), 0.035, STEEL, { layer: 5, spec: 0.6 });
	// the angle i, from the spin to a direction
	const io = (60 * Math.PI) / 180;
	A.curve([v3(0, 0, 0), v3(1.08 * Math.sin(io), 1.08 * Math.cos(io), 0)], { color: INK, width: 0.45, layer: 2 });
	const arc = [];
	for (let k = 0; k <= 30; k++) {
		const t = (io * k) / 30;
		arc.push(v3(0.5 * Math.sin(t), 0.5 * Math.cos(t), 0));
	}
	A.curve(arc, { width: 0.45, layer: 2 });
	A.label('\\iota', v3(0.5 * Math.sin(io / 2) + 0.07, 0.5 * Math.cos(io / 2) + 0.05, 0), { size: 9 });
	// the polarization ellipse seen from each direction: semi-axes in proportion to (1 + cos^2 i)/2 and cos i
	const size = 0.15;
	for (let deg = 0; deg <= 180; deg += 30) {
		const t = (deg * Math.PI) / 180, c = Math.cos(t);
		const a = size * (1 + c * c) / 2, b = size * Math.abs(c);
		const at = v3(1.33 * Math.sin(t), 1.33 * Math.cos(t), 0);
		if (b > 1e-6) {
			const e = [];
			for (let k = 0; k <= 60; k++) {
				const u = (2 * Math.PI * k) / 60;
				e.push(v3(at.x + a * Math.cos(u), at.y + b * Math.sin(u), 0));
			}
			A.curve(e, { width: 0.6, layer: 3 });
			// the sense: anticlockwise as seen above the plane of the orbit, clockwise below
			const s = c > 0 ? 1 : -1;
			const u0 = Math.PI / 2;
			const tip = v3(at.x + a * Math.cos(u0), at.y + b * Math.sin(u0), 0);
			A.arrow(v3(tip.x + s * 0.4 * a, tip.y - 0.02 * b, 0), v3(tip.x - s * 0.05 * a, tip.y, 0), { width: 0.6, head: 3, layer: 4 });
		} else {
			A.arrow(v3(at.x - a, at.y, 0), v3(at.x + a, at.y, 0), { width: 0.6, head: 2.8, both: true, layer: 3 });
		}
		A.label(`${deg}^\\circ`, v3(at.x + Math.max(a, 0.02) + 0.05, at.y, 0), { size: 6.5, anchor: 'lc', color: DIM });
	}
	A.label('\\frac{\\mathrm{d}P}{\\mathrm{d}\\Omega} \\propto \\frac{1 + 6\\cos^{2}\\iota + \\cos^{4}\\iota}{8}', [111, H - 2], { anchor: 'cb' });
	A.label('\\text{(a)}', [4, 5], { anchor: 'lt' });
	const chart = await inset('/paper/figures/staging/quadrupole-chart.svg', 226, 4, 278);
	const B = new Panel({ x: 226, y: 0, w: 10, h: 10 });
	B.label('\\text{(b)}', [274, 5], { anchor: 'rt' });
	return figure(504, Math.max(H, chart.h + 4), [A, B], [Promise.resolve(chart.svg)]);
}
