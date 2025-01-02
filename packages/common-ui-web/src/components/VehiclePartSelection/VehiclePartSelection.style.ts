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
    height: '90%',
    width: '100%',
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
  },
  leftArrowContainer: {
    display: 'flex',
  },
  leftArrow: {
    zIndex: 1,
  },
  spacer: { width: `${ICON_SIZE}px` },
  rightArrow: {
    position: 'absolute',
    right: 0,
  },
};
