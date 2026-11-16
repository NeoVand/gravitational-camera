import process from 'node:process';
import { defineConfig } from '@playwright/test';

export default defineConfig({
	testDir: 'e2e',
	testMatch: '**/*.e2e.ts',
	timeout: 90_000,
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
