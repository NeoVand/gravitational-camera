/**
 * The state of "The camera at work": what the visitor has set, and the latest exposure the worker has sent back.
 * One object is shared by the view (lib/ui/CameraAtWork.svelte) and its controls (CameraAtWorkControls.svelte).
 */
import { untrack } from 'svelte';
import { spawn } from './analysis';
import { arrayCache, work, type Contents, type Exposure, type Request } from './camera';

interface Answer {
	id: number;
	exposure?: Exposure;
	error?: string;
}

export class SafeCamera {
	#decades = $state(3);
	#side = $state(1);
	#n = $state(11);
	#seed = $state(1);
	#positive = $state(false);
	#contents = $state<Contents>('bar-right');

	/** The signal-to-noise ratio as a power of ten, 0 to 6. */
	get decades() {
		return this.#decades;
	}
	set decades(value) {
		this.#decades = value;
		this.#changed();
	}

	/** The array's side D, m. */
	get side() {
		return this.#side;
	}
	set side(value) {
		this.#side = value;
		this.#changed();
	}

	/** Pixels along a side. */
	get n() {
		return this.#n;
	}
	set n(value) {
		this.#n = value;
		this.#changed();
	}

	/** Which exposure: the seed of its noise. */
	get seed() {
		return this.#seed;
	}
	set seed(value) {
		this.#seed = value;
		this.#changed();
	}

	/** Whether the image is made with every cell's mass held at zero or above. */
	get positive() {
		return this.#positive;
	}
	set positive(value) {
		this.#positive = value;
		this.#changed();
	}

	/** What is really in the safe. The scene's half of the work uses it; the camera's never sees it. */
	get contents() {
		return this.#contents;
	}
	set contents(value) {
		this.#contents = value;
		this.#changed();
	}

	/** The latest exposure, with the request it answers. */
	exposure = $state.raw<Exposure>();
	busy = $state(false);
	failure = $state('');
	/** How the decision has gone over the exposures taken since the array, the noise or the contents last changed. */
	tally = $state.raw({ right: 0, left: 0 });

	readonly request: Request = $derived({
		snr: 10 ** this.#decades,
		side: this.#side,
		n: this.#n,
		seed: this.#seed,
		positive: this.#positive,
		contents: this.#contents
	});

	#running = false;
	#worker: Worker | undefined;
	#local: ReturnType<typeof arrayCache> | undefined;
	#sent = 0;
	#waiting: Request | undefined;
	#counted = { key: '', last: -Infinity };

	newExposure() {
		this.seed += 1;
	}

	/** Every change of a setting asks for the exposure again, once the view is open. */
	#changed() {
		if (this.#running) this.ask(this.request);
	}

	/**
	 * Start the worker and take the first exposure; the function returned stops it. Without workers the work is
	 * done here, a little later. Meant for `{@attach}` on the view: nothing reactive is read on the way.
	 */
	start(): () => void {
		try {
			this.#worker = spawn();
			this.#worker.onmessage = (event: MessageEvent<Answer>) => this.#receive(event.data);
			this.#worker.onerror = (event) => {
				this.failure = event.message || 'the computation could not start';
				this.busy = false;
			};
		} catch {
			this.#local = arrayCache();
		}
		this.#running = true;
		untrack(() => {
			this.busy = false;
			this.ask(this.request);
		});
		return () => {
			this.#running = false;
			this.#worker?.terminate();
			this.#worker = undefined;
			this.#waiting = undefined;
			this.busy = false;
		};
	}

	/** Ask for an exposure. While one is being worked on, only the latest request waits. */
	ask(request: Request) {
		if (untrack(() => this.busy)) {
			this.#waiting = request;
			return;
		}
		this.busy = true;
		const id = ++this.#sent;
		if (this.#worker) {
			this.#worker.postMessage({ id, request });
		} else if (this.#local) {
			const arrays = this.#local;
			setTimeout(() => {
				try {
					this.#receive({ id, exposure: work(request, arrays) });
				} catch (error) {
					this.#receive({ id, error: error instanceof Error ? error.message : String(error) });
				}
			});
		}
	}

	#receive(answer: Answer) {
		this.busy = false;
		if (answer.exposure) {
			this.failure = '';
			this.exposure = answer.exposure;
			this.#count(answer.exposure);
		} else {
			this.failure = answer.error ?? 'the computation failed';
		}
		const next = this.#waiting;
		this.#waiting = undefined;
		if (next) this.ask(next);
	}

	/**
	 * Each exposure's decision is counted once (seeds only rise); the count starts again when anything but the
	 * exposure changes.
	 */
	#count(exposure: Exposure) {
		const { snr, side, n, contents, seed } = exposure.request;
		const key = `${snr}/${side}/${n}/${contents}`;
		if (key !== this.#counted.key) {
			this.#counted = { key, last: -Infinity };
			this.tally = { right: 0, left: 0 };
		}
		if (seed <= this.#counted.last) return;
		this.#counted.last = seed;
		const choice = exposure.analysis.decision.choice;
		this.tally = { ...this.tally, [choice]: this.tally[choice] + 1 };
	}
}
