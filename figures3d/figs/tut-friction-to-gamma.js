// The tutorial, section 11.4 (tutorial/black-holes/under-tides.md), its second diagram: the friction becomes the
// greybody factor. Two rows. Above, four boxes in a chain joined by thin ink arrows, the boxes outlined in the page's
// faint grey (the last one heavier, in ink: the result), each with a short name over its quantity: "friction" nu;
// "power" (1/2) nu omega^6 h^2; "cross-section" 16 pi G nu omega^4 / c^3; "Page's limit" Gamma_2 = (256/225) x^6. Under
// each arrow, what it does: "x (1/2) omega^6 h^2", "/ F", "/ 5 pi c^2 / omega^2". Below, on logarithmic axes, x = GM
// omega / c^3 from 10^-3 to 1 and Gamma_2 from 10^-18 to 1: Page's line (256/225) x^6 dashed, and section 11.3's
// Regge-Wheeler Gamma_2 thin solid ink from the table, on the line at its left end and bending up to 1 near x = 0.5; a
// dotted mark from the axis up to x = 0.01, named "x 1.07". The wave's strain h in the field's colour, as the chapter
// colours it; everything else in ink and the page's greys.
// The computed curve is named "scattered wave, Gamma_2", not by its section number (the book and the site number the
// sections differently).
// Departures from the diagram's comment: each box carries a name over its quantity, and the last is named "Page's
// limit", as the chapter names it, so that the bottom panel's dashed line is the same thing; every arrow, not only the
// third, says what it does (the chapter's three steps, the flux F included), in small type under it; the dashed line is
// in the page's dim grey, not an accent colour (tut-friction-lib.js: orange and blue mean a stretch and a squeeze, and the
// interactive draws this line neutral); the computed curve starts at x = 0.01, where 11.3's table starts, as in the
// interactive, so that every solid point is the solver's; the mark at 0.01 says "x 1.07", the factor by which the
// computed Gamma_2 exceeds Page's line there, since a bare "1.07" would read as a value of Gamma_2; Page's line stops
// where it reaches 1, at x = (225/256)^(1/6) = 0.979; the two rows stay one above the other at every width.
// Exact: the chain's quantities and steps (asserted in SI in tut-friction-lib.js), Page's line, the computed curve (the
// table of tut-friction-lib.js, asserted number for number against the interactive's data, read between its points
// as the interactive reads it, and 1 above x = 0.78), and the factor 1.07 at x = 0.01. Nothing is schematic.
import { Sheet, ORIGIN, finish, checker, placed, boxOf, near, LABEL_GAP, AXIS, AXIS_HEAD, HAIR, n2 } from './tut-pot-lib.js';
import { Plot, xAxis, yAxis } from './tut-prob-lib.js';
import { INK, DIM, FAINT, tex } from '../lib.js';
import { chapter, palette, FIELD, X, GAMMA2, gamma2, page, PAGE } from './tut-friction-lib.js';

const name = 'tut-friction-to-gamma';
const check = checker(name);

// ---- the drawing (points) ----------------------------------------------------------------------------------------
const lg = Math.log10;
const X0 = -3, X1 = 0, Y0 = -19, Y1 = 0;
const DX = 96, DY = 7.4;                        // points per decade
const CURVE = 0.7, LAW = 0.55, DASH = [3, 2];
const PAD_X = 4.2, PAD_Y = 4, NAME_AIR = 3.2;    // a box's ink to its outline; its name to its quantity
const OUTLINE = HAIR + 0.1, HEAVY = 0.9, ROUND = 2;
const ARROW = 17;                               // between the boxes, the least; or the note's width and air
const SMALL = 7;                                // the arrows' notes
const NOTE_AIR = 2.6;                           // from a note to the boxes beside it
const SHIFT = 12;                               // the plot's frame right of the page's centre, for its numbers
const ROWS = 30;                                // from the chain's notes to the plot's title
const caption = 'Look first at the bottom panel\'s two lines: the friction\'s Page line and the scattered wave\'s $\\Gamma_2$ meet as the waves grow long. The chain above is the derivation; the curves are exact.';

export default async function () {
	const { state } = await chapter(check);
	await palette(check);
	state(name, 'friction-to-gamma', caption);
	const S = new Sheet(name);
	const L = [];
	const W = (X1 - X0) * DX, H = (Y1 - Y0) * DY;

	// ---- the chain
	const h = `{\\color{${FIELD}}h}`;
	const boxes = [
		{ name: '\\text{friction}', q: '\\nu' },
		{ name: '\\text{power}', q: `\\tfrac12\\nu\\omega^6${h}^2` },
		{ name: '\\text{cross-section}', q: '16\\pi G\\nu\\omega^4/c^3' },
		{ name: '\\text{Page\'s limit}', q: '\\Gamma_2 = (256/225)x^6', heavy: true }
	];
	const notes = [`\\times\\tfrac12\\omega^6${h}^2`, '\\div F', '\\div 5\\pi c^2/\\omega^2'];
	// names and quantities on shared baselines: each set with its baseline at the given height
	const onBase = async (src, x, base, size = undefined) => {
		const g = await tex(src, [x, base], size, 'cB', INK);
		return { src, svg: g, box: boxOf(g) };
	};
	const nameProbes = await Promise.all(boxes.map((b) => onBase(b.name, 0, 0)));
	const qProbes = await Promise.all(boxes.map((b) => onBase(b.q, 0, 0)));
	const ext = (ps) => ({ up: Math.max(...ps.map((p) => -p.box.t)), down: Math.max(...ps.map((p) => p.box.b)) });
	const nameExt = ext(nameProbes), qExt = ext(qProbes);
	const BH = PAD_Y + nameExt.up + nameExt.down + NAME_AIR + qExt.up + qExt.down + PAD_Y;
	const widths = boxes.map((_, k) => Math.max(...[nameProbes[k], qProbes[k]].map((p) => p.box.r - p.box.l)) + 2 * PAD_X);
	const noteW = (await Promise.all(notes.map((n) => placed(n, 0, 0, 0, 0, INK, SMALL)))).map((p) => p.box.r - p.box.l);
	const gaps = noteW.map((w) => Math.max(ARROW, w + 2 * NOTE_AIR));
	const chainW = widths.reduce((s, w) => s + w, 0) + gaps.reduce((s, g) => s + g, 0);
	// the chain centred over the plot's frame
	let left = ORIGIN + SHIFT - chainW / 2;
	const top = ORIGIN - 200;
	const nameBase = top + PAD_Y + nameExt.up, qBase = nameBase + nameExt.down + NAME_AIR + qExt.up;
	const rects = [];
	for (const [k, b] of boxes.entries()) {
		const w = b.heavy ? HEAVY : OUTLINE, o = w / 2, color = b.heavy ? INK : FAINT;
		const r = { l: left, r: left + widths[k], t: top, b: top + BH };
		S.raw(`<rect x="${n2(r.l + o)}" y="${n2(r.t + o)}" width="${n2(widths[k] - w)}" height="${n2(BH - w)}" rx="${ROUND}" fill="none" stroke="${color}" stroke-width="${w}"/>`, 1);
		S.mark([[r.l + o, r.t + o], [r.r - o, r.t + o], [r.r - o, r.b - o], [r.l + o, r.b - o], [r.l + o, r.t + o]], o, `box ${k + 1}`);
		const cx = (r.l + r.r) / 2;
		// centred by their ink, not by MathJax's box
		const nm = await onBase(b.name, cx - (nameProbes[k].box.l + nameProbes[k].box.r) / 2, nameBase);
		const q = await onBase(b.q, cx - (qProbes[k].box.l + qProbes[k].box.r) / 2, qBase);
		for (const t of [nm, q]) check(t.box.l >= r.l + PAD_X - 0.01 && t.box.r <= r.r - PAD_X + 0.01 && t.box.t >= r.t + PAD_Y - 0.01 && t.box.b <= r.b - PAD_Y + 0.01, `box ${k + 1}: ${t.src} leaves it: ${[t.box.l - r.l, r.r - t.box.r, t.box.t - r.t, r.b - t.box.b].map((v) => v.toFixed(2))}`);
		L.push(nm, q);
		rects.push(r);
		left = r.r + (gaps[k] ?? 0);
	}
	// the arrows, at the boxes' middle height, and the notes under them
	const mid = top + BH / 2;
	let notesBottom = top + BH;
	for (let k = 0; k < 3; k++) {
		const a = S.arrow([rects[k].r + 1.6, mid], [rects[k + 1].l - 1.6, mid], { color: INK, width: AXIS, head: AXIS_HEAD, layer: 2, what: `the arrow ${k + 1}` });
		check(near(a.L, gaps[k] - 3.2, 1e-9), 'the arrow does not span its gap');
		const n = await placed(notes[k], (rects[k].r + rects[k + 1].l) / 2, mid + 0.36 * AXIS_HEAD + LABEL_GAP + 0.3, 0.5, 0, INK, SMALL);
		check(n.box.l >= rects[k].r + NOTE_AIR - 1e-6 && n.box.r <= rects[k + 1].l - NOTE_AIR + 1e-6, `the note ${notes[k]} is wider than its arrow`);
		L.push(n);
		notesBottom = Math.max(notesBottom, n.box.b);
	}

	// ---- the plot, under the chain
	const ptop = Math.max(notesBottom, top + BH) + ROWS;
	const P = new Plot({ left: ORIGIN + SHIFT - W / 2, top: ptop, w: W, h: H, x0: X0, x1: X1, y0: Y0, y1: Y1 });
	const at = (x, y) => P.at(lg(x), lg(y));
	const xl = await xAxis(S, P, { ticks: [-3, -2, -1, 0], fmt: (t) => ['10^{-3}', '0.01', '0.1', '1'][t + 3], what: 'the axis across' });
	L.push(...xl);
	L.push(...(await yAxis(S, P, { ticks: [-18, -12, -6, 0], fmt: (t) => (t === 0 ? '1' : `10^{${t}}`), what: 'the axis up' })));
	const below = Math.max(...xl.map((l) => l.box.b));
	L.push(await placed('x = GM\\omega/c^3', P.X(-1.5), below + 4, 0.5, 0, DIM));
	L.push(await placed('\\Gamma_2', P.left - 4, P.top - 9, 0, 1, DIM));
	// the chain is no wider than the plot with its numbers, and centred over the plot's frame
	check(rects[0].l >= P.left - 26 && rects[3].r <= P.right + 6, `the chain (${chainW.toFixed(1)} pt) is wider than the plot`);

	// ---- Page's line, dashed, from the panel's left edge to where it reaches 1
	const top1 = (1 / PAGE) ** (1 / 6);
	check(near(page(top1), 1, 1e-12) && top1.toFixed(3) === '0.979', 'Page\'s line reaches 1 at 0.979');
	check(page(10 ** X0) > 10 ** Y0, 'Page\'s line starts under the panel');
	S.path([at(10 ** X0, page(10 ** X0)), at(top1, 1)], { color: DIM, width: LAW, dash: DASH, cap: 'butt', layer: 1.6, what: 'Page\'s line' });

	// ---- the computed Gamma_2: the table's points from 0.01 to 0.78, then 1 to the panel's end
	const pts = [...X.map((x, i) => at(x, GAMMA2[i])), at(1, 1)];
	X.forEach((x, i) => check(near(gamma2(x), GAMMA2[i], 1e-15), `the curve at ${x}`));
	check(gamma2(1) === 1 && GAMMA2.at(-1) === 1, 'the curve does not end at 1');
	S.path(pts, { color: INK, width: CURVE, layer: 2, what: 'the computed Gamma_2' });

	// ---- the mark at x = 0.01: dotted from the axis up to the lines, and the factor beside it
	const ratio = GAMMA2[0] / page(0.01);
	check(ratio.toFixed(2) === '1.07', `the factor at 0.01 is ${ratio}`);
	const m0 = at(0.01, page(0.01));
	S.dots([m0[0], P.bottom - AXIS / 2], [m0[0], m0[1]], { color: DIM, clear0: 1.2, clear1: 2.4, layer: 1.2, what: 'the mark at 0.01' });
	L.push(await S.clear('\\times 1.07', m0[0] + 2.6, m0[1] + 14, 0, 0.5, [1, 0]));

	// ---- the names: the computed curve's left of its rise; Page's line's under it, to the right
	{
		const y = 1e-3, x = 0.15;
		check(gamma2(x) < y / 10, 'the curve\'s name is not left of its rise');
		L.push(await S.clear('\\text{scattered wave, }\\Gamma_2', P.X(lg(x)), P.Y(lg(y)), 1, 0.5, [-1, 0]));
	}
	{
		const q = at(0.1, page(0.1)), u = [DY * 6, DX].map((v) => v / Math.hypot(DX, DY * 6));   // down and to the right
		L.push(await S.clear('\\text{Page\'s line, }(256/225)x^6', q[0] + 2, q[1] + 2, 0, 0, u));
	}

	S.checkAll(L);
	window[name + '-numbers'] = { ratio, top1, chainW };
	return finish(S, L, [300, 370]);
}
