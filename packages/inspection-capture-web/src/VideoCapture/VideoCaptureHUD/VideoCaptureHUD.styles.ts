import { Styles } from '@monkvision/types';

export const styles: Styles = {
  container: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  hudContainer: {
    position: 'absolute',
    inset: '0 0 0 0',
  },
  loadingOverlay: {
    position: 'absolute',
    inset: '0 0 0 0',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 10,
  },
};
