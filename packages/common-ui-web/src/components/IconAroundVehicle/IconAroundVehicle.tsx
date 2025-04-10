import { CameraDistance } from '@monkvision/types';
import { DynamicSVG } from '../DynamicSVG';
import { assets } from './assets';
import { styles, useIconAroundVehicleStyle } from './IconAroundVehicle.styles';
import { IconAroundVehicleProps } from './IconAroundVehicle.types';

/**
 * Component used to display an icon representing a vehicle and a point of view (POV) indicator.
 */
export function IconAroundVehicle({
  size = 50,
  positionAroundVehicle = 0,
  orientationAngle,
  showCircle = true,
  distance = CameraDistance.STANDARD,
  ...passThroughProps
}: IconAroundVehicleProps) {
  const style = useIconAroundVehicleStyle({
    size,
    positionAroundVehicle,
    orientationAngle,
    distance,
  });
  const { CAR_SVG, CIRCLE_SVG, POV_SVG } = assets;
  const carSize = size * 0.6;
  const povSize = size * 1.1;

  return (
    <div style={style.container} {...passThroughProps}>
      {showCircle && (
        <DynamicSVG svg={CIRCLE_SVG} width={size} height={size} style={styles['car']} />
      )}
      <DynamicSVG svg={CAR_SVG} width={carSize} height={carSize} style={styles['car']} />
      <DynamicSVG svg={POV_SVG} width={povSize} height={povSize} style={style.pov} />
    </div>
  );
}
