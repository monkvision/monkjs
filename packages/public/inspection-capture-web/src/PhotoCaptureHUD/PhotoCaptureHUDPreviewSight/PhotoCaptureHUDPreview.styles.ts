import { Styles } from '@monkvision/types';

export const styles: Styles = {
  container: {
    display: 'flex',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    flexDirection: 'column',
    backgroundColor: 'green',
    flex: '1',
  },
  containersPortrait: {
    __media: { portrait: true },
    padding: 20,
    flexDirection: 'row-reverse',
  },
  top: {
    display: 'flex',
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: '10px',
    zIndex: '9',
  },
  counter: {
    display: 'flex',
    color: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '6px 12px',
    borderRadius: '8px',
    backgroundColor: 'rgba(28, 28, 30, 0.64)',
    zIndex: '9',
  },
  slider: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingLeft: '45%',
    paddingBottom: '0%',
    overflowX: 'auto',
    overflowY: 'hidden',
    whiteSpace: 'nowrap',
    scrollbarWidth: 'none',
    maxWidth: '60vw',
    zIndex: '9',
  },
  labelButton: {
    margin: '10px',
    zIndex: '9',
  },
  sightOverlay: {
    zIndex: '9',
  },
};
