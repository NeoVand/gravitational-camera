/**
 * Side notes for Section V, Waves from moving bodies (sec:waves). Drafted from reading chapter R7b and the chapters
 * it cites. The rules, the voice and the format are in design/book/SIDE-NOTES-GUIDE.md.
 */
import type { SideNote } from './types';

export const section = 'sec:waves';

export const notes: SideNote[] = [
	{
		anchor: 'p:in-the-wave-zone',
		text:
			'A quadrupole moment adds up each mass times the square of its position from the centre, in ' +
			'$\\mathrm{kg\\,m^2}$, and says how stretched a body is. Two 1 kg masses a metre apart, turning 16 times a ' +
			'second, radiate $4.55\\times10^{-41}$ W. A graviton of their wave carries $2.1\\times10^{-32}$ J, so one ' +
			'leaves every 14.8 years.',
		chapter: '7.7',
		section: 'the-power-is-set-by-the-third-derivative-of-the-quadrupole'
	},
	{
		anchor: 'par:a-compact-body-is-a-point',
		text:
			'For the pair turning 16 times a second, the wave has a wavelength of 9370 km, while the masses move at ' +
			'50.3 m/s. The wave is thus $9.4\\times10^6$ times longer than the pair is wide. A wave cannot show detail ' +
			'much finer than its own length, so the pair is a single point to it.',
		chapter: '7.7',
		section: 'a-compact-slow-body-is-a-point-in-its-own-waves'
	},
	{
		anchor: 'par:a-source-larger-than-its-wave',
		text:
			'Rotors that turn 50 times a second send waves at 100 Hz, each 3000 km long. Rotors in step add their ' +
			'amplitudes, so their power grows as the square of their number: a thousand send a million times the ' +
			'power of one. The Fresnel zone, closer than about $D^2/\\lambda$ to an aperture $D$, is where the ' +
			'wavefronts are still curved.',
		chapter: '5.2',
		section: 'many-sources-in-step-add-their-amplitudes'
	},
	{
		anchor: 'par:the-sense-of-turning',
		text:
			'The degree of circular polarization $V/I$ runs from $-1$, a pattern that turns clockwise as the camera ' +
			'sees it, to $+1$, one that turns anticlockwise, with 0 for a pulse along a fixed line. For the rotor it ' +
			'is $+1$ along the spin, 0.976 at 60°, 0 edge-on and $-1$ along the spin pointing away.',
		chapter: '5.4',
		section: 'four-numbers-describe-a-polarization-and-two-of-them-do-not-depend-on-the-axes',
		figure: {
			name: 'tut-pol-rotor-views',
			alt: 'A turning pair of masses seen from three directions, with the pattern of stretch going round a circle, an ellipse and a line.'
		}
	},
	{
		anchor: 'par:what-does-not-radiate',
		text:
			'A pressure that is the same in all directions is a table of numbers with one value down its diagonal ' +
			'and zeros elsewhere, which is pure trace. The projection that keeps only what a wave can carry removes ' +
			'it exactly, so a sealed box of gas whose pressure rises and falls evenly sends out nothing.',
		chapter: '7.6',
		section: 'a-body-in-steady-motion-sends-no-wave-and-neither-does-an-even-pressure'
	},
	{
		anchor: 'p:because-everyday-speeds-are',
		text:
			'A pair turning once a second sends waves at 2 Hz, so with light at 0.20 m/s the wavelength is ' +
			'0.20 / 2 = 0.10 m. The balls, 0.44 m apart, move at 1.38 m/s, 6.9 times that slowed light, which is ' +
			'faster than the slow-source formula allows. The polarization depends only on the angle of view.',
		chapter: 'R7b',
		section: 'slowing-light-to-twenty-centimetres-a-second-makes-each-rotor-a-spot'
	}
];
