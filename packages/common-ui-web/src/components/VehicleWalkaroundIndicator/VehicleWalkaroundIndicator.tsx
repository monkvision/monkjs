import { CameraDistance } from '@monkvision/types';
import { DynamicSVG } from '../DynamicSVG';
import { VehicleWalkaroundIndicatorProps } from './VehicleWalkaroundIndicator.types';
import { useVehicleWalkaroundIndicatorStyles } from './VehicleWalkaroundIndicator.styles';

/**
 * Component used to display a position indicator to the user when they are walking around their vehicle in the
 * VideoCapture process.
 */
export function VehicleWalkaroundIndicator({
  alpha,
  size = 70,
  orientationAngle,
  showCircle = true,
  distance = CameraDistance.STANDARD,
  showProgressBar = true,
  coveredSegments,
  ...passThroughProps
}: VehicleWalkaroundIndicatorProps) {
  const style = useVehicleWalkaroundIndicatorStyles({
    size,
    alpha,
    orientationAngle,
    distance,
    showProgressBar,
    coveredSegments,
  });
  return (
    <div style={style.containerStyle} {...passThroughProps}>
      <svg style={style.circleStyle}>
        {showCircle && <circle {...style.fullBarProps} data-testid='full-bar' />}
        {showProgressBar &&
          style.progressBarPropsArray.map((props, index) => (
            <circle {...props} key={index} data-testid='progress-bar' />
          ))}
      </svg>
      <DynamicSVG {...style.carProps} />
      <DynamicSVG {...style.povProps} />
    </div>
  );
}
