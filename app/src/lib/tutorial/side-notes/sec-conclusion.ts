/**
 * Side notes for the Conclusion (sec:conclusion). Drafted from reading chapters R9, R13 and R13b and the chapters
 * they cite. The rules, the voice and the format are in design/book/SIDE-NOTES-GUIDE.md.
 */
import type { SideNote } from './types';

export const section = 'sec:conclusion';

export const notes: SideNote[] = [
	{
		anchor: 'p:nearly-all-of-the',
		text:
			'A pixel reads the tide, a symmetric table of five independent numbers, and its magnetic part, five more. ' +
			'The ten regroup as four numbers on which every observer agrees, three angles that fix the field’s own axes, ' +
			'and the pixel’s velocity through them: $10 = 4 + 3 + 3$.',
		chapter: '9.3',
		section: 'ten-numbers-are-four-invariants-three-angles-and-a-velocity',
		figure: {
			name: 'tut-ten-regroup',
			alt: 'The ten numbers of a reading regrouped into four invariants, three angles and a velocity.'
		}
	},
	{
		anchor: 'p:each-channel-has-scenes',
		text:
			'Every density splits in two: a harmonic part, which the field outside reads, and a remainder that it cannot ' +
			'see, as a shell pulls like a point. The parts stand at right angles, so two bodies share an outside exactly ' +
			'when their harmonic parts agree.',
		chapter: '2.5',
		section: 'every-density-splits-into-a-harmonic-part-and-a-part-the-outside-cannot-see',
		figure: {
			name: 'tut-null-split',
			alt: 'A density drawn as the sum of a harmonic part, which the outside reads, and a part it cannot see.'
		}
	},
	{
		anchor: 'p:the-field-of-light',
		text:
			'A turn of $\\psi$ about the direction of travel multiplies a light wave’s field by $e^{-i\\psi}$ and a ' +
			'gravitational wave’s by $e^{-2i\\psi}$, because its pattern is the square of an arrow. A half turn therefore ' +
			'reverses light’s arrow but returns gravity’s pattern unchanged.',
		chapter: '9.1',
		section: 'lights-wave-is-the-vector-itself-spin-one-against-spin-two',
		figure: {
			name: 'tut-half-turn',
			alt: 'Half a turn about the direction of travel: light’s arrow reverses and gravity’s pattern of stretch and squeeze returns.'
		}
	}
];
