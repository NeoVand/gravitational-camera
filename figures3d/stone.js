// The stone bodies of the figures on gravitational hair, and the arrows drawn over them: the tools of
// figs/hair.js, shared by the figures that came after it (figs/ladder.js, figs/hidden-flow.js). The bodies are
// pictures from an image model, cut out by design/hair_sprites.py so that each has an exact circle for its outline;
// a figure clips each to its own geometry, so every edge on the page is the figure's, in vector.
import { INK, PAGE } from './lib.js';

export const SPRITES = '/figures3d/sprites/hair/';
export const MARGIN = 4;          // pixels of canvas around a sprite's exact circle (design/hair_sprites.py)
export const SHELL_INNER = 0.92;  // the inner radius of the shell's skin, in units of its outer radius (the same file)
export const CORE_RADIUS = 0.4;   // the radius the metal patch was cut for, and
export const METAL = 0.46;        // how far the patch reaches, in units of the body's radius (the same file)
export const STEEL = '#868b92';   // the beads
export const IRON = '#77736e';    // a small dense mass, of the tone of the metal patch
export const HAIR = 0.4;          // the outlines of sections

export const text = (s) => `\\vphantom{(}\\text{${s}}`;
export const n2 = (x) => x.toFixed(2);

/** A circle as path data, so that several can be joined into one clip with holes. */
export const circle = (cx, cy, r) => `M${n2(cx - r)},${n2(cy)}a${n2(r)},${n2(r)} 0 1,0 ${n2(2 * r)},0a${n2(r)},${n2(r)} 0 1,0 ${n2(-2 * r)},0Z`;

/** A sprite whose exact circle has radius r at (cx, cy), shown only inside `shape` (path data; several loops
 * make a ring), which is the figure's own geometry. `reach`: the sprite's half-width, in units of r. */
export function picture(id, s, cx, cy, r, shape, reach = s.w / (s.w - 2 * MARGIN)) {
	const half = r * reach;
	return `<clipPath id="${id}"><path clip-rule="evenodd" d="${shape}"/></clipPath>` +
		`<image class="art" href="${s.href}" x="${n2(cx - half)}" y="${n2(cy - half)}" width="${n2(2 * half)}" height="${n2(2 * half)}" preserveAspectRatio="none" clip-path="url(#${id})"/>`;
}

export const outline = (cx, cy, r, width = HAIR, color = INK) => `<path d="${circle(cx, cy, r)}" fill="none" stroke="${color}" stroke-width="${width}"/>`;

/** A bold arrow from `a` to `b` (page points) as one filled outline of seven corners (tail, neck, barb, tip and
 * back), and a halo of the page's colour to lay beneath it so that it reads over a picture. */
export function bold(kind, a, b, color, { width, head, spread, halo = 0 }) {
	const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
	const u = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [-u[1], u[0]];
	const neck = [b[0] - u[0] * head, b[1] - u[1] * head];
	const at = (p, s) => `${(p[0] + n[0] * s).toFixed(3)},${(p[1] + n[1] * s).toFixed(3)}`;
	const d = `M${at(a, width / 2)}L${at(neck, width / 2)}L${at(neck, spread / 2)}L${at(b, 0)}L${at(neck, -spread / 2)}L${at(neck, -width / 2)}L${at(a, -width / 2)}Z`;
	return {
		halo: halo ? `<path d="${d}" fill="${PAGE}" stroke="${PAGE}" stroke-width="${(2 * halo).toFixed(2)}" stroke-linejoin="round"/>` : '',
		arrow: `<path data-arrow="${kind}" d="${d}" fill="${color}"/>`
	};
}

/** The make of a kick arrow L points long: the longest have a stroke of 0.9 pt; shorter ones are lighter. */
export function kickStyle(L) {
	const width = 0.9 * Math.min(1, L / 6.5) ** 0.4;
	const head = Math.min(3.8, 0.5 * L);
	return { width, head, spread: 0.8 * head + 0.5 * width, halo: 0.5 * width };
}

/** The heavy arrows that stand for the tide itself, outside a body. */
export const HEAVY = { width: 2.2, head: 5.2, spread: 5.8 };
