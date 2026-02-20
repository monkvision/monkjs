import { CameraDistance, Styles } from '@monkvision/types';
import { useResponsiveStyle } from '@monkvision/common';
import { SVGProps, useCallback } from 'react';
import { assets } from './assets';

const PROGRESS_BAR_STROKE_WIDTH_RATIO = 0.05;
const KNOB_STROKE_WIDTH_RATIO = 0.03;
const CAR_SIZE_RATIO = 0.5;
const PROGRESS_BAR_SIZE_RATIO = 0.95;
const NEXT_STEP_FILL_COLOR = '#f3f3f3';
const PROGRESS_BAR_FILL_COLOR = '#18e700';

interface IndicatorStep {
  alpha: number;
  size: number;
  color?: string;
}

function getDrawingConstants(size: number) {
  const s = size * (1 - PROGRESS_BAR_STROKE_WIDTH_RATIO - KNOB_STROKE_WIDTH_RATIO);
  const r = s / 2;
  return {
    s,
    r,
    v: (r * Math.SQRT2) / 2,
    offset: (size / 2) * (KNOB_STROKE_WIDTH_RATIO + PROGRESS_BAR_STROKE_WIDTH_RATIO),
  };
}

function getProgressBarProps({ alpha, size, color }: IndicatorStep): SVGProps<SVGCircleElement> {
  const { r, offset } = getDrawingConstants(size);
  const circumference = r * 2 * Math.PI;
  const dashSize = (alpha * circumference) / 360;

  return {
    r,
    cx: offset + size / 2,
    cy: size / 2,
    strokeLinecap: 'round',
    strokeWidth: size * PROGRESS_BAR_STROKE_WIDTH_RATIO,
    stroke: color ?? PROGRESS_BAR_FILL_COLOR,
    opacity: 0.64,
    fill: 'none',
    strokeDasharray: `${dashSize}px ${circumference - dashSize}px`,
    transform: `scale(1 -1) translate(0 -${size + offset}) rotate(-90 ${offset + size / 2} ${
      offset + size / 2
    })`,
  };
}

export const styles: Styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  car: { position: 'absolute' },
  pov: {
    position: 'absolute',
  },
};

export interface VehicleWalkaroundIndicatorParams {
  size: number;
  alpha: number;
  distance: CameraDistance;
  orientationAngle?: number;
  showProgressBar?: boolean;
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

export function useVehicleWalkaroundIndicatorStyle({
  size,
  alpha,
  distance,
  orientationAngle,
  showProgressBar,
}: VehicleWalkaroundIndicatorParams) {
  const { responsive } = useResponsiveStyle();
  const { CAR_SVG, POV_SVG } = assets;

  const baseRadius = size / 2;
  const position = getPointOnCircle(alpha, baseRadius);
  const orientation =
    orientationAngle !== undefined ? getPointOnCircle(orientationAngle, size / 2) : null;
  const x = orientation ? position.x - orientation.x : 0;
  const y = orientation ? position.y - orientation.y : 0;

  const angle = orientationAngle ?? alpha;
  const closeUpOffset = getcloseUpOffset(distance, alpha, baseRadius);
  const fillPercentage = Math.min(Math.max(alpha / 360, 0), 1);

  const getCarAttributes = useCallback(
    (element: SVGElement) => {
      const id = element.getAttribute('id');

      if (!showProgressBar) {
        if (id === 'car-fill-stop-1' || id === 'car-fill-stop-2' || id === 'car-fill-stop-3') {
          return { offset: '1' };
        }
        return {};
      }

      const invertedFill = 1 - fillPercentage;

      if (id === 'car-fill-stop-2') {
        return { offset: Math.max(0, invertedFill - 0.15).toString() };
      }

      if (id === 'car-fill-stop-3') {
        return { offset: invertedFill.toString() };
      }

      return {};
    },
    [fillPercentage, showProgressBar],
  );

  return {
    containerStyle: {
      ...styles['container'],
      ...responsive(styles['containerSmall']),
      width: size,
      height: size,
    },
    circleStyle: {
      width: size * PROGRESS_BAR_SIZE_RATIO,
      height: size * PROGRESS_BAR_SIZE_RATIO,
    },
    progressBarProps: getProgressBarProps({
      alpha,
      size: size * PROGRESS_BAR_SIZE_RATIO,
    }),
    fullBarProps: getProgressBarProps({
      alpha: 360,
      size: size * PROGRESS_BAR_SIZE_RATIO,
      color: NEXT_STEP_FILL_COLOR,
    }),
    povProps: {
      svg: POV_SVG,
      width: size,
      height: size,
      style: {
        ...styles['pov'],
        transform: ` translate(${x - closeUpOffset.x}px, ${
          y - closeUpOffset.y
        }px) rotate(${-angle}deg)`,
      },
    },
    carProps: {
      svg: CAR_SVG,
      width: size * CAR_SIZE_RATIO,
      height: size * CAR_SIZE_RATIO,
      getAttributes: getCarAttributes,
      style: { ...styles['car'] },
    },
  };
}
