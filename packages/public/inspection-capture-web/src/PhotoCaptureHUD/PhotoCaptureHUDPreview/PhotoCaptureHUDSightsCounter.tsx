import { usePhotoCaptureHUDPreview } from './hook';

export interface PhotoCaptureHUDCounterProps {
  totalSights?: number;
  sightsTaken?: number;
}

export function PhotoCaptureHUDCounter({ totalSights, sightsTaken }: PhotoCaptureHUDCounterProps) {
  const style = usePhotoCaptureHUDPreview();

  return (
    <div style={style.counter}>
      {sightsTaken} / {totalSights}
    </div>
  );
}
