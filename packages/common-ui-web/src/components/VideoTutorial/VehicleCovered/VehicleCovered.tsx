import { DynamicSVG } from '../../DynamicSVG';
import { styles } from './VehicleCovered.styles';
import { vehicleCovered } from '../assets';

export function VehicleCovered() {
  return <DynamicSVG svg={vehicleCovered} style={styles['vehicleCoveredSvg']} />;
}
