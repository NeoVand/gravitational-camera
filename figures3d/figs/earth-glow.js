// Figure 15: the Earth in section, and its glow. (a) The Earth cut open along the plane of the drawing:
// the model's five shells to scale (radii from scenes/sun-at-midnight.scene.json), an observer on the
// night side, and three lines of sight that graze the boundaries of the inner core, the core and the
// lower mantle, at arcsin(r/R) from straight down: exact. The line to the Sun's core leaves 40 degrees
// from straight down, 50 below the horizon, as in Fig. 1: exact. Schematic: the observer, the stars,
// the Sun's size and distance. (b) Brightness against angle, from the reference implementation
// (paper/figures/charts.py), in the shells' colours.
import { THREE, Panel, v3, figure, inset, INK, DIM, ACCENT, ACCENT2 } from '../lib.js';

const SHELLS = ['#f1e9de', '#f1d9bd', '#ebc59c', '#e2a86f', '#d48a46'];
const SURFACE = '#a9b0b8';

function circle(r, n = 360, z = 0) {
	const pts = [];
	for (let k = 0; k < n; k++) {
		const t = (2 * Math.PI * k) / n;
		pts.push(v3(r * Math.cos(t), r * Math.sin(t), z));
	}
	return pts;
}

export default async function () {
	const scene = await (await fetch('/scenes/sun-at-midnight.scene.json')).json();
	const byId = Object.fromEntries(scene.objects.map((o) => [o.id, o]));
	const ids = ['earth', 'upper-mantle', 'lower-mantle', 'outer-core', 'inner-core'];
	const radii = ids.map((k) => byId[k].shape.radius);
	const R = radii[0];
	const r = radii.map((x) => x / R);

	const H = 206;
	const P = new Panel({ x: 0, y: 0, w: 252, h: H, cx: 0.42, cy: -0.06, scale: 78, tilt: 12, turn: -40 });
	// the far half of the globe, behind the cut
	const back = new THREE.SphereGeometry(1, 72, 40, Math.PI, Math.PI);
	P.mesh(back, SURFACE, { o: { spec: 0.12, shininess: 14, wrap: 0.4, ambient: 0.4 } });
	// a graticule on it, every 20 degrees, drawn only where the surface faces us
	const facing = (q) => P.cam(q).z > 0.02 || false;
	const runs = (pts) => {
		let run = [];
		for (const q of pts) {
			const n = q.clone().normalize().applyMatrix4(P.rot);
			if (n.z > 0.03) run.push(q);
			else { if (run.length > 1) P.curve(run, { color: '#6f7780', width: 0.3, layer: 0.5 }); run = []; }
		}
		if (run.length > 1) P.curve(run, { color: '#6f7780', width: 0.3, layer: 0.5 });
	};
	void facing;
	for (let lon = 0; lon <= 180; lon += 20) {
		const ph = Math.PI + (lon * Math.PI) / 180;
		const pts = [];
		for (let k = 0; k <= 90; k++) {
			const th = (Math.PI * k) / 90;
			pts.push(v3(-Math.cos(ph) * Math.sin(th), Math.cos(th), Math.sin(ph) * Math.sin(th)).multiplyScalar(1.002));
		}
		runs(pts);
	}
	for (let lat = -80; lat <= 80; lat += 20) {
		const th = Math.PI / 2 - (lat * Math.PI) / 180;
		const pts = [];
		for (let k = 0; k <= 90; k++) {
			const ph = Math.PI + (Math.PI * k) / 90;
			pts.push(v3(-Math.cos(ph) * Math.sin(th), Math.cos(th), Math.sin(ph) * Math.sin(th)).multiplyScalar(1.002));
		}
		runs(pts);
	}
	// the cut face: the shells, from the crust inward
	for (let i = 0; i < r.length; i++) {
		P.annulus(circle(r[i]), i + 1 < r.length ? circle(r[i + 1]).reverse() : null,
			{ fill: SHELLS[i], stroke: INK, width: 0.4, layer: 1, depthBias: 0 });
	}
	// the observer, standing on the cut at the top
	const O = v3(0, 1, 0);
	P.curve([v3(0, 1.0, 0.001), v3(0, 1.075, 0.001)], { width: 1.1, layer: 3, cap: 'butt' });
	P.sphere(v3(0, 1.1, 0.001), 0.022, '#3a3630', { layer: 3, spec: 0.1 });
	// lines of sight that graze each boundary: sin(alpha) = r / R
	const graze = [[r[4], 'inner core'], [r[3], 'core'], [r[2], 'lower mantle']];
	for (const [rr] of graze) {
		const al = Math.asin(rr);
		const d = v3(Math.sin(al), -Math.cos(al), 0);
		const end = O.clone().addScaledVector(d, 2 * Math.cos(al));
		P.curve([O, end], { width: 0.45, layer: 2 });
		P.label(`${Math.round((al * 180) / Math.PI)}^\\circ`, end.clone().addScaledVector(d, 0.07), { size: 7.5, anchor: 'lt', dx: 2 });
	}
	// light stops at the ground; gravity runs on to the Sun, 40 degrees from straight down
	P.curve([v3(-0.012, 1.1, 0.002), v3(-0.075, 1.0, 0.002)], { color: ACCENT2, width: 0.8, layer: 3 });
	const sd = v3(Math.sin((40 * Math.PI) / 180), -Math.cos((40 * Math.PI) / 180), 0);
	const sun = O.clone().addScaledVector(sd, 2.42);
	P.curve([O, sun.clone().addScaledVector(sd, -0.16)], { color: ACCENT, width: 0.9, layer: 2 });
	P.sphere(sun, 0.15, '#f2a54a', { layer: 4, spec: 0.25, ambient: 0.75, key: 0.35 });
	P.label('\\text{Sun}', sun.clone().add(v3(0.19, 0, 0)), { size: 7.5, anchor: 'lc', color: ACCENT });
	// stars over the night side
	let seed = 7;
	const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
	const stars = [];
	for (let k = 0; k < 34; k++) {
		const x = 6 + rnd() * 236, y = 4 + rnd() * 34, s = 0.6 + 1.6 * rnd();
		const pts = [];
		for (let j = 0; j < 8; j++) {
			const t = (Math.PI * j) / 4, rad = j % 2 ? 0.28 * s : s;
			pts.push(`${(x + rad * Math.sin(t)).toFixed(2)},${(y - rad * Math.cos(t)).toFixed(2)}`);
		}
		stars.push(`<path d="M${pts.join('L')}Z" fill="${DIM}"/>`);
	}
	P.items.push({ kind: 'raw', svg: stars.join(''), layer: -10, depth: 0 });
	P.label('\\text{(a)}', [4, 5], { anchor: 'lt' });

	const chart = await inset('/paper/figures/staging/earth-glow-chart.svg', 248, 4, 256);
	const extra = [chartLabel()];
	function chartLabel() { return Promise.resolve(chart.svg); }
	const b = new Panel({ x: 248, y: 0, w: 10, h: 10 });
	b.label('\\text{(b)}', [4, 5], { anchor: 'lt' });
	return figure(504, Math.max(H, chart.h + 4), [P, b], extra);
}
