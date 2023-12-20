import { Styles } from '@monkvision/types';

export const styles: Styles = {
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignSelf: 'stretch',
    flex: '1',
  },
  containerPortrait: {
    __media: { portrait: true },
    padding: 20,
    flexDirection: 'row-reverse',
  },
};
