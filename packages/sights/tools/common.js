/* eslint-disable */
const { join } = require('path');
const { readFileSync } = require('fs');

const SVG_DIR = join(__dirname, '..', 'assets', 'overlays');
const ERROR_LOG = join(__dirname, 'errors.json');
const SVG_DIMENSION_REGEXP = /<svg[^>]+viewBox="(\d+\.?\d*) *,? *(\d+\.?\d*) *,? *(\d+\.?\d*) *,? *(\d+\.?\d*)"[^>]*>/;
const SVG_ROOT_GROUP_REGEXP = /<g([^>]*)>/ig;

const MirrorDirection = {
  HORIZONTAL: 'horizontal',
  VERTICAL: 'vertical',
  BOTH: 'both',
};

function loadIndex() {
  const index = JSON.parse(
    readFileSync(join(__dirname, '..', 'index.json'), { encoding: 'utf-8' }).toString(),
  );
  const indexSightIds = Object.keys(index);
  return { index, indexSightIds };
}

function getSvgDimensions(filePath, svg) {
  const matches = SVG_DIMENSION_REGEXP.exec(svg);
  if (!matches || matches.length < 5) {
    console.error(`Invalid or missing viewBox attribute in file ${filePath} :`, matches);
    process.exit(3);
  }
  return {
    width: matches[3],
    height: matches[4],
  };
}

function getMirrorTransform(direction, dimensions) {
  const scaleX = direction !== MirrorDirection.VERTICAL ? '-1' : '1';
  const scaleY = direction !== MirrorDirection.HORIZONTAL ? '-1' : '1';
  const translateX = direction !== MirrorDirection.VERTICAL ? `-${dimensions.width}` : '0';
  const translateY = direction !== MirrorDirection.HORIZONTAL ? `-${dimensions.height}` : '0';
  return `transform="scale(${scaleX},${scaleY}) translate(${translateX},${translateY})"`;
}

function mirror(direction, filePath, svg) {
  const dimensions = getSvgDimensions(filePath, svg);
  const transform = getMirrorTransform(direction, dimensions);
  return svg.replace(SVG_ROOT_GROUP_REGEXP, `<g\$1 ${transform}>`);
}

function icon(results) {
  return results.length > 0 ? '❌' : '✅';
}

module.exports = {
  SVG_DIR,
  ERROR_LOG,
  MirrorDirection,
  loadIndex,
  mirror,
  icon,
};
