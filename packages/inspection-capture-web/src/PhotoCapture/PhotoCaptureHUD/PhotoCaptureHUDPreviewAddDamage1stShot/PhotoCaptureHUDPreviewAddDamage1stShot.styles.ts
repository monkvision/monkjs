import { Styles } from '@monkvision/types';
import { PHOTOCAPTUREHUB_BUTTONS_BAR_WIDTH } from '../PhotoCaptureHUDButtons/PhotoCaptureHUDButtons.styles';

export const styles: Styles = {
  container: {
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    top: '0',
    right: '0',
    left: '0',
    bottom: '0',
  },
  top: {
    position: 'absolute',
    display: 'flex',
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: '10px',
    zIndex: '9',
    top: '0',
    right: '0',
    left: '0',
  },
  topLandscape: {
    __media: { landscape: true },
    right: `${PHOTOCAPTUREHUB_BUTTONS_BAR_WIDTH * 2}px`,
  },
  infoBtn: {
    position: 'absolute',
    margin: '20px',
    bottom: '0',
  },
  infoBtnPortrait: {
    __media: { portrait: true },
    bottom: `${PHOTOCAPTUREHUB_BUTTONS_BAR_WIDTH * 1.5}px`,
  },
  svg: {
    width: '15%',
  },
};
