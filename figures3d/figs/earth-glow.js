// Figure 15: the Earth in section, and its glow. (a) The Earth cut open along the plane of the drawing:
// the model's five shells to scale (radii from scenes/sun-at-midnight.scene.json), an observer on the
// night side, and three lines of sight that graze the boundaries of the inner core, the core and the
// lower mantle, at arcsin(r/R) from straight down: exact. The line to the Sun's core leaves 40 degrees
// from straight down, 50 below the horizon, as in Fig. 1: exact. Schematic: the observer, the stars,
// the Sun's size and distance. (b) Brightness against angle, from the reference implementation
// (paper/figures/charts.py), in the shells' colours.
import { THREE, Panel, v3, figure, inset, globeMap, INK, DIM, ACCENT, ACCENT2 } from '../lib.js';

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
	const P = new Panel({ x: 0, y: 0, w: 252, h: H, cx: 0.34, cy: -0.07, scale: 76, tilt: 14, turn: -26 });
	// three quarters of the globe: the quarter in front of the reader (x > 0, z > 0) is cut away
	const earth = await globeMap('/figures3d/textures/earth.jpg');
	// the camera stands at latitude 40 north (the top of the figure), so the globe's axis leans 50 degrees from the
	// figure's vertical, in the plane of the lines of sight (z = 0), toward the side on which the Sun lies: at local
	// midnight at an equinox the Sun is below the northern horizon, at right angles to the axis. The map is sampled
	// in that turned frame, with the camera's place at longitude 4 west (central Spain).
	const lean = (50 * Math.PI) / 180;
	const geographic = (q) => v3(q.x * Math.cos(lean) - q.y * Math.sin(lean), q.x * Math.sin(lean) + q.y * Math.cos(lean), q.z);
	P.rasterSphere(v3(0, 0, 0), 1, (q) => earth(geographic(q), -Math.PI - 0.065), {
		keep: (q) => !(q.x > 0 && q.z > 0), o: { spec: 0.1, shininess: 14, wrap: 0.45, ambient: 0.55, key: 0.6 }, density: 4, layer: -1
	});
	{
		const [gx, gy] = P.at(v3(0, 0, 0));
		P.items.push({ kind: 'raw', layer: -0.5, depth: 0, svg: `<circle cx="${gx.toFixed(2)}" cy="${gy.toFixed(2)}" r="${P.scale.toFixed(2)}" fill="none" stroke="${INK}" stroke-width="0.4"/>` });
	}
	// the two cut faces, each a half disc showing the shells: z = 0 for x > 0 (the lines of sight lie on it)
	// and x = 0 for z > 0
	const half = (rad, face) => {
		const pts = [];
		for (let k = 0; k <= 180; k++) {
			const s = -Math.PI / 2 + (Math.PI * k) / 180;
			pts.push(face === 'z' ? v3(rad * Math.cos(s), rad * Math.sin(s), 0) : v3(0, rad * Math.sin(s), rad * Math.cos(s)));
		}
		return pts;
	};
	for (const face of ['x', 'z']) {
		for (let i = 0; i < r.length; i++) {
			const outer = half(r[i], face);
			const inner = i + 1 < r.length ? half(r[i + 1], face).reverse() : [];
			P.polygon([...outer, ...inner], { fill: SHELLS[i], stroke: INK, width: 0.4, layer: face === 'z' ? 1.2 : 1 });
		}
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
		// out past the globe's outline (a circle of radius 1 seen from any side) before the label
		let k = 0.1;
		const c0 = P.cam(v3(0, 0, 0));
		while (k < 3) {
			const q = P.cam(end.clone().addScaledVector(d, k));
			if (Math.hypot(q.x - c0.x, q.y - c0.y) > 1.1) break;
			k += 0.02;
		}
		const tip = end.clone().addScaledVector(d, k);
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
