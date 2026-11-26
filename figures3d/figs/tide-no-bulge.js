// A steady tide raises a bulge on the Earth and none on a black hole. One column, two panels side by side.
// (a) "the Earth, k_2 = 0.30": the Earth as a stone body (sprites/hair/ball-face.png, the stone of figs/hair.js),
// drawn bulged along the line to the Moon; an ink arrow beside it points along that line, to the Moon; on its other
// side a ring of four free steel beads, as in figs/tidal.js: the two on the line pulled out by orange arrows (the
// stretch), the two across it pushed in by blue arrows half as long (the squeeze), the tide being (GM/d^3) diag(1, 1, -2)
// with z along the line to the Moon. (b) "a black hole, k_2 = 0": a black disc of radius r_s, exactly round, the
// same arrow and the same ring. Under each, a strip on logarithmic axes along the line to the Moon, from 2 to 8 radii,
// of the potential in units of its tidal part's r^2 term at one radius, (1/2) E_zz R^2 (or r_s^2): Phi / (1/2) E_zz R^2
// is positive, since Phi and E_zz are both negative along the line. On (a) the tide, (r/R)^2, and the body's response,
// k_2 (R/r)^3, which at r = R is k_2 times the tide (Section IV's convention, checked below); on (b) the hole's whole
// static tide, the solution of Hinderer's equation regular at the horizon, r(r - r_s), in units of r_s^2, and no
// response. The paper's version of the tutorial's tut-tide-no-bulge, re-laid out at the column's width.
// Exact: the strips' curves; the hole's disc, round and of radius r_s on the page, which is also the Earth's undeformed
// radius R; the beads' arrows, -E xi for the tide diag(1, 1, -2), the orange twice the blue. Schematic: the bulge's size
// (semi-axes 1 + k_2/2 and its root's reciprocal, the sphere's volume, as the tutorial's interactive draws it: the
// Earth's solid tide, some tens of centimetres, is under 10^-7 of its radius), the ring's size against the bodies, the arrows' lengths.
// Pictorial: the stone, a picture from an image model, stretched with its ellipse and clipped to it.
import { Sheet, checker, placed, boxOf, near, n2, LABEL_GAP, VEC, VEC_HEAD } from './tut-pot-lib.js';
import { Plot, xAxis, yAxis } from './tut-prob-lib.js';
import { INK, DIM, ACCENT, ACCENT2, sprite, letter, figure } from '../lib.js';
import { MARGIN, STEEL } from '../stone.js';
import { K2, BULGE, tide, reply, holeH, hinderer } from './tut-friction-lib.js';

const name = 'tide-no-bulge';
const check = checker(name);

// ---- the drawing (points; the provisional page is 700 square, the figure drawn from (OX, OY)) ----------------------
const W = 246, M = 1.5;                         // the column's width; the ink's margin top and bottom
const OX = 200, OY = 200;
const lg = Math.log10;
const HALF = W / 2;                             // each panel's width
const R = 14;                                   // the Earth's undeformed radius and the hole's r_s, on the page
const RING_R = 11, BEAD = 2.4;                  // the ring's radius, a bead's
const BEAD_LOOK = { spec: 0.6, shininess: 36 };
const ARROW = { width: 0.55, head: 3.2, tail: 1.1, blue: 6.5 };   // tidal.js's arrows: stroke, head (or 2/5)
const GAP_BODY = 5;                             // from the stretch arrow's tip to the body
const MOON = { gap: 5, len: 18 };               // the arrow to the Moon: from the body, its length
const STONE_EDGE = 0.4, STONE_INK = '#3b3024';  // the stone's rim, drawn on the stone: fixed, not swapped
const HOLE_EDGE = 0.45;                        // the hole's edge, inside its radius
const HOLE = '#0d0c0b';                         // the hole's fill: fixed, so the site keeps it dark
const RING_LINE = 0.4, RING_DASH = [1.6, 1.4];  // the ring, dashed
const TITLE_GAP = 6;                            // from the panel letters' line to the tallest body
// the strips: log10 of r/R across, of the potential up
const SX0 = lg(2), SX1 = lg(8), SY0 = -4, SY1 = 2;
const PL = 22, PR = 119.5, STRIP_H = 50;        // a strip's frame: left and right from the panel's left, height
const AXIS_TITLE = 4;                           // from the body row's lowest ink to the axis title's top
const THIN = 0.6;
const TIDE_AT = 3.6;                            // the Earth's tide's name hangs under its line here (r/R)
const RESPONSE_AT = 5.6;                        // the response's name stands over its line here

/** A label made from a panel letter (lib.js `letter`), with its box. */
async function lettered(l, x, y, title) {
	const svg = await letter(l, x, y, title);
	return { src: `(${l}) ${title}`, svg, box: boxOf(svg) };
}

/** Where an SVG has ink: [left, right, top, bottom] in its own units, painted at K pixels per unit (tut-pot-lib's). */
async function inkOf(svg, w, h, K = 8) {
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

/** The figure W points wide, its ink centred across and cropped top and bottom with the margin M. */
async function finish(S, labels) {
	const CANVAS = 700;
	const raw = await figure(CANVAS, CANVAS, [S.P], labels.map((l) => Promise.resolve(l.svg)));
	const ink = await inkOf(raw, CANVAS, CANVAS);
	const side = (W - (ink.r - ink.l)) / 2;
	check(side >= 0.9 && side <= 2.4, `the ink is ${(ink.r - ink.l).toFixed(2)} pt wide: side margins of ${side.toFixed(2)} pt`);
	const H = n2(ink.b - ink.t + 2 * M);
	const head = raw.slice(0, raw.indexOf('</defs>') + 7), rest = raw.slice(raw.indexOf('</defs>') + 7, raw.lastIndexOf('</svg>'));
	const svg = head.replace(/width="[^"]*" height="[^"]*" viewBox="[^"]*"/, `width="${W}pt" height="${H}pt" viewBox="0 0 ${W} ${H}"`) +
		`<g transform="translate(${n2(side - ink.l)},${n2(M - ink.t)})">${rest}</g></svg>`;
	const out = await inkOf(svg, W, H);
	window[name] = { W, H, margins: [out.l, out.t, W - out.r, H - out.b].map(n2) };
	check(near(out.l, W - out.r, 0.2) && near(out.t, M, 0.2) && near(H - out.b, M, 0.2), `the margins: ${window[name].margins.join(', ')}`);
	return svg;
}

export default async function () {
	// ---- the numbers drawn, checked
	// Section IV (04-near-field.tex): the trace-free second moment I_ij = -(1/3) k_2 R^5/G E_ij; outside, its potential
	// is -(3/2) G I_ij x_i x_j / r^5, so along the line at r it is (1/2) k_2 E_zz R^5/r^3, against the tide's (1/2) E_zz r^2:
	// in units of (1/2) E_zz R^2, the response is k_2 (R/r)^3 and the tide (r/R)^2.
	{
		const sec4 = await (await fetch('/paper/sections/04-near-field.tex')).text();
		check(sec4.includes('of $-\\tfrac13 k_2R^5/G$ times the applied'), 'Section IV no longer defines k_2 by -(1/3) k_2 R^5/G');
		const macros = await (await fetch('/paper/macros.tex')).text();
		check(macros.includes('\\newcommand{\\tE}{\\mathcal{E}}'), 'the paper\'s tide is not \\mathcal{E}');
		const G = 6.674e-11, Rm = 6.371e6, Ezz = -2 * 1.1e-13;          // an arbitrary body and tide
		const Izz = (-1 / 3) * K2 * Rm ** 5 / G * Ezz;
		for (const r of [1, 2, 5, 8]) {
			const resp = -1.5 * G * Izz / (r * Rm) ** 3, unit = 0.5 * Ezz * Rm * Rm;
			check(near(resp / unit / reply(r), 1, 1e-12) && near(0.5 * Ezz * (r * Rm) ** 2 / unit / tide(r), 1, 1e-12), `the convention at r = ${r} R`);
		}
	}
	check(near(K2, 0.3, 0), 'the Earth\'s k_2');
	for (const r of [1.3, 2, 3.7, 8, 40]) check(Math.abs(hinderer(holeH, (q) => 2 * q - 1, () => 2, r)) < 1e-9 * r ** 4, `r(r - r_s) does not solve Hinderer's equation at ${r}`);
	const laplace = (H, r, d = 1e-3) => (H(r + d) - 2 * H(r) + H(r - d)) / (d * d) + ((2 / r) * (H(r + d) - H(r - d))) / (2 * d) - (6 * H(r)) / (r * r);
	for (const r of [2, 5, 8]) check(Math.abs(laplace(tide, r)) < 1e-6 && Math.abs(laplace(reply, r)) < 1e-6, `r^2 and r^-3 do not solve Laplace's equation at ${r}`);
	check(near(reply(1) / tide(1), K2, 1e-15) && near(reply(2) / tide(2), K2 / 32, 1e-15), 'the response against the tide');
	check(near(holeH(1), 0, 0) && near(holeH(4) - (16 - 4), 0, 1e-12), 'the hole\'s tide');
	check(near(BULGE.a * BULGE.b ** 2, 1, 1e-15) && near(BULGE.a, 1 + K2 / 2, 1e-15), 'the drawn bulge');

	const S = new Sheet(name);
	const L = [];
	const art = await sprite('/figures3d/sprites/hair/ball-face.png');
	const lefts = [OX, OX + HALF];
	const titles = ['\\text{the Earth, }k_2 = 0.30', '\\text{a black hole, }k_2 = 0'];
	check(titles[0].endsWith(K2.toFixed(2)), 'the title\'s k_2');
	// panel letters; the ink of "(" starts 0.72 pt right of where it is set (two-readings.js)
	const T = await Promise.all(titles.map((t, k) => lettered('ab'[k], lefts[k] + M - 0.72, OY, t)));
	L.push(...T);
	const half = Math.max(R, BULGE.b * R, RING_R + BEAD);
	const yb = Math.max(...T.map((t) => t.box.b)) + TITLE_GAP + half;   // the bodies' centre line

	// ---- the tide on the beads: -E xi with E = diag(-2, 1) in the page's (along, across), per point of xi
	const per = ARROW.blue / RING_R;
	const push = ([u, v]) => [2 * u * per, -v * per];             // along the line out, across it in
	check(near(Math.hypot(...push([RING_R, 0])) / Math.hypot(...push([0, RING_R])), 2, 1e-12), 'the stretch is not twice the squeeze');
	const reach = RING_R + BEAD + ARROW.tail + 2 * ARROW.blue;     // from the ring's centre to a stretch arrow's tip
	let rowBottom = -Infinity;

	for (const [k, P0] of lefts.entries()) {
		const isHole = k === 1, what = isHole ? 'the hole' : 'the Earth';
		const rc = [P0 + M + reach, yb];                           // the ring
		const c = [rc[0] + reach + GAP_BODY + BULGE.a * R, yb];    // the body: both centred alike
		// ---- the body
		if (isHole) {
			// edged in the page's ink, which the site turns pale at night, so that the disc shows on a dark page; the
			// edge lies inside the radius, and on a light page it is one with the fill
			S.raw(`<circle cx="${n2(c[0])}" cy="${n2(c[1])}" r="${n2(R - HOLE_EDGE / 2)}" fill="${HOLE}" stroke="${INK}" stroke-width="${HOLE_EDGE}"/>`, 2);
			S.mark(Array.from({ length: 145 }, (_, i) => [c[0] + R * Math.cos((i * Math.PI) / 72), c[1] + R * Math.sin((i * Math.PI) / 72)]), 0, what);
		} else {
			const a = BULGE.a * R, b = BULGE.b * R, stretch = art.w / (art.w - 2 * MARGIN);
			const ell = `M${n2(c[0] - a)},${n2(c[1])}a${n2(a)},${n2(b)} 0 1,0 ${n2(2 * a)},0a${n2(a)},${n2(b)} 0 1,0 ${n2(-2 * a)},0Z`;
			S.raw(`<clipPath id="${name}-earth"><path d="${ell}"/></clipPath>` +
				`<image class="art" href="${art.href}" x="${n2(c[0] - a * stretch)}" y="${n2(c[1] - b * stretch)}" width="${n2(2 * a * stretch)}" height="${n2(2 * b * stretch)}" preserveAspectRatio="none" clip-path="url(#${name}-earth)"/>` +
				`<path d="${ell}" fill="none" stroke="${STONE_INK}" stroke-width="${STONE_EDGE}"/>`, 2);
			S.mark(Array.from({ length: 145 }, (_, i) => [c[0] + a * Math.cos((i * Math.PI) / 72), c[1] + b * Math.sin((i * Math.PI) / 72)]), STONE_EDGE / 2, what);
			check(near(a * b * b, R ** 3, 1e-9), 'the bulged Earth does not keep its volume');
		}
		// ---- the arrow to the Moon, along the line to the right, its name over it
		const x0 = c[0] + BULGE.a * R + MOON.gap;                  // both start alike, past the bulge
		const A = S.arrow([x0, yb], [x0 + MOON.len, yb], { color: INK, width: VEC, head: VEC_HEAD, layer: 2, what: `${what}'s arrow to the Moon` });
		L.push(await placed('\\text{Moon}', (A.A[0] + A.B[0]) / 2, yb - 0.36 * Math.min(VEC_HEAD, 0.4 * MOON.len) - LABEL_GAP - 0.1, 0.5, 1, INK));
		// ---- the ring of beads
		{
			const n = 4 * Math.round((2 * Math.PI * RING_R) / (4 * (RING_DASH[0] + RING_DASH[1])));
			const len = (2 * Math.PI * RING_R) / n;
			S.raw(`<circle cx="${n2(rc[0])}" cy="${n2(rc[1])}" r="${RING_R}" fill="none" stroke="${DIM}" stroke-width="${RING_LINE}" stroke-dasharray="${n2(len * RING_DASH[0] / (RING_DASH[0] + RING_DASH[1]))} ${n2(len * RING_DASH[1] / (RING_DASH[0] + RING_DASH[1]))}" stroke-dashoffset="${n2(len * RING_DASH[0] / (RING_DASH[0] + RING_DASH[1]) / 2)}"/>`, 1);
			S.mark(Array.from({ length: 73 }, (_, i) => [rc[0] + RING_R * Math.cos((i * Math.PI) / 36), rc[1] + RING_R * Math.sin((i * Math.PI) / 36)]), RING_LINE / 2, `${what}'s ring`);
		}
		const arrows = [];
		for (const [u, v] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
			const xi = [u * RING_R, v * RING_R];                      // page: v up
			const p = [rc[0] + xi[0], rc[1] - xi[1]];
			S.sphere(p, BEAD, STEEL, { ...BEAD_LOOK, layer: 3 }, `${what}'s bead ${u},${v}`);
			const f = push(xi), len = Math.hypot(...f), d = [f[0] / len, -f[1] / len];
			const P0a = [p[0] + d[0] * (BEAD + ARROW.tail), p[1] + d[1] * (BEAD + ARROW.tail)];
			const color = u !== 0 ? ACCENT : ACCENT2;
			arrows.push(S.arrow(P0a, [P0a[0] + d[0] * len, P0a[1] + d[1] * len], { color, width: ARROW.width, head: ARROW.head, layer: 4, what: `${what}'s ${u !== 0 ? 'stretch' : 'squeeze'} arrow` }));
			if (u !== 0) check(d[0] === u && d[1] === 0, 'a stretch arrow does not point out along the line');
			else check(d[0] === 0 && Math.sign(d[1]) === v, 'a squeeze arrow does not point in');
		}
		const [right, , up, down] = arrows;
		check(Math.abs(up.B[1] - down.B[1]) >= 2, 'the squeeze arrows meet');
		check(right.B[0] + GAP_BODY <= c[0] - BULGE.a * R + 1e-9, `${what}: the ring runs into the body`);
		rowBottom = Math.max(rowBottom, yb + half);
		check(A.B[0] + 2 <= P0 + HALF, `${what}'s arrow to the Moon leaves its half of the column`);
	}

	// ---- the strips, on one line under the bodies: both frames at one height, both axis names on one line, both
	// tides' names on one line
	const units = ['R', 'r_s'];
	const names = await Promise.all(units.map((u) => placed(`2\\Phi/\\mathcal{E}_{zz}${u}^2`, 0, rowBottom + AXIS_TITLE, 0, 0, DIM)));
	const top = Math.max(...names.map((t) => t.box.b)) + 7.5;
	const plots = [], tides = [];
	for (const [k, P0] of lefts.entries()) {
		const isHole = k === 1, what = isHole ? 'the hole' : 'the Earth', unit = units[k];
		const P = new Plot({ left: P0 + PL, top, w: PR - PL, h: STRIP_H, x0: SX0, x1: SX1, y0: SY0, y1: SY1 });
		plots.push(P);
		const xl = await xAxis(S, P, { ticks: [2, 4, 8].map(lg), fmt: (t) => String(Math.round(10 ** t)), what: `${what}'s strip across` });
		L.push(...xl);
		const yl = await yAxis(S, P, { ticks: [-4, -3, -2, -1, 0, 1, 2], fmt: (t) => (t % 2 ? null : t === 0 ? '1' : `10^{${t}}`), what: `${what}'s strip up` });
		L.push(...yl);
		// the axis's name over its numbers, its left edge on theirs
		const left = Math.min(...yl.map((l) => l.box.l));
		L.push(await placed(names[k].src, left, names[k].box.t, 0, 0, DIM));
		const below = Math.max(...xl.map((l) => l.box.b));
		L.push(await placed(`r/${unit}`, P.X((SX0 + SX1) / 2), below + 2.5, 0.5, 0, DIM));
		const curve = (f, n = 400) => Array.from({ length: n + 1 }, (_, i) => { const x = SX0 + ((SX1 - SX0) * i) / n; return P.at(x, lg(f(10 ** x))); });
		const inside = (pts) => pts.every(([, y]) => y >= P.top - 1e-9 && y <= P.bottom + 1e-9);
		const f = isHole ? holeH : tide;
		const pts = curve(f);
		check(inside(pts), `${what}'s tide leaves its strip`);
		S.path(pts, { color: INK, width: THIN, layer: 2, cap: 'butt', what: `${what}'s tide` });
		if (!isHole) {
			const q = P.at(lg(TIDE_AT), lg(f(TIDE_AT)));
			tides.push(await S.clear('\\text{tide, }r^2', q[0], q[1] + 3, 0.5, 0, [0, 1]));
		} else {
			// the hole's name, wider and under a line lower at the left, stands where its own clearance puts it nearest
			// the Earth's line; then both go to the lower of the two
			let best = null;
			for (let r = 3.6; r <= 6.4; r += 0.05) {
				const q = P.at(lg(r), lg(f(r)));
				const t = await S.clear('\\text{tide, }r(r - r_s)', q[0], q[1] + 3, 0.5, 0, [0, 1]);
				if (t.box.r > P.right - 2) break;
				if (!best || Math.abs(t.box.t - tides[0].box.t) < Math.abs(best.box.t - tides[0].box.t)) best = t;
			}
			check(best && Math.abs(best.box.t - tides[0].box.t) < 1, 'the tides\' names cannot share a line');
			const y = Math.max(best.box.t, tides[0].box.t);
			for (const t of [tides[0], best]) {
				const m = await placed(t.src, (t.box.l + t.box.r) / 2, y, 0.5, 0, INK);
				t.svg = m.svg; t.box = m.box;
			}
			tides.push(best);
			L.push(...tides);
		}
		if (!isHole) {
			const rp = curve(reply);
			check(inside(rp), 'the Earth\'s response leaves its strip');
			S.path(rp, { color: ACCENT, width: THIN, layer: 2, cap: 'butt', what: 'the Earth\'s response' });
			const p = P.at(lg(RESPONSE_AT), lg(reply(RESPONSE_AT)));
			L.push(await S.clear('\\text{response, }r^{-3}', p[0], p[1] - 3, 0.5, 1, [0, -1], { color: ACCENT }));
		}
	}

	S.checkAll(L);
	window[name + '-numbers'] = { bulge: BULGE, responseAt2R: reply(2) / tide(2) };
	return finish(S, L);
}
