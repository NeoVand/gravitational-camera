// The tutorial, reading chapter R8 (tutorial/quantum/reading-the-quantum-limits.md), its second diagram: the
// capstone's tides a metre away, a different story from chapter 8.6's tut-snr-ladder (which draws signal-to-noise
// ratios and blurs). One panel: a vertical logarithmic axis of tides in s^-2, from 10^-8 at the top to 10^-30 at the
// bottom, thin grey, ticked every two decades with its numbers on the left. Left of the axis, the instruments' smallest
// resolved steady tides as short ink bars named on the left: the superconducting gradiometer in one second (2 x 10^-11),
// the gram pixel at the standard quantum limit in one second (6.5 x 10^-14, with the distance of the two, 9.2 x 10^-14),
// and, as a dotted bar, the gram pixel in 10^3 s stretches averaged over the age of the universe (the person's
// 9.34 x 10^-9 over 9.5 x 10^16, 9.8 x 10^-26). Right of the axis, the scenes as ink dots named on the right: the person
// (9.34 x 10^-9), a gram in two places a micrometre apart (12 G m d^2 / r^5 = 8.0 x 10^-25), the steel ball's thermal
// tremor (3.4 x 10^-25) and its zero-point tremor (1.2 x 10^-29). A thin dashed grey line runs from the one-second gram
// pixel's bar across to the right, "one second at the SQL". Ink and greys only.
// Departures from the diagram's comment: the distance of the two lies only 0.15 decades (1.3 pt) above the one-mass
// limit, so its bar is a grey hairline 1.3 pt above the ink bar, joined to it at its outer end by a bracket of that
// height, and both numbers are named in the one label, which hangs from a leader below the bars; the gram in two
// places and the ball's thermal tremor lie 0.37 decades (3 pt) apart, so their dots stand side by side and their names
// hang from leaders, the first above and the second below. The one drawing serves the phone: every label is at the
// size of every other label.
// Exact: every place on the axis. The pixel's tides, the person's, the gradiometer's, the ratio 9.5 x 10^16 and the
// pair's fall in 3.9 x 10^3 s are chapter 8.6's (figs/tut-sql-lib.js, computed and asserted against 8.6's text); the
// ball's thermal tide is chapter 4.1's (figs/tut-osc-lib.js, `ball`, the quadrupole integrated over the ball) and its
// zero-point tide the same with the thermal swing replaced by chapter 8.3's x_zp = sqrt(hbar / 2 m omega)
// (figs/tut-quanta-lib.js, chapter 4.3's steel); the split gram's tide is the quadrupole m d^2 of chapter 8.1 put
// through chapter 4.1's `quadrupoleTide`. Every number printed is asserted against R8's text (outside its comments)
// or, for the two that only this figure prints, 9.8 x 10^-26 and 1.2 x 10^-29, against the text's own ingredients.
import { Sheet, ORIGIN, finish, checker, placed, boxOf, AXIS, HAIR, LABEL_GAP, SIZE, n2 } from './tut-pot-lib.js';
import { Plot, yAxis } from './tut-prob-lib.js';
import { INK, DIM, tex } from '../lib.js';
import { chapter as sql, pixelTide, personTide, GRADIOMETER, ladder, MASS, XI, STRETCH, AGE, near } from './tut-sql-lib.js';
import { ball, quadrupoleTide, G, KB, TEMP } from './tut-osc-lib.js';
import { HBAR as HBAR_83, M_BALL, M_EFF, K_BALL, W_BALL } from './tut-quanta-lib.js';
import { R_BALL } from './tut-elastic-lib.js';

const name = 'tut-quantum-tides';
const check = checker(name);

// ---- the drawing (points, y down) --------------------------------------------------------------------------------
const K = 8.6;                     // points per decade
const D_TOP = -8, D_BOTTOM = -30;  // the axis, log10 of the tide in s^-2
const TICKS = [-8, -10, -12, -14, -16, -18, -20, -22, -24, -26, -28, -30];
const BAR = 16;                    // an instrument's bar
const BAR_W = 0.75;                // its stroke
const BAR_DOT = 1.0, BAR_DOT_STEP = 2.2;   // the dotted bar's dots and their spacing
const BAR_AIR = 3.5;               // from the axis's numbers to a bar's inner end
const DOT = 1.9;                   // a scene's dot
const DOT_IN = 7;                  // from the axis to a dot
const SIDE = 8;                    // the second of two dots side by side, further right
const PITCH = 10.4;                // baseline to baseline within a name
const FLAG = 2.6;                  // from a leader to its name
const XH = 2.6;                    // from a baseline up to the middle of the small letters
const DASH = [2.2, 1.6];

export default async function () {
	// ---- the numbers
	const { R } = await sql(check);
	const md = await (await fetch('/tutorial/quantum/reading-the-quantum-limits.md')).text();
	const flat = md.replace(/<!--[\s\S]*?-->/g, ' ').replace(/\s+/g, ' ');
	const has = (s, what) => check(flat.includes(s), `R8 does not say ${what}: ${s}`);
	const sig = (v, d) => Number(v).toPrecision(d);

	const person = personTide(), grad = GRADIOMETER, pix = pixelTide(), pix2 = pixelTide(true);
	has('The person a metre away makes $9.34\\times10^{-9}\\unit{s^{-2}}$', 'the person\'s tide');
	has('$2\\times10^{-11}\\unit{s^{-2}}$ in a second', 'the gradiometer');
	has('$2\\sigma_{\\rm SQL}/\\xi\\tau^2 = 6.5\\times10^{-14}\\unit{s^{-2}}$', 'the pixel');
	has('resolves $\\sqrt2$ times more, $9.2\\times10^{-14}\\unit{s^{-2}}$, the paper\'s figure', 'the distance of the two');
	check(sig(person, 3) === '9.34e-9' && sig(grad, 1) === '2e-11' && sig(pix, 2) === '6.5e-14' && sig(pix2, 2) === '9.2e-14', 'the instruments\' tides');
	// the averaged pixel: the person's tide over the ratio it reaches in 10^3 s stretches over the age of the universe,
	// which end because the two grams fall together under their own pull in about an hour
	has('The two grams fall together under their own pull in about an hour, so read in stretches of $10^3$ s and averaged over the age of the universe, the pixel reaches $9.5\\times10^{16}$', 'the averaged pixel');
	const fall = Math.sqrt(XI ** 3 / (G * MASS));
	check(sig(fall, 2) === '3.9e+3' && STRETCH < fall && fall < 2 * 3600 && sig(R.avg, 2) === '9.5e+16' && AGE === 4.35e17, `the pair falls in ${fall} s`);
	check(near(R.avg, (person / pix) * (STRETCH / 1) ** 1.5 * Math.sqrt(AGE / STRETCH), 1e-9), 'the averaged ratio');
	const avg = person / R.avg;
	check(sig(avg, 2) === '9.8e-26', `the averaged pixel resolves ${avg}`);
	// the split gram: the difference of the two branches' second moments, m d^2 along the split, as a quadrupole
	// 3 x x - r^2 of m d^2 diag(-1, -1, 2), whose tide a metre away along the split is 12 G m d^2 / r^5
	has('For a gram split by a micrometre, $\\matter md^2 = 10^{-15}\\unit{kg\\,m^2}$', 'the split gram');
	has('$12G\\matter md^2/r^5 = 8.0\\times10^{-25}\\unit{s^{-2}}$', 'the split gram\'s tide');
	const m = 1e-3, d = 1e-6, md2 = m * d * d;
	check(near(md2, 1e-15, 1e-12), 'm d^2');
	const E = quadrupoleTide([[-md2, 0, 0], [0, -md2, 0], [0, 0, 2 * md2]], [0, 0, 1]);
	const split = Math.abs(E[2][2]);
	check(near(split, 12 * G * md2, 1e-5) && sig(split, 2) === '8.0e-25', `the split gram's tide ${split}`);
	check(sig(split / pix, 2) === '1.2e-11', 'the split gram over the pixel');
	has('That is $1.2\\times10^{-11}$ of what the gram pixel of Section II resolves in a second', 'the ratio of the split gram');
	// the steel ball: its thermal tide (chapter 4.1's), and its zero-point tide, the same quadrupole with the thermal
	// swing sqrt(k_B T / K) replaced by the zero-point swing sqrt(hbar / 2 m omega) (chapter 8.3's)
	has('Its thermal tremor makes $3.4\\times10^{-25}\\unit{s^{-2}}$ a metre away', 'the ball\'s tide');
	has('$5.3\\times10^{-12}$ of what the gram pixel resolves in a second', 'the ball over the pixel');
	has('**zero-point motion**, the swing that it keeps with no heat at all: $7.5\\times10^{-21}$ m at the poles, $2.9\\times10^4$ times less than the thermal swing of $2.2\\times10^{-16}$ m', 'the zero-point swing');
	const { tideRms } = ball(check);
	const qTherm = Math.sqrt((KB * TEMP) / K_BALL), xzp = Math.sqrt(HBAR_83 / (2 * M_EFF * W_BALL));
	check(sig(xzp, 2) === '7.5e-21' && sig(qTherm, 2) === '2.2e-16' && sig(qTherm / xzp, 2) === '2.9e+4', `the swings ${xzp}, ${qTherm}`);
	const thermal = (36 * G * M_BALL * R_BALL * qTherm) / 5, zero = (36 * G * M_BALL * R_BALL * xzp) / 5;
	check(sig(thermal, 2) === '3.4e-25' && sig(tideRms, 2) === '3.4e-25' && sig(thermal / pix, 2) === '5.3e-12', `the ball's tide ${thermal}`);
	check(sig(zero, 2) === '1.2e-29' && near(zero / thermal, xzp / qTherm, 1e-12), `the zero-point tide ${zero}`);
	// the caption: the quantum scenes more than ten powers of ten below the one-second pixel, the zero point more than
	// fifteen; the averaged pixel below the scenes, the person far above every instrument
	check(Math.log10(pix / split) > 10 && Math.log10(pix / thermal) > 10 && Math.log10(pix / zero) > 15 && Math.log10(pix / zero) < 16, 'the caption\'s powers of ten');
	check(avg < thermal && avg < split && zero < avg && person > grad, 'the order of the marks');

	// ---- the sheet
	const S = new Sheet(name);
	const L = [];
	const H = (D_TOP - D_BOTTOM) * K;
	const A = ORIGIN;                                         // the axis
	const P = new Plot({ left: A, top: ORIGIN - H / 2, w: 1, h: H, x0: 0, x1: 1, y0: D_BOTTOM, y1: D_TOP });
	const y = (v) => P.Y(Math.log10(v));
	const numbers = await yAxis(S, P, { ticks: TICKS, fmt: (t) => `10^{${t}}`, x: A, what: 'the axis' });
	L.push(...numbers);
	const numLeft = Math.min(...numbers.map((g) => g.box.l));
	// the axis's name, above its top
	{
		const top = P.Y(D_TOP);
		const g = await placed('\\text{tide a metre away, s}^{-2}', numLeft, top - 4.6 - 3.2, 0, 1, DIM);
		L.push(g);
	}

	// ---- the instruments: bars left of the axis, their inner ends BAR_OUT from it
	const xIn = numLeft - BAR_AIR, xOut = xIn - BAR;
	const bar = (v, what, o = {}) => S.path([[xOut, y(v)], [xIn, y(v)]], { color: INK, width: BAR_W, cap: 'butt', layer: 2, what, ...o });
	bar(grad, 'the gradiometer\'s bar');
	bar(pix, 'the pixel\'s bar');
	// the distance of the two: a hairline 1.3 pt above, joined to the pixel's bar at its outer end
	S.path([[xIn, y(pix2)], [xOut, y(pix2)], [xOut, y(pix)]], { color: DIM, width: HAIR, cap: 'butt', layer: 2, what: 'the bracket of the distance of the two' });
	check(y(pix) - y(pix2) > (BAR_W + HAIR) / 2 + 0.3, 'the two bars of the pixel touch');
	// the averaged pixel, dotted
	{
		const n = Math.round((BAR - BAR_DOT) / BAR_DOT_STEP), step = (BAR - BAR_DOT) / n;
		const d = Array.from({ length: n + 1 }, (_, k) => `M${n2(xOut + BAR_DOT / 2 + k * step)},${n2(y(avg))}h0`).join('');
		S.raw(`<path d="${d}" stroke="${INK}" stroke-width="${BAR_DOT}" stroke-linecap="round" fill="none"/>`, 2);
		S.mark([[xOut, y(avg)], [xIn, y(avg)]], BAR_DOT / 2, 'the averaged pixel\'s dotted bar');
	}

	/** Lines right- (side -1) or left-aligned (side 1) at x, on baselines from `base`; returns them as one label (the
	 * lines of one name are checked against the marks and the other names, not against one another). */
	const lines = async (rows, x, base, side) => {
		const out = [];
		for (const [i, [src, color]] of rows.entries()) {
			const g = await tex(src, [x, base + i * PITCH], SIZE, side > 0 ? 'lB' : 'rB', color);
			out.push({ src, svg: g, box: boxOf(g) });
		}
		for (let i = 1; i < out.length; i++) check(out[i].box.t - out[i - 1].box.b > 0.3, `the lines ${out[i - 1].src} and ${out[i].src} overlap`);
		const box = { l: Math.min(...out.map((g) => g.box.l)), r: Math.max(...out.map((g) => g.box.r)), t: Math.min(...out.map((g) => g.box.t)), b: Math.max(...out.map((g) => g.box.b)) };
		return [{ src: out.map((g) => g.src).join(' / '), svg: out.map((g) => g.svg).join(''), box, rows: out }];
	};
	/** Lines centred, on their ink, on the height yc. */
	const centred = async (rows, x, yc, side) => {
		const probe = await lines(rows, x, 0, side);
		const t = Math.min(...probe.map((g) => g.box.t)), b = Math.max(...probe.map((g) => g.box.b));
		return lines(rows, x, yc - (t + b) / 2, side);
	};
	/** Lines hung from a vertical leader that starts at (x, y0) and runs down (dir 1) or up (dir -1) to the middle of
	 * the first (down) or last (up) line's small letters, the lines beside it on `side`. */
	const hung = async (rows, x, y0, gapToText, dir, side, what) => {
		const n = rows.length;
		const firstBase = dir > 0 ? y0 + gapToText : y0 - gapToText - (n - 1) * PITCH;
		const end = dir > 0 ? firstBase - XH : firstBase + (n - 1) * PITCH - XH;
		S.path([[x, y0], [x, end]], { color: DIM, width: HAIR, cap: 'butt', layer: 1.5, what });
		const out = await lines(rows, x + side * FLAG, firstBase, side);
		for (const o of out) { o.on = [what]; for (const r of o.rows) check(side > 0 ? r.box.l >= x + FLAG - 0.6 : r.box.r <= x - FLAG + 0.6, `a line crosses ${what}`); }
		return out;
	};

	const NUM_TEX = { grad: '2\\times10^{-11}', pix: '6.5\\times10^{-14}', pix2: '9.2\\times10^{-14}', avg: '9.8\\times10^{-26}', person: '9.34\\times10^{-9}', split: '8.0\\times10^{-25}', thermal: '3.4\\times10^{-25}', zero: '1.2\\times10^{-29}' };
	// each printed number is the computed one, to its digits
	const printed = (s) => Number(s.replace('\\times10^{', 'e').replace('}', ''));
	for (const [k, v] of Object.entries({ grad, pix, pix2, avg, person, split, thermal, zero })) {
		const p = printed(NUM_TEX[k]), digits = NUM_TEX[k].split('\\times')[0].replace('.', '').length;
		check(sig(v, digits) === sig(p, digits), `${k}: printed ${NUM_TEX[k]}, computed ${v}`);
	}

	const xL = xOut - LABEL_GAP - 0.6;
	L.push(...(await centred([['\\text{superconducting}', INK], ['\\text{gradiometer, one}', INK], [`\\text{second, }${NUM_TEX.grad}`, INK]], xL, y(grad), -1)));
	L.push(...(await hung([
		['\\text{the gram pixel at the}', INK],
		['\\text{standard quantum limit,}', INK],
		[`\\text{one second, }${NUM_TEX.pix}\\text{;}`, INK],
		[`${NUM_TEX.pix2}\\text{ for the}`, DIM],
		['\\text{distance of the two}', DIM]
	], (xOut + xIn) / 2, y(pix) + BAR_W / 2 + 0.8, 14, 1, -1, 'the pixel\'s leader')));
	L.push(...(await centred([['\\text{the gram pixel in}', INK], ['10^3\\text{ s stretches over}', INK], ['\\text{the age of the universe,}', INK], [NUM_TEX.avg, INK]], xL, y(avg), -1)));

	// ---- the scenes: dots right of the axis
	const dot = (x, v, what) => {
		S.raw(`<circle cx="${n2(x)}" cy="${n2(y(v))}" r="${DOT}" fill="${INK}"/>`, 3);
		S.mark([[x, y(v)]], DOT, what);
	};
	const x1 = A + DOT_IN, x2 = x1 + SIDE;
	dot(x1, person, 'the person\'s dot');
	dot(x1, split, 'the split gram\'s dot');
	dot(x2, thermal, 'the ball\'s dot');
	dot(x1, zero, 'the zero point\'s dot');
	check(y(thermal) - y(split) < 2 * DOT + 0.5 && x2 - x1 >= 2 * DOT + 3, 'the two close dots');
	const xR = x1 + DOT + LABEL_GAP + 0.6;
	L.push(...(await centred([[`\\text{the person, }${NUM_TEX.person}`, INK]], xR, y(person), 1)));
	L.push(...(await hung([['\\text{a gram in two places}', INK], ['\\text{a micrometre apart,}', INK], [NUM_TEX.split, INK]], x1, y(split) - DOT - 0.8, 7.5, -1, 1, 'the split gram\'s leader')));
	L.push(...(await hung([['\\text{the steel ball\'s thermal}', INK], [`\\text{tremor, }${NUM_TEX.thermal}`, INK]], x2, y(thermal) + DOT + 0.8, 9.5, 1, 1, 'the ball\'s leader')));
	L.push(...(await centred([['\\text{its zero-point tremor,}', INK], [NUM_TEX.zero, INK]], xR, y(zero), 1)));

	// ---- the dashed line from the one-second pixel's bar across to the right, and its name above it at the right
	const right = Math.max(...L.filter((g) => g.box.l > A).map((g) => g.box.r));
	S.path([[xIn + 1.2, y(pix)], [right, y(pix)]], { color: DIM, width: HAIR, dash: DASH, cap: 'butt', layer: 1, what: 'the dashed line' });
	{
		const g = await placed('\\text{one second at the SQL}', right, y(pix) - HAIR / 2 - LABEL_GAP - 0.4, 1, 1, DIM);
		L.push(g);
	}
	check(Math.max(...L.map((g) => g.box.r)) <= right + 0.01, 'a label reaches beyond the dashed line\'s end');

	S.checkAll(L);
	window[name + '-numbers'] = { person, grad, pix, pix2, avg, split, thermal, zero, fall };
	return finish(S, L, [220, 320]);
}
