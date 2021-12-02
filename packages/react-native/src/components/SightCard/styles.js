import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  sightCard: {
    width: 100,
    height: 100,
    marginHorizontal: 4,
    marginVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    borderRadius: 4,
    padding: 15,
    borderColor: '#d3d3d3',
    borderStyle: 'solid',
    borderWidth: 1,
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
  text: {
    marginTop: 4,
    color: '#d3d3d3',
    fontSize: 7,
    textTransform: 'capitalize',
  },
});
export default styles;
