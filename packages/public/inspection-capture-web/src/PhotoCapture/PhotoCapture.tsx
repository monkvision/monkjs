import {
  Camera,
  CameraFacingMode,
  CameraHUDProps,
  CameraResolution,
  CompressionFormat,
  MonkPicture,
} from '@monkvision/camera-web';
import { Sight } from '@monkvision/types';
import { i18nWrap } from '@monkvision/common';
import { useState } from 'react';
import { PhotoCaptureHUD } from './PhotoCaptureHUD';
import { styles } from './PhotoCapture.styles';
import { i18nPhotoCaptureHUD } from './i18n';

export interface PhotoCaptureProps {
  sights: Sight[];
}

export const PhotoCapture = i18nWrap(({ sights }: PhotoCaptureProps) => {
  const [cameraState] = useState({
    facingMode: CameraFacingMode.ENVIRONMENT,
    resolution: CameraResolution.UHD_4K,
    compressionFormat: CompressionFormat.JPEG,
    quality: '0.8',
  });
  const hud = (props: CameraHUDProps) => <PhotoCaptureHUD sights={sights} {...props} />;

  const handleTakePicture = (picture: MonkPicture) => {
    console.log('Picture Taken :', picture);
  };

  return (
    <div style={styles['container']}>
      <Camera
        HUDComponent={hud}
        resolution={cameraState.resolution}
        format={cameraState.compressionFormat}
        quality={Number(cameraState.quality)}
        onPictureTaken={handleTakePicture}
      />
    </div>
  );
}, i18nPhotoCaptureHUD);
