import { Button } from '@monkvision/common-ui-web';
import { PhotoCaptureHUDPreview } from './hook';

export interface SliderProps {
  sight: string[];
  currentSight: string;
  onSightSelected: (sight: string) => void;
  styles: PhotoCaptureHUDPreview;
}

export function PhotoCaptureHUDSightsSlider({
  sight,
  currentSight,
  onSightSelected,
  styles,
}: SliderProps) {
  return (
    <div style={styles.slider}>
      {sight.map((label: string, key: number) => (
        <Button
          style={styles.labelButton}
          key={key}
          primaryColor={
            label === currentSight || (key === 0 && currentSight === '')
              ? 'primary-base'
              : 'secondary-xdark'
          }
          onClick={() => onSightSelected(label)}
        >
          {label}
        </Button>
      ))}
    </div>
  );
}
