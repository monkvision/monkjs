import { JSONValidator } from './validator';
import { validateAdditionalRules } from './additionalValidation';

const logs = process.env['NODE_ENV'] !== 'test';

export function validate(): void {
  const jsonValidator = new JSONValidator();

  if (logs) {
    console.log('🔬️ Validating research data...');
  }
  jsonValidator.validateAllFiles();

  if (logs) {
    console.log('🔍 Additional validation...');
  }
  validateAdditionalRules();
}
