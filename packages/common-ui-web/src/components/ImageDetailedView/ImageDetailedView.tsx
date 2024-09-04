import { i18nWrap, useI18nSync } from '@monkvision/common';
import { i18nImageDetailedView } from './i18n';
import { ImageDetailedViewProps, useImageDetailedViewStyles } from './hooks';
import { Button } from '../Button';
import { ImageDetailedViewOverlay } from './ImageDetailedViewOverlay';

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
    mainContainerStyle,
    leftContainerStyle,
    overlayContainerStyle,
    rightContainerStyle,
    closeButton,
    galleryButton,
    cameraButton,
  } = useImageDetailedViewStyles(props);

  return (
    <div style={mainContainerStyle}>
      <div style={leftContainerStyle}>
        <Button
          onClick={props.onClose}
          icon='close'
          size='small'
          primaryColor={closeButton.primaryColor}
          secondaryColor={closeButton.secondaryColor}
        />
      </div>
      <div style={overlayContainerStyle}>
        <ImageDetailedViewOverlay
          image={props.image}
          captureMode={props.captureMode}
          onRetake={props.captureMode ? props.onRetake : undefined}
        />
      </div>
      <div style={rightContainerStyle}>
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
      </div>
    </div>
  );
},
i18nImageDetailedView);
