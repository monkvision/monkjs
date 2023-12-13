import { PhotoCaptureHUDPreview } from './hook';

export interface PhotoCaptureHUDCounterProps {
  sightDisable?: string[];
  sight: string[];
  styles: PhotoCaptureHUDPreview;
}

export function PhotoCaptureHUDCounter({
  sightDisable,
  sight,
  styles,
}: PhotoCaptureHUDCounterProps) {
  return (
    <div style={styles.counter}>
      {sightDisable} / {sight.length}
    </div>
  );
}
