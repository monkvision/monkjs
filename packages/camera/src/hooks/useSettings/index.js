import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { Camera } from 'expo-camera';
import getOS from '../../utils/getOS';

const initialState = {
  ratio: '4:3',
  zoom: 0,
  type: Camera.Constants.Type.back,
};

export default function useSettings({ camera }) {
  const [settings, setSettings] = useState(initialState);

  const getSettings = useCallback(async (prevSettings) => {
    const newSettings = { ...prevSettings };

    if (camera && Platform.OS !== 'web') {
      if (Platform.OS === 'android') {
        const ratios = await camera.getSupportedRatiosAsync();

        newSettings.ratio = ratios[0].reduce((prev, current) => {
          const ideal = 4 / 3;
          const getNumber = (ratio) => (ratio.split(':').reduce((a, b) => (a / b)));

          return Math.abs(getNumber(prev) - ideal) < Math.abs(getNumber(current) - ideal)
            ? prev : current;
        });
      }

      if (getOS() !== 'ios') {
        const pictureSizes = await camera.getAvailablePictureSizesAsync(newSettings.ratio);

        newSettings.pictureSize = pictureSizes.reduce((prev, current) => {
          const [prevWidth] = prev.split('x');
          const [currentWidth] = current.split('x');

          return parseInt(prevWidth, 10) > parseInt(currentWidth, 10) ? prev : current;
        });
      }
    }

    return newSettings;
  }, [camera]);

  useEffect(() => {
    (async () => {
      const newSettings = await getSettings(initialState);
      setSettings(newSettings);
    })();
  }, [getSettings]);

  return settings;
}
