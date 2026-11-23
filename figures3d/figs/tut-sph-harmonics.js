// The tutorial, chapter 2.2 (tutorial/outside/spherical-harmonics.md), its third diagram: the real parts of the
// spherical harmonics Y_lm for l = 0, 1, 2, 3, each drawn on a sphere, orange where it is positive and blue where it
// is negative, in a triangle: one row for each degree l and one column for each order m from -3 to 3, so that the
// rows hold 1, 3, 5 and 7 spheres. Every sphere is seen from the same direction: the z axis up and leaning TILT
// degrees toward the viewer, the x axis toward the viewer's left (lib.js's Panel, turned TURN degrees).
// Exact: the pattern. Re Y_lm = s N_l|m| P_l^|m|(cos theta) cos(m phi), with s = 1 for m >= 0 and (-1)^m for m < 0
// (the chapter's convention, design/tutorial/NOTATION.md, "Spherical harmonics": orthonormal, with the Condon-Shortley
// sign), computed by the recurrence of the chapter's live figure (app/src/lib/tutorial/live/sky-patterns.ts, ported
// here) and checked against the chapter's closed forms up to degree two and for orthonormality up to degree three.
// Its zeros are the l - |m| circles of latitude where P_l^|m| vanishes and the 2|m| half meridians where cos(m phi)
// does; between them the sign is constant (asserted on a grid in every cell), so each sphere is the lit orange sphere
// with the lit blue sphere laid over it, cut to the cells where the pattern is negative: each cell's boundary, traced
// every degree, projected orthographically, its parts on the far side laid on the rim, and filled even-odd (with the
// rim as one more loop for the cell that holds the point straight behind the centre, where laying on the rim is not
// continuous; the counts of negative cells asserted against the zeros, and the colour drawn asserted against the
// sign of the pattern at about 1300 points of each disc). The lighting is the studio's (lib.js), the
// same on both colours. Chosen for the drawing: the view, and the sign only (not the size of the pattern).
import { Panel, v3, THREE, INK, DIM, ACCENT, ACCENT2 } from '../lib.js';
import { Sheet, ORIGIN, placed, finish, checker, near, n2 } from './tut-pot-lib.js';

const name = 'tut-sph-harmonics';
const check = checker(name);

// ---- the mathematics (sky-patterns.ts, ported) ------------------------------------------------------------------
const FOUR_PI = 4 * Math.PI;
/** N_lm P_l^m(mu) / (1 - mu^2)^(m/2), normalized, for 0 <= m <= l, by the recurrence in l at fixed m. */
export function reduced(l, m, mu) {
	let pmm = 1 / Math.sqrt(FOUR_PI);
	for (let k = 1; k <= m; k++) pmm *= -Math.sqrt((2 * k + 1) / (2 * k));
	if (l === m) return pmm;
	let before = pmm;
	let now = Math.sqrt(2 * m + 3) * mu * pmm;
	for (let k = m + 2; k <= l; k++) {
		const a = Math.sqrt((4 * k * k - 1) / (k * k - m * m));
		const b = Math.sqrt(((k - 1) * (k - 1) - m * m) / (4 * (k - 1) * (k - 1) - 1));
		const next = a * (mu * now - b * before);
		before = now;
		now = next;
	}
	return now;
}
export const polar = (l, m, t) => reduced(l, m, Math.cos(t)) * Math.sin(t) ** m;
/** Y_lm(theta, phi) as [re, im], for -l <= m <= l, with Y_l,-m = (-1)^m Y*_lm. */
export function harmonic(l, m, t, p) {
	const k = Math.abs(m), r = polar(l, k, t);
	const re = r * Math.cos(k * p), im = r * Math.sin(k * p);
	if (m >= 0) return [re, im];
	const s = k % 2 ? -1 : 1;
	return [s * re, -s * im];
}
export const realPart = (l, m, t, p) => harmonic(l, m, t, p)[0];

/** The polar angles of the zeros of P_l^|m|(cos theta) between the poles. */
function latitudeZeros(l, m) {
	const k = Math.abs(m), f = (t) => reduced(l, k, Math.cos(t));
	const out = [], n = 4000;
	for (let i = 0; i < n; i++) {
		let a = (Math.PI * i) / n, b = (Math.PI * (i + 1)) / n;
		if (f(a) * f(b) >= 0) continue;
		for (let j = 0; j < 80; j++) { const c = (a + b) / 2; if (f(a) * f(c) <= 0) b = c; else a = c; }
		out.push((a + b) / 2);
	}
	return out;
}

/** Gauss-Legendre nodes and weights on [-1, 1], n points (Newton on Bonnet's recurrence). */
function gauss(n) {
	const x = [], w = [];
	for (let i = 1; i <= n; i++) {
		let z = Math.cos((Math.PI * (i - 0.25)) / (n + 0.5)), dp = 0;
		for (let it = 0; it < 100; it++) {
			let p0 = 1, p1 = z;
			for (let k = 2; k <= n; k++) { const p2 = ((2 * k - 1) * z * p1 - (k - 1) * p0) / k; p0 = p1; p1 = p2; }
			dp = (n * (z * p1 - p0)) / (z * z - 1);
			const dz = p1 / dp;
			z -= dz;
			if (Math.abs(dz) < 1e-16) break;
		}
		x.push(z); w.push(2 / ((1 - z * z) * dp * dp));
	}
	return { x, w };
}

// ---- the drawing (points) ---------------------------------------------------------------------------------------
export const TOP = 3;                            // degrees 0 to 3
const R = 18.5;                                  // a sphere's radius
const PITCH = 43;                                // between the centres of neighbours in a row
const ROW = 43;                                  // between rows
const TILT = 22, TURN = -150;                    // the view, degrees (lib.js's Panel: turn about the vertical, then tilt)
const STEP = Math.PI / 180;                      // the cells' boundaries, traced every degree (a third of a point)
const LOOK = { ambient: 0.36, key: 0.74, spec: 0.24, shininess: 24 };   // the studio's lighting, a little softer than the beads'

export default async function () {
	// ---- the chapter's closed forms up to degree two (real and imaginary parts)
	const c = Math.cos, s = Math.sin, sq = Math.sqrt;
	const forms = {
		'0,0': () => [sq(1 / FOUR_PI), 0],
		'1,0': (t) => [sq(3 / FOUR_PI) * c(t), 0],
		'1,1': (t, p) => [-sq(3 / (8 * Math.PI)) * s(t) * c(p), -sq(3 / (8 * Math.PI)) * s(t) * s(p)],
		'1,-1': (t, p) => [sq(3 / (8 * Math.PI)) * s(t) * c(p), -sq(3 / (8 * Math.PI)) * s(t) * s(p)],
		'2,0': (t) => [sq(5 / (16 * Math.PI)) * (3 * c(t) ** 2 - 1), 0],
		'2,1': (t, p) => [-sq(15 / (8 * Math.PI)) * s(t) * c(t) * c(p), -sq(15 / (8 * Math.PI)) * s(t) * c(t) * s(p)],
		'2,-1': (t, p) => [sq(15 / (8 * Math.PI)) * s(t) * c(t) * c(p), -sq(15 / (8 * Math.PI)) * s(t) * c(t) * s(p)],
		'2,2': (t, p) => [sq(15 / (32 * Math.PI)) * s(t) ** 2 * c(2 * p), sq(15 / (32 * Math.PI)) * s(t) ** 2 * s(2 * p)],
		'2,-2': (t, p) => [sq(15 / (32 * Math.PI)) * s(t) ** 2 * c(2 * p), -sq(15 / (32 * Math.PI)) * s(t) ** 2 * s(2 * p)]
	};
	for (const [key, f] of Object.entries(forms)) {
		const [l, m] = key.split(',').map(Number);
		for (let i = 0; i <= 12; i++) for (let j = 0; j < 12; j++) {
			const t = (Math.PI * i) / 12, p = (2 * Math.PI * j) / 12;
			const [a, b] = harmonic(l, m, t, p), [e, g] = f(t, p);
			check(near(a, e, 1e-13) && near(b, g, 1e-13), `Y_${l}${m} is not the chapter's closed form at (${t}, ${p})`);
		}
	}
	check(near(sq(5 / (16 * Math.PI)), 0.315, 5e-4), 'the factor of Y_20 is not 0.315');
	// ---- orthonormality up to degree three: Gauss-Legendre in mu (exact for these polynomials), even steps in phi
	const { x: gx, w: gw } = gauss(12);
	const list = [];
	for (let l = 0; l <= TOP; l++) for (let m = -l; m <= l; m++) list.push([l, m]);
	for (const [l, m] of list) for (const [l2, m2] of list) {
		let re = 0, im = 0;
		const NP = 16;
		for (let i = 0; i < gx.length; i++) for (let j = 0; j < NP; j++) {
			const t = Math.acos(gx[i]), p = (2 * Math.PI * j) / NP;
			const [a, b] = harmonic(l, m, t, p), [e, g] = harmonic(l2, m2, t, p);
			re += gw[i] * (2 * Math.PI / NP) * (a * e + b * g);
			im += gw[i] * (2 * Math.PI / NP) * (a * g - b * e);
		}
		check(near(re, l === l2 && m === m2 ? 1 : 0, 1e-12) && near(im, 0, 1e-12), `Y_${l}${m} and Y_${l2}${m2} are not orthonormal`);
	}

	// ---- the view: chapter axes (x, y, z) to three.js (x, z, -y), then the Panel's turn and tilt
	const rot = new THREE.Matrix4().makeRotationX(THREE.MathUtils.degToRad(TILT)).multiply(new THREE.Matrix4().makeRotationY(THREE.MathUtils.degToRad(TURN)));
	const camOf = (t, p) => v3(Math.sin(t) * Math.cos(p), Math.cos(t), -Math.sin(t) * Math.sin(p)).applyMatrix4(rot);
	const X = v3(1, 0, 0).applyMatrix4(rot), Y = v3(0, 0, -1).applyMatrix4(rot), Z = v3(0, 1, 0).applyMatrix4(rot);
	check(X.clone().cross(Y).distanceTo(Z) < 1e-12, 'the axes are not right-handed');
	check(Z.z > 0.3 && X.z > 0.4 && Y.z > 0.4, 'the north pole and the x and y axes do not all lean toward the viewer');
	/** A point of the unit sphere on the page about (cx, cy): on the near side its projection, on the far side the
	 * point of the rim it lies behind. This laying on the rim is continuous everywhere but at the point straight
	 * behind the centre, so a cell that holds that point has its image's parity turned over: its region on the page
	 * is the disc less what its boundary encloses, and it gets the rim as one more loop. */
	const page = (q, cx, cy) => {
		if (q.z >= 0) return [cx + R * q.x, cy - R * q.y];
		const h = Math.hypot(q.x, q.y);
		return [cx + (R * q.x) / h, cy - (R * q.y) / h];
	};
	const arc = (from, to, f) => {
		const n = Math.max(1, Math.ceil(Math.abs(to - from) / STEP));
		return Array.from({ length: n + 1 }, (_, i) => f(from + ((to - from) * i) / n));
	};

	// the point straight behind the centre, in the chapter's angles
	const back = v3(0, 0, -1).applyMatrix4(rot.clone().invert());
	const tb = Math.acos(back.y), pb = (Math.atan2(-back.z, back.x) + 2 * Math.PI) % (2 * Math.PI);
	check(camOf(tb, pb).distanceTo(v3(0, 0, -1)) < 1e-12, 'the point behind the centre is not found');
	const inside = (t0, t1, p0, p1) => tb > t0 && tb < t1 && (p1 - p0 >= 2 * Math.PI - 1e-12 || ((pb - p0 + 4 * Math.PI) % (2 * Math.PI)) < p1 - p0);
	const rim = (cx, cy) => arc(0, 2 * Math.PI, (a) => [cx + R * Math.cos(a), cy - R * Math.sin(a)]);

	const S = new Sheet(name);
	const centre = (l, m) => [ORIGIN + m * PITCH, ORIGIN + (l - TOP / 2) * ROW];
	let defs = '';
	const counts = {};
	for (const [l, m] of list) {
		const [cx, cy] = centre(l, m);
		const k = Math.abs(m);
		// the zeros: circles of latitude and half meridians
		const lat = latitudeZeros(l, m);
		check(lat.length === l - k, `Y_${l}${m} has ${lat.length} circles of zeros, not ${l - k}`);
		const bands = [0, ...lat, Math.PI];
		const mer = Array.from({ length: 2 * k }, (_, j) => ((2 * j + 1) * Math.PI) / (2 * k));
		for (const p of mer) check(near(Math.cos(m * p), 0, 1e-12), 'a half meridian is not a zero');
		const sectors = k ? mer.map((p, j) => [p, j + 1 < mer.length ? mer[j + 1] : mer[0] + 2 * Math.PI]) : [[0, 2 * Math.PI]];
		// the cells where the pattern is negative, each one subpath or two (a band), filled even-odd
		let d = '';
		let negative = 0;
		for (let b = 0; b + 1 < bands.length; b++) for (const [p0, p1] of sectors) {
			const [t0, t1] = [bands[b], bands[b + 1]];
			const sign = Math.sign(realPart(l, m, (t0 + t1) / 2, (p0 + p1) / 2));
			// the sign is that of the centre everywhere inside the cell
			for (let i = 1; i < 8; i++) for (let j = 1; j < 8; j++) {
				const v = realPart(l, m, t0 + ((t1 - t0) * i) / 8, p0 + ((p1 - p0) * j) / 8);
				check(Math.sign(v) === sign, `Y_${l}${m} changes sign inside a cell`);
			}
			if (sign > 0) continue;
			negative++;
			const loops = [];
			if (k) {
				loops.push([
					...arc(p0, p1, (p) => camOf(t0, p)), ...arc(t0, t1, (t) => camOf(t, p1)),
					...arc(p1, p0, (p) => camOf(t1, p)), ...arc(t1, t0, (t) => camOf(t, p0))
				]);
			} else {
				for (const t of [t0, t1]) if (t > 0 && t < Math.PI) loops.push(arc(0, 2 * Math.PI, (p) => camOf(t, p)));
			}
			for (const loop of loops) d += 'M' + loop.map((q) => page(q, cx, cy).map(n2).join(',')).join('L') + 'Z';
			// no boundary passes near the point behind the centre, where the laying on the rim is not continuous
			const near0 = Math.min(Math.abs(tb - t0), Math.abs(tb - t1), ...(k ? [p0, p1].map((p) => Math.abs(Math.sin(pb - p)) * Math.sin(tb)) : []));
			check(near0 > 0.05, `a boundary of Y_${l}${m} passes behind the centre`);
			if (inside(t0, t1, p0, p1)) d += 'M' + rim(cx, cy).map((q) => q.map(n2).join(',')).join('L') + 'Z';
		}
		counts[`${l},${m}`] = negative;
		// the drawing against the pattern: at points of the disc on a grid, the blue is laid exactly where the pattern
		// on the near side of the sphere is negative (points within a tenth of a point of a zero are passed over)
		{
			const ns = 'http://www.w3.org/2000/svg';
			const svg = document.createElementNS(ns, 'svg');
			const path = document.createElementNS(ns, 'path');
			path.setAttribute('d', d || 'M0,0Z');
			path.setAttribute('fill-rule', 'evenodd');
			svg.appendChild(path);
			document.body.appendChild(svg);
			const inv = rot.clone().invert();
			let tested = 0;
			for (let i = -20; i <= 20; i++) for (let j = -20; j <= 20; j++) {
				const u = i / 20.5, w = j / 20.5;
				if (u * u + w * w >= 1) continue;
				const q = v3(u, w, Math.sqrt(1 - u * u - w * w)).applyMatrix4(inv);   // the world point seen there
				const t = Math.acos(q.y), p = Math.atan2(-q.z, q.x);
				const v = realPart(l, m, t, p);
				// how far the point is from the nearest zero, in points: the size over the slope, roughly
				const e = 1e-4, slope = Math.hypot(realPart(l, m, t + e, p) - v, (realPart(l, m, t, p + e) - v) / Math.max(1e-6, Math.sin(t))) / e;
				if (Math.abs(v) / Math.max(slope, 1e-12) * R < 0.1) continue;
				const pt = svg.createSVGPoint();
				pt.x = cx + R * u; pt.y = cy - R * w;
				check(path.isPointInFill(pt) === v < 0, `Y_${l}${m} is drawn ${v < 0 ? 'orange' : 'blue'} where it is ${v < 0 ? 'negative' : 'positive'}`);
				tested++;
			}
			svg.remove();
			check(tested > 1000, `Y_${l}${m}: too few points tested`);
		}
		// the lit spheres: orange whole, blue over it cut to the negative cells
		const id = `${name}-${l}-${m < 0 ? 'n' + k : m}`;
		const lit = (color, tag) => {
			const P = new Panel({ x: 0, y: 0, w: 0, h: 0, scale: 1 });
			P.sphere(v3(cx, -cy, 0), R, color, LOOK);
			const r = P.render(`${id}-${tag}`);
			defs += r.defs;
			return r.body;
		};
		S.raw(lit(ACCENT, 'pos'), 1);
		if (d) {
			defs += `<clipPath id="${id}-neg"><path clip-rule="evenodd" d="${d}"/></clipPath>`;
			S.raw(`<g clip-path="url(#${id}-neg)">${lit(ACCENT2, 'neg')}</g>`, 2);
		}
		S.boxes.push({ box: { l: cx - R, r: cx + R, t: cy - R, b: cy + R }, what: `the sphere ${l}, ${m}` });
	}
	// the counts of negative cells, against the zeros: l - |m| circles and 2|m| half meridians make
	// (l - |m| + 1) bands of 2|m| sectors (or one), of alternating sign, so half of them are negative, rounded down
	// for m = 0 (where the north cap is positive, P_l(1) > 0)
	for (const [l, m] of list) {
		const k = Math.abs(m), cells = (l - k + 1) * Math.max(1, 2 * k);
		check(counts[`${l},${m}`] === (k ? cells / 2 : Math.floor(cells / 2)), `Y_${l}${m} has ${counts[`${l},${m}`]} negative cells`);
	}

	// ---- labels: the degree at the left of each row, the order under each column, and m under l = 3
	const labels = [];
	const GAP = 6;
	for (let l = 0; l <= TOP; l++) {
		const [x, y] = centre(l, -l);
		labels.push(await placed(`\\ell = ${l}`, x - R - GAP, y, 1, 0.5, INK));
	}
	const last = labels[TOP];
	const under = centre(TOP, 0)[1] + R + GAP;
	for (let m = -TOP; m <= TOP; m++) labels.push(await placed(m < 0 ? `-${-m}` : `${m}`, centre(TOP, m)[0], under, 0.5, 0, DIM));
	const numbers = labels[TOP + 1];
	labels.push(await placed('m', last.box.r, (numbers.box.t + numbers.box.b) / 2, 1, 0.5, DIM));

	S.checkAll(labels);
	window.tutSphHarmonics = { counts };
	return finish(S, labels, [240, 340], defs);
}
