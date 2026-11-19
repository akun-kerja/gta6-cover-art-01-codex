// Package the offline Vice / Versa poster studio and its real browser captures for make.fun.
// Run with Node 22: MAKEFUN_OUTPUT_DIR=out node main.ts
import { cpSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-app.ts';

const root = fileURLToPath(new URL('.', import.meta.url));
const destination = process.env.MAKEFUN_OUTPUT_DIR || '/output';
mkdirSync(destination, { recursive: true });
cpSync(join(root, 'app'), join(destination, 'app'), { recursive: true });
cpSync(join(root, 'screenshots'), join(destination, 'screenshots'), { recursive: true });
const dossier = buildDossier(destination, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
  app_path_max_bytes: 1000,
});
writeFileSync(join(destination, 'dossier.json'), dossier);
