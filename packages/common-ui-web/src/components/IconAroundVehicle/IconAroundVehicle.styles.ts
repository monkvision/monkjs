import { Styles } from '@monkvision/types';
import { useResponsiveStyle } from '@monkvision/common';

export const styles: Styles = {
  container: {
    padding: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  car: { position: 'absolute' },
  pov: {
    position: 'absolute',
  },
};

export interface IconAroundVehicleParams {
  size: number;
  positionAroundVehicle: number;
  orientationAngle?: number;
  isPovClose?: boolean;
}

function getPointOnCircle(angleDegrees: number, radius: number): { x: number; y: number } {
  const shiftedAngleDegrees = angleDegrees - 90;
  const angleRadians = shiftedAngleDegrees * (Math.PI / 180);

  const x = Math.round(radius * Math.cos(angleRadians));
  const y = Math.round(radius * Math.sin(angleRadians)) * -1;

  return { x, y };
}

export function useIconAroundVehicleStyle({
  size,
  positionAroundVehicle,
  orientationAngle,
  isPovClose,
}: IconAroundVehicleParams) {
  const { responsive } = useResponsiveStyle();

  const baseRadius = size / 2;
  const closeUpRadius = baseRadius * 0.3;

  const position = getPointOnCircle(positionAroundVehicle, baseRadius);
  const orientation =
    orientationAngle !== undefined ? getPointOnCircle(orientationAngle, size / 2) : null;
  const x = orientation ? position.x - orientation.x : 0;
  const y = orientation ? position.y - orientation.y : 0;

  const angle = orientationAngle ?? positionAroundVehicle;

  const closeUpOffset = isPovClose
    ? getPointOnCircle(positionAroundVehicle, closeUpRadius)
    : { x: 0, y: 0 };

  return {
    container: {
      ...styles['container'],
      ...responsive(styles['containerSmall']),
      width: size,
      height: size,
    },
    pov: {
      ...styles['pov'],
      transform: ` translate(${x - closeUpOffset.x}px, ${
        y - closeUpOffset.y
      }px) rotate(${-angle}deg)`,
    },
  };
}
