import { useCallback, useMemo, useState } from 'react';

export const CarOrientation = {
  FRONT_LEFT: 0,
  REAR_LEFT: 1,
  REAR_RIGHT: 2,
  FRONT_RIGHT: 3,
};

export default function useCarOrientation(initialOrientation) {
  const initialState = useMemo(
    () => (initialOrientation === undefined ? CarOrientation.FRONT_LEFT : initialOrientation),
    [],
  );
  const [orientation, setOrientation] = useState(initialState);

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
