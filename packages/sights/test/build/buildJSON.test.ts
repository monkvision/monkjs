jest.mock('fs');
jest.mock('../../src/io');

import fs from 'fs';
import { join, resolve } from 'path';
import { SightCategory } from '../../lib';
import { buildJSONs } from '../../src/build/buildJSONs';
import * as io from '../../src/io';
import { VehicleSights, VehicleType } from '../../src/lib';
import { pathsEqual } from '../test.utils';

describe('JSON builder module', () => {
  const labels = {
    'test-key': { fr: 'test fr', en: 'test en' },
    'test-key-2': { fr: 'test fr 2', en: 'test en 2', extra: 'extra' },
  };
  const vehicles = {
    'vehicle-key': {
      make: 'make',
      model: 'model',
      type: 'type',
      dimensionsXYZ: [1, 2, 3],
    },
    'vehicle-key-2': {
      make: 'make 2',
      model: 'model 2',
      type: 'type 2',
      dimensionsXYZ: [4, 5, 6],
      extra: 'extra',
    },
  };
  const sights = Object.values(VehicleType).reduce(
    (prev: VehicleSights, vehicleType) => ({
      ...prev,
      [vehicleType]: {
        [`${vehicleType}-uno`]: {
          id: `${vehicleType}-uno`,
          category: SightCategory.INTERIOR,
          label: 'test-key',
          overlay: 'overlay1.svg',
          vehicleType,
        },
        [`${vehicleType}-dos`]: {
          id: `${vehicleType}-dos`,
          category: SightCategory.INTERIOR,
          label: 'test-key-2',
          overlay: 'overlay2.svg',
          vehicleType,
          extra: 'extra',
        },
      },
    }),
    {} as VehicleSights,
  );

  beforeEach(() => {
    jest.spyOn(io, 'loadJSON').mockImplementation((path) => {
      if (pathsEqual(path as string, join(__dirname, '../../research/data/labels.json'))) {
        return labels;
      }
      if (pathsEqual(path as string, join(__dirname, '../../research/data/vehicles.json'))) {
        return vehicles;
      }
      const vehicleType = Object.values(VehicleType).find((type) =>
        pathsEqual(path as string, join(__dirname, `../../research/data/${type}/${type}.json`)),
      );
      if (vehicleType) {
        return sights[vehicleType];
      }
      return null;
    });

    jest.spyOn(io, 'readDir').mockImplementation((path) => {
      if (pathsEqual(path, join(__dirname, '../../research/data'))) {
        return {
          files: [],
          directories: Object.values(VehicleType),
        };
      }
      return { files: [], directories: [] };
    });

    fs.readFileSync = jest
      .fn()
      .mockImplementation((path: string, options?: { encoding: BufferEncoding }) => {
        if (options?.encoding === 'utf-8') {
          return `    ${resolve(path)}  `;
        }
        return null;
      });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('buildJSON function', () => {
    it('should create the output directories if they do not exist', () => {
      const createDirSpy = jest.spyOn(io, 'createDirIfNotExist');

      buildJSONs();

      expect(createDirSpy).toHaveBeenCalledTimes(2);
      expect(
        pathsEqual(createDirSpy.mock.calls[0]?.[0], join(__dirname, '../../src/lib/data')),
      ).toBe(true);
    });

    it('should properly map the labels and write them in the lib directory', () => {
      const saveLibJSONSpy = jest.spyOn(io, 'saveLibJSON');
      const properlyMappedLabels = Object.entries(labels).reduce(
        (prev, [key, value]) => ({
          ...prev,
          [key]: {
            fr: value.fr,
            en: value.en,
          },
        }),
        {},
      );

      buildJSONs();
      const call = saveLibJSONSpy.mock.calls.find((args) =>
        (args[1] as string).endsWith('labels.json'),
      );

      expect(call).not.toBeUndefined();
      expect(saveLibJSONSpy).toHaveBeenCalledTimes(2 + Object.keys(sights).length);
      expect(call?.[0]).toEqual(properlyMappedLabels);
      expect(
        pathsEqual(call?.[1] as string, join(__dirname, '../../src/lib/data/labels.json')),
      ).toBe(true);
    });

    it('should properly map the vehicles and write them in the lib directory', () => {
      const saveLibJSONSpy = jest.spyOn(io, 'saveLibJSON');
      const properlyMappedVehicles = Object.entries(vehicles).reduce(
        (prev, [key, value]) => ({
          ...prev,
          [key]: {
            make: value.make,
            model: value.model,
            type: value.type,
            dimensionsXYZ: value.dimensionsXYZ,
          },
        }),
        {},
      );

      buildJSONs();
      const call = saveLibJSONSpy.mock.calls.find((args) =>
        (args[1] as string).endsWith('vehicles.json'),
      );

      expect(call).not.toBeUndefined();
      expect(saveLibJSONSpy).toHaveBeenCalledTimes(2 + Object.keys(sights).length);
      expect(call?.[0]).toEqual(properlyMappedVehicles);
      expect(
        pathsEqual(call?.[1] as string, join(__dirname, '../../src/lib/data/vehicles.json')),
      ).toBe(true);
    });

    it('should properly map the sights and write them in the lib directory', () => {
      const saveLibJSONSpy = jest.spyOn(io, 'saveLibJSON');
      const properlyMappedSights = Object.entries(sights).reduce(
        (prev: VehicleSights, [key, value]) => ({
          ...prev,
          [key]: Object.entries(value).reduce(
            (sightPrev, [sightKey, sightValue]) => ({
              ...sightPrev,
              [sightKey]: {
                id: sightValue.id,
                category: sightValue.category,
                label: sightValue.label,
                overlay: resolve(
                  join(__dirname, `../../research/data/${key}/overlays/${sightValue.overlay}`),
                ),
                vehicleType: sightValue.vehicleType,
              },
            }),
            {},
          ),
        }),
        {} as VehicleSights,
      );

      buildJSONs();
      const calls = saveLibJSONSpy.mock.calls.filter(
        (args) =>
          !(args[1] as string).endsWith('labels.json') &&
          !(args[1] as string).endsWith('vehicles.json'),
      );

      expect(saveLibJSONSpy).toHaveBeenCalledTimes(2 + Object.keys(sights).length);
      expect(calls.length).toEqual(Object.values(VehicleType).length);
      Object.values(VehicleType).forEach((vehicleType) => {
        const call = calls.find((args) => (args[1] as string).endsWith(`${vehicleType}.json`));
        expect(call?.[0]).toEqual(properlyMappedSights[vehicleType]);
        expect(
          pathsEqual(
            call?.[1] as string,
            join(__dirname, `../../src/lib/data/sights/${vehicleType}.json`),
          ),
        ).toBe(true);
      });
    });
  });
});
