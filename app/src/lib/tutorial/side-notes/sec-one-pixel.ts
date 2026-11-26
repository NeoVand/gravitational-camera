/**
 * Side notes for Section VIII, One pixel, sparse arrays and depth (sec:one-pixel). Drafted from reading chapters R9
 * and R9b and the chapters they cite. The rules, the voice and the format are in design/book/SIDE-NOTES-GUIDE.md.
 */
import type { SideNote } from './types';

export const section = 'sec:one-pixel';

export const notes: SideNote[] = [
	{
		anchor: 'p:a-wave-of-light',
		text:
			'A plus wave along $\\hat z$ stretches along $x$ and squeezes along $y$, a tide $\\mathcal E_+\\,\\mathrm{diag}(1,-1,0)$. ' +
			'Two masses, one on the $y$ axis with tidal weight $\\tfrac23\\mathcal E_+$ and one on the $z$ axis with ' +
			'$\\tfrac13\\mathcal E_+$, add up to exactly that tide. Only the magnetic part tells them apart.',
		chapter: '1.4',
		section: 'beside-one-mass-the-ring-stretches-along-the-line-and-squeezes-across-it'
	},
	{
		anchor: 'p:first-observers-transform-by',
		text:
			'Rapidity is the number $\\eta$ for which a speed is $c\\tanh\\eta$; unlike speeds, rapidities add. At ' +
			'$0.6c$ along $x$, $\\eta=\\ln 2$, and the boost acts on the $y$ and $z$ axes through a block with rows ' +
			'$(1.25,\\,0.75i)$ and $(-0.75i,\\,1.25)$.',
		chapter: '9.3',
		section: 'a-moving-pixel-reads-the-table-turned-by-an-imaginary-angle'
	},
	{
		anchor: 'p:second-the-of-a',
		text:
			'The super-Poynting vector is a vector built from the tide and its magnetic part that, for a wave, points ' +
			'along its travel. For a plus wave along $\\hat z$ of amplitude 1 s$^{-2}$ it is $(0,0,2)\\,\\mathrm{s^{-4}}$ ' +
			'against a squared tide of 2 s$^{-4}$, so $\\hat n=-\\hat z$, towards the source.',
		chapter: '9.1',
		section: 'the-square-holds-four-numbers-a-direction-and-one-complex-amplitude'
	},
	{
		anchor: 'par:principal-null-directions',
		text:
			'The four directions are the four roots of one quartic, an equation of degree four, and the pattern in which ' +
			'they coincide is the field’s Petrov type. For two masses of 1 and 0.45 in the figure’s units, the number ' +
			'$1-6J^2/I^3$, built from the two invariants, is 0.553, so the four roots are separate.',
		chapter: '9.4',
		section: 'the-pattern-of-the-four-directions-is-the-fields-petrov-type',
		figure: {
			name: 'tut-petrov-skies',
			alt: 'Six spheres of directions, showing the four dots separate for two masses, in pairs for one mass and together for one wave.'
		}
	},
	{
		anchor: 'p:a-state-of-spin',
		text:
			'The state of a spin one half points like an arrow, which has length one when the state is pure. The arrow ' +
			'here is the super-Poynting vector divided by the super-energy $u$. In a plane wave the two have the same ' +
			'size, so the arrow has length one and the state is pure.',
		chapter: '8.4',
		section: 'one-of-the-four-spins-of-a-reading-points-along-its-super-poynting-vector'
	},
	{
		anchor: 'par:shape',
		text:
			'A table’s determinant is the product of its three eigenvalues, its stretches along its own axes. A wave ' +
			'has none along its travel, so the product is zero. A mass has eigenvalues in the ratio $-2:1:1$ times ' +
			'$GM/r^3$, so for the person a metre away it is $-2.04\\times10^{-25}\\,\\mathrm{s^{-6}}$.',
		chapter: '1.4',
		section: 'beside-one-mass-the-ring-stretches-along-the-line-and-squeezes-across-it'
	},
	{
		anchor: 'par:the-magnetic-part',
		text:
			'The magnetic part is the twist of the field. Near a mass crossing the line of sight at speed $v_\\perp$, ' +
			'its size over that of the tide is $\\sqrt3\\,v_\\perp/c$: for a person walking past at 1.4 m s$^{-1}$ ' +
			'that is $8.09\\times10^{-9}$.',
		chapter: '7.5',
		section: 'a-moving-mass-makes-a-magnetic-part-only-by-moving-across-the-line-of-sight'
	},
	{
		anchor: 'p:for-a-scene-of',
		text:
			'Each component of velocity is read to $c\\sigma/(\\sqrt2\\,\\Delta)$, with $\\sigma$ the noise on each ' +
			'number and $\\Delta$ the gap between two eigenvalues of the tide. For $\\sigma=10^{-16}\\,\\mathrm{s^{-2}}$ ' +
			'and $\\Delta=10^{-8}\\,\\mathrm{s^{-2}}$ that is $3.00\\times10^{8}\\times10^{-16}/(1.41\\times10^{-8})=2.1$ m s$^{-1}$.',
		chapter: '9.3',
		section: 'in-a-room-at-rest-a-pixel-reads-its-own-velocity'
	},
	{
		anchor: 'p:the-converse-is-a',
		text:
			'A spinning body’s angular momentum divided by its mass times $c$ is a length $a$; for the Earth it is ' +
			'3.27 m. At the pole, 6357 km from the centre, the phase $3a/r$ is $1.54\\times10^{-6}$. On the equator ' +
			'the ground moves at 465 m s$^{-1}$, and $(1-0.3307)\\times465=311$ m s$^{-1}$ is read.',
		chapter: '9.3',
		section: 'complex-eigenvalues-mean-that-something-in-the-room-moves-or-turns'
	},
	{
		anchor: 'p:light-cannot-do-this',
		text:
			'Where an electric and a magnetic field are parallel, a boost along their common axis changes neither, so ' +
			'a sensor of light cannot feel its speed along that axis. Gravity’s field has no such blind spot except ' +
			'beside one body seen head on, whose magnetic part is below $10^{-16}$ of its tide.',
		chapter: '9.3',
		section: 'light-reads-only-two-components-of-its-own-velocity-gravity-reads-three'
	},
	{
		anchor: 'par:the-state-of-a-moving-body',
		text:
			'The seven numbers are two angles for the line to the body, its distance, two components of its sideways ' +
			'velocity, its rate of approach and its mass. For a test body at distance $\\sqrt{7.25}=2.692582$, three ' +
			'readings $10^{-4}$ apart return all seven to seven figures.',
		chapter: '9.4',
		section: 'one-pixel-reads-the-whole-state-of-a-moving-body'
	},
	{
		anchor: 'p:at-one-instant-two',
		text:
			'The rank of a table is the number of independent rows it has. The square of one vector has rank one and a ' +
			'sum of two such squares has rank two, which makes its determinant zero. A mass never does, since its ' +
			'determinant is $-2(GM/r^3)^3$, so a zero determinant rules out one mass.',
		chapter: '9.5',
		section: 'two-waves-give-a-reading-of-rank-two-and-the-vector-it-sends-to-zero-leads-to-both'
	},
	{
		anchor: 'p:at-one-frequency-three',
		text:
			'A binary’s inclination $\\iota$ is the angle between its axis and the line of sight. The ratio $\\lambda$ ' +
			'of its two frequency parts has size $\\tan^{\\pm4}(\\iota/2)$: 194 or its inverse at 30°, and 9 or its ' +
			'inverse at 60°. Two binaries turning the same way would share a ratio.',
		chapter: '9.5',
		section: 'three-waves-of-one-frequency-are-three-roots-of-one-pencil'
	},
	{
		anchor: 'p:all-three-cases-are',
		text:
			'Spin $s$ is how a field turns: light has $s=1$ and gravity $s=2$. At one frequency the formula ' +
			'$\\lfloor 2(2s+1)/3\\rfloor$, the whole number below $2(2s+1)/3$, gives 2 for light and 3 for gravity. ' +
			'For $s=4$ it gives $\\lfloor 18/3\\rfloor=6$.',
		chapter: '9.5'
	},
	{
		anchor: 'par:lensed-images-at-one-point',
		text:
			'An arcsecond is $4.85\\times10^{-6}$ radian, and a wave is placed to $1/\\rho$ radian at signal-to-noise ' +
			'ratio $\\rho$, so $\\rho=2.06\\times10^5$. An aperture would need the wavelength at 100 Hz, ' +
			'$3.0\\times10^6$ m, divided by that angle: 4.1 astronomical units, the Earth–Sun distance each.',
		chapter: '9.5',
		section: 'lensed-images-fall-in-separate-cells-of-time-and-frequency'
	},
	{
		anchor: 'par:what-one-pixel-sees-of-the-sky',
		text:
			'The count is $25+25+18=68$: the brightness and the circular polarization at orders 0 to 4, where order 0 ' +
			'is the average over the sky and order 1 a lopsidedness, and the linear polarization at order 4. Light, ' +
			'with spin 1, reads 28 of its 36 numbers in the same way.',
		chapter: '9.6',
		section: 'the-pixels-spectral-matrix-splits-into-three-blocks-by-helicity'
	},
	{
		anchor: 'par:ranging-a-wave-source',
		text:
			'A reduced wavelength is the wavelength divided by $2\\pi$, $c/\\omega$: 477 km at 100 Hz. At signal-to-noise ' +
			'ratio 1000 and inclination 60°, the tilt between the two circular polarizations equals its own error at ' +
			'$kr=507$ reduced wavelengths, which is $2.4\\times10^5$ km.',
		chapter: '9.7',
		section: 'a-nearby-source-spoils-the-square-only-at-second-order'
	},
	{
		anchor: 'par:the-absence-of-gravitational-aberration',
		text:
			'Aberration shifts a body’s seen position by about its sideways speed over $c$. The Earth moves at ' +
			'29.8 km s$^{-1}$, giving $9.94\\times10^{-5}$ radian, which is 20.5 arcseconds: how far the Sun’s ' +
			'light shows it behind the direction its gravity points to.',
		chapter: '6.3',
		section: 'the-steady-field-of-a-moving-body-depends-on-where-the-body-is-now'
	},
	{
		anchor: 'par:tests-of-general-relativity-from-one-reading',
		text:
			'With a trace, the tide has six independent numbers, and the magnetic part, no longer symmetric, has ' +
			'eight: 14 in all. A wave has nine unknowns, two for its direction, one for its speed and six for its ' +
			'polarizations, so $14-9=5$ numbers are left as checks that the reading is one wave.',
		chapter: '9.7',
		section: 'the-second-bianchi-identity-ties-a-metric-waves-magnetic-part-to-its-tide'
	},
	{
		anchor: 'par:matter-at-the-pixel',
		text:
			'The trace of the tide, the sum of its three eigenvalues, is $4\\pi G$ times the density plus a pressure ' +
			'term. The dark matter near the Sun, 0.4 GeV per cm$^3$, is $7.13\\times10^{-22}$ kg m$^{-3}$, which ' +
			'gives $4\\pi G\\rho=5.98\\times10^{-31}\\,\\mathrm{s^{-2}}$.',
		chapter: '7.3',
		section: 'pressure-and-stress-gravitate'
	},
	{
		anchor: 'par:what-no-reading-can-tell',
		text:
			'A mass of tidal weight $a$ on the $y$ axis makes $a\\,\\mathrm{diag}(1,-2,1)$, and one of weight $2a$ on ' +
			'the $z$ axis makes $2a\\,\\mathrm{diag}(1,1,-2)$; together, $a\\,\\mathrm{diag}(3,0,-3)$. Two waves ' +
			'meeting head on, each $\\tfrac32a\\,\\mathrm{diag}(1,0,-1)$ at its crest, add to the same, and their ' +
			'magnetic parts cancel.',
		chapter: '1.4',
		section: 'beside-one-mass-the-ring-stretches-along-the-line-and-squeezes-across-it'
	},
	{
		anchor: 'par:one-pixel-and-many',
		text:
			'The fringe spacing $\\vartheta_1=\\lambda/D$ is 0.01 radian for pixels a hundred wavelengths apart, so ' +
			'$1-\\cos^8(\\vartheta_1/2)=1.00\\times10^{-4}$. At signal-to-noise ratio $\\rho=100$ the true fringe ' +
			'then stands above the next by $1+100^2\\times10^{-4}=2$.',
		chapter: '9.1',
		section: 'two-squares-overlap-less-than-two-vectors'
	},
	{
		anchor: 'par:variation-across-the-array',
		text:
			'Strain is the fractional change of a length. A wave of strain $10^{-21}$ at 100 Hz has a tide of size ' +
			'$2.79\\times10^{-16}\\,\\mathrm{s^{-2}}$, the root of the sum of squares of its entries. A person 3 m ' +
			'away has a tide of size $4.24\\times10^{-10}\\,\\mathrm{s^{-2}}$, which is $1.5\\times10^{6}$ times larger.',
		chapter: '8.6',
		section: 'each-kind-of-detector-reads-its-own-part-of-the-tide'
	},
	{
		anchor: 'par:depth',
		text:
			'The size of the tide of one mass is given by $|\\mathcal E|^2=6(GM)^2/r^6$ and the size of its gradient, ' +
			'its rate of change from place to place, by $|\\nabla\\mathcal E|^2=90(GM)^2/r^8$. Dividing, ' +
			'$|\\mathcal E|^2/|\\nabla\\mathcal E|^2=r^2/15$, so $r=\\sqrt{15}\\,|\\mathcal E|/|\\nabla\\mathcal E|$ for any mass.',
		chapter: '1.4',
		section: 'beside-one-mass-the-ring-stretches-along-the-line-and-squeezes-across-it'
	},
	{
		anchor: 'par:front-and-back',
		text:
			'A mass’s mirror image in the plane of the array lies at the opposite height $z$. The tide’s $zz$ entry ' +
			'depends on $z$ only through $z^2$, so it is unchanged, while its $xz$ and $yz$ entries, shears, are ' +
			'proportional to $z$ and change sign.',
		chapter: '1.4',
		section: 'beside-one-mass-the-ring-stretches-along-the-line-and-squeezes-across-it'
	},
	{
		anchor: 'par:precision',
		text:
			'The signal-to-noise ratio $\\rho$ is the size of the reading divided by the noise on each of its numbers. ' +
			'At $\\rho=100$ one wave is placed to 0.01 radian, or 0.57°, where a sensor of light would be uncertain ' +
			'by $\\sqrt2/100=0.014$ radian.',
		chapter: '9.7'
	},
	{
		anchor: 'par:separation-with-noise',
		text:
			'The shape test decides between a wave and a mass, whose nearest shapes lie $\\rho/2$ noise deviations ' +
			'apart. In a simulation at $\\rho=12$, a mass was taken for a wave about once in 140 readings and a wave ' +
			'for a mass about once in 1350, both fewer than one in a hundred.',
		chapter: '9.7',
		section: 'the-shape-of-the-tide-tells-a-wave-from-a-mass-at-half-its-size'
	}
];
