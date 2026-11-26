/**
 * Side notes for Section III, Three regimes (sec:regimes). Drafted from reading chapter R5 and the chapters it cites.
 * The rules, the voice and the format are in design/book/SIDE-NOTES-GUIDE.md.
 */
import type { SideNote } from './types';

export const section = 'sec:regimes';

export const notes: SideNote[] = [
	{
		anchor: 'p:what-reaches-a-pixel',
		text:
			'The wavelength of a wave is the speed of light divided by its frequency, so at 1 Hz it is 299,800 km, ' +
			'and 299,800 / $2\\pi$ = 47,700 km, an eighth of the way to the Moon. The edge shrinks in proportion to ' +
			'the frequency, so at 1 kHz it is 47.7 km.',
		chapter: '5.2',
		section:
			'beside-an-oscillating-source-the-slope-of-the-field-has-a-near-part-and-a-wave-part-equal-at-kr-1'
	},
	{
		anchor: 'par:spin-speed-and-compactness',
		text:
			'A body of size $L$ whose parts move at speed $v$ changes in a time near $L/v$, so its waves have that ' +
			'period and its near zone reaches about $cL/v$. For a person, with $L = 1$ m and $v = 1$ m/s, this is ' +
			'$3\\times10^{8}$ m, four fifths of the way to the Moon.',
		chapter: 'R5',
		section: 'one-property-of-gravity-and-two-small-numbers-of-matter-decide-what-the-camera-can-do'
	}
];
