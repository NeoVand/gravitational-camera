// The tutorial, chapter 3.9 (tutorial/noise/positivity.md), its third diagram: the zeros of the shear above a thin
// layer, seen from above. The chapter's layer of three masses, 1.0, 0.7 and 1.4 units at 0.2 + 0.1i, -0.3 + 0.05i and
// 0.05 - 0.25i (dots in matter's colour, their areas in proportion to the masses); its centre of mass
// w_cm = 0.019 - 0.069i (a small cross); its long axis through the centre (dashed), at half the angle of the complex
// quadrupole Q_c; the two zeros of the rule w_cm +- i sqrt(Q_c / M), at 0.034 + 0.014i and 0.005 - 0.153i (open
// circles), on the dotted line through the centre across the long axis. Fainter, the same layer turned by 40 degrees
// about its centre, its long axis and its zeros, which the rule puts turned by the same 40 degrees; a curved arrow from
// the one long axis to the other shows the turn.
// Exact: every place, from the chapter's masses (asserted: w_cm, the zeros, Q_c = 0.021 - 0.0077i, the long axis at
// -10.0 degrees, the larger second moment's direction; the zeros on the line across it); the turned copy from the
// turned masses, its Q_c asserted to be e^{2i 40 deg} times the first and its zeros the first ones turned by 40
// degrees about w_cm; the true zeros of the exact shear at the heights 1, 3 and 10, found by Newton's method and
// asserted to lie 0.018, 0.0017 and 0.00015 from the rule's (not drawn). Schematic: the lengths of the two long axes
// and the arrow's radius, chosen for room.
import { INK, DIM, RULE } from '../lib.js';
import { Sheet, ORIGIN, finish, checker, near, placed, AXIS, HAIR, LABEL_GAP, n2 } from './tut-pot-lib.js';
import { Plot, xAxis, yAxis } from './tut-prob-lib.js';
import { MATTER } from './tut-null-lib.js';

const name = 'tut-pos-layer';
const check = checker(name);

// ---- complex numbers as pairs ---------------------------------------------------------------------------------------
const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const mul = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
const scale = (a, k) => [a[0] * k, a[1] * k];
const cis = (t) => [Math.cos(t), Math.sin(t)];
const abs = (a) => Math.hypot(a[0], a[1]);
const csqrt = (a) => { const r = Math.sqrt(abs(a)), t = Math.atan2(a[1], a[0]) / 2; return [r * Math.cos(t), r * Math.sin(t)]; };
const I = [0, 1];
const deg = (r) => (r * 180) / Math.PI;
const rad = (d) => (d * Math.PI) / 180;
const fmt = (a, k = 3) => `${a[0].toFixed(k)}${a[1] < 0 ? '-' : '+'}${Math.abs(a[1]).toFixed(k)}i`;

// ---- the mathematics ----------------------------------------------------------------------------------------------
export const LAYER = [{ m: 1.0, w: [0.2, 0.1] }, { m: 0.7, w: [-0.3, 0.05] }, { m: 1.4, w: [0.05, -0.25] }];
export const TURN = 40;                     // degrees

/** The centre, the complex quadrupole, the long axis's angle and the rule's two zeros of a layer. */
function rule(layer) {
	const M = layer.reduce((s, p) => s + p.m, 0);
	const cm = scale(layer.reduce((s, p) => add(s, scale(p.w, p.m)), [0, 0]), 1 / M);
	const Q = layer.reduce((s, p) => { const d = sub(p.w, cm); return add(s, scale(mul(d, d), p.m)); }, [0, 0]);
	const root = mul(I, csqrt(scale(Q, 1 / M)));
	return { M, cm, Q, beta: Math.atan2(Q[1], Q[0]) / 2, zeros: [add(cm, root), sub(cm, root)] };
}

/** The shear of the layer at w, from a height z, without the factor -3G: sum m (w - w')^2 / (|w - w'|^2 + z^2)^{5/2}. */
const shear = (layer, w, z) => layer.reduce((s, p) => { const d = sub(w, p.w); return add(s, scale(mul(d, d), p.m / (d[0] ** 2 + d[1] ** 2 + z * z) ** 2.5)); }, [0, 0]);

/** A zero of the exact shear near w, by Newton's method on the pair (Re s, Im s) with a numerical Jacobian. */
function trueZero(layer, w, z) {
	for (let it = 0; it < 60; it++) {
		const s = shear(layer, w, z), h = 1e-7;
		const sx = scale(sub(shear(layer, add(w, [h, 0]), z), s), 1 / h), sy = scale(sub(shear(layer, add(w, [0, h]), z), s), 1 / h);
		const det = sx[0] * sy[1] - sy[0] * sx[1];
		const step = [(s[0] * sy[1] - sy[0] * s[1]) / det, (sx[0] * s[1] - s[0] * sx[1]) / det];
		w = sub(w, step);
		if (abs(step) < 1e-14) break;
	}
	return w;
}

function mathematics() {
	const a = rule(LAYER);
	check(a.M === 3.1 || near(a.M, 3.1, 1e-12), 'the mass is not 3.1');
	check(fmt(a.cm) === '0.019-0.069i', `the centre ${fmt(a.cm)}`);
	check(fmt(a.Q, 4) === '0.0210-0.0077i', `Q_c = ${fmt(a.Q, 4)}`);
	const zs = a.zeros.map((z) => fmt(z)).sort();
	check(zs.join() === ['0.005-0.153i', '0.034+0.014i'].sort().join(), `the zeros ${zs}`);
	// the long axis is the direction of the larger second moment, and the zeros lie across it
	let xx = 0, yy = 0, xy = 0;
	for (const p of LAYER) { const d = sub(p.w, a.cm); xx += p.m * d[0] ** 2; yy += p.m * d[1] ** 2; xy += p.m * d[0] * d[1]; }
	const major = Math.atan2(2 * xy, xx - yy) / 2;
	check(near(major, a.beta, 1e-12) && xx - yy > 0, 'the long axis is not the larger second moment\'s direction');
	check(deg(a.beta).toFixed(1) === '-10.0', `the long axis at ${deg(a.beta)} degrees`);
	const along = cis(a.beta);
	for (const z of a.zeros) check(near(sub(z, a.cm)[0] * along[0] + sub(z, a.cm)[1] * along[1], 0, 1e-15), 'a zero is off the line across the long axis');
	// the layer turned by TURN degrees about its centre
	const e = cis(rad(TURN));
	const turned = LAYER.map((p) => ({ m: p.m, w: add(a.cm, mul(e, sub(p.w, a.cm))) }));
	const b = rule(turned);
	check(near(b.cm[0], a.cm[0], 1e-15) && near(b.cm[1], a.cm[1], 1e-15), 'the turn moves the centre');
	const e2 = mul(e, e), Qt = mul(e2, a.Q);
	check(near(b.Q[0], Qt[0], 1e-15) && near(b.Q[1], Qt[1], 1e-15), 'Q_c does not turn by e^{2 i beta}');
	// the zeros turn by the same angle (as a pair: the square root may swap them)
	const moved = a.zeros.map((z) => add(a.cm, mul(e, sub(z, a.cm))));
	const same = (p, q) => abs(sub(p[0], q[0])) + abs(sub(p[1], q[1]));
	check(Math.min(same(moved, b.zeros), same(moved, [b.zeros[1], b.zeros[0]])) < 1e-14, 'the zeros do not turn with the layer');
	// the true zeros of the exact shear lie 0.018, 0.0017 and 0.00015 from the rule's
	const err = [1, 3, 10].map((z) => Math.max(...a.zeros.map((w) => abs(sub(trueZero(LAYER, w, z), w)))));
	for (const [z, w0] of [[1, a.zeros[0]], [10, a.zeros[1]]]) check(abs(shear(LAYER, trueZero(LAYER, w0, z), z)) < 1e-12, `Newton's method did not converge at the height ${z}`);
	check(err[0].toFixed(3) === '0.018' && err[1].toFixed(4) === '0.0017' && err[2].toFixed(5) === '0.00015', `the errors ${err}`);
	return { a, b, turned, err };
}

// ---- the drawing (points) -----------------------------------------------------------------------------------------
const U = 330;                    // points per unit of length on the plane
const BOX = { x: [-0.38, 0.46], y: [-0.31, 0.22] };   // the plot's data window
const R1 = 3.5;                   // the radius of a dot of mass 1: radius proportional to sqrt(m)
const RING = 2.3, RING_W = 0.6;   // a zero's circle
const CROSS = 2.6;                // the centre's cross, half an arm
const AX = 0.38;                  // the long axes' half-length, units
const ACROSS = 0.13;              // the line across: this far from the centre, units
const DASH = [2.2, 1.6];
const CLEAR = 4.6;                // points: the long axes stop this far from the centre
const COPY = 0.38;                // the turned copy's dots: matter's colour at this opacity
const ARROW_W = 0.5, ARROW_HEAD = 3.6;

export default async function () {
	const { a, b, turned, err } = mathematics();
	const S = new Sheet(name);
	const L = [];
	const P = new Plot({ left: ORIGIN - (U * (BOX.x[1] - BOX.x[0])) / 2, top: ORIGIN - (U * (BOX.y[1] - BOX.y[0])) / 2, w: U * (BOX.x[1] - BOX.x[0]), h: U * (BOX.y[1] - BOX.y[0]), x0: BOX.x[0], x1: BOX.x[1], y0: BOX.y[0], y1: BOX.y[1] });
	const at = (w) => P.at(w[0], w[1]);
	check(near(P.w / (P.x1 - P.x0), P.h / (P.y1 - P.y0), 1e-9), 'the plane is not drawn to one scale');
	const ringMark = (c, what) => S.mark([c], RING + RING_W / 2, what);

	// ---- the axes, at the left and the bottom
	const ticks = [-0.2, 0, 0.2, 0.4];
	const num = (t) => (t === 0 ? '0' : t < 0 ? `-${(-t).toFixed(1)}` : t.toFixed(1));
	L.push(...(await xAxis(S, P, { ticks, fmt: num, what: 'the x axis' })));
	L.push(...(await yAxis(S, P, { ticks: [-0.2, 0, 0.2], fmt: num, what: 'the y axis' })));
	L.push(await placed('x', P.right + 4, P.bottom, 0, 0.5, DIM));
	L.push(await placed('y', P.left, P.top - 4, 0.5, 1, DIM));

	// ---- a layer: its long axis (dashed), the line across it through the zeros (dotted), the zeros, the dots
	const draw = (r, layer, faint) => {
		const c = at(r.cm);
		const ends = [-1, 1].map((s) => at(add(r.cm, scale(cis(r.beta), s * AX))));
		// in two halves, each from its outer end inward, stopping short of the centre so that the cross stands clear
		for (const e of ends) {
			const k = abs(sub(e, c)), inner = add(c, scale(sub(e, c), CLEAR / k));
			S.path([e, inner], { color: faint ? RULE : DIM, width: AXIS, dash: DASH, cap: 'butt', layer: 1, what: faint ? 'the turned long axis' : 'the long axis' });
		}
		if (!faint) {
			// the line across, in two pieces that stop short of the cross and of the circles
			const across = cis(r.beta + Math.PI / 2);
			for (const s of [1, -1]) {
				const z = r.zeros.find((q) => (sub(q, r.cm)[0] * across[0] + sub(q, r.cm)[1] * across[1]) * s > 0);
				const far = at(add(r.cm, scale(across, s * ACROSS)));
				S.dots(c, at(z), { color: DIM, clear0: CROSS + 1.4, clear1: RING + 1.3, what: 'the line across' });
				S.dots(at(z), far, { color: DIM, clear0: RING + 1.3, clear1: 0, what: 'the line across' });
			}
		}
		for (const z of r.zeros) {
			const q = at(z);
			S.raw(`<circle cx="${n2(q[0])}" cy="${n2(q[1])}" r="${RING}" fill="none" stroke="${faint ? RULE : INK}" stroke-width="${RING_W}"/>`, 3);
			ringMark(q, faint ? 'a turned zero' : 'a zero');
		}
		for (const p of layer) {
			const q = at(p.w), rr = R1 * Math.sqrt(p.m);
			S.raw(`<circle cx="${n2(q[0])}" cy="${n2(q[1])}" r="${n2(rr)}" fill="${MATTER}"${faint ? ` fill-opacity="${COPY}"` : ''}/>`, faint ? 2 : 4);
			S.mark([q], rr, faint ? 'a turned mass' : `the mass ${p.m}`);
		}
		return { c, ends };
	};
	const t = draw(b, turned, true);
	const o = draw(a, LAYER, false);
	// the centre's cross
	S.path([[o.c[0] - CROSS, o.c[1]], [o.c[0] + CROSS, o.c[1]]], { color: INK, width: 0.6, cap: 'butt', layer: 5, what: 'the cross' });
	S.path([[o.c[0], o.c[1] - CROSS], [o.c[0], o.c[1] + CROSS]], { color: INK, width: 0.6, cap: 'butt', layer: 5, what: 'the cross' });

	// ---- the turn: an arc about the centre from the long axis's right end to the turned one's, with a head at its end
	const r0 = AX * U, a0 = -a.beta, a1 = -(a.beta + rad(TURN));          // page angles (y down)
	const arcAt = (th) => [o.c[0] + r0 * Math.cos(th), o.c[1] + r0 * Math.sin(th)];
	const len = r0 * (Math.abs(a1 - a0) - 2 * 1.6 / r0), head = Math.min(ARROW_HEAD, 0.4 * len);
	const gap0 = 1.6 / r0;                                                // the arc stands just clear of both dashed axes' ends
	const stop = a1 + gap0 + (0.8 * head) / r0;                           // the shaft ends inside the head
	const nArc = Math.ceil((r0 * Math.abs(stop - a0)) / 0.25);
	const arc = Array.from({ length: nArc + 1 }, (_, k) => arcAt(a0 - gap0 + ((stop - a0 + gap0) * k) / nArc));
	S.path(arc, { color: DIM, width: ARROW_W, layer: 2, what: 'the turn' });
	const tip = arcAt(a1 + gap0), base = arcAt(a1 + gap0 + head / r0);
	const u = [(tip[0] - base[0]) / abs(sub(tip, base)), (tip[1] - base[1]) / abs(sub(tip, base))], w = [-u[1], u[0]];
	const hl = abs(sub(tip, base)), hw = 0.36 * hl, b0 = sub(tip, scale(u, hl));
	const tri = [tip, add(b0, scale(w, hw)), sub(b0, scale(w, hw))];
	S.raw(`<path d="M${tri.map((p) => `${n2(p[0])},${n2(p[1])}`).join('L')}Z" fill="${DIM}"/>`, 2);
	S.mark([...tri, tri[0]], 0, 'the turn\'s head');
	check(head <= 0.4 * len + 1e-9, 'the turn\'s head is longer than two fifths of the arc');
	check(near(abs(sub(t.ends[1], o.c)), r0, 1e-9) && near(abs(sub(tip, t.ends[1])), 2 * r0 * Math.sin(gap0 / 2), 1e-9), 'the arc does not end at the turned axis');
	const mid = (a0 + a1) / 2;
	L.push(await S.clear(`${TURN}^\\circ`, o.c[0] + (r0 + LABEL_GAP + 1) * Math.cos(mid), o.c[1] + (r0 + LABEL_GAP + 1) * Math.sin(mid), 0, 0.5, [Math.cos(mid), Math.sin(mid)], { color: DIM }));

	// ---- the labels: the masses beside their dots, away from the centre; the centre beside its cross
	for (const p of LAYER) {
		const q = at(p.w), d = sub(q, o.c), k = abs(d), dir = [d[0] / k, d[1] / k];
		const rr = R1 * Math.sqrt(p.m) + LABEL_GAP + 0.4;
		L.push(await S.clear(p.m.toFixed(1), q[0] + dir[0] * rr, q[1] + dir[1] * rr, dir[0] < 0 ? 1 : 0, dir[1] < 0 ? 1 : 0, dir, { color: MATTER }));
	}
	const up = [-Math.SQRT1_2, -Math.SQRT1_2];
	L.push(await S.clear('w_{\\rm cm}', o.c[0] - CROSS - 1, o.c[1] - CROSS - 1, 1, 1, up, { color: INK }));

	S.checkAll(L);
	window.tutPosLayer = { cm: a.cm, zeros: a.zeros, beta: deg(a.beta), err };
	return finish(S, L, [240, 340]);
}
