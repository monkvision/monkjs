import React from 'react';
import { Tabs } from './Tabs';
import { ReviewGallery } from './ReviewGallery';
import { useTabsState } from './hooks/useTabsState';
import { GeneratePDFButton } from './GeneratePDFButton';
import { DownloadImagesButton } from './DownloadImagesButton';
import { InspectionInfo } from './InspectionInfo';
import { InspectionReviewProps } from './types';
import { styles } from './InspectionReview.styles';
import { useGalleryState } from './ReviewGallery/hooks';

/**
 * The Inspection Review component provided by the Monk inspection-review package.
 */
export function InspectionReview(props: InspectionReviewProps) {
  const { selectedItem, onSelectItemById, resetSelectedItem } = useGalleryState();
  const { allTabs, activeTab, ActiveTabComponent, onTabChange } = useTabsState({
    customTabs: props.customTabs,
    onTabChangeListeners: [resetSelectedItem],
  });

  return (
    <div style={styles['container']}>
      <div style={styles['content']}>
        <div style={styles['header']}>
          <div style={styles['headerRow']}>
            <InspectionInfo additionalInfo={props.additionalInfo} />
          </div>

          <div style={styles['headerRow']}>
            <Tabs allTabs={allTabs} activeTab={activeTab} onTabChange={onTabChange} />
            <div style={styles['buttons']}>
              <div style={styles['downloadImagesButton']}>
                <DownloadImagesButton onDownloadImages={props.onDownloadImages} />
              </div>
              {props.isPDFGeneratorEnabled && (
                <GeneratePDFButton onDownloadPDF={props.onDownloadPDF} />
              )}
            </div>
          </div>
        </div>

        <div style={styles['contentRow']}>
          <div style={styles['activeTabContainer']}>
            {React.isValidElement(ActiveTabComponent) && ActiveTabComponent}
          </div>
          <ReviewGallery selectedItem={selectedItem} onSelectItemById={onSelectItemById} />
        </div>
      </div>
    </div>
  );
}
