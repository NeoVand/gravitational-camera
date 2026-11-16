// Render figures modelled in three.js to SVG and PDF.
//   node figures3d/render.mjs tidal [more names]   writes paper/figures/staging/<name>.svg and .pdf
//   ... --final                                    writes into paper/figures/
import { createRequire } from 'node:module';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const here = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const final = args.includes('--final');
const names = args.filter((a) => !a.startsWith('--'));
const root = path.join(here, '..');
const out = path.join(root, 'paper', 'figures', final ? '' : 'staging');
fs.mkdirSync(out, { recursive: true });

const types = { '.svg': 'image/svg+xml', '.js': 'text/javascript', '.mjs': 'text/javascript', '.html': 'text/html', '.json': 'application/json' };
const server = http.createServer((req, res) => {
	const file = path.join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname));
	if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
		res.writeHead(404); res.end(); return;
	}
	res.writeHead(200, { 'Content-Type': types[path.extname(file)] ?? 'application/octet-stream' });
	fs.createReadStream(file).pipe(res);
});
await new Promise((r) => server.listen(0, r));
const port = server.address().port;
const browser = await chromium.launch();
try {
	for (const name of names) {
		const page = await browser.newPage();
		page.on('pageerror', (e) => console.error(name, 'page error:', e.message));
		page.on('console', (m) => m.type() === 'error' && console.error(name, m.text()));
		await page.goto(`http://localhost:${port}/figures3d/page.html?fig=${name}`);
		let svg = await page.evaluate(() => window.figureReady);
		// ids unique to the figure, since the site inlines several figures on one page
		svg = svg.replace(/id="(p\d+[^"]*)"/g, `id="${name}-$1"`).replace(/url\(#(p\d+[^)]*)\)/g, `url(#${name}-$1)`);
		fs.writeFileSync(path.join(out, `${name}.svg`), svg);
		// the PDF: the same SVG on a page of exactly its size, printed as vectors
		const [w, h] = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/).slice(1).map(Number);
		await page.setContent(`<html><body style="margin:0">${svg}</body></html>`);
		await page.pdf({ path: path.join(out, `${name}.pdf`), width: `${w / 72}in`, height: `${h / 72}in`, printBackground: false, pageRanges: '1' });
		console.log(`wrote ${name}.svg (${Math.round(svg.length / 1024)} kB) and .pdf, ${w} x ${h} pt`);
		await page.close();
	}
} finally {
	await browser.close();
	server.close();
}
