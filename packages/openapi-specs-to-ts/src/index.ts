import getConfig from './config';
import parseAndProcessSchemas from './openAPIParser';
import { generateTypes } from './typeTranslator';

const config = getConfig(process.argv);

const schemas = parseAndProcessSchemas(config.input, config.caseMapping);
generateTypes(schemas, config.outdir, config.useDeclaration).then(
  () => console.log('Done.'),
).catch(err => { throw err; });
