import { styles } from './SightsCounter.styles';
import { usePhotoHUDButtonBackground } from '../../hooks';

export interface SightsCounterProps {
  totalSights: number;
  sightsTaken: number;
}
export function SightsCounter({ totalSights, sightsTaken }: SightsCounterProps) {
  const { bgColor } = usePhotoHUDButtonBackground();

  return (
    <div
      style={{ ...styles['counter'], backgroundColor: bgColor }}
    >{`${sightsTaken} / ${totalSights}`}</div>
  );
}
