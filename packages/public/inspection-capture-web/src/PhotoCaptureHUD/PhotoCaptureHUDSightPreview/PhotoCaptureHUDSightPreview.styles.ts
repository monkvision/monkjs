import { Styles } from '@monkvision/types';

export const styles: Styles = {
  container: {
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    top: '0',
    right: '0',
    left: '0',
    bottom: '0',
  },
  top: {
    position: 'absolute',
    display: 'flex',
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: '10px',
    zIndex: '9',
    top: '0',
    right: '0',
    left: '0',
  },
  overlay: {
    zIndex: '9',
  },
};
