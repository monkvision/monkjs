import { DeviceOrientation } from '@monkvision/types';
import { DynamicSVG } from '../../DynamicSVG';
import { styles, useVehiclePhoneStyles } from './VehiclePhone.styles';
import { vehicleSurroundings, phone } from '../assets';

export interface VehiclePhoneProps {
  orientation: DeviceOrientation;
}

export function VehiclePhone({ orientation }: VehiclePhoneProps) {
  const { phoneStyle, vehicleStyle, getAttributes } = useVehiclePhoneStyles({ orientation });

  return (
    <div style={styles['container']}>
      <DynamicSVG svg={vehicleSurroundings} style={vehicleStyle} getAttributes={getAttributes} />
      <DynamicSVG svg={phone} style={phoneStyle} />
    </div>
  );
}
