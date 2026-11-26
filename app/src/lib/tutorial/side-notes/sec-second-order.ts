/**
 * Side notes for Section XIII, Newton's theorem at second order (sec:second-order). Drafted from reading chapter
 * R13 and the chapters it cites. The rules, the voice and the format are in design/book/SIDE-NOTES-GUIDE.md.
 */
import type { SideNote } from './types';

export const section = 'sec:second-order';

export const notes: SideNote[] = [
	{
		anchor: 'p:the-ambiguity-of-section',
		text:
			'First order means in proportion to the small mass: the pull of the body on it. Second order means ' +
			'in proportion to the square of that mass, as the energy the body gains in reply is: twice the ' +
			'mass, four times the energy. Only the reply depends on how the mass inside is arranged.',
		chapter: '13.1',
		section: 'a-probe-reads-the-field-at-first-order-and-the-bodys-reply-at-second'
	},
	{
		anchor: 'par:the-field-at-two-times',
		text:
			'Two quantities commute when measuring them in either order gives the same result. A moment ' +
			'$Q_h$ and the rate of change $\\dot Q_g$ of another do not: they differ by $i\\hbar$ times the ' +
			'weighted total $\\int\\rho\\,\\nabla h\\cdot\\nabla g\\,\\dd V$ of the mass, where $\\hbar$ is ' +
			'Planck’s constant over $2\\pi$. That total is not a harmonic moment.',
		chapter: '8.2',
		section: 'two-moments-of-a-body-do-not-commute'
	},
	{
		anchor: 'p:the-right-hand-side-is',
		text:
			'Each exponential is harmonic because $\\zeta_\\pm\\cdot\\zeta_\\pm = \\tfrac14(|\\eta|^2 - ' +
			'|\\xi|^2) = 0$, and their product is the single ripple $e^{i\\xi\\cdot x}$. The dot product of ' +
			'their gradients is $-\\tfrac12|\\xi|^2$ times that ripple, so one weighted total reads one ' +
			'Fourier component, the strength of one ripple, of the density.',
		chapter: '13.2',
		section: 'two-harmonic-exponentials-multiply-into-any-ripple'
	},
	{
		anchor: 'par:the-two-readings-as-one-transform',
		text:
			"The sum $\\kappa=|\\mathbf k|+|\\mathbf k'|$ is never less than $K=|\\mathbf k+\\mathbf k'|$, by the " +
			'triangle inequality, so the transform lies on or above the cone $\\kappa=K$. One reading holds ' +
			'only the cone itself; two readings reach every point above it, each through all pairs on an ' +
			'ellipse whose foci are $0$ and $\\mathbf K$.',
		chapter: '13.2',
		section: 'every-point-inside-the-cone-is-reached-by-an-ellipse-of-pairs-of-tides'
	},
	{
		anchor: 'par:stability',
		text:
			'Detail of size 10 cm has $|\\xi| = 2\\pi / 0.1\\,\\mathrm{m} = 63\\,\\mathrm{m^{-1}}$. Across a steel ' +
			'ball of radius 0.5 m the two exponentials then span a factor $e^{|\\xi|R} = e^{31.4} = ' +
			'4.4\\times10^{13}$, so the reading needs a precision of one part in $4.4\\times10^{13}$. Half the ' +
			'detail squares the factor.',
		chapter: '13.2',
		section:
			'fine-detail-still-costs-exponentially-the-two-readings-remove-the-ambiguity-and-keep-the-blur'
	},
	{
		anchor: 'par:an-impulsive-tide-and-a-weighing',
		text:
			'An impulsive tide is a kick too brief for the body to move meanwhile. The energy ' +
			'it leaves is proportional to $\\int\\rho r^2\\dd V$, the mass weighted by the square of its ' +
			'distance from the centre: $\\tfrac35MR^2$ for a uniform ball of mass $M$ and radius $R$, and ' +
			'$MR^2$ for a thin shell. That is three to five.',
		chapter: '1.7',
		section: 'an-impulsive-tide-is-the-motion-generated-by-a-moment-of-the-mass'
	},
	{
		anchor: 'p:the-measurement-is-far',
		text:
			'An impulse of $3\\times10^{-12}\\,\\mathrm{m\\,s^{-1}}$ is $10^{-20}$ of the speed of light, and ' +
			'half its square is $5\\times10^{-41}$. A tonne held a metre away for 50 µs gives it: ' +
			'$6.67\\times10^{-11} \\times 1000 / 1^2 \\times 50\\times10^{-6} = 3.3\\times10^{-12}$, in ' +
			'metres per second.',
		chapter: '13.1',
		section: 'both-readings-are-far-beyond-reach'
	},
	{
		anchor: 'par:a-mass-that-passes',
		text:
			'A kernel is the function saying how much each piece of mass counts in a total. The kernel of ' +
			'the pull, $1/|\\mathbf x - \\mathbf y|$, is harmonic, so the pull holds only harmonic moments. ' +
			'The kernel of the energy gained, $|\\mathbf x - \\mathbf y|^{-4}$, is not, and its values at ' +
			'points outside the body fix the density.',
		chapter: '13.1',
		section: 'a-mass-held-for-an-instant-leaves-energy-through-a-kernel-that-is-not-harmonic'
	},
	{
		anchor: 'p:let-the-mass-now',
		text:
			'The thin shell and the shell holding half the mass around a point of the other half gain internal ' +
			'energy $0.0803$ and $0.1041$, in units of $MC^2/2R^2$, from a pass at $b = 1.5R$; $C = 2G\\mu/V$ ' +
			'is the kick’s strength. The ratio $0.1041 / 0.0803 = 1.30$ is the 30 per cent.',
		chapter: '1.8',
		section: 'what-a-pass-leaves-inside-a-body-is-a-weighted-sum-of-its-projected-mass'
	},
	{
		anchor: 'p:the-pair-of-eq',
		text:
			'The energy gained from the wave has a part that changes sign when the wave is reversed and a part ' +
			'that does not. Adding the wave and its reverse cancels the first and leaves ' +
			'$\\tfrac14\\int|\\nabla H|^2\\mathcal N\\,\\dd^2x_\\perp$, where $\\mathcal N \\ge 0$ is the energy ' +
			'crossing the front: a sum of squares, never negative.',
		chapter: '13.5',
		section: 'a-wave-and-its-reverse-together-always-give-energy'
	},
	{
		anchor: 'par:the-bits-of-a-second-reading',
		text:
			'The total degree $n$ of a moment is the number of powers of distance it weights the mass by. A ' +
			'second reading holds $(n+1)(n+2)/2$ moments of degree $n$, against the first reading’s $2n+1$: ' +
			'for $n = 0$ to 5, 1, 3, 6, 10, 15 and 21 against 1, 3, 5, 7, 9 and 11.',
		chapter: '13.2',
		section: 'the-bits-of-a-second-reading-grow-as-the-fourth-power-of-the-logarithm'
	},
	{
		anchor: 'par:what-a-tide-of-a-given-degree-reaches',
		text:
			'For the octupolar profile $g = \\tfrac13(x^3 - 3xy^2)$, $|\\nabla g|^2 = (x^2 + y^2)^2$, which ' +
			'averages $\\tfrac{8}{15}r^4$ over directions. The energy gained then follows $\\int\\rho\\,r^4\\,' +
			'\\dd V$, which is $\\tfrac14 MR^4$ for shell A and $\\tfrac12 MR^4$ for body B: B gains twice as ' +
			'much, though a quadrupolar tide treats them alike.',
		chapter: '13.3',
		section: 'two-bodies-that-no-quadrupolar-tide-tells-apart'
	},
	{
		anchor: 'par:the-flow',
		text:
			'In this sphere the inner ball turns one way and the shell the other, at the same rate, so it has ' +
			'no angular momentum and no magnetic field outside. Quadrupolar tides read nothing from it; the ' +
			'octupolar pair gives $\\tfrac{32}{35}(1 - 2^{-2/5})M\\Omega R^4 = 0.221\\,M\\Omega R^4$, with ' +
			'$\\Omega$ the inner ball’s rate.',
		chapter: '13.4',
		section: 'octupolar-tides-read-the-hidden-swirl'
	},
	{
		anchor: 'par:the-algebra-of-the-moments-and-the-energy',
		text:
			'The bracket of two quantities is the response of the first to a kick generated by the second. A ' +
			'tide’s kick is generated by a moment, so weighing the body after a kick reads that response ' +
			'taken twice. An observer who only measures the field learns values; one who can push learns ' +
			'brackets.',
		chapter: '13.6',
		section: 'looking-gives-values-pushing-gives-brackets'
	}
];
