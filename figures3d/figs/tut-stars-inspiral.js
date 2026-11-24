// The tutorial, chapter 12.1 (tutorial/sky/stars.md), its fourth diagram: the time to merger. Separation d (km,
// logarithmic, 10 to 10^6) against the time left tau (s, logarithmic, 10^-3 to 10^14), from eq:inspiral,
// d = (256 G^3 m1 m2 M tau / 5 c^5)^{1/4}: a solid line for two black holes of 30 solar masses, with a dot at the paper's
// 2200 km and 8.8 s, and a dashed line for two white dwarfs of 0.6, with a dot at chapter 1.8's pair turning every ten
// minutes, 113,000 km apart with 244,000 years (7.7 x 10^12 s) left; both of slope 1/4. Each line is grey where the
// formula is out of its range: the black holes' below 3 (r_s1 + r_s2) = 532 km, the interactive figure's lower end; the
// white dwarfs' below 20,800 km, where two dwarfs of the chapter's 10,400 km touch. At the black holes' dot, a thin
// upright line from their 2200 km to their reduced wavelength lambda/2 pi = 5500 km, "near zone ends".
// The lines and the dots in ink: the time left is neutral in the chapter's equations.
// Departures from the diagram's comment: the reduced wavelength is drawn at the paper's pair, as a distance from it
// beside its separation (2.5 times it, as the chapter says), not as a tick on the line at a separation of 5500 km,
// where the pair would have another wavelength; the white dwarfs' line is grey below their contact, as the black
// holes' is below its cut-off, so the caption speaks of the grey ends.
// Exact: both lines and the dots (tut-stars-lib.js: 8.8 s, 113,000 km, 244,000 years and 7.7 x 10^12 s, 5500 km and
// 532 km asserted against the chapter and the interactive's checks); the slope 1/4 (asserted in points); the contact,
// twice the white dwarf's radius from the polytrope. Schematic: nothing.
import { Sheet, ORIGIN, finish, checker, placed, near, n2, LABEL_GAP, HAIR } from './tut-pot-lib.js';
import { Plot, xAxis, yAxis } from './tut-prob-lib.js';
import { DASH, DOT } from './tut-bessel-lib.js';
import { INK, DIM, FAINT } from '../lib.js';
import { dashed } from './tut-orb-lib.js';
import { chapter, M_SUN, YEAR, tau, sepAt, HOLES, DWARFS, dwarfSep, reduced, cutoff, wdRadius } from './tut-stars-lib.js';

const name = 'tut-stars-inspiral';
const check = checker(name);

// ---- the drawing (points) ----------------------------------------------------------------------------------------
const W = 272, H = 150;
const X0 = -3, X1 = 14, Y0 = 1, Y1 = 6;          // log10 s, log10 km
const MAIN = 0.75, THIN = 0.45;
const END = 2.2;                                 // half the near zone's end tick
const NEAR_REACH = 18;                           // how far right of it the words "near zone ends" reach
const NAME = 7;
const LEADING = 2.6;                             // between two lines of one label
const caption = 'Look first at the dot at 2200 km: the paper\'s pair has 8.8 seconds left, and each halving of the separation cuts the time sixteen times. The white-dwarf pair on the dashed line has 244,000 years. Lines from the quadrupole formula, exact for Newton\'s orbit; the grey ends are outside its range.';

export default async function () {
	const { state } = await chapter(check);
	state(name, 'stars-inspiral', caption);

	const S = new Sheet(name);
	const L = [];
	const P = new Plot({ left: ORIGIN - W / 2, top: ORIGIN - H / 2, w: W, h: H, x0: X0, x1: X1, y0: Y0, y1: Y1 });
	/** The page point of tau (s) and d (km). */
	const at = (t, km) => P.at(Math.log10(t), Math.log10(km));

	// ---- the axes
	{
		const decades = Array.from({ length: X1 - X0 + 1 }, (_, i) => X0 + i);
		const xl = await xAxis(S, P, { ticks: decades, fmt: (t) => (t % 3 === 0 && t >= 0 ? (t === 0 ? '1' : `10^{${t}}`) : null), what: 'the time axis' });
		L.push(...xl);
		L.push(await placed('\\text{time to merger }\\tau\\text{ (s)}', P.X((X0 + X1) / 2), Math.max(...xl.map((l) => l.box.b)) + 4, 0.5, 0, DIM));
		const yl = await yAxis(S, P, { ticks: [1, 2, 3, 4, 5, 6], fmt: (t) => (t <= 3 ? String(10 ** t) : `10^{${t}}`), what: 'the separation axis' });
		L.push(...yl);
		L.push(await placed('\\text{separation }d\\text{ (km)}', Math.min(...yl.map((l) => l.box.l)), P.top - NAME, 0, 1, DIM));
	}

	/** A pair's line, d against tau, from the panel's left or bottom edge to its right or top edge, split at the
	 * separation `from` (km), below which it is grey. */
	const line = (m, from, dash, what) => {
		const lo = Math.max(10 ** X0, tau(10 ** Y0 * 1e3, m, m)), hi = Math.min(10 ** X1, tau(10 ** Y1 * 1e3, m, m));
		const split = tau(from * 1e3, m, m);
		check(split > lo && split < hi, `${what}: the grey end is not in the panel`);
		const a = at(lo, sepAt(lo, m, m) / 1e3), s = at(split, from), b = at(hi, sepAt(hi, m, m) / 1e3);
		// straight in log-log: slope 1/4 in data, so (H / 5) / (W / 17) / 4 on the page
		const slope = (y0, y1, x0, x1) => -(y1 - y0) / (x1 - x0);
		check(near(slope(a[1], b[1], a[0], b[0]), (H / (Y1 - Y0)) / (W / (X1 - X0)) / 4, 1e-9), `${what}: the slope is not 1/4`);
		const clash = () => false;
		if (dash) {
			dashed(S, a, s, { color: FAINT, width: MAIN, dash: DASH, clash, layer: 3, what: `${what}, grey` });
			dashed(S, s, b, { color: INK, width: MAIN, dash: DASH, clash, layer: 3, what });
		} else {
			S.path([a, s], { color: FAINT, width: MAIN, layer: 3, cap: 'butt', what: `${what}, grey` });
			S.path([s, b], { color: INK, width: MAIN, layer: 3, cap: 'butt', what });
		}
		return { a, s, b };
	};

	// ---- the black holes
	const tb = tau(HOLES.d, HOLES.m, HOLES.m);
	check(tb.toFixed(1) === '8.8' && Math.round(cutoff() / 1e3) === 532, 'the black holes');
	const holes = line(HOLES.m, cutoff() / 1e3, false, 'the black holes\' line');
	// ---- the white dwarfs: grey below contact, twice the radius of a white dwarf of 0.6 solar masses
	const contact = (2 * wdRadius(DWARFS.m)) / 1e3;
	check(Math.round(contact / 100) * 100 === 20800, `the white dwarfs touch at ${contact} km`);
	const dwarfs = line(DWARFS.m, contact, true, 'the white dwarfs\' line');

	// ---- the dots
	const dHole = at(tb, HOLES.d / 1e3);
	const dw = dwarfSep(), tw = tau(dw, DWARFS.m, DWARFS.m);
	check(Math.round(dw / 1e6) === 113 && Math.round(tw / YEAR / 1000) === 244 && tw.toExponential(1) === '7.7e+12', 'the white dwarfs\' dot');
	const dDwarf = at(tw, dw / 1e3);
	for (const [p, what] of [[dHole, 'the black holes\' dot'], [dDwarf, 'the white dwarfs\' dot']]) {
		S.raw(`<circle cx="${n2(p[0])}" cy="${n2(p[1])}" r="${DOT}" fill="${INK}"/>`, 4);
		S.mark([p], DOT, what);
	}

	// ---- the near zone of the paper's pair: from its 2200 km up to lambda/2 pi
	const lam = reduced() / 1e3;
	check(Math.round(lam / 100) * 100 === 5500, `lambda / 2 pi = ${lam}`);
	const top = at(tb, lam);
	const foot = [dHole[0], dHole[1] - DOT - 0.9];
	S.path([foot, top], { color: INK, width: THIN, layer: 3, cap: 'butt', what: 'the near zone' });
	S.path([[top[0] - END, top[1]], [top[0] + END, top[1]]], { color: INK, width: THIN, layer: 3, cap: 'butt', what: 'the near zone\'s end' });
	const lamLabel = await S.clear('\\lambda/2\\pi', top[0] - END - LABEL_GAP - 0.4, top[1], 1, 0.5, [-1, 0], { color: INK });
	L.push(lamLabel);
	L.push(await S.clear('\\text{near zone ends}', top[0] + NEAR_REACH, lamLabel.box.t - LABEL_GAP - 0.3, 1, 1, [0, -1], { color: INK }));

	// ---- the labels
	L.push(await S.clear('2200\\text{ km}, 8.8\\text{ s}', dHole[0] + LABEL_GAP + 1.4, dHole[1] + 1.2, 0, 0, [0.3, 1], { color: INK }));
	{
		// the white dwarfs' numbers in two lines below and right of their dot, under their line (there is no room
		// between the two lines of pairs)
		const km = await placed('113{,}000\\text{ km,}', dDwarf[0] + LABEL_GAP + 0.8, dDwarf[1] + LABEL_GAP + 0.8, 0, 0, INK);
		const years = await placed('244{,}000\\text{ years}', km.box.l, km.box.b + LEADING, 0, 0, INK);
		L.push(km, years);
	}
	{
		// the lines' names, beside their black parts
		const ph = at(1e7, sepAt(1e7, HOLES.m, HOLES.m) / 1e3);
		L.push(await S.clear('30 + 30\\,M_\\odot', ph[0], ph[1] - LABEL_GAP, 0.5, 1, [-0.24, -1], { color: INK }));
		const pd = at(3e11, sepAt(3e11, DWARFS.m, DWARFS.m) / 1e3);
		L.push(await S.clear('0.6 + 0.6\\,M_\\odot', pd[0], pd[1] + LABEL_GAP, 0.5, 0, [0.24, 1], { color: INK }));
	}
	window[name + '-numbers'] = { tb, tw, years: tw / YEAR, dw, lam, cut: cutoff(), contact, tContact: tau(contact * 1e3, DWARFS.m, DWARFS.m) };
	void holes; void dwarfs; void HAIR; void M_SUN;

	S.checkAll(L);
	return finish(S, L, [280, 360]);
}
