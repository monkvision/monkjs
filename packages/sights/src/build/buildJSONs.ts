import { readFileSync } from 'fs';
import { join } from 'path';
import {
  LabelDictionary,
  SightDictionary,
  VehicleDictionary,
  VehicleModel,
} from '@monkvision/types';
import { createDirIfNotExist, loadJSON, MONK_DATA_PATH, readDir, saveLibJSON } from '../io';

const DATA_OUTPUT_PATH = join(__dirname, '../../src/lib/data');

function mapLabels(labels: LabelDictionary): LabelDictionary {
  return Object.entries(labels).reduce(
    (prev: LabelDictionary, [key, labelTranslation]) => ({
      ...prev,
      [key]: {
        key,
        fr: labelTranslation.fr,
        en: labelTranslation.en,
        de: labelTranslation.de,
        nl: labelTranslation.nl,
      },
    }),
    {},
  );
}

function mapVehicles(vehicles: VehicleDictionary): VehicleDictionary {
  return Object.entries(vehicles).reduce(
    (prev: Partial<VehicleDictionary>, [model, vehicleDetails]) => ({
      ...prev,
      [model]: {
        id: model,
        make: vehicleDetails.make,
        model: vehicleDetails.model,
        type: vehicleDetails.type,
        dimensionsXYZ: vehicleDetails.dimensionsXYZ,
      },
    }),
    {},
  ) as VehicleDictionary;
}

function readOverlay(path: string): string {
  return readFileSync(path, { encoding: 'utf-8' }).replace(/^\s+|\s+$/gm, '');
}

function mapSights(
  sights: SightDictionary,
  vehicle: VehicleModel,
  overlaysPath: string,
): SightDictionary {
  return Object.entries(sights).reduce(
    (prev: SightDictionary, [id, sight]) => ({
      ...prev,
      [id]: {
        id,
        category: sight.category,
        label: sight.label,
        overlay: readOverlay(join(overlaysPath, sight.overlay)),
        tasks: sight.tasks,
        vehicle,
      },
    }),
    {},
  );
}

export function buildJSONs(): void {
  createDirIfNotExist(DATA_OUTPUT_PATH);
  createDirIfNotExist(join(DATA_OUTPUT_PATH, 'sights'));

  const researchLabels = loadJSON(join(MONK_DATA_PATH, 'labels.json')) as LabelDictionary;
  const libLabels = mapLabels(researchLabels);
  saveLibJSON(libLabels, join(DATA_OUTPUT_PATH, 'labels.json'));

  const researchVehicles = loadJSON(join(MONK_DATA_PATH, 'vehicles.json')) as VehicleDictionary;
  const libVehicles = mapVehicles(researchVehicles);
  saveLibJSON(libVehicles, join(DATA_OUTPUT_PATH, 'vehicles.json'));

  readDir(MONK_DATA_PATH).directories.forEach((vehicle) => {
    const researchSights = loadJSON(
      join(MONK_DATA_PATH, vehicle, `${vehicle}.json`),
    ) as SightDictionary;
    const overlaysPath = join(MONK_DATA_PATH, vehicle, 'overlays');
    const libSights = mapSights(researchSights, vehicle as VehicleModel, overlaysPath);
    saveLibJSON(libSights, join(DATA_OUTPUT_PATH, 'sights', `${vehicle}.json`));
  });
}
