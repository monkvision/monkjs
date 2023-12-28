import { Styles } from '@monkvision/types';

export const styles: Styles = {
  container: {
    position: 'relative',
    display: 'flex',
    alignSelf: 'stretch',
    justifyContent: 'center',
    flexDirection: 'column',
    backgroundColor: 'green',
    flex: '1',
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
