import { MonkApiConfig } from '@monkvision/network';
import { SteeringWheelPosition, VehicleType } from '@monkvision/types';
import { PricingData } from './pricing.types';
import { TabKeys, TabContent } from './tabs.types';

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
  sightsPerTab: Record<TabKeys | string, string[]>;
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
   * Enable or disable PDF generation feature in the document actions.
   *
   * @default true
   */
  isPDFGeneratorEnabled?: boolean;
  /**
   * Custom tabs to be displayed along with default ones.
   *
   * @default exterior, interior/tire
   * @see TabContent
   */
  customTabs?: Record<string, TabContent>;
  /**
   * Currency to be used for cost estimates.
   *
   * @default '$'
   */
  currency?: string;
  /**
   * Custom pricings to be used in the pricing legend section. They will override the default ones.
   */
  pricings?: Record<string, PricingData>;
  /**
   * Callback function triggered when the PDF generation is requested.
   */
  onDownloadPDF?: () => void;
};
