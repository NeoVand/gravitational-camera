// Beyond general relativity in one reading. (a) The six polarizations a metric theory of gravity allows, each drawn
// as the distortion it makes of a ring of free particles in the plane where it acts (exaggerated), for a wave
// travelling up the page; general relativity has only the first two. (b) One reading tells a massive graviton
// from a massive scalar (paper/figures/charts.py, beyond_chart).
import { THREE, Panel, v3, figure, inset, tex, letter, LETTER, DIM, RULE, ACCENT } from '../lib.js';
import { disc } from './stars.js';

const W = 504, COLS = 3;
// The chart is drawn RIGHT points wide, at its true size: its plot box's top lies CHART_TOP points below the top of
// the drawing, and its x label's baseline CHART_BASE points above the foot (as set in charts.py, beyond_chart).
const RIGHT = 196, CHART_TOP = 2, CHART_BASE = 3.5;
// The layout, in points: the panel letters and the heading share one baseline, LINE; GAP from a line of text to the
// rings below it; NAME from the foot of a row of rings to the baseline of their names. The chart's plot box spans
// from the top of the first row of rings to its x label, level with the second row's names.
const LINE = 7, GAP = 7, NAME = 9.5;

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
	const left = W - RIGHT - 8;
	const cw = left / COLS;
	// each ring drawn about its panel's origin; the rows are placed once their reach is known
	const panels = modes.map((m, i) => {
		const P = new Panel({ x: (i % COLS) * cw, y: 0, w: cw, h: 0, scale: 24, tilt: 40, turn: -38 });
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
		return P;
	});
	// the rows: the first row's top GAP below the top line, each row's names NAME below its foot, the next row GAP
	// below those; a row's reach is that of its rings
	const reach = (row) => {
		let lo = Infinity, hi = -Infinity;
		for (const P of row) for (const it of P.items) for (const p of it.points ?? []) {
			const y = P.at(p)[1] - P.y;
			lo = Math.min(lo, y); hi = Math.max(hi, y);
		}
		return [lo, hi];
	};
	const top = LINE + GAP;
	const baselines = [];
	let y = top;
	for (const row of [panels.slice(0, COLS), panels.slice(COLS)]) {
		const [lo, hi] = reach(row);
		for (const P of row) P.y = y - lo;
		baselines.push(y - lo + hi + NAME);
		y = baselines.at(-1) + GAP;
	}
	// a whole number of points tall: the second row moves by less than half a point to meet the foot
	const H = Math.round(baselines[1] + CHART_BASE);
	const shift = H - CHART_BASE - baselines[1];
	for (const P of panels.slice(COLS)) P.y += shift;
	baselines[1] += shift;
	modes.forEach((m, i) => {
		const P = panels[i];
		P.label(m.name, [cw / 2, baselines[Math.floor(i / COLS)] - P.y], { size: 7.5, anchor: 'cB', color: m.gr ? ACCENT : DIM });
	});
	// the direction of travel, once, its tip level with the top of the axis
	const P0 = panels[0];
	P0.arrow(v3(-1.85, -0.9, 0), v3(-1.85, 0.4, 0), { color: DIM, width: 0.55, head: 3.4, layer: 3 });
	P0.label('\\hat k', v3(-2.08, -0.15, 0), { size: 7.5, color: DIM });

	// (b): its plot box from the top of the first row of rings down to its x label, on the second row's names
	const chart = await inset('/paper/figures/staging/beyond-chart.svg', W - RIGHT, top - CHART_TOP, RIGHT);
	if (Math.abs(top - CHART_TOP + chart.h - H) > 0.05) {
		console.error(`beyond: the chart should be ${(H - top + CHART_TOP).toFixed(2)} pt tall to meet the rings; it is ${chart.h.toFixed(2)}`);
	}
	const line = [
		letter('a', 0, LINE - 0.75 * LETTER),
		tex('\\text{general relativity}', [cw, LINE], 7.5, 'cB', ACCENT),
		letter('b', W - RIGHT, LINE - 0.75 * LETTER)
	];
	return figure(W, H, panels, [Promise.resolve(chart.svg), ...line]);
}
