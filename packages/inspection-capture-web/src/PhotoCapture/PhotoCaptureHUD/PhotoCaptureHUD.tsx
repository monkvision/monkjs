import { useMemo, useState } from 'react';
import { Sight, MonkPicture, Image, ImageStatus } from '@monkvision/types';
import { useTranslation } from 'react-i18next';
import { BackdropDialog } from '@monkvision/common-ui-web';
import { CameraHUDProps } from '@monkvision/camera-web';
import { LoadingState } from '@monkvision/common';
import { PhotoCaptureHUDButtons } from './PhotoCaptureHUDButtons';
import { usePhotoCaptureHUDStyle } from './hooks';
import { PhotoCaptureMode } from '../hooks';
import { PhotoCaptureHUDOverlay } from './PhotoCaptureHUDOverlay';
import { PhotoCaptureHUDPreview } from './PhotoCaptureHUDPreview';

/**
 * Props of the PhotoCaptureHUD component.
 */
export interface PhotoCaptureHUDProps extends CameraHUDProps {
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
  lastPictureTaken: MonkPicture | null;
  /**
   * The current mode of the component.
   */
  mode: PhotoCaptureMode;
  /**
   * Global loading state of the PhotoCapture component.
   */
  loading: LoadingState;
  /**
   * Callback called when the user manually select a new sight.
   */
  onSelectSight: (sight: Sight) => void;
  /**
   * Callback to be called when the user clicks on the "Add Damage" button.
   */
  onAddDamage: () => void;
  /**
   * Callback to be called when the user clicks on the "Cancel" button of the Add Damage mode.
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
   * Callback called when the user clicks on the close button. If this callback is not provided, the close button is not
   * displayed.
   */
  onClose?: () => void;
  /**
   * Boolean indicating if the close button should be displayed in the HUD on top of the Camera preview.
   *
   * @default false
   */
  showCloseButton?: boolean;
  /**
   * The current images taken by the user (ignoring retaken pictures etc.).
   */
  images: Image[];
  /**
   * Boolean indicating if `Add Damage` feature should be enabled or not. If disabled, the `Add Damage` button will be hidden.
   *
   * @default true
   */
  enableAddDamage?: boolean;
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
  lastPictureTaken,
  mode,
  onSelectSight,
  onAddDamage,
  onCancelAddDamage,
  onOpenGallery,
  onRetry,
  onClose,
  showCloseButton,
  loading,
  handle,
  cameraPreview,
  images,
  enableAddDamage,
}: PhotoCaptureHUDProps) {
  const { t } = useTranslation();
  const [showCloseModal, setShowCloseModal] = useState(false);
  const style = usePhotoCaptureHUDStyle();
  const showGalleryBadge = useMemo(
    () =>
      images.some((image) =>
        [ImageStatus.NOT_COMPLIANT, ImageStatus.UPLOAD_FAILED].includes(image.status),
      ),
    [images],
  );

  const handleCloseConfirm = () => {
    setShowCloseModal(false);
    onClose?.();
  };

  return (
    <div style={style.container}>
      <div style={style.previewContainer} data-testid='camera-preview'>
        {cameraPreview}
        <PhotoCaptureHUDPreview
          selectedSight={selectedSight}
          sights={sights}
          sightsTaken={sightsTaken}
          mode={mode}
          onAddDamage={onAddDamage}
          onCancelAddDamage={onCancelAddDamage}
          onSelectSight={onSelectSight}
          isLoading={loading.isLoading || handle.isLoading}
          error={loading.error ?? handle.error}
          streamDimensions={handle.dimensions}
          images={images}
          enableAddDamage={enableAddDamage}
        />
      </div>
      <PhotoCaptureHUDButtons
        onOpenGallery={onOpenGallery}
        onTakePicture={handle?.takePicture}
        onClose={() => setShowCloseModal(true)}
        galleryPreview={lastPictureTaken ?? undefined}
        closeDisabled={!!loading.error || !!handle.error}
        galleryDisabled={!!loading.error || !!handle.error}
        takePictureDisabled={!!loading.error || !!handle.error}
        showCloseButton={showCloseButton}
        showGalleryBadge={showGalleryBadge}
      />
      <PhotoCaptureHUDOverlay
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
