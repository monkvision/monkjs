import { Styles } from '@monkvision/types';

export const styles: Styles = {
  backdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    transition: 'opacity 0.5s ease-out',
  },
  dialog: {
    borderRadius: 15,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '70%',
    overflow: 'hidden',
  },
  dialogIcon: {
    margin: 30,
  },
  message: {
    padding: '0 30px 30px 30px',
    fontSize: 18,
    wordBreak: 'break-word',
    textAlign: 'center',
  },
  messageNoIcon: {
    paddingTop: 30,
  },
  buttonsContainer: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  button: {
    border: 'none',
    flex: 1,
    alignSelf: 'stretch',
    padding: '15px 24px',
    borderRadius: 0,
  },
};
