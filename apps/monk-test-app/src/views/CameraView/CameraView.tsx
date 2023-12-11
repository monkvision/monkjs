import {
  Camera,
  CameraFacingMode,
  CameraResolution,
  CompressionFormat,
  MonkPicture,
  SimpleCameraHUD,
} from '@monkvision/camera-web';
import React, { useState } from 'react';
import './CameraView.css';
// import { LastPictureDetails, TestPanel } from './components';

export function CameraView() {
  const [state] = useState({
    facingMode: CameraFacingMode.ENVIRONMENT,
    resolution: CameraResolution.UHD_4K,
    compressionFormat: CompressionFormat.JPEG,
    quality: '0.8',
  });
  // const [lastPicture, setLastPicture] = useState<LastPictureDetails | null>(null);
  const handlePictureTaken = (picture: MonkPicture) => {
    console.log('Picture Taken :', picture);
    // setLastPicture({ picture, state });
  };

  return (
    <div className='camera-view-container'>
      <Camera
        HUDComponent={SimpleCameraHUD}
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
