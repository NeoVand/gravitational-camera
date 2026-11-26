// The tutorial, section 4.3 (tutorial/response/elastic-bodies.md), its third diagram: Appendix A's trial shape and
// the notes it bounds. Left, a meridian section of the steel ball (the circle of radius R over a pale tint, z up),
// with short arrows of the displacement u = (q/R)(-x/2, z) in that section, from the points of a square grid
// inside it: orange where the arrow has an outward part (the bit moves away from the centre), blue where it has an
// inward part. Over it, dashed, the ball's surface at the two ends of a swing, r = R(1 + 0.15 P2(cos theta)), taller,
// "+q", and r = R(1 - 0.15 P2(cos theta)), flatter, "-q". Right, a vertical frequency axis from 0 to 16 kHz with
// three notes: Rayleigh's bound 15.1 kHz, Lamb's exact 12.6 kHz and, in grey, the twist at 11.9 kHz, which moves no
// mass; a small arrow down from the bound to the exact note, "the true note lies below".
// The diagram comment asked for orange "where the arrow points away from the equatorial plane" and blue "where it
// points toward the axis"; but every arrow off the axes does both at once (u_z has the sign of z and u_x the sign of
// -x), so the colours are given here by the sign of the outward part u . x = (q/R)(z^2 - x^2/2), the paper's orange
// stretch and blue squeeze: orange within 54.7 degrees of the axis (P2 > 0), where the surface rises at +q, and blue
// nearer the equator, where it sinks.
// Exact: the arrows, u at each grid point at one scale (asserted), and their colours (the sign of u . x, asserted to
// change where P2(cos theta) does); the outlines, the surface r = R + q P2 of the chapter's Paper problem, which is the
// outward part of u on the sphere (tut-elastic-lib.js, `chapter`), at q = +-0.15 R; the notes, sqrt(10) c_T / R and
// Lamb's omega R / c_T = 2.645 and the twist's 2.50, the roots of the free sphere's frequency equations for
// c_L / c_T = 1.84 (the same file), at c_T = 3000 m/s and R = 10 cm, placed on the axis at their values (asserted).
// Schematic: the outlines' exaggeration 0.15 and the arrows' scale; arrows shorter than MIN points, near the centre,
// are left out.
import { Panel, v3, INK, DIM, ACCENT, ACCENT2 } from '../lib.js';
import { Sheet, ORIGIN, finish, checker, near, placed, AXIS, AXIS_HEAD, HAIR } from './tut-vec-lib.js';
import { UNDISTURBED, UNDISTURBED_W, PUSH, PUSH_HEAD, gnomon } from './tut-five-lib.js';
import { TINT, EDGE } from './tut-gauss-lib.js';
import { chapter, trial, P2, ETA_RAYLEIGH, ETA_LAMB, ETA_TWIST, kHz } from './tut-elastic-lib.js';

const name = 'tut-elastic-trial';
const check = checker(name);

const R = 62;                             // the ball's radius, points
const EPS = 0.15;                         // the outlines' q / R
const H = 0.2 * R;                        // the grid's step: 9 points across the diameter, from -0.8 R to 0.8 R
const KAPPA = 0.21;                       // an arrow's length per point of (-x/2, z)
const MIN = 3.2;                          // the shortest arrow drawn, points
const CLEAR = 1.6;                        // the least air between an arrow and an outline
const AX = R * (1 + EPS / 2) + 26;        // the frequency axis's x, from the ball's centre
const PER_KHZ = 11;                       // points per kHz
const F0 = -88;                           // the axis's 0, points from the ball's centre (y up)
const TOP = 16;                           // kHz
const TICK = 9;                           // a note's tick, from the axis to the right
const CROSS = 1.8;                        // no dash of an outline this near a crossing of the three curves
const GAP = 3;                            // from a tick's end to its label

export default async function () {
	const nums = chapter(check);
	const P = new Panel({ x: ORIGIN, y: ORIGIN, w: 0, h: 0, scale: 1, cx: 85 });
	const ink = new Sheet(P, name);
	const L = [];
	const raw = (svg, layer) => P.items.push({ kind: 'raw', layer, depth: 0, svg });

	// ---- the section: the circle of radius R over a tint
	const N = 720;
	const loop = (r) => Array.from({ length: N + 1 }, (_, k) => { const t = (2 * Math.PI * k) / N; return v3(r(t) * Math.sin(t), r(t) * Math.cos(t), 0); });
	const circle = loop(() => R);
	P.polygon(circle, { fill: TINT, layer: -2 });
	ink.curve(circle, { color: INK, width: EDGE, layer: 1, what: 'the ball' });

	// ---- the outlines at +-q: r = R (1 +- 0.15 P2(cos theta)), theta from the z axis; dashed, whole dashes
	const outlines = [1, -1].map((s) => {
		const rr = (t) => R * (1 + s * EPS * P2(Math.cos(t)));
		const pts = loop(rr);
		// the curve is the chapter's surface R + q P2 at q = s 0.15 R: the outward part of u on the sphere
		for (let t = 0; t < Math.PI; t += 0.1) {
			const p = [R * Math.sin(t), 0, R * Math.cos(t)], u = trial(p, s * EPS * R, R);
			check(near(R + (u[0] * p[0] + u[2] * p[2]) / R, rr(t), 1e-9), 'an outline is not R + q P2');
		}
		const F = pts.map((p) => ink.at(p));
		let len = 0;
		for (let i = 1; i < F.length; i++) len += Math.hypot(F[i][0] - F[i - 1][0], F[i][1] - F[i - 1][1]);
		// an even number of dashes, one centred on each pole, so that the pattern is the same at the four points where
		// both outlines cross the circle (P2 = 0); the dashes that would reach within CROSS points of those are left
		// out, so that the three curves cross in clear air rather than in a knot of ink
		const n = 2 * Math.round(len / (UNDISTURBED[0] + UNDISTURBED[1]) / 2), period = len / n, on = (UNDISTURBED[0] * period) / (UNDISTURBED[0] + UNDISTURBED[1]);
		const cum = [0];
		for (let i = 1; i < F.length; i++) cum.push(cum[i - 1] + Math.hypot(F[i][0] - F[i - 1][0], F[i][1] - F[i - 1][1]));
		const atS = (x) => {
			x = ((x % len) + len) % len;
			let i = 1;
			while (i < cum.length - 1 && cum[i] < x) i++;
			const f = (x - cum[i - 1]) / (cum[i] - cum[i - 1] || 1);
			return [F[i - 1][0] + f * (F[i][0] - F[i - 1][0]), F[i - 1][1] + f * (F[i][1] - F[i - 1][1])];
		};
		const t0 = Math.acos(1 / Math.sqrt(3));
		check(near(P2(Math.cos(t0)), 0, 1e-15) && near(rr(t0), R, 1e-12), 'the outlines do not cross the circle where P2 = 0');
		const cross = [t0, Math.PI - t0, Math.PI + t0, 2 * Math.PI - t0].map((t) => ink.at(v3(R * Math.sin(t), R * Math.cos(t), 0)));
		let d = '', dropped = 0;
		for (let k = 0; k < n; k++) {
			const seg = Array.from({ length: 9 }, (_, j) => atS(k * period - on / 2 + (on * j) / 8));
			if (seg.some((q) => cross.some((c) => Math.hypot(q[0] - c[0], q[1] - c[1]) < CROSS))) { dropped++; continue; }
			d += 'M' + seg.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join('L');
		}
		check(dropped <= 8, 'too many dashes left out at the crossings');
		raw(`<path d="${d}" fill="none" stroke="${DIM}" stroke-width="${UNDISTURBED_W}" stroke-linecap="butt"/>`, 0.5);
		ink.mark(F, UNDISTURBED_W / 2, `the outline at ${s > 0 ? '+' : '-'}q`);
		return { s, rr, F };
	});
	check(near(outlines[0].rr(0), 1.15 * R, 1e-12) && near(outlines[1].rr(Math.PI / 2), 1.075 * R, 1e-12), 'the outlines\' poles and equators');

	// ---- the arrows: u at the grid's points, at one scale, clear of the outlines and the circle
	const segDist = (q, a, b) => {
		const d = [b[0] - a[0], b[1] - a[1]], l2 = d[0] ** 2 + d[1] ** 2;
		const t = Math.max(0, Math.min(1, ((q[0] - a[0]) * d[0] + (q[1] - a[1]) * d[1]) / l2));
		return Math.hypot(q[0] - a[0] - t * d[0], q[1] - a[1] - t * d[1]);
	};
	const curves = [circle.map((p) => ink.at(p)), ...outlines.map((o) => o.F)];
	const drawn = [];
	for (let i = -4; i <= 4; i++) for (let j = -4; j <= 4; j++) {
		const x = i * H, z = j * H;
		const u = trial([x, 0, z], 1, 1);                    // (-x/2, 0, z) per unit q/R
		const a = v3(x, z, 0), b = v3(x + KAPPA * u[0], z + KAPPA * u[2], 0);
		const len = a.distanceTo(b);
		if (len < MIN) continue;
		const A = ink.at(a), B = ink.at(b);
		const hw = 0.36 * Math.min(PUSH_HEAD, 0.4 * len);
		const near0 = Math.min(...curves.map((c) => Math.min(...c.slice(1).map((p, k) => segDist(p, A, B)))));
		const endIn = Math.hypot(b.x, b.y) < R && Math.hypot(x, z) < R;
		if (!endIn || near0 < CLEAR + hw) continue;
		const outward = u[0] * x + u[2] * z > 0;
		check(outward === (P2(z / Math.hypot(x, z)) > 0), `the arrow at ${i}, ${j}: its colour does not follow P2`);
		const ar = ink.arrow(a, b, { color: outward ? ACCENT : ACCENT2, width: PUSH, head: PUSH_HEAD, layer: 3, what: `the arrow at ${i}, ${j}` });
		check(near(ar.L, KAPPA * Math.hypot(x / 2, z), 1e-9), 'an arrow is not at the common scale');
		drawn.push({ i, j, outward, L: ar.L });
	}
	check(drawn.some((d) => d.outward) && drawn.some((d) => !d.outward), 'the arrows are of one colour');

	// ---- the axes of the section, a small gnomon at its lower left
	const g0 = v3(-R * 1.02, -R * 1.02, 0);
	const [gx, gz] = gnomon(ink, g0, [{ d: v3(1, 0, 0), color: DIM, tex: 'x' }, { d: v3(0, 1, 0), color: DIM, tex: 'z' }], 15, { what: 'the section\'s axes' });
	L.push(await ink.label('x', ink.at(gx), [1, 0], 2.2, DIM));
	L.push(await ink.label('z', ink.at(gz), [0, -1], 2.2, DIM));

	// ---- the outlines' labels: +q above the taller's pole, -q beside the flatter's equator
	L.push(await ink.label('+q', ink.at(v3(0, outlines[0].rr(0), 0)), [0, -1], 2.2, DIM));
	L.push(await ink.label('-q', ink.at(v3(outlines[1].rr(Math.PI / 2), 0, 0)), [1, 0], 2.2, DIM));

	// ---- the frequency axis, 0 to 16 kHz, and the three notes
	const y = (f) => F0 + PER_KHZ * f;
	ink.arrow(v3(AX, y(0), 0), v3(AX, y(TOP), 0), { color: DIM, width: AXIS, head: AXIS_HEAD, layer: 1, what: 'the frequency axis' });
	L.push(await ink.label('f', ink.at(v3(AX, y(TOP), 0)), [0, -1], 2.2, DIM));
	const notes = [
		{ f: nums.rayleigh, src: '\\text{Rayleigh\'s bound, 15.1 kHz}', color: INK, shift: 0 },
		{ f: nums.lamb, src: '\\text{Lamb, exact, 12.6 kHz}', color: INK, shift: -1 },
		{ f: nums.twist, src: '\\text{twist, 11.9 kHz (moves no mass)}', color: DIM, shift: 1 },
		{ f: 0, src: '0', color: DIM, shift: 0 }
	];
	check(near(nums.rayleigh, kHz(ETA_RAYLEIGH), 0) && near(nums.lamb, kHz(ETA_LAMB), 0) && near(nums.twist, kHz(ETA_TWIST), 0), 'the notes');
	const probes = [];
	for (const n of notes) {
		ink.line(v3(AX, y(n.f), 0), v3(AX + TICK, y(n.f), 0), { color: n.color, width: n.f ? 0.6 : HAIR, layer: 1, what: `the tick at ${n.f}` });
		check(near(ink.at(v3(AX, y(n.f), 0))[1], ORIGIN - F0 - PER_KHZ * n.f, 1e-9) && near(ink.at(v3(AX, y(TOP), 0))[1] - ink.at(v3(AX, y(0), 0))[1], -PER_KHZ * TOP, 1e-9), `the tick at ${n.f} is not at its value`);
		probes.push(await placed(n.src, 0, 0, 0, 0.5, n.color));
	}
	// Lamb's label lifted and the twist's lowered, by the least that parts them by 2.4 points
	const [, yLamb] = ink.at(v3(AX, y(nums.lamb), 0)), [, yTwist] = ink.at(v3(AX, y(nums.twist), 0));
	const hL = probes[1].box.b - probes[1].box.t, hT = probes[2].box.b - probes[2].box.t;
	const delta = Math.max(0, (hL / 2 + hT / 2 + 2.4 - (yTwist - yLamb)) / 2);
	const lx = ink.at(v3(AX + TICK + GAP, 0, 0))[0];
	for (const [k, n] of notes.entries()) {
		const [, ty] = ink.at(v3(AX, y(n.f), 0));
		L.push(await placed(n.src, lx, ty + n.shift * delta, 0, 0.5, n.color));
	}
	// the arrow down from the bound to the exact note, and its words, between their labels
	const ax = AX + TICK / 2;
	const down = ink.arrow(v3(ax, y(nums.rayleigh) - 1.6, 0), v3(ax, y(nums.lamb) + 1.6, 0), { color: INK, width: PUSH, head: PUSH_HEAD, layer: 2, what: 'the arrow down' });
	check(down.u[1] > 0.999, 'the arrow does not point down');
	const yR = ink.at(v3(AX, y(nums.rayleigh), 0))[1];
	const top = L[L.length - 4].box.b, bottom = L[L.length - 3].box.t;
	check(near(yR, (L[L.length - 4].box.t + L[L.length - 4].box.b) / 2, 1e-6), 'Rayleigh\'s label is not on its tick');
	L.push(await placed('\\text{the true note lies below}', lx, (top + bottom) / 2, 0, 0.5, DIM));

	ink.checkAll(L);
	window[name + '-numbers'] = { ...nums, arrows: drawn.length, delta };
	return finish(name, P, L, [240, 340]);
}
