// @astrojs/vercel 7.x (the last version supporting Astro 4) only knows about
// Node 18 and 20, and falls back to the retired nodejs18.x runtime on newer Node.
// Vercel has discontinued Node 20, so point every serverless function at the
// Node major declared in package.json "engines" instead.
// Remove this script once the site is upgraded to Astro 5+ and a newer adapter.
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const major = pkg.engines.node.match(/\d+/)[0];
const runtime = `nodejs${major}.x`;
const functionsDir = '.vercel/output/functions';

if (!existsSync(functionsDir)) process.exit(0);

for (const dir of readdirSync(functionsDir)) {
  const configPath = join(functionsDir, dir, '.vc-config.json');
  if (!existsSync(configPath)) continue;
  const config = JSON.parse(readFileSync(configPath, 'utf8'));
  if (config.runtime !== runtime) {
    console.log(`[fix-vercel-runtime] ${dir}: ${config.runtime} -> ${runtime}`);
    config.runtime = runtime;
    writeFileSync(configPath, JSON.stringify(config, null, '\t'));
  }
}
