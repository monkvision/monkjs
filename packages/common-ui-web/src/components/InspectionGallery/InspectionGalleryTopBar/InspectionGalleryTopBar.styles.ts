import { Styles } from '@monkvision/types';

const SMALL_SCREEN__BREAKPOINT_PX = 650;

export const styles: Styles = {
  bar: {
    zIndex: 9,
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100dvw',
    padding: '16px 24px',
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  barSmallScreen: {
    __media: { maxWidth: SMALL_SCREEN__BREAKPOINT_PX },
    padding: '10px',
  },
  mainContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  leftContainer: {
    alignSelf: 'stretch',
    display: 'flex',
    alignItems: 'center',
  },
  pillContainer: {
    display: 'flex',
  },
  pillContainerSmallScreen: {
    __media: { maxWidth: SMALL_SCREEN__BREAKPOINT_PX },
    display: 'none',
  },
  backButton: {
    marginRight: 8,
  },
  backButtonSmallScreen: {
    __media: { maxWidth: SMALL_SCREEN__BREAKPOINT_PX },
    padding: '10px 16px',
  },
  title: {
    fontSize: 22,
    marginRight: 24,
  },
};
