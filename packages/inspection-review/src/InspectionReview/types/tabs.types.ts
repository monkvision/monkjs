import { GalleryItem } from './gallery.types';

/**
 * Enumeration of the default tab keys available in the inspection review.
 */
export enum TabKeys {
  Exterior = 'Exterior',
  Interior = 'Interior/Tire',
}

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
   *
   */
  sights: Record<TabKeys | string, string[]>;
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
 * Enumeration of the different views available in the Interior tab.
 */
export enum InteriorViews {
  /**
   * The list view showing all interior damages.
   */
  DamagesList = 'Damages List',
  /**
   * The view for adding or editing an interior damage.
   */
  AddDamage = 'Add Damage',
}
