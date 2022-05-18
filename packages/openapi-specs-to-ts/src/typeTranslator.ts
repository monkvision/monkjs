import { existsSync, mkdirSync, rmSync, writeFileSync } from 'fs';
import Path from 'path';
import { compileFromFile, Options } from 'json-schema-to-typescript';
import { camelCase } from 'lodash';
import { Schemas } from './openAPIParser';

export const tempDir = 'temp';
const json2tsOptions: Partial<Options> = {
  bannerComment: '',
  cwd: tempDir,
  declareExternallyReferenced: false,
  ignoreMinAndMaxItems: true,
  style: {
    singleQuote: true,
    arrowParens: 'always',
    trailingComma: 'es5',
  },
};

export async function generateTypes(schemas: Schemas, outdir: string, useDeclarations: boolean): Promise<void> {
  try {
    writeTempSchemaFiles(schemas);
    createDirIfNotExists(outdir);
    await generateOutputFiles(schemas, outdir, useDeclarations);
  } finally {
    cleanUpTempFiles();
  }
}

function createDirIfNotExists(outdir: string): void {
  if (!existsSync(outdir)) {
    mkdirSync(outdir, { recursive: true });
  }
}

function writeTempSchemaFiles(schemas: Schemas): void {
  createDirIfNotExists(tempDir);
  Object.entries(schemas).forEach(([name, schema]) => {
    const tempPath = getTempFilePath(name);
    writeFileSync(tempPath, JSON.stringify(schema), { encoding: 'utf8' });
  });
}

function getTempFilePath(schemaName: string): string {
  return Path.join(tempDir, `${schemaName}.json`);
}

function cleanUpTempFiles(): void {
  if (existsSync(tempDir)) {
    rmSync(tempDir, { recursive: true, force: true });
  }
}

function getOutputFileName(schemaName: string, useDeclarations: boolean, addExtension = true): string {
  const extension = useDeclarations ? '.d.ts' : '.ts';
  return `${camelCase(schemaName)}${addExtension ? extension : ''}`;
}

function getOutputFilePath(schemaName: string, outdir: string, useDeclarations: boolean): string {
  return Path.join(outdir, getOutputFileName(schemaName, useDeclarations));
}

function generateOutputFiles(schemas: Schemas, outdir: string, useDeclarations: boolean): Promise<Awaited<void>[]> {
  const writePromises: Promise<void>[] = [];

  Object.entries(schemas).forEach(([name, schema]) => {
    const path = getOutputFilePath(name, outdir, useDeclarations);
    const promise = compileFromFile(
      getTempFilePath(name),
      json2tsOptions,
    ).then(typescriptCode => {
      const tsCodeWithImports = addImportStatements(typescriptCode, schema, useDeclarations);
      return writeFileSync(path, tsCodeWithImports, { encoding: 'utf8' });
    }).catch(err => {
      console.error(`Error while parsing JSON Schema for schema "${name}"`);
      throw err;
    });
    writePromises.push(promise);
  });

  return Promise.all(writePromises);
}

function addImportStatements(typescriptCode: string, schema: unknown, useDeclarations: boolean): string {
  let codeWithImports = typescriptCode;
  const externalRefs = getExternalReferences(schema);
  if (externalRefs.length > 0) {
    codeWithImports = '\n' + codeWithImports;
    externalRefs.sort()
      .reverse()
      .map(refName => getImportStatement(refName, useDeclarations))
      .forEach(importStatement => codeWithImports = importStatement + codeWithImports);
  }
  return codeWithImports;
}

function getExternalReferences(obj: unknown, refs: string[] = []): string[] {
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      getExternalReferences(obj[i], refs);
    }
  } else if (typeof obj === 'object') {
    Object.entries(obj).forEach(([key, value]) => {
      if (key === '$ref' && typeof value === 'string') {
        const match = /^.\/(.+).json$/.exec(value);
        if (!match || match.length < 2) {
          throw new Error(`Unexpected error : unable to parse external reference "${value}" for import statement.`);
        }
        if (!refs.includes(match[1])) {
          refs.push(match[1]);
        }
      } else {
        getExternalReferences(value, refs);
      }
    });
  }
  return refs;
}

function getImportStatement(refName: string, useDeclarations: boolean): string {
  const fileName = getOutputFileName(refName, useDeclarations, false);
  return `import { ${refName} } from './${fileName}';\n`;
}
