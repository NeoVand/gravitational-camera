// The tutorial, chapter 11.3 (tutorial/black-holes/hawking.md), its first diagram: the Hawking temperature along the
// masses of holes. One panel: two logarithmic axes, one above the other, which are one scale read two ways, since
// k_B T_H = hbar c^3 / 8 pi G M: below, the hole's mass from 10^11 kg to 10^10 solar masses (2 x 10^40 kg), ticked at
// every decade and numbered at every fourth, named "hole mass M (kg)"; above, its Hawking temperature, ticked at every
// decade and numbered at every fourth power of ten from 10^12 to 10^-16 K, each tick at the mass whose temperature it is,
// named "Hawking temperature T_H (K)", the axis running from 1.2 x 10^12 K over the lightest hole to 6.2 x 10^-18 K over
// the heaviest. Between the axes, three bands shaded lightly: left of 4.50 x 10^22 kg, "hotter than the microwave sky
// (2.7255 K): glows in light and gravitons"; from there to 1.356 x 10^23 kg, "between the two skies: glows in
// gravitons, dark in light"; right of it, "colder than both: a shadow". Short marks in matter's colour on the mass axis
// for the Moon, the Earth, the Sun and Sgr A* (4 x 10^6 solar masses), each named, and a taller one at 1.356 x 10^23 kg,
// "M_eq, 0.905 K".
// Departures from the diagram's comment: the middle band, half a decade wide (5 points), is shaded a little darker
// than the other two so that it shows, and its name stands in the right band's upper corner, joined to it by a
// hairline; the names of the left band stand on three lines; the marks of the bodies rise from the mass axis into the
// bands and are named beside them; the temperature's ticks stand at their own masses, a ninth of a decade from the
// mass's (k_B T_H is 1.227 x 10^23 kg K over M), so that 1 K is over 1.23 x 10^23 kg.
// Exact: both axes and every tick (asserted against the chapter's T_H in tut-hawking-lib.js), the bands' edges at the
// masses of the two skies, the marks of M_eq and of the four bodies. Schematic: nothing.
import { Sheet, ORIGIN, finish, checker, placed, LABEL_GAP, HAIR, TICK, AXIS, n2 } from './tut-pot-lib.js';
import { stack } from './tut-curvature-lib.js';
import { INK, DIM } from '../lib.js';
import { chapter, palette, near, MATTER, hawking, massAt, M_EQ, M_CMB, BODIES, LADDER, MASS_KELVIN } from './tut-hawking-lib.js';

const name = 'tut-hawking-ladder';
const check = checker(name);

// ---- the drawing (points) ----------------------------------------------------------------------------------------
const AX = 316;                                  // the axes' length
const STRIP = 62;                                // from the temperature's axis down to the mass's
const MINOR = 1.5;                               // a decade's tick; a numbered one is TICK long
const NUM = 2.4;                                 // from a tick's end to its number
const NAME = 3.6;                                // from the numbers to the axis's name
const TINT = '#eeebe5';                          // the outer bands (drawing.ts, THEME: a neutral tint of the page)
const MID = 'color-mix(in srgb, #1c1a16 22%, #fffffe)';   // the middle band: ink mixed into the page, swapped with it
const BODY = 6, EQ = 24;                         // the marks' heights: a body's and M_eq's
const MARK = 0.6, EQ_LINE = 0.7;                 // their strokes
const INSET = 5;                                 // a band's name from the band's edge
const caption = 'Look first at the mark $\\matter M_{\\rm eq}$: a hole of that mass is as warm as the graviton sky. Lighter holes glow against it, heavier ones are dark. The axes are exact; the bands are bounded by the two skies\' temperatures.';

export default async function () {
	const { state } = await chapter(check);
	await palette(check);
	state(name, 'hawking-ladder', caption);

	const S = new Sheet(name);
	const L = [];
	const [m0, m1] = LADDER.map(Math.log10);
	const left = ORIGIN - AX / 2, right = ORIGIN + AX / 2;
	const X = (M) => left + ((Math.log10(M) - m0) / (m1 - m0)) * AX;
	const yT = ORIGIN - STRIP / 2, yM = ORIGIN + STRIP / 2;
	check(near(X(LADDER[0]), left, 1e-9) && near(X(LADDER[1]), right, 1e-9), 'the axes\' ends');

	// ---- the bands, under everything
	const xc = X(M_CMB), xe = X(M_EQ);
	S.raw(`<rect x="${n2(left)}" y="${n2(yT)}" width="${n2(xc - left)}" height="${n2(STRIP)}" fill="${TINT}"/>`, 0.4);
	S.raw(`<rect x="${n2(xc)}" y="${n2(yT)}" width="${n2(xe - xc)}" height="${n2(STRIP)}" fill="${MID}"/>`, 0.4);
	S.raw(`<rect x="${n2(xe)}" y="${n2(yT)}" width="${n2(right - xe)}" height="${n2(STRIP)}" fill="${TINT}"/>`, 0.4);
	check((xe - xc).toFixed(1) === '5.2', `the middle band is ${xe - xc} pt wide`);

	// ---- the mass's axis, below
	S.path([[left, yM], [right, yM]], { color: DIM, width: AXIS, cap: 'butt', layer: 1, what: 'the mass\'s axis' });
	const massNums = [];
	for (let k = Math.ceil(m0); k <= Math.floor(m1); k++) {
		const x = X(10 ** k), major = k % 4 === 0;
		S.path([[x, yM], [x, yM + (major ? TICK : MINOR)]], { color: DIM, width: HAIR, cap: 'butt', layer: 1, what: `the mass's tick at 10^${k}` });
		if (major) massNums.push(await placed(`10^{${k}}`, x, yM + TICK + NUM, 0.5, 0, DIM));
	}
	L.push(...massNums);
	check(massNums.map((l) => l.src).join() === '10^{12},10^{16},10^{20},10^{24},10^{28},10^{32},10^{36},10^{40}', 'the mass\'s numbers');
	const massName = await placed('\\text{hole mass}\\ M\\ (\\mathrm{kg})', ORIGIN, Math.max(...massNums.map((l) => l.box.b)) + NAME, 0.5, 0, DIM);
	L.push(massName);

	// ---- the temperature's axis, above: the tick of T kelvin at the mass whose temperature is T
	S.path([[left, yT], [right, yT]], { color: DIM, width: AXIS, cap: 'butt', layer: 1, what: 'the temperature\'s axis' });
	const tempNums = [];
	const [t0, t1] = LADDER.map((M) => Math.log10(hawking(M)));
	for (let k = Math.floor(t0); k >= Math.ceil(t1); k--) {
		const x = X(massAt(10 ** k)), major = k % 4 === 0;
		check(near(Math.log10(hawking(massAt(10 ** k))), k, 1e-12), `the temperature's tick at 10^${k}`);
		S.path([[x, yT], [x, yT - (major ? TICK : MINOR)]], { color: DIM, width: HAIR, cap: 'butt', layer: 1, what: `the temperature's tick at 10^${k}` });
		if (major) tempNums.push(await placed(k === 0 ? '1' : `10^{${k}}`, x, yT - TICK - NUM, 0.5, 1, DIM));
	}
	L.push(...tempNums);
	check(tempNums.map((l) => l.src).join() === '10^{12},10^{8},10^{4},1,10^{-4},10^{-8},10^{-12},10^{-16}', 'the temperature\'s numbers');
	check(t0.toFixed(2) === '12.09' && hawking(LADDER[0]).toExponential(1) === '1.2e+12' && hawking(LADDER[1]).toExponential(1) === '6.2e-18', 'the temperature\'s ends');
	check((Math.log10(MASS_KELVIN) - 23).toFixed(3) === '0.089', 'the temperature\'s ticks are not a ninth of a decade from the mass\'s');
	const tempName = await placed('\\text{Hawking temperature}\\ T_H\\ (\\mathrm{K})', ORIGIN, Math.min(...tempNums.map((l) => l.box.t)) - NAME, 0.5, 1, DIM);
	L.push(tempName);

	// ---- the marks on the mass's axis: M_eq, and the four bodies
	S.path([[xe, yM], [xe, yM - EQ]], { color: MATTER, width: EQ_LINE, cap: 'butt', layer: 2, what: 'the mark of M_eq' });
	L.push(await placed('M_{\\rm eq}\\text{, }0.905\\,\\mathrm{K}', xe + EQ_LINE / 2 + LABEL_GAP + 0.2, yM - EQ, 0, 0, INK));
	const at = {};
	for (const b of BODIES) {
		const x = X(b.M);
		at[b.key] = x;
		S.path([[x, yM], [x, yM - BODY]], { color: MATTER, width: MARK, cap: 'butt', layer: 2, what: `the mark of ${b.key}` });
		// the Moon's name to the left of its mark, the others' to the right, all on one baseline row
		const lft = b.key === 'moon';
		L.push(await placed(b.name, x + (lft ? -1 : 1) * (MARK / 2 + LABEL_GAP + 0.2), yM - AXIS / 2 - LABEL_GAP - 0.15, lft ? 1 : 0, 1, INK));
	}
	check(at.moon > xc && at.moon < xe && at.earth > xe, 'the Moon is not between the skies');

	// ---- the bands' names
	const top = yT + INSET;
	const hot = await stack(['\\text{hotter than the microwave sky}', '\\text{(2.7255 K): glows in light}', '\\text{and gravitons}'], left + INSET, top, 0, INK);
	hot.on = [];
	L.push(hot);
	check(hot.box.r < xc - 4, 'the hot band\'s name leaves its band');
	const mid = await stack(['\\text{between the two skies:}', '\\text{glows in gravitons, dark in light}'], xe + 14, top, 0, INK);
	L.push(mid);
	// its hairline, from the middle of the middle band to the name's first line
	const yl = top + 3.1;
	S.path([[(xc + xe) / 2, yl], [mid.box.l - LABEL_GAP - 0.4, yl]], { color: INK, width: HAIR, cap: 'round', layer: 3, what: 'the middle band\'s hairline' });
	S.raw(`<circle cx="${n2((xc + xe) / 2)}" cy="${n2(yl)}" r="0.75" fill="${INK}"/>`, 3);
	const cold = await placed('\\text{colder than both: a shadow}', right - INSET, (yT + yM) / 2 + 3, 1, 0.5, INK);
	L.push(cold);
	check(cold.box.l > mid.box.l && cold.box.t > mid.box.b + LABEL_GAP, 'the cold band\'s name');

	S.checkAll(L);
	window[name + '-numbers'] = { M_EQ, M_CMB, bodies: BODIES.map((b) => [b.key, b.M, hawking(b.M)]), band: xe - xc };
	return finish(S, L, [300, 345]);
}
