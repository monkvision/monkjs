import { useEffect, useState } from 'react';
import { PhotoCaptureAppConfig } from '@monkvision/types';
import { useTranslation } from 'react-i18next';
import { getLanguage } from '@monkvision/common';
import { styles } from './SightGuideline.styles';
import { useSightGuidelineStyle } from './hooks';

/**
 * Props of the SightGuideline component.
 */
export interface SightGuidelineProps
  extends Pick<PhotoCaptureAppConfig, 'addDamage' | 'sightGuidelines'> {
  /**
   * The id of the sight.
   */
  sightId: string;
  /**
   * Display a default message if no sightGuideline is found.
   *
   * @default false
   */
  enableDefaultMessage?: boolean;
  /**
   * Boolean indicating if the sight guidelines are enabled.
   *
   * @default true
   */
  disabled?: boolean;
  /**
   * Callback called when the user clicks on both: 'disable' checkbox and 'okay' button.
   */
  onDisableSightGuidelines?: () => void;
}

/**
 * Custom button displaying the sight guideline.
 */
export function SightGuideline({
  sightId,
  sightGuidelines,
  addDamage,
  enableDefaultMessage = false,
  disabled = false,
  onDisableSightGuidelines = () => {},
}: SightGuidelineProps) {
  const [showGuideline, setShowGuideline] = useState(true);
  const [checked, setChecked] = useState(false);

  const { i18n, t } = useTranslation();
  const style = useSightGuidelineStyle({ addDamage });

  const guidelineFound = sightGuidelines?.find((value) => value.sightIds.includes(sightId));

  const defaultMessage = enableDefaultMessage
    ? t('photo.hud.guidelines.defaultGuideline')
    : undefined;

  const guideline = guidelineFound ? guidelineFound[getLanguage(i18n.language)] : defaultMessage;

  const handleShowSightGuidelines = () => {
    if (checked) {
      onDisableSightGuidelines();
    }
    setShowGuideline(false);
  };

  useEffect(() => setShowGuideline(true), [sightId]);

  return (
    <div style={style.container} data-testid='container'>
      {!disabled && showGuideline && guideline && (
        <div style={style.guideline} data-testid='guideline'>
          {guideline}
          <div style={styles['buttonContainer']}>
            <div
              style={styles['checkbox']}
              role='checkbox'
              aria-checked={checked}
              tabIndex={0}
              onClick={() => setChecked(!checked)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setChecked(!checked);
                }
              }}
              data-testid='checkbox-container'
            >
              <input type='checkbox' checked={checked} onChange={(e) => e.stopPropagation()} />
              <span>{t('photo.hud.guidelines.disable')}</span>
            </div>
            <button
              style={styles['button']}
              onClick={handleShowSightGuidelines}
              data-testid='button'
            >
              {t('photo.hud.guidelines.validate')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
