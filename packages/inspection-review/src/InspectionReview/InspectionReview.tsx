import { Tabs } from './Tabs';
import { ReviewGallery } from './ReviewGallery';
import { useTabsState } from './hooks/useTabsState';
import { GeneratePDFButton } from './GeneratePDFButton';
import { DownloadImagesButton } from './DownloadImagesButton';
import { InspectionInfo } from './InspectionInfo';
import { Shortcuts } from './Shortcuts';
import { InspectionReviewProps } from './types';
import { styles } from './InspectionReview.styles';

/**
 * The Inspection Review component provided by the Monk inspection-review package.
 */
export function InspectionReview(props: InspectionReviewProps) {
  const { allTabs, activeTab, ActiveTabComponent, handleTabChange } = useTabsState({
    customTabs: props.customTabs,
  });

  return (
    <div style={styles['container']}>
      <div style={styles['content']}>
        <div style={styles['header']}>
          <div style={styles['headerRow']}>
            <InspectionInfo additionalInfo={props.additionalInfo} />
            <Shortcuts />
          </div>

          <div style={styles['headerRow']}>
            <Tabs
              allTabs={Object.keys(allTabs)}
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
            <div style={styles['buttons']}>
              <div style={styles['downloadImagesButton']}>
                <DownloadImagesButton />
              </div>
              {props.isPDFGeneratorEnabled && (
                <GeneratePDFButton onDownloadPDF={props.onDownloadPDF} />
              )}
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
            gap: 16,
          }}
        >
          <div style={{ flex: 6 }}>{ActiveTabComponent}</div>
          <ReviewGallery />
        </div>
      </div>
    </div>
  );
}
