import { any, arrayOf, func, instanceOf, objectOf, oneOfType, shape, string } from 'prop-types';

import { Sight } from '@monkvision/corejs';

/* ALIASES */

const callback = func;
const onError = callback;
const onSuccess = callback;

/* PROPS */

const sight = instanceOf(Sight);
const sights = arrayOf(sight);

const source = shape({ uri: string.isRequired });

const camera = objectOf(any);
const cameraPicture = shape({ sight, source });
const cameraPictures = oneOfType([arrayOf(cameraPicture), objectOf(cameraPicture)]);

const theme = shape({
  colors: shape({ accent: string, primary: string }),
});

export default {
  callback,
  camera,
  cameraPicture,
  cameraPictures,
  onError,
  onSuccess,
  sight,
  sights,
  source,
  theme,
};
