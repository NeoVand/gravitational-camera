// The tutorial, chapter 4.6 (tutorial/response/fluctuation-dissipation.md), its opening figure: nothing pushes the warm
// ball, and still its tide a metre away trembles. Seen from the side, the ball and the distance to one scale. Left: the
// paper's steel ball of radius 10 cm (the body of chapter 4.1's tut-osc-hero), drawn at one end of the swing of its
// lowest quadrupole mode, longer along the horizontal axis: 4.3's trial shape u = (q/R)(-x/2, -y/2, z), z along the
// axis, for q = q_rms = 2.2 x 10^-16 m, the warm ball's root-mean-square swing at 300 K, exaggerated 10^14 times to 2.2
// cm, so that its semi-axes are 12.2 cm along the axis and 8.9 cm across it; the ball at rest as a thin dashed circle.
// Round it a haze of 300 small grey dots within 20 cm of its surface, the warm air. Right, its centre a metre from the
// ball's on the same axis: chapter 1.4's ring of twelve free steel beads, radius 10 cm, in the page's plane, drawn
// three times faintly overlaid as it trembles: stretched along the axis (its beads on an orange ellipse, 15% longer
// along the axis and, the tide being trace-free in the ring's plane as diag(-2, 1), 7.5% shorter across it), at rest
// (on a thin dashed circle) and squeezed along the axis (on a blue ellipse, 15% shorter along it and 7.5% longer
// across). No hand, hammer or push arrow; no text. Exact: the ball's outline, the image of its circle under the trial
// shape (every one of 24 points of the surface asserted on it), with q_rms from (1/2) K q^2 = (1/2) k_B T, K = 3 mu V /
// R^2 (figs/tut-osc-lib.js, `ball`, which also asserts the 15 kHz, the effective mass and the ring's table diag(-2, 1)
// on the axis); the ball, its haze and the metre to one scale; each ring the image of its circle under 1 - eps T with T
// = +-diag(-2, 1), eps = 0.075 (asserted 15% along the axis), its beads the images of their places. Schematic: the
// ring's strain (exaggerated far more than the ball's) and the haze (its dots' places, seeded, and their number).
// Pictorial: the stone, the picture of tut-osc-hero (design/prompts/hair-sprites.json, cut out by
// design/hair_sprites.py), mapped by the same linear map as the outline and clipped to the exact ellipse.
import { Panel, v3, sprite, INK, DIM, FAINT, ACCENT, ACCENT2 } from '../lib.js';
import { MARGIN } from '../stone.js';
import { Sheet, ORIGIN, finish, checker, near, n2 } from './tut-vec-lib.js';
import { UNDISTURBED, UNDISTURBED_W, STEEL } from './tut-five-lib.js';
import { STONE_INK } from './tut-orb-lib.js';
import { uniforms } from './tut-prob-lib.js';
import { ball, Q_RMS, R_BALL, BLOW_UP, trial } from './tut-osc-lib.js';

const name = 'tut-fd-hero';
const check = checker(name);

// ---- the drawing (world points, y up; one point per unit) -----------------------------------------------------
const R = 23;                             // the ball's radius, 10 cm
const PER_M = R / R_BALL;                 // points per metre, for the ball, the haze, the ring and the distance
const RIM = 0.35;
const SPRITE = '/figures3d/sprites/hair/ball.png';
const AIR = 0.2;                          // the haze: 20 cm from the surface
const HAZE = 300;
const SPECK = 0.55;                       // a dot of the haze, radius
const SPECK_GAP = 4.4;                    // the least distance between two dots' centres
const SPECK_CLEAR = 0.7;                  // the least air between a dot and the ball's rim or dashed outline
const R_RING = R_BALL * PER_M;            // the ring's radius, 10 cm to scale
const EPS = 0.075;                        // the ring's strain: 1 + 2 eps = 1.15 along the axis
const BEAD = 1.55;
const LINE = 0.55;                        // the ring's ellipses
const FAINT_BEAD = { stretch: 0.55, rest: 0.8, squeeze: 0.55 };

const ellipse = (cx, cy, a, b) => `M${n2(cx - a)},${n2(cy)}a${n2(a)},${n2(b)} 0 1,0 ${n2(2 * a)},0a${n2(a)},${n2(b)} 0 1,0 ${n2(-2 * a)},0Z`;

/** A circle of radius r at (X, Y), dashed in UNDISTURBED's pattern with a whole number of dashes, as SVG. */
function dashedCircle(X, Y, r, color) {
	const C = 2 * Math.PI * r, n = Math.round(C / (UNDISTURBED[0] + UNDISTURBED[1])), period = C / n, on = (UNDISTURBED[0] * period) / (UNDISTURBED[0] + UNDISTURBED[1]);
	return `<path d="M${n2(X + r)},${n2(Y)}a${n2(r)},${n2(r)} 0 1,1 ${n2(-2 * r)},0a${n2(r)},${n2(r)} 0 1,1 ${n2(2 * r)},0" fill="none" stroke="${color}" stroke-width="${UNDISTURBED_W}" stroke-dasharray="${on.toFixed(4)} ${(period - on).toFixed(4)}" stroke-dashoffset="${(on / 2).toFixed(4)}"/>`;
}

export default async function () {
	const nums = ball(check);
	const eps = (Q_RMS * BLOW_UP) / R_BALL;             // the drawn shape change, q / R
	check(eps.toFixed(3) === '0.217', `the drawn shape change is ${eps}`);
	check((Q_RMS * BLOW_UP * 100).toFixed(1) === '2.2', 'q_rms times 10^14 is not 2.2 cm');

	const P = new Panel({ x: ORIGIN, y: ORIGIN, w: 0, h: 0, scale: 1 });
	const ink = new Sheet(P, name);
	const raw = (svg, layer) => P.items.push({ kind: 'raw', layer, depth: 0, svg });
	const art = await sprite(SPRITE);
	const reach = art.w / (art.w - 2 * MARGIN);
	raw(`<defs><image id="${name}-stone" class="art" href="${art.href}" x="${n2(-R * reach)}" y="${n2(-R * reach)}" width="${n2(2 * R * reach)}" height="${n2(2 * R * reach)}" preserveAspectRatio="none"/></defs>`, -2);

	const bx = -115, rx = bx + PER_M * 1;               // the ball's centre and the ring's, a metre apart on the axis
	check(near(rx - bx, 10 * R, 1e-9), 'the ring is not a metre, ten radii, from the ball');

	// ---- the ball, longer along the axis: the circle's image under u, the axis across the page
	const q = eps * R, a = R + q, b = R - q / 2;
	check(((a / R) * 10).toFixed(1) === '12.2' && ((b / R) * 10).toFixed(1) === '8.9', `the semi-axes ${a}, ${b}`);
	for (let k = 0; k < 24; k++) {
		const t = (2 * Math.PI * k) / 24, p = [R * Math.sin(t), 0, R * Math.cos(t)];
		const d = trial(p, q, R), moved = [p[0] + d[0], p[2] + d[2]];
		check(near((moved[1] / a) ** 2 + (moved[0] / b) ** 2, 1, 1e-12), 'a point of the surface is off the outline');
	}
	const [X, Y] = ink.at(v3(bx, 0));
	const shape = ellipse(X, Y, a, b);
	raw(`<clipPath id="${name}-in"><path d="${shape}"/></clipPath>` +
		`<clipPath id="${name}-out"><path clip-rule="evenodd" d="M0,0H${2 * ORIGIN}V${2 * ORIGIN}H0Z${shape}"/></clipPath>` +
		`<g clip-path="url(#${name}-in)"><use href="#${name}-stone" transform="translate(${n2(X)},${n2(Y)}) scale(${(a / R).toFixed(6)},${(b / R).toFixed(6)})"/></g>`, 0);
	raw(`<path d="${shape}" fill="none" stroke="${STONE_INK}" stroke-width="${RIM}"/>`, 0.7);
	const outline = Array.from({ length: 1441 }, (_, k) => [X + a * Math.cos((k * Math.PI) / 720), Y + b * Math.sin((k * Math.PI) / 720)]);
	ink.mark(outline, RIM / 2, 'the ball');
	raw(`<g clip-path="url(#${name}-out)">${dashedCircle(X, Y, R, DIM)}</g><g clip-path="url(#${name}-in)">${dashedCircle(X, Y, R, STONE_INK)}</g>`, 0.8);
	ink.mark(Array.from({ length: 721 }, (_, k) => [X + R * Math.cos((k * Math.PI) / 360), Y + R * Math.sin((k * Math.PI) / 360)]), UNDISTURBED_W / 2, 'the ball at rest');

	// ---- the haze: seeded places within 20 cm of the surface, outside the ball, clear of its rim and dashed outline
	const reachHaze = AIR * PER_M;
	const toSurface = (p) => Math.min(...outline.map((o) => Math.hypot(p[0] - o[0], p[1] - o[1])));
	const inside = (p) => ((p[0] - X) / a) ** 2 + ((p[1] - Y) / b) ** 2 <= 1;
	const u = uniforms(29);
	const specks = [];
	let tries = 0;
	while (specks.length < HAZE && tries < 400000) {
		tries++;
		const p = [X + (2 * u() - 1) * (a + reachHaze), Y + (2 * u() - 1) * (b + reachHaze)];
		if (inside(p)) continue;
		const d = toSurface(p);
		if (d > reachHaze - SPECK) continue;
		if (d < SPECK + RIM / 2 + SPECK_CLEAR) continue;
		if (Math.abs(Math.hypot(p[0] - X, p[1] - Y) - R) < SPECK + UNDISTURBED_W / 2 + SPECK_CLEAR) continue;
		if (specks.some((s) => Math.hypot(s.p[0] - p[0], s.p[1] - p[1]) < SPECK_GAP)) continue;
		specks.push({ p, d });
	}
	check(specks.length === HAZE, `only ${specks.length} dots of the haze found room`);
	// the haze thins toward its edge: each dot's opacity falls from 0.95 at the surface to 0.35 at 20 cm
	raw(specks.map(({ p, d }) => `<circle cx="${n2(p[0])}" cy="${n2(p[1])}" r="${SPECK}" fill="${FAINT}" opacity="${(0.95 - (0.6 * d) / reachHaze).toFixed(2)}"/>`).join(''), 0.5);
	for (const s of specks) check(s.d <= reachHaze && !inside(s.p), 'a dot of the haze is off its shell of air');

	// ---- the ring, a metre away: three states, the image of the circle under 1 - eps T, T = s diag(-2, 1)
	const [RX, RY] = ink.at(v3(rx, 0));
	const states = [{ key: 'stretch', s: 1, color: ACCENT }, { key: 'squeeze', s: -1, color: ACCENT2 }, { key: 'rest', s: 0, color: DIM }];
	const ext = {};
	for (const { key, s, color } of states) {
		const along = 1 + 2 * EPS * s, across = 1 - EPS * s;          // (1 - eps T) on the axis and across it
		ext[key] = [along, across];
		if (s) {
			const loop = Array.from({ length: 721 }, (_, k) => { const t = (k * Math.PI) / 360; return [RX + R_RING * along * Math.cos(t), RY + R_RING * across * Math.sin(t)]; });
			raw(`<path d="M${loop.map(([x, y]) => `${n2(x)},${n2(y)}`).join('L')}Z" fill="none" stroke="${color}" stroke-width="${LINE}"/>`, 1);
			ink.mark(loop, LINE / 2, `the ${key} ellipse`);
		} else {
			raw(dashedCircle(RX, RY, R_RING, DIM), 1);
			ink.mark(Array.from({ length: 721 }, (_, k) => [RX + R_RING * Math.cos((k * Math.PI) / 360), RY + R_RING * Math.sin((k * Math.PI) / 360)]), UNDISTURBED_W / 2, 'the ring at rest');
		}
		for (let k = 0; k < 12; k++) {
			const t = (2 * Math.PI * k) / 12, xi = [Math.cos(t), Math.sin(t)];
			const p = v3(rx + R_RING * along * xi[0], R_RING * across * xi[1]);
			// on its ellipse
			check(near(((p.x - rx) / (R_RING * along)) ** 2 + (p.y / (R_RING * across)) ** 2, 1, 1e-12), `the ${key} bead ${k} is off its ellipse`);
			P.sphere(p, BEAD, STEEL, { spec: 0.6, shininess: 36, layer: s ? 2 : 3, opacity: FAINT_BEAD[key] });
			ink.mark([ink.at(p)], BEAD, `the ${key} bead ${k}`);
		}
	}
	check(near(ext.stretch[0], 1.15, 1e-12) && near(ext.squeeze[0], 0.85, 1e-12), 'the ring is not 15% longer and shorter along the axis');
	check(near((ext.stretch[0] - 1) + 2 * (ext.stretch[1] - 1), 0, 1e-12), 'the stretch is not diag(-2, 1)');
	// the tide on the axis, from tut-osc-lib's `ball`: a ball longer along its axis stretches the ring along it
	check(nums.tideRms.toPrecision(2) === '3.4e-25', 'the tide');
	// the haze stays clear of the ring
	check(Math.max(...specks.map((s) => s.p[0])) + SPECK < RX - R_RING * 1.15 - BEAD - 20, 'the haze reaches the ring');

	ink.checkAll([]);
	window[name + '-numbers'] = { eps, semi: [a, b], cm: [(a / R) * 10, (b / R) * 10], haze: specks.length, ring: ext };
	return finish(name, P, [], [240, 340]);
}
