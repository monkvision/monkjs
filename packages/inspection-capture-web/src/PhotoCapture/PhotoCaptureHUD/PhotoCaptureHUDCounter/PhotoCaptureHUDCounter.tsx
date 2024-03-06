import { styles } from './PhotoCaptureHUDCounter.styles';
import { usePhotoCaptureHUDButtonBackground } from '../hooks';
import { PhotoCaptureHUDCounterProps, usePhotoCaptureHUDCounterLabel } from './hooks';

/**
 * Component that implements an indicator of pictures taken during the PhotoCapture process.
 */
export function PhotoCaptureHUDCounter(props: PhotoCaptureHUDCounterProps) {
  const label = usePhotoCaptureHUDCounterLabel(props);
  const backgroundColor = usePhotoCaptureHUDButtonBackground();

  return (
    <div style={{ ...styles['counter'], backgroundColor }} data-testid={'damage-counter'}>
      {label}
    </div>
  );
}
