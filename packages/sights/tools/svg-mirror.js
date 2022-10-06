/* eslint-disable */
const { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync } = require('fs');
const { join } = require('path');
const { MirrorDirection, mirror } = require('./common');

if (process.argv.length < 4) {
  console.error('Script could not run because of missing arguments.');
  console.error('Usage : node svg-mirror.js [direction] [directories ...]');
  console.error('Please refer to the README file for more information.');
  process.exit(1);
}

const inputDirection = process.argv[2];
if (!Object.values(MirrorDirection).includes(inputDirection)) {
  console.error(`Invalid direction : ${inputDirection}`);
  console.error('Please refer to the README file for more information.');
  process.exit(2);
}

process.argv.slice(3).forEach((inputDir) => {
  const outputDir = `${inputDir}-mirror`;
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir);
  }
  readdirSync(inputDir).forEach((fileName) => {
    if (fileName.endsWith('.svg')) {
      const filePath = join(inputDir, fileName)
      const svg = readFileSync(filePath).toString();
      const mirroredSvg = mirror(inputDirection, filePath, svg);
      writeFileSync(join(outputDir, fileName), mirroredSvg, { encoding: 'utf-8' });
    }
  });
});
