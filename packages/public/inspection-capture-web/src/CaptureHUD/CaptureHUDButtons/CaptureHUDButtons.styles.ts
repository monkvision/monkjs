import { Styles } from '@monkvision/types';
import { getInteractiveVariants, InteractiveVariation } from '@monkvision/common';

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
    justifyContent: 'space-between',
    flexDirection: 'column',
    padding: '30px 40px',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  containersPortrait: {
    __media: { portrait: true },
    padding: 20,
    flexDirection: 'row-reverse',
  },
  button: {
    width: 60,
    height: 60,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    borderStyle: 'solid',
    borderWidth: 2,
    cursor: 'pointer',
    padding: 0,
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
