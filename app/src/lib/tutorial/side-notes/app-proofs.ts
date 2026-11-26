/**
 * Side notes for Appendix C, Six short proofs (app:proofs). Drafted from reading chapters R9 and R13 and the
 * chapters they cite. The rules, the voice and the format are in design/book/SIDE-NOTES-GUIDE.md.
 */
import type { SideNote } from './types';

export const section = 'app:proofs';

export const notes: SideNote[] = [
	{
		anchor: 'par:the-principal-null-directions-of-a-moving-body',
		text:
			'A body at rest has two principal null directions, along the line to it, each counted twice. Aberration is ' +
			'the shift in the apparent direction of a ray when the observer moves. For a moving pixel, half the difference ' +
			'of the two shifted directions points to where the body is now, not to where it is seen.',
		chapter: '9.4',
		section: 'moving-the-pixel-moves-the-four-directions-as-rays-of-light'
	},
	{
		anchor: 'par:the-count-of-waves',
		text:
			'One reading of a pixel is $2s + 1$ complex numbers: 5 for gravity, 3 for light. $N$ waves seen in $L$ readings ' +
			'have $N$ directions and $LN$ amplitudes, so $L(2s + 1) \\ge N(L + 1)$. For gravity that allows four waves, ' +
			'from $L = 4$ on, and never five; for light, two.',
		chapter: '9.5',
		section: 'all-three-cases-are-pronys-problem-and-counting-gives-the-limit'
	},
	{
		anchor: 'par:the-reach-of-a-tide-of-given-degree',
		text:
			'A harmonic polynomial is one whose Laplacian, the sum of its second derivatives, is zero. Applying the ' +
			'Laplacian to the product of two gradients gives a similar product of second derivatives, so after $m$ steps a ' +
			'tide of degree $m$ or less has no derivatives left and reaches nothing beyond the ladder.',
		chapter: '13.3',
		section:
			'polynomials-killed-by-repeated-laplacians-are-harmonic-ones-times-even-powers-of-the-radius'
	},
	{
		anchor: 'par:what-the-passes-of-a-mass-determine',
		text:
			'Writing a point of the plane as a complex number $z$ turns the kernel $1/|b - z|^2$ into a double series. ' +
			'Its term $(p, q)$ falls as $|b|^{-(p+q+2)}$ and turns as $e^{i(q-p)\\varphi}$, so no two terms look alike, ' +
			'and an annulus of impact points gives every moment one by one.',
		chapter: '13.1',
		section: 'the-passers-loss-of-energy-holds-every-moment-of-the-projected-body'
	},
	{
		anchor: 'par:the-energy-given-by-an-impulsive-wave',
		text:
			'A particle crossing the front keeps $q = E/c - p_z$ and is kicked sideways in proportion to $q$. Two equal ' +
			'masses $m$ flying apart at $p = \\tfrac34 mc$ together have rest mass $2.5\\,m$; a wave that stops their ' +
			'sideways motion leaves $2\\,m$, moving at $0.22\\,c$.',
		chapter: '13.5',
		section: 'whatever-crosses-the-front-keeps-q-and-is-kicked-in-proportion-to-it'
	}
];
