import { useCallback } from 'react';
import { Camera, SimpleCameraHUD } from '@monkvision/camera-web';
import { MonkPicture } from '@monkvision/types';
import styles from './CameraPage.module.css';

export function CameraPage() {
  const handlePictureTaken = useCallback((picture: MonkPicture) => {
    console.log(picture);
  }, []);

  return (
    <div className={styles['container']}>
      <Camera HUDComponent={SimpleCameraHUD} onPictureTaken={handlePictureTaken} />
    </div>
  );
}
