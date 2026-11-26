// The tutorial, section 3.4 (tutorial/noise/symmetric-matrices.md), its last diagram: the truncated singular value
// decomposition of the locked safe. Top, the 231 whitened gains of the safe's camera (605 readings, 231 cells, SNR =
// 10^3, each cell counted in units of 324 kg) on a log scale against their rank, one dot each: the 17 above one, which
// the cut keeps, in the first accent; the rest in neutral ink, and those below numpy's rank tolerance (s_1 x 605 x the
// machine epsilon, 2.8 x 10^-10), lost in the computer's rounding, in its pale tint. The line at one is the noise.
// Beneath, on the same horizontal axis, the noise in the mass found in the right-hand safe when the first k patterns
// are kept, one dot for each k up to 111, the last gain above the rounding: 1.1 kg at k = 5, 243 kg at k = 17 and
// 1.1 x 10^11 kg at k = 111. A dotted line between the 17th and 18th ranks marks the cut through both.
// Exact: every gain and every noise, computed here from the repository's model (tut-svd-lib.js: the design matrix of
// reference/gravcam/inversion.py, its singular values by Jacobi rotations) and asserted against the reference's numpy
// run and the chapter's numbers (2080, 1480, 960, 440, 330; 17 above one, 12 above ten; 0.08 at 25 and 9 x 10^-4 at
// 40; 243, 2900 and 140,000 kg; the smallest below 10^-16 of the largest). Below the rounding the gains are the
// computer's, not the camera's: they differ from numpy's there, and the figure says only that they lie below it.
// Nothing is schematic.
import { Sheet, ORIGIN, finish, checker, placed, near } from './tut-pot-lib.js';
import { Plot, xAxis, yAxis, LABEL_GAP, INK, DIM, ACCENT, ACCENT2 } from './tut-prob-lib.js';
import { RULE } from '../lib.js';
import { safeGains, REF } from './tut-svd-lib.js';

const name = 'tut-svd-tsvd';
const check = checker(name);

const W = 262;                 // the charts' width, points
const H1 = 100, H2 = 78;       // their heights
const GAP = 22;                // from the gains' axis to the noise chart's top
const DOTR = 0.62;             // a dot's radius
const S_RANGE = [-14.6, 3.8];  // log10 of the gains' axis
const N_RANGE = [-1.3, 11.5];    // log10 of the noise's axis, kg
const LINE = 0.55;             // the noise's line
const rel = (a, b, tol) => Math.abs(a - b) <= tol * Math.abs(b);

export default async function () {
	const t0 = performance.now();
	const g = safeGains();
	const { s, noise, tol } = g;
	// ---- the numbers, against the reference and the chapter
	check(g.N === 605 && g.K === 231 && g.cells === 12, `${g.N} readings, ${g.K} cells, ${g.cells} in the safe`);
	REF.top.forEach((v, i) => check(rel(s[i], v, 1e-9), `gain ${i + 1} is ${s[i]}, not ${v}`));
	check([2080, 1480, 960, 440, 330].every((v, i) => Math.round(s[i] / 10) * 10 === v), 'the footnote\'s first five gains');
	check(Math.round(s[0] / 100) * 100 === 2100, 'the largest gain is not 2100');
	check(rel(s[16], REF.s17, 1e-8) && rel(s[17], REF.s18, 1e-8) && rel(s[24], REF.s25, 1e-7) && rel(s[39], REF.s40, 1e-6), 'the gains at 17, 18, 25 and 40');
	check(s.filter((x) => x > 1).length === REF.above1 && s.filter((x) => x > 10).length === REF.above10, 'the counts above one and ten');
	check(s[24].toFixed(2) === '0.08' && (s[39] / 1e-4).toFixed(0) === '9', 'the gains 0.08 and 9 x 10^-4');
	check(rel(s[110], REF.s111, 1e-3) && rel(s[111], REF.s112, 1e-2), `the gains at 111 and 112: ${s[110]}, ${s[111]}`);
	check(s.filter((x) => x > tol).length === REF.rank, `${s.filter((x) => x > tol).length} gains above the rounding, not 111`);
	check(s[s.length - 1] < 1e-16 * s[0], 'the smallest gain is not below 10^-16 of the largest');
	for (const k of [1, 5, 17, 25, 40]) check(rel(noise[k - 1], REF.noise[k], 1e-6), `the noise at ${k} is ${noise[k - 1]}, not ${REF.noise[k]}`);
	check(rel(noise[110], REF.noise[111], 1e-2), `the noise at 111 is ${noise[110]}`);
	check(Math.round(noise[16]) === 243 && Math.round(noise[24] / 100) * 100 === 2900 && Math.round(noise[39] / 1e4) * 1e4 === 140000, 'the chapter\'s 243, 2900 and 140,000 kg');
	check(rel(g.uniform, REF.uniform, 1e-9) && Math.round(g.uniform / 50) * 50 === 1950 && (g.uniform / s[0]).toFixed(2) === '0.94', 'the uniform layer\'s gain');
	check(s.every((x, i) => i === 0 || x <= s[i - 1]), 'the gains are not in order');
	// the noise only grows as patterns are added
	check(noise.every((x, i) => i === 0 || x >= noise[i - 1]), 'the noise falls');
	const kept = REF.above1, last = REF.rank;

	const S = new Sheet(name);
	const L = [];
	const left = ORIGIN - W / 2, top = ORIGIN - (H1 + GAP + H2) / 2;
	const P = new Plot({ left, top, w: W, h: H1, x0: -1, x1: 232, y0: S_RANGE[0], y1: S_RANGE[1] });
	const Q = new Plot({ left, top: top + H1 + GAP, w: W, h: H2, x0: -1, x1: 232, y0: N_RANGE[0], y1: N_RANGE[1] });
	const dot = (x, y, color, what) => { S.raw(`<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${DOTR}" fill="${color}"/>`, 2); S.mark([[x, y]], DOTR, what); };

	// ---- the cut, between the 17th and 18th ranks, through both charts; the noise's line at one
	const xc = P.X(kept + 0.5);
	S.path([[P.left, P.Y(0)], P.at(231.5, 0)], { color: ACCENT2, width: LINE, layer: 1.5, cap: 'butt', what: 'the noise\'s line' });

	// ---- the gains
	s.forEach((v, i) => {
		const color = i < kept ? ACCENT : v > tol ? DIM : RULE;
		check(Math.log10(v) > S_RANGE[0] + 0.3 && Math.log10(v) < S_RANGE[1] - 0.3, `gain ${i + 1} is off the chart`);
		dot(P.X(i + 1), P.Y(Math.log10(v)), color, `gain ${i + 1}`);
	});
	// ---- the noise, up to the last gain above the rounding
	for (let k = 1; k <= last; k++) {
		const y = Math.log10(noise[k - 1]);
		check(y > N_RANGE[0] + 0.2 && y < N_RANGE[1] - 0.2, `the noise at ${k} is off the chart`);
		dot(Q.X(k), Q.Y(y), k <= kept ? ACCENT2 : ACCENT2, `the noise at ${k}`);
	}

	// ---- the cut: round dots down from the gains' top to the k axis, leaving out those that would touch a data dot, so
	// that the line passes the 17th dots with air on either side
	const centres = S.marks.filter((m) => /^(gain|the noise at) /.test(m.what)).map((m) => m.pts[0]);
	const DOT = 0.6, STEP = 1.6, AIR = 0.6;
	const n = Math.round((Q.bottom - DOT / 2 - 0.8 - (P.top + 4)) / STEP);
	const cut = Array.from({ length: n + 1 }, (_, i) => [xc, P.top + 4 + (i * (Q.bottom - DOT / 2 - 0.8 - (P.top + 4))) / n])
		.filter((q) => centres.every((c) => Math.hypot(q[0] - c[0], q[1] - c[1]) >= DOTR + DOT / 2 + AIR));
	S.raw(`<path d="${cut.map(([x, y]) => `M${x.toFixed(2)},${y.toFixed(2)}h0`).join('')}" stroke="${DIM}" stroke-width="${DOT}" stroke-linecap="round" fill="none"/>`, 0.5);
	for (const q of cut) S.mark([q], DOT / 2, 'the cut');

	// ---- the axes
	const pow = (t) => (t === 0 ? '1' : `10^{${t}}`);
	// the cut stands where a tick at 17 would; it is numbered without one
	const ticks = [1, 50, 100, 150, 200, 231];
	await xAxis(S, P, { ticks, fmt: () => null, from: -1, to: 232, what: 'the rank axis' });
	L.push(...await xAxis(S, Q, { ticks, from: -1, to: 232, what: 'the k axis' }));
	L.push(await placed(`${kept}`, Q.X(kept), L[L.length - 1].box.t, 0.5, 0, DIM));
	check(near(L[L.length - 1].box.t, L[L.length - 2].box.t, 1e-9), 'the number 17 is not on the others\' line');
	const kl = L.find((l) => l.src === '231');
	L.push(...await yAxis(S, P, { ticks: [-12, -8, -4, 0], fmt: pow, what: 'the gain axis' }));
	L.push(...await yAxis(S, Q, { ticks: [0, 4, 8], fmt: pow, what: 'the noise axis' }));
	// the axes' names: at the top of each vertical axis, and at the right end of each horizontal one
	L.push(await placed('s_i', P.left, P.top - LABEL_GAP - 1, 0.5, 1, DIM));
	L.push(await placed('\\text{noise, kg}', Q.left, Q.top - LABEL_GAP - 1, 0.5, 1, DIM));
	L.push(await placed('i', kl.box.r + 4, P.bottom, 0, 0.5, DIM));
	L.push(await placed('k', kl.box.r + 4, (kl.box.t + kl.box.b) / 2, 0, 0.5, DIM));

	// ---- the marks: the noise's line, and the noise at the cut
	L.push(await S.clear('\\text{noise}', P.X(231), P.Y(0) - LABEL_GAP - 0.3, 1, 1, [0, -1], { color: ACCENT2 }));
	const at17 = [Q.X(kept), Q.Y(Math.log10(noise[kept - 1]))];
	L.push(await S.clear(`${Math.round(noise[kept - 1])}\\ \\text{kg}`, at17[0] + 4, at17[1] + 2, 0, 0, [1, 0], { color: ACCENT2 }));

	S.checkAll(L);
	window.tutSvdTsvd = { s17: s[16], s18: s[17], n17: noise[16], n25: noise[24], n40: noise[39], n111: noise[110], tol, sweeps: g.sweeps, ms: performance.now() - t0, smallest: s[230] };
	void INK;
	return finish(S, L, [240, 340]);
}
