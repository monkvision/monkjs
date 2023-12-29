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

  const hud = (props: CameraHUDProps) => <PhotoCaptureHUD sights={sights} {...props} />;
  return (
    <div style={styles['container']}>
      <Camera
        HUDComponent={hud}
        facingMode={state.facingMode}
        resolution={state.resolution}
        format={state.compressionFormat}
        quality={Number(state.quality)}
        onPictureTaken={(picture: MonkPicture) => console.log('Picture Taken :', picture)}
      />
    </div>
  );
}
