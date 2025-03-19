import { Styles } from '@monkvision/types';

export const styles: Styles = {
  container: {
    height: '100vh',
    width: '100vw',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'relative',
    alignSelf: 'stretch',
    overflow: 'auto',
  },
  containerPortrait: {
    __media: { portrait: true },
    flexDirection: 'column',
  },
  previewContainer: {
    position: 'relative',
    height: '100vh',
    width: '100vw',
  },
};
