import { Styles } from '@monkvision/types';

export const styles: Styles = {
  container: {
    position: 'absolute',
    inset: '0 0 0 0',
    overflow: 'hidden',
    // The overlay is guidance, never a control : every pointer event must reach the HUD layered above it, which owns
    // the record button and the walkaround indicator. The debug hotspot below opts back in explicitly.
    pointerEvents: 'none',
  },
  debugHotspot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 56,
    height: 56,
    padding: 0,
    border: 'none',
    background: 'transparent',
    // No visible affordance on purpose: this is a hidden developer gesture, not a UI control.
    opacity: 0,
    cursor: 'default',
    pointerEvents: 'auto',
  },
};
