import { VehicleWalkaroundIndicatorProps } from './VehicleWalkaroundIndicator.types';
import { useVehicleWalkaroundIndicatorStyles } from './VehicleWalkaroundIndicator.styles';

/**
 * Component used to display a position indicator to the user when they are walking around their vehicle in the
 * VideoCapture process.
 */
export function VehicleWalkaroundIndicator({ alpha, size = 60 }: VehicleWalkaroundIndicatorProps) {
  const { svgProps, steps, progressBarProps, knobProps } = useVehicleWalkaroundIndicatorStyles({
    alpha,
    size,
  });

  return (
    <svg {...svgProps}>
      {steps.map(({ alpha: stepAlpha, props }) => (
        <circle key={stepAlpha} {...props} />
      ))}
      <circle {...progressBarProps} data-testid='progress-bar' />
      <circle {...knobProps} data-testid='knob' />
    </svg>
  );
}
