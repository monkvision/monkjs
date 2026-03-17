import { useTranslation } from 'react-i18next';
import { Button } from '../../Button';
import {
  ThumbnailsPanelProps,
  AlternativesPanelProps,
  DefaultPanelProps,
  SidePanelProps,
} from './types';
import { useSidePanelStyles } from './SidePanel.styles';

/**
 * Panel displaying alternative image thumbnails in a scrollable list. The user can select a
 * thumbnail and validate it as the new beauty shot, or close the panel.
 */
function ThumbnailsPanel({
  images,
  hasChanged,
  selectedImage,
  validatedImage,
  view,
  closeButton,
  selectImage,
  onClose,
  onValidate,
}: ThumbnailsPanelProps) {
  const { thumbnailListStyle, thumbnailWrapperStyle, selectedBadgeStyle, getThumbnailStyle } =
    useSidePanelStyles();

  const handleAction = () => {
    if (hasChanged) {
      onValidate?.(selectedImage, view);
    } else {
      onClose();
    }
  };

  if (images.length === 0) {
    return null;
  }

  return (
    <div style={thumbnailListStyle}>
      {images.map((thumb, index) => {
        const isSelected = thumb.id === selectedImage.id;
        const isValidated = thumb.id === validatedImage.id;
        return (
          <div key={thumb.id} style={thumbnailWrapperStyle}>
            <img
              src={thumb.thumbnailPath || thumb.path}
              alt={thumb.sightId ?? ''}
              onClick={() => selectImage(index)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  selectImage(index);
                }
              }}
              style={getThumbnailStyle(isSelected)}
            />
            {isValidated && <div style={selectedBadgeStyle}>✓</div>}
          </div>
        );
      })}
      <Button
        onClick={handleAction}
        icon={hasChanged ? 'check-circle' : 'close'}
        primaryColor={hasChanged ? 'primary-base' : 'secondary-base'}
        secondaryColor={closeButton.secondaryColor}
      />
    </div>
  );
}

/**
 * Panel displaying action buttons when alternative images are available but thumbnails are not
 * shown. Provides close, retake (in capture mode), and "browse shots" buttons.
 */
function AlternativesPanel({ props, onBrowse }: AlternativesPanelProps) {
  const { t } = useTranslation();
  return (
    <>
      <Button onClick={props.onClose} variant='text' primaryColor='text-primary'>
        {t('sidepanel.close')}
      </Button>
      {props.captureMode && (
        <Button onClick={props.onRetake} primaryColor='primary-base'>
          {t('sidepanel.retake')}
        </Button>
      )}
      <Button onClick={onBrowse} variant='text' primaryColor='text-primary'>
        {t('sidepanel.browse-shots')}
      </Button>
    </>
  );
}

/**
 * Default panel displaying gallery and camera navigation buttons when no alternative images are
 * available.
 */
function DefaultPanel({ props, galleryButton, cameraButton }: DefaultPanelProps) {
  return (
    <>
      <Button
        disabled={!(props.showGalleryButton ?? true)}
        onClick={props.onNavigateToGallery}
        icon='gallery'
        primaryColor={galleryButton.primaryColor}
        secondaryColor={galleryButton.secondaryColor}
        style={galleryButton.style}
      />
      <Button
        disabled={!props.captureMode || !(props.showCaptureButton ?? true)}
        onClick={props.captureMode ? props.onNavigateToCapture : undefined}
        icon='camera-outline'
        style={cameraButton.style}
      />
    </>
  );
}

/**
 * Side panel component for the ImageDetailedView. Dynamically renders one of three sub-panels based
 * on the current state:
 * - **ThumbnailsPanel**: When alternative images are available and the user has opened the
 *   thumbnails view.
 * - **AlternativesPanel**: When alternative images are available but thumbnails are hidden.
 * - **DefaultPanel**: Default state with gallery and camera navigation buttons.
 */
export function SidePanel({
  hasAlternatives,
  showThumbnails,
  images,
  view,
  hasChanged,
  selectedImage,
  validatedImage,
  closeButton,
  galleryButton,
  cameraButton,
  selectImage,
  setShowThumbnails,
  props,
}: SidePanelProps) {
  if (hasAlternatives && showThumbnails && view) {
    return (
      <ThumbnailsPanel
        images={images}
        hasChanged={hasChanged}
        selectedImage={selectedImage}
        validatedImage={validatedImage}
        view={view}
        closeButton={closeButton}
        selectImage={selectImage}
        onClose={() => setShowThumbnails(false)}
        onValidate={props.onValidateAlternative}
      />
    );
  }
  if (hasAlternatives) {
    return <AlternativesPanel props={props} onBrowse={() => setShowThumbnails(true)} />;
  }
  return <DefaultPanel props={props} galleryButton={galleryButton} cameraButton={cameraButton} />;
}
