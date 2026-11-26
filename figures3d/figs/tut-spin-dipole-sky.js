// The tutorial, section 7.5 (tutorial/geometry/gravitomagnetism.md), its second diagram: the sign of the tide along the
// line to a body, over a sphere of pixels round it. Two spheres side by side, each round a central stone body, seen from
// the side and a little from above (the paper's veiled sky, as section 6.6's tut-maxwell-sky), tinted by the sign of
// the component along the line to the body: orange where it is negative, blue where positive, the tint fading to the
// page where it is zero, with a thin ink contour at zero. Left, "point mass, E_nn = -2GM/r^3": orange all over. Right,
// "spin dipole, B_nn = 6G(L.n)/cr^4", n from the sphere toward the body: orange over the northern hemisphere, blue over
// the southern, the zero contour on the equator, and the spin axis L as an ink arrow through the body. Under the right
// sphere: "B_nn vanishes on the equator, where the pixel reads B_xz"; under the left one, the key to the two tints.
// Departures from the diagram's comment: the spheres are seen a little from above (12 degrees), not exactly from the
// side, so that the equator shows as an ellipse and the zero contour as the front half of it; the body is drawn over
// the tints, as if seen through them, so that the tints can be strong (at most 0.75 opaque, so that they read as the
// paper's orange ACCENT and blue ACCENT2 and not as the stone's tan) and the body still shows. A key to the tints
// stands under the left sphere, its swatches at the tints' full strength.
// Exact: the tint's sign at every place on the sphere and the zero contour, the equator, from B_nn = 6G(L.n)/cr^4
// (asserted against eq:spin-dipole in tut-gravitomag-lib.js); the bands of tint are the zones between the latitudes
// 0, 4.5, 9, ... 90 degrees, each in its exact projection (asserted on the sphere), and each zone's tint is the same
// strength at the same |B_nn| in either hemisphere. Schematic in strength: the tint's opacity, proportional to |B_nn| at
// the zone's middle latitude, to a maximum, and on the left uniform at that maximum. Pictorial: the stone, a picture
// from an image model (sprites/hair/ball.png), clipped to its exact circle; its size.
import { Sheet, ORIGIN, finish, checker, placed, near, LABEL_GAP, VEC, VEC_HEAD } from './tut-pot-lib.js';
import { INK, DIM, RULE, ACCENT, ACCENT2, sprite } from '../lib.js';
import { picture, circle as circlePath } from '../stone.js';
import { STONE_INK } from './tut-orb-lib.js';
import { viewer } from './tut-maxwell-lib.js';
import { chapter, palette, stack, spinDipole, electricPoint, dot, apply, G, C } from './tut-gravitomag-lib.js';

const name = 'tut-spin-dipole-sky';
const check = checker(name);

const R = 50;                              // a sphere's radius, points
const TILT = 12;                           // degrees: the view from a little above the equator
const SKY = '#eeebe5', VEIL = 0.55;        // the paper's veil (tut-maxwell-sky)
const OUTLINE = 0.5;
const CONTOUR = 0.5;                       // the zero contour, ink
const ZONE = 4.5;                          // degrees of latitude per band of tint
const TINT = 0.75;                         // the strongest tint's opacity: strong enough to read as the paper's orange and blue, not the stone's tan
const RB = 11;                             // the body's radius
const AXIS_BELOW = 0.42, AXIS_ABOVE = 0.66;    // the spin axis's ends, in sphere radii from the centre
const APART = 22;                          // between the spheres
const ROW = 7, UNDER = 7;

export default async function () {
	const nums = chapter(check);
	await palette(check);
	const S = new Sheet(name);
	const L = [];
	const art = await sprite('/figures3d/sprites/hair/ball.png');
	// the sphere's frame: y the spin axis (up the page), x to the right, z toward the viewer before the tilt
	const view = viewer(0, TILT);
	const DEG = Math.PI / 180;
	const onSphere = (lat, lon) => [Math.cos(lat) * Math.cos(lon), Math.sin(lat), Math.cos(lat) * Math.sin(lon)];
	check(view(onSphere(90 * DEG, 0))[2] > 0, 'the north pole is not tipped toward the viewer');

	// ---- the physics: the sign and size of the component along the line to the body, n = -p for a place p
	const Lv = [0, 1, 0];
	const Bnn = (p) => { const n = p.map((a) => -a); return dot(n, apply(spinDipole(Lv, n, 1), n)); };
	const Enn = (p) => { const n = p.map((a) => -a); return dot(n, apply(electricPoint(1, n, 1), n)); };
	for (const lat of [-80, -30, -5, 5, 30, 80]) for (const lon of [0, 70, 200]) {
		const p = onSphere(lat * DEG, lon * DEG);
		check(near(Bnn(p) / ((6 * G) / C), -Math.sin(lat * DEG), 1e-12), `B_nn at ${lat}, ${lon}`);
		check(Math.sign(Bnn(p)) === (lat > 0 ? -1 : 1), `B_nn's sign at ${lat}`);
		check(near(Enn(p) / G, -2, 1e-12), 'E_nn is not -2 G M / r^3');
	}
	check(Math.abs(Bnn(onSphere(0, 1.1))) < 1e-30, 'B_nn on the equator');

	/** The visible part of the cap of latitudes beyond `lat` (radians; north if > 0, south if < 0), as a closed path on
	 * the page about c: the front arc of its circle, then the rim of the sphere round the pole's side. */
	function cap(c, lat) {
		const at = (q) => [c[0] + q[0] * R, c[1] - q[1] * R];
		const north = lat > 0;
		// the circle of latitude, sampled; the front where depth > 0
		const N = 360, pts = Array.from({ length: N }, (_, k) => onSphere(lat, (2 * Math.PI * k) / N)).map(view);
		const front = pts.map((q) => q[2] > 0);
		if (front.every(Boolean)) return { d: 'M' + pts.map((q) => at(q).map((v) => v.toFixed(2)).join(',')).join('L') + 'Z', arc: [...pts, pts[0]].map(at) };
		if (!front.some(Boolean)) return null;
		// the run of front points, in order
		const start = front.findIndex((f, k) => f && !front[(k - 1 + N) % N]);
		const run = [];
		for (let k = 0; k < N && front[(start + k) % N]; k++) run.push(pts[(start + k) % N]);
		// the rim from the run's end back to its start, round the pole's side of the page
		const a1 = Math.atan2(run[run.length - 1][1], run[run.length - 1][0]), a0 = Math.atan2(run[0][1], run[0][0]);
		const poleSide = north ? Math.PI / 2 : -Math.PI / 2;
		// go from a1 to a0 the way that passes poleSide
		const wrap = (a) => ((a % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
		const ccw = wrap(a0 - a1), passes = wrap(poleSide - a1) < ccw;
		const span = passes ? ccw : ccw - 2 * Math.PI;
		const rim = Array.from({ length: 91 }, (_, k) => { const a = a1 + (span * k) / 90; return [Math.cos(a), Math.sin(a)]; });
		const all = [...run, ...rim].map(at);
		return { d: 'M' + all.map((q) => q.map((v) => v.toFixed(2)).join(',')).join('L') + 'Z', arc: run.map(at) };
	}

	/** One sphere round a body at c; `spin`: the right one. */
	async function sphere(c, spin) {
		const what = spin ? 'the spin dipole' : 'the point mass';
		const labels = [];
		// ---- the body, over the veil and the tints (as if seen through the sky's near half), under the contour and the axis
		S.raw(picture(`${name}-stone${spin ? 1 : 0}`, art, c[0], c[1], RB, circlePath(c[0], c[1], RB)) + `<path d="${circlePath(c[0], c[1], RB)}" fill="none" stroke="${STONE_INK}" stroke-width="0.35"/>`, 2.5);
		S.mark([c], RB, `${what}'s body`);
		// ---- the veil, then the tints, then the outline
		S.raw(`<circle cx="${c[0].toFixed(2)}" cy="${c[1].toFixed(2)}" r="${R}" fill="${SKY}" fill-opacity="${VEIL}"/>`, 2);
		if (!spin) S.raw(`<circle cx="${c[0].toFixed(2)}" cy="${c[1].toFixed(2)}" r="${R}" fill="${ACCENT}" fill-opacity="${TINT}"/>`, 2.1);
		else {
			// caps from the equator to the pole in steps of ZONE: each adds the opacity that brings the zone it opens to
			// TINT |sin(middle latitude)|, so that the zones' strengths follow |B_nn|
			const zones = Math.round(90 / ZONE);
			check(near(zones * ZONE, 90, 1e-12), 'the zones do not fill a hemisphere');
			for (const sgn of [1, -1]) {
				let prev = 0;
				for (let k = 0; k < zones; k++) {
					const want = TINT * Math.sin(((k + 0.5) * ZONE) * DEG);     // the zone k's strength
					// stacked opacities: 1 - (1 - prev)(1 - a) = want
					const a = 1 - (1 - want) / (1 - prev);
					prev = want;
					const cp = cap(c, sgn * k * ZONE * DEG + (k === 0 ? sgn * 1e-9 : 0));
					if (!cp) continue;
					S.raw(`<path d="${cp.d}" fill="${sgn > 0 ? ACCENT : ACCENT2}" fill-opacity="${a.toFixed(4)}"/>`, 2.1);
				}
			}
			// the zones' signs: north orange (B_nn < 0), south blue
			check(Bnn(onSphere(40 * DEG, 0)) < 0 && Bnn(onSphere(-40 * DEG, 0)) > 0, 'the tints do not follow B_nn');
			// the zero contour: the front half of the equator
			const eq = cap(c, 1e-9);
			S.path(eq.arc, { color: INK, width: CONTOUR, layer: 3, cap: 'butt', what: `${what}'s zero contour` });
			for (const q of eq.arc.filter((_, k) => k % 40 === 0)) {
				const p = [(q[0] - c[0]) / R, -(q[1] - c[1]) / R];
				check(near(Math.hypot(...p), 1, 0.2) || Math.hypot(...p) <= 1 + 1e-9, 'the contour leaves the sphere');
			}
			// ---- the spin axis: an ink arrow along y through the body
			const lo = view([0, -AXIS_BELOW, 0]), hi = view([0, AXIS_ABOVE, 0]);
			const A = [c[0] + lo[0] * R, c[1] - lo[1] * R], Bp = [c[0] + hi[0] * R, c[1] - hi[1] * R];
			const ax = S.arrow(A, Bp, { color: INK, width: VEC, head: VEC_HEAD, layer: 4, what: 'the spin axis' });
			check(near(ax.u[0], 0, 1e-12) && ax.u[1] < 0, 'the spin axis is not up the page');
			labels.push(await placed('\\boldsymbol L', Bp[0] + 0.36 * VEC_HEAD + LABEL_GAP + 0.8, Bp[1] + 3.2, 0, 0.5, INK));
		}
		S.raw(`<circle cx="${c[0].toFixed(2)}" cy="${c[1].toFixed(2)}" r="${R}" fill="none" stroke="${RULE}" stroke-width="${OUTLINE}"/>`, 3);
		S.mark(Array.from({ length: 361 }, (_, k) => [c[0] + R * Math.cos((k * Math.PI) / 180), c[1] + R * Math.sin((k * Math.PI) / 180)]), OUTLINE / 2, `${what}'s outline`);
		return labels;
	}

	// ---- the two spheres, their titles above and their notes below
	const titles = [
		['\\text{point mass,}', '\\mathcal E_{nn} = -2GM/r^3'],
		['\\text{spin dipole,}', '\\mathcal B_{nn} = 6G(\\boldsymbol L\\cdot\\hat{\\boldsymbol n})/cr^4']
	];
	const top = ORIGIN - 120;
	const c0 = [ORIGIN - R - APART / 2, 0], c1 = [ORIGIN + R + APART / 2, 0];
	const T = [];
	for (const [k, t] of titles.entries()) T.push(await stack(t, [c0, c1][k][0], top, 0.5, INK));
	const tb = Math.max(...T.map((t) => t.box.b));
	c0[1] = c1[1] = tb + ROW + R;
	L.push(...T);
	L.push(...await sphere(c0, false));
	L.push(...await sphere(c1, true));
	const below = c0[1] + R + UNDER;
	L.push(await stack(['\\mathcal B_{nn}\\text{ vanishes on the equator,}', '\\text{where the pixel reads }\\mathcal B_{xz}'], c1[0], below, 0.5, INK));
	// the key: a swatch of each tint and its sign
	{
		const sw = 6.5, lines = [['\\text{orange: negative}', ACCENT], ['\\text{blue: positive}', ACCENT2]];
		const probe = await Promise.all(lines.map(([s]) => placed(s, 0, 0, 0, 0, INK)));
		const wide = Math.max(...probe.map((p) => p.box.r - p.box.l)) + sw + 3;
		let y = below;
		for (const [k, [src, color]] of lines.entries()) {
			const h = probe[k].box.b - probe[k].box.t, x = c0[0] - wide / 2;
			S.raw(`<rect x="${x.toFixed(2)}" y="${(y + h / 2 - sw / 2).toFixed(2)}" width="${sw}" height="${sw}" fill="${color}" fill-opacity="${TINT}"/>`, 1);
			S.boxes.push({ box: { l: x, r: x + sw, t: y + h / 2 - sw / 2, b: y + h / 2 + sw / 2 }, what: `the swatch ${k}` });
			L.push(await placed(src, x + sw + 3, y + h / 2, 0, 0.5, INK));
			y += h + LABEL_GAP + 0.3;
		}
	}

	S.checkAll(L);
	window[name + '-numbers'] = { ...nums, radius: R, tilt: TILT };
	return finish(S, L, [220, 300]);
}
