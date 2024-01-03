import { Camera, CameraHUDProps, MonkPicture } from '@monkvision/camera-web';
import { Sight } from '@monkvision/types';
import { i18nWrap } from '@monkvision/common';
import { PhotoCaptureHUD } from './PhotoCaptureHUD';
import { styles } from './PhotoCapture.styles';
import { useCameraConfig } from './hooks/useCameraConfig';
import { i18nAddDamage } from './i18n';

export interface PhotoCaptureProps {
  sights: Sight[];
}

export const PhotoCapture = i18nWrap(({ sights }: PhotoCaptureProps) => {
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
}, i18nAddDamage);
