import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
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
