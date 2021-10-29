import { arrayOf, func, instanceOf, objectOf, oneOfType, shape, string } from 'prop-types';

import { Sight } from '@monkvision/corejs';

/* ALIASES */

export const callback = func;
export const onError = callback;
export const onSuccess = callback;

/* PROPS */

export const sight = instanceOf(Sight);
export const sights = arrayOf(sight);

export const source = shape({ uri: string.isRequired });

export const cameraPicture = shape({ sight, source });
export const cameraPictures = oneOfType([arrayOf(cameraPicture), objectOf(cameraPicture)]);

export const theme = shape({
  colors: shape({ accent: string, primary: string }),
});
