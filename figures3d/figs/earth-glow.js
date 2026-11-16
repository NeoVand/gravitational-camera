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
	// the camera, at the surface on the night side; every line of sight starts there
	const O = v3(0, 1, 0);
	P.curve([O, v3(0, -1, 0)], { color: DIM, width: 0.4, dash: [1.6, 1.6], layer: 2 });
	P.sphere(O, 0.03, '#3a3630', { layer: 4, spec: 0.2 });
	P.label('\\text{camera}', v3(-0.06, 1.06, 0), { size: 7.5, anchor: 'rb' });
	// lines of sight that graze each boundary: sin(alpha) = r / R
	const graze = [[r[4], 'inner core'], [r[3], 'core'], [r[2], 'lower mantle']];
	for (const [rr] of graze) {
		const al = Math.asin(rr);
		const d = v3(Math.sin(al), -Math.cos(al), 0);
		const end = O.clone().addScaledVector(d, 2 * Math.cos(al));
		P.curve([O, end], { width: 0.45, layer: 2 });
		// a faint leader carries the line out past the globe to its angle
		const tip = end.clone().addScaledVector(d, 0.55 - 0.25 * Math.cos(al));
		P.curve([end, tip], { color: DIM, width: 0.35, dash: [0.8, 1.6], layer: 2 });
		P.label(`${Math.round((al * 180) / Math.PI)}^\\circ`, tip.clone().addScaledVector(d, 0.1), { size: 7.5, anchor: 'cc' });
	}
	// light stops at the ground; gravity runs on to the Sun, 40 degrees from straight down
	const sd = v3(Math.sin((40 * Math.PI) / 180), -Math.cos((40 * Math.PI) / 180), 0);
	const sun = O.clone().addScaledVector(sd, 2.42);
	P.curve([O, sun.clone().addScaledVector(sd, -0.16)], { color: ACCENT, width: 0.9, layer: 2 });
	P.sphere(sun, 0.15, '#f2a54a', { layer: 4, spec: 0.25, ambient: 0.75, key: 0.35 });
	P.label('\\text{Sun}', sun.clone().add(v3(0.24, -0.02, 0)), { size: 7.5, anchor: 'lc', color: ACCENT });

	P.label('\\text{(a)}', [4, 5], { anchor: 'lt' });

	const chart = await inset('/paper/figures/staging/earth-glow-chart.svg', 248, 4, 256);
	const extra = [chartLabel()];
	function chartLabel() { return Promise.resolve(chart.svg); }
	const b = new Panel({ x: 248, y: 0, w: 10, h: 10 });
	b.label('\\text{(b)}', [4, 5], { anchor: 'lt' });
	return figure(504, Math.max(H, chart.h + 4), [P, b], extra);
}
