import { getHexFromRGBA, getRGBAFromString, useMonkTheme } from '@monkvision/common';
import { styles } from './SightsCounter.styles';

export interface SightsCounterProps {
  totalSights: number;
  sightsTaken: number;
}
export function SightsCounter({ totalSights, sightsTaken }: SightsCounterProps) {
  const { palette } = useMonkTheme();

  const bgColor = getHexFromRGBA({ ...getRGBAFromString(palette.secondary.xdark), a: 0.64 });

  return (
    <div
      style={{ ...styles['counter'], backgroundColor: bgColor }}
    >{`${sightsTaken} / ${totalSights}`}</div>
  );
}
