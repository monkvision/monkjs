import { Styles } from '@monkvision/types';
import { PHOTO_CAPTURE_HUD_BUTTONS_BAR_WIDTH } from '../PhotoCaptureHUDButtons/PhotoCaptureHUDButtons.styles';

export const styles: Styles = {
  backdropContainer: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    transition: 'opacity 0.5s ease-out',
    backgroundColor: `rgba(0, 0, 0, 0.5)`,
  },
  elementsContainer: {
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    width: `calc(98% - (${PHOTO_CAPTURE_HUD_BUTTONS_BAR_WIDTH * 4}px))`,
    top: '10px',
    bottom: '40px',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
  },
  buttonsContainer: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    gap: '3px',
  },
  closeButtonTwin: {
    padding: '22px',
  },
  closeButton: {
    width: '44px',
    height: '44px',
  },
  text: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: '20px',
    paddingBottom: '5px',
  },
  arrowGuideline: {
    height: '40px',
  },
  arrowSightTutorial: {
    position: 'fixed',
    bottom: '60px',
    left: `calc((${PHOTO_CAPTURE_HUD_BUTTONS_BAR_WIDTH * 2}px))`,
    width: '40px',
  },
};
