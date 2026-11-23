// The tutorial, chapter 0.6 (tutorial/evening/how-to-read.md), its one diagram: reading an equation before deriving
// it. The paper's tidal brightness, eq:tidal-brightness (paper/sections/04-near-field.tex), set large in the text's
// ink, letter for letter and in the paper's layout (the two fractions in display style, the quad space before
// theta = R/r; the sentence's comma and full stop, which belong to the paper's prose, left out). Each symbol is
// tagged by a thin leader line to its unit: the left side to s^-2, 8 pi to "a pure number", G to m^3 kg^-1 s^-2,
// the mean density to kg m^-3, theta to "no unit", R and r each to m. Beneath, two curved arrows in the accent say
// which way the inputs push the tide: from theta^3, "theta doubles -> tide x 8"; from the mean density, "denser ->
// brighter, in proportion". Part 0 uses no role colours. Exact: the equation's glyphs, as MathJax sets them; every
// leader starts and ends a fixed air from the glyph it tags and from its label, and is checked to clear every other
// glyph, every label and every other leader. Nothing in the drawing is schematic.
import { tex, INK, DIM, ACCENT } from '../lib.js';
import { Sheet, ORIGIN, finish, checker, placed, n2, VEC } from './tut-pot-lib.js';

const name = 'tut-read-equation';
const check = checker(name);

// The paper's equation, as written there (without the sentence's comma and full stop).
export const EQ = '\\displaystyle \\frac{2GM}{r^{3}} = \\frac{8\\pi G}{3}\\,\\bar\\rho\\,\\theta^{3}, \\qquad \\theta = \\frac{R}{r}';
const EQ_TEX = EQ.replace(', \\qquad', ' \\qquad');
// the glyphs MathJax draws for it, in order (their Unicode code points, as MathJax's data-c), and the fraction bars
const GLYPHS = ['32', '1D43A', '1D440', '1D45F', '33', '3D', '38', '1D70B', '1D43A', '33', '1D70C', 'AF', '1D703', '33', '1D703', '3D', '1D445', '1D45F'];

const EQ_SIZE = 20;               // the equation, points (its font size)
const SIZE = 9.5;                 // the labels: at 390 px the figure is shown about 1.13 px per point, so 10.7 px
const LEAD = 0.45;                // a leader's stroke
const END_GAP = 1.6;              // air between a leader's end and the glyph it tags
const LABEL_AIR = 2.5;            // air between a leader's start and its label
const GLYPH_AIR = 1.4;            // the least air between a leader and any other glyph
const TIER = 15.5;                // height of a row of labels above the equation, baseline to baseline
const ARC_HEAD = 4.4;             // the curved arrows' heads

/** The box (figure points) of every glyph and bar of an SVG fragment, in document order. */
function glyphBoxes(fragment) {
	const ns = 'http://www.w3.org/2000/svg';
	const svg = document.createElementNS(ns, 'svg');
	svg.setAttribute('width', '1000');
	svg.setAttribute('height', '1000');
	svg.innerHTML = fragment;
	document.body.appendChild(svg);
	const root = svg.getScreenCTM().inverse();
	const out = [];
	for (const el of svg.querySelectorAll('path[data-c], rect')) {
		const b = el.getBBox();
		const m = root.multiply(el.getScreenCTM());
		const pts = [[b.x, b.y], [b.x + b.width, b.y], [b.x, b.y + b.height], [b.x + b.width, b.y + b.height]].map(([x, y]) => new DOMPoint(x, y).matrixTransform(m));
		out.push({
			c: el.tagName === 'rect' ? 'bar' : el.getAttribute('data-c'),
			box: { l: Math.min(...pts.map((p) => p.x)), r: Math.max(...pts.map((p) => p.x)), t: Math.min(...pts.map((p) => p.y)), b: Math.max(...pts.map((p) => p.y)) }
		});
	}
	svg.remove();
	return out;
}

const union = (...bs) => ({ l: Math.min(...bs.map((b) => b.l)), r: Math.max(...bs.map((b) => b.r)), t: Math.min(...bs.map((b) => b.t)), b: Math.max(...bs.map((b) => b.b)) });
const cx = (b) => (b.l + b.r) / 2;
const toBox = (b, [x, y]) => Math.hypot(Math.max(b.l - x, 0, x - b.r), Math.max(b.t - y, 0, y - b.b));
function segToBox(b, a, c) {
	const n = Math.max(2, Math.ceil(Math.hypot(c[0] - a[0], c[1] - a[1]) / 0.05));
	let d = Infinity;
	for (let i = 0; i <= n; i++) d = Math.min(d, toBox(b, [a[0] + ((c[0] - a[0]) * i) / n, a[1] + ((c[1] - a[1]) * i) / n]));
	return d;
}
function crosses([p, q], [r, s]) {
	const o = (a, b, c) => Math.sign((b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]));
	return o(p, q, r) !== o(p, q, s) && o(r, s, p) !== o(r, s, q);
}
function segDist([a, b], [c, d]) {
	if (crosses([a, b], [c, d])) return 0;
	const pd = (q, u, v) => {
		const e = [v[0] - u[0], v[1] - u[1]], l2 = e[0] ** 2 + e[1] ** 2;
		const t = Math.max(0, Math.min(1, ((q[0] - u[0]) * e[0] + (q[1] - u[1]) * e[1]) / l2));
		return Math.hypot(q[0] - u[0] - t * e[0], q[1] - u[1] - t * e[1]);
	};
	return Math.min(pd(a, c, d), pd(b, c, d), pd(c, a, b), pd(d, a, b));
}

export default async function () {
	const S = new Sheet(name);

	// ---- the equation, its left end at x0 and its baseline at y0
	const probe = await tex(EQ_TEX, [0, 0], EQ_SIZE, 'lB', INK);
	const w0 = glyphBoxes(probe);
	const W = Math.max(...w0.map((g) => g.box.r)) - Math.min(...w0.map((g) => g.box.l));
	const x0 = ORIGIN - W / 2, y0 = ORIGIN;
	const eq = await tex(EQ_TEX, [x0, y0], EQ_SIZE, 'lB', INK);
	S.raw(eq, 2);
	const all = glyphBoxes(eq);
	const glyphs = all.filter((g) => g.c !== 'bar'), bars = all.filter((g) => g.c === 'bar');
	check(glyphs.map((g) => g.c).join(' ') === GLYPHS.join(' '), `the equation's glyphs are ${glyphs.map((g) => g.c).join(' ')}`);
	check(bars.length === 3, `the equation has ${bars.length} fraction bars, not 3`);
	all.forEach((g, i) => S.boxes.push({ box: g.box, what: `the glyph ${g.c} (${i})` }));
	const G = glyphs.map((g) => g.box);
	const [two, , , r3, , , eight, pi, G2, , rho, bar, th3, , thd, , R, r] = G;
	const lhs = union(...G.slice(0, 5), bars[0].box);
	const rhoBar = union(rho, bar);
	check(thd.l > th3.r && R.l > thd.r, 'the glyphs are not in the paper\'s order');

	// ---- leaders: each from a point `END_GAP` clear of its glyph's box to a point `LABEL_AIR` clear of its label
	const L = [];
	const leaders = [];
	const lead = (a, b, what, target) => {
		S.path([a, b], { color: DIM, width: LEAD, layer: 1, cap: 'butt', what });
		leaders.push({ seg: [a, b], what, target });
	};
	const top = Math.min(...G.map((g) => g.t));             // the top of the numerators
	const row1 = top - 9, row2 = row1 - TIER;               // the bottoms of the two rows of labels above
	const lab = (src, x, yb, ax = 0.5, color = INK) => placed(src, x, yb, ax, 1, color, SIZE);

	// the left side, whole: a level leader from the left of its fraction bar, at the bar's height
	const axis = (bars[0].box.t + bars[0].box.b) / 2;
	// the label's baseline a quarter of its size below the leader, so that the leader meets the middle of the s
	const sm2 = await placed('\\mathrm{s^{-2}}', lhs.l - END_GAP - 12 - LABEL_AIR, axis + 0.25 * SIZE, 1, 1, INK, SIZE);
	L.push(sm2);
	lead([lhs.l - END_GAP, axis], [sm2.box.r + LABEL_AIR, axis], 'the leader of the left side', [0, 1, 2, 3, 4]);

	// 8 pi: up and to the left, to the lower row
	const p8 = union(eight, pi);
	const a8 = [cx(p8) - 2, p8.t - END_GAP];
	const pure = await lab('\\text{a pure number}', a8[0] - 12, row1, 0.8);
	L.push(pure);
	lead(a8, [pure.box.l + 0.8 * (pure.box.r - pure.box.l), pure.box.b + LABEL_AIR], 'the leader of 8 pi', [6, 7]);

	// G: straight up, to the upper row
	const aG = [cx(G2) + 0.6, G2.t - END_GAP];
	const unitG = await lab('\\mathrm{m^{3}\\,kg^{-1}\\,s^{-2}}', aG[0], row2, 0.5);
	L.push(unitG);
	lead(aG, [aG[0], unitG.box.b + LABEL_AIR], 'the leader of G', [8]);

	// the mean density: up and to the right, to the upper row
	const aR = [cx(rhoBar), rhoBar.t - END_GAP];
	const dens = await lab('\\text{mean density, }\\mathrm{kg\\,m^{-3}}', aR[0] + 22, row2, 0.1);
	L.push(dens);
	lead(aR, [dens.box.l + 0.1 * (dens.box.r - dens.box.l), dens.box.b + LABEL_AIR], 'the leader of the mean density', [10, 11]);

	// theta, where it is defined: straight up, to the lower row
	const aT = [cx(thd), thd.t - END_GAP];
	const none = await lab('\\text{no unit}', aT[0], row1, 0.5);
	L.push(none);
	lead(aT, [aT[0], none.box.b + LABEL_AIR], 'the leader of theta', [14]);

	// R and r: level leaders to the right, each at its glyph's middle
	for (const [g, i, what] of [[R, 16, 'R'], [r, 17, 'r']]) {
		const y = (g.t + g.b) / 2;
		const x1 = Math.max(R.r, r.r) + END_GAP;
		const m = await placed('\\mathrm{m}', x1 + 9 + LABEL_AIR, y, 0, 0.5, INK, SIZE);
		L.push(m);
		lead([g.r + END_GAP, y], [m.box.l - LABEL_AIR, y], `the leader of ${what}`, [i]);
	}

	// ---- the curved arrows: from beneath theta^3 and the mean density, hooking out to the two notes below
	const low = Math.max(...G.map((g) => g.b));             // the bottom of the denominators
	const noteTop = low + 24;
	const arc = (P0, C, P2, what) => {
		// a quadratic Bezier, sampled; its head along the tangent at the end
		const at = (t) => [(1 - t) ** 2 * P0[0] + 2 * t * (1 - t) * C[0] + t * t * P2[0], (1 - t) ** 2 * P0[1] + 2 * t * (1 - t) * C[1] + t * t * P2[1]];
		const pts = Array.from({ length: 201 }, (_, i) => at(i / 200));
		const len = pts.slice(1).reduce((s, p, i) => s + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0);
		const hd = Math.min(ARC_HEAD, 0.4 * len);
		// the shaft stops 0.8 of the head short of the tip, measured along the curve
		let s = 0, k = pts.length - 1;
		while (k > 0 && s < 0.8 * hd) { s += Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]); k--; }
		const shaft = pts.slice(0, k + 1);
		const u = [P2[0] - C[0], P2[1] - C[1]], lu = Math.hypot(...u);
		u[0] /= lu; u[1] /= lu;
		const w = [-u[1], u[0]], hw = 0.36 * hd, base = [P2[0] - u[0] * hd, P2[1] - u[1] * hd];
		S.path(shaft, { color: ACCENT, width: VEC, layer: 3, cap: 'butt', what });
		// clear of every glyph, and starting a fixed air below the one it comes from
		G.forEach((g, i) => {
			const d = Math.min(...pts.map((p) => toBox(g, p))) - VEC / 2;
			check(d >= 2, `${what} is ${d.toFixed(2)} pt from the glyph ${GLYPHS[i]} (${i})`);
		});
		const head = [P2, [base[0] + w[0] * hw, base[1] + w[1] * hw], [base[0] - w[0] * hw, base[1] - w[1] * hw]];
		S.raw(`<path d="M${head.map(([x, y]) => `${n2(x)},${n2(y)}`).join('L')}Z" fill="${ACCENT}"/>`, 3);
		S.mark([...head, P2], 0, what + "'s head");
		S.arrows.push({ L: len, head: hd, what });
		return { len, hd };
	};
	const startY = Math.max(rho.b, th3.b) + 3;
	const tipL = [cx(rho) - 16, noteTop - 3.4];
	const tipR = [cx(th3) + 16, noteTop - 3.4];
	arc([cx(rho) - 0.5, startY], [cx(rho) - 2, tipL[1] - 3], tipL, 'the arrow from the mean density');
	arc([cx(th3) + 0.5, startY], [cx(th3) + 2, tipR[1] - 3], tipR, 'the arrow from theta cubed');
	const noteL = await placed('\\text{denser}\\;\\rightarrow\\;\\text{brighter, in proportion}', tipL[0] + 10, noteTop, 1, 0, INK, SIZE);
	const noteR = await placed('\\theta\\text{ doubles}\\;\\rightarrow\\;\\text{tide}\\times 8', tipR[0] - 10, noteTop, 0, 0, INK, SIZE);
	L.push(noteL, noteR);

	// ---- checks: leaders clear every glyph but their own by GLYPH_AIR (their own by END_GAP), each other, and labels
	for (const { seg, what, target } of leaders) {
		G.forEach((g, i) => {
			const d = segToBox(g, ...seg);
			check(d >= (target.includes(i) ? END_GAP - 0.01 : GLYPH_AIR), `${what} is ${d.toFixed(2)} pt from the glyph ${GLYPHS[i]} (${i})`);
		});
		bars.forEach((b, i) => {
			const d = segToBox(b.box, ...seg);
			check(d >= (i === 0 && what.includes('left side') ? END_GAP - 0.01 : GLYPH_AIR), `${what} is ${d.toFixed(2)} pt from fraction bar ${i}`);
		});
	}
	for (let i = 0; i < leaders.length; i++) for (let j = i + 1; j < leaders.length; j++) {
		const d = segDist(leaders[i].seg, leaders[j].seg);
		check(d >= 3, `${leaders[i].what} and ${leaders[j].what} are ${d.toFixed(2)} pt apart`);
	}
	// labels against everything; a leader's own label sits LABEL_AIR from it, so the common gap is LABEL_AIR
	S.checkAll(L, 2.15);
	void two; void r3;

	window.tutReadEquation = { W, size: EQ_SIZE, label: SIZE };
	return finish(S, L, [290, 340]);
}
