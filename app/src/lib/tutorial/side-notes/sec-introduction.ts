/**
 * Side notes for Section I, Introduction (sec:introduction). Drafted from the chapters of Part 0 and the chapters they
 * cite. The rules, the voice and the format are in design/book/SIDE-NOTES-GUIDE.md.
 */
import type { SideNote } from './types';

export const section = 'sec:introduction';

export const notes: SideNote[] = [
	{
		anchor: 'p:gravitational-waves-were-first',
		text:
			'A strain is a change of length divided by the length. The waves LIGO detects have a strain near ' +
			'$10^{-21}$, so over an arm of 4000 m the two arms differ by $10^{-21}\\times4000 = 4\\times10^{-18}$ m, ' +
			'a 420th of the width of a proton.',
		chapter: '0.1',
		section: 'ligo-is-a-camera-with-one-pixel'
	},
	{
		anchor: 'p:the-question-has-an',
		text:
			'Where gravity is weak, the gravity of separate masses adds, so the picture of a room is the sum of the ' +
			'pictures of what is in it. Weak means that $GM/Rc^2$, for a body of mass $M$ and radius $R$, is small: ' +
			'$7\\times10^{-10}$ for the Earth, $2\\times10^{-6}$ for the Sun and one half for a black hole.',
		chapter: '7.4',
		section: 'a-weak-field-is-a-small-table-laid-on-flat-spacetime'
	}
];
