import { Styles } from '@monkvision/types';

export const styles: Styles = {
  container: {
    position: 'absolute',
    display: 'flex',
    alignSelf: 'stretch',
    justifyContent: 'center',
    flexDirection: 'column',
    flex: '1',
  },
  top: {
    position: 'absolute',
    display: 'flex',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: '10px',
    zIndex: '1',
    top: '0',
    right: '0',
  },
};
