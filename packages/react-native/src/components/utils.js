import isEmpty from 'lodash.isempty';
import { Dimensions, Platform } from 'react-native';

const flex = {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  ...Platform.select({
    native: { flex: 1 },
    default: { display: 'flex', flexGrow: 1, height: '100vh' },
  }),
};

function getContainedSizes(ratio) {
  if (isEmpty(ratio)) { return {}; }
  const windowHeight = Dimensions.get('window').height;
  const windowWidth = Dimensions.get('window').width;

  const [a, b] = ratio.split(':').sort((c, d) => (c + d));
  const longest = windowHeight <= windowWidth ? windowHeight : windowWidth;

  return {
    ...Platform.select({
      native: {
        height: longest,
        width: longest * (a / b),
      },
      default: {
        height: '100vh',
        width: `${100 * (a / b)}vh`,
      },
    }),
  };
}

export default {
  styles: {
    flex,
    getContainedSizes,
  },
};
