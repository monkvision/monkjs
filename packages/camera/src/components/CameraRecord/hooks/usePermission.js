import { useEffect, useState } from 'react';
import { Camera as ExpoCamera } from 'expo-camera';

export default function usePermission() {
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await ExpoCamera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  return hasPermission;
}
