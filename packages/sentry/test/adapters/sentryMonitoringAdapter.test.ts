import * as Sentry from '@sentry/react';
import { SentryMonitoringAdapter } from '../../src/adapters/sentryMonitoringAdapter';

jest.mock('@sentry/react');

const defaultConfiguration = {
  dsn: 'https://9daf5f76b1d7190d75eb25f7cafea2f2@o4505568095109120.ingest.sentry.io/4505662672076810',
  environment: 'test',
  debug: true,
  release: '1.0',
  tracesSampleRate: 0.025,
}

describe('Sentry Monitoring Adapter', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('setUserId function', () => {
    it('should set a user id in sentry', () => {
      const adapter = new SentryMonitoringAdapter(defaultConfiguration);
      adapter.setUserId('test id');
      expect(Sentry.setUser).toHaveBeenCalled();
      expect(Sentry.setUser).toHaveBeenCalledWith({ id: 'test id' });
    });
  });

  describe('log function', () => {
    it('should log a message in sentry', () => {
      const adapter = new SentryMonitoringAdapter(defaultConfiguration);
      adapter.log('test log');
      expect(Sentry.captureMessage).toHaveBeenCalled();
      expect(Sentry.captureMessage).toHaveBeenCalledWith('test log', undefined);
    });
  });

  describe('handleError function', () => {
    it('should log a message in sentry', () => {
      const adapter = new SentryMonitoringAdapter(defaultConfiguration);
      adapter.handleError('test error');
      expect(Sentry.captureException).toHaveBeenCalled();
      expect(Sentry.captureException).toHaveBeenCalledWith('test error', undefined);
    });
  });

  // describe('createTransaction function', () => {
    // it('should create a dummy transaction', () => {
    //   const adapter = new SentryMonitoringAdapter(defaultConfiguration);
    //   const transaction = adapter.createTransaction({
    //     name: 'capture-tour',
    //     operation: 'capture-tour'
    //   });

    //   expect(() => {
    //     transaction.setTag('test', 'value');
    //     transaction.startMeasurement('test');
    //     transaction.stopMeasurement('test');
    //     transaction.finish('test');
    //   }).not.toThrow();
    // });
  // });
});
