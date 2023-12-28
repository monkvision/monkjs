import React, { useState } from 'react';
import {
  Camera,
  CameraFacingMode,
  CameraHUDProps,
  CameraResolution,
  CompressionFormat,
  MonkPicture,
} from '@monkvision/camera-web';
import { Sight } from '@monkvision/types';
import { PhotoCaptureHUD } from './PhotoCaptureHUD';
import { styles } from './PhotoCapture.styles';
import { HUDMode } from './PhotoCaptureHUD/hook';

export interface PhotoCaptureProps {
  sights: Sight[];
}

export function PhotoCapture({ sights }: PhotoCaptureProps) {
  const [state] = useState({
    facingMode: CameraFacingMode.ENVIRONMENT,
    resolution: CameraResolution.UHD_4K,
    compressionFormat: CompressionFormat.JPEG,
    quality: '0.8',
  });
  const [mode, setMode] = useState<HUDMode>(HUDMode.DEFAULT);
  const handlePictureTaken = (picture: MonkPicture) => {
    console.log('Picture Taken :', picture);
  };

  const handleOnAddDamage = (newMode: HUDMode): void => {
    setMode(newMode);
  };

  const hud = (props: CameraHUDProps) => (
    <PhotoCaptureHUD mode={mode} sights={sights} onAddDamage={handleOnAddDamage} {...props} />
  );
  return (
    <div style={styles['container']}>
      <Camera
        HUDComponent={hud}
        facingMode={state.facingMode}
        resolution={state.resolution}
        format={state.compressionFormat}
        quality={Number(state.quality)}
        onPictureTaken={handlePictureTaken}
      />
      {/* <TestPanel lastPicture={lastPicture} state={state} onChange={setState} /> */}
    </div>
  );
}
