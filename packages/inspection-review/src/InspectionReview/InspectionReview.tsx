import { styles } from './InspectionReview.styles';
import { MonkApiConfig } from '@monkvision/network';
import { Tabs } from './Tabs';
import { ReviewGallery } from './ReviewGallery';
import { InspectionReviewHeader } from './InspectionReviewHeader/InspectionReviewHeader';
import { useInspectionReviewState, useTabsState } from './hooks';
import { GeneratePDFButton } from './GeneratePDFButton';
import { DownloadImagesButton } from './DownloadImagesButton';
import { ActiveTab } from './ActiveTab';

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
   * TODO.
   */
  tabs?: string[];
  /**
   * Currency to be used for cost estimates.
   *
   * @default USD
   */
  currency?: string;
};

/**
 * The Inspection Review component provided by the Monk inspection-review package.
 */
export function InspectionReview(props: InspectionReviewProps) {
  const { galleryItems } = useInspectionReviewState({ inspectionId: props.inspectionId });
  const { activeTab, handleTabChange } = useTabsState();

  return (
    <div style={styles['container']}>
      <InspectionReviewHeader />

      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <div style={{ flex: 6 }}>
          <Tabs activeTab={activeTab} onTabChange={handleTabChange} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <DownloadImagesButton />
          <GeneratePDFButton />
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <div style={{ flex: 6 }}>
          <ActiveTab activeTab={activeTab} />
        </div>

        <ReviewGallery galleryItems={galleryItems} />
      </div>
    </div>
  );
}
