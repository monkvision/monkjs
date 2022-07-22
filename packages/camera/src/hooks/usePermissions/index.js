import { useEffect, useState } from 'react';
import { Camera as ExpoCamera, PermissionStatus } from 'expo-camera';
import log from '../../utils/log';

/**
 * Be careful with https://github.com/expo/expo/issues/13431
 * @return {{isGranted: null, status: null}}
 */
export default function usePermissions() {
  const [state, setState] = useState({
    granted: false,
    status: PermissionStatus.UNDETERMINED,
  });

  useEffect(() => {
    (async () => {
      let permissions = await ExpoCamera.getCameraPermissionsAsync();
      if (permissions.canAskAgain && !permissions.granted) {
        try {
          permissions = await ExpoCamera.requestCameraPermissionsAsync();
        } catch (err) {
          log([`Error in \`usePermissions()\`: ${err}`], 'error');
          throw err;
        }
      }

      log(['[Event] Permission is', !permissions.granted ? 'not granted' : 'granted']);
      setState(permissions);
    })();
  }, []);

  return state;
}
