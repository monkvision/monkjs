import { Styles } from '@monkvision/types';

export const styles: Styles = {
  container: {
    position: 'absolute',
    top: '6%',
    left: 0,
    right: 0,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
  },
  banner: {
    maxWidth: '80%',
    padding: '10px 20px',
    borderRadius: 24,
    fontSize: 17,
    fontWeight: 600,
    textAlign: 'center',
    lineHeight: 1.3,
  },
  bannerPortrait: {
    __media: { portrait: true },
    fontSize: 15,
  },
};
