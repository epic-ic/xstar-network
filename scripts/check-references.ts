/// <reference types="node" />
import { spawnSync } from 'node:child_process';
import { checkReferences } from './references.ts';

const ASTRO = 'node_modules/astro/bin/astro.mjs';

const sync = () => {
  const result = spawnSync(process.execPath, [ASTRO, 'sync'], { encoding: 'utf8' });
  return { output: result.stdout + result.stderr, status: result.status };
};

process.exitCode = checkReferences(sync, (text) => console.log(text));
