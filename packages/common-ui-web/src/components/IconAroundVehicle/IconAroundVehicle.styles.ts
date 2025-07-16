import { CameraDistance, Styles } from '@monkvision/types';
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
  distance: CameraDistance;
  orientationAngle?: number;
}

function getPointOnCircle(angleDegrees: number, radius: number): { x: number; y: number } {
  const shiftedAngleDegrees = angleDegrees - 90;
  const angleRadians = shiftedAngleDegrees * (Math.PI / 180);

  const x = Math.round(radius * Math.cos(angleRadians));
  const y = Math.round(radius * Math.sin(angleRadians)) * -1;

  return { x, y };
}

function getcloseUpOffset(
  distance: CameraDistance,
  positionAroundVehicle: number,
  radius: number,
): { x: number; y: number } {
  switch (distance) {
    case CameraDistance.INTERIOR:
      return getPointOnCircle(positionAroundVehicle, radius * 0.7);
    case CameraDistance.CLOSE:
      return getPointOnCircle(positionAroundVehicle, radius * 0.3);
    default:
      return { x: 0, y: 0 };
  }
}

export function useIconAroundVehicleStyle({
  size,
  positionAroundVehicle,
  distance,
  orientationAngle,
}: IconAroundVehicleParams) {
  const { responsive } = useResponsiveStyle();

  const baseRadius = size / 2;

  const position = getPointOnCircle(positionAroundVehicle, baseRadius);
  const orientation =
    orientationAngle !== undefined ? getPointOnCircle(orientationAngle, size / 2) : null;
  const x = orientation ? position.x - orientation.x : 0;
  const y = orientation ? position.y - orientation.y : 0;

  const angle = orientationAngle ?? positionAroundVehicle;

  const closeUpOffset = getcloseUpOffset(distance, positionAroundVehicle, baseRadius);

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
