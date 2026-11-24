// The tutorial, chapter 7.7 (tutorial/geometry/quadrupole-formula.md), its first diagram: the rotor's total stress is
// half the acceleration of its second moment. Above, chapter 5.4's rotor seen from above, the z axis out of the page
// at the corner of small axes x and y: two stone masses at the ends of a rod along u-hat, drawn at 60 degrees from the
// x axis, a curved arrow for the anticlockwise turning, Omega. At each mass a short ink arrow, its velocity, along
// +w-hat and -w-hat, at right angles to the rod, named "masses"; the rod a heavier ink bar with an inward head at each
// end, "rod's tension". Below, three glyphs in a row joined by "+" and "=": a bar along w-hat (the masses' table), a
// bar along u-hat (the rod's), and the two crossed, each with its table under it, the last "(1/2) I-double-dot".
// No orange or blue, which mean stretch and squeeze in the tutorial's figures.
// Departures from the diagram's comment: the glyph row stands under the rotor, not beside it, so that one drawing
// about 250 points wide keeps its text readable on a phone. The tables are printed once, under the glyphs
// ("(1/2) m Omega^2 d^2 w w", "-(1/2) m Omega^2 d^2 u u", "(1/2) I-double-dot"), and the rotor's labels name the parts
// ("masses", "rod's tension"), so that no formula is printed twice. A negative table is a hollow bar, a positive one
// a solid bar, so that the crossed glyph keeps the rod's sign without colour; the minus sign stands in the rod's
// table under its glyph. The two velocity arrows point opposite ways, +w-hat at the mass at +(d/2) u-hat and -w-hat at
// the other, as the masses move; the flux w w is the same for both. The rod is itself the heavier bar.
// Exact: the directions u-hat and w-hat at the drawn instant, Omega t = -30 degrees, so that u-hat is 60 degrees from
// x (asserted); w-hat is u-hat turned anticlockwise by 90 degrees, du/dt = Omega w (the sense of the curved arrow);
// the three tables, (1/2) m Omega^2 d^2 (w w - u u) against half the second derivative of I = (1/2) m d^2 u u at
// every instant tried (tut-quadrupole-lib.js); each glyph's bar along the drawn u-hat or w-hat, its length the size
// of its table, the same for both (asserted). Schematic: the sizes and the arrows' lengths.
// Pictorial: the stones, a picture from an image model (sprites/hair/ball-face.png, as tut-earth-two-bars), clipped
// to their exact circles.
import { Sheet, ORIGIN, finish, checker, placed, near, LABEL_GAP, VEC, VEC_HEAD, AXIS, AXIS_HEAD } from './tut-pot-lib.js';
import { INK, PAGE, sprite } from '../lib.js';
import { picture, circle as circlePath } from '../stone.js';
import { STONE_INK } from './tut-orb-lib.js';
import { turning } from './tut-flow-lib.js';
import { odot, ODOT } from './tut-gw-lib.js';
import { chapter, palette, MATTER, uHat, wHat, massFlux, rodFlux } from './tut-quadrupole-lib.js';

const name = 'tut-rotor-stress';
const check = checker(name);

const PH = -Math.PI / 6;                   // Omega t at the drawn instant: u-hat at 60 degrees from x
const HR = 35;                             // half the rod, centre to a mass's centre, points
const RS = 8;                            // a stone's radius
const ROD = 1.25;                          // the rod's bar
const ROD_HEAD = [6.2, 2.5];               // an inward head on the rod: its length and half-width
const V_LEN = 15;                          // a velocity's arrow
const V_FROM = RS + 1.3;                   // from a stone's centre to its arrow's tail
const SPIN = { r: 13, from: 78, to: 138 }; // the curved arrow: radius, degrees from x (anticlockwise)
const GN = [-60, 44], GN_LEN = 11, GN_FROM = ODOT.r + 1.3;   // the small axes' corner from the centre (y down)
const GLYPH = 13;                          // half a glyph's bar
const BAR = 2.6;                           // a glyph's bar: its width
const HOLLOW = 0.5;                        // a hollow bar's outline
const ROW_STEP = 31;                       // between the glyphs' centres, down the column
const COL_AIR = 16;                        // the rotor's rightmost label to the operators
const OP_W = 9;                            // an operator's room, left of a glyph's ink
const TABLE_AIR = 5;                       // a glyph's ink to its table

const m = `{\\color{${MATTER}}m}`;

export default async function () {
	chapter(check);
	await palette(check);
	const S = new Sheet(name);
	const L = [];
	const art = await sprite('/figures3d/sprites/hair/ball-face.png');
	const page = (v) => [v[0], -v[1]];                         // the plane's (x, y) to the page (y down)

	// ---- the instant: u-hat at 60 degrees from x, w-hat a quarter turn anticlockwise from it
	const u3 = uHat(PH), w3 = wHat(PH);
	check(near(Math.atan2(u3[1], u3[0]), Math.PI / 3, 1e-12), `u-hat is ${(Math.atan2(u3[1], u3[0]) * 180) / Math.PI} degrees from x`);
	check(near(w3[0], -u3[1], 1e-15) && near(w3[1], u3[0], 1e-15), 'w-hat is not u-hat turned anticlockwise');
	const u = page(u3), w = page(w3);
	const O = [ORIGIN - 40, ORIGIN - 60];
	const at = (s, v) => [O[0] + s * v[0], O[1] + s * v[1]];

	// ---- the rod: a heavier bar between the stones, an inward head at each end
	const ends = [1, -1].map((s) => at(s * (HR - RS - 1.0), u));
	S.path(ends, { color: INK, width: ROD, cap: 'butt', layer: 1, what: 'the rod' });
	for (const [k, s] of [1, -1].entries()) {
		const base = at(s * (HR - RS - 1.2), u), dir = [-s * u[0], -s * u[1]];
		const tip = [base[0] + dir[0] * ROD_HEAD[0], base[1] + dir[1] * ROD_HEAD[0]];
		const n = [-dir[1], dir[0]];
		const corners = [tip, [base[0] + n[0] * ROD_HEAD[1], base[1] + n[1] * ROD_HEAD[1]], [base[0] - n[0] * ROD_HEAD[1], base[1] - n[1] * ROD_HEAD[1]]];
		S.raw(`<path d="M${corners.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join('L')}Z" fill="${INK}"/>`, 2);
		S.mark([...corners, tip], 0, `the rod's head ${k}`);
	}
	check(ROD_HEAD[0] <= 0.4 * 2 * (HR - RS), 'the rod\'s heads are too long for it');

	// ---- the stones and their velocities: +w-hat at +(d/2) u-hat, -w-hat at the other
	const vel = [];
	for (const [k, s] of [1, -1].entries()) {
		const c = at(s * HR, u);
		S.raw(picture(`${name}-stone${k}`, art, c[0], c[1], RS, circlePath(c[0], c[1], RS)) + `<path d="${circlePath(c[0], c[1], RS)}" fill="none" stroke="${STONE_INK}" stroke-width="0.35"/>`, 3);
		S.mark([c], RS, `stone ${k}`);
		const d = [s * w[0], s * w[1]];
		const a0 = [c[0] + d[0] * V_FROM, c[1] + d[1] * V_FROM], a1 = [a0[0] + d[0] * V_LEN, a0[1] + d[1] * V_LEN];
		vel.push(S.arrow(a0, a1, { color: INK, width: VEC, head: VEC_HEAD, layer: 3, what: `stone ${k}'s velocity` }));
	}
	check(vel.every((a) => near(a.L, V_LEN, 1e-9)) && near(vel[0].u[0] * u[0] + vel[0].u[1] * u[1], 0, 1e-12), 'the velocities are not equal and across the rod');

	// ---- the turning: anticlockwise, the sense of du/dt = Omega w
	{
		const t = turning(O[0], O[1], SPIN.r, (SPIN.from * Math.PI) / 180, (SPIN.to * Math.PI) / 180, INK, { width: VEC, head: VEC_HEAD });
		S.raw(t.svg, 3);
		S.mark(t.pts, VEC / 2, 'the turning');
		S.mark(t.head, 0, 'the turning\'s head');
		S.arrows.push({ L: t.len, head: t.hd, what: 'the turning' });
		check(SPIN.to > SPIN.from && SPIN.from > 60 && SPIN.to < 150, 'the curved arrow crosses the rod or is not anticlockwise');
		const mid = (((SPIN.from + SPIN.to) / 2) * Math.PI) / 180;
		L.push(await S.clear('\\Omega', O[0] + (SPIN.r + 3.5) * Math.cos(mid), O[1] - (SPIN.r + 3.5) * Math.sin(mid), 0.5, 0.5, [Math.cos(mid), -Math.sin(mid)]));
	}

	// ---- the small axes, z out of the page at their corner
	{
		const G = [O[0] + GN[0], O[1] + GN[1]];
		odot(S, G, 'z');
		const ex = S.arrow([G[0] + GN_FROM, G[1]], [G[0] + GN_FROM + GN_LEN, G[1]], { width: AXIS, head: AXIS_HEAD, what: 'x' });
		const ey = S.arrow([G[0], G[1] - GN_FROM], [G[0], G[1] - GN_FROM - GN_LEN], { width: AXIS, head: AXIS_HEAD, what: 'y' });
		L.push(await placed('x', ex.B[0] + LABEL_GAP + 0.5, ex.B[1], 0, 0.5, INK));
		L.push(await placed('y', ey.B[0], ey.B[1] - LABEL_GAP - 0.5, 0.5, 1, INK));
		L.push(await placed('z', G[0] - ODOT.r - LABEL_GAP - 0.4, G[1] + ODOT.r + 0.4, 1, 0, INK));
	}

	// ---- the rotor's names
	{
		// u-hat beyond the + stone, along the rod; w-hat at the + velocity's tip
		const c = at(HR + RS, u);
		L.push(await S.clear('\\hat u', c[0] + u[0] * 4.5, c[1] + u[1] * 4.5, 0.5, 0.5, u));
		const tip = vel[0].B;
		L.push(await S.clear('\\hat w', tip[0] + w[0] * 4, tip[1] + w[1] * 4, 0.5, 0.5, w));
		// "masses" right of the - velocity's tip; "rod's tension" right of the rod's middle
		const tip2 = vel[1].B;
		L.push(await S.clear('\\text{masses}', tip2[0] + LABEL_GAP + 1, tip2[1], 0, 0.5, [1, 0]));
		L.push(await S.clear('\\text{rod’s tension}', O[0] + 9, O[1] + 4, 0, 0.5, [1, 0]));
	}

	// ---- the glyphs, a column right of the rotor: w w, + (-u u), = (1/2) I-double-dot, each bar along the drawn direction
	const k = 0.5;                                              // (1/2) m Omega^2 d^2 for m = Omega = d = 1
	const Tm = massFlux(1, 1, 1, PH), Tr = rodFlux(1, 1, 1, PH);
	// each table is k times a projector, so its bar's half-length is GLYPH for both and its direction the projector's
	check(near(Tm[0][0] + Tm[1][1], k, 1e-12) && near(Tr[0][0] + Tr[1][1], -k, 1e-12), 'the tables\' sizes');
	check(near(Tm[0][0] * u3[0] * u3[0] + 2 * Tm[0][1] * u3[0] * u3[1] + Tm[1][1] * u3[1] * u3[1], 0, 1e-12) && near(Tr[0][0] * w3[0] * w3[0] + 2 * Tr[0][1] * w3[0] * w3[1] + Tr[1][1] * w3[1] * w3[1], 0, 1e-12), 'a table has a part across its bar');
	const rightmost = Math.max(...L.map((l) => l.box.r));
	const ox = rightmost + COL_AIR;                             // the operators' column
	const gx = ox + OP_W + GLYPH * Math.max(Math.abs(u[0]), Math.abs(w[0]));
	const gy = [-1, 0, 1].map((i) => O[1] + ROW_STEP * i);
	const solid = (c, v, what) => {
		const a = [c[0] - GLYPH * v[0], c[1] - GLYPH * v[1]], b = [c[0] + GLYPH * v[0], c[1] + GLYPH * v[1]];
		S.path([a, b], { color: INK, width: BAR, cap: 'butt', layer: 3, what });
	};
	const hollow = (c, v, what) => {
		const n = [-v[1], v[0]], h = BAR / 2 - HOLLOW / 2;
		const P = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([s, t]) => [c[0] + s * (GLYPH - HOLLOW / 2) * v[0] + t * h * n[0], c[1] + s * (GLYPH - HOLLOW / 2) * v[1] + t * h * n[1]]);
		S.raw(`<path d="M${P.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join('L')}Z" fill="${PAGE}" stroke="${INK}" stroke-width="${HOLLOW}" stroke-linejoin="miter"/>`, 2);
		S.mark([...P, P[0]], HOLLOW / 2, what);
	};
	solid([gx, gy[0]], w, 'the masses\' glyph');
	hollow([gx, gy[1]], u, 'the rod\'s glyph');
	hollow([gx, gy[2]], u, 'the sum\'s rod bar');
	solid([gx, gy[2]], w, 'the sum\'s mass bar');
	L.push(await placed('+', ox, gy[1], 0, 0.5, INK));
	L.push(await placed('=', ox, gy[2], 0, 0.5, INK));
	// each table right of its glyph
	const tx = gx + GLYPH * Math.max(Math.abs(u[0]), Math.abs(w[0])) + BAR + TABLE_AIR;
	const names = [
		`\\tfrac12${m}\\Omega^2d^2\\,\\hat w\\hat w`,
		`-\\tfrac12${m}\\Omega^2d^2\\,\\hat u\\hat u`,
		`\\tfrac12{\\color{${MATTER}}\\ddot I}`
	];
	for (const [i, src] of names.entries()) L.push(await placed(src, tx, gy[i], 0, 0.5, INK));

	S.checkAll(L);
	window[name + '-numbers'] = { u: u3, w: w3, Tm, Tr };
	return finish(S, L, [190, 300]);
}
