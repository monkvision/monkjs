import { Styles } from '@monkvision/types';

export const styles: Styles = {
  container: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingLeft: '45%',
    paddingRight: '45%',
    paddingBottom: '0%',
    overflowX: 'auto',
    overflowY: 'hidden',
    whiteSpace: 'nowrap',
    scrollbarWidth: 'none',
    maxWidth: '60vw',
    zIndex: '9',
    bottom: '0',
    right: '0',
    left: '0',
  },
  button: {
    margin: '10px',
    zIndex: '9',
  },
};
