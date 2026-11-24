// The tutorial, chapter 10.2 (tutorial/glow/kirchhoff.md), its first diagram: the three processes that join the matter's
// two levels to a mode's ladder. Three columns, one per process, each with the matter's two levels, l below and u above,
// at the left, and three rungs of the mode's ladder, n_omega - 1, n_omega and n_omega + 1, at the right, all on one
// scale of energy, the levels hbar omega apart like the rungs. Absorption: up on the matter, down on the ladder, solid.
// Stimulated emission: down on the matter, up on the ladder, solid. Spontaneous emission: the same pair, dashed. Under
// each column its name and its rate, "proportional to P_l n_omega", "P_u n_omega" and "P_u"; under the first two a
// bracket, "net absorption alpha proportional to P_l - P_u", and under the third, "j_omega proportional to P_u". Ink and
// the page's greys only: no orange or blue, as the chapter gives P_l, P_u and n_omega no colour.
// The labels of one row stand on one baseline, and a label beside a line has its x-height centred on it.
// Departures from the diagram's comment: each process has its own column, holding both its arrows, the matter's levels
// and the ladder drawn in each, so that the pairs read without leaders; the levels are named once, at the left of the
// first column ("u" and "l", with the gap hbar omega beside them), the fractions P_u and P_l stand over and under the
// first column's levels, and the rungs are named once, at the right of the last column; the third column has a bracket
// of its own, naming the emissivity j_omega, the chapter's "j_omega is the spontaneous emission", so that the two
// brackets read as the chapter's two coefficients.
// Exact: the rates (the chapter's dn/ds = kappa P_u (n + 1) - kappa P_l n, split into its three terms, and alpha =
// kappa (P_l - P_u), j_omega = kappa P_u hbar omega^3 / 4 pi^3 c^2, in tut-balance-lib.js); every arrow spans one
// hbar omega, on the matter and on the ladder alike. Schematic, as the caption says: the levels.
import { Sheet, ORIGIN, finish, checker, boxOf, LABEL_GAP, VEC, SIZE, n2 } from './tut-pot-lib.js';
import { dashedArrow } from './tut-maxwell-lib.js';
import { tex, INK, DIM } from '../lib.js';
import { chapter, palette, near } from './tut-balance-lib.js';

const name = 'tut-balance-rates';
const check = checker(name);

// ---- the drawing (points, y down) ---------------------------------------------------------------------------------
const U = 25;                                    // points per hbar omega, on the matter and the ladder alike
const MW = 30, LW = 24, INNER = 10, OUTER = 30;  // a level's and a rung's length; the gaps within and between columns
const LEVEL = 0.6;                               // a level's and a rung's stroke
const HEAD = 4.2;                                // an arrow's head
const DASH = [2.2, 1.6];                         // a dashed arrow's shaft
const HOOK = 3.2, BRACKET_W = 0.55;              // the brackets under the columns
const DIM_W = 0.45, END = 2.2;                   // the gap hbar omega: a dimension line and its ends
const E_LADDER = [0, 1, 2], E_MATTER = { l: 0.5, u: 1.5 };   // heights, in hbar omega
const caption = 'Look first at the dashed arrows: they are the only pair that does not need quanta already in the mode. The other two pairs both grow with $n_\\omega$, and their difference is the net absorption. The levels are schematic.';

/** The three processes: the matter's jump and the ladder's, as [from, to] heights; the shaft; the name and rate. */
const PROCESSES = [
	{ matter: ['l', 'u'], ladder: [1, 0], dashed: false, name: '\\text{absorption}', rate: '\\propto P_l\\,n_\\omega' },
	{ matter: ['u', 'l'], ladder: [1, 2], dashed: false, name: '\\text{stimulated}', rate: '\\propto P_u\\,n_\\omega' },
	{ matter: ['u', 'l'], ladder: [1, 2], dashed: true, name: '\\text{spontaneous}', rate: '\\propto P_u' }
];

/** A TeX label with its baseline at y, anchored at x by 'l', 'c' or 'r', as a pot-lib label. */
async function onBase(src, x, y, ax, color = INK) {
	const svg = await tex(src, [x, y], SIZE, ax + 'B', color);
	return { src, svg, box: boxOf(svg) };
}
/** A label beside a line at the height y, its x-height centred on the line. */
let XH = null;
async function onLine(src, x, y, ax, color = INK) {
	if (XH === null) XH = -boxOf(await tex('x', [0, 0], SIZE, 'lB')).t;
	return onBase(src, x, y + XH / 2, ax, color);
}

export default async function () {
	const { state, flat } = await chapter(check);
	await palette(check);
	state(name, 'balance-rates', caption);
	// the rates of the three terms: P_l n absorbed, P_u n and P_u emitted, in the chapter's equation
	check(flat.includes('\\kappa P_u\\,(n_\\omega + 1) - \\kappa P_l\\,n_\\omega'), 'the three terms');

	const S = new Sheet(name);
	const L = [];
	const pitch = MW + INNER + LW + OUTER;
	const x0 = ORIGIN - (3 * pitch - OUTER) / 2;
	const base = ORIGIN + U;                        // the height of the rung n_omega - 1
	const Y = (e) => base - e * U;
	const cols = PROCESSES.map((_, k) => {
		const m = x0 + k * pitch, l = m + MW + INNER;
		return { m: [m, m + MW], l: [l, l + LW], mx: m + MW / 2, lx: l + LW / 2 };
	});

	// ---- the levels and the rungs
	for (const [k, c] of cols.entries()) {
		for (const [key, e] of Object.entries(E_MATTER)) S.path([[c.m[0], Y(e)], [c.m[1], Y(e)]], { color: INK, width: LEVEL, cap: 'butt', layer: 1, what: `the level ${key} of column ${k}` });
		for (const e of E_LADDER) S.path([[c.l[0], Y(e)], [c.l[1], Y(e)]], { color: INK, width: LEVEL, cap: 'butt', layer: 1, what: `the rung ${e} of column ${k}` });
	}
	check(near(E_MATTER.u - E_MATTER.l, 1, 0) && E_LADDER.every((e, i) => i === 0 || near(e - E_LADDER[i - 1], 1, 0)), 'the gap and the rungs are not one hbar omega');

	// ---- the arrows: each from its level's stroke to the far edge of the other's
	const arrow = (x, from, to, dashed, what) => {
		const dir = Math.sign(to - from);              // +1 up
		const A = [x, Y(from) - dir * LEVEL / 2], B = [x, Y(to) + dir * LEVEL / 2];
		check(near(Math.abs(to - from), 1, 0), `${what} does not span one hbar omega`);
		if (dashed) return dashedArrow(S, A, B, { color: INK, width: VEC, head: HEAD, dash: DASH, layer: 2, what });
		return S.arrow(A, B, { color: INK, width: VEC, head: HEAD, layer: 2, what });
	};
	for (const [k, p] of PROCESSES.entries()) {
		const c = cols[k];
		arrow(c.mx, E_MATTER[p.matter[0]], E_MATTER[p.matter[1]], p.dashed, `the matter's arrow of ${p.name}`);
		arrow(c.lx, p.ladder[0], p.ladder[1], p.dashed, `the ladder's arrow of ${p.name}`);
		// energy is kept: the matter rises when the mode falls, and falls when it rises
		const dm = E_MATTER[p.matter[1]] - E_MATTER[p.matter[0]], dl = p.ladder[1] - p.ladder[0];
		check(near(dm + dl, 0, 0) && p.ladder[0] === 1, `${p.name} does not keep energy or does not start at n_omega`);
	}

	// ---- the names of the levels, the gap and the fractions, at the first column
	{
		const c = cols[0];
		const u = await onLine('u', c.m[0] - LABEL_GAP - 0.6, Y(E_MATTER.u), 'r');
		const l = await onLine('l', c.m[0] - LABEL_GAP - 0.6, Y(E_MATTER.l), 'r');
		L.push(u, l);
		const xd = Math.min(u.box.l, l.box.l) - 5;
		S.path([[xd, Y(E_MATTER.u)], [xd, Y(E_MATTER.l)]], { color: DIM, width: DIM_W, cap: 'butt', layer: 1, what: 'the gap\'s line' });
		for (const e of Object.values(E_MATTER)) S.path([[xd - END, Y(e)], [xd + END, Y(e)]], { color: DIM, width: DIM_W, cap: 'butt', layer: 1, what: 'the gap\'s end' });
		L.push(await onLine('\\hbar\\omega', xd - END - LABEL_GAP, Y(1), 'r'));
		// the fractions over and under the first column's levels, right of its arrow
		L.push(await S.clear('P_u', c.mx + VEC / 2 + LABEL_GAP + 0.4, Y(E_MATTER.u) - LEVEL / 2 - LABEL_GAP - 0.4, 0, 1, [1, 0]));
		L.push(await S.clear('P_l', c.mx + VEC / 2 + LABEL_GAP + 0.4, Y(E_MATTER.l) + LEVEL / 2 + LABEL_GAP + 0.4, 0, 0, [1, 0]));
		// the two parts named over the first column
		const top = Y(E_LADDER[2]) - LEVEL / 2 - 6.5;
		L.push(await onBase('\\text{matter}', c.mx, top, 'c', DIM));
		L.push(await onBase('\\text{mode}', c.lx, top, 'c', DIM));
	}
	// ---- the names of the rungs, at the last column
	{
		const c = cols[2];
		const names = ['n_\\omega - 1', 'n_\\omega', 'n_\\omega + 1'];
		for (const e of E_LADDER) L.push(await onLine(names[e], c.l[1] + LABEL_GAP + 0.6, Y(e), 'l'));
	}

	// ---- under each column, its name and its rate
	const first = Y(0) + LEVEL / 2 + 13, LEAD = 11.5;     // the baselines of the names and of the rates
	let low = 0;
	for (const [k, p] of PROCESSES.entries()) {
		const c = cols[k], mid = (c.m[0] + c.l[1]) / 2;
		const a = await onBase(p.name, mid, first, 'c');
		const b = await onBase(p.rate, mid, first + LEAD, 'c');
		L.push(a, b);
		low = Math.max(low, b.box.b);
	}

	// ---- the brackets: net absorption under the first two columns, the emissivity under the third
	const yb = low + 3 + HOOK;
	const bracket = async (p, q, src, what) => {
		S.path([[p, yb - HOOK], [p, yb], [q, yb], [q, yb - HOOK]], { color: INK, width: BRACKET_W, cap: 'butt', layer: 2, what });
		L.push(await onBase(src, (p + q) / 2, yb + 10.5, 'c'));
	};
	await bracket(cols[0].m[0] + 1.4, cols[1].l[1] - 1.4, '\\text{net absorption }\\alpha \\propto P_l - P_u', 'the bracket of net absorption');
	await bracket(cols[2].m[0] + 1.4, cols[2].l[1] - 1.4, 'j_\\omega \\propto P_u', 'the bracket of the emissivity');

	S.checkAll(L);
	window[name + '-numbers'] = { U, pitch };
	return finish(S, L, [285, 330]);
}
