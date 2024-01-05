import { Button, IconName } from '@monkvision/common-ui-web';
import { Sight } from '@monkvision/types';
import { useSightLabel } from '@monkvision/common';
import { labels } from '@monkvision/sights';
import { RefObject, useEffect, useRef } from 'react';
import { styles } from './SightsSlider.styles';

export interface SightsSliderProps {
  sights: Sight[];
  selectedSight: Sight;
  sightsTaken: Sight[];
  onSelectedSight?: (sight: Sight) => void;
}

interface SliderButtonProps {
  sight: Sight;
  selectedSight: Sight;
  sightsTaken: Sight[];
  onSelectedSight: (sight: Sight) => void;
  label: (sight: Sight) => string;
}

function SliderButton({
  sight,
  selectedSight,
  sightsTaken,
  onSelectedSight,
  label,
}: SliderButtonProps) {
  const isSelected = sight.id === selectedSight.id;
  const isTaken = sightsTaken.some((sightTaken) => sightTaken.id === sight.id);

  let primaryColor = 'secondary-xdark';
  let icon = undefined as IconName | undefined;

  if (isSelected) {
    primaryColor = 'primary-base';
  }
  if (isTaken) {
    primaryColor = 'primary-light';
    icon = 'check';
  }
  return (
    <Button
      style={styles['button']}
      icon={icon}
      primaryColor={primaryColor}
      onClick={() => onSelectedSight(sight)}
      data-testid={`sight-btn-${sight.id}`}
    >
      {label(sight)}
    </Button>
  );
}

const scrollToSelectedSight = (
  ref: RefObject<HTMLDivElement>,
  index: number,
  smooth: boolean,
): void => {
  if (ref.current && ref.current.children.length > index) {
    ref.current.children[index].scrollIntoView({
      behavior: smooth ? 'smooth' : ('instant' as ScrollBehavior),
      inline: 'center',
    });
  }
};

export function SightsSlider({
  sights,
  selectedSight,
  sightsTaken,
  onSelectedSight = () => {},
}: SightsSliderProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { label } = useSightLabel({ labels });

  useEffect(() => {
    scrollToSelectedSight(ref, sights.indexOf(selectedSight), true);
  }, [selectedSight, sightsTaken]);

  return (
    <div style={styles['container']} ref={ref}>
      {sights.map((sight) => (
        <SliderButton
          key={sight.id}
          sight={sight}
          selectedSight={selectedSight}
          sightsTaken={sightsTaken}
          onSelectedSight={onSelectedSight}
          label={label}
        />
      ))}
    </div>
  );
}
