import { useMemo } from 'react';
import { CarOrientation } from './useCarOrientation';
import CarParts from './carParts';
import * as Assets from '../assets';

export default function usePartSelectorComponents({ orientation }) {
  const Wireframe = useMemo(() => {
    switch (orientation) {
      case CarOrientation.FRONT_LEFT:
        return Assets.FrontLeftWireframe;
      case CarOrientation.REAR_LEFT:
        return Assets.RearLeftWireframe;
      case CarOrientation.REAR_RIGHT:
        return Assets.RearRightWireframe;
      case CarOrientation.FRONT_RIGHT:
        return Assets.FrontRightWireframe;
      default:
        return null;
    }
  }, [orientation]);

  const parts = useMemo(
    () => CarParts
      .filter((part) => part.components[orientation] !== null)
      .map((part) => ({
        key: part.key,
        Component: part.components[orientation],
      })),
    [orientation],
  );

  return {
    Wireframe,
    parts,
  };
}
