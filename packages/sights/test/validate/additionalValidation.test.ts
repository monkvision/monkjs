jest.mock('fs');
jest.mock('../../src/io');

import fs from 'fs';
import { join } from 'path';
import { SightCategory, VehicleType } from '@monkvision/types';
import * as io from '../../src/io';
import { validateAdditionalRules } from '../../src/validate/additionalValidation';
import { pathsEqual } from '../test.utils';

describe('Additional validation module', () => {
  let testSights: any;

  beforeEach(() => {
    testSights = {
      sight1: {
        id: 'sight1',
        category: SightCategory.EXTERIOR,
        label: 'label-key-1',
        overlay: 'overlay-1.svg',
        vehicle_type: VehicleType.AUDIA7,
        mirror_sight: 'sight2',
      },
      sight2: {
        id: 'sight2',
        category: SightCategory.INTERIOR,
        label: 'label-key-2',
        overlay: 'overlay-2.svg',
        vehicle_type: VehicleType.AUDIA7,
        mirror_sight: 'sight1',
      },
    };

    fs.existsSync = jest.fn().mockImplementation(() => true);

    jest.spyOn(io, 'readDir').mockImplementation((path: string) => {
      if (pathsEqual(path, join(__dirname, '../../research/data'))) {
        return {
          files: [],
          directories: [VehicleType.AUDIA7],
        };
      }
      return {
        files: [],
        directories: [],
      };
    });

    jest.spyOn(io, 'loadJSON').mockImplementation((path) => {
      if (
        pathsEqual(
          path as string,
          join(__dirname, `../../research/data/${VehicleType.AUDIA7}/${VehicleType.AUDIA7}.json`),
        )
      ) {
        return testSights;
      }
      return null;
    });

    fs.readFileSync = jest.fn().mockImplementation(() => '');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateAdditionalRules function', () => {
    it('should pass the tests with the basic beforeEach configuration', () => {
      expect(() => validateAdditionalRules(false)).not.toThrow();
    });

    it('should check for missing vehicle type directories', () => {
      const missingVehicleType = VehicleType.AUDIA7;
      jest.spyOn(io, 'readDir').mockImplementation(() => ({
        files: [],
        directories: [],
      }));
      fs.existsSync = jest
        .fn()
        .mockImplementation(
          (path: string) =>
            !pathsEqual(path, join(__dirname, `../../research/data/${missingVehicleType}`)),
        );

      expect(() => validateAdditionalRules(false)).toThrow();
    });

    it('should check for missing vehicle type JSON files', () => {
      const missingVehicleType = VehicleType.FFOCUS18;
      jest.spyOn(io, 'readDir').mockImplementation(() => ({
        files: [],
        directories: [],
      }));
      fs.existsSync = jest
        .fn()
        .mockImplementation(
          (path: string) =>
            !pathsEqual(
              path,
              join(
                __dirname,
                `../../research/data/${missingVehicleType}/${missingVehicleType}.json`,
              ),
            ),
        );

      expect(() => validateAdditionalRules(false)).toThrow();
    });

    it('should check for unknown directories', () => {
      const unknownDirectory = 'hello';
      fs.existsSync = jest.fn().mockImplementation(() => true);
      jest.spyOn(io, 'readDir').mockImplementation((path: string) => {
        if (pathsEqual(path, join(__dirname, '../../research/data'))) {
          return {
            files: [],
            directories: [...Object.values(VehicleType), unknownDirectory],
          };
        }
        return {
          files: [],
          directories: [],
        };
      });

      expect(() => validateAdditionalRules(false)).toThrow();
    });

    it('should check for unknown files', () => {
      const vehicleType = VehicleType.JGC21;
      const unknownFile = 'test.txt';
      fs.existsSync = jest.fn().mockImplementation(() => true);
      jest.spyOn(io, 'readDir').mockImplementation((path: string) => {
        if (pathsEqual(path, join(__dirname, '../../research/data'))) {
          return {
            files: [],
            directories: [...Object.values(VehicleType)],
          };
        }
        if (pathsEqual(path, join(__dirname, `../../research/data/${vehicleType}`))) {
          return {
            files: [`${vehicleType}.json`, `${vehicleType}.schema.json`, unknownFile],
            directories: [],
          };
        }
        return {
          files: [],
          directories: [],
        };
      });

      expect(() => validateAdditionalRules(false)).toThrow();
    });

    it('should check for missing mirror sights', () => {
      testSights.sight1.mirror_sight = undefined;

      expect(() => validateAdditionalRules(false)).toThrow();
    });

    it('should check for invalid mirror sights', () => {
      testSights.sight1.mirror_sight = 'unknown';

      expect(() => validateAdditionalRules(false)).toThrow();
    });

    it('should check for missing overlays', () => {
      fs.existsSync = jest
        .fn()
        .mockImplementation(
          (path) =>
            !pathsEqual(
              path as string,
              join(
                __dirname,
                `../../research/data/${VehicleType.AUDIA7}/overlays/${testSights.sight1.overlay}`,
              ),
            ),
        );

      expect(() => validateAdditionalRules(false)).toThrow();
    });

    it('should check for not minified overlays', () => {
      fs.readFileSync = jest.fn().mockImplementation((path) => {
        if (
          pathsEqual(
            path as string,
            join(
              __dirname,
              `../../research/data/${VehicleType.AUDIA7}/overlays/${testSights.sight1.overlay}`,
            ),
          )
        ) {
          return '<svg>\nblabla\n</svg>';
        }
        return '';
      });

      expect(() => validateAdditionalRules(false)).toThrow();
    });

    it('should check for unused overlays', () => {
      jest.spyOn(io, 'readDir').mockImplementation((path: string) => {
        if (pathsEqual(path, join(__dirname, '../../research/data'))) {
          return {
            files: [],
            directories: [VehicleType.AUDIA7],
          };
        }
        if (
          pathsEqual(path, join(__dirname, `../../research/data/${VehicleType.AUDIA7}/overlays`))
        ) {
          return {
            files: ['unknownFile.svg'],
            directories: [],
          };
        }
        return {
          files: [],
          directories: [],
        };
      });

      expect(() => validateAdditionalRules(false)).toThrow();
    });
  });
});
