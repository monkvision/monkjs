import { useCallback, useEffect, useState } from 'react';
import { PhotoCaptureAppConfig, PhotoCaptureTutorialOption } from '@monkvision/types';
import { useObjectMemo } from '@monkvision/common';

export const STORAGE_KEY_PHOTO_CAPTURE_TUTORIAL = '@monk_photoCaptureTutorial';

/**
 * Enum of the different steps of the PhotoCapture Tutorial component.
 */
export enum TutorialSteps {
  /**
   * Welcome step.
   */
  WELCOME = 'welcome',
  /**
   * Guideline step.
   */
  GUIDELINE = 'guideline',
  /**
   * Sight tutorial step.
   */
  SIGHT_TUTORIAL = 'sightTutorial',
  /**
   * Sight step.
   */
  SIGHT = 'sight',
}

function getTutorialState(
  enableTutorial: PhotoCaptureTutorialOption | undefined,
): TutorialSteps | null {
  const isFirstTime = !!localStorage.getItem(STORAGE_KEY_PHOTO_CAPTURE_TUTORIAL);

  return enableTutorial === PhotoCaptureTutorialOption.DISABLED ||
    (enableTutorial === PhotoCaptureTutorialOption.FIRST_TIME_ONLY && isFirstTime)
    ? null
    : TutorialSteps.WELCOME;
}

/**
 * Parameters of the usePhotoCaptureTutorial hook.
 */
export interface PhotoCaptureTutorialParams
  extends Pick<
    PhotoCaptureAppConfig,
    'enableTutorial' | 'enableSightTutorial' | 'enableSightGuidelines'
  > {}

export interface HandlePhotoCaptureTutorial {
  /**
   * The current tutorial step in PhotoCapture component.
   */
  currentTutorialStep: TutorialSteps | null;
  /**
   * Callback called when the user clicks on the "Next" button in PhotoCapture tutorial.
   */
  goToNextTutorialStep: () => void;
  /**
   * Callback called when the user clicks on the "Close" button in PhotoCapture tutorial.
   */
  closeTutorial: () => void;
}

/**
 * Custom hook used to manage the state of photo capture tutorial.
 */
export function usePhotoCaptureTutorial({
  enableTutorial,
  enableSightTutorial,
  enableSightGuidelines,
}: PhotoCaptureTutorialParams): HandlePhotoCaptureTutorial {
  const [currentTutorialStep, setCurrentTutorialStep] = useState<TutorialSteps | null>(
    getTutorialState(enableTutorial),
  );

  const goToNextTutorialStep = useCallback(() => {
    let steps = Object.values(TutorialSteps);
    if (!enableSightGuidelines) {
      steps = steps.filter((v) => v !== TutorialSteps.GUIDELINE);
    }
    if (!enableSightTutorial) {
      steps = steps.filter((v) => v !== TutorialSteps.SIGHT_TUTORIAL);
    }
    if (currentTutorialStep === steps.at(-1)) {
      setCurrentTutorialStep(null);
      return;
    }
    const currentIndex = steps.findIndex((v) => currentTutorialStep === v);
    setCurrentTutorialStep(steps[currentIndex + 1]);
  }, [currentTutorialStep]);

  const closeTutorial = useCallback(() => {
    setCurrentTutorialStep(null);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PHOTO_CAPTURE_TUTORIAL, STORAGE_KEY_PHOTO_CAPTURE_TUTORIAL);
  }, []);

  return useObjectMemo({ currentTutorialStep, goToNextTutorialStep, closeTutorial });
}
