import { Platform, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column-reverse',
    width: 125,
    ...Platform.select({
      native: { height: '100%' },
      default: { height: '100vh' },
    }),
  },
  scrollContainer: {
    flex: 1,
    overflow: 'visible',
    padding: 8,
  },
});
export default styles;
