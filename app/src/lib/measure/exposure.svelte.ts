/**
 * The settings of a thermal demo's "Counts" view: how large and how long the exposure is, how finely the picture is
 * cut, whether it shows the expected counts or one draw of them, and which draw. CountsControls sets them; the page
 * turns them into a picture with lib/measure/counts.ts.
 */
import { LIFETIME, YEAR } from './counts';

/** The exposure time's slider runs from a second to this, in decades: 10^20 years. */
export const LONGEST = Math.log10(1e20 * YEAR);
/** The collecting area's slider runs from a square centimetre to a square kilometre, in decades of square metres. */
export const AREAS = [-4, 6] as const;

export class CountExposure {
	/** Collecting area, as the decades of square metres. */
	logArea = $state(0);
	/** Exposure time, as the decades of seconds: the paper's lifetime, eighty years, to begin with. */
	logTime = $state(Math.log10(LIFETIME));
	/** Picture elements across the view. */
	across = $state(48);
	/** The counts expected over the exposure, or one draw of them. */
	show: 'expected' | 'draw' = $state('draw');
	/** Which draw: each "New exposure" is another. */
	seed = $state(1);

	/** Square metres. */
	area = $derived(10 ** this.logArea);
	/** Seconds. */
	time = $derived(10 ** this.logTime);

	newExposure(): void {
		this.seed += 1;
	}

	/**
	 * Expose for `product` square-metre-seconds: for as long as that takes on the area set, or, if that is longer
	 * than the slider reaches, on as much more area as it needs.
	 */
	exposeFor(product: number): void {
		const decades = Math.log10(product);
		if (!Number.isFinite(decades)) return;
		const area = Math.min(AREAS[1], Math.max(AREAS[0], decades - LONGEST, this.logArea));
		this.logArea = Math.round(area * 20) / 20;
		this.logTime = Math.min(LONGEST, Math.max(0, decades - this.logArea));
		this.show = 'draw';
	}
}
