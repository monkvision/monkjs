/* eslint-disable */
const { readFileSync, existsSync, readdirSync, writeFileSync} = require('fs');
const { join } = require('path');
const { SVG_DIR, ERROR_LOG, loadIndex, icon } = require('./common');

const startTs = Date.now();

function getSvgPath(sightId) {
  return join(SVG_DIR, `${sightId}.svg`);
}

function hasValidLabel(sight) {
  return typeof sight.label === 'object' && !!sight.label.en && !!sight.label.fr;
}

function hasOverlay(sightId) {
  const svgPath = getSvgPath(sightId);
  return existsSync(svgPath);
}

function isOverlayMinified(sightId) {
  const svgPath = getSvgPath(sightId);
  const svgContent = readFileSync(svgPath, { encoding: 'utf-8' }).toString();
  return !['\n', '\r'].some((char) => svgContent.replace(/[\n\r]*$/, '').includes(char));
}

function isSvgFile(fileName) {
  return fileName.endsWith('.svg');
}

const { index, indexSightIds } = loadIndex();
const overlays = readdirSync(SVG_DIR);

const result = {
  invalidLabel: indexSightIds.filter((sightId) => !hasValidLabel(index[sightId])),
  missingOverlay: indexSightIds.filter((sightId) => !hasOverlay(sightId)),
  notMinifiedOverlay: indexSightIds
    .filter((sightId) => hasOverlay(sightId))
    .filter((sightId) => !isOverlayMinified(sightId)),
  notSvgFiles: overlays.filter((svgName) => !isSvgFile(svgName)),
  missingInfo: overlays
    .filter((svgName) => isSvgFile(svgName))
    .map((svgName) => svgName.slice(0, -4))
    .filter((sightId) => !indexSightIds.includes(sightId)),
};

const isAllGood = Object.values(result).every((sightsIds) => sightsIds.length === 0);

if (!isAllGood) {
  writeFileSync(ERROR_LOG, JSON.stringify(result, null, 2), { encoding: 'utf-8' });
}

console.log(`Done in ${Date.now() - startTs}ms ⚡️`);
console.log(`  ${icon(result.invalidLabel)} ${result.invalidLabel.length} sight(s) with invalid label in index.json`);
console.log(`  ${icon(result.missingOverlay)} ${result.missingOverlay.length} sight(s) with missing overlay`);
console.log(`  ${icon(result.notMinifiedOverlay)} ${result.notMinifiedOverlay.length} sight(s) with overlay not minified`);
console.log(`  ${icon(result.notSvgFiles)} ${result.notSvgFiles.length} file(s) without SVG extension in overlays directory`);
console.log(`  ${icon(result.missingInfo)} ${result.missingInfo.length} overlay(s) without corresponding info in index.json`);

if (isAllGood) {
  console.log('\nEverything seems to be good 🎉');
} else {
  console.log(`\nThere seems to be some errors. A JSON file containing error details has been generated at : ${ERROR_LOG}`);
}
