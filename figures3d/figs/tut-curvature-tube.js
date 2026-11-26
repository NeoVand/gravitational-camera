// The tutorial, section 7.2 (tutorial/geometry/curvature-and-tides.md), its opening figure and the hero of Part 7: a
// ring of twelve free balls beside a mass, followed up the time axis. Spacetime with two directions of space, x across
// (the line to the mass, the mass on the left) and y away from the viewer, and time upward, seen obliquely from above
// (turned TURN degrees about the upright, TILT_VIEW degrees above the horizon). The mass a stone sphere of radius RM at
// (-D, 0) on the slice t = 0; its history a stone column of the sphere's own radius (RC = RM, the body's world tube)
// rising from it to the top of the scene, so that the sphere's lower half is the column's rounded foot. The
// ring's twelve balls, stone beads, start at rest on a circle of radius RHO about the origin (a dashed ink circle);
// their worldlines rise as thin strokes in the observer's colour, the two across the line to the mass (which close in)
// in the second accent (blue), the two along it (which spread) in the first (orange), and they make a tube, a glass
// surface tinted in the observer's colour, ray traced. At the top, the tube's cross-section, an ellipse through the
// beads there, in thin ink, and the dashed circle of radius RHO about the same centre for comparison. The central
// worldline, the reference ball's, in faint ink; a small cube in faint ink on it at the bottom, and the same cube at
// the top, its upright edges along the central worldline. A time axis, an ink arrow at the left. Labels: "time",
// "free balls", "mass", "falling frame".
// Departures from the diagram's comment: the drawing is one picture at every width, about 340 points wide (the site
// shows a drawing at most 1.9 pixels to the point), not cropped to a square on a phone. The comment's "the ring
// undisturbed" is not set as a label, since the comment allows no other text than its four labels; the caption names
// the dashed circles. The cube, the falling frame, is drawn twice, at the bottom and at the top: it rises with the
// central worldline, so at the top its upright edges lean with that worldline, and its slices stay the same square.
// Beads mark the balls at the bottom and at the top. The tube's outline is not drawn as a line: the glass darkens
// toward it, and a line there would double the worldlines that run along it near the top.
// Exact, for the tide of a mass to second order about the ring's centre (section 1.4's table, (GM/D^3) diag(-2, 1)
// along and across the line, and the pull GM/D^2 at the centre): every ball's worldline, x = x_c(t) + RHO cos(a)
// cosh(sqrt 2 k t), y = RHO sin(a) cos(k t), with x_c(t) = -(D/2)(cosh(sqrt 2 k t) - 1) (asserted against a Runge-Kutta
// integration of the acceleration -GM/D^2 - E x, x from the ring's starting centre); so every cross-section is an ellipse with semi-axes RHO cosh(sqrt 2
// k t) along the line and RHO cos(k t) across it (asserted: each bead on it, its long axis along the line to the mass),
// its centre falling toward the mass. The glass and the stone are ray traced together, each surface veiling exactly
// what lies behind it; each line is drawn as strongly as the glass in front of it lets it show, and hidden behind a
// bead or the stone. Schematic: k t at the top (KAPPA, the distortion exaggerated), RHO, D, the mass's size and the
// column's, the beads' size and the view. Pictorial: the stone of the mass, the column and the beads, the picture of
// the paper's figures (design/prompts/hair-sprites.json, cut out by design/hair_sprites.py, ball-face.png), lit by the
// studio of lib.js (as section 6.1's hero, figs/tut-lorentz-hero.js); the glass's tint, opacity and sheen.
import { ORIGIN, Sheet, finish, checker, near, n2, placed, LABEL_GAP, AXIS, AXIS_HEAD } from './tut-pot-lib.js';
import { View } from './tut-noise-lib.js';
import { sprite, INK, DIM, FAINT } from '../lib.js';
import { SPRITES, MARGIN } from '../stone.js';
import { STONE_INK } from './tut-orb-lib.js';
import { chapter, palette, OBS, ACCENT, ACCENT2 } from './tut-curvature-lib.js';

const name = 'tut-curvature-tube';
const check = checker(name);

// ---- the scene, world units (x, y, height); the height H is the time drawn ---------------------------------------
const RHO = 0.36;                          // the ring's radius
const D = 1.3;                             // the mass's distance from the ring's centre
const H = 1.2;                             // the top of the scene
const KAPPA = 0.62;                        // k t at the top: cos 0.62 = 0.814, cosh(0.877) = 1.410
const RM = 0.23;                           // the mass's radius
const RC = RM;                             // the column's radius: the body's own, its world tube
const CUBE = 0.12;                         // the falling frame's side
const N = 12;                              // the balls
// ---- the view ------------------------------------------------------------------------------------------------------
const TURN = 38, TILT_VIEW = 22, SCALE = 168;
// ---- the marks, points -------------------------------------------------------------------------------------------------
const BEAD = 2.5, BEAD_RIM = 0.3;          // a bead's radius and rim
const WORLD = 0.6;                         // a worldline's stroke
const RIM_LINE = 0.5;                      // the ellipse at the top, the dashed circles
const SIL = 0.4;                           // the tube's outline, as a mark that labels keep clear of
const CUBE_LINE = 0.4;                     // the cube's edges
const CENTRE_LINE = 0.45;                  // the central worldline
const STONE_RIM = 0.35;                    // the stone's edges
const DASH = [2.4, 1.8];                   // the dashed circles (tidal.js)
const MASK = 0.12;                         // each bead's mask lies this far inside it
// ---- the glass and the stone -----------------------------------------------------------------------------------------
const K = 4, SS = 3;                       // pixels per point of the raster, samples per pixel along each side
const TUBE_GLASS = { tint: '#9b2d7f', a0: 0.07, a1: 0.36 };   // the observer's colour of the light theme (app.css)
const SHEEN = 0.45, SHINE = 40;
const TEX_PER_UNIT = 760;                  // the stone picture's pixels per world unit on the column, as on the sphere

const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const unit = (v) => { const l = Math.hypot(...v); return v.map((x) => x / l); };
const KEY = unit([-0.55, 0.72, 0.62]), FILL = unit([0.85, -0.15, 0.5]);
const HALF = unit([KEY[0], KEY[1], KEY[2] + 1]);

// ---- the physics: the worldlines ----------------------------------------------------------------------------------
const s = (z) => z / H;                                       // the time, as a fraction of the time drawn
const centreX = (z) => -(D / 2) * (Math.cosh(Math.SQRT2 * KAPPA * s(z)) - 1);
const FALL = -centreX(H);                  // the centre's fall by the top
const along = (z) => Math.cosh(Math.SQRT2 * KAPPA * s(z));   // the stretch along the line to the mass
const across = (z) => Math.cos(KAPPA * s(z));                // the squeeze across it
/** The ball that starts at the angle a (from the +x axis, away from the mass), at the height z. */
const ball = (a, z) => [centreX(z) + RHO * Math.cos(a) * along(z), RHO * Math.sin(a) * across(z), z];

export default async function () {
	const nums = chapter(check);
	await palette(check);
	physics();
	const S = new Sheet(name);
	const V = new View({ turn: TURN, tilt: TILT_VIEW, scale: SCALE, o: [ORIGIN, ORIGIN + 60] });
	const Rv = [V.c, -V.s, 0], Uv = [V.s * V.sf, V.c * V.sf, V.cf], Dv = [-V.s * V.cf, -V.c * V.cf, V.sf];
	check(near(dot(Rv, Uv), 0, 1e-15) && near(dot(Rv, Dv), 0, 1e-15) && near(dot(Uv, Dv), 0, 1e-15), 'the camera\'s frame');
	const cam = (n) => [dot(n, Rv), dot(n, Uv), dot(n, Dv)];
	const P = (p) => V.at(p);
	const depth = (p) => V.depth(p);
	const world = (X, Y, d) => { const a = (X - V.o[0]) / SCALE, b = (V.o[1] - Y) / SCALE; return [0, 1, 2].map((i) => a * Rv[i] + b * Uv[i] + d * Dv[i]); };
	{ const p = [0.3, -0.7, 0.4], [X, Y] = P(p), q = world(X, Y, depth(p)); check(q.every((v, i) => near(v, p[i], 1e-12)), 'the view does not invert'); }
	const MASS = [-D, 0, 0];

	// ---- the stone: the picture, its pixels, and its colour at a normal (camera frame) and a picture point
	const face = await sprite(SPRITES + 'ball-face.png');
	const img = new Image(); img.src = face.href; await img.decode();
	const tc = document.createElement('canvas'); tc.width = face.w; tc.height = face.h;
	const tctx = tc.getContext('2d'); tctx.drawImage(img, 0, 0);
	const tex = tctx.getImageData(0, 0, face.w, face.h).data;
	const r0 = (face.w - 2 * MARGIN) / 2, tcx = face.w / 2, tcy = face.h / 2;
	const texel = (u, v) => { const x = Math.round(tcx + u), y = Math.round(tcy + v), t = (y * face.w + x) * 4; return [tex[t] / 255, tex[t + 1] / 255, tex[t + 2] / 255]; };
	// a mirrored tiling of the square inscribed in the picture's circle, for the column
	const SQUARE = 0.68 * r0;
	const mirror = (w) => { const p = 4 * SQUARE, m = ((w + SQUARE) % p + p) % p; return (m < 2 * SQUARE ? m : p - m) - SQUARE; };
	const lit = (m, albedo, spec = 0.18) => {
		const l = 0.3 + 0.8 * Math.max(0, (dot(m, KEY) + 0.3) / 1.3) + 0.14 * Math.max(0, dot(m, FILL));
		const h = spec * Math.max(0, dot(m, HALF)) ** 30;
		return albedo.map((c) => Math.min(1, c * l + h));
	};

	// ---- the tube's surface: g = ((x - x_c)/(RHO along))^2 + (y/(RHO across))^2 - 1, tabulated in the height
	const TAB = 4096;
	const tab = Array.from({ length: TAB + 1 }, (_, i) => { const z = (H * i) / TAB; return [centreX(z), RHO * along(z), RHO * across(z)]; });
	const shape = (z) => { const f = Math.max(0, Math.min(TAB, (z / H) * TAB)), i = Math.min(TAB - 1, Math.floor(f)), w = f - i, a = tab[i], b = tab[i + 1]; return [a[0] + w * (b[0] - a[0]), a[1] + w * (b[1] - a[1]), a[2] + w * (b[2] - a[2])]; };
	const g = (p) => { const [c, A, B] = shape(p[2]); return ((p[0] - c) / A) ** 2 + (p[1] / B) ** 2 - 1; };
	const gExact = (p) => ((p[0] - centreX(p[2])) / (RHO * along(p[2]))) ** 2 + (p[1] / (RHO * across(p[2]))) ** 2 - 1;
	const tubeNormal = (p) => {
		const h = 1e-6;
		return unit([0, 1, 2].map((i) => { const a = p.slice(), b = p.slice(); a[i] -= h; b[i] += h; return (gExact(b) - gExact(a)) / (2 * h); }));
	};
	const xMax = RHO * along(H) + 0.02, xMin = centreX(H) - RHO * along(H) - 0.02, yMax = RHO + 0.02;

	/** Every surface the ray through the page point (X, Y) meets, nearest the viewer first: { d, n, glass } for the
	 * tube's glass, { d, stone: [r, g, b] } for the stone. */
	function hits(X, Y) {
		const o = world(X, Y, 0), out = [];
		const at = (d) => o.map((v, i) => v + d * Dv[i]);
		// the tube: the stretch of the ray inside its box, sampled, each change of sign of g refined by bisection
		{
			const dz0 = (0 - o[2]) / Dv[2], dz1 = (H - o[2]) / Dv[2];
			let lo = Math.min(dz0, dz1), hi = Math.max(dz0, dz1);
			for (const [k, mn, mx] of [[0, xMin, xMax], [1, -yMax, yMax]]) {
				if (Math.abs(Dv[k]) < 1e-12) { if (o[k] < mn || o[k] > mx) hi = lo - 1; continue; }
				const a = (mn - o[k]) / Dv[k], b = (mx - o[k]) / Dv[k];
				lo = Math.max(lo, Math.min(a, b)); hi = Math.min(hi, Math.max(a, b));
			}
			if (hi > lo) {
				const n = 72, step = (hi - lo) / n;
				let d0 = lo, g0 = g(at(lo));
				for (let i = 1; i <= n; i++) {
					const d1 = lo + i * step, g1 = g(at(d1));
					if ((g0 < 0) !== (g1 < 0)) {
						let a = d0, b = d1, ga = g0;
						for (let j = 0; j < 40; j++) { const m = (a + b) / 2, gm = gExact(at(m)); if ((gm < 0) === (ga < 0)) { a = m; ga = gm; } else b = m; }
						const d = (a + b) / 2;
						out.push({ d, n: tubeNormal(at(d)), glass: TUBE_GLASS });
					}
					d0 = d1; g0 = g1;
				}
			}
		}
		// the sphere
		{
			const q = o.map((v, i) => v - MASS[i]), b = dot(q, Dv), c = dot(q, q) - RM * RM, disc = b * b - c;
			if (disc >= 0) {
				const d = -b + Math.sqrt(disc), p = at(d), m = cam(p.map((v, i) => (v - MASS[i]) / RM));
				out.push({ d, stone: lit(m, texel(0.97 * r0 * m[0], -0.97 * r0 * m[1])) });
			}
		}
		// the column: its side and its top
		{
			const qx = o[0] + D, qy = o[1], a = Dv[0] ** 2 + Dv[1] ** 2, b = 2 * (qx * Dv[0] + qy * Dv[1]), c = qx * qx + qy * qy - RC * RC, disc = b * b - 4 * a * c;
			if (disc >= 0) {
				for (const sg of [1, -1]) {
					const d = (-b + sg * Math.sqrt(disc)) / (2 * a), p = at(d);
					if (p[2] < 0 || p[2] > H) continue;
					const nw = [(p[0] + D) / RC, p[1] / RC, 0], m = cam(nw);
					if (m[2] < 0) continue;            // the inside of the far wall, seen only through the top: closed by the cap
					const phi = Math.atan2(p[1], p[0] + D);
					out.push({ d, stone: lit(m, texel(mirror(phi * RC * TEX_PER_UNIT), mirror(-(p[2] - H / 2) * TEX_PER_UNIT))) });
					break;
				}
			}
			const d = (H - o[2]) / Dv[2], p = at(d);
			if ((p[0] + D) ** 2 + p[1] ** 2 <= RC * RC) out.push({ d, stone: lit(cam([0, 0, 1]), texel(mirror((p[0] + D) * TEX_PER_UNIT), mirror(p[1] * TEX_PER_UNIT))) });
		}
		return out.sort((a, b) => b.d - a.d);
	}
	const tint = rgb(TUBE_GLASS.tint);
	function shade(h) {
		let m = cam(h.n);
		if (m[2] < 0) m = m.map((v) => -v);
		const cos = Math.min(1, Math.abs(m[2]));
		const l = 0.55 + 0.45 * Math.max(0, (dot(m, KEY) + 0.3) / 1.3) + 0.1 * Math.max(0, dot(m, FILL));
		const sheen = SHEEN * Math.max(0, dot(m, HALF)) ** SHINE;
		const a = h.glass.a0 + (h.glass.a1 - h.glass.a0) * (1 - cos) ** 3 + sheen * 0.5;
		return { a: Math.min(1, a), c: tint.map((v) => Math.min(1, v * l + sheen)) };
	}
	/** What lies in front of the depth `behind` at the page point, composited: premultiplied colour and opacity, and
	 * whether the stone is among it. */
	function front(X, Y, behind = -Infinity, eps = 1e-6) {
		let A = 0, stone = false; const C = [0, 0, 0];
		for (const h of hits(X, Y)) {
			if (h.d <= behind + eps) break;
			const { a, c } = h.stone ? { a: 1, c: h.stone } : shade(h);
			for (let i = 0; i < 3; i++) C[i] += (1 - A) * a * c[i];
			A += (1 - A) * a;
			if (h.stone) { stone = true; break; }
		}
		return { C, A, stone };
	}

	// ---- the beads: at the bottom on the circle and at the top on the ellipse
	const angles = Array.from({ length: N }, (_, k) => (2 * Math.PI * k) / N);
	const beads = [];
	for (const z of [0, H]) for (const a of angles) { const p = ball(a, z), [X, Y] = P(p); beads.push({ p, X, Y, d: depth(p), a }); }
	const beadR = BEAD / SCALE;
	/** Whether a bead lies in front of the world point p at its page point, within its disc grown by `grow`. */
	const underBead = (p, grow = 0) => { const [X, Y] = P(p), d = depth(p); return beads.some((b) => (X - b.X) ** 2 + (Y - b.Y) ** 2 <= (BEAD + grow) ** 2 && b.d + beadR > d + 1e-9 && !(b.p === p)); };

	// ---- the raster of the glass and the stone, over the box of the scene
	const box = [];
	for (const z of [0, H]) for (let k = 0; k < 72; k++) { const t = (2 * Math.PI * k) / 72; box.push(P([centreX(z) + RHO * 1.5 * Math.cos(t), RHO * 1.1 * Math.sin(t), z])); }
	for (const z of [-RM, 0, RM, H]) for (let k = 0; k < 36; k++) { const t = (2 * Math.PI * k) / 36; box.push(P([-D + RM * Math.cos(t), RM * Math.sin(t), z])); }
	const x0 = Math.floor(Math.min(...box.map((p) => p[0]))) - 2, x1 = Math.ceil(Math.max(...box.map((p) => p[0]))) + 2;
	const y0 = Math.floor(Math.min(...box.map((p) => p[1]))) - 2, y1 = Math.ceil(Math.max(...box.map((p) => p[1]))) + 2;
	{
		const w = (x1 - x0) * K, h = (y1 - y0) * K;
		const canvas = document.createElement('canvas');
		canvas.width = w; canvas.height = h;
		const ctx = canvas.getContext('2d');
		const im = ctx.createImageData(w, h);
		for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
			let A = 0; const C = [0, 0, 0];
			for (let u = 0; u < SS; u++) for (let v = 0; v < SS; v++) {
				const X = x0 + (i + (u + 0.5) / SS) / K, Y = y0 + (j + (v + 0.5) / SS) / K;
				// over a bead, only what lies in front of it (its mask a hair inside its disc, so no seam shows)
				let behind = -Infinity;
				for (const b of beads) if ((X - b.X) ** 2 + (Y - b.Y) ** 2 <= (BEAD + BEAD_RIM / 2 - MASK) ** 2) behind = Math.max(behind, b.d + beadR);
				const f = front(X, Y, behind);
				A += f.A; for (let k = 0; k < 3; k++) C[k] += f.C[k];
			}
			const n = SS * SS, q = (j * w + i) * 4;
			A /= n;
			if (A <= 0) continue;
			for (let k = 0; k < 3; k++) im.data[q + k] = Math.round(255 * Math.min(1, C[k] / n / A));
			im.data[q + 3] = Math.round(255 * A);
		}
		ctx.putImageData(im, 0, 0);
		S.raw(`<image class="art" href="${canvas.toDataURL('image/png')}" x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" preserveAspectRatio="none"/>`, 5);
	}

	// ---- the beads, under the raster
	const ballPng = await litBall(face, lit);
	let defs = `<image id="${name}-bead" class="art" href="${ballPng}" x="${-BEAD}" y="${-BEAD}" width="${2 * BEAD}" height="${2 * BEAD}" preserveAspectRatio="none"/>`;
	beads.sort((a, b) => a.d - b.d).forEach((b, k) => {
		const id = `${name}-b${k}`;
		defs += `<clipPath id="${id}"><circle cx="${n2(b.X)}" cy="${n2(b.Y)}" r="${BEAD}"/></clipPath>`;
		S.raw(`<g clip-path="url(#${id})"><use href="#${name}-bead" x="${n2(b.X)}" y="${n2(b.Y)}"/></g><circle cx="${n2(b.X)}" cy="${n2(b.Y)}" r="${BEAD}" fill="none" stroke="${STONE_INK}" stroke-width="${BEAD_RIM}"/>`, 1 + k * 1e-4);
		S.mark([[b.X, b.Y]], BEAD, 'a bead');
	});

	// ---- the lines, over the raster: each piece as strong as what lies in front of it lets it show, hidden behind a
	// bead or the stone
	const edge = (pts3, color, width, what, { dash = null, layer = 6, beadsHide = true } = {}) => {
		const state = (p) => {
			const [X, Y] = P(p), d = depth(p);
			const f = front(X, Y, d, 1e-5);
			const hidden = f.stone || (beadsHide && underBead(p, -0.05));
			return { X, Y, hidden, op: hidden ? 0 : Math.round((1 - f.A) * 50) / 50 };
		};
		// where a line passes behind a bead or the stone, the place is found by bisection, so that it ends at the rim
		const pts = [];
		let prev = null;
		for (const p of pts3) {
			let st = state(p);
			if (prev && prev.st.hidden !== st.hidden) {
				let a = prev.p, b = p;
				for (let i = 0; i < 30; i++) { const m = a.map((v, j) => (v + b[j]) / 2); if (state(m).hidden === prev.st.hidden) a = m; else b = m; }
				const ea = state(a), eb = state(b);
				pts.push({ ...ea, X: (ea.X + eb.X) / 2, Y: (ea.Y + eb.Y) / 2 }, { ...eb, X: (ea.X + eb.X) / 2, Y: (ea.Y + eb.Y) / 2 });
			}
			pts.push(st);
			prev = { p, st };
		}
		const pieces = [];
		let run = null;
		for (const q of pts) {
			if (run && run.op === q.op) run.pts.push([q.X, q.Y]);
			else { if (run) { if (!q.hidden && !run.hidden) run.pts.push([q.X, q.Y]); pieces.push(run); } run = { op: q.op, hidden: q.hidden, pts: [[q.X, q.Y]] }; }
		}
		if (run) pieces.push(run);
		// a dashed line keeps one pattern along its whole length: each piece starts its dashes where the last left off
		let run0 = 0;
		for (const r of pieces) {
			const len = r.pts.slice(1).reduce((acc, q, i) => acc + Math.hypot(q[0] - r.pts[i][0], q[1] - r.pts[i][1]), 0);
			if (r.op > 0 && r.pts.length > 1)
				S.raw(`<path d="M${r.pts.map(([x, y]) => `${n2(x)},${n2(y)}`).join('L')}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linejoin="round"${dash ? ` stroke-dasharray="${dash.join(' ')}" stroke-dashoffset="${n2(run0)}"` : ''}${r.op < 1 ? ` stroke-opacity="${r.op}"` : ''}/>`, layer);
			run0 += len;
		}
		S.mark(pts3.map(P), width / 2, what);
		return pieces;
	};
	const sampled = (f, n) => Array.from({ length: n + 1 }, (_, i) => f(i / n));

	// the worldlines
	for (const a of angles) {
		const k = Math.round((a / (2 * Math.PI)) * N);
		const color = k === 0 || k === 6 ? ACCENT : k === 3 || k === 9 ? ACCENT2 : OBS;
		edge(sampled((t) => ball(a, t * H), 600), color, WORLD, `the worldline ${k}`);
	}
	// the central worldline and the cubes
	edge(sampled((t) => [centreX(t * H), 0, t * H], 600), FAINT, CENTRE_LINE, 'the central worldline', { beadsHide: false });
	for (const [zb, what] of [[0, 'the cube at the bottom'], [H - CUBE, 'the cube at the top']]) {
		const c0 = centreX(zb), c1 = centreX(zb + CUBE), h = CUBE / 2;
		const corner = (sx, sy, top) => [(top ? c1 : c0) + sx * h, sy * h, zb + (top ? CUBE : 0)];
		const lines = [];
		for (const top of [0, 1]) for (const [a, b] of [[[-1, -1], [1, -1]], [[1, -1], [1, 1]], [[1, 1], [-1, 1]], [[-1, 1], [-1, -1]]]) lines.push([corner(...a, top), corner(...b, top)]);
		for (const sx of [-1, 1]) for (const sy of [-1, 1]) lines.push([corner(sx, sy, 0), corner(sx, sy, 1)]);
		for (const [i, [a, b]] of lines.entries()) edge(sampled((t) => a.map((v, j) => v + t * (b[j] - v)), 60), FAINT, CUBE_LINE, `${what}, edge ${i}`, { beadsHide: false });
		// its two squares centred on the central worldline
		check(near(c0, centreX(zb), 1e-15) && near(c1, centreX(zb + CUBE), 1e-15) && c1 <= c0, `${what} does not follow the central worldline`);
	}
	// the dashed circle at the bottom, the ellipse and the dashed circle at the top
	const circle = (z, r, cx) => sampled((t) => [cx + r * Math.cos(2 * Math.PI * t), r * Math.sin(2 * Math.PI * t), z], 720);
	const dashFit = (L) => { const k = Math.max(1, Math.round(L / (DASH[0] + DASH[1]))), f = L / (k * (DASH[0] + DASH[1])); return DASH.map((x) => +(x * f).toFixed(4)); };
	const pageLength = (pts3) => pts3.slice(1).reduce((acc, p, i) => { const a = P(pts3[i]), b = P(p); return acc + Math.hypot(b[0] - a[0], b[1] - a[1]); }, 0);
	for (const [z, cx] of [[0, 0], [H, centreX(H)]]) { const c = circle(z, RHO, cx); edge(c, INK, RIM_LINE, `the dashed circle at ${z}`, { dash: dashFit(pageLength(c)) }); }
	const top = sampled((t) => ball(2 * Math.PI * t, H), 720);
	edge(top, INK, RIM_LINE, 'the ellipse at the top');
	// the tube's outline: where its surface turns away from the view, on each side
	const outline = [[], []];
	for (let i = 0; i <= 300; i++) {
		const z = (H * i) / 300, f = (a) => dot(tubeNormal(ball(a, z)), Dv);
		const roots = [];
		for (let j = 0; j < 720; j++) {
			const a = (2 * Math.PI * j) / 720, b = (2 * Math.PI * (j + 1)) / 720;
			if ((f(a) < 0) !== (f(b) < 0)) { let lo = a, hi = b; for (let q = 0; q < 40; q++) { const m = (lo + hi) / 2; if ((f(m) < 0) === (f(lo) < 0)) lo = m; else hi = m; } roots.push(ball((lo + hi) / 2, z)); }
		}
		check(roots.length === 2, `the tube's outline at ${z.toFixed(3)} has ${roots.length} points`);
		roots.sort((p, q) => P(p)[0] - P(q)[0]);
		outline[0].push(roots[0]); outline[1].push(roots[1]);
	}
	// the outline is left to the glass, which darkens toward it: drawn as a line it would double the worldlines that
	// run along it near the top; it is remembered, so that no label touches it
	for (const [k, o] of outline.entries()) S.mark(o.map(P), SIL / 2, `the tube's outline ${k}`);
	// the stone's edges, each hidden where the stone lies in front of it: the sphere's rim on the page (its upper half
	// lies inside the column), the column's two outline generators, which leave the rim at its widest, and its top's
	// rim. The sphere and the column meet smoothly at the sphere's equator, so no line is drawn there: one body
	{
		const out = 1 + 1e-6;                  // a hair outside the surface, so that it does not hide its own edge
		const rim = sampled((t) => { const a = 2 * Math.PI * t; return MASS.map((v, i) => v + RM * out * (Math.cos(a) * Rv[i] + Math.sin(a) * Uv[i])); }, 720);
		edge(rim, STONE_INK, STONE_RIM, 'the mass', { beadsHide: false });
		const base = Math.sqrt(RM * RM - RC * RC);
		for (const sg of [-1, 1]) {
			const l = Math.hypot(Rv[0], Rv[1]), n = [(sg * Rv[0]) / l, (sg * Rv[1]) / l, 0];
			check(near(dot(cam(n), [0, 0, 1]), 0, 1e-12), 'the column\'s outline is not where it turns away');
			edge(sampled((t) => [-D + RC * out * n[0], RC * out * n[1], base + t * (H - base)], 400), STONE_INK, STONE_RIM, `the column's side ${sg}`, { beadsHide: false });
		}
		check(base === 0, 'the column is not as wide as the sphere');
		const ring = (z) => sampled((t) => [-D + RC * out * Math.cos(2 * Math.PI * t), RC * out * Math.sin(2 * Math.PI * t), z], 240);
		edge(ring(H), STONE_INK, STONE_RIM, 'the column\'s top', { beadsHide: false });
		// the column stays clear of the free balls' tube on the page
		const colRight = Math.max(...ring(H).map((p) => P(p)[0]), P([-D + RC, 0, 0])[0], P(MASS)[0] + RM * SCALE);
		const tubeLeft = Math.min(...outline[0].map((p) => P(p)[0]), ...beads.map((b) => b.X - BEAD));
		check(tubeLeft - colRight >= 12, `the column comes within ${(tubeLeft - colRight).toFixed(1)} pt of the tube`);
	}

	// ---- the time axis, an ink arrow at the left
	const L = [];
	// its foot level with the mass's centre on the page, AXIS_AIR left of the sphere
	const AXIS_AIR = 9;
	const axisFoot = world(P(MASS)[0] - RM * SCALE - AXIS_AIR, P(MASS)[1] + RM * SCALE * 0.6, 0);
	axisFoot[2] = 0;
	{ const [X] = P(axisFoot); check(near(X, P(MASS)[0] - RM * SCALE - AXIS_AIR, 1e-9), 'the time axis is not beside the mass'); }
	const axisTop = [axisFoot[0], axisFoot[1], 0.8 * H];
	S.arrow(P(axisFoot), P(axisTop), { color: INK, width: AXIS, head: AXIS_HEAD, layer: 6, what: 'the time axis' });
	{
		const [X, Y] = P(axisTop);
		L.push(await placed('\\text{time}', X, Y - LABEL_GAP - 0.6, 0.5, 1, INK));
	}
	// ---- the names
	{
		const [X, Y] = P(MASS);
		L.push(await S.clear('\\text{mass}', X, Y + RM * SCALE + LABEL_GAP + 0.4, 0.5, 0, [0, 1]));
	}
	{
		// beside the tube's outline on the right, at two thirds of the height
		const p = outline[1][200], [X, Y] = P(p);
		L.push(await S.clear('\\text{free balls}', X + LABEL_GAP + 1, Y, 0, 0.5, [1, 0]));
	}
	{
		// under the ring, a leader up to the cube at the bottom, at the place across the cube's front that keeps it
		// farthest from the beads and the worldlines
		const [cx, cy] = P([0, 0, 0]);
		const frontY = Math.max(...beads.filter((b) => b.p[2] === 0).map((b) => b.Y)) + BEAD;
		const foot = P([0, -CUBE / 2, 0]);
		// the lowest edge of the cube's bottom square on the page, at the page x
		const sq = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => P([centreX(0) + (a * CUBE) / 2, (b * CUBE) / 2, 0]));
		const lowest = (x) => Math.max(...sq.map((a, i) => { const b = sq[(i + 1) % 4]; if ((x - a[0]) * (x - b[0]) > 0 || a[0] === b[0]) return -Infinity; return a[1] + ((b[1] - a[1]) * (x - a[0])) / (b[0] - a[0]); }));
		let best = null;
		for (let x = cx - (CUBE / 2) * SCALE * 0.8; x <= cx + (CUBE / 2) * SCALE * 0.8; x += 0.1) {
			const seg = { l: x - 0.15, r: x + 0.15, t: foot[1] + 1.2, b: frontY + 4 };
			const c = S.clearance(seg, (w) => w.startsWith('the cube') || w.startsWith('the central') || w.startsWith('the dashed') || w === 'the tube\'s outline 0' || w === 'the tube\'s outline 1');
			if (!best || c.d > best.d) best = { x, d: c.d };
		}
		check(best.d > 1.6, `the leader passes ${best.d.toFixed(2)} pt from a bead or a worldline`);
		const lab = await placed('\\text{falling frame}', best.x, frontY + LABEL_GAP + 5, 0.5, 0, INK);
		L.push({ ...lab, on: ['the leader'] });
		const end = lowest(best.x) + CUBE_LINE / 2 + 0.8;
		check(Number.isFinite(end), 'the leader does not reach the cube');
		S.path([[best.x, lab.box.t - 1.2], [best.x, end]], { color: FAINT, width: 0.3, layer: 7, cap: 'butt', what: 'the leader' });
		void cy;
	}

	S.checkAll(L);
	window[name + '-numbers'] = { ...nums, fall: FALL, top: [RHO * along(H), RHO * across(H)], box: [x1 - x0, y1 - y0] };
	return finish(S, L, [240, 345], defs);
}

/** The worldlines' physics, asserted: each ball against a Runge-Kutta integration of the field to second order about
 * the ring's centre, every cross-section an ellipse with its long axis along the line to the mass. */
function physics() {
	const k2 = (KAPPA / H) ** 2;                   // k^2 = GM/D^3, per unit of height squared
	const pull = k2 * D;                           // GM/D^2
	for (const a of [0, 0.7, Math.PI / 2, 2.4, Math.PI]) {
		// x'' = -GM/D^2 - E_xx (x - 0) with E = k^2 diag(-2, 1): x'' = -pull + 2 k^2 x, y'' = -k^2 y, from rest
		let x = RHO * Math.cos(a), y = RHO * Math.sin(a), vx = 0, vy = 0;
		const n = 4000, h = H / n;
		const acc = (x, y) => [-pull + 2 * k2 * x, -k2 * y];
		for (let i = 0; i < n; i++) {
			const a1 = acc(x, y), b1 = [vx, vy];
			const a2 = acc(x + (h / 2) * b1[0], y + (h / 2) * b1[1]), b2 = [vx + (h / 2) * a1[0], vy + (h / 2) * a1[1]];
			const a3 = acc(x + (h / 2) * b2[0], y + (h / 2) * b2[1]), b3 = [vx + (h / 2) * a2[0], vy + (h / 2) * a2[1]];
			const a4 = acc(x + h * b3[0], y + h * b3[1]), b4 = [vx + h * a3[0], vy + h * a3[1]];
			x += (h / 6) * (b1[0] + 2 * b2[0] + 2 * b3[0] + b4[0]); y += (h / 6) * (b1[1] + 2 * b2[1] + 2 * b3[1] + b4[1]);
			vx += (h / 6) * (a1[0] + 2 * a2[0] + 2 * a3[0] + a4[0]); vy += (h / 6) * (a1[1] + 2 * a2[1] + 2 * a3[1] + a4[1]);
		}
		// the closed form: the centre falls as x_c = -(D/2)(cosh(sqrt 2 k t) - 1), since GM/D^2 = k^2 D, and each ball
		// lies RHO cos(a) cosh(sqrt 2 k t) from it along the line and RHO sin(a) cos(k t) across it
		const [bx, by] = ball(a, H);
		check(near(bx, x, 1e-9) && near(by, y, 1e-9), `ball ${a.toFixed(2)} is off the integrated path: ${bx - x}, ${by - y}`);
	}
	// every cross-section an ellipse about the falling centre, long along the line to the mass, short across it
	for (const z of [0, 0.3, 0.9, H]) {
		for (const a of [0.2, 1.1, 2.9, 4.4]) {
			const [x, y] = ball(a, z);
			check(near(((x - centreX(z)) / (RHO * along(z))) ** 2 + (y / (RHO * across(z))) ** 2, 1, 1e-12), 'a bead is off its ellipse');
		}
		check(along(z) >= 1 && across(z) <= 1, 'the cross-section is not stretched along and squeezed across the line');
	}
	check(centreX(H) < 0 && near(centreX(H), -FALL, 1e-15), 'the centre does not fall toward the mass');
	check(near(Math.cos(KAPPA), 0.814, 1e-3) && near(along(H), 1.410, 1e-3), `the distortion at the top: ${across(H)}, ${along(H)}`);
}

/** A stone ball lit by the studio: the picture `face` as the albedo, seen face on, lit by `lit`; a PNG 200 pixels
 * across (section 6.1's hero, figs/tut-lorentz-hero.js, litBall). */
async function litBall(face, lit) {
	const img = new Image(); img.src = face.href; await img.decode();
	const Np = 200, src = document.createElement('canvas');
	src.width = face.w; src.height = face.h;
	const sctx = src.getContext('2d'); sctx.drawImage(img, 0, 0);
	const tex = sctx.getImageData(0, 0, face.w, face.h).data;
	const c = document.createElement('canvas'); c.width = Np; c.height = Np;
	const ctx = c.getContext('2d'), out = ctx.createImageData(Np, Np);
	const r0 = (face.w - 2 * MARGIN) / 2, cx = face.w / 2, cy = face.h / 2;
	for (let j = 0; j < Np; j++) for (let i = 0; i < Np; i++) {
		const x = ((i + 0.5) / Np) * 2 - 1, y = 1 - ((j + 0.5) / Np) * 2, rr = x * x + y * y;
		if (rr > 1.0005) continue;
		const n = [x, y, Math.sqrt(Math.max(0, 1 - rr))];
		const tx = Math.round(cx + 0.97 * r0 * x), ty = Math.round(cy - 0.97 * r0 * y), t = (ty * face.w + tx) * 4;
		const col = lit(n, [tex[t] / 255, tex[t + 1] / 255, tex[t + 2] / 255]);
		const q = (j * Np + i) * 4;
		for (let k = 0; k < 3; k++) out.data[q + k] = Math.round(255 * col[k]);
		out.data[q + 3] = 255;
	}
	ctx.putImageData(out, 0, 0);
	return c.toDataURL('image/png');
}
