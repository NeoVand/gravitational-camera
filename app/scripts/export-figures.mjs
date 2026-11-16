// Save the paper's drawn figures as still images for the LaTeX version.
//
//   node scripts/export-figures.mjs [base-url]
//
// Opens the paper page (default http://localhost:5173/) in the light theme and
// writes one PNG per drawn figure into ../paper/figures/, named after its
// label. The live controls under a drawing are left out: a printed figure
// states its settings in the drawing itself. The engine pictures are made by
// capture.mjs.
// Set PW_CHROMIUM to a Chromium binary if Playwright's own download is missing.
import path from 'node:path';
import { chromium } from '@playwright/test';

const base = process.argv[2] ?? 'http://localhost:5173/';
const outDir = path.resolve('..', 'paper', 'figures');

const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM || undefined });
const page = await browser.newPage({
	viewport: { width: 1100, height: 900 },
	deviceScaleFactor: 2,
	colorScheme: 'light',
	reducedMotion: 'reduce'
});
await page.goto(new URL('paper/', base).href, { waitUntil: 'networkidle' });
await page.addStyleTag({ content: '.gfig .controls, .gfig .note { display: none !important; }' });
const ids = await page.$$eval('figure.plate', (figures) =>
	figures.filter((f) => f.querySelector('svg') && !f.querySelector('canvas')).map((f) => f.id)
);
for (const id of ids) {
	const art = page.locator(`[id="${id}"] .art`);
	await art.scrollIntoViewIfNeeded();
	const file = path.join(outDir, `${id.replace(/^fig:/, '')}.png`);
	await art.screenshot({ path: file });
	console.log(`wrote ${file}`);
}
await browser.close();
