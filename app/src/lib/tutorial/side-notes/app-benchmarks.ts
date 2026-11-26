/**
 * Side notes for Appendix A, Details of the numerical examples (app:benchmarks). Drafted from reading chapters R3
 * and R4 and the chapters they cite. The rules, the voice and the format are in design/book/SIDE-NOTES-GUIDE.md.
 */
import type { SideNote } from './types';

export const section = 'app:benchmarks';

export const notes: SideNote[] = [
	{
		anchor: 'par:the-worked-inversion',
		text:
			'The prior is what is expected of each cell before any reading, and the posterior is the spread of scenes ' +
			'still likely after. At $10^3$ the gold is known only to about $\\pm730$ kg, since the data barely reach ' +
			'fine patterns of mass between neighbouring cells: $\\sqrt{177^2 + 707^2} = 729$ kg of noise and leftover doubt.',
		chapter: '3.5',
		section: 'many-unknowns-are-guessed-together-with-the-same-formula'
	},
	{
		anchor: 'par:the-trembling-lattice',
		text:
			'A normal mode is a pattern of motion in which every mass swings at one frequency. The ball’s 924 masses ' +
			'move in three directions, which makes 2772 modes, six of them not ringing at all: the three drifts and three ' +
			'turns of a free body.',
		chapter: '4.3',
		section: 'masses-on-springs-move-in-normal-modes'
	},
	{
		anchor: 'p:for-a-quantum-system',
		text:
			'For a single mode the upper bound over the lower is $x\\coth x$, with $x = \\hbar\\omega/2k_BT$, which for small ' +
			'$x$ is $1 + x^2/3$. The steel ball at 12.6 kHz and 300 K has $x \\approx 10^{-9}$, so the two bounds ' +
			'differ by $3.4\\times10^{-19}$ of the jitter.',
		chapter: '8.7',
		section: 'the-static-jitter-lies-between-two-bounds'
	}
];
