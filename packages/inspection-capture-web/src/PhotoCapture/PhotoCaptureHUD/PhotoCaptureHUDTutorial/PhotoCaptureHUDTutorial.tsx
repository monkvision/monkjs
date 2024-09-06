import { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@monkvision/common-ui-web';
import { CaptureAppConfig } from '@monkvision/types';
import { styles } from './PhotoCaptureHUDTutorial.styles';
import { TutorialSteps } from '../../hooks';
import { usePhotoCaptureHUDButtonBackground } from '../hooks';
import { SightGuideline } from '../PhotoCaptureHUDElementsSight';
import { ArrowIcon } from './ArrowIcon';
import { DisplayText } from './DisplayText';

/**
 * Props of the PhotoCaptureHUDTutorial component.
 */
export interface PhotoCaptureHUDTutorialProps
  extends Pick<CaptureAppConfig, 'allowSkipTutorial' | 'sightGuidelines' | 'addDamage'> {
  /**
   * The id of the sight.
   */
  sightId: string;
  /**
   * The current tutorial step in PhotoCapture component.
   */
  currentTutorialStep: TutorialSteps | null;
  /**
   * Callback called when the user clicks on "Next" button in PhotoCapture tutorial.
   */
  onNextTutorialStep: () => void;
  /**
   * Callback called when the user clicks on "Close" button in PhotoCapture tutorial.
   */
  onCloseTutorial: () => void;
}

function getButtonStyle(enableAddDamage?: boolean): CSSProperties {
  return { visibility: enableAddDamage ? 'visible' : 'hidden' };
}

/**
 * Component that displays an tutorial overlay on top of the PhotoCapture component.
 */
export function PhotoCaptureHUDTutorial({
  currentTutorialStep,
  allowSkipTutorial,
  sightGuidelines,
  sightId,
  onNextTutorialStep,
  onCloseTutorial,
  addDamage,
}: PhotoCaptureHUDTutorialProps) {
  const { t } = useTranslation();
  const primaryColor = usePhotoCaptureHUDButtonBackground();

  return currentTutorialStep ? (
    <div style={styles['backdropContainer']} data-testid='backdrop'>
      <div style={styles['elementsContainer']}>
        <div style={styles['topContainer']}>
          <div style={styles['buttonsContainer']}>
            <div style={styles['closeButtonTwin']} />
            <SightGuideline
              sightId={sightId}
              sightGuidelines={sightGuidelines}
              enableSightGuidelines={currentTutorialStep === TutorialSteps.GUIDELINE}
              addDamage={addDamage}
            />
            <Button
              style={{ ...styles['closeButton'], ...getButtonStyle(allowSkipTutorial) }}
              disabled={!allowSkipTutorial}
              icon='close'
              primaryColor={primaryColor}
              onClick={onCloseTutorial}
            />
          </div>
          <ArrowIcon tutorialStep={currentTutorialStep} />
        </div>
        <DisplayText tutorialStep={currentTutorialStep} />
        <Button style={styles['nextButton']} primaryColor='primary' onClick={onNextTutorialStep}>
          {t('photo.hud.tutorial.next')}
        </Button>
      </div>
    </div>
  ) : null;
}
