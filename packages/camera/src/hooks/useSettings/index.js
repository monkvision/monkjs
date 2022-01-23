import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import Constants from '../../const';

export default function useSettings(initialSettings, camera) {
  const [settings, setSettings] = useState(initialSettings);

  useEffect(() => {
    (async () => {
      if (Platform.OS === 'android') {
        // eslint-disable-next-line no-console
        if (!Constants.PRODUCTION) { console.log(`Awaiting for supported ration on Android...`); }

        const ratios = await camera.getSupportedRatiosAsync();
        setSettings({ ...settings, ratio: ratios[0] });

        // eslint-disable-next-line no-console
        if (!Constants.PRODUCTION) { console.log(`Supported ratios are ${ratios}`); }
      }
    })();
  }, [camera, settings]);

  useEffect(() => {
    (async () => {
      if (camera) {
        // eslint-disable-next-line no-console
        if (!Constants.PRODUCTION) { console.log(`Awaiting for available picture sizes....`); }

        const pictureSizes = await camera.getAvailablePictureSizesAsync(settings.ratio);
        setSettings({ ...settings, pictureSizes });

        // eslint-disable-next-line no-console
        if (!Constants.PRODUCTION) { console.log(`Available picture sizes are ${pictureSizes}`); }
      }
    })();
  }, [camera, settings]);

  return settings;
}
