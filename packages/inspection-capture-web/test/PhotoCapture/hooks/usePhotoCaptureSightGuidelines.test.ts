import { act, renderHook } from '@testing-library/react-hooks';
import {
  STORAGE_KEY_PHOTO_CAPTURE_GUIDELINES,
  TTL_MS,
  usePhotoCaptureSightGuidelines,
} from '../../../src/PhotoCapture/hooks';
import { PhotoCaptureSightGuidelinesOption } from '@monkvision/types';

describe('usePhotoCaptureSightGuidelines', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return showSightGuidelines as true when enableSightGuidelines is ENABLED', () => {
    const { result } = renderHook(() =>
      usePhotoCaptureSightGuidelines({
        enableSightGuidelines: PhotoCaptureSightGuidelinesOption.ENABLED,
      }),
    );

    expect(result.current.showSightGuidelines).toBe(true);
  });

  it('should return showSightGuidelines as false when enableSightGuidelines is DISABLED', () => {
    const { result } = renderHook(() =>
      usePhotoCaptureSightGuidelines({
        enableSightGuidelines: PhotoCaptureSightGuidelinesOption.DISABLED,
      }),
    );

    expect(result.current.showSightGuidelines).toBe(false);
  });

  it('should return showSightGuidelines as false when enableSightGuidelines is EPHEMERAL and TTL is not expired', () => {
    localStorage.setItem(STORAGE_KEY_PHOTO_CAPTURE_GUIDELINES, (Date.now() - 5000).toString());

    const { result } = renderHook(() =>
      usePhotoCaptureSightGuidelines({
        enableSightGuidelines: PhotoCaptureSightGuidelinesOption.EPHEMERAL,
      }),
    );

    expect(result.current.showSightGuidelines).toBe(false);
  });

  it('should return showSightGuidelines as true when enableSightGuidelines is EPHEMERAL and TTL is expired', () => {
    localStorage.setItem(STORAGE_KEY_PHOTO_CAPTURE_GUIDELINES, (Date.now() - TTL_MS).toString());

    const { result } = renderHook(() =>
      usePhotoCaptureSightGuidelines({
        enableSightGuidelines: PhotoCaptureSightGuidelinesOption.EPHEMERAL,
      }),
    );

    expect(result.current.showSightGuidelines).toBe(true);
  });

  it('should disable sight guidelines when onDisableSightGuidelines is called and enableSightGuidelines is EPHEMERAL', () => {
    const { result } = renderHook(() =>
      usePhotoCaptureSightGuidelines({
        enableSightGuidelines: PhotoCaptureSightGuidelinesOption.EPHEMERAL,
      }),
    );

    act(() => {
      result.current.handleDisableSightGuidelines();
    });

    expect(result.current.showSightGuidelines).toBe(false);
    expect(localStorage.getItem(STORAGE_KEY_PHOTO_CAPTURE_GUIDELINES)).toBeTruthy();
  });

  it('should disable sight guidelines when onDisableSightGuidelines is called and enableSightGuidelines is ENABLED', () => {
    const { result } = renderHook(() =>
      usePhotoCaptureSightGuidelines({
        enableSightGuidelines: PhotoCaptureSightGuidelinesOption.ENABLED,
      }),
    );

    act(() => {
      result.current.handleDisableSightGuidelines();
    });

    expect(result.current.showSightGuidelines).toBe(false);
  });
});
