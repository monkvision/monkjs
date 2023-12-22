import { Button, IconName } from '@monkvision/common-ui-web';
import { Sight } from '@monkvision/types';
import { useSightLabel } from '@monkvision/common';
import { labels } from '@monkvision/sights';
import { forwardRef } from 'react';
import { usePhotoCaptureHUDPreview } from '../hook';

export interface PhotoCaptureHUDSightsSliderProps {
  sights?: Sight[];
  currentSight?: string;
  sightsTaken?: Sight[];
  onSightSelected?: (sight: Sight) => void;
  onScrollToSelected?: (index: number, smooth: boolean) => void;
}

export const PhotoCaptureHUDSightsSlider = forwardRef<
  HTMLDivElement,
  PhotoCaptureHUDSightsSliderProps
>(
  (
    {
      sights,
      currentSight,
      sightsTaken,
      onSightSelected = () => {},
      onScrollToSelected = () => {},
    },
    ref,
  ) => {
    const { label } = useSightLabel({ labels });
    const style = usePhotoCaptureHUDPreview();

    return (
      <div style={style.slider} ref={ref}>
        {sights?.map((sight, index) => {
          let primaryColor = 'secondary-xdark';
          let icon = '' as IconName;
          if (sight.id === currentSight) primaryColor = 'primary-base';
          if (sightsTaken?.some((sightTaken) => sightTaken.id === sight.id)) {
            primaryColor = 'primary-light';
            icon = 'check';
          }
          return (
            <Button
              style={style.labelButton}
              key={index}
              icon={icon}
              primaryColor={primaryColor}
              onClick={() => {
                onSightSelected(sight);
                onScrollToSelected(index, true);
              }}
              data-testid={`sight-btn-${index}`}
            >
              {label(sight)}
            </Button>
          );
        })}
      </div>
    );
  },
);
