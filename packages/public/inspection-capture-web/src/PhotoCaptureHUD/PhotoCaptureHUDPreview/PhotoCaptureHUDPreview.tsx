import { useEffect, useState } from 'react';
import { useObjectTranslation } from '@monkvision/common';
import { useTranslation } from 'react-i18next';
import { LabelDictionary } from '@monkvision/types';
import { Button } from '@monkvision/common-ui-web';
import { PhotoCaptureHUDPreview, usePhotoCaptureHUDPreview } from './hook';
import { PhotoCaptureHUDSightsSlider } from './PhotoCaptureHUDSightsSlider';
import { PhotoCaptureHUDCounter } from './PhotoCaptureHUDSightsCounter';

export interface PhotoCaptureHUDPreviewProps {
  sights: LabelDictionary;
  onAddDamage?: () => void;
}

export function PhotoCaptureHUDPreview({ sights, onAddDamage }: PhotoCaptureHUDPreviewProps) {
  const [currentSight, setCurrentSight] = useState('');
  const [sightsArray, setSightsArray] = useState(['']);

  const { i18n } = useTranslation();
  const { tObj } = useObjectTranslation();
  const style = usePhotoCaptureHUDPreview();

  useEffect(() => {
    // Set the first sight as the default value for the current sight
    setSightsArray(Object.values(sights).map((label) => tObj(label)));
  }, [i18n.language]);

  return (
    <div style={style.containerStyle}>
      <div style={style.top}>
        <PhotoCaptureHUDCounter sight={sightsArray} styles={style} />
        <Button onClick={onAddDamage}>+ Damage</Button>
      </div>
      <PhotoCaptureHUDSightsSlider
        sight={sightsArray}
        currentSight={currentSight}
        onSightSelected={(sight) => setCurrentSight(sight)}
        styles={style}
      />
    </div>
  );
}
