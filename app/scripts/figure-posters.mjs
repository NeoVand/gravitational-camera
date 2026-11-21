// Stills of the interactive figures, for the list at /figures. They are drawn pages, not canvases, so each is a
// screenshot of its stage with the interface hidden.
//
//   node scripts/figure-posters.mjs [base url] slug [slug ...]      (default base http://localhost:5173/)
//
// Writes static/posters/<slug>.jpg at 640 x 360, as the other figures' stills are. A slug may carry a wait in
// milliseconds after a colon (marked-ring:2600), for a page that should be caught part of the way through its run.
// Set PW_CHROMIUM to a Chromium binary if Playwright's own download is not available.
import { chromium } from '@playwright/test';

const args = process.argv.slice(2);
const base = args[0]?.startsWith('http') ? args.shift() : 'http://localhost:5173/';
if (!args.length) {
	console.error('usage: node scripts/figure-posters.mjs [base url] slug[:wait ms] ...');
	process.exit(1);
}

const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM || undefined });
// the page is laid out at 1280 x 720, as a visitor sees it, and saved at half that size
const page = await browser.newPage({
	viewport: { width: 1280, height: 720 },
	deviceScaleFactor: 0.5
});
for (const arg of args) {
	const [slug, wait] = arg.split(':');
	await page.goto(new URL(`figures/${slug}/`, base).href, { waitUntil: 'networkidle' });
	await page.locator('main[data-ready]').waitFor();
	await page.keyboard.press('h');
	// the still is of the figure alone, as the others are: without the control that brings the interface back
	await page.addStyleTag({ content: 'button.unhide { visibility: hidden !important; }' });
	await page.waitForTimeout(Number(wait ?? 800));
	await page.screenshot({ path: `static/posters/${slug}.jpg`, type: 'jpeg', quality: 86 });
	console.log('wrote', slug);
}
await browser.close();
