import { Styles } from '@monkvision/types';

export const styles: Styles = {
  checkbox: {
    width: 22,
    height: 22,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 0,
    padding: 0,
    outline: 'none',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 3,
    cursor: 'pointer',
  },
  checkboxDisabled: {
    opacity: 0.37,
    cursor: 'default',
  },
};
