import { usePhotoCaptureHUDPreview } from '../hook';

export interface PhotoCaptureHUDCounterProps {
  totalSights: number;
  sightsTaken: number;
}

export function PhotoCaptureHUDCounter({
  totalSights = 0,
  sightsTaken = 0,
}: PhotoCaptureHUDCounterProps) {
  const style = usePhotoCaptureHUDPreview();

  return (
    <div style={style.counter}>
      {`${sightsTaken} / ${totalSights}`}
    </div>
  );
}
