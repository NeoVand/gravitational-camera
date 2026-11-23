// Shared tools for the four diagrams of the tutorial's chapter 2.8 (tutorial/outside/flows.md): tut-flow-box,
// tut-flow-column, tut-flow-stream and tut-flow-hidden. Not a figure itself. The mathematics of the chapter, each
// function checked here against the chapter's printed numbers, and the colours of marks drawn on the stone.
//
// The stone bodies are chapter 2.5's (figs/tut-null-lib.js: the sawn face of the steel ball, its rim in the stone's
// fixed ink); marks on the stone keep fixed colours, which the site does not swap for its theme, so that they read
// the same on the light stone in both themes: the stone's dark ink, matter's colour (its light one, for the mass flux)
// and the palette's two accents written as rgb(), the form the site leaves alone (app/src/lib/paper/drawing.ts swaps
// only the six-digit hex colours of the palette).
import { ACCENT, ACCENT2, THREE, shadeNormal } from '../lib.js';
import { SHADE, MATTER, STONE_INK, RIM, ballFace, stoneDefs, rim } from './tut-null-lib.js';
import { checker, near } from './tut-pot-lib.js';

export { SHADE, MATTER, STONE_INK, RIM, ballFace, stoneDefs, rim };

const rgb = (hex) => `rgb(${[1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(', ')})`;
export const STONE_ACCENT = rgb(ACCENT);       // the first accent (orange), fixed on the stone
export const STONE_ACCENT2 = rgb(ACCENT2);     // the second accent (blue), fixed on the stone
export const FAINT_ON_STONE = 0.6;             // the opacity of the stone's ink for a faint mark on it
export const STONE_FAINT = rgb(STONE_INK).replace('rgb(', 'rgba(').replace(')', `, ${FAINT_ON_STONE})`);   // that mark's colour

// ---- the turning steel ball of the chapter's current column ---------------------------------------------------
export const BALL_R = 0.1;                     // m
export const BALL_S = 1;                       // m, from the pixel to the centre
export const BALL_D = 0.05;                    // m, from the centre to the line of sight
export const RHO_STEEL = 7850;                 // kg m^-3
export const OMEGA = 62.8;                     // s^-1, ten turns a second
/** Where a line of sight passing d from the centre of a ball of radius R at the distance s enters and leaves it. */
export const entryExit = (R, s, d) => [Math.sqrt(s * s - d * d) - Math.sqrt(R * R - d * d), Math.sqrt(s * s - d * d) + Math.sqrt(R * R - d * d)];

// ---- the example stream function, chi = 4 K varpi^2 (1 - r^2 / R^2) / R^2, in units of K, lengths in R ----------
export const chi = (w, z) => 4 * w * w * (1 - w * w - z * z);
/** The mass flux of the stretch problem, J = (K / R^2)[8 z x / R^2 + (8 - 16 r^2 / R^2) z^], in units of K / R^2:
 * its parts [J_varpi, J_z] at the distance w from the axis and the height z. */
export const flux = (w, z) => [8 * z * w, 8 * z * z + 8 - 16 * (w * w + z * z)];

// ---- the hidden swirl ---------------------------------------------------------------------------------------------
export const HIDDEN = 2 ** (-1 / 5);           // the inner ball's radius, in R
/** The angular momenta of the inner ball and of the shell, in units of (8 pi / 15) rho Omega R^5. */
export const momenta = (u = HIDDEN) => [u ** 5, -(1 - u ** 5)];

/** Every number of the chapter that the four diagrams use, checked once. */
export function checkChapter(name) {
	const check = checker(name);
	const [a, b] = entryExit(BALL_R, BALL_S, BALL_D);
	check(a.toFixed(3) === '0.912' && b.toFixed(3) === '1.085', `the line of sight enters at ${a} and leaves at ${b}`);
	const column = RHO_STEEL * OMEGA * BALL_D * (b - a);
	check(Math.abs(column - 4270) < 5, `the column of the steel ball is ${column}`);
	// chi: zero on the axis and on the surface, greatest (= K) at varpi = R / sqrt 2 on the equator
	for (let k = 0; k <= 90; k++) {
		const t = (k * Math.PI) / 180;
		check(near(chi(Math.cos(t), Math.sin(t)), 0, 1e-12) && near(chi(0, Math.sin(t)), 0, 1e-12), 'chi is not zero on the surface and the axis');
	}
	check(near(chi(Math.SQRT1_2, 0), 1, 1e-12), 'chi is not K at its greatest');
	// the stream function carries the stretch problem's flux: J_z = (1 / varpi) d chi / d varpi, J_varpi = -(1 / varpi) d chi / dz
	const h = 1e-6;
	for (const [w, z] of [[0.2, 0.1], [0.5, -0.4], [0.7, 0.3], [0.35, 0.8]]) {
		const dw = (chi(w + h, z) - chi(w - h, z)) / (2 * h), dz = (chi(w, z + h) - chi(w, z - h)) / (2 * h);
		const [Jw, Jz] = flux(w, z);
		check(near(dw / w, Jz, 1e-6) && near(-dz / w, Jw, 1e-6), `chi does not carry the stretch problem's flux at (${w}, ${z})`);
	}
	// the hidden swirl: a = 2^(-1/5) R = 0.871 R, the inner ball 66 per cent of the mass, the angular momentum zero
	check(HIDDEN.toFixed(3) === '0.871', `the inner radius is ${HIDDEN}`);
	check(Math.round(100 * HIDDEN ** 3) === 66 && Math.round(100 * (1 - HIDDEN ** 3)) === 34, 'the shares of the mass are not 66 and 34 per cent');
	const [Lb, Ls] = momenta();
	check(near(Lb + Ls, 0, 1e-15), 'the angular momentum of the hidden swirl is not zero');
}

/**
 * An arrow along the circle of radius r about (cx, cy) (figure points, y down) from the angle a0 to a1 (radians,
 * anticlockwise on the page positive): an arc for the shaft and a filled head whose tip is at a1, `head` points long
 * or two fifths of the arc if that is less (figs/hidden-flow.js's paths). Returns the SVG, the points of its shaft
 * and head (for a Sheet's marks), and the arc's length.
 */
export function turning(cx, cy, r, a0, a1, color, { width, head, spread = 0.78 * head + 0.5 * width }) {
	const dir = Math.sign(a1 - a0), len = r * Math.abs(a1 - a0);
	const hd = Math.min(head, 0.4 * len), sp = (spread * hd) / head;
	const neck = a1 - (dir * hd) / r;
	const at = (a) => [cx + r * Math.cos(a), cy - r * Math.sin(a)];
	const f = (p) => `${p[0].toFixed(3)},${p[1].toFixed(3)}`;
	// the shaft stops a little inside the head, so that its butt end does not show beside the tip
	const stop = a1 - (dir * 0.8 * hd) / r;
	const shaft = `M${f(at(a0))}A${r.toFixed(3)},${r.toFixed(3)} 0 0,${dir > 0 ? 0 : 1} ${f(at(stop))}`;
	const [xt, yt] = at(a1), [xn, yn] = at(neck);
	const L = Math.hypot(xt - xn, yt - yn), nx = -(yt - yn) / L, ny = (xt - xn) / L;
	const corners = [[xt, yt], [xn + (nx * sp) / 2, yn + (ny * sp) / 2], [xn - (nx * sp) / 2, yn - (ny * sp) / 2]];
	const svg = `<path d="${shaft}" fill="none" stroke="${color}" stroke-width="${width.toFixed(3)}"/>` +
		`<path d="M${corners.map(f).join('L')}Z" fill="${color}"/>`;
	const n = Math.max(2, Math.ceil(len / 0.5));
	const pts = Array.from({ length: n + 1 }, (_, k) => at(a0 + ((stop - a0) * k) / n));
	return { svg, pts, head: [...corners, corners[0]], len, hd };
}

/** The mean colour (hex) of a sprite (lib.js's sprite) over the disc of `frac` of its half-width about its centre. */
export async function meanColour(s, frac = 0.6) {
	const img = new Image();
	img.src = s.href;
	await img.decode();
	const c = document.createElement('canvas');
	c.width = img.width; c.height = img.height;
	const ctx = c.getContext('2d');
	ctx.drawImage(img, 0, 0);
	const d = ctx.getImageData(0, 0, img.width, img.height).data;
	const sum = [0, 0, 0];
	let n = 0;
	for (let y = 0; y < img.height; y++) for (let x = 0; x < img.width; x++) {
		if (Math.hypot(x - img.width / 2, y - img.height / 2) > (frac * img.width) / 2) continue;
		const k = (y * img.width + x) * 4;
		for (let i = 0; i < 3; i++) sum[i] += d[k + i];
		n++;
	}
	return '#' + sum.map((v) => Math.round(v / n).toString(16).padStart(2, '0')).join('');
}

/** A lit ball's shading as a radial gradient `id` (lib.js's Panel.sphere: the studio's light sampled along the line
 * through the highlight), in the colour `color`, for a shape that a figure clips from the ball's disc. */
export function ballGradient(id, color, o = {}) {
	const KEY = new THREE.Vector3(-0.55, 0.72, 0.62).normalize(), VIEW = new THREE.Vector3(0, 0, 1);
	const hl = KEY.clone().add(VIEW).normalize();
	const fx = 0.5 + 0.5 * hl.x * 0.9, fy = 0.5 - 0.5 * hl.y * 0.9;
	const base = new THREE.Color(color), dir = new THREE.Vector3(-hl.x, -hl.y, 0).normalize();
	const stops = [0, 0.15, 0.35, 0.55, 0.75, 0.9, 1].map((t) => {
		const q = new THREE.Vector3(hl.x * (1 - t) + dir.x * t, hl.y * (1 - t) + dir.y * t, 0);
		const n = new THREE.Vector3(q.x, q.y, Math.sqrt(Math.max(0, 1 - q.x * q.x - q.y * q.y))).normalize();
		return `<stop offset="${t}" stop-color="#${shadeNormal(base, n, o).getHexString()}"/>`;
	});
	return `<radialGradient id="${id}" cx="0.5" cy="0.5" r="0.5" fx="${fx.toFixed(3)}" fy="${fy.toFixed(3)}">${stops.join('')}</radialGradient>`;
}
