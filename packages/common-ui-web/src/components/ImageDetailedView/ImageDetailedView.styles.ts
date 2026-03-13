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
    padding: '20px 10px',
    width: '12%',
  },
  rightContainerSmall: {
    __media: { maxWidth: SMALL_WIDTH_BREAKPOINT },
    flexDirection: 'row',
    padding: '14px 40px',
    justifyContent: 'space-between',
    width: 'auto',
  },
  thumbnailList: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    height: '100%',
    justifyContent: 'center',
  },
  thumbnailListSmall: {
    __media: { maxWidth: SMALL_WIDTH_BREAKPOINT },
    flexDirection: 'row',
    width: '100%',
  },
  thumbnailWrapper: {
    position: 'relative',
    width: '100%',
    height: 60,
  },
  thumbnail: {
    width: '100%',
    height: 60,
    objectFit: 'cover',
    borderRadius: 8,
    cursor: 'pointer',
    boxSizing: 'border-box',
    opacity: 0.9,
    border: '2px solid',
  },
  selectedBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    lineHeight: 1,
  },
};
