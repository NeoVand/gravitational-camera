// The tutorial, section 10.1 (tutorial/glow/black-body.md), its first diagram: the waves that fit in a box, counted in
// a shell. Two panels side by side. Left, the grid of sections 2.6 and 8.3 in the plane (k_x, k_y): a square lattice
// of small dots with the spacing 2 pi / D, marked once by a bracket under the lattice; the ring of radius k and width
// dk shaded in the page's pale neutral, its dots in ink and the others faint; one cell of side 2 pi / D drawn round one
// dot; the radius k. Right, the same in three dimensions, in true 3D (one orthographic view): the shell between the
// spheres of radius k and k + dk, lit by the studio of lib.js, with the octant facing the viewer cut away, so that the
// three faces of the cut show the shell's thickness and the hollow inside it; the axes k_x, k_y, k_z run along the
// cut's edges. Under the panels, "2 pi k dk" and "4 pi k^2 dk". No colour roles: the grid and the shell are neutral.
// Departures from the diagram's comment: the lattice dots of the right panel are the grid's points on the three faces
// of the cut, where points inside the shell can be seen (a point of the grid in the shell lies inside its thickness,
// not on its surface); the ring's dots are in ink and the rest faint, so that the ring's dots can be told apart; the
// radius k is drawn and the axes are named; "2 pi k dk" and "4 pi k^2 dk" stand under their panels, on one line, since
// beside the ring the lattice leaves no room.
// Exact: both panels on one scale, the spacing 2 pi / D = 10.5 points, k = 4.3 and dk = 0.9 spacings in both; the ring
// and the shell (radii k and k + dk); which dots lie in the ring and on the faces (|n| between k and k + dk, asserted,
// none within 0.04 spacings of an edge); the projection. The shading is the studio's Lambert light (lib.js,
// shadeNormal): each face of the cut is flat and has one shade; the outer sphere is drawn as lib.js draws a lit sphere,
// a radial gradient sampled along the line through its highlight, and the hollow's far wall, seen from inside, by the
// same gradient turned half a turn (its normal at a point of the picture is the outer sphere's at the opposite point).
// The ring holds 28 dots against its area 2 pi (k + dk/2) dk = 26.9 cells: D^2 2 pi k dk / (2 pi)^2 is the count only
// on average, for a ring many cells across. Schematic: the size of k against the spacing (the caption says so), the
// dots' size, the view.
import { Sheet, ORIGIN, finish, checker, placed, beside, LABEL_GAP, AXIS, AXIS_HEAD, HAIR, n2 } from './tut-pot-lib.js';
import { Panel, THREE, shadeNormal, INK, DIM, FAINT } from '../lib.js';
import { chapter, palette, near } from './tut-planck-lib.js';

const name = 'tut-planck-shell';
const check = checker(name);

// ---- the drawing (points) ----------------------------------------------------------------------------------------
const G = 10.5;                                 // the grid's spacing 2 pi / D, points
const K = 4.3, DK = 0.9;                        // the ring's radius and width, in spacings
const N = 6;                                    // the left lattice runs from -N to N
const DOT = 0.95, DOT_DIM = 0.75;               // the dots: in the ring (and on the cut), and the others
const TINT = '#eeebe5';                         // the page's pale neutral (drawing.ts, THEME)
const EDGE = 0.4;                               // outlines
const APART = 46;                               // between the panels, beyond the lattice's half-width and the shell's
const TILT = 24, TURN = -45;                    // the right panel's view, degrees
const STONE = { day: '#e0d9cc', night: '#524e47' };   // the shell, in each theme
const CUT = { day: '#e9e2d5', night: '#68635a' };     // the faces of the cut
const LIGHT = { ambient: 0.46, key: 0.7, fill: 0.14, wrap: 0.3, spec: 0.12, shininess: 24, steps: 0 };
const STOPS = 16;                               // the gradients' stops
const REACH = 1.4;                              // the 3D axes' tips beyond the shell's outline, on the page, in spacings
const caption = 'Look first at the shaded ring: each dot is one wave that fits in the box, one per cell of area $(2\\pi/D)^2$, so the ring holds $2\\pi k\\,\\dd k\\,D^2/(2\\pi)^2$ of them. In three dimensions the shell holds $4\\pi k^2\\,\\dd k\\,D^3/(2\\pi)^3$, which grows as the square of the frequency. The dots are drawn far wider apart than in a real box.';

// ---- the studio (lib.js): its key light and the viewer, for the spheres' gradients ----------------------------------
const KEY = new THREE.Vector3(-0.55, 0.72, 0.62).normalize();
const VIEW = new THREE.Vector3(0, 0, 1);
const both = (base, n) => `light-dark(#${shadeNormal(new THREE.Color(base.day), n, LIGHT).getHexString()}, #${shadeNormal(new THREE.Color(base.night), n, LIGHT).getHexString()})`;
/** A lit sphere's radial gradient (as lib.js, Panel.render, draws a sphere), or the inside of one if `inside`. */
function gradient(id, base, inside) {
	const hl = KEY.clone().add(VIEW).normalize();
	const s = inside ? -1 : 1;
	const fx = 0.5 + s * 0.5 * hl.x * 0.9, fy = 0.5 - s * 0.5 * hl.y * 0.9;
	const dir = new THREE.Vector3(-hl.x, -hl.y, 0).normalize();
	const stops = [];
	for (let i = 0; i <= STOPS; i++) {
		const t = i / STOPS;
		const q = new THREE.Vector3(hl.x * (1 - t) + dir.x * t, hl.y * (1 - t) + dir.y * t, 0);
		const n = new THREE.Vector3(q.x, q.y, Math.sqrt(Math.max(0, 1 - q.x * q.x - q.y * q.y))).normalize();
		stops.push(`<stop offset="${n2(t)}" stop-color="${both(base, n)}"/>`);
	}
	return `<radialGradient id="${id}" cx="0.5" cy="0.5" r="0.5" fx="${fx.toFixed(3)}" fy="${fy.toFixed(3)}">${stops.join('')}</radialGradient>`;
}

export default async function () {
	const { state } = await chapter(check);
	await palette(check);
	state(name, 'planck-shell', caption);

	const S = new Sheet(name);
	const L = [];
	const R0 = K, R1 = K + DK;
	const inRing = (...n) => { const r = Math.hypot(...n); return r >= R0 && r <= R1; };
	const offEdges = (...n) => Math.abs(Math.hypot(...n) - R0) > 0.04 && Math.abs(Math.hypot(...n) - R1) > 0.04;

	// ================= left: the plane =================
	const c = [ORIGIN - N * G - APART / 2, ORIGIN];
	const at = (x, y) => [c[0] + x * G, c[1] - y * G];
	const circle = (r, rev = false) => Array.from({ length: 721 }, (_, i) => { const a = ((rev ? -i : i) * Math.PI) / 360; return at(r * Math.cos(a), r * Math.sin(a)); });
	{
		const d = 'M' + circle(R1).map(([x, y]) => `${n2(x)},${n2(y)}`).join('L') + 'ZM' + circle(R0, true).map(([x, y]) => `${n2(x)},${n2(y)}`).join('L') + 'Z';
		S.raw(`<path d="${d}" fill="${TINT}" fill-rule="evenodd"/>`, 0.5);
		for (const r of [R0, R1]) S.path(circle(r), { color: FAINT, width: EDGE, layer: 1, what: `the ring's edge ${r}` });
	}
	const ax = N + 0.75;
	S.arrow(at(-ax, 0), at(ax, 0), { color: DIM, width: AXIS, head: AXIS_HEAD, layer: 1.2, what: 'the axis k_x' });
	S.arrow(at(0, -ax), at(0, ax), { color: DIM, width: AXIS, head: AXIS_HEAD, layer: 1.2, what: 'the axis k_y' });
	let count = 0;
	for (let i = -N; i <= N; i++) for (let j = -N; j <= N; j++) {
		const q = at(i, j), ring = inRing(i, j);
		check(offEdges(i, j), `the dot (${i}, ${j}) lies on an edge of the ring`);
		if (ring) count++;
		S.raw(`<circle cx="${n2(q[0])}" cy="${n2(q[1])}" r="${ring ? DOT : DOT_DIM}" fill="${ring ? INK : FAINT}"/>`, 2);
		S.mark([q], ring ? DOT : DOT_DIM, `the dot (${i}, ${j})`);
	}
	const area = Math.PI * (R1 * R1 - R0 * R0);
	check(near(area, 2 * Math.PI * (K + DK / 2) * DK, 1e-12) && count === 28 && area.toFixed(1) === '26.9', `the ring holds ${count} dots against ${area}`);
	// one cell, round the dot (-2, 2)
	{
		const [x, y] = at(-2, 2), h = G / 2;
		check(Math.hypot(2.5, 2.5) < R0, 'the cell reaches the ring');
		S.path([[x - h, y - h], [x + h, y - h], [x + h, y + h], [x - h, y + h]], { color: INK, width: EDGE + 0.1, closed: true, layer: 2.5, what: 'the cell' });
	}
	// the radius k, from the origin to the ring, along the direction that passes farthest from the dots
	{
		let best = { a: 0, d: -1 };
		for (let deg = -84; deg <= -30; deg += 0.5) {
			const a = (deg * Math.PI) / 180, u = [Math.cos(a), Math.sin(a)];
			let d = Infinity;
			for (let i = 0; i <= N; i++) for (let j = -N; j <= 0; j++) {
				const s = i * u[0] + j * u[1];
				if ((i || j) && s > 0 && s < R0) d = Math.min(d, Math.abs(i * u[1] - j * u[0]));
			}
			if (d > best.d) best = { a, d };
		}
		check(best.d * G > 2, `the radius passes ${n2(best.d * G)} pt from a dot`);
		const u = [Math.cos(best.a), Math.sin(best.a)];
		S.path([at(0, 0), at(R0 * u[0], R0 * u[1])], { color: INK, width: HAIR + 0.1, layer: 2.5, what: 'the radius k' });
		const m = at(0.5 * R0 * u[0], 0.5 * R0 * u[1]), side = [u[1], u[0]];       // page: the left of the line, going out
		// its name at the middle of a cell beside the line's middle, where it clears the dots
		let cell = null;
		for (let i = 1; i <= N; i++) for (let j = -N; j <= -2; j++) {
			const q = [i + 0.5, j + 0.5], along = q[0] * u[0] + q[1] * u[1], off = Math.abs(q[0] * u[1] - q[1] * u[0]);
			if (along < 0.3 * R0 || along > 0.75 * R0 || off < 0.52) continue;
			const d = Math.hypot(q[0] - 0.5 * R0 * u[0], q[1] - 0.5 * R0 * u[1]);
			if (!cell || d < cell.d) cell = { q, d };
		}
		L.push(await placed('k', ...at(...cell.q), 0.5, 0.5, INK));
		void side;
	}
	// the bracket under the lattice, between the columns -6 and -5
	const bracketBase = at(0, -N)[1] + DOT_DIM + 3.4;
	{
		const x0 = at(-N, 0)[0], x1 = at(-N + 1, 0)[0], hook = 2.6;
		S.path([[x0, bracketBase], [x0, bracketBase + hook], [x1, bracketBase + hook], [x1, bracketBase]], { color: INK, width: HAIR + 0.15, cap: 'butt', layer: 2, what: 'the bracket' });
		L.push(await placed('2\\pi/D', (x0 + x1) / 2, bracketBase + hook + LABEL_GAP + 0.4, 0.5, 0, INK));
	}
	L.push(await placed('k_x', at(ax, 0)[0] + LABEL_GAP + 0.4, at(ax, 0)[1], 0, 0.5, DIM));
	L.push(await placed('k_y', at(0, ax)[0], at(0, ax)[1] - LABEL_GAP - 0.4, 0.5, 1, DIM));

	// ================= right: the shell in three dimensions =================
	// the chapter's axes in three.js's world (y up): k_x toward the viewer's left, k_y toward the right, k_z up
	const KX = new THREE.Vector3(0, 0, 1), KY = new THREE.Vector3(1, 0, 0), KZ = new THREE.Vector3(0, 1, 0);
	check(KX.clone().cross(KY).distanceTo(KZ) < 1e-12, 'the axes are not right-handed');
	const o = [ORIGIN + R1 * G + APART / 2, ORIGIN + 0.3 * G];
	const V = new Panel({ x: o[0], y: o[1], w: 0, h: 0, scale: G, tilt: TILT, turn: TURN });
	const O = new THREE.Vector3();
	// every direction of the cut octant faces the viewer, so the cut lies inside the shell's outline
	for (const u of [KX, KY, KZ]) check(V.cam(u).z > 0.3, 'an edge of the cut faces away from the viewer');
	const P = (p) => V.at(p);
	const pathOf = (pts) => 'M' + pts.map(([x, y]) => `${n2(x)},${n2(y)}`).join('L') + 'Z';
	const arc = (u, v, r, n = 90) => Array.from({ length: n + 1 }, (_, i) => { const a = (i * Math.PI) / (2 * n); return u.clone().multiplyScalar(r * Math.cos(a)).add(v.clone().multiplyScalar(r * Math.sin(a))); });
	const faces = [[KY, KZ, KX, 'k_x = 0'], [KZ, KX, KY, 'k_y = 0'], [KX, KY, KZ, 'k_z = 0']];
	// the curved triangle of the cut at radius r: the three quarter arcs through the axes' points
	const triangle = (r) => [...arc(KX, KY, r), ...arc(KY, KZ, r).slice(1), ...arc(KZ, KX, r).slice(1, -1)].map(P);
	const defs = [gradient(`p7${name}-outer`, STONE, false), gradient(`p7${name}-inner`, STONE, true),
		`<clipPath id="p7${name}-hollow"><path d="${pathOf(triangle(R0))}"/></clipPath>`];
	// the outer sphere, lit
	S.raw(`<circle cx="${n2(o[0])}" cy="${n2(o[1])}" r="${n2(R1 * G)}" fill="url(#p7${name}-outer)"/>`, 0.5);
	check(near(P(O)[0], o[0], 1e-9) && near(P(O)[1], o[1], 1e-9), 'the view is not centred on the shell');
	// the faces of the cut: flat, each one shade, its normal toward the cut (the viewer's side)
	for (const [u, v, nrm, what] of faces) {
		const n = V.cam(nrm).sub(V.cam(O)).normalize();
		check(n.z > 0, `the face ${what} faces away`);
		const ring = [...arc(u, v, R1), ...arc(u, v, R0).reverse()].map(P);
		S.raw(`<path d="${pathOf(ring)}" fill="${both(CUT, n)}" stroke="${both(CUT, n)}" stroke-width="0.15" stroke-linejoin="round"/>`, 0.6);
	}
	// the hollow's far wall, seen through the cut
	S.raw(`<circle cx="${n2(o[0])}" cy="${n2(o[1])}" r="${n2(R0 * G)}" fill="url(#p7${name}-inner)" clip-path="url(#p7${name}-hollow)"/>`, 0.7);
	// the outlines: the shell's, and the cut's arcs
	{
		const rim = Array.from({ length: 721 }, (_, i) => [o[0] + R1 * G * Math.cos((i * Math.PI) / 360), o[1] + R1 * G * Math.sin((i * Math.PI) / 360)]);
		S.path(rim, { color: FAINT, width: EDGE, layer: 1, what: 'the shell\'s outline' });
		for (const [u, v, , what] of faces) for (const r of [R0, R1]) S.path(arc(u, v, r).map(P), { color: FAINT, width: EDGE, layer: 1, what: `the arc ${r} of the face ${what}` });
	}
	// the axes, from the centre along the cut's edges and out beyond the shell
	const tips = [];
	for (const [u, src] of [[KX, 'k_x'], [KY, 'k_y'], [KZ, 'k_z']]) {
		const across = Math.hypot(V.cam(u).x, V.cam(u).y);            // the axis's length on the page, per unit
		const tip = P(u.clone().multiplyScalar((R1 + REACH) / across));
		check(near(Math.hypot(tip[0] - o[0], tip[1] - o[1]), (R1 + REACH) * G, 1e-9), `the axis ${src}'s tip`);
		S.arrow(P(O), tip, { color: DIM, width: AXIS, head: AXIS_HEAD, layer: 3, what: `the axis ${src}` });
		tips.push([src, tip]);
	}
	// the grid's points on the faces of the cut, each once
	const seen = new Set();
	for (let a = 0; a <= N; a++) for (let b = 0; b <= N; b++) for (const [u, v] of faces) {
		if (!inRing(a, b)) continue;
		check(offEdges(a, b), `the point (${a}, ${b}) lies on an edge of a face`);
		const p = u.clone().multiplyScalar(a).add(v.clone().multiplyScalar(b));
		const key = [p.x, p.y, p.z].map((t) => Math.round(t)).join();
		if (seen.has(key)) continue;
		seen.add(key);
		const q = P(p);
		S.raw(`<circle cx="${n2(q[0])}" cy="${n2(q[1])}" r="${DOT}" fill="${INK}"/>`, 3.5);
		S.mark([q], DOT, `the point ${key}`);
	}
	check(seen.size === 21, `${seen.size} points on the faces`);
	for (const [src, tip] of tips) {
		const d = [tip[0] - o[0], tip[1] - o[1]], l = Math.hypot(...d);
		L.push(await beside(src, tip, [d[0] / l, d[1] / l], LABEL_GAP + 0.4, DIM));
	}

	// ---- the counts, under their panels on one line
	{
		// on the line of the bracket's name
		const row = L.find((l) => l.src === '2\\pi/D').box.t;
		L.push(await placed('2\\pi k\\,\\mathrm{d}k', c[0] + 3.5 * G, row, 0.5, 0, INK));
		L.push(await placed('4\\pi k^2\\,\\mathrm{d}k', o[0], row, 0.5, 0, INK));
	}

	S.checkAll(L);
	window[name + '-numbers'] = { ring: count, area, onFaces: seen.size };
	return finish(S, L, [300, 345], defs.join(''));
}
