import { Styles } from '@monkvision/types';
import { PHOTOCAPTUREHUB_BUTTONS_BAR_WIDTH } from '../../PhotoCaptureHUDButtons/PhotoCaptureHUDButtons.styles';

export const styles: Styles = {
  container: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingLeft: '45%',
    paddingBottom: '0%',
    overflowX: 'auto',
    overflowY: 'hidden',
    whiteSpace: 'nowrap',
    scrollbarWidth: 'none',
    maxWidth: '60vw',
    zIndex: '9',
    bottom: '0',
    right: `${PHOTOCAPTUREHUB_BUTTONS_BAR_WIDTH * 2}px`,
    left: '0',
  },
  containerPortrait: {
    __media: { portrait: true },
    bottom: `${PHOTOCAPTUREHUB_BUTTONS_BAR_WIDTH * 1.5}px`,
    right: '0',
    paddingRight: '45%',
  },
  button: {
    margin: '10px',
    zIndex: '9',
  },
};
