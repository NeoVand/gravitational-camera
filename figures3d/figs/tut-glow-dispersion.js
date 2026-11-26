// The tutorial, section 10.3 (tutorial/glow/why-matter-barely-glows.md), its first diagram: a gravitational wave meets
// no acoustic phonon. One panel: across, the wavenumber k from 0 to the edge of the crystal's cell, pi / a; up, omega
// from 0 to 1.3 omega_0. The two branches of a chain of two atoms in its cell (masses m and 2m, one spring): the
// acoustic branch, rising as c_T k from the origin (a dashed tangent, "c_T k") and flattening towards the edge; the
// optical branch, from omega_0 at k = 0 falling a little towards the edge. Gravity's line omega = c k, almost on the
// axis up, "ck (slope 10^5 times steeper)", meets the acoustic branch only at the origin and the optical branch near
// k = 0, where a dot is marked "a wave can drive this". On the acoustic branch at the right, a dot with two arrows of
// equal length from it pointing to +k and -k, under a bracket "a pair: total momentum 0". Ink and the page's greys
// only: no colour roles.
// Departures from the diagram's comment: the bracket is section 10.2's square bracket (figs/tut-balance-rates.js), and
// the two arrows hang just under the branch, their tips named "-k" and "+k", so that they do not run along it.
// Exact: the branches are the chain's (omega^2 = K (1/m1 + 1/m2) +- K sqrt((1/m1 + 1/m2)^2 - 4 sin^2(ka/2) / m1 m2),
// asserted against its equation of motion), the tangent their slope at the origin, and the dot where the steep line
// meets the optical branch. Schematic, as the caption says: the branches (a chain, not silicon) and the steep line's
// slope, which is not to scale (its true slope, c / c_T = 10^5 times the tangent's, asserted in tut-glow-lib.js).
import { Sheet, ORIGIN, finish, checker, placed, LABEL_GAP, AXIS, HAIR, TICK, VEC, n2 } from './tut-pot-lib.js';
import { Plot, NUM } from './tut-prob-lib.js';
import { graph, longest } from './tut-fourier-lib.js';
import { INK, DIM } from '../lib.js';
import { chapter, palette, near } from './tut-glow-lib.js';

const name = 'tut-glow-dispersion';
const check = checker(name);

// ---- the chain: masses m1, m2, one spring K; k in units of pi / a, omega in units of omega_0 ----------------------
const M1 = 1, M2 = 2, K = 1;
const S2 = K * (1 / M1 + 1 / M2);
const W0 = Math.sqrt(2 * S2);                    // the optical frequency at k = 0
const branch = (sign) => (q) => { const s = Math.sin((Math.PI * q) / 2); return Math.sqrt(Math.max(0, S2 + sign * Math.sqrt(S2 * S2 - (4 * K * K * s * s) / (M1 * M2)))) / W0; };
const acoustic = branch(-1), optical = branch(+1);
const SLOPE = (Math.PI * Math.sqrt(K / (2 * (M1 + M2)))) / W0;   // d(omega / omega_0) / dq at the origin

// ---- the drawing (points) ----------------------------------------------------------------------------------------
const Y1 = 1.3;
const DX = 266, DY = 118;                        // points per unit of k (pi / a) and of omega_0
const CURVE = 0.75, TANGENT = 0.55, DASH = [3, 2];
const STEEP = 0.03;                              // the steep line leaves the top at k = STEEP pi / a
const TAN_TO = 0.74;                             // the tangent's reach, in pi / a
const DOT = 1.55;
const PAIR = { q: 0.8, drop: 12, len: 15, head: 3.4, hook: 3, gap: 3.4 };
const caption = 'Look first at the steep line: a gravitational wave of any frequency has almost no wavenumber, so it meets no acoustic phonon, which would need the same frequency at a far larger wavenumber. It can drive the optical vibration, whose frequency at zero wavenumber is not zero, and pairs of phonons whose momenta cancel. The branches are schematic; the ratio of slopes is not to scale.';

export default async function () {
	const { state } = await chapter(check);
	await palette(check);
	state(name, 'glow-dispersion', caption);

	// ---- the chain's branches solve its equation of motion: det [[2K - m1 w^2, -K(1 + e^{-ika})], [c.c., 2K - m2 w^2]] = 0
	for (const q of [0, 0.13, 0.5, 0.87, 1]) for (const f of [acoustic, optical]) {
		const w2 = (f(q) * W0) ** 2, ka = Math.PI * q;
		const det = (2 * K - M1 * w2) * (2 * K - M2 * w2) - K * K * (2 + 2 * Math.cos(ka));
		check(Math.abs(det) < 1e-9, `the branch at q = ${q} does not solve the chain: ${det}`);
	}
	check(near(optical(0), 1, 1e-15) && near(acoustic(0), 0, 1e-15), 'the branches at k = 0');
	check(optical(1) < 1 && optical(1) > 0.75 && acoustic(1) < optical(1), 'the optical branch does not fall a little');
	check(near(acoustic(1e-3) / 1e-3, SLOPE, 1e-5 * SLOPE), `the tangent is not the slope at the origin: ${acoustic(1e-3) / 1e-3} against ${SLOPE}`);
	for (let i = 1; i <= 200; i++) { const q = i / 200; check(acoustic(q) > acoustic(q - 0.005) && optical(q) < optical(q - 0.005) + 1e-15, `the branches do not rise and fall at ${q}`); }

	const S = new Sheet(name);
	const L = [];
	const W = DX, H = Y1 * DY;
	const P = new Plot({ left: ORIGIN - W / 2, top: ORIGIN - H / 2, w: W, h: H, x0: 0, x1: 1, y0: 0, y1: Y1 });

	// ---- the axes: across from 0 to pi / a, up to 1.3 omega_0, each named at its end
	S.path([[P.left, P.bottom], [P.right, P.bottom]], { color: DIM, width: AXIS, layer: 1, cap: 'butt', what: 'the axis across' });
	S.path([[P.left, P.bottom], [P.left, P.top]], { color: DIM, width: AXIS, layer: 1, cap: 'butt', what: 'the axis up' });
	for (const q of [0, 1]) S.path([[P.X(q), P.bottom], [P.X(q), P.bottom + TICK]], { color: DIM, width: HAIR, layer: 1, cap: 'butt', what: `the tick at ${q}` });
	S.path([[P.left, P.Y(1)], [P.left - TICK, P.Y(1)]], { color: DIM, width: HAIR, layer: 1, cap: 'butt', what: 'the tick at omega_0' });
	const xl = [await placed('0', P.X(0), P.bottom + TICK + NUM, 0.5, 0, DIM), await placed('\\pi/a', P.X(1), P.bottom + TICK + NUM, 0.5, 0, DIM)];
	L.push(...xl);
	L.push(await placed('k', P.X(0.5), Math.max(...xl.map((l) => l.box.b)) + 4, 0.5, 0, DIM));
	L.push(await placed('\\omega_0', P.left - TICK - NUM, P.Y(1), 1, 0.5, DIM));
	L.push(await placed('\\omega', P.left, P.top - 4.5, 0.5, 1, DIM));

	// ---- the branches and the tangent
	const curve = (f, what) => {
		const pts = graph(P, f, 0, 1, 0.2);
		check(longest(pts) <= 0.2001, `${what} is coarse`);
		S.path(pts, { color: INK, width: CURVE, layer: 2, cap: 'butt', what });
		return pts;
	};
	curve(acoustic, 'the acoustic branch');
	curve(optical, 'the optical branch');
	S.path([P.at(0, 0), P.at(TAN_TO, SLOPE * TAN_TO)], { color: DIM, width: TANGENT, dash: DASH, cap: 'butt', layer: 1.5, what: 'the tangent' });
	check(SLOPE * TAN_TO < Y1, 'the tangent leaves the frame');

	// ---- gravity's line, steep, from the origin to the top; the dot where it meets the optical branch
	const s = Y1 / STEEP;
	S.path([P.at(0, 0), P.at(STEEP, Y1)], { color: INK, width: CURVE, layer: 2.2, cap: 'butt', what: 'gravity\'s line' });
	let lo = 0, hi = STEEP;                          // s q = optical(q): bisect
	for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (s * m < optical(m)) lo = m; else hi = m; }
	const qx = (lo + hi) / 2;
	check(near(s * qx, optical(qx), 1e-12) && qx < 0.03, `the steep line meets the optical branch at ${qx}`);
	// it meets the acoustic branch only at the origin: s q > acoustic(q) for every q > 0
	for (let i = 1; i <= 1000; i++) { const q = (i / 1000) * STEEP; check(s * q > acoustic(q), `the steep line meets the acoustic branch at ${q}`); }
	const qd = P.at(qx, optical(qx));
	S.raw(`<circle cx="${n2(qd[0])}" cy="${n2(qd[1])}" r="${DOT}" fill="${INK}"/>`, 3);
	S.mark([qd], DOT, 'the dot on the optical branch');

	// ---- the pair: a dot on the acoustic branch, two arrows from just under it to -k and +k, a bracket under them
	const qp = P.at(PAIR.q, acoustic(PAIR.q));
	S.raw(`<circle cx="${n2(qp[0])}" cy="${n2(qp[1])}" r="${DOT}" fill="${INK}"/>`, 3);
	S.mark([qp], DOT, 'the pair\'s dot');
	const y = qp[1] + DOT + PAIR.drop;
	const right = S.arrow([qp[0], y], [qp[0] + PAIR.len, y], { color: INK, width: VEC * 0.8, head: PAIR.head, layer: 2, what: 'the arrow to +k' });
	const left = S.arrow([qp[0], y], [qp[0] - PAIR.len, y], { color: INK, width: VEC * 0.8, head: PAIR.head, layer: 2, what: 'the arrow to -k' });
	check(near(right.L, left.L, 1e-12), 'the two arrows are not of equal length');
	const plus = await placed('+k', right.B[0] + LABEL_GAP + 0.4, y, 0, 0.5, INK);
	const minus = await placed('-k', left.B[0] - LABEL_GAP - 0.4, y, 1, 0.5, INK);
	L.push(plus, minus);
	const yb = Math.max(plus.box.b, minus.box.b) + PAIR.gap + PAIR.hook;
	const [bl, br] = [minus.box.l + 0.5, plus.box.r - 0.5];
	S.path([[bl, yb - PAIR.hook], [bl, yb], [br, yb], [br, yb - PAIR.hook]], { color: INK, width: 0.55, cap: 'butt', layer: 2, what: 'the bracket' });
	L.push(await placed('\\text{a pair: total momentum 0}', (bl + br) / 2, yb + LABEL_GAP + 0.8, 0.5, 0, INK));

	// ---- the names: the steep line at its top, the dot, the tangent
	L.push(await S.clear('ck\\ \\ (\\text{slope }10^5\\text{ times steeper})', P.X(STEEP) + LABEL_GAP + 1, P.top, 0, 0, [1, 0]));
	L.push(await S.clear('\\text{a wave can drive this}', qd[0] + DOT + LABEL_GAP + 1, qd[1] - DOT - LABEL_GAP, 0, 1, [0.25, -0.97]));
	L.push(await S.clear('c_Tk', P.X(TAN_TO), P.Y(SLOPE * TAN_TO), 1, 1, [-0.6, -0.8]));

	S.checkAll(L);
	window[name + '-numbers'] = { qx, slope: SLOPE, edge: [acoustic(1), optical(1)] };
	return finish(S, L, [285, 345]);
}
