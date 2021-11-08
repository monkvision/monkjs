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
  topView: {
    display: 'flex',
    alignItems: 'center',
    width: 125,
    height: 150,
    marginVertical: 8,
    zIndex: 1,
  },
  chip: {
    alignSelf: 'center',
    height: 34,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '400',
    textTransform: 'capitalize',
  },
  scrollContainer: {
    flex: 1,
    overflow: 'visible',
    padding: 8,
    marginBottom: 16,
  },
});
export default styles;
