import { DeviceOrientation } from '@monkvision/types';
import { DynamicSVG } from '../../DynamicSVG';
import { styles, useVehiclePhone } from './VehiclePhone.styles';
import { vehicleSurroundings, phone } from '../assets';

export interface VehiclePhoneProps {
  orientation: DeviceOrientation;
}
export function VehiclePhone({ orientation }: VehiclePhoneProps) {
  const { phoneStyle, getAttributes } = useVehiclePhone({ orientation });

  return (
    <div style={styles['container']}>
      <DynamicSVG
        svg={vehicleSurroundings}
        style={styles['vehicleScaling']}
        getAttributes={getAttributes}
      />
      <DynamicSVG svg={phone} style={phoneStyle} />
    </div>
  );
}
