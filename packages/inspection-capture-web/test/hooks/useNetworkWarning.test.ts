import { renderHook, act } from '@testing-library/react';
import { NetworkQuality } from '@monkvision/common';
import { NetworkWarningParams, useNetworkWarning } from '../../src/hooks';

function createParams(overrides: Partial<NetworkWarningParams> = {}): NetworkWarningParams {
  return { enabled: true, quality: NetworkQuality.GOOD, failedUploadsCount: 0, ...overrides };
}

describe('useNetworkWarning hook', () => {
  it('should not display the dialog when the network is good', () => {
    const { result, unmount } = renderHook(useNetworkWarning, { initialProps: createParams() });

    expect(result.current.isNetworkWarningDialogDisplayed).toBe(false);
    expect(result.current.networkWarningQuality).toBeNull();

    unmount();
  });

  it('should display the dialog when the network goes offline', () => {
    const { result, rerender, unmount } = renderHook(useNetworkWarning, {
      initialProps: createParams(),
    });
    rerender(createParams({ quality: NetworkQuality.OFFLINE }));

    expect(result.current.isNetworkWarningDialogDisplayed).toBe(true);
    expect(result.current.networkWarningQuality).toBe(NetworkQuality.OFFLINE);

    unmount();
  });

  it('should only display the dialog for a poor network if some uploads failed', () => {
    const { result, rerender, unmount } = renderHook(useNetworkWarning, {
      initialProps: createParams({ quality: NetworkQuality.POOR }),
    });
    expect(result.current.isNetworkWarningDialogDisplayed).toBe(false);

    rerender(createParams({ quality: NetworkQuality.POOR, failedUploadsCount: 1 }));
    expect(result.current.isNetworkWarningDialogDisplayed).toBe(true);
    expect(result.current.networkWarningQuality).toBe(NetworkQuality.POOR);

    unmount();
  });

  it('should only display the dialog once per connection issue', () => {
    const { result, rerender, unmount } = renderHook(useNetworkWarning, {
      initialProps: createParams({ quality: NetworkQuality.OFFLINE }),
    });
    act(() => result.current.closeNetworkWarningDialog());
    expect(result.current.isNetworkWarningDialogDisplayed).toBe(false);

    rerender(createParams({ quality: NetworkQuality.POOR, failedUploadsCount: 2 }));
    expect(result.current.isNetworkWarningDialogDisplayed).toBe(false);

    rerender(createParams({ quality: NetworkQuality.GOOD }));
    rerender(createParams({ quality: NetworkQuality.OFFLINE }));
    expect(result.current.isNetworkWarningDialogDisplayed).toBe(true);

    unmount();
  });

  it('should hide the dialog when the network becomes good again', () => {
    const { result, rerender, unmount } = renderHook(useNetworkWarning, {
      initialProps: createParams({ quality: NetworkQuality.OFFLINE }),
    });
    rerender(createParams({ quality: NetworkQuality.GOOD }));

    expect(result.current.isNetworkWarningDialogDisplayed).toBe(false);

    unmount();
  });

  it('should never display the dialog if disabled', () => {
    const { result, unmount } = renderHook(useNetworkWarning, {
      initialProps: createParams({ enabled: false, quality: NetworkQuality.OFFLINE }),
    });

    expect(result.current.isNetworkWarningDialogDisplayed).toBe(false);

    unmount();
  });
});
