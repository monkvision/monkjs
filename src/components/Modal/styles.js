import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 10,
    width: '100%',
    height: '100%',
  },
  container: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    flexWrap: 'wrap',
  },
  playground: {
    alignSelf: 'center',
    zIndex: 10,
    borderRadius: 8,
    width: '100%',
    height: 'auto',
    padding: 4,
  },
  item: {
    borderRadius: 4,
  },
  pressOutside: {
    zIndex: 1,
    opacity: 0.8,
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  },
  blur: {
    width,
    height,
  },
});
