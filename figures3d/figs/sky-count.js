// What one pixel sees of the sky. (a) The real numbers of a pixel's spectral matrix at one frequency that carry
// the sky's brightness, circular and linear polarization, and the rest, which are checks
// (paper/figures/charts.py, sky_count_chart). (b) What it cannot see: twelve equal, independent sources at the
// corners of a regular icosahedron give a pixel exactly the second moments of a uniform sky.
import { Panel, v3, figure, inset, letter, INK, DIM, ACCENT } from '../lib.js';
import { disc, greatCircle, veil } from './stars.js';

const GLOW = '#f3dfcb', PAGE = '#fffffe';
// the chart of (a) LEFT - 6 points wide; the two skies of (b), SCALE points in radius and SPACING apart, the right
// one's outline about as far from the right edge as the panel letter (a) is from the left
const W = 504, LEFT = 256, SCALE = 40, SPACING = 140, BEARING = 1;
const CENTRES = [W - BEARING - SCALE - SPACING, W - BEARING - SCALE];

export default async function () {
	const chart = await inset('/paper/figures/staging/sky-count-chart.svg', 0, 14, LEFT - 6);
	const H = Math.round(chart.h) + 18;
	const COL = SPACING;
	const phi = (1 + Math.sqrt(5)) / 2;
	const corners = [];
	for (const s of [-1, 1]) for (const t of [-1, 1]) {
		corners.push(v3(0, s, t * phi), v3(s, t * phi, 0), v3(t * phi, 0, s));
	}
	const panels = [];
	const sky = (j) => {
		const P = new Panel({ x: CENTRES[j] - COL / 2, y: 8, w: COL, h: H - 22, scale: SCALE, tilt: 7, turn: 68 });
		panels.push(P);
		return P;
	};
	// twelve sources at the corners of an icosahedron, seen from where they lie farthest apart
	let P = sky(0);
	veil(P);
	greatCircle(P, v3(0, 1, 0));
	for (const c of corners) disc(P, c.clone().normalize(), 2.3, { fill: ACCENT, stroke: PAGE, width: 0.45 });
	P.label('\\text{twelve sources}', [COL / 2, P.h - 8], { size: 7.5, anchor: 'ct' });
	P.label('\\text{at the corners of an icosahedron}', [COL / 2, P.h + 1.5], { size: 7.5, anchor: 'ct', color: DIM });
	// a uniform sky
	P = sky(1);
	disc(P, v3(0, 0, 0), P.scale, { fill: GLOW, stroke: ACCENT, width: 0.5, n: 160, layer: 0 });
	greatCircle(P, v3(0, 1, 0), { color: ACCENT, width: 0.35 });
	P.label('\\text{a uniform sky}', [COL / 2, P.h - 8], { size: 7.5, anchor: 'ct' });
	P.label('\\text{of the same brightness}', [COL / 2, P.h + 1.5], { size: 7.5, anchor: 'ct', color: DIM });
	P.label('=', [(CENTRES[0] + CENTRES[1]) / 2 - P.x, P.h / 2], { size: 13, color: INK });
	const letters = [letter('a', 0), letter('b', LEFT, 1, '\\text{the same to one pixel}')];
	return figure(W, H, panels, [Promise.resolve(chart.svg), ...letters]);
}
