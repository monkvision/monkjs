import { Styles } from '@monkvision/types';

export const styles: Styles = {
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    alignSelf: 'stretch',
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 50px',
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    fontSize: 22,
  },
  sliderContainer: {
    flex: 1,
    alignSelf: 'stretch',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slider: {
    alignSelf: 'stretch',
    maxWidth: '100%',
    overflowY: 'scroll',
    scrollbarWidth: 'none',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '45%',
    paddingRight: '45%',
  },
};
