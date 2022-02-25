import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { Camera } from 'expo-camera';
import log from '../../utils/log';

export default function useSettings({ camera, initialState = {
  ratio: '4:3',
  zoom: 0,
  type: Camera.Constants.Type.back,
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
        log([`Awaiting for supported ratios and sizes on Android...`]);

        const ratios = await camera.getSupportedRatiosAsync();
        const pictureSizes = await camera.getAvailablePictureSizesAsync(ratios[0]);

        newSettings.ratio = ratios[0];
        newSettings.pictureSize = pictureSizes[0];

        log([`Supported ratios are:`, ratios]);
        log([`Supported sizes are:`, pictureSizes]);
      }

      setSettings((oldSettings) => ({ ...oldSettings, ...newSettings }));
    })();
  }, [camera]);

  return settings;
}
