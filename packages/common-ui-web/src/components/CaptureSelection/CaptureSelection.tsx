import { useTranslation } from 'react-i18next';
import { i18nWrap, useI18nSync, useMonkTheme } from '@monkvision/common';
import { styles } from './CaptureSelection.styles';
import { Button } from '../Button';
import { i18nCreateInspection } from './i18n';
import { useCaptureSelectionStyles } from './hooks';

/**
 * Props of the CaptureSelection component.
 */
export interface CaptureSelectionProps {
  /**
   * The language used by the component.
   *
   * @default en
   */
  lang?: string;
  /**
   * Callback called when the user clicks on "Add Damage" button.
   */
  onAddDamage?: () => void;
  /**
   * Callback called when the user clicks on "Take Picture" button.
   */
  onCapture?: () => void;
}

/**
 * A single page component that allows the user to select between "Add Damage" or "Photo Capture" workflow.
 */
export const CaptureSelection = i18nWrap(function CaptureSelection({
  lang,
  onAddDamage = () => {},
  onCapture = () => {},
}: CaptureSelectionProps) {
  useI18nSync(lang);
  const { t } = useTranslation();
  const { palette } = useMonkTheme();
  const style = useCaptureSelectionStyles();

  return (
    <div style={style.container} data-testid='add-damage-btn'>
      <div style={style.contentContainer}>
        <div style={styles['textcontainer']}>
          <span style={styles['title']}>{t('addDamage.title')}</span>
          <span style={style.description}>{t('addDamage.description')}</span>
        </div>
        <Button
          style={styles['button']}
          icon='add'
          primaryColor={palette.primary.base}
          onClick={onAddDamage}
          data-testid='add-damage-btn'
        >
          {t('addDamage.button')}
        </Button>
      </div>
      <div style={style.contentContainer}>
        <span style={styles['title']}>{t('capture.title')}</span>
        <span style={style.description}>{t('capture.description')}</span>
        <Button
          style={styles['button']}
          primaryColor={palette.primary.base}
          onClick={onCapture}
          data-testid='capture-btn'
        >
          {t('capture.button')}
        </Button>
      </div>
    </div>
  );
},
i18nCreateInspection);
