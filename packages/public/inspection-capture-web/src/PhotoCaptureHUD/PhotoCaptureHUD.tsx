import { useState } from 'react';
import { Sight } from '@monkvision/types';
import { PhotoCaptureHUDPreview } from './PhotoCaptureHUDPreview';
import { PhotoCaptureHUDButtons } from './PhotoCaptureHUDButtons';
import { styles } from './PhotoCaptureHUD.styles';

export interface PhotoCaptureHUDProps {
  sights?: Sight[];
}

export function PhotoCaptureHUD({ sights }: PhotoCaptureHUDProps) {
  const [currentSight, setCurrentSight] = useState(sights?.[0]);
  const [sightsTaken] = useState(0);

  const handleOnSightSelected = (sight: Sight): void => {
    setCurrentSight(sight);
  };

  return (
    <div style={styles['container']}>
      <PhotoCaptureHUDPreview
        sights={sights}
        currentSight={currentSight}
        onSightSelected={handleOnSightSelected}
        sightsTaken={sightsTaken}
      />
      <PhotoCaptureHUDButtons />
    </div>
  );
}
