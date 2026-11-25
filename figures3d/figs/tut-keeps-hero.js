// The tutorial's Part 13, "What a field keeps", its hero (it opens chapter 13.1, tutorial/what-a-field-keeps/
// push-and-pass.md, and is the picture of chapter 13.3, ladder.md): the paper's fig:ladder's two bodies, side by side
// and cut open, under one brief octupolar tide. Left, body A: a thin shell of mass M and radius R/sqrt 2. Right, body
// B: half of M at its centre (a small iron ball) and half on a thin shell of radius R. Both have the mass M and
// int rho r^2 dV = M R^2 / 2, so the field keeps them alike outside R (the dashed circle round A). Each is cut at its
// equator and its upper half taken away, so that its skin is seen in section as a ring and the inside of its lower
// half as a bowl. Seen from above the equators, at ELEV degrees. Round each body, in the plane of its equator, the
// tide's sign: pale orange where it pushes outward, pale blue where inward, six lobes between the three nodal planes;
// a heavy arrow in each lobe. On each ring, the kick of each part of the skin, orange where the part moves outward and
// blue where inward. Right, two bars of matter's colour: the energy each body gains, B's twice A's. No text.
//
// Exact (asserted below against the chapter's text, against reference/results/figures/ladder.json, which fig:ladder
// draws, and by computation): the pair, mass M and int rho r^2 dV = M R^2 / 2 for both, the radii R/sqrt 2 and R, at
// one scale; the tide g = (x^3 - 3xy^2)/3 = Re (x + iy)^3 / 3 with its axis z vertical (13.3's tide; fig:ladder's
// `kick`, imported); its sign regions in the equatorial plane, bounded by the nodal planes phi = 30 + 60k degrees,
// where the tints vanish (round each circle the tint's strength is |g| / rho^3 = |cos 3 phi|, its colour g's sign);
// the heavy arrows on the lobes' middles, phi = 60k degrees (fig:ladder's `lobes`), outward where g > 0; each kick
// arrow is the impulse eps grad g = eps (x^2 - y^2, -2xy, 0) (the potential -eps g delta(t), so Delta v = -grad of
// its time integral), exact in direction and in length at one scale for both bodies (B's twice A's, |grad g| =
// rho^2), with its part of the skin at its middle, at fig:ladder's 12 places on each ring, 45/3 degrees off the
// directions in which it is radial, so that each has a clear sense and none lies along a nodal plane; its colour is
// the sign of its radial part, which is g's (Euler: x . grad g = 3g); the point at B's centre receives none
// (grad g = 0 there); the orthographic projection of every mark that lies in the equatorial plane; the bars'
// heights, in the ratio of the energies, (1/2) eps^2 int rho |grad g|^2 dV = (1/2) eps^2 (2/15) M R^4 for A and
// twice that for B, computed here by quadrature over the shells and asserted equal to the chapter's 2/15 and 4/15
// and to the reference implementation's gains, and their ratio to 2. Schematic: the view, the scale K of the kicks
// and eps, the tints' strength and their radial profile (rising from each rim over RISE R, fading out from FULL R to
// LOBE R), the heavy arrows' places and lengths, the bars' scale, width and places (in matter's colour, energy being
// matter's role, not orange, which means a stretch). Pictorial: the stone, the pictures of the paper's figures
// (design/prompts/hair-sprites.json, cut out by design/hair_sprites.py: ball-face.png as the albedo of the bowls,
// shell-face.png as the sawn ring), lit as surfaces by the studio of lib.js, with the soft shadows of the rim and of
// the iron ball inside the bowls; the thickness of the skins (stone.js's SHELL_INNER, as fig:ladder) and the size of
// the iron ball (fig:ladder's POINT). Style references, not marks: design/candidates/tut-keeps-hero/ (two runs;
// variant A, the raised view with the sign on the equatorial plane, followed, its tints soft as variant C's).
import { Sheet, ORIGIN, finish, checker, n2, near } from './tut-pot-lib.js';
import { sprite, ACCENT, ACCENT2 } from '../lib.js';
import { SPRITES, MARGIN, SHELL_INNER, IRON, HEAVY, bold } from '../stone.js';
import { STONE_INK } from './tut-orb-lib.js';
import { kick, lobes, POINT } from './ladder.js';
import { MATTER } from './tut-ladder-lib.js';
import { palette } from './tut-linear-lib.js';

const name = 'tut-keeps-hero';
const check = checker(name);

// ---- the view and the scene (units of R unless said) --------------------------------------------------------------
const ELEV = 40;                          // degrees: the eye above the equatorial plane
const S = 43;                             // points per R
const RADII = [Math.SQRT1_2, 1];          // A's shell, B's outer shell
const GAP = 3.6;                          // from A's centre to B's, on the page
const LOBE = 1.76, FULL = 1.22, RISE = 0.2;   // the tints rise over RISE from each rim and fade out from FULL to LOBE
const TINT = 0.7;                         // the tints' strongest opacity, mid-lobe
const TIDE = [1.28, 1.72];                // the heavy arrows: nearer and farther end
const K = 0.42;                           // a kick's length per unit |grad g| (R^2), in units of R
const PLACES = 12;                        // kicks on each ring
// ---- the marks, points -------------------------------------------------------------------------------------------
const RIM = 0.35;                         // the outlines on the stone
const DASH = { width: 0.4, dash: [1.1, 1.7], color: '#8a867c' };   // the circle of radius R round A: a grey that the
                                          // site does not swap, since it runs over the stone as well as the page
const BAR = { w: 6, gap: 5, from: 8, scale: 280 };   // bars: width, gap, air from B's tint, points per unit gain
// ---- the raster ----------------------------------------------------------------------------------------------------
const PX = 7, SS = 3;                     // pixels per point, samples per pixel along each side
const PENUMBRA = 0.06;                    // the width of a shadow's soft edge, in units of R

const unit = (v) => { const l = Math.hypot(...v); return v.map((x) => x / l); };
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const KEY = unit([-0.55, 0.72, 0.62]), FILL = unit([0.85, -0.15, 0.5]);
const HALF = unit([KEY[0], KEY[1], KEY[2] + 1]);
const rad = (d) => (d * Math.PI) / 180;
const g = (x, y) => (x ** 3 - 3 * x * y * y) / 3;
const smooth = (f) => { f = Math.max(0, Math.min(1, f)); return f * f * (3 - 2 * f); };

export default async function () {
	await palette(check);
	const nums = await chapter();
	const Sh = new Sheet(name);
	let defs = '';

	// ---- the camera: chapter coordinates (x, y, z), z the tide's axis, seen from (0, -cos e, sin e)
	const ce = Math.cos(rad(ELEV)), se = Math.sin(rad(ELEV));
	const centres = [[ORIGIN - (GAP * S) / 2, ORIGIN], [ORIGIN + (GAP * S) / 2, ORIGIN]];
	const P = (c, [x, y, z]) => [c[0] + S * x, c[1] - S * (y * se + z * ce)];

	// ---- the physics
	// the kick is grad g, fig:ladder's `kick` for n = 3, equal to the chapter's (x^2 - y^2, -2xy) and to g's
	// derivatives by differences; its radial part is 3g / rho
	for (let k = 0; k < 50; k++) {
		const x = Math.cos(k) * 1.3, y = Math.sin(1.7 * k) * 0.9, [vx, vy] = kick(3, x, y), h = 1e-5;
		check(near(vx, x * x - y * y, 1e-12) && near(vy, -2 * x * y, 1e-12), 'the kick is not the chapter\'s gradient');
		check(near(vx, (g(x + h, y) - g(x - h, y)) / (2 * h), 1e-8) && near(vy, (g(x, y + h) - g(x, y - h)) / (2 * h), 1e-8), 'the kick is not grad g');
		check(near(x * vx + y * vy, 3 * g(x, y), 1e-12), 'Euler\'s relation');
	}
	check(kick(3, 0, 0).every((v) => v === 0), 'the point at the centre is kicked');
	// the energies: int rho |grad g|^2 dV over each body, by quadrature over its shells (|grad g|^2 has no z)
	const shellMean = (a) => {                        // the mean of |grad g|^2 over the sphere of radius a
		const N = 400; let s = 0;
		for (let i = 0; i < N; i++) {
			const ct = -1 + (2 * (i + 0.5)) / N, st = Math.sqrt(1 - ct * ct);   // even in cos(theta): midpoints
			for (let j = 0; j < 8; j++) {
				const ph = (2 * Math.PI * (j + 0.5)) / 8, [vx, vy] = kick(3, a * st * Math.cos(ph), a * st * Math.sin(ph));
				s += vx * vx + vy * vy;
			}
		}
		return s / (N * 8);
	};
	check(Math.abs(shellMean(1) - 8 / 15) < 1e-5, 'the mean of |grad g|^2 over the unit sphere is not 8/15');
	const gains = nums.bodies.map((shells) => shells.reduce((s, [m, r]) => s + m * (r ? shellMean(r) : 0), 0));
	check(Math.abs(gains[0] - 2 / 15) < 1e-5 && Math.abs(gains[1] - 4 / 15) < 1e-5, `the gains ${gains} are not 2/15 and 4/15`);
	check(near(nums.gains[0], 2 / 15, 1e-12) && near(nums.gains[1], 4 / 15, 1e-12), 'the reference\'s gains are not 2/15 and 4/15');
	check(near(nums.gains[1] / nums.gains[0], 2, 1e-12), 'B does not gain twice what A gains');

	// ---- the stone
	const faceArt = await sprite(SPRITES + 'ball-face.png'), ringArt = await sprite(SPRITES + 'shell-face.png');
	const [face, ring] = await Promise.all([pixels(faceArt), pixels(ringArt)]);
	const R0 = (faceArt.w - 2 * MARGIN) / 2;
	check(faceArt.w === ringArt.w && faceArt.h === ringArt.h, 'the sprites differ in size');
	const texel = (img, u, v) => {                    // (u, v) in units of the sprite's exact circle, v up
		const i = Math.max(0, Math.min(img.w - 1, Math.round(img.w / 2 + 0.985 * R0 * u)));
		const j = Math.max(0, Math.min(img.h - 1, Math.round(img.h / 2 - 0.985 * R0 * v)));
		const q = (j * img.w + i) * 4;
		return [img.d[q] / 255, img.d[q + 1] / 255, img.d[q + 2] / 255];
	};
	const light = (n, shade = 1, ambient = 0.3) => ambient + 0.8 * shade * Math.max(0, (dot(n, KEY) + 0.3) / 1.3) + 0.14 * Math.max(0, dot(n, FILL));
	const spec = (n, shade = 1) => 0.18 * shade * Math.max(0, dot(n, HALF)) ** 30;
	// a soft step: 0 well inside a shadow, 1 well outside it, for a signed distance d from its edge
	const step = (d) => { const f = Math.max(0, Math.min(1, 0.5 + d / PENUMBRA)); return f * f * (3 - 2 * f); };

	/** One body, its upper half taken away: a JPEG of the stone, to be clipped to the exact outline. */
	const body = (a, ball) => {
		const ai = SHELL_INNER * a, rb = POINT;
		const half = a * S + 1.5, W = Math.ceil(2 * half * PX);
		const canvas = document.createElement('canvas');
		canvas.width = W; canvas.height = W;
		const ctx = canvas.getContext('2d'), img = ctx.createImageData(W, W);
		const ringAt = (x, y) => {                        // the sawn ring, lying in the plane z = 0: normal (0, ce, se)
			const n = [0, ce, se], c = texel(ring, x / a, y / a), l = light(n);
			return c.map((v) => v * l + spec(n));
		};
		const outside = (X, Y) => {                       // the lower half from outside
			let r = Math.hypot(X, Y), t = Math.sqrt(Math.max(0, a * a - r * r));
			if (r > a) { X *= a / r; Y *= a / r; t = 0; }
			const n = [X / a, Y / a, t / a], c = texel(face, X / a, Y / a), l = light(n, 1, 0.38);
			return c.map((v) => v * l + spec(n));
		};
		const sample = (X, Y) => {
			const r2 = X * X + Y * Y;
			if (r2 <= a * a) {
				const t1 = Math.sqrt(a * a - r2);
				if (Y * ce + t1 * se <= 0) return outside(X, Y);
			}
			const tp = (-Y * ce) / se, r2p = r2 + tp * tp, y = Y / se;
			if (r2p <= a * a && r2p >= ai * ai) return ringAt(X, y);
			if (r2p < ai * ai) {
				// the inside of the bowl: the far wall, lit where the key light reaches it through the opening
				const t2 = -Math.sqrt(ai * ai - r2), p = [X, Y, t2], n = p.map((v) => -v / ai);
				// the key light reaches it if its ray leaves the bowl through the opening (the exit's height above the
				// plane, softened) and passes the iron ball (the ray's least distance from the centre, beyond rb)
				const pL = dot(p, KEY);
				let lit = 0;
				if (pL < 0) {
					const q = p.map((v, i) => v - 2 * pL * KEY[i]);
					lit = step(q[1] * ce + q[2] * se);
					if (ball) lit *= step(Math.sqrt(Math.max(0, ai * ai - pL * pL)) - rb);
				}
				const shade = lit, c = texel(face, -X / ai, Y / ai), l = 0.92 * light(n, shade, 0.4);
				return c.map((v) => v * l + spec(n, shade));
			}
			// beyond the outline (clipped away): the nearest stone, so that the picture can be a JPEG
			return Y < 0 ? outside(X, Y) : ringAt(X, Math.sign(y) * Math.min(Math.abs(y), a));
		};
		for (let j = 0; j < W; j++) for (let i = 0; i < W; i++) {
			const C = [0, 0, 0];
			for (let u = 0; u < SS; u++) for (let v = 0; v < SS; v++) {
				const X = (-half + (i + (u + 0.5) / SS) / PX) / S, Y = (half - (j + (v + 0.5) / SS) / PX) / S;
				const c = sample(X, Y);
				for (let k = 0; k < 3; k++) C[k] += Math.min(1, c[k]);
			}
			const q = (j * W + i) * 4;
			for (let k = 0; k < 3; k++) img.data[q + k] = Math.round((255 * C[k]) / (SS * SS));
			img.data[q + 3] = 255;
		}
		ctx.putImageData(img, 0, 0);
		return { href: canvas.toDataURL('image/jpeg', 0.92), half };
	};

	// ---- the two bodies
	const marksOf = (c, a) => {
		const lower = Array.from({ length: 361 }, (_, i) => { const t = Math.PI - (i * Math.PI) / 360; return [c[0] + S * a * Math.cos(t), c[1] + S * a * Math.sin(t)]; });
		const ellipse = (r) => Array.from({ length: 721 }, (_, i) => P(c, [r * Math.cos(rad(i / 2)), r * Math.sin(rad(i / 2)), 0]));
		return { lower, outer: ellipse(a), inner: ellipse(SHELL_INNER * a) };
	};
	const bodies = RADII.map((a, b) => {
		const c = centres[b], pic = body(a, b === 1), m = marksOf(c, a), ry = S * a * se;
		const clip = `${name}-body${b}`;
		// the outline: the lower half of the sphere's silhouette and the far half of the equator
		defs += `<clipPath id="${clip}"><path d="M${n2(c[0] - S * a)},${n2(c[1])}A${n2(S * a)},${n2(S * a)} 0 0 0 ${n2(c[0] + S * a)},${n2(c[1])}A${n2(S * a)},${n2(ry)} 0 0 0 ${n2(c[0] - S * a)},${n2(c[1])}Z"/></clipPath>`;
		Sh.raw(`<image class="art" href="${pic.href}" x="${n2(c[0] - pic.half)}" y="${n2(c[1] - pic.half)}" width="${n2(2 * pic.half)}" height="${n2(2 * pic.half)}" preserveAspectRatio="none" clip-path="url(#${clip})"/>`, 1);
		const e = (r) => `<ellipse cx="${n2(c[0])}" cy="${n2(c[1])}" rx="${n2(S * r)}" ry="${n2(S * r * se)}" fill="none" stroke="${STONE_INK}" stroke-width="${RIM}"/>`;
		Sh.raw(`<path d="M${n2(c[0] - S * a)},${n2(c[1])}A${n2(S * a)},${n2(S * a)} 0 0 0 ${n2(c[0] + S * a)},${n2(c[1])}" fill="none" stroke="${STONE_INK}" stroke-width="${RIM}"/>` + e(a) + e(SHELL_INNER * a), 1.5);
		Sh.mark(m.lower, RIM / 2, `body ${'AB'[b]}'s outline`);
		Sh.mark(m.outer, RIM / 2, `body ${'AB'[b]}'s rim`);
		Sh.mark(m.inner, RIM / 2, `body ${'AB'[b]}'s inner rim`);
		return { a, c, m };
	});
	// the iron ball at B's centre, half of M, kicked by nothing
	Sh.sphere(centres[1], POINT * S, IRON, { spec: 0.45, shininess: 30, layer: 4 }, 'the point at B\'s centre');

	// ---- the tide's sign round each body, in its equatorial plane: masks of |cos 3 phi| on each sign, times the profile
	const tints = (c, b) => {
		const a = RADII[b];
		const hw = LOBE * S + 1, hh = LOBE * S * se + 1, W = Math.ceil(2 * hw * 4), H = Math.ceil(2 * hh * 4);
		const out = [];
		for (const sign of [1, -1]) {
			const canvas = document.createElement('canvas');
			canvas.width = W; canvas.height = H;
			const ctx = canvas.getContext('2d'), img = ctx.createImageData(W, H);
			for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) {
				let A = 0;
				for (let u = 0; u < 2; u++) for (let v = 0; v < 2; v++) {
					const x = (-hw + (i + (u + 0.5) / 2) / 4) / S, y = (hh - (j + (v + 0.5) / 2) / 4) / (S * se);
					const r = Math.hypot(x, y);
					if (r < a || r > LOBE) continue;
					const lobe = Math.max(0, (sign * g(x, y)) / r ** 3);        // |cos 3 phi| on its own sign
					const fade = smooth((LOBE - r) / (LOBE - FULL)) * smooth((r - a) / RISE);
					A += lobe * fade;
				}
				const q = (j * W + i) * 4, w = Math.round((255 * A) / 4);
				img.data[q] = w; img.data[q + 1] = w; img.data[q + 2] = w; img.data[q + 3] = 255;
			}
			ctx.putImageData(img, 0, 0);
			const id = `${name}-tint${b}${sign > 0 ? 'o' : 'i'}`;
			defs += `<mask id="${id}" maskUnits="userSpaceOnUse" x="${n2(c[0] - hw)}" y="${n2(c[1] - hh)}" width="${n2(2 * hw)}" height="${n2(2 * hh)}"><image href="${canvas.toDataURL('image/png')}" x="${n2(c[0] - hw)}" y="${n2(c[1] - hh)}" width="${n2(2 * hw)}" height="${n2(2 * hh)}" preserveAspectRatio="none"/></mask>`;
			out.push(`<rect x="${n2(c[0] - hw)}" y="${n2(c[1] - hh)}" width="${n2(2 * hw)}" height="${n2(2 * hh)}" fill="${sign > 0 ? ACCENT : ACCENT2}" fill-opacity="${TINT}" mask="url(#${id})"/>`);
		}
		Sh.raw(out.join(''), 2);
		Sh.mark([[c[0] - LOBE * S, c[1]], [c[0] + LOBE * S, c[1]]], 0, 'a tint');
	};
	centres.forEach(tints);
	// the tints vanish on the nodal planes, phi = 30 + 60k degrees, and take g's sign between them
	for (let k = 0; k < 6; k++) {
		const t = rad(30 + 60 * k);
		check(Math.abs(g(Math.cos(t), Math.sin(t))) < 1e-12, `phi = ${30 + 60 * k} is not nodal`);
		const m = rad(60 * k);
		check(Math.sign(g(Math.cos(m), Math.sin(m))) === (k % 2 ? -1 : 1), `the lobe at ${60 * k} has the wrong sign`);
	}

	// the radius R round A, inside which A's mass lies deeper (fig:ladder's dashed circle)
	{
		const c = centres[0];
		Sh.raw(`<ellipse cx="${n2(c[0])}" cy="${n2(c[1])}" rx="${n2(S)}" ry="${n2(S * se)}" fill="none" stroke="${DASH.color}" stroke-width="${DASH.width}" stroke-dasharray="${DASH.dash.join(' ')}"/>`, 2.2);
	}

	// ---- the heavy arrows of the tide, on the lobes' middles (fig:ladder's `lobes`), outward where g > 0
	const heavies = [];
	for (const c of centres) lobes(3).forEach((t, m) => {
		const u = [Math.cos(t), Math.sin(t)];
		const out = g(u[0], u[1]) > 0;
		check(out === (m % 2 === 0), 'a heavy arrow against its lobe');
		const near_ = P(c, [TIDE[0] * u[0], TIDE[0] * u[1], 0]), far = P(c, [TIDE[1] * u[0], TIDE[1] * u[1], 0]);
		const [A, B] = out ? [near_, far] : [far, near_];
		const L = Math.hypot(B[0] - A[0], B[1] - A[1]);
		check(HEAVY.head <= 0.4 * L, 'a heavy arrow too short for its head');
		const make = HEAVY, head = HEAVY.head;
		Sh.raw(bold('tide', A, B, out ? ACCENT : ACCENT2, make).arrow, 3);
		Sh.mark([A, B], HEAVY.spread / 2, `the tide at ${Math.round((t * 180) / Math.PI)}`);
		heavies.push({ A, B, w: HEAVY.spread / 2 });
		Sh.arrows.push({ L, head, what: 'a heavy arrow' });
	});

	// ---- the kicks on each ring: grad g at the middle of the skin, one scale for both bodies
	const kicks = [];
	bodies.forEach(({ a, c }, b) => {
		const mid = ((1 + SHELL_INNER) / 2) * a;
		for (let k = 0; k < PLACES; k++) {
			const t = rad(15 + (360 / PLACES) * k), px = mid * Math.cos(t), py = mid * Math.sin(t);
			const [vx, vy] = kick(3, px, py), size = Math.hypot(vx, vy);
			const outward = (px * vx + py * vy) / (mid * size);   // cos 3t
			check(Math.abs(outward) > 0.7, `a kick with no clear sense at ${t}`);
			check(Math.sign(outward) === Math.sign(g(px, py)), 'a kick\'s sense is not g\'s sign');
			const A = P(c, [px - (K / 2) * vx, py - (K / 2) * vy, 0]), B = P(c, [px + (K / 2) * vx, py + (K / 2) * vy, 0]);
			const L = Math.hypot(B[0] - A[0], B[1] - A[1]);
			const make = slender(L);
			Sh.raw(bold('kick', A, B, outward > 0 ? ACCENT : ACCENT2, make).arrow, 3.5);
			Sh.arrows.push({ L, head: make.head, what: `a kick on ${'AB'[b]}` });
			kicks.push({ b, A, B, w: make.spread / 2 });
		}
	});
	// no two kicks touch on the page
	for (let i = 0; i < kicks.length; i++) for (let j = i + 1; j < kicks.length; j++) {
		if (kicks[i].b !== kicks[j].b) continue;
		const d = segDist(kicks[i].A, kicks[i].B, kicks[j].A, kicks[j].B) - kicks[i].w - kicks[j].w;
		check(d > 0.4, `two kicks on ${'AB'[kicks[i].b]} are ${d.toFixed(2)} pt apart`);
	}
	// and every kick stands clear of every heavy arrow
	for (const k of kicks) for (const h of heavies) {
		const d = segDist(k.A, k.B, h.A, h.B) - k.w - h.w;
		check(d > 2, `a kick on ${'AB'[k.b]} is ${d.toFixed(2)} pt from a heavy arrow`);
	}
	// B's kicks are twice A's at the same angle: |grad g| = rho^2
	check(near(((1 + SHELL_INNER) / 2) ** 2 * (RADII[1] ** 2 / RADII[0] ** 2), ((1 + SHELL_INNER) / 2) ** 2 * 2, 1e-12), 'the kicks\' ratio');

	// ---- the bars: the energies, B's twice A's, on one baseline, right of B's tint
	{
		const base = centres[1][1] + S * RADII[1];
		let x = centres[1][0] + LOBE * S + BAR.from;
		const hs = nums.gains.map((v) => v * BAR.scale);
		check(near(hs[1] / hs[0], 2, 1e-12), 'the bars are not in the ratio two');
		hs.forEach((h, b) => {
			Sh.raw(`<rect data-bar="${'AB'[b]}" x="${n2(x)}" y="${n2(base - h)}" width="${BAR.w}" height="${n2(h)}" fill="${MATTER}"/>`, 2);
			Sh.mark([[x, base - h], [x + BAR.w, base]], 0, `bar ${'AB'[b]}`);
			x += BAR.w + BAR.gap;
		});
	}

	Sh.checkAll([]);
	window[name + '-numbers'] = { gains, ratio: gains[1] / gains[0], elev: ELEV };
	return finish(Sh, [], [300, 345], defs);
}

/** The pair, the tide and the energies, as the chapter states them and the reference implementation computes them. */
async function chapter() {
	const md = await (await fetch('/tutorial/what-a-field-keeps/ladder.md')).text();
	const flat = md.replace(/<!--[\s\S]*?-->/g, ' ').replace(/\s+/g, ' ');
	const r = String.raw;
	const has = (s, what) => check(flat.includes(s.replace(/\s+/g, ' ')), `the chapter does not say ${what}: ${s}`);
	has(r`Body A is a thin shell of mass $\matter M$ and radius $R/\sqrt2$. Body B holds half of that mass at its centre and
		half on a thin shell of radius $R$.`, 'the pair');
	has(r`The opening's bodies both have $\int\matter\rho\,r^2\,\dd V = \tfrac12\matter MR^2$`, 'the second moments');
	has(r`The octupolar tide $g = \tfrac13(x^3 - 3xy^2)$ is the real part of $\tfrac13(x + iy)^3$. Its gradient is
		$(x^2 - y^2,\,-2xy,\,0)$`, 'the tide and its gradient');
	has(r`\int\matter\rho_{\rm A}\,|\nabla g|^2\,\dd V &= \tfrac{2}{15}\matter MR^4,\\`, 'A\'s weight');
	has(r`\int\matter\rho_{\rm B}\,|\nabla g|^2\,\dd V &= \tfrac{4}{15}\matter MR^4 .`, 'B\'s weight');
	has(r`B gains twice as much`, 'the ratio');
	has(r`gives each at rest $\tfrac12\epsilon^2$ times that`, 'the energy');
	has(r`A brief octupolar tide, the lopsided part that a nearer mass adds, leaves twice as much in B.`, 'the opening');
	const d = await (await fetch('/reference/results/figures/ladder.json')).json();
	const [a, b] = d.bodies;
	check(a.length === 1 && a[0][0] === 1 && near(a[0][1] ** 2, 0.5, 1e-15), 'body A is not M at R / sqrt 2');
	check(b.length === 2 && b[0][0] === 0.5 && b[0][1] === 0 && b[1][0] === 0.5 && b[1][1] === 1, 'body B is not M/2 at the centre and M/2 at R');
	check(near(RADII[0], a[0][1], 1e-15) && RADII[1] === b[1][1], 'the radii drawn are not the bodies\'');
	for (const s of d.bodies) {
		check(near(s.reduce((t, [m]) => t + m, 0), 1, 1e-15), 'a body\'s mass is not M');
		check(near(s.reduce((t, [m, q]) => t + m * q * q, 0), 0.5, 1e-15), 'a body\'s int rho r^2 is not M R^2 / 2');
	}
	const tide = d.tides.find((t) => t.degree === 3);
	return { bodies: d.bodies, gains: tide.gain };
}

/** A sprite's pixels. */
async function pixels(s) {
	const img = new Image(); img.src = s.href; await img.decode();
	const c = document.createElement('canvas'); c.width = s.w; c.height = s.h;
	const ctx = c.getContext('2d'); ctx.drawImage(img, 0, 0);
	return { w: s.w, h: s.h, d: ctx.getImageData(0, 0, s.w, s.h).data };
}

/** The make of a kick arrow L points long (fig:ladder's `slender`): a head of at most two fifths of the arrow. */
function slender(L) {
	const width = 0.9 * Math.min(1, L / 6.5) ** 0.4;
	const head = Math.min(3.8, 0.4 * L);
	return { width, head, spread: 0.78 * head + 0.5 * width };
}

/** The least distance between two segments on the page. */
function segDist(a, b, c, d) {
	const pt = (p, q, r) => {
		const dx = r[0] - q[0], dy = r[1] - q[1], l2 = dx * dx + dy * dy;
		const t = l2 ? Math.max(0, Math.min(1, ((p[0] - q[0]) * dx + (p[1] - q[1]) * dy) / l2)) : 0;
		return Math.hypot(p[0] - q[0] - t * dx, p[1] - q[1] - t * dy);
	};
	const side = (p, q, r) => Math.sign((q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]));
	if (side(a, b, c) * side(a, b, d) < 0 && side(c, d, a) * side(c, d, b) < 0) return 0;   // they cross
	return Math.min(pt(a, c, d), pt(b, c, d), pt(c, a, b), pt(d, a, b));
}
