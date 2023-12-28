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
    alignSelf: 'stretch',
    // flex: '1',
  },
  containerPortrait: {
    __media: { portrait: true },
    flexDirection: 'column',
  },
  previewContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    zIndex: 9,
  },
};
