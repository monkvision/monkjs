import { DeviceOrientation } from '@monkvision/types';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';

export const STORAGE_KEY_VIDEO_TUTORIAL = '@monk_videoTutorial';
const BUTTON_SHOW_DELAY = 3000;
const TRANSITION_DELAY = 600;
const TRANSITION_END_DELAY = 100;
const FADE_IN_DELAY = 100;

export enum TutorialStep {
  PHONE_ROTATION = 'phoneRotation',
  VEHICLE_ORBIT = 'vehicleOrbit',
  CLEAR_SURROUNDINGS = 'clearSurroundings',
  RIGHT_DISTANCE = 'rightDistance',
  FINISH_COVERED = 'finishCovered',
}

export const TUTORIAL_STEPS_ORDER = [
  TutorialStep.PHONE_ROTATION,
  TutorialStep.VEHICLE_ORBIT,
  TutorialStep.CLEAR_SURROUNDINGS,
  TutorialStep.RIGHT_DISTANCE,
  TutorialStep.FINISH_COVERED,
];

export interface TutorialStepsParams {
  onComplete?: (dontShowAgain: boolean) => void;
  orientation: DeviceOrientation;
}

export function useTutorialSteps({ onComplete, orientation }: TutorialStepsParams) {
  const [step, setStep] = useState<TutorialStep>(TutorialStep.PHONE_ROTATION);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isFadingIn, setIsFadingIn] = useState(true);

  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const stepsContent = useMemo(
    () => ({
      [TutorialStep.PHONE_ROTATION]: {
        title:
          orientation === DeviceOrientation.LANDSCAPE
            ? 'steps.rotate.landscape.title'
            : 'steps.rotate.portrait.title',
        subtitle:
          orientation === DeviceOrientation.LANDSCAPE
            ? 'steps.rotate.landscape.text'
            : 'steps.rotate.portrait.text',
      },
      [TutorialStep.VEHICLE_ORBIT]: {
        title: 'steps.vehicle-orbit.title',
        subtitle: 'steps.vehicle-orbit.text',
      },
      [TutorialStep.CLEAR_SURROUNDINGS]: {
        title: 'steps.vehicle-surroundings.title',
        subtitle: 'steps.vehicle-surroundings.text',
      },
      [TutorialStep.RIGHT_DISTANCE]: {
        title: 'steps.vehicle-phone.title',
        subtitle: 'steps.vehicle-phone.text',
      },
      [TutorialStep.FINISH_COVERED]: {
        title: 'steps.vehicle-coverage.title',
        subtitle: 'steps.vehicle-coverage.text',
      },
    }),
    [orientation],
  );

  const handleContinue = useCallback(() => {
    const isLastStep = step === TutorialStep.FINISH_COVERED;
    if (isLastStep) {
      setIsFadingOut(true);
      setTimeout(() => {
        if (dontShowAgain) {
          localStorage.setItem(STORAGE_KEY_VIDEO_TUTORIAL, STORAGE_KEY_VIDEO_TUTORIAL);
        }
        onCompleteRef.current?.(dontShowAgain);
      }, TRANSITION_DELAY);
    } else {
      const currentIndex = TUTORIAL_STEPS_ORDER.indexOf(step);
      const nextStep = TUTORIAL_STEPS_ORDER[currentIndex + 1];

      if (!nextStep) {
        return;
      }

      setShowButton(false);
      if (step !== TutorialStep.CLEAR_SURROUNDINGS) {
        setIsTransitioning(true);
      }

      setTimeout(() => {
        setStep(nextStep);

        setTimeout(() => {
          setIsTransitioning(false);
        }, TRANSITION_END_DELAY);
      }, TRANSITION_DELAY);
    }
  }, [step, dontShowAgain]);

  const handleCheckboxChange = useCallback((value: boolean) => {
    setDontShowAgain(value);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButton(true);
    }, BUTTON_SHOW_DELAY);
    return () => clearTimeout(timer);
  }, [step]);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY_VIDEO_TUTORIAL) === STORAGE_KEY_VIDEO_TUTORIAL) {
      onComplete?.(true);
    }
  }, [onComplete]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFadingIn(false);
    }, FADE_IN_DELAY);
    return () => clearTimeout(timer);
  }, []);

  return {
    step,
    isTransitioning,
    showButton,
    handleContinue,
    isLastStep: step === TutorialStep.FINISH_COVERED,
    handleCheckboxChange,
    dontShowAgain,
    stepsContent,
    isFadingOut,
    isFadingIn,
  };
}
