import { Image, Viewpoint } from '@monkvision/types';
import { ImageDetailedViewProps } from '../hooks';

/**
 * Props for the ThumbnailsPanel component.
 */
export interface ThumbnailsPanelProps {
  /**
   * The list of alternative images to display as selectable thumbnails.
   */
  images: Image[];
  /**
   * Whether the user has changed the selected image from the original.
   */
  hasChanged: boolean;
  /**
   * The currently selected image (highlighted thumbnail).
   */
  selectedImage: Image;
  /**
   * The viewpoint associated with the current beauty shot selection.
   */
  view: Viewpoint;
  /**
   * Style configuration for the close button.
   */
  closeButton: { primaryColor: string; secondaryColor: string };
  /**
   * Callback invoked when the user selects a thumbnail by its index.
   */
  selectImage: (index: number) => void;
  /**
   * Callback invoked when the user closes the thumbnails panel.
   */
  onClose: () => void;
  /**
   * Callback invoked when the user validates the selected image as the new beauty shot.
   */
  onValidate?: (image: Image, view: Viewpoint) => void;
  /**
   * The currently validated image (✓ badge). Only changes when the user clicks validate.
   */
  validatedImage: Image;
}

/**
 * Props for the AlternativesPanel component.
 */
export interface AlternativesPanelProps {
  /**
   * The parent ImageDetailedView props, used to access callbacks and display state.
   */
  props: ImageDetailedViewProps;
  /**
   * Callback invoked when the user clicks the "Browse shots" button.
   */
  onBrowse: () => void;
}

/**
 * Props for the DefaultPanel component.
 */
export interface DefaultPanelProps {
  /**
   * The parent ImageDetailedView props, used to access callbacks and display state.
   */
  props: ImageDetailedViewProps;
  /**
   * Style configuration for the gallery button.
   */
  galleryButton: { primaryColor: string; secondaryColor: string; style: React.CSSProperties };
  /**
   * Style configuration for the camera button.
   */
  cameraButton: { style: React.CSSProperties };
}

/**
 * Props for the SidePanel component.
 */
export interface SidePanelProps {
  /**
   * Whether the current image has alternative beauty shot candidates available.
   */
  hasAlternatives: boolean;
  /**
   * Whether the thumbnails panel is currently visible.
   */
  showThumbnails: boolean;
  /**
   * The list of images (original + alternatives) available for selection.
   */
  images: Image[];
  /**
   * The viewpoint associated with the current beauty shot selection.
   */
  view?: Viewpoint;
  /**
   * Whether the user has changed the selected image from the original.
   */
  hasChanged: boolean;
  /**
   * The currently selected image (highlighted thumbnail).
   */
  selectedImage: Image;
  /**
   * The currently validated image (✓ badge). Only changes when the user clicks validate.
   */
  validatedImage: Image;
  /**
   * Style configuration for the close button.
   */
  closeButton: { primaryColor: string; secondaryColor: string };
  /**
   * Style configuration for the gallery button.
   */
  galleryButton: { primaryColor: string; secondaryColor: string; style: React.CSSProperties };
  /**
   * Style configuration for the camera button.
   */
  cameraButton: { style: React.CSSProperties };
  /**
   * Callback invoked when the user selects a thumbnail by its index.
   */
  selectImage: (index: number) => void;
  /**
   * Callback to toggle the thumbnails panel visibility.
   */
  setShowThumbnails: (show: boolean) => void;
  /**
   * The parent ImageDetailedView props, used to access callbacks and display state.
   */
  props: ImageDetailedViewProps;
}
