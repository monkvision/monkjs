import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

const DESKTOP_BREAKPOINT_PX = 950;

export default function useDesktopMode() {
  const { width } = useWindowDimensions();

  return useMemo(() => (width >= DESKTOP_BREAKPOINT_PX), [width]);
}
