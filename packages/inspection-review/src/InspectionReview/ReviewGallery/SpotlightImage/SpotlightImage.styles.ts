import { Styles } from '@monkvision/types';

export const styles: Styles = {
  mainContainer: {
    width: '100%',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    display: 'flex',
    justifyContent: 'space-between',
    inset: 0,
    position: 'relative',
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
};
