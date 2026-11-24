// The tutorial, chapter 12.1 (tutorial/sky/stars.md), its third diagram: where dead stars end. Mass (solar masses,
// linear, 0 to 2.5) against radius (km, logarithmic, 1 to 30,000). The white-dwarf branch, the polytrope of index 3/2,
// R = xi_1 (4 pi omega)^{1/3} (5 C / 8 pi G) M^{-1/3}, solid from where it enters the panel up to 1 solar mass, then
// bending over, dashed, toward R = 0 at the Chandrasekhar mass, M_Ch = 1.43, a thin line; a band for neutron stars at
// 11 to 13 km, full from 1.2 solar masses up to 2, its top fading out over 2 to 2.3, the range the chapter states, and its
// foot over 1.2 to 1; the line
// r = r_s = 2GM/c^2 in the field's colour, with the black holes on its far side; the paper's objects as dots: the white
// dwarf of 0.6 solar masses at 10,400 km and the neutron star of 1.4 at 12 km. The branches in matter's colour.
// Departures from the diagram's comment: the comment asks for mass against radius, the usual way, and that is how it
// is drawn, with mass up and radius across; the Chandrasekhar mass is therefore a horizontal line, not a vertical
// one, and the white-dwarf branch bends over toward it rather than down; the line stops short of the neutron stars,
// at 100 km, so as not to cross their band. The chapter gives no lower end to the neutron stars, so the band's foot
// fades out too, below the 1.4 solar masses of the chapter's neutron star.
// Exact: the solid white-dwarf branch (tut-stars-lib.js: its radius 10,400 km at 0.6 solar masses and M_Ch = 1.43
// asserted against the chapter); the line r = r_s; the dots. Schematic: the dashed bend, the polytrope's log R plus
// b [ln(1 - x) - ln(1 - x_0) + (x - x_0)/(1 - x_0)], x = M/M_Ch, b = 1, which joins the branch at 1 solar mass with its
// value and slope and falls without limit at M_Ch, drawn until it comes within 0.02 solar masses of M_Ch; the band.
import { Sheet, ORIGIN, finish, checker, placed, near, n2, LABEL_GAP, HAIR } from './tut-pot-lib.js';
import { Plot, xAxis, yAxis } from './tut-prob-lib.js';
import { graph, longest } from './tut-fourier-lib.js';
import { DASH, DOT } from './tut-bessel-lib.js';
import { INK, DIM } from '../lib.js';
import { chapter, MATTER, FIELD, M_SUN, wdRadius, chandrasekhar, rs, NS, WD, fitDash } from './tut-stars-lib.js';

const name = 'tut-stars-ends';
const check = checker(name);

// ---- the drawing (points) ----------------------------------------------------------------------------------------
const W = 270, H = 150;
const X1 = Math.log10(30000), Y1 = 2.5;
const MAIN = 0.75, LINE = 0.45;
const SOLID_TO = 1;                    // solar masses: the branch is solid up to here
const BEND = 1;                        // b of the schematic bend
const CLOSE = 0.02;                    // the bend is drawn until it is this close to M_Ch, solar masses
const LINE_FROM = 100;                 // km: where the line of M_Ch starts
const BAND = { from: 1, full: 1.2, solid: NS.max[0], top: NS.max[1] };
const BAND_ALPHA = 0.34;               // the band's fill
const NAME = 7;
const caption = 'Look first at the white-dwarf branch: the heavier the star, the smaller it is, until at 1.43 solar masses electrons can hold no more. Neutron stars sit a thousand times smaller, near 12 km, and the line $r = r_s$ bounds them all. The white-dwarf curve is the polytrope of index 3/2, exact; the neutron-star band and the bend toward the limit are schematic.';

export default async function () {
	const { state } = await chapter(check);
	state(name, 'stars-ends', caption);
	const mch = chandrasekhar() / M_SUN;
	const R = (m) => wdRadius(m * M_SUN) / 1e3;                      // km
	check(Math.round(R(WD.mass) / 100) * 100 === 10400 && mch.toFixed(2) === '1.43', 'the branch\'s numbers');

	const S = new Sheet(name);
	const L = [];
	const P = new Plot({ left: ORIGIN - W / 2, top: ORIGIN - H / 2, w: W, h: H, x0: 0, x1: X1, y0: 0, y1: Y1 });
	const at = (km, m) => P.at(Math.log10(km), m);

	// ---- the axes
	{
		const xl = await xAxis(S, P, { ticks: [0, 1, 2, 3, 4], fmt: (t) => ['1', '10', '100', '1000', '10{,}000'][t], what: 'the radius axis' });
		for (const k of [0, 1, 2, 3]) for (const j of [2, 3, 4, 5, 6, 7, 8, 9]) {
			const x = P.X(k + Math.log10(j));
			if (x <= P.right + 1e-9) S.path([[x, P.bottom], [x, P.bottom + 1.5]], { color: DIM, width: HAIR, layer: 1, cap: 'butt', what: `the radius axis's minor tick at ${j} x 10^${k}` });
		}
		L.push(...xl);
		L.push(await placed('\\text{radius (km)}', P.X(X1 / 2), Math.max(...xl.map((l) => l.box.b)) + 4, 0.5, 0, DIM));
		const yl = await yAxis(S, P, { ticks: [0, 0.5, 1, 1.5, 2, 2.5], what: 'the mass axis' });
		L.push(...yl);
		L.push(await placed('\\text{mass }(M_\\odot)', Math.min(...yl.map((l) => l.box.l)), P.top - NAME, 0, 1, DIM));
	}

	// ---- r = r_s, and the black holes beyond it: M = c^2 r / 2G, from r = 1 km to the panel's top
	{
		const kmPerSun = rs(M_SUN) / 1e3;
		check(kmPerSun.toFixed(2) === '2.95', `r_s of the Sun is ${kmPerSun} km`);
		const top = Y1 * kmPerSun;
		const pts = graph(P, (lx) => 10 ** lx / kmPerSun, 0, Math.log10(top));
		check(longest(pts) <= 0.26 && near(pts[pts.length - 1][1], P.top, 1e-9), 'the line r = r_s');
		S.path(pts, { color: FIELD, width: MAIN, layer: 3, cap: 'butt', what: 'the line r = r_s' });
		L.push(await S.clear('r = r_s', P.X(Math.log10(0.5 * kmPerSun)) + 5, P.Y(0.5), 0, 0.5, [1, 0], { color: FIELD }));
		L.push(await placed('\\text{black holes}', P.left + LABEL_GAP + 0.6, P.Y(2.38), 0, 0.5, INK));
		check(rs(BAND.top * M_SUN) / 1e3 < NS.radius[0], 'r_s of the heaviest neutron star reaches the band');
	}

	// ---- the neutron stars: a band at 11 to 13 km, its top a range, fading from 2 to 2.3
	{
		const [xa, xb] = NS.radius.map((r) => P.X(Math.log10(r)));
		const y0 = P.Y(BAND.from), y1 = P.Y(BAND.solid), y2 = P.Y(BAND.top);
		const id = `${name}-band`;
		const f = (y) => ((y - y2) / (y0 - y2)).toFixed(4);
		const yb = P.Y(BAND.full);
		S.raw(`<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="0" y1="${n2(y2)}" x2="0" y2="${n2(y0)}">` +
			`<stop offset="0" stop-color="${MATTER}" stop-opacity="0"/><stop offset="${f(y1)}" stop-color="${MATTER}" stop-opacity="${BAND_ALPHA}"/>` +
			`<stop offset="${f(yb)}" stop-color="${MATTER}" stop-opacity="${BAND_ALPHA}"/><stop offset="1" stop-color="${MATTER}" stop-opacity="0"/></linearGradient>` +
			`<path d="M${n2(xa)},${n2(y0)}L${n2(xb)},${n2(y0)}L${n2(xb)},${n2(y2)}L${n2(xa)},${n2(y2)}Z" fill="url(#${id})"/>`, 2);
		S.boxes.push({ box: { l: xa, r: xb, t: y2, b: y0 }, what: 'the band' });
		const [x, y] = at(NS.central, NS.mass);
		S.raw(`<circle cx="${n2(x)}" cy="${n2(y)}" r="${DOT}" fill="${MATTER}"/>`, 4);
		S.mark([[x, y]], DOT, 'the neutron star');
		L.push(await S.clear('12\\text{ km}', xb + LABEL_GAP + 0.4, y, 0, 0.5, [1, 0], { color: INK }));
		L.push(await S.clear('\\text{neutron stars}', xb + LABEL_GAP + 0.4, P.Y(1.95), 0, 0.5, [1, 0], { color: INK }));
	}

	// ---- the white dwarfs: the polytrope, solid to 1 solar mass, then the schematic bend toward M_Ch
	{
		const lx0 = Math.log10(R(SOLID_TO));
		// the branch as M of log r: M = M0 (R0 / r)^3, from the panel's right edge to 1 solar mass
		const mAt = (lx) => SOLID_TO * (10 ** lx0 / 10 ** lx) ** 3;
		const solid = graph(P, mAt, lx0, X1).reverse();
		check(longest(solid) <= 0.26 && near(solid[0][0], P.right, 1e-9) && near(solid[solid.length - 1][1], P.Y(SOLID_TO), 1e-9), 'the solid branch');
		for (const m of [0.3, 0.6, 0.9]) check(near(mAt(Math.log10(R(m))), m, 1e-9), `the branch at ${m}`);
		S.path(solid, { color: MATTER, width: MAIN, layer: 3, cap: 'butt', what: 'the white-dwarf branch' });
		// the bend: log10 R(M) + (b / ln 10) [ln(1 - x) - ln(1 - x0) + (x - x0)/(1 - x0)]
		const x0 = SOLID_TO / mch;
		const bent = (m) => { const x = m / mch; return Math.log10(R(m)) + (BEND / Math.LN10) * (Math.log(1 - x) - Math.log(1 - x0) + (x - x0) / (1 - x0)); };
		check(near(bent(SOLID_TO), lx0, 1e-12) && Math.abs((bent(SOLID_TO + 1e-6) - bent(SOLID_TO - 1e-6)) / 2e-6 - (-1 / 3) / (SOLID_TO * Math.LN10)) < 1e-6, 'the bend does not join the branch smoothly');
		const mEnd = mch - CLOSE;
		// traced in the page by mass, finely
		const pts = [];
		for (let i = 0; i <= 4000; i++) { const m = SOLID_TO + ((mEnd - SOLID_TO) * i) / 4000; pts.push(P.at(bent(m), m)); }
		check(longest(pts) <= 0.26, 'the bend is not fine');
		const fit = fitDash(pts, DASH);
		check(Math.abs(fit.f - 1) < 0.1, 'the bend\'s dashes are stretched more than a tenth');
		S.path(pts, { color: MATTER, width: MAIN, dash: fit.dash, layer: 3, cap: 'butt', what: 'the bend' });
		window[name + '-numbers'] = { mch, r06: R(WD.mass), r1: R(SOLID_TO), bendEnd: 10 ** bent(mEnd) };
		// the line of M_Ch
		S.path([at(LINE_FROM, mch), [P.right, P.Y(mch)]], { color: DIM, width: LINE, layer: 2, cap: 'butt', what: 'the Chandrasekhar mass' });
		L.push(await S.clear(`M_{\\rm Ch} = ${mch.toFixed(2)}`, P.X(Math.log10(LINE_FROM)), P.Y(mch) - LINE / 2 - LABEL_GAP - 0.4, 0, 1, [0, -1], { color: INK }));
		// the paper's white dwarf
		const [x, y] = at(R(WD.mass), WD.mass);
		S.raw(`<circle cx="${n2(x)}" cy="${n2(y)}" r="${DOT}" fill="${MATTER}"/>`, 4);
		S.mark([[x, y]], DOT, 'the white dwarf');
		L.push(await S.clear('10{,}400\\text{ km}', x - LABEL_GAP - 1.2, y, 1, 0.5, [-1, 0], { color: INK }));
		L.push(await S.clear('\\text{white dwarfs}', P.X(Math.log10(R(0.25))) - LABEL_GAP - 1.2, P.Y(0.25), 1, 0.5, [-1, 0], { color: INK }));
	}

	S.checkAll(L);
	return finish(S, L, [270, 340]);
}
