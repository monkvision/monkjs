import { Button } from '@monkvision/common-ui-web';
import { Sight } from '@monkvision/types';
import { useObjectTranslation } from '@monkvision/common';
import { labels } from '@monkvision/sights';
import { usePhotoCaptureHUDPreview } from './hook';

export interface PhotoCaptureHUDSliderProps {
  sights?: Sight[];
  currentSight?: Sight;
  onSightSelected?: (sight: Sight) => void;
}

export interface UseSightLabelResult {
  label: (sight: Sight) => string;
}

export function PhotoCaptureHUDSightsSlider({
  sights,
  currentSight,
  onSightSelected,
}: PhotoCaptureHUDSliderProps) {
  const style = usePhotoCaptureHUDPreview();

  function useSightLabel(): UseSightLabelResult {
    const { tObj } = useObjectTranslation();
    return {
      label: (sight) => {
        const translationObject = labels[sight.label];
        return translationObject
          ? tObj(translationObject)
          : `translation-not-found[${sight.label}]`;
      },
    };
  }
  const { label } = useSightLabel();
  return (
    <div style={style.slider}>
      {sights?.map((sight, key) => (
        <Button
          style={style.labelButton}
          key={key}
          primaryColor={sight === currentSight ? 'primary-base' : 'secondary-xdark'}
          onClick={() => onSightSelected?.(sight)}
        >
          {label(sight)}
        </Button>
      ))}
    </div>
  );
}
