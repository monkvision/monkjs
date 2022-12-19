import { JSONValidator } from './validator';
import { validateAdditionalRules } from './additionalValidation';

export function validate(): void {
  const jsonValidator = new JSONValidator();

  console.log('🔬️ Validating research data...');
  jsonValidator.validateAllFiles();

  console.log('🔍 Additional validation...');
  validateAdditionalRules();
}
