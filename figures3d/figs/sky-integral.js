// Figure 5: the sky integral. (a) A pixel, the cone of directions dOmega about n, and the element of matter
// in it between r and r + dr: a piece of a cone bounded by two spherical caps, of volume r^2 dr dOmega.
// The cone's width and dr are exaggerated. (b) The sky around the pixel, coloured by the sign of the
// weight 1 - 3 cos^2 theta with which E_zz takes matter in each direction: exact. Matter in the orange
// caps (|cos theta| > 1/sqrt 3) stretches the pixel along z; matter in the blue band squeezes it. On the site's
// dark theme the sphere takes deep shades of the same two colours, so that its labels stay legible.
import { THREE, Panel, v3, figure, letter, INK, DIM, FAINT, ACCENT, ACCENT2 } from '../lib.js';

const ELEMENT = '#e9934a', CONE = '#ece6dc', CAP = '#f1c9a1', BAND = '#c9d9ec';
const CAP_NIGHT = '#5e3818', BAND_NIGHT = '#24405e';

// a solid of revolution about +y, then turned so +y points along `axis`
function along(axis, origin) {
	const q = new THREE.Quaternion().setFromUnitVectors(v3(0, 1, 0), axis.clone().normalize());
	return new THREE.Matrix4().makeRotationFromQuaternion(q).setPosition(origin);
}

export default async function () {
	// one column: (a) above (b)
	const W = 246, HA = 143, GAP = 5, SB = 50, TILT = 18;
	// (b) from the top of its z axis (level with its panel letter) to the bottom of it
	const HB = Math.round((1.42 + 1.32) * Math.cos(THREE.MathUtils.degToRad(TILT)) * SB + 4), H = HA + GAP + HB;
	const A = new Panel({ x: 0, y: 0, w: W, h: HA, cx: 2.53, cy: 0.1, scale: 50, tilt: 14, turn: -28 });
	const half = (13 * Math.PI) / 180;
	const n = v3(1, 0.12, 0).normalize();
	const reach = 4.8, r = 3.0, dr = 0.42;
	const O = v3(0, 0, 0);
	// the cone of directions: a pale surface out to `reach`, its rim, and the element inside it
	A.mesh(new THREE.ConeGeometry(reach * Math.sin(half), reach * Math.cos(half), 72, 1, true), CONE, {
		matrix: along(n.clone().negate(), n.clone().multiplyScalar((reach * Math.cos(half)) / 2)), cull: false, opacity: 0.55,
		o: { ambient: 0.75, key: 0.3, spec: 0 }
	});
	const rim = (rad) => {
		const pts = [], q = new THREE.Quaternion().setFromUnitVectors(v3(0, 1, 0), n);
		for (let k = 0; k <= 120; k++) {
			const t = (2 * Math.PI * k) / 120;
			pts.push(v3(rad * Math.sin(half) * Math.cos(t), rad * Math.cos(half), rad * Math.sin(half) * Math.sin(t)).applyQuaternion(q));
		}
		return pts;
	};
	A.curve(rim(reach), { width: 0.5, layer: 5 });
	// the element: lateral band and the two spherical caps, at r and r + dr
	const band = new THREE.CylinderGeometry((r + dr) * Math.sin(half), r * Math.sin(half), dr * Math.cos(half), 72, 1, true);
	// seen from beyond the element, its near cap lies behind the band and the far cap in front of both
	A.mesh(new THREE.SphereGeometry(r, 72, 12, 0, 2 * Math.PI, 0, half), ELEMENT, { matrix: along(n, O), cull: false, layer: 1, o: { ambient: 0.5, key: 0.5, spec: 0.1 } });
	A.mesh(band, ELEMENT, { matrix: along(n, n.clone().multiplyScalar((r + dr / 2) * Math.cos(half))), cull: false, layer: 2, o: { ambient: 0.5, key: 0.6, spec: 0.15 } });
	A.mesh(new THREE.SphereGeometry(r + dr, 72, 12, 0, 2 * Math.PI, 0, half), ELEMENT, { matrix: along(n, O), cull: false, layer: 3, o: { ambient: 0.6, key: 0.55, spec: 0.25 } });
	A.curve(rim(r + dr), { color: '#9a4a10', width: 0.45, layer: 4 });
	// a few generators of the cone, so that its taper reads
	const q = new THREE.Quaternion().setFromUnitVectors(v3(0, 1, 0), n);
	for (let k = 0; k < 12; k++) {
		const t = (2 * Math.PI * k) / 12;
		const g = v3(Math.sin(half) * Math.cos(t), Math.cos(half), Math.sin(half) * Math.sin(t)).applyQuaternion(q);
		A.curve([O, g.multiplyScalar(reach)], { color: '#b8b1a5', width: 0.3, layer: 0.5 });
	}
	// the cone's edges, from the pixel to the rim, in the plane of the drawing
	for (const s of [-1, 1]) {
		const e = v3(Math.cos(Math.atan2(n.y, n.x) + s * half), Math.sin(Math.atan2(n.y, n.x) + s * half), 0);
		A.curve([O, e.clone().multiplyScalar(reach)], { width: 0.5, layer: 5 });
	}
	// the pixel, the direction n, and the distance r
	A.sphere(O, 0.12, '#868b92', { spec: 0.6, layer: 4 });
	A.label('\\text{pixel}', v3(0, 0.2, 0), { size: 7.5, anchor: 'cb' });
	A.arrow(n.clone().multiplyScalar(0.16), n.clone().multiplyScalar(1.3), { width: 0.8, head: 4.4, layer: 5 });
	A.label('\\hat n', n.clone().multiplyScalar(0.8).add(v3(0, 0.26, 0)));
	A.label('\\mathrm{d}\\Omega', n.clone().multiplyScalar(reach + 0.05).add(v3(0.12, 0.0, 0)), { anchor: 'lc', size: 8 });
	// the distance r, measured along the cone's lower edge from the pixel to the element, on a dimension line just
	// outside the cone, with short extension lines to the pixel and to the element's near rim
	const lower = v3(Math.cos(Math.atan2(n.y, n.x) - half), Math.sin(Math.atan2(n.y, n.x) - half), 0);
	const out = v3(lower.y, -lower.x, 0).multiplyScalar(0.2);
	const rim0 = lower.clone().multiplyScalar(r);
	A.curve([out.clone().multiplyScalar(0.5), out.clone().multiplyScalar(1.2)], { color: DIM, width: 0.35, layer: 3.5 });   // beneath the pixel
	A.curve([rim0.clone().addScaledVector(out, 0.25), rim0.clone().addScaledVector(out, 1.2)], { color: DIM, width: 0.35, layer: 5 });
	A.arrow(out, rim0.clone().add(out), { color: DIM, width: 0.45, head: 3, both: true, layer: 5 });
	A.label('r', lower.clone().multiplyScalar(r / 2).addScaledVector(out, 2.1), { color: DIM });
	A.label('\\mathrm{d}r', n.clone().multiplyScalar(r + dr / 2).add(v3(0, (r + dr) * Math.sin(half) + 0.12, 0)), { size: 8, anchor: 'cb' });
	A.label('\\mathrm{d}m = \\rho\\, r^{2}\\, \\mathrm{d}r\\, \\mathrm{d}\\Omega', n.clone().multiplyScalar(r + dr / 2).add(v3(0.05, -0.95, 0)), { anchor: 'ct', dx: 13, dy: 4 });
	A.labels.push(letter('a', 0, 2, '\\mathrm{d}\\mathcal{E}_{ij} = \\frac{G\\,\\mathrm{d}m}{r^{3}}\\,(\\delta_{ij} - 3\\hat n_i\\hat n_j)'));
	A.label('\\mathcal{E}_{ij} = G \\int \\mathrm{d}\\Omega\\,(\\delta_{ij} - 3\\hat n_i \\hat n_j)\\,S(\\hat n),\\qquad S(\\hat n) = \\int \\rho\\,\\frac{\\mathrm{d}r}{r}', [24, HA - 4], { anchor: 'lb' });

	// (b) the sky around the pixel, by the sign of the weight
	const B = new Panel({ x: 0, y: HA + GAP, w: W, h: HB, cx: 0, cy: (1.42 - 1.32) / 2, scale: SB, tilt: TILT });
	const magic = Math.acos(1 / Math.sqrt(3));
	// the sphere in three zones, two caps and the band, each its own mesh with a row of vertices on the boundary, so
	// that the colours meet along the circle itself and not along the steps of a grid
	for (const [from, to, colour, night] of [[0, magic, CAP, CAP_NIGHT], [magic, Math.PI - magic, BAND, BAND_NIGHT], [Math.PI - magic, Math.PI, CAP, CAP_NIGHT]]) {
		B.mesh(new THREE.SphereGeometry(1, 96, Math.max(8, Math.round((64 * (to - from)) / Math.PI)), 0, 2 * Math.PI, from, to - from), colour, {
			night, o: { ambient: 0.62, key: 0.45, spec: 0.12 }, nightO: { spec: 0.02 }
		});
	}
	// the two boundary circles, at 54.7 degrees from the axis, where they face us
	for (const s of [1, -1]) {
		const pts = [];
		for (let k = 0; k <= 180; k++) {
			const t = (2 * Math.PI * k) / 180;
			pts.push(v3(Math.sin(magic) * Math.cos(t), s * Math.cos(magic), Math.sin(magic) * Math.sin(t)).multiplyScalar(1.003));
		}
		let run = [];
		for (const q of pts) {
			if (q.clone().applyMatrix4(B.rot).z > 0) run.push(q);
			else { if (run.length > 1) B.curve(run, { width: 0.5, layer: 2 }); run = []; }
		}
		if (run.length > 1) B.curve(run, { width: 0.5, layer: 2 });
	}
	B.curve([v3(0, 1, 0), v3(0, 1.42, 0)], { color: DIM, width: 0.5, layer: 2 });
	// below, the axis shows only once it leaves the sphere's outline (the south pole lies behind it), a little clear of it
	B.curve([v3(0, -1 / Math.cos(THREE.MathUtils.degToRad(TILT)) - 0.06, 0), v3(0, -1.32, 0)], { color: DIM, width: 0.5, layer: 2 });
	B.label('z', v3(0.07, 1.42, 0), { anchor: 'lt', color: DIM });
	B.label('\\text{stretch}', v3(0, 0.83, 0.3), { size: 7.5, color: ACCENT });
	B.label('\\text{squeeze}', v3(0, 0, 1), { size: 7.5, color: ACCENT2 });
	B.label('\\text{stretch}', v3(0, -0.83, 0.3), { size: 7.5, color: ACCENT });
	// the angle from the axis to the boundary, on an arc just outside the sphere
	const arc = [];
	for (let k = 0; k <= 40; k++) {
		const t = (magic * k) / 40;
		arc.push(v3(1.2 * Math.sin(t), 1.2 * Math.cos(t), 0));
	}
	B.curve(arc, { color: DIM, width: 0.45, layer: 3 });
	B.curve([v3(Math.sin(magic), Math.cos(magic), 0), v3(1.28 * Math.sin(magic), 1.28 * Math.cos(magic), 0)], { color: DIM, width: 0.45, layer: 3 });
	B.label('54.7^\\circ', v3(1.32 * Math.sin(magic / 2), 1.32 * Math.cos(magic / 2), 0), { size: 7.5, anchor: 'lb', color: DIM });
	B.labels.push(letter('b', 0, B.y + 1, '1 - 3\\cos^{2}\\vartheta'));
	return figure(W, H, [A, B]);
}
