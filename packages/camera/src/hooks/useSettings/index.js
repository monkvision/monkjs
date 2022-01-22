import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

export default function useSettings(initialSettings, camera) {
  const [settings, setSettings] = useState(initialSettings);

  useEffect(() => {
    (async () => {
      if (Platform.OS === 'android') {
        const ratios = await camera.getSupportedRatiosAsync();
        setSettings({ ...settings, ratio: ratios[0] });
      }
    })();
  }, [camera, settings]);

  useEffect(() => {
    (async () => {
      if (camera) {
        const pictureSizes = await camera.getAvailablePictureSizesAsync(settings.ratio);
        setSettings({ ...settings, pictureSizes });
      }
    })();
  }, [camera, settings]);

  return settings;
}
