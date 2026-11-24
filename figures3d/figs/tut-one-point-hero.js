// The tutorial, chapter 9.1 (tutorial/one-point/spin-two.md), its opening figure and the hero of Part 9 (chapter 9.4
// reuses it): the sky around one point, and the two kinds of stars on it. A clear glass sphere, the sky around one
// pixel; at its centre the pixel, a ring of twelve free stone beads with a small stone gyroscope at its centre. Outside
// the glass, the two stone masses of the paper's fig:stars. On the glass, as ink dots with a faint glow, the four
// principal null directions of the masses' reading, four separate points (Petrov type I); the two on the far side are
// seen through the glass, paler and without their glow. A plane wave passes from the upper right: its crests are drawn
// where they cut the glass, faint ellipses (solid in front, dashed behind), with a thin ink arrow outside the glass
// along its direction of travel; its four stars, touching dots, sit together on that direction, where the crests leave
// the glass. The ring lies across the wave's direction of travel and shows the wave's tide on it: a squeeze along e1
// (blue, inward) and a stretch along e2 (orange, outward), exaggerated. No text. Orange and blue only on the ring.
// Departures from the diagram's comment: the crests are drawn only where they cut the glass, as faint slices of the
// sphere, so that they read as planes in depth and keep clear of the masses; a short thin ink arrow outside the glass at
// the upper right gives the wave's sense of travel, which parallel crests alone do not; the ring is drawn with its
// deformed outline, as every ring of free beads in the tutorial is.
// Exact: the masses' four stars, the roots of the paper's eq:stars (m(z)^T W m(z) = 0, figs/tut-spin-lib.js) for the sum
// of the two masses' tides, at fig:stars's places and masses (asserted equal to reference/results/figures/stars.json
// and of type I, 1 - 6 J^2/I^3 = 0.55, in figs/tut-spin-two-lib.js); the wave's four stars, the roots for its reading
// 2(E+ - i Ex) m m^T, all four on its direction of travel (asserted); every star where its direction meets the glass;
// the masses at fig:stars's places (seen from a turned view, a rotation, so that the stars turn with them); the crests'
// slices, exact circles of the sphere across the direction of travel; the ring's beads at (1 - eps E) xi for the wave's
// tide E across its direction of travel, its arrows -E xi at the beads on E's eigen-axes (asserted). Schematic: the
// view, the sizes of the glass, the masses (their radii in the ratio of the cube roots of their masses), the ring, the
// beads and the gyroscope, the crests' spacing, eps, the arrows' scale and the glow. Pictorial: the stone, the picture
// of the paper's figures (design/prompts/hair-sprites.json, cut out by design/hair_sprites.py, ball-face.png), lit as a
// sphere by the studio of lib.js, as tut-lorentz-hero; the glass's tint, its opacity and its sheen. Style references,
// not marks: design/candidates/tut-one-point-hero/ (two runs).
import { Sheet, ORIGIN, finish, checker, n2 } from './tut-pot-lib.js';
import { sprite, INK, DIM, RULE, ACCENT, ACCENT2 } from '../lib.js';
import { SPRITES, MARGIN } from '../stone.js';
import { STONE_INK } from './tut-orb-lib.js';
import { STAR_STEP, quartic, peval, nOf } from './tut-spin-lib.js';
import { chapter, PAIR, frame, nullOf, waveReading, massReading, stars, clusters, cross, unit, dot, len, near } from './tut-spin-two-lib.js';

const name = 'tut-one-point-hero';
const check = checker(name);

// ---- the view: right-handed camera axes (right, up, toward the reader) in fig:stars's world axes -----------------------
const TILT = 15;                          // degrees: the view turned this far out of the plane of the two masses
const ROLL = -8;                          // degrees: the page turned about the line of sight
const SCALE = 92;                         // points per unit: the glass has radius one
// ---- the scene, world units -------------------------------------------------------------------------------------------
const MASS_R = 0.3;                       // the larger mass's radius; the smaller's by the cube root of the masses' ratio
const K_CAM = [-0.6787, -0.4752, 0.56];       // the wave's direction of travel in the camera's axes (x right, y up, z toward
                                          // the reader): from the upper right toward the lower left, and toward the reader
const CRESTS = [-0.84, 0, 0.84];         // the crests: k . x = d, d along the direction of travel, evenly spaced, the
                                          // ring in the middle one; placed so that none passes over a star or the ring
const RING = 0.3, EPS = 0.2;             // the ring's radius, and the tide's exaggeration
const BEAD = 0.032;                       // a bead's radius
const REACH = 0.09;                      // an arrow's length per unit of |E xi|
const GYRO = { r: 0.058, thick: 0.02, axle: 0.12, tilt: 22 };   // the gyroscope: disc radius, thickness, half axle,
                                          // its axle tilted toward the reader from the page's up, degrees
// ---- the marks, points ------------------------------------------------------------------------------------------------
const OUTLINE = 0.45;                     // the glass's outline
const CREST_W = 0.45, CREST_DASH = [1.2, 1.6], CREST_FRONT = 1, CREST_BACK = 0.7;   // the slices: stroke, opacity
const STAR = 1.55, STAR_EDGE = 0.4, GLOW = 5.2, GLOW_A = 0.28, BACK_A = 0.45;   // a star's dot, its rim, its glow
const RING_W = 0.4;                       // the ring's outline
const PUSH = 0.55, PUSH_HEAD = 3, TAIL = 0.9;   // the ring's arrows: stroke, head, air between bead and tail
const AXLE_W = 0.55;
const TRAVEL = [1.32, 1.82], TRAVEL_W = 0.5, TRAVEL_HEAD = 3.6;   // the arrow of travel, from -1.82 k to -1.32 k
// ---- the glass ----------------------------------------------------------------------------------------------------------
const K = 4, SS = 3;                      // pixels per point, samples per pixel along each side
const GLASS = { tint: '#8b877d', a0: 0.035, a1: 0.34 };
const FAR = 0.6;                          // the far surface's opacity, as a share of the near one's
const SHEEN = 0.55, SHINE = 60;

const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
const KEY = unit([-0.55, 0.72, 0.62]), FILL = unit([0.85, -0.15, 0.5]);
const HALF = unit([KEY[0], KEY[1], KEY[2] + 1]);
const rad = (d) => (d * Math.PI) / 180;

export default async function () {
	const nums = await chapter(check);
	const S = new Sheet(name);
	let defs = '';

	// ---- the camera: the line of sight across the plane of the two masses, turned TILT about the line to the first,
	// the first mass to the left, and the page rolled by ROLL
	const [p1, p2] = PAIR.places;
	const n0 = unit(cross(p1, p2)), u1 = unit(p1);
	const D = unit(n0.map((v, i) => v * Math.cos(rad(TILT)) + cross(u1, n0)[i] * Math.sin(rad(TILT))));
	const left = unit(p1.map((v, i) => v - dot(p1, D) * D[i]));
	let Rv = left.map((v) => -v), Uv = cross(D, Rv);
	[Rv, Uv] = [Rv.map((v, i) => v * Math.cos(rad(ROLL)) + Uv[i] * Math.sin(rad(ROLL))), Uv.map((v, i) => -Rv[i] * Math.sin(rad(ROLL)) + v * Math.cos(rad(ROLL)))];
	const Dv = D;
	check(near(dot(cross(Rv, Uv), Dv), 1, 1e-12) && near(dot(Rv, Uv), 0, 1e-12), 'the camera\'s axes are not right-handed');
	const cam = (p) => [dot(p, Rv), dot(p, Uv), dot(p, Dv)];
	const world = (c) => [0, 1, 2].map((i) => c[0] * Rv[i] + c[1] * Uv[i] + c[2] * Dv[i]);
	const P = (p) => { const c = cam(p); return [ORIGIN + SCALE * c[0], ORIGIN - SCALE * c[1]]; };
	const depth = (p) => cam(p)[2];

	// ---- the physics: the masses' stars, the wave's stars and its tide
	const pairStars = nums.pair.stars;
	check(pairStars.length === 4 && pairStars.every((s) => s.count === 1), 'the masses\' stars are not four separate points');
	const W2 = massReading(PAIR.masses, PAIR.places);
	const again = clusters(stars(W2));
	check(again.every((s) => pairStars.some((q) => len(q.n.map((v, i) => v - s.n[i])) < 1e-9)), 'the masses\' stars changed');
	const k = unit(world(K_CAM));
	// e1 and e2 across k at 45 degrees to the line across k that lies in the page, so that the squeeze and the stretch
	// are foreshortened alike
	const across = unit(cross(k, Dv)), f = frame(k, across.map((v, i) => v + cross(k, across)[i]));
	const wave = waveReading(f, 1, 0);
	// the quartic of eq:stars for the wave has a fourfold root at k's stereographic place z_k, n(z_k) = k: it and its
	// first three derivatives vanish there (exactly, to rounding); the numerical roots, which a fourfold root leaves
	// spread by about the fourth root of rounding, all lie within 1e-3 of k
	{
		const q = quartic(wave.W), zk = [k[0] / (1 + k[2]), k[1] / (1 + k[2])];
		check(len(nOf(zk).map((v, i) => v - k[i])) < 1e-12, 'z_k is not k\'s place');
		const big = Math.max(...q.map((a) => Math.hypot(...a)));
		let poly = q;
		for (let order = 0; order < 4; order++) {
			check(Math.hypot(...peval(poly, zk)) < 1e-12 * big, `the wave's quartic's derivative ${order} does not vanish at k`);
			poly = poly.slice(1).map((a, j) => [a[0] * (j + 1), a[1] * (j + 1)]);
		}
		check(stars(wave.W).every((st) => len(st.n.map((v, i) => v - k[i])) < 1e-3), 'a root of the wave\'s quartic is off its direction of travel');
	}
	check(depth(k) > 0.5, 'the wave\'s stars are not on the near side');
	// the tide across k: E = e1 e1^T - e2 e2^T, a squeeze along e1 (positive) and a stretch along e2
	const E = wave.E, Ev = (v) => E.map((r) => dot(r, v));
	check(near(dot(Ev(f.e1), f.e1), 1, 1e-12) && near(dot(Ev(f.e2), f.e2), -1, 1e-12) && near(dot(Ev(k), k), 0, 1e-12), 'the tide is not the plus pattern across k');
	check(near(dot(nullOf(f).map((z) => z[0]), f.e1), 1 / Math.SQRT2, 1e-12), 'm is not (e1 + i e2)/sqrt 2');

	// ---- the masses: outside the glass, clear of its outline on the page
	const massR = [MASS_R, MASS_R * Math.cbrt(PAIR.masses[1] / PAIR.masses[0])];
	PAIR.places.forEach((p, a) => {
		check(len(p) - massR[a] > 1.15, `mass ${a} reaches the glass`);
		const c = cam(p);
		check(Math.hypot(c[0], c[1]) - massR[a] > 1.12, `mass ${a} overlaps the glass on the page`);
	});
	check(cam(p1)[0] < -1.3, 'the larger mass is not on the left');

	// ---- the occluders inside: beads and the gyroscope; the glass's two surfaces are rastered apart
	const face = await sprite(SPRITES + 'ball-face.png');
	const ball = await litBall(face, 160);
	const bigBall = await litBall(face, 480);
	defs += `<image id="${name}-bead" class="art" href="${ball}" x="-1" y="-1" width="2" height="2" preserveAspectRatio="none"/>`;
	defs += `<image id="${name}-mass" class="art" href="${bigBall}" x="-1" y="-1" width="2" height="2" preserveAspectRatio="none"/>`;
	let clip = 0;
	const stone = (p, r, id, layer) => {
		const [X, Y] = P(p), s = r * SCALE, c = `${name}-c${clip++}`;
		defs += `<clipPath id="${c}"><circle cx="${n2(X)}" cy="${n2(Y)}" r="${n2(s)}"/></clipPath>`;
		S.raw(`<g clip-path="url(#${c})"><use href="#${name}-${id}" transform="translate(${n2(X)},${n2(Y)}) scale(${n2(s)})"/></g><circle cx="${n2(X)}" cy="${n2(Y)}" r="${n2(s)}" fill="none" stroke="${STONE_INK}" stroke-width="${id === 'mass' ? 0.4 : 0.25}"/>`, layer);
		S.mark([[X, Y]], s, `${id} at ${p.map((v) => v.toFixed(2))}`);
	};
	PAIR.places.forEach((p, a) => stone(p, massR[a], 'mass', 1));

	// ---- the glass: the far surface under the pixel, the near one over it
	const O = [ORIGIN, ORIGIN];
	const tint = rgb(GLASS.tint);
	const shade = (m, near) => {
		const cos = Math.min(1, Math.abs(m[2]));
		const lit = 0.55 + 0.45 * Math.max(0, (dot(m, KEY) + 0.3) / 1.3) + 0.1 * Math.max(0, dot(m, FILL));
		// the highlight only on the near surface; the far one is the fainter, seen through the near
		const sheen = near ? SHEEN * Math.max(0, dot(m, HALF)) ** SHINE : 0;
		const a = (near ? 1 : FAR) * (GLASS.a0 + (GLASS.a1 - GLASS.a0) * (1 - cos) ** 3) + sheen * 0.5;
		return { a: Math.min(1, a), c: tint.map((v) => Math.min(1, v * lit + sheen)) };
	};
	const raster = (near) => {
		const half = SCALE + 1, w = Math.ceil(2 * half * K);
		const canvas = document.createElement('canvas');
		canvas.width = w; canvas.height = w;
		const ctx = canvas.getContext('2d'), img = ctx.createImageData(w, w);
		for (let j = 0; j < w; j++) for (let i = 0; i < w; i++) {
			let A = 0; const C = [0, 0, 0];
			for (let u = 0; u < SS; u++) for (let v = 0; v < SS; v++) {
				const x = (-half + (i + (u + 0.5) / SS) / K) / SCALE, y = (half - (j + (v + 0.5) / SS) / K) / SCALE;
				const rr = x * x + y * y;
				if (rr >= 1) continue;
				const z = Math.sqrt(1 - rr);
				// the surface's normal toward the reader: the near surface's outward normal, the far one's inward
				const m = near ? [x, y, z] : [-x, -y, z];
				const { a, c } = shade(m, near);
				A += a; for (let q = 0; q < 3; q++) C[q] += a * c[q];
			}
			const n = SS * SS, q = (j * w + i) * 4;
			if (A <= 0) continue;
			for (let t = 0; t < 3; t++) img.data[q + t] = Math.round(255 * Math.min(1, C[t] / A));
			img.data[q + 3] = Math.round((255 * A) / n);
		}
		ctx.putImageData(img, 0, 0);
		return `<image class="art" href="${canvas.toDataURL('image/png')}" x="${n2(O[0] - half)}" y="${n2(O[1] - half)}" width="${n2(2 * half)}" height="${n2(2 * half)}" preserveAspectRatio="none"/>`;
	};
	S.raw(raster(false), 2);
	S.raw(raster(true), 6);
	S.raw(`<circle cx="${O[0]}" cy="${O[1]}" r="${SCALE}" fill="none" stroke="${DIM}" stroke-width="${OUTLINE}"/>`, 6.5);
	S.mark(Array.from({ length: 721 }, (_, i) => [O[0] + SCALE * Math.cos(rad(i / 2)), O[1] + SCALE * Math.sin(rad(i / 2))]), OUTLINE / 2, 'the glass\'s outline');

	// ---- the crests: circles of the glass across k, solid where they face the reader, dashed behind
	const slices = [];
	for (const d of CRESTS) {
		const r = Math.sqrt(1 - d * d), pts = [];
		for (let i = 0; i <= 1440; i++) {
			const t = rad(i / 4), p = [0, 1, 2].map((q) => d * k[q] + r * (Math.cos(t) * f.e1[q] + Math.sin(t) * f.e2[q]));
			check(near(len(p), 1, 1e-12) && near(dot(p, k), d, 1e-12), 'a crest\'s slice is off the glass or off its plane');
			pts.push(p);
		}
		let run = [], front = null;
		const flush = () => {
			if (run.length < 2) return;
			const q = run.map(P), path = `M${q.map(([x, y]) => `${n2(x)},${n2(y)}`).join('L')}`;
			if (front) S.raw(`<path d="${path}" fill="none" stroke="${RULE}" stroke-width="${CREST_W}" stroke-opacity="${CREST_FRONT}"/>`, 7);
			else S.raw(`<path d="${path}" fill="none" stroke="${RULE}" stroke-width="${CREST_W}" stroke-opacity="${CREST_BACK}" stroke-dasharray="${CREST_DASH.join(' ')}"/>`, 2.5);
			S.mark(q, CREST_W / 2, `the crest ${d}${front ? '' : ' behind'}`);
			slices.push({ d, front, q });
		};
		for (const p of pts) {
			const fr = depth(p) >= 0;
			if (front !== null && fr !== front) { run.push(p); flush(); run = [p]; } else run.push(p);
			front = fr;
		}
		flush();
	}

	// ---- the arrow of travel, outside the glass at the upper right, along k toward the glass
	{
		const a = P(k.map((v) => -TRAVEL[1] * v)), b = P(k.map((v) => -TRAVEL[0] * v));
		const t = S.arrow(a, b, { color: INK, width: TRAVEL_W, head: TRAVEL_HEAD, layer: 8, what: 'the arrow of travel' });
		check(Math.hypot(b[0] - O[0], b[1] - O[1]) > SCALE + 5, 'the arrow of travel reaches the glass on the page');
		check(t.u[0] < 0 && t.u[1] > 0, 'the wave does not travel from the upper right toward the lower left');
	}

	// ---- the pixel: the ring across k under the wave's tide, its beads behind the gyroscope and before it
	const beads = [];
	for (let j = 0; j < 12; j++) {
		const t = rad(30 * j), xi = [0, 1, 2].map((q) => Math.cos(t) * f.e1[q] + Math.sin(t) * f.e2[q]);
		const Exi = Ev(xi), p = xi.map((v, q) => RING * (v - EPS * Exi[q]));
		beads.push({ j, xi, p, push: Exi.map((v) => -v) });
	}
	const outline = Array.from({ length: 721 }, (_, i) => {
		const t = rad(i / 2), xi = [0, 1, 2].map((q) => Math.cos(t) * f.e1[q] + Math.sin(t) * f.e2[q]), Exi = Ev(xi);
		return xi.map((v, q) => RING * (v - EPS * Exi[q]));
	});
	// the outline in two parts, behind the gyroscope's centre and before it
	for (const back of [true, false]) {
		let run = [];
		const flush = () => { if (run.length > 1) S.path(run.map(P), { color: INK, width: RING_W, layer: back ? 3 : 5, what: 'the ring' }); run = []; };
		for (const p of outline) { if ((depth(p) < 0) === back) run.push(p); else flush(); }
		flush();
	}
	for (const b of beads) stone(b.p, BEAD, 'bead', depth(b.p) < 0 ? 3.2 : 5.2);
	// the arrows: -E xi at the beads on E's eigen-axes (e1 and e2), drawn at one scale
	let arrows = 0;
	for (const b of beads) {
		const on = [f.e1, f.e2].find((e) => near(Math.abs(dot(e, b.xi)), 1, 1e-12));
		if (!on) continue;
		const l = dot(b.push, b.xi);
		const stretch = l > 0;
		check(near(Math.abs(l), 1, 1e-12) && len(b.push.map((v, q) => v - l * b.xi[q])) < 1e-12, 'a push is not along its bead\'s axis');
		check(stretch === (on === f.e2), 'the stretch is not along e2');
		const u = b.xi.map((v) => v * Math.sign(l));
		const A = P(b.p.map((v, q) => v + u[q] * (BEAD + TAIL / SCALE))), B = P(b.p.map((v, q) => v + u[q] * (BEAD + TAIL / SCALE + REACH * Math.abs(l))));
		S.arrow(A, B, { color: stretch ? ACCENT : ACCENT2, width: PUSH, head: PUSH_HEAD, layer: depth(b.p) < 0 ? 3.3 : 5.3, what: `the ${stretch ? 'stretch' : 'squeeze'} at bead ${b.j}` });
		arrows++;
	}
	check(arrows === 4, 'the ring does not carry four arrows');

	// ---- the gyroscope: a stone disc on an axle, at the centre
	{
		const ax = unit(Uv.map((v, i) => v * Math.cos(rad(GYRO.tilt)) + Dv[i] * Math.sin(rad(GYRO.tilt))));
		const a1 = unit(cross(ax, Dv)), a2 = cross(ax, a1);           // the disc's plane
		const rim = (h) => Array.from({ length: 181 }, (_, i) => { const t = rad(2 * i); return [0, 1, 2].map((q) => h * ax[q] + GYRO.r * (Math.cos(t) * a1[q] + Math.sin(t) * a2[q])); });
		const top = rim(GYRO.thick / 2), bot = rim(-GYRO.thick / 2);
		const d = (pts) => `M${pts.map(P).map(([x, y]) => `${n2(x)},${n2(y)}`).join('L')}Z`;
		// the axle below the disc, the disc's side (the band between the rims), its top face, the axle above
		const foot = P(ax.map((v) => -GYRO.axle * v)), head = P(ax.map((v) => GYRO.axle * v));
		S.raw(`<path d="M${n2(foot[0])},${n2(foot[1])}L${n2(P([0, 0, 0])[0])},${n2(P([0, 0, 0])[1])}" stroke="${INK}" stroke-width="${AXLE_W}" stroke-linecap="round"/>`, 4);
		const c = `${name}-gyro`;
		const band = `${d(bot)}`;
		defs += `<clipPath id="${c}-side"><path d="${band}"/></clipPath><clipPath id="${c}-top"><path d="${d(top)}"/></clipPath>`;
		const [X, Y] = P([0, 0, 0]), s = GYRO.r * SCALE * 1.05;
		S.raw(`<g clip-path="url(#${c}-side)"><use href="#${name}-mass" transform="translate(${n2(X)},${n2(Y + 1)}) scale(${n2(s)})" opacity="0.8"/></g><path d="${band}" fill="none" stroke="${STONE_INK}" stroke-width="0.25"/>`, 4.2);
		S.raw(`<g clip-path="url(#${c}-top)"><use href="#${name}-mass" transform="translate(${n2(X)},${n2(Y)}) scale(${n2(s)})"/></g><path d="${d(top)}" fill="none" stroke="${STONE_INK}" stroke-width="0.25"/>`, 4.3);
		S.raw(`<path d="M${n2(P(ax.map((v) => (GYRO.thick / 2) * v))[0])},${n2(P(ax.map((v) => (GYRO.thick / 2) * v))[1])}L${n2(head[0])},${n2(head[1])}" stroke="${INK}" stroke-width="${AXLE_W}" stroke-linecap="round"/>`, 4.4);
		S.mark([foot, head], AXLE_W / 2, 'the axle');
		S.mark([...top, ...bot].map(P), 0.2, 'the gyroscope');
		// and on the page every arrow's head stands clear of the disc and the axle
		const disc = [...top, ...bot].map(P);
		for (const a of S.arrows) {
			if (!a.what.includes('at bead')) continue;
			const m = S.marks.find((q) => q.what === `${a.what}'s head`);
			const least = Math.min(...m.pts.flatMap((p) => [...disc.map((q) => Math.hypot(p[0] - q[0], p[1] - q[1])), Math.hypot(p[0] - foot[0], p[1] - foot[1]) - AXLE_W / 2]));
			check(least >= 1.5, `${a.what} is ${least.toFixed(2)} pt from the gyroscope`);
		}
		// the gyroscope stays inside the ring, clear of the squeeze arrows
		check(GYRO.r + 0.02 < RING * (1 - EPS) - BEAD - TAIL / SCALE - REACH, 'the gyroscope reaches the squeeze arrows');
	}

	// ---- the stars on the glass: the masses' four, single; the wave's four, touching
	const glow = `${name}-glow`;
	defs += `<radialGradient id="${glow}"><stop offset="0" stop-color="${INK}" stop-opacity="${GLOW_A}"/><stop offset="0.45" stop-color="${INK}" stop-opacity="${GLOW_A * 0.35}"/><stop offset="1" stop-color="${INK}" stop-opacity="0"/></radialGradient>`;
	const dotAt = ([x, y], back, what) => {
		if (back) S.raw(`<circle cx="${n2(x)}" cy="${n2(y)}" r="${STAR}" fill="${INK}" fill-opacity="${BACK_A}"/>`, 2.8);
		else S.raw(`<circle cx="${n2(x)}" cy="${n2(y)}" r="${STAR}" fill="${INK}" stroke="#fffffe" stroke-width="${STAR_EDGE}"/>`, 9.2);
		S.mark([[x, y]], STAR + STAR_EDGE / 2, what);
	};
	const glowAt = ([x, y], r) => S.raw(`<circle cx="${n2(x)}" cy="${n2(y)}" r="${n2(r)}" fill="url(#${glow})"/>`, 9);
	const placedStars = [];
	for (const s of pairStars) {
		check(near(len(s.n), 1, 1e-9), 'a star is off the glass');
		const back = depth(s.n) < 0, q = P(s.n);
		if (!back) glowAt(q, GLOW);
		dotAt(q, back, `the masses' star at ${s.n.map((v) => v.toFixed(2))}`);
		placedStars.push({ q, back, r: STAR + STAR_EDGE / 2, what: 'a star of the masses' });
	}
	{
		const q = P(k), o = STAR * STAR_STEP;
		glowAt(q, GLOW + o);
		for (const [dx, dy] of [[-o, -o], [o, -o], [-o, o], [o, o]]) dotAt([q[0] + dx, q[1] + dy], false, 'a star of the wave');
		placedStars.push({ q, back: false, r: o * Math.SQRT2 + STAR + STAR_EDGE / 2, what: 'the wave\'s stars' });
	}
	// every star stands clear of the crests, the ring, the masses, the arrows and the outline, and of the other stars
	for (const st of placedStars) {
		const skip = (w) => (st.what === 'the wave\'s stars' ? w === 'a star of the wave' : w.startsWith('the masses\' star at'));
		let least = Infinity, what = '';
		for (const m of S.marks) {
			if (skip(m.what)) continue;
			if (st.back && m.what === 'the glass\'s outline') continue;
			for (let i = 0; i < m.pts.length; i++) {
				const a = m.pts[i], b = m.pts[Math.min(i + 1, m.pts.length - 1)];
				const dd = [b[0] - a[0], b[1] - a[1]], l2 = dd[0] ** 2 + dd[1] ** 2;
				const t = l2 ? Math.max(0, Math.min(1, ((st.q[0] - a[0]) * dd[0] + (st.q[1] - a[1]) * dd[1]) / l2)) : 0;
				const dist = Math.hypot(st.q[0] - a[0] - t * dd[0], st.q[1] - a[1] - t * dd[1]) - m.r - st.r;
				if (dist < least) { least = dist; what = m.what; }
			}
		}
		check(least >= 1.2, `${st.what} at ${st.q.map((v) => v.toFixed(1))} is ${least.toFixed(2)} pt from ${what}`);
	}

	S.checkAll([]);
	window[name + '-numbers'] = { pair: pairStars.map((s) => s.n), k, speciality: nums.pair.speciality, camera: { Rv, Uv, Dv } };
	return finish(S, [], [240, 340], defs);
}

/** A stone ball lit by the studio (tut-lorentz-hero's litBall, with its size as a parameter): the picture `face` (its
 * exact circle inside MARGIN pixels of canvas) as the albedo, seen face on; a JPEG of N pixels across. */
async function litBall(face, N) {
	const img = new Image(); img.src = face.href; await img.decode();
	const src = document.createElement('canvas');
	src.width = face.w; src.height = face.h;
	const sctx = src.getContext('2d'); sctx.drawImage(img, 0, 0);
	const tex = sctx.getImageData(0, 0, face.w, face.h).data;
	const c = document.createElement('canvas'); c.width = N; c.height = N;
	const ctx = c.getContext('2d'), out = ctx.createImageData(N, N);
	const r0 = (face.w - 2 * MARGIN) / 2, cx = face.w / 2, cy = face.h / 2;
	for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
		// outside the circle the rim's colour, carried outward, so that the picture can be a JPEG (the page clips it)
		let x = ((i + 0.5) / N) * 2 - 1, y = 1 - ((j + 0.5) / N) * 2;
		const rr = x * x + y * y;
		if (rr > 1) { const l = Math.sqrt(rr); x /= l; y /= l; }
		const n = [x, y, Math.sqrt(Math.max(0, 1 - x * x - y * y))];
		const s = 0.97;
		const tx = Math.round(cx + s * r0 * x), ty = Math.round(cy - s * r0 * y), t = (ty * face.w + tx) * 4;
		const lit = 0.3 + 0.8 * Math.max(0, (dot(n, KEY) + 0.3) / 1.3) + 0.14 * Math.max(0, dot(n, FILL));
		const spec = 0.18 * Math.max(0, dot(n, HALF)) ** 30;
		const q = (j * N + i) * 4;
		for (let k = 0; k < 3; k++) out.data[q + k] = Math.round(255 * Math.min(1, (tex[t + k] / 255) * lit + spec));
		out.data[q + 3] = 255;
	}
	ctx.putImageData(out, 0, 0);
	return c.toDataURL('image/jpeg', 0.9);
}
