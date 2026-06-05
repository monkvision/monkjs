import { MonkApiConfig } from '@monkvision/network';
import { CurrencySymbol, Inspection, SteeringWheelPosition, VehicleType } from '@monkvision/types';
import { PricingData, PricingLevels } from './pricing.types';
import { TabKeys, TabContent } from './tabs.types';
import { GalleryItem } from './gallery.types';
import { DamagedPartDetails, InteriorDamage } from './damage.types';

/**
 * Props related to the PDF generation feature.
 */
export type InspectionReviewPDFProps =
  | {
      isPDFGeneratorEnabled?: false;
      onDownloadPDF?: never;
    }
  | {
      isPDFGeneratorEnabled: true;
      onDownloadPDF: () => void;
    };

/**
 * Props accepted by the InspectionReview component.
 */
export type InspectionReviewProps = {
  /**
   * The ID of the inspection to review.
   */
  inspectionId: string;
  /**
   * The api config used to communicate with the API. Make sure that the user described in the auth token is the same
   * one as the one that created the inspection provided in the `inspectionId` prop.
   */
  apiConfig: MonkApiConfig;
  /**
   * The position of the steering wheel in the vehicle being inspected.
   */
  steeringWheelPosition: SteeringWheelPosition;
  /**
   * The type of vehicle involved in the inspection.
   */
  vehicleType: VehicleType;
  /**
   * Mapping of sight images available in the Gallery for each Tab when selected.
   */
  sightsPerTab: {
    [key in TabKeys]: string[];
  } & {
    [key: string]: string[];
  };
  /**
   * This prop can be used to specify the language to be used by the InspectionReview component.
   *
   * @default: en
   */
  lang?: string | null;
  /**
   * Additional information to display in the top left corner, apart from VIN number.
   * Maximum of 2 entries.
   *
   * @example
   *  {
   *    "License Plate": "ABC-1234",
   *    "Owner": "John Doe"
   *  }
   */
  additionalInfo?: Record<string, string | number>;
  /**
   * Custom tabs to be displayed along with default ones.
   *
   * @default exterior, interior/tire
   * @see TabContent
   */
  customTabs?: Record<string, TabContent>;
  /**
   * Currency to be used for damages cost estimates.
   *
   * @default CurrencySymbol.USD
   */
  currency?: CurrencySymbol;
  /**
   * Custom pricings to be used in the pricing legend section. They will override the default ones.
   */
  pricings?: Partial<Record<PricingLevels, PricingData>> & {
    [key: string]: PricingData;
  };
  /**
   * Tab key to be selected when there are sights that do not match any of the predefined tabs.
   * If not provided, unmatched sights will be added to the TabKeys.Exterior tab.
   *
   * @default TabKeys.Exterior
   */
  unmatchedSightsTab?: TabKeys | string;
  /**
   * Callback function triggered when the PDF generation is requested.
   */
  onDownloadPDF?: () => void;
  /**
   * Callback function triggered when the image download is requested.
   */
  onDownloadImages?: (allGalleryItems: GalleryItem[]) => void;
} & InspectionReviewPDFProps;
/**
 * State provided by the InspectionReviewProvider.
 */

export type InspectionReviewProviderState = Pick<
  InspectionReviewProps,
  'vehicleType' | 'currency' | 'sightsPerTab' | 'additionalInfo'
> & {
  /**
   * The current inspection data.
   */
  inspection: Inspection | undefined;
  /**
   * The list of images available for this review.
   */
  allGalleryItems: GalleryItem[];
  /**
   * The currently items displayed in the gallery.
   */
  currentGalleryItems: GalleryItem[];
  /**
   * Available prices to be displayed in the price legend section.
   */
  availablePricings: Record<string, PricingData>;
  /**
   * Details about the parts that have been marked as damaged in the inspection.
   */
  damagedPartsDetails: DamagedPartDetails[];
  /**
   * The currency symbol position indicator autocalculated based on the currency property.
   * If currency is $, this will be true.
   *
   * @example
   * // For CurrencySymbol.USD
   * isLeftSideCurrency = true; // $100
   *
   * // For CurrencySymbol.EUR
   * isLeftSideCurrency = false; // 100€
   */
  isLeftSideCurrency: boolean;
  /**
   * The currently selected item in the gallery.
   */
  selectedItem: GalleryItem | null;
  /**
   * The currently active tab key.
   */
  activeTab: string;
  /**
   * Tabs list including default and custom ones.
   */
  allTabs: Record<string, TabContent>;
  /**
   * The component of the currently active tab ready to be rendered.
   */
  ActiveTabComponent: React.FC | React.ReactElement | null;
  /**
   * The part selected in the Vehicle360 wireframe from the Exterior tab along with its damaged details.
   * If no part is selected, this will be null.
   */
  selectedExteriorPart: DamagedPartDetails | null;
  /**
   * Function to change the selected exterior part in the Exterior tab.
   * If passing `null` as parameter, deselects the current part.
   */
  onChangeSelectedExteriorPart: (part: DamagedPartDetails | null) => void;
  /**
   * Function to change the active tab.
   */
  onTabChange: (tab: string) => void;
  /**
   * Function to select an item by its image ID.
   * If passing null as parameter, deselects the current item.
   */
  onSelectItemById: (imageId: string | null) => void;
  /**
   * Function to reset the selected item in the gallery and close the Spotlight Image modal.
   */
  resetSelectedItem: () => void;
  /**
   * Function to update the currently displayed gallery items.
   */
  setCurrentGalleryItems: (items: GalleryItem[]) => void;
  /**
   * Function to handle adding new interior damage and updating the state.
   * If an index is provided, it updates the existing damage at that index.
   */
  handleAddInteriorDamage: (damage: InteriorDamage, index?: number) => void;
  /**
   * Function to handle deleting interior damage by index.
   */
  handleDeleteInteriorDamage: (index: number) => void;
  /**
   * Function to handle confirming exterior damages of a part. It can add or remove damages for a part,
   * or update the pricing information.
   */
  handleConfirmExteriorDamages: (damagedPart: DamagedPartDetails) => void;
};
