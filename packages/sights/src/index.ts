/* eslint-disable import/first */
const buildStart = Date.now();

import { validate } from './validate';
import { build } from './build';

validate();

if (!process.argv.includes('--validate-only')) {
  build();
}

console.log(`⚡️ Done in ${Date.now() - buildStart}ms`);
