import { useMemo } from 'react';
import { Sight } from '@monkvision/types';
import { i18nWrap } from '@monkvision/common';
import { CameraHUDProps } from '@monkvision/camera-web/lib/Camera/CameraHUD.types';
import { PhotoCaptureHUDButtons } from './PhotoCaptureHUDButtons';
import { PhotoCaptureHUDPreviewAddDamage } from './PhotoCaptureHUDPreviewAddDamage';
import { PhotoCaptureHUDPreview } from './PhotoCaptureHUDPreviewSight';
import { HUDMode, i18nAddDamage, usePhotoCaptureHUD } from './hook';
import { useSightState } from '../hooks/useSightState';

export interface PhotoCaptureHUDProps extends CameraHUDProps {
  mode: HUDMode;
  onAddDamage: (newMode: HUDMode) => void;
  sights: Sight[];
}

export const PhotoCaptureHUD = i18nWrap(
  ({ mode, sights, onAddDamage, cameraPreview, handle }: PhotoCaptureHUDProps) => {
    const { sightSelected, handleSightSelected, sightsTaken, handleSightTaken } =
      useSightState(sights);
    const style = usePhotoCaptureHUD();

    const hudPreview = useMemo(
      () =>
        mode === HUDMode.ADD_DAMAGE ? (
          <PhotoCaptureHUDPreviewAddDamage onAddDamage={onAddDamage} />
        ) : (
          <PhotoCaptureHUDPreview
            sights={sights}
            sightSelected={sightSelected}
            onSightSelected={handleSightSelected}
            sightsTaken={sightsTaken}
            onAddDamage={onAddDamage}
          />
        ),
      [mode, sightSelected, sightsTaken],
    );
    return (
      <div style={style.container}>
        <div style={style.previewContainer}>{cameraPreview}</div>
        {hudPreview}
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
