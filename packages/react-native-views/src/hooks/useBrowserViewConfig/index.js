/* eslint-disable no-alert */
import React from 'react';
import { useWindowDimensions } from 'react-native';

const useBrowserViewConfig = () => {
  const { height, width } = useWindowDimensions();

  const isPortrait = width < height;
  const shouldRotate = Math.abs(width - height) > 150;

  React.useEffect(() => {
    if (isPortrait || shouldRotate) {
      alert('For better experience please rotate to landscape');
    }
  }, [isPortrait, shouldRotate]);
  return isPortrait || shouldRotate;
};

export default useBrowserViewConfig;
