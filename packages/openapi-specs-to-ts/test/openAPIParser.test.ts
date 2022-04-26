import * as fs from 'fs';
import * as YAML from 'yaml';
import { CaseMapping } from '../src/config';
import parseAndProcessSchemas from '../src/openAPIParser';

jest.mock('fs');

function mockReadFileSync(data: string) {
  return jest.spyOn(fs, 'readFileSync').mockImplementation(() => data);
}

afterEach(() => {
  jest.clearAllMocks();
});

describe('Type Translator', () => {
  describe('#generateTypes', () => {
    const defaultReadWriteOptions = { encoding: 'utf8' };

    it('should throw if the file extension is unknown', () => {
      const path = 'testFile.txt';

      expect(() => parseAndProcessSchemas(path, CaseMapping.NONE)).toThrow(Error);
    });

    it('should throw if the given OpenAPI does not have a #/components/schemas path', () => {
      const path = 'testFile.yaml';
      const spy = mockReadFileSync(YAML.stringify({
        components: {
          test: 'test',
        },
      }));

      expect(() => parseAndProcessSchemas(path, CaseMapping.NONE)).toThrow(Error);
      expect(spy).toHaveBeenCalledWith(path, defaultReadWriteOptions);
    });

    it('should remove unecessary titles', () => {
      const path = 'testFile.yaml';
      const mockSchema = {
        components: {
          schemas: {
            MyObject: {
              title: 'MyObject',
              type: 'object',
              properties: {
                foo: {
                  title: 'Foo',
                  type: 'integer',
                },
              },
            },
          },
        },
      };
      const spy = mockReadFileSync(YAML.stringify(mockSchema));

      const schemas = parseAndProcessSchemas(path, CaseMapping.NONE);

      const expectedSchemas = mockSchema.components.schemas;
      delete expectedSchemas.MyObject.properties.foo.title;
      expect(schemas).toMatchObject(expectedSchemas);
      expect(spy).toHaveBeenCalledWith(path, defaultReadWriteOptions);
    });

    it('should update reference paths', () => {
      const path = 'testFile.json';
      const mockSchema = {
        components: {
          schemas: {
            MyObject: {
              title: 'MyObject',
              type: 'object',
              properties: {
                foo: {
                  $ref: '#/components/schemas/Foo',
                },
              },
            },
          },
        },
      };
      const spy = mockReadFileSync(JSON.stringify(mockSchema));

      const schemas = parseAndProcessSchemas(path, CaseMapping.NONE);

      const expectedSchemas = mockSchema.components.schemas;
      expectedSchemas.MyObject.properties.foo.$ref = './Foo.json';
      expect(schemas).toMatchObject(expectedSchemas);
      expect(spy).toHaveBeenCalledWith(path, defaultReadWriteOptions);
    });

    it('should throw if a $ref property is not properly formatted', () => {
      const path = 'testFile.yml';
      const mockSchema = {
        components: {
          schemas: {
            MyObject: {
              title: 'MyObject',
              type: 'object',
              properties: {
                foo: {
                  $ref: '#/components/schemas/Foo/',
                },
              },
            },
          },
        },
      };
      const spy = mockReadFileSync(YAML.stringify(mockSchema));

      expect(() => parseAndProcessSchemas(path, CaseMapping.NONE)).toThrow(Error);
      expect(spy).toHaveBeenCalledWith(path, defaultReadWriteOptions);
    });

    it('should transform the property names into snake case', () => {
      const path = 'testFile.json';
      const mockSchema = {
        components: {
          schemas: {
            MyObject: {
              title: 'MyObject',
              type: 'object',
              properties: {
                fooBar: 'fooBar',
              },
            },
          },
        },
      };
      const spy = mockReadFileSync(JSON.stringify(mockSchema));

      const schemas = parseAndProcessSchemas(path, CaseMapping.SNAKE_CASE);

      const expectedSchemas = mockSchema.components.schemas;
      Object.assign(expectedSchemas.MyObject.properties, {
        foo_bar: expectedSchemas.MyObject.properties.fooBar,
      });
      delete expectedSchemas.MyObject.properties.fooBar;
      expect(schemas).toMatchObject(expectedSchemas);
      expect(spy).toHaveBeenCalledWith(path, defaultReadWriteOptions);
    });

    it('should transform the property names into camel case', () => {
      const path = 'testFile.json';
      const mockSchema = {
        components: {
          schemas: {
            MyObject: {
              title: 'MyObject',
              type: 'object',
              properties: {
                foo_bar: 'foo_bar',
              },
            },
          },
        },
      };
      const spy = mockReadFileSync(JSON.stringify(mockSchema));

      const schemas = parseAndProcessSchemas(path, CaseMapping.CAMEL_CASE);

      const expectedSchemas = mockSchema.components.schemas;
      Object.assign(expectedSchemas.MyObject.properties, {
        fooBar: expectedSchemas.MyObject.properties.foo_bar,
      });
      delete expectedSchemas.MyObject.properties.foo_bar;
      expect(schemas).toMatchObject(expectedSchemas);
      expect(spy).toHaveBeenCalledWith(path, defaultReadWriteOptions);
    });
  });
});
