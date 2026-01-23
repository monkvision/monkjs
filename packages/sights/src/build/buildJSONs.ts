import {
  LabelDictionary,
  PartSelectionOrientation,
  PartSelectionWireframes,
  Sight,
  SightDictionary,
  VehicleDetails,
  VehicleDictionary,
  VehicleModel,
  WheelName,
  WireframeDictionary,
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
        ro: labelTranslation.ro,
        pl: labelTranslation.pl,
        da: labelTranslation.da,
        sv: labelTranslation.sv,
        es: labelTranslation.es,
        pt: labelTranslation.pt,
        de: labelTranslation.de,
        nl: labelTranslation.nl,
        it: labelTranslation.it,
      },
    }),
    {},
  );
}

function mapVehicles(vehicles: VehicleDictionary): VehicleDictionary {
  return Object.entries(vehicles).reduce(
    (prev: Partial<VehicleDictionary>, [model, vehicleDetails]) => {
      const apiVehicleDetails = vehicleDetails as VehicleDetails & { dimensions_xyz?: number[] };

      return {
        ...prev,
        [model]: {
          id: model,
          make: vehicleDetails.make,
          model: vehicleDetails.model,
          type: vehicleDetails.type,
          dimensionsXYZ: apiVehicleDetails.dimensions_xyz,
        },
      };
    },
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
  return Object.entries(sights).reduce((prev: SightDictionary, [id, sight]) => {
    const apiSight = sight as Sight & { wheel_name?: WheelName };
    return {
      ...prev,
      [id]: {
        id,
        category: sight.category,
        label: sight.label,
        overlay: readOverlay(join(overlaysPath, sight.overlay)),
        tasks: sight.tasks,
        vehicle,
        wheelName: apiSight.wheel_name,
        referencePicture: sight?.referencePicture,
        positioning: sight?.positioning,
      },
    };
  }, {});
}

function mapWireframes(vehicles: VehicleDictionary): WireframeDictionary {
  const wireframes: WireframeDictionary = {};
  Object.keys(vehicles).forEach((vehicle) => {
    if (!existsSync(join(MONK_DATA_PATH, vehicle, 'partSelectionWireframes'))) {
      return;
    }
    wireframes[vehicle as VehicleModel] = Object.values(PartSelectionOrientation).reduce(
      (prev, curr) => ({
        ...prev,
        [curr]: readOverlay(
          join(MONK_DATA_PATH, vehicle, 'partSelectionWireframes', `${vehicle}-${curr}.svg`),
        ),
      }),
      {} as PartSelectionWireframes,
    );
  });
  return wireframes;
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

  const libWireframes = mapWireframes(libVehicles);
  saveLibJSON(libWireframes, join(DATA_OUTPUT_PATH, 'wireframes.json'));

  readDir(MONK_DATA_PATH).directories.forEach((vehicle) => {
    const researchSights = loadJSON(
      join(MONK_DATA_PATH, vehicle, `${vehicle}.json`),
    ) as SightDictionary;
    const overlaysPath = join(MONK_DATA_PATH, vehicle, 'overlays');
    const libSights = mapSights(researchSights, vehicle as VehicleModel, overlaysPath);
    saveLibJSON(libSights, join(DATA_OUTPUT_PATH, 'sights', `${vehicle}.json`));
  });
}
