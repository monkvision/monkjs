import { useTranslation } from 'react-i18next';
import { styles } from './PhotoCaptureHUDTutorial.styles';
import { TutorialSteps } from '../../hooks';

export interface DisplayTextProps {
  tutorialStep: TutorialSteps | null;
}

export function DisplayText({ tutorialStep }: DisplayTextProps) {
  const { t } = useTranslation();

  const textArray = t(`photo.hud.tutorial.${tutorialStep}`).split(/<br\s*\/?>/);

  return (
    <div style={styles['text']}>
      <div style={styles['title']} data-testid='title'>
        {t('photo.hud.tutorial.title')}
      </div>
      {textArray.map((value: string, index: number) => (
        <div key={index} data-testid={`text${index}`}>
          {value}
          {index < textArray.length - 1 && <br />}
        </div>
      ))}
    </div>
  );
}
