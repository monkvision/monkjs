import { Styles } from '@monkvision/types';

export const styles: Styles = {
  container: {
    position: 'fixed',
    display: 'flex',
    flexDirection: 'column',
    justifyItems: 'center',
    alignItems: 'center',
    inset: 0,
  },
  vehicleSelect: {
    alignSelf: 'stretch',
    justifySelf: 'stretch',
    position: 'fixed',
    height: '85%',
    width: '75%',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 9,
  },
  labelsContainer: {
    position: 'fixed',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    top: '10px',
    bottom: '10px',
    width: '90%',
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
    zIndex: 10,
  },
};
