import { useEffect, useState } from 'react';
import { Camera as ExpoCamera } from 'expo-camera';
import Constants from '../../const';

export default function usePermissions() {
  const [state, setState] = useState({ status: null, isGranted: null });

  useEffect(() => {
    (async () => {
      // eslint-disable-next-line no-console
      if (!Constants.PRODUCTION) { console.log('Awaiting camera permissions...'); }

      const { status } = await ExpoCamera.requestCameraPermissionsAsync();
      setState({ status, isGranted: status === 'granted' });

      // eslint-disable-next-line no-console
      if (!Constants.PRODUCTION) { console.log(`Camera permission set to ${status}`); }
    })();
  }, []);

  return state;
}
