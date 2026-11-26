// The tutorial, section 5.4 (tutorial/waves/polarization.md), its fifth diagram: Poincare's sphere, twice, side by
// side and alike: the same size (52 points to the unit), the same view and the same names, the left for the
// gravitational wave and the right for light, each named under it. Each a sphere of radius 1 in light perspective (a
// camera 9 radii away, 22 degrees above the equator, 35 degrees round from Q toward -U): its outline, the equator and
// the vertical axis, thin and grey; the axes Q/I (toward the viewer and right), U/I (right and back) and V/I (up),
// named at their tips. The north pole named "anticlockwise, circular", the south pole "clockwise, circular", the
// equator "linear". The point P of the rotor seen at iota = 75 degrees, (Q, U, V)/I = (0.62, 0, 0.785), filled; the
// circle of latitude through it, dashed. On the left, P', hollow, where a turn of the axes by theta = 22.5 degrees
// carries it, round the vertical by -4 theta = -90 degrees to (0, -0.62, 0.785); a curved arrow along the latitude from
// P to P', named -4 theta. On the right, its image P'' after the same turn, carried by -2 theta = -45 degrees to (0.44,
// -0.44, 0.785), the arrow named -2 theta. Each arrow runs on the sphere's near face, in front of the vertical axis: a
// halo of the page's colour cuts the axis where the arrow crosses it (on the right, its head lies on the axis).
// The projection is the comment's light perspective, made exact (each sphere seen from its own camera, so that its
// outline is a circle); the axes reach 1.45, so that U/I's head clears the outline.
// Exact: the outlines (the sphere's tangent circle, D / sqrt(D^2 - 1) radii, asserted), the equator, the latitude
// through P at V/I = 0.785, P from the rotor's amplitudes at 75 degrees, P' and P'' from the strains and the field
// turned by the axes and their Stokes parameters computed anew (tut-pol-lib.js), each asserted on the latitude at
// -90 and -45 degrees from P. Nothing is schematic.
import { Panel, v3, INK, DIM, FAINT, PAGE } from '../lib.js';
import { Sheet, ORIGIN, finish, checker, near, placed, n2, AXIS, AXIS_HEAD, DASH } from './tut-vec-lib.js';
import { chapter, View, rad, dashes, drawDashes } from './tut-pol-lib.js';

const name = 'tut-pol-poincare';
const check = checker(name);

const S1 = 52;                            // points per unit at each sphere's centre, both
const DIST = 9;                           // each camera's distance, in radii
const AZ = 35, EL = 22;                   // the view: degrees round from Q toward -U, and above the equator
const GAP = 174;                          // between the spheres' centres, points
const AX = 1.45;                          // the axes' reach
const OUT = 0.5;                          // the outlines, equator and vertical axis
const LAT = 0.5;                          // the latitude, dashed
const PT = 1.7;                           // P
const ARC = 0.6, ARC_HEAD = 3.4, ARC_GAP = 1.4;
const POLE = 1.1;
const SMALL = 7.5;                        // the poles' and the equator's names

export default async function () {
	const nums = chapter(check);
	const P = new Panel({ x: ORIGIN, y: ORIGIN, w: 0, h: 0, scale: 1 });
	const ink = new Sheet(P, name);
	const raw = (svg, layer) => P.items.push({ kind: 'raw', layer, depth: 0, svg });
	const world = ([x, y]) => v3(x - ORIGIN, ORIGIN - y, 0);       // a figure point as the sheet's world point
	const toward = v3(Math.cos(rad(AZ)) * Math.cos(rad(EL)), Math.sin(rad(EL)), Math.sin(rad(AZ)) * Math.cos(rad(EL)));
	// (Q, U, V) -> the view's world: Q -> x, V -> y (up), U -> -z
	const qu = (q, u, w) => v3(q, w, -u);
	const L = [];
	const spheres = [
		{ key: 'wave', V: new View({ x: ORIGIN - GAP / 2, y: ORIGIN, w: 0, h: 0, scale: S1, toward, dist: DIST }), to: nums.Pgw, turn: -90, arrow: '-4\\theta', image: "P'", title: '\\text{gravitational wave}' },
		{ key: 'light', V: new View({ x: ORIGIN + GAP / 2, y: ORIGIN, w: 0, h: 0, scale: S1, toward, dist: DIST }), to: nums.Plight, turn: -45, arrow: '-2\\theta', image: "P''", title: '\\text{light}' }
	];
	for (const sp of spheres) {
		const { V } = sp;
		const pr = (q, u, w) => world(V.at(qu(q, u, w)));
		const F = (q, u, w) => V.at(qu(q, u, w));
		// Q toward the viewer and right, U right and back
		const cq = V.cam(qu(1, 0, 0)), cu = V.cam(qu(0, 1, 0));
		check(cq.x > 0 && cq.z > 0 && cu.x > 0 && cu.z < 0 && Math.abs(V.cam(qu(0, 0, 1)).x) < 1e-12, `${sp.key}: the axes do not point as the comment asks`);
		// ---- the outline: the tangent circle, at camera depth 1/D, radius sqrt(1 - 1/D^2)
		const inv = V.rot.clone().invert();
		const outline = Array.from({ length: 721 }, (_, k) => {
			const t = (2 * Math.PI * k) / 720, r = Math.sqrt(1 - 1 / DIST ** 2);
			return V.at(v3(r * Math.cos(t), r * Math.sin(t), 1 / DIST).applyMatrix4(inv));
		});
		const C = V.at(qu(0, 0, 0));
		for (const q of outline) check(near(Math.hypot(q[0] - C[0], q[1] - C[1]), (V.scale * DIST) / Math.sqrt(DIST ** 2 - 1), 1e-9), `${sp.key}: the outline is not a circle of D / sqrt(D^2 - 1) radii`);
		ink.curve(outline.map(world), { color: DIM, width: OUT, layer: 1, what: `${sp.key}: the outline` });
		// ---- the equator, the vertical axis (and on the large sphere, the Q and U axes)
		const ring = (h, r, n = 720) => Array.from({ length: n + 1 }, (_, k) => { const t = (2 * Math.PI * k) / n; return [r * Math.cos(t), r * Math.sin(t), h]; });
		ink.curve(ring(0, 1).map((p) => pr(...p)), { color: FAINT, width: OUT, layer: 1, what: `${sp.key}: the equator` });
		{
			ink.line(pr(0, 0, -1), pr(0, 0, 0), { color: FAINT, width: OUT, layer: 1, what: 'the vertical axis, below' });
			for (const [k, d] of [['Q', [1, 0, 0]], ['U', [0, 1, 0]], ['V', [0, 0, 1]]]) {
				const tip = pr(...d.map((v) => AX * v));
				ink.arrow(pr(0, 0, 0), tip, { color: DIM, width: AXIS, head: AXIS_HEAD, layer: 1.2, what: `${sp.key}: the ${k} axis` });
				(sp.tips ??= {})[k] = tip;
			}
		}
		// the poles
		for (const s of [1, -1]) {
			const [x, y] = F(0, 0, s);
			raw(`<circle cx="${n2(x)}" cy="${n2(y)}" r="${POLE}" fill="${INK}"/>`, 3);
			ink.mark([[x, y]], POLE, `${sp.key}: the pole ${s}`);
		}
		// ---- the latitude through P, dashed, except under the arc
		const h = nums.P.V, r = nums.P.Q;
		check(near(r ** 2 + h ** 2, 1, 1e-12), 'P is not on the sphere');
		const at = (a) => F(r * Math.cos(a), r * Math.sin(a), h);
		const a1 = rad(sp.turn);
		const img = sp.to;
		check(near(r * Math.cos(a1), img.Q, 1e-9) && near(r * Math.sin(a1), img.U, 1e-9) && near(img.V, h, 1e-12), `${sp.key}: the image is not on the latitude at ${sp.turn} degrees`);
		const Pf = at(0), If = at(a1);
		// the arc from P to the image, clear of both by ARC_GAP plus their radii, with a head at the image
		const along = (a) => at(a);
		const dist = (a, q) => Math.hypot(along(a)[0] - q[0], along(a)[1] - q[1]);
		let s0 = 0; while (dist(s0, Pf) < PT + ARC_GAP) s0 -= 1e-4;
		let s1 = a1; while (dist(s1, If) < PT + ARC_GAP + 0.2) s1 += 1e-4;
		let sh = s1; while (dist(sh, along(s1)) < ARC_HEAD) sh += 1e-4;
		const arcPts = Array.from({ length: 241 }, (_, k) => along(s0 + ((sh + (s1 - sh) * 0.2 - s0) * k) / 240));
		ink.curve(arcPts.map(world), { color: INK, width: ARC, layer: 2.5, what: `${sp.key}: the arc` });
		// the arc runs on the sphere's near face, in front of the vertical axis inside it: a halo of the page's colour
		// cuts the axis where the arc and its head cross it
		raw(`<path d="M${[...arcPts, along(s1)].map(([x, y]) => `${n2(x)},${n2(y)}`).join('L')}" fill="none" stroke="${PAGE}" stroke-width="${ARC + 3.4}" stroke-linecap="round"/>`, 1.3);
		{
			const tip = along(s1), b = along(sh), u = [(tip[0] - b[0]) / ARC_HEAD, (tip[1] - b[1]) / ARC_HEAD], w = [-u[1], u[0]], hw = 0.36 * ARC_HEAD;
			const tri = [tip, [b[0] + w[0] * hw, b[1] + w[1] * hw], [b[0] - w[0] * hw, b[1] - w[1] * hw]];
			raw(`<path d="M${tri.map(([x, y]) => `${n2(x)},${n2(y)}`).join('L')}Z" fill="${INK}"/>`, 2.6);
			ink.mark([...tri, tri[0]], 0, `${sp.key}: the arc's head`);
		}
		// the turn is clockwise seen from above (toward -U from Q): the arc's angle falls
		check(s1 < s0 && a1 < 0, `${sp.key}: the arc does not run toward -U`);
		const full = Array.from({ length: 721 }, (_, k) => at((2 * Math.PI * k) / 720));
		const onArc = (q) => arcPts.some((p) => Math.hypot(p[0] - q[0], p[1] - q[1]) < ARC + 1.2) || Math.hypot(q[0] - Pf[0], q[1] - Pf[1]) < PT + 1 || Math.hypot(q[0] - If[0], q[1] - If[1]) < PT + 1;
		drawDashes(ink, dashes(full, { dash: DASH, skip: onArc }), { color: DIM, width: LAT, layer: 2, what: `${sp.key}: the latitude` });
		// P, filled; its image, hollow
		raw(`<circle cx="${n2(Pf[0])}" cy="${n2(Pf[1])}" r="${PT}" fill="${INK}"/>`, 3);
		raw(`<circle cx="${n2(If[0])}" cy="${n2(If[1])}" r="${PT - 0.25}" fill="none" stroke="${INK}" stroke-width="0.5"/>`, 3);
		ink.mark([Pf], PT, `${sp.key}: P`);
		ink.mark([If], PT, `${sp.key}: the image`);
		Object.assign(sp, { Pf, If, F, arcPts, C });
	}
	// ---- the names, the same on both spheres
	for (const sp of spheres) {
		const { V } = sp;
		L.push(await ink.label('Q/I', V.at(qu(AX, 0, 0)), [0.35, 0.94], 2.4, DIM));
		L.push(await ink.label('U/I', V.at(qu(0, AX, 0)), [1, 0], 2.4, DIM));
		L.push(await ink.label('V/I', V.at(qu(0, 0, AX)), [0, -1], 2.4, DIM));
		// the poles' names beside the vertical axis, just clear of the outline's top and bottom
		const R = (V.scale * DIST) / Math.sqrt(DIST ** 2 - 1), [cx, cy] = sp.C;
		L.push(await placed('\\text{anticlockwise, circular}', cx - 3, cy - R - 2.6, 1, 1, INK, SMALL));
		const south = await placed('\\text{clockwise, circular}', cx - 3, cy + R + 2.6, 1, 0, INK, SMALL);
		L.push(south);
		// the equator's name beyond its leftmost point as seen: the direction -(sin AZ, cos AZ) in (Q, U)
		L.push(await ink.label('\\text{linear}', sp.F(-Math.sin(rad(AZ)), -Math.cos(rad(AZ)), 0), [-0.85, 0.53], 2.6, INK, SMALL));
		// each point's name below it and outward, between the latitude and the equator, clear of the arc
		L.push(await ink.label('P', sp.Pf, [0.6, 0.8], 2.4, INK, 8.5));
		// (light's image is just left of the vertical axis: its name above it and outward, inside the latitude)
		L.push(await ink.label(sp.image, sp.If, sp.key === 'wave' ? [-0.6, 0.8] : [-0.5, -0.87], 2.4, INK, 8.5));
		// the turn over its arc: where the arc crosses the vertical axis, just over it and right of the axis
		const q = sp.arcPts.reduce((a, b) => (Math.abs(b[0] - cx) < Math.abs(a[0] - cx) ? b : a));
		let l, dy = 0;
		do { l = await placed(sp.arrow, cx + 3.4, q[1] - ARC / 2 - 2.6 - dy, 0, 1, INK); dy += 0.1; } while (ink.clearance(l.box).d < 2.4 && dy < 20);
		L.push(l);
		// the sphere's name under it, below the south pole's
		sp.titleAt = south.box.b + 9;
	}
	const ty = Math.max(...spheres.map((sp) => sp.titleAt));
	for (const sp of spheres) L.push(await placed(sp.title, sp.C[0], ty, 0.5, 0, INK));
	ink.checkAll(L);
	window[name + '-numbers'] = { P: nums.P, Pgw: nums.Pgw, Plight: nums.Plight };
	return finish(name, P, L, [300, 440]);
}
