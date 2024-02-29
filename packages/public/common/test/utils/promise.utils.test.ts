import { timeoutPromise } from '../../src';

describe('Promise utils', () => {
  describe('timeoutPromise util function', () => {
    it('should create a promise that resolves after the specified delay', async () => {
      const delay = 1000;
      const startTime = Date.now();
      await timeoutPromise(delay);
      const actualDelay = Date.now() - startTime;
      expect(actualDelay).toBeGreaterThanOrEqual(delay);
      expect(actualDelay).toBeLessThan(delay + 10);
    });
  });
});
