/**
 * The array's exposures, off the main thread: factoring a new array takes a few tenths of a second, and the spread
 * of a positive image forty more fits. Each message is a Request with an id; the answer is the Exposure with the same.
 */
import { arrayCache, work, type Request } from './camera';

const arrays = arrayCache();

self.onmessage = (event: MessageEvent<{ id: number; request: Request }>) => {
	const { id, request } = event.data;
	try {
		self.postMessage({ id, exposure: work(request, arrays) });
	} catch (error) {
		self.postMessage({ id, error: error instanceof Error ? error.message : String(error) });
	}
};
