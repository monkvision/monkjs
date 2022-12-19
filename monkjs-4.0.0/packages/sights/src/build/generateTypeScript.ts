import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { VehicleType } from '../lib/types';

const INDEX_TEMPLATE = readFileSync(join(__dirname, '../../src/templates/index.ts.template'), {
  encoding: 'utf-8',
});
const DATA_TEMPLATE = readFileSync(join(__dirname, '../../src/templates/data.ts.template'), {
  encoding: 'utf-8',
});
const DATA_IMPORT_KEYWORD = '###__IMPORT_VEHICLE_SIGHTS__###';
const DATA_EXPORT_KEYWORD = '###__EXPORT_VEHICLE_SIGHTS__###';
const OUTPUT_PATH = join(__dirname, '../../src/lib');

function createVehicleImportStatement(vehicleType: VehicleType): string {
  return `import ${vehicleType}JSON from './data/sights/${vehicleType}.json';\n`;
}

function createVehicleExportStatement(vehicleTypeKey: keyof typeof VehicleType): string {
  return `  [VehicleType.${vehicleTypeKey}]: ${VehicleType[vehicleTypeKey]}JSON as SightDictionary,\n`;
}

function generateIndex(): void {
  writeFileSync(join(OUTPUT_PATH, 'index.ts'), INDEX_TEMPLATE, { encoding: 'utf-8' });
}

function generateData(): void {
  let importVehicleSights = '';
  let exportVehicleSights = '';
  Object.entries(VehicleType).forEach(([key, vehicleType]) => {
    importVehicleSights += createVehicleImportStatement(vehicleType);
    exportVehicleSights += createVehicleExportStatement(key as keyof typeof VehicleType);
  });
  const data = DATA_TEMPLATE.replaceAll(DATA_IMPORT_KEYWORD, importVehicleSights).replaceAll(
    DATA_EXPORT_KEYWORD,
    exportVehicleSights,
  );
  writeFileSync(join(OUTPUT_PATH, 'data.ts'), data, { encoding: 'utf-8' });
}

export function generateTypeScript(): void {
  generateIndex();
  generateData();
}
