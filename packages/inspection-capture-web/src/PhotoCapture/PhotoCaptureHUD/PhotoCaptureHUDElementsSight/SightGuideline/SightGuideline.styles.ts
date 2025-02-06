import { Styles } from '@monkvision/types';
import { PHOTO_CAPTURE_HUD_BUTTONS_BAR_WIDTH } from '../../../../components/HUDButtons/HUDButtons.styles';

export const styles: Styles = {
  container: {
    display: 'flex',
    justifyContent: 'start',
  },
  containerWide: {
    display: 'flex',
    position: 'fixed',
    left: '50%',
    transform: 'translate(-50%, 0)',
    width: `calc(98% - (${PHOTO_CAPTURE_HUD_BUTTONS_BAR_WIDTH * 4}px))`,
    justifyContent: 'center',
  },
  guideline: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: '12px',
    justifyContent: 'start',
    padding: '10px',
    gap: '8px',
    letterSpacing: '0.15px',
    fontSize: '14',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0px 10px 0px',
  },
  checkbox: {
    display: 'flex',
    cursor: 'pointer',
    gap: '5px',
  },
  button: {
    all: 'unset',
    cursor: 'pointer',
  },
};
