import { Camera, CameraConfig, CameraHUDProps, CompressionOptions } from '@monkvision/camera-web';
import { Sight, TaskName } from '@monkvision/types';
import { useLoadingState } from '@monkvision/common';
import { ComplianceOptions, MonkAPIConfig } from '@monkvision/network';
import { useMonitoring } from '@monkvision/monitoring';
import { PhotoCaptureHUD, PhotoCaptureHUDProps } from './PhotoCaptureHUD';
import { styles } from './PhotoCapture.styles';
import {
  useAddDamageMode,
  usePhotoCaptureSightState,
  usePictureTaken,
  useStartTasksOnComplete,
  useUploadQueue,
} from './hooks';

/**
 * Props of the PhotoCapture component.
 */
export interface PhotoCaptureProps extends Partial<CameraConfig>, Partial<CompressionOptions> {
  /**
   * The list of sights to take pictures of. The values in this array should be retreived from the `@monkvision/sights`
   * package.
   */
  sights: Sight[];
  /**
   * The ID of the inspection to add images to. Make sure that the user that created the inspection if the same one as
   * the one described in the auth token in the `apiConfig` prop.
   */
  inspectionId: string;
  /**
   * The api config used to communicate with the API. Make sure that the user described in the auth token is the same
   * one as the one that created the inspection provided in the `inspectionId` prop.
   */
  apiConfig: MonkAPIConfig;
  /**
   * Options used to specify compliance checks to be run on the pictures taken by the user.
   */
  compliances?: ComplianceOptions;
  /**
   * Record associating each sight with a list of tasks to execute for it. If not provided, the default tasks of the
   * sight will be used.
   */
  tasksBySight?: Record<string, TaskName[]>;
  /**
   * Value indicating if tasks should be started at the end of the inspection :
   * - If not provided or if value is set to `false`, no tasks will be started.
   * - If set to `true`, the tasks described by the `tasksBySight` param (or, if not provided, the default tasks of each
   * sight) will be started.
   * - If an array of tasks is provided, the tasks started will be the ones contained in the array.
   */
  startTasksOnComplete?: boolean | TaskName[];
  /**
   * Callback called when the user clicks on the Close button. If this callback is not provided, the button will not be
   * displayed on the screen.
   */
  onClose?: () => void;
  /**
   * Callback called when inspection capture is complete.
   */
  onComplete?: () => void;
}

// No ts-doc for this component : the component exported is PhotoCaptureHOC
export function PhotoCapture({
  sights,
  inspectionId,
  apiConfig,
  tasksBySight,
  startTasksOnComplete = true,
  onClose,
  onComplete,
  compliances,
  ...cameraConfig
}: PhotoCaptureProps) {
  const { handleError } = useMonitoring();
  const loading = useLoadingState();
  const addDamageHandle = useAddDamageMode();
  const { startTasks } = useStartTasksOnComplete({
    inspectionId,
    apiConfig,
    sights,
    tasksBySight,
    startTasksOnComplete,
    loading,
  });
  const onLastSightTaken = () => {
    startTasks()
      .then(() => {
        onComplete?.();
      })
      .catch((err) => {
        loading.onError(err);
        handleError(err);
      });
  };
  const sightState = usePhotoCaptureSightState({
    inspectionId,
    captureSights: sights,
    apiConfig,
    loading,
    onLastSightTaken,
  });
  const uploadQueue = useUploadQueue({
    inspectionId,
    apiConfig,
    compliances,
    loading,
  });
  const { handlePictureTaken } = usePictureTaken({
    sightState,
    addDamageHandle,
    uploadQueue,
    tasksBySight,
  });

  const hudProps: Omit<PhotoCaptureHUDProps, keyof CameraHUDProps> = {
    sights,
    selectedSight: sightState.selectedSight,
    sightsTaken: sightState.sightsTaken,
    lastPictureTaken: sightState.lastPictureTaken,
    mode: addDamageHandle.mode,
    onSelectSight: sightState.selectSight,
    onAddDamage: addDamageHandle.handleAddDamage,
    onCancelAddDamage: addDamageHandle.handleCancelAddDamage,
    onRetry: sightState.retryLoadingInspection,
    loading,
    onClose,
    inspectionId,
  };

  return (
    <div style={styles['container']}>
      <Camera
        HUDComponent={PhotoCaptureHUD}
        onPictureTaken={handlePictureTaken}
        hudProps={hudProps}
        {...cameraConfig}
      />
    </div>
  );
}
