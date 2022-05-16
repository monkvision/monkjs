import { readFileSync } from 'fs';
import { camelCase, snakeCase } from 'lodash';
import YAML from 'yaml';
import { CaseMapping } from './config';

type OpenAPIParser = (string) => unknown;
export type Schemas = { [key: string]: unknown };

interface OpenAPISpec {
  components: {
    schemas: Schemas,
  }
}

export default function parseAndProcessSchemas(path: string, caseMapping: CaseMapping): Schemas {
  const parse = getParser(path);
  const rawFile = readFileSync(path, { encoding: 'utf8' });
  const openapi = parse(rawFile);
  if (!isOpenAPIValid(openapi)) {
    throw new Error('Invalid OpenAPI specifiation : Unable to find #/components/schemas path to locate type definitions.');
  }
  let schemas = openapi.components.schemas;
  schemas = removeUneccessaryTitles(schemas) as Schemas;
  schemas = updateReferencePaths(schemas) as Schemas;
  return caseMapping === CaseMapping.NONE ? schemas : changePropertyCase(schemas, caseMapping) as Schemas;
}

function parseOpenApiJsonFile(rawData: string): unknown {
  return JSON.parse(rawData);
}

function parseOpenApiYamlFile(rawData: string): unknown {
  return YAML.parse(rawData);
}

function getParser(path: string): OpenAPIParser {
  if (path.toLowerCase().endsWith('.json')) {
    return parseOpenApiJsonFile;
  }
  if (path.toLowerCase().endsWith('.yaml') || path.toLowerCase().endsWith('.yml')) {
    return parseOpenApiYamlFile;
  }
  throw new Error('Unsupported file extension : The OpenAPI specifiation file must either have a JSON or YAML file extension.');
}

function isOpenAPIValid(parsedFile: unknown): parsedFile is OpenAPISpec {
  return !!(parsedFile as OpenAPISpec)?.components?.schemas;
}

function containsTitle(obj: unknown): obj is { title: unknown } {
  return !!obj && !!(obj as { title: unknown }).title;
}

function removeUneccessaryTitles(obj: unknown, depth = 0): unknown {
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      obj[i] = removeUneccessaryTitles(obj[i], depth + 1);
    }
  } else if (typeof obj === 'object') {
    if (depth !== 1 && containsTitle(obj)) {
      delete obj.title;
    }
    Object.entries(obj).forEach(([key, value]) => {
      Object.assign(obj, {
        [key]: removeUneccessaryTitles(value, depth + 1),
      });
    });
  }
  return obj;
}

function updateReferencePaths(obj: unknown): unknown {
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      obj[i] = updateReferencePaths(obj[i]);
    }
  } else if (typeof obj === 'object') {
    Object.entries(obj).forEach(([key, value]) => {
      let updatedValue;
      if (key === '$ref' && typeof value === 'string') {
        const match = /([^\/]+)$/.exec(value);
        if (!match || match.length < 2) {
          throw new Error(`Invalid JSON $ref property : ${value}`);
        }
        updatedValue = `./${match[1]}.json`;
      } else {
        updatedValue = updateReferencePaths(value);
      }
      Object.assign(obj, {
        [key]: updatedValue as unknown,
      });
    });
  }
  return obj;
}

function changePropertyCase(obj: unknown, caseMapping: CaseMapping, parentKey = ''): unknown {
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      obj[i] = changePropertyCase(obj[i], caseMapping);
    }
  } else if (typeof obj === 'object') {
    Object.entries(obj).forEach(([key, value]) => {
      const newKey = parentKey !== 'properties' ? key :
        caseMapping === CaseMapping.CAMEL_CASE ? camelCase(key) :
          caseMapping === CaseMapping.SNAKE_CASE ? snakeCase(key) : key;
      if (caseMapping !== CaseMapping.NONE) {
        delete obj[key];
      }
      Object.assign(obj, {
        [newKey]: changePropertyCase(value, caseMapping, newKey),
      });
    });
  }
  return obj;
}
