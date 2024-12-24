import { Styles } from '@monkvision/types';

export const ICON_SIZE = 40;

export const styles: Styles = {
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100%',
    width: '100%',
  },
  wireframeContainer: {
    height: '85%',
  },
  leftArrowContainer: {
    display: 'flex',
  },
  spacer: { width: `${ICON_SIZE}px` },
};
