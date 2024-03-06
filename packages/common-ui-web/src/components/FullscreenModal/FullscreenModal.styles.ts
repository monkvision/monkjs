import { Styles } from '@monkvision/types';

export const styles: Styles = {
  container: {
    width: '100%',
    height: '100%',
    top: '0',
    left: '0',
    position: 'fixed',
    zIndex: '999',
    backgroundColor: 'black',
  },
  title: {
    position: 'absolute',
    top: '8px',
    left: '50%',
    transform: 'translate(-50%)',
    padding: '8px',
    margin: '8px',
    fontWeight: '500',
    fontSize: '20px',
    color: 'white',
  },
  closeButton: {
    cursor: 'pointer',
    position: 'absolute',
    padding: '8px',
    top: '8px',
    right: '8px',
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
};
