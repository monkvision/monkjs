import { InspectionInfo } from './InspectionInfo';
import { styles } from './InspectionReviewHeader.styles';
import { Shortcuts } from './Shortcuts';

export function InspectionReviewHeader() {
  return (
    <div style={styles['container']}>
      <InspectionInfo />
      <Shortcuts />
    </div>
  );
}
