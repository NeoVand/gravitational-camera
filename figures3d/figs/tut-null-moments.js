// The tutorial, chapter 2.5 (tutorial/outside/null-space.md), its fourth diagram: the gold's share of the moment of
// inertia, I_x = (2/3) int rho r^2 dV + int rho (r^2/3 - x^2) dV, for a nugget at s = R/2, its flush and its skin, in
// units of m R^2. One bar for each body, in matter's colour, its height I_x: 0.25, 0.483 and 0.75. Each bar is two
// segments: a darker lower one of the same height in all three, 0.083, the harmonic part of I_x, which the three
// share; and above it (2/3) int rho r^2 dV, with int rho r^2 dV = 0.25, 0.6 and 1, the part the outside cannot read.
// Under each bar a small picture of its body, the steel ball cut open as in chapter 2.4's figs/tut-grn-kelvin.js: the
// nugget, the flush shaded in steps that double (1, 2, 4, 8, 16 and 32 m / 4 pi R^3, as the paper's fig:same-outside)
// and the skin shaded in steps that double (0.125 to 4 m / 4 pi R^2, as chapter 2.4's).
// Exact: int rho r^2 dV for the three (s^2, (3/5) R^2 and R^2, the flush's by numerical integration of its closed form
// over the ball, asserted), the shared part s^2/3 (asserted, and for the flush by numerical integration of
// rho (r^2/3 - x^2)), the bars' heights to one scale (asserted in points), the printed values (asserted), the flush's
// and the skin's steps (the flush's from its closed form, each region bounded along rays from the near pole, along
// which the flush is asserted to fall). Schematic: the nugget's size and the skin's band, as in chapter 2.4.
// Pictorial: the stone, as there.
import { INK, DIM } from '../lib.js';
import { Sheet, ORIGIN, placed, finish, checker, near, AXIS, LABEL_GAP, n2 } from './tut-pot-lib.js';
import { flush, skin, skinAngle, ballFace, stoneDefs, stone, rim, nugget, steps, MATTER } from './tut-null-lib.js';
import { circle as circlePath } from '../stone.js';

const name = 'tut-null-moments';
const check = checker(name);

export const S = 0.5;                             // the nugget's distance from the centre, in R
const BODIES = ['nugget', 'flush', 'skin'];
const SECOND = [0.25, 0.6, 1];                    // int rho r^2 dV, m R^2
const SHARED = '0.083';
const TOTAL = ['0.25', '0.483', '0.75'];
const SECOND_PRINTED = ['0.25', '0.6', '1'];

// ---- the drawing (points) ---------------------------------------------------------------------------------------
const PITCH = 92;                                 // from one bar to the next
const BAR = 30;                                   // a bar's width
const SCALE = 190;                                // points per m R^2
const ICON = 19;                                  // an icon's radius
const UPPER = 0.42;                               // the upper segment's opacity; the lower one is the full colour
const FLUSH_LEVELS = [1, 2, 4, 8, 16, 32];        // m / 4 pi R^3
const SKIN_LEVELS = [0.125, 0.25, 0.5, 1, 2, 4];  // m / 4 pi R^2
const BAND = 0.1, NUGGET = 0.15;                  // in R, as chapter 2.4

/** int over the ball of f(r, mu) dV, in units of R^3, by the midpoint rule in r and mu (the integrand round the axis). */
function overBall(f, nr = 400, nm = 400) {
	let sum = 0;
	for (let i = 0; i < nr; i++) {
		const r = (i + 0.5) / nr;
		for (let j = 0; j < nm; j++) sum += f(r, -1 + (2 * (j + 0.5)) / nm) * r * r;
	}
	return (2 * Math.PI * sum) / (nr * nm) * 2;
}

export default async function () {
	// ---- the numbers, the flush integrated over the ball (its density in units of m / 4 pi R^3)
	const rho = (r, mu) => flush(S, r, mu) / (4 * Math.PI);
	const mass = overBall(rho);
	const second = overBall((r, mu) => rho(r, mu) * r * r);
	// the harmonic integrand r^2/3 - x^2 with the nugget on z: averaged round the axis, x^2 is r^2 (1 - mu^2) / 2
	const harmonic = overBall((r, mu) => rho(r, mu) * (r * r / 3 - (r * r * (1 - mu * mu)) / 2));
	check(Math.abs(mass - 1) < 1e-4, `the flush's mass is ${mass}`);
	check(Math.abs(second - 0.6) < 1e-4, `the flush's int rho r^2 dV is ${second}`);
	check(Math.abs(harmonic - S * S / 3) < 1e-4, `the flush's harmonic part is ${harmonic}`);
	check(near(SECOND[0], S * S, 1e-15) && near(SECOND[1], 3 / 5, 1e-15) && near(SECOND[2], 1, 1e-15), 'int rho r^2 dV is not s^2, 3/5 R^2 and R^2');
	const shared = S * S / 3;
	check(shared.toFixed(3) === SHARED, `the shared part is ${shared}`);
	const totals = SECOND.map((v) => (2 / 3) * v + shared);
	totals.forEach((v, k) => check(v.toFixed(k === 1 ? 3 : 2) === TOTAL[k], `the moment of inertia of the ${BODIES[k]} is ${v}`));
	check(near(totals[0], 0.25, 1e-12) && near(totals[2], 0.75, 1e-12), 'the nugget and the skin are not 0.25 and 0.75');

	const Sh = new Sheet(name);
	const xs = [-1, 0, 1].map((k) => ORIGIN + k * PITCH);
	const Y0 = ORIGIN + 60;                                       // the baseline
	const L = [];

	// ---- the bars: the shared part, full colour, and above it two thirds of int rho r^2 dV, lighter
	for (const [k, x] of xs.entries()) {
		const yShared = Y0 - SCALE * shared, yTop = Y0 - SCALE * totals[k];
		check(near(Y0 - yTop, SCALE * ((2 / 3) * SECOND[k] + shared), 1e-9), 'a bar is not to scale');
		const rect = (t, b) => `M${n2(x - BAR / 2)},${n2(b)}V${n2(t)}H${n2(x + BAR / 2)}V${n2(b)}Z`;
		Sh.raw(`<path d="${rect(yShared, Y0)}" fill="${MATTER}"/>`, 1);
		Sh.raw(`<path d="${rect(yTop, yShared)}" fill="${MATTER}" fill-opacity="${UPPER}"/>`, 1);
		Sh.boxes.push({ box: { l: x - BAR / 2, r: x + BAR / 2, t: yTop, b: Y0 }, what: `the bar ${k}` });
		// the total above the bar; beside it, from the bottom: the shared part, and two thirds of the integral
		L.push(await placed(TOTAL[k], x, yTop - LABEL_GAP - 0.4, 0.5, 1, INK));
		L.push(await placed(SHARED, x + BAR / 2 + LABEL_GAP + 0.4, (Y0 + yShared) / 2, 0, 0.5, DIM));
		L.push(await placed(`\\tfrac23 \\times ${SECOND_PRINTED[k]}`, x + BAR / 2 + LABEL_GAP + 0.4, (yShared + yTop) / 2, 0, 0.5, DIM));
	}
	const left = xs[0] - BAR / 2 - 14, right = xs[2] + BAR / 2 + 14;
	Sh.path([[left, Y0], [right, Y0]], { color: DIM, width: AXIS, layer: 2, cap: 'butt', what: 'the baseline' });
	const yTitle = Y0 - SCALE * totals[2] - LABEL_GAP - 0.4;
	const title = await placed('I_x\\ (mR^2)', left, yTitle, 0, 1, INK);
	L.push(title);
	// the key, under the title: the two segments' shades and what they are
	const SW = 9, SH = 7, LEAD = 13;
	for (const [j, [opacity, src]] of [[1, '\\text{shared, harmonic}'], [UPPER, '\\tfrac23\\!\\int\\!\\rho\\,r^2\\,\\mathrm{d}V']].entries()) {
		const yk = title.box.b + 8 + j * LEAD;
		Sh.raw(`<path d="M${n2(left)},${n2(yk - SH / 2)}h${SW}v${SH}h${-SW}Z" fill="${MATTER}"${opacity < 1 ? ` fill-opacity="${opacity}"` : ''}/>`, 1);
		Sh.boxes.push({ box: { l: left, r: left + SW, t: yk - SH / 2, b: yk + SH / 2 }, what: `the key's swatch ${j}` });
		L.push(await placed(src, left + SW + LABEL_GAP + 0.6, yk, 0, 0.5, DIM));
	}

	// ---- the bodies, under their bars: the steel ball cut open, the nugget up
	const face = await ballFace();
	Sh.raw(stoneDefs(`${name}-face`, face, ICON), -1);
	const yc = Y0 + 7 + ICON;
	for (const [k, x] of xs.entries()) {
		Sh.raw(stone(`${name}-stone${k}`, `${name}-face`, x, yc, ICON), 0);
		Sh.boxes.push({ box: { l: x - ICON, r: x + ICON, t: yc - ICON, b: yc + ICON }, what: `the ${BODIES[k]}` });
	}
	// the nugget
	Sh.raw(nugget(`${name}-gold`, xs[0], yc - S * ICON, NUGGET * ICON), 1);
	// the flush: for each level, the region where the flush exceeds it, bounded along rays from the near pole
	const pole = [xs[1], yc - ICON];
	const RAYS = 160, STEPS = 600;
	const regions = FLUSH_LEVELS.map((level) => {
		const pts = [];
		for (let i = 0; i <= RAYS; i++) {
			const phi = -Math.PI / 2 + (Math.PI * i) / RAYS;              // from the pole, into the ball
			const u = [Math.sin(phi), Math.cos(phi)];                    // figure coordinates, y down
			const chord = 2 * Math.cos(phi);                              // in R
			let reach = chord, falling = true, prev = Infinity;
			for (let j = 1; j <= STEPS; j++) {
				const d = (chord * j) / STEPS;
				const p = [u[0] * d, 1 - u[1] * d];                        // in R, from the centre, y up, the pole at (0, 1)
				const r = Math.min(1, Math.hypot(p[0], p[1])), mu = r > 0 ? p[1] / Math.hypot(p[0], p[1]) : 1;
				const v = flush(S, r, mu);
				if (v > prev + 1e-9) falling = false;
				prev = v;
				if (v < level && reach === chord) reach = d;
			}
			check(falling || chord < 1e-6, `the flush does not fall along the ray at ${phi}`);
			pts.push([pole[0] + u[0] * reach * ICON, pole[1] + u[1] * reach * ICON]);
		}
		return 'M' + pts.map(([x, y]) => `${n2(x)},${n2(y)}`).join('L') + 'Z';
	});
	Sh.raw(`<clipPath id="${name}-flush"><path d="${circlePath(xs[1], yc, ICON)}"/></clipPath><g clip-path="url(#${name}-flush)">${steps(regions)}</g>`, 0.6);
	check(flush(S, 1, -1) < FLUSH_LEVELS[0] && flush(S, 1, 1) < 2 * FLUSH_LEVELS[FLUSH_LEVELS.length - 1], 'the flush runs past the steps');
	// the skin: a band along the inside of the sphere, in steps
	const C2 = [xs[2], yc];
	const p = (g, r) => [C2[0] + ICON * r * Math.sin(g), C2[1] - ICON * r * Math.cos(g)];
	const arc = (g0, g1, r) => Array.from({ length: 241 }, (_, i) => p(g0 + ((g1 - g0) * i) / 240, r));
	const d = (pts) => 'M' + pts.map(([x, y]) => `${n2(x)},${n2(y)}`).join('L') + 'Z';
	const bands = SKIN_LEVELS.map((v) => {
		const g = skinAngle(S, v);
		return g >= Math.PI - 1e-9 ? d(arc(0, 2 * Math.PI, 1)) + d(arc(0, 2 * Math.PI, 1 - BAND)) : d([...arc(-g, g, 1), ...arc(g, -g, 1 - BAND)]);
	});
	Sh.raw(steps(bands), 0.6);
	check(SKIN_LEVELS[0] < skin(S, Math.PI) && skin(S, 0) < 2 * SKIN_LEVELS[SKIN_LEVELS.length - 1], 'the skin runs past the steps');
	for (const x of xs) Sh.raw(rim(x, yc, ICON), 0.7);

	// ---- the names, under the bodies
	for (const [k, x] of xs.entries()) L.push(await placed(`\\text{${BODIES[k]}}`, x, yc + ICON + LABEL_GAP + 1.5, 0.5, 0, INK));

	Sh.checkAll(L);
	return finish(Sh, L, [240, 340]);
}
