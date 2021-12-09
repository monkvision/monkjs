import { Platform, StyleSheet } from 'react-native';

export const center = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};
export const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
    height: '100%',
    width: '100%',
    padding: 16,
  },
  carouselDotsLayout: {
    marginTop: 8,
    flexDirection: 'row',
    width: '100%',
    height: 20,
    ...center,
    alignItems: 'center',
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
      web: { width: 512 },
    }),
  },
  carousel: {
    ...Platform.select({
      native: { width: 512, maxHeight: 270 },
      web: { width: 512, overflowX: 'scroll', maxHeight: 460 },
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
    width: 246,
    height: 141,
  },
  label: {
    textAlign: 'center',
    color: '#ffffff',
  },
  labelLayout: {
    marginTop: 10,
  },
});
