import { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';

export const ORIENTATION_MODE = {
  Portrait: 'portrait',
  Landscape: 'landscape',
};

const useOrientation = () => {
  const [orientation, setOrientation] = useState('');

  useEffect(() => {
    const handleOrientationChange = ({ window }) => {
      if (window.height > window.width) {
        setOrientation(ORIENTATION_MODE.Portrait);
      } else {
        setOrientation(ORIENTATION_MODE.Landscape);
      }
    };

    handleOrientationChange({ window: Dimensions.get('window') });
    Dimensions.addEventListener('change', handleOrientationChange);
    return () => {
      Dimensions.removeEventListener('change', handleOrientationChange);
    };
  }, []);

  return orientation;
};

export default useOrientation;
