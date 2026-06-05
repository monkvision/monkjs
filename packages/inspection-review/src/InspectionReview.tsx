import React from 'react';
import { Tabs } from './Tabs';
import { ReviewGallery } from './ReviewGallery';
import { GeneratePDFButton } from './GeneratePDFButton';
import { DownloadImagesButton } from './DownloadImagesButton';
import { InspectionInfo } from './InspectionInfo';
import { InspectionReviewProps } from './types';
import { styles } from './InspectionReview.styles';
import { useInspectionReviewProvider } from './hooks';

/**
 * The Inspection Review component provided by the Monk inspection-review package.
 */
export function InspectionReview(props: InspectionReviewProps) {
  const { ActiveTabComponent } = useInspectionReviewProvider();

  return (
    <div style={styles['container']}>
      <div style={styles['content']}>
        <div style={styles['header']}>
          <div style={styles['headerRow']}>
            <InspectionInfo additionalInfo={props.additionalInfo} />
          </div>

          <div style={styles['headerRow']}>
            <Tabs />
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
          <ReviewGallery />
        </div>
      </div>
    </div>
  );
}
