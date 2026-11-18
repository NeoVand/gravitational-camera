import process from 'node:process';
import { defineConfig } from 'vitest/config';
import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';

// GitHub Pages serves the site from /<repository>/; the deploy workflow passes that in.
const base = (process.env.BASE_PATH ?? '') as '' | `/${string}`;

export default defineConfig({
	plugins: [
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			adapter: adapter({ fallback: '404.html' }),
			paths: { base: process.argv.includes('dev') ? '' : base },
			prerender: {
				// The paper's PDF is made by LaTeX in the deploy workflow only, so
				// other builds may lack it; every other broken link still fails.
				handleHttpError: ({ path, message }) => {
					if (path.endsWith('/gravitational-camera.pdf')) return;
					throw new Error(message);
				}
			}
		})
	],
	// scenes, fixtures and the paper live beside the app; previews may arrive through a proxy host
	server: { fs: { allow: ['..'] }, allowedHosts: true },
	preview: { allowedHosts: true },
	test: {
		expect: { requireAssertions: true },
		// several tests run whole inversions and field grids, a few seconds each on a busy machine
		testTimeout: 30_000,
		projects: [
			{
				extends: './vite.config.ts',
				test: {
					name: 'server',
					environment: 'node',
					testTimeout: 30_000,
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
				}
			}
		]
	}
});
