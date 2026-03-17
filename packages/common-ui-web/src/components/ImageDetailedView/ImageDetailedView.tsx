import { i18nWrap, useI18nSync } from '@monkvision/common';
import { i18nImageDetailedView } from './i18n';
import { ImageDetailedViewProps, useImageDetailedViewStyles, useImageSelector } from './hooks';
import { Button } from '../Button';
import { ImageDetailedViewOverlay } from './ImageDetailedViewOverlay';
import { SidePanel } from './SidePanel';

/**
 * This component is used to display the preview of an inspection image, as well as additional data such as its label
 * etc. If this component is used mid-capture, set the `captureMode` prop to `true` so that you'll enable features such
 * as compliance errors, retakes etc.
 */
export const ImageDetailedView = i18nWrap(function ImageDetailedView(
  props: ImageDetailedViewProps,
) {
  useI18nSync(props.lang);
  const {
    selectedImage,
    validatedImage,
    hasChanged,
    hasAlternatives,
    hasValidatedOnce,
    selectImage,
    images,
    showThumbnails,
    setShowThumbnails,
    showSuccessMessage,
    handleValidate,
  } = useImageSelector(
    props.image,
    props.alternativeImages,
    props.onImageSelected,
    props.onValidateAlternative,
  );

  const {
    mainContainerStyle,
    leftContainerStyle,
    overlayContainerStyle,
    rightContainerStyle,
    closeButton,
    galleryButton,
    cameraButton,
  } = useImageDetailedViewStyles({ ...props, image: selectedImage });

  return (
    <div style={mainContainerStyle}>
      <div style={leftContainerStyle}>
        <Button
          onClick={props.onClose}
          icon='close'
          primaryColor={closeButton.primaryColor}
          secondaryColor={closeButton.secondaryColor}
        />
      </div>
      <div style={overlayContainerStyle}>
        <ImageDetailedViewOverlay
          image={selectedImage}
          view={props.view}
          isSelectingAlternative={!hasChanged}
          showThumbnail={showThumbnails}
          showSuccessMessage={showSuccessMessage}
          hasValidatedOnce={hasValidatedOnce}
          captureMode={props.captureMode}
          onRetake={props.captureMode ? props.onRetake : undefined}
        />
      </div>
      <div style={rightContainerStyle}>
        <SidePanel
          hasAlternatives={hasAlternatives}
          showThumbnails={showThumbnails}
          images={images}
          view={props.view}
          hasChanged={hasChanged}
          selectedImage={selectedImage}
          validatedImage={validatedImage}
          closeButton={closeButton}
          galleryButton={galleryButton}
          cameraButton={cameraButton}
          selectImage={selectImage}
          setShowThumbnails={setShowThumbnails}
          props={{ ...props, onValidateAlternative: handleValidate }}
        />
      </div>
    </div>
  );
},
i18nImageDetailedView);
