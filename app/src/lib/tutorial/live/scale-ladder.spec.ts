/** Chapter 0.6's ladder of scales, against the paper's numbers and the paper's labels. */
import { readFileSync, readdirSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
	ANSWER,
	AU,
	C,
	EARTH,
	HBAR,
	HOLE,
	LADDERS,
	LENGTHS,
	PARSEC,
	TIDES,
	clampTo,
	decades,
	factor,
	markOf,
	nearest,
	plain,
	power,
	spread,
	texFriendly,
	texPlain,
	tide
} from './scale-ladder';

const ladders = Object.values(LADDERS);

/** Words with their unbreakable spaces read as spaces. */
const spaced = (s: string) => s.replace(/\u00a0/g, ' ');

/** Rounded to the figures the paper prints. */
const figures = (x: number, n: number) => Number(x.toPrecision(n));

describe('powers of ten', () => {
	it('count factors of ten, and multiplying adds them', () => {
		expect(decades(1, 1000)).toBeCloseTo(3, 12);
		expect(decades(1000, 1)).toBeCloseTo(-3, 12);
		expect(decades(2e-11, 2e-8)).toBeCloseTo(3, 12);
		expect(decades(3, 7) + decades(7, 11)).toBeCloseTo(decades(3, 11), 12);
		expect(power(1e-9)).toBeCloseTo(-9, 12);
	});

	it('answer the prediction: the person’s tide is 4.7 powers of ten above the Moon’s', () => {
		const person = markOf(TIDES, 'person').value;
		const moon = markOf(TIDES, 'moon').value;
		expect(ANSWER).toBe(decades(moon, person));
		expect(ANSWER.toFixed(1)).toBe('4.7');
		// with the paper's own rounding of the person, 9 × 10⁻⁹, the answer is the same
		expect(decades(moon, 9e-9).toFixed(1)).toBe('4.7');
	});

	it('span forty-five steps from the hole’s trembling to the hole a metre away', () => {
		const span = decades(markOf(TIDES, 'hole-tremor').value, markOf(TIDES, 'hole').value);
		expect(Math.round(span)).toBe(45);
	});

	it('read the gradiometer as a signal-to-noise ratio of about five hundred on the person', () => {
		const ratio = markOf(TIDES, 'person').value / markOf(TIDES, 'gradiometer').value;
		expect(ratio).toBeGreaterThan(450);
		expect(ratio).toBeLessThan(500);
	});
});

describe('the marks are the paper’s numbers', () => {
	it('the tides, recomputed where the paper gives the formula', () => {
		// "A person of 70 kg standing one metre away produces 9 × 10⁻⁹ s⁻²"; "nine of them" eötvös
		expect(figures(markOf(TIDES, 'person').value, 1)).toBe(9e-9);
		expect(figures(markOf(TIDES, 'person').value, 2)).toBe(9.3e-9);
		// "2GM/R³ = 3.1 × 10⁻⁶ s⁻² along the vertical"
		expect(figures(tide(EARTH.M, EARTH.R), 2)).toBe(3.1e-6);
		// "three hundred times that of the person"
		expect(Math.round(tide(EARTH.M, EARTH.R) / markOf(TIDES, 'person').value / 10) * 10).toBe(330);
		// the Moon: "about fifty thousand times the Moon's" (§IV), and the Earth's turning, 5 × 10⁻⁹ s⁻²,
		// "some thirty thousand times the tide of the Moon" (§II)
		const moon = markOf(TIDES, 'moon').value;
		expect(figures(moon, 2)).toBe(1.7e-13);
		expect(9e-9 / moon).toBeGreaterThan(4.5e4);
		expect(9e-9 / moon).toBeLessThan(5.5e4);
		expect(Math.round(5e-9 / moon / 1e4)).toBe(3);
		// "0.02 E in a second", "9 × 10⁻¹⁴ s⁻²", "4 × 10⁻³² s⁻²"
		expect(markOf(TIDES, 'gradiometer').value).toBeCloseTo(2e-11, 20);
		expect(markOf(TIDES, 'quantum-limit').value).toBe(9e-14);
		expect(markOf(TIDES, 'hole-tremor').value).toBe(4e-32);
		// the quantum limit of two gram masses a centimetre apart, read for a second: the distance of the two is
		// uncertain by √2 √(ħτ/m), so 2√2 √(ħτ/m)/ξτ² = 9.2 × 10⁻¹⁴ s⁻², the paper's 9 × 10⁻¹⁴ (the one-mass
		// estimate, without the √2, is 6.5 × 10⁻¹⁴)
		const sql = Math.sqrt((HBAR * 1) / 1e-3);
		expect(figures((2 * Math.SQRT2 * sql) / (0.01 * 1 ** 2), 2)).toBe(9.2e-14);
		expect(figures((2 * sql) / (0.01 * 1 ** 2), 2)).toBe(6.5e-14);
		expect(figures((2 * Math.SQRT2 * sql) / 0.01, 1)).toBe(markOf(TIDES, 'quantum-limit').value);
		// the hole of 1.356 × 10²³ kg: "2 × 10¹³ s⁻²" at a metre, "1 s⁻² at 26 km"
		expect(HOLE).toBe(1.356e23);
		expect(figures(tide(HOLE, 1), 1)).toBe(2e13);
		expect(figures(tide(HOLE, 1), 2)).toBe(1.8e13);
		expect(figures(tide(HOLE, 26e3), 1)).toBe(1);
		expect(markOf(TIDES, 'bearable').value).toBe(1);
	});

	it('the lengths', () => {
		// "about 4 × 10⁻¹⁸ metres": a strain of 10⁻²¹ on an arm of 4 km
		expect(markOf(LENGTHS, 'ligo').value).toBeCloseTo(4e-18, 30);
		// "tens of micrometres": the peak of the glow at 300 K, 17 μm
		expect(Math.round(markOf(LENGTHS, 'heat').value * 1e6)).toBe(17);
		// "At 1 Hz the near zone reaches to 48,000 km"; the chapter's 47,700 km
		const reach = markOf(LENGTHS, 'near-zone').value;
		expect(Math.round(reach / 1e6) * 1e3).toBe(48_000);
		expect(Math.round(reach / 1e5) * 100).toBe(47_700);
		// "at three millihertz the waves are two-thirds of an astronomical unit long"
		expect(C / 3e-3 / AU).toBeCloseTo(2 / 3, 2);
		// ten kiloparsecs, 3.1 × 10²⁰ m
		expect(figures(markOf(LENGTHS, 'supernova').value, 2)).toBe(3.1e20);
		expect(PARSEC / 9.460_730_472_580_8e15).toBeCloseTo(3.26, 2);
	});

	it('the printed values agree with the values', () => {
		for (const ladder of ladders)
			for (const m of ladder.marks) {
				if (ladder.id === 'tides') expect(spaced(m.text).endsWith(' s⁻²'), m.id).toBe(true);
				expect(m.tex.length, m.id).toBeGreaterThan(0);
				// no line breaks inside a number or between a number and its unit
				for (const words of [m.text, m.scene, m.paper ?? ''])
					expect(words, m.id).not.toMatch(/ × |\d (s⁻²|kg|K|km|m|μm|E|AU|kpc)(?![a-z])/u);
			}
		expect(spaced(markOf(LENGTHS, 'au').text)).toBe('1 AU');
	});
});

describe('each ladder', () => {
	it('runs over the chapter’s range, with every mark inside it and in order', () => {
		expect(TIDES.range).toEqual([-33, 14]);
		expect(LENGTHS.range).toEqual([-18, 21]);
		for (const ladder of ladders) {
			const ps = ladder.marks.map((m) => power(m.value));
			expect(
				[...ps].sort((a, b) => a - b),
				ladder.id
			).toEqual(ps);
			for (const p of ps) {
				expect(p).toBeGreaterThan(ladder.range[0]);
				expect(p).toBeLessThan(ladder.range[1]);
			}
			for (const t of [...ladder.ticks, ...ladder.phoneTicks]) {
				expect(t).toBeGreaterThanOrEqual(ladder.range[0]);
				expect(t).toBeLessThanOrEqual(ladder.range[1]);
			}
			expect(new Set(ladder.marks.map((m) => m.id)).size).toBe(ladder.marks.length);
		}
	});

	it('finds the nearest mark, and keeps the pointer on the axis', () => {
		expect(nearest(TIDES, -8).id).toBe('person');
		expect(nearest(TIDES, -12.9).id).toBe('moon');
		expect(nearest(TIDES, -13.1).id).toBe('quantum-limit');
		expect(nearest(TIDES, 14).id).toBe('hole');
		expect(nearest(LENGTHS, 0.2).id).toBe('metre');
		expect(clampTo(TIDES, -40)).toBe(-33);
		expect(clampTo(LENGTHS, 30)).toBe(21);
	});
});

describe('every link is a label of the paper, in the section it names', () => {
	const dir = '../paper/sections';
	const order = [
		...readFileSync('../paper/main.tex', 'utf8').matchAll(/\\input\{sections\/([^}]+)\}/g)
	].map((m) => m[1]);
	const roman = (n: number) =>
		[
			'',
			'I',
			'II',
			'III',
			'IV',
			'V',
			'VI',
			'VII',
			'VIII',
			'IX',
			'X',
			'XI',
			'XII',
			'XIII',
			'XIV',
			'XV',
			'XVI',
			'XVII'
		][n];
	/** Each label of the paper, with the number of the section it stands in. */
	const where = new Map<string, string>();
	let section = 0;
	for (const name of order) {
		if (!readdirSync(dir).includes(`${name}.tex`)) continue;
		const text = readFileSync(`${dir}/${name}.tex`, 'utf8').replace(/(^|[^\\])%.*$/gm, '$1');
		for (const m of text.matchAll(/\\section(\*?)\{|\\label\{([^}]+)\}/g)) {
			if (m[2] === undefined) {
				if (m[1] !== '*') section += 1;
			} else where.set(m[2], roman(section));
		}
		if (name.startsWith('13-')) break;
	}

	it('reads the paper’s sections', () => {
		expect(where.get('sec:pixel')).toBe('II');
		expect(where.get('sec:hole')).toBe('XIV');
	});

	for (const ladder of ladders)
		for (const m of ladder.marks)
			it(`${ladder.id}: ${m.id} links to ${m.label}, in §${m.section}`, () => {
				expect(where.has(m.label), m.label).toBe(true);
				expect(where.get(m.label)).toBe(m.section);
			});
});

describe('the words beside the axis', () => {
	it('never come closer than the gap, keep their order and stay in bounds', () => {
		for (const ladder of ladders)
			for (const [length, gap] of [
				[460, 15],
				[322, 12.5],
				[300, 14]
			]) {
				const [lo, hi] = ladder.range;
				const want = ladder.marks.map((m) => ((power(m.value) - lo) / (hi - lo)) * length);
				const got = spread(want, gap, 0, length);
				for (let i = 1; i < got.length; i++)
					expect(got[i] - got[i - 1], `${ladder.id} ${i}`).toBeGreaterThanOrEqual(gap - 1e-9);
				for (const y of got) {
					expect(y).toBeGreaterThanOrEqual(-1e-9);
					expect(y).toBeLessThanOrEqual(length + 1e-9);
				}
			}
	});

	it('leave words that are not crowded where they want to be', () => {
		expect(spread([0, 50, 100], 10, 0, 200)).toEqual([0, 50, 100]);
		expect(spread([50, 52], 10, 0, 200)).toEqual([46, 56]);
		expect(spread([0, 1], 10, 0, 200)).toEqual([0, 10]);
	});
});

describe('the numbers in words', () => {
	it('prints powers of ten as a reader writes them', () => {
		expect(spaced(plain(1.725e-13))).toBe('1.7 × 10⁻¹³');
		expect(plain(1.725e-13)).not.toContain(' ');
		expect(spaced(plain(4e-32, 1))).toBe('4 × 10⁻³²');
		expect(plain(12.3)).toBe('12');
		expect(plain(1234)).toBe('1,200');
		expect(plain(0.0532)).toBe('0.053');
		expect(texPlain(12.3)).toBe('12');
		expect(plain(1, 1)).toBe('1');
		expect(plain(1e-9, 1)).toBe('10⁻⁹');
		expect(plain(9.96e-9, 2)).toBe('10⁻⁸');
		expect(texPlain(1.815e13)).toBe('1.8\\times10^{13}');
		expect(factor(54_150)).toBe('54,000');
		expect(factor(3)).toBe('3.0');
	});

	it('gives lengths in a unit that suits them', () => {
		expect(texFriendly(17e-6)).toBe('17\\,\\mathrm{\\mu m}');
		expect(texFriendly(C / (2 * Math.PI))).toBe('47{,}700\\,\\mathrm{km}');
		expect(texFriendly(AU)).toBe('1\\,\\mathrm{AU}');
		expect(texFriendly(1e4 * PARSEC)).toBe('10\\,\\mathrm{kpc}');
		expect(texFriendly(2)).toBeUndefined();
	});
});
