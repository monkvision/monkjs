import * as Sentry from '@sentry/react';
import { SentryMonitoringAdapter } from '../../src';

jest.mock('@sentry/react');

const defaultConfiguration = {
  dsn: 'https://db38973466bcef38767064fd025e20c6@o4505669501648896.ingest.sentry.io/4505673881092096',
  environment: 'test',
  debug: true,
  release: '1.0',
  tracesSampleRate: 0.025,
};

describe('Sentry Monitoring Adapter', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('setUserId function', () => {
    it('should set a user id in sentry', () => {
      const adapter = new SentryMonitoringAdapter(defaultConfiguration);
      adapter.setUserId('test id');
      expect(Sentry.setUser).toHaveBeenCalledWith({ id: 'test id' });
    });
  });

  describe('log function', () => {
    it('should log a message in sentry', () => {
      const adapter = new SentryMonitoringAdapter(defaultConfiguration);
      adapter.log('test log');
      expect(Sentry.captureMessage).toHaveBeenCalledWith('test log', undefined);
    });
  });

  describe('handleError function', () => {
    it('should log a message in sentry', () => {
      const adapter = new SentryMonitoringAdapter(defaultConfiguration);
      adapter.handleError('test error');
      expect(Sentry.captureException).toHaveBeenCalledWith('test error', undefined);
    });
  });

  describe('createTransaction function', () => {
    it('should create a dummy sentry transaction', () => {
      const adapter = new SentryMonitoringAdapter(defaultConfiguration);
      adapter.createTransaction({
        name: 'capture-tour',
        operation: 'capture-tour',
        description: 'Capture tour description',
      });

      expect(Sentry.startTransaction).toHaveBeenCalledWith({
        name: 'capture-tour',
        op: 'capture-tour',
        description: 'Capture tour description',
        data: {},
        traceId: '',
        tags: {},
        sampled: true,
      });
    });
  });
});
