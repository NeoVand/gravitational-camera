// The tutorial, chapter 7.1 (tutorial/geometry/metric.md), its third diagram: the count of what falling can remove.
// Bars to one scale, 2.1 points (4 site pixels at 1440) to the number: what the metric has at an event, 10 values, 40
// first derivatives and 100 second derivatives, thin ink outlines with a faint ink fill; under each, what a change of
// coordinates can set, 10 (of 16; 6 are turns and boosts), 40 and 80, in the observer's colour; the 20 second
// derivatives that nothing below matches filled in the curvature's colour and named "20 remain: curvature".
// Departures from the diagram's comment: the comment's two rows of three bars side by side would need about 320
// points, too wide for the text to stay readable on a phone; so the three pairs are stacked, each bar of the metric
// directly over the bar of what a change of coordinates can set, both from one left end, and the two rows' names,
// "the metric at an event" and "a change of coordinates can set", stand once at the top as a key with a short sample
// of each kind of bar. Each pair is named above it ("values", "first derivatives", "second derivatives"), and each bar
// carries its number at its right end; the comment's note "of 16; 6 are turns and boosts" follows the 10 of the
// first bar below. "20 remain: curvature" stands over its coloured end.
// Exact: every bar's length, 2.1 points to the number (asserted on the page against 10, 40, 100 and 10, 40, 80, and
// the coloured end against 100 - 80 = 20; the numbers are counted in tut-metric-lib.js). Nothing is schematic.
import { Sheet, ORIGIN, finish, checker, placed, near, LABEL_GAP, HAIR } from './tut-pot-lib.js';
import { TINT } from './tut-gauss-lib.js';
import { INK } from '../lib.js';
import { chapter, palette, OBS, CURV, VALUES, FIRST, SECOND, A_NUMBERS, B_NUMBERS, C_NUMBERS, KEPT, LEFT } from './tut-metric-lib.js';

const name = 'tut-metric-count';
const check = checker(name);

const S_N = 2.1;                           // points per number
const BAR = 7.5;                           // a bar's height
const PAIR = 2;                            // the air between a bar and the one under it
const NAME_GAP = LABEL_GAP + 0.6;          // a name's air above its pair, and a number's beside its bar
const GROUP = 8;                           // the air between a pair and the next pair's name
const OUTLINE = 0.45;                      // the metric's bars' outline
const SAMPLE = 12;                         // the key's samples, points long
const KEY_SKIP = 3.2;                      // between the key's two lines

export default async function () {
	const nums = chapter(check);
	await palette(check);
	const S = new Sheet(name);
	const L = [];
	const x0 = ORIGIN - (SECOND * S_N) / 2;
	const X = (n) => x0 + n * S_N;

	/** The metric's bar: an outline with a faint fill, from 0 to n numbers, the top at y; `tail` numbers at its right
	 * end filled in the curvature's colour instead. */
	const metric = (n, y, what, tail = 0, left = x0) => {
		const r = left + n * S_N, split = r - tail * S_N;
		S.fill(`M${left},${y}H${split}V${y + BAR}H${left}Z`, { l: left, r: split, t: y, b: y + BAR }, { color: TINT, layer: 1, what });
		if (tail) S.fill(`M${split},${y}H${r}V${y + BAR}H${split}Z`, { l: split, r, t: y, b: y + BAR }, { color: CURV, layer: 1, what: `${what}, its coloured end` });
		const h = OUTLINE / 2;
		S.path([[left + h, y + h], [r - h, y + h], [r - h, y + BAR - h], [left + h, y + BAR - h]], { color: INK, width: OUTLINE, closed: true, layer: 2, what: `${what}'s outline` });
		return { l: left, r, t: y, b: y + BAR, split };
	};
	/** What a change of coordinates can set: a solid bar in the observer's colour. */
	const set = (n, y, what, left = x0) => {
		const r = left + n * S_N;
		S.fill(`M${left},${y}H${r}V${y + BAR}H${left}Z`, { l: left, r, t: y, b: y + BAR }, { color: OBS, layer: 1, what });
		return { l: left, r, t: y, b: y + BAR };
	};
	const number = (src, bar, color) => placed(src, bar.r + NAME_GAP, (bar.t + bar.b) / 2, 0, 0.5, color);

	// ---- the key: a short sample of each kind of bar and the row it stands for
	let y = ORIGIN - 80;
	const k1 = metric(SAMPLE / S_N, y, 'the key\'s metric sample');
	const t1 = await placed('\\text{the metric at an event}', k1.r + NAME_GAP, y + BAR / 2, 0, 0.5, INK);
	L.push(t1);
	y = Math.max(k1.b, t1.box.b) + KEY_SKIP;
	const k2 = set(SAMPLE / S_N, y, 'the key\'s change sample');
	const t2 = await placed('\\text{a change of coordinates can set}', k2.r + NAME_GAP, y + BAR / 2, 0, 0.5, INK);
	L.push(t2);
	y = Math.max(k2.b, t2.box.b) + GROUP + 2;

	// ---- the three pairs
	const pairs = [
		{ name: 'values', top: VALUES, below: VALUES, note: `\\text{${VALUES} of ${A_NUMBERS}; ${KEPT} are turns and boosts}` },
		{ name: 'first derivatives', top: FIRST, below: B_NUMBERS },
		{ name: 'second derivatives', top: SECOND, below: C_NUMBERS, tail: LEFT }
	];
	const drawn = [];
	for (const p of pairs) {
		const title = await placed(`\\text{${p.name}}`, x0, y, 0, 0, INK);
		L.push(title);
		const yt = title.box.b + NAME_GAP;
		const a = metric(p.top, yt, `the metric's ${p.name}`, p.tail ?? 0);
		const b = set(p.below, a.b + PAIR, `the change's ${p.name}`);
		L.push(await number(String(p.top), a, INK));
		L.push(await number(p.note ?? String(p.below), b, OBS));
		drawn.push({ p, a, b, title });
		y = b.b + GROUP;
	}

	// ---- to scale: the bars against the counts, aligned at one left end
	for (const { p, a, b } of drawn) {
		check(near(a.r - a.l, p.top * S_N, 1e-9) && near(b.r - b.l, p.below * S_N, 1e-9) && a.l === b.l && a.l === x0, `the bars of ${p.name} are not to scale`);
	}
	check(drawn.map((d) => d.p.top).join() === '10,40,100' && drawn.map((d) => d.p.below).join() === '10,40,80', 'the counts');
	{
		const { a, b } = drawn[2];
		check(near(a.split, b.r, 1e-9) && near(a.r - a.split, 20 * S_N, 1e-9) && LEFT === SECOND - C_NUMBERS, 'the coloured end is not the unmatched 20');
		// its name, centred over the coloured end, between the pair's name and the bar
		const t = drawn[2].title;
		const lab = await placed(`\\text{${LEFT} remain: curvature}`, (a.split + a.r) / 2, a.t - NAME_GAP, 0.5, 1, CURV);
		check(lab.box.l > t.box.r + 2 * LABEL_GAP, 'the curvature\'s name crowds the pair\'s name');
		L.push(lab);
	}
	check(B_NUMBERS === FIRST && VALUES + KEPT === A_NUMBERS, 'the first two pairs are not matched');

	S.checkAll(L);
	window[name + '-numbers'] = { ...nums, scale: S_N };
	return finish(S, L, [200, 300]);
}
