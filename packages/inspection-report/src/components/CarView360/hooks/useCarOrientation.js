import { useCallback, useMemo, useState } from 'react';

import { CarOrientation } from '../../../resources';

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
    setOrientation,
    rotateLeft,
    rotateRight,
  };
}
