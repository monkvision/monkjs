import fs from 'fs';

const items = fs.readFileSync('./index.json', 'utf8');
const newItems = { ...JSON.parse(items) };

Object.keys(newItems).forEach((key) => {
  const path = `./assets/overlays/${key}.svg`;

  if (fs.existsSync(path)) {
    const data = fs.readFileSync(path, 'utf8');
    const item = newItems[key];

    newItems[key] = {
      id: item.id,
      label: item.label,
      category: item.category,
      vehicleType: item.vehicleType,
      overlay: data.replace(/^\s+|\s+$/gm, ''),
    };
  }
});

fs.mkdirSync('./dist', { recursive: true });
fs.writeFileSync('./dist/index.json', JSON.stringify(newItems, null, 0), 'utf-8');

const vehicleTypes = [
  'fesc20',
  'ff150',
  'ffocus18',
  'ftransit18',
  'haccord',
  'jgc21',
  'tsienna20',
];

const sanitizePartSelectorOverlay = (svgStr) => svgStr
  .replaceAll('\'', '\\\'')
  .replace(/^\s+|\s+$/gm, '');

let indexJs = 'const PartSelectorOverlays = {\n';
vehicleTypes.forEach((type) => {
  const frontLeft = fs.readFileSync(`./assets/part-selectors/${type}-front-left.svg`, 'utf8');
  const frontRight = fs.readFileSync(`./assets/part-selectors/${type}-front-right.svg`, 'utf8');
  const rearLeft = fs.readFileSync(`./assets/part-selectors/${type}-rear-left.svg`, 'utf8');
  const rearRight = fs.readFileSync(`./assets/part-selectors/${type}-rear-right.svg`, 'utf8');

  indexJs += `  ${type}: {\n`;
  indexJs += `    frontLeft: '${sanitizePartSelectorOverlay(frontLeft)}',\n`;
  indexJs += `    frontRight: '${sanitizePartSelectorOverlay(frontRight)}',\n`;
  indexJs += `    rearLeft: '${sanitizePartSelectorOverlay(rearLeft)}',\n`;
  indexJs += `    rearRight: '${sanitizePartSelectorOverlay(rearRight)}',\n`;
  indexJs += `  },\n`;
});
indexJs += '};\n\nmodule.exports = {\n  PartSelectorOverlays,\n};\n';

fs.writeFileSync('./dist/partSelectors.js', indexJs, 'utf-8');
