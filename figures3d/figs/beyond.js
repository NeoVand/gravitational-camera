// Beyond general relativity in one reading. (a) The six polarizations a metric theory of gravity allows, each drawn
// as the distortion it makes of a ring of free particles in the plane where it acts (exaggerated), for a wave
// travelling up the page; general relativity has only the first two. (b) One reading tells a massive graviton
// from a massive scalar (paper/figures/charts.py, beyond_chart).
import { THREE, Panel, v3, figure, inset, DIM, RULE, ACCENT } from '../lib.js';
import { disc } from './stars.js';

const W = 504, RIGHT = 196, COLS = 3;

// the wave's frame in the drawing: e1 to the right, e2 into the page, k up (e1 x e2 = k)
const R = new THREE.Matrix3().set(1, 0, 0, 0, 0, 1, 0, -1, 0);
// each mode with the plane, in the wave frame (e1, e2, k), in which it acts
const modes = [
	{ name: '\\text{plus}', E: [[1, 0, 0], [0, -1, 0], [0, 0, 0]], plane: [0, 1], gr: true },
	{ name: '\\text{cross}', E: [[0, 1, 0], [1, 0, 0], [0, 0, 0]], plane: [0, 1], gr: true },
	{ name: '\\text{vector } x', E: [[0, 0, 1], [0, 0, 0], [1, 0, 0]], plane: [0, 2] },
	{ name: '\\text{vector } y', E: [[0, 0, 0], [0, 0, 1], [0, 1, 0]], plane: [1, 2] },
	{ name: '\\text{breathing}', E: [[1, 0, 0], [0, 1, 0], [0, 0, 0]], plane: [0, 1] },
	{ name: '\\text{longitudinal}', E: [[0, 0, 0], [0, 0, 0], [0, 0, 1]], plane: [0, 2] }
];

export default async function () {
	const chart = await inset('/paper/figures/staging/beyond-chart.svg', W - RIGHT, 6, RIGHT);
	const H = Math.round(chart.h) + 10;
	const left = W - RIGHT - 8;
	const cw = left / COLS, ch = (H - 8) / 2;
	const panels = [];
	modes.forEach((m, i) => {
		const P = new Panel({ x: (i % COLS) * cw, y: 8 + Math.floor(i / COLS) * ch, w: cw, h: ch, cy: 0.1, scale: 24, tilt: 40, turn: -38 });
		panels.push(P);
		// the mode's tidal matrix in the drawing's axes, and the distortion x -> (1 + s E) x
		const Ew = new THREE.Matrix3().set(...m.E.flat());
		const Rt = R.clone().transpose();
		const E = R.clone().multiply(Ew).multiply(Rt);
		const s = 0.32;
		const colour = m.gr ? ACCENT : DIM;
		// the axis along which the wave travels, and a ring of free particles in the mode's plane: at rest (dashed)
		// and distorted (x -> (1 + s E) x, exaggerated)
		P.curve([v3(0, -1.35, 0), v3(0, 1.35, 0)], { color: RULE, width: 0.45, layer: 0 });
		const axes = [v3(1, 0, 0).applyMatrix3(R), v3(0, 1, 0).applyMatrix3(R), v3(0, 0, 1).applyMatrix3(R)];
		const [a, b] = m.plane.map((j) => axes[j]);
		const ring = (t) => a.clone().multiplyScalar(Math.cos(t)).addScaledVector(b, Math.sin(t));
		const bent = (p) => p.clone().add(p.clone().applyMatrix3(E).multiplyScalar(s));
		const N = 160, still = [], moved = [];
		for (let k = 0; k <= N; k++) {
			const p = ring((2 * Math.PI * k) / N);
			still.push(p);
			moved.push(bent(p));
		}
		P.curve(still, { color: RULE, width: 0.5, dash: [1.6, 1.6], layer: 1 });
		P.curve(moved, { color: colour, width: 0.8, layer: 2 });
		for (let k = 0; k < 8; k++) disc(P, bent(ring((2 * Math.PI * k) / 8)), 1.5, { fill: colour, layer: 3 });
		P.label(m.name, [cw / 2, ch - 3], { size: 7.5, anchor: 'cb', color: m.gr ? ACCENT : DIM });
	});
	// the direction of travel, once
	const P0 = panels[0];
	P0.arrow(v3(-1.85, -0.55, 0), v3(-1.85, 0.75, 0), { color: DIM, width: 0.55, head: 3.4, layer: 3 });
	P0.label('\\hat k', v3(-2.08, 0.2, 0), { size: 7.5, color: DIM });
	panels[0].label('\\text{general relativity}', [cw, -7], { size: 7.5, anchor: 'ct', color: ACCENT });
	panels[0].label('\\text{(a)}', [0, -8], { anchor: 'lt' });
	panels[0].label('\\text{(b)}', [W - RIGHT - 8, -8], { anchor: 'lt' });
	return figure(W, H, panels, [Promise.resolve(chart.svg)]);
}
