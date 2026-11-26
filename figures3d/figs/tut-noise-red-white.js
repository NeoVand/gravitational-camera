// The tutorial, section 3.2 (tutorial/noise/random-signals.md), its second diagram: white noise averages down and
// red noise does not. Two records over 100 s, sampled twice a second: white noise, and red noise (a random walk with
// a small white part added). Under each, its averages over successive blocks of 1 s (thin steps) and of 10 s (thick
// steps), on the same scale. The two records are scaled so that their averages over one second scatter equally
// (the same standard deviation sigma_n(1 s) about the record's mean). The white averages over 10 s scatter sqrt 10
// times less than those over 1 s; the red ones follow the wander and barely narrow. A log-log inset shows the two
// records' spectra: the white one flat, the red one rising as 1/omega^2 toward zero frequency, flattening at high
// frequency where its small white part takes over.
// Exact: the draws (seeds 83 and 114, normal deviates), the walk and the averages; the scale of each record, set so
// that sigma_n(1 s) is the same, asserted to agree to 1e-12; the ratio sigma_n(10 s) / sigma_n(1 s), from the drawn
// records (ten blocks of 10 s, about the record's mean), asserted within 5% of 1/sqrt 10 = 0.316 for white noise
// (the caption's sqrt 10 = 3.2) and above 0.9 for red (they narrow by less than a tenth); the spectra, the exact two-sided spectra of the two sampled processes, sigma^2 dt for white
// and a^2 dt / (4 sin^2(omega dt / 2)) + w^2 dt for red (step a, white part w), over omega from 2 pi / 100 s to the
// highest frequency of the sampling, pi / dt, the red one's slope at the lowest frequency asserted within 0.05 of
// -2. Schematic: the units of the readings and of the spectra (the inset's axes carry no numbers).
import { Sheet, ORIGIN, finish, checker, placed } from './tut-pot-lib.js';
import { normals, mean, sd, Plot, xAxis, INK, DIM, DATA, LABEL_GAP } from './tut-prob-lib.js';
import { AXIS } from './tut-pot-lib.js';

const name = 'tut-noise-red-white';
const check = checker(name);

// ---- the simulation -------------------------------------------------------------------------------------------
export const RATE = 2, T = 100;             // samples a second, seconds
export const DT = 1 / RATE;
export const STEP = 1, WHITE_PART = 2.5;     // the red record's walk step and white part, before scaling

export function records(seedW = 83, seedR = 114, part = WHITE_PART) {
	const n = RATE * T;
	const zw = normals(seedW), zr = normals(seedR);
	let white = Array.from({ length: n }, () => zw());
	let walk = 0;
	let red = Array.from({ length: n }, () => { walk += STEP * zr(); return walk; }).map((v) => v + part * zr());
	const centre = (xs) => { const m = mean(xs); return xs.map((x) => x - m); };
	white = centre(white); red = centre(red);
	const s1w = sd(blocks(white, 1)), s1r = sd(blocks(red, 1));
	const g = s1w / s1r;                      // the red record's scale, so that its one-second averages scatter as the white's
	red = red.map((x) => x * g);
	return { white, red, g };
}
/** The averages over successive blocks of `s` seconds. */
export function blocks(xs, s) {
	const k = s * RATE, out = [];
	for (let i = 0; i + k <= xs.length; i += k) out.push(mean(xs.slice(i, i + k)));
	return out;
}
/** The exact two-sided spectra of the two sampled processes, after the red one's scaling g. */
export const spectra = (g) => ({
	white: () => DT,
	red: (w) => g * g * (STEP * STEP * DT / (4 * Math.sin((w * DT) / 2) ** 2) + WHITE_PART * WHITE_PART * DT)
});

// ---- the drawing (points) -------------------------------------------------------------------------------------
const TW = 200;                              // the records' width: 100 s
const UNIT = 4.6;                            // points per unit of the reading, the same in every row
const ROWS = [                               // each row's half-height in units, and the air under it
	{ half: 2.9, after: 3 }, { half: 1.9, after: 9 }, { half: 2.1, after: 3 }, { half: 1.9, after: 0 }
];
const THIN = 0.35, THICK = 0.75;             // the steps of 1 s and of 10 s
const IW = 74, IH = 62;                      // the inset
const IGAP = 22;                             // from the records to the inset's axis

export default async function () {
	const { white, red, g } = records();
	const w1 = blocks(white, 1), w10 = blocks(white, 10), r1 = blocks(red, 1), r10 = blocks(red, 10);
	check(Math.abs(sd(w1) - sd(r1)) < 1e-12, 'the two records\' one-second averages do not scatter equally');
	const qw = sd(w10) / sd(w1), qr = sd(r10) / sd(r1);
	check(Math.abs(qw * Math.sqrt(10) - 1) < 0.05, `the white averages narrow by ${1 / qw}, not sqrt 10 = 3.2`);
	check(qr > 0.9, `the red averages narrow by ${1 / qr}, more than barely`);
	const Sp = spectra(g);
	const wLo = (2 * Math.PI) / T, wHi = Math.PI / DT;
	const slope = (Math.log(Sp.red(wLo * 1.01)) - Math.log(Sp.red(wLo))) / Math.log(1.01);
	check(Math.abs(slope + 2) < 0.05, `the red spectrum's slope at the lowest frequency is ${slope}, not -2`);

	const S = new Sheet(name);
	const L = [];
	const left = ORIGIN - (TW + IGAP + IW) / 2;
	const X = (t) => left + (t / T) * TW;
	let y = ORIGIN - 70;
	const zeros = ROWS.map((r) => { const z = y + r.half * UNIT; y += 2 * r.half * UNIT + r.after; return z; });
	const fit = (xs, r) => Math.max(...xs.map(Math.abs)) < ROWS[r].half;
	check(fit(white, 0) && fit(w1, 1) && fit(red, 2) && fit(r1, 3), `a record or its averages leave their row: ${[white, w1, red, r1].map((xs) => Math.max(...xs.map(Math.abs)).toFixed(2))}`);

	// ---- the records
	const trace = (xs, zero, what) => S.path(xs.map((v, i) => [X((i + 0.5) * DT), zero - UNIT * v]), { color: INK, width: DATA, layer: 2, what });
	trace(white, zeros[0], 'the white record');
	trace(red, zeros[2], 'the red record');
	// ---- the averages, as steps over their blocks, on a faint line at zero
	const steps = (bs, s, zero, width, color, what) => {
		const pts = [];
		bs.forEach((v, i) => { pts.push([X(i * s), zero - UNIT * v], [X((i + 1) * s), zero - UNIT * v]); });
		S.path(pts, { color, width, layer: width > 0.5 ? 2.5 : 2, cap: 'butt', what });
	};
	for (const [k, b1, b10] of [[1, w1, w10], [3, r1, r10]]) {
		S.path([[X(0), zeros[k]], [X(T), zeros[k]]], { color: DIM, width: 0.3, layer: 0.5, cap: 'butt', dash: [1.2, 1.6], what: 'a zero line' });
		steps(b1, 1, zeros[k], THIN, DIM, 'the one-second averages');
		steps(b10, 10, zeros[k], THICK, INK, 'the ten-second averages');
	}
	// ---- the time axis
	const tp = new Plot({ left: X(0), top: zeros[3] + ROWS[3].half * UNIT, w: TW, h: 1, x0: 0, x1: T, y0: 0, y1: 1 });
	const tl = await xAxis(S, tp, { ticks: [0, 50, 100], y: tp.top + 3, what: 'the time axis' });
	L.push(...tl);
	L.push(await placed('t\\ (\\mathrm{s})', tl[2].box.r + 5, (tl[2].box.t + tl[2].box.b) / 2, 0, 0.5, DIM));
	// ---- the rows' names
	L.push(await placed('\\text{white}', X(0) - LABEL_GAP - 3, zeros[0], 1, 0.5, INK));
	L.push(await placed('\\text{red}', X(0) - LABEL_GAP - 3, zeros[2], 1, 0.5, INK));
	L.push(await placed('\\text{averages}', X(0) - LABEL_GAP - 3, zeros[1], 1, 0.5, DIM));
	L.push(await placed('\\text{averages}', X(0) - LABEL_GAP - 3, zeros[3], 1, 0.5, DIM));

	// ---- the inset: both spectra, log-log, over the frequencies the records hold
	const lx0 = Math.log10(wLo), lx1 = Math.log10(wHi);
	const reds = Array.from({ length: 121 }, (_, i) => lx0 + ((lx1 - lx0) * i) / 120).map((l) => [l, Math.log10(Sp.red(10 ** l))]);
	const lyw = Math.log10(Sp.white());
	const ly = reds.map((p) => p[1]).concat(lyw);
	const ly0 = Math.min(...ly), ly1 = Math.max(...ly), pad = 0.12 * (ly1 - ly0);
	const itop = (zeros[0] + zeros[3]) / 2 - IH / 2;
	const IP = new Plot({ left: X(T) + IGAP, top: itop, w: IW, h: IH, x0: lx0, x1: lx1 + 0.05 * (lx1 - lx0), y0: ly0 - 2.5 * pad, y1: ly1 + pad });
	S.path([[IP.left, IP.top], [IP.left, IP.bottom], [IP.right, IP.bottom]], { color: DIM, width: AXIS, layer: 1, cap: 'butt', what: 'the inset\'s axes' });
	S.path(reds.map(([l, s]) => IP.at(l, s)), { color: INK, width: DATA + 0.1, layer: 2, what: 'the red spectrum' });
	S.path([IP.at(lx0, lyw), IP.at(lx1, lyw)], { color: INK, width: DATA + 0.1, layer: 2, cap: 'butt', what: 'the white spectrum' });
	check(IP.Y(lyw) < IP.bottom - 4 && IP.Y(ly0) < IP.bottom - 6, 'a spectrum runs along the inset\'s axis');
	L.push(await placed('\\omega', IP.right, IP.bottom + LABEL_GAP + 0.6, 1, 0, DIM));
	L.push(await placed('S(\\omega)', IP.left + 3, IP.top, 0, 0.5, DIM));
	L.push(await S.clear('\\text{white}', IP.right, IP.Y(lyw) - LABEL_GAP - 0.6, 1, 1, [0, -1]));
	const lr = lx0 + 0.08 * (lx1 - lx0);
	L.push(await S.clear('\\text{red}', IP.X(lr) + 3, IP.Y(Math.log10(Sp.red(10 ** lr))), 0, 0.5, [1, 0]));

	S.checkAll(L);
	window.tutNoiseRedWhite = { qw, qr, sqrt10: 1 / Math.sqrt(10), g, s1: sd(w1), slope };
	return finish(S, L, [240, 340]);
}
