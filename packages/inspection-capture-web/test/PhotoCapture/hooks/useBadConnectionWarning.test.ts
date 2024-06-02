import { renderHook } from '@testing-library/react-hooks';
import { useBadConnectionWarning } from '../../../src/PhotoCapture/hooks';
import { act } from '@testing-library/react';

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
      result.current.onUploadSuccess(maxUploadDurationWarning + 1);
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
      result.current.onUploadSuccess(maxUploadDurationWarning - 1);
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
      result.current.onUploadTimeout();
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
      result.current.onUploadSuccess(100000);
      result.current.onUploadTimeout();
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
      result.current.onUploadTimeout();
    });
    expect(result.current.isBadConnectionWarningDialogDisplayed).toBe(true);
    act(() => {
      result.current.onUploadSuccess(maxUploadDurationWarning + 1);
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
      result.current.onUploadTimeout();
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
      result.current.onUploadTimeout();
    });
    expect(result.current.isBadConnectionWarningDialogDisplayed).toBe(true);
    act(() => {
      result.current.closeBadConnectionWarningDialog();
    });
    expect(result.current.isBadConnectionWarningDialogDisplayed).toBe(false);
    act(() => {
      result.current.onUploadTimeout();
    });
    expect(result.current.isBadConnectionWarningDialogDisplayed).toBe(false);
    act(() => {
      result.current.onUploadSuccess(maxUploadDurationWarning + 1);
    });
    expect(result.current.isBadConnectionWarningDialogDisplayed).toBe(false);

    unmount();
  });
});
