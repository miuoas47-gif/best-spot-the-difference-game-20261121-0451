// main.ts — hands in The Clockmaker's Workshop (Node 22, stdlib only).
//
// The repository holds the game as plain static files under game/ and its
// real browser screenshots under screenshots/. This program copies both
// folders into the output directory and writes dossier.json there, the
// summary the judge reads, using the vendored make.fun library.
//
// It runs with no arguments. Outside the grader, MAKEFUN_OUTPUT_DIR stands
// in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
//
// The copy is deterministic: stale game/ or screenshots/ output is removed
// first, files are copied in sorted order, and nothing else is written, so
// two runs over the same repository produce the same bytes.

import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// The scorer's own caps: only text_max_bytes shapes the dossier's bytes;
// the rest refuse an entry the scorer would refuse anyway (more than 4
// screenshots or one over 256 KiB; more than 993 files in game/ or 48 MiB
// of game files in all, or a path under game/ over 1000 bytes).
const DOSSIER_CAPS = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
};

function copyTree(source: string, target: string): number {
  mkdirSync(target, { recursive: true });
  let copied = 0;
  const entries = readdirSync(source, { withFileTypes: true }).sort((a, b) =>
    a.name.localeCompare(b.name),
  );
  for (const entry of entries) {
    const from = join(source, entry.name);
    const to = join(target, entry.name);
    if (entry.isDirectory()) {
      copied += copyTree(from, to);
    } else if (entry.isFile()) {
      copyFileSync(from, to);
      copied += 1;
    }
  }
  return copied;
}

function freshDir(path: string): void {
  if (existsSync(path)) rmSync(path, { recursive: true, force: true });
  mkdirSync(path, { recursive: true });
}

const gameSource = join(repoRoot, 'game');
const shotsSource = join(repoRoot, 'screenshots');
if (!existsSync(gameSource)) throw new Error('game/ is missing from the repository');
if (!existsSync(shotsSource)) throw new Error('screenshots/ is missing from the repository');

mkdirSync(outDir, { recursive: true });
freshDir(join(outDir, 'game'));
freshDir(join(outDir, 'screenshots'));

const gameFiles = copyTree(gameSource, join(outDir, 'game'));
const shotFiles = copyTree(shotsSource, join(outDir, 'screenshots'));

const shotNames = readdirSync(shotsSource).sort();
if (shotNames.length < 3 || shotNames.length > DOSSIER_CAPS.screenshots.max) {
  throw new Error(
    `expected 3 or 4 screenshots, found ${shotNames.length} in screenshots/`,
  );
}
if (!existsSync(join(gameSource, 'index.html'))) {
  throw new Error('game/index.html is missing: the game has no entry page');
}
for (const name of shotNames) {
  const size = statSync(join(shotsSource, name)).size;
  if (size > DOSSIER_CAPS.screenshots.max_bytes) {
    throw new Error(`screenshot ${name} is ${size} bytes, over the 256 KiB cap`);
  }
}

const dossier = buildDossier(outDir, DOSSIER_CAPS);
writeFileSync(join(outDir, 'dossier.json'), dossier);

console.log(
  `handed in ${gameFiles} game files and ${shotFiles} screenshots; dossier.json is ${dossier.byteLength} bytes`,
);
