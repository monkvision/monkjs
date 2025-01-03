import { styles } from './Counter.styles';
import { useColorBackground } from '../../hooks';
import { CounterProps, useCounterLabel } from './hooks';

/**
 * Component that implements an indicator of pictures taken during the capture process.
 */
export function Counter(props: CounterProps) {
  const label = useCounterLabel(props);
  const backgroundColor = useColorBackground();

  return (
    <div style={{ ...styles['counter'], backgroundColor }} data-testid={'damage-counter'}>
      {label}
    </div>
  );
}
