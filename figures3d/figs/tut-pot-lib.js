// Shared tools for the three diagrams of the tutorial's section 1.2 (tutorial/newton/field-and-potential.md):
// tut-pot-room, tut-pot-contours and tut-pot-well. Not a figure itself. The strokes, heads, dots and labels are those
// of section 1.1's diagrams (figs/tut-vec-lib.js), so that the two chapters look alike.
//
// A Sheet draws in figure points (y down) and remembers every mark it makes as polylines with a half-width (or as
// filled boxes), so that each label can be checked against the marks themselves. The finished figure is cropped to
// its ink, measured in pixels, with the same margin on every side.
import { tex, figure, Panel, v3, INK, DIM } from '../lib.js';

export const SIZE = 8.5;            // labels, as in the paper's figures
export const M = 1.5;               // the ink's margin on every side
export const AXIS = 0.45;           // an axis's stroke
export const AXIS_HEAD = 3.2;       // an axis's head
export const VEC = 0.75;            // a vector's stroke
export const VEC_HEAD = 4.4;        // a vector's head, or two fifths of the vector if that is less
export const LINE = 0.55;           // a curve that is the subject (a contour, the potential)
export const HAIR = 0.4;            // ticks, dimensions, right-angle marks
export const RIGHT = 3.6;           // the side of a right-angle mark, points
export const DOT = 0.6, DOT_STEP = 1.6;   // dotted lines: the dots' size and spacing
export const TICK = 2.5;            // half a tick
export const LABEL_GAP = 2.2;       // the least air between a label's ink and any mark

const CANVAS = 700;                 // the provisional page, points, before the figure is cropped to its ink
const K = 8;                        // pixels per point when the ink is measured

export const n2 = (x) => +x.toFixed(2);
export const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol;
// with ?soft in the page's address (a draft), a failed check is logged instead of stopping the figure
const SOFT = typeof location !== 'undefined' && new URLSearchParams(location.search).has('soft');
export const checker = (name) => (ok, what) => {
	if (ok) return;
	if (SOFT) console.warn(`${name}: ${what}`);
	else throw new Error(`${name}: ${what}`);
};

/** The ink box (figure points) of an SVG fragment, measured in the page. */
export function boxOf(fragment) {
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
export async function placed(src, x, y, ax, ay, color = INK, size = SIZE) {
	const g = await tex(src, [0, 0], size, 'lt', color);
	const b = boxOf(g);
	const dx = x - (b.l + ax * (b.r - b.l)), dy = y - (b.t + ay * (b.b - b.t));
	return { src, svg: `<g transform="translate(${n2(dx)},${n2(dy)})">${g}</g>`, box: { l: b.l + dx, r: b.r + dx, t: b.t + dy, b: b.b + dy } };
}

/** A TeX label set beside the point q (figure points), `gap` points of air away from it in the direction u (a unit
 * vector, figure coordinates, y down): the label's box touches the line through q + gap u at right angles to u. */
export async function beside(src, q, u, gap = LABEL_GAP, color = INK, size = SIZE) {
	const probe = await placed(src, 0, 0, 0.5, 0.5, color, size);
	const hw = (probe.box.r - probe.box.l) / 2, hh = (probe.box.b - probe.box.t) / 2;
	const reach = Math.abs(u[0]) * hw + Math.abs(u[1]) * hh;
	return placed(src, q[0] + u[0] * (gap + reach), q[1] + u[1] * (gap + reach), 0.5, 0.5, color, size);
}

/** The distance from a box to a point. */
export const toBox = (b, [x, y]) => Math.hypot(Math.max(b.l - x, 0, x - b.r), Math.max(b.t - y, 0, y - b.b));

function boxToSegment(b, a, c) {
	const n = Math.max(2, Math.ceil(Math.hypot(c[0] - a[0], c[1] - a[1]) / 0.05));
	let d = Infinity;
	for (let i = 0; i <= n; i++) d = Math.min(d, toBox(b, [a[0] + ((c[0] - a[0]) * i) / n, a[1] + ((c[1] - a[1]) * i) / n]));
	return d;
}
const boxToBox = (p, q) => Math.hypot(Math.max(p.l - q.r, 0, q.l - p.r), Math.max(p.t - q.b, 0, q.t - p.b));

/** The page: figure points, y down. Everything drawn is raw SVG on one Panel at layers; every mark is remembered. */
export class Sheet {
	constructor(name) {
		this.name = name;
		this.P = new Panel({ x: 0, y: 0, w: CANVAS, h: CANVAS, scale: 1 });
		this.marks = [];          // { pts: [[x, y], ...], r: half-width, what }
		this.boxes = [];          // { box, what }: filled shapes, by their bounding boxes
		this.arrows = [];         // { L, head, what }
	}

	/** A lit sphere of radius r points at the figure point c (lib.js, Panel.sphere). */
	sphere(c, r, color, o = {}, what = 'a sphere') {
		this.P.sphere(v3(c[0] - CANVAS / 2, CANVAS / 2 - c[1], 0), r, color, { layer: 2, ...o });
		this.mark([c], r, what);
	}

	raw(svg, layer = 1) {
		this.P.items.push({ kind: 'raw', layer, depth: 0, svg });
	}

	mark(pts, r, what) {
		this.marks.push({ pts, r, what });
	}

	/** A polyline through figure points; `closed` joins its ends. */
	path(pts, { color = INK, width = AXIS, layer = 1, dash = null, closed = false, cap = 'round', what = 'a line' } = {}) {
		const d = 'M' + pts.map(([x, y]) => `${n2(x)},${n2(y)}`).join('L') + (closed ? 'Z' : '');
		this.raw(`<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="${cap}" stroke-linejoin="round"${dash ? ` stroke-dasharray="${dash.join(' ')}"` : ''}/>`, layer);
		this.mark(closed ? [...pts, pts[0]] : pts, width / 2, what);
	}

	/** A filled shape (path data `d`), remembered by its bounding box `box`. */
	fill(d, box, { color = INK, layer = 1, rule = 'nonzero', what = 'a shape', solid = true } = {}) {
		this.raw(`<path d="${d}" fill="${color}" fill-rule="${rule}"/>`, layer);
		if (solid) this.boxes.push({ box, what });
	}

	/** An arrow between two figure points, its head `head` points long or two fifths of the arrow if that is less. */
	arrow(A, B, { color = INK, width = VEC, head = VEC_HEAD, layer = 2, what = 'an arrow' } = {}) {
		const L = Math.hypot(B[0] - A[0], B[1] - A[1]);
		const hd = Math.min(head, 0.4 * L);
		const u = [(B[0] - A[0]) / L, (B[1] - A[1]) / L], w = [-u[1], u[0]], hw = 0.36 * hd;
		const base = [B[0] - u[0] * hd, B[1] - u[1] * hd];
		const s1 = [B[0] - u[0] * hd * 0.8, B[1] - u[1] * hd * 0.8];
		this.raw(`<path d="M${n2(A[0])},${n2(A[1])}L${n2(s1[0])},${n2(s1[1])}" stroke="${color}" stroke-width="${width}" fill="none"/>` +
			`<path d="M${n2(B[0])},${n2(B[1])}L${n2(base[0] + w[0] * hw)},${n2(base[1] + w[1] * hw)}L${n2(base[0] - w[0] * hw)},${n2(base[1] - w[1] * hw)}Z" fill="${color}"/>`, layer);
		this.mark([A, s1], width / 2, what);
		this.mark([B, [base[0] + w[0] * hw, base[1] + w[1] * hw], [base[0] - w[0] * hw, base[1] - w[1] * hw], B], 0, what + "'s head");
		this.arrows.push({ L, head: hd, what });
		return { A, B, L, head: hd, u };
	}

	/** A dotted line between two figure points: round dots evenly spaced, the first and last `clear0`, `clear1`
	 * points in from the ends. */
	dots(A, B, { color = DIM, clear0 = 0, clear1 = 0, layer = 1, what = 'a dotted line' } = {}) {
		const L = Math.hypot(B[0] - A[0], B[1] - A[1]);
		const u = [(B[0] - A[0]) / L, (B[1] - A[1]) / L];
		const s0 = clear0 + DOT / 2, s1 = L - clear1 - DOT / 2;
		const n = Math.max(1, Math.round((s1 - s0) / DOT_STEP)), step = (s1 - s0) / n;
		const pts = Array.from({ length: n + 1 }, (_, i) => [A[0] + u[0] * (s0 + i * step), A[1] + u[1] * (s0 + i * step)]);
		this.raw(`<path d="${pts.map(([x, y]) => `M${n2(x)},${n2(y)}h0`).join('')}" stroke="${color}" stroke-width="${DOT}" stroke-linecap="round" fill="none"/>`, layer);
		this.mark([pts[0], pts[pts.length - 1]], DOT / 2, what);
		return { step, n, pts };
	}

	/** The least air between a box and any mark (and filled shape), and the mark nearest it; `skip` names marks to pass over. */
	clearance(box, skip = () => false) {
		let best = { d: Infinity, what: '' };
		for (const m of this.marks) {
			if (skip(m.what)) continue;
			for (let i = 1; i < m.pts.length; i++) {
				const d = boxToSegment(box, m.pts[i - 1], m.pts[i]) - m.r;
				if (d < best.d) best = { d, what: m.what };
			}
			if (m.pts.length === 1) {
				const d = toBox(box, m.pts[0]) - m.r;
				if (d < best.d) best = { d, what: m.what };
			}
		}
		for (const s of this.boxes) {
			if (skip(s.what)) continue;
			const d = boxToBox(box, s.box);
			if (d < best.d) best = { d, what: s.what };
		}
		return best;
	}

	/** A label placed as by `placed` at (x, y), then moved along the unit vector `dir` (figure coordinates) by the
	 * least distance, in steps of a twentieth of a point, that leaves `gap` of air between it and every mark. */
	async clear(src, x, y, ax, ay, dir, { color = INK, gap = LABEL_GAP + 0.2, size = SIZE } = {}) {
		const L = await placed(src, x, y, ax, ay, color, size);
		for (let s = 0; s < 60; s += 0.05) {
			const box = { l: L.box.l + dir[0] * s, r: L.box.r + dir[0] * s, t: L.box.t + dir[1] * s, b: L.box.b + dir[1] * s };
			if (this.clearance(box).d >= gap) return placed(src, x + dir[0] * s, y + dir[1] * s, ax, ay, color, size);
		}
		throw new Error(`${this.name}: no room for the label ${src}`);
	}

	/** Every label clears every mark and every other label by `gap`, and no head is longer than two fifths of its
	 * arrow. A label may name marks it is allowed to sit on (`label.on`, e.g. a filled region it lies inside). */
	checkAll(labels, gap = LABEL_GAP - 0.05) {
		const check = checker(this.name);
		for (const a of this.arrows) check(a.head <= 0.4 * a.L + 1e-9, `${a.what}: a head longer than two fifths of its arrow`);
		for (const l of labels) {
			const c = this.clearance(l.box, (w) => (l.on ?? []).includes(w));
			check(c.d >= gap, `the label ${l.src} is ${c.d.toFixed(2)} pt from ${c.what}`);
		}
		const apart = (p, q) => p.r + gap <= q.l || q.r + gap <= p.l || p.b + gap <= q.t || q.b + gap <= p.t;
		for (let i = 0; i < labels.length; i++) for (let j = i + 1; j < labels.length; j++)
			check(apart(labels[i].box, labels[j].box), `the labels ${labels[i].src} and ${labels[j].src} touch`);
	}
}

/** Where an SVG has ink: [left, right, top, bottom] in its own units, painted at K pixels per unit. */
async function inkOf(svg, w, h) {
	const img = new Image();
	img.src = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
	await img.decode();
	const c = document.createElement('canvas');
	c.width = Math.ceil(w * K); c.height = Math.ceil(h * K);
	const ctx = c.getContext('2d');
	ctx.drawImage(img, 0, 0, c.width, c.height);
	const a = ctx.getImageData(0, 0, c.width, c.height).data;
	let l = Infinity, r = -1, t = Infinity, b = -1;
	for (let y = 0; y < c.height; y++) for (let x = 0; x < c.width; x++) if (a[(y * c.width + x) * 4 + 3] > 8) {
		if (x < l) l = x; if (x > r) r = x; if (y < t) t = y; if (y > b) b = y;
	}
	return { l: l / K, r: (r + 1) / K, t: t / K, b: (b + 1) / K };
}

/** The provisional page's centre: draw about it. */
export const ORIGIN = CANVAS / 2;

/** The figure, cropped to its ink with the margin M on every side; `width` its allowed range of widths. */
export async function finish(sheet, labels, width = [240, 340], defs = '') {
	const name = sheet.name;
	const check = checker(name);
	const raw = (await figure(CANVAS, CANVAS, [sheet.P], labels.map((l) => Promise.resolve(l.svg)))).replace('<defs>', `<defs>${defs}`);
	const ink = await inkOf(raw, CANVAS, CANVAS);
	check(ink.l > 1 && ink.t > 1 && ink.r < CANVAS - 1 && ink.b < CANVAS - 1, 'the ink reaches the provisional page\'s edge');
	const W = n2(ink.r - ink.l + 2 * M), H = n2(ink.b - ink.t + 2 * M);
	const [head, rest] = [raw.slice(0, raw.indexOf('</defs>') + 7), raw.slice(raw.indexOf('</defs>') + 7, raw.lastIndexOf('</svg>'))];
	const svg = head.replace(/width="[^"]*" height="[^"]*" viewBox="[^"]*"/, `width="${W}pt" height="${H}pt" viewBox="0 0 ${W} ${H}"`) +
		`<g transform="translate(${n2(M - ink.l)},${n2(M - ink.t)})">${rest}</g></svg>`;
	const out = await inkOf(svg, W, H);
	const tol = 1.5 / K + 0.01;
	check(near(out.l, M, tol) && near(out.t, M, tol) && near(W - out.r, M, tol) && near(H - out.b, M, tol),
		`the margins are not equal: ${[out.l, out.t, W - out.r, H - out.b].map((v) => v.toFixed(2)).join(', ')}`);
	check(W >= width[0] && W <= width[1], `the width ${W} pt is outside ${width.join('–')} pt`);
	window[name] = { W, H, margins: [out.l, out.t, W - out.r, H - out.b].map(n2), shift: [n2(M - ink.l), n2(M - ink.t)] };
	return svg;
}
