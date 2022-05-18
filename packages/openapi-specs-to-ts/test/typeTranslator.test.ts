import * as fs from 'fs';
import * as Path from 'path';
import * as json2ts from 'json-schema-to-typescript';
import { generateTypes } from '../src/typeTranslator';

jest.mock('fs');
jest.mock('json-schema-to-typescript');

afterEach(() => {
  jest.clearAllMocks();
});

describe('Type Translator', () => {
  describe('#generateTypes', () => {
    const defaultReadWriteOptions = { encoding: 'utf8' };

    it('should throw if some reference is not properly formatted', async () => {
      const outdir = 'outdir';
      const schemas = {
        MyObject: {
          title: 'MyObject',
          type: 'object',
          properties: {
            foo: {
              $ref: 'badly formatted',
            },
          },
        },
      };
      const typescriptCode = 'code';
      jest.spyOn(fs, 'existsSync').mockImplementation(() => true);
      jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});
      jest.spyOn(fs, 'readFileSync').mockImplementation(() => JSON.stringify(schemas.MyObject));
      jest.spyOn(json2ts, 'compileFromFile').mockImplementation(() => Promise.resolve(typescriptCode));

      await expect(generateTypes(schemas, outdir, false)).rejects.toThrow(Error);
    });

    it('should not add import statements if there is no external ref in the schema', async () => {
      const outdir = 'outdir';
      const schemas = {
        MyObject: {
          title: 'MyObject',
          type: 'object',
          properties: {
            foo: {
              type: 'string',
            },
          },
        },
      };
      const typescriptCode = 'code';
      jest.spyOn(fs, 'existsSync').mockImplementation(() => true);
      const spy = jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});
      jest.spyOn(fs, 'readFileSync').mockImplementation(() => JSON.stringify(schemas.MyObject));
      jest.spyOn(json2ts, 'compileFromFile').mockImplementation(() => Promise.resolve(typescriptCode));

      await generateTypes(schemas, outdir, false);

      const expectedWritePath = Path.join(outdir, 'myObject.ts');
      expect(spy.mock.calls).toContainEqual(
        expect.arrayContaining([expectedWritePath, typescriptCode, defaultReadWriteOptions]),
      );
    });

    it('should add import statements if there are external refs in the schema', async () => {
      const outdir = 'outdir';
      const schemas = {
        MyObject: {
          title: 'MyObject',
          type: 'object',
          properties: {
            foo: {
              $ref: './MyRef.json',
            },
          },
        },
      };
      const typescriptCode = 'code';
      jest.spyOn(fs, 'existsSync').mockImplementation(() => true);
      const spy = jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});
      jest.spyOn(fs, 'readFileSync').mockImplementation(() => JSON.stringify(schemas.MyObject));
      jest.spyOn(json2ts, 'compileFromFile').mockImplementation(() => Promise.resolve(typescriptCode));

      await generateTypes(schemas, outdir, false);

      const expectedWritePath = Path.join(outdir, 'myObject.ts');
      const expectedTypescriptCode = `import { MyRef } from './myRef';\n\n${typescriptCode}`;
      expect(spy.mock.calls).toContainEqual(
        expect.arrayContaining([expectedWritePath, expectedTypescriptCode, defaultReadWriteOptions]),
      );
    });

    it('should add ".d" in the file name if the useDeclaration option is passed', async () => {
      const outdir = 'outdir';
      const schemas = {
        MyObject: {
          title: 'MyObject',
          type: 'object',
          properties: {
            foo: {
              type: 'string',
            },
          },
        },
      };
      const typescriptCode = 'code';
      jest.spyOn(fs, 'existsSync').mockImplementation(() => true);
      const spy = jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});
      jest.spyOn(fs, 'readFileSync').mockImplementation(() => JSON.stringify(schemas.MyObject));
      jest.spyOn(json2ts, 'compileFromFile').mockImplementation(() => Promise.resolve(typescriptCode));

      await generateTypes(schemas, outdir, true);

      const expectedWritePath = Path.join(outdir, 'myObject.d.ts');
      expect(spy.mock.calls).toContainEqual(
        expect.arrayContaining([expectedWritePath, typescriptCode, defaultReadWriteOptions]),
      );
    });
  });
});
