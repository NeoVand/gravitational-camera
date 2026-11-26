/**
 * Side notes for Section X, What the camera can do that light cannot (sec:affordances). Drafted from reading
 * chapter R12 and the chapters it cites. The rules, the voice and the format are in
 * design/book/SIDE-NOTES-GUIDE.md.
 */
import type { SideNote } from './types';

export const section = 'sec:affordances';

export const notes: SideNote[] = [
	{
		anchor: 'p:the-line-of-the',
		text:
			'A beam of power $P$ carries energy and an equal pressure along it, and both produce gravity, so it ' +
			'pulls like a line of $2P/c^3$ kilograms per metre: $7.4\\times10^{-21}$ for 100 kW. Its tide at a ' +
			'metre is $9.9\\times10^{-31}\\,\\mathrm{s^{-2}}$, against $9.3\\times10^{-9}$ for a person of 70 kg: ' +
			'$10^{22}$ times less.',
		chapter: '6.5',
		section: 'what-gravitates-is-the-energy-plus-the-sum-of-the-stresses'
	},
	{
		anchor: 'p:within-each-channel-there',
		text:
			'A thermal glow counts gravitons at a rate set by the body’s internal friction times the cube of its ' +
			'temperature. A body at 600 K with an eighth of the friction therefore sends as many gravitons as ' +
			'one at 300 K, since doubling the temperature multiplies the cube by 8. Its energy and spectrum ' +
			'differ, and that breaks the tie.',
		chapter: '5.5',
		section: 'a-materials-brightness-is-its-friction-times-a-power-of-its-temperature'
	}
];
