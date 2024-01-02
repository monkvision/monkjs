import React from 'react';
import { Camera, CameraHUDProps, MonkPicture } from '@monkvision/camera-web';
import { Sight } from '@monkvision/types';
import { PhotoCaptureHUD } from './PhotoCaptureHUD';
import { styles } from './PhotoCapture.styles';
import { useCameraConfig } from './hooks/useCameraConfig';

export interface PhotoCaptureProps {
  sights: Sight[];
}

export function PhotoCapture({ sights }: PhotoCaptureProps) {
  const { cameraState } = useCameraConfig();
  const hud = (props: CameraHUDProps) => <PhotoCaptureHUD sights={sights} {...props} />;
  return (
    <div style={styles['container']}>
      <Camera
        HUDComponent={hud}
        facingMode={cameraState.facingMode}
        resolution={cameraState.resolution}
        format={cameraState.compressionFormat}
        quality={Number(cameraState.quality)}
        onPictureTaken={(picture: MonkPicture) => console.log('Picture Taken :', picture)}
      />
    </div>
  );
}
