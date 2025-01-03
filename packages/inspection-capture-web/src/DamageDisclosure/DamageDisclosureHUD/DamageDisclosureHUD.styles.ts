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
  },
  containerPortrait: {
    __media: { portrait: true },
    flexDirection: 'column',
  },
  previewContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
};
