import { renderHook, act } from '@testing-library/react';
import { DeviceOrientation } from '@monkvision/types';
import {
  useTutorialSteps,
  TutorialStep,
  TUTORIAL_STEPS_ORDER,
  STORAGE_KEY_VIDEO_TUTORIAL,
} from '../../../src/components/VideoTutorial/hooks';

describe('VideoTutorial hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    localStorage.clear();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('useTutorialSteps hook', () => {
    it('should initialize with the first step', () => {
      const { result, unmount } = renderHook(useTutorialSteps, {
        initialProps: { orientation: DeviceOrientation.LANDSCAPE },
      });

      expect(result.current.step).toBe(TutorialStep.PHONE_ROTATION);
      expect(result.current.isLastStep).toBe(false);
      expect(result.current.dontShowAgain).toBe(false);
      expect(result.current.showButton).toBe(false);

      unmount();
    });

    it('should enable button after delay', () => {
      const { result, unmount } = renderHook(useTutorialSteps, {
        initialProps: { orientation: DeviceOrientation.LANDSCAPE },
      });

      expect(result.current.showButton).toBe(false);

      act(() => {
        jest.advanceTimersByTime(3000);
      });

      expect(result.current.showButton).toBe(true);

      unmount();
    });

    it('should advance to next step when handleContinue is called', () => {
      const { result, unmount } = renderHook(useTutorialSteps, {
        initialProps: { orientation: DeviceOrientation.LANDSCAPE },
      });

      expect(result.current.step).toBe(TutorialStep.PHONE_ROTATION);

      act(() => {
        result.current.handleContinue();
      });

      act(() => {
        jest.advanceTimersByTime(700);
      });

      expect(result.current.step).toBe(TutorialStep.VEHICLE_ORBIT);

      unmount();
    });

    it('should disable button when advancing to next step', () => {
      const { result, unmount } = renderHook(useTutorialSteps, {
        initialProps: { orientation: DeviceOrientation.LANDSCAPE },
      });

      act(() => {
        jest.advanceTimersByTime(3000);
      });

      expect(result.current.showButton).toBe(true);

      act(() => {
        result.current.handleContinue();
      });

      expect(result.current.showButton).toBe(false);

      unmount();
    });

    it('should re-enable button after timer in new step', () => {
      const { result, unmount } = renderHook(useTutorialSteps, {
        initialProps: { orientation: DeviceOrientation.LANDSCAPE },
      });

      // Enable button on first step
      act(() => {
        jest.advanceTimersByTime(3000);
      });

      expect(result.current.showButton).toBe(true);

      // Move to next step - this will setShowButton(false) and then after TRANSITION_DELAY, setStep
      act(() => {
        result.current.handleContinue();
      });

      expect(result.current.showButton).toBe(false);

      // Wait for step transition (TRANSITION_DELAY = 600ms)
      act(() => {
        jest.advanceTimersByTime(600);
      });

      // Step has changed, which triggers useEffect that sets a new timer for button
      // Button should still be false at this point
      expect(result.current.showButton).toBe(false);

      // Wait for button to show (BUTTON_SHOW_DELAY = 3000ms)
      act(() => {
        jest.advanceTimersByTime(3000);
      });

      expect(result.current.showButton).toBe(true);

      unmount();
    });

    it('should set isTransitioning when advancing from PHONE_ROTATION', () => {
      const { result, unmount } = renderHook(useTutorialSteps, {
        initialProps: { orientation: DeviceOrientation.LANDSCAPE },
      });

      expect(result.current.isTransitioning).toBe(false);

      act(() => {
        result.current.handleContinue();
      });

      expect(result.current.isTransitioning).toBe(true);

      act(() => {
        jest.advanceTimersByTime(700);
      });

      expect(result.current.isTransitioning).toBe(false);

      unmount();
    });

    it('should not set isTransitioning when advancing from CLEAR_SURROUNDINGS', () => {
      const { result, unmount } = renderHook(useTutorialSteps, {
        initialProps: { orientation: DeviceOrientation.LANDSCAPE },
      });

      act(() => {
        result.current.handleContinue();
      });
      act(() => {
        jest.advanceTimersByTime(700);
      });
      act(() => {
        result.current.handleContinue();
      });
      act(() => {
        jest.advanceTimersByTime(700);
      });

      expect(result.current.step).toBe(TutorialStep.CLEAR_SURROUNDINGS);
      expect(result.current.isTransitioning).toBe(false);

      act(() => {
        result.current.handleContinue();
      });

      expect(result.current.isTransitioning).toBe(false);

      unmount();
    });

    it('should progress through all tutorial steps in order', () => {
      const { result, unmount } = renderHook(useTutorialSteps, {
        initialProps: { orientation: DeviceOrientation.LANDSCAPE },
      });

      TUTORIAL_STEPS_ORDER.forEach((step, index) => {
        expect(result.current.step).toBe(step);
        expect(result.current.isLastStep).toBe(index === TUTORIAL_STEPS_ORDER.length - 1);

        if (index < TUTORIAL_STEPS_ORDER.length - 1) {
          act(() => {
            result.current.handleContinue();
          });
          act(() => {
            jest.advanceTimersByTime(700);
          });
        }
      });

      unmount();
    });

    it('should update dontShowAgain when handleCheckboxChange is called', () => {
      const { result, unmount } = renderHook(useTutorialSteps, {
        initialProps: { orientation: DeviceOrientation.LANDSCAPE },
      });

      expect(result.current.dontShowAgain).toBe(false);

      act(() => {
        result.current.handleCheckboxChange(true);
      });

      expect(result.current.dontShowAgain).toBe(true);

      act(() => {
        result.current.handleCheckboxChange(false);
      });

      expect(result.current.dontShowAgain).toBe(false);

      unmount();
    });

    it('should call onComplete when completing the last step', () => {
      const onComplete = jest.fn();
      const { result, unmount } = renderHook(useTutorialSteps, {
        initialProps: { onComplete, orientation: DeviceOrientation.LANDSCAPE },
      });

      for (let i = 0; i < 4; i++) {
        act(() => {
          result.current.handleContinue();
        });
        act(() => {
          jest.advanceTimersByTime(700);
        });
      }

      expect(result.current.isLastStep).toBe(true);

      act(() => {
        result.current.handleContinue();
      });

      act(() => {
        jest.advanceTimersByTime(600);
      });

      expect(onComplete).toHaveBeenCalledWith(false);

      unmount();
    });

    it('should call onComplete with true when dontShowAgain is checked', () => {
      const onComplete = jest.fn();
      const { result, unmount } = renderHook(useTutorialSteps, {
        initialProps: { onComplete, orientation: DeviceOrientation.LANDSCAPE },
      });

      for (let i = 0; i < 4; i++) {
        act(() => {
          result.current.handleContinue();
        });
        act(() => {
          jest.advanceTimersByTime(700);
        });
      }

      act(() => {
        result.current.handleCheckboxChange(true);
      });

      act(() => {
        result.current.handleContinue();
      });

      act(() => {
        jest.advanceTimersByTime(600);
      });

      expect(onComplete).toHaveBeenCalledWith(true);

      unmount();
    });

    it('should save to localStorage when completing with dontShowAgain checked', () => {
      const onComplete = jest.fn();
      const { result, unmount } = renderHook(useTutorialSteps, {
        initialProps: { onComplete, orientation: DeviceOrientation.LANDSCAPE },
      });

      for (let i = 0; i < 4; i++) {
        act(() => {
          result.current.handleContinue();
        });
        act(() => {
          jest.advanceTimersByTime(700);
        });
      }

      act(() => {
        result.current.handleCheckboxChange(true);
      });

      expect(localStorage.getItem(STORAGE_KEY_VIDEO_TUTORIAL)).toBeNull();

      act(() => {
        result.current.handleContinue();
      });

      act(() => {
        jest.advanceTimersByTime(600);
      });

      expect(localStorage.getItem(STORAGE_KEY_VIDEO_TUTORIAL)).toBe(STORAGE_KEY_VIDEO_TUTORIAL);

      unmount();
    });

    it('should not save to localStorage when completing without dontShowAgain', () => {
      const onComplete = jest.fn();
      const { result, unmount } = renderHook(useTutorialSteps, {
        initialProps: { onComplete, orientation: DeviceOrientation.LANDSCAPE },
      });

      for (let i = 0; i < 5; i++) {
        act(() => {
          result.current.handleContinue();
        });
        act(() => {
          jest.advanceTimersByTime(700);
        });
      }

      expect(localStorage.getItem(STORAGE_KEY_VIDEO_TUTORIAL)).toBeNull();

      unmount();
    });

    it('should call onComplete immediately if localStorage is set', () => {
      localStorage.setItem(STORAGE_KEY_VIDEO_TUTORIAL, STORAGE_KEY_VIDEO_TUTORIAL);
      const onComplete = jest.fn();

      const { unmount } = renderHook(useTutorialSteps, {
        initialProps: { onComplete, orientation: DeviceOrientation.LANDSCAPE },
      });

      expect(onComplete).toHaveBeenCalledWith(true);

      unmount();
    });

    it('should set isFadingIn initially and clear after delay', () => {
      const { result, unmount } = renderHook(useTutorialSteps, {
        initialProps: { orientation: DeviceOrientation.LANDSCAPE },
      });

      expect(result.current.isFadingIn).toBe(true);

      act(() => {
        jest.advanceTimersByTime(100);
      });

      expect(result.current.isFadingIn).toBe(false);

      unmount();
    });

    it('should set isFadingOut when completing tutorial', () => {
      const { result, unmount } = renderHook(useTutorialSteps, {
        initialProps: { orientation: DeviceOrientation.LANDSCAPE },
      });

      for (let i = 0; i < 4; i++) {
        act(() => {
          result.current.handleContinue();
        });
        act(() => {
          jest.advanceTimersByTime(700);
        });
      }

      expect(result.current.isFadingOut).toBe(false);

      act(() => {
        result.current.handleContinue();
      });

      expect(result.current.isFadingOut).toBe(true);

      unmount();
    });

    it('should return correct stepsContent for landscape orientation', () => {
      const { result, unmount } = renderHook(useTutorialSteps, {
        initialProps: { orientation: DeviceOrientation.LANDSCAPE },
      });

      expect(result.current.stepsContent[TutorialStep.PHONE_ROTATION].title).toBe(
        'steps.rotate.landscape.title',
      );
      expect(result.current.stepsContent[TutorialStep.PHONE_ROTATION].subtitle).toBe(
        'steps.rotate.landscape.text',
      );

      unmount();
    });

    it('should return correct stepsContent for portrait orientation', () => {
      const { result, unmount } = renderHook(useTutorialSteps, {
        initialProps: { orientation: DeviceOrientation.PORTRAIT },
      });

      expect(result.current.stepsContent[TutorialStep.PHONE_ROTATION].title).toBe(
        'steps.rotate.portrait.title',
      );
      expect(result.current.stepsContent[TutorialStep.PHONE_ROTATION].subtitle).toBe(
        'steps.rotate.portrait.text',
      );

      unmount();
    });

    it('should update onComplete reference when prop changes', () => {
      const onComplete1 = jest.fn();
      const onComplete2 = jest.fn();

      const { result, rerender, unmount } = renderHook(useTutorialSteps, {
        initialProps: { onComplete: onComplete1, orientation: DeviceOrientation.LANDSCAPE },
      });

      for (let i = 0; i < 4; i++) {
        act(() => {
          result.current.handleContinue();
          jest.advanceTimersByTime(700);
        });
      }

      rerender({ onComplete: onComplete2, orientation: DeviceOrientation.LANDSCAPE });

      act(() => {
        result.current.handleContinue();
        jest.advanceTimersByTime(600);
      });

      expect(onComplete1).not.toHaveBeenCalled();
      expect(onComplete2).toHaveBeenCalledWith(false);

      unmount();
    });
  });
});
