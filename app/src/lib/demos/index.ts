/** The demo catalogue: one demo per thing the camera can do that light cannot. */
export interface DemoEntry {
	slug?: 'sun-at-midnight';
	title: string;
	affordance: string;
	summary: string;
}

export const demos: DemoEntry[] = [
	{
		slug: 'sun-at-midnight',
		title: 'The Sun at midnight',
		affordance: 'See through anything',
		summary:
			'Look down at night through the whole Earth: its layered interior glows, and the Sun’s core shines up through the planet.'
	},
	{
		title: 'The locked safe',
		affordance: 'Nothing can hide',
		summary:
			'Mass has only one sign, so there is no shield, cloak or camouflage. What is inside a lead safe is as plain as what is outside.'
	},
	{
		title: 'Full or empty',
		affordance: 'Weigh by looking',
		summary:
			'Light reports surfaces; gravity reports mass. Two tanks that look identical differ at a glance.'
	},
	{
		title: 'The blank mirror',
		affordance: 'Images vanish',
		summary:
			'A mirror, a television and a printed page carry no mass in their pictures. To this camera they are blank.'
	},
	{
		title: 'The closed furnace',
		affordance: 'Inside temperature',
		summary:
			'A thermal camera sees the skin of a hot object. This one sees the heat inside, through the walls.'
	},
	{
		title: 'Honey and water',
		affordance: 'Internal friction',
		summary:
			'Thermal gravitational glow is set by how much a material resists flowing. Two sealed bottles tell themselves apart.'
	},
	{
		title: 'The sealed flywheel',
		affordance: 'Spin and flow',
		summary: 'A smooth rotor looks the same spinning or still. Its gravitational field does not.'
	},
	{
		title: 'A beam in the dark',
		affordance: 'Things that emit no light',
		summary:
			'A laser beam crossing a vacuum cannot be seen from the side. Its energy still gravitates.'
	}
];
