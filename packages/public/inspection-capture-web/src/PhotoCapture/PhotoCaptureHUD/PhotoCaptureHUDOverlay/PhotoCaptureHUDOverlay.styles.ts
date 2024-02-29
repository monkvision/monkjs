import { Styles } from '@monkvision/types';

export const styles: Styles = {
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  errorMessage: {
    fontSize: 16,
    fontFamily: 'sans-serif',
    textAlign: 'center',
    color: 'white',
    maxWidth: '60vw',
    paddingBottom: 20,
  },
  errorMessageMobile: {
    __media: {
      maxWidth: 750,
    },
    maxWidth: '90vw',
  },
  errorMessageTablet: {
    __media: {
      minWidth: 750,
      maxWidth: 1100,
    },
    maxWidth: '75vw',
  },
};
