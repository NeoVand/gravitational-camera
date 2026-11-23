// The tutorial, chapter 2.7 (tutorial/outside/evanescent.md), its opening figure: a finer ripple fades faster. A slab
// of sandstone whose top carries three corrugations side by side, of crest spacings 4, 2 and 1 (the finest spacing is
// the unit of length), each over a strip 4 units wide, so that the strips hold 1, 2 and 4 whole periods and every
// strip meets its neighbour at the mean: orange where the density is above the mean and blue where it is below, as
// chapter 2.6 colours its slabs (figs/tut-fourier-hero.js). Above it two translucent planes, at the heights z = 1/2
// and 2z = 1 (half and once the finest spacing), carry over each strip the ripple of the potential that its
// corrugation makes, A sin(k (x - x0)) e^{-kh} with A < 0 (eq:sheet): the potential dips over the dense crests. Each
// ripple is drawn as the fraction e^{-kh} of its own size at the slab, times one height E for both planes, so that
// the coarse ripple is plain on both planes, the middle one is as large on the lower plane as the coarse one on the
// upper (kh = pi/2 for both: only kh enters), and the finest is nearly flat on the lower plane (e^{-pi} = 0.043) and
// flat on the upper, where it has faded by e^{2 pi} = 535. An arrow h runs up from the slab at its front left
// corner, through the planes' corners, with ticks at z and 2z.
// Exact: the strips, their spacings and phases; the fades, computed at the true heights; each plane's relief, the
// fraction e^{-kh} of its strip's size times E (measured on the mesh and asserted against e^{-kh} to 1e-9), and so
// the ratios between all six ripples; the sign of the potential's ripple against the density's; the colour of each
// point of a plane, one rule for all six ripples (mixing from the clear glass toward the accent of the density beneath
// as 1 - exp(-(f / 0.3)^2), f the drawn fraction, its opacity growing with it), so that a ripple's colour fades with it
// and equal fades have equal colours. Schematic: E (the height of the planes' ripples), the planes' heights (drawn 2.5
// times their true size, so that the layers stand apart), the height of the slab's relief (the density drawn as a
// height), the slab's depth and thickness, the glass's thickness, and the length of the arrow.
import { Sheet, ORIGIN, finish, checker, placed, near, n2, TICK, HAIR } from './tut-pot-lib.js';
import { View, Regions, hull, veil } from './tut-noise-lib.js';
import { pathOf, NUM } from './tut-prob-lib.js';
import { sprite, THREE, INK, DIM, FAINT, RULE, ACCENT, ACCENT2 } from '../lib.js';

const name = 'tut-evan-hero';
const check = checker(name);

// ---- the mathematics: lengths in units of the finest crests' spacing ----------------------------------------------
export const WIDE = 4;                                     // each strip's width
export const STRIPS = [4, 2, 1].map((spacing, i) => ({ spacing, k: (2 * Math.PI) / spacing, x0: -1.5 * WIDE + i * WIDE }));
export const Z = 0.5;                                      // the sensors' height, z
export const PLANES = [Z, 2 * Z];
const HALF = 1.5 * WIDE;                                   // the slab's half-length along x
/** The strip that holds x (the last one holds its right end). */
const stripOf = (x) => STRIPS[Math.min(2, Math.max(0, Math.floor((x + HALF) / WIDE)))];
/** The density's ripple, in units of its size: + above the mean. */
export const density = (x) => { const s = stripOf(x); return Math.sin(s.k * (x - s.x0)); };
const densitySlope = (x) => { const s = stripOf(x); return s.k * Math.cos(s.k * (x - s.x0)); };
/** The potential's ripple at the height h, as a fraction of its own size at the slab; its sign is the potential's
 * (A < 0), so it is negative over a dense crest. */
export const ripple = (x, h) => -density(x) * Math.exp(-stripOf(x).k * h);
const rippleSlope = (x, h) => -densitySlope(x) * Math.exp(-stripOf(x).k * h);

function mathematics() {
	for (const s of STRIPS) {
		check(near(WIDE / s.spacing, Math.round(WIDE / s.spacing), 1e-12), `the strip of spacing ${s.spacing} holds no whole number of periods`);
		check(near(Math.sin(s.k * WIDE), 0, 1e-12), `the strip of spacing ${s.spacing} does not end at the mean`);
	}
	check(STRIPS[0].spacing / STRIPS[2].spacing === 4 && STRIPS[1].spacing / STRIPS[2].spacing === 2, 'the spacings are not 4 : 2 : 1');
	const fades = STRIPS.map((s) => PLANES.map((h) => Math.exp(-s.k * h)));
	// the finest ripple on the upper plane: kh = 2 pi, a fade of 535, the chapter's number
	check(near(STRIPS[2].k * PLANES[1], 2 * Math.PI, 1e-12) && Math.round(1 / fades[2][1]) === 535, `the finest at 2z: ${1 / fades[2][1]}`);
	// only kh enters: the middle ripple at z is the coarse one at 2z, and the finest at z the middle one at 2z
	check(near(fades[1][0], fades[0][1], 1e-15) && near(fades[2][0], fades[1][1], 1e-15), 'the equal fades');
	// over a dense crest the potential dips (eq:sheet: A = -2 pi G sigma_1 / k)
	check(ripple(STRIPS[0].x0 + 1, Z) < 0 && density(STRIPS[0].x0 + 1) > 0, 'the sign of the potential');
	return { fades };
}

// ---- the drawing -----------------------------------------------------------------------------------------------
const TURN = -12, TILT = 20;          // the view (tut-noise-lib.js, View): degrees about the vertical, above the horizon
const SCALE = 26;                      // points per unit
const DEEP = 2.4;                      // the slab's and the planes' extent in y, units
const THICK = 0.45;                    // the slab's thickness
const RELIEF = 0.05;                   // the slab's relief per unit of density
const E = 0.42;                        // the planes' relief per unit of the fraction e^{-kh} (chosen for the drawing)
const STRETCH = 2.5;                   // the planes' heights are drawn this many times their true size
const GLASS = 0.035;                   // the glass's thickness
const RISE = 0.55;                     // the arrow h reaches this far above the upper plane
const VEIL = 0.64, SOFT = 0.22;        // the slab's colour (figs/tut-fourier-hero.js)
const LIFT = 1.8;                      // the slab relief's shading, against the studio's own
const GLASS_TINT = FAINT;              // the clear glass: this colour at the opacity A0, mixing toward the accent and A1
const A0 = 0.35, A1 = 0.95, GSOFT = 0.3;
const NX = 1440, NY = 12;              // the meshes
const K = 4, KG = 3, SS = 2;           // pixels per point of the rendered stone and glass, and the supersampling
const TOL = 0.01;                      // an edge is a polyline that strays from the exact curve by at most this, points
const CUT = '#2b2418';                 // the stone's ink (figs/tut-blur.js), dark in both themes
const EDGE = 0.4;
const STONE_MEAN = '#d8b47e';          // about the stone's own colour, behind the rendered stone at its rim
const MIN_AIR = 2;                     // the least air between the layers on the page, points

/** The studio's light (lib.js, shadeNormal) on a world normal, in the view V. */
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

export default async function () {
	const nums = mathematics();
	const S = new Sheet(name);
	const R = new Regions(name);
	const L = [];
	const V = new View({ turn: TURN, tilt: TILT, scale: SCALE, o: [0, 0] });
	const mid = V.at([0, 0, (STRETCH * PLANES[1] - THICK) / 2]);
	V.o = [ORIGIN - mid[0], ORIGIN - mid[1]];
	const P = (p) => V.at(p);
	const hy = DEEP / 2;

	// the view never folds a relief over: its slope along the line of sight stays under half the line of sight's own
	const sight = Math.abs(V.s);                            // how much of a slope along x runs along the line of sight
	let steep = 0;
	for (let i = 0; i <= NX; i++) {
		const x = -HALF + (2 * HALF * i) / NX;
		steep = Math.max(steep, RELIEF * Math.abs(densitySlope(x)), ...PLANES.map((h) => E * Math.abs(rippleSlope(x, h))));
	}
	check(steep * sight < 0.5 * Math.tan((TILT * Math.PI) / 180), `a relief's slope ${steep} folds over in the view`);

	// ---- the surfaces: the slab's top and the two planes
	const slabTop = (x) => RELIEF * density(x);
	const planeTop = (h) => (x) => STRETCH * h + E * ripple(x, h);
	// each plane's drawn relief is E e^{-kh} of its strip's size, at every vertex of its mesh
	const measured = STRIPS.map(() => PLANES.map(() => 0));
	for (let i = 0; i <= NX; i++) {
		const x = -HALF + (2 * HALF * i) / NX, s = STRIPS.indexOf(stripOf(x));
		PLANES.forEach((h, j) => { measured[s][j] = Math.max(measured[s][j], Math.abs(planeTop(h)(x) - STRETCH * h) / E); });
	}
	STRIPS.forEach((s, i) => PLANES.forEach((h, j) => check(near(measured[i][j], nums.fades[i][j], 1e-9), `the relief over the strip of spacing ${s.spacing} at ${h}: ${measured[i][j]}`)));
	// the layers keep their air on the page: the lower plane over the slab, the upper over the lower
	let air = Infinity;
	for (let i = 0; i <= NX; i++) {
		const x = -HALF + (2 * HALF * i) / NX;
		air = Math.min(air, planeTop(PLANES[0])(x) - GLASS - slabTop(x), planeTop(PLANES[1])(x) - GLASS - planeTop(PLANES[0])(x));
	}
	check(air * SCALE * V.cf >= MIN_AIR, `the layers are ${air * SCALE * V.cf} pt apart`);

	const stone = await sprite('/figures3d/sprites/slab.jpg');
	const img = new Image(); img.src = stone.href; await img.decode();
	const gl = renderer(img);
	let defs = '';
	const along = (a, b, n = NX) => Array.from({ length: n + 1 }, (_, i) => [a[0] + ((b[0] - a[0]) * i) / n, a[1] + ((b[1] - a[1]) * i) / n]);
	const front = along([-HALF, -hy], [HALF, -hy]), right = along([HALF, -hy], [HALF, hy], 40);
	const back = along([HALF, hy], [-HALF, hy]), left = along([-HALF, hy], [-HALF, -hy], 40);

	// ---- the slab
	{
		const top = ([x, y]) => [x, y, slabTop(x)];
		const Zb = -THICK;
		// the silhouette: up the left edge of the top, along the back, down the back right corner, back along the bottom
		const sil = [...[...left].reverse(), ...[...back].reverse().slice(1)].map(top).map(P);
		const silhouette = [...sil, P([HALF, hy, Zb]), P([HALF, -hy, Zb]), P([-HALF, -hy, Zb])];
		const id = `${name}-slab`;
		defs += `<clipPath id="${id}"><path d="${line(silhouette, true)}"/></clipPath>`;
		const image = gl.stone(V, { top: slabTop, Zb, hy });
		S.raw(`<image class="art" href="${image.href}" x="${n2(image.x)}" y="${n2(image.y)}" width="${n2(image.w)}" height="${n2(image.h)}" preserveAspectRatio="none" clip-path="url(#${id})"/>`, 1);
		const nearTop = [...front, ...right.slice(1)].map(top).map(P);
		const d = line(silhouette, true) + line(nearTop) + line([P(top([HALF, -hy])), P([HALF, -hy, Zb])]);
		S.raw(`<path d="${d}" fill="none" stroke="${CUT}" stroke-width="${EDGE}" stroke-linejoin="round"/>`, 1.5);
		S.mark([...silhouette, silhouette[0]], EDGE / 2, 'the slab');
		R.add(hull(silhouette), 'the slab');
	}

	// ---- the planes, the lower first
	PLANES.forEach((h, j) => {
		const f = planeTop(h);
		const top = ([x, y]) => [x, y, f(x)];
		const under = ([x, y]) => [x, y, f(x) - GLASS];
		const layer = 2 + j;
		// the far edges, beneath the glass
		S.raw(`<path d="${line([...back, ...left.slice(1)].map(top).map(P))}" fill="none" stroke="${DIM}" stroke-width="${EDGE}" stroke-linejoin="round" stroke-linecap="round"/>`, layer + 0.3);
		const image = gl.glass(V, { f, h, hy });
		S.raw(`<image class="art" href="${image.href}" x="${n2(image.x)}" y="${n2(image.y)}" width="${n2(image.w)}" height="${n2(image.h)}" preserveAspectRatio="none"/>`, layer + 0.1);
		// the glass's thickness along the near edges, and the outline of its top there
		for (const s of [front, right]) S.raw(`<path d="${line([...s.map(top), ...s.map(under).reverse()].map(P), true)}" fill="${RULE}"/>`, layer + 0.2);
		const nearEdge = [...front, ...right.slice(1)];
		S.raw(`<path d="${line(nearEdge.map(top).map(P))}" fill="none" stroke="${DIM}" stroke-width="${EDGE}" stroke-linejoin="round" stroke-linecap="round"/>`, layer + 0.3);
		const ring = [...left, ...front.slice(1), ...right.slice(1), ...back.slice(1)].map(top).map(P);
		S.mark(ring, EDGE / 2, `the plane at ${h}`);
		R.add(hull([...ring, ...front.map(under).map(P)]), `the plane at ${h}`);
	});

	// ---- the arrow h, up from the slab's front left corner through the planes' corners, with ticks at z and 2z
	const foot = P([-HALF, -hy, slabTop(-HALF)]), tip = P([-HALF, -hy, STRETCH * PLANES[1] + RISE]);
	check(near(foot[0], tip[0], 1e-9), 'the arrow h is not upright on the page');
	S.arrow(foot, tip, { color: INK, layer: 6, what: 'the arrow h' });
	for (const [h, src] of [[PLANES[0], 'z'], [PLANES[1], '2z']]) {
		const y = P([-HALF, -hy, STRETCH * h])[1];
		check(near(planeTop(h)(-HALF), STRETCH * h, 1e-12), 'a plane\'s corner is off its height');
		S.path([[foot[0] - TICK, y], [foot[0], y]], { color: INK, width: HAIR, layer: 6, cap: 'butt', what: `the tick at ${src}` });
		L.push(await placed(src, foot[0] - TICK - NUM, y, 1, 0.5, INK));
	}
	L.push(await placed('h', foot[0] - TICK - NUM, tip[1] + 1.2, 1, 0.5, INK));

	S.checkAll(L, 1.5);
	R.check(L);
	window.tutEvanHero = { fades: nums.fades, measured, air: air * SCALE * V.cf, steep: steep * sight };
	return finish(S, L, [240, 340], defs);
}

/** Renderers by WebGL in the view V, each returning an image of a box on the page: `stone`, the slab (its top a mesh
 * whose height is the relief and whose colour mixes the stone toward the accent of the density's sign, lit by the
 * studio against a flat top; its near sides the stone under the veil of their light), a JPEG on the stone's own mean
 * colour, to be clipped to the slab's outline; and `glass`, a plane (its colour and opacity by the rule above, lit as the
 * slab's top but softened a quarter), a PNG with its opacity. */
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
	const grey = mix(orange, blue, 0.5);           // the slab's colour at the mean, halfway between the accents
	const T = (u, v) => [0.33 * (u + 0.5), 0.33 * (v + 0.5)];

	/** Draw the triangles (page coordinates, depth toward the viewer) and return the image of their box. */
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

	function grid(V, f, attrs, n = NX, m = NY, hy) {
		const pos = [], idx = [], extra = Object.fromEntries(Object.keys(attrs).map((k) => [k, []]));
		for (let j = 0; j <= m; j++) for (let i = 0; i <= n; i++) {
			const x = -HALF + (2 * HALF * i) / n, y = -hy + (2 * hy * j) / m, p = [x, y, f(x)];
			const [X, Y] = V.at(p);
			pos.push(X, -Y, V.depth(p) * V.scale);
			for (const [k, a] of Object.entries(attrs)) extra[k].push(...a(x, y));
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
			const G = grid(V, top, {
				uv: (x, y) => T(x / 4, y / 4),
				tint: (x) => {
					const f = density(x), t = 1 - Math.exp(-Math.abs(f) / SOFT), c = mix(grey, f >= 0 ? orange : blue, t);
					return [c.r, c.g, c.b, VEIL];
				},
				shade: (x) => [1 + LIFT * (light(V, unit([-RELIEF * densitySlope(x), 0, 1])) / flat - 1), 0]
			}, NX, NY, hy);
			const pos = G.pos, idx = G.idx, uv = G.extra.uv, tint = G.extra.tint, shade = G.extra.shade;
			const push = (p, t, sh) => {
				const [X, Y] = V.at(p);
				pos.push(X, -Y, V.depth(p) * V.scale);
				uv.push(...t); tint.push(0, 0, 0, 0); shade.push(1, sh);
				return pos.length / 3 - 1;
			};
			// the near sides: the front (y = -hy) and the right (x = HALF), each a strip under the top's edge
			for (const [edge, nrm, u, n] of [
				[(t) => [-HALF + 2 * HALF * t, -hy], [0, -1, 0], (t) => (2 * HALF * t) / 4, NX],
				[(t) => [HALF, -hy + 2 * hy * t], [1, 0, 0], (t) => (2 * HALF + 2 * hy * t) / 4, 40]
			]) {
				const v = veil(V, nrm), b0 = pos.length / 3;
				for (let i = 0; i <= n; i++) {
					const [x, y] = edge(i / n), z = top(x);
					push([x, y, z], T(u(i / n), 1.6 - z / 4), v);
					push([x, y, Zb], T(u(i / n), 1.6 - Zb / 4), v);
				}
				for (let i = 0; i < n; i++) { const a = b0 + 2 * i; idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); }
			}
			const g = new THREE.BufferGeometry();
			g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
			g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
			g.setAttribute('tint', new THREE.Float32BufferAttribute(tint, 4));
			g.setAttribute('shade', new THREE.Float32BufferAttribute(shade, 2));
			g.setIndex(idx);
			return draw(V, g, stoneMaterial, { clear: rgb(STONE_MEAN), alpha: false, K });
		},
		glass(V, { f, h, hy }) {
			const flat = light(V, [0, 0, 1]);
			const G = grid(V, f, {
				rgba: (x) => {
					// the colour of the density beneath, by the size of the potential's ripple here
					const r = ripple(x, h), t = 1 - Math.exp(-((r / GSOFT) ** 2));
					const c = mix(glassTint, density(x) >= 0 ? orange : blue, t);
					const s = 1 + 0.75 * (light(V, unit([-E * rippleSlope(x, h), 0, 1])) / flat - 1);
					return [Math.min(1, c.r * s), Math.min(1, c.g * s), Math.min(1, c.b * s), A0 + (A1 - A0) * t];
				}
			}, NX, NY, hy);
			const g = new THREE.BufferGeometry();
			g.setAttribute('position', new THREE.Float32BufferAttribute(G.pos, 3));
			g.setAttribute('rgba', new THREE.Float32BufferAttribute(G.extra.rgba, 4));
			g.setIndex(G.idx);
			return draw(V, g, glassMaterial, { alpha: true, K: KG });
		}
	};
}
