// The tutorial's chapter 3.7, the blur law: its opening figure. Two small iron balls at one depth in a block of
// sandstone cut open, and above them, on level sheets at four heights, what a plane of sensors at that height
// records of them: the reading d = -E_zz of the chapter (step 1), the vertical tide with its sign chosen so that a
// mass below gives a positive reading. For one ball of mass m a height h below a point and a distance rho to the side,
// d = G m (2 h^2 - rho^2) / (rho^2 + h^2)^(5/2): positive (orange, a vertical stretch) over the ball, negative (blue,
// a squeeze) beyond rho = sqrt 2 h. The two balls' readings are summed.
// Exact: the pattern on each sheet, the sum of the two balls' readings at that sheet's height, drawn as a relief
// whose height is the reading, each sheet to its own greatest value (the reading falls as 1/h^3); its colour, the
// sign of the reading, saturated as the square root of its size against that greatest value, one rule for every
// sheet, mixing from the clear glass's own tint at zero toward the accent; the places of the balls under the dashed
// lines and of the peaks over them; and the heights, in units of the balls' separation: 0.25, 0.55 and 1 for the
// sheets and 2 for the pixels. The two peaks merge into one, with no dip between them, at the height 1 / (2 t) =
// 1.2844 separations, where t^2 = (27 - sqrt 665) / 8 makes the second derivative of one ball's reading along a line
// zero (Sparrow's criterion, chapter 3.7, step 7). The pixels are a flat plate of 24 by 16, each tile coloured by the
// same rule by its own reading: the bump at the tile's centre and that pixel's noise, white, of spread exactly a
// tenth of the bump's greatest value (one draw, seed 1, set to mean 0 and spread 1 over the 384 pixels). What tells
// two balls from one is smaller than that noise: over the array, the reading of the best-fitting single ball (its
// mass and depth fitted by least squares) differs from that of the two by at most 0.075 of the greatest value.
// Schematic: the vertical spacing of the sheets (drawn evenly spaced) and the depth of the balls, the size of the
// balls, the height of the relief, and the thickness of the glass.
import { Panel, v3, sprite, THREE, INK, DIM, PAGE } from '../lib.js';
import { IRON, text, n2 } from '../stone.js';

// ---- the physics: lengths in units of the balls' separation -------------------------------------------------
export const BALLS = [-0.5, 0.5];                     // the balls' places along x, at one depth
export const HEIGHTS = [0.25, 0.55, 1, 2];            // the sheets' heights above the balls; the last is the pixels'
export const PX = 24, PZ = 16;                        // the pixels: across (along the balls' line) and in depth
export const TILE = 3.2 / PX;                         // a pixel's side
export const HX = (PX * TILE) / 2, HZ = (PZ * TILE) / 2;   // a sheet's half-width and half-depth
export const NOISE = 0.1;                             // the pixels' noise, in units of the bump's greatest value
export const DETAIL = 0.075;                          // what tells two balls from one at the pixels (asserted)

/** The reading of one ball (G m = 1) a distance rho to the side and h above it. */
export const one = (rho, h) => (2 * h * h - rho * rho) / Math.pow(rho * rho + h * h, 2.5);
/** The reading of the two balls at (x, y) on the plane h above them. */
export const reading = (x, y, h) => BALLS.reduce((s, b) => s + one(Math.hypot(x - b, y), h), 0);

/** Where the two peaks merge: one ball's reading along a line, (2 - t^2)(1 + t^2)^(-5/2) with t = rho / h, has the
 * second derivative 3 (1 + t^2)^(-9/2) (-4 t^4 + 27 t^2 - 4), zero at t^2 = (27 - sqrt 665) / 8; the midpoint
 * between balls a separation 1 apart stops being a dip when it lies that far from each, at h = 1 / (2 t). */
export const MERGE = 1 / (2 * Math.sqrt((27 - Math.sqrt(665)) / 8));

/** A seeded normal deviate (mulberry32 and Box-Muller), so that the noise is the same in every render. */
function normals(seed) {
	let a = seed >>> 0;
	const u = () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
	return () => Math.sqrt(-2 * Math.log(u() + 1e-12)) * Math.cos(2 * Math.PI * u());
}

/** The greatest reading on a sheet at the height h: on the line of the balls, by symmetry, which is checked. */
function greatest(h) {
	let top = 0, grid = 0;
	for (let x = 0; x <= HX; x += 1e-4) top = Math.max(top, reading(x, 0, h));
	for (let i = 0; i <= 200; i++) for (let j = 0; j <= 200; j++) grid = Math.max(grid, reading(-HX + (2 * HX * i) / 200, -HZ + (2 * HZ * j) / 200, h));
	if (grid > top * (1 + 1e-9)) throw new Error('the greatest reading is off the line of the balls');
	return top;
}

/** The check of everything the caption says. */
function physics() {
	const dip = (h) => reading(0, 0, h) / greatest(h);           // the midpoint against the peaks
	const t2 = (27 - Math.sqrt(665)) / 8;
	const second = (t) => 3 * Math.pow(1 + t * t, -4.5) * (-4 * t ** 4 + 27 * t * t - 4);
	if (Math.abs(second(Math.sqrt(t2))) > 1e-12) throw new Error('the inflection is wrong');
	// the merge, checked on the field itself: just below it the midpoint is a minimum along the line, just above a maximum
	const curv = (h) => reading(1e-3, 0, h) + reading(-1e-3, 0, h) - 2 * reading(0, 0, h);
	if (!(curv(MERGE - 1e-3) > 0 && curv(MERGE + 1e-3) < 0)) throw new Error('the merge height is wrong');
	if (Math.abs(MERGE - 1.2844) > 5e-5) throw new Error('the merge height is not 1.2844: ' + MERGE);
	const [h1, h2, h3, h4] = HEIGHTS;
	if (!(reading(0, 0, h1) < 0)) throw new Error('the lowest sheet is not blue between its peaks');
	if (!(h3 < MERGE && dip(h3) < 0.95 && dip(h2) < 0.5)) throw new Error('the middle sheets do not show two peaks');
	if (!(h4 > MERGE)) throw new Error('the pixels do not see one bump');
	// the honest point: the bump stands above the noise, and what tells two balls from one does not; the single ball
	// that fits best over the array, by least squares in its mass and its depth, and its largest miss there
	const pts = [];
	for (let i = 0; i <= 64; i++) for (let j = 0; j <= 40; j++) {
		const x = -HX + (2 * HX * i) / 64, y = -HZ + (2 * HZ * j) / 40;
		pts.push([x, y, reading(x, y, h4)]);
	}
	const top = reading(0, 0, h4);
	let best = [Infinity, 0];
	for (let z = 1.6; z <= 2.8; z += 1e-3) {
		let a = 0, b = 0;
		for (const [x, y, v] of pts) { const k = one(Math.hypot(x, y), z); a += k * v; b += k * k; }
		let r = 0, e = 0;
		for (const [x, y, v] of pts) { const d = v - (a / b) * one(Math.hypot(x, y), z); r += d * d; e = Math.max(e, Math.abs(d)); }
		if (r < best[0]) best = [r, e / top];
	}
	if (!(Math.abs(best[1] - DETAIL) < 5e-4)) throw new Error('the two-ball detail: ' + best[1]);
	if (!(DETAIL < NOISE && NOISE <= 0.1)) throw new Error('the noise does not part the bump from the detail');
	return { worst: best[1], dips: HEIGHTS.map(dip) };
}

// ---- the drawing -----------------------------------------------------------------------------------------
const W = 360;
const SCALE = 60;                                   // points per separation (a first guess; fitted to the column)
const TILT = 20, TURN = -24;                        // the view
const GAP = 0.66, STEP = 0.6;                       // the lowest sheet above the ground, and the sheets' spacing (drawn)
const RELIEF = 0.32;                                // the relief's greatest height on the glass sheets (drawn)
const GLASS = 0.026;                                // the glass's thickness (drawn)
const DEPTH = 0.3, BALL = 0.085;                    // the balls' depth below the ground and their radius (drawn)
const BASE = 0.6;                                   // the block's height
const K = 3;                                        // pixels per point of the rendered reliefs
const SS = 2;                                       // rendered at twice that, then halved
const CUT = '#2b2418';                              // ink on the stone, which stays pale in both themes
const MARGIN = 2;
const FONT = 7.5;

export default async function () {
	physics();
	// the labels keep their size while the drawing grows with the scale, so the ink's width is a straight line in the
	// scale: drawn at two trial scales, then at the scale that makes the ink W - 2 MARGIN wide (and a secant step
	// more if needed), and set with equal margins
	const target = W - 2 * MARGIN;
	const trial = async (scale) => { const out = await build(scale); const box = await ink(out.svg, out.w, out.h); return { scale, out, box, wide: box[1] - box[0] }; };
	let a = await trial(SCALE), b = await trial(SCALE + 8);
	for (let k = 0; k < 6; k++) {
		const c = await trial(b.scale + ((target - b.wide) * (b.scale - a.scale)) / (b.wide - a.wide));
		if (Math.abs(c.wide - target) <= 0.15) {
			const { out, box } = c;
			const h = box[3] - box[2] + 2 * MARGIN;
			const dx = MARGIN - box[0], dy = MARGIN - box[2];
			return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}pt" height="${n2(h)}pt" viewBox="0 0 ${W} ${n2(h)}"><defs>${out.defs}</defs><g transform="translate(${n2(dx)},${n2(dy)})">${out.body}</g></svg>`;
		}
		[a, b] = [b, c];
	}
	throw new Error('the ink is not as wide as the column: ' + b.wide);
}

/** Where an SVG drawing (w by h points) has ink: [left, right, top, bottom], in points, to an eighth of a point. */
async function ink(svg, w, h) {
	const img = new Image();
	img.src = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
	await img.decode();
	const k = 8, c = document.createElement('canvas');
	c.width = Math.ceil(w * k); c.height = Math.ceil(h * k);
	const ctx = c.getContext('2d');
	ctx.drawImage(img, 0, 0, c.width, c.height);
	const a = ctx.getImageData(0, 0, c.width, c.height).data;
	let l = Infinity, r = -1, t = Infinity, b = -1;
	for (let y = 0; y < c.height; y++) for (let x = 0; x < c.width; x++) if (a[(y * c.width + x) * 4 + 3] > 8) {
		if (x < l) l = x; if (x > r) r = x; if (y < t) t = y; if (y > b) b = y;
	}
	return [l / k, (r + 1) / k, t / k, (b + 1) / k];
}

async function build(scale) {
	const FW = 500, FH = 560;                       // a page large enough for any trial scale
	const P = new Panel({ x: 0, y: 0, w: FW, h: FH, cx: 0, cy: 1.1, scale, tilt: TILT, turn: TURN });
	const draw = (svg, layer) => P.items.push({ kind: 'raw', layer, depth: 0, svg });
	const pt = (p) => P.at(p).map(n2).join(',');
	const path = (pts, close = false) => 'M' + pts.map(pt).join('L') + (close ? 'Z' : '');
	const levels = HEIGHTS.map((h, i) => ({ h, y: GAP + i * STEP, array: i === HEIGHTS.length - 1 }));

	// ---- the block, a plain box whose front is the section through the balls' centres; its faces textured with the
	// slab at its own resolution (once, and reused), the whole slab across the front as in figs/near-field-geometry.js
	const slab = await sprite('/figures3d/sprites/slab.jpg');
	let defs = `<image id="tut-blur-slab" href="${slab.href}" width="${slab.w}" height="${slab.h}" preserveAspectRatio="none"/>`;
	const TEX = (2 * HX) / slab.w;                   // world units per pixel of the slab
	let faceId = 0;
	/** A face of the block: corners in order, its texture laid with its origin at o and its axes along u and v. */
	const face = (corners, o, u, v, veil) => {
		const [ox, oy] = P.at(o), [ux, uy] = P.at(o.clone().addScaledVector(u, 1)), [vx, vy] = P.at(o.clone().addScaledVector(v, 1));
		const m = [(ux - ox) * TEX, (uy - oy) * TEX, (vx - ox) * TEX, (vy - oy) * TEX, ox, oy].map((x) => x.toFixed(5)).join(',');
		const id = `tut-blur-face${faceId++}`;
		defs += `<clipPath id="${id}"><path d="${path(corners, true)}"/></clipPath>`;
		draw(`<g clip-path="url(#${id})"><use href="#tut-blur-slab" transform="matrix(${m})"/>` +
			(veil ? `<path d="${path(corners, true)}" fill="${CUT}" fill-opacity="${veil.toFixed(3)}"/>` : '') + '</g>', 0);
	};
	const X = v3(1, 0, 0), Y = v3(0, -1, 0), Z = v3(0, 0, 1), mZ = v3(0, 0, -1);
	// the studio's light on each face (lib.js shadeNormal, without its colour), as a veil against the top's
	const KEY = new THREE.Vector3(-0.55, 0.72, 0.62).normalize(), FILL = new THREE.Vector3(0.85, -0.15, 0.5).normalize();
	const lightOf = (n) => 0.3 + 0.8 * Math.max(0, (n.dot(KEY) + 0.3) / 1.3) + 0.14 * Math.max(0, n.dot(FILL));
	const shade = (nWorld) => lightOf(nWorld.clone().applyMatrix4(P.rot).normalize());
	const veil = (n) => Math.max(0, Math.min(0.6, 1 - shade(n) / shade(v3(0, 1, 0))));
	// the top, the front (the section through the balls) and the right side
	const B = -HZ;
	face([v3(-HX, 0, B), v3(HX, 0, B), v3(HX, 0, 0), v3(-HX, 0, 0)], v3(-HX, 0, B), X, Z, 0);
	face([v3(-HX, 0, 0), v3(HX, 0, 0), v3(HX, -BASE, 0), v3(-HX, -BASE, 0)], v3(-HX, 0, 0), X, Y, veil(Z));
	face([v3(HX, 0, 0), v3(HX, 0, B), v3(HX, -BASE, B), v3(HX, -BASE, 0)], v3(HX, 0, 0), mZ, Y, veil(X));
	// its edges, each drawn once: the outline, and the two edges inside it
	const edge = (pts) => draw(`<path d="${path(pts)}" fill="none" stroke="${CUT}" stroke-width="0.4" stroke-linejoin="round"/>`, 0.5);
	edge([v3(-HX, 0, 0), v3(-HX, 0, B), v3(HX, 0, B), v3(HX, -BASE, B), v3(HX, -BASE, 0), v3(-HX, -BASE, 0), v3(-HX, 0, 0), v3(HX, 0, 0), v3(HX, 0, B)]);
	edge([v3(HX, 0, 0), v3(HX, -BASE, 0)]);

	// ---- the balls, on the sawn face
	for (const b of BALLS) P.sphere(v3(b, -DEPTH, 0), BALL, IRON, { spec: 0.45, shininess: 30, layer: 1 });

	// ---- the sheets
	// the pixels' noise: one draw (seed 1), set to mean 0 and spread exactly 1 over the pixels, then made NOISE in size
	const rnd = normals(1);
	let noise = Array.from({ length: PX }, () => Array.from({ length: PZ }, () => rnd()));
	{
		const all = noise.flat(), mean = all.reduce((t, v) => t + v, 0) / all.length;
		const spread = Math.sqrt(all.reduce((t, v) => t + (v - mean) ** 2, 0) / all.length);
		noise = noise.map((col) => col.map((v) => (NOISE * (v - mean)) / spread));
		const got = noise.flat(), m2 = got.reduce((t, v) => t + v, 0) / got.length;
		const s2 = Math.sqrt(got.reduce((t, v) => t + (v - m2) ** 2, 0) / got.length);
		if (Math.abs(m2) > 1e-12 || Math.abs(s2 - NOISE) > 1e-12) throw new Error('the noise is not of spread ' + NOISE);
	}
	for (const L of levels) {
		L.top = greatest(L.h);
		// the world's (x, z) is the plane's (x, y): the balls lie along x, and z runs toward the viewer
		L.exact = (x, z) => reading(x, z, L.h) / L.top;
		// the glass sheets carry the reading as a relief; the pixels are a flat plate
		L.relief = L.array ? 0 : RELIEF;
		L.surface = (x, z) => v3(x, L.y + L.relief * L.exact(x, z), z);
	}
	const relief = await glRenderer();

	let layer = 2;
	const DASH = [1.4, 1.6];
	const run = BALLS.map(() => 0);                  // how far each dashed line has run, so that its dashes run on
	const dashed = (k, a, c, color) => {
		const A = P.at(a), C = P.at(c);
		draw(`<path d="M${n2(A[0])},${n2(A[1])}L${n2(C[0])},${n2(C[1])}" fill="none" stroke="${color}" stroke-width="0.35" stroke-dasharray="${DASH.join(' ')}" stroke-dashoffset="${(-run[k]).toFixed(2)}"/>`, layer);
		run[k] += Math.hypot(C[0] - A[0], C[1] - A[1]);
	};
	const n = 200;
	const side = (a, b) => Array.from({ length: n + 1 }, (_, j) => [a[0] + ((b[0] - a[0]) * j) / n, a[1] + ((b[1] - a[1]) * j) / n]);
	const front = side([-HX, HZ], [HX, HZ]), right = side([HX, HZ], [HX, -HZ]);
	const back = side([HX, -HZ], [-HX, -HZ]), left = side([-HX, -HZ], [-HX, HZ]);
	levels.forEach((L, i) => {
		// the dashed lines up to this sheet: from the balls, or from the relief of the sheet below
		BALLS.forEach((b, k) => {
			if (i === 0) {
				// on the stone the line is the stone's ink, which stays dark in both themes, for as long as the block
				// lies behind it on the page: up to where it crosses the far edge of the block's top
				const far = [P.at(v3(-HX, 0, B)), P.at(v3(HX, 0, B))];
				const across = (y) => { const q = P.at(v3(b, y, 0)); return (far[1][0] - far[0][0]) * (q[1] - far[0][1]) - (far[1][1] - far[0][1]) * (q[0] - far[0][0]); };
				let lo = 0, hi = L.y;
				for (let m = 0; m < 60; m++) { const mid = (lo + hi) / 2; if (Math.sign(across(mid)) === Math.sign(across(0))) lo = mid; else hi = mid; }
				dashed(k, v3(b, -DEPTH + BALL, 0), v3(b, lo, 0), CUT);
				dashed(k, v3(b, lo, 0), v3(b, L.y - GLASS, 0), INK);
			} else {
				dashed(k, levels[i - 1].surface(b, 0), v3(b, L.y - GLASS, 0), INK);
			}
		});
		const top = (pts) => pts.map(([x, z]) => L.surface(x, z));
		const under = (pts) => pts.map(([x, z]) => L.surface(x, z).add(v3(0, -GLASS, 0)));
		// the far edges lie under the relief, which hides them where it rises in front of them (the flat plate of the
		// pixels hides nothing of its own edges)
		draw(`<path d="${path([...top(back), ...top(left).slice(1)])}" fill="none" stroke="${DIM}" stroke-width="0.4" stroke-linejoin="round" stroke-linecap="round"/>`, layer + (L.array ? 0.3 : 0.05));
		if (!L.array) draw(relief(P, L, (x, z) => colour(L.exact(x, z))), layer + 0.1);
		else {
			// the pixels: a mosaic, each tile the colour of its own reading (the bump at its centre and its noise), by
			// the glass's rule, with thin borders between the tiles
			// on a plate of the page's own colour, which hides what lies behind it and shows the tiles as they would
			// look on the bare page, in either theme
			let tiles = `<path d="${path([v3(-HX, L.y, -HZ), v3(HX, L.y, -HZ), v3(HX, L.y, HZ), v3(-HX, L.y, HZ)], true)}" fill="${PAGE}"/>`;
			for (let i = 0; i < PX; i++) for (let j = 0; j < PZ; j++) {
				const x0 = -HX + i * TILE, z0 = -HZ + j * TILE;
				const [c, a] = colour(L.exact(x0 + TILE / 2, z0 + TILE / 2) + noise[i][j]);
				tiles += `<path d="${path([v3(x0, L.y, z0), v3(x0 + TILE, L.y, z0), v3(x0 + TILE, L.y, z0 + TILE), v3(x0, L.y, z0 + TILE)], true)}" fill="#${c.getHexString()}" fill-opacity="${a.toFixed(3)}"/>`;
			}
			let d = '';
			for (let i = 1; i < PX; i++) d += path([v3(-HX + i * TILE, L.y, -HZ), v3(-HX + i * TILE, L.y, HZ)]);
			for (let j = 1; j < PZ; j++) d += path([v3(-HX, L.y, -HZ + j * TILE), v3(HX, L.y, -HZ + j * TILE)]);
			draw(tiles + `<path d="${d}" fill="none" stroke="${DIM}" stroke-width="0.2"/>`, layer + 0.1);
		}
		// the near edges: the glass's thickness along them, and the outline of its top
		for (const s of [front, right]) draw(`<path d="${path([...top(s), ...under(s).reverse()], true)}" fill="#c3ccd4" fill-opacity="0.55"/>`, layer + 0.2);
		draw(`<path d="${path([...top(left).slice(-1), ...top(front), ...top(right).slice(1)])}" fill="none" stroke="${DIM}" stroke-width="0.4" stroke-linejoin="round" stroke-linecap="round"/>`, layer + 0.3);
		layer += 1;
	});

	// ---- the label, beside the array's right corner (the noise is named in the caption)
	const r = P.at(levels[3].surface(HX, -HZ));
	P.label(text('pixels'), [r[0] + 4, r[1]], { size: FONT, anchor: 'lc', color: INK });

	// ---- the drawing, on a page FW by FH, and the width of the labels beside it
	const out = P.render('tut-blur-p');
	const labels = await Promise.all(P.labels);
	const body = out.body + labels.join('');
	return { svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${FW}" height="${FH}" viewBox="0 0 ${FW} ${FH}"><defs>${out.defs}${defs}</defs>${body}</svg>`,
		defs: out.defs + defs, body, w: FW, h: FH };
}

/** The colour of a reading v (in units of its sheet's greatest value), [THREE.Color, opacity] before the light, one rule
 * for every sheet. Its strength is s = sqrt(sqrt(v^2 + SOFT^2) - SOFT), a square root softened at zero. The hue turns
 * from the clear glass's own grey toward orange (v > 0) or blue (v < 0) as s grows to HUE, at the glass's own
 * opacity, the grey being of the accents' lightness; beyond HUE the accent grows opaque, to 0.95 at the greatest
 * value. So where the reading crosses zero the colour fades into the glass, which is neither lighter than the faint
 * colours around it on a white page nor brighter than them on a dark one: no ring. (Mixed in sRGB, as the page mixes.) */
const GLASS_TINT = '#5f6973', GLASS_OPACITY = 0.22, HUE = 0.12, SOFT = 0.012;
function colour(v) {
	const s = Math.min(1, Math.sqrt(Math.hypot(v, SOFT) - SOFT));
	const [g, a] = [new THREE.Color(GLASS_TINT), new THREE.Color(v >= 0 ? '#b0560a' : '#2a67ad')].map((c) => c.getRGB(new THREE.Color(), THREE.SRGBColorSpace));
	const f = Math.min(1, s / HUE);
	const c = new THREE.Color().setRGB(g.r + (a.r - g.r) * f, g.g + (a.g - g.g) * f, g.b + (a.b - g.b) * f, THREE.SRGBColorSpace);
	return [c, GLASS_OPACITY + (0.95 - GLASS_OPACITY) * Math.max(0, (s - HUE) / (1 - HUE))];
}

/** A renderer of a sheet's relief by WebGL, with the panel's exact projection; returns an <image>. */
async function glRenderer() {
	const canvas = document.createElement('canvas');
	const gl = new THREE.WebGLRenderer({ canvas, alpha: true, premultipliedAlpha: false, antialias: true, preserveDrawingBuffer: true });
	gl.setClearColor(0x000000, 0);
	const material = new THREE.ShaderMaterial({
		vertexShader: 'attribute vec4 rgba; varying vec4 vc; void main() { vc = rgba; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
		fragmentShader: 'varying vec4 vc; void main() { gl_FragColor = vc; }',
		blending: THREE.NoBlending, depthTest: true, side: THREE.DoubleSide
	});
	return (P, L, colour) => {
		const NX = 420, NZ = Math.round((NX * HZ) / HX);
		const count = (NX + 1) * (NZ + 1);
		const pos = new Float32Array(count * 3), clean = new Float32Array(count * 3);
		const world = [];
		for (let j = 0; j <= NZ; j++) for (let i = 0; i <= NX; i++) {
			const x = -HX + (2 * HX * i) / NX, z = -HZ + (2 * HZ * j) / NZ, m = j * (NX + 1) + i;
			world.push([x, z]);
			const c = P.cam(L.surface(x, z)), e = P.cam(v3(x, L.y + L.relief * L.exact(x, z), z));
			pos.set([c.x, c.y, c.z], m * 3);
			clean.set([e.x, e.y, e.z], m * 3);
		}
		const idx = [];
		for (let j = 0; j < NZ; j++) for (let i = 0; i < NX; i++) {
			const a = j * (NX + 1) + i, b = a + 1, c = a + NX + 1, d = c + 1;
			idx.push(a, c, b, b, c, d);
		}
		// the light falls on the relief of the exact reading (on the glass sheets the same as the drawn one)
		const lit = new THREE.BufferGeometry();
		lit.setAttribute('position', new THREE.BufferAttribute(clean, 3));
		lit.setIndex(idx);
		lit.computeVertexNormals();
		const nor = lit.attributes.normal;
		const g = new THREE.BufferGeometry();
		g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
		g.setIndex(idx);
		const rgba = new Float32Array(count * 4);
		const KEY = new THREE.Vector3(-0.55, 0.72, 0.62).normalize(), FILL = new THREE.Vector3(0.85, -0.15, 0.5).normalize();
		const up = new THREE.Vector3(0, 1, 0).applyMatrix4(P.rot).normalize();
		const lightOf = (n) => 0.3 + 0.8 * Math.max(0, (n.dot(KEY) + 0.3) / 1.3) + 0.14 * Math.max(0, n.dot(FILL));
		const flat = lightOf(up);
		for (let m = 0; m < count; m++) {
			const nn = new THREE.Vector3().fromBufferAttribute(nor, m);
			if (nn.dot(up) < 0) nn.negate();
			const [c, a] = colour(world[m][0], world[m][1]);
			// the studio's light, against that on a flat sheet, so that the flat glass keeps its colour, softened a
			// quarter (no gloss, which would whiten the orange toward pink)
			const s = 1 + 0.75 * (lightOf(nn) / flat - 1);
			const lin = new THREE.Color(Math.min(1, c.r * s), Math.min(1, c.g * s), Math.min(1, c.b * s));
			const hex = lin.getHex();
			rgba.set([((hex >> 16) & 255) / 255, ((hex >> 8) & 255) / 255, (hex & 255) / 255, a], m * 4);
		}
		g.setAttribute('rgba', new THREE.BufferAttribute(rgba, 4));
		const scene = new THREE.Scene();
		scene.add(new THREE.Mesh(g, material));
		// the screen box of the sheet, in figure points, on the grid of the image's pixels
		let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
		for (let m = 0; m < pos.length; m += 3) {
			const X = P.x + P.w / 2 + pos[m] * P.scale, Y = P.y + P.h / 2 - pos[m + 1] * P.scale;
			x0 = Math.min(x0, X); x1 = Math.max(x1, X); y0 = Math.min(y0, Y); y1 = Math.max(y1, Y);
		}
		x0 = Math.floor(x0) - 1; y0 = Math.floor(y0) - 1; x1 = Math.ceil(x1) + 1; y1 = Math.ceil(y1) + 1;
		const wpx = (x1 - x0) * K, hpx = (y1 - y0) * K;
		gl.setPixelRatio(1);
		gl.setSize(wpx * SS, hpx * SS, false);
		const cx = P.x + P.w / 2, cy = P.y + P.h / 2;
		const cam = new THREE.OrthographicCamera((x0 - cx) / P.scale, (x1 - cx) / P.scale, (cy - y0) / P.scale, (cy - y1) / P.scale, 0.01, 1000);
		cam.position.set(0, 0, 100);
		gl.render(scene, cam);
		const out = document.createElement('canvas');
		out.width = wpx; out.height = hpx;
		const ctx = out.getContext('2d');
		ctx.imageSmoothingQuality = 'high';
		ctx.drawImage(canvas, 0, 0, wpx, hpx);
		g.dispose(); lit.dispose();
		return `<image class="art" href="${out.toDataURL('image/png')}" x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" preserveAspectRatio="none"/>`;
	};
}
