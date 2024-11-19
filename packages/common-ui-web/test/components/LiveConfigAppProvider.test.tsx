import { CaptureAppConfig } from '@monkvision/types';

jest.mock('../../src/components/Button', () => ({
  Button: jest.fn(() => <></>),
}));
jest.mock('../../src/components/Spinner', () => ({
  Spinner: jest.fn(() => <></>),
}));
const { useAsyncEffect: useAsyncEffectActual } = jest.requireActual('@monkvision/common');

import { act, render, screen, waitFor } from '@testing-library/react';
import { createFakePromise, expectPropsOnChildMock } from '@monkvision/test-utils';
import { MonkAppStateProvider, useAsyncEffect, useLoadingState } from '@monkvision/common';
import { MonkApi } from '@monkvision/network';
import { Button, LiveConfigAppProvider, Spinner } from '../../src';

describe('LiveConfigAppProvider component', () => {
  beforeEach(() => {
    (useAsyncEffect as jest.Mock).mockImplementation(useAsyncEffectActual);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch the live config and pass it to the MonkAppStateProvider component', async () => {
    const config = { hello: 'world' };
    (MonkApi.getLiveConfig as jest.Mock).mockImplementationOnce(() => Promise.resolve(config));
    const id = 'test-id-test';
    const { unmount } = render(<LiveConfigAppProvider id={id} />);

    await waitFor(() => {
      expectPropsOnChildMock(MonkAppStateProvider, { config });
    });

    unmount();
  });

  it('should pass down the props and children to the MonkAppStateProvider component', async () => {
    const onFetchAuthToken = jest.fn();
    const onFetchLanguage = jest.fn();
    const children = 'test-children';
    const { unmount } = render(
      <LiveConfigAppProvider
        id='test'
        onFetchAuthToken={onFetchAuthToken}
        onFetchLanguage={onFetchLanguage}
      >
        {children}
      </LiveConfigAppProvider>,
    );

    await waitFor(() => {
      expectPropsOnChildMock(MonkAppStateProvider, { onFetchAuthToken, onFetchLanguage, children });
    });

    unmount();
  });

  it('should display a spinner while waiting for the live config to be fetched', async () => {
    (useLoadingState as jest.Mock).mockImplementation(
      jest.requireActual('@monkvision/common').useLoadingState,
    );
    const spinnerTestId = 'spinner-test';
    (Spinner as unknown as jest.Mock).mockImplementation(() => (
      <div data-testid={spinnerTestId}></div>
    ));
    const promise = createFakePromise();
    (MonkApi.getLiveConfig as jest.Mock).mockImplementationOnce(() => promise);
    const id = 'test-id-test';
    const { unmount } = render(<LiveConfigAppProvider id={id} />);

    expect(screen.queryByTestId(spinnerTestId)).not.toBeNull();
    expect(MonkAppStateProvider).not.toHaveBeenCalled();
    await act(async () => {
      promise.resolve({});
      await promise;
    });
    expect(screen.queryByTestId(spinnerTestId)).toBeNull();
    expect(MonkAppStateProvider).toHaveBeenCalled();

    unmount();
  });

  it('should display an error message with a retry button in case of error', async () => {
    (MonkApi.getLiveConfig as jest.Mock).mockImplementationOnce(() => Promise.reject(new Error()));
    const id = 'test-id-test';
    const { unmount } = render(<LiveConfigAppProvider id={id} />);

    expect(MonkAppStateProvider).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(screen.getByTestId('error-msg')).not.toBeNull();
      expectPropsOnChildMock(Button, { children: 'Retry', onClick: expect.any(Function) });
    });
    const { onClick } = (Button as unknown as jest.Mock).mock.calls[0][0];
    (MonkApi.getLiveConfig as jest.Mock).mockImplementationOnce(() => Promise.resolve({}));
    act(() => {
      onClick();
    });
    expect(MonkAppStateProvider).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(screen.queryByText('error.message')).toBeNull();
      expect(MonkAppStateProvider).toHaveBeenCalled();
    });

    unmount();
  });

  it('should not fetch the live config and return the local config if it is used', async () => {
    const localConfig = { hello: 'world' } as unknown as CaptureAppConfig;
    const id = 'test-id-test';
    const { unmount } = render(<LiveConfigAppProvider id={id} localConfig={localConfig} />);

    await waitFor(() => {
      expectPropsOnChildMock(MonkAppStateProvider, { config: localConfig });
      expect(MonkApi.getLiveConfig).not.toHaveBeenCalled();
    });

    unmount();
  });
});
