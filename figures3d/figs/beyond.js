// Beyond general relativity in one reading. (a) The six polarizations a metric theory of gravity allows, each drawn
// as the distortion it makes of a ring of free particles in the plane where it acts (exaggerated), seen face-on, with
// that plane's two axes marked: x and y across the wave, k along it. General relativity has only the first two.
// Plus then stretches along an axis and cross along a diagonal, as they are always drawn. (b) One reading tells a
// massive graviton from a massive scalar (paper/figures/charts.py, beyond_chart).
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
// A ring of radius 1 is SCALE points; the distortion is x -> (1 + S E) x; an axis runs AXIS to each side, FOOT below,
// and TOP above, where its name hangs beside its tip, clear of a ring stretched upward (asserted).
const SCALE = 16.9, S = 0.3, AXIS = 1.42, FOOT = 1.4, TOP = 1.84;

// the wave's frame in the drawing: e1 to the right, e2 into the page, k up (e1 x e2 = k)
const R = new THREE.Matrix3().set(1, 0, 0, 0, 0, 1, 0, -1, 0);
// Each mode with the plane, in the wave frame (x, y, k), in which it acts, in the order of the two rows: across the
// wave (seen along k, which points at the reader: x to the right, y up), then with a part along it (seen from the
// side: x or y to the right, k up).
const NAMES = ['x', 'y', '\\hat k'];
const modes = [
	{ name: '\\text{plus}', E: [[1, 0, 0], [0, -1, 0], [0, 0, 0]], plane: [0, 1], gr: true },
	{ name: '\\text{cross}', E: [[0, 1, 0], [1, 0, 0], [0, 0, 0]], plane: [0, 1], gr: true },
	{ name: '\\text{breathing}', E: [[1, 0, 0], [0, 1, 0], [0, 0, 0]], plane: [0, 1] },
	{ name: '\\text{vector } x', E: [[0, 0, 1], [0, 0, 0], [1, 0, 0]], plane: [0, 2] },
	{ name: '\\text{vector } y', E: [[0, 0, 0], [0, 0, 1], [0, 1, 0]], plane: [1, 2] },
	{ name: '\\text{longitudinal}', E: [[0, 0, 0], [0, 0, 0], [0, 0, 1]], plane: [0, 2] }
];
// the view that shows a plane face-on with its first axis to the right and its second up: degrees down, and round
// the vertical
const VIEW = { '0,1': [90, 0], '0,2': [0, 0], '1,2': [0, -90] };

export default async function () {
	const left = W - RIGHT - 8;
	const cw = left / COLS;
	// each ring drawn about its panel's origin; the rows are placed once their reach is known
	const panels = modes.map((m, i) => {
		const [tilt, turn] = VIEW[m.plane.join()];
		const P = new Panel({ x: (i % COLS) * cw, y: 0, w: cw, h: 0, scale: SCALE, tilt, turn });
		// the mode's tidal matrix in the drawing's axes, and the distortion x -> (1 + S E) x
		const Ew = new THREE.Matrix3().set(...m.E.flat());
		const Rt = R.clone().transpose();
		const E = R.clone().multiply(Ew).multiply(Rt);
		const colour = m.gr ? ACCENT : DIM;
		const axes = [v3(1, 0, 0).applyMatrix3(R), v3(0, 1, 0).applyMatrix3(R), v3(0, 0, 1).applyMatrix3(R)];
		const [a, b] = m.plane.map((j) => axes[j]);
		// the view is the plane's own: a to the right and b up, to a part in a million
		const [ox, oy] = P.at(v3(0, 0, 0)), [ax, ay] = P.at(a), [bx, by] = P.at(b);
		if (Math.hypot(ax - ox - SCALE, ay - oy) > 1e-6 * SCALE || Math.hypot(bx - ox, by - oy + SCALE) > 1e-6 * SCALE) {
			throw new Error(`beyond: the plane of ${m.name} is not seen face-on`);
		}
		// the plane's two axes (named at their tips once the rows are placed, below)
		P.curve([a.clone().multiplyScalar(-AXIS), a.clone().multiplyScalar(AXIS)], { color: RULE, width: 0.45, layer: 0 });
		P.curve([b.clone().multiplyScalar(-FOOT), b.clone().multiplyScalar(TOP)], { color: RULE, width: 0.45, layer: 0 });
		P.tips = [a.clone().multiplyScalar(AXIS), b.clone().multiplyScalar(TOP)];
		// a ring of free particles in the mode's plane: at rest (dashed) and distorted (exaggerated)
		const ring = (t) => a.clone().multiplyScalar(Math.cos(t)).addScaledVector(b, Math.sin(t));
		const bent = (p) => p.clone().add(p.clone().applyMatrix3(E).multiplyScalar(S));
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
	// what a reader must see: plus stretched along x and squeezed along y, cross along the diagonal x = y, the
	// longitudinal mode along k alone
	{
		const [plus, cross, , , , long] = modes.map((m) => new THREE.Matrix3().set(...m.E.flat()));
		const along = (M, u) => v3(...u).normalize().dot(v3(...u).normalize().applyMatrix3(M));
		const d = Math.SQRT1_2;
		if (!(along(plus, [1, 0, 0]) === 1 && along(plus, [0, 1, 0]) === -1 && Math.abs(along(plus, [d, d, 0])) < 1e-12)) throw new Error('beyond: plus is not along the axes');
		if (!(Math.abs(along(cross, [d, d, 0]) - 1) < 1e-12 && Math.abs(along(cross, [d, -d, 0]) + 1) < 1e-12 && along(cross, [1, 0, 0]) === 0)) throw new Error('beyond: cross is not along the diagonals');
		if (!(along(long, [0, 0, 1]) === 1 && along(long, [1, 0, 0]) === 0)) throw new Error('beyond: the longitudinal mode is not along k');
	}
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
		// the axes' names: the first to the right of its right tip, the second beside its top tip
		P.label(NAMES[m.plane[0]], P.tips[0], { size: 7, anchor: 'lc', color: DIM, dx: 2.2 });
		P.label(NAMES[m.plane[1]], P.tips[1], { size: 7, anchor: 'lt', color: DIM, dx: 2.2 });
		// the name beside the top tip, 7 points tall at most, ends above the highest particle of a ring stretched upward
		if ((TOP - (1 + S)) * SCALE - 7 - 1.5 < 0.5) throw new Error('beyond: an axis name meets its ring');
	});
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
