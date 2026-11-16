// Figure 5: the sky integral. (a) A pixel, the thin cone of directions dOmega about n, and the matter in
// it between r and r + dr, inside a body of density rho (drawn translucent). Schematic: the body's shape
// and the cone's width. (b) The weight with which E_zz takes matter in each direction,
// 1 - 3 cos^2 theta, as the surface r = |1 - 3 cos^2 theta| about z: exact. The lobes (negative weight)
// hold the directions in which matter stretches z, the ring (positive) those in which it squeezes z.
import { THREE, Panel, v3, figure, INK, DIM, FAINT, RULE, ACCENT } from '../lib.js';

const STONE = '#cdbca3', STEEL = '#bcc4cc', SAND = '#dccdb6';

function lathe(fn, t0, t1, n = 56) {
	const pts = [];
	for (let k = 0; k <= n; k++) {
		const t = t0 + ((t1 - t0) * k) / n;
		const r = Math.abs(fn(t));
		pts.push(new THREE.Vector2(Math.max(1e-4, r * Math.sin(t)), r * Math.cos(t)));
	}
	return new THREE.LatheGeometry(pts, 64);
}

export default async function () {
	const H = 196;
	// (a)
	const A = new Panel({ x: 0, y: 0, w: 312, h: H, cx: 2.55, cy: 0.35, scale: 46, tilt: 8, turn: -12 });
	const th = (13 * Math.PI) / 180, half = (4.2 * Math.PI) / 180;
	const n = v3(Math.cos(th), Math.sin(th), 0);
	const reach = 5.7;
	// the cone, as a pale translucent surface between its two edge lines
	const cone = new THREE.ConeGeometry(reach * Math.tan(half), reach, 48, 1, true);
	const m = new THREE.Matrix4().makeRotationZ(th - Math.PI / 2).multiply(new THREE.Matrix4().makeRotationX(Math.PI)).setPosition(n.clone().multiplyScalar(reach / 2));
	A.mesh(cone, '#e9e4da', { matrix: m, cull: false, opacity: 0.35, layer: 0, o: { ambient: 0.8, key: 0.25, spec: 0 } });
	for (const s of [-1, 1]) {
		const d = v3(Math.cos(th + s * half), Math.sin(th + s * half), 0);
		A.curve([v3(0, 0, 0), d.clone().multiplyScalar(reach)], { width: 0.5, layer: 2 });
	}
	// the body, translucent, so that the element of matter inside it shows
	A.sphere(v3(3.95, 0.98, 0), 1.18, STONE, { opacity: 0.55, spec: 0.08, wrap: 0.5, layer: 1 });
	A.label('\\rho(\\mathbf{x})', v3(4.7, 2.05, 0), { anchor: 'lb' });
	// the element: the slice of the cone between r and r + dr
	const r = 3.72, dr = 0.3;
	const slab = new THREE.CylinderGeometry((r + dr) * Math.tan(half), r * Math.tan(half), dr, 48);
	const ms = new THREE.Matrix4().makeRotationZ(th - Math.PI / 2).multiply(new THREE.Matrix4().makeRotationX(Math.PI)).setPosition(n.clone().multiplyScalar(r + dr / 2));
	A.mesh(slab, '#e08a3c', { matrix: ms, layer: 3, o: { ambient: 0.45, key: 0.7, spec: 0.2 } });
	A.label('\\mathrm{d}m = \\rho\\, r^{2}\\, \\mathrm{d}r\\, \\mathrm{d}\\Omega', v3(3.55, -0.95, 0), { anchor: 'lt' });
	A.curve([n.clone().multiplyScalar(r + dr / 2).add(v3(0, -0.15, 0)), v3(3.62, -0.88, 0)], { color: DIM, width: 0.45, layer: 4 });
	// distance r, and the direction n
	const low = v3(Math.cos(th - half), Math.sin(th - half), 0), off = v3(Math.sin(th - half), -Math.cos(th - half), 0).multiplyScalar(0.32);
	A.arrow(off.clone().addScaledVector(low, 0.05), low.clone().multiplyScalar(r).add(off), { color: DIM, width: 0.45, head: 3, both: true });
	A.label('r', low.clone().multiplyScalar(r * 0.45).add(off.clone().multiplyScalar(1.9)), { color: DIM });
	A.arrow(n.clone().multiplyScalar(0.18), n.clone().multiplyScalar(1.4), { width: 0.8, head: 4.4, layer: 5 });
	A.label('\\hat n', n.clone().multiplyScalar(0.95).add(v3(-0.06, 0.3, 0)));
	A.label('\\mathrm{d}\\Omega', n.clone().multiplyScalar(2.2).add(v3(-0.05, 0.25, 0)), { size: 7.5, color: DIM });
	A.sphere(v3(0, 0, 0), 0.14, '#868b92', { spec: 0.6, layer: 5 });
	A.label('\\text{pixel}', v3(-0.2, 0, 0), { anchor: 'rc', size: 7.5 });
	A.label('\\mathrm{d}\\mathcal{E}_{ij} = \\frac{G\\,\\mathrm{d}m}{r^{3}}\\,(\\delta_{ij} - 3\\hat n_i\\hat n_j)', [26, 6], { anchor: 'lt' });
	A.label('\\mathcal{E}_{ij} = G \\int \\mathrm{d}\\Omega\\,(\\delta_{ij} - 3\\hat n_i \\hat n_j)\\,S(\\hat n),\\qquad S(\\hat n) = \\int \\rho\\,\\frac{\\mathrm{d}r}{r}', [26, H - 6], { anchor: 'lb' });
	A.label('\\text{(a)}', [4, 5], { anchor: 'lt' });

	// (b)
	const B = new Panel({ x: 312, y: 0, w: 192, h: H, cx: 0, cy: 0.04, scale: 37, tilt: 20 });
	const w = (t) => 1 - 3 * Math.cos(t) ** 2;
	const magic = Math.acos(1 / Math.sqrt(3));
	B.curve([v3(0, -2.25, 0), v3(0, 2.3, 0)], { color: FAINT, width: 0.45, dash: [2, 2], layer: -1 });
	B.mesh(lathe(w, 0.0005, magic - 0.0005), STEEL, { o: { spec: 0.35, shininess: 30 } });
	B.mesh(lathe(w, Math.PI - magic + 0.0005, Math.PI - 0.0005), STEEL, { o: { spec: 0.35, shininess: 30 } });
	B.mesh(lathe(w, magic + 0.0005, Math.PI - magic - 0.0005), SAND, { o: { spec: 0.2, shininess: 20 } });
	B.label('z', v3(0.1, 2.3, 0), { anchor: 'lt', color: DIM });
	B.label('\\text{matter here}', v3(0.62, 1.55, 0), { anchor: 'lc', size: 7 });
	B.label('\\text{stretches } z', v3(0.62, 1.3, 0), { anchor: 'lc', size: 7 });
	B.label('\\text{matter here}', v3(1.02, -0.5, 0), { anchor: 'lc', size: 7 });
	B.label('\\text{squeezes } z', v3(1.02, -0.75, 0), { anchor: 'lc', size: 7 });
	B.label('\\delta_{zz} - 3\\hat n_z^{2} = 1 - 3\\cos^{2}\\vartheta', [96, H - 6], { anchor: 'cb' });
	B.label('\\text{(b)}', [4, 5], { anchor: 'lt' });
	return figure(504, H, [A, B]);
}
