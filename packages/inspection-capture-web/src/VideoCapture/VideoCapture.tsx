import {
  useDeviceOrientation,
  useI18nSync,
  useLoadingState,
  usePreventExit,
} from '@monkvision/common';
import { useState } from 'react';
import { Camera, CameraHUDProps } from '@monkvision/camera-web';
import { MonkApiConfig } from '@monkvision/network';
import { CameraConfig, VideoCaptureAppConfig } from '@monkvision/types';
import { useMonitoring } from '@monkvision/monitoring';
import { styles } from './VideoCapture.styles';
import { VideoCapturePermissions } from './VideoCapturePermissions';
import { VideoCaptureHUD, VideoCaptureHUDProps } from './VideoCaptureHUD';
import { useStartTasksOnComplete } from '../hooks';
import { useFastMovementsDetection } from './hooks';

/**
 * Props of the VideoCapture component.
 */
export interface VideoCaptureProps
  extends Pick<
    VideoCaptureAppConfig,
    | keyof CameraConfig
    | 'additionalTasks'
    | 'startTasksOnComplete'
    | 'enforceOrientation'
    | 'minRecordingDuration'
    | 'maxRetryCount'
    | 'enableFastWalkingWarning'
    | 'enablePhoneShakingWarning'
    | 'fastWalkingWarningCooldown'
    | 'phoneShakingWarningCooldown'
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
   * Callback called when the inspection is complete.
   */
  onComplete?: () => void;
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
  additionalTasks,
  startTasksOnComplete,
  enforceOrientation,
  minRecordingDuration = 15000,
  maxRetryCount = 3,
  enableFastWalkingWarning = true,
  enablePhoneShakingWarning = true,
  fastWalkingWarningCooldown = 1000,
  phoneShakingWarningCooldown = 1000,
  onComplete,
  lang,
}: VideoCaptureProps) {
  useI18nSync(lang);
  const [screen, setScreen] = useState(VideoCaptureScreen.PERMISSIONS);
  const [isRecording, setIsRecording] = useState(false);
  const { handleError } = useMonitoring();
  const { onDeviceOrientationEvent, fastMovementsWarning, onWarningDismiss } =
    useFastMovementsDetection({
      isRecording,
      enableFastWalkingWarning,
      enablePhoneShakingWarning,
      fastWalkingWarningCooldown,
      phoneShakingWarningCooldown,
    });
  const { alpha, requestCompassPermission } = useDeviceOrientation({ onDeviceOrientationEvent });
  const startTasksLoading = useLoadingState();

  const startTasks = useStartTasksOnComplete({
    inspectionId,
    apiConfig,
    additionalTasks,
    startTasksOnComplete,
    loading: startTasksLoading,
  });
  const { allowRedirect } = usePreventExit(true);

  const handleComplete = () => {
    startTasks()
      .then(() => {
        allowRedirect();
        onComplete?.();
      })
      .catch((err) => {
        startTasksLoading.onError(err);
        handleError(err);
      });
  };

  const hudProps: Omit<VideoCaptureHUDProps, keyof CameraHUDProps> = {
    inspectionId,
    maxRetryCount,
    apiConfig,
    minRecordingDuration,
    enforceOrientation,
    isRecording,
    setIsRecording,
    alpha,
    fastMovementsWarning,
    onWarningDismiss,
    startTasksLoading,
    onComplete: handleComplete,
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
