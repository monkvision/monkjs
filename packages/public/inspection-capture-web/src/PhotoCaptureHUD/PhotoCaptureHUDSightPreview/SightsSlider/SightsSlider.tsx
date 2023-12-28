import { Button, IconName } from '@monkvision/common-ui-web';
import { Sight } from '@monkvision/types';
import { useSightLabel } from '@monkvision/common';
import { labels } from '@monkvision/sights';
import { RefObject, useEffect, useRef } from 'react';
import { styles } from './SightsSlider.styles';

export interface SightsSliderProps {
  sights: Sight[];
  sightSelected: Sight;
  sightsTaken: Sight[];
  onSightSelected: (sight: Sight) => void;
}

interface SliderButtonProps {
  sight: Sight;
  sightSelected: Sight;
  sightsTaken: Sight[];
  onSightSelected: (sight: Sight) => void;
  label: (sight: Sight) => string;
}

function SliderButton({
  sight,
  sightSelected,
  sightsTaken,
  onSightSelected,
  label,
}: SliderButtonProps) {
  const isSelected = sight.id === sightSelected.id;
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
      onClick={() => {
        onSightSelected(sight);
      }}
      data-testid={`sight-btn-${sight.id}`}
    >
      {label(sight)}
    </Button>
  );
}

const onScrollToSelected = (
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
  sightSelected,
  sightsTaken,
  onSightSelected = () => {},
}: SightsSliderProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { label } = useSightLabel({ labels });

  useEffect(() => {
    onScrollToSelected(ref, sights.indexOf(sightSelected), true);
  }, [sightSelected, sightsTaken]);

  return (
    <div style={styles['container']} ref={ref}>
      {sights?.map((sight) => (
        <SliderButton
          key={sight.id}
          sight={sight}
          sightSelected={sightSelected}
          sightsTaken={sightsTaken}
          onSightSelected={onSightSelected}
          label={label}
        />
      ))}
    </div>
  );
}
