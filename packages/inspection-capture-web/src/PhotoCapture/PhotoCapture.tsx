import { useState } from 'react';
import { Camera, CameraHUDProps, CameraProps, CompressionOptions } from '@monkvision/camera-web';
import { ComplianceOptions, DeviceOrientation, Sight, TaskName } from '@monkvision/types';
import { useI18nSync, useLoadingState, useWindowDimensions } from '@monkvision/common';
import { MonkApiConfig } from '@monkvision/network';
import { useMonitoring } from '@monkvision/monitoring';
import {
  Icon,
  InspectionGallery,
  NavigateToCaptureOptions,
  NavigateToCaptureReason,
} from '@monkvision/common-ui-web';
import { useTranslation } from 'react-i18next';
import {
  useAddDamageMode,
  usePhotoCaptureImages,
  usePhotoCaptureSightState,
  usePictureTaken,
  useStartTasksOnComplete,
  useUploadQueue,
} from './hooks';
import { PhotoCaptureHUD, PhotoCaptureHUDProps } from './PhotoCaptureHUD';
import { styles } from './PhotoCapture.styles';

/**
 * Props of the PhotoCapture component.
 */
export interface PhotoCaptureProps
  extends Pick<CameraProps<PhotoCaptureHUDProps>, 'resolution' | 'allowImageUpscaling'>,
    Partial<CompressionOptions>,
    Partial<ComplianceOptions> {
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
  apiConfig: MonkApiConfig;
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
  /**
   * Boolean indicating if the close button should be displayed in the HUD on top of the Camera preview.
   *
   * @default false
   */
  showCloseButton?: boolean;
  /**
   * The language to be used by this component.
   *
   * @default en
   */
  lang?: string | null;
  /**
   * Use this prop to enforce a specific device orientation for the Camera screen.
   */
  enforceOrientation?: DeviceOrientation;
  /**
   * If compliance is enabled, this prop indicate if the user is allowed to skip the retaking process if pictures are
   * not compliant.
   *
   * @default false
   */
  allowSkipRetake?: boolean;
  /**
   * Boolean indicating if `Add Damage` feature should be enabled or not. If disabled, the `Add Damage` button will be hidden.
   *
   * @default true
   */
  enableAddDamage?: boolean;
}

enum PhotoCaptureScreen {
  CAMERA = 'camera',
  GALLERY = 'gallery',
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
  showCloseButton = false,
  enableCompliance = true,
  enableCompliancePerSight,
  complianceIssues,
  complianceIssuesPerSight,
  useLiveCompliance = false,
  allowSkipRetake = false,
  enableAddDamage = true,
  lang,
  enforceOrientation,
  ...cameraConfig
}: PhotoCaptureProps) {
  useI18nSync(lang);
  const complianceOptions: ComplianceOptions = {
    enableCompliance,
    enableCompliancePerSight,
    complianceIssues,
    complianceIssuesPerSight,
    useLiveCompliance,
  };
  const { t } = useTranslation();
  const { handleError } = useMonitoring();
  const [currentScreen, setCurrentScreen] = useState(PhotoCaptureScreen.CAMERA);
  const dimensions = useWindowDimensions();
  const loading = useLoadingState();
  const addDamageHandle = useAddDamageMode();
  const startTasks = useStartTasksOnComplete({
    inspectionId,
    apiConfig,
    sights,
    tasksBySight,
    startTasksOnComplete,
    loading,
  });
  const onLastSightTaken = () => {
    setCurrentScreen(PhotoCaptureScreen.GALLERY);
  };
  const sightState = usePhotoCaptureSightState({
    inspectionId,
    captureSights: sights,
    apiConfig,
    loading,
    onLastSightTaken,
    tasksBySight,
    complianceOptions,
  });
  const uploadQueue = useUploadQueue({
    inspectionId,
    apiConfig,
    complianceOptions,
  });
  const images = usePhotoCaptureImages(inspectionId);
  const handlePictureTaken = usePictureTaken({
    sightState,
    addDamageHandle,
    uploadQueue,
    tasksBySight,
  });
  const handleOpenGallery = () => setCurrentScreen(PhotoCaptureScreen.GALLERY);
  const handleGalleryBack = () => setCurrentScreen(PhotoCaptureScreen.CAMERA);
  const handleNavigateToCapture = (options: NavigateToCaptureOptions) => {
    if (options.reason === NavigateToCaptureReason.ADD_DAMAGE) {
      addDamageHandle.handleAddDamage();
    } else if (options.reason === NavigateToCaptureReason.CAPTURE_SIGHT) {
      const selectedSight = sights.find((sight) => sight.id === options.sightId);
      if (!selectedSight) {
        return;
      }
      sightState.selectSight(selectedSight);
    } else if (options.reason === NavigateToCaptureReason.RETAKE_PICTURE) {
      sightState.retakeSight(options.sightId);
    }
    setCurrentScreen(PhotoCaptureScreen.CAMERA);
  };
  const handleGalleryValidate = () => {
    startTasks()
      .then(() => {
        onComplete?.();
      })
      .catch((err) => {
        loading.onError(err);
        handleError(err);
      });
  };
  const isViolatingEnforcedOrientation =
    enforceOrientation &&
    dimensions &&
    (enforceOrientation === DeviceOrientation.PORTRAIT) !== dimensions.isPortrait;

  const hudProps: Omit<PhotoCaptureHUDProps, keyof CameraHUDProps> = {
    sights,
    selectedSight: sightState.selectedSight,
    sightsTaken: sightState.sightsTaken,
    lastPictureTaken: sightState.lastPictureTaken,
    mode: addDamageHandle.mode,
    onOpenGallery: handleOpenGallery,
    onSelectSight: sightState.selectSight,
    onRetakeSight: sightState.retakeSight,
    onAddDamage: addDamageHandle.handleAddDamage,
    onCancelAddDamage: addDamageHandle.handleCancelAddDamage,
    onRetry: sightState.retryLoadingInspection,
    loading,
    onClose,
    inspectionId,
    showCloseButton,
    images,
    enableAddDamage,
  };

  return (
    <div style={styles['container']}>
      {currentScreen === PhotoCaptureScreen.CAMERA && isViolatingEnforcedOrientation && (
        <div style={styles['orientationErrorContainer']}>
          <div style={styles['orientationErrorTitleContainer']}>
            <Icon icon='rotate' primaryColor='text-primary' size={30} />
            <div style={styles['orientationErrorTitle']}>{t('photo.orientationError.title')}</div>
          </div>
          <div style={styles['orientationErrorDescription']}>
            {t('photo.orientationError.description')}
          </div>
        </div>
      )}
      {currentScreen === PhotoCaptureScreen.CAMERA && !isViolatingEnforcedOrientation && (
        <Camera
          HUDComponent={PhotoCaptureHUD}
          onPictureTaken={handlePictureTaken}
          hudProps={hudProps}
          {...cameraConfig}
        />
      )}
      {currentScreen === PhotoCaptureScreen.GALLERY && (
        <InspectionGallery
          inspectionId={inspectionId}
          apiConfig={apiConfig}
          captureMode={true}
          lang={lang}
          showBackButton={true}
          sights={sights}
          allowSkipRetake={allowSkipRetake}
          enableCompliance={enableCompliance}
          enableCompliancePerSight={enableCompliancePerSight}
          complianceIssues={complianceIssues}
          complianceIssuesPerSight={complianceIssuesPerSight}
          useLiveCompliance={useLiveCompliance}
          onBack={handleGalleryBack}
          onNavigateToCapture={handleNavigateToCapture}
          onValidate={handleGalleryValidate}
        />
      )}
    </div>
  );
}
