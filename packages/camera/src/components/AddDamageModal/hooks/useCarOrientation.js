import { useCallback, useState } from 'react';
import { CarOrientation, sightCarOrientationMap } from './sightCarOrientationMap';

export default function useCarOrientation(currentSight) {
  const [orientation, setOrientation] = useState(
    sightCarOrientationMap[currentSight] ?? CarOrientation.FRONT_LEFT,
  );

  const rotateLeft = useCallback(() => {
    let newOrientation = orientation - 1;
    if (newOrientation < CarOrientation.FRONT_LEFT) {
      newOrientation = CarOrientation.FRONT_RIGHT;
    }
    setOrientation(newOrientation);
  }, [orientation, setOrientation]);

  const rotateRight = useCallback(() => {
    let newOrientation = orientation + 1;
    if (newOrientation > CarOrientation.FRONT_RIGHT) {
      newOrientation = CarOrientation.FRONT_LEFT;
    }
    setOrientation(newOrientation);
  }, [orientation, setOrientation]);

  return {
    orientation,
    rotateLeft,
    rotateRight,
  };
}
