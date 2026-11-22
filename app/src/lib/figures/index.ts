/**
 * The interactive figures: the paper's results on what one pixel measures (its Section VIII) and on what a tide
 * applied from outside reveals (its Section XIII), to explore. They are diagrams, not views through the camera; those
 * of Section VIII also appear live under their figures in the online paper.
 */
export interface FigureEntry {
	slug: string;
	title: string;
	affordance: string;
	summary: string;
	/** The paper's figure it belongs to; empty for a result that is not in the paper. */
	figure: string;
}

export const figures: FigureEntry[] = [
	{
		slug: 'four-stars',
		title: 'Principal null directions',
		affordance: 'One point, four directions',
		figure: 'fig:stars',
		summary:
			'Each reading of a gravitational pixel has four principal null directions; a reading of light has two. They tell one body from two, a wave from a pull, and how fast a body crosses the sky.'
	},
	{
		slug: 'four-voices',
		title: 'One pixel, four waves',
		affordance: 'Many waves at one point',
		figure: 'fig:voices',
		summary:
			'Four waves cross one point, each with any waveform. One pixel of this camera finds where every one comes from; a sensor of light finds two.'
	},
	{
		slug: 'now-and-then',
		title: 'Now and then',
		affordance: 'See the present',
		figure: 'fig:present',
		summary:
			'Light shows a moving body where it was; its tidal field points at where it is. Stop it, and the news spreads at the speed of light. Shown with light slowed down, and labelled so.'
	},
	{
		slug: 'speedometer',
		title: 'A pixel’s own velocity',
		affordance: 'Own velocity, motion test',
		figure: 'fig:speedometer',
		summary:
			'A pixel crossing a room of unknown masses determines its own velocity, every component, at any speed, from one reading. If its eigenvalues turn complex, something in the room moves. Light reads two components.'
	},
	{
		slug: 'ranging',
		title: 'How far is that binary?',
		affordance: 'Range a wave source',
		figure: 'fig:ranging',
		summary:
			'The two senses of a binary’s waves arrive from directions that differ by an angle that shrinks with distance. One pixel reads it, out to a range set by the signal-to-noise ratio.'
	},
	{
		slug: 'one-pixel-sky',
		title: 'One pixel’s sky',
		affordance: 'What a point can know',
		figure: 'fig:sky-count',
		summary:
			'A sky full of sources, seen by one pixel: exactly its patterns of degree four and below. Twelve sources on an icosahedron look like a uniform sky; six on an octahedron do not.'
	},
	{
		slug: 'beyond-einstein',
		title: 'Beyond Einstein',
		affordance: 'Test gravity at a point',
		figure: 'fig:beyond',
		summary:
			'One reading gives a wave’s direction, its speed and all six polarizations a theory of gravity allows, and checks that they belong to one wave. A massive graviton and a scalar differ even in sign.'
	},
	{
		slug: 'push-and-weigh',
		title: 'Push and weigh',
		affordance: 'Same outside, told apart',
		figure: 'fig:ladder',
		summary:
			'Two bodies with the same field outside. A tide of low degree gives both the same energy; a tide one degree higher tells them apart. Each degree of the tide reaches one more radial moment of the mass.'
	},
	{
		slug: 'marked-ring',
		title: 'A ring of marked particles',
		affordance: 'A wave turns the marks',
		figure: '',
		summary:
			'A ring of free particles, each with a mark, in an exact gravitational plane wave. When the wave has passed the marks have turned against a gyroscope, by half the area that the ring’s shape swept in the hyperbolic plane.'
	}
];
