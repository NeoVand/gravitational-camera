// The tutorial, section 8.5 (tutorial/quantum/counting-quanta.md), its second diagram: how the clicks of three sources
// arrive. Four horizontal time axes stacked, each carrying 40 clicks as thin vertical ink ticks over the same length,
// at the same mean rate. Row 1, "steady (coherent)": a Poisson process of steady rate, so independent uniform times.
// Row 2, "thermal": a Poisson process whose rate is a thermal intensity, I = |E|^2 of a complex Gaussian field (so I is
// exponentially distributed), with a coherence time of a tenth of the axis, so that the clicks come in bunches with
// gaps between. Rows 3 and 4, the pair source's two detectors: one more thermal train, each of its clicks given to both
// detectors, so that each row alone is bunched like row 2 and every tick of row 3 has one directly below it in row 4;
// thin grey vertical lines join the pairs. A short bracket under row 2, one coherence time long, labelled
// "coherence time". Labels at the left of the rows, off the ticks. Ink and the page's greys only.
// Departures from the diagram's comment: the left labels are set in two lines ("steady" over "(coherent)", "pair
// source," over "detector 1"), so that the axes keep most of the width and one drawing serves every width, at the
// same tick density; the joining lines, in the dim grey, join every pair, all forty (where two clicks lie closer than a
// line's width their lines merge, as their ticks do). A short arrow under the last axis, at its right end, named "time", says which way time runs on all four.
// The coherence time is a tenth of the axis, not the comment's fortieth: at a fortieth, one click per coherence time,
// the thermal row barely differs from the steady one; at a tenth, four clicks per coherence time, its bunches and gaps
// are unmistakable (the caption calls the coherence time schematic).
// Exact, given the seeds: each row's clicks are drawn from the stated laws (tut-counting-lib.js): given the number of
// its clicks, 40, a Poisson process of rate I(t) puts them independently with the density I(t) / integral of I, and a
// steady rate uniformly. The library checks the laws on long runs (the intensity's moments 1, 2, 6 of an exponential
// law; its correlation's area, the coherence time; counted in short windows, g2 = 1, 2 and g2_12 = 2 + 1/nbar). The
// bracket is the coherence time, the area under |g1|^2. Schematic, as the caption says: the rates and the coherence
// time against the axis.
import { Sheet, ORIGIN, finish, checker, placed, AXIS, AXIS_HEAD, LABEL_GAP, n2 } from './tut-pot-lib.js';
import { dimension, upper } from './tut-prob-lib.js';
import { INK, DIM } from '../lib.js';
import { chapter, palette, CLICKS, intensity, clicksGiven } from './tut-counting-lib.js';

const name = 'tut-click-trains';
const check = checker(name);

// ---- the drawing (points) ----------------------------------------------------------------------------------------
const LA = 252;                          // an axis's length
const TH = 9;                            // a click's tick, standing on its axis
const TICK_W = 0.5;
const JOIN_W = 0.45;                     // the lines joining partner clicks
const TIME = 0.14;                       // the time arrow's length, as a fraction of the axis
const ROWS = [0, 31, 68, 92];            // the axes' heights, from the first
const TRIALS = 151;                      // samples of each law, from which the typical one is drawn
const TAU = 1 / 10;                      // the coherence time, as a fraction of the axis (schematic)
const DT = TAU / 100;                    // the field's grid
const EXPECT = 300;                      // independent samples of the thermal law for the expected number of close pairs

export default async function () {
	await chapter(check);
	await palette(check);
	const S = new Sheet(name);
	const L = [];
	const x0 = ORIGIN - LA / 2 + 30, y0 = ORIGIN - 50;
	const X = (t) => x0 + t * LA;

	// ---- the clicks: of TRIALS samples of each law (seeds base + k), the typical one, whose number of pairs of
	// clicks closer than a coherence time is the median of the samples'; the thermal and the pair rows from two
	// disjoint sets of seeds
	const close = (r) => r.reduce((m, t, k) => m + r.slice(k + 1).filter((v) => v - t < TAU).length, 0);
	const typical = (base, draw) => {
		const all = Array.from({ length: TRIALS }, (_, k) => { const r = draw(base + k); return { r, c: close(r), k }; });
		const med = [...all].sort((a, b) => a.c - b.c)[(TRIALS - 1) / 2].c;
		return all.find((s) => s.c === med);
	};
	const s1 = typical(1000, (k) => clicksGiven(k, CLICKS));
	const thermalDraw = (k) => clicksGiven(k + 50000, CLICKS, intensity(k, 1, TAU, DT));
	const s2 = typical(2000, thermalDraw);
	const s3 = typical(3000, thermalDraw);
	const steady = s1.r, thermal = s2.r, pair = s3.r;
	// the bunching shows in the medians: more close pairs for the thermal law than for the steady one. Expected: for
	// the steady law, C(40, 2)(2 tau - tau^2) exactly (two uniform times closer than tau); for the thermal law, the mean
	// over EXPECT further samples (seeds 9000 on). Without the fixed count the ratio would be 1 + (1/2) erf(sqrt pi) =
	// 1.49, from g2(t) = 1 + |g1(t)|^2 = 1 + e^{-pi t^2 / tau^2} over |t| < tau (erf(z) = 1 - 2 P(Z > z sqrt 2)); fixing
	// the count at 40 on only ten coherence times lowers it, since the count then follows the intensity's total.
	const pairs = (CLICKS * (CLICKS - 1)) / 2, steadyMean = pairs * (2 * TAU - TAU * TAU);
	const thermalMean = Array.from({ length: EXPECT }, (_, k) => close(thermalDraw(9000 + k))).reduce((a, c) => a + c, 0) / EXPECT;
	const free = 1 + 0.5 * (1 - 2 * upper(Math.sqrt(2 * Math.PI)));
	const ratio = thermalMean / steadyMean;
	check(free.toFixed(2) === '1.49' && ratio > 1.15 && ratio < free, `the expected ratio ${ratio} (free count: ${free})`);
	check(Math.abs(s1.c / steadyMean - 1) < 0.08, `the typical steady sample's ${s1.c} close pairs against ${steadyMean}`);
	check([s2.c, s3.c].every((c) => Math.abs(c / s1.c - ratio) < 0.2), `the typical close pairs: ${s1.c}, ${s2.c}, ${s3.c}; expected ratio ${ratio}`);
	const rows = [steady, thermal, pair, pair];
	for (const [i, r] of rows.entries()) check(r.length === CLICKS && r.every((t) => t >= 0 && t <= 1), `row ${i + 1} has not ${CLICKS} clicks on the axis`);
	check(rows[2] === rows[3], 'the pair\'s rows differ');

	for (const [i, r] of rows.entries()) {
		const y = y0 + ROWS[i];
		S.path([[X(0), y], [X(1), y]], { color: DIM, width: AXIS, layer: 1, cap: 'butt', what: `the axis of row ${i + 1}` });
		const d = r.map((t) => `M${n2(X(t))},${n2(y - AXIS / 2)}V${n2(y - TH)}`).join('');
		S.raw(`<path d="${d}" stroke="${INK}" stroke-width="${TICK_W}" fill="none"/>`, 2);
		for (const t of r) S.mark([[X(t), y], [X(t), y - TH]], TICK_W / 2, `a click of row ${i + 1}`);
	}

	// ---- the hairlines between the pair's rows, at pairs clear of their neighbours, spread along the axis
	{
		// every pair: where two clicks lie closer than a line's width, their lines merge, as their ticks do
		const ya = y0 + ROWS[2] + AXIS / 2 + 1.2, yb = y0 + ROWS[3] - TH - 1.2;
		const d = pair.map((t) => `M${n2(X(t))},${n2(ya)}V${n2(yb)}`).join('');
		S.raw(`<path d="${d}" stroke="${DIM}" stroke-width="${JOIN_W}" fill="none"/>`, 1.5);
		for (const t of pair) S.mark([[X(t), ya], [X(t), yb]], JOIN_W / 2, 'a joining line');
		const free = pair;
		window[name + '-joined'] = free.length;
	}

	// ---- the coherence time, under the densest bunch of row 2
	{
		let best = 0, at = 0;
		for (let k = 0; k < thermal.length; k++) {
			const m = thermal.filter((t) => t >= thermal[k] && t <= thermal[k] + TAU).length;
			if (m > best) { best = m; at = thermal[k]; }
		}
		check(best >= 8, `the densest coherence time of row 2 holds ${best} clicks`);
		check(at + TAU <= 1, 'the bracket runs off the axis');
		const y = y0 + ROWS[1] + 7, a = X(at), b = X(at + TAU);
		check(Math.abs(b - a - LA / 10) < 1e-9, 'the bracket is not a tenth of the axis');
		dimension(S, a, b, y, { color: DIM, width: 0.5, what: 'the coherence time' });
		const right = b + LABEL_GAP + 1 + 60 < X(1);
		L.push(await placed('\\text{coherence time}', right ? b + LABEL_GAP + 1 : a - LABEL_GAP - 1, y, right ? 0 : 1, 0.5, INK));
	}

	// ---- time runs to the right: a short arrow under the last axis, at its right end, named "time"
	{
		const y = y0 + ROWS[3] + 7, a = X(1 - TIME), b = X(1);
		S.arrow([a, y], [b, y], { color: DIM, width: AXIS, head: AXIS_HEAD, layer: 2, what: 'the time arrow' });
		L.push(await placed('\\text{time}', a - LABEL_GAP - 0.6, y, 1, 0.5, DIM));
	}

	// ---- the labels, at the left of the rows
	const names = ['\\begin{array}{r}\\text{steady}\\\\ \\text{(coherent)}\\end{array}', '\\text{thermal}',
		'\\begin{array}{r}\\text{pair source,}\\\\ \\text{detector 1}\\end{array}', '\\text{detector 2}'];
	for (const [i, src] of names.entries()) L.push(await placed(src, X(0) - LABEL_GAP - 3, y0 + ROWS[i] - TH / 2, 1, 0.5, INK));

	S.checkAll(L);
	window[name + '-numbers'] = { steady, thermal, pair, seeds: [1000 + s1.k, 2000 + s2.k, 3000 + s3.k], close: [s1.c, s2.c, s3.c], ratio };
	return finish(S, L, [280, 340]);
}
