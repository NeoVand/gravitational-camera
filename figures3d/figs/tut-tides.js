// The tutorial, section 1.4 (tutorial/newton/tides.md), its opening figure: a person of stone and, one metre
// from the person's centre of mass, a ring of twelve free steel beads drawn out by the person's tide. Exact:
// the tide's table, (GM/r^3) diag(-2, 1, 1) with x along the line to the person, printed as it is used; the
// ring's shape (a ring of radius 1 is moved by e times -E xi / (GM/r^3), so it becomes the ellipse with
// semi-axes 1 + 2e along the line and 1 - e across it); the beads, the images of twelve equally spaced points
// of the circle; the four arrows, -E xi at the four beads on the axes, xi their undisturbed places, drawn at one
// scale, so that each orange arrow (the stretch) is twice each blue one (the squeeze); the person and the
// distance, drawn to one scale for a person 1.75 m tall, with the centre of mass at COM of the height and
// halfway through the body; the ring's centre level with it, so that the line to the mass is the ring's long
// axis. Schematic: the ring's size against the person (a real ring must be far smaller than a metre for the
// table to hold), e (exaggerated), and the place of the centre of mass (a typical one). Pictorial: the person,
// a picture from an image model (design/prompts/tut-person-sprite.json, cut out by
// design/tut_person_sprite.py). The dimension runs below the ring from the centre of mass, marked on the body
// with the quartered circle, to the ring's centre, marked +; marks on the stone are drawn in a fixed dark ink.
// In profile the hanging arm covers the hip, so the mark falls on the sleeve; it is named "centre of mass" at the
// left margin, level with it, a hairline leading from the name through the body's back to the mark, so that it does
// not read as a mark on the arm. Layout: one row, the name, the person (90 pt to the metre, so 157.5 pt tall) LEAD
// to its right, the ring, and the table on the ring's long axis to its right, centred in height on the line to the
// person; the figure is as wide as these need.
import { Panel, v3, figure, sprite, tex, ellipsePoints, INK, DIM, FAINT, ACCENT, ACCENT2, PAGE } from '../lib.js';

// ---- the physics --------------------------------------------------------------------------------------
/** The tidal tensor beside a point mass, in units of GM/r^3, x along the line to the mass (the chapter). */
export const TIDE = [[-2, 0, 0], [0, 1, 0], [0, 0, 1]];
export const E = 0.25;              // the ring's strain, exaggerated for the eye
export const STATURE = 1.75;        // m, the person's height
export const DISTANCE = 1;          // m, from the centre of mass to the ring's centre
export const COM = 0.56;            // the centre of mass's height above the soles, as a fraction of the height

/** The relative acceleration -E xi of a bead whose undisturbed place is xi (in the ring's plane, x, y), in GM/r^3. */
export const accel = ([x, y]) => [-(TIDE[0][0] * x + TIDE[0][1] * y), -(TIDE[1][0] * x + TIDE[1][1] * y)];

// ---- the drawing --------------------------------------------------------------------------------------
const M = 1.5;                      // the ink's margin on every side
const K = 90;                       // points per metre: the person and the distance
const R0 = 36;                      // the undisturbed ring's radius, points (schematic)
const BEAD = 2.7;                   // a bead's radius
const STEEL = '#868b92';            // the beads: the steel of tidal.js and the other bead figures, a fixed grey
const REACH = 7.5;                  // an arrow's length per unit of -E xi / (GM/r^3), points
const HEAD = 3.2;                   // an arrow's head, or two fifths of the arrow if that is less
const TAIL = 1.2;                   // each arrow starts this far clear of its bead
const HAIR = 0.4;                   // the dimension's line, ticks and marks
const DIM_GAP = 6;                  // the dimension line runs this far below the dashed circle
const TICK = 2.5;                   // half the length of a tick
const PLUS = 2.2;                   // half the arms of the + at the ring's centre
const COM_R = 2.5;                  // the radius of the centre of mass's mark
const DOT = 0.55, DOT_STEP = 1.5;   // the extensions' dots: their size and spacing
const HAIRSPACE = 0.8;              // the least air between a dot and anything else
const STONE_INK = '#3b3024';        // marks on the stone: fixed, not a palette colour, so the site does not swap it
const LEAD = 5;                     // between the name of the centre of mass and the body's back, points
const TABLE_GAP = 14;               // between the right-hand orange arrow's tip and the table's ink
const SIZE = 8.5;                   // labels
const LABEL_GAP = 2.4;              // between the dimension line and the bottom of its label's ink, above it
const UNDISTURBED = [2.4, 2];       // the dashes of the undisturbed circle
const CLEAR = 0.36 * HEAD + 0.55 + 0.6;

const n2 = (x) => x.toFixed(2);

/** The ink box (figure points) of an SVG fragment, measured in the page. */
function inkBox(fragment) {
	const ns = 'http://www.w3.org/2000/svg';
	const svg = document.createElementNS(ns, 'svg');
	svg.setAttribute('width', '1000');
	svg.setAttribute('height', '1000');
	svg.innerHTML = `<g>${fragment}</g>`;
	document.body.appendChild(svg);
	const b = svg.firstChild.getBBox();
	svg.remove();
	return { l: b.x, r: b.x + b.width, t: b.y, b: b.y + b.height };
}

/** A TeX label whose ink box has its point (ax, ay) (fractions: 0 left/top, 1 right/bottom) at (x, y). */
async function placed(src, x, y, ax, ay, size = SIZE, color = INK) {
	const g = await tex(src, [0, 0], size, 'lt', color);
	const b = inkBox(g);
	const dx = x - (b.l + ax * (b.r - b.l)), dy = y - (b.t + ay * (b.b - b.t));
	return { svg: `<g transform="translate(${n2(dx)},${n2(dy)})">${g}</g>`, box: { l: b.l + dx, r: b.r + dx, t: b.t + dy, b: b.b + dy } };
}

/** Where a sprite has ink, its edges taken where the alpha passes half (as the edges of the vector ink are): [left, right, top, bottom] in pixels. */
async function spriteInk(s) {
	const img = new Image();
	img.src = s.href;
	await img.decode();
	const c = document.createElement('canvas');
	c.width = img.width; c.height = img.height;
	const ctx = c.getContext('2d');
	ctx.drawImage(img, 0, 0);
	const a = ctx.getImageData(0, 0, img.width, img.height).data;
	let l = Infinity, r = -1, t = Infinity, b = -1;
	for (let y = 0; y < img.height; y++) for (let x = 0; x < img.width; x++) if (a[(y * img.width + x) * 4 + 3] >= 128) {
		if (x < l) l = x; if (x > r) r = x; if (y < t) t = y; if (y > b) b = y;
	}
	return { l, r: r + 1, t, b: b + 1, alpha: (x, y) => a[(y * img.width + x) * 4 + 3] };
}

const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol;
function check(ok, what) {
	if (!ok) throw new Error('tut-tides: ' + what);
}

export default async function () {
	// the table: trace-free, diagonal, and its two kinds of entry
	check(TIDE[0][0] + TIDE[1][1] + TIDE[2][2] === 0, 'the table is not trace-free');
	check(TIDE.every((row, i) => row.every((v, j) => i === j || v === 0)), 'the table is not diagonal');

	// ---- the person, to scale: ink from the soles to the top of the head is STATURE metres, its top and left at M
	const person = await sprite('/figures3d/sprites/tut-person.png');
	const ink = await spriteInk(person);
	const px = (STATURE * K) / (ink.b - ink.t);                       // points per pixel of the sprite
	// the name of the centre of mass stands at the left margin, level with it, LEAD clear of the body's back; the
	// person stands to its right. First the body's back at that height with the sprite's ink at the margin, then the
	// shift that puts the back LEAD right of the name.
	const comName = await placed('\\text{centre of mass}', 0, 0, 0, 0.5);
	const nameW = comName.box.r - comName.box.l;
	const sy = M - ink.t * px;                                         // the sprite's top
	const H = M + STATURE * K + M;
	const soles = H - M;
	const axisY = soles - COM * STATURE * K;                          // the centre of mass's height: the ring's axis
	/** The body's back and front (figure points) at the height y, the sprite's left edge at x0. */
	let sx = M - ink.l * px;
	const across = (y) => {
		const row = Math.round((y - sy) / px - 0.5);
		let front = -1, back = -1;
		for (let x = 0; x < person.w; x++) if (ink.alpha(x, row) > 128) { if (back < 0) back = x; front = x + 1; }
		check(back >= 0, 'no body at the height ' + y);
		return [sx + back * px, sx + front * px];
	};
	sx += M + nameW + LEAD - across(axisY)[0];                        // the sprite's left edge
	check(near(across(axisY)[0], M + nameW + LEAD, 1e-9), 'the body\'s back is not LEAD clear of the name');
	// the centre of mass: halfway through the body at that height
	const comX = across(axisY).reduce((a, b) => a + b) / 2;
	const name = await placed('\\text{centre of mass}', M, axisY, 0, 0.5);
	check(near(name.box.l, M, 0.02), 'the name is not at the left margin');
	// no part of the body comes nearer the name than LEAD, above or below the line
	for (let y = Math.floor(name.box.t) - 3; y <= Math.ceil(name.box.b) + 3; y += 0.25) check(across(y)[0] >= name.box.r + LEAD - 0.6, 'the body comes too near the name of the centre of mass');
	check(name.box.t >= M && name.box.b <= H - M, 'the name reaches past the margins');

	// ---- the ring, one metre from the centre of mass, level with it
	const cx = comX + DISTANCE * K, cy = axisY;
	check(near(cx - comX, K), 'the distance is not one metre');
	// the ring is moved by e times -E xi: semi-axes 1 + 2e along the line, 1 - e across it
	const [ax, ay] = [1 + E * accel([1, 0])[0], 1 + E * accel([0, 1])[1]];
	check(near(ax, 1 + 2 * E) && near(ay, 1 - E), 'the ellipse is not 1 + 2e by 1 - e');

	// ---- the table, right of the ring on its long axis: its ink TABLE_GAP clear of the far orange arrow's tip and
	// centred in height on the line to the person; the figure ends at its right
	const z = (v) => (v === 0 ? `\\color{${FAINT}}{0}` : `\\color{${v < 0 ? ACCENT : ACCENT2}}{${v}}`);
	const tableSrc = `GM/r^3\\,\\begin{pmatrix}${TIDE.map((r) => r.map(z).join('&')).join('\\\\')}\\end{pmatrix}`;
	const farTip = cx + ax * R0 + BEAD + TAIL + Math.hypot(...accel([1, 0])) * REACH;
	const table = await placed(tableSrc, farTip + TABLE_GAP, cy, 0, 0.5);
	const W = +(table.box.r + M).toFixed(2);

	const page = new Panel({ x: 0, y: 0, w: W, h: H, scale: 1 });     // figure coordinates
	const fp = (X, Y) => v3(X - W / 2, H / 2 - Y, 0);
	const draw = (svg, layer) => page.items.push({ kind: 'raw', layer, depth: 0, svg });
	// x on the page points away from the person, y up; the figure's y runs down
	const at = (x, y) => [cx + R0 * x, cy - R0 * y];
	page.curve(ellipsePoints(0, 0, 0, ax, ay).map((p) => fp(...at(p.x, p.y))), { color: INK, width: 0.65, layer: 2 });
	const arrows = [];
	for (let k = 0; k < 12; k++) {
		const t = (2 * Math.PI * k) / 12;
		const xi = [Math.cos(t), Math.sin(t)];
		const bead = [ax * xi[0], ay * xi[1]];
		check(near((bead[0] / ax) ** 2 + (bead[1] / ay) ** 2, 1), `bead ${k} is off the ellipse`);
		const a = accel(xi), moved = [xi[0] + E * a[0], xi[1] + E * a[1]];
		check(near(moved[0], bead[0]) && near(moved[1], bead[1]), `bead ${k} is not the image of its place on the circle`);
		page.sphere(fp(...at(...bead)), BEAD, STEEL, { spec: 0.6, shininess: 36, layer: 3 });
		if (k % 3) continue;
		// an arrow at each bead on the axes: -E xi, from TAIL clear of the bead
		const L = Math.hypot(...a) * REACH, u = [a[0] / Math.hypot(...a), a[1] / Math.hypot(...a)];
		const B = at(...bead);
		const from = [B[0] + u[0] * (BEAD + TAIL), B[1] - u[1] * (BEAD + TAIL)];
		const to = [from[0] + u[0] * L, from[1] - u[1] * L];
		const stretch = a[0] * xi[0] + a[1] * xi[1] > 0;              // outward: the beads move apart
		const head = Math.min(HEAD, 0.4 * L);
		page.arrow(fp(...from), fp(...to), { color: stretch ? ACCENT : ACCENT2, width: 0.55, head, layer: 4 });
		arrows.push({ k, from, to, L, head, stretch });
	}
	// the arrows: orange on the line pointing out, blue across it pointing in, each orange twice each blue
	const orange = arrows.filter((a) => a.stretch), blue = arrows.filter((a) => !a.stretch);
	check(orange.length === 2 && blue.length === 2, 'not two arrows of each kind');
	check(orange.every((a) => a.k % 6 === 0) && blue.every((a) => a.k % 6 === 3), 'the stretch is not along the line');
	const len = (a) => Math.hypot(a.to[0] - a.from[0], a.to[1] - a.from[1]);
	for (const o of orange) for (const b of blue) check(near(len(o) / len(b), 2, 1e-9), 'an orange arrow is not twice a blue one');
	check(arrows.every((a) => a.head <= 0.4 * a.L + 1e-12), 'a head longer than two fifths of its arrow');
	for (const a of orange) check(Math.sign(a.to[0] - a.from[0]) === Math.sign(a.from[0] - cx) && near(a.from[1], cy), 'an orange arrow does not point away along the line');
	for (const a of blue) check(Math.sign(a.to[1] - a.from[1]) === Math.sign(cy - a.from[1]) && near(a.from[0], cx), 'a blue arrow does not point to the centre');

	// the undisturbed circle, dashed, no dash beside an arrow
	{
		const pts = ellipsePoints(0, 0, 0, 1, 1).map((p) => fp(...at(p.x, p.y)));
		const F = pts.map((q) => page.at(q));
		const nearArrow = (q) => arrows.some(({ from: A, to: B }) => {
			const d = [B[0] - A[0], B[1] - A[1]], t = Math.max(0, Math.min(1, ((q[0] - A[0]) * d[0] + (q[1] - A[1]) * d[1]) / (d[0] ** 2 + d[1] ** 2)));
			return Math.hypot(q[0] - A[0] - t * d[0], q[1] - A[1] - t * d[1]) < CLEAR;
		});
		const s = [0];
		for (let i = 1; i < F.length; i++) s.push(s[i - 1] + Math.hypot(F[i][0] - F[i - 1][0], F[i][1] - F[i - 1][1]));
		const [on, off] = UNDISTURBED;
		const total = s[s.length - 1], n = Math.round(total / (on + off)), period = total / n, dash = (on * period) / (on + off);
		const atS = (x) => {
			x = ((x % total) + total) % total;
			let i = 1;
			while (s[i] < x) i++;
			const f = (x - s[i - 1]) / (s[i] - s[i - 1] || 1);
			return pts[i - 1].clone().lerp(pts[i], f);
		};
		for (let k = 0; k < n; k++) {
			const x0 = k * period - dash / 2;
			const seg = Array.from({ length: 7 }, (_, j) => atS(x0 + (dash * j) / 6));
			if (seg.some((q) => nearArrow(page.at(q)))) continue;
			page.curve(seg, { color: DIM, width: 0.5, layer: 1 });
		}
	}

	// ---- the dimension: below the ring, clear of the dashed circle, from the centre of mass's x to the ring's
	// centre's; a tick at each end, and a dotted extension down to each tick from its mark: the centre of mass's
	// quartered circle on the body, and a small + at the ring's centre
	const dimY = cy + R0 + DIM_GAP;
	const tick = (x) => `M${n2(x)},${n2(dimY - TICK)}V${n2(dimY + TICK)}`;
	// the dots of an extension at x, from y0 down to y1, evenly spaced, leaving out those within a hair of `avoid`
	const dotted = (x, y0, y1, avoid = () => false) => {
		const n = Math.round((y1 - y0) / DOT_STEP), step = (y1 - y0) / n;
		return Array.from({ length: n + 1 }, (_, i) => y0 + i * step).filter((y) => !avoid(x, y)).map((y) => `M${n2(x)},${n2(y)}h0`).join('');
	};
	// the ring's extension passes the lower blue arrow, the bottom bead (on the ellipse) and the dashed circle
	const low = blue.find((a) => a.from[1] > cy);
	const clearOf = (x, y) => {
		const r = DOT / 2 + HAIRSPACE;
		const onArrow = y > Math.min(low.from[1], low.to[1]) - r && y < Math.max(low.from[1], low.to[1]) + r;
		const onBead = Math.hypot(x - cx, y - (cy + ay * R0)) < BEAD + r;
		const onCircle = Math.abs(Math.hypot(x - cx, y - cy) - R0) < 0.25 + r;
		return onArrow || onBead || onCircle;
	};
	const ringDots = dotted(cx, cy + PLUS + HAIRSPACE + DOT / 2, dimY - TICK - HAIRSPACE - DOT / 2, clearOf);
	const comDots = dotted(comX, cy + COM_R + HAIRSPACE + DOT / 2, dimY - TICK - HAIRSPACE - DOT / 2);
	const quarters = (x, y, r) => `M${n2(x)},${n2(y)}L${n2(x - r)},${n2(y)}A${r},${r} 0 0 1 ${n2(x)},${n2(y - r)}Z` +
		`M${n2(x)},${n2(y)}L${n2(x + r)},${n2(y)}A${r},${r} 0 0 1 ${n2(x)},${n2(y + r)}Z`;
	/** The whole dimension in one colour. */
	const dimension = (c) =>
		`<path d="M${n2(comX)},${n2(dimY)}H${n2(cx)}${tick(comX)}${tick(cx)}" stroke="${c}" stroke-width="${HAIR}" fill="none"/>` +
		`<path d="M${n2(name.box.r + HAIRSPACE + 1)},${n2(cy)}H${n2(comX - COM_R - HAIRSPACE)}" stroke="${c}" stroke-width="${HAIR}" fill="none"/>` +
		`<path d="${comDots}${ringDots}" stroke="${c}" stroke-width="${DOT}" stroke-linecap="round" fill="none"/>` +
		`<path d="M${n2(cx - PLUS)},${n2(cy)}H${n2(cx + PLUS)}M${n2(cx)},${n2(cy - PLUS)}V${n2(cy + PLUS)}" stroke="${c}" stroke-width="${HAIR}" fill="none"/>` +
		`<path d="${quarters(comX, cy, COM_R)}" fill="${c}"/>` +
		`<circle cx="${n2(comX)}" cy="${n2(cy)}" r="${COM_R}" fill="none" stroke="${c}" stroke-width="${HAIR}"/>`;
	// in the page's ink beneath the stone, and again in a fixed dark ink over it, masked by the stone's own alpha,
	// so that each mark changes colour exactly where it crosses the stone's edge and reads on it in both themes
	check(across(cy)[0] < comX - COM_R - 1 && across(cy)[1] > comX + COM_R + 1, 'the centre of mass\'s mark does not lie on the body');
	check(across(dimY)[0] < comX - 1 && across(dimY)[1] > comX + 1, 'the dimension\'s left end does not lie on the body');
	// the colours the site swaps for its dark theme (app/src/lib/paper/figures.ts, THEME)
	check(![INK, DIM, FAINT, ACCENT, ACCENT2, PAGE, '#c9c4b8', '#dce7f3', '#eeebe5', '#f3dfcb'].includes(STONE_INK), 'the stone\'s ink is a colour the site swaps');
	draw(dimension(INK), 0);
	draw(`<defs><image id="tut-tides-person" class="art" href="${person.href}" x="${n2(sx)}" y="${n2(sy)}" width="${n2(person.w * px)}" height="${n2(person.h * px)}" preserveAspectRatio="none"/>` +
		`<mask id="tut-tides-stone" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${n2(H)}"><use href="#tut-tides-person"/></mask></defs>` +
		`<use href="#tut-tides-person"/><g mask="url(#tut-tides-stone)">${dimension(STONE_INK)}</g>`, 0.5);
	const one = await placed('\\text{1 m}', (comX + cx) / 2, dimY - HAIR / 2 - LABEL_GAP, 0.5, 1);
	check(ringDots.length > 0 && comDots.length > 0, 'an extension has no dots');

	// ---- nothing overlaps; the ink's margins
	const nearTip = Math.min(...orange.map((a) => a.to[0]));
	const ringBox = {
		l: Math.min(nearTip, cx - ax * R0 - BEAD), r: Math.max(...orange.map((a) => a.to[0]), cx + ax * R0 + BEAD),
		t: cy - R0 - 0.25, b: cy + R0 + 0.25
	};
	const dimBox = { l: comX - HAIR, r: cx + HAIR, t: dimY - TICK, b: dimY + TICK };
	const apart = (p, q, gap) => p.r + gap <= q.l || q.r + gap <= p.l || p.b + gap <= q.t || q.b + gap <= p.t;
	check(dimY - TICK > cy + R0 + 0.25 + 2, 'the dimension is not clear below the dashed circle');
	check(apart(table.box, ringBox, 6) && apart(table.box, dimBox, 6) && apart(table.box, one.box, 6), 'the table touches the ring or the dimension');
	// the label against the ring's actual marks: the ellipse, the dashed circle, the beads and the arrows
	const toBox = (b, [x, y]) => Math.hypot(Math.max(b.l - x, 0, x - b.r), Math.max(b.t - y, 0, y - b.b));
	const ringMarks = [
		...ellipsePoints(0, 0, 0, ax, ay, 0, 720).map((q) => [at(q.x, q.y), 0.33]),
		...ellipsePoints(0, 0, 0, 1, 1, 0, 720).map((q) => [at(q.x, q.y), 0.25]),
		...Array.from({ length: 12 }, (_, k) => [at(ax * Math.cos((k * Math.PI) / 6), ay * Math.sin((k * Math.PI) / 6)), BEAD]),
		...arrows.flatMap((a) => Array.from({ length: 41 }, (_, i) => [[a.from[0] + ((a.to[0] - a.from[0]) * i) / 40, a.from[1] + ((a.to[1] - a.from[1]) * i) / 40], 0.36 * a.head]))
	];
	const clearOfRing = (b, gap) => ringMarks.every(([q, r]) => toBox(b, q) >= r + gap);
	check(clearOfRing(one.box, 3), 'the label touches the ring');
	check(one.box.l > across(one.box.b)[1] + 3 && one.box.l > across(one.box.t)[1] + 3, 'the label touches the body');
	check(ringBox.r <= W - M, 'the ring reaches past the margin');
	check(near(table.box.r, W - M, 0.02) && near((table.box.t + table.box.b) / 2, cy, 0.02), 'the table is not at the right margin, on the axis');
	check(near(table.box.l - Math.max(...orange.map((a) => a.to[0])), TABLE_GAP, 1e-6), 'the table is not TABLE_GAP clear of the arrow');
	check(table.box.t >= M && table.box.b <= H - M, 'the table reaches past the margins');
	window.tutTides = ({ H: +H.toFixed(2), comX: +comX.toFixed(2), cx: +cx.toFixed(2), cy: +cy.toFixed(2), dimY: +dimY.toFixed(2), ring: ringBox, table: table.box, label: one.box,
		arrows: arrows.map((a) => ({ k: a.k, L: +len(a).toFixed(3), head: a.head })) });

	return figure(W, +H.toFixed(2), [page], [one.svg, table.svg, name.svg]);
}
