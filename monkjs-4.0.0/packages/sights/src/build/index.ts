import { buildJSONs } from './buildJSONs';
import { generateData, generateIndex } from './generateTypeScript';

export function build(): void {
  console.log('📂 Building JSON files...');
  buildJSONs();
  console.log('🛠️ Generating TypeScript files...');
  generateIndex();
  generateData();
}
