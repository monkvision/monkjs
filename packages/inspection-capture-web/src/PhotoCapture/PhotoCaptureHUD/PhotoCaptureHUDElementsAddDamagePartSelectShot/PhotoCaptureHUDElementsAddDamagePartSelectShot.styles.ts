import { Styles } from '@monkvision/types';

export const styles: Styles = {
  popup: {
    display: 'flex',
    flexDirection: 'column',
    justifyItems: 'center',
    padding: '3svw',
    gap: 10,
    borderRadius: '3svmin',
    alignItems: 'center',
    boxSizing: 'border-box',
    overflow: 'scroll',
    maxHeight: '100%',
  },
  vehicleSelect: {
    alignSelf: 'stretch',
    justifySelf: 'stretch',
    position: 'fixed',
    height: '90%',
    width: '75%',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: '10',
  },
  labelsContainer: {
    position: 'fixed',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    top: '10px',
    bottom: '10px',
  },
  partsLabel: {
    display: 'flex',
    justifyContent: 'center',
  },
  tutoLabel: {
    display: 'flex',
    justifyContent: 'center',
  },
  closeBtn: {
    position: 'fixed',
    top: '5px',
    left: '5px',
  },
  validateBtn: {
    position: 'fixed',
    top: '50%',
    right: '10px',
    transform: 'translate(-50%, -50%)',
  },
};
