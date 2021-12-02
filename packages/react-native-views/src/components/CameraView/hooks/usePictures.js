import { useCallback, useState } from 'react';
import noop from 'lodash.noop';

import useSights from './useSights';

/**
 * Wraps taken pictures with Sights sights prop and metadata
 * @param camera
 * @param sights
 * @param onTakePicture
 * @param onSuccess
 * @param handleFakeActivity
 * @returns {{
 *   activeSight: Object,
 *   sightsCount: number,
 *   handleTakePicture: function,
 *   pictures: {}
 * }}
 */
function usePictures(camera, sights, onTakePicture, onSuccess, handleFakeActivity = noop) {
  const { activeSight, count: sightsCount, nextSightProps } = useSights(sights);
  const [pictures, setPictures] = useState({});

  const handleTakePicture = useCallback(async () => {
    if (!camera) { return; }

    handleFakeActivity();

    const options = { quality: 1, zoom: 0 };
    const sight = activeSight.toPlainObject();
    const picture = await camera.takePictureAsync(options);
    const payload = { name: sight.id, sight, source: picture };

    setPictures((prevState) => ({ ...prevState, [sight.id]: payload }));
    onTakePicture(payload);

    if (!nextSightProps.disabled) {
      nextSightProps.onPress();
    } else {
      onSuccess({ pictures, camera, sights });
    }
  }, [
    activeSight, camera, handleFakeActivity,
    nextSightProps, onSuccess, onTakePicture,
    pictures, sights,
  ]);

  return {
    activeSight,
    handleTakePicture,
    sightsCount,
    pictures,
  };
}

export default usePictures;
