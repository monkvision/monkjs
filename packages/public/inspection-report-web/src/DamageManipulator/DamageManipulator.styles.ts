import { Styles } from '@monkvision/types';

export const styles: Styles = {
  container: {
    alignSelf: 'end',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    borderRadius: '20px 20px 0px 0px',
    width: '375px',
  },
  containerPortrait: {
    __media: { portrait: true },
    width: '100%',
  },
  content: {
    width: '375px',
  },
};
