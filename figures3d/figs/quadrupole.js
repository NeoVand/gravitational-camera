// Figure 9: radiation from a spinning pair. (a) The power sent in each direction, proportional to
// (1 + 6 cos^2 i + cos^4 i)/8, as a polar curve in a plane containing the spin: exact. Around it, at
// i = 0, 30, ..., 180 degrees, the polarization ellipse an observer there sees, face on: semi-axes
// (1 + cos^2 i)/2 and |cos i| in proportion, exact, turning one way above the plane of the orbit and the
// other way below it. The pair at the centre is schematic (not to scale). (b) The wavelength over the size
// of the source against the speed of its parts (paper/figures/charts.py).
import { Panel, v3, figure, inset, INK, DIM, FAINT, ACCENT, ACCENT2 } from '../lib.js';

const FILL = '#f3d6b6', STEEL = '#868b92';

export default async function () {
	const H = 180;
	const A = new Panel({ x: 0, y: 0, w: 236, h: H, cx: -0.12, cy: 0.0, scale: 56 });
	const p = (t) => (1 + 6 * Math.cos(t) ** 2 + Math.cos(t) ** 4) / 8;
	const curve = [];
	for (let k = 0; k <= 360; k++) {
		const t = (2 * Math.PI * k) / 360;
		curve.push(v3(p(t) * Math.sin(t), p(t) * Math.cos(t), 0));
	}
	A.polygon(curve, { fill: FILL, layer: 0 });
	A.curve(curve, { color: ACCENT, width: 0.8, layer: 1 });
	// the spin axis, and the angular velocity
	A.curve([v3(0, -1.12, 0), v3(0, 1.12, 0)], { color: FAINT, width: 0.45, dash: [2, 2], layer: 2 });
	A.label('\\boldsymbol{\\omega}', v3(-0.07, 0.9, 0), { anchor: 'rc' });
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
	// the polarization ellipse seen from each direction: semi-axes in proportion to (1 + cos^2 i)/2 and |cos i|,
	// filled orange where the wave turns anticlockwise as seen there, blue where clockwise, as strongly as
	// its circular share |V/I| = 2 a+ ax / (a+^2 + ax^2); the linear wave in the plane of the orbit in ink
	const size = 0.15;
	for (let deg = 0; deg <= 180; deg += 30) {
		const t = (deg * Math.PI) / 180, c = Math.cos(t);
		const ap = (1 + c * c) / 2, ax = Math.abs(c);
		const a = size * ap, b = size * ax;
		const vi = (2 * ap * ax) / (ap * ap + ax * ax);
		const at = v3(1.33 * Math.sin(t), 1.33 * Math.cos(t), 0);
		if (b > 1e-6) {
			const e = [];
			for (let k = 0; k <= 72; k++) {
				const u = (2 * Math.PI * k) / 72;
				e.push(v3(at.x + a * Math.cos(u), at.y + b * Math.sin(u), 0));
			}
			const col = c > 0 ? ACCENT : ACCENT2;
			A.polygon(e, { fill: col, opacity: 0.12 + 0.4 * vi, layer: 3 });
			A.curve(e, { color: col, width: 0.6, layer: 3.1 });
		} else {
			A.curve([v3(at.x - a, at.y, 0), v3(at.x + a, at.y, 0)], { width: 0.8, layer: 3 });
		}
		A.label(`${deg}^\\circ`, v3(at.x + Math.max(a, 0.02) + 0.05, at.y, 0), { size: 6.5, anchor: 'lc', color: DIM });
	}
	// the formula, left of the pattern and level with its centre
	A.label('\\frac{\\mathrm{d}P}{\\mathrm{d}\\Omega} \\propto \\frac{1 + 6\\cos^{2}\\iota + \\cos^{4}\\iota}{8}', [A.at(v3(-0.46, 0, 0))[0] - A.x, A.at(v3(0, 0, 0))[1] - A.y], { anchor: 'rc', size: 7.5 });
	A.label('\\text{(a)}', [4, 5], { anchor: 'lt' });
	const chart = await inset('/paper/figures/staging/quadrupole-chart.svg', 238, 0, 266);
	const B = new Panel({ x: 238, y: 0, w: 10, h: 10 });
	B.label('\\text{(b)}', [262, 5], { anchor: 'rt' });
	return figure(504, Math.max(H, chart.h), [A, B], [Promise.resolve(chart.svg)]);
}
