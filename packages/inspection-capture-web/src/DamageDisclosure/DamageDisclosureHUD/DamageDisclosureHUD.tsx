import { useMemo, useState } from 'react';
import { CaptureAppConfig, Image, ImageStatus, ImageType, VehiclePart } from '@monkvision/types';
import { useTranslation } from 'react-i18next';
import { BackdropDialog } from '@monkvision/common-ui-web';
import { CameraHUDProps } from '@monkvision/camera-web';
import { LoadingState } from '@monkvision/common';
import { useAnalytics } from '@monkvision/analytics';
import { styles } from './DamageDisclosureHUD.styles';
import { CaptureMode } from '../../types';
import { HUDButtons } from '../../components/HUDButtons';
import { DamageDisclosureHUDElements } from './DamageDisclosureHUDElements';
import { HUDOverlay } from '../../components/HUDOverlay';

/**
 * Props of the DamageDisclosureHUD component.
 */
export interface DamageDisclosureHUDProps
  extends CameraHUDProps,
    Pick<CaptureAppConfig, 'addDamage' | 'showCloseButton'> {
  /**
   * The inspection ID.
   */
  inspectionId: string;
  /**
   * The current mode of the component.
   */
  mode: CaptureMode;
  /**
   * Global loading state of the DamageDisclosure component.
   */
  loading: LoadingState;
  /**
   * Current vehicle parts selected to take a picture of.
   */
  vehicleParts: VehiclePart[];
  /**
   * Value storing the last picture taken by the user. If no picture has been taken yet, this value is null.
   */
  lastPictureTakenUri: string | null;
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
   * Callback called when the user clicks on the close button. If this callback is not provided, the close button is not
   * displayed.
   */
  onClose?: () => void;
  /**
   * The current images taken by the user (ignoring retaken pictures etc.).
   */
  images: Image[];
}

/**
 * This component implements the Camera HUD (head-up display) displayed in the DamageDisclosure component
 * over the Camera preview. It implements elements such as buttons to interact with
 * the camera, DamageDisclosure indicators, error messages, loaders etc.
 */
export function DamageDisclosureHUD({
  inspectionId,
  lastPictureTakenUri,
  mode,
  vehicleParts,
  onAddDamage,
  onAddDamagePartsSelected,
  onValidateVehicleParts,
  onCancelAddDamage,
  onOpenGallery,
  onClose,
  onRetry,
  showCloseButton,
  loading,
  handle,
  cameraPreview,
  images,
}: DamageDisclosureHUDProps) {
  const { t } = useTranslation();
  const [showCloseModal, setShowCloseModal] = useState(false);
  const { trackEvent } = useAnalytics();
  const retakeCount = useMemo(
    () =>
      images.filter(
        (image) =>
          [ImageStatus.NOT_COMPLIANT, ImageStatus.UPLOAD_FAILED, ImageStatus.UPLOAD_ERROR].includes(
            image.status,
          ) && image.type === ImageType.CLOSE_UP,
      ).length,
    [images],
  );

  const handleCloseConfirm = () => {
    setShowCloseModal(false);
    trackEvent('Disclosure Closed');
    onClose?.();
  };

  return (
    <div style={styles['container']}>
      <div style={styles['previewContainer']} data-testid='camera-preview'>
        {cameraPreview}
        {
          <DamageDisclosureHUDElements
            mode={mode}
            vehicleParts={vehicleParts}
            onAddDamage={onAddDamage}
            onCancelAddDamage={onCancelAddDamage}
            onAddDamagePartsSelected={onAddDamagePartsSelected}
            onValidateVehicleParts={onValidateVehicleParts}
            isLoading={loading.isLoading}
            error={loading.error ?? handle.error}
            previewDimensions={handle.previewDimensions}
          />
        }
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
    </div>
  );
}
