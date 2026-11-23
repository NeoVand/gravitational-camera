import process from 'node:process';
import { defineConfig } from '@playwright/test';

export default defineConfig({
	testDir: 'e2e',
	testMatch: '**/*.e2e.ts',
	timeout: 90_000,
	// every test opens its own pages, so they run side by side; on CI, three workers on the
	// runner's four cores
	fullyParallel: true,
	workers: process.env.CI ? 3 : undefined,
	// the runner draws WebGPU in software, and two scenes drawn at once starve each other until
	// neither shows a new frame; so the tests that draw (tagged @gpu) take one worker, one at a time,
	// beside the rest
	projects: [
		{ name: 'gpu', grep: /@gpu/, workers: process.env.CI ? 1 : undefined },
		{ name: 'pages', grepInvert: /@gpu/ }
	],
	retries: process.env.CI ? 1 : 0,
	// the runner draws the WebGPU scenes in software for three workers at once, so a frame or a page
	// can take far longer than on a desk; waiting longer costs nothing when the check passes at once
	expect: { timeout: process.env.CI ? 20_000 : 5_000 },
	webServer: {
		command: 'pnpm run build && pnpm run preview',
		port: 4173,
		timeout: 180_000,
		reuseExistingServer: !process.env.CI
	},
	use: {
		baseURL: 'http://localhost:4173',
		launchOptions: {
			// WebGPU is off by default in headless Chromium; with this flag it runs on
			// the software adapter, which is enough to check the shaders' arithmetic.
			args: ['--enable-unsafe-webgpu'],
			// set PW_CHROMIUM to use a browser other than Playwright's own download
			executablePath: process.env.PW_CHROMIUM || undefined
		}
	}
});
