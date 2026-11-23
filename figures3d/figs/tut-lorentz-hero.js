// The tutorial, chapter 6.1 (tutorial/relativity/lorentz.md), its opening figure and the hero of Part 6: two rings
// that pass through one event, and the two slices of "now" through it. Spacetime with two directions of space, x
// across and y away from the viewer, and ct upward, at one scale, seen obliquely from above (turned 14 degrees about
// the upright, 26 degrees above the horizon). One event at the origin, a small bright point; its light cone, a thin
// glass double cone of half-angle 45 degrees, |ct| = sqrt(x^2 + y^2), cut off at |ct| = H. Two rings of twelve stone
// test masses whose centres pass through the event: one at rest, its worldline the upright line x = y = 0 (ink), drawn
// a time c tau = T before the event, in its slice ct = -T; and one moving at 0.6c along x, its worldline x = 0.6 ct (in
// the observer's colour), tilted by arctan 0.6 = 31.0 degrees from the upright, drawn a time T after the event on its
// own clock, in its own slice: the image of a circle of radius RHO at t' = T under the boost, its beads at (x, y, ct) =
// (gamma (beta T + RHO cos a), RHO sin a, gamma (T + beta RHO cos a)), so that each ring lies parallel to its own sheet.
// Through the event, each ring's slice of simultaneity as a thin rectangular sheet of glass over |x| <= 1.35,
// |y| <= 1.2: ct = 0 for the ring at rest (neutral glass, edged in ink), ct = 0.6 x for the moving ring (glass tinted
// and edged in the observer's colour), tilted by the same 31.0 degrees. The cone's glass tinted and outlined in the
// light role's colour. No labels.
// Departure from the diagram's comment: none in substance. The comment leaves open where the rings are drawn along
// their worldlines; the ring at rest is drawn before the event and the moving one after it, so that the two do not
// overlap on the page, and each inside the cone, as every clock's path through the event is.
// Exact: the cone (its outline, the generators where the surface turns away from the view, found in closed form and
// asserted on the cone, and its rims), the two sheets' planes (asserted: the tilted one is t' = 0, every point of it
// at -c^2 t^2 + x^2 + y^2 >= 0, so that it touches the cone only at the event), the worldlines (x' = 0, asserted), the
// rings (each bead asserted at t' = T and at the distance RHO from the moving centre in its own frame, every bead inside
// the cone; the ring at rest at ct = -T, RHO from the line), the tilts (31.0 degrees, asserted in 3D), and the glass's
// depth order: the glass is ray traced, so each sheet and each wall of the cone veils exactly what lies behind it, and
// each edge is drawn as strongly as the glass in front of it lets it show and hidden where a bead or a worldline lies
// in front of it. No edge grazes a bead (asserted: each passes a bead's rim by GRAZE or more, outside or across).
// Schematic: H, T and RHO, the sheets' size, the beads' size and the view. Pictorial: the stone of the beads, the
// picture of the paper's figures (design/prompts/hair-sprites.json, cut out by design/hair_sprites.py, ball-face.png),
// lit as a sphere by the studio of lib.js; the glass's tints, its opacity and its sheen; the event's glow.
import { Sheet, ORIGIN, finish, checker, near, n2 } from './tut-pot-lib.js';
import { View } from './tut-noise-lib.js';
import { sprite, INK, DIM } from '../lib.js';
import { SPRITES, MARGIN } from '../stone.js';
import { STONE_INK } from './tut-orb-lib.js';
import { chapter, palette, OBS, LIGHT, ROLE, BETA, GAMMA, TILT, boost, interval } from './tut-lorentz-lib.js';

const name = 'tut-lorentz-hero';
const check = checker(name);

// ---- the scene, world units (x, y, ct) ------------------------------------------------------------------------------
const H = 1.06;                            // the cone is cut off at |ct| = H
const SIDE = [1.35, 1.2];                  // the sheets' half-sizes in x and in y: each the rectangle |x| <= SIDE[0],
                                           // |y| <= SIDE[1], lifted to its plane
const T = 0.46;                            // each ring a time T from the event on its own clock
const RHO = 0.3;                           // the rings' radius in their own frames
const REACH = 1.28;                        // the worldlines run from ct = -REACH to REACH
// ---- the view -------------------------------------------------------------------------------------------------------
const TURN = 14, TILT_VIEW = 26, SCALE = 92;
const GRAZE = 1.0;                         // an edge passes a bead's rim by at least this, outside it or across it
// ---- the marks, points --------------------------------------------------------------------------------------------------
const BEAD = 2.3;                          // a bead's radius
const BEAD_RIM = 0.3;
const WORLD = 0.6;                         // a worldline's stroke
const EDGE = 0.45;                         // a sheet's edge
const CONE = 0.4;                          // the cone's outline
const MASK = 0.12;                         // each occluder's mask lies this far inside its mark
const CORE = 1.5, GLOW = 7;                // the event: its core and its glow, radii
// ---- the glass ---------------------------------------------------------------------------------------------------------
const K = 4, SS = 3;                       // pixels per point of the glass, and samples per pixel along each side
const SHEET_GLASS = { tint: '#8b877d', a0: 0.13, a1: 0.42 };
const NOW_GLASS = { tint: ROLE.obs[1], a0: 0.12, a1: 0.4 };
const CONE_GLASS = { tint: ROLE.light[1], a0: 0.08, a1: 0.38 };
const SHEEN = 0.5, SHINE = 40;             // the glass's highlight

const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const unit = (v) => { const l = Math.hypot(...v); return v.map((x) => x / l); };
const KEY = unit([-0.55, 0.72, 0.62]), FILL = unit([0.85, -0.15, 0.5]);
const HALF = unit([KEY[0], KEY[1], KEY[2] + 1]);

export default async function () {
	const nums = chapter(check);
	await palette(check);
	const S = new Sheet(name);
	const V = new View({ turn: TURN, tilt: TILT_VIEW, scale: SCALE, o: [ORIGIN, ORIGIN] });
	// the camera's frame in the world: right, up and toward the viewer (tut-noise-lib.js, View)
	const Rv = [V.c, -V.s, 0], Uv = [V.s * V.sf, V.c * V.sf, V.cf], Dv = [-V.s * V.cf, -V.c * V.cf, V.sf];
	check(near(dot(Rv, Uv), 0, 1e-15) && near(dot(Rv, Dv), 0, 1e-15) && near(dot(Uv, Dv), 0, 1e-15), 'the camera\'s frame');
	const cam = (n) => [dot(n, Rv), dot(n, Uv), dot(n, Dv)];
	const P = (p) => V.at(p);
	const depth = (p) => V.depth(p);
	const world = (X, Y, d) => { const a = (X - V.o[0]) / SCALE, b = (V.o[1] - Y) / SCALE; return [0, 1, 2].map((i) => a * Rv[i] + b * Uv[i] + d * Dv[i]); };
	{ const p = [0.3, -0.7, 0.4], [X, Y] = P(p), q = world(X, Y, depth(p)); check(q.every((v, i) => near(v, p[i], 1e-12)), 'the view does not invert'); }

	// ---- the physics: the tilts, the sheets outside the cone, the worldlines and the rings
	const moving = (ct) => [BETA * ct, 0, ct];
	check(near((Math.acos(dot(unit(moving(1)), [0, 0, 1])) * 180) / Math.PI, TILT, 1e-9), 'the worldline is not tilted by 31.0 degrees');
	check(near((Math.acos(dot(unit([-BETA, 0, 1]), [0, 0, 1])) * 180) / Math.PI, TILT, 1e-9), 'the sheet is not tilted by 31.0 degrees');
	for (const ct of [-1, 0.4, 1.2]) check(near(boost([ct, BETA * ct])[1], 0, 1e-15), 'the worldline is not x\' = 0');
	for (let i = 0; i <= 40; i++) for (let j = 0; j <= 40; j++) {
		const x = -SIDE[0] + (2 * SIDE[0] * i) / 40, y = -SIDE[1] + (2 * SIDE[1] * j) / 40;
		check(near(boost([BETA * x, x])[0], 0, 1e-15), 'the tilted sheet is not t\' = 0');
		check(-((BETA * x) ** 2) + x * x + y * y >= -1e-15, 'the tilted sheet enters the cone');
	}
	const ringAtRest = Array.from({ length: 12 }, (_, k) => { const a = (2 * Math.PI * k) / 12; return [RHO * Math.cos(a), RHO * Math.sin(a), -T]; });
	const ringMoving = Array.from({ length: 12 }, (_, k) => {
		const a = (2 * Math.PI * k) / 12, xp = RHO * Math.cos(a);
		return [GAMMA * (BETA * T + xp), RHO * Math.sin(a), GAMMA * (T + BETA * xp)];
	});
	const centreMoving = [GAMMA * BETA * T, 0, GAMMA * T];
	for (const p of ringMoving) {
		const [tp, xp] = boost([p[2], p[0]]), [, xc] = boost([centreMoving[2], centreMoving[0]]);
		check(near(tp, T, 1e-14) && near(Math.hypot(xp - xc, p[1]), RHO, 1e-14), 'a bead of the moving ring is off its slice or its circle');
	}
	check(near(boost([centreMoving[2], centreMoving[0]])[1], 0, 1e-15), 'the moving ring\'s centre is off its worldline');
	// every bead inside the cone and within its cut, so that the glass encloses the rings
	for (const p of [...ringAtRest, ...ringMoving]) check(interval([p[2], Math.hypot(p[0], p[1])]) < 0 && Math.abs(p[2]) < H, 'a bead is outside the cone');

	// ---- the occluders of the glass: the beads, the worldlines and the event, drawn under it. The raster over each
	// holds only the glass in front of it; its mask lies MASK inside the mark, so that no seam of the page shows round it
	const occluders = [];
	const beadR = BEAD / SCALE;
	for (const p of [...ringAtRest, ...ringMoving]) { const [X, Y] = P(p); occluders.push({ disc: [X, Y, BEAD + BEAD_RIM / 2], d: depth(p) + beadR }); }
	const lines = [
		{ a: [0, 0, -REACH], b: [0, 0, REACH], color: INK, what: 'the worldline at rest' },
		{ a: moving(-REACH), b: moving(REACH), color: OBS, what: 'the moving worldline' }
	];
	for (const l of lines) occluders.push({ seg: [P(l.a), P(l.b)], da: depth(l.a), db: depth(l.b), hw: WORLD / 2 });
	{ const [X, Y] = P([0, 0, 0]); occluders.push({ disc: [X, Y, CORE + 0.175], d: 1e-9 }); }
	/** The depth of the nearest occluder at the page point (X, Y), or -Infinity, each occluder grown by `grow` points. */
	const occluded = (X, Y, grow) => {
		let best = -Infinity;
		for (const o of occluders) {
			if (o.disc) { const [x, y, r] = o.disc; if ((X - x) ** 2 + (Y - y) ** 2 <= (r + grow) ** 2) best = Math.max(best, o.d); }
			else {
				const [a, b] = o.seg, L2 = (b[0] - a[0]) ** 2 + (b[1] - a[1]) ** 2;
				const t = Math.max(0, Math.min(1, ((X - a[0]) * (b[0] - a[0]) + (Y - a[1]) * (b[1] - a[1])) / L2));
				if (Math.hypot(X - a[0] - t * (b[0] - a[0]), Y - a[1] - t * (b[1] - a[1])) <= o.hw + grow) best = Math.max(best, o.da + t * (o.db - o.da));
			}
		}
		return best;
	};

	// ---- the glass: every surface a ray meets, nearest first
	const sheets = [
		{ n: [0, 0, 1], f: (p) => p[2], glass: SHEET_GLASS },
		{ n: unit([-BETA, 0, 1]), f: (p) => p[2] - BETA * p[0], glass: NOW_GLASS }
	];
	/** The glass along the ray through (X, Y): a list of { d, n (world), glass }. */
	function hits(X, Y) {
		const o = world(X, Y, 0), out = [];
		// the cone: (o + d D)_x^2 + ()_y^2 - ()_ct^2 = 0
		const qa = Dv[0] ** 2 + Dv[1] ** 2 - Dv[2] ** 2, qb = 2 * (o[0] * Dv[0] + o[1] * Dv[1] - o[2] * Dv[2]), qc = o[0] ** 2 + o[1] ** 2 - o[2] ** 2;
		const disc = qb * qb - 4 * qa * qc;
		if (disc >= 0) {
			for (const s of [-1, 1]) {
				const d = (-qb + s * Math.sqrt(disc)) / (2 * qa), p = o.map((v, i) => v + d * Dv[i]);
				if (Math.abs(p[2]) <= H) out.push({ d, n: unit([p[0], p[1], -p[2]]), glass: CONE_GLASS });
			}
		}
		for (const s of sheets) {
			const d = -s.f(o) / s.f(Dv), p = o.map((v, i) => v + d * Dv[i]);
			if (Math.abs(p[0]) <= SIDE[0] && Math.abs(p[1]) <= SIDE[1]) out.push({ d, n: s.n, glass: s.glass });
		}
		return out.sort((a, b) => b.d - a.d);
	}
	const tints = new Map([SHEET_GLASS, NOW_GLASS, CONE_GLASS].map((g) => [g, rgb(g.tint)]));
	/** One surface's colour and opacity, lit by the studio (lib.js, shadeNormal) from its side toward the viewer. */
	function shade(h) {
		let m = cam(h.n);
		if (m[2] < 0) m = m.map((v) => -v);
		const cos = Math.min(1, Math.abs(m[2]));
		const lit = 0.55 + 0.45 * Math.max(0, (dot(m, KEY) + 0.3) / 1.3) + 0.1 * Math.max(0, dot(m, FILL));
		const sheen = SHEEN * Math.max(0, dot(m, HALF)) ** SHINE;
		const a = h.glass.a0 + (h.glass.a1 - h.glass.a0) * (1 - cos) ** 3 + sheen * 0.5;
		const c = tints.get(h.glass).map((v) => Math.min(1, v * lit + sheen));
		return { a: Math.min(1, a), c };
	}
	/** The glass in front of the depth `behind`, composited: [r, g, b] premultiplied and the opacity. */
	function glassAt(X, Y, behind = -Infinity, eps = 1e-6) {
		let A = 0; const C = [0, 0, 0];
		for (const h of hits(X, Y)) {
			if (h.d <= behind + eps) break;
			const { a, c } = shade(h);
			for (let i = 0; i < 3; i++) C[i] += (1 - A) * a * c[i];
			A += (1 - A) * a;
		}
		return { C, A };
	}

	// ---- the raster of the glass over the box of the cone and the sheets
	const box = [];
	for (const s of [-1, 1]) for (let k = 0; k < 72; k++) { const t = (2 * Math.PI * k) / 72; box.push(P([H * Math.cos(t), H * Math.sin(t), s * H])); }
	for (const sx of [-1, 1]) for (const sy of [-1, 1]) { const x = sx * SIDE[0], y = sy * SIDE[1]; box.push(P([x, y, 0]), P([x, y, BETA * x])); }
	const x0 = Math.floor(Math.min(...box.map((p) => p[0]))) - 1, x1 = Math.ceil(Math.max(...box.map((p) => p[0]))) + 1;
	const y0 = Math.floor(Math.min(...box.map((p) => p[1]))) - 1, y1 = Math.ceil(Math.max(...box.map((p) => p[1]))) + 1;
	{
		const w = (x1 - x0) * K, h = (y1 - y0) * K;
		const canvas = document.createElement('canvas');
		canvas.width = w; canvas.height = h;
		const ctx = canvas.getContext('2d');
		const img = ctx.createImageData(w, h);
		for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
			let A = 0; const C = [0, 0, 0];
			for (let u = 0; u < SS; u++) for (let v = 0; v < SS; v++) {
				const X = x0 + (i + (u + 0.5) / SS) / K, Y = y0 + (j + (v + 0.5) / SS) / K;
				const g = glassAt(X, Y, occluded(X, Y, -MASK));
				A += g.A; for (let k = 0; k < 3; k++) C[k] += g.C[k];
			}
			const n = SS * SS, q = (j * w + i) * 4;
			A /= n;
			if (A <= 0) continue;
			for (let k = 0; k < 3; k++) img.data[q + k] = Math.round(255 * Math.min(1, C[k] / n / A));
			img.data[q + 3] = Math.round(255 * A);
		}
		ctx.putImageData(img, 0, 0);
		S.raw(`<image class="art" href="${canvas.toDataURL('image/png')}" x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" preserveAspectRatio="none"/>`, 5);
	}

	// ---- the beads: one lit stone ball, drawn at each place, behind the worldline or before it
	const face = await sprite(SPRITES + 'ball-face.png');
	const ball = await litBall(face);
	let defs = `<image id="${name}-bead" class="art" href="${ball}" x="${-BEAD}" y="${-BEAD}" width="${2 * BEAD}" height="${2 * BEAD}" preserveAspectRatio="none"/>`;
	const beadSvg = (p, k) => {
		const [X, Y] = P(p), id = `${name}-b${k}`;
		defs += `<clipPath id="${id}"><circle cx="${n2(X)}" cy="${n2(Y)}" r="${BEAD}"/></clipPath>`;
		return `<g clip-path="url(#${id})"><use href="#${name}-bead" x="${n2(X)}" y="${n2(Y)}"/></g><circle cx="${n2(X)}" cy="${n2(Y)}" r="${BEAD}" fill="none" stroke="${STONE_INK}" stroke-width="${BEAD_RIM}"/>`;
	};
	let k = 0;
	for (const [ring, centre, line] of [[ringAtRest, [0, 0, -T], 0], [ringMoving, centreMoving, 1]]) {
		const behind = ring.filter((p) => depth(p) < depth(centre)), before = ring.filter((p) => depth(p) >= depth(centre));
		S.raw(behind.sort((a, b) => depth(a) - depth(b)).map((p) => beadSvg(p, k++)).join(''), 1 + line * 0.01);
		S.raw(before.sort((a, b) => depth(a) - depth(b)).map((p) => beadSvg(p, k++)).join(''), 3 + line * 0.01);
		for (const p of ring) S.mark([P(p)], BEAD, 'a bead');
	}
	// ---- the worldlines, between the beads behind and before them
	for (const l of lines) {
		const pts = [P(l.a), P(l.b)];
		S.path(pts, { color: l.color, width: WORLD, layer: 2, cap: 'butt', what: l.what });
	}
	// ---- the event: a small bright point
	{
		const [X, Y] = P([0, 0, 0]);
		defs += `<radialGradient id="${name}-glow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${LIGHT}" stop-opacity="0.75"/><stop offset="0.35" stop-color="${LIGHT}" stop-opacity="0.35"/><stop offset="1" stop-color="${LIGHT}" stop-opacity="0"/></radialGradient>`;
		S.raw(`<circle cx="${n2(X)}" cy="${n2(Y)}" r="${GLOW}" fill="url(#${name}-glow)"/>`, 4);
		S.raw(`<circle cx="${n2(X)}" cy="${n2(Y)}" r="${CORE}" fill="#fffef4" stroke="${LIGHT}" stroke-width="0.35"/>`, 4.1);
		S.mark([[X, Y]], GLOW, 'the event');
	}

	// ---- the edges of the glass, over it: each piece as strong as the glass in front of it lets it show, and hidden
	// where a bead, a worldline or the event lies in front of it
	const edge = (pts3, color, width, what) => {
		const pieces = [];
		let run = null;
		for (let i = 0; i < pts3.length; i++) {
			const p = pts3[i], [X, Y] = P(p), d = depth(p);
			const hidden = occluded(X, Y, width / 2 + 0.1) > d + 1e-6;
			const A = hidden ? 1 : glassAt(X, Y, d, 1e-5).A;
			const op = Math.round((1 - A) * 20) / 20;
			if (run && run.op === op) run.pts.push([X, Y]);
			else { if (run) { run.pts.push([X, Y]); pieces.push(run); } run = { op, pts: [[X, Y]] }; }
		}
		if (run) pieces.push(run);
		for (const r of pieces) if (r.op > 0 && r.pts.length > 1)
			S.raw(`<path d="M${r.pts.map(([x, y]) => `${n2(x)},${n2(y)}`).join('L')}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linejoin="round"${r.op < 1 ? ` stroke-opacity="${r.op}"` : ''}/>`, 6);
		S.mark(pts3.map(P), width / 2, what);
		// no edge grazes a bead: on the page it passes either clear of the bead's rim or well across it
		for (const b of [...ringAtRest, ...ringMoving]) {
			const [bx, by] = P(b), least = Math.min(...pts3.map((p) => { const [X, Y] = P(p); return Math.hypot(X - bx, Y - by); }));
			check(Math.abs(least - (BEAD + BEAD_RIM / 2)) >= GRAZE + width / 2, `${what} grazes a bead by ${(least - BEAD).toFixed(2)} pt`);
		}
	};
	const along = (a, b, n = 240) => Array.from({ length: n + 1 }, (_, i) => a.map((v, j) => v + ((b[j] - v) * i) / n));
	// the sheets' outlines
	for (const [s, color] of [[0, DIM], [1, OBS]]) {
		const z = (x) => (s ? BETA * x : 0), [a, b] = SIDE;
		const c = [[-a, -b], [a, -b], [a, b], [-a, b], [-a, -b]].map(([x, y]) => [x, y, z(x)]);
		const loop = [];
		for (let i = 0; i < 4; i++) loop.push(...along(c[i], c[i + 1], 360).slice(i ? 1 : 0));
		edge(loop, color, EDGE, `the sheet ${s}`);
	}
	// the cone: its rims and the generators where it turns away from the view
	for (const s of [-1, 1]) {
		edge(Array.from({ length: 721 }, (_, i) => { const t = (2 * Math.PI * i) / 720; return [H * Math.cos(t), H * Math.sin(t), s * H]; }), LIGHT, CONE, `the rim ${s}`);
		// the normal (cos phi, sin phi, -s) is across the view where cos(phi - phi0) = -s tan(tilt), (cos phi0, sin phi0) = (sin turn, cos turn)
		const phi0 = Math.atan2(V.c, V.s), w = Math.acos((-s * V.sf) / V.cf);
		for (const phi of [phi0 + w, phi0 - w]) {
			const g = [Math.cos(phi), Math.sin(phi), s];
			check(near(dot(cam([g[0], g[1], -s]), [0, 0, 1]), 0, 1e-12), 'an outline generator is not at the cone\'s edge in the view');
			edge(along([0, 0, 0], g.map((v) => v * H), 360).slice(4), LIGHT, CONE, `the generator ${s}, ${phi}`);
		}
	}

	S.checkAll([]);
	window[name + '-numbers'] = { ...nums, box: [x1 - x0, y1 - y0] };
	return finish(S, [], [240, 340], defs);
}

/** A stone ball lit by the studio: the picture `face` (its exact circle inside MARGIN pixels of canvas) as the
 * albedo, seen face on, under the light of lib.js's shadeNormal; returns a PNG of 200 pixels across. */
async function litBall(face) {
	const img = new Image(); img.src = face.href; await img.decode();
	const N = 200, src = document.createElement('canvas');
	src.width = face.w; src.height = face.h;
	const sctx = src.getContext('2d'); sctx.drawImage(img, 0, 0);
	const tex = sctx.getImageData(0, 0, face.w, face.h).data;
	const c = document.createElement('canvas'); c.width = N; c.height = N;
	const ctx = c.getContext('2d'), out = ctx.createImageData(N, N);
	const r0 = (face.w - 2 * MARGIN) / 2, cx = face.w / 2, cy = face.h / 2;
	for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
		const x = ((i + 0.5) / N) * 2 - 1, y = 1 - ((j + 0.5) / N) * 2, rr = x * x + y * y;
		if (rr > 1.0005) continue;
		const n = [x, y, Math.sqrt(Math.max(0, 1 - rr))];
		// the albedo: the picture, read at the sphere's point seen face on, its rim kept inside the picture's circle
		const s = 0.97;
		const tx = Math.round(cx + s * r0 * x), ty = Math.round(cy - s * r0 * y), t = (ty * face.w + tx) * 4;
		const lit = 0.3 + 0.8 * Math.max(0, (dot(n, KEY) + 0.3) / 1.3) + 0.14 * Math.max(0, dot(n, FILL));
		const spec = 0.18 * Math.max(0, dot(n, HALF)) ** 30;
		const q = (j * N + i) * 4;
		for (let k = 0; k < 3; k++) out.data[q + k] = Math.round(255 * Math.min(1, (tex[t + k] / 255) * lit + spec));
		out.data[q + 3] = 255;
	}
	ctx.putImageData(out, 0, 0);
	return c.toDataURL('image/png');
}
