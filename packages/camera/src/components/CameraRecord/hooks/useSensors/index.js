import useAccelerometer from './useAccelerometer';
import useGyroscope from './useGyroscope';
import useMagnetometer from './useMagnetometer';

export default function useSensors() {
  const accelerometer = useAccelerometer();
  const gyroscope = useGyroscope();
  const magnometer = useMagnetometer();

  return { accelerometer, gyroscope, magnometer };
}
