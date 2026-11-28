// The tutorial, section 2.3 (tutorial/outside/multipoles.md), its second diagram: the person one metre from a ring
// of free beads, drawn twice. Above, as section 1.4 drew it, a ball of water of 70 kg, of radius 0.256 m; below, as a
// uniform thin rod of the same mass, 1.7 m long and upright. Each has its ring of eight beads one metre from its
// centre, level with it, in the plane of the page, drawn out by its own tide. Under each body and its ring, two rows:
// a dimension line of 1 m from the body's centre to the ring's; under it an orange bar for the size of the stretch
// along the line to the ring, 9.3 and 5.6 x 10^-9 s^-2, to one scale, from the body's centre (the rod hides the
// bar's first points), named "stretch" with its value under it. About the rod's centre a dashed circle of radius
// 0.85 m, the smallest sphere that holds the rod, through its two ends, its radius drawn up and to the left; the ring
// lies just outside it, and the rod's rows lie inside it.
// Exact: the ball's radius, (3 M / 4 pi rho)^(1/3) for water, and the rod's length, the circle's radius and the
// distance of one metre, all to one scale (asserted in points); the tides, the ball's (GM/r^3) diag(-2, 1, 1) and the
// rod's from the point-mass tide summed over its length (the closed forms, checked against Simpson's rule): -5.63,
// +3.56 and +2.07 x 10^-9 s^-2 along the line, across it and along the rod, adding up to zero, 0.60 of the ball's
// -9.34, and equation (eq:rod)'s 0.28 at one metre (asserted with the chapter's numbers); each ring the image of its
// circle under 1 - eps E, one eps for both, the beads the images of eight equally spaced places, and the bars'
// lengths in proportion to the two stretches. Schematic: the rings' size (0.09 m, to sit outside the dashed circle),
// eps (exaggerated), and the rod's thickness. Pictorial: the stone, a picture from an image model
// (design/prompts/hair-sprites.json, cut out by design/hair_sprites.py, as in figs/hair.js), clipped here to the exact
// circle and to the rod's exact outline. The printed book (figureLayout 'book') sets the two side by side, the ball
// left and the rod right, at the same scale, the two centres and the two rings level, each body's name over it; the
// site keeps them stacked, the two names at the left.
import { INK, DIM, ACCENT, sprite } from '../lib.js';
import { MARGIN, circle, outline, STEEL, SPRITES } from '../stone.js';
import { Sheet, ORIGIN, placed, finish, checker, near, HAIR, TICK, LINE, n2 } from './tut-pot-lib.js';
import { STONE_INK } from './tut-orb-lib.js';

const name = 'tut-mul-rod';
const check = checker(name);

// ---- the physics (SI) -------------------------------------------------------------------------------------------
export const G = 6.674e-11, MASS = 70, WATER = 1000, LENGTH = 1.7, DISTANCE = 1;
export const RADIUS = Math.cbrt((3 * MASS) / (4 * Math.PI * WATER));
const UNIT = 1e-9;                  // s^-2

/** The rod's tide at the distance r on the line through its centre at right angles to it: [xx, yy, zz], x along the
 * line to the ring, z along the rod, from the point-mass tide (G dm / d^3)(delta_ij - 3 n_i n_j) summed over the rod. */
export function rodTide(r, M = MASS, L = LENGTH) {
	const h = L / 2, lam = M / L, d2 = r * r + h * h, d = Math.sqrt(d2);
	const i3 = (2 * h) / (r * r * d);                                   // the integral of dz / d^3
	const i5 = (2 * h * (2 * h * h + 3 * r * r)) / (3 * r ** 4 * d2 * d);   // of dz / d^5
	// z^2 / d^5 = 1 / d^3 - r^2 / d^5, so the entry along the rod is G lam (i3 - 3 (i3 - r^2 i5))
	return [G * lam * (i3 - 3 * r * r * i5), G * lam * i3, G * lam * (i3 - 3 * (i3 - r * r * i5))];
}

/** The same by Simpson's rule, for the check. */
function rodTideSimpson(r, n = 20000) {
	const h = LENGTH / 2, lam = MASS / LENGTH, out = [0, 0, 0];
	for (let k = 0; k <= n; k++) {
		const z = -h + (2 * h * k) / n, w = (k === 0 || k === n ? 1 : k % 2 ? 4 : 2) * (2 * h) / (3 * n);
		const d2 = r * r + z * z, d3 = d2 * Math.sqrt(d2);
		out[0] += (w * G * lam * (1 - (3 * r * r) / d2)) / d3;
		out[1] += (w * G * lam) / d3;
		out[2] += (w * G * lam * (1 - (3 * z * z) / d2)) / d3;
	}
	return out;
}

// ---- the drawing (points) ---------------------------------------------------------------------------------------
const K = 120;                      // points per metre
const RING = 0.09;                  // the rings' radius, metres (schematic)
const EPS = 0.024;                  // the rings' strain per 10^-9 s^-2 (exaggerated)
const BEAD = 1.55;                  // a bead's radius
const ROD = 6;                      // the rod's thickness, points (schematic)
const BAR = 3.6;                    // a bar's height
const PER = 11.2;                   // a bar's length per 10^-9 s^-2
const RING_W = 0.5;                 // the rings' stroke
const GAP_ROWS = 22;                // the site: from the ball's stretch to the top of the dashed circle
const BAR_DROP = 8;                 // from a dimension line to the top of its bar
const VALUE_DROP = 3;               // from a bar to the top of its words
const NAME_GAP = 6;                 // from a name's baseline to the top of its body
const BOOK = globalThis.figureLayout === 'book';
const GAP_SIDE = 16;                // the book: from the ball's rows to the dashed circle's left


/** The stone, embedded once: an <image> of unit size in the figure's defs, and each body a <use> of it, scaled and
 * clipped to the body's exact outline (as stone.js's picture(), which would embed the picture once for each body). */
const stoneDefs = (id, s) => `<defs><image id="${id}" class="art" href="${s.href}" x="0" y="0" width="1" height="1" preserveAspectRatio="none"/></defs>`;
function stoneUse(id, clip, s, cx, cy, r, shape) {
	const half = (r * s.w) / (s.w - 2 * MARGIN);
	return `<clipPath id="${clip}"><path clip-rule="evenodd" d="${shape}"/></clipPath>` +
		`<g clip-path="url(#${clip})"><use href="#${id}" transform="translate(${n2(cx - half)},${n2(cy - half)}) scale(${n2(2 * half)})"/></g>`;
}

export default async function () {
	// ---- the chapter's numbers
	const ball = (2 * G * MASS) / DISTANCE ** 3;
	const rod = rodTide(DISTANCE), simpson = rodTideSimpson(DISTANCE);
	for (let k = 0; k < 3; k++) check(near(rod[k] / simpson[k], 1, 1e-9), `the rod's tide ${k}: ${rod[k]} against Simpson's ${simpson[k]}`);
	const fmt = (v) => (v / UNIT).toFixed(2);
	check(RADIUS.toFixed(3) === '0.256', `the ball's radius is ${RADIUS}`);
	check((ball / UNIT).toFixed(2) === '9.34', `the ball's stretch is ${ball}`);
	check(fmt(rod[0]) === '-5.63' && fmt(rod[1]) === '3.56' && fmt(rod[2]) === '2.07', `the rod's tide is ${rod.map(fmt)}`);
	check(near(rod[0] + rod[1] + rod[2], 0, 1e-22), 'the rod\'s tide is not trace-free');
	check((-rod[0] / ball).toFixed(2) === '0.60' && (ball / UNIT).toFixed(1) === '9.3' && (-rod[0] / UNIT).toFixed(1) === '5.6', 'the stretches are not 9.3 and 5.6, a ratio of 0.60');
	const eqRod = (r) => 1 - LENGTH ** 2 / (4 * r * r);
	check(eqRod(1).toFixed(2) === '0.28' && eqRod(2).toFixed(2) === '0.82' && eqRod(4).toFixed(3) === '0.955', 'equation (eq:rod) does not give 0.28, 0.82 and 0.955');
	check((-rodTide(2)[0] / ((2 * G * MASS) / 8)).toFixed(2) === '0.85' && (-rodTide(4)[0] / ((2 * G * MASS) / 64)).toFixed(3) === '0.957', 'the exact fractions at 2 m and 4 m are not 0.85 and 0.957');

	const S = new Sheet(name);
	const xA = ORIGIN - (BOOK ? 160 : 50);                       // the ball's centre, and on the site the rod's
	const face = await sprite(SPRITES + 'ball-face.png');
	const STONE = 'tut-mul-rod-stone';
	S.raw(stoneDefs(STONE, face), -5);
	const L = [];

	/** A ring of eight beads centred at (cx, cy), drawn out by the table diag(exx, ezz) (10^-9 s^-2) in the page's
	 * plane, x to the right and z up: the bead at xi is drawn at c + R (1 - eps E) xi. */
	const ring = (cx, cy, exx, ezz, what) => {
		const R = RING * K, ax = 1 - EPS * exx, az = 1 - EPS * ezz;
		check(ax > 1 && az < 1 && az > 0.5, `${what}: the ring is not stretched along the line and squeezed across it`);
		const loop = Array.from({ length: 361 }, (_, k) => [cx + R * ax * Math.cos((k * Math.PI) / 180), cy - R * az * Math.sin((k * Math.PI) / 180)]);
		S.path(loop, { color: INK, width: RING_W, layer: 2, closed: true, what: `${what}'s ellipse` });
		for (let k = 0; k < 8; k++) {
			const t = (k * Math.PI) / 4, xi = [Math.cos(t), Math.sin(t)];
			const p = [cx + R * (xi[0] - EPS * exx * xi[0]), cy - R * (xi[1] - EPS * ezz * xi[1])];
			check(near(((p[0] - cx) / (R * ax)) ** 2 + ((p[1] - cy) / (R * az)) ** 2, 1, 1e-12), `${what}: bead ${k} is off its ellipse`);
			S.sphere(p, BEAD, STEEL, { spec: 0.6, shininess: 36, layer: 3 }, `${what}'s bead ${k}`);
		}
		return { l: cx - R * ax - BEAD, r: cx + R * ax + BEAD, t: cy - R * az - BEAD, b: cy + R * az + BEAD };
	};
	/** Under a body at (xc, y0) and its ring, the two rows that measure them: the distance, a dimension line from the
	 * body's centre to the ring's, its value above it; under it, the stretch, an orange bar from the body's centre
	 * (behind the body, which hides its first points), named, its value under it. Returns the rows' extent. */
	const rows = async (xc, y0, ringBox, s, what, { from = xc } = {}) => {
		const yd = ringBox.b + 9;
		S.path([[xc, yd], [xc + DISTANCE * K, yd]], { color: DIM, width: HAIR, layer: 4, cap: 'butt', what: `${what}: the dimension` });
		for (const x of [xc, xc + DISTANCE * K]) S.path([[x, yd - TICK], [x, yd + TICK]], { color: DIM, width: HAIR, layer: 4, cap: 'butt', what: `${what}: a tick of the dimension` });
		check(near(DISTANCE * K, 120, 1e-12), 'the distance is not one metre');
		L.push(await placed('1\\,\\mathrm m', xc + (DISTANCE * K) / 2, yd - 2.6, 0.5, 1, DIM));
		const yb = yd + BAR_DROP, w = (s / UNIT) * PER;
		S.fill(`M${n2(xc)},${n2(yb)}h${n2(w)}v${BAR}h${n2(-w)}Z`, { l: from, r: xc + w, t: yb, b: yb + BAR }, { color: ACCENT, layer: 0, what: `${what}: the bar` });
		const value = await placed(`\\text{stretch } ${(s / UNIT).toFixed(1)}\\times10^{-9}\\,\\mathrm{s^{-2}}`, from, yb + BAR + VALUE_DROP, 0, 0, INK);
		L.push(value);
		return { w, r: Math.max(xc + w, value.box.r, ringBox.r), b: value.box.b };
	};
	/** A small + at a centre. */
	const centre = (x, y, c, w) => S.path([[x - 2, y], [x + 2, y], [x, y], [x, y - 2], [x, y + 2]], { color: c, width: HAIR, layer: 4, cap: 'butt', what: w });

	// ---- above (the book: at the left): the ball, its ring, the distance, its stretch
	const yA = ORIGIN - (BOOK ? 50 : 150), rb = RADIUS * K;
	let xc = xA;
	S.raw(stoneUse(STONE, 'tut-mul-rod-ball', face, xc, yA, rb, circle(xc, yA, rb)) + outline(xc, yA, rb, 0.35, STONE_INK), 1);
	S.mark([[xc, yA]], rb, 'the ball');
	const ringA = ring(xc + DISTANCE * K, yA, -ball / UNIT, ball / 2 / UNIT, 'the ball\'s ring');
	centre(xc, yA, STONE_INK, 'the ball\'s centre');
	centre(xc + DISTANCE * K, yA, DIM, 'the ring\'s centre');
	const A = await rows(xc, yA, { ...ringA, b: Math.max(yA + rb, ringA.b) }, ball, 'the ball');
	// its name: the book, over the ball's left edge; the site, at the top left of the row, over the rod's name
	const nameA = BOOK ? await placed('\\text{a ball of water}', xc - rb, yA - rb - NAME_GAP, 0, 1, INK) : await placed('\\text{a ball of water}', xc - 0.85 * K, yA - rb, 0, 0, INK);

	// ---- below (the book: at the right, its centre level with the ball's): the rod, its smallest sphere, its ring,
	// the distance, its stretch
	if (BOOK) xc = Math.max(A.r, nameA.box.r) + GAP_SIDE + 0.85 * K;
	const yB = BOOK ? yA : A.b + GAP_ROWS + 0.85 * K, h = (LENGTH / 2) * K;
	const rodPath = `M${n2(xc - ROD / 2)},${n2(yB - h)}H${n2(xc + ROD / 2)}V${n2(yB + h)}H${n2(xc - ROD / 2)}Z`;
	S.raw(stoneUse(STONE, 'tut-mul-rod-rod', face, xc, yB, 1.08 * h, rodPath) + `<path d="${rodPath}" fill="none" stroke="${STONE_INK}" stroke-width="0.35"/>`, 1);
	S.boxes.push({ box: { l: xc - ROD / 2, r: xc + ROD / 2, t: yB - h, b: yB + h }, what: 'the rod' });
	check(near(2 * h, LENGTH * K, 1e-12), 'the rod is not 1.7 m long');
	const ringB = ring(xc + DISTANCE * K, yB, rod[0] / UNIT, rod[2] / UNIT, 'the rod\'s ring');
	// the smallest sphere that holds the rod: a dashed circle through its two ends
	const Rs = 0.85 * K;
	check(near(Rs, h, 1e-12), 'the dashed circle does not pass through the rod\'s ends');
	// a whole number of dashes round it, the pattern stretched to close; the dashes that would touch the rod's ends
	// are left out, so that the circle meets each end in a gap
	const [on, off] = [2.4, 1.8], n = Math.round((2 * Math.PI * Rs) / (on + off)), step = (2 * Math.PI) / n, len = (step * on) / (on + off);
	const rodBox = { l: xc - ROD / 2, r: xc + ROD / 2, t: yB - h, b: yB + h };
	const offRod = ([x, y]) => Math.hypot(Math.max(rodBox.l - x, 0, x - rodBox.r), Math.max(rodBox.t - y, 0, y - rodBox.b)) > 1.2;
	let left = 0;
	for (let k = 0; k < n; k++) {
		const seg = Array.from({ length: 9 }, (_, j) => { const t = Math.PI / 2 + k * step - len / 2 + (len * j) / 8; return [xc + Rs * Math.cos(t), yB - Rs * Math.sin(t)]; });
		if (!seg.every(offRod)) { left++; continue; }
		S.path(seg, { color: DIM, width: LINE * 0.9, layer: 1, cap: 'butt', what: 'the dashed circle' });
	}
	check(left >= 2 && left <= 6, `${left} dashes left out at the rod's ends`);
	check(ringB.l - (xc + Rs) > 2.5, `the ring is ${(ringB.l - xc - Rs).toFixed(2)} pt from the dashed circle`);
	centre(xc, yB, STONE_INK, 'the rod\'s centre');
	centre(xc + DISTANCE * K, yB, DIM, 'the ring\'s centre below');
	// the distance and the stretch, inside the dashed circle; the stretch's words start at the rod's right face
	const B = await rows(xc, yB, ringB, -rod[0], 'the rod', { from: xc + ROD / 2 + 2.5 });
	check(near(B.w / A.w, -rod[0] / ball, 1e-12), 'the bars are not to one scale');
	// the circle's radius, from the rod's edge up and to the left to the circle, labelled
	const a = (145 * Math.PI) / 180, tip = [xc + Rs * Math.cos(a), yB - Rs * Math.sin(a)];
	S.path([[xc + (ROD / 2 + 1.2) / Math.abs(Math.cos(a)) * Math.cos(a), yB - (ROD / 2 + 1.2) / Math.abs(Math.cos(a)) * Math.sin(a)], tip], { color: DIM, width: HAIR, layer: 1, cap: 'butt', what: 'the radius' });
	L.push(await S.clear('0.85\\,\\mathrm m', xc + 0.55 * Rs * Math.cos(a), yB - 0.55 * Rs * Math.sin(a), 0.5, 0.5, [Math.sin(a), Math.cos(a)], { color: DIM }));

	// ---- the names of the two bodies, at the top left of each
	L.push(nameA);
	L.push(await placed('\\text{a rod}', xc - Rs, yB - Rs, 0, 0, INK));

	S.checkAll(L);
	return finish(S, L, BOOK ? [400, 450] : [240, 340]);
}
