import { useEffect, useRef, useState } from 'react';
import { Sight } from '@monkvision/types';
import { PhotoCaptureHUDButtons } from './PhotoCaptureHUDButtons';
import { PhotoCaptureHUDPreviewAddDamage } from './PhotoCaptureHUDPreviewAddDamage';
import { PhotoCaptureHUDPreview } from './PhotoCaptureHUDPreviewSight';
import { usePhotoCaptureHUD } from './hook';

export interface PhotoCaptureHUDProps {
  sights?: Sight[];
}

export function PhotoCaptureHUD({ sights }: PhotoCaptureHUDProps) {
  const [currentSight, setCurrentSight] = useState(sights?.[0]);
  const [currentSightSliderIndex, setCurrentSightSliderIndex] = useState(0);
  const [isOnAddDamage, setIsOnAddDamage] = useState<boolean>(false);
  const [sightsTaken, setSightsTaken] = useState<Sight[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  const handleOnSightSelected = (sight: Sight): void => {
    setCurrentSight(sight);
  };

  const handleOnAddDamage = (state: boolean): void => {
    setIsOnAddDamage(state);
  };

  const onScrollToSelected = (index: number, smooth: boolean): void => {
    if (ref.current && ref.current.children.length > index) {
      ref.current.children[index].scrollIntoView({
        behavior: smooth ? 'smooth' : ('instant' as ScrollBehavior),
        inline: 'center',
      });
      setCurrentSightSliderIndex(index);
    }
  };

  useEffect(() => {
    onScrollToSelected(currentSightSliderIndex, false);
  }, [isOnAddDamage]);

  const style = usePhotoCaptureHUD();
  return (
    <div style={style.container}>
      {!isOnAddDamage ? (
        <PhotoCaptureHUDPreview
          sights={sights}
          currentSight={currentSight}
          onSightSelected={handleOnSightSelected}
          sightsTaken={sightsTaken}
          onAddDamage={handleOnAddDamage}
          onScrollToSelected={onScrollToSelected}
          ref={ref}
        />
      ) : (
        <PhotoCaptureHUDPreviewAddDamage onAddDamage={handleOnAddDamage} />
      )}
      <PhotoCaptureHUDButtons
        onTakePicture={() => {
          if (currentSight && !sightsTaken.some((sightTaken) => sightTaken === currentSight))
            setSightsTaken([...sightsTaken, currentSight]);
        }}
      />
    </div>
  );
}
