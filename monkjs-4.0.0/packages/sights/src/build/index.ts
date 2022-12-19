import { buildJSONs } from './buildJSONs';
import { generateTypeScript } from './generateTypeScript';

export function build(): void {
  console.log('📂 Building JSON files...');
  buildJSONs();
  console.log('🛠️ Generating TypeScript files...');
  generateTypeScript();
}
