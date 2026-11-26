// The tutorial, section 12.1 (tutorial/sky/stars.md), its fifth diagram: the Galaxy's columns of stars and of dust.
// At the top, a view from above of the paper's model Galaxy (reference/gravcam/galaxy.py, reproduced in
// tut-stars-lib.js): its stellar density in the mid-plane as a soft glow in matter's colour, on a logarithmic scale; the
// Sun 8.2 kpc from the centre; the two lines of sight from the Sun, to the centre and to the anticentre, each 25 kpc
// long. Under it, on the same scale of distance and aligned with it, two strips along the same lines, each running
// out from the Sun both ways: the stellar density at the Sun's 20 pc above the mid-plane, on a logarithmic axis, in
// matter's colour, with the columns it adds up to, 102 to 1; then the dust's extinction added up from the Sun, in
// magnitudes, 31 at the centre and 2.6 in all toward the anticentre. Dotted lines through the map and both strips at
// the Sun and at the centre.
// The columns, the 31 and the 2.6 are those of the model with the bulge flattened 0.6 and the Sun 20 pc up, added up
// in the chapter's steps of 0.15 pc out to 60 kpc (asserted in tut-stars-lib.js against galaxy.py's own numbers).
// Departures from the diagram's comment: the density strip's axis is logarithmic, since along the line to the centre
// the density rises 160 times from the Sun's into the bulge and on a linear axis the anticentre's would not show; so the
// columns are printed, 102 and 1, rather than read as areas, and the caption says so. The strips stand on one axis of
// distance from the Sun, the anticentre's side to the left; the density strip comes first, under the map whose glow
// it measures. The map's edges fade out over their last 2.5 kpc (a window, not the model), so that the glow has no
// hard border.
// Exact: the glow's shade, the log of the model's density at each pixel (between the floor 10^5.5 and the centre's
// value, M_sun kpc^-3), times the window; the two strips' curves, each sampled no more than a quarter of a point apart;
// the printed numbers, 102 (101.8), 31 (31.36) and 2.6 (2.62). Schematic: nothing.
import { INK, DIM, PAGE } from '../lib.js';
import { Sheet, ORIGIN, finish, checker, placed, near, n2, LABEL_GAP, HAIR, VEC } from './tut-pot-lib.js';
import { Plot, xAxis, yAxis } from './tut-prob-lib.js';
import { graph, longest } from './tut-fourier-lib.js';
import { DOT } from './tut-bessel-lib.js';
import { chapter, MATTER, stellar, R_SUN, Z_SUN } from './tut-stars-lib.js';

const name = 'tut-stars-columns';
const check = checker(name);

// ---- the drawing (points) ----------------------------------------------------------------------------------------
const K = 6.2;                               // points per kpc
const REACH = 25;                            // kpc along each line
const X0 = -R_SUN - REACH, X1 = -R_SUN + REACH;  // galactocentric x at the two ends
const MAP_H = 9;                             // kpc either side of the line, in the map
const SLANT = 0.5;                           // the map's depth, foreshortened: the disc seen from above at 60 degrees
const FLOOR = 6.3;                           // log10 of the glow's faintest density
const GAMMA = 1.4;                           // the glow's opacity as this power of the log density above the floor
const DEEP = 0.85;                           // the glow's strongest opacity
const PX = 3;                                // the glow's pixels per point
const GAP = 12;                              // between the map and the first strip, and between the strips
const DENS = { h: 62, y0: 3, y1: 10 };       // log10 M_sun kpc^-3
const EXT = { h: 52, y1: 70 };               // magnitudes
const MAIN = 0.75, SIGHT = 0.6, HALO = 0.7;
const SUN = 2.1;                             // the Sun's mark, its radius
const INSIDE = 5;                            // a strip's name, in from its axis at its top
const caption = 'Look first at the density strip: along the line toward the centre the density of stars rises into the bulge, and its column is 102 times the anticentre\'s. Below it, the dust\'s extinction climbs to 31 magnitudes along the same line, which hides that centre from light. Curves from the model.';

export default async function () {
	const { state, toward, away, ratio, centre } = await chapter(check);
	state(name, 'stars-columns', caption);
	check(Math.round(ratio) === 102 && Math.round(centre) === 31 && away.total.toFixed(1) === '2.6', 'the numbers');

	const S = new Sheet(name);
	const L = [];
	const W = (X1 - X0) * K;
	const left = ORIGIN - W / 2;
	const mapTop = ORIGIN - (2 * MAP_H * K + GAP + DENS.h + GAP + EXT.h) / 2;
	const X = (x) => left + (x - X0) * K;                     // galactocentric x to the page
	const lineY = mapTop + MAP_H * K;                         // the lines of sight, in the map
	const sunX = X(-R_SUN), centreX = X(0);
	check(near(centreX - sunX, R_SUN * K, 1e-9), 'the Sun is not 8.2 kpc from the centre');

	// ---- the map: the glow, a mask of the log density at z = 0, in matter's colour
	let defs = '';
	{
		const pw = Math.round(W * PX), ph = Math.round(2 * MAP_H * K * PX);
		const c = document.createElement('canvas');
		c.width = pw; c.height = ph;
		const ctx = c.getContext('2d'), img = ctx.createImageData(pw, ph);
		const top = Math.log10(stellar(0, 0, 0));
		check(top.toFixed(2) === '9.98', `the centre's density is 10^${top}`);
		const glow = (x, y) => DEEP * Math.max(0, Math.min(1, (Math.log10(stellar(x, y, 0)) - FLOOR) / (top - FLOOR))) ** GAMMA;
		let peak = 0;
		for (let j = 0; j < ph; j++) for (let i = 0; i < pw; i++) {
			// the pixel's place on the page, in kpc across and in foreshortened kpc up; the mid-plane's y is up / SLANT
			const x = X0 + ((i + 0.5) / pw) * (X1 - X0), up = MAP_H - ((j + 0.5) / ph) * 2 * MAP_H;
			const a = Math.round(255 * glow(x, up / SLANT));
			peak = Math.max(peak, a);
			img.data.set([255, 255, 255, a], 4 * (j * pw + i));
		}
		check(peak > 0.97 * 255 * DEEP, 'the glow does not reach its strongest at the centre');
		// the glow is gone before the map's edges: along them the density is below the floor
		for (let k = 0; k <= 400; k++) {
			const x = X0 + ((X1 - X0) * k) / 400, up = -MAP_H + (2 * MAP_H * k) / 400;
			check(glow(x, MAP_H / SLANT) === 0 && glow(X0, up / SLANT) === 0 && glow(X1, up / SLANT) < 0.01, `the glow reaches the map's edge near ${x}, ${up}`);
		}
		ctx.putImageData(img, 0, 0);
		const id = `${name}-glow`;
		defs += `<mask id="${id}" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="${n2(left)}" y="${n2(mapTop)}" width="${n2(W)}" height="${n2(2 * MAP_H * K)}"><image href="${c.toDataURL('image/png')}" x="${n2(left)}" y="${n2(mapTop)}" width="${n2(W)}" height="${n2(2 * MAP_H * K)}" preserveAspectRatio="none"/></mask>`;
		S.raw(`<rect x="${n2(left)}" y="${n2(mapTop)}" width="${n2(W)}" height="${n2(2 * MAP_H * K)}" fill="${MATTER}" mask="url(#${id})"/>`, 0);
	}
	// the lines of sight, on a halo of the page so that they read over the glow, with their heads at 25 kpc
	for (const [end, what] of [[X1, 'the line to the centre'], [X0, 'the line to the anticentre']]) {
		const a = [sunX + Math.sign(end - -R_SUN) * (SUN + 0.8), lineY], b = [X(end), lineY];
		S.path([a, [b[0] - Math.sign(end - -R_SUN) * 3, lineY]], { color: PAGE, width: SIGHT + 2 * HALO, layer: 1.5, cap: 'butt', what: `${what}'s halo` });
		S.arrow(a, b, { color: INK, width: SIGHT, head: 3.6, layer: 2, what });
	}
	// the Sun and the centre
	S.raw(`<circle cx="${n2(sunX)}" cy="${n2(lineY)}" r="${SUN + HALO}" fill="${PAGE}"/><circle cx="${n2(sunX)}" cy="${n2(lineY)}" r="${SUN}" fill="none" stroke="${INK}" stroke-width="${HAIR}"/><circle cx="${n2(sunX)}" cy="${n2(lineY)}" r="0.55" fill="${INK}"/>`, 2.5);
	S.mark([[sunX, lineY]], SUN + HALO, 'the Sun');
	L.push(await placed('\\text{Sun}', sunX, lineY - SUN - HALO - LABEL_GAP - 0.6, 0.5, 1, INK));
	L.push(await placed('\\text{centre}', centreX, mapTop - 0.4, 0.5, 1, INK));
	L.push(await S.clear('\\text{to the centre}', X(X1 - 1.2), lineY + LABEL_GAP + 1.2, 1, 0, [0, 1], { color: INK }));
	L.push(await S.clear('\\text{to the anticentre}', X(X0 + 1.2), lineY + LABEL_GAP + 1.2, 0, 0, [0, 1], { color: INK }));

	// ---- the strips
	const densTop = mapTop + 2 * MAP_H * K + GAP, extTop = densTop + DENS.h + GAP;
	const A = new Plot({ left, top: densTop, w: W, h: DENS.h, x0: X0, x1: X1, y0: DENS.y0, y1: DENS.y1 });
	const B = new Plot({ left, top: extTop, w: W, h: EXT.h, x0: X0, x1: X1, y0: 0, y1: EXT.y1 });
	const distanceTicks = [-25, -20, -15, -10, -5, 0, 5, 10, 15, 20, 25].map((s) => -R_SUN + s);
	// the density along the lines, at the Sun's height
	{
		await xAxis(S, A, { ticks: distanceTicks, fmt: () => null, what: 'the density strip\'s axis' });
		const yl = await yAxis(S, A, { ticks: [4, 6, 8, 10], fmt: (t) => `10^{${t}}`, what: 'the density axis' });
		L.push(...yl);
		const f = (x) => Math.log10(stellar(x, 0, Z_SUN));
		// the cusp at the centre is sampled on both sides of it
		const pts = [...graph(A, f, X0, 0), ...graph(A, f, 0, X1).slice(1)];
		check(longest(pts) <= 0.26 && pts.every(([, y]) => y >= A.top && y <= A.bottom), 'the density curve is not fine or leaves its strip');
		check(near(f(-R_SUN + REACH * 0), Math.log10(toward.density(0)), 1e-12) && near(f(X0), Math.log10(away.density(REACH)), 1e-12), 'the strip is not the lines\' density');
		S.path(pts, { color: MATTER, width: MAIN, layer: 3, cap: 'butt', what: 'the density' });
		L.push(await placed('\\text{density of stars }(M_\\odot\\,\\mathrm{kpc^{-3}})', A.left + INSIDE, A.top, 0, 0, MATTER));
		// the columns, relative: the anticentre's 1, the centre's 102
		L.push(await S.clear(`\\text{column }${Math.round(ratio)}`, X(6.5), A.Y(8.6), 0, 0.5, [1, 0], { color: MATTER }));
		L.push(await S.clear('\\text{column }1', X(-R_SUN - 13), A.Y(7.6), 0.5, 0.5, [0, 1], { color: MATTER }));
		window[name + '-numbers'] = { ratio, centre, away: away.total, top: f(0), sun: f(-R_SUN), ends: [f(X0), f(X1)] };
	}
	// the dust's extinction, added up from the Sun outward both ways
	{
		const xl = await xAxis(S, B, { ticks: distanceTicks, fmt: (t) => String(Math.round(Math.abs(t + R_SUN))), what: 'the distance axis' });
		L.push(...xl);
		L.push(await placed('\\text{distance from the Sun (kpc)}', sunX, Math.max(...xl.map((l) => l.box.b)) + 4, 0.5, 0, DIM));
		const yl = await yAxis(S, B, { ticks: [0, 20, 40, 60], fmt: (t) => (t === 0 ? null : String(t)), what: 'the extinction axis' });
		L.push(...yl);
		L.push(await placed('\\text{extinction (magnitudes)}', B.left + INSIDE, B.top, 0, 0, DIM));
		const ext = (x) => (x >= -R_SUN ? toward.extinction(x + R_SUN) : away.extinction(-R_SUN - x));
		const pts = [...graph(B, ext, X0, -R_SUN), ...graph(B, ext, -R_SUN, X1).slice(1)];
		check(longest(pts) <= 0.26 && pts.every(([, y]) => y >= B.top && y <= B.bottom + 1e-9), 'the extinction curve is not fine or leaves its strip');
		check(near(ext(X0), away.extinction(REACH), 1e-12) && Math.abs(away.extinction(REACH) - away.total) < 0.005 && away.extinction(REACH).toFixed(1) === '2.6', 'the anticentre\'s extinction at 25 kpc is not its total to 0.005');
		S.path(pts, { color: INK, width: MAIN, layer: 3, cap: 'butt', what: 'the extinction' });
		// 31 at the centre
		const c = B.at(0, centre);
		S.raw(`<circle cx="${n2(c[0])}" cy="${n2(c[1])}" r="${DOT}" fill="${INK}"/>`, 4);
		S.mark([c], DOT, 'the centre\'s extinction');
		L.push(await S.clear(`${Math.round(centre)}\\text{ at the centre}`, c[0] + LABEL_GAP + 1, c[1] + 1, 0, 0, [1, 0], { color: INK }));
		L.push(await S.clear(`${away.total.toFixed(1)}\\text{ in all}`, X(X0 + 0.6), B.Y(away.total) - LABEL_GAP - 0.6, 0, 1, [0, -1], { color: INK }));
	}
	// the Sun's and the centre's lines down through the map and the strips, dotted
	for (const [x, what, from] of [[sunX, 'the Sun\'s line', lineY + SUN + HALO + 0.8], [centreX, 'the centre\'s line', mapTop + LABEL_GAP + 0.4]]) {
		S.dots([x, from], [x, B.bottom], { color: DIM, clear0: 0, clear1: 0, layer: 0.5, what });
	}
	void VEC;

	S.checkAll(L);
	return finish(S, L, [300, 370], defs);
}
