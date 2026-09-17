import { Styles } from '@monkvision/types';

export const styles: Styles = {
  overlay: {
    position: 'absolute',
    // The overlay must never intercept taps meant for the HUD buttons underneath it.
    pointerEvents: 'none',
  },
  scrim: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    pointerEvents: 'none',
  },
};
