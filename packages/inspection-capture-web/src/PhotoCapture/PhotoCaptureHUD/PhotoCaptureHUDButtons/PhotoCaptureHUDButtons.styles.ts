import { Styles } from '@monkvision/types';
import { getInteractiveVariants, InteractiveVariation } from '@monkvision/common';

const BUTTON_SIZE = 60;
const BUTTON_PADDING = 20;
const BUTTON_BORDER_WIDTH = 2;
export const PHOTO_CAPTURE_HUD_BUTTONS_BAR_WIDTH =
  BUTTON_SIZE + BUTTON_PADDING + BUTTON_BORDER_WIDTH;

export const captureButtonForegroundColors = getInteractiveVariants(
  '#f3f3f3',
  InteractiveVariation.DARKEN,
);
export const captureButtonBackgroundColors = getInteractiveVariants(
  '#1b1c1e',
  InteractiveVariation.LIGHTEN,
);

export const styles: Styles = {
  container: {
    display: 'flex',
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'column',
    padding: '30px 40px',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    position: 'absolute',
  },
  containersPortrait: {
    __media: { portrait: true },
    padding: BUTTON_PADDING,
    flexDirection: 'row-reverse',
    bottom: '0',
    left: '0',
    right: '0',
  },
  containersLandscape: {
    __media: { landscape: true },
    bottom: '0',
    top: '0',
    right: '0',
  },
  button: {
    position: 'relative',
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    borderStyle: 'solid',
    borderWidth: BUTTON_BORDER_WIDTH,
    cursor: 'pointer',
    padding: 0,
  },
  buttonBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 21,
    height: 21,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    fontSize: 14,
  },
  buttonDisabled: {
    cursor: 'default',
  },
  backgroundCover: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
};
