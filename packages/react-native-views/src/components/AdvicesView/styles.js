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
    height: '100%',
  },
  carouselDotsLayout: {
    flexDirection: 'row',
    width: '100%',
    height: 20,
    ...center,
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
      native: { width: 512 },
    }),
  },
  carousel: {
    width: 512,
    overflow: 'hidden',
    ...Platform.select({
      web: { height: 460 },
      native: { height: 270 },
    }),
  },
  iconLayout: {
    height: 24,
    ...Platform.select({
      web: { marginTop: 24 },
      native: { marginTop: 12 },
    }),
  },
  closeButton: {
    borderRadius: 999,
    width: 32,
    height: 32,
    backgroundColor: 'grey',
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
    ...center,
  },
  adviceImage: {
    ...Platform.select({
      web: {
        width: 512,
        height: 340,
      },
      native: {
        width: 270,
        height: 180,
      },
    }),
  },
  label: {
    textAlign: 'center',
    color: '#7C8080',
  },
  labelLayout: {
    marginTop: 10,
  },
});
