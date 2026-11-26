// The tutorial, section 9.7 (tutorial/one-point/beyond-one-plane-wave.md), its one diagram: what an unknown near field
// costs the wave's amplitude. A bar of ten equal cells, the ten numbers of one reading, split by a thin gap into two
// halves of five: the tide, E, and the magnetic part, B, named under the bar. Over the tide's half a bracket in
// matter's colour, "taken by the near field, any size", and the half tinted in matter's colour; over the magnetic
// part's half a bracket in the curvature's colour, "left for the wave: half its signal", and the half tinted in the
// curvature's colour. To the right, "near field: error x sqrt2". Under it, for contrast, the same ten cells all in the
// curvature's colour, "no near field: error x 1". The wave's colour is the curvature's, as in all of Part 9; no orange
// or blue.
// Departures from the diagram's comment: the result stands to the right of the bar, not under it, because the second
// row (the contrast the comment did not ask for) stands under it and each row's result belongs beside it; the names
// E (tide) and B (magnetic part) stand between the two rows and name the columns of both; the magnetic part's half has
// a bracket like the tide's, in its own colour, so that the two labels read as a pair.
// Exact: the factor sqrt2 and the 1, from the Fisher matrix of the chapter, F = (1/sigma_n^2) [[2, u_E^T], [u_E, 1]]
// with u_E of length one (here several directions, seeded), inverted by Gauss-Jordan: (F^-1)_aa = sigma_n^2, against
// sigma_n^2/2 for F = 2/sigma_n^2 alone (no near field), so the error grows by sqrt2; the same matrix with the corner 1
// (no magnetic part) is singular. The counts 5 + 5 = 10 and the cells' equal widths, on the page. Schematic: the cells
// hold no values.
import { tex, INK } from '../lib.js';
import { Sheet, ORIGIN, finish, checker, near, boxOf, n2, LINE, TICK, SIZE } from './tut-pot-lib.js';
import { CURV, palette } from './tut-metric-lib.js';
import { MATTER } from './tut-lorentz-lib.js';
import { uniforms } from './tut-prob-lib.js';

const name = 'tut-near-field-price';
const check = checker(name);

// ---- the drawing (points, y down) ---------------------------------------------------------------------------------
const C = 21;                                  // a cell's width: the same for all twenty cells
const H = 13;                                  // a cell's height
const GAP = 4;                                 // the thin gap between the two halves of a bar
const TINT_A = 0.2;                            // the cells' tint
const SEP = 0.4, SEP_A = 0.45;                 // the lines between cells of one half: stroke, opacity
const BRACKET_W = 0.55;                        // the brackets' stroke
const HOOK = 3.2;                              // the brackets' hooks
const HOOK_IN = 1.4;                           // each hook stands this far inside its half's edge
const BR_AIR = 3;                              // between a bar and its bracket's hooks
const LEAD = 10.5;                             // between the baselines of a two-line label
const ABOVE = 4.2;                             // from a bracket to the last baseline over it
const BELOW = 3.2;                             // from a bar to the cap height of the names under it
const UNDER = 5.2;                             // from the names' baseline to the lower bar (room for the parentheses)
const RIGHT = 9;                               // from a bar to its result

// ---- the Fisher matrix of the chapter, with sigma_n = 1 ---------------------------------------------------------------
/** The inverse of a square matrix by Gauss-Jordan with partial pivoting, or null if it is singular. */
function inverse(A) {
	const n = A.length, M = A.map((r, i) => [...r, ...Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))]);
	for (let c = 0; c < n; c++) {
		let p = c;
		for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
		if (Math.abs(M[p][c]) < 1e-12) return null;
		[M[c], M[p]] = [M[p], M[c]];
		const d = M[c][c];
		for (let j = 0; j < 2 * n; j++) M[c][j] /= d;
		for (let r = 0; r < n; r++) if (r !== c) { const f = M[r][c]; for (let j = 0; j < 2 * n; j++) M[r][j] -= f * M[c][j]; }
	}
	return M.map((r) => r.slice(n));
}
/** F of (a, N): the corner `corner` (2 with the magnetic part, 1 without), u_E beside it, the 5 x 5 identity. */
const fisher = (u, corner) => [[corner, ...u], ...u.map((x, i) => [x, ...u.map((_, j) => (i === j ? 1 : 0))])];

function price() {
	const rnd = uniforms(9007);
	const out = [];
	for (let t = 0; t < 20; t++) {
		const g = Array.from({ length: 5 }, () => 2 * rnd() - 1), s = Math.hypot(...g);
		const u = g.map((x) => x / s);
		const Fi = inverse(fisher(u, 2));
		check(Fi !== null, 'F is singular');
		// F F^-1 is the identity
		const F = fisher(u, 2);
		for (let i = 0; i < 6; i++) for (let j = 0; j < 6; j++)
			check(near(F[i].reduce((acc, f, k) => acc + f * Fi[k][j], 0), i === j ? 1 : 0, 1e-12), 'F F^-1 is not the identity');
		check(inverse(fisher(u, 1)) === null, 'without the magnetic part F is not singular');
		out.push(Fi[0][0]);
	}
	check(out.every((v) => near(v, 1, 1e-12)), `(F^-1)_aa is not sigma_n^2: ${out}`);
	const alone = 1 / 2;                                      // F = 2 / sigma_n^2 with no near field
	return { withNear: Math.sqrt(out[0]), without: Math.sqrt(alone), factor: Math.sqrt(out[0] / alone) };
}

// ---- the chapter's text ---------------------------------------------------------------------------------------------
async function chapter() {
	await palette(check);
	const md = await (await fetch('/tutorial/one-point/beyond-one-plane-wave.md')).text();
	const flat = md.replace(/<!--[\s\S]*?-->/g, ' ').replace(/\s+/g, ' ');
	const comments = [...md.matchAll(/<!--([\s\S]*?)-->/g)].map((m) => m[1].replace(/\s+/g, ' '));
	const has = (s, what) => check(flat.includes(s), `the chapter does not say ${what}: ${s}`);
	const drawn = flat.includes(`](${name}){#fig:near-field-price}`);
	const planned = comments.some((c) => c.includes(`diagram: ${name} `));
	check(drawn !== planned, `the diagram is ${drawn ? 'both drawn and planned' : 'neither drawn nor planned'}`);
	has('five free numbers $\\mathbf N$', 'the near field\'s five numbers');
	has('**its magnetic part is below the noise**', 'the assumption');
	has('each of length one, since $|\\curv\\tB| = |\\curv\\tE|$ in a wave', 'the columns\' length');
	has('$$F = \\frac{1}{\\sigma_n^2}\\begin{pmatrix}2 & \\mathbf u_E^{\\mathsf T}\\\\ \\mathbf u_E & 1\\end{pmatrix} ,$$', 'the Fisher matrix');
	has('$(F^{-1})_{aa} = \\sigma_n^2/(2 - |\\mathbf u_E|^2) = \\sigma_n^2$, against $\\sigma_n^2/2$ with no near field', 'the two variances');
	has('\\sigma_a\\ \\text{grows by exactly}\\ \\sqrt2 = 1.41', 'the result');
	has('it takes the wave\'s tide, and the wave is read from its magnetic part, which carries half its signal', 'the reason');
	has('the corner 2 becomes 1, $F$ is singular and the error infinite', 'the limit');
	if (drawn) has('Look first at the bracket: an unknown near field uses up the five numbers of the tide, and the wave is read from the other five, which hold half its signal, so its error grows by exactly $\\sqrt2$. The lower row, without a near field, reads the wave from all ten numbers. Schematic.](tut-near-field-price){#fig:near-field-price}', 'the caption');
	return { drawn };
}

export default async function () {
	await chapter();
	const p = price();
	check(near(p.factor, Math.SQRT2, 1e-12) && p.factor.toFixed(2) === '1.41', `the factor ${p.factor}`);

	const S = new Sheet(name);
	const labels = [];
	const half = 5 * C, W = 2 * half + GAP;
	const capTop = -boxOf(await tex('\\text{h}', [0, 0], SIZE, 'cB', INK)).t;

	// ---- a label of lines on baselines, as one label
	const lines = async (rows, x, base0, anchor) => {
		const parts = [];
		for (const [i, [src, color]] of rows.entries()) {
			const svg = await tex(src, [x, base0 + i * LEAD], SIZE, anchor, color);
			parts.push({ svg, box: boxOf(svg) });
		}
		return { src: rows.map((r) => r[0]).join(' / '), svg: parts.map((q) => q.svg).join(''),
			box: { l: Math.min(...parts.map((q) => q.box.l)), r: Math.max(...parts.map((q) => q.box.r)), t: Math.min(...parts.map((q) => q.box.t)), b: Math.max(...parts.map((q) => q.box.b)) } };
	};

	// ---- the layout: the bars' left edge, the upper bar's top; the right-hand results measured first
	const X0 = ORIGIN - W / 2 - 30;
	const left = (k) => X0 + k * C + (k >= 5 ? GAP : 0);      // the left edge of cell k
	const halves = [[left(0), left(0) + half], [left(5), left(5) + half]];
	check(near(halves[1][1] - halves[0][0], W, 1e-12) && near(halves[1][0] - halves[0][1], GAP, 1e-12), 'the halves');

	// ---- a bar: ten cells, each half tinted in its colour, a fine line between cells of a half, an outline per half
	const bar = (y, colors, what) => {
		for (const [h, [a, b]] of halves.entries()) {
			const color = colors[h];
			S.raw(`<rect x="${n2(a)}" y="${n2(y)}" width="${half}" height="${H}" fill="${color}" fill-opacity="${TINT_A}" stroke="none"/>`, 0);
			for (let k = 1; k < 5; k++) S.raw(`<path d="M${n2(a + k * C)},${n2(y)}V${n2(y + H)}" stroke="${color}" stroke-opacity="${SEP_A}" stroke-width="${SEP}"/>`, 1);
			S.path([[a, y], [b, y], [b, y + H], [a, y + H]], { color, width: LINE, closed: true, layer: 2, what: `${what}, half ${h}` });
		}
		let n = 0;
		for (let k = 0; k < 10; k++) { check(near(left(k) + C - left(k), C, 1e-12) && left(k) + C <= left(k + 1) + 1e-9, `${what}: cell ${k}`); n++; }
		check(n === 10, `${what} holds ${n} cells`);
	};

	const yU = ORIGIN - 20;                                       // the upper bar's top
	bar(yU, [MATTER, CURV], 'the upper bar');

	// ---- the brackets over the upper bar, and their words
	const yb = yU - BR_AIR - HOOK;                                 // the brackets' long line
	const WORDS = [
		[['\\text{taken by the near field,}', MATTER], ['\\text{any size}', MATTER]],
		[['\\text{left for the wave:}', CURV], ['\\text{half its signal}', CURV]]
	];
	for (const [h, [a, b]] of halves.entries()) {
		const color = [MATTER, CURV][h];
		const p = a + HOOK_IN, q = b - HOOK_IN;
		S.path([[p, yb + HOOK], [p, yb], [q, yb], [q, yb + HOOK]], { color, width: BRACKET_W, cap: 'butt', layer: 2, what: `the bracket over half ${h}` });
		const w = WORDS[h];
		const lab = await lines(w, (a + b) / 2, yb - ABOVE - (w.length - 1) * LEAD, 'cB');
		check(lab.box.r - lab.box.l <= b - a + 1e-9, `the words over half ${h} (${n2(lab.box.r - lab.box.l)} pt) are wider than it`);
		labels.push(lab);
	}

	// ---- the names of the columns, under the upper bar
	const base = yU + H + BELOW + capTop;
	labels.push(await lines([['\\mathcal E\\ \\text{(tide)}', INK]], (halves[0][0] + halves[0][1]) / 2, base, 'cB'));
	labels.push(await lines([['\\mathcal B\\ \\text{(magnetic part)}', INK]], (halves[1][0] + halves[1][1]) / 2, base, 'cB'));

	// ---- the lower bar: no near field, all ten cells the wave's
	const yL = base + UNDER;
	bar(yL, [CURV, CURV], 'the lower bar');

	// ---- the results, to the right of each bar, two lines centred on it
	const xr = halves[1][1] + RIGHT;
	const result = async (y, words) => {
		const b0 = y + H / 2 - (capTop + LEAD) / 2 + capTop;
		return lines(words, xr, b0, 'lB');
	};
	const f = p.factor, root = near(f, Math.SQRT2, 1e-12) ? '\\sqrt2' : null;
	check(root !== null, 'the factor is not sqrt2');
	labels.push(await result(yU, [['\\text{near field:}', INK], [`\\text{error}\\times${root}`, INK]]));
	labels.push(await result(yL, [['\\text{no near field:}', INK], ['\\text{error}\\times1', INK]]));

	S.checkAll(labels);
	window[name + '-numbers'] = { factor: f, variances: [p.withNear ** 2, p.without ** 2] };
	return finish(S, labels, [250, 330]);
}
