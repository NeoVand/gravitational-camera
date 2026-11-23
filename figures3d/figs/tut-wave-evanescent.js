// The tutorial, chapter 5.1 (tutorial/waves/wave-equation.md), its third diagram: which ripples across a plane leave
// as waves. Two panels side by side in the style of chapter 2.7's opening figure (figs/tut-evan-hero.js: its stone
// slab, its view and its glass): in each, the same slab whose top, the plane z = 0, carries the same ripple of the
// field, u = sin(k x) at z = 0 with crests a unit d apart, orange where u is above zero and blue where it is below, as
// 2.7 colours its slab; on the slab's back edge an upright pane of 2.7's glass shows the field above the plane at one
// instant, in the plane of x and the height z, coloured by 2.7's rule (from the clear glass toward the accent of the
// field's sign as 1 - exp(-(a u/0.3)^2), a = 0.45 the field's drawn size at the plane, its opacity growing with it). The height axis runs up the pane's left edge,
// labelled z. Left, kc/omega = 0.6, crests on the plane farther apart than a wavelength: above the plane the field is
// the plane wave sin(k x + k_z z), k_z = (4/3) k, whose straight crests stand at the angle theta from the horizontal,
// and above the pane its wavevector (k, k_z), at theta = 36.87 degrees from the vertical, sin(theta) = kc/omega.
// Right, kc/omega = 2, crests closer than a wavelength: the same ripple fading as sin(k x) e^{-kappa z}, kappa =
// sqrt(3) omega/c = (sqrt(3)/2) k, with no crests travelling. Under each slab a bar of one wavelength 2 pi c/omega:
// 0.6 d on the left, 2 d on the right.
// Exact: the ripple and its spacing, the same in both panels; the field on each pane at its true heights (asserted at
// sample points to solve the wave equation's -omega^2 F = c^2 (F'' - k^2 F)); the crests' angle and the wavevector's
// direction and the arc's angle theta (asserted on the page against the projection of the exact directions); the two
// bars (asserted to be 2 pi c/omega long in the world). Schematic: the height of the slab's relief (the field at the
// plane drawn as a height, as 2.7 draws the density), the slab's depth and thickness, the pane's height (its glass
// drawn without thickness), the field's drawn size a, and the length of the wavevector's arrow. Under the relief's troughs the pane reaches below z = 0, where
// it shows the field at z = 0.
import { Sheet, ORIGIN, finish, checker, placed, near, n2, TICK, HAIR, LABEL_GAP } from './tut-pot-lib.js';
import { View, Regions, hull, veil } from './tut-noise-lib.js';
import { pathOf } from './tut-prob-lib.js';
import { AXIS, AXIS_HEAD, VEC, VEC_HEAD } from './tut-vec-lib.js';
import { ZERO_LINE, ZERO_DASH } from './tut-bessel-lib.js';
import { chapter, RATIOS, kz, kappa } from './tut-wave-lib.js';
import { sprite, THREE, INK, DIM, FAINT, ACCENT, ACCENT2 } from '../lib.js';

const name = 'tut-wave-evanescent';
const check = checker(name);

// ---- the mathematics: lengths in units of the crests' spacing d on the plane --------------------------------------
const K = 2 * Math.PI;                    // the ripple's wavenumber
const HALF = 1.5;                         // the slab's half-length along x: three crests
/** The two panels: kc/omega, omega/c, the field above the plane u(x, z) at t = 0, and its slope along x. */
const PANELS = [RATIOS.wave, RATIOS.fade].map((r) => {
	const w = K / r;                      // omega / c
	if (r < 1) {
		const q = kz(r) * w;              // k_z
		return { r, w, q, wave: true, u: (x, z) => Math.sin(K * x + q * Math.max(0, z)) };
	}
	const f = kappa(r) * w;               // kappa
	return { r, w, f, wave: false, u: (x, z) => Math.sin(K * x) * Math.exp(-f * Math.max(0, z)) };
});
const ripple = (x) => Math.sin(K * x);
const rippleSlope = (x) => K * Math.cos(K * x);

function mathematics() {
	const nums = chapter(check);
	check(near(ripple(-HALF), 0, 1e-12) && near(ripple(HALF), 0, 1e-12), 'the slab does not end at the mean');
	for (const p of PANELS) {
		// at z = 0 both panels carry the same ripple
		for (let x = -HALF; x <= HALF; x += 0.01) check(near(p.u(x, 0), ripple(x), 1e-12), 'the ripple at the plane differs');
		// the field solves -omega^2 u = c^2 (u_xx + u_zz) above the plane (time dependence e^{-i omega t})
		const h = 1e-4;
		for (const [x, z] of [[0.13, 0.2], [-0.71, 0.55], [1.04, 0.9]]) {
			const lap = (p.u(x + h, z) - 2 * p.u(x, z) + p.u(x - h, z) + p.u(x, z + h) - 2 * p.u(x, z) + p.u(x, z - h)) / (h * h);
			check(Math.abs(lap + p.w * p.w * p.u(x, z)) < 1e-4 * p.w * p.w, `the field of kc/omega = ${p.r} breaks the wave equation`);
		}
	}
	check(near(PANELS[0].q / K, 4 / 3, 1e-12) && near(PANELS[1].f / PANELS[1].w, Math.sqrt(3), 1e-12), 'k_z and kappa');
	// the wavelengths: 0.6 d and 2 d
	check(near((2 * Math.PI) / PANELS[0].w, 0.6, 1e-12) && near((2 * Math.PI) / PANELS[1].w, 2, 1e-12), 'the wavelengths');
	return nums;
}

// ---- the drawing -----------------------------------------------------------------------------------------------
const TURN = -12, TILT = 20;              // the view, as 2.7's
const SCALE = 46;                         // points per d
const DEEP = 1.0;                         // the slab's extent in y
const THICK = 0.22;                       // the slab's thickness
const RELIEF = 0.035;                     // the slab's relief per unit of the ripple
const HZ = 1.1;                           // the pane's height
const RISE = 0.3;                         // the z axis reaches this far above the pane
const APART = 26;                         // the air between the two panels' slabs, points
const VEIL = 0.64, SOFT = 0.22, LIFT = 1.8;   // the slab's colour and relief shading (figs/tut-evan-hero.js)
const GLASS_TINT = FAINT, A0 = 0.35, A1 = 0.95, GSOFT = 0.3;   // the glass's colour rule (figs/tut-evan-hero.js)
const FIELD = 0.45;                       // the field's size at the plane, in the units of that rule (chosen for the drawing)
const NX = 900, NY = 10, NZ = 360;        // the meshes
const KS = 4, KG = 3, SS = 2;             // pixels per point of the stone and the glass, and the supersampling
const TOL = 0.01;                         // a drawn edge strays from its exact curve by at most this, points
const CUT = '#2b2418';                    // the stone's ink (figs/tut-evan-hero.js)
const EDGE = 0.4;
const STONE_MEAN = '#d8b47e';
const GRAIN = 2.26;                       // units of d per unit of the stone's picture, so that its grain is 2.7's on the page
const ARROW = 0.62;                       // the wavevector's arrow, units of d
const ARC = 0.3;                          // the angle's arc, units of d
const BAR_DROP = 0.16;                    // the bars, this far below the slab's front lower edge, units of d

const KEY = [-0.55, 0.72, 0.62], FILL = [0.85, -0.15, 0.5];
const unit = (v) => { const l = Math.hypot(...v); return v.map((x) => x / l); };
function light(V, [x, y, z]) {
	const xr = x * V.c - y * V.s, yr = x * V.s + y * V.c;
	const m = unit([xr, yr * V.sf + z * V.cf, -yr * V.cf + z * V.sf]);
	const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
	return 0.3 + 0.8 * Math.max(0, (dot(m, unit(KEY)) + 0.3) / 1.3) + 0.14 * Math.max(0, dot(m, unit(FILL)));
}
const rgb = (hex) => new THREE.Color(hex).getRGB(new THREE.Color(), THREE.SRGBColorSpace);
const mix = (a, b, t) => ({ r: a.r + (b.r - a.r) * t, g: a.g + (b.g - a.g) * t, b: a.b + (b.b - a.b) * t });

/** A polyline of page points thinned (Douglas-Peucker) so that it strays from the given one by at most TOL. */
function thin(pts, tol = TOL) {
	const keep = new Uint8Array(pts.length);
	keep[0] = keep[pts.length - 1] = 1;
	const stack = [[0, pts.length - 1]];
	while (stack.length) {
		const [a, b] = stack.pop();
		const [ax, ay] = pts[a], [bx, by] = pts[b], L = Math.hypot(bx - ax, by - ay) || 1e-12;
		let far = -1, d = 0;
		for (let i = a + 1; i < b; i++) {
			const e = Math.abs((bx - ax) * (ay - pts[i][1]) - (ax - pts[i][0]) * (by - ay)) / L;
			if (e > d) { d = e; far = i; }
		}
		if (d > tol) { keep[far] = 1; stack.push([a, far], [far, b]); }
	}
	return pts.filter((_, i) => keep[i]);
}
const line = (pts, close = false) => pathOf(thin(pts), close);
const angle = (a, b) => Math.acos((a[0] * b[0] + a[1] * b[1]) / (Math.hypot(...a) * Math.hypot(...b)));

export default async function () {
	mathematics();
	const S = new Sheet(name);
	const R = new Regions(name);
	const L = [];
	const hy = DEEP / 2;
	const slabTop = (x) => RELIEF * ripple(x);
	const stone = await sprite('/figures3d/sprites/slab.jpg');
	const img = new Image(); img.src = stone.href; await img.decode();
	const gl = renderer(img);
	let defs = '';
	const along = (a, b, n = NX) => Array.from({ length: n + 1 }, (_, i) => [a[0] + ((b[0] - a[0]) * i) / n, a[1] + ((b[1] - a[1]) * i) / n]);

	// the panels' views: the same view, moved so that the slabs stand APART points apart on the page
	const probe = new View({ turn: TURN, tilt: TILT, scale: SCALE, o: [0, 0] });
	const xs = [[-HALF, -hy], [HALF, -hy], [HALF, hy], [-HALF, hy]].map(([x, y]) => probe.at([x, y, 0])[0]);
	const span = Math.max(...xs) - Math.min(...xs);
	const views = [-1, 1].map((s) => {
		const V = new View({ turn: TURN, tilt: TILT, scale: SCALE, o: [0, 0] });
		const mid = V.at([0, 0, (HZ - THICK) / 2]);
		V.o = [ORIGIN + s * (span + APART) / 2 - mid[0], ORIGIN - mid[1]];
		return V;
	});
	const tops = [];

	for (const [i, p] of PANELS.entries()) {
		const V = views[i];
		const P = (q) => V.at(q);
		const front = along([-HALF, -hy], [HALF, -hy]), right = along([HALF, -hy], [HALF, hy], 40);
		const back = along([HALF, hy], [-HALF, hy]), left = along([-HALF, hy], [-HALF, -hy], 40);

		// ---- the pane, behind the slab: x from -HALF to HALF at y = hy, z from the slab's top to HZ
		{
			const bottom = (x) => slabTop(x);
			const image = gl.pane(V, { u: p.u, bottom, hy });
			S.raw(`<image class="art" href="${image.href}" x="${n2(image.x)}" y="${n2(image.y)}" width="${n2(image.w)}" height="${n2(image.h)}" preserveAspectRatio="none"/>`, 1);
			// its outline: the upper and right edges, one stroke (the glass is drawn without thickness)
			const topEdge = along([-HALF, hy], [HALF, hy]).map(([x]) => [x, hy, HZ]);
			const rightEdge = along([0, slabTop(HALF)], [0, HZ], 40).map(([, z]) => [HALF, hy, z]);
			S.raw(`<path d="${line([...rightEdge, ...[...topEdge].reverse()].map(P))}" fill="none" stroke="${DIM}" stroke-width="${EDGE}" stroke-linejoin="round" stroke-linecap="round"/>`, 1.3);
			const ring = [P([-HALF, hy, bottom(-HALF)]), ...rightEdge.map(P), ...[...topEdge].reverse().map(P)];
			S.mark([...ring, ring[0]], EDGE / 2, `the pane ${i}`);
			R.add(hull(ring), `the pane ${i}`);
		}

		// ---- the slab
		{
			const top = ([x, y]) => [x, y, slabTop(x)];
			const Zb = -THICK;
			const sil = [...[...left].reverse(), ...[...back].reverse().slice(1)].map(top).map(P);
			const silhouette = [...sil, P([HALF, hy, Zb]), P([HALF, -hy, Zb]), P([-HALF, -hy, Zb])];
			const id = `${name}-slab-${i}`;
			defs += `<clipPath id="${id}"><path d="${line(silhouette, true)}"/></clipPath>`;
			const image = gl.stone(V, { top: slabTop, Zb, hy });
			S.raw(`<image class="art" href="${image.href}" x="${n2(image.x)}" y="${n2(image.y)}" width="${n2(image.w)}" height="${n2(image.h)}" preserveAspectRatio="none" clip-path="url(#${id})"/>`, 2);
			const nearTop = [...front, ...right.slice(1)].map(top).map(P);
			const d = line(silhouette, true) + line(nearTop) + line([P(top([HALF, -hy])), P([HALF, -hy, Zb])]);
			S.raw(`<path d="${d}" fill="none" stroke="${CUT}" stroke-width="${EDGE}" stroke-linejoin="round"/>`, 2.5);
			S.mark([...silhouette, silhouette[0]], EDGE / 2, `the slab ${i}`);
			R.add(hull(silhouette), `the slab ${i}`);
		}

		// ---- the z axis, up the pane's left edge
		const foot = P([-HALF, hy, slabTop(-HALF)]), tip = P([-HALF, hy, HZ + RISE]);
		check(near(foot[0], tip[0], 1e-9), 'the z axis is not upright on the page');
		S.arrow(foot, tip, { color: INK, width: AXIS, head: AXIS_HEAD, layer: 4, what: `the z axis ${i}` });
		L.push(await placed('z', tip[0] - LABEL_GAP - 0.6, tip[1] + 2, 1, 0.5, INK));

		// ---- one wavelength, under the slab's front lower edge
		const lambda = (2 * Math.PI) / p.w;
		const x0 = -HALF, yb = -hy, zb = -THICK - BAR_DROP;
		const a = P([x0, yb, zb]), b = P([x0 + lambda, yb, zb]);
		check(near(Math.hypot(b[0] - a[0], b[1] - a[1]), lambda * SCALE * Math.hypot(V.c, V.s * V.sf), 1e-9), 'a bar is not a wavelength long');
		S.path([a, b], { color: INK, width: HAIR + 0.15, layer: 3, cap: 'butt', what: `the bar ${i}` });
		for (const e of [a, b]) S.path([[e[0], e[1] - TICK], [e[0], e[1] + TICK]], { color: INK, width: HAIR + 0.15, layer: 3, cap: 'butt', what: `the bar's end ${i}` });
		L.push(await placed('\\lambda', (a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + TICK + LABEL_GAP, 0.5, 0, INK));

		tops.push(P([0, hy, HZ]));

		// ---- the wave that leaves: its wavevector (k, k_z) above the pane, at theta from the vertical
		if (p.wave) {
			const th = Math.asin(p.r);
			const s0 = [0.18, hy, HZ];
			const dir = [Math.sin(th), 0, Math.cos(th)];
			check(near(Math.tan(th), K / p.q, 1e-12), 'the wavevector is not along (k, k_z)');
			const A0p = P(s0), B0p = P([s0[0] + ARROW * dir[0], hy, s0[2] + ARROW * dir[2]]);
			const vec = S.arrow(A0p, B0p, { color: INK, width: VEC, head: VEC_HEAD, layer: 4, what: 'the wavevector' });
			// the vertical, dotted, and the arc from it to the wavevector
			const V1 = P([s0[0], hy, s0[2] + ARROW * 0.95]);
			S.path([A0p, V1], { color: DIM, width: ZERO_LINE + 0.1, dash: ZERO_DASH, cap: 'butt', layer: 3.5, what: 'the vertical' });
			const arc = Array.from({ length: 121 }, (_, j) => { const g = (th * j) / 120; return P([s0[0] + ARC * Math.sin(g), hy, s0[2] + ARC * Math.cos(g)]); });
			S.path(arc, { color: DIM, width: HAIR, layer: 3.5, what: 'the angle' });
			// on the page the arc runs from the vertical's image to the wavevector's image
			const pv = [V1[0] - A0p[0], V1[1] - A0p[1]], pw = [B0p[0] - A0p[0], B0p[1] - A0p[1]];
			const pa = [arc[0][0] - A0p[0], arc[0][1] - A0p[1]], pb = [arc[120][0] - A0p[0], arc[120][1] - A0p[1]];
			check(angle(pv, pa) < 1e-9 && angle(pw, pb) < 1e-9, 'the arc does not meet the vertical and the wavevector');
			const mid = P([s0[0] + (ARC + 0.02) * Math.sin(th / 2), hy, s0[2] + (ARC + 0.02) * Math.cos(th / 2)]);
			L.push(await S.clear('\\theta', mid[0] + 0.5, mid[1] - 0.5, 0, 1, unit([Math.sin(th / 2), -Math.cos(th / 2)]), { color: DIM }));
			L.push(await S.clear('(k, k_z)', vec.B[0] + LABEL_GAP, vec.B[1], 0, 0.5, [1, 0], { color: INK }));
			// the crests on the pane stand at theta from the horizontal: the projection of their direction
			const crest = [Math.cos(th), 0, -Math.sin(th)];
			check(near(crest[0] * dir[0] + crest[2] * dir[2], 0, 1e-15), 'the crests are not at right angles to the wavevector');
			check(near(p.u(0.1, 0.3), p.u(0.1 + 0.2 * crest[0], 0.3 + 0.2 * crest[2]), 1e-12), 'the field changes along a crest');
			check(near(K * crest[0] + p.q * crest[2], 0, 1e-12), 'the field is not constant along a crest');
		}
	}

	// ---- the titles, over the panes
	const titles = ['\\sin\\theta = kc/\\omega = 0.6', 'kc/\\omega = 2,\\ \\ \\kappa = \\sqrt{3}\\,\\omega/c'];
	const highest = Math.min(...S.marks.flatMap((m) => m.pts.map((q) => q[1] - m.r)), ...L.map((l) => l.box.t));
	for (const [i, src] of titles.entries()) L.push(await placed(src, tops[i][0], highest - 5, 0.5, 1, INK));

	S.checkAll(L, 1.5);
	R.check(L);
	window[name + '-numbers'] = { panels: PANELS.map((p) => ({ r: p.r, lambda: (2 * Math.PI) / p.w, kz: p.q, kappa: p.f })) };
	return finish(S, L, [240, 340], defs);
}

/** Renderers by WebGL in the view V (figs/tut-evan-hero.js's, here for a slab of one ripple and an upright pane),
 * each returning an image of a box on the page: `stone`, the slab (its top a mesh whose height is the relief and whose
 * colour mixes the stone toward the accent of the ripple's sign, lit by the studio against a flat top; its near sides
 * the stone under the veil of their light), a JPEG on the stone's mean colour, to be clipped to the slab's outline;
 * and `pane`, the upright glass coloured by the field, a PNG with its opacity. */
function renderer(img) {
	const canvas = document.createElement('canvas');
	const gl = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, premultipliedAlpha: false, preserveDrawingBuffer: true });
	const tex = new THREE.Texture(img);
	tex.colorSpace = THREE.NoColorSpace;
	tex.wrapS = tex.wrapT = THREE.MirroredRepeatWrapping;
	tex.minFilter = THREE.LinearMipmapLinearFilter;
	tex.anisotropy = 8;
	tex.needsUpdate = true;
	const cut = rgb(CUT);
	const stoneMaterial = new THREE.RawShaderMaterial({
		uniforms: { stone: { value: tex }, cut: { value: new THREE.Vector3(cut.r, cut.g, cut.b) } },
		vertexShader: `precision highp float;
			uniform mat4 projectionMatrix; uniform mat4 modelViewMatrix;
			attribute vec3 position; attribute vec2 uv; attribute vec4 tint; attribute vec2 shade;
			varying vec2 vUv; varying vec4 vTint; varying vec2 vShade;
			void main() { vUv = uv; vTint = tint; vShade = shade; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
		fragmentShader: `precision highp float;
			uniform sampler2D stone; uniform vec3 cut;
			varying vec2 vUv; varying vec4 vTint; varying vec2 vShade;
			void main() {
				vec3 c = mix(texture2D(stone, vUv).rgb, vTint.rgb, vTint.a) * vShade.x;
				gl_FragColor = vec4(clamp(mix(c, cut, vShade.y), 0.0, 1.0), 1.0);
			}`,
		side: THREE.DoubleSide
	});
	const glassMaterial = new THREE.RawShaderMaterial({
		vertexShader: `precision highp float;
			uniform mat4 projectionMatrix; uniform mat4 modelViewMatrix;
			attribute vec3 position; attribute vec4 rgba; varying vec4 vc;
			void main() { vc = rgba; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
		fragmentShader: 'precision highp float; varying vec4 vc; void main() { gl_FragColor = vc; }',
		blending: THREE.NoBlending, side: THREE.DoubleSide
	});
	const [orange, blue, glassTint] = [rgb(ACCENT), rgb(ACCENT2), rgb(GLASS_TINT)];
	const grey = mix(orange, blue, 0.5);
	const T = (u, v) => [0.33 * (u + 0.5), 0.33 * (v + 0.5)];

	function draw(V, g, material, { clear, alpha, K = 4 }) {
		const pos = g.attributes.position.array;
		let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity, z0 = Infinity, z1 = -Infinity;
		for (let m = 0; m < pos.length; m += 3) {
			x0 = Math.min(x0, pos[m]); x1 = Math.max(x1, pos[m]); y0 = Math.min(y0, -pos[m + 1]); y1 = Math.max(y1, -pos[m + 1]);
			z0 = Math.min(z0, pos[m + 2]); z1 = Math.max(z1, pos[m + 2]);
		}
		x0 = Math.floor(x0) - 1; y0 = Math.floor(y0) - 1; x1 = Math.ceil(x1) + 1; y1 = Math.ceil(y1) + 1;
		const wpx = (x1 - x0) * K, hpx = (y1 - y0) * K;
		gl.setPixelRatio(1);
		gl.setSize(wpx * SS, hpx * SS, false);
		if (clear) gl.setClearColor(new THREE.Color().setRGB(clear.r, clear.g, clear.b, THREE.SRGBColorSpace), 1);
		else gl.setClearColor(0x000000, 0);
		const scene = new THREE.Scene();
		scene.add(new THREE.Mesh(g, material));
		const cam = new THREE.OrthographicCamera(x0, x1, -y0, -y1, 0.1, 10 + z1 - z0);
		cam.position.set(0, 0, z1 + 5);
		gl.render(scene, cam);
		const out = document.createElement('canvas');
		out.width = wpx; out.height = hpx;
		const ctx = out.getContext('2d');
		ctx.imageSmoothingQuality = 'high';
		ctx.drawImage(canvas, 0, 0, wpx, hpx);
		g.dispose();
		return { href: alpha ? out.toDataURL('image/png') : out.toDataURL('image/jpeg', 0.84), x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
	}

	/** A grid of (n + 1) by (m + 1) vertices at the world points at(i/n, j/m), with attributes. */
	function grid(V, at, attrs, n, m) {
		const pos = [], idx = [], extra = Object.fromEntries(Object.keys(attrs).map((k) => [k, []]));
		for (let j = 0; j <= m; j++) for (let i = 0; i <= n; i++) {
			const p = at(i / n, j / m);
			const [X, Y] = V.at(p);
			pos.push(X, -Y, V.depth(p) * V.scale);
			for (const [k, a] of Object.entries(attrs)) extra[k].push(...a(p));
		}
		for (let j = 0; j < m; j++) for (let i = 0; i < n; i++) {
			const a = j * (n + 1) + i, b = a + 1, c = a + n + 1, d = c + 1;
			idx.push(a, b, c, b, d, c);
		}
		return { pos, idx, extra };
	}

	return {
		stone(V, { top, Zb, hy }) {
			const flat = light(V, [0, 0, 1]);
			const G = grid(V, (s, t) => { const x = -HALF + 2 * HALF * s, y = -hy + 2 * hy * t; return [x, y, top(x)]; }, {
				uv: ([x, y]) => T(x / GRAIN, y / GRAIN),
				tint: ([x]) => {
					const f = ripple(x), t = 1 - Math.exp(-Math.abs(f) / SOFT), c = mix(grey, f >= 0 ? orange : blue, t);
					return [c.r, c.g, c.b, VEIL];
				},
				shade: ([x]) => [1 + LIFT * (light(V, unit([-RELIEF * rippleSlope(x), 0, 1])) / flat - 1), 0]
			}, NX, NY);
			const pos = G.pos, idx = G.idx, uv = G.extra.uv, tint = G.extra.tint, shade = G.extra.shade;
			const push = (p, t, sh) => {
				const [X, Y] = V.at(p);
				pos.push(X, -Y, V.depth(p) * V.scale);
				uv.push(...t); tint.push(0, 0, 0, 0); shade.push(1, sh);
				return pos.length / 3 - 1;
			};
			for (const [edge, nrm, u, n] of [
				[(t) => [-HALF + 2 * HALF * t, -hy], [0, -1, 0], (t) => (2 * HALF * t) / GRAIN, NX],
				[(t) => [HALF, -hy + 2 * hy * t], [1, 0, 0], (t) => (2 * HALF + 2 * hy * t) / GRAIN, 40]
			]) {
				const v = veil(V, nrm), b0 = pos.length / 3;
				for (let i = 0; i <= n; i++) {
					const [x, y] = edge(i / n), z = top(x);
					push([x, y, z], T(u(i / n), 1.6 - z / GRAIN), v);
					push([x, y, Zb], T(u(i / n), 1.6 - Zb / GRAIN), v);
				}
				for (let i = 0; i < n; i++) { const a = b0 + 2 * i; idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); }
			}
			const g = new THREE.BufferGeometry();
			g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
			g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
			g.setAttribute('tint', new THREE.Float32BufferAttribute(tint, 4));
			g.setAttribute('shade', new THREE.Float32BufferAttribute(shade, 2));
			g.setIndex(idx);
			return draw(V, g, stoneMaterial, { clear: rgb(STONE_MEAN), alpha: false, K: KS });
		},
		pane(V, { u, bottom, hy }) {
			const G = grid(V, (s, t) => { const x = -HALF + 2 * HALF * s, z0 = bottom(x); return [x, hy, z0 + (HZ - z0) * t]; }, {
				rgba: ([x, , z]) => {
					const r = FIELD * u(x, z), t = 1 - Math.exp(-((r / GSOFT) ** 2));
					const c = mix(glassTint, r >= 0 ? orange : blue, t);
					return [c.r, c.g, c.b, A0 + (A1 - A0) * t];
				}
			}, NX, NZ);
			const g = new THREE.BufferGeometry();
			g.setAttribute('position', new THREE.Float32BufferAttribute(G.pos, 3));
			g.setAttribute('rgba', new THREE.Float32BufferAttribute(G.extra.rgba, 4));
			g.setIndex(G.idx);
			return draw(V, g, glassMaterial, { alpha: true, K: KG });
		}
	};
}
