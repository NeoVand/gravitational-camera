// One ear, four voices. (a) Four plane waves from fixed directions, each with its own waveform and polarization
// (the third is linearly polarized), and the ten numbers one pixel reads while they pass (paper/figures/charts.py).
// (b) From those readings alone: the matrix A that annihilates them all, and on the sky toward the sources the size
// of m^T A m, which vanishes at exactly four points. The rings are the true sources, the dots the zeros found from
// the readings; they agree to 1e-15. (c) Light from the first two, the same way: a vector a, and m . a vanishing at
// two points. All numbers from reference/gravcam/figure_data.py (voices).
import { THREE, Panel, v3, figure, inset, letter, ACCENT, ACCENT2 } from '../lib.js';

// the chart of (a) LEFT - 4 points wide; the two skies, each SCALE points in radius, SPACING apart, the right one's
// edge as far from the right edge as the panel letter (a) is from the left (its parenthesis's side bearing)
const W = 504, LEFT = 248, SCALE = 60, SPACING = 132, BEARING = 0.7;
const CENTRES = [W - BEARING - SCALE - SPACING, W - BEARING - SCALE];
const FORMULA = 15;

const c = (re, im = 0) => ({ re, im });
const mul = (a, b) => c(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re);
const add = (a, b) => c(a.re + b.re, a.im + b.im);

/** A null vector m = (e1 + i e2)/sqrt 2 with e1 x e2 = k, as in the reference (pixel.null_frame). */
function nullVector(k) {
	const a = Math.abs(k.x) < 0.9 ? v3(1, 0, 0) : v3(0, 1, 0);
	const e1 = a.clone().cross(k).normalize();
	const e2 = k.clone().cross(e1);
	return [0, 1, 2].map((i) => c(e1.getComponent(i) / Math.SQRT2, e2.getComponent(i) / Math.SQRT2));
}

/** A colour ramp through the given stops, t in [0, 1]. */
function ramp(stops) {
	const cols = stops.map((s) => new THREE.Color(s));
	return (t) => {
		const x = Math.min(0.9999, Math.max(0, t)) * (cols.length - 1);
		const i = Math.floor(x);
		return '#' + cols[i].clone().lerp(cols[i + 1], x - i).getHexString();
	};
}

export default async function () {
	const d = await (await fetch('/reference/results/figures/voices.json')).json();
	const chart = await inset('/paper/figures/staging/voices-chart.svg', 0, 0, LEFT - 4);
	const COL = SPACING;
	const H = Math.round(chart.h);
	const A = (i, j) => c(d.A.re[i][j], d.A.im[i][j]);
	const a = (i) => c(d.a.re[i], d.a.im[i]);
	// the two maps, over directions n toward the sources (the waves travel along k = -n)
	const gravity = (n) => {
		const m = nullVector(n.clone().negate());
		let s = c(0);
		for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) s = add(s, mul(mul(m[i], A(i, j)), m[j]));
		return Math.hypot(s.re, s.im);
	};
	const light = (n) => {
		const m = nullVector(n.clone().negate());
		let s = c(0);
		for (let i = 0; i < 3; i++) s = add(s, mul(m[i], a(i)));
		return Math.hypot(s.re, s.im);
	};
	const skies = [
		{ q: gravity, found: d.found, count: 4, colour: ramp(['#3d1b03', '#b0560a', '#e8b98b', '#f9f1e7']), mark: ACCENT,
			title: '\\text{gravity: four waves}', formula: '|\\mathbf m^{T}\\!A\\,\\mathbf m|' },
		{ q: light, found: d.found_light, count: 2, colour: ramp(['#0c2747', '#2a67ad', '#a3c2e4', '#eff4fa']), mark: ACCENT2,
			title: '\\text{light: two waves}', formula: '|\\mathbf m\\cdot\\mathbf a|' }
	];
	const panels = [];
	skies.forEach((s, j) => {
		const P = new Panel({ x: CENTRES[j] - COL / 2, y: 0, w: COL, h: H, cx: 0, cy: 0.04, scale: SCALE, tilt: 6, turn: 0 });
		panels.push(P);
		// the largest value on the sky, for a scale in decades below it
		let top = 0;
		for (let i = 0; i < 6000; i++) {
			const y = 1 - (2 * (i + 0.5)) / 6000, r = Math.sqrt(1 - y * y), phi = i * Math.PI * (3 - Math.sqrt(5));
			top = Math.max(top, s.q(v3(r * Math.cos(phi), y, r * Math.sin(phi))));
		}
		const decades = 2.5;
		P.rasterSphere(v3(0, 0, 0), 1, (n) => s.colour(1 + Math.log10(Math.max(1e-12, s.q(n) / top)) / decades), {
			o: { ambient: 0.84, key: 0.22, fill: 0.04, spec: 0.05, wrap: 0.6 }, density: 4
		});
		// the true sources, ringed, and the zeros found from the readings alone, as dots; numbered outside the sky
		const [ox, oy] = P.at(v3(0, 0, 0));
		d.sources.slice(0, s.count).forEach((src, i) => {
			const n = v3(...src);
			const f = v3(...s.found.reduce((b, x) => (n.distanceTo(v3(...x)) < n.distanceTo(v3(...b)) ? x : b)));
			const [sx, sy] = P.at(n), [fx, fy] = P.at(f);
			P.items.push({ kind: 'raw', layer: 2, depth: 1, svg:
				`<circle cx="${sx.toFixed(2)}" cy="${sy.toFixed(2)}" r="4.2" fill="none" stroke="#ffffff" stroke-width="0.8"/>` +
				`<circle cx="${fx.toFixed(2)}" cy="${fy.toFixed(2)}" r="1.3" fill="#ffffff"/>` });
			const u = [sx - ox, sy - oy], L = Math.hypot(...u);
			const R = P.scale + 8;
			P.label(`${i + 1}`, [(ox + (u[0] / L) * R) - P.x, (oy + (u[1] / L) * R) - P.y], { size: 7.5, color: s.mark });
		});
		// the two formulas on one baseline, FORMULA points below the sky
		P.label(s.formula, v3(0, -1, 0), { size: 8, anchor: 'cB', dy: FORMULA });
		P.labels.push(letter('bc'[j], P.x, 1, s.title));
	});
	// (a): its letter and heading as those of (b) and (c), over the chart (charts.py, voices_chart, draws no heading)
	const extra = [Promise.resolve(chart.svg), letter('a', 0, 1, '\\text{four waves, each with its own waveform and polarization}')];
	return figure(W, H, panels, extra);
}
