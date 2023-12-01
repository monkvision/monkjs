import { Styles } from '@monkvision/types';

export const styles: Styles = {
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
    position: 'relative',
  },
  cameraPreview: {
    width: '100%',
    height: '100%',
  },
  cameraCanvas: {
    display: 'none',
  },
  hudContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    zIndex: 1,
  },
};
