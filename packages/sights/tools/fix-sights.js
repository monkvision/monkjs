/* eslint-disable */
const { readFileSync, existsSync, writeFileSync, rmSync } = require('fs');
const { join } = require('path');
const { optimize } = require('svgo');
const { SVG_DIR, ERROR_LOG, loadIndex, MirrorDirection, mirror, icon } = require('./common');

const startTs = Date.now();

function minifyAndSave(svgPath, savePath) {
  const svg = readFileSync(svgPath, { encoding: 'utf-8' });
  const minified = optimize(svg);
  writeFileSync(savePath, minified.data, { encoding: 'utf-8' });
}

if (!existsSync(ERROR_LOG)) {
  console.error('Unable to find the error log file to process. Please first run the check-sights.js script before running this script.');
  process.exit(1);
}

const errors = JSON.parse(readFileSync(ERROR_LOG, { encoding: 'utf-8' }).toString());
const { index } = loadIndex();

const fixed = {
  invalidLabel: [],
  missingOverlay: [],
  notMinifiedOverlay: [],
  notSvgFiles: [],
  missingInfo: [],
};
const fixAll = process.argv.length > 2 && process.argv[2] === 'all';
if (fixAll) {
  console.warn('"all" param detected : overlays without SVG extension or with missing corresponding info will be deleted.');
}

errors.invalidLabel.forEach((sightId) => {
  if (typeof index[sightId].label === 'string') {
    const sightWithSameLabel = Object.values(index).find((sight) =>
      typeof sight.label === 'object' && [sight.label.en, sight.label.fn].includes(index[sightId].label));
    if (sightWithSameLabel) {
      index[sightId].label = sightWithSameLabel.label;
      fixed.invalidLabel.push(sightId);
    }
  }
});

const indexStr = JSON.stringify(index, null, 2);
writeFileSync(join(__dirname, '..', 'index.json'), indexStr, { encoding: 'utf-8' });

errors.missingOverlay.forEach((sightId) => {
  const svgPath = join(SVG_DIR, `${sightId}.svg`);
  const otherValidOverlayNames = [
    join(SVG_DIR, `${sightId}.white.svg`),
    join(SVG_DIR, `${sightId}.opengl - white.svg`),
  ];
  for (const otherFileName of otherValidOverlayNames) {
    if (existsSync(otherFileName)) {
      minifyAndSave(otherFileName, svgPath);
      rmSync(otherFileName);
      fixed.missingOverlay.push(sightId);
      return;
    }
  }
  if (index[sightId].mirror_sight) {
    const mirrorSvgPath = join(SVG_DIR, `${index[sightId].mirror_sight}.svg`);
    if (existsSync(mirrorSvgPath)) {
      const svg = readFileSync(mirrorSvgPath, { encoding: 'utf-8' });
      const mirrored = mirror(MirrorDirection.HORIZONTAL, mirrorSvgPath, svg);
      const minified = optimize(mirrored);
      writeFileSync(svgPath, minified.data, { encoding: 'utf-8' });
      fixed.missingOverlay.push(sightId);
    }
  }
});

errors.notMinifiedOverlay.forEach((sightId) => {
  const svgPath = join(SVG_DIR, `${sightId}.svg`);
  minifyAndSave(svgPath, svgPath);
  fixed.notMinifiedOverlay.push(sightId);
});

if (fixAll) {
  errors.notSvgFiles.forEach((fileName) => {
    rmSync(join(SVG_DIR, fileName));
    fixed.notSvgFiles.push(fileName);
  });

  errors.missingInfo.forEach((sightId) => {
    rmSync(join(SVG_DIR, `${sightId}.svg`));
    fixed.missingInfo.push(sightId);
  });
}

const unfixed = Object.entries(errors).reduce((prev, [key, value]) => ({
  ...prev,
  [key]: value.filter((element) => !fixed[key].includes(element)),
}), {});
const isAllGood = Object.values(unfixed).every((sightsIds) => sightsIds.length === 0);

console.log(`Done in ${Date.now() - startTs}ms ⚡️`);
console.log(`  ${icon(unfixed.invalidLabel)} ${fixed.invalidLabel.length}/${errors.invalidLabel.length} sight label(s) fixed in index.json`);
console.log(`  ${icon(unfixed.missingOverlay)} ${fixed.missingOverlay.length}/${errors.missingOverlay.length} missing overlay(s) added (using mirrors or by removing the .white extension)`);
console.log(`  ${icon(unfixed.notMinifiedOverlay)} ${fixed.notMinifiedOverlay.length}/${errors.notMinifiedOverlay.length} overlay(s) minified`);
if (!fixAll) {
  console.log('"all" param not used, skipping overlays without SVG extension and with missing info in index.json...');
} else {
  console.log(`  ${icon(unfixed.notSvgFiles)} ${fixed.notSvgFiles.length}/${errors.notSvgFiles.length} overlay(s) without SVG extension deleted`);
  console.log(`  ${icon(unfixed.missingInfo)} ${fixed.missingInfo.length}/${errors.missingInfo.length} overlay(s) without corresponding info in index.json deleted`);
}

if (isAllGood) {
  console.log('\nEverything seems to be good 🎉');
} else {
  console.log(`\nThere seems to be some errors left. You should re-run the check-sights.js script and fix the errors manually.`);
}
