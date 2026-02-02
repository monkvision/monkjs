import { DeviceOrientation } from '@monkvision/types';
import { i18nWrap, useI18nSync } from '@monkvision/common';
import { useTranslation } from 'react-i18next';
import { i18nCreateInspection } from './i18n';
import { Button } from '../Button';
import { styles, useVideoTutorialStyles } from './VideoTutorial.styles';
import { PhoneRotation } from './PhoneRotation';
import { VehicleOrbit } from './VehicleOrbit';
import { VehicleSurroundings } from './VehicleSurroundings';
import { VehiclePhone } from './VehiclePhone';
import { VehicleCovered } from './VehicleCovered';
import { useTutorialSteps, TutorialStep, TUTORIAL_STEPS_ORDER } from './hooks';

/**
 * Props of the VideoTutorial component.
 */
export interface VideoTutorialProps {
  /**
   * The orientation of the phone used in the tutorial, which affects the instructions and animations shown to the user.
   */
  orientation?: DeviceOrientation;
  /**
   * Callback called when the user completes the tutorial, with a boolean indicating whether the user
   * chose to not show the tutorial again.
   */
  onComplete?: (dontShowAgain: boolean) => void;
  /**
   * The language used by the component.
   *
   * @default en
   */
  lang?: string;
}

/**
 * A Video Tutorial component that guides the user through the process of capturing a vehicle,
 * with instructions and animations for each step.
 */
export const VideoTutorial = i18nWrap(function VideoTutorial({
  orientation = DeviceOrientation.LANDSCAPE,
  onComplete,
  lang,
}: VideoTutorialProps) {
  useI18nSync(lang);
  const { t } = useTranslation();

  const {
    step,
    isTransitioning,
    showButton,
    handleContinue,
    isLastStep,
    handleCheckboxChange,
    dontShowAgain,
    stepsContent,
    isFadingOut,
    isFadingIn,
  } = useTutorialSteps({
    onComplete,
    orientation,
  });
  const {
    containerStyle,
    buttonStyle,
    contentStyle,
    bottomSectionStyle,
    checkboxStyle,
    progressSegmentActiveStyle,
    progressSegmentStyle,
    progressTrackStyle,
  } = useVideoTutorialStyles({
    isTransitioning,
    showButton,
    isFadingOut,
    isFadingIn,
  });

  return (
    <div style={containerStyle}>
      <div />
      <div style={contentStyle}>
        {step === TutorialStep.PHONE_ROTATION && <PhoneRotation orientation={orientation} />}
        {step === TutorialStep.VEHICLE_ORBIT && <VehicleOrbit />}
        {step === TutorialStep.CLEAR_SURROUNDINGS && <VehicleSurroundings />}
        {step === TutorialStep.RIGHT_DISTANCE && <VehiclePhone orientation={orientation} />}
        {step === TutorialStep.FINISH_COVERED && <VehicleCovered />}
      </div>
      <div style={bottomSectionStyle}>
        <div style={styles['textContainer']}>
          <h1 style={styles['title']}>{t(stepsContent[step].title)}</h1>
          <p style={styles['subtitle']}>{t(stepsContent[step].subtitle)}</p>

          {step === TutorialStep.FINISH_COVERED ? (
            <label style={styles['checkboxLabel']}>
              <input
                type='checkbox'
                checked={dontShowAgain}
                onChange={(e) => handleCheckboxChange(e.target.checked)}
                style={checkboxStyle}
              />
              <span style={styles['checkboxText']}>{t('checkbox')}</span>
            </label>
          ) : (
            <div style={styles['checkboxSpacer']} />
          )}
        </div>

        <div style={styles['progressWrapper']}>
          <div style={progressTrackStyle}>
            {TUTORIAL_STEPS_ORDER.map((tutorialStep) => (
              <div
                key={tutorialStep}
                style={{
                  ...progressSegmentStyle,
                  ...(step === tutorialStep && progressSegmentActiveStyle),
                }}
              />
            ))}
          </div>
        </div>

        <Button
          style={buttonStyle}
          disabled={!showButton}
          secondaryColor='background-base'
          variant='outline'
          onClick={handleContinue}
        >
          {t(isLastStep ? 'button.get-started' : 'button.continue')}
        </Button>
      </div>
    </div>
  );
},
i18nCreateInspection);
