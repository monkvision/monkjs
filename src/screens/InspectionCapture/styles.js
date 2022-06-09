import { Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  root: {
    position: 'relative',
  },
  settings: {
    position: 'absolute',
    top: 10,
    right: 125,
    zIndex: 10,
    borderRadius: 8,
    width: 200,
    height: 'auto',
    padding: 4,
  },
  settingItem: {
    borderRadius: 4,
  },
  pressOutside: {
    zIndex: 1,
    opacity: 0.8,
    position: 'absolute',
    top: 0,
    left: 0,
    width,
    height,
  },
  blur: {
    width, height,
  },
});
export default styles;
