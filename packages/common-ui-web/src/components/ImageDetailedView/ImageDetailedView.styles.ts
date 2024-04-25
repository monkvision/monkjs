import { Styles } from '@monkvision/types';

export const SMALL_WIDTH_BREAKPOINT = 700;

export const styles: Styles = {
  mainContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
    backgroundPosition: 'center',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    display: 'flex',
    justifyContent: 'space-between',
  },
  mainContainerSmall: {
    __media: { maxWidth: SMALL_WIDTH_BREAKPOINT },
    flexDirection: 'column',
  },
  leftContainer: {
    zIndex: 9,
    padding: 8,
  },
  overlayContainer: {
    zIndex: 8,
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  rightContainer: {
    zIndex: 9,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    alignSelf: 'stretch',
    padding: '32px 40px',
  },
  rightContainerSmall: {
    __media: { maxWidth: SMALL_WIDTH_BREAKPOINT },
    flexDirection: 'row',
    padding: '14px 40px',
  },
};
