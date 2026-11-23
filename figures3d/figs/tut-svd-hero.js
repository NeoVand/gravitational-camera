// The tutorial, chapter 3.4 (tutorial/noise/symmetric-matrices.md), its opening figure: an endless flat camera splits a
// scene into ripples, each with its own gain. A row of seven slabs of sandstone, each corrugated by one ripple of surface
// density sin(k x), measured from the mean (orange where the density is above it and blue where it is below, as
// chapter 2.6's slabs, figs/tut-fourier-hero.js): from a broad swell on the left to fine crests on the right, q = kz =
// 1, 2, 4, 6, 8, 10 and 12, z the camera's height. Above each slab a bar whose height is its gain against the best
// ripple's, q e^{1 - q}, on a log scale, from 1 at q = 1 down to 2.0 x 10^-4 at q = 12. A line across the bars marks
// the noise at SNR = 10^3: the whitened gain pi SNR q e^{-q} is one there, at q e^{1 - q} = e / (pi SNR) = 8.7 x 10^-4,
// which the gain crosses at the cut-off q_c = 10.4. The slab whose bar ends below the line (q = 12) is drawn faded.
// Exact: the ripples (each slab's relief and colour, on one rule for all seven), their wavenumbers in proportion to q
// (each slab is 3 z wide, so that it holds 3q / 2 pi crests), the gains and the bars' heights on the log scale, the
// noise's line and the cut-off (asserted against the chapter's 1/810 at q = 10, 1/(8.9 x 10^6) at q = 20 and q_c = 10.4,
// and the comment's 2 x 10^-4 at q = 12). Schematic: the height of the relief (the density drawn as a height, the same
// for every slab), the slabs' thickness, the contrast of the relief's shading (1.6 times the studio's), and the view.
import { Sheet, ORIGIN, finish, checker, placed, near, n2 } from './tut-pot-lib.js';
import { View, Regions, hull, veil } from './tut-noise-lib.js';
import { pathOf, yAxis, Plot, LABEL_GAP } from './tut-prob-lib.js';
import { sprite, THREE, INK, DIM, ACCENT, ACCENT2 } from '../lib.js';
import { gain, cutoff, SNR } from './tut-svd-lib.js';
import { longest } from './tut-fourier-lib.js';

const name = 'tut-svd-hero';
const check = checker(name);

export const QS = [1, 2, 4, 6, 8, 10, 12];
const WIDE = 3;                           // a slab's side, in units of z
const TURN = -10, TILT = 48;              // the view (tut-noise-lib.js, View): degrees about the vertical, above the horizon
const SC = 33;                            // points per side of a slab
const PITCH = 42.4;                       // from one slab's centre to the next, points
const THICK = 0.12;                       // the slabs' thickness, in sides
const RELIEF = 0.04;                      // the relief's height from mean to crest, in sides
const LIFT = 1.6;                         // the relief's shading, against the studio's own
const VEIL = 0.64;                        // the share of the density's colour over the stone of the top
const SOFT = 0.22;                        // the colour turns toward the accent as 1 - exp(-|f| / SOFT)
const GRID = 480;                         // the mesh: cells along x
const K = 4, SS = 2;                      // pixels per point of the rendered stone, and the supersampling
const CUT = '#2b2418';                    // the stone's ink (figs/tut-blur.js), dark in both themes
const EDGE = 0.4;
const STONE_MEAN = '#d8b47e';             // about the stone's own colour, behind the rendered stone at its rim
const FADE = 0.4;                         // the faded slab's opacity
const BAR_W = 5;                          // a bar's width, points
const BARS_H = 76;                        // the bars' chart: its height, points, for
const LOG = [-4, 0.06];                   // log10 of the gain, from its foot to its top
const GAP = 12;                           // from the bars' foot to the slabs' tops
const FAINT_BAR = 0.38;                   // the faded bar's opacity

/** The ripple on a slab of side 1 (x across, from -1/2 to 1/2): sin(k x), k = q / z with z = 1 / WIDE sides, so that
 * every slab, the broadest too, rises from below the mean on its left to above it on its right. */
const ripple = (q) => (x) => Math.sin(q * WIDE * x);
const slope = (q) => (x) => q * WIDE * Math.cos(q * WIDE * x);

function mathematics() {
	const qc = cutoff(SNR);
	check(qc.toFixed(1) === '10.4', `the cut-off is ${qc}, not 10.4`);
	const level = Math.E / (Math.PI * SNR);              // q e^{1-q} where pi SNR q e^{-q} = 1
	check(near(gain(qc), level, 1e-12), 'the noise\'s line is not the gain at the cut-off');
	check(Math.round(1 / gain(10)) === 810 && (1 / gain(20) / 1e6).toFixed(1) === '8.9', 'the chapter\'s 1/810 and 1/(8.9 x 10^6)');
	check(gain(1) === 1 && gain(12).toPrecision(2) === '0.00020', `the gain at q = 12 is ${gain(12)}`);
	// the gain is largest at q = 1, where its derivative (1 - q) e^{1 - q} vanishes
	check(QS.every((q, i) => i === 0 || gain(q) < gain(QS[i - 1])), 'the gains do not fall');
	const below = QS.filter((q) => gain(q) < level);
	check(below.length === 1 && below[0] === 12, `the slabs below the noise: ${below}`);
	return { qc, level, below };
}

/** The studio's light (lib.js, shadeNormal) on a world normal, in the view V. */
const KEY = [-0.55, 0.72, 0.62], FILL = [0.85, -0.15, 0.5];
const unit = (v) => { const l = Math.hypot(...v); return v.map((x) => x / l); };
const cam = (V, [x, y, z]) => { const xr = x * V.c - y * V.s, yr = x * V.s + y * V.c; return [xr, yr * V.sf + z * V.cf, -yr * V.cf + z * V.sf]; };
function light(V, n) {
	const m = unit(cam(V, n));
	const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
	return 0.3 + 0.8 * Math.max(0, (dot(m, unit(KEY)) + 0.3) / 1.3) + 0.14 * Math.max(0, dot(m, unit(FILL)));
}
const rgb = (hex) => new THREE.Color(hex).getRGB(new THREE.Color(), THREE.SRGBColorSpace);

export default async function () {
	const nums = mathematics();
	const S = new Sheet(name);
	const R = new Regions(name);
	const L = [];
	const stone = await sprite('/figures3d/sprites/slab.jpg');
	const img = new Image(); img.src = stone.href; await img.decode();
	const gl = renderer(img);

	// the relief never turns a face away from the viewer: on every slab, the top's normal faces the camera
	const V0 = new View({ turn: TURN, tilt: TILT, scale: 1, o: [0, 0] });
	for (const q of QS) for (let i = 0; i <= 2000; i++) {
		const x = -0.5 + i / 2000, n = unit([-RELIEF * slope(q)(x), 0, 1]);
		check(cam(V0, n)[2] > 0.3, `q = ${q}: the relief turns away from the viewer`);
	}

	// ---- the slabs, in a row: centres PITCH apart, the row centred on the page
	const slabs = QS.map((q, i) => ({ q, f: ripple(q), g: slope(q), cx: ORIGIN + (i - (QS.length - 1) / 2) * PITCH, cy: ORIGIN, seed: i, faded: gain(q) < nums.level }));
	let defs = '';
	for (const s of slabs) {
		const V = new View({ turn: TURN, tilt: TILT, scale: SC, o: [0, 0] });
		const mid = V.at([0, 0, -THICK / 2]);
		V.o = [s.cx - mid[0], s.cy - mid[1]];
		s.V = V;
		const top = (x, y) => [x, y, RELIEF * s.f(x)];
		// the edges along x follow the ripple, in steps of a fifth of a point at most; those along y are straight
		const along = (a, b, N) => Array.from({ length: N + 1 }, (_, i) => [a[0] + ((b[0] - a[0]) * i) / N, a[1] + ((b[1] - a[1]) * i) / N]);
		const NX = 260;
		const left = along([-0.5, -0.5], [-0.5, 0.5], 1), back = along([-0.5, 0.5], [0.5, 0.5], NX);
		const right = along([0.5, 0.5], [0.5, -0.5], 1), front = along([0.5, -0.5], [-0.5, -0.5], NX);
		const Z = -THICK;
		const rim = [...left, ...back.slice(1)].map(([x, y]) => V.at(top(x, y)));
		const outline = [...rim, V.at([0.5, 0.5, Z]), V.at([0.5, -0.5, Z]), V.at([-0.5, -0.5, Z])];
		const id = `${name}-clip${s.seed}`;
		defs += `<clipPath id="${id}"><path d="${pathOf(outline)}"/></clipPath>`;
		const image = gl(V, s);
		const op = s.faded ? ` opacity="${FADE}"` : '';
		S.raw(`<image class="art" href="${image.href}" x="${n2(image.x)}" y="${n2(image.y)}" width="${n2(image.w)}" height="${n2(image.h)}" preserveAspectRatio="none" clip-path="url(#${id})"${op}/>`, 1);
		const nearTop = [...right, ...front.slice(1)].map(([x, y]) => V.at(top(x, y)));
		for (const e of [back, front]) check(longest(e.map(([x, y]) => V.at(top(x, y)))) <= 0.25, `q = ${s.q}: a wavy edge is drawn in steps over a quarter of a point`);
		const d = pathOf(outline) + pathOf(nearTop, false) + pathOf([V.at(top(0.5, -0.5)), V.at([0.5, -0.5, Z])], false);
		S.raw(`<path d="${d}" fill="none" stroke="${CUT}" stroke-width="${EDGE}" stroke-linejoin="round"${s.faded ? ` stroke-opacity="${FADE}"` : ''}/>`, 2);
		S.mark([...outline, outline[0]], EDGE / 2, `the slab q = ${s.q}`);
		R.add(hull(outline), `the slab q = ${s.q}`);
		s.outline = outline;
	}
	// the slabs do not touch
	for (let i = 1; i < slabs.length; i++) {
		const r = Math.max(...slabs[i - 1].outline.map((p) => p[0])), l = Math.min(...slabs[i].outline.map((p) => p[0]));
		check(l - r > 3, `the slabs ${i} and ${i + 1} are ${l - r} pt apart`);
	}

	// ---- the bars, over the slabs' centres, on one log scale
	const tops = Math.min(...slabs.flatMap((s) => s.outline.map((p) => p[1])));
	const P = new Plot({ left: slabs[0].cx - PITCH / 2, top: tops - GAP - BARS_H, w: PITCH * QS.length, h: BARS_H, x0: 0, x1: 1, y0: LOG[0], y1: LOG[1] });
	for (const s of slabs) {
		const y0 = P.Y(LOG[0]), y1 = P.Y(Math.log10(gain(s.q)));
		check(y0 - y1 > 2, `the bar of q = ${s.q} is too short to see`);
		const box = { l: s.cx - BAR_W / 2, r: s.cx + BAR_W / 2, t: y1, b: y0 };
		S.fill(`M${n2(box.l)},${n2(box.b)}H${n2(box.r)}V${n2(box.t)}H${n2(box.l)}Z`, box, { color: ACCENT, layer: 1, what: `the bar of q = ${s.q}` });
		if (s.faded) S.P.items[S.P.items.length - 1].svg = S.P.items[S.P.items.length - 1].svg.replace('/>', ` fill-opacity="${FAINT_BAR}"/>`);
	}
	// the noise's line across the bars, over them, from the axis
	const yn = P.Y(Math.log10(nums.level));
	const ax = slabs[0].cx - PITCH / 2 - 2;     // the axis, at the left of the bars
	const xa = ax, xb = slabs[slabs.length - 1].cx + BAR_W / 2 + 6;
	S.path([[xa, yn], [xb, yn]], { color: ACCENT2, width: 0.6, layer: 2, cap: 'butt', what: 'the noise\'s line' });
	// the bars' foot, from the axis to beyond the last bar
	S.path([[ax, P.Y(LOG[0])], [xb, P.Y(LOG[0])]], { color: DIM, width: 0.45, layer: 1.5, cap: 'butt', what: 'the bars\' foot' });
	L.push(...await yAxis(S, P, { ticks: [-4, -2, 0], fmt: (t) => (t === 0 ? '1' : `10^{${t}}`), x: ax, what: 'the gain axis' }));
	const one = L.find((l) => l.src === '1');
	L.push(await placed('q\\,e^{1-q}', ax, one.box.t - LABEL_GAP - 0.6, 0.5, 1, DIM));
	L.push(await S.clear('\\text{noise}', xb, yn - 2.4, 1, 1, [0, -1], { color: ACCENT2 }));

	// ---- the values of q, under the slabs, on one baseline; and q itself at the row's left
	const under = Math.max(...slabs.flatMap((s) => s.outline.map((p) => p[1]))) + 3.4;
	for (const s of slabs) L.push(await placed(`\\vphantom{1}${s.q}`, s.cx, under, 0.5, 0, s.faded ? DIM : INK));
	const first = L[L.length - QS.length];
	L.push(await placed('q', ax, (first.box.t + first.box.b) / 2, 0.5, 0.5, DIM));

	S.checkAll(L, 1.5);
	R.check(L);
	window.tutSvdHero = { ...nums, gains: QS.map(gain) };
	return finish(S, L, [240, 340], defs);
}

/** A renderer of a slab's stone by WebGL, in the slab's own view (figs/tut-fourier-hero.js, its renderer, for a ripple
 * along x): the top a mesh whose height is the relief and whose colour mixes the stone toward the accent of the
 * density's sign, lit by the studio against a flat top; the near sides the stone under the veil of their light. Returns
 * a JPEG of the slab's box on the page, on the stone's own mean colour, to be clipped to the slab's outline. */
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
	const grey = { r: (orange.r + blue.r) / 2, g: (orange.g + blue.g) / 2, b: (orange.b + blue.b) / 2 };
	return (V, s) => {
		const pos = [], uv = [], tint = [], shade = [], idx = [];
		const flat = light(V, [0, 0, 1]);
		const off = 0.21 * s.seed;
		const T = (u, v) => [0.42 * (u + 0.5) + off, 0.42 * (v + 0.5) + 0.11 * s.seed];
		const push = (p, t, c, sh) => {
			const [X, Y] = V.at(p);
			pos.push(X, -Y, V.depth(p) * V.scale);
			uv.push(...t); tint.push(...c); shade.push(...sh);
			return pos.length / 3 - 1;
		};
		// the top: GRID cells along x, two rows along y (the ripple does not change along y)
		const n = GRID, rows = 2, base = pos.length / 3;
		for (let j = 0; j <= rows; j++) for (let i = 0; i <= n; i++) {
			const x = -0.5 + i / n, y = -0.5 + j / rows, f = s.f(x), gx = s.g(x);
			const t = 1 - Math.exp(-Math.abs(f) / SOFT), a = f >= 0 ? orange : blue;
			const c = { r: grey.r + (a.r - grey.r) * t, g: grey.g + (a.g - grey.g) * t, b: grey.b + (a.b - grey.b) * t };
			const lit = 1 + LIFT * (light(V, unit([-RELIEF * gx, 0, 1])) / flat - 1);
			push([x, y, RELIEF * f], T(x, y), [c.r, c.g, c.b, VEIL], [lit, 0]);
		}
		for (let j = 0; j < rows; j++) for (let i = 0; i < n; i++) {
			const a = base + j * (n + 1) + i, b = a + 1, c = a + n + 1, d = c + 1;
			idx.push(a, b, c, b, d, c);
		}
		// the near sides: the front (y = -1/2) and the right (x = 1/2)
		for (const [edge, nrm, u] of [
			[(t) => [-0.5 + t, -0.5], [0, -1, 0], (t) => t],
			[(t) => [0.5, -0.5 + t], [1, 0, 0], (t) => 1 + t]
		]) {
			const v = veil(V, nrm), b0 = pos.length / 3;
			for (let i = 0; i <= n; i++) {
				const [x, y] = edge(i / n), z = RELIEF * s.f(x);
				push([x, y, z], T(u(i / n) - 0.5, 1.2 + z), [0, 0, 0, 0], [1, v]);
				push([x, y, -THICK], T(u(i / n) - 0.5, 1.2 + THICK), [0, 0, 0, 0], [1, v]);
				void y;
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
		const camera = new THREE.OrthographicCamera(x0, x1, -y0, -y1, 0.1, 10 + Math.max(...zs) - Math.min(...zs));
		camera.position.set(0, 0, Math.max(...zs) + 5);
		gl.render(scene, camera);
		const out = document.createElement('canvas');
		out.width = wpx; out.height = hpx;
		const ctx = out.getContext('2d');
		ctx.imageSmoothingQuality = 'high';
		ctx.drawImage(canvas, 0, 0, wpx, hpx);
		g.dispose();
		return { href: out.toDataURL('image/jpeg', 0.82), x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
	};
}
