import { Styles } from '@monkvision/types';

export const styles: Styles = {
  container: {
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    inset: '0 0 0 0',
  },
  elementsContainer: {
    position: 'absolute',
    inset: '0 164px 0 0',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    zIndex: 9,
  },
  elementsContainerPortrait: {
    __media: { portrait: true },
    inset: '0 0 125px 0',
  },
  top: {
    display: 'flex',
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    margin: 10,
  },
  bottom: {
    display: 'flex',
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 9,
  },
  overlay: {
    zIndex: 9,
  },
};
