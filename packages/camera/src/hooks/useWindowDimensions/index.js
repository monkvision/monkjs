import { Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function useWindowDimensions() {
  return {
    height: windowHeight,
    width: windowWidth,
  };
}
