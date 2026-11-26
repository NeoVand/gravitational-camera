/**
 * Side notes for Section VI, The thermal glow (sec:thermal). Drafted from reading chapter R10 and the chapters it
 * cites. The rules, the voice and the format are in design/book/SIDE-NOTES-GUIDE.md.
 */
import type { SideNote } from './types';

export const section = 'sec:thermal';

export const notes: SideNote[] = [
	{
		anchor: 'par:absorption',
		text:
			'For water’s everyday viscosity of $10^{-3}$ Pa s, the wave’s energy decays at ' +
			'$16\\pi G\\eta/c^2 = 3.7\\times10^{-29}\\,\\mathrm{s^{-1}}$. Dividing by $c$ gives an absorption ' +
			'coefficient of $1.25\\times10^{-37}\\,\\mathrm{m^{-1}}$, so the energy falls by a factor $e$ only after ' +
			'$8.0\\times10^{36}$ m, or $8.5\\times10^{20}$ light-years.',
		chapter: '7.8',
		section: 'viscosity-fades-a-wave-at-hawkings-rate'
	},
	{
		anchor: 'par:emission',
		text:
			'Matter takes quanta from a mode of radiation in proportion to the number $n$ already in it, and gives ' +
			'them back in proportion to $n + 1$. The absorption coefficient is the net of taking and returning, and ' +
			'the extra 1 is the spontaneous emission: the glow that a warm body sends out even into empty space.',
		chapter: '10.2',
		section:
			'matter-absorbs-in-proportion-to-the-quanta-present-and-emits-in-proportion-to-one-more'
	},
	{
		anchor: 'p:matter-is-transparent-with',
		text:
			'The optical depth is the absorption coefficient added up along the path, a pure number: a metre of ' +
			'water has $1.2\\times10^{-37}$. The person’s $9\\times10^{-37}$ W, at a mean graviton energy of ' +
			'$1.64\\,k_BT = 7.0\\times10^{-21}$ J, is $1.3\\times10^{-16}$ gravitons a second: one every ' +
			'$2.4\\times10^8$ years.',
		chapter: '5.5',
		section: 'along-a-ray-matter-adds-its-glow-and-takes-a-share-of-what-passes'
	},
	{
		anchor: 'p:figure-shows-the-transparency',
		text:
			'Heat has mass: a megajoule weighs $10^6/c^2 = 1.11\\times10^{-11}$ kg, too little to show. A friction ' +
			'that did not change would make the count of gravitons grow as $T^3$, giving $(1500/293)^3 = 134$. In a ' +
			'metal the friction falls as $1/T$, so the count grows as $T^2$, giving $26.2$.',
		chapter: '10.3',
		section: 'each-material-of-the-table-is-a-weight-at-a-place'
	},
	{
		anchor: 'par:friction-at-the-frequencies-of-heat',
		text:
			'Maxwell’s model divides the everyday viscosity $\\eta_0$ by $1 + \\omega^2\\tau^2$, where $\\tau$ is ' +
			'the time the stress takes to relax. Honey’s $\\tau$ is 10 ns, so stirred once a second, ' +
			'$\\omega\\tau = 6\\times10^{-8}$ and the friction is $\\eta_0$; at the glow’s peak, 17 THz, it ' +
			'has fallen to $8.5\\times10^{-12}$ Pa s.',
		chapter: '4.4',
		section: 'maxwells-model-is-a-liquid-when-slow-and-a-solid-when-fast'
	},
	{
		anchor: 'p:free-electrons-in-a',
		text:
			'The resistivity of a metal is $m/(ne^2\\tau)$, with $n$ the free electrons per cubic metre and $\\tau$ ' +
			'the mean time between their collisions. Copper’s $1.68\\times10^{-8}\\,\\Omega\\,\\mathrm{m}$ and ' +
			'$8.47\\times10^{28}$ electrons give $\\tau = 2.5\\times10^{-14}$ s, so $\\omega\\tau$ is 1.5 to 2.7 ' +
			'where the glow peaks, near the 1 at which the friction is greatest.',
		chapter: '4.4',
		section: 'a-metals-electrons-relax-like-a-maxwell-liquid-and-their-friction-has-a-ceiling'
	},
	{
		anchor: 'p:driven-vibrations-in-a',
		text:
			'A Raman line is a narrow frequency at which atoms vibrate against each other. Silicon’s, at 520 per ' +
			'centimetre, is 15.6 THz, and its width of 3 per centimetre is $5.65\\times10^{11}\\,\\mathrm{s^{-1}}$. ' +
			'The 18 GPa of stiffness that relaxes, divided by that width, gives a peak friction of 0.032 Pa s, ' +
			'thirty times the placeholder.',
		chapter: '10.3',
		section: 'a-crystal-with-two-atoms-in-its-cell-rings-at-its-raman-line-when-sheared'
	},
	{
		anchor: 'p:pairs-of-phonons-even',
		text:
			'A phonon is one quantum of the vibration of a crystal. The stress that a wave drives can make or unmake ' +
			'two at once, with a classical weight $2nk_BT$, where $n$ is the atoms per cubic metre. At 293 K this is ' +
			'0.40 GPa for silicon and 1.43 GPa for diamond: about a gigapascal.',
		chapter: '10.3',
		section: 'even-a-perfect-crystal-glows-through-pairs-of-phonons'
	},
	{
		anchor: 'p:at-room-temperature-these',
		text:
			'The effective friction of the table is the constant friction that would send the same power. Against the ' +
			'placeholder’s 10, in units of $10^{-4}$ Pa s, diamond’s 0.12 is 1.2 per cent and iron’s ceiling ' +
			'of 6 is 60 per cent. Each unit of friction sends 2.08 units of power per volume.',
		chapter: '10.3',
		section: 'each-material-of-the-table-is-a-weight-at-a-place'
	},
	{
		anchor: 'par:a-bound-on-the-glow',
		text:
			'The weight $\\Delta\\mu$ is the stiffness that relaxes, and it glows most when all of it lies where the ' +
			'Planck spectrum peaks. The constants are eight times the highest values of two Planck-shaped curves, ' +
			'1.4214 and 0.6476, giving 11.37 and 5.18. For 30 GPa at 293 K the power is at most ' +
			'$5.6\\times10^{-35}$ W per cubic metre.',
		chapter: '10.3',
		section: 'no-material-can-glow-brighter-than-its-weight-allows'
	},
	{
		anchor: 'par:volume-and-surface-emission',
		text:
			'A thermal phonon, one quantum of sound, travels only $\\ell_s = Q\\hbar c_T/k_BT$ before it is damped, ' +
			'which is 0.83 nm for steel with $Q = 10$. A ball of radius 10 cm is a hundred million times that, so ' +
			'its volume glows $1.1\\times10^8$ times more than its surface, which sends only $6.3\\times10^{-46}$ W.',
		chapter: '10.3',
		section: 'ordinary-bodies-glow-through-their-volume-not-their-surface'
	}
];
