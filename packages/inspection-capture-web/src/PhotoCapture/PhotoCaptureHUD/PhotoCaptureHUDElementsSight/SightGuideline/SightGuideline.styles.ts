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
  button: {
    textAlign: 'start',
    borderRadius: '12px',
    fontSize: 14,
    flexDirection: 'row-reverse',
    paddingRight: 0,
    alignItems: 'start',
    gap: 10,
  },
};
