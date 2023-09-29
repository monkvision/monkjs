import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { VehicleType } from '@monkvision/types';

export const OUTPUT_PATH = join(__dirname, '../../src/lib');
const DATA_IMPORT_KEYWORD = '###__IMPORT_VEHICLE_SIGHTS__###';
const DATA_EXPORT_KEYWORD = '###__EXPORT_VEHICLE_SIGHTS__###';

function createVehicleImportStatement(vehicleType: VehicleType): string {
  return `import ${vehicleType}JSON from './data/sights/${vehicleType}.json';\n`;
}

function createVehicleExportStatement(vehicleTypeKey: keyof typeof VehicleType): string {
  return `  [VehicleType.${vehicleTypeKey}]: ${VehicleType[vehicleTypeKey]}JSON as SightDictionary,\n`;
}

export function generateIndex(): void {
  const template = readFileSync(join(__dirname, '../../src/templates/index.ts.template'), {
    encoding: 'utf-8',
  });
  writeFileSync(join(OUTPUT_PATH, 'index.ts'), template, { encoding: 'utf-8' });
}

export function generateUtils(): void {
  const template = readFileSync(join(__dirname, '../../src/templates/utils.ts.template'), {
    encoding: 'utf-8',
  });
  writeFileSync(join(OUTPUT_PATH, 'utils.ts'), template, { encoding: 'utf-8' });
}

export function generateData(): void {
  let importVehicleSights = '';
  let exportVehicleSights = '';
  Object.entries(VehicleType).forEach(([key, vehicleType]) => {
    importVehicleSights += createVehicleImportStatement(vehicleType);
    exportVehicleSights += createVehicleExportStatement(key as keyof typeof VehicleType);
  });
  const template = readFileSync(join(__dirname, '../../src/templates/data.ts.template'), {
    encoding: 'utf-8',
  });
  const data = template
    .replaceAll(DATA_IMPORT_KEYWORD, importVehicleSights)
    .replaceAll(DATA_EXPORT_KEYWORD, exportVehicleSights);
  writeFileSync(join(OUTPUT_PATH, 'data.ts'), data, { encoding: 'utf-8' });
}
