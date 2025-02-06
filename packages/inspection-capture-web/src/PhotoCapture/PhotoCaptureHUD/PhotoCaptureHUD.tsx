import { useMemo, useState } from 'react';
import {
  PhotoCaptureAppConfig,
  Image,
  ImageStatus,
  Sight,
  VehiclePart,
  VehicleType,
} from '@monkvision/types';
import { useTranslation } from 'react-i18next';
import { BackdropDialog } from '@monkvision/common-ui-web';
import { CameraHUDProps } from '@monkvision/camera-web';
import { LoadingState } from '@monkvision/common';
import { useAnalytics } from '@monkvision/analytics';
import { usePhotoCaptureHUDStyle } from './hooks';
import { TutorialSteps } from '../hooks';
import { PhotoCaptureHUDElements } from './PhotoCaptureHUDElements';
import { PhotoCaptureHUDTutorial } from './PhotoCaptureHUDTutorial';
import { CaptureMode } from '../../types';
import { HUDButtons, HUDOverlay, OrientationEnforcer } from '../../components';

/**
 * Props of the PhotoCaptureHUD component.
 */
export interface PhotoCaptureHUDProps
  extends CameraHUDProps,
    Pick<
      PhotoCaptureAppConfig,
      | 'sightGuidelines'
      | 'addDamage'
      | 'showCloseButton'
      | 'allowSkipTutorial'
      | 'enforceOrientation'
    > {
  /**
   * The inspection ID.
   */
  inspectionId: string;
  /**
   * The list of sights provided to the PhotoCapture component.
   */
  sights: Sight[];
  /**
   * The currently selected sight in the PhotoCapture component : the sight that the user needs to capture.
   */
  selectedSight: Sight;
  /**
   * Array containing the list of sights that the user has already captured.
   */
  sightsTaken: Sight[];
  /**
   * Value storing the last picture taken by the user. If no picture has been taken yet, this value is null.
   */
  lastPictureTakenUri: string | null;
  /**
   * The current mode of the component.
   */
  mode: CaptureMode;
  /**
   * Global loading state of the PhotoCapture component.
   */
  loading: LoadingState;
  /**
   * The current tutorial step in PhotoCapture component.
   */
  currentTutorialStep: TutorialSteps | null;
  /**
   * Current vehicle parts selected to take a picture of.
   */
  vehicleParts: VehiclePart[];
  /**
   * Callback called when the user clicks on "Next" button in PhotoCapture tutorial.
   */
  onNextTutorialStep: () => void;
  /**
   * Callback called when the user clicks on "Close" button in PhotoCapture tutorial.
   */
  onCloseTutorial: () => void;
  /**
   * Callback called when the user manually select a new sight.
   */
  onSelectSight: (sight: Sight) => void;
  /**
   * Callback called when the user manually select a sight to retake.
   */
  onRetakeSight: (sight: string) => void;
  /**
   * Callback called when the user clicks on the "Add Damage" button.
   */
  onAddDamage: () => void;
  /**
   * Callback called when the user selects the parts to take a picture of.
   */
  onAddDamagePartsSelected?: (parts: VehiclePart[]) => void;
  /**
   * Callback called when the user clicks on the "Cancel" button of the Add Damage mode.
   */
  onCancelAddDamage: () => void;
  /**
   * Callback that can be used to retry fetching this state object from the API in case the previous fetch failed.
   */
  onRetry: () => void;
  /**
   * Callback called when the user clicks on the gallery icon.
   */
  onOpenGallery: () => void;
  /**
   * Callback called when the user clicks on the "Validate" button of the Add Damage mode.
   */
  onValidateVehicleParts: () => void;
  /**
   * Callback called when the user clicks on both: 'disable' checkbox and 'okay' button.
   */
  onDisableSightGuidelines: () => void;
  /**
   * Callback called when the user clicks on the close button. If this callback is not provided, the close button is not
   * displayed.
   */
  onClose?: () => void;
  /**
   * The current images taken by the user (ignoring retaken pictures etc.).
   */
  images: Image[];
  /**
   * The vehicle type of the inspection.
   */
  vehicleType: VehicleType;
  /**
   * Boolean indicating whether the sight guidelines should be displayed.
   */
  showSightGuidelines: boolean;
}

/**
 * This component implements the Camera HUD (head-up display) displayed in the PhotoCapture component over the Camera
 * preview. It implements elements such as buttons to interact with the camera, PhotoCapture indicators, error messages,
 * loaders etc.
 */
export function PhotoCaptureHUD({
  inspectionId,
  sights,
  selectedSight,
  sightsTaken,
  lastPictureTakenUri,
  mode,
  vehicleParts,
  onSelectSight,
  onRetakeSight,
  onAddDamage,
  onAddDamagePartsSelected,
  onValidateVehicleParts,
  onCancelAddDamage,
  onOpenGallery,
  onRetry,
  onClose,
  showCloseButton,
  loading,
  handle,
  cameraPreview,
  images,
  addDamage,
  sightGuidelines,
  showSightGuidelines,
  currentTutorialStep,
  allowSkipTutorial,
  onNextTutorialStep,
  onCloseTutorial,
  enforceOrientation,
  vehicleType,
  onDisableSightGuidelines,
}: PhotoCaptureHUDProps) {
  const { t } = useTranslation();
  const [showCloseModal, setShowCloseModal] = useState(false);
  const style = usePhotoCaptureHUDStyle();
  const { trackEvent } = useAnalytics();
  const retakeCount = useMemo(
    () =>
      images.filter((image) =>
        [ImageStatus.NOT_COMPLIANT, ImageStatus.UPLOAD_FAILED, ImageStatus.UPLOAD_ERROR].includes(
          image.status,
        ),
      ).length,
    [images],
  );

  const handleCloseConfirm = () => {
    setShowCloseModal(false);
    trackEvent('Capture Closed');
    onClose?.();
  };

  return (
    <div style={style.container}>
      <div style={style.previewContainer} data-testid='camera-preview'>
        {cameraPreview}
        <PhotoCaptureHUDElements
          selectedSight={selectedSight}
          sights={sights}
          sightsTaken={sightsTaken}
          mode={mode}
          vehicleParts={vehicleParts}
          onAddDamage={onAddDamage}
          onCancelAddDamage={onCancelAddDamage}
          onAddDamagePartsSelected={onAddDamagePartsSelected}
          onSelectSight={onSelectSight}
          onRetakeSight={onRetakeSight}
          onValidateVehicleParts={onValidateVehicleParts}
          isLoading={loading.isLoading}
          error={loading.error ?? handle.error}
          previewDimensions={handle.previewDimensions}
          images={images}
          addDamage={addDamage}
          sightGuidelines={sightGuidelines}
          showSightGuidelines={showSightGuidelines}
          tutorialStep={currentTutorialStep}
          vehicleType={vehicleType}
          onDisableSightGuidelines={onDisableSightGuidelines}
        />
      </div>
      {mode !== CaptureMode.ADD_DAMAGE_PART_SELECT && (
        <HUDButtons
          onOpenGallery={onOpenGallery}
          onTakePicture={handle?.takePicture}
          onClose={() => setShowCloseModal(true)}
          galleryPreview={lastPictureTakenUri ?? undefined}
          closeDisabled={!!loading.error || !!handle.error}
          galleryDisabled={!!loading.error || !!handle.error}
          takePictureDisabled={
            !!loading.error || !!handle.error || handle.isLoading || loading.isLoading
          }
          showCloseButton={showCloseButton}
          showGalleryBadge={retakeCount > 0}
          retakeCount={retakeCount}
        />
      )}
      <HUDOverlay
        inspectionId={inspectionId}
        handle={handle}
        isCaptureLoading={loading.isLoading}
        captureError={loading.error}
        onRetry={onRetry}
      />
      <BackdropDialog
        show={showCloseModal}
        message={t('photo.hud.closeConfirm.message')}
        cancelLabel={t('photo.hud.closeConfirm.cancel')}
        confirmLabel={t('photo.hud.closeConfirm.confirm')}
        onCancel={() => setShowCloseModal(false)}
        onConfirm={handleCloseConfirm}
      />
      <PhotoCaptureHUDTutorial
        currentTutorialStep={handle.error || loading.error ? null : currentTutorialStep}
        onNextTutorialStep={onNextTutorialStep}
        onCloseTutorial={onCloseTutorial}
        allowSkipTutorial={allowSkipTutorial}
        sightId={selectedSight.id}
        sightGuidelines={sightGuidelines}
        addDamage={addDamage}
      />
      <OrientationEnforcer orientation={enforceOrientation} />
    </div>
  );
}
