import { Platform, StyleSheet } from 'react-native';

export const center = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};
export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    position: 'relative',
  },
  carouselDotsLayout: {
    ...center,
    flexDirection: 'row',
    width: '100%',
    height: 20,
    ...Platform.select({
      ios: {
        width: 512,
        position: 'absolute',
        bottom: 8,
        zIndex: 1,
      },
      android: {
        width: 512,
        position: 'absolute',
        bottom: 8,
        zIndex: 1,
      },
    }),
  },
  carouselDot: {
    width: 10,
    height: 10,
    margin: 10,
    borderRadius: 999,
  },
  carouselContent: {
    display: 'flex',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        width: 512,
      },
      android: {
        width: 512,
      },
    }),
  },
  iconLayout: {
    marginTop: 24,
    marginBottom: 10,
    height: 24,
  },
  closeButton: {
    borderRadius: 999,
    width: 32,
    height: 32,
    ...center,
    backgroundColor: 'grey',
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
  adviceImage: {
    ...Platform.select({
      web: {
        width: 512,
        height: 340,
      },
      ios: {
        width: 270,
        height: 180,
      },
      android: {
        width: 270,
        height: 180,
      },
    }),
  },
});
