import { InspectionReviewProps } from '../types';
import { styles } from './InspectionInfo.styles';

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
    <div style={styles['container']}>
      {props.additionalInfo &&
        Object.entries(props.additionalInfo).map(([key, value]) => (
          <div key={key} style={styles['item']}>
            <strong>{key}:</strong> {value}
          </div>
        ))}
    </div>
  );
}
