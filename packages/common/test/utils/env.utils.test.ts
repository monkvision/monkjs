import { getEnvOrThrow } from '../../src';

describe('Env utils', () => {
  describe('getEnvOrThrow util function', () => {
    it('should return the value if it is defined in the environment', () => {
      const name = 'TEST_VAR_NAME_1';
      const value = 'test value';
      Object.defineProperty(global.process.env, name, { value });

      expect(getEnvOrThrow(name)).toEqual(value);
    });

    it('should throw if the environment variable is not defined', () => {
      const name = 'TEST_VAR_NAME_2';
      Object.defineProperty(global.process.env, name, { value: undefined });

      expect(() => getEnvOrThrow(name)).toThrow();
    });

    it('should throw if the environment variable is empty', () => {
      const name = 'TEST_VAR_NAME_3';
      Object.defineProperty(global.process.env, name, { value: '' });

      expect(() => getEnvOrThrow(name)).toThrow();
    });
  });
});
