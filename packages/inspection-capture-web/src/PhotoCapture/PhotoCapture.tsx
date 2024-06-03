import { useState } from 'react';
import { Camera, CameraHUDProps, CameraProps } from '@monkvision/camera-web';
import {
  CaptureAppConfig,
  ComplianceOptions,
  DeviceOrientation,
  Sight,
  CompressionOptions,
  CameraConfig,
} from '@monkvision/types';
import {
  useI18nSync,
  useLoadingState,
  useWindowDimensions,
  useObjectMemo,
} from '@monkvision/common';
import { MonkApiConfig } from '@monkvision/network';
import { useAnalytics } from '@monkvision/analytics';
import { useMonitoring } from '@monkvision/monitoring';
import {
  BackdropDialog,
  Icon,
  InspectionGallery,
  NavigateToCaptureOptions,
  NavigateToCaptureReason,
} from '@monkvision/common-ui-web';
import { useTranslation } from 'react-i18next';
import {
  useAddDamageMode,
  usePhotoCaptureImages,
  useComplianceAnalytics,
  usePhotoCaptureSightState,
  usePictureTaken,
  useStartTasksOnComplete,
  useUploadQueue,
  useBadConnectionWarning,
  useAdaptiveCameraConfig,
} from './hooks';
import { PhotoCaptureHUD, PhotoCaptureHUDProps } from './PhotoCaptureHUD';
import { styles } from './PhotoCapture.styles';

/**
 * Props of the PhotoCapture component.
 */
export interface PhotoCaptureProps
  extends Pick<CameraProps<PhotoCaptureHUDProps>, 'resolution' | 'allowImageUpscaling'>,
    Pick<
      CaptureAppConfig,
      | keyof CameraConfig
      | 'maxUploadDurationWarning'
      | 'useAdaptiveImageQuality'
      | 'tasksBySight'
      | 'startTasksOnComplete'
      | 'showCloseButton'
      | 'enforceOrientation'
      | 'allowSkipRetake'
      | 'enableAddDamage'
    >,
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
   * Callback called when the user clicks on the Close button. If this callback is not provided, the button will not be
   * displayed on the screen.
   */
  onClose?: () => void;
  /**
   * Callback called when inspection capture is complete.
   */
  onComplete?: () => void;
  /**
   * The language to be used by this component.
   *
   * @default en
   */
  lang?: string | null;
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
  maxUploadDurationWarning = 15000,
  showCloseButton = false,
  enableCompliance = true,
  enableCompliancePerSight,
  complianceIssues,
  complianceIssuesPerSight,
  customComplianceThresholds,
  customComplianceThresholdsPerSight,
  useLiveCompliance = false,
  allowSkipRetake = false,
  enableAddDamage = true,
  useAdaptiveImageQuality = true,
  lang,
  enforceOrientation,
  ...initialCameraConfig
}: PhotoCaptureProps) {
  useI18nSync(lang);
  const complianceOptions: ComplianceOptions = useObjectMemo({
    enableCompliance,
    enableCompliancePerSight,
    complianceIssues,
    complianceIssuesPerSight,
    useLiveCompliance,
    customComplianceThresholds,
    customComplianceThresholdsPerSight,
  });
  const { t } = useTranslation();
  const { handleError } = useMonitoring();
  const [currentScreen, setCurrentScreen] = useState(PhotoCaptureScreen.CAMERA);
  const dimensions = useWindowDimensions();
  const analytics = useAnalytics();
  const loading = useLoadingState();
  const addDamageHandle = useAddDamageMode();
  useComplianceAnalytics({ inspectionId, sights });
  const { adaptiveCameraConfig, uploadEventHandlers: adaptiveUploadEventHandlers } =
    useAdaptiveCameraConfig({
      initialCameraConfig,
      useAdaptiveImageQuality,
    });
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
  const {
    isBadConnectionWarningDialogDisplayed,
    closeBadConnectionWarningDialog,
    uploadEventHandlers: badConnectionWarningUploadEventHandlers,
  } = useBadConnectionWarning({ maxUploadDurationWarning });
  const uploadQueue = useUploadQueue({
    inspectionId,
    apiConfig,
    complianceOptions,
    eventHandlers: [adaptiveUploadEventHandlers, badConnectionWarningUploadEventHandlers],
  });
  const images = usePhotoCaptureImages(inspectionId);
  const handlePictureTaken = usePictureTaken({
    sightState,
    addDamageHandle,
    uploadQueue,
    tasksBySight,
  });
  const handleOpenGallery = () => {
    setCurrentScreen(PhotoCaptureScreen.GALLERY);
    analytics.trackEvent('Gallery Opened');
  };
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
        analytics.trackEvent('Capture Completed');
        analytics.setUserProperties({ captureCompleted: true });
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
    lastPictureTakenUri: sightState.lastPictureTakenUri,
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
          {...adaptiveCameraConfig}
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
          onBack={handleGalleryBack}
          onNavigateToCapture={handleNavigateToCapture}
          onValidate={handleGalleryValidate}
          enableAddDamage={enableAddDamage}
          {...complianceOptions}
        />
      )}
      <BackdropDialog
        show={isBadConnectionWarningDialogDisplayed}
        showCancelButton={false}
        dialogIcon='warning-outline'
        dialogIconPrimaryColor='caution-base'
        message={t('photo.badConnectionWarning.message')}
        confirmLabel={t('photo.badConnectionWarning.confirm')}
        onConfirm={closeBadConnectionWarningDialog}
      />
    </div>
  );
}
