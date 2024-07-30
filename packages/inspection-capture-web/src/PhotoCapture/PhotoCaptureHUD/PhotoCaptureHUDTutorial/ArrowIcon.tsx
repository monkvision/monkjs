import { DynamicSVG } from '@monkvision/common-ui-web';
import { TutorialSteps } from '../../hooks';
import { styles } from './PhotoCaptureHUDTutorial.styles';
import { arrowGuidelineSVG, arrowSightTutorialSVG } from '../../../assets';

export interface ArrowIconProps {
  tutorialStep: TutorialSteps | null;
}

export function ArrowIcon({ tutorialStep }: ArrowIconProps) {
  if (tutorialStep === TutorialSteps.GUIDELINE) {
    return <DynamicSVG style={styles['arrowGuideline']} svg={arrowGuidelineSVG} />;
  }
  if (tutorialStep === TutorialSteps.SIGHT_TUTORIAL) {
    return <DynamicSVG style={styles['arrowSightTutorial']} svg={arrowSightTutorialSVG} />;
  }
  return null;
}
