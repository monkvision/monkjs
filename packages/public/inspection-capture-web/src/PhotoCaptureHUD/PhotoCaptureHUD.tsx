import { useState } from 'react';
import { Sight } from '@monkvision/types';
import { PhotoCaptureHUDPreview } from './PhotoCaptureHUDPreview';
import { PhotoCaptureHUDButtons } from './PhotoCaptureHUDButtons';
import { styles } from './PhotoCaptureHUD.styles';
import { PhotoCaptureHUDAddDamageMenu } from './PhotoCaptureHUDPreview/PhotoCaptureHUDAddDamageMenu';

export interface PhotoCaptureHUDProps {
  sights?: Sight[];
}

export function PhotoCaptureHUD({ sights }: PhotoCaptureHUDProps) {
  const [currentSight, setCurrentSight] = useState(sights?.[0]);
  const [isOnAddDamage, setIsOnAddDamage] = useState<boolean>(false);
  const [sightsTaken] = useState(0);

  const handleOnSightSelected = (sight: Sight): void => {
    setCurrentSight(sight);
  };

  const handleOnAddDamage = (state: boolean): void => {
    setIsOnAddDamage(state);
  };

  return (
    <div style={styles['container']}>
      {!isOnAddDamage ? (
        <PhotoCaptureHUDPreview
          sights={sights}
          currentSight={currentSight}
          onSightSelected={handleOnSightSelected}
          sightsTaken={sightsTaken}
          onAddDamage={handleOnAddDamage}
        />
      ) : (
        <PhotoCaptureHUDAddDamageMenu onAddDamage={handleOnAddDamage} />
      )}
      <PhotoCaptureHUDButtons />
    </div>
  );
}
