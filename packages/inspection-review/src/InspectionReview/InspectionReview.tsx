import { styles } from './InspectionReview.styles';
import { SteeringWheelPosition, VehicleType } from '@monkvision/types';
import { MonkApiConfig } from '@monkvision/network';
import { Tabs } from './Tabs';
import { ReviewGallery } from './ReviewGallery';
import { useTabsState } from './hooks';
import { GeneratePDFButton } from './GeneratePDFButton';
import { DownloadImagesButton } from './DownloadImagesButton';
import { InspectionInfo } from './InspectionInfo';
import { Shortcuts } from './Shortcuts';
import { PricingData } from './types/pricing.types';
import { TabKeys, TabContent } from './types';

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
   * The types of vehicles involved in the inspection.
   */
  vehicleTypes: VehicleType[];
  /**
   * A mapping of vehicle types to their corresponding sight IDs.
   */
  sights: Partial<Record<VehicleType, string[]>>;
  /**
   * The tab key to be used for where the unmatched sights should be displayed.
   */
  unmatchedSightsTab: TabKeys | string;
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
   * @default USD
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

/**
 * The Inspection Review component provided by the Monk inspection-review package.
 */
export function InspectionReview(props: InspectionReviewProps) {
  const { allTabs, activeTab, ActiveTabComponent, handleTabChange } = useTabsState({
    customTabs: props.customTabs,
  });

  return (
    <div style={styles['container']}>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <InspectionInfo additionalInfo={props.additionalInfo} />
        <Shortcuts />
      </div>

      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <div style={{ flex: 6 }}>
          <Tabs
            allTabs={Object.keys(allTabs)}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <DownloadImagesButton />
          {props.isPDFGeneratorEnabled && <GeneratePDFButton onDownloadPDF={props.onDownloadPDF} />}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <div style={{ flex: 6 }}>{ActiveTabComponent}</div>
        <ReviewGallery />
      </div>
    </div>
  );
}
