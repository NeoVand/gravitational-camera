// The tutorial, section 12.2 (tutorial/sky/universe.md), its second diagram: the effective number of species counted as
// lengths. One horizontal bar per row of the chapter's table of the hot Standard Model, its length the row's states g on
// one scale for every bar: the bosons solid in a neutral grey; the fermions drawn their full length in matter's colour,
// the first seven eighths solid and the last eighth hatched, with a tick marked 7/8 over the quarks' bar. Each group
// ends in a bar of its count, the rows' counted lengths laid end to end: the bosons' 28 and the fermions' 78.75, with
// g*s = 28 + 78.75 = 106.75 at the foot. Then today's short group on the same scale: the photons' 2, and the neutrinos'
// 6 drawn full length with the hatched eighth, the counted 6 x 7/8 x 4/11 = 1.91 solid and the rest of the seven eighths
// in outline (the caption says why: (T_nu/T_gamma)^3 = 4/11); g*s = 2 + 1.91 = 3.91 at its foot. Each row is named as
// the table names it ("photon" in both groups).
// Departures from the diagram's comment: the fermions' rows carry their arithmetic, "72 x 7/8 = 63", and today's
// neutrinos theirs; each group's sum is a bar of its own, so that the running sums are lengths too; the table stays in
// the chapter, and the figure follows it.
// Exact: every length (asserted against the chapter's table and its 28, 90, 106.75 and 3.91 in tut-universe-lib.js),
// every printed number. Schematic: nothing.
import { Sheet, ORIGIN, finish, checker, placed, near, n2, LABEL_GAP, HAIR } from './tut-pot-lib.js';
import { INK, DIM, PAGE } from '../lib.js';
import { chapter, MATTER, HOT, FERMION, NU_CUBE, BOSONS, FERMIONS, G_HOT, G_TODAY } from './tut-universe-lib.js';

const name = 'tut-universe-gstar';
const check = checker(name);

// ---- the drawing (points) ----------------------------------------------------------------------------------------
const PER = 2.7;                       // points per state
const BAR = 6.2;                       // a bar's height
const PITCH = 11;                    // from a row to the next
const SUM_AIR = 3.2;                   // extra air above a group's sum
const GROUP_AIR = 15;                 // between the hot group's foot and today's title
const NAME_AIR = 5;                    // a name's right end to the bars' start
const NUM_AIR = 3.2;                   // a bar's end to its number
const TITLE_AIR = 3.4;                 // a group's title to its first bar
const SOLID = 0.5, GREY = 0.34;        // the fills' opacities: matter's and the bosons' ink
const HATCH = 0.45, HATCH_STEP = 1.05; // the eighth's hatching: dense and dark enough to show on the neutrinos' 2 pt
const OUTLINE = 0.4;                   // a fermion bar's outline
const SEAM = 0.45;                     // the page's gap between the parts of a sum
const TICK_UP = 2.6;                   // the 7/8 tick above the quarks' bar
const caption = 'Look first at the hatched ends: each fermion state counts seven eighths of a boson\'s. The hot Standard Model counts 106.75; today\'s photons and neutrinos count 3.91. The neutrinos are cooler than the photons: of their seven eighths they keep $(T_\\nu/T_\\gamma)^3 = 4/11$, solid, and the rest is outlined. Every length is a count.';

export default async function () {
	const { state } = await chapter(check);
	state(name, 'universe-gstar', caption);

	const S = new Sheet(name);
	const L = [];
	// the names' column: its right edge is the bars' start less NAME_AIR; measured from the widest name
	const names = await Promise.all(HOT.map((r) => placed(r.name, 0, 0, 1, 0.5, INK)));
	const widest = Math.max(...names.map((l) => l.box.r - l.box.l));
	const x0 = ORIGIN - 140 + widest + NAME_AIR;
	const X = (g) => x0 + g * PER;
	let y = ORIGIN - 120;
	const rows = {};

	/** A bar from g = a to b at the row's middle y: a fill of the colour at the opacity. */
	const block = (a, b, yc, color, opacity, what) => {
		S.raw(`<rect x="${n2(X(a))}" y="${n2(yc - BAR / 2)}" width="${n2((b - a) * PER)}" height="${BAR}" fill="${color}" fill-opacity="${opacity}"/>`, 1);
		S.boxes.push({ box: { l: X(a), r: X(b), t: yc - BAR / 2, b: yc + BAR / 2 }, what });
	};
	/** The outline of a fermion's full bar, from 0 to g. */
	const outline = (g, yc, what) => {
		S.raw(`<rect x="${n2(X(0) + OUTLINE / 2)}" y="${n2(yc - BAR / 2 + OUTLINE / 2)}" width="${n2(g * PER - OUTLINE)}" height="${n2(BAR - OUTLINE)}" fill="none" stroke="${MATTER}" stroke-width="${OUTLINE}"/>`, 2);
		S.boxes.push({ box: { l: X(0), r: X(g), t: yc - BAR / 2, b: yc + BAR / 2 }, what });
	};
	/** Hatching between g = a and b: lines at 45 degrees, rising to the right, clipped to the bar inside its outline. */
	const hatch = (a, b, yc, what) => {
		const l = X(a), r = X(b) - OUTLINE, t = yc - BAR / 2 + OUTLINE, bt = yc + BAR / 2 - OUTLINE;
		const segs = [];
		// the line x - (bt - y) = c for each c, from where it enters the box to where it leaves
		for (let c = l - (bt - t) + HATCH_STEP / 2; c < r; c += HATCH_STEP) {
			const ya = Math.min(bt, bt - (l - c)), xa = Math.max(l, c);
			const yb = Math.max(t, bt - (r - c)), xb = Math.min(r, c + (bt - t));
			if (xb - xa > 0.05) segs.push(`M${n2(xa)},${n2(ya)}L${n2(xb)},${n2(yb)}`);
		}
		S.raw(`<path d="${segs.join('')}" stroke="${MATTER}" stroke-width="${HATCH}" fill="none" stroke-linecap="butt"/>`, 1.5);
		check(segs.length >= 1, `${what}: no hatching`);
	};
	/** The page's seam at g = s across the row's bar. */
	const seam = (s, yc) => S.raw(`<path d="M${n2(X(s))},${n2(yc - BAR / 2 - 0.1)}V${n2(yc + BAR / 2 + 0.1)}" stroke="${PAGE}" stroke-width="${SEAM}"/>`, 2.5);
	const number = async (src, g, yc) => { const l = await placed(src, X(g) + NUM_AIR, yc, 0, 0.5, INK); L.push(l); return l; };
	const nameOf = async (src, yc, color = INK) => { const l = await placed(src, x0 - NAME_AIR, yc, 1, 0.5, color); L.push(l); return l; };
	const title = async (src) => { const l = await placed(src, x0, y - BAR / 2 - TITLE_AIR, 0, 1, DIM); L.push(l); return l; };

	// ---- the hot Standard Model
	await title('\\text{above }2\\times10^{15}\\,\\mathrm{K}\\text{: every particle}');
	for (const r of HOT.filter((q) => q.kind === 'boson')) {
		block(0, r.g, y, INK, GREY, `the bar of ${r.key}`);
		await nameOf(r.name, y);
		await number(String(r.g), r.g, y);
		rows[r.key] = y;
		y += PITCH;
	}
	// the bosons' sum: their bars end to end
	y += SUM_AIR;
	{
		let at = 0;
		for (const r of HOT.filter((q) => q.kind === 'boson')) { at += r.g; if (at < BOSONS) seam(at, y); }
		block(0, BOSONS, y, INK, GREY, 'the bosons\' sum');
		check(at === 28, 'the bosons\' sum');
		await nameOf('\\text{bosons}', y);
		await number(String(BOSONS), BOSONS, y);
		rows.bosons = y;
	}
	y += PITCH + SUM_AIR;
	for (const r of HOT.filter((q) => q.kind === 'fermion')) {
		const k = FERMION * r.g;
		block(0, k, y, MATTER, SOLID, `the bar of ${r.key}`);
		outline(r.g, y, `the outline of ${r.key}`);
		hatch(k, r.g, y, `the eighth of ${r.key}`);
		await nameOf(r.name, y);
		await number(`${r.g}\\times7/8 = ${+k.toFixed(2)}`, r.g, y);
		rows[r.key] = y;
		y += PITCH;
	}
	// the tick marked 7/8 over the quarks' bar
	{
		const q = HOT.find((r) => r.key === 'quarks'), x = X(FERMION * q.g), top = rows.quarks - BAR / 2;
		S.path([[x, top], [x, top - TICK_UP]], { color: MATTER, width: HAIR, cap: 'butt', layer: 2, what: 'the tick at 7/8' });
		L.push(await placed('7/8', x, top - TICK_UP - LABEL_GAP - 0.2, 0.5, 1, MATTER));
	}
	y += SUM_AIR;
	{
		let at = 0;
		for (const r of HOT.filter((q) => q.kind === 'fermion')) { at += FERMION * r.g; if (at < FERMION * FERMIONS - 1e-9) seam(at, y); }
		block(0, FERMION * FERMIONS, y, MATTER, SOLID, 'the fermions\' sum');
		check(near(at, 78.75), 'the fermions\' sum');
		await nameOf('\\text{fermions}', y);
		await number('78.75', FERMION * FERMIONS, y);
		rows.fermions = y;
	}
	// the foot
	y += BAR / 2 + 4.2;
	L.push(await placed(`g_{*s} = ${BOSONS} + 78.75 = ${G_HOT}`, x0, y, 0, 0, INK));
	check(G_HOT === 106.75 && near(FERMION * FERMIONS, 78.75), 'the foot');
	y = L.at(-1).box.b + GROUP_AIR + 8;

	// ---- today
	await title('\\text{today}');
	block(0, 2, y, INK, GREY, 'today\'s photons');
	await nameOf('\\text{photon}', y);
	await number('2', 2, y);
	rows.photonsToday = y;
	y += PITCH;
	{
		const k = FERMION * 6 * NU_CUBE;
		block(0, k, y, MATTER, SOLID, 'today\'s neutrinos');
		outline(6, y, 'today\'s neutrinos\' outline');
		hatch(FERMION * 6, 6, y, 'today\'s neutrinos\' eighth');
		await nameOf('\\text{neutrinos}', y);
		await number('6\\times7/8\\times4/11 = 1.91', 6, y);
		check(k.toFixed(2) === '1.91', `today's neutrinos ${k}`);
		rows.neutrinosToday = y;
	}
	y += BAR / 2 + 4.2;
	L.push(await placed('g_{*s} = 2 + 1.91 = 3.91', x0, y, 0, 0, INK));
	check(near(G_TODAY, 2 + FERMION * 6 * NU_CUBE, 1e-14) && G_TODAY.toFixed(2) === '3.91', 'today\'s foot');

	S.checkAll(L);
	window[name + '-numbers'] = { rows, PER, x0 };
	return finish(S, L, [280, 345]);
}
