import { Camera, SimpleCameraHUD } from '@monkvision/camera-web';
import React from 'react';
import './CameraView.css';

export function CameraView() {
  return (
    <div className='camera-view-container'>
      <Camera
        HUDComponent={SimpleCameraHUD}
        onPictureTaken={(picture) => console.log('Picture Taken :', picture)}
      />
    </div>
  );
}
