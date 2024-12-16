import { useEffect, useState } from 'react';
import { Button } from '@monkvision/common-ui-web';
import { PhotoCaptureAppConfig } from '@monkvision/types';
import { useTranslation } from 'react-i18next';
import { getLanguage } from '@monkvision/common';
import { usePhotoCaptureHUDButtonBackground } from '../../hooks';
import { styles } from './SightGuideline.styles';

/**
 * Props of the SightGuideline component.
 */
export interface SightGuidelineProps
  extends Pick<
    PhotoCaptureAppConfig,
    'enableAddDamage' | 'sightGuidelines' | 'enableSightGuidelines'
  > {
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
}

/**
 * Custom button displaying the sight guideline.
 */
export function SightGuideline({
  sightId,
  sightGuidelines,
  enableSightGuidelines,
  enableAddDamage,
  enableDefaultMessage = false,
}: SightGuidelineProps) {
  const [showGuideline, setShowGuideline] = useState(true);
  const primaryColor = usePhotoCaptureHUDButtonBackground();
  const { i18n, t } = useTranslation();

  const style = enableAddDamage ? styles['container'] : styles['containerWide'];

  const guidelineFound = sightGuidelines?.find((value) => value.sightIds.includes(sightId));

  const defaultMessage = enableDefaultMessage
    ? t('photo.hud.guidelines.defaultGuideline')
    : undefined;

  const guideline = guidelineFound ? guidelineFound[getLanguage(i18n.language)] : defaultMessage;

  useEffect(() => setShowGuideline(true), [sightId]);

  return (
    <div style={style}>
      {enableSightGuidelines && showGuideline && guideline && (
        <Button
          icon='close'
          primaryColor={primaryColor}
          style={styles['button']}
          onClick={() => setShowGuideline(false)}
        >
          {guideline}
        </Button>
      )}
    </div>
  );
}
