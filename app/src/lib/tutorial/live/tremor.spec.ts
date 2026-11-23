/** Chapter 4.6's tremor: the shipped table against the chapter's and the paper's numbers, and the model's rules. */
import { describe, expect, it } from 'vitest';
import { TABLE } from './tremor-data';
import {
	JITTER_TOPS,
	OPENING,
	PLOT_MOST,
	QUALITY,
	RATIOS,
	RATE_AXIS,
	REFERENCE,
	SECOND_RATIO,
	STIFFNESS,
	below,
	fourfold,
	jitter,
	jitterAxis,
	levels,
	line,
	lineArea,
	lowQ,
	peak,
	qualityOf,
	rateLine,
	samples,
	share,
	spectrum,
	spectrumArea,
	steps,
	stiffnessOf,
	strongest,
	sum,
	total,
	type Ratio
} from './tremor';

/**
 * The chapter's numbers at r = ¼, ½, 1, but for the share at r = ¼: the table gives 0.80546, which the chapter's spec
 * prints as 0.806, the 0.8055 of four figures rounded again.
 */
const CHAPTER: Record<Ratio, { share: string; frequency: string; jitter: string }> = {
	0.25: { share: '0.805', frequency: '2.62', jitter: '7.1' },
	0.5: { share: '0.848', frequency: '2.34', jitter: '5.9' },
	1: { share: '0.873', frequency: '2.22', jitter: '5.4' }
};

describe('the table', () => {
	it('holds Appendix A’s lattices: 924 and 668 masses', () => {
		for (const r of RATIOS) {
			expect(TABLE[r].ball.count).toBe(924);
			expect(TABLE[r].shell.count).toBe(668);
		}
	});

	it('has its levels in order of frequency, apart by more than the merging tolerance', () => {
		for (const r of RATIOS)
			for (const b of ['ball', 'shell'] as const) {
				const ls = TABLE[r][b].levels;
				for (let i = 1; i < ls.length; i++)
					expect(ls[i][0] - ls[i - 1][0]).toBeGreaterThan(1e-7 * ls[i][0]);
				for (const [omega, c2] of ls) {
					expect(omega).toBeGreaterThan(0);
					expect(c2).toBeGreaterThan(0);
				}
			}
	});

	it('gives Σc_n² equal to Σ_p m_p|∇h|² to rounding, for both bodies and every ratio', () => {
		for (const r of RATIOS)
			for (const b of ['ball', 'shell'] as const) {
				const t = TABLE[r][b];
				const s = t.levels.reduce((a, l) => a + l[1], 0);
				expect(Math.abs(s / t.inertia - 1)).toBeLessThan(1e-7);
			}
	});

	it('gives totals in the ratio 1.220 of the lattices’ Σ m r², at every ratio', () => {
		expect(SECOND_RATIO.toFixed(3)).toBe('1.220');
		for (const r of RATIOS) {
			const ratio = total(levels('shell', r)) / total(levels('ball', r));
			expect(Math.abs(ratio / SECOND_RATIO - 1)).toBeLessThan(1e-6);
			expect(ratio.toFixed(3)).toBe('1.220');
		}
	});

	it('gives the chapter’s shares, frequency ratios and static-jitter ratios', () => {
		for (const r of RATIOS) {
			const ball = levels('ball', r);
			const shell = levels('shell', r);
			expect(share(ball).toFixed(3)).toBe(CHAPTER[r].share);
			expect((strongest(ball).x / strongest(shell).x).toFixed(2)).toBe(CHAPTER[r].frequency);
			expect((jitter(shell) / jitter(ball)).toFixed(1)).toBe(CHAPTER[r].jitter);
		}
	});

	it('gives the paper’s 85% in one mode, 99% below twice it, and the shell’s 77%', () => {
		const ball = levels('ball', 0.5);
		const shell = levels('shell', 0.5);
		expect(Math.round(100 * share(ball))).toBe(85);
		expect(Math.round(100 * share(shell))).toBe(77);
		expect(below(ball, 2 * strongest(ball).x)).toBeGreaterThan(0.99);
	});

	it('puts the ball’s strongest mode at 1 on the paper’s axis', () => {
		expect(strongest(levels('ball', 0.5)).x).toBeCloseTo(1, 12);
		expect(REFERENCE).toBeGreaterThan(0);
		expect(total(levels('ball', 0.5))).toBeCloseTo(1, 7);
	});
});

describe('the stiffness', () => {
	it('leaves the totals unchanged', () => {
		for (const r of RATIOS)
			for (const s of [0.25, 0.5, 2, 4]) {
				expect(total(levels('ball', r, s))).toBeCloseTo(total(levels('ball', r)), 12);
				expect(total(levels('shell', r, s))).toBeCloseTo(total(levels('shell', r)), 12);
			}
	});

	it('scales every frequency as √s, and the static jitter as 1/s', () => {
		for (const s of [0.25, 4]) {
			const a = levels('shell', 1);
			const b = levels('shell', 1, s);
			a.forEach((l, i) => expect(b[i].x / l.x).toBeCloseTo(Math.sqrt(s), 12));
			expect(jitter(b) / jitter(a)).toBeCloseTo(1 / s, 12);
		}
	});
});

describe('the cumulative curves', () => {
	it('rise by each weight at its frequency and end at the total when every level is on the plot', () => {
		const ls = levels('ball', 0.5, 0.25);
		const st = steps(ls, 'rate', 1e9);
		expect(st[st.length - 1][1]).toBeCloseTo(total(ls), 12);
		for (let i = 1; i < st.length; i++) {
			expect(st[i][0]).toBeGreaterThanOrEqual(st[i - 1][0]);
			expect(st[i][1]).toBeGreaterThanOrEqual(st[i - 1][1]);
		}
	});

	it('stop at the plot’s edge with the levels below it', () => {
		const ls = levels('ball', 0.5, 4);
		const st = steps(ls, 'rate', PLOT_MOST);
		expect(st[st.length - 1]).toEqual([PLOT_MOST, expect.any(Number)]);
		expect(st[st.length - 1][1]).toBeCloseTo(below(ls, PLOT_MOST) * total(ls), 12);
	});

	it('add up Σc_n²/ω_n² for the static jitter', () => {
		const ls = levels('shell', 0.25);
		expect(sum(ls, 'jitter')).toBeCloseTo(jitter(ls), 12);
		expect(sum(levels('ball', 0.5), 'jitter')).toBeCloseTo(1, 12);
	});
});

describe('the spectrum of the rate', () => {
	it('has lines of area π c² over ω, by brute force', () => {
		// trapezoids on a fine grid to ω = 2000 ω_n, then the tail 2Γc²/ω
		const omegaN = 1.3;
		const c2 = 0.7;
		for (const Q of [3, 30]) {
			const end = 2000 * omegaN;
			const n = 4_000_000;
			let s = 0;
			let prev = 0;
			for (let i = 1; i <= n; i++) {
				const w = (end * i) / n;
				const f = rateLine(w, omegaN, Q, c2);
				s += ((f + prev) / 2) * (end / n);
				prev = f;
			}
			s += (2 * (omegaN / Q) * c2) / end;
			expect(s / (Math.PI * c2)).toBeCloseTo(1, 5);
		}
	});

	it('draws each line with area c_n² over the plotted frequency, whatever Q', () => {
		const ls = levels('shell', 0.5);
		for (const Q of [3, 30, 300])
			for (const l of [ls[0], strongest(ls), ls[ls.length - 1]])
				expect(lineArea(l, Q) / l.w).toBeCloseTo(1, 9);
	});

	it('keeps the totals in the area of the whole spectrum, at every Q', () => {
		for (const Q of [3, 30, 300]) {
			const ball = levels('ball', 0.25, 2);
			const shell = levels('shell', 0.25, 2);
			expect(spectrumArea(ball, Q)).toBeCloseTo(total(ball), 8);
			expect(spectrumArea(shell, Q) / spectrumArea(ball, Q)).toBeCloseTo(SECOND_RATIO, 6);
		}
	});

	it('lowers a line by as much as it widens it', () => {
		const l = strongest(levels('ball', 0.5));
		expect(peak(l, 30) / peak(l, 3)).toBeCloseTo(10, 9);
		expect(peak(l, 30)).toBeCloseTo((2 * 30 * l.w) / (Math.PI * l.x), 9);
		expect(line(l.x, l, 30)).toBe(peak(l, 30));
	});

	it('samples every line’s peak finely enough to draw it', () => {
		const ls = levels('ball', 0.5);
		const xs = samples(ls, 300, PLOT_MOST);
		const top = Math.max(...xs.map((x) => spectrum(x, ls, 300)));
		expect(top / peak(strongest(ls), 300)).toBeGreaterThan(0.99);
		for (let i = 1; i < xs.length; i++) expect(xs[i]).toBeGreaterThan(xs[i - 1]);
	});
});

describe('the controls and the predictions', () => {
	it('open at s = 1, r = ½, Q = 30, on the sliders’ steps', () => {
		expect(OPENING).toEqual({ s: 1, ratio: 0.5, Q: 30, jitter: false });
		expect(stiffnessOf(STIFFNESS.low)).toBe(0.25);
		expect(stiffnessOf(STIFFNESS.high)).toBe(4);
		expect(qualityOf(QUALITY.low)).toBe(3);
		expect(qualityOf(QUALITY.high)).toBe(300);
		const k = (Math.log10(30) - QUALITY.low) / QUALITY.step;
		expect(Math.abs(k - Math.round(k))).toBeLessThan(1e-9);
		expect(qualityOf(QUALITY.low + Math.round(k) * QUALITY.step)).toBe(30);
	});

	it('answer the first when the springs are four times stiffer, the second at Q = 3', () => {
		expect(fourfold(4, 1)).toBe(true);
		expect(fourfold(3.9, 1)).toBe(false);
		expect(fourfold(1, 0.25)).toBe(true);
		expect(lowQ(3)).toBe(true);
		expect(lowQ(3.05)).toBe(false);
	});

	it('fit the static jitter’s axis, and keep the paper’s for the rate', () => {
		expect(RATE_AXIS.top).toBe(1.36);
		const most = Math.max(
			...RATIOS.flatMap((r) => [0.25, 4].map((s) => jitter(levels('shell', r, s))))
		);
		expect(most).toBeLessThan(JITTER_TOPS[JITTER_TOPS.length - 1].top / 1.125);
		const shell = jitter(levels('shell', 0.5));
		expect(jitterAxis(shell).top).toBeGreaterThan(shell);
	});
});
