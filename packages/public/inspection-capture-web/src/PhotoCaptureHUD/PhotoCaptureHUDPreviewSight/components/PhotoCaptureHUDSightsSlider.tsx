import { Button } from '@monkvision/common-ui-web';
import { Sight } from '@monkvision/types';
import { useSightLabel } from '@monkvision/common';
import { labels } from '@monkvision/sights';
import { useRef } from 'react';
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
  const ref = useRef<HTMLDivElement>(null);
  const { label } = useSightLabel({ labels });
  const style = usePhotoCaptureHUDPreview();

  const onScrollToSelected = (index: number): void => {
    if (ref.current && ref.current.children.length > index)
      ref.current.children[index].scrollIntoView({ behavior: 'smooth', inline: 'center' });
  };

  return (
    <div style={style.slider} ref={ref}>
      {sights?.map((sight, index) => (
        <Button
          style={style.labelButton}
          key={index}
          primaryColor={sight.id === currentSight ? 'primary-base' : 'secondary-xdark'}
          onClick={() => {
            onSightSelected(sight);
            onScrollToSelected(index);
          }}
          data-testid={`sight-btn-${index}`}
        >
          {label(sight)}
        </Button>
      ))}
    </div>
  );
}
