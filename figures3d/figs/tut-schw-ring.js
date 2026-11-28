// The tutorial, section 11.1 (tutorial/black-holes/schwarzschild.md), its fifth diagram: a mass is a lens with a line
// of foci, and its Einstein ring. Two panels side by side. Left, not to scale: a far source off the panel to the left
// (named at the axis's left end, "source far away"), the mass M (an ink dot), the camera (a small ink square) on the
// axis at the distance d to the right; parallel rays from the left at +-b_E, +-1.2 b_E and +-1.4 b_E, each turned
// toward the axis at the mass by 2r_s/b, so that it crosses the axis at b^2/2r_s: the pair at b_E meets at the camera,
// the others cross farther on, at 1.44 d and 1.96 d, marked by ticks on the line of foci. Dimensions: b_E (from the
// axis to the upper ray, before the mass), d (from the mass to the camera) and b^2/2r_s (from the mass to the farthest
// crossing). Right: two skies as discs in the page's faint tint, angles from the centre drawn in proportion. "at d":
// the mass at the centre and the Einstein ring at sqrt(2r_s/d). "at 40 GM/c^2", out to 22 degrees: the shadow filled
// dark (7.27 degrees), the exact ring (20.2 degrees, solid) and the weak-field ring (18.1 degrees, dashed). Rays and
// rings in the light role's colour; everything else in ink and the page's greys.
// Departures from the diagram's comment: the source is not drawn but named, "source far away", at the left end of the
// axis, where the rays come in parallel, as from a source far away; the line of foci's crossings are ticked; the skies
// are named under them; the numbers stand beside the circles they name ("sqrt(2r_s/d)" and "20.2" outside the solid
// rings, up and to the right, "18.1" inside the dashed one, "7.27" under the shadow); the first sky's ring radius is
// schematic.
// Exact: in the left panel, the geometry of the thin lens it draws (each ray turned by 2r_s/b crosses the axis at
// b^2/2r_s, so the crossings stand at (b/b_E)^2 d, asserted); in the second sky, the three radii in proportion to the
// angles, which tut-schw-lib.js computes (the exact ring by the port of the chapter's integrator) and asserts against
// the chapter's text. Schematic, as the caption says: the left panel's proportions (2r_s, d, the b), and the first
// sky's ring radius.
import { Sheet, ORIGIN, finish, checker, placed, boxOf, LABEL_GAP, HAIR, SIZE, n2 } from './tut-pot-lib.js';
import { pathOf } from './tut-prob-lib.js';
import { tex, INK, DIM } from '../lib.js';
import { chapter, palette, near, LIGHT, HOLE, DEG } from './tut-schw-lib.js';

const name = 'tut-schw-ring';
const check = checker(name);

// ---- the drawing (points) ----------------------------------------------------------------------------------------
const BE = 26;                                  // b_E on the page
const D = 56;                                   // d on the page, so 2r_s = BE^2 / D
const KS = [1, 1.2, 1.4];                       // the rays' b over b_E
const IN = 46;                                  // the rays come in from this far left of the mass
const SOURCE = 4.5;                             // the source's name, this far left of the rays' and the axis's left end
const SKIP = 1.8;                               // between the lines of the source's name
const OUT = 118;                                // the rays and the axis run to this far right of the mass
const SKY = { R: 33, gap: 14, apart: 10, field: 22, ring1: 0.88 };   // the skies: radius, from the left panel, between, field (deg), first ring
const TINT = '#eeebe5';
const RAY = 0.6, LINE = 0.45, EDGE = 0.45, DOT = 0.5, DOT_STEP = 1.6, MASS = 2.2, CAMERA = 4.2, TICK = 2.4, DIMS = [44, 58];
const DASH = [2.2, 1.6];
const caption = 'Look first at the two rays meeting at the camera: they pass at the Einstein radius, and by symmetry so does every ray at that distance, so the source appears as a ring. Near a hole (right) the exact ring is larger than the weak-field one. The left panel is not to scale.';

export default async function () {
	const { state, shadow40, ring40, weak40 } = await chapter(check);
	await palette(check);
	state(name, 'schw-ring', caption);

	const S = new Sheet(name);
	const L = [];
	let dBase = 0;
	const m = [ORIGIN - 120, ORIGIN];           // the mass
	const twoRs = (BE * BE) / D;
	const cross = (b) => (b * b) / twoRs;       // b^2 / 2r_s, page
	check(near(cross(BE), D, 1e-12), 'the camera is not at b_E^2/2r_s');
	KS.forEach((k) => check(near(cross(k * BE), k * k * D, 1e-12), `the ray at ${k} b_E does not cross at ${k * k} d`));
	check(cross(KS[2] * BE) < OUT - 6, 'the farthest crossing is off the panel');

	// ---- left: the axis, dotted, from the source to the right end
	{
		const a = [m[0] - IN, m[1]], z = [m[0] + OUT, m[1]];
		const n = Math.round((z[0] - a[0]) / DOT_STEP), step = (z[0] - a[0]) / n;
		const dots = Array.from({ length: n + 1 }, (_, i) => [a[0] + i * step, a[1]]);
		S.raw(`<path d="${dots.map(([x, y]) => `M${n2(x)},${n2(y)}h0`).join('')}" stroke="${DIM}" stroke-width="${DOT}" stroke-linecap="round" fill="none"/>`, 1);
		S.mark([a, z], DOT / 2, 'the axis');
	}
	// the mass, the camera; the source is far off the panel to the left, named at the axis's left end
	S.raw(`<circle cx="${n2(m[0])}" cy="${n2(m[1])}" r="${MASS}" fill="${INK}"/>`, 3);
	S.mark([m], MASS, 'the mass');
	const cam = [m[0] + D, m[1]];
	S.raw(`<rect x="${n2(cam[0] - CAMERA / 2)}" y="${n2(cam[1] - CAMERA / 2)}" width="${CAMERA}" height="${CAMERA}" fill="${INK}"/>`, 4);
	S.boxes.push({ box: { l: cam[0] - CAMERA / 2, r: cam[0] + CAMERA / 2, t: cam[1] - CAMERA / 2, b: cam[1] + CAMERA / 2 }, what: 'the camera' });

	// the rays: in from the left at +-b, turned at the mass's plane, on to the camera (b_E) or to the right end
	for (const k of KS) for (const s of [1, -1]) {
		const b = k * BE, y0 = m[1] - s * b, c = cross(b);
		const pts = [[m[0] - IN, y0], [m[0], y0]];
		if (k === 1) pts.push([cam[0] - CAMERA / 2 - 0.2, m[1] - s * b * (1 - (D - CAMERA / 2 - 0.2) / c)]);
		else pts.push([m[0] + OUT, m[1] - s * b * (1 - OUT / c)]);
		// turned by b / (b^2 / 2r_s) = 2r_s / b
		check(near((pts[1][1] - pts[2][1]) / (pts[2][0] - pts[1][0]) * s * -1, twoRs / b, 1e-12), `the ray at ${k} b_E is not turned by 2r_s/b`);
		S.path(pts, { color: LIGHT, width: RAY, layer: 2, cap: 'butt', what: `the ray at ${s * k} b_E` });
	}
	// the crossings beyond the camera, ticked on the line of foci
	for (const k of KS.slice(1)) {
		const x = m[0] + cross(k * BE);
		S.path([[x, m[1] - TICK], [x, m[1] + TICK]], { color: INK, width: HAIR, layer: 2.5, cap: 'butt', what: `the crossing at ${k} b_E` });
	}

	// ---- the dimensions: b_E before the mass; d and b^2/2r_s under the axis
	{
		const x = m[0] - 12;
		S.path([[x, m[1]], [x, m[1] - BE]], { color: INK, width: HAIR, layer: 2.5, cap: 'butt', what: 'b_E' });
		L.push(await placed('b_E', x - HAIR / 2 - LABEL_GAP, m[1] - BE / 2, 1, 0.5, INK));
		const low = m[1] + KS[2] * BE;          // the lowest ray, before the mass
		const dim = async (to, y, src2) => {
			S.path([[m[0], y], [to, y]], { color: INK, width: HAIR, layer: 2.5, cap: 'butt', what: `the dimension ${src2}` });
			for (const xx of [m[0], to]) S.path([[xx, y - 2.2], [xx, y + 2.2]], { color: INK, width: HAIR, layer: 2.5, cap: 'butt', what: `the dimension ${src2}'s end` });
			return placed(src2, (m[0] + to) / 2, y + 2.2 + LABEL_GAP, 0.5, 0, INK);
		};
		check(m[1] + DIMS[0] - 2.2 > low + 3, 'the dimensions run into the lowest ray');
		const dl = await dim(cam[0], m[1] + DIMS[0], 'd');
		L.push(dl);
		dBase = dl.box.b;                       // d has no descender: its ink's bottom is its baseline
		L.push(await dim(m[0] + cross(KS[2] * BE), m[1] + DIMS[1], 'b^2/2r_s'));
	}
	// the names: the source, far away, left of the axis's end and the rays' (two lines, right-aligned, centred on the
	// axis), and M
	{
		const rows = ['\\text{source}', '\\text{far away}'];
		const probe = [];
		for (const r of rows) probe.push(await placed(r, 0, 0, 1, 0, INK));
		const h = probe.reduce((t, p) => t + (p.box.b - p.box.t), 0) + SKIP;
		const parts = [];
		let t = m[1] - h / 2;
		for (const r of rows) { const g = await placed(r, m[0] - IN - SOURCE, t, 1, 0, INK); parts.push(g); t = g.box.b + SKIP; }
		L.push({ src: 'source far away', svg: parts.map((g) => g.svg).join(''), box: { l: Math.min(...parts.map((g) => g.box.l)), r: Math.max(...parts.map((g) => g.box.r)), t: parts[0].box.t, b: parts[1].box.b } });
	}
	L.push(await S.clear('M', m[0] + 2, m[1] - MASS - LABEL_GAP, 0, 1, [0.5, -0.87]));

	// ---- right: the two skies
	const c1 = [m[0] + OUT + SKY.gap + SKY.R, m[1]], c2 = [c1[0] + 2 * SKY.R + SKY.apart, m[1]];
	const disc = (c, r) => Array.from({ length: 361 }, (_, i) => [c[0] + r * Math.cos((i * Math.PI) / 180), c[1] + r * Math.sin((i * Math.PI) / 180)]);
	for (const c of [c1, c2]) S.raw(`<path d="${pathOf(disc(c, SKY.R))}" fill="${TINT}"/>`, 0.5);
	// the first sky: the mass and the ring at sqrt(2r_s/d), named outside the disc, up and to the right, as the second
	// sky's exact ring is
	const u45 = [Math.cos(-Math.PI / 4), Math.sin(-Math.PI / 4)];
	{
		const r1 = SKY.ring1 * SKY.R;
		S.raw(`<circle cx="${n2(c1[0])}" cy="${n2(c1[1])}" r="${MASS}" fill="${INK}"/>`, 3);
		S.mark([c1], MASS, 'the first sky\'s mass');
		S.path(disc(c1, r1), { color: LIGHT, width: RAY, layer: 2, what: 'the first ring' });
		L.push(await S.clear('\\sqrt{2r_s/d}', c1[0] + (SKY.R + 1) * u45[0], c1[1] + (SKY.R + 1) * u45[1], 0, 1, u45));
	}
	// the second sky, at 40 GM/c^2, angles in proportion out to the field's edge
	{
		const k = SKY.R / (SKY.field * DEG);
		const [rs, rw, re] = [shadow40, weak40, ring40].map((a) => a * k);
		check(re < SKY.R - 2 && rw < re && rs < rw, 'the second sky\'s circles');
		S.raw(`<circle cx="${n2(c2[0])}" cy="${n2(c2[1])}" r="${n2(rs)}" fill="${HOLE}" stroke="${INK}" stroke-width="${EDGE}"/>`, 2);
		S.mark(disc(c2, rs), EDGE / 2, 'the shadow');
		S.path(disc(c2, re), { color: LIGHT, width: RAY, layer: 2, what: 'the exact ring' });
		// the weak ring, dashed, a whole number of dashes
		{
			const len = 2 * Math.PI * rw, n = Math.round(len / (DASH[0] + DASH[1])), f = len / (n * (DASH[0] + DASH[1]));
			S.raw(`<circle cx="${n2(c2[0])}" cy="${n2(c2[1])}" r="${n2(rw)}" fill="none" stroke="${LIGHT}" stroke-width="${RAY}" stroke-dasharray="${n2(DASH[0] * f)} ${n2(DASH[1] * f)}" transform="rotate(-90 ${n2(c2[0])} ${n2(c2[1])})"/>`, 2);
			S.mark(disc(c2, rw), RAY / 2, 'the weak ring');
		}
		const deg = (a, p) => `${(a / DEG).toFixed(p)}^\\circ`;
		check(deg(shadow40, 2) === '7.27^\\circ' && deg(ring40, 1) === '20.2^\\circ' && deg(weak40, 1) === '18.1^\\circ', 'the numbers');
		// 20.2 outside the solid ring, up and to the right; 18.1 inside the dashed ring, at its top; 7.27 under the shadow
		L.push(await S.clear(deg(ring40, 1), c2[0] + (SKY.R + 1) * u45[0], c2[1] + (SKY.R + 1) * u45[1], 0, 1, u45));
		L.push(await S.clear(deg(weak40, 1), c2[0], c2[1] - rw + RAY / 2 + LABEL_GAP + 0.3, 0.5, 0, [0, 1]));
		L.push(await placed(deg(shadow40, 2), c2[0], c2[1] + rs + EDGE / 2 + LABEL_GAP + 0.3, 0.5, 0, INK));
	}
	// the skies' names, under them on one baseline
	{
		// on the baseline of the name d, so that the two rows of names under the panels are one
		const base = dBase;
		check(base > m[1] + SKY.R + 8, 'the skies\' names run into the skies');
		for (const [c, s] of [[c1, '\\text{at }d'], [c2, '\\text{at }40\\,GM/c^2']]) {
			const g = await tex(s, [c[0], base], SIZE, 'cB', INK);
			L.push({ src: s, svg: g, box: boxOf(g) });
		}
	}

	S.checkAll(L);
	window[name + '-numbers'] = { twoRs, crossings: KS.map((k) => cross(k * BE) / D), shadow: shadow40 / DEG, ring: ring40 / DEG, weak: weak40 / DEG };
	return finish(S, L, [300, 380]);
}
