/**
 * Side notes for Section XIV, A black hole under a tide (sec:hole). Drafted from reading chapter R13b and the
 * chapters it cites. The rules, the voice and the format are in design/book/SIDE-NOTES-GUIDE.md.
 */
import type { SideNote } from './types';

export const section = 'sec:hole';

export const notes: SideNote[] = [
	{
		anchor: 'par:the-response-of-a-black-hole-to-a-tide',
		text:
			'A Love number measures how far a body bulges under a steady tide, and a black hole that does not turn has ' +
			'none. A changing tide is absorbed through the horizon, the surface from which nothing returns, as if by ' +
			'friction: each second the hole takes in $\\nu$ times the squared rate of change of the tide.',
		chapter: '11.4',
		section: 'a-changing-tide-loses-energy-through-the-horizon'
	},
	{
		anchor: 'par:the-fluctuations-of-a-black-holes-quadrupole',
		text:
			'A warm body’s trembling, divided by its friction, gives its temperature; for a black hole the quotient is ' +
			'Hawking’s, fixed by its mass. A hole at 0.905 K has $1.36\\times10^{23}$ kg, nearly two Moons. One metre away ' +
			'its tremor in one second is a tide of $4\\times10^{-32}\\,\\mathrm{s^{-2}}$, against its steady $2\\times10^{13}\\,\\mathrm{s^{-2}}$.',
		chapter: '11.4',
		section: 'the-friction-trembles-at-the-holes-temperature'
	},
	{
		anchor: 'par:the-weight-of-a-black-holes-response',
		text:
			'Added over every rate of change, a round body’s absorption is a third of its mass times the mean square of its ' +
			'distance from the centre. For the hole it is $0.345\\,Mr_s^2$, so a thin shell with the same sum has radius ' +
			'$\\sqrt{3\\times0.345}\\,r_s = 1.02\\,r_s$, while a uniform ball of radius $r_s$ would give only $0.200\\,Mr_s^2$.',
		chapter: '13.7',
		section: 'a-holes-response-has-the-weight-of-a-shell-a-little-outside-its-horizon',
		figure: {
			name: 'tut-hole-shells',
			alt: 'Shells of the hole’s mass at the radii that match its response to tides of rising degree, climbing from just outside the horizon.'
		}
	}
];
