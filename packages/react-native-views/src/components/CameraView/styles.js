import { utils } from '@monkvision/react-native';
import { Platform, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  root: {
    ...Platform.select({
      native: { flex: 1 },
      default: { display: 'flex', flex: 1, height: '100vh' },
    }),
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    overflow: 'hidden',
    backgroundColor: '#000',
    justifyContent: 'space-between',
    ...Platform.select({
      native: { flex: 1 },
      default: { display: 'flex', flex: 1 },
    }),
  },
  fab: {
    backgroundColor: '#333',
  },
  fabImportant: {
    backgroundColor: 'white',
  },
  largeFab: {
    transform: [{ scale: 1.75 }],
  },
  overLaps: {
    ...utils.styles.flex,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 10,
    width: '100%',
    height: '100%',
  },
  mask: {
    width: '100%',
    height: '100%',
    ...Platform.select({
      web: { marginLeft: 30 },
      native: { marginLeft: 10 },
    }),
  },
  snackBar: {
    display: 'flex',
    backgroundColor: 'white',
    alignSelf: 'center',
    ...Platform.select({
      native: { width: 300 },
    }),
  },
  advices: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
    overflow: 'hidden',
    maxWidth: 512,
    ...Platform.select({
      web: { maxHeight: 512 },
      native: { maxHeight: 300 },
    }),
    alignSelf: 'center',
  },
});
export default styles;
