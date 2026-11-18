/** The demo catalogue: one demo per thing the camera can do that light cannot. */
export interface DemoEntry {
	slug?:
		| 'sun-at-midnight'
		| 'locked-safe'
		| 'full-or-empty'
		| 'blank-mirror'
		| 'closed-furnace'
		| 'honey-and-water'
		| 'which-way'
		| 'sealed-flywheel'
		| 'beam-in-the-dark'
		| 'milky-way'
		| 'black-hole'
		| 'two-black-holes'
		| 'where-it-is'
		| 'behind-the-wall';
	title: string;
	affordance: string;
	summary: string;
	/** Which of the camera's three regimes the demo shows, or the sky (the paper's vistas). */
	regime: 'near field' | 'thermal' | 'waves' | 'sky';
}

export const demos: DemoEntry[] = [
	{
		slug: 'sun-at-midnight',
		title: 'The Sun at midnight',
		affordance: 'See through anything',
		regime: 'thermal',
		summary:
			'Look down at night through the whole Earth: its layered interior glows, and the Sun’s core shines up through the planet.'
	},
	{
		slug: 'locked-safe',
		title: 'The locked safe',
		affordance: 'Nothing can hide',
		regime: 'near field',
		summary:
			'Mass has only one sign, so there is no shield and no cloak: a pull can be disguised but never cancelled. What is inside a steel safe is felt as plainly as what is outside.'
	},
	{
		slug: 'full-or-empty',
		title: 'Full or empty',
		affordance: 'Weigh by looking',
		regime: 'near field',
		summary:
			'Light reports surfaces; gravity reports mass. Three tanks that look identical differ at a glance.'
	},
	{
		slug: 'blank-mirror',
		title: 'The blank mirror',
		affordance: 'Images vanish',
		regime: 'near field',
		summary:
			'A mirror, a television and a printed page carry no mass in their pictures. To this camera they are blank.'
	},
	{
		slug: 'closed-furnace',
		title: 'The closed furnace',
		affordance: 'Inside temperature',
		regime: 'thermal',
		summary:
			'A thermal camera sees the skin of a hot object. This one sees the heat inside, through the walls.'
	},
	{
		slug: 'honey-and-water',
		title: 'Honey and water',
		affordance: 'Internal friction',
		regime: 'thermal',
		summary:
			'Thermal gravitational glow is set by how much a material resists shearing at the frequencies of heat. Two sealed bottles, shown with their everyday viscosities.'
	},
	{
		slug: 'which-way',
		title: 'Which way it turns',
		affordance: 'Read spin and its sense',
		regime: 'waves',
		summary:
			'Three sealed drums, one still and two turning. The polarization of their gravitational waves tells which is which, and which way. Shown with light slowed down, and labelled so.'
	},
	{
		slug: 'sealed-flywheel',
		title: 'The sealed flywheel',
		affordance: 'Spin and flow',
		regime: 'near field',
		summary:
			'A smooth flywheel looks the same spinning or still, and pulls the same. The second half of each pixel, which sees moving mass, shows it turn.'
	},
	{
		slug: 'beam-in-the-dark',
		title: 'A beam in the dark',
		affordance: 'Things that emit no light',
		regime: 'near field',
		summary:
			'An infrared laser beam cannot be seen from the side. Its energy still gravitates, and the camera sees a line.'
	},
	{
		slug: 'where-it-is',
		title: 'Where it is now',
		affordance: 'See the present',
		regime: 'near field',
		summary:
			'A ball flies across a room. Light shows it where it was; gravity, where it is. Stop it, and each finds out only when the news arrives. Shown with light slowed down, and labelled so.'
	},
	{
		slug: 'behind-the-wall',
		title: 'Behind the wall',
		affordance: 'See motion through walls',
		regime: 'near field',
		summary:
			'Two people behind a wall; one walks. Light sees the wall. Gravity sees both, colours the walker by the direction of walking, and one pixel alone knows that something moves.'
	},
	{
		slug: 'milky-way',
		title: 'The Milky Way',
		affordance: 'See the Galaxy’s heart',
		regime: 'sky',
		summary:
			'The whole sky from the Sun. In light, dust hides the Galaxy’s centre; in the gravitational waves of its white-dwarf pairs it is the brightest thing there is.'
	},
	{
		slug: 'black-hole',
		title: 'A black hole against the first light',
		affordance: 'The only shadows',
		regime: 'sky',
		summary:
			'If the Big Bang was hot enough, the sky glows in gravitons at 0.9 K. Nothing casts a shadow on that glow except a black hole. Exact rays, light beside it.'
	},
	{
		slug: 'two-black-holes',
		title: 'Two black holes, inside out',
		affordance: 'Near field to waves',
		regime: 'sky',
		summary:
			'The field of an orbiting pair, from the holes out to their waves: Newton’s pull turning with them, winding into a spiral a sixth of a wavelength out.'
	}
];
