import { GalleryItem } from './gallery.types';
import type {
  InspectionReviewProps,
  InspectionReviewProviderState,
} from './inspection-review.types';

/**
 * Enumeration of the default tab keys available in the inspection review.
 */
export enum TabKeys {
  Exterior = 'exterior',
  Interior = 'interior',
}

/**
 * API provided to tabs upon activation.
 */
export type TabActivationAPI = Pick<
  InspectionReviewProviderState,
  'allGalleryItems' | 'currentGalleryItems' | 'setCurrentGalleryItems'
> &
  Pick<InspectionReviewProps, 'unmatchedSightsTab'> & {
    /**
     * The ordered list of gallery items available for the inspection review for this tab.
     */
    sights: Record<TabKeys | string, string[]>;
    /**
     * The gallery items that do not match any sight in the sightsPerTab mapping.
     * They will be assiged to the `unmatchedSightsTab` which defaults to TabKeys.Exterior.
     */
    unmatchedGalleryItems: GalleryItem[];
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
