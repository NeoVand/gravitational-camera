// The tutorial, chapter 2.1 (tutorial/outside/laplace.md), its third diagram: what Laplace's equation allows and what
// it forbids, drawn as two membranes stretched over the unit disc, side by side, in true 3D (one orthographic view,
// turned and tilted as lib.js's Panel does, each surface lit by the studio of the paper's figures, with a net of the
// lines of constant x and of constant y drawn on it). Left, the saddle u = x^2 - y^2, harmonic: its largest value, 1,
// at the two points (+-1, 0) of the rim and its smallest, -1, at (0, +-1), all four marked, one of each labelled.
// Right, the bump u = 1 - r^2, whose Laplacian is -4: its peak, 1, at the centre, marked "not allowed in empty
// space" by a thin leader (the peak lies inside the bump's outline on the page). Exact: both surfaces (a polar mesh
// of NR rings by NT sectors, its vertices on the surface), the net and the rims (on the surfaces), the four extremes
// of the saddle on the rim (asserted the largest and smallest values over the disc) and the bump's peak; the
// Laplacians, 0 and -4 (asserted by differences). Chosen for the drawing: the view, the net's spacing and the height
// scale H, small enough that every face of both meshes faces the viewer, so that nothing of either surface hides
// another part of it (asserted) and each rim and every line of the net is seen whole.
import { Panel, THREE, v3, tex, shadeNormal, INK, DIM, FAINT } from '../lib.js';
import { Sheet, ORIGIN, finish, checker, near, boxOf, SIZE, HAIR } from './tut-vec-lib.js';
import { cameraAxes, TINT } from './tut-gauss-lib.js';

const name = 'tut-lap-membranes';
const check = checker(name);

// ---- the two functions on the unit disc ---------------------------------------------------------------------------
export const saddle = (x, y) => x * x - y * y;
export const bump = (x, y) => 1 - x * x - y * y;
const laplacian = (f, x, y, h = 1e-3) => (f(x + h, y) + f(x - h, y) + f(x, y + h) + f(x, y - h) - 4 * f(x, y)) / (h * h);

// ---- the drawing ----------------------------------------------------------------------------------------------------
const S = 64;                       // points per unit of the disc's radius
const TILT = 40, TURN = 12;         // the view, degrees
const H = 0.36;                     // height on the page per unit of u, in units of the radius
const APART = 2.36;                 // the two discs' centres, this far apart across the page
const NR = 18, NT = 96;             // the mesh: rings and sectors
const NET = [-0.75, -0.5, -0.25, 0, 0.25, 0.5, 0.75];   // the lines of constant x and of constant y drawn on each membrane
const NET_W = 0.3;                  // their stroke
const RIM = 0.55;                   // the rims' stroke
const PT = 1.35;                    // a marked point's dot
const LEAD = 5;                     // the words over the bump stand this far above its far rim
const LINE_GAP = 10.5;              // between their two baselines
const TITLE_DROP = 15;              // the functions' baseline, this far below the lowest ink above it
// the membrane: the page's neutral tint by day, a dark stone by night, lit softly (as the paper's lit caps are)
const SKIN = TINT, SKIN_NIGHT = '#55504a';
const LIGHT = { ambient: 0.5, key: 0.62, fill: 0.1, spec: 0.08, shininess: 18, steps: 48 };
const LIGHT_NIGHT = { ambient: 0.45, key: 0.75, spec: 0.03 };

export default async function () {
	// ---- the mathematics
	for (const [x, y] of [[0, 0], [0.3, -0.5], [0.7, 0.1]]) {
		check(near(laplacian(saddle, x, y), 0, 1e-6), 'the saddle is not harmonic');
		check(near(laplacian(bump, x, y), -4, 1e-6), 'the Laplacian of the bump is not -4');
	}
	// the saddle's extremes over the disc lie on the rim, at (+-1, 0) and (0, +-1); the bump's at the centre
	let hi = -Infinity, lo = Infinity, top = -Infinity;
	for (let i = 0; i <= 400; i++) for (let j = 0; j <= 400; j++) {
		const x = -1 + i / 200, y = -1 + j / 200;
		if (x * x + y * y > 1) continue;
		hi = Math.max(hi, saddle(x, y)); lo = Math.min(lo, saddle(x, y)); top = Math.max(top, bump(x, y));
		if (x * x + y * y < 0.98) check(saddle(x, y) < 1 && saddle(x, y) > -1, 'the saddle reaches its extremes inside the disc');
	}
	check(hi === 1 && lo === -1 && top === 1, 'the extremes are not 1, -1 and 1');
	check(saddle(1, 0) === 1 && saddle(-1, 0) === 1 && saddle(0, 1) === -1 && saddle(0, -1) === -1 && bump(0, 0) === 1, 'the marked points are not the extremes');

	const P = new Panel({ x: ORIGIN, y: ORIGIN, w: 0, h: 0, scale: S, tilt: TILT, turn: TURN });
	const ink = new Sheet(P, name);
	// the chapter's axes in three.js's world (y up): x to the right, y away from the viewer, u up
	const X = v3(1, 0, 0), Y = v3(0, 0, -1), U = v3(0, 1, 0);
	const [right] = cameraAxes(P);
	const flat = right.clone().setY(0).normalize();
	const panels = [
		{ f: saddle, c: flat.clone().multiplyScalar(-APART / 2), what: 'the saddle' },
		{ f: bump, c: flat.clone().multiplyScalar(APART / 2), what: 'the bump' }
	];
	const world = (p, x, y) => p.c.clone().addScaledVector(X, x).addScaledVector(Y, y).addScaledVector(U, H * p.f(x, y));

	for (const p of panels) {
		// ---- the membrane: a polar mesh, every vertex on the surface
		const pos = [], idx = [];
		const vid = (i, j) => (i === 0 ? 0 : 1 + (i - 1) * NT + (j % NT));
		pos.push(...world(p, 0, 0).toArray());
		for (let i = 1; i <= NR; i++) for (let j = 0; j < NT; j++) {
			const r = i / NR, t = (2 * Math.PI * j) / NT;
			pos.push(...world(p, r * Math.cos(t), r * Math.sin(t)).toArray());
		}
		for (let j = 0; j < NT; j++) idx.push(0, vid(1, j), vid(1, j + 1));
		for (let i = 1; i < NR; i++) for (let j = 0; j < NT; j++) {
			idx.push(vid(i, j), vid(i + 1, j), vid(i + 1, j + 1));
			idx.push(vid(i, j), vid(i + 1, j + 1), vid(i, j + 1));
		}
		const g = new THREE.BufferGeometry();
		g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
		g.setIndex(idx);
		g.computeVertexNormals();
		// every face faces the viewer: nothing of the surface hides another part of it
		const flatG = g.toNonIndexed(), fp = flatG.attributes.position;
		let back = 0;
		for (let k = 0; k < fp.count; k += 3) {
			const C = [0, 1, 2].map((m) => P.cam(new THREE.Vector3().fromBufferAttribute(fp, k + m)));
			const z = new THREE.Vector3().subVectors(C[1], C[0]).cross(new THREE.Vector3().subVectors(C[2], C[0])).z;
			if (z <= 0) back++;
		}
		check(back === 0, `${p.what}: ${back} faces turn away from the viewer`);
		// and the steepest slope of the drawn surface, 2H, is less steep than the line of sight
		check(2 * H < Math.tan((TILT * Math.PI) / 180), 'the surface is steeper than the line of sight');
		P.items.push({ kind: 'raw', layer: 0, depth: 0, svg: membrane(P, g) });

		// ---- the rim, one closed curve on the surface
		const rim = Array.from({ length: 721 }, (_, k) => { const t = (2 * Math.PI * k) / 720; return world(p, Math.cos(t), Math.sin(t)); });
		ink.curve(rim, { color: INK, width: RIM, layer: 1, what: `${p.what}'s rim` });
		// ---- the net: lines of constant x and of constant y across the disc, on the surface (every face faces the
		// viewer, so they are seen whole)
		for (const c of NET) {
			const e = Math.sqrt(1 - c * c);
			const n = 160;
			const along = (f) => Array.from({ length: n + 1 }, (_, k) => f(-e + (2 * e * k) / n));
			ink.curve(along((t) => world(p, c, t)), { color: FAINT, width: NET_W, layer: 0.5, what: `${p.what}'s line x = ${c}` });
			ink.curve(along((t) => world(p, t, c)), { color: FAINT, width: NET_W, layer: 0.5, what: `${p.what}'s line y = ${c}` });
		}
		// the surface's outline on the page, for the labels: the rim and the points of the mesh
		p.screen = [];
		for (let k = 0; k < pos.length; k += 3) p.screen.push(ink.at(v3(pos[k], pos[k + 1], pos[k + 2])));
	}

	// ---- the marked points
	const [sad, bum] = panels;
	const highs = [[1, 0], [-1, 0]], lows = [[0, 1], [0, -1]];
	for (const [x, y] of [...highs, ...lows]) ink.dot(world(sad, x, y), { r: PT, color: INK, layer: 4, what: `the saddle's point ${x},${y}` });
	ink.dot(world(bum, 0, 0), { r: PT, color: INK, layer: 4, what: 'the peak' });

	// ---- the surfaces as obstacles for the labels: their outlines on the page, as closed polylines
	for (const p of panels) {
		const hull = convexHull(p.screen);
		ink.mark([...hull, hull[0]], 0, `${p.what}'s outline`);
	}

	// ---- labels
	const L = [];
	const unit = (x, y) => { const l = Math.hypot(x, y); return [x / l, y / l]; };
	const away = (p, q) => { const A = ink.at(p.c), B = ink.at(q); return unit(B[0] - A[0], B[1] - A[1]); };
	// the saddle: its largest value at the right-hand high point, its smallest at the near low point
	const hiP = world(sad, 1, 0), loP = world(sad, 0, -1);
	L.push(await ink.label('u = 1', ink.at(hiP), away(sad, hiP), 2.4, INK));
	L.push(await ink.label('u = -1', ink.at(loP), away(sad, loP), 2.4, INK));
	// the bump: the words above it, in two lines, centred over the peak; a thin leader from the peak up to them (the
	// peak lies inside the bump's outline on the page, below its far rim, so no label can sit beside it)
	const peak = ink.at(world(bum, 0, 0));
	const crown = Math.min(...bum.screen.map((q) => q[1]));
	const lines = [];
	for (const [k, src] of [[0, 'in empty space'], [1, 'not allowed']]) {
		const g = await tex(`\\text{${src}}`, [peak[0], crown - LEAD - 2.4 - LINE_GAP * k - 2.2], SIZE, 'cB', INK);
		lines.push({ src, svg: g, box: boxOf(g) });
	}
	// the first line's descender sets where the leader stops
	const stop = lines[0].box.b + 2.4;
	const from = [peak[0], peak[1] - PT - 1.6];
	P.items.push({ kind: 'raw', layer: 3, depth: 0, svg: `<path d="M${from[0].toFixed(2)},${from[1].toFixed(2)}L${peak[0].toFixed(2)},${stop.toFixed(2)}" stroke="${DIM}" stroke-width="${HAIR}" fill="none"/>` });
	ink.mark([from, [peak[0], stop]], HAIR / 2, 'the leader');
	check(stop < crown, 'the leader does not reach above the bump');
	L.push(...lines);
	// the two functions, under their surfaces, on one baseline below everything else
	const low = Math.max(...panels.flatMap((p) => p.screen.map((q) => q[1])), ...L.map((l) => l.box.b));
	for (const [p, src] of [[sad, 'u = x^2 - y^2'], [bum, 'u = 1 - r^2']]) {
		const g = await tex(src, [ink.at(p.c)[0], low + TITLE_DROP], SIZE, 'cB', INK);
		L.push({ src, svg: g, box: boxOf(g) });
	}
	ink.checkAll(L);
	return finish(name, P, L, [280, 340]);
}

/** The convex hull of points on the page (Andrew's monotone chain). */
function convexHull(pts) {
	const p = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
	const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
	const lower = [], upper = [];
	for (const q of p) { while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], q) <= 0) lower.pop(); lower.push(q); }
	for (const q of p.reverse()) { while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], q) <= 0) upper.pop(); upper.push(q); }
	return [...lower.slice(0, -1), ...upper.slice(0, -1)];
}

/** A lit membrane as SVG: each face of the mesh `g` shaded by the studio from its normal (lib.js, shadeNormal, as
 * Panel.mesh does), filled light-dark(day, night). Every face faces the viewer and no face hides another (asserted
 * by the caller), so the order of the faces does not matter, and all the faces of one colour are drawn as one path,
 * each with a hairline of its own colour that closes the seams between neighbours. */
function membrane(P, g) {
	const flat = g.toNonIndexed(), pos = flat.attributes.position, nor = flat.attributes.normal;
	const day = new THREE.Color(SKIN), night = new THREE.Color(SKIN_NIGHT);
	const hex = (c) => '#' + c.getHexString();
	// the night shade, in steps of 3 of the 255 screen levels (lib.js does the same), so that dark faces do not terrace
	const dark = (n) => {
		const c = shadeNormal(night, n, { ...LIGHT, ...LIGHT_NIGHT, steps: 0 }).getHex();
		return '#' + [16, 8, 0].map((k) => Math.min(255, 3 * Math.round(((c >> k) & 255) / 3)).toString(16).padStart(2, '0')).join('');
	};
	const groups = new Map();
	const pt = (p) => P.at(p).map((v) => v.toFixed(2)).join(',');
	for (let i = 0; i < pos.count; i += 3) {
		const V = [0, 1, 2].map((k) => new THREE.Vector3().fromBufferAttribute(pos, i + k));
		const n = new THREE.Vector3();
		for (let k = 0; k < 3; k++) n.add(new THREE.Vector3().fromBufferAttribute(nor, i + k));
		n.transformDirection(P.rot).normalize();
		if (n.z < 0) n.negate();
		const fill = `light-dark(${hex(shadeNormal(day, n, LIGHT))}, ${dark(n)})`;
		groups.set(fill, (groups.get(fill) ?? '') + `M${V.map(pt).join('L')}Z`);
	}
	return [...groups].map(([fill, d]) => `<path d="${d}" fill="${fill}" stroke="${fill}" stroke-width="0.18" stroke-linejoin="round"/>`).join('');
}
