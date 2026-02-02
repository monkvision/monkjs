import { DeviceOrientation } from '@monkvision/types';
import { DynamicSVG } from '../../DynamicSVG';
import { phone, arrow } from '../assets';
import { usePhoneRotationStyles } from './PhoneRotation.styles';

export interface PhoneRotationProps {
  orientation: DeviceOrientation;
}

export function PhoneRotation({ orientation }: PhoneRotationProps) {
  const { phoneStyle, arrowsStyle, arrowLeftStyle, arrowRightStyle } = usePhoneRotationStyles({
    orientation,
  });

  return (
    <>
      <div style={arrowsStyle}>
        <DynamicSVG svg={arrow} style={arrowLeftStyle} />
        <DynamicSVG svg={arrow} style={arrowRightStyle} />
      </div>
      <DynamicSVG svg={phone} style={phoneStyle} />
    </>
  );
}
