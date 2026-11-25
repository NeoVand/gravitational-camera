/**
 * What the tutorial's landing page (/tutorial) shows besides the catalogue: a picture and a sentence for each part,
 * a picture for each route's destination, how long a route takes to read, and the wall of the paper's numbered
 * equations with the chapter that derives each. Pure: the page's loader (lib/server/tutorial-landing.ts) gives it
 * the catalogue, the paper's equation numbers and the margin map.
 */
import type { Catalogue, Chapter } from './catalogue';
import type { PaperLink } from './paper-links';

/** A picture: one of the tutorial's drawings (tutorial/figures/<name>.svg, themed and inlined when it nears the
 * screen) or the poster of a demo (static/posters/<slug>.jpg). */
export type Picture =
	{ kind: 'drawing'; name: string; alt: string } | { kind: 'poster'; slug: string; alt: string };

/**
 * Each part's picture: its hero drawing where it has one (the earliest in the part, when it has several), otherwise
 * a drawing or a demo of its first chapters.
 */
export const PART_PICTURES: Readonly<Record<string, Picture>> = {
	// the paper's opening scene, which chapters 0.1 and 0.3 read
	'0': {
		kind: 'poster',
		slug: 'sun-at-midnight',
		alt: 'At midnight the ground is dark in light, while in gravity the Sun shines up through the Earth.'
	},
	// chapter 1.4's first figure: the tide of a person on a ring of free balls
	'1': {
		kind: 'drawing',
		name: 'tut-tides',
		alt: 'A person one metre from a ring of free balls, which the person’s tide stretches into an ellipse.'
	},
	'2': {
		kind: 'drawing',
		name: 'tut-null-hero',
		alt: 'Three balls of the same mass and size, dense at the edge, uniform, dense at the centre: their fields outside are the same.'
	},
	'3': {
		kind: 'drawing',
		name: 'tut-noise-hero',
		alt: 'White noise: a jagged signal, its flat spectrum, and a random pattern of cells beside its flat average.'
	},
	'4': {
		kind: 'drawing',
		name: 'tut-osc-hero',
		alt: 'A trembling stone ball one metre from a ring of free balls; as its shape swings, the ring’s tide swings with it.'
	},
	// the part's capstone, R5: which way a hidden rotor turns
	'5': {
		kind: 'poster',
		slug: 'which-way',
		alt: 'Three closed boxes on a shelf; in gravity two of them glow, green and pink, by the sense of their turning.'
	},
	'6': {
		kind: 'drawing',
		name: 'tut-lorentz-hero',
		alt: 'The light cone of an event, cut by two planes of simultaneity tilted against each other.'
	},
	// chapter 7.2's figure: curvature is a tide, the tube of falling balls beside a mass
	'7': {
		kind: 'drawing',
		name: 'tut-curvature-tube',
		alt: 'Beside a mass, a ring of free balls falls through time and its tube is squeezed and stretched.'
	},
	'8': {
		kind: 'drawing',
		name: 'tut-quantum-hero',
		alt: 'A stone ball with its ladder of energy levels, warm and full of quanta, and the same ball cold, near its zero point.'
	},
	'9': {
		kind: 'drawing',
		name: 'tut-one-point-hero',
		alt: 'Two stone bodies beside a sphere of directions, with a ring of free balls at its centre.'
	},
	'10': {
		kind: 'drawing',
		name: 'tut-glow-hero',
		alt: 'A closed stone furnace cut open, a warm block glowing inside it.'
	},
	'11': {
		kind: 'drawing',
		name: 'tut-hole-hero',
		alt: 'Paths of light bent around a black hole, and a ring of free balls stretched by its tide.'
	},
	'12': {
		kind: 'drawing',
		name: 'tut-sky-hero',
		alt: 'The disc of the Galaxy glowing along its plane, with a star and its remnant drawn close.'
	},
	'13': {
		kind: 'drawing',
		name: 'tut-keeps-hero',
		alt: 'Two cut-open shells pushed by the same tide, one with a ball at its centre; two bars compare what each takes up.'
	}
};

/** One sentence for each part, as the landing page introduces it. */
export const PART_LINES: Readonly<Record<string, string>> = {
	'0': 'The whole idea in six short chapters: a pixel that feels tides, mass seen through walls, the glow of heat, and one pixel that does a camera’s work.',
	'1': 'Fields and tides, the five numbers a tide is made of, and the kick a passing mass gives.',
	'2': 'Harmonic functions, multipoles and the null space: what the field outside a body can and cannot say about its inside.',
	'3': 'Noise, the best guess and the bits a picture holds, and why a picture made by gravity blurs as it does.',
	'4': 'Oscillators, temperature and friction: how a warm body trembles, and what the trembling reveals.',
	'5': 'Waves, diffraction, polarization and glow: the optics of a wave too long to focus.',
	'6': 'Clocks and light, the weight of energy, and Maxwell’s field as one complex vector.',
	'7': 'Curvature as a tide, Einstein’s equation, and the waves that moving masses send out.',
	'8': 'States, quanta and the limit that quantum noise sets on every detector.',
	'9': 'What one pixel reads: spin two, four directions on the sky, and a body in motion.',
	'10': 'Planck’s law, and why matter barely glows in gravity.',
	'11': 'The horizon and its shadow, Hawking’s temperature, and a hole under tides.',
	'12': 'Stars and their remnants, the Galaxy, and the glow left from the beginning.',
	'13': 'A push, a pass and a weighing: how a tide reaches the inside, and what remains of holography without quantum mechanics.'
};

/**
 * Each route's destination, as the demo scene that shows its part of the paper (3D scenes, not diagram demos). Part 0
 * has the Sun at midnight, so Sections VI and IX take the closed furnace (Section VI's glow of hot matter). Sections
 * XII to XV take full-or-empty, the ball against the shell, which is also the banner: the tutorial ends where its
 * opening picture points.
 */
export const ROUTE_POSTERS: Readonly<Record<string, string>> = {
	// what a pixel measures: the tide of two people, through a wall
	'section-ii': 'behind-the-wall',
	'section-iv': 'locked-safe',
	// R7b's capstone is the sealed rotor
	'section-v': 'sealed-flywheel',
	'section-vii': 'black-hole',
	// one pixel reads where a moving body is now
	'section-viii': 'where-it-is',
	'sections-vi-and-ix': 'closed-furnace',
	'sections-x-and-xi': 'milky-way',
	'sections-xii-to-xv': 'full-or-empty'
};

/** A chapter as the page draws it: a dot or a line of a list. */
export interface LandingChapter {
	id: string;
	title: string;
	part: string;
	reading: boolean;
	href?: string;
}

export interface LandingPart {
	id: string;
	title: string;
	line: string;
	picture: Picture;
	href?: string;
	chapters: LandingChapter[];
}

export interface LandingRoute {
	id: string;
	/** "Section IV, the near field" */
	destination: string;
	poster: string;
	minutes: number;
	time: string;
	href?: string;
	chapters: LandingChapter[];
}

/** Minutes to read a chapter of each size, roughly: a short chapter is an evening's coffee, a long one an hour. */
export const MINUTES: Readonly<Record<Chapter['size'], number>> = { S: 20, M: 35, L: 50 };

export const readingMinutes = (chapters: readonly Pick<Chapter, 'size'>[]): number =>
	chapters.reduce((n, c) => n + MINUTES[c.size], 0);

/** "about 14½ hours": the time in hours, to the nearest half hour. */
export function readingTime(minutes: number): string {
	const halves = Math.max(1, Math.round(minutes / 30));
	if (halves === 1) return 'about half an hour';
	const whole = Math.floor(halves / 2);
	const text = halves % 2 ? `${whole}½` : String(whole);
	return `about ${text} ${halves === 2 ? 'hour' : 'hours'}`;
}

/** The route's destination in words: its title without "To ". */
export const destination = (title: string): string =>
	title.replace(/^To\s+/, '').replace(/^./, (c) => c.toUpperCase());

/** One numbered equation of the paper, and the chapter that derives it or reads it. */
export interface EquationTile {
	/** as printed: "1" to "108" */
	number: string;
	/** the paper's label, "eq:tidal" */
	label: string;
	/** derived in the tutorial ("Derivation" in the margin map), or stated in the paper and read */
	derived: boolean;
	chapter: string;
	/** a section of the chapter, if the link lands there */
	section?: string;
}

/**
 * The paper's numbered equations in order, each with its chapter. `equations` maps each label to the number it
 * prints (several labels may share one number); an equation's chapter is its first label's in the margin map.
 * Throws if an equation has no chapter, so that a new equation cannot go missing from the wall.
 */
export function equationWall(
	equations: ReadonlyMap<string, { number: string }>,
	links: readonly PaperLink[]
): EquationTile[] {
	const byAnchor = new Map(links.map((l) => [l.anchor, l]));
	const byNumber = new Map<string, string[]>();
	for (const [label, { number }] of equations) {
		const list = byNumber.get(number) ?? [];
		list.push(label);
		byNumber.set(number, list);
	}
	return [...byNumber]
		.sort(([a], [b]) => Number(a) - Number(b))
		.map(([number, labels]) => {
			const link =
				labels.map((l) => byAnchor.get(l)).find((l) => l?.label === 'Derivation') ??
				labels.map((l) => byAnchor.get(l)).find(Boolean);
			if (!link) throw new Error(`equation ${number} (${labels.join(', ')}) has no chapter`);
			return {
				number,
				label: link.anchor,
				derived: link.label === 'Derivation',
				chapter: link.chapter,
				...(link.section ? { section: link.section } : {})
			};
		});
}

/** Every part has a picture and a sentence; returns the ids of those that lack one. */
export const partsLacking = (catalogue: Catalogue): string[] =>
	catalogue.parts.map((p) => p.id).filter((id) => !PART_PICTURES[id] || !PART_LINES[id]);
