// The two readings as one transform. The scene's transform, Fourier across a flat camera and Laplace in depth,
// lives in the space of K (two components, across the camera) and kap (the rate of decay with depth).
// (a) A reading at one time holds it on the cone kap = |K|, drawn here from its equation as a glass surface with
// a blue outline. Readings at two times hold it inside the cone, tinted orange. A pair of harmonic functions with
// wave vectors k and k' is two points of the cone: the two blue arrows, which lie on the two generators that are
// the cone's outline from where we stand. Their product reads the transform at the sum of the two,
// (K, kap) = (k + k', |k| + |k'|), which lies inside (orange arrow; the dashed lines complete the parallelogram).
// (b) The same pair seen from above, in the plane of K, the reader below: k and k' go from 0 to K by way of a
// point of the ellipse with foci 0 and K, and every point of that ellipse gives a pair with the same sum and the
// same |k| + |k'| = kap. One more pair is drawn faintly. (On the cone these pairs lie on a section by a plane,
// which the view of (a) sees edge-on whenever the pair drawn lies on the outline; it is not drawn there.)
// The view, the point (K, kap), the pair drawn in full, the two others and the ellipse are the reference
// implementation's (reference/gravcam/figure_data.py, two_readings; readings.pair_on_the_ellipse), which also
// checks that every pair on the ellipse gives the same value of the transform for a scene of three masses.
// Nothing here is schematic: the greatest kap drawn is the unit.
import { THREE, Panel, v3, figure, letter, INK, DIM, ACCENT, ACCENT2 } from '../lib.js';

const GLASS = '#f1c9a1';             // the tint of the inside, as the caps of figs/sky-integral.js
const GLASS_NIGHT = '#7a4c22';       // and on the site's dark theme, where the labels on it are pale
const PALE = '#9db8d9';              // the further pair of panel (b): the blue, paler
const W = 246, H = 172;
const S = 92;                        // points per unit of kap
const APEX = [142.32, 135];          // the cone's tip on the page: the drawing's ink 0.72 pt from the right edge, as
                                     // the panel letters' is from the left
const AXIS = 1.41, FLOOR = 0.6;      // how far the axis of kap and the two of K are drawn
const SB = 136, PLAN = [47.32, 133]; // panel (b): points per unit, and the centre of its ellipse on the page
const SHORT = 1.1 + 1;               // the arrows that end at K stop this far short of it: its dot, and a point clear

/** The part of the cone kap = |K| between the azimuths a and b, up to kap = 1: a fan of triangles from the tip. */
function sector(a, b, n = 72) {
	const pos = [], nor = [];
	for (let i = 0; i < n; i++) {
		const p = a + ((b - a) * i) / n, q = a + ((b - a) * (i + 1)) / n, m = (p + q) / 2;
		pos.push(0, 0, 0, Math.cos(p), 1, Math.sin(p), Math.cos(q), 1, Math.sin(q));
		nor.push(Math.cos(m), -1, Math.sin(m), Math.cos(p), -1, Math.sin(p), Math.cos(q), -1, Math.sin(q));
	}
	const g = new THREE.BufferGeometry();
	g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
	g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
	return g;
}

/** The point of the cone above the wave vector k = (k_x, k_y): x across, y up (kap), z toward the reader. */
const lift = ([kx, ky], kap = Math.hypot(kx, ky)) => v3(kx, kap, ky);
const text = (s) => `\\vphantom{(}\\text{${s}}`;

export default async function () {
	const d = await (await fetch('/reference/results/figures/two-readings.json')).json();
	if (d.disagreement > 1e-9) throw new Error('the pairs on the ellipse disagree: ' + d.disagreement);
	if (Math.abs(Math.hypot(...d.k) + Math.hypot(...d.kp) - d.kap) > 1e-12) throw new Error('the pair is not on the ellipse');

	const A = new Panel({ x: 0, y: 0, w: W, h: H, scale: S, tilt: d.tilt_deg, turn: d.turn_deg });
	// put the tip at APEX
	const [ax, ay] = A.at(v3(0, 0, 0));
	A.x += APEX[0] - ax; A.y += APEX[1] - ay;
	// the direction to the reader, in the cone's space, and the azimuths between which the outside of the cone faces us
	const eye = v3(0, 0, 1).applyMatrix4(new THREE.Matrix4().copy(A.rot).invert());
	const mid = Math.atan2(eye.z, eye.x), half = Math.acos(eye.y / Math.hypot(eye.x, eye.z));
	const shade = { ambient: 0.86, key: 0.2, fill: 0.05, spec: 0 };

	// the far wall, seen from inside; then what lies inside; then the near wall over it
	A.mesh(sector(mid + half, mid - half + 2 * Math.PI), GLASS, { cull: false, opacity: 0.62, layer: 0, o: shade, night: GLASS_NIGHT });
	A.mesh(sector(mid - half, mid + half), GLASS, { cull: false, opacity: 0.4, layer: 4, o: shade, night: GLASS_NIGHT });
	// its outline: the rim and the two generators at which the surface turns away
	const rim = Array.from({ length: 181 }, (_, i) => v3(Math.cos((i * Math.PI) / 90), 1, Math.sin((i * Math.PI) / 90)));
	A.curve(rim, { color: ACCENT2, width: 0.55, layer: 5 });
	const edges = [1, -1].map((s) => v3(Math.cos(mid + s * half), 1, Math.sin(mid + s * half)));
	for (const e of edges) A.curve([v3(0, 0, 0), e], { color: ACCENT2, width: 0.55, layer: 5 });

	// the axes: kap up through the cone, faint inside it, and the two components of K on the floor
	A.arrow(v3(0, 0, 0), v3(0, AXIS, 0), { color: DIM, width: 0.45, head: 3.2, layer: 1 });
	A.arrow(v3(0, 0, 0), v3(FLOOR, 0, 0), { color: DIM, width: 0.45, head: 3.2, layer: 6 });
	A.arrow(v3(0, 0, 0), v3(0, 0, FLOOR), { color: DIM, width: 0.45, head: 3.2, layer: 6 });
	A.label('\\kappa', v3(0, AXIS, 0), { size: 8, anchor: 'lc', dx: 3, dy: 1, color: DIM });
	A.label('K_x', v3(FLOOR, 0, 0), { size: 8, anchor: 'lc', dx: 3, color: DIM });
	A.label('K_y', v3(0, 0, FLOOR), { size: 8, anchor: 'lc', dx: 3, dy: 2, color: DIM });

	// the pair drawn in full, on the outline, and its sum
	const O = v3(0, 0, 0), k = lift(d.k), kp = lift(d.kp), sum = lift(d.K, d.kap);
	[[k, edges[0]], [kp, edges[1]]].forEach(([p, e]) => {
		if (p.clone().normalize().distanceTo(e.clone().normalize()) > 1e-9) throw new Error('a vector of the pair is off the outline');
	});
	for (const p of [k, kp]) A.curve([p, sum], { color: DIM, width: 0.4, dash: [1.6, 1.4], layer: 6, cap: 'butt' });
	A.arrow(O, sum, { color: ACCENT, width: 0.9, head: 4.6, layer: 7 });
	A.arrow(O, k, { color: ACCENT2, width: 0.9, head: 4.6, layer: 7 });
	A.arrow(O, kp, { color: ACCENT2, width: 0.9, head: 4.6, layer: 7 });
	A.label('\\mathbf{k}', k.clone().multiplyScalar(0.62), { size: 8.5, anchor: 'rc', dx: -4, dy: 3 });
	A.label("\\mathbf{k}'", kp, { size: 8.5, anchor: 'lc', dx: 5, dy: -1 });
	A.label('(\\mathbf{K},\\,\\kappa)', sum, { size: 8.5, anchor: 'rb', dx: 5, dy: -2.5 });
	// what each reading holds
	A.label(text('at two times'), v3(0, 1, 0), { size: 7.5, anchor: 'lc', dx: 14, color: ACCENT });
	A.label(text('at one time'), edges[1].clone().multiplyScalar(0.7), { size: 7.5, anchor: 'lc', dx: 6, dy: 2, color: ACCENT2 });
	A.labels.push(letter('a', 0, 1));

	// ---- (b) the plane of K seen from above, the reader below: across the page as in (a), and toward the reader down
	const B = new Panel({ x: 0, y: 0, w: W, h: H, scale: SB });
	const t = (d.turn_deg * Math.PI) / 180, c = Math.cos(t), s = Math.sin(t);
	const plan = ([kx, ky]) => v3(kx * c + ky * s, kx * s - ky * c, 0);
	B.centre = plan(d.K).multiplyScalar(0.5);
	B.x = PLAN[0] - W / 2; B.y = PLAN[1] - H / 2;
	const zero = plan([0, 0]), end = plan(d.K);
	for (const o of d.others) {
		B.curve([zero, plan(o), end], { color: PALE, width: 0.45, layer: 0 });
		B.sphere(plan(o), 1.0 / SB, PALE, { ambient: 1, key: 0, fill: 0, spec: 0, layer: 2 });
	}
	for (const f of [zero, end]) B.sphere(f, 1.1 / SB, INK, { ambient: 1, key: 0, fill: 0, spec: 0, layer: 4 });
	B.curve([...d.ellipse, d.ellipse[0]].map(plan), { color: ACCENT2, width: 0.45, layer: 1 });
	const short = (a, b) => b.clone().sub(a).setLength(b.distanceTo(a) - SHORT / SB).add(a);
	B.arrow(zero, short(zero, end), { color: ACCENT, width: 0.9, head: 4.6, layer: 2 });
	B.arrow(zero, plan(d.k), { color: ACCENT2, width: 0.9, head: 4.6, layer: 3 });
	B.arrow(plan(d.k), short(plan(d.k), end), { color: ACCENT2, width: 0.9, head: 4.6, layer: 3 });
	const between = (a, b, f = 0.5) => plan([a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]);
	B.label('\\mathbf{k}', between([0, 0], d.k, 0.5), { size: 8.5, anchor: 'cb', dy: -2.5 });
	B.label("\\mathbf{k}'", between(d.k, d.K, 0.5), { size: 8.5, anchor: 'ct', dx: -2, dy: 3 });
	B.label('\\mathbf{K}', end, { size: 8.5, anchor: 'ct', dx: 1, dy: 3.5 });
	B.label('0', zero, { size: 7.5, anchor: 'lb', dx: 2.5, dy: -2, color: DIM });
	B.labels.push(letter('b', 0, 87));

	return figure(W, H, [A, B]);
}
