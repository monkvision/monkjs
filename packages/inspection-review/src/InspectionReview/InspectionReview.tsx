import { styles } from './InspectionReview.styles';
import { MonkApiConfig } from '@monkvision/network';
import { Tabs } from './Tabs';
import { ReviewGallery } from './ReviewGallery';
import { TabContent, useTabsState } from './hooks';
import { GeneratePDFButton } from './GeneratePDFButton';
import { DownloadImagesButton } from './DownloadImagesButton';
import { InspectionInfo } from './InspectionInfo';
import { Shortcuts } from './Shortcuts';
import { Image } from '@monkvision/types';
import React, { useMemo } from 'react';

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
   * Custom tabs to be displayed along with default ones.
   *
   * @default exterior, interior/tire
   */
  customTabs?: Record<string, TabContent>;
  /**
   * Callback to handle updates to the gallery items. Useful when changing between custom tabs.
   */
  handleGalleryUpdate?: (items: Image[]) => void;
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
  const { allTabs, activeTab, handleTabChange } = useTabsState({
    customTabs: props.customTabs,
  });
  const ActiveTab = useMemo(() => {
    const activeTabContent = allTabs[activeTab];
    let tabComponent = activeTabContent;

    if ('Component' in activeTabContent) {
      tabComponent = activeTabContent.Component;
    }
    if (React.isValidElement(tabComponent)) {
      return tabComponent;
    }
    if (typeof tabComponent === 'function') {
      return React.createElement(tabComponent);
    }

    return null;
  }, [activeTab, allTabs]);

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
          {props.isPDFGeneratorEnabled && <GeneratePDFButton />}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <div style={{ flex: 6 }}>{ActiveTab}</div>
        <ReviewGallery />
      </div>
    </div>
  );
}
