global.console = {
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
} as any;

import { Severity, DebugMonitoringAdapter } from '../../src';

interface ConsoleSpy {
  debug: jest.SpyInstance | null;
  info: jest.SpyInstance | null;
  warn: jest.SpyInstance | null;
  error: jest.SpyInstance | null;
}

describe('Debug Monitoring Adapter', () => {
  const adapter = new DebugMonitoringAdapter();
  const consoleSpy: ConsoleSpy = {
    debug: jest.spyOn(global.console, 'debug'),
    info: jest.spyOn(global.console, 'info'),
    warn: jest.spyOn(global.console, 'warn'),
    error: jest.spyOn(global.console, 'error'),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('log function', () => {
    it('should log elements to console.info by default', () => {
      const msg = 'test info default';
      adapter.log(msg);
      expect(consoleSpy.info).toHaveBeenCalledWith(msg);
    });

    it('should be able to log elements to console.debug', () => {
      const msg = 'test debug';
      adapter.log(msg, Severity.DEBUG);
      expect(consoleSpy.debug).toHaveBeenCalledWith(msg);
    });

    it('should be able to log elements to console.info', () => {
      const msg = 'test info';
      adapter.log(msg, Severity.INFO);
      expect(consoleSpy.info).toHaveBeenCalledWith(msg);
    });

    it('should be able to log elements to console.warn', () => {
      const msg = 'test warn';
      adapter.log(msg, Severity.WARNING);
      expect(consoleSpy.warn).toHaveBeenCalledWith(msg);
    });

    it('should be able to log elements to console.error', () => {
      const msg = 'test error';
      adapter.log(msg, Severity.ERROR);
      expect(consoleSpy.error).toHaveBeenCalledWith(msg);
    });

    it('should be able to log elements with extras without specified severity', () => {
      const msg = 'test default extras';
      const extras = { test: 'default extra' };
      adapter.log(msg, { extras });
      expect(consoleSpy.info).toHaveBeenCalledWith(msg, extras);
    });

    it('should be able to log elements with extras to console.debug', () => {
      const msg = 'test debug extras';
      const extras = { test: 'debug extra' };
      adapter.log(msg, {
        level: Severity.DEBUG,
        extras,
      });
      expect(consoleSpy.debug).toHaveBeenCalledWith(msg, extras);
    });

    it('should be able to log elements with extras to console.info', () => {
      const msg = 'test info extras';
      const extras = { test: 'info extra' };
      adapter.log(msg, {
        level: Severity.INFO,
        extras,
      });
      expect(consoleSpy.info).toHaveBeenCalledWith(msg, extras);
    });

    it('should be able to log elements with extras to console.warn', () => {
      const msg = 'test warn extras';
      const extras = { test: 'warn extra' };
      adapter.log(msg, {
        level: Severity.WARNING,
        extras,
      });
      expect(consoleSpy.warn).toHaveBeenCalledWith(msg, extras);
    });

    it('should be able to log elements with extras to console.error', () => {
      const msg = 'test error extras';
      const extras = { test: 'error extra' };
      adapter.log(msg, {
        level: Severity.ERROR,
        extras,
      });
      expect(consoleSpy.error).toHaveBeenCalledWith(msg, extras);
    });

    it('should ignore tags during logging', () => {
      const msg = 'test tags';
      adapter.log(msg, {
        tags: { test: 2 },
      });
      expect(consoleSpy.info).toHaveBeenCalledWith(msg);
    });
  });

  describe('handleError function', () => {
    it('should log the error', () => {
      const err = new Error('test 1');
      adapter.handleError(err);
      expect(consoleSpy.error).toHaveBeenCalledWith(err);
    });

    it('should log the error with extras', () => {
      const err = new Error('test 2');
      const extras = { test: 'handle error extra' };
      adapter.handleError(err, { extras });
      expect(consoleSpy.error).toHaveBeenCalledWith(err, extras);
    });

    it('should ignore tags while handling the error', () => {
      const err = new Error('test 3');
      adapter.handleError(err, {
        tags: { test: 'error test tags' },
      });
      expect(consoleSpy.error).toHaveBeenCalledWith(err);
    });
  });
});
