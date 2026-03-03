import { styles } from './InspectionReview.styles';
import { Tabs } from './Tabs';
import { ReviewGallery } from './ReviewGallery';
import { useTabsState } from './hooks/useTabsState';
import { GeneratePDFButton } from './GeneratePDFButton';
import { DownloadImagesButton } from './DownloadImagesButton';
import { InspectionInfo } from './InspectionInfo';
import { Shortcuts } from './Shortcuts';
import { InspectionReviewProps } from './types';

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
