// The tutorial, chapter 4.1 (tutorial/response/oscillator.md), its opening figure and the hero of Part 4: the
// paper's steel ball of radius 10 cm, ringing in its lowest quadrupole mode, drawn at the two extremes of its swing,
// one above the other; a metre away on its axis, the ring of twelve free steel beads of chapter 1.4's figure
// (figs/tut-tides.js), drawn out by the part of the ball's tide that rises and falls with the swing.
// Exact: the ball's outline, the image of its circle under the trial shape u = (q/R)(-x/2, -y/2, z) of Appendix A
// with z along the axis (here across the page, toward the ring): semi-axes R(1 + q/R) along the axis and
// R(1 - q/2R) across it, for q = +-q_rms times 10^14, q_rms = 2.2 x 10^-16 m from (1/2) K q^2 = (1/2) k_B T with
// K = 3 mu V / R^2 = 8.8 x 10^10 N/m at 300 K (tut-osc-lib.js, `ball`, which also integrates the shape's effective
// mass 3M/10, its note near 15 kHz and its quadrupole 6MRq/5 over the ball, and takes the tide of that quadrupole on
// the axis by differences: -36 G M R q / 5 r^5 along the axis and half that, opposite, across it, the table
// diag(-2, 1) for q > 0, so that a ball longer along its axis stretches the ring along it); the ball and the metre
// drawn to one scale; the picture of the stone mapped by the same linear map as the outline (an orthographic view
// of a linear deformation is the same linear map of the view), and clipped to the exact ellipse; the ring as in
// chapter 1.4, from that table (figs/tut-five-lib.js, `ring`). Schematic: the ring's size against the metre, and its
// strain (exaggerated far more than the ball's). Pictorial: the stone, a picture from an image model
// (design/prompts/hair-sprites.json, cut out by design/hair_sprites.py, as in figs/hair.js). Marks on the stone are
// drawn in a fixed dark ink, and change colour exactly where they cross the stone's edge.
import { Panel, v3, sprite, INK, DIM } from '../lib.js';
import { MARGIN } from '../stone.js';
import { Sheet, ORIGIN, finish, checker, near, placed, n2, HAIR, DOT, DOT_STEP, HAIRSPACE } from './tut-vec-lib.js';
import { ring, UNDISTURBED, UNDISTURBED_W, TICK } from './tut-five-lib.js';
import { STONE_INK } from './tut-orb-lib.js';
import { ball, Q_RMS, R_BALL, BLOW_UP, trial } from './tut-osc-lib.js';

const name = 'tut-osc-hero';
const check = checker(name);

// ---- the drawing (world points, y up; the panel's scale is one point per unit) -------------------------------
const R = 24;                             // the ball's radius: 10 cm
const PER_M = R / R_BALL;                 // points per metre, the same for the ball and the distance
const ROWS = 100;                         // from the centre of the upper row to the lower one's
const R_RING = 30;                        // the undisturbed ring's radius (schematic)
const BEAD = 2.5;
const REACH = 6;                          // an arrow's length per unit of the table
const EPS = 0.15;                         // the ring's strain (schematic)
const RIM = 0.35;                         // the ball's edge
const COM_R = 2.5;                        // the centre's mark (figs/tut-tides.js)
const PLUS = 2.2;                         // half the arms of the + at the ring's centre
const DIM_GAP = 7;                        // the dimension line, this far above the highest mark of the upper row
const LABEL_GAP = 2.4;
const SPRITE = '/figures3d/sprites/hair/ball.png';

const ellipse = (cx, cy, a, b) => `M${n2(cx - a)},${n2(cy)}a${n2(a)},${n2(b)} 0 1,0 ${n2(2 * a)},0a${n2(a)},${n2(b)} 0 1,0 ${n2(-2 * a)},0Z`;

export default async function () {
	const nums = ball(check);
	const eps = (Q_RMS * BLOW_UP) / R_BALL;             // the drawn shape change, q / R
	check(eps.toFixed(3) === '0.217', `the drawn shape change is ${eps}`);

	const P = new Panel({ x: ORIGIN, y: ORIGIN, w: 0, h: 0, scale: 1 });
	const ink = new Sheet(P, name);
	const raw = (svg, layer) => P.items.push({ kind: 'raw', layer, depth: 0, svg });
	const art = await sprite(SPRITE);
	const reach = art.w / (art.w - 2 * MARGIN);         // the sprite's half-width in units of its exact circle's radius
	raw(`<defs><image id="${name}-stone" class="art" href="${art.href}" x="${n2(-R * reach)}" y="${n2(-R * reach)}" width="${n2(2 * R * reach)}" height="${n2(2 * R * reach)}" preserveAspectRatio="none"/></defs>`, -2);

	const bx = -120, rx = bx + PER_M * 1;               // the ball's centre and the ring's, a metre apart on the axis
	check(near(rx - bx, 10 * R, 1e-9), 'the ring is not ten radii, a metre, from the ball');
	const rows = [{ sign: 1, y: ROWS / 2 }, { sign: -1, y: -ROWS / 2 }];
	const out = [];
	for (const [i, row] of rows.entries()) {
		// ---- the ball: the circle's image under u, axis across the page; u's z is the page's x here
		const q = row.sign * eps * R;                   // the pole's displacement, points
		const a = R + q, b = R - q / 2;                 // along the axis, across it
		for (let k = 0; k < 24; k++) {
			const t = (2 * Math.PI * k) / 24, p = [R * Math.sin(t), 0, R * Math.cos(t)];   // (across, -, along)
			const d = trial(p, q, R), moved = [p[0] + d[0], p[2] + d[2]];
			check(near((moved[1] / a) ** 2 + (moved[0] / b) ** 2, 1, 1e-12), `row ${i}: a point of the surface is off the outline`);
		}
		const [X, Y] = ink.at(v3(bx, row.y));
		const shape = ellipse(X, Y, a, b);
		const inside = `${name}-in${i}`, outside = `${name}-out${i}`;
		raw(`<clipPath id="${inside}"><path d="${shape}"/></clipPath>` +
			`<clipPath id="${outside}"><path clip-rule="evenodd" d="M0,0H${2 * ORIGIN}V${2 * ORIGIN}H0Z${shape}"/></clipPath>` +
			`<g clip-path="url(#${inside})"><use href="#${name}-stone" transform="translate(${n2(X)},${n2(Y)}) scale(${(a / R).toFixed(6)},${(b / R).toFixed(6)})"/></g>`, 0);
		raw(`<path d="${shape}" fill="none" stroke="${STONE_INK}" stroke-width="${RIM}"/>`, 0.7);
		ink.mark(Array.from({ length: 361 }, (_, k) => [X + a * Math.cos((k * Math.PI) / 180), Y + b * Math.sin((k * Math.PI) / 180)]), RIM / 2, `row ${i}: the ball`);
		// the undisturbed sphere's outline, dashed: a whole number of dashes; in the page's dim ink off the stone and
		// the stone's ink on it
		const C = 2 * Math.PI * R, n = Math.round(C / (UNDISTURBED[0] + UNDISTURBED[1])), period = C / n, on = (UNDISTURBED[0] * period) / (UNDISTURBED[0] + UNDISTURBED[1]);
		const circle = (c) => `<path d="M${n2(X + R)},${n2(Y)}a${R},${R} 0 1,1 ${-2 * R},0a${R},${R} 0 1,1 ${2 * R},0" fill="none" stroke="${c}" stroke-width="${UNDISTURBED_W}" stroke-dasharray="${on.toFixed(4)} ${(period - on).toFixed(4)}" stroke-dashoffset="${(on / 2).toFixed(4)}"/>`;
		raw(`<g clip-path="url(#${outside})">${circle(DIM)}</g><g clip-path="url(#${inside})">${circle(STONE_INK)}</g>`, 0.8);
		ink.mark(Array.from({ length: 361 }, (_, k) => [X + R * Math.cos((k * Math.PI) / 180), Y + R * Math.sin((k * Math.PI) / 180)]), UNDISTURBED_W / 2, `row ${i}: the undisturbed ball`);

		// ---- the ring, a metre away on the axis, under the table diag(-2, 1) times the sign of q
		const T = [[-2 * row.sign, 0], [0, row.sign]];
		const r = ring(ink, { c: v3(rx, row.y, 0), eh: v3(1, 0, 0), ev: v3(0, 1, 0), R: R_RING, T, eps: EPS, bead: BEAD, reach: REACH, layer: 1, what: `row ${i}: the ring` });
		const orange = r.arrows.filter((x) => x.stretch), blue = r.arrows.filter((x) => !x.stretch);
		check(orange.length === 2 && blue.length === 2, `row ${i}: not two arrows of each kind`);
		for (const o of orange) for (const bl of blue) check(near(o.L / bl.L, 2, 1e-9) === (row.sign > 0) && near(bl.L / o.L, 2, 1e-9) === (row.sign < 0), `row ${i}: the arrows are not in the ratio of the table`);
		// stretched along the axis when the ball is longer along it, squeezed along it when the ball is shorter
		for (const o of orange) check(near(Math.abs((o.B[0] - o.A[0]) / o.L), row.sign > 0 ? 1 : 0, 1e-9), `row ${i}: the stretch is not ${row.sign > 0 ? 'along' : 'across'} the axis`);
		check((a > R) === (row.sign > 0), `row ${i}: the ball's long axis and the ring's stretch disagree`);
		out.push({ X, Y, a, b, r });
	}

	// ---- the dimension, above the upper row: from the ball's centre to the ring's, a metre
	const up = out[0];
	const [RX, RY] = ink.at(v3(rx, rows[0].y));
	const highest = Math.min(up.Y - R, RY - R_RING, ...up.r.arrows.map((x) => Math.min(x.A[1], x.B[1])));
	const dimY = highest - DIM_GAP;
	const tick = (x) => `M${n2(x)},${n2(dimY - TICK)}V${n2(dimY + TICK)}`;
	raw(`<path d="M${n2(up.X)},${n2(dimY)}H${n2(RX)}${tick(up.X)}${tick(RX)}" stroke="${INK}" stroke-width="${HAIR}" fill="none"/>`, 2);
	ink.mark([[up.X, dimY], [RX, dimY]], HAIR / 2, 'the dimension');
	for (const x of [up.X, RX]) ink.mark([[x, dimY - TICK], [x, dimY + TICK]], HAIR / 2, 'a tick');
	// the ring's centre, a +, and its extension up to the tick, passing under the marks it crosses
	raw(`<path d="M${n2(RX - PLUS)},${n2(RY)}H${n2(RX + PLUS)}M${n2(RX)},${n2(RY - PLUS)}V${n2(RY + PLUS)}" stroke="${INK}" stroke-width="${HAIR}" fill="none"/>`, 2);
	ink.dots(v3(rx, rows[0].y + PLUS), v3(rx, ORIGIN - (dimY + TICK)), { color: INK, layer: 2, clear0: HAIRSPACE, clear1: HAIRSPACE, avoid: ['row 0: the ring', 'a dash of'], what: 'the ring\'s extension' });
	ink.mark([[RX - PLUS, RY], [RX + PLUS, RY]], HAIR / 2, 'the ring\'s centre');
	// the ball's centre, the quartered circle of a centre of mass, and its extension; on the stone in its ink
	const quarters = (x, y, r) => `M${n2(x)},${n2(y)}L${n2(x - r)},${n2(y)}A${r},${r} 0 0 1 ${n2(x)},${n2(y - r)}Z` +
		`M${n2(x)},${n2(y)}L${n2(x + r)},${n2(y)}A${r},${r} 0 0 1 ${n2(x)},${n2(y + r)}Z`;
	const y0 = up.Y - COM_R - HAIRSPACE - DOT / 2, y1 = dimY + TICK + HAIRSPACE + DOT / 2;
	const nd = Math.round((y0 - y1) / DOT_STEP), step = (y0 - y1) / nd;
	// leaving out the dots within a hair of the ball's edge and of the dashed outline it crosses
	const crossings = [up.Y - up.b, up.Y - R];
	const dots = Array.from({ length: nd + 1 }, (_, k) => y0 - k * step).filter((y) => crossings.every((c) => Math.abs(y - c) >= DOT / 2 + HAIRSPACE + 0.25))
		.map((y) => `M${n2(up.X)},${n2(y)}h0`).join('');
	// the extension runs off the stone only: on it, the edge of the picture's cut rises from the centre to the top
	raw(`<g clip-path="url(#${name}-out0)"><path d="${dots}" stroke="${INK}" stroke-width="${DOT}" stroke-linecap="round" fill="none"/></g>` +
		`<path d="${quarters(up.X, up.Y, COM_R)}" fill="${STONE_INK}"/><circle cx="${n2(up.X)}" cy="${n2(up.Y)}" r="${COM_R}" fill="none" stroke="${STONE_INK}" stroke-width="${HAIR}"/>`, 2);
	ink.mark([[up.X, up.Y - up.b], [up.X, y1]], DOT / 2, 'the ball\'s extension');
	ink.mark([[up.X, up.Y]], COM_R, 'the ball\'s centre');

	// ---- labels: the metre; the exaggeration, between the two balls; the note, between the rows
	const L = [];
	L.push(await placed('\\text{1 m}', (up.X + RX) / 2, dimY - HAIR / 2 - LABEL_GAP, 0.5, 1, INK));
	const low = out[1];
	const between = (up.Y + R + low.Y - Math.max(R, low.b)) / 2;
	L.push(await placed('\\text{shape change} \\times 10^{14}', Math.min(up.X - up.a, low.X - R), between, 0, 0.5, INK));
	// the note, between the two rings, beside the line that joins their centres
	L.push(await placed('\\text{15 kHz}', RX - 6, between, 1, 0.5, INK));

	ink.checkAll(L);
	window[name + '-numbers'] = { eps, ...nums, semi: out.map(({ a, b }) => [a, b]) };
	return finish(name, P, L, [240, 340]);
}
