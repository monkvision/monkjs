jest.mock('fs');
jest.mock('../../src/io');

import {
  PartSelectionOrientation,
  Sight,
  SightCategory,
  SightDictionary,
  TaskName,
  VehicleModel,
  WheelName,
} from '@monkvision/types';
import fs from 'fs';
import { join, resolve } from 'path';
import { buildJSONs } from '../../src/build/buildJSONs';
import * as io from '../../src/io';
import { pathsEqual } from '../utils';

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
      dimensions_xyz: [1, 2, 3],
    },
    'vehicle-key-2': {
      make: 'make 2',
      model: 'model 2',
      type: 'type 2',
      dimensions_xyz: [4, 5, 6],
      extra: 'extra',
    },
  };
  const sights = Object.values(VehicleModel).reduce(
    (prev: SightDictionary, vehicle) => ({
      ...prev,
      [`${vehicle}-uno`]: {
        id: `${vehicle}-uno`,
        category: SightCategory.INTERIOR,
        label: 'test-key',
        overlay: 'overlay1.svg',
        tasks: [TaskName.DAMAGE_DETECTION],
        vehicle,
        wheel_name: WheelName.FRONT_LEFT,
      },
      [`${vehicle}-dos`]: {
        id: `${vehicle}-dos`,
        category: SightCategory.INTERIOR,
        label: 'test-key-2',
        overlay: 'overlay2.svg',
        vehicle,
        tasks: [TaskName.DAMAGE_DETECTION],
        extra: 'extra',
      },
    }),
    {} as SightDictionary,
  );

  beforeEach(() => {
    jest.spyOn(io, 'loadJSON').mockImplementation((path) => {
      if (pathsEqual(path as string, join(__dirname, '../../research/data/labels.json'))) {
        return labels;
      }
      if (pathsEqual(path as string, join(__dirname, '../../research/data/vehicles.json'))) {
        return vehicles;
      }
      const vehicle = Object.values(VehicleModel).find((type) =>
        pathsEqual(path as string, join(__dirname, `../../research/data/${type}/${type}.json`)),
      );
      if (vehicle) {
        return {
          [`${vehicle}-uno`]: sights[`${vehicle}-uno`],
          [`${vehicle}-dos`]: sights[`${vehicle}-dos`],
        };
      }
      return null;
    });

    jest.spyOn(io, 'readDir').mockImplementation((path) => {
      if (pathsEqual(path, join(__dirname, '../../research/data'))) {
        return {
          files: [],
          directories: Object.values(VehicleModel),
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
            key,
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
      expect(saveLibJSONSpy).toHaveBeenCalledTimes(3 + Object.keys(VehicleModel).length);
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
            id: key,
            make: value.make,
            model: value.model,
            type: value.type,
            dimensionsXYZ: value.dimensions_xyz,
          },
        }),
        {},
      );

      buildJSONs();
      const call = saveLibJSONSpy.mock.calls.find((args) =>
        (args[1] as string).endsWith('vehicles.json'),
      );

      expect(call).not.toBeUndefined();
      expect(saveLibJSONSpy).toHaveBeenCalledTimes(3 + Object.keys(VehicleModel).length);
      expect(call?.[0]).toEqual(properlyMappedVehicles);
      expect(
        pathsEqual(call?.[1] as string, join(__dirname, '../../src/lib/data/vehicles.json')),
      ).toBe(true);
    });

    it('should properly map the sights and write them in the lib directory', () => {
      const saveLibJSONSpy = jest.spyOn(io, 'saveLibJSON');
      const properlyMappedSights = Object.entries(sights).reduce(
        (prev: SightDictionary, [id, value]) => {
          const apiSight = value as Sight & { wheel_name?: WheelName };

          return {
            ...prev,
            [id]: {
              id,
              category: value.category,
              label: value.label,
              tasks: value.tasks,
              overlay: resolve(
                join(__dirname, `../../research/data/${value.vehicle}/overlays/${value.overlay}`),
              ),
              vehicle: value.vehicle,
              wheelName: apiSight.wheel_name,
            },
          };
        },
        {} as SightDictionary,
      );

      buildJSONs();
      const calls = saveLibJSONSpy.mock.calls.filter(
        (args) =>
          !(args[1] as string).endsWith('labels.json') &&
          !(args[1] as string).endsWith('vehicles.json') &&
          !(args[1] as string).endsWith('wireframes.json'),
      );

      expect(saveLibJSONSpy).toHaveBeenCalledTimes(3 + Object.keys(VehicleModel).length);
      expect(calls.length).toEqual(Object.values(VehicleModel).length);
      Object.values(VehicleModel).forEach((vehicle) => {
        const call = calls.find((args) => (args[1] as string).endsWith(`${vehicle}.json`));
        expect(call?.[0]).toEqual({
          [`${vehicle}-uno`]: properlyMappedSights[`${vehicle}-uno`],
          [`${vehicle}-dos`]: properlyMappedSights[`${vehicle}-dos`],
        });
        expect(
          pathsEqual(
            call?.[1] as string,
            join(__dirname, `../../src/lib/data/sights/${vehicle}.json`),
          ),
        ).toBe(true);
      });
    });

    it('should property create the wireframes file', () => {
      const saveLibJSONSpy = jest.spyOn(io, 'saveLibJSON');
      fs.existsSync = jest
        .fn()
        .mockImplementation((path: string) => path.includes('vehicle-key-2'));
      buildJSONs();
      const call = saveLibJSONSpy.mock.calls.find((args) =>
        (args[1] as string).endsWith('wireframes.json'),
      );
      expect(call?.[0]).toEqual({
        'vehicle-key-2': {
          [PartSelectionOrientation.FRONT_LEFT]: expect.any(String),
          [PartSelectionOrientation.FRONT_RIGHT]: expect.any(String),
          [PartSelectionOrientation.REAR_LEFT]: expect.any(String),
          [PartSelectionOrientation.REAR_RIGHT]: expect.any(String),
        },
      });
    });

    it('should throw an error when some wireframes are missing', () => {
      fs.existsSync = jest
        .fn()
        .mockImplementation((path: string) => path.includes('vehicle-key-2'));
      fs.readFileSync = jest
        .fn()
        .mockImplementation((path: string, options?: { encoding: BufferEncoding }) => {
          if (path.endsWith(`vehicle-key-2-${PartSelectionOrientation.FRONT_LEFT}.svg`)) {
            throw new Error('File Not found');
          }
          if (options?.encoding === 'utf-8') {
            return `    ${resolve(path)}  `;
          }
          return null;
        });
      expect(() => buildJSONs()).toThrowError('File Not found');
    });
  });
});
