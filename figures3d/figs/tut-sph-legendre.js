// The tutorial, section 2.2 (tutorial/outside/spherical-harmonics.md), its second diagram: the Legendre polynomials
// P_0 to P_4 against mu from -1 to 1 on one pair of axes, each labelled near its right end, where all equal 1; the
// zero of P_2 at mu = 1/sqrt 3 marked with a tick on the mu axis, a dot on the line P = 0, and the angle 54.7 degrees.
// Exact: every curve, from Bonnet's recurrence l P_l = (2l - 1) mu P_(l-1) - (l - 1) P_(l-2) (the recurrence of the
// chapter's live figure, app/src/lib/tutorial/live/sky-patterns.ts), checked against the chapter's closed forms of
// P_0 to P_3 and the closed form of P_4, sampled every quarter of a point along its length; P_l(1) = 1 and
// P_l(-1) = (-1)^l; the zero of P_2 at mu = 1/sqrt 3, the angle arccos(1/sqrt 3) = 54.7 degrees, and the chapter's
// check at theta = 0.9, where 1 - 3 cos^2 theta = -2 P_2(cos theta) = -0.159. Nothing is schematic.
import { INK, DIM, FAINT, RULE, ACCENT } from '../lib.js';
import { Sheet, ORIGIN, placed, finish, checker, near, AXIS, HAIR, TICK, LABEL_GAP, n2 } from './tut-pot-lib.js';

// ---- the mathematics --------------------------------------------------------------------------------------------
export const TOP = 4;                            // P_0 to P_4
/** P_0(mu) ... P_L(mu), by Bonnet's recurrence. */
export function legendreList(L, mu) {
	const p = [1, mu];
	for (let l = 2; l <= L; l++) p[l] = ((2 * l - 1) * mu * p[l - 1] - (l - 1) * p[l - 2]) / l;
	return p.slice(0, L + 1);
}
export const P = (l, mu) => legendreList(Math.max(l, 1), mu)[l];
export const dP = (l, mu, h = 1e-6) => (P(l, mu + h) - P(l, mu - h)) / (2 * h);
const closed = [() => 1, (m) => m, (m) => (3 * m * m - 1) / 2, (m) => (5 * m ** 3 - 3 * m) / 2, (m) => (35 * m ** 4 - 30 * m * m + 3) / 8];

// ---- the drawing (points) ---------------------------------------------------------------------------------------
const SX = 112;                                  // points per unit of mu
const SY = 64;                                   // points per unit of P
const CURVE = 0.6;                               // the curves' stroke
const DROP = 0.16;                               // the mu axis lies this far below P = -1, in units of P
const LEFT = 0.07;                               // the P axis lies this far left of mu = -1, in units of mu
const DOT_R = 1.2;
const name = 'tut-sph-legendre';
const check = checker(name);

export default async function () {
	// ---- the numbers and forms the chapter prints
	for (let l = 0; l <= TOP; l++) {
		for (let k = 0; k <= 200; k++) {
			const m = -1 + k / 100;
			check(near(P(l, m), closed[l](m), 1e-12), `P_${l} from the recurrence is not its closed form at ${m}`);
		}
		check(near(P(l, 1), 1, 1e-15) && near(P(l, -1), (-1) ** l, 1e-15), `P_${l} does not reach 1 at mu = 1 and (-1)^l at -1`);
	}
	const zero = 1 / Math.sqrt(3);
	check(near(P(2, zero), 0, 1e-15), 'P_2 is not zero at 1/sqrt 3');
	const angle = (Math.acos(zero) * 180) / Math.PI;
	check(angle.toFixed(1) === '54.7', `the zero of P_2 is at ${angle} degrees, not 54.7`);
	const c = Math.cos(0.9);
	check((1 - 3 * c * c).toFixed(3) === '-0.159' && near(1 - 3 * c * c, -2 * P(2, c), 1e-15), 'the check at theta = 0.9 fails');

	const S = new Sheet(name);
	const X0 = ORIGIN, Y0 = ORIGIN;                  // mu = 0, P = 0 on the page
	const at = (mu, p) => [X0 + SX * mu, Y0 - SY * p];
	const order = [0, 1, 3, 4, 2];                   // P_2, the subject, drawn last, over the others

	// ---- the line P = 0, a pale hairline across, for the zeros
	S.path([at(-1, 0), at(1, 0)], { color: RULE, width: HAIR, layer: 0, cap: 'butt', what: 'the line P = 0' });

	// ---- the curves: each one path, points a quarter of a point apart along it
	for (const l of order) {
		const pts = [at(-1, P(l, -1))];
		let mu = -1;
		while (mu < 1) {
			// a step a quarter of a point long by the slope, halved until the chord is no longer than that
			let next = Math.min(1, mu + 0.25 / Math.hypot(SX, SY * dP(l, mu)));
			const here = at(mu, P(l, mu));
			while (Math.hypot(at(next, P(l, next))[0] - here[0], at(next, P(l, next))[1] - here[1]) > 0.25) next = (mu + next) / 2;
			mu = next;
			pts.push(at(mu, P(l, mu)));
		}
		for (let i = 1; i < pts.length; i++) check(Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]) <= 0.2501, `P_${l} is sampled too coarsely`);
		S.path(pts, { color: l === 2 ? ACCENT : INK, width: CURVE, layer: l === 2 ? 3 : 2, what: `P_${l}` });
	}

	// ---- the axes: mu at the bottom, ticks at -1, 0 and 1 and at the zero of P_2; P at the left, ticks at -1, 0, 1
	const yAxis = -1 - DROP, xAxis = -1 - LEFT;
	S.path([at(xAxis, yAxis), at(1, yAxis)], { color: DIM, width: AXIS, layer: 1, cap: 'butt', what: 'the mu axis' });
	S.path([at(xAxis, yAxis), at(xAxis, 1)], { color: DIM, width: AXIS, layer: 1, cap: 'butt', what: 'the P axis' });
	const labels = [];
	for (const m of [-1, 0, 1]) {
		const [x, y] = at(m, yAxis);
		S.path([[x, y], [x, y + TICK]], { color: DIM, width: HAIR, layer: 1, cap: 'butt', what: `the tick at mu = ${m}` });
		labels.push(await placed(m < 0 ? '-1' : `${m}`, x, y + TICK + 2.4, 0.5, 0, DIM));
	}
	for (const p of [-1, 0, 1]) {
		const [x, y] = at(xAxis, p);
		S.path([[x, y], [x - TICK, y]], { color: DIM, width: HAIR, layer: 1, cap: 'butt', what: `the tick at P = ${p}` });
		labels.push(await placed(p < 0 ? '-1' : `${p}`, x - TICK - 2.4, y, 1, 0.5, DIM));
	}
	// the axis's name at its right end, on the line of the numbers
	const one = labels[2];
	labels.push(await placed('\\mu', at(1, 0)[0] + 9, (one.box.t + one.box.b) / 2, 0, 0.5, DIM));

	// ---- the zero of P_2: a dot on the line P = 0, dots down to the axis, a tick there with 1/sqrt 3, and the angle
	const Z = at(zero, 0), T = at(zero, yAxis);
	S.raw(`<circle cx="${n2(Z[0])}" cy="${n2(Z[1])}" r="${DOT_R}" fill="${ACCENT}"/>`, 5);
	S.mark([Z], DOT_R, 'the zero of P_2');
	S.dots(Z, T, { color: FAINT, clear0: DOT_R + 1.4, clear1: 0.4, layer: 0, what: 'the line to 1/sqrt 3' });
	S.path([T, [T[0], T[1] + TICK]], { color: ACCENT, width: HAIR, layer: 1, cap: 'butt', what: 'the tick at 1/sqrt 3' });
	labels.push(await placed('1/\\sqrt3', T[0], T[1] + TICK + 2.4, 0.5, 0, ACCENT));
	const root = labels[labels.length - 1];
	labels.push(await placed(`\\vartheta = ${angle.toFixed(1)}^\\circ`, T[0], root.box.b + 2.6, 0.5, 0, ACCENT));

	// ---- the curves' names, near their right ends, where they part: each set beside its curve at the given mu (a
	// trough for P_3), on the side where nothing else runs, then moved away from it by the least distance that clears
	// every mark
	const names = [
		[0, 0.8, [0, -1], 0.5, 1],
		[1, 0.5, [-0.6, -0.8], 1, 1],
		[2, 0.84, [-1, 0.25], 1, 0.5],
		[3, Math.sqrt(1 / 5), [0, 1], 0.5, 0],
		[4, 0.94, [1, 0.2], 0, 0.5]
	];
	for (const [l, mu, dir, ax, ay] of names) {
		const [x, y] = at(mu, P(l, mu));
		const d = Math.hypot(...dir);
		labels.push(await S.clear(`P_${l}`, x, y, ax, ay, [dir[0] / d, dir[1] / d], { color: l === 2 ? ACCENT : INK }));
	}
	check(near(dP(3, Math.sqrt(1 / 5)), 0, 1e-6), 'the label of P_3 is not at its trough');

	S.checkAll(labels);
	void LABEL_GAP;
	window.tutSphLegendre = { zero, angle };
	return finish(S, labels, [240, 320]);
}
