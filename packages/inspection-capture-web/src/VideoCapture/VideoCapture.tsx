import { useI18nSync, useDeviceOrientation } from '@monkvision/common';
import { useState } from 'react';
import { Camera, CameraHUDProps } from '@monkvision/camera-web';
import { MonkApiConfig } from '@monkvision/network';
import { CameraConfig, VideoCaptureAppConfig } from '@monkvision/types';
import { styles } from './VideoCapture.styles';
import { VideoCapturePermissions } from './VideoCapturePermissions';
import { VideoCaptureHUD, VideoCaptureHUDProps } from './VideoCaptureHUD';
import { useVideoUploadQueue } from './hooks';

/**
 * Props of the VideoCapture component.
 */
export interface VideoCaptureProps
  extends Pick<
    VideoCaptureAppConfig,
    | keyof CameraConfig
    | 'maxUploadDurationWarning'
    | 'useAdaptiveImageQuality'
    | 'additionalTasks'
    | 'startTasksOnComplete'
    | 'enforceOrientation'
    | 'minRecordingDuration'
    | 'maxRetryCount'
  > {
  /**
   * The ID of the inspection to add the video frames to.
   */
  inspectionId: string;
  /**
   * The api config used to communicate with the API. Make sure that the user described in the auth token is the same
   * one as the one that created the inspection provided in the `inspectionId` prop.
   */
  apiConfig: MonkApiConfig;
  /**
   * The language to be used by this component.
   *
   * @default en
   */
  lang?: string | null;
}

enum VideoCaptureScreen {
  PERMISSIONS = 'permissions',
  CAPTURE = 'capture',
}

// No ts-doc for this component : the component exported is VideoCaptureHOC
export function VideoCapture({
  inspectionId,
  apiConfig,
  maxUploadDurationWarning,
  useAdaptiveImageQuality,
  additionalTasks,
  startTasksOnComplete,
  enforceOrientation,
  minRecordingDuration = 15000,
  maxRetryCount = 3,
  lang,
}: VideoCaptureProps) {
  useI18nSync(lang);
  const [screen, setScreen] = useState(VideoCaptureScreen.PERMISSIONS);
  const { requestCompassPermission, alpha } = useDeviceOrientation();
  const { onFrameSelected } = useVideoUploadQueue({ apiConfig, inspectionId, maxRetryCount });

  const hudProps: Omit<VideoCaptureHUDProps, keyof CameraHUDProps> = {
    alpha,
    minRecordingDuration,
    onRecordingComplete: () => console.log('Recording complete!'),
    onFrameSelected,
  };

  return (
    <div style={styles['container']}>
      {screen === VideoCaptureScreen.PERMISSIONS && (
        <VideoCapturePermissions
          requestCompassPermission={requestCompassPermission}
          onSuccess={() => setScreen(VideoCaptureScreen.CAPTURE)}
        />
      )}
      {screen === VideoCaptureScreen.CAPTURE && (
        <Camera HUDComponent={VideoCaptureHUD} hudProps={hudProps} />
      )}
    </div>
  );
}
