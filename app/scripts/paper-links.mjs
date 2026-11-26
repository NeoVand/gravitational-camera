#!/usr/bin/env node
/**
 * Writes the paper's margin map, src/lib/tutorial/paper-links.generated.ts, from the tutorial's records (the rules
 * are in src/lib/tutorial/paper-map.ts), and lists what the sources made the rules work around. Run it after a
 * chapter, derivations.yaml or parts.yaml changes; the unit tests fail while the file differs from what this writes.
 *
 * Usage, from app/: node scripts/paper-links.mjs [--check]   (--check: write nothing, exit 1 if the file is stale)
 *
 * It loads the site's own modules through Vite, so that the map is made by the same code that builds the pages.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import process from 'node:process';
import { createServer } from 'vite';

const check = process.argv.includes('--check');
const server = await createServer({
	configFile: 'vite.config.ts',
	server: { middlewareMode: true, hmr: false, ws: false },
	appType: 'custom',
	logLevel: 'error'
});
try {
	const { GENERATED, generatePaperMap, paperLinksSource } = await server.ssrLoadModule(
		'/src/lib/server/paper-map.ts'
	);
	const map = generatePaperMap();
	const text = await paperLinksSource(map);
	for (const note of map.notes) console.log(`note: ${note}`);
	const counts = {};
	for (const l of map.links) {
		const key = `${l.anchor.split(':')[0]} ${l.label}`;
		counts[key] = (counts[key] ?? 0) + 1;
	}
	console.log(`${map.links.length} notes:`, counts);
	let old = '';
	try {
		old = readFileSync(GENERATED, 'utf8');
	} catch {
		// no file yet
	}
	if (check) {
		if (old !== text) {
			console.error(`${GENERATED} is stale: run node scripts/paper-links.mjs`);
			process.exitCode = 1;
		} else console.log(`${GENERATED} is up to date`);
	} else if (old === text) console.log(`${GENERATED} is up to date`);
	else {
		writeFileSync(GENERATED, text);
		console.log(`wrote ${GENERATED}`);
	}
} finally {
	await server.close();
}
