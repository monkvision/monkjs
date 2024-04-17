global.console = {
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
} as any;

import { EmptyAnalyticsAdapter } from '../../src';

interface ConsoleSpy {
  debug: jest.SpyInstance | null;
  info: jest.SpyInstance | null;
  warn: jest.SpyInstance | null;
  error: jest.SpyInstance | null;
}

describe('Empty Analytics Adapter', () => {
  const consoleSpy: ConsoleSpy = {
    debug: jest.spyOn(global.console, 'debug'),
    info: jest.spyOn(global.console, 'info'),
    warn: jest.spyOn(global.console, 'warn'),
    error: jest.spyOn(global.console, 'error'),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('setUserId function', () => {
    it('should display a warning in the console when used', () => {
      const adapter = new EmptyAnalyticsAdapter();
      adapter.setUserId('test id');
      expect(consoleSpy.warn).toHaveBeenCalled();
    });

    it('should not display a warning in the console is showUnsupportedMethodWarnings is set to false', () => {
      const adapter = new EmptyAnalyticsAdapter({ showUnsupportedMethodWarnings: false });
      adapter.setUserId('test id');
      expect(consoleSpy.warn).not.toHaveBeenCalled();
    });
  });

  describe('setUserProperties function', () => {
    it('should display a warning in the console when used', () => {
      const adapter = new EmptyAnalyticsAdapter();
      adapter.setUserProperties({ token: 'test msg' });
      expect(consoleSpy.warn).toHaveBeenCalled();
    });

    it('should not display a warning in the console is showUnsupportedMethodWarnings is set to false', () => {
      const adapter = new EmptyAnalyticsAdapter({ showUnsupportedMethodWarnings: false });
      adapter.setUserProperties({ token: 'test msg' });
      expect(consoleSpy.warn).not.toHaveBeenCalled();
    });
  });

  describe('reset function', () => {
    it('should display a warning in the console when used', () => {
      const adapter = new EmptyAnalyticsAdapter();
      adapter.resetUser();
      expect(consoleSpy.warn).toHaveBeenCalled();
    });

    it('should not display a warning in the console is showUnsupportedMethodWarnings is set to false', () => {
      const adapter = new EmptyAnalyticsAdapter({ showUnsupportedMethodWarnings: false });
      adapter.resetUser();
      expect(consoleSpy.warn).not.toHaveBeenCalled();
    });
  });

  describe('trackEvent function', () => {
    it('should display a warning in the console when used', () => {
      const adapter = new EmptyAnalyticsAdapter();
      adapter.trackEvent('test event', { test: 'test properties' });
      expect(consoleSpy.warn).toHaveBeenCalled();
    });

    it('should not display a warning in the console is showUnsupportedMethodWarnings is set to false', () => {
      const adapter = new EmptyAnalyticsAdapter({ showUnsupportedMethodWarnings: false });
      adapter.trackEvent('test event', { test: 'test properties' });
      expect(consoleSpy.warn).not.toHaveBeenCalled();
    });
  });

  describe('setEventsProperties function', () => {
    it('should display a warning in the console when used', () => {
      const adapter = new EmptyAnalyticsAdapter();
      adapter.setEventsProperties({ test: 'test properties' });
      expect(consoleSpy.warn).toHaveBeenCalled();
    });

    it('should not display a warning in the console is showUnsupportedMethodWarnings is set to false', () => {
      const adapter = new EmptyAnalyticsAdapter({ showUnsupportedMethodWarnings: false });
      adapter.setEventsProperties({ test: 'test properties' });
      expect(consoleSpy.warn).not.toHaveBeenCalled();
    });
  });
});
