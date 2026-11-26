/**
 * Side notes for Section IX, A first image (sec:first-image). Drafted from reading chapter R10b and the chapters it
 * cites. The rules, the voice and the format are in design/book/SIDE-NOTES-GUIDE.md.
 */
import type { SideNote } from './types';

export const section = 'sec:first-image';

export const notes: SideNote[] = [
	{
		anchor: 'p:because-nothing-absorbs-or',
		text:
			'A graviton is the smallest packet of energy of a gravitational wave of one frequency, $\\hbar\\omega$ at ' +
			'angular frequency $\\omega$. Dividing the emitted power by the mean energy of a thermal graviton, ' +
			'$2.70\\,k_BT$, turns it into a count of gravitons, and the pixel adds that count along its line of sight.',
		chapter: '5.5',
		section: 'when-nothing-absorbs-a-pixel-adds-the-glow-along-its-line'
	},
	{
		anchor: 'p:figure-evaluates-eq-for',
		text:
			'Spread over a sphere of one astronomical unit, $1.496\\times10^{11}$ m, the Sun’s $10^8$ W becomes ' +
			'$3.6\\times10^{-16}\\,\\mathrm{W\\,m^{-2}}$. A graviton from its core, at $1.3\\times10^7$ K, carries ' +
			'$2.70\\,k_BT=4.85\\times10^{-16}$ J, so 0.73 gravitons cross each square metre in a second.',
		chapter: '10.1',
		section: 'three-integrals-of-one-kind-give-the-power-the-count-and-the-mean-energy'
	},
	{
		anchor: 'p:the-shells-radii-and',
		text:
			'Friction here is the viscosity $\\eta$ in pascal seconds, and a material’s stiffness limits how large ' +
			'it can be. The shells’ stiffnesses, 44 to 400 GPa, give at most $1.58\\times10^{-4}$ to ' +
			'$3.38\\times10^{-4}$ Pa s, so every brightness found for the Earth is an upper bound.',
		chapter: '10.3',
		section: 'no-material-can-glow-brighter-than-its-weight-allows'
	},
	{
		anchor: 'par:the-graviton-budget',
		text:
			'The rate $1.42\\times10^{-5}\\,\\mathrm{s^{-1}}$ is one graviton every 19.6 hours, or 35,800 in eighty ' +
			'years. A count of $N$ varies by about $\\sqrt N$; for a part to stand 10 per cent above a known level ' +
			'by five such deviations, $0.1N=5\\sqrt N$ and $N=2500$, so $35{,}800/2500=14.3$ parts.',
		chapter: '3.1',
		section: 'rare-events-are-counted-with-the-poisson-distribution'
	},
	{
		anchor: 'par:recovering-the-layers',
		text:
			'A line of sight at angle $\\theta$ from straight down passes the centre at the distance $R\\sin\\theta$, ' +
			'with $R=6371$ km the Earth’s radius. It grazes the core, of radius 3480 km, at $\\theta=33.1^\\circ$; the ' +
			'lower mantle’s base at 5701 km gives 63.5°, and the inner core’s edge at 1221.5 km gives 11.05°.',
		chapter: '5.6',
		section: 'a-boundary-shows-as-a-kink-at-an-angle-that-only-geometry-sets'
	},
	{
		anchor: 'p:the-heights-measure-a',
		text:
			'Counting gravitons gives the friction times the cube of the temperature, $\\eta T^3$, and their total ' +
			'energy gives $\\eta T^4$. Dividing the second by the first gives $T$, and the count then gives $\\eta$. ' +
			'This needs the friction to be the same at every frequency of the band.',
		chapter: '5.5',
		section: 'a-materials-brightness-is-its-friction-times-a-power-of-its-temperature'
	},
	{
		anchor: 'p:figure-shows-what-a',
		text:
			'The fit has nine unknowns, four radii and five emissivities, to find from 90 rings of one degree. The ' +
			'Fisher information, which measures how sharply the counts depend on each unknown, sets each error as the ' +
			'root of a diagonal entry of its inverse: 28.9 km for the core’s edge and 5.2 km for the lower mantle’s.',
		chapter: '3.3',
		section: 'the-fisher-information-measures-how-sharply-the-likelihood-peaks'
	},
	{
		anchor: 'par:what-the-earths-materials-allow',
		text:
			'Two free electrons per iron atom of 55.85 atomic mass units, at 11,000 kg m$^{-3}$, make ' +
			'$2.37\\times10^{29}\\,\\mathrm{m^{-3}}$ electrons. Their Fermi energy, the top energy of the cold gas, ' +
			'is 14.0 eV, so their weight $\\tfrac25nE_F$ is 0.21 TPa.',
		chapter: '10.3'
	},
	{
		anchor: 'par:arrival-and-absorption',
		text:
			'A metre of solid stops at most $1.5\\times10^{-37}$ of what crosses it, so for one graviton a second the ' +
			'first count takes $1/(1.5\\times10^{-37})=6.7\\times10^{36}$ s, which is $2\\times10^{29}$ years: ' +
			'$1.5\\times10^{19}$ times the age of the universe.',
		chapter: '10.3'
	},
	{
		anchor: 'par:counting-or-recording',
		text:
			'A mode is one pattern of the wave, with its own frequency and direction. Each holds $10^{-30}$ gravitons ' +
			'or fewer, while a device that records the wave must add at least half a quantum of noise to each mode: ' +
			'$5\\times10^{29}$ times the signal.',
		chapter: '8.5',
		section: 'counting-adds-no-noise-but-needs-quanta'
	},
	{
		anchor: 'p:a-counting-pixel-still',
		text:
			'Fisher information measures how sharply data fix an angle, and each click carries 2 units per angle. ' +
			'Half an hour at one graviton a second is 1800 clicks, so 3600 units and an error of ' +
			'$1/\\sqrt{3600}=0.0167$ radian, or 0.95°.',
		chapter: '8.6',
		section:
			'a-measurement-is-a-set-of-positive-tables-that-add-to-one-and-a-gravitons-click-carries-about-a-bit'
	}
];
