import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { Camera } from 'expo-camera';
import log from '../../utils/log';

export default function useSettings({ camera, initialState = {
  quality: 1,
  ratio: '4:3',
  skipProcessing: false,
  zoom: 0,
} }) {
  const [settings, setSettings] = useState(initialState);

  useEffect(() => {
    (async () => {
      const newSettings = {};

      if (Platform.OS === 'web') {
        log([`Awaiting for available camera types...`]);

        const types = await Camera.getAvailableCameraTypesAsync();
        newSettings.type = types.find((e) => e === 'back') ? 'back' : types[0];

        log([`Available camera types are:`, types]);
      }

      setSettings((oldSettings) => ({ ...oldSettings, ...newSettings }));
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const newSettings = {};

      if (Platform.OS === 'android') {
        log([`Awaiting for supported ratios on Android...`]);

        const ratios = await camera.getSupportedRatiosAsync();
        newSettings.ratio = ratios[0];

        log([`Supported ratios are:`, ratios]);
      }

      setSettings((oldSettings) => ({ ...oldSettings, ...newSettings }));
    })();
  }, [camera]);

  useEffect(() => {
    (async () => {
      const newSettings = {};

      if (camera) {
        log([`Awaiting for available picture sizes....`]);

        const pictureSizes = await camera.getAvailablePictureSizesAsync(settings.ratio);
        newSettings.pictureSizes = pictureSizes;
        newSettings.pictureSize = pictureSizes[0];

        log([`Available picture sizes are:`, pictureSizes]);
      }

      setSettings((oldSettings) => ({ ...oldSettings, ...newSettings }));
    })();
  }, [camera, settings.ratio]);

  return settings;
}
