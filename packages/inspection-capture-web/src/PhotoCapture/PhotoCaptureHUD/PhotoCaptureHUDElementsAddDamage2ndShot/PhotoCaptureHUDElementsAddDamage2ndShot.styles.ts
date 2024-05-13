import { Styles } from '@monkvision/types';
import { PHOTO_CAPTURE_HUD_BUTTONS_BAR_WIDTH } from '../PhotoCaptureHUDButtons/PhotoCaptureHUDButtons.styles';

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
    right: `${PHOTO_CAPTURE_HUD_BUTTONS_BAR_WIDTH * 2}px`,
  },
  frameContainer: {
    position: 'absolute',
    width: '100%',
  },
  frame: {
    position: 'absolute',
    top: '25%',
    left: '32%',
    width: '36%',
    height: '50%',
    border: '2px solid #FFC000',
    borderRadius: '10px',
    boxShadow: '0px 0px 0px 100pc rgba(0, 0, 0, 0.5)',
  },
  framePortrait: {
    __media: { portrait: true },
    top: '32%',
    left: '25%',
    width: '50%',
    height: '36%',
  },
  label: {
    position: 'absolute',
    top: '0',
    color: 'white',
    margin: '20px',
    padding: '10px 24px',
  },
  labelPortrait: {
    __media: { portrait: true },
    top: '10%',
  },
  infoCloseup: {
    position: 'absolute',
    bottom: '0',
    color: 'white',
    margin: '20px',
    padding: '10px 24px',
    textAlign: 'center',
  },
  infoCloseupPortrait: {
    __media: { portrait: true },
    bottom: `${PHOTO_CAPTURE_HUD_BUTTONS_BAR_WIDTH * 1.5}px`,
  },
};
