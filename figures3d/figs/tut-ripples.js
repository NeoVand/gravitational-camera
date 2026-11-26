// The tutorial's section 3.7, the blur law: the companion of its opening figure, in section. Over a block of
// sandstone with two iron balls, two ripples of the picture, each drawn at six evenly spaced heights: a coarse one
// (wavelength LAMBDA) on the left and a fine one (a third of it) on the right. Above the sheet that holds the
// sources a ripple of wavenumber k = 2 pi / wavelength fades with the height h as e^(-k h) (section 3.7, step 2,
// the paper's eq:evanescent), so at each height each ripple is drawn exactly with the amplitude A e^(-k h), h
// measured from the lowest line, where both are given the same amplitude A. The six heights are 0, 1, ..., 5 times
// a fifth of RISE = LAMBDA ln 2 / (2 pi): over the climb the coarse ripple keeps exactly a half, and the fine one,
// fading three times as fast, the cube of that, an eighth; at each height the fine one is weaker than the coarse
// by e^(-2 pi h (3 - 1) / LAMBDA), a quarter at the top. The top line is at the pixels, where the noise has a fixed
// size, drawn as a band A/4 to either side of the line: the coarse ripple stands twice the noise, the fine one half.
// Each crest is filled pale orange and each trough pale blue, between the curve and its own (undrawn) middle line.
// Exact: the amplitudes, the wavelengths and the noise band's width, all on one scale. Schematic: the vertical
// spacing of the lines (RISE is a ninth of the coarse wavelength; the lines are drawn farther apart than that so
// that each can be seen), the balls, the block, and the speckle within the noise band (which marks its width).
import { Panel, v3, figure, sprite, INK, DIM, FAINT } from '../lib.js';
import { IRON, text, n2 } from '../stone.js';

// ---- the physics --------------------------------------------------------------------------------------
export const LINES = 6;                 // the heights at which each ripple is drawn
export const FINER = 3;                 // the fine ripple's wavenumber, in units of the coarse one's
export const KEEP = 0.5;                // what the coarse ripple keeps over the climb: e^(-k RISE)
/** The climb, in units of the coarse wavelength: e^(-2 pi RISE) = KEEP. */
export const RISE = Math.log(1 / KEEP) / (2 * Math.PI);
export const NOISE = KEEP ** ((1 + FINER) / 2);   // the noise band's half-width, in units of A: the geometric mean
/** A ripple's amplitude, in units of A, at line j (0 at the bottom), for wavenumber m times the coarse one's. */
export const amplitude = (m, j) => Math.exp(-2 * Math.PI * m * (RISE * j / (LINES - 1)));

function physics() {
	const top = LINES - 1, h = RISE;
	const close = (a, b, what) => { if (Math.abs(a - b) > 1e-12) throw new Error(what + ': ' + a + ' against ' + b); };
	close(amplitude(1, top), 0.5, 'the coarse ripple at the top');
	close(amplitude(FINER, top), 0.125, 'the fine ripple at the top');
	for (let j = 0; j < LINES; j++) {
		const hj = (RISE * j) / (LINES - 1);
		close(amplitude(FINER, j) / amplitude(1, j), Math.exp((-2 * Math.PI * hj * (FINER - 1))), 'the ratio at line ' + j);
	}
	close(amplitude(FINER, top) / amplitude(1, top), 0.25, 'the ratio at the top');
	close(NOISE, 0.25, 'the noise');
	if (!(amplitude(1, top) > NOISE && amplitude(FINER, top) < NOISE)) throw new Error('the noise does not part the two ripples');
	if (Math.abs(h - 0.110318) > 1e-6) throw new Error('the climb: ' + h);
}

// ---- the drawing (points) -----------------------------------------------------------------------------
const W = 360;
const A = 8.5;                          // the amplitude at the lowest line
const LAMBDA = 79.85;                      // the coarse wavelength
const STACK = 2 * LAMBDA;               // each stack is two coarse wavelengths wide, crest at its middle
const X0 = 2.2, GUT = 14;               // the left stack's left end; the gutter between the stacks
const PIX = 6.5, PIX_TOP = 2.15;           // the pixels: their size and the top of the row
const SPACE = 17.5;                     // the lines' spacing on the page
const CLEAR = 7;                        // between the top line's highest crest and the pixels
const PALE = ['#f3dfcb', '#dce7f3'];    // the crests' and the troughs' tints (the site's pale orange and pale blue)
const FONT = 7.5;
const STONE_TOP = 5.5;                  // the block: its top face, receding at 35 degrees, this deep on the page
const STONE = 32;                       // the block's height
const BALL = 4.4;
const CUT = '#2b2418';

export default async function () {
	physics();
	const top = PIX_TOP + PIX + CLEAR + A * amplitude(1, LINES - 1);         // the top line: the coarse crest clears the pixels
	const lineY = (j) => top + (LINES - 1 - j) * SPACE;
	const right = X0 + 2 * STACK + GUT;                                      // the right end of the ripples and of the row
	const stacks = [{ m: 1, x: X0, name: 'coarse' }, { m: FINER, x: X0 + STACK + GUT, name: 'fine' }];
	const P = new Panel({ x: 0, y: 0, w: W, h: 400, scale: 1 });
	const fp = (x, y) => v3(x - W / 2, 200 - y, 0);
	const draw = (svg, layer = 0) => P.items.push({ kind: 'raw', layer, depth: 0, svg });
	let defs = '';

	// ---- the noise band at the pixels: a pale band of a fixed width, speckled
	const yTop = lineY(LINES - 1), half = NOISE * A;
	draw(`<rect x="${n2(X0)}" y="${n2(yTop - half)}" width="${n2(right - X0)}" height="${n2(2 * half)}" fill="#eeebe5"/>`, 0);
	let seed = 7;
	const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
	let dots = '';
	for (let i = 0; i < 900; i++) {
		const x = X0 + 0.4 + rnd() * (right - X0 - 0.8), y = yTop - half + 0.35 + rnd() * (2 * half - 0.7);
		dots += `<circle cx="${n2(x)}" cy="${n2(y)}" r="0.28"/>`;
	}
	draw(`<g fill="${FAINT}">${dots}</g>`, 0.1);

	// ---- the pixels
	const n = Math.round((right - X0) / PIX), pix = (right - X0) / n;
	let tiles = '';
	for (let i = 0; i < n; i++) tiles += `<rect x="${n2(X0 + i * pix)}" y="${n2(PIX_TOP)}" width="${n2(pix)}" height="${n2(PIX)}"/>`;
	draw(`<g fill="#eeebe5" stroke="${DIM}" stroke-width="0.3">${tiles}</g>`, 0);

	// ---- the ripples
	const rows = [];                                  // every line but the top one (which lies in the noise band), to check
	for (const s of stacks) {
		const k = (2 * Math.PI * s.m) / LAMBDA, mid = s.x + STACK / 2;
		for (let j = 0; j < LINES; j++) {
			const a = A * amplitude(s.m, j), y0 = lineY(j);
			const f = (x) => y0 - a * Math.cos(k * (x - mid)), df = (x) => a * k * Math.sin(k * (x - mid));
			// the curve as cubic pieces with the exact slope at each end, two points apart: within a thousandth of a point of
			// the sine, with no corners at any zoom
			const N = Math.ceil(STACK / 2), xs = Array.from({ length: N + 1 }, (_, i) => s.x + (STACK * i) / N);
			const pieces = (g, dg, rev = false) => {
				const X = rev ? [...xs].reverse() : xs;
				let d = '';
				for (let i = 1; i < X.length; i++) {
					const x1 = X[i - 1], x2 = X[i], h = (x2 - x1) / 3;
					d += `C${n2(x1 + h)},${n2(g(x1) + h * dg(x1))} ${n2(x2 - h)},${n2(g(x2) - h * dg(x2))} ${n2(x2)},${n2(g(x2))}`;
				}
				return d;
			};
			const curve = `M${n2(xs[0])},${n2(f(xs[0]))}` + pieces(f, df);
			// the tint: each crest filled between the curve and the line's own (undrawn) middle, pale orange, and each
			// trough pale blue, one closed path each (along the curve from one zero to the next, back along the middle);
			// a crest or trough lies between two zeros, and the stack begins and ends at a crest
			const halfWaves = Math.round((2 * STACK * s.m) / LAMBDA);
			for (let w = 0; w <= halfWaves; w++) {
				const xa = s.x + (STACK * Math.max(0, w - 0.5)) / halfWaves, xb = s.x + (STACK * Math.min(halfWaves, w + 0.5)) / halfWaves;
				const m = Math.max(2, Math.ceil((xb - xa) / 2)), X = Array.from({ length: m + 1 }, (_, i) => xa + ((xb - xa) * i) / m);
				let d = Math.abs(f(xa) - y0) > 1e-9 ? `M${n2(xa)},${n2(y0)}L${n2(xa)},${n2(f(xa))}` : `M${n2(xa)},${n2(y0)}`;
				for (let i = 1; i <= m; i++) {
					const x1 = X[i - 1], x2 = X[i], h = (x2 - x1) / 3;
					d += `C${n2(x1 + h)},${n2(f(x1) + h * df(x1))} ${n2(x2 - h)},${n2(f(x2) - h * df(x2))} ${n2(x2)},${n2(f(x2))}`;
				}
				const crest = Math.cos(k * ((xa + xb) / 2 - mid)) > 0;
				if (Math.abs(f(xb) - y0) > 1e-9) d += `L${n2(xb)},${n2(y0)}`;
				draw(`<path d="${d}Z" fill="${PALE[crest ? 0 : 1]}"/>`, 1);
			}
			if (j < LINES - 1) rows.push({ x0: s.x, x1: s.x + STACK, y0, a, f });
			draw(`<path d="${curve}" fill="none" stroke="${INK}" stroke-width="0.5"/>`, 2);
		}
		P.label(text(s.name), [mid, lineY(0) + A + 4.5], { size: FONT, anchor: 'ct' });
	}

	// ---- the block, the front of it a sawn face, its top and right side receding at 35 degrees
	// the slab, at the resolution the block needs (about four pixels to the point)
	const slab = await sprite('/figures3d/sprites/slab.jpg');
	const img = new Image(); img.src = slab.href; await img.decode();
	const c = document.createElement('canvas'); c.width = 1200; c.height = 600;
	c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
	slab.href = c.toDataURL('image/jpeg', 0.86);
	const by = lineY(0) + A + 4.5 + 7.5 + 6 + STONE_TOP * Math.sin((35 * Math.PI) / 180);   // the label, then air, then the block's top
	const off = [STONE_TOP * Math.cos((35 * Math.PI) / 180), -STONE_TOP * Math.sin((35 * Math.PI) / 180)];
	const bx0 = X0, bx1 = right - off[0];
	const face = [[bx0, by], [bx1, by], [bx1, by + STONE], [bx0, by + STONE]];
	const topFace = [[bx0, by], [bx0 + off[0], by + off[1]], [bx1 + off[0], by + off[1]], [bx1, by]];
	const sideFace = [[bx1, by], [bx1 + off[0], by + off[1]], [bx1 + off[0], by + STONE + off[1]], [bx1, by + STONE]];
	const path = (pts) => 'M' + pts.map(([x, y]) => `${n2(x)},${n2(y)}`).join('L') + 'Z';
	defs += `<clipPath id="tut-ripples-stone"><path d="${path(face)}${path(topFace)}${path(sideFace)}"/></clipPath>`;
	draw(`<g clip-path="url(#tut-ripples-stone)"><image class="art" href="${slab.href}" x="${n2(bx0 - 1)}" y="${n2(by + off[1] - 1)}" width="${n2(bx1 - bx0 + off[0] + 2)}" height="${n2(STONE - off[1] + 2)}" preserveAspectRatio="xMidYMid slice"/></g>` +
		`<path d="${path(topFace)}" fill="#ffffff" fill-opacity="0.22"/><path d="${path(sideFace)}" fill="${CUT}" fill-opacity="0.3"/>` +
		// its edges, each once: the outline, and the two edges of the front face that lie inside it
		`<path d="${path([face[3], face[0], topFace[1], topFace[2], sideFace[2], face[2]])}M${n2(face[0][0])},${n2(face[0][1])}L${n2(face[1][0])},${n2(face[1][1])}L${n2(face[2][0])},${n2(face[2][1])}M${n2(face[1][0])},${n2(face[1][1])}L${n2(sideFace[1][0])},${n2(sideFace[1][1])}" fill="none" stroke="${CUT}" stroke-width="0.4" stroke-linejoin="round"/>`, 3);
	const yb = by + STONE / 2, xc = (X0 + right) / 2;
	for (const dx of [-27, 27]) P.sphere(fp(xc + dx, yb), BALL, IRON, { spec: 0.45, shininess: 30, layer: 4 });

	// ---- labels at the right
	P.label(text('pixels'), [right + 4, PIX_TOP + PIX / 2], { size: FONT, anchor: 'lc' });
	P.label(text('noise'), [right + 4, yTop], { size: FONT, anchor: 'lc' });

	const H = +(by + STONE + 0.2 + 2).toFixed(2);                         // the outline's half-width, and the margin
	const svg = await figure(W, H, [P]).then((s) => s.replace('<defs>', `<defs>${defs}`));
	await checkFills(svg, W, H, rows);
	return svg;
}

/** The fills, checked on the drawing as the browser paints it, at 648 dpi, pixel by pixel over every line but the
 * top one: between the curve and its middle, pale orange where the curve is above the middle and pale blue where it is
 * below, and the bare page everywhere else within the line's reach; only the pixels under the curve's stroke, along
 * the middle (where the two fills meet) and those antialiased between two colours are passed over. */
async function checkFills(svg, w, h, rows) {
	const img = new Image();
	img.src = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
	await img.decode();
	const k = 9, c = document.createElement('canvas');
	c.width = Math.ceil(w * k); c.height = Math.ceil(h * k);
	const ctx = c.getContext('2d');
	ctx.fillStyle = '#ffffff';
	ctx.fillRect(0, 0, c.width, c.height);
	ctx.drawImage(img, 0, 0, c.width, c.height);
	const d = ctx.getImageData(0, 0, c.width, c.height).data;
	const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
	const kinds = [['o', rgb(PALE[0])], ['b', rgb(PALE[1])], ['w', [255, 255, 255]]];
	let checked = 0, wrong = 0, first = '';
	for (const r of rows) {
		for (let px = Math.ceil(r.x0 * k) + 3; px < r.x1 * k - 3; px++) {
			const X = (px + 0.5) / k, yc = r.f(X);
			for (let py = Math.floor((r.y0 - r.a - 0.5) * k); py < (r.y0 + r.a + 0.5) * k; py++) {
				const Y = (py + 0.5) / k;
				if (Math.abs(Y - yc) < 0.6 || Math.abs(Y - r.y0) < 0.25) continue;
				const q = (py * c.width + px) * 4;
				const got = kinds.find(([, v]) => v.every((u, i) => Math.abs(d[q + i] - u) <= 6));
				if (!got) continue;
				const want = Y > Math.min(yc, r.y0) && Y < Math.max(yc, r.y0) ? (yc < r.y0 ? 'o' : 'b') : 'w';
				checked++;
				if (got[0] !== want) { wrong++; if (!first) first = `at (${X.toFixed(2)}, ${Y.toFixed(2)}): ${got[0]} where ${want}`; }
			}
		}
	}
	if (wrong || checked < 1e6) throw new Error(`the fills: ${wrong} pixels wrong of ${checked}; first ${first}`);
}
