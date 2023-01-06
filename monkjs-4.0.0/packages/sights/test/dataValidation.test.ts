import { validate } from '../src/validate';

describe('Monk Research Data', () => {
  it('should respect the validation rules', () => {
    expect(() => validate()).not.toThrow();
  });
});
