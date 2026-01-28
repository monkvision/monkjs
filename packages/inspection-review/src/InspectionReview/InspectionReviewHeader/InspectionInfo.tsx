import { styles } from './InspectionReviewHeader.styles';

export function InspectionInfo() {
  return (
    <div style={styles['legend']}>
      <span style={styles['vin']}>VIN: {1234567890}</span>
    </div>
  );
}
