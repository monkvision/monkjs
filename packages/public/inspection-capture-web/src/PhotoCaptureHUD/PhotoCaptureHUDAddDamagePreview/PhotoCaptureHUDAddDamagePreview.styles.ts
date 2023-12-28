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
    position: 'relative',
    display: 'flex',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: '10px',
    zIndex: '9',
    top: '0',
    right: '0',
  },
  addDamageButton: {
    backgroundColor: 'rgba(52, 53, 63, 0.64)',
  },
};
