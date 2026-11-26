/**
 * Side notes for Section II, What a pixel measures (sec:pixel). Drafted from reading chapters R1 and R7 and the
 * chapters they cite. The rules, the voice and the format are in design/book/SIDE-NOTES-GUIDE.md.
 */
import type { SideNote } from './types';

export const section = 'sec:pixel';

export const notes: SideNote[] = [
	{
		anchor: 'p:a-freely-falling-observer',
		text:
			'In Einstein’s theory gravity bends space and time, and equation (2) says how free balls side by ' +
			'side drift apart or together. A metre from a person of 70 kg the bend is slight: its radius is ' +
			'$3.1\\times10^{12}$ m, 21 times the distance to the Sun.',
		chapter: '7.2',
		section: 'for-an-observer-at-rest-the-drift-is-the-papers-tide',
		figure: {
			name: 'tut-curvature-tube',
			alt: 'Free paths of twelve balls beside a mass, bending so that a circle of balls becomes an ellipse.'
		}
	},
	{
		anchor: 'p:two-limits-of-eq',
		text:
			'A strain is a change of length divided by the length. In a wave lined up with LIGO’s two arms, one ' +
			'arm grows by half the strain while the other shrinks by half, so their difference, divided by the ' +
			'length of an arm, is the strain $h$ itself.',
		chapter: '7.6',
		section: 'a-wave-of-strain-h-moves-each-ball-by-half-the-strain'
	},
	{
		anchor: 'p:such-a-detector-therefore',
		text:
			'The tide falls as the cube of the distance, so a sway of 5 cm at 1 m changes it by three times 5 ' +
			'per cent, to give $1.40\\times10^{-9}\\,\\mathrm{s^{-2}}$. LIGO’s nearest mirror, pulled by the ' +
			'person alone, swings by $1.2\\times10^{-11}$ m: a strain of $3.0\\times10^{-15}$ over its 4 km arm.',
		chapter: '1.4',
		section: 'a-swaying-person-makes-the-signal-that-ligo-must-keep-out',
		figure: {
			name: 'tut-tides',
			alt: 'A person one metre from a ring of free balls, which the person’s tide stretches into an ellipse.'
		}
	},
	{
		anchor: 'p:an-ideal-pixel-records',
		text:
			'A frame that turns at $\\Omega$ radians per second feels a pseudo-tide: an apparent stretch across its ' +
			'axis, of size $\\Omega^2$, that comes from the turning and not from any mass. The Earth turns once in ' +
			'86,164 s, which gives $5.3\\times10^{-9}\\,\\mathrm{s^{-2}}$, more than half the person’s tide.',
		chapter: '1.6',
		section: 'a-turning-pixel-feels-a-pseudo-tide',
		figure: {
			name: 'tut-motion-frame',
			alt: 'Four free balls on a turning table, seen from outside and from the table, drifting apart across the axis.'
		}
	},
	{
		anchor: 'par:what-the-premise-asks',
		text:
			'One eötvös, 1 E, is a tide of $10^{-9}\\,\\mathrm{s^{-2}}$, so the person’s tide is 9.34 E. A ' +
			'gradiometer whose noise is 0.02 E after one second sees the person with a signal-to-noise ratio of ' +
			'9.34 / 0.02 = 467. Its noise falls as the square root of the reading time, so 25 seconds would give 2300.',
		chapter: '3.2',
		section: 'the-variance-of-white-noise-falls-as-one-over-the-observing-time'
	},
	{
		anchor: 'par:the-earths-own-tide',
		text:
			'A planet’s moment of inertia $C$ says how far its mass lies from its axis. Divided by its mass times ' +
			'its radius squared, it is 0.4 for a uniform ball and 0.3307 for the Earth, whose dense core holds ' +
			'mass near the centre.',
		chapter: '1.6',
		section: 'the-moment-of-inertia-tells-a-cored-planet-from-a-uniform-one',
		figure: {
			name: 'tut-motion-earths',
			alt: 'Two Earths cut through the centre: one with a dense core inside a lighter mantle, one uniform.'
		}
	},
	{
		anchor: 'p:the-two-parts-are',
		text:
			'A complex number has the form $a + ib$, with $i^2 = -1$, so one table of complex numbers can hold ' +
			'both parts at once. In a plane wave the magnetic part is the tide’s own pattern, turned by 45° about ' +
			'the direction of travel.',
		chapter: '7.6',
		section: 'the-magnetic-part-of-a-wave-is-its-tide-turned-by-45'
	}
];
