// Shared numbers and tools for the three diagrams of the tutorial's chapter 13.1 (tutorial/what-a-field-keeps/
// push-and-pass.md): tut-pass-two-orders, tut-pass-annulus and tut-pass-slice. Not a figure itself. The sheet, strokes,
// labels and cropping are chapters 1.2 to 12.2's (figs/tut-pot-lib.js), the fitted dashes chapter 1.8's
// (figs/tut-orb-lib.js), the paper's cutaway bodies figs/ladder.js's (sprites/hair/shell.png, the iron point), the
// stone's ink chapter 1.8's and matter's colour chapter 7.3's (figs/tut-linear-lib.js, read from app.css), all
// imported, not copied.
//
// The colours: the mass (the bars of energy, the projected mass Sigma) in matter's colour; everything else in ink, the
// page's greys and the stone. Orange and blue, which mean a stretch and a squeeze, are not used.
//
// The numbers, each computed here and asserted against the chapter's text (outside its comments) by `chapter(check)`:
//  - the pair of fig:passing: a thin shell of mass M at R/sqrt 2, and M/2 at the centre of a shell of radius R that
//    holds the other half; the energy a pass at b leaves, F(b) = sum_shells m asin(r/b) / (r sqrt(b^2 - r^2)) in units
//    of M C^2 / 2 R^2 (a point: m / b^2), less the recoil M / b^2: 0.0803 and 0.1041 at b = 1.5 R, the text's 0.080
//    and 0.104, 30 per cent apart. Asserted against the paper's code, app/src/lib/hair/passing.ts (internalF = bodyF -
//    recoilF), read out once by a scratch run of that file (2026-11-24) and copied below as PASSING_TS, to 1e-12; the
//    code is not imported. Also against the planar series of the text: the m_pp of a thin shell, by quadrature over
//    its projected disc, are m r^(2p) (2p)!! / (2p + 1)!!, so both bodies have m_11 = M R^2 / 3 and m_22 = 2/15 and
//    4/15 M R^4, and sum_p m_pp / b^(2p+2) from p = 1 is the internal energy, to 1e-12;
//  - the grid of terms: the pairs (p, q) with p + q <= n number (n + 1)(n + 2)/2, a row p + q = n has n + 1 of them,
//    each at its own (p + q, q - p), and the bending's, (0, q) and (q, 0), number 1 + 2n; the text's table, rows 1 3 5
//    7 9 and 1 3 6 10 15, is asserted against these counts;
//  - the lopsided body of the chapter's interactive (its try comment): 0.7 M at (0.27 - 0.09i) R and 0.3 M at
//    (-0.63 + 0.21i) R, whose centre of mass is the origin;
//  - the slices: for many random k, n = k x nu / |k x nu| is at right angles to nu (on the great circle) and to k (k on
//    its slice), as the text derives.
import { sprite, THREE, shadeNormal } from '../lib.js';
import { MARGIN } from '../stone.js';
import { palette, MATTER } from './tut-linear-lib.js';
import { STONE_INK } from './tut-orb-lib.js';

export { MATTER, STONE_INK };
export const near = (a, b, tol = 1e-12) => Math.abs(a - b) <= tol;

// ---- the pair of fig:passing (lengths in R, masses in M) --------------------------------------------------------
/** Each body as thin shells [mass, radius]; a radius of zero is a point. */
export const TWINS = [
	{ key: 'shell', shells: [[1, Math.SQRT1_2]] },
	{ key: 'half', shells: [[0.5, 0], [0.5, 1]] }
];
export const PASS = 1.5;                       // |b| / R
/** app/src/lib/hair/passing.ts, internalF(TWINS.a | TWINS.b, 1.5), read out by a scratch run on 2026-11-24. */
export const PASSING_TS = [0.08033121248714936, 0.1041219066547967];

/** F of one shell for a pass at b, in units of M C^2 / 2 R^2. */
export const shellF = ([m, r], b) => (r === 0 ? m / b ** 2 : (m * Math.asin(r / b)) / (r * Math.sqrt(b * b - r * r)));
/** The energy left inside a body: F less the recoil M / b^2. */
export const internal = (body, b) => body.shells.reduce((s, sh) => s + shellF(sh, b), 0) - body.shells.reduce((s, [m]) => s + m, 0) / b ** 2;
/** (2p)!! / (2p + 1)!!, the mean of sin^(2p) over a sphere. */
export const meanSin = (p) => { let c = 1; for (let k = 1; k <= p; k++) c *= (2 * k) / (2 * k + 1); return c; };
/** m_pp of a body by quadrature: each thin shell projects to the disc of its radius with Sigma = m / (2 pi r sqrt(r^2 - s^2)),
 * so m_pp = m int_0^r s^(2p) s / (r sqrt(r^2 - s^2)) ds; with s = r sin t, m r^(2p) int_0^(pi/2) sin^(2p+1) t dt. */
export function mpp(body, p, n = 4000) {
	return body.shells.reduce((sum, [m, r]) => {
		if (r === 0) return sum + (p === 0 ? m : 0);
		let s = 0;
		for (let i = 0; i < n; i++) { const t = ((i + 0.5) * Math.PI) / (2 * n); s += Math.sin(t) ** (2 * p + 1); }
		return sum + m * r ** (2 * p) * s * (Math.PI / (2 * n));
	}, 0);
}

// ---- the grid of terms --------------------------------------------------------------------------------------------
export const TOP = 4;                          // the highest total degree drawn
/** The terms of total degree n, as { p, q, row: p + q, col: q - p, bending: p === 0 || q === 0 }. */
export const row = (n) => Array.from({ length: n + 1 }, (_, p) => ({ p, q: n - p, row: n, col: n - 2 * p, bending: p === 0 || p === n }));

// ---- the lopsided body of the chapter's interactive -------------------------------------------------------------
export const LUMPS = [{ m: 0.7, w: [0.27, -0.09] }, { m: 0.3, w: [-0.63, 0.21] }];
export const RINGS = [1.5, 2.2, 3];            // the circles of impact points, in units of the body's radius
export const BEADS = 12;

/** Every number of the chapter that the three diagrams draw or their captions print, checked once. */
export async function chapter(check) {
	await palette(check);
	const md = await (await fetch('/tutorial/what-a-field-keeps/push-and-pass.md')).text();
	const flat = md.replace(/<!--[\s\S]*?-->/g, ' ').replace(/\s+/g, ' ');
	const comments = [...md.matchAll(/<!--([\s\S]*?)-->/g)].map((m) => m[1].replace(/\s+/g, ' '));
	const has = (s, what) => check(flat.includes(s.replace(/\s+/g, ' ')), `the chapter does not say ${what}: ${s}`);
	const r = String.raw;

	// ---- the pair
	has(r`a thin shell, and a point at the centre of a larger shell that holds half the mass. A tonne flies past each on
		the same straight path, at 1.5 times the larger radius from the centre. Both bodies bend its path by exactly the same
		small angle.`, 'the pair');
	has(r`Both have $m_{11} = \tfrac13\matter MR^2$, with $R$ the larger shell's radius, so their losses agree up to
		$|b|^{-4}$. Then $m_{22}$ is $\tfrac{2}{15}\matter MR^4$ for the thin shell and $\tfrac{4}{15}\matter MR^4$ for the
		other. Summed in full at $|b| = 1.5R$, the internal energies are 0.080 and 0.104 in units of $\matter MC^2/2R^2$, 30 per
		cent apart.`, 'the energies of the pair');
	const E = TWINS.map((b) => internal(b, PASS));
	E.forEach((e, i) => check(near(e, PASSING_TS[i], 1e-12), `the energy of ${TWINS[i].key}: ${e} against passing.ts's ${PASSING_TS[i]}`));
	check(E[0].toFixed(3) === '0.080' && E[1].toFixed(3) === '0.104', `the energies ${E}`);
	check(Math.round(100 * (E[1] / E[0] - 1)) === 30, 'the energies are not 30 per cent apart');
	for (const [i, body] of TWINS.entries()) {
		for (let p = 0; p <= 3; p++) {
			const exact = body.shells.reduce((s, [m, rr]) => s + m * (rr === 0 ? (p === 0 ? 1 : 0) : rr ** (2 * p) * meanSin(p)), 0);
			check(near(mpp(body, p), exact, 1e-7), `m_${p}${p} of ${body.key}`);
		}
		check(near(mpp(body, 1), 1 / 3, 1e-7), `m_11 of ${body.key}`);
		check(near(mpp(body, 2), [2 / 15, 4 / 15][i], 1e-7), `m_22 of ${body.key}`);
		let series = 0;
		for (let p = 1; p < 200; p++) series += body.shells.reduce((s, [m, rr]) => s + m * (rr === 0 ? 0 : rr ** (2 * p) * meanSin(p)), 0) / PASS ** (2 * p + 2);
		check(near(series, E[i], 1e-12), `the planar series of ${body.key}: ${series} against ${E[i]}`);
	}

	// ---- the grid
	has(r`It falls as the power $p + q + 2$ of the distance, and its phase turns $q - p$ times as $b$ goes once round the
		body. No two different terms share both numbers, because $p + q$ and $q - p$ fix $p$ and $q$.`, 'the terms\' two numbers');
	has(r`Up to the total degree $n$ there are $(n + 1)(n + 2)/2$ pairs $(p, q)$.`, 'the count of the pairs');
	has(r`| real numbers in the bending | 1 | 3 | 5 | 7 | 9 |`, 'the bending\'s row');
	has(r`| real numbers in the loss | 1 | 3 | 6 | 10 | 15 |`, 'the loss\'s row');
	has(r`Only the moments $m_{0q}$ enter`, 'the bending\'s moments');
	{
		let all = 0, bend = 0;
		const seen = new Set();
		for (let n = 0; n <= TOP; n++) {
			const terms = row(n);
			check(terms.length === n + 1, `the row ${n} has ${terms.length} terms`);
			for (const t of terms) {
				check(t.p + t.q === t.row && t.q - t.p === t.col && Math.abs(t.col) <= n && (t.col + n) % 2 === 0, `the term (${t.p}, ${t.q})`);
				const key = `${t.row},${t.col}`;
				check(!seen.has(key), `two terms at ${key}`);
				seen.add(key);
			}
			all += terms.length;
			bend += terms.filter((t) => t.bending).length;
			check(all === ((n + 1) * (n + 2)) / 2 && bend === 1 + 2 * n, `the counts to degree ${n}: ${all}, ${bend}`);
			check(flat.includes(`| real numbers in the bending | 1 | 3 | 5 | 7 | 9 |`.replace(/9/, String(1 + 2 * TOP))), 'the table');
			// pairs (p, q) and (q, p) share one complex number: the real numbers equal the pairs
			let reals = 0;
			for (let m = 0; m <= n; m++) for (const t of row(m)) reals += t.p === t.q ? 1 : t.p < t.q ? 2 : 0;
			check(reals === all, `the real numbers of the loss to degree ${n}`);
		}
	}

	// ---- the lopsided body
	{
		const cm = LUMPS.reduce((s, l) => [s[0] + l.m * l.w[0], s[1] + l.m * l.w[1]], [0, 0]);
		check(near(cm[0], 0, 1e-15) && near(cm[1], 0, 1e-15) && near(LUMPS[0].m + LUMPS[1].m, 1, 1e-15), 'the lopsided body\'s centre of mass');
		// the try comment became the interactive FirstAndSecondOrder: its try block names the two lumps, and the module
		// it registers places them where these do
		const live = await (await fetch('/app/src/lib/tutorial/live.ts')).text();
		const mod = await (await fetch('/app/src/lib/tutorial/live/first-and-second-order.ts')).text();
		const tryBlock = (md.match(/^::: try \{#first-and-second-order\}\n[\s\S]*?^:::$/m) ?? [''])[0];
		check(tryBlock.includes('*Two\nlumps*') && /\nlive: \[first-and-second-order\]\n/.test(md) && live.includes("'first-and-second-order': {") &&
			mod.includes(`{ mass: ${LUMPS[0].m}, at: cx(${LUMPS[0].w[0]}, ${LUMPS[0].w[1]}) }`) && mod.includes(`{ mass: ${LUMPS[1].m}, at: cx(${LUMPS[1].w[0]}, ${LUMPS[1].w[1]}) }`), 'the interactive\'s lumps');
	}

	// ---- the slices
	has(r`A **great circle** of directions is the set of all directions at right angles to one axis $\hat\nu$`, 'the great circle');
	has(r`&= \tilde{\matter\Sigma}_{\hat n}(\vect k)\quad\text{for }\vect k\cdot\hat n = 0 .`, 'the slice');
	{
		let seed = 7;
		const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1;
		const nu = new THREE.Vector3(0.3, 0.9, -0.2).normalize();
		for (let i = 0; i < 200; i++) {
			const k = new THREE.Vector3(rnd(), rnd(), rnd());
			const n = k.clone().cross(nu).normalize();
			check(Math.abs(n.dot(nu)) < 1e-12 && Math.abs(n.dot(k)) < 1e-12, 'a slice does not hold its k');
		}
	}

	/** Whether the diagram `name` is drawn (its figure line, with the caption `caption`) or still planned (its comment). */
	const state = (name, id, caption) => {
		const drawn = flat.includes(`](${name}){#fig:${id}}`);
		const planned = comments.some((c) => c.includes(`diagram: ${name} `));
		check(drawn !== planned, `the diagram ${name} is ${drawn ? 'both drawn and planned' : 'neither drawn nor planned'}`);
		if (drawn) {
			has(`![${caption}](${name}){#fig:${id}}`, `the caption of ${name}`);
			has(`(Figure [](#fig:${id}))`, `the pointer to ${name}`);
		}
		return drawn;
	};
	return { md, flat, has, state, E };
}

// ---- a stone body drawn as a picture -------------------------------------------------------------------------------
// A star-shaped body of uniform density, its surface at the distance rad(u) from its centre in the direction u (a unit
// vector, world), seen by an orthographic view: lit by the studio of lib.js (shadeNormal, the stone's make of
// figs/tidal.js) over the colours of the sawn stone (sprites/hair/ball-face.png), sampled across the page so that the
// picture is the stone's own. Its outline is found exactly (bisection on each ray from its centre's image), and the
// picture is clipped to it, so that its edge on the page is the figure's, in vector.
export const STONE_LOOK = { spec: 0.1, shininess: 10, wrap: 0.45, ambient: 0.34, steps: 0 };

/** An orthographic view: world (x, y up, z) turned by `turn` about y, then seen from `tilt` degrees above the horizon.
 * `scale` points per unit, the world's origin at the figure point `o`. ex, ey: the page's right and up; ez: toward the
 * viewer. */
export class View {
	constructor({ turn, tilt, scale, o }) {
		const t = (turn * Math.PI) / 180, e = (tilt * Math.PI) / 180;
		// the world's axes turned about y by t: x' = x cos t - z sin t, z' = x sin t + z cos t
		const X = new THREE.Vector3(Math.cos(t), 0, -Math.sin(t)), Z = new THREE.Vector3(Math.sin(t), 0, Math.cos(t)), Y = new THREE.Vector3(0, 1, 0);
		// page right: X; page up: Y cos e - Z sin e; toward the viewer: Y sin e + Z cos e
		this.ex = X;
		this.ey = Y.clone().multiplyScalar(Math.cos(e)).add(Z.clone().multiplyScalar(-Math.sin(e)));
		this.ez = Y.clone().multiplyScalar(Math.sin(e)).add(Z.clone().multiplyScalar(Math.cos(e)));
		Object.assign(this, { scale, o });
	}
	/** The figure point (y down) of the world point p (a Vector3 or [x, y, z]). */
	at(p) {
		const [x, y, z] = Array.isArray(p) ? p : [p.x, p.y, p.z];
		return [this.o[0] + this.scale * (x * this.ex.x + y * this.ex.y + z * this.ex.z), this.o[1] - this.scale * (x * this.ey.x + y * this.ey.y + z * this.ey.z)];
	}
	/** How near the viewer the world point is (world units). */
	depth(p) {
		const [x, y, z] = Array.isArray(p) ? p : [p.x, p.y, p.z];
		return x * this.ez.x + y * this.ez.y + z * this.ez.z;
	}
}

/** A star-shaped body: centre c ([x, y, z], world), surface rad(ux, uy, uz) for a unit vector; f(x, y, z) < 0 inside. */
export function body(c, rad) {
	const f = (x, y, z) => {
		const dx = x - c[0], dy = y - c[1], dz = z - c[2], L = Math.hypot(dx, dy, dz);
		return L === 0 ? -1 : L - rad(dx / L, dy / L, dz / L);
	};
	return { c, rad, f };
}

/** The world point [x, y, z] on the line of sight through the figure point q at the depth d. */
const along = (V, q, d) => {
	const a = (q[0] - V.o[0]) / V.scale, b = -(q[1] - V.o[1]) / V.scale;
	return [V.ex.x * a + V.ey.x * b + V.ez.x * d, V.ex.y * a + V.ey.y * b + V.ez.y * d, V.ex.z * a + V.ey.z * b + V.ez.z * d];
};
const fAt = (B, V, q, d) => { const p = along(V, q, d); return B.f(p[0], p[1], p[2]); };

/** The first stretch of the line of sight through the figure point q that lies inside the body, from the viewer:
 * [near, far] depths, or null; found on steps of `step` world units across depths within `reach` of the centre, then
 * by bisection. */
export function sight(B, V, q, reach, step = 0.02) {
	const d0 = V.depth(B.c);
	let first = null, last = null;
	for (let d = d0 + reach; d >= d0 - reach - 1e-12; d -= step) {
		const inside = fAt(B, V, q, d) < 0;
		if (inside) { if (first === null) first = d; last = d; } else if (first !== null) break;
	}
	if (first === null) return null;
	const bis = (a, b) => { for (let i = 0; i < 40; i++) { const m = (a + b) / 2; if (fAt(B, V, q, m) < 0) a = m; else b = m; } return (a + b) / 2; };
	return [bis(first, first + step), bis(last, last - step)];
}

/** The length of the line of sight through q inside the body, on steps of `step` (the midpoint rule). */
export function chord(B, V, q, reach, step = 0.004) {
	const d0 = V.depth(B.c);
	let L = 0;
	for (let d = d0 - reach + step / 2; d < d0 + reach; d += step) if (fAt(B, V, q, d) < 0) L += step;
	return L;
}

/** Whether any part of the body lies on the line of sight through the figure point q (by the least of f along it). */
export function covers(B, V, q, reach) {
	const d0 = V.depth(B.c);
	let best = Infinity, at = d0;
	for (let d = d0 - reach; d <= d0 + reach; d += 0.01) { const v = fAt(B, V, q, d); if (v < best) { best = v; at = d; } }
	if (best < 0) return true;
	// golden-section search about the coarse least
	let a = at - 0.01, b = at + 0.01;
	const g = 0.618033988749895;
	for (let i = 0; i < 40; i++) {
		const x1 = b - g * (b - a), x2 = a + g * (b - a);
		if (fAt(B, V, q, x1) < fAt(B, V, q, x2)) b = x2; else a = x1;
	}
	return fAt(B, V, q, (a + b) / 2) < 0;
}

/** The outline of the body on the page: for n angles about its centre's image, the farthest point whose line of
 * sight meets the body, by bisection (figure points). */
export function outline(B, V, reach, n = 720) {
	const [cx, cy] = V.at(B.c);
	const pts = [];
	for (let k = 0; k < n; k++) {
		const a = (2 * Math.PI * k) / n, u = [Math.cos(a), -Math.sin(a)];
		let lo = 0, hi = reach * V.scale;
		for (let i = 0; i < 36; i++) { const m = (lo + hi) / 2; if (covers(B, V, [cx + u[0] * m, cy + u[1] * m], reach)) lo = m; else hi = m; }
		pts.push([cx + u[0] * lo, cy + u[1] * lo]);
	}
	return pts;
}

/** Whether the figure point q lies inside the closed polygon pts. */
export function insidePolygon(pts, [x, y]) {
	let inside = false;
	for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
		const [xi, yi] = pts[i], [xj, yj] = pts[j];
		if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
	}
	return inside;
}

/** The sawn stone's colours, as a function of a point of the page in units of the body's size (u, v in [-1, 1]). */
export async function stoneColours() {
	const face = await sprite('/figures3d/sprites/hair/ball-face.png');
	const img = new Image();
	img.src = face.href;
	await img.decode();
	const c = document.createElement('canvas');
	c.width = img.width; c.height = img.height;
	const ctx = c.getContext('2d');
	ctx.drawImage(img, 0, 0);
	const d = ctx.getImageData(0, 0, img.width, img.height).data;
	// the face's inner 62 per cent, clear of its bevelled rim
	const half = (img.width - 2 * MARGIN) / 2, inner = 0.62 * half;
	return (u, v) => {
		const x = Math.min(img.width - 1, Math.max(0, Math.round(img.width / 2 + u * inner)));
		const y = Math.min(img.height - 1, Math.max(0, Math.round(img.height / 2 - v * inner)));
		const k = (y * img.width + x) * 4;
		return [d[k], d[k + 1], d[k + 2]];
	};
}

/** The body as a lit picture: an <image> clipped to its exact outline, with its rim in the stone's ink, and the
 * outline itself (figure points). `size` is the body's size in world units, for the stone's grain; `px` pixels per
 * point. */
export async function stonePicture(id, B, V, { reach, size, px = 5, colours, rimWidth = 0.35 }) {
	const out = outline(B, V, reach);
	const xs = out.map((p) => p[0]), ys = out.map((p) => p[1]);
	const box = { l: Math.floor(Math.min(...xs)) - 1, r: Math.ceil(Math.max(...xs)) + 1, t: Math.floor(Math.min(...ys)) - 1, b: Math.ceil(Math.max(...ys)) + 1 };
	const W = (box.r - box.l) * px, H = (box.b - box.t) * px;
	const canvas = document.createElement('canvas');
	canvas.width = W; canvas.height = H;
	const ctx = canvas.getContext('2d');
	const img = ctx.createImageData(W, H);
	const [cx, cy] = V.at(B.c);
	const base = new THREE.Color();
	const h = 1e-4;
	// the polygon grown by a point, so that the picture runs under the rim
	const grown = out.map(([x, y]) => { const L = Math.hypot(x - cx, y - cy) || 1; return [x + ((x - cx) / L) * 1.2, y + ((y - cy) / L) * 1.2]; });
	for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) {
		const q = [box.l + (i + 0.5) / px, box.t + (j + 0.5) / px];
		if (!insidePolygon(grown, q)) continue;
		let s = sight(B, V, q, reach);
		let qq = q;
		if (!s) {
			// just outside the true outline, under the clip's antialiased edge: take the colour of the nearest point inside
			const L = Math.hypot(q[0] - cx, q[1] - cy);
			for (let m = 0.95; m > 0.5 && !s; m -= 0.01) { qq = [cx + (q[0] - cx) * m, cy + (q[1] - cy) * m]; s = sight(B, V, qq, reach); }
			if (!s || !L) continue;
		}
		const [x, y, z] = along(V, qq, s[0]);
		const gx = B.f(x + h, y, z) - B.f(x - h, y, z), gy = B.f(x, y + h, z) - B.f(x, y - h, z), gz = B.f(x, y, z + h) - B.f(x, y, z - h);
		const n = new THREE.Vector3(gx * V.ex.x + gy * V.ex.y + gz * V.ex.z, gx * V.ey.x + gy * V.ey.y + gz * V.ey.z, gx * V.ez.x + gy * V.ez.y + gz * V.ez.z).normalize();
		const [r0, g0, b0] = colours((q[0] - cx) / (size * V.scale), -(q[1] - cy) / (size * V.scale));
		base.setRGB(r0 / 255, g0 / 255, b0 / 255, THREE.SRGBColorSpace);
		const hx = shadeNormal(base, n, STONE_LOOK).getHex();
		const k = (j * W + i) * 4;
		img.data[k] = (hx >> 16) & 255; img.data[k + 1] = (hx >> 8) & 255; img.data[k + 2] = hx & 255; img.data[k + 3] = 255;
	}
	ctx.putImageData(img, 0, 0);
	const href = canvas.toDataURL('image/png');
	const d = 'M' + out.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join('L') + 'Z';
	const svg = `<clipPath id="${id}"><path d="${d}"/></clipPath>` +
		`<image class="art" href="${href}" x="${box.l}" y="${box.t}" width="${box.r - box.l}" height="${box.b - box.t}" preserveAspectRatio="none" clip-path="url(#${id})"/>` +
		`<path d="${d}" fill="none" stroke="${STONE_INK}" stroke-width="${rimWidth}" stroke-linejoin="round"/>`;
	return { svg, outline: [...out, out[0]], d };
}
