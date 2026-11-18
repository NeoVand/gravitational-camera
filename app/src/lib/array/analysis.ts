/** The worker that takes the array's exposures (analysis.worker.ts). Throws where workers are not to be had. */
export const spawn = () =>
	new Worker(new URL('./analysis.worker.ts', import.meta.url), { type: 'module' });
