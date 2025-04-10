import { Styles } from '@monkvision/types';
import { PHOTO_CAPTURE_HUD_BUTTONS_BAR_WIDTH } from '../../../components/HUDButtons/HUDButtons.styles';

export const styles: Styles = {
  backdropContainer: {
    position: 'fixed',
    inset: 0,
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
    top: 0,
    bottom: '40px',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '10px',
  },
  elementsContainerPortrait: {
    __media: { portrait: true },
    width: 'auto',
    right: '10px',
    left: '10px',
    bottom: `${PHOTO_CAPTURE_HUD_BUTTONS_BAR_WIDTH * 1.8}px`,
  },
  topContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
    alignItems: 'center',
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
  arrows: {
    display: 'flex',
    justifyContent: 'center',
  },
  arrowGuideline: {
    height: '40px',
  },
  arrowSightTutorial: {
    position: 'fixed',
    top: '30px',
    left: '80px',
    width: '40px',
  },
  sightTutorialBtn: {
    position: 'fixed',
    left: '10px',
    padding: '8px',
  },
};
