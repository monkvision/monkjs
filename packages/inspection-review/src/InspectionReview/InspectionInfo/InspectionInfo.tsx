import { InspectionReviewProps } from '../types';
import { styles } from '../InspectionReview.styles';

/**
 * Props accepted by the InspectionInfo component.
 */
export type InspectionInfoProps = Pick<InspectionReviewProps, 'additionalInfo'>;

/**
 * The Inspection Info component displayed in the Inspection Review header. It can include
 * information such as the VIN number and other relevant details.
 */
export function InspectionInfo(props: InspectionInfoProps) {
  return (
    <div style={styles['legend']}>
      {props.additionalInfo &&
        Object.entries(props.additionalInfo).map(([key, value]) => (
          <div key={key}>
            <strong>{key}:</strong> {value}
          </div>
        ))}
    </div>
  );
}
