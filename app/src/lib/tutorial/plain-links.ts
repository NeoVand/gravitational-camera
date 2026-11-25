/**
 * The paper's plain-words boxes link into the tutorial in their text (PLAN.md section 6): in the box of each section,
 * the first occurrence of each phrase below becomes a link to the chapter that teaches it, without touching the
 * paper's LaTeX. The phrases are written as the page shows them (curly apostrophes and all); each must occur exactly
 * once in its box, in one run of text (not across bold or italic words), outside the links and the mathematics the
 * box already has. Otherwise plain-links.spec.ts fails, and the page shows the phrase unlinked, so that a change in
 * the paper's wording never breaks the build. A link to a chapter that is not published is left out. The paper's
 * renderer (lib/paper/render.ts) makes the links.
 */

export interface PlainLink {
	/** the section whose plain-words box holds the phrase: every section has at most one box */
	section: string;
	/** words of the box, exactly as rendered */
	phrase: string;
	/** the tutorial chapter's id, as parts.yaml numbers it */
	chapter: string;
	/** a section id within the chapter, if the link should land there */
	anchor?: string;
}

/** In the order of the paper, and within each box in the order of the text. */
export const plainLinks: PlainLink[] = [
	// Section I, the introduction: the evening tour, one chapter for each thing the camera does
	{
		section: 'sec:introduction',
		phrase: 'a camera with a single pixel',
		chapter: '0.1',
		anchor: 'ligo-is-a-camera-with-one-pixel'
	},
	{ section: 'sec:introduction', phrase: 'walls do not block the view', chapter: '0.2' },
	{
		section: 'sec:introduction',
		phrase: 'send out very weak gravitational waves',
		chapter: '0.3'
	},
	{
		section: 'sec:introduction',
		phrase: 'measure much more',
		chapter: '0.4'
	},
	{
		section: 'sec:introduction',
		phrase: 'the gravity outside a body',
		chapter: '0.5'
	},

	// Section II
	{
		section: 'sec:pixel',
		phrase: 'falling freely',
		chapter: '1.4',
		anchor: 'falling-together-cancels-the-pull-but-not-its-difference'
	},
	{
		section: 'sec:pixel',
		phrase: 'difference in gravity between nearby points',
		chapter: '1.4',
		anchor: 'the-difference-in-gravity-is-a-table-of-second-derivatives'
	},
	{ section: 'sec:pixel', phrase: 'five of them are independent', chapter: '1.5' },
	{ section: 'sec:pixel', phrase: 'a second kind of tide', chapter: '7.5' },
	{
		section: 'sec:pixel',
		phrase: 'divided by the length of an arm',
		chapter: '7.6'
	},

	// Section III
	{
		section: 'sec:regimes',
		phrase: 'wavelength equal to the speed of light',
		chapter: '5.1'
	},
	{ section: 'sec:regimes', phrase: 'Where one region ends', chapter: '5.2' },
	{
		section: 'sec:regimes',
		phrase: 'Hot matter sends out waves',
		chapter: '10.3'
	},
	{
		section: 'sec:regimes',
		phrase: 'gravity has spin two',
		chapter: '9.1'
	},

	// Section IV
	{
		section: 'sec:near-field',
		phrase: 'How bright an object looks',
		chapter: '1.4',
		anchor: 'tidal-brightness-is-density-times-the-cube-of-angular-size'
	},
	{
		section: 'sec:near-field',
		phrase: 'without changing its pull anywhere outside',
		chapter: '2.5'
	},
	{
		section: 'sec:near-field',
		phrase: 'Every warm body trembles',
		chapter: '4.6',
		anchor: 'each-degree-of-the-tremor-holds-one-moment-of-the-density'
	},
	{
		section: 'sec:near-field',
		phrase: 'fine detail fades',
		chapter: '2.7'
	},
	{
		section: 'sec:near-field',
		phrase: 'how many digits',
		chapter: '3.7'
	},

	// Section V
	{ section: 'sec:waves', phrase: 'the lopsidedness of its mass', chapter: '7.7' },
	{ section: 'sec:waves', phrase: 'The waves are extremely weak', chapter: '7.8' },
	{
		section: 'sec:waves',
		phrase: 'a single point, with no shape',
		chapter: '5.3'
	},
	{ section: 'sec:waves', phrase: 'circular polarization', chapter: '5.4' },

	// Section VI
	{
		section: 'sec:thermal',
		phrase: 'the random jiggling of atoms',
		chapter: '4.2'
	},
	{
		section: 'sec:thermal',
		phrase: 'how much energy is lost',
		chapter: '7.8',
		anchor: 'viscosity-fades-a-wave-at-hawkings-rate'
	},
	{
		section: 'sec:thermal',
		phrase: 'the better it absorbs',
		chapter: '10.2'
	},
	{
		section: 'sec:thermal',
		phrase: 'friction at the frequencies of heat',
		chapter: '4.4'
	},
	{
		section: 'sec:thermal',
		phrase: 'causality',
		chapter: '4.5'
	},

	// Section VII
	{
		section: 'sec:no-lens',
		phrase: 'light travels more slowly in glass',
		chapter: '5.5',
		anchor:
			'matter-makes-no-useful-lens-or-mirror-and-gravity-focuses-well-only-when-it-is-very-compact'
	},
	{
		section: 'sec:no-lens',
		phrase: 'A mass bends passing gravitational waves',
		chapter: '11.1',
		anchor: 'far-from-a-mass-light-bends-by-twice-newtons-angle'
	},
	{
		section: 'sec:no-lens',
		phrase: 'adds the records together',
		chapter: '5.3',
		anchor: 'delaying-and-adding-the-records-of-many-pixels-points-the-array'
	},
	{
		section: 'sec:no-lens',
		phrase: 'single counted gravitons',
		chapter: '8.5',
		anchor: 'counting-adds-no-noise-but-needs-quanta'
	},

	// Section VIII
	{
		section: 'sec:one-pixel',
		phrase: 'moves past an electric charge',
		chapter: '6.6',
		anchor: 'a-moving-sensor-reads-the-field-turned-by-an-imaginary-angle'
	},
	{ section: 'sec:one-pixel', phrase: 'two independent patterns', chapter: '7.6' },
	{
		section: 'sec:one-pixel',
		phrase: 'the same for every observer',
		chapter: '9.3'
	},
	{
		section: 'sec:one-pixel',
		phrase: 'four directions on the sky',
		chapter: '9.4'
	},
	{ section: 'sec:one-pixel', phrase: 'One pixel can still separate them', chapter: '9.5' },

	// Section IX
	{
		section: 'sec:first-image',
		phrase: 'adds up the glow of everything',
		chapter: '5.5',
		anchor: 'when-nothing-absorbs-a-pixel-adds-the-glow-along-its-line'
	},
	{
		section: 'sec:first-image',
		phrase: 'Random arrivals fluctuate',
		chapter: '3.1',
		anchor: 'rare-events-are-counted-with-the-poisson-distribution'
	},
	{ section: 'sec:first-image', phrase: 'peeling them off', chapter: '5.6' },
	{
		section: 'sec:first-image',
		phrase: 'the energies of the gravitons',
		chapter: '10.1'
	},
	{
		section: 'sec:first-image',
		phrase: 'unavoidable quantum noise',
		chapter: '8.6',
		anchor: 'recording-both-quadratures-of-a-wave-adds-half-a-quantum-of-noise'
	},

	// Section X
	{
		section: 'sec:affordances',
		phrase: 'two forms of the same thing',
		chapter: '6.4',
		anchor: 'a-bodys-mass-is-its-total-energy-so-heat-has-weight'
	},
	{
		section: 'sec:affordances',
		phrase: 'mass flowing inside a sealed body',
		chapter: '2.8'
	},
	{
		section: 'sec:affordances',
		phrase: 'from its thermal trembling',
		chapter: '4.6',
		anchor: 'each-degree-of-the-tremor-holds-one-moment-of-the-density'
	},
	{
		section: 'sec:affordances',
		phrase: 'pressure produces gravity',
		chapter: '6.5'
	},
	{
		section: 'sec:affordances',
		phrase: 'a hollow shell and a solid ball',
		chapter: '1.3'
	},

	// Section XI
	{
		section: 'sec:vistas',
		phrase: 'gradual, not a sharp edge',
		chapter: '7.7'
	},
	{
		section: 'sec:vistas',
		phrase: 'This lasting change',
		chapter: '7.8',
		anchor: 'a-burst-that-carries-energy-away-leaves-the-strain-changed-for-good'
	},
	{
		section: 'sec:vistas',
		phrase: 'become lighter by that amount',
		chapter: '12.1',
		anchor: 'a-core-collapse-frees-a-sixth-of-a-solar-mass-and-neutrinos-carry-it'
	},
	{
		section: 'sec:vistas',
		phrase: 'hot enough to make gravitons',
		chapter: '12.2',
		anchor: 'gravitons-parted-first-and-kept-a-colder-share-of-the-heat'
	},
	{ section: 'sec:vistas', phrase: 'not perfectly black', chapter: '11.3' },

	// Section XII
	{
		section: 'sec:hair',
		phrase: 'overall properties of its mass',
		chapter: '2.3',
		anchor: 'outside-a-body-the-potential-is-a-list-of-moments'
	},
	{ section: 'sec:hair', phrase: 'small random changes in its reading', chapter: '3.2' },
	{
		section: 'sec:hair',
		phrase: 'one yes-or-no question',
		chapter: '3.8'
	},
	{
		section: 'sec:hair',
		phrase: 'only seven numbers',
		chapter: '11.2',
		anchor: 'a-hole-at-rest-shows-seven-numbers-and-nothing-of-what-fell-in'
	},

	// Section XIII
	{
		section: 'sec:second-order',
		phrase: 'in proportion to the small mass',
		chapter: '13.1'
	},
	{
		section: 'sec:second-order',
		phrase: 'Alberto Calderón',
		chapter: '13.2'
	},
	{
		section: 'sec:second-order',
		phrase: 'fly past the body, fast',
		chapter: '1.8'
	},
	{
		section: 'sec:second-order',
		phrase: 'one more step of detail',
		chapter: '13.3'
	},
	{ section: 'sec:second-order', phrase: 'how mass flows inside a body', chapter: '13.4' },

	// Section XIV
	{
		section: 'sec:hole',
		phrase: 'Love numbers of exactly zero',
		chapter: '11.4',
		anchor: 'a-steady-tide-raises-no-bulge-on-a-hole'
	},
	{
		section: 'sec:hole',
		phrase: 'friction and random trembling are linked',
		chapter: '4.6',
		anchor: 'a-grain-in-water-is-kicked-at-random-and-slowed-by-friction-and-the-two-are-linked'
	},
	{
		section: 'sec:hole',
		phrase: 'the temperature that Stephen Hawking found',
		chapter: '11.3'
	},
	{
		section: 'sec:hole',
		phrase: 'read the hole’s temperature',
		chapter: '13.7'
	},
	{
		section: 'sec:hole',
		phrase: 'how much the body absorbs',
		chapter: '4.5'
	},

	// Section XV
	{
		section: 'sec:holography',
		phrase: 'learnt at the region’s boundary',
		chapter: '13.8',
		anchor: 'looking-at-a-body-gives-a-hologram-that-loses-the-null-space'
	},
	{ section: 'sec:holography', phrase: 'only by acting on the body', chapter: '13.2' },
	{ section: 'sec:holography', phrase: 'two different states at once', chapter: '8.1' },
	{
		section: 'sec:holography',
		phrase: 'cannot end this superposition',
		chapter: '13.8',
		anchor: 'gravity-cannot-decohere-a-ball-and-a-shell'
	},
	{
		section: 'sec:holography',
		phrase: 'its mass and spin alone',
		chapter: '11.4'
	}
];
