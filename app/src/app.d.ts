// See https://svelte.dev/docs/kit/types#app.d.ts
declare global {
	namespace App {}
}

declare module '*.wgsl?raw' {
	const source: string;
	export default source;
}

export {};
