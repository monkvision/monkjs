import { useEffect, useMemo, useState } from 'react';
import { Button } from '@monkvision/common-ui-web';
import { SightGuideline, MonkLanguage, monkLanguages } from '@monkvision/types';
import { useTranslation } from 'react-i18next';
import { usePhotoCaptureHUDButtonBackground } from '../../hooks';
import { styles } from './SightGuideline.styles';
import { getVisilityStyle } from '../utils';

/**
 * Props of the SightGuidelineButton component.
 */
export interface SightGuidelineButtonProps {
  /**
   * The id of the sight.
   */
  sightId: string;
  /**
   * A collection of sight guidelines in different language with a list of sightIds associate to it.
   */
  sightGuidelines?: SightGuideline[];
  /**
   * Boolean indicating whether the sight guideline feature is enabled. If disabled, the guideline text will be hidden.
   *
   * @default true
   */
  enableSightGuideline?: boolean;
  /**
   * Boolean indicating whether the Add Damage feature is enabled. If disabled, the `Add Damage` button will be hidden.
   *
   * @default true
   */
  enableAddDamage?: boolean;
}

function getLanguage(language: string): MonkLanguage {
  const languagePrefix = language.slice(0, 2) as MonkLanguage;
  return monkLanguages.includes(languagePrefix) ? languagePrefix : 'en';
}

/**
 * Custom button displaying the sight guideline.
 */
export function SightGuidelineButton({
  sightId,
  sightGuidelines,
  enableSightGuideline,
  enableAddDamage,
}: SightGuidelineButtonProps) {
  const [showGuideline, setShowGuideline] = useState(true);
  const primaryColor = usePhotoCaptureHUDButtonBackground();
  const { i18n } = useTranslation();

  const style = useMemo(
    () => (enableAddDamage ? styles['container'] : styles['containerWide']),
    [enableAddDamage, styles],
  );

  const guideline = useMemo(() => {
    const guidelineFound = sightGuidelines?.find((value) => value.sightIds.includes(sightId));
    return guidelineFound ? guidelineFound[getLanguage(i18n.language)] : undefined;
  }, [sightId, sightGuidelines]);

  useEffect(() => setShowGuideline(true), [sightId]);

  return (
    <div style={style}>
      {showGuideline && guideline && (
        <Button
          icon='close'
          primaryColor={primaryColor}
          style={{ ...styles['button'], ...getVisilityStyle(enableSightGuideline) }}
          disabled={!enableSightGuideline}
          onClick={() => setShowGuideline(false)}
        >
          {guideline}
        </Button>
      )}
    </div>
  );
}
