/* eslint-disable no-alert */
import React from 'react';
import { useWindowDimensions } from 'react-native';

const useBrowserViewConfig = () => {
  const { height, width } = useWindowDimensions();

  const isLandscape = width > height;
  const shouldRotate = Math.abs(width - height) > 150;

  React.useEffect(() => {
    if (!isLandscape && shouldRotate) {
      alert('For better experience please rotate to landscape');
    }
  }, [isLandscape, shouldRotate]);
  return isLandscape || !shouldRotate;
};

export default useBrowserViewConfig;
