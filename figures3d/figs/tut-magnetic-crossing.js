// The tutorial, section 7.5 (tutorial/geometry/gravitomagnetism.md), its first diagram: a mass moving across the line
// of sight and the same mass moving at the pixel. Two panels, (a) "moving across" and (b) "moving toward the pixel".
// Each shows the pixel at the left, section 7.3's ball beside a mass (a dashed circle, the solid ellipse stretched
// along the line to the mass and squeezed across it, orange crescents at its two ends and blue ones at its top and
// bottom, twelve free balls as ink dots on it), the stone mass to the right on the same line with its velocity arrow
// in ink, and above the ring two small gyroscopes (discs with an axle, axles parallel, seen a little from above). In
// (a) the velocity points up the page and each gyroscope has a short curved arrow in the curvature's colour, in
// opposite senses: "turn relative to one another, B != 0". In (b) it points left, at the pixel; no curved arrows,
// "B = 0". Under each panel |B|/|E| = sqrt 3 v_perp / c, with v_perp = v and v_perp = 0.
// Departures from the diagram's comment: the panels are stacked at every width, not side by side at 1440 px (as the
// section 7.3 and 7.4 diagrams), so that their text stays readable on a phone. The two gyroscopes stand side by side
// along the line to the mass, 1 m apart (a dimension line names it), not one above and one below the ring: by
// eq:gyro-pair, delta Omega = B xi / c, and for this mass (n = x, v = y) B has only its xz and zx entries, so a pair
// separated up the page, along v, does not turn at all (asserted in tut-gravitomag-lib.js); a pair along the line to
// the mass turns relative to one another about the axis out of the page, so each curved arrow turns in the page, about
// that axis, not about the line joining them (the right one anticlockwise, asserted from the sign of B_zx). The
// exaggeration is stated under the panels, as in tut-einstein-three-balls.
// Exact: the outline the image of the circle under 1 - EPS E / |E| with E = (G M / r^3) diag(-2, 1) along and across
// the line, EPS = 0.3 (section 7.3's), the same in both panels because E does not depend on the velocity; the senses of
// the curved arrows, from B xi / c; B = 0 in (b), and the ratio sqrt 3 v_perp / c (asserted in the library for every
// direction of v). Schematic: the sizes and distances, the arrows' lengths, the angle each curved arrow sweeps.
// Pictorial: the stone, a picture from an image model (sprites/hair/ball.png, as tut-einstein-three-balls), clipped to
// its exact circle.
import { Sheet, ORIGIN, finish, checker, placed, near, LABEL_GAP, VEC, VEC_HEAD, HAIR, TICK } from './tut-pot-lib.js';
import { INK, DIM, FAINT, sprite } from '../lib.js';
import { picture, circle as circlePath } from '../stone.js';
import { STONE_INK } from './tut-orb-lib.js';
import { RING, UNDISTURBED, UNDISTURBED_W } from './tut-five-lib.js';
import { turning } from './tut-flow-lib.js';
import { EPS, shape, BESIDE } from './tut-einstein-lib.js';
import { chapter, palette, stack, CURV, C, magneticPoint, electricPoint, frob } from './tut-gravitomag-lib.js';

const name = 'tut-magnetic-crossing';
const check = checker(name);

const R = 26;                              // the ring's undisturbed radius, points (schematic)
const DIST = 150;                          // the ring's centre to the mass's
const RS = 15;                             // the stone's radius
const DOT_R = 1.25;                        // a free ball
const N_DOTS = 12;
const V_LEN = 30;                          // the velocity's arrow
const GX = 17;                             // a gyroscope's centre, left or right of the ring's centre
const GY = 30;                             // the gyroscopes' centres above the dashed circle's top
const AXLE = 9.5;                          // half an axle
const AXLE_W = 0.7;
const DISC = [7, 2.2];                   // a disc's half-axes, across and along its axle
const DISC_LINE = 0.45;
const TURN_R = AXLE + 3.2;                 // a curved arrow's radius about its gyroscope's centre
const TURN_SWEEP = 80;                     // degrees, centred on the axle's top
const TURN_W = 0.7, TURN_HEAD = 3.6;
const DIM_Y = 4.2;                         // the dimension line under the axles' feet
const ROW = 7;                             // a title to its drawing
const GAP = 16;                            // between the panels
const ORANGE = '#f3dfcb', BLUE = '#dce7f3';    // the accents' faint tints: the stretch and the squeeze (7.3's)

export default async function () {
	const nums = chapter(check);
	await palette(check);
	const S = new Sheet(name);
	const L = [];
	const art = await sprite('/figures3d/sprites/hair/ball.png');
	const ellipse = (cx, cy, a, b) => `M${(cx - a).toFixed(2)},${cy.toFixed(2)}a${a.toFixed(2)},${b.toFixed(2)} 0 1,0 ${(2 * a).toFixed(2)},0a${a.toFixed(2)},${b.toFixed(2)} 0 1,0 ${(-2 * a).toFixed(2)},0Z`;
	const loop = (cx, cy, a, b, n = 180) => Array.from({ length: n + 1 }, (_, i) => [cx + a * Math.cos((2 * Math.PI * i) / n), cy - b * Math.sin((2 * Math.PI * i) / n)]);

	// the tide beside the mass, in the page: along the line, across it (and out of the page)
	const E = shape(BESIDE);
	const [sx, sy] = [1 - EPS * E[0], 1 - EPS * E[1]];
	check(near(sx, 1.3, 1e-12) && near(sy, 0.85, 1e-12), `the outline ${sx}, ${sy}`);
	// the page: x to the right (toward the mass), y up, z toward the viewer
	const n = [1, 0, 0];
	const panels = [
		{ key: 'across', title: '\\text{(a) moving across}', v: [0, 1, 0], vperp: 'v' },
		{ key: 'toward', title: '\\text{(b) moving toward the pixel}', v: [-1, 0, 0], vperp: '0' }
	];
	const xl = ORIGIN - 110;
	let y = ORIGIN - 200;
	const drawn = [];
	for (const [k, p] of panels.entries()) {
		const what = `panel ${p.key}`;
		const title = await placed(p.title, xl, y, 0, 0, INK);
		L.push(title);
		const cx = xl + R * sx + 2, cy = title.box.b + ROW + GY + AXLE + 7 + R;
		const mx = cx + DIST, my = cy;

		// ---- the physics of the panel: B from the moving mass, the gyroscopes' relative turn
		const B = magneticPoint(1, p.v, n, 1), Eref = electricPoint(1, n, 1);
		const ratio = frob(B) / frob(Eref);
		const turn = nums.gyro(B, [1, 0, 0]);          // the right gyroscope relative to the left one, per unit of v
		if (p.key === 'across') {
			check(near(ratio * C, Math.sqrt(3), 1e-12) && turn[2] > 0 && Math.abs(turn[0]) + Math.abs(turn[1]) === 0, `(a): ratio ${ratio}, turn ${turn}`);
		} else check(frob(B) === 0 && turn.every((t) => t === 0), `(b) has a magnetic part ${frob(B)}`);

		// ---- the ring: tints, the dashed start, the outline, twelve balls
		{
			const both = ellipse(cx, cy, R * sx, R * sy) + circlePath(cx, cy, R);
			const inside = `${name}-in${k}`, outside = `${name}-out${k}`;
			S.raw(`<clipPath id="${inside}"><path d="${circlePath(cx, cy, R)}"/></clipPath>` +
				`<clipPath id="${outside}"><path clip-rule="evenodd" d="M${cx - 3 * R},${cy - 3 * R}H${cx + 3 * R}V${cy + 3 * R}H${cx - 3 * R}Z${circlePath(cx, cy, R)}"/></clipPath>` +
				`<path d="${both}" fill="${BLUE}" fill-rule="evenodd" clip-path="url(#${inside})"/>` +
				`<path d="${both}" fill="${ORANGE}" fill-rule="evenodd" clip-path="url(#${outside})"/>`, 0);
			const total = 2 * Math.PI * R, [on, off] = UNDISTURBED, m = Math.round(total / (on + off)), period = total / m;
			S.raw(`<path d="${circlePath(cx, cy, R)}" fill="none" stroke="${DIM}" stroke-width="${UNDISTURBED_W}" stroke-dasharray="${((on * period) / (on + off)).toFixed(3)} ${((off * period) / (on + off)).toFixed(3)}"/>`, 1);
			S.mark(loop(cx, cy, R, R), UNDISTURBED_W / 2, `${what}'s dashed circle`);
			S.raw(`<path d="${ellipse(cx, cy, R * sx, R * sy)}" fill="none" stroke="${INK}" stroke-width="${RING}"/>`, 2);
			S.mark(loop(cx, cy, R * sx, R * sy), RING / 2, `${what}'s outline`);
			for (let i = 0; i < N_DOTS; i++) {
				const t = (2 * Math.PI * i) / N_DOTS;
				const q = [cx + R * sx * Math.cos(t), cy - R * sy * Math.sin(t)];
				check(near(((q[0] - cx) / (R * sx)) ** 2 + ((q[1] - cy) / (R * sy)) ** 2, 1, 1e-12), `${what}: ball ${i} is off the outline`);
				S.raw(`<circle cx="${q[0].toFixed(2)}" cy="${q[1].toFixed(2)}" r="${DOT_R}" fill="${INK}"/>`, 3);
				S.mark([q], DOT_R, `${what}'s ball ${i}`);
			}
		}

		// ---- the mass and its velocity
		S.raw(picture(`${name}-stone${k}`, art, mx, my, RS, circlePath(mx, my, RS)) + `<path d="${circlePath(mx, my, RS)}" fill="none" stroke="${STONE_INK}" stroke-width="0.35"/>`, 1);
		S.mark([[mx, my]], RS, `${what}'s stone`);
		const u = [p.v[0], -p.v[1]];                  // the velocity's direction on the page (y down)
		const a0 = [mx + u[0] * (RS + 1.2), my + u[1] * (RS + 1.2)], a1 = [a0[0] + u[0] * V_LEN, a0[1] + u[1] * V_LEN];
		const va = S.arrow(a0, a1, { color: INK, width: VEC, head: VEC_HEAD, layer: 3, what: `${what}'s velocity` });
		if (p.key === 'across') L.push(await placed('\\boldsymbol v', a0[0] + VEC / 2 + LABEL_GAP + 0.6, (a0[1] + a1[1]) / 2, 0, 0.5, INK));
		else {
			L.push(await placed('\\boldsymbol v', (a0[0] + a1[0]) / 2, a0[1] - VEC / 2 - LABEL_GAP - 0.6, 0.5, 1, INK));
			check(a1[0] - (cx + R * sx) > 40, '(b): the velocity reaches the ring');
		}
		check(va.L === V_LEN, 'the velocity\'s length');

		// ---- the gyroscopes, side by side along the line to the mass
		const gy = cy - R - GY;
		const gyros = [cx - GX, cx + GX];
		for (const [j, gx] of gyros.entries()) {
			const gw = `${what}'s gyroscope ${j}`;
			// the axle's lower half behind the disc, the disc, the upper half in front
			S.path([[gx, gy], [gx, gy + AXLE]], { color: INK, width: AXLE_W, cap: 'round', layer: 1, what: `${gw}'s axle, below` });
			S.raw(`<path d="${ellipse(gx, gy, DISC[0], DISC[1])}" fill="${FAINT}" stroke="${INK}" stroke-width="${DISC_LINE}"/>`, 2);
			S.mark(loop(gx, gy, DISC[0], DISC[1]), DISC_LINE / 2, `${gw}'s disc`);
			S.boxes.push({ box: { l: gx - DISC[0], r: gx + DISC[0], t: gy - DISC[1], b: gy + DISC[1] }, what: `${gw}'s disc` });
			S.path([[gx, gy - DISC[1]], [gx, gy - AXLE]], { color: INK, width: AXLE_W, cap: 'round', layer: 3, what: `${gw}'s axle, above` });
			if (p.key === 'across') {
				// relative to the pixel's frame the pair turns by +-delta Omega / 2: the right one anticlockwise (turn_z > 0)
				const sense = (j === 1 ? 1 : -1) * Math.sign(turn[2]);
				const mid = Math.PI / 2, half = (TURN_SWEEP * Math.PI) / 360;
				const t = turning(gx, gy, TURN_R, mid - sense * half, mid + sense * half, CURV, { width: TURN_W, head: TURN_HEAD });
				S.raw(t.svg, 4);
				S.mark(t.pts, TURN_W / 2, `${gw}'s turn`);
				S.mark(t.head, 0, `${gw}'s turn's head`);
				drawn.push({ panel: p.key, gyro: j, sense });
			}
		}
		// the dimension: 1 m between the two axles, under their feet
		{
			const yd = gy + AXLE + DIM_Y, [g0, g1] = gyros;
			S.path([[g0, yd], [g1, yd]], { color: DIM, width: HAIR, cap: 'butt', layer: 1, what: `${what}'s dimension` });
			for (const g of gyros) S.path([[g, yd - TICK / 2], [g, yd + TICK / 2]], { color: DIM, width: HAIR, cap: 'butt', layer: 1, what: `${what}'s dimension's end` });
			L.push(await placed('1\\,\\mathrm m', (g0 + g1) / 2, yd + TICK / 2 + LABEL_GAP + 0.3, 0.5, 0, INK));
		}
		// the gyroscopes' sentence, right of the pair
		const say = p.key === 'across'
			? ['\\text{turn relative to}', '\\text{one another, }\\mathcal B \\neq 0']
			: ['\\mathcal B = 0'];
		const st = await placed(say[0], 0, 0, 0, 0, INK);
		const sh = st.box.b - st.box.t;
		const lab = await stack(say, cx + GX + TURN_R + LABEL_GAP + 3, gy - (say.length * sh + (say.length - 1) * 1.6) / 2, 0);
		L.push(lab);

		// ---- under the panel: the ratio
		const under = await placed(`|\\mathcal B|/|\\mathcal E| = \\sqrt3\\,v_\\perp/c\\text{, with }v_\\perp = ${p.vperp}`, xl, Math.max(cy + R + UNDISTURBED_W / 2, my + RS) + 8, 0, 0, INK);
		L.push(under);
		y = under.box.b + GAP;
	}
	check(drawn.length === 2 && drawn[0].sense === -drawn[1].sense, 'the curved arrows do not turn in opposite senses');
	L.push(await stack([`\\text{outlines: the largest change drawn as ${Math.round(EPS * 100)} per cent}`, '\\text{of the radius; the turning not to scale}'], xl, y - GAP + 8, 0, DIM));

	S.checkAll(L);
	window[name + '-numbers'] = { ...nums, drawn };
	return finish(S, L, [190, 300]);
}

