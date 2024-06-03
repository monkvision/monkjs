import { renderHook } from '@testing-library/react-hooks';
import { useBadConnectionWarning } from '../../../src/PhotoCapture/hooks';
import { act } from '@testing-library/react';
import { createFakePromise } from '@monkvision/test-utils';

describe('useBadConnectionWarning hook', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not display the dialog by default', () => {
    const maxUploadDurationWarning = 5;
    const { result, unmount } = renderHook(useBadConnectionWarning, {
      initialProps: { maxUploadDurationWarning },
    });

    expect(result.current.isBadConnectionWarningDialogDisplayed).toBe(false);

    unmount();
  });

  it('should display the warning after an upload too long', () => {
    const maxUploadDurationWarning = 5;
    const { result, unmount } = renderHook(useBadConnectionWarning, {
      initialProps: { maxUploadDurationWarning },
    });

    act(() => {
      result.current.uploadEventHandlers.onUploadSuccess?.(maxUploadDurationWarning + 1);
    });
    expect(result.current.isBadConnectionWarningDialogDisplayed).toBe(true);

    unmount();
  });

  it('should not display the warning after an upload fast enough', () => {
    const maxUploadDurationWarning = 5;
    const { result, unmount } = renderHook(useBadConnectionWarning, {
      initialProps: { maxUploadDurationWarning },
    });

    act(() => {
      result.current.uploadEventHandlers.onUploadSuccess?.(maxUploadDurationWarning - 1);
    });
    expect(result.current.isBadConnectionWarningDialogDisplayed).toBe(false);

    unmount();
  });

  it('should display the warning after a timeout upload', () => {
    const maxUploadDurationWarning = 5;
    const { result, unmount } = renderHook(useBadConnectionWarning, {
      initialProps: { maxUploadDurationWarning },
    });

    act(() => {
      result.current.uploadEventHandlers.onUploadTimeout?.();
    });
    expect(result.current.isBadConnectionWarningDialogDisplayed).toBe(true);

    unmount();
  });

  it('should not display the warning if maxUploadDurationWarning = -1', () => {
    const maxUploadDurationWarning = -1;
    const { result, unmount } = renderHook(useBadConnectionWarning, {
      initialProps: { maxUploadDurationWarning },
    });

    act(() => {
      result.current.uploadEventHandlers.onUploadSuccess?.(100000);
      result.current.uploadEventHandlers.onUploadTimeout?.();
    });
    expect(result.current.isBadConnectionWarningDialogDisplayed).toBe(false);

    unmount();
  });

  it('should keep the dialog displayed while the user has not dismissed it', () => {
    const maxUploadDurationWarning = 5;
    const { result, unmount } = renderHook(useBadConnectionWarning, {
      initialProps: { maxUploadDurationWarning },
    });

    act(() => {
      result.current.uploadEventHandlers.onUploadTimeout?.();
    });
    expect(result.current.isBadConnectionWarningDialogDisplayed).toBe(true);
    act(() => {
      result.current.uploadEventHandlers.onUploadSuccess?.(maxUploadDurationWarning + 1);
    });
    expect(result.current.isBadConnectionWarningDialogDisplayed).toBe(true);

    unmount();
  });

  it('should dismiss the dialog properly', () => {
    const maxUploadDurationWarning = 5;
    const { result, unmount } = renderHook(useBadConnectionWarning, {
      initialProps: { maxUploadDurationWarning },
    });

    act(() => {
      result.current.uploadEventHandlers.onUploadTimeout?.();
    });
    expect(result.current.isBadConnectionWarningDialogDisplayed).toBe(true);
    act(() => {
      result.current.closeBadConnectionWarningDialog();
    });
    expect(result.current.isBadConnectionWarningDialogDisplayed).toBe(false);

    unmount();
  });

  it('should never display the dialog again after it has been displayed and dismissed once', () => {
    const maxUploadDurationWarning = 5;
    const { result, unmount } = renderHook(useBadConnectionWarning, {
      initialProps: { maxUploadDurationWarning },
    });

    act(() => {
      result.current.uploadEventHandlers.onUploadTimeout?.();
    });
    expect(result.current.isBadConnectionWarningDialogDisplayed).toBe(true);
    act(() => {
      result.current.closeBadConnectionWarningDialog();
    });
    expect(result.current.isBadConnectionWarningDialogDisplayed).toBe(false);
    act(() => {
      result.current.uploadEventHandlers.onUploadTimeout?.();
    });
    expect(result.current.isBadConnectionWarningDialogDisplayed).toBe(false);
    act(() => {
      result.current.uploadEventHandlers.onUploadSuccess?.(maxUploadDurationWarning + 1);
    });
    expect(result.current.isBadConnectionWarningDialogDisplayed).toBe(false);

    unmount();
  });

  it('should never display the dialog again after it has been displayed and dismissed once even in async results', async () => {
    const maxUploadDurationWarning = 5;
    const { result, unmount } = renderHook(useBadConnectionWarning, {
      initialProps: { maxUploadDurationWarning },
    });

    const { onUploadTimeout } = result.current.uploadEventHandlers;

    const promise = createFakePromise();
    promise
      .then(() => {
        onUploadTimeout?.();
      })
      .catch(() => {});

    act(() => {
      result.current.uploadEventHandlers.onUploadTimeout?.();
    });
    expect(result.current.isBadConnectionWarningDialogDisplayed).toBe(true);
    act(() => {
      result.current.closeBadConnectionWarningDialog();
    });
    expect(result.current.isBadConnectionWarningDialogDisplayed).toBe(false);
    await act(async () => {
      promise.resolve(null);
      await promise;
    });
    expect(result.current.isBadConnectionWarningDialogDisplayed).toBe(false);

    unmount();
  });
});
