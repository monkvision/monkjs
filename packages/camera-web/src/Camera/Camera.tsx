import React, { useCallback, useMemo } from 'react';
import {
  CameraConfig,
  CameraEventHandlers,
  CameraHUDComponent,
  useCameraHUD,
  useCameraPreview,
  useCameraScreenshot,
} from './hooks';
import './Camera.css';

export interface CameraProps extends CameraConfig, CameraEventHandlers {
  HUDComponent?: CameraHUDComponent;
}

export function Camera({ options, HUDComponent, ...eventHandlers }: CameraProps) {
  const {
    videoRef,
    dimensions,
    error,
    retry,
    isLoading: isPreviewLoading,
  } = useCameraPreview({ options });
  const { canvasRef, takeScreenshot } = useCameraScreenshot({ videoRef, dimensions });
  const isLoading = useMemo(() => isPreviewLoading, [isPreviewLoading]);
  const takePicture = useCallback(() => takeScreenshot(), [takeScreenshot]);
  const HUDElement = useCameraHUD({
    component: HUDComponent,
    handle: { takePicture, error, retry, isLoading },
    eventHandlers,
  });

  return (
    <div className='camera-container'>
      <video ref={videoRef} className='camera-preview' autoPlay playsInline controls={false} />
      <canvas ref={canvasRef} className='camera-canvas' />
      <div className='hud-container'>{HUDElement}</div>
    </div>
  );
}
