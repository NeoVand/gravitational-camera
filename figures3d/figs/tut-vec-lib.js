// Shared tools for the four diagrams of the tutorial's section 1.1 (tutorial/newton/vectors-and-indices.md):
// tut-vec-shadows, tut-vec-turn, tut-vec-cyclic and tut-vec-projector. Not a figure itself.
//
// A Sheet draws through a Panel (its projection, tilt and turn) and remembers every mark it makes, in figure
// points, as polylines with a half-width, so that a label can be checked against the marks themselves. The
// finished figure is cropped to its ink, measured in pixels, with the same margin on every side.
import { tex, figure, INK, DIM } from '../lib.js';

export const SIZE = 8.5;            // labels, as in the paper's figures
export const M = 1.5;               // the ink's margin on every side
export const AXIS = 0.45;           // an axis's stroke
export const AXIS_HEAD = 3.2;       // an axis's head
export const VEC = 0.75;            // a vector's stroke
export const VEC_HEAD = 4.4;        // a vector's head, or two fifths of the vector if that is less
export const RIGHT = 3.6;           // the side of a right-angle mark, points
export const HAIR = 0.4;            // right-angle marks
export const DOT = 0.6, DOT_STEP = 1.6;   // dotted lines: the dots' size and spacing
export const DASH = [2.4, 1.8];     // dashed lines
export const LABEL_GAP = 2.2;
export const ORIGIN_DOT = 1.05;      // the origin's dot, radius       // the least air between a label's ink and any mark

const CANVAS = 440;                 // the provisional page, points, before the figure is cropped to its ink
const K = 12;                       // pixels per point when the ink is measured

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

/** The least air between a dot and a stroke it passes. */
export const HAIRSPACE = 0.8;

/** The distance from the point q to the segment a-b. */
function segDist(q, a, b) {
	const d = [b[0] - a[0], b[1] - a[1]], l2 = d[0] ** 2 + d[1] ** 2;
	const t = l2 ? Math.max(0, Math.min(1, ((q[0] - a[0]) * d[0] + (q[1] - a[1]) * d[1]) / l2)) : 0;
	return Math.hypot(q[0] - a[0] - t * d[0], q[1] - a[1] - t * d[1]);
}

/** Whether q lies inside the triangle (a closed path of four points, the last the first). */
function inTriangle(q, [a, b, c]) {
	const s = (p1, p2) => (p2[0] - p1[0]) * (q[1] - p1[1]) - (p2[1] - p1[1]) * (q[0] - p1[0]);
	const [x, y, z] = [s(a, b), s(b, c), s(c, a)];
	return (x >= 0 && y >= 0 && z >= 0) || (x <= 0 && y <= 0 && z <= 0);
}

/** The distance from a box to a point. */
export const toBox = (b, [x, y]) => Math.hypot(Math.max(b.l - x, 0, x - b.r), Math.max(b.t - y, 0, y - b.b));

/** The distance from a box to the segment a-b (sampled finely enough for a check to a hundredth of a point). */
function boxToSegment(b, a, c) {
	const n = Math.max(2, Math.ceil(Math.hypot(c[0] - a[0], c[1] - a[1]) / 0.05));
	let d = Infinity;
	for (let i = 0; i <= n; i++) d = Math.min(d, toBox(b, [a[0] + ((c[0] - a[0]) * i) / n, a[1] + ((c[1] - a[1]) * i) / n]));
	return d;
}

export class Sheet {
	/** Draws through the panel `P`; `name` for the messages of the checks. */
	constructor(P, name) {
		this.P = P;
		this.name = name;
		this.marks = [];          // { pts: [[x, y], ...] figure points, r: half-width, what }
		this.arrows = [];         // { L, head, what }
	}

	at(p) {
		return this.P.at(p);
	}

	mark(pts, r, what) {
		this.marks.push({ pts, r, what });
	}

	/** A straight line between two world points. */
	line(a, b, { color = INK, width = AXIS, layer = 1, dash = null, what = 'a line' } = {}) {
		if (dash) {
			// a whole number of dashes, a dash at each end: the pattern stretched to fit the line as drawn
			const A = this.at(a), B = this.at(b), L = Math.hypot(B[0] - A[0], B[1] - A[1]);
			const k = Math.max(1, Math.round((L + dash[1]) / (dash[0] + dash[1]))), f = (L + dash[1]) / (k * (dash[0] + dash[1]));
			dash = dash.map((d) => n2(d * f));
		}
		this.P.curve([a, b], { color, width, layer, dash, cap: dash ? 'butt' : 'round' });
		this.mark([this.at(a), this.at(b)], width / 2, what);
	}

	/** A curve through world points. */
	curve(pts, { color = INK, width = AXIS, layer = 1, what = 'a curve' } = {}) {
		this.P.curve(pts, { color, width, layer });
		this.mark(pts.map((p) => this.at(p)), width / 2, what);
	}

	/** An arrow between two world points, its head `head` points long or two fifths of the arrow if that is less. */
	arrow(a, b, { color = INK, width = VEC, head = VEC_HEAD, layer = 2, what = 'an arrow' } = {}) {
		const A = this.at(a), B = this.at(b);
		const L = Math.hypot(B[0] - A[0], B[1] - A[1]);
		const hd = Math.min(head, 0.4 * L);
		this.P.arrow(a, b, { color, width, head: hd, layer });
		// the head: a triangle hd long and 0.72 hd wide at its base (lib.js, Panel.render)
		const u = [(B[0] - A[0]) / L, (B[1] - A[1]) / L], w = [-u[1], u[0]], hw = 0.36 * hd;
		const base = [B[0] - u[0] * hd, B[1] - u[1] * hd];
		this.mark([A, B], width / 2, what);
		this.mark([B, [base[0] + w[0] * hw, base[1] + w[1] * hw], [base[0] - w[0] * hw, base[1] - w[1] * hw], B], 0, what + "'s head");
		this.arrows.push({ L, head: hd, what });
		return { A, B, L, head: hd, u };
	}

	/** A dotted line between two world points: round dots evenly spaced, the first and last `clear0`, `clear1`
	 * points (figure) in from the ends. */
	dots(a, b, { color = DIM, clear0 = 0, clear1 = 0, layer = 1, avoid = [], what = 'a dotted line' } = {}) {
		const A = this.at(a), B = this.at(b);
		const L = Math.hypot(B[0] - A[0], B[1] - A[1]);
		const u = [(B[0] - A[0]) / L, (B[1] - A[1]) / L];
		const s0 = clear0 + DOT / 2, s1 = L - clear1 - DOT / 2;
		const n = Math.max(1, Math.round((s1 - s0) / DOT_STEP)), step = (s1 - s0) / n;
		// the dots, evenly spaced; those within HAIRSPACE of a mark named in `avoid` are left out, so that the line
		// passes under a stroke it crosses, and stops short of an arrow it starts from, with air on either side
		const marks = this.marks.filter((m) => avoid.some((w) => m.what.startsWith(w)));
		const clear = (q) => marks.every((m) => {
			const d = m.pts.length === 1 ? Math.hypot(q[0] - m.pts[0][0], q[1] - m.pts[0][1]) : Math.min(...m.pts.slice(1).map((p, i) => segDist(q, m.pts[i], p)));
			// a closed mark (a head) holds the points inside it too
			return d - m.r - DOT / 2 >= HAIRSPACE && !(m.pts.length === 4 && inTriangle(q, m.pts));
		});
		const pts = Array.from({ length: n + 1 }, (_, i) => [A[0] + u[0] * (s0 + i * step), A[1] + u[1] * (s0 + i * step)]).filter(clear);
		this.P.items.push({ kind: 'raw', layer, depth: 0,
			svg: `<path d="${pts.map(([x, y]) => `M${n2(x)},${n2(y)}h0`).join('')}" stroke="${color}" stroke-width="${DOT}" stroke-linecap="round" fill="none"/>` });
		for (const q of pts) this.mark([q], DOT / 2, what);
		return { step, n, pts };
	}

	/** A small round dot at the world point p (the origin, where arrows start), over the arrows' butt ends. */
	dot(p, { r = ORIGIN_DOT, color = INK, layer = 4, what = 'the origin' } = {}) {
		const [x, y] = this.at(p);
		this.P.items.push({ kind: 'raw', layer, depth: 0, svg: `<circle cx="${n2(x)}" cy="${n2(y)}" r="${r}" fill="${color}"/>` });
		this.mark([[x, y]], r, what);
	}

	/** A right-angle mark at the world point F between the world directions d and t (unit vectors at right angles),
	 * its sides `side` points long as they would be seen face on. */
	right(F, d, t, { color = DIM, side = RIGHT, layer = 1, what = 'a right-angle mark' } = {}) {
		const check = checker(this.name);
		check(near(d.dot(t), 0, 1e-12) && near(d.length(), 1, 1e-12) && near(t.length(), 1, 1e-12), what + ' is not between two unit vectors at right angles');
		const s = side / this.P.scale;
		const pts = [F.clone().addScaledVector(d, s), F.clone().addScaledVector(d, s).addScaledVector(t, s), F.clone().addScaledVector(t, s)];
		this.P.curve(pts, { color, width: HAIR, layer, cap: 'butt' });
		this.mark(pts.map((p) => this.at(p)), HAIR / 2, what);
	}

	/** A TeX label beside the point q (figure points), moved out from q in the direction u (a unit vector, figure
	 * coordinates, y down) until `gap` points of air part its ink box from every mark, and no further. */
	async label(src, q, u, gap = LABEL_GAP, color = INK, size = SIZE) {
		const probe = await placed(src, 0, 0, 0.5, 0.5, color, size);
		const box = (s) => ({ l: probe.box.l + q[0] + u[0] * s, r: probe.box.r + q[0] + u[0] * s, t: probe.box.t + q[1] + u[1] * s, b: probe.box.b + q[1] + u[1] * s });
		let s = 0;
		while (this.clearance(box(s)).d < gap) s += 0.25;
		// back to the exact distance: bisect the last step
		let lo = Math.max(0, s - 0.25), hi = s;
		for (let k = 0; k < 20; k++) { const mid = (lo + hi) / 2; if (this.clearance(box(mid)).d < gap) lo = mid; else hi = mid; }
		return placed(src, q[0] + u[0] * hi, q[1] + u[1] * hi, 0.5, 0.5, color, size);
	}

	/** The least air between a label's box and any mark, and the mark nearest it. */
	clearance(box) {
		let best = { d: Infinity, what: '' };
		for (const m of this.marks) {
			for (let i = 1; i < m.pts.length; i++) {
				const d = boxToSegment(box, m.pts[i - 1], m.pts[i]) - m.r;
				if (d < best.d) best = { d, what: m.what };
			}
			if (m.pts.length === 1) {
				const d = toBox(box, m.pts[0]) - m.r;
				if (d < best.d) best = { d, what: m.what };
			}
		}
		return best;
	}

	/** Checks that every label clears every mark by `gap` points and every other label by `gap`, and that no head is
	 * longer than two fifths of its arrow. */
	checkAll(labels, gap = LABEL_GAP - 0.05) {
		const check = checker(this.name);
		for (const a of this.arrows) check(a.head <= 0.4 * a.L + 1e-9, `${a.what}: a head longer than two fifths of its arrow`);
		for (const l of labels) {
			const c = this.clearance(l.box);
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

/** The panel's centre on the provisional page: draw with Panel({ x: ORIGIN, y: ORIGIN, w: 0, h: 0, ... }). */
export const ORIGIN = CANVAS / 2;

/** The figure, cropped to its ink with the margin M on every side; `width` its allowed range of widths. `panel` is
 * a panel or a list of panels; `canvas` the side of the provisional page, points, for a figure wider than one. */
export async function finish(name, panel, labels, width = [240, 300], canvas = CANVAS) {
	const check = checker(name);
	const raw = await figure(canvas, canvas, [].concat(panel), labels.map((l) => Promise.resolve(l.svg)));
	const ink = await inkOf(raw, canvas, canvas);
	check(ink.l > 1 && ink.t > 1 && ink.r < canvas - 1 && ink.b < canvas - 1, 'the ink reaches the provisional page\'s edge');
	const [head, rest] = [raw.slice(0, raw.indexOf('</defs>') + 7), raw.slice(raw.indexOf('</defs>') + 7, raw.lastIndexOf('</svg>'))];
	const wrap = (W, H, dx, dy) => head.replace(/width="[^"]*" height="[^"]*" viewBox="[^"]*"/, `width="${W}pt" height="${H}pt" viewBox="0 0 ${W} ${H}"`) +
		`<g transform="translate(${dx},${dy})">${rest}</g></svg>`;
	// crop, measure the margins on the cropped figure, and correct once: the first measure is made at an arbitrary
	// fraction of a pixel
	let W = n2(ink.r - ink.l + 2 * M), H = n2(ink.b - ink.t + 2 * M), dx = n2(M - ink.l), dy = n2(M - ink.t);
	let svg = wrap(W, H, dx, dy), out = await inkOf(svg, W, H);
	dx = n2(dx + M - out.l); dy = n2(dy + M - out.t);
	W = n2(W + (M - (W - out.r)) - (M - out.l)); H = n2(H + (M - (H - out.b)) - (M - out.t));
	svg = wrap(W, H, dx, dy);
	out = await inkOf(svg, W, H);
	const tol = 1.5 / K + 0.01;
	check(near(out.l, M, tol) && near(out.t, M, tol) && near(W - out.r, M, tol) && near(H - out.b, M, tol),
		`the margins are not equal: ${[out.l, out.t, W - out.r, H - out.b].map((v) => v.toFixed(2)).join(', ')}`);
	check(W >= width[0] && W <= width[1], `the width ${W} pt is outside ${width.join('–')} pt`);
	window[name] = { W, H, margins: [out.l, out.t, W - out.r, H - out.b].map(n2), shift: [dx, dy] };
	return svg;
}

export { DIM };
