import { styles } from './SightsCounter.styles';

export interface SightsCounterProps {
  totalSights: number;
  sightsTaken: number;
}

export function SightsCounter({ totalSights, sightsTaken }: SightsCounterProps) {
  return <div style={styles['counter']}>{`${sightsTaken} / ${totalSights}`}</div>;
}
