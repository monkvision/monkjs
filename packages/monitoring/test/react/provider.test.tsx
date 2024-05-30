import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { MonitoringAdapter, MonitoringProvider, useMonitoring } from '../../src';

function TestComponent() {
  const { setUserId, log, handleError, createTransaction, setTags } = useMonitoring();

  return (
    <div>
      <button data-testid='set-user-id-btn' onClick={() => setUserId('test')}>
        setUserId
      </button>
      <button data-testid='log-btn' onClick={() => log('test')}>
        log
      </button>
      <button data-testid='handle-error-btn' onClick={() => handleError('test')}>
        handleError
      </button>
      <button data-testid='create-transaction-btn' onClick={() => createTransaction({})}>
        createTransaction
      </button>
      <button data-testid='set-tags-btn' onClick={() => setTags({ test: 'test' })}>
        setTags
      </button>
    </div>
  );
}

describe('MonitoringProvider component', () => {
  it('should initialize the MonitoringContext with the given adapter', () => {
    const adapter: MonitoringAdapter = {
      setUserId: jest.fn(),
      log: jest.fn(),
      handleError: jest.fn(),
      createTransaction: jest.fn(),
      setTags: jest.fn(),
    };
    const setUserIdSpy = jest.spyOn(adapter, 'setUserId');
    const logSpy = jest.spyOn(adapter, 'log');
    const handleErrorSpy = jest.spyOn(adapter, 'handleError');
    const createTransactionSpy = jest.spyOn(adapter, 'createTransaction');
    const setTagsSpy = jest.spyOn(adapter, 'setTags');

    const { unmount } = render(
      <MonitoringProvider adapter={adapter}>
        <TestComponent />
      </MonitoringProvider>,
    );

    fireEvent.click(screen.getByTestId('set-user-id-btn'));
    expect(setUserIdSpy).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByTestId('log-btn'));
    expect(logSpy).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByTestId('handle-error-btn'));
    expect(handleErrorSpy).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByTestId('create-transaction-btn'));
    expect(createTransactionSpy).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByTestId('set-tags-btn'));
    expect(setTagsSpy).toHaveBeenCalledTimes(1);
    unmount();
  });
});
