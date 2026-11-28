// The tutorial, section 11.2 (tutorial/black-holes/spin.md), its second diagram: far away, a spinning hole's magnetic
// part along the line to it is a spinning ball's. Two spheres of pixels side by side, drawn as section 7.5's
// tut-spin-dipole-sky draws its right one (the paper's veiled sky, seen from a little above the equator), each tinted by
// the sign of the component along the line to the body: orange where it is negative, blue where positive, the tint
// fading to the page at the equator, where an ink contour marks the zero. Left, "spinning hole, B_nn = -6GJ cos theta /
// cr^4" (the chapter's boxed diagonal): a small near-black disc at the centre, edged in ink as in section 11.1's
// diagrams, with its spin axis, an ink arrow labelled J. Right, "spinning ball, B_nn = 6G(L.n)/cr^4" (7.5's spin
// dipole, n from the pixel toward the body): 7.5's lit stone ball with the same arrow, labelled L as 7.5 writes it. A
// key to the two tints stands under both.
// Departures from the diagram's comment: the spheres are seen 12 degrees from above, as in 7.5, so that the equator
// shows as an ellipse and the zero contour as its front half; the bodies are drawn over the veil and the tints (7.5
// veils its stone), so that the hole stays black and the stone keeps its light in both themes; the spin axis is drawn
// as in 7.5 but broken where it passes behind the body, so that it reads alike over the dark hole and the stone; the
// two spheres stay side by side on a phone, the figure being one drawing; each title has a third line that defines its
// angle or direction, "theta the pixel's angle from J" and "n from the pixel toward the ball", so that the two signs,
// - and +, are seen to agree (L.n = -J cos theta).
// Exact: the tint's sign at every place on both spheres and the zero contour, the equator, from the chapter's
// B_nn = -6GJ cos theta / cr^4 and from 7.5's eq:spin-dipole (asserted equal at every place in tut-kerr-lib.js and
// again here); the bands of tint are the zones between the latitudes 0, 4.5, 9, ... 90 degrees, each in its exact
// projection, and each zone's tint is the same strength at the same |B_nn| on both spheres and in either hemisphere.
// Schematic in strength: the tint's opacity, proportional to |cos theta| at the zone's middle, to a maximum.
// Pictorial: the stone, a picture from an image model (sprites/hair/ball.png), clipped to its exact circle; the sizes
// of the hole and the stone.
import { Sheet, ORIGIN, finish, checker, placed, near, LABEL_GAP, VEC, VEC_HEAD, n2 } from './tut-pot-lib.js';
import { INK, RULE, ACCENT, ACCENT2, sprite } from '../lib.js';
import { picture, circle as circlePath } from '../stone.js';
import { STONE_INK } from './tut-orb-lib.js';
import { viewer } from './tut-maxwell-lib.js';
import { stack } from './tut-gravitomag-lib.js';
import { chapter, palette, HOLE, kerrBnn, dipoleBnn, DEG } from './tut-kerr-lib.js';

const name = 'tut-kerr-far-field';
const check = checker(name);

const R = 66;                              // a sphere's radius, points
const TILT = 12;                           // degrees: the view from a little above the equator (7.5's)
const SKY = '#eeebe5', VEIL = 0.55;        // the paper's veil (tut-maxwell-sky, tut-spin-dipole-sky)
const OUTLINE = 0.5;
const CONTOUR = 0.5;                       // the zero contour, ink
const ZONE = 4.5;                          // degrees of latitude per band of tint
const TINT = 0.45;                         // the strongest tint's opacity (7.5's)
const RB = 11;                             // the stone's radius (7.5's)
const RH = 7.5;                              // the hole's radius
const EDGE = 0.45;                         // the hole's edge (11.1's)
const AXIS_BELOW = 0.42, AXIS_ABOVE = 0.62;    // the spin axis's ends, in sphere radii from the centre
const BREAK = 1.2;                         // the air between the axis and the body's rim, points
const APART = 34;                          // between the spheres
const ROW = 7, UNDER = 8;
const caption = 'Look first at the equator of each sphere: the magnetic part vanishes there and changes sign across it, for the hole as for the ball. Far away a spinning hole and a spinning ball of the same mass and angular momentum give the same pattern; the colour scale is schematic in strength.';

export default async function () {
	const { state } = await chapter(check);
	await palette(check);
	state(name, 'kerr-far-field', caption);
	const S = new Sheet(name);
	const L = [];
	const art = await sprite('/figures3d/sprites/hair/ball.png');
	// the sphere's frame: y the spin axis (up the page), x to the right, z toward the viewer before the tilt
	const view = viewer(0, TILT);
	const onSphere = (lat, lon) => [Math.cos(lat) * Math.cos(lon), Math.sin(lat), Math.cos(lat) * Math.sin(lon)];
	check(view(onSphere(90 * DEG, 0))[2] > 0, 'the north pole is not tipped toward the viewer');

	// ---- the physics: B_nn at a place of latitude lat (theta = 90 degrees - lat from the spin axis), J = 1, r = 1
	const J = 1e40, r = 1e9, unit = Math.abs(kerrBnn(J, 0, r));
	const hole = (lat) => kerrBnn(J, Math.PI / 2 - lat, r) / unit;
	const ball = (lat, lon) => dipoleBnn(J, Math.PI / 2 - lat, lon, r) / unit;
	for (const lat of [-80, -30, -5, 5, 30, 80]) for (const lon of [0, 70, 200]) {
		const a = hole(lat * DEG), b = ball(lat * DEG, lon * DEG);
		check(near(a, -Math.sin(lat * DEG), 1e-12) && near(b, a, 1e-12), `B_nn at ${lat}, ${lon}: ${a}, ${b}`);
		check(Math.sign(a) === (lat > 0 ? -1 : 1), `B_nn's sign at ${lat}`);
	}
	check(Math.abs(hole(0)) < 1e-15 && Math.abs(ball(0, 1.1)) < 1e-12, 'B_nn on the equator');

	/** The visible part of the cap of latitudes beyond `lat` (radians; north if > 0, south if < 0), as a closed path on
	 * the page about c: the front arc of its circle, then the rim of the sphere round the pole's side (7.5's). */
	function cap(c, lat) {
		const at = (q) => [c[0] + q[0] * R, c[1] - q[1] * R];
		const north = lat > 0;
		const N = 360, pts = Array.from({ length: N }, (_, k) => onSphere(lat, (2 * Math.PI * k) / N)).map(view);
		const front = pts.map((q) => q[2] > 0);
		if (front.every(Boolean)) return { d: 'M' + pts.map((q) => at(q).map((v) => v.toFixed(2)).join(',')).join('L') + 'Z', arc: [...pts, pts[0]].map(at) };
		if (!front.some(Boolean)) return null;
		const start = front.findIndex((f, k) => f && !front[(k - 1 + N) % N]);
		const run = [];
		for (let k = 0; k < N && front[(start + k) % N]; k++) run.push(pts[(start + k) % N]);
		const a1 = Math.atan2(run[run.length - 1][1], run[run.length - 1][0]), a0 = Math.atan2(run[0][1], run[0][0]);
		const poleSide = north ? Math.PI / 2 : -Math.PI / 2;
		const wrap = (a) => ((a % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
		const ccw = wrap(a0 - a1), passes = wrap(poleSide - a1) < ccw;
		const span = passes ? ccw : ccw - 2 * Math.PI;
		const rim = Array.from({ length: 91 }, (_, k) => { const a = a1 + (span * k) / 90; return [Math.cos(a), Math.sin(a)]; });
		const all = [...run, ...rim].map(at);
		return { d: 'M' + all.map((q) => q.map((v) => v.toFixed(2)).join(',')).join('L') + 'Z', arc: run.map(at) };
	}

	/** One sphere round a body at c; `isHole`: the left one. */
	async function sphere(c, isHole) {
		const what = isHole ? 'the hole' : 'the ball';
		const labels = [];
		// ---- the body, over the sky's veil and tints, so that the hole stays black and the stone keeps its light
		const rb = isHole ? RH : RB;
		if (isHole) S.raw(`<circle cx="${n2(c[0])}" cy="${n2(c[1])}" r="${rb}" fill="${HOLE}" stroke="${INK}" stroke-width="${EDGE}"/>`, 2.6);
		else S.raw(picture(`${name}-stone`, art, c[0], c[1], rb, circlePath(c[0], c[1], rb)) + `<path d="${circlePath(c[0], c[1], rb)}" fill="none" stroke="${STONE_INK}" stroke-width="0.35"/>`, 2.6);
		S.mark([c], rb, `${what}'s body`);
		// ---- the veil, then the tints, then the outline
		S.raw(`<circle cx="${n2(c[0])}" cy="${n2(c[1])}" r="${R}" fill="${SKY}" fill-opacity="${VEIL}"/>`, 2);
		// caps from the equator to the pole in steps of ZONE: each adds the opacity that brings the zone it opens to
		// TINT |B_nn| at its middle latitude, in the units of B_nn at the pole
		const sign = (lat) => (isHole ? hole(lat) : ball(lat, 0));
		const zones = Math.round(90 / ZONE);
		check(near(zones * ZONE, 90, 1e-12), 'the zones do not fill a hemisphere');
		for (const sgn of [1, -1]) {
			let prev = 0;
			for (let k = 0; k < zones; k++) {
				const mid = sgn * (k + 0.5) * ZONE * DEG;
				const want = TINT * Math.abs(sign(mid));
				check(near(want, TINT * Math.sin((k + 0.5) * ZONE * DEG), 1e-12), `the zone ${k}'s strength`);
				const a = 1 - (1 - want) / (1 - prev);         // stacked opacities: 1 - (1 - prev)(1 - a) = want
				prev = want;
				const cp = cap(c, sgn * k * ZONE * DEG + (k === 0 ? sgn * 1e-9 : 0));
				if (!cp) continue;
				const color = sign(mid) < 0 ? ACCENT : ACCENT2;
				check(color === (sgn > 0 ? ACCENT : ACCENT2), `${what}: the north is not orange`);
				S.raw(`<path d="${cp.d}" fill="${color}" fill-opacity="${a.toFixed(4)}"/>`, 2.1);
			}
		}
		// the zero contour: the front half of the equator
		const eq = cap(c, 1e-9);
		check(Math.max(...eq.arc.map((q) => q[1])) - c[1] - CONTOUR / 2 > rb + 1, `${what}'s zero contour touches the body`);
		S.path(eq.arc, { color: INK, width: CONTOUR, layer: 3, cap: 'butt', what: `${what}'s zero contour` });
		// ---- the spin axis: an ink arrow up the page, broken where it passes behind the body
		const lo = view([0, -AXIS_BELOW, 0]), hi = view([0, AXIS_ABOVE, 0]);
		const A = [c[0] + lo[0] * R, c[1] - lo[1] * R], Bp = [c[0] + hi[0] * R, c[1] - hi[1] * R];
		check(near(A[0], c[0], 1e-9) && near(Bp[0], c[0], 1e-9) && A[1] > c[1] + rb && Bp[1] < c[1] - rb, 'the spin axis is not up the page through the body');
		S.path([A, [c[0], c[1] + rb + BREAK]], { color: INK, width: VEC, layer: 4, cap: 'butt', what: `${what}'s axis below` });
		const ax = S.arrow([c[0], c[1] - rb - BREAK], Bp, { color: INK, width: VEC, head: VEC_HEAD, layer: 4, what: `${what}'s spin axis` });
		check(near(ax.u[0], 0, 1e-12) && ax.u[1] < 0, 'the spin axis does not point up the page');
		labels.push(await placed(isHole ? 'J' : '\\boldsymbol L', Bp[0] + 0.36 * VEC_HEAD + LABEL_GAP + 0.8, Bp[1] + 3.2, 0, 0.5, INK));
		S.raw(`<circle cx="${n2(c[0])}" cy="${n2(c[1])}" r="${R}" fill="none" stroke="${RULE}" stroke-width="${OUTLINE}"/>`, 3);
		S.mark(Array.from({ length: 361 }, (_, k) => [c[0] + R * Math.cos((k * Math.PI) / 180), c[1] + R * Math.sin((k * Math.PI) / 180)]), OUTLINE / 2, `${what}'s outline`);
		return labels;
	}

	// ---- the two spheres, their titles above and the key below
	const titles = [
		['\\text{spinning hole,}', '\\mathcal B_{nn} = -6GJ\\cos\\vartheta/cr^4\\text{,}', '\\vartheta\\text{ the pixel\'s angle from }J'],
		['\\text{spinning ball,}', '\\mathcal B_{nn} = 6G(\\boldsymbol L\\cdot\\hat{\\boldsymbol n})/cr^4\\text{,}', '\\hat{\\boldsymbol n}\\text{ from the pixel toward the ball}']
	];
	const top = ORIGIN - 140;
	const c0 = [ORIGIN - R - APART / 2, 0], c1 = [ORIGIN + R + APART / 2, 0];
	const T = [];
	for (const [k, t] of titles.entries()) T.push(await stack(t, [c0, c1][k][0], top, 0.5, INK));
	const tb = Math.max(...T.map((t) => t.box.b));
	c0[1] = c1[1] = tb + ROW + R;
	L.push(...T);
	L.push(...await sphere(c0, true));
	L.push(...await sphere(c1, false));
	// the key: a swatch of each tint and its sign, in one row centred under both spheres
	{
		const sw = 6.5, items = [['\\text{orange: negative}', ACCENT], ['\\text{blue: positive}', ACCENT2]], SPACE = 16;
		const probe = await Promise.all(items.map(([s]) => placed(s, 0, 0, 0, 0, INK)));
		const widths = probe.map((p) => sw + 3 + (p.box.r - p.box.l));
		let x = ORIGIN - (widths[0] + SPACE + widths[1]) / 2;
		const y = c0[1] + R + UNDER;
		const h = Math.max(...probe.map((p) => p.box.b - p.box.t));
		for (const [k, [src, color]] of items.entries()) {
			S.raw(`<rect x="${n2(x)}" y="${n2(y + h / 2 - sw / 2)}" width="${sw}" height="${sw}" fill="${color}" fill-opacity="${TINT}"/>`, 1);
			S.boxes.push({ box: { l: x, r: x + sw, t: y + h / 2 - sw / 2, b: y + h / 2 + sw / 2 }, what: `the swatch ${k}` });
			L.push(await placed(src, x + sw + 3, y + h / 2, 0, 0.5, INK));
			x += widths[k] + SPACE;
		}
	}

	S.checkAll(L);
	window[name + '-numbers'] = { radius: R, tilt: TILT };
	return finish(S, L, [280, 340]);
}
