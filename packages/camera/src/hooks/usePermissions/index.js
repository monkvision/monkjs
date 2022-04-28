import { useEffect, useState } from 'react';
import { Camera as ExpoCamera } from 'expo-camera';
import { Platform } from 'react-native';
import log from '../../utils/log';

/**
 * Be careful with https://github.com/expo/expo/issues/13431
 * @return {{isGranted: null, status: null}}
 */
export default function usePermissions() {
  const [state, setState] = useState({ status: null, isGranted: null });

  useEffect(() => {
    (async () => {
      try {
        if (Platform !== 'web') {
          setState({ status: 'granted', isGranted: true });
        } else {
          const { status } = await ExpoCamera.requestCameraPermissionsAsync();
          setState({ status, isGranted: status === 'granted' });
        }
      } catch (err) {
        log([`Error in \`usePermissions()\`: ${err}`], 'error');
        throw err;
      }
    })();
  }, []);

  return state;
}
