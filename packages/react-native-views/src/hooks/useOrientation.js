import * as ScreenOrientation from 'expo-screen-orientation';
import { useEffect, useState } from 'react';

export default () => {
  const [orientation, setOrientation] = useState();

  const handleRotateToLandscape = async () => {
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT);
  };

  const getOrientation = async () => {
    await ScreenOrientation.supportsOrientationLockAsync();
  };

  useEffect(() => {
    getOrientation()
      .then((e) => setOrientation(e.orientation))
      .catch(() => setOrientation(null));
  }, []);
  return [orientation, handleRotateToLandscape];
};
