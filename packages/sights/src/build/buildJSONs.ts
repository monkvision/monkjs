import {
  LabelDictionary,
  PartSelectionOrientation,
  SightDictionary,
  VehicleDictionary,
  VehicleModel,
  WireFrameDictionary,
} from '@monkvision/types';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { MONK_DATA_PATH, createDirIfNotExist, loadJSON, readDir, saveLibJSON } from '../io';

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

function mapWireFrames(vehicles: VehicleDictionary): WireFrameDictionary {
  const wireFrames: WireFrameDictionary = {};
  Object.keys(vehicles).forEach((vehicle) => {
    if (!existsSync(join(MONK_DATA_PATH, vehicle, 'partSelectionWireframes'))) return;
    const svgFrontLeft = readOverlay(
      join(
        MONK_DATA_PATH,
        vehicle,
        'partSelectionWireframes',
        `${vehicle}-${PartSelectionOrientation.FRONT_LEFT}.svg`,
      ),
    );
    const svgFrontRight = readOverlay(
      join(
        MONK_DATA_PATH,
        vehicle,
        'partSelectionWireframes',
        `${vehicle}-${PartSelectionOrientation.FRONT_RIGHT}.svg`,
      ),
    );
    const svgRearLeft = readOverlay(
      join(
        MONK_DATA_PATH,
        vehicle,
        'partSelectionWireframes',
        `${vehicle}-${PartSelectionOrientation.REAR_LEFT}.svg`,
      ),
    );
    const svgRearRight = readOverlay(
      join(
        MONK_DATA_PATH,
        vehicle,
        'partSelectionWireframes',
        `${vehicle}-${PartSelectionOrientation.REAR_RIGHT}.svg`,
      ),
    );
    wireFrames[vehicle as VehicleModel] = {
      [PartSelectionOrientation.FRONT_LEFT]: svgFrontLeft,
      [PartSelectionOrientation.FRONT_RIGHT]: svgFrontRight,
      [PartSelectionOrientation.REAR_LEFT]: svgRearLeft,
      [PartSelectionOrientation.REAR_RIGHT]: svgRearRight,
    };
  });
  return wireFrames;
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

  const libWireFrames = mapWireFrames(libVehicles);
  saveLibJSON(libWireFrames, join(DATA_OUTPUT_PATH, 'wireFrames.json'));

  readDir(MONK_DATA_PATH).directories.forEach((vehicle) => {
    const researchSights = loadJSON(
      join(MONK_DATA_PATH, vehicle, `${vehicle}.json`),
    ) as SightDictionary;
    const overlaysPath = join(MONK_DATA_PATH, vehicle, 'overlays');
    const libSights = mapSights(researchSights, vehicle as VehicleModel, overlaysPath);
    saveLibJSON(libSights, join(DATA_OUTPUT_PATH, 'sights', `${vehicle}.json`));
  });
}
