import { Styles } from '@monkvision/types';

export const styles: Styles = {
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'relative',
  },
  previewContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  },
  containerPortrait: {
    __media: { portrait: true },
    flexDirection: 'column',
  },
  messageContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
  },
  errorMessage: {
    fontSize: 16,
    fontFamily: 'sans-serif',
    textAlign: 'center',
    color: 'white',
    maxWidth: '60vw',
  },
  errorMessagePortrait: {
    __media: { portrait: true },
    maxWidth: 'none',
    padding: 20,
  },
  retryButton: {
    marginTop: 20,
  },
  takePictureButton: {
    marginRight: 20,
    zIndex: 2,
  },
  takePicturePortrait: {
    __media: { portrait: true },
    marginRight: 0,
    marginBottom: 20,
  },
};
