import { useCallback, useState } from 'react';
import noop from 'lodash.noop';

import useSights from './useSights';

/**
 * Wraps taken pictures with Sights sights prop and metadata
 * @param camera
 * @param sights
 * @param onTakePicture
 * @param handleFakeActivity
 * @returns {{
 *   activeSight: Object,
 *   sightsCount: number,
 *   handleTakePicture: ((function(): Promise<void>)|*),
 *   pictures: {}
 * }}
 */
function usePictures(camera, sights, onTakePicture, handleFakeActivity = noop) {
  const { activeSight, count: sightsCount, nextSightProps } = useSights(sights);
  const [pictures, setPictures] = useState({});

  const handleTakePicture = useCallback(async () => {
    if (!camera) { return; }

    handleFakeActivity();

    const options = { quality: 1 };
    const picture = await camera.takePictureAsync(options);
    const payload = { sight: activeSight, source: picture };

    setPictures((prevState) => ({ ...prevState, [activeSight.id]: payload }));
    onTakePicture(payload);

    if (!nextSightProps.disabled) {
      nextSightProps.onPress();
    }
  }, [activeSight, camera, handleFakeActivity, nextSightProps, onTakePicture]);

  return {
    activeSight,
    handleTakePicture,
    sightsCount,
    pictures,
  };
}

export default usePictures;
