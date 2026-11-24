// The tutorial, chapter 8.6 (tutorial/quantum/quantum-limit.md), its fourth diagram: a ladder of signal-to-noise
// ratios on the person a metre away. One horizontal axis of log10 SNR from 0 to 72, thin grey, ticked every 10. Four
// ink dots, named above the axis: the superconducting gradiometer in 1 s (467), the SQL pixel in 1 s (1.44 x 10^5),
// the SQL pixel in stretches of 10^4 s averaged over the age of the universe (9.5 x 10^17) and the ceiling over the age
// of the universe (2.6 x 10^70). Two open circles, named below it: the SQL pixel's tau^3/2 carried to the age of the
// universe (4.1 x 10^31, formal) and the ceiling of a camera no heavier in pull than the Earth (1.7 x 10^55). A thin
// dashed bracket from the SQL pixel in 1 s to the formal circle, "grows as tau^3/2". Each name ends with its blur by
// chapter 3.7's exact calculation (step 7), in grey. Ink and greys only.
// Departures from the diagram's comment: each blur is written in grey as the last line of its point's name, not under
// the dot, since the gradiometer's and the pixel's dots stand 11 pt apart and the axis's numbers lie under the axis;
// the names hang from thin leaders, those above the axis stepped so that each clears the leaders to its right, and the
// two open circles are named below the axis, where there is room; the bracket runs below the axis from the pixel's dot
// and ends on the formal circle's leader. The one drawing serves the phone: its names are short lines, at the size of every
// other label.
// Exact: every point's place (tut-sql-lib.js computes each ratio from the chapter's numbers and asserts it, and its
// log10, against the chapter's text and the comment), and every blur, chapter 3.7's exact full width at half maximum
// under a plane of sensors (step 7, as the site's BlurLaw interactive computes it, checked against chapter 3.7's table
// and by a second route), asserted against the chapter's 1.51, 1.91, 3.2 and 5.5 degrees and the comment's 26 and 16.
import { Sheet, ORIGIN, finish, checker, placed, boxOf, AXIS, HAIR, TICK, LABEL_GAP, SIZE, n2 } from './tut-pot-lib.js';
import { Plot, xAxis } from './tut-prob-lib.js';
import { INK, DIM, PAGE, tex } from '../lib.js';
import { chapter, palette, near } from './tut-sql-lib.js';

const name = 'tut-snr-ladder';
const check = checker(name);

// ---- the drawing (points, y down) --------------------------------------------------------------------------------
const K = 4.4;                           // points per decade
const D0 = 0, D1 = 72;
const DOT = 1.9, RING_W = 0.55;
const PITCH = 10.6;                      // baseline to baseline within a name
const FLAG = 2.6;                        // from a leader to its name
const XH = 2.6;                          // from a baseline up to the middle of the small letters
const LEAD_W = HAIR;
const DASH = [2.2, 1.6];

export default async function () {
	const { md, R, blurs } = await chapter(check);
	await palette(check);
	const S = new Sheet(name);
	const L = [];
	const W = (D1 - D0) * K;
	const P = new Plot({ left: ORIGIN - W / 2, top: ORIGIN - 10, w: W, h: 10, x0: D0, x1: D1, y0: 0, y1: 1 });
	const y0 = P.bottom;                     // the axis
	const lgR = Object.fromEntries(Object.entries(R).map(([k, v]) => [k, Math.log10(v)]));

	// ---- the axis
	const xl = await xAxis(S, P, { ticks: [0, 10, 20, 30, 40, 50, 60, 70], what: 'the axis' });
	L.push(...xl);
	const numbersBottom = Math.max(...xl.map((l) => l.box.b));

	// ---- the points
	const deg = (v) => (v >= 9.95 ? v.toFixed(0) : v.toFixed(1));
	check(deg(blurs.grad) === '26' && deg(blurs.pix) === '16' && deg(blurs.avg) === '5.5' && deg(blurs.formal) === '3.2' && deg(blurs.earth) === '1.9' && deg(blurs.ceiling) === '1.5', `the blurs ${Object.values(blurs).map(deg)}`);
	const at = (k) => [P.X(lgR[k]), y0];
	for (const k of ['grad', 'pix', 'avg', 'ceiling']) {
		const [x, y] = at(k);
		S.raw(`<circle cx="${n2(x)}" cy="${n2(y)}" r="${DOT}" fill="${INK}"/>`, 3);
		S.mark([[x, y]], DOT, `the dot of ${k}`);
	}
	for (const k of ['formal', 'earth']) {
		const [x, y] = at(k);
		S.raw(`<circle cx="${n2(x)}" cy="${n2(y)}" r="${DOT}" fill="${PAGE}" stroke="${INK}" stroke-width="${RING_W}"/>`, 3);
		S.mark([[x, y]], DOT + RING_W / 2, `the circle of ${k}`);
	}
	check(lgR.ceiling < D1 && lgR.grad > D0, 'a point leaves the axis');
	// the caption: sixty-eight powers of ten, from the gradiometer's blur to the ceiling's
	const flat = md.replace(/\s+/g, ' ');
	check(Math.round(lgR.ceiling - lgR.grad) === 68 && flat.includes(`sixty-eight powers of ten of signal-to-noise ratio narrow it from ${deg(blurs.grad)}° to ${deg(blurs.ceiling)}°`), 'the caption\'s span and blurs');

	/** A name of several lines on common baselines, hung from a leader: the leader runs from the point to the middle
	 * of the first line's small letters, and the lines stand right (side 1) or left (side -1) of it. */
	const flag = async (k, lines, base, side) => {
		const [x, y] = at(k);
		const up = base < y;
		const top = base - XH;
		S.path([[x, up ? y - DOT - 0.8 : y + DOT + 0.8], [x, top]], { color: DIM, width: LEAD_W, cap: 'butt', layer: 1.5, what: `the leader of ${k}` });
		const out = [];
		for (const [i, [src, color]] of lines.entries()) {
			const g = await tex(src, [x + side * FLAG, base + i * PITCH], SIZE, side > 0 ? 'lB' : 'rB', color);
			out.push({ src, svg: g, box: boxOf(g), on: [`the leader of ${k}`] });
		}
		// the leader may run beside its own lines only, and stops at the first
		for (const o of out) check(side > 0 ? o.box.l >= x + FLAG - 0.6 : o.box.r <= x - FLAG + 0.6, `a line of ${k} crosses its leader`);
		return out;
	};
	const blurLine = (k) => [`\\text{blur }${deg(blurs[k])}^\\circ`, DIM];

	// ---- above the axis: each name clears the leaders to its right
	const first = (lines, bottom) => bottom - (lines - 1) * PITCH;     // the first baseline, from the last
	const avgLast = y0 - 8.5;
	const avg = await flag('avg', [['\\text{the SQL pixel, }10^4\\text{ s stretches}', INK], ['\\text{averaged over the age of}', INK], ['\\text{the universe}', INK], blurLine('avg')], first(4, avgLast), 1);
	const ceil = await flag('ceiling', [['\\text{the ceiling,}', INK], ['\\text{age of the universe}', INK], blurLine('ceiling')], first(3, avgLast), -1);
	const topOf = (ls) => Math.min(...ls.map((l) => l.box.t));
	const pixLast = topOf(avg) - 4.5 - 2.2;
	const pix = await flag('pix', [['\\text{the SQL pixel, 1 s}', INK], blurLine('pix')], first(2, pixLast), 1);
	const gradLast = topOf(pix) - 4.5 - 2.2;
	const grad = await flag('grad', [['\\text{superconducting gradiometer, 1 s}', INK], blurLine('grad')], first(2, gradLast), 1);
	L.push(...avg, ...ceil, ...pix, ...grad);

	// ---- below the axis: the two open circles, and the bracket from the pixel to the formal circle
	const below = numbersBottom + 6;
	const yb = numbersBottom + 5;            // the bracket's run
	{
		const [xa] = at('pix'), [xf] = at('formal');
		S.path([[xa, y0 + DOT + 0.8], [xa, yb], [xf, yb]], { color: DIM, width: LEAD_W, dash: DASH, cap: 'butt', layer: 1.4, what: 'the bracket' });
		L.push(await placed('\\text{grows as }\\tau^{3/2}', (xa + xf) / 2, yb + LEAD_W / 2 + LABEL_GAP + 0.4, 0.5, 0, DIM));
	}
	const formalBase = below + 13;
	const formal = await flag('formal', [['\\text{the SQL pixel, }\\tau^{3/2}', INK], ['\\text{carried to the age of}', INK], ['\\text{the universe (formal)}', INK], blurLine('formal')], formalBase, 1);
	const earth = await flag('earth', [['\\text{the ceiling, a camera}', INK], ['\\text{no heavier in pull}', INK], ['\\text{than the Earth}', INK], blurLine('earth')], formalBase, 1);
	L.push(...formal, ...earth);
	// the axis's name, under the bracket's name at the left
	{
		const bn = L.find((l) => l.src.startsWith('\\text{grows'));
		L.push(await placed('\\log_{10}\\text{SNR on the person, 1 m away}', P.left, bn.box.b + 7, 0, 0, DIM));
	}
	check(near(at('formal')[0] - at('pix')[0], (lgR.formal - lgR.pix) * K, 1e-9), 'the bracket\'s span');
	check(near(lgR.formal - lgR.pix, 1.5 * Math.log10(4.35e17), 1e-9), 'the bracket is not tau^3/2 over the age of the universe');

	S.checkAll(L);
	window[name + '-numbers'] = { ratios: R, blurs };
	return finish(S, L, [280, 340]);
}
