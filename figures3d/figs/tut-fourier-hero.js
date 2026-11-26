// The tutorial, section 2.6 (tutorial/outside/fourier.md), its opening figure: a patchy pattern is a sum of ripples.
// Left, a slab of sandstone whose top carries a patchy relief of density, measured from the mean: orange where the
// density is above the mean and blue where it is below, as section 3.2 colours its maps. To its right, an equals sign
// and three thinner slabs, each corrugated by one ripple F cos(k . a + alpha): a coarse one whose crests run along a
// diagonal, a medium one whose crests run across, and a fine one whose crests run along. On each, its wavevector k is
// an arrow across the crests, of length in proportion to |k| = 2 pi over the spacing of the crests; beside each, a
// bar in proportion to its size F.
// Exact: the patchy relief, the pointwise sum of the three ripples (asserted at every vertex of the mesh), its heights
// and its colours; each ripple's relief and colour, on one rule for all four slabs (a colour over the stone at one share,
// its hue turning from the colour halfway between the two accents toward the accent as 1 - exp(-|f| / 0.3 f_max), f_max the
// patchy slab's largest density, so that the colour keeps its lightness across the mean and no seam marks it); the
// directions of the arrows (along k, at right angles to the crests) and the ratios of their lengths and of the bars'.
// The three wavevectors are 2 pi / D times (1, 1), (0, 2) and (4, 0), with D the side of the slab, so that each ripple
// repeats across the slab and the pattern's mean over it is zero (asserted). Schematic: the height of the relief (the
// density drawn as a height, its largest slope kept under half the view's own), the slabs' thickness, the scale of the
// arrows and of the bars, the contrast of the relief's shading (1.8 times the studio's), and the thin slabs drawn
// smaller than the patchy one.
import { Sheet, ORIGIN, finish, checker, placed, near, n2 } from './tut-pot-lib.js';
import { View, Regions, hull, veil } from './tut-noise-lib.js';
import { pathOf } from './tut-prob-lib.js';
import { sprite, THREE, INK, DIM, ACCENT, ACCENT2 } from '../lib.js';

const name = 'tut-fourier-hero';
const check = checker(name);

// ---- the mathematics: lengths in units of the slab's side D -------------------------------------------------------
export const RIPPLES = [
	{ n: [1, 1], F: 1, alpha: 0.5, name: 'coarse' },
	{ n: [0, 2], F: 0.6, alpha: 2.2, name: 'medium' },
	{ n: [4, 0], F: 0.3, alpha: -0.8, name: 'fine' }
];
RIPPLES.forEach((r) => { r.k = r.n.map((m) => 2 * Math.PI * m); r.size = Math.hypot(...r.k); r.spacing = (2 * Math.PI) / r.size; });
/** One ripple at (x, y), the slab's centre at the origin, and its gradient. */
const wave = (r) => (x, y) => r.F * Math.cos(r.k[0] * x + r.k[1] * y + r.alpha);
const slope = (r) => (x, y) => { const s = -r.F * Math.sin(r.k[0] * x + r.k[1] * y + r.alpha); return [s * r.k[0], s * r.k[1]]; };
export const patchy = (x, y) => RIPPLES.reduce((s, r) => s + wave(r)(x, y), 0);
const patchySlope = (x, y) => RIPPLES.reduce((s, r) => { const g = slope(r)(x, y); return [s[0] + g[0], s[1] + g[1]]; }, [0, 0]);

// ---- the drawing ---------------------------------------------------------------------------------------------
const TURN = -24, TILT = 40;              // the view (tut-noise-lib.js, View): degrees about the vertical, above the horizon
const BIG = 124, SMALL = 70;              // points per side: the patchy slab, the ripples
const THICK = [0.2, 0.075];               // the slabs' thickness, in sides
const RELIEF = 0.016;                     // the relief's height per unit of density, in sides
const LIFT = 1.8;                         // the relief's shading, against the studio's own
const VEIL = 0.64;                        // the share of the density's colour over the stone of the top, everywhere
const SOFT = 0.22;                        // the colour turns from the neutral toward the accent as 1 - exp(-|f| / (SOFT top))
const GRID = 300;                         // the mesh: cells along a side of the top
const ARROW = 0.029;                      // an arrow's length per unit of |k|, in sides
const BAR = 12;                           // a bar's length per unit of F, points: the bar spans 2F, trough to crest
const K = 4, SS = 2;                      // pixels per point of the rendered stone, and the supersampling
const CUT = '#2b2418';                    // the stone's ink (figs/tut-blur.js), dark in both themes
const EDGE = 0.4;
const SIGN = 11;                          // the size of the equals and plus signs
const STONE_MEAN = '#d8b47e';             // about the stone's own colour, behind the rendered stone at its rim

function mathematics(V) {
	// the patchy pattern's mean over the slab is zero, by the midpoint rule (exact for these ripples)
	let mean = 0;
	const m = 400;
	for (let i = 0; i < m; i++) for (let j = 0; j < m; j++) mean += patchy(-0.5 + (i + 0.5) / m, -0.5 + (j + 0.5) / m);
	check(Math.abs(mean / (m * m)) < 1e-12, `the mean is ${mean / (m * m)}`);
	// the crests: each ripple is constant along the direction at right angles to k
	for (const r of RIPPLES) {
		const u = [-r.k[1] / r.size, r.k[0] / r.size];
		check(near(wave(r)(0.13 + 0.3 * u[0], -0.21 + 0.3 * u[1]), wave(r)(0.13, -0.21), 1e-12), `${r.name}: the crests are not across k`);
		check(near(r.spacing * r.size, 2 * Math.PI, 1e-12), `${r.name}: the spacing`);
	}
	check(RIPPLES[0].spacing > RIPPLES[1].spacing && RIPPLES[1].spacing > RIPPLES[2].spacing, 'coarse, medium, fine');
	// the largest density and the largest slope, on a fine grid
	let top = 0, steep = 0;
	for (let i = 0; i <= 600; i++) for (let j = 0; j <= 600; j++) {
		const x = -0.5 + i / 600, y = -0.5 + j / 600;
		top = Math.max(top, Math.abs(patchy(x, y)));
		steep = Math.max(steep, Math.hypot(...patchySlope(x, y)) * RELIEF);
	}
	// the relief never folds over in the view: its slope stays under half the slope of the line of sight
	check(steep < 0.5 * Math.tan((TILT * Math.PI) / 180), `the relief's slope ${steep} is too steep for the view`);
	return { top, steep };
}

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

export default async function () {
	const V0 = new View({ turn: TURN, tilt: TILT, scale: 1, o: [0, 0] });
	const nums = mathematics(V0);
	const S = new Sheet(name);
	const R = new Regions(name);
	const L = [];
	const stone = await sprite('/figures3d/sprites/slab.jpg');
	const img = new Image(); img.src = stone.href; await img.decode();
	const gl = renderer(img);

	// ---- the slabs: where they stand on the page
	const zoneHeight = (scale, thick, F) => scale * (V0.sf * (Math.abs(V0.c) + Math.abs(V0.s)) + (thick + 2 * F * RELIEF) * V0.cf);
	const zoneWidth = (scale) => scale * (Math.abs(V0.c) + Math.abs(V0.s));
	const GAP = 13;                                         // between the ripples' slabs, for the plus signs
	const hs = RIPPLES.map((r) => zoneHeight(SMALL, THICK[1], r.F));
	const column = hs.reduce((a, b) => a + b, 0) + 2 * GAP;
	const wBig = zoneWidth(BIG), wSmall = zoneWidth(SMALL), EQ = 28;
	const xBig = ORIGIN - (wBig + EQ + wSmall) / 2 + wBig / 2, xSmall = xBig + wBig / 2 + EQ + wSmall / 2;
	const slabs = [{ scale: BIG, thick: THICK[0], f: patchy, g: patchySlope, cx: xBig, cy: ORIGIN, what: 'the patchy slab', seed: 0 }];
	let yy = ORIGIN - column / 2;
	RIPPLES.forEach((r, i) => {
		slabs.push({ scale: SMALL, thick: THICK[1], f: wave(r), g: slope(r), cx: xSmall, cy: yy + hs[i] / 2, what: `the ${r.name} slab`, ripple: r, seed: i + 1 });
		yy += hs[i] + GAP;
	});
	// the relief of the patchy slab is the sum of the three, at every vertex of its mesh
	for (let i = 0; i <= GRID; i += 3) for (let j = 0; j <= GRID; j += 3) {
		const x = -0.5 + i / GRID, y = -0.5 + j / GRID;
		check(near(patchy(x, y), RIPPLES.reduce((s, r) => s + wave(r)(x, y), 0), 1e-12), 'the patchy relief is not the sum');
	}

	let defs = '';
	for (const s of slabs) {
		// the view, centred on the slab's middle (half its thickness down)
		const V = new View({ turn: TURN, tilt: TILT, scale: s.scale, o: [0, 0] });
		const mid = V.at([0, 0, -s.thick / 2]);
		V.o = [s.cx - mid[0], s.cy - mid[1]];
		s.V = V;
		const top = (x, y) => [x, y, RELIEF * s.f(x, y)];
		// the outline: around the top's far edges, down the back corner, along the near bottom edges and up
		const N = 600, along = (a, b) => Array.from({ length: N + 1 }, (_, i) => [a[0] + ((b[0] - a[0]) * i) / N, a[1] + ((b[1] - a[1]) * i) / N]);
		const left = along([-0.5, -0.5], [-0.5, 0.5]), back = along([-0.5, 0.5], [0.5, 0.5]);
		const right = along([0.5, 0.5], [0.5, -0.5]), front = along([0.5, -0.5], [-0.5, -0.5]);
		const Z = -s.thick;
		const rim = [...left, ...back.slice(1)].map(([x, y]) => V.at(top(x, y)));
		const outline = [...rim, V.at([0.5, 0.5, Z]), V.at([0.5, -0.5, Z]), V.at([-0.5, -0.5, Z])];
		const id = `${name}-clip${s.seed}`;
		defs += `<clipPath id="${id}"><path d="${pathOf(outline)}"/></clipPath>`;
		// ---- the stone, rendered
		const image = gl(V, s, nums.top);
		S.raw(`<image class="art" href="${image.href}" x="${n2(image.x)}" y="${n2(image.y)}" width="${n2(image.w)}" height="${n2(image.h)}" preserveAspectRatio="none" clip-path="url(#${id})"/>`, 1);
		// ---- its edges, each once: the outline, the top's near edges, and the near upright edge
		const nearTop = [...right, ...front.slice(1)].map(([x, y]) => V.at(top(x, y)));
		const d = pathOf(outline) + pathOf(nearTop, false) + pathOf([V.at(top(0.5, -0.5)), V.at([0.5, -0.5, Z])], false);
		S.raw(`<path d="${d}" fill="none" stroke="${CUT}" stroke-width="${EDGE}" stroke-linejoin="round"/>`, 2);
		S.mark([...outline, outline[0]], EDGE / 2, `${s.what}'s outline`);
		R.add(hull(outline), s.what);
		s.outline = outline;
	}

	// ---- on each ripple: its wavevector, an arrow across the crests through the slab's centre, on the mean level
	for (const s of slabs.filter((t) => t.ripple)) {
		const r = s.ripple, u = r.k.map((v) => v / r.size), half = (ARROW * r.size) / 2;
		check(half < 0.42, `${r.name}: the arrow leaves the slab`);
		const a = s.V.at([-u[0] * half, -u[1] * half, 0]), b = s.V.at([u[0] * half, u[1] * half, 0]);
		S.arrow(a, b, { color: CUT, width: 0.7, head: 4.2, layer: 3, what: `${r.name}'s arrow` });
	}
	// the arrows' lengths are in proportion to |k|
	const lengths = RIPPLES.map((r) => ARROW * r.size);
	check(near(lengths[2] / lengths[0], RIPPLES[2].size / RIPPLES[0].size, 1e-12), 'the arrows\' ratio');

	// ---- beside each ripple: a bar from trough to crest, in proportion to its size, level with the slab's middle
	const barX = Math.max(...slabs.slice(1).map((s) => Math.max(...s.outline.map((p) => p[0])))) + 7;
	for (const s of slabs.filter((t) => t.ripple)) {
		const yc = s.cy, h = BAR * s.ripple.F;
		S.path([[barX, yc + h], [barX, yc - h]], { color: DIM, width: 0.75, layer: 2, cap: 'butt', what: `${s.ripple.name}'s bar` });
		for (const y of [yc + h, yc - h]) S.path([[barX - 1.8, y], [barX + 1.8, y]], { color: DIM, width: 0.45, layer: 2, cap: 'butt', what: `${s.ripple.name}'s bar's end` });
	}

	// ---- the signs: equals between the patchy slab and the column, plus between the ripples
	const bigRight = Math.max(...slabs[0].outline.map((p) => p[0])), smallLeft = Math.min(...slabs[1].outline.map((p) => p[0]));
	L.push(await placed('=', (bigRight + smallLeft) / 2, ORIGIN, 0.5, 0.5, INK, SIGN));
	for (let i = 1; i < 3; i++) {
		const above = Math.max(...slabs[i].outline.map((p) => p[1])), below = Math.min(...slabs[i + 1].outline.map((p) => p[1]));
		L.push(await placed('+', xSmall, (above + below) / 2, 0.5, 0.5, INK, SIGN));
	}

	S.checkAll(L, 1.5);
	R.check(L);
	window.tutFourierHero = { ...nums, spacings: RIPPLES.map((r) => r.spacing), sizes: RIPPLES.map((r) => r.size) };
	return finish(S, L, [240, 340], defs);
}

/** A renderer of a slab's stone by WebGL, in the slab's own view: the top a mesh whose height is the relief and whose
 * colour mixes the stone toward the accent of the density's sign, lit by the studio against a flat top; the near
 * sides the stone under the veil of their light (tut-noise-lib.js, veil). Returns a JPEG of the slab's box on the
 * page, on the stone's own mean colour, to be clipped to the slab's outline. */
function renderer(img) {
	const canvas = document.createElement('canvas');
	const gl = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
	const tex = new THREE.Texture(img);
	tex.colorSpace = THREE.NoColorSpace;
	tex.wrapS = tex.wrapT = THREE.MirroredRepeatWrapping;
	tex.minFilter = THREE.LinearMipmapLinearFilter;
	tex.anisotropy = 8;
	tex.needsUpdate = true;
	const cut = rgb(CUT);
	const material = new THREE.RawShaderMaterial({
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
	const [orange, blue] = [rgb(ACCENT), rgb(ACCENT2)];
	// the colour of the mean: halfway between the two accents, a neutral of their lightness that leans to neither
	const grey = { r: (orange.r + blue.r) / 2, g: (orange.g + blue.g) / 2, b: (orange.b + blue.b) / 2 };
	return (V, s, top) => {
		const pos = [], uv = [], tint = [], shade = [], idx = [];
		const flat = light(V, [0, 0, 1]);
		const off = 0.27 * s.seed;                               // each slab its own piece of the stone
		const T = (u, v) => [0.5 * (u + 0.5) + off, 0.5 * (v + 0.5) + 0.13 * s.seed];
		const push = (p, t, c, sh) => {
			const [X, Y] = V.at(p);
			pos.push(X, -Y, V.depth(p) * V.scale);
			uv.push(...t); tint.push(...c); shade.push(...sh);
			return pos.length / 3 - 1;
		};
		// the top
		const n = GRID, base = pos.length / 3;
		for (let j = 0; j <= n; j++) for (let i = 0; i <= n; i++) {
			const x = -0.5 + i / n, y = -0.5 + j / n, f = s.f(x, y), [gx, gy] = s.g(x, y);
			// the hue turns from the neutral toward the accent at one share over the stone, so that the colour keeps
			// its lightness across the mean and no seam marks it (mixed in sRGB, as the page mixes)
			const t = 1 - Math.exp(-Math.abs(f) / (SOFT * top)), a = f >= 0 ? orange : blue;
			const c = { r: grey.r + (a.r - grey.r) * t, g: grey.g + (a.g - grey.g) * t, b: grey.b + (a.b - grey.b) * t };
			// the studio's light on the relief against that on a flat top, its contrast raised by LIFT so that a relief
			// low enough never to fold over in the view still reads
			const lit = 1 + LIFT * (light(V, unit([-RELIEF * gx, -RELIEF * gy, 1])) / flat - 1);
			push([x, y, RELIEF * f], T(x, y), [c.r, c.g, c.b, VEIL], [lit, 0]);
		}
		for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
			const a = base + j * (n + 1) + i, b = a + 1, c = a + n + 1, d = c + 1;
			idx.push(a, b, c, b, d, c);
		}
		// the near sides: the front (y = -1/2) and the right (x = 1/2), each a strip under the top's edge
		for (const [edge, nrm, u] of [
			[(t) => [-0.5 + t, -0.5], [0, -1, 0], (t) => t],
			[(t) => [0.5, -0.5 + t], [1, 0, 0], (t) => 1 + t]
		]) {
			const v = veil(V, nrm), b0 = pos.length / 3;
			for (let i = 0; i <= n; i++) {
				const [x, y] = edge(i / n), z = RELIEF * s.f(x, y);
				push([x, y, z], T(u(i / n) - 0.5, 1.2 + z), [0, 0, 0, 0], [1, v]);
				push([x, y, -s.thick], T(u(i / n) - 0.5, 1.2 + s.thick), [0, 0, 0, 0], [1, v]);
			}
			for (let i = 0; i < n; i++) { const a = b0 + 2 * i; idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); }
		}
		const g = new THREE.BufferGeometry();
		g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
		g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
		g.setAttribute('tint', new THREE.Float32BufferAttribute(tint, 4));
		g.setAttribute('shade', new THREE.Float32BufferAttribute(shade, 2));
		g.setIndex(idx);
		const scene = new THREE.Scene();
		scene.add(new THREE.Mesh(g, material));
		let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
		for (let m = 0; m < pos.length; m += 3) { x0 = Math.min(x0, pos[m]); x1 = Math.max(x1, pos[m]); y0 = Math.min(y0, -pos[m + 1]); y1 = Math.max(y1, -pos[m + 1]); }
		x0 = Math.floor(x0) - 1; y0 = Math.floor(y0) - 1; x1 = Math.ceil(x1) + 1; y1 = Math.ceil(y1) + 1;
		const wpx = (x1 - x0) * K, hpx = (y1 - y0) * K;
		gl.setPixelRatio(1);
		gl.setSize(wpx * SS, hpx * SS, false);
		gl.setClearColor(new THREE.Color().setRGB(...['r', 'g', 'b'].map((k) => rgb(STONE_MEAN)[k]), THREE.SRGBColorSpace), 1);
		const zs = pos.filter((_, m) => m % 3 === 2);
		const cam = new THREE.OrthographicCamera(x0, x1, -y0, -y1, 0.1, 10 + Math.max(...zs) - Math.min(...zs));
		cam.position.set(0, 0, Math.max(...zs) + 5);
		gl.render(scene, cam);
		const out = document.createElement('canvas');
		out.width = wpx; out.height = hpx;
		const ctx = out.getContext('2d');
		ctx.imageSmoothingQuality = 'high';
		ctx.drawImage(canvas, 0, 0, wpx, hpx);
		g.dispose();
		return { href: out.toDataURL('image/jpeg', 0.84), x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
	};
}
