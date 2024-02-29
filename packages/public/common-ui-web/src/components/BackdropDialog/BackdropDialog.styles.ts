import { Styles } from '@monkvision/types';

const DIALOG_BORDER_RADIUS = 15;

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
    borderRadius: DIALOG_BORDER_RADIUS,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    padding: 30,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
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
  },
  cancelButton: {
    borderRadius: `0 0 0 ${DIALOG_BORDER_RADIUS}px`,
  },
  confirmButton: {
    borderRadius: `0 0 ${DIALOG_BORDER_RADIUS}px 0`,
  },
};
