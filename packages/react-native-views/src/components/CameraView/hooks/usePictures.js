import { useCallback, useState } from 'react';
import noop from 'lodash.noop';

import useSights from './useSights';

function usePictures(camera, sights, onTakePicture, handleFakeActivity = noop) {
  const { activeSight, count: nbOfSights, nextSightProps } = useSights(sights);
  const [pictures, setPictures] = useState({});

  const handleTakePicture = useCallback(async () => {
    if (camera) {
      handleFakeActivity();

      const options = { quality: 1 };
      const picture = await camera.takePictureAsync(options);
      const payload = { sight: activeSight, source: picture };

      setPictures((prevState) => ({ ...prevState, [activeSight.id]: payload }));
      onTakePicture(payload);

      if (!nextSightProps.disabled) {
        nextSightProps.onPress();
      }
    }
  }, [activeSight, camera, handleFakeActivity, nextSightProps, onTakePicture]);

  return {
    activeSight,
    handleTakePicture,
    nbOfSights,
    pictures,
  };
}

export default usePictures;
