import { Dimensions, Platform, StyleSheet } from 'react-native';

const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    alignItems: 'center',
    width: 125,
    ...Platform.select({
      native: { height: windowHeight },
      default: { height: '100vh' },
    }),
  },
  topView: {
    display: 'flex',
    alignItems: 'center',
    width: 125,
    position: 'absolute',
    marginVertical: 8,
  },
  chip: {
    alignSelf: 'center',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '400',
    textTransform: 'capitalize',
  },
  scrollContainer: {
    marginTop: 166,
    paddingBottom: 16,
    overflow: 'visible',
    paddingHorizontal: 8,
  },
  surface: {
    width: 100,
    height: 100,
    margin: 4,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    borderRadius: 8,
    padding: 15,
    borderStyle: 'solid',
    borderWidth: 2,
  },
  sightMask: {
    width: 80,
    height: 60,
  },
  picture: {
    width: 100,
    height: 75,
    borderRadius: 8,
    marginVertical: 4,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
  },
});
export default styles;
