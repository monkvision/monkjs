jest.mock('@sentry/react');

import { MeasurementContext, TransactionContext, TransactionStatus } from '@monkvision/monitoring';
import { Transaction } from '@sentry/react';
import * as Sentry from '@sentry/react';
import { SentryMonitoringAdapter } from '../src';

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
    it('should create a sentry transaction', () => {
      const adapter = new SentryMonitoringAdapter(defaultConfiguration);
      const id = 'test-id';
      jest
        .spyOn(Sentry, 'startTransaction')
        .mockImplementation(() => ({ spanId: id } as unknown as Transaction));
      const context: TransactionContext = {
        parentId: 'parent-id',
        operation: 'test-op',
        name: 'test-name',
        description: 'test-description',
        data: { test: 'value' },
        traceId: 'trace-id',
        tags: { test: 'tag' },
      };
      const result = adapter.createTransaction(context);

      expect(Sentry.startTransaction).toHaveBeenCalledWith({
        parentSpanId: context.parentId,
        name: context.name,
        op: context.operation,
        description: context.description,
        data: context.data,
        traceId: context.traceId,
        tags: context.tags,
        sampled: true,
      });
      expect(result.id).toEqual(id);
    });

    it('should use the setTag method from Sentry', () => {
      const adapter = new SentryMonitoringAdapter(defaultConfiguration);
      const sentryTransaction = { spanId: '', setTag: jest.fn() } as unknown as Transaction;
      jest.spyOn(Sentry, 'startTransaction').mockImplementation(() => sentryTransaction);
      const transaction = adapter.createTransaction();
      const tagName = 'tag-name';
      const tagValue = 'tag-value';
      transaction.setTag(tagName, tagValue);

      expect(sentryTransaction.setTag).toHaveBeenCalledWith(tagName, tagValue);
    });

    it('should use the startChild method from Sentry', () => {
      const adapter = new SentryMonitoringAdapter(defaultConfiguration);
      const sentryTransaction = { spanId: '', startChild: jest.fn() } as unknown as Transaction;
      jest.spyOn(Sentry, 'startTransaction').mockImplementation(() => sentryTransaction);
      const transaction = adapter.createTransaction();
      const name = 'name';
      const context: MeasurementContext = {
        data: { test: 'value' },
        tags: { test: 'tag' },
        description: 'descr',
      };
      transaction.startMeasurement(name, context);

      expect(sentryTransaction.startChild).toHaveBeenCalledWith({ op: name, ...context });
    });

    it('should use the finish the child transaction', () => {
      const adapter = new SentryMonitoringAdapter(defaultConfiguration);
      const childTransaction = { setStatus: jest.fn(), finish: jest.fn() };
      const sentryTransaction = {
        spanId: '',
        startChild: jest.fn(() => childTransaction),
      } as unknown as Transaction;
      jest.spyOn(Sentry, 'startTransaction').mockImplementation(() => sentryTransaction);
      const transaction = adapter.createTransaction();
      const name = 'name';
      transaction.startMeasurement(name);
      transaction.stopMeasurement(name);

      expect(childTransaction.finish).toHaveBeenCalled();
    });

    it('should finish the child transaction with the given status', () => {
      const adapter = new SentryMonitoringAdapter(defaultConfiguration);
      const childTransaction = { setStatus: jest.fn(), finish: jest.fn() };
      const sentryTransaction = {
        spanId: '',
        startChild: jest.fn(() => childTransaction),
      } as unknown as Transaction;
      jest.spyOn(Sentry, 'startTransaction').mockImplementation(() => sentryTransaction);
      const transaction = adapter.createTransaction();
      const name = 'name';
      const status = 'test-status';
      transaction.startMeasurement(name);
      transaction.stopMeasurement(name, status);

      expect(childTransaction.setStatus).toHaveBeenCalledWith(status);
    });

    it('should finish the child transaction with the OK status by default', () => {
      const adapter = new SentryMonitoringAdapter(defaultConfiguration);
      const childTransaction = { setStatus: jest.fn(), finish: jest.fn() };
      const sentryTransaction = {
        spanId: '',
        startChild: jest.fn(() => childTransaction),
      } as unknown as Transaction;
      jest.spyOn(Sentry, 'startTransaction').mockImplementation(() => sentryTransaction);
      const transaction = adapter.createTransaction();
      const name = 'name';
      transaction.startMeasurement(name);
      transaction.stopMeasurement(name);

      expect(childTransaction.setStatus).toHaveBeenCalledWith(TransactionStatus.OK);
    });

    it('should use the setMeasurement method from Sentry', () => {
      const adapter = new SentryMonitoringAdapter(defaultConfiguration);
      const sentryTransaction = { spanId: '', setMeasurement: jest.fn() } as unknown as Transaction;
      jest.spyOn(Sentry, 'startTransaction').mockImplementation(() => sentryTransaction);
      const transaction = adapter.createTransaction();
      const name = 'name';
      const value = 15;
      const unit = 'second';
      transaction.setMeasurement(name, value, unit);

      expect(sentryTransaction.setMeasurement).toHaveBeenCalledWith(name, value, unit);
    });

    it('should use the "none" unit when no unit is provided', () => {
      const adapter = new SentryMonitoringAdapter(defaultConfiguration);
      const sentryTransaction = { spanId: '', setMeasurement: jest.fn() } as unknown as Transaction;
      jest.spyOn(Sentry, 'startTransaction').mockImplementation(() => sentryTransaction);
      const transaction = adapter.createTransaction();
      transaction.setMeasurement('name', 15);

      expect(sentryTransaction.setMeasurement).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        expect.stringMatching(/(^$)|(^none$)/gi),
      );
    });

    it('should finish the transaction', () => {
      const adapter = new SentryMonitoringAdapter(defaultConfiguration);
      const sentryTransaction = {
        spanId: '',
        setStatus: jest.fn(),
        finish: jest.fn(),
      } as unknown as Transaction;
      jest.spyOn(Sentry, 'startTransaction').mockImplementation(() => sentryTransaction);
      const transaction = adapter.createTransaction();
      const status = 'status';
      transaction.finish(status);

      expect(sentryTransaction.setStatus).toHaveBeenCalledWith(status);
      expect(sentryTransaction.finish).toHaveBeenCalled();
    });

    it('should use the OK status by default if no status is provided', () => {
      const adapter = new SentryMonitoringAdapter(defaultConfiguration);
      const sentryTransaction = {
        spanId: '',
        setStatus: jest.fn(),
        finish: jest.fn(),
      } as unknown as Transaction;
      jest.spyOn(Sentry, 'startTransaction').mockImplementation(() => sentryTransaction);
      const transaction = adapter.createTransaction();
      transaction.finish();

      expect(sentryTransaction.setStatus).toHaveBeenCalledWith(TransactionStatus.OK);
    });
  });
});
