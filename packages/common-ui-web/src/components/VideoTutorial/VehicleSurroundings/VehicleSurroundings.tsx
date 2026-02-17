import { DynamicSVG } from '../../DynamicSVG';
import { vehicleSurroundings } from '../assets';
import { styles } from './VehicleSurroundings.styles';

export function VehicleSurroundings() {
  return <DynamicSVG svg={vehicleSurroundings} style={styles['vehicleSurroundingsSvg']} />;
}
