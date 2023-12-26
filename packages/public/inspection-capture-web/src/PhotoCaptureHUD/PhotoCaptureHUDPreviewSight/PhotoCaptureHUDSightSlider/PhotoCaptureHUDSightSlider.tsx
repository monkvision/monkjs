import { Button, IconName } from '@monkvision/common-ui-web';
import { Sight } from '@monkvision/types';
import { useSightLabel } from '@monkvision/common';
import { labels } from '@monkvision/sights';
import { useEffect, useRef } from 'react';
import { styles } from './PhotoCaptureHUDSightSlider.styles';

export interface PhotoCaptureHUDSightsSliderProps {
  sights: Sight[];
  currentSight: string;
  sightsTaken: Sight[];
  onSightSelected?: (sight: Sight, index: number) => void;
  currentSightSliderIndex: number;
}

interface SliderButtonProps {
  index: number;
  sight: Sight;
  currentSight: string;
  sightsTaken: Sight[];
  onSightSelected: (sight: Sight, index: number) => void;
  label: (sight: Sight) => string;
}

function SliderButton({
  index,
  sight,
  currentSight,
  sightsTaken,
  onSightSelected,
  label,
}: SliderButtonProps) {
  let primaryColor = 'secondary-xdark';
  let icon = undefined as IconName | undefined;
  if (sight.id === currentSight) {
    primaryColor = 'primary-base';
  }
  if (sightsTaken?.some((sightTaken) => sightTaken.id === sight.id)) {
    primaryColor = 'primary-light';
    icon = 'check';
  }
  return (
    <Button
      style={styles['labelButton']}
      key={index}
      icon={icon}
      primaryColor={primaryColor}
      onClick={() => {
        onSightSelected(sight, index);
      }}
      data-testid={`sight-btn-${index}`}
    >
      {label(sight)}
    </Button>
  );
}

export function PhotoCaptureHUDSightSlider({
  sights,
  currentSight,
  sightsTaken,
  onSightSelected = () => {},
  currentSightSliderIndex,
}: PhotoCaptureHUDSightsSliderProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { label } = useSightLabel({ labels });

  const onScrollToSelected = (index: number, smooth: boolean): void => {
    if (ref.current && ref.current.children.length > index) {
      ref.current.children[index].scrollIntoView({
        behavior: smooth ? 'smooth' : ('instant' as ScrollBehavior),
        inline: 'center',
      });
    }
  };

  useEffect(() => {
    onScrollToSelected(currentSightSliderIndex, true);
  }, [currentSight]);

  return (
    <div style={styles['slider']} ref={ref}>
      {sights?.map((sight, index) => (
        <SliderButton
          key={index}
          index={index}
          sight={sight}
          currentSight={currentSight}
          sightsTaken={sightsTaken}
          onSightSelected={onSightSelected}
          label={label}
        />
      ))}
    </div>
  );
}
