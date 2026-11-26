// The tutorial, section 8.6 (tutorial/quantum/quantum-limit.md), its third diagram: an interferometer's standard
// quantum limit. One panel on logarithmic axes: across, the frequency from 10 to 1000 Hz; up, the strain noise from
// 10^-25 to 10^-22 Hz^-1/2. The line h_SQL(f) = sqrt(8 hbar / m omega^2 L^2) for m = 40 kg and L = 4 km, falling as 1/f
// (3.65, 1.83 and 0.914 x 10^-24 at 50, 100 and 200 Hz), thick ink; for P0/10, P0 and 10 P0, with P0 chosen to touch
// the line at 100 Hz, the total quantum noise sqrt(S_shot + S_rp) as thin grey curves, flat at high frequency
// (S_shot = A/P) and falling as f^-2 at low frequency (S_rp = B P / f^4), each touching the line once, at 31.6, 100
// and 316 Hz, where an ink dot marks it. Ink and greys only.
// The three powers and h_SQL are named just right of the panel, each at the height where its curve ends at 1000 Hz,
// beside its flat part. Departures from the diagram's comment: the two higher powers' curves leave the panel through
// its top at low frequency and are drawn up to it; the axis across is ticked at 10, 20, 50, 100, 200, 500 and 1000 Hz,
// with 10, at the corner, unnumbered (its number would touch 10^-25).
// Exact: every curve, from hbar = 1.0546 x 10^-34 J s (tut-sql-lib.js asserts h_SQL at 50, 100 and 200 Hz, that each
// curve stays above h_SQL and meets it where its two noises are equal, and that the least noise over the power at
// every frequency is h_SQL).
import { Sheet, ORIGIN, finish, checker, placed, LABEL_GAP, n2 } from './tut-pot-lib.js';
import { Plot, xAxis, yAxis } from './tut-prob-lib.js';
import { graph, longest } from './tut-fourier-lib.js';
import { INK, DIM } from '../lib.js';
import { chapter, palette, near, hSQL, noise, touch, POWERS } from './tut-sql-lib.js';

const name = 'tut-sql-interferometer';
const check = checker(name);

// ---- the drawing (points) ----------------------------------------------------------------------------------------
const lg = Math.log10;
const X0 = 1, X1 = 3, Y0 = -25, Y1 = -22;
const DX = 118, DY = 58;                 // points per decade
const XT = [10, 20, 50, 100, 200, 500, 1000];  // Hz: the ticks across (10, at the corner, unnumbered)
const LIMIT_W = 1.1, NOISE_W = 0.5, DOT = 1.7;

export default async function () {
	await chapter(check);
	await palette(check);
	const S = new Sheet(name);
	const L = [];
	const W = (X1 - X0) * DX, H = (Y1 - Y0) * DY;
	const P = new Plot({ left: ORIGIN - W / 2, top: ORIGIN - H / 2, w: W, h: H, x0: X0, x1: X1, y0: Y0, y1: Y1 });

	// ---- the axes
	const xl = await xAxis(S, P, { ticks: XT.map(lg), fmt: (t) => (t === X0 ? null : String(Math.round(10 ** t))), what: 'the frequency axis' });
	L.push(...xl);
	L.push(...(await yAxis(S, P, { ticks: [-25, -24, -23, -22], fmt: (t) => `10^{${t}}`, what: 'the strain axis' })));
	{
		const last = xl[xl.length - 1];
		L.push(await placed('f\\ (\\mathrm{Hz})', P.right, last.box.b + 3, 1, 0, DIM));
		L.push(await placed('\\text{strain noise}\\ (\\mathrm{Hz^{-1/2}})', P.left - 4, P.top - 9, 0, 1, DIM));
	}

	// ---- the three powers, grey, each drawn from where it enters the panel
	const ends = [];
	for (const p of POWERS) {
		const f = (x) => lg(noise(10 ** x, p));
		let a = X0;
		if (f(X0) > Y1) {
			let lo = X0, hi = X1;
			for (let i = 0; i < 200; i++) { const mid = (lo + hi) / 2; if (f(mid) > Y1) lo = mid; else hi = mid; }
			a = hi;
		}
		const pts = graph(P, f, a, X1);
		check(longest(pts) <= 0.2501, `the curve of ${p} P0 has a step of ${longest(pts)} pt`);
		check(pts.every(([, y]) => y >= P.top - 1e-6 && y <= P.bottom), `the curve of ${p} P0 leaves the panel`);
		S.path(pts, { color: DIM, width: NOISE_W, layer: 1.5, what: `the noise at ${p} P0` });
		ends.push({ p, y: P.Y(f(X1)) });
	}
	check(ends.filter((e, i) => noise(10, POWERS[i]) > 1e-22).length === 2, 'not two curves leave through the top');

	// ---- the limit, thick ink
	const line = [P.at(X0, lg(hSQL(10))), P.at(X1, lg(hSQL(1000)))];
	check(near(hSQL(10) / hSQL(1000), 100, 1e-12), 'h_SQL does not fall as 1/f');
	check(lg(hSQL(10)) < Y1 && lg(hSQL(1000)) > Y0, 'h_SQL leaves the panel');
	S.path(line, { color: INK, width: LIMIT_W, layer: 2, cap: 'butt', what: 'h_SQL' });

	// ---- the touching points
	for (const p of POWERS) {
		const ft = touch(p), q = P.at(lg(ft), lg(hSQL(ft)));
		check(near(noise(ft, p), hSQL(ft), 1e-9), `${p} P0 does not touch the line`);
		S.raw(`<circle cx="${n2(q[0])}" cy="${n2(q[1])}" r="${DOT}" fill="${INK}"/>`, 3);
		S.mark([q], DOT, `the touching point of ${p} P0`);
	}

	// ---- the names, in the margin right of the panel, at the heights where the curves leave it
	const names = { 0.1: 'P_0/10', 1: 'P_0', 10: '10\\,P_0' };
	for (const e of ends) L.push(await placed(names[e.p], P.right + LABEL_GAP + 1.5, e.y, 0, 0.5, DIM));
	L.push(await placed('h_{\\rm SQL}', P.right + LABEL_GAP + 1.5, P.Y(lg(hSQL(1000))), 0, 0.5, INK));

	S.checkAll(L);
	window[name + '-numbers'] = { h: [50, 100, 200].map(hSQL), touch: POWERS.map(touch) };
	return finish(S, L, [260, 340]);
}
