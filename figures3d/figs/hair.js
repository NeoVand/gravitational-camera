// What the outside knows. (a) Three bodies of one radius a and one mass M: a uniform ball, a shell (inner
// radius 0.92 a) and a ball of light rock with a core of radius 0.4 a that holds half the mass. One look:
// outside, their pull is the same, so the same ring of arrows is drawn three times. A push: an impulsive tide
// of potential g = (x^2 - y^2)/2 (x across the page, y up) kicks the part at (x, y) by K (x, -y). Each bold
// arrow is that kick, exact in direction and in length (one K for all three bodies), with the part it belongs
// to at its middle; orange where the part moves outward, blue where inward. Arrows stand only where there is
// mass, in eight directions turned 22.5 degrees from the axes (none on a diagonal, where the kick is across
// the radius), and on the axes in the core. The sections of that row are exact: the outer circle, the shell's
// inner circle and the core's are drawn here, and the stone is only their filling. Weighed: each bar is the
// energy gained, in proportion to the integral of rho r^2 over the body: 0.600, 0.924 and 0.365 M a^2.
// (b) What the field outside carries, one bead for one number. A stone read from three of its radii with the
// monopole at a signal-to-noise ratio of 10^6: degree l is weaker by 3^-l, so degrees 0 to 12 stand above the
// noise, 2l + 1 numbers of each, 169 in all; a bead's area is in proportion to the bits its number holds,
// (1/2) log2(1 + 10^12 3^-2l), from 19.9 down to 1.1. A black hole: seven, each at the full 19.9.
// Pictorial, and to be called so: the bodies of the first row and the stone, which are pictures from an image
// model (design/prompts/hair-sprites.json, cut out by design/hair_sprites.py; the thickness of the shell's
// skin, the size of the core and the stone's layers are as the model drew them there), and the grain of the
// sections. Schematic: the size of K, and the places and lengths of the grey arrows of the field and of the
// heavy arrows of the tide.
import { Panel, v3, figure, sprite, INK, DIM, FAINT, ACCENT, ACCENT2 } from '../lib.js';

// ---- the physics --------------------------------------------------------------------------------------
export const SHELL_INNER = 0.92;    // the shell's inner radius, in units of a
export const CORE_RADIUS = 0.4;     // the core's radius
export const CORE_SHARE = 0.5;      // the share of the mass in the core
export const SNR = 1e6;             // the monopole's signal-to-noise ratio
export const DISTANCE = 3;          // the camera's distance, in radii of the stone
export const HOLE = [['mass', 1], ['place', 3], ['spin', 3]];

/** The integral of rho r^2 dV of a uniform shell between radii b and a, per unit mass (a ball: b = 0). */
const shell = (b, a = 1) => (3 / 5) * (a ** 5 - b ** 5) / (a ** 3 - b ** 3);

/** The energy each body gains, in units of M a^2 (and of the square of the push). */
export function weights() {
	return {
		ball: shell(0),
		shell: shell(SHELL_INNER),
		core: CORE_SHARE * shell(0, CORE_RADIUS) + (1 - CORE_SHARE) * shell(CORE_RADIUS)
	};
}

/** The kick at (x, y) from the tide g = (x^2 - y^2)/2: its gradient there, (x, -y). */
export const kick = (x, y) => [x, -y];

/** The bits one number of degree l holds. */
export const bits = (l) => 0.5 * Math.log2(1 + SNR ** 2 * DISTANCE ** (-2 * l));

/** The highest degree that stands above the noise. */
export function topDegree() {
	let l = 0;
	while (SNR * DISTANCE ** -(l + 1) > 1) l++;
	return l;
}

/** Where the kicked parts are drawn: rings of a radius (units of a) and their angles. TURNED: eight directions,
 * 22.5 degrees from the axes and from the diagonals; AXES: the four along the axes. */
const TURNED = Array.from({ length: 8 }, (_, m) => ((2 * m + 1) * Math.PI) / 8);
const AXES = Array.from({ length: 4 }, (_, m) => (m * Math.PI) / 2);
export const PARTS = {
	ball: [{ r: 0.38, at: TURNED }, { r: 0.74, at: TURNED }],
	shell: [{ r: (1 + SHELL_INNER) / 2, at: TURNED }],
	core: [{ r: 0.3, at: AXES }, { r: 0.74, at: TURNED }]
};
export const K = 0.42;              // the length of a kick arrow, in units of its part's distance from the centre

// ---- the drawing --------------------------------------------------------------------------------------
const STEEL = '#868b92', PAGE = '#fffffe';
const HAIR = 0.4;

const W = 504, H = 243;
const A = 27;                                   // points per radius a
const GUT = 33, COL = 93;                       // the row labels' gutter and a column of panel (a)
const colX = (j) => GUT + COL / 2 + j * COL;
const TOP = 5;                                  // the top of the letters and heads
const Y1 = 59, Y2 = 150, BASE = 237;            // the two rows' centres and the bars' baseline
const BAR = 36, BARW = 24;                      // points per M a^2, and a bar's width
const FIELD = [1.15, 1.45], TIDE = [1.13, 1.52]; // the arrows outside, nearer and farther end, in units of a

const XB = 314;                                 // panel (b)
const XS = 402, XH = 470;                       // the stone's and the hole's centres; both of radius A
const PITCH = 7.2, ROWS = 8.2, BEAD = 3.3, ROW0 = 105;   // the beads: spacing in a row, of the rows, largest radius, first row
const NAME = 6.5, NAMEW = 14.2, GAP = 3.5;      // the hole's three words: type size, width of the longest, space before

const SPRITES = '/figures3d/sprites/hair/';
const MARGIN = 4;                               // pixels around each sprite's exact circle (design/hair_sprites.py)
const METAL = 0.46;                             // the patch of the core's metal reaches this far (the same file)

const text = (s) => `\\vphantom{(}\\text{${s}}`;
const n2 = (x) => x.toFixed(2);

const circle = (cx, cy, r) => `M${n2(cx - r)},${n2(cy)}a${n2(r)},${n2(r)} 0 1,0 ${n2(2 * r)},0a${n2(r)},${n2(r)} 0 1,0 ${n2(-2 * r)},0Z`;

/** A sprite whose exact circle has radius r at (cx, cy), shown only inside `shape` (path data; several loops
 * make a ring), which is the figure's own geometry. `reach`: the sprite's half-width, in units of r. */
function picture(id, s, cx, cy, r, shape, reach = s.w / (s.w - 2 * MARGIN)) {
	const half = r * reach;
	return `<clipPath id="${id}"><path clip-rule="evenodd" d="${shape}"/></clipPath>` +
		`<image class="art" href="${s.href}" x="${n2(cx - half)}" y="${n2(cy - half)}" width="${n2(2 * half)}" height="${n2(2 * half)}" preserveAspectRatio="none" clip-path="url(#${id})"/>`;
}

const outline = (cx, cy, r, width = HAIR) => `<path d="${circle(cx, cy, r)}" fill="none" stroke="${INK}" stroke-width="${width}"/>`;

/** A bold arrow from `a` to `b` (page points) as one filled outline of seven corners (tail, neck, barb, tip and
 * back), and a halo of the page's colour to lay beneath it so that it reads over a picture. */
function bold(kind, a, b, color, { width, head, spread, halo = 0 }) {
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
function kickStyle(L) {
	const width = 0.9 * Math.min(1, L / 6.5) ** 0.4;
	const head = Math.min(3.8, 0.5 * L);
	return { width, head, spread: 0.8 * head + 0.5 * width, halo: 0.5 * width };
}

export default async function () {
	const w = weights();
	const names = ['ball', 'shell', 'core', 'ball-face', 'shell-face', 'core-face', 'core-metal', 'stone'];
	const art = Object.fromEntries(await Promise.all(names.map(async (n) => [n, await sprite(SPRITES + n + '.png')])));
	const pixels = (art.ball.w - 2 * MARGIN) / 2;                    // the radius of a sprite's exact circle
	const panels = [];
	const page = new Panel({ x: 0, y: 0, w: W, h: H, scale: 1 });   // figure coordinates
	const fp = (X, Y) => v3(X - W / 2, H / 2 - Y, 0);
	const draw = (svg, layer = 0) => page.items.push({ kind: 'raw', layer, depth: 0, svg });
	const bodies = [
		{ key: 'ball', head: 'a ball' },
		{ key: 'shell', head: 'a shell' },
		{ key: 'core', head: 'a dense core' }
	];

	// ---- (a)
	bodies.forEach((b, j) => {
		const x = colX(j);
		// one look: the body cut open, and the same pull outside each
		draw(picture(`hair-${b.key}`, art[b.key], x, Y1, A, circle(x, Y1, A)) + outline(x, Y1, A, 0.35));
		const F = new Panel({ x: x - FIELD[1] * A - 2, y: Y1 - FIELD[1] * A - 2, w: 2 * FIELD[1] * A + 4, h: 2 * FIELD[1] * A + 4, scale: A });
		panels.push(F);
		for (let m = 0; m < 24; m++) {
			const t = (m * Math.PI) / 12, u = v3(Math.cos(t), Math.sin(t), 0);
			F.arrow(u.clone().multiplyScalar(FIELD[1]), u.clone().multiplyScalar(FIELD[0]), { color: FAINT, width: 0.5, head: 2.8 });
		}
		// a push: the body in section, exact, with the sprite's stone as its filling
		const here = `hair-${b.key}-face`;
		if (b.key === 'ball') {
			draw(picture(here, art['ball-face'], x, Y2, A, circle(x, Y2, A)));
		} else if (b.key === 'shell') {
			draw(picture(here, art['shell-face'], x, Y2, A, circle(x, Y2, A) + circle(x, Y2, SHELL_INNER * A)));
			draw(outline(x, Y2, SHELL_INNER * A), 2);
		} else {
			draw(picture(here, art['core-face'], x, Y2, A, circle(x, Y2, A)) +
				picture(here + '-metal', art['core-metal'], x, Y2, A, circle(x, Y2, CORE_RADIUS * A), art['core-metal'].w / (2 * pixels)));
			draw(outline(x, Y2, CORE_RADIUS * A), 2);
		}
		draw(outline(x, Y2, A), 2);
		// the kick of each part, with the part at the arrow's middle
		const at = (px, py) => [x + A * px, Y2 - A * py];
		for (const ring of PARTS[b.key]) for (const t of ring.at) {
			const px = ring.r * Math.cos(t), py = ring.r * Math.sin(t);
			const [vx, vy] = kick(px, py);
			const outward = (px * vx + py * vy) / ring.r ** 2;             // cos 2t
			if (Math.abs(outward) < 0.7) throw new Error('a kick with no clear sense, at ' + t);
			const one = bold('kick', at(px - (K / 2) * vx, py - (K / 2) * vy), at(px + (K / 2) * vx, py + (K / 2) * vy),
				outward > 0 ? ACCENT : ACCENT2, kickStyle(K * ring.r * A));
			// the halo lies under the outlines, which then run unbroken; the shell's thin skin needs none
			if (b.key !== 'shell') draw(one.halo, 1);
			draw(one.arrow, 3);
		}
		// the tide itself
		const heavy = { width: 2.2, head: 5.2, spread: 5.8 };
		for (const s of [-1, 1]) {
			draw(bold('tide', at(s * TIDE[0], 0), at(s * TIDE[1], 0), ACCENT, heavy).arrow, 3);
			draw(bold('tide', at(0, s * TIDE[1]), at(0, s * TIDE[0]), ACCENT2, heavy).arrow, 3);
		}
		// weighed
		const h = w[b.key] * BAR;
		draw(`<rect x="${n2(x - BARW / 2)}" y="${n2(BASE - h)}" width="${BARW}" height="${n2(h)}" fill="${ACCENT}"/>`);
		page.label(text(b.head), [x, TOP], { size: 8, anchor: 'ct' });
	});
	page.label('\\text{(a)}', [4, TOP], { anchor: 'lt' });
	[['the field', Y1], ['a tide', Y2]].forEach(([s, y]) => page.label(text(s), [4, y], { size: 8, anchor: 'lc' }));
	page.label(`\\smash[b]{\\text{the weight}}`, [4, BASE], { size: 8, anchor: 'lb' });

	// ---- (b)
	draw(picture('hair-stone', art.stone, XS, Y1, A, circle(XS, Y1, A)) + outline(XS, Y1, A, 0.35));
	draw(`<circle cx="${XH}" cy="${Y1}" r="${A}" fill="#000000"/>` +
		`<circle cx="${XH}" cy="${Y1}" r="${A + 2.2}" fill="none" stroke="${ACCENT}" stroke-width="0.6"/>`);
	// the numbers
	const bead = (X, Y, r) => page.sphere(fp(X, Y), r, STEEL, { spec: 0.6, shininess: 36, layer: 1 });
	const L = topDegree();
	let count = 0;
	for (let l = 0; l <= L; l++) {
		const r = BEAD * Math.sqrt(bits(l) / bits(0));
		for (let m = -l; m <= l; m++, count++) bead(XS + m * PITCH, ROW0 + l * ROWS, r);
	}
	if (count !== (L + 1) ** 2) throw new Error('the stone: ' + count + ' beads');
	// the hole's seven, level with the stone's first three rows; beads and words together stand under the hole
	const block = 2 * PITCH + 2 * BEAD + GAP + NAMEW, x0 = XH - block / 2 + BEAD + PITCH;
	let seven = 0;
	HOLE.forEach(([name, n], i) => {
		for (let m = 0; m < n; m++, seven++) bead(x0 + (m - (n - 1) / 2) * PITCH, ROW0 + i * ROWS, BEAD);
		page.label(text(name), [x0 + PITCH + BEAD + GAP, ROW0 + i * ROWS], { size: NAME, anchor: 'lc', color: DIM });
	});
	page.label(text(`${count} numbers`), [XS, ROW0 + L * ROWS + 7], { size: 8, anchor: 'ct' });
	page.label(text(`${seven}`), [x0, ROW0 + 2 * ROWS + 7], { size: 8, anchor: 'ct' });
	page.label(text('a stone'), [XS, TOP], { size: 8, anchor: 'ct' });
	page.label(text('a black hole'), [XH, TOP], { size: 8, anchor: 'ct' });
	page.label('\\text{(b)}', [XB, TOP], { anchor: 'lt' });

	return figure(W, H, [...panels, page]);
}
