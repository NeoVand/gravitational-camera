// The tutorial, section 8.2 (tutorial/quantum/operators.md), its second diagram: a shift and a kick in either order.
// Section 1.7's phase plane, x to the right and p upward, thin grey axes. A start point (an open circle) at
// (x_0, p_0). Route 1, solid ink: a horizontal arrow of length s, the shift e^{-isp/hbar}, then a vertical arrow of
// length b, the kick e^{ibx/hbar}. Route 2, dashed ink: the kick first, then the shift. Both end at the same dot,
// (x_0 + s, p_0 + b), "same end point". The rectangle between the routes is lightly shaded and labelled "area sb".
// Beside the plane, a key to the two routes and two lines of type: "classical: the two orders agree" and "quantum: they
// differ by the phase e^{isb/hbar}, seen only when two paths take opposite orders". Ink and grey only; no orange or blue.
// Departures from the diagram's comment: the dashed route's arrows carry the short labels "kick b" and "shift s" (the
// operators are named once, on the solid route), and a key beside the plane names the two orders ("shift, then kick",
// solid; "kick, then shift", dashed), above the two lines of type, which wrap to the key's width.
// Exact: what the moves do, on a wave function on a grid (tut-operators-lib.js, `moves`): e^{-isp/hbar} slides the
// packet by s, e^{ibx/hbar} raises its mean momentum by b and leaves |psi|^2 alone, both orders end at the same means
// (x_0 + s, p_0 + b), and shift-then-kick is e^{isb/hbar} times kick-then-shift at every point; the drawn edges are s
// and b on the plane's two scales (asserted). Schematic, as the caption says: the sizes of s and b, and the start.
import { Sheet, ORIGIN, finish, checker, placed, near, AXIS, AXIS_HEAD, VEC, LABEL_GAP, n2 } from './tut-pot-lib.js';
import { INK, DIM } from '../lib.js';
import { chapter, palette, dashedArrow } from './tut-operators-lib.js';

const name = 'tut-shift-kick-orders';
const check = checker(name);

// ---- the drawing (points), on scales chosen for it ----------------------------------------------------------------
const UX = 1, UP = 1;                    // points per unit of x and of p (the plane's two scales)
const X0 = 42, P0 = 30;                  // the start, from the origin
const S_ = 98, B_ = 66;                  // s and b
const AX = 160, AP = 124;                // the axes' lengths
const OPEN = 1.9, OPEN_W = 0.5, DOT = 1.6;
const TAIL = 1.1, TIP = 0.9;             // air between an arrow and its start or end mark
const CORNER = 1.3;                      // air between a head's tip and the next arrow's shaft
const TINT = '#eeebe5';                  // a neutral tint of the page (drawing.ts THEME)
const KEY_AIR = 14;                      // the plane's rightmost ink to the key
const KEY_LINE = 18;                     // a sample arrow's length
const PITCH = 11.5;                      // baseline to baseline in the key and the type
const TEXT_W = 128;                      // the type's measure

export default async function () {
	await chapter(check);
	await palette(check);
	const S = new Sheet(name);
	const L = [];
	const O = [ORIGIN - 140, ORIGIN + 70];
	const at = (x, p) => [O[0] + UX * x, O[1] - UP * p];
	const start = at(X0, P0), end = at(X0 + S_, P0 + B_);
	const c1 = at(X0 + S_, P0), c2 = at(X0, P0 + B_);       // route 1's corner (shift done), route 2's (kick done)
	check(near(end[0] - start[0], UX * S_, 1e-12) && near(start[1] - end[1], UP * B_, 1e-12), 'the edges are not s and b');

	// ---- the axes
	S.arrow(at(-6, 0), at(AX, 0), { color: DIM, width: AXIS, head: AXIS_HEAD, layer: 0, what: 'the x axis' });
	S.arrow(at(0, -6), at(0, AP), { color: DIM, width: AXIS, head: AXIS_HEAD, layer: 0, what: 'the p axis' });
	L.push(await placed('x', at(AX, 0)[0] + LABEL_GAP, at(AX, 0)[1], 0, 0.5, DIM));
	L.push(await placed('p', at(0, AP)[0], at(0, AP)[1] - LABEL_GAP, 0.5, 1, DIM));

	// ---- the rectangle between the routes
	{
		const [l, t, r, b] = [start[0], end[1], end[0], start[1]];
		S.fill(`M${n2(l)},${n2(t)}H${n2(r)}V${n2(b)}H${n2(l)}Z`, { l, r, t, b }, { color: TINT, layer: 0.5, what: 'the area' });
	}
	// ---- the start and the end
	S.raw(`<circle cx="${n2(start[0])}" cy="${n2(start[1])}" r="${OPEN}" fill="none" stroke="${INK}" stroke-width="${OPEN_W}"/>`, 3);
	S.mark([start], OPEN + OPEN_W / 2, 'the start');
	S.raw(`<circle cx="${n2(end[0])}" cy="${n2(end[1])}" r="${DOT}" fill="${INK}"/>`, 3);
	S.mark([end], DOT, 'the end');
	const o = OPEN + OPEN_W / 2;

	// ---- route 1, solid: the shift, then the kick
	const a1 = S.arrow([start[0] + o + TAIL, start[1]], [c1[0] - VEC / 2 - CORNER, c1[1]], { what: 'route 1\'s shift' });
	const a2 = S.arrow([c1[0], c1[1]], [end[0], end[1] + DOT + TIP], { what: 'route 1\'s kick' });
	// ---- route 2, dashed: the kick, then the shift
	const a3 = dashedArrow(S, [start[0], start[1] - o - TAIL], [c2[0], c2[1] + VEC / 2 + CORNER], { width: VEC, what: 'route 2\'s kick' });
	const a4 = dashedArrow(S, [c2[0], c2[1]], [end[0] - DOT - TIP, end[1]], { width: VEC, what: 'route 2\'s shift' });
	check(near(a1.u[1], 0, 1e-12) && near(a4.u[1], 0, 1e-12) && near(a2.u[0], 0, 1e-12) && near(a3.u[0], 0, 1e-12), 'an arrow is not along an axis');
	check(a1.u[0] > 0 && a4.u[0] > 0 && a2.u[1] < 0 && a3.u[1] < 0, 'an arrow points the wrong way');

	// ---- the labels, beside the arrows, never on them
	const g = LABEL_GAP + 0.3;
	const mid1 = (start[0] + c1[0]) / 2;
	L.push(await placed('\\text{shift }s,\\ e^{-isp/\\hbar}', mid1, start[1] + VEC / 2 + g, 0.5, 0, INK));
	L.push(await placed('(x_0, p_0)', start[0] - o - g, start[1] + o + 1.2, 1, 0, INK));
	const midK = (c1[1] + end[1]) / 2;
	L.push(await placed('\\text{kick }b,', end[0] + VEC / 2 + g, midK - 1, 0, 1, INK));
	L.push(await placed('e^{ibx/\\hbar}', end[0] + VEC / 2 + g, midK + 1.6, 0, 0, INK));
	L.push(await placed('\\text{kick }b', start[0] - VEC / 2 - g, (start[1] + c2[1]) / 2, 1, 0.5, INK));
	L.push(await placed('\\text{shift }s', (c2[0] + end[0]) / 2 - 12, end[1] - VEC / 2 - g, 0.5, 1, INK));
	L.push(await placed('\\text{same end point}', end[0] + 4, end[1] - DOT - g, 0.5, 1, INK));
	const area = await placed('\\text{area }sb', (start[0] + end[0]) / 2, (start[1] + end[1]) / 2, 0.5, 0.5, INK);
	area.on = ['the area'];
	L.push(area);

	// ---- the key and the type, beside the plane
	const right = Math.max(at(AX, 0)[0] + 10, ...L.map((l) => l.box.r));
	const kx = right + KEY_AIR;
	let y = end[1] - 14;
	S.arrow([kx, y], [kx + KEY_LINE, y], { what: 'the key\'s solid arrow' });
	L.push(await placed('\\text{shift, then kick}', kx + KEY_LINE + g, y, 0, 0.5, INK));
	y += PITCH;
	dashedArrow(S, [kx, y], [kx + KEY_LINE, y], { width: VEC, what: 'the key\'s dashed arrow' });
	L.push(await placed('\\text{kick, then shift}', kx + KEY_LINE + g, y, 0, 0.5, INK));
	y += PITCH + 8;
	const lines = [
		'\\text{classical: the two orders agree}',
		'\\text{quantum: they differ by the phase}',
		'e^{isb/\\hbar}\\text{, seen only when two paths}',
		'\\text{take opposite orders}'
	];
	for (const [i, src] of lines.entries()) {
		if (i === 1) y += 4;
		const l = await placed(src, kx, y, 0, 0.5, INK);
		check(l.box.r - kx <= TEXT_W, `the line "${src}" is wider than the measure: ${l.box.r - kx}`);
		L.push(l);
		y += PITCH;
	}

	S.checkAll(L);
	window[name + '-numbers'] = { s: S_, b: B_ };
	return finish(S, L, [240, 345]);
}
