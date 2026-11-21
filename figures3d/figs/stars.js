// The four stars of gravity against the two of light. Each disc is the sky around one pixel; the dots are the
// field's principal null directions (its stars), computed by the reference implementation
// (reference/gravcam/figure_data.py, stars), with coincident stars drawn as touching dots so that every sphere
// in the top row holds four and every sphere in the bottom row two.
import { THREE, Panel, v3, figure, INK, DIM, RULE, ACCENT, ACCENT2 } from '../lib.js';

const SKY = '#eeebe5', BODY = '#a7a299', PIXEL = '#868b92', PAGE = '#fffffe';
// the sky is drawn flat in SKY at this opacity, a veil over what lies behind it
const VEIL = 0.72;
// the row names in a gutter LEFT wide, then four columns COL apart; the drawing's ink as far from the right edge as
// the names are from the left
const W = 504, HEAD = 10, ROW = 98, LEFT = 37, COL = 122;

/** A colour as it shows through the veil of the sky (over the page): what lies on the far side looks like this. */
function veiled(c) {
	if (c === 'none') return c;
	// mixed as the page mixes them, in sRGB
	const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
	const [a, b] = [rgb(c), rgb(SKY)];
	return '#' + a.map((x, i) => Math.round((1 - VEIL) * x + VEIL * b[i]).toString(16).padStart(2, '0')).join('');
}

const vec = (a) => v3(a[0], a[1], a[2]);

function screenBasis(P) {
	const M = new THREE.Matrix4().copy(P.rot).invert();
	return [v3(1, 0, 0).applyMatrix4(M), v3(0, 1, 0).applyMatrix4(M)];
}

/** A dot `r` points across at world point p, drawn flat to the reader. One on the far side of the sky (when no
 * layer is given) is drawn above the sky's fill in the colours the veil gives it, and beneath its outline, so that a
 * dot that reaches past the outline is one colour throughout. */
export function disc(P, p, r, { fill = INK, stroke = 'none', width = 0, layer, offset = [0, 0], opacity = 1, n = 28 } = {}) {
	if (layer === undefined && P.cam(p).z <= 0) {
		[fill, stroke, layer] = [veiled(fill), veiled(stroke), 0.5];
	}
	const [ex, ey] = screenBasis(P);
	const c = p.clone().addScaledVector(ex, offset[0] / P.scale).addScaledVector(ey, offset[1] / P.scale);
	const pts = [];
	for (let k = 0; k < n; k++) {
		const t = (2 * Math.PI * k) / n;
		pts.push(c.clone().addScaledVector(ex, (r * Math.cos(t)) / P.scale).addScaledVector(ey, (r * Math.sin(t)) / P.scale));
	}
	P.polygon(pts, { fill, stroke, width, opacity, layer: layer ?? 2 });
}

/** The sky around a pixel, flat, in a tint of the page (so that it follows the site's theme): its fill a veil over
 * what lies behind (layer 0), its outline drawn over the far side's dots (layer 0.6). */
export function veil(P, { fill = SKY, stroke = RULE, opacity = VEIL } = {}) {
	disc(P, v3(0, 0, 0), P.scale, { fill, opacity, n: 160, layer: 0 });
	disc(P, v3(0, 0, 0), P.scale, { fill: 'none', stroke, width: 0.5, opacity, n: 160, layer: 0.6 });
}

/** A star of multiplicity n: n touching dots, so that they can be counted. */
function star(P, p, n, color) {
	const r = 2.0, s = 1.8;
	const at = { 1: [[0, 0]], 2: [[-s, 0], [s, 0]], 4: [[-s, s], [s, s], [-s, -s], [s, -s]] }[n];
	for (const o of at) disc(P, p, r, { fill: color, stroke: PAGE, width: 0.45, offset: o });
}

/** A great circle on the unit sky with the given normal: solid in front, dashed behind. */
export function greatCircle(P, normal, { color = RULE, width = 0.4 } = {}) {
	const n = normal.clone().normalize();
	const a = Math.abs(n.x) < 0.9 ? v3(1, 0, 0) : v3(0, 1, 0);
	const u = a.clone().sub(n.clone().multiplyScalar(a.dot(n))).normalize();
	const w = n.clone().cross(u);
	const pts = [];
	for (let k = 0; k <= 180; k++) {
		const t = (2 * Math.PI * k) / 180;
		pts.push(u.clone().multiplyScalar(Math.cos(t)).addScaledVector(w, Math.sin(t)));
	}
	runs(P, pts, { color, width });
}

/** A curve on the sky, split where it passes behind: solid in front, faint and dashed behind. */
export function runs(P, pts, { color, width }) {
	let run = [], front = null;
	const flush = () => {
		if (run.length > 1) {
			P.curve(run, front
				? { color, width, layer: 1 }
				: { color, width: width * 0.85, dash: [1.2, 1.6], opacity: 0.8, layer: -1 });
		}
	};
	for (const p of pts) {
		const f = P.cam(p).z > 0;
		if (front !== null && f !== front) { run.push(p); flush(); run = [p]; } else run.push(p);
		front = f;
	}
	flush();
}

function sky(P) {
	veil(P);
	greatCircle(P, v3(0, 1, 0));
	P.sphere(v3(0, 0, 0), 0.055, PIXEL, { spec: 0.5, layer: 3 });
}

function body(P, p, r = 0.12) {
	P.sphere(p, r, BODY, { spec: 0.35, layer: 3 });
	P.curve([p, v3(0, 0, 0)], { color: DIM, width: 0.35, dash: [1.4, 1.6], layer: 1 });
}

export default async function () {
	const d = await (await fetch('/reference/results/figures/stars.json')).json();
	const panels = [];
	const rows = [
		{ key: 'gravity', color: ACCENT, label: '\\text{gravity}', note: '\\text{four directions}' },
		{ key: 'light', color: ACCENT2, label: '\\text{light}', note: '\\text{two directions}' }
	];
	const heads = ['\\text{one wave}', '\\text{one source at rest}', '\\text{one source at } 0.9\\,c', '\\text{two sources at rest}'];
	const types = ['\\text{type N}', '\\text{type D}', '\\text{type D}', '\\text{type I}'];
	rows.forEach((row, i) => {
		const y = HEAD + i * ROW;
		const g = d[row.key];
		const make = (j) => {
			const P = new Panel({ x: LEFT + j * COL, y, w: COL, h: ROW, cx: 0, cy: 0.06, scale: 31, tilt: 14, turn: 25 });
			panels.push(P);
			sky(P);
			return P;
		};
		// one wave
		let P = make(0);
		const k = vec(d.k);
		P.arrow(v3(0, 0, 0), k.clone().multiplyScalar(0.8), { color: DIM, width: 0.55, head: 3.4, layer: 2 });
		P.label('\\hat k', k.clone().multiplyScalar(0.55).add(v3(0, 0.22, 0)), { size: 7.5, color: DIM });
		for (const [s, n] of g.wave) star(P, vec(s), n, row.color);
		// one source at rest
		P = make(1);
		body(P, vec(d.body));
		for (const [s, n] of g.track[0].stars) star(P, vec(s), n, row.color);
		// the same source moving up at 0.9 c: the stars fold toward its velocity, and their midpoint is v_perp / c
		P = make(2);
		body(P, vec(d.body));
		P.arrow(vec(d.body).add(v3(0, 0.17, 0)), vec(d.body).add(v3(0, 0.82, 0)), { color: INK, width: 0.6, head: 3.4, layer: 3 });
		P.label('\\mathbf v', vec(d.body).add(v3(-0.2, 0.5, 0)), { size: 7.5 });
		// the paths lie on the meridian through the velocity, which is not drawn: in front it would run along the
		// sky's outline at the lower left and read as a second outline; the paths themselves are the part that matters
		for (const side of [-1, 1]) {
			const path = g.track.map((t) => vec(t.stars.find(([s]) => Math.sign(s[0]) === side)[0]));
			runs(P, path, { color: row.color, width: 0.7 });
			disc(P, path[0], 2.0, { fill: PAGE, stroke: row.color, width: 0.5 });
		}
		const end = g.track[g.track.length - 1];
		for (const [s, n] of end.stars) star(P, vec(s), n, row.color);
		const ends = end.stars.map(([s]) => vec(s));
		P.curve(ends, { color: DIM, width: 0.4, dash: [1.4, 1.4], layer: 2 });
		P.arrow(v3(0, 0, 0), vec(end.midpoint), { color: INK, width: 0.65, head: 3.6, layer: 2 });
		P.label('\\mathbf v_{\\!\\perp}/c', vec(end.midpoint).multiplyScalar(0.5).add(v3(0.36, 0, 0)), { size: 7.5 });
		// two sources at rest
		P = make(3);
		d.pair.forEach((p, m) => body(P, vec(p), m === 0 ? 0.12 : 0.095));
		for (const [s, n] of g.pair) star(P, vec(s), n, row.color);

		// the row's name, and under each sky what it shows
		panels[panels.length - 4].label(row.label, [-LEFT + 4, ROW / 2 - 6], { size: 8.5, anchor: 'lc', color: row.color });
		panels[panels.length - 4].label(row.note, [-LEFT + 4, ROW / 2 + 6], { size: 7.5, anchor: 'lc', color: DIM });
		if (row.key === 'gravity') {
			types.forEach((t, j) => panels[panels.length - 4 + j].label(t, [COL / 2, ROW - 5], { size: 7.5, anchor: 'cb', color: DIM }));
		} else {
			panels[panels.length - 1].label('\\text{as for one charge}', [COL / 2, ROW - 5], { size: 7.5, anchor: 'cb', color: DIM });
		}
	});
	heads.forEach((h, j) => panels[j].label('\\vphantom{(}' + h, [COL / 2, -HEAD + 3], { size: 8, anchor: 'ct' }));
	return figure(W, HEAD + 2 * ROW, panels);
}
