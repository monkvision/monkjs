import { GalleryItem } from '../hooks';

/**
 * API provided to tabs upon activation.
 */
export type TabActivationAPI = {
  /**
   * The current gallery items displayed.
   */
  currentGalleryItems: GalleryItem[];
  /**
   * All gallery items available in the inspection review.
   */
  allGalleryItems: GalleryItem[];
  /**
   * Function to update the current gallery items when the tab is activated.
   */
  setCurrentGalleryItems: (items: GalleryItem[]) => void;
};

/**
 * Object representing a tab with optional activation callback.
 */
export type TabObject = {
  /**
   * The component to be rendered for the tab.
   */
  Component: React.FC | React.ReactElement;
  /**
   * Optional callback invoked when the tab is activated to manipulate the gallery items.
   */
  onActivate?: (api: TabActivationAPI) => void;
  /**
   * Optional callback invoked when the tab is deactivated to manipulate the gallery items.
   */
  onDeactivate?: (api: TabActivationAPI) => void;
};

/**
 * Type representing the content of a tab, defined as a React functional component.
 */
export type TabContent = React.FC | React.ReactElement | TabObject;

/**
 * Enumeration of the default tab keys available in the inspection review.
 */
export enum TabKeys {
  Exterior = 'Exterior',
  Interior = 'Interior/Tire',
}
