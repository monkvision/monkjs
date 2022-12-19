import { useMemo } from 'react';
import { CarOrientation } from './useCarOrientation';

export const WIREFRAME_TOP_MARGIN = 10;

export default function useWireframeOffset({ orientation, containerWidth }) {
  const wireframeWidth = useMemo(() => ((orientation === CarOrientation.FRONT_LEFT
    || orientation === CarOrientation.FRONT_RIGHT) ? 320 : 321), [orientation]);
  return {
    offsetTop: useMemo(() => WIREFRAME_TOP_MARGIN, []),
    offsetLeft: useMemo(() => ((containerWidth - wireframeWidth) / 2), [wireframeWidth]),
  };
}
