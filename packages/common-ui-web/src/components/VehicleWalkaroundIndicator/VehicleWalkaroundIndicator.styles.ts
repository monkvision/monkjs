import { SVGProps } from 'react';
import { VehicleWalkaroundIndicatorProps } from './VehicleWalkaroundIndicator.types';

const PROGRESS_BAR_STROKE_WIDTH_RATIO = 0.15;
const KNOB_STROKE_WIDTH_RATIO = 0.03;
const DEFAULT_STEP_FILL_COLOR = '#6b6b6b';
const NEXT_STEP_FILL_COLOR = '#f3f3f3';
const PROGRESS_BAR_FILL_COLOR = '#18e700';
const KNOB_FILL_COLOR = '#0A84FF';
const KNOB_STROKE_COLOR = '#f3f3f3';

interface VehicleWalkaroundIndicatorStyleParams extends Required<VehicleWalkaroundIndicatorProps> {}

interface IndicatorStep {
  alpha: number;
  props: SVGProps<SVGCircleElement>;
}

interface VehicleWalkaroundIndicatorStyles {
  svgProps: SVGProps<SVGSVGElement>;
  steps: IndicatorStep[];
  progressBarProps: SVGProps<SVGCircleElement>;
  knobProps: SVGProps<SVGCircleElement>;
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

function getStepsProps({ alpha, size }: VehicleWalkaroundIndicatorStyleParams): IndicatorStep[] {
  const { s, r, v, offset } = getDrawingConstants(size);
  const sharedProps: SVGProps<SVGCircleElement> = {
    r: (size * PROGRESS_BAR_STROKE_WIDTH_RATIO) / 2,
    strokeWidth: 0,
    fill: DEFAULT_STEP_FILL_COLOR,
  };
  const steps: IndicatorStep[] = [
    { alpha: 0, cx: r, cy: s },
    { alpha: 45, cx: r + v, cy: r + v },
    { alpha: 90, cx: s, cy: r },
    { alpha: 135, cx: r + v, cy: r - v },
    { alpha: 180, cx: r, cy: 0 },
    { alpha: 225, cx: r - v, cy: r - v },
    { alpha: 270, cx: 0, cy: r },
    { alpha: 315, cx: r - v, cy: r + v },
  ].map((step) => ({
    alpha: step.alpha,
    props: {
      cx: step.cx + offset,
      cy: step.cy + offset,
      ...sharedProps,
    },
  }));

  const nextStep = steps?.find((step) => step.alpha > alpha);
  if (nextStep) {
    nextStep.props.fill = NEXT_STEP_FILL_COLOR;
  }
  return steps;
}

function getProgressBarProps({
  alpha,
  size,
}: VehicleWalkaroundIndicatorStyleParams): SVGProps<SVGCircleElement> {
  const { r, offset } = getDrawingConstants(size);
  const circumference = r * 2 * Math.PI;
  const dashSize = (alpha * circumference) / 360;

  return {
    r,
    cx: offset + size / 2,
    cy: size / 2,
    strokeLinecap: 'round',
    strokeWidth: size * PROGRESS_BAR_STROKE_WIDTH_RATIO,
    stroke: PROGRESS_BAR_FILL_COLOR,
    fill: 'none',
    strokeDasharray: `${dashSize}px ${circumference - dashSize}px`,
    transform: `scale(1 -1) translate(0 -${size + offset}) rotate(-90 ${offset + size / 2} ${
      offset + size / 2
    })`,
  };
}

function getKnobProps({
  alpha,
  size,
}: VehicleWalkaroundIndicatorStyleParams): SVGProps<SVGCircleElement> {
  const { r, offset } = getDrawingConstants(size);
  const theta = (alpha * Math.PI) / 180 - Math.PI / 2;
  return {
    r: (size * PROGRESS_BAR_STROKE_WIDTH_RATIO) / 2,
    cx: offset + r * (1 + Math.cos(theta)),
    cy: offset + r * (1 - Math.sin(theta)),
    fill: KNOB_FILL_COLOR,
    strokeWidth: size * KNOB_STROKE_WIDTH_RATIO,
    stroke: KNOB_STROKE_COLOR,
  };
}

export function useVehicleWalkaroundIndicatorStyles({
  alpha,
  size,
}: VehicleWalkaroundIndicatorStyleParams): VehicleWalkaroundIndicatorStyles {
  return {
    svgProps: {
      width: size,
      height: size,
      viewBox: `0 0 ${size} ${size}`,
    },
    steps: getStepsProps({ alpha, size }),
    progressBarProps: getProgressBarProps({ alpha, size }),
    knobProps: getKnobProps({ alpha, size }),
  };
}
