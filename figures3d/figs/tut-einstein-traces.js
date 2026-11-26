// The tutorial, section 7.3 (tutorial/geometry/einstein-equation.md), its first diagram: the trace of the tide for
// six kinds of matter, a bar each on a logarithmic axis of |tr E| from 10^-36 to 10^-5 s^-2, in the comment's order:
// the Earth's mean density, water, the Casimir gap of 1 micrometre, the dark matter round the Sun, sunlight at the
// Earth and the cosmological constant. Positive traces solid, in matter's colour (sunlight in the light role's); the
// two negative ones outlined and thinly hatched in matter's colour, their values printed with the minus sign, and a
// small legend "outlined: negative trace (a ball of dust swells)". A thin dotted line at the person's stretch a metre
// away, 9.3 x 10^-9 s^-2, named at its top. Each bar's value to two figures right of its end, never on a bar.
// Departures from the diagram's comment: each bar's name stands above its bar at every width, not left of it, so that
// one drawing about 280 points wide keeps its text readable on a phone and gives the thirty-one decades the whole
// width. The cosmological constant's value is printed -9.9 x 10^-36, not -1.0 x 10^-35: with the chapter's
// Lambda = 1.1 x 10^-52 m^-2, Lambda c^2 = 9.89 x 10^-36 s^-2, which is 9.9 x 10^-36 to two figures (the paper's
// "-1 x 10^-35" is the same number to one figure). The dotted line's name stands level with the first bar's name,
// right of it, so that the line ends just above the first bar.
// Exact: every bar's length, log10 |tr E| on the axis, from tr E = 4 pi G (rho + sum p / c^2) - Lambda c^2 for its
// matter (tut-einstein-lib.js, each asserted against the chapter's printed value); the dotted line at 2 G M / r^3 for
// 70 kg at 1 m; the axis's ticks, one a decade. Nothing is schematic.
import { Sheet, ORIGIN, finish, checker, placed, near, LABEL_GAP, AXIS, HAIR, TICK } from './tut-pot-lib.js';
import { INK, DIM } from '../lib.js';
import { chapter, palette, bars, twoFigures, STRETCH, MATTER, LIGHT } from './tut-einstein-lib.js';

const name = 'tut-einstein-traces';
const check = checker(name);

const LO = -36, HI = -5;                   // the axis's decades
const PER = 7.4;                           // points per decade
const BAR_H = 6.6;                         // a bar's height
const NAME_AIR = LABEL_GAP + 0.7;          // from a bar's name to its bar
const ROW_AIR = 5.2;                       // from a bar to the next bar's name
const OUTLINE = 0.5;                       // a negative bar's outline
const HATCH = 1.9, HATCH_W = 0.3;          // its hatching: the spacing along the bar and the stroke
const MINOR = 1.6;                         // a decade's tick, down from the axis
const AXIS_AIR = 6;                        // from the last bar to the axis
const SWATCH = [13, BAR_H];                // the legend's bar

export default async function () {
	const nums = chapter(check);
	await palette(check);
	const S = new Sheet(name);
	const L = [];
	const x0 = ORIGIN - 140;
	const X = (lg) => x0 + (lg - LO) * PER;
	const colour = { matter: MATTER, light: LIGHT };

	/** A bar outlined and hatched, the outline inside the box (l, t, w, h). */
	const hatched = (l, t, w, h, color, what) => {
		const o = OUTLINE / 2;
		S.path([[l + o, t + o], [l + w - o, t + o], [l + w - o, t + h - o], [l + o, t + h - o]], { color, width: OUTLINE, closed: true, layer: 2, what });
		const il = l + OUTLINE, ir = l + w - OUTLINE, it = t + OUTLINE, ib = t + h - OUTLINE, ih = ib - it;
		const seg = [];
		for (let s = il - ih + HATCH / 2; s < ir; s += HATCH) {
			const u0 = Math.max(0, il - s), u1 = Math.min(ih, ir - s);
			if (u1 - u0 > 0.3) seg.push(`M${(s + u0).toFixed(2)},${(ib - u0).toFixed(2)}L${(s + u1).toFixed(2)},${(ib - u1).toFixed(2)}`);
		}
		S.raw(`<path d="${seg.join('')}" stroke="${color}" stroke-width="${HATCH_W}" stroke-linecap="butt" fill="none"/>`, 2);
		S.boxes.push({ box: { l, r: l + w, t, b: t + h }, what });
		return seg.length;
	};

	// ---- the rows: a name above each bar, the bar from 10^-36 to |tr E|, the value right of its end
	const B = bars();
	check(B.map((b) => b.key).join() === 'earth,water,casimir,dark,sun,lambda', 'the bars are not in the comment\'s order');
	// every name carries a strut, so that the names share a baseline height above their bars
	const strut = (src) => `\\vphantom{(}${src}`;
	const H = Math.max(...(await Promise.all(B.map((b) => placed(strut(b.name), 0, 0, 0, 0, INK)))).map((p) => p.box.b - p.box.t));
	const PITCH = H + NAME_AIR + BAR_H + ROW_AIR;
	const rows = [];
	for (const [i, b] of B.entries()) {
		const top = ORIGIN - 90 + i * PITCH;
		const nameLab = await placed(strut(b.name), x0, top - NAME_AIR, 0, 1, INK);
		L.push(nameLab);
		const lg = Math.log10(Math.abs(b.tr)), end = X(lg);
		check(lg > LO && lg < HI, `the ${b.key} bar is off the axis`);
		const what = `the ${b.key} bar`;
		if (b.tr > 0) S.fill(`M${x0.toFixed(2)},${top.toFixed(2)}H${end.toFixed(2)}V${(top + BAR_H).toFixed(2)}H${x0.toFixed(2)}Z`, { l: x0, r: end, t: top, b: top + BAR_H }, { color: colour[b.role], layer: 2, what });
		else check(hatched(x0, top, end - x0, BAR_H, colour[b.role], what) >= 3, `the ${b.key} bar has too few hatches`);
		check(near(end - x0, (lg - LO) * PER, 1e-9), `the ${b.key} bar's length`);
		check(twoFigures(b.tr) === b.printed, `the ${b.key} bar's value`);
		const value = await placed(b.printed, end + LABEL_GAP + 0.6, top + BAR_H / 2, 0, 0.5, INK);
		L.push(value);
		rows.push({ b, top, end, nameLab, value });
	}
	check(rows.filter((r) => r.b.tr < 0).map((r) => r.b.key).join() === 'casimir,lambda', 'the outlined bars are not the two negative traces');

	// ---- the axis: a line from 10^-36 to 10^-5, a tick each decade, longer and named each fifth
	const yA = rows[rows.length - 1].top + BAR_H + AXIS_AIR;
	S.path([[X(LO), yA], [X(HI), yA]], { color: INK, width: AXIS, cap: 'butt', what: 'the axis' });
	let ticks = 0, bottom = yA;
	for (let d = LO; d <= HI; d++) {
		const major = d % 5 === 0;
		S.path([[X(d), yA], [X(d), yA + (major ? TICK : MINOR)]], { color: INK, width: HAIR, cap: 'butt', what: `the tick at 10^${d}` });
		ticks++;
		if (major) {
			const lab = await placed(`10^{${d}}`, X(d), yA + TICK + LABEL_GAP + 0.2, 0.5, 0, INK);
			L.push(lab);
			bottom = Math.max(bottom, lab.box.b);
		}
	}
	check(ticks === HI - LO + 1 && near(X(HI) - X(LO), 31 * PER, 1e-9), `${ticks} ticks`);
	const axisName = await placed('|\\mathrm{tr}\\,\\mathcal{E}|\\text{ in }\\mathrm{s^{-2}}\\text{, logarithmic}', (X(LO) + X(HI)) / 2, bottom + 3.6, 0.5, 0, INK);
	L.push(axisName);

	// ---- the person's stretch: a dotted line from the axis to just above the first bar, named at its top
	{
		const xs = X(Math.log10(STRETCH));
		check(near(STRETCH, 9.344e-9, 1e-11), `the person's stretch ${STRETCH}`);
		const yTop = rows[0].top - 3.2;
		S.dots([xs, yA - AXIS / 2 - 0.9], [xs, yTop], { color: DIM, layer: 1, what: 'the person\'s stretch' });
		const lab = await placed('\\text{the person\'s stretch at 1 m}', xs, yTop - LABEL_GAP - 0.5, 0.5, 1, DIM);
		L.push(lab);
		check(lab.box.l > rows[0].nameLab.box.r + 3 * LABEL_GAP, 'the stretch\'s name crowds the first bar\'s');
		// it passes through the Earth's and water's bars, and right of every other bar's end and value
		for (const r of rows) {
			if (r.b.key === 'earth' || r.b.key === 'water') check(r.end > xs + 4 && r.value.box.l > xs + 4, `the dotted line does not pass under the ${r.b.key} bar`);
			else check(r.value.box.r < xs - 4, `the ${r.b.key} bar's value reaches the dotted line`);
		}
	}

	// ---- the legend: an outlined, hatched bar and its words
	{
		const words = await placed('\\text{outlined: negative trace (a ball of dust swells)}', 0, 0, 0, 0.5, INK);
		const w = SWATCH[0] + LABEL_GAP + 1.4 + (words.box.r - words.box.l);
		const l = (X(LO) + X(HI)) / 2 - w / 2, t = axisName.box.b + 5;
		hatched(l, t, SWATCH[0], SWATCH[1], MATTER, 'the legend\'s bar');
		L.push(await placed('\\text{outlined: negative trace (a ball of dust swells)}', l + SWATCH[0] + LABEL_GAP + 1.4, t + SWATCH[1] / 2, 0, 0.5, INK));
	}

	S.checkAll(L);
	window[name + '-numbers'] = nums;
	return finish(S, L, [250, 300]);
}
