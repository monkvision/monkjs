import { join } from 'path';
import { AnySchema } from 'ajv';
import { loadJSON, MONK_DATA_PATH, MONK_SCHEMAS_PATH, readDir } from '../io';

const SCHEMA_FILE_EXTENSION = '.schema.json';

interface SchemaFile {
  fileName: string;
  path: string;
}

export interface Schema {
  key: string;
  data: AnySchema;
}

export type SchemaSet = Record<string, AnySchema>;

function findSchemasInDirectory(path: string): SchemaFile[] {
  return readDir(path)
    .files.filter((fileName) => fileName.endsWith(SCHEMA_FILE_EXTENSION))
    .map((fileName) => ({
      fileName,
      path: join(path, fileName),
    }));
}

function loadSchema(schemaFile: SchemaFile): Schema {
  return {
    key: schemaFile.fileName.substring(
      0,
      schemaFile.fileName.length - SCHEMA_FILE_EXTENSION.length,
    ),
    data: loadJSON(schemaFile.path) as AnySchema,
  };
}

function loadMonkSchemas(): Schema[] {
  return [
    ...findSchemasInDirectory(MONK_SCHEMAS_PATH),
    ...findSchemasInDirectory(join(MONK_SCHEMAS_PATH, 'subschemas')),
  ].map(loadSchema);
}

function loadVehicleTypeSchemas(): Schema[] {
  return readDir(MONK_DATA_PATH)
    .directories.map((vehicleType) => findSchemasInDirectory(join(MONK_DATA_PATH, vehicleType)))
    .flat()
    .map(loadSchema);
}

export function loadSchemas(): SchemaSet {
  return [...loadMonkSchemas(), ...loadVehicleTypeSchemas()].reduce(
    (prev: SchemaSet, curr) => ({
      ...prev,
      [curr.key]: curr.data,
    }),
    {},
  );
}
