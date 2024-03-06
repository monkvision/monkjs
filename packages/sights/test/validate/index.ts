const validateAllFilesMock = jest.fn();
class JSONValidatorMock {
  validateAllFiles() {
    validateAllFilesMock();
  }
}
jest.mock('../../src/validate/additionalValidation', () => ({
  JSONValidator: JSONValidatorMock,
}));

const validateAdditionalRulesMock = jest.fn();
jest.mock('../../src/validate/additionalValidation', () => ({
  validateAdditionalRules: validateAdditionalRulesMock,
}));

import { validate } from '../../src/validate';

describe('Validate function', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new JSONValidator and validate the JSON files', () => {
    validate();

    expect(validateAllFilesMock).toHaveBeenCalled();
  });

  it('should call the validateAdditionalRules function', () => {
    validate();

    expect(validateAdditionalRulesMock).toHaveBeenCalled();
  });
});
