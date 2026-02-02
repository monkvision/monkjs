import { DynamicSVG } from '../../DynamicSVG';
import { vehicleOrbit } from '../assets';
import { styles } from './VehicleOrbit.styles';

export function VehicleOrbit() {
  return <DynamicSVG svg={vehicleOrbit} style={styles['vehicleOrbitSvg']} />;
}
