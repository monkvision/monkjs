import { useEffect, useState } from 'react';
import { Camera as ExpoCamera } from 'expo-camera';

export default function usePermissions() {
  const [state, setState] = useState({ status: null, isGranted: null });

  useEffect(() => {
    (async () => {
      const { status } = await ExpoCamera.requestCameraPermissionsAsync();
      setState({ status, isGranted: status === 'granted' });
    })();
  }, []);

  return state;
}
