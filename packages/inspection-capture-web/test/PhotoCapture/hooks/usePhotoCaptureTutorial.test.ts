import { act, renderHook } from '@testing-library/react-hooks';
import {
  STORAGE_KEY_PHOTO_CAPTURE_TUTORIAL,
  TutorialSteps,
  usePhotoCaptureTutorial,
} from '../../../src/PhotoCapture/hooks';
import { PhotoCaptureSightTutorialOption, PhotoCaptureTutorialOption } from '@monkvision/types';

describe('usePhotoCaptureTutorial', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return WELCOME step if tutorial is enabled', () => {
    const { result } = renderHook(() =>
      usePhotoCaptureTutorial({ enableTutorial: PhotoCaptureTutorialOption.ENABLED }),
    );

    expect(result.current.currentTutorialStep).toBe(TutorialSteps.WELCOME);
  });

  it('should return null if tutorial is disabled', () => {
    const { result } = renderHook(() =>
      usePhotoCaptureTutorial({ enableTutorial: PhotoCaptureTutorialOption.DISABLED }),
    );

    expect(result.current.currentTutorialStep).toBeNull();
  });

  it('should set localStorage item if tutorial option is FIRST_TIME_ONLY', () => {
    const { result } = renderHook(() =>
      usePhotoCaptureTutorial({
        enableTutorial: PhotoCaptureTutorialOption.FIRST_TIME_ONLY,
        enableSightTutorial: PhotoCaptureSightTutorialOption.MODERN,
      }),
    );

    expect(localStorage.getItem(STORAGE_KEY_PHOTO_CAPTURE_TUTORIAL)).toBe(
      STORAGE_KEY_PHOTO_CAPTURE_TUTORIAL,
    );
    expect(result.current.currentTutorialStep).toBe(TutorialSteps.WELCOME);
  });

  it('should return null if tutorial is FIRST_TIME_ONLY and localStorage is set', () => {
    localStorage.setItem(STORAGE_KEY_PHOTO_CAPTURE_TUTORIAL, STORAGE_KEY_PHOTO_CAPTURE_TUTORIAL);

    const { result } = renderHook(() =>
      usePhotoCaptureTutorial({ enableTutorial: PhotoCaptureTutorialOption.FIRST_TIME_ONLY }),
    );

    expect(result.current.currentTutorialStep).toBeNull();
  });

  it('should allow changing the tutorial step', () => {
    const { result } = renderHook(() =>
      usePhotoCaptureTutorial({
        enableTutorial: PhotoCaptureTutorialOption.ENABLED,
        enableSightTutorial: PhotoCaptureSightTutorialOption.DISABLED,
      }),
    );

    act(() => {
      result.current.goToNextTutorialStep();
    });

    expect(result.current.currentTutorialStep).toBe(TutorialSteps.SIGHT);
  });

  it('should set currentTutorialStep to null if closeTutorial callback is called', () => {
    const { result } = renderHook(() =>
      usePhotoCaptureTutorial({ enableTutorial: PhotoCaptureTutorialOption.ENABLED }),
    );

    act(() => {
      result.current.closeTutorial();
    });

    expect(result.current.currentTutorialStep).toBe(null);
  });
});
