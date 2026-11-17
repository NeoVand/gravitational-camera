// What one pixel sees of the sky. (a) The real numbers of a pixel's spectral matrix at one frequency that carry
// the sky's brightness, circular and linear polarization, and the rest, which are checks
// (paper/figures/charts.py, sky_count_chart). (b) What it cannot see: twelve equal, independent sources at the
// corners of a regular icosahedron give a pixel exactly the second moments of a uniform sky.
import { Panel, v3, figure, inset, INK, DIM, RULE, ACCENT } from '../lib.js';
import { disc, greatCircle } from './stars.js';

const SKY = '#eeebe5', GLOW = '#f3dfcb', PAGE = '#fffffe';
const W = 504, LEFT = 256;

export default async function () {
	const chart = await inset('/paper/figures/staging/sky-count-chart.svg', 0, 14, LEFT - 6);
	const H = Math.round(chart.h) + 18;
	const COL = (W - LEFT) / 2;
	const phi = (1 + Math.sqrt(5)) / 2;
	const corners = [];
	for (const s of [-1, 1]) for (const t of [-1, 1]) {
		corners.push(v3(0, s, t * phi), v3(s, t * phi, 0), v3(t * phi, 0, s));
	}
	const panels = [];
	const sky = (j) => {
		const P = new Panel({ x: LEFT + j * COL, y: 8, w: COL, h: H - 22, scale: 40, tilt: 7, turn: 68 });
		panels.push(P);
		return P;
	};
	// twelve sources at the corners of an icosahedron, seen from where they lie farthest apart
	let P = sky(0);
	disc(P, v3(0, 0, 0), P.scale, { fill: SKY, stroke: RULE, width: 0.5, opacity: 0.72, n: 160, layer: 0 });
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
	P.label('=', [0, P.h / 2], { size: 13, color: INK });
	panels[0].label('\\text{the same to one pixel}', [COL, -2], { size: 8, anchor: 'ct' });
	panels[0].label('\\text{(b)}', [-4, -6], { anchor: 'lt' });
	panels[0].label('\\text{(a)}', [-LEFT, -6], { anchor: 'lt' });
	return figure(W, H, panels, [Promise.resolve(chart.svg)]);
}
