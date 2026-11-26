/**
 * Side notes for Section XV, What remains of holography (sec:holography). Drafted from reading chapter R13b and
 * chapter 13.8. The rules, the voice and the format are in design/book/SIDE-NOTES-GUIDE.md.
 */
import type { SideNote } from './types';

export const section = 'sec:holography';

export const notes: SideNote[] = [
	{
		anchor: 'par:black-holes-and-the-classical-limit',
		text:
			'A camera three body radii away sees a moment of degree $\\ell$ while $1.10\\,\\ell$ stays below $\\ln\\mathrm{SNR}$, ' +
			'the logarithm of the signal-to-noise ratio. At $10^6$ that logarithm is 13.8, so degrees 0 to 12 and ' +
			'$13^2 = 169$ numbers; at $10^{70}$ it is 161, giving $147^2 = 21{,}609$.',
		chapter: '13.8',
		section: 'looking-at-a-body-gives-a-hologram-that-loses-the-null-space'
	},
	{
		anchor: 'par:what-gravity-cannot-decohere',
		text:
			'A ball and a shell of the same mass $M$ and radius $R$ differ only inside, and the Diósi–Penrose energy of that ' +
			'difference is $GM^2/10R$. For a glass bead 1 µm in radius, $M = 9.2\\times10^{-15}$ kg, the energy is ' +
			'$5.7\\times10^{-34}$ J and $\\hbar/E = 0.19$ s, with $\\hbar = 1.05\\times10^{-34}$ J s.',
		chapter: '13.8',
		section: 'gravity-cannot-decohere-a-ball-and-a-shell',
		figure: {
			name: 'tut-dp-fields',
			alt: 'The field of a ball and of a shell of one mass, equal outside and different inside, with the difference shaded.'
		}
	}
];
