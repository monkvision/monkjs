import { Styles } from '@monkvision/types';

export const styles: Styles = {
  container: {
    height: '100%',
    width: '100%',
  },
  orientationErrorContainer: {
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    boxSizing: 'border-box',
    padding: '50px 10%',
  },
  orientationErrorTitleContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  orientationErrorTitle: {
    fontSize: 18,
    marginLeft: 16,
  },
  orientationErrorDescription: {
    fontSize: 16,
    paddingTop: 16,
    opacity: 0.8,
    textAlign: 'center',
  },
};
