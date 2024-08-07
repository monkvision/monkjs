import { useEffect, useState } from 'react';
import { Button } from '@monkvision/common-ui-web';
import { CaptureAppConfig } from '@monkvision/types';
import { useTranslation } from 'react-i18next';
import { getLanguage } from '@monkvision/common';
import { usePhotoCaptureHUDButtonBackground } from '../../hooks';
import { styles } from './SightGuideline.styles';

/**
 * Props of the SightGuideline component.
 */
export interface SightGuidelineProps
  extends Pick<CaptureAppConfig, 'enableAddDamage' | 'sightGuidelines' | 'enableSightGuidelines'> {
  /**
   * The id of the sight.
   */
  sightId: string;
}

/**
 * Custom button displaying the sight guideline.
 */
export function SightGuideline({
  sightId,
  sightGuidelines,
  enableSightGuidelines,
  enableAddDamage,
}: SightGuidelineProps) {
  const [showGuideline, setShowGuideline] = useState(true);
  const primaryColor = usePhotoCaptureHUDButtonBackground();
  const { i18n } = useTranslation();

  const style = enableAddDamage ? styles['container'] : styles['containerWide'];

  const guidelineFound = sightGuidelines?.find((value) => value.sightIds.includes(sightId));

  const guideline = guidelineFound ? guidelineFound[getLanguage(i18n.language)] : undefined;

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
