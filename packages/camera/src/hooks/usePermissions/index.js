import { useEffect, useState } from 'react';
import { Camera as ExpoCamera } from 'expo-camera';
import { Platform } from 'react-native';
import Constants from '../../const';

/**
 * Be careful with https://github.com/expo/expo/issues/13431
 * @return {{isGranted: null, status: null}}
 */
export default function usePermissions() {
  const [state, setState] = useState({ status: null, isGranted: null });

  useEffect(() => {
    (async () => {
      if (Platform !== 'web') {
        setState({ status: 'granted', isGranted: true });
      } else {
        // eslint-disable-next-line no-console
        if (!Constants.PRODUCTION) { console.log('Awaiting camera permissions...'); }

        const { status } = await ExpoCamera.requestCameraPermissionsAsync();
        setState({ status, isGranted: status === 'granted' });

        // eslint-disable-next-line no-console
        if (!Constants.PRODUCTION) { console.log(`Camera permission set to ${status}`); }
      }
    })();
  }, []);

  return state;
}
