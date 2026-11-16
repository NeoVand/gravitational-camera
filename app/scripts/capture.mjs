// Save what the engine draws on a page as an image file.
//
//   node scripts/capture.mjs <url> <out.(png|jpg)> [width] [height] [pixelRatio]
//
// The page is opened with ?present=readback, because headless browsers do not
// composite WebGPU canvases; the engine then copies each frame to a 2D canvas,
// which this script reads. Set PW_CHROMIUM to a Chromium binary if Playwright's
// own download is not available.
import { writeFileSync } from 'node:fs';
import { chromium } from '@playwright/test';

const [url, out, width = '1920', height = '1080', ratio = '1'] = process.argv.slice(2);
if (!url || !out) {
	console.error('usage: node scripts/capture.mjs <url> <out> [width] [height] [pixelRatio]');
	process.exit(2);
}

const browser = await chromium.launch({
	executablePath: process.env.PW_CHROMIUM || undefined,
	args: ['--enable-unsafe-webgpu']
});
const page = await browser.newPage({
	viewport: { width: Number(width), height: Number(height) },
	deviceScaleFactor: Number(ratio)
});
const target = new URL(url);
target.searchParams.set('present', 'readback');
await page.goto(target.href, { waitUntil: 'networkidle' });
await page.waitForFunction(
	() => Number(document.querySelector('canvas')?.dataset.frames ?? 0) > 0,
	null,
	{ timeout: 60_000 }
);
await page.waitForTimeout(500);
const type = out.endsWith('.png') ? 'image/png' : 'image/jpeg';
const dataUrl = await page.evaluate(
	(t) => document.querySelector('canvas').toDataURL(t, 0.9),
	type
);
writeFileSync(out, Buffer.from(dataUrl.split(',')[1], 'base64'));
const size = await page.evaluate(() => {
	const c = document.querySelector('canvas');
	return `${c.width}x${c.height}`;
});
console.log(`wrote ${out} (${size})`);
await browser.close();
