import {
  useDeviceOrientation,
  useI18nSync,
  useLoadingState,
  usePreventExit,
} from '@monkvision/common';
import { useState } from 'react';
import { Camera, CameraHUDProps } from '@monkvision/camera-web';
import { MonkApiConfig } from '@monkvision/network';
import {
  TaskName,
  type BaseVideoCaptureConfig,
  type VideoCaptureHybridConfig,
} from '@monkvision/types';
import { useMonitoring } from '@monkvision/monitoring';
import { InspectionGallery } from '@monkvision/common-ui-web';
import { styles } from './VideoCapture.styles';
import { VideoCapturePermissions } from './VideoCapturePermissions';
import { VideoCaptureHUD, VideoCaptureHUDProps } from './VideoCaptureHUD';
import { useStartTasksOnComplete } from '../hooks';
import { useFastMovementsDetection, useGetInspection, useHybridVideoState } from './hooks';
import { VideoCaptureTutorial } from './VideoCaptureTutorial';
import { PhotoCapture, PhotoCaptureProps } from '../PhotoCapture/PhotoCapture';
import { VideoCaptureScreen } from './types';

/**
 * Base props shared by all VideoCapture configurations.
 */
export interface BaseVideoCaptureProps {
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
   * Callback called when the inspection is complete (after all workflows are finished).
   */
  onComplete?: () => void;
  /**
   * The language to be used by this component.
   *
   * @default en
   */
  lang?: string | null;
  /**
   * Callback called after a picture is taken. Hybrid mode only.
   */
  onPictureTaken?: PhotoCaptureProps['onPictureTaken'];
}

/**
 * Props of the VideoCapture component.
 */
export type VideoCaptureProps = BaseVideoCaptureProps & BaseVideoCaptureConfig;

/**
 * Props of the VideoCapture component when photo capture is enabled (hybrid mode).
 */
export type HybridVideoProps = BaseVideoCaptureProps & VideoCaptureHybridConfig;

// No ts-doc for this component : the component exported is VideoCaptureHOC
export function VideoCapture(props: VideoCaptureProps) {
  const {
    inspectionId,
    apiConfig,
    additionalTasks,
    startTasksOnComplete,
    enforceOrientation,
    minRecordingDuration = 15000,
    maxRetryCount = 3,
    enableFastWalkingWarning = true,
    enablePhoneShakingWarning = false,
    fastWalkingWarningCooldown = 1000,
    phoneShakingWarningCooldown = 1000,
    enableVideoTutorial = true,
    enableBeautyShotExtraction = true,
    onComplete,
    lang,
  } = props;
  useI18nSync(lang);
  const [screen, setScreen] = useState(VideoCaptureScreen.PERMISSIONS);
  const [isRecording, setIsRecording] = useState(false);
  const { handleError } = useMonitoring();
  const { onDeviceOrientationEvent, fastMovementsWarning, onWarningDismiss, resetDetection } =
    useFastMovementsDetection({
      isRecording,
      enableFastWalkingWarning,
      enablePhoneShakingWarning,
      fastWalkingWarningCooldown,
      phoneShakingWarningCooldown,
    });
  const { alpha, requestCompassPermission } = useDeviceOrientation({ onDeviceOrientationEvent });
  const inspectionLoading = useLoadingState();
  useGetInspection({ inspectionId, apiConfig, loading: inspectionLoading });
  const startTasksLoading = useLoadingState();

  const startTasks = useStartTasksOnComplete({
    inspectionId,
    apiConfig,
    additionalTasks: [...(additionalTasks ?? []), TaskName.DAMAGE_DETECTION],
    startTasksOnComplete,
    loading: startTasksLoading,
  });
  const { allowRedirect } = usePreventExit(true);
  const { enableHybridVideo, photoCaptureConfig } = useHybridVideoState({ props, allowRedirect });

  const handleInspectionCompleted = () => {
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

  const handleVideoCaptureCompleted = () => {
    if (enableHybridVideo) {
      setScreen(VideoCaptureScreen.PHOTO_CAPTURE);
    } else {
      handleInspectionCompleted();
    }
  };

  const handlePermissionsSuccess = () => {
    setScreen(enableVideoTutorial ? VideoCaptureScreen.TUTORIAL : VideoCaptureScreen.CAPTURE);
  };

  const videoCaptureHudProps: Omit<VideoCaptureHUDProps, keyof CameraHUDProps> = {
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
    resetDetection,
    startTasksLoading,
    enableHybridVideo,
    onComplete: handleVideoCaptureCompleted,
  };

  return (
    <div style={styles['container']}>
      {screen === VideoCaptureScreen.PERMISSIONS && (
        <VideoCapturePermissions
          requestCompassPermission={requestCompassPermission}
          onSuccess={handlePermissionsSuccess}
        />
      )}
      {screen === VideoCaptureScreen.TUTORIAL && (
        <VideoCaptureTutorial
          enforceOrientation={enforceOrientation}
          onClose={() => setScreen(VideoCaptureScreen.CAPTURE)}
        />
      )}
      {screen === VideoCaptureScreen.GALLERY && (
        <InspectionGallery
          inspectionId={inspectionId}
          apiConfig={apiConfig}
          captureMode={enableHybridVideo}
          sights={photoCaptureConfig?.sights ?? []}
          lang={lang}
          showBackButton={true}
          enableBeautyShotExtraction={enableBeautyShotExtraction}
          onBack={() => setScreen(VideoCaptureScreen.PHOTO_CAPTURE)}
          onValidate={handleInspectionCompleted}
          addDamage={photoCaptureConfig?.addDamage}
          isInspectionCompleted={false}
        />
      )}
      {screen === VideoCaptureScreen.CAPTURE && (
        <Camera HUDComponent={VideoCaptureHUD} hudProps={videoCaptureHudProps} />
      )}
      {screen === VideoCaptureScreen.PHOTO_CAPTURE && photoCaptureConfig && (
        <PhotoCapture
          {...photoCaptureConfig}
          enableBeautyShotExtraction={enableBeautyShotExtraction}
        />
      )}
    </div>
  );
}
