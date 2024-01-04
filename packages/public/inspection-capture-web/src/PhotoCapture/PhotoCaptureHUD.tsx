import { useMemo, useState } from 'react';
import { Sight } from '@monkvision/types';
import { CameraHUDProps } from '@monkvision/camera-web/lib/Camera/CameraHUD.types';
import { PhotoCaptureHUDButtons } from './PhotoCaptureHUDButtons';
import { PhotoCaptureHUDAddDamagePreview } from './PhotoCaptureHUDAddDamagePreview';
import { PhotoCaptureHUDSightPreview } from './PhotoCaptureHUDSightPreview';
import { HUDMode, usePhotoCaptureHUDStyle } from './hook';
import { useSightState } from './hooks';

export interface PhotoCaptureHUDProps extends CameraHUDProps {
  sights: Sight[];
}

export function PhotoCaptureHUD({ sights, cameraPreview, handle }: PhotoCaptureHUDProps) {
  const [mode, setMode] = useState<HUDMode>(HUDMode.DEFAULT);
  const { selectedSight, setSelectedSight, sightsTaken, handleSightTaken } = useSightState(sights);
  const style = usePhotoCaptureHUDStyle();

  const hudPreview = useMemo(
    () =>
      mode === HUDMode.ADD_DAMAGE ? (
        <PhotoCaptureHUDAddDamagePreview onCancel={() => setMode(HUDMode.DEFAULT)} />
      ) : (
        <PhotoCaptureHUDSightPreview
          sights={sights}
          selectedSight={selectedSight}
          onSelectedSight={setSelectedSight}
          sightsTaken={sightsTaken}
          onAddDamage={() => setMode(HUDMode.ADD_DAMAGE)}
          streamDimensions={handle?.dimensions}
        />
      ),
    [mode, selectedSight, sightsTaken, handle?.dimensions],
  );
  return (
    <div style={style.container}>
      <div style={style.previewContainer} data-testid='camera-preview'>
        {cameraPreview}
        {hudPreview}
      </div>
      <PhotoCaptureHUDButtons
        onTakePicture={() => {
          handle?.takePicture?.();
          handleSightTaken();
        }}
      />
    </div>
  );
}
