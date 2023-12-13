import { Styles } from '@monkvision/types';

export const styles: Styles = {
  container: {
    display: 'flex',
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'column',
    backgroundColor: 'green',
    flex: '1',
  },
  top: {
    display: 'flex',
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: '10px',
  },
  counter: {
    display: 'flex',
    color: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '6px 12px',
    borderRadius: '8px',
    backgroundColor: 'rgba(28, 28, 30, 0.64)',
  },
  slider: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingLeft: '50%',
    overflowX: 'auto',
    whiteSpace: 'nowrap',
    scrollbarWidth: 'none',
    maxWidth: '60vw',
  },
  labelButton: {
    margin: '10px',
  },
};
