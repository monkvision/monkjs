import { Styles } from '@monkvision/types';

export const styles: Styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    flexGrow: 1,
  },
  containerWide: {
    position: 'fixed',
    left: '50%',
    transform: 'translate(-50%, 0)',
    zIndex: 9,
    display: 'flex',
    width: '98%',
    justifyContent: 'center',
  },
  button: {
    fontSize: 14,
  },
};
