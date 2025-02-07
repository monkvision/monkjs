import { useAnalytics } from '@monkvision/analytics';
import { Camera, CameraHUDProps } from '@monkvision/camera-web';
import { useI18nSync, useLoadingState, useObjectMemo, usePreventExit } from '@monkvision/common';
import {
  BackdropDialog,
  InspectionGallery,
  NavigateToCaptureOptions,
  NavigateToCaptureReason,
} from '@monkvision/common-ui-web';
import { useMonitoring } from '@monkvision/monitoring';
import { MonkApiConfig } from '@monkvision/network';
import {
  AddDamage,
  CameraConfig,
  ComplianceOptions,
  MonkPicture,
  PhotoCaptureAppConfig,
  PhotoCaptureSightGuidelinesOption,
  PhotoCaptureTutorialOption,
  Sight,
  VehicleType,
} from '@monkvision/types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { styles } from './PhotoCapture.styles';
import { PhotoCaptureHUD, PhotoCaptureHUDProps } from './PhotoCaptureHUD';
import {
  useStartTasksOnComplete,
  usePictureTaken,
  useAddDamageMode,
  useUploadQueue,
  usePhotoCaptureImages,
  useAdaptiveCameraConfig,
  useBadConnectionWarning,
  useTracking,
} from '../hooks';
import {
  useComplianceAnalytics,
  usePhotoCaptureSightState,
  usePhotoCaptureTutorial,
  usePhotoCaptureSightGuidelines,
} from './hooks';

/**
 * Props of the PhotoCapture component.
 */
export interface PhotoCaptureProps
  extends Pick<
      PhotoCaptureAppConfig,
      | keyof CameraConfig
      | 'maxUploadDurationWarning'
      | 'useAdaptiveImageQuality'
      | 'additionalTasks'
      | 'tasksBySight'
      | 'startTasksOnComplete'
      | 'showCloseButton'
      | 'enforceOrientation'
      | 'allowSkipRetake'
      | 'addDamage'
      | 'sightGuidelines'
      | 'enableSightGuidelines'
      | 'enableTutorial'
      | 'allowSkipTutorial'
      | 'enableSightTutorial'
    >,
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
   * The vehicle type of the inspection.
   */
  vehicleType?: VehicleType;
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
   * Callback called when a picture has been taken by the user.
   */
  onPictureTaken?: (picture: MonkPicture) => void;
  /**
   * The language to be used by this component.
   *
   * @default en
   */
  lang?: string | null;
  /**
   * Custom label for validate button in gallery view.
   */
  validateButtonLabel?: string;
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
  additionalTasks,
  tasksBySight,
  startTasksOnComplete = true,
  onClose,
  onComplete,
  onPictureTaken,
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
  addDamage = AddDamage.PART_SELECT,
  sightGuidelines,
  enableTutorial = PhotoCaptureTutorialOption.FIRST_TIME_ONLY,
  allowSkipTutorial = true,
  enableSightTutorial = true,
  enableSightGuidelines = PhotoCaptureSightGuidelinesOption.EPHEMERAL,
  useAdaptiveImageQuality = true,
  lang,
  enforceOrientation,
  validateButtonLabel,
  vehicleType = VehicleType.SEDAN,
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
  const monitoring = useMonitoring();
  const [currentScreen, setCurrentScreen] = useState(PhotoCaptureScreen.CAMERA);
  const analytics = useAnalytics();
  const loading = useLoadingState();
  const handleOpenGallery = () => {
    setCurrentScreen(PhotoCaptureScreen.GALLERY);
    analytics.trackEvent('Gallery Opened');
  };
  const addDamageHandle = useAddDamageMode({
    addDamage,
    handleOpenGallery,
  });
  useTracking({ inspectionId, authToken: apiConfig.authToken });
  const { setIsInitialInspectionFetched } = useComplianceAnalytics({ inspectionId, sights });
  const { adaptiveCameraConfig, uploadEventHandlers: adaptiveUploadEventHandlers } =
    useAdaptiveCameraConfig({
      initialCameraConfig,
      useAdaptiveImageQuality,
    });
  const startTasks = useStartTasksOnComplete({
    inspectionId,
    apiConfig,
    sights,
    additionalTasks,
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
    setIsInitialInspectionFetched,
  });
  const { currentTutorialStep, goToNextTutorialStep, closeTutorial } = usePhotoCaptureTutorial({
    enableTutorial,
    enableSightGuidelines,
    enableSightTutorial,
  });
  const { showSightGuidelines, handleDisableSightGuidelines } = usePhotoCaptureSightGuidelines({
    enableSightGuidelines,
  });
  const {
    isBadConnectionWarningDialogDisplayed,
    closeBadConnectionWarningDialog,
    uploadEventHandlers: badConnectionWarningUploadEventHandlers,
  } = useBadConnectionWarning({ maxUploadDurationWarning });
  const uploadQueue = useUploadQueue({
    inspectionId,
    apiConfig,
    additionalTasks,
    complianceOptions,
    eventHandlers: [adaptiveUploadEventHandlers, badConnectionWarningUploadEventHandlers],
  });
  const images = usePhotoCaptureImages(inspectionId);
  const handlePictureTaken = usePictureTaken({
    captureState: sightState,
    addDamageHandle,
    uploadQueue,
    tasksBySight,
    onPictureTaken,
  });
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
  const { allowRedirect } = usePreventExit(sightState.sightsTaken.length !== 0);
  const handleGalleryValidate = () => {
    startTasks()
      .then(() => {
        analytics.trackEvent('Capture Completed');
        analytics.setUserProperties({
          captureCompleted: true,
          sightSelected: 'inspection-completed',
        });
        allowRedirect();
        onComplete?.();
        sightState.setIsInspectionCompleted(true);
      })
      .catch((err) => {
        loading.onError(err);
        monitoring.handleError(err);
      });
  };
  const hudProps: Omit<PhotoCaptureHUDProps, keyof CameraHUDProps> = {
    sights,
    selectedSight: sightState.selectedSight,
    sightsTaken: sightState.sightsTaken,
    lastPictureTakenUri: sightState.lastPictureTakenUri,
    mode: addDamageHandle.mode,
    vehicleParts: addDamageHandle.vehicleParts,
    onOpenGallery: handleOpenGallery,
    onSelectSight: sightState.selectSight,
    onRetakeSight: sightState.retakeSight,
    onAddDamage: addDamageHandle.handleAddDamage,
    onAddDamagePartsSelected: addDamageHandle.handleAddDamagePartsSelected,
    onCancelAddDamage: addDamageHandle.handleCancelAddDamage,
    onRetry: sightState.retryLoadingInspection,
    loading,
    onClose,
    inspectionId,
    showCloseButton,
    images,
    addDamage,
    onValidateVehicleParts: addDamageHandle.handleValidateVehicleParts,
    sightGuidelines,
    showSightGuidelines,
    currentTutorialStep,
    onNextTutorialStep: goToNextTutorialStep,
    onCloseTutorial: closeTutorial,
    onDisableSightGuidelines: handleDisableSightGuidelines,
    allowSkipTutorial,
    enforceOrientation,
    vehicleType,
  };

  return (
    <div style={styles['container']}>
      {currentScreen === PhotoCaptureScreen.CAMERA && (
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
          addDamage={addDamage}
          validateButtonLabel={validateButtonLabel}
          isInspectionCompleted={sightState.isInspectionCompleted}
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
