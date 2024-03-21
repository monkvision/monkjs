import { Sight } from '@monkvision/types';
import { RefObject, useEffect, useRef } from 'react';
import { useSightLabel } from '@monkvision/common';
import { labels } from '@monkvision/sights';
import { SightSliderButton } from './SightSliderButton';
import { useSightsSliderStyle } from './hook';

/**
 * Props of the SightsSlider component.
 */
export interface SightsSliderProps {
  /**
   * The list of sights provided to the PhotoCapture component.
   */
  sights: Sight[];
  /**
   * The currently selected sight in the PhotoCapture component : the sight that the user needs to capture.
   */
  selectedSight: Sight;
  /**
   * Array containing the list of sights that the user has already captured.
   */
  sightsTaken: Sight[];
  /**
   * Callback called when the user manually select a new sight.
   */
  onSelectedSight?: (sight: Sight) => void;
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

/**
 * A slider element displayed in the PhotoCapture Camera HUD. It displays a button for each sight of the capture
 * process, allowing user to have indications of the remaining sights and allowing them to change the currently selected
 * sight.
 */
export function SightsSlider({
  sights,
  selectedSight,
  sightsTaken,
  onSelectedSight = () => {},
}: SightsSliderProps) {
  const { label } = useSightLabel({ labels });
  const { container } = useSightsSliderStyle();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToSelectedSight(ref, sights.indexOf(selectedSight), true);
  }, [selectedSight, sightsTaken]);

  return (
    <div style={container} ref={ref}>
      {sights.map((sight) => (
        <SightSliderButton
          key={sight.id}
          label={label(sight)}
          isSelected={sight === selectedSight}
          isTaken={sightsTaken.includes(sight)}
          onClick={() => onSelectedSight(sight)}
        />
      ))}
    </div>
  );
}
