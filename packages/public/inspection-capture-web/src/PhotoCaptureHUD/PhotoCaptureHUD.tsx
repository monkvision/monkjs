import { useMemo } from 'react';
import { Sight } from '@monkvision/types';
import { i18nWrap } from '@monkvision/common';
import { CameraHUDProps } from '@monkvision/camera-web/lib/Camera/CameraHUD.types';
import { PhotoCaptureHUDButtons } from './PhotoCaptureHUDButtons';
import { PhotoCaptureHUDAddDamagePreview } from './PhotoCaptureHUDAddDamagePreview';
import { PhotoCaptureHUDSightPreview } from './PhotoCaptureHUDSightPreview';
import { HUDMode, usePhotoCaptureHUD } from './hook';
import { useSightState, useHUDMode } from '../hooks';
import { i18nAddDamage } from './i18n';

export interface PhotoCaptureHUDProps extends CameraHUDProps {
  sights: Sight[];
}

export const PhotoCaptureHUD = i18nWrap(
  ({ sights, cameraPreview, handle }: PhotoCaptureHUDProps) => {
    const { sightSelected, handleSightSelected, sightsTaken, handleSightTaken } =
      useSightState(sights);
    const style = usePhotoCaptureHUD();
    const { mode, handleAddDamage } = useHUDMode();

    const hudPreview = useMemo(
      () =>
        mode === HUDMode.ADD_DAMAGE ? (
          <PhotoCaptureHUDAddDamagePreview onAddDamage={handleAddDamage} />
        ) : (
          <PhotoCaptureHUDSightPreview
            sights={sights}
            sightSelected={sightSelected}
            onSightSelected={handleSightSelected}
            sightsTaken={sightsTaken}
            onAddDamage={handleAddDamage}
          />
        ),
      [mode, sightSelected, sightsTaken],
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
  },
  i18nAddDamage,
);
