import React from 'react';
import { CameraConfig, useCamera } from './hooks';
import './styles.css';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CameraProps extends CameraConfig {}

export function Camera({ options }: CameraProps) {
  const { videoRef } = useCamera({ options });

  return (
    <div className='camera-container'>
      <video className='camera-preview' autoPlay playsInline ref={videoRef} controls={false} />
    </div>
  );
}
