import { styles } from './PhotoCaptureHUDSightCounter.styles';

export interface PhotoCaptureHUDSightCounterProps {
  totalSights: number;
  sightsTaken: number;
}

export function PhotoCaptureHUDSightCounter({
  totalSights,
  sightsTaken,
}: PhotoCaptureHUDSightCounterProps) {
  return <div style={styles['counter']}>{`${sightsTaken} / ${totalSights}`}</div>;
}
