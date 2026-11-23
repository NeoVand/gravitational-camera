/** Chapter 0.1's map of the regimes, against the paper's numbers and against the paper's own figure. */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
	C,
	EDGE_LABEL,
	FRAME,
	MERGER,
	PEAK,
	SOURCES,
	THERMAL_FROM,
	TICKS,
	ZONE_NAMES_AT,
	depth,
	edgeFrequency,
	edgeInFrame,
	nearZone,
	peakFrequency,
	peakTemperature,
	period,
	regime,
	texFrequency,
	texLength,
	texTemperature,
	wavelength,
	zones
} from './regime-map';

const relative = (a: number, b: number, tolerance: number) =>
	expect(Math.abs(a - b)).toBeLessThanOrEqual(tolerance * Math.abs(b));

describe('the edge of the near zone', () => {
	it('is λ/2π = c/2πf, as the paper and the chapter give it', () => {
		expect(wavelength(1)).toBe(C);
		relative(nearZone(1), C / (2 * Math.PI), 1e-15);
		// "At 1 Hz the near zone reaches to 48,000 km; at 1 kHz, to 48 km"; the chapter's 47,700 km and 47.7 km
		expect(Math.round(nearZone(1) / 1e5) * 100).toBe(47_700);
		expect(Math.round(nearZone(1e3) / 1e2) / 10).toBe(47.7);
		// the chapter's problem: the near zone is 1 m at 48 MHz
		expect(Math.round(edgeFrequency(1) / 1e6)).toBe(48);
		relative(nearZone(edgeFrequency(7.3)), 7.3, 1e-14);
	});

	it('answers the chapter’s questions', () => {
		// a person swaying once a second, 10 km away: near field, far inside 47,700 km
		expect(regime(1, 1e4)).toBe('near');
		expect(depth(1, 1e4)).toBeLessThan(1e-3);
		// a source at 1 kHz, 100 km away: not in the near field
		expect(regime(1e3, 1e5)).toBe('wave');
		expect(depth(1e3, 1e5)).toBeCloseTo(2.096, 3);
	});

	it('crosses the frame as a line of slope −1, with the near field on its left', () => {
		const [top, bottom] = edgeInFrame();
		expect(top.lr).toBe(FRAME.lr[1]);
		expect(bottom.lr).toBe(FRAME.lr[0]);
		relative(10 ** top.lf, C / (2 * Math.PI * 1e12), 1e-12);
		relative(10 ** bottom.lf, C / (2 * Math.PI * 0.1), 1e-12);
		const { near, wave } = zones();
		expect(near).toHaveLength(4);
		expect(wave).toHaveLength(4);
		for (const p of [...near, ...wave]) {
			expect(p.lf).toBeGreaterThanOrEqual(FRAME.lf[0]);
			expect(p.lf).toBeLessThanOrEqual(FRAME.lf[1]);
		}
	});
});

describe('the thermal peak', () => {
	it('has the constant of the peak per unit frequency, 2.8214', () => {
		expect(PEAK).toBeCloseTo(2.821439372, 9);
		expect(PEAK).toBeCloseTo(3 * (1 - Math.exp(-PEAK)), 14);
	});

	it('puts 300 K at 1.763 × 10¹³ Hz, and back', () => {
		expect(peakFrequency(300) / 1e13).toBeCloseTo(1.7637, 4);
		relative(peakTemperature(peakFrequency(300)), 300, 1e-14);
		// 3500 K and 15.7 MK, the paper's other two
		expect(Number(peakFrequency(3500).toPrecision(3))).toBe(2.06e14);
		expect(Number(peakFrequency(15.7e6).toPrecision(2))).toBe(9.2e17);
		// the afterglow of the Big Bang peaks at 160 GHz
		expect(Math.round(THERMAL_FROM / 1e9)).toBe(160);
	});

	it('places each of the paper’s thermal sources at its peak, to the figures the paper prints', () => {
		const printed: [number, number][] = [
			[300, 3],
			[3500, 3],
			[15.7e6, 2]
		];
		const thermal = SOURCES.filter((s) => s.thermal);
		expect(thermal.map((s) => s.thermal)).toEqual(printed.map(([T]) => T));
		thermal.forEach((s, i) => {
			expect(Number(peakFrequency(s.thermal!).toPrecision(printed[i][1]))).toBe(s.f);
		});
	});
});

describe('the numbers for a reader', () => {
	it('choose their units', () => {
		expect(texFrequency(1)).toBe('1\\,\\mathrm{Hz}');
		expect(texFrequency(10 ** -0.5)).toBe('0.316\\,\\mathrm{Hz}');
		expect(texFrequency(peakFrequency(300))).toBe('1.76 \\times 10^{13}\\,\\mathrm{Hz}');
		expect(texFrequency(1e6)).toBe('10^{6}\\,\\mathrm{Hz}');
		expect(texLength(nearZone(1))).toBe('47{,}700\\,\\mathrm{km}');
		expect(texLength(nearZone(1e3))).toBe('47.7\\,\\mathrm{km}');
		expect(texLength(wavelength(peakFrequency(300)))).toBe('17\\,\\mathrm{\\mu m}');
		expect(texLength(0.9999)).toBe('1\\,\\mathrm{m}');
		expect(texLength(nearZone(1e-9))).toBe('5.04\\ \\text{light-years}');
		expect(texLength(4.77e13)).toBe('4.77 \\times 10^{10}\\,\\mathrm{km}');
		expect(texTemperature(300)).toBe('300\\,\\mathrm{K}');
		expect(texTemperature(15.7e6)).toBe('1.57 \\times 10^{7}\\,\\mathrm{K}');
		// the Moon's tide comes round twice a day
		expect(period(1 / 10 ** -4.65)).toBe('12.4 hours');
	});
});

describe('the chart, against the paper’s figure', () => {
	const source = readFileSync('../paper/figures/make_figures.py', 'utf8');
	const body = source.slice(source.indexOf('def regimes():'), source.indexOf('def nearfield():'));
	/** A Python number as make_figures.py writes it: 1e6, 1.0, 10 ** -4.65. */
	const value = (s: string) => {
		const m = s.trim().match(/^10 \*\* (-?[\d.]+)$/);
		return m ? 10 ** Number(m[1]) : Number(s);
	};

	it('has the paper’s frame, ticks and speed of light', () => {
		expect(Number(source.match(/^C = ([\d_.]+)/m)![1].replace(/_/g, ''))).toBe(C);
		const frame = body
			.match(/f0, f1, r0, r1 = ([^#\n]+)/)![1]
			.split(',')
			.map(value);
		expect(frame.map(Math.log10)).toEqual([...FRAME.lf, ...FRAME.lr]);
		const ticks = [...body.matchAll(/set_[xy]ticks\(\[([^\]]+)\]/g)].map((m) =>
			m[1].split(',').map((t) => Math.round(Math.log10(value(t))))
		);
		expect(ticks).toEqual([[...TICKS.lf], [...TICKS.lr]]);
	});

	it('names the zones and the edge where the paper does', () => {
		expect(body).toContain(`ax.annotate(name, (x, 1e${ZONE_NAMES_AT})`);
		const edge = body.match(
			/xy=\(([^,]+), C \/ \(2 \* np\.pi \* \1\)\), xytext=\(([^,]+), ([^)]+)\)/
		)!;
		expect(Math.log10(value(edge[1]))).toBe(EDGE_LABEL.to);
		expect(Math.log10(value(edge[2]))).toBe(EDGE_LABEL.lf);
		expect(Math.log10(value(edge[3]))).toBe(EDGE_LABEL.lr);
		const arrow = body.match(/xy=\(([^,]+), ([^)]+)\), xytext=\(([^,]+), ([^)]+)\)/g)!;
		const merger = arrow
			.at(-1)!
			.match(/\d[\d.e+-]*/g)!
			.map(Number);
		expect(merger.map(Math.log10)).toEqual([MERGER.lf, MERGER.to, MERGER.lf, MERGER.from]);
		const words = body.match(/ax\.text\(([^,]+), ([^,]+), "neutron stars merging,/)!;
		expect([Math.log10(value(words[1])), Math.log10(value(words[2]))]).toEqual([
			MERGER.text.lf,
			MERGER.text.lr
		]);
	});

	it('places the eight sources exactly where the paper does', () => {
		const block = body.slice(
			body.indexOf('sources = ['),
			body.indexOf('    ]', body.indexOf('sources = ['))
		);
		const rows = [
			...block.matchAll(
				/\(([^,]+), ([^,]+), "([^"]+)", \((-?[\d.]+), (-?[\d.]+)\), "(\w+)", (True|False)\)/g
			)
		];
		expect(rows).toHaveLength(8);
		expect(SOURCES).toHaveLength(8);
		rows.forEach((m, i) => {
			const s = SOURCES[i];
			expect(s.f).toBe(value(m[1]));
			expect(s.r).toBe(value(m[2]));
			expect(s.lines).toEqual(m[3].replace(/'/g, '’').split('\\n'));
			expect(s.offset).toEqual([Number(m[4]), Number(m[5])]);
			expect(s.align).toBe(m[6]);
			expect(s.thermal !== undefined).toBe(m[7] === 'True');
		});
	});

	it('keeps every source inside the frame and on its own side of the edge', () => {
		for (const s of SOURCES) {
			expect(Math.log10(s.f)).toBeGreaterThan(FRAME.lf[0]);
			expect(Math.log10(s.f)).toBeLessThan(FRAME.lf[1]);
			expect(Math.log10(s.r)).toBeGreaterThan(FRAME.lr[0]);
			expect(Math.log10(s.r)).toBeLessThan(FRAME.lr[1]);
			expect(regime(s.f, s.r)).toBe(s.thermal ? 'wave' : 'near');
		}
	});
});
