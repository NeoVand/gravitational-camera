/**
 * Side notes for Section VII, A camera without a lens (sec:no-lens). Drafted from reading chapter R11 and the
 * chapters it cites. The rules, the voice and the format are in design/book/SIDE-NOTES-GUIDE.md.
 */
import type { SideNote } from './types';

export const section = 'sec:no-lens';

export const notes: SideNote[] = [
	{
		anchor: 'par:the-optical-constants-of-matter',
		text:
			'The refractive index $n$ measures how much matter slows a wave. For steel, of density ' +
			'7850 $\\mathrm{kg\\,m^{-3}}$, at 1 kHz the formula gives $8.3\\times10^{-14}$. A thin lens of radius ' +
			'$R$ and thickness $h$ focuses at $R^2/2(n-1)h$, so a steel lens a metre thick and a metre in radius ' +
			'focuses at $6.0\\times10^{12}$ m, 40 times the Earth–Sun distance.',
		chapter: '5.5',
		section:
			'matter-makes-no-useful-lens-or-mirror-and-gravity-focuses-well-only-when-it-is-very-compact'
	},
	{
		anchor: 'p:a-mass-does-bend',
		text:
			'A mass bends a ray passing at distance $b$ by $2r_s/b$, where $r_s = 2GM/c^2$ is its Schwarzschild ' +
			'radius, 8.87 mm for the Earth. Rays at $b$ cross the axis at $b^2/2r_s$, so the Earth focuses grazing ' +
			'rays 15,300 times the distance to the Sun away, a focal ratio of $1.8\\times10^8$.',
		chapter: '11.1',
		section: 'far-from-a-mass-light-bends-by-twice-newtons-angle'
	},
	{
		anchor: 'par:a-black-hole-as-the-lens',
		text:
			'Gravity bends the edge ray of a lens of radius $R$ by $2r_s/R$, and a focus at distance $f$ needs the ' +
			'bend $R/f$. At $f/10$ and $R = 5$ cm, that makes $r_s = R/40 = 1.25$ mm, which is a mass of ' +
			'$8.4\\times10^{23}$ kg, about 11.5 Moons.',
		chapter: '5.5',
		section:
			'matter-makes-no-useful-lens-or-mirror-and-gravity-focuses-well-only-when-it-is-very-compact',
		figure: {
			name: 'tut-rad-lenses',
			alt: 'A thin glass lens bringing parallel rays to a focus, beside a point mass bending rays to a line of foci.'
		}
	},
	{
		anchor: 'p:the-natural-choice-is',
		text:
			'A mass focuses only waves shorter than $4\\pi r_s$, a limit set by diffraction. For this hole, with ' +
			'$r_s = 0.201$ mm, that is 2.53 mm, or frequencies above 118 GHz. A kilohertz wave, 300 km long, would ' +
			'need a lens of 8.1 solar masses.',
		chapter: '11.1',
		section: 'a-mass-is-a-lens-with-a-line-of-foci-and-an-einstein-ring'
	},
	{
		anchor: 'p:the-camera-cannot-sit',
		text:
			'The stretch along the line to a round mass $M$ is $2GM/r^3$: for this hole $1.8\\times10^{13}\\,' +
			'\\mathrm{s^{-2}}$ at a metre, and $1\\,\\mathrm{s^{-2}}$ at 26.3 km. A detector of radius $a = 5$ cm ' +
			'collects the rays through an annulus of area $\\pi a\\sqrt{a^2 + 4b_E^2}$, with $b_E = 3.25$ m ' +
			'the Einstein radius: 1.02 m², 130 times its own area.',
		chapter: '11.1',
		section: 'the-tide-outside-a-round-mass-is-exactly-newtons'
	},
	{
		anchor: 'par:what-a-lens-would-add',
		text:
			'Matter answers a tide by deforming, which adds a fraction of order $G\\rho/\\omega_0^2$ to the field. ' +
			'That reaches one when $\\omega_0$ is as low as $\\sqrt{G\\rho} = 7.2\\times10^{-4}\\,\\mathrm{s^{-1}}$ ' +
			'for steel, in a slab whose thickness is about the speed of sound over this: shear sound at ' +
			'3000 m/s gives 4100 km, of the order of ten thousand kilometres.',
		chapter: '4.3',
		section: 'a-solid-carries-two-kinds-of-sound'
	},
	{
		anchor: 'par:the-computed-image',
		text:
			'A wave from the direction $\\hat n$ reaches a pixel at $\\mathbf x_p$ earlier by $\\hat n\\cdot' +
			'\\mathbf x_p/c$: up to 3.3 ns for pixels a metre apart. Shifting each record by its delay and adding ' +
			'lines such waves up. The sharpness $\\lambda/D$ is an angle in radians: ten-centimetre waves and an ' +
			'array 1.5 m wide give 0.067, about 3.8°.',
		chapter: '5.3',
		section: 'delaying-and-adding-the-records-of-many-pixels-points-the-array'
	}
];
