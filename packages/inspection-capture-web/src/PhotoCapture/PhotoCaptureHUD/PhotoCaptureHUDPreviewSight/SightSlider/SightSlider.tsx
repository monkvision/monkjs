import { ImageStatus, Sight } from '@monkvision/types';
import { RefObject, useEffect, useMemo, useRef } from 'react';
import { useMonkState, useSightLabel } from '@monkvision/common';
import { labels } from '@monkvision/sights';
import { SightSliderButton } from './SightSliderButton';
import { useSightSliderStyles } from './hooks';

/**
 * Props of the SightSlider component.
 */
export interface SightSliderProps {
  /**
   * The ID of the current inspection.
   */
  inspectionId: string;
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

interface SightSliderItem {
  sight: Sight;
  status?: ImageStatus;
}

function useSightSliderItems(inspectionId: string, sights: Sight[]): SightSliderItem[] {
  const { state } = useMonkState();
  return useMemo(
    () =>
      sights.map((sight) => ({
        sight,
        status: state.images.find(
          (image) =>
            image.inspectionId === inspectionId && image.additionalData?.sight_id === sight.id,
        )?.status,
      })),
    [state.images, sights],
  );
}

/**
 * A slider element displayed in the PhotoCapture Camera HUD. It displays a button for each sight of the capture
 * process, allowing user to have indications of the remaining sights and allowing them to change the currently selected
 * sight.
 */
export function SightSlider({
  inspectionId,
  sights,
  selectedSight,
  sightsTaken,
  onSelectedSight = () => {},
}: SightSliderProps) {
  const items = useSightSliderItems(inspectionId, sights);
  const { label } = useSightLabel({ labels });
  const { container } = useSightSliderStyles();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToSelectedSight(ref, sights.indexOf(selectedSight), true);
  }, [selectedSight, sightsTaken]);

  return (
    <div style={container} ref={ref}>
      {items.map(({ sight, status }) => (
        <SightSliderButton
          key={sight.id}
          label={label(sight)}
          isSelected={sight === selectedSight}
          status={status}
          onClick={() => onSelectedSight(sight)}
        />
      ))}
    </div>
  );
}
