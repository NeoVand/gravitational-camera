/**
 * Side notes for Section XII, The exterior field and the interior (sec:hair). Drafted from reading chapter R13 and
 * the chapters it cites. The rules, the voice and the format are in design/book/SIDE-NOTES-GUIDE.md.
 */
import type { SideNote } from './types';

export const section = 'sec:hair';

export const notes: SideNote[] = [
	{
		anchor: 'p:the-limits-of-the',
		text:
			'Hair is the physicists’ word for any detail of a body’s inside that the field outside it could show. ' +
			'A black hole at rest shows only its mass, its spin and its place: seven numbers. An ordinary body ' +
			'shows far more, and the section counts how much.',
		chapter: '11.2',
		section: 'a-hole-at-rest-shows-seven-numbers-and-nothing-of-what-fell-in'
	},
	{
		anchor: 'par:the-field-at-one-time',
		text:
			'A harmonic function is one whose Laplacian, the sum of its second derivatives, is zero, and a ' +
			'body’s moments weigh its mass against such functions. A density $\\nabla^2\\psi/4\\pi G$, with ' +
			'$\\psi$ vanishing together with its slope outside the body, has none of these moments, so adding ' +
			'it changes nothing outside; it turns a ball into a shell.',
		chapter: '2.5',
		section: 'every-density-splits-into-a-harmonic-part-and-a-part-the-outside-cannot-see'
	},
	{
		anchor: 'par:the-number-of-bits',
		text:
			'A bit is the answer to one yes-or-no question. From three radii, $L = \\ln 10^6 = 13.8$ and ' +
			'$\\Lambda = \\ln 3 = 1.10$ give 1176 bits for the body, while seven numbers each read to one part ' +
			'in $10^6$ hold $7\\log_2 10^6 = 140$ bits. The ratio, 1176 / 140, is the scale’s 8.4.',
		chapter: '3.8',
		section: 'a-bodys-field-at-one-time-holds-about-1200-bits-from-three-radii-away'
	}
];
