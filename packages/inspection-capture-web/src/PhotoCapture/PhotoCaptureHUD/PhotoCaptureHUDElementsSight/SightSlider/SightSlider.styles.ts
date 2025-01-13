import { Styles } from '@monkvision/types';
import { PHOTO_CAPTURE_HUD_BUTTONS_BAR_WIDTH } from '../../../../components/HUDButtons/HUDButtons.styles';

export const styles: Styles = {
  container: {
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
    zIndex: 9,
  },
  containerPortrait: {
    __media: { portrait: true },
    bottom: `${PHOTO_CAPTURE_HUD_BUTTONS_BAR_WIDTH * 1.5}px`,
    right: 0,
    paddingRight: '45%',
  },
  button: {
    margin: 10,
    zIndex: 9,
  },
};
