// The tutorial, section 7.3 (tutorial/geometry/einstein-equation.md), its third diagram: three balls of free dust, each
// drawn as a dashed circle (the start) and a solid ink outline a little later, with eight dots on the outline, the
// images of eight places equally spaced round the circle. Inside water far from other masses (a faint blue-grey wash
// fills the panel; drawn otherwise, see below): the outline a smaller circle, with eight equal arrows in the curvature's colour from the start to
// the dots; "volume shrinks, shape kept: Ricci". Beside a mass in empty space (a stone sphere at the panel's left
// edge): the outline an ellipse longer along the line to the sphere, orange where it reaches outside the circle and
// blue where it falls inside; "shape changes, volume kept: Weyl". Inside a neutrino beam (three thin lines in the
// light role's colour crossing the panel behind the ball, the top one with an arrowhead and the name "beam"; drawn in
// matter's colour, see below): the outline an ellipse
// narrower across the beam (blue) and unchanged along it; "squeezed across the beam only: Ricci, from stress".
// Departures from the diagram's comment: the panels are stacked at every width, not side by side at 1440 px (as the
// section 6.5 and 7.2 diagrams), so that their text stays readable on a phone. The ellipse beside the mass does not
// have the dashed circle's area: the tide there is -2 : 1 : 1, and its squeeze also acts at right angles to the page,
// so the ball keeps its volume (to first order, the trace -2 + 1 + 1 = 0) while its section in the page, which holds
// the line to the mass, grows by the factor (1 + 2e)(1 - e), here 1.105. The tints are the crescents between the
// circle and the outline, orange outside and blue inside. The beam's lines stop short of the ball and go on beyond it, as
// if behind it, so that they do not cross its outline and dots. The exaggeration is stated under the panels. The
// printed book (figureLayout 'book') sets the three panels side by side, each 132 points wide, with the balls' radius
// 30 points, not 38, each sentence broken after its colon, and the ball beside the mass and its stone centred together
// in their panel; the site keeps them stacked. The water's wash is the page's neutral tint (the paper's veil), with
// four little waves in the rule's grey either side of the ball, not the comment's blue-grey, which is the squeeze's
// tint in the other two panels and read as "squeezed everywhere". The beam's lines and its name are in matter's
// colour, not the light role's: neutrinos are matter, though they move at nearly c.
// Exact: each outline the image of the circle under 1 - EPS E / |E|, with |E| the tide's largest eigenvalue in size
// and one EPS = 0.3 for all three (tut-einstein-lib.js): inside water E = (4 pi G rho / 3) delta, so the radius
// becomes 0.7; beside the mass E = (G M / r^3) diag(-2, 1, 1), so 1.3 along the line and 0.85 across; in the beam
// E = (4 pi G F / c^3)(delta - n n), so 0.7 across and 1 along (each tide asserted from eq:ricci-tide in the library);
// the dots the images of their places (asserted on the outline); the arrows equal (asserted). Schematic: EPS (the
// exaggeration), the balls' size, the sphere's size and distance, the beam's three lines, the water's waves.
// Pictorial: the stone, a picture from an image model (sprites/hair/ball.png, as section 4.1's hero), clipped to its
// exact circle.
import { Sheet, ORIGIN, finish, checker, placed, near, LABEL_GAP } from './tut-pot-lib.js';
import { INK, DIM, RULE, sprite } from '../lib.js';
import { picture, circle as circlePath } from '../stone.js';
import { STONE_INK } from './tut-orb-lib.js';
import { RING, UNDISTURBED, UNDISTURBED_W, PUSH, PUSH_HEAD } from './tut-five-lib.js';
import { chapter, palette, EPS, CURV, MATTER, stack } from './tut-einstein-lib.js';

const name = 'tut-einstein-three-balls';
const check = checker(name);

const BOOK = globalThis.figureLayout === 'book';
const R = BOOK ? 30 : 38;                  // the ball's starting radius, points (schematic)
const HALF = BOOK ? 66 : 125;              // a panel's half-width
const SIDE = 14;                           // the book: between two panels side by side
const DOT_R = 1.3;                         // a dot on the outline
const N_DOTS = 8;
const PHASE = Math.PI / 8;                 // the dots start 22.5 degrees round, so none lies on an axis
const RS = 15;                             // the stone's radius
const BEAM_W = 0.5;                        // a line of the beam
const BEAM_Y = [-0.5, 0, 0.5];             // the beam's lines, in units of R from the ball's centre
const BEAM_CLEAR = 3.5;                    // each line stops this far short of the ball's dashed circle
const BEAM_HEAD = 3.2;
const ROW = 7;                             // a title to its drawing
const UNDER = 6;                           // the drawing to its sentence
const GAP = 16;                            // between the panels, stacked
const PAD = 5;                             // the wash reaches this far beyond the panel's ink
const WASH = '#eeebe5';                    // the water: the page's neutral tint (the paper's veil), not the squeeze's blue
const WASH_OPACITY = 1;
const WAVE = { n: 2, len: 22, amp: 1.1, w: 0.55 };   // the water's little waves: periods, length, height, stroke
const ORANGE = '#f3dfcb', BLUE = '#dce7f3';    // the accents' faint tints: the stretch and the squeeze
const TINT_OPACITY = 1;
const WAVES = [[-1.75, -0.55], [-1.45, 0.75], [1.75, -0.35], [1.5, 0.85]];   // the waves' middles, units of R from the ball's centre

export default async function () {
	const nums = chapter(check);
	await palette(check);
	const S = new Sheet(name);
	const L = [];
	const art = await sprite('/figures3d/sprites/hair/ball.png');
	const x0 = ORIGIN - (BOOK ? 3 * HALF + SIDE : HALF);
	const ellipse = (cx, cy, a, b) => `M${(cx - a).toFixed(2)},${cy.toFixed(2)}a${a.toFixed(2)},${b.toFixed(2)} 0 1,0 ${(2 * a).toFixed(2)},0a${a.toFixed(2)},${b.toFixed(2)} 0 1,0 ${(-2 * a).toFixed(2)},0Z`;
	const loop = (cx, cy, a, b, n = 180) => Array.from({ length: n + 1 }, (_, i) => [cx + a * Math.cos((2 * Math.PI * i) / n), cy - b * Math.sin((2 * Math.PI * i) / n)]);

	const panels = [
		{ key: 'water', title: '\\text{inside water, far from other masses}', under: '\\text{volume shrinks, shape kept: Ricci}', E: nums.shapes.water },
		{ key: 'mass', title: '\\text{beside a mass in empty space}', under: '\\text{shape changes, volume kept: Weyl}', E: nums.shapes.mass },
		{ key: 'beam', title: '\\text{inside a neutrino beam}', under: '\\text{squeezed across the beam only: Ricci, from stress}', E: nums.shapes.beam }
	];
	const y0 = ORIGIN - 220;
	let y = y0, bottom = 0;
	const drawn = [];
	for (const [k, p] of panels.entries()) {
		if (BOOK) y = y0;
		const xl = x0 + (BOOK ? k * (2 * HALF + SIDE) : 0), xr = xl + 2 * HALF, xm = xl + HALF;
		const title = await placed(p.title, xl, y, 0, 0, INK);
		L.push(title);
		check(title.box.r <= xr, `the ${p.key} panel's title is wider than its panel`);
		// the ball at the panel's middle; beside the mass, in the book, the stone and the ball centred together
		const cx = BOOK && p.key === 'mass' ? xr - R * (1 - EPS * p.E[0]) - 2.4 : xm;
		const cy = title.box.b + ROW + R + 1;
		// the drawn map: 1 - EPS E/|E|, (along the page's horizontal, across it); the third entry is out of the page
		const [sx, sy] = [1 - EPS * p.E[0], 1 - EPS * p.E[1]];
		const sz = 1 - EPS * p.E[2];
		const what = `the ${p.key} ball`;

		// ---- the tints: the crescents between the circle and the outline
		if (p.key !== 'water') {
			const both = ellipse(cx, cy, R * sx, R * sy) + circlePath(cx, cy, R);
			const inside = `${name}-in${k}`, outside = `${name}-out${k}`;
			S.raw(`<clipPath id="${inside}"><path d="${circlePath(cx, cy, R)}"/></clipPath>` +
				`<clipPath id="${outside}"><path clip-rule="evenodd" d="M${xl - 50},${cy - 3 * R}H${xr + 50}V${cy + 3 * R}H${xl - 50}Z${circlePath(cx, cy, R)}"/></clipPath>` +
				`<path d="${both}" fill="${BLUE}" fill-opacity="${TINT_OPACITY}" fill-rule="evenodd" clip-path="url(#${inside})"/>` +
				`<path d="${both}" fill="${ORANGE}" fill-opacity="${TINT_OPACITY}" fill-rule="evenodd" clip-path="url(#${outside})"/>`, 0);
		}

		// ---- the start: a dashed circle, a whole number of dashes
		{
			const total = 2 * Math.PI * R, [on, off] = UNDISTURBED, n = Math.round(total / (on + off)), period = total / n;
			S.raw(`<path d="${circlePath(cx, cy, R)}" fill="none" stroke="${DIM}" stroke-width="${UNDISTURBED_W}" stroke-dasharray="${((on * period) / (on + off)).toFixed(3)} ${((off * period) / (on + off)).toFixed(3)}"/>`, 1);
			S.mark(loop(cx, cy, R, R), UNDISTURBED_W / 2, `${what}'s start`);
		}
		// ---- the outline, and the dots on it
		S.raw(`<path d="${ellipse(cx, cy, R * sx, R * sy)}" fill="none" stroke="${INK}" stroke-width="${RING}"/>`, 2);
		S.mark(loop(cx, cy, R * sx, R * sy), RING / 2, `${what}'s outline`);
		const dots = [];
		for (let i = 0; i < N_DOTS; i++) {
			const t = PHASE + (2 * Math.PI * i) / N_DOTS;
			const q = [cx + R * sx * Math.cos(t), cy - R * sy * Math.sin(t)];
			// the image of its place on the circle under the map
			const place = [R * Math.cos(t), R * Math.sin(t)];
			check(near(q[0] - cx, place[0] * sx, 1e-9) && near(cy - q[1], place[1] * sy, 1e-9), `${what}: dot ${i} is not the image of its place`);
			check(near(((q[0] - cx) / (R * sx)) ** 2 + ((q[1] - cy) / (R * sy)) ** 2, 1, 1e-12), `${what}: dot ${i} is off the outline`);
			S.raw(`<circle cx="${q[0].toFixed(2)}" cy="${q[1].toFixed(2)}" r="${DOT_R}" fill="${INK}"/>`, 3);
			S.mark([q], DOT_R, `${what}'s dot ${i}`);
			dots.push({ q, t });
		}

		// ---- what each panel adds
		if (p.key === 'water') {
			check(sx === sy && sy === sz && near(sx, 0.7, 1e-12), `the water ball's map ${sx}, ${sy}, ${sz}`);
			const lengths = [];
			for (const { t } of dots) {
				const u = [Math.cos(t), -Math.sin(t)];
				const r0 = R - UNDISTURBED_W / 2 - 0.9, r1 = R * sx + DOT_R + 0.5;
				const a = S.arrow([cx + u[0] * r0, cy + u[1] * r0], [cx + u[0] * r1, cy + u[1] * r1], { color: CURV, width: PUSH, head: PUSH_HEAD, layer: 3, what: `${what}'s arrow at ${t.toFixed(2)}` });
				lengths.push(a.L);
			}
			check(lengths.every((l) => near(l, lengths[0], 1e-9)) && lengths[0] > 6, `the water ball's arrows ${lengths}`);
		}
		if (p.key === 'mass') {
			check(near(sx, 1.3, 1e-12) && near(sy, 0.85, 1e-12) && near(sz, 0.85, 1e-12), `the ball beside the mass ${sx}, ${sy}, ${sz}`);
			check(near(sx - 1, 2 * (1 - sy), 1e-12), 'the stretch is not twice the squeeze');
			check(near(p.E[0] + p.E[1] + p.E[2], 0, 1e-12), 'the tide beside the mass is not trace-free');
			check(near(sx * sy, 1.105, 1e-12), `the section's area ${sx * sy}`);
			const ms = [xl + RS, cy];
			S.raw(picture(`${name}-stone`, art, ms[0], ms[1], RS, circlePath(ms[0], ms[1], RS)) + `<path d="${circlePath(ms[0], ms[1], RS)}" fill="none" stroke="${STONE_INK}" stroke-width="0.35"/>`, 1);
			S.mark([ms], RS, 'the stone');
			check(cx - R * sx - (ms[0] + RS) > (BOOK ? 20 : 30), 'the ball crowds the stone');
		}
		if (p.key === 'beam') {
			check(near(sx, 1, 1e-12) && near(sy, 0.7, 1e-12) && near(sz, 0.7, 1e-12), `the ball in the beam ${sx}, ${sy}, ${sz}`);
			// each line stops BEAM_CLEAR short of the ball's dashed circle on both sides: it passes behind the ball
			for (const [j, f] of BEAM_Y.entries()) {
				const yb = cy + f * R, half = Math.sqrt(R * R - (f * R) ** 2) + BEAM_CLEAR;
				S.path([[xl, yb], [cx - half, yb]], { color: MATTER, width: BEAM_W, cap: 'butt', layer: 0.5, what: `the beam's line ${j}, before the ball` });
				if (j === 0) S.arrow([cx + half, yb], [xr, yb], { color: MATTER, width: BEAM_W, head: BEAM_HEAD, layer: 0.5, what: 'the beam\'s top line' });
				else S.path([[cx + half, yb], [xr, yb]], { color: MATTER, width: BEAM_W, cap: 'butt', layer: 0.5, what: `the beam's line ${j}, after the ball` });
				for (const ex of [cx - half, cx + half]) check(S.clearance({ l: ex, r: ex, t: yb, b: yb }, (w) => w.startsWith('the beam')).d >= BEAM_CLEAR - 0.6, `the beam's line ${j} runs into the ball`);
			}
			L.push(await placed('\\text{beam}', xr - 1, cy + BEAM_Y[0] * R - 0.36 * BEAM_HEAD - LABEL_GAP - 0.5, 1, 1, MATTER));
		}

		const underY = cy + R + UNDISTURBED_W / 2 + UNDER;
		const under = BOOK ? await stack(p.under.replace(':', ':}#\\text{').split('#'), xm, underY, 0.5, INK) : await placed(p.under, cx, underY, 0.5, 0, INK);
		L.push(under);
		check(under.box.l >= xl - PAD && under.box.r <= xr + PAD, `the ${p.key} panel's sentence is wider than its panel`);
		if (p.key === 'water') {
			const t = title.box.t - PAD, b = under.box.b + PAD;
			S.raw(`<rect x="${(xl - PAD).toFixed(2)}" y="${t.toFixed(2)}" width="${(2 * HALF + 2 * PAD).toFixed(2)}" height="${(b - t).toFixed(2)}" rx="3" fill="${WASH}" fill-opacity="${WASH_OPACITY}"/>`, -1);
			// a few little waves in the water, either side of the ball, in the rule's grey
			for (const [j, [fx, fy]] of WAVES.entries()) {
				const wx = cx + fx * R - WAVE.len / 2, wy = cy + fy * R;
				const pts = Array.from({ length: 41 }, (_, i) => [wx + (WAVE.len * i) / 40, wy - WAVE.amp * Math.sin((2 * Math.PI * WAVE.n * i) / 40)]);
				S.path(pts, { color: RULE, width: WAVE.w, cap: 'round', layer: -0.5, what: `a wave ${j}` });
			}
			y = b + GAP;
			bottom = Math.max(bottom, b);
		} else y = under.box.b + GAP;
		bottom = Math.max(bottom, under.box.b);
		drawn.push({ key: p.key, sx, sy });
	}
	check(drawn.map((d) => d.key).join() === 'water,mass,beam', 'the panels are not in the comment\'s order');
	L.push(await placed(`\\text{every outline: the largest change drawn as ${Math.round(EPS * 100)} per cent of the radius}`, ORIGIN, (BOOK ? bottom + GAP : y) - GAP + 9, 0.5, 0, DIM));

	S.checkAll(L);
	window[name + '-numbers'] = { ...nums, drawn };
	return finish(S, L, BOOK ? [400, 450] : [240, 300]);
}
