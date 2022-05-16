import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

export enum CaseMapping {
  NONE,
  CAMEL_CASE,
  SNAKE_CASE,
}

export interface Config {
  input: string,
  outdir: string,
  useDeclaration: boolean,
  caseMapping: CaseMapping,
}

export default function getConfig(processArgv: string[]): Config {
  const argv = yargs(hideBin(processArgv))
    .option('input', {
      alias: 'i',
      type: 'string',
      description: 'The input file (OpenAPI specification file in JSON or YAML format)',
      requiresArg: true,
    }).option('outdir', {
      alias: 'o',
      type: 'string',
      description: 'The output directory where to generate the type definitions',
      default: 'types',
      requiresArg: true,
    }).option('useDeclaration', {
      alias: 'D',
      description: 'Generate output files as *.d.ts instead of normal typescript files',
      defaultDescription: 'false',
    }).option('camelCase', {
      alias: 'C',
      description: 'Map every property key to camelCase.',
      defaultDescription: 'false',
      conflicts: ['snakeCase'],
    }).option('snakeCase', {
      alias: 'S',
      description: 'Map every property key to snake_case.',
      defaultDescription: 'false',
      conflicts: ['camelCase'],
    }).demandOption('input')
    .help()
    .parseSync();

  const caseMapping = !!argv.camelCase ? CaseMapping.CAMEL_CASE :
    !!argv.snakeCase ? CaseMapping.SNAKE_CASE : CaseMapping.NONE;

  return {
    input: argv.input,
    outdir: argv.outdir,
    useDeclaration: !!argv.useDeclaration,
    caseMapping,
  };
}
