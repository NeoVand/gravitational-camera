// Stills of every demo, for the demo list and for browsers without WebGPU.
//
//   node scripts/posters.mjs [base url]      (default http://localhost:5173/)
//
// Each demo is opened with ?present=readback, its first steady frame is read
// from the canvas and saved as static/posters/<slug>.jpg. Set PW_CHROMIUM to a
// Chromium binary if Playwright's own download is not available.
import { writeFileSync } from 'node:fs';
import { chromium } from '@playwright/test';

const base = process.argv[2] ?? 'http://localhost:5173/';
const slugs = [
	'sun-at-midnight',
	'locked-safe',
	'full-or-empty',
	'blank-mirror',
	'closed-furnace',
	'honey-and-water',
	'which-way'
];

const browser = await chromium.launch({
	executablePath: process.env.PW_CHROMIUM || undefined,
	args: ['--enable-unsafe-webgpu']
});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
for (const slug of slugs) {
	await page.goto(new URL(`demo/${slug}/?present=readback`, base).href, { waitUntil: 'networkidle' });
	const frames = () =>
		page.evaluate(() => Number(document.querySelector('canvas')?.dataset.frames ?? 0));
	let last = -1;
	for (let i = 0; i < 80; i++) {
		const n = await frames();
		if (n > 0 && n === last) break;
		last = n;
		await page.waitForTimeout(1000);
	}
	const data = await page.evaluate(() =>
		document.querySelector('canvas').toDataURL('image/jpeg', 0.84)
	);
	writeFileSync(`static/posters/${slug}.jpg`, Buffer.from(data.split(',')[1], 'base64'));
	console.log('wrote', slug);
}
await browser.close();
