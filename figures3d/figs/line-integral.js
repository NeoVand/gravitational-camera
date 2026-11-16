// Figure 12: two ways of forming a picture. A camera's line of sight passes through a closed door, a
// closed iron furnace with a hot iron block inside, and a person. In light it ends at the door. In
// gravity it runs through everything, and the pixel reports the sum along it of each body's number
// emissivity times the length of the line inside it. Exact: the line is straight, and the glowing
// stretches are the lengths of the line inside each body. Schematic: the objects, and the relative
// glow (the stacked bar uses illustrative values: the hot iron far brighter than the door and the person).
import { THREE, Panel, v3, figure, INK, ACCENT, ACCENT2, RULE } from '../lib.js';

const WOOD = '#b48a5e', IRON = '#5e6269', SKIN = '#a3998d', CAM = '#3d3a35', HOT = '#f39a3d';
const Y = 0.62;                                      // height of the line of sight

function box(P, c, s, color, o = {}) {
	const g = new THREE.BoxGeometry(s[0], s[1], s[2]);
	P.mesh(g, color, { matrix: new THREE.Matrix4().makeTranslation(c[0], c[1], c[2]), o: { smooth: false, spec: 0.08, ...o }, opacity: o.opacity ?? 1, layer: o.layer ?? 0 });
}

function scene(P, gravity) {
	const ghost = gravity ? 0.4 : 0.22;
	// the camera on its tripod
	box(P, [0.32, Y, 0], [0.42, 0.3, 0.3], CAM, { ambient: 0.5 });
	P.mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.16, 24), CAM, { matrix: new THREE.Matrix4().makeRotationZ(Math.PI / 2).setPosition(0.6, Y, 0), o: { ambient: 0.5 } });
	for (const [dx, dz] of [[-0.2, 0.15], [0.2, 0.15], [0, -0.22]]) P.curve([v3(0.32, Y - 0.15, 0), v3(0.32 + dx, -0.45, dz)], { width: 0.8, color: CAM });
	// the door
	box(P, [1.7, 0.45, 0], [0.07, 1.8, 1.0], WOOD, { opacity: gravity ? ghost : 1, ambient: 0.45 });
	// the furnace, its chimney, and (seen by gravity) the hot block inside
	box(P, [3.0, 0.4, 0], [1.0, 1.1, 0.9], IRON, { opacity: gravity ? ghost : ghost, ambient: 0.5 });
	P.mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.45, 24), IRON, { matrix: new THREE.Matrix4().makeTranslation(3.15, 1.17, -0.1), opacity: ghost, o: { ambient: 0.5 } });
	if (gravity) box(P, [3.0, Y, 0], [0.42, 0.26, 0.36], HOT, { ambient: 0.8, key: 0.35, layer: 1 });
	// the person
	const op = gravity ? ghost : ghost;
	P.mesh(new THREE.CapsuleGeometry(0.17, 0.5, 8, 24), SKIN, { matrix: new THREE.Matrix4().makeTranslation(4.4, 0.62, 0), opacity: op, o: { ambient: 0.5 } });
	for (const dz of [-0.08, 0.08]) P.mesh(new THREE.CapsuleGeometry(0.065, 0.45, 6, 16), SKIN, { matrix: new THREE.Matrix4().makeTranslation(4.4, 0.0, dz), opacity: op, o: { ambient: 0.5 } });
	P.sphere(v3(4.4, 1.17, 0), 0.13, SKIN, { opacity: op, layer: 0 });
	P.curve([v3(-0.4, -0.45, 0.5), v3(5.6, -0.45, 0.5)], { color: RULE, width: 0.4, layer: -5 });
}

export default async function () {
	const H = 112;
	const light = new Panel({ x: 0, y: 0, w: 504, h: H, cx: 2.6, cy: 0.42, scale: 46, tilt: 12, turn: -24 });
	const grav = new Panel({ x: 0, y: H, w: 504, h: H, cx: 2.6, cy: 0.42, scale: 46, tilt: 12, turn: -24 });
	scene(light, false);
	scene(grav, true);
	// light: the ray stops at the door
	light.curve([v3(0.68, Y, 0), v3(1.665, Y, 0)], { color: ACCENT2, width: 1.0, layer: 5 });
	light.sphere(v3(1.665, Y, 0), 0.035, ACCENT2, { layer: 5, ambient: 1, key: 0, spec: 0 });
	// gravity: the line runs through; inside each body it glows, as long as the body is deep
	grav.curve([v3(0.68, Y, 0), v3(5.25, Y, 0)], { color: ACCENT, width: 0.7, layer: 5 });
	const spans = [[1.665, 1.735, 0.8], [2.79, 3.21, 5.0], [4.23, 4.57, 1.4]];   // door, hot block, person: x0, x1, glow
	for (const [x0, x1, j] of spans) {
		const r = 0.03 + 0.012 * j;
		grav.mesh(new THREE.CylinderGeometry(r, r, x1 - x0, 24), HOT, { matrix: new THREE.Matrix4().makeRotationZ(Math.PI / 2).setPosition((x0 + x1) / 2, Y, 0), layer: 6, o: { ambient: 0.9, key: 0.3, spec: 0.1 } });
	}
	// the sum: each body's glow times its length, stacked
	let base = 0.05;
	grav.label('\\Sigma', v3(5.38, Y, 0), { size: 10, anchor: 'rc' });
	for (const [x0, x1, j] of spans) {
		const h = (x1 - x0) * j * 0.32;
		box(grav, [5.6, base + h / 2, 0], [0.16, h, 0.16], HOT, { ambient: 0.75, key: 0.4, layer: 6 });
		base += h;
	}
	light.label('\\textit{light}', [8, 8], { anchor: 'lt', size: 10, color: ACCENT2 });
	grav.label('\\textit{gravity}', [8, 8], { anchor: 'lt', size: 10, color: ACCENT });
	return figure(504, 2 * H, [light, grav]);
}
