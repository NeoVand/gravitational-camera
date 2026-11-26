/**
 * Side notes for Section XVII, Open problems (sec:status). Drafted from chapter 13.8. The rules, the voice and the
 * format are in design/book/SIDE-NOTES-GUIDE.md.
 */
import type { SideNote } from './types';

export const section = 'sec:status';

export const notes: SideNote[] = [
	{
		anchor: 'p:six-problems-are-open',
		text:
			'A signal-to-noise ratio is a reading’s size divided by its noise. For a scene of mass $M$ watched for a time ' +
			'$\\tau$, quantum mechanics allows at most $Mc^2\\tau/2\\hbar$; for a person of 70 kg watched for the age of the ' +
			'universe, $4.4\\times10^{17}$ s, that is $1.3\\times10^{70}$.',
		chapter: '13.8',
		section: 'quantum-mechanics-caps-the-sensitivity-by-the-area-of-the-region'
	}
];
