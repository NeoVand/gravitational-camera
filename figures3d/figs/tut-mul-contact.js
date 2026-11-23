// The tutorial, chapter 2.3 (tutorial/outside/multipoles.md), its fourth diagram: the matter round a pixel, split as
// the chapter splits it. A sphere round the pixel, coloured by the sign of the sky weight 1 - 3 cos^2 theta with which
// E_zz takes the matter in each direction (theta from the z axis): orange where it is negative, in the two caps
// within 54.7 degrees of the axis, blue where it is positive, in the band between. A quarter of it is cut away, so
// that the two cut faces show the same weight inside, along each line of sight from the pixel, with the angle of
// 54.7 degrees marked on one of them. At the centre, the small ball of radius r_min round the pixel, grey, whole. At
// the right, the small ball drawn again by itself, with what it gives, (4 pi / 3) G rho_0 delta_ij, and an arrow to
// the trace of that, 4 pi G rho_0.
// Exact: the colours, by the sign of 1 - 3 cos^2 theta (asserted at the centre of every face of the meshes, the
// zones meeting along the circles theta = arccos(1/sqrt 3) = 54.7 degrees and 125.3 degrees, which are drawn on the
// sphere and as straight lines on the cut faces); the cut faces are planes through the z axis, coloured by the
// direction of each point from the pixel, as the weight depends on the direction alone; the angle; the contact term's
// trace, three times (4 pi / 3), and the chapter's numbers for air (asserted). Schematic: the small ball's radius
// against the sphere's (the sphere stands for all the matter outside it, to any distance), the cut, and the view.
// The lighting is the studio's (lib.js); the two colours are laid over the page, so that on the site's dark theme
// the sphere takes deep shades of them, as in the paper's figure on the sky integral (figs/sky-integral.js).
import { Panel, THREE, v3, INK, DIM, ACCENT, ACCENT2 } from '../lib.js';
import { IRON } from '../stone.js';
import { Sheet, ORIGIN, finish, checker, near, placed, HAIR, AXIS, VEC, VEC_HEAD } from './tut-vec-lib.js';
import { arc, cameraAxes } from './tut-gauss-lib.js';

const name = 'tut-mul-contact';
const check = checker(name);
const deg = Math.PI / 180;
// matter's colour of the chapter's equations (app.css, --q-matter), light and dark
const MATTER = 'light-dark(#533f03, #f1dc86)';

// ---- the mathematics ----------------------------------------------------------------------------------------------
export const weight = (theta) => 1 - 3 * Math.cos(theta) ** 2;
export const ZERO = Math.acos(1 / Math.sqrt(3));

// ---- the drawing ----------------------------------------------------------------------------------------------
const SCALE = 70;                   // points per unit: the sphere's radius
const RMIN = 0.24;                  // the small ball's radius, units (schematic)
const TILT = 24, TURN = -38;        // the view
const CUT = 90 * deg;               // the cut-away wedge's opening
const LIGHT = { ambient: 0.62, key: 0.5, fill: 0.12, spec: 0.1, shininess: 24 };
// the two colours laid over the page, so that they are pale on the light page and deep on the dark one
const ALPHA = { cap: 0.42, band: 0.36 };
const HORIZON = 1.2;                // lines on the sphere stop this far (points) from its outline
const DOT_R = 7;                    // the small ball drawn again, radius in points

export default async function () {
	// ---- the chapter's numbers: the contact term's trace, and air
	check(near(3 * (4 * Math.PI) / 3, 4 * Math.PI, 1e-15), 'three times 4 pi / 3 is not 4 pi');
	check((ZERO / deg).toFixed(1) === '54.7' && near(weight(ZERO), 0, 1e-15) && near(weight(Math.PI - ZERO), 0, 1e-15), 'the zeros are not at 54.7 degrees');
	const G = 6.674e-11, AIR = 1.2;
	check(((4 * Math.PI / 3) * G * AIR).toExponential(1) === '3.4e-10' && (4 * Math.PI * G * AIR).toExponential(1) === '1.0e-9', 'the contact term for air is not 3.4 x 10^-10 s^-2, its trace 1.0 x 10^-9');
	check((AIR * Math.log(3 / 0.25)).toFixed(1) === '3.0' && (AIR * Math.log(3 / 1e-3)).toFixed(1) === '9.6' && (AIR * Math.log(3 / 1e-6)).toFixed(1) === '17.9', 'the columns of air are not 3.0, 9.6 and 17.9');

	const P = new Panel({ x: ORIGIN, y: ORIGIN, w: 0, h: 0, scale: SCALE, tilt: TILT, turn: TURN });
	const ink = new Sheet(P, name);
	const [right, up, toward] = cameraAxes(P);
	void right; void up;
	// the world: three.js y is the chapter's z; a direction by its polar angle theta from z and its azimuth phi
	const dir = (t, p) => v3(Math.sin(t) * Math.cos(p), Math.cos(t), Math.sin(t) * Math.sin(p));
	// the wedge cut away: centred on the viewer's azimuth
	const phiV = Math.atan2(toward.z, toward.x);
	const cut0 = phiV - CUT / 2, cut1 = phiV + CUT / 2;
	const zoneOf = (t) => (t < ZERO || t > Math.PI - ZERO ? 'cap' : 'band');

	/** A mesh from a function (u, v) -> world point over a grid, each triangle wound so that `out(p)` (its outward
	 * normal at a point) faces out, with normals for smooth shading if `smooth`. */
	const surface = (f, u0, u1, nu, v0, v1, nv, out, smooth) => {
		const pos = [], nor = [];
		const P_ = (i, j) => f(u0 + ((u1 - u0) * i) / nu, v0 + ((v1 - v0) * j) / nv);
		for (let i = 0; i < nu; i++) for (let j = 0; j < nv; j++) {
			const a = P_(i, j), b = P_(i + 1, j), c = P_(i + 1, j + 1), d = P_(i, j + 1);
			for (let [p, q, r] of [[a, b, c], [a, c, d]]) {
				if (p.distanceTo(q) < 1e-12 || q.distanceTo(r) < 1e-12 || r.distanceTo(p) < 1e-12) continue;
				const m = p.clone().add(q).add(r).divideScalar(3);
				const n = q.clone().sub(p).cross(r.clone().sub(p));
				if (n.dot(out(m)) < 0) [q, r] = [r, q];
				pos.push(...p.toArray(), ...q.toArray(), ...r.toArray());
				for (const s of [p, q, r]) nor.push(...(smooth ? out(s) : out(m)).toArray());
			}
		}
		const g = new THREE.BufferGeometry();
		g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
		g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
		return g;
	};
	const colours = { cap: ACCENT, band: ACCENT2 };
	const paint = (g, zone, layer, o = LIGHT) => P.mesh(g, colours[zone], { layer, o, opacity: ALPHA[zone] });
	/** Every face of a mesh in the zone `zone` has the sign of that zone (its centre's direction from the pixel). */
	const assertZone = (g, zone, what) => {
		const p = g.attributes.position;
		for (let i = 0; i < p.count; i += 3) {
			const m = v3(0, 0, 0);
			for (let k = 0; k < 3; k++) m.add(v3(p.getX(i + k), p.getY(i + k), p.getZ(i + k)));
			const t = Math.acos(Math.max(-1, Math.min(1, m.y / m.length())));
			check((weight(t) < 0) === (zone === 'cap'), `${what}: a face of sign ${Math.sign(weight(t))} in the ${zone}`);
		}
	};

	// ---- the sphere's surface, in three zones (each its own mesh, its rows meeting on the zero circles), less the
	// wedge cut away above the equator, as the paper's stone bodies are cut (figs/hair.js)
	const zones = [[0, ZERO], [ZERO, Math.PI - ZERO], [Math.PI - ZERO, Math.PI]];
	const sphereZone = (t0, t1, p0, p1, np) =>
		surface((p, t) => dir(t, p), p0, p1, np, t0, t1, Math.max(6, Math.round(((t1 - t0) / Math.PI) * 44)), (q) => q.clone().normalize(), true);
	for (const [t0, t1] of zones) {
		const zone = zoneOf((t0 + t1) / 2);
		// outside the wedge, all round from pole to pole, and inside it below the equator only: one mesh, so that its
		// two parts meet without a seam
		const parts = [sphereZone(t0, t1, cut1, cut0 + 2 * Math.PI, 108)];
		const u0 = Math.max(t0, Math.PI / 2);
		if (u0 < t1) parts.push(sphereZone(u0, t1, cut0, cut1, 36));
		const g = new THREE.BufferGeometry();
		for (const key of ['position', 'normal']) g.setAttribute(key, new THREE.Float32BufferAttribute(parts.flatMap((q) => Array.from(q.attributes[key].array)), 3));
		assertZone(g, zone, 'the sphere');
		paint(g, zone, 0);
	}
	// ---- the cut faces: two quarter discs, upright, through the z axis at the wedge's edges, and the quarter disc of
	// the equator's plane between them, each from the small ball out to the sphere
	const walls = [[cut0, 1], [cut1, -1]].map(([phi, side]) => ({ phi, n: v3(-Math.sin(phi), 0, Math.cos(phi)).multiplyScalar(side) }));
	const floorN = v3(0, 1, 0);
	for (const { phi, n } of walls) {
		check(n.dot(toward) > 0.3, 'an upright cut face is not seen');
		for (const [t0, t1] of [[0, ZERO], [ZERO, Math.PI / 2]]) {
			const zone = zoneOf((t0 + t1) / 2);
			const g = surface((r, t) => dir(t, phi).multiplyScalar(r), RMIN, 1, 24, t0, t1, Math.max(6, Math.round(((t1 - t0) / Math.PI) * 36)), () => n, false);
			assertZone(g, zone, 'an upright cut face');
			paint(g, zone, 1, { ...LIGHT, smooth: false });
		}
		// the zero line on the face, straight, from the small ball to the sphere
		ink.line(dir(ZERO, phi).multiplyScalar(RMIN), dir(ZERO, phi), { color: INK, width: 0.5, layer: 1.5, what: 'a zero line' });
		// the face's edges: on the sphere, and on the equator's plane
		ink.curve(Array.from({ length: 91 }, (_, k) => dir((k * Math.PI) / 180, phi)), { color: INK, width: 0.35, layer: 1.6, what: 'the edge of a cut face' });
		ink.line(dir(Math.PI / 2, phi).multiplyScalar(RMIN), dir(Math.PI / 2, phi), { color: INK, width: 0.35, layer: 1.6, what: 'the edge between two cut faces' });
	}
	check(floorN.dot(toward) > 0.2, 'the cut face in the equator\'s plane is not seen');
	{
		const g = surface((r, p) => dir(Math.PI / 2, p).multiplyScalar(r), RMIN, 1, 24, cut0, cut1, 48, () => floorN, false);
		assertZone(g, 'band', 'the cut face in the equator\'s plane');
		paint(g, 'band', 1, { ...LIGHT, smooth: false });
		ink.curve(Array.from({ length: 91 }, (_, k) => dir(Math.PI / 2, cut0 + (CUT * k) / 90)), { color: INK, width: 0.35, layer: 1.6, what: 'the edge of the cut face in the equator\'s plane' });
	}
	// the zero circles on the sphere, where it is seen and not cut away; near the sphere's outline a circle meets it at a
	// grazing angle, so it stops HORIZON points short of it, and the two never run together as a double line
	const cutAway = (q) => q.y > 1e-9 && (() => { let p = Math.atan2(q.z, q.x); while (p < cut0) p += 2 * Math.PI; return p < cut1; })();
	for (const t of [ZERO, Math.PI - ZERO]) {
		const pts = Array.from({ length: 1441 }, (_, k) => dir(t, cut0 + (2 * Math.PI * k) / 1440).multiplyScalar(1.002));
		let run = [];
		const flush = () => { if (run.length > 1) ink.curve(run, { color: INK, width: 0.5, layer: 0.5, what: 'a zero circle' }); run = []; };
		for (const q of pts) { if (q.dot(toward) > 0 && SCALE * (1 - Math.sqrt(Math.max(0, 1 - q.dot(toward) ** 2))) >= HORIZON && !cutAway(q)) run.push(q); else flush(); }
		flush();
	}
	// the z axis: where the two upright faces meet, from the small ball to the pole, and out beyond it
	ink.line(v3(0, RMIN, 0), v3(0, 1, 0), { color: INK, width: 0.35, layer: 1.6, what: 'the axis on the faces' });
	ink.line(v3(0, 1, 0), v3(0, 1.3, 0), { color: DIM, width: AXIS, layer: 2, what: 'the z axis' });
	// the angle on the left-hand face, from the axis to the zero line
	const ang = arc(ink, v3(0, 0, 0), v3(0, 1, 0), dir(ZERO, cut0), 0.6, { color: INK, width: HAIR, layer: 1.7, what: 'the angle' });
	check(near(ang.ang, ZERO, 1e-12), 'the arc is not 54.7 degrees');

	// ---- the small ball round the pixel: the part of it in the wedge, above the equator's plane, over its sections
	const IRON_LIGHT = { ambient: 0.42, key: 0.7, fill: 0.12, spec: 0.35, shininess: 30 };
	P.mesh(surface((p, t) => dir(t, p).multiplyScalar(RMIN), cut0, cut1, 36, 0, Math.PI / 2, 24, (q) => q.clone().normalize(), true), IRON, { layer: 3, o: IRON_LIGHT });
	for (const { phi, n } of walls) P.mesh(surface((r, t) => dir(t, phi).multiplyScalar(r), 0, RMIN, 4, 0, Math.PI / 2, 12, () => n, false), IRON, { layer: 2.5, o: { ...IRON_LIGHT, spec: 0, smooth: false } });
	P.mesh(surface((r, p) => dir(Math.PI / 2, p).multiplyScalar(r), 0, RMIN, 4, cut0, cut1, 12, () => floorN, false), IRON, { layer: 2.5, o: { ...IRON_LIGHT, spec: 0, smooth: false } });
	ink.mark([ink.at(v3(0, 0, 0))], RMIN * SCALE, 'the small ball');
	// the sphere's outline, for the label checks
	ink.mark(Array.from({ length: 361 }, (_, k) => [ORIGIN + SCALE * Math.cos(k * deg), ORIGIN + SCALE * Math.sin(k * deg)]), 0.3, 'the sphere');

	// ---- at the right: the small ball by itself, what it gives, and its trace
	const L = [];
	const inv = P.rot.clone().invert();
	const worldAt = (X, Y) => v3((X - ORIGIN) / SCALE, -(Y - ORIGIN) / SCALE, 0).applyMatrix4(inv).add(P.centre);
	const D = [ORIGIN + SCALE + 40, ORIGIN];
	P.sphere(worldAt(...D), DOT_R / SCALE, IRON, { spec: 0.35, shininess: 30, layer: 4 });
	ink.mark([D], DOT_R, 'the small ball again');
	const rho = `{\\color{${MATTER}}\\rho_0}`;
	L.push(await placed(`(4\\pi/3)G${rho}\\,\\delta_{ij}`, D[0] + DOT_R + 4, D[1], 0, 0.5, INK));
	const A0 = [D[0], D[1] + DOT_R + 2.5], A1 = [D[0], D[1] + DOT_R + 25];
	ink.arrow(worldAt(...A0), worldAt(...A1), { color: INK, width: VEC * 0.8, head: VEC_HEAD * 0.85, layer: 4, what: 'the arrow to the trace' });
	L.push(await placed(`\\text{trace}\\ 4\\pi G${rho}`, D[0] - 4, A1[1] + 2.6, 0, 0, INK));

	// ---- labels on the sphere
	const at = (p) => ink.at(p);
	L.push(await ink.label('z', at(v3(0, 1.3, 0)), [1, 0], 2.2, DIM));
	L.push(await ink.label('54.7^\\circ', at(ang.mid), [-0.1, -1], 2.2, INK, 8));
	L.push(await placed('1 - 3\\cos^2\\vartheta', ORIGIN - SCALE - 6, ORIGIN - SCALE - 4, 0, 1, INK));

	ink.checkAll(L);
	return finish(name, P, L, [240, 340]);
}
