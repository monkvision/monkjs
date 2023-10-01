jest.mock('fs', () => {
  const mockedFs = jest.createMockFromModule('fs') as any;
  const actualFs = jest.requireActual('fs');

  return {
    __esModules: true,
    ...mockedFs,
    readFileSync: actualFs.readFileSync,
  };
});

import fs, { readFileSync } from 'fs';
import { join } from 'path';
import { VehicleType } from '@monkvision/types';
import { generateData, generateIndex } from '../../src/build/generateTypeScript';
import { pathsEqual } from '../test.utils';

describe('TypeScript generation module', () => {
  const indexTemplate = readFileSync(join(__dirname, '../../src/templates/index.ts.template'), {
    encoding: 'utf-8',
  });
  const dataTemplate = readFileSync(join(__dirname, '../../src/templates/data.ts.template'), {
    encoding: 'utf-8',
  });
  const dataImportKeyword = '###__IMPORT_VEHICLE_SIGHTS__###';
  const dataExportKeyword = '###__EXPORT_VEHICLE_SIGHTS__###';
  let importStatements = '';
  let exportStatements = '';
  Object.entries(VehicleType).forEach(([key, vehicleType]) => {
    importStatements += `import ${vehicleType}JSON from './data/sights/${vehicleType}.json';\n`;
    exportStatements += `  [VehicleType.${key}]: ${
      VehicleType[key as keyof typeof VehicleType]
    }JSON as SightDictionary,\n`;
  });
  let writeFileSpy: jest.SpyInstance;

  beforeEach(() => {
    writeFileSpy = jest.spyOn(fs, 'writeFileSync');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generateIndex function', () => {
    it('should generate the index file using the index template', () => {
      generateIndex();

      expect(writeFileSpy).toHaveBeenCalledTimes(1);
      expect(writeFileSpy).toHaveBeenCalledWith(expect.anything(), indexTemplate, {
        encoding: 'utf-8',
      });
    });

    it('should generate the index file in the lib directory', () => {
      generateIndex();

      expect(
        pathsEqual(
          writeFileSpy.mock.calls[0][0] as string,
          join(__dirname, '../../src/lib/index.ts'),
        ),
      ).toBe(true);
    });
  });

  describe('generateData function', () => {
    it('should generate the data file using the data template', () => {
      generateData();

      expect(writeFileSpy).toHaveBeenCalledTimes(1);
      expect(writeFileSpy).toHaveBeenCalledWith(
        expect.anything(),
        dataTemplate
          .replaceAll(dataImportKeyword, importStatements)
          .replaceAll(dataExportKeyword, exportStatements),
        {
          encoding: 'utf-8',
        },
      );
    });

    it('should generate the index file in the lib directory', () => {
      generateData();

      expect(
        pathsEqual(
          writeFileSpy.mock.calls[0][0] as string,
          join(__dirname, '../../src/lib/data.ts'),
        ),
      ).toBe(true);
    });
  });
});
