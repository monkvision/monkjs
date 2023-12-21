import { Button } from '@monkvision/common-ui-web';
import { Sight } from '@monkvision/types';
import { useSightLabel } from '@monkvision/common';
import { labels } from '@monkvision/sights';
import { usePhotoCaptureHUDPreview } from '../hook';

export interface PhotoCaptureHUDSightsSliderProps {
  sights?: Sight[];
  currentSight?: string;
  onSightSelected?: (sight: Sight) => void;
}

export function PhotoCaptureHUDSightsSlider({
  sights,
  currentSight,
  onSightSelected = () => {},
}: PhotoCaptureHUDSightsSliderProps) {
  const { label } = useSightLabel({ labels });
  const style = usePhotoCaptureHUDPreview();

  return (
    <div style={style.slider}>
      {sights?.map((sight, index) => (
        <Button
          style={style.labelButton}
          key={index}
          primaryColor={sight.id === currentSight ? 'primary-base' : 'secondary-xdark'}
          onClick={() => onSightSelected(sight)}
          data-testid={`sight-btn-${index}`}
        >
          {label(sight)}
        </Button>
      ))}
    </div>
  );
}
