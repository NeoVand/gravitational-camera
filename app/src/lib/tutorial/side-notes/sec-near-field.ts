/**
 * Side notes for Section IV, The near field (sec:near-field). Drafted from reading chapters R2, R3 and R4 and the
 * chapters they cite. The rules, the voice and the format are in design/book/SIDE-NOTES-GUIDE.md.
 */
import type { SideNote } from './types';

export const section = 'sec:near-field';

export const notes: SideNote[] = [
	{
		anchor: 'p:in-the-near-zone',
		text:
			'Every mass pulls as if nothing else were there, so a wall between the camera and a mass adds its own ' +
			'pull and takes none of the mass’s away. The camera therefore reads the sum of all the mass in view, ' +
			'steel and gold alike.',
		chapter: '0.2',
		section: 'the-camera-weighs-what-it-sees-through-anything'
	},
	{
		anchor: 'par:how-bright',
		text:
			'The angular size $\\theta$ of a body is its radius divided by its distance. The Moon and the Sun have ' +
			'nearly the same $\\theta$, so the ratio of their tides is the ratio of their mean densities, ' +
			'3340 / 1410 = 2.4.',
		chapter: '1.4',
		section: 'tidal-brightness-is-density-times-the-cube-of-angular-size'
	},
	{
		anchor: 'par:what-the-image-is',
		text:
			'A mass at distance $r$ makes a tide that falls as $1/r^3$, but a narrow cone of sky holds mass in ' +
			'proportion to $r^2$. Each part of a line of sight therefore counts as its mass divided by its ' +
			'distance, which makes the tidal column. A single pixel reads only five numbers of it.',
		chapter: '0.2',
		section: 'the-camera-weighs-what-it-sees-through-anything'
	},
	{
		anchor: 'par:the-magnetic-picture',
		text:
			'The magnetic part of the tide twists where the electric part stretches, and it appears only when mass ' +
			'moves across the line of sight. A person walking at 1.4 m/s gives $\\sqrt3\\times1.4/(3.0\\times10^8) = ' +
			'8.1\\times10^{-9}$ of the electric tide.',
		chapter: '7.5',
		section: 'a-moving-mass-makes-a-magnetic-part-only-by-moving-across-the-line-of-sight'
	},
	{
		anchor: 'par:what-the-image-cannot-show',
		text:
			'Newton’s shell theorem is the simplest case: a hollow shell and a solid ball of equal mass pull alike at ' +
			'every point outside, so no camera there can tell them apart, however sensitive. Mass added to a body ' +
			'in a form that changes nothing outside is a blind spot of the camera.',
		chapter: '2.5',
		section: 'a-confined-laplacian-added-to-a-body-changes-nothing-outside'
	},
	{
		anchor: 'par:what-the-image-does-show',
		text:
			'A function is harmonic when its value at every point equals its average over any sphere around the ' +
			'point. Such a function has no peak or dip inside, so a harmonic density is largest and smallest on the ' +
			'surface, and the least assuming picture can never show a dense core.',
		chapter: '2.5',
		section: 'the-least-assuming-interior-is-the-harmonic-part-and-it-never-shows-a-core'
	},
	{
		anchor: 'p:figure-shows-three-bodies',
		text:
			'Spread evenly through the ball of radius $R$, the nugget’s mass $m$ would make a density ' +
			'$3m/4\\pi R^3$. The flush has $46m/4\\pi R^3$ on the nearest wall, which is 46 / 3 = 15 times as much. ' +
			'The skin is the same mass swept onto the surface.',
		chapter: '2.5',
		section: 'the-harmonic-part-of-a-nugget-is-a-flush-on-the-near-wall'
	},
	{
		anchor: 'par:what-breaks-the-tie',
		text:
			'A moment of inertia says how far a body’s mass lies from the axis it turns about. For the nugget, the ' +
			'flush and the skin, two thirds of $\\int\\rho r^2\\,dV$ plus a share of $mR^2/12$ common to all three ' +
			'gives $0.25$, $0.48$ and $0.75\\,mR^2$, so spin tells them apart.',
		chapter: '2.5',
		section: 'the-nugget-the-flush-and-the-skin-differ-only-in-what-the-outside-cannot-read'
	},
	{
		anchor: 'p:the-magnetic-part-has',
		text:
			'A roll is a flow of mass that circles in planes through an axis, like convection in a planet’s core. ' +
			'Its field outside is a pure gradient, which has no twist, so the magnetic part of the tide is zero ' +
			'there however fast the mass moves. A swirl about the axis does show.',
		chapter: '2.8',
		section: 'rolls-are-silent-outside-because-their-potential-there-is-a-gradient'
	},
	{
		anchor: 'p:together-the-channels-go',
		text:
			'With the mass, the moment of inertia $0.331\\,MR^2$ and a core radius of 3480 km, two unknowns are left: ' +
			'the densities of core and mantle. Solving gives $12{,}500$ and $4150\\,\\mathrm{kg\\,m^{-3}}$, the ' +
			'values the paper quotes.',
		chapter: '1.6',
		section: 'the-moment-of-inertia-tells-a-cored-planet-from-a-uniform-one'
	},
	{
		anchor: 'par:what-heat-reveals',
		text:
			'At temperature $T$ each particle of mass $m$ has a mean square speed $3k_BT/m$, with $k_B$ ' +
			'Boltzmann’s constant, whatever forces hold it. Positions and velocities are independent, so the ' +
			'tremor of any moment of the mass is fixed by $T$ and the density alone.',
		chapter: '4.2',
		section:
			'the-mean-square-rate-of-change-of-a-warm-bodys-moments-is-fixed-by-its-temperature-and-density'
	},
	{
		anchor: 'p:three-conditions-apply-the',
		text:
			'A mode of 15 kHz at 300 K holds on average $k_BT/\\hbar\\omega = 4.1\\times10^{-21} / 9.9\\times10^{-30} = ' +
			'4\\times10^8$ quanta, so it is classical. At a metre, $\\omega r/c = 2\\pi\\times15{,}000 / ' +
			'(3.0\\times10^8) = 3\\times10^{-4}$, deep in the near field.',
		chapter: 'R4',
		section: 'the-tremor-lies-in-a-few-classical-notes-and-the-camera-reads-it-without-one-graviton'
	},
	{
		anchor: 'par:what-an-applied-tide-reveals',
		text:
			'The Love number $k_2$ says how far a body yields to a tide. A fluid ball gives $3/2$, and a stiff ball, ' +
			'with a large rigidity $\\mu$, gives a very small number, here $4\\times10^{-16}$ for steel.',
		chapter: '4.6',
		section: 'the-static-end-of-the-response-is-the-love-number'
	},
	{
		anchor: 'par:a-model-independent-thermometer',
		text:
			'The tremor, how much the reading jitters, and the response, how far it moves under a push, both come ' +
			'from the body’s friction, so their ratio is the temperature. The modes of the body and how each shows ' +
			'at the pixel cancel, provided the push moves what the pixel reads.',
		chapter: '4.6',
		section: 'a-push-shaped-like-the-reading-makes-a-thermometer-that-needs-no-model-of-the-body'
	},
	{
		anchor: 'par:how-sharp',
		text:
			'A ripple with crests $\\lambda$ apart has wavenumber $k = 2\\pi/\\lambda$. For crests 10 cm apart seen ' +
			'from $z = 10$ cm, $kz = 2\\pi$ and the signal is weaker by $e^{2\\pi} = 535$; from 20 cm, ' +
			'$kz = 4\\pi$ and it is weaker by $e^{4\\pi} = 2.9\\times10^5$.',
		chapter: '0.2',
		section: 'fine-detail-fades-with-distance-much-faster-than-coarse-detail',
		figure: {
			name: 'tut-ripples',
			alt: 'Two ripples, one three times finer than the other, fade as they rise above the pixels.'
		}
	},
	{
		anchor: 'p:the-estimate-can-be',
		text:
			'The Wiener filter keeps each ripple by the fraction $s^2/(1+s^2)$, where $s$ is how far the ripple ' +
			'stands above its noise. A ripple well above its noise is kept whole, and one at $s = 1$ is kept by ' +
			'half; this is the cut-off $q_c$.',
		chapter: '3.5',
		section: 'independent-ripples-can-be-filtered-one-at-a-time'
	},
	{
		anchor: 'p:for-an-array-at',
		text:
			'One arcminute is $2.9\\times10^{-4}$ radians. Setting $4.43/q_c$ equal to it gives $q_c = 15{,}200$, ' +
			'and since $q_c$ is close to $\\ln\\mathrm{SNR}$, the signal-to-noise ratio is $e^{15{,}200} = 10^{6600}$.',
		chapter: '3.7',
		section: 'what-the-law-means'
	},
	{
		anchor: 'par:a-flown-gradiometer',
		text:
			'A pattern of degree $\\ell$ on the ground has wavenumber $\\ell/R$, with $R$ = 6371 km the Earth’s ' +
			'radius. At the height $z$ = 254 km, $kz = \\ell z/R$ is $280\\times254/6371 = 11.2$ for $\\ell = 280$ and ' +
			'12.0 for $\\ell = 300$.',
		chapter: '3.7',
		section: 'what-the-law-means'
	},
	{
		anchor: 'par:other-gravitational-sensors',
		text:
			'A clock runs slower where the potential is lower, so clocks read the potential itself, accelerometers ' +
			'its slope and a tidal pixel its second slope. Each step multiplies a ripple by $k$, a change of one ' +
			'power of $q = kz$, small beside the fading $e^{-q}$.',
		chapter: '2.7',
		section: 'the-same-fade-appears-for-every-field-that-obeys-laplaces-equation'
	},
	{
		anchor: 'par:a-small-camera',
		text:
			'Here $\\ell$ counts the waves of a pattern around the sky. For $r = 15$ m and $D = 0.1$ m, ' +
			'$2r/D = 300$ and $\\ln 300 = 5.7$, so $\\ell_{\\max} = 2 + 13.8/5.7 = 4.4$, where $13.8 = \\ln10^6$. The ' +
			'blur is $\\pi/4.4$ radians, 41°.',
		chapter: 'R3',
		section: 'clocks-and-accelerometers-meet-the-same-law-and-a-small-camera-does-worse'
	},
	{
		anchor: 'par:the-precision-of-a-simple-scene',
		text:
			'At $\\mathrm{SNR} = 1000$, $\\mathcal R = (\\sqrt{3\\pi}/4)\\times1000 = 770$. At 1 m the depth is placed to ' +
			'$z/\\mathcal R = 1.3$ mm and the position across to $\\sqrt{2/5}\\,z/\\mathcal R = 0.8$ mm, though the ' +
			'picture is 24° wide.',
		chapter: 'R3',
		section: 'one-mass-is-placed-to-a-millimetre-though-two-are-hard-to-tell-from-one'
	},
	{
		anchor: 'par:a-worked-case',
		text:
			'When the two cases differ by $d$ standard deviations of noise, the best guess is wrong with probability ' +
			'$\\Phi(-d/2)$, which is 18% for $d = 1.8$. The separation grows with the ratio, to ' +
			'$1.8\\times34/10 = 6.1$ at 34, where the error falls to $0.001$.',
		chapter: 'R3',
		section: 'the-safe-is-found-quickly-but-a-cautious-image-cannot-weigh-it'
	},
	{
		anchor: 'par:the-positivity-of-mass',
		text:
			'The bar weighs 324 kg. The estimate $315 \\pm 20$ kg misses it by 9 kg, under half of one spread. At a ' +
			'ratio of ten thousand the estimate is $328 \\pm 1$ kg, a little high because a bar is modelled as a ' +
			'grid of points.',
		chapter: '3.9',
		section: 'non-negative-least-squares-keeps-only-the-masses-the-data-need'
	},
	{
		anchor: 'par:the-zeros-of-the-shear',
		text:
			'The shear is the part of the tide that stretches the plane of the array one way and squeezes it ' +
			'another; written as one complex number, it vanishes where it has no preferred direction. On the ' +
			'bisector it is proportional to $y^2 - d^2/4$, so the zeros are at $y = \\pm d/2$, a distance $d$ apart.',
		chapter: '3.9',
		section: 'the-zeros-of-the-shear-survive-the-blur'
	},
	{
		anchor: 'par:limits-on-sensitivity',
		text:
			'For a person of 70 kg, $M_sc^2 = 70\\times9.0\\times10^{16} = 6.3\\times10^{18}$ J. Multiplied by the age ' +
			'of the universe, $4.4\\times10^{17}$ s, and divided by $\\hbar = 1.05\\times10^{-34}$ J s, it gives ' +
			'$2.6\\times10^{70}$, which the paper rounds to $10^{70}$.',
		chapter: '8.6',
		section: 'no-state-changes-faster-than-its-energy-spread-allows-and-that-caps-every-camera'
	},
	{
		anchor: 'p:quantum-mechanics-sets-a',
		text:
			'A mass in a superposition is in two places at once. Its two branches have quadrupoles that differ by ' +
			'about $md^2$, with $m$ the mass and $d$ the distance between the places, and a camera that read the ' +
			'difference would learn which branch holds the mass.',
		chapter: 'R8',
		section: 'a-camera-that-could-read-a-quantum-mass-would-end-its-superposition'
	},
	{
		anchor: 'par:the-information-in-a-near-field-image',
		text:
			'A number read through noise at ratio $s$ carries at most $\\tfrac12\\log_2(1+s^2)$ bits: half a bit at ' +
			'$s = 1$, and 3.3 bits at $s = 10$. Each tenfold gain in $s$ adds about $\\log_2 10 = 3.3$ bits.',
		chapter: '3.8',
		section: 'a-picture-is-many-ripples-with-independent-noise-and-their-bits-add'
	},
	{
		anchor: 'p:the-two-terms-have',
		text:
			'At a ratio of 1000, $q_c = 10.4$, so there are $q_c^2/4\\pi = 8.6$ patterns per area $z^2$, each ' +
			'carrying $(q_c/3 - \\tfrac12)/\\ln 2 = 4.3$ bits. Their product, 37 bits, is close to the exact ' +
			'38.',
		chapter: '3.8',
		section:
			'sensitivity-buys-more-patterns-and-more-bits-in-each-so-the-bits-grow-as-the-cube-of-its-logarithm'
	},
	{
		anchor: 'p:the-cameras-other-channels',
		text:
			'A steradian is a patch of sky about 65° across. A wave camera of width $D$ at wavelength $\\lambda$ ' +
			'resolves about $(D/\\lambda)^2$ directions in it, so a camera ten wavelengths wide resolves 100, ' +
			'whatever its sensitivity, which only adds bits to each.',
		chapter: '5.3',
		section: 'an-array-resolves-as-many-directions-as-its-area-holds-square-wavelengths'
	},
	{
		anchor: 'par:the-geometry-of-the-near-field',
		text:
			'The line element $(dx^2 + dy^2 + dz^2)/z^2$ measures each small step in units of the depth where it is ' +
			'taken. Multiplying every length by one factor changes no distance, so a change of scale is a rigid ' +
			'motion of this space, which is why the blur is the same angle at every depth.',
		chapter: '3.9',
		section: 'the-space-below-a-flat-camera-is-hyperbolic'
	}
];
