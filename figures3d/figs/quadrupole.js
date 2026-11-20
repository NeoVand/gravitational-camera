// Figure 9: radiation from a spinning pair. (a) The power sent in each direction, proportional to
// (1 + 6 cos^2 i + cos^4 i)/8, as a polar curve in a plane containing the spin: exact. Around it, at
// i = 0, 30, ..., 180 degrees, the polarization ellipse an observer there sees, face on: semi-axes
// (1 + cos^2 i)/2 and |cos i| in proportion, exact, turning one way above the plane of the orbit and the
// other way below it. The pair at the centre is schematic (not to scale). (b) The wavelength over the size
// of the source against the speed of its parts (paper/figures/charts.py).
import { Panel, v3, figure, inset, letter, INK, DIM, FAINT, ACCENT } from '../lib.js';

// the pattern's fill, and on the site's dark theme a deep shade of it (the accent at 20% over the dark page, as the
// site tints the paper's pale accent), so that the pale ink drawn over it stays legible
const FILL = '#f3d6b6', FILL_NIGHT = '#49351f', STEEL = '#868b92';
// the sense of turning in the colours of the which-way figure (make_figures.py, which_way): magenta for V/I = +1,
// anticlockwise as the observer sees it, green for V/I = -1, clockwise
const TURNS_ANTICLOCKWISE = '#c2255c', TURNS_CLOCKWISE = '#2f9e44';
// Across the full width: the drawing of (a), from the formula's left edge to the 90-degree label's right, and the
// chart of (b), CHART_W points wide at its true size (charts.py, quadrupole_chart: its y label's left edge at its left
// edge, its plot box ending 1 pt short of its right edge, the curve's end 0.3 pt short), each centred in its share:
// equal margins outside and a gutter of twice that between. The panel letters stand over the left edges of the two,
// on one baseline, LINE.
const W = 504, H = 180, SCALE = 56, CHART_W = 250, LINE = 7;
const FORMULA = '\\displaystyle \\frac{\\mathrm{d}P}{\\mathrm{d}\\Omega} \\propto \\frac{1 + 6\\cos^{2}\\iota + \\cos^{4}\\iota}{8}';
const FORMULA_SIZE = 8.5, FORMULA_GAP = 0.5, DEGREE_SIZE = 6.5, RING = 1.33, SIZE = 0.15;

/** The width in points of a TeX label set at `size`, as tex() in lib.js sets it. */
async function texWidth(src, size) {
	const svg = (await window.MathJax.tex2svgPromise(src, { display: false })).querySelector('svg');
	return (svg.getAttribute('viewBox').split(/\s+/).map(Number)[2] * size) / 1000;
}

export default async function () {
	// how far the drawing reaches left and right of the spin axis, in points
	const ellipses = [];
	let right = 0;
	for (let deg = 0; deg <= 180; deg += 30) {
		const t = (deg * Math.PI) / 180, c = Math.cos(t);
		const ap = (1 + c * c) / 2, ax = Math.abs(c);
		const at = v3(RING * Math.sin(t), RING * Math.cos(t), 0);
		const tag = v3(at.x + Math.max(SIZE * ap, 0.02) + 0.05, at.y, 0);
		right = Math.max(right, tag.x * SCALE + (await texWidth(`${deg}^\\circ`, DEGREE_SIZE)));
		ellipses.push({ deg, c, ap, ax, at, tag });
	}
	const left = FORMULA_GAP * SCALE + (await texWidth(FORMULA, FORMULA_SIZE));
	const margin = (W - left - right - CHART_W + 0.3) / 4;
	const axis = margin + left;

	const A = new Panel({ x: 0, y: 0, w: 2 * axis, h: H, scale: SCALE });
	const p = (t) => (1 + 6 * Math.cos(t) ** 2 + Math.cos(t) ** 4) / 8;
	const curve = [];
	for (let k = 0; k <= 360; k++) {
		const t = (2 * Math.PI * k) / 360;
		curve.push(v3(p(t) * Math.sin(t), p(t) * Math.cos(t), 0));
	}
	A.polygon(curve, { fill: `light-dark(${FILL}, ${FILL_NIGHT})`, layer: 0 });
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
	// filled magenta where the wave turns anticlockwise as seen there (V/I > 0), green where clockwise, as strongly
	// as its circular share |V/I| = 2 a+ ax / (a+^2 + ax^2); the linear wave in the plane of the orbit in ink
	for (const { deg, c, ap, ax, at, tag } of ellipses) {
		const a = SIZE * ap, b = SIZE * ax;
		const vi = (2 * ap * ax) / (ap * ap + ax * ax);
		if (b > 1e-6) {
			const e = [];
			for (let k = 0; k <= 72; k++) {
				const u = (2 * Math.PI * k) / 72;
				e.push(v3(at.x + a * Math.cos(u), at.y + b * Math.sin(u), 0));
			}
			const col = c > 0 ? TURNS_ANTICLOCKWISE : TURNS_CLOCKWISE;
			A.polygon(e, { fill: col, opacity: 0.12 + 0.4 * vi, layer: 3 });
			A.curve(e, { color: col, width: 0.6, layer: 3.1 });
		} else {
			A.curve([v3(at.x - a, at.y, 0), v3(at.x + a, at.y, 0)], { width: 0.8, layer: 3 });
		}
		A.label(`${deg}^\\circ`, tag, { size: DEGREE_SIZE, anchor: 'lc', color: DIM });
	}
	// the formula, left of the pattern and level with the pair at its centre
	A.label(FORMULA, [A.at(v3(-FORMULA_GAP, 0, 0))[0], A.at(v3(0, 0, 0))[1]], { anchor: 'rc', size: FORMULA_SIZE });
	A.labels.push(letter('a', margin, LINE - 0.75 * 8));
	const x = W - margin - CHART_W + 0.3;
	const chart = await inset('/paper/figures/staging/quadrupole-chart.svg', x, 0, CHART_W);
	return figure(W, Math.max(H, chart.h), [A], [Promise.resolve(chart.svg), letter('b', x, LINE - 0.75 * 8)]);
}
