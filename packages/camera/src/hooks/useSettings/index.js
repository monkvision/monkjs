import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { Camera } from 'expo-camera';
import Constants from '../../const';

export default function useSettings(initialSettings, camera) {
  const [settings, setSettings] = useState(initialSettings);

  useEffect(() => {
    (async () => {
      const newSettings = {};

      if (Platform.OS === 'web') {
        // eslint-disable-next-line no-console
        if (!Constants.PRODUCTION) { console.log(`Awaiting for available camera types...`); }

        const types = await Camera.getAvailableCameraTypesAsync();
        newSettings.type = types.find((e) => e === 'back') ? 'back' : types[0];

        // eslint-disable-next-line no-console
        if (!Constants.PRODUCTION) { console.log(`Available camera types are:`, types); }
      }

      setSettings((oldSettings) => ({ ...oldSettings, ...newSettings }));
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const newSettings = {};

      if (Platform.OS === 'android') {
        // eslint-disable-next-line no-console
        if (!Constants.PRODUCTION) { console.log(`Awaiting for supported ratios on Android...`); }

        const ratios = await camera.getSupportedRatiosAsync();
        newSettings.ratio = ratios[0];

        // eslint-disable-next-line no-console
        if (!Constants.PRODUCTION) { console.log(`Supported ratios are:`, ratios); }
      }

      setSettings((oldSettings) => ({ ...oldSettings, ...newSettings }));
    })();
  }, [camera]);

  useEffect(() => {
    (async () => {
      const newSettings = {};

      if (camera) {
        // eslint-disable-next-line no-console
        if (!Constants.PRODUCTION) { console.log(`Awaiting for available picture sizes....`); }

        const pictureSizes = await camera.getAvailablePictureSizesAsync(settings.ratio);
        newSettings.pictureSizes = pictureSizes;

        // eslint-disable-next-line no-console
        if (!Constants.PRODUCTION) { console.log(`Available picture sizes are:`, pictureSizes); }
      }

      setSettings((oldSettings) => ({ ...oldSettings, ...newSettings }));
    })();
  }, [camera, settings.ratio]);

  return settings;
}
