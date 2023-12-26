import { useState } from 'react';
import { Sight } from '@monkvision/types';
import { i18nWrap } from '@monkvision/common';
import { PhotoCaptureHUDButtons } from './PhotoCaptureHUDButtons';
import { PhotoCaptureHUDPreviewAddDamage } from './PhotoCaptureHUDPreviewAddDamage';
import { PhotoCaptureHUDPreview } from './PhotoCaptureHUDPreviewSight';
import { HUDMode, i18nAddDamage, usePhotoCaptureHUD } from './hook';

export interface PhotoCaptureHUDProps {
  sights: Sight[];
}

export const PhotoCaptureHUD = i18nWrap(({ sights }: PhotoCaptureHUDProps) => {
  const [currentSight, setCurrentSight] = useState<Sight>(sights[0]);
  const [currentSightSliderIndex, setCurrentSightSliderIndex] = useState(0);
  const [mode, setMode] = useState<HUDMode>(HUDMode.DEFAULT);
  const [sightsTaken, setSightsTaken] = useState<Sight[]>([]);

  const handleOnSightSelected = (sight: Sight, index: number): void => {
    setCurrentSight(sight);
    setCurrentSightSliderIndex(index);
  };

  const handleOnAddDamage = (newMode: HUDMode): void => {
    setMode(newMode);
  };

  const renderSelectedHUDMode = () => {
    switch (mode) {
      case HUDMode.DEFAULT:
        return (
          <PhotoCaptureHUDPreview
            sights={sights}
            currentSight={currentSight}
            onSightSelected={handleOnSightSelected}
            sightsTaken={sightsTaken}
            onAddDamage={handleOnAddDamage}
            currentSightSliderIndex={currentSightSliderIndex}
          />
        );
      case HUDMode.ADD_DAMAGE:
        return <PhotoCaptureHUDPreviewAddDamage onAddDamage={handleOnAddDamage} />;

      default:
        return null;
    }
  };
  const style = usePhotoCaptureHUD();
  return (
    <div style={style.container}>
      {renderSelectedHUDMode()}
      <PhotoCaptureHUDButtons
        onTakePicture={() => {
          if (currentSight && !sightsTaken.some((sightTaken) => sightTaken === currentSight))
            setSightsTaken([...sightsTaken, currentSight]);
        }}
      />
    </div>
  );
}, i18nAddDamage);
